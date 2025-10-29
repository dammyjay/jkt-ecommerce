// // utils/db.js
// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }, // 👈 Add this line for Railway
// });


// pool.on("connect", () => {
//   console.log("📦 Connected to PostgreSQL Database");
// });

// module.exports = pool;


// utils/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Railway requires SSL
});

pool.on("connect", () => {
  console.log("📦 Connected to PostgreSQL Database");
});

module.exports = pool;
