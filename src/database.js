const { app } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

// Global database connection
let db = null;
let connectionTimeout = null;

// Get a database connection
function getConnection() {
  // Clear any existing timeout
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }
  
  // Return existing connection if available
  if (db) return db;
  
  // Create new connection
  const dbPath = path.join(app.getPath('userData'), 'clients.db');
  console.log('Opening new database connection to:', dbPath);
  
  // Ensure directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Track if this is a new database file
  const isNewDatabase = !fs.existsSync(dbPath);
  
  try {
    // Create connection with WAL mode
    db = new Database(dbPath, { 
      verbose: console.log 
    });
    
    // Set pragmas for performance
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('temp_store = MEMORY');
    db.pragma('foreign_keys = ON');
    
    // Set auto-close timeout
    connectionTimeout = setTimeout(() => {
      console.log('Auto-closing idle database connection');
      resetConnection();
    }, 30000); // 30 seconds timeout
    
    console.log('Database connection established');
    
    // Log if this was a new database creation
    if (isNewDatabase) {
      console.log('Created new empty database file');
    }
    
    return db;
  } catch (err) {
    console.error('Error opening database:', err);
    throw err;
  }
}

// Reset the database connection
function resetConnection() {
  // Clear any existing timeout
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }
  
  if (!db) {
    console.log('No database connection to reset');
    return true;
  }
  
  try {
    console.log('Closing database connection...');
    db.close();
    db = null;
    console.log('Database connection closed');
    return true;
  } catch (err) {
    console.warn('Error closing database connection:', err);
    db = null;
    return false;
  }
}

// For convenience - resets and reopens in one step
function getResetConnection() {
  resetConnection();
  return getConnection();
}

// Initialize the database with tables
function initializeDatabase() {
  try {
    const db = getConnection();
    const dbPath = path.join(app.getPath('userData'), 'clients.db');
    const isNewDatabase = !fs.existsSync(dbPath) || fs.statSync(dbPath).size < 5000;
    
    if (isNewDatabase) {
      console.log('New or empty database detected, creating fresh schema...');
    }
    
    console.log('Creating database tables if they don\'t exist...');
    
    // Create the clients table
    db.exec(`
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        country TEXT,
        postal_code TEXT,
        phone TEXT NOT NULL,
        mobile TEXT,
        email TEXT,
        property TEXT,
        specialty TEXT,
        dentistAssociation TEXT,
        afm TEXT,
        dou TEXT,
        medical TEXT,
        gender TEXT,
        area TEXT,
        comment TEXT
      )
    `);
    
    // Create the appointments table
    db.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientName TEXT,
        date TEXT,
        time TEXT
      )
    `);
    
    // On first run, create an index for performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
      CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
    `);
    
    // Verify that tables were created
    const tablesExist = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND (name='clients' OR name='appointments')").all();
    
    if (tablesExist.length === 2) {
      console.log('Database tables verified successfully');
    } else {
      console.warn('Some database tables may not have been created correctly');
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    resetConnection(); // Reset on error
    throw err;
  }
}

/* ---- Clients functions ---- */
function addClient(newUser) {
  const db = getConnection();
  
  try {
    // Start transaction
    const transaction = db.transaction((newUser) => {
      const stmt = db.prepare(`
        INSERT INTO clients (
          name, address, country, postal_code, phone, mobile, email,
          property, specialty, dentistAssociation, afm, dou, medical,
          gender, area, comment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const params = [
        newUser.name,
        newUser.address,
        newUser.country,
        newUser.postal_code,
        newUser.phone,
        newUser.mobile,
        newUser.email,
        newUser.property,
        newUser.specialty,
        newUser.dentistAssociation,
        newUser.afm,
        newUser.dou,
        newUser.medical,
        newUser.gender,
        newUser.area,
        newUser.comment
      ];
      
      const info = stmt.run(...params);
      return { id: info.lastInsertRowid };
    });
    
    const result = transaction(newUser);
    console.log(`New client added with ID: ${result.id}`);
    return result;
  } catch (err) {
    console.error('Database error in addClient:', err);
    throw err;
  }
}

function getClients() {
  const db = getConnection();
  
  try {
    const stmt = db.prepare('SELECT * FROM clients');
    const rows = stmt.all();
    return rows || [];
  } catch (err) {
    console.error('Database error in getClients:', err);
    throw err;
  }
}

/* ---- Client Update Function ---- */
function updateClient(userData) {
  const db = getConnection();
  
  try {
    // Start transaction
    const transaction = db.transaction((userData) => {
      const stmt = db.prepare(`
        UPDATE clients 
        SET name = ?, address = ?, country = ?, postal_code = ?, phone = ?, mobile = ?, email = ?,
            property = ?, specialty = ?, dentistAssociation = ?, afm = ?, dou = ?, medical = ?,
            gender = ?, area = ?, comment = ?
        WHERE id = ?
      `);
      
      const params = [
        userData.name,
        userData.address,
        userData.country,
        userData.postal_code,
        userData.phone,
        userData.mobile,
        userData.email,
        userData.property,
        userData.specialty,
        userData.dentistAssociation,
        userData.afm,
        userData.dou,
        userData.medical,
        userData.gender,
        userData.area,
        userData.comment,
        userData.id
      ];
      
      const info = stmt.run(...params);
      return info.changes > 0;
    });
    
    const result = transaction(userData);
    console.log(`Client ${userData.id} updated successfully`);
    return result;
  } catch (err) {
    console.error('Database error in updateClient:', err);
    throw err;
  }
}

/* ---- Appointments functions ---- */
function addAppointment(appointment) {
  const db = getConnection();
  
  try {
    // Start transaction
    const transaction = db.transaction((appointment) => {
      const { clientName, date, time } = appointment;
      const stmt = db.prepare('INSERT INTO appointments (clientName, date, time) VALUES (?, ?, ?)');
      const info = stmt.run(clientName, date, time);
      return info.lastInsertRowid;
    });
    
    const lastId = transaction(appointment);
    console.log(`New appointment added with ID: ${lastId}`);
    return lastId;
  } catch (err) {
    console.error('Database error in addAppointment:', err);
    throw err;
  }
}

function getAppointments() {
  const db = getConnection();
  
  try {
    const stmt = db.prepare('SELECT * FROM appointments');
    const rows = stmt.all();
    return rows || [];
  } catch (err) {
    console.error('Database error in getAppointments:', err);
    throw err;
  }
}

function deleteAppointment(id) {
  const db = getConnection();
  
  try {
    // Start transaction
    const transaction = db.transaction((id) => {
      const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
      const info = stmt.run(id);
      return info.changes > 0;
    });
    
    const result = transaction(id);
    console.log(`Appointment ${id} deleted successfully`);
    return result;
  } catch (err) {
    console.error('Database error in deleteAppointment:', err);
    throw err;
  }
}

function updateAppointment(id, updatedData) {
  const db = getConnection();
  
  try {
    // Start transaction
    const transaction = db.transaction((id, updatedData) => {
      const { clientName, date, time } = updatedData;
      const stmt = db.prepare('UPDATE appointments SET clientName = ?, date = ?, time = ? WHERE id = ?');
      const info = stmt.run(clientName, date, time, id);
      return info.changes > 0;
    });
    
    const result = transaction(id, updatedData);
    console.log(`Appointment ${id} updated successfully`);
    return result;
  } catch (err) {
    console.error('Database error in updateAppointment:', err);
    throw err;
  }
}

// Single, unified export statement with all functions
module.exports = {
  initializeDatabase,
  addClient,
  getClients,
  updateClient,
  addAppointment,
  getAppointments,
  deleteAppointment,
  updateAppointment,
  resetConnection,
  getResetConnection,
  getConnection 
};