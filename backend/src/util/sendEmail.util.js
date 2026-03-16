const nodemailer = require('nodemailer');


async function sendEmail(to,subject,body) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: body
        }

        await transporter.sendMail(mailOptions);
    } catch (error) {
        
    }
}


module.exports = sendEmail;