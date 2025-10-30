const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// 🌐 Public & User Routes
router.get("/", productController.getAllProducts); // Everyone can see products
router.get("/:id", productController.getProductById);

// 🧑‍💼 ADMIN ROUTES (single view for CRUD)
router.get("/admin/manage", isAdmin, productController.getAllProductsAdmin);
router.post("/admin/create", isAdmin, productController.createProduct);
router.post("/admin/:id/update", isAdmin, productController.updateProduct);
router.post("/admin/:id/delete", isAdmin, productController.deleteProduct);

module.exports = router;
