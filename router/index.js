const express = require('express');
const router = express.Router();
const { getPostsIDs, getUsers } = require('../count-activity/getPosts');
const { countAll } = require('../count-activity/count.js');
const passport = require('passport')
const { convertTransform } = require('../count-activity/transform.js')

router.get('/', (req, res) => {
  res.render('home')
})

router.get('/filtres', (req, res) => {
  res.render('filtres')
})

router.post('/filtres', async (req, res) => {
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
  const postIDs = await getPostsIDs(result, req.user.accessToken, count);
  const usersWhoMadePosts = await getUsers(result, req.user.accessToken, count);

  const activity = await countAll(postIDs, req.user.accessToken, usersWhoMadePosts.owner_id)

  const toRender = convertTransform(activity)

  res.render('result', { toRender, likes, comments, reposts })
})

module.exports = router;