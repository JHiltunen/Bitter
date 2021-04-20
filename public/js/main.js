'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const loginNow = document.querySelector('#login-now');
const loginForm = document.querySelector('#login-form');
const logOut = document.querySelector('#log-out');
const registerNow = document.querySelector('#register-now');
const registerForm = document.querySelector('#register-form');

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
if (sessionStorage.getItem('token')) {
    loginForm.style.display = 'none';
    logOut.style.display = 'block';
} else {
    logOut.style.display = 'none';
    loginForm.style.display = 'flex';
}

function checkIfLoggedIn() {
  
}

registerNow.addEventListener('click', showRegistration);
loginNow.addEventListener('click', showLogin);

function showLogin() {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
}

function showRegistration() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
}

// submit register form
registerForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(registerForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  console.log('user add response', json);
  if (json.errors === undefined || json.errors.length == 0) {
    // save token
    sessionStorage.setItem('token', json.token);
    logOut.style.display = 'block';
    window.location.href = url + "/forum.html";
  }
});

// login
loginForm.addEventListener('submit', async (evt) => {
    console.log("LOGGEDIN");
    evt.preventDefault();
    const data = serializeJson(loginForm);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  
    const response = await fetch(url + '/auth/login', fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    if (!json.user) {
      alert(json.message);
    } else {
      // save token
      sessionStorage.setItem('token', json.token);
      loginForm.style.display = 'none';
      window.location.href = url + "/forum.html";
    }
});

// logout
logOut.addEventListener('click', async (evt) => {
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
      // show/hide login form and logout
      loginForm.style.display = 'block';
      logOut.style.display = 'none';
      window.location.href = 'index.html';
    }
    catch (e) {
      console.log(e.message);
    }
});