const { countLikesAllPosts, countCommentsAllPosts, countRepostsAllPosts } = require('./countActivity');

// const token = 'c9d0e768457d826914946c85968d025dfbd9801b0cefcd22d7ce9ca1a3ceb2b64fc277da7187d62a54062';
// const groupId = '-117680198';
// const postIds = ['20844', '20826', '20818'];

// const groupId = '-198233594'
// const postIds = ['1']

async function countAll(postIds, token, groupId) {
  
  const likes = await countLikesAllPosts(postIds, token, groupId)
  const comments = await countCommentsAllPosts(postIds, token, groupId)
  const reposts = await countRepostsAllPosts(postIds, token, groupId)
  return { likes, comments, reposts };
}


module.exports = { countAll }