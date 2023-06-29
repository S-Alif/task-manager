// get models
const userModel = require('../models/user-model')
const otpModel = require('../models/otp-model')

// get mail utility
const sendEmail = require('../utility/send-email-utility')

// get packages
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({path: '../../secret.env'})


// otp markup
let otp_markup = (otpCode) => {
  let markup = `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Task-Manager</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Task-Manager. Use the following OTP to complete your Sign Up procedures</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otpCode}</h2>
    <p style="font-size:0.9em;">Regards,<br />Task-Manager</p>
    <hr style="border:none;border-top:1px solid #eee" />

  </div>
</div>
  `

  return markup
}

// user registration
exports.registration = async (req, res) => {
  try {
    let reqBody = req.body
    let new_register = await userModel.create(reqBody)
    res.status(200).json({
      status: "successfull",
      data: new_register
    })
    
  } catch (error) {
    res.status(200).json({
      status: "failed",
      data: error
    })
  }
}

// user login
exports.login = async (req, res) => {
  try{
    let reqBody = req.body
    let user_login = await userModel.find(reqBody).count('total')

    // issuing token
    if(user_login == 1){
      let payload = {
        exp: Math.floor(Date.now()/1000)+(24*60*60),
        email: req.body['email']
      }

      // sign the token
      let token = jwt.sign(payload, `${process.env.secretKey}`, {algorithm: 'HS256'});
      res.status(200).json({
        status: 'successfull',
        data: token
      })
    }
    else{
      res.status(200).json({
        status: 'failed',
        data: user_login
      })
    }
  }
  catch(error){
    res.status(200).json({
      status: 'failed',
      data: error
    })
  }
}

// profile details
exports.profile_details = async (req, res) => {
  try {
    let email = req.headers['email']
    let user = await userModel.find({email: email})
    res.status(200).json({
      status: "success",
      data: user
    })

  } catch (error) {
    res.status(200).json({
      status: "failed",
      data: error
    })
  }
}

// send otp
exports.send_otp = async (req, res) => {
  try {
    let email = req.params.email
    let otpCode = Math.floor(100000+Math.random()*900000) //creating otp

    // inserting otp to database
    await otpModel.create({email:email, otp:otpCode})
    let send_email = await sendEmail(email, otp_markup(otpCode), "Task-manager Account Verification")
    
    res.status(200).json({
      status: "successfull",
      data: send_email, email
    })

  } catch (error) {
    res.status(200).json({
      status: "failed",
      data: error
    })
  }
}

// verifying otp
exports.verify_otp = async (req, res) => {
  try {
    let email = req.params.email
    let otp = req.params.otp

    // finding the otp
    let verify = await otpModel.find({email: email, otp: otp, status: 0}).count('total')

    if(verify == 1){
      await otpModel.updateOne({ email: email, otp: otp, status: 0 }, {status: 1})  //updating otp status
      res.status(200).json({
        status: "successfull",
        data: "Verification success"
      })
    }
    else{
      res.status(200).json({
        status: "used",
        data: "OTP is already used"
      })
    }
  } catch (error) {
    res.status(200).json({
      status: "failed",
      data: error
    })
  }
}