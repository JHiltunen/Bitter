'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const infoTable = document.querySelector('#dataTable');
const tbody = document.querySelector('tbody');
const modal = document.querySelector('#editUserModal'); // Get the modal
// edit
const updateUserForm = document.querySelector('#updateUser');
const updateFirstname = document.querySelector('#updateFirstname');
const updateLastname = document.querySelector('#updateLastname');
const updateEmail = document.querySelector('#updateEmail');
const updateGender = document.querySelector('#updateGender');
const updateDateOfBirth = document.querySelector('#updateDateOfBirth');
const userId = document.querySelector('#userId');

const getInfo = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/admin/users', options);
    const users = await response.json();
    createTable(users);
  }
  catch (e) {
    console.log(e.message);
  }
};

const createTable = (users) => {
  tbody.innerHTML = '';
  users.forEach((user) => {
    const firstname = document.createElement('td');
    firstname.classList.add('td');
    firstname.innerHTML = `${user.firstname}`;
    
    const lastname = document.createElement('td');
    lastname.classList.add('td');
    lastname.innerHTML = `${user.lastname}`;
    
    const email = document.createElement('td');
    email.classList.add('td');
    email.innerHTML = `${user.email}`;

    const editField = document.createElement('td');
    editField.classList.add('td');
    const editIcon = document.createElement('i');
    editIcon.classList.add('fa');
    editIcon.classList.add('fa-edit');
    
    editField.appendChild(editIcon);

    editIcon.addEventListener('click', () => {
      modal.style.display = 'block';
      updateFirstname.value = user.firstname;
      updateLastname.value = user.lastname;
      updateEmail.value = user.email;
      updateGender.value = user.gender;
      updateDateOfBirth.value = user.dateOfBirth.split('T')[0];
      userId.value = user.userId;
    });

    const deleteField = document.createElement('td');
    deleteField.classList.add('td');
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa');
    deleteIcon.classList.add('fa-trash');
    
    deleteField.appendChild(deleteIcon);

    const tr = document.createElement('tr');
    tr.classList.add('tr');

    tr.appendChild(firstname);
    tr.appendChild(lastname);
    tr.appendChild(email);
    tr.appendChild(editField);
    tr.appendChild(deleteField);
    tbody.appendChild(tr)

  });
}
getInfo();

const closeModal = () => {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    closeModal();
  }
});

updateUserForm.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();
    const data = serializeJson(updateUserForm);
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
      url + '/admin/update-user/' + data.userId,
      fetchOptions
    );
    console.log(response);
    const json = await response.json();
    if (response.status === 200) {
      await getInfo();
      closeModal();
    }
  } catch (e) {
    console.log('Error on update post', e.message);
  }
});