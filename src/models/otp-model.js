const mongoose = require('mongoose')

let otp_schema = mongoose.Schema({
  email: {type: String},
  otp: {type: String},
  status: {type: Number, default: 0}
},{timestamps: true, versionKey: false})

module.exports = mongoose.model('otps', otp_schema)
