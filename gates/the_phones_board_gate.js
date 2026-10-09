/* THE PHONE'S BOARD  (UI lane 11, [phone contracts], 10/9/26)

   RULE 51c (Paolo 9/30): on the cracked phone in the city view, the settlements' open contracts right now, as the
   feed's 'what the world did' posts: a place posts its ask, the post ages, a taken one disappears; tap one and it is
   marked for the map; NO accept button anywhere on the phone, accepting is the settlement's board from a mouth.
   Built by slices/bohemia_phone_board.js (what) and slices/bohemia_ui_materials.js (the look); the city file only
   includes it.

   WHAT THIS HOLDS, on the demo's map at his phone's profile through the one driver:
     - the board is on the phone, read from the settlement's own list, two posts from two places, nearest first
     - THE PHONE AGREES WITH THE PLACE: the posted place's own board, opened in the game with a real finger,
       offers that job, at that pay, with those skulls
     - nothing on the phone accepts: no take, accept or sign anywhere on it
     - every post is a world post 44 points tall, inside the glass, the handle stamped (CASING), the ask printed
       (ROM), the skulls drawn, and its words pass 4.5 to 1 plain and in the sun, marked or not
     - a real finger marks it for the map (the place and where it is), lights it, and does not open the phone;
       a second tap clears it
     - the post ages with the game's clock
     - TAKEN AT THE PLACE'S BOARD WITH A REAL FINGER, IT DISAPPEARS FROM THE PHONE
     - no page error

   node gates/the_phones_board_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE PHONE\'S BOARD: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

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

(async () => {
  console.log('\nTHE PHONE\'S BOARD  (UI [phone contracts], rule 51c)\n');
  const d = await open({ door: 120000 });
  if (!d.doorIsBehindUs()) { ok('the driver got past the door', false); await d.close(); done(); }
  const p = d.page, fr = d.fr;
  const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await fr.evaluate(() => document.querySelectorAll('#bmboard .fp.job').length > 0)) break; await p.waitForTimeout(300); }
  await p.waitForTimeout(800);
  const fb = await (await fr.frameElement()).boundingBox();

  const read = () => fr.evaluate(({ ox, oy }) => {
    const scr = document.getElementById('cityfeedscreen').getBoundingClientRect();
    return [...document.querySelectorAll('#bmboard .fp.job')].map(e => { const r = e.getBoundingClientRect(), f = s => getComputedStyle(e.querySelector(s));
      return { id: e.dataset.job, place: e.dataset.place, who: e.querySelector('.who').textContent, txt: e.querySelector('.txt').textContent, meta: e.querySelector('.meta').textContent,
        skulls: e.querySelectorAll('.sk').length, skImg: [...e.querySelectorAll('.sk')].every(s => /url\(/.test(getComputedStyle(s).backgroundImage)),
        picked: e.classList.contains('picked'), world: e.classList.contains('world'), w: r.width, h: r.height,
        inGlass: r.left >= scr.left - .5 && r.right <= scr.right + .5 && r.top >= scr.top && r.bottom <= scr.bottom,
        whoFam: f('.who').fontFamily.split(',')[0].replace(/["']/g, ''), txtFam: f('.txt').fontFamily.split(',')[0].replace(/["']/g, ''),
        inks: { who: f('.who').color, txt: f('.txt').color, meta: f('.meta').color },
        box: [ox + r.left + 6, oy + r.bottom - 4, r.width - 12, 2], x: ox + r.left + r.width / 2, y: oy + r.top + 10 }; });
  }, { ox: fb.x, oy: fb.y });
  const base = await fr.evaluate(() => ({ loaded: !!(window.BohemiaPhoneBoard && BohemiaPhoneBoard.loaded()), all: (window.__PHONE_BOARD || {}).asks || 0 }));
  let posts = await read();
  ok('THE BOARD IS ON THE PHONE, read from the settlement\'s own list', base.loaded && posts.length === 2, base.all + ' open asks in the valley; on the glass: ' + posts.map(x => x.place + ': ' + x.txt).join(' | '));
  ok('  two posts from two places, nearest first, as world posts', posts.length === 2 && posts[0].place !== posts[1].place && posts.every(x => x.world),
     posts.map(x => x.who).join(' | '));
  const bad = await fr.evaluate(() => [...document.querySelectorAll('#cityfeed button,#cityfeed [role=button]')].map(e => (e.getAttribute('aria-label') || '') + ' ' + e.textContent).filter(t => /\b(take|accept|sign)\b/i.test(t.replace(/tap to mark it on the map/i, ''))));
  ok('NOTHING ON THE PHONE ACCEPTS A JOB (no take, accept or sign)', bad.length === 0, bad.slice(0, 2).join(' | '));
  ok('EVERY POST IS 44 POINTS TALL, INSIDE THE GLASS', posts.every(x => x.h >= 44 && x.inGlass), posts.map(x => Math.round(x.w) + 'x' + Math.round(x.h)).join(', '));
  ok('  the handle stamped (CASING), the ask printed (ROM), the skulls drawn', posts.every(x => x.whoFam === 'BohemiaCasing' && x.txtFam === 'BohemiaROM' && x.skulls >= 1 && x.skImg),
     posts.map(x => x.whoFam + '/' + x.txtFam + ' ' + x.skulls + ' skull').join(', '));
  let cr = await contrasts(p, [].concat(...posts.map((x, i) => Object.keys(x.inks).map(k => ({ k: i + ' ' + k, box: x.box, ink: x.inks[k], dark: true })))));
  ok('  and its words pass 4.5 to 1 plain and in the sun', cr.every(c => c.plain >= 4.5 && c.sun >= 4.5), cr.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));

  /* A REAL FINGER MARKS IT */
  const first = posts[0];
  await p.touchscreen.tap(first.x, first.y); await p.waitForTimeout(1300);
  const mk = await fr.evaluate(() => ({ route: window.BOH_PHONE_ROUTE, wrap: getComputedStyle(document.getElementById('phonewrap')).display, bs: ctBases() }));
  posts = await read();
  const want = mk.bs && mk.bs[first.place];
  ok('A REAL FINGER MARKS IT FOR THE MAP: the place and where it is', !!mk.route && mk.route.place === first.place && mk.route.id === first.id && want && mk.route.x === want.x && mk.route.y === want.y,
     JSON.stringify(mk.route));
  ok('  it lights, and the phone does not open under it', posts[0].picked && mk.wrap === 'none', 'picked ' + posts[0].picked + ', the open phone ' + mk.wrap);
  cr = await contrasts(p, Object.keys(posts[0].inks).map(k => ({ k: 'marked ' + k, box: posts[0].box, ink: posts[0].inks[k], dark: false })));
  ok('  and the marked post\'s words pass 4.5 to 1 plain and in the sun', cr.every(c => c.plain >= 4.5 && c.sun >= 4.5), cr.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  await p.touchscreen.tap(first.x, first.y); await p.waitForTimeout(1300);
  const un = await fr.evaluate(() => ({ route: window.BOH_PHONE_ROUTE, picked: !!document.querySelector('#bmboard .fp.job.picked') }));
  ok('  a second tap clears it', un.route === null && !un.picked);

  /* THE POST AGES WITH THE GAME'S CLOCK */
  await fr.evaluate(() => { T.min += 180; }); await p.waitForTimeout(1500);
  posts = await read();
  ok('THE POST AGES WITH THE GAME\'S CLOCK', posts.length > 0 && /3H AGO/.test(posts[0].meta), posts.map(x => x.meta).join(' | '));

  /* THE PHONE AGREES WITH THE PLACE: open that place's settlement, its board, with a real finger */
  const town = await fr.evaluate(name => { const b = ctBases()[name]; return { name, x: b.x, y: b.y, tier: mapTierOf(name) }; }, first.place);
  await fr.evaluate(t => loopOpenTown(t), town);
  const sfh = await fr.waitForSelector('#settleFrame'); const sf = await sfh.contentFrame();
  const t1 = Date.now(); while (Date.now() - t1 < 20000) { if (await sf.evaluate(() => !!(window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.state.place && BohemiaSettlement.where('board'))).catch(() => false)) break; await p.waitForTimeout(300); }
  await p.waitForTimeout(800);
  const sb = await sfh.boundingBox(), wb = await sf.evaluate(() => BohemiaSettlement.where('board'));
  await p.touchscreen.tap(sb.x + wb.x, sb.y + wb.y); await p.waitForTimeout(1000);
  const board = await sf.evaluate(() => ({ place: BohemiaSettlement.state.place.name, open: BohemiaSettlement.state.open,
    acts: [...document.querySelectorAll('#sbody .act')].map(b => ({ t: (b.querySelector('span') || b).textContent, em: (b.querySelector('em') || {}).textContent || '' })) }));
  const line = board.acts.find(a => a.t === first.txt);
  const sk = line ? (line.em.match(/☠/g) || []).length : 0, pay = line ? (line.em.match(/(\d+)\s*batt/) || [])[1] : null;
  ok('THE PHONE AGREES WITH THE PLACE: its own board offers that job, that pay, those skulls', board.open === 'board' && board.place === first.place && !!line && sk === first.skulls && first.meta.indexOf(pay + ' BATT') >= 0,
     board.place + '\'s board: ' + board.acts.map(a => a.t + ' [' + a.em + ']').join(' | '));
  /* AND EVERY ASK THE PHONE HOLDS FOR THAT PLACE IS ON ITS BOARD, AND NOTHING MORE: one invented job ranked under a real
     one passed the leg above (mutation, 10/9), so the whole list is compared, title, pay and skulls */
  const mine = await fr.evaluate(name => BohemiaPhoneBoard.asks().filter(a => a.place === name).map(a => a.title + '|' + a.pay + '|' + a.skulls).sort(), first.place);
  const theirs = board.acts.filter(a => /batt/.test(a.em)).map(a => a.t + '|' + ((a.em.match(/(\d+)\s*batt/) || [])[1]) + '|' + (a.em.match(/\u2620/g) || []).length).sort();
  ok('  and every ask the phone holds for that place is on its board, and nothing more', mine.length > 0 && mine.join(';') === theirs.join(';'), 'phone ' + mine.join(', ') + ' / board ' + theirs.join(', '));

  /* TAKEN AT THE BOARD WITH A REAL FINGER, IT DISAPPEARS */
  const tap = async sel => { const r = await sf.evaluate(s => { const b = [...document.querySelectorAll('#sbody .act')].find(e => (e.querySelector('span') || e).textContent === s); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel);
    if (r) { await p.touchscreen.tap(sb.x + r.x, sb.y + r.y); await p.waitForTimeout(900); } return !!r; };
  const a1 = await tap(first.txt), a2 = await tap('Take it');
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await p.waitForTimeout(2200);
  const after = await fr.evaluate(id => ({ held: LOOP.held.map(h => h.id), onPhone: [...document.querySelectorAll('#bmboard .fp.job')].map(e => e.dataset.job), any: BohemiaPhoneBoard.asks().some(a => a.id === id) }), first.id);
  ok('TAKEN AT THE PLACE\'S BOARD, IT DISAPPEARS FROM THE PHONE', a1 && a2 && after.held.indexOf(first.id) >= 0 && after.onPhone.indexOf(first.id) < 0 && !after.any,
     'held ' + after.held.join(',') + '; on the phone now ' + after.onPhone.join(','));
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
