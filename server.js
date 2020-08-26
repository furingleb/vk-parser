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

passport.use(new VKontakteStrategy({
    clientID:     '7578715',
    clientSecret: '0hBdqSE649f4qCKYvEFR',
    callbackURL:  "http://localhost:3000/auth/vkontakte/callback"
  },
  function(accessToken, refreshToken, params, profile, done) {
    return done(null, profile);
  }
));

app.listen(3000, () => {
    console.log('Listening...');
})


//========Start========

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login',
  passport.authenticate('vkontakte'),
  function(req, res){
    // The request will be redirected to vk.com for authentication, so
    // this function will not be called.
  });

app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', { 
    failureRedirect: '/login',
    session: false
   }),
  function(req, res) {
    res.send(req.user);
    // res.render('filtres')
  });

// app.use(function(req, res, next){
//   const err = new Error('Ни хрена не найдено!');
//   err.status = 404;
//   next(err);   
// });

// app.use(function(err, req, res, next){
//   res.status(err.status || 500);
//   res.json({
//     message: err.message,
//     error: err
//   })     
// })







