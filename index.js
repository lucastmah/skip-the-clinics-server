const express = require('express');
//const router = express.Router();
const fs = require('fs');
const { User, UserQueue } = require('./model/user');
const { fromJSON, getClinicByID, updateUserQueue } = require('./model/clinic');

const app = express();
app.use(express.json());

const port = process.env.PORT || 8000;

//const userQueue = new UserQueue();
const clinicList = fromJSON("./database/clinics.json")

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/create', (req, res) => {
  const { name, healthNumber, username, password, dateOfBirth } = req.body;
  
  if (!name || !healthNumber || !username || !password || !dateOfBirth ) {
    return res.status(400).send('Missing user information');
  }
  
  fs.readFile('./users/users.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      var output = JSON.parse(data);
      console.log(output);
      output.users.push({name, healthNumber, username, password, dateOfBirth, queued:[]});
      fs.writeFile('./users/users.json', JSON.stringify(output), err => {
        if (err) {
          console.error(err);
        } else {
          console.log("w");
        }
      });
    }
  });

  res.status(201).send('User ' + healthNumber + ' added.');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  var token = login(username, password);
  if (token) {
    return res.redirect('/dashboard');
  }
  return res.status(401).send("incorrect login");
});

function clinicDump() {
  for (var i = 1; i < 10; i++) {
    clinic = getClinicByID(clinicList, i);
    if(clinic != null) {
      clinic.showList();
    }
  }
}
// router.get('/', verifyToken, (req, res) => {
//   res.status(200).json({ message: 'Protected route accessed' });
// });

// function verifyToken(req, res, next) {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).json({ error: 'Access denied' });
//   try {
//     const decoded = jwt.verify(token, 'your-secret-key');
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// app.post('/logout', (req, res) => {

// });

app.post('/enqueue', (req, res) => {
  const { userId, clinicIds } = req.body;
  var positions = [];

  if (!userId || !clinicIds) {
    return res.status(400).send('Missing user information');
  }

  for (const id of clinicIds) {
    clinic = getClinicByID(clinicList, id);
    if (clinic != null) {
      positions.push(clinic.enqueueUser(userId));
    }
  }
  updateUserQueue(userId, clinicIds);
  //clinicDump();
  return res.status(201).send("Enqueued user " + userId + '. Your Positions: ' + positions);
});

app.post('/dequeue', (req, res) => {
  const clinicId = req.body.clinicId;

  var clinic = getClinicByID(clinicList, clinicId);
  if (clinic != null) {
    var userId = clinic.dequeueUser();
    if (!userId) {
      return res.status(404).send("Queue has no more users");
    }
    var queues = updateUserQueue(userId, []);
    var index = queues.indexOf(clinicId);
    if (index > -1) { // only splice array when item is found
      queues.splice(index, 1); // 2nd parameter means remove one item only
    }
    queues.forEach(queue => {
      getClinicByID(clinicList, queue).removeUser(userId);
    });
  }

  //clinicDump();
  return res.status(200).send("Dequeued user at clinic " + clinicId + '.');
});

app.get('/locations', (req, res) => {
  return res.status(200).send(clinicList);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
