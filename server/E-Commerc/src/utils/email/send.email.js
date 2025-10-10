import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, message }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Your Shop" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};
