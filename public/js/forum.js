'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const logOut = document.querySelector('#log-out');
const post = document.querySelector('#forum-post');
const article = document.querySelector('article');

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

// create post view
const createPostView = (posts) => {
  // clear article
  article.innerHTML = '';
  posts.forEach((post) => {
    // create li with DOM methods


    // open large image when clicking image
    img.addEventListener('click', () => {
      modalImage.src = url + '/' + post.image;
      imageModal.alt = post.title;
      imageModal.classList.toggle('hide');
    });

    const article = document.createElement('article');
    const titles = document.createElement('div');
    titles.classList.add('titles')
    const flex = document.createElement('div');
    flex.classList.add('flex')
    const card = document.createElement('div');
    card.classList.add('card')
    const title = document.createElement('h2');
    title.innerHTML = `${post.title}`;
    
    const content = document.createElement('p');
    content.innerHTML = `${post.content}`;

    const img = document.createElement('img');
    img.src = url + post.image;
    img.alt = post.title;
    img.classList.add('resp');
    
    const articleDiv = document.createElement('div');
    
    articleDiv.appendChild(article);
    articleDiv.appendChild(titles);
    articleDiv.appendChild(flex);
    articleDiv.appendChild(card);
    articleDiv.appendChild(title);
    articleDiv.appendChild(content);
    articleDiv.appendChild(img);
    article.appendChild(articleDiv);
  });
};


const getPost = async () => {
  console.log('getPost? token ', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/posts', options);
    const posts = await response.json();
    createPostView(posts);
  }
  catch (e) {
    console.log(e.message);
  }
};

getPost();