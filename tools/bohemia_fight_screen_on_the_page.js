#!/usr/bin/env node
/* ============================================================================
   FIGHT SCREEN: THE WHY LINE PROVEN ON THE PAGE HE PLAYS (rule 449(a), ask row 617; rule 441(a): the alpha and the demo, a phone
   upright and sideways, started the way he starts it; a headless pass alone is not proof)

   Opens the real page (the alpha or the demo) the way a stranger opens it (the title, NEW GAME, BEGIN, GO), on a phone upright
   (390 x 844) or on its side (844 x 390), walks off the town and starts each fight through THE MAP'S OWN DOOR: the first by the
   map's own road crew (roadContactFight, the way the demo's driver starts one), the rest by the map's own hand-over
   (cityHandOver in the map's frame) with the message each of its callers builds (a job's leg, a road stop, a party that hunted
   him down, a party he chased, a raid on his place, a place's fight, a boss). In every fight, read off the page:
     - the one sentence came, after the first second, from a face (a drawn portrait: its pixels are counted), with a name;
     - it is true to the door's word (how) and to who stands on the board (their kinds), said by THEIR man when they are men
       and by HIS man when they are beasts, the dead or machines alone;
     - its card is whole on the glass (inside the screen, no word cut: the text's box against the card's);
     - it never stops the fight: a finger presses FIGHT / AUTO while it is up and the fight's log grows under it; it goes by
       itself with no tap; the veteran's lesson and the crew's commentary are never up with it;
     - page errors are counted; stills at the sentence, and one with the old page (WHY_BEFORE=<dir holding main's BOHEMIA_FIGHT.html>).
   The first fight of a run is played to its end on AUTO and left by the end screen's LEAVE; the others are pulled out of
   (RETREAT, then LEAVE), so the next one starts from the map again.
   node tools/bohemia_fight_screen_on_the_page.js <alpha|demo> <upright|sideways> <outdir> [fights=8]
   Writes <outdir>/page.json and <outdir>/shots/*.png. Served from disk at the real address, service worker off.
   ========================================================================== */
'use strict';
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const WHICH = process.argv[2] || 'demo', WAY = process.argv[3] || 'upright', OUT = process.argv[4] || '/tmp/fight_screen_page', FIGHTS = +(process.argv[5] || 8);
const BEFORE = process.env.WHY_BEFORE || null, SCALE = +(process.env.WHY_SCALE || 2);
const BASE = 'https://paolosarn.github.io/bohemia/';
const FILE = WHICH === 'alpha' ? 'slices/BOHEMIA_ALPHA_0_9.html' : 'slices/BOHEMIA_DEMO.html';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.webm': 'audio/webm', '.opus': 'audio/ogg', '.glb': 'model/gltf-binary', '.bin': 'application/octet-stream', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
for (const d of ['', 'shots']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const log = (...a) => { const s = new Date().toISOString().slice(11, 19) + ' ' + a.join(' '); fs.appendFileSync(path.join(OUT, 'run.log'), s + '\n'); console.log(s); };
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/fight_reasons.json'), 'utf8')), WHY = require(path.join(ROOT, 'slices/bohemia_fight_why.js'));
const { offTheTown } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

/* the fights, each the message one of the map's own callers builds (slices/BOHEMIA_CITY_WORLD.html and its helpers) */
const CASES = [
  { tag: 'road', natural: true, how: 'road' },
  { tag: 'job', how: 'job', msg: { label: 'CLEAR THE BLOCK', foe: 'the men on the block', why: 'contract:J17:clear', faction: 'watch', n: 4 } },
  { tag: 'beasts', how: 'road', msg: { label: 'on the road', why: 'road:pack_at_dusk', faction: 'coyotes', n: 4, beast: true } },
  { tag: 'hunted', how: 'hunted', msg: { label: 'the crew behind you', why: 'road:toll_crew:caught', faction: 'keepers', n: 4 } },
  { tag: 'raid', how: 'raid', msg: { label: 'The raid on HOME', why: 'raid:HOME', faction: 'water', n: 4 } },
  { tag: 'place', how: 'place', msg: { label: 'the men who owe the family', foe: 'the men who owe the family', why: 'place:mob_museum:collect', faction: 'house', n: 4 } },
  { tag: 'chase', how: 'chase', msg: { label: 'brigands raiding', why: 'party:p3', faction: 'hogs', n: 3, beast: true } },
  { tag: 'machines', how: 'guard', msg: { label: 'HIS MACHINES', why: 'machine:THE MECHANIC:0', faction: 'brigands', band: ['wiederganger', 'wiederganger', 'wiederganger'] } },
  { tag: 'boss', how: 'boss', boss: 'THE POT' }
];

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const VP = WAY === 'sideways' ? { width: 844, height: 390 } : { width: 390, height: 844 };
  const ctx = await browser.newContext({ viewport: VP, deviceScaleFactor: SCALE, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
  await ctx.route('**/*', async (route) => {
    const u = route.request().url(); if (!u.startsWith(BASE)) return route.abort();
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]); let f = path.join(ROOT, rel);
    if (BEFORE && rel === 'slices/BOHEMIA_FIGHT.html') f = path.join(BEFORE, 'BOHEMIA_FIGHT.html');
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'max-age=600' } });
  });
  const page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => { errs.push(String(e).slice(0, 200)); if (errs.length <= 3) log('PAGEERROR', String(e).slice(0, 160)); });
  const wait = (ms) => page.waitForTimeout(ms);
  const until = async (fn, ms, step) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) {} await wait(step || 200); } return false; };
  const frame = (re) => page.frames().find(f => re.test(f.url())) || null;
  const city = () => frame(/BOHEMIA_CITY_WORLD/), fightF = () => frame(/BOHEMIA_FIGHT\.html/);
  const tap = (x, y) => page.touchscreen.tap(x, y);
  const box = async (f) => { if (f === page.mainFrame()) return { x: 0, y: 0 }; const h = await f.frameElement(); return h ? h.boundingBox() : null; };
  const tapText = async (f, sel, re) => {
    const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => new RegExp(re, 'i').test((x.textContent || '').trim()) || new RegExp(re, 'i').test(x.title || '')).filter(x => { const r = x.getBoundingClientRect(); const st = getComputedStyle(x); return r.width > 2 && r.height > 2 && st.visibility !== 'hidden' && st.display !== 'none'; })[0];
      if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sel, re]);
    if (!b) return null; const fb = await box(f); if (!fb) return null; await tap(fb.x + b.x, fb.y + b.y); return true; };
  const tapId = async (f, id) => { const b = await f.evaluate((id) => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect(), st = getComputedStyle(e); if (r.width < 3 || st.display === 'none' || st.visibility === 'hidden' || e.disabled) return null; return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, id);
    if (!b) return false; const fb = await box(f); if (!fb) return false; await tap(fb.x + b.x, fb.y + b.y); return true; };
  /* in the game the fight's buttons are on the phone (slices/bohemia_phone.js, data-c: go, wait, flee, auto, speed); the fight's own
     bar is the page alone. A finger goes to whichever is on the glass. */
  const phoneB = async (c) => { for (const fr of page.frames()) { try { const b = await fr.evaluate((c) => { const e = [...document.querySelectorAll('button[data-c="' + c + '"]')].find(x => { const r = x.getBoundingClientRect(); return r.width > 3 && r.height > 3 && getComputedStyle(x).visibility !== 'hidden' && !x.disabled; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, c);
      if (b) { const fb = await box(fr); if (fb) return { x: fb.x + b.x, y: fb.y + b.y }; } } catch (e) {} } return null; };
  const OWN = { go: 'bend', auto: 'bauto', speed: 'bspeed', flee: 'bflee' };
  const press = async (c) => { const b = await phoneB(c); if (b) { await tap(b.x, b.y); return true; } const f = fightF(); return f ? tapId(f, OWN[c]) : false; };
  const anyFrameTap = async (sel, re) => { for (const f of page.frames()) { try { if (await tapText(f, sel, re)) return true; } catch (e) {} } return false; };
  const shot = async (name) => { const p = path.join(OUT, 'shots', name + '.png'); try { await page.screenshot({ path: p }); } catch (e) {} return p; };

  /* ---- THE DOOR ---- */
  await page.goto(BASE + FILE, { waitUntil: 'load', timeout: 300000 });
  await until(async () => await anyFrameTap('div,button,span', '^NEW GAME$'), 90000); await wait(2000);
  await until(async () => await anyFrameTap('#fronttap', 'BEGIN'), 90000); await wait(3500);
  await until(async () => await anyFrameTap('button,div', '^GO$'), 30000);
  if (WHICH === 'alpha') { await wait(2000); await page.evaluate(() => { const t = document.querySelector('.tab[data-p="run"]'); if (t) t.click(); }); }
  await until(async () => { const c = city(); return c && await c.evaluate(() => typeof LOOP !== 'undefined' && typeof city !== 'undefined' && MODE === 'city' && !!LOOP.open); }, 90000);
  await wait(5000);
  log(WHICH, WAY, 'in the first town', await city().evaluate(() => LOOP.open && LOOP.open.name), BEFORE ? '(THE OLD FIGHT PAGE)' : '');
  try { await anyFrameTap('button.lv', 'LEAVE'); await until(async () => city().evaluate(() => !LOOP.open), 8000); await wait(1500); } catch (e) {}

  const results = [];
  const save = () => fs.writeFileSync(path.join(OUT, 'page.json'), JSON.stringify({ which: WHICH, way: WAY, viewport: VP, before: !!BEFORE, errs, results }, null, 1));
  for (const C of CASES.slice(0, FIGHTS)) {
    const R = { tag: C.tag, wantHow: C.how, checks: {} }; results.push(R);
    const at = await city().evaluate(offTheTown).catch(() => null);
    /* ---- the fight, through the map's own door ---- */
    let handed = false;
    if (C.natural) { for (let i = 0; i < 40 && !handed; i++) { handed = await city().evaluate(() => { try { MEET.on = false; return !!roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }); } catch (e) { return false; } }).catch(() => false); if (!handed) await wait(1000); } }
    else if (C.boss) handed = await city().evaluate(([n]) => { const w = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })();
        const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: n, faction: null, draft: true, packageId: 1, roster: [], party: { count: 5, days: 1, difficulty: 1, faction: 'brigands' }, street: true, why: 'boss:' + n, at: { gx: w[0] | 0, gy: w[1] | 0 }, __met: true };
        if (!window.BohemiaBosses || !BohemiaBosses.dress(msg, { n: n })) return false; return !!cityHandOver(msg); }, [C.boss]).catch(() => false);
    else handed = await city().evaluate(([m]) => { const w = (function () { try { return roadWhere(); } catch (e) { return [city.x, city.y]; } })();
        const n = m.band ? m.band.length : m.n, party = { count: n, days: 1, difficulty: 1, faction: m.faction }; if (m.band) { party.band = m.band.slice(); party.rolled = true; }
        const roster = []; for (let i = 0; i < n; i++) roster.push({ arch: m.beast ? 'beast' : 'human' });
        return !!cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: m.label, foe: m.foe || null, faction: null, draft: true, packageId: 1, roster: roster, party: party, street: true, why: m.why, at: { gx: w[0] | 0, gy: w[1] | 0 }, __met: true }); }, [C.msg]).catch(() => false);
    if (!handed) { R.fail = 'the map handed no fight'; log(C.tag, 'NO FIGHT HANDED'); save(); continue; }
    if (!(await until(async () => { const f = fightF(); return f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units.length > 0 && !!UI.board && !!UI.t0); }, 60000))) { R.fail = 'no fight came'; log(C.tag, 'NO FIGHT CAME'); save(); continue; }
    const f = fightF();
    R.door = await page.evaluate(() => window.__FIGHT_NOW ? { why: __FIGHT_NOW.why, label: __FIGHT_NOW.label, foe: __FIGHT_NOW.foe } : null);
    if (BEFORE) { await wait(4500); R.shot = await shot(C.tag + '_before'); R.before = await f.evaluate(() => ({ why: !!document.getElementById('why'), say: document.getElementById('say').textContent })); log(C.tag, 'the old page: no sentence;', JSON.stringify(R.before)); save(); break; }
    /* ---- the sentence ---- */
    await until(async () => f.evaluate(() => !!UI.whySaid), 15000, 100);
    R.said = await f.evaluate(() => UI.whySaid ? JSON.parse(JSON.stringify(UI.whySaid)) : null);
    if (!R.said || !R.said.line) { R.fail = 'no sentence: ' + JSON.stringify(R.said); log(C.tag, 'NO SENTENCE', JSON.stringify(R.said)); save(); }
    else {
      await until(async () => f.evaluate(() => UI.why && document.getElementById('whyline').textContent.length === UI.why.line.length), 6000, 60);
      R.glass = await f.evaluate(() => { const e = document.getElementById('why'), r = e.getBoundingClientRect(), ln = document.getElementById('whyline'), lr = ln.getBoundingClientRect(), cv = document.getElementById('whyface'), g = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
        const seen = {}; let lit = 0; for (let i = 0; i < g.length; i += 16) { const k = (g[i] >> 3) + ',' + (g[i + 1] >> 3) + ',' + (g[i + 2] >> 3); seen[k] = 1; if (g[i] + g[i + 1] + g[i + 2] > 150) lit++; }
        const up = (id) => getComputedStyle(document.getElementById(id)).display !== 'none', S = FIGHT.S, them = S.units.filter(u => u.side === 'them');
        return { shown: up('why'), box: [r.left, r.top, r.right, r.bottom].map(Math.round), screen: [innerWidth, innerHeight], text: ln.textContent, name: document.getElementById('whyname').textContent, textIn: lr.left >= r.left - 1 && lr.right <= r.right + 1 && lr.bottom <= r.bottom + 1 && ln.scrollWidth <= ln.clientWidth + 1,
          faceColours: Object.keys(seen).length, faceLit: lit, theirs: e.classList.contains('them'), vet: up('vet'), call: up('call'), over: up('over'), kinds: them.map(u => u.kind), talkers: them.filter(u => !u.beast && !u.ghost && !u.machine).length, t: Math.round(performance.now() - UI.t0), deploy: !!S.deploy, log0: S.log.length, round: S.round,
          speaker: (function () { const v = FIGHT.byId(UI.why.who); return v ? { side: v.side, name: v.name, kind: v.kind || null, main: !!v.main } : null; })() }; });
      R.shot = await shot(C.tag);
      /* ---- it never stops the fight: a finger starts it while the sentence is up ---- */
      const dep = R.glass.deploy; if (dep) R.under0 = { go: await press('go') };
      await wait(250); const autoOn = await f.evaluate(() => !!UI.auto); if (!autoOn) await press('auto');
      R.under = { moved: false, upWhile: false };
      await until(async () => { const s = await f.evaluate(() => ({ up: !!UI.why, n: FIGHT.S.log.length, dep: !!FIGHT.S.deploy })); if (s.up && !s.dep && s.n > R.glass.log0) { R.under.moved = true; R.under.upWhile = true; return true; } return !s.up; }, 9000, 80);
      /* ---- it goes by itself; the lesson and the commentary never stand with it ---- */
      let both = 0, gone = false; const t1 = Date.now();
      while (Date.now() - t1 < 12000) { const s = await f.evaluate(() => { const up = (id) => getComputedStyle(document.getElementById(id)).display !== 'none'; return { why: up('why'), vet: up('vet'), call: up('call') }; }); if (s.why && (s.vet || s.call)) both++; if (!s.why) { gone = true; break; } await wait(120); }
      R.under.goneByItself = gone; R.under.both = both; R.under.stoodMs = await f.evaluate(() => Math.round(performance.now() - UI.t0)) - R.said.at;
      /* ---- the checks ---- */
      const how = WHY.how(R.door && R.door.why, { arena: false, camp: false, boss: C.tag === 'boss' }, DATA), who = WHY.who(R.glass.kinds.map(k => ({ kind: k })), DATA), K = R.checks;
      K.afterFirstSecond = R.said.at >= 1000;
      K.howIsTheDoors = R.said.how === how && (C.natural || how === C.how);
      K.whoIsOnTheBoard = R.said.who === who.id;
      K.fromAFace = R.glass.shown && R.glass.faceColours >= 12 && R.glass.faceLit > 20 && !!R.glass.name;
      K.rightMouth = R.glass.talkers > 0 && R.said.cls === 'men' ? (R.said.side === 'them' && R.glass.speaker && R.glass.speaker.side === 'them' && R.glass.theirs) : (R.said.side === 'ours' && R.glass.speaker && R.glass.speaker.side === 'you' && !R.glass.theirs);
      K.wholeOnGlass = R.glass.box[0] >= 0 && R.glass.box[1] >= 0 && R.glass.box[2] <= R.glass.screen[0] && R.glass.box[3] <= R.glass.screen[1] && R.glass.textIn && R.glass.text === R.said.line;
      K.oneSentence = /^[^.!?]+[.]$/.test(R.said.line) && R.said.line.split(/\s+/).length <= (DATA.words_max || 16);
      K.neverStops = R.under.moved && R.under.upWhile;
      K.goesByItself = R.under.goneByItself && R.under.both === 0;
      K.aloneOnTheFloor = !R.glass.vet && !R.glass.call;
      R.ok = Object.keys(K).every(k => K[k]);
      log(C.tag, R.ok ? 'OK' : 'MISS ' + Object.keys(K).filter(k => !K[k]).join(','), '| door', JSON.stringify(R.door && R.door.why), '->', R.said.how + '/' + R.said.who, R.said.rule, '|', R.said.side === 'them' ? 'THEIR' : 'HIS', R.said.by + ':', JSON.stringify(R.said.line), '| at', Math.round(R.said.at), 'ms; fight moved under it', R.under.moved, '; gone by itself', R.under.goneByItself, '; kinds', R.glass.kinds.join(','));
      save();
    }
    /* ---- out: the first fight to its end on AUTO, the others pulled out of; the end screen's LEAVE, the map again ---- */
    if (results.length === 1) { for (let i = 0; i < 2; i++) { const sp = await f.evaluate(() => UI.speed || 1); if (sp < 4) await press('speed'); await wait(200); }
      R.over = await until(async () => f.evaluate(() => !!FIGHT.S.over).catch(() => true), 240000, 500); }
    else { if (await f.evaluate(() => !!UI.auto).catch(() => false)) await press('auto'); await wait(400);
      for (let i = 0; i < 40; i++) { const st = await f.evaluate(() => ({ over: !!FIGHT.S.over, mine: (function () { const u = FIGHT.current(); return !!u && u.side === 'you' && !UI.anim.length; })() })).catch(() => ({ over: true })); if (st.over) break; if (st.mine) { await press('flee'); await wait(350); await press('flee'); await wait(700); } else await wait(400); }
      R.over = await until(async () => f.evaluate(() => !!FIGHT.S.over).catch(() => true), 60000, 400);
      if (!R.over) { if (!(await f.evaluate(() => !!UI.auto).catch(() => true))) await press('auto'); R.over = await until(async () => f.evaluate(() => !!FIGHT.S.over).catch(() => true), 240000, 500); } }
    await until(async () => !!frame(/SPOILS_SCREEN/) || !fightF(), 20000); await wait(1500);
    for (let i = 0; i < 14; i++) { const sp = frame(/SPOILS_SCREEN/); if (!sp) break; await tapText(sp, 'button', '^LEAVE$'); await wait(3000); }
    R.home = await until(async () => !fightF() && !frame(/SPOILS_SCREEN/) && await city().evaluate(() => !LOOP.fighting), 40000);
    try { if (await city().evaluate(() => !!LOOP.open)) { await anyFrameTap('button.lv', 'LEAVE'); await wait(1500); } } catch (e) {}
    await wait(1200); save();
    if (!R.home) { log('   not back on the map after', C.tag, '(over', R.over + ')'); break; }
  }
  save();
  const got = results.filter(r => r.said && r.said.line);
  log('DONE', WHICH, WAY + ':', results.length, 'fights;', got.length, 'said why;', results.filter(r => r.ok).length, 'whole;', 'page errors', errs.length);
  await page.close(); await ctx.close(); await browser.close(); process.exit(0);
})().catch(e => { log('FATAL', String(e && e.stack || e).slice(0, 600)); process.exit(1); });
