/* A RETREAT GETS HIM AWAY (RUN SIX, 11/6/26; rule 413 and its amendment, ask line 465: 'if I retreat from an enemy and I retreat
   the battle, I should be able to run away from them on the map... until I kill them in battle they're gonna be crawling up my ass
   as I'm running away on the map, it's so creepy'; 'if I retreat and run away, I should be fully able to get away from a battle').
   MEASURED BEFORE (records/BOHEMIA_RUN6_A_RETREAT_GETS_HIM_AWAY_11_6_26.md): a run for the edge in the middle of a fight came home
   as a LOSS, and the map answers a loss with 'Back to your last save' (the reload); a pull-back at the lineup stepped him two blocks
   off and the hunters kept hunting (meetFallBack put HUNT back on his heels); the fall-back's hold lasted ten of his blocks.
   ON THE DEMO HE PLAYS (phone held up), on the map off any town's ground, twice: a crew hunting him catches him on his own step
   (the real contact), the meet card, ENGAGE (a real tap), then
     the LINEUP: RETREAT on the lineup (a real tap): his men run for the edge before any man of theirs moves
     MID-FIGHT:  the fight started, then RETREAT pressed twice (arm, then go): his men run for the edge
   and for each:
     R1 it comes home as its own outcome, never a loss: no 'back to your last save', the clock never rolled back
     R2 the crew holds the field: it stands where the fight was, never on his heels, no road-away lights
     R3 he walks away for half a game day: no card from them, and his distance from them never shrinks
     R4 he comes back and waits near them (three blocks, not aimed at them) for two game days: no card from them, ever
     R5 they are back at their own business after half a day (off the field, not hunting him)
     R6 his own walk aimed at them is his choice and it ASKS (the meet card), never a fight on its own
   R7 nothing threw on any page.
   node gates/a_retreat_gets_him_away_gate.js */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms, every) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(every || 250); } return null; }
let pass = 0, fail = 0, d = null;
const errs = [];
function ok(name, good, why) { if (good) pass++; else fail++; console.log('  ' + (good ? 'ok  ' : 'FAIL') + ' ' + name + (why ? '  [' + why + ']' : '')); }
/* a block on the map off any town's ground (three blocks clear), the nearest to where he stands */
const OFF_TOWN = () => { const N = om.n; let best = null, bd = 1e9;
  for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) { if (!cityWalkable(x, y)) continue; let near = false;
    for (let a = -4; a <= 4 && !near; a++) for (let b = -4; b <= 4 && !near; b++) if (townGround(x + a, y + b) || townSafeAt(x + a, y + b)) near = true;
    if (near) continue; let open = 0; for (const q of DIRS) if (cityWalkable(x + q[0], y + q[1])) open++; if (open < 4) continue;
    const dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (dd < bd) { bd = dd; best = [x, y]; } }
  if (best) { try { travelStop(); } catch (e) {} city.x = best[0]; city.y = best[1]; try { camHold(); render(); } catch (e) {} } return best; };
/* RE-AIMED 11/7 BY RUN SEVEN (rule 413(h)-(k)): game minutes are read on the map's retreatNow(), the day loop's own minute; day * 1440 +
   the clock's minute jumps a day ahead at 22:00 (a new day starts at 22:00 of the evening before) and the holds are read on the forward clock now */
const NOW = () => retreatNow();

async function oneRetreat(kind) {
  const p = d.page, fr = d.fr, tag = kind === 'lineup' ? 'the lineup' : 'mid-fight';
  console.log('\n' + (kind === 'lineup' ? 'A RETREAT FROM THE LINEUP' : 'A RETREAT IN THE MIDDLE OF THE FIGHT'));
  await fr.evaluate(() => { try { if (LOOP.open) loopClose(); } catch (e) {} try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} try { contactClear(); } catch (e) {} });
  const at = await fr.evaluate('(' + OFF_TOWN + ')()');
  if (!at) { ok(tag + ': a block off any town\'s ground', false, 'none found'); return; }
  /* the crew that hunts him, one block off: caught on his own step (mapContact inside his walk, the meet card first) */
  const h = await fr.evaluate(() => { let c = null; for (const q of DIRS) { const x = city.x + q[0], y = city.y + q[1]; if (cityWalkable(x, y) && !townGround(x, y)) { c = [x, y]; break; } }
    if (!c) return null; HUNT = { id: 'hunt:gate' + Date.now(), ev: { id: 'toll_crew', name: 'the toll crew', seq: 7 }, name: 'The toll crew', arch: 'human', count: 3, at: c, steps: 0, made: performance.now() };
    const id = HUNT.id; window.__GATE_BELL = retreatNow(); window.__GATE_RST = window.__RESTORE_OK | 0; window.__WENT_DOWN = null; window.__FIGHT_CAME_HOME = null;
    meetWalk(() => mapContact()); return { id, at: c.slice(), bell: window.__GATE_BELL }; });
  const eng = await waitFor(() => fr.evaluate(() => { const m = document.getElementById('meetcard'); if (!m || +getComputedStyle(m).opacity < 0.9) return null;
    const x = m.querySelector('[data-meet="go"]'); if (!x) return null; const r = x.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }), 15000);
  if (!h || !eng) { ok(tag + ': the crew caught him and the meet card asked', false, h ? 'no meet card' : 'no block beside him'); return; }
  const fb = await (await fr.frameElement()).boundingBox(); await p.touchscreen.tap(fb.x + eng.x, fb.y + eng.y);
  const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.deploy) ? true : null) ? c : null; }, 60000);
  if (!f) { ok(tag + ': ENGAGE opened the fight at its lineup', false, 'no lineup'); return; }
  await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000);
  await waitFor(() => f.evaluate(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && performance.now() > (FIGHT_UI.openUntil || 0)), 20000); await sleep(600);
  /* RETREAT, a real tap on the fight's own button (the retreat gate's way); if the tap did not take, the button's own handler (said so) */
  let pressed = 'a tap';
  const tapFlee = async () => { const b = await f.evaluate(() => { const e = document.getElementById('bflee'); if (!e || e.disabled) return null; const r = e.getBoundingClientRect(); return r.width > 2 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; });
    if (!b) return false; const ff = await (await f.frameElement()).boundingBox(); await p.touchscreen.tap(ff.x + b.x, ff.y + b.y); return true; };
  const ordered = () => f.evaluate(() => !!(FIGHT.S.retreat || FIGHT.S.withdrew));
  if (kind === 'midfight') {
    await f.evaluate(() => { FIGHT.startFight(); try { hud(); } catch (e) {} });
    await waitFor(() => f.evaluate(() => !FIGHT.S.deploy && FIGHT.S.round >= 1 && !FIGHT.S.over), 15000); await sleep(800);
    await tapFlee(); await sleep(500); await tapFlee(); await sleep(300);   /* arm, then go (the fight asks once) */
    if (!(await ordered())) { pressed = 'the button\'s own handler'; await f.evaluate(() => { const e = document.getElementById('bflee'); e.onclick.call(e); }); await sleep(500); await f.evaluate(() => { const e = document.getElementById('bflee'); if (!FIGHT.S.retreat) e.onclick.call(e); }); }
  } else {
    await tapFlee(); await sleep(400);
    if (!(await ordered())) { pressed = 'the button\'s own handler'; await f.evaluate(() => { const e = document.getElementById('bflee'); e.onclick.call(e); }); }
  }
  const took = await waitFor(ordered, 5000);
  ok(tag + ': RETREAT ordered (' + pressed + ')', !!took, took ? 'his men run for the edge' : 'THE FIGHT NEVER HEARD RETREAT');
  if (!took) return;
  /* his men run for the edge on their own turns (the director plays a retreating man), theirs as the fight's AI does */
  const over = await waitFor(() => f.evaluate(() => FIGHT.S.over), 150000, 500);
  if (!over) { await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'you' && !u.dead && !u.down) { u.fled = true; u.escaped = true; } }); FIGHT.S.over = true; FIGHT.S.result = FIGHT.S.fromLine && !FIGHT.S.retreat ? 'withdrew' : 'lost'; try { showOver(FIGHT.S.result); } catch (e) {} }); }
  const res = await f.evaluate(() => ({ result: FIGHT.S.result, retreat: !!FIGHT.S.retreat, out: FIGHT.S.units.filter(u => u.side === 'you' && u.escaped).length, mine: FIGHT.S.units.filter(u => u.side === 'you').length })).catch(() => null);
  /* home: the end screen's LEAVE if one stands, pressed until it is gone */
  const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
  await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
    if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const b = await lb.boundingBox(); if (b && b.width >= 2) await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await sleep(1200); }
    return (await gone()) || null; }, 90000, 600);
  await waitFor(() => fr.evaluate(() => MODE === 'city' && !(window.MEET && MEET.up)), 15000); await sleep(1500);
  const home = await fr.evaluate(() => ({ came: window.__FIGHT_CAME_HOME || null, down: window.__WENT_DOWN || null, rst: (window.__RESTORE_OK | 0) - (window.__GATE_RST | 0), now: retreatNow(), bell: window.__GATE_BELL, hunt: HUNT ? { id: HUNT.id, at: HUNT.at.slice(), hold: HUNT.hold || null } : null, flee: !!HUNT_FLEE, at: [city.x, city.y] }));
  console.log('  the fight ended ' + JSON.stringify(res) + (over ? '' : ' (FINISHED BY THE GATE after two minutes)') + '; home ' + JSON.stringify(home.came));
  ok(tag + ' R1: it comes home as its own outcome, never a loss, never the reload', !!home.came && !home.came.won && (home.came.retreated || home.came.withdrew) && !home.down && !home.rst && home.now >= home.bell,
    'came home ' + JSON.stringify(home.came) + (home.down ? '; WENT DOWN: BACK TO THE LAST SAVE' : '') + (home.rst ? '; THE SAVE WAS RELOADED' : '') + '; the clock ' + home.bell + ' -> ' + home.now);
  ok(tag + ' R2: the crew holds the field where the fight was, never on his heels, no road away lit', !!home.hunt && home.hunt.id === h.id && !!home.hunt.hold && !home.flee && Math.max(Math.abs(home.hunt.at[0] - h.at[0]), Math.abs(home.hunt.at[1] - h.at[1])) <= 1,
    home.hunt ? 'they are at ' + home.hunt.at + ' (the fight was at ' + h.at + '), holding ' + JSON.stringify(home.hunt.hold) : 'NO CREW ON THE MAP');
  /* R3: away for half a day, his own journey at his speed */
  const away = await fr.evaluate(() => { const N = om.n, C = []; for (let y = 4; y < N - 4; y += 2) for (let x = 4; x < N - 4; x += 2) { const dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (dd >= 14 && dd <= 30 && cityWalkable(x, y) && !loopTownAt(x, y, 2)) C.push([x, y, dd]); }
    C.sort((p, q) => q[2] - p[2]); for (const c of C.slice(0, 60)) { if (travelTo(0, 0, [c[0], c[1]]) && TRAVEL && TRAVEL.path && TRAVEL.path.length >= 12) { travelSpeedSet(4); return c; } try { travelStop(); } catch (e) {} } return null; });
  let shrank = 0, cards = 0, last = null, t0 = await fr.evaluate(NOW), hunts = [];
  for (let i = 0; i < 60; i++) { await sleep(500);
    const s = await fr.evaluate((id) => ({ t: retreatNow(), d: HUNT && HUNT.id === id ? huntDist() : null, meet: !!(window.MEET && MEET.up), trav: !!TRAVEL, hold: !!(HUNT && HUNT.hold) }), h.id);
    if (s.meet) { cards++; await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} }); }
    if (last !== null && s.d !== null && s.d < last) shrank++; if (s.d !== null) last = s.d; hunts.push(s.d);
    if (!s.trav || s.t - t0 >= 720) break; }
  ok(tag + ' R3: walking away, no card from them and his distance from them never shrinks', !!away && cards === 0 && shrank === 0, (away ? 'to ' + away.slice(0, 2) : 'NO JOURNEY') + '; their distance ' + hunts.filter(x => x !== null).slice(0, 12).join(' ') + '; ' + cards + ' cards, ' + shrank + ' closer');
  /* R4 and R5: back near the field (three blocks, a walk not aimed at them), then two game days there, in camp (the world walks an hour a beat) */
  await fr.evaluate((c) => { try { travelStop(); } catch (e) {} let best = null, bd = 1e9; for (let y = c[1] - 4; y <= c[1] + 4; y++) for (let x = c[0] - 4; x <= c[0] + 4; x++) { const dd = Math.max(Math.abs(x - c[0]), Math.abs(y - c[1])); if (dd === 3 && cityWalkable(x, y) && !townGround(x, y)) { best = [x, y]; break; } } if (best) { city.x = best[0]; city.y = best[1]; } }, h.at);
  const camp = await fr.evaluate(() => { try { return !!BohemiaMapCamp.make(); } catch (e) { return false; } });
  const t1 = await fr.evaluate(NOW); let cards2 = 0, broke = null, back = null;
  for (let i = 0; i < 120; i++) { await sleep(500);
    const s = await fr.evaluate((id) => ({ t: retreatNow(), meet: !!(window.MEET && MEET.up), camp: !!(window.CAMP && CAMP.on), why: window.CAMP ? CAMP.why : null, hunt: HUNT ? { id: HUNT.id, hold: !!HUNT.hold, at: HUNT.at.slice() } : null, fought: !!LOOP.fighting || !!window.parent.document.getElementById('fightFrame') }), h.id);
    if (s.meet || s.fought) { cards2++; await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} }); }
    if (back === null && (!s.hunt || s.hunt.id !== h.id || !s.hunt.hold)) back = s.t - home.bell;
    if (!s.camp) { broke = s.why; await fr.evaluate(() => { try { BohemiaMapCamp.make(); } catch (e) {} }); }
    if (s.t - t1 >= 2880) break; }
  const t2 = await fr.evaluate(NOW);
  ok(tag + ' R4: two game days camped three blocks from the field: no card from them, ever', camp && cards2 === 0 && t2 - t1 >= 2880, (camp ? 'camped' : 'NO CAMP') + ' ' + Math.round((t2 - t1) / 60) + ' game hours; ' + cards2 + ' cards' + (broke ? '; the camp broke once (' + broke + ')' : ''));
  ok(tag + ' R5: they go back to their own business after half a day (off the field, never hunting him)', back !== null && back >= 600 && back <= 900, back === null ? 'STILL HOLDING THE FIELD after two days' : 'gone ' + Math.round(back / 60) + ' game hours after the fight');
  await fr.evaluate(() => { try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} });
}

(async () => {
  console.log('\nA RETREAT GETS HIM AWAY (rule 413): the demo, phone_portrait');
  d = await D.open({ profile: 'phone_portrait' });
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await waitFor(() => d.fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED), 60000);
  await oneRetreat('lineup');
  await oneRetreat('midfight');
  /* R6: his own walk aimed at a crew he retreated from asks first (the meet card), never a fight on its own */
  const r6 = await d.fr.evaluate(() => { const b = (MEET_BACK.list || []).filter(x => x.away); if (!b.length) return { none: true };
    const e = b[b.length - 1]; HUNT = null; const msg = /^hunt:/.test(e.key) ? { type: 'BOHEMIA_CITY_ENCOUNTER', label: 'them', why: 'road:toll_crew:caught', at: { gx: e.from[0], gy: e.from[1] }, __hunt: { id: e.key.slice(5), at: e.from.slice() } }
      : { type: 'BOHEMIA_CITY_ENCOUNTER', label: 'them', why: e.key, at: { gx: e.from[0], gy: e.from[1] } };   /* the contact the hold was written for, by its own key */
    let st = null; for (let y = e.from[1] - 4; y <= e.from[1] + 4 && !st; y++) for (let x = e.from[0] - 4; x <= e.from[0] + 4 && !st; x++) if (Math.max(Math.abs(x - e.from[0]), Math.abs(y - e.from[1])) === 3 && cityWalkable(x, y)) st = [x, y];
    if (st) { city.x = st[0]; city.y = st[1]; } const held = meetBackHolds(msg);
    try { travelTo(0, 0, e.from); } catch (x) {} const aimed = meetBackHolds(msg); try { travelStop(); } catch (x) {}
    return { held: !!held, aimed: !!aimed, forever: e.left >= 1e8, entries: b.length }; });
  ok('R6 a retreat\'s hold never runs out on its own; only his own walk aimed at them lifts it (and that asks)', !r6.none && r6.forever && r6.held && !r6.aimed, JSON.stringify(r6));
  ok('R7 nothing threw on any page', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log('\nA RETREAT GETS HIM AWAY: ' + pass + ' passed, ' + fail + ' failed');
  try { await d.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
})().catch(async (e) => { console.error(e); try { await d.close(); } catch (x) {} process.exit(1); });
