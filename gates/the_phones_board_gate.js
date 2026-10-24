/* THE PHONE'S BOARD  (UI lane 11, [phone contracts], 10/9/26)

   RULE 51c (Paolo 9/30): on the cracked phone in the city view, the settlements' open contracts right now, as the
   feed's 'what the world did' posts: a place posts its ask, the post ages, a taken one disappears; tap one and it is
   marked for the map; NO accept button anywhere on the phone, accepting is the settlement's board from a mouth.
   Built by slices/bohemia_phone_board.js (what) and slices/bohemia_ui_materials.js (the look); the city file only
   includes it.

   RE-AIMED 10/24 BY RULE 148 (Paolo: 'the phone really should only be displaying the top two jobs, the two highest
   paying jobs in the whole Bohemia city, and it doesn't need to display so much information, it's overkill with the amount
   of text you put on the phone'). Nearest first, the handle, the distance, the age and the chat stream are gone from the
   face; the legs that held them now hold the opposite.

   WHAT THIS HOLDS, on the demo's map at his phone's profile through the one driver:
     - the board is on the phone, read from the settlement's own list: TWO JOBS, THE TWO THAT PAY MOST IN THE WHOLE VALLEY,
       two different jobs
     - LITTLE TEXT: the face is the hour and two cards, at most 16 words; no chat post on the glass; a card's what is one
       line of at most 20 letters, then its stars, its pay by the battery mark and its place; no handle, no age, no BATT
     - THE PHONE AGREES WITH THE PLACE: the posted place's own board, opened in the game with a real finger,
       offers that job, at that pay, with those skulls
     - nothing on the phone accepts: no take, accept or sign anywhere on it
     - every card is 44 points tall, inside the glass, the what printed (ROM), the place stamped (CASING), the job's stars
       drawn (146(e)'s star, one to three) and the battery drawn, and its words pass 4.5 to 1 plain and in the sun
     - a real finger marks it for the map (the place and where it is), lights it, shows the job's full words and the one
       touch that goes, and does not open the phone; a second tap clears it
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
    const scr = document.getElementById('cityfeedscreen').getBoundingClientRect(), shown = (window.__PHONE_BOARD || {}).shown || [];
    return [...document.querySelectorAll('#bmboard .fp.job')].map((e, i) => { const r = e.getBoundingClientRect(), f = s => getComputedStyle(e.querySelector(s)), t = e.querySelector('.txt');
      const lh = parseFloat(getComputedStyle(t).lineHeight) || 12;
      const row = shown.find(x => x.id === e.dataset.job && x.place === e.dataset.place) || {};
      return { id: e.dataset.job, place: e.dataset.place, title: row.title || '', skulls: row.skulls || 0, txt: t.textContent, meta: e.querySelector('.meta').textContent,
        stars: e.querySelectorAll('.bmstar').length, starImg: [...e.querySelectorAll('.bmstar')].every(s => /url\(/.test(getComputedStyle(s).backgroundImage)), wantStars: +e.dataset.stars,
        batt: !!e.querySelector('.meta img.batt') && e.querySelector('.meta img.batt').naturalWidth > 0, pay: +e.dataset.pay,
        oneLine: t.scrollWidth <= t.clientWidth + 0.5 && t.getBoundingClientRect().height <= lh * 1.5, go: (e.querySelector('.go') || {}).textContent || '',
        picked: e.classList.contains('picked'), w: r.width, h: r.height,
        inGlass: r.left >= scr.left - .5 && r.right <= scr.right + .5 && r.top >= scr.top && r.bottom <= scr.bottom,
        txtFam: f('.txt').fontFamily.split(',')[0].replace(/["']/g, ''), atFam: f('.meta .at').fontFamily.split(',')[0].replace(/["']/g, ''),
        inks: { txt: f('.txt').color, meta: f('.meta .pay').color, at: f('.meta .at').color },
        box: [ox + r.left + 6, oy + r.bottom - 4, r.width - 12, 2], x: ox + r.left + r.width / 2, y: oy + r.top + 10 }; });
  }, { ox: fb.x, oy: fb.y });
  const base = await fr.evaluate(() => ({ loaded: !!(window.BohemiaPhoneBoard && BohemiaPhoneBoard.loaded()), all: (window.__PHONE_BOARD || {}).asks || 0 }));
  let posts = await read();
  ok('THE BOARD IS ON THE PHONE, read from the settlement\'s own list', base.loaded && posts.length === 2, base.all + ' open asks in the valley; on the glass: ' + posts.map(x => x.place + ': ' + x.txt).join(' | '));
  /* RULE 148: the two shown are the two best paid anywhere in the valley (no ask anywhere pays more than either), and two jobs */
  const pays = await fr.evaluate(() => BohemiaPhoneBoard.asks().map(a => a.pay).sort((a, b) => b - a));
  ok('THE TWO THAT PAY MOST IN THE WHOLE VALLEY (rule 148)', posts.length === 2 && posts.map(x => x.pay).sort((a, b) => b - a).join(',') === pays.slice(0, 2).join(','),
     'shown ' + posts.map(x => x.pay).join(', ') + '; the valley pays ' + pays.slice(0, 8).join(', ') + (pays.length > 8 ? ' ...' : ''));
  ok('  two different jobs', posts.length === 2 && posts[0].id !== posts[1].id, posts.map(x => x.id + '@' + x.place).join(' | '));
  const face = await fr.evaluate(() => { const e = document.getElementById('cityfeed'), vis = n => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(n).visibility !== 'hidden'; };
    return { words: e.innerText.split(/\s+/).filter(Boolean).length, text: e.innerText.replace(/\n/g, ' / '),
      chat: [...e.querySelectorAll('.fp')].filter(n => !n.closest('#bmboard') && vis(n)).length }; });
  ok('LITTLE TEXT: the face is the hour and two cards, at most 16 words, no chat post on the glass', face.words <= 16 && face.chat === 0, face.words + ' words, ' + face.chat + ' chat posts: ' + face.text);
  ok('  each card one short what (one line, at most 20 letters), its stars, pay and place; no handle, no age, no BATT', posts.every(x => x.oneLine && x.txt.length <= 20 && !/@|AGO|POSTED|BATT|BLOCKS/.test(x.txt + x.meta) && x.meta.indexOf(String(x.pay)) >= 0 && x.meta.indexOf(x.place.toUpperCase()) >= 0),
     posts.map(x => '"' + x.txt + '" ' + x.txt.length + (x.oneLine ? ' one line' : ' WRAPS') + ' / ' + x.meta).join(' | '));
  const bad = await fr.evaluate(() => [...document.querySelectorAll('#cityfeed button,#cityfeed [role=button]')].map(e => (e.getAttribute('aria-label') || '') + ' ' + e.textContent).filter(t => /\b(take|accept|sign)\b/i.test(t.replace(/tap to mark it on the map/i, ''))));
  ok('NOTHING ON THE PHONE ACCEPTS A JOB (no take, accept or sign)', bad.length === 0, bad.slice(0, 2).join(' | '));
  ok('EVERY CARD IS 44 POINTS TALL, INSIDE THE GLASS', posts.every(x => x.h >= 44 && x.inGlass), posts.map(x => Math.round(x.w) + 'x' + Math.round(x.h)).join(', '));
  ok('  the what printed (ROM), the place stamped (CASING), the job\'s stars drawn (146(e)), the battery drawn', posts.every(x => x.txtFam === 'BohemiaROM' && x.atFam === 'BohemiaCasing' && x.stars >= 1 && x.stars <= 3 && x.stars === x.wantStars && x.starImg && x.batt),
     posts.map(x => x.txtFam + '/' + x.atFam + ' ' + x.stars + ' star' + (x.batt ? ' + battery' : ' NO BATTERY')).join(', '));
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
  const lit = posts.find(x => x.id === first.id && x.place === first.place) || {};
  ok('  it lights, and the phone does not open under it', lit.picked && mk.wrap === 'none', 'picked ' + lit.picked + ', the open phone ' + mk.wrap);
  ok('  and only now the job\'s full words and the one touch that goes', lit.txt === first.title && lit.go === 'TOUCH ' + first.place.toUpperCase() + ' ON THE MAP', '"' + lit.txt + '" / "' + lit.go + '"');
  cr = await contrasts(p, Object.keys(lit.inks || {}).map(k => ({ k: 'marked ' + k, box: lit.box, ink: lit.inks[k], dark: false })));
  ok('  and the marked post\'s words pass 4.5 to 1 plain and in the sun', cr.every(c => c.plain >= 4.5 && c.sun >= 4.5), cr.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  await p.touchscreen.tap(first.x, first.y); await p.waitForTimeout(1300);
  const un = await fr.evaluate(() => ({ route: window.BOH_PHONE_ROUTE, picked: !!document.querySelector('#bmboard .fp.job.picked') }));
  ok('  a second tap clears it', un.route === null && !un.picked);

  /* THE PHONE AGREES WITH THE PLACE: open that place's settlement, its board, with a real finger */
  const town = await fr.evaluate(name => { const b = ctBases()[name]; return { name, x: b.x, y: b.y, tier: mapTierOf(name) }; }, first.place);
  await fr.evaluate(t => loopOpenTown(t), town);
  const sfh = await fr.waitForSelector('#settleFrame'); const sf = await sfh.contentFrame();
  const t1 = Date.now(); while (Date.now() - t1 < 20000) { if (await sf.evaluate(() => !!(window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.state.place && BohemiaSettlement.where('board'))).catch(() => false)) break; await p.waitForTimeout(300); }
  await p.waitForTimeout(800);
  /* RUN TWO 10/18: the town's ARRIVAL card ([the arrival], 10/18) holds the glass for two seconds and a tap on it only
     skips it, as a player's would; wait for it to go so the finger lands on the board */
  await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 6000 }).catch(() => {});
  const sb = await sfh.boundingBox(), wb = await sf.evaluate(() => BohemiaSettlement.where('board'));
  await p.touchscreen.tap(sb.x + wb.x, sb.y + wb.y); await p.waitForTimeout(1000);
  const board = await sf.evaluate(() => ({ place: BohemiaSettlement.state.place.name, open: BohemiaSettlement.state.open,
    acts: [...document.querySelectorAll('#sbody .act')].map(b => ({ t: (b.querySelector('span') || b).textContent, em: (b.querySelector('em') || {}).textContent || '' })) }));
  const line = board.acts.find(a => a.t === first.title);
  const sk = line ? (line.em.match(/☠/g) || []).length : 0, pay = line ? (line.em.match(/(\d+)\s*batt/) || [])[1] : null;
  ok('THE PHONE AGREES WITH THE PLACE: its own board offers that job, that pay, those skulls', board.open === 'board' && board.place === first.place && !!line && sk === first.skulls && first.meta.indexOf(String(pay)) >= 0 && +pay === first.pay,
     board.place + '\'s board: ' + board.acts.map(a => a.t + ' [' + a.em + ']').join(' | '));
  /* AND EVERY ASK THE PHONE HOLDS FOR THAT PLACE IS ON ITS BOARD, AND NOTHING MORE: one invented job ranked under a real
     one passed the leg above (mutation, 10/9), so the whole list is compared, title, pay and skulls */
  const mine = await fr.evaluate(name => BohemiaPhoneBoard.asks().filter(a => a.place === name).map(a => a.title + '|' + a.pay + '|' + a.skulls).sort(), first.place);
  const theirs = board.acts.filter(a => /batt/.test(a.em)).map(a => a.t + '|' + ((a.em.match(/(\d+)\s*batt/) || [])[1]) + '|' + (a.em.match(/\u2620/g) || []).length).sort();
  ok('  and every ask the phone holds for that place is on its board, and nothing more', mine.length > 0 && mine.join(';') === theirs.join(';'), 'phone ' + mine.join(', ') + ' / board ' + theirs.join(', '));

  /* TAKEN AT THE BOARD WITH A REAL FINGER, IT DISAPPEARS */
  const tap = async sel => { const r = await sf.evaluate(s => { const b = [...document.querySelectorAll('#sbody .act')].find(e => (e.querySelector('span') || e).textContent === s); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel);
    if (r) { await p.touchscreen.tap(sb.x + r.x, sb.y + r.y); await p.waitForTimeout(900); } return !!r; };
  const a1 = await tap(first.title), a2 = await tap('Take it');
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await p.waitForTimeout(2200);
  const after = await fr.evaluate(id => ({ held: LOOP.held.map(h => h.id), onPhone: [...document.querySelectorAll('#bmboard .fp.job')].map(e => e.dataset.job), any: BohemiaPhoneBoard.asks().some(a => a.id === id) }), first.id);
  ok('TAKEN AT THE PLACE\'S BOARD, IT DISAPPEARS FROM THE PHONE', a1 && a2 && after.held.indexOf(first.id) >= 0 && after.onPhone.indexOf(first.id) < 0 && !after.any,
     'held ' + after.held.join(',') + '; on the phone now ' + after.onPhone.join(','));
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
