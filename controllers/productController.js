const pool = require("../utils/db");
const cloudinary = require("../utils/cloudinary");

// 🛍️ Show all products (for users)
// exports.getAllProducts = async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM products ORDER BY created_at DESC"
//     );
//     res.render("products/list", {
//       products: result.rows,
//       user: req.session.user,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).send("Server error");
//   }
// };

// exports.getAllProducts = async (req, res) => {
//   const products = await pool.query(`
//     SELECT products.*, categories.name AS category_name
//     FROM products
//     LEFT JOIN categories ON products.category_id = categories.id
//     ORDER BY products.created_at DESC
//   `);

//   const categories = await pool.query(
//     "SELECT * FROM categories ORDER BY name ASC"
//   );

//   res.render("admin/products", {
//     products: products.rows,
//     categories: categories.rows
//   });
// };

// 🛍️ Show all products (for users)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await pool.query(`
      SELECT products.*, categories.name AS category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      ORDER BY products.created_at DESC
    `);

    const categories = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );

    res.render("public/shop", {
      products: products.rows,
      categories: categories.rows,
      user: req.session.user
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
};



// 🧑‍💼 ADMIN: Get all products
// exports.getAllProductsAdmin = async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
//     res.render("admin/products", { products: result.rows, user: req.session.user });
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).send("Server error");
//   }
// };

// 🧑‍💼 ADMIN: Get all products
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await pool.query(`
      SELECT products.*, categories.name AS category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      ORDER BY products.id DESC
    `);

    const categories = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );

    res.render("admin/products", {
      title: "Product | JKT E-Commerce",
      description: "Manage products at affordable prices on JKT E-Commerce",
      keywords: "online shopping, jkt, ecommerce",
      products: products.rows,
      categories: categories.rows,
      user: req.session.user
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Server error");
  }
};


// 🧑‍💼 ADMIN: Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    let ImageUrl = null;
    if (req.file && req.file.path) {
          const upload = await cloudinary.uploader.upload(req.file.path, {
            folder: "JKT-ecommerce/products",
          });
          ImageUrl = upload.secure_url || null;
        }
    await pool.query(
      "INSERT INTO products (name, description, price, image_url, stock, category_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, description, price, ImageUrl, stock, category_id]
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
    const { name, description, price, stock, category_id } = req.body;
    let imageUrl = null;
    if (req.file && req.file.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "JKT-ecommerce/products",
      });

      imageUrl = uploadResult.secure_url;
    }

    await pool.query(
      "UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category_id=$5 WHERE id=$6",
      [name, description, price, stock, category_id, id]
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


// exports.getProductById = async (req, res) => {
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) return res.status(400).send("Invalid product ID");

//   try {
//     const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]); // ✅ use parsed id
//     if (result.rows.length === 0) {
//       return res.status(404).send("Product not found");
//     }

//     res.render("products/detail", {
//       product: result.rows[0],
//       user: req.session.user,
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).send("Server error");
//   }
// };

exports.getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send("Invalid product ID");

  try {
    const result = await pool.query(`
      SELECT products.*, categories.name AS category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.render("public/detail", {
      product: result.rows[0],
      user: req.session.user,
      title: "Product Detail | JKT E-Commerce",
    description: "Shop quality products at affordable prices on JKT E-Commerce",
    keywords: "online shopping, jkt, ecommerce"
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
};

