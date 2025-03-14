const translations = {
  en: {
    settingsTitle: "Settings",
    settingsHeading: "Settings",
    languageOptions: "Language Options",
    dataManagement: "Data Management",
    backupData: "Backup Data",
    clearCache: "Clear Cache",
    resetSettings: "Reset Settings",
    // Add more key/value pairs for all text elements across pages
    home: "Home",
    addUser: "Add User",
    editUser: "Edit User",
    exportToExcel: "Export to Excel",
    report: "Report",
    settings: "Settings",
    help: "Help",
    logout: "Logout",
    // Sidebar specific
    Members: "Members",
    // Analytics translations
    analytics: "Analytics",
    clientsPerMonth: "Clients per Month",
    clientsWithMedical: "Clients with Medical Office",
    genderDistribution: "Gender Distribution",
    male: "Male",
    female: "Female",
    withMedical: "With Medical Office",
    withoutMedical: "Without Medical Office",
    monthlySummary: "Monthly Client Registration Summary",
    month: "Month",
    year: "Year",
    clientCount: "Number of Clients",
    // Appointment translations
    appointment: "Appointment",
    scheduleAppointment: "Schedule an Appointment",
    selectClient: "Select Client",
    selectClientOption: "--Select a client--",
    date: "Date",
    time: "Time",
    makeAppointment: "Make Appointment",
    upcomingAppointments: "Upcoming Appointments",
    loadingAppointments: "Loading appointments...",
    editAppointment: "Edit Appointment",
    client: "Client",
    deleteAppointment: "Delete Appointment",
    close: "Close",
    saveChanges: "Save Changes",
    edit: "Edit",
    cancel: "Cancel",
    // Search and index page translations
    searchBy: "Search by:",
    nameField: "Name",
    addressField: "Address",
    emailField: "Email",
    phoneField: "Phone",
    searchClients: "Search clients...",
    currentClients: "Current clients",
    clientHeader: "Client",
    addressHeader: "Address",
    emailHeader: "Email",
    phoneHeader: "Phone",
    actionsHeader: "Actions",
    appointments: "Appointments",
    viewAll: "View all",
    upcoming: "Upcoming",
    past: "Past",
    
    // Help Page Translations
    helpTitle: "Help & Support",
    searchHelpTopics: "Search help topics...",
    
    // FAQ Section
    faqHeading: "Frequently Asked Questions",
    faqQuestion1: "How do I add a new user to the database?",
    faqAnswer1: "To add a new user, navigate to the \"Add User\" page from the sidebar menu. Fill in all the required fields marked with an asterisk (*). Click the \"Save\" button to add the user to the database. You'll receive a confirmation message when the user is successfully added.",
    
    faqQuestion2: "How can I export user data to Excel?",
    faqAnswer2: "To export data to Excel, go to the \"Export to Excel\" page from the sidebar menu. Select the data range you want to export using the provided filters. Click the \"Generate Excel\" button. Once processing is complete, the Excel file will be downloaded automatically to your default downloads folder.",
    
    faqQuestion3: "How do I create a backup of my database?",
    faqAnswer3: "To create a backup, go to the \"Settings\" page from the sidebar menu. In the \"Data Management\" section, click the \"Backup Data\" button. The system will create a complete backup of your database. Once completed, you'll be prompted to choose a location to save the backup file. It's recommended to create regular backups, especially before making major changes to your data.",
    
    faqQuestion4: "How do I schedule an appointment for a user?",
    faqAnswer4: "To schedule an appointment, navigate to the \"Appointment\" page from the sidebar menu. Select the user from the dropdown menu or search by name. Choose the desired date and time slot from the calendar. Add any relevant notes or details about the appointment. Click \"Save Appointment\" to confirm. Both you and the user will receive a confirmation notification.",
    
    faqQuestion5: "How can I view analytics and reports?",
    faqAnswer5: "Access the \"Analytics\" page from the sidebar menu to view comprehensive reports. You can filter data by date range, user categories, or specific metrics. The system provides visual charts and graphs for better data interpretation. For custom reports, use the advanced filters at the top of the page. Reports can be exported as PDF or Excel files using the buttons in the top-right corner.",
    
    // Tutorial Section
    tutorialsHeading: "Step-by-Step Tutorials",
    
    databaseBasics: "Database Basics",
    databaseBasicsDesc: "Learn the fundamentals of how the database is structured. This application uses a secure, local database to store all user information. Records are organized in tables with relationships between different data types. The database automatically backs up incremental changes to prevent data loss. Understanding this structure will help you navigate and use the system more effectively.",
    
    searchingRecords: "Searching & Filtering Records",
    searchingRecordsDesc: "Quickly find the information you need using advanced search features. The search box at the top of most pages allows you to search by name, ID, date, or any custom field. Use filters to narrow down results by categories, status, date ranges, or custom attributes. Save frequent searches as presets for quick access later. Results can be sorted by clicking on column headers.",
    
    dataManagementDesc: "Learn best practices for maintaining accurate user records. Always verify information before saving changes. Use the bulk edit feature for making the same change to multiple records. The system tracks all changes with timestamps and user information for accountability. Required fields are marked with an asterisk (*) and must be completed. Use the notes section for any additional information that doesn't fit in standard fields.",
    
    reportsAnalytics: "Reports & Analytics",
    reportsAnalyticsDesc: "Generate insightful reports to track key metrics and trends. Choose from pre-built report templates or create custom reports with specific fields and filters. Schedule automatic report generation on a daily, weekly, or monthly basis with email delivery. Export reports in multiple formats including PDF, Excel, or CSV. Visualize data with various chart types including bar, line, and pie charts for better presentation.",
    
    // Support Section
    contactSupport: "Contact Support",
    
    emailSupport: "Email Support",
    emailSupportDesc: "Send us a detailed description of your issue at support@example.com. Our team typically responds within 24 business hours.",
    
    phoneSupport: "Phone Support",
    phoneSupportDesc: "Call our technical support team at +1-800-123-4567 between 9 AM and 5 PM, Monday to Friday.",
    
    documentation: "Documentation",
    documentationDesc: "Browse our comprehensive <a href=\"#\">online documentation</a> for detailed guides and reference materials.",
    
    // Edit User page translations
    editUserTitle: "Edit User",
    editUsers: "Edit Users",
    users: "Users",
    name: "Name:",
    address: "Address:",
    country: "Country:",
    postalCode: "Postal Code:",
    phone: "Phone:",
    mobile: "Mobile:",
    email: "Email:",
    property: "Property:",
    specialty: "Specialty:",
    dentistAssociation: "Dentist Association:",
    afm: "AFM:",
    dou: "DOU:",
    medical: "Medical:",
    gender: "Gender:",
    area: "Area:",
    comment: "Comment:",
    userUpdateSuccess: "User data updated successfully!",
    
    // Member management translations
    memberManagement: "Member Management",
    noMembersYet: "No Active Members Yet",
    activateMembersInstruction: "Toggle membership status in the All Clients tab to add members.",
    noSearchResults: "No matching results found",
    adjustSearchTerm: "Try adjusting your search term",
    memberAddSuccess: "Client added as member successfully!",
    memberRemoveSuccess: "Client removed from membership.",
    membershipUpdateError: "Error updating membership status. Please try again.",
    yes: "Yes",
    no: "No",
    edit: "Edit",
   cancel: "Cancel",
   view: "View"
  },
  el: {
    settingsTitle: "Ρυθμίσεις",
    settingsHeading: "Ρυθμίσεις",
    languageOptions: "Επιλογές Γλώσσας",
    dataManagement: "Διαχείριση Δεδομένων",
    backupData: "Αντίγραφο Ασφαλείας Δεδομένων",
    clearCache: "Καθαρισμός Cache",
    resetSettings: "Επαναφορά Ρυθμίσεων",
    // Add additional translations for your pages
    home: "Αρχική",
    addUser: "Προσθήκη Πελάτη",
    editUser: "Επεξεργασία Πελάτη",
    exportToExcel: "Εξαγωγή σε Excel",
    report: "Αναφορά",
    settings: "Ρυθμίσεις",
    help: "Βοήθεια",
    logout: "Αποσύνδεση",
    // Sidebar specific
    Members: "Μέλη",
    // Analytics translations
    analytics: "Αναλυτικά Στοιχεία",
    clientsPerMonth: "Πελάτες",
    clientsWithMedical: "Πελάτες με Ιατρείο",
    genderDistribution: "Κατανομή Φύλου",
    male: "Άνδρας",
    female: "Γυναίκα",
    withMedical: "Με Ιατρείο",
    withoutMedical: "Χωρίς Ιατρείο",
    monthlySummary: "Μηνιαία Σύνοψη Εγγραφών Πελατών",
    month: "Μήνας",
    year: "Έτος",
    clientCount: "Αριθμός Πελατών",
    // Appointment translations
    appointment: "Ραντεβού",
    scheduleAppointment: "Προγραμματισμός Ραντεβού",
    selectClient: "Επιλογή Πελάτη",
    selectClientOption: "--Επιλέξτε πελάτη--",
    date: "Ημερομηνία",
    time: "Ώρα",
    makeAppointment: "Κλείσιμο Ραντεβού",
    upcomingAppointments: "Προσεχή Ραντεβού",
    loadingAppointments: "Φόρτωση ραντεβού...",
    editAppointment: "Επεξεργασία Ραντεβού",
    client: "Πελάτης",
    deleteAppointment: "Διαγραφή Ραντεβού",
    close: "Κλείσιμο",
    saveChanges: "Αποθήκευση Αλλαγών",
    edit: "Επεξεργασία",
    cancel: "Ακύρωση",
    // Search and index page translations
    searchBy: "Αναζήτηση κατά:",
    nameField: "Όνομα",
    addressField: "Διεύθυνση",
    emailField: "Email",
    phoneField: "Τηλέφωνο",
    searchClients: "Αναζήτηση πελατών...",
    currentClients: "Τρέχοντες πελάτες",
    clientHeader: "Πελάτης",
    addressHeader: "Διεύθυνση",
    emailHeader: "Email",
    phoneHeader: "Τηλέφωνο",
    actionsHeader: "Ενέργειες",
    appointments: "Ραντεβού",
    viewAll: "Προβολή όλων",
    upcoming: "Επερχόμενα",
    past: "Παρελθόντα",
    
    // Help Page Translations
    helpTitle: "Βοήθεια & Υποστήριξη",
    searchHelpTopics: "Αναζήτηση θεμάτων βοήθειας...",
    
    // FAQ Section
    faqHeading: "Συχνές Ερωτήσεις",
    
    faqQuestion1: "Πώς προσθέτω νέο χρήστη στη βάση δεδομένων;",
    faqAnswer1: "Για να προσθέσετε νέο χρήστη, πλοηγηθείτε στη σελίδα \"Προσθήκη Χρήστη\" από το πλαϊνό μενού. Συμπληρώστε όλα τα απαιτούμενα πεδία που σημειώνονται με αστερίσκο (*). Κάντε κλικ στο κουμπί \"Αποθήκευση\" για να προσθέσετε τον χρήστη στη βάση δεδομένων. Θα λάβετε μήνυμα επιβεβαίωσης όταν ο χρήστης προστεθεί επιτυχώς.",
    
    faqQuestion2: "Πώς μπορώ να εξάγω δεδομένα χρηστών σε Excel;",
    faqAnswer2: "Για να εξάγετε δεδομένα σε Excel, μεταβείτε στη σελίδα \"Εξαγωγή σε Excel\" από το πλαϊνό μενού. Επιλέξτε το εύρος δεδομένων που θέλετε να εξάγετε χρησιμοποιώντας τα παρεχόμενα φίλτρα. Κάντε κλικ στο κουμπί \"Δημιουργία Excel\". Μόλις ολοκληρωθεί η επεξεργασία, το αρχείο Excel θα κατέβει αυτόματα στον προεπιλεγμένο φάκελο λήψεων.",
    
    faqQuestion3: "Πώς δημιουργώ αντίγραφο ασφαλείας της βάσης δεδομένων μου;",
    faqAnswer3: "Για να δημιουργήσετε αντίγραφο ασφαλείας, μεταβείτε στη σελίδα \"Ρυθμίσεις\" από το πλαϊνό μενού. Στην ενότητα \"Διαχείριση Δεδομένων\", κάντε κλικ στο κουμπί \"Αντίγραφο Ασφαλείας\". Το σύστημα θα δημιουργήσει ένα πλήρες αντίγραφο της βάσης δεδομένων σας. Μόλις ολοκληρωθεί, θα σας ζητηθεί να επιλέξετε μια τοποθεσία για να αποθηκεύσετε το αρχείο. Συνιστάται να δημιουργείτε τακτικά αντίγραφα ασφαλείας, ειδικά πριν κάνετε σημαντικές αλλαγές στα δεδομένα σας.",
    
    faqQuestion4: "Πώς προγραμματίζω ένα ραντεβού για έναν χρήστη;",
    faqAnswer4: "Για να προγραμματίσετε ένα ραντεβού, πλοηγηθείτε στη σελίδα \"Ραντεβού\" από το πλαϊνό μενού. Επιλέξτε τον χρήστη από το αναπτυσσόμενο μενού ή αναζητήστε με όνομα. Επιλέξτε την επιθυμητή ημερομηνία και ώρα από το ημερολόγιο. Προσθέστε τυχόν σχετικές σημειώσεις ή λεπτομέρειες σχετικά με το ραντεβού. Κάντε κλικ στο \"Αποθήκευση Ραντεβού\" για επιβεβαίωση. Τόσο εσείς όσο και ο χρήστης θα λάβετε ειδοποίηση επιβεβαίωσης.",
    
    faqQuestion5: "Πώς μπορώ να δω αναλυτικά στοιχεία και αναφορές;",
    faqAnswer5: "Αποκτήστε πρόσβαση στη σελίδα \"Αναλυτικά\" από το πλαϊνό μενού για να δείτε αναλυτικές αναφορές. Μπορείτε να φιλτράρετε δεδομένα ανά χρονικό διάστημα, κατηγορίες χρηστών ή συγκεκριμένες μετρήσεις. Το σύστημα παρέχει οπτικά διαγράμματα για καλύτερη ερμηνεία δεδομένων. Για προσαρμοσμένες αναφορές, χρησιμοποιήστε τα προηγμένα φίλτρα στο επάνω μέρος της σελίδας. Οι αναφορές μπορούν να εξαχθούν ως αρχεία PDF ή Excel χρησιμοποιώντας τα κουμπιά στην επάνω δεξιά γωνία.",
    
    // Tutorial Section
    tutorialsHeading: "Οδηγοί Βήμα προς Βήμα",
    
    databaseBasics: "Βασικές Αρχές Βάσης Δεδομένων",
    databaseBasicsDesc: "Μάθετε τα βασικά της δομής της βάσης δεδομένων. Αυτή η εφαρμογή χρησιμοποιεί μια ασφαλή, τοπική βάση δεδομένων για την αποθήκευση όλων των πληροφοριών χρηστών. Οι εγγραφές οργανώνονται σε πίνακες με σχέσεις μεταξύ διαφορετικών τύπων δεδομένων. Η βάση δεδομένων δημιουργεί αυτόματα αντίγραφα ασφαλείας των σταδιακών αλλαγών για την αποφυγή απώλειας δεδομένων. Η κατανόηση αυτής της δομής θα σας βοηθήσει να πλοηγηθείτε και να χρησιμοποιήσετε το σύστημα πιο αποτελεσματικά.",
    
    searchingRecords: "Αναζήτηση & Φιλτράρισμα Εγγραφών",
    searchingRecordsDesc: "Βρείτε γρήγορα τις πληροφορίες που χρειάζεστε χρησιμοποιώντας προηγμένες λειτουργίες αναζήτησης. Το πλαίσιο αναζήτησης στο επάνω μέρος των περισσότερων σελίδων σάς επιτρέπει να αναζητάτε ανά όνομα, αναγνωριστικό, ημερομηνία ή οποιοδήποτε προσαρμοσμένο πεδίο. Χρησιμοποιήστε φίλτρα για να περιορίσετε τα αποτελέσματα ανά κατηγορίες, κατάσταση, χρονικά διαστήματα ή προσαρμοσμένα χαρακτηριστικά. Αποθηκεύστε συχνές αναζητήσεις ως προεπιλογές για γρήγορη πρόσβαση αργότερα. Τα αποτελέσματα μπορούν να ταξινομηθούν κάνοντας κλικ στις επικεφαλίδες στηλών.",
    
    dataManagementDesc: "Μάθετε βέλτιστες πρακτικές για τη διατήρηση ακριβών αρχείων χρηστών. Επαληθεύετε πάντα τις πληροφορίες πριν αποθηκεύσετε αλλαγές. Χρησιμοποιήστε τη λειτουργία μαζικής επεξεργασίας για να κάνετε την ίδια αλλαγή σε πολλές εγγραφές. Το σύστημα παρακολουθεί όλες τις αλλαγές με χρονικές σφραγίδες και πληροφορίες χρήστη. Τα υποχρεωτικά πεδία επισημαίνονται με αστερίσκο (*) και πρέπει να συμπληρωθούν. Χρησιμοποιήστε την ενότητα σημειώσεων για τυχόν πρόσθετες πληροφορίες που δεν ταιριάζουν στα τυποποιημένα πεδία.",
    
    reportsAnalytics: "Αναφορές & Αναλυτικά Στοιχεία",
    reportsAnalyticsDesc: "Δημιουργήστε διορατικές αναφορές για την παρακολούθηση βασικών μετρήσεων και τάσεων. Επιλέξτε από προκατασκευασμένα πρότυπα αναφορών ή δημιουργήστε προσαρμοσμένες αναφορές με συγκεκριμένα πεδία και φίλτρα. Προγραμματίστε αυτόματη δημιουργία αναφορών σε καθημερινή, εβδομαδιαία ή μηνιαία βάση με παράδοση μέσω email. Εξαγάγετε αναφορές σε διάφορες μορφές, συμπεριλαμβανομένων PDF, Excel ή CSV. Οπτικοποιήστε δεδομένα με διάφορους τύπους γραφημάτων, συμπεριλαμβανομένων των γραφημάτων ράβδων, γραμμών και πίτας για καλύτερη παρουσίαση.",
    
    // Support Section
    contactSupport: "Επικοινωνία με την Υποστήριξη",
    
    emailSupport: "Υποστήριξη μέσω Email",
    emailSupportDesc: "Στείλτε μας μια λεπτομερή περιγραφή του προβλήματός σας στο support@example.com. Η ομάδα μας συνήθως απαντά εντός 24 εργάσιμων ωρών.",
    
    phoneSupport: "Τηλεφωνική Υποστήριξη",
    phoneSupportDesc: "Καλέστε την ομάδα τεχνικής υποστήριξης στο +1-800-123-4567 μεταξύ 9 π.μ. και 5 μ.μ., Δευτέρα έως Παρασκευή.",
    
    documentation: "Τεκμηρίωση",
    documentationDesc: "Περιηγηθείτε στην πλήρη <a href=\"#\">online τεκμηρίωσή</a> μας για λεπτομερείς οδηγούς και υλικό αναφοράς.",
    
    // Edit User page translations
    editUserTitle: "Επεξεργασία Χρήστη",
    editUsers: "Επεξεργασία Χρηστών",
    users: "Χρήστες",
    name: "Όνομα:",
    address: "Διεύθυνση:",
    country: "Χώρα:",
    postalCode: "Ταχυδρομικός Κώδικας:",
    phone: "Τηλέφωνο:",
    mobile: "Κινητό:",
    email: "Email:",
    property: "Ιδιοκτησία:",
    specialty: "Ειδικότητα:",
    dentistAssociation: "Οδοντιατρικός Σύλλογος:",
    afm: "ΑΦΜ:",
    dou: "ΔΟΥ:",
    medical: "Ιατρείο:",
    gender: "Φύλο:",
    area: "Περιοχή:",
    comment: "Σχόλια:",
    userUpdateSuccess: "Τα δεδομένα χρήστη ενημερώθηκαν με επιτυχία!",
    
    // Member management translations
    memberManagement: "Διαχείριση Μελών",
    noMembersYet: "Δεν υπάρχουν ενεργά μέλη ακόμα",
    activateMembersInstruction: "Εναλλαγή κατάστασης συνδρομής στην καρτέλα 'Όλοι οι πελάτες' για προσθήκη μελών.",
    noSearchResults: "Δεν βρέθηκαν αποτελέσματα",
    adjustSearchTerm: "Δοκιμάστε να προσαρμόσετε τον όρο αναζήτησης",
    memberAddSuccess: "Ο πελάτης προστέθηκε με επιτυχία ως μέλος!",
    memberRemoveSuccess: "Ο πελάτης αφαιρέθηκε από τη συνδρομή.",
    membershipUpdateError: "Σφάλμα κατά την ενημέρωση της κατάστασης μέλους. Παρακαλώ προσπαθήστε ξανά.",
    yes: "Ναι",
    no: "Όχι",
    allClients: "Όλοι οι Πελάτες",
    membersOnly: "Μόνο Μέλη",
    clientMembership: "Κατάσταση Μέλους Πελάτη",
    memberStatus: "Κατάσταση Μέλους",
    memberSince: "Μέλος από",
    activeMembers: "Ενεργά Μέλη",

    // Update-related translations
    checkingForUpdates: "Έλεγχος για ενημερώσεις...",
    updateAvailable: "Διαθέσιμη ενημέρωση",
    noUpdatesAvailable: "Δεν υπάρχουν διαθέσιμες ενημερώσεις",
    installUpdate: "Εγκατάσταση ενημέρωσης",
    updateError: "Σφάλμα ενημέρωσης",
    currentVersion: "Τρέχουσα έκδοση",
    updateAppNow: "Ενημέρωση εφαρμογής τώρα",
    downloadingUpdate: "Λήψη ενημέρωσης...",
    restartToInstall: "Επανεκκίνηση για εγκατάσταση",

    // Database status translations
    databaseBusy: "Η βάση δεδομένων είναι απασχολημένη",
    resettingConnections: "Επαναφορά συνδέσεων...",
    connectionResetSuccess: "Οι συνδέσεις επαναφέρθηκαν με επιτυχία",

    // Cache related
    cacheClearedSuccess: "Η προσωρινή μνήμη εκκαθαρίστηκε με επιτυχία",
    clearingCache: "Εκκαθάριση προσωρινής μνήμης...",

    // Appointment type options
    checkup: "Έλεγχος",
    cleaning: "Καθαρισμός",
    emergency: "Έκτακτο περιστατικό",
    consultation: "Συμβουλευτική",
    filling: "Σφράγισμα",
    extraction: "Εξαγωγή",

    // Toast notifications
    operationSuccessful: "Η λειτουργία ολοκληρώθηκε με επιτυχία",
    operationFailed: "Η λειτουργία απέτυχε",
    tryAgain: "Παρακαλώ δοκιμάστε ξανά",

    // Button states
    processing: "Επεξεργασία...",
    saving: "Αποθήκευση...",
    loading: "Φόρτωση...",

    // Database management
    optimizeDatabase: "Βελτιστοποίηση βάσης δεδομένων",
    databaseOptimized: "Η βάση δεδομένων βελτιστοποιήθηκε με επιτυχία",
    resetDatabaseConnections: "Επαναφορά συνδέσεων βάσης δεδομένων",

    // Filter labels for appointments
    filterByDate: "Φιλτράρισμα κατά ημερομηνία",
    filterByClient: "Φιλτράρισμα κατά πελάτη",
    filterByType: "Φιλτράρισμα κατά τύπο",
    showAll: "Εμφάνιση όλων",

    // Form validation messages
    requiredField: "Απαιτούμενο πεδίο",
    invalidEmail: "Μη έγκυρο email",
    invalidPhone: "Μη έγκυρο τηλέφωνο",

    // Analytics terms
    weeklyStats: "Εβδομαδιαίες στατιστικές",
    monthlyStats: "Μηνιαίες στατιστικές",
    yearlyStats: "Ετήσιες στατιστικές",
    totalClients: "Συνολικοί πελάτες",
    newThisMonth: "Νέοι αυτό το μήνα",
    view: "Προβολή"
  }
};

function updateLanguage() {
  const lang = localStorage.getItem('preferredLanguage') || 'en';
  document.documentElement.lang = lang;
  
  // Update text content for elements with data-i18n attribute
  const translatableElems = document.querySelectorAll('[data-i18n]');
  translatableElems.forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      elem.textContent = translations[lang][key];
    }
  });
  
  // Update placeholder attributes for elements with data-i18n-placeholder
  const placeholderElems = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElems.forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      elem.placeholder = translations[lang][key];
    }
  });
  
  // Special handling for HTML content in translations (like links in documentation)
  const htmlContentElems = document.querySelectorAll('[data-i18n-html]');
  htmlContentElems.forEach(elem => {
    const key = elem.getAttribute('data-i18n-html');
    if (translations[lang] && translations[lang][key]) {
      elem.innerHTML = translations[lang][key];
    }
  });
}

// Listen for storage events so that if language changes in one page,
// the others can update as well.
window.addEventListener('storage', (event) => {
  if (event.key === 'preferredLanguage') {
    updateLanguage();
  }
});

export { updateLanguage, translations };