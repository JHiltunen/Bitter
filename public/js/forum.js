'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const logOut = document.querySelector('#log-out');
const post = document.querySelector('#forum-post');
const section = document.querySelector('section');

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
  getPost();
});

// create post view
const createPostView = (posts) => {
  // clear article
  section.innerHTML = '';
  posts.forEach((post) => {
    // create li with DOM methods
    const article = document.createElement('article')
    article.classList.add('PostArticle')
    const card = document.createElement('div');
    card.classList.add('card')
    const title = document.createElement('h2');
    title.classList.add('title-text');
    title.innerHTML = `${post.title}`;
    
    const content = document.createElement('p');
    content.classList.add('content-text');
    content.innerHTML = `${post.content}`;

    card.appendChild(title);
    card.appendChild(content);

    if (post.image != 'No Image') {
      const img = document.createElement('img');
      img.src = url + '/thumbnails/' + post.image;
      img.alt = post.title;
      img.classList.add('resp');
      card.appendChild(img);
    }

    article.appendChild(card);
    section.appendChild(article);
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
    const response = await fetch(url + '/forum/posts', options);
    const posts = await response.json();
    createPostView(posts);
  }
  catch (e) {
    console.log(e.message);
  }
};

getPost();

const image = document.getElementById('image');
const previewContainer = document.getElementById('imagePreview');
const previewImage = document.querySelector('.image-preview-image');
const previewDefaultText = document.querySelector('.image-preview-default-text');

image.addEventListener("change", function() {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();
    previewContainer.style.display = "flex";
    previewDefaultText.style.display = "none";
    previewImage.style.display = "block";

    reader.addEventListener('load', function() {
      console.log(this);
      previewImage.setAttribute('src', this.result);
    });
    reader.readAsDataURL(file);
  } else {
    previewContainer.style.display = null;
    previewDefaultText.style.display = null;
    previewImage.style.display = null;
    previewImage.setAttribute("src", null);
  }
});


