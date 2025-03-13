const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  const { appOutDir, packager, electronPlatformName } = context;
  
  console.log('Running afterPack script to remove any database files');
  
  // Define paths to check for database files
  const pathsToCheck = [
    path.join(appOutDir, 'resources/app'),
    path.join(appOutDir, 'resources')
  ];
  
  // File extensions to remove
  const dbExtensions = ['.db', '.db-journal', '.db-shm', '.db-wal'];
  
  // Check each path
  for (const dirPath of pathsToCheck) {
    if (fs.existsSync(dirPath)) {
      console.log(`Checking directory for database files: ${dirPath}`);
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const ext = path.extname(filePath).toLowerCase();
        
        if (dbExtensions.includes(ext) || file.includes('.db')) {
          console.log(`Removing database file: ${filePath}`);
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.warn(`Failed to remove ${filePath}: ${error.message}`);
          }
        }
      }
    } else {
      console.log(`Directory doesn't exist: ${dirPath}`);
    }
  }
  
  console.log('afterPack script completed');
};