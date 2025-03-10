// src/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveUser: (userData) => ipcRenderer.invoke('save-user', userData),
  updateUser: (userData) => ipcRenderer.invoke('update-user', userData),
  getClients: () => ipcRenderer.invoke('get-clients'),
  exportToExcel: () => ipcRenderer.invoke('export-to-excel'),
  saveAppointment: (appointment) => ipcRenderer.invoke('save-appointment', appointment),
  onAppointmentUpdated: (callback) =>
    ipcRenderer.on('appointment-updated', (event, appointments) => callback(appointments)),
  getAppointments: () => ipcRenderer.invoke('get-appointments'),
  // Add these methods for appointment management:
  deleteAppointment: (index) => ipcRenderer.invoke('delete-appointment', index),
  updateAppointment: (index, appointmentData) => 
    ipcRenderer.invoke('update-appointment', index, appointmentData),
  getMonthlyCounts: () => ipcRenderer.invoke('get-monthly-counts'),
  onClientUpdated: (callback) =>
    ipcRenderer.on('client-updated', (event, clients) => callback(clients)),
  // Add the database backup function
  backupDatabase: () => ipcRenderer.invoke('backup-database'),
  
  // Add these methods for membership management
  addMember: (clientId, membershipData) => ipcRenderer.invoke('add-member', clientId, membershipData),
  removeMember: (clientId) => ipcRenderer.invoke('remove-member', clientId),
  getAllMembers: () => ipcRenderer.invoke('get-all-members'),
  getClientsWithMembership: () => ipcRenderer.invoke('get-clients-with-membership'),
  updateMembership: (clientId, isMember, memberSince) => 
    ipcRenderer.invoke('update-membership', clientId, isMember, memberSince),
  clearAppCache: () => ipcRenderer.invoke('clear-app-cache'),
  // Add this to your contextBridge.exposeInMainWorld function
resetDatabaseManually: () => ipcRenderer.invoke('reset-database-connections'),
getDatabaseStatus: () => ipcRenderer.invoke('get-database-status'),
// Add to contextBridge.exposeInMainWorld
checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
installUpdate: () => ipcRenderer.invoke('install-update'),
getAppVersion: () => ipcRenderer.invoke('get-app-version')
});