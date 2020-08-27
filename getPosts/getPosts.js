const fetch = require('node-fetch')

const owner_id = ''
const damain = ''

const getPostsIDs = async (publicName, token) => {
    const response = await fetch(`https://api.vk.com/method/wall.get?&${publicName}&access_token=${token}&v=5.122`);
    const resp = await response.json()
    const posts = resp.response.items;
    let postsIDs = [];
    for (let item of posts) {
        postsIDs.push(item.id)
    }
    return postsIDs
}
// getPosts()

const getUsers = async (publicName, token) => {
    const response = await fetch(`https://api.vk.com/method/wall.get?&${publicName}&access_token=${token}&v=5.122`);
    const resp = await response.json()
    const posts = resp.response.items;
    let userPosts = {}
    for (let post of posts) {
        if (post.created_by in userPosts) {
            userPosts[post.created_by] += 1
        } else if (!(post.created_by in userPosts)) {
            userPosts[post.created_by] = 1
        }
    }
    return userPosts
}

module.exports = { getPostsIDs, getUsers };