const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Create tables if they don't exist
const createTables = () => {
  // Users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Biodata table
  const createBiodataTable = `
    CREATE TABLE IF NOT EXISTS biodata (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      posisi VARCHAR(255),
      nama VARCHAR(255) NOT NULL,
      no_ktp VARCHAR(20),
      tempat_lahir VARCHAR(255),
      tanggal_lahir DATE,
      jenis_kelamin ENUM('LAKI-LAKI', 'PEREMPUAN') NOT NULL,
      agama VARCHAR(100),
      golongan_darah VARCHAR(5),
      status VARCHAR(50),
      alamat_ktp TEXT,
      alamat_tinggal TEXT,
      email VARCHAR(255),
      no_telp VARCHAR(20),
      orang_terdekat VARCHAR(255),
      skill TEXT,
      bersedia_ditempatkan BOOLEAN DEFAULT FALSE,
      penghasilan_diharapkan DECIMAL(15,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // Education table
  const createEducationTable = `
    CREATE TABLE IF NOT EXISTS education (
      id INT AUTO_INCREMENT PRIMARY KEY,
      biodata_id INT,
      jenjang_pendidikan VARCHAR(100),
      nama_institusi VARCHAR(255),
      jurusan VARCHAR(255),
      tahun_lulus YEAR,
      ipk DECIMAL(3,2),
      FOREIGN KEY (biodata_id) REFERENCES biodata(id) ON DELETE CASCADE
    )
  `;

  // Training table
  const createTrainingTable = `
    CREATE TABLE IF NOT EXISTS training (
      id INT AUTO_INCREMENT PRIMARY KEY,
      biodata_id INT,
      nama_kursus VARCHAR(255),
      sertifikat BOOLEAN DEFAULT FALSE,
      tahun YEAR,
      FOREIGN KEY (biodata_id) REFERENCES biodata(id) ON DELETE CASCADE
    )
  `;

  // Work experience table
  const createWorkExperienceTable = `
    CREATE TABLE IF NOT EXISTS work_experience (
      id INT AUTO_INCREMENT PRIMARY KEY,
      biodata_id INT,
      nama_perusahaan VARCHAR(255),
      posisi VARCHAR(255),
      pendapatan DECIMAL(15,2),
      tahun YEAR,
      FOREIGN KEY (biodata_id) REFERENCES biodata(id) ON DELETE CASCADE
    )
  `;

  db.query(createUsersTable, (err) => {
    if (err) console.error("Error creating users table:", err);
    else console.log("Users table created or already exists");
  });

  db.query(createBiodataTable, (err) => {
    if (err) console.error("Error creating biodata table:", err);
    else console.log("Biodata table created or already exists");
  });

  db.query(createEducationTable, (err) => {
    if (err) console.error("Error creating education table:", err);
    else console.log("Education table created or already exists");
  });

  db.query(createTrainingTable, (err) => {
    if (err) console.error("Error creating training table:", err);
    else console.log("Training table created or already exists");
  });

  db.query(createWorkExperienceTable, (err) => {
    if (err) console.error("Error creating work_experience table:", err);
    else console.log("Work experience table created or already exists");
  });
};

createTables();

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Routes

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        db.query(
          "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
          [email, hashedPassword, "user"],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: "Error creating user" });
            }

            const token = jwt.sign(
              { userId: result.insertId, email, role: "user" },
              process.env.JWT_SECRET || "your-secret-key",
              { expiresIn: "24h" }
            );

            res.status(201).json({
              message: "User created successfully",
              token,
              user: { id: result.insertId, email, role: "user" },
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn: "24h" }
        );

        res.json({
          message: "Login successful",
          token,
          user: { id: user.id, email: user.email, role: user.role },
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Biodata Routes
app.get("/api/biodata", verifyToken, (req, res) => {
  const query = `
    SELECT b.*, 
           GROUP_CONCAT(DISTINCT CONCAT(e.jenjang_pendidikan, '|', e.nama_institusi, '|', e.jurusan, '|', e.tahun_lulus, '|', e.ipk) SEPARATOR ';') as education,
           GROUP_CONCAT(DISTINCT CONCAT(t.nama_kursus, '|', t.sertifikat, '|', t.tahun) SEPARATOR ';') as training,
           GROUP_CONCAT(DISTINCT CONCAT(w.nama_perusahaan, '|', w.posisi, '|', w.pendapatan, '|', w.tahun) SEPARATOR ';') as work_experience
    FROM biodata b
    LEFT JOIN education e ON b.id = e.biodata_id
    LEFT JOIN training t ON b.id = t.biodata_id
    LEFT JOIN work_experience w ON b.id = w.biodata_id
    WHERE b.user_id = ?
    GROUP BY b.id
  `;

  db.query(query, [req.user.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// Admin endpoint to get all biodata
app.get("/api/admin/biodata", verifyToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  const query = `
    SELECT b.*, u.email as user_email,
           GROUP_CONCAT(DISTINCT CONCAT(e.jenjang_pendidikan, '|', e.nama_institusi, '|', e.jurusan, '|', e.tahun_lulus, '|', e.ipk) SEPARATOR ';') as education,
           GROUP_CONCAT(DISTINCT CONCAT(t.nama_kursus, '|', t.sertifikat, '|', t.tahun) SEPARATOR ';') as training,
           GROUP_CONCAT(DISTINCT CONCAT(w.nama_perusahaan, '|', w.posisi, '|', w.pendapatan, '|', w.tahun) SEPARATOR ';') as work_experience
    FROM biodata b
    LEFT JOIN users u ON b.user_id = u.id
    LEFT JOIN education e ON b.id = e.biodata_id
    LEFT JOIN training t ON b.id = t.biodata_id
    LEFT JOIN work_experience w ON b.id = w.biodata_id
    GROUP BY b.id
    ORDER BY b.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// Admin endpoint to get specific biodata by ID
app.get("/api/admin/biodata/:id", verifyToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  const { id } = req.params;
  const query = `
    SELECT b.*, 
           GROUP_CONCAT(DISTINCT CONCAT(e.jenjang_pendidikan, '|', e.nama_institusi, '|', e.jurusan, '|', e.tahun_lulus, '|', e.ipk) SEPARATOR ';') as education,
           GROUP_CONCAT(DISTINCT CONCAT(t.nama_kursus, '|', t.sertifikat, '|', t.tahun) SEPARATOR ';') as training,
           GROUP_CONCAT(DISTINCT CONCAT(w.nama_perusahaan, '|', w.posisi, '|', w.pendapatan, '|', w.tahun) SEPARATOR ';') as work_experience
    FROM biodata b
    LEFT JOIN education e ON b.id = e.biodata_id
    LEFT JOIN training t ON b.id = t.biodata_id
    LEFT JOIN work_experience w ON b.id = w.biodata_id
    WHERE b.id = ?
    GROUP BY b.id
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Biodata not found" });
    }
    res.json(results[0]);
  });
});

app.post("/api/biodata", verifyToken, (req, res) => {
  const {
    posisi,
    nama,
    no_ktp,
    tempat_lahir,
    tanggal_lahir,
    jenis_kelamin,
    agama,
    golongan_darah,
    status,
    alamat_ktp,
    alamat_tinggal,
    email,
    no_telp,
    orang_terdekat,
    skill,
    bersedia_ditempatkan,
    penghasilan_diharapkan,
    education,
    training,
    work_experience,
  } = req.body;

  const biodataQuery = `
    INSERT INTO biodata (
      user_id, posisi, nama, no_ktp, tempat_lahir, tanggal_lahir, jenis_kelamin,
      agama, golongan_darah, status, alamat_ktp, alamat_tinggal, email,
      no_telp, orang_terdekat, skill, bersedia_ditempatkan, penghasilan_diharapkan
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    biodataQuery,
    [
      req.user.userId,
      posisi,
      nama,
      no_ktp,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      golongan_darah,
      status,
      alamat_ktp,
      alamat_tinggal,
      email,
      no_telp,
      orang_terdekat,
      skill,
      bersedia_ditempatkan,
      penghasilan_diharapkan,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error creating biodata" });
      }

      const biodataId = result.insertId;

      // Insert education data
      if (education && education.length > 0) {
        education.forEach((edu) => {
          db.query(
            "INSERT INTO education (biodata_id, jenjang_pendidikan, nama_institusi, jurusan, tahun_lulus, ipk) VALUES (?, ?, ?, ?, ?, ?)",
            [
              biodataId,
              edu.jenjang_pendidikan,
              edu.nama_institusi,
              edu.jurusan,
              edu.tahun_lulus,
              edu.ipk,
            ]
          );
        });
      }

      // Insert training data
      if (training && training.length > 0) {
        training.forEach((train) => {
          db.query(
            "INSERT INTO training (biodata_id, nama_kursus, sertifikat, tahun) VALUES (?, ?, ?, ?)",
            [biodataId, train.nama_kursus, train.sertifikat, train.tahun]
          );
        });
      }

      // Insert work experience data
      if (work_experience && work_experience.length > 0) {
        work_experience.forEach((work) => {
          db.query(
            "INSERT INTO work_experience (biodata_id, nama_perusahaan, posisi, pendapatan, tahun) VALUES (?, ?, ?, ?, ?)",
            [
              biodataId,
              work.nama_perusahaan,
              work.posisi,
              work.pendapatan,
              work.tahun,
            ]
          );
        });
      }

      res
        .status(201)
        .json({ message: "Biodata created successfully", id: biodataId });
    }
  );
});

// Admin endpoint to update any biodata
app.put("/api/admin/biodata/:id", verifyToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  const { id } = req.params;
  const {
    posisi,
    nama,
    no_ktp,
    tempat_lahir,
    tanggal_lahir,
    jenis_kelamin,
    agama,
    golongan_darah,
    status,
    alamat_ktp,
    alamat_tinggal,
    email,
    no_telp,
    orang_terdekat,
    skill,
    bersedia_ditempatkan,
    penghasilan_diharapkan,
    education,
    training,
    work_experience,
  } = req.body;

  const updateQuery = `
    UPDATE biodata SET 
      posisi=?, nama=?, no_ktp=?, tempat_lahir=?, tanggal_lahir=?, jenis_kelamin=?,
      agama=?, golongan_darah=?, status=?, alamat_ktp=?, alamat_tinggal=?, email=?,
      no_telp=?, orang_terdekat=?, skill=?, bersedia_ditempatkan=?, penghasilan_diharapkan=?
    WHERE id=?
  `;

  db.query(
    updateQuery,
    [
      posisi,
      nama,
      no_ktp,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      golongan_darah,
      status,
      alamat_ktp,
      alamat_tinggal,
      email,
      no_telp,
      orang_terdekat,
      skill,
      bersedia_ditempatkan,
      penghasilan_diharapkan,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating biodata" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Biodata not found" });
      }

      // Delete existing related data
      db.query("DELETE FROM education WHERE biodata_id = ?", [id]);
      db.query("DELETE FROM training WHERE biodata_id = ?", [id]);
      db.query("DELETE FROM work_experience WHERE biodata_id = ?", [id]);

      // Insert updated data
      if (education && education.length > 0) {
        education.forEach((edu) => {
          db.query(
            "INSERT INTO education (biodata_id, jenjang_pendidikan, nama_institusi, jurusan, tahun_lulus, ipk) VALUES (?, ?, ?, ?, ?, ?)",
            [
              id,
              edu.jenjang_pendidikan,
              edu.nama_institusi,
              edu.jurusan,
              edu.tahun_lulus,
              edu.ipk,
            ]
          );
        });
      }

      if (training && training.length > 0) {
        training.forEach((train) => {
          db.query(
            "INSERT INTO training (biodata_id, nama_kursus, sertifikat, tahun) VALUES (?, ?, ?, ?)",
            [id, train.nama_kursus, train.sertifikat, train.tahun]
          );
        });
      }

      if (work_experience && work_experience.length > 0) {
        work_experience.forEach((work) => {
          db.query(
            "INSERT INTO work_experience (biodata_id, nama_perusahaan, posisi, pendapatan, tahun) VALUES (?, ?, ?, ?, ?)",
            [id, work.nama_perusahaan, work.posisi, work.pendapatan, work.tahun]
          );
        });
      }

      res.json({ message: "Biodata updated successfully by admin" });
    }
  );
});

app.put("/api/biodata/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const {
    posisi,
    nama,
    no_ktp,
    tempat_lahir,
    tanggal_lahir,
    jenis_kelamin,
    agama,
    golongan_darah,
    status,
    alamat_ktp,
    alamat_tinggal,
    email,
    no_telp,
    orang_terdekat,
    skill,
    bersedia_ditempatkan,
    penghasilan_diharapkan,
    education,
    training,
    work_experience,
  } = req.body;

  const updateQuery = `
    UPDATE biodata SET 
      posisi=?, nama=?, no_ktp=?, tempat_lahir=?, tanggal_lahir=?, jenis_kelamin=?,
      agama=?, golongan_darah=?, status=?, alamat_ktp=?, alamat_tinggal=?, email=?,
      no_telp=?, orang_terdekat=?, skill=?, bersedia_ditempatkan=?, penghasilan_diharapkan=?
    WHERE id=? AND user_id=?
  `;

  db.query(
    updateQuery,
    [
      posisi,
      nama,
      no_ktp,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      golongan_darah,
      status,
      alamat_ktp,
      alamat_tinggal,
      email,
      no_telp,
      orang_terdekat,
      skill,
      bersedia_ditempatkan,
      penghasilan_diharapkan,
      id,
      req.user.userId,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating biodata" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Biodata not found" });
      }

      // Delete existing related data
      db.query("DELETE FROM education WHERE biodata_id = ?", [id]);
      db.query("DELETE FROM training WHERE biodata_id = ?", [id]);
      db.query("DELETE FROM work_experience WHERE biodata_id = ?", [id]);

      // Insert updated data
      if (education && education.length > 0) {
        education.forEach((edu) => {
          db.query(
            "INSERT INTO education (biodata_id, jenjang_pendidikan, nama_institusi, jurusan, tahun_lulus, ipk) VALUES (?, ?, ?, ?, ?, ?)",
            [
              id,
              edu.jenjang_pendidikan,
              edu.nama_institusi,
              edu.jurusan,
              edu.tahun_lulus,
              edu.ipk,
            ]
          );
        });
      }

      if (training && training.length > 0) {
        training.forEach((train) => {
          db.query(
            "INSERT INTO training (biodata_id, nama_kursus, sertifikat, tahun) VALUES (?, ?, ?, ?)",
            [id, train.nama_kursus, train.sertifikat, train.tahun]
          );
        });
      }

      if (work_experience && work_experience.length > 0) {
        work_experience.forEach((work) => {
          db.query(
            "INSERT INTO work_experience (biodata_id, nama_perusahaan, posisi, pendapatan, tahun) VALUES (?, ?, ?, ?, ?)",
            [id, work.nama_perusahaan, work.posisi, work.pendapatan, work.tahun]
          );
        });
      }

      res.json({ message: "Biodata updated successfully" });
    }
  );
});

// Admin endpoint to delete any biodata
app.delete("/api/admin/biodata/:id", verifyToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  const { id } = req.params;

  db.query("DELETE FROM biodata WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting biodata" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Biodata not found" });
    }

    res.json({ message: "Biodata deleted successfully by admin" });
  });
});

app.delete("/api/biodata/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM biodata WHERE id = ? AND user_id = ?",
    [id, req.user.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting biodata" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Biodata not found" });
      }

      res.json({ message: "Biodata deleted successfully" });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
