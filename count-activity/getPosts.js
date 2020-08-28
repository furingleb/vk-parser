const fetch = require('node-fetch')

const getPostsIDs = async (publicName, token, count) => {
  const response = await fetch(`https://api.vk.com/method/wall.get?&${publicName}&access_token=${token}&v=5.122&count=${count}`);
  console.log(token);
  const resp = await response.json()
  // console.log(resp);
  const posts = resp.response.items;
  let postsIDs = [];
  for (let item of posts) {
    postsIDs.push(item.id)
  }
  return postsIDs
}

const getUsers = async (publicName, token, count) => {
  const response = await fetch(`https://api.vk.com/method/wall.get?&${publicName}&access_token=${token}&v=5.122&count=${count}`);
  const resp = await response.json()
  const posts = resp.response.items;
  let userPosts = { owner_id: posts[0].owner_id }
  for (let post of posts) {
    if (post.from_id in userPosts) {
      userPosts[post.from_id] += 1
    } else if (!(post.from_id in userPosts)) {
      userPosts[post.from_id] = 1
    }
  }
  return userPosts
}

module.exports = { getPostsIDs, getUsers };