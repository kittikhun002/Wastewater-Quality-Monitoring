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
    historyChartPost: null,
    // เธเนเธญเธกเธนเธฅเธญเธธเธเธเธฃเธ“เน
    devices: [
        { id: 1, name: 'Main Pump House', responsible: 'Somchai Jaidee', status: 'active', loc: 'Bangkok Hospital' },
        { id: 2, name: 'Treatment Tank B', responsible: 'Somsri Rakdee', status: 'active', loc: 'Siriraj Hospital' },
        { id: 3, name: 'Outlet Sensor', responsible: 'John Doe', status: 'maintenance', loc: 'Chula Hospital' }
    ],
    // เธเนเธญเธกเธนเธฅเธเธนเนเนเธเนเธเธฒเธ
    users: [
        { id: 1, name: 'System Admin', email: 'admin@hydro.com', role: 'admin', hospital: 'pranangklao' },
        { id: 2, name: 'Somsri Operation', email: 'somsri@hydro.com', role: 'user', hospital: 'pranangklao' },
        { id: 3, name: 'Engineer Team', email: 'eng@hydro.com', role: 'user', hospital: 'pranangklao' }
    ],
    pendingUsers: [
        { id: 101, name: 'Narin Operator', email: 'narin.signup@hydro.com', hospital: 'pranangklao', requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 102, name: 'Lalita Lab Team', email: 'lalita.signup@hydro.com', hospital: 'pranangklao', requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }
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
        'login.welcome': 'ยินดีต้อนรับ',
        'login.subtitle': 'ระบบติดตามคุณภาพน้ำเสีย<br>ต้นแบบระบบบำบัด โรงพยาบาลพระนั่งเกล้า',
        'login.email': 'อีเมล',
        'login.password': 'รหัสผ่าน',
        'login.emailPlaceholder': 'กรอกอีเมล',
        'login.passwordPlaceholder': 'กรอกรหัสผ่าน',
        'login.button': 'เข้าสู่ระบบ',
        'login.adminHint': 'By logging in, you agree to our Terms of Service.',
        'nav.dashboard': 'แดชบอร์ด',
        'nav.history': 'ประวัติ',
        'nav.manual': 'บันทึกข้อมูล',
        'nav.adminSection': 'ผู้ดูแลระบบ',
        'nav.devices': 'จัดการอุปกรณ์',
        'nav.users': 'จัดการผู้ใช้',
        'nav.logs': 'บันทึกระบบ',
        'nav.logout': 'ออกจากระบบ',
        'dashboard.title': 'แดชบอร์ด',
        'dashboard.subtitle': 'ติดตามคุณภาพน้ำแบบเรียลไทม์',
        'section.set1': 'หลังบำบัด',
        'section.set2': 'ก่อนบำบัด',
        'history.title': 'วิเคราะห์ประวัติ',
        'history.subtitle': 'แนวโน้มย้อนหลังและบันทึกข้อมูล',
        'history.daily': 'รายวัน',
        'history.monthly': 'รายเดือน',
        'manual.title': 'บันทึกข้อมูลด้วยตนเอง',
        'manual.subtitle': 'บันทึกค่าที่ตรวจวัดจริง',
        'manual.mode': 'เลือกชุดข้อมูลที่ต้องการบันทึก',
        'manual.modeBefore': 'ก่อนบำบัด',
        'manual.modeAfter': 'หลังบำบัด',
        'manual.save': 'บันทึก',
        'manual.reset': 'รีเซ็ต',
        'manual.saveRecord': 'บันทึกข้อมูล',
        'manual.ph': 'ค่า pH (0-14)',
        'manual.do': 'ออกซิเจนละลายน้ำ (mg/L)',
        'manual.ss': 'สารแขวนลอย (mg/L)',
        'manual.nitrite': 'ไนไตรต์ (mg/L)',
        'manual.nitrate': 'ไนเตรต (mg/L)',
        'manual.phosphate': 'ฟอสเฟต (mg/L)',
        'manual.levelIn': 'ระดับน้ำเข้า (cm)',
        'manual.levelOut': 'ระดับน้ำออก (cm)',
        'devices.title': 'จัดการอุปกรณ์',
        'users.title': 'จัดการผู้ใช้',
        'logs.title': 'บันทึกระบบ',
        'status.online': 'ระบบปกติ',
        'status.warning': 'แจ้งเตือน',
        'status.critical': 'วิกฤต',
        'alert.fillAll': 'กรุณากรอกข้อมูลให้ครบ',
        'alert.selectOne': 'กรุณาเลือกอย่างน้อย 1 พารามิเตอร์ที่จะบันทึก',
        'alert.pleaseEnter': 'กรุณากรอก',
        'alert.invalidValue': 'ค่าไม่ถูกต้องสำหรับ',
        'alert.savedCount': 'บันทึกแล้ว {count} พารามิเตอร์',
        'field.ph': 'ค่า pH',
        'field.do': 'ออกซิเจนละลายน้ำ',
        'field.ss': 'สารแขวนลอย',
        'field.nitrite': 'ไนไตรต์',
        'field.nitrate': 'ไนเตรต',
        'field.phosphate': 'ฟอสเฟต',
        'field.levelIn': 'ระดับน้ำเข้า',
        'field.levelOut': 'ระดับน้ำออก'
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
        'section.set1': 'After Treatment',
        'section.set2': 'Before Treatment',
        'history.title': 'History Analysis',
        'history.subtitle': 'Historical trends and data logs',
        'history.daily': 'Daily',
        'history.monthly': 'Monthly',
        'manual.title': 'Manual Data Entry',
        'manual.subtitle': 'Record physical measurements',
        'manual.mode': 'Select data set to save',
        'manual.modeBefore': 'Before Treatment',
        'manual.modeAfter': 'After Treatment',
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
        'devices.add': 'เพิ่มอุปกรณ์',
        'devices.modalAddTitle': 'เพิ่มอุปกรณ์',
        'devices.modalEditTitle': 'แก้ไขอุปกรณ์',
        'devices.deviceName': 'ชื่ออุปกรณ์',
        'devices.location': 'สถานที่ติดตั้ง',
        'devices.responsible': 'ผู้รับผิดชอบ',
        'devices.status': 'สถานะ',
        'devices.statusActive': 'พร้อมใช้งาน',
        'devices.statusMaintenance': 'ซ่อมบำรุง',
        'devices.statusOffline': 'ออฟไลน์',
        'devices.managedBy': 'ดูแลโดย',
        'devices.edit': 'แก้ไข',
        'devices.deleteConfirm': 'ยืนยันการลบอุปกรณ์นี้?',
        'users.add': 'เพิ่มผู้ใช้',
        'users.notifications': 'รับการแจ้งเตือน',
        'users.pendingTitle': 'คำขอสมัครใช้งาน',
        'users.pendingSubtitle': 'ตรวจสอบและอนุมัติผู้ใช้ที่สมัครเข้ามา',
        'users.pendingEmpty': 'ยังไม่มีคำขอสมัครใหม่',
        'users.pendingStatus': 'รออนุมัติ',
        'users.accept': 'อนุมัติ',
        'users.reject': 'ปฏิเสธ',
        'users.requestDate': 'เวลาที่สมัคร',
        'users.modalAddTitle': 'เพิ่มผู้ใช้งาน',
        'users.modalEditTitle': 'แก้ไขผู้ใช้งาน',
        'users.name': 'ชื่อ - นามสกุล',
        'users.email': 'อีเมล (Login ID)',
        'users.role': 'สิทธิ์การใช้งาน',
        'users.roleAdmin': 'แอดมิน',
        'users.roleUser': 'ผู้ใช้',
        'users.roleViewer': 'ผู้ชม',
        'users.hospital': 'สังกัดโรงพยาบาล',
        'users.hospitalPranangklao': '🏥 โรงพยาบาลพระนั่งเกล้า',
        'users.editPermission': 'แก้ไขสิทธิ์',
        'users.deleteConfirm': 'คุณต้องการลบผู้ใช้งานนี้ออกจากระบบหรือไม่?',
        'common.cancel': 'ยกเลิก',
        'common.save': 'บันทึก',
        'log.adminUpdatedDevice': 'แอดมินอัปเดตอุปกรณ์',
        'log.adminAddedDevice': 'แอดมินเพิ่มอุปกรณ์',
        'log.adminDeletedDevice': 'แอดมินลบอุปกรณ์',
        'log.adminUpdatedUser': 'แอดมินอัปเดตผู้ใช้',
        'log.adminAddedUser': 'แอดมินเพิ่มผู้ใช้',
        'log.adminDeletedUser': 'แอดมินลบผู้ใช้',
        'log.adminAcceptedUser': 'แอดมินอนุมัติผู้สมัคร',
        'log.adminRejectedUser': 'แอดมินปฏิเสธผู้สมัคร'
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
        'users.notifications': 'Notifications',
        'users.pendingTitle': 'Pending User Requests',
        'users.pendingSubtitle': 'Review and accept new signup requests.',
        'users.pendingEmpty': 'No pending requests right now.',
        'users.pendingStatus': 'Pending',
        'users.accept': 'Accept',
        'users.reject': 'Reject',
        'users.requestDate': 'Requested at',
        'users.modalAddTitle': 'Add User',
        'users.modalEditTitle': 'Edit User',
        'users.name': 'Full Name',
        'users.email': 'Email (Login ID)',
        'users.role': 'Role',
        'users.roleAdmin': 'Admin',
        'users.roleUser': 'User',
        'users.roleViewer': 'Viewer',
        'users.hospital': 'Hospital Affiliation',
        'users.hospitalPranangklao': '🏥 Pranangklao Hospital',
        'users.editPermission': 'Edit Permission',
        'users.deleteConfirm': 'Are you sure you want to remove this user?',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'log.adminUpdatedDevice': 'Admin updated device',
        'log.adminAddedDevice': 'Admin added device',
        'log.adminDeletedDevice': 'Admin deleted device',
        'log.adminUpdatedUser': 'Admin updated user',
        'log.adminAddedUser': 'Admin added user',
        'log.adminDeletedUser': 'Admin deleted user',
        'log.adminAcceptedUser': 'Admin accepted signup request for',
        'log.adminRejectedUser': 'Admin rejected signup request for'
    }
};
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
    if (document.getElementById('user-request-list')) renderPendingUsers();
    if (document.getElementById('history-table-body')) refreshHistoryView();
    if (document.getElementById('log-list')) renderLogs();
}

function toggleLanguage() {
    state.language = state.language === 'th' ? 'en' : 'th';
    localStorage.setItem('lang', state.language);
    applyLanguage();
    handleManualModeChange();
}

function getManualTreatmentMode() {
    return document.getElementById('manual-treatment-mode')?.value === 'before' ? 'before' : 'after';
}

function handleManualModeChange() {
    const mode = getManualTreatmentMode();
    const isBeforeMode = mode === 'before';
    const doGroup = document.getElementById('manual-do-group');
    const doSave = document.getElementById('save-do');
    const doInput = document.getElementById('manual-do');

    if (doGroup) doGroup.classList.toggle('hidden', isBeforeMode);
    if (doSave) {
        doSave.disabled = isBeforeMode;
        doSave.checked = !isBeforeMode;
    }
    if (doInput) {
        doInput.disabled = isBeforeMode;
        if (isBeforeMode) doInput.value = '';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage();
    lucide.createIcons();
    generateHistory();
    initHistoryChart();
    try { initGaugeCharts(); } catch(e) { console.error("Gauge init error:", e); }
    handleManualModeChange();

    const manualForm = document.getElementById('manual-form');
    if (manualForm) {
        manualForm.addEventListener('reset', () => {
            setTimeout(() => handleManualModeChange(), 0);
        });
    }

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
    if (viewId === 'users') {
        showUsersListPanel();
        renderUsers();
        renderPendingUsers();
    }
    if (viewId === 'logs') renderLogs();
}

// --- Dashboard Logic ---
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function getHistorySortedByNewest() {
    return [...state.historyData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getHistoryRecordsByMode(mode) {
    const afterFields = ['ph', 'do', 'ss', 'nitrite', 'nitrate', 'phosphate', 'levelIn', 'levelOut'];
    const beforeFields = ['postPh', 'postSs', 'postNitrite', 'postNitrate', 'postPhosphate', 'postLevelIn', 'postLevelOut'];
    const sourceFields = mode === 'before' ? beforeFields : afterFields;

    return state.historyData.filter((record) => {
        if (record?.mode === mode) return true;
        if (record?.mode) return false;
        return sourceFields.some((field) => Number.isFinite(Number(record?.[field])));
    });
}

function getHistorySortedByNewestByMode(mode) {
    return [...getHistoryRecordsByMode(mode)].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getLatestSavedOtherParamsFromHistory() {
    const fields = ['ss', 'nitrite', 'nitrate', 'phosphate', 'levelIn', 'levelOut'];
    const latest = {};
    const latestRecord = getHistorySortedByNewestByMode('after')[0];
    if (!latestRecord) return fields.reduce((acc, field) => ({ ...acc, [field]: null }), {});

    for (const field of fields) {
        latest[field] = latestRecord[field] ?? null;
    }

    return latest;
}

function calculatePostTreatmentMetrics(source = {}, useJitter = false) {
    const jitter = (scale) => (useJitter ? (Math.random() * scale * 2 - scale) : 0);
    const toNum = (value) => {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : null;
    };

    const phIn = toNum(source.ph);
    const ssIn = toNum(source.ss);
    const nitriteIn = toNum(source.nitrite);
    const nitrateIn = toNum(source.nitrate);
    const phosphateIn = toNum(source.phosphate);
    const levelIn = toNum(source.levelIn);
    const levelOut = toNum(source.levelOut);

    const postPh = phIn === null ? 7.2 : clamp(7.2 + (phIn - 7.2) * 0.35 + jitter(0.05), 0, 14);
    const postSs = ssIn === null ? 12 : clamp(ssIn * 0.48 + jitter(0.8), 0, 999);
    const postNitrite = nitriteIn === null ? 0.2 : clamp(nitriteIn * 0.42 + jitter(0.03), 0, 999);
    const postNitrate = nitrateIn === null ? 8 : clamp(nitrateIn * 0.7 + jitter(0.2), 0, 999);
    const postPhosphate = phosphateIn === null ? 1.1 : clamp(phosphateIn * 0.55 + jitter(0.05), 0, 999);
    const postLevelIn = levelIn === null ? 78 : clamp(levelIn - 1 + jitter(0.2), 0, 999);
    const postLevelOut = levelOut === null ? 72 : clamp(levelOut - 2 + jitter(0.2), 0, 999);

    return {
        ph: postPh.toFixed(2),
        ss: postSs.toFixed(0),
        nitrite: postNitrite.toFixed(3),
        nitrate: postNitrate.toFixed(1),
        phosphate: postPhosphate.toFixed(2),
        levelIn: postLevelIn.toFixed(1),
        levelOut: postLevelOut.toFixed(1)
    };
}

function calculatePreTreatmentFromPostMetrics(postSource = {}) {
    const toNum = (value) => {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : null;
    };
    const fallbackDo = getLatestSavedPreValue('do', Number(document.getElementById('val-do')?.textContent) || 8);

    const postPh = toNum(postSource.ph);
    const postSs = toNum(postSource.ss);
    const postNitrite = toNum(postSource.nitrite);
    const postNitrate = toNum(postSource.nitrate);
    const postPhosphate = toNum(postSource.phosphate);
    const postLevelIn = toNum(postSource.levelIn);
    const postLevelOut = toNum(postSource.levelOut);

    const prePh = postPh === null ? 7.0 : clamp(7.2 + (postPh - 7.2) / 0.35, 0, 14);
    const preSs = postSs === null ? 25 : clamp(postSs / 0.48, 0, 999);
    const preNitrite = postNitrite === null ? 0.5 : clamp(postNitrite / 0.42, 0, 999);
    const preNitrate = postNitrate === null ? 12 : clamp(postNitrate / 0.7, 0, 999);
    const prePhosphate = postPhosphate === null ? 2.1 : clamp(postPhosphate / 0.55, 0, 999);
    const preLevelIn = postLevelIn === null ? 80 : clamp(postLevelIn + 1, 0, 999);
    const preLevelOut = postLevelOut === null ? 75 : clamp(postLevelOut + 2, 0, 999);

    return {
        ph: prePh.toFixed(2),
        do: Number(fallbackDo).toFixed(2),
        ss: preSs.toFixed(0),
        nitrite: preNitrite.toFixed(3),
        nitrate: preNitrate.toFixed(1),
        phosphate: prePhosphate.toFixed(2),
        levelIn: preLevelIn.toFixed(1),
        levelOut: preLevelOut.toFixed(1)
    };
}

function getPostMetricsFromRecord(record) {
    const pickExplicit = (raw, digits) => {
        const numeric = Number(raw);
        return Number.isFinite(numeric) ? numeric.toFixed(digits) : '-';
    };
    return {
        ph: pickExplicit(record?.postPh, 2),
        ss: pickExplicit(record?.postSs, 0),
        nitrite: pickExplicit(record?.postNitrite, 3),
        nitrate: pickExplicit(record?.postNitrate, 1),
        phosphate: pickExplicit(record?.postPhosphate, 2),
        levelIn: pickExplicit(record?.postLevelIn, 1),
        levelOut: pickExplicit(record?.postLevelOut, 1)
    };
}

function getLatestSavedPreValue(field, fallbackValue = null) {
    const sorted = getHistorySortedByNewestByMode('after');
    const row = sorted.find((item) => Number.isFinite(Number(item?.[field])));
    return row ? row[field] : fallbackValue;
}

function getLatestSavedPostParamsFromHistory() {
    const fields = [
        { key: 'ph', recordKey: 'postPh', digits: 2 },
        { key: 'ss', recordKey: 'postSs', digits: 0 },
        { key: 'nitrite', recordKey: 'postNitrite', digits: 3 },
        { key: 'nitrate', recordKey: 'postNitrate', digits: 1 },
        { key: 'phosphate', recordKey: 'postPhosphate', digits: 2 },
        { key: 'levelIn', recordKey: 'postLevelIn', digits: 1 },
        { key: 'levelOut', recordKey: 'postLevelOut', digits: 1 }
    ];
    const latest = {};
    const latestRecord = getHistorySortedByNewestByMode('before')[0];
    if (!latestRecord) return fields.reduce((acc, field) => ({ ...acc, [field.key]: null }), {});

    for (const field of fields) {
        const numeric = Number(latestRecord[field.recordKey]);
        latest[field.key] = Number.isFinite(numeric) ? numeric.toFixed(field.digits) : '-';
    }
    return latest;
}

function syncDashboardOtherParamsWithHistory(phForPost = null) {
    const latestPre = getLatestSavedOtherParamsFromHistory();
    const latestPost = getLatestSavedPostParamsFromHistory();
    const setText = (id, value) => {
        if (value === null || value === undefined) return;
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText('val-ss', latestPre.ss);
    setText('val-nitrite', latestPre.nitrite);
    setText('val-nitrate', latestPre.nitrate);
    setText('val-phosphate', latestPre.phosphate);
    setText('val-level-in', latestPre.levelIn);
    setText('val-level-out', latestPre.levelOut);

    setText('val-ph-post', latestPost.ph);
    setText('val-ss-post', latestPost.ss);
    setText('val-nitrite-post', latestPost.nitrite);
    setText('val-nitrate-post', latestPost.nitrate);
    setText('val-phosphate-post', latestPost.phosphate);
    setText('val-level-in-post', latestPost.levelIn);
    setText('val-level-out-post', latestPost.levelOut);

    const postPh = Number(latestPost?.ph);
    if (state.gauges.phPost && Number.isFinite(postPh)) {
        state.gauges.phPost.data.datasets[0].data = [postPh, 14 - postPh];
        state.gauges.phPost.data.datasets[0].backgroundColor[0] = postPh < 6 || postPh > 8.5 ? '#f87171' : '#38bdf8';
        state.gauges.phPost.update();
    }
}

function applyPostTreatmentToDashboard(source, useJitter = false) {
    const metrics = calculatePostTreatmentMetrics(source, useJitter);

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    setText('val-ph-post', metrics.ph);
    setText('val-ss-post', metrics.ss);
    setText('val-nitrite-post', metrics.nitrite);
    setText('val-nitrate-post', metrics.nitrate);
    setText('val-phosphate-post', metrics.phosphate);
    setText('val-level-in-post', metrics.levelIn);
    setText('val-level-out-post', metrics.levelOut);

    const phNum = Number(metrics.ph);
    if (state.gauges.phPost && Number.isFinite(phNum)) {
        state.gauges.phPost.data.datasets[0].data = [phNum, 14 - phNum];
        state.gauges.phPost.data.datasets[0].backgroundColor[0] = phNum < 6 || phNum > 8.5 ? '#f87171' : '#38bdf8';
        state.gauges.phPost.update();
    }
}

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

    const phPostEl = document.getElementById('phCanvas-post');
    if (phPostEl) {
        const ctxPhPost = phPostEl.getContext('2d');
        state.gauges.phPost = new Chart(ctxPhPost, {
            type: 'doughnut',
            data: {
                labels: ['Value', 'Remaining'],
                datasets: [{
                    data: [7.2, 6.8],
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
}

function startDashboardUpdates() {
    const syncDashboardFromLatestHistory = () => {
        const latestAfter = getHistorySortedByNewestByMode('after')[0] || null;
        const latestPhRaw = latestAfter?.ph;
        const latestDoRaw = latestAfter?.do;
        const ph = Number(latestPhRaw);
        const doVal = Number(latestDoRaw);

        const setTextRaw = (id, value) => {
            const element = document.getElementById(id);
            if (element && value !== undefined && value !== null) element.textContent = value;
        };
        setTextRaw('val-ph', Number.isFinite(ph) ? ph.toFixed(2) : '-');
        setTextRaw('val-do', Number.isFinite(doVal) ? doVal.toFixed(2) : '-');

        if (state.gauges.ph && Number.isFinite(ph)) {
            state.gauges.ph.data.datasets[0].data = [ph, 14 - ph];
            state.gauges.ph.data.datasets[0].backgroundColor[0] = ph < 6 || ph > 8.5 ? '#f87171' : '#38bdf8';
            state.gauges.ph.update();
        }
        if (state.gauges.do && Number.isFinite(doVal)) {
            const maxDo = 15;
            state.gauges.do.data.datasets[0].data = [doVal, maxDo - doVal];
            state.gauges.do.update();
        }
        if (Number.isFinite(ph) && Number.isFinite(doVal)) {
            updateSystemStatus(ph, doVal);
        }
        syncDashboardOtherParamsWithHistory(ph);
    };

    syncDashboardFromLatestHistory();
    setInterval(() => {
        syncDashboardFromLatestHistory();
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

function getHistoryViewData(datasetMode = 'after') {
    const sorted = getHistorySortedByNewestByMode(datasetMode);
    const isBefore = datasetMode === 'before';
    const mapField = (row, afterKey, beforeKey) => (isBefore ? row[beforeKey] : row[afterKey]);

    if (state.historyViewMode === 'daily') {
        return sorted.map((row) => {
            const ph = mapField(row, 'ph', 'postPh');
            const doVal = mapField(row, 'do', 'do');
            const ss = mapField(row, 'ss', 'postSs');
            return {
                label: formatHistoryTimestamp(row.timestamp),
                chartLabel: formatHistoryDayLabel(row.timestamp),
                ph: Number.isFinite(Number(ph)) ? Number(ph).toFixed(2) : '-',
                do: Number.isFinite(Number(doVal)) ? Number(doVal).toFixed(2) : '-',
                ss: Number.isFinite(Number(ss)) ? Number(ss).toFixed(0) : '-',
                nitrite: Number.isFinite(Number(mapField(row, 'nitrite', 'postNitrite'))) ? Number(mapField(row, 'nitrite', 'postNitrite')).toFixed(3) : '-',
                nitrate: Number.isFinite(Number(mapField(row, 'nitrate', 'postNitrate'))) ? Number(mapField(row, 'nitrate', 'postNitrate')).toFixed(1) : '-',
                phosphate: Number.isFinite(Number(mapField(row, 'phosphate', 'postPhosphate'))) ? Number(mapField(row, 'phosphate', 'postPhosphate')).toFixed(2) : '-',
                levelIn: Number.isFinite(Number(mapField(row, 'levelIn', 'postLevelIn'))) ? Number(mapField(row, 'levelIn', 'postLevelIn')).toFixed(1) : '-',
                levelOut: Number.isFinite(Number(mapField(row, 'levelOut', 'postLevelOut'))) ? Number(mapField(row, 'levelOut', 'postLevelOut')).toFixed(1) : '-',
                chartPh: toHistoryNumber(ph),
                chartDo: toHistoryNumber(doVal)
            };
        });
    }

    const monthBuckets = new Map();
    const fields = isBefore
        ? [
            { out: 'ph', src: 'postPh' },
            { out: 'ss', src: 'postSs' },
            { out: 'nitrite', src: 'postNitrite' },
            { out: 'nitrate', src: 'postNitrate' },
            { out: 'phosphate', src: 'postPhosphate' },
            { out: 'levelIn', src: 'postLevelIn' },
            { out: 'levelOut', src: 'postLevelOut' }
        ]
        : [
            { out: 'ph', src: 'ph' },
            { out: 'do', src: 'do' },
            { out: 'ss', src: 'ss' },
            { out: 'nitrite', src: 'nitrite' },
            { out: 'nitrate', src: 'nitrate' },
            { out: 'phosphate', src: 'phosphate' },
            { out: 'levelIn', src: 'levelIn' },
            { out: 'levelOut', src: 'levelOut' }
        ];

    for (const row of sorted) {
        const date = new Date(row.timestamp);
        if (Number.isNaN(date.getTime())) continue;
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthBuckets.has(key)) {
            const valueMap = {};
            for (const field of fields) valueMap[field.out] = [];
            monthBuckets.set(key, {
                timestamp: new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
                values: valueMap
            });
        }
        const bucket = monthBuckets.get(key);
        for (const field of fields) {
            const numeric = toHistoryNumber(row[field.src]);
            if (numeric !== null) bucket.values[field.out].push(numeric);
        }
    }

    const average = (values) => values.length
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : null;
    const formatAverage = (value, digits) => (value === null ? '-' : value.toFixed(digits));

    return [...monthBuckets.values()]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map((bucket) => {
            const avgPh = average(bucket.values.ph || []);
            const avgDo = average(bucket.values.do || []);
            const avgSs = average(bucket.values.ss || []);
            const avgNitrite = average(bucket.values.nitrite || []);
            const avgNitrate = average(bucket.values.nitrate || []);
            const avgPhosphate = average(bucket.values.phosphate || []);
            const avgLevelIn = average(bucket.values.levelIn || []);
            const avgLevelOut = average(bucket.values.levelOut || []);

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
        const afterDate = new Date(now);
        afterDate.setDate(afterDate.getDate() - i);
        afterDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
        data.push({
            mode: 'after',
            timestamp: afterDate.toISOString(),
            ph: (7 + Math.random() - 0.5).toFixed(2),
            do: (8 + Math.random() * 2 - 1).toFixed(2),
            ss: (20 + Math.random() * 10).toFixed(0),
            nitrite: (0.5 + Math.random() * 0.2).toFixed(3),
            nitrate: (10 + Math.random() * 5).toFixed(1),
            phosphate: (2 + Math.random()).toFixed(2),
            levelIn: 80,
            levelOut: 75
        });

        const beforeDate = new Date(now);
        beforeDate.setDate(beforeDate.getDate() - i);
        beforeDate.setHours(7 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
        data.push({
            mode: 'before',
            timestamp: beforeDate.toISOString(),
            ph: '-',
            do: '-',
            ss: '-',
            nitrite: '-',
            nitrate: '-',
            phosphate: '-',
            levelIn: '-',
            levelOut: '-',
            postPh: (7.2 + Math.random() * 0.4 - 0.2).toFixed(2),
            postSs: (10 + Math.random() * 6).toFixed(0),
            postNitrite: (0.15 + Math.random() * 0.12).toFixed(3),
            postNitrate: (7 + Math.random() * 3).toFixed(1),
            postPhosphate: (1 + Math.random() * 0.6).toFixed(2),
            postLevelIn: (78 + Math.random() * 2 - 1).toFixed(1),
            postLevelOut: (72 + Math.random() * 2 - 1).toFixed(1)
        });
    }
    state.historyData = data;
    refreshHistoryView();
}

function initHistoryChart() {
    const preEl = document.getElementById('historyChart');
    if (preEl) {
        const ctx = preEl.getContext('2d');
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
    }

    const postEl = document.getElementById('historyChartPost');
    if (postEl) {
        const postCtx = postEl.getContext('2d');
        state.historyChartPost = new Chart(postCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Post pH', data: [], borderColor: '#f59e0b', borderWidth: 2, tension: 0.4 }
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
    }
    refreshHistoryChart();
}

function refreshHistoryChart() {
    const afterData = getHistoryViewData('after').slice().reverse();
    const beforeData = getHistoryViewData('before').slice().reverse();
    if (state.historyChart) {
        state.historyChart.data.labels = afterData.map((d) => d.chartLabel);
        state.historyChart.data.datasets[0].data = afterData.map((d) => d.chartPh);
        state.historyChart.data.datasets[1].data = afterData.map((d) => d.chartDo);
        state.historyChart.update();
    }
    if (state.historyChartPost) {
        state.historyChartPost.data.labels = beforeData.map((d) => d.chartLabel);
        state.historyChartPost.data.datasets[0].data = beforeData.map((d) => d.chartPh);
        state.historyChartPost.update();
    }
}

function renderTable() {
    const afterData = getHistoryViewData('after');
    const tbody = document.getElementById('history-table-body');
    if (tbody) {
        tbody.innerHTML = afterData.slice(0, 10).map(row => `
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

    const beforeData = getHistoryViewData('before');
    const postTbody = document.getElementById('history-table-post-body');
    if (postTbody) {
        postTbody.innerHTML = beforeData.slice(0, 10).map(row => `
        <tr>
            <td>${row.label}</td>
            <td><span style="color:#f59e0b">${row.ph}</span></td>
            <td>${row.ss}</td>
            <td>${row.nitrite}</td>
            <td>${row.nitrate}</td>
            <td>${row.phosphate}</td>
            <td>${row.levelIn} / ${row.levelOut}</td>
        </tr>
    `).join('');
    }
}

function exportCSV() {
    const afterData = getHistoryViewData('after').map((d) => ({
        dataset: 'after',
        ...d
    }));
    const beforeData = getHistoryViewData('before').map((d) => ({
        dataset: 'before',
        ...d
    }));
    const viewData = [...afterData, ...beforeData];
    const header = ['Dataset,Timestamp,pH,DO,SS,Nitrite,Nitrate,Phosphate,Level In,Level Out'];
    const rows = viewData.map((d) =>
        `${d.dataset},"${String(d.label).replace(/"/g, '""')}",${d.ph},${d.do},${d.ss},${d.nitrite},${d.nitrate},${d.phosphate},${d.levelIn},${d.levelOut}`
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
function getHospitalLabel(hospital) {
    if (hospital === 'pranangklao') return t('users.hospitalPranangklao');
    return t('users.hospitalPranangklao');
}

function updateUserRequestBadge() {
    const countEl = document.getElementById('user-request-count');
    if (!countEl) return;

    const count = state.pendingUsers.length;
    countEl.textContent = String(count);
    countEl.classList.toggle('hidden', count === 0);
}

function formatRequestDate(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '-';
    const locale = state.language === 'th' ? 'th-TH' : 'en-US';
    return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showUsersListPanel() {
    document.getElementById('users-list-panel')?.classList.remove('hidden');
    document.getElementById('user-requests-panel')?.classList.add('hidden');
}

function showUserRequestsPanel() {
    const listPanel = document.getElementById('users-list-panel');
    const requestPanel = document.getElementById('user-requests-panel');
    if (!listPanel || !requestPanel) return;

    const requestIsHidden = requestPanel.classList.contains('hidden');
    listPanel.classList.toggle('hidden', requestIsHidden);
    requestPanel.classList.toggle('hidden', !requestIsHidden);

    if (requestIsHidden) renderPendingUsers();
}

function renderPendingUsers() {
    const list = document.getElementById('user-request-list');
    if (!list) return;

    updateUserRequestBadge();

    if (!state.pendingUsers.length) {
        list.innerHTML = `<div class="glass-card request-empty">${t('users.pendingEmpty')}</div>`;
        return;
    }

    list.innerHTML = state.pendingUsers.map((u) => `
        <div class="glass-card device-card">
            <div class="user-role role-user">${t('users.pendingStatus')}</div>
            <h3>${u.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:10px; overflow-wrap:anywhere;">${u.email}</p>
            <p style="color:var(--text-muted); font-size:13px; margin-bottom:8px;">${getHospitalLabel(u.hospital || 'pranangklao')}</p>
            <p style="color:var(--text-muted); font-size:12px;">
                ${t('users.requestDate')}: ${formatRequestDate(u.requestedAt)}
            </p>
            <div style="margin-top:20px; display:flex; gap:8px;">
                <button class="btn btn-primary" style="flex:1" onclick="acceptPendingUser(${u.id})">${t('users.accept')}</button>
                <button class="btn btn-ghost" style="flex:1; color:#f87171; border-color:rgba(248,113,113,0.4);" onclick="rejectPendingUser(${u.id})">${t('users.reject')}</button>
            </div>
        </div>
    `).join('');
}

function renderUsers() {
    const list = document.getElementById('user-list');
    list.innerHTML = state.users.map(u => `
        <div class="glass-card device-card">
            <div class="user-role role-${u.role}">${u.role.toUpperCase()}</div>
            <h3>${u.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:10px; overflow-wrap:anywhere;">${u.email}</p>
            <p style="color:var(--text-muted); font-size:13px; margin-bottom:10px;">${getHospitalLabel(u.hospital || 'pranangklao')}</p>
            <div style="margin-top:20px; display:flex; gap:8px;">
                <button class="btn btn-ghost" style="flex:1" onclick="openUserModal(${u.id})">${t('users.editPermission')}</button>
                <button class="btn btn-ghost" style="color:#f87171" onclick="deleteUser(${u.id})">
                    <i data-lucide="trash-2" style="width:16px"></i>
                </button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
    updateUserRequestBadge();
}

function acceptPendingUser(id) {
    const pendingUser = state.pendingUsers.find((u) => u.id === id);
    if (!pendingUser) return;

    const newUserId = state.users.length ? Math.max(...state.users.map((u) => u.id)) + 1 : 1;
    state.users.push({
        id: newUserId,
        name: pendingUser.name,
        email: pendingUser.email,
        role: 'user',
        hospital: pendingUser.hospital || 'pranangklao'
    });
    state.pendingUsers = state.pendingUsers.filter((u) => u.id !== id);

    renderUsers();
    renderPendingUsers();
    addLog(`${t('log.adminAcceptedUser')} <strong>${pendingUser.name}</strong>.`, 'CREATE USER');
}

function rejectPendingUser(id) {
    const pendingUser = state.pendingUsers.find((u) => u.id === id);
    if (!pendingUser) return;

    state.pendingUsers = state.pendingUsers.filter((u) => u.id !== id);
    renderPendingUsers();
    updateUserRequestBadge();
    addLog(`${t('log.adminRejectedUser')} <strong>${pendingUser.name}</strong>.`, 'DELETE USER');
}

function openUserModal(id = null) {
    const modal = document.getElementById('user-modal');
    modal.classList.remove('hidden');
    
    if (id) {
        const user = state.users.find(u => u.id === id);
        document.getElementById('user-modal-title').textContent = t('users.modalEditTitle');
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-hospital').value = user.hospital || 'pranangklao';
    } else {
        document.getElementById('user-modal-title').textContent = t('users.modalAddTitle');
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-hospital').value = 'pranangklao';
    }
}

function closeUserModal() {
    document.getElementById('user-modal').classList.add('hidden');
}

function handleUserSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('user-id').value;
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    const hospital = document.getElementById('user-hospital').value;
    
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
        if (element && value !== undefined && value !== null) element.textContent = value;
    };

    if (record.mode === 'before') {
        setText('val-ph-post', record.postPh);
        setText('val-ss-post', record.postSs);
        setText('val-nitrite-post', record.postNitrite);
        setText('val-nitrate-post', record.postNitrate);
        setText('val-phosphate-post', record.postPhosphate);
        setText('val-level-in-post', record.postLevelIn);
        setText('val-level-out-post', record.postLevelOut);

        const postPhNum = Number(record.postPh);
        if (state.gauges.phPost && Number.isFinite(postPhNum)) {
            state.gauges.phPost.data.datasets[0].data = [postPhNum, 14 - postPhNum];
            state.gauges.phPost.data.datasets[0].backgroundColor[0] = postPhNum < 6 || postPhNum > 8.5 ? '#f87171' : '#38bdf8';
            state.gauges.phPost.update();
        }
    } else {
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

    syncDashboardOtherParamsWithHistory();
}

function handleManualSubmit(e) {
    e.preventDefault();
    const mode = getManualTreatmentMode();
    const fieldConfigsAll = [
        { key: 'ph', inputId: 'manual-ph', saveId: 'save-ph', label: t('field.ph'), format: (v) => Number(v).toFixed(2) },
        { key: 'do', inputId: 'manual-do', saveId: 'save-do', label: t('field.do'), format: (v) => Number(v).toFixed(2) },
        { key: 'ss', inputId: 'manual-ss', saveId: 'save-ss', label: t('field.ss'), format: (v) => Number(v).toFixed(0) },
        { key: 'nitrite', inputId: 'manual-nitrite', saveId: 'save-nitrite', label: t('field.nitrite'), format: (v) => Number(v).toFixed(3) },
        { key: 'nitrate', inputId: 'manual-nitrate', saveId: 'save-nitrate', label: t('field.nitrate'), format: (v) => Number(v).toFixed(1) },
        { key: 'phosphate', inputId: 'manual-phosphate', saveId: 'save-phosphate', label: t('field.phosphate'), format: (v) => Number(v).toFixed(2) },
        { key: 'levelIn', inputId: 'manual-level-in', saveId: 'save-level-in', label: t('field.levelIn'), format: (v) => Number(v).toFixed(1) },
        { key: 'levelOut', inputId: 'manual-level-out', saveId: 'save-level-out', label: t('field.levelOut'), format: (v) => Number(v).toFixed(1) }
    ];
    const fieldConfigs = mode === 'before' ? fieldConfigsAll.filter((f) => f.key !== 'do') : fieldConfigsAll;

    const selectedFields = fieldConfigs.filter((f) => document.getElementById(f.saveId)?.checked);
    if (!selectedFields.length) {
        alert(t('alert.selectOne'));
        return;
    }

    const newRecord = {
        mode,
        timestamp: new Date().toISOString(),
        ph: '-',
        do: '-',
        ss: '-',
        nitrite: '-',
        nitrate: '-',
        phosphate: '-',
        levelIn: '-',
        levelOut: '-',
        postPh: '-',
        postSs: '-',
        postNitrite: '-',
        postNitrate: '-',
        postPhosphate: '-',
        postLevelIn: '-',
        postLevelOut: '-'
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
        if (mode === 'before') {
            const postMap = {
                ph: 'postPh',
                ss: 'postSs',
                nitrite: 'postNitrite',
                nitrate: 'postNitrate',
                phosphate: 'postPhosphate',
                levelIn: 'postLevelIn',
                levelOut: 'postLevelOut'
            };
            newRecord[postMap[field.key]] = field.format(numericValue);
        } else {
            newRecord[field.key] = field.format(numericValue);
        }
    }

    // Keep unsaved fields as "-" and do not auto-infer values across
    // before/after treatment datasets to prevent cross-station carryover.

    state.historyData = [newRecord, ...state.historyData].slice(0, 30);
    refreshHistoryView();
    updateDashboardFromRecord(newRecord);

    alert(t('alert.savedCount').replace('{count}', selectedFields.length));
    e.target.reset();
}
