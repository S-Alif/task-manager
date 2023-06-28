// get packages
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const sendEmail = async (mailto, mailText, mailSubject) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: `${process.env.mailUrl}`,
        pass: `${process.env.mailPass}`
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    let mailOption = {
      from: "Task Manager Account Verification <sagor01md@gmail.com>",
      to: mailto,
      subject: mailSubject,
      text: mailText
    }

    return await transporter.sendMail(mailOption)
  } catch (error) {
   console.log(error) 
  }
}

module.exports = sendEmail