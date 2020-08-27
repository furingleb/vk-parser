
require('dotenv').config()
const express = require('express')
const path = require('path');
const app = express()
const logger = require('morgan');
const session = require("express-session");
const passport = require('passport')
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const getPosts = require('./getPosts/getPosts')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let token;

passport.use(new VKontakteStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENTSECRET,
  callbackURL: "http://localhost:3000/auth/vkontakte/callback"
},
  function (accessToken, refreshToken, params, profile, done) {
    token = accessToken;
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

app.post('/filtres', async (req, res) => {
  const regexp = /(?<=public|club)\d+/

  console.log(req.body);
  
  let pubLink = req.body.link
  let publicName = pubLink.split('/')[3]
  
  if(publicName.match(regexp)){
    let result = '-'+publicName.match(regexp)[0]
    console.log(result);
  } 
  else console.log(publicName);
  res.render('result')
})


