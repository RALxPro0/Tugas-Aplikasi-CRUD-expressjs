const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_tracker_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true, // Mengembalikan kolom DATE/DATETIME sebagai string (YYYY-MM-DD)
};

// Membuat connection pool MySQL
const pool = mysql.createPool(dbConfig);

/**
 * Inisialisasi database & tabel `tasks` secara otomatis
 * jika belum tersedia di server MySQL.
 */
async function initDatabase() {
  let connection;
  try {
    // Koneksi awal tanpa nama database untuk memastikan database sudah dibuat
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();

    // Cek apakah tabel tasks sudah ada sebelumnya
    const [existingTables] = await pool.query(`SHOW TABLES LIKE 'tasks'`);
    const isFirstTimeSetup = existingTables.length === 0;

    // Buat tabel tasks jika belum ada
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        priority ENUM('Rendah', 'Sedang', 'Tinggi') NOT NULL DEFAULT 'Sedang',
        status ENUM('Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai') NOT NULL DEFAULT 'Belum Dikerjakan',
        start_date DATE DEFAULT NULL,
        due_date DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createTableQuery);

    // Pastikan kolom start_date tersedia jika tabel sudah dibuat sebelumnya
    const [startDateCol] = await pool.query(`SHOW COLUMNS FROM tasks LIKE 'start_date'`);
    if (startDateCol.length === 0) {
      await pool.query(`ALTER TABLE tasks ADD COLUMN start_date DATE DEFAULT NULL AFTER status`);
      await pool.query(`UPDATE tasks SET start_date = DATE(created_at) WHERE start_date IS NULL`);
    }

    // Tambahkan data contoh hanya saat tabel pertama kali dibuat
    if (isFirstTimeSetup) {
      await pool.query(`
        INSERT INTO tasks (title, description, priority, status, start_date, due_date) VALUES
        ('Membuat Struktur Proyek MVC Express.js', 'Menyiapkan folder config, models, controllers, routes, dan views sesuai arsitektur MVC.', 'Tinggi', 'Selesai', CURDATE(), CURDATE()),
        ('Implementasi CRUD pada Tabel Tasks', 'Menulis query SELECT, INSERT, UPDATE, dan DELETE menggunakan mysql2 connection pool.', 'Tinggi', 'Sedang Dikerjakan', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
        ('Mendesain Antarmuka dengan Tailwind CSS', 'Membuat halaman responsif di views/index.ejs dengan fitur filter, pencarian, dan modal edit.', 'Sedang', 'Belum Dikerjakan', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY))
      `);
      console.log('[Database] Tabel `tasks` berhasil dibuat beserta 3 data contoh awal.');
    }

    console.log(`[Database] Terhubung ke MySQL (${dbConfig.host}:${dbConfig.port}/${dbConfig.database})`);
    return true;
  } catch (error) {
    if (connection) {
      try {
        await connection.end();
      } catch (_) {}
    }
    console.error('[Database] Gagal terhubung ke MySQL:', error.message);
    console.error('Pastikan layanan MySQL (XAMPP / Laragon / MySQL Server) sedang berjalan.');
    return false;
  }
}

pool.initDatabase = initDatabase;
pool.dbConfig = dbConfig;

module.exports = pool;