const fetch = require('node-fetch')
const token = require('./server')

const owner_id = ''
const damain = ''

const getPosts = async (owner_id, domain) => {
    const response = await fetch(`https://api.vk.com/method/wall.get?&owner_id=${owner_id}&domain=${domain}&access_token=${token}&v=5.122`);
    const resp = await response.json()
    return resp
    console.log(resp);
}
// getPosts()