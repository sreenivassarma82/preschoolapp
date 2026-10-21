'use strict';
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
