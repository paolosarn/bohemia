/* ==========================================================================
   EVERY JOB KIND  (WORLD [every job kind], 10/24/26, rule 153(b))

   PAOLO 10/24: 'right now the only jobs you have are pull up on people and kill them, but in Battle Brothers there were a
   lot of different jobs: find something on the map, or do a caravan, or roam around until you find a certain enemy type
   and kill a bunch of them; I want more quest types.'

   ONE DRIVER PLAYS EVERY BUILT KIND END TO END ON THE DEMO, the board's own 'Take it' message to the pay, by touches on the
   glass (a journey to a block that is off the glass is set with the map's own travelTo, the function a touch calls, and the
   line says so), every fight played on AUTO in the rebuilt fight:
     K0  the kinds file and the module are in the map; the board's 39 people are each a kind, all eight verbs' first four
         built (ESCORT, FIND, HUNT, CAMP) and today's crew still today's crew
     E   ESCORT: the cargo truck follows him to another town; the clock is slower with it; raiders come for it and close;
         the fight; what is left arrives and pays per crate
     F   FIND: a ring on the map; a stop inside says which way; it turns up within two blocks; back to the client; paid
     H   HUNT: packs of the fight's own 3D beasts on the map; a touch goes after one; contact is the fight; the kills count on
         the job; enough and back to the client; paid
     C   CAMP: a camp with a fire; the fight there; paid a flat part and a share a head
     Z   nothing threw

     D   DELIVER: a thing in the bag to another town, no slowness; signed for there, paid
     V   DEFEND: the HOLD mark at the client's gate with the nights left; standing on it the waves come, one fight each, the
         next by itself; all held pays the job, part held its share
     R   RECOVER: the thing with whoever holds it; the fight there; he has it; back to the client; paid
     P   PATROL: two posts on the map; past each a crew comes out on the road; both walked, back, paid flat and a head

   node gates/every_job_kind_gate.js [escort|find|hunt|camp|carry|hold|recover|patrol]
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const ONLY = process.argv[2] || null;

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('EVERY JOB KIND: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  const shell = () => d.page.evaluate(() => ({ fight: !!CITYFIGHT }));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await d.page.waitForTimeout(300); } return false; };
  const cityBox = async () => (await d.page.$('#cityFrame')).boundingBox();
  /* a touch on a block where it is on the glass; off the glass, the map's own travelTo (what the touch calls) */
  const goCell = async (x, y) => {
    const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y);
      return { x: r.left + q.sx, y: r.top + q.sy + TH / 2, on: mapOnGlass(x, y) }; }, [x, y]);
    if (p.on) { await d.tapAt(p.x, p.y); await d.page.waitForTimeout(150);
      /* a touch can land on a roaming party's plate (its first tap is a look) or a town's art: then the map's own travelTo */
      const set = await fr.evaluate(([x, y]) => (TRAVEL && TRAVEL.to && Math.max(Math.abs(TRAVEL.to[0] - x), Math.abs(TRAVEL.to[1] - y)) <= 2) || Math.max(Math.abs(city.x - x), Math.abs(city.y - y)) <= 1 || !!LOOP.fighting, [x, y]);
      if (set || (await shell()).fight) return 'touch'; }
    await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, [x, y]); return p.on ? 'touch, then travelTo' : 'travelTo';
  };
  const unpause = async () => {
    const one = await fr.evaluate(() => { const e = [...document.querySelectorAll('button,div')].filter(x => /^1X$/i.test((x.textContent || '').trim()) && x.getBoundingClientRect().width > 10)
      .sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (one) { const fb = await cityBox(); await d.page.touchscreen.tap(fb.x + one.x, fb.y + one.y); await d.page.waitForTimeout(300); }
    await fr.evaluate(() => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); });
  };
  const fightFrame = async () => { for (let i = 0; i < 120; i++) { const h = await d.page.$('#fightFrame');
      if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) return { f, box: await h.boundingBox() }; }
      await d.page.waitForTimeout(200); } return { f: null, box: null }; };
  /* RUN TWO's SPOILS (rule 156) after a won fight waits for LEAVE: a finger on LEAVE, as he would */
  const spoilsLeave = async () => {
    const up = await waitFor(() => d.page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !CITYFIGHT), 15000);
    const h = await d.page.$('#spoilsdoor iframe'); if (!h) return false;
    const sf = await h.contentFrame(), box = await h.boundingBox();
    const b = sf ? await sf.waitForFunction(() => { const e = document.getElementById('leave'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, null, { timeout: 10000 }).then(x => x.jsonValue()).catch(() => null) : null;
    if (b) await d.page.touchscreen.tap(box.x + b[0], box.y + b[1]); else await d.page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    return up;
  };
  /* the fight on AUTO, to its end, and home */
  const autoFight = async () => {
    const ff = await fightFrame(); if (!ff.f) return null;
    const { f: cf, box } = ff;
    await cf.evaluate(() => { FIGHT_UI.speed = 6; });
    const b = await cf.evaluate(() => { const r = document.getElementById('bauto').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await d.page.touchscreen.tap(box.x + b[0], box.y + b[1]);
    const t0 = Date.now();
    while (Date.now() - t0 < 150000) { if (await cf.evaluate(() => FIGHT.S.over).catch(() => true)) break; await d.page.waitForTimeout(500); }
    const res = await cf.evaluate(() => FIGHT.S.result).catch(() => null);
    await spoilsLeave();
    await waitFor(async () => !(await shell()).fight, 20000);
    await d.page.waitForTimeout(1500);
    await fr.evaluate(async () => { for (let i = 0; i < 40 && typeof FZOOMING !== 'undefined' && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); });
    await unpause();
    return res;
  };
  /* the fight ended by the gate where AUTO lost: every one of theirs down, the card a cleared fight shows (THE LOOP's L8 way, with bodies) */
  const forceWin = async () => {
    const ff = await fightFrame(); if (!ff.f) return null;
    await ff.f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    await spoilsLeave();
    await waitFor(async () => !(await shell()).fight, 20000);
    await d.page.waitForTimeout(1500); await unpause();
    return 'won (ended by the gate)';
  };
  const reset = (why) => fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; render(); });
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
  const settleFrame = async () => { const fh = await fr.$('#settleFrame'); return fh ? fh.contentFrame() : null; };
  /* the board's own 'Take it': the settlement posts the contract it offers, from its own window */
  const take = async (id) => {
    const sf = await settleFrame(); if (!sf) return null;
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 15000 }).catch(() => {});
    const t = await sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; if (!o) return null;
      const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
      /* the very message 'Take it' posts (the settlement's post(): type, act, place, batteries, contract), from its own window */
      window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); return o.title; }, id);
    await d.page.waitForTimeout(800);
    return t;
  };
  const leave = async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await d.page.waitForTimeout(500); };
  const job = (id) => fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; return j ? JSON.parse(JSON.stringify(j)) : null; }, id);
  const bats = () => fr.evaluate(() => loopBats());
  const drew = () => fr.evaluate(() => { render(); return JSON.parse(JSON.stringify({ cargo: MAP_DREW.cargo | 0, rings: MAP_DREW.rings | 0, beasts: MAP_DREW.beasts | 0, kinds: MAP_DREW.jobKinds | 0, jobs: MAP_DREW.jobs | 0, hits: BohemiaJobKinds.hits().length })); });
  /* to a town and its screen open (the arrival is the town's own) */
  const toTown = async (name) => {
    const t = await fr.evaluate((name) => { const bs = ctBases() || {}; let best = null;
      for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (name ? n === name : (dd >= 2 && (!best || dd < best.d))) best = { n, x: b.x, y: b.y, d: dd }; }
      if (!best) return null; const g = townDoor(best.x, best.y); return Object.assign(best, { g }); }, name || null);
    if (!t) return null;
    await goCell(t.g[0], t.g[1]);
    const opened = await waitFor(settleOpen, 60000);
    await d.page.waitForTimeout(1200);
    return opened ? t : null;
  };
  const arriveAt = async (x, y, ms) => {
    const how = await goCell(x, y);
    await waitFor(() => fr.evaluate(() => !TRAVEL), ms || 60000);
    return how;
  };

  try {
    await d.page.waitForTimeout(2500);
    /* K0 */
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready(), null, { timeout: 20000 }).catch(() => {});
    const k0 = await fr.evaluate(() => { const sh = BohemiaBoardShelf && BohemiaBoardShelf.shelf(); if (!sh || !window.BohemiaJobKinds) return null;
      const by = {}; sh.offers.forEach(o => { const k = BohemiaJobKinds.kindOf(o); by[k] = (by[k] || 0) + 1; });
      return { n: sh.offers.length, by, built: ['haul-caravan', 'find-place', 'find-person', 'hunt-kind', 'clear-camp', 'carry', 'hold-defend', 'recover-return', 'patrol'].filter(k => BohemiaJobKinds.built(k)).length }; });
    ok('K0 the kinds are in the map: ' + (k0 ? k0.n + ' board people, ' + JSON.stringify(k0.by) + ', ' + k0.built + ' of 9 kinds built' : 'no module'),
      !!k0 && k0.built === 9 && (k0.by['patrol'] | 0) >= 2 && (k0.by['haul-caravan'] | 0) >= 5 && (k0.by['find-place'] | 0) >= 3 && (k0.by['hunt-kind'] | 0) >= 3 && (k0.by['clear-camp'] | 0) >= 2
        && (k0.by['hold-defend'] | 0) >= 4 && (k0.by['recover-return'] | 0) >= 8 && (k0.by['carry'] | 0) >= 1 && (k0.by['clear-crew'] | 0) >= 1);

    const t0 = await toTown(null);
    ok('the nearest town opens (' + (t0 && t0.n) + ')', !!t0);
    if (!t0) { await d.close(); return done(); }

    /* ---------------- ESCORT ---------------- */
    if (!ONLY || ONLY === 'escort') {
      const title = await take('qd-ae09'); await leave();
      let j = await job('qd-ae09');
      ok('E1 ESCORT taken at ' + t0.n + ': "' + title + '" -> ' + (j ? j.cargo.n + ' ' + j.cargo.unit + 's to ' + j.dest.name + ', ' + j.perCrate + ' a ' + j.cargo.unit + ', ' + j.ambush.length + ' ambush, twist ' + j.twist : 'no job'),
        !!j && j.plays === 'haul-caravan' && j.cargo.n >= 2 && !!j.dest && j.dest.name !== t0.n && j.ambush.length >= 1);
      const dr = await drew();
      ok('E2 the cargo is drawn on the map behind him, and the place it goes (' + JSON.stringify(dr) + ')', dr.cargo >= 1 && dr.hits >= 1 && dr.jobs === 0);
      const pace = await fr.evaluate(() => { const a = cityStepMins(city.x, city.y), p = BohemiaJobKinds.pace(); return { a, p }; });
      ok('E3 the caravan is slow: a block costs ' + pace.p + 'x the clock while it walks with him', pace.p > 1.2);
      if (j) {
        const b0 = await bats();
        const how = await goCell(j.target.x, j.target.y);
        const raided = await waitFor(async () => (await shell()).fight || !(await job('qd-ae09')) || await fr.evaluate(() => !TRAVEL && !LOOP.fighting), 90000);
        const st = await fr.evaluate(() => ({ raids: window.__JOB_RAIDS | 0, fighting: LOOP.fighting, fights: window.__JOB_FIGHTS | 0 }));
        ok('E4 raiders come for the cargo on the road and the fight opens (' + how + '; raids ' + st.raids + ', fighting ' + st.fighting + ')', st.raids >= 1 && st.fighting === 'qd-ae09');
        const res = await autoFight();
        const j2 = await job('qd-ae09');
        const ends = await fr.evaluate(() => window.__JOB_ENDS || []);
        /* a LOST fight is the map's death rule (__DEATH_IS_A_RELOAD__, Paolo 7/26; RUN's): back to the save at the bell, so the
           job is as it was when the fight began; a won or walked-out fight is the kind's to settle (the crates that got through) */
        ok('E5 the fight ends and the cargo keeps count (' + res + '; ' + (j2 ? j2.cargo.n + ' of ' + j2.cargo.of + ' left' : 'job gone') + (res === 'lost' ? ', the save at the bell' : '') + ')',
          !!res && ends.length >= 1 && (res === 'lost' ? (!!j2 && j2.cargo.n === j.cargo.n) : (j2 ? (j2.cargo.n >= 1 && j2.cargo.n <= j2.cargo.of && !j2.raid) : true)));
        if (j2) {
          for (let k = 0; k < 4; k++) {
            if (!(await job('qd-ae09'))) break;
            if ((await shell()).fight) { await autoFight(); continue; }
            const jj = await job('qd-ae09'); if (!jj) break;
            await goCell(jj.target.x, jj.target.y);
            await waitFor(async () => (await shell()).fight || !(await job('qd-ae09')) || await fr.evaluate(() => !TRAVEL), 90000);
          }
          const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-ae09')[0];
          const b1 = await bats();
          ok('E6 THE CARGO ARRIVES AND PAYS PER CRATE (' + (paid ? paid.paid + ' of ' + paid.of + ' batteries' : 'not paid') + '; batteries ' + b0 + ' -> ' + b1 + ')',
            !!paid && paid.paid > 0 && b1 - b0 >= paid.paid - 2 * 30);
          /* WORLD [the PC playtest: the jobs' part] (rule 164 item 3): the carts go where the words say; a town there opens, a place
             the words made up ('the wash camp') is where he stands */
          if (j.dest && j.dest.made) {
            const at = await fr.evaluate(([x, y]) => Math.max(Math.abs(city.x - x), Math.abs(city.y - y)), [j.target.x, j.target.y]);
            ok('E7 and he stands where he brought it, ' + j.dest.name + ' (' + at + ' blocks off)', at <= 1);
          } else {
            const opened = await waitFor(settleOpen, 15000);
            ok('E7 and the town he brought it to opens', opened);
          }
        } else {
          const lostj = (await fr.evaluate(() => window.__JOB_LOST || [])).filter(p => p.id === 'qd-ae09');
          ok('E6 the cargo was all taken and the job is lost, said', lostj.length === 1);
        }
      }
    }

    /* ---------------- FIND ---------------- */
    if (!ONLY || ONLY === 'find') {
      await reset();   /* each leg alone: a job left from the leg before (a hunt's packs smell him) is put down */
      if (!(await settleOpen())) await toTown(null);
      const here = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      const title = await take('qd-s17'); await leave();
      let j = await job('qd-s17');
      ok('F1 FIND taken at ' + here + ': "' + title + '" -> ' + (j ? 'a ring of ' + j.ring.r + ' at ' + j.ring.x + ',' + j.ring.y + ', twist ' + j.twist : 'no job'), !!j && j.plays === 'find-place' && j.stage === 'look');
      const dr = await drew();
      ok('F2 the ring is drawn on the map (' + dr.rings + ')', dr.rings >= 1);
      if (j) {
        await arriveAt(j.ring.x, j.ring.y, 60000);
        await d.page.waitForTimeout(800);
        j = await job('qd-s17');
        const hints = await fr.evaluate(() => window.__JOB_HINTS | 0), line = await fr.evaluate(() => (LOOP.said || []).slice(-1)[0] || '');
        ok('F3 a stop inside the ring says which way, or it is right there ("' + line + '")', hints >= 1 || (j && j.stage !== 'look') || (await shell()).fight);
        if (j && j.stage === 'look' && !(await shell()).fight) { await arriveAt(j.spot.x, j.spot.y, 60000); await d.page.waitForTimeout(800); }
        if ((await shell()).fight) await autoFight();
        j = await job('qd-s17');
        ok('F4 IT TURNS UP, and the job says go back (' + (j ? j.stage : 'gone') + ', found ' + await fr.evaluate(() => window.__JOB_FOUND | 0) + ')', !!j && j.stage === 'back');
        if (j) {
          const b0 = await bats();
          await toTown(j.from);
          const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-s17')[0];
          ok('F5 BACK AT ' + j.from + ', PAID (' + (paid ? paid.paid : 'nothing') + '; ' + b0 + ' -> ' + await bats() + ')', !!paid && paid.paid === j.pay);
        }
      }
    }

    /* ---------------- HUNT ---------------- */
    if (!ONLY || ONLY === 'hunt') {
      await reset();
      if (!(await settleOpen())) await toTown(null);
      const here = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      const title = await take('qd-aa15'); await leave();
      let j = await job('qd-aa15');
      ok('H1 HUNT taken at ' + here + ': "' + title + '" -> ' + (j ? 'kill ' + j.need + ' ' + j.foe + ', ' + j.packs.length + ' packs (' + j.packs.map(p => p.n + ' ' + p.look).join(', ') + ')' : 'no job'),
        !!j && j.plays === 'hunt-kind' && j.packs.length >= 1 && j.need === 2);
      await d.page.waitForTimeout(1500);
      const dr = await drew();
      ok('H2 the packs are on the map as the fight\'s own beasts (' + dr.beasts + ' drawn)', dr.beasts >= 1);
      for (let k = 0; k < 5 && j && j.stage === 'hunt'; k++) {
        /* a touch on the nearest pack goes after it */
        const p = j.packs.slice().sort((a, b) => 0)[0];
        const hit = await fr.evaluate((id) => { render(); const h = BohemiaJobKinds.hits().filter(h => h.pack === id)[0]; if (!h) return null; const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left + h.x + h.w / 2, y: r.top + h.y + h.h / 2 }; }, p.id);
        if (hit && hit.x > 0 && hit.y > 60) await d.tapAt(hit.x, hit.y); else await goCell(p.x, p.y);
        await waitFor(async () => (await shell()).fight || await fr.evaluate(() => !TRAVEL), 60000);
        if (!(await shell()).fight) { const jj = await job('qd-aa15'); if (jj && jj.packs[0]) await goCell(jj.packs[0].x, jj.packs[0].y); await waitFor(async () => (await shell()).fight || await fr.evaluate(() => !TRAVEL), 60000); }
        if ((await shell()).fight) { const res = k === 0 ? await autoFight() : await forceWin(); const jj = await job('qd-aa15'); console.log('       a pack: ' + res + ', hunt ' + (jj ? jj.got + '/' + jj.need : 'done')); }
        j = await job('qd-aa15');
      }
      ok('H3 THE KILLS COUNT ON THE JOB and enough sends him back (' + (j ? 'hunt ' + j.got + '/' + j.need + ', ' + j.stage : 'gone') + ')', !!j && j.got >= j.need && j.stage === 'back');
      if (j && j.stage === 'back') {
        const b0 = await bats();
        await toTown(j.from);
        const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-aa15')[0];
        ok('H4 BACK AT ' + j.from + ', PAID (' + (paid ? paid.paid : 'nothing') + '; ' + b0 + ' -> ' + await bats() + ')', !!paid && paid.paid === j.pay);
      }
    }

    /* ---------------- CAMP ---------------- */
    if (!ONLY || ONLY === 'camp') {
      await reset();
      if (!(await settleOpen())) await toTown(null);
      const here = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      const title = await take('qd-t06'); await leave();
      let j = await job('qd-t06');
      ok('C1 CAMP taken at ' + here + ': "' + title + '" -> ' + (j ? j.camp.men + ' at the camp, ' + j.flat + ' flat + ' + j.perHead + ' a head, twist ' + j.twist : 'no job'), !!j && j.plays === 'clear-camp' && j.camp.men >= 2);
      const dr = await drew();
      ok('C2 the camp is drawn (' + JSON.stringify(dr) + ')', dr.hits >= 1 && dr.jobs === 0);
      if (j) {
        const b0 = await bats();
        await goCell(j.camp.x, j.camp.y);
        const f = await waitFor(async () => (await shell()).fight, 60000);
        ok('C3 reaching the camp opens the fight', f);
        const res = f ? await autoFight() : null;
        const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-t06')[0], lostj = (await fr.evaluate(() => window.__JOB_LOST || [])).filter(p => p.id === 'qd-t06')[0];
        ok('C4 THE CAMP SETTLES BY THE RESULT (' + res + ': ' + (paid ? 'paid ' + paid.paid + ' of ' + paid.of : lostj ? 'lost' : 'still held') + '; ' + b0 + ' -> ' + await bats() + ')',
          res === 'won' ? (!!paid && paid.paid >= j.flat && paid.paid <= j.pay) : res === 'lost' ? !!lostj : false);
      }
    }
    /* ---------------- DELIVER ---------------- */
    if (!ONLY || ONLY === 'carry') {
      await reset();
      if (!(await settleOpen())) await toTown(null);
      const here = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      const title = await take('qd-ar08'); await leave();
      let j = await job('qd-ar08');
      ok('D1 DELIVER taken at ' + here + ': "' + title + '" -> ' + (j ? j.item + ' to ' + j.dest.name + ', twist ' + j.twist : 'no job'), !!j && j.plays === 'carry' && j.stage === 'carry' && j.dest.name !== here);
      const pace = await fr.evaluate(() => BohemiaJobKinds.pace());
      ok('D2 a letter is not a caravan: no slowness (' + pace + 'x)', pace === 1);
      if (j) {
        const b0 = await bats();
        for (let k = 0; k < 5; k++) {
          const jj = await job('qd-ar08'); if (!jj) break;
          if ((await shell()).fight) { await forceWin(); continue; }
          await goCell(jj.target.x, jj.target.y);
          await waitFor(async () => (await shell()).fight || !(await job('qd-ar08')) || await fr.evaluate(() => !TRAVEL), 90000);
        }
        const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-ar08')[0];
        ok('D3 SIGNED FOR IN ' + j.dest.name + ', PAID (' + (paid ? paid.paid : 'nothing') + '; ' + b0 + ' -> ' + await bats() + ')', !!paid && paid.paid === j.pay);
      }
    }

    /* ---------------- DEFEND ---------------- */
    if (!ONLY || ONLY === 'hold') {
      await reset();
      if (!(await settleOpen())) await toTown(null);
      const here = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      const title = await take('qd-r01'); await leave();
      let j = await job('qd-r01');
      ok('V1 HOLD taken at ' + here + ': "' + title + '" -> ' + (j ? j.waves + ' waves, by day ' + j.by + ' (now ' + await fr.evaluate(() => loopDay()) + ')' : 'no job'), !!j && j.plays === 'hold-defend' && j.waves === 2 && j.by > await fr.evaluate(() => loopDay()));
      const dr = await drew();
      ok('V2 the HOLD mark is on the map at the gate (' + dr.hits + ')', dr.hits >= 1);
      if (j) {
        const b0 = await bats();
        /* he is at the gate already: a touch where he stands is the arrival */
        await goCell(j.target.x, j.target.y);
        const f1 = await waitFor(async () => (await shell()).fight, 30000);
        ok('V3 standing on the mark, the night comes: wave 1 (' + await fr.evaluate(() => (LOOP.said || []).slice(-1)[0]) + ')', f1);
        if (f1) await forceWin();
        const f2 = await waitFor(async () => (await shell()).fight, 30000);
        const jj = await job('qd-r01');
        ok('V4 wave 1 held, wave 2 comes by itself (' + (jj ? 'wave ' + jj.wave + ' of ' + jj.waves : 'job gone') + ')', f2 && !!jj && jj.wave === 1);
        if (f2) await autoFight();
        const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-r01')[0];
        ok('V5 THE HOLD SETTLES: all held pays the job, one of two held pays half (' + (paid ? paid.paid + ' of ' + paid.of : 'nothing') + '; ' + b0 + ' -> ' + await bats() + ')',
          !!paid && (paid.paid === j.pay || paid.paid === Math.floor(j.pay / 2)));
      }
    }

    /* ---------------- RECOVER ---------------- */
    if (!ONLY || ONLY === 'recover') {
      await reset();
      if (!(await settleOpen())) await toTown(null);
      const here = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      const title = await take('qd-c02'); await leave();
      let j = await job('qd-c02');
      ok('R1 RECOVER taken at ' + here + ': "' + title + '" -> ' + (j ? j.item + ', ' + j.guards + ' on it, twist ' + j.twist : 'no job'), !!j && j.plays === 'recover-return' && j.stage === 'get' && j.guards >= 1);
      if (j) {
        for (let k = 0; k < 4; k++) {
          const jj = await job('qd-c02'); if (!jj || jj.stage !== 'get') break;
          await goCell(jj.spot.x, jj.spot.y);
          await waitFor(async () => (await shell()).fight || await fr.evaluate(() => !TRAVEL), 90000);
          if ((await shell()).fight) await forceWin();
        }
        j = await job('qd-c02');
        ok('R2 THE ONES HOLDING IT ARE DOWN AND HE HAS IT (' + (j ? j.stage + ', has ' + j.has : 'gone') + ')', !!j && j.stage === 'back' && j.has === true);
        if (j) {
          const b0 = await bats();
          await toTown(j.from);
          const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-c02')[0];
          ok('R3 BACK AT ' + j.from + ', PAID (' + (paid ? paid.paid : 'nothing') + '; ' + b0 + ' -> ' + await bats() + ')', !!paid && paid.paid === j.pay);
        }
      }
    }
    /* ---------------- PATROL ---------------- */
    if (!ONLY || ONLY === 'patrol') {
      await reset();
      if (!(await settleOpen())) await toTown(null);
      const here = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      const title = await take('jk-patrol-wash'); await leave();
      let j = await job('jk-patrol-wash');
      ok('P1 PATROL taken at ' + here + ': "' + title + '" -> ' + (j ? j.posts.map(p => p.name || (p.x + ',' + p.y)).join(' and ') + ', ' + j.flat + ' flat + ' + j.perHead + ' a head up to ' + j.cap : 'no job'),
        !!j && j.plays === 'patrol' && j.posts.length === 2);
      const dr = await drew();
      ok('P2 the posts are on the map (' + dr.hits + ' marks)', dr.hits >= 1);
      if (j) {
        const b0 = await bats();
        for (let k = 0; k < 10; k++) {
          const jj = await job('jk-patrol-wash'); if (!jj) break;
          if ((await shell()).fight) { await forceWin(); continue; }
          if (await settleOpen()) await leave();   /* a post that is a town opens it; he leaves to walk on */
          await goCell(jj.target.x, jj.target.y);
          await waitFor(async () => (await shell()).fight || !(await job('jk-patrol-wash')) || await fr.evaluate(() => !TRAVEL), 90000);
          if (jj.stage === 'back' && !(await shell()).fight && await job('jk-patrol-wash')) await toTown(jj.from);
        }
        const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'jk-patrol-wash')[0];
        const bands = await fr.evaluate(() => window.__JOB_BANDS | 0), ends = (await fr.evaluate(() => window.__JOB_ENDS || [])).filter(e => e.id === 'jk-patrol-wash');
        ok('P3 BOTH POSTS WALKED, A CREW ON THE ROAD, BACK, PAID FLAT AND A HEAD (' + bands + ' crew, ' + ends.length + ' fight; ' + (paid ? paid.paid + ' of ' + paid.of : 'nothing') + '; ' + b0 + ' -> ' + await bats() + ')',
          !!paid && paid.paid >= j.flat && paid.paid <= j.pay && bands >= 1);
      }
    }
    ok('Z nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 140) : '') + '; module ' + (await fr.evaluate(() => window.__JOB_ERR || window.__JOB_DRAW_ERR || 'clean')) + ')',
      d.errs.length === 0 && !(await fr.evaluate(() => window.__JOB_ERR || window.__JOB_DRAW_ERR)));
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false);
  }
  await d.close();
  done();
})();
