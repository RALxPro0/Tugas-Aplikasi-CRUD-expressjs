const express = require('express');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk parsing request body (form HTML & JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Pemetaan routing utama aplikasi
app.use('/', taskRoutes);

// Menjalankan server setelah mencoba inisialisasi database MySQL
async function startServer() {
  await db.initDatabase();

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Server Task Tracker MVC berjalan di:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`==================================================`);
  });
}

startServer();