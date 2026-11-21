/* THE FAR STOP'S FREEZE, PROFILED (WORLD THIRTEEN 11/21, row 661; records/BOHEMIA_WORLD_THIRTEEN_THE_MAP_ON_SIX_VALLEYS_11_21_26.md):
   the demo on a phone, the GPU canvas on, four valleys by REROLL at the far stop, sliding 6 s each; a CPU profile of the last four.
   node tools/bohemia_world_thirteen_far_freeze_probe.js */
const {open}=require('./bohemia_drive_the_demo.js');
(async()=>{const d=await open({keepCards:true,profile:'phone_portrait',gpu:true});const fr=d.fr;
for(let i=0;i<160;i++){if(await fr.evaluate(()=>!!(window.om&&om.n&&window.VBC)))break;await d.page.waitForTimeout(400);}
for(let i=0;i<20;i++){const t=await fr.evaluate(()=>!!(window.LOOP&&LOOP.frame&&LOOP.frame.style.display==='block')).catch(()=>false);if(!t&&i>6)break;if(t)await fr.evaluate(()=>loopClose()).catch(()=>{});await d.page.waitForTimeout(400);}
const cdp=d.cdp;await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:500});
const out=[];
for(let v=0;v<4;v++){
 if(v===3)await cdp.send('Profiler.start');
 const R=await fr.evaluate((v)=>new Promise(res=>{try{travelStop();}catch(e){}if(v)document.getElementById('reroll').click();setZoomAt(zoomBounds()[0]);try{camHold();}catch(e){}const N=om.n;city.x=N/2;city.y=N/2;
  const t0=performance.now();let last=t0;const f=[];const step=(t)=>{f.push(Math.round(t-last));last=t;city.x+=0.4;city.y+=0.2;try{camHold();}catch(e){}const r0=performance.now();render();const rd=performance.now()-r0;if(rd>300)f.push('R'+Math.round(rd));if(t-t0<6000)requestAnimationFrame(step);else res({v,frames:f.filter(x=>typeof x==='string'||x>300).slice(0,10),n:f.length});};requestAnimationFrame(step);}),v);
 out.push(R);}
const {profile}=await cdp.send('Profiler.stop');
const byId={};profile.nodes.forEach(n=>byId[n.id]=n);const memo={};const sub=(id)=>{if(memo[id]!=null)return memo[id];const n=byId[id];let s=n.hitCount||0;(n.children||[]).forEach(c=>s+=sub(c));return memo[id]=s;};
let tot=0;profile.nodes.forEach(n=>tot+=n.hitCount||0);const inc={},self={};
profile.nodes.forEach(n=>{const k=(n.callFrame.functionName||'(anon)')+':'+n.callFrame.lineNumber;inc[k]=Math.max(inc[k]||0,sub(n.id));self[k]=(self[k]||0)+(n.hitCount||0);});
console.log(JSON.stringify(out));console.log('samples',tot);
console.log('SELF',Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,12).map(([k,v])=>k+' '+(v/tot*100).toFixed(1)+'%').join(' | '));
console.log('INCL',Object.entries(inc).sort((a,b)=>b[1]-a[1]).slice(0,35).map(([k,v])=>k+' '+(v/tot*100).toFixed(1)+'%').join(' | '));
await d.close();})().catch(e=>{console.error(e);process.exit(1);});
