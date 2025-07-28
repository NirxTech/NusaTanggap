const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Pindahkan koneksi database ke sini ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'nusatanggap'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected!');
});
// -------------------------------------------

let otpStore = {}; // sementara, untuk menyimpan OTP per email
let otpResetStore = {}; // OTP khusus lupa password

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
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
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ verified: true });
  }
  return res.status(400).json({ verified: false, message: "OTP salah!" });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
