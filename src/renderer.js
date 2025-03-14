document.addEventListener('DOMContentLoaded', () => {
  // Update the client count in the stats card
  const statsNumberEl = document.getElementById('statsNumber');
  if (statsNumberEl) {
    window.electronAPI.getClients()
      .then((clients) => {
        statsNumberEl.textContent = clients.length;
      })
      .catch((err) => {
        console.error('Error fetching client count:', err);
      });
  }

  // Load clients (patients) if the container exists.
  const patientRows = document.getElementById('patient-rows');
  if (patientRows) {
    loadPatients();
  }

  // Fetch current appointments on page load
  window.electronAPI.getAppointments()
    .then((appointments) => {
      updateAppointmentsList(appointments);
    })
    .catch((err) => {
      console.error('Error fetching appointments on load:', err);
    });

  // Listen for appointment updates from the main process
  window.electronAPI.onAppointmentUpdated((appointments) => {
    updateAppointmentsList(appointments);
  });

  // Attach the Export to Excel button handler (if the button exists)
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      window.electronAPI.exportToExcel()
        .then((success) => {
          if (success) {
            alert('Exported successfully!');
          } else {
            console.log('Export canceled by user.');
          }
        })
        .catch((err) => {
          console.error('Export failed:', err);
        });
    });
  }
  
  // Set up tab handlers for appointments if they exist
  const upcomingTab = document.querySelector('.tab[data-tab="upcoming"]');
  const pastTab = document.querySelector('.tab[data-tab="past"]');
  
  if (upcomingTab && pastTab) {
    upcomingTab.addEventListener('click', () => {
      upcomingTab.classList.add('active');
      pastTab.classList.remove('active');
      // Refresh appointments with the current filter
      window.electronAPI.getAppointments()
        .then(appointments => updateAppointmentsList(appointments))
        .catch(err => console.error('Error refreshing appointments:', err));
    });
    
    pastTab.addEventListener('click', () => {
      pastTab.classList.add('active');
      upcomingTab.classList.remove('active');
      // Refresh appointments with the current filter
      window.electronAPI.getAppointments()
        .then(appointments => updateAppointmentsList(appointments))
        .catch(err => console.error('Error refreshing appointments:', err));
    });
  }
});

function loadPatients() {
  window.electronAPI.getClients()
    .then(clients => {
      const patientRowsContainer = document.getElementById('patient-rows');
      patientRowsContainer.innerHTML = ''; // Clear current rows

      clients.forEach(client => {
        const row = document.createElement('div');
        row.classList.add('table-row');
        row.innerHTML = `
          <span title="${client.name}">${client.name}</span>
          <span title="${client.address}">${client.address}</span>
          <span title="${client.email}">${client.email}</span>
          <span title="${client.phone}">${client.phone}</span>
          <span>
            <button class="view-btn" data-client='${JSON.stringify(client)}'>View</button>
          </span>
        `;
        patientRowsContainer.appendChild(row);
      });

      // Attach click events to view buttons
      const viewBtns = document.querySelectorAll('.view-btn');
      viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const clientData = JSON.parse(e.target.getAttribute('data-client'));
          openModal(clientData);
        });
      });
    })
    .catch(err => console.error('Error loading patients:', err));
}

function openModal(client) {
  const modal = document.getElementById('user-modal');
  const clientNameEl = document.getElementById('modal-client-name');
  const clientDetailsEl = document.getElementById('modal-client-details');
  
  // Get language preference
  const lang = localStorage.getItem('preferredLanguage') || 'en';
  
  // Import translations module
  import('./translate.js').then(module => {
    const translations = module.translations[lang] || module.translations.en;
    
    // Set the client name in the modal header
    clientNameEl.textContent = client.name;
    
    // Populate modal with client details using translations
    clientDetailsEl.innerHTML = `
      <p style="margin-bottom: 10px;">
        <i class="fa fa-map-marker-alt"></i> <strong>${translations.address || 'Address'}:</strong> ${client.address}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-map"></i> <strong>${translations.area || 'Area'}:</strong> ${client.area || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-envelope"></i> <strong>${translations.email || 'Email'}:</strong> ${client.email || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-phone"></i> <strong>${translations.phone || 'Phone'}:</strong> ${client.phone}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-mobile-alt"></i> <strong>${translations.mobile || 'Mobile'}:</strong> ${client.mobile || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-globe"></i> <strong>${translations.country || 'Country'}:</strong> ${client.country || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-mail-bulk"></i> <strong>${translations.postalCode || 'Postal Code'}:</strong> ${client.postal_code || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-building"></i> <strong>${translations.property || 'Property'}:</strong> ${client.property || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-stethoscope"></i> <strong>${translations.specialty || 'Specialty'}:</strong> ${client.specialty || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-user-md"></i> <strong>${translations.dentistAssociation || 'Dentist Association'}:</strong> ${client.dentistAssociation || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-id-card"></i> <strong>${translations.afm || 'AFM'}:</strong> ${client.afm || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-hourglass-half"></i> <strong>${translations.dou || 'DOU'}:</strong> ${client.dou || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-medkit"></i> <strong>${translations.medical || 'Medical'}:</strong> ${client.medical || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-venus-mars"></i> <strong>${translations.gender || 'Gender'}:</strong> ${client.gender || '-'}
      </p>
      <p style="margin-bottom: 10px;">
        <i class="fa fa-comment"></i> <strong>${translations.comment || 'Comment'}:</strong> ${client.comment || '-'}
      </p>
    `;
    
    // Show modal and setup closing functionality
    modal.style.display = 'block';
  });

  // Close modal when the close button is clicked
  const closeBtn = document.querySelector('.modal .close');
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  // Close modal if clicking outside the modal content
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

function updateAppointmentsList(appointments) {
  const appointmentsListContainer = document.querySelector('.appointments-list');
  if (!appointmentsListContainer) {
    console.warn('No element with class "appointments-list" found. Make sure your index.html has it.');
    return;
  }

  // Clear current list
  appointmentsListContainer.innerHTML = '';
  
  // Get current date for comparison
  const now = new Date();
  
  // Filter appointments into upcoming and past
  const upcomingAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.date + 'T' + appt.time);
    return apptDate >= now;
  });
  
  const pastAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.date + 'T' + appt.time);
    return apptDate < now;
  });
  
  // Sort upcoming by date (soonest first)
  upcomingAppointments.sort((a, b) => 
    new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)
  );
  
  // Sort past by date (most recent first)
  pastAppointments.sort((a, b) => 
    new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)
  );
  
  // Find which tab is active to determine which appointments to show
  const pastTab = document.querySelector('.tab[data-tab="past"]');
  let appointmentsToShow;
  
  // If past tab exists and is active, show past appointments
  if (pastTab && pastTab.classList.contains('active')) {
    appointmentsToShow = pastAppointments;
  } else {
    // Otherwise show upcoming appointments (default)
    appointmentsToShow = upcomingAppointments;
  }
  
  // If no appointments to show, display a message
  if (appointmentsToShow.length === 0) {
    const li = document.createElement('li');
    li.classList.add('appointment-item', 'empty-message');
    li.textContent = 'No appointments found';
    li.style.textAlign = 'center';
    li.style.padding = '20px';
    li.style.color = '#888';
    appointmentsListContainer.appendChild(li);
    return;
  }
  
  // Populate with the filtered appointments
  appointmentsToShow.forEach((appt) => {
    const li = document.createElement('li');
    li.classList.add('appointment-item');
    
    // Format the date nicely
    const apptDate = new Date(appt.date + 'T' + appt.time);
    const formattedDate = apptDate.toLocaleDateString();
    const formattedTime = apptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    li.innerHTML = `
      <div class="appointment-info">
        <span class="patient-name">${appt.clientName}</span>
        <span class="appointment-type">${appt.type || 'Appointment'}</span>
      </div>
      <span class="appointment-date">
        ${formattedDate} ${formattedTime}
      </span>
    `;
    appointmentsListContainer.appendChild(li);
  });
}