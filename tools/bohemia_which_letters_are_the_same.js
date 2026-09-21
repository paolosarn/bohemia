/* ==========================================================================
   WHICH TWO LETTERS OF THIS FACE ARE THE SAME PICTURE?   UI lane 11, 9/21/26.

   *** WHY A TOOL AND NOT A LOOK. ***
   This round I read a screenshot with my own eye, decided the N in our button
   face was rendering as an H, measured it, and the first measurement said the
   two differed by 15 to 25 per cent of their ink -- which I read as "fine".
   Both readings were worthless. The eye was looking at an 860 px picture the
   viewer had squashed to 156 px, where no five pixel diagonal survives. And a
   bare N-against-H number has nothing to compare itself to, so 20 per cent
   could mean anything.

   THE ORACLE THAT WORKS IS A RANKING. Draw all 26 capitals at the size the
   surface really uses, compare EVERY pair, and sort. Now the number has a
   population around it: if H and N are the closest pair in the alphabet, that
   is a fact about the face, not a feeling about a screenshot. Run it on the
   other faces cut from the same glyph table and you also learn whether the
   letters or the CUT is to blame.

   IT REFUSES TO REPORT if the face did not load, because a @font-face nothing
   has used is never fetched and every number then comes back from whatever the
   browser fell back to. That mistake cost this lane a whole round on 9/15.

     node tools/bohemia_which_letters_are_the_same.js <page.html> <dpr> <px> <family>

   <page.html> is any local page that declares the faces (slices/bohemia_ui_3d.css
   declares all three of ours; any sheet that links it will do).
   ========================================================================== */
const path = require('path');
function pw(){
  for(const g of ['/opt/node22/lib/node_modules','/usr/lib/node_modules','/usr/local/lib/node_modules']){
    try { return require(path.join(g,'playwright')); } catch(e) {}
  }
  return require('playwright');
}
(async () => {
  const { chromium } = pw();
  const page_  = process.argv[2] || 'slices/BOHEMIA_FOUR_WAYS_A_WORD_IS_STAMPED_9_21_26.html';
  const dpr    = Number(process.argv[3] || 3);
  const size   = Number(process.argv[4] || 5);
  const fam    = process.argv[5] || 'BohemiaCasing';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{ width:400, height:300 }, deviceScaleFactor:dpr });
  await p.goto('file://' + path.resolve(page_));
  await p.evaluate(f => document.fonts.load('12px "' + f + '"'), fam);
  await p.waitForTimeout(250);
  const st = await p.evaluate(f => {
    const x = [...document.fonts].find(q => q.family.replace(/['"]/g,'') === f);
    return x ? x.status : 'ABSENT';
  }, fam);
  if (st !== 'loaded') {
    console.error('REFUSING TO REPORT: ' + fam + ' is ' + st + ' on that page. '
                + 'Every number would be the fallback face, not this one.');
    await b.close(); process.exit(2);
  }
  const rows = await p.evaluate(({ dpr, size, fam }) => {
    const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), maps = {};
    for (const ch of L) {
      const c = document.createElement('canvas');
      c.width = c.height = Math.ceil(size * 3 * dpr);
      const x = c.getContext('2d'); x.scale(dpr, dpr);
      x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = '#fff'; x.font = size + 'px "' + fam + '"';
      x.textBaseline = 'top'; x.fillText(ch, 2, 2);
      const d = x.getImageData(0, 0, c.width, c.height).data, a = [];
      for (let i = 0; i < d.length; i += 4) a.push(d[i]);
      maps[ch] = a;
    }
    const out = [];
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
      const A = maps[L[i]], B = maps[L[j]]; let diff = 0, tot = 0;
      for (let k = 0; k < A.length; k++) { diff += Math.abs(A[k] - B[k]); tot += Math.max(A[k], B[k]); }
      out.push({ pair: L[i] + L[j], pct: +(100 * diff / (tot || 1)).toFixed(1) });
    }
    out.sort((a, b) => a.pct - b.pct);
    return out.slice(0, 10);
  }, { dpr, size, fam });
  console.log(fam + '  ' + size + 'px  dpr' + dpr + '  -- the ten closest pairs, most confusable first:');
  for (const r of rows) console.log('   ' + r.pair + '  ' + String(r.pct).padStart(5) + '% of the ink differs');
  await b.close();
})().catch(e => { console.error(String(e)); process.exit(1); });
