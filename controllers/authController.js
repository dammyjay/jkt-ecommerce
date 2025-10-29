


// controllers/authController.js
const pool = require("../utils/db");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../utils/cloudinary");

const ADMIN_EMAIL = "admin@jkthub.com";
const ADMIN_PASSWORD = "admin123";

// ================== SIGNUP ==================
// const signup = async (req, res) => {
//   try {
//     const { fullname, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await pool.query("SELECT * FROM users2 WHERE email = $1", [email]);
//     if (existingUser.rowCount > 0) {
//       return res.render("public/signup", { message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await pool.query(
//       "INSERT INTO users2 (fullname, email, password, otp, role) VALUES ($1, $2, $3, $4, $5)",
//       [fullname, email, hashedPassword, otp, "user"]
//     );

//     await sendEmail(email, "Verify Your JKT Hub Account", `<p>Your OTP code is <b>${otp}</b></p>`);

//     res.render("public/verifyOtp", {
//       email,
//       message: "Check your email for the OTP we just sent.",
//       user: null,
//     });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.render("public/signup", { message: "Something went wrong, please try again." });
//   }
// };

const signup = async (req, res) => {
  try {
    console.log("🟢 Signup request received");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { fullname, email, password } = req.body;
    const file = req.file;

    if (!fullname || !email || !password) {
      console.log("❌ Missing required fields");
      return res
        .status(400)
        .json({
          message: "All fields are required (fullname, email, password).",
        });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users2 WHERE email = $1",
      [email]
    );
    if (existingUser.rowCount > 0) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("📨 Generated OTP:", otp);

    let profileImage = null;
    if (file && file.path) {
      console.log("☁️ Uploading to Cloudinary...");
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "JKT-ecommerce/users",
      });
      profileImage = upload.secure_url;
      console.log("✅ Uploaded:", profileImage);
    }

    await pool.query(
      `INSERT INTO users2 (fullname, email, password, otp, role, profile_image)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [fullname, email, hashedPassword, otp, "user", profileImage]
    );

    console.log("✅ User inserted into DB");

    await sendEmail(
      email,
      "Verify Your JKT Hub Account",
      `<p>Your OTP code is <b>${otp}</b></p>`
    );
    console.log("📧 Email sent to:", email);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({
      message: "Signup failed. Please try again.",
      error: error.message,
    });
  }
};




// ================== VERIFY OTP ==================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await pool.query("SELECT * FROM users2 WHERE email=$1 AND otp=$2", [email, otp]);

    if (result.rowCount === 0) {
      return res.render("public/verifyOtp", { email, message: "Invalid OTP", user: null });
    }

    await pool.query("UPDATE users2 SET is_verified=true, otp=NULL WHERE email=$1", [email]);

    res.render("public/login", {
      message: "✅ Verification successful. Please log in.",
      user: null,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.render("public/verifyOtp", { email, message: "Something went wrong", user: null });
  }
};

// ================== LOGIN ==================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      req.session.user = { fullname: "Admin", email, role: "admin" };
      return res.redirect("/admin/orders");
    }

    // Regular user login
    const result = await pool.query("SELECT * FROM users2 WHERE email=$1", [email]);
    if (result.rowCount === 0) {
      return res.render("public/login", { message: "No user found", user: null });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.render("public/login", { message: "Incorrect password", user: null });
    }

    if (!user.is_verified) {
      return res.render("public/verifyOtp", {
        email,
        message: "Please verify your account first",
        user: null,
      });
    }

    req.session.user = user;

    // Redirect by role
    if (user.role === "admin") {
      res.redirect("/admin/orders");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.render("public/login", { message: "Login failed, please try again.", user: null });
  }
};

// ================== LOGOUT ==================
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};

// ✅ Export all functions
module.exports = { signup, verifyOtp, login, logout };
