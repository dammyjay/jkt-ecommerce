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
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


// Admin Dashboard (protected)
router.get("/dashboard", isAdmin, adminController.getDashboard);
// Profile page route
router.get("/profile", adminController.getProfile);

// Update profile
router.post("/profile", upload.single("profileImage"), adminController.updateProfile);


// ✅ Admin Products Page
router.get("/products", isAdmin, productController.getAllProductsAdmin);

// ✅ Admin Orders Page
router.get("/orders", isAdmin, orderController.getAllOrdersAdmin);

router.get("/users", isAdmin, userController.getAllUsers);
router.post("/users/:id/edit", isAdmin, userController.editUser);
router.post("/users/:id/delete", isAdmin, userController.deleteUser);


module.exports = router;
