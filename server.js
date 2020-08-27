
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
  
  let link = req.body.link
  let pubName = link.split('/')[3]
  
  if(pubName.match(regexp)){
    let result = '-'+pubName.match(regexp)[0]
    console.log(result);
  } 
  else console.log(pubName);

  const { link, likes, reposts, comments } = req.body
  let pubName = link.split('/')[3]
  let result
  if (pubName.match(regexp)) {
    result = 'owner_id=' + '-' + pubName.match(regexp)[0]
    // console.log('if', result);
  }
  else {
    result = 'domain=' + pubName
    // console.log('else', pubName);
  }
  const posts = await getPosts(result, token);
  let postsIDs = [];
  let usersIDs = [];
  for (let item of posts.response.items) {
    postsIDs.push(item.id)
    usersIDs.push(item.created_by);

  }


  console.log('postsIDs', postsIDs);
  console.log('usersIDs', usersIDs);
  console.log(likes, reposts, comments);
  res.render('result')
})


