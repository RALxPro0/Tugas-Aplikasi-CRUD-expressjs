const TaskModel = require('../models/taskModel');
const db = require('../config/database');

const VALID_PRIORITIES = ['Rendah', 'Sedang', 'Tinggi'];
const VALID_STATUSES = ['Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai'];

const taskController = {
  /**
   * Menampilkan halaman utama daftar tugas beserta statistik & form
   */
  async index(req, res) {
    const filters = {
      search: req.query.search || '',
      status: req.query.status || '',
      priority: req.query.priority || '',
    };
    const editId = req.query.editId ? Number(req.query.editId) : null;
    const message = req.query.msg || null;
    let error = req.query.error || null;

    try {
      const [tasks, stats, taskToEdit] = await Promise.all([
        TaskModel.getAllTasks(filters),
        TaskModel.getTaskStats(),
        editId ? TaskModel.getTaskById(editId) : Promise.resolve(null),
      ]);

      return res.render('index', {
        tasks,
        stats,
        filters,
        taskToEdit,
        message,
        error,
        dbConnected: true,
      });
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE' || err.code === 'ER_BAD_DB_ERROR') {
        const initialized = await db.initDatabase();
        if (initialized) {
          return res.redirect('/');
        }
      }

      console.error('[Controller] Error saat memuat daftar tugas:', err.message);
      error =
        error ||
        `Gagal terhubung ke database MySQL (${err.code || err.message}). Pastikan layanan MySQL sedang berjalan.`;

      return res.render('index', {
        tasks: [],
        stats: { total: 0, todo: 0, inProgress: 0, completed: 0 },
        filters,
        taskToEdit: null,
        message: null,
        error,
        dbConnected: false,
      });
    }
  },

  /**
   * Menyimpan tugas baru (CREATE)
   */
  async store(req, res) {
    try {
      const { title, description, priority, status, start_date, due_date } = req.body;

      if (!title || title.trim() === '') {
        return res.redirect('/?error=' + encodeURIComponent('Judul tugas wajib diisi!'));
      }

      const cleanPriority = VALID_PRIORITIES.includes(priority) ? priority : 'Sedang';
      const cleanStatus = VALID_STATUSES.includes(status) ? status : 'Belum Dikerjakan';

      await TaskModel.createTask({
        title,
        description,
        priority: cleanPriority,
        status: cleanStatus,
        start_date: start_date || null,
        due_date: due_date || null,
      });

      return res.redirect('/?msg=' + encodeURIComponent('Tugas baru berhasil ditambahkan!'));
    } catch (err) {
      console.error('[Controller] Error saat menambah tugas:', err.message);
      return res.redirect(
        '/?error=' + encodeURIComponent('Gagal menambahkan tugas: ' + err.message)
      );
    }
  },

  /**
   * Memperbarui data tugas berdasarkan ID (UPDATE)
   */
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const { title, description, priority, status, start_date, due_date } = req.body;

      if (!id || !title || title.trim() === '') {
        return res.redirect('/?error=' + encodeURIComponent('ID dan judul tugas wajib valid!'));
      }

      const cleanPriority = VALID_PRIORITIES.includes(priority) ? priority : 'Sedang';
      const cleanStatus = VALID_STATUSES.includes(status) ? status : 'Belum Dikerjakan';

      const updated = await TaskModel.updateTask(id, {
        title,
        description,
        priority: cleanPriority,
        status: cleanStatus,
        start_date: start_date || null,
        due_date: due_date || null,
      });

      if (!updated) {
        return res.redirect('/?error=' + encodeURIComponent('Tugas tidak ditemukan!'));
      }

      return res.redirect('/?msg=' + encodeURIComponent('Data tugas berhasil diperbarui!'));
    } catch (err) {
      console.error('[Controller] Error saat memperbarui tugas:', err.message);
      return res.redirect(
        '/?error=' + encodeURIComponent('Gagal memperbarui tugas: ' + err.message)
      );
    }
  },

  /**
   * Mengubah status tugas secara cepat (UPDATE Status)
   */
  async updateStatus(req, res) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      if (!id || !VALID_STATUSES.includes(status)) {
        return res.redirect('/?error=' + encodeURIComponent('Status tugas tidak valid!'));
      }

      await TaskModel.updateTaskStatus(id, status);
      return res.redirect('/?msg=' + encodeURIComponent(`Status tugas diubah menjadi "${status}"!`));
    } catch (err) {
      console.error('[Controller] Error saat mengubah status:', err.message);
      return res.redirect(
        '/?error=' + encodeURIComponent('Gagal mengubah status tugas: ' + err.message)
      );
    }
  },

  /**
   * Menghapus tugas berdasarkan ID (DELETE)
   */
  async destroy(req, res) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return res.redirect('/?error=' + encodeURIComponent('ID tugas tidak valid!'));
      }

      const deleted = await TaskModel.deleteTask(id);
      if (!deleted) {
        return res.redirect('/?error=' + encodeURIComponent('Tugas tidak ditemukan!'));
      }

      return res.redirect('/?msg=' + encodeURIComponent('Tugas berhasil dihapus!'));
    } catch (err) {
      console.error('[Controller] Error saat menghapus tugas:', err.message);
      return res.redirect(
        '/?error=' + encodeURIComponent('Gagal menghapus tugas: ' + err.message)
      );
    }
  },
};

module.exports = taskController;