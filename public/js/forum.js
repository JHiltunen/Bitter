'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const logOut = document.querySelector('#log-out');
const post = document.querySelector('#forum-post');

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
if (sessionStorage.getItem('token')) {
    //loginForm.style.display = 'none';
    logOut.style.display = 'block';
} else {
    logOut.style.display = 'none';
}

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
      logOut.style.display = 'none';
    }
    catch (e) {
      console.log(e.message);
    }
});

// submit post
post.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const pd = new FormData(post);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: pd,
  };
  const response = await fetch(url + '/user/post', fetchOptions);
  console.log(response);
  const json = await response.json();
});