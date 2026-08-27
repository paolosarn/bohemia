/* THE FOUR THINGS HE SAID ABOUT THE HAIR (8/27/26, CHARACTER lane).
 *
 * Paolo, 8/27: "OKAY FOR THE HAIRS I DONT WANT TO JUDGE ALL OF THEM DOWN BRO BUT HOLY
 * SHIT. U HAVE TO FIX THE FOREHEAD SHIT YOU GOT THE FOREHEAD ALL WRONG EAST AND WEST.
 * AND ITS SO CONFUSING WHEN ITS FACING EAST AND WEST LIKE YOU HAVE THE HAIR BALDING
 * BACK FURTHER THAN IT SHOULD BE. AND MOST HAIRS EAST AND WEST ARE JUST LIKE A SINGLE
 * LINE GOING DOWN. AND THE VERY LONG PAST SHOULDER LENGTH HAIRS LIKE THEY BREAK IN THE
 * MIDDLE OF THE HAIR. AFTER THE HEAD THERES NOTHING UNTIL THE SHOULDERS FACING NORTH
 * AND SOUTH. CMON MAN"
 *
 * *** THE FIRST VERSION OF THIS FILE SAID HE WAS WRONG ABOUT ALL FOUR. ***
 * It reported zero bare forehead in profile, a median row eleven pixels wide, and one
 * break in forty-five style/facing pairs. Every reading contradicted him, and every
 * reading was measuring the wrong thing:
 *
 *   THE FOREHEAD    it walked only the rows ABOVE the face part, which in profile is two
 *                   rows, and took the best of them. The bald patch he is describing is
 *                   BESIDE the face, not above it.
 *   THE WIDTH       it took the BOUNDING BOX of each row. A row with hair at both ends
 *                   and a hole in the middle measured eleven pixels wide and rendered as
 *                   two lines. It should have counted the pixels.
 *   THE BREAK       it called a row "not broken" if ANY pixel on it was hair. The break
 *                   he means is HORIZONTAL -- the fall lets go of the head and starts
 *                   again lower down -- and every row involved has hair somewhere on it.
 *
 * THREE DIFFERENT WAYS OF ASKING A QUESTION THAT IS NEARLY THE RIGHT ONE, and the answer
 * came back green three times. This is the second time in three days a metric has told me
 * he was wrong about his own art (the 8/25 edge-parity audit read 50.9% "already native"
 * over nine styles that were solid blocks) so it is now a rule and not a coincidence:
 * WHEN A NUMBER DISAGREES WITH HIM ABOUT A PICTURE, GO AND LOOK AT THE PICTURE, AND FIX
 * THE RULER. The reference sheet is what actually found all four.
 *
 * WHAT IT MEASURES NOW:
 *   A  THE HAIRLINE IN PROFILE -- at the browline, a third of the way down the skull,
 *      what SHARE of that row of head is hair. A hairline sits about halfway back;
 *      "balding back further than it should be" is a share that is too small. (This one
 *      took two tries as well, and the second failure is written up at the measurement.)
 *   B  HOW WIDE A ROW OF HAIR ACTUALLY IS -- pixels COUNTED, not spanned, median over the
 *      head rows BELOW THE BROW, which is the part he called a line going down. Over the
 *      whole head the full-width crown drags the median up on every style at once.
 *   C  BREAKS -- the hair pixels are flood-filled into connected blobs. More than one
 *      blob, or a blob that does not touch the head, IS the break. That is what a person
 *      sees and no per-row test can find.
 *   D  THE NECK PINCH -- the narrowest row between the jaw and the shoulders, against the
 *      widest row of the fall. Hair that pinches to a point and flares out again reads as
 *      broken even though it never disconnects.
 *
 * RIG CHECK (RIG IS LAW, 7/26): measures and prints. Writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: buildFrame (read-only)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. It reads the alpha's own render.
 *
 *   node tools/bohemia_hair_the_four_complaints.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);

const MEASURE = `(() => {
  const HAIR = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
  const keepW = window.G_WORN, keepE = G.equipped;
  const rows = [];
  const grab = (dir, hairName) => {
    const eq = {}; for (const k in keepE) eq[k] = keepE[k];
    for (const s of ['hat','glasses','hair','shirt','jacket','pants','shoes']) eq[s] = '';
    G.equipped = eq;
    window.G_WORN = { base:'WHITE TEE', legs:'DUST TROUSERS', feet:'BROWN BOOTS', hair: hairName || '' };
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return buildFrame(dir, 'idle', 0);
  };
  for (const h of HAIR) {
    for (const dir of ['S','SE','E','NE','N']) {
      const on = grab(dir, h.n), off = grab(dir, '');
      const N = on.CW;
      let hy0=1e9,hy1=-1,hx0=1e9,hx1=-1,fx0=1e9,fx1=-1;
      const headRow = {};
      for (let i=0;i<N*N;i++){ const g=on.grid[i], x=i%N, y=(i/N)|0;
        if (g===1||g===2){ if(y<hy0)hy0=y; if(y>hy1)hy1=y; if(x<hx0)hx0=x; if(x>hx1)hx1=x;
          const r=headRow[y]||(headRow[y]={a:1e9,b:-1}); if(x<r.a)r.a=x; if(x>r.b)r.b=x; }
        if (g===2){ if(x<fx0)fx0=x; if(x>fx1)fx1=x; } }
      /* HAIR = every pixel that differs between the haired render and the bald one */
      const hair = new Uint8Array(N*N); const rowN = {}; let top=1e9, bot=-1;
      for (let i=0;i<N*N;i++){ const a=on.px[i], c=off.px[i];
        const same=(!a&&!c)||(a&&c&&a[0]===c[0]&&a[1]===c[1]&&a[2]===c[2]);
        if (same) continue;
        hair[i]=1; const y=(i/N)|0; rowN[y]=(rowN[y]||0)+1; if(y<top)top=y; if(y>bot)bot=y; }
      if (bot<0){ rows.push({n:h.n,dir,dead:true}); continue; }

      /* C -- CONNECTED BLOBS. one blob touching the head is a whole haircut. */
      const seen = new Uint8Array(N*N); const blobs = [];
      for (let i=0;i<N*N;i++){
        if (!hair[i]||seen[i]) continue;
        let st=[i], n=0, touch=false, by0=1e9, by1=-1;
        seen[i]=1;
        while (st.length){ const j=st.pop(); n++;
          const x=j%N, y=(j/N)|0; if(y<by0)by0=y; if(y>by1)by1=y;
          if (y>=hy0&&y<=hy1) touch=true;
          const nb=[j-1,j+1,j-N,j+N];
          for (const k of nb){ if(k<0||k>=N*N||seen[k]||!hair[k]) continue;
            if ((k===j-1&&x===0)||(k===j+1&&x===N-1)) continue;
            seen[k]=1; st.push(k); } }
        blobs.push({n, touch, by0, by1});
      }
      blobs.sort((a,b)=>b.n-a.n);
      /* A PIECE OF HAIR, NOT A SPECK. The wobble and the strand pass both leave one- and
         two-pixel marks at the edge of the mass, and counting those as "pieces" reported
         SLICK BACK as three haircuts. A break he can see is a run of hair at least six
         pixels and two rows tall -- smaller than that is texture, which is the thing the
         4x law asked for and must not be gated against. */
      const real = blobs.filter(b => b.n >= 6 && (b.by1-b.by0) >= 2);
      const loose = real.filter(b => !b.touch).length;
      const second = real.length > 1 ? real[1].n : 0;

      /* B -- pixels COUNTED per row, BELOW THE BROW, which is the part he called a line.
         Taken over the whole head it reads 11px even when the mass under the brow is
         four, because the crown is full width on every style and drags the median up --
         a number can be perfectly true about a region nobody is complaining about. */
      const ws = [];
      const b0 = hy0 + Math.round((hy1-hy0)*0.32);
      for (let y=Math.max(top,b0); y<=Math.min(bot,hy1); y++) ws.push(rowN[y]||0);
      ws.sort((a,b)=>a-b);
      const med = ws.length ? ws[ws.length>>1] : 0;

      /* A -- HOW MUCH OF THE HEAD THE HAIR HOLDS AT THE BROW, IN PROFILE.
         *** THE FIRST TRY MEASURED BALD SKIN IN PIXELS FROM THE CROWN DOWN TO THE EAR
         AND FLAGGED ALL FIFTEEN STYLES AFTER THE FIX. *** It was counting the hairline
         RECEDING OVER THE EAR, which is the correct shape of a real hairline and the
         thing the fix deliberately added -- so it was reporting the repair as the fault.
         A ruler that cannot tell a hairline from a bald patch is not measuring a
         hairline. And pixels is the wrong unit anyway: eleven bare pixels is most of a
         small head and a third of a big one.
         So it asks the question he actually asked. At the BROW -- a third of the way
         down the skull, where a hairline crosses -- what SHARE of that row is hair?
         That is one number, it is a share so it survives any head size, and "balding
         back further than it should be" is exactly a share that is too small. */
      let brow = null;
      if (dir==='E'||dir==='W'){
        const by = hy0 + Math.round((hy1-hy0)*0.32);
        const r = headRow[by];
        if (r){ let n=0; for (let x=r.a;x<=r.b;x++) if (hair[by*N+x]) n++;
          brow = +(n/(r.b-r.a+1)).toFixed(2); }
      }

      /* D -- the neck pinch: narrowest row below the jaw against the widest */
      let pinch = 0;
      if (bot > hy1+2){
        let mnW=1e9, mxW=0;
        for (let y=hy1-1; y<=Math.min(bot,hy1+8); y++){ const w=rowN[y]||0;
          if (w<mnW) mnW=w; }
        for (let y=hy1+1; y<=bot; y++){ const w=rowN[y]||0; if (w>mxW) mxW=w; }
        pinch = mxW ? +(mnW/mxW).toFixed(2) : 1;
      }
      rows.push({ n:h.n, dir, med, brow, loose, second, pinch,
                  head:[hy0,hy1], bot, blobs: real.length });
    }
  }
  window.G_WORN = keepW; G.equipped = keepE;
  try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
  return rows;
})()`;

module.exports = { MEASURE };

if (require.main === module) (async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });
  const out = await p.evaluate(MEASURE);
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  const pad = (s, n) => String(s).padEnd(n);
  const names = [...new Set(out.map(r => r.n))];
  const at = (n, d) => out.filter(r => r.n === n && r.dir === d)[0] || {};

  console.log('\nA + B  --  IN PROFILE.  brow = the share of the head the hair holds at the');
  console.log('       browline, a third of the way down the skull.  a hairline sits about');
  console.log('       halfway back; anything under a third is balding.');
  console.log('       wide = how many hair pixels a typical row of this haircut has.\n');
  console.log('  ' + pad('STYLE', 18) + pad('brow', 12) + 'wide');
  for (const n of names) { const r = at(n, 'E');
    console.log('  ' + pad(n, 18) +
      pad((r.brow*100).toFixed(0) + '%' + (r.brow < 0.33 ? '  <- balding' : ''), 14) +
      r.med + 'px' + (r.med <= 6 ? '   <- a line' : '')); }

  console.log('\nC + D  --  BREAKS.  the hair is flood-filled into blobs: one blob is a whole');
  console.log('       haircut.  pinch = the narrowest row at the neck over the widest of the');
  console.log('       fall -- 0.30 means the hair chokes to a third and flares out again.\n');
  console.log('  ' + pad('STYLE', 18) + pad('S', 20) + pad('N', 20) + 'E');
  const fmt = r => r.blobs == null ? '-' :
    (r.blobs > 1 ? r.blobs + ' pieces' + (r.loose ? ' (' + r.loose + ' loose)' : '') : 'one piece') +
    (r.pinch && r.pinch < 0.45 ? '  pinch ' + r.pinch : '');
  for (const n of names)
    console.log('  ' + pad(n, 18) + pad(fmt(at(n, 'S')), 20) + pad(fmt(at(n, 'N')), 20) + fmt(at(n, 'E')));

  const E = out.filter(r => r.dir === 'E' && r.med != null);
  const worst = E.slice().sort((a, b) => a.brow - b.brow)[0];
  console.log('\nTHE HEADLINE');
  console.log('  profile haircuts that are a line (6px or less)  : ' +
    E.filter(r => r.med <= 6).length + ' of ' + E.length);
  console.log('  profile haircuts balding at the brow (under 33%): ' +
    E.filter(r => r.brow < 0.33).length + ' of ' + E.length +
    '   worst ' + (worst.brow*100).toFixed(0) + '% (' + worst.n + ')');
  console.log('  style/facings in more than one piece            : ' +
    out.filter(r => r.blobs > 1).length + ' of ' + out.filter(r => r.blobs != null).length);
  console.log('  style/facings with a loose piece of hair        : ' +
    out.filter(r => r.loose > 0).length);
  console.log('  style/facings that choke at the neck            : ' +
    out.filter(r => r.pinch && r.pinch < 0.45).length);
})();
