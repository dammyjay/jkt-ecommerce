const pool = require("../utils/db");

async function initTables() {
  try {
    await pool.query(`
      -- USERS TABLE
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        fullname VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        otp VARCHAR(10),
        is_verified BOOLEAN DEFAULT false,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- USERS2 TABLE
      CREATE TABLE IF NOT EXISTS users2 (
        id SERIAL PRIMARY KEY,
        fullname VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255),
        otp VARCHAR(10),
        is_verified BOOLEAN DEFAULT false,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        profile_image TEXT,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100)
      );

      -- CATEGORIES TABLE
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      );

      -- PRODUCTS TABLE
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150),
        description TEXT,
        price NUMERIC(10,2),
        image_url TEXT,
        category_id INT REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- ORDERS TABLE
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        total_amount NUMERIC(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- SESSION TABLE (for connect-pg-simple)
      CREATE TABLE IF NOT EXISTS session (
        "sid" varchar PRIMARY KEY COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

      -- NEWSLETTER SUBSCRIPTIONS
      CREATE TABLE IF NOT EXISTS newsletter (
        id SERIAL PRIMARY KEY,
        email VARCHAR(150) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- PROMOTIONS
      CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        image_url TEXT,
        discount VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      

      -- TESTIMONIALS
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

      -- CATEGORIES (updated with image)
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

    `);

    console.log("✅ All tables initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing tables:", err);
  }
}

module.exports = initTables;
