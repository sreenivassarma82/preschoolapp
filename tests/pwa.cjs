const fs=require('fs'),vm=require('vm'),assert=require('assert');
const handlers={},puts=[],deleted=[];const scope='https://school.example/preschoolapp/';let online=true;
const cached={offline:true};const cache={addAll:async urls=>{for(const request of urls){assert(request.url.startsWith(scope));assert.equal(request.cache,'reload');}},put:async key=>puts.push(typeof key==='string'?key:key.url),match:async key=>{assert(String(key.url||key).startsWith(scope));return cached}};
const sandbox={URL,Request,Set,Promise,self:{registration:{scope},location:{origin:'https://school.example'},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(type,fn)=>handlers[type]=fn},caches:{open:async()=>cache,keys:async()=>['unrelated-cache','little-ledger-shell-'+encodeURIComponent('/preschoolapp/')+'-v0'],delete:async key=>deleted.push(key)},fetch:async()=>{if(!online)throw Error('offline');return {ok:true,type:'basic',clone(){return this}}}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..','sw.js'),'utf8'),sandbox);
async function dispatch(url,mode='cors',method='GET'){let promise;handlers.fetch({request:{url,mode,method},respondWith:p=>promise=p});return promise?await promise:null;}
(async()=>{let life;handlers.install({waitUntil:p=>life=p});await life;handlers.activate({waitUntil:p=>life=p});await life;assert.equal(deleted.length,1);assert(!deleted.includes('unrelated-cache'));
 await dispatch(scope+'app.js');assert(puts.includes(scope+'app.js'));
 await dispatch(scope+'app.js?v=r19');assert.equal(puts.at(-1),scope+'app.js');const count=puts.length;await dispatch(scope+'?code=secret&state=test','navigate');assert.equal(puts.length,count);
 assert.equal(await dispatch('https://graph.microsoft.com/v1.0/me/drive'),null);
 assert.equal(await dispatch(scope+'preschool-records.json'),null);
 assert.equal(await dispatch(scope+'app.js?token=secret'),null);
 assert.equal(await dispatch(scope+'app.js','cors','POST'),null);
 online=false;assert.equal(await dispatch(scope+'app.js?v=r19'),cached);assert.equal(await dispatch(scope,'navigate'),cached);assert.equal(await dispatch(scope+'style.css'),cached);
 // Simulate the install prompt lifecycle without a browser.
 const events={},button={hidden:true,disabled:false,addEventListener:(k,f)=>events.click=f},status={hidden:true,textContent:''};let registered,prompted=false;
 const ui={console,document:{getElementById:id=>id==='installApp'?button:status},navigator:{onLine:true,serviceWorker:{register:async(...a)=>registered=a}},window:{isSecureContext:true,matchMedia:()=>({matches:false}),addEventListener:(k,f)=>events[k]=f}};
 vm.createContext(ui);vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..','pwa.js'),'utf8'),ui);events.load();assert.deepEqual(registered,['./sw.js',{scope:'./',updateViaCache:'none'}]);events.beforeinstallprompt({preventDefault(){},prompt:async()=>{prompted=true},userChoice:Promise.resolve({outcome:'accepted'})});assert.equal(button.hidden,false);await events.click();assert(prompted);assert(button.hidden);ui.navigator.onLine=false;events.offline();assert.equal(status.hidden,false);assert(status.textContent.includes('OneDrive'));
 console.log('PASS: repository subpath, install UI, offline shell, cache isolation, and no caching of records/OAuth/Microsoft requests');
})().catch(e=>{console.error(e);process.exitCode=1});
