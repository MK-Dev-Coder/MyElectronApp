const { app, BrowserWindow, ipcMain, dialog, session, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
// Remove sqlite3 import - better-sqlite3 is used in the individual database modules
const Database = require('better-sqlite3'); // For direct database access if needed
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Import functions from your main database module with the resetConnection function
const { 
  initializeDatabase,
  getClients,
  addClient,
  addAppointment,
  getAppointments,
  updateClient,
  deleteAppointment,
  updateAppointment,
  resetConnection,
  getConnection
} = require('./src/database');

// Import your analytics database connection
let analyticsDb = require('./src/analyticsDatabase');

// Import the members database module
const { 
  initializeMembersDatabase,
  addMember,
  removeMember,
  getAllMembers,
  resetConnection: resetMembersDb
} = require('./src/membersDatabase');

// Timeout detection and recovery system
let busyTimeout = null;

function startBusyTimeout() {
  // Clear any existing timeout
  if (busyTimeout) {
    clearTimeout(busyTimeout);
  }
  
  // Set database as busy
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) {
      win.webContents.send('database-status', { busy: true });
    }
  });
  
  // Set a timeout to auto-recover if operation takes too long
  busyTimeout = setTimeout(async () => {
    console.warn('Database operation timeout detected, forcing reset');
    await resetAllDatabaseConnections();
    
    // Set database as ready
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('database-status', { busy: false });
      }
    });
  }, 10000); // 10 second timeout
}

function endBusyTimeout() {
  // Clear timeout
  if (busyTimeout) {
    clearTimeout(busyTimeout);
    busyTimeout = null;
  }
  
  // Set database as ready
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) {
      win.webContents.send('database-status', { busy: false });
    }
  });
}

// FIXED: Function to reset analytics DB connection for better-sqlite3
function resetAnalyticsConnection() {
  return new Promise((resolve) => {
    try {
      // Use reconnect method if available (preferred method)
      if (analyticsDb && typeof analyticsDb.reconnect === 'function') {
        analyticsDb.reconnect();
        console.log('Analytics database reconnected successfully');
        return resolve();
      }
      
      // Fall back to close/reopen if needed
      if (analyticsDb && typeof analyticsDb.close === 'function') {
        try {
          analyticsDb.close();
        } catch (err) {
          console.warn('Error closing analytics database:', err);
        }
      }
      
      // Re-import the module to get a fresh connection
      analyticsDb = require('./src/analyticsDatabase');
      console.log('Analytics database connection reset');
      resolve();
    } catch (err) {
      console.error('Error resetting analytics database:', err);
      resolve(); // Continue even with error
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.webContents.openDevTools();
  win.loadFile('src/index.html');
}

app.whenReady().then(async () => {
  // Check if this is the first run
  const firstRunFlagPath = path.join(app.getPath('userData'), '.first-run-completed');
  const isFirstRun = !fs.existsSync(firstRunFlagPath);
  
  console.log('Initializing databases...');
  initializeDatabase();
  initializeMembersDatabase(); // Initialize the members database
  
  // If this is the first run, ensure clean databases
  if (isFirstRun) {
    console.log('First run detected! Creating clean databases...');
    
    try {
      // Get database connection
      const db = getConnection();
      
      // Clear clients table
      db.exec('DELETE FROM clients');
      console.log('Cleared clients table');
      
      // Clear appointments table
      db.exec('DELETE FROM appointments');
      console.log('Cleared appointments table');
      
      // Clear members table if it exists
      try {
        const membersDb = require('./src/membersDatabase');
        if (typeof membersDb.clearAllMembers === 'function') {
          membersDb.clearAllMembers();
        } else {
          console.log('clearAllMembers function not found, skipping members cleanup');
        }
      } catch (err) {
        console.warn('Error clearing members database:', err);
      }
      
      // Create the first-run flag so we don't clear data again
      fs.writeFileSync(firstRunFlagPath, new Date().toISOString());
      console.log('Created first-run flag');
    } catch (err) {
      console.error('Error clearing databases on first run:', err);
    }
  }
  
  createWindow();
  createMenu(); // Add menu with database tools
  
  // Add the update check right here as the last line inside this function
  autoUpdater.checkForUpdatesAndNotify().catch(err => {
    console.log('Update check failed:', err);
  });
});

// Add application menu with database tools
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Reset Database Connections',
          click: async () => {
            try {
              await resetAllDatabaseConnections();
              dialog.showMessageBox({
                type: 'info',
                message: 'Database connections reset successfully'
              });
            } catch (err) {
              dialog.showErrorBox('Database Reset Error', err.message);
            }
          }
        },
        {
          label: 'Optimize Database',
          click: async () => {
            try {
              startBusyTimeout();
              
              // Get database connection
              const db = getConnection();
              
              // FIXED: Direct execution for better-sqlite3
              db.exec('VACUUM');
              
              endBusyTimeout();
              
              dialog.showMessageBox({
                type: 'info',
                message: 'Database optimized successfully'
              });
            } catch (err) {
              endBusyTimeout();
              dialog.showErrorBox('Optimization Error', err.message);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Developer Tools',
          click: (_, focusedWindow) => {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IMPROVED: Function to reset all database connections with better handling
async function resetAllDatabaseConnections() {
  console.log('Resetting all database connections...');
  startBusyTimeout();
  
  // Force close any hung operations by setting a timeout
  const resetPromise = new Promise(async (resolve) => {
    try {
      // Reset clients database connection
      if (typeof resetConnection === 'function') {
        await Promise.race([
          resetConnection(),
          new Promise(res => setTimeout(res, 1000))
        ]);
        console.log('Main database connection reset');
      }
      
      // Reset members database connection if available
      if (typeof resetMembersDb === 'function') {
        await Promise.race([
          resetMembersDb(),
          new Promise(res => setTimeout(res, 1000))
        ]);
        console.log('Members database connection reset');
      }
      
      // Reset analytics database connection
      await Promise.race([
        resetAnalyticsConnection(),
        new Promise(res => setTimeout(res, 1000))
      ]);
      
      resolve({ success: true });
    } catch (error) {
      console.error('Error in reset connections:', error);
      resolve({ success: false, error: error.message });
    }
  });
  
  // Set a timeout to avoid hanging forever
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => {
      console.warn('Database reset timed out, forcing reset');
      resolve({ success: false, error: 'Reset timed out' });
    }, 3000);
  });
  
  // Race the promises to ensure we don't block for too long
  const result = await Promise.race([resetPromise, timeoutPromise]);
  
  endBusyTimeout();
  return result;
}

// Add handler for database reset
ipcMain.handle('reset-database-connections', async () => {
  try {
    return await resetAllDatabaseConnections();
  } catch (error) {
    console.error('Error resetting database connections:', error);
    return { success: false, error: error.message };
  }
});

// Modified save-user handler: After adding a client, update the analytics database.
ipcMain.handle('save-user', async (event, newUser) => {
  try {
    startBusyTimeout();
    
    // Start by resetting connections to ensure clean state
    await resetAllDatabaseConnections();
    
    await addClient(newUser);

    // Get the current month and year.
    const now = new Date();
    const month = now.getMonth();  // 0 = January, etc.
    const year = now.getFullYear();

    // FIXED: Update the monthly_counts table in the analytics database using better-sqlite3
    try {
      // Try to use the analytics wrapper method if available
      if (analyticsDb && typeof analyticsDb.updateMonthlyCount === 'function') {
        analyticsDb.updateMonthlyCount(month, year, 1);
      } else {
        // Direct way using better-sqlite3
        const db = analyticsDb.db || analyticsDb;
        
        // Look for existing record
        const row = db.prepare('SELECT * FROM monthly_counts WHERE month = ? AND year = ?').get(month, year);
        
        if (row) {
          // Update existing count
          db.prepare('UPDATE monthly_counts SET client_count = client_count + 1 WHERE id = ?').run(row.id);
        } else {
          // Insert new count
          db.prepare('INSERT INTO monthly_counts (month, year, client_count) VALUES (?, ?, 1)').run(month, year);
        }
      }
    } catch (err) {
      console.error('Error updating analytics:', err);
      // Continue even with error
    }

    // Get updated client list
    const clients = await getClients();
    
    // Broadcast updated client list to all windows
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('client-updated', clients);
      }
    });
    
    // Reset database connections to prevent locking
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return { success: true };
  } catch (err) {
    endBusyTimeout();
    console.error('Error saving user:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-clients', async () => {
  try {
    startBusyTimeout();
    
    // Ensure fresh connections for read
    await resetAllDatabaseConnections();
    
    const clients = await getClients();
    
    endBusyTimeout();
    return clients;
  } catch (err) {
    endBusyTimeout();
    console.error('Error retrieving clients:', err);
    throw err;
  }
});

// IMPROVED: Better user update handling with connection management
ipcMain.handle('update-user', async (event, userData) => {
  try {
    console.log('Starting user update for ID:', userData.id);
    startBusyTimeout();
    
    // First, ensure all connections are fresh before update
    await resetAllDatabaseConnections();
    
    // Perform the update
    await updateClient(userData);
    
    // Get updated client list
    const clients = await getClients();
    
    // Broadcast to all windows
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('client-updated', clients);
      }
    });
    
    // Explicitly reset all connections again after update
    await resetAllDatabaseConnections();
    
    console.log('User update completed successfully');
    endBusyTimeout();
    return { success: true };
  } catch (err) {
    // Always reset connections on error
    await resetAllDatabaseConnections();
    endBusyTimeout();
    console.error('Error updating client:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-appointments', async () => {
  try {
    startBusyTimeout();
    
    // Reset connections before read
    await resetAllDatabaseConnections();
    
    const appointments = await getAppointments();
    
    endBusyTimeout();
    return appointments;
  } catch (err) {
    endBusyTimeout();
    console.error('Error retrieving appointments:', err);
    throw err;
  }
});

ipcMain.handle('export-to-excel', async () => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Excel File',
      defaultPath: 'clients.xlsx',
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
    });
    if (canceled || !filePath) return false;
    
    startBusyTimeout();
    
    // Reset connections before read
    await resetAllDatabaseConnections();
    
    const clients = await getClients();
    const worksheet = XLSX.utils.json_to_sheet(clients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
    XLSX.writeFile(workbook, filePath);
    
    endBusyTimeout();
    return true;
  } catch (err) {
    endBusyTimeout();
    console.error('Error exporting to Excel:', err);
    throw err;
  }
});

// IMPROVED: Better appointment handling with connection management
ipcMain.handle('save-appointment', async (event, appointment) => {
  try {
    startBusyTimeout();
    
    // Reset connections before write
    await resetAllDatabaseConnections();
    
    await addAppointment(appointment);
    const allAppointments = await getAppointments();
    
    // Notify all windows
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('appointment-updated', allAppointments);
      }
    });
    
    // Reset all connections to prevent locking
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return { success: true, appointments: allAppointments };
  } catch (err) {
    endBusyTimeout();
    console.error('Error saving appointment:', err);
    return { success: false, error: err.message };
  }
});

// IMPROVED: Delete appointment with better connection management
ipcMain.handle('delete-appointment', async (event, appointmentId) => {
  try {
    startBusyTimeout();
    
    // Reset connections before write
    await resetAllDatabaseConnections();
    
    await deleteAppointment(appointmentId);
    const allAppointments = await getAppointments();
    
    // Notify all windows of the update
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('appointment-updated', allAppointments);
      }
    });
    
    // Reset all connections to prevent locking
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return { success: true, appointments: allAppointments };
  } catch (err) {
    endBusyTimeout();
    console.error('Error deleting appointment:', err);
    return { success: false, error: err.message };
  }
});

// IMPROVED: Update appointment with better connection management
ipcMain.handle('update-appointment', async (event, appointmentId, updatedData) => {
  try {
    startBusyTimeout();
    
    // Reset connections before write
    await resetAllDatabaseConnections();
    
    await updateAppointment(appointmentId, updatedData);
    const allAppointments = await getAppointments();
    
    // Notify all windows of the update
    BrowserWindow.getAllWindows().forEach(win => {
      if (!win.isDestroyed()) {
        win.webContents.send('appointment-updated', allAppointments);
      }
    });
    
    // Reset all connections to prevent locking
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return { success: true, appointments: allAppointments };
  } catch (err) {
    endBusyTimeout();
    console.error('Error updating appointment:', err);
    return { success: false, error: err.message };
  }
});

// FIXED: Get monthly counts using better-sqlite3
ipcMain.handle('get-monthly-counts', async () => {
  try {
    startBusyTimeout();
    
    // Reset connections before read
    await resetAllDatabaseConnections();
    
    // Use the wrapper function if available
    let result;
    if (analyticsDb && typeof analyticsDb.getAllMonthlyCounts === 'function') {
      result = analyticsDb.getAllMonthlyCounts();
    } else {
      // Direct access if wrapper function is not available
      const db = analyticsDb.db || analyticsDb;
      result = db.prepare('SELECT month, year, client_count FROM monthly_counts').all();
    }
    
    // Reset connections after read operation
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return result;
  } catch (err) {
    endBusyTimeout();
    console.error('Error in get-monthly-counts:', err);
    throw err;
  }
});

// ============= MEMBERS DATABASE HANDLERS =============

// IMPROVED: Add member with better connection management
ipcMain.handle('add-member', async (event, clientId, membershipData) => {
  try {
    startBusyTimeout();
    
    // Reset connections before write
    await resetAllDatabaseConnections();
    
    await addMember(clientId, membershipData);
    
    // Reset connections after write
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return { success: true };
  } catch (err) {
    endBusyTimeout();
    console.error('Error adding member:', err);
    return { success: false, error: err.message };
  }
});

// IMPROVED: Remove member with better connection management
ipcMain.handle('remove-member', async (event, clientId) => {
  try {
    startBusyTimeout();
    
    // Reset connections before write
    await resetAllDatabaseConnections();
    
    await removeMember(clientId);
    
    // Reset connections after write
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return { success: true };
  } catch (err) {
    endBusyTimeout();
    console.error('Error removing member:', err);
    return { success: false, error: err.message };
  }
});

// IMPROVED: Get all members with better connection management
ipcMain.handle('get-all-members', async () => {
  try {
    startBusyTimeout();
    
    // Reset connections before read
    await resetAllDatabaseConnections();
    
    const members = await getAllMembers();
    
    // Reset connections after read
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return members;
  } catch (err) {
    endBusyTimeout();
    console.error('Error getting members:', err);
    throw err;
  }
});

// IMPROVED: Update membership with better connection management
ipcMain.handle('update-membership', async (event, clientId, isMember, memberSince) => {
  try {
    startBusyTimeout();
    console.log(`Updating membership: clientId=${clientId}, isMember=${isMember}, memberSince=${memberSince}`);
    
    // Reset connections before write
    await resetAllDatabaseConnections();
    
    if (isMember) {
      // For adding members
      const membershipData = {
        member_since: memberSince,
        membership_level: 'standard',
        expiry_date: null,
        notes: ''
      };
      await addMember(clientId, membershipData);
    } else {
      // For removing members
      await removeMember(clientId);
    }
    
    // Reset all connections to prevent locking
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return { success: true };
  } catch (err) {
    endBusyTimeout();
    console.error('Error updating membership status:', err);
    return { success: false, error: err.message };
  }
});

// IMPROVED: Get clients with membership with better connection management
ipcMain.handle('get-clients-with-membership', async () => {
  try {
    startBusyTimeout();
    
    // Reset connections before read
    await resetAllDatabaseConnections();
    
    const clients = await getClients();
    const members = await getAllMembers();
    
    // Create a map of client_id to member data
    const memberMap = {};
    members.forEach(member => {
      memberMap[member.client_id] = member;
    });
    
    // Add membership data to each client
    const clientsWithMembership = clients.map(client => {
      const memberData = memberMap[client.id];
      return {
        ...client,
        isMember: !!memberData,
        memberSince: memberData ? memberData.member_since : null,
        membershipLevel: memberData ? memberData.membership_level : null,
        expiryDate: memberData ? memberData.expiry_date : null,
        memberNotes: memberData ? memberData.notes : null
      };
    });
    
    // Reset connections after read
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return clientsWithMembership;
  } catch (err) {
    endBusyTimeout();
    console.error('Error retrieving clients with membership:', err);
    throw err;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IMPROVED: Database backup IPC handler with better error handling
ipcMain.handle('backup-database', async () => {
  try {
    startBusyTimeout();
    
    // FIXED: Create a timestamp using local time instead of UTC
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Reset connections before backup
    await resetAllDatabaseConnections();
    
    // Show save dialog
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'Save Database Backup',
      defaultPath: path.join(app.getPath('documents'), `database_backup_${timestamp}.zip`),
      filters: [
        { name: 'Database Backup', extensions: ['zip'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (canceled || !filePath) {
      endBusyTimeout();
      return { success: false, canceled: true };
    }
    
    // Get correct database paths from user data directory
    const clientsDbPath = path.join(app.getPath('userData'), 'clients.db');
    const analyticsDbPath = path.join(app.getPath('userData'), 'analytics.db');
    const membersDbPath = path.join(app.getPath('userData'), 'members.db'); // Add the members database
    
    console.log('Backing up database files from:', clientsDbPath, analyticsDbPath, membersDbPath);
    
    // Simple implementation - just create separate backup files
    let backupCount = 0;
    let backupMessage = '';
    
    // Define backup file paths
    const clientsBackupPath = filePath.replace('.zip', '_clients.db');
    const analyticsBackupPath = filePath.replace('.zip', '_analytics.db');
    const membersBackupPath = filePath.replace('.zip', '_members.db');
    
    // Check if database files exist and copy them
    if (fs.existsSync(clientsDbPath)) {
      await fs.promises.copyFile(clientsDbPath, clientsBackupPath);
      backupCount++;
      backupMessage += `Clients database backed up to ${clientsBackupPath}\n`;
      console.log('Clients database backed up successfully');
    } else {
      console.warn('Clients database file not found at:', clientsDbPath);
    }
    
    if (fs.existsSync(analyticsDbPath)) {
      await fs.promises.copyFile(analyticsDbPath, analyticsBackupPath);
      backupCount++;
      backupMessage += `Analytics database backed up to ${analyticsBackupPath}\n`;
      console.log('Analytics database backed up successfully');
    } else {
      console.warn('Analytics database file not found at:', analyticsDbPath);
    }
    
    if (fs.existsSync(membersDbPath)) {
      await fs.promises.copyFile(membersDbPath, membersBackupPath);
      backupCount++;
      backupMessage += `Members database backed up to ${membersBackupPath}`;
      console.log('Members database backed up successfully');
    } else {
      console.warn('Members database file not found at:', membersDbPath);
    }

    if (backupCount === 0) {
      endBusyTimeout();
      return { success: false, error: 'No database files found to backup' };
    }
    
    // Reset connections after backup
    await resetAllDatabaseConnections();
    
    endBusyTimeout();
    return { 
      success: true, 
      path: filePath.replace('.zip', '_*.db'), 
      message: backupMessage
    };
  } catch (error) {
    endBusyTimeout();
    console.error('Backup error details:', error);
    return { success: false, error: error.message };
  }
});

// IMPROVED: Clear app cache with better error handling
ipcMain.handle('clear-app-cache', async () => {
  try {
    startBusyTimeout();
    
    // Clear session cache
    await session.defaultSession.clearCache();
    
    // Clear storage data (cookies, localStorage, etc)
    await session.defaultSession.clearStorageData({
      storages: ['appcache', 'cookies', 'filesystem', 'indexdb', 'shadercache', 'websql', 'serviceworkers']
    });
    
    endBusyTimeout();
    return { success: true };
  } catch (error) {
    endBusyTimeout();
    console.error('Error clearing cache:', error);
    return { success: false, error: error.message };
  }
});

// NEW: Handler to check database status
ipcMain.handle('get-database-status', () => {
  return { busy: busyTimeout !== null };
});


// Optional: Add a dedicated database refresh handler
ipcMain.handle('refresh-database', async () => {
  try {
    // Reset all connections to ensure fresh data
    await resetAllDatabaseConnections();
    return { success: true };
  } catch (error) {
    console.error('Error refreshing database:', error);
    return { success: false, error: error.message };
  }
});

// Set up auto-recovery for database locks
let lastInputTime = Date.now();
let recoveryTimer = null;

// Detect user input across all windows
app.on('web-contents-created', (_, webContents) => {
  webContents.on('before-input-event', () => {
    lastInputTime = Date.now();
    
    // Clear existing timer if there is one
    if (recoveryTimer) {
      clearTimeout(recoveryTimer);
    }
    
    // Set new timer to check if input is being processed
    recoveryTimer = setTimeout(async () => {
      const now = Date.now();
      
      // If more than 5 seconds passed since last input and we haven't received new input events
      // it might indicate the UI is frozen
      if (now - lastInputTime > 5000) {
        console.log('Potential UI freeze detected, resetting connections...');
        await resetAllDatabaseConnections();
      }
    }, 5000);
  });
});


// update logic
// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

// Handle update events
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
});

autoUpdater.on('update-not-available', () => {
  log.info('Update not available');
});

autoUpdater.on('error', (err) => {
  log.error('Update error:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  log.info(`Download speed: ${progressObj.bytesPerSecond} - Downloaded ${Math.round(progressObj.percent)}%`);
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded');
  dialog.showMessageBox({
    title: 'Install Update',
    message: 'Update downloaded. The application will restart to install the update.',
    buttons: ['Install Now']
  }).then(() => {
    autoUpdater.quitAndInstall(false, true);
  });
});

// Add these IPC handlers for the update functionality
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await autoUpdater.checkForUpdatesAndNotify();
    if (result && result.updateInfo) {
      return {
        updateAvailable: true,
        version: result.updateInfo.version
      };
    } else {
      return { updateAvailable: false };
    }
  } catch (error) {
    log.error('Error checking for updates:', error);
    return { error: error.message };
  }
});

ipcMain.handle('install-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (error) {
    log.error('Error downloading update:', error);
    return { error: error.message };
  }
});

// Add this with your other IPC handlers
ipcMain.on('user-data-updated', (event, userData) => {
  console.log('User data updated notification received');
  // Notify all windows except sender
  BrowserWindow.getAllWindows().forEach(window => {
    if (!window.isDestroyed() && window.webContents !== event.sender) {
      window.webContents.send('refresh-data');
    }
  });
});

// Add this with your other IPC handlers (around line 940)
ipcMain.handle('logout', async () => {
  try {
    // Clear session data
    await session.defaultSession.clearStorageData({
      storages: ['cookies', 'localstorage', 'sessionstorage', 'indexdb']
    });

    app.exit();
    
    return { success: true };
  } catch (error) {
    console.error('Error during logout:', error);
    return { success: false, error: error.message };
  }
});