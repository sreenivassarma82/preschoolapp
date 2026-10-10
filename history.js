'use strict';
const History=(()=>{
 const KEY='ledger-activity-pending';let pending=[];try{pending=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(pending))pending=[];}catch{}
 const actor=()=>{const name=localStorage.getItem('ledger-operator-name')?.trim();const account=OneDrive.accountLabel();return account?(name?name+' ('+account+')':account):name||'Unnamed operator';};
 const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(pending))}catch{}};
 function event(datasetId,action,subject='',details='',year='',outcome='Success'){return {id:crypto.randomUUID(),datasetId,at:new Date().toISOString(),actor:actor(),action,subject,details,year,outcome};}
 function queue(e){pending.push(e);persist();}
 function merge(...lists){const seen=new Set();return lists.flat().filter(e=>{if(!e||seen.has(e.id))return false;seen.add(e.id);return true});}
 function synced(ids){const set=new Set(ids);pending=pending.filter(e=>!set.has(e.id));persist();}
 function moveSetup(from,to){if(from===to)return;for(const e of pending)if(e.datasetId===from&&/^(App|Microsoft|OneDrive|Connection|Folder)/.test(e.action))e.datasetId=to;persist();}
 function changes(before,after){const events=[],emit=(a,s,d,y)=>events.push(event(after.datasetId,a,s,d,y));
  for(const s of after.students){const old=before.students.find(x=>x.id===s.id);if(!old){const restored=before.deletedRecords.some(x=>x.kind==='student'&&x.student.id===s.id);emit(restored?'Student restored':'Student added',[s.first,s.middle,s.surname].filter(Boolean).join(' '),'Branch: '+(after.branches?.find(b=>b.id===s.branchId)?.name||'Select branch')+'; Class: '+s.class,s.year);}else{const fields=Object.keys(s).filter(k=>JSON.stringify(s[k])!==JSON.stringify(old[k]));if(fields.length)emit('Student updated',[s.first,s.middle,s.surname].filter(Boolean).join(' '),'Changed fields: '+fields.join(', '),s.year);}}
  for(const s of before.students)if(!after.students.some(x=>x.id===s.id))emit('Student deleted',[s.first,s.middle,s.surname].filter(Boolean).join(' '),'Removed from active enrolments. Use Deleted records or a previous backup for recovery.',s.year);
  for(const p of after.payments)if(!before.payments.some(x=>x.id===p.id)){const s=after.students.find(x=>x.id===p.student);const restored=before.deletedRecords.some(x=>x.kind==='payment'&&x.payment.id===p.id)||before.deletedRecords.some(x=>x.kind==='student'&&x.payments.some(t=>t.id===p.id));emit(restored?'Payment restored':'Payment recorded',s?[s.first,s.surname].filter(Boolean).join(' '):p.student,'Branch: '+(after.branches?.find(b=>b.id===s?.branchId)?.name||'Select branch')+'; Amount: '+p.amount+' '+after.currency+'; method: '+p.method+'; receipt: '+(p.reference||'—'),s?.year||'');}
  for(const p of before.payments)if(!after.payments.some(x=>x.id===p.id)){const s=before.students.find(x=>x.id===p.student);emit('Payment deleted',s?[s.first,s.surname].filter(Boolean).join(' '):p.student,'Amount: '+p.amount+' '+before.currency+'; receipt: '+(p.reference||'—'),s?.year||'');}
  for(const y of Object.keys(after.years)){if(!before.years[y])emit(before.deletedRecords.some(x=>x.kind==='year'&&x.year===y)?'Academic year restored':'Academic year added',y,'Annual fees copied or restored.',y);else if(JSON.stringify(before.years[y])!==JSON.stringify(after.years[y])){const fees=Object.keys(after.years[y].fees).filter(c=>before.years[y].fees[c]!==after.years[y].fees[c]);emit('Annual fees updated',y,fees.map(c=>c+': '+before.years[y].fees[c]+' → '+after.years[y].fees[c]).join('; '),y);}}
  for(const y of Object.keys(before.years))if(!after.years[y])emit('Academic year deleted',y,'Year removed from the active ledger. Use Deleted records or a previous backup for recovery.',y);
  if(before.school!==after.school||before.currency!==after.currency)emit('School settings updated',after.school,'Changed: '+[before.school!==after.school?'school name':'',before.currency!==after.currency?'currency':''].filter(Boolean).join(', '),'');
  return events;
 }
 return{event,queue,merge,synced,moveSetup,changes,actor,pending:dataset=>pending.filter(e=>!dataset||e.datasetId===dataset)};
})();
