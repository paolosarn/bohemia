#!/usr/bin/env node
/* ============================================================================
   THE FILTER CHANGES THE MAP, HIS OWN WAY (BOSSES lane, 11/9/26, VAMILY rule 440(b); ask lines 167, 522).

   PAOLO 11/9: 'More everything pls'; the coordinator's line: the next two bosses of the ladder, each found by a sign, each handing its
   verb, each changing the map ITS OWN WAY, kept after a reload. THE FILTER's row's lesson: 'He keeps the plant's robots walking. Kill
   the keeper and every machine of his drops where it stands.' Record: records/BOHEMIA_BOSSES_THE_TAP_AND_THE_FILTER_CHANGE_THE_MAP_11_9_26.md.
   Code: slices/bohemia_bosses.js (10) HIS MACHINES; data records/target/bb/boss_act_one.json (THE FILTER's 'machines'); pictures
   slices/boss_places/machine_* (tools/bohemia_bosses_the_filters_machines_11_9_26.py).

   THE STRANGER'S GAME on the live demo at phone size, a new game, the ladder in order:
     T0 THE POT and THE TAP first: each one's sign read and his fall through the map's own fell(), the door a won fight calls (each of
        them is walked whole, fight and all, by his own gate: the_first_boss_changes_the_map_gate.js, the_tap_changes_the_map_gate.js),
        each one's card taken
     T1 THE FILTER's sign (the radio) is in the world and his rumour is on the feed
     T2 DOC REYES asks; at the radio one of YOUR men reads it out (his robots stand guard); his place is marked
     M1 HIS MACHINES: at least 2 of the plant's robots on street blocks round his door, painted standing
     M2 walking up to one: its card first (ENGAGE or FALL BACK), his robots on the board, the fight won, and that machine dropped where
        it stood, painted dropped
     M3 stepping onto the wreck strips it once: the company's tape up by the row's tape, the number rises, the post
     B0 his card first; B1 his fight won
     B2 the beat drops the rest of his machines on the tape with his tanks, then DOC REYES says the valley's line, hands his filter, and
        the line under it says the wrecks and the tape
     C1a every machine down, and walking up to one no longer fights; C1b a dropped one stripped pays its tape; C1c painted dropped;
         C1d the feed posts it (@doc_reyes and the radio)
     R1 the same phone opens the game again: still down, every machine a wreck, the stripped ones not stripped twice, no fight beside one
   PLANTED: M3p a wreck stripped a second time (the walk off it and back on); P3 one machine standing again after the fall (live);
   P4 a phone that forgot the save. Each must turn its own check red.
   C0 nothing threw.
   Pictures: records/target/the_filter_changes_the_map/ (BOSSES_SHOTS=0 to skip; .png ignored, the record keeps .webp).
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const SHOTS = process.env.BOSSES_SHOTS === '0' ? null : path.join(ROOT, 'records', 'target', 'the_filter_changes_the_map');
const POT = 'THE POT', TAP = 'THE TAP', FIL = 'THE FILTER';

const M3 = (m, tape) => !!m && m.gained === tape && !!m.rose;
const C1a = (m) => !!m && m.list.length >= 2 && m.list.every(q => q.down) && !m.fought;
const R1 = (m, before) => !!m && m.fallen && m.list.length === before.count && m.list.every(q => q.down) && m.strippedSame && m.newStrips === 0 && !m.fought;

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
  const guard = setInterval(() => { fr.evaluate(() => { try { if (MEET.up && !(/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '') || (window.__GATE_MACHINES && /^machine:/.test((MEET.up.msg && MEET.up.msg.why) || ''))) && window.MEET_DONE) MEET_DONE(false);   /* his machines' cards are this gate's only while M2 asks for one; any other he falls back from, the way a stranger walking past would */ } catch (e) {} }).catch(() => {}); }, 400);
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
      if (n === FIL) await shot('3_his_card'); await tapEl(await fr.$('#meetcard button[data-meet="go"]')); }
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


  /* ---------- T0: THE POT and THE TAP first, the ladder's order (their own gates walk them whole) ---------- */
  /* an earlier boss's own card that turns up while he is felled the quick way (his asker 60 s in, his flyer, his after card) is answered
     the way a stranger would, so it never stands over the next boss's (measured 11/9, run 1: THE POT's asker stood over everything) */
  const clearCards = async () => { for (let k = 0; k < 6; k++) { const c = await fr.evaluate(() => window.__BOSS_CARD && document.getElementById('roadcard') ? window.__BOSS_CARD.kind + '|' + window.__BOSS_CARD.n : null).catch(() => null);
      if (!c) return; const kind = c.split('|')[0], n = c.split('|')[1]; if (n === FIL) return; await pressCard(kind === 'thing' ? 1 : 0); await page.waitForTimeout(900); } };
  const downBy = async (n) => { let s = await waitSign(n); await clearCards();
    s = await st(); if (s.boss.sign && s.boss.sign.n === n && !s.boss.found[n]) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); await clearCards(); }
    s = await st(); if (s.boss.sign && s.boss.sign.n === n && !s.boss.found[n]) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
    const th = await bossCard('thing', n, 8000); if (th) await pressCard(1);
    await clearCards();
    s = await st(); if (!s.boss.found[n]) return false;
    await fr.evaluate((n) => { BohemiaHisMap.fell(n); }, n);
    const af = await bossCard('after', n, 30000); if (af) await pressCard(0);
    await page.waitForTimeout(2500); await clearCards(); s = await st(); return !!s.boss.fallen[n]; };
  const potDown = await downBy(POT), tapDown = await downBy(TAP);
  ok('T0 THE POT and THE TAP first, the ladder\'s order (each one\'s sign read, his fall through the map\'s own fell(), his card taken)', potDown && tapDown, 'THE POT ' + potDown + ', THE TAP ' + tapDown);

  /* ---------- T1, T2: THE FILTER found by his radio ---------- */
  const row = await rowOf(FIL), G = row.machines;
  let s = await waitSign(FIL);
  ok('T1 THE FILTER: his sign (the ' + ((s.boss.sign || {}).kind || '?') + ') is in the world and his rumour is on the feed', !!(s.boss.sign && s.boss.sign.n === FIL) && !!s.rumours[FIL],
     s.boss.sign ? s.boss.sign.kind + ' at ' + s.boss.sign.x + ',' + s.boss.sign.y + ', his place ' + s.boss.sign.boss.x + ',' + s.boss.sign.boss.y : 'no sign');
  await clearCards();
  const ak = await bossCard('asker', FIL, 140000);
  if (ak) { await shot('0_she_asks'); await pressCard(0); const ay = await bossCard('asker_yes', FIL, 6000); if (ay) await pressCard(0); await page.waitForTimeout(600); }
  s = await st(); if (s.boss.sign && s.boss.sign.n === FIL) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
  s = await st(); const f = s.boss.found[FIL];
  const th = f ? await bossCard('thing', FIL, 12000) : null;
  ok('T2 ' + row.lead.asker.name + ' asks; at the radio one of yours reads it out (his robots stand guard); his place is marked', !!ak && !!f && !!th && th.text === row.lead.thing.says && /robots stand guard/.test(th.text) && th.name !== 'YOU',
     (ak ? ak.name + ' asked' : 'nobody asked') + '; ' + (th ? th.name + ': "' + th.text.slice(0, 120) + '..."' : 'no card') + '; marked ' + (f ? f.x + ',' + f.y : 'NO'));
  if (th) { await shot('1_the_radio_read_out'); await pressCard(1); await page.waitForTimeout(600); }
  if (!f) { ok('the walk reached THE FILTER', false, 'the radio was not read'); clearInterval(guard); await d.close().catch(() => {}); return; }
  const mac = () => fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.machines(n) || null)), FIL);
  /* ---------- M1: his machines ---------- */
  let M = await mac();
  ok('M1 his machines: at least 2 of the plant\'s robots stand on street blocks round his door', !!M && M.list.length >= 2 && (await fr.evaluate((L) => L.every(q => !!cityWalkable(q.x, q.y)), M.list)),
     M ? M.list.map(q => q.x + ',' + q.y).join(' ') + ' round ' + M.at.join(',') : 'none');
  /* ---------- M2: walking up to one ---------- */
  const one = M.list[0];
  const besideOf = (q) => fr.evaluate((q) => { const h = [city.x, city.y]; let best = null, bd = 1e9; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { if (!a && !b) continue; const x = q.x + a, y = q.y + b;
      if (!cityWalkable(x, y)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd) { bd = dd; best = [x, y]; } } return best; }, q);
  const tgt = await besideOf(one);
  await fr.evaluate(() => { window.__GATE_MACHINES = true; });
  let meet = null; await go(tgt);
  let drawnStanding = 0;
  for (let i = 0; i < 200 && !meet; i++) { await page.waitForTimeout(500);
    if (!drawnStanding) drawnStanding = await fr.evaluate(() => ((BohemiaBosses.last().drew || {}).machines || []).filter(q => !q.down && q.key === 'machine_before').length).catch(() => 0);
    meet = await fr.evaluate(() => { try { return MEET.up && /^machine:/.test((MEET.up.msg && MEET.up.msg.why) || '') ? { why: MEET.up.msg.why, what: (MEET.up.msg.party || {}).what } : null; } catch (e) { return null; } }).catch(() => null);
    if (!meet && i % 30 === 29 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) await go(tgt); }
  if (meet) { await page.waitForTimeout(1200); await shot('2_his_machine_and_its_card'); }
  await fr.evaluate(() => { window.__GATE_MACHINES = false; });
  /* the one that met him is the one the walk passed first, not always the one aimed at (measured 11/9, run 3: the walk to machine 0 went
     past machine 2, and machine 2 fought, which is the game being right) */
  const mi = meet ? (+String(meet.why).split(':').pop() | 0) : 0, metOne = M.list[mi];
  const mcard = meet ? await fr.evaluate(() => { const g = document.querySelector('#meetcard button[data-meet="go"]'), b = document.querySelector('#meetcard button[data-meet="back"]'), el = document.getElementById('meetcard'); return { go: !!g, back: !!b, text: el ? el.textContent.slice(0, 200) : '' }; }) : null;
  if (meet) await tapEl(await fr.$('#meetcard button[data-meet="go"]'));
  let ff = null;
  for (let i = 0; i < 120 && !ff && meet; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
    if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
  let kinds = null, by = 'no fight';
  if (ff) {
    kinds = await ff.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind)).catch(() => null);
    await tapEl(await ff.$('#bauto')); let res = null;
    for (let i = 0; i < 240 && !res; i++) { await page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null); if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
    by = 'AUTO'; if (res !== 'won') { by = 'THE CHECKER (AUTO ' + (res || 'not done in 120 s') + ')'; await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
    await page.waitForTimeout(1200);
    let left = false; try { const sf = page.frames().find(x => /SPOILS_SCREEN/.test(x.url())); if (sf) { await page.waitForTimeout(1200); left = await tapEl(await sf.$('#leave')); } } catch (e) {}
    await page.waitForTimeout(600); if (!left || await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    for (let i = 0; i < 30; i++) { await page.waitForTimeout(500); M = await mac(); if (M.list[mi].down != null) break; }
  }
  M = await mac();
  ok('M2 walking up to one of his machines: its card first (ENGAGE or FALL BACK), his robots on the board, won, and it dropped where it stood', !!meet && !!mcard && mcard.go && mcard.back && !!ff && !!kinds && kinds.length === G.band.length && kinds.every(k => G.band.indexOf(k) >= 0) && M.list[mi].down != null && M.list[mi].how === 'fight' && drawnStanding >= 1,
     (meet ? meet.why + ' "' + meet.what + '"' : 'no card') + ', board ' + JSON.stringify(kinds) + ', won by ' + by + ', the machine ' + JSON.stringify(M.list[mi]) + ', ' + drawnStanding + ' painted standing before');
  /* ---------- M3: strip the wreck ---------- */
  const tapeOf = () => fr.evaluate(() => { try { return (JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}').tape) | 0; } catch (e) { return null; } });
  let rose = null; const watchRise = setInterval(() => { fr.evaluate(() => (BohemiaBosses.last().rise || [])[0] || null).then(r => { if (r && !rose) rose = r; }).catch(() => {}); }, 150);
  /* the strip's own record, never the tape's delta: the camp spends tape mending armour while the crew walks (measured 11/9, run 2:
     a +4 strip read +2 on the count) */
  const stripsOf = () => fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_STRIPS || [])));
  const s0 = (await stripsOf()).length, t0 = await tapeOf(); await go([metOne.x, metOne.y]); await settle(); const t1 = await tapeOf();
  clearInterval(watchRise);
  const sA = (await stripsOf()).slice(s0), gained = sA.filter(x => x.n === FIL && x.i === mi).reduce((a, x) => a + x.tape, 0);
  ok('M3 stepping onto the wreck strips it: the company\'s tape +' + G.tape + ', the number rises', M3({ gained, rose }, G.tape), 'stripped ' + JSON.stringify(sA) + ', the tape count ' + t0 + ' -> ' + t1 + ', rose ' + JSON.stringify(rose));
  /* M3p: off it and back on: no second strip */
  const sB0 = (await stripsOf()).length; const off = await besideOf(metOne); await go(off); await settle(); await go([metOne.x, metOne.y]); await settle();
  const again = (await stripsOf()).slice(sB0).filter(x => x.n === FIL && x.i === mi).length;
  ok('M3p planted: a wreck stripped a second time (+' + (2 * G.tape) + ') turns M3 red, and the walk back onto it strips nothing', !M3({ gained: 2 * gained, rose }, G.tape) && again === 0, again + ' strips on the second step onto it');
  /* ---------- B0, B1: his card, his fight ---------- */
  const xf = await fightAt(FIL, 120);
  ok('B0 THE FILTER\'s card first: his own face, his title, his tip, ENGAGE or FALL BACK', xf.meet && !!xf.mc && xf.mc.look === row.boss.look && xf.mc.face === row.boss.look && xf.mc.text.indexOf(row.tip) >= 0 && xf.mc.go && xf.mc.back, JSON.stringify(xf.mc));
  ok('B1 his fight stands with the man himself (' + row.boss.look + ') and is won', xf.ff && !!xf.him && xf.him.name === row.boss.name && xf.him.look === row.boss.look, (xf.him ? xf.him.name + ' in ' + xf.him.look : 'no boss') + ', won by ' + xf.by);
  /* ---------- B2: the beat, her card ---------- */
  const af = await bossCard('after', FIL, 30000);
  const bt = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_BEAT || null))).catch(() => null);
  if (af) { await page.waitForTimeout(500); await shot('4_she_says_what_changed'); }
  M = await mac();
  const nW = M.list.length, want = G.card.replace('{WRECKS}', nW + (nW === 1 ? ' WRECK' : ' WRECKS')).replace('{tape}', G.tape);
  s = await st();
  ok('B2 he falls: the beat drops his machines on the tape with his tanks, ' + row.after.name + ' says the valley\'s line, hands his filter, and says the wrecks and the tape', !!s.boss.fallen[FIL] && !!s.verbs.purify && !!bt && bt.n === FIL && (bt.machines | 0) >= 1
     && !!af && af.text === row.after.valley && !!af.hand && af.hand.name === row.verb.hand.name && af.ground === want,
     'fallen ' + !!s.boss.fallen[FIL] + ', PURIFY ' + !!s.verbs.purify + ', the beat ' + (bt ? bt.phases.join('>') + ' with ' + bt.machines + ' machines on the tape' : 'none') + ', card: ' + (af ? '"' + af.text + '" + ' + (af.hand ? af.hand.name : 'NO THING') + ' + "' + af.ground + '"' : 'none'));
  if (af) await pressCard(0);
  await page.waitForTimeout(2500);
  /* ---------- C1 ---------- */
  M = await mac();
  const two = M.list.filter(q => q.how === 'keeper')[0] || M.list[1];
  await fr.evaluate(() => { window.__GATE_MACHINES = true; });
  const f0 = await fr.evaluate(() => (window.__BOSS_MACHINE_FIGHT || {}).t || 0);
  await go(await besideOf(two)); await settle(); await page.waitForTimeout(4000);
  const f1 = await fr.evaluate(() => ({ t: (window.__BOSS_MACHINE_FIGHT || {}).t || 0, meet: (function () { try { return !!(MEET.up && /^machine:/.test(MEET.up.msg.why)); } catch (e) { return false; } })() }));
  await fr.evaluate(() => { window.__GATE_MACHINES = false; });
  const m4 = { list: M.list.map(q => ({ down: q.down != null, how: q.how })), fought: f1.t !== f0 || f1.meet };
  ok('C1a every one of his machines is down, and walking up to one no longer fights', C1a(m4), JSON.stringify(m4.list) + ', a fight beside one ' + m4.fought);
  const iTwo = M.list.findIndex(q => q.x === two.x && q.y === two.y), s3 = (await stripsOf()).length; await go([two.x, two.y]); await settle();
  /* the walk can be stopped short by somebody on the road (settle ends at any card): keep walking until he is on it, then read (measured
     11/9, run 4: the strip came seconds after the first look, and the reopen showed it stripped) */
  for (let i = 0; i < 40; i++) { const at = await fr.evaluate(() => [city.x, city.y]); if (at[0] === two.x && at[1] === two.y && (await stripsOf()).length > s3) break;
    await page.waitForTimeout(500); if (i % 6 === 5 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => false)) await go([two.x, two.y]); }
  const sC = (await stripsOf()).slice(s3).filter(x => x.n === FIL && x.i === iTwo), stTwo = (await mac()).list[iTwo];
  ok('C1b a machine that dropped when he fell is stripped for its tape (+' + G.tape + ')', sC.length === 1 && sC[0].tape === G.tape && stTwo.stripped != null && stTwo.how === 'keeper', JSON.stringify(sC) + ', the machine ' + JSON.stringify(stTwo));
  await fr.evaluate(() => render()); await page.waitForTimeout(400);
  const dr = await fr.evaluate(() => ((BohemiaBosses.last().drew || {}).machines || []).map(q => ({ key: q.key, down: q.down, stripped: q.stripped })));
  ok('C1c his machines are painted dropped (the wreck), never standing', dr.length >= 1 && dr.every(q => q.down && q.key === 'machine_after'), dr.length + ' on the glass: ' + dr.map(q => q.key + (q.stripped ? '(stripped)' : '')).join(' '));
  const posts = await fr.evaluate(() => (BOHEMIA_FEED.posts ? BOHEMIA_FEED.posts() : []).map(p => ({ who: p.who, txt: p.txt || '' })));
  const C1d = (ps) => ps.some(p => p.who === G.feed.who && p.txt.indexOf(G.feed.txt.split('{')[0].trim()) === 0) && ps.some(p => p.who === '@valleyradio' && /clean water/i.test(p.txt));
  ok('C1d the feed posts it: ' + G.feed.who + ' and the radio', C1d(posts), posts.filter(p => p.who === G.feed.who || p.who === '@valleyradio').map(p => p.who + ': ' + p.txt.slice(0, 70)).join(' | '));
  await shot('5_the_wrecks');
  /* P3: one machine standing again after the fall, on the game's own state: C1a must go red */
  const p3 = await fr.evaluate((n) => { const Mm = BohemiaBosses.machines(n), H = BohemiaHisMap.state(), q = Mm.list[Mm.list.length - 1], was = q.down, f = H.boss.fallen[n]; q.down = null; delete H.boss.fallen[n];
    const r = Mm.list.map(x => ({ down: x.down != null || !!H.boss.fallen[n] })); q.down = was; H.boss.fallen[n] = f; return r; }, FIL);
  ok('P3 planted: one machine standing again after the fall turns C1a red', !C1a({ list: p3, fought: false }), JSON.stringify(p3));
  clearInterval(guard);
  /* ---------- R1 ---------- */
  const before = { count: M.list.length, stripped: (await mac()).list.map(q => q.stripped != null), tape: await tapeOf() };
  const saved = () => page.evaluate(() => ['bohemia_city_save.a', 'bohemia_city_save.b', 'bohemia_city_save'].some(k => { const v = localStorage.getItem(k); return !!v && v !== '{"bohemia":"DEAD"}'; })).catch(() => false);
  for (let i = 0; i < 60 && !(await saved()); i++) await page.waitForTimeout(500);
  await page.waitForTimeout(3000);
  const reopen = async (wipe) => {
    if (wipe) await page.evaluate(() => { localStorage.removeItem('bohemia.bosses.v1'); localStorage.removeItem('bohemia.hismap.v1'); });
    const e = await open({ again: d, fog: true });
    for (let i = 0; i < 80; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data() && typeof city !== 'undefined').catch(() => false)) break; }
    for (let i = 0; i < 20; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => { try { return FOG.ready; } catch (x) { return false; } }).catch(() => false)) break; }
    await e.fr.evaluate(() => { window.__BOSSES_TALK = true; }).catch(() => {});
    const tA = await e.fr.evaluate(() => (window.__BOSS_STRIPS || []).length).catch(() => 0);
    /* he steps onto the wreck he already stripped, and beside another: nothing to strip, no fight */
    await e.fr.evaluate((c) => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); travelSpeedSet(4); travelTo(0, 0, c); travelGoes(); } catch (x) {} }, [metOne.x, metOne.y]).catch(() => {});
    for (let i = 0; i < 80; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => true)) break; }
    await e.page.waitForTimeout(2500);
    const q = await e.fr.evaluate((a) => { const n = a[0], H = BohemiaHisMap.state(), Mm = BohemiaBosses.machines(n) || { list: [] };
      let tape = null; try { tape = (JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}').tape) | 0; } catch (x) {}
      return { fallen: !!H.boss.fallen[n], list: Mm.list.map(x => ({ down: x.down != null, stripped: x.stripped != null })), tape, strips: (window.__BOSS_STRIPS || []).length, fought: !!window.__BOSS_MACHINE_FIGHT || (function () { try { return !!(MEET.up && /^machine:/.test(MEET.up.msg.why)); } catch (x) { return false; } })() }; }, [FIL]).catch(x => ({ err: String(x) }));
    if (q && q.list) { q.strippedSame = JSON.stringify(q.list.map(x => x.stripped)) === JSON.stringify(before.stripped); q.newStrips = (q.strips | 0) - (tA | 0); }
    return { e, q };
  };
  const o1 = await reopen(false);
  if (SHOTS) { try { await o1.e.shot(path.join(SHOTS, '6_opened_again.png')); } catch (x) {} }
  ok('R1 the same phone opens the game again: he is still down, every machine a wreck, the stripped ones not stripped twice, no fight beside one', R1(o1.q, before), JSON.stringify(o1.q).slice(0, 260));
  errs.push(...(o1.e.errs || []));
  try { await o1.e.page.close(); } catch (x) {}
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
  console.log('\nTHE FILTER CHANGES THE MAP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
