# Mockup Application - Employee Biodata Management System

A full-stack CRUD application for managing employee biodata with role-based authentication.

## 🚀 Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL Database
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React.js
- React Bootstrap
- Axios for API calls
- React Router for navigation

## � Features

### Authentication System
- User registration and login
- Role-based access control (Admin & User)
- JWT token authentication

### User Features
- Create personal biodata
- Edit own biodata
- Delete own biodata
- View personal biodata list

### Admin Features
- View all employee biodata
- Edit any employee biodata
- Delete any employee biodata
- Full CRUD operations on all data

### Biodata Management
- Personal information (Name, ID Card, Birth details, etc.)
- Contact information
- Education history
- Training/Course history
- Work experience
- Skills and salary expectations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- Git

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=biodata_app
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start backend server:
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# React app runs on http://localhost:3000
```

### Database Setup
The application will automatically create the required tables when you first run the backend server.

**Admin Account:**
- Email: `admin@admin.com`
- Password: `admin123`

## 📱 Usage

1. **Register/Login**: Create account or login with existing credentials
2. **User Dashboard**: Regular users can manage their own biodata
3. **Admin Dashboard**: Admins can view and manage all employee biodata
4. **Biodata Form**: Complete form with personal, education, training, and work experience details

## 🗄️ Database Schema

- `users` - User accounts with roles
- `biodata` - Main employee information
- `education` - Education history
- `training` - Training/course records  
- `work_experience` - Work experience records

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based route protection
- Input validation and sanitization

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Biodata (User)
- `GET /api/biodata` - Get user's biodata
- `POST /api/biodata` - Create biodata
- `PUT /api/biodata/:id` - Update own biodata
- `DELETE /api/biodata/:id` - Delete own biodata

### Admin Endpoints
- `GET /api/admin/biodata` - Get all biodata
- `GET /api/admin/biodata/:id` - Get specific biodata
- `PUT /api/admin/biodata/:id` - Update any biodata
- `DELETE /api/admin/biodata/:id` - Delete any biodata

## 📝 License

This project is for educational purposes.

## 👨‍💻 Developer

Developed by Yehezkiel Imannuel

---
*Simple and efficient employee biodata management system with role-based access control.*
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
├── frontend/              # React.js Application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── App.js        # Main App component
│   └── package.json      # Frontend dependencies
└── README.md
```

## 🛠️ Teknologi yang Digunakan

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Frontend

- **React.js** - UI library
- **React Router** - Navigation
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **React Icons** - Icons library

### Database

- **MySQL** - Relational database

## 📥 Instalasi dan Setup

### Prasyarat

- Node.js (v14 atau lebih baru)
- MySQL Server
- npm atau yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd mockup-application
```

### 2. Setup Database MySQL

1. Buat database baru dengan nama `biodata_app`
2. Database akan otomatis membuat tabel yang diperlukan saat server pertama kali dijalankan

### 3. Setup Backend

```bash
cd backend
npm install
```

Edit file `.env` sesuai dengan konfigurasi MySQL Anda:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=biodata_app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
```

## 🚀 Menjalankan Aplikasi

### 1. Jalankan Backend Server

```bash
cd backend
npm run dev
# atau
npm start
```

Server akan berjalan di http://localhost:5000

### 2. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend
npm start
```

Aplikasi akan berjalan di http://localhost:3000

## 📊 Database Schema

### Tabel Users

- id (Primary Key)
- email (Unique)
- password (Hashed)
- created_at

### Tabel Biodata

- id (Primary Key)
- user_id (Foreign Key)
- posisi, nama, no_ktp, tempat_lahir, tanggal_lahir
- jenis_kelamin, agama, golongan_darah, status
- alamat_ktp, alamat_tinggal, email, no_telp
- orang_terdekat, skill
- bersedia_ditempatkan, penghasilan_diharapkan
- created_at, updated_at

### Tabel Education

- id (Primary Key)
- biodata_id (Foreign Key)
- jenjang_pendidikan, nama_institusi, jurusan, tahun_lulus, ipk

### Tabel Training

- id (Primary Key)
- biodata_id (Foreign Key)
- nama_kursus, sertifikat, tahun

### Tabel Work_Experience

- id (Primary Key)
- biodata_id (Foreign Key)
- nama_perusahaan, posisi, pendapatan, tahun

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user

### Biodata CRUD

- `GET /api/biodata` - Get semua biodata user
- `POST /api/biodata` - Create biodata baru
- `PUT /api/biodata/:id` - Update biodata
- `DELETE /api/biodata/:id` - Delete biodata

## 🎯 Cara Penggunaan

1. **Registrasi/Login**: User harus membuat akun terlebih dahulu atau login dengan akun yang sudah ada
2. **Dashboard**: Setelah login, user akan melihat dashboard dengan ringkasan data
3. **Tambah Biodata**: Klik "Tambah Biodata" untuk mengisi form biodata lengkap
4. **Lihat Data**: Klik "Data Biodata" untuk melihat semua biodata yang telah dibuat
5. **Edit/Hapus**: Pada halaman Data Biodata, user dapat mengedit atau menghapus data
6. **Logout**: User dapat logout melalui tombol logout di navigasi

## 🎨 Tampilan & Fitur UI

- **Responsive Design**: Menggunakan Bootstrap untuk tampilan yang responsif
- **Form Validation**: Validasi input pada sisi client dan server
- **Modal Dialogs**: Modal untuk konfirmasi delete dan view detail
- **Dynamic Forms**: Dapat menambah/mengurangi entry untuk pendidikan, pelatihan, dan pengalaman kerja
- **Navigation**: Navigation bar yang intuitif
- **Alert Messages**: Feedback yang jelas untuk setiap aksi

## 🔧 Development

### Menambah Fitur Baru

1. Backend: Tambahkan route baru di `server.js`
2. Frontend: Buat komponen baru di folder `components`
3. Update routing di `App.js` jika diperlukan

### Testing

- Backend: `npm test` (belum diimplementasi)
- Frontend: `npm test`

## 📝 Notes

- Aplikasi ini dibuat sesuai dengan spesifikasi dan form yang ada pada lampiran
- Semua field dalam form biodata sudah sesuai dengan dokumen yang diberikan
- Database akan otomatis membuat tabel saat pertama kali server dijalankan
- JWT token berlaku selama 24 jam
- Password di-hash menggunakan bcrypt untuk keamanan

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
