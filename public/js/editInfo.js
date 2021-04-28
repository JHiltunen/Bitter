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
    const tr = document.createElement('tr');
    tr.classList.add('tr');

    tr.appendChild(firstname);
    tr.appendChild(lastname);
    tr.appendChild(email);
    tr.appendChild(gender);
    tr.appendChild(dateOfBirth);
    tbody.appendChild(tr)

  });
}
getInfo();