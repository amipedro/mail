document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#sendButton').addEventListener('click', send_mail)
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load inbox

  console.log(mailbox);

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      console.log('E-mail length is:' + emails.length)

      populateMailbox(emails);
    });
}


function populateMailbox(emails) {
  if (emails.length <= 10) {

    // Create table
    container = document.querySelector("#emails-view");
    table = document.createElement('table');
    table.id = 'table';
    container.appendChild(table);

    for (var i = 0; i < emails.length; i++) {
      console.log(emails[i].subject);
      // Create row
      let row = table.insertRow(i);

      // Insert columns inside row and define their id property
      let sender = row.insertCell(0);
      sender.id = 'sender';
      let subject = row.insertCell(1);
      subject.id = 'subject';
      let timestamp = row.insertCell(2);
      timestamp.id = 'timestamp';

      // Color row in case it's read or unread
      if (emails[i].read == true) {
        row.style.backgroundColor = 'gainsboro';
      }
      else {
        row.style.backgroundColor = 'white';
      }

      // Populate columns
      sender.innerHTML = emails[i].sender;
      subject.innerHTML = emails[i].subject;
      timestamp.innerHTML = emails[i].timestamp;
    }
  }
  else {
    // Create table
    container = document.querySelector("#emails-view");
    table = document.createElement('table');
    table.id = 'table';
    container.appendChild(table);

    for (var i = 0; i < 10; i++) {
      console.log(emails[i].subject);
      // Create row
      let row = table.insertRow(i);

      // Insert columns inside row and define their id property
      let sender = row.insertCell(0);
      sender.id = 'sender';
      let subject = row.insertCell(1);
      subject.id = 'subject';
      let timestamp = row.insertCell(2);
      timestamp.id = 'timestamp';

      // Color row in case it's read or unread
      if (emails[i].read == true) {
        row.style.backgroundColor = 'gainsboro';
      }
      else {
        row.style.backgroundColor = 'white';
      }

      // Populate columns
      sender.innerHTML = emails[i].sender;
      subject.innerHTML = emails[i].subject;
      timestamp.innerHTML = emails[i].timestamp;
    }
  }
}

function send_mail() {

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector("#compose-recipients").value,
      subject: document.querySelector("#compose-subject").value,
      body: document.querySelector("#compose-body").value
    })
  })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
    });

  load_mailbox('sent');
  console.log('Sent');
}