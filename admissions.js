'use strict';
const Admissions=(()=>{
 function normalize(d){if(d)d.admissionSequences??={};}
 function validate(d){normalize(d);if(!d.admissionSequences||typeof d.admissionSequences!=='object'||Array.isArray(d.admissionSequences)||Object.values(d.admissionSequences).some(n=>!Number.isSafeInteger(n)||n<0))throw Error('Invalid admission sequences.');}
 function completion(d,s){const missing=[],text=(key,label)=>{if(typeof s?.[key]!=='string'||!s[key].trim())missing.push(label);};
  if(!d.branches.some(b=>b.id===s?.branchId))missing.push('Branch');if(!d.years[s?.year])missing.push('Academic year');
  for(const [key,label] of [['admission','Admission number'],['first','First name'],['middle','Middle name'],['surname','Surname'],['father',"Father’s full name"],['mother',"Mother’s full name"],['mobile','Mobile number'],['address','Address'],['notes','Notes']])text(key,label);
  if(!['Male','Female'].includes(s?.gender))missing.push('Gender');if(!classes.includes(s?.class))missing.push('Class');if(!Admin.dateOK(s?.date))missing.push('Admission date');if(!Admin.dateOK(s?.dob)||s.dob>new Date().toISOString().slice(0,10))missing.push('Date of birth');
  if(typeof s?.photo!=='string'||!/^data:image\/(png|jpeg|webp);base64,.+/.test(s.photo))missing.push('Student photo');return{complete:missing.length===0,missing};
 }
 function nameMarkup(d,s){const c=completion(d,s),label=c.complete?'Admission complete':'Missing: '+c.missing.join(', ');return `<strong class="admission-name ${c.complete?'admission-complete':'admission-incomplete'}" title="${esc(label)}">${esc([s.first,s.middle,s.surname].filter(Boolean).join(' '))}</strong>`;}
 function statusMarkup(d,s){const c=completion(d,s);return c.complete?'<span class="admission-status">Complete</span>':`<details class="admission-status"><summary>Incomplete (${c.missing.length})</summary><span>Missing: ${esc(c.missing.join(', '))}</span></details>`;}
 const completionLegend='<p class="setting-note">Green names have all admission details filled, including photo. Black names have missing details; tap Incomplete to see the fields. Blood group, fee/discount details, other contact number and both signature fields are excluded. Save admission changes to update the status.</p>';
 function savedStudents(d){return [...d.students,...d.deletedRecords.flatMap(x=>x.kind==='student'?[x.student]:x.kind==='branch'?x.students:[])];}
 function prefix(d,branchId,year){const branch=d.branches.find(b=>b.id===branchId),code=branch?.code.toUpperCase().replace(/[^A-Z0-9]/g,''),years=year.match(/\d{4}/g);if(!code)throw Error('Set a branch code containing letters or numbers in Admin → Branch master.');if(years?.length!==2)throw Error('Select a valid academic year before adding an admission.');return code+'-'+years.join('-')+'-';}
 function next(d,branchId,year,reserve=false){normalize(d);const key=branchId+'|'+year,start=prefix(d,branchId,year),students=savedStudents(d);let last=d.admissionSequences[key]||0;for(const s of students)if(s.branchId===branchId&&s.year===year){const m=String(s.admission||'').match(/-\d{4}-\d{4}-(\d+)$/);if(m)last=Math.max(last,Number(m[1]));}const used=new Set(students.map(s=>s.admission));let number;do{if(!Number.isSafeInteger(last+1))throw Error('Admission sequence limit reached.');last++;number=start+String(last).padStart(4,'0');}while(used.has(number));if(reserve)d.admissionSequences[key]=last;return number;}
 const preview=(d,b,y)=>{try{return next(d,b,y)}catch{return 'Assigned when saved'}};
 return{normalize,validate,next,preview,completion,nameMarkup,statusMarkup,completionLegend};
})();
function updateAdmissionPreview(){if(editing)return;const select=$('#studentForm [name=branchId]'),input=$('#studentForm [name=admission]');try{input.value=Admissions.next(data,select.value,year);}catch(e){input.value='Assigned when saved';}}
