const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Submit form
app.post('/api/submit', (req, res) => {
const { fname, lname, email, phone, interest, message } = req.body;

const query = `INSERT INTO applications (fname, lname, email, phone, interest, message) VALUES (?, ?, ?, ?, ?, ?)`;

db.run(query, [fname, lname, email, phone, interest, message], function(err) {
if (err) return res.status(500).json({ error: err.message });
res.json({ message: "Saved successfully" });
});
});

// Get applications
app.get('/api/applications', (req, res) => {
db.all("SELECT * FROM applications", [], (err, rows) => {
if (err) return res.status(500).json({ error: err.message });
res.json(rows);
});
});

/* SIGNUP */
app.post('/api/signup', (req, res) => {
const { username, password, role } = req.body;

db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
  if (err) return res.status(500).json({ error: err.message });
  if (row) {
    return res.status(400).json({ message: "Username already taken. Please choose a different one." });
  }

db.run(
  "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
  [username, password, role],
  function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Account created" });
  }
);
});
});

/* LOGIN */
app.post('/api/login', (req, res) => {
const { username, password, role } = req.body;

db.get(
"SELECT * FROM users WHERE username = ? AND password = ? AND role = ?",
[username, password, role],
(err, row) => {
if (err) return res.status(500).json({ error: err.message });
if (row) {
res.json({ success: true, role: row.role });
} else {
res.status(401).json({ success: false, message: "Wrong username or password" });
}
}
);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});