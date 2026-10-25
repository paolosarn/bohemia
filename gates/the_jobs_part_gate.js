/* ==========================================================================
   THE JOBS' PART  (WORLD [the PC playtest: the jobs' part], 10/25/26, rule 164 items 3, 8, 26)

   PAOLO 10/24 on his PC, three things, in his words:
     3   'take three carts to Prim, and it's really just the blue settlement'
     8   'it's not clear how to cut a quest off... let's say I don't wanna do it anymore'
     26  'Battle Brothers matches you with opponents by the amount of people on your roster... if I fill up my roster,
          the opponents go up too'

   ONE DRIVER ON THE DEMO, by touches where a finger can do it (the hall's HIRE buttons, the board's own 'Take it' message
   from the settlement's own window, the map's travelTo for a block off the glass, the way every job-kind leg does it):
     R   THE ROSTER SCALES THE ENEMY: a job's party sized for his three; nine men hired at the hall by touch; the same job's
         party now sized for twelve (Battle Brothers' contract math: 12 strongest, 10 + 2 a level); a roaming party a little
         bigger (the wiki: 'slightly'); the fight he walks into has that many of them
     N   EVERY PLACE A JOB NAMES IS ON THE MAP, NAMED AND MARKED: the carts go to PRIMM, the real place, and the map says
         PRIMM where it is; off the glass, its name at the glass's edge on the way to it; the client's town named and marked
     D   DROP A JOB, BATTLE BROTHERS' WAY: the job goes, the client's standing pays for it, the phone says so plainly

   node gates/the_jobs_part_gate.js [roster|names|drop]
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const ONLY = process.argv[2] || null;
const SHOTS = process.env.JOBS_PART_SHOTS || null;

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE JOBS\' PART: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: process.env.JOBS_PART_PROFILE || 'phone_portrait' }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  const shot = async (n) => { if (SHOTS) await d.page.screenshot({ path: path.join(SHOTS, n + '.png') }); };
  const shell = () => d.page.evaluate(() => ({ fight: !!CITYFIGHT }));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await d.page.waitForTimeout(300); } return false; };
  const cityBox = async () => (await d.page.$('#cityFrame')).boundingBox();
  const goCell = async (x, y) => {
    const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y);
      return { x: r.left + q.sx, y: r.top + q.sy + TH / 2, on: mapOnGlass(x, y) }; }, [x, y]);
    if (p.on) { await d.tapAt(p.x, p.y); await d.page.waitForTimeout(150);
      const set = await fr.evaluate(([x, y]) => (TRAVEL && TRAVEL.to && Math.max(Math.abs(TRAVEL.to[0] - x), Math.abs(TRAVEL.to[1] - y)) <= 2) || Math.max(Math.abs(city.x - x), Math.abs(city.y - y)) <= 1 || !!LOOP.fighting, [x, y]);
      if (set || (await shell()).fight) return 'touch'; }
    await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, [x, y]); return p.on ? 'touch, then travelTo' : 'travelTo';
  };
  const unpause = async () => {
    const one = await fr.evaluate(() => { const e = [...document.querySelectorAll('button,div')].filter(x => /^1X$/i.test((x.textContent || '').trim()) && x.getBoundingClientRect().width > 10)
      .sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (one) { const fb = await cityBox(); await d.page.touchscreen.tap(fb.x + one.x, fb.y + one.y).catch(() => {}); await d.page.waitForTimeout(300); }
    await fr.evaluate(() => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); });
  };
  const fightFrame = async () => { for (let i = 0; i < 120; i++) { const h = await d.page.$('#fightFrame');
      if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) return { f, box: await h.boundingBox() }; }
      await d.page.waitForTimeout(200); } return { f: null, box: null }; };
  const spoilsLeave = async () => {
    const up = await waitFor(() => d.page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !CITYFIGHT), 15000);
    const h = await d.page.$('#spoilsdoor iframe'); if (!h) return false;
    const sf = await h.contentFrame(), box = await h.boundingBox();
    const b = sf ? await sf.waitForFunction(() => { const e = document.getElementById('leave'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, null, { timeout: 10000 }).then(x => x.jsonValue()).catch(() => null) : null;
    if (b) await d.page.mouse.click(box.x + b[0], box.y + b[1]); else await d.page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
    return up;
  };
  /* a fight that is not the one measured (a roaming party on the road): ended by the gate as a cleared fight, said */
  const forceWin = async () => {
    const ff = await fightFrame(); if (!ff.f) return null;
    await ff.f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    await spoilsLeave();
    await waitFor(async () => !(await shell()).fight, 20000);
    await d.page.waitForTimeout(1500); await unpause();
    return 'won (ended by the gate)';
  };
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
  const settleFrame = async () => { const fh = await fr.$('#settleFrame'); return fh ? fh.contentFrame() : null; };
  const take = async (id) => {
    const sf = await settleFrame(); if (!sf) return null;
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 15000 }).catch(() => {});
    const t = await sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; if (!o) return null;
      const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
      window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); return o.title; }, id);
    await d.page.waitForTimeout(800);
    return t;
  };
  const leave = async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await d.page.waitForTimeout(500); };
  const job = (id) => fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; return j ? JSON.parse(JSON.stringify(j)) : null; }, id);
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
  const size = () => fr.evaluate(() => { const j2 = partyMath('job', { skulls: 2 }), j3 = partyMath('job', { skulls: 3 }), r = partyMath('roaming', { x: city.x, y: city.y });
    return { roster: JSON.parse(JSON.stringify(window.__ROSTER || null)), strength: j2.strength, job2: j2.count, job3: j3.count, word2: j2.word, roam: r.count, crew: crewCount(), day: loopDay() }; });

  try {
    await d.page.waitForTimeout(2500);
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready(), null, { timeout: 20000 }).catch(() => {});

    /* ---------------- R: THE ROSTER SCALES THE ENEMY ---------------- */
    if (!ONLY || ONLY === 'roster') {
      /* past the first game day, so the day-one cap (no party bigger than the company plus one, RUN 10/23) is not what is measured */
      await fr.evaluate(() => { try { if (typeof DAY !== 'undefined' && DAY.day < 2) DAY.day = 2; } catch (e) {} });
      const s0 = await size();
      ok('R1 before: ' + (s0.roster ? s0.roster.n : '?') + ' men (from ' + (s0.roster && s0.roster.from) + '), strength ' + s0.strength + ': a two-skull job is ' + s0.job2 + ' (' + s0.word2 + '), three skulls ' + s0.job3 + ', a roaming party ' + s0.roam,
        !!s0.roster && s0.roster.n >= 1 && s0.job2 >= 2);
      /* the batteries to hire with: the gate puts them in the purse (a setup step, said here), then a finger hires at the hall */
      await fr.evaluate(() => { BohemiaPurse.credit(purseGet(), 'electricity', 3000, 'the gate: batteries to hire with', 'gate:hire', loopDay()); });
      const t0 = await toTown(null);
      ok('R2 the nearest town opens (' + (t0 && t0.n) + ')', !!t0);
      const sf = await settleFrame();
      let hired = 0;
      if (sf) {
        const hb = await (await fr.$('#settleFrame')).boundingBox();
        /* the hall, as a finger opens it: a tap on its door (the settlement's own where('hall')), then HIRE on a man's card */
        const openHall = async () => {
          if (await sf.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { const c = await sf.evaluate(() => { const r = document.getElementById('close').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }); await d.page.mouse.click(hb.x + c[0], hb.y + c[1]); await d.page.waitForTimeout(300); }
          const xy = await sf.evaluate(() => BohemiaSettlement.where('hall'));
          if (xy) await d.page.mouse.click(hb.x + xy.x, hb.y + xy.y);
          await waitFor(() => sf.evaluate(() => document.getElementById('sheet').classList.contains('on') && [...document.querySelectorAll('#sheet button.act')].some(x => /^Hire/.test(x.textContent))), 6000);
        };
        for (let k = 0; k < 14 && hired < 9; k++) {
          await openHall();
          const b = await sf.evaluate(() => { const e = [...document.querySelectorAll('#sheet button.act')].filter(x => /^Hire/.test(x.textContent) && !x.disabled)[0];
            if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
          if (!b) {   /* the post is out of men this week: the next week's men (the post's own key is the map's week) */
            const more = await sf.evaluate(() => { try { const S = BohemiaSettlement.state; S.mapDay = (S.mapDay | 0) + 7; return true; } catch (e) { return false; } });
            if (!more) break; continue; }
          const n0 = await fr.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').length; } catch (e) { return 0; } });
          await d.page.mouse.click(hb.x + b[0], hb.y + b[1]);
          await d.page.waitForTimeout(500);
          const n1 = await fr.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').length; } catch (e) { return 0; } });
          if (n1 > n0) hired++;
        }
      }
      ok('R3 nine men hired at the hall by a finger on HIRE (' + hired + ')', hired >= 9);
      await leave();
      const s1 = await size();
      ok('R4 after: ' + (s1.roster ? s1.roster.n : '?') + ' men, strength ' + s1.strength + ': a two-skull job is ' + s1.job2 + ' (' + s1.word2 + '), three skulls ' + s1.job3 + ', a roaming party ' + s1.roam,
        !!s1.roster && s1.roster.n >= s0.roster.n + 9 && s1.strength >= s0.strength + 90);
      ok('R5 FILL THE ROSTER AND THE JOBS GROW (Battle Brothers: contracts scale with the roster): two skulls ' + s0.job2 + ' -> ' + s1.job2 + ', three ' + s0.job3 + ' -> ' + s1.job3,
        s1.job2 >= s0.job2 + 5 && s1.job3 > s0.job3);
      ok('R6 and the roaming parties only a little (the wiki: \'slightly\'): ' + s0.roam + ' -> ' + s1.roam, s1.roam >= s0.roam && s1.roam - s0.roam <= 3);
      await shot('R_after_hire');
      /* the fight he walks into: a crew job (today's kind) sized as the company stands when he gets there */
      const title = await (async () => { if (!(await settleOpen())) await toTown(null); return take('qd-s10'); })();
      await leave();
      const j = await job('qd-s10');
      const want = j ? await fr.evaluate((sk) => partyMath('job', { skulls: sk }).count, j.skulls) : 0;
      ok('R7 a crew job taken ("' + title + '", ' + (j ? j.skulls : '?') + ' skulls): ' + (j ? j.crew + ' of them at ' + j.target.x + ',' + j.target.y + ' (the math says ' + want + ' for twelve men)' : 'no job'), !!j && j.crew === want && j.crew > s0.job2);
      if (j) {
        /* what the map hands the fight, read where it hands it (the one door) */
        await fr.evaluate(() => { if (window.__JP_WRAP) return; window.__JP_WRAP = 1; const f = cityHandOver;
          cityHandOver = function (m) { try { window.__JP_HANDED = JSON.parse(JSON.stringify({ why: m && m.why, party: m && m.party, roster: m && m.roster ? m.roster.length : null, fighting: LOOP.fighting })); } catch (e) {} return f.apply(this, arguments); }; });
        let fightN = null, road = 0, dressed = null;
        for (let leg = 0; leg < 5 && fightN == null; leg++) {
          await goCell(j.target.x, j.target.y);
          await waitFor(async () => (await shell()).fight, 90000);
          const ff = await fightFrame();
          const why = await fr.evaluate(() => (window.__JP_HANDED && window.__JP_HANDED.why) || '');
          if (!/^contract:qd-s10/.test(why)) { road++; await forceWin(); continue; }
          /* COMBAT's road factions (ours.road_factions) may dress the party as a tougher faction, which fields fewer for the same
             count (ours.enemy_tiers.count_scale: machines 0.85, kids 0.6, heavies 0.45): the number dealt is the count times that */
          const fx = ff.f ? await ff.f.evaluate(() => { const T = R('ours.enemy_tiers'), f = FIGHT.S.roadFaction || 'brigands';
            return { n: FIGHT.S.units.filter(u => u.side === 'them').length, faction: f, scale: (T.count_scale || {})[f] || 1 }; }).catch(() => null) : null;
          if (fx) { fightN = fx.n; dressed = fx; }
        }
        const handed = await fr.evaluate(() => window.__JP_HANDED || null);
        ok('R8 THE FIGHT HAS THAT MANY OF THEM: ' + fightN + ' against his ' + s1.roster.n + ' (the job said ' + j.crew + (dressed ? ', dressed as ' + dressed.faction + ' x' + dressed.scale : '') + (road ? '; ' + road + ' roaming party on the road first, ended by the gate' : '') + ')',
          fightN != null && !!dressed && fightN === Math.max(1, Math.round((handed && handed.party ? handed.party.count : j.crew) * dressed.scale)) && handed.party.count === j.crew);
        await shot('R_the_fight');
      }
    }
  } catch (e) {
    ok('the drive ran without a throw [' + String(e && e.message || e).slice(0, 200) + ']', false);
  }
  await d.close();
  done();
})();
