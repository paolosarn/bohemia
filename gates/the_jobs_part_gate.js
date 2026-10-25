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

   On his computer's screen (he played on his PC), JOBS_PART_PROFILE=phone_portrait for the phone.
   P   [eyes: paid before it lands]: a road fight on an escort says nothing about pay; the client says paid once, when the money
       lands, with the number that lands
   E   [eyes: a place that is nothing]: a click on SLOAN's name at the far stop walks there and its screen opens; PRIMM, named by a
       job, keeps its name clear of IVANPAH SOLAR's
   node gates/the_jobs_part_gate.js [roster|names|drop|pay|place]
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
  try { d = await drive.open({ keepCards: true, profile: process.env.JOBS_PART_PROFILE || 'computer' }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  const TOUCH = (process.env.JOBS_PART_PROFILE || 'computer') !== 'computer';
  /* a finger on a phone, the mouse on his computer */
  const tapAt = async (x, y) => { if (TOUCH) return d.tapAt(x, y); const h = await d.page.$('#cityFrame'), fb = h ? await h.boundingBox() : null; if (!fb) return null; return d.page.mouse.click(fb.x + x, fb.y + y); };   /* in the city frame's own pixels */
  const shot = async (n) => { if (SHOTS) await d.page.screenshot({ path: path.join(SHOTS, n + '.png') }); };
  const shell = () => d.page.evaluate(() => ({ fight: !!CITYFIGHT }));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await d.page.waitForTimeout(300); } return false; };
  const cityBox = async () => (await d.page.$('#cityFrame')).boundingBox();
  const goCell = async (x, y) => {
    const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y);
      return { x: r.left + q.sx, y: r.top + q.sy + TH / 2, on: mapOnGlass(x, y) }; }, [x, y]);
    if (p.on) { await tapAt(p.x, p.y); await d.page.waitForTimeout(150);
      const set = await fr.evaluate(([x, y]) => (TRAVEL && TRAVEL.to && Math.max(Math.abs(TRAVEL.to[0] - x), Math.abs(TRAVEL.to[1] - y)) <= 2) || Math.max(Math.abs(city.x - x), Math.abs(city.y - y)) <= 1 || !!LOOP.fighting, [x, y]);
      if (set || (await shell()).fight) return 'touch'; }
    await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, [x, y]); return p.on ? 'touch, then travelTo' : 'travelTo';
  };
  const unpause = async () => {
    const one = await fr.evaluate(() => { const e = [...document.querySelectorAll('button,div')].filter(x => /^1X$/i.test((x.textContent || '').trim()) && x.getBoundingClientRect().width > 10)
      .sort((a, b) => a.getBoundingClientRect().width - b.getBoundingClientRect().width)[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (one) { await tapAt(one.x, one.y); await d.page.waitForTimeout(300); }
    await fr.evaluate(() => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); });
  };
  const fightFrame = async () => { for (let i = 0; i < 120; i++) { const h = await d.page.$('#fightFrame');
      if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) return { f, box: await h.boundingBox() }; }
      await d.page.waitForTimeout(200); } return { f: null, box: null }; };
  const spoilsLeave = async () => {
    const up = await waitFor(() => d.page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !CITYFIGHT), 15000);
    const h = await d.page.$('#spoilsdoor iframe'); if (!h) return false;
    const sf = await h.contentFrame(), box = await h.boundingBox();
    const b = sf && box ? await sf.waitForFunction(() => { const e = document.getElementById('leave'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, null, { timeout: 10000 }).then(x => x.jsonValue()).catch(() => null) : null;
    if (b && box) await d.page.mouse.click(box.x + b[0], box.y + b[1]); else await d.page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
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

    /* ---------------- N: EVERY PLACE A JOB NAMES IS ON THE MAP, NAMED AND MARKED ---------------- */
    if (!ONLY || ONLY === 'names') {
      await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; render(); });
      if (!(await settleOpen())) await toTown(null);
      const here = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      const title = await take('qd-ar05'); await leave();
      let j = await job('qd-ar05');
      /* the region's real places come with the land's painting, later than the map on a slow box: a job that names one waits for it */
      if (j && j.stage === 'wait') {
        const t0 = Date.now(); await waitFor(async () => { const jj = await job('qd-ar05'); return !jj || jj.stage !== 'wait'; }, 300000);
        j = await job('qd-ar05');
        ok('N0 PRIMM was not on the map yet when the job was taken: the job waited ' + Math.round((Date.now() - t0) / 1000) + ' s for it, and never went to a made place wearing its name (' + (j ? j.stage : 'gone') + ')', !!j && j.stage === 'haul');
      }
      const real = await fr.evaluate(() => { const p = (BOH_REGION.places || []).filter(q => q.name === 'PRIMM')[0]; return p ? { x: p.x, y: p.y } : null; });
      ok('N1 "' + title + '" taken at ' + here + ': the carts go to ' + (j && j.dest ? j.dest.name + ' at ' + j.dest.x + ',' + j.dest.y : 'nowhere') + ' (the real PRIMM is at ' + (real ? real.x + ',' + real.y : '?') + '), not to a town the dice picked',
        !!j && !!j.dest && j.dest.name === 'PRIMM' && !!real && j.dest.x === real.x && j.dest.y === real.y && j.plays === 'haul-caravan');
      const said = await fr.evaluate(() => (LOOP.said || []).slice(-3).join(' | '));
      ok('N2 the job says the place, which way and how far ("' + said.slice(0, 200) + '")', /PRIMM, (south|north|east|west|south-east|south-west|north-east|north-west), about \d+ blocks/.test(said));
      await fr.evaluate(() => render());
      let m = await fr.evaluate(() => (window.__JOB_MARKS || []).filter(x => x.id === 'qd-ar05')[0] || null);
      ok('N3 PRIMM is off the glass, and its name waits at the glass\'s edge, pointing (' + (m ? '"' + m.label + '" at ' + m.ex + ',' + m.ey + ', on the glass: ' + m.on : 'no mark') + ')',
        !!m && !m.on && m.label === 'ESCORT TO PRIMM' && m.ex >= 0 && m.ey >= 0);
      const named = await fr.evaluate((from) => ({ says: BohemiaJobKinds.names(from), plate: (window.__GROUNDLABELS || []).some(b => b.t === String(from).toUpperCase()) }), j.from);
      ok('N4 the client\'s town, ' + j.from + ', is named on the map while the job is held (' + JSON.stringify(named) + ')', named.says === 'named' && named.plate);
      await shot('N_edge_primm');
      /* a finger on the name at the edge walks toward PRIMM */
      if (m && m.box) {
        const cv = await fr.evaluate(() => { const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left, y: r.top }; });
        const fb = await cityBox();
        await d.page.mouse.click(fb.x + cv.x + m.box[0] + m.box[2] / 2, fb.y + cv.y + m.box[1] + 5);
        await d.page.waitForTimeout(400);
      }
      const go = await fr.evaluate(() => TRAVEL && TRAVEL.to ? TRAVEL.to.slice() : null);
      j = await job('qd-ar05');
      ok('N5 a touch on that name sets out for PRIMM (' + JSON.stringify(go) + ', the gate at ' + (j ? j.target.x + ',' + j.target.y : '?') + ')', !!go && !!j && Math.max(Math.abs(go[0] - j.target.x), Math.abs(go[1] - j.target.y)) <= 1);
      /* the road to PRIMM, with whoever comes for the carts on it (a fight the gate ends as cleared, said) */
      let fights = 0, arrived = false;
      for (let k = 0; k < 12 && !arrived; k++) {
        const t0 = Date.now();
        await waitFor(async () => (await shell()).fight || !(await job('qd-ar05')) || await fr.evaluate(() => !TRAVEL), 240000);
        if ((await shell()).fight) { fights++; await forceWin(); }
        j = await job('qd-ar05');
        if (!j) { arrived = true; break; }
        const near = await fr.evaluate(() => { render(); const mk = (window.__JOB_MARKS || []).filter(x => x.id === 'qd-ar05')[0]; return mk && mk.on; });
        if (near && !(await fr.evaluate(() => window.__JP_SAW_PRIMM))) {
          await fr.evaluate(() => { window.__JP_SAW_PRIMM = { jobNamed: BOH_REGION.jobNamed | 0, rings: MAP_DREW.jobRings | 0 }; });
          await shot('N_primm_on_the_glass');
        }
        if (!(await fr.evaluate(() => !!TRAVEL))) await goCell(j.target.x, j.target.y);
      }
      const saw = await fr.evaluate(() => window.__JP_SAW_PRIMM || null);
      ok('N6 on the way, PRIMM comes onto the glass named by its own plate and ringed (' + JSON.stringify(saw) + ')', !!saw && saw.jobNamed >= 1);
      const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-ar05')[0];
      const lostj = (await fr.evaluate(() => window.__JOB_LOST || [])).filter(p => p.id === 'qd-ar05')[0];
      const where = await fr.evaluate(() => { const t = loopTownAt(city.x, city.y, 2); return t ? t.name : null; });
      ok('N7 THE CARTS ARRIVE IN PRIMM (' + (paid ? 'paid ' + paid.paid + ' of ' + paid.of : lostj ? 'lost on the road' : 'not yet') + '; he stands at ' + where + '; ' + fights + ' fights on the road, ended by the gate)',
        !!paid && where === 'PRIMM');
      await shot('N_in_primm');
      if (await settleOpen()) await leave();
      /* a made place: the pump station, named on the map where the job is */
      await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; render(); });
      if (!(await settleOpen())) await toTown(null);
      await take('qd-ap01'); await leave();
      const r = await job('qd-ap01');
      await fr.evaluate(() => render());
      const rm = await fr.evaluate(() => (window.__JOB_MARKS || []).filter(x => x.id === 'qd-ap01')[0] || null);
      const plates = await fr.evaluate(() => (BohemiaJobKinds.hits() || []).length);
      ok('N8 a place the words make up is named where it is: ' + (rm ? '"' + rm.label + '"' + (rm.on ? ' on the glass at ' + rm.sx + ',' + rm.sy : ' at the edge') : 'no mark') + ', the take line "' + (await fr.evaluate(() => (LOOP.said || []).slice(-1)[0] || '')).slice(0, 140) + '"',
        !!r && !!rm && rm.name === 'THE PUMP STATION' && plates >= 1 && /THE PUMP STATION/.test(await fr.evaluate(() => (LOOP.said || []).join(' '))));
      await shot('N_pump_station');
      /* every row that names a real place resolves to it on this map */
      const reals = await fr.evaluate(() => { const D = BohemiaJobKinds.data(), out = []; for (const id in D.offers) { const p = D.offers[id].place; if (p && p.real) out.push({ id, real: p.real, found: !!BohemiaJobKinds.realPlace(p.real) }); } return out; });
      ok('N9 every real place a row names is on this map (' + reals.map(x => x.real + (x.found ? '' : ' MISSING')).join(', ') + ')', reals.length >= 5 && reals.every(x => x.found));
    }

    /* ---------------- D: DROP A JOB, BATTLE BROTHERS' WAY ---------------- */
    if (!ONLY || ONLY === 'drop') {
      await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; render(); });
      if (!(await settleOpen())) await toTown(null);
      const town = await fr.evaluate(() => LOOP.open && LOOP.open.name);
      await take('qd-ap01'); await leave();
      const j = await job('qd-ap01');
      const cost = await fr.evaluate(() => BohemiaJobKinds.dropCost('qd-ap01'));
      ok('D1 a job held (' + (j ? j.title : 'none') + ' from ' + town + '), and what dropping it costs, before he does: ' + (cost ? cost.place + ' ' + cost.before + ' to ' + cost.after + ' (' + cost.band + ' to ' + cost.bandAfter + ', Battle Brothers\' cancel_contract ' + cost.delta + ')' : 'nothing'),
        !!j && !!cost && cost.place === town && cost.delta === -10 && cost.after === Math.max(0, cost.before - 10));
      const r = await fr.evaluate(() => BohemiaJobKinds.drop('qd-ap01'));
      await d.page.waitForTimeout(900);
      const after = await fr.evaluate(() => ({ held: LOOP.held.map(h => h.id), said: (LOOP.said || []).slice(-1)[0] || '', marks: (window.__JOB_MARKS || []).filter(m => m.id === 'qd-ap01').length, q: BohemiaJobKinds.settledPeek(), phone: (window.__PHONE_BOARD && __PHONE_BOARD.shown || []).map(a => a.id) }));
      ok('D2 DROPPED: the job is gone, nobody pays, and the line says what it cost ("' + after.said + '")', !!r && r.ok && after.held.indexOf('qd-ap01') < 0 && /Dropped/.test(after.said) && after.said.indexOf(String(town).toUpperCase()) >= 0 && /\d+ to \d+/.test(after.said));
      ok('D3 its marks are off the map, and it does not come back on the phone (' + after.marks + ' marks; phone ' + JSON.stringify(after.phone) + ')', after.marks === 0 && after.phone.indexOf('qd-ap01') < 0);
      ok('D4 the cost waits for the town\'s bar (' + JSON.stringify(after.q) + ')', after.q.some(c => c.place === town && c.act === 'cancel_contract'));
      /* the next town he opens takes it: the client's own bar, the settlement's [the opinion moves] */
      await toTown(town);
      await d.page.waitForTimeout(1500);
      const bar = await fr.evaluate((t) => { try { const r = JSON.parse(localStorage.getItem('bohemia.relations.v1') || 'null'); return r && r.bars ? r.bars[t] : null; } catch (e) { return null; } }, town);
      const q2 = await fr.evaluate(() => BohemiaJobKinds.settledPeek().length);
      ok('D5 THE TOWN\'S BAR PAYS FOR IT: ' + town + ' at ' + bar + ' (was ' + (cost && cost.before) + '), nothing left waiting (' + q2 + ')', bar != null && cost && Math.abs(bar - cost.after) < 0.01 && q2 === 0);
      await leave();
      /* not in the middle of its own fight */
      await take('qd-s10'); await leave();
      const cj = await job('qd-s10');
      let inFight = null;
      if (cj) {
        await fr.evaluate(() => { if (window.__JP_WRAP) return; window.__JP_WRAP = 1; const f = cityHandOver;
          cityHandOver = function (m) { try { window.__JP_HANDED = JSON.parse(JSON.stringify({ why: m && m.why, party: m && m.party })); } catch (e) {} return f.apply(this, arguments); }; });
        for (let leg = 0; leg < 5 && inFight == null; leg++) {
          await goCell(cj.target.x, cj.target.y);
          await waitFor(async () => (await shell()).fight, 90000);
          await fightFrame();
          const why = await fr.evaluate(() => (window.__JP_HANDED && window.__JP_HANDED.why) || '');
          if (!/^contract:qd-s10/.test(why)) { await forceWin(); continue; }
          inFight = await fr.evaluate(() => BohemiaJobKinds.drop('qd-s10'));
          await forceWin();
        }
      }
      ok('D6 not in the middle of its own fight (' + JSON.stringify(inFight) + ')', !!inFight && inFight.ok === false && inFight.why === 'fighting');
      const done = await fr.evaluate(() => (window.__JOB_SETTLED_ACTS || []).filter(a => a.id === 'qd-s10').map(a => a.act + ' ' + a.delta));
      ok('D7 and a job done moves the bar the other way (Battle Brothers\' civilian contract done +10): ' + JSON.stringify(done), done.some(a => /civilian_contract_done 10/.test(a)));
      /* the button is UI's (UI [the PC playtest: the UI's part] (5)): said, not judged here */
      const btn = await fr.evaluate(() => [...document.querySelectorAll('button,[role=button]')].filter(e => /\bdrop\b/i.test(e.textContent || '') || e.dataset.drop != null).length);
      console.log('  info D8 UI\'s DROP on the phone and the job card: ' + (btn ? btn + ' drawn' : 'not drawn yet (UI\'s row (5))'));
    }

    /* ---------------- P: [eyes: paid before it lands] (EYES round 2, new 5): THE CLIENT SAYS PAID ONCE, WHEN IT LANDS ---------------- */
    if (!ONLY || ONLY === 'pay') {
      await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; window.__JOB_PAY_SAID = null; render(); });
      if (!(await settleOpen())) await toTown(null);
      await take('qd-a02'); await leave();
      let j = await job('qd-a02');
      ok('P1 "Ride shotgun to the salt camp" taken: ' + (j ? j.cargo.n + ' ' + j.cargo.unit + 's to ' + j.dest.name : 'no job'), !!j && j.plays === 'haul-caravan');
      let roadFight = null, saidMid = null, fights = 0;
      for (let k = 0; k < 10 && j; k++) {
        if (!(await fr.evaluate(() => !!TRAVEL))) await goCell(j.target.x, j.target.y);
        await waitFor(async () => (await shell()).fight || !(await job('qd-a02')) || await fr.evaluate(() => !TRAVEL), 180000);
        if ((await shell()).fight) {
          fights++; await forceWin();
          if (roadFight == null && (await job('qd-a02'))) { roadFight = true;
            await d.page.waitForTimeout(1500);
            saidMid = await fr.evaluate(() => ({ said: window.__JOB_PAY_SAID, shown: ((window.__VOICE && __VOICE.shown) || []).filter(x => x.id === 'pay:qd-a02').map(x => x.tag + ' ' + x.line), bats: loopBats() })); }
        }
        j = await job('qd-a02');
      }
      ok('P2 A ROAD FIGHT MID-JOB SAYS NOTHING ABOUT PAY: the job goes on (' + (roadFight ? JSON.stringify(saidMid) : 'no road fight this run') + ')',
        !roadFight || (!saidMid.said && saidMid.shown.length === 0));
      const paid = (await fr.evaluate(() => window.__JOB_PAID || [])).filter(p => p.id === 'qd-a02')[0];
      const said = await fr.evaluate(() => window.__JOB_PAY_SAID);
      ok('P3 AND WHEN IT LANDS, ONCE, WITH THE NUMBER THAT LANDS: paid ' + (paid ? paid.paid + ' of ' + paid.of : 'nothing') + ', the client says ' + JSON.stringify(said),
        !!paid && !!said && said.id === 'qd-a02' && said.paid === paid.paid && said.line && said.line.indexOf(String(paid.paid)) === 0);
    }

    /* ---------------- E: [eyes: a place that is nothing] (EYES round 2, new 18): A NAME YOU CAN TRAVEL TO IS SOMETHING ---------------- */
    if (!ONLY || ONLY === 'place') {
      await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; render(); });
      if (await settleOpen()) await leave();
      await waitFor(() => fr.evaluate(() => !!(window.BOH_REGION && BOH_REGION.ready)), 120000);
      /* the far stop, by the wheel on his computer, then a click on SLOAN's name where it is drawn */
      const fb = await cityBox();
      const cv = await fr.evaluate(() => { const r = document.getElementById('cv').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
      for (let i = 0; i < 25; i++) { await d.page.mouse.move(fb.x + cv.x + cv.w / 2, fb.y + cv.y + cv.h / 2); await d.page.mouse.wheel(0, 400); await d.page.waitForTimeout(120); }
      await d.page.waitForTimeout(1200);
      const q = await fr.evaluate(() => { render(); const b = (BOH_REGION.nameBoxes || []).filter(x => x[3] === 'SLOAN')[0]; return b ? { x: b[0] + b[2] / 2, y: b[1] + 6 } : null; });
      ok('E1 at the far stop SLOAN is named on the map (' + JSON.stringify(q) + ')', !!q);
      if (q) await d.page.mouse.click(fb.x + cv.x + q.x, fb.y + cv.y + q.y);
      await d.page.waitForTimeout(600);
      const go = await fr.evaluate(() => TRAVEL && TRAVEL.to ? TRAVEL.to.slice() : null);
      await waitFor(async () => await settleOpen() || (await shell()).fight || await fr.evaluate(() => !TRAVEL), 240000);
      if ((await shell()).fight) { await forceWin(); const sl = await fr.evaluate(() => { const p = BOH_REGION.places.filter(x => x.name === 'SLOAN')[0]; return townDoor(p.x, p.y); }); await goCell(sl[0], sl[1]); await waitFor(settleOpen, 240000); }
      await waitFor(settleOpen, 8000);
      const at = await fr.evaluate(() => ({ open: LOOP.open && LOOP.open.name, here: (loopTownAt(city.x, city.y, 1) || {}).name }));
      ok('E2 A CLICK ON THE NAME GOES SOMEWHERE THAT IS SOMETHING: set out for ' + JSON.stringify(go) + ', and SLOAN\'s screen opens (' + JSON.stringify(at) + ')', !!go && at.open === 'SLOAN');
      await shot('E_sloan_opens');
      /* PRIMM, named by a job (taken here at SLOAN's board), is never under IVANPAH SOLAR's name */
      await fr.evaluate(() => { LOOP.held = []; render(); });
      await take('qd-ar05'); await leave();
      await waitFor(async () => { const jj = await job('qd-ar05'); return !jj || jj.stage !== 'wait'; }, 120000);
      const pr = await fr.evaluate(() => { const P = BOH_REGION.places.filter(x => x.name === 'PRIMM')[0]; const r = document.getElementById('cv');
        /* PRIMM on the glass: the camera over it, the way a drag puts it there */
        const was = [panX, panY]; panX += (CVW / 2) - (CVW / 2 - (city.x - city.y) * TW / 2 + panX + (P.x - P.y) * TW / 2); panY += (CVH / 2) - (CVH / 2 - (city.x + city.y) * TH / 2 + panY + (P.x + P.y) * TH / 2);
        try { clampPan(); } catch (e) {} render();
        const B = BOH_REGION.nameBoxes || [], a = B.filter(x => x[3] === 'PRIMM')[0], b = B.filter(x => x[3] === 'IVANPAH SOLAR')[0];
        const over = !!(a && b && a[0] < b[0] + b[2] && a[0] + a[2] > b[0] && a[1] < b[1] + 13 && a[1] + 13 > b[1]);
        return { primm: a, ivanpah: b, over: over, jobNamed: BOH_REGION.jobNamed }; });
      ok('E3 PRIMM, the place a job names, keeps its name clear of IVANPAH SOLAR\'s (' + JSON.stringify(pr) + ')', !!pr.primm && !pr.over && pr.jobNamed >= 1);
      await shot('E_primm_and_ivanpah');
    }
  } catch (e) {
    ok('the drive ran without a throw [' + String(e && e.message || e).slice(0, 200) + ' ' + String(e && e.stack || '').split('\n').filter(l => /the_jobs_part_gate/.test(l)).slice(0, 2).join(' ').replace(/\s+/g, ' ').slice(0, 200) + ']', false);
  }
  await d.close();
  done();
})();
