'use strict';
const navGroups={students:[['summary','Overview'],['students','Admissions'],['parents','Parents & contacts'],['fees','Fees & payments'],['reports','Reports'],['performance','Performance'],['certificates','Bonafide certificate']],staff:[['staff','Salary & transactions'],['attendance','Attendance']],admin:[['branches','Branch master'],['staffmaster','Staff master'],['settings','Year, fees & storage'],['subjects','Subjects per class'],['history','Activity history']]};
function groupForTab(t){return Object.keys(navGroups).find(k=>navGroups[k].some(([id])=>id===t))||'students';}
function renderNavigation(){const group=groupForTab(tab);$('#nav').innerHTML=Object.keys(navGroups).map(k=>`<button data-group="${k}" class="${k===group?'active':''}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('');$('#subnav').innerHTML=navGroups[group].map(([id,title])=>`<button data-tab="${id}" class="${id===tab?'active':''}">${title}</button>`).join('');}
function navigateTo(t){tab=t;if(t==='staff')adminSection='salary';if(t==='staffmaster')adminSection='master';activity('Tab viewed',t);search='';statusFilter='';render();}

let navigationRestoring=false,navigationReady=false,navigationIndex=0,navigationKey='';
function navigationState(){return{ledgerNavigation:true,index:navigationIndex,tab,year,branchId,classFilter,overviewAll,performanceStudent:tab==='performance'?performanceStudent:'',adminSection,branchEditing:tab==='branches'?branchEditing:'',staffEditing:tab==='staffmaster'?staffEditing:''};}
function navigationPageKey(state){return [state.tab,state.performanceStudent,state.adminSection==='transactions'&&state.tab==='staff'?'transactions':'',state.branchEditing,state.staffEditing].join('|');}
function trackNavigation(){
 const back=$('#appBack'),home=$('#appHome');if(back)back.onclick=appGoBack;if(home)home.onclick=()=>navigateTo('summary');
 if(typeof history.pushState!=='function')return;
 const state=navigationState(),key=navigationPageKey(state);
 if(!navigationReady){navigationReady=true;navigationIndex=0;state.index=0;navigationKey=key;history.replaceState(state,'');}
 else if(!navigationRestoring){if(key!==navigationKey){navigationIndex++;state.index=navigationIndex;history.pushState(state,'');}else history.replaceState(state,'');navigationKey=key;}
 if(back)back.disabled=navigationIndex===0;if(home)home.disabled=tab==='summary';
}
function appGoBack(){if($('#editor')?.open){if(!admissionSaving)$('#editor').close();return;}if($('#paymentDialog')?.open){$('#paymentDialog').close();return;}if(history.state?.ledgerNavigation&&history.state.index>0&&typeof history.back==='function')history.back();else navigateTo('summary');}
function restoreNavigation(state){if(!state?.ledgerNavigation)return;navigationRestoring=true;try{
 for(const id of ['editor','paymentDialog','cloudFolderPicker'])if($('#'+id)?.open)$('#'+id).close();
 tab=Object.values(navGroups).flat().some(([id])=>id===state.tab)?state.tab:'summary';year=data.years[state.year]?state.year:Object.keys(data.years).sort().at(-1);branchId=data.branches.some(b=>b.id===state.branchId)?state.branchId:data.branches[0].id;classFilter=classes.includes(state.classFilter)?state.classFilter:'';overviewAll=!!state.overviewAll;performanceStudent=state.performanceStudent||'';adminSection=state.adminSection||'salary';branchEditing=state.branchEditing||'';staffEditing=state.staffEditing||'';certificatePreview='';subjectDraftKey='';search='';statusFilter='';navigationIndex=state.index||0;navigationKey=navigationPageKey(state);render();
 }finally{navigationRestoring=false;}}
if(typeof window.addEventListener==='function')window.addEventListener('popstate',event=>restoreNavigation(event.state));
