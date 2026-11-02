#!/usr/bin/env node
/* ROBOT [the robots fight] (ask row 277, Paolo 11/2), ON THE REAL SURFACE at the phone's profile (390 x 844 at 3x, touch):
   1. THE FIGHT: slices/BOHEMIA_FIGHT.html (the page every door of the demo opens), handed a party of THE MECHANIC's crew
      (party.faction 'machines', ours.enemy_tiers.mix.machines + heads: the mechanic and his robots), AUTO on. It reads what the
      page drew: every robot drawn (UI.robotDrawn) and in which clip (UI.robotClips: idle, walk, swing, hit, fall), the sheet each
      enemy stands in (lookOf), and the robot's size against a man's (the same ruler: height_m and the rig scale), and photographs
      the board at the start (the robots idling), mid fight, and at the end (the robots down).
   2. THE MAP: the demo itself (BOHEMIA_DEMO.html), pinched out to the map; the nearest roaming party is told its roll came back as
      the machines (MAP_PARTY_CREW, the value cityHandOver writes from the fight's own roll at the meet), and the map is photographed
      with that party drawn as the MECHANIC and his robot.
   Writes records/target/ROBOT_THE_ROBOTS_FIGHT_*.png and records/target/ROBOT_THE_ROBOTS_FIGHT_PROOF.json.
   Run: node tools/bohemia_robot_the_robots_fight_proof.js */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const T = (n) => path.join(ROOT, 'records/target/ROBOT_THE_ROBOTS_FIGHT_' + n + '.png');
(async () => {
  const MAP_ONLY = process.argv.indexOf('--map-only') >= 0, PJ = path.join(ROOT, 'records/target/ROBOT_THE_ROBOTS_FIGHT_PROOF.json');
  const out = MAP_ONLY && fs.existsSync(PJ) ? JSON.parse(fs.readFileSync(PJ, 'utf8')) : { fight: null, map: null };
  /* ---- 1. the fight ---- */
  if (!MAP_ONLY) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait',
      arm: "window.FIGHT_OPTS={seed:7,speed:2,auto:true,party:{faction:'machines',count:5,days:40,difficulty:0}}" });
    await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.round, null, { timeout: 90000 });
    await d.page.waitForTimeout(2500);
    const who = await d.page.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ kind: u.kind, name: u.name, look: lookOf(u).file, kindOfLook: lookOf(u).kind, hp: u.hp, machine: !!u.machine })));
    await d.page.screenshot({ path: T('FIGHT_START') });
    let mid = false, t0 = Date.now(), r = null;
    while (Date.now() - t0 < 240000) {
      r = await d.page.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result, round: FIGHT.S.round, drawn: UI.robotDrawn || 0, clips: UI.robotClips || {},
        down: FIGHT.S.units.filter(u => u.side === 'them' && u.machine && u.dead).length }));
      if (!mid && r.clips.swing && r.clips.hit) { await d.page.screenshot({ path: T('FIGHT_MID') }); mid = true; }
      if (r.over) break;
      await d.page.waitForTimeout(400);
    }
    await d.page.waitForTimeout(1500);
    await d.page.screenshot({ path: T('FIGHT_END') });
    const size = await d.page.evaluate(() => { const R = DB.rig.looks.robot, M = DB.rig.looks.you;
      return { robot: { height_m: R.height_m, cell: [R.w, R.h], foot: R.foot }, man: { height_m: M.height_m, cell: [M.w, M.h], foot: M.foot }, ruler: DB.rig.ruler, scale: rigScale() }; });
    const last = await d.page.evaluate(() => ({ clips: UI.robotClips || {}, drawn: UI.robotDrawn || 0, faceOrder: DB.rig.faces.order.indexOf('robot'), row: DB.read['ours.robot'] || null }));
    out.fight = { enemies: who, result: r, mid_shot: mid, size: size, robot_clips_drawn: last.clips, robot_draws: last.drawn, face_index: last.faceOrder, stats_row_read: last.row, errors: d.errs ? d.errs.slice(0, 5) : [] };
    await d.close();
  }
  /* ---- 2. the map ---- */
  {
    const d = await open({ profile: 'phone_portrait' });
    await d.toMap();
    await d.page.waitForTimeout(2500);
    /* the parties the map itself drew this frame (MAP_DREW.partyAt, its own list), away from his own square; at the opening none
       is on the glass (measured: two stand at his own town, just leaving, the rest off the screen), so the crew travels toward the
       nearest the way a tap on the map sends it (travelTo, travelGoes: the tap's own calls) and stops the moment the map draws one */
    const drawn = () => d.fr.evaluate(() => { const A = (MAP_DREW && MAP_DREW.partyAt) || {};
      return Object.keys(A).filter(k => Math.max(Math.abs(A[k][0] - city.x), Math.abs(A[k][1] - city.y)) >= 8).map(k => ({ id: k, at: A[k] })); });   /* eight squares: never behind his own crew */
    /* for the test every roaming party's roll is set to the machines (the value cityHandOver writes from the fight's own roll at
       the meet), so whichever party the map draws first is drawn as that crew; then the crew travels the way a tap sends it, and
       the glass is photographed the instant the map has drawn one two squares or more from him (the game moves on: arriving in a
       town opens its screen) */
    /* and the fog and the sight lines are lifted for the shot (at this zoom the whole valley is on the glass and his crew is drawn
       forty points tall, so a party in his sight stands behind him: measured three times) */
    await d.fr.evaluate(() => { mapRobotSet(); (partiesAll() || []).forEach(p => { if (p && p.id != null) MAP_PARTY_CREW[String(p.id)] = 'machines'; });
      try { SIGHT.on = false; FOG.on = false; } catch (_e) {} });
    await d.page.waitForTimeout(1500);
    let list = await drawn(), waited = 0;
    if (!list.length) await d.fr.evaluate(() => { const pp = (partiesAll() || []).filter(p => p && p.at && Math.max(Math.abs((p.at.x | 0) - city.x), Math.abs((p.at.y | 0) - city.y)) >= 3);
      pp.sort((a, b) => Math.max(Math.abs(a.at.x - city.x), Math.abs(a.at.y - city.y)) - Math.max(Math.abs(b.at.x - city.x), Math.abs(b.at.y - city.y)));
      if (pp[0]) { travelTo(0, 0, [pp[0].at.x | 0, pp[0].at.y | 0]); travelGoes(); } });
    while (!list.length && waited < 60000) { await d.page.waitForTimeout(100); waited += 100; list = await drawn(); }
    const drew = await d.fr.evaluate((id) => { const h = (MAP_PARTY_HIT || []).filter(x => String(x.id) === String(id))[0];
      return { robots: (MAP_DREW && MAP_DREW.art && MAP_DREW.art.robots) || 0, robotSheet: MAP_ROBOT.state, packed: !!MAP_ROBOT.packed, box: h ? h.box : null, czoom: CZOOM, k: MAP_PEOPLE_K, mode: MODE }; }, list[0] ? list[0].id : '');
    const cv = await d.fr.evaluate(() => { const c = document.querySelector('canvas'); const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    const fb = await (await d.fr.frameElement()).boundingBox();
    await d.page.screenshot({ path: T('MAP'), clip: { x: fb.x + cv.x, y: fb.y + cv.y, width: cv.w, height: cv.h } });
    await d.fr.evaluate(() => { try { travelStop(); } catch (_e) {} });
    const pick = list[0] || null;
    out.map = { party: pick, travelled_ms: waited, drew: drew, shot: 'records/target/ROBOT_THE_ROBOTS_FIGHT_MAP.png' };
    await d.close();
  }
  fs.writeFileSync(path.join(ROOT, 'records/target/ROBOT_THE_ROBOTS_FIGHT_PROOF.json'), JSON.stringify(out, null, 1) + '\n');
  console.log(JSON.stringify(out, null, 1).slice(0, 2500));
})().catch(e => { console.error(e); process.exit(1); });
