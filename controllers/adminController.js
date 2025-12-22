const pool = require("../utils/db");
const cloudinary = require("../utils/cloudinary");

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await pool.query("SELECT COUNT(*) FROM products");
    const totalOrders = await pool.query("SELECT COUNT(*) FROM orders");
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users2");
    const totalSales = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total_sales FROM orders WHERE status='completed'"
    );

    res.render("admin/dashboard", {
      title: "Dashboard | JKT E-Commerce",
      description: "Shop quality products at affordable prices on JKT E-Commerce",
      keywords: "online shopping, jkt, ecommerce",
      ogImage: "/images/JKT logo bg.png",
      user: req.session.user,
      stats: {
        totalProducts: totalProducts.rows[0].count,
        totalOrders: totalOrders.rows[0].count,
        totalUsers: totalUsers.rows[0].count,
        totalSales: totalSales.rows[0].total_sales || 0,
      },
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.status(500).send("Error loading admin dashboard");
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Assuming you stored user info in session after login
    const userId = req.session.user?.id;

    if (!userId) {
      return res.redirect("/login");
    }

    const result = await pool.query("SELECT * FROM users2 WHERE id = $1", [
      userId,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("public/profile", { 
      user,
      title: "Profile | JKT E-Commerce",
      description: "Shop quality products at affordable prices on JKT E-Commerce",
      keywords: "online shopping, jkt, ecommerce",
      ogImage: "/images/JKT logo bg.png",
     }); // your ejs file for profile
      
  } catch (error) {
    console.error("❌ Error loading profile:", error);
    res.status(500).send("Server error");
  }
};

// ✅ Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect("/auth/login");

    const { fullname, phone, address, city, state } = req.body;
    let profileImageUrl = null;

    if (req.file && req.file.path) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "JKT-ecommerce/users",
      });
      profileImageUrl = upload.secure_url;
    }

    await pool.query(
      `UPDATE users2 
       SET fullname = $1, phone = $2, address = $3, city = $4, state = $5,
           profile_image = COALESCE($6, profile_image)
       WHERE id = $7`,
      [fullname, phone, address, city, state, profileImageUrl, userId]
    );

    console.log("✅ Profile updated successfully");

    // Refresh session user data after update
    const updatedUser = await pool.query("SELECT * FROM users2 WHERE id = $1", [
      userId,
    ]);
    req.session.user = updatedUser.rows[0];

    res.redirect("/users/profile");
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).send("Server error");
  }
};
