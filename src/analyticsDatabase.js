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
      this.ensureConnection();
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
  },
  
  // Add reconnect method to fix database closed errors
  reconnect() {
    try {
      // Close existing connection if it exists
      if (analyticsDb) {
        try {
          analyticsDb.close();
        } catch (err) {
          console.warn('Error closing existing analytics connection:', err);
          // Continue even if close fails
        }
      }
      
      // Create new connection
      analyticsDb = new Database(dbPath, { verbose: console.log });
      
      // Configure database for better performance
      analyticsDb.pragma('journal_mode = WAL');
      analyticsDb.pragma('synchronous = NORMAL');
      
      console.log('Analytics database reconnected successfully');
      return true;
    } catch (err) {
      console.error('Error reconnecting to analytics database:', err);
      return false;
    }
  },
  
  // Helper method to ensure connection is active before operations
  ensureConnection() {
    try {
      // Try a simple query to test connection
      analyticsDb.prepare('SELECT 1').get();
      return true;
    } catch (err) {
      console.log('Database connection test failed, attempting reconnect');
      return this.reconnect();
    }
  },
  
  // Enhanced getAllMonthlyCounts with auto-reconnect
  getAllMonthlyCountsSafe() {
    try {
      this.ensureConnection();
      return this.getAllMonthlyCounts();
    } catch (err) {
      console.error('Failed to get monthly counts safely:', err);
      return []; // Return empty array instead of throwing
    }
  },
  
  // NEW: Create backup of analytics database
  backupDatabase() {
    try {
      this.ensureConnection();
      const backupPath = path.join(app.getPath('userData'), `analytics_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.db`);
      analyticsDb.backup(backupPath)
        .then(() => console.log(`Analytics database backed up to ${backupPath}`))
        .catch(err => console.error('Backup failed:', err));
      return true;
    } catch (err) {
      console.error('Error creating analytics database backup:', err);
      return false;
    }
  }
};

module.exports = analyticsDbWrapper;