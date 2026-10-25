/* THE DAYS ONCE  (UI [the top bar, the days once], 10/22/26; rules 121(g) and 123: built into the game, no card)

   HIS NO on the three top bars (ui-the-top-bar-10-19): 'How many times ur gonna show how many days?'. Every bar said
   DAY 1 on its tag and '0 DAYS' beside the food, and the hour twice (the tag and the phone's own clock). The bar in the
   game now (slices/bohemia_ui_materials.js, topBar() and fightNoTop()) prints every fact once. On the DEMO, through the
   one driver, upright and on its side, this holds:
     - the bar is the new one, and the word DAY is on it ONCE; DAYS is never on it; no hour's digits are on it
     - the hour is still on the glass, once: the phone's clock says the game's own hour
     - every count is its own fact, read from the game the same moment: the day, the batteries, the food, the crew
     - a store the game does not count is a dash, never a number; the food is red-inked under three
       RE-AIMED 10/24 (UI [the ten changes: the UI's part], rule 133, TUNING's change 5: 'the bar shows two numbers, not
       five'): the glass carries the batteries and the NIGHTS they feed the crew (the map's bill, window.__BILL), no dash and
       no food; the nights are red-inked at the bill's own red line; '0 DAYS' is planted on the nights now
       RE-AIMED 10/24 AGAIN (UI [the days on hold], rule 151(a), Paolo: 'it shouldn't show me how many days are left on the
       front; if I hold, or if this was a mouse and I hover over the batteries, then it displays how many days I have left
       to fund my crew'): ONE number on the glass, the batteries; a real finger HELD on the pane (the browser's own touch
       input, start and end) shows the nights, the bill's own count, and letting go takes them off; on a computer the mouse
       hovering does the same; at the red line the batteries wear the red tag themselves
     - the gear and NOTES are 44 points or more; the bar fits the glass and nothing on it overlaps
     - the bar's gear opens the game's settings, and the shell's floating gear is not on the glass beside it
     - NOTES is the city's own button (it opens and closes the notes)
     - every word passes 4.5 to 1 on its material, plain and in the sun
     - IN THE FIGHT NOTHING IS ACROSS THE TOP: the strip is gone, the fight measures its top as 0, the round, the
       turn order's faces and AUTO ride the bottom bar, and AUTO still flips the fight
       RE-AIMED 10/25 (UI [one HUD everywhere], rule 190, Paolo: 'why does the UI at the top of the screen on the city map
       have to be different than the settlement UI... why is there not something cohesive'): across the top of the fight
       is THE ONE BAR now, the map's own (gates/one_hud_everywhere_gate.js measures it to the pixel); what this keeps is the
       10/22 half: the FIGHT'S OWN STRIP is never across the top, the board is measured under the one bar and nothing
       more (TOPH is the bar's bottom), the round, the faces and AUTO ride the bottom bar, AUTO flips
     - four planted defects are caught by the same checks: '0 DAYS' back on the food, the hour back on the tag, a
       40-point gear, the strip back over the fight
   node gates/the_days_once_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE DAYS ONCE: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* the bar's checks, run in the city frame; returned as a list of [name, good, detail] so a planted defect can be read
   through exactly the same lines */
const CHECK = () => {
  const out = [], root = document.getElementById('bmtb'), W = innerWidth;
  if (!root) return [['the new bar is on the map', false, 'no #bmtb']];
  const text = root.textContent.replace(/\s+/g, ' ').trim();   /* textContent: the held nights count too, shown or not */
  out.push(['the word DAY is on the bar once', (text.match(/\bDAY\b/g) || []).length === 1, text]);
  out.push(['DAYS is never on the bar', !/\bDAYS?\b.*\bDAYS?\b/.test(text) && !/DAYS/.test(text), text]);
  out.push(['no hour\'s digits on the bar (the phone keeps the hour)', !/\d{1,2}:\d{2}/.test(text), text]);
  const n = s => { const e = root.querySelector('[data-f=' + s + '] b'); return e ? e.textContent.replace(/\/.*/, '').trim() : null; };
  let f = null; try { f = BohemiaMaterials.topBarFacts(); } catch (_e) {}
  const pb = (() => { try { return purseBalances(); } catch (_e) { return {}; } })();
  out.push(['the day is the game\'s day', f && n('day') === 'DAY ' + T.day, n('day') + ' vs ' + T.day]);
  out.push(['the batteries are the purse\'s', String(pb.electricity) === n('batteries'), n('batteries') + ' vs ' + pb.electricity]);
  const B = window.__BILL || {};
  /* RE-AIMED 10/25 (RUN TWO __THE_WAGON__): the night eats the wagon before the batteries, so the nights are the bill's own count
     (the wagon's nights, then the batteries over the full bill: THE WAGON AND THE SIX holds the arithmetic); with no wagon it is
     still the batteries over tonight's bill */
  let wg = null; try { wg = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null'); } catch (_e) {}
  out.push(['the nights are the map\'s bill (the wagon\'s nights, then the batteries over the bill)', B.daysLeft > 0 && n('nights') === String(B.daysLeft) && (wg || (B.perNight > 0 && n('nights') === String(Math.floor(pb.electricity / B.perNight)))), n('nights') + ' vs ' + B.daysLeft]);
  const nt = root.querySelector('[data-f=nights] b');
  out.push(['  red-inked at the bill\'s red line, plain above it', !!nt && nt.classList.contains('low') === !!B.red, nt && nt.className]);
  const bt = root.querySelector('[data-f=batteries] b'), counting = !!root.querySelector('[data-f=batteries].counting');
  out.push(['  and at the red line the batteries wear the red tag themselves (the warning is never only behind a hold)', !!bt && (counting || bt.classList.contains('low') === !!B.red), bt && bt.className]);
  out.push(['the crew is the company the door built', f && f.crew && n('crew') === String(f.crew.length) && root.querySelectorAll('[data-f=crew] .ticks i').length === f.crew.length, n('crew')]);
  const shown = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none'; };
  const held = !!root.querySelector('[data-tb=g].held');
  const figs = [...root.querySelectorAll('[data-tb=g] .s')].filter(shown).map(e => e.dataset.f), dash = [...root.querySelectorAll('[data-tb=g] .s b')].some(e => /^[–-]$/.test(e.textContent.trim()));
  /* RE-AIMED 10/25 (RUN TWO __THE_WAGON__, EYES [eyes: four currencies], rule 164 item 2: 'we have four different currencies... you're
     only showing batteries, it's insane'): the glass carries the batteries and every count the game keeps, in ECONOMY's order (the
     nights still only on a hold), no dash */
  const kept = ['food', 'water', 'tape', 'meds', 'rounds'].filter(k => wg && typeof wg[k] === 'number');
  out.push(['the batteries and every count the game keeps on the glass (the nights only on a hold), no dash', figs.join(' ') === ['batteries'].concat(held ? ['nights'] : [], kept).join(' ') && !dash && !!root.querySelector('[data-f=nights]'), figs.join(' ') + (held ? ' (held)' : '')]);
  const presses = [root.querySelector('.gear'), document.getElementById('notebtn')].map(e => e ? e.getBoundingClientRect() : null);
  out.push(['the gear and NOTES are 44 points or more', presses.every(r => r && r.width >= 44 && r.height >= 44), presses.map(r => r && Math.round(r.width) + 'x' + Math.round(r.height)).join(' ')]);
  const boxes = [...root.querySelectorAll('.t,#notebtn,.g')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0);
  out.push(['the bar fits the glass', boxes.every(r => r.left >= 0 && r.right <= W + 0.5), boxes.map(r => Math.round(r.right)).join(' ') + ' of ' + W]);
  let lap = 0; for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) { const a = boxes[i], b = boxes[j];
    if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5) lap++; }
  out.push(['nothing on the bar overlaps', lap === 0, lap + ' overlaps']);
  const pc = document.getElementById('cityfeedclock'), hr = String(clockStr()).split('·').pop().trim();
  out.push(['the hour is on the glass once, the phone\'s clock, the game\'s own hour', !!pc && pc.textContent.trim() === hr && pc.getBoundingClientRect().width > 0, pc && pc.textContent + ' vs ' + hr]);
  return out;
};
const FIGHT = () => {
  const out = [], top = document.getElementById('top'), bot = document.getElementById('bot');
  /* RE-AIMED 10/25 (rule 190): the one bar is the fight's top; the fight's own strip is not across it */
  const bar = top.querySelector('#bmtb'), own = ['round', 'order', 'bauto', 'speedpad'].filter(id => { const e = document.getElementById(id); return e && top.contains(e); });
  out.push(['in the fight the fight\'s own strip is not across the top (the one bar is)', !!bar && own.length === 0, (bar ? 'the bar' : 'no bar') + (own.length ? ', ' + own.join(' ') + ' up there' : '')]);
  out.push(['  the fight measures its top as the one bar\'s bottom, nothing more', !!bar && TOPH === Math.round(top.getBoundingClientRect().bottom) && TOPH <= 110, 'TOPH ' + TOPH]);
  out.push(['  the round, the faces and AUTO ride the bottom bar', !!bot.querySelector('#round') && !!bot.querySelector('#bauto') && bot.querySelectorAll('#order canvas').length > 0,
    bot.querySelectorAll('#order canvas').length + ' faces']);
  const r = document.getElementById('bauto').getBoundingClientRect();
  out.push(['  AUTO is 44 points and on the glass', r.width >= 44 && r.height >= 44 && r.bottom <= innerHeight && r.top >= 0, Math.round(r.width) + 'x' + Math.round(r.height)]);
  return out;
};

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000 }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr;
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await p.waitForTimeout(1200);
    const c = await fr.evaluate('(' + CHECK.toString() + ')()');
    c.forEach(([m, g, x]) => ok(m, g, x));
    /* THE DAYS ON HOLD (rule 151(a)): a real finger held on the batteries' pane, through the browser's own touch input */
    {
      const fbx = await (await fr.frameElement()).boundingBox();
      const pane = await fr.evaluate(() => { const r = document.querySelector('#bmtb [data-f=batteries]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      const X = fbx.x + pane.x, Y = fbx.y + pane.y, cdp = await p.context().newCDPSession(p);
      const nights = () => fr.evaluate(() => { const e = document.querySelector('#bmtb [data-f=nights]'), r = e.getBoundingClientRect();
        return { on: r.width > 0 && getComputedStyle(e).display !== 'none', txt: e.textContent.replace(/\s+/g, ' ').trim(), n: (e.querySelector('b') || {}).textContent, bill: (window.__BILL || {}).daysLeft,
          inGlass: r.right <= innerWidth + 0.5, lap: (() => { const w = document.querySelector('#bmtb [data-f=place]'); if (!w || !(r.width > 0)) return 0; const q = w.getBoundingClientRect();
            return Math.min(r.right, q.right) - Math.max(r.left, q.left) > 0.5 && Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top) > 0.5 ? 1 : 0; })() }; });
      const before = await nights();
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: X, y: Y }] }); await p.waitForTimeout(700);
      const during = await nights();
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(500);
      const after = await nights();
      ok('THE DAYS ON HOLD: off the glass until held', !before.on, before.on ? 'shown: ' + before.txt : 'hidden');
      ok('  a real finger held on the batteries shows the nights, the bill\'s own count, on the glass, over nothing', during.on && String(during.n) === String(during.bill) && /NIGHTS? LEFT/.test(during.txt) && during.inGlass && !during.lap,
         during.txt + ' (bill ' + during.bill + ')' + (during.lap ? ' OVER THE PLACE' : ''));
      ok('  and letting go takes them off', !after.on, after.on ? 'still shown' : 'gone');
      await cdp.detach().catch(() => {});
    }
    /* the shell's floating gear is not on the glass beside the bar's */
    const sg = await p.evaluate(() => getComputedStyle(document.getElementById('gearbtn')).display);
    ok('the shell\'s floating gear is not on the glass beside the bar\'s', sg === 'none', sg);
    /* words on their material, plain and in the sun (the maps bar's read, the frame's offset added) */
    const words = await fr.evaluate(() => { const box = e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }, R = document.getElementById('bmtb');
      const w = [['the day on receipt', R.querySelector('[data-f=day] b'), 'right'], ['NOTES on receipt', document.getElementById('noteplate'), 'right'],
        ['the crew on receipt', R.querySelector('[data-f=crew] b'), 'right'], ['a count on glass', R.querySelector('[data-f=batteries] b'), 'right'],
        ['the place on glass', R.querySelector('[data-f=place]'), 'right']].filter(x => x[1]);
      const fe = window.frameElement ? window.frameElement.getBoundingClientRect() : { x: 0, y: 0 };
      return w.map(x => ({ k: x[0], box: box(x[1]), col: getComputedStyle(x[1]).color, side: x[2], off: [fe.x, fe.y] })); });
    const png = (await p.screenshot()).toString('base64');
    const cr = await p.evaluate(async ({ png, words }) => {
      const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const sc = im.width / innerWidth, LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
      const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
      return words.map(w => { const [x, y, ww, hh] = w.box, X = x + w.off[0], Y = y + w.off[1];
        /* the ground just right of the word, inside its own material */
        const bx = [X + ww + 1, Y + 2, 2, Math.max(2, hh - 4)];
        const d = g.getImageData(Math.round(bx[0] * sc), Math.round(bx[1] * sc), Math.max(1, Math.round(bx[2] * sc)), Math.max(1, Math.round(bx[3] * sc))).data, S = [];
        for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]); S.sort((p, q) => LUM(...p) - LUM(...q));
        const t = w.col.match(/\d+/g).slice(0, 3).map(Number), tl = LUM(...t), bg = S[Math.floor(S.length * (tl > 0.3 ? 0.8 : 0.2))];
        return { k: w.k, plain: +CR(tl, LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) }; });
    }, { png, words });
    ok('every word passes 4.5 to 1 on its material, plain and in the sun', cr.length >= 4 && cr.every(c => c.plain >= 4.5 && c.sun >= 4.5), cr.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
    if (profile === 'phone_portrait') {
      /* the narrowest phone anybody holds: every fact still there, nothing past the glass, nothing on top of anything */
      const was = p.viewportSize(); await p.setViewportSize({ width: 320, height: 700 }); await p.waitForTimeout(900);
      const n320 = await fr.evaluate('(' + CHECK.toString() + ')()');
      const want = ['the word DAY is on the bar once', 'the bar fits the glass', 'nothing on the bar overlaps', 'the gear and NOTES are 44 points or more', 'the batteries and every count the game keeps on the glass (the nights only on a hold), no dash'];
      ok('at 320 wide every fact stays, it fits, nothing overlaps, every press 44', want.every(w => (n320.find(x => x[0] === w) || [0, false])[1]),
        n320.filter(x => want.indexOf(x[0]) >= 0 && !x[1]).map(x => x[0] + ' ' + x[2]).join(' | '));
      await p.setViewportSize(was); await p.waitForTimeout(900);
      /* the planted defects, read through the same checks, then taken back out */
      const caught = await fr.evaluate(chk => { const C = eval('(' + chk + ')'), red = () => C().some(x => !x[1]), R = document.getElementById('bmtb'), got = {};
        const fb = R.querySelector('[data-f=nights]'), em = document.createElement('em'); em.textContent = '0 DAYS'; fb.appendChild(em); got.days = red(); em.remove();
        fb.style.setProperty('display', 'inline-flex', 'important'); got.nights = red(); fb.style.removeProperty('display');
        const db = R.querySelector('[data-f=day]'), hr = document.createElement('i'); hr.textContent = '06:00'; db.appendChild(hr); got.hour = red(); hr.remove();
        const gb = R.querySelector('.gear'); gb.style.width = '40px'; got.gear = red(); gb.style.width = '';
        got.clean = !red(); return got; }, CHECK.toString());
      ok('PLANTED: \'0 DAYS\' on the nights is caught', caught.days);
      ok('PLANTED: the nights back on the glass without a hold is caught', caught.nights);
      ok('PLANTED: the hour back on the day tag is caught', caught.hour);
      ok('PLANTED: a 40-point gear is caught', caught.gear);
      ok('  and the bar reads clean again once they are taken out', caught.clean);
      /* the bar's gear opens the settings; NOTES opens and closes the notes */
      const off = await p.evaluate(() => { const r = document.getElementById('cityFrame').getBoundingClientRect(); return [r.x, r.y]; });
      const at = async sel => { const b = await fr.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel); return b && [b[0] + off[0], b[1] + off[1]]; };
      let g = await at('#bmtb .gear'); await p.mouse.click(g[0], g[1]); await p.waitForTimeout(700);
      const setOn = await p.evaluate(() => { const w = document.getElementById('setwrap'); return !!w && w.classList.contains('on'); });
      ok('the bar\'s gear opens the game\'s settings', setOn);
      await p.evaluate(() => { const w = document.getElementById('setwrap'); if (w) w.classList.remove('on'); });
      await p.waitForTimeout(300);
      g = await at('#notebtn'); await p.mouse.click(g[0], g[1]); await p.waitForTimeout(500);
      const nOpen = await fr.evaluate(() => document.getElementById('notewrap').classList.contains('on'));
      await fr.evaluate(() => document.getElementById('noteback').click()); await p.waitForTimeout(300);
      const nShut = await fr.evaluate(() => !document.getElementById('notewrap').classList.contains('on'));
      ok('NOTES is the city\'s own button: it opens the notes and they close', nOpen && nShut, nOpen + ' ' + nShut);
    }
    /* a road fight, the game's own */
    const st = await fr.evaluate(async () => { for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); try { stepOnce(0); stepOnce(4); } catch (_e) {}
      return roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }); });
    let f = null; for (let i = 0; i < 150; i++) { const h = await p.$('#fightFrame'); if (h) { f = await h.contentFrame();
      if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false)) break; } await p.waitForTimeout(200); }
    if (!f) { ok('a road fight opened', false, String(st)); }
    else {
      await p.waitForTimeout(2500);
      const fc = await f.evaluate('(' + FIGHT.toString() + ')()'); fc.forEach(([m, g, x]) => ok(m, g, x));
      const au = await f.evaluate(() => { const b = document.getElementById('bauto'); const was = FIGHT_UI.auto; b.click(); const now = FIGHT_UI.auto; b.click(); return [was, now, FIGHT_UI.auto]; });
      ok('  AUTO still flips the fight', au[0] !== au[1] && au[2] === au[0], au.join(' '));
      if (profile === 'phone_portrait') {
        const back = await f.evaluate(chk => { const C = eval('(' + chk + ')'), r = document.getElementById('round'), was = r.parentNode, nx = r.nextSibling; document.getElementById('top').appendChild(r);
          const red = C().some(x => !x[1]); was.insertBefore(r, nx); return red; }, FIGHT.toString());
        ok('PLANTED: the strip back over the fight is caught', back);
      }
    }
    ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  await side('phone_portrait');
  await side('phone_landscape');
  done();
})().catch(e => { console.error(e); process.exit(1); });
