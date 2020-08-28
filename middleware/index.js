module.exports = (app) => {
  const indexRouter = require('../router/index');
  const path = require('path');
  const express = require('express')
  // sessions and cookies
  const session = require('express-session');
  const FileStore = require('session-file-store')(session);
  const logger = require('morgan');
  const passport = require('passport')
  const VKontakteStrategy = require('passport-vkontakte').Strategy;

  passport.use(new VKontakteStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: `${process.env.URL}/auth/vkontakte/callback`
  },

    async function (accessToken, refreshToken, params, profile, done) {
      return done(null, { accessToken, profile });
    }
  ));

  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'hbs');

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(logger('dev'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));


  app.use(session({
    store: new FileStore(),
    // key: "user_sid",
    secret: "anything",
    resave: false,
    saveUninitialized: false,
  })
  );

  app.use(passport.initialize())
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, { accessToken: user.accessToken, user: user.profile });
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  app.use('/', indexRouter);

  app.get('/login',
    passport.authenticate('vkontakte'),
    (req, res) => {
      // The request will be redirected to vk.com for authentication, so
      // this function will not be called.
    });

  app.get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', {
      failureRedirect: '/login'
      // session: false
    }),
    (req, res) => {
      res.redirect('/filtres')
    });
}