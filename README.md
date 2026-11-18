# Tugas Aplikasi CRUD Express.js — Task Tracker MVC

Aplikasi Manajemen Tugas (**Task Tracker**) untuk mengelola satu tabel (`tasks`) dengan fitur **CRUD (Create, Read, Update, Delete)** menggunakan **Express.js**, **MySQL (`mysql2`)**, **EJS**, dan **Tailwind CSS** dengan arsitektur **MVC (Model-View-Controller)**.

**NIM** : 255150719111001  
**NAMA** : Reza Abdul Latif

---

## Tampilan Aplikasi

<img width="1535" height="783" alt="image" src="https://github.com/user-attachments/assets/f3e5c420-0bf5-4b52-ab18-3c11f3e906cf" />

<img width="1535" height="780" alt="image" src="https://github.com/user-attachments/assets/44780d9e-6f05-4b6b-8246-5e93991de617" />

<img width="1533" height="776" alt="Tampilan Dashboard Task Tracker" src="https://github.com/user-attachments/assets/cd972b20-63fd-480f-9c79-d5ffcab9ab7f" />

<img width="1535" height="783" alt="Tampilan Modal & Manajemen Tugas" src="https://github.com/user-attachments/assets/9f981c01-ebf7-494b-bb87-a3ca89641815" />

---

## Struktur Direktori (MVC)

```text
task-tracker-mvc/
├── config/
│   └── database.js          # Konfigurasi koneksi pool MySQL & auto-init tabel
├── models/
│   └── taskModel.js         # Query SQL (SELECT, INSERT, UPDATE, DELETE)
├── controllers/
│   └── taskController.js    # Logika bisnis & penghubung Model ke View
├── routes/
│   └── taskRoutes.js        # Pemetaan endpoint URL (Express Router)
├── views/
│   └── index.ejs            # Antarmuka HTML + EJS + Tailwind CSS
├── app.js                   # Entry point aplikasi Express
└── package.json             # Konfigurasi paket & dependensi
```

---

## Ringkasan Penjelasan Kode Express.js

1. **`app.js` (Entry Point)**
   - Menginisialisasi server dengan `const app = express()`.
   - Mengatur template engine `app.set('view engine', 'ejs')`.
   - Memasang middleware `app.use(express.urlencoded({ extended: true }))` untuk membaca data form HTML (`req.body`).
   - Menghubungkan routing utama `app.use('/', taskRoutes)` dan menjalankan server di port `3000`.

2. **`routes/taskRoutes.js` (Express Router)**
   Memetakan endpoint URL menggunakan `express.Router()` ke fungsi Controller:

   | Method & Endpoint | Handler Controller | Operasi CRUD |
   | :--- | :--- | :--- |
   | `GET /` | `taskController.index` | **READ** — Menampilkan dashboard, statistik, & daftar tugas |
   | `POST /tasks` | `taskController.store` | **CREATE** — Menambahkan tugas baru |
   | `POST /tasks/:id/update` | `taskController.update` | **UPDATE** — Memperbarui data tugas berdasarkan `:id` |
   | `POST /tasks/:id/status` | `taskController.updateStatus` | **UPDATE** — Mengubah status pengerjaan secara cepat |
   | `POST /tasks/:id/delete` | `taskController.destroy` | **DELETE** — Menghapus tugas berdasarkan `:id` |

3. **`controllers/taskController.js` (Controller)**
   - Menggunakan `req.query` untuk filter/pencarian, `req.body` untuk mengambil input form, dan `req.params.id` untuk menangkap parameter `:id` dari URL.
   - Menggunakan `res.render('index', data)` untuk menampilkan halaman EJS dan `res.redirect('/')` setelah proses simpan, ubah, atau hapus selesai.

4. **`models/taskModel.js` & `config/database.js` (Model & Database)**
   - Terhubung ke MySQL (`task_tracker_db`) menggunakan connection pool `mysql2/promise` serta membuat database & tabel `tasks` secara otomatis.
   - Mengeksekusi query `SELECT`, `INSERT`, `UPDATE`, dan `DELETE` menggunakan *Prepared Statements* (`db.execute(sql, params)`) agar aman dari *SQL Injection*.

---

## Cara Menjalankan Aplikasi

1. Pastikan layanan **MySQL** (XAMPP / Laragon) sedang berjalan.
2. Instal dependensi dan jalankan server:
   ```bash
   npm install
   npm start
   ```
3. Buka `http://localhost:3000` di browser.
