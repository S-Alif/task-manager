// get packages
const express = require('express')

// get controllers and middlewares
const userController = require('../controller/user-controller')
const taskController = require('../controller/task-controller')
const authVerification = require('../middleware/authentication-verification')

// get router
const router = express.Router()

// routes before login
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/send-otp/:email', userController.send_otp)
router.get('/verify-otp/:email/:otp', userController.verify_otp)

// routes after login
router.get('/profile-details', authVerification, userController.profile_details)

// routes for controling tasks
router.post('/create-task', authVerification, taskController.create_task)
router.get('/delete-task/:id', authVerification, taskController.delete_task)
router.post('/update-task/:id', authVerification, taskController.update_task)
router.get('/list-task/:status', authVerification, taskController.list_tasks)

module.exports = router