#!/usr/bin/env node
/* THE FEED IS ALIVE (FEED lane 23, row [the feed is alive], Paolo 10/26 rule 215; rule 217 for the usernames).

   His words: 'a part of the game managing all these mini events and triggers, presented in a social media thing, to make it feel
   alive... pretty much tweets... organize it properly so every time we upgrade it gets better, realistic vibes.'
   The row's gate: a played hour on the map makes posts of all three kinds, each from a named account, none twice in a row word for
   word, paced inside the file's limits; every deed the file names posts; a new row makes a new kind with no code change.

   A. THE FILE (records/target/bb/feed_kinds.json), read as data:
      A1 every kind has an id, a source of the three, a trigger, words, what it teaches; every line draft:true
      A2 every account a handle, none alike (case blind); every face field present and empty (rule 217(a))
      A3 every 'who' finds at least one mouth; every 'by' names a real account or tag
      A4 every deed the row names has a kind that must post (never dropped)
      A5 no em dash anywhere (CLAUDE.md)
      A6 the file is what WORDS' bank and FEED's rows make (tools/bohemia_feed_build.py --check)
   B. THE ENGINE, A PLAYED DAY ON THE MAP'S OWN CLOCK (engine/bohemia_feedstream.js, headless; the map's measured clock: 13 game
      minutes a 500 ms beat while he travels, stopped a quarter of the time):
      B1 a played hour of real time makes all three kinds
      B2 every post from an account in the file, with its handle; no portrait on any post
      B3 none twice in a row word for word
      B4 paced inside the file: no window holds more than its cap (plus the big boost when one is running); the glass never gets two
         posts closer than real_gap_s while the clock runs; at least one post in every played real minute of travel
      B5 every deed the file names posts: each fired once makes its kind's post
      B6 a new row in the file makes a new kind with no code change
      B7 the player's page never speaks Spanglish and a bot never does; the locals sit near the house rate (rule 143(a))
      B8 a stopped clock: a deed still posts within seconds; the talk waits for the clock
      B9 a save and a load carry the feed on
   C. THE LIVE DEMO, phone and computer, the map as a stranger meets it:
      C1 the engine is up on the map and holds every kind of the file (read at boot)
      C2 the company's own page posts when the game starts
      C3 a job taken (the game's own loopTakeContract) posts; dropped (WORLD's own drop) posts
      C4 a town opened (the map's own loopOpenTown) posts
      C5 CAMP (the real button) runs the clock and the city talks: posts of all three kinds, from handles in the file
      C6 the newest post is on the phone (the handle and the words in the slot), nothing over the map
      C7 nothing thrown
   Run: node gates/the_feed_is_alive_gate.js [--headless] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + String(why).slice(0, 400) + ']' : '')); };

const FILE_PATH = path.join(ROOT, 'records/target/bb/feed_kinds.json');
const RAW = fs.readFileSync(FILE_PATH, 'utf8');
const FILE = JSON.parse(RAW);
const S = require(path.join(ROOT, 'engine/bohemia_feedstream.js'));
const SP = require(path.join(ROOT, 'engine/bohemia_spanglish.js'));

/* the deeds the row names, and the trigger each one is */
const DEEDS = { 'a job taken': 'job.taken', 'a job done': 'job.done', 'a job dropped': 'job.dropped', 'a fight won': 'fight.won',
  'a fight lost': 'fight.lost', 'a fight fled': 'fight.fled', 'a man hired': 'man.hired', 'a man dismissed': 'man.dismissed',
  'a man hurt': 'man.hurt', 'a man dead': 'man.dead', 'a town entered': 'town.entered', 'a rare man seen': 'rare.seen' };
/* what the map hands the engine every beat (the block __THE_FEED_IS_ALIVE__ in BOHEMIA_CITY_WORLD.html) */
const CTX = { company: 'Night Shift', companyhandle: 'nightshift', town: 'Church', night_from: 18, night_to: 6, high: 107, low: 81,
  lights: 212, minutes: 7, district: 'suburb', road: 'Flamingo' };
const SAMPLE = { job: 'Ride carts to Primm', client: 'ROSA', town: 'BLUES', pay: 135, stars: 2, enemy: 'Road crews', enemy_faction: 'brigands',
  count: 4, lost: 0, man: 'TOMAS', background: 'bus driver', crew: 4, injury: 'a cracked rib', days: 9, title: 'road knight', rare: 'a road knight', price: 500, good: 'water',
  faction: 'Blues', faction_name: 'Blues', agenda: 'caravan', toward: 'Trades', was: 'Remnants', key: 'food', now: 8, origin: 'a new crew', start: 290,
  paid: 12, days_left: 6 };

console.log('='.repeat(74));
console.log('THE FEED IS ALIVE: one file of post kinds, one engine, the map\'s own moments, the phone reads one function');
console.log('='.repeat(74));

/* ---------------- A. THE FILE ---------------- */
{
  const SRC = ['mine', 'world', 'life'];
  const bad = FILE.kinds.filter(k => !k.id || /[^a-z0-9_]/.test(k.id) || SRC.indexOf(k.source) < 0 || !k.trigger || !(k.words || []).length || !k.teaches);
  const undrafted = [];
  FILE.kinds.forEach(k => [].concat(k.words || [], ...(k.replies || []).map(r => r.words || []), ...(k.follow_up || []).map(f => f.words || []))
    .forEach(w => { if (!w || w.draft !== true || !(w.en || w.text)) undrafted.push(k.id); }));
  leg(bad.length === 0 && undrafted.length === 0 && FILE.kinds.length >= 30,
    'A1  EVERY KIND A ROW: id, one of the three, a trigger, words, what it teaches; every line draft:true', FILE.kinds.length + ' kinds; bad ' + bad.map(k => k.id) + '; undrafted ' + undrafted.slice(0, 5));
  const handles = FILE.accounts.map(a => String(a.handle || '').toLowerCase());
  const dup = handles.filter((h, i) => !h || handles.indexOf(h) !== i);
  const faces = FILE.accounts.filter(a => !(a.face === '' || (a.face && typeof a.face === 'object' && a.face.portrait == null)));
  leg(dup.length === 0 && faces.length === 0 && FILE.accounts.length >= 30,
    'A2  EVERY ACCOUNT A USERNAME, NONE ALIKE, EVERY FACE FIELD EMPTY FOR LATER (rule 217)', FILE.accounts.length + ' accounts; dup ' + dup + '; faces ' + faces.map(a => a.id));
  const ids = {}, tags = {};
  FILE.accounts.forEach(a => { ids[a.id] = a; (a.tags || []).forEach(t => { tags[t] = 1; }); });
  const lost = [];
  const facs = {}; FILE.accounts.forEach(a => { if (a.faction) facs[String(a.faction).toLowerCase()] = 1; });
  const pools = { same: 1, faction: 1, town: 1, toward: 1, valley: 1, scanner: 1, stranger: 1, company: 1 };   /* WORDS' pools and FEED's */
  const okWho = w => pools[w] || ids[w] || (w.indexOf('tag:') === 0 && tags[w.slice(4)])
    || (w.indexOf('faction:') === 0 && facs[w.slice(8).toLowerCase()]);
  const okBy = b => pools[b] || ids[b] || (b.indexOf('tag:') === 0 && tags[b.slice(4)]);
  FILE.kinds.forEach(k => {
    [].concat(k.who || []).forEach(w => { if (!okWho(w)) lost.push(k.id + ' who ' + w); });
    (k.replies || []).concat(k.follow_up || []).forEach(r => [].concat(r.who || []).forEach(w => { if (!okWho(w)) lost.push(k.id + ' reply who ' + w); }));
    [].concat(k.words || []).forEach(w => [].concat(w.by || []).forEach(b => { if (!okBy(b)) lost.push(k.id + ' by ' + b); }));
  });
  leg(lost.length === 0, 'A3  EVERY "WHO" FINDS A MOUTH, EVERY "BY" NAMES A REAL ACCOUNT OR TAG', lost.slice(0, 6).join('; ') || 'all resolve');
  const musts = Object.keys(DEEDS).filter(n => !FILE.kinds.some(k => [].concat(k.trigger).indexOf(DEEDS[n]) >= 0 && (k.must === true || (k.must == null && k.source === 'mine'))));
  leg(musts.length === 0, 'A4  EVERY DEED THE ROW NAMES HAS A KIND THAT MUST POST', musts.join(', ') || Object.keys(DEEDS).length + ' deeds');
  leg(RAW.indexOf('\u2014') < 0, 'A5  NO EM DASH IN THE FILE');
  /* A6: the one file is WORDS' bank (who speaks, what is said) and FEED's rows (when, how often), joined by the tool */
  let fresh = '';
  try { fresh = require('child_process').execFileSync('python3', [path.join(ROOT, 'tools/bohemia_feed_build.py'), '--check'], { cwd: ROOT, encoding: 'utf8' }); }
  catch (e) { fresh = String((e.stdout || '') + (e.stderr || '')); }
  leg(/^FRESH/.test(fresh.trim()), 'A6  THE FILE IS WORDS\' BANK AND FEED\'S ROWS, JOINED BY THE TOOL, BYTE FOR BYTE', fresh.trim());
}

/* ---------------- B. THE ENGINE, A PLAYED DAY ---------------- */
function play(seed, realMinutes, opt) {
  opt = opt || {};
  let real = 0;
  const E = S.engine(opt.file || FILE, { seed: seed, say: SP.say, spanglish: SP, realNow: () => real });
  let t = 1440 + 360;
  E.tick(t, CTX);
  const log = [];
  E.on(p => log.push({ real: real, moving: opt._moving, p: p }));
  E.fire('game.start', SAMPLE);
  const beats = realMinutes * 120;
  const evAt = {};
  (opt.events || []).forEach((e, i) => { evAt[Math.floor((i + 1) * beats / ((opt.events || []).length + 1))] = e; });
  for (let b = 1; b <= beats; b++) {
    real += 500;
    if (evAt[b]) E.fire(evAt[b][0], Object.assign({}, SAMPLE, evAt[b][1] || {}));
    const moving = (b % 120) < 90;   /* travel 45 s, stand 15 s */
    opt._moving = moving;
    if (moving) t += 13;
    E.tick(t);
  }
  return { E, log, real };
}
{
  const ev = [['party.moved'], ['town.entered'], ['job.taken'], ['party.sighted'], ['fight.won'], ['man.hurt'], ['job.done'], ['man.hired'],
    ['scarce.down'], ['raid', { faction: 'Cartel', faction_name: 'Cartel', town: 'Caravans' }], ['man.dead', { man: 'IVY' }]];
  const R = play('gate-hour', 60, { events: ev });
  const posts = R.log.map(x => x.p);
  const by = { mine: 0, world: 0, life: 0 };
  posts.forEach(p => { by[p.kind]++; });
  leg(by.mine > 0 && by.world > 0 && by.life > 0, 'B1  A PLAYED HOUR (REAL TIME, THE MAP\'S CLOCK) MAKES ALL THREE KINDS', JSON.stringify(by) + ' of ' + posts.length);
  const handleOf = {}; FILE.accounts.forEach(a => { handleOf[a.id] = a.handle; });
  const nameless = posts.filter(p => !handleOf[p.account] || !p.handle || p.face !== '');
  leg(nameless.length === 0 && posts.length > 0, 'B2  EVERY POST FROM AN ACCOUNT IN THE FILE, WITH ITS HANDLE, NO PORTRAIT', nameless.length + ' without; e.g. ' + (posts[0] && posts[0].handle));
  let rep = 0; for (let i = 1; i < posts.length; i++) if (posts[i].text === posts[i - 1].text) rep++;
  leg(rep === 0, 'B3  NONE TWICE IN A ROW WORD FOR WORD', rep + ' repeats in ' + posts.length);
  /* B4: the windows, the glass, the minutes */
  const P = R.E.pace;
  let over = 0, worst = 0, close = 0, emptyMin = 0;
  posts.forEach((p, i) => {
    const inWin = posts.filter(q => q.at > p.at - P.window_min && q.at <= p.at).length;
    const cap = P.per_window.max + P.big.extra;   /* the boost is the most a window may ever hold */
    worst = Math.max(worst, inWin); if (inWin > cap) over++;
  });
  for (let i = 1; i < R.log.length; i++) if (R.log[i].real - R.log[i - 1].real < P.real_gap_s * 1000 && R.log[i].moving) close++;
  for (let m = 0; m < 60; m++) { const n = R.log.filter(x => x.real > m * 60000 && x.real <= (m + 1) * 60000).length; if (!n) emptyMin++; }
  leg(over === 0 && close === 0 && emptyMin === 0,
    'B4  PACED INSIDE THE FILE: no window over its cap, the glass never under real_gap_s, never a silent minute',
    'worst window ' + worst + ' (cap ' + (P.per_window.max + P.big.extra) + '), close ' + close + ', silent minutes ' + emptyMin + ', posts a real minute ' + (posts.length / 60).toFixed(1));
  /* B5: every deed, once, alone */
  const missing = [];
  Object.keys(DEEDS).forEach(n => {
    let real = 0;
    const E = S.engine(FILE, { seed: 'deed-' + n, say: SP.say, spanglish: SP, realNow: () => real });
    let t = 1440 + 600; E.tick(t, CTX);
    const got = [];
    E.on(p => got.push(p));
    E.fire(DEEDS[n], SAMPLE);
    for (let b = 0; b < 240; b++) { real += 500; t += 13; E.tick(t); }
    const rows = FILE.kinds.filter(k => [].concat(k.trigger).indexOf(DEEDS[n]) >= 0).map(k => k.id);
    if (!got.some(p => rows.indexOf(p.type) >= 0)) missing.push(n);
  });
  leg(missing.length === 0, 'B5  EVERY DEED THE FILE NAMES POSTS (each fired once makes its kind\'s post)', missing.join(', ') || Object.keys(DEEDS).length + ' of ' + Object.keys(DEEDS).length);
  /* B6: a new row, no code */
  const F2 = JSON.parse(RAW);
  F2.kinds.push({ id: 'gate_new_kind', source: 'world', trigger: 'gate.new.event', who: ['tag:local'], delay_min: [0, 1], must: true,
    teaches: 'a modder adds a kind', words: [{ text: 'the gate made a new kind of post about {town}.', draft: true }] });
  let real6 = 0; const E6 = S.engine(F2, { seed: 'b6', realNow: () => real6 }); let t6 = 2000; E6.tick(t6, { company: 'X', town: 'Blues' });
  E6.fire('gate.new.event', { town: 'BLUES' }); for (let b = 0; b < 40; b++) { real6 += 500; t6 += 13; E6.tick(t6); }
  const p6 = E6.read().filter(p => p.type === 'gate_new_kind');
  leg(p6.length === 1 && /Blues/.test(p6[0].text), 'B6  A NEW ROW IN THE FILE IS A NEW KIND, NO CODE CHANGE', p6[0] ? p6[0].handle + ': ' + p6[0].text : 'none');
  /* B7: who speaks Spanglish */
  const big = play('gate-spanglish', 240, { events: [] });
  const isEs = t => SP.esIn(t).length > 0;
  const acc = {}; FILE.accounts.forEach(a => { acc[a.id] = a; });
  const spoke = x => x.p.form === 'es' || isEs(x.p.text);
  const playerEs = big.log.filter(x => acc[x.p.account].kind === 'company' && spoke(x)).length;
  const botEs = big.log.filter(x => acc[x.p.account].kind === 'bot' && spoke(x)).length;
  const locals = big.log.filter(x => acc[x.p.account].kind === 'local' || acc[x.p.account].kind === 'person');
  const share = locals.filter(x => x.p.form === 'es').length / Math.max(1, locals.length);
  leg(playerEs === 0 && botEs === 0 && share >= 0.06 && share <= 0.30,
    'B7  HIS PAGE NEVER SPEAKS SPANGLISH, A BOT NEVER DOES, THE LOCALS NEAR THE HOUSE RATE',
    'player ' + playerEs + ', bots ' + botEs + ', locals ' + (share * 100).toFixed(1) + '% of ' + locals.length + ' (the dial rolls every line: 10 to 15 percent, leaners at 25)');
  /* B8: the clock stopped */
  let real8 = 0; const E8 = S.engine(FILE, { seed: 'b8', say: SP.say, spanglish: SP, realNow: () => real8 }); const t8 = 3000;
  E8.tick(t8, CTX);
  E8.fire('job.taken', SAMPLE);
  for (let b = 0; b < 12; b++) { real8 += 500; E8.tick(t8); }
  /* the deed itself posts; its replies (the talk around it) wait for the clock */
  const mine8 = E8.read().filter(p => /^job_taken/.test(p.type) && !p.reply_to).length, talk8 = E8.read().filter(p => !!p.reply_to).length;
  leg(mine8 >= 1 && talk8 === 0, 'B8  THE CLOCK STOPPED (A TOWN): HIS DEED POSTS WITHIN SECONDS, THE TALK WAITS FOR THE CLOCK', 'page ' + mine8 + ', locals ' + talk8 + ' after 6 s');
  /* B9: save and load */
  const Ea = play('b9', 3, { events: [['job.taken'], ['fight.won']] }).E;
  const saved = JSON.parse(JSON.stringify(Ea.save()));
  const Eb = S.engine(FILE, { seed: 'b9b' }); Eb.load(saved);
  const n0 = Eb.read().length; let tb = saved.now; for (let b = 0; b < 400; b++) { tb += 13; Eb.tick(tb); }
  leg(n0 === Ea.read().length && n0 > 0 && Eb.read().length > n0, 'B9  A SAVE AND A LOAD CARRY THE FEED ON', n0 + ' posts carried, ' + (Eb.read().length - n0) + ' after');
}

/* ---------------- C. THE LIVE DEMO ---------------- */
async function live(profile) {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ profile: profile });
  const p = d.page, fr = d.fr;
  try {
    await p.waitForTimeout(2500); try { await d.clearCards(); } catch (_e) {}
    await fr.waitForFunction(() => window.BohemiaFeed && BohemiaFeed.ready(), null, { timeout: 60000 }).catch(() => {});
    const c1 = await fr.evaluate(() => ({ ready: !!(window.BohemiaFeed && BohemiaFeed.ready()), kinds: window.BohemiaFeed ? BohemiaFeed.kinds().length : 0 }));
    leg(c1.ready && c1.kinds === FILE.kinds.length, 'C1  [' + profile + '] THE ENGINE IS UP ON THE MAP WITH EVERY KIND OF THE FILE (read at boot)', JSON.stringify(c1) + ' file ' + FILE.kinds.length);
    await p.waitForTimeout(4000);
    const c2 = await fr.evaluate(() => BohemiaFeed.read().filter(x => x.type === 'game_start').map(x => x.handle + ': ' + x.text));
    leg(c2.length === 1, 'C2  [' + profile + '] HIS COMPANY\'S PAGE POSTS WHEN THE GAME STARTS', c2[0] || 'none');
    /* a job, the game's own way in and WORLD's own way out */
    await fr.waitForFunction(() => window.BohemiaPhoneBoard && BohemiaPhoneBoard.asks().length > 0, null, { timeout: 60000 }).catch(() => {});
    const took = await fr.evaluate(() => { const o = BohemiaPhoneBoard.asks()[0]; if (!o) return null; LOOP.open = { name: o.place, x: o.x, y: o.y, tier: o.tier };
      const ok = loopTakeContract({ id: o.id, title: o.title, pay: o.pay, skulls: o.skulls }); LOOP.open = null; return ok ? { id: o.id, title: o.title, place: o.place } : null; });
    await p.waitForTimeout(16000);
    const dropped = await fr.evaluate((id) => { try { return BohemiaJobKinds.drop(id).ok; } catch (e) { return false; } }, took && took.id);
    await p.waitForTimeout(16000);
    const c3 = await fr.evaluate(() => BohemiaFeed.read().filter(x => /^job_/.test(x.type)).map(x => x.type + ' ' + x.handle + ': ' + x.text));
    leg(!!took && dropped && c3.some(x => /^job_taken/.test(x)) && c3.some(x => /^job_dropped/.test(x)),
      'C3  [' + profile + '] A JOB TAKEN (the game\'s own loopTakeContract) POSTS, DROPPED (WORLD\'s own drop) POSTS', c3.join(' | ') || 'none');
    /* a town, the map's own door */
    const town = await fr.evaluate(() => { const b = ctBases(), n = Object.keys(b)[0]; loopOpenTown({ name: n, x: b[n].x, y: b[n].y, tier: 'town' }); return n; });
    await p.waitForTimeout(16000);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    const c4 = await fr.evaluate(() => BohemiaFeed.read().filter(x => x.type === 'town_entered').map(x => x.handle + ': ' + x.text));
    leg(c4.length >= 1, 'C4  [' + profile + '] A TOWN OPENED (the map\'s own loopOpenTown) POSTS', town + ': ' + (c4[0] || 'none'));
    /* CAMP: the real button runs the clock */
    const fb = await p.evaluate(() => { const r = document.getElementById('cityFrame').getBoundingClientRect(); return { x: r.x, y: r.y }; });
    const cb = await fr.evaluate(() => { try { campBtnPaint(); } catch (e) {} const b = document.getElementById('campbtn'); if (!b || b.style.display === 'none') return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    const t0 = await fr.evaluate(() => DAY.day * 1440 + DAY.min), n0 = await fr.evaluate(() => BohemiaFeed.stats().posts);
    if (cb) { if (profile === 'computer') await p.mouse.click(fb.x + cb.x, fb.y + cb.y); else await p.touchscreen.tap(fb.x + cb.x, fb.y + cb.y); }
    await p.waitForTimeout(75000);
    const c5 = await fr.evaluate(() => ({ t: DAY.day * 1440 + DAY.min, st: BohemiaFeed.stats(), posts: BohemiaFeed.read({ limit: 80 }) }));
    const handles = {}; FILE.accounts.forEach(a => { handles[a.id] = 1; });
    const kinds = { mine: 0, world: 0, life: 0 }; c5.posts.forEach(x => { kinds[x.kind]++; });
    const strangers = c5.posts.filter(x => !handles[x.account] || !x.handle);
    leg(!!cb && c5.t - t0 >= 240 && c5.st.posts > n0 && kinds.mine > 0 && kinds.world > 0 && kinds.life > 0 && strangers.length === 0,
      'C5  [' + profile + '] CAMP (THE REAL BUTTON) RUNS THE CLOCK AND THE CITY TALKS, FROM HANDLES IN THE FILE',
      'camp ' + !!cb + ', ' + Math.round((c5.t - t0) / 60) + ' game hours, posts ' + n0 + ' -> ' + c5.st.posts + ' ' + JSON.stringify(kinds) + '; newest: ' + (c5.posts[0] ? c5.posts[0].handle + ': ' + c5.posts[0].text : '-'));
    /* the phone: the newest post in its slot */
    const c6 = await fr.evaluate(() => { const s = document.getElementById('feednow'), f = document.getElementById('cityfeed'); const n = BohemiaFeed.read({ limit: 1 })[0];
      if (!s || !n) return { slot: !!s, post: !!n };
      const r = s.getBoundingClientRect(), fr2 = f ? f.getBoundingClientRect() : null;
      return { shown: s.classList.contains('has') && r.height > 10 && getComputedStyle(s).display !== 'none', inPhone: !!fr2 && r.top >= fr2.top - 1 && r.bottom <= fr2.bottom + 1 && r.left >= fr2.left - 1 && r.right <= fr2.right + 1,
        who: (s.querySelector('.fwho') || {}).textContent, txt: (s.querySelector('.ftxt') || {}).textContent, newest: n.handle, newestTxt: n.text, phoneOn: !!(f && f.classList.contains('on')) }; });
    leg(c6.shown && c6.inPhone && c6.who && c6.who.indexOf(c6.newest) === 0 && c6.txt === c6.newestTxt,
      'C6  [' + profile + '] THE NEWEST POST IS ON THE PHONE, INSIDE ITS GLASS (the handle and the words), NOTHING OVER THE MAP', JSON.stringify(c6));
    try { await p.screenshot({ path: path.join(require('os').tmpdir(), 'the_feed_is_alive_' + profile + '.png') }); } catch (_e) {}   /* the picture, for a person to look at; never committed */
    leg(d.errs.length === 0, 'C7  [' + profile + '] NOTHING THROWN', d.errs.slice(0, 3).join(' | ') || '0 page errors');
  } finally { await d.close(); }
}

(async () => {
  if (process.argv.indexOf('--headless') < 0) {
    for (const prof of ['phone_portrait', 'computer']) {
      try { await live(prof); } catch (e) { leg(false, 'C   [' + prof + '] the live legs ran', String(e).slice(0, 300)); }
    }
  }
  console.log('-'.repeat(74));
  console.log('THE FEED IS ALIVE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
