const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const serviceAccount = require('/Users/frankoswanepoel/Desktop/2024/COS 720/Assingments/Assingment 1/secrets/cos720-assignment-database-firebase-adminsdk-zh7nq-b7b2c0ea74.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_secret_key', (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersRef = db.collection('users');
    const existingUserSnapshot = await usersRef.where('email', '==', email).get();
    if (!existingUserSnapshot.empty) {
      return res.status(400).send({ message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserRef = db.collection('users').doc();
    await newUserRef.set({
      email,
      passwordHash: hashedPassword
    });
    res.status(201).send({ message: 'User registered successfully', userId: newUserRef.id });
  } catch (error) {
    res.status(500).send({ message: 'Failed to register user', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(404).send({ message: 'User not found' });
    }

    const user = snapshot.docs[0].data();
    const userId = snapshot.docs[0].id; // Get the user's ID
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: userId },
      'your_secret_key',
      { expiresIn: '1h' }
    );

    res.send({
      message: 'Login successful',
      token: token,
      userId: email // Include the userId in the response
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to log in', error: error.message });
  }
});


app.post('/api/register-module', authenticateToken, async (req, res) => {
  try {
    const { userId, moduleCode } = req.body;

    // Check if the user exists
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Check if the user is already registered for the module
    const userData = userDoc.data();
    if (userData.registeredModules && userData.registeredModules.includes(moduleCode)) {
      return res.status(400).send({ message: 'User is already registered for this module' });
    }

    // Add the module to the user's registered modules
    const registeredModules = userData.registeredModules ? [...userData.registeredModules, moduleCode] : [moduleCode];
    await userRef.update({ registeredModules });

    res.send({ message: 'Module registration successful' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to register module', error: error.message });
  }
});

app.get('/api/registered-modules/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: 'User not found' });
    }

    const userData = userDoc.data();
    const registeredModules = userData.registeredModules || [];

    // Fetch the module details for each registered module
    const modulePromises = registeredModules.map(moduleCode =>
      db.collection('modules').where('moduleCode', '==', moduleCode).get()
    );

    const moduleSnapshots = await Promise.all(modulePromises);
    const modules = moduleSnapshots.map(snapshot => {
      return snapshot.docs.length > 0 ? snapshot.docs[0].data() : null;
    }).filter(module => module !== null);

    res.send(modules);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch registered modules', error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
