// State
const state = {
    user: null, // 'user' or 'admin'
    isAdmin: false,
    language: localStorage.getItem('lang') || 'th',
    historyViewMode: 'daily',
    logFilter: 'ALL',
    logs: (() => {
        try {
            const parsed = JSON.parse(localStorage.getItem('systemLogs') || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch (_) {
            return [];
        }
    })(),
    historyData: [],
    historyChart: null,
    // เธเนเธญเธกเธนเธฅเธญเธธเธเธเธฃเธ“เน
    devices: [
        { id: 1, name: 'Main Pump House', responsible: 'Somchai Jaidee', status: 'active', loc: 'Bangkok Hospital' },
        { id: 2, name: 'Treatment Tank B', responsible: 'Somsri Rakdee', status: 'active', loc: 'Siriraj Hospital' },
        { id: 3, name: 'Outlet Sensor', responsible: 'John Doe', status: 'maintenance', loc: 'Chula Hospital' }
    ],
    // เธเนเธญเธกเธนเธฅเธเธนเนเนเธเนเธเธฒเธ
    users: [
        { id: 1, name: 'System Admin', email: 'admin@hydro.com', role: 'admin', hospital: 'เนเธฃเธเธเธขเธฒเธเธฒเธฅเธเธฃเธฐเธเธฑเนเธเน€เธเธฅเนเธฒ' },
        { id: 2, name: 'Somsri Operation', email: 'somsri@hydro.com', role: 'user', hospital: 'เนเธฃเธเธเธขเธฒเธเธฒเธฅเธเธฃเธฐเธเธฑเนเธเน€เธเธฅเนเธฒ' },
        { id: 3, name: 'Engineer Team', email: 'eng@hydro.com', role: 'user', hospital: 'เนเธฃเธเธเธขเธฒเธเธฒเธฅเธเธฃเธฐเธเธฑเนเธเน€เธเธฅเนเธฒ' }
    ],
    gauges: {}
};

if (!state.logs.length) {
    state.logs = [
        {
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            type: 'UPDATE DEVICE',
            message: 'Admin updated device <strong>Plant A</strong>.'
        },
        {
            timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
            type: 'LOGIN',
            message: 'User <strong>admin@hydro.com</strong> logged in.'
        }
    ];
    localStorage.setItem('systemLogs', JSON.stringify(state.logs));
}

const translations = {
    th: {
        'login.welcome': 'เธขเธดเธเธ”เธตเธ•เนเธญเธเธฃเธฑเธ',
        'login.subtitle': 'เธฃเธฐเธเธเธ•เธดเธ”เธ•เธฒเธกเธเธธเธ“เธ เธฒเธเธเนเธณเน€เธชเธตเธข<br>เธ•เนเธเนเธเธเธฃเธฐเธเธเธเธณเธเธฑเธ” เนเธฃเธเธเธขเธฒเธเธฒเธฅเธเธฃเธฐเธเธฑเนเธเน€เธเธฅเนเธฒ',
        'login.email': 'เธญเธตเน€เธกเธฅ',
        'login.password': 'เธฃเธซเธฑเธชเธเนเธฒเธ',
        'login.emailPlaceholder': 'เธเธฃเธญเธเธญเธตเน€เธกเธฅ',
        'login.passwordPlaceholder': 'เธเธฃเธญเธเธฃเธซเธฑเธชเธเนเธฒเธ',
        'login.button': 'เน€เธเนเธฒเธชเธนเนเธฃเธฐเธเธ',
        'login.adminHint': 'By logging in, you agree to our Terms of Service.',
        'nav.dashboard': 'เนเธ”เธเธเธญเธฃเนเธ”',
        'nav.history': 'เธเธฃเธฐเธงเธฑเธ•เธด',
        'nav.manual': 'เธเธฑเธเธ—เธถเธเธเนเธญเธกเธนเธฅ',
        'nav.adminSection': 'เธเธนเนเธ”เธนเนเธฅเธฃเธฐเธเธ',
        'nav.devices': 'เธเธฑเธ”เธเธฒเธฃเธญเธธเธเธเธฃเธ“เน',
        'nav.users': 'เธเธฑเธ”เธเธฒเธฃเธเธนเนเนเธเน',
        'nav.logs': 'เธเธฑเธเธ—เธถเธเธฃเธฐเธเธ',
        'nav.logout': 'เธญเธญเธเธเธฒเธเธฃเธฐเธเธ',
        'dashboard.title': 'เนเธ”เธเธเธญเธฃเนเธ”',
        'dashboard.subtitle': 'เธ•เธดเธ”เธ•เธฒเธกเธเธธเธ“เธ เธฒเธเธเนเธณเนเธเธเน€เธฃเธตเธขเธฅเนเธ—เธกเน',
        'history.title': 'เธงเธดเน€เธเธฃเธฒเธฐเธซเนเธเธฃเธฐเธงเธฑเธ•เธด',
        'history.subtitle': 'เนเธเธงเนเธเนเธกเธขเนเธญเธเธซเธฅเธฑเธเนเธฅเธฐเธเธฑเธเธ—เธถเธเธเนเธญเธกเธนเธฅ',
        'history.daily': 'เธฃเธฒเธขเธงเธฑเธ',
        'history.monthly': 'เธฃเธฒเธขเน€เธ”เธทเธญเธ',
        'manual.title': 'เธเธฑเธเธ—เธถเธเธเนเธญเธกเธนเธฅเธ”เนเธงเธขเธ•เธเน€เธญเธ',
        'manual.subtitle': 'เธเธฑเธเธ—เธถเธเธเนเธฒเธ—เธตเนเธ•เธฃเธงเธเธงเธฑเธ”เธเธฃเธดเธ',
        'manual.save': 'เธเธฑเธเธ—เธถเธ',
        'manual.reset': 'เธฃเธตเน€เธเนเธ•',
        'manual.saveRecord': 'เธเธฑเธเธ—เธถเธเธเนเธญเธกเธนเธฅ',
        'manual.ph': 'เธเนเธฒ pH (0-14)',
        'manual.do': 'เธญเธญเธเธเธดเน€เธเธเธฅเธฐเธฅเธฒเธขเธเนเธณ (mg/L)',
        'manual.ss': 'เธชเธฒเธฃเนเธเธงเธเธฅเธญเธข (mg/L)',
        'manual.nitrite': 'เนเธเนเธ•เธฃเธ•เน (mg/L)',
        'manual.nitrate': 'เนเธเน€เธ•เธฃเธ• (mg/L)',
        'manual.phosphate': 'เธเธญเธชเน€เธเธ• (mg/L)',
        'manual.levelIn': 'เธฃเธฐเธ”เธฑเธเธเนเธณเน€เธเนเธฒ (cm)',
        'manual.levelOut': 'เธฃเธฐเธ”เธฑเธเธเนเธณเธญเธญเธ (cm)',
        'devices.title': 'เธเธฑเธ”เธเธฒเธฃเธญเธธเธเธเธฃเธ“เน',
        'users.title': 'เธเธฑเธ”เธเธฒเธฃเธเธนเนเนเธเน',
        'logs.title': 'เธเธฑเธเธ—เธถเธเธฃเธฐเธเธ',
        'status.online': 'เธฃเธฐเธเธเธเธเธ•เธด',
        'status.warning': 'เนเธเนเธเน€เธ•เธทเธญเธ',
        'status.critical': 'เธงเธดเธเธคเธ•',
        'alert.fillAll': 'เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเนเธญเธกเธนเธฅเนเธซเนเธเธฃเธ',
        'alert.selectOne': 'เธเธฃเธธเธ“เธฒเน€เธฅเธทเธญเธเธญเธขเนเธฒเธเธเนเธญเธข 1 เธเธฒเธฃเธฒเธกเธดเน€เธ•เธญเธฃเนเธ—เธตเนเธเธฐเธเธฑเธเธ—เธถเธ',
        'alert.pleaseEnter': 'เธเธฃเธธเธ“เธฒเธเธฃเธญเธ',
        'alert.invalidValue': 'เธเนเธฒเนเธกเนเธ–เธนเธเธ•เนเธญเธเธชเธณเธซเธฃเธฑเธ',
        'alert.savedCount': 'เธเธฑเธเธ—เธถเธเนเธฅเนเธง {count} เธเธฒเธฃเธฒเธกเธดเน€เธ•เธญเธฃเน',
        'field.ph': 'เธเนเธฒ pH',
        'field.do': 'เธญเธญเธเธเธดเน€เธเธเธฅเธฐเธฅเธฒเธขเธเนเธณ',
        'field.ss': 'เธชเธฒเธฃเนเธเธงเธเธฅเธญเธข',
        'field.nitrite': 'เนเธเนเธ•เธฃเธ•เน',
        'field.nitrate': 'เนเธเน€เธ•เธฃเธ•',
        'field.phosphate': 'เธเธญเธชเน€เธเธ•',
        'field.levelIn': 'เธฃเธฐเธ”เธฑเธเธเนเธณเน€เธเนเธฒ',
        'field.levelOut': 'เธฃเธฐเธ”เธฑเธเธเนเธณเธญเธญเธ'
    },
    en: {
        'login.welcome': 'Welcome Back',
        'login.subtitle': 'Wastewater Quality Monitoring System<br>Pranangklao Hospital Treatment System Prototype',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.emailPlaceholder': 'Enter your email',
        'login.passwordPlaceholder': 'Enter your password',
        'login.button': 'Login',
        'login.adminHint': 'By logging in, you agree to our Terms of Service.',
        'nav.dashboard': 'Dashboard',
        'nav.history': 'History',
        'nav.manual': 'Manual Entry',
        'nav.adminSection': 'ADMINISTRATION',
        'nav.devices': 'Device Manager',
        'nav.users': 'User Management',
        'nav.logs': 'System Logs',
        'nav.logout': 'Logout',
        'dashboard.title': 'Dashboard',
        'dashboard.subtitle': 'Real-time water quality monitoring',
        'history.title': 'History Analysis',
        'history.subtitle': 'Historical trends and data logs',
        'history.daily': 'Daily',
        'history.monthly': 'Monthly',
        'manual.title': 'Manual Data Entry',
        'manual.subtitle': 'Record physical measurements',
        'manual.save': 'Save',
        'manual.reset': 'Reset',
        'manual.saveRecord': 'Save Record',
        'manual.ph': 'pH Level (0-14)',
        'manual.do': 'Dissolved Oxygen (mg/L)',
        'manual.ss': 'Suspended Solids (mg/L)',
        'manual.nitrite': 'Nitrite (mg/L)',
        'manual.nitrate': 'Nitrate (mg/L)',
        'manual.phosphate': 'Phosphate (mg/L)',
        'manual.levelIn': 'Water Level In (cm)',
        'manual.levelOut': 'Water Level Out (cm)',
        'devices.title': 'Device Manager',
        'users.title': 'User Management',
        'logs.title': 'System Logs',
        'status.online': 'System Online',
        'status.warning': 'WARNING',
        'status.critical': 'CRITICAL ALERT',
        'alert.fillAll': 'Please fill in all fields.',
        'alert.selectOne': 'Please select at least one parameter to save.',
        'alert.pleaseEnter': 'Please enter',
        'alert.invalidValue': 'Invalid value for',
        'alert.savedCount': 'Saved {count} selected parameter(s).',
        'field.ph': 'pH Level',
        'field.do': 'Dissolved Oxygen',
        'field.ss': 'Suspended Solids',
        'field.nitrite': 'Nitrite',
        'field.nitrate': 'Nitrate',
        'field.phosphate': 'Phosphate',
        'field.levelIn': 'Water Level In',
        'field.levelOut': 'Water Level Out'
    }
};

const extraTranslations = {
    th: {
        'devices.add': 'เน€เธเธดเนเธกเธญเธธเธเธเธฃเธ“เน',
        'devices.modalAddTitle': 'เน€เธเธดเนเธกเธญเธธเธเธเธฃเธ“เน',
        'devices.modalEditTitle': 'เนเธเนเนเธเธญเธธเธเธเธฃเธ“เน',
        'devices.deviceName': 'เธเธทเนเธญเธญเธธเธเธเธฃเธ“เน',
        'devices.location': 'เธชเธ–เธฒเธเธ—เธตเนเธ•เธดเธ”เธ•เธฑเนเธ',
        'devices.responsible': 'เธเธนเนเธฃเธฑเธเธเธดเธ”เธเธญเธ',
        'devices.status': 'เธชเธ–เธฒเธเธฐ',
        'devices.statusActive': 'เธเธฃเนเธญเธกเนเธเนเธเธฒเธ',
        'devices.statusMaintenance': 'เธเนเธญเธกเธเธณเธฃเธธเธ',
        'devices.statusOffline': 'เธญเธญเธเนเธฅเธเน',
        'devices.managedBy': 'เธ”เธนเนเธฅเนเธ”เธข',
        'devices.edit': 'เนเธเนเนเธ',
        'devices.deleteConfirm': 'เธขเธทเธเธขเธฑเธเธเธฒเธฃเธฅเธเธญเธธเธเธเธฃเธ“เนเธเธตเน?',
        'users.add': 'เน€เธเธดเนเธกเธเธนเนเนเธเน',
        'users.modalAddTitle': 'เน€เธเธดเนเธกเธเธนเนเนเธเนเธเธฒเธ',
        'users.modalEditTitle': 'เนเธเนเนเธเธชเธดเธ—เธเธดเน',
        'users.name': 'เธเธทเนเธญ - เธเธฒเธกเธชเธเธธเธฅ',
        'users.email': 'เธญเธตเน€เธกเธฅ (Login ID)',
        'users.role': 'เธชเธดเธ—เธเธดเนเธเธฒเธฃเนเธเนเธเธฒเธ',
        'users.roleAdmin': 'เนเธญเธ”เธกเธดเธ',
        'users.roleUser': 'เธเธนเนเนเธเน',
        'users.roleViewer': 'เธเธนเนเธเธก',
        'users.hospital': 'เธชเธฑเธเธเธฑเธ”เนเธฃเธเธเธขเธฒเธเธฒเธฅ',
        'users.hospitalPranangklao': '&#10003; เนเธฃเธเธเธขเธฒเธเธฒเธฅเธเธฃเธฐเธเธฑเนเธเน€เธเธฅเนเธฒ',
        'users.editPermission': 'เนเธเนเนเธเธชเธดเธ—เธเธดเน',
        'users.deleteConfirm': 'เธเธธเธ“เธ•เนเธญเธเธเธฒเธฃเธฅเธเธเธนเนเนเธเนเธเธฒเธเธเธตเนเธญเธญเธเธเธฒเธเธฃเธฐเธเธเธซเธฃเธทเธญเนเธกเน?',
        'common.cancel': 'เธขเธเน€เธฅเธดเธ',
        'common.save': 'เธเธฑเธเธ—เธถเธ',
        'log.adminUpdatedDevice': 'เนเธญเธ”เธกเธดเธเธญเธฑเธเน€เธ”เธ•เธญเธธเธเธเธฃเธ“เน',
        'log.adminAddedDevice': 'เนเธญเธ”เธกเธดเธเน€เธเธดเนเธกเธญเธธเธเธเธฃเธ“เน',
        'log.adminDeletedDevice': 'เนเธญเธ”เธกเธดเธเธฅเธเธญเธธเธเธเธฃเธ“เน',
        'log.adminUpdatedUser': 'เนเธญเธ”เธกเธดเธเธญเธฑเธเน€เธ”เธ•เธเธนเนเนเธเน',
        'log.adminAddedUser': 'เนเธญเธ”เธกเธดเธเน€เธเธดเนเธกเธเธนเนเนเธเน',
        'log.adminDeletedUser': 'เนเธญเธ”เธกเธดเธเธฅเธเธเธนเนเนเธเน'
    },
    en: {
        'devices.add': 'Add Device',
        'devices.modalAddTitle': 'Add Device',
        'devices.modalEditTitle': 'Edit Device',
        'devices.deviceName': 'Device Name',
        'devices.location': 'Location',
        'devices.responsible': 'Responsible',
        'devices.status': 'Status',
        'devices.statusActive': 'Active',
        'devices.statusMaintenance': 'Maintenance',
        'devices.statusOffline': 'Offline',
        'devices.managedBy': 'Managed by',
        'devices.edit': 'Edit',
        'devices.deleteConfirm': 'Are you sure you want to delete this device?',
        'users.add': 'Add User',
        'users.modalAddTitle': 'Add User',
        'users.modalEditTitle': 'Edit Permission',
        'users.name': 'Full Name',
        'users.email': 'Email (Login ID)',
        'users.role': 'Role',
        'users.roleAdmin': 'Admin',
        'users.roleUser': 'User',
        'users.roleViewer': 'Viewer',
        'users.hospital': 'Hospital Affiliation',
        'users.hospitalPranangklao': '&#10003; Pranangklao Hospital',
        'users.editPermission': 'Edit Permission',
        'users.deleteConfirm': 'Are you sure you want to remove this user?',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'log.adminUpdatedDevice': 'Admin updated device',
        'log.adminAddedDevice': 'Admin added device',
        'log.adminDeletedDevice': 'Admin deleted device',
        'log.adminUpdatedUser': 'Admin updated user',
        'log.adminAddedUser': 'Admin added user',
        'log.adminDeletedUser': 'Admin deleted user'
    }
};

const DEFAULT_HOSPITAL = 'pranangklao-hospital';

function t(key) {
    return (
        extraTranslations[state.language]?.[key] ||
        translations[state.language]?.[key] ||
        extraTranslations.en[key] ||
        translations.en[key] ||
        key
    );
}

function applyLanguage() {
    document.documentElement.lang = state.language === 'th' ? 'th' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        el.innerHTML = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = t(key);
    });

    const toggle = document.getElementById('lang-toggle');
    if (toggle) toggle.textContent = state.language === 'th' ? 'EN' : 'TH';

    // Re-render dynamic sections that are generated from JS templates.
    if (document.getElementById('device-list')) renderDevices();
    if (document.getElementById('user-list')) renderUsers();
    if (document.getElementById('history-table-body')) refreshHistoryView();
    if (document.getElementById('log-list')) renderLogs();
}

function toggleLanguage() {
    state.language = state.language === 'th' ? 'en' : 'th';
    localStorage.setItem('lang', state.language);
    applyLanguage();
}

function ensureUserHospitalField() {
    const form = document.getElementById('user-form');
    if (!form) return;

    const formStack = form.querySelector('div[style*="flex-direction:column"]');
    if (!formStack) return;

    let group = document.getElementById('user-hospital-group');
    if (!group) {
        group = document.createElement('div');
        group.id = 'user-hospital-group';
        group.className = 'form-group';
        group.innerHTML = `
            <label data-i18n="users.hospital">เธชเธฑเธเธเธฑเธ”เนเธฃเธเธเธขเธฒเธเธฒเธฅ</label>
            <select id="user-hospital" class="glass-input" required>
                <option value="${DEFAULT_HOSPITAL}" data-i18n="users.hospitalPranangklao">&#10003; เนเธฃเธเธเธขเธฒเธเธฒเธฅเธเธฃเธฐเธเธฑเนเธเน€เธเธฅเนเธฒ</option>
            </select>
        `;
        formStack.appendChild(group);
    }

    const hospitalSelect = group.querySelector('#user-hospital');
    if (!hospitalSelect) return;
    hospitalSelect.required = true;
    hospitalSelect.value = hospitalSelect.value || DEFAULT_HOSPITAL;
    group.style.display = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    ensureUserHospitalField();
    state.users = state.users.map((u) => ({ ...u, hospital: DEFAULT_HOSPITAL }));
    applyLanguage();
    lucide.createIcons();
    generateHistory();
    initHistoryChart();
    try { initGaugeCharts(); } catch(e) { console.error("Gauge init error:", e); }

    initLiff();

    const hash = window.location.hash.replace("#", "");

    if (hash) {
        document.getElementById('login-view').classList.remove('active');
        document.getElementById('main-layout').classList.add('active');
        navigate(hash);
    }
});

// --- Responsive Sidebar Logic ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// --- Authentication ---
function setRole(role) {
    state.isAdmin = (role === 'admin');
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    const btnText = document.getElementById('login-btn-text');
    btnText.textContent = state.isAdmin ? "Login" : "Login";
}

function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        alert(t('alert.fillAll'));
        return;
    }

    const emailLower = email.toLowerCase();
    const passwordLower = password.toLowerCase();
    const isAdminLogin = (
        (emailLower === 'admin' || emailLower === 'admin@hydro.com') &&
        passwordLower === 'admin'
    );

    state.isAdmin = isAdminLogin;

    state.user = {
        email,
        role: isAdminLogin ? 'admin' : 'user'
    };

    addLog(`User <strong>${email}</strong> logged in.`, 'LOGIN');

    document.getElementById('login-view').classList.remove('active');
    document.getElementById('main-layout').classList.add('active');
    document.getElementById('admin-menu').classList.toggle('hidden', !isAdminLogin);

    navigate('dashboard');
    startDashboardUpdates();
}

function handleLogout() {
    addLog(`User <strong>${state.user?.email || 'unknown'}</strong> logged out.`, 'LOGOUT');
    location.reload();
}

// --- Navigation ---
function navigate(viewId) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(viewId + '-view');
    if (target) target.classList.add('active');
    
    const navLink = document.querySelector(`.nav-item[onclick="navigate('${viewId}')"]`);
    if (navLink) navLink.classList.add('active');
    
    // Auto close sidebar on mobile when navigating
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('mobile-overlay').classList.remove('active');
    }

    if (viewId === 'devices') renderDevices();
    if (viewId === 'users') renderUsers();
    if (viewId === 'logs') renderLogs();
}

// --- Dashboard Logic ---
function initGaugeCharts() {
    const phEl = document.getElementById('phCanvas');
    if(phEl) {
        const ctxPh = phEl.getContext('2d');
        state.gauges.ph = new Chart(ctxPh, {
            type: 'doughnut',
            data: {
                labels: ['Value', 'Remaining'],
                datasets: [{
                    data: [7, 7],
                    backgroundColor: ['#38bdf8', 'rgba(255,255,255,0.05)'],
                    borderWidth: 0,
                    borderRadius: 10,
                    cutout: '85%'
                }]
            },
            options: {
                rotation: -90,
                circumference: 180,
                animation: { animateRotate: true, animateScale: false },
                plugins: { tooltip: { enabled: false }, legend: { display: false } },
                maintainAspectRatio: false
            }
        });
    }

    const doEl = document.getElementById('doCanvas');
    if(doEl) {
        const ctxDo = doEl.getContext('2d');
        state.gauges.do = new Chart(ctxDo, {
            type: 'doughnut',
            data: {
                labels: ['Value', 'Remaining'],
                datasets: [{
                    data: [8.5, 6.5],
                    backgroundColor: ['#2dd4bf', 'rgba(255,255,255,0.05)'],
                    borderWidth: 0,
                    borderRadius: 10,
                    cutout: '85%'
                }]
            },
            options: {
                rotation: -90,
                circumference: 180,
                animation: { animateRotate: true, animateScale: false },
                plugins: { tooltip: { enabled: false }, legend: { display: false } },
                maintainAspectRatio: false
            }
        });
    }
}

function startDashboardUpdates() {
    setInterval(() => {
        const ph = (7.0 + (Math.random() * 1.0 - 0.5)).toFixed(2);
        const doVal = (8.0 + (Math.random() * 2.0 - 1.0)).toFixed(2);
        
        const phTxt = document.getElementById('val-ph');
        if(phTxt) phTxt.textContent = ph;
        
        const doTxt = document.getElementById('val-do');
        if(doTxt) doTxt.textContent = doVal;
        
        if (state.gauges.ph) {
            state.gauges.ph.data.datasets[0].data = [ph, 14 - ph];
            state.gauges.ph.data.datasets[0].backgroundColor[0] = ph < 6 || ph > 8.5 ? '#f87171' : '#38bdf8';
            state.gauges.ph.update();
        }
        if (state.gauges.do) {
            const maxDo = 15;
            state.gauges.do.data.datasets[0].data = [doVal, maxDo - doVal];
            state.gauges.do.update();
        }
        updateSystemStatus(ph, doVal);
        
    }, 3000);
}

function updateSystemStatus(ph, doVal) {
    const badge = document.getElementById('system-status-badge');
    const dot = document.getElementById('system-status-dot');
    const statusText = document.getElementById('system-status-text');

    if(!badge || !dot || !statusText) return;

    if (ph < 5 || ph > 9 || doVal < 3) {
        dot.style.color = '#f87171';
        dot.style.boxShadow = '0 0 8px #f87171';
        statusText.textContent = t('status.critical');
        statusText.style.color = "#f87171";
        badge.style.borderColor = "#f87171";
        badge.style.background = "rgba(248, 113, 113, 0.1)";
    } else if (ph < 6 || ph > 8.5 || doVal < 5) {
        dot.style.color = '#facc15';
        dot.style.boxShadow = '0 0 8px #facc15';
        statusText.textContent = t('status.warning');
        statusText.style.color = "#facc15";
        badge.style.borderColor = "#facc15";
        badge.style.background = "rgba(250, 204, 21, 0.1)";
    } else {
        dot.style.color = '#4ade80';
        dot.style.boxShadow = '0 0 8px #4ade80';
        statusText.textContent = t('status.online');
        statusText.style.color = "#4ade80";
        badge.style.borderColor = "rgba(74, 222, 128, 0.3)";
        badge.style.background = "rgba(74, 222, 128, 0.2)";
    }
}

// --- History & Chart ---
function getHistoryLocale() {
    return state.language === 'th' ? 'th-TH' : 'en-US';
}

function toHistoryNumber(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
}

function formatHistoryTimestamp(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString(getHistoryLocale(), {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

function formatHistoryDayLabel(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString(getHistoryLocale(), { day: 'numeric', month: 'short' });
}

function formatHistoryMonthLabel(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString(getHistoryLocale(), { month: 'short', year: 'numeric' });
}

function setHistoryViewMode(mode) {
    state.historyViewMode = mode === 'monthly' ? 'monthly' : 'daily';
    refreshHistoryView();
}

function getHistoryViewData() {
    const sorted = [...state.historyData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (state.historyViewMode === 'daily') {
        return sorted.map((row) => ({
            ...row,
            label: formatHistoryTimestamp(row.timestamp),
            chartLabel: formatHistoryDayLabel(row.timestamp),
            chartPh: toHistoryNumber(row.ph),
            chartDo: toHistoryNumber(row.do)
        }));
    }

    const monthBuckets = new Map();
    const numberFields = ['ph', 'do', 'ss', 'nitrite', 'nitrate', 'phosphate', 'levelIn', 'levelOut'];
    for (const row of sorted) {
        const date = new Date(row.timestamp);
        if (Number.isNaN(date.getTime())) continue;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthBuckets.has(key)) {
            monthBuckets.set(key, {
                timestamp: new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
                values: numberFields.reduce((acc, field) => ({ ...acc, [field]: [] }), {})
            });
        }
        const bucket = monthBuckets.get(key);
        for (const field of numberFields) {
            const numeric = toHistoryNumber(row[field]);
            if (numeric !== null) bucket.values[field].push(numeric);
        }
    }

    const average = (values) => values.length
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : null;
    const formatAverage = (value, digits) => (value === null ? '-' : value.toFixed(digits));

    return [...monthBuckets.values()]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map((bucket) => {
            const avgPh = average(bucket.values.ph);
            const avgDo = average(bucket.values.do);
            const avgSs = average(bucket.values.ss);
            const avgNitrite = average(bucket.values.nitrite);
            const avgNitrate = average(bucket.values.nitrate);
            const avgPhosphate = average(bucket.values.phosphate);
            const avgLevelIn = average(bucket.values.levelIn);
            const avgLevelOut = average(bucket.values.levelOut);

            return {
                label: formatHistoryMonthLabel(bucket.timestamp),
                chartLabel: formatHistoryMonthLabel(bucket.timestamp),
                chartPh: avgPh,
                chartDo: avgDo,
                ph: formatAverage(avgPh, 2),
                do: formatAverage(avgDo, 2),
                ss: formatAverage(avgSs, 0),
                nitrite: formatAverage(avgNitrite, 3),
                nitrate: formatAverage(avgNitrate, 1),
                phosphate: formatAverage(avgPhosphate, 2),
                levelIn: formatAverage(avgLevelIn, 1),
                levelOut: formatAverage(avgLevelOut, 1)
            };
        });
}

function refreshHistoryView() {
    document.querySelectorAll('[data-history-mode]').forEach((button) => {
        const isActive = button.dataset.historyMode === state.historyViewMode;
        button.classList.toggle('btn-primary', isActive);
        button.classList.toggle('btn-ghost', !isActive);
    });
    renderTable();
    refreshHistoryChart();
}

function generateHistory() {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        d.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
        data.push({
            timestamp: d.toISOString(),
            ph: (7 + Math.random() - 0.5).toFixed(2),
            do: (8 + Math.random() * 2 - 1).toFixed(2),
            ss: (20 + Math.random() * 10).toFixed(0),
            nitrite: (0.5 + Math.random() * 0.2).toFixed(3),
            nitrate: (10 + Math.random() * 5).toFixed(1),
            phosphate: (2 + Math.random()).toFixed(2),
            levelIn: 80,
            levelOut: 75
        });
    }
    state.historyData = data;
    refreshHistoryView();
}

function initHistoryChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    state.historyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'pH', data: [], borderColor: '#38bdf8', borderWidth: 2, tension: 0.4 },
                { label: 'DO (mg/L)', data: [], borderColor: '#2dd4bf', borderWidth: 2, tension: 0.4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
    refreshHistoryChart();
}

function refreshHistoryChart() {
    if (!state.historyChart) return;
    const viewData = getHistoryViewData().slice().reverse();
    state.historyChart.data.labels = viewData.map(d => d.chartLabel);
    state.historyChart.data.datasets[0].data = viewData.map(d => d.chartPh);
    state.historyChart.data.datasets[1].data = viewData.map(d => d.chartDo);
    state.historyChart.update();
}

function renderTable() {
    const data = getHistoryViewData();
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = data.slice(0, 10).map(row => `
        <tr>
            <td>${row.label}</td>
            <td><span style="color:#38bdf8">${row.ph}</span></td>
            <td><span style="color:#2dd4bf">${row.do}</span></td>
            <td>${row.ss}</td>
            <td>${row.nitrite}</td>
            <td>${row.nitrate}</td>
            <td>${row.phosphate}</td>
            <td>${row.levelIn} / ${row.levelOut}</td>
        </tr>
    `).join('');
}

function exportCSV() {
    const viewData = getHistoryViewData();
    const header = ['Timestamp,pH,DO,SS,Nitrite,Nitrate,Phosphate,Level In,Level Out'];
    const rows = viewData.map(d =>
        `"${String(d.label).replace(/"/g, '""')}",${d.ph},${d.do},${d.ss},${d.nitrite},${d.nitrate},${d.phosphate},${d.levelIn},${d.levelOut}`
    );
    const csv = header.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'water_data.csv';
    a.click();
}

// --- Device Management ---
function renderDevices() {
    const list = document.getElementById('device-list');
    list.innerHTML = state.devices.map(d => `
        <div class="glass-card device-card">
            <div class="device-status status-${d.status}">${d.status}</div>
            <h3>${d.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:16px;">${d.loc}</p>
            <div style="font-size:13px; color:#fff;">${t('devices.managedBy')}: ${d.responsible}</div>
            <div style="margin-top:20px; display:flex; gap:8px;">
                <button class="btn btn-ghost" style="flex:1" onclick="openDeviceModal(${d.id})">${t('devices.edit')}</button>
                <button class="btn btn-ghost" style="color:#f87171" onclick="deleteDevice(${d.id})">
                    <i data-lucide="trash-2" style="width:16px"></i>
                </button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function openDeviceModal(id = null) {
    const modal = document.getElementById('device-modal');
    modal.classList.remove('hidden');
    
    if (id) {
        const dev = state.devices.find(d => d.id === id);
        document.getElementById('modal-title').textContent = t('devices.modalEditTitle');
        document.getElementById('dev-id').value = dev.id;
        document.getElementById('dev-name').value = dev.name;
        document.getElementById('dev-person').value = dev.responsible;
        document.getElementById('dev-hos').value = dev.loc;
        document.getElementById('dev-status').value = dev.status;
    } else {
        document.getElementById('modal-title').textContent = t('devices.modalAddTitle');
        document.getElementById('device-form').reset();
        document.getElementById('dev-id').value = '';
    }
}

function closeDeviceModal() {
    document.getElementById('device-modal').classList.add('hidden');
}

function handleDeviceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('dev-id').value;
    const name = document.getElementById('dev-name').value;
    const person = document.getElementById('dev-person').value;
    const hos = document.getElementById('dev-hos').value;
    const status = document.getElementById('dev-status').value;
    
    if (id) {
        const idx = state.devices.findIndex(d => d.id == id);
        if (idx !== -1) {
            state.devices[idx] = { ...state.devices[idx], name, responsible: person, loc: hos, status };
        }
    } else {
        const newId = state.devices.length ? Math.max(...state.devices.map(d => d.id)) + 1 : 1;
        state.devices.push({ id: newId, name, responsible: person, loc: hos, status });
    }
    
    closeDeviceModal();
    renderDevices();
    const deviceAction = id ? t('log.adminUpdatedDevice') : t('log.adminAddedDevice');
    addLog(`${deviceAction} <strong>${name}</strong>.`, id ? 'UPDATE DEVICE' : 'CREATE DEVICE');
}

function deleteDevice(id) {
    if (confirm(t('devices.deleteConfirm'))) {
        const name = state.devices.find(d => d.id === id)?.name;
        state.devices = state.devices.filter(d => d.id !== id);
        renderDevices();
        addLog(`${t('log.adminDeletedDevice')} <strong>${name}</strong>.`, 'UPDATE DEVICE');
    }
}

// --- User Management ---
function renderUsers() {
    const list = document.getElementById('user-list');
    list.innerHTML = state.users.map(u => `
        <div class="glass-card device-card">
            <div class="user-role role-${u.role}">${u.role.toUpperCase()}</div>
            <h3>${u.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:10px; overflow-wrap:anywhere;">${u.email}</p>
            <p style="color:var(--text-muted); font-size:13px; margin-bottom:10px;">${(u.hospital || DEFAULT_HOSPITAL) === DEFAULT_HOSPITAL ? t('users.hospitalPranangklao').replace('&#10003; ', '').replace('✓ ', '') : u.hospital}</p>
            <div style="margin-top:20px; display:flex; gap:8px;">
                <button class="btn btn-ghost" style="flex:1" onclick="openUserModal(${u.id})">${t('users.editPermission')}</button>
                <button class="btn btn-ghost" style="color:#f87171" onclick="deleteUser(${u.id})">
                    <i data-lucide="trash-2" style="width:16px"></i>
                </button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function openUserModal(id = null) {
    ensureUserHospitalField();
    const modal = document.getElementById('user-modal');
    modal.classList.remove('hidden');
    
    if (id) {
        const user = state.users.find(u => u.id === id);
        document.getElementById('user-modal-title').textContent = t('users.editPermission');
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        const hospitalSelect = document.getElementById('user-hospital');
        if (hospitalSelect) hospitalSelect.value = user.hospital || DEFAULT_HOSPITAL;
    } else {
        document.getElementById('user-modal-title').textContent = t('users.modalAddTitle');
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        const hospitalSelect = document.getElementById('user-hospital');
        if (hospitalSelect) hospitalSelect.value = DEFAULT_HOSPITAL;
    }
}

function closeUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
}

function handleUserSubmit(e) {
    e.preventDefault();
    ensureUserHospitalField();
    const id = document.getElementById('user-id').value;
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    const hospital = document.getElementById('user-hospital')?.value || DEFAULT_HOSPITAL;
    
    if (id) {
        const idx = state.users.findIndex(u => u.id == id);
        if (idx !== -1) {
            state.users[idx] = { ...state.users[idx], name, email, role, hospital };
        }
    } else {
        const newId = state.users.length ? Math.max(...state.users.map(u => u.id)) + 1 : 1;
        state.users.push({ id: newId, name, email, role, hospital });
    }
    
    closeUserModal();
    renderUsers();
    const userAction = id ? t('log.adminUpdatedUser') : t('log.adminAddedUser');
    addLog(`${userAction} <strong>${name}</strong>.`, id ? 'UPDATE USER' : 'CREATE USER');
}

function deleteUser(id) {
    if (confirm(t('users.deleteConfirm'))) {
        const name = state.users.find(u => u.id === id)?.name;
        state.users = state.users.filter(u => u.id !== id);
        renderUsers();
        addLog(`${t('log.adminDeletedUser')} <strong>${name}</strong>.`, 'DELETE USER');
    }
}

function persistLogs() {
    localStorage.setItem('systemLogs', JSON.stringify(state.logs));
}

function setLogFilter(filter) {
    state.logFilter = filter || 'ALL';
    renderLogs();
}

function renderLogs() {
    const logList = document.getElementById('log-list');
    if (!logList) return;

    const filterEl = document.getElementById('log-filter');
    if (filterEl) filterEl.value = state.logFilter;

    const locale = state.language === 'th' ? 'th-TH' : 'en-US';
    const logsToRender = state.logs.filter((log) => state.logFilter === 'ALL' || log.type === state.logFilter);

    logList.innerHTML = logsToRender.map((log) => {
        const date = new Date(log.timestamp);
        const time = Number.isNaN(date.getTime())
            ? '-'
            : date.toLocaleString(locale, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        return `<li class="log-item"><span class="time">${time}</span><span><strong>[${log.type}]</strong> ${log.message}</span></li>`;
    }).join('');
}

function addLog(message, type = 'UPDATE DEVICE') {
    state.logs.unshift({
        timestamp: new Date().toISOString(),
        type,
        message
    });
    state.logs = state.logs.slice(0, 200);
    persistLogs();
    renderLogs();
}

function updateDashboardFromRecord(record) {
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText('val-ph', record.ph);
    setText('val-do', record.do);
    setText('val-ss', record.ss);
    setText('val-nitrite', record.nitrite);
    setText('val-nitrate', record.nitrate);
    setText('val-phosphate', record.phosphate);
    setText('val-level-in', record.levelIn);
    setText('val-level-out', record.levelOut);

    const phNum = Number(record.ph);
    const doNum = Number(record.do);

    if (state.gauges.ph && Number.isFinite(phNum)) {
        state.gauges.ph.data.datasets[0].data = [phNum, 14 - phNum];
        state.gauges.ph.data.datasets[0].backgroundColor[0] = phNum < 6 || phNum > 8.5 ? '#f87171' : '#38bdf8';
        state.gauges.ph.update();
    }

    if (state.gauges.do && Number.isFinite(doNum)) {
        const maxDo = 15;
        state.gauges.do.data.datasets[0].data = [doNum, maxDo - doNum];
        state.gauges.do.update();
    }

    if (Number.isFinite(phNum) && Number.isFinite(doNum)) {
        updateSystemStatus(phNum, doNum);
    }
}

function handleManualSubmit(e) {
    e.preventDefault();
    const fieldConfigs = [
        { key: 'ph', inputId: 'manual-ph', saveId: 'save-ph', label: t('field.ph'), format: (v) => Number(v).toFixed(2) },
        { key: 'do', inputId: 'manual-do', saveId: 'save-do', label: t('field.do'), format: (v) => Number(v).toFixed(2) },
        { key: 'ss', inputId: 'manual-ss', saveId: 'save-ss', label: t('field.ss'), format: (v) => Number(v).toFixed(0) },
        { key: 'nitrite', inputId: 'manual-nitrite', saveId: 'save-nitrite', label: t('field.nitrite'), format: (v) => Number(v).toFixed(3) },
        { key: 'nitrate', inputId: 'manual-nitrate', saveId: 'save-nitrate', label: t('field.nitrate'), format: (v) => Number(v).toFixed(1) },
        { key: 'phosphate', inputId: 'manual-phosphate', saveId: 'save-phosphate', label: t('field.phosphate'), format: (v) => Number(v).toFixed(2) },
        { key: 'levelIn', inputId: 'manual-level-in', saveId: 'save-level-in', label: t('field.levelIn'), format: (v) => Number(v).toFixed(1) },
        { key: 'levelOut', inputId: 'manual-level-out', saveId: 'save-level-out', label: t('field.levelOut'), format: (v) => Number(v).toFixed(1) }
    ];

    const selectedFields = fieldConfigs.filter(f => document.getElementById(f.saveId)?.checked);
    if (!selectedFields.length) {
        alert(t('alert.selectOne'));
        return;
    }

    const newRecord = {
        timestamp: new Date().toISOString(),
        ph: '-',
        do: '-',
        ss: '-',
        nitrite: '-',
        nitrate: '-',
        phosphate: '-',
        levelIn: '-',
        levelOut: '-'
    };

    for (const field of selectedFields) {
        const input = document.getElementById(field.inputId);
        const rawValue = input?.value?.trim();
        if (!rawValue) {
            alert(`${t('alert.pleaseEnter')} ${field.label}.`);
            return;
        }

        const numericValue = Number(rawValue);
        if (!Number.isFinite(numericValue)) {
            alert(`${t('alert.invalidValue')} ${field.label}.`);
            return;
        }
        newRecord[field.key] = field.format(numericValue);
    }

    state.historyData = [newRecord, ...state.historyData].slice(0, 30);
    refreshHistoryView();
    updateDashboardFromRecord(newRecord);

    alert(t('alert.savedCount').replace('{count}', selectedFields.length));
    e.target.reset();
}
// ===== LIFF LOGIN =====
async function initLiff() {
    await liff.init({ liffId: "2009293042-5xf0uyqH" });

    if (!liff.isLoggedIn()) {
        liff.login();
        return;
    }

    const profile = await liff.getProfile();
    console.log("LINE User:", profile.userId);

    localStorage.setItem("lineUserId", profile.userId);

};


