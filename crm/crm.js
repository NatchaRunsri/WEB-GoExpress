// ── DATA ──//
const customers = [
  {name:'บริษัท เทคโนโลยี ไทย จำกัด',contact:'คุณสมหมาย ดีมาก',email:'sommai@techth.co.th',tier:'platinum',type:'org',typeLabel:'องค์กร',score:94,trips:142,rev:'฿2,840K',ticket:1,color:'#6c63ff',abbr:'ล'},
  {name:'ร้านค้าออนไลน์ MegaShop',contact:'คุณวิไล ค้าขาย',email:'wilai@megashop.th',tier:'gold',type:'sme',typeLabel:'SME',score:78,trips:89,rev:'฿890K',ticket:1,color:'#3b82f6',abbr:'ค'},
  {name:'คุณธนพล รักการส่ง',contact:'คุณธนพล รักการส่ง',email:'thanapol@gmail.com',tier:'silver',type:'person',typeLabel:'บุคคล',score:62,trips:28,rev:'฿56K',ticket:0,color:'#8b5cf6',abbr:'ธ'},
  {name:'บริษัท สตาร์ทอัพ ฟิวเจอร์',contact:'คุณมาร์ค ทำธุรกิจ',email:'mark@startup.io',tier:'silver',type:'sme',typeLabel:'SME',score:45,trips:15,rev:'฿75K',ticket:0,color:'#ec4899',abbr:'ส',inactive:true},
  {name:'ห้างหุ้นส่วน กรีน ชัพพลาย',contact:'คุณหวาน สายส่ง',email:'hwan@green.th',tier:'gold',type:'sme',typeLabel:'SME',score:72,trips:67,rev:'฿536K',ticket:0,color:'#f59e0b',abbr:'ห'},
  {name:'บริษัท อาหารสด เดลิเวอรี่',contact:'คุณอนุชา ผู้จัดการ',email:'anucha@deliv.th',tier:'gold',type:'org',typeLabel:'องค์กร',score:88,trips:320,rev:'฿1,920K',ticket:1,color:'#f97316',abbr:'อ'},
  {name:'คลินิกสุขภาพ แฮปปี้ไลฟ์',contact:'คุณพัชรี หมอ',email:'pat@happylife.th',tier:'bronze',type:'person',typeLabel:'บุคคล',score:55,trips:12,rev:'฿38K',ticket:0,color:'#06b6d4',abbr:'ค'},
];

let selCust = null, tierFilter='all', typeFilter='all';

function renderCustomers(list){
  const el = document.getElementById('custList');
  el.innerHTML = '';
  list.forEach((c,i)=>{
    const tierMap={platinum:'b-platinum',gold:'b-gold',silver:'b-silver',bronze:'b-bronze'};
    const tierLabel={platinum:'Platinum',gold:'Gold',silver:'Silver',bronze:'Bronze'};
    const div = document.createElement('div');
    div.className='cust-row'+(selCust===i?' selected':'');
    div.innerHTML=`
      <div class="cr-avatar" style="background:${c.color}">${c.abbr}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap">
          <div class="cr-name">${c.name}</div>
          <span class="badge ${tierMap[c.tier]}" style="font-size:10.5px">${tierLabel[c.tier]}</span>
          ${c.inactive?'<span class="badge b-gray" style="font-size:10.5px">ไม่ใช้งาน</span>':''}
        </div>
        <div class="cr-contact">${c.contact} · ${c.email}</div>
        <div class="cr-meta"><span>${c.typeLabel}</span><span>${c.trips} ครั้ง</span><span>${c.rev}</span></div>
      </div>
      <div class="cr-right">
        <div class="cr-score" style="color:${c.score>=80?'var(--accent3)':c.score>=60?'var(--yellow)':'var(--red)'}">${c.score}</div>
        ${c.ticket?`<div class="cr-ticket" style="color:var(--accent2)">${c.ticket} ticket</div>`:''}
      </div>`;
    div.onclick=()=>{selCust=i;renderCustomers(filteredList());renderDetail(c);};
    el.appendChild(div);
  });
}

function filteredList(){
  return customers.filter(c=>{
    if(tierFilter!=='all'&&c.tier!==tierFilter)return false;
    if(typeFilter!=='all'&&c.type!==typeFilter)return false;
    return true;
  });
}

function filterCustomers(q){
  const list = filteredList().filter(c=>c.name.includes(q)||c.email.includes(q)||c.contact.includes(q));
  renderCustomers(list);
}

function setFilter(el,f){
  document.querySelectorAll('#custFilters .filter-chip').forEach(e=>e.classList.remove('active'));
  el.classList.add('active'); tierFilter=f; renderCustomers(filteredList());
}
function setFilter2(el,f){
  el.closest('.cust-filters').querySelectorAll('.filter-chip').forEach(e=>e.classList.remove('active'));
  el.classList.add('active'); typeFilter=f; renderCustomers(filteredList());
}

function renderDetail(c){
  const tierMap={platinum:'b-platinum',gold:'b-gold',silver:'b-silver',bronze:'b-bronze'};
  const tierLabel={platinum:'Platinum',gold:'Gold',silver:'Silver',bronze:'Bronze'};
  document.getElementById('custDetail').innerHTML=`
    <div class="cd-head">
      <div class="cd-avatar" style="background:${c.color}">${c.abbr}</div>
      <div>
        <div class="cd-name">${c.name}</div>
        <div class="cd-contact">${c.contact} · ${c.email}</div>
        <div style="margin-top:6px;display:flex;gap:6px"><span class="badge ${tierMap[c.tier]}">${tierLabel[c.tier]}</span><span class="badge b-gray">${c.typeLabel}</span></div>
      </div>
    </div>
    <div class="cd-body">
      <div class="cd-section">
        <div class="cd-sec-title">ข้อมูลทั่วไป</div>
        <div class="cd-grid">
          <div class="cd-field"><div class="cd-flabel">คะแนน NPS</div><div class="cd-fval" style="color:${c.score>=80?'var(--accent3)':c.score>=60?'var(--yellow)':'var(--red)'};font-family:'IBM Plex Mono',monospace">${c.score}</div></div>
          <div class="cd-field"><div class="cd-flabel">รายได้สะสม</div><div class="cd-fval" style="color:var(--accent2);font-family:'IBM Plex Mono',monospace">${c.rev}</div></div>
          <div class="cd-field"><div class="cd-flabel">จำนวนครั้งที่ส่ง</div><div class="cd-fval">${c.trips} ครั้ง</div></div>
          <div class="cd-field"><div class="cd-flabel">Ticket ค้างอยู่</div><div class="cd-fval" style="color:${c.ticket?'var(--red)':'var(--accent3)'}">${c.ticket||0} รายการ</div></div>
        </div>
      </div>
      <div class="cd-section">
        <div class="cd-sec-title">ประวัติการส่ง</div>
        <div style="background:var(--bg);border-radius:9px;padding:12px 14px;border:1px solid var(--border);font-size:12.5px;color:var(--text-mid);line-height:1.9">
          📦 คำสั่งล่าสุด: <strong style="color:var(--text)">${c.trips} ครั้ง</strong><br>
          ✅ ส่งตรงเวลา: <strong style="color:var(--accent3)">${Math.round(c.trips*.96)} ครั้ง</strong><br>
          ⚠ ล่าช้า: <strong style="color:var(--yellow)">${Math.round(c.trips*.04)} ครั้ง</strong>
        </div>
      </div>
    </div>
    <div class="cd-actions">
      <button class="btn btn-accent btn-sm" onclick="showToast('โทรหา ${c.contact}')">📞 โทร</button>
      <button class="btn btn-orange btn-sm" onclick="openModal('addTicket')">🎫 เปิด Ticket</button>
      <button class="btn btn-outline btn-sm" onclick="showToast('ส่งอีเมลหา ${c.name}','success')">📧 อีเมล</button>
      <button class="btn btn-red btn-sm" onclick="showToast('ลบ ${c.name} ออกจากระบบ','error')">🗑 ลบ</button>
    </div>`;
}

// ── NAV ──
const pageTitles={overview:'ภาพรวม',customers:'ลูกค้า',support:'Support',pipeline:'Pipeline',analytics:'Analytics'};
function nav(el,page,title){
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('active'));
  if(el&&el.classList) el.classList.add('active');
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg = document.getElementById('page-'+page);
  if(pg) pg.classList.add('active');
  document.getElementById('topTitle').textContent=title||pageTitles[page]||page;
  if(page==='customers'){renderCustomers(filteredList());}
  if(page==='analytics'){buildChart();}
}

// ── CHART ──
function buildChart(){
  const wrap=document.getElementById('revenueChart');
  if(!wrap||wrap.children.length>0)return;
  const months=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const vals=[1.2,1.4,1.5,1.6,1.8,2.0,2.1,2.2,2.4,2.6,3.0,4.0];
  const max=4.0;
  months.forEach((m,i)=>{
    const pct=vals[i]/max*100;
    const isLast=i===11;
    const bar=document.createElement('div');
    bar.className='bar-item';
    bar.innerHTML=`<div class="bar" style="height:${pct}%;background:${isLast?'var(--accent)':'#e2e5f0'}" onclick="showToast('${m}: ฿${vals[i]}M')"><span class="bar-v" style="color:${isLast?'var(--accent)':'var(--text-muted)'};font-size:9px">${isLast?vals[i]+'แสน':''}</span></div><div class="bar-lbl">${m}</div>`;
    wrap.appendChild(bar);
  });
}

// ── TABS (support) ──
function setTkFilter(el,f){
  el.closest('.tk-filters').querySelectorAll('.filter-chip').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  showToast('กรอง: '+el.textContent.trim());
}

// ── MODAL ──
function openModal(id){document.getElementById('modal-'+id).classList.add('open');}
function closeModal(id){document.getElementById('modal-'+id).classList.remove('open');}
document.querySelectorAll('.modal-overlay').forEach(el=>{
  el.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');});
});
function saveNewCustomer(){
  const n=document.getElementById('newCustName').value.trim()||'ลูกค้าใหม่';
  closeModal('addCustomer');
  showToast('เพิ่มลูกค้า "'+n+'" สำเร็จ!','success');
}
function saveTicket(){closeModal('addTicket');showToast('เปิด Ticket สำเร็จ!','success');}

// ── SELECT CUSTOMER (from overview) ──
function selectCustomer(name,color,abbr,tier,contact,email,trips,rev,type,score){
  nav(document.querySelector('[data-page=customers]'),'customers','ลูกค้า');
  setTimeout(()=>{
    const c={name,color,abbr,tier:tier.toLowerCase(),type:type==='องค์กร'?'org':type==='SME'?'sme':'person',typeLabel:type,score:parseInt(score),trips:parseInt(trips),rev,ticket:0,contact,email};
    renderDetail(c);
  },100);
}

// ── TOAST ──
function showToast(msg,type='info'){
  const w=document.getElementById('toastWrap');
  const t=document.createElement('div');
  t.className='toast '+type;
  const icons={success:'✅',warning:'⚠️',error:'❌',info:'ℹ️'};
  t.innerHTML=`<span>${icons[type]||'ℹ️'}</span>${msg}`;
  w.appendChild(t);
  setTimeout(()=>{t.style.transition='all .3s ease';t.style.opacity='0';t.style.transform='translateX(16px)';setTimeout(()=>t.remove(),300);},3000);
}

// init
renderCustomers(filteredList());
buildChart();