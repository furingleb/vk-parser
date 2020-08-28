const express = require('express');
const router = express.Router();
const { getPostsIDs, getUsers } = require('../getPosts/getPosts');
const { countAll } = require('../count-activity/count.js');
const mergedResults = require('../count-activity/mergeActivity');
const passport = require('passport')

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

    const merged = mergedResults([activity.likes, activity.comments])
    const array = Object.entries(merged)

    // const sorted = array.sort((a, b) => {
    //   a[1] - b[1]
    // })

    let sorted = array.sort((a, b) => {
        return b[1] - a[1];
    }).slice(0, 10);

    // console.log(sorted);
    // let ids = [];

    sorted = sorted.map(el => {
        return { id: el[0], count: el[1] }
    })

    console.log(sorted);

    // {
    //   user1: { id: 13123, count: 3 },
    //   user2: { id: 213231, count: 5 },
    // }


    res.render('result', { sorted })
})

module.exports = router;