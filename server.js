
require('dotenv').config()
const express = require('express')
const path = require('path');
const app = express()
const logger = require('morgan');
const session = require("express-session");
const passport = require('passport')
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const { getPostsIDs, getUsers } = require('./getPosts/getPosts')
const { countAll } = require('./count-activity/count.js')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

passport.use(new VKontakteStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENTSECRET,
  callbackURL: "http://localhost:3000/auth/vkontakte/callback"
},
  function (accessToken, refreshToken, params, profile, done) {
    app.locals.token = accessToken;
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
    res.redirect('/filtres')
  });

app.get('/filtres', (req, res) => {
  res.render('filtres')
})

app.post('/filtres', async (req, res) => {
  const regexp = /(?<=public|club)\d+/;
  const { link, likes, reposts, comments, count } = req.body;
  let pubName = link.split('/')[3]
  let result;
  if (pubName.match(regexp)) {
    result = 'owner_id=' + '-' + pubName.match(regexp)[0]
  }
  else {
    result = 'domain=' + pubName
  }
  const postIDs = await getPostsIDs(result, app.locals.token, count);
  const usersWhoMadePosts = await getUsers(result, app.locals.token, count);

  const activity = await countAll(postIDs, app.locals.token, usersWhoMadePosts.owner_id)
  console.log(activity);
  res.render('result')
})


