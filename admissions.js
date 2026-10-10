'use strict';
const Admissions=(()=>{
 function normalize(d){if(d)d.admissionSequences??={};}
 function validate(d){normalize(d);if(!d.admissionSequences||typeof d.admissionSequences!=='object'||Array.isArray(d.admissionSequences)||Object.values(d.admissionSequences).some(n=>!Number.isSafeInteger(n)||n<0))throw Error('Invalid admission sequences.');}
 function savedStudents(d){return [...d.students,...d.deletedRecords.flatMap(x=>x.kind==='student'?[x.student]:x.kind==='branch'?x.students:[])];}
 function prefix(d,branchId,year){const branch=d.branches.find(b=>b.id===branchId),code=branch?.code.toUpperCase().replace(/[^A-Z0-9]/g,''),years=year.match(/\d{4}/g);if(!code)throw Error('Set a branch code containing letters or numbers in Admin → Branch master.');if(years?.length!==2)throw Error('Select a valid academic year before adding an admission.');return code+'-'+years.join('-')+'-';}
 function next(d,branchId,year,reserve=false){normalize(d);const key=branchId+'|'+year,start=prefix(d,branchId,year),students=savedStudents(d);let last=d.admissionSequences[key]||0;for(const s of students)if(s.branchId===branchId&&s.year===year){const m=String(s.admission||'').match(/-\d{4}-\d{4}-(\d+)$/);if(m)last=Math.max(last,Number(m[1]));}const used=new Set(students.map(s=>s.admission));let number;do{if(!Number.isSafeInteger(last+1))throw Error('Admission sequence limit reached.');last++;number=start+String(last).padStart(4,'0');}while(used.has(number));if(reserve)d.admissionSequences[key]=last;return number;}
 const preview=(d,b,y)=>{try{return next(d,b,y)}catch{return 'Assigned when saved'}};
 return{normalize,validate,next,preview};
})();
function updateAdmissionPreview(){if(editing)return;const select=$('#studentForm [name=branchId]'),input=$('#studentForm [name=admission]');try{input.value=Admissions.next(data,select.value,year);}catch(e){input.value='Assigned when saved';}}
