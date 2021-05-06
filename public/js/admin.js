'use strict';
const url = 'https://localhost:8001'; // change url when uploading to server
const infoTable = document.querySelector('#dataTable');
const tbody = document.querySelector('tbody');

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
    
    const gender = document.createElement('td');
    gender.classList.add('td');
    gender.innerHTML = `${user.gender}`;
    
    const dateOfBirth = document.createElement('td');
    dateOfBirth.classList.add('td');
    dateOfBirth.innerHTML = `${user.dateOfBirth}`;

    const editField = document.createElement('td');
    editField.classList.add('td');
    const editIcon = document.createElement('i');
    editIcon.classList.add('fa');
    editIcon.classList.add('fa-edit');
    
    editField.appendChild(editIcon);

    const deleteField = document.createElement('td');
    deleteField.classList.add('td');
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa');
    deleteIcon.classList.add('fa-edit');
    
    deleteField.appendChild(deleteIcon);

    const tr = document.createElement('tr');
    tr.classList.add('tr');

    tr.appendChild(firstname);
    tr.appendChild(lastname);
    tr.appendChild(email);
    tr.appendChild(gender);
    tr.appendChild(dateOfBirth);
    tr.appendChild(editField);
    tr.appendChild(deleteIcon);
    tbody.appendChild(tr)

  });
}
getInfo();