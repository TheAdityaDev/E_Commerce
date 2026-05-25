const nodemailer = require('nodemailer');


async function sendEmail(to,subject,body) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_HOST,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: body
        }

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Failed to send email: ");
    }
}


module.exports = sendEmail;