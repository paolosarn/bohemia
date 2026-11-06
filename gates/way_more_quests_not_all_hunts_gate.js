#!/usr/bin/env node
/* ============================================================================
   WAY MORE QUESTS, NOT ALL HUNTS GATE (WORLD 9, 11/5; rules 399 and 389; ask lines 439 and 422).

   PAOLO 11/4: 'we definitely need more quests, I keep going all around the city just killing the sabre-tooth tigers, we need way
   more quest shit going on'; 'the amount of beasts I'm slaying, I feel like that's not realistic... tone it down'.

   Plays the demo on his phone through the one driver and deals EVERY town's board for a seeded month (days 1 to 30, every refresh
   window, the day's danger floor as the map reads it), then plans every job it offers (BohemiaJobKinds.plan: the same make() the
   yes runs, on a copy) and counts the fights each would bring (BohemiaJobKinds.fightsOf, the job's packs, legs and guards):
     B1 no kind is more than a third of the offers, in any window or the month; a hunt is never most of a board
     B2 the slow lab giants (records/target/BOHEMIA_JOB_KINDS.json giants.kinds) are at most giants.max_share of all the month's
        expected fights
     B3 no pack, hunt or guard is ever a giant; a giant is always ONE animal (a named big game)
     B4 the new kinds (the den, find out, the meat, follow, the farm) are dealt in the month and plan to places on the map
     B5 the show's two tigers are two: one pack of two, and the job ends at two
     B6 MUTATION: the giants back in the hills' mix and the giant guard off, a hunt planned on the hills deals giant packs: the gate bites
     B7 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nWAY MORE QUESTS, NOT ALL HUNTS GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const NEW = ['lair', 'investigate', 'carcass', 'follow', 'farm'];

(async () => {
  const d = await open({ profile: 'phone_portrait' });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await page.waitForTimeout(3000);
  await fr.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaJobKinds && BohemiaJobKinds.data && BohemiaJobKinds.data(), null, { timeout: 60000 }).catch(() => {});
  /* the danger engine and the ground table in, then the day-one reads (the floor the boards are dealt under) */
  await fr.evaluate(() => { try { BohemiaJobDanger.engine(); } catch (e) {} const ps = BohemiaBoardShelf.mapPlaces(1) || []; ps.forEach(p => { try { BohemiaBoardShelf.pick(p, 1, { places: ps }); } catch (e) {} }); });
  await page.waitForTimeout(45000);
  const M = await fr.evaluate((NEW) => {
    const D = BohemiaJobKinds, J = D.data(), G = (J.giants && J.giants.kinds) || [], share = (J.giants && J.giants.max_share) || 0.05;
    const out = { kinds: {}, total: 0, windows: [], worst: 0, worstWhat: '', huntMost: 0, fights: 0, giantF: 0, packGiants: 0, giantMany: 0, newSeen: {}, newPlanned: {}, share, G, foes: {}, errs: [] };
    const bases = ctBases() || {};
    for (let day = 1; day <= 30; day += 3) {
      const ps = BohemiaBoardShelf.mapPlaces(day) || [], w = { day, kinds: {}, n: 0 };
      ps.forEach(p => {
        const offers = BohemiaBoardShelf.pick(p, day, { places: ps }) || [];
        let hunts = 0;
        offers.forEach(o => {
          const k = D.kindOf(o); out.kinds[k] = (out.kinds[k] || 0) + 1; w.kinds[k] = (w.kinds[k] || 0) + 1; out.total++; w.n++; if (k === 'hunt-kind') hunts++;
          if (NEW.indexOf(k) >= 0) out.newSeen[k] = (out.newSeen[k] || 0) + 1;
          const b = bases[p.name]; if (!b) return;
          let job = null; try { job = D.plan(o, { name: p.name, x: b.x | 0, y: b.y | 0, tier: p.tier }); } catch (e) { out.errs.push(String(e.message || e).slice(0, 80)); }
          if (!job) return;
          if (NEW.indexOf(k) >= 0 && job.legs && job.legs.every(L => L.x != null && cityWalkable(L.x | 0, L.y | 0) || L.go === 'client' || L.town)) out.newPlanned[k] = (out.newPlanned[k] || 0) + 1;
          (job.packs || []).forEach(pk => { if (G.indexOf(pk.faction) >= 0) out.packGiants++; });
          let F = []; try { F = D.fightsOf(job, { offer: true }) || []; } catch (e) {}
          F.forEach(f => { out.fights += f.p; out.foes[f.faction] = (out.foes[f.faction] || 0) + f.p;
            if (G.indexOf(f.faction) >= 0) { out.giantF += f.p; if (f.n > 1) out.giantMany++; } });
        });
        if (offers.length >= 2 && hunts * 2 > offers.length) out.huntMost++;
      });
      const top = Object.entries(w.kinds).sort((a, b) => b[1] - a[1])[0];
      if (top && top[1] / w.n > out.worst) { out.worst = top[1] / w.n; out.worstWhat = top[0] + ' on day ' + day; }
      out.windows.push(w.n);
    }
    return out;
  }, NEW);
  const kTop = Object.entries(M.kinds).sort((a, b) => b[1] - a[1]);
  const mTop = kTop.length ? kTop[0][1] / M.total : 1;
  ok('B1 no kind over a third of the offers (any window, the month); a hunt is never most of a board',
     M.total > 100 && M.worst <= 1 / 3 && mTop <= 1 / 3 && M.huntMost === 0,
     M.total + ' offers in ' + M.windows.length + ' windows; the month: ' + kTop.slice(0, 4).map(e => e[0] + ' ' + Math.round(e[1] / M.total * 100) + '%').join(', ') + '; hunts ' + Math.round((M.kinds['hunt-kind'] || 0) / M.total * 100) + '%; worst window ' + Math.round(M.worst * 100) + '% (' + M.worstWhat + '); boards mostly hunts ' + M.huntMost);
  ok('B2 the slow giants are at most ' + Math.round(M.share * 100) + '% of the month\'s fights', M.fights > 50 && M.giantF / M.fights <= M.share,
     (M.giantF / Math.max(1, M.fights) * 100).toFixed(1) + '% (' + M.giantF.toFixed(1) + ' of ' + M.fights.toFixed(1) + ' expected fights); beasts met: ' + Object.entries(M.foes).filter(e => !/brigand|crew|raider|cartel|reds|blues|mob|network|house|watch|kids|machines|ghosts|heavies|keepers|water/.test(e[0])).sort((a, b) => b[1] - a[1]).map(e => e[0] + ' ' + e[1].toFixed(1)).join(', '));
  ok('B3 no pack, hunt or guard is a giant; a giant is always one animal', M.packGiants === 0 && M.giantMany === 0, 'giant packs ' + M.packGiants + ', giant fights of more than one ' + M.giantMany);
  ok('B4 the new kinds are dealt in the month and plan to places on the map', NEW.every(k => M.newSeen[k] > 0 && M.newPlanned[k] > 0),
     NEW.map(k => k + ' ' + (M.newSeen[k] | 0) + '/' + (M.newPlanned[k] | 0)).join(', '));
  /* B5: the show's two tigers */
  const B5 = await fr.evaluate(() => { const D = BohemiaJobKinds, sh = BohemiaBoardShelf, bs = ctBases() || {};
    const o = (sh.pick({ name: Object.keys(bs)[0], tier: 'fortress' }, 1, {}) || []).concat([]).filter(x => x.id === 'qd-aa15')[0] || { id: 'qd-aa15', title: "Put down the show's two tigers", skulls: 2, pay: 60 };
    const n = Object.keys(bs)[0], b = bs[n]; const job = D.plan(o, { name: n, x: b.x | 0, y: b.y | 0, tier: 'fortress' });
    return job ? { need: job.need, packs: (job.packs || []).map(p => p.n + ' ' + p.faction) } : null; });
  ok('B5 the show\'s two tigers are two: one pack of two, the job ends at two', !!B5 && B5.need === 2 && B5.packs.length === 1 && /^2 /.test(B5.packs[0]), JSON.stringify(B5));
  /* B6: the mutation */
  const B6 = await fr.evaluate(() => { const D = BohemiaJobKinds, J = D.data(), keepK = J.giants.kinds, keepH = J.beasts_by_ground.hills, keepD = J.beasts_by_ground['default'];
    J.giants.kinds = []; J.beasts_by_ground.hills = { lions: 3, wolves: 1, bulls: 1, sloths: 1, bears: 1, sabres: 1, prides: 1 }; J.beasts_by_ground['default'] = J.beasts_by_ground.hills;
    const bs = ctBases() || {}, G = ['sabres', 'bears', 'sloths', 'prides', 'camels']; let giants = 0, packs = 0;
    Object.keys(bs).forEach(n => { const b = bs[n]; for (let i = 0; i < 6; i++) { const job = D.plan({ id: 'gate-hunt-' + n + '-' + i, title: 'Hunt the pack that drinks here', skulls: 2, pay: 30, kind: 'hunt-kind' }, { name: n, x: b.x | 0, y: b.y | 0, tier: 'town' });
      (job && job.packs || []).forEach(p => { packs++; if (G.indexOf(p.faction) >= 0) giants++; }); } });
    J.giants.kinds = keepK; J.beasts_by_ground.hills = keepH; J.beasts_by_ground['default'] = keepD;
    return { giants, packs }; });
  ok('B6 MUTATION: the giants back in the mix with the guard off, a hunt deals giant packs', B6.packs > 0 && B6.giants > 0, B6.giants + ' giant packs of ' + B6.packs);
  ok('B7 nothing threw', errs.length === 0 && M.errs.length === 0, errs.concat(M.errs).slice(0, 2).join(' | '));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
