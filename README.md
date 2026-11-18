# Tugas Aplikasi CRUD Express.js — Task Tracker MVC

Aplikasi Manajemen Tugas (**Task Tracker**) untuk mengelola satu tabel (`tasks`) dengan fitur **CRUD (Create, Read, Update, Delete)** menggunakan **Express.js**, **MySQL (`mysql2`)**, **EJS**, dan **Tailwind CSS** dengan arsitektur **MVC (Model-View-Controller)**.

NIM    :255150719111001
NAMA   :Reza Abdul Latif

## Tampilan Aplikasi

<img width="1533" height="776" alt="Tampilan Dashboard Task Tracker" src="https://github.com/user-attachments/assets/cd972b20-63fd-480f-9c79-d5ffcab9ab7f" />

<img width="1535" height="783" alt="Tampilan Modal & Manajemen Tugas" src="https://github.com/user-attachments/assets/9f981c01-ebf7-494b-bb87-a3ca89641815" />

---

## 1. Struktur Direktori & Arsitektur MVC

```text
task-tracker-mvc/
├── config/
│   └── database.js          # Konfigurasi koneksi pool MySQL & inisialisasi tabel otomatis
├── models/
│   └── taskModel.js         # Query SQL (SELECT, INSERT, UPDATE, DELETE)
├── controllers/
│   └── taskController.js    # Logika bisnis & penghubung Model ke View
├── routes/
│   └── taskRoutes.js        # Pemetaan endpoint URL (Express Router)
├── views/
│   └── index.ejs            # Antarmuka HTML + EJS + Tailwind CSS
├── database.sql             # Skema SQL (jika ingin import manual)
├── app.js                   # Entry point aplikasi Express
└── package.json             # Konfigurasi paket & dependensi proyek
```

| Komponen | File Terkait | Peran & Tanggung Jawab |
| :--- | :--- | :--- |
| **Model (M)** | `models/taskModel.js` | Menangani komunikasi ke database MySQL menggunakan perintah SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`). |
| **View (V)** | `views/index.ejs` | Menampilkan antarmuka halaman web kepada pengguna, modal form tambah/edit, dan tabel data tugas. |
| **Controller (C)** | `controllers/taskController.js` | Menerima request dari *Routes*, memproses logika bisnis, memanggil *Model*, dan mengirim respon ke *View*. |

---

## 2. Skema Tabel Database (`tasks`)

Database: `task_tracker_db` (dibuat otomatis saat aplikasi dijalankan pertama kali)

| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT` | Primary Key |
| `title` | `VARCHAR(255)` | Judul tugas (Wajib) |
| `description` | `TEXT` | Deskripsi / catatan tugas |
| `priority` | `ENUM('Rendah', 'Sedang', 'Tinggi')` | Tingkat prioritas |
| `status` | `ENUM('Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai')` | Status pengerjaan |
| `start_date` | `DATE` | Tanggal mulai pengerjaan |
| `due_date` | `DATE` | Tenggat waktu akhir (Deadline) |
| `created_at` | `TIMESTAMP` | Waktu pembuatan |
| `updated_at` | `TIMESTAMP` | Waktu pembaruan terakhir |

---

## 3. Cara Menjalankan Aplikasi

1. Pastikan layanan **MySQL** (misalnya melalui XAMPP / Laragon / MySQL Server) sedang berjalan.
2. Instal dependensi proyek:
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

---

## 4. Penjelasan Kode Express.js

### A. Entry Point Aplikasi Express (`app.js`)
File utama yang menginisialisasi HTTP server **Express.js**, mengatur *template engine* EJS, memasang *middleware* pembaca form, dan menghubungkan file *routing*.

```javascript
const express = require('express');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Konfigurasi View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middleware untuk parsing request body (form HTML & JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Pemetaan routing utama aplikasi
app.use('/', taskRoutes);

// 4. Menjalankan server setelah inisialisasi database MySQL
async function startServer() {
  await db.initDatabase();
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

startServer();
```

**Penjelasan Bagian Kode Express di `app.js`:**
- `const app = express()`: Membuat instance aplikasi server Express.
- `app.set('view engine', 'ejs')`: Mengatur **EJS** sebagai template engine agar Express dapat me-render file `.ejs` di dalam folder `views/`.
- `app.use(express.urlencoded({ extended: true }))`: *Middleware* bawaan Express yang wajib digunakan untuk membaca data kiriman `<form method="POST">` ke dalam objek `req.body`.
- `app.use(express.json())`: *Middleware* untuk membaca data request berformat JSON.
- `app.use('/', taskRoutes)`: Mendaftarkan seluruh endpoint dari `routes/taskRoutes.js` pada path utama `/`.
- `app.listen(PORT, ...)`: Menjalankan HTTP server Express pada port `3000`.

---

### B. Pemetaan Endpoint URL (`routes/taskRoutes.js`)
Menggunakan **`express.Router()`** untuk memisahkan daftar URL dari `app.js` dan memetakannya ke fungsi di `taskController.js`.

```javascript
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// READ: Menampilkan halaman utama dan daftar seluruh tugas
router.get('/', taskController.index);

// CREATE: Menambahkan tugas baru
router.post('/tasks', taskController.store);

// UPDATE: Memperbarui detail tugas berdasarkan ID
router.post('/tasks/:id/update', taskController.update);

// UPDATE: Mengubah status tugas secara cepat
router.post('/tasks/:id/status', taskController.updateStatus);

// DELETE: Menghapus tugas berdasarkan ID
router.post('/tasks/:id/delete', taskController.destroy);

module.exports = router;
```

| Method & URL | Handler Controller | Fungsi CRUD |
| :--- | :--- | :--- |
| `GET /` | `taskController.index` | **READ**: Menampilkan halaman utama, statistik, & daftar tugas |
| `POST /tasks` | `taskController.store` | **CREATE**: Menyimpan tugas baru dari form |
| `POST /tasks/:id/update` | `taskController.update` | **UPDATE**: Memperbarui tugas berdasarkan parameter `:id` |
| `POST /tasks/:id/status` | `taskController.updateStatus` | **UPDATE**: Mengubah status pengerjaan secara cepat |
| `POST /tasks/:id/delete` | `taskController.destroy` | **DELETE**: Menghapus tugas berdasarkan parameter `:id` |

---

### C. Logika Bisnis & Penghubung (`controllers/taskController.js`)
Menerima objek **`req` (Request)** dan **`res` (Response)** dari Express.js untuk menghubungkan permintaan pengguna dengan database di Model serta tampilan di View.

```javascript
const taskController = {
  // READ: Mengambil data tugas & statistik lalu merender views/index.ejs
  async index(req, res) {
    const filters = {
      search: req.query.search || '',
      status: req.query.status || '',
      priority: req.query.priority || '',
    };
    const [tasks, stats] = await Promise.all([
      TaskModel.getAllTasks(filters),
      TaskModel.getTaskStats(),
    ]);
    return res.render('index', { tasks, stats, filters, ... });
  },

  // CREATE: Membaca req.body dari form lalu menyimpan ke database
  async store(req, res) {
    const { title, description, priority, status, start_date, due_date } = req.body;
    await TaskModel.createTask({ title, description, priority, status, start_date, due_date });
    return res.redirect('/?msg=' + encodeURIComponent('Tugas baru berhasil ditambahkan!'));
  },

  // UPDATE: Membaca req.params.id & req.body lalu memperbarui baris tugas
  async update(req, res) {
    const id = Number(req.params.id);
    const { title, description, priority, status, start_date, due_date } = req.body;
    await TaskModel.updateTask(id, { title, description, priority, status, start_date, due_date });
    return res.redirect('/?msg=' + encodeURIComponent('Data tugas berhasil diperbarui!'));
  },

  // DELETE: Menghapus baris tugas berdasarkan req.params.id
  async destroy(req, res) {
    const id = Number(req.params.id);
    await TaskModel.deleteTask(id);
    return res.redirect('/?msg=' + encodeURIComponent('Tugas berhasil dihapus!'));
  }
};
```

**Objek Express.js di dalam Controller:**
- `req.query`: Mengambil parameter query string pada URL (contoh: `?search=...&status=...&priority=...`).
- `req.body`: Mengambil data input form HTML yang dikirim lewat metode `POST` (`title`, `description`, `priority`, `status`, `start_date`, `due_date`).
- `req.params.id`: Mengambil nilai `:id` dari URL dinamis Express (contoh: `/tasks/5/update` menghasilkan `req.params.id = 5`).
- `res.render('index', data)`: Merender file `views/index.ejs` beserta variabel data dari database menjadi halaman HTML.
- `res.redirect('/?msg=...')`: Mengalihkan browser kembali ke halaman utama `/` setelah proses simpan, ubah, atau hapus selesai.

---

### D. Query SQL Database (`models/taskModel.js` & `config/database.js`)
Menjalankan 4 operasi utama CRUD ke MySQL menggunakan *Prepared Statements* (`db.execute(sql, params)`) dengan tanda tanya (`?`) agar aman dari *SQL Injection*:

```javascript
// 1. READ (SELECT)
const [rows] = await db.execute('SELECT * FROM tasks ORDER BY created_at DESC, id DESC');

// 2. CREATE (INSERT)
await db.execute(
  'INSERT INTO tasks (title, description, priority, status, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?)',
  [title, description, priority, status, start_date, due_date]
);

// 3. UPDATE
await db.execute(
  'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, start_date = ?, due_date = ? WHERE id = ?',
  [title, description, priority, status, start_date, due_date, id]
);

// 4. DELETE
await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
```

---

### E. Ringkasan Alur Kerja Request–Response Express.js (MVC)
1. **Request**: Pengguna mengakses URL atau mengirimkan form di browser (misalnya klik *Simpan Tugas* ke `POST /tasks`).
2. **Middleware (`app.js`)**: Express mem-parsing data form melalui `express.urlencoded({ extended: true })` ke dalam `req.body`.
3. **Router (`routes/taskRoutes.js`)**: Mencocokkan URL `POST /tasks` dan memanggil fungsi `taskController.store`.
4. **Controller (`controllers/taskController.js`)**: Memvalidasi input dari `req.body` lalu memanggil `TaskModel.createTask()`.
5. **Model (`models/taskModel.js`)**: Mengeksekusi query `INSERT INTO tasks` ke MySQL melalui connection pool di `config/database.js`.
6. **Response / View (`views/index.ejs`)**: Controller melakukan `res.redirect('/')` sehingga halaman utama memuat ulang data terbaru dan merendernya ke pengguna.
