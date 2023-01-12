const mailer = require('nodemailer');

const sendEmail = async options => {
    // 1 create a transporter
    const transporter = mailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
    })
    //2 define the mail options
    const mailOptions = {
        from: '"Kai test 👻" <foo@example.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }

    //3 actually sens the email


    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;