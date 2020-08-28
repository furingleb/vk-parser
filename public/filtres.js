const form = document.forms[0];
const progressMain = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
// const dynamicContainer = document.getElementById('dynamic-container');
const analyze = document.getElementById('analyze');

form.addEventListener('submit', (e) => {
  const count = form.count.value
  // const seconds = Math.ceil(Math.ceil(count * 3 * 350) / 1000);

  let width = 0;

  form.style.visibility = 'hidden';
  progressMain.style.visibility = 'visible';
  analyze.style.visibility = 'visible';

  let interval = setInterval(move, 500);

  function move() {
    if (width >= 100) {
      clearInterval(interval);
    } else {
      width += 100 / (count * 2);
      progressBar.style.width = width + '%';
    }
  }
})