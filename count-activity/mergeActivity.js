const mergedResults = (arr) => {
  const result = {};

  for (const array of arr) {
    for (const [id, count] of Object.entries(array)) {
      if (id in result) {
        result[id] += count;
      } else if (!(id in result)) {
        result[id] = count;
      }
    }
  }
  return result;
}

module.exports = { mergedResults };