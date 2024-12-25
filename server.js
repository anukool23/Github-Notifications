const express = require('express');
const bodyParser = require('body-parser');
const { Resend } = require('resend'); // Use `require` instead of `import` for consistency

const app = express();
const PORT = 3000; // Change to your desired port

// Initialize Resend with your API key
const resend = new Resend('re_4QvGYbue_Pvq2Swoxr476FEuKgC85bbU4');

app.use(bodyParser.json());

// Send email notification using Resend API
function sendEmail(subject, message) {
  resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'aanukool.patel@gmail.com',
    subject: subject,
    html: `<p>${message}</p>`
  }).then(() => {
    console.log('Email sent successfully');
  }).catch((error) => {
    console.error('Error sending email:', error);
  });
}

// GitHub webhook endpoint
app.post('/webhook', (req, res) => {
  const eventType = req.headers['x-github-event'];

  if (eventType === 'push') {
    const repo = req.body.repository.full_name;
    const pusher = req.body.pusher.name;
    const commits = req.body.commits.map(commit => commit.message).join('\n');
    const emailMessage = `Push event on repo: ${repo} by ${pusher}\nCommits:\n${commits}`;
    sendEmail('GitHub Push Event', emailMessage);
  } else if (eventType === 'pull_request') {
    const repo = req.body.repository.full_name;
    const action = req.body.action;
    const prTitle = req.body.pull_request.title;
    const sender = req.body.sender.login;
    const emailMessage = `Pull Request ${action} on repo: ${repo} by ${sender}\nTitle: ${prTitle}`;
    sendEmail('GitHub Pull Request Event', emailMessage);
  }

  // Add more cases for commits, issues, etc., as needed
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
