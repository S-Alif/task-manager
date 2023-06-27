const mongoose = require('mongoose')

let task_schema = mongoose.Schema({
  email: { type: String },
  title: { type: String },
  description: { type: String },
  status: { type: String }
}, { timestamps: true, versionKey: false })

exports.taskModel = mongoose.model('tasks', task_schema)