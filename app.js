// Demo users database
const users = [
  {
    id: 1,
    name: "Admin System",
    email: "admin@eduvocal.com",
    role: "Super Admin",
    status: true,
    password: "admin123"
  },
  {
    id: 2,
    name: "Juan Díaz",
    email: "juan@example.com",
    role: "Estudiante",
    status: true,
    password: "user123"
  },
  {
    id: 3,
    name: "María García",
    email: "maria@example.com",
    role: "Estudiante",
    status: true,
    password: "user456"
  },
  {
    id: 4,
    name: "Carlos López",
    email: "carlos@example.com",
    role: "Tutor Parental",
    status: true,
    password: "parent123"
  },
  {
    id: 5,
    name: "Laura Rodríguez",
    email: "laura@example.com",
    role: "Instructor",
    status: true,
    password: "instructor123"
  }
];

// Role permissions
const rolePermissions = {
  "Super Admin": ["dashboard", "vocational", "languages", "skills", "progress", "admin"],
  "Administrador": ["dashboard", "admin"],
  "Instructor": ["dashboard", "vocational", "languages", "skills", "progress"],
  "Tutor Parental": ["dashboard", "progress"],
  "Estudiante": ["dashboard", "vocational", "languages", "skills", "progress"]
};

// Current user state
let currentUser = null;

// Hack mode state
let hackModeEnabled = false;
let countdownInterval = null;
let hackModeCheckInterval = null;
let forceLogoutCountdown = null;
let previousHackModeState = false;
let hackModeActivatedBy = null;
let hackModeActivatedAt = null;

// Session events log
const sessionEventsLog = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  // Start hack mode detection
  startHackModeDetection();
  // Initialize hack mode countdown
  initializeHackCountdown();
  // Show login modal on load
  showLoginModal();

  // Setup login form
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', handleLogin);

  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', handleLogout);

  // Setup navigation
  setupNavigation();

  // Setup admin functionality
  setupAdmin();

  // Setup admin tabs
  setupAdminTabs();
});

// Setup admin tabs
function setupAdminTabs() {
  const adminTabs = document.querySelectorAll('.admin-tab');
  
  adminTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // Update active tab
      adminTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding content
      document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      const tabContent = document.getElementById(tabName + 'Tab');
      if (tabContent) {
        tabContent.classList.add('active');
      }
      
      // Update hack mode button if in settings tab
      if (tabName === 'settings') {
        updateHackModeButton();
      }
    });
  });
}

// Toggle Hack Mode
function toggleHackMode() {
  const wasEnabled = hackModeEnabled;
  hackModeEnabled = !hackModeEnabled;
  
  if (hackModeEnabled && currentUser) {
    // Log activation event
    hackModeActivatedBy = currentUser.id;
    hackModeActivatedAt = new Date().toISOString();
    
    sessionEventsLog.push({
      type: 'hack_mode_activated',
      timestamp: hackModeActivatedAt,
      activated_by: currentUser.id,
      user_name: currentUser.name
    });
    
    alert('🎭 Hack Mode ACTIVADO\n\n¡ATENCIÓN! Todos los usuarios (excepto tú) serán desconectados INMEDIATAMENTE.\n\nVerán la pantalla de hackeo al iniciar sesión.\n\n¡Esto es completamente lúdico y divertido! 😄');
  } else {
    hackModeActivatedBy = null;
    hackModeActivatedAt = null;
    alert('🔒 Hack Mode DESACTIVADO\n\nLa aplicación vuelve a su funcionamiento normal.');
  }
  
  updateHackModeButton();
}

// Update Hack Mode button
function updateHackModeButton() {
  const btn = document.getElementById('toggleHackModeBtn');
  const icon = document.getElementById('hackModeIcon');
  const text = document.getElementById('hackModeText');
  const status = document.getElementById('hackModeStatus');
  
  if (hackModeEnabled) {
    icon.textContent = '🔒';
    text.textContent = 'Desactivar Hack Mode';
    btn.classList.remove('btn--primary');
    btn.classList.add('btn--outline');
    if (status) status.style.display = 'block';
  } else {
    icon.textContent = '🔓';
    text.textContent = 'Activar Hack Mode';
    btn.classList.remove('btn--outline');
    btn.classList.add('btn--primary');
    if (status) status.style.display = 'none';
  }
}

// Initialize hack countdown
function initializeHackCountdown() {
  let hours = 24;
  let minutes = 0;
  let seconds = 0;
  
  countdownInterval = setInterval(() => {
    seconds--;
    
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    
    if (minutes < 0) {
      minutes = 59;
      hours--;
    }
    
    if (hours < 0) {
      hours = 23;
      minutes = 59;
      seconds = 59;
    }
    
    const countdownEl = document.getElementById('hackCountdown');
    if (countdownEl) {
      countdownEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }, 1000);
}

// Show hack screen
function showHackScreen() {
  document.getElementById('hackScreen').style.display = 'block';
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('mainApp').style.display = 'none';
}

// Hide hack screen
function hideHackScreen() {
  document.getElementById('hackScreen').style.display = 'none';
}

// Handle Pay Ransom
function handlePayRansom() {
  alert('💰 Redirigiendo a PayPal...\n\n¡Solo es una broma! 😄\n\nAccediendo al sistema...');
  hideHackScreen();
  hideLoginModal();
  updateUIForUser();
}

// Handle Lose Course
function handleLoseCourse() {
  const confirm = window.confirm('❌ ¿Estás seguro de que quieres perder la asignatura?\n\nPerderás TODO tu progreso académico.\n\nEsta es una decisión irreversible... o no. 😏');
  
  if (confirm) {
    alert('💀 ¡Has perdido la asignatura!\n\nTu progreso ha sido eliminado.\nTus calificaciones: 0/100\nTu futuro: Incierto\n\n...Solo es broma, vuelve a iniciar sesión. 😂');
    hideHackScreen();
    showLoginModal();
  }
}

// Handle Contact Admin
function handleContactAdmin() {
  alert('📧 Mensaje enviado al administrador\n\n"¡AYUDA! ¡El sistema ha sido hackeado por Sebastian Hortua!"\n\nEl administrador ha sido notificado...\n\n(Spoiler: El admin activó el Hack Mode 😏)');
  
  const continueChoice = window.confirm('¿Deseas continuar esperando la respuesta del admin o acceder al sistema?\n\nOK = Esperar\nCancelar = Acceder');
  
  if (!continueChoice) {
    hideHackScreen();
    hideLoginModal();
    updateUIForUser();
  }
}

// Show login modal
function showLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
  document.getElementById('mainApp').style.display = 'none';
}

// Hide login modal
function hideLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
}

// Handle login
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    errorDiv.textContent = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
    errorDiv.style.display = 'block';
    return;
  }

  // Check if user is blocked
  if (!user.status) {
    errorDiv.textContent = 'Tu cuenta ha sido bloqueada. Contacta al administrador.';
    errorDiv.style.display = 'block';
    return;
  }

  // Login successful
  currentUser = user;
  errorDiv.style.display = 'none';
  document.getElementById('loginForm').reset();

  // Check if hack mode is enabled and user is not Super Admin
  if (hackModeEnabled && currentUser.role !== 'Super Admin') {
    showHackScreen();
    return;
  }

  // Hide login modal and show app
  hideLoginModal();

  // Update UI for logged in user
  updateUIForUser();
}

// Handle logout
function handleLogout() {
  currentUser = null;
  showLoginModal();
  
  // Reset active navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector('[data-section="dashboard"]').classList.add('active');
  
  // Show dashboard section
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById('dashboard').classList.add('active');
}

// Update UI for logged in user
function updateUIForUser() {
  if (!currentUser) return;

  // Update avatar with initials
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2);
  document.getElementById('userAvatar').textContent = initials;

  // Update welcome message
  document.getElementById('welcomeMessage').textContent = `Bienvenido, ${currentUser.name}`;
  document.getElementById('userRole').textContent = `Rol: ${currentUser.role}`;

  // Show/hide admin nav based on role
  const adminNavLink = document.querySelector('[data-section="admin"]');
  if (currentUser.role === 'Super Admin') {
    adminNavLink.style.display = 'block';
  } else {
    adminNavLink.style.display = 'none';
  }

  // Update navigation based on permissions
  updateNavigationPermissions();

  // If user is Super Admin and in admin section, render users table
  if (currentUser.role === 'Super Admin') {
    renderUsersTable();
  }
}

// Update navigation based on permissions
function updateNavigationPermissions() {
  if (!currentUser) return;

  const permissions = rolePermissions[currentUser.role] || [];
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const section = link.getAttribute('data-section');
    if (permissions.includes(section)) {
      link.style.display = 'block';
    } else if (section !== 'admin') {
      link.style.display = 'none';
    }
  });
}

// Setup navigation
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const section = this.getAttribute('data-section');
      
      // Check permissions
      if (currentUser) {
        const permissions = rolePermissions[currentUser.role] || [];
        if (!permissions.includes(section)) {
          return;
        }
      }
      
      // Update active nav
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Show section
      document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
      });
      document.getElementById(section).classList.add('active');
    });
  });
}

// Setup admin functionality
function setupAdmin() {
  const addUserBtn = document.getElementById('addUserBtn');
  const userModal = document.getElementById('userModal');
  const closeUserModal = document.getElementById('closeUserModal');
  const cancelUserBtn = document.getElementById('cancelUserBtn');
  const userForm = document.getElementById('userForm');

  // Add user button
  if (addUserBtn) {
    addUserBtn.addEventListener('click', function() {
      document.getElementById('userModalTitle').textContent = 'Agregar Usuario';
      document.getElementById('userForm').reset();
      document.getElementById('userId').value = '';
      userModal.style.display = 'flex';
    });
  }

  // Close modal buttons
  if (closeUserModal) {
    closeUserModal.addEventListener('click', function() {
      userModal.style.display = 'none';
    });
  }

  if (cancelUserBtn) {
    cancelUserBtn.addEventListener('click', function() {
      userModal.style.display = 'none';
    });
  }

  // User form submit
  if (userForm) {
    userForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const userId = document.getElementById('userId').value;
      const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRoleSelect').value,
        password: document.getElementById('userPassword').value,
        status: true
      };

      if (userId) {
        // Edit existing user
        const user = users.find(u => u.id === parseInt(userId));
        if (user) {
          user.name = userData.name;
          user.email = userData.email;
          user.role = userData.role;
          if (userData.password) {
            user.password = userData.password;
          }
        }
      } else {
        // Add new user
        const newUser = {
          id: users.length + 1,
          ...userData
        };
        users.push(newUser);
      }

      userModal.style.display = 'none';
      renderUsersTable();
    });
  }
}

// Render users table
function renderUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <span class="status ${user.status ? 'status--success' : 'status--error'}">
          ${user.status ? 'Activo' : 'Bloqueado'}
        </span>
      </td>
      <td>
        <button class="btn btn--outline btn--sm action-btn" onclick="editUser(${user.id})">Editar</button>
        <button class="btn ${user.status ? 'btn--outline' : 'btn--primary'} btn--sm action-btn" onclick="toggleUserStatus(${user.id})">
          ${user.status ? 'Bloquear' : 'Activar'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Edit user
function editUser(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;

  document.getElementById('userModalTitle').textContent = 'Editar Usuario';
  document.getElementById('userId').value = user.id;
  document.getElementById('userName').value = user.name;
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userRoleSelect').value = user.role;
  document.getElementById('userPassword').value = '';
  document.getElementById('userPassword').placeholder = 'Dejar en blanco para mantener';
  document.getElementById('userPassword').required = false;

  document.getElementById('userModal').style.display = 'flex';
}

// Toggle user status
function toggleUserStatus(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;

  user.status = !user.status;

  // If current user is blocked, logout
  if (currentUser && currentUser.id === userId && !user.status) {
    alert('Tu cuenta ha sido bloqueada.');
    handleLogout();
    return;
  }

  renderUsersTable();
}

// Start hack mode detection (checks every 2 seconds)
function startHackModeDetection() {
  hackModeCheckInterval = setInterval(() => {
    checkHackModeStatus();
  }, 2000); // Check every 2 seconds
}

// Check hack mode status
function checkHackModeStatus() {
  // Only check if user is logged in
  if (!currentUser) {
    previousHackModeState = hackModeEnabled;
    return;
  }
  
  // Detect if hack mode was just activated (false -> true)
  if (hackModeEnabled && !previousHackModeState) {
    // Hack mode was just activated
    console.log('Hack Mode activated detected!');
    
    // Check if current user is Super Admin
    if (currentUser.role !== 'Super Admin') {
      // Force logout this user
      console.log('Force logout triggered for user:', currentUser.name);
      triggerForceLogout();
    } else {
      console.log('Super Admin immunity - no logout');
    }
  }
  
  // Update previous state
  previousHackModeState = hackModeEnabled;
}

// Trigger force logout
function triggerForceLogout() {
  // Log the force logout event
  sessionEventsLog.push({
    type: 'force_logout',
    timestamp: new Date().toISOString(),
    user_id: currentUser.id,
    user_name: currentUser.name,
    reason: 'hack_mode_activated'
  });
  
  // Show force logout modal
  showForceLogoutModal();
}

// Show force logout modal
function showForceLogoutModal() {
  const modal = document.getElementById('forceLogoutModal');
  const countdownEl = document.getElementById('forceLogoutCountdown');
  
  modal.style.display = 'flex';
  
  // Start countdown
  let countdown = 3;
  countdownEl.textContent = countdown;
  
  // Play alert sound (optional - using beep pattern)
  playAlertSound();
  
  forceLogoutCountdown = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;
    
    if (countdown <= 0) {
      clearInterval(forceLogoutCountdown);
      executeForceLogout();
    }
  }, 1000);
}

// Execute force logout
function executeForceLogout() {
  // Hide modal
  document.getElementById('forceLogoutModal').style.display = 'none';
  
  // Clear user session
  const userName = currentUser ? currentUser.name : 'Usuario';
  currentUser = null;
  
  // Clear any session data
  // Note: We cannot use localStorage in sandboxed environment
  
  // Reset UI
  document.getElementById('mainApp').style.display = 'none';
  
  // Show login modal first
  document.getElementById('loginModal').style.display = 'flex';
  
  // Then immediately show hack screen
  setTimeout(() => {
    showHackScreen();
  }, 100);
  
  console.log(`Force logout executed for: ${userName}`);
}

// Play alert sound (creates beep pattern)
function playAlertSound() {
  // Create audio context for beep sound
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // Audio context might not be available
    console.log('Audio not available');
  }
}

// View session events log (for Super Admin)
function viewSessionEventsLog() {
  if (!currentUser || currentUser.role !== 'Super Admin') {
    return;
  }
  
  if (sessionEventsLog.length === 0) {
    alert('📋 Log de Eventos\n\nNo hay eventos registrados.');
    return;
  }
  
  let logText = '📋 LOG DE EVENTOS DE SESIÓN\n\n';
  
  sessionEventsLog.forEach((event, index) => {
    const time = new Date(event.timestamp).toLocaleString('es');
    logText += `[${index + 1}] ${time}\n`;
    logText += `Tipo: ${event.type}\n`;
    
    if (event.type === 'hack_mode_activated') {
      logText += `Activado por: ${event.user_name} (ID: ${event.activated_by})\n`;
    } else if (event.type === 'force_logout') {
      logText += `Usuario: ${event.user_name} (ID: ${event.user_id})\n`;
      logText += `Razón: ${event.reason}\n`;
    }
    
    logText += '\n';
  });
  
  alert(logText);
}

// Make functions global for inline onclick handlers
window.editUser = editUser;
window.toggleUserStatus = toggleUserStatus;
window.toggleHackMode = toggleHackMode;
window.handlePayRansom = handlePayRansom;
window.handleLoseCourse = handleLoseCourse;
window.handleContactAdmin = handleContactAdmin;
window.viewSessionEventsLog = viewSessionEventsLog;