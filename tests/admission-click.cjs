const fs=require('fs'),vm=require('vm'),assert=require('assert'),{webcrypto}=require('crypto');
const mem=()=>{const m=new Map();return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}};
function setup(){const els=new Map();const el=s=>{if(!els.has(s))els.set(s,{textContent:'',innerHTML:'',value:'',events:{},addEventListener(k,f){this.events[k]=f},classList:{toggle(){}},scrollIntoView(){}});return els.get(s)};const x={console,crypto:webcrypto,Blob,TextEncoder,Uint8Array,DataView,URL,URLSearchParams,Intl,structuredClone,setTimeout:()=>1,localStorage:mem(),sessionStorage:mem(),location:{origin:'https://school.example',pathname:'/preschoolapp/',search:'',hash:'',protocol:'https:',hostname:'school.example',assign(v){this.assigned=v}},history:{replaceState(){}},btoa:s=>Buffer.from(s,'binary').toString('base64'),alert(){},confirm:()=>true,FormData:class{constructor(o){this.o=o}get(k){return this.o[k]}},document:{querySelector:el,querySelectorAll:()=>[],activeElement:null},indexedDB:{open(){throw Error('Unavailable')}}};x.window=x;vm.createContext(x);for(const f of ['bootstrap.js','cloud.js','history.js','excel.js','admin.js','admin-ui.js','performance.js','performance-ui.js','marksheet-export.js','school-documents.js','navigation.js','admissions.js','app.js'])vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..',f),'utf8'),x);return{x,el,run:s=>vm.runInContext(s,x),submit:async(s,o)=>el(s).events.submit({preventDefault(){},target:o})}}


(async()=>{const {x,el,run}=setup();await Promise.resolve();
el('#editor').showModal=()=>el('#editor').open=true;el('#editor').close=()=>el('#editor').open=false;
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
assert.match(html,/<form id="studentForm" novalidate>/);
const click=html.match(/id="saveAdmissionButton"[^>]*onclick="([^"]+)"/)[1];
assert.match(html,/id="saveAdmissionButton" type="button"/);
const form=el('#studentForm');Object.assign(form,{branchId:run('Admin.MAIN'),first:'Click Student',gender:'Male',class:'Playgroup',date:'2026-10-10',discount:'0',mobile:'0123',photoFile:null});
run('openStudent()');
form.elements=[{name:'mobile',checkValidity:()=>false,validationMessage:'Please enter a phone number.'}];
await run(click);assert.match(el('#admissionFeedback').textContent,/phone number/);assert.equal(run('data.students.length'),0);
form.elements=[];
await run(click);for(let i=0;i<40&&run('data.students.length')===0;i++)await Promise.resolve();
assert.equal(run('data.students.length'),1);assert.match(el('#notice').textContent,/Admission saved/);
const handler=x.submitAdmission;x.submitAdmission=undefined;await run(click);assert.match(el('#admissionFeedback').textContent,/not finished loading/);
x.submitAdmission=()=>{throw Error('Unexpected test failure')};await run(click);assert.match(el('#admissionFeedback').textContent,/Unexpected test failure/);
x.submitAdmission=handler;
console.log('PASS: actual Save button onclick, visible validation, success and module failure feedback');
})().catch(e=>{console.error(e);process.exitCode=1});
