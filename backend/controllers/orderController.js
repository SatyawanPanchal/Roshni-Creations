import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Address from "../models/addressModel.js";
import productModel from "../models/productModel.js";
import crypto from "crypto"; //for verifying rzp payment

import Razorpay from "razorpay";
import { sendOrderEmails } from "../utils/sendOrderEmails.js";

// razorpay instance created, for authentication with razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// controller to create order for request to razorpay server, this will return an order id which will be used for making request to different apis

export const createOrderAtRzp = async (req, res) => {
  const { totalPrice } = req.body;
  console.log("total price", totalPrice);
  try {
    const createdOrder = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
    });
    console.log(createdOrder);

    res.json({
      success: true,
      message: "order created successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.log("error at rzp order creation", error);
    res.json({
      success: false,
      message: "some error occurred",
      error: error.message,
    });
  }
};

// order verification controller for rzp
export const verifyOrderAtRzp = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    console.log(
      "received from frontend",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.json({
        success: false,
        message: "Missing Payment Details from Server",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("signature generated", generatedSignature);

    const isValid = generatedSignature === razorpay_signature;
    console.log("is valid", isValid);

    if (!isValid) {
      return res.json({
        success: false,
        message: "Invalid Payment",
      });
    }

    res.json({
      success: true,
      message: "Payment Verified Successfully!",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "something happened", error });
  }
};

// Short order ID
const generateOrderId = async () => {
  let id;
  do {
    id = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  } while (await Order.exists({ customOrderId: id }));
  return id;
};

/* =====================================================
   CREATE ORDER
   ===================================================== */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId, paymentStatus } = req.body;

    // Validate address
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ---------- 1. Reduce stock FIRST (cart still has items) ----------
    const reduced = [];

    for (const item of cart.items) {
      const product = item.productId;

      // made-to-order products have no stock to reduce
      if (product.availability === "made-to-order") continue;

      const updated = await productModel.findOneAndUpdate(
        { _id: product._id, stockLeft: { $gte: item.quantity } },
        { $inc: { stockLeft: -item.quantity } },
        { new: true },
      );

      if (!updated) {
        // Not enough stock, so undo what was already reduced
        for (const r of reduced) {
          await productModel.findByIdAndUpdate(r.id, {
            $inc: { stockLeft: r.qty },
            availability: "in-stock",
          });
        }

        return res.status(400).json({
          success: false,
          message: `"${product.name}" does not have enough stock`,
        });
      }

      // Stock hit zero, so mark out of stock
      if (updated.stockLeft === 0) {
        updated.availability = "out-of-stock";
        await updated.save();
      }

      reduced.push({ id: product._id, qty: item.quantity });
    }

    // ---------- 2. Create the order ----------
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      image: item.productId.image || item.productId.images?.[0] || "",
      quantity: item.quantity,
      price: item.price,
    }));

    const subtotal = cart.totalPrice;
    const shipping = subtotal > 999 ? 0 : 100;
    const totalAmount = subtotal + shipping;

    const customOrderId = await generateOrderId();

    const order = await Order.create({
      customOrderId,
      userId,
      items: orderItems,
      addressId,
      subtotal,
      shipping,
      totalAmount,
      paymentMethod: "ONLINE",
      paymentStatus: paymentStatus,
      orderStatus: "Pending",
    });

    // ---------- 3. Clear the cart LAST ----------
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    // Return populated order
    const populatedOrder = await Order.findById(order._id)
      .populate("addressId")
      .populate("items.productId");

    // ---------- 4. Send emails (order still succeeds if this fails) ----------
    try {
      await sendOrderEmails({
        order: populatedOrder,
        customerEmail: req.user.email,
        customerName: address.firstName || req.user.firstName || "Customer",
      });
    } catch (emailError) {
      console.error("Order email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

/* =====================================================
   GET MY ORDERS
   ===================================================== */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate("addressId")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/* =====================================================
   GET ALL ORDERS - ADMIN
   ===================================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName lastName email phone")
      .populate("addressId")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

/* =====================================================
   GET SINGLE ORDER
   ===================================================== */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({
      _id: id,
      userId,
    })
      .populate("addressId")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const getOrderByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId", "firstName lastName email phone")
      .populate("addressId")
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order (admin) error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, courier, trackingNumber } = req.body;

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Shipped") {
      if (courier !== undefined) order.courier = courier;
      if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "firstName lastName email phone")
      .populate("addressId")
      .populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

export const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId } = req.body;

    const validStatuses = ["Pending", "Paid", "Failed", "Refunded"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = paymentStatus;
    if (transactionId !== undefined) order.transactionId = transactionId;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the order first
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 2. Check whether it can be cancelled
    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "A delivered order cannot be cancelled",
      });
    }

    // 3. Restore stock
    for (const item of order.items) {
      const product = await productModel.findById(item.productId);
      if (!product || product.availability === "made-to-order") continue;

      product.stockLeft += item.quantity;
      product.availability = "in-stock";
      await product.save();
    }

    // 4. Mark cancelled
    order.orderStatus = "Cancelled";

    // If it was already paid, mark it Refunded here as a starting
    // point. Wire up your actual Razorpay refund call before
    // relying on this in production.
    if (order.paymentStatus === "Paid") {
      order.paymentStatus = "Refunded";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};
