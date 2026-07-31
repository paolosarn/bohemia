/* THE PROOF SHOT, THROUGH THE ALPHA (7/31, PEOPLE lane).
   people_gate.js posts a SYNTHETIC cast (flat colours) because its portrait
   assertion needs faces it can tell apart by pixel. That is correct for the
   gate and WRONG for a picture Paolo looks at: the face in it is not his art.
   VERIFY ON THE REAL SURFACE (7/18) means the surface HE sees, so this opens the
   real alpha, taps the real RUN tab, waits for the alpha to bake and post its
   real cast, walks up to a real neighbour and shoots the card with the real
   face on it. Slow on purpose; it is a ship artifact, not a gate.
     node tools/bohemia_people_proof.js [outfile] */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'slices/BOHEMIA_PEOPLE_CARD_ALPHA_7_31_26.png');
function pw(){ for (const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules'])
  { try { return require(path.join(g,'playwright')); } catch(_e){} } return require('playwright'); }
function route(pass2d, from, to, stops){
  const H=pass2d.length, W=pass2d[0].length, key=(x,y)=>x+','+y;
  const prev={}, seen={[key(from[0],from[1])]:true}; let q=[from];
  while(q.length){ const c=q.shift(); if(c[0]===to[0]&&c[1]===to[1]) break;
    for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=c[0]+d[0], ny=c[1]+d[1], k=key(nx,ny);
      if(nx<0||ny<0||nx>=W||ny>=H||seen[k]||!pass2d[ny][nx]) continue;
      seen[k]=true; prev[k]=c;
      if(stops&&stops[k]!=null&&!(nx===to[0]&&ny===to[1])) continue; q.push([nx,ny]); } }
  if(!seen[key(to[0],to[1])]) return null;
  const steps=[]; let c=to;
  while(!(c[0]===from[0]&&c[1]===from[1])){ const p=prev[key(c[0],c[1])]; if(!p) return null;
    steps.unshift([c[0]-p[0],c[1]-p[1]]); c=p; }
  return steps;
}
(async () => {
  const { chromium } = pw();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{width:390,height:844} });
  page.on('pageerror', e => console.log('PAGEERROR ' + e.message));
  await page.goto('file://' + path.join(ROOT,'slices/BOHEMIA_ALPHA_0_9.html'));
  await page.click('#front');                 /* TAP TO ENTER */
  await page.waitForTimeout(400);
  await page.click('.tab[data-p=run]');           /* loads the frame */
  /* and show its panel through the alpha's OWN switcher: a tap can land while
     another panel is still coming up, and the shot has to be of the RUN tab. */
  await page.evaluate(() => showTabPanel('run'));
  const fr = await (await page.waitForSelector('#runFrame', { state: 'attached' })).contentFrame();
  await fr.waitForFunction(() => window.__RUN_READY === true, null, { timeout:120000 });
  /* the alpha bakes its cast lazily; wait for the run to actually receive it */
  await fr.waitForFunction(() => { const c = window.__RUN.cast(); return c && c.npcPortraits > 0; },
                           null, { timeout:180000 });
  console.log('cast in:', JSON.stringify(await fr.evaluate(() => window.__RUN.cast())));
  const tap = d => fr.click(d[0]===1?'#br':d[0]===-1?'#bl':d[1]===1?'#bd':'#bu');
  const inr = await fr.evaluate(() => window.__RUN.interior());
  let st = await fr.evaluate(() => window.__RUN.state());
  const outSteps = route(inr.pass, [st.px,st.py], inr.door, null);
  for (let i=0;i<outSteps.length;i++){
    if (i===outSteps.length-1){ for(let k=0;k<14;k++){ await tap(outSteps[i]);
      if((await fr.evaluate(()=>window.__RUN.state())).mode!=='int') break; await page.waitForTimeout(120);} }
    else await tap(outSteps[i]);
  }
  const g = await fr.evaluate(() => window.__RUN.grid());
  st = await fr.evaluate(() => window.__RUN.state());
  const pl = await fr.evaluate(() => window.__RUN.people());
  const cands = pl.people.filter(p=>p.outside)
    .map(p=>({p,d:Math.abs(p.x-st.px)+Math.abs(p.y-st.py)})).sort((a,b)=>a.d-b.d);
  let got = null;
  for (const c of cands.slice(0,3)) {
    for (let guard=0; guard<240 && !got; guard++){
      const s = await fr.evaluate(()=>window.__RUN.state());
      const now = (await fr.evaluate(()=>window.__RUN.people())).people.find(x=>x.key===c.p.key);
      if(!now||!now.outside) break;
      if(Math.abs(now.x-s.px)+Math.abs(now.y-s.py)===1){ await tap([now.x-s.px,now.y-s.py]); got=now; break; }
      const r = route(g.pass,[s.px,s.py],[now.x,now.y],g.doorOf); if(!r||!r.length) break;
      await tap(r[0]);
    }
    if (got) break;
  }
  if(!got){ console.log('never reached anybody'); await browser.close(); process.exit(1); }
  console.log('walked up to:', got.heading, got.seat, '| look', got.lookSeed % pl.looks);
  await fr.click('#act');
  await page.waitForTimeout(250);
  await page.screenshot({ path: OUT });
  console.log('wrote ' + path.relative(ROOT, OUT));
  await browser.close();
})().catch(e => { console.log('proof failed: ' + (e&&e.stack||e)); process.exit(1); });
