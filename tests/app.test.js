const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const {webcrypto}=require('node:crypto');
function boot(initial={}) {
 const data={...initial},elements=new Map();
 const element=id=>{if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',dataset:{},addEventListener(){},querySelectorAll(){return []}});return elements.get(id)};
 const context=vm.createContext({crypto:webcrypto,localStorage:{getItem:k=>data[k]??null,setItem:(k,v)=>data[k]=v},document:{querySelector:element,querySelectorAll:()=>[]},window:{addEventListener(){}},console,Date,setTimeout});
 vm.runInContext(fs.readFileSync('app.js','utf8'),context);
 return {data,context,run:code=>vm.runInContext(code,context)};
}
test('migration preserves the complete legacy manuscript and goal',()=>{const app=boot({museState:JSON.stringify({title:'Legacy',text:'Uno\n\ndue tre',goal:90000,genre:'Fantasy'})});const db=JSON.parse(app.data.museV2);assert.equal(db.projects[0].chapters[0].scenes[0].text,'Uno\n\ndue tre');assert.equal(db.projects[0].goal,90000);assert.equal(app.run('total()'),3);});
test('projects remain isolated and persist across reload',()=>{const app=boot();app.run("const second=project('Secondo','testo nuovo');db.projects.push(second);db.active=second.id;save()");const fresh=boot(app.data);assert.equal(fresh.run('current().title'),'Secondo');assert.equal(fresh.run('total()'),2);assert.equal(fresh.run('db.projects.length'),2);});
test('corrupted storage is preserved rather than overwritten',()=>{const app=boot({museV2:'{bad'});assert.equal(app.data.museV2,'{bad');assert.equal(app.run('loadError'),true);});
test('snapshot retains original and escapes imported markup',()=>{const app=boot();app.run("snapshot(scene());scene().text='changed'");assert.notEqual(app.run('current().history[0].text'),app.run('scene().text'));assert.equal(app.run("esc('<script>')"),'&lt;script&gt;');});
const handler=require('../archive/ai/editor');
async function call(body={},authorization='Bearer test') {let status=200,result;const res={setHeader(){},status(code){status=code;return this},json(value){result=value}};await handler({method:'POST',headers:{authorization},body},res);return {status,result};}
test('AI refuses unconfigured server, unauthorized clients and invalid input',async()=>{const old={...process.env};try{delete process.env.OPENAI_API_KEY;delete process.env.EDITOR_ACCESS_TOKEN;assert.equal((await call()).status,503);process.env.OPENAI_API_KEY='server-secret';process.env.EDITOR_ACCESS_TOKEN='test';assert.equal((await call({},'Bearer bad')).status,401);assert.equal((await call({mode:'bad',text:'text'})).status,400);}finally{process.env=old;}});
test('AI calls provider only server-side and prevents developmental replacement',async()=>{const old={...process.env},original=global.fetch;try{process.env.OPENAI_API_KEY='server-secret';process.env.EDITOR_ACCESS_TOKEN='test';global.fetch=async(url,options)=>{assert.equal(options.headers.Authorization,'Bearer server-secret');const body=JSON.parse(options.body);assert.equal(body.store,false);return {ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({analysis:'Diagnosi',replacement:'No'})}]}]})}};const result=await call({mode:'developmental',text:'manoscritto',context:{}});assert.equal(result.status,200);assert.equal(result.result.replacement,null);assert.equal(fs.readFileSync('app.js','utf8').includes('OPENAI_API_KEY'),false);}finally{global.fetch=original;process.env=old;}});
test('active interface has no AI credentials, controls or provider requests',()=>{const app=boot();for(const view of ['studio','muse','editor','continuity','publisher']){const html=app.run(`views.${view}()`);assert.equal(html.includes('data-ai='),false);assert.equal(html.includes('id="access"'),false);}assert.equal(app.run('typeof runAI'),'undefined');assert.equal(fs.readFileSync('app.js','utf8').includes("fetch('/api/editor'"),false);});
