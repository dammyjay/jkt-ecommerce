const pool = require("../utils/db");

// 🛍️ Show all products (for users)
exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.render("products/list", {
      products: result.rows,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
};


// 🧑‍💼 ADMIN: Get all products
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.render("admin/products", { products: result.rows, user: req.session.user });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server error");
  }
};

// 🧑‍💼 ADMIN: Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    await pool.query(
      "INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4)",
      [name, description, price, stock]
    );
    res.redirect("/products/admin/manage");
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).send("Server error");
  }
};

// 🧑‍💼 ADMIN: Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    await pool.query(
      "UPDATE products SET name=$1, description=$2, price=$3, stock=$4 WHERE id=$5",
      [name, description, price, stock, id]
    );
    res.redirect("/products/admin/manage");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Server error");
  }
};

// 🧑‍💼 ADMIN: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    res.redirect("/products/admin/manage");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Server error");
  }
};

// 🧾 View single product (user)
exports.getProductById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      req.params.id,
    ]);
    res.render("products/detail", {
      product: result.rows[0],
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
};
