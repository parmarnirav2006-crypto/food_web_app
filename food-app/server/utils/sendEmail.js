import transporter from '../config/nodemailer.js';

const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text
  });
};

export default sendEmail;
