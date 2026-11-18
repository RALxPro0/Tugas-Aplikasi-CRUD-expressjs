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
