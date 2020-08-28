// const { mergedResults } = require('./mergeActivity')

function convertTransform(activity) {
  const fish = {}

  for (const [category, object] of Object.entries(activity)) {
    for (const id of Object.keys(object)) {
      fish[id] = { id: 0, likes: 0, comments: 0, reposts: 0 };
    }
  }

  for (const [category, data] of Object.entries(activity)) {
    for (const [id, count] of Object.entries(data)) {
      fish[id]['id'] = id
      fish[id][category] += count
    }
  }

  const sortedArray = Object.entries(fish).sort((a, b) => {
    return (b[1].likes + b[1].comments + b[1].reposts) - (a[1].likes + a[1].comments + a[1].reposts)
  })

  const final = [];
  for (const item of sortedArray) {
    final.push(item[1])
  }

  const done = [];
  for (const [index, element] of final.entries()) {
    element['index'] = index + 1
    done.push(element)
  }

  return done.splice(0, 10);
}




// function convertTransform(activity) {
//   const merged = mergedResults([activity.likes, activity.comments])
//   const array = Object.entries(merged)

//   let sorted = array.sort((a, b) => {
//     return b[1] - a[1];
//   }).slice(0, 10);

//   sorted = sorted.map(el => {
//     return { id: el[0], count: el[1] }
//   })
//   return sorted;
// }

module.exports = { convertTransform };
