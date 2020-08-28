const table = document.getElementById('table');

if (localStorage.theme === 'light') {
  console.log('light');
  body.classList.add('lightTheme')
  table.classList.add('table-dark')
}
if (localStorage.theme === 'dark') {
  body.classList.remove('lightTheme')
  table.classList.remove('table-dark')
}