/* ============================================================================
   ONE NUMBER (9/5/26, UI lane) -- board row [one number], BB-ONE-NUMBER.

   THIS ROW IS A GUARD, NOT A BUILD, AND THE BACKLOG SAYS SO IN ITS FIRST LINE:
   "WE ALREADY GOT THIS RIGHT AND IT IS UNDEFENDED, WHICH IS HOW IT WILL GET LOST."

   THE COLLISION IT DEFENDS. His two named tactical references answer "how much do
   you show?" in opposite directions and both are locked. BATTLE BROTHERS SHOWS THE
   MATH -- hover an enemy and read the hit chance, attack minus defence, +10% uphill.
   ROGUE FABLE 4 does the opposite, "deliberately free of stat and formula bloat".
   And his own line sits on the RF4 side: "spreadsheet simulators and I'm not a fan."
   The answer already built is THE WORLD IN WORDS AND EXACTLY ONE NUMBER, and the
   number is not the one the other game shows: theirs answers "what is my best move?"
   and ours answers "HOW MUCH TROUBLE AM I IN?" One is an efficiency display, ours is
   a danger display, and a danger display makes the player MOVE.

   SO THE RISK IS NOT THAT WE SHOW TOO MUCH TODAY. IT IS THAT SOMEBODY ADDS A SECOND
   NUMBER. One number is a reading; two numbers is a COMPARISON, and a comparison
   invites optimisation -- the moment a player weighs "he hits me 62%" against "I hit
   him 71%", the turn stops being about ground and becomes a sum. The backlog names
   six live candidates for that second number: the heat budget, the standing web, the
   circuit owner, who you owe, BB-WHY and the act buildup.

   MEASURED ON THE REAL FIGHT SCREEN THE DAY THIS WAS WRITTEN:
       "DARK . LONG RANGE . his dial: EASY . he hits you 0%"
   Four chunks, almost all words, one number, and the number is his chance on you.
   Working memory holds about four chunks of novel information and a chunk is bigger
   for an expert, so a line made of words the player recognises grows with them.

   WHAT THIS GATE HOLDS, and each leg is a way the line could be lost:
     1. the readout exists and fills when you have a target (a line nobody sees is
        the defect this lane has now found four times);
     2. it carries EXACTLY ONE number, checked against every enemy on the board, not
        against one lucky sample;
     3. that number is HIS CHANCE ON YOU -- the words "he hits you" sit immediately
        before it, so a danger display cannot quietly become an efficiency one;
     4. no second number and no rival reading anywhere on it;
     5. and it is still mostly WORDS.
   ============================================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.dirname(__dirname), SLICES = path.join(ROOT, 'slices'), PORT = 8797;
let pass = 0, fail = 0;
const ok = (m, g) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m); };
const done = () => { console.log('\nONE NUMBER: ' + pass + ' ok, ' + fail + ' failed');
                     process.exit(fail ? 1 : 0); };
const TYPE = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.woff2':'font/woff2' };
function serve(){ return new Promise(r=>{ const s=http.createServer((rq,rs)=>{
  const rel=decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/,''); const f=path.join(SLICES,rel);
  if(!f.startsWith(SLICES)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.statusCode=404;return rs.end('no');}
  rs.setHeader('content-type',TYPE[path.extname(f)]||'application/octet-stream');
  fs.createReadStream(f).pipe(rs); }); s.listen(PORT,'127.0.0.1',()=>r(s)); }); }

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { try { chromium = require('playwright').chromium; } catch (e2) { ok('playwright available', false); done(); } }
  const srv = await serve();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0,130)));
  await p.goto('http://127.0.0.1:'+PORT+'/BOHEMIA_DEMO.html',{waitUntil:'load',timeout:120000});
  await p.waitForTimeout(1100);
  const tap = await p.evaluate(() => { const n=[...document.querySelectorAll('*')]
    .filter(x=>/TAP TO ENTER/i.test(x.textContent||'')&&x.children.length<4).pop();
    if(!n) return null; const r=n.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; });
  if(!tap){ ok('the demo opens', false); await b.close(); srv.close(); done(); }
  await p.mouse.click(tap.x,tap.y); await p.waitForTimeout(5500);

  /* THE FIGHT IS BUILT LAZILY, which is correct -- 1.3 MB of it should not load for
     somebody who never fights. This is the shell's own function, not a back door. */
  await p.evaluate(() => { try { if (typeof ensureCombatFrame === 'function') ensureCombatFrame(); } catch(e) {} });
  await p.waitForTimeout(6000);
  const cf = p.frames().find(f => /srcdoc/.test(f.url()));
  ok('the fight loads on the demo at all', !!cf);
  if (!cf) { await b.close(); srv.close(); done(); }

  const shape = await cf.evaluate(() => ({
    line: !!document.getElementById('rangeread'),
    upd: typeof updRangeRead === 'function',
    enemies: (typeof G !== 'undefined' && G.e) ? G.e.length : 0
  }));
  ok('the fight readout line exists on the screen', shape.line);
  ok('and there are enemies to read (' + shape.enemies + ')', shape.enemies > 0);

  /* EVERY ENEMY ON THE BOARD, not one lucky sample: a second number could easily be
     conditional (elite only, dark only, high ground only), and a gate that checked one
     target would miss exactly the case somebody added it for. */
  const reads = await cf.evaluate(() => {
    const out = [];
    const keep = G.fireTarget;
    for (let i = 0; i < (G.e || []).length; i++) {
      if (!G.e[i] || G.e[i].dead) continue;
      G.fireTarget = i; updRangeRead();
      const r = document.getElementById('rangeread');
      const txt = (r.textContent || '').trim();
      out.push({ i: i, txt: txt,
                 nums: txt.match(/\d+(?:\.\d+)?/g) || [],
                 html: r.innerHTML });
    }
    G.fireTarget = keep; updRangeRead();
    return out;
  });
  ok('the line FILLS when you have a target -- a readout nobody sees is the defect '
     + 'this lane has now found four times', reads.length > 0 && reads.every(r => r.txt.length > 0));

  const worst = reads.filter(r => r.nums.length !== 1);
  ok('EXACTLY ONE NUMBER on the line, for every enemy on the board ('
     + reads.length + ' checked)'
     + (worst.length ? ' -- ' + worst.length + ' carry ' + JSON.stringify(worst[0].nums)
        + ': "' + worst[0].txt + '"' : ''),
     reads.length > 0 && worst.length === 0);

  const notDanger = reads.filter(r => !/he hits you\s*$/i.test(r.txt.split(/\d/)[0].trim()));
  ok('and that number is HIS CHANCE ON YOU -- "he hits you" sits immediately before '
     + 'it, so a danger display cannot quietly become an efficiency one'
     + (notDanger.length ? ' -- "' + notDanger[0].txt + '"' : ''),
     reads.length > 0 && notDanger.length === 0);

  const rival = reads.filter(r => /you hit|your chance|to hit him|hit chance/i.test(r.txt));
  ok('and there is no rival reading on it -- two numbers is a COMPARISON and a '
     + 'comparison invites optimisation', rival.length === 0);

  /* STILL MOSTLY WORDS. The backlog's own reasoning: working memory holds about four
     chunks, and a line of words the player recognises grows with them where a line of
     figures does not. */
  const wordy = reads.every(r => {
    const words = (r.txt.match(/[A-Za-z]+/g) || []).length;
    return words >= 6;
  });
  ok('and the rest of the line is WORDS, not figures (' + ((reads[0] &&
      (reads[0].txt.match(/[A-Za-z]+/g) || []).length) || 0) + ' words on it)', wordy);

  console.log('\n         the line, as it reads right now:');
  console.log('         "' + (reads[0] ? reads[0].txt : '(nothing)') + '"');

  ok('no page error while doing any of it' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  await b.close(); srv.close(); done();
})();
