// get packages
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config({path:'./secret-pass.env'})

exports.sendEmail = async (mailto, mailText, mailSubject) => {
  let transporter = nodemailer.createTransport({
    host: 'mail.teamrabbil.com',
    port: 25,
    secure: false,
    auth:{
      user: "info@teamrabbil.com",
      pass: `${process.env.password}`
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  let mailOption = {
    from: "Task Manager MERN3<info@teamrabbil.com>",
    to: mailto,
    subject: mailSubject,
    text: mailText
  }

  return await transporter.sendMail(mailOption)
}