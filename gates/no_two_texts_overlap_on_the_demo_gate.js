/* ==========================================================================
   NO TWO TEXTS OVERLAP ON THE DEMO  (RUN, 9/30/26, VAMILY [demo text], rule 44c)

   PAOLO 9/29, said again: "for the demo bro you gotta keep in mind when texts are
   overlapping each other. I don't know why it's so fucking difficult for you to
   understand when text is overlapping each other." His screenshot: the quest line at
   the top running under the phone.

   MEASURED FIRST, every visible text box at phone size (DOM text in the shell and the
   world frame, clipped to what its scrolling containers actually show, plus the map's
   drawn name plates), paint order read with pointer-events forced on so labels that
   refuse fingers are still counted:
     #qline is a whole-width line in the top stack, and the drawn phone sits over its
       right side -- a long quest line wraps into the phone (26 x 5 px on the demo);
     the demo's gear sits over the top-left of the world frame, and the quest line's
       second line ran under it (11 x 5 px).
   FIXED: the line gives up exactly the room the phone takes, read off the phone's box
   every render (never a copied width), and on the demo it starts past the gear.

   WHAT IS NOT AN OVERLAP, SAID HERE SO NOBODY RE-FINDS IT: the phone's cracked-glass
   layer (#cityfeedglass) lies over the phone's own feed text on purpose -- that is the
   cracked iPhone he ruled (rule 32c) -- and a fight covering the whole map is the fight.

   Each surface is measured with a LONG quest line, because the short one never wraps
   and a check that only sees the easy case cannot fail.

   node gates/no_two_texts_overlap_on_the_demo_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = s => console.log('  ' + s);
const done = () => { console.log('NO TWO TEXTS OVERLAP ON THE DEMO: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const LONG = 'FIND WHO KEEPS THE PUMP RUNNING AT THE STANDPIPE · 3 blocks north-east, '
           + 'the wash, where the water still comes up at night';

const COLLECT = ([offX, offY, where]) => {
  const out = [];
  const vis = el => { for (let p = el; p && p !== document.body; p = p.parentElement) {
    const s = getComputedStyle(p); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; }
    return true; };
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    const t = (n.nodeValue || '').trim(); if (!t) continue;
    const el = n.parentElement; if (!el || !vis(el)) continue;
    if (/^(SCRIPT|STYLE|OPTION|TITLE)$/.test(el.tagName)) continue;
    let clip = { l: 0, t: 0, r: innerWidth, b: innerHeight };
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ps = getComputedStyle(p);
      if (/(hidden|auto|scroll|clip)/.test(ps.overflow + ps.overflowX + ps.overflowY)) {
        const pr = p.getBoundingClientRect();
        clip = { l: Math.max(clip.l, pr.left), t: Math.max(clip.t, pr.top), r: Math.min(clip.r, pr.right), b: Math.min(clip.b, pr.bottom) };
      }
    }
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const r0 of rg.getClientRects()) {
      const l = Math.max(r0.left, clip.l), tt = Math.max(r0.top, clip.t), r = Math.min(r0.right, clip.r), b = Math.min(r0.bottom, clip.b);
      if (r - l < 3 || b - tt < 3) continue;
      const cx = (l + r) / 2, cy = (tt + b) / 2;
      /* UNDER MEANS SOMETHING PAINTED IS ON TOP OF IT, not that a see-through box's edge
         reaches over it: walk the stack at the text's middle, from the top, until the text's
         own element; anything above it that paints (a fill, a border, an image, a canvas,
         a drawing, or its own text) covers it. */
      let under = null;
      const paints = e => { if (!e || e.nodeType !== 1) return false;
        if (/^(CANVAS|IMG|svg|SVG|VIDEO)$/.test(e.tagName)) return true;
        const cs = getComputedStyle(e); const bg = cs.backgroundColor;
        if (bg && !/rgba\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(bg)) return true;
        if (cs.backgroundImage && cs.backgroundImage !== 'none') return true;
        if (parseFloat(cs.borderTopWidth) > 0 && !/rgba\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(cs.borderTopColor)) return true;
        for (const k of e.childNodes) if (k.nodeType === 3 && k.nodeValue.trim()) return true;
        return false; };
      const stack = document.elementsFromPoint(Math.min(innerWidth - 1, Math.max(0, cx)), Math.min(innerHeight - 1, Math.max(0, cy)));
      for (const top of stack) {
        if (top === el || el.contains(top) || top.contains(el)) break;
        /* the phone's own cracked glass over its own screen is the ruled look, not a defect */
        const glass = top.closest && top.closest('#cityfeedglass');
        if (glass && glass.parentElement && glass.parentElement.contains(el)) continue;
        if (paints(top)) { under = top.id || top.tagName; break; }
      }
      out.push({ where, text: t.slice(0, 36), id: el.id || '', x: l + offX, y: tt + offY, w: r - l, h: b - tt, under });
    }
  }
  return out;
};
const PE = () => { if (document.getElementById('__pe')) return; const st = document.createElement('style'); st.id = '__pe';
  st.textContent = '*{pointer-events:auto !important}'; document.head.appendChild(st); };

async function measure(d, label) {
  await d.fr.evaluate(t => { const q = document.getElementById('qline'); if (q) q.textContent = t; try { render(); } catch (e) {} }, LONG);
  await d.page.waitForTimeout(700);
  const fighting = await d.pageEval(() => { const c = document.getElementById('p-combat');
    return !!(c && getComputedStyle(c).display !== 'none' && c.getBoundingClientRect().width > 0); }).catch(() => false);
  await d.page.evaluate(PE); await d.fr.evaluate(PE);
  const fb = await (await d.fr.frameElement()).boundingBox();
  const shell = await d.page.evaluate(COLLECT, [0, 0, 'shell']).catch(() => []);
  const city = await d.fr.evaluate(COLLECT, [fb.x, fb.y, 'world']);
  for (const t of city) {
    const hit = await d.page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.id || e.tagName) : null; },
      [t.x + t.w / 2, t.y + t.h / 2]);
    if (hit && hit !== 'cityFrame') t.under = (t.under ? t.under + '+' : '') + 'shell ' + hit;
  }
  const labels = await d.fr.evaluate(() => (window.__GROUNDLABELS || []).map(b => {
    let under = null;
    for (const e of document.elementsFromPoint(b.x + b.w / 2, b.y + b.h / 2)) {
      if (e.id === 'cv') break;
      const cs = getComputedStyle(e);
      const fill = cs.backgroundColor && !/rgba\(\s*0,\s*0,\s*0,\s*0\)|transparent/.test(cs.backgroundColor);
      let txt = false; for (const k of e.childNodes) if (k.nodeType === 3 && k.nodeValue.trim()) txt = true;
      if (fill || txt || /^(CANVAS|IMG|svg|SVG)$/.test(e.tagName)) { under = e.id || e.tagName; break; }
    }
    return { where: 'map', text: 'name plate', id: '', x: b.x, y: b.y, w: b.w, h: b.h, under }; }));
  labels.forEach(l => { l.x += fb.x; l.y += fb.y; });
  const all = shell.concat(city).concat(labels);
  const hits = [];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = all[i], b = all[j];
    const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (ox > 2 && oy > 2) hits.push(a.where + ' ' + (a.id || '') + ' "' + a.text + '" x ' + b.where + ' ' + (b.id || '') + ' "' + b.text + '" (' + Math.round(ox) + 'x' + Math.round(oy) + ')');
  }
  const under = all.filter(t => t.under);
  const q = await d.fr.evaluate(() => { const q = document.getElementById('qline'), f = document.getElementById('cityfeed');
    const qr = q.getBoundingClientRect(), fr = f ? f.getBoundingClientRect() : null;
    return { qRight: Math.round(qr.right), qLeft: Math.round(qr.left), qLines: Math.round(qr.height), feedLeft: fr ? Math.round(fr.left) : null,
             feedOn: !!(f && getComputedStyle(f).display !== 'none' && fr.width > 0) }; });
  say(label + ': ' + all.length + ' text boxes, ' + hits.length + ' overlapping, ' + under.length + ' under something'
      + (fighting ? ' (a fight is up)' : '') + '; the quest line runs ' + q.qLeft + '..' + q.qRight + ', the phone starts at ' + q.feedLeft);
  hits.slice(0, 6).forEach(h => say('   OVERLAP ' + h));
  under.slice(0, 6).forEach(t => say('   UNDER ' + t.where + ' ' + (t.id || '') + ' "' + t.text + '" under ' + t.under));
  return { hits, under, q, fighting, n: all.length };
}

(async () => {
  const CITY = fs.readFileSync(path.join(__dirname, '..', 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const CUT = fs.readFileSync(path.join(__dirname, '..', 'tools/bohemia_cut_the_demo.js'), 'utf8');
  ok('the quest line is fitted against the phone\'s own box, every render', /function qlineFit\(\)/.test(CITY) && /qlineFit\(\);\s*\/\* __THE_QUEST_LINE_CLEARS_THE_PHONE__/.test(CITY));
  ok('the demo\'s quest line starts past the gear', /#qline\{margin-left:\d+px !important\}/.test(CUT));

  for (const [label, opts, toMap] of [['THE DEMO', { keepCards: true }, false], ['THE ALPHA (on the map)', { keepCards: true, alpha: true }, true]]) {
    let d;
    try { d = await drive.open(opts); }
    catch (e) { ok(label + ' boots [' + String(e.message).slice(0, 100) + ']', false); continue; }
    try {
      await d.page.waitForTimeout(2500);
      if (toMap) { await d.pinchOut(); await d.page.waitForTimeout(1500); }
      /* THE WALK LESSON IS THE STREET'S: its caption covered the speed buttons on the map.
         Asked of the lesson itself, because WHEN the caption is up depends on the beat and a
         text census taken between beats would pass with the bug in. */
      const teach = await d.fr.evaluate(() => { const T = window.BOHEMIA_TEACH;
        return T ? { step: T.step(), showing: T.showing(), mode: MODE } : null; });
      if (teach && teach.mode === 'city')
        ok(label + ': the HOLD TO WALK lesson is not shown on the map, where the pad is speed (' + JSON.stringify(teach) + ')',
           !(teach.showing && teach.step === 'walk'));
      const r = await measure(d, label);
      ok(label + ' has text to measure (' + r.n + ')', r.n >= 10);
      ok('*** ' + label + ': NO TWO TEXTS OVERLAP *** (' + r.hits.length + ')', r.hits.length === 0);
      ok(label + ': no text sits under a panel (' + r.under.length + ')', r.under.length === 0 || r.fighting);
      ok('*** ' + label + ': THE QUEST LINE STOPS BEFORE THE PHONE *** (' + r.q.qRight + ' < ' + r.q.feedLeft + ')',
         !r.q.feedOn || r.q.qRight <= r.q.feedLeft);
      ok(label + ': nothing threw (' + d.errs.length + ')', d.errs.length === 0);
      await d.close();
    } catch (e) {
      ok(label + ' ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
      try { await d.close(); } catch (_e) {}
    }
  }
  done();
})();
