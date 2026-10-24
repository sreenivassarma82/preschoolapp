'use strict';
// Exact in-session identities avoid repeatedly serializing image bytes for comparisons.
// Images are still written in full to backups; these tokens are never persisted.
const LedgerPhotoIdentity=(()=>{const ids=new Map();return value=>{if(!ids.has(value))ids.set(value,ids.size+1);return ids.get(value);};})();

const SchoolYear=(()=>{
 function range(start){if(!Number.isInteger(start)||start<2000||start>2198)throw Error('Select a valid year.');return{start:start+'-04-01',end:(start+1)+'-03-31',label:start+'–'+(start+1)};}
 function academic(value){const m=/^(\d{4})\s*[-–/]\s*(\d{2}|\d{4})$/.exec(String(value||''));if(!m)return null;const start=Number(m[1]),end=m[2].length===2?(Number(m[2])===((start+1)%100)?start+1:NaN):Number(m[2]);if(end!==start+1||start<2000||start>2198)return null;return range(start);}
 return{range,academic};
})();
// Visible action feedback supplements inline messages without claiming unfinished work succeeded.
window.AppNotifications=(()=>{
 let timer;
 function show(message,kind='info'){if(!message||!document.createElement||!document.body)return;let box=document.querySelector('#appToast');if(!box){box=document.createElement('div');box.id='appToast';box.className='app-toast';box.setAttribute('role','status');box.setAttribute('aria-live','polite');box.setAttribute('aria-atomic','true');document.body.append(box);}const dialog=document.querySelector('dialog[open]'),host=dialog||document.body;if(box.parentElement!==host)host.append(box);box.textContent=String(message);box.dataset.kind=kind;box.hidden=false;Promise.resolve().then(()=>{if(box.hidden||document.querySelector('#appToast')!==box)return;const host=document.querySelector('dialog[open]')||document.body;if(box.parentElement!==host)host.append(box);});if(timer)clearTimeout(timer);timer=setTimeout(()=>{box.hidden=true;},kind==='error'?12000:7000);}
 function bind(){if(!document.addEventListener)return;document.addEventListener('click',event=>{const b=event.target?.closest?.('button,input[type="submit"],input[type="button"]');if(!b||b.disabled||b.closest('#appToast'))return;const label=(b.getAttribute('aria-label')||b.textContent||b.value||'Action').trim().replace(/\s+/g,' ');show(label.slice(0,160)+' selected.');},true);
  document.addEventListener('invalid',event=>{const input=event.target;show(input?.validationMessage||'Please complete the required fields.','error');},true);
  if(typeof MutationObserver==='function'&&document.body)new MutationObserver(records=>{let latest;for(const change of records){const node=change.target.nodeType===3?change.target.parentElement:change.target,field=node?.closest?.('[role="status"],#admissionNotice,#admissionFeedback');if(!field||field.isConnected===false||field.closest('#appToast')||field.id==='notice'||!/(Message|Notice|Feedback)$/.test(field.id||''))continue;const text=field.textContent?.trim();if(text)latest=text;}if(latest)show(latest,/(failed|not saved|unable|error|expired)/i.test(latest)?'error':'info');}).observe(document.body,{subtree:true,childList:true,characterData:true});
 }
 if(document.readyState==='loading'&&document.addEventListener)document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
 return{show};
})();
// Feedback is independent of the ledger modules, so a script failure is visible.
(()=>{
 const element=id=>document.querySelector('#'+id);
 function feedback(message){const field=element('admissionFeedback');if(field){field.textContent=message;field.hidden=false;}const dialog=element('editor');const box=element(dialog?.open?'admissionNotice':'notice');if(box){box.textContent=message;box.hidden=false;}}
 window.ledgerShowFailure=error=>feedback('Unable to save: '+(error?.message||String(error||'The app could not load.'))+' Refresh the app online if it does not respond.');
 window.ledgerSaveClick=()=>{
  feedback('Checking admission…');
  if(typeof window.submitAdmission!=='function'){feedback('The app files have not finished loading. Refresh online using the latest app link; your existing saved records are retained.');return;}
  try{return Promise.resolve(window.submitAdmission()).catch(window.ledgerShowFailure)}catch(error){window.ledgerShowFailure(error)}
 };
 window.ledgerExpenseSaveClick=()=>{const node=element('expenseMessage');if(node){node.textContent='Checking expense…';node.hidden=false;}const show=error=>{const message='Expense not saved: '+(error?.message||String(error));if(node)node.textContent=message;else feedback(message);};if(typeof window.submitPaidExpense!=='function'){show('App files have not finished loading. Refresh online; your draft has not been saved.');return;}try{return Promise.resolve(window.submitPaidExpense()).catch(show)}catch(error){show(error)}};
 if(typeof window.addEventListener==='function'){
  window.addEventListener('error',event=>{if(event.target?.tagName==='SCRIPT')feedback('An app file could not be loaded. Refresh online using the latest app link.');else if(event.error)window.ledgerShowFailure(event.error);},true);
  window.addEventListener('unhandledrejection',event=>window.ledgerShowFailure(event.reason));
 }
})();

// Browser-owned dialog headings cannot be branded; keep messages inside the app.
window.AppDialogs=(()=>{
 let active=null;
 const state=()=>{try{return typeof recordContent==='function'&&typeof data!=='undefined'&&data?recordContent(data):null;}catch{return null;}};
 function show(kind,message){if(active)return Promise.resolve(kind==='prompt'?null:kind==='confirm'?false:undefined);if(typeof document.createElement!=='function'||!document.body?.append){return Promise.resolve(kind==='confirm'?window.confirm(message):kind==='prompt'?window.prompt(message):window.alert(message));}return new Promise(resolve=>{const baseline=state(),dialog=document.createElement('dialog'),heading=document.createElement('h2'),text=document.createElement('p'),form=document.createElement('form'),input=document.createElement('input'),footer=document.createElement('footer'),cancel=document.createElement('button'),ok=document.createElement('button');dialog.className='app-message-dialog';dialog.setAttribute('aria-label','Your preschool App says');heading.textContent='Your preschool App says';text.textContent=typeof displayDateText==='function'?displayDateText(message):String(message);text.className='app-message-text';form.noValidate=true;input.type='text';input.setAttribute('aria-label','Your response');input.autocomplete='off';cancel.type='button';cancel.textContent='Cancel';ok.type='submit';ok.className='primary';ok.textContent='OK';let settled=false;const finish=value=>{if(settled)return;settled=true;if(value!==false&&value!==null&&kind!=='alert'&&state()!==baseline){value=kind==='prompt'?null:false;if(typeof notice==='function')notice('Records changed while the confirmation was open. Review the latest record and try again.');}active=null;if(dialog.open&&typeof dialog.close==='function')dialog.close();dialog.remove();resolve(value);};cancel.addEventListener('click',()=>finish(kind==='prompt'?null:false));form.addEventListener('submit',event=>{event.preventDefault();finish(kind==='prompt'?input.value:kind==='confirm'?true:undefined);});dialog.addEventListener('cancel',event=>{event.preventDefault();finish(kind==='prompt'?null:kind==='confirm'?false:undefined);});dialog.addEventListener('close',()=>finish(kind==='prompt'?null:kind==='confirm'?false:undefined));dialog.append(heading,text);if(kind==='prompt')form.append(input);if(kind!=='alert')footer.append(cancel);footer.append(ok);form.append(footer);dialog.append(form);document.body.append(dialog);active=dialog;if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');(kind==='prompt'?input:kind==='confirm'?cancel:ok).focus?.();});}
 return{confirm:message=>show('confirm',message),prompt:message=>show('prompt',message),alert:message=>show('alert',message)};
})();
