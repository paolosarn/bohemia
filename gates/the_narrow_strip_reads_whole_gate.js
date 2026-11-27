/* THE NARROW STRIP READS WHOLE  (UI FIVE, 11/27/26; rules 441, 482, 495(a), the routine 'UI FIVE: the next screen'; SCROLLING IS
   ILLEGAL N3/N9 on its side, words under 11 px)

   MEASURED (the demo on its side, 844 x 390, a town's smith, arms and armourer, every piece tapped): the shop's strip is a column 172 px
   wide, and in it (slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_NARROW_STRIP_S_BUTTONS__, this lane's own 11/22 rule):
     - the buy buttons' words were drawn at 9 px ('Buy it', 'Buy it and wear it', 'to the stash'), under the 11 px floor (SCROLLING IS
       ILLEGAL N3 and N9 red); at 11 px 'Buy it and' (66 px) did not fit the 63 px the density rule's padding (#sheet.ns-d1 .act
       {padding:4px 10px!important}) left it, and read 'Buy it / and wear...'
     - on every armour (48 of 48 at an armourer) 'ARMOUR CLASS' kept a 92 px column and its value took three big lines in the 74 px left,
       16 to 27 px under the man's box ('WALKS FREE' cut)
     - an armour's numbers ran off the right edge ('-40' read '-'), the item card's strip (slices/bohemia_ui_three_items.js) holding
       every card to one row
   THE FIX, in the narrow strip's own rule: the words at 11 px with a pixel less gap and padding (two lines and the price in the 44 px
   button); the class label and value as one sentence; an armour's or a helmet's three numbers take the box's spare third row (it has no
   ONE- or TWO-HANDED line); under the class line 'ON YOU' folds away (his face's gold frame says it). A shield's five numbers need a row
   the box has not got: NOT YET, reported here, never judged.

   On the DEMO on its side, through the one driver, a town with its shops (the smith, the arms, the armourer, whichever stand), every
   piece tapped:
     W1 THE BUY WORDS: every buy button on the glass says its words at 11 px or more, whole (nothing clamped)
     W2 NO LINE CUT: on every weapon, body armour and helmet, no word in the strip runs past the box that clips it (a box folded to
        nothing on purpose, and the name's own '...', are not a cut)
     W3 THE SHIELDS, REPORTED: how many, and whether each is cut (NOT YET)
     W4 nothing threw
   PLANTED (the service worker off): the words back at 9 px, W1 red; the class line back in its 92 px column, W2 red.
   node gates/the_narrow_strip_reads_whole_gate.js [--no-plant] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 600) + ']' : '')); return g; };
const ARGS = process.argv.slice(2);
const SHOPS = ['smith', 'arms', 'armourer'];

/* in the town's frame: the strip as drawn */
const READ = () => {
  const st = document.getElementById('shopstrip'); if (!st) return null;
  const facts = st.querySelector('.ss-facts'), kind = facts && facts.getAttribute('data-kind');
  const name = ((st.querySelector('.ss-title b') || {}).textContent || '').trim();
  const words = [...st.querySelectorAll('.ss-acts>.act')].filter(a => getComputedStyle(a).visibility !== 'hidden' && a.getBoundingClientRect().width > 2).map(a => {
    const sp = a.querySelector('span'); if (!sp) return null; const fs = parseFloat(getComputedStyle(sp).fontSize);
    return { t: (sp.textContent || '').trim(), fs, clamped: sp.scrollHeight > sp.clientHeight + 1 || sp.scrollWidth > sp.clientWidth + 1 }; }).filter(Boolean);
  const cuts = [];
  for (const e of st.querySelectorAll('*')) {
    if (e.childElementCount || !(e.textContent || '').trim()) continue;
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    if (e.matches('.ss-title b') && getComputedStyle(e).textOverflow === 'ellipsis') continue;   /* the name's own '...' */
    for (let x = e.parentElement; x && x !== st.parentElement; x = x.parentElement) {
      const cs = getComputedStyle(x); if (!/(hidden|clip)/.test(cs.overflow + ' ' + cs.overflowY + ' ' + cs.overflowX)) continue;
      const q = x.getBoundingClientRect(); if (q.height < 2 || q.width < 2) break;   /* folded to nothing on purpose */
      if (r.bottom > q.bottom + 1 || r.right > q.right + 1) cuts.push((e.textContent || '').trim().slice(0, 28) + ' (' + Math.round(Math.max(r.bottom - q.bottom, r.right - q.right)) + ' px past ' + String(x.className || x.id || x.tagName).slice(0, 24) + ')');
      break;
    }
  }
  return { kind, name, words, cuts, width: Math.round(st.getBoundingClientRect().width) };
};

async function walk(plant) {
  const tag = 'the demo on its side' + (plant ? ' PLANTED (' + plant + ')' : '');
  console.log('\n' + tag);
  const errs = [];
  let d;
  try {
    d = await drive.open({ profile: 'phone_landscape', noWorker: !!plant, beforeGoto: async (c, pg) => {
      pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
      if (!plant) return;
      await pg.route(/BOHEMIA_SETTLEMENT_SCREEN\.html/, async route => { const r = await route.fetch(); let b = await r.text();
        if (plant === 'the words at 9 px') b = b.replace('text-align:center;font-size:11px;letter-spacing:0;line-height:1.05;', 'text-align:center;font-size:9px;letter-spacing:0;line-height:1.1;').replace('#buywear>span{font-size:11px;line-height:1.05}', '#buywear>span{font-size:9px;line-height:1.1}');
        if (plant === 'the class in its column') b = b.replace('html body #sheet #shopstrip .onman .wcls{display:block;line-height:1.25}html body #sheet #shopstrip .onman .wcls .k{min-width:0;margin-right:6px}', '');
        await route.fulfill({ response: r, body: b }); }); } });
  } catch (e) { ok(tag + ': the page boots', false, String(e.message).slice(0, 160)); return; }
  const P = d.page;
  try {
    const townUp = async () => { for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }).catch(() => false)) return x; return null; };
    let sf = await townUp();
    if (!sf) { await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }).catch(() => {});
      for (let i = 0; i < 60 && !sf; i++) { await P.waitForTimeout(400); sf = await townUp(); if (!sf && i === 15) await d.fr.evaluate(() => { try { btwFrameRest(); } catch (e) {} }).catch(() => {}); }
      await P.waitForTimeout(1200); }
    if (!sf) { ok(tag + ': a town opens', false); return; }
    const fb = await (await sf.frameElement()).boundingBox();
    const shops = await sf.evaluate(S => S.filter(k => BohemiaSettlement.order().indexOf(k) >= 0), SHOPS);
    const seen = [], badWords = [], badCuts = [], shields = [];
    for (const shop of shops) {
      await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(600);
      for (let i = 0; i < 3; i++) { const w = await sf.evaluate(k => BohemiaSettlement.where(k), shop); if (w) await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1600); if (await sf.evaluate(() => BohemiaSettlement.state.open) === shop) break; }
      if (await sf.evaluate(() => BohemiaSettlement.state.open) !== shop) { badCuts.push(shop + ' did not open'); continue; }
      const n = await sf.evaluate(() => document.querySelectorAll('#sheet .grid .slot').length), lim = plant ? Math.min(n, 8) : n;
      const r0 = await sf.evaluate(READ);   /* nothing picked: 'Buy it' */
      if (r0) for (const w of r0.words) if (w.fs < 11 || w.clamped) badWords.push(shop + ' (nothing picked) "' + w.t + '" ' + w.fs + ' px' + (w.clamped ? ', clamped' : ''));
      for (let q = 0; q < lim; q++) {
        const c = await sf.evaluate(q => { const s = document.querySelectorAll('#sheet .grid .slot')[q]; if (!s) return null; const r = s.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, q); if (!c) continue;
        await P.touchscreen.tap(fb.x + c[0], fb.y + c[1]); await P.waitForTimeout(450);
        const r = await sf.evaluate(READ); if (!r) continue;
        seen.push(r.kind);
        for (const w of r.words) if (w.fs < 11 || w.clamped) badWords.push(r.name + ' "' + w.t + '" ' + w.fs + ' px' + (w.clamped ? ', clamped' : ''));
        if (r.kind === 'shield') { shields.push(r.name + (r.cuts.length ? ': ' + r.cuts.length + ' cut' : ': whole')); continue; }
        if (r.cuts.length) badCuts.push(r.name + ' (' + r.kind + '): ' + r.cuts.join('; '));
      }
    }
    const tally = seen.reduce((a, k) => (a[k] = (a[k] || 0) + 1, a), {});
    const w1 = seen.length > 0 && !badWords.length, w2 = seen.length > 0 && !badCuts.length;
    if (plant === 'the words at 9 px') { ok(tag + ': W1 goes red (' + badWords.length + ' words under 11 px or clamped: ' + badWords.slice(0, 2).join(' | ') + ')', !w1); return; }
    if (plant === 'the class in its column') { ok(tag + ': W2 goes red (' + badCuts.length + ' pieces cut: ' + badCuts.slice(0, 2).join(' | ') + ')', !w2); return; }
    ok('W1 THE BUY WORDS at 11 px or more and whole, ' + shops.join(', ') + ' (' + seen.length + ' pieces: ' + JSON.stringify(tally) + ')', w1, badWords.slice(0, 3).join(' | '));
    ok('W2 NO LINE CUT on a weapon, a body armour or a helmet in the ' + (await sf.evaluate(() => Math.round(document.getElementById('shopstrip').getBoundingClientRect().width))) + ' px strip', w2, badCuts.slice(0, 3).join(' | '));
    ok('W3 THE SHIELDS, REPORTED (NOT YET, their own layout): ' + (shields.length ? shields.slice(0, 4).join('; ') : 'none in these shops'), true);
    ok('W4 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(tag + ' ran', false, String(e.stack).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}

(async () => {
  await walk(null);
  if (!ARGS.includes('--no-plant')) { await walk('the words at 9 px'); await walk('the class in its column'); }
  console.log('\nTHE NARROW STRIP READS WHOLE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
