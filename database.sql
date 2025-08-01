-- Database setup for Biodata Application
-- Create database (run this manually in MySQL)
CREATE DATABASE IF NOT EXISTS biodata_app;
USE biodata_app;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main biodata table
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
);

-- Education table for multiple education entries
CREATE TABLE IF NOT EXISTS education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  biodata_id INT,
  jenjang_pendidikan VARCHAR(100),
  nama_institusi VARCHAR(255),
  jurusan VARCHAR(255),
  tahun_lulus YEAR,
  ipk DECIMAL(3,2),
  FOREIGN KEY (biodata_id) REFERENCES biodata(id) ON DELETE CASCADE
);

-- Training table for multiple training entries
CREATE TABLE IF NOT EXISTS training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  biodata_id INT,
  nama_kursus VARCHAR(255),
  sertifikat BOOLEAN DEFAULT FALSE,
  tahun YEAR,
  FOREIGN KEY (biodata_id) REFERENCES biodata(id) ON DELETE CASCADE
);

-- Work experience table for multiple work experience entries
CREATE TABLE IF NOT EXISTS work_experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  biodata_id INT,
  nama_perusahaan VARCHAR(255),
  posisi VARCHAR(255),
  pendapatan DECIMAL(15,2),
  tahun YEAR,
  FOREIGN KEY (biodata_id) REFERENCES biodata(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_biodata_user_id ON biodata(user_id);
CREATE INDEX idx_education_biodata_id ON education(biodata_id);
CREATE INDEX idx_training_biodata_id ON training(biodata_id);
CREATE INDEX idx_work_experience_biodata_id ON work_experience(biodata_id);
