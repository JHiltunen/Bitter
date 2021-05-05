'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const logOut = document.querySelector('#log-out');
const login = document.querySelector('#login-button');
const post = document.querySelector('#forum-post');
const section = document.querySelector('section');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');
const modal = document.querySelector('#editPostModal'); // Get the modal
const span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
const updatePostForm = document.querySelector('#updatePost');
const postId = document.querySelector('#postId');
const updateTitle = document.querySelector('#updateTitle');
const updateContent = document.querySelector('#updateContent');
const saveChanges = document.querySelector('#saveChanges');
const deletePost = document.querySelector('#deletePost');
let user = undefined;

const getUserId = async () => {
  try {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };

    console.log('Fetchoptions: ', fetchOptions);
    const response = await fetch(url + '/user/', fetchOptions);
    console.log(response);
    const json = await response.json();
    console.log('UserId: ', json);    
    user = json;
  } catch (e) {
    console.log('Error getting userid', e.message);
  }
}

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
if (sessionStorage.getItem('token')) {
    //loginForm.style.display = 'none';
    logOut.style.display = 'block';
    user = getUserId();
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
  if (response.status === 200) {
    document.querySelector('.post-title').value = '';
    document.querySelector('.post-content').value = '';
    document.getElementById('image').value = '';
    document.getElementById('imagePreview').value = '';
    document.getElementById('imagePreview').setAttribute('src', '')
    document.querySelector('.image-preview-image'). value = '';
    document.querySelector('.image-preview-default-text').value = '';

    previewContainer.style.display = "";
    previewDefaultText.style.display = "";
    previewImage.style.display = "";
  }
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
    card.classList.add('card');
    const title = document.createElement('h2');
    title.classList.add('title-text');
    title.innerHTML = `${post.title}`;

    const postAuthor = document.createElement('h4');
    postAuthor.classList.add('post-author');
    postAuthor.innerHTML = `${post.firstname} ${post.lastname}`;
    
    const content = document.createElement('p');
    content.classList.add('content-text');
    content.innerHTML = `${post.content}`;

    card.appendChild(title);
    card.appendChild(postAuthor);
    card.appendChild(content);

    if (post.image !== 'No Image') {
      const img = document.createElement('img');
      img.src = url + '/thumbnails/' + post.image;
      img.alt = post.title;
      img.classList.add('resp');
      card.appendChild(img);

      img.addEventListener('click', () => {
        modalImage.src = url + '/' + post.image;
        imageModal.alt = post.title;
        imageModal.classList.toggle('hide');
      });
    }

      const likes = document.createElement('span');
      likes.classList.add('likes');
      likes.innerHTML = post.likes;

      card.appendChild(likes);

      article.appendChild(card);
      section.appendChild(article);


    // div for comment section
    const commentContainer = document.createElement('div');
    const commentsList = document.createElement('div');
    commentsList.classList.add('comments');

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

    const comments = getComments(post.postId);

    comments.then((result) => {
      result.forEach(comment => {
        const commentAuthor = document.createElement('h6');
        commentAuthor.innerHTML = `${comment.firstname} ${comment.lastname}`;
        const p = document.createElement('p');
        p.innerHTML = comment.comment;

        commentsList.appendChild(commentAuthor);
        commentsList.appendChild(p);
        commentContainer.appendChild(commentsList);
      })
    });

    if (user !== undefined) {
      if (user.userId === post.userId) {
        const editIcon = document.createElement('i');
        editIcon.classList.add('fa');
        editIcon.classList.add('fa-edit');
        
        editIcon.addEventListener('click', () => {
          console.log('Edit post: ', post.postId);
          updateTitle.value = post.title;
          updateContent.value = post.content;
          postId.value = post.postId;
          modal.style.display = "block";
        });
  
        card.appendChild(editIcon);
      }
    }
    
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
        
        // if there are errors show them
        if (json.errors !== undefined) {
            errorDisplay.innerHTML = '';
            json.errors.forEach(error => errorDisplay.innerHTML += error.msg);
        } else {
          errorDisplay.innerHTML = '';
          const newComment = document.createElement('p');

          newComment.innerHTML = data.comment;
          commentContainer.appendChild(newComment);
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
close.addEventListener('click', (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle('hide');
});

const getComments = async (id) => {
  console.log("Get comments with postId: ", id);
  try {
    const response = await fetch(url + '/forum/comments/' + id);
    console.log('Response: ', response);
    return await response.json();
  }
  catch (e) {
    console.log(e.message);
  }
}

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

// handle update for edit post form
updatePostForm.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();
    const data = serializeJson(updatePostForm);
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify(data),
    };

    console.log('Fetchoptions: ', fetchOptions);
    const response = await fetch(url + '/user/update-post/' + data.postId, fetchOptions);
    console.log(response);
    const json = await response.json();
    if (response.status === 200) {
      closeModal();
      getPost();
    }
    
    
  } catch (e) {
    console.log('Error on update post', e.message);
  }
});

const closeModal = () => {
  modal.style.display = "none";
}

deletePost.addEventListener('click', async (event) => {
  const postId = document.querySelector('#postId').value;
  const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    try {
      const response = await fetch(url + '/user/delete-post/' + postId, fetchOptions);
      const json = await response.json();
      console.log('delete response', json);
      getPost();
      closeModal();
    }
    catch (e) {

    }
  });


// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    closeModal();
  }
});

// When the user clicks on <span> (x), close the modal
span.addEventListener('click', (event) => {
  closeModal();
});