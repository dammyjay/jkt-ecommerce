const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const userController = require("../controllers/userController");

// Profile page route
router.get("/profile", getProfile);

// Admin routes
router.get("/", userController.getAllUsers);
// router.post("/:id/delete", userController.deleteUser);
router.post("/users/:id/edit", userController.editUser);
router.post("/users/:id/delete", userController.deleteUser);


module.exports = router;


