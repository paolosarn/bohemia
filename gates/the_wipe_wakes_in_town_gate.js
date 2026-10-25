#!/usr/bin/env node
/* ============================================================================
   THE WIPE WAKES IN TOWN GATE (RUN 10/25, rule 143(e), row [the wipe, the marker, no flags]).

   PAOLO 10/24: 'if everyone dies you're still where you were before the battle... spawn in the nearest town, a mini side
   quest, your whole squad got wiped.'

   On the demo, through the one driver: he walks 14 blocks out, then the map hears COMBAT's own wipe message (the shape
   in COMBAT's NOTE on RUN's board: BOHEMIA_CITY_COMBAT_END outcome {result 'loss', wipe true, wipeInfo, fates}). Holds:
     W1 no reload: the map never asks the shell for the save before the bell
     W2 he wakes at the nearest town's door, hours later
     W3 the men the fight left down are taken: the crew count and the marker lose them, the shell's fight will not get them
     W4 the mini side quest: a held job at the place it happened, 'Get your men back from <them>', a YOUR MEN plate on it
     W5 a face at the town says what happened and what is next (queued on the map's one voice)
     W6 walking to it meets the card; ENGAGE hands its fight through the one door as that contract
     W7 winning it brings the men home: the count, the marker and the store are whole again, the job is gone
     W8 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE WIPE WAKES IN TOWN GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  const d = await open({ profile: 'phone_portrait' });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await page.waitForTimeout(3000);
  await page.evaluate(() => { window.__RESTORE_ASKED = 0; window.__POSTS = [];
    window.addEventListener('message', e => { if (e.data && e.data.bohemiaCityNeedRestore) window.__RESTORE_ASKED++; if (e.data && e.data.type === 'BOHEMIA_CITY_ENCOUNTER') window.__POSTS.push(e.data.why || ''); }); });
  const before = await fr.evaluate(() => { city.x = Math.min(om.n - 3, city.x + 14); city.y = Math.min(om.n - 3, city.y + 6); render();
    return { at: [city.x, city.y], crew: crewCount(), looks: mapCrewLooks().slice(), min: T.min, day: T.day }; });
  await fr.evaluate((at) => { window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: { result: 'loss', victory: false, wipe: true,
    wipeInfo: { by: 'brigands', byName: 'The road crew', lines: ['They came at you from two sides.'], next: 'Somebody drags you to the nearest town. The road crew have your men and your gear.', cell: at, down: ['DESI', 'RAUL'] },
    fates: [{ name: 'YOU', main: true, down: true }, { name: 'DESI', down: true }, { name: 'RAUL', down: true }] }, at: null }, '*'); }, before.at);
  await page.waitForTimeout(2500);
  const a = await fr.evaluate(() => {
    const W = window.__WIPE_WOKE || null, bs = ctBases(); let near = null, nd = 1e9;
    if (W) for (const n in bs) { const b = bs[n]; const t = mapTierOf(n) || 'camp'; if (t === 'camp') continue; const dd = Math.max(Math.abs((b.x | 0) - 0), 0); }
    const job = LOOP.held.find(j => j.rescue) || null;
    let opts = null; try { opts = window.parent.nfOpts({ world: { day: T.day } }); } catch (e) { opts = null; }
    return { W, at: [city.x, city.y], crew: crewCount(), looks: mapCrewLooks().slice(), min: T.min, day: T.day, job: job ? { id: job.id, title: job.title, t: job.target } : null,
      taken: JSON.parse(localStorage.getItem('bohemia.taken.v1') || '[]'), shellMen: opts && opts.company ? opts.company.map(m => m && m.name) : null, shellN: opts && opts.company ? opts.company.length : null,
      queued: (function () { try { const V = BohemiaMaterials.ten.voice; return (V.q || []).concat(V.on ? [V.on] : []).filter(o => o.kind === 'wipe').map(o => o.who.name + ': ' + o.line); } catch (e) { return []; } })(),
      plate: (MAP_DREW && MAP_DREW.jobs) | 0 };
  });
  const restore = await page.evaluate(() => window.__RESTORE_ASKED);
  ok('W1 no reload: the map never asked for the save before the bell', restore === 0, restore + ' asks');
  const town = a.W && a.W.town;
  const dist = await fr.evaluate((t) => { const b = ctBases()[t]; return b ? Math.max(Math.abs((b.x | 0) - city.x), Math.abs((b.y | 0) - city.y)) : null; }, town);
  ok('W2 he wakes at the nearest town\'s door, hours later', !!town && dist != null && dist <= 1 && (a.min - before.min + (a.day - before.day) * 1440) >= 180,
     town + ' at ' + dist + ' block, ' + before.min + ' -> ' + a.min + ' min');
  ok('W3 the men left down are taken: the count, the marker and the shell\'s fight lose them', a.crew === before.crew - 2 && a.looks.length === 0 && a.taken.length === 1 && a.shellN === 1,
     'crew ' + before.crew + ' -> ' + a.crew + ', marker ' + a.looks.length + ', shell ' + JSON.stringify(a.shellMen) + ' of ' + a.shellN);
  ok('W4 the side quest: a held job where it happened, to get them back', !!a.job && /Get your men back from The road crew/.test(a.job.title) && a.job.t.x === before.at[0] && a.job.t.y === before.at[1],
     a.job ? a.job.title + ' at ' + a.job.t.x + ',' + a.job.t.y : 'none');
  ok('W5 a face at the town says what happened and what is next', a.queued.length === 1 && /drags you/.test(a.queued[0]) && /DESI, RAUL/.test(a.queued[0]), a.queued[0] || 'nothing queued');
  /* walk to it */
  if (a.job) await fr.evaluate((t) => { travelTo(0, 0, [t.x, t.y]); travelGoes(); }, a.job.t);
  let card = false; for (let i = 0; i < 120 && a.job; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!document.getElementById('meetcard'))) { card = true; break; } }
  if (card) await fr.evaluate(() => MEET_DONE(true));
  await page.waitForTimeout(1500);
  const posts = await page.evaluate(() => window.__POSTS.slice());
  ok('W6 walking to it meets the card, and ENGAGE hands its fight through the one door', card && a.job && posts.indexOf('contract:' + a.job.id) >= 0, (card ? 'card, ' : 'no card, ') + posts.join(' '));
  await page.waitForTimeout(3000);
  await fr.evaluate(() => { window.postMessage({ type: 'BOHEMIA_CITY_COMBAT_END', outcome: { result: 'win', victory: true, alive: 0 }, at: null }, '*'); });
  await page.waitForTimeout(1500);
  const r = await fr.evaluate(() => ({ crew: crewCount(), looks: mapCrewLooks().slice(), taken: JSON.parse(localStorage.getItem('bohemia.taken.v1') || '[]'), held: LOOP.held.filter(j => j.rescue).length, back: window.__RESCUED || null }));
  ok('W7 winning it brings them home', r.crew === before.crew && r.looks.length === before.looks.length && r.taken.length === 0 && r.held === 0 && r.back && r.back.men.length === 2,
     'crew ' + r.crew + ', marker ' + r.looks.length + ', taken ' + r.taken.length + ', held ' + r.held);
  ok('W8 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
