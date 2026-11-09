#!/usr/bin/env node
/* ============================================================================
   THE TAP CHANGES THE MAP, HIS OWN WAY (BOSSES lane, 11/9/26, VAMILY rule 440(b); ask lines 167, 522).

   PAOLO 11/9: 'More everything pls'; the coordinator's line: the next two bosses of the ladder, each found by a sign, each handing its
   verb, each changing the map ITS OWN WAY (not a copy of THE POT's), kept after a reload. Record:
   records/BOHEMIA_BOSSES_THE_TAP_AND_THE_FILTER_CHANGE_THE_MAP_11_9_26.md. Code: slices/bohemia_bosses.js (9) HIS PIPE; data
   records/target/bb/boss_act_one.json (THE TAP's 'pipe'); pictures slices/boss_places/pipe_* (tools/bohemia_bosses_the_taps_pipe_11_9_26.py).

   THE STRANGER'S GAME on the live demo at phone size, a new game, the ladder in order:
     T0 THE POT first (his sign read, his card, his fight; the checker ends it if AUTO is slow and SAYS SO; her card taken)
     T1 THE TAP's sign (a tag) is in the world and his rumour is on the feed
     T2 EL CHINO asks; at the tag one of YOUR men reads it out (the watchers on the pipe); his place is marked
     P1 HIS PIPE: at least 3 blocks of the map's own route from his door toward a town, painted with his watcher on it, and every pipe
        block still WALKS (his way is not THE POT's wall)
     P2 WALKING UNDER IT COSTS: the crew walks the pipe; every new pipe block a bolt takes blood off one of his men, the number rises
        off the crew, the man's blood is down by it, the street posts it the first time
     B0 his card first (face, title, tip, ENGAGE, FALL BACK); B1 his fight won
     B2 the beat rolls his pipe over to taps with his pump house, then EL CHINO says the valley's line, hands his wrench, and the line
        under it says the taps on his pipe and what each pays
     C1a no bolt walks the pipe after he falls
     C1b every pipe block is a main for TURN THE WATER ON; a real tap on the phone at one pays the verb's batteries (the purse's
         ledger) and marks the block
     C1c the pipe painted with its taps; C1d the street (@la_vecina) and the radio post it
     R1 the same phone opens the game again: still down, the pipe still taps, the opened tap still opened, no bolt on it
   PLANTED: P2p a walk under the pipe with no bolt; P3 one pipe block guarded again after the fall (live, the game's own state);
   P4 a phone that forgot the save. Each must turn its own check red.
   C0 nothing threw.
   Pictures: records/target/the_tap_changes_the_map/ (BOSSES_SHOTS=0 to skip; the gate writes .png, the record keeps .webp).
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const SHOTS = process.env.BOSSES_SHOTS === '0' ? null : path.join(ROOT, 'records', 'target', 'the_tap_changes_the_map');
const POT = 'THE POT', TAP = 'THE TAP';

const P2 = (m) => !!m && m.bolts.length >= 2 && m.bolts.every(b => b.took > 0) && m.bolts.length <= m.stepped && m.lastMan != null && m.lastMan.lost >= m.bolts[m.bolts.length - 1].took && !!m.rose;
const C1b = (m, pay) => !!m && m.applies.length >= 3 && m.applies.every(Boolean) && m.paid === pay && m.marked;
const R1 = (m) => !!m && m.fallen && m.open && m.applies.length >= 2 && m.applies.every(Boolean) && m.openedStill && m.bolts === 0;

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const d = await open({ profile: prof, fog: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120) + ' AT ' + String(e.stack || '').split('\n').slice(1, 3).map(l => l.trim()).join(' < ')));
  const shot = async (name) => { if (SHOTS) { try { await d.shot(path.join(SHOTS, name + '.png')); } catch (e) {} } };
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data()).catch(() => false)) break; }
  await fr.evaluate(() => { window.__BOSSES_TALK = true; });
  const rowOf = (n) => fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.data().bosses.filter(b => b.n === n)[0])), n);
  const bossCard = async (kind, n, ms) => { for (let i = 0; i < ms / 400; i++) { const c = await fr.evaluate((a) => { const c = window.__BOSS_CARD, el = document.getElementById('roadcard');
      return c && el && c.kind === a[0] && c.n === a[1] ? JSON.parse(JSON.stringify(c)) : null; }, [kind, n]).catch(() => null); if (c) return c; await page.waitForTimeout(400); } return null; };
  const pressCard = async (i) => { await page.waitForTimeout(700); return tapEl(await fr.$('#roadcard button[data-road="' + i + '"]')); };
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  const leaveTown = async () => { for (let k = 0; k < 3 && await inTown(); k++) { await page.waitForTimeout(900);
      if (!await tapEl(await page.$('#bohphone .bpctx.town .lv'))) { const sfr = page.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); } await page.waitForTimeout(1300); } };
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await leaveTown();
  const guard = setInterval(() => { fr.evaluate(() => { try { if (MEET.up && !/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '') && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const st = () => fr.evaluate(() => { const H = BohemiaHisMap.state(), B = BohemiaBosses.state(); return JSON.parse(JSON.stringify({ at: [city.x, city.y], boss: H.boss, verbs: B.verbs, rumours: B.rumours })); });
  const settle = async () => { for (let i = 0; i < 160; i++) { await page.waitForTimeout(500); await leaveTown(); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length || !!document.getElementById('roadcard') || (MEET && MEET.up)).catch(() => false)) break; } await page.waitForTimeout(800); };
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  const waitSign = async (n) => { let s = null; for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); s = await st(); if ((s.boss.sign && s.boss.sign.n === n && s.rumours[n]) || s.boss.found[n]) break;
      if (i === 14 && !s.boss.sign) { const st2 = await fr.evaluate(() => { const h = [city.x, city.y], n = om.n; let best = null, bd = 1e9;
          for (let y = 2; y < n - 2; y++) for (let x = 2; x < n - 2; x++) { if (!cityWalkable(x, y) || loopTownAt(x, y, 1)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd && dd >= 3 && cityRoute(h[0], h[1], x, y)) { bd = dd; best = [x, y]; } } return best; }).catch(() => null);
        if (st2) { await go(st2); await settle(); } } } return s; };
  /* his place: walk there, his card, ENGAGE, AUTO (the checker ends it after `patience` and says so), the spoils left */
  const fightAt = async (n, patience) => {
    let s = await st(); const f = s.boss.found[n]; if (!f) return { meet: false, ff: null, by: 'not found' };
    await go([f.x, f.y]); let meet = false;
    for (let i = 0; i < 240 && !meet; i++) { await page.waitForTimeout(500); await leaveTown();
      meet = await fr.evaluate((n) => { try { return !!(MEET.up && MEET.up.msg && MEET.up.msg.why === 'boss:' + n); } catch (e) { return false; } }, n).catch(() => false);
      if (!meet && i % 20 === 19 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) await go([f.x, f.y]); }
    let mc = null;
    if (meet) { await page.waitForTimeout(1500); mc = await fr.evaluate(() => { const d = document.querySelector('#meetcard .mcboss'), g = document.querySelector('#meetcard button[data-meet="go"]'), b = document.querySelector('#meetcard button[data-meet="back"]');
        return d ? { look: d.dataset.look, face: (BohemiaBosses.last().cardFace || null), text: d.textContent, go: !!g, back: !!b } : null; }).catch(() => null);
      if (n === TAP) await shot('3_his_card'); await tapEl(await fr.$('#meetcard button[data-meet="go"]')); }
    let ff = null;
    for (let i = 0; i < 120 && !ff; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
      if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    let him = null, res = null, by = 'no fight';
    if (ff) {
      him = await ff.evaluate(() => { const u = FIGHT.S.units.filter(u => u.side === 'them' && u.boss)[0]; return u ? { name: u.name, look: u.look || null } : null; }).catch(() => null);
      await tapEl(await ff.$('#bauto'));
      for (let i = 0; i < patience * 2 && !res; i++) { await page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null);
        if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
      by = 'AUTO';
      if (res !== 'won') { by = 'THE CHECKER (AUTO ' + (res || 'not done in ' + patience + ' s') + ')';
        await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
      for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
      await page.waitForTimeout(1200);
      let left = false; try { const sf = page.frames().find(x => /SPOILS_SCREEN/.test(x.url())); if (sf) { await page.waitForTimeout(1200); left = await tapEl(await sf.$('#leave')); } } catch (e) {}
      await page.waitForTimeout(600);
      if (!left || await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
      for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const q = await st(); if (q.boss.fallen[n]) break; }
    }
    return { meet, mc, ff: !!ff, him, by };
  };

  /* ---------- T0: THE POT first, the ladder's order ---------- */
  let s = await waitSign(POT);
  const potAsk = await bossCard('asker', POT, 110000); if (potAsk) { await pressCard(0); const ay = await bossCard('asker_yes', POT, 6000); if (ay) await pressCard(0); }
  s = await st(); if (s.boss.sign && s.boss.sign.n === POT) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
  const potThing = await bossCard('thing', POT, 12000); if (potThing) await pressCard(1);
  const pf = await fightAt(POT, 25);
  const potAfter = await bossCard('after', POT, 30000); if (potAfter) await pressCard(0);
  await page.waitForTimeout(2500);
  s = await st();
  ok('T0 THE POT first, the ladder\'s order: his sign read, his card, his fight, his verb taken', !!s.boss.fallen[POT] && !!s.verbs.cook && pf.meet && pf.ff,
     'fallen ' + !!s.boss.fallen[POT] + ', COOK ' + !!s.verbs.cook + ', card ' + pf.meet + ', fight won by ' + pf.by);

  /* ---------- T1, T2: THE TAP found by his tag ---------- */
  const row = await rowOf(TAP);
  s = await waitSign(TAP);
  ok('T1 THE TAP: his sign (a ' + ((s.boss.sign || {}).kind || '?') + ') is in the world and his rumour is on the feed', !!(s.boss.sign && s.boss.sign.n === TAP) && !!s.rumours[TAP],
     s.boss.sign ? s.boss.sign.kind + ' at ' + s.boss.sign.x + ',' + s.boss.sign.y + ', his place ' + s.boss.sign.boss.x + ',' + s.boss.sign.boss.y : 'no sign');
  const ak = await bossCard('asker', TAP, 140000);
  if (ak) { await shot('0_he_asks'); await pressCard(0); const ay = await bossCard('asker_yes', TAP, 6000); if (ay) await pressCard(0); await page.waitForTimeout(600); }
  s = await st(); if (s.boss.sign && s.boss.sign.n === TAP) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
  s = await st(); const f = s.boss.found[TAP];
  const th = f ? await bossCard('thing', TAP, 12000) : null;
  ok('T2 ' + row.lead.asker.name + ' asks; at the tag one of yours reads it out (his watchers on the pipe); his place is marked', !!ak && !!f && !!th && th.text === row.lead.thing.says && /crossbows/.test(th.text) && th.name !== 'YOU',
     (ak ? ak.name + ' asked' : 'nobody asked') + '; ' + (th ? th.name + ': "' + th.text.slice(0, 110) + '..."' : 'no card') + '; marked ' + (f ? f.x + ',' + f.y : 'NO'));
  if (th) { await shot('1_the_tag_read_out'); await pressCard(1); await page.waitForTimeout(600); }
  if (!f) { ok('the walk reached THE TAP', false, 'the tag was not read'); clearInterval(guard); await d.close().catch(() => {}); return; }

  /* ---------- P1: his pipe ---------- */
  await fr.evaluate(() => render()); await page.waitForTimeout(300);
  const pipe = await fr.evaluate((n) => { const P = BohemiaBosses.pipe(n); if (!P) return null; return JSON.parse(JSON.stringify(Object.assign({}, P, { walks: P.blocks.map(b => !!cityWalkable(b.x, b.y)) }))); }, TAP);
  ok('P1 his pipe: at least 3 blocks of the map\'s own route from his door toward ' + ((pipe && pipe.town) || 'a town') + ', and every pipe block still walks (not THE POT\'s wall)', !!pipe && pipe.blocks.length >= 3 && pipe.walks.every(Boolean),
     pipe ? pipe.blocks.length + ' blocks ' + pipe.blocks.map(b => b.x + ',' + b.y + b.along).join(' ') + ' toward ' + pipe.town + ', walks ' + pipe.walks.join(',') : 'no pipe');
  /* ---------- P2: walking under it costs ---------- */
  const lastB = pipe.blocks[pipe.blocks.length - 1], firstB = pipe.blocks[0];
  const boltsN = () => fr.evaluate(() => (window.__BOSS_BOLTS || []).length);
  const b0 = await boltsN();
  let rose = null, drawnBefore = null;
  const watchRise = setInterval(() => { fr.evaluate(() => { const r = (BohemiaBosses.last().rise || [])[0]; const dp = (BohemiaBosses.last().drew || {}).pipe || []; return { r: r || null, d: dp.filter(q => !q.open && /^pipe_[xy]_before$/.test(q.key)).length }; })
    .then(q => { if (q.r && !rose) rose = q.r; if (q.d && !drawnBefore) drawnBefore = q.d; }).catch(() => {}); }, 150);
  await go([lastB.x, lastB.y]); await settle();
  await shot('2_under_the_pipe');
  await go([firstB.x, firstB.y]); await settle();
  clearInterval(watchRise);
  const m2 = await fr.evaluate((a) => { const B = (window.__BOSS_BOLTS || []).slice(a[0]); const C = BohemiaCondition.get(); const last = B[B.length - 1];
    let lastMan = null; if (last && last.who) { for (const k in C.men) { const m = C.men[k]; if ((m.shown || k) === last.who) lastMan = { who: last.who, lost: m.lostHp || 0 }; } }
    return { bolts: B.map(b => ({ took: b.took, at: b.at, who: b.who })), lastMan }; }, [b0]);
  m2.stepped = 2 * pipe.blocks.length; m2.rose = rose;   /* the walk goes out along the pipe and back: at most one bolt a block each way */
  const posts0 = await fr.evaluate(() => (BOHEMIA_FEED.posts ? BOHEMIA_FEED.posts() : []).map(p => ({ who: p.who, txt: p.txt || '' })));
  const hitPost = posts0.some(p => p.who === row.pipe.feed_hit.who && p.txt.indexOf(row.pipe.feed_hit.txt.split('{')[0].trim()) === 0);
  ok('P2 walking under his pipe costs: every new pipe block a bolt takes blood off one of his men, the number rises off the crew, the street posts it', P2(m2) && hitPost && drawnBefore >= 1,
     m2.bolts.length + ' bolts (' + m2.bolts.map(b => '-' + b.took + ' ' + b.who).join(', ') + '), ' + (m2.lastMan ? m2.lastMan.who + ' down ' + Math.round(m2.lastMan.lost) + ' blood' : 'no man') + ', rose ' + JSON.stringify(rose) + ', ' + drawnBefore + ' pipe blocks painted with his watcher, the post ' + hitPost);
  ok('P2p planted: a walk under the pipe with no bolt turns P2 red', !P2(Object.assign({}, m2, { bolts: [], lastMan: null })));
  /* ---------- B0, B1: his card, his fight ---------- */
  const tf = await fightAt(TAP, 180);
  ok('B0 THE TAP\'s card first: his own face, his title, his tip, ENGAGE or FALL BACK', tf.meet && !!tf.mc && tf.mc.look === row.boss.look && tf.mc.face === row.boss.look && tf.mc.text.indexOf(row.tip) >= 0 && tf.mc.go && tf.mc.back, JSON.stringify(tf.mc));
  ok('B1 his fight stands with the man himself (' + row.boss.look + ') and is won', tf.ff && !!tf.him && tf.him.name === row.boss.name && tf.him.look === row.boss.look, (tf.him ? tf.him.name + ' in ' + tf.him.look : 'no boss') + ', won by ' + tf.by);
  /* ---------- B2: the beat, his card ---------- */
  const bat0 = await fr.evaluate(() => { try { return BohemiaPurse.balance(purseGet(), 'electricity'); } catch (e) { return null; } });
  const af = await bossCard('after', TAP, 30000);
  const bt = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_BEAT || null))).catch(() => null);
  if (af) { await page.waitForTimeout(500); await shot('4_he_says_what_changed'); }
  const pay = (row.verb.pay_batteries | 0);
  const want = row.pipe.card.replace('{TOWN}', String(pipe.town).toUpperCase()).replace('{TAPS}', pipe.blocks.length + (pipe.blocks.length === 1 ? ' TAP' : ' TAPS')).replace('{pay}', pay);
  s = await st();
  ok('B2 he falls: the beat rolls his pipe over to taps with his pump house, ' + row.after.name + ' says the valley\'s line, hands his wrench, and says the taps on his pipe', !!s.boss.fallen[TAP] && !!s.verbs.open && !!bt && bt.n === TAP && (bt.pipe | 0) >= 1
     && !!af && af.text === row.after.valley && !!af.hand && af.hand.name === row.verb.hand.name && af.ground === want,
     'fallen ' + !!s.boss.fallen[TAP] + ', OPEN ' + !!s.verbs.open + ', the beat ' + (bt ? bt.phases.join('>') + ' with ' + bt.pipe + ' pipe blocks on the tape' : 'none') + ', card: ' + (af ? '"' + af.text + '" + ' + (af.hand ? af.hand.name : 'NO THING') + ' + "' + af.ground + '"' : 'none'));
  if (af) await pressCard(0);
  await page.waitForTimeout(2500);
  /* ---------- C1: the change is real ---------- */
  const b1 = await boltsN();
  await go([lastB.x, lastB.y]); await settle();
  const b2 = await boltsN();
  ok('C1a no bolt walks his pipe after he falls', b2 === b1, (b2 - b1) + ' bolts on the walk back along it');
  const mid = pipe.blocks[Math.min(1, pipe.blocks.length - 1)];
  await go([mid.x, mid.y]); await settle();
  const applies = await fr.evaluate((n) => { const P = BohemiaBosses.pipe(n); return P.blocks.map(b => !!(BohemiaBosses.applies('open', b.x, b.y))); }, TAP);
  let band = null; for (let i = 0; i < 20; i++) { await page.waitForTimeout(300); band = await page.evaluate(() => { const b = document.querySelector('#bohphone .bpctx.verb .vb'); return b ? { text: b.textContent, verb: b.dataset.verb, off: b.classList.contains('off') } : null; }); if (band && band.verb === 'open') break; }
  const p0 = await fr.evaluate(() => { const P = purseGet(); return { bat: BohemiaPurse.balance(P, 'electricity'), n: P.entries.length }; });
  if (band && band.verb === 'open' && !band.off) await tapEl(await page.$('#bohphone .bpctx.verb .vb'));
  await page.waitForTimeout(1500);
  const p1 = await fr.evaluate((at) => { const P = purseGet(); const E = P.entries.filter(e => e.ref === 'boss-verb:open:' + at[0] + ',' + at[1]); return { bat: BohemiaPurse.balance(P, 'electricity'), paid: E.reduce((a, e) => a + e.amount, 0), marked: BohemiaBosses.state().marks.some(m => m.k === 'open' && m.x === at[0] && m.y === at[1]) }; }, [mid.x, mid.y]);
  const m3 = { applies, paid: p1.paid, marked: p1.marked };
  ok('C1b every pipe block is a main for ' + row.verb.button + '; a real tap on the phone at one pays ' + pay + ' batteries (the purse\'s ledger) and marks it', C1b(Object.assign({}, m3, { applies: m3.applies.map((a, i) => i === pipe.blocks.indexOf(mid) ? true : a) }), pay) && !!band && band.verb === 'open',
     'applies ' + applies.join(',') + ' (before the tap), the band ' + JSON.stringify(band) + ', paid ' + p1.paid + ' (' + p0.bat + ' -> ' + p1.bat + '), marked ' + p1.marked);
  await fr.evaluate(() => render()); await page.waitForTimeout(400);
  const dr = await fr.evaluate(() => ((BohemiaBosses.last().drew || {}).pipe || []).map(q => ({ key: q.key, open: q.open })));
  ok('C1c the pipe is painted with its taps (the after picture), never a watcher', dr.length >= 1 && dr.every(q => q.open && /^pipe_[xy]_after$/.test(q.key)), dr.length + ' on the glass: ' + dr.slice(0, 3).map(q => q.key).join(' '));
  const posts = await fr.evaluate(() => (BOHEMIA_FEED.posts ? BOHEMIA_FEED.posts() : []).map(p => ({ who: p.who, txt: p.txt || '' })));
  const C1d = (ps) => ps.some(p => p.who === row.pipe.feed.who && p.txt.indexOf(row.pipe.feed.txt.split('{')[0].trim()) === 0) && ps.some(p => p.who === '@valleyradio' && /pipe/i.test(p.txt));
  ok('C1d the feed posts it: the street (' + row.pipe.feed.who + ') and the radio', C1d(posts), posts.filter(p => p.who === row.pipe.feed.who || p.who === '@valleyradio').map(p => p.who + ': ' + p.txt.slice(0, 70)).join(' | '));
  await shot('5_the_pipe_after');
  /* P3: one pipe block guarded again after the fall, on the game's own state: C1b must go red */
  const p3 = await fr.evaluate((n) => { const P = BohemiaBosses.pipe(n), H = BohemiaHisMap.state(), was = P.open, f = H.boss.fallen[n]; P.open = null; delete H.boss.fallen[n];
    const a = P.blocks.map(b => !!BohemiaBosses.applies('open', b.x, b.y)); P.open = was; H.boss.fallen[n] = f; return a; }, TAP);
  ok('P3 planted: his pipe guarded again after the fall turns C1b red', !C1b(Object.assign({}, m3, { applies: p3 }), pay), 'applies under the plant ' + p3.join(','));
  clearInterval(guard);
  /* ---------- R1: the same phone opens the game again ---------- */
  const saved = () => page.evaluate(() => ['bohemia_city_save.a', 'bohemia_city_save.b', 'bohemia_city_save'].some(k => { const v = localStorage.getItem(k); return !!v && v !== '{"bohemia":"DEAD"}'; })).catch(() => false);
  for (let i = 0; i < 60 && !(await saved()); i++) await page.waitForTimeout(500);
  await page.waitForTimeout(3000);
  const reopen = async (wipe) => {
    if (wipe) await page.evaluate(() => { localStorage.removeItem('bohemia.bosses.v1'); localStorage.removeItem('bohemia.hismap.v1'); });
    const e = await open({ again: d, fog: true });
    for (let i = 0; i < 80; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data() && typeof city !== 'undefined').catch(() => false)) break; }
    for (let i = 0; i < 20; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => { try { return FOG.ready; } catch (x) { return false; } }).catch(() => false)) break; }
    const bz = await e.fr.evaluate(() => (window.__BOSS_BOLTS || []).length).catch(() => 0);
    /* he walks the pipe once more on the reopened game: no bolt */
    await e.fr.evaluate((c) => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); travelSpeedSet(4); travelTo(0, 0, c); travelGoes(); } catch (x) {} }, [firstB.x, firstB.y]).catch(() => {});
    for (let i = 0; i < 80; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => true)) break; }
    const q = await e.fr.evaluate((a) => { const n = a[0], H = BohemiaHisMap.state(), P = BohemiaBosses.pipe(n) || { blocks: [] };
      return { fallen: !!H.boss.fallen[n], open: P.open != null, applies: P.blocks.filter(b => !(b.x === a[1][0] && b.y === a[1][1])).map(b => !!BohemiaBosses.applies('open', b.x, b.y)),
        openedStill: BohemiaBosses.state().marks.some(m => m.k === 'open' && m.x === a[1][0] && m.y === a[1][1]), bolts: (window.__BOSS_BOLTS || []).length - a[2], at: [city.x, city.y] }; }, [TAP, [mid.x, mid.y], bz]).catch(x => ({ err: String(x) }));
    return { e, q };
  };
  const o1 = await reopen(false);
  if (SHOTS) { try { await o1.e.shot(path.join(SHOTS, '6_opened_again.png')); } catch (x) {} }
  ok('R1 the same phone opens the game again: he is still down, his pipe still taps, the opened tap still opened, no bolt on the walk', R1(o1.q), JSON.stringify(o1.q).slice(0, 260));
  errs.push(...(o1.e.errs || []));
  try { await o1.e.page.close(); } catch (x) {}
  const o2 = await reopen(true);
  ok('P4 planted: a phone that forgot the save turns R1 red', !R1(o2.q), JSON.stringify(o2.q).slice(0, 200));
  try { await o2.e.page.close(); } catch (x) {}
  ok('C0 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTHE TAP CHANGES THE MAP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
