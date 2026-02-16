// State
const state = {
    user: null, // 'user' or 'admin'
    isAdmin: false,
    historyData: [],
    // ข้อมูลอุปกรณ์
    devices: [
        { id: 1, name: 'Main Pump House', responsible: 'Somchai Jaidee', status: 'active', loc: 'Bangkok Hospital' },
        { id: 2, name: 'Treatment Tank B', responsible: 'Somsri Rakdee', status: 'active', loc: 'Siriraj Hospital' },
        { id: 3, name: 'Outlet Sensor', responsible: 'John Doe', status: 'maintenance', loc: 'Chula Hospital' }
    ],
    // ข้อมูลผู้ใช้งาน
    users: [
        { id: 1, name: 'System Admin', email: 'admin@hydro.com', role: 'admin', dept: 'IT Dept' },
        { id: 2, name: 'Somsri Operation', email: 'somsri@hydro.com', role: 'user', dept: 'Operation' },
        { id: 3, name: 'Engineer Team', email: 'eng@hydro.com', role: 'user', dept: 'Engineering' }
    ],
    gauges: {}
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    generateHistory();
    initHistoryChart();
    // Wrap in try-catch to prevent crash if elements missing
    try { initGaugeCharts(); } catch(e) { console.error("Gauge init error:", e); }
});

// --- Navigation & Mobile Toggle ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// --- Authentication ---
function setRole(role) {
    state.isAdmin = (role === 'admin');
    // Toggle active class visually
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    const btnText = document.getElementById('login-btn-text');
    btnText.textContent = state.isAdmin ? "Login as Admin" : "Login as User";
}

function handleLogin() {
    // Default to User if not set
    if (!state.user) state.user = state.isAdmin ? 'admin' : 'user';
    
    document.getElementById('login-view').classList.remove('active');
    document.getElementById('main-layout').classList.add('active');
    
    // Setup UI based on role
    if (state.isAdmin) {
        document.getElementById('admin-menu').classList.remove('hidden');
    } else {
        document.getElementById('admin-menu').classList.add('hidden');
    }
    
    navigate('dashboard');
    startDashboardUpdates();
}

function handleLogout() {
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
    
    // Load data specifically for views
    if (viewId === 'devices') renderDevices();
    if (viewId === 'users') renderUsers();

    // Auto-close sidebar on mobile after clicking a link
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    }
}

// --- Dashboard Logic ---
function initGaugeCharts() {
    // pH Gauge
    const phEl = document.getElementById('phCanvas');
    if(phEl) {
        const ctxPh = phEl.getContext('2d');
        state.gauges.ph = new Chart(ctxPh, {
            type: 'doughnut',
            data: {
                labels: ['Value', 'Remaining'],
                datasets: [{
                    data: [7, 7], // 0-14 scale
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

    // DO Gauge
    const doEl = document.getElementById('doCanvas');
    if(doEl) {
        const ctxDo = doEl.getContext('2d');
        state.gauges.do = new Chart(ctxDo, {
            type: 'doughnut',
            data: {
                labels: ['Value', 'Remaining'],
                datasets: [{
                    data: [8.5, 6.5], // 0-15 scale
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
        // Sim Data
        const ph = (7.0 + (Math.random() * 1.0 - 0.5)).toFixed(2);
        const doVal = (8.0 + (Math.random() * 2.0 - 1.0)).toFixed(2);
        
        // Update Text
        const phTxt = document.getElementById('val-ph');
        if(phTxt) phTxt.textContent = ph;
        
        const doTxt = document.getElementById('val-do');
        if(doTxt) doTxt.textContent = doVal;
        
        // Update Charts
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

        // Status Logic
        const badge = document.getElementById('system-status-badge');
        const dot = document.getElementById('system-status-dot');
        const statusText = document.getElementById('system-status-text');

        if(badge && dot && statusText) {
            if (ph < 5 || ph > 9 || doVal < 3) {
                // Critical
                dot.style.color = '#f87171';
                dot.style.boxShadow = '0 0 8px #f87171';
                statusText.textContent = "CRITICAL ALERT";
                statusText.style.color = "#f87171";
                badge.style.borderColor = "#f87171";
                badge.style.background = "rgba(248, 113, 113, 0.1)";
            } else if (ph < 6 || ph > 8.5 || doVal < 5) {
                // Warning
                dot.style.color = '#facc15';
                dot.style.boxShadow = '0 0 8px #facc15';
                statusText.textContent = "WARNING";
                statusText.style.color = "#facc15";
                badge.style.borderColor = "#facc15";
                badge.style.background = "rgba(250, 204, 21, 0.1)";
            } else {
                // Normal
                dot.style.color = '#4ade80';
                dot.style.boxShadow = '0 0 8px #4ade80';
                statusText.textContent = "System Online";
                statusText.style.color = "#4ade80";
                badge.style.borderColor = "rgba(74, 222, 128, 0.3)";
                badge.style.background = "rgba(74, 222, 128, 0.2)";
            }
        }
        
    }, 3000);
}

// --- History & Chart ---
let chartInstance;
function generateHistory() {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        data.push({
            date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
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
    renderTable(data);
}

function initHistoryChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: state.historyData.map(d => d.date),
            datasets: [
                { label: 'pH', data: state.historyData.map(d => d.ph), borderColor: '#38bdf8', borderWidth: 2, tension: 0.4 },
                { label: 'DO (mg/L)', data: state.historyData.map(d => d.do), borderColor: '#2dd4bf', borderWidth: 2, tension: 0.4 }
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

function renderTable(data) {
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = data.slice(0, 10).map(row => `
        <tr>
            <td>${row.date}</td>
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
    const header = ['Date,pH,DO,SS,Nitrite,Nitrate,Phosphate,Level In,Level Out'];
    const rows = state.historyData.map(d =>
        `${d.date},${d.ph},${d.do},${d.ss},${d.nitrite},${d.nitrate},${d.phosphate},${d.levelIn},${d.levelOut}`
    );
    const csv = header.concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'water_data.csv';
    a.click();
}

// --- Device Management (Admin) ---
function renderDevices() {
    const list = document.getElementById('device-list');
    list.innerHTML = state.devices.map(d => `
        <div class="glass-card device-card">
            <div class="device-status status-${d.status}">${d.status}</div>
            <h3>${d.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:16px;">${d.loc}</p>
            <div style="font-size:13px; color:#fff;">ดูแลโดย: ${d.responsible}</div>
            <div style="margin-top:20px; display:flex; gap:8px;">
                <button class="btn btn-ghost" style="flex:1" onclick="openDeviceModal(${d.id})">แก้ไข</button>
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
        // Edit Mode
        const dev = state.devices.find(d => d.id === id);
        document.getElementById('modal-title').textContent = 'แก้ไขอุปกรณ์';
        document.getElementById('dev-id').value = dev.id;
        document.getElementById('dev-name').value = dev.name;
        document.getElementById('dev-person').value = dev.responsible;
        document.getElementById('dev-hos').value = dev.loc;
        document.getElementById('dev-status').value = dev.status;
    } else {
        // Add Mode
        document.getElementById('modal-title').textContent = 'เพิ่มอุปกรณ์ใหม่';
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
        // Update
        const idx = state.devices.findIndex(d => d.id == id);
        if (idx !== -1) {
            state.devices[idx] = { ...state.devices[idx], name, responsible: person, loc: hos, status };
        }
    } else {
        // Create
        const newId = state.devices.length ? Math.max(...state.devices.map(d => d.id)) + 1 : 1;
        state.devices.push({ id: newId, name, responsible: person, loc: hos, status });
    }
    
    closeDeviceModal();
    renderDevices();
    addLog(`Admin ${id ? 'updated' : 'added'} device <strong>${name}</strong>.`);
}

function deleteDevice(id) {
    if (confirm('ยืนยันการลบอุปกรณ์นี้?')) {
        const name = state.devices.find(d => d.id === id)?.name;
        state.devices = state.devices.filter(d => d.id !== id);
        renderDevices();
        addLog(`Admin deleted device <strong>${name}</strong>.`);
    }
}

// --- User Management (Admin) ---
function renderUsers() {
    const list = document.getElementById('user-list');
    list.innerHTML = state.users.map(u => `
        <div class="glass-card device-card">
            <div class="user-role role-${u.role}">${u.role.toUpperCase()}</div>
            <h3>${u.name}</h3>
            <p style="color:var(--text-muted); font-size:14px; margin-bottom:10px;">${u.email}</p>
            <div style="font-size:13px; color:#fff; background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px; display:inline-block;">
                ${u.dept}
            </div>
            <div style="margin-top:20px; display:flex; gap:8px;">
                <button class="btn btn-ghost" style="flex:1" onclick="openUserModal(${u.id})">แก้ไขสิทธิ์</button>
                <button class="btn btn-ghost" style="color:#f87171" onclick="deleteUser(${u.id})">
                    <i data-lucide="trash-2" style="width:16px"></i>
                </button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function openUserModal(id = null) {
    const modal = document.getElementById('user-modal');
    modal.classList.remove('hidden');
    
    if (id) {
        // Edit Mode
        const user = state.users.find(u => u.id === id);
        document.getElementById('user-modal-title').textContent = 'แก้ไขผู้ใช้งาน';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-dept').value = user.dept;
        document.getElementById('user-role').value = user.role;
    } else {
        // Add Mode
        document.getElementById('user-modal-title').textContent = 'เพิ่มผู้ใช้งานใหม่';
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
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
    const dept = document.getElementById('user-dept').value;
    const role = document.getElementById('user-role').value;
    
    if (id) {
        // Update
        const idx = state.users.findIndex(u => u.id == id);
        if (idx !== -1) {
            state.users[idx] = { ...state.users[idx], name, email, dept, role };
        }
    } else {
        // Create
        const newId = state.users.length ? Math.max(...state.users.map(u => u.id)) + 1 : 1;
        state.users.push({ id: newId, name, email, dept, role });
    }
    
    closeUserModal();
    renderUsers();
    addLog(`Admin ${id ? 'updated' : 'added'} user <strong>${name}</strong>.`);
}

function deleteUser(id) {
    if (confirm('คุณต้องการลบผู้ใช้งานนี้ออกจากระบบหรือไม่?')) {
        const name = state.users.find(u => u.id === id)?.name;
        state.users = state.users.filter(u => u.id !== id);
        renderUsers();
        addLog(`Admin deleted user <strong>${name}</strong>.`);
    }
}

// Helper: Logging
function addLog(message) {
    const logList = document.querySelector('.log-list');
    if(logList) {
        const li = document.createElement('li');
        li.className = 'log-item';
        const time = new Date().toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'});
        li.innerHTML = `<span class="time">${time}</span><span>${message}</span>`;
        logList.prepend(li);
    }
}

// --- Manual Entry ---
function handleManualSubmit(e) {
    e.preventDefault();
    alert('Data saved successfully!');
    e.target.reset();
}
