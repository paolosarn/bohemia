const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ===== COMBAT RUNS: THE GATE THAT WOULD HAVE CAUGHT THE BLACK SCREEN =====
   Paolo, 8/2, with a screenshot of a black screen and one red line:
     ERR ReferenceError: Cannot access 'DIAL_GONE' before initialization.
   620 combat checks were green when that shipped. The suite runs
   `node --check` on every script body in the demo, which proves the file
   PARSES -- and a temporal dead zone error is perfectly valid syntax. It
   proves nothing about whether the thing RUNS.
   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and "the demo renders a
   frame without throwing" had no gate at all. Ten versions of drawing work
   in this lane and nobody was checking that draw() survives being called.
   THIS BOOTS THE REAL ALPHA, opens the real combat tab, and drives real
   frames through every phase the dial has -- cover, AIM (the path that
   threw), the killshot, the freeze, and after -- failing on ANY pageerror
   or console error. Verified against the broken build: it catches it. */
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:430,height:900},deviceScaleFactor:2});
  const errs=[];
  p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));
  p.on('console',m=>{ if(m.type()==='error'){ const t=m.text();
    if(!/ERR_CONNECTION|clipboard-write|Failed to load resource/.test(t)) errs.push('CONSOLE '+t); }});
  const path=require('path');
  const TARGET=path.resolve(process.argv[2]||'slices/BOHEMIA_ALPHA_0_9.html');
  await p.goto('file://'+TARGET,{waitUntil:'load',timeout:120000});
  await SETTLE(p, 9000);
  await p.mouse.click(215,450); await SETTLE(p, 2500);
  await p.mouse.click(215,450); await SETTLE(p, 2500);
  await p.evaluate(()=>{const t=document.querySelector('[data-p="combat"]');if(!t) throw new Error('that tab is not in the bar'); t.click();});
  await SETTLE(p, 7000);
  const f=p.frames().find(x=>x.name()==='combatFrame');
  if(!f){ console.log(JSON.stringify({ok:false,why:'no combatFrame',errs})); await b.close(); return; }
  const box=await (await p.$('#p-combat')).boundingBox();
  await p.mouse.click(box.x+box.width/2,box.y+box.height/2);
  await SETTLE(p, 5000);
  // drive REAL frames through every phase the dial has
  const R=await f.evaluate(async()=>{
    const O={frames:0};
    setupCombat();
    if(G.e[0]){G.e[0].ea=0;G.e[0].edist=6;G.e[0].gcov=0;}
    G.phase='cover'; G.fireTarget=0; G.popTarget=0;
    await new Promise(r=>setTimeout(r,500));       // cover phase frames
    doPop();
    await new Promise(r=>setTimeout(r,600));       // AIM phase frames  <-- the TDZ path
    O.phase=G.phase;
    let t=0; while(!G.ks&&t++<10){ G.angle=0; G._angVel=0.01; fireNow();
      if(!G.ks) await new Promise(r=>setTimeout(r,120)); }
    O.ks=!!G.ks;
    await new Promise(r=>setTimeout(r,2200));      // killshot + freeze + after
    O.after=G.phase;
    return O;
  });
  R.errs=errs; R.ok=errs.length===0;
  await b.close();
  const uniq=[...new Set(errs.map(e=>e.split('\n')[0]))];
  if(errs.length){
    console.log('=== COMBAT RUNS SMOKE: FAILED ===');
    for(const e of uniq.slice(0,8)) console.log('  FAIL  '+e);
    console.log('  ('+errs.length+' errors, '+uniq.length+' distinct) phase='+R.phase+' ks='+R.ks);
  } else {
    console.log('=== COMBAT RUNS SMOKE: 1 passed, 0 failed ===');
    console.log('  the demo booted, opened combat, and drove real frames through cover -> AIM -> killshot -> freeze with zero errors (phase '+R.phase+', ks '+R.ks+')');
  }
  process.exit(errs.length?1:0);
})();
