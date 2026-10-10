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
 if(typeof window.addEventListener==='function'){
  window.addEventListener('error',event=>{if(event.target?.tagName==='SCRIPT')feedback('An app file could not be loaded. Refresh online using the latest app link.');else if(event.error)window.ledgerShowFailure(event.error);},true);
  window.addEventListener('unhandledrejection',event=>window.ledgerShowFailure(event.reason));
 }
})();
