/* A PACK HE RAN FROM LETS HIM GO (WORLD 11, 11/6/26, rule 413(c)(f), ask line 465; RE-AIMED 11/7 BY RUN SEVEN, who owns 413(c)).
   Paolo 11/6: 'if I retreat and run away, I should be fully able to get away from a battle'.
   THE CARCASS AND THE VULTURES' carcass and vulture legs (C0 to C8, V1 to V5) are GONE from this file with the build they tested: he
   voted it NO (11/6, rule 426(e)) and WORLD 12 rebuilt it as one tap into the stash, checked by gates/the_kill_goes_in_the_stash_gate.js.
   What stays here is the pack's half, on the demo he plays (phone held up):
     P1 a pack of beasts he fell back from (the meet card's FALL BACK) has lost him for good
     P2 camped two blocks from that pack for two game days: no card from it, it never comes within two blocks
     P3 walking past it for hours, not at it: no card from it
     P4 THE BEFORE (PACK_LETS_GO off): the same camp, and the pack's card came back on its own
     P5 his own chase on it asks first (the meet card), never a fight on its own
     R  nothing threw on any page.
   node gates/the_carcass_and_the_vultures_gate.js */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms, every) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(every || 250); } return null; }
let pass = 0, fail = 0, d = null;
const errs = [];
function ok(name, good, why) { if (good) pass++; else fail++; console.log('  ' + (good ? 'ok  ' : 'FAIL') + ' ' + name + (why ? '  [' + why + ']' : '')); }
const OFF_TOWN = () => { const N = om.n; let best = null, bd = 1e9;
  for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) { if (!cityWalkable(x, y)) continue; let near = false;
    for (let a = -5; a <= 5 && !near; a++) for (let b = -5; b <= 5 && !near; b++) if (townGround(x + a, y + b) || townSafeAt(x + a, y + b)) near = true;
    if (near) continue; let open = 0; for (const q of DIRS) if (cityWalkable(x + q[0], y + q[1])) open++; if (open < 6) continue;
    const dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (dd < bd) { bd = dd; best = [x, y]; } }
  if (best) { try { travelStop(); } catch (e) {} city.x = best[0]; city.y = best[1]; try { camHold(); render(); } catch (e) {} } return best; };
const CLEAN = () => { try { if (LOOP.open) loopClose(); } catch (e) {} try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} try { if (window.MEET && MEET.up) MEET_DONE(false); } catch (e) {} try { contactClear(); } catch (e) {} try { travelStop(); } catch (e) {} };
const NOW = () => T.day * 1440 + T.min;


(async () => {
  console.log('\nA PACK HE RAN FROM LETS HIM GO (rule 413(c)): the demo, phone_portrait');
  d = await D.open({ profile: 'phone_portrait' });
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const fr = d.fr, p = d.page;
  await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaCarcass && BohemiaCarcass.ready()), 60000);
  await fr.evaluate(CLEAN); await fr.evaluate(() => { BohemiaCarcass.reset(); window.GNOW = () => T.day * 1440 + T.min; });
  const at = await fr.evaluate('(' + OFF_TOWN + ')()');
  if (!at) { ok('a block off any town\'s ground', false, 'none'); return finish(); }

  /* ---------------- THE PACK THAT LETS HIM GO ---------------- */
  console.log('\nA PACK OF BEASTS HE RAN FROM');
  async function packRun(before) {
    await fr.evaluate(CLEAN); await fr.evaluate(() => { BohemiaCarcass.reset(); LOOP.held = LOOP.held.filter(j => !/^gate-pack/.test(j.id)); MEET_BACK.list = []; });
    await fr.evaluate('(' + OFF_TOWN + ')()');
    const setup = await fr.evaluate((bf) => { BohemiaJobKinds.letGo.on = !bf;
      const bs = ctBases(); let tn = null, bd = 1e9; for (const n in bs) { const b = bs[n]; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd < bd) { bd = dd; tn = { name: n, x: b.x | 0, y: b.y | 0 }; } }
      const job = { id: 'gate-pack-' + Date.now(), title: 'Hunt the wolves', pay: 40, skulls: 1 }; let made = false; try { made = BohemiaJobKinds.make(job, { id: 'qd-aa15', title: 'Hunt the wolves' }, tn, null, false); } catch (e) { made = String(e); }
      if (!job.packs || !job.packs.length) return { made, why: 'no pack made' };
      job.packs = job.packs.slice(0, 1); const pk = job.packs[0]; pk.x = city.x + 1; pk.y = city.y; pk.home = [pk.x, pk.y]; pk.n = 3; LOOP.held.push(job);
      if (!cityWalkable(pk.x, pk.y)) { pk.x = city.x; pk.y = city.y + 1; pk.home = [pk.x, pk.y]; }
      window.__MEET_UP = null; const before = JSON.stringify(window.__MEET_LAST || null);
      meetWalk(() => mapStepWorld());   /* his step: the pack beside him is the fight, the card first */
      const up = !!(window.MEET && MEET.up); if (up) MEET_DONE(false);   /* FALL BACK */
      return { made, id: job.id, up, shy: pk.shy, pack: [pk.x, pk.y], at: [city.x, city.y], fell: window.__MEET_FELL_BACK | 0 }; }, !!before);
    return setup;
  }
  async function campNear(id, hours, tag) {
    await fr.evaluate((id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j.packs[0]; let best = null;
      for (let y = pk.y - 3; y <= pk.y + 3 && !best; y++) for (let x = pk.x - 3; x <= pk.x + 3 && !best; x++) if (Math.max(Math.abs(x - pk.x), Math.abs(y - pk.y)) === 2 && cityWalkable(x, y) && !townGround(x, y)) best = [x, y];
      if (best) { city.x = best[0]; city.y = best[1]; } try { camHold(); render(); } catch (e) {} }, id);
    const made = await fr.evaluate(() => { try { return !!BohemiaMapCamp.make(); } catch (e) { return false; } });
    const t0 = await fr.evaluate(NOW); let cards = 0, fights = 0, minD = 99, broke = 0;
    for (let i = 0; i < hours * 2 + 40; i++) { await sleep(500);
      const s = await fr.evaluate((id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j && j.packs[0]; return { t: GNOW(), meet: !!(window.MEET && MEET.up), why: window.MEET && MEET.up ? String(MEET.up.msg.why) : null, fight: !!LOOP.fighting || !!window.parent.document.getElementById('fightFrame'), camp: !!(window.CAMP && CAMP.on), d: pk ? Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y)) : 99 }; }, id);
      if (s.d < minD) minD = s.d;
      if (s.meet && /^contract:gate-pack/.test(s.why)) { cards++; await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} }); }
      else if (s.meet) await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} });
      if (s.fight) fights++;
      if (!s.camp) { broke++; await fr.evaluate(() => { try { BohemiaMapCamp.make(); } catch (e) {} }); }
      if (s.t - t0 >= hours * 60) break; }
    const t1 = await fr.evaluate(NOW); await fr.evaluate(() => { try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} });
    return { made, hours: Math.round((t1 - t0) / 60), cards, fights, minD, broke };
  }
  const stillNear = (id) => fr.evaluate((id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j.packs[0]; pk.home = [pk.x, pk.y]; let best = null;
    for (let y = pk.y - 3; y <= pk.y + 3 && !best; y++) for (let x = pk.x - 3; x <= pk.x + 3 && !best; x++) if (Math.max(Math.abs(x - pk.x), Math.abs(y - pk.y)) === 2 && cityWalkable(x, y) && !townGround(x, y)) best = [x, y];
    if (best) { city.x = best[0]; city.y = best[1]; } try { travelStop(); } catch (e) {}
    let cards = 0, minD = 99, steps = 0; for (let i = 0; i < 1500; i++) { meetWalk(() => mapStepWorld()); steps++; minD = Math.min(minD, Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y)));
      if (window.MEET && MEET.up) { if (/^contract:gate-pack/.test(String(MEET.up.msg.why))) cards++; MEET_DONE(false); if (best) { city.x = best[0]; city.y = best[1]; } } if (LOOP.fighting) break; }
    return { steps, cards, minD, on: BohemiaJobKinds.letGo.on }; }, id);
  const pk = await packRun(false);
  ok('P1 a pack of beasts he fell back from has lost him for good', pk.up && pk.shy >= 1e8, JSON.stringify(pk));
  /* him beside the pack, standing still, then the world's own steps (a camp's, a rest's): the exact way it used to come back */
  const besideIt = (id, steps, wander) => fr.evaluate((a) => { const j = LOOP.held.filter(x => x.id === a.id)[0], pk = j.packs[0]; pk.home = [pk.x, pk.y]; let best = null;
    /* RE-AIMED 11/7 BY RUN SEVEN (413(c) is RUN SEVEN's): beside it on a side where the ground behind it is open, so giving ground is a step it can take (a pack against a wall has nowhere to go) */
    for (const q of [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (cityWalkable(pk.x + q[0], pk.y + q[1]) && !townGround(pk.x + q[0], pk.y + q[1]) && cityWalkable(pk.x - q[0], pk.y - q[1]) && cityWalkable(pk.x - 2 * q[0], pk.y - 2 * q[1])) { best = [pk.x + q[0], pk.y + q[1]]; break; }
    if (!best) for (const q of [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (cityWalkable(pk.x + q[0], pk.y + q[1]) && !townGround(pk.x + q[0], pk.y + q[1])) { best = [pk.x + q[0], pk.y + q[1]]; break; }
    if (best) { city.x = best[0]; city.y = best[1]; } try { travelStop(); } catch (e) {}
    let cards = 0, fights = 0, dist = []; for (let i = 0; i < a.steps; i++) { if (a.wander) { pk.x = city.x + 1; pk.y = city.y; if (!cityWalkable(pk.x, pk.y)) { pk.x = city.x; pk.y = city.y + 1; } }   /* its wander ends beside him */
      meetWalk(() => mapStepWorld()); dist.push(Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y)));
      if (window.MEET && MEET.up) { if (/^contract:gate-pack/.test(String(MEET.up.msg.why))) cards++; MEET_DONE(false); if (best) { city.x = best[0]; city.y = best[1]; } }
      if (window.parent.document.getElementById('fightFrame')) fights++; }
    return { steps: a.steps, cards, fights, dist: dist.slice(0, 8).join(' '), last: dist[dist.length - 1] }; }, { id, steps, wander: !!wander });
  if (pk.id) {
    /* P3: walking past it, not at it: journeys that go by the pack on to somewhere else, at his speed */
    const p3 = await fr.evaluate(async (id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j.packs[0]; let cards = 0, walks = 0, minD = 99, steps = 0, tried = [];
      try { travelStop(); } catch (e) {}
      const ring = []; for (let y = pk.y - 6; y <= pk.y + 6; y++) for (let x = pk.x - 6; x <= pk.x + 6; x++) if (Math.max(Math.abs(x - pk.x), Math.abs(y - pk.y)) === 6 && cityWalkable(x, y) && !townGround(x, y)) ring.push([x, y]);
      const pairs = []; ring.forEach((a, i) => { let best = null, bd = -1; ring.forEach(b => { const dd = Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])); if (dd > bd) { bd = dd; best = b; } }); if (best && bd >= 10 && i % Math.max(1, Math.floor(ring.length / 6)) === 0) pairs.push([a, best]); });
      for (const pr of pairs.slice(0, 4)) { const a = pr[0], b = pr[1];
        city.x = a[0]; city.y = a[1]; const go = travelTo(0, 0, b); tried.push(!!go); if (!go) continue; walks++; travelSpeedSet(4);
        for (let k = 0; k < 600 && TRAVEL; k++) { await new Promise(r => setTimeout(r, 25)); minD = Math.min(minD, Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y))); steps++;
          if (window.MEET && MEET.up) { if (/^contract:gate-pack/.test(String(MEET.up.msg.why))) cards++; MEET_DONE(false); } }
        try { travelStop(); } catch (x) {} }
      return { walks, cards, minD, polls: steps, tried, shy: pk.shy >= 1e8 }; }, pk.id);
    ok('P3 walking past it at his speed, not at it: no card from it', p3.walks >= 2 && p3.cards === 0 && p3.shy, JSON.stringify(p3));
    /* P5: his own chase on it asks (the meet card), never a fight on its own: a tap on the pack (the job's own chase) and the walk after it */
    const p5 = await fr.evaluate(async (id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j.packs[0]; try { travelStop(); } catch (e) {}
      let st0 = null; for (const q of [[4, 0], [0, 4], [-4, 0], [0, -4]]) if (cityWalkable(pk.x + q[0], pk.y + q[1])) { st0 = [pk.x + q[0], pk.y + q[1]]; break; } if (st0) { city.x = st0[0]; city.y = st0[1]; }
      j.chase = pk.id; travelTo(0, 0, [pk.x, pk.y]); travelSpeedSet(4); let up = false, why = null, page = false;
      for (let k = 0; k < 400 && !up; k++) { await new Promise(r => setTimeout(r, 25)); if (window.MEET && MEET.up) { up = true; why = String(MEET.up.msg.why); } if (window.parent.document.getElementById('fightFrame')) page = true; if (!TRAVEL && !up && k > 40) break; }
      if (up) MEET_DONE(false); try { travelStop(); } catch (e) {}
      j.chase = null; return { up, why, fightPage: page, d: Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y)) }; }, pk.id);
    ok('P5 his own chase on it asks first (the meet card), never a fight on its own', p5.up && /^contract:gate-pack/.test(p5.why || '') && !p5.fightPage, JSON.stringify(p5));
    const p2 = await campNear(pk.id, 48, 'after');
    ok('P2 camped two blocks from that pack for two game days: no card from it, never within two blocks', p2.made && p2.hours >= 48 && p2.cards === 0 && p2.fights === 0 && p2.minD >= 2, JSON.stringify(p2));
    const p2b = await stillNear(pk.id);
    ok('P2b standing two blocks off for 1500 of the world\'s steps (about ten game days): no card from it, never within two blocks', p2b.cards === 0 && p2b.minD >= 2, JSON.stringify(p2b));
    const p2c = await besideIt(pk.id, 12);
    ok('P2c he walks right up beside it and stands: it gives ground, no card from its own step', p2c.cards === 0 && p2c.fights === 0 && p2c.last >= 2, JSON.stringify(p2c));
    const p2d = await besideIt(pk.id, 12, true);
    ok('P2d its own wander ends beside him, twelve times over: no card from it, no fight', p2d.cards === 0 && p2d.fights === 0, JSON.stringify(p2d));
  }
  /* P4: THE BEFORE: the same pack, the hold off, him standing beside it, one of the world's steps */
  const pb = await packRun(true);
  if (pb.id) { const p4 = await besideIt(pb.id, 12, true);
    ok('P4 THE BEFORE (the pack\'s hold off): its wander ends beside him, and its card came back from its own step', p4.cards >= 1, JSON.stringify(p4));
  } else ok('P4 THE BEFORE', false, JSON.stringify(pb));
  await fr.evaluate(() => { BohemiaJobKinds.letGo.on = true; LOOP.held = LOOP.held.filter(j => !/^gate-pack/.test(j.id)); BohemiaCarcass.reset(); });
  ok('R nothing threw on any page', errs.length === 0, errs.slice(0, 3).join(' | '));
  return finish();
})().catch(async (e) => { console.error(e); try { await d.close(); } catch (x) {} process.exit(1); });
async function finish() {
  console.log('\nA PACK HE RAN FROM LETS HIM GO: ' + pass + ' passed, ' + fail + ' failed');
  try { await d.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
}
