// get all the packages
const express = require('express');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')
const cors = require('cors')
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize')
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const fs = require('fs')

const app = new express()
const router = require('./src/routes/routes');
const path = require('path');
dotenv.config()

// security purpose
app.use(cors())
app.use(helmet({
  defaultSrc: ["'self'"],
  connectSrc: ["'self'", 'http://127.0.0.1:8000', 'http://localhost:8000'],
}))
app.use(mongoSanitize())
app.use(hpp())
app.use(express.json({limit : '50mb'}))
app.use(express.urlencoded({ limit: '50mb' }))

app.use(bodyParser.json())

// rate limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// connect to database
let option = { user: `${process.env.base}`, pass: `${process.env.key}`, autoIndex: true}
mongoose.connect(`${process.env.url}`, option)
  .then(res => console.log("database connection success"))
  .catch(error => console.log(error))



app.use(express.static('./public'))

// adding route
app.use("/task-manager", router);
app.use("*", (req, res) => {
  res.status(404).json({ status: "fail", data: "Not Found" })
});


// export app
module.exports = app;