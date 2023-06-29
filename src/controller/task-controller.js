// require taskModel
const taskModel = require('../models/task-model')

// creating a task
exports.create_task = async (req, res) => {
  let req_body = req.body
  req_body.email = req.headers['email']

  try{
    let createTask = await taskModel.create(req_body)
    res.status(200).json({
      status: "task creation success",
      data: createTask
    })
  }
  catch(error){
    req.status(200).json({
      status: "task creation failed",
      data: error
    })
  }
}

// delete a task
exports.delete_task = async (req, res) => {
  let taskId = req.params.id
  let query = {_id: taskId}

  try{
    let deleteTask = taskModel.deleteOne(query)
    res.status(200).json({
      status: "task deletion success",
      data: deleteTask
    })
  }
  catch (error) {
    req.status(200).json({
      status: "task deletion failed",
      data: error
    })
  }
}

// update a task
exports.update_task = async (req, res) => {
  let taskId = req.params.id
  let reqBody = req.body
  let query = { _id: taskId }

  try {
    let updateTask = taskModel.updateOne(query, reqBody)
    res.status(200).json({
      status: "task update success",
      data: updateTask
    })
  }
  catch (error) {
    req.status(200).json({
      status: "task update failed",
      data: error
    })
  }
}

// list tasks
exports.list_tasks = async (req, res) => {
  let task_status = req.params.status
  let email = req.headers['email']
  let query = {status: task_status, email: email}
  
  try {
    let listTask = taskModel.find(query)
    res.status(200).json({
      status: "task listing success",
      data: listTask
    })
  }
  catch (error) {
    req.status(200).json({
      status: "task listing failed",
      data: error
    })
  }
}