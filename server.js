const express = require('express')
const path = require('path');
const app = express()
const logger = require('morgan');
const session = require("express-session");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Listening...');
})

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')
})