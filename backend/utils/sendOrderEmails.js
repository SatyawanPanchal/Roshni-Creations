import nodemailer from "nodemailer";

export const sendOrderEmails = async ({ order, customerEmail, customerName }) => {
  // created inside the function so .env is already loaded
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // list of products as simple HTML rows
  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr>
          <td>${i.name}</td>
          <td>${i.quantity}</td>
          <td>₹${i.price * i.quantity}</td>
        </tr>`,
    )
    .join("");

  const tableHtml = `
    <table border="1" cellpadding="8" cellspacing="0">
      <tr><th>Product</th><th>Qty</th><th>Price</th></tr>
      ${itemsHtml}
    </table>
    <p>Subtotal: ₹${order.subtotal}</p>
    <p>Shipping: ${order.shipping === 0 ? "FREE" : "₹" + order.shipping}</p>
    <p><b>Total: ₹${order.totalAmount}</b></p>
  `;

  // ---------- EMAIL TO CUSTOMER ----------
  const customerMail = {
    from: `"Roshni Creations" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order Confirmed - ${order.customOrderId}`,
    html: `
      <h2>Thank you for your order, ${customerName}!</h2>
      <p>Your order <b>${order.customOrderId}</b> has been placed successfully.</p>
      ${tableHtml}

      <h3>Product Warranty</h3>
      <p>All jewellery comes with a 3-month warranty against manufacturing defects.
      Damage caused by misuse, water, perfume or chemicals is not covered.</p>

      <h3>Selling Policy</h3>
      <ul>
        <li><b>Products once sold will not be replaced.</b></li>
        <li>Please check your order carefully when it arrives.</li>
        <li>Product colour may vary slightly from the photos.</li>
        <li>For any questions, reply to this email.</li>
      </ul>

      <p>Thank you for shopping with Roshni Creations.</p>
    `,
  };

  // ---------- EMAIL TO ADMIN ----------
  const adminMail = {
    from: `"Roshni Creations" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order Placed - ${order.customOrderId}`,
    html: `
      <h2>New order received</h2>
      <p><b>Order ID:</b> ${order.customOrderId}</p>
      <p><b>Customer:</b> ${customerName} (${customerEmail})</p>
      ${tableHtml}
    `,
  };

  // send both at the same time
  await Promise.all([
    transporter.sendMail(customerMail),
    transporter.sendMail(adminMail),
  ]);
};