const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.verify()

    const info = await transporter.sendMail({
      from:    process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })

    console.log(`✅ Email sent to ${to} — MessageId: ${info.messageId}`)
    return info
  } catch (err) {
    console.error('❌ Email send error:', err.message)
    throw new Error('Failed to send email. Please check your email configuration in .env')
  }
}

module.exports = sendEmail
