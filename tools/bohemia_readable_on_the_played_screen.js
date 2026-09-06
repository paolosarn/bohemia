/* ============================================================================
   READABLE ON THE SCREEN YOU PLAY ON (9/6/26, UI lane 11) -- [eyes: faint chips].

   The lane's ratchet measures with the MORNING CARD UP, which is the right screen
   for "what does a player land on" and the wrong one for "can he read his controls":
   a full-screen scrim drags every chip underneath it to ~1.1 and buries the real
   failures in a crowd of dimmed ones. EYES said as much in the row itself ("with
   both cards dismissed 7 of 13 are still under it"). This measures THAT state --
   both cards answered, nothing on top, the screen you stand on while you play.

   Prints two numbers per control: the letters (ink against paper, split at the
   midpoint of the box's own range) and the box (the darkest tenth against the
   lightest tenth, which is what the ruler used to do). Where they disagree, the
   letters are the reader.

     node tools/bohemia_readable_on_the_played_screen.js
   ========================================================================== */
const http=require('http'),fs=require('fs'),path=require('path');
let chromium; try{ chromium=require('/opt/node22/lib/node_modules/playwright').chromium; }catch(e){ chromium=require('playwright').chromium; }
const ROOT='/home/user/bohemia',SLICES=path.join(ROOT,'slices'),PORT=8831;
const OUT='/tmp/claude-0/-home-user-bohemia/b2a624b2-eb60-57a9-8c75-28b9d7b0be83/scratchpad';
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webmanifest':'application/manifest+json'};
function serve(){return new Promise(r=>{const s=http.createServer((rq,rs)=>{const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,'');const f=path.join(SLICES,rel);if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}rs.setHeader('content-type',T[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(rs);});s.listen(PORT,'127.0.0.1',()=>r(s));});}
const city=p=>p.frames().find(f=>/CITY_WORLD/.test(f.url()));
(async()=>{const srv=await serve();const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();
await p.goto(`http://127.0.0.1:${PORT}/BOHEMIA_DEMO.html`,{waitUntil:'load',timeout:120000});
await p.waitForTimeout(1200); await p.mouse.click(195,509);
let c=null; for(let i=0;i<200;i++){ c=city(p); if(c){ try{ if(await c.evaluate(()=>!!window.BOHEMIA_FORETOLD)) break; }catch(e){} } await p.waitForTimeout(250); }
await p.waitForTimeout(2500);
// dismiss everything on top, the way a player does
await p.evaluate(()=>{ const n=document.getElementById('openNot'); if(n) n.click(); });
await c.evaluate(()=>{ try{ cardHide(); }catch(e){} });
await p.waitForTimeout(1200);
await p.screenshot({path:OUT+'/contrast-clean.png'});
// the boxes we care about: every visible text chip in the city
const boxes = await c.evaluate(()=>{
  const out=[];
  document.querySelectorAll('*').forEach(e=>{
    const cs=getComputedStyle(e);
    if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0) return;
    const r=e.getBoundingClientRect();
    if(r.width<6||r.height<6) return;
    if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth) return;
    let own=''; for(const n of e.childNodes) if(n.nodeType===3) own+=n.nodeValue;
    if(!own.trim()) return;
    const fr=window.frameElement?window.frameElement.getBoundingClientRect():{left:0,top:0};
    out.push({id:e.id||('.'+String(e.className).slice(0,16)), t:own.trim().slice(0,20),
      px:parseFloat(cs.fontSize)||0,
      x:Math.round(r.left+fr.left), y:Math.round(r.top+fr.top),
      w:Math.round(r.width), h:Math.round(r.height)});
  });
  return out;
});
const { PNG } = (()=>{ try { return require('/opt/node22/lib/node_modules/pngjs'); } catch(e){ return {}; } })();
if(!PNG){ console.log('no pngjs; boxes found: '+boxes.length); await b.close(); srv.close(); return; }
const png = PNG.sync.read(fs.readFileSync(OUT+'/contrast-clean.png'));
const S=2; // deviceScaleFactor
const lum=(r,g,bl)=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
  return 0.2126*f(r)+0.7152*f(g)+0.0722*f(bl);};
const rows=[];
for(const bx of boxes){
  const x0=bx.x*S, y0=bx.y*S, w=bx.w*S, h=bx.h*S;
  if(x0<0||y0<0||x0+w>png.width||y0+h>png.height) continue;
  const ls=[];
  for(let y=y0;y<y0+h;y++) for(let x=x0;x<x0+w;x++){
    const i=(png.width*y+x)<<2;
    ls.push(lum(png.data[i],png.data[i+1],png.data[i+2]));
  }
  if(ls.length<20) continue;
  ls.sort((a,b)=>a-b);
  // DECILE (the shipped method) vs TWO-CLUSTER (ink and paper as a reader sees them)
  const dec=(ls[Math.floor(ls.length*0.95)]+0.05)/(ls[Math.floor(ls.length*0.05)]+0.05);
  const lo=ls[0], hi=ls[ls.length-1], mid=(lo+hi)/2;
  let sa=0,na=0,sb=0,nb=0;
  for(const v of ls){ if(v<mid){sa+=v;na++;} else {sb+=v;nb++;} }
  const cr=(na&&nb)?((sb/nb)+0.05)/((sa/na)+0.05):dec;
  const floor=bx.px>=24?3.0:4.5;
  rows.push({...bx, cr:+cr.toFixed(2), dec:+dec.toFixed(2), floor, bad:cr<floor});
}
rows.sort((a,b)=>a.cr-b.cr);
const bad=rows.filter(r=>r.bad);
const decBad=rows.filter(r=>r.dec<r.floor);
console.log(`MEASURING THE LETTERS: ${bad.length} of ${rows.length} under the floor`);
console.log(`MEASURING THE BOX (the shipped method): ${decBad.length} of ${rows.length} under the floor`);
console.log('\n  letters  box      needs  size  control');
rows.slice(0,14).forEach(r=>console.log(
  `  ${String(r.cr).padStart(6)}  ${String(r.dec).padStart(6)}   ${r.floor}   ${String(r.px)}px  ${r.id}  "${r.t}"${r.bad?'   <-- REALLY UNREADABLE':''}`));
await b.close();srv.close();})();
