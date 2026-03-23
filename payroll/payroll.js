// ══════════════════════ DATA ══════════════════════
const DAILY_RATE = 500; // ฿ per late day deduction
let employees = [
  {id:'E001',name:'นางสาวณัชชา รุนศรี',dept:'เจ้าของ',pos:'CEO',base:30000,otHrs:16,otRate:0,lateDays:0,approved:false},
  {id:'E002',name:'นางสาวมาลี จัดการดี',dept:'คลังสินค้า',pos:'หัวหน้าคลัง',base:18000,otHrs:0,otRate:175,lateDays:0,approved:false},
  {id:'E003',name:'นายประเสริฐ ส่งไว',dept:'คนขับรถ',pos:'พนักงานขับรถ 6 วีล',base:20000,otHrs:32,otRate:100,lateDays:1,approved:false},
  {id:'E004',name:'นางวิโล แพ็กดี',dept:'คลังสินค้า',pos:'พนักงานคลัง',base:18000,otHrs:14,otRate:100,lateDays:0,approved:false},
  {id:'E005',name:'นายชัยวัฒน์ แล่นเร็ว',dept:'คนขับรถ',pos:'พนักงานขับรถพิเศษ',base:20000,otHrs:44,otRate:100,lateDays:0,approved:false},
  {id:'E006',name:'นายอนุชา ติดตาม',dept:'ปฏิบัติการ',pos:'เจ้าหน้าที่ติดตามงาน',base:18000,otHrs:0,otRate:125,lateDays:2,approved:false},
  {id:'E007',name:'นางสาวพรทิพย์ บัญชี',dept:'การเงิน',pos:'นักบัญชี',base:21000,otHrs:0,otRate:156,lateDays:0,approved:false},
  {id:'E008',name:'นายธนกร กระจาย',dept:'คนขับรถ',pos:'พนักงานขับรถ 10 วีล',base:20000,otHrs:18,otRate:100,lateDays:0,approved:false},
  {id:'E009',name:'นางสาวสุภาพร เรียบร้อย',dept:'ปฏิบัติการ',pos:'เจ้าหน้าที่ปฏิบัติการ',base:18000,otHrs:0,otRate:119,lateDays:0,approved:false},
  {id:'E010',name:'นายมนตรี ดูแลดี',dept:'คลังสินค้า',pos:'พนักงานคลังอาวุโส',base:18000,otHrs:8,otRate:131,lateDays:0,approved:false},
  {id:'E011',name:'นายวิชัย ส่งตรง',dept:'คนขับรถ',pos:'พนักงานขับรถ 6 วีล',base:20000,otHrs:10,otRate:94,lateDays:1,approved:false},
  {id:'E012',name:'นางสาวจิราพร คำนวณ',dept:'ปฏิบัติการ',pos:'เจ้าหน้าที่วางแผน',base:18000,otHrs:0,otRate:150,lateDays:0,approved:false},
  {id:'E013',name:'นายสุรศักดิ์ ขยันทำ',dept:'คนขับรถ',pos:'พนักงานขับรถ',base:20000,otHrs:0,otRate:143,lateDays:0,approved:false},
{id:'E014',name:'นายทำดี มากมาก',dept:'คนขับรถ',pos:'พนักงานขับรถ',base:20000,otHrs:0,otRate:143,lateDays:0,approved:false}, 
{id:'E015',name:'นายขับ รถ',dept:'คนขับรถ',pos:'พนักงานขับรถ',base:20000,otHrs:0,otRate:143,lateDays:0,approved:false},
{id:'E016',name:'นายอดทน',dept:'คนขับรถ',pos:'เจ้าหน้าที่เทคนิค',base:20000,otHrs:0,otRate:143,lateDays:0,approved:false},
{id:'E017',name:'นายขยัน อดทน',dept:'ปฏิบัติการ',pos:'พนักงานขับรถ',base:25000,otHrs:0,otRate:143,lateDays:0,approved:false},
{id:'E018',name:'นายขยัน อดทน',dept:'ปฏิบัติการ',pos:'พนักงานขับรถ',base:20000,otHrs:0,otRate:143,lateDays:0,approved:false},
  {id:'E19',name:'นายมนตรี ดูแลดี',dept:'คลังสินค้า',pos:'พนักงานคัดแยกพัสดุ',base:18000,otHrs:8,otRate:131,lateDays:0,approved:false},

];

// ── calc helpers ──
function calcOT(e){ return e.otHrs * e.otRate; }
function calcLate(e){ return e.lateDays * DAILY_RATE; }
function calcIncome(e){ return e.base + calcOT(e); }
function calcDeduct(e){ return calcLate(e); }
function calcNet(e){ return calcIncome(e) - calcDeduct(e); }

const deptMeta = {
  'คนขับรถ':  {cls:'d-driver', bar:'#f97316'},
  'คลังสินค้า':{cls:'d-ware',  bar:'#10b981'},
  'ปฏิบัติการ':{cls:'d-ops',   bar:'#3b82f6'},
  'การเงิน':  {cls:'d-fin',    bar:'#8b5cf6'},
};

// ══════════════════════ TAB ══════════════════════
function switchTab(page, btn){
  document.querySelectorAll('.tn-tab').forEach(b=>b.classList.remove('act'));
  btn.classList.add('act');
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('act'));
  document.getElementById('page-'+page).classList.add('act');
  if(page==='overview') renderOverview();
  if(page==='employee') renderEmpTable();
  if(page==='report') renderReport();
}

// ══════════════════════ OVERVIEW ══════════════════════
function renderOverview(){
  const totalBase = employees.reduce((s,e)=>s+e.base,0);
  const totalOT   = employees.reduce((s,e)=>s+calcOT(e),0);
  const totalLate = employees.reduce((s,e)=>s+calcLate(e),0);
  const totalNet  = employees.reduce((s,e)=>s+calcNet(e),0);

  const m = document.getElementById('selMonth').options[document.getElementById('selMonth').selectedIndex].text;
  const y = document.getElementById('selYear').value;
  document.getElementById('ov-sub').textContent = `${m} ${y} · ${employees.length} พนักงาน`;
  document.getElementById('sc-net').textContent  = '฿'+fmt(totalNet);
  document.getElementById('sc-base').textContent = '฿'+fmt(totalBase);
  document.getElementById('sc-ot').textContent   = '฿'+fmt(totalOT);
  document.getElementById('sc-late').textContent = '฿'+fmt(totalLate);
  document.getElementById('sc-count').textContent = employees.length+' คน';
  document.getElementById('sc-emp').textContent   = employees.length;

  // dept table
  const depts = ['คนขับรถ','คลังสินค้า','ปฏิบัติการ','การเงิน'];
  const tbody = document.getElementById('dept-tbody');
  tbody.innerHTML = depts.map(d=>{
    const grp = employees.filter(e=>e.dept===d);
    if(!grp.length) return '';
    const dBase = grp.reduce((s,e)=>s+e.base,0);
    const dOT   = grp.reduce((s,e)=>s+calcOT(e),0);
    const dNet  = grp.reduce((s,e)=>s+calcNet(e),0);
    const pct   = totalNet>0 ? (dNet/totalNet*100).toFixed(1) : 0;
    const meta  = deptMeta[d];
    return `<tr>
      <td><span class="dept-tag ${meta.cls}"><span class="dept-dot"></span>${d}</span></td>
      <td class="r">${grp.length}</td>
      <td class="r"><span class="money blue">฿${fmt(dBase)}</span></td>
      <td class="r"><span class="money orange">฿${fmt(dOT)}</span></td>
      <td class="r"><span class="money teal">฿${fmt(dNet)}</span></td>
      <td class="r">
        <div class="pbar-wrap">
          <div class="pbar-bg"><div class="pbar-fill" style="width:${pct}%;background:${meta.bar}"></div></div>
          <span class="pbar-pct">${pct}%</span>
        </div>
      </td>
    </tr>`;
  }).join('');

  // breakdown
  const items = [
    {lbl:'เงินเดือนพื้นฐาน', val:totalBase, color:'#3b82f6', max:totalBase},
    {lbl:'ค่า OT',           val:totalOT,   color:'#f97316', max:totalBase},
    {lbl:'หักมาสาย',         val:totalLate, color:'#ef4444', max:totalBase, neg:true},
  ];
  document.getElementById('bk-rows').innerHTML = items.map(it=>`
    <div class="bk-row">
      <span class="bk-label">${it.lbl}</span>
      <div class="bk-bar-wrap">
        <div class="bk-bar-bg"><div class="bk-bar-fill" style="width:${Math.min(100,it.val/it.max*100).toFixed(1)}%;background:${it.color}"></div></div>
      </div>
      <span class="bk-val" style="color:${it.neg?'#ef4444':it.color}">${it.neg?'-':''}฿${fmt(it.val)}</span>
    </div>`).join('');
  document.getElementById('bk-total').textContent = '฿'+fmt(totalNet);
}

// ══════════════════════ EMPLOYEE TABLE ══════════════════════
let deptFilterAct = 'ทั้งหมด';
function deptFilter(d,btn){
  deptFilterAct=d;
  document.querySelectorAll('.dpill').forEach(b=>b.classList.remove('act'));
  btn.classList.add('act');
  renderEmpTable();
}
function renderEmpTable(){
  const q=(document.getElementById('empSearch').value||'').toLowerCase();
  const rows = employees.filter(e=>{
    const mD = deptFilterAct==='ทั้งหมด'||e.dept===deptFilterAct;
    const mQ = !q||e.name.toLowerCase().includes(q)||e.id.toLowerCase().includes(q)||e.dept.includes(q);
    return mD&&mQ;
  });
  const meta = deptMeta;
  document.getElementById('emp-tbody').innerHTML = rows.map(e=>{
    const ot = calcOT(e); const late = calcLate(e); const net = calcNet(e);
    const m = meta[e.dept]||{cls:'d-ops'};
    return `<tr>
      <td><span class="emp-code">${e.id}</span></td>
      <td>
        <div class="emp-name" onclick="openSlip('${e.id}')">${e.name}</div>
        <div class="emp-pos">${e.pos}</div>
      </td>
      <td><span class="dept-tag ${m.cls}"><span class="dept-dot"></span>${e.dept}</span></td>
      <td><span class="money-cell blue">฿${fmt(e.base)}</span></td>
      <td><span class="money-cell orange">${ot>0?'฿'+fmt(ot):'—'}</span></td>
      <td class="late-cell">
        ${late>0?`<div class="late-amt">-฿${fmt(late)}</div><div class="late-days">${e.lateDays}วัน</div>`:'<span class="money-cell muted">—</span>'}
      </td>
      <td><span class="net-cell">฿${fmt(net)}</span></td>
      <td>
        <div class="row-actions">
          <button class="btn-slip" onclick="openSlip('${e.id}')">สลิป</button>
          <button class="btn-ok ${e.approved?'approved':''}" onclick="approveOne('${e.id}',this)">
            ${e.approved?'✓ อนุมัติแล้ว':'✓ อนุมัติ'}
          </button>
          <div class="icon-btn edit" onclick="openEdit('${e.id}')" title="แก้ไข">✏️</div>
          <div class="icon-btn del" onclick="confirmDel('${e.id}')" title="ลบ">🗑️</div>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ══════════════════════ SLIP ══════════════════════
let currentSlipId='';
function openSlip(id){
  const e = employees.find(x=>x.id===id);
  if(!e) return;
  currentSlipId = id;
  const ot = calcOT(e); const late = calcLate(e);
  const incomeTotal = e.base + ot;
  const net = incomeTotal - late;
  document.getElementById('sl-id').textContent   = e.id;
  document.getElementById('sl-name').textContent = e.name;
  document.getElementById('sl-dept').textContent = e.dept;
  document.getElementById('sl-pos').textContent  = e.pos;
  document.getElementById('sl-base').textContent = '฿'+fmt(e.base);
  document.getElementById('sl-ot').textContent   = ot>0 ? '฿'+fmt(ot) : '฿0';
  document.getElementById('sl-income-total').textContent = '฿'+fmt(incomeTotal);
  document.getElementById('sl-late').textContent = late>0 ? '-฿'+fmt(late)+` (${e.lateDays} วัน)` : '-฿0';
  document.getElementById('sl-deduct-total').textContent = '-฿'+fmt(late);
  document.getElementById('sl-net').textContent  = '฿'+fmt(net);
  document.getElementById('slipOverlay').classList.add('open');
}

// ══════════════════════ APPROVE ══════════════════════
function approveOne(id, btn){
  const e = employees.find(x=>x.id===id);
  if(!e) return;
  e.approved = !e.approved;
  btn.className = 'btn-ok'+(e.approved?' approved':'');
  btn.innerHTML = e.approved ? '✓ อนุมัติแล้ว' : '✓ อนุมัติ';
  toast(e.approved?'✅':'↩️', (e.approved?'อนุมัติ ':'ยกเลิกอนุมัติ ')+e.name);
}
function approveAll(){
  employees.forEach(e=>e.approved=true);
  renderEmpTable();
  toast('✅','อนุมัติจ่ายเงินทั้งหมด '+employees.length+' รายแล้ว');
}

// ══════════════════════ ADD / EDIT ══════════════════════
let editingId = null;
function openAdd(){
  editingId=null;
  ['f-code','f-name','f-pos'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('f-base').value='';
  document.getElementById('f-ot-hrs').value='0';
  document.getElementById('f-ot-rate').value='100';
  document.getElementById('f-late').value='0';
  document.getElementById('addModalTitle').textContent='+ เพิ่มพนักงาน';
  document.getElementById('addSaveBtn').textContent='💾 บันทึก';
  document.getElementById('addOverlay').classList.add('open');
}
function openEdit(id){
  const e=employees.find(x=>x.id===id); if(!e) return;
  editingId=id;
  document.getElementById('f-code').value=e.id;
  document.getElementById('f-name').value=e.name;
  document.getElementById('f-dept').value=e.dept;
  document.getElementById('f-pos').value=e.pos;
  document.getElementById('f-base').value=e.base;
  document.getElementById('f-ot-hrs').value=e.otHrs;
  document.getElementById('f-ot-rate').value=e.otRate;
  document.getElementById('f-late').value=e.lateDays;
  document.getElementById('addModalTitle').textContent='✏️ แก้ไข '+e.name;
  document.getElementById('addSaveBtn').textContent='💾 บันทึกการแก้ไข';
  document.getElementById('addOverlay').classList.add('open');
}
function saveEmployee(){
  const code=document.getElementById('f-code').value.trim();
  const name=document.getElementById('f-name').value.trim();
  if(!code||!name){toast('⚠️','กรุณากรอกรหัสและชื่อ');return;}
  if(editingId){
    const e=employees.find(x=>x.id===editingId);
    e.id=code; e.name=name;
    e.dept=document.getElementById('f-dept').value;
    e.pos=document.getElementById('f-pos').value;
    e.base=parseInt(document.getElementById('f-base').value)||0;
    e.otHrs=parseInt(document.getElementById('f-ot-hrs').value)||0;
    e.otRate=parseInt(document.getElementById('f-ot-rate').value)||100;
    e.lateDays=parseInt(document.getElementById('f-late').value)||0;
    toast('✅','อัปเดต '+name+' แล้ว');
  } else {
    if(employees.find(x=>x.id===code)){toast('⚠️','รหัส '+code+' มีอยู่แล้ว');return;}
    employees.push({
      id:code, name, approved:false,
      dept:document.getElementById('f-dept').value,
      pos:document.getElementById('f-pos').value,
      base:parseInt(document.getElementById('f-base').value)||0,
      otHrs:parseInt(document.getElementById('f-ot-hrs').value)||0,
      otRate:parseInt(document.getElementById('f-ot-rate').value)||100,
      lateDays:parseInt(document.getElementById('f-late').value)||0,
    });
    toast('✅','เพิ่มพนักงาน '+name+' แล้ว');
  }
  closeModal('addOverlay');
  renderEmpTable();
  renderOverview();
}

// ══════════════════════ DELETE ══════════════════════
let pendingDel=null;
function confirmDel(id){
  pendingDel=id;
  const e=employees.find(x=>x.id===id);
  document.getElementById('confirmMsg').textContent=`ลบ ${e?e.name:id} ออกจากระบบ? ไม่สามารถกู้คืนได้`;
  document.getElementById('confirmDelBtn').onclick=()=>{
    const e2=employees.find(x=>x.id===pendingDel);
    employees=employees.filter(x=>x.id!==pendingDel);
    renderEmpTable(); renderOverview();
    closeModal('confirmOverlay');
    toast('🗑️','ลบ '+(e2?e2.name:pendingDel)+' แล้ว');
  };
  document.getElementById('confirmOverlay').classList.add('open');
}

// ══════════════════════ REPORT ══════════════════════
function renderReport(){
  const depts=['คนขับรถ','คลังสินค้า','ปฏิบัติการ','การเงิน'];
  const rt=document.getElementById('report-summary-table');
  rt.innerHTML=`<thead><tr>
    <th>แผนก</th><th class="r">คน</th><th class="r">เงินเดือนรวม</th><th class="r">OT รวม</th><th class="r">หักมาสาย</th><th class="r">สุทธิ</th>
  </tr></thead><tbody>`+depts.map(d=>{
    const g=employees.filter(e=>e.dept===d);
    if(!g.length)return'';
    const b=g.reduce((s,e)=>s+e.base,0);
    const o=g.reduce((s,e)=>s+calcOT(e),0);
    const l=g.reduce((s,e)=>s+calcLate(e),0);
    const n=g.reduce((s,e)=>s+calcNet(e),0);
    return`<tr><td>${d}</td><td class="r">${g.length}</td><td class="r" style="color:#3b82f6;font-weight:700;">฿${fmt(b)}</td><td class="r" style="color:#f97316;font-weight:700;">฿${fmt(o)}</td><td class="r" style="color:#ef4444;font-weight:700;">-฿${fmt(l)}</td><td class="r" style="color:#14b8a6;font-weight:700;">฿${fmt(n)}</td></tr>`;
  }).join('')+'</tbody>';

  const et=document.getElementById('report-emp-table');
  et.innerHTML=`<thead><tr><th>รหัส</th><th>ชื่อ</th><th class="r">สุทธิ</th><th class="c">สถานะ</th></tr></thead><tbody>`+
    employees.map(e=>`<tr><td style="color:var(--muted);font-size:0.72rem;">${e.id}</td><td style="font-size:0.78rem;">${e.name}</td><td class="r" style="font-family:'Sarabun';font-weight:700;color:#5c60c8;">฿${fmt(calcNet(e))}</td><td style="text-align:center;">
      <span style="background:${e.approved?'#d1fae5':'#fef3c7'};color:${e.approved?'#065f46':'#92400e'};padding:0.18rem 0.55rem;border-radius:100px;font-size:0.65rem;font-weight:700;">${e.approved?'✓ จ่ายแล้ว':'รอ'}</span>
    </td></tr>`).join('')+'</tbody>';
}

// ══════════════════════ UTILS ══════════════════════
function recalc(){ renderOverview(); }
function fmt(n){ return Number(n).toLocaleString('th-TH'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
function closeOv(id,e){ if(e.target.id===id) closeModal(id); }
let toastT;
function toast(icon,msg){
  document.getElementById('t-icon').textContent=icon;
  document.getElementById('t-msg').textContent=msg;
  const t=document.getElementById('toast');
  t.classList.add('show');
  clearTimeout(toastT);
  toastT=setTimeout(()=>t.classList.remove('show'),2800);
}

// init
renderOverview();
renderEmpTable();