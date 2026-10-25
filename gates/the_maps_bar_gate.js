/* THE MAP'S BAR  (UI lane 11, [six icons] + [the map's bar], 10/5/26)

   His fifth votes on THE SIX IN THE BAR: A, 'the icons could use work'. Rule 67a: ONE UI across map,
   settlement and fight. Rule 73: words 4.5 to 1, and again with 25 percent white added (the sun test).
   slices/bohemia_ui_materials.js: supplyIcon(kind), dressMapBar(); the city includes the file.

   WHAT THIS HOLDS, on the DEMO's map (what a friend gets) at his phone's profile through the one driver:
     - the six are DRAWN objects from the materials file (not the old flat marks), six different pictures,
       10 points each so the bar still fits, in rule 47a's order
     - the bar is the cut cardboard; what is printed (the hour, the place, NOTES) is on receipt; the six are
       counted on a pane of glass; the speed pad is glass panes on a card, the current speed lit amber, square
       corners, every plate still a thumb
     - every word passes 4.5 to 1 on its material, and again in the sun
     - no page error

   node gates/the_maps_bar_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE MAP\'S BAR: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  console.log('\nTHE MAP\'S BAR  (UI [six icons] + [the map\'s bar], rule 67a)\n');
  let d;
  try { d = await open({ door: 120000 }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return done(); }
  if (!d.doorIsBehindUs()) { ok('REFUSING TO REPORT: the door never opened', false); await d.close(); return done(); }
  await d.page.waitForTimeout(3500);
  const a = await d.fr.evaluate(() => {
    const bg = el => el ? getComputedStyle(el).backgroundImage : '';
    /* UI 10/22 [the top bar, the days once]: on the demo's map the bar is the materials file's #bmtb (B with every fact once:
       the day on receipt, the stores on glass at 20 points, tape left off as dead, NOTES moved in); the old strip is hidden */
    const NEW = !!document.getElementById('bmtb');
    const six = Array.from(document.querySelectorAll(NEW ? '#bmtb .s[data-f]' : '#barread .sx')).map(s => { const im = s.querySelector('img'), r = im ? im.getBoundingClientRect() : null;
      return { k: NEW ? s.dataset.f : s.dataset.s, img: !!im, src: im ? im.src.slice(-40) : '', w: r ? Math.round(r.width) : 0, nat: im ? im.naturalWidth : 0, pack: !!(im && /supply_icons\/\w+\.png$/.test(im.src)), drawn: !!(im && window.BohemiaMaterials && im.src === BohemiaMaterials.supplyIcon(NEW ? s.dataset.f : s.dataset.s)) }; });
    const hour = document.querySelector(NEW ? '#bmtb [data-f=day]' : '#barread .rd[data-k="hour"]'), sixP = document.querySelector(NEW ? '#bmtb .g' : '#barread .rd.six'), note = document.getElementById(NEW ? 'notebtn' : 'noteplate');
    const pad = document.getElementById('speedpad'), plates = pad ? Array.from(pad.querySelectorAll('.sp')) : [];
    const box = el => { const r = el.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; };
    /* UI 10/23 [the UI the Crashbox way]: a tag is now a tin slab lit from the left, its right bevel in shade, so a word is
       read against the ground right beside it, inside the slab (the word's own box, read off its text) */
    const tbox = el => { const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n, best = null;
      while ((n = tw.nextNode())) if (n.textContent.trim() && (!best || n.textContent.trim().length > best.textContent.trim().length)) best = n;
      if (!best) return box(el); const rg = document.createRange(); rg.selectNodeContents(best); const r = rg.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; };
    return { NEW, BILL: !!(window.__BILL && typeof window.__BILL.daysLeft === 'number'), six, mats: { bar: /url\(/.test(bg(document.getElementById('menubar'))), hour: /url\(/.test(bg(hour)), note: /url\(/.test(bg(note)), six: /url\(/.test(bg(sixP)),
        pad: /url\(/.test(bg(pad)), plates: plates.every(p => /url\(/.test(bg(p)) || p.classList.contains('now')), lit: plates.filter(p => p.classList.contains('now')).every(p => /gradient|ui_kit\/tin_amber/.test(bg(p))) },
      radius: pad ? parseFloat(getComputedStyle(pad).borderTopLeftRadius) : null, thumbs: plates.map(p => [Math.round(p.getBoundingClientRect().width), Math.round(p.getBoundingClientRect().height)]),
      words: [ { k: NEW ? 'the day on receipt' : 'the hour on receipt', box: tbox(hour), col: getComputedStyle(hour).color, side: 'text' },
               { k: 'NOTES on receipt', box: tbox(note), col: getComputedStyle(note).color, side: 'text' },
               { k: 'a count on glass', box: box(sixP), col: getComputedStyle(sixP.querySelector('b')).color, side: 'right' } ]
        .concat(plates.filter(p => !p.classList.contains('now')).slice(0, 1).map(p => ({ k: 'a speed on glass', box: tbox(p), col: getComputedStyle(p).color, side: 'text' })))
        .concat(plates.filter(p => p.classList.contains('now')).map(p => ({ k: 'the lit speed', box: tbox(p), col: getComputedStyle(p).color, side: 'text' }))),
      off: (() => { const r = window.frameElement ? window.frameElement.getBoundingClientRect() : { x: 0, y: 0 }; return [r.x, r.y]; })() };
  });
  /* RE-AIMED 10/24 (UI [the ten changes: the UI's part], rule 133, TUNING's change 5: 'the bar shows two numbers, not five'): with
     the map's nightly bill in, the glass carries the batteries and the nights they feed the crew, both drawn here */
  /* RE-AIMED 10/25 (UI [the PC playtest: the UI's part] (2), rule 164 item 2; his UP 10/17 on ui-the-six-at-pack-pixels-10-13, set A;
     ECONOMY's six): a supply on the glass is HIS PACK'S PROP at the pack's floor (32 points), standing only while the game counts it
     (the batteries today; gates/the_six_on_the_bar_gate.js holds the six); the nights behind the hold stay the drawn moon at 20 */
  ok('THE SIX ARE HIS PACK\'S PROPS IN ECONOMY\'S ORDER, THE NIGHTS THE MATERIALS\' DRAWN MOON (with the bill: the batteries and the nights)', a.six.map(s => s.k).join(' ') === (a.NEW ? (a.BILL ? 'batteries nights' : 'batteries') : 'batteries food meds rounds water') && a.six.every(s => s.k === 'nights' ? s.drawn : (a.NEW ? s.pack : s.drawn)),
     a.six.map(s => s.k + (s.k === 'nights' ? (s.drawn ? '' : ' NOT DRAWN') : (s.pack ? ' (pack)' : ' NOT THE PACK'))).join(' '));
  ok('  different pictures, 10 points each on the old strip; on the bar the pack props 32, the drawn moon 20 (0 while it waits behind the hold, 151(a))', new Set(a.six.map(s => s.src)).size === a.six.length && a.six.every(s => (a.NEW && s.k === 'nights') ? (s.w === 20 || s.w === 0) : s.w === (a.NEW ? 32 : 10)), a.six.map(s => s.k + ' ' + s.w).join(', '));
  ok('THE BAR IS CUT CARDBOARD; THE HOUR, THE PLACE AND NOTES ARE RECEIPT; THE SIX ARE ON GLASS', a.mats.bar && a.mats.hour && a.mats.note && a.mats.six, JSON.stringify(a.mats));
  ok('THE SPEED PAD IS GLASS ON A CARD, the current speed lit amber, square corners', a.mats.pad && a.mats.plates && a.mats.lit && a.radius <= 2, 'radius ' + a.radius);
  ok('  every plate still a thumb', a.thumbs.length === 5 && a.thumbs.every(t => t[0] >= 44 && t[1] >= 44), JSON.stringify(a.thumbs));
  /* words on their material, off the glass (the frame's offset added) */
  const png = (await d.page.screenshot()).toString('base64');
  const cr = await d.page.evaluate(async ({ png, words, off }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth, LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    return words.map(w => { const [x, y, ww, hh] = w.box, X = x + off[0], Y = y + off[1];
      const bx = w.side === 'text' ? [X + ww + 1, Y + 2, 2, Math.max(2, hh - 4)] :   /* the days once's own read: the ground the word sits on, not the slab's slope beyond it */ w.side === 'right' ? [X + ww - 5, Y + 3, 3, hh - 6] : [X + 3, Y + 3, 4, hh - 6];
      const d = g.getImageData(Math.round(bx[0] * sc), Math.round(bx[1] * sc), Math.max(1, Math.round(bx[2] * sc)), Math.max(1, Math.round(bx[3] * sc))).data, S = [];
      for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]); S.sort((p, q) => LUM(...p) - LUM(...q));
      const t = w.col.match(/\d+/g).slice(0, 3).map(Number), tl = LUM(...t), bg = S[Math.floor(S.length * (tl > 0.3 ? 0.8 : 0.2))];
      return { k: w.k, plain: +CR(tl, LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) }; });
  }, { png, words: a.words, off: a.off });
  ok('EVERY WORD PASSES 4.5 TO 1 ON ITS MATERIAL, AND IN THE SUN', cr.length >= 5 && cr.every(c => c.plain >= 4.5 && c.sun >= 4.5), cr.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
