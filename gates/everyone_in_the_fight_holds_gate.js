/* EVERYONE IN THE FIGHT HOLDS (RUN SEVEN, 11/7/26; rule 413(h)(i)(j)(k), ask line 476; rule 381).
   PAOLO 11/6, on the live build that carries RUN SIX's 11/6n: 'I retreated from this battle and the enemies are still on my ass. I
   think they're all on my ass, to the point I can't even enter a settlement. This is fucked.' And his clue: 'the enemy number... it's
   this red number, and it's underneath me as I walk, even throughout the whole city, I can't enter any settlements.'
   MEASURED BEFORE (records/BOHEMIA_RUN7_EVERYONE_IN_THE_FIGHT_HOLDS_11_7_26.md): a caravan job's raiders, ENGAGE, RETREAT: RAIDERS · 5
   stood on his own block every step of the walk to the town (distance 0, their red plate under his marker) and the town never opened.
   ON THE DEMO HE PLAYS (node gates/everyone_in_the_fight_holds_gate.js [phone_portrait|computer] [--quick]), for EVERY CONTACT KIND
   (a job's raiders, the thieves after the package, a crew on the patrol road, a beast pack on a hunt (with the job's other pack near),
   a job's crew, the hunters, a roaming party he chased, a street crew), with the hunters also out on the road near the fight when it
   is not their own fight, and for BOTH RETREATS (the lineup's RETREAT, the run for the edge in the middle of the fight; ENGAGE and
   RETREAT are real taps where the glass takes them):
     E1 it comes home as a retreat (never a loss, never the reload)
     E2 then a walk of ten blocks: on every sample, READ WHAT HE SEES: every enemy count drawn on the map this frame (the job's red
        plates, the hunters' figure) and every party with a count on the map: none within a block of him, none drawn within a block of
        his marker; no card; their distance from him never shrinks
     E3 then the walk into the nearest settlement: no card on the way, the town opens on its own arrival (no second tap), nobody closes
   and once each:
     B  THE BEFORE (window.__RETREAT_ALL_OFF, the fix off): the raiders ride on his block and the town stays shut (his bug)
     Q  the quiet half day: a forced road event draws no hunters, a job's next ambush waits, a pack does not pick up his scent, no road
        card; after the half day the road works again
     F  the amendment's FULLY: two game days camped three blocks from where the raiders held the field: no card; they went back to their
        business (gone from the job) after half a day
     S  the save carries it: the tab saved and opened again on the same phone: the raiders still hold, the quiet half day still runs
     C  nothing threw on any page */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms, every) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(every || 250); } return null; }
const argv = process.argv.slice(2), QUICK = argv.includes('--quick'), ONLY = ((argv.filter(a => a.startsWith('--only='))[0] || '').slice(7) || '').split(',').filter(Boolean);
const WANT = (k) => !ONLY.length || ONLY.indexOf(k) >= 0;
const PROF = argv.filter(a => !a.startsWith('--'))[0] || 'phone_portrait';
let pass = 0, fail = 0, d = null;
const errs = [];
function ok(name, good, why) { if (good) pass++; else fail++; console.log('  ' + (good ? 'ok  ' : 'FAIL') + ' ' + name + (why ? '  [' + why + ']' : '')); }

/* ---- in the map's frame ---- */
const RESET = (before) => { try { loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {}
  try { if (MEET && MEET.up) { try { MEET.up.el && MEET.up.el.remove(); } catch (e) {} MEET.up = null; } } catch (e) {}
  LOOP.held = []; LOOP.fighting = null; HUNT = null; HUNT_FLEE = null; PARTY_CHASE = null; PARTY_SEL = null; MEET_BACK.list = []; MEET_BACK.held = 0;
  RETREAT_QUIET.till = 0; window.__RETREAT_ALL_OFF = !!before; window.__RETREAT_HOLD = null; window.__FIGHT_CAME_HOME = null; window.__WENT_DOWN = null;
  window.__TOWN_OPENED_PAST_A_HOLD = null; try { contactClear(); } catch (e) {} if (TRAVEL_SPEED === 0) travelSpeedSet(1); };
/* a block off any town's ground with a town 9 to 22 blocks off by road, the nearest such to where he stands */
const PLACE = () => { const N = om.n, bs = ctBases(); let best = null, bd = 1e9;
  for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) { if (!cityWalkable(x, y)) continue; let nearT = false;
    for (let a = -4; a <= 4 && !nearT; a++) for (let b = -4; b <= 4 && !nearT; b++) if (townGround(x + a, y + b) || townSafeAt(x + a, y + b)) nearT = true;
    if (nearT) continue; let open = 0; for (const q of DIRS) if (cityWalkable(x + q[0], y + q[1])) open++; if (open < 5) continue;
    let tn = null; for (const nm in bs) { const dd = Math.max(Math.abs(bs[nm].x - x), Math.abs(bs[nm].y - y)); if (dd >= 9 && dd <= 22) { tn = nm; break; } } if (!tn) continue;
    const dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)) + (window.__PLACED && window.__PLACED.some(p => Math.max(Math.abs(p[0] - x), Math.abs(p[1] - y)) < 12) ? 40 : 0);
    if (dd < bd) { bd = dd; best = [x, y]; } }
  if (best) { city.x = best[0]; city.y = best[1]; try { CITY_GLIDE.tx = null; } catch (e) {} try { fogClear(city.x, city.y, 8); } catch (e) {} try { camHold(); render(); } catch (e) {}
    window.__PLACED = (window.__PLACED || []).concat([best]); } return best; };
const NEAREST_TOWN = (x0, y0) => { const bs = ctBases(); let best = null, bl = 1e9;
  for (const nm in bs) { const b = bs[nm]; if (Math.max(Math.abs(b.x - x0), Math.abs(b.y - y0)) > 40) continue; let r = null;
    try { r = BohemiaJobKinds.walkRoute(x0, y0, { town: { name: nm, x: b.x | 0, y: b.y | 0 } }); } catch (e) {}
    if (r && r.path && r.path.length >= 5 && r.path.length < bl) { bl = r.path.length; best = { name: nm, x: b.x | 0, y: b.y | 0, blocks: r.path.length - 1 }; } } return best; };
/* WHAT HE SEES, this frame: every enemy with a count on the map (its block), and every enemy count drawn (where it is drawn) */
const SEEN = (process_dbg) => { const you = (window.MAP_DREW && MAP_DREW.you) ? { x: MAP_DREW.you.x, y: MAP_DREW.you.y } : null, at = [city.x, city.y], cheb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
  const cells = [];
  (LOOP.held || []).forEach(j => { ['raid', 'thief', 'band'].forEach(w => { if (j[w]) cells.push({ w: w + ' ' + j[w].n, c: [j[w].x, j[w].y], held: !!j[w].held }); });
    if (j.holders) cells.push({ w: 'holders ' + j.holders.n, c: [j.holders.x, j.holders.y], held: true });
    (j.packs || []).forEach(p => cells.push({ w: 'pack' + p.id + ' ' + p.n, c: [p.x, p.y], held: !!p.held || p.shy > 1e6 })); });
  if (HUNT) cells.push({ w: 'hunt ' + HUNT.count, c: HUNT.at.slice(), held: !!HUNT.hold });
  cells.forEach(e => { e.d = cheb(e.c, at); });
  const drawn = [], tw = (typeof TW !== 'undefined' ? TW : 16), th = (typeof TH !== 'undefined' ? TH : 8);
  try { (BohemiaJobKinds.plates() || []).forEach(q => { if (!/\d/.test(String(q.t)) && !/HOLD/.test(String(q.t))) return; if (!/^#ff8f7a$|^#f2d7a0$/i.test(String(q.col))) return;
    if (/\/\d|CARTS?|CRATES?/.test(String(q.t)) && !/HUNT/.test(String(q.t))) return;   /* the cargo's own count rides with him on purpose */
    drawn.push({ t: q.t, dx: you ? Math.round(q.sx - you.x) : null, dy: you ? Math.round(q.cy - you.y) : null,
      /* his clue, read as drawn: an enemy's count laid out UNDER HIS FEET (below him, across his crew) while they stand elsewhere */
      under: !!(you && q.foe && q.ly >= you.y - 2 && Math.abs(q.lx + q.w / 2 + 3 - you.x) <= 44 && q.cy < you.y - 4) }); }); } catch (e) {}
  try { if (HUNT && HUNT.box && you) drawn.push({ t: 'HUNTERS ' + HUNT.count, dx: Math.round(HUNT.box.x + HUNT.box.w / 2 - you.x), dy: Math.round(HUNT.box.y + HUNT.box.h - 6 - you.y),   /* their feet (the box runs 6 px past them) */ dbg: process_dbg ? { box: HUNT.box, you: MAP_DREW.you, hat: HUNT.at, at: [city.x, city.y], tw: TW, th: TH, cnt: MAP_DREW.youCount, street: (typeof STREET !== 'undefined') ? { on: STREET.on, M: STREET.M, F: STREET.F, W: STREET.W, mult: STREET.mult, to: (() => { try { return streetTo(HUNT.at[0], HUNT.at[1]); } catch (e) { return null; } })() } : null } : undefined }); } catch (e) {}
  /* where it is drawn, in blocks from his marker (the map's own 45 degrees turned back: a block is TW/2 across and TH/2 down each way) */
  drawn.forEach(q => { if (q.dx === null) { q.on = false; return; } const u = q.dx / (tw / 2), v = q.dy / (th / 2); q.blocks = Math.round(Math.max(Math.abs((u + v) / 2), Math.abs((v - u) / 2)) * 10) / 10; q.on = q.blocks < 0.5 || !!q.under; });   /* drawn ON him (his own block, or laid under his feet); within a block is read on the blocks themselves (cells) */
  return { at, you: !!you, cells, drawn, easing: (typeof FZOOMING !== 'undefined' && !!FZOOMING), card: !!(MEET && MEET.up), road: !!(window.BohemiaRoadEvents && BohemiaRoadEvents.up && BohemiaRoadEvents.up()), trav: !!TRAVEL,
    open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), openName: LOOP.open && LOOP.open.name, fight: !!LOOP.fighting || !!document.querySelector('#meetcard'), tw, th }; };

/* ---- the contact, the game's own way, one kind each ---- */
const SETUP = (kind) => {
  const bs = ctBases(); let T = null, td = 1e9; for (const nm in bs) { const b = bs[nm], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd < td) { td = dd; T = { name: nm, x: b.x | 0, y: b.y | 0 }; } }
  const take = (id, title, sk) => { LOOP.open = T; const r = loopTakeContract({ id, title, pay: 40, skulls: sk || 2 }); LOOP.open = null; try { loopClose(); } catch (e) {} return r ? LOOP.held[LOOP.held.length - 1] : null; };
  const ring = (r, avoid) => { const C = []; for (let y = city.y - r; y <= city.y + r; y++) for (let x = city.x - r; x <= city.x + r; x++) if (Math.max(Math.abs(x - city.x), Math.abs(y - city.y)) === r && cityWalkable(x, y) && !townGround(x, y) && !(avoid && Math.max(Math.abs(x - avoid[0]), Math.abs(y - avoid[1])) < 4)) C.push([x, y]); return C; };
  let j = null;
  if (kind === 'raiders') { j = take('qd-s03', 'Haul the crates'); if (!j || j.plays !== 'haul-caravan') return { err: 'no caravan job ' + (j && j.plays) }; j.ambush = [2]; j.walked = 0; }
  else if (kind === 'thieves') { j = take('qd-ar08', 'Carry the package'); if (!j || j.plays !== 'carry') return { err: 'no carry job ' + (j && j.plays) }; j.twist = 'stolen'; j.thiefAt = 2; j.walked = 0; }
  else if (kind === 'road crew') { j = take('jk-patrol-dam', 'Walk the patrol'); if (!j || j.plays !== 'patrol') return { err: 'no patrol job ' + (j && j.plays) }; j.bandDue = 2; j.walked = 0; }
  else if (kind === 'beasts') { j = take('qd-ar03', 'Hunt them'); if (!j || j.plays !== 'hunt-kind' || !j.packs.length) return { err: 'no hunt job ' + (j && j.plays) };
    const a = ring(4)[0], b = ring(6, a).slice(-1)[0]; if (!a) return { err: 'no ground for the pack' }; j.packs[0].x = a[0]; j.packs[0].y = a[1];
    if (j.packs[1] && b) { j.packs[1].x = b[0]; j.packs[1].y = b[1]; } for (let i = 2; i < j.packs.length; i++) { j.packs[i].x = j.packs[0].home[0]; j.packs[i].y = j.packs[0].home[1]; }
    }
  else if (kind === 'job crew') { j = take('ct-road-crew', 'The road crew'); if (!j) return { err: 'no crew job' }; const a = ring(5)[0]; if (!a) return { err: 'no ground' }; j.target = { x: a[0], y: a[1] }; }
  else if (kind === 'hunters') { HUNT_T0 = 1; HUNT = null; const got = huntSpawn({ id: 'toll_crew', seq: 9 }); if (!HUNT) return { err: 'no hunters spawned (' + got + ')' }; }
  else if (kind === 'party') { const ps = (partiesAll() || []).filter(q => !q.arrived && cityWalkable(q.at.x | 0, q.at.y | 0)).sort((a, b) => Math.max(Math.abs((a.at.x | 0) - city.x), Math.abs((a.at.y | 0) - city.y)) - Math.max(Math.abs((b.at.x | 0) - city.x), Math.abs((b.at.y | 0) - city.y)));
    let p = null, st = null;
    for (const q of ps) { for (const dd of DIRS) { const x = (q.at.x | 0) + dd[0] * 3, y = (q.at.y | 0) + dd[1] * 3; if (cityWalkable(x, y) && !townGround(x, y) && cityRoute(x, y, q.at.x | 0, q.at.y | 0)) { st = [x, y]; break; } } if (st) { p = q; break; } }
    if (!p) return { err: 'no roaming party he can reach' }; city.x = st[0]; city.y = st[1]; try { CITY_GLIDE.tx = null; camHold(); } catch (e) {} try { delete PARTY_FOUGHT[p.id]; } catch (e) {} window.__SU_PARTY = p.id; }
  return { ok: true, town: T.name, job: j ? { id: j.id, plays: j.plays } : null };
};

async function tapIn(frame, sel) { const b = await frame.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 2 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }, sel); if (!b) return false;
  const fb = await (await frame.frameElement()).boundingBox(); await press(fb.x + b.x, fb.y + b.y); return true; }
/* a finger on the phone, the mouse on the computer (a computer has no touch) */
async function press(x, y) { if (PROF === 'computer') await d.page.mouse.click(x, y); else await d.page.touchscreen.tap(x, y); }

/* one contact, one retreat, the walk away, the walk into the town */
async function leg(kind, how, opts) {
  opts = opts || {};
  const p = d.page, fr = d.fr, tag = kind + ' / ' + (how === 'lineup' ? 'the lineup' : 'mid-fight') + (opts.before ? ' / THE BEFORE' : '');
  console.log('\n' + tag.toUpperCase());
  await fr.evaluate('(' + RESET + ')(' + !!opts.before + ')');
  const at = await fr.evaluate('(' + PLACE + ')()');
  if (!at) { ok(tag + ': a place to stand', false, 'none'); return null; }
  const su = await fr.evaluate('(function(){ window.__SU = (' + SETUP + ')(' + JSON.stringify(kind) + '); return window.__SU; })()');
  if (!su || su.err) { ok(tag + ': the contact is set up the game\'s own way', false, su ? su.err : 'nothing'); return null; }
  /* his walk: the job's own walk, a walk at them, his chase; the street crew comes on his next step through the street's own door */
  await fr.evaluate((k) => {
    const s = window.__SU; const j = s.job ? LOOP.held.filter(x => x.id === s.job.id)[0] : null;
    if (k === 'raiders' || k === 'thieves') BohemiaJobKinds.walkGo([j.target.x, j.target.y], j.dest && !j.dest.made ? j.dest.name : null);
    else if (k === 'road crew') BohemiaJobKinds.walkGo([j.target.x, j.target.y]);
    else if (k === 'beasts') travelTo(0, 0, [j.packs[0].x, j.packs[0].y]);
    else if (k === 'job crew') travelTo(0, 0, [j.target.x, j.target.y]);
    else if (k === 'hunters') { const t = HUNT.at.slice(); travelTo(0, 0, [t[0], t[1]]) || travelTo(0, 0, [t[0] + 1, t[1]]); }
    else if (k === 'party') { const pp = partyById(window.__SU_PARTY); if (pp) { partyTap({ id: pp.id, p: pp }); partyTap({ id: pp.id, p: pp }); } }   /* his look, then his chase (two taps) */
    else if (k === 'street crew') { meetWalk(() => cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'out on the block', faction: null, draft: true, roster: [{ arch: 'human' }, { arch: 'human' }, { arch: 'bot' }], street: true, why: 'crew', at: { gx: city.x, gy: city.y } })); }
    if (TRAVEL_SPEED === 0) travelSpeedSet(1); }, kind);
  const card = await waitFor(() => fr.evaluate(() => { const m = document.getElementById('meetcard'); if (!m || +getComputedStyle(m).opacity < 0.9 || !(MEET && MEET.up)) return null; return { why: String(MEET.up.msg && MEET.up.msg.why), at: [city.x, city.y] }; }), 45000);
  if (!card) { const st = await fr.evaluate(() => ({ at: [city.x, city.y], trav: !!TRAVEL, hunt: HUNT && HUNT.at, held: LOOP.held.map(j => ({ p: j.plays, raid: j.raid, thief: j.thief, band: j.band, w: j.walked })) })); ok(tag + ': the contact reached him (the meet card)', false, JSON.stringify(st).slice(0, 300)); return null; }
  /* the hunters out on the road near the fight too, when it is not their fight (rule 413(h): every party in or near it) */
  const near = await fr.evaluate(() => { if (HUNT) return { id: HUNT.id, at: HUNT.at.slice(), own: true };
    /* four or five blocks from him, on the far side of the fight (out on the road beyond it, not on his way out) */
    const m = MEET && MEET.up && MEET.up.msg, k = (m && m.at && m.at.gx != null) ? [m.at.gx, m.at.gy] : [city.x, city.y], cb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
    let c = null, cs = -1e9; for (let y = city.y - 5; y <= city.y + 5; y++) for (let x = city.x - 5; x <= city.x + 5; x++) { const dh = cb([x, y], [city.x, city.y]); if (dh < 4 || !cityWalkable(x, y) || townGround(x, y)) continue;
      const sc = dh - cb([x, y], k) * 2 + (cb([x, y], k) >= 2 ? 0 : -50); if (sc > cs) { cs = sc; c = [x, y]; } }
    if (!c) return null; HUNT = { id: 'hunt:near' + Date.now(), ev: { id: 'toll_crew', name: 'the toll crew', seq: 3 }, name: 'THE TOLL CREW', arch: 'human', count: 4, at: c, steps: 0, made: performance.now() };
    return { id: HUNT.id, at: c.slice(), own: false }; });
  /* ENGAGE: a real tap on the card */
  await sleep(300);
  if (!(await tapIn(fr, '#meetcard [data-meet="go"]'))) await fr.evaluate(() => { try { MEET_DONE(true); } catch (e) {} });
  const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.deploy) ? true : null) ? c : null; }, 60000);
  if (!f) { ok(tag + ': ENGAGE opened the fight at its lineup', false, 'no lineup; card ' + card.why); return null; }
  await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000);
  await waitFor(() => f.evaluate(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && performance.now() > (FIGHT_UI.openUntil || 0)), 20000); await sleep(500);
  let pressed = 'a tap';
  const flee = async () => { if (await tapIn(f, '#bflee')) return; };
  const ordered = () => f.evaluate(() => !!(FIGHT.S.retreat || FIGHT.S.withdrew));
  if (how === 'midfight') {
    await f.evaluate(() => { try { handSpeed(4, true); } catch (e) {} FIGHT.startFight(); try { hud(); } catch (e) {} });
    await waitFor(() => f.evaluate(() => !FIGHT.S.deploy && FIGHT.S.round >= 1 && !FIGHT.S.over), 15000); await sleep(600);
  }
  /* the press: a real tap (twice mid-fight: arm, then go); if the glass did not take it in that beat, the button's own handler, and again (the
     fight can be between turns for a beat) */
  for (let k = 0; k < 6 && !(await ordered()) && !(await f.evaluate(() => FIGHT.S.over)); k++) {
    if (k < 2) { await flee(); await sleep(450); if (how === 'midfight') { await flee(); await sleep(300); } }
    else { pressed = 'the button\'s own handler'; await f.evaluate(() => { const e = document.getElementById('bflee'); if (e && !FIGHT.S.retreat) e.onclick.call(e); }); await sleep(450);
      if (how === 'midfight') await f.evaluate(() => { const e = document.getElementById('bflee'); if (e && !FIGHT.S.retreat) e.onclick.call(e); }); await sleep(300); }
  }
  const took = await waitFor(ordered, 5000);
  if (!took) { ok(tag + ': RETREAT ordered', false, 'THE FIGHT NEVER HEARD RETREAT'); return null; }
  const over = await waitFor(() => f.evaluate(() => FIGHT.S.over), 120000, 500);
  if (!over) await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'you' && !u.dead && !u.down) { u.fled = true; u.escaped = true; } }); FIGHT.S.over = true; FIGHT.S.result = FIGHT.S.fromLine && !FIGHT.S.retreat ? 'withdrew' : 'lost'; try { showOver(FIGHT.S.result); } catch (e) {} });
  const fres = await f.evaluate(() => ({ result: FIGHT.S.result, retreat: !!FIGHT.S.retreat, withdrew: !!FIGHT.S.withdrew, fromLine: !!FIGHT.S.fromLine, round: FIGHT.S.round, theirs: FIGHT.S.units.filter(u => u.side !== 'you').map(u => (u.dead ? 'd' : u.down ? 'v' : u.fled ? 'f' : 'a')).join(''), mine: FIGHT.S.units.filter(u => u.side === 'you').map(u => (u.escaped ? 'e' : u.dead ? 'd' : u.down ? 'v' : 'a')).join('') })).catch(() => null);
  if (process.env.DBG) console.log('  the fight ended ' + JSON.stringify(fres));
  const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
  await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
    if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const b = await lb.boundingBox(); if (b && b.width >= 2) await press(b.x + b.width / 2, b.y + b.height / 2); await sleep(1100); }
    return (await gone()) || null; }, 90000, 600);
  await waitFor(() => fr.evaluate(() => MODE === 'city' && !(MEET && MEET.up)), 15000); await sleep(1200);
  const home = await fr.evaluate(() => ({ came: window.__FIGHT_CAME_HOME, down: window.__WENT_DOWN, hold: window.__RETREAT_HOLD, at: [city.x, city.y] }));
  if (home.came && home.came.won && !opts.again) { console.log('  (the fight ended before the retreat took: ' + JSON.stringify(fres) + '; that is a win, not a retreat: once more)'); return leg(kind, how, Object.assign({}, opts, { again: true })); }
  ok(tag + ' E1: it comes home as a retreat, never a loss, never the reload (' + pressed + ')', !!home.came && !home.came.won && (home.came.retreated || home.came.withdrew) && !home.down,
     'card ' + card.why + '; the fight ' + JSON.stringify(fres) + '; home ' + JSON.stringify(home.came) + (opts.before ? '' : '; held ' + JSON.stringify(home.hold && { bands: home.hold.bands, packs: home.hold.packs, hunt: home.hold.hunt })) + (near ? '; the hunters near: ' + near.at : ''));
  /* E2: ten blocks away, reading what he sees */
  /* the camera comes back in from the fight first (its ease draws the valley at a growing scale); he walks off once it has landed */
  await waitFor(() => fr.evaluate(() => !(typeof FZOOMING !== 'undefined' && FZOOMING)), 8000, 200);
  /* away from all of them: the block 11 to 14 out whose road keeps farthest from every one of them (a walk past them is not 'away') */
  const away = await fr.evaluate(() => { const N = om.n, C = [], E = [];
    (LOOP.held || []).forEach(j => { ['raid', 'thief', 'band', 'holders'].forEach(w => { if (j[w]) E.push([j[w].x, j[w].y]); }); (j.packs || []).forEach(p => E.push([p.x, p.y])); if (j.target && !j.plays) E.push([j.target.x, j.target.y]); });
    if (HUNT) E.push(HUNT.at.slice()); (LOOP.held || []).forEach(j => { if (j.plays === 'clear-crew' && j.target) E.push([j.target.x, j.target.y]); });
    const md = (x, y) => E.reduce((m, e) => Math.min(m, Math.max(Math.abs(e[0] - x), Math.abs(e[1] - y))), 99);
    for (let y = 4; y < N - 4; y++) for (let x = 4; x < N - 4; x++) { const dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (dd >= 10 && dd <= 16 && cityWalkable(x, y) && !loopTownAt(x, y, 2)) C.push([x, y, md(x, y)]); }
    C.sort((a, b) => b[2] - a[2]);
    let best = null, bs = -1;
    for (const c of C.slice(0, 400)) { const r = cityRoute(city.x, city.y, c[0], c[1]); if (!r || r.length < 11) continue;
      let worst = 99, ok = true; for (let i = 1; i < r.length; i++) { const m = md(r[i][0], r[i][1]), m0 = md(r[i - 1][0], r[i - 1][1]); worst = Math.min(worst, m); if (m < m0) ok = false; }
      const sc = Math.min(worst, 4) * 1000 + (ok ? 100 : 0) + c[2]; if (sc > bs) { bs = sc; best = { c, monotone: ok, worst }; } if (ok && worst >= 3) break; }   /* never near any of them first, then straight away */
    if (!best) return null;
    if (travelTo(0, 0, [best.c[0], best.c[1]]) && TRAVEL) { travelSpeedSet(1); window.__AWAY0 = [city.x, city.y]; return { to: best.c.slice(0, 2), monotone: best.monotone, nearest: best.worst }; } return null; });
  let worst = null, onHim = 0, drawnOn = 0, cards = 0, closer = 0, samples = 0; const lastD = {}, lastC = {}, closing = []; let walked = 0, stuck = 0, easing = 0;
  for (let i = 0; i < 80; i++) { await sleep(260);
    const s = await fr.evaluate('(' + SEEN + ')(' + !!process.env.DBG + ')'); samples++; if (process.env.DBG && s.drawn.some(q => q.on)) { console.log('DRAWN ON HIM ' + JSON.stringify(s.drawn.filter(q => q.on))); await d.page.screenshot({ path: process.env.DBG + '/on_' + kind.replace(/ /g, '_') + '_' + how + '_' + samples + '.png' }).catch(() => {}); }
    if (s.card || s.road) { cards++; await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} try { BohemiaRoadEvents.close(false); } catch (e) {} }); }
    s.cells.forEach(e => { if (e.d <= 1) { onHim++; if (!worst || e.d < worst.d) worst = Object.assign({ at: s.at }, e); }
      const pc = lastC[e.w]; if (pc && (pc[0] !== e.c[0] || pc[1] !== e.c[1]) && e.d < Math.max(Math.abs(pc[0] - s.at[0]), Math.abs(pc[1] - s.at[1])) && (e.held || opts.before)) { closer++; closing.push(e.w); }   /* they stepped, and the step was toward him (one in or near the fight: held; any other is read by its block, never within one of him) */
      lastD[e.w] = e.d; lastC[e.w] = e.c.slice(); });
    if (s.easing) easing++; else s.drawn.forEach(q => { if (q.on) { drawnOn++; if (!worst) worst = Object.assign({ at: s.at, drawn: true }, q); } });   /* a frame of the camera's ease is not where anything stands */
    walked = await fr.evaluate(() => Math.max(Math.abs(city.x - window.__AWAY0[0]), Math.abs(city.y - window.__AWAY0[1])));
    if (!s.trav) { stuck++; if (stuck > 3) break; } else stuck = 0;
    if (walked >= 10) break; }
  const name2 = tag + ' E2: ten blocks walking away, nobody with a count within a block of him, none drawn on him, no card, nobody closing';
  if (opts.before) { const band = Object.keys(lastD).filter(k => /^raid/.test(k))[0];
    ok('B ' + tag + ': THE BEFORE reproduces his bug: the raiders keep coming, step for step', closer >= 4 && band && lastD[band] <= 3, 'they stepped toward him ' + closer + ' times in 10 blocks, ' + (band ? lastD[band] : '?') + ' blocks behind at the end; on his block or beside it ' + onHim + ' looks, drawn on his marker ' + drawnOn + (worst ? '; e.g. ' + JSON.stringify(worst) : ''));
    /* where that ends (a turn in the road lets them gain a block, every time): ON HIS HEELS. The walk into the town starts from there */
    await fr.evaluate(() => { try { travelStop(); } catch (e) {} const j = LOOP.held[LOOP.held.length - 1]; if (!j || !j.raid) return; let c = null; for (const q of DIRS) { const x = city.x + q[0], y = city.y + q[1]; if (cityWalkable(x, y)) { c = [x, y]; break; } } if (c) { j.raid.x = c[0]; j.raid.y = c[1]; } }); }
  else ok(name2, !!away && walked >= 10 && onHim === 0 && drawnOn === 0 && cards === 0 && closer === 0, (away ? walked + ' blocks walked to ' + away.to + (away.monotone ? '' : ' (no road leads straight away from all of them)') : 'NO WALK') + ', ' + samples + ' looks; on him ' + onHim + ', drawn on him ' + drawnOn + ', cards ' + cards + (easing ? ', ' + easing + ' looks in the camera\'s ease not read' : '') + ', closer ' + closer + (closing.length ? ' (' + closing.slice(0, 4).join(', ') + ')' : '') + '; ' + JSON.stringify(lastD) + (worst ? '; WORST ' + JSON.stringify(worst) : ''));
  /* E3: the walk into the nearest settlement: no card, the town opens on its own arrival */
  const tw = await fr.evaluate('(function(){ try { travelStop(); } catch (e) {} var t = (' + NEAREST_TOWN + ')(city.x, city.y); if (t) BohemiaJobKinds.walkGo([t.x, t.y], t.name); return t; })()');
  let res = null, cards3 = 0, closest = 99, idle = 0;
  for (let i = 0; i < 160 && !res; i++) { await sleep(250);
    const s = await fr.evaluate('(' + SEEN + ')()');
    if (s.card || s.road) { cards3++; res = { card: true, at: s.at }; break; }
    s.cells.forEach(e => { if (!e.held || true) closest = Math.min(closest, e.d); });
    if (s.open) { res = s; break; }
    if (!s.trav) { idle++; if (idle > 8) res = s; } else idle = 0; }
  await sleep(300);
  const fin = await fr.evaluate(() => ({ open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), name: LOOP.open && LOOP.open.name, at: [city.x, city.y], past: window.__TOWN_OPENED_PAST_A_HOLD }));
  if (opts.before) ok('B ' + tag + ': THE BEFORE: the town stays shut', !fin.open, (tw ? tw.name + ', ' + tw.blocks + ' blocks' : 'NO TOWN') + '; ' + JSON.stringify(fin));
  else ok(tag + ' E3: the walk into the nearest settlement: no card, the town opens on its own arrival, nobody on him', !!tw && fin.open && String(fin.name || '').toUpperCase() === String(tw.name).toUpperCase() && cards3 === 0 && closest > 1,
     (tw ? tw.name + ', ' + tw.blocks + ' blocks' : 'NO TOWN') + '; ' + JSON.stringify(fin) + '; cards ' + cards3 + '; the nearest enemy came to ' + closest + ' blocks');
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
  return { kind, how, home, card };
}

(async () => {
  console.log('\nEVERYONE IN THE FIGHT HOLDS (rule 413(h)-(k)): the demo, ' + PROF);
  d = await D.open({ profile: PROF, arm: "try { localStorage.setItem('bohemia.fight.speed', '4'); } catch (e) {}" });
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await waitFor(() => d.fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaJobKinds && BohemiaJobKinds.ready()), 60000);
  await sleep(1500);
  const KINDS = QUICK ? ['raiders', 'beasts', 'hunters'] : ['raiders', 'thieves', 'road crew', 'beasts', 'job crew', 'hunters', 'party', 'street crew'];
  if (WANT('before')) await leg('raiders', 'lineup', { before: true });
  for (const k of KINDS) { if (WANT(k) || WANT(k + ':lineup')) await leg(k, 'lineup'); if (WANT(k) || WANT(k + ':midfight')) await leg(k, 'midfight'); }

  /* Q: the quiet half day (rule 413(i)): a retreat, then the road and the jobs draw nothing new to him for half a day */
  const fr = d.fr;
  if (WANT('Q')) {
  const q = await fr.evaluate('(function(){ (' + RESET + ')(false); (' + PLACE + ')(); var j = (' + SETUP + ')("raiders"); return j; })()');
  const qq = await fr.evaluate(() => { const j = LOOP.held[LOOP.held.length - 1]; meetFallBack({ type: 'BOHEMIA_CITY_ENCOUNTER', why: 'road:toll_crew', at: { gx: city.x, gy: city.y } });
    const out = { quiet: retreatQuiet() }; HUNT = null; HUNT_T0 = 1;
    const sp = huntSpawn({ id: 'toll_crew', seq: 4 }); out.hunters = !!HUNT;
    j.ambush = [0]; j.walked = 5; out.ambush = !!(BohemiaJobKinds.step() || j.raid);
    window.__ROADEV_ON = true; window.__ROADEV_CHANCE = 1; let roadCard = false; try { for (let i = 0; i < 30; i++) { if (BohemiaRoadEvents.step()) { roadCard = true; break; } } } catch (e) {} out.road = roadCard;
    window.__ROADEV_ON = false; window.__ROADEV_CHANCE = null; try { BohemiaRoadEvents.close(false); } catch (e) {}
    j.ambush = []; j.walked = 0; window.__QJ = j.id;
    out.camp = (() => { try { return !!BohemiaMapCamp.make(); } catch (e) { return false; } })();   /* the half day passes the player's way: camp */
    return out; });
  /* camp until the half day is spent (an hour a beat), then the road works again: the control, the quiet is the only thing that kept it */
  await waitFor(() => fr.evaluate(() => { try { if (MEET && MEET.up) MEET_DONE(false); } catch (e) {} if (!(window.CAMP && CAMP.on)) { try { BohemiaMapCamp.make(); } catch (e) {} } return !retreatQuiet(); }), 60000, 400);
  Object.assign(qq, await fr.evaluate(() => { try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} const out = { after: !retreatQuiet() };
    HUNT = null; HUNT_T0 = 1; huntSpawn({ id: 'toll_crew', seq: 5 }); out.huntersAfter = !!HUNT; HUNT = null;
    const j = LOOP.held.filter(x => x.id === window.__QJ)[0]; if (j) { j.raid = null; j.ambush = [0]; j.walked = 5; BohemiaJobKinds.step(); } out.ambushAfter = !!(j && j.raid); return out; }));
  ok('Q the quiet half day: no hunters drawn, a job\'s next ambush waits, no road card; after it the road works again', qq.quiet && !qq.hunters && !qq.ambush && !qq.road && qq.after && qq.huntersAfter && qq.ambushAfter, JSON.stringify(qq));
  }
  if (WANT('F')) {
  /* F: FULLY (the amendment): two game days camped three blocks from where the raiders held the field: never a card; they leave the job after half a day */
  const fl = await fr.evaluate('(function(){ (' + RESET + ')(false); (' + PLACE + ')(); return (' + SETUP + ')("raiders"); })()');
  const f0 = await fr.evaluate(() => { const j = LOOP.held[LOOP.held.length - 1]; let c = null; for (const q of DIRS) { const x = city.x + q[0], y = city.y + q[1]; if (cityWalkable(x, y) && !townGround(x, y)) { c = [x, y]; break; } }
    j.__gate = 'F'; j.ambush = []; j.raid = { x: c[0], y: c[1], n: 6 }; LOOP.fighting = j.id; j.fight = { what: 'raid', n: 6, pack: null }; window.__BAND_WENT = [];   /* no second ambush pending: a new crew on the job later is not the one he ran from */
    meetFallBack({ type: 'BOHEMIA_CITY_ENCOUNTER', why: 'contract:' + j.id + ':raid', at: { gx: c[0], gy: c[1] } });
    let st = null; for (let y = c[1] - 4; y <= c[1] + 4 && !st; y++) for (let x = c[0] - 4; x <= c[0] + 4 && !st; x++) if (Math.max(Math.abs(x - c[0]), Math.abs(y - c[1])) === 3 && cityWalkable(x, y) && !townGround(x, y)) st = [x, y];
    if (st) { city.x = st[0]; city.y = st[1]; } const made = (() => { try { return !!BohemiaMapCamp.make(); } catch (e) { return false; } })(); return { raid: c, at: st, camp: made, t0: retreatNow(), id: j.id }; });
  let fcards = 0, wentAt = null; const fwhy = [];
  for (let i = 0; i < 140; i++) { await sleep(450);
    if (process.env.DBG) console.log(JSON.stringify(await fr.evaluate((id) => { const j = LOOP.held.filter(x => x.id === id)[0]; return { t: retreatNow(), now: retreatNow(), mark: j && j.__gate, n: LOOP.held.length, ids: LOOP.held.map(x => x.id + ':' + (x.__gate || '-')), went: (window.__BAND_WENT || []).length, raid: j && j.raid, stage: j && j.stage, camp: !!(window.CAMP && CAMP.on), why: window.CAMP && CAMP.why, posted: CITY_CONTACT_POSTED, fighting: LOOP.fighting }; }, f0.id)));
    const s = await fr.evaluate((id) => { const j = LOOP.held.filter(x => x.id === id)[0]; return { t: retreatNow(), card: !!(MEET && MEET.up) || !!LOOP.fighting || !!window.parent.document.getElementById('fightFrame'), raid: j ? j.raid : 'nojob', camp: !!(window.CAMP && CAMP.on) }; }, f0.id);
    if (s.card) { fcards++; const why = await fr.evaluate(() => { const w = (MEET && MEET.up && MEET.up.msg) ? String(MEET.up.msg.why) : (LOOP.fighting ? 'fighting ' + LOOP.fighting : 'frame'); try { MEET_DONE(false); } catch (e) {} return w; }); if (fwhy.indexOf(why) < 0) fwhy.push(why); }
    if (wentAt === null) { const bw = await fr.evaluate(() => (window.__BAND_WENT || []).slice(-1)[0] || null); if (bw) wentAt = bw.t - f0.t0; }
    if (!s.camp) await fr.evaluate(() => { try { BohemiaMapCamp.make(); } catch (e) {} });
    if (s.t - f0.t0 >= 2880) break; }
  const f1 = await fr.evaluate(() => retreatNow());
  ok('F FULLY: two game days camped three blocks from the raiders\' field: never a card; they went back to their business after half a day', f0.camp && f1 - f0.t0 >= 2880 && fcards === 0 && wentAt !== null && wentAt >= 700 && wentAt <= 900,
     Math.round((f1 - f0.t0) / 60) + ' game hours; ' + fcards + ' cards; the raiders left the job ' + (wentAt === null ? 'NEVER' : Math.round(wentAt / 60) + ' game hours') + ' after' + (fwhy.length ? '; CARDS FROM ' + fwhy.join(', ') : ''));
  await fr.evaluate(() => { try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} });
  }

  /* S: the save carries it: the tab saved and opened again on the same phone */
  let d2 = null, s2 = null;
  if (WANT('S')) {
  const s0 = await fr.evaluate('(function(){ (' + RESET + ')(false); (' + PLACE + ')(); return (' + SETUP + ')("raiders"); })()');
  const s1 = await fr.evaluate(() => { const j = LOOP.held[LOOP.held.length - 1]; let c = null; for (const q of DIRS) { const x = city.x + q[0], y = city.y + q[1]; if (cityWalkable(x, y) && !townGround(x, y)) { c = [x, y]; break; } }
    j.raid = { x: c[0], y: c[1], n: 6 }; LOOP.fighting = j.id; j.fight = { what: 'raid', n: 6, pack: null };
    meetFallBack({ type: 'BOHEMIA_CITY_ENCOUNTER', why: 'contract:' + j.id + ':raid', at: { gx: c[0], gy: c[1] } }); try { saveNow('gate:everyone'); } catch (e) {}
    return { id: j.id, raid: c, quiet: RETREAT_QUIET.till, at: [city.x, city.y] }; });
  await sleep(2500);
  try { d2 = await D.open({ again: d, profile: PROF });
    await waitFor(() => d2.fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED), 60000);
    try { await d.page.close(); } catch (e) {}
    await waitFor(async () => { const b = await d2.page.$('#bcont, [data-door="continue"]'); if (b) { await b.tap().catch(() => {}); } return d2.fr.evaluate((id) => LOOP.held.some(j => j.id === id)); }, 30000, 800, s1.id);
    await sleep(1500);
    s2 = await d2.fr.evaluate((a) => { const j = LOOP.held.filter(x => x.id === a.id)[0]; if (!j) return { nojob: true, held: LOOP.held.map(x => x.id) };
      const r0 = j.raid ? [j.raid.x, j.raid.y] : null; let walked = 0;
      for (let i = 0; i < 8; i++) { const q = DIRS.filter(dd => cityWalkable(city.x + dd[0], city.y + dd[1]) && Math.max(Math.abs(city.x + dd[0] - a.raid[0]), Math.abs(city.y + dd[1] - a.raid[1])) > Math.max(Math.abs(city.x - a.raid[0]), Math.abs(city.y - a.raid[1])))[0];
        if (!q) break; city.x += q[0]; city.y += q[1]; walked++; meetWalk(() => BohemiaJobKinds.step()); }
      return { raid: j.raid, held: !!(j.raid && j.raid.held), moved: !!(j.raid && r0 && (j.raid.x !== r0[0] || j.raid.y !== r0[1])), quiet: retreatQuiet(), till: RETREAT_QUIET.till, back: MEET_BACK.list.map(b => b.key), walked, card: !!(MEET && MEET.up) }; }, s1);
  } catch (e) { s2 = { err: String(e.message || e).slice(0, 160) }; }
  ok('S the save carries it: opened again, the raiders still hold the field (not a step after him), the quiet half day still runs', !!s2 && !s2.err && !s2.nojob && s2.held && !s2.moved && s2.quiet && s2.till === s1.quiet && !s2.card && s2.back.indexOf('contract:' + s1.id + ':raid') >= 0, JSON.stringify(s2));
  }
  ok('C nothing threw on any page', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  console.log('\nEVERYONE IN THE FIGHT HOLDS: ' + pass + ' passed, ' + fail + ' failed');
  try { if (d2) await d2.close(); else await d.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
})().catch(async (e) => { console.error(e); try { await d.close(); } catch (x) {} process.exit(1); });
