const fetch = require('node-fetch');

let userLikes = {};
let userComments = {};
let userPosts = {};

const time = 350

// LIKES >>>
async function countLikesForPost(postId, token, groupId) {

  const response = await fetch(`https://api.vk.com/method/likes.getList?&type=post&access_token=${token}&owner_id=${groupId}&item_id=${postId}&offset=0&v=5.122&count=1000`);
  const final = await response.json();
  const likesArray = final.response.items;

  for (const id of likesArray) {
    if (id in userLikes) {
      userLikes[id] += 1;
    } else if (!(id in userLikes)) {
      userLikes[id] = 1;
    }
  }
}

async function countLikesAllPosts(postsArray, token, groupId) {
  userLikes = {}
  let i = 0;

  // let interval = setInterval(async () => {
  //   console.log(i);
  //   console.log(token);
  //   if (i === postsArray.length - 1) clearInterval(interval);
  //   await countLikesForPost(postsArray[i], token, groupId);
  // }, 600)
  // i++;

  for (const postId of postsArray) {
    await new Promise(resolve => {
      setTimeout(() => {
        countLikesForPost(postId, token, groupId)
        resolve()
      }, time)
    })
  }
  return userLikes;
}

// COMMENTS >>>
// TODO comments for comments?
async function countCommentsForPost(postId, token, groupId) {

  const response = await fetch(`https://api.vk.com/method/wall.getComments?&owner_id=${groupId}&post_id=${postId}&need_likes=1&access_token=${token}&v=5.122&count=100`)
  const final = await response.json();
  const commentsArray = final.response.items

  for (const commentObj of commentsArray) {
    if (commentObj.from_id in userComments) {
      userComments[commentObj.from_id] += 1;
    } else if (!(commentObj.from_id in userComments)) {
      userComments[commentObj.from_id] = 1;
    }
  }
}

async function countCommentsAllPosts(postsArray, token, groupId) {
  // for (const postId of postsArray) {
  //   await countCommentsForPost(postId, token, groupId)
  // }
  userComments = {};
  for (const postId of postsArray) {
    await new Promise(resolve => {
      setTimeout(() => {
        countCommentsForPost(postId, token, groupId)
        resolve()
      }, time)
    })
  }

  return userComments;
}

// REPOSTS >>>
async function countRepostsForPost(postId, token, groupId) {
  const response = await fetch(`https://api.vk.com/method/wall.getReposts?&access_token=${token}&owner_id=${groupId}&post_id=${postId}&offset=0&v=5.122&count=1000`)
  const final = await response.json();
  const commentsArray = final.response.items

  for (const responseObj of commentsArray) {
    if (responseObj.from_id in userPosts) {
      userPosts[responseObj.from_id] += 1;
    } else if (!(responseObj.from_id in userPosts)) {
      userPosts[responseObj.from_id] = 1;
    }
  }
}

async function countRepostsAllPosts(postsArray, token, groupId) {
  userPosts = {};
  // for (const postId of postsArray) {
  //   await countRepostsForPost(postId, token, groupId)
  // }
  for (const postId of postsArray) {
    await new Promise(resolve => {
      setTimeout(() => {
        countRepostsForPost(postId, token, groupId)
        resolve()
      }, time)
    })
  }
  return userPosts;
}


module.exports = { countLikesAllPosts, countCommentsAllPosts, countRepostsAllPosts }