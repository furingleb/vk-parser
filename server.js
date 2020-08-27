require('dotenv').config()
const express = require('express')
const path = require('path');
const app = express()
const logger = require('morgan');
const session = require("express-session");
const passport = require('passport')
const VKontakteStrategy = require('passport-vkontakte').Strategy;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

passport.use(new VKontakteStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENTSECRET,
  callbackURL: "http://localhost:3000/auth/vkontakte/callback"
},
  function (accessToken, refreshToken, params, profile, done) {
    return done(null, profile);
  }
));

app.listen(process.env.PORT, () => {
  console.log('Listening...');
})


//========Start========

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/login',
  passport.authenticate('vkontakte'),
  (req, res) => {
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
  });

app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    // res.send(req.user);
    res.render('filtres')
  });

app.post('/filtres', (req, res) => {
  const regexp = /(?<=public|club)\d+/

  let link = req.body.link
  let pubName = link.split('/')[3]
  
  if(pubName.match(regexp)){
    let result = '-'+pubName.match(regexp)[0]
    console.log('if',result);
  } 
  else console.log('else',pubName);

  res.render('result')
})

//http://vk.com/public23456
//http://vk.com/club23456
//https://vk.com/4zubkov6







