// ══════════ STATE ══════════
const ZC={A:'var(--za)',B:'var(--zb)',C:'var(--zc)',D:'var(--zd)',E:'var(--ze)'};
const SL={
  's-recv':{lbl:'รับเข้าคลัง'},'s-sort':{lbl:'กำลังจัดเรียง'},
  's-wait':{lbl:'รอจัดส่ง'},'s-late':{lbl:'เกินกำหนด'},'s-sent':{lbl:'จัดส่งแล้ว'}
};
// Slot occupancy: per zone array, value = false|parcelId
const slots={A:Array(16).fill(false),B:Array(16).fill(false),C:Array(12).fill(false),D:Array(8).fill(false),E:Array(8).fill(false)};

let parcels=[
  {id:'TH240307001',sender:'บริษัท ABC จำกัด',date:'07/03/26 08:15',recv:'คุณสมชาย ใจดี',dest:'เชียงใหม่',weight:2.5,type:'📄',zone:'A',slot:'A-01',dl:'09/03/26',status:'s-wait',hist:[{s:'s-recv',t:'07/03/26 08:15'},{s:'s-wait',t:'07/03/26 10:00'}]},
  {id:'TH240307002',sender:'ร้านค้าออนไลน์ XYZ',date:'07/03/26 09:00',recv:'คุณมาลี สวยงาม',dest:'ภูเก็ต',weight:8.0,type:'📦',zone:'B',slot:'B-01',dl:'10/03/26',status:'s-sort',hist:[{s:'s-recv',t:'07/03/26 09:00'},{s:'s-sort',t:'07/03/26 09:30'}]},
  {id:'TH240307003',sender:'คุณประยุทธ์ รักดี',date:'07/03/26 07:30',recv:'คลินิก หมอดี',dest:'กรุงเทพฯ',weight:0.8,type:'📄',zone:'A',slot:'A-02',dl:'08/03/26',status:'s-wait',hist:[{s:'s-recv',t:'07/03/26 07:30'},{s:'s-wait',t:'07/03/26 09:00'}]},
  {id:'TH240307004',sender:'Lazada TH',date:'07/03/26 10:45',recv:'คุณวันเพ็ญ จริงใจ',dest:'อุดรธานี',weight:15.2,type:'🏗️',zone:'D',slot:'D-01',dl:'12/03/26',status:'s-recv',hist:[{s:'s-recv',t:'07/03/26 10:45'}]},
  {id:'TH240307005',sender:'บริษัท เทคโน จำกัด',date:'05/03/26 14:00',recv:'คุณธนา ศรีสุข',dest:'หาดใหญ่',weight:3.1,type:'🖥️',zone:'C',slot:'C-01',dl:'07/03/26',status:'s-late',overdue:true,hist:[{s:'s-recv',t:'05/03/26 14:00'},{s:'s-sort',t:'05/03/26 15:00'},{s:'s-wait',t:'06/03/26 08:00'},{s:'s-late',t:'07/03/26 00:00'}]},
  {id:'TH240307006',sender:'ห้างสรรพสินค้า Central',date:'07/03/26 11:20',recv:'คุณรัตนา ดีใจ',dest:'กรุงเทพฯ',weight:5.5,type:'📦',zone:'B',slot:'B-02',dl:'09/03/26',status:'s-wait',hist:[{s:'s-recv',t:'07/03/26 11:20'},{s:'s-wait',t:'07/03/26 12:00'}]},
  {id:'TH240307007',sender:'โรงพยาบาลกรุงเทพ',date:'07/03/26 12:00',recv:'คลินิก สุขภาพ',dest:'เชียงราย',weight:1.2,type:'📄',zone:'A',slot:'A-03',dl:'09/03/26',status:'s-sort',hist:[{s:'s-recv',t:'07/03/26 12:00'},{s:'s-sort',t:'07/03/26 12:30'}]},
  {id:'TH240307008',sender:'บริษัท นำเข้า จำกัด',date:'06/03/26 15:30',recv:'คุณอดิศร มั่งมี',dest:'นครราชสีมา',weight:22.0,type:'🏗️',zone:'E',slot:'E-01',dl:'11/03/26',status:'s-recv',hist:[{s:'s-recv',t:'06/03/26 15:30'}]},
  {id:'TH240307009',sender:'ร้านของขวัญ Gift4U',date:'06/03/26 16:00',recv:'คุณสุดา ใจงาม',dest:'กรุงเทพฯ',weight:4.0,type:'🫧',zone:'C',slot:'C-02',dl:'08/03/26',status:'s-sent',hist:[{s:'s-recv',t:'06/03/26 16:00'},{s:'s-sort',t:'06/03/26 17:00'},{s:'s-wait',t:'07/03/26 06:00'},{s:'s-sent',t:'07/03/26 11:00'}]},
];

let zf='ALL', sf='all';

function syncSlots(){
  Object.keys(slots).forEach(z=>slots[z].fill(false));
  parcels.filter(p=>p.status!=='s-sent').forEach(p=>{
    if(!p.slot)return;
    const[z,n]=p.slot.split('-');const i=parseInt(n)-1;
    if(slots[z]&&i>=0&&i<slots[z].length)slots[z][i]=p.id;
  });
}
syncSlots();

// ══════════ RENDER WAREHOUSE ══════════
function renderWH(){
  const q=(document.getElementById('whQ')?.value||'').toLowerCase();
  const list=parcels.filter(p=>{
    if(zf!=='ALL'&&p.zone!==zf)return false;
    if(sf!=='all'&&p.status!==sf)return false;
    if(q&&![p.id,p.recv,p.dest,p.sender].some(v=>v.toLowerCase().includes(q)))return false;
    return true;
  });
  document.getElementById('whBody').innerHTML=list.length?list.map(p=>`
    <tr>
      <td><input type="checkbox" class="chk wchk" data-id="${p.id}"></td>
      <td><div class="tid" onclick="openDetail('${p.id}')">${p.id}</div><div class="tdate">${p.date}</div></td>
      <td style="color:var(--text-mid);max-width:110px;font-size:12.5px">${p.sender}</td>
      <td><div class="rname">${p.recv}</div><div class="rloc">📍 ${p.dest}</div></td>
      <td><span class="wt">${p.weight} kg</span></td>
      <td style="font-size:17px">${p.type}</td>
      <td><div class="zbadge" style="background:${ZC[p.zone]}">${p.zone}</div></td>
      <td><span class="dl${p.overdue?' late':''}">${p.dl}</span></td>
      <td><span class="sb2 ${p.status}"><span class="d"></span>${SL[p.status].lbl}</span></td>
      <td><div class="acts">
        <button class="act" title="ดู/แก้ไข" onclick="openDetail('${p.id}')">✏️</button>
        ${p.status!=='s-sent'?`<button class="act go" title="จัดส่ง" onclick="quickSend('${p.id}')">📤</button>`:''}
        <button class="act del" title="ลบ" onclick="askDel('${p.id}')">🗑</button>
      </div></td>
    </tr>`).join('')
  :`<tr><td colspan="10" style="text-align:center;padding:28px;color:var(--text-muted)">ไม่พบรายการ</td></tr>`;
  updateHeader();
}

function updateHeader(){
  const n=parcels.length;
  const ov=parcels.filter(p=>p.overdue&&p.status!=='s-sent').length;
  document.getElementById('whSub').textContent=`พัสดุทั้งหมด ${n} รายการ`;
  document.getElementById('overdueLabel').textContent=`เกินกำหนด ${ov} ชิ้น`;
  const sendN=parcels.filter(p=>p.status==='s-wait'||p.status==='s-late').length;
  document.getElementById('sendBadge').textContent=sendN;
}

function setZF(el,z){zf=z;document.querySelectorAll('.zbtn').forEach(b=>b.classList.remove('on'));el.classList.add('on');renderWH();}
function setSF(el,s){sf=s;document.querySelectorAll('.spill').forEach(b=>b.classList.remove('on'));el.classList.add('on');renderWH();}
function filterZoneGo(z){nav(document.querySelector('[data-p=warehouse]'),'warehouse');const b=document.querySelector(`.zbtn[data-z=${z}]`);if(b)setZF(b,z);}
function filterStatusGo(s){nav(document.querySelector('[data-p=warehouse]'),'warehouse');const b=document.querySelector(`.spill[data-s=${s}]`);if(b)setSF(b,s);}
function toggleAll(chk){document.querySelectorAll('.wchk').forEach(c=>c.checked=chk.checked);}
function toggleSendAll(chk){document.querySelectorAll('.schk').forEach(c=>c.checked=chk.checked);}

// ══════════ RENDER SEND OUT ══════════
function renderSend(){
  const list=parcels.filter(p=>p.status==='s-wait'||p.status==='s-late');
  document.getElementById('sendSub').textContent=`รอจัดส่ง ${list.length} รายการ`;
  document.getElementById('sendBody').innerHTML=list.length?list.map(p=>`
    <tr>
      <td><input type="checkbox" class="chk schk" data-id="${p.id}"></td>
      <td><div class="tid" onclick="openDetail('${p.id}')">${p.id}</div></td>
      <td><div class="rname">${p.recv}</div><div class="rloc">📍 ${p.dest}</div></td>
      <td><div class="zbadge" style="background:${ZC[p.zone]};height:auto;border-radius:6px;padding:3px 8px;width:auto;display:inline-flex;flex-direction:column;align-items:center;font-size:11px">${p.zone}<span style="font-size:9px;opacity:.8">${p.slot}</span></div></td>
      <td><span class="wt">${p.weight} kg</span></td>
      <td><span class="dl${p.overdue?' late':''}">${p.dl}</span></td>
      <td><span class="sb2 ${p.status}"><span class="d"></span>${SL[p.status].lbl}</span></td>
      <td><div class="acts">
        <button class="act go" onclick="quickSend('${p.id}')">📤</button>
        <button class="act" onclick="openDetail('${p.id}')">✏️</button>
      </div></td>
    </tr>`).join('')
  :`<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--text-muted)">ไม่มีพัสดุรอจัดส่ง</td></tr>`;
}

// ══════════ RENDER TRACK ══════════
function renderTrack(){
  const q=(document.getElementById('trackQ')?.value||'').toLowerCase().trim();
  const list=q?parcels.filter(p=>p.id.toLowerCase().includes(q)||p.recv.toLowerCase().includes(q)||p.dest.toLowerCase().includes(q)):[...parcels].reverse().slice(0,8);
  document.getElementById('trackLabel').textContent=q?`ผลการค้นหา "${document.getElementById('trackQ').value}" — ${list.length} รายการ`:'พัสดุล่าสุดในระบบ';
  document.getElementById('trackList').innerHTML=list.length?list.map(p=>`
    <div class="titem" onclick="openDetail('${p.id}')">
      <div style="flex:1"><div class="tid2">${p.id}</div><div class="rname" style="font-size:13.5px;margin-top:3px">${p.recv}</div><div class="rloc">📍 ${p.dest} · ${p.weight} kg · โซน ${p.zone}</div></div>
      <span class="sb2 ${p.status}" style="margin-right:8px"><span class="d"></span>${SL[p.status].lbl}</span>
      <button class="btn btn-orange btn-xs" onclick="event.stopPropagation();openDetail('${p.id}')">รายละเอียด</button>
    </div>`).join('')
  :`<div style="text-align:center;padding:28px;color:var(--text-muted)">ไม่พบพัสดุ</div>`;
}

// ══════════ RENDER ZONES ══════════
function renderZones(){
  syncSlots();
  const names={A:'เอกสาร/เล็ก',B:'สินค้าทั่วไป',C:'อิเล็กทรอนิกส์',D:'ขนาดใหญ่',E:'เปราะบาง'};
  document.getElementById('zonePage').innerHTML=Object.keys(slots).map(z=>{
    const occ=slots[z].filter(Boolean).length;
    const cap=slots[z].length;
    const pct=Math.round(occ/cap*100);
    return `<div class="zblock">
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px">
        <div style="width:34px;height:34px;border-radius:8px;background:${ZC[z]};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0">${z}</div>
        <div><div style="font-size:13.5px;font-weight:700">โซน ${z}</div><div style="font-size:11px;color:var(--text-muted)">${names[z]}</div></div>
        <div style="margin-left:auto;text-align:right"><div style="font-size:19px;font-weight:800;font-family:'IBM Plex Mono',monospace;color:${ZC[z]}">${occ}</div><div style="font-size:10px;color:var(--text-muted)">/ ${cap}</div></div>
      </div>
      <div style="height:5px;background:var(--cream);border-radius:3px;overflow:hidden;margin-bottom:7px"><div style="height:100%;width:${pct}%;background:${ZC[z]};border-radius:3px"></div></div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">${pct}% เต็ม</div>
      <div class="fsgrid">
        ${slots[z].map((id,i)=>{
          const n=String(i+1).padStart(2,'0');const label=z+'-'+n;
          return id
            ?`<div class="fs occ" style="background:${ZC[z]}" title="${label}: ${id}" onclick="openDetail('${id}')">${label}</div>`
            :`<div class="fs free" title="${label}: ว่าง">${label}</div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

// ══════════ RENDER REPORT ══════════
function renderReport(){
  const total=parcels.length;
  const wt=parcels.reduce((a,p)=>a+p.weight,0).toFixed(1);
  const waitN=parcels.filter(p=>['s-wait','s-late'].includes(p.status)).length;
  const lateN=parcels.filter(p=>p.overdue&&p.status!=='s-sent').length;
  const rate=total?Math.round(lateN/total*100):0;
  document.getElementById('rDate').textContent='ข้อมูล ณ '+new Date().toLocaleDateString('th-TH');
  document.getElementById('rStats').innerHTML=[
    {l:'พัสดุทั้งหมด',v:total,sub:'ชิ้น',c:'var(--sb)'},
    {l:'น้ำหนักรวม',v:wt,sub:'kg',c:'var(--blue)'},
    {l:'รอจัดส่ง',v:waitN,sub:'ชิ้น',c:'var(--yellow)'},
    {l:'อัตราเกินกำหนด',v:rate+'%',sub:'',c:'var(--red)'},
  ].map(x=>`<div class="scard" style="border-top-color:${x.c}"><div class="sc-l">${x.l}</div><div class="sc-v" style="color:${x.c}">${x.v}</div><div style="font-size:12px;color:var(--text-muted)">${x.sub}</div></div>`).join('');

  const sg={};parcels.forEach(p=>sg[p.status]=(sg[p.status]||0)+1);
  const zg={};parcels.forEach(p=>zg[p.zone]=(zg[p.zone]||0)+1);
  const tg={};parcels.forEach(p=>tg[p.type]=(tg[p.type]||0)+1);
  const mx=(o)=>Math.max(...Object.values(o),1);
  const stColors={'s-recv':'var(--blue)','s-sort':'var(--green)','s-wait':'var(--yellow)','s-late':'var(--red)','s-sent':'var(--zd)'};
  const bar=(n,max,color)=>`<div class="rbar"><div class="rfill" style="width:${Math.round(n/max*100)}%;background:${color}"></div></div>`;
  document.getElementById('rCharts').innerHTML=`
    <div class="rchart"><div class="rct">BY STATUS</div>
      ${Object.entries(SL).map(([k,v])=>`<div class="rrow"><div class="rlabel">${v.lbl}</div>${bar(sg[k]||0,mx(sg),stColors[k])}<div class="rcnt">${sg[k]||0}</div></div>`).join('')}
    </div>
    <div class="rchart"><div class="rct">BY ZONE</div>
      ${Object.keys(slots).map(z=>`<div class="rrow"><div class="rlabel" style="display:flex;align-items:center;gap:5px"><span style="background:${ZC[z]};color:#fff;border-radius:4px;padding:1px 6px;font-size:10.5px;font-weight:700">${z}</span>โซน ${z}</div>${bar(zg[z]||0,mx(zg),ZC[z])}<div class="rcnt">${zg[z]||0}</div></div>`).join('')}
    </div>
    <div class="rchart"><div class="rct">BY TYPE</div>
      ${Object.entries(tg).map(([t,n])=>`<div class="rrow"><div class="rlabel">${t}</div>${bar(n,mx(tg),'var(--sb)')}<div class="rcnt">${n}</div></div>`).join('')}
    </div>`;
}

// ══════════ DETAIL MODAL ══════════
let editId='';
function openDetail(id){
  const p=parcels.find(x=>x.id===id);if(!p)return;
  editId=id;
  document.getElementById('detailTitle').textContent=p.id+' — '+p.recv;
  document.getElementById('detailInfo').innerHTML=`
    <div>ผู้ส่ง: <strong>${p.sender}</strong></div><div>ผู้รับ: <strong>${p.recv}</strong></div>
    <div>ต้นทาง: <strong>${p.dest&&p.dest!==p.sender?'กรุงเทพฯ':'-'}</strong></div><div>ปลายทาง: <strong>${p.dest}</strong></div>
    <div>น้ำหนัก: <strong>${p.weight} kg</strong></div><div>ประเภท: <strong>${p.type}</strong></div>
    <div>โซน/ช่อง: <strong style="color:var(--orange)">${p.zone} / ${p.slot}</strong></div><div>กำหนดส่ง: <strong class="${p.overdue?'late':''}">${p.dl}</strong></div>`;
  document.getElementById('detailStatus').value=p.status;
  document.getElementById('detailNote').value='';
  document.getElementById('detailTL').innerHTML=p.hist.map((h,i)=>{
    const isLast=i===p.hist.length-1;
    return `<div class="tl-step"><div class="tl-dot ${isLast?'cur':'done'}">${isLast?'●':'✓'}</div><div class="tl-info"><div class="tl-t">${SL[h.s]?.lbl||h.s}</div><div class="tl-d">${h.t}</div></div></div>`;
  }).join('');
  openOv('detail');
}
function saveDetail(){
  const p=parcels.find(x=>x.id===editId);if(!p)return;
  const ns=document.getElementById('detailStatus').value;
  const note=document.getElementById('detailNote').value;
  const now=nowStr();
  p.status=ns;p.overdue=ns==='s-late';
  p.hist.push({s:ns,t:now+(note?' ('+note+')':'')});
  if(ns==='s-sent')freeSlot(p);
  syncSlots();closeOv('detail');refreshAll();
  toast('อัปเดต '+editId+' → '+SL[ns].lbl,'ok');
}
function markSent(){
  document.getElementById('detailStatus').value='s-sent';
  saveDetail();
}
function freeSlot(p){
  if(!p.slot)return;const[z,n]=p.slot.split('-');const i=parseInt(n)-1;
  if(slots[z]&&i>=0)slots[z][i]=false;
}

// ══════════ DELETE ══════════
let delId='';
function askDel(id){delId=id;document.getElementById('delId').textContent=id;openOv('del');}
function doDelete(){
  const idx=parcels.findIndex(p=>p.id===delId);
  if(idx>=0){freeSlot(parcels[idx]);parcels.splice(idx,1);}
  closeOv('del');syncSlots();refreshAll();
  toast('ลบ '+delId+' ออกจากระบบแล้ว','ok');
}
function deleteSelected(){
  const ids=[...document.querySelectorAll('.wchk:checked')].map(c=>c.dataset.id);
  if(!ids.length){toast('กรุณาเลือกพัสดุก่อน','warn');return;}
  if(!confirm(`ลบ ${ids.length} รายการ?`))return;
  ids.forEach(id=>{const idx=parcels.findIndex(p=>p.id===id);if(idx>=0){freeSlot(parcels[idx]);parcels.splice(idx,1);}});
  syncSlots();refreshAll();toast('ลบ '+ids.length+' รายการสำเร็จ','ok');
}

// ══════════ SEND ══════════
let sendIds=[];
function quickSend(id){
  sendIds=[id];const p=parcels.find(x=>x.id===id);
  document.getElementById('sendTitle').textContent='จัดส่ง '+id;
  document.getElementById('sendDesc').textContent=p?`ผู้รับ: ${p.recv} · ${p.dest}`:'';
  openOv('send');
}
function openSendConfirm(){
  sendIds=[...document.querySelectorAll('.schk:checked')].map(c=>c.dataset.id);
  if(!sendIds.length){toast('กรุณาเลือกพัสดุก่อน','warn');return;}
  document.getElementById('sendTitle').textContent='จัดส่ง '+sendIds.length+' รายการ';
  document.getElementById('sendDesc').textContent=sendIds.join(', ');
  openOv('send');
}
function sendSelectedWH(){
  sendIds=[...document.querySelectorAll('.wchk:checked')].map(c=>c.dataset.id)
    .filter(id=>{ const p=parcels.find(x=>x.id===id);return p&&p.status!=='s-sent';});
  if(!sendIds.length){toast('กรุณาเลือกพัสดุที่ยังไม่ได้จัดส่ง','warn');return;}
  document.getElementById('sendTitle').textContent='จัดส่ง '+sendIds.length+' รายการ';
  document.getElementById('sendDesc').textContent=sendIds.join(', ');
  openOv('send');
}
function selAllSend(){document.querySelectorAll('.schk').forEach(c=>c.checked=true);document.getElementById('sendAll').checked=true;}
function doSend(){
  const driver=document.getElementById('driverSel').value;
  const truck=document.getElementById('truckSel').value;
  const now=nowStr();
  sendIds.forEach(id=>{
    const p=parcels.find(x=>x.id===id);
    if(p&&p.status!=='s-sent'){
      p.status='s-sent';p.overdue=false;
      p.hist.push({s:'s-sent',t:now+' · '+driver+' · '+truck});
      freeSlot(p);
    }
  });
  closeOv('send');syncSlots();refreshAll();
  toast('จัดส่ง '+sendIds.length+' รายการสำเร็จ โดย '+driver,'ok');
}

// ══════════ WIZARD ══════════
let wD={},wZone='',wSlot='';
function wNext(step){
  if(step===2){
    const s=document.getElementById('f-sender').value.trim();
    const r=document.getElementById('f-recv').value.trim();
    const d=document.getElementById('f-dest').value.trim();
    const w=parseFloat(document.getElementById('f-weight').value);
    if(!s||!r||!d||!w||w<=0){toast('กรุณากรอกข้อมูลที่จำเป็น (*)','warn');return;}
    wD={sender:s,from:document.getElementById('f-from').value||'-',recv:r,dest:d,weight:w,type:document.getElementById('f-type').value,dl:document.getElementById('f-dl').value||'(ไม่ระบุ)',note:document.getElementById('f-note').value};
    buildZonePick();
  }
  if(step===3){
    if(!wZone){toast('กรุณาเลือกโซน','warn');return;}
    if(!wSlot){toast('กรุณาเลือกช่อง','warn');return;}
    document.getElementById('confirmGrid').innerHTML=`
      <div>ผู้ส่ง: <strong>${wD.sender}</strong></div><div>ผู้รับ: <strong>${wD.recv}</strong></div>
      <div>ต้นทาง: <strong>${wD.from}</strong></div><div>ปลายทาง: <strong>${wD.dest}</strong></div>
      <div>น้ำหนัก: <strong>${wD.weight} kg</strong></div><div>ประเภท: <strong>${wD.type}</strong></div>
      <div>โซน/ช่อง: <strong style="color:var(--orange)">${wSlot}</strong></div><div>กำหนดส่ง: <strong>${wD.dl}</strong></div>`;
    document.getElementById('confirmBtn').onclick=doReceive;
  }
  // update steps UI
  [1,2,3].forEach(i=>{
    document.getElementById('step'+i).style.display=i===step?'block':'none';
    const c=document.getElementById('ws'+i),l=document.getElementById('wl'+i);
    c.className='ws-c'+(i<step?' done':i===step?' cur':'');
    c.textContent=i<step?'✓':i;
    l.className='ws-l'+(i===step?' cur':'');
    if(i<3)document.getElementById('wln'+i).className='wline'+(i<step?' done':'');
  });
}
function buildZonePick(){
  const names={A:'เล็ก',B:'ทั่วไป',C:'อิเล็ก',D:'ใหญ่',E:'เปราะ'};
  document.getElementById('zonePick').innerHTML=Object.keys(slots).map(z=>{
    const occ=slots[z].filter(Boolean).length,free=slots[z].length-occ;
    return `<div class="zcard${wZone===z?' sel':''}" id="zc-${z}" onclick="pickZone('${z}')" style="border-color:${wZone===z?ZC[z]:'var(--border)'}">
      <div class="zcard-badge" style="background:${ZC[z]}">${z}</div>
      <div style="font-size:13px;font-weight:700">โซน ${z}</div>
      <div style="font-size:11px;color:var(--text-muted)">${names[z]}</div>
      <div style="font-size:18px;font-weight:800;font-family:'IBM Plex Mono',monospace;color:${ZC[z]};margin-top:6px">${occ}/${slots[z].length}</div>
      <div style="font-size:11px;color:${free?'var(--green)':'var(--red)'};margin-top:2px">ว่าง ${free}</div>
    </div>`;
  }).join('');
  if(wZone)buildSlotPick(wZone);
}
function pickZone(z){
  wZone=z;wSlot='';
  document.querySelectorAll('[id^=zc-]').forEach(el=>el.style.borderColor='var(--border)');
  const el=document.getElementById('zc-'+z);if(el)el.style.borderColor=ZC[z];
  buildSlotPick(z);
}
function buildSlotPick(z){
  document.getElementById('slotSec').style.display='block';
  document.getElementById('slotPick').innerHTML=slots[z].map((occ,i)=>{
    const n=String(i+1).padStart(2,'0'),label=z+'-'+n;
    if(occ)return`<div class="slot occ" style="background:${ZC[z]}" title="${label}: ${occ}">${label}</div>`;
    return`<div class="slot ${wSlot===label?'picked':'free'}" onclick="pickSlot('${label}')" title="${label}: ว่าง">${label}</div>`;
  }).join('');
  document.getElementById('pickedLabel').textContent=wSlot||'—';
}
function pickSlot(label){wSlot=label;buildSlotPick(wZone);}
function doReceive(){
  const now=nowStr();const newId='TH'+Date.now().toString().slice(-9);
  const[z,n]=wSlot.split('-');const i=parseInt(n)-1;
  if(slots[z])slots[z][i]=newId;
  parcels.unshift({id:newId,sender:wD.sender,date:now,recv:wD.recv,dest:wD.dest,weight:wD.weight,type:wD.type,zone:z,slot:wSlot,dl:wD.dl,status:'s-recv',hist:[{s:'s-recv',t:now}]});
  syncSlots();
  // reset
  ['f-sender','f-from','f-recv','f-dest','f-weight','f-note'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('f-dl').value='';
  wD={};wZone='';wSlot='';wNext(1);
  refreshAll();nav(document.querySelector('[data-p=warehouse]'),'warehouse');
  toast('รับพัสดุ '+newId+' เข้าโซน '+wSlot+' สำเร็จ!','ok');
}

// ══════════ NAV ══════════
const PAGE_TITLES={warehouse:'คลังพัสดุ — สาขากรุงเทพฯ',receive:'รับพัสดุเข้า — สาขากรุงเทพฯ',sendout:'จัดส่งออก — สาขากรุงเทพฯ',tracking:'ติดตามพัสดุ — สาขากรุงเทพฯ',zones:'แผนผังโซน — สาขากรุงเทพฯ',report:'รายงาน — สาขากรุงเทพฯ'};
function nav(el,p){
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
  (el?.classList?el:document.querySelector(`[data-p=${p}]`))?.classList.add('active');
  document.querySelectorAll('.page').forEach(pg=>pg.classList.remove('active'));
  document.getElementById('page-'+p)?.classList.add('active');
  document.getElementById('topTitle').textContent=PAGE_TITLES[p]||p;
  document.getElementById('topMeta').textContent=nowStr();
  if(p==='warehouse')renderWH();
  if(p==='sendout')renderSend();
  if(p==='tracking')renderTrack();
  if(p==='zones')renderZones();
  if(p==='report')renderReport();
}
function refreshAll(){renderWH();renderSend();renderTrack();}

// ══════════ MODAL ══════════
function openOv(id){document.getElementById('ov-'+id).classList.add('open');}
function closeOv(id){document.getElementById('ov-'+id).classList.remove('open');}
document.querySelectorAll('.ov').forEach(el=>el.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');}));

// ══════════ UTILS ══════════
function nowStr(){return new Date().toLocaleString('th-TH',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'});}
function toast(msg,type='info'){
  const w=document.getElementById('toastWrap');
  const t=document.createElement('div');t.className='toast '+type;
  t.innerHTML=`<span>${{ok:'✅',warn:'⚠️',err:'❌',info:'ℹ️'}[type]||'ℹ️'}</span>${msg}`;
  w.appendChild(t);
  setTimeout(()=>{t.style.transition='all .28s';t.style.opacity='0';t.style.transform='translateX(14px)';setTimeout(()=>t.remove(),300);},3200);
}

// ══════════ INIT ══════════
syncSlots();renderWH();renderSend();renderTrack();renderZones();renderReport();