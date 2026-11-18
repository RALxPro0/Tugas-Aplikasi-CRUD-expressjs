# Tugas Aplikasi CRUD Express.js — Task Tracker MVC

Aplikasi Manajemen Tugas (**Task Tracker**) untuk mengelola satu tabel (`tasks`) dengan fitur **CRUD (Create, Read, Update, Delete)** menggunakan **Express.js**, **MySQL (`mysql2`)**, **EJS**, dan **Tailwind CSS** dengan arsitektur **MVC (Model-View-Controller)**.

## Struktur Direktori

```text
Tugas-Aplikasi-CRUD-expressjs/
├── config/
│   └── database.js          # Konfigurasi koneksi pool MySQL & auto-init tabel
├── models/
│   └── taskModel.js         # Query SQL (SELECT, INSERT, UPDATE, DELETE)
├── controllers/
│   └── taskController.js    # Logika bisnis & penghubung Model ke View
├── routes/
│   └── taskRoutes.js        # Pemetaan endpoint URL (Express Router)
├── views/
│   └── index.ejs            # Antarmuka HTML + Tailwind CSS
├── database.sql             # Skema SQL (jika ingin import manual)
├── app.js                   # Entry point aplikasi Express
└── package.json
```

## Skema Tabel (`tasks`)

Database: `task_tracker_db` (dibuat otomatis saat aplikasi dijalankan pertama kali)

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT` | Primary Key |
| `title` | `VARCHAR(255)` | Judul tugas (Wajib) |
| `description` | `TEXT` | Deskripsi / catatan tugas |
| `priority` | `ENUM('Rendah', 'Sedang', 'Tinggi')` | Tingkat prioritas |
| `status` | `ENUM('Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai')` | Status pengerjaan |
| `due_date` | `DATE` | Tenggat waktu tugas |
| `created_at` | `TIMESTAMP` | Waktu pembuatan |
| `updated_at` | `TIMESTAMP` | Waktu pembaruan terakhir |

## Cara Menjalankan Aplikasi

1. Pastikan layanan **MySQL** (misalnya via XAMPP / Laragon / MySQL Server) sedang berjalan.
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server aplikasi:
   ```bash
   npm start
   ```
4. Buka browser dan akses:
   ```text
   http://localhost:3000
   ```

> **Catatan Konfigurasi Database:**
> Secara default aplikasi terhubung ke `localhost:3306` dengan user `root` dan password kosong (`""`). Jika menggunakan kredensial berbeda, buat file `.env` di root proyek:
> ```env
> PORT=3000
> DB_HOST=localhost
> DB_PORT=3306
> DB_USER=root
> DB_PASSWORD=
> DB_NAME=task_tracker_db
> ```
