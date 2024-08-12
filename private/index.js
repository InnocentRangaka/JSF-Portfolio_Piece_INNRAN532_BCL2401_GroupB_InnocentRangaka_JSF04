const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Use environment variable or fallback

app.use(cors());
app.use(express.json());

// Mock user data (in a real app, you'd use a database)
const users = [
  {
    id: 1,
    username: 'john_doe',
    password: bcrypt.hashSync('password123', 8), // Hashed password
  },
];

// Login route
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).send('User not found');
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({ auth: false, token: null });
  }

  const token = createJWT({ id: user.id }, { expiresIn: '24h' });

  res.status(200).send({ auth: true, token });
});

// Protected route
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('No token provided.');

  const { data, error } = decodeJWT(token);
  if (error) return res.status(500).send('Failed to authenticate token.');

  res.status(200).send('This is protected data.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('No token provided.');

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).send('Failed to authenticate token.');
    req.userId = decoded.id;
    next();
  });
};

export function createJWT(payload, options = {}) {
  const secretKey = process.env.SECRET_KEY || 'your_secret_key'; // Fallback for development

  // Sign the JWT with the given payload, secret key, and options
  const token = jwt.sign(payload, secretKey, options);

  return token;
}

export function decodeJWT(token) {
  const secretKey = process.env.SECRET_KEY || 'your_secret_key'; // Fallback for development

  try {
      // Verify the JWT with the secret key
      const verified = jwt.verify(token, secretKey);

      return {
          data: verified,  // The verified payload
          error: null
      };
  } catch (err) {
      return {
          data: null,
          error: err.message
      };
  }
}
