const mongoose = require('mongoose')

let user_schema = mongoose.Schema({
  email: { type: String },
  password: {type: String},
  firstName: {type: String},
  lastName: {type: String}
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('users', user_schema)