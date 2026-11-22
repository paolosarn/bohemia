#!/usr/bin/env node
/* HOME BASE 3, 11/22/26: THE GRINDER'S VOTE CARD AND ITS PROOF ON THE GLASS (VAMILY rule 469; rule 441: a phone upright and sideways).
   The demo, as he plays it: a new game, day 2, his place planted (the checkers' plantAt), the grinder put up from the desk's own row and
   standing the next day, a fight won with five people dead (the map's own hook, the fight's own outcome shape), then HIS PLACE: the
   footage with the grinder on its lot, a real tap on it (its sheet: one line, one button), a real tap on GRIND (the food in the top bar).
   Writes records/target/home_base/the_grinder_<profile>_<n>.webp (the png the shot is, turned webp after) and the card records/target/home_base/vote_the_grinder.webp.
   Run: node tools/bohemia_home_base_the_grinder_card_11_22_26.js [--only phone_portrait] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/home_base');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
const shots = [], facts = {};
(async () => {
  for (const prof of PROFS) {
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr;
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaGrinder)).catch(() => false)) break; await P.waitForTimeout(250); }
    const set = await F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2;
      const x0 = city.x, y0 = city.y; let at = null;
      for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok) { at = [ch.x, ch.y]; break; } }
      const p = BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = 30; w.food = 12; wagonPut(w);
      const g = BohemiaHomeMap.placeBuild('grinder'), f = BohemiaHomeMap.placeBuild('forge'); DAY.day = 3;
      const won = BohemiaHomeMap.grinderFight({ outcome: { victory: true, bodies: [{ beast: false }, { beast: false }, { beast: false }, { beast: false }, { beast: false }] } });
      return { at, planted: !!(p && (p.ok || p.at)), g, f, won, now: BohemiaHomeMap.grinder(), crew: crewCount() }; });
    console.log(prof, JSON.stringify(set));
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) fr = x; }
    if (!fr) { console.log(prof, 'NO FEED'); await d.close(); continue; }
    for (let i = 0; i < 24; i++) { if (await fr.evaluate(() => !document.getElementById('arrive')).catch(() => false)) break; await P.waitForTimeout(250); }
    const fb = await (await fr.frameElement()).boundingBox();
    let slot = null; for (let i = 0; i < 30 && !slot; i++) { slot = await fr.evaluate(() => { const f = window.__HOME_FEED || {}, s = f.slots || {}; const n = Object.keys(s).filter(n => s[n].id === 'grinder')[0]; return n ? { n: +n, key: s[n].key, at: window.__HOME_FEED_AT(+n), cam: f.cam } : null; }); if (!slot) await P.waitForTimeout(300); }
    await P.waitForTimeout(1200);
    const s1 = path.join(OUT, 'the_grinder_' + prof + '_1.png'); await P.screenshot({ path: s1 }); shots.push([prof, 1, s1]);
    let up = false;
    for (let t = 0; t < 3 && !up && slot; t++) { const w = await fr.evaluate(n => window.__HOME_FEED_AT(n), slot.n); if (!w) break;
      await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); for (let i = 0; i < 12 && !up; i++) { await P.waitForTimeout(250); up = await fr.evaluate(() => !!document.querySelector('#sbody .act[data-grind]')).catch(() => false); } }
    await P.waitForTimeout(900);
    const sheet = await fr.evaluate(() => { const b = document.querySelector('#sbody .act[data-grind]'); return b ? { btn: b.textContent, off: b.disabled, say: (document.querySelector('#sbody .say p') || {}).textContent || '' } : null; });
    const s2 = path.join(OUT, 'the_grinder_' + prof + '_2.png'); await P.screenshot({ path: s2 }); shots.push([prof, 2, s2]);
    const food0 = await F.evaluate(() => (wagonGet() || {}).food | 0);
    let ground = false;
    for (let t = 0; t < 3 && !ground && sheet; t++) { const w = await fr.evaluate(() => { const b = document.querySelector('#sbody .act[data-grind]'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }); if (!w) break;
      await P.touchscreen.tap(fb.x + w[0], fb.y + w[1]); for (let i = 0; i < 12 && !ground; i++) { await P.waitForTimeout(250); ground = await fr.evaluate(() => !!window.__HOME_GRIND).catch(() => false); } }
    await P.waitForTimeout(1300);
    const after = await fr.evaluate(() => { const b = document.querySelector('#sbody .act[data-grind]'); return { btn: b ? b.textContent : null, say: (document.querySelector('#sbody .say p') || {}).textContent || '', grind: window.__HOME_GRIND || null }; });
    const food1 = await F.evaluate(() => (wagonGet() || {}).food | 0);
    const s3 = path.join(OUT, 'the_grinder_' + prof + '_3.png'); await P.screenshot({ path: s3 }); shots.push([prof, 3, s3]);
    facts[prof] = { set, slot, sheet, food0, food1, after, view: P.viewportSize() };
    console.log(prof, JSON.stringify(facts[prof]));
    await d.close();
  }
  fs.writeFileSync(path.join(OUT, 'the_grinder_facts.json'), JSON.stringify({ shots: shots.map(s => [s[0], s[1], path.relative(ROOT, s[2])]), facts }, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
