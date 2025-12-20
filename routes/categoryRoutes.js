const express = require("express");
const router = express.Router();
const { createCategory } = require("../controllers/categoryController");

router.post("/admin/categories/create", createCategory);

module.exports = router;
