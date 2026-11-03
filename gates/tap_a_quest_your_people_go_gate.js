#!/usr/bin/env node
/* ============================================================================
   TAP A QUEST, YOUR PEOPLE GO GATE (WORLD 8, 11/3/26; rule 376(e), ask line 404). Code: slices/bohemia_quest_travel.js,
   window.BOH_TRAVEL_TO_QUEST(questId) (the phone's quest card calls it; UI 7).

   On the demo, his phone, a new game, through the one driver (node gates/tap_a_quest_your_people_go_gate.js [profile]):
     Q1 a hunt taken at the start town's board: one call and the party marker moves on the map (the clock runs)
     Q2 THE NEAREST BY THE ROADS: of the hunt's packs, the one he sets off to is the shortest on the map's roads (every pack timed)
     Q3 THE CAMERA COMES IN CLOSE while he travels: the zoom eases to the quest's travel stop and the party stays held on the glass
     Q3b THE ZOOM WAITS FOR THE MAP: no frame jumps it more than a small step, and it holds until the ground round him is painted
     Q4 A PINCH TAKES IT BACK: a real two-finger pinch mid-ease stops it at once, and it never comes back on its own
     Q5 THE NEXT TAP, THE NEXT CLOSEST: standing at a pack, the call goes to another
     Q6 ON ARRIVAL THE SETTLEMENT OPENS: a quest whose next place is a town (an offer on the phone: its board; else a job taken to
        carry to a town) opens that town's screen when he gets there
     Q8 a quest in the open (the hunt's pack) is the meeting itself when he reaches it
     Q7 the call says no plainly: an unknown id, and inside a town's screen
     C1 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  const d = await open({ profile: prof, fog: true, engage: true, beforeTap: async (p) => {
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BOH_TRAVEL_TO_QUEST && !!window.BohemiaBoardShelf).catch(() => false)) break; }
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(1500);
  /* Q7 first: inside the start town's screen the call says so */
  const q7a = await fr.evaluate(() => { const was = LOOP.frame && LOOP.frame.style.display; if (LOOP.frame) LOOP.frame.style.display = 'block'; const r = BOH_TRAVEL_TO_QUEST('no-such-quest'); const r2 = BOH_TRAVEL_TO_QUEST((LOOP.held[0] || {}).id || 'x'); if (LOOP.frame) LOOP.frame.style.display = was;
    let r3 = null; try { loopClose(); } catch (e) {} r3 = BOH_TRAVEL_TO_QUEST('no-such-quest'); return [r.why, r2.why, r3.why]; });
  /* the town he starts at, and where he stands */
  const home = await fr.evaluate(() => { try { loopClose(); } catch (e) {} const bs = ctBases(); let best = null, bd = 1e9;
    for (const n in bs) { const dd = Math.max(Math.abs(bs[n].x - city.x), Math.abs(bs[n].y - city.y)); if (dd < bd) { bd = dd; best = n; } } return { name: best, at: [city.x, city.y] }; });
  /* a hunt taken at the board of the town he stands at (the board's own take) */
  const takeHunt = () => fr.evaluate((home) => {
    try { loopClose(); } catch (e) {}
    const bs = ctBases(); const best = { name: home.name, x: bs[home.name].x, y: bs[home.name].y }; city.x = home.at[0]; city.y = home.at[1]; CITY_GLIDE.tx = null;
    const shelf = (BohemiaBoardShelf.shelf && BohemiaBoardShelf.shelf().offers) || [];
    const hunts = shelf.filter(o => BohemiaJobKinds.kindOf(o) === 'hunt-kind');
    for (const o of hunts) { LOOP.open = best; let okk = false; try { okk = loopTakeContract(o); } catch (e) {} try { loopClose(); } catch (e) {} LOOP.open = null;
      const j = LOOP.held.filter(h => h.id === o.id)[0]; if (okk && j && (j.packs || []).length >= 2) return { id: j.id, packs: j.packs.length, stage: j.stage, town: best.name, at: [city.x, city.y] }; }
    return { none: true, hunts: hunts.length };
  }, home);
  const clear = () => fr.evaluate(() => { try { travelStop(); } catch (e) {} try { if (LOOP.frame && LOOP.frame.style.display === 'block') loopClose(); } catch (e) {}
    try { if (typeof MEET !== 'undefined' && MEET && MEET.up) { const u = MEET.up; MEET.up = null; try { u.el && u.el.remove(); } catch (e) {} meetFallBack(u.msg); } } catch (e) {} try { render(); } catch (e) {} });   /* FALL BACK, the card's own way out */
  /* Q6: a quest whose next place is a town: an offer on the phone goes to its board, or a job taken to carry to a town; the town's
     screen opens on arrival */
  await clear();
  const q6a = await fr.evaluate((home) => { setZoomAt(1); try { camHold(); } catch (e) {} if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1);
    const sh = ((window.__PHONE_BOARD && __PHONE_BOARD.shown) || []).filter(a => a && a.place && String(a.place).toUpperCase() !== String(home).toUpperCase());
    let id = sh.length ? sh[0].id : null, how = 'an offer on the phone';
    if (!id) { const shelf = (BohemiaBoardShelf.shelf && BohemiaBoardShelf.shelf().offers) || []; const bs = ctBases(); const T = { name: home, x: bs[home].x, y: bs[home].y };
      for (const o of shelf.filter(o => /^(haul-caravan|carry)$/.test(BohemiaJobKinds.kindOf(o)))) { LOOP.open = T; let k = false; try { k = loopTakeContract(o); } catch (e) {} try { loopClose(); } catch (e) {} LOOP.open = null;
        const j = LOOP.held.filter(h => h.id === o.id)[0]; const n = j && BohemiaJobKinds.nextOf(j); if (k && n && n.town) { id = j.id; how = 'a ' + j.plays + ' to ' + n.name; break; } } }
    if (!id) return null; const r = BOH_TRAVEL_TO_QUEST(id); return { id, how, r }; }, home.name);
  /* Q4 on the way: a pinch mid-ease takes the camera back at once, and it never comes back on its own */
  await page.waitForTimeout(150);
  const vp = page.viewportSize() || { width: 390, height: 844 }, cx = vp.width / 2, cy = vp.height * 0.3;   /* the map fills the glass */
  if (prof === 'computer') { await page.mouse.move(cx, cy); await page.mouse.wheel(0, 240); }
  else { for (let i = 0; i <= 8; i++) { const rr = 110 - 70 * i / 8; await d.cdp.send('Input.dispatchTouchEvent', { type: i === 0 ? 'touchStart' : 'touchMove', touchPoints: [{ x: cx - rr, y: cy, id: 1 }, { x: cx + rr, y: cy, id: 2 }] }); await page.waitForTimeout(20); }
    await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  const g1 = await fr.evaluate(() => ({ tw: TW, Q: BohemiaQuestTravel.state().on, given: BohemiaQuestTravel.state().given | 0 }));
  await page.waitForTimeout(1500);
  const g2 = await fr.evaluate(() => ({ tw: TW }));
  ok('Q4 ' + prof + ': a pinch takes the camera back at once, and it never comes back on its own', !!q6a && q6a.r.ok && !g1.Q && g1.given >= 1 && Math.abs(g2.tw - g1.tw) <= 2 && g2.tw < 200,
     (q6a ? 'the call ' + (q6a.r.ok ? 'went' : q6a.r.why) : 'no quest') + '; given ' + g1.given + ', a block ' + Math.round(g1.tw) + ' px then ' + Math.round(g2.tw));
  await fr.evaluate(() => { try { travelSpeedSet(4); } catch (e) {} });
  let opened = null;
  if (q6a && q6a.r.ok) for (let i = 0; i < 160 && !opened; i++) { await page.waitForTimeout(500);
    const st = await fr.evaluate(() => ({ open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), name: LOOP.open && LOOP.open.name, meet: !!(typeof MEET !== 'undefined' && MEET && MEET.up), trav: !!(TRAVEL && TRAVEL.path), fight: !!LOOP.fighting }));
    if (st.open) opened = st; else if (st.meet || (!st.trav && !st.fight)) { await clear(); await fr.evaluate((id) => { if (!TRAVEL) BOH_TRAVEL_TO_QUEST(id, { follow: false }); }, q6a.id); } }
  ok('Q6 ' + prof + ': on arrival the settlement opens', !!opened && String(opened.name || '').toUpperCase() === String(q6a.r.name || '').toUpperCase(),
     q6a ? q6a.how + ': to ' + q6a.r.name + ' (' + q6a.r.mins + ' min): ' + (opened ? 'opened ' + opened.name : 'not opened') : 'no quest at a town');
  /* Q3 + Q3b on a second trip, to another town's board from a road 20 to 40 blocks out (a hunt's wolves can end its trip three
     blocks out, a near town is reached first, and the zoom rightly stops with the trip): every frame of the ease logged in the page, its zoom, the ground round him painted or not, the hold */
  await clear();
  const cam = await fr.evaluate((home) => { city.x = home.at[0]; city.y = home.at[1]; CITY_GLIDE.tx = null;   /* from where the game began, as the first trip */
    setZoomAt(1); try { camHold(); } catch (e) {} if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { render(); } catch (e) {}
    const bs = ctBases(), here = home.name;
    const up = (k) => String(k || '').toUpperCase(), B = {}; for (const k in bs) B[up(k)] = bs[k];
    const far = (a) => B[up(a.place)] ? Math.max(Math.abs(B[up(a.place)].x - city.x), Math.abs(B[up(a.place)].y - city.y)) : -1;
    const sh = ((window.__PHONE_BOARD && __PHONE_BOARD.shown) || []).filter(a => a && a.place && up(a.place) !== up(here)).sort((a, b) => far(b) - far(a));   /* the longest trip on the phone */
    /* every zoom step the ease takes, with whether the ground round him was painted at that moment (the ease's own question) */
    if (!window.__SZ0) window.__SZ0 = window.setZoomAt; window.__SZ = [];
    window.setZoomAt = function (z) { try { if (BohemiaQuestTravel.state().on) __SZ.push([CZOOM, z, BohemiaQuestTravel.ready() ? 1 : 0]); } catch (e) {} return __SZ0.apply(this, arguments); };
    window.__CAMGO = (id) => { const r = BOH_TRAVEL_TO_QUEST(id); if (!r.ok) return r;   /* the call, and every frame of its ease logged */
      window.__EZ = []; const Q = BohemiaQuestTravel.state(); let k = 0;
      const tick = () => { __EZ.push({ tw: TW, want: BohemiaQuestTravel.ready() ? 0 : 1, held: !!(typeof CAMF !== 'undefined' && CAMF.on) }); if (++k < 3000 && (Q.on || k < 3)) requestAnimationFrame(tick); else __EZ.done = true; };
      requestAnimationFrame(tick); return r; };
    for (const o of sh) { const T = B[up(o.place)]; if (!T) continue; let st = null, sd = -1;   /* a road 20 to 40 blocks out from that town: a trip long enough to watch */
      for (let y = 2; y < om.n - 2; y++) for (let x = 2; x < om.n - 2; x++) { const dd = Math.max(Math.abs(x - T.x), Math.abs(y - T.y));
        if (dd < 20 || dd > 40 || dd <= sd || !cityWalkable(x, y) || loopTownAt(x, y, 2)) continue; st = [x, y]; sd = dd; }
      if (!st) continue; try { travelStop(); } catch (e) {} city.x = st[0]; city.y = st[1]; CITY_GLIDE.tx = null; try { camHold(); render(); } catch (e) {}
      const at = [city.x, city.y]; const r = __CAMGO(o.id); if (r.ok) return { id: o.id, at, r }; }
    return null; }, home);
  const tw = [];
  if (cam) for (let i = 0; i < 4; i++) { await page.waitForTimeout(300); tw.push(await fr.evaluate(() => ({ held: !!(typeof CAMF !== 'undefined' && CAMF.on), at: [city.x, city.y] }))); }
  if (cam) {
    /* then the clock paused (his own pause: the party stands, the painter catches up round him) until the zoom is there */
    let again = 0; const stops = [];
    for (let a = 0; a < 6; a++) {
      await fr.evaluate(() => { try { travelSpeedSet(0); } catch (e) {} });
      for (let i = 0; i < 240; i++) { if (await fr.evaluate(() => !!(window.__EZ && __EZ.done))) break; await page.waitForTimeout(500); }
      const why = await fr.evaluate(() => BohemiaQuestTravel.state().ended === 'there' ? 'there' : (LOOP.frame && LOOP.frame.style.display === 'block') ? 'a town opened: ' + (LOOP.open && LOOP.open.name) : null);
      if (why) { if (why !== 'there') stops.push(why); break; }
      /* the trip stopped before the zoom was there (a road's event): he answers it and taps the quest again, as a player does */
      stops.push(await fr.evaluate(() => (typeof MEET !== 'undefined' && MEET && MEET.up) ? 'a meeting' : LOOP.fighting ? 'a fight' : TRAVEL ? 'walking' : 'stood at ' + city.x + ',' + city.y));
      await clear(); again++;
      await fr.evaluate((id) => { try { travelSpeedSet(TRAVEL_SPEED_LAST || 1); } catch (e) {} __CAMGO(id); }, cam.id); await page.waitForTimeout(600); }
    const ez = await fr.evaluate(() => { window.setZoomAt = __SZ0;
      return { f: __EZ.map(e => [Math.round(e.tw), e.want, e.held ? 1 : 0]), sz: __SZ.filter(q => Math.abs(q[1] - q[0]) > 1e-6), ended: BohemiaQuestTravel.state().ended, waited: Math.round(BohemiaQuestTravel.state().held), tw: Math.round(TW) }; });
    await fr.evaluate(() => { try { travelSpeedSet(TRAVEL_SPEED_LAST || 1); } catch (e) {} try { travelStop(); } catch (e) {} });
    let jump = 1; for (const q of ez.sz) jump = Math.max(jump, q[1] / q[0]);
    const blur = ez.sz.filter(q => !q[2]).length;   /* zoom steps taken while the ground round him was not yet painted at the detail of the zoom it stood at */
    const moved = tw.some(q => q.at[0] !== cam.at[0] || q.at[1] !== cam.at[1]);
    ok('Q3 ' + prof + ': the camera comes in close while he travels, the party held', moved && Math.abs(ez.tw - cam.r.follow) <= 3 && ez.ended === 'there' && ez.f.every(e => e[2]) && tw.every(q => q.held),
       'to ' + cam.r.name + ': a block ' + ez.f[0][0] + ' to ' + ez.tw + ' px in ' + ez.f.length + ' frames (the travel stop ' + cam.r.follow + ', ended ' + ez.ended + (stops.length ? '; ' + stops.join(', ') + (again ? ', tapped again ' + again + ' time(s)' : '') : '') + '), moving ' + moved + ', held ' + (ez.f.every(e => e[2]) && tw.every(q => q.held)));
    ok('Q3b ' + prof + ': the zoom waits for the map (no frame jumps it, it holds while the map paints)', ez.sz.length >= 10 && jump <= 1.35 && blur === 0,
       ez.sz.length + ' steps, the biggest x' + jump.toFixed(2) + ', ' + blur + ' taken before the ground round him was painted, held ' + ez.waited + ' ms for the painter');
  } else ok('Q3 ' + prof + ': the camera comes in close while he travels', false, 'no offer at another town on the phone');
  /* the hunt, taken now at the start town's board (its wolves come for him from the moment he takes it) */
  await clear();
  const took = await takeHunt();
  if (took.none) { ok('Q1 ' + prof + ': a hunt to tap', false, 'no hunt with two packs on the board (' + took.hunts + ' hunts)'); await d.close(); return; }
  /* Q5 first (before the walk: the pack's own fight cannot get in the way): standing at the pack the call chooses, the next call
     goes to another; then back to the start town, the choice forgotten */
  const q5 = await fr.evaluate((a) => { const r0 = BOH_TRAVEL_TO_QUEST(a.id, { follow: false }); try { travelStop(); } catch (e) {}
    if (!r0.ok) return { why: r0.why }; city.x = r0.to[0]; city.y = r0.to[1]; CITY_GLIDE.tx = null;
    const r = BOH_TRAVEL_TO_QUEST(a.id, { follow: false }); try { travelStop(); } catch (e) {}
    city.x = a.at[0]; city.y = a.at[1]; CITY_GLIDE.tx = null; BohemiaQuestTravel.state().done[a.id] = {}; try { render(); } catch (e) {}
    return { first: r0.to, next: r.to, ok: r.ok, why: r.why }; }, { id: took.id, at: took.at });
  ok('Q5 ' + prof + ': the next tap goes to the next closest', !!q5.next && (q5.next[0] !== q5.first[0] || q5.next[1] !== q5.first[1]), JSON.stringify(q5));
  /* Q1 + Q2: one call on the hunt, from the start town */
  await fr.evaluate(() => { setZoomAt(1); try { camHold(); } catch (e) {} try { travelSpeedSet(2); } catch (e) {} render(); });
  const at0 = await fr.evaluate(() => [city.x, city.y]);
  const r1 = await fr.evaluate((id) => BOH_TRAVEL_TO_QUEST(id), took.id);
  const hw = [];
  for (let i = 0; i < 12; i++) { await page.waitForTimeout(300); hw.push(await fr.evaluate(() => ({ at: [city.x, city.y] }))); }
  const moved = hw.some(q => q.at[0] !== at0[0] || q.at[1] !== at0[1]);
  ok('Q1 ' + prof + ': one call and the party marker moves', r1.ok && moved, JSON.stringify({ to: r1.to, act: r1.act, mins: r1.mins }) + ', from ' + at0 + ' to ' + hw[hw.length - 1].at);
  const minT = r1.timed ? Math.min.apply(null, r1.timed.filter(t => t.mins != null).map(t => t.mins)) : -1;
  ok('Q2 ' + prof + ': the nearest pack BY THE ROADS', r1.of >= 2 && r1.mins === minT, (r1.timed || []).map(t => t.key + ' ' + t.mins + ' min').join(', ') + '; went to ' + r1.to + ' (' + r1.mins + ' min)');
  /* Q8: a quest in the open is the meeting itself: he walks on to the pack and the meeting (or the fight) comes */
  let met = null;
  for (let i = 0; i < 160 && !met; i++) { await page.waitForTimeout(500);
    const st = await fr.evaluate((id) => ({ meet: !!(typeof MEET !== 'undefined' && MEET && MEET.up), fight: !!LOOP.fighting, why: (window.__LAST_HANDOVER && window.__LAST_HANDOVER.why) || '', trav: !!(TRAVEL && TRAVEL.path), id }), took.id);
    if (st.meet || st.fight || st.why.indexOf(took.id) >= 0) met = st; else if (!st.trav) await fr.evaluate((id) => BOH_TRAVEL_TO_QUEST(id, { follow: false }), took.id); }
  ok('Q8 ' + prof + ': a quest in the open is the meeting itself', !!met, met ? JSON.stringify(met) : 'no meeting in 80 s');
  ok('Q7 ' + prof + ': the call says no plainly (in a town; an unknown quest)', q7a[0] === 'in a town' && q7a[1] === 'in a town' && q7a[2] === 'no quest', JSON.stringify(q7a));
  ok('C1 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 2).join(' | '));
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTAP A QUEST, YOUR PEOPLE GO: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
