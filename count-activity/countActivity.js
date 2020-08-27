const fetch = require('node-fetch');

const userLikes = {};
const userComments = {};
const userPosts = {};

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
  for (const postId of postsArray) {
    await countLikesForPost(postId, token, groupId)
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
  for (const postId of postsArray) {
    await countCommentsForPost(postId, token, groupId)
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
  for (const postId of postsArray) {
    await countRepostsForPost(postId, token, groupId)
  }
  return userPosts;
}


module.exports = { countLikesAllPosts, countCommentsAllPosts, countRepostsAllPosts }