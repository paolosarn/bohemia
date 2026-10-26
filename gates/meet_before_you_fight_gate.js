#!/usr/bin/env node
/* ============================================================================
   MEET BEFORE YOU FIGHT GATE (RUN 10/25, rule 151(e), row [the speed, and meet before you fight]).

   PAOLO 10/24: 'when I walk over to an enemy or a job it doesn't display who I'm about to fight or the terrain, how
   Battle Brothers does: you find an enemy and they give you the option to fall back.'

   Plays the demo on his phone through the one driver, WITHOUT the engage option, so it meets the card the way a stranger
   does: it sets out after the nearest roaming party with the map's own travel (travelTo, the metronome's steps) and waits
   for contact. Then it holds:
     M1 the walk into a party stops on a card, and no fight has gone to the shell
     M2 the card says WHO (their name, how many, their stars) and THE GROUND (the block's kind) and offers two choices
     M3 the card draws their own men (at least one)
     M4 the map is held while it stands (the speed is PAUSE, nothing travelling)
     M5 FALL BACK by a finger: the card goes, no fight goes to the shell, he stands at least one block farther from them
     M6 walking into them again and ENGAGE: the fight goes to the shell through the one door, labelled as their party
     M7 the space bar does nothing to the map while the card stands (its own keys answer)
     M8 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nMEET BEFORE YOU FIGHT GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  const d = await open({ profile: 'phone_portrait' });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await page.waitForTimeout(3000);
  await page.evaluate(() => { window.__POSTS = []; window.addEventListener('message', e => { if (e.data && e.data.type === 'BOHEMIA_CITY_ENCOUNTER') window.__POSTS.push(e.data.why || ''); }); });
  const chase = () => fr.evaluate(() => {
    const ps = partiesAll(); let best = null, bd = 1e9;
    ps.forEach(p => { const dd = Math.max(Math.abs((p.at.x | 0) - city.x), Math.abs((p.at.y | 0) - city.y)); if (dd > 0 && dd < bd) { bd = dd; best = p; } });
    if (!best) return null;
    const tx = best.at.x | 0, ty = best.at.y | 0; let c = cityWalkable(tx, ty) ? [tx, ty] : null;
    if (!c) for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (cityWalkable(tx + a, ty + b)) { c = [tx + a, ty + b]; break; }
    if (!c) return null;
    PARTY_CHASE = best.id; PARTY_SEL = best.id; travelTo(0, 0, c); travelGoes();
    return { id: best.id, dist: bd };
  });
  const waitCard = async () => { for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!document.getElementById('meetcard'))) return true; } return false; };
  const c1 = await chase();
  const up = c1 ? await waitCard() : false;
  const posts1 = await page.evaluate(() => window.__POSTS.slice());
  ok('M1 walking into a party stops on a card, and no fight has gone to the shell', up && posts1.length === 0, (c1 ? c1.id + ' at ' + c1.dist : 'no party') + ', posts ' + posts1.length);
  const card = await fr.evaluate(() => { const e = document.getElementById('meetcard'); if (!e) return null;
    return { text: e.textContent, stars: e.querySelectorAll('.bmstar').length || (e.querySelector('.mcstars') ? e.querySelector('.mcstars').textContent.length : 0),
      go: !!e.querySelector('[data-meet="go"]'), back: !!e.querySelector('[data-meet="back"]'), up: window.__MEET_UP, speed: TRAVEL_SPEED, travel: !!(TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length) }; });
  ok('M2 the card says who (name, how many, stars) and the ground, with ENGAGE and FALL BACK', !!card && /\d+ (MEN|MAN|KIDS?|MACHINES?|BEASTS?|DEAD|DEAD ONE|DIRE WOL(F|VES)|HYENAS?)\b/.test(card.text) && /THE GROUND/.test(card.text) && card.stars >= 1 && card.stars <= 3 && card.go && card.back,
     card ? card.text.replace(/\s+/g, ' ').slice(0, 120) + ' / stars ' + card.stars : 'no card');
  ok('M3 the card draws their own men', !!card && card.up && card.up.men >= 1, card && card.up ? card.up.men + ' drawn of ' + card.up.n : '');
  ok('M4 the map is held while it stands', !!card && card.speed === 0 && !card.travel, card ? 'speed ' + card.speed + ', travelling ' + card.travel : '');
  const sp0 = await fr.evaluate(() => window.__SPACE_PAUSES | 0);
  await page.keyboard.press('Space').catch(() => {});
  await page.waitForTimeout(300);
  const sp1 = await fr.evaluate(() => ({ n: window.__SPACE_PAUSES | 0, speed: TRAVEL_SPEED, card: !!document.getElementById('meetcard') }));
  ok('M7 the space bar does nothing to the map while the card stands', sp1.n === sp0 && sp1.speed === 0 && sp1.card, JSON.stringify(sp1));
  /* FALL BACK, by a finger on the button */
  const before = await fr.evaluate((id) => { const p = partyById(id); return { me: [city.x, city.y], them: p ? [p.at.x | 0, p.at.y | 0] : null }; }, c1 ? c1.id : null);
  const b = await fr.evaluate(() => { const e = document.querySelector('#meetcard [data-meet="back"]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const box = await page.evaluate(() => { const f = document.getElementById('cityFrame'); const r = f.getBoundingClientRect(); return { x: r.x, y: r.y }; });
  if (b) await page.touchscreen.tap(box.x + b.x, box.y + b.y);
  await page.waitForTimeout(800);
  const after = await fr.evaluate(() => ({ me: [city.x, city.y], card: !!document.getElementById('meetcard'), last: window.__MEET_LAST || null }));
  const posts2 = await page.evaluate(() => window.__POSTS.slice());
  const dist = (a, t) => Math.max(Math.abs(a[0] - t[0]), Math.abs(a[1] - t[1]));
  ok('M5 FALL BACK: the card goes, no fight, and he stands farther from them', !after.card && after.last && after.last.go === false && posts2.length === 0 && before.them && dist(after.me, before.them) > dist(before.me, before.them),
     before.them ? 'from ' + dist(before.me, before.them) + ' to ' + dist(after.me, before.them) + ' blocks, posts ' + posts2.length : 'no party');
  /* again, and ENGAGE */
  const c2 = await chase();
  const up2 = c2 ? await waitCard() : false;
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(400);
  if (await fr.evaluate(() => !!document.getElementById('meetcard'))) {
    const g = await fr.evaluate(() => { const e = document.querySelector('#meetcard [data-meet="go"]'); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.touchscreen.tap(box.x + g.x, box.y + g.y);
  }
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); if ((await page.evaluate(() => window.__POSTS.length)) > 0) break; }
  const posts3 = await page.evaluate(() => window.__POSTS.slice());
  ok('M6 again, and ENGAGE: the fight goes to the shell through the one door, as their party', up2 && posts3.length === 1 && /^party:/.test(posts3[0]), posts3.join(' '));
  ok('M8 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
