const fetch = require('node-fetch');

const token = '0d50473f2681355889a936e3c5a29d5b38c2e98f4ae8afd897a88fa619e0293537ee4940eb2187940a336';
const groupId = '-117680198';
// const groupId = '-198233594'
// const postIds = ['1']
const postIds = ['20844', '20826', '20818'];

const userLikes = {};
const userComments = {};

// LIKES >>>
async function countLikesForPost(postId) {
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

async function countLikesAllPosts(postsArray) {
  for (const postId of postsArray) {
    await countLikesForPost(postId)
  }
}

// COMMENTS >>>
// TODO comments for comments?
async function countCommentsForPost(postId) {
  const response = await fetch(`https://api.vk.com/method/wall.getComments?&owner_id=${groupId}&post_id=${postId}&need_likes=1&access_token=${token}&v=5.122&count=100`)
  const final = await response.json();
  const commentsArray = final.response.items;

  for (const commentObj of commentsArray) {
    if (commentObj.from_id in userComments) {
      userComments[commentObj.from_id] += 1;
    } else if (!(commentObj.from_id in userComments)) {
      userComments[commentObj.from_id] = 1;
    }
  }
}

async function countCommentsAllPosts(postsArray) {
  for (const postId of postsArray) {
    await countCommentsForPost(postId)
  }
}

// REPOSTS >>>
// ???????????

countLikesAllPosts(postIds).then(_ => console.log(userLikes));
countCommentsAllPosts(postIds).then(_ => console.log(userComments));