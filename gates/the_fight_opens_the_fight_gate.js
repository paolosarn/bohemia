/* THE FIGHT OPENS THE FIGHT GATE (PLUMBER 11/2/26, ask line 309).
   PAOLO 11/2, playing the live build: 'I was supposed to get into combat, and then it took me to the crew screen.'
   ROOT CAUSE, measured with a real finger on the demo at 390 x 844 (records/BOHEMIA_PLUMBER_THE_FIGHT_THAT_OPENED_THE_CREW_SCREEN_11_2_26.md):
   every fight he answers comes through the map's meet card (ENGAGE / FALL BACK / MAKE CAMP NEARBY). Its buttons answer the finger's
   lift (pointerup) and in that same handler the card turns see-through (WORLD's btwCardGone) or goes; the browser then makes the
   tap's click and hit-tests it AGAIN, so the click went to whatever stood under the button. Over a camp or a town that is the
   settlement screen (its frame logged mousedown, mouseup, click on the one tap), whose YOUR COMPANY, OPEN THE STASH and his own men's
   faces open the crew screen. The card now cancels its touchend (no click is born) and stays a wall for the late click.
   On the demo he plays (--alpha for the alpha; --profile phone_portrait by default), a fight is started every way the game starts
   one, each with a REAL TOUCH on the card's button where there is a card, and each must open THE FIGHT and nothing else:
     F1 THE TOWN: a party meets him with the town open, ENGAGE: the fight opens, the tap is the card's alone (no mouse or click
        reaches any other page or element), no crew screen
     F2 FALL BACK on the map: the tap is the card's alone, no crew screen
     F3 THE ROAD: a party met on the map, ENGAGE
     F4 A JOB'S PLACE: the contract's crew, ENGAGE
     F5 A BOSS'S PLACE: THE POT dressed as his own fight (slices/bohemia_bosses.js), ENGAGE
     F6 THE CAMP: camp made, they come, ENGAGE over the camp screen (where the leak was measured)
     F7 THE CREW SCREEN JUST BEFORE: opened with the phone's CREW, DONE on the phone, at once a party: ENGAGE
     F8 A LEVEL WAITING AND A WOUNDED MAN: the after-fight queue holds a climb and a laid-up man, then a party: ENGAGE
     F9 NO CARD (the world's own step, MEET.walk 0): the fight opens straight
     F10 AFTER A RELOAD: the tab killed mid-fight (chrome://crash), the game opened again: the same fight opens, no crew screen
     F11 nothing threw
   AND THE WAY BACK FROM A LEVEL-UP (PLUMBER 11/2, ask line 313, rule 317, Paolo: 'when I press level up, I don't know if there's an easy
   way for me to get back into the world map... make sure if I do do it at the combat screen, I'm able to get back into the [victory]
   screen'). MEASURED before: the end screen's SPEND HIS 3 LEVELS opened the company screen over it with its DONE hidden (UI round 2
   moved it onto the phone) and the phone on its home face UNDER the end screen: no way out. Two men with levels waiting, a won fight:
     L1 LEVEL UP on the end screen, a real tap: the company screen opens over it, and its DONE is on the phone, on top, a thumb tall
     L2 BACK (DONE on the phone, nothing picked): the SAME end screen as he left it, every LEVEL UP still there
     L3 PICK every level the man had, by real taps (the stats the level asks, RAISE THEM, a perk): he lands back on the same end screen by himself,
        his LEVEL UP gone, the other man's still waiting
     L4 the end screen's LEAVE: the map, no end screen, no fight, no company screen
     L5 THE CAMP: a fight from the camp, won, LEAVE: the map or the camp, nothing left over him
     L6 IN THE MIDDLE OF A FIGHT: the phone's CREW, the company screen over the fight with its DONE on the phone; DONE: his abilities
        come straight back (no second strike card)
   'Opens the fight' = the shell's fight frame with its board and units, nf-on, the phone's fight face (or its strike card); 'the crew
   screen' = the tripwire on BohemiaCrewDoor.open in every frame, any unfolded #crewdoor, or the phone's YOUR COMPANY face.
   node gates/the_fight_opens_the_fight_gate.js [--alpha] [--profile phone_portrait|phone_landscape|computer] */
'use strict';
const path = require('path');
const D = require(path.join(__dirname, '..', 'tools/bohemia_drive_the_demo.js'));
const ai = process.argv.indexOf('--profile'), profile = ai > 0 ? process.argv[ai + 1] : 'phone_portrait';
const alpha = process.argv.includes('--alpha');
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; }

/* armed before any page script, in every frame: who opens the crew screen (a stack), and every mouse and click the tap makes */
const ARM = `(function(){
  var v; try { Object.defineProperty(window, 'BohemiaCrewDoor', { configurable: true, get: function(){ return v; }, set: function(x){ v = x;
    if (x && x.open && !x.__gate) { var o = x.open; x.open = function(){ try { var T = window.top; (T.__CREW_OPENS = T.__CREW_OPENS || []).push(location.pathname.split('/').pop() + ': ' + String(new Error().stack).split('\\n').slice(2, 5).join(' < ').replace(/\\s+/g, ' ')); } catch (e) {} return o.apply(this, arguments); }; x.__gate = 1; } } }); } catch (e) {}
  ['mousedown', 'mouseup', 'click'].forEach(function(t){ window.addEventListener(t, function(ev){ try { var T = window.top; if (!T.__TAPWATCH) return;
    var card = !!(ev.target && ev.target.closest && ev.target.closest('#meetcard, #meetcard-going'));
    (T.__TAPLOG = T.__TAPLOG || []).push({ page: location.pathname.split('/').pop(), ev: t, card: card, at: (ev.target && (ev.target.id || ev.target.tagName)) || '?' }); } catch (e) {} }, true); });
})();`;

async function ff(d) { const h = await d.page.$('#fightFrame'); return h ? await h.contentFrame() : null; }
async function fightUp(d) {
  const f = await ff(d); if (!f) return null;
  const s = await f.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units.length) ? { round: FIGHT.S.round, units: FIGHT.S.units.length, board: FIGHT.S.board } : null).catch(() => null);
  if (!s) return null;
  const top = await d.page.evaluate(() => { const ph = document.getElementById('bohphone');
    return { nf: document.body.classList.contains('nf-on'), face: ph ? (ph.querySelector('.crewp.on') ? 'crew' : ph.querySelector('.fight.on') ? 'fight' : ph.querySelector('.cmb.on') ? 'strike' : 'home') : 'no phone' }; });
  return top.nf && (top.face === 'fight' || top.face === 'strike' || top.face === 'no phone') ? Object.assign(s, top) : null;
}
/* the crew screen, anywhere: the tripwire, an unfolded #crewdoor in any frame, the phone's YOUR COMPANY face */
async function crewSeen(d) {
  const out = await d.page.evaluate(() => ({ opens: (window.__CREW_OPENS || []).slice(), face: !!document.querySelector('#bohphone .crewp.on') }));
  out.doors = [];
  for (const f of d.page.frames()) { try { if (await f.evaluate(() => { const c = document.getElementById('crewdoor'); return !!c && !c.getAttribute('data-bm-folded'); })) out.doors.push(f.url().split('/').pop()); } catch (e) {} }
  out.any = out.opens.length > 0 || out.face || out.doors.length > 0;
  return out;
}
const say = (c) => c.any ? 'THE CREW SCREEN: ' + (c.opens[0] || '') + (c.doors.length ? ' door in ' + c.doors.join(',') : '') + (c.face ? ' the phone\'s YOUR COMPANY face' : '') : 'no crew screen';
async function reset(d) { await d.page.evaluate(() => { window.__CREW_OPENS = []; window.__TAPLOG = []; window.__TAPWATCH = false; }); }
/* a party meets him the way his walking meets one (meetWalk: the card first), or straight (the world's own step) */
let SEQ = 0;
async function meet(d, kind, card) {
  const tag = 'gate-309-' + (++SEQ);
  return d.fr.evaluate(([kind, card, tag]) => {
    const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
    const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: kind === 'job' ? 'The job' : 'A road crew', faction: null, draft: true, roster, party: pm, street: true,
      why: (kind === 'job' ? 'contract:' : kind === 'camp' ? 'camp:' : 'party:') + tag, at: { gx: city.x + 2, gy: city.y + 1 } };
    if (kind === 'boss') { msg.label = 'THE POT'; msg.why = 'boss:THE POT'; try { BohemiaBosses.dress(msg, { n: 'THE POT' }); } catch (e) {} }
    const go = () => cityHandOver(msg);
    return card ? meetWalk(go) : go();
  }, [kind, card, tag]);
}
async function cardButton(d, k) {
  return waitFor(() => d.fr.evaluate((k) => { const m = document.getElementById('meetcard'); if (!m || +getComputedStyle(m).opacity < 0.9) return null;
    const b = m.querySelector('[data-meet="' + k + '"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, k), 12000);
}
/* a real finger on the card's button, and the tap's every mouse and click watched in every page */
async function touch(d, k) {
  const b = await cardButton(d, k); if (!b) return null;
  const fb = await (await d.fr.frameElement()).boundingBox(); if (!fb) return null;   /* the map's frame hidden (a screen left over it): no card a finger can reach */
  await d.page.evaluate(() => { window.__TAPLOG = []; window.__TAPWATCH = true; });
  await d.page.touchscreen.tap(fb.x + b.x, fb.y + b.y);
  await sleep(900);
  return d.page.evaluate(() => { window.__TAPWATCH = false; return (window.__TAPLOG || []).slice(); });
}
const leaked = (log) => (log || []).filter(e => !e.card);
const leakSay = (log) => { const l = leaked(log); return l.length ? 'the tap LEAKED: ' + l.map(e => e.page + ' ' + e.ev + ' ' + e.at).join(', ') : 'the tap was the card\'s alone (' + (log || []).length + ' on the card)'; };
async function winOnly(d) {
  const f = await ff(d); if (!f) return false;
  await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
  return waitFor(() => d.page.evaluate(() => !!(window.SPOILS && SPOILS.d && SPOILS.frame)), 20000);
}
async function win(d) {
  if (!(await winOnly(d))) return false;
  await d.page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
  return waitFor(() => d.page.evaluate(() => !document.body.classList.contains('nf-on') && !document.getElementById('fightFrame')), 30000);
}
async function mapUp(d) {
  await waitFor(() => d.fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && !(window.MEET && MEET.up)), 20000);
  await sleep(1500);
}
/* ---- THE WAY BACK FROM A LEVEL-UP (ask line 313) ---- */
async function spoilsFrame(d) { const h = await d.page.$('#spoilsdoor iframe'); return h ? h.contentFrame() : null; }
async function rosterUp(d) {   /* the company screen standing (not folding away), in whichever page opened it */
  for (const f of d.page.frames()) { if (!/ROSTER_SCREEN/.test(f.url())) continue;
    if (await f.evaluate(() => { const fe = window.frameElement, w = fe && fe.closest && fe.closest('#crewdoor'); return !!w && !w.getAttribute('data-bm-folded'); }).catch(() => false)) return f; }
  return null;
}
/* a real finger on an element of any page, refused when the phone stands over it (that press would be the phone's) */
async function tapIn(d, f, sel) {
  const h = await f.$(sel); if (!h) return 'not there';
  await h.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {});
  await sleep(200);
  const b = await h.boundingBox(); if (!b) return 'no box';
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  if (await d.page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!(e && e.closest && e.closest('#bohphone')); }, [x, y])) return 'under the phone';
  await d.page.touchscreen.tap(x, y); return true;
}
/* the phone's DONE for the company screen: where it is, and whether a finger there meets it (on top of everything) */
const phoneDone = (d) => d.page.evaluate(() => { const b = document.querySelector('#bohphone .crewp.on .cdone'); if (!b) return null; const r = b.getBoundingClientRect(); if (r.width < 2) return null;
  const x = r.x + r.width / 2, y = r.y + r.height / 2, e = document.elementFromPoint(x, y); return { x, y, w: Math.round(r.width), h: Math.round(r.height), top: !!(e && e.closest && e.closest('.cdone')) }; });
const perksOn = (s) => s.evaluate(() => [...document.querySelectorAll('button.perk')].map(b => b.dataset.perk + ':' + b.textContent.trim()));
async function levelsWaiting(d, xp) {
  return d.page.evaluate((xp) => { const p = window.BOH_START && BOH_START.picks(), co = (p && p.company) || [], n = co.map(m => m && m.name).filter(Boolean);
    const q = JSON.parse(localStorage.getItem('bohemia.fight.after.v1') || '[]') || [];
    q.push({ day: 1, rows: n.slice(0, 2).map((x, i) => ({ name: x, main: i === 0, level: 1, xpGained: xp, dead: false, down: false, laidUpDays: 0 })) });
    localStorage.setItem('bohemia.fight.after.v1', JSON.stringify(q)); return n.slice(0, 2); }, xp);
}
async function onTheMap(d) {
  return waitFor(async () => { const top = await d.page.evaluate(() => ({ spoils: !!document.getElementById('spoilsdoor'), fight: !!document.getElementById('fightFrame'), nf: document.body.classList.contains('nf-on'), screen: (document.getElementById('bohphone') || { dataset: {} }).dataset.screen }));
    const m = await d.fr.evaluate(() => ({ mode: typeof MODE !== 'undefined' ? MODE : '?', camp: !!(window.BohemiaMapCamp && BohemiaMapCamp.on()), place: !!(window.LOOP && LOOP.open) })).catch(() => ({}));
    const crew = await rosterUp(d);
    return !top.spoils && !top.fight && !top.nf && !crew && m.mode === 'city' ? Object.assign(top, m) : null; }, 30000);
}
async function levelUpLegs(d) {
  await reset(d);
  const men = await levelsWaiting(d, 3000);
  await meet(d, 'party', false);
  if (!(await waitFor(() => fightUp(d), 45000)) || !(await winOnly(d))) { ok('L1 LEVEL UP on the end screen', false, 'no fight or no end screen'); return; }
  const s = await spoilsFrame(d);
  await waitFor(() => s.evaluate(() => document.querySelectorAll('button.perk').length > 0), 15000);
  const p0 = await perksOn(s), seq0 = await d.page.evaluate(() => SPOILS.seq), who = (p0[0] || '').split(':')[0];
  /* L1 */
  const t1 = await tapIn(d, s, 'button.perk[data-perk="' + who + '"]');
  const r1 = await waitFor(() => rosterUp(d), 10000); await sleep(1500);
  const pd = await phoneDone(d);
  ok('L1 LEVEL UP on the end screen: the company screen opens over it, its DONE on the phone, on top, a thumb tall', t1 === true && !!r1 && !!pd && pd.top && pd.h >= 40,
    'men with levels: ' + p0.join(' | ') + '; the tap ' + t1 + '; company screen ' + (r1 ? 'up' : 'NOT UP') + '; the phone\'s DONE ' + (pd ? pd.w + 'x' + pd.h + (pd.top ? ', on top' : ', COVERED') : 'NOT THERE'));
  /* L2: BACK */
  if (pd) await d.page.touchscreen.tap(pd.x, pd.y);
  const b2 = await waitFor(async () => !(await rosterUp(d)) && await d.page.evaluate(() => !!(SPOILS.frame && document.getElementById('spoilsdoor'))), 8000);
  await sleep(600);
  const p1 = await perksOn(s).catch(() => []), seq1 = await d.page.evaluate(() => SPOILS.seq);
  ok('L2 BACK (DONE on the phone, nothing picked): the SAME end screen as he left it, every LEVEL UP still there', !!b2 && seq1 === seq0 && JSON.stringify(p1) === JSON.stringify(p0),
    (b2 ? 'back on the end screen' : 'NOT BACK') + (seq1 === seq0 ? ', the same one' : ', ANOTHER ONE') + '; ' + p1.join(' | '));
  /* L3: pick every level the man had */
  const t3 = await tapIn(d, s, 'button.perk[data-perk="' + who + '"]');
  await waitFor(() => rosterUp(d), 10000); await sleep(1200);
  let picks = 0, stuck = '';
  for (let i = 0; i < 24; i++) {
    const rf = await rosterUp(d); if (!rf) break;
    /* the screen drawn first (a busy phone draws it a while after the door opens) */
    const st = await waitFor(() => rf.evaluate(() => { const o = { raise: !!document.getElementById('raise'), keys: [...document.querySelectorAll('#levelup button[data-raise]')].map(b => b.dataset.raise), perk: [...document.querySelectorAll('#plist button[data-perk]')].map(b => b.dataset.perk) };
      return o.raise || o.perk.length ? o : null; }), 8000);
    if (!st) { if (await rosterUp(d)) stuck = 'nothing to pick and the screen still up'; break; }
    let r = null;
    if (st.raise) {   /* as many stats as the level asks (rules.json attributes_raised, 4 now): picked until RAISE THEM lights */
      for (let k = 0; k < st.keys.length; k++) {
        const nx = await rf.evaluate(() => { const b = document.getElementById('raise'); if (b && !b.disabled) return null; const f = document.querySelector('#levelup button[data-raise]:not(.on)'); return f ? f.dataset.raise : null; });
        if (!nx) break; r = await tapIn(d, rf, '#levelup button[data-raise="' + nx + '"]'); if (r !== true) break; await sleep(300); }
      if (r === true || r === null) r = await tapIn(d, rf, '#raise'); }
    else r = await tapIn(d, rf, '#plist button[data-perk="' + st.perk[0] + '"]');
    if (r !== true) { stuck = 'a pick ' + r; break; }
    picks++; await sleep(1100);
  }
  const b3 = await waitFor(async () => !(await rosterUp(d)) && await d.page.evaluate(() => !!SPOILS.frame), 6000);
  await sleep(600);
  const p2 = await perksOn(s).catch(() => []), others = p0.filter(x => x.split(':')[0] !== who).map(x => x.split(':')[0]);
  ok('L3 PICK every level he had (real taps): back on the same end screen by himself, his LEVEL UP gone, the others\' still waiting',
    t3 === true && !!b3 && !stuck && !p2.some(x => x.split(':')[0] === who) && others.every(o => p2.some(x => x.split(':')[0] === o)) && await d.page.evaluate((q) => SPOILS.seq === q, seq0),
    picks + ' picks for ' + who + (stuck ? ', STUCK: ' + stuck : '') + '; ' + (b3 ? 'back on the end screen' : 'NOT BACK') + '; now: ' + (p2.join(' | ') || 'no LEVEL UP left'));
  /* L4: LEAVE (a company screen left up by a red L3 is closed with the phone's DONE first, so L4 measures LEAVE alone) */
  if (await rosterUp(d)) { const pd4 = await phoneDone(d); if (pd4) await d.page.touchscreen.tap(pd4.x, pd4.y); await waitFor(async () => !(await rosterUp(d)), 6000); await sleep(600); }
  const t4 = await tapIn(d, s, '#leave');
  const m4 = await onTheMap(d);
  ok('L4 the end screen\'s LEAVE: the map', t4 === true && !!m4, m4 ? 'the map (phone ' + m4.screen + ')' : 'NOT THE MAP: ' + JSON.stringify(await d.page.evaluate(() => ({ spoils: !!document.getElementById('spoilsdoor'), nf: document.body.classList.contains('nf-on') }))));
  await mapUp(d);
  /* L5: a fight from the camp */
  await reset(d);
  await d.fr.evaluate(() => { try { return BohemiaMapCamp.on() || BohemiaMapCamp.make(); } catch (e) { return false; } }); await sleep(4500);
  await meet(d, 'camp', true);
  await touch(d, 'go');
  let m5 = null, way = '';
  if (await waitFor(() => fightUp(d), 45000) && await winOnly(d)) { await sleep(1500); const s5 = await spoilsFrame(d); way = String(await tapIn(d, s5, '#leave')); m5 = await onTheMap(d); }
  ok('L5 THE CAMP: a fight from the camp, won, LEAVE: the map or the camp, nothing left over him', !!m5 && !(await crewSeen(d)).any,
    m5 ? (m5.camp ? 'the camp' : m5.place ? 'a place screen (phone ' + m5.screen + ')' : 'the map (phone ' + m5.screen + ')') : 'STUCK (leave ' + way + ')');
  await mapUp(d);
  /* L6: the company screen in the middle of a fight */
  await reset(d);
  await meet(d, 'party', false);
  let l6 = 'no fight';
  if (await waitFor(() => fightUp(d), 45000)) {
    await waitFor(() => d.page.evaluate(() => !!document.querySelector('#bohphone .fight.on')), 10000); await sleep(800);
    const cb = await d.page.evaluate(() => { const b = document.querySelector('#bohphone .fight.on button[aria-label="crew"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (cb) await d.page.touchscreen.tap(cb.x, cb.y);
    const r6 = await waitFor(() => rosterUp(d), 10000); await sleep(1200);
    const pd6 = await phoneDone(d), back0 = await d.page.evaluate(() => window.__PHONE_FIGHT_BACK | 0);
    if (pd6) await d.page.touchscreen.tap(pd6.x, pd6.y);
    const f6 = await waitFor(() => d.page.evaluate(() => !!document.querySelector('#bohphone .fight.on') && !document.querySelector('#bohphone .cmb.on')), 6000);
    const back1 = await d.page.evaluate(() => window.__PHONE_FIGHT_BACK | 0), gone = !(await rosterUp(d));
    l6 = { crewBtn: !!cb, up: !!r6, done: pd6 ? (pd6.top ? 'on top' : 'COVERED') : 'NOT THERE', back: !!f6 && gone, noStrike: back1 === back0 + 1 };
    await win(d); await mapUp(d);
  }
  ok('L6 IN THE MIDDLE OF A FIGHT: CREW on the phone, DONE on the phone, his abilities straight back', typeof l6 === 'object' && l6.crewBtn && l6.up && l6.done === 'on top' && l6.back && l6.noStrike, JSON.stringify(l6));
}

async function engageLeg(d, name, kind, before) {
  await reset(d);
  if (before) await before();
  await meet(d, kind, true);
  const log = await touch(d, 'go');
  const up = await waitFor(() => fightUp(d), 45000);
  const c = await crewSeen(d);
  ok(name, !!log && !!up && !c.any && leaked(log).length === 0,
    (log ? leakSay(log) : 'NO CARD came up') + '; ' + (up ? 'the fight: round ' + up.round + ', ' + up.units + ' on ' + up.board + ', the phone ' + up.face : 'NO FIGHT') + '; ' + say(c));
  if (up) { await win(d); await mapUp(d); }
}

(async () => {
  console.log('--- the fight opens the fight: ' + (alpha ? 'the alpha' : 'the demo') + ', ' + profile + ' ---');
  let d = await D.open({ profile, alpha, arm: ARM, keepCards: false, fog: true });   /* the stranger's game he plays: it starts in a town */
  const errs = [];
  try {
    console.log('  ' + d.says());
    await sleep(2500);
    /* the card is the MAP's (meetShow asks MODE 'city'); a surface that opens on the street (the alpha) leaves its town and is
       pinched out to the map the way a player does it, and says so (its town leg then runs on the map) */
    const mode0 = await d.fr.evaluate(() => typeof MODE !== 'undefined' ? MODE : '?').catch(() => '?');
    if (mode0 !== 'city') {
      console.log('  (opened on the street, MODE ' + mode0 + ': out of the town and pinched out to the map)');
      await d.page.evaluate(() => { try { document.getElementById('cityFrame').contentWindow.BohemiaPhone.P.leave(); } catch (e) {} });
      await d.fr.evaluate(() => { try { if (LOOP.open && typeof loopLeave === 'function') loopLeave(); } catch (e) {} });
      await sleep(3000);
      try { await d.toMap(); }
      catch (e) {   /* MEASURED on the alpha: eight squeezes and the street stays (mode human, czoom 1); the map's own switch, the one its pinch calls */
        const m = await d.fr.evaluate(() => { try { if (MODE !== 'city') swapMode(); } catch (e2) {} return MODE; });
        console.log('  (the pinch did not reach the map here; the map\'s own switch (swapMode) did: MODE ' + m + ')');
        await sleep(3000);
      }
    }
    const town = await d.fr.evaluate(() => !!(window.LOOP && LOOP.open)).catch(() => false);

    /* F1: with the town open (the game starts in one) */
    await engageLeg(d, 'F1 THE TOWN: a party with the town open' + (town ? '' : ' (NO TOWN WAS OPEN AT THE START)') + ', ENGAGE: the fight and nothing else', 'party');
    /* leave the town for the map */
    await d.page.evaluate(() => { try { document.getElementById('cityFrame').contentWindow.BohemiaPhone.P.leave(); } catch (e) {} });
    await sleep(2500);
    await mapUp(d);
    /* F2: FALL BACK is a press on the same card: the tap is the card's alone too */
    await reset(d);
    await meet(d, 'party', true);
    const lb = await touch(d, 'back'); await sleep(800);
    const c2 = await crewSeen(d);
    ok('F2 FALL BACK on the map: the tap is the card\'s alone, no crew screen', !!lb && leaked(lb).length === 0 && !c2.any, (lb ? leakSay(lb) : 'NO CARD came up') + '; ' + say(c2));
    await mapUp(d);
    await engageLeg(d, 'F3 THE ROAD: a party met on the map, ENGAGE: the fight and nothing else', 'party');
    await engageLeg(d, 'F4 A JOB\'S PLACE: the contract\'s crew, ENGAGE: the fight and nothing else', 'job');
    await engageLeg(d, 'F5 A BOSS\'S PLACE: THE POT, ENGAGE: the fight and nothing else', 'boss');
    await engageLeg(d, 'F6 THE CAMP: they come, ENGAGE over the camp screen: the fight and nothing else', 'camp', async () => {
      const made = await d.fr.evaluate(() => { try { return window.BohemiaMapCamp && (BohemiaMapCamp.on() || BohemiaMapCamp.make()); } catch (e) { return false; } });
      await sleep(4500); if (!made) console.log('  (the camp could not be made here; F6 meets the card on the map)');
    });
    await engageLeg(d, 'F7 THE CREW SCREEN JUST BEFORE: CREW and DONE on the phone, at once a party, ENGAGE: the fight and nothing else', 'party', async () => {
      const crewBtn = await d.page.evaluate(() => { const b = document.querySelector('#bohphone .home .bprow [aria-label="crew"], #bohphone .home button[aria-label="crew"]'); if (!b) return null; const r = b.getBoundingClientRect(); return r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; });
      if (crewBtn) await d.page.touchscreen.tap(crewBtn.x, crewBtn.y); else await d.fr.evaluate(() => { try { BohemiaPhone.P.barPress('crew'); } catch (e) {} });
      const was = await waitFor(() => d.page.evaluate(() => !!document.querySelector('#bohphone .crewp.on .cdone')), 15000);
      console.log('  (F7: the crew screen ' + (was ? 'came up from the phone\'s CREW and DONE on the phone closes it' : 'DID NOT COME UP from the phone\'s CREW') + ')');
      const done = await d.page.evaluate(() => { const b = document.querySelector('#bohphone .crewp.on .cdone'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      if (done) await d.page.touchscreen.tap(done.x, done.y);
      await sleep(150);
      await reset(d);   /* what he opened himself is not the bug; what opens after it is */
    });
    await engageLeg(d, 'F8 A LEVEL WAITING AND A WOUNDED MAN, ENGAGE: the fight and nothing else', 'party', async () => {
      await d.page.evaluate(() => { try { const p = window.BOH_START && BOH_START.picks(), co = (p && p.company) || [], names = co.map(m => m && m.name).filter(Boolean);
        const rows = names.slice(0, 2).map((n, i) => ({ name: n, main: i === 0, level: 1, xpGained: i === 0 ? 4000 : 0, dead: false, down: i === 1, laidUpDays: i === 1 ? 6 : 0, injury: i === 1 ? { id: 'broken_arm', name: 'Broken Arm', days: 6 } : null }));
        const q = JSON.parse(localStorage.getItem('bohemia.fight.after.v1') || '[]') || []; q.push({ day: 1, rows }); localStorage.setItem('bohemia.fight.after.v1', JSON.stringify(q)); } catch (e) {} });
    });

    /* L1 to L6: the way back from a level-up (ask line 313) */
    await levelUpLegs(d);

    /* F9: no card, the world's own step */
    await reset(d);
    await meet(d, 'party', false);
    const up9 = await waitFor(() => fightUp(d), 45000), c9 = await crewSeen(d);
    ok('F9 NO CARD (the world\'s own step): the fight opens straight, nothing else', !!up9 && !c9.any, (up9 ? 'the fight: round ' + up9.round + ', the phone ' + up9.face : 'NO FIGHT') + '; ' + say(c9));

    /* F10: the tab killed mid-fight, the game opened again on the same phone */
    errs.push(...d.errs);
    if (up9) {
      try { await d.page.goto('chrome://crash'); } catch (e) {}
      await sleep(1500);
      /* as THE FIGHT SAVES AT ITS START reopens (CONTINUE, the cards left standing), with world: 1500. MEASURED: the driver waits up to
         two minutes for the street (MODE 'human'), which the stranger's game never shows, and by then the resumed fight has taken the
         screen and hidden the map's frame, so the driver's TRAP 7 pressed the RUN tab and put the map back OVER the fight (the fight
         built, round 1, in a hidden panel; the phone on the map's face). A player presses nothing; the driver must not either */
      d = await D.open({ again: d, profile, alpha, keepCards: true, engage: true, world: 1500 });
      await d.page.evaluate(() => { window.__CREW_OPENS = window.__CREW_OPENS || []; });
      const up10 = await waitFor(() => fightUp(d), 90000), c10 = await crewSeen(d);
      const why10 = up10 ? '' : ' ' + JSON.stringify(await d.page.evaluate(() => ({ title: (window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up()) || false, pending: !!(window.BohemiaFightStart && BohemiaFightStart.pending()), sent: window.__FIGHT_START_SENT || null, restored: window.__FIGHT_START_RESTORED || null }))).slice(0, 200) + ' via ' + JSON.stringify(d.title);
      ok('F10 AFTER A RELOAD mid-fight: the same fight opens again, nothing else', !!up10 && up10.round === 1 && !c10.any, (up10 ? 'the fight: round ' + up10.round + ', the phone ' + up10.face : 'NO FIGHT' + why10) + '; ' + say(c10));
      if (up10) await win(d);
    } else ok('F10 AFTER A RELOAD mid-fight', false, 'F9 never opened a fight to reload');
    errs.push(...d.errs);
    const real = errs.filter(e => !/drawImage/.test(e));
    ok('F11 nothing threw', real.length === 0, real.length ? real.slice(0, 3).join(' | ') : (errs.length ? errs.length + ' known drawImage red, COMBAT\'s' : 'none'));
  } catch (e) { ok('the run itself', false, String(e && e.stack || e).slice(0, 300)); }
  try { await d.close(); } catch (e) {}
  console.log('THE FIGHT OPENS THE FIGHT: ' + pass + ' passed, ' + fail + ' failed  (' + d.says() + ', ' + profile + ')');
  process.exit(fail ? 1 : 0);
})();
