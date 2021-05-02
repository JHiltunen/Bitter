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
    card.setAttribute('id', post.postId);
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

    // div for comment section
    const commentContainer = document.createElement('div');

    // write a new comment form
    const commentForm = document.createElement('form');
    commentForm.setAttribute('method', 'POST');
    commentForm.setAttribute('action', '/user/postComment');
    commentForm.setAttribute('class', 'commentForm');
    commentForm.setAttribute('enctype', 'multipart/form-data');

    // create textinput where user can write comment
    const commentInput = document.createElement('input');
    commentInput.setAttribute('type', 'text');
    commentInput.setAttribute('name', 'comment');
    commentInput.setAttribute('class', 'commentInput');

    // create submit button for the form
    const submitCommentFormButton = document.createElement('button');
    submitCommentFormButton.setAttribute('type', 'submit');
    submitCommentFormButton.innerText = 'Post comment';

    // create hidden element for postid
    const hiddenId = document.createElement('input');
    hiddenId.setAttribute('type', 'hidden');
    hiddenId.setAttribute('value', post.postId);
    hiddenId.setAttribute('name', 'postId');

    // create error field
    const errorDisplay = document.createElement('span');
    errorDisplay.classList.add('error');

    // add elements to form
    commentForm.appendChild(commentInput);
    commentForm.appendChild(hiddenId);
    commentForm.appendChild(submitCommentFormButton);
    commentForm.appendChild(errorDisplay);

    commentForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        console.log('Form object: ', commentForm);
        const data = serializeJson(commentForm);
        const fetchOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
          body: JSON.stringify(data),
        };

        console.log('Fetchoptions: ', fetchOptions);

        const response = await fetch(url + '/user/postComment', fetchOptions);
        console.log('Response:', response);
        const json = await response.json();
        
        // if there are erros show them
        if (json.errors !== undefined || json.errors.length !== 0) {
            errorDisplay.innerHTML = '';
            json.errors.forEach(error => errorDisplay.innerHTML += error.msg);
        } else {
          errorDisplay.innerHTML = '';
        }
      } catch (e) {
        console.log('Error on commentForm submit: ', e.message);
      }
    });

    // add comment form below post
    commentContainer.appendChild(commentForm);

    card.appendChild(commentContainer);
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
    previewContainer.style.display = "";
    previewDefaultText.style.display = "";
    previewImage.style.display = "";
    previewImage.setAttribute("src", "");
  }
});


