const mysql = require("mysql2");
require("dotenv").config();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "biodata_app",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database as id " + db.threadId);
});

const addRoleColumn = () => {
  // Add role column to users table
  const addRoleQuery = `
    ALTER TABLE users 
    ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user'
  `;

  db.query(addRoleQuery, (err) => {
    if (err) {
      if (err.code === "ER_DUP_FIELDNAME") {
        console.log("Role column already exists");
      } else {
        console.error("Error adding role column:", err);
      }
    } else {
      console.log("Role column added successfully");
    }
    db.end();
  });
};

addRoleColumn();
