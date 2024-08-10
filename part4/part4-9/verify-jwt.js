const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRuZ1JvdGgiLCJpYXQiOjE1MTYyMzkwMjJ9.2eL-hKzJZfT-bruxJJVf-ONR3z5n2XsLPnz6IU3PBpk'; // Replace with the token you want to verify
const secret = process.env.SECRET; // Ensure this matches the secret used for signing tokens

try {
  const decoded = jwt.verify(token, secret);
  console.log('Token is valid:', decoded);
} catch (error) {
  console.error('Invalid token:', error.message);
}
