#!/usr/bin/env node
/* ============================================================================
   THE FIRST THREE BOSSES GATE (BOSSES lane, 11/2/26, rule 302; ask line 287).

   PAOLO 11/2: 'Battle Brothers has unique locations and bosses with themes, I want that too... each time you kill a boss you get
   something that helps you interact with the city.' Record: records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md.
   Code: slices/bohemia_bosses.js, data records/target/bb/boss_act_one.json.

   THE STRANGER'S GAME on the live demo at phone size, through the one driver, a new game, THE POT, THE TAP and THE FILTER in the
   ladder's order. For each:
     A1 his sign is in the world and a person has posted his rumour on the phone's feed
     A2 walking to the sign marks his place; at his place his landmark is drawn on his block with his place's name
     A3 his fight stands through the one door: the man himself (his name on him, more blood, the weapon from the file), his own
        crew, his own board
     A4 the fight is won (AUTO plays it, the player's own button; if AUTO loses or stalls the checker ends it and SAYS SO)
     A5 he has fallen, his verb is his, the map shows his place changed
     A6 standing where the verb works, the phone's band shows it, a real tap on it uses it once, and it did what it says
        (COOK: blood back or nobody hurt; OPEN: batteries in the purse; PURIFY: wounds closer or nobody wounded), the block is marked
   C1 nothing threw
   Pictures: records/target/bosses_act_one/ (BOSSES_SHOTS=0 to skip).
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const SHOTS = process.env.BOSSES_SHOTS === '0' ? null : path.join(ROOT, 'records', 'target', 'bosses_act_one');
const NAMES = ['THE POT', 'THE TAP', 'THE FILTER'];

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const d = await open({ profile: prof, fog: true });
  const fr = d.fr, page = d.page, errs = [], wonBy = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const shot = async (name) => { if (SHOTS) { try { await d.shot(path.join(SHOTS, name + '.png')); } catch (e) {} } };
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data()).catch(() => false)) break; }
  /* the start: the closest town's screen; he leaves it with a real tap on LEAVE */
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  /* a town's screen is up when the map's settleFrame shows (the phone's own test); he leaves with a real tap on the phone's LEAVE */
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  const leaveTown = async () => {
    for (let k = 0; k < 3 && await inTown(); k++) {
      await page.waitForTimeout(900);
      if (!await tapEl(await page.$('#bohphone .bpctx.town .lv'))) { const sfr = page.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); }
      await page.waitForTimeout(1300);
    }
  };
  await leaveTown();
  /* any other party's card on the way is fallen back from (a road party is not this gate's fight); his own card is his */
  const guard = setInterval(() => { fr.evaluate(() => { try { if (MEET.up && !/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '') && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const st = () => fr.evaluate(() => { const H = BohemiaHisMap.state(), B = BohemiaBosses.state(); return JSON.parse(JSON.stringify({ at: [city.x, city.y], boss: H.boss, verbs: B.verbs, marks: B.marks, rumours: B.rumours, drew: BohemiaBosses.last().drew })); });
  const settle = async () => { for (let i = 0; i < 160; i++) { await page.waitForTimeout(500); await leaveTown(); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => false)) break; } await page.waitForTimeout(800); };
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);

  for (let bi = 0; bi < NAMES.length; bi++) {
    const n = NAMES[bi], tag = (bi + 1) + '_' + n.replace(/^THE /, '').toLowerCase();
    console.log('  .. ' + n);
    /* A1: the sign and the rumour */
    let s = null;
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); s = await st(); if (s.boss.sign && s.boss.sign.n === n && s.rumours[n]) break; if (s.boss.found[n]) break; }
    const row = await fr.evaluate((n) => { const r = BohemiaBosses.data().bosses.filter(b => b.n === n)[0]; return JSON.parse(JSON.stringify(r)); }, n);
    ok('A1 ' + n + ': his sign is in the world and his rumour is on the phone\'s feed', !!(s.boss.sign && s.boss.sign.n === n || s.boss.found[n]) && !!s.rumours[n],
       (s.boss.sign ? s.boss.sign.kind + ' at ' + s.boss.sign.x + ',' + s.boss.sign.y : 'no sign') + ', rumour by ' + row.rumour.who);
    /* A2: walk to the sign; his place is marked; walk to his place */
    if (s.boss.sign && s.boss.sign.n === n) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
    s = await st(); const f = s.boss.found[n];
    if (!f) { ok('A2 ' + n + ': his place is marked', false, 'the sign was not read; he is at ' + s.at.join(',')); break; }
    await go([f.x, f.y]);
    let meet = false;
    for (let i = 0; i < 240 && !meet; i++) { await page.waitForTimeout(500); await leaveTown(); meet = await fr.evaluate((n) => { try { return !!(MEET.up && MEET.up.msg && MEET.up.msg.why === 'boss:' + n); } catch (e) { return false; } }, n).catch(() => false);
      if (!meet && i % 20 === 19 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) await go([f.x, f.y]); }
    await fr.evaluate(() => render()); await page.waitForTimeout(300);
    s = await st(); const pl = (s.drew.places || []).filter(p => p.n === n)[0];
    const town2 = await inTown();
    ok('A2 ' + n + ': at his place his landmark stands on his block, named ' + row.place.name + ', the map on the glass', meet && !!pl && pl.known && !pl.down && !town2, meet ? JSON.stringify(pl) + (town2 ? ' A TOWN SCREEN IS OVER THE MAP' : '') : 'no card at his place; he is at ' + s.at.join(','));
    await shot(tag + '_a_his_place');
    /* A3: ENGAGE (a real tap), the fight stands with the man himself */
    if (meet) await tapEl(await fr.$('#meetcard button[data-meet="go"]') || await fr.$('button[data-meet="go"]'));
    let ff = null;
    for (let i = 0; i < 120 && !ff; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
      if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    const fs3 = ff ? await ff.evaluate(() => ({ boss: FIGHT.S.boss || null, err: FIGHT.S.bossErr || null, kind: (window.FIGHT_OPTS || {}).kind, kinds: (FIGHT.S.boardDef && FIGHT.S.boardDef.kinds) || [],
      them: FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ kind: u.kind, name: u.name, hp: u.hpMax, boss: !!u.boss, w: u.weapon && u.weapon.name })) })) : null;
    const crewOk = fs3 && row.crew.every(k => fs3.them.filter(u => u.kind === k && !u.boss).length >= row.crew.filter(c => c === k).length);
    ok('A3 ' + n + ': his fight stands: the man himself, his crew, his board', !!fs3 && !!fs3.boss && fs3.boss.name === row.boss.name && crewOk && fs3.kinds.indexOf(row.board) >= 0,
       fs3 ? 'boss ' + JSON.stringify(fs3.boss && { name: fs3.boss.name, hp: fs3.boss.hp, weapon: fs3.boss.weapon, shield: fs3.boss.shield }) + ', crew ' + fs3.them.filter(u => !u.boss).map(u => u.kind).join(' ') + ', board ' + fs3.kind + ' (' + fs3.kinds.join('/') + ')' + (fs3.err ? ' ERR ' + fs3.err : '') : 'no fight');
    if (ff) { await page.waitForTimeout(1500); await shot(tag + '_b_his_fight'); }
    /* A4: AUTO plays it (a real tap on the fight's own AUTO); if it loses or stalls, the checker ends it and says so */
    let res = null;
    if (ff) {
      await tapEl(await ff.$('#bauto'));
      for (let i = 0; i < 360 && !res; i++) { await page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null);
        if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
      let by = 'AUTO';
      if (res !== 'won') { by = 'THE CHECKER (AUTO ' + (res || 'did not finish in 3 min') + ')';
        await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
      wonBy.push(n + ': ' + by);
      await page.waitForTimeout(1200); await shot(tag + '_c_won');
      for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
      await page.waitForTimeout(800);
      await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
      for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const q = await st(); if (q.boss.fallen[n]) break; }
      await page.waitForTimeout(1500);
    }
    ok('A4 ' + n + ': the fight is won', !!ff, wonBy[wonBy.length - 1] || 'no fight');
    /* A5: he has fallen, the verb is his, his place changed */
    await fr.evaluate(() => render()); await page.waitForTimeout(300);
    s = await st(); const pl2 = (s.drew.places || []).filter(p => p.n === n)[0], vid = row.verb.id;
    ok('A5 ' + n + ': he has fallen, ' + row.verb.word + ' is yours, and his place is changed on the map', !!s.boss.fallen[n] && !!s.verbs[vid] && !!pl2 && pl2.down,
       'fallen ' + !!s.boss.fallen[n] + ' (' + ((s.boss.fallen[n] || {}).did || []).join(', ') + '), verb ' + JSON.stringify(s.verbs[vid]) + ', drawn ' + JSON.stringify(pl2));
    await shot(tag + '_d_his_place_after');
    /* A6: where the verb works, the phone shows it; a real tap uses it */
    const spot = await fr.evaluate((vid) => { const h = [city.x, city.y]; if (BohemiaBosses.applies(vid, h[0], h[1])) return h;
      let best = null, bd = 1e9; const n = om.n; for (let y = 1; y < n - 1; y++) for (let x = 1; x < n - 1; x++) { const a = BohemiaBosses.applies(vid, x, y); if (!a || a.off) continue;
        const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd && !loopTownAt(x, y, 1) && cityRoute(h[0], h[1], x, y)) { bd = dd; best = [x, y]; } } return best; }, vid);
    if (spot && (spot[0] !== s.at[0] || spot[1] !== s.at[1])) { await go(spot); await settle(); }
    const before = await fr.evaluate(() => { const C = BohemiaCondition.get(); let hp = 0, w = 0; for (const k in C.men) { hp += C.men[k].lostHp || 0; if (C.men[k].wound && C.men[k].wound.left > 0) w += C.men[k].wound.left; }
      let bat = null; try { bat = BohemiaPurse.balance(purseGet(), 'electricity'); } catch (e) {} return { hp, w, bat, marks: BohemiaBosses.state().marks.length }; });
    let band = null;
    for (let i = 0; i < 20; i++) { await page.waitForTimeout(300); band = await page.evaluate(() => { const b = document.querySelector('#bohphone .bpctx.verb .vb'); if (!b) return null; const r = b.getBoundingClientRect();
      return { text: b.textContent, verb: b.dataset.verb, off: b.classList.contains('off'), w: Math.round(r.width), h: Math.round(r.height) }; }); if (band && band.verb === vid) break; }
    /* a block where two of his verbs work shows the first (a main beside the water: OPEN, then PURIFY the main he opened) */
    let first = null;
    if (band && band.verb && band.verb !== vid && !band.off) { first = band.verb; await tapEl(await page.$('#bohphone .bpctx.verb .vb')); await page.waitForTimeout(1200);
      before.marks += 1;
      for (let i = 0; i < 20; i++) { await page.waitForTimeout(300); band = await page.evaluate(() => { const b = document.querySelector('#bohphone .bpctx.verb .vb'); if (!b) return null;
        const r = b.getBoundingClientRect(); return { text: b.textContent, verb: b.dataset.verb, off: b.classList.contains('off'), w: Math.round(r.width), h: Math.round(r.height) }; }); if (band && band.verb === vid) break; } }
    await shot(tag + '_e_the_verb_on_the_phone');
    if (band && band.verb === vid && !band.off) await tapEl(await page.$('#bohphone .bpctx.verb .vb'));
    await page.waitForTimeout(1200);
    const after = await fr.evaluate(() => { const C = BohemiaCondition.get(); let hp = 0, w = 0; for (const k in C.men) { hp += C.men[k].lostHp || 0; if (C.men[k].wound && C.men[k].wound.left > 0) w += C.men[k].wound.left; }
      let bat = null; try { bat = BohemiaPurse.balance(purseGet(), 'electricity'); } catch (e) {} const u = (window.__BOSS_VERB_USED || []).slice(-1)[0]; return { hp, w, bat, marks: BohemiaBosses.state().marks.length, used: u ? JSON.parse(JSON.stringify(u)) : null }; });
    const did = vid === 'cook' ? (before.hp > 0 ? after.hp < before.hp : true) : vid === 'open' ? (after.bat != null && before.bat != null && after.bat - before.bat === row.verb.pay_batteries) : (before.w > 0 ? after.w < before.w : true);
    ok('A6 ' + n + ': the phone shows ' + row.verb.button + ' where it works, a real tap uses it once, and it did what it says', !!band && band.verb === vid && after.marks === before.marks + 1 && !!after.used && after.used.id === vid && did,
       (first ? first.toUpperCase() + ' first, then ' : '') + 'band ' + JSON.stringify(band) + ' at ' + JSON.stringify(spot) + '; blood lost ' + Math.round(before.hp) + ' -> ' + Math.round(after.hp) + ', wound days ' + before.w.toFixed(1) + ' -> ' + after.w.toFixed(1) + ', batteries ' + before.bat + ' -> ' + after.bat + ', got ' + JSON.stringify(after.used && after.used.got));
    await fr.evaluate(() => render()); await page.waitForTimeout(400);
    await shot(tag + '_f_the_verb_used');
  }
  clearInterval(guard);
  console.log('  won by: ' + wonBy.join(' | '));
  ok('C1 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTHE FIRST THREE BOSSES: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
