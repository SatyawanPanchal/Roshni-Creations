import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Roshni Creations" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationOTP = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: "Verify your Roshni Creations account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2 style="color: #800020;">
          Welcome to Roshni Creations
        </h2>

        <p>
          Thank you for creating your account.
        </p>

        <p>
          Your email verification OTP is:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 25px 0;
          color: #800020;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not create this account, you can safely ignore this email.
        </p>

        <p style="margin-top: 30px;">
          Regards,<br />
          <strong>Roshni Creations</strong>
        </p>
      </div>
    `,
  });
};

export const sendPasswordResetOTP = async (email, otp) => {
  await sendEmail({
    to: email,
    subject: "Password reset OTP - Roshni Creations",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2 style="color: #800020;">
          Password Reset
        </h2>

        <p>
          We received a request to reset your Roshni Creations account password.
        </p>

        <p>
          Your password reset OTP is:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 25px 0;
          color: #800020;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, please ignore this email.
        </p>

        <p style="margin-top: 30px;">
          Regards,<br />
          <strong>Roshni Creations</strong>
        </p>
      </div>
    `,
  });
};