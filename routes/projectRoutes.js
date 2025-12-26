const express = require("express");
const router = express.Router();
const user = require("../controllers/userProjectController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/", user.listProjects);
// router.get("/:id", user.projectDetails);

// router.post("/:id/book", isAuthenticated, user.bookProject);

// router.get("/dashboard/projects", isAuthenticated, user.userProjects);

// router.post("/quotation/accept/:id", isAuthenticated, user.acceptQuotation);

router.get("/dashboard/userProjects", isAuthenticated, user.userProjects);
router.post("/quotation/accept/:id", isAuthenticated, user.acceptQuotation);

router.get("/:id/book", isAuthenticated, user.showBookingForm);
router.post("/:id/book", isAuthenticated, user.bookProject);

router.get("/:id", user.projectDetails);


module.exports = router;
