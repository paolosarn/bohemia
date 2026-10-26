/* THE FLIP OFF THE FACE  (UI lane 11, [the flip off the face], 10/11/26)

   PAOLO, his eleventh votes: 'it's not until an endgame crisis, in one timeline, that you can switch; you click the phone
   and it's in the menu; it will never be on the UI display of the phone itself; I can't believe you went this long with
   that on the phone.' The row: nothing on the phone's face switches acts; after the crisis unlocks it (rule 85) a tap opens
   the phone and the switch is one entry there; before the unlock the entry does not exist. DYNASTY's crisis door unchanged.
   The layout is slices/bohemia_ui_materials.js's (flipOffTheFace); DYNASTY's strip and flip are used as they are.

   WHAT THIS HOLDS, on the demo's map at his phone's profile through the one driver:
     BEFORE THE CRISIS
       - nothing on the phone's face switches acts: no family card is painted on it
       - a real finger opens the phone, and there is no switch anywhere in it
     AFTER THE CRISIS (the game's own door, BohemiaActs.crisis)
       - the phone's face still carries no family card
       - the opened phone carries ONE entry, SWITCH TIMELINE, a receipt read from the left, stamped, 44 points, its words
         4.5 to 1 plain and in the sun
       - a real finger on it opens the family under it, every card 44 points, and a real finger on a card makes it the
         one you are
       - CLOSE shuts the panel with the phone; opened again, the entry is there and the panel shut
     - no page error

   RE-AIMED 10/26 BY UI TWO (rules 212, 213): the phone on the map is the new one in his corner (#bohphone, drawn by the
   shell); the old opened phone with DYNASTY's SWITCH TIMELINE is reached from the new phone's status bar, where a TIMELINE
   tag stands only after the crisis, and one finger on it opens the family under SWITCH TIMELINE. The legs keep what they
   protect: nothing on the phone's face switches acts; no door before the crisis; after it, one door, the entry, the family
   44 points, a card flips, CLOSE shuts the panel.

   node gates/the_flip_off_the_face_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE FLIP OFF THE FACE: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  console.log('\nTHE FLIP OFF THE FACE  (UI [the flip off the face])\n');
  const d = await open({ door: 120000 });
  if (!d.doorIsBehindUs()) { ok('the driver got past the door', false); await d.close(); done(); }
  const p = d.page, fr = d.fr;
  await p.waitForTimeout(6000);
  const fb = await (await fr.frameElement()).boundingBox();
  const R = sel => fr.evaluate(s => [...document.querySelectorAll(s)].map(e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    return { x: r.x, y: r.y, w: r.width, h: r.height, vis: cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0 && !!e.offsetParent }; }), sel);
  const tapAt = async r => { await p.touchscreen.tap(fb.x + r.x + r.w / 2, fb.y + r.y + Math.min(r.h / 2, 16)); await p.waitForTimeout(1000); };
  const faceCards = async () => (await R('#cityfeedscreen .af')).filter(r => r.vis).length + await p.evaluate(() => document.querySelectorAll('#bohphone .af').length);
  const tag = () => p.evaluate(() => { const e = document.querySelector('#bohphone .stat .tl'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).display !== 'none' ? { x: r.x, y: r.y, w: r.width, h: r.height } : null; });
  const tapTag = async () => { const r = await tag(); if (!r) return false; await p.touchscreen.tap(r.x + r.w / 2, r.y + r.h / 2); await p.waitForTimeout(1600); return true; };
  const isOpen = () => fr.evaluate(() => document.getElementById('phonewrap').classList.contains('on'));

  /* ---- before the crisis ---- */
  await fr.evaluate(() => { BohemiaActs.resetAll(); try { ctActFlipPaint(); } catch (e) {} });
  await p.waitForTimeout(900);
  ok('BEFORE THE CRISIS: NOTHING ON THE PHONE\'S FACE SWITCHES ACTS (no family card painted on it)', (await faceCards()) === 0, (await faceCards()) + ' cards on the face');
  const t0 = await tag(), e0 = (await R('#bmtimes')).filter(r => r.vis);
  ok('  and there is no door to a switch anywhere: no TIMELINE tag on the phone, no entry', !t0 && e0.length === 0, 'tag ' + !!t0 + ', entries ' + e0.length);

  /* ---- after the crisis ---- */
  await fr.evaluate(() => { BohemiaActs.crisis(90); try { ctActFlipPaint(); } catch (e) {} });
  await p.waitForTimeout(1400);
  ok('AFTER THE CRISIS: THE PHONE\'S FACE STILL CARRIES NO FAMILY CARD', (await faceCards()) === 0, (await faceCards()) + ' cards on the face');
  ok('  and the phone\'s status bar carries one TIMELINE tag, the door', !!(await tag()));
  await tapTag();
  const ent = await fr.evaluate(() => { const b = document.getElementById('bmtimes'); if (!b || !b.offsetParent) return null; const r = b.getBoundingClientRect(), cs = getComputedStyle(b);
    /* UI 10/23 [the UI the Crashbox way]: the entry is a tin slab lit from the left, so its words are read against the ground
       just right of the words themselves (the text's own box), not against the slab's shaded right bevel */
    const tw = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let n, best = null; while ((n = tw.nextNode())) if (n.textContent.trim() && (!best || n.textContent.trim().length > best.textContent.trim().length)) best = n;
    const rg = document.createRange(); if (best) rg.selectNodeContents(best); const tr = best ? rg.getBoundingClientRect() : r;
    return { n: document.querySelectorAll('#bmtimes').length, t: b.textContent, x: r.x, y: r.y, w: r.width, h: r.height, tx: tr.x, ty: tr.y, tw: tr.width, th: tr.height, bg: cs.backgroundImage, fam: cs.fontFamily.split(',')[0].replace(/["']/g, ''), align: cs.textAlign, ink: cs.color }; });
  ok('THE OPENED PHONE CARRIES ONE ENTRY, SWITCH TIMELINE: a receipt, stamped, read from the left, 44 points',
     !!ent && ent.n === 1 && /SWITCH TIMELINE/.test(ent.t) && /url\(/.test(ent.bg) && ent.fam === 'BohemiaCasing' && ent.align === 'left' && ent.h >= 44 && ent.w >= 44,
     ent ? ent.t + ' ' + Math.round(ent.w) + 'x' + Math.round(ent.h) + ' ' + ent.fam + ' ' + ent.align : 'no entry');
  if (ent) {
    const png = (await p.screenshot()).toString('base64');
    const cr = await p.evaluate(async ({ png, box, ink }) => {
      const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const sc = im.width / innerWidth, d = g.getImageData(Math.round(box[0] * sc), Math.round(box[1] * sc), Math.round(box[2] * sc), Math.round(box[3] * sc)).data;
      const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
      const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
      const S = []; for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]); S.sort((p, q) => LUM(...p) - LUM(...q));
      const bg = S[Math.floor(S.length * 0.25)], t = ink.match(/\d+/g).slice(0, 3).map(Number);
      return { plain: +CR(LUM(...t), LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) };
    }, { png, box: [fb.x + ent.tx + ent.tw + 2, fb.y + ent.ty + 2, 4, Math.max(2, ent.th - 4)], ink: ent.ink });
    ok('  its words pass 4.5 to 1 plain and in the sun', cr.plain >= 4.5 && cr.sun >= 4.5, cr.plain + '/' + cr.sun);
    const cards = (await R('#bmtimespanel .af')).filter(r => r.vis);
    ok('ONE FINGER ON THE TAG OPENS THE FAMILY UNDER IT, every card 44 points', cards.length >= 2 && cards.every(c => c.w >= 44 && c.h >= 44), cards.length + ' cards: ' + cards.map(c => Math.round(c.w) + 'x' + Math.round(c.h)).join(', '));
    const before = await fr.evaluate(() => BohemiaActs.current());
    if (cards[1]) await tapAt(cards[1]);
    const after = await fr.evaluate(() => BohemiaActs.current());
    ok('  and a real finger on a card makes it the one you are', after !== before, 'act ' + before + ' -> ' + after);
    ok('  and the phone\'s face still carries none', (await faceCards()) === 0);
    await fr.evaluate(() => { const c = document.getElementById('phoneclose'); if (c) c.click(); }); await p.waitForTimeout(900);
    await fr.evaluate(() => { try { phoneOpen(); } catch (e) {} }); await p.waitForTimeout(900);   /* the opened phone again, by its own door */
    const again = await fr.evaluate(() => ({ open: document.getElementById('phonewrap').classList.contains('on'), entry: !!(document.getElementById('bmtimes') || {}).offsetParent, panel: (document.getElementById('bmtimespanel') || { classList: { contains: () => false } }).classList.contains('on') }));
    ok('CLOSE SHUTS THE PANEL WITH THE PHONE; OPENED AGAIN, THE ENTRY IS THERE AND THE PANEL SHUT', again.open && again.entry && !again.panel, JSON.stringify(again));
  } else { ok('  its words pass', false); ok('A REAL FINGER ON IT OPENS THE FAMILY', false); ok('  a card flips', false); ok('  the face carries none', false); ok('CLOSE SHUTS THE PANEL', false); }
  await fr.evaluate(() => { try { BohemiaActs.resetAll(); } catch (e) {} });
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
