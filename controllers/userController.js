const pool = require("../utils/db");

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

    res.render("userProfile", { user }); // your ejs file for profile
  } catch (error) {
    console.error("❌ Error loading profile:", error);
    res.status(500).send("Server error");
  }
};


// ✅ Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, fullname, email, role FROM users2 ORDER BY created_at DESC"
    );
    res.render("admin/users", { users: result.rows, user: req.session.user });
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

