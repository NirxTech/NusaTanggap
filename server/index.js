const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'nusatanggap'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});

let otpStore = {}; // sementara, untuk menyimpan OTP per email
let otpResetStore = {}; // OTP khusus lupa password

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/api/send-otp", async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const otp = generateOTP();
  otpStore[email] = otp;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"NusaTanggap" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Kode Verifikasi NusaTanggap",
    html: `
      <body style="margin:0;padding:0;background:#f6f8fa;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#eff6ff 0%,#2563eb 100%);padding:32px;">
          <div style="max-width:420px;margin:auto;background:#fff;border-radius:20px;box-shadow:0 4px 24px rgba(37,99,235,0.08);padding:32px;">
            <div style="text-align:center;">
              <img src="https://i.ibb.co/rK6LSf4D/Logo-Nusa-Tanggap.png" alt="Logo NusaTanggap" style="height:40px;width:40px;margin-bottom:12px;border-radius:12px;box-shadow:0 2px 8px #2563eb22;display:inline-block;" />
              <h2 style="color:#2563eb;font-size:24px;font-weight:700;margin-bottom:8px;letter-spacing:1px;">Kode Verifikasi NusaTanggap</h2>
              <p style="color:#374151;font-size:15px;margin-bottom:20px;">
                Masukkan kode berikut untuk verifikasi email Anda:
              </p>
              <div style="display:inline-block;background:linear-gradient(90deg,#2563eb 60%,#1e40af 100%);border-radius:14px;padding:14px 32px;margin-bottom:20px;box-shadow:0 2px 8px #2563eb22;">
                <span style="font-size:32px;letter-spacing:10px;color:#fff;font-weight:700;font-family:'Segoe UI',Arial,sans-serif;">${otp}</span>
              </div>
              <p style="color:#6b7280;font-size:13px;margin-bottom:0;">
                Jangan bagikan kode ini kepada siapapun.<br/>
                Kode berlaku selama beberapa menit.
              </p>
            </div>
            <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb;" />
            <div style="text-align:center;color:#94a3b8;font-size:12px;">
              &copy; ${new Date().getFullYear()} NusaTanggap. Semua hak dilindungi.
            </div>
          </div>
        </div>
      </body>
    `
  };

  try {
    console.log("Mengirim OTP ke:", email);
    console.log("OTP yang dikirim:", otp);
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP dikirim!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengirim email." });
  }
});

app.post("/api/verify-otp", (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const otp = req.body.otp;
  console.log('Verifikasi OTP untuk email:', email, 'OTP:', otp);
  if (otpStore[email] === otp) {
    delete otpStore[email];
    db.query(
      "UPDATE users SET is_verified = 1 WHERE email = ?",
      [email],
      (err, result) => {
        console.log('Update result:', result);
        if (err) return res.status(500).json({ verified: false, message: "Gagal update status verifikasi" });
        if (result.affectedRows === 0) {
          return res.status(404).json({ verified: false, message: "Email tidak ditemukan" });
        }
        return res.json({ verified: true });
      }
    );
  } else {
    return res.status(400).json({ verified: false, message: "OTP salah atau kadaluarsa!" });
  }
});

app.post("/api/register", async (req, res) => {
  const { namaLengkap, email, nomorHP, kataSandi } = req.body;
  if (!namaLengkap || !email || !nomorHP || !kataSandi) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  // Cek email sudah terdaftar
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length > 0) {
        return res.status(400).json({ message: "Email sudah terdaftar" });
      }

      try {
        // Enkripsi password sebelum simpan
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(kataSandi, saltRounds);

        db.query(
          "INSERT INTO users (nama_lengkap, email, nomor_hp, password, kode_verifikasi, is_verified, created_at) VALUES (?, ?, ?, ?, '', 0, NOW())",
          [namaLengkap, email, nomorHP, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ message: "Gagal mendaftar" });
            res.json({ message: "Registrasi berhasil" });
          }
        );
      } catch (err) {
        return res.status(500).json({ message: "Gagal mengenkripsi password" });
      }
    }
  );
});

app.get("/api/user/:email", (req, res) => {
  const { email } = req.params;
  db.query(
    "SELECT nama_lengkap, email, nomor_hp FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(results[0]);
    }
  );
});

app.put("/api/user/:email", (req, res) => {
  const { email } = req.params;
  const { nama_lengkap, nomor_hp } = req.body;
  db.query(
    "UPDATE users SET nama_lengkap = ?, nomor_hp = ? WHERE email = ?",
    [nama_lengkap, nomor_hp, email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal update profil" });
      res.json({ message: "Profil berhasil diupdate" });
    }
  );
});

// Kirim OTP untuk reset password
app.post("/api/send-reset-otp", async (req, res) => {
  const { email } = req.body;
  // Cek apakah email terdaftar
  db.query("SELECT id FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Email tidak terdaftar" });

    const otp = generateOTP();
    otpResetStore[email] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"NusaTanggap" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Kode Reset Password NusaTanggap",
      html:  `
      <body style="margin:0;padding:0;background:#f6f8fa;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:linear-gradient(135deg,#eff6ff 0%,#2563eb 100%);padding:32px;">
          <div style="max-width:420px;margin:auto;background:#fff;border-radius:20px;box-shadow:0 4px 24px rgba(37,99,235,0.08);padding:32px;">
            <div style="text-align:center;">
              <img src="https://i.ibb.co/rK6LSf4D/Logo-Nusa-Tanggap.png" alt="Logo NusaTanggap" style="height:40px;width:40px;margin-bottom:12px;border-radius:12px;box-shadow:0 2px 8px #2563eb22;display:inline-block;" />
              <h2 style="color:#2563eb;font-size:24px;font-weight:700;margin-bottom:8px;letter-spacing:1px;">Kode Reset Password NusaTanggap</h2>
              <p style="color:#374151;font-size:15px;margin-bottom:20px;">
                Masukkan kode berikut untuk Reset Password Anda:
              </p>
              <div style="display:inline-block;background:linear-gradient(90deg,#2563eb 60%,#1e40af 100%);border-radius:14px;padding:14px 32px;margin-bottom:20px;box-shadow:0 2px 8px #2563eb22;">
                <span style="font-size:32px;letter-spacing:10px;color:#fff;font-weight:700;font-family:'Segoe UI',Arial,sans-serif;">${otp}</span>
              </div>
              <p style="color:#6b7280;font-size:13px;margin-bottom:0;">
                Jangan bagikan kode ini kepada siapapun.<br/>
                Kode berlaku selama beberapa menit.
              </p>
            </div>
            <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb;" />
            <div style="text-align:center;color:#94a3b8;font-size:12px;">
              &copy; ${new Date().getFullYear()} NusaTanggap. Semua hak dilindungi.
            </div>
          </div>
        </div>
      </body>
    `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "OTP reset password dikirim!" });
    } catch (err) {
      res.status(500).json({ message: "Gagal mengirim email." });
    }
  });
});

// Verifikasi OTP reset password
app.post("/api/verify-reset-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpResetStore[email] === otp) {
    delete otpResetStore[email];
    return res.json({ verified: true });
  }
  return res.status(400).json({ verified: false, message: "OTP salah!" });
});

// Update password baru
app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [hashedPassword, email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal update password" });
      res.json({ message: "Password berhasil direset" });
    }
  );
});

// Konfigurasi folder & nama file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pastikan folder uploads sudah ada
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post('/api/laporan', upload.single('foto'), (req, res) => {
  const {
    nama,
    email,
    judul,
    tanggal,
    kategori,
    deskripsi,
    lokasi
  } = req.body;

  const foto = req.file ? req.file.filename : null;
  const tanggal_lapor = new Date();

  const sql = `
    INSERT INTO laporan 
    (nama, email, judul, tanggal_kejadian, kategori, deskripsi, foto, lokasi, tanggal_lapor, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu')
  `;

  db.query(sql, [nama, email, judul, tanggal, kategori, deskripsi, foto, lokasi, tanggal_lapor], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Laporan berhasil dikirim!' });
  });
});

app.get('/api/laporan', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email diperlukan' });

  db.query(
    "SELECT * FROM laporan WHERE email = ? ORDER BY tanggal_lapor DESC",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Ambil semua laporan (untuk admin)
app.get('/api/laporan/all', (req, res) => {
  db.query("SELECT * FROM laporan ORDER BY tanggal_lapor DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Update status laporan (admin)
app.put('/api/laporan/:id/status', upload.single('bukti_foto'), (req, res) => {
  const { id } = req.params;
  const { status, bukti_lokasi, bukti_keterangan, alasan_ditolak } = req.body;
  const bukti_foto = req.file ? req.file.filename : null;

  // Validasi
  if (!status) {
    return res.status(400).json({ error: 'Status wajib diisi' });
  }
  if (status === 'selesai') {
    if (!bukti_foto || !bukti_lokasi || !bukti_keterangan) {
      return res.status(400).json({ error: 'Bukti foto, lokasi, dan keterangan wajib diisi untuk status selesai' });
    }
  }
  if (status === 'ditolak' && !alasan_ditolak) {
    return res.status(400).json({ error: 'Alasan penolakan wajib diisi' });
  }

  // Ambil email user dari laporan
  db.query("SELECT email FROM laporan WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ error: 'Laporan tidak ditemukan' });
    const userEmail = results[0].email;

    // Update laporan
    const updateFields = status === 'ditolak'
      ? [status, bukti_foto, bukti_lokasi, bukti_keterangan, alasan_ditolak, id]
      : status === 'selesai'
      ? [status, bukti_foto, bukti_lokasi, bukti_keterangan, id]
      : [status, id];
    const updateSql = status === 'ditolak'
      ? "UPDATE laporan SET status = ?, bukti_foto = ?, bukti_lokasi = ?, bukti_keterangan = ?, alasan_ditolak = ? WHERE id = ?"
      : status === 'selesai'
      ? "UPDATE laporan SET status = ?, bukti_foto = ?, bukti_lokasi = ?, bukti_keterangan = ? WHERE id = ?"
      : "UPDATE laporan SET status = ? WHERE id = ?";

    db.query(updateSql, updateFields, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // Notifikasi
      const notifTitle = status === 'ditolak'
        ? 'Laporan Ditolak'
        : status === 'selesai'
        ? 'Laporan Selesai'
        : 'Status Laporan Diubah';

      const notifMessage = status === 'ditolak'
        ? `Laporan Anda ditolak. Alasan: ${alasan_ditolak || '-'}`
        : status === 'selesai'
        ? 'Laporan Anda telah selesai diproses.'
        : `Status laporan Anda diubah menjadi ${status}.`;

      db.query(
        "INSERT INTO notifications (email, type, title, message) VALUES (?, ?, ?, ?)",
        [userEmail, status === 'ditolak' ? 'warning' : 'success', notifTitle, notifMessage]
      );

      res.json({ success: true });
    });
  });
});

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM admin WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Email atau password salah' });

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Email atau password salah' });

    delete admin.password;
    res.json(admin);
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Email atau password salah' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Email atau password salah' });

    delete user.password;
    res.json(user);
  });
});

app.get('/api/users/all', (req, res) => {
  db.query("SELECT id, nama_lengkap, email, nomor_hp, is_verified, created_at FROM users ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/stats', (req, res) => {
  const { year, month, kategori, status } = req.query;

  // Build WHERE clause
  let where = [];
  let params = [];

  if (year) {
    where.push("YEAR(tanggal_lapor) = ?");
    params.push(year);
  }
  if (month) {
    where.push("MONTH(tanggal_lapor) = ?");
    params.push(month);
  }
  if (kategori) {
    where.push("kategori = ?");
    params.push(kategori);
  }
  if (status) {
    where.push("status = ?");
    params.push(status);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // Stats Query
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM laporan ${whereClause}) AS total,
      (SELECT COUNT(*) FROM laporan ${whereClause.length ? whereClause + " AND status = 'menunggu'" : "WHERE status = 'menunggu'"}) AS menunggu,
      (SELECT COUNT(*) FROM laporan ${whereClause.length ? whereClause + " AND status = 'diproses'" : "WHERE status = 'diproses'"}) AS diproses,
      (SELECT COUNT(*) FROM laporan ${whereClause.length ? whereClause + " AND status = 'selesai'" : "WHERE status = 'selesai'"}) AS selesai,
      (SELECT COUNT(*) FROM laporan ${whereClause.length ? whereClause + " AND status = 'ditolak'" : "WHERE status = 'ditolak'"}) AS ditolak,
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM laporan WHERE DATE(tanggal_lapor) = CURDATE()) AS today
  `;

  db.query(statsQuery, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const stats = results[0];

    // Kategori statistik
    const kategoriQuery = `SELECT kategori, COUNT(*) as jumlah FROM laporan ${whereClause} GROUP BY kategori`;
    db.query(kategoriQuery, params, (err, kategoriResults) => {
      if (err) return res.status(500).json({ error: err.message });

      const kategoriStats = {};
      kategoriResults.forEach(row => {
        kategoriStats[row.kategori] = row.jumlah;
      });

      // Monthly statistik
      const monthlyQuery = `
        SELECT 
          DATE_FORMAT(tanggal_lapor, '%Y-%m') AS bulan,
          COUNT(*) as jumlah 
        FROM laporan 
        ${whereClause}
        GROUP BY bulan 
        ORDER BY bulan DESC
        LIMIT 6
      `;
      db.query(monthlyQuery, params, (err, monthlyResults) => {
        if (err) return res.status(500).json({ error: err.message });

        // Trend statistik
        const trendQuery = `
          SELECT 
            DATE(tanggal_lapor) AS tanggal,
            COUNT(*) as jumlah 
          FROM laporan 
          ${whereClause}
          GROUP BY tanggal 
          ORDER BY tanggal DESC
          LIMIT 7
        `;
        db.query(trendQuery, params, (err, trendResults) => {
          if (err) return res.status(500).json({ error: err.message });

          // Format hasil trend
          const trend = trendResults.map(row => ({ tanggal: row.tanggal, jumlah: row.jumlah }));

          res.json({
            stats: {
              total: stats.total,
              menunggu: stats.menunggu,
              diproses: stats.diproses,
              selesai: stats.selesai,
              ditolak: stats.ditolak,
              users: stats.users,
              today: stats.today,
              kategori: kategoriStats
            },
            monthly: monthlyResults,
            pie: {
              menunggu: stats.menunggu,
              diproses: stats.diproses,
              selesai: stats.selesai,
              ditolak: stats.ditolak
            },
            trend: trend
          });
        });
      });
    });
  });
});

app.get('/api/notifications', (req, res) => {
  const { email } = req.query;
  db.query(
    "SELECT * FROM notifications WHERE email = ? ORDER BY date DESC LIMIT 30",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.patch('/api/notifications/mark-all-read', (req, res) => {
  const email = req.query.email;
  db.query('UPDATE notifications SET isRead=1 WHERE email=?', [email], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});
