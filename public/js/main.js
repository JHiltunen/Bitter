const loginForm = document.querySelector('#login-form');

// login
loginForm.addEventListener('submit', async (evt) => {
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
      // show/hide forms + cats
      loginWrapper.style.display = 'none';
      logOut.style.display = 'block';
      main.style.display = 'block';
      userInfo.innerHTML = `Hello ${json.user.name}`;
      getCat();
      getUsers();
    }
  });