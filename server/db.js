const sqlite3 = require('sqlite3').verbose();

// This creates a file “shecan.db” automatically
const db = new sqlite3.Database('./shecan.db', (err) => {
if (err) {
console.error(err.message);
} else {
console.log("Connected to SQLite database");
}
});

// Create tables and seed default accounts
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS applications ( id INTEGER PRIMARY KEY AUTOINCREMENT, fname TEXT, lname TEXT, email TEXT, phone TEXT, interest TEXT, message TEXT )`);

  db.run(`CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, role TEXT )`, () => {
    // Seed default user
    db.get("SELECT * FROM users WHERE username = 'riya'", (err, row) => {
      if (!row) {
        db.run("INSERT INTO users (username, password, role) VALUES ('riya', 'testpassword', 'user')");
        console.log("Seeded default user: riya / testpassword");
      }
    });
    // Seed default admin
    db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
      if (!row) {
        db.run("INSERT INTO users (username, password, role) VALUES ('admin', 'adminpassword', 'admin')");
        console.log("Seeded default admin: admin / adminpassword");
      }
    });
  });
});

module.exports = db;