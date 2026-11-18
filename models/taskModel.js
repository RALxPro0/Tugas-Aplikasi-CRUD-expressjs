const db = require('../config/database');

const TaskModel = {
  /**
   * READ (SELECT) - Mengambil semua data tugas dengan opsi filter & pencarian
   */
  async getAllTasks({ search = '', status = '', priority = '' } = {}) {
    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (search && search.trim() !== '') {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword);
    }

    if (status && status.trim() !== '') {
      sql += ' AND status = ?';
      params.push(status.trim());
    }

    if (priority && priority.trim() !== '') {
      sql += ' AND priority = ?';
      params.push(priority.trim());
    }

    sql += ' ORDER BY created_at DESC, id DESC';

    const [rows] = await db.execute(sql, params);
    return rows;
  },

  /**
   * READ (SELECT) - Mengambil statistik ringkasan jumlah tugas per status
   */
  async getTaskStats() {
    const sql = `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Belum Dikerjakan' THEN 1 ELSE 0 END) AS todo,
        SUM(CASE WHEN status = 'Sedang Dikerjakan' THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) AS completed
      FROM tasks
    `;
    const [rows] = await db.execute(sql);
    const stats = rows[0] || {};
    return {
      total: Number(stats.total) || 0,
      todo: Number(stats.todo) || 0,
      inProgress: Number(stats.in_progress) || 0,
      completed: Number(stats.completed) || 0,
    };
  },

  /**
   * READ (SELECT) - Mengambil satu tugas berdasarkan ID
   */
  async getTaskById(id) {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
  },

  /**
   * CREATE (INSERT) - Menambahkan tugas baru ke tabel `tasks`
   */
  async createTask({ title, description, priority, status, start_date, due_date }) {
    const sql = `
      INSERT INTO tasks (title, description, priority, status, start_date, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      title.trim(),
      description ? description.trim() : null,
      priority || 'Sedang',
      status || 'Belum Dikerjakan',
      start_date || null,
      due_date || null,
    ];

    try {
      const [result] = await db.execute(sql, params);
      return result.insertId;
    } catch (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        await db.initDatabase();
        const [result] = await db.execute(sql, params);
        return result.insertId;
      }
      throw err;
    }
  },

  /**
   * UPDATE - Memperbarui data tugas berdasarkan ID
   */
  async updateTask(id, { title, description, priority, status, start_date, due_date }) {
    const sql = `
      UPDATE tasks
      SET title = ?, description = ?, priority = ?, status = ?, start_date = ?, due_date = ?
      WHERE id = ?
    `;
    const params = [
      title.trim(),
      description ? description.trim() : null,
      priority || 'Sedang',
      status || 'Belum Dikerjakan',
      start_date || null,
      due_date || null,
      id,
    ];

    try {
      const [result] = await db.execute(sql, params);
      return result.affectedRows > 0;
    } catch (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        await db.initDatabase();
        const [result] = await db.execute(sql, params);
        return result.affectedRows > 0;
      }
      throw err;
    }
  },

  /**
   * UPDATE - Mengubah status tugas secara cepat berdasarkan ID
   */
  async updateTaskStatus(id, status) {
    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
    const [result] = await db.execute(sql, [status, id]);
    return result.affectedRows > 0;
  },

  /**
   * DELETE - Menghapus tugas dari tabel `tasks` berdasarkan ID
   */
  async deleteTask(id) {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    const [result] = await db.execute(sql, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = TaskModel;