const body =document.querySelector('.text-center')
const lightThemeBtn = document.getElementById('btn-light')

lightThemeBtn.addEventListener('click', () => { 

    if(localStorage.theme === 'light'){
        console.log('light');
        body.classList.remove('lightTheme')
        localStorage.setItem('theme', 'dark')
    } 
    else if (localStorage.theme === 'dark') {
        body.classList.add('lightTheme')
        localStorage.setItem('theme', 'light')
    } 
    else {
        body.classList.add('lightTheme')
        localStorage.setItem('theme', 'light')
    }
})

if(localStorage.theme === 'light'){
    console.log('light');
    body.classList.add('lightTheme')
    
}
if(localStorage.theme === 'dark') {
    body.classList.remove('lightTheme')
}
