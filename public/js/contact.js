'use strict';
const url = 'https://10.114.32.106/bitter'; // change url when uploading to server
const contactForm = document.querySelector('#contact-form');

// submit contactForm
contactForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(contactForm);
    console.log("contactForm submit: ", contactForm, data);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + '/contact', fetchOptions);
    const json = await response.json();
    console.log('contact form add response', json); 
});
