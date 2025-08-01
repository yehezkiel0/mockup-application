const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
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

const createAdminUser = async () => {
  try {
    const adminEmail = "admin@admin.com";
    const adminPassword = "admin123";

    // Check if admin already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [adminEmail],
      async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return;
        }

        if (results.length > 0) {
          console.log("Admin user already exists!");
          db.end();
          return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        db.query(
          "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
          [adminEmail, hashedPassword, "admin"],
          (err, result) => {
            if (err) {
              console.error("Error creating admin user:", err);
              return;
            }

            console.log("Admin user created successfully!");
            console.log("Email: admin@admin.com");
            console.log("Password: admin123");
            console.log("Role: admin");
            db.end();
          }
        );
      }
    );
  } catch (error) {
    console.error("Error:", error);
    db.end();
  }
};

createAdminUser();
