const outputPath=f=>require('path').join(process.env.TEST_OUTPUT_DIR||require('os').tmpdir(),f);
const fs=require('fs'),vm=require('vm'),assert=require('assert'),{webcrypto}=require('crypto');
const mem=()=>{const m=new Map();return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}};
function setup(){const els=new Map();const el=s=>{if(!els.has(s))els.set(s,{textContent:'',innerHTML:'',value:'',events:{},addEventListener(k,f){this.events[k]=f},classList:{toggle(){}},scrollIntoView(){}});return els.get(s)};const x={console,crypto:webcrypto,Blob,TextEncoder,Uint8Array,DataView,URL,URLSearchParams,Intl,structuredClone,setTimeout:()=>1,localStorage:mem(),sessionStorage:mem(),location:{origin:'https://school.example',pathname:'/preschoolapp/',search:'',hash:'',protocol:'https:',hostname:'school.example',assign(v){this.assigned=v}},history:{replaceState(){}},btoa:s=>Buffer.from(s,'binary').toString('base64'),alert(){},confirm:()=>true,FormData:class{constructor(o){this.o=o}get(k){return this.o[k]}},document:{querySelector:el,querySelectorAll:()=>[],activeElement:null},indexedDB:{open(){throw Error('Unavailable')}}};x.window=x;vm.createContext(x);for(const f of ['bootstrap.js','cloud.js','history.js','excel.js','admin.js','admin-ui.js','expenses.js','event-collections.js','home-dashboard.js','performance.js','performance-ui.js','marksheet-export.js','school-documents.js','navigation.js','admissions.js','filtered-export.js','student-photo.js','teacher-profile.js','app.js'])vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..',f),'utf8'),x);return{x,el,run:s=>vm.runInContext(s,x),submit:async(s,o)=>{Object.assign(el(s),o);return el(s).events.submit({preventDefault(){},target:o})}}}

(async()=>{
const {x,el,run}=setup();
x.prompt=()=> '123456';
await run('TeacherProfile.switchProfile()');
assert.equal(run('TeacherProfile.teacher()'),true);assert.equal(run('tab'),'performance');
assert.equal(el('#add').hidden,true);assert.equal(el('#export').hidden,true);
assert(!el('#subnav').innerHTML.includes('Admissions'));assert(!el('#nav').innerHTML.includes('Admin'));
run("navigateTo('settings')");assert.equal(run('tab'),'performance');
run("restoreNavigation({ledgerNavigation:true,index:0,tab:'fees'})");assert.equal(run('tab'),'performance');
run("data.students.push({id:uid(),branchId,year,class:classes[0],first:'Test',gender:'Male',date:today(),discount:0});performanceStudent=data.students[0].id;tab='performance';render()");
const form={date:'2026-10-15',incharge:'Teacher',remarks:'Progress'};for(let i=0;i<5;i++)for(const k of ['oral','written','assignment'])form['mark_'+i+'_'+k]='';
await el('#performanceForm').events.submit({preventDefault(){},target:form});assert.equal(run('data.performance.length'),1);assert.equal(run('data.performance[0].remarks'),'Progress');
const before=run('JSON.stringify(data)');assert.equal(await run("(()=>{const n=clone();n.school='Changed';return commit(n)})()"),false);assert.equal(run('JSON.stringify(data)'),before);
assert.equal(await run("(()=>{const n=clone();return commit(n,{reset:true})})()"),false);
x.prompt=()=> 'wrong';await run('TeacherProfile.switchProfile()');assert(run('TeacherProfile.teacher()'));
x.prompt=()=> '123456';await run('TeacherProfile.switchProfile()');assert.equal(run('TeacherProfile.teacher()'),false);assert.equal(run('tab'),'home');
console.log('PASS: Teacher profile routing, hidden modules/actions, non-performance save/reset rejection, PIN verification and Administrator return');
})().catch(e=>{console.error(e);process.exitCode=1});
