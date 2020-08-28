if(localStorage.theme === 'light'){
    console.log('light');
    body.classList.add('lightTheme')
}
if(localStorage.theme === 'dark') {
    body.classList.remove('lightTheme')
}