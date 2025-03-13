const { app } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

let membersDb = null;

function initializeMembersDatabase() {
  try {
    const dbPath = path.join(app.getPath('userData'), 'members.db');
    
    // Ensure the directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Open database connection
    membersDb = new Database(dbPath, { verbose: console.log });
    console.log('Connected to members database.');
    
    // Set pragmas for better performance
    membersDb.pragma('journal_mode = WAL');
    membersDb.pragma('synchronous = NORMAL');
    
    // Create members table with references to client IDs
    membersDb.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        member_since TEXT,
        membership_level TEXT DEFAULT 'standard',
        expiry_date TEXT,
        notes TEXT,
        UNIQUE(client_id)
      )
    `);
    
    return true;
  } catch (err) {
    console.error('Error initializing members database:', err);
    throw err;
  }
}

function addMember(clientId, membershipData) {
  try {
    if (!membersDb) throw new Error('Database not initialized');
    
    const { member_since, membership_level, expiry_date, notes } = membershipData;
    
    // Prepare and run the statement
    const stmt = membersDb.prepare(`
      INSERT OR REPLACE INTO members 
      (client_id, member_since, membership_level, expiry_date, notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      clientId, 
      member_since,
      membership_level || 'standard', 
      expiry_date, 
      notes
    );
    
    return { id: info.lastInsertRowid };
  } catch (err) {
    console.error('Error adding member:', err);
    throw err;
  }
}

function removeMember(clientId) {
  try {
    if (!membersDb) throw new Error('Database not initialized');
    
    const stmt = membersDb.prepare('DELETE FROM members WHERE client_id = ?');
    const info = stmt.run(clientId);
    
    return info.changes > 0;
  } catch (err) {
    console.error('Error removing member:', err);
    throw err;
  }
}

function getAllMembers() {
  try {
    if (!membersDb) throw new Error('Database not initialized');
    
    const stmt = membersDb.prepare('SELECT * FROM members');
    return stmt.all();
  } catch (err) {
    console.error('Error retrieving members:', err);
    throw err;
  }
}

// Function to clear all members
function clearAllMembers() {
  try {
    if (!membersDb) {
      console.warn('Members database not initialized when trying to clear');
      return false;
    }
    
    console.log('Clearing all members...');
    membersDb.exec('DELETE FROM members');
    return true;
  } catch (err) {
    console.error('Error clearing members database:', err);
    return false;
  }
}

// Close database connection when the app is about to quit
function closeMembersDatabase() {
  if (membersDb) {
    try {
      membersDb.close();
      membersDb = null;
      console.log('Members database connection closed');
    } catch (err) {
      console.error('Error closing members database:', err);
    }
  }
}

// FIXED: Single module.exports with all functions included
module.exports = {
  initializeMembersDatabase,
  addMember,
  removeMember,
  getAllMembers,
  closeMembersDatabase,
  clearAllMembers
};