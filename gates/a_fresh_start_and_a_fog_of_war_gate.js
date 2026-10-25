#!/usr/bin/env node
/* ============================================================================
   A FRESH START AND A FOG OF WAR GATE (RUN 10/25, rule 155, row [a fresh start, a fog of war]).

   PAOLO 10/24, asked twice: 'I don't wanna start off on the same part of the map every time... in Battle Brothers when
   you start your campaign most of the map is hidden... you see where you're at, a radius around you, and that's it, but
   it gives you the option to reveal all settlement locations.'

   THE STRANGER'S GAME (fog: true): three new games on his phone through the one driver, the third with SHOW THE TOWNS.
     F1 three new games start in three different places, each by a town (a town or a fort within 6 blocks, any place within 4)
     F2 the map is dark past a circle round him: the fog is drawn and under 1 in 100 of the region's blocks are seen
     F3 a town under the fog has no name and takes no tap; a town he can see has both
     F4 walking clears it: 12 blocks of travel and the seen blocks grow and stay grown
     F5 the dark is kept with the game: saved and read back, the same blocks are seen
     F6 SHOW THE TOWNS: every valley town is seen at the first frame, and the land between them is not
     F7 the first day's two jobs on the phone come from places near the corner when two are within 12 blocks
     F8 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nA FRESH START AND A FOG OF WAR GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  const games = [], errs = [];
  for (let gi = 0; gi < 3; gi++) {
    const reveal = gi === 2;
    const arm = "try { localStorage.setItem('bohemia.laststart.v1', " + JSON.stringify(JSON.stringify(games.length ? games[games.length - 1].at : null)) + "); var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.reveal = " + (reveal ? 1 : 0) + "; localStorage.setItem('bohemia.start', JSON.stringify(s)); } catch (e) {}";
    const d = await open({ profile: 'phone_portrait', fog: true, arm });
    const fr = d.fr, page = d.page;
    page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at)).catch(() => false)) break; }
    await page.waitForTimeout(1500);
    const g = await fr.evaluate(() => {
      const bs = ctBases(), at = [city.x, city.y], near = (R, any) => { let b = 99; for (const n in bs) { const t = mapTierOf(n) || 'camp'; if (!any && t === 'camp') continue; b = Math.min(b, Math.max(Math.abs(bs[n].x - at[0]), Math.abs(bs[n].y - at[1]))); } return b; };
      const seen = FOG.seen ? FOG.seen.reduce((a, b) => a + b, 0) : -1;
      MAP_DREW = {}; MAP_TOWN_HIT = []; render();
      const hits = MAP_TOWN_HIT.map(h => h.name), towns = Object.keys(bs).map(n => ({ n, d: Math.max(Math.abs(bs[n].x - at[0]), Math.abs(bs[n].y - at[1])), seen: fogSeen(bs[n].x, bs[n].y) }));
      return { at, fresh: window.__FRESH_START, town: near(6), any: near(4, true), seen, D: FOG.D, fogDrew: (MAP_DREW.fog | 0) > 0, hits, towns,
        phone: ((window.__PHONE_BOARD || {}).shown || []).map(a => ({ place: a.place, dist: a.dist })) };
    });
    games.push(g);
    if (gi === 0) {
      /* F3: a town in the fog against one he sees */
      const hidden = g.towns.filter(t => !t.seen), shown = g.towns.filter(t => t.seen);
      const hiddenHit = hidden.filter(t => g.hits.indexOf(t.n) >= 0);
      ok('F3 a town under the fog has no name and takes no tap', hidden.length > 0 && hiddenHit.length === 0, hidden.length + ' hidden, ' + hiddenHit.length + ' of them tappable; ' + shown.length + ' seen');
      /* F4: travel */
      const s0 = g.seen;
      await fr.evaluate(() => { const x = city.x, y = city.y; for (const [dx, dy] of [[12, 0], [-12, 0], [0, 12], [0, -12], [9, 9], [-9, -9]]) { if (travelTo(0, 0, [x + dx, y + dy])) break; } travelGoes(); });
      for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) break; }
      const s1 = await fr.evaluate(() => FOG.seen.reduce((a, b) => a + b, 0));
      ok('F4 walking clears it and it stays cleared', s1 > s0 * 1.5, s0 + ' -> ' + s1 + ' blocks seen');
      /* F5: kept */
      const s2 = await fr.evaluate(() => { fogSave(); const was = FOG.seen.reduce((a, b) => a + b, 0); FOG.ready = false; fogLoad(); return [was, FOG.seen.reduce((a, b) => a + b, 0), FOG.ready, FOG.all]; });
      ok('F5 the dark is kept with the game', s2[0] === s2[1] && s2[2] && !s2[3], JSON.stringify(s2));
    }
    await d.close();
  }
  const spots = games.map(g => g.at.join(','));
  ok('F1 three new games, three different corners, each by a town', new Set(spots).size === 3 && games.every(g => g.town <= 6 || g.any <= 4),
     games.map(g => g.at.join(',') + ' ' + (g.fresh && g.fresh.kind) + ' town ' + g.town).join(' | '));
  const g0 = games[0];
  ok('F2 the map is dark past a circle round him', g0.fogDrew && g0.seen > 0 && g0.seen < g0.D * g0.D / 100, g0.seen + ' of ' + (g0.D * g0.D) + ' blocks seen');
  const g2 = games[2], landSeen = g2.seen;
  ok('F6 SHOW THE TOWNS: every valley town seen at the first frame, the land between not', g2.towns.every(t => t.seen) && landSeen < g2.D * g2.D / 50,
     g2.towns.filter(t => t.seen).length + ' of ' + g2.towns.length + ' towns, ' + landSeen + ' blocks');
  const nearGames = games.filter(g => g.towns.filter(t => t.d <= 12).length >= 2);
  ok('F7 the first day\'s jobs come from near the corner', nearGames.length === 0 || nearGames.every(g => g.phone.length && g.phone.every(p => p.dist <= 12)),
     games.map(g => g.phone.map(p => p.place + ' ' + p.dist).join('/')).join(' | '));
  ok('F8 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
