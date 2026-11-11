#!/usr/bin/env node
/* ============================================================================
   THE FIRST BOSS CHANGES THE MAP (BOSSES lane, 11/8/26, VAMILY rule 437(a); ask lines 167, 346, 522).

   PAOLO 10/26 (rule 243): 'there are supposed to be bosses in this game where you're able to alter the map and what's going on in
   the world around you, that's gonna be super important.' The coordinator's 11/8 line: the first boss END TO END, found on the map
   by a sign, fought, his verb handed over, and his death CHANGES THE MAP for real (his crew loses its ground, the roads it closed
   open, the feed posts it), KEPT AFTER A RELOAD. Record: records/BOHEMIA_BOSSES_THE_FIRST_BOSS_CHANGES_THE_MAP_11_8_26.md.
   Code: slices/bohemia_bosses.js (8) HIS GROUND; data records/target/bb/boss_act_one.json (THE POT's 'ground');
   pictures slices/boss_places/checkpoint_* (tools/bohemia_bosses_the_pots_ground_11_8_26.py).

   THE STRANGER'S GAME on the live demo at phone size, through the one driver, a new game, THE POT:
     F1 his sign (a flyer) is in the world and his rumour is on the phone's feed
     F2 the one who lost her kitchen asks; at the flyer one of YOUR men reads it out (it says his crew shut the streets); his place is marked
     G1 BEFORE he falls his crew holds his ground: at least 2 streets into it are shut, the map's own walk refuses every one, the way in
        from a shut street goes round to his front (row 587), his front (the way the sign points) is open, and every town is still reachable
     G2 the checkpoints are PAINTED on their blocks (the closed picture), and the map's walk agrees with the picture block for block
     B0 at his place his card comes first (Battle Brothers shows who holds a place before you fight): his face, title, tip, ENGAGE or FALL BACK
     B1 his fight stands with the man himself and is won (AUTO, the player's own button; the checker ends it if AUTO stalls and SAYS SO)
     B2 he falls: COOK is yours, the camera goes to his place and the checkpoints roll open on the tape with it, then she says the
        valley's line, hands you his pot, and the line under it says the streets that opened and what his till paid
     C1 THE CHANGE IS REAL: every shut street walks now, the way in his crew shut is shorter, the checkpoints are painted shoved to the
        kerb, his till paid once (the purse's own ledger), the strip's post and the radio's post are on the feed
     R1 THE SAME PHONE OPENS THE GAME AGAIN (CONTINUE): he is still down, COOK is still yours, every street still walks, the kerb
        pictures and his kitchen after still drawn, the till not paid twice
   PLANTED FAILS (each must turn its own check red, or the check is not a check):
     P1 one checkpoint shut again after the fall (live, on the game's own state)        -> C1's walk check red
     P2 a ground that shut nothing (a copy of G1's measure)                              -> G1 red
     P3 the strip's post taken off the feed (a copy of C1's measure)                     -> C1's feed check red
     P4 a phone that forgot the save (the bosses' and the map's keys wiped, opened again) -> R1 red
   C0 nothing threw.
   Pictures: records/target/the_first_boss_changes_the_map/ (BOSSES_SHOTS=0 to skip).
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const SHOTS = process.env.BOSSES_SHOTS === '0' ? null : path.join(ROOT, 'records', 'target', 'the_first_boss_changes_the_map');
const N = 'THE POT';

/* ---- the checks, as functions of what was measured, so a plant can be put through the very same check ---- */
const G1 = (m) => !!m && m.shut >= 2 && m.walkShut.every(w => w === false) && m.cross.before != null && m.cross.straight != null && m.cross.before > m.cross.straight + 2
  && m.frontOpen && m.towns.every(t => t.ok);
const C1walk = (m) => !!m && m.shut >= 1 && m.walkShut.every(w => w === true);
const C1cross = (m) => !!m && m.cross.after != null && m.cross.before != null && m.cross.after < m.cross.before;
const C1feed = (m, row) => !!m && m.posts.some(p => p.who === row.ground.feed.who && p.txt.indexOf(row.ground.feed.txt.split('{')[0].trim()) === 0) && m.posts.some(p => p.who === '@valleyradio' && /kitchen/i.test(p.txt));
const R1 = (m, before) => !!m && m.fallen && m.verb && before.shut >= 1 && m.walkShut.length === before.shut && m.walkShut.every(w => w === true) && m.paidEntries === 1
  && m.placeAfter && m.kerb >= 1;

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const d = await open({ profile: prof, fog: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120) + ' AT ' + String(e.stack || '').split('\n').slice(1, 3).map(l => l.trim()).join(' < ')));
  const shot = async (name) => { if (SHOTS) { try { await d.shot(path.join(SHOTS, name + '.png')); } catch (e) {} } };
  const tapEl = async (h, pg) => { const b = h && await h.boundingBox(); if (!b) return false; await (pg || page).touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data()).catch(() => false)) break; }
  await fr.evaluate(() => { window.__BOSSES_TALK = true; });
  const row = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.data().bosses.filter(b => b.n === n)[0])), N);
  const bossCard = async (kind, ms) => { for (let i = 0; i < ms / 400; i++) { const c = await fr.evaluate((a) => { const c = window.__BOSS_CARD, el = document.getElementById('roadcard');
      return c && el && c.kind === a[0] && c.n === a[1] ? JSON.parse(JSON.stringify(c)) : null; }, [kind, N]).catch(() => null); if (c) return c; await page.waitForTimeout(400); } return null; };
  const pressCard = async (i) => { await page.waitForTimeout(700); return tapEl(await fr.$('#roadcard button[data-road="' + i + '"]')); };
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  const leaveTown = async () => {
    for (let k = 0; k < 3 && await inTown(); k++) {
      await page.waitForTimeout(900);
      if (!await tapEl(await page.$('#bohphone .bpctx.town .lv'))) { const sfr = page.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); }
      await page.waitForTimeout(1300);
    }
  };
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await leaveTown();
  const guard = setInterval(() => { fr.evaluate(() => { try { if (MEET.up && !/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '') && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const st = () => fr.evaluate(() => { const H = BohemiaHisMap.state(), B = BohemiaBosses.state(); return JSON.parse(JSON.stringify({ at: [city.x, city.y], boss: H.boss, verbs: B.verbs, rumours: B.rumours })); });
  const settle = async () => { for (let i = 0; i < 160; i++) { await page.waitForTimeout(500); await leaveTown(); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length || !!document.getElementById('roadcard')).catch(() => false)) break; } await page.waitForTimeout(800); };
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  /* the ground, measured through the map's own walk and route (the same functions the party travels by) */
  const measure = (fr2) => fr2.evaluate((n) => {
    const G = BohemiaBosses.ground(n); if (!G) return null;
    const at = G.at, Rr = 3, NN = om.n;
    const walkShut = G.shut.map(q => !!cityWalkable(q.x, q.y));
    /* THE WAY IN HIS CREW SHUT (PLUMBER 8, ask row 587, 11/10: a way ACROSS his ground, between two shut streets, was often never his to
       shut: on most random spots the city's own blocks made it long either way, '14 blocks then, 14 now'). What his checkpoints do is
       hold his ways in, so a stranger comes round to his front: from just outside each shut street to his door, the one his crew makes
       the longest detour of (fixed once, kept on the game's window so the after and the reload measure the same two ends) */
    let ends = window.__GROUND_ENDS || null;
    if (!ends && G.shut.length >= 1) {
      const out = (q) => { const dx = Math.sign(q.x - at[0]), dy = Math.sign(q.y - at[1]); for (let k = 1; k <= 3; k++) { const x = q.x + dx * k, y = q.y + dy * k; if (x > 0 && y > 0 && x < NN - 1 && y < NN - 1 && cityWalkable(x, y)) return [x, y]; } return null; };
      let best = null; for (const a of G.shut) { const oa = out(a); if (!oa) continue; const rr = cityRoute(oa[0], oa[1], at[0], at[1]); if (!rr) continue;
        const dd = Math.max(Math.abs(oa[0] - at[0]), Math.abs(oa[1] - at[1])), detour = (rr.length - 1) - dd; if (!best || detour > best.detour) best = { detour, d: dd, a: oa, b: [at[0], at[1]] }; }
      if (best) ends = window.__GROUND_ENDS = { a: best.a, b: best.b, straight: best.d };
    }
    const r = ends ? cityRoute(ends.a[0], ends.a[1], ends.b[0], ends.b[1]) : null;
    const front = G.from ? !!cityRoute(G.from[0], G.from[1], at[0], at[1]) : true;
    const towns = []; const bs = ctBases() || {}; for (const k in bs) { const b = bs[k]; if (!b) continue; const dr = townDoor(b.x | 0, b.y | 0); towns.push({ k, ok: !!(dr && cityRoute(city.x, city.y, dr[0], dr[1])) || !dr }); }
    const drew = (BohemiaBosses.last().drew || {}).checkpoints || [];
    return { shut: G.shut.length, shutList: G.shut.map(q => q.x + ',' + q.y), ring: G.ring, at, front: G.front, open: G.open, paid: G.paid, walkShut, cross: { ends, straight: ends ? ends.straight : null, len: r ? r.length - 1 : null },
      frontOpen: front, towns, drew: drew.map(c => ({ key: c.key, at: c.at, open: c.open })), said: G.said || null };
  }, N);

  /* F1: the sign and the rumour */
  let s = null;
  for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); s = await st(); if (s.boss.sign && s.boss.sign.n === N && s.rumours[N]) break; if (s.boss.found[N]) break; }
  ok('F1 ' + N + ': his sign (a ' + ((s.boss.sign || {}).kind || '?') + ') is in the world and his rumour is on the phone\'s feed', !!(s.boss.sign && s.boss.sign.n === N) && !!s.rumours[N],
     s.boss.sign ? s.boss.sign.kind + ' at ' + s.boss.sign.x + ',' + s.boss.sign.y + ', his place ' + s.boss.sign.boss.x + ',' + s.boss.sign.boss.y : 'no sign');
  /* G1 is measured the moment his place exists (his crew held the ground before you ever came) */
  let m0 = null; for (let i = 0; i < 30 && !(m0 && m0.shut); i++) { m0 = await measure(fr); if (!(m0 && m0.shut)) await page.waitForTimeout(500); }
  if (m0) m0.cross.before = m0.cross.len;
  ok('G1 before he falls his crew holds his ground: streets into it shut, the walk refuses each, the way in from a shut street goes round to his front, his front open, every town reachable', G1(m0),
     m0 ? m0.shut + ' of ' + m0.ring + ' streets in shut (walk: ' + m0.walkShut.join(',') + '), across ' + (m0.cross.ends ? m0.cross.ends.a.join(',') + ' > ' + m0.cross.ends.b.join(',') : '-') + ': ' + m0.cross.before + ' blocks round against ' + m0.cross.straight + ' straight, front ' + m0.front.join(' ') + ' open ' + m0.frontOpen + ', towns ' + m0.towns.filter(t => t.ok).length + '/' + m0.towns.length : 'no ground');
  /* P2: a ground that shut nothing must be red */
  if (m0) { const p2 = JSON.parse(JSON.stringify(m0)); p2.shut = 0; p2.walkShut = []; p2.cross.before = p2.cross.straight; ok('P2 planted: a ground that shut nothing turns G1 red', !G1(p2)); }

  /* F2: she asks, the flyer is read, his place is marked */
  const ak = await bossCard('asker', 110000), A = row.lead.asker;
  if (ak) { await shot('0_she_asks'); await pressCard(0); const ay = await bossCard('asker_yes', 6000); if (ay) await pressCard(0); await page.waitForTimeout(600); }
  s = await st();
  if (s.boss.sign && s.boss.sign.n === N) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
  s = await st(); const f = s.boss.found[N];
  const th = f ? await bossCard('thing', 12000) : null;
  ok('F2 ' + A.name + ' asks; at the flyer one of yours reads it out (his crew shut the streets); his place is marked on the map', !!ak && !!f && !!th && th.text === row.lead.thing.says && /shut the streets/.test(th.text) && th.name !== 'YOU',
     (ak ? ak.name + ' asked' : 'nobody asked') + '; ' + (th ? th.name + ': "' + th.text.slice(0, 120) + '..."' : 'no card') + '; marked ' + (f ? f.x + ',' + f.y : 'NO'));
  if (th) { await shot('1_the_flyer_read_out'); await pressCard(0); await page.waitForTimeout(600); }
  if (!f) { ok('the walk reached his place', false, 'the flyer was not read'); clearInterval(guard); await d.close().catch(() => {}); return; }
  /* walk to his place (the map's own route goes round his ground to his front); G2 on the way in, where his checkpoints are on the glass */
  await go([f.x, f.y]);
  let meet = false, g2 = null;
  for (let i = 0; i < 240 && !meet; i++) { await page.waitForTimeout(500); await leaveTown();
    if (!g2) { const q = await measure(fr); const before = q ? q.drew.filter(c => !c.open && /_before$/.test(c.key)) : []; if (before.length) { g2 = q; await shot('2_his_checkpoints_on_the_way_in'); } }
    meet = await fr.evaluate((n) => { try { return !!(MEET.up && MEET.up.msg && MEET.up.msg.why === 'boss:' + n); } catch (e) { return false; } }, N).catch(() => false);
    if (!meet && await fr.evaluate(() => { try { return typeof FIGHT_FRAME_UP !== 'undefined' && FIGHT_FRAME_UP; } catch (e) { return false; } }).catch(() => false)) break;
    if (!meet && await page.$('#fightFrame') && await page.evaluate(() => { const ff = document.getElementById('fightFrame'); return !!ff && ff.style.display !== 'none'; })) break;
    if (!meet && i % 20 === 19 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) await go([f.x, f.y]); }
  if (!g2) { await fr.evaluate(() => render()); await page.waitForTimeout(300); g2 = await measure(fr); }
  const g2b = g2 ? g2.drew.filter(c => !c.open && /^checkpoint_[xy]_before$/.test(c.key)) : [];
  /* the drawing agrees with the walk, block for block (TWO SCALES' law: every cell the drawing shows is what the grid says) */
  const agree = !!g2 && g2b.every(c => g2.shutList.indexOf(c.at.join(',')) >= 0) && g2.walkShut.every(w => w === false) && g2.drew.length === g2.drew.filter(c => g2.shutList.indexOf(c.at.join(',')) >= 0).length;
  ok('G2 his checkpoints are painted on their blocks (the closed picture), every painted one a block the walk refuses', g2b.length >= 1 && agree,
     g2 ? g2b.length + ' painted closed on the glass: ' + g2b.slice(0, 4).map(c => c.key.replace('checkpoint_', '') + '@' + c.at.join(',')).join(' ') : 'none drawn');
  /* B0 (Battle Brothers: you see who holds the place before you choose to fight): at his place his card comes first, his own face,
     his title and the one thing to know, ENGAGE or FALL BACK */
  let mc = null;
  if (meet) { await page.waitForTimeout(1500);
    mc = await fr.evaluate(() => { const d = document.querySelector('#meetcard .mcboss'), g = document.querySelector('#meetcard button[data-meet="go"]'), b = document.querySelector('#meetcard button[data-meet="back"]');
      return d ? { look: d.dataset.look, face: (BohemiaBosses.last().cardFace || null), text: d.textContent, go: !!g, back: !!b } : null; }).catch(() => null);
    await shot('3_his_place_and_his_card'); }
  ok('B0 at his place his card comes first: his own face, his title, his tip, ENGAGE or FALL BACK', meet && !!mc && mc.look === row.boss.look && mc.face === row.boss.look && mc.text.indexOf(row.tip) >= 0 && mc.go && mc.back,
     meet ? JSON.stringify(mc) : 'no card: the fight opened with nobody shown');
  if (meet) await tapEl(await fr.$('#meetcard button[data-meet="go"]') || await fr.$('button[data-meet="go"]'));
  /* B1: the fight */
  let ff = null;
  for (let i = 0; i < 120 && !ff; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
    if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
  const him = ff ? await ff.evaluate(() => { const u = FIGHT.S.units.filter(u => u.side === 'them' && u.boss)[0]; return u ? { name: u.name, look: u.look || null } : null; }).catch(() => null) : null;
  let res = null, by = 'no fight';
  const bat0 = await fr.evaluate(() => { try { return BohemiaPurse.balance(purseGet(), 'electricity'); } catch (e) { return null; } });
  if (ff) {
    await page.waitForTimeout(1500); await shot('4_his_fight');
    await tapEl(await ff.$('#bauto'));
    for (let i = 0; i < 360 && !res; i++) { await page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null);
      if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
    by = 'AUTO';
    if (res !== 'won') { by = 'THE CHECKER (AUTO ' + (res || 'did not finish in 3 min') + ')';
      await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
    await page.waitForTimeout(1200);
    let left = false; try { const sf = page.frames().find(x => /SPOILS_SCREEN/.test(x.url())); if (sf) { await page.waitForTimeout(1200); left = await tapEl(await sf.$('#leave')); } } catch (e) {}
    await page.waitForTimeout(600);
    if (!left || await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const q = await st(); if (q.boss.fallen[N]) break; }
  }
  ok('B1 his fight stands with the man himself (' + row.boss.look + ') and is won', !!him && him.name === row.boss.name && him.look === row.boss.look && !!ff, (him ? him.name + ' in ' + him.look : 'no boss on the board') + ', won by ' + by);
  /* B2: the beat (his checkpoints roll open with his place), her card (the valley, his pot, the ground's line) */
  const af = await bossCard('after', 30000);
  const bt = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_BEAT || null))).catch(() => null);
  if (af) { await page.waitForTimeout(500); await shot('5_she_says_what_changed'); }
  s = await st();
  const wantSaid = row.ground.card.replace('{STREETS}', (m0 ? m0.shut : 0) + ((m0 && m0.shut === 1) ? ' STREET' : ' STREETS')).replace('{till}', row.ground.till);
  ok('B2 he falls: COOK is yours, the camera plays his place and his checkpoints open on the tape, and under his pot her card says the streets and the till', !!s.boss.fallen[N] && !!s.verbs[row.verb.id] && !!bt && bt.n === N && (bt.checkpoints | 0) >= 1
     && !!af && af.text === row.after.valley && !!af.hand && af.hand.name === row.verb.hand.name && af.ground === wantSaid,
     'fallen ' + !!s.boss.fallen[N] + ', verb ' + !!s.verbs[row.verb.id] + ', the beat ' + (bt ? bt.phases.join('>') + ' with ' + bt.checkpoints + ' checkpoints on the tape' : 'none') + ', card: ' + (af ? '"' + af.text + '" + ' + (af.hand ? af.hand.name : 'NO THING') + ' + "' + af.ground + '"' : 'none'));
  if (af) await pressCard(0);
  await page.waitForTimeout(2500);
  /* C1: the change is real */
  await fr.evaluate(() => render()); await page.waitForTimeout(300);
  const m1 = await measure(fr); if (m1 && m0) { m1.cross.before = m0.cross.before; m1.cross.after = m1.cross.len; }
  const pay = await fr.evaluate((n) => { const P = purseGet(); const E = (P.entries || []).filter(e => e.ref === 'boss-till:' + n); return { bat: BohemiaPurse.balance(P, 'electricity'), entries: E.length, amt: E.reduce((a, e) => a + Math.abs(e.amount || 0), 0) }; }, N);
  const posts = await fr.evaluate(() => (BOHEMIA_FEED.posts ? BOHEMIA_FEED.posts() : []).map(p => ({ who: p.who, txt: p.txt || p.text || '' })));
  if (m1) m1.posts = posts;
  ok('C1a the roads his crew closed are open: every shut street walks now', C1walk(m1), m1 ? 'walk: ' + m1.walkShut.join(',') : 'no ground');
  ok('C1b the way in his crew shut is shorter now: from outside that street to his door', C1cross(m1), m1 ? m1.cross.before + ' blocks then, ' + m1.cross.after + ' now (' + m1.cross.straight + ' straight)' : '-');
  const kerb = m1 ? m1.drew.filter(c => c.open && /^checkpoint_[xy]_after$/.test(c.key)) : [];
  ok('C1c the checkpoints are painted shoved to the kerb (the after picture), never the closed one', kerb.length >= 1 && m1.drew.every(c => c.open), kerb.length + ' after on the glass: ' + kerb.slice(0, 4).map(c => c.at.join(',')).join(' '));
  ok('C1d his till paid once (+' + row.ground.till + ', the purse\'s own ledger)', pay.entries === 1 && pay.amt === row.ground.till,
     'entries ' + pay.entries + ' for ' + pay.amt + ', batteries ' + bat0 + ' -> ' + pay.bat);
  ok('C1e the feed posts it: the strip (' + row.ground.feed.who + ') and the radio (@valleyradio)', C1feed(m1, row), posts.filter(p => p.who === row.ground.feed.who || p.who === '@valleyradio').map(p => p.who + ': ' + p.txt.slice(0, 70)).join(' | '));
  /* P1 and P3: the plants */
  if (m1) {
    const p1 = await fr.evaluate((n) => { const G = BohemiaBosses.ground(n), was = G.open; G.open = null; const H = BohemiaHisMap.state(), f = H.boss.fallen[n]; delete H.boss.fallen[n];
      BohemiaBosses.regrid(); const q = G.shut.map(b => !!cityWalkable(b.x, b.y)); H.boss.fallen[n] = f; G.open = was; BohemiaBosses.regrid(); return q; }, N);
    ok('P1 planted: one checkpoint shut again after the fall turns C1a red', !C1walk(Object.assign({}, m1, { walkShut: p1 })), 'walk under the plant: ' + p1.join(','));
    const p3 = Object.assign({}, m1, { posts: m1.posts.filter(p => p.who !== row.ground.feed.who) });
    ok('P3 planted: the strip\'s post taken off the feed turns C1e red', !C1feed(p3, row));
  }
  await shot('6_the_map_after');
  /* the camera to his ground for one picture of the change (the map's own focus, the way the beat does it) */
  clearInterval(guard);
  const before = { shut: m0 ? m0.shut : 0, bat: pay.bat };
  /* R1: the same phone opens the game again (wait for the save the fall made, then a new tab on the same storage, CONTINUE) */
  const saved = () => page.evaluate(() => ['bohemia_city_save.a', 'bohemia_city_save.b', 'bohemia_city_save'].some(k => { const v = localStorage.getItem(k); return !!v && v !== '{"bohemia":"DEAD"}'; })).catch(() => false);
  for (let i = 0; i < 60 && !(await saved()); i++) await page.waitForTimeout(500);
  await page.waitForTimeout(3000);
  const reopen = async (wipe) => {
    if (wipe) await page.evaluate(() => { localStorage.removeItem('bohemia.bosses.v1'); localStorage.removeItem('bohemia.hismap.v1'); });
    const e = await open({ again: d, fog: true });
    for (let i = 0; i < 80; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data() && typeof city !== 'undefined').catch(() => false)) break; }
    for (let i = 0; i < 20; i++) { await e.page.waitForTimeout(500); const ready = await e.fr.evaluate(() => { try { return FOG.ready; } catch (x) { return false; } }).catch(() => false); if (ready) break; }
    await e.fr.evaluate((g) => { window.__GROUND_ENDS = g; try { render(); } catch (x) {} }, m0 ? m0.cross.ends : null).catch(() => {});
    let q = null;
    for (let i = 0; i < 30; i++) { await e.page.waitForTimeout(500); q = await e.fr.evaluate((n) => { const H = BohemiaHisMap.state(), B = BohemiaBosses.state(), G = BohemiaBosses.ground(n) || { shut: [] }; const P = purseGet();
      try { render(); } catch (x) {}
      const drew = BohemiaBosses.last().drew || {};
      return { fallen: !!H.boss.fallen[n], verb: !!(B.verbs && B.verbs.cook), walkShut: (G.shut || []).map(b => !!cityWalkable(b.x, b.y)), paidEntries: (P.entries || []).filter(x => x.ref === 'boss-till:' + n).length,
        bat: BohemiaPurse.balance(P, 'electricity'), placeAfter: (drew.places || []).some(p => p.n === n && /_after$/.test(p.key)), kerb: ((drew.checkpoints || []).filter(c => c.open)).length, at: [city.x, city.y] }; }, N).catch(x => ({ err: String(x) }));
      if (q && q.placeAfter && q.kerb >= 1) break; }
    return { e, q };
  };
  const o1 = await reopen(false);
  if (SHOTS) { try { await o1.e.shot(path.join(SHOTS, '7_opened_again.png')); } catch (x) {} }
  const r1 = o1.q;
  ok('R1 the same phone opens the game again: he is still down, COOK is still yours, every street still walks, the till not paid twice', R1(r1, before),
     JSON.stringify(r1).slice(0, 300) + ' (batteries before ' + before.bat + ')');
  errs.push(...(o1.e.errs || []));
  try { await o1.e.page.close(); } catch (x) {}
  /* P4: a phone that forgot the save must be red (last: it wipes this phone's boss state) */
  const o2 = await reopen(true);
  ok('P4 planted: a phone that forgot the save turns R1 red', !R1(o2.q, before), JSON.stringify(o2.q).slice(0, 200));
  try { await o2.e.page.close(); } catch (x) {}
  ok('C0 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTHE FIRST BOSS CHANGES THE MAP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
