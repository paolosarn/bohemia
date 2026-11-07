/* THE WHOLE LOOP PLAYS (PLUMBER 4, 11/5/26; rule 408(d), Paolo 11/4: 'let's make this quicker and never fuck up... every bug he finds gets a
   check that stays, and one smoke test of the whole loop (start, map, town, fight, camp, a level up) runs every build').
   ONE STRANGER'S GAME, START TO SAVE AND BACK, ON THE DEMO HE PLAYS (phone held up by default), every step pressed the way a player presses
   it where there is something to press (the title's NEW GAME and CONTINUE, the town's LEAVE, the event's choice, the card's ENGAGE, the
   end screen's LEAVE are real touches). IT STOPS AT THE FIRST STEP THAT BREAKS AND SAYS WHICH, LOUD: a smoke test that carries on past
   a broken step reports a second failure that is only the first one again.
     1 THE TITLE: it stands, and NEW GAME is pressed with a finger
     2 A NEW GAME: the door is behind him, the map's frame is up, he has a company
     3 A TOWN: the game opens in one; LEAVE (the phone's band, rule 368; a real tap) takes him to the map
     4 THE MAP: the map is up and drawing
     5 TRAVEL: a journey set at his speed crosses blocks and the day's clock moves
     6 AN EVENT: a road moment comes up (a face, its choices); a choice, a real tap, closes it and the journey goes on
     7 A FIGHT: a crew meets him, the card's ENGAGE (a real tap) opens the fight, the board and both sides on it
     8 THE VICTORY: the fight won, the end screen (the spoils) stands; its LEAVE, a real tap, is the map, nothing over it
     9 A SAVE: the game saves and the title has a game to continue
    10 RELOAD: the same phone opens the link again; CONTINUE (a real tap) is the same game: the same day and the same company
    11 nothing threw on any page
   node gates/the_whole_loop_plays_gate.js [--profile phone_portrait|computer] [--alpha] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const ai = process.argv.indexOf('--profile'), profile = ai > 0 ? process.argv[ai + 1] : 'phone_portrait';
const alpha = process.argv.includes('--alpha');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; }
let pass = 0, d = null, d2 = null;
const errs = [];
/* THE HEAP, STEP BY STEP (PLUMBER 6, 11/6, rule 418(b): 'the heap flat and under 200 MB through the whole loop'). Only when
   gates/the_heap_stays_flat_gate.js asks (BOHEMIA_HEAP_LOG=<file>): after every step that passed, the page's JavaScript heap
   (every same-origin frame shares it) read twice by the browser's own debugger: LIVE as it stands, and HELD after a forced
   garbage collection. The loop itself is not changed by it. BOHEMIA_HEAP_PLANT=<MB> plants that much in the page after the last
   step and reads again (the heap gate's proof that its instrument sees growth). */
const HEAP_LOG = process.env.BOHEMIA_HEAP_LOG || null, HEAP = [];
async function heapAt(label) {
  if (!HEAP_LOG) return;
  const dd = d2 || d; if (!dd || !dd.cdp) return;
  try {
    const live = await dd.cdp.send('Runtime.getHeapUsage');
    await dd.cdp.send('HeapProfiler.collectGarbage').catch(() => {});
    const held = await dd.cdp.send('Runtime.getHeapUsage');
    HEAP.push({ at: label, liveMb: +(live.usedSize / 1048576).toFixed(1), heldMb: +(held.usedSize / 1048576).toFixed(1), totalMb: +(held.totalSize / 1048576).toFixed(1), page: dd === d2 ? 'after the reload' : 'first boot' });
  } catch (e) { HEAP.push({ at: label, err: String(e && e.message || e).slice(0, 120) }); }
  try { require('fs').writeFileSync(HEAP_LOG, JSON.stringify({ profile, alpha, steps: HEAP, passed: pass }, null, 1)); } catch (e) {}
}
async function bye(code) { try { if (d2) await d2.page.close(); } catch (e) {} try { if (d) await d.close(); } catch (e) {} process.exit(code); }
async function step(n, what, fn) {
  let r; try { r = await fn(); } catch (e) { r = { ok: false, why: 'THREW: ' + String(e && e.message || e).slice(0, 200) }; }
  if (r && r.ok) { pass++; console.log('  ok   ' + n + ' ' + what + (r.why ? '  [' + r.why + ']' : '')); await heapAt(n + ' ' + what.split(':')[0]); return r; }
  console.log('  FAIL ' + n + ' ' + what + '  [' + ((r && r.why) || 'no answer') + ']');
  console.log('\n*** THE LOOP BROKE AT STEP ' + n + ': ' + what + ' ***\nTHE WHOLE LOOP PLAYS: ' + pass + ' passed, 1 failed (the steps after it were not reached)');
  await bye(1);
}
const tapAt = async (dd, x, y) => { if (profile === 'computer') await dd.page.mouse.click(x, y); else await dd.page.touchscreen.tap(x, y); };
const SCROLLED = [];   /* a button a finger only reaches after a scroll (rule 402 says none should be): named in the result */
async function tapIn(dd, frame, sel) {
  const h = await frame.$(sel); if (!h) return 'not there';
  const was = await h.boundingBox();
  await h.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {}); await sleep(200);
  const b = await h.boundingBox(); if (!b || b.width < 2) return 'not on the glass';
  if (was && Math.abs(was.y - b.y) > 2) SCROLLED.push(sel);
  if (frame !== dd.page.mainFrame() && await dd.page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!(e && e.closest && e.closest('#bohphone')); }, [b.x + b.width / 2, b.y + b.height / 2]).catch(() => false)) return 'under the phone';
  await tapAt(dd, b.x + b.width / 2, b.y + b.height / 2); return true;
}
const cityOf = (dd) => dd.page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));

(async () => {
  console.log('\nTHE WHOLE LOOP PLAYS (rule 408(d)): ' + (alpha ? 'the alpha' : 'the demo') + ', ' + profile + '\n');
  d = await D.open({ profile, alpha, fog: true });
  d.page.on('pageerror', e => errs.push('page: ' + String(e).slice(0, 140)));
  const fr = d.fr;
  await step(1, 'THE TITLE: it stands, and NEW GAME is pressed with a finger', async () => ({ ok: d.title.seen && d.title.via === 'new', why: JSON.stringify(d.title) }));
  await step(2, 'A NEW GAME: the door is behind him, the map\'s frame is up, he has a company', async () => {
    const co = await d.page.evaluate(() => { try { return ((BOH_START.picks() || {}).company || []).length; } catch (e) { return 0; } });
    return { ok: d.doorIsBehindUs() && !!fr && co > 0, why: 'door ' + (d.doorIsBehindUs() ? 'behind him' : 'STILL UP') + ', ' + co + ' in the company' };
  });
  await step(3, 'A TOWN: the game opens in one; its LEAVE (a real tap) takes him to the map', async () => {
    const inTown = await waitFor(() => fr.evaluate(() => !!(LOOP.open && LOOP.frame && LOOP.frame.style.display === 'block')), 30000);
    if (!inTown) return { ok: false, why: 'no town screen came up' };
    await sleep(1500);
    /* the town's LEAVE is on the phone's band now (UI 7, rule 368); a town screen that still carries its own #leave is pressed there */
    const t = await waitFor(async () => { if ((await tapIn(d, d.page.mainFrame(), '#bohphone .bpctx button.lv')) === true) return 'the phone\'s LEAVE';
      const sfr = d.page.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url())); return sfr && (await tapIn(d, sfr, '#leave')) === true ? 'the town\'s LEAVE' : null; }, 12000);
    const out = await waitFor(() => fr.evaluate(() => !(LOOP.open && LOOP.frame && LOOP.frame.style.display === 'block') && MODE === 'city'), 15000);
    return { ok: !!t && !!out, why: (t ? t + ' tapped' : 'NO LEAVE ON THE GLASS (the phone\'s band or the town\'s)') + '; ' + (out ? 'the map' : 'STILL IN THE TOWN') };
  });
  await step(4, 'THE MAP: the map is up and drawing', async () => {
    const a = await fr.evaluate(() => ONE_RENDER.drawn); await fr.evaluate(() => { MAP_GROUND.key = ''; render(); }); await sleep(600);
    const b = await fr.evaluate(() => ({ n: ONE_RENDER.drawn, mode: MODE, tw: TW }));
    return { ok: b.mode === 'city' && b.n > a, why: 'MODE ' + b.mode + ', a block ' + b.tw.toFixed(1) + ' px, ' + (b.n - a) + ' draws' };
  });
  await step(5, 'TRAVEL: a journey at his speed crosses blocks and the day\'s clock moves', async () => {
    const j = await fr.evaluate(() => { try { if (window.MEET) MEET.walk = 0; } catch (e) {} const N = om.n, C = [];
      for (let y = 2; y < N - 2; y += 2) for (let x = 2; x < N - 2; x += 2) { const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd >= 20 && dd <= 50 && cityWalkable(x, y) && !loopTownAt(x, y, 2)) C.push([x, y, dd]); }
      C.sort((p, q) => p[2] - q[2]);
      for (const c of C.slice(0, 40)) { const r = travelTo(0, 0, [c[0], c[1]]); if (r && TRAVEL && TRAVEL.path && TRAVEL.path.length >= 16 && !TRAVEL.path.slice(1).some(q => loopTownAt(q[0], q[1], 0))) { travelSpeedSet(1); return TRAVEL.path.length; } try { travelStop(); } catch (e) {} }
      return 0; });
    if (!j) return { ok: false, why: 'no journey could be set from where he stands' };
    const a = await fr.evaluate(() => ({ t: T.day * 1440 + T.min, left: TRAVEL ? TRAVEL.path.length - TRAVEL.i : 0 }));
    await sleep(3500);
    const b = await fr.evaluate(() => ({ t: T.day * 1440 + T.min, left: TRAVEL ? TRAVEL.path.length - TRAVEL.i : 0, meet: !!(window.MEET && MEET.up) }));
    return { ok: a.left - b.left >= 2 && b.t > a.t, why: (a.left - b.left) + ' blocks and ' + (b.t - a.t) + ' game minutes in 3.5 s' + (b.meet ? ' (a crew met him)' : '') };
  });
  await step(6, 'AN EVENT: a road moment comes up (a face and its choices); a choice (a real tap) closes it', async () => {
    await fr.evaluate(() => { try { if (window.MEET && MEET.up && window.MEET_DONE) MEET_DONE(false); } catch (e) {} });
    const id = await waitFor(() => fr.evaluate(() => { const R = window.BohemiaRoadEvents; if (!R || !R.ready()) return null;
      const e = (R.data().events.events || []).find(x => x && x.id && (x.opts || []).length && !/^quest:/.test(x.id)); return e ? e.id : null; }), 20000);
    if (!id) return { ok: false, why: 'the road events never loaded' };
    const fired = await fr.evaluate((id) => BohemiaRoadEvents.fire(id), id);
    const btn = await waitFor(() => fr.evaluate(() => { const b = [...document.querySelectorAll('#roadcard button[data-road]')].find(x => !x.disabled); if (!b) return null; const r = b.getBoundingClientRect(); return r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2, t: b.textContent.trim().slice(0, 40) } : null; }), 8000);
    if (!fired || !btn) return { ok: false, why: 'event ' + id + (fired ? ' fired, but no choice on the glass' : ' did not fire') };
    const fb = await (await fr.frameElement()).boundingBox();
    await tapAt(d, fb.x + btn.x, fb.y + btn.y);
    /* a choice tells him what came of it on a second card with GO ON (bohemia_road_events.js chose()); that is pressed too */
    const goOn = await waitFor(() => fr.evaluate((t0) => { const bs = [...document.querySelectorAll('#roadcard button[data-road]')]; if (bs.length !== 1 || bs[0].textContent.trim().slice(0, 40) === t0) return null;
      const r = bs[0].getBoundingClientRect(); return r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2, t: bs[0].textContent.trim() } : null; }, btn.t), 5000);
    if (goOn) { await sleep(300); await tapAt(d, fb.x + goOn.x, fb.y + goOn.y); }
    const gone = await waitFor(() => fr.evaluate(() => !document.getElementById('roadcard') || !!(window.BohemiaRoadEvents && BohemiaRoadEvents.fighting())), 8000);
    await sleep(800);
    /* a choice can open its own fight ('fighting'); the loop's fight is the next step's, so one opened here is won and left first */
    const fought = await fr.evaluate(() => !!(window.BohemiaRoadEvents && BohemiaRoadEvents.fighting()));
    if (fought) { await waitFor(() => d.page.$('#fightFrame'), 30000); await winAndLeave(d); }
    return { ok: !!gone, why: 'event ' + id + ', chose "' + btn.t + '"' + (goOn ? ', then ' + goOn.t : '') + '; the card ' + (gone ? 'closed' : 'STILL UP') + (fought ? ' (the choice was a fight: won and left)' : '') };
  });
  await step(7, 'A FIGHT: a crew meets him, the card\'s ENGAGE (a real tap) opens the fight with its board and both sides', async () => {
    await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
    await fr.evaluate(() => { const pm = partyMath('job', { skulls: 1 }), roster = []; for (let i = 0; i < pm.count; i++) roster.push({ arch: 'human' });
      const msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: 'A road crew', faction: null, draft: true, roster, party: pm, street: true, why: 'party:the-whole-loop', at: { gx: city.x + 2, gy: city.y + 1 } };
      return meetWalk(() => cityHandOver(msg)); });
    const b = await waitFor(() => fr.evaluate(() => { const m = document.getElementById('meetcard'); if (!m || +getComputedStyle(m).opacity < 0.9) return null;
      const x = m.querySelector('[data-meet="go"]'); if (!x) return null; const r = x.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }), 15000);
    if (!b) return { ok: false, why: 'no meet card with ENGAGE came up' };
    const fb = await (await fr.frameElement()).boundingBox();
    await tapAt(d, fb.x + b.x, fb.y + b.y);
    const up = await waitFor(async () => { const h = await d.page.$('#fightFrame'), f = h && await h.contentFrame();
      return f && await f.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units.some(u => u.side === 'you') && FIGHT.S.units.some(u => u.side === 'them')) ? { n: FIGHT.S.units.length, board: FIGHT.S.board } : null); }, 60000);
    return { ok: !!up, why: up ? up.n + ' men on ' + up.board : 'NO FIGHT after ENGAGE' };
  });
  await step(8, 'THE VICTORY: the fight won, the end screen stands; its LEAVE (a real tap) is the map with nothing over it', async () => winAndLeave(d));
  let saved = null;
  await step(9, 'A SAVE: the game saves and the title has a game to continue', async () => {
    saved = await fr.evaluate(() => { try { travelStop(); } catch (e) {} saveNow('the-whole-loop'); return { day: T.day, min: T.min, loopDay: DAY.day, loopMin: ((DAY.min % 1440) + 1440) % 1440, men: (function () { try { return BohemiaHireLock.count(); } catch (e) { return crewCount(); } })() }; });
    await sleep(1500);
    if (saved.loopDay !== saved.day || Math.abs(saved.loopMin - saved.min) > 10) return { ok: false, why: 'THE CLOCK ON THE GLASS AND THE DAY THE SAVE KEEPS DISAGREE: the glass says day ' + saved.day + ' ' + saved.min + ' min, the day loop (what a reload restores) day ' + saved.loopDay + ' ' + saved.loopMin + ' min' };
    const has = await d.page.evaluate(() => { try { return !!BOH_TITLE.saved(); } catch (e) { return false; } });
    return { ok: has, why: 'day ' + saved.day + ' ' + Math.floor(saved.min / 60) + ':' + String(saved.min % 60).padStart(2, '0') + ', ' + saved.men + ' men; the title ' + (has ? 'has it' : 'HAS NO SAVE') };
  });
  await step(10, 'RELOAD: the same phone opens the link again; CONTINUE (a real tap) is the same game, the same day and company', async () => {
    /* the game as it stands the moment the tab goes (the way home can set the journey going again, and the game saves itself as he walks) */
    saved = await fr.evaluate(() => { try { travelStop(); } catch (e) {} saveNow('the-whole-loop'); return { day: T.day, min: T.min, men: (function () { try { return BohemiaHireLock.count(); } catch (e) { return crewCount(); } })() }; });
    await sleep(1200);
    /* RUN SIX 11/6: a slot is BohemiaSave's envelope ({ v, gen, t, len, ck, p }), the game inside p as a string; it read 'day undefined' */
    const slots = await d.page.evaluate(() => ['bohemia_city_save.a', 'bohemia_city_save.b'].map(k => { try { const j = JSON.parse(localStorage.getItem(k) || 'null'); const s = j && j.p ? (JSON.parse(j.p) || {}).data : (j && (j.state || j.data || j)); return k.slice(-1) + ' (gen ' + (j && j.gen) + ') day ' + (s && s.day) + ' ' + (s && s.min) + ' min'; } catch (e) { return k + ' unreadable'; } }).join(', '));
    await d.page.close().catch(() => {});
    d2 = await D.open({ again: d, profile, alpha, fog: true });
    d2.page.on('pageerror', e => errs.push('again: ' + String(e).slice(0, 140)));
    const c = cityOf(d2) || d2.fr;
    const first = await waitFor(() => c.evaluate(() => (typeof T !== 'undefined' && MODE === 'city') ? { day: T.day, min: T.min } : null), 60000);
    await sleep(3000);
    const now = await waitFor(() => c.evaluate(() => (typeof T !== 'undefined' && MODE === 'city') ? { day: T.day, min: T.min, men: (function () { try { return BohemiaHireLock.count(); } catch (e) { return crewCount(); } })(), trav: !!TRAVEL, sp: TRAVEL_SPEED, fight: !!(window.parent && window.parent.document.getElementById('fightFrame')) } : null), 30000);
    const same = !!now && now.day === saved.day && Math.abs(now.min - saved.min) <= 10 && now.men === saved.men;
    return { ok: d2.title.via === 'continue' && same, why: 'the title: ' + JSON.stringify(d2.title) + '; back on day ' + (now ? now.day + ' ' + now.min + ' min, ' + now.men + ' men' : '?') + ' (saved day ' + saved.day + ' ' + saved.min + ' min, ' + saved.men + ' men; the slots: ' + slots + '; the first read after CONTINUE ' + (first ? first.day + ' ' + first.min + ' min' : '?') + '; ' + (now ? 'travel ' + now.trav + ' at ' + now.sp + 'x, a fight ' + now.fight : '') + ')' };
  });
  await step(11, 'nothing threw on any page', async () => ({ ok: errs.length === 0, why: errs.slice(0, 3).join(' | ') }));
  if (HEAP_LOG && +process.env.BOHEMIA_HEAP_PLANT > 0) {   /* the heap gate's plant: the instrument must see what is held */
    const mb = +process.env.BOHEMIA_HEAP_PLANT;
    await (d2 || d).page.evaluate((mb) => { window.__HEAP_PLANT = []; for (let i = 0; i < mb; i++) window.__HEAP_PLANT.push(new Array(131072).fill(i + 0.5)); }, mb).catch(() => {});
    await heapAt('planted ' + mb + ' MB');
  }
  console.log('\nTHE WHOLE LOOP PLAYS: ' + pass + ' passed, 0 failed');
  await bye(0);
})().catch(async (e) => { console.error(e); await bye(1); });

async function winAndLeave(dd) {
  const h = await dd.page.$('#fightFrame'), f = h && await h.contentFrame();
  if (!f) return { ok: false, why: 'no fight to win' };
  await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} });
  const sp = await waitFor(() => dd.page.evaluate(() => !!(window.SPOILS && SPOILS.frame && document.getElementById('spoilsdoor'))), 30000);
  if (!sp) return { ok: false, why: 'NO END SCREEN after the win' };
  const sh = await dd.page.$('#spoilsdoor iframe'), sf = sh && await sh.contentFrame();
  let tw = null; const t = sf ? await waitFor(async () => { tw = await tapIn(dd, sf, '#leave'); return tw === true || null; }, 15000) : null;
  const home = await waitFor(() => dd.page.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on')), 40000);
  const c = cityOf(dd);
  const map = home && c ? await waitFor(() => c.evaluate(() => MODE === 'city' && !(window.MEET && MEET.up)), 15000) : null;
  let where = '';
  if (!(home && map)) where = ': ' + JSON.stringify(await dd.page.evaluate(() => ({ spoils: !!document.getElementById('spoilsdoor'), fight: !!document.getElementById('fightFrame'), nf: document.body.classList.contains('nf-on'),
    phone: (document.getElementById('bohphone') || { dataset: {} }).dataset.screen || null }))) + ' ' + JSON.stringify(c ? await c.evaluate(() => ({ mode: MODE, meet: !!(window.MEET && MEET.up), road: !!document.getElementById('roadcard'), town: !!(LOOP.open), camp: !!(window.BohemiaMapCamp && BohemiaMapCamp.on()) })).catch(e => String(e).slice(0, 80)) : 'no map frame');
  return { ok: !!t && !!home && !!map, why: 'the end screen stood; LEAVE ' + (t ? 'tapped' : 'NOT TAPPED (' + tw + ')') + '; ' + (home && map ? 'the map, nothing over it' : 'NOT BACK ON THE MAP' + where) + (SCROLLED.length ? '; REACHED ONLY AFTER A SCROLL (rule 402, UI): ' + SCROLLED.join(', ') : '') };
}
