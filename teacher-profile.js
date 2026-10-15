 'use strict';
const TeacherProfile=(()=>{
 const ROLE='little-wings-device-profile',PIN='little-wings-admin-pin';
 const teacher=()=>localStorage.getItem(ROLE)==='teacher';
 async function digest(value){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
 async function switchProfile(){try{
  if(busy||admissionSaving||collectionSaving)return notice('Wait for the current save to finish.');
  if(teacher()){
   const pin=window.prompt('Administrator PIN');if(pin===null)return;
   const saved=JSON.parse(localStorage.getItem(PIN)||'null');
   if(!saved||await digest(saved.salt+pin)!==saved.hash)return notice('Incorrect administrator PIN.');
   localStorage.setItem(ROLE,'admin');tab='home';
  }else{
   if(!localStorage.getItem(PIN)){
    const pin=window.prompt('Create an administrator PIN (at least 6 characters). Keep it private to return from Teacher profile.');if(pin===null)return;
    if(pin.length<6)return notice('Use at least 6 characters.');
    if(window.prompt('Confirm administrator PIN')!==pin)return notice('PIN confirmation did not match.');
    const salt=crypto.randomUUID();localStorage.setItem(PIN,JSON.stringify({salt,hash:await digest(salt+pin)}));
   }
   for(const id of ['editor','paymentDialog','cloudFolderPicker','excelExportDialog'])if($('#'+id)?.open)$('#'+id).close();
   localStorage.setItem(ROLE,'teacher');tab='performance';performanceStudent='';
  }
  render();notice(teacher()?'Teacher profile: Student Performance only.':'Administrator profile opened.');
 }catch(error){notice(error.message);}}
 function refresh(){const t=teacher();if(t&&tab!=='performance')tab='performance';for(const id of ['add','export']){const node=$('#'+id);if(node)node.hidden=t;}const button=$('#switchProfile');if(button){button.textContent=t?'Administrator login':'Teacher login';button.onclick=switchProfile;}const subtitle=document.querySelector('.app-subtitle');if(subtitle)subtitle.textContent=t?'Teacher · Student Performance':'Administrator app';}
 function check(before,next,options){if(!teacher())return;if(options.reset||options.clearLogs)throw Error('Teacher profile can edit Student Performance only.');const ignore=new Set(['performance','activities','revision']);for(const key of new Set([...Object.keys(before),...Object.keys(next)]))if(!ignore.has(key)&&JSON.stringify(before[key])!==JSON.stringify(next[key]))throw Error('Teacher profile can edit Student Performance only.');for(const old of before.performance)if(!next.performance.some(p=>p.id===old.id))throw Error('Only an administrator can delete performance records.');for(const row of next.performance){const old=before.performance.find(p=>p.id===row.id),student=before.students.find(s=>s.id===row.studentId);if(!student)throw Error('Student not found.');if(old){for(const k of ['studentId','branchId','year','class','term'])if(row[k]!==old[k])throw Error('Performance assignment cannot be changed.');}else if(row.branchId!==student.branchId||row.year!==student.year||row.class!==student.class)throw Error('Invalid performance assignment.');}}
 if(typeof window.addEventListener==='function')window.addEventListener('storage',e=>{if(e.key===ROLE)render();});
 return{teacher,switchProfile,refresh,check};
})();
