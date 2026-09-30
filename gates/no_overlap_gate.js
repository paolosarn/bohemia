/* ============================================================================
   NO OVERLAP -- NO TWO TEXTS ON TOP OF EACH OTHER, AND NO TEXT CUT OFF BY A PANEL
   (PLUMBER 9/30/26, row [no overlap], rule 44c)

   PAOLO 9/29: "for the demo bro you gotta keep in mind when texts are overlapping each
   other. I don't know why it's so fucking difficult for you to understand when text is
   overlapping each other." His screenshot: the quest line at the top ran under the phone.

   THE INSTRUMENT is tools/bohemia_text_overlap.js, through the one driver, at phone size:
   every visible DOM text (shell and frames) and every text drawn on an on-page canvas,
   refused when two cross, or when a text is PARTLY under something that paints (a text
   wholly under a whole-screen cover, like the loading screen over the game, is not on
   screen at all and is not counted).

   LEGS
     S1-S13 SELF-TEST on a planted page, both ways: two crossing texts are caught; a text
            partly under an opaque panel is caught; a text wholly under a full-screen
            cover is NOT counted; a transparent overlay is NOT a panel; a label that lets
            taps through is still caught under a panel; a panel that lets taps through is
            still caught over a text (UI's warning about hit tests); a canvas label drawn
            nine times for its outline is ONE label; two canvas labels crossing are caught;
            a line drawing over a text (the phone's cracks) is NOT a panel; a canvas that is
            see-through where the text is, is NOT a panel; a faint glass sheen is NOT a
            panel, a solid gradient IS; and the covered test ran at all.
     per surface, demo and alpha: the loading screen, the first screen after the door,
            the map at its opening zoom, the map at the far stop: 0 crossing, 0 cut off.
     P1     THE QUEST LINE WHEN IT WRAPS (demo). PLANTED, said plainly: the demo's first
            minutes never write a quest line (measured 9/30: empty for 40 s), so the leg
            writes one of the length the game composes (objective, next step, address)
            into #qline and asks whether any of it is cut off. This is his screenshot's
            element.
     P2     THE DANGER LINE (alpha). Planted through the game's OWN call, streetSay(),
            with the exact words UI quoted on its [warning clipped] row, where UI found it
            under BUILD HERE by geometry.
     OWED, printed every run: the fight, the settlement screen, the phone opened out, and
            text copied to the screen from a scratch canvas as a picture.

   It lands red if the game has an overlap. That is the point: Paolo asked for a gate that
   refuses the push, and a green gate over a screen he can see is broken would be the lie.
     node gates/no_overlap_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const T = require(path.join(ROOT, 'tools/bohemia_text_overlap.js'));
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why.split('\n').join('\n         ') : '')); } };

const PLANT = `<!doctype html><html><head><style>
  body{margin:0;background:#222;font:14px monospace;color:#eee}
  .a{position:absolute;white-space:nowrap}
  #cover{position:fixed;left:0;top:0;width:100vw;height:100vh;background:#000;z-index:50;display:none}
</style></head><body>
  <div class="a" id="t1" style="left:10px;top:10px">FIRST LABEL HERE</div>
  <div class="a" id="t2" style="left:60px;top:14px">SECOND LABEL</div>
  <div class="a" id="t3" style="left:10px;top:60px">A LINE THAT RUNS UNDER A PANEL</div>
  <div class="a" style="left:150px;top:52px;width:120px;height:30px;background:#333;z-index:5"></div>
  <div class="a" id="t4" style="left:10px;top:110px">UNDER A SEE-THROUGH LAYER</div>
  <div class="a" style="left:0;top:100px;width:300px;height:40px;background:rgba(0,0,0,0.1);z-index:5"></div>
  <div class="a" id="t5" style="left:10px;top:160px;pointer-events:none">A LABEL THAT LETS TAPS THROUGH</div>
  <div class="a" style="left:170px;top:152px;width:120px;height:30px;background:#333;z-index:5"></div>
  <div class="a" id="t6" style="left:10px;top:210px">A PANEL THAT LETS TAPS THROUGH</div>
  <div class="a" style="left:170px;top:202px;width:120px;height:30px;background:#333;z-index:5;pointer-events:none"></div>
  <canvas id="cv" width="300" height="80" style="position:absolute;left:0;top:250px;width:300px;height:80px"></canvas>
  <div class="a" id="t7" style="left:10px;top:350px">UNDER A LINE DRAWING</div>
  <svg class="a" style="left:0;top:340px;z-index:5" width="300" height="40"><path d="M0 20 L300 18" stroke="#999" stroke-width="1"/></svg>
  <div class="a" id="t8" style="left:10px;top:400px">UNDER A CLEAR CANVAS</div>
  <canvas id="clear" width="300" height="40" style="position:absolute;left:0;top:390px;z-index:5"></canvas>
  <div class="a" id="t9" style="left:10px;top:450px">UNDER A GLASS SHEEN</div>
  <div class="a" style="left:0;top:440px;width:300px;height:40px;z-index:5;background:linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.12))"></div>
  <div class="a" id="t10" style="left:10px;top:500px">UNDER A SOLID GRADIENT</div>
  <div class="a" style="left:150px;top:490px;width:150px;height:40px;z-index:5;background:linear-gradient(#333,#111)"></div>
  <div id="cover"></div>
  <script>
    const g = document.getElementById('cv').getContext('2d');
    g.font = '14px monospace'; g.textBaseline = 'top';
    for (const [dx, dy] of [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1],[0,0]]) g.fillText('HOME', 10 + dx, 10 + dy);
    g.fillText('TWO LABELS', 150, 40); g.fillText('CROSSING', 180, 44);
  </script>
</body></html>`;

(async () => {
  console.log('='.repeat(74));
  console.log('NO OVERLAP: no two texts on top of each other, none cut off by a panel (rule 44c)');
  console.log('='.repeat(74));

  /* ---- S: the planted page -------------------------------------------------- */
  const bare = await chromium.launch();
  try {
    const ctx = await bare.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript({ content: T.ARM });
    const pg = await ctx.newPage();
    await pg.setContent(PLANT);
    await pg.waitForTimeout(100);
    /* the canvas draws happened at load; re-run them inside the window the reader looks at */
    await pg.evaluate(() => { const g = document.getElementById('cv').getContext('2d'); g.clearRect(0, 0, 300, 80);
      g.font = '14px monospace'; g.textBaseline = 'top';
      for (const [dx, dy] of [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1],[0,0]]) g.fillText('HOME', 10 + dx, 10 + dy);
      g.fillText('TWO LABELS', 150, 40); g.fillText('CROSSING', 180, 44); });
    const m = await T.measure(pg, 'planted page', 2000);
    const pair = (a, b) => m.overlaps.some(([A, B]) => (A.text.startsWith(a) && B.text.startsWith(b)) || (A.text.startsWith(b) && B.text.startsWith(a)));
    const cov = (t) => m.covered.some(([A]) => A.text.startsWith(t));
    ok('S1 two crossing texts are caught', pair('FIRST LABEL', 'SECOND LABEL'), T.report(m));
    ok('S2 a text partly under an opaque panel is caught', cov('A LINE THAT RUNS'), T.report(m));
    ok('S3 a see-through layer is not a panel', !cov('UNDER A SEE-THROUGH'), T.report(m));
    ok('S4 a label that lets taps through is still caught under a panel', cov('A LABEL THAT LETS'), T.report(m));
    ok('S5 a panel that lets taps through is still caught over a text (UI: a hit test cannot tell covered from click-through)',
       cov('A PANEL THAT LETS'), T.report(m));
    const homes = m.texts.filter(t => t.kind === 'canvas' && t.text === 'HOME');
    ok('S6 a canvas label drawn nine times for its outline is ONE label (' + homes.length + ')',
       homes.length === 1 && !pair('HOME', 'HOME'), T.report(m));
    ok('S7 two canvas labels crossing are caught', pair('TWO LABELS', 'CROSSING'), T.report(m));
    ok('S9 a line drawing over a text is not a panel (the phone\'s cracks are one)', !cov('UNDER A LINE DRAWING')
       && m.texts.some(t => t.text.startsWith('UNDER A LINE DRAWING')), T.report(m));
    ok('S10 a canvas that is see-through where the text is, is not a panel', !cov('UNDER A CLEAR CANVAS')
       && m.texts.some(t => t.text.startsWith('UNDER A CLEAR CANVAS')), T.report(m));
    ok('S12 a faint glass sheen over a text is not a panel (the phone has one)', !cov('UNDER A GLASS SHEEN')
       && m.texts.some(t => t.text.startsWith('UNDER A GLASS SHEEN')), T.report(m));
    ok('S13 a solid gradient partly over a text IS a panel', cov('UNDER A SOLID GRADIENT'), T.report(m));
    ok('S11 the covered test ran on every document it read (' + (m.errors || []).length + ' could not)', !(m.errors || []).length, (m.errors || []).join('; '));
    await pg.evaluate(() => { document.getElementById('cover').style.display = 'block'; });
    const m2 = await T.measure(pg, 'planted page under a full-screen cover', 2000);
    ok('S8 texts wholly under a full-screen cover are not on screen, so not counted (' + m2.overlaps.length
       + ' crossing, ' + m2.covered.length + ' cut off)', m2.overlaps.length === 0 && m2.covered.length === 0, T.report(m2));
  } finally { await bare.close(); }

  /* ---- the real surfaces, with the two planted cases ------------------------- */
  const planted = async (d, which) => {
    if (which === 'demo') {
      await d.fr.evaluate(() => { const q = document.getElementById('qline');
        q.textContent = 'FIND WORK BEFORE DARK · get inside one of these buildings · 3 blocks north-east, Maryland Parkway'; });
      const m = await T.measure(d.page, 'demo P1 the quest line, planted at the length the game composes');
      await d.fr.evaluate(() => { document.getElementById('qline').textContent = ''; });
      return [m];
    }
    const said = await d.fr.evaluate(() => typeof streetSay === 'function'
      ? streetSay('2 OF THEM AND THEY ARE NOT FRIENDLY. TAP ONE AND IT STARTS.') : -1);
    const m = await T.measure(d.page, 'alpha P2 the danger line, through the game\'s own streetSay()');
    m.said = said;
    await d.fr.evaluate(() => { const l = document.getElementById('packline'); if (l) { l.textContent = ''; l.style.display = 'none'; } });
    return [m];
  };
  for (const which of ['demo', 'alpha']) {
    let ms = [];
    try { ms = await T.readSurfaces(open, which, planted); }
    catch (e) { ok(which.toUpperCase() + ' the surfaces were reached', false, String(e.message || e).slice(0, 200)); continue; }
    for (const m of ms) {
      console.log('  ' + T.report(m).split('\n').join('\n  '));
      if (m.broken) { ok(m.label, false); continue; }
      if ((m.errors || []).length) { ok(m.label + ': every document was measured', false, m.errors.join('; ')); continue; }
      if (m.said === -1) { ok(m.label + ': the game has no streetSay() to call', false); continue; }
      ok(m.label + ': nothing crosses, nothing is cut off (' + m.texts.length + ' texts)',
         !m.overlaps.length && !m.covered.length);
    }
  }
  console.log('  OWED: the fight, the settlement screen (not built yet), the phone opened out, '
    + 'and text drawn on a scratch canvas then copied to the screen as a picture.');

  console.log('\n=== NO OVERLAP GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('NO OVERLAP GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
