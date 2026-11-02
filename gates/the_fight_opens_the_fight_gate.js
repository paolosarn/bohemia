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
  const fb = await (await d.fr.frameElement()).boundingBox();
  await d.page.evaluate(() => { window.__TAPLOG = []; window.__TAPWATCH = true; });
  await d.page.touchscreen.tap(fb.x + b.x, fb.y + b.y);
  await sleep(900);
  return d.page.evaluate(() => { window.__TAPWATCH = false; return (window.__TAPLOG || []).slice(); });
}
const leaked = (log) => (log || []).filter(e => !e.card);
const leakSay = (log) => { const l = leaked(log); return l.length ? 'the tap LEAKED: ' + l.map(e => e.page + ' ' + e.ev + ' ' + e.at).join(', ') : 'the tap was the card\'s alone (' + (log || []).length + ' on the card)'; };
async function win(d) {
  const f = await ff(d); if (!f) return false;
  await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
  await waitFor(() => d.page.evaluate(() => !!(window.SPOILS && SPOILS.d)), 20000);
  await d.page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
  return waitFor(() => d.page.evaluate(() => !document.body.classList.contains('nf-on') && !document.getElementById('fightFrame')), 30000);
}
async function mapUp(d) {
  await waitFor(() => d.fr.evaluate(() => typeof MODE !== 'undefined' && MODE === 'city' && !(window.MEET && MEET.up)), 20000);
  await sleep(1500);
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
        const rows = names.slice(0, 2).map((n, i) => ({ name: n, main: i === 0, level: 1, xpGained: i === 0 ? 4000 : 0, dead: false, down: i === 1, laidUpDays: i === 1 ? 6 : 0, injury: i === 1 ? { id: 'broken_arm', days: 6 } : null }));
        const q = JSON.parse(localStorage.getItem('bohemia.fight.after.v1') || '[]') || []; q.push({ day: 1, rows }); localStorage.setItem('bohemia.fight.after.v1', JSON.stringify(q)); } catch (e) {} });
    });

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
