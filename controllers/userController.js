const pool = require("../utils/db");
const cloudinary = require("../utils/cloudinary");

exports.getProfile = async (req, res) => {
  try {
    // Assuming you stored user info in session after login
    const userId = req.session.user?.id;

    if (!userId) {
      return res.redirect("/auth/login");
    }

    const result = await pool.query("SELECT * FROM users2 WHERE id = $1", [
      userId,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("public/profile", { user,
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



// ✅ Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, fullname, email, role FROM users2 ORDER BY created_at DESC"
    );
    res.render("admin/users", { users: result.rows, user: req.session.user, title: "Users | JKT E-Commerce",
      description: "Manage users on JKT E-Commerce",
      keywords: "online shopping, jkt, ecommerce", 
      ogImage: "/images/JKT logo bg.png",  });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
};

// ✅ Admin: Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users2 WHERE id = $1", [id]);
    res.redirect("/admin/users");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Server error");
  }
};

exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, role } = req.body;

    await pool.query(
      "UPDATE users2 SET fullname = $1, email = $2, role = $3 WHERE id = $4",
      [fullname, email, role, id]
    );

    res.redirect("/admin/users");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Server error");
  }
};

