const express = require('express');
const { User, UserQueue } = require('./model/user');
const { fromJSON } = require('./model/clinic');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const userQueue = new UserQueue();
const clinicList = fromJSON("./database/clinics.json")

console.log(clinicList);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/create', (req, res) => {
  const { name, id, username, password, dateOfBirth } = req.body;

  console.log(req.body);

  if (!name || !id || !username || !password || !dateOfBirth) {
    return res.status(400).send('Missing user information');
  }

  const user = new User(name, id, username, password, dateOfBirth);
  userQueue.enqueue(user);

  res.status(201).send('User ' + id + ' added to the queue');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
