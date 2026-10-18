/* THE ROSTER AND THE POSTS LOOK  (UI lane 11, [the roster and the posts look], 10/10/26)

   PAOLO 10/10, the seventh votes: 'THIS UI IS ASS' (climbing), 'the UI is so dog shit I can't even judge this' (the
   posts). The row: RUN TWO's company screen (the two lines, the man's card: face, stats, stars, perks, the pain line, the
   wage) and the posts (the hire cards) dressed in the materials (cardboard, receipt, tape, cracked glass, the game's type,
   44 pt, left-read), RUN TWO's files untouched, the four screen classes. Drawn by slices/bohemia_ui_materials.js
   (dressRoster, dressPosts, drawStars).

   WHAT THIS HOLDS, through the one driver:
     THE COMPANY SCREEN (slices/BOHEMIA_ROSTER_SCREEN.html), on the four screen classes (phone upright, phone on its
     side, tablet, computer):
       - it wears the materials (the cardboard card, the stats on a receipt, the glass, the receipt DONE) and the
         game's faces are loaded
       - nothing runs off the side of the screen (the line scrolls inside itself, as it was built to)
       - every pressed thing is 44 points: DONE, every cell, every gear slot, every bag slot
     on his phone, upright:
       - no typed star is left on his page; the drawn stars are exactly the man's own stars
       - his gear wears its icons; a real finger takes his weapon off and the bag slot wears the same icon
       - every word passes 4.5 to 1 on what it sits on, plain and in the sun (the name, the line under it, the pain
         line, the stats, the gear labels, DONE, the heads)
       - CLIMBING: with a point to spend the pick is lit amber, read from the left; a real finger opens the perks as
         receipt tags, 44 points, read from the left, and their words pass in the sun
     THE POSTS (the settlement's hall, a town with men for hire):
       - every hire card is a taped cardboard card, the stats on a receipt, the name stamped, the stars drawn (none
         typed), the Hire line 44 points, and its words pass 4.5 to 1 plain and in the sun
     - no page error

   node gates/the_roster_and_posts_look_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE ROSTER AND THE POSTS LOOK: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* each job: {k, box:[x,y,w,h] of ground with no words, ink: css color, dark: ground is dark} */
async function contrasts(page, jobs) {
  const png = (await page.screenshot()).toString('base64');
  return page.evaluate(async ({ png, jobs }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth;
    const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    return jobs.map(j => {
      const b = j.box, d = g.getImageData(Math.round(b[0] * sc), Math.round(b[1] * sc), Math.max(1, Math.round(b[2] * sc)), Math.max(1, Math.round(b[3] * sc))).data;
      const S = []; for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]);
      S.sort((p, q) => LUM(...p) - LUM(...q));
      const bg = S[Math.floor(S.length * (j.dark ? 0.75 : 0.25))], t = j.ink.match(/\d+/g).slice(0, 3).map(Number);
      return { k: j.k, plain: +CR(LUM(...t), LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) };
    });
  }, { png, jobs });
}
const passes = cs => cs.every(c => c.plain >= 4.5 && c.sun >= 4.5);
const show = cs => cs.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', ');
const worst = cs => cs.filter(c => !(c.plain >= 4.5 && c.sun >= 4.5)).map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', ') || ('worst in the sun ' + Math.min(...cs.map(c => c.sun)));

async function roster(profile) {
  const d = await open({ file: 'BOHEMIA_ROSTER_SCREEN.html', bare: true, profile });
  const p = d.page;
  const t0 = Date.now(); while (Date.now() - t0 < 15000) { if (await p.evaluate(() => document.querySelectorAll('.cell.full').length > 0 && !!document.querySelector('#card .stats'))) break; await p.waitForTimeout(250); }
  await p.waitForTimeout(1500);
  return { d, p };
}

(async () => {
  console.log('\nTHE ROSTER AND THE POSTS LOOK  (UI [the roster and the posts look])\n');

  /* ---------- the four screen classes ---------- */
  for (const prof of ['phone_portrait', 'phone_landscape', 'tablet', 'computer']) {
    const { d, p } = await roster(prof);
    const m = await p.evaluate(() => {
      const R = e => { const r = e.getBoundingClientRect(); return { w: r.width, h: r.height }; };
      const fam = n => Array.from(document.fonts).some(f => f.family.replace(/["']/g, '') === n && f.status === 'loaded');
      const bg = s => { const e = document.querySelector(s); return e ? getComputedStyle(e).backgroundImage : ''; };
      return { vw: innerWidth, sw: document.scrollingElement.scrollWidth, dressed: document.documentElement.hasAttribute('data-bm-roster') && !!document.getElementById('bm-roster'),
        faces: fam('BohemiaCasing') && fam('BohemiaROM'), card: /url\(/.test(bg('#card')), stats: /url\(/.test(bg('#card .stats')), glass: /url\(/.test(bg('#card .gslot')), done: /url\(/.test(bg('#done')),
        pressed: [['DONE', R(document.getElementById('done'))]].concat([...document.querySelectorAll('.cell')].map((e, i) => ['cell ' + i, R(e)]), [...document.querySelectorAll('#card .gslot')].map((e, i) => ['gear ' + i, R(e)]), [...document.querySelectorAll('#bag .slot')].map((e, i) => ['bag ' + i, R(e)])) };
    });
    console.log('\n  -- ' + prof + ' ' + m.vw + ' wide\n');
    ok('THE COMPANY SCREEN WEARS THE MATERIALS (the card, the receipt, the glass, DONE on a receipt), the faces loaded', m.dressed && m.faces && m.card && m.stats && m.glass && m.done, JSON.stringify({ dressed: m.dressed, faces: m.faces, card: m.card, stats: m.stats, glass: m.glass, done: m.done }));
    ok('  nothing runs off the side of the screen', m.sw <= m.vw + 1, 'page ' + m.sw + ' on ' + m.vw);
    const small = m.pressed.filter(([, r]) => r.w < 44 || r.h < 44);
    ok('  every pressed thing is 44 points (DONE, ' + m.pressed.filter(x => /cell/.test(x[0])).length + ' cells, the gear, the bag)', small.length === 0, small.slice(0, 4).map(([k, r]) => k + ' ' + Math.round(r.w) + 'x' + Math.round(r.h)).join(', '));
    ok('  no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
    await d.close();
  }

  /* ---------- his page, upright, in detail ---------- */
  console.log('\n  -- his page, on his phone upright\n');
  {
    const { d, p } = await roster('phone_portrait');
    const st = await p.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel];
      return { typed: (document.getElementById('card').textContent.match(/★/g) || []).length, drawn: document.querySelectorAll('#card .bmstar').length,
        drawnW: [...document.querySelectorAll('#card .bmstar')].every(e => e.getBoundingClientRect().width >= 9),
        own: Object.values(m.stars || {}).reduce((a, b) => a + (b | 0), 0), name: m.name,
        gear: [...document.querySelectorAll('#card .gslot')].map(g => ({ slot: g.dataset.slot, full: g.classList.contains('full'), icon: g.querySelector('.bm-icon') ? g.querySelector('.bm-icon').dataset.id : null, want: m.gear[g.dataset.slot] ? m.gear[g.dataset.slot].id : null })) }; });
    ok('NO TYPED STAR IS LEFT ON HIS PAGE; THE DRAWN STARS ARE EXACTLY HIS OWN', st.typed === 0 && st.drawn === st.own && st.own > 0 && st.drawnW, st.name + ': ' + st.drawn + ' drawn, ' + st.own + ' his, ' + st.typed + ' typed');
    ok('HIS GEAR WEARS ITS ICONS, EACH THE ITEM IN THAT SLOT', st.gear.filter(g => g.full).length > 0 && st.gear.every(g => g.full ? g.icon === g.want : !g.icon), st.gear.map(g => g.slot + ' ' + (g.icon || '-')).join(', '));
    /* a real finger takes the weapon off; the bag's slot wears the same icon */
    const main = await p.evaluate(() => { const g = document.querySelector('#card .gslot[data-slot=main]'); const r = g.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, id: BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel].gear.main.id }; });
    await p.touchscreen.tap(main.x, main.y); await p.waitForTimeout(900);
    const bag = await p.evaluate(() => { const S = BohemiaRosterScreen.state, i = S.bag.length - 1, sl = document.querySelectorAll('#bag .slot')[i]; return { n: S.bag.length, id: S.bag[i] && S.bag[i].id, icon: sl && sl.querySelector('.bm-icon') ? sl.querySelector('.bm-icon').dataset.id : null }; });
    ok('  a real finger takes his weapon off, and the bag\'s slot wears the same icon', bag.id === main.id && bag.icon === main.id, 'bag ' + bag.n + ', slot icon ' + bag.icon + ', item ' + bag.id);
    /* put it back so the page reads as he left it */
    await p.evaluate(() => { const sl = document.querySelectorAll('#bag .slot'); sl[sl.length ? BohemiaRosterScreen.state.bag.length - 1 : 0].click(); }); await p.waitForTimeout(700);

    const jobs = await p.evaluate(() => {
      const r = s => { const e = typeof s === 'string' ? document.querySelector(s) : s; return e && e.getBoundingClientRect(); }, c = r('#card'), col = s => getComputedStyle(typeof s === 'string' ? document.querySelector(s) : s).color;
      const J = [];
      ['.nm', '.sub', '.pain'].forEach(s => { const q = r('#card ' + s); if (q) J.push({ k: s.slice(1), box: [c.right - 9, q.top + 2, 5, Math.max(2, q.height - 4)], ink: col('#card ' + s), dark: true }); });
      const st = r('#card .stats'); document.querySelectorAll('#card .stats div > span:first-child').forEach((e, i) => { if (i < 2) J.push({ k: 'stat ' + e.textContent.trim().toLowerCase(), box: [st.left + 12, st.bottom - 11, st.width - 24, 3], ink: getComputedStyle(e).color, dark: false }); });
      document.querySelectorAll('#card .gslot').forEach((g, i) => { if (i > 1) return; const q = g.getBoundingClientRect(), lab = g.querySelector('i'); J.push({ k: 'gear label ' + i, box: [q.right - 8, q.top + 3, 4, 10], ink: getComputedStyle(lab).color, dark: true }); });
      const dn = r('#done'); J.push({ k: 'DONE', box: [dn.right - 9, dn.top + 8, 4, dn.height - 16], ink: col('#done'), dark: false });
      const h = r('.h'); J.push({ k: 'the head', box: [h.right - 14, h.top + 2, 8, Math.max(2, h.height - 4)], ink: col('.h'), dark: true });
      return J;
    });
    const cr = await contrasts(p, jobs);
    ok('EVERY WORD ON HIS PAGE PASSES 4.5 TO 1 ON WHAT IT SITS ON, PLAIN AND IN THE SUN', cr.length >= 8 && passes(cr), worst(cr) + ' | ' + show(cr));

    /* CLIMBING: a point to spend (the screen's own state, as a level-up leaves it), then a real finger */
    const sel = await p.evaluate(() => { const S = BohemiaRosterScreen.state; S.crew[S.sel].points = 1; const r = document.querySelector('.cell.sel').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await p.touchscreen.tap(sel.x, sel.y); await p.waitForTimeout(900);   /* the cells take a finger, not a click: the tap redraws his page */
    const pk = await p.evaluate(() => { const b = document.getElementById('pick'); if (!b) return null; const r = b.getBoundingClientRect(), cs = getComputedStyle(b);
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, bg: cs.backgroundImage, align: cs.textAlign, fam: cs.fontFamily.split(',')[0].replace(/["']/g, ''), ink: cs.color, box: [r.right - 10, r.top + 8, 5, r.height - 16] }; });
    ok('CLIMBING: WITH A POINT TO SPEND THE PICK IS LIT AMBER, STAMPED, READ FROM THE LEFT', !!pk && /rgb\(244, 207, 124\)/.test(pk.bg) && pk.align === 'left' && pk.fam === 'BohemiaCasing' && pk.h >= 44, pk ? pk.bg.slice(0, 40) + ' ' + pk.align + ' ' + pk.fam + ' ' + Math.round(pk.w) + 'x' + Math.round(pk.h) : 'no pick');
    if (pk) {
      await p.touchscreen.tap(pk.x, pk.y); await p.waitForTimeout(800);
      const pl = await p.evaluate(() => [...document.querySelectorAll('.plist button')].filter(b => b.getBoundingClientRect().height > 0).map(b => { const r = b.getBoundingClientRect(), cs = getComputedStyle(b), i = b.querySelector('i');
        return { t: b.firstChild && b.firstChild.textContent, w: r.width, h: r.height, bg: cs.backgroundImage, align: cs.textAlign, ink: cs.color, iInk: i ? getComputedStyle(i).color : cs.color, box: [r.right - 7, r.top + 4, 3, r.height - 12] }; }));
      ok('  a real finger opens the perks: receipt tags, 44 points, read from the left', pl.length > 0 && pl.every(b => /url\(/.test(b.bg) && b.h >= 44 && b.w >= 44 && b.align === 'left'), pl.length + ' perks: ' + pl.slice(0, 3).map(b => b.t).join(', '));
      const c2 = await contrasts(p, [{ k: 'the pick', box: pk.box, ink: pk.ink, dark: false }].concat(...pl.slice(0, 4).map((b, i) => [{ k: 'perk ' + i, box: b.box, ink: b.ink, dark: false }, { k: 'perk line ' + i, box: b.box, ink: b.iInk, dark: false }])));
      ok('  and the pick\'s and the perks\' words pass 4.5 to 1 plain and in the sun', passes(c2), worst(c2));
    } else { ok('  a real finger opens the perks', false, 'no pick'); ok('  and the words pass', false); }
    ok('  no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
    await d.close();
  }

  /* ---------- the posts ---------- */
  console.log('\n  -- the posts, at a town\'s hall\n');
  {
    const d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true });
    const q = d.page;
    const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await q.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.where('hall'))) break; await q.waitForTimeout(200); }
    await q.waitForTimeout(1200);
    await q.evaluate(() => BohemiaSettlement.open({ place: { name: 'Church', tier: 'town', district: 'commercial' }, traits: [], batteries: 200, day: 3 })); await q.waitForTimeout(1200);
    const xy = await q.evaluate(() => BohemiaSettlement.where('hall')); await q.mouse.click(xy.x, xy.y); await q.waitForTimeout(1200);
    const H = await q.evaluate(() => [...document.querySelectorAll('#sbody .hire')].map(h => { const r = h.getBoundingClientRect(), hs = h.querySelector('.hstats'), sr = hs.getBoundingClientRect(), nm = h.querySelector('.nm'), a = h.querySelector('.act');
      return { y: r.top, bg: getComputedStyle(h).backgroundImage, tape: getComputedStyle(h, '::before').backgroundImage, receipt: getComputedStyle(hs).backgroundImage, nmFam: getComputedStyle(nm).fontFamily.split(',')[0].replace(/["']/g, ''),
        typed: (h.textContent.match(/★/g) || []).length, drawn: h.querySelectorAll('.bmstar').length, drawnW: [...h.querySelectorAll('.bmstar')].every(e => e.getBoundingClientRect().width >= 9),
        actH: a ? a.getBoundingClientRect().height : 0, onScreen: r.top >= 0 && r.bottom <= innerHeight,
        jobs: [{ k: 'name', box: [r.right - 10, nm.getBoundingClientRect().top + 2, 5, nm.getBoundingClientRect().height - 4], ink: getComputedStyle(nm).color, dark: true },
               { k: 'stats', box: [sr.left + 10, sr.bottom - 10, sr.width - 20, 3], ink: getComputedStyle(hs.querySelector('span')).color, dark: false }] }; }));
    ok('THE POSTS: EVERY HIRE CARD IS A TAPED CARDBOARD CARD, THE STATS ON A RECEIPT, THE NAME STAMPED', H.length >= 2 && H.every(h => /url\(/.test(h.bg) && /url\(/.test(h.tape) && /url\(/.test(h.receipt) && h.nmFam === 'BohemiaCasing'), H.length + ' cards');
    ok('  the stars drawn, none typed, and the Hire line 44 points', H.every(h => h.typed === 0 && h.drawnW && h.actH >= 44) && H.some(h => h.drawn > 0), H.map(h => h.drawn + ' drawn ' + Math.round(h.actH)).join(', '));
    const vis = H.filter(h => h.onScreen);
    const c3 = await contrasts(q, [].concat(...vis.map((h, i) => h.jobs.map(j => Object.assign({}, j, { k: 'card ' + i + ' ' + j.k })))));
    ok('  and its words pass 4.5 to 1 plain and in the sun', c3.length >= 2 && passes(c3), worst(c3));
    ok('  no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
    await d.close();
  }
  done();
})().catch(e => { console.error(e); process.exit(1); });
