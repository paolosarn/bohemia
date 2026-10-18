/* THE FIGHT'S BAR IS STUDIO MADE  (UI lane 11, [the demo's screens] round one, 10/4/26)

   PAOLO 10/2 (his sixth votes): 'the UI is AI dogshit slop that needs so much love, not like a
   studio-made game'. Rule 71 names the tells: default fonts, flat rounded boxes, drop shadows,
   centred labels, text where a picture belongs. COMBAT built the bar on Battle Brothers' layout in
   our materials (121a460); this is the finish, carried by the shared materials file so every screen
   that wears the bar gets it.

   WHAT THIS HOLDS, on slices/BOHEMIA_FIGHT.html at his phone's profile through the one driver:
     - the game's own faces are loaded and worn: CASING on every label on a thing (END TURN, WAIT,
       AUTO, the round, the name), ROM on what the receipt printer prints (the hint, the drawer)
     - no tag on the bar is a centred label: each reads from the left under a printed mark
     - paper casts a hard one-pixel contact edge, never a soft drop shadow
     - the hint is never cut off and stays on the glass
     - the cardboard shows its cut edge (the flutes) along the top of the bar
     - the receipt is blank behind the words (no printed rows that read as strike-throughs)
     - the drawer's title is the printer's one ink, not gold on white
     - every tapped thing is still at least 44 points, the bar still about 120, and the finish leaves
       the bar's and the strip's heights exactly as COMBAT set them (the board is fitted to them)
     - no page error

   node gates/the_fight_bar_is_studio_made_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE FIGHT\'S BAR IS STUDIO MADE: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  console.log('\nTHE FIGHT\'S BAR IS STUDIO MADE  (UI [the demo\'s screens] round one)\n');
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:5,speed:1,kind:"suburb"}' });
  const p = d.page;
  const t0 = Date.now(); let up = false;
  while (Date.now() - t0 < 30000) { if (await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board)) { up = true; break; } await p.waitForTimeout(200); }
  ok('the fight loads', up); if (!up) { await d.close(); return done(); }
  await p.waitForTimeout(5000);
  const a = await p.evaluate(async () => {
    await document.fonts.ready;
    const cs = (id) => getComputedStyle(document.getElementById(id));
    const fam = (id) => cs(id).fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const tags = ['bend', 'bwait', 'bauto'].map(id => { const el = document.getElementById(id), r = el.getBoundingClientRect();
      const tn = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim()); let tx = null;
      if (tn) { const rg = document.createRange(); rg.selectNodeContents(tn); const rr = rg.getBoundingClientRect(); tx = rr.left - r.left; }
      const be = getComputedStyle(el, '::before');
      return { id, align: getComputedStyle(el).textAlign, tx: tx === null ? null : Math.round(tx), w: Math.round(r.width), h: Math.round(r.height),
        mark: /url\("?data:image/.test(be.backgroundImage) && parseFloat(be.width) >= 12, shadow: getComputedStyle(el).boxShadow, filter: getComputedStyle(el).filter }; });
    const say = document.getElementById('say'), sr = say.getBoundingClientRect(), ss = getComputedStyle(say);
    /* the receipt behind the words: mean light per row through the middle, any row that jumps from its neighbours is a printed line */
    const rc = BohemiaMaterials.receipt(), g = rc.getContext('2d'), D = g.getImageData(0, 0, rc.width, rc.height).data, rows = [];
    for (let y = 0; y < rc.height; y++) { let sum = 0; for (let x = 0; x < rc.width; x++) { const i = (y * rc.width + x) * 4; sum += D[i] * .3 + D[i + 1] * .59 + D[i + 2] * .11; } rows.push(sum / rc.width); }
    let jump = 0; for (let y = 6; y < rc.height - 12; y++) jump = Math.max(jump, Math.abs(rows[y] - (rows[y - 2] + rows[y + 2]) / 2));
    const taps = ['bend', 'bwait', 'bauto', 'card'].map(id => document.getElementById(id).getBoundingClientRect())
      .concat(Array.from(document.querySelectorAll('#skills .sq')).filter(b => b.style.display !== 'none').map(b => b.getBoundingClientRect()));
    return {
      /* NOT document.fonts.check(): it answers true for a family that has no face at all (nothing to
         load), which let a run with the faces deleted pass. Each face must be in the set AND loaded. */
      loaded: { casing: Array.from(document.fonts).some(f => f.family.replace(/["']/g, '') === 'BohemiaCasing' && f.status === 'loaded'),
                rom: Array.from(document.fonts).some(f => f.family.replace(/["']/g, '') === 'BohemiaROM' && f.status === 'loaded') },
      fams: { bend: fam('bend'), bwait: fam('bwait'), bauto: fam('bauto'), round: fam('round'), cnm: fam('cnm'), say: fam('say'), body: getComputedStyle(document.body).fontFamily.split(',')[0].replace(/["']/g, '').trim() },
      tags, say: { shown: ss.display !== 'none', cut: say.scrollWidth > say.clientWidth + 1 || ss.textOverflow === 'ellipsis', l: Math.round(sr.left), r: Math.round(sr.right), vw: innerWidth, text: say.textContent.trim(), sh: ss.boxShadow },
      edge: (getComputedStyle(document.getElementById('bot')).backgroundImage.match(/url\(/g) || []).length,
      jump: +jump.toFixed(2), small: taps.filter(r => r.width < 44 || r.height < 44).length, bar: Math.round(document.getElementById('bot').getBoundingClientRect().height)
    };
  });
  ok('THE GAME\'S OWN FACES ARE LOADED (casing and ROM)', a.loaded.casing && a.loaded.rom, JSON.stringify(a.loaded));
  ok('  every label on a thing is set in CASING', ['bend', 'bwait', 'bauto', 'round', 'cnm'].every(k => a.fams[k] === 'BohemiaCasing'), JSON.stringify(a.fams));
  ok('  what the printer prints is set in ROM, and no default font is the page\'s face', a.fams.say === 'BohemiaROM' && a.fams.body === 'BohemiaROM', a.fams.say + ' / body ' + a.fams.body);
  ok('NO TAG ON THE BAR IS A CENTRED LABEL: each reads from the left', a.tags.every(t => t.align !== 'center' && t.tx !== null && t.tx <= 12),
     a.tags.map(t => t.id + ' ' + t.align + ' text at +' + t.tx + 'px').join(', '));
  ok('  each tag carries its printed mark (12 px, drawn)', a.tags.every(t => t.mark), a.tags.map(t => t.id + '=' + t.mark).join(' '));
  ok('PAPER CASTS A HARD ONE-PIXEL EDGE, NEVER A SOFT DROP SHADOW', a.tags.every(t => t.shadow === 'none' && /drop-shadow\(rgba\([^)]*\) 0px 1px 0px\)/.test(t.filter)) && a.say.sh === 'none',
     a.tags.map(t => t.id + ' ' + t.shadow + ' / ' + t.filter).join(' | '));
  ok('THE HINT IS NEVER CUT OFF, AND STAYS ON THE GLASS', a.say.shown && !a.say.cut && a.say.l >= 0 && a.say.r <= a.say.vw, '"' + a.say.text + '" ' + a.say.l + '..' + a.say.r + ' of ' + a.say.vw);
  ok('THE CARDBOARD SHOWS ITS CUT EDGE along the top of the bar', a.edge >= 2, a.edge + ' layers');
  ok('THE RECEIPT IS BLANK BEHIND THE WORDS (no printed rows to read as strike-throughs)', a.jump < 4, 'largest row jump ' + a.jump + ' of 255');
  ok('every tapped thing is still at least 44 points, the bar still about 120', a.small === 0 && a.bar >= 100 && a.bar <= 150, a.small + ' small, bar ' + a.bar);

  /* THE FINISH NEVER MOVES THE BOARD: the fight fits its board to the bar's height, so the skin must
     leave that height exactly as COMBAT set it (a 6 pt taller bar pushed the scrub board 408 wide on
     390 glass). Measured with the skin switched off and on, same page. */
  const hh = await p.evaluate(async () => { const st = document.getElementById('bm-skin'), b = document.getElementById('bot'), t = document.getElementById('top');
    const on = [b.offsetHeight, t.offsetHeight]; st.disabled = true; await new Promise(r => requestAnimationFrame(r)); const off = [b.offsetHeight, t.offsetHeight];
    st.disabled = false; await new Promise(r => requestAnimationFrame(r)); return { on, off }; });
  ok('THE FINISH NEVER MOVES THE BOARD: the bar and the strip keep COMBAT\'s heights to the point', hh.on[0] === hh.off[0] && hh.on[1] === hh.off[1], 'bar ' + hh.off[0] + ' -> ' + hh.on[0] + ', strip ' + hh.off[1] + ' -> ' + hh.on[1]);

  /* the drawer: tap his face */
  const c = await p.evaluate(() => { const r = document.getElementById('card').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  await p.mouse.click(c[0], c[1]); await p.waitForTimeout(700);
  const dr = await p.evaluate(() => { const el = document.getElementById('drawer'), h = el.firstElementChild; if (!h || getComputedStyle(el).display === 'none') return null;
    const m = getComputedStyle(h).color.match(/\d+/g).map(Number); return { lum: Math.round(m[0] * .3 + m[1] * .59 + m[2] * .11), fam: getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, ''), title: h.textContent }; });
  ok('THE DRAWER\'S TITLE IS THE PRINTER\'S INK, NOT GOLD ON WHITE', dr && dr.lum < 90, dr && (dr.title + ' lum ' + dr.lum));
  ok('  and the drawer is printed in ROM', dr && dr.fam === 'BohemiaROM', dr && dr.fam);
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
