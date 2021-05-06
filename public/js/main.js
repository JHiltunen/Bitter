'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const logOut = document.querySelectorAll('.log-out');
const login = document.querySelectorAll('.login');
// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
if (sessionStorage.getItem('token')) {
    login[0].style.display = 'none';
    login[1].style.display = 'none';
} else {
    logOut[0].style.display = 'none';
    logOut[1].style.display = 'none';
}

// logout
for (let i = 0; i < logOut.length; i++) {
  logOut[i].addEventListener('click', async (evt) => {
    evt.preventDefault();
    try {
      const options = {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/auth/logout', options);
      const json = await response.json();
      console.log(json);
      // remove token
      sessionStorage.removeItem('token');
      alert('You have logged out');
      location.reload();
      // show/hide login form and logout
      loginForm.style.display = 'block';
      logOut.style.display = 'none';
      window.location.href = 'index.html';
    }
    catch (e) {
      console.log(e.message);
    } 
  });
}