const User = require('./db/db')
require('dotenv').config()
const express = require('express')
const path = require('path');

// sessions and cookies
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express()
const logger = require('morgan');
const passport = require('passport')
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const { getPostsIDs, getUsers } = require('./getPosts/getPosts')
const { countAll } = require('./count-activity/count.js');
const { convertTransform } = require('./count-activity/transform.js')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//cookie parser
app.use(cookieParser());

app.use(session({
  store: new FileStore(),
  key: "user_sid",
  secret: "anything",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
})
);

passport.use(new VKontakteStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENTSECRET,
  callbackURL: "http://localhost:3000/auth/vkontakte/callback"
},

  async function (accessToken, refreshToken, params, profile, done) {
    const user = await User.findOne({ user_id: params.user_id })
    if (user) {
      await User.findOneAndUpdate({ user_id: user.user_id }, { access_token: accessToken })
    } else {
      await User.create({ user_id: params.user_id, access_token: accessToken })
    }
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
    req.session.user_id = req.user.id
    res.redirect('/filtres')
  });

app.get('/filtres', (req, res) => {
  res.render('filtres')
})

app.post('/filtres', async (req, res) => {

  const token = await User.findOne({ user_id: req.session.user_id })
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
  const postIDs = await getPostsIDs(result, token.access_token, count);
  const usersWhoMadePosts = await getUsers(result, token.access_token, count);

  const activity = await countAll(postIDs, token.access_token, usersWhoMadePosts.owner_id)

  const toRender = convertTransform(activity)
  console.log(toRender);

  res.render('result', { toRender })
})
