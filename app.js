// app.js
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const layout = require("express-ejs-layouts");
const pool = require("./utils/db");
const createTables = require("./utils/initTables");
const passport = require("./utils/passportSetup");
// const session = require("express-session");
// Load environment variables
dotenv.config();

const app = express();

// 🧩 Middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(layout);

// 🖼️ EJS View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("view cache", false);

// 🗄️ Session Configuration
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Make session user globally available in EJS
// app.use((req, res, next) => {
//   if (req.session && req.session.user) {
//     req.user = req.session.user;
//     res.locals.user = req.session.user;
//   }
//   next();
// });

app.use((req, res, next) => {
  // If user exists via passport or session, make it available to EJS
  if (req.user) {
    res.locals.user = req.user;
  } else if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
});


// Default page title
app.use((req, res, next) => {
  res.locals.title = "JKT E-Commerce";
  next();
});

// 🛒 ROUTES
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");

// USER ROUTES
app.use("/auth", authRoutes);
app.use("/products", productRoutes);  // user-facing product routes
app.use("/orders", orderRoutes);      // user-facing orders
// app.use("/cart", cartRoutes);

// ADMIN ROUTES
app.use("/admin", adminRoutes);


// 🏠 HOME ROUTE
app.get("/", (req, res) => {
  res.render("public/home", { title: "Welcome to JKT E-Commerce" });
});

// const userRoutes = require("./routes/userRoutes");
// app.use("/", userRoutes);


// 🧪 TEST ROUTE
app.get("/test", (req, res) => {
  res.send("✅ JKT E-Commerce Server Running Successfully");
});

// 🛠️ Run table creation on startup
createTables();

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
