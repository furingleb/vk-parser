require('dotenv').config()
const User = require('./db/db')
const express = require('express')
const userMiddleware = require('./middleware/index');
const app = express()
app.listen(process.env.PORT, () => {
  console.log('Listening...');
})
