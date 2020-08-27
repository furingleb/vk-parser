const fetch = require('node-fetch');

const token = '6d86abe678ce7524fd761b7bd8566a8d86b88f8b8174042d7b9660526102f1dee48b771ffe2b7ca98529b';
const groupId = '-117680198';
const postIds = ['20844', '20826', '20818'];

const userLikes = {};
const userComments = {};

// LIKES
async function countLikesForPost(postId) {
  const response = await fetch(`https://api.vk.com/method/likes.getList?&type=post&access_token=${token}&owner_id=${groupId}&item_id=${postId}&extended=1&offset=0&v=5.122&count=1000`);
  const final = await response.json();
  const likesArray = final.response.items;

  for (const likeObj of likesArray) {
    if (likeObj.id in userLikes) {
      userLikes[likeObj.id] += 1;
    } else if (!(likeObj.id in userLikes)) {
      userLikes[likeObj.id] = 1;
    }
  }
}

async function countLikesAllPosts(postsArray) {
  for (const postId of postsArray) {
    await countLikesForPost(postId)
  }
}

// COMMENTS
//TODO if groups comment? final.response.groups
// TODO comments for comments?
async function countCommentsForPost(postId) {
  const response = await fetch(`https://api.vk.com/method/wall.getComments?&owner_id=${groupId}&post_id=${postId}&need_likes=1&extended=1&access_token=${token}&v=5.122&count=100`)
  const final = await response.json();
  const commentsArray = final.response.profiles;

  for (const commentObj of commentsArray) {
    if (commentObj.id in userComments) {
      userComments[commentObj.id] += 1;
    } else if (!(commentObj.id in userComments)) {
      userComments[commentObj.id] = 1;
    }
  }
}

async function countCommentsAllPosts(postsArray) {
  for (const postId of postsArray) {
    await countCommentsForPost(postId)
  }
}

countLikesAllPosts(postIds).then(_ => console.log(userLikes))
countCommentsAllPosts(postIds).then(_ => console.log(userComments))
