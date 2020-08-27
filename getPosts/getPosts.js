const fetch = require('node-fetch')

const owner_id = ''
const damain = ''

const getPosts = async (publicName, token) => {
    const response = await fetch(`https://api.vk.com/method/wall.get?&${publicName}&access_token=${token}&v=5.122`);
    const resp = await response.json()
    return resp
}
// getPosts()

module.exports = getPosts;