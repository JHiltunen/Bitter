'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const logOut = document.querySelectorAll('.log-out');
const login = document.querySelectorAll('.login');
const mostLiked = document.querySelector('#most-liked');
const mostCommented = document.querySelector('#most-commented');
const getAll = document.querySelector('#getAll');
const forumArticle = document.querySelector('.forumArticle');
const post = document.querySelector('#forum-post');
const section = document.querySelector('.post-article');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');
const modal = document.querySelector('#editPostModal'); // Get the modal
const span = document.getElementsByClassName('close')[0]; // Get the <span> element that closes the modal
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
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
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
};

mostLiked.addEventListener('click', () => {
  getPost('/forum/posts/mostliked');
});

mostCommented.addEventListener('click', () => {
  getPost('/forum/posts/mostcommented');
});

getAll.addEventListener('click', () => {
  getPost('/forum/posts/');
});

// when app starts, check if token exists and hide login form, show logout button and main content, get cats and users
if (sessionStorage.getItem('token')) {
  login[0].style.display = 'none';
  login[1].style.display = 'none';

  user = getUserId();

  post.style.display = 'block';

  // submit post
  post.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const pd = new FormData(post);
    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: pd,
    };
    const response = await fetch(url + '/forum/post', fetchOptions);
    console.log(response);
    const json = await response.json();
    if (response.status === 200) {
      document.querySelector('.post-title').value = '';
      document.querySelector('.post-content').value = '';
      document.getElementById('image').value = '';
      document.getElementById('imagePreview').value = '';
      document.getElementById('imagePreview').setAttribute('src', '');
      document.querySelector('.image-preview-image').value = '';
      document.querySelector('.image-preview-default-text').value = '';

      previewContainer.style.display = '';
      previewDefaultText.style.display = '';
      previewImage.style.display = '';
    }
    getPost('/forum/posts/');
  });
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
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
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
      logOut.style.display = 'none';
    } catch (e) {
      console.log(e.message);
    }
  });
}

/** Post View **/
// create post view
const createPostView = async (posts) => {
  section.innerHTML = '';
  console.log("Posts: ", posts);
  posts.forEach((post) => {
    const article = document.createElement('article');
    article.classList.add('PostArticle');
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

    const likeIcon = document.createElement('i');
    likeIcon.classList.add('fa');
    likeIcon.classList.add('fa-thumbs-o-up');

    const dislikes = document.createElement('span');
    dislikes.classList.add('dislikes');
    dislikes.innerHTML = post.dislikes;

    const dislikeIcon = document.createElement('i');
    dislikeIcon.classList.add('fa');
    dislikeIcon.classList.add('fa-thumbs-o-down');

    // div for comment section
    const commentContainer = document.createElement('div');
    const commentsList = document.createElement('div');
    commentsList.classList.add('comments');

    // add like icon and number of likes to post
    card.appendChild(likes);
    card.appendChild(likeIcon);
    card.appendChild(dislikes);
    card.appendChild(dislikeIcon);

    if (sessionStorage.getItem('token')) {
      console.log('User: ', user);
      
      if (post.userId === user.userId) {
        const editIcon = document.createElement('i');
        editIcon.classList.add('fa');
        editIcon.classList.add('fa-edit');

        editIcon.addEventListener('click', () => {
          console.log('Edit post: ', post.postId);
          updateTitle.value = post.title;
          updateContent.value = post.content;
          postId.value = post.postId;
          modal.style.display = 'block';
        });

        card.appendChild(editIcon);
      }

      if (post.userLiked !== null && post.userLiked.includes(user.userId)) {
        likeIcon.classList.remove('fa-thumbs-o-up');
        likeIcon.classList.add('fa-thumbs-up');
      }

      if (post.userDisliked !== null && post.userDisliked.includes(user.userId)) {
        dislikeIcon.classList.remove('fa-thumbs-o-down');
        dislikeIcon.classList.add('fa-thumbs-down');
      }

      likeIcon.addEventListener('click', async (event) => {
        event.preventDefault();
        console.log(event);
        // add like
        if (likeIcon.classList.contains('fa-thumbs-o-up')) {
          try {
            const data = {
              postId: post.postId,
              userId: user.userId,
              liked: true,
            };
            const fetchOptions = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
              },
              body: JSON.stringify(data),
            };
            console.log('Fetchoptions: ', fetchOptions);

            const response = await fetch(
              url + '/forum/post/' + post.postId + '/likes/',
              fetchOptions
            );
            console.log('Response:', response);
            const json = await response.json();
            console.log('Response: ', json);

            if (response.status == 200) {
              likeIcon.classList.remove('fa-thumbs-o-up');
              likeIcon.classList.add('fa-thumbs-up');
              await getPost('/forum/posts');
            }
          } catch (e) {
            console.log('Error on addLike submit: ', e.message);
          }
          return;
        } else if (likeIcon.classList.contains('fa-thumbs-up')) {
          try {
            const data = { postId: post.postId, userId: user.userId };
            const fetchOptions = {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
              },
              body: JSON.stringify(data),
            };
            console.log('Fetchoptions: ', fetchOptions);

            const response = await fetch(
              url + '/forum/post/' + post.postId + '/likes/',
              fetchOptions
            );
            console.log('Response:', response);
            const json = await response.json();
            console.log('Response: ', json);

            if (response.status == 200) {
              likeIcon.classList.remove('fa-thumbs-up');
              likeIcon.classList.add('fa-thumbs-o-up');
              await getPost('/forum/posts');
            }
          } catch (e) {
            console.log('Error on addLike submit: ', e.message);
          }
          return;
        }
        return;
      });

      dislikeIcon.addEventListener('click', async (event) => {
        event.preventDefault();
        // add dislike
        if (dislikeIcon.classList.contains('fa-thumbs-o-down')) {
          try {
            const data = { postId: post.postId, userId: user.userId };
            const fetchOptions = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
              },
              body: JSON.stringify(data),
            };
            console.log('Fetchoptions: ', fetchOptions);

            const response = await fetch(
              url + '/forum/post/' + post.postId + '/dislikes/',
              fetchOptions
            );
            console.log('Response:', response);
            const json = await response.json();
            console.log('Response: ', json);

            if (response.status == 200) {
              dislikeIcon.classList.remove('fa-thumbs-o-down');
              dislikeIcon.classList.add('fa-thumbs-down');
              await getPost('/forum/posts/');
            }
          } catch (e) {
            console.log('Error on addLike submit: ', e.message);
          }
          return;
        } else if (dislikeIcon.classList.contains('fa-thumbs-down')) {
          try {
            const data = { postId: post.postId, userId: user.userId };
            const fetchOptions = {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
              },
              body: JSON.stringify(data),
            };
            console.log('Fetchoptions: ', fetchOptions);

            const response = await fetch(
              url + '/forum/post/' + post.postId + '/dislikes/',
              fetchOptions
            );
            console.log('Response:', response);
            const json = await response.json();
            console.log('Response: ', json);

            if (response.status == 200) {
              dislikeIcon.classList.remove('fa-thumbs-down');
              dislikeIcon.classList.add('fa-thumbs-o-down');
              await getPost('/forum/posts/');
            }
          } catch (e) {
            console.log('Error on addLike submit: ', e.message);
          }
          return;
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
              Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
            body: JSON.stringify(data),
          };

          console.log('Fetchoptions: ', fetchOptions);
          const response = await fetch(
            url + '/forum/post/:id' + data.postId,
            fetchOptions
          );
          console.log(response);
          const json = await response.json();
          if (response.status === 200) {
            await getPost('/forum/posts');
            closeModal();
          }
        } catch (e) {
          console.log('Error on update post', e.message);
        }
      });

      deletePost.addEventListener('click', async (event) => {
        const fetchOptions = {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        try {
          const response = await fetch(
            url + '/forum/post/' + postId.value,
            fetchOptions
          );
          const json = await response.json();
          console.log("delete response", json);
          closeModal();
          getPost('/forum/posts');
        } catch (e) {
          console.log(e.message);
        }
      });

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
      submitCommentFormButton.classList.add('postCommentButton');
      submitCommentFormButton.setAttribute('type', 'submit');
      submitCommentFormButton.innerText = 'Post';


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
              Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
            body: JSON.stringify(data),
          };

          console.log('Fetchoptions: ', fetchOptions);

          const response = await fetch(
            url + '/forum/postComment',
            fetchOptions
          );
          console.log('Response:', response);
          const json = await response.json();

          // if there are erros show them
          if (json.errors !== undefined) {
            errorDisplay.innerHTML = '';
            json.errors.forEach(
              (error) => (errorDisplay.innerHTML += error.msg)
            );
          } else {
            errorDisplay.innerHTML = '';
            await getPost('/forum/posts/')
          }
        } catch (e) {
          console.log('Error on commentForm submit: ', e.message);
        }
      });
      // add comment form below post
      commentContainer.appendChild(commentForm);
    } // loggedin ends

    // get comments for specific post
    // loop trough comments and create elements for them
    getComments(post.postId).then((result) => {
      result.forEach((comment) => {
        const commentAuthor = document.createElement('h6');
        commentAuthor.innerHTML = `${comment.firstname} ${comment.lastname}`;
        const p = document.createElement('p');
        p.innerHTML = comment.comment;

        commentsList.appendChild(commentAuthor);
        commentsList.appendChild(p);
        commentContainer.appendChild(commentsList);
      });
    });

    // add commentContainer to card to show comments
    card.appendChild(commentContainer);

    // add card to post article
    article.appendChild(card);
    // add article to section
    section.appendChild(article);
  });
};

close.addEventListener('click', (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle('hide');
});

const getComments = async (id) => {
  console.log('Get comments with postId: ', id);
  try {
    const response = await fetch(url + '/forum/comments/' + id);
    console.log('Response: ', response);
    const comments = await response.json();
    return comments;
  } catch (e) {
    console.log(e.message);
  }
};

const getPost = async (path) => {
  console.log("getPost? token ", sessionStorage.getItem("token"));
  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + path, options);
    const posts = await response.json();
    createPostView(posts);
  } catch (e) {
    console.log(e.message);
  }
};

getPost('/forum/posts');

const image = document.getElementById('image');
const previewContainer = document.getElementById('imagePreview');
const previewImage = document.querySelector('.image-preview-image');
const previewDefaultText = document.querySelector(
  '.image-preview-default-text'
);

image.addEventListener('change', function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();
    previewContainer.style.display = 'flex';
    previewDefaultText.style.display = 'none';
    previewImage.style.display = 'block';

    reader.addEventListener('load', function () {
      console.log(this);
      previewImage.setAttribute('src', this.result);
    });
    reader.readAsDataURL(file);
  } else {
    previewContainer.style.display = '';
    previewDefaultText.style.display = '';
    previewImage.style.display = '';
    previewImage.setAttribute('src', '');
  }
});

const closeModal = () => {
  modal.style.display = 'none';
};

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
