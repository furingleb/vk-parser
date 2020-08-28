require('dotenv').config()
const express = require('express')
const userMiddleware = require('./middleware');
const app = express()

userMiddleware(app);

app.listen(process.env.PORT, () => {
  console.log('Listening...');
})
