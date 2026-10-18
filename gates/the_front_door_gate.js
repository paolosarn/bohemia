/* ==========================================================================
   THE FRONT DOOR  (RUN, 10/2/26, VAMILY [the front door], rule 61d; rule 56 s5)

   PAOLO 10/1: "the loading screen looks like shit... I can't select the difficulty... I can't
   select the origin... I told you this is gonna be translated."

   MEASURED BEFORE: the door was a title, an empty dark box 1,300 phone pixels tall, a loading
   log and BEGIN. No difficulty, no origin, no name.
   NOW (the shell, __THE_FRONT_DOOR__): while the valley loads, the new company is picked in the
   loading screen's own green: THE FIGHTS (Battle Brothers' combat difficulty, three), THE SHELVES
   (its economic difficulty, three), WHO YOU WERE (its fifteen origins, translated, each with its
   own difficulty) and the crew's name, prepared. The middle is picked already; BEGIN is never held.

   LEGS, on the baked demo, through the one driver (the picks are made with real touches in its
   beforeTap, then the driver opens the door as it always does):
     D1  the door offers 3 fights, 3 shelves, 15 origins and a name, every one a thumb (44 px)
     D2  the middle is picked already (SEEN IT, THIN SHELVES, A NEW CREW)
     D3  a pick is not BEGIN: touching one changes it and the door stays up
     D4  every number a card shows is the number the game applies (start, crews, pay)
     D5  BEGIN carries the picks to the map, and the purse starts with the origin's batteries
     D6  every job carries them: the pay, the crew, and the fight's own difficulty

   node gates/the_front_door_gate.js
   ========================================================================== */
'use strict';
const { throughTheTitle } = require(require('path').join(__dirname, '..', 'tools/bohemia_through_the_title.js'));   /* rule 66: the title is in front of the door now */
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE FRONT DOOR: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let door = null, d;
  const beforeTap = async (page) => {
    await throughTheTitle(page);   /* __THE_START_SCREEN__: NEW GAME first, then the door's picks */
    const look = () => page.evaluate(() => {
      const bs = [...document.querySelectorAll('#newco button')].filter(b => getComputedStyle(b).display !== 'none');
      const on = k => { const b = document.querySelector('#newco button.on[data-k="' + k + '"]'); return b ? b.getAttribute('data-v') : null; };
      return { fights: bs.filter(b => b.dataset.k === 'combat').length, shelves: bs.filter(b => b.dataset.k === 'econ').length,
        origins: bs.filter(b => b.dataset.k === 'origin').length, name: (document.getElementById('newconame') || {}).textContent || '',
        small: bs.filter(b => { const r = b.getBoundingClientRect(); return r.height < 44 || r.width < 44; }).length,
        on: { combat: on('combat'), econ: on('econ'), origin: on('origin') }, front: getComputedStyle(document.getElementById('front')).display,
        began: !!window.__PLAY_BEGAN };
    });
    try { await page.evaluate(() => { try { localStorage.removeItem('bohemia.start'); } catch (_e) {} if (window.BOH_START) { BOH_START.state.combat = 'seen'; BOH_START.state.econ = 'thin'; BOH_START.state.origin = 'newcrew'; BOH_START.state.name = 0; } }); } catch (_e) {}
    const before = await look();
    const tap = async (sel) => { const r = await page.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }, sel); if (r) { await page.touchscreen.tap(r.x, r.y); await page.waitForTimeout(250); } return !!r; };
    const n0 = before.name;
    await tap('#newco button[data-v="out"]');
    await tap('#newco button[data-v="full"]');
    await tap('#newco button[data-v="truck"]');
    await tap('#newco button[data-k="name"]');
    const after = await look();
    const card = await page.evaluate(() => { const b = document.querySelector('#newco button[data-v="truck"]'); return b ? b.innerText : ''; });
    const picks = await page.evaluate(() => BOH_START.picks());
    door = { before, after, n0, card, picks };
  };
  try { d = await drive.open({ keepCards: true, beforeTap }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  try {
    if (!door) { ok('the door was reached with the picks on it', false); await d.close(); return done(); }
    const b = door.before, a = door.after, p = door.picks;
    ok('*** D1 THE DOOR OFFERS THE NEW COMPANY *** (' + b.fights + ' fights, ' + b.shelves + ' shelves, ' + b.origins + ' origins, name "' + b.name + '"; ' + b.small + ' under a thumb)',
      b.fights === 3 && b.shelves === 3 && b.origins === 15 && !!b.name && b.small === 0);
    ok('D2 the middle is picked already (' + JSON.stringify(b.on) + ')', b.on.combat === 'seen' && b.on.econ === 'thin' && b.on.origin === 'newcrew');
    ok('D3 a pick is not BEGIN (' + JSON.stringify(a.on) + ', the door ' + a.front + ', play began ' + a.began + '; name "' + door.n0 + '" -> "' + a.name + '")',
      a.on.combat === 'out' && a.on.econ === 'full' && a.on.origin === 'truck' && a.front !== 'none' && !a.began && a.name !== door.n0);
    /* THE WATER TRUCK: pay +1; OUTLIVED IT: crews +1. RE-AIMED 10/5 (RUN [the origin sets the company], rule 75a): the start
       is no longer 7 x the shelves' 1.5, it is the origin's own funds column from records/target/bb/origins.json (FULL =
       Battle Brothers' High funds, 1650 crowns at 10 to a battery = 165) -- the same number the card shows and BEGIN pays */
    const TRUCK = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'records/target/bb/origins.json'), 'utf8')).origins.find(o => o.id === 'truck');
    ok('*** D4 THE CARD SAYS WHAT THE GAME APPLIES *** ("' + door.card.replace(/\s+/g, ' ').slice(0, 120) + '" vs start ' + p.start + ', crews ' + p.crew + ', pay +' + p.pay + ')',
      new RegExp('START ' + p.start + ' BATTERIES').test(door.card) && /PAY \+1/.test(door.card) && p.start === TRUCK.batteries.full && p.crew === 1 && p.pay === 1);
    await d.page.waitForTimeout(1500);
    const m = await fr.evaluate(() => ({ start: LOOP.start, bats: loopBats() }));
    ok('*** D5 BEGIN CARRIES THE PICKS TO THE MAP *** (' + (m.start && m.start.originName) + ', ' + m.bats + ' batteries)',
      !!m.start && m.start.origin === 'truck' && m.start.combat === 'out' && m.bats === p.start);
    /* D6: a job taken now carries them: base pay 1 -> (1 + 1) x 1.5 = 3; crew 2 + 1 = 3; the fight's package 2 */
    const j = await fr.evaluate(() => {
      const bs = ctBases() || {}; let t = null; for (const n in bs) { t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; break; }
      LOOP.open = t; loopTakeContract({ id: 'ct-gate', title: 'a gate job', pay: 1 }); LOOP.open = null;
      const job = LOOP.held[LOOP.held.length - 1] || null;
      let sent = null; const real = window.parent.postMessage.bind(window.parent);
      return { job };
    });
    let pkg = null;
    if (j.job) {
      pkg = await fr.evaluate((job) => new Promise(res => {
        const w = window.parent; const orig = w.postMessage;
        w.postMessage = function (msg) { if (msg && msg.type === 'BOHEMIA_CITY_ENCOUNTER') { w.postMessage = orig; res(msg.packageId); } return orig.apply(this, arguments); };
        city.x = job.target.x; city.y = job.target.y; loopArrived([city.x, city.y]);
        setTimeout(() => { w.postMessage = orig; res('none'); }, 4000);
      }), j.job);
    }
    ok('*** D6 EVERY JOB CARRIES THE PICKS *** (pay ' + (j.job && j.job.pay) + ', crew ' + (j.job && j.job.crew) + ', the fight\'s difficulty ' + pkg + ')',
      !!j.job && j.job.pay === 3 && j.job.crew >= 3 && pkg === 2);
    ok('nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
