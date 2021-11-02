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

  // "Unload" mail-view in case it was load before, so old mails won't be persistent
  let mail = document.querySelector('#email-view');
  if (!isEmpty(mail)) {
    mail.remove();
  }


  // Load inbox
  console.log(mailbox);

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      console.log('E-mail length is:' + emails.length)

      populateMailbox(emails, mailbox);
    });
}

function isEmpty(obj) {
  for (var x in obj) {
    return false;
  }
  return true;
}


function populateMailbox(emails, mailbox) {
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
      let id = row.insertCell(3);
      id.id = 'mailId';
      id.hidden = true;

      if (mailbox == 'inbox') {
        var button1 = row.insertCell(4);
        var button2 = row.insertCell(5);
      }
      else if (mailbox == 'archive') {
        var button2 = row.insertCell(4);
      }


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
      id.innerHTML = emails[i].id;

      if (mailbox == 'inbox') {
        // Add read and unread buttons
        if (emails[i].read == true) {
          button1.className = 'unread';
        }
        else {
          button1.className = 'read';
        }

        // Add archive and unarchive buttons
        if (emails[i].archive == true) {
          button2.className = 'unarchive';
        }
        else {
          button2.className = 'archive';
        }
      }
      else if (mailbox == 'archive') {
        button2.className = 'unarchive';
      }
    }

    // Event listener to get mail id
    table.addEventListener('click', function (event) {
      // Identifies if a button was clicked
      let button = event.target.closest('td');

      // Identify if a line but not a button was clicked
      let line = event.target.closest('tr');
      let cell = line.querySelector('#mailId');
      let mailId = cell.innerHTML;

      // Open an email or make another action depending if a button was clicked
      if (button.className == 'unread') {
        unreadMail(mailId);
      }
      else if (button.className == 'read') {
        readMail(mailId);
      }
      else if (button.className == 'archive') {
        archiveMail(mailId);
      }
      else if (button.className == 'unarchive') {
        unarchiveMail(mailId);
      }
      else {
        openMail(mailId);
      }
    });
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
      let id = row.insertCell(3);
      id.id = 'mailId';
      id.hidden = true;

      if (mailbox == 'inbox') {
        var button1 = row.insertCell(4);
        var button2 = row.insertCell(5);
      }
      else if (mailbox == 'archive') {
        var button2 = row.insertCell(4);
      }


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
      id.innerHTML = emails[i].id;

      if (mailbox == 'inbox') {
        // Add read and unread buttons
        if (emails[i].read == true) {
          button1.className = 'unread';
        }
        else {
          button1.className = 'read';
        }

        // Add archive and unarchive buttons
        if (emails[i].archive == true) {
          button2.className = 'unarchive';
        }
        else {
          button2.className = 'archive';
        }
      }
      else if (mailbox == 'archive') {
        button2.className = 'unarchive';
      }
    }

    // Event listener to get mail id
    table.addEventListener('click', function (event) {
      // Identifies if a button was clicked
      let button = event.target.closest('td');

      // Identify if a line but not a button was clicked
      let line = event.target.closest('tr');
      let cell = line.querySelector('#mailId');
      let mailId = cell.innerHTML;

      // Open an email or make another action depending if a button was clicked
      if (button.className == 'unread') {
        unreadMail(mailId);
      }
      else if (button.className == 'read') {
        readMail(mailId);
        setTimeout(() => load_mailbox('inbox'), 80);
      }
      else if (button.className == 'archive') {
        archiveMail(mailId);
      }
      else if (button.className == 'unarchive') {
        unarchiveMail(mailId);
      }
      else {
        openMail(mailId);
      }
    });
  }
}

// Function to open an email after id is passed in
function openMail(id) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);

      // ... do something else with email ...
      populateMailView(email);
      readMail(id);
    });

}

function populateMailView(email) {
  // Close emails-view
  document.querySelector('#emails-view').style.display = 'none';

  // Create table with sender, recipients, subject and timestamp
  container = document.querySelector(".container");
  // Div
  mail = document.createElement('div');
  mail.id = 'email-view';
  emailView = container.appendChild(mail);

  // Table
  table = document.createElement('table');
  table.id = 'mail-info';
  emailView.appendChild(table);

  // Text
  text = document.createElement('div');
  emailView.appendChild(text);

  // Populate divs
  let from = table.insertRow(0);
  let from1 = from.insertCell(0);
  let from2 = from.insertCell(1);
  from1.innerHTML = 'From:';
  from1.className = 'info-1';
  from2.innerHTML = email.sender;

  let to = table.insertRow(1);
  let to1 = to.insertCell(0);
  let to2 = to.insertCell(1);
  to1.innerHTML = 'To:';
  to1.className = 'info-1';
  to2.innerHTML = email.recipients;

  let subject = table.insertRow(2);
  let sub1 = subject.insertCell(0);
  let sub2 = subject.insertCell(1);
  sub1.innerHTML = 'Subject:';
  sub1.className = 'info-1';
  sub2.innerHTML = email.subject;

  let timestamp = table.insertRow(3);
  let time1 = timestamp.insertCell(0);
  let time2 = timestamp.insertCell(1);
  time1.innerHTML = 'Timestamp:';
  time1.className = 'info-1';
  time2.innerHTML = email.timestamp;

  text.innerHTML = email.body;
}

function readMail(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });
}

function unreadMail(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: false
    })
  });
  setTimeout(() => load_mailbox('inbox'), 80);
}

function archiveMail(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  });
  load_mailbox('inbox');
}

function unarchiveMail(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  });
  load_mailbox('inbox');
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