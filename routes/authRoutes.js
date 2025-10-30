// const express = require("express");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const {
//   signup,
//   verifyOtp,
//   login,
//   logout,
// } = require("../controllers/authController");
// const passport = require("../utils/passportSetup");

// const router = express.Router();

// router.get("/signup", (req, res) => res.render("public/signup"));
// router.get("/login", (req, res) => res.render("public/login"));
// router.get("/verifyOtp", (req, res) => res.render("public/verifyOtp"));

// // router.post("/signup", signup);
// router.post("/signup", upload.single("profileImage"), signup);
// router.post("/verifyOtp", verifyOtp);
// router.post("/login", login);
// router.get("/logout", logout);


// // Google OAuth
// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/auth/login" }),
//   (req, res) => res.redirect("/")
// );

// // Facebook OAuth
// router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/auth/login" }),
//   (req, res) => res.redirect("/")
// );

// // LinkedIn OAuth
// router.get("/linkedin", passport.authenticate("linkedin", { state: true }));
// router.get(
//   "/linkedin/callback",
//   passport.authenticate("linkedin", { failureRedirect: "/auth/login" }),
//   (req, res) => res.redirect("/")
// );


// module.exports = router;



const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const passport = require("../utils/passportSetup");
const {
  signup,
  verifyOtp,
  login,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// ---------- Page Routes ----------
router.get("/signup", (req, res) => res.render("public/signup"));
router.get("/login", (req, res) => res.render("public/login"));
router.get("/verifyOtp", (req, res) => res.render("public/verifyOtp"));

// ---------- Auth Actions ----------
router.post("/signup", upload.single("profileImage"), signup);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.get("/logout", logout);

// ---------- GOOGLE OAUTH ----------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }), // ✅ fixed redirect path
  (req, res) => {
    res.redirect("/"); // ✅ redirect user to profile or homepage after login
  }
);

// ---------- FACEBOOK OAUTH ----------
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }), // ✅ fixed
  (req, res) => {
    res.redirect("/");
  }
);

// ---------- LINKEDIN OAUTH ----------
router.get("/linkedin", passport.authenticate("linkedin", { state: true }));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }), // ✅ fixed
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
