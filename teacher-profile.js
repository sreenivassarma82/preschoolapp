 'use strict';
const TeacherProfile=(()=>{
 const ROLE='little-wings-device-profile',PIN='little-wings-admin-pin';
 // Direct Teacher entry is applied before the ledger renders.
 if(new URLSearchParams(location.search).get('profile')==='teacher')localStorage.setItem(ROLE,'teacher');
 const teacher=()=>localStorage.getItem(ROLE)==='teacher';
 async function digest(value){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
 const PASSWORD='little-wings-admin-password',SESSION='little-wings-admin-session';
 const savedPassword=()=>JSON.parse(localStorage.getItem(PASSWORD)||'null');
 if(savedPassword()&&sessionStorage.getItem(SESSION)!==savedPassword().hash)localStorage.setItem(ROLE,'teacher');
 async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return Array.from(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:210000,hash:'SHA-256'},key,256))).map(x=>x.toString(16).padStart(2,'0')).join('');}
 async function setPassword(password,confirmation){if(teacher())throw Error('Sign in as administrator before setting a password.');if(password.length<10)throw Error('Use at least 10 characters.');if(password!==confirmation)throw Error('Passwords do not match.');const salt=crypto.randomUUID(),hash=await passwordHash(password,salt);localStorage.setItem(PASSWORD,JSON.stringify({name:'Deepti Sarma',salt,hash}));sessionStorage.setItem(SESSION,hash);localStorage.removeItem(PIN);}
 async function authenticate(password){const saved=savedPassword();if(saved){if(await passwordHash(password,saved.salt)!==saved.hash)throw Error('Incorrect administrator password.');sessionStorage.setItem(SESSION,saved.hash);}else{const old=JSON.parse(localStorage.getItem(PIN)||'null');if(!old||await digest(old.salt+password)!==old.hash)throw Error('Incorrect administrator PIN.');}localStorage.setItem(ROLE,'admin');tab='home';}
 function loginDialog(setup){const d=$('#adminLoginDialog'),form=$('#adminLoginForm'),message=$('#adminLoginMessage');$('#adminLoginTitle').textContent=setup?'Set password · Deepti Sarma':'Administrator login · Deepti Sarma';$('#adminPasswordConfirmLabel').hidden=!setup;form.elements.password.value='';form.elements.confirmPassword.value='';form.elements.password.autocomplete=setup?'new-password':'current-password';form.elements.confirmPassword.required=setup;message.textContent='';form.onsubmit=async e=>{e.preventDefault();const button=$('#adminLoginSubmit');button.disabled=true;try{if(setup)await setPassword(form.elements.password.value,form.elements.confirmPassword.value);else await authenticate(form.elements.password.value);d.close();form.reset();render();notice(setup?'Administrator password saved for Deepti Sarma on this device.':'Signed in as Deepti Sarma.');}catch(error){message.textContent=error.message;}finally{button.disabled=false;}};$('#adminLoginCancel').onclick=()=>d.close();d.showModal();}
 async function switchProfile(){try{
  if(busy||admissionSaving||collectionSaving)return notice('Wait for the current save to finish.');
  if(teacher()){
   if(!savedPassword()&&!localStorage.getItem(PIN))return notice('Administrator must set up the password on this device first.');
   loginDialog(false);return;
  }
  if(!savedPassword()){loginDialog(true);return;}
  for(const id of ['editor','paymentDialog','cloudFolderPicker','excelExportDialog'])if($('#'+id)?.open)$('#'+id).close();
  sessionStorage.removeItem(SESSION);localStorage.setItem(ROLE,'teacher');tab='performance';performanceStudent='';render();notice('Teacher profile: Student Performance only.');
 }catch(error){notice(error.message);}}
 function refresh(){const t=teacher();if(t&&tab!=='performance')tab='performance';for(const id of ['add','export']){const node=$('#'+id);if(node)node.hidden=t;}const button=$('#switchProfile');if(button){button.textContent=t?'Administrator login':savedPassword()?'Teacher login / Lock admin':'Set administrator password';button.onclick=switchProfile;}const subtitle=document.querySelector('.app-subtitle');if(subtitle)subtitle.textContent=t?'Teacher · Student Performance':'Administrator · Deepti Sarma';}
 function check(before,next,options){if(!teacher())return;if(options.reset||options.clearLogs)throw Error('Teacher profile can edit Student Performance only.');const ignore=new Set(['performance','activities','revision']);for(const key of new Set([...Object.keys(before),...Object.keys(next)]))if(!ignore.has(key)&&JSON.stringify(before[key])!==JSON.stringify(next[key]))throw Error('Teacher profile can edit Student Performance only.');for(const old of before.performance)if(!next.performance.some(p=>p.id===old.id))throw Error('Only an administrator can delete performance records.');for(const row of next.performance){const old=before.performance.find(p=>p.id===row.id),student=before.students.find(s=>s.id===row.studentId);if(!student)throw Error('Student not found.');if(old){for(const k of ['studentId','branchId','year','class','term'])if(row[k]!==old[k])throw Error('Performance assignment cannot be changed.');}else if(row.branchId!==student.branchId||row.year!==student.year||row.class!==student.class)throw Error('Invalid performance assignment.');}}
 if(typeof window.addEventListener==='function')window.addEventListener('storage',e=>{if(e.key===ROLE)render();});
 return{teacher,switchProfile,refresh,check,setPassword,authenticate,passwordHash};
})();
