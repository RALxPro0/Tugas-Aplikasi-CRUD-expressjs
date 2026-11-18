-- ==========================================================
-- Skema Database: Task Tracker MVC (Express.js + MySQL)
-- Catatan: Database & tabel ini juga dibuat otomatis saat
-- aplikasi dijalankan pertama kali (lihat config/database.js)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `task_tracker_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `task_tracker_db`;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `priority` ENUM('Rendah', 'Sedang', 'Tinggi') NOT NULL DEFAULT 'Sedang',
  `status` ENUM('Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai') NOT NULL DEFAULT 'Belum Dikerjakan',
  `start_date` DATE DEFAULT NULL,
  `due_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data Awal (Opsional)
INSERT INTO `tasks` (`title`, `description`, `priority`, `status`, `start_date`, `due_date`) VALUES
('Membuat Struktur Proyek MVC Express.js', 'Menyiapkan folder config, models, controllers, routes, dan views sesuai arsitektur MVC.', 'Tinggi', 'Selesai', '2026-11-18', '2026-11-18'),
('Implementasi CRUD pada Tabel Tasks', 'Menulis query SELECT, INSERT, UPDATE, dan DELETE menggunakan mysql2 connection pool.', 'Tinggi', 'Sedang Dikerjakan', '2026-11-18', '2026-11-20'),
('Mendesain Antarmuka dengan Tailwind CSS', 'Membuat halaman responsif di views/index.ejs dengan fitur filter, pencarian, dan modal edit.', 'Sedang', 'Belum Dikerjakan', '2026-11-18', '2026-11-23');
