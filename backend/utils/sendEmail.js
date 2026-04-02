import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html, text }) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || "FreelanceHub <noreply@freelancehub.com>",
    to,
    subject,
    html,
    text: text || html?.replace(/<[^>]*>/g, ""), // Strip HTML for plain text fallback
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId} → ${to}`);
  return info;
};

export default sendEmail;
