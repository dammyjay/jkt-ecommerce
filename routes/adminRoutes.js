// const express = require("express");
// const router = express.Router();
// const adminController = require("../controllers/adminController");



// // Admin Dashboard
// router.get("/dashboard", adminController.getDashboard);

// module.exports = router;


const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");


// Admin Dashboard (protected)
router.get("/dashboard", isAdmin, adminController.getDashboard);


// ✅ Admin Products Page
router.get("/products", isAdmin, productController.getAllProductsAdmin);

// ✅ Admin Orders Page
router.get("/orders", isAdmin, orderController.getAllOrdersAdmin);


module.exports = router;
