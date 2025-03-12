// Function to handle logout
function setupLogout() {
    const logoutButtons = document.querySelectorAll('.menu-item.logout a');
    
    logoutButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (confirm('Are you sure you want to log out? Any unsaved changes will be lost.')) {
          try {
            if (window.electronAPI && window.electronAPI.logout) {
              await window.electronAPI.logout();
            } else {
              // Fallback if API not available
              window.location.href = 'index.html';
            }
          } catch (err) {
            console.error('Error during logout:', err);
            alert('Logout failed. Please try again.');
          }
        }
      });
    });
  }
  
  // Set up logout functionality when DOM is loaded
  document.addEventListener('DOMContentLoaded', setupLogout);
  
  // Export the function for manual inclusion
  export { setupLogout };