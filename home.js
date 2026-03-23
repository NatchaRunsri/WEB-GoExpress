// ─── NAVIGATION ───────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav ul a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const el = document.getElementById('nav-' + name);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// AUTH
function openAuth(tab) {
  document.getElementById('auth-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  switchTab(tab || 'login');
  document.getElementById('auth-success').classList.remove('show');
}
function closeAuth() {
  document.getElementById('auth-modal').classList.remove('open');
  document.body.style.overflow = '';
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById('auth-modal')) closeAuth();
}
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('form-' + tab).classList.add('active');
  document.getElementById('auth-success').classList.remove('show');
}
function togglePwd(id, btn) {
  const input = document.getElementById(id);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.innerHTML = isHidden
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}
function showLoginSuccess(name) {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  const suc = document.getElementById('auth-success');
  document.getElementById('suc-title').textContent = 'เข้าสู่ระบบสำเร็จ!';
  document.getElementById('suc-msg').textContent = 'ยินดีต้อนรับ คุณ' + name + ' 👋';
  suc.classList.add('show');

  // กำหนดหน้าปลายทางตาม name
  const redirectMap = {
    'admin':   'crm/crm.html',
    'account': 'payroll/payroll.html',
    'driver':  'pms/pms.html'
  };

  const destination = redirectMap[name];

  setTimeout(() => {
    if (destination) {
      window.location.href = destination; // redirect ไปหน้าที่กำหนด
    } else {
      closeAuth();
      updateNavLoggedIn(name);
    }
  }, 1800);
}
function showRegisterSuccess(name) {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  const suc = document.getElementById('auth-success');
  document.getElementById('suc-title').textContent = 'สมัครสมาชิกสำเร็จ!';
  document.getElementById('suc-msg').textContent = 'ยินดีต้อนรับสู่ SpeedWay Express คุณ' + name + ' 🎉';
  suc.classList.add('show');
  setTimeout(() => {
    closeAuth();
    updateNavLoggedIn(name);
  }, 1800);
}
// MOCK USERS
const USERS = [
  { name: 'admin',   password: '1234' },
  { name: 'account', password: 'abcd' },
  { name: 'driver',  password: '5678' }
];

function doLogin() {
  const name = document.getElementById('login-name').value.trim();
  const pass = document.getElementById('login-pass').value;
  if (!name || !pass) { alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'); return; }

  const user = USERS.find(u => u.name === name && u.password === pass);
  if (!user) { alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'); return; }

  showLoginSuccess(user.name);
}
function doRegister() {
  const fname = document.getElementById('reg-fname').value.trim();
  if (!fname) { alert('กรุณากรอกชื่อ'); return; }
  showRegisterSuccess(fname);
}
function updateNavLoggedIn(name) {
  document.getElementById('nav-login-btn').style.display = 'none';
  const avatar = document.getElementById('nav-avatar');
  const uname = document.getElementById('nav-uname');
  const logout = document.getElementById('nav-logout');
  avatar.textContent = name[0].toUpperCase();
  avatar.classList.add('show');
  uname.textContent = name;
  uname.classList.add('show');
  logout.classList.add('show');
}
function doLogout() {
  document.getElementById('nav-login-btn').style.display = '';
  document.getElementById('nav-avatar').classList.remove('show');
  document.getElementById('nav-uname').classList.remove('show');
  document.getElementById('nav-logout').classList.remove('show');
}

// ─── HOME QUICK TRACK ─────────────────────
function homeTrack() {
  const val = document.getElementById('home-track-input').value.trim();
  showPage('tracking');
  setTimeout(() => {
    document.getElementById('tracking-input').value = val;
    if (val) searchTracking();
  }, 80);
}
document.getElementById('home-track-input').addEventListener('keydown', e => { if (e.key === 'Enter') homeTrack(); });

// ─── SAMPLE CHIPS ─────────────────────────
function fillSample(num) {
  document.getElementById('tracking-input').value = num;
  searchTracking();
}

// ─── PARCEL DATABASE ──────────────────────
const parcelDB = {
  'SW2024001234': {
    status:'in-transit', statusText:'กำลังจัดส่ง',
    sender:'ร้าน TechShop Online', receiver:'คุณสมใจ รักดี',
    from:'กรุงเทพฯ (ลาดกระบัง)', to:'เชียงใหม่ (อ.เมือง)',
    service:'ส่งทั่วประเทศ', weight:'1.5 กก.', eta:'พรุ่งนี้ 10 มี.ค. 2567',
    step:2,
    tl:[
      {t:'08 มี.ค. 2567, 09:15', h:'รับพัสดุแล้ว', d:'รับพัสดุจากผู้ส่งที่สาขาลาดกระบัง กรุงเทพฯ', s:'done', i:'📦'},
      {t:'08 มี.ค. 2567, 14:30', h:'เข้าคัดแยกสินค้า', d:'พัสดุเข้าสู่ศูนย์คัดแยกสินค้า กรุงเทพฯ', s:'done', i:'🔄'},
      {t:'09 มี.ค. 2567, 02:00', h:'กำลังเดินทาง', d:'พัสดุออกเดินทางจากกรุงเทพฯ มุ่งหน้าสู่เชียงใหม่ 🚛', s:'active', i:'🚛'},
      {t:'คาดการณ์ 10 มี.ค. 2567, 06:00', h:'ถึงสาขาปลายทาง', d:'พัสดุจะถึงศูนย์กระจายสินค้า เชียงใหม่', s:'pending', i:'🏭'},
      {t:'คาดการณ์ 10 มี.ค. 2567, 09:00', h:'กำลังนำส่ง', d:'พนักงานออกนำส่งพัสดุถึงบ้านผู้รับ', s:'pending', i:'🚴'},
      {t:'คาดการณ์ 10 มี.ค. 2567', h:'ส่งสำเร็จ', d:'พัสดุส่งถึงมือผู้รับเรียบร้อยแล้ว', s:'pending', i:'✅'},
    ]
  },
  'SW2024005678': {
    status:'delivered', statusText:'ส่งสำเร็จแล้ว',
    sender:'ห้าง Central Online', receiver:'คุณวิภาวดี ศรีสุข',
    from:'กรุงเทพฯ (ลาดพร้าว)', to:'ขอนแก่น (อ.เมือง)',
    service:'ส่งด่วน Express', weight:'3.2 กก.', eta:'ส่งแล้ว 07 มี.ค. 2567',
    step:5,
    tl:[
      {t:'05 มี.ค. 2567, 10:00', h:'รับพัสดุแล้ว', d:'รับพัสดุจากผู้ส่งที่สาขาลาดพร้าว', s:'done', i:'📦'},
      {t:'05 มี.ค. 2567, 15:45', h:'เข้าคัดแยกสินค้า', d:'พัสดุผ่านศูนย์คัดแยก กรุงเทพฯ', s:'done', i:'🔄'},
      {t:'06 มี.ค. 2567, 00:30', h:'ออกเดินทาง', d:'ออกเดินทางจากกรุงเทพฯ ไปขอนแก่น', s:'done', i:'🚛'},
      {t:'07 มี.ค. 2567, 06:20', h:'ถึงสาขาปลายทาง', d:'ถึงศูนย์กระจายสินค้า ขอนแก่น', s:'done', i:'🏭'},
      {t:'07 มี.ค. 2567, 09:00', h:'กำลังนำส่ง', d:'พนักงานออกนำส่งพัสดุแล้ว', s:'done', i:'🚴'},
      {t:'07 มี.ค. 2567, 13:22', h:'✅ ส่งสำเร็จแล้ว', d:'ส่งถึงมือผู้รับเรียบร้อย — ลงชื่อรับโดย: คุณวิภาวดี', s:'done', i:'✅'},
    ]
  },
  'SW2024009999': {
    status:'processing', statusText:'กำลังดำเนินการ',
    sender:'คุณอรุณ ดีใจ', receiver:'คุณสุดา มีสุข',
    from:'เชียงราย (อ.เมือง)', to:'ภูเก็ต (อ.เมือง)',
    service:'ส่งทั่วประเทศ', weight:'0.8 กก.', eta:'12-13 มี.ค. 2567',
    step:1,
    tl:[
      {t:'10 มี.ค. 2567, 08:00', h:'รับพัสดุแล้ว', d:'รับพัสดุจากผู้ส่งที่สาขาเชียงราย', s:'done', i:'📦'},
      {t:'10 มี.ค. 2567, 11:30', h:'กำลังคัดแยกสินค้า', d:'พัสดุอยู่ระหว่างการคัดแยกที่ศูนย์กลาง เชียงราย', s:'active', i:'🔄'},
      {t:'คาดการณ์ 10 มี.ค. 2567, 23:00', h:'ออกเดินทาง', d:'พัสดุจะออกเดินทางในคืนนี้', s:'pending', i:'🚛'},
      {t:'คาดการณ์ 12 มี.ค. 2567, 08:00', h:'ถึงสาขาปลายทาง', d:'ถึงศูนย์กระจายสินค้า ภูเก็ต', s:'pending', i:'🏭'},
      {t:'คาดการณ์ 12 มี.ค. 2567', h:'กำลังนำส่ง', d:'พนักงานออกนำส่ง', s:'pending', i:'🚴'},
      {t:'คาดการณ์ 12-13 มี.ค. 2567', h:'ส่งสำเร็จ', d:'ส่งถึงมือผู้รับ', s:'pending', i:'✅'},
    ]
  },
  'SW2024002024': {
    status:'in-transit', statusText:'กำลังจัดส่ง',
    sender:'JD Central Warehouse', receiver:'คุณธนาวุฒิ ใจดี',
    from:'กรุงเทพฯ (บางนา)', to:'หาดใหญ่, สงขลา',
    service:'ส่งด่วน Express', weight:'5.0 กก.', eta:'วันนี้ 10 มี.ค. 2567',
    step:3,
    tl:[
      {t:'08 มี.ค. 2567, 16:00', h:'รับพัสดุแล้ว', d:'รับพัสดุจากคลังสินค้าบางนา', s:'done', i:'📦'},
      {t:'08 มี.ค. 2567, 20:00', h:'เข้าคัดแยกสินค้า', d:'ผ่านศูนย์คัดแยก กรุงเทพฯ เรียบร้อย', s:'done', i:'🔄'},
      {t:'09 มี.ค. 2567, 01:00', h:'ออกเดินทาง', d:'ออกเดินทางจากกรุงเทพฯ มุ่งหน้าใต้', s:'done', i:'🚛'},
      {t:'10 มี.ค. 2567, 07:45', h:'ถึงสาขาปลายทาง', d:'พัสดุถึงศูนย์กระจายสินค้า หาดใหญ่ กำลังเตรียมนำส่ง', s:'active', i:'🏭'},
      {t:'คาดการณ์ 10 มี.ค. 2567, 14:00', h:'กำลังนำส่ง', d:'พนักงานกำลังออกนำส่ง', s:'pending', i:'🚴'},
      {t:'คาดการณ์ 10 มี.ค. 2567', h:'ส่งสำเร็จ', d:'ส่งถึงมือผู้รับ', s:'pending', i:'✅'},
    ]
  }
};

function searchTracking() {
  const raw = document.getElementById('tracking-input').value.trim();
  const input = raw.toUpperCase();
  const el = document.getElementById('tracking-result');
  if (!input) { el.innerHTML=''; el.classList.remove('show'); return; }

  const d = parcelDB[input];
  if (!d) {
    el.innerHTML = `<div class="not-found"><div class="nf-icon">🔍</div><h3>ไม่พบหมายเลขพัสดุ "${raw}"</h3><p style="margin-top:0.5rem;">กรุณาตรวจสอบหมายเลขพัสดุอีกครั้ง หรือลองตัวอย่างด้านบน</p></div>`;
    el.classList.add('show'); return;
  }

  const pct = (d.step / 5) * 100;
  const stepLabels = ['รับพัสดุ','คัดแยก','เดินทาง','ถึงปลายทาง','กำลังส่ง','ส่งสำเร็จ'];
  const stepIcons = ['📦','🔄','🚛','🏭','🚴','✅'];

  const stepsHTML = stepLabels.map((lbl, i) => {
    const cls = i < d.step ? 'done' : i === d.step ? 'current' : '';
    const ico = i < d.step ? '✓' : stepIcons[i];
    return `<div class="p-step ${cls}"><div class="p-step-circle">${ico}</div><div class="p-step-label">${lbl}</div></div>`;
  }).join('');

  const tlHTML = d.tl.map(t => `
    <div class="tl-item">
      <div class="tl-left"><div class="tl-dot ${t.s}">${t.i}</div><div class="tl-line"></div></div>
      <div class="tl-content">
        <div class="tl-time">${t.t}</div>
        <div class="tl-title ${t.s==='active'?'active-text':''}">${t.h}</div>
        <div class="tl-desc">${t.d}</div>
      </div>
    </div>`).join('');

  el.innerHTML = `
    <div class="result-header">
      <div class="result-header-left">
        <h2>📦 พัสดุ #${input}</h2>
        <span>${d.service} &nbsp;•&nbsp; น้ำหนัก ${d.weight}</span>
      </div>
      <div class="status-badge ${d.status}"><div class="status-dot"></div>${d.statusText}</div>
    </div>
    <div class="result-info-grid">
      <div class="info-cell"><div class="info-cell-label">ผู้ส่ง</div><div class="info-cell-value">${d.sender}</div></div>
      <div class="info-cell"><div class="info-cell-label">ผู้รับ</div><div class="info-cell-value">${d.receiver}</div></div>
      <div class="info-cell"><div class="info-cell-label">ต้นทาง</div><div class="info-cell-value">${d.from}</div></div>
      <div class="info-cell"><div class="info-cell-label">ปลายทาง</div><div class="info-cell-value">${d.to}</div></div>
      <div class="info-cell"><div class="info-cell-label">บริการ</div><div class="info-cell-value">${d.service}</div></div>
      <div class="info-cell"><div class="info-cell-label">กำหนดส่ง</div><div class="info-cell-value" style="color:var(--accent)">${d.eta}</div></div>
    </div>
    <div class="progress-section">
      <h3>สถานะการจัดส่ง</h3>
      <div class="progress-steps">
        <div class="progress-line-fill" style="width:0%" id="pline"></div>
        ${stepsHTML}
      </div>
    </div>
    <div class="timeline-section">
      <h3>ประวัติการเคลื่อนไหว</h3>
      <div class="timeline">${tlHTML}</div>
    </div>`;

  el.classList.add('show');
  setTimeout(() => { document.getElementById('pline').style.width = pct + '%'; }, 50);
  setTimeout(() => el.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
}

document.getElementById('tracking-input').addEventListener('keydown', e => { if (e.key==='Enter') searchTracking(); });

function submitContactForm() {
  const t = document.getElementById('contact-success');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 5000);
}

function toggleDropdown() {
  document.getElementById('loginDropdown').classList.toggle('show');
}

// ปิด dropdown เมื่อคลิกที่อื่น
window.addEventListener('click', function(e) {
  const dropdown = document.getElementById('loginDropdown');
  if (!e.target.closest('.nav-dropdown')) {
    dropdown.classList.remove('show');
  }
});