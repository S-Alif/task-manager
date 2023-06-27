// get packages
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({path: '../../secret.env'})

module.exports = (req, res, next) => {
  let token = req.headers['token']
  jwt.verify(token, `${process.env.secretKey}`, (error, decoded) => {

    if(error){
      res.status(401).json({
        status: "Unauthorized"
      })
    }
    else{
      let email = decoded['email']
      req.headers.email = email   // passing the email into header
      next()
    }
  })
}