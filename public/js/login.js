'use strict';
const loginNow = document.querySelector('#login-now');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const registerNow = document.querySelector('#register-now');
const registerForm = document.querySelector('#register-form');

if (sessionStorage.getItem('token')) {
    window.location.href = url + "/forum.html";
    loginForm.style.display = 'none';
    login[0].style.display = 'none';
    login[1].style.display = 'none';
} else {
    logOut[0].style.display = 'none';
    logOut[1].style.display = 'none';
    loginForm.style.display = 'flex';
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
      logOut[0].style.display = 'none';
      logOut[1].style.display = 'none';
      window.location.href = url + "/forum.html";
    } else {
      loginError.innerHTML = JSON.stringify(json.errors);
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
      console.log('Group: ' + json.user.name);
      if (!json.user) {
        alert(json.message);
      } else {
        // save token
        sessionStorage.setItem('token', json.token);
        loginForm.style.display = 'none';
        window.location.href = url + "/forum.html";
      }
  });