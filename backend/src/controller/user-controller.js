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
  <h1>Your OTP : ${otpCode}</h1>
  `

  return markup
}

// user registration
exports.registration = async (req, res) => {
  try {
    let reqBody = req.body
    let new_register = await userModel.create(reqBody)
    res.status(200).json({
      status: "User creation successfull",
      data: new_register
    })
    
  } catch (error) {
    res.status(200).json({
      status: "User creation failed",
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
        status: 'User login succssfull',
        data: token
      })
    }
    else{
      res.status(200).json({
        status: 'User login failed',
        data: user_login
      })
    }
  }
  catch(error){
    res.status(200).json({
      status: 'User login failed',
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
      status: "OTP sending successfull",
      data: send_email, email
    })

  } catch (error) {
    res.status(200).json({
      status: "OTP sending failed",
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
        status: "success",
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