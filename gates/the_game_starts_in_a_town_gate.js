/* ==========================================================================
   THE GAME STARTS IN A TOWN  (RUN THREE, 10/26/26, VAMILY [the game starts in a town], rule 236(a)(b)(c)(e))

   PAOLO 10/26: "when the game starts up... some sort of introduction vibe where you get a close-up of the squad, and then instead
   of starting in map mode it will start on settlement mode... the closest settlement... whatever the math is right now... maybe
   depending on the origin that impacts where you will be."
   MEASURED BEFORE: BEGIN lifted the door onto the map at the origin's corner (__A_FRESH_START_AND_A_FOG_OF_WAR__); no squad, no town.

   LEGS (a stranger's new game: the demo, the dark on, the origin picked at the door):
     S1 *** HIS SQUAD UP CLOSE *** (three origins, the phone and the computer): the tape shows the men his origin rolled, every one,
        named as the crew screen names them (the same names stand in the town after it), then the crew together under the origin's
        name; nothing in its first second (it arms at one second or later)
     S2 *** THEN THE TOWN ***: the first screen after the tape is the settlement screen of the closest settlement to his start corner,
        by the map's own measure (blocks, the longer side), never the map
     S3 THE MAP WHEN HE LEAVES: a real tap on LEAVE and the map is on the glass, the company on the town's block
     S4 A TAP SKIPS IT, NEVER IN ITS FIRST SECOND (the same tape in the same page, real taps): a tap at half a second leaves it on,
        a tap after the second ends it at once; each man drawn as himself (his body moving, ANIMATION's cells, else his head)
     S5 THE BENCH IS UNTOUCHED: the checkers' valley (the dark lifted) begins on the map as before, no tape, no town
     S6 nothing threw
   node gates/the_game_starts_in_a_town_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const { leaveTown } = require(path.join(ROOT, 'tools', 'bohemia_leave_the_town.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE GAME STARTS IN A TOWN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SHOTS = process.env.BOHEMIA_SHOT_DIR || null;
const ARM = (origin) => "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = '" + origin + "'; s.reveal = 0; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.removeItem('bohemia.fog.off'); localStorage.removeItem('bohemia.laststart.v1'); } catch (e) {}";
const settleFrame = (P) => P.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));

(async () => {
  const errs = [], games = [];
  const ONLY = process.env.GATE_ONLY ? process.env.GATE_ONLY.split(',') : null;   /* GATE_ONLY=faith,wolf,bench runs a part (a lane's own look) */
  for (const [origin, profile] of [['faith', 'phone_portrait'], ['truck', 'phone_portrait'], ['wolf', 'computer']].filter(o => !ONLY || ONLY.indexOf(o[0]) >= 0)) {
    let d = null;
    try {
      d = await open({ profile, fog: true, arm: ARM(origin) });
      const P = d.page, fr = d.fr;
      /* the tape and the town, read when the town is open */
      for (let i = 0; i < 80; i++) { if (await fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await P.waitForTimeout(250); }
      await P.waitForTimeout(1500);
      const sf = settleFrame(P);
      if (sf) await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.crewTown().length >= 0, null, { timeout: 15000 }).catch(() => {});
      if (sf) await sf.waitForFunction(() => window.BohemiaRoster && BohemiaRoster.data && BohemiaRoster.data.xp, null, { timeout: 15000 }).catch(() => {});
      await P.waitForTimeout(1200);
      const up = await P.evaluate(() => window.__SQUAD_UP || null).catch(() => null) || await fr.evaluate(() => window.__SQUAD_UP || null);
      const m = await fr.evaluate(() => { const S = window.__START_IN_TOWN, F = window.__FRESH_START, bs = ctBases();
        let near = 99; for (const n in bs) { const b = bs[n]; if (b) near = Math.min(near, Math.max(Math.abs((b.x | 0) - F.at[0]), Math.abs((b.y | 0) - F.at[1]))); }
        return { S, F: F && { at: F.at, kind: F.kind, origin: F.origin }, near, open: LOOP.open && LOOP.open.name, shown: !!(LOOP.frame && LOOP.frame.style.display === 'block'), at: [city.x, city.y], company: (LOOP.start && LOOP.start.company || []).length }; });
      const town = sf ? await sf.evaluate(() => ({ place: BohemiaSettlement.state.place && BohemiaSettlement.state.place.name, crew: BohemiaSettlement.crewTown().map(x => x.name), camp: !!BohemiaSettlement.camp().camp })).catch(() => null) : null;
      if (SHOTS) await P.screenshot({ path: path.join(SHOTS, 'start_town_' + origin + '.png') });
      /* S3: a real tap on LEAVE (UI TWO, rules 238(a), 286(b): in the game the one LEAVE on screen is the phone's) */
      let left = null;
      if (sf) { await leaveTown(P, sf, { ms: 4000, mouse: profile === 'computer' });
        await P.waitForTimeout(1500);
        left = await fr.evaluate(() => ({ open: LOOP.open ? LOOP.open.name || 'camp' : null, shown: !!(LOOP.frame && LOOP.frame.style.display === 'block'), at: [city.x, city.y], mode: typeof MODE !== 'undefined' ? MODE : null }));
        if (SHOTS) await P.screenshot({ path: path.join(SHOTS, 'start_left_' + origin + '.png') }); }
      /* S4: the same tape replayed in the same page, real taps */
      let sk = null;
      if (origin !== 'truck') {
        await fr.evaluate(() => { const men = startSquad(LOOP.start); window.__REPLAY = { ended: null }; const top = window.top.document;
          BohemiaSquadUpClose.play({ men, origin: LOOP.start.origin, originName: LOOP.start.originName, crew: LOOP.start.name, doc: top, base: '../engine/', onDone: (r) => { window.__REPLAY.ended = Date.now(); window.__REPLAY.skipped = r.skipped; } }); window.__REPLAY.t0 = Date.now(); });
        const tap = async () => { const r = await P.evaluate(() => ({ w: innerWidth, h: innerHeight })); if (profile === 'computer') await P.mouse.click(r.w / 2, r.h * .7); else await P.touchscreen.tap(r.w / 2, r.h * .7); };
        await P.waitForTimeout(450); await tap(); await P.waitForTimeout(150);
        const early = await P.evaluate(() => !!document.getElementById('squadup') && !document.getElementById('squadup').classList.contains('out'));
        await P.waitForTimeout(1700);
        const heads = await P.evaluate(() => [...document.querySelectorAll('#squadup canvas[data-look]')].map(c => ({ look: c.dataset.look, face: c.dataset.face })));
        if (SHOTS) await P.screenshot({ path: path.join(SHOTS, 'start_tape_' + origin + '.png') });
        const t1 = Date.now(); await tap(); await P.waitForTimeout(500);
        const r = await fr.evaluate(() => window.__REPLAY); const gone = await P.evaluate(() => !document.getElementById('squadup'));
        sk = { early, heads, skipped: r.skipped, ms: r.ended ? r.ended - t1 : null, gone };
      }
      games.push({ origin, profile, up, m, town, left, sk, errs: d.errs.slice(0, 2) });
    } catch (e) { games.push({ origin, profile, err: String(e.message).slice(0, 200) }); }
    if (d) await d.close();
    report(games[games.length - 1]);
  }
  function report(g) {
    if (g.err) { ok('the ' + g.origin + ' game ran [' + g.err + ']', false); return; }
    const up = g.up || {}, S = (g.m && g.m.S) || {}, names = (S.intro && S.intro.men || []).map(x => x.name);
    const inTown = ['YOU'].concat(g.town ? g.town.crew : []);
    ok('*** S1 HIS SQUAD UP CLOSE *** (' + g.origin + ', ' + g.profile + '): the tape showed ' + (up.shown || []).length + ' of his ' + g.m.company + ' men (' + (up.shown || []).join(', ') + '), the crew together after, armed ' + (up.armedAt && up.started ? up.armedAt - up.started : '?') + ' ms in; the same men stand in the town',
      g.m.company >= 1 && (up.shown || []).length === g.m.company && up.group === true && up.armedAt - up.started >= 1000 && !!up.endedAt && names.length === g.m.company
      && names.every(n => n === 'YOU' || inTown.indexOf(n) >= 0) && inTown.length === names.length, JSON.stringify({ tape: names, town: inTown }));
    ok('*** S2 THEN THE TOWN *** (' + g.origin + '): the first screen after the tape is ' + S.town + "'s settlement screen, " + S.blocks + ' blocks from his corner (' + (g.m.F && g.m.F.kind) + '), the closest of every settlement (' + g.m.near + ')',
      !!S.town && S.opened >= up.endedAt - 50 && g.m.open === S.town && g.m.shown && !!g.town && g.town.place === S.town && !g.town.camp && S.blocks === g.m.near, JSON.stringify({ open: g.m.open, place: g.town && g.town.place }));
    ok('S3 THE MAP WHEN HE LEAVES (' + g.origin + '): a real tap on LEAVE and the map is on the glass, the company on ' + S.town + "'s block",
      !!g.left && !g.left.open && !g.left.shown && g.left.at[0] === g.m.at[0] && g.left.at[1] === g.m.at[1], JSON.stringify(g.left));
    if (g.sk) ok('S4 A TAP SKIPS IT, NEVER IN ITS FIRST SECOND (' + g.origin + ', ' + g.profile + '): a tap at half a second left it on, a tap after the second ended it in ' + g.sk.ms + ' ms; his own picture drawn (' + g.sk.heads.filter(h => h.face === 'cell').length + ' his body moving, ' + g.sk.heads.filter(h => h.face === 'fresh').length + ' his head, of ' + g.sk.heads.length + ')',
      g.sk.early && g.sk.skipped === true && g.sk.ms != null && g.sk.ms < 400 && g.sk.gone && g.sk.heads.length >= 1 && g.sk.heads.every(h => h.face === 'fresh' || h.face === 'cell'), JSON.stringify(g.sk.heads.slice(0, 4)));
    ok('S6 nothing threw (' + g.origin + ')', !g.errs.length, g.errs.join(' | '));
  }
  /* S5: the bench's valley */
  let b = null;
  if (!ONLY || ONLY.indexOf('bench') >= 0) try { b = await open({ profile: 'phone_portrait', fog: false });
    await b.page.waitForTimeout(6000);
    const r = await b.fr.evaluate(() => ({ st: window.__START_IN_TOWN || null, open: LOOP.open ? LOOP.open.name : null, fresh: window.__FRESH_START || null }));
    const tape = await b.page.evaluate(() => !!document.getElementById('squadup'));
    ok('S5 THE BENCH IS UNTOUCHED: the checkers\' valley (the dark lifted) begins on the map, no tape, no town', !r.st && !r.open && !tape, JSON.stringify(r).slice(0, 200));
  } catch (e) { ok('S5 the bench leg ran [' + String(e.message).slice(0, 160) + ']', false); }
  if (b) await b.close();
  done();
})();
