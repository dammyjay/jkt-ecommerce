const pool = require("../utils/db");

/* Get all categories */
exports.getAllCategories = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM categories ORDER BY name ASC"
  );
  return rows;
};

/* Create category */
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.redirect("back");
  }

  try {
    await pool.query(
      "INSERT INTO categories (name) VALUES ($1)",
      [name]
    );
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    res.redirect("back");
  }
};
