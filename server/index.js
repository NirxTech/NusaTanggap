const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
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
    text: `Kode verifikasi Anda adalah: ${otp}`,
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

app.post("/api/register", (req, res) => {
  const { namaLengkap, email, nomorHP, kataSandi } = req.body;
  if (!namaLengkap || !email || !nomorHP || !kataSandi) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  // Cek email sudah terdaftar
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length > 0) {
        return res.status(400).json({ message: "Email sudah terdaftar" });
      }

      // Isi kode_verifikasi dengan string kosong atau null jika belum ada OTP
      db.query(
        "INSERT INTO users (nama_lengkap, email, nomor_hp, password, kode_verifikasi, is_verified, created_at) VALUES (?, ?, ?, ?, '', 0, NOW())",
        [namaLengkap, email, nomorHP, kataSandi],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Gagal mendaftar" });
          res.json({ message: "Registrasi berhasil" });
        }
      );
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
