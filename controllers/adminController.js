const pool = require("../utils/db");

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await pool.query("SELECT COUNT(*) FROM products");
    const totalOrders = await pool.query("SELECT COUNT(*) FROM orders");
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users2");
    const totalSales = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total_sales FROM orders WHERE status='completed'"
    );

    res.render("admin/dashboard", {
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
