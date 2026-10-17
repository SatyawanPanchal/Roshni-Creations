import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import { calculateCartSummary } from "../utils/cartUtils.js";

// ============================================================
// GET CART
// ============================================================

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await cartModel.findOne({ userId }).populate({
      path: "items.productId",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    // No cart yet
    if (!cart) {
      return res.status(200).json({
        success: true,

        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },

        orderSummary: {
          totalItems: 0,
          subtotal: 0,
          discount: 0,
          tax: 0,
          shipping: 0,
          total: 0,
        },
      });
    }

    // --------------------------------------------------------
    // Remove products that no longer exist
    // --------------------------------------------------------

    cart.items = cart.items.filter((item) => item.productId);

    // --------------------------------------------------------
    // Refresh prices from current product data
    // --------------------------------------------------------

    cart.items.forEach((item) => {
      if (item.productId) {
        item.price = item.productId.price;
      }
    });

    // --------------------------------------------------------
    // Calculate totals
    // --------------------------------------------------------

    const summary = calculateCartSummary(cart.items);

    cart.totalItems = summary.totalItems;
    cart.totalPrice = summary.subtotal;

    await cart.save();

    return res.status(200).json({
      success: true,
      cart,

      orderSummary: summary,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching cart",
    });
  }
};

// ============================================================
// ADD TO CART
// ============================================================

const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const qty = Number(quantity);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Prevent adding unavailable products
    if (product.availability === "out-of-stock") {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // --------------------------------------------------------
    // Check stock for in-stock products
    // --------------------------------------------------------

    if (product.availability === "in-stock" && qty > product.stockLeft) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockLeft} item(s) available`,
      });
    }

    // --------------------------------------------------------
    // Find user's cart
    // --------------------------------------------------------

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [],
      });
    }

    // --------------------------------------------------------
    // Check if product already exists
    // --------------------------------------------------------

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (itemIndex !== -1) {
      const newQuantity = cart.items[itemIndex].quantity + qty;

      // Check stock after adding quantity
      if (
        product.availability === "in-stock" &&
        newQuantity > product.stockLeft
      ) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockLeft} item(s) available`,
        });
      }

      cart.items[itemIndex].quantity = newQuantity;

      // Always use current database price
      cart.items[itemIndex].price = product.price;
    } else {
      cart.items.push({
        productId: product._id,
        quantity: qty,
        price: product.price,
      });
    }

    // --------------------------------------------------------
    // Calculate totals
    // --------------------------------------------------------

    const summary = calculateCartSummary(cart.items);

    cart.totalItems = summary.totalItems;
    cart.totalPrice = summary.subtotal;

    await cart.save();

    // --------------------------------------------------------
    // Return populated cart
    // --------------------------------------------------------

    const updatedCart = await cartModel.findOne({ userId }).populate({
      path: "items.productId",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart",

      cart: updatedCart,

      orderSummary: summary,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error adding product to cart",
    });
  }
};

// ============================================================
// UPDATE CART QUANTITY
// ============================================================

const updateCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const qty = Number(quantity);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    // Set exact quantity
    cart.items[itemIndex].quantity = qty;

    // Recalculate totals
    let totalItems = 0;
    let totalPrice = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.price;
    });

    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;

    await cart.save();

    const updatedCart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    // const shipping = totalPrice > 999 ? 0 : 80;
    const shipping = 0;
    const grandTotal = totalPrice + shipping;

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: updatedCart,
      orderSummary: {
        totalItems,
        subtotal: totalPrice,
        shipping,
        grandTotal,
      },
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating cart",
    });
  }
};

// ============================================================
// REMOVE CART ITEM
// ============================================================

const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId } = req.params;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // --------------------------------------------------------
    // Check item exists
    // --------------------------------------------------------

    const itemExists = cart.items.some(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // --------------------------------------------------------
    // Remove item
    // --------------------------------------------------------

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString(),
    );

    // --------------------------------------------------------
    // Calculate totals
    // --------------------------------------------------------

    const summary = calculateCartSummary(cart.items);

    cart.totalItems = summary.totalItems;
    cart.totalPrice = summary.subtotal;

    await cart.save();

    // --------------------------------------------------------
    // Populate updated cart
    // --------------------------------------------------------

    const updatedCart = await cartModel.findOne({ userId }).populate({
      path: "items.productId",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",

      cart: updatedCart,

      orderSummary: summary,
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error removing item from cart",
    });
  }
};

// ============================================================
// CLEAR CART
// ============================================================

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await cartModel.findOne({ userId });

    // If cart doesn't exist, create empty cart
    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    } else {
      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;

      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",

      cart,

      orderSummary: {
        totalItems: 0,
        subtotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      },
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error clearing cart",
    });
  }
};

export { getCart, addToCart, updateCart, removeCartItem, clearCart };
