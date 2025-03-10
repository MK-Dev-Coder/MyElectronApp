// src/analyticsDatabase.js
const { app } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

// Make sure directory exists
const dbDir = path.dirname(path.join(app.getPath('userData'), 'analytics.db'));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create or open database connection
const dbPath = path.join(app.getPath('userData'), 'analytics.db');
let analyticsDb;

try {
  analyticsDb = new Database(dbPath, { verbose: console.log });
  console.log('Connected to analytics database.');
  
  // Set some pragmas for better performance
  analyticsDb.pragma('journal_mode = WAL');
  analyticsDb.pragma('synchronous = NORMAL');
  
  // Create the monthly_counts table if it doesn't exist
  analyticsDb.exec(`
    CREATE TABLE IF NOT EXISTS monthly_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month INTEGER,    -- 0 = January, 1 = February, etc.
      year INTEGER,
      client_count INTEGER DEFAULT 0
    )
  `);
  
  console.log('monthly_counts table is ready.');
  
} catch (err) {
  console.error('Error setting up analytics database:', err);
}

// Add helper functions to make using the database easier
const analyticsDbWrapper = {
  // Get the raw database object
  get db() {
    return analyticsDb;
  },
  
  // Insert or update monthly count
  updateMonthlyCount(month, year, count) {
    try {
      const stmt = analyticsDb.prepare(`
        INSERT OR REPLACE INTO monthly_counts (month, year, client_count)
        VALUES (?, ?, ?)
      `);
      return stmt.run(month, year, count);
    } catch (err) {
      console.error('Error updating monthly count:', err);
      throw err;
    }
  },
  
  // Get all monthly counts
  getAllMonthlyCounts() {
    try {
      const stmt = analyticsDb.prepare('SELECT * FROM monthly_counts ORDER BY year, month');
      return stmt.all();
    } catch (err) {
      console.error('Error getting monthly counts:', err);
      throw err;
    }
  },
  
  // Close the database connection
  close() {
    if (analyticsDb) {
      try {
        analyticsDb.close();
        console.log('Analytics database connection closed');
      } catch (err) {
        console.error('Error closing analytics database:', err);
      }
    }
  }
};

module.exports = analyticsDbWrapper;