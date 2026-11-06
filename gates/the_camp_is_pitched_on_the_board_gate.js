/* THE CAMP IS PITCHED ON THE BOARD GATE (CAMP THREE, 11/6/26; VAMILY rule 406, ask line 449).
   PAOLO 11/4, AN EXECUTIVE DECISION, LOCKED: 'it's not feeling natural at all... the camp only takes place on combat grid maps... the
   camp could take up one tile or four tiles in a square and keep getting bigger... so you don't have to make two different types of
   camps... anytime you camp it's on the combat grid'.
   WHY THIS WALKS THE CUT (rule 179: done means he can see it): the demo he plays, the phone on its side and upright. The gate's own
   fixtures, said out loud: he leaves the start town by its LEAVE (tools/bohemia_leave_the_town.js) and, if the map came back at the
   street stop, the map's own seam (swapMode) takes him out to the map, where HEAL makes camp; the roaming hunters are kept off so the
   camp under test is not broken by them (CAMP's rule 267(a) has its own gate); the blocks he camps on are chosen by the gate (three
   blocks of three different kinds near him, his marker set there, as the a-town-is-safe gate sets it on a town); the bigger companies
   of B2 are asked of the camp's own board module with the company's numbers, on the same block; the crew of B4 is handed through the
   map's one door with ENGAGE already pressed (the card's way back in, as __MEET_BEFORE_YOU_FIGHT__ sends it).
     B1 *** MAKING CAMP OPENS THAT BLOCK'S BOARD *** on three blocks of three kinds: the camp screen's ground is the fight board of the
        block he stands on (its district, its cell, the camp's die), the very board the fight's own page deals for a fight there with
        the same hand-over (a second copy of the fight page, dealt on its own, block for block), and the three boards are not one board
     B2 *** SIZED TO THE COMPANY *** his company's tiles are engine/bohemia_camp_life.js square() (one house tile to three men, two
        side by side to eight, a 2 by 2 past that, never more than four connected, rule 406(h) amended 11/6), every tile open ground,
        every piece of the camp standing inside them; asked for six and for twelve men on the same block: two tiles, then the 2 by 2
     B3 *** THE OLD CAMP PICTURE NEVER SHOWS *** from the press to three seconds after the board is in, the camp screen's ground is
        only ever the dark wait or the board, never the retired sand (camp_two/plate*) nor the settlement packs' camp pictures; the
        sand's files are gone from slices/ (404); and the crew screen opened at camp sees the camp screen's own picture, the board
     B4 *** A CREW AT CAMP FIGHTS HIM THERE *** a crew that reaches the camp opens the fight on the same board, block for block, with the
        camp standing on its square: every piece handed, drawn on the fight's glass
     B5 *** IN A TOWN, THE TOWN'S SCREEN *** HEAL in a town rests in the town's own screen (rule 273): no camp screen, no board asked
     B7 *** CAMP HERE FROM THE VICTORY SCREEN *** (rule 406(f)(g), AMENDED 11/6) B4's fight won (its band struck dead, as the
        make-camp-from-the-fight gate wins its fight), MAKE CAMP pressed on the end screen: the camp stands on that fight's own board
        (its fingerprint at the win), every body drawn where it fell, the camp on the tiles where they lie, and by day his men with an
        easy job go through them
     B6 nothing threw
   node gates/the_camp_is_pitched_on_the_board_gate.js [--profile phone_landscape|phone_portrait|computer]   (no flag: the phone both ways) */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const { leaveTown } = require(path.join(ROOT, 'tools/bohemia_leave_the_town.js'));
let pass = 0, fail = 0;
const BOARD_SRC = /^data:image\/(webp|jpeg)/;   /* the board's picture, made by slices/bohemia_camp_board.js; the wait is a one-pixel gif */
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + String(x).slice(0, 900) + ']' : '')); };

async function run(profile) {
  const P = '[' + profile + '] ';
  let d;
  try { d = await drive.open({ keepCards: true, profile, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok(P + 'the demo boots [' + String(e.message).slice(0, 160) + ']', false); return; }
  const p = d.page, fr = d.fr, errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const settle = () => p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
  try {
    await p.waitForTimeout(3500);
    if (await fr.evaluate(() => !!(LOOP.open && LOOP.open.name))) { await leaveTown(p, settle(), { ms: 5000 }); await p.waitForTimeout(2500); }
    if ((await fr.evaluate(() => MODE)) !== 'city') { await fr.evaluate(() => { try { swapMode(); } catch (e) {} }); await p.waitForTimeout(1500); }
    await fr.evaluate(() => { window.__GATE_KEEP_OFF = setInterval(function () { try { if (HUNT && !HUNT.__gate) HUNT = null; } catch (e) {} }, 100); });
    /* three blocks of three kinds near him, none a town's */
    const blocks = await fr.evaluate(() => {
      const x0 = city.x | 0, y0 = city.y | 0, seen = {}, out = [], bs = ctBases(), town = {};
      Object.keys(bs).forEach(n => { town[(bs[n].x | 0) + ',' + (bs[n].y | 0)] = 1; });
      for (let r = 2; r < 40 && out.length < 3; r++) for (let dy = -r; dy <= r && out.length < 3; dy++) for (let dx = -r; dx <= r && out.length < 3; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = x0 + dx, y = y0 + dy, c = om.at(x, y); if (!c || !c.district || seen[c.district] || town[x + ',' + y]) continue;
        if (/^(water|reservoir|lake)$/.test(c.district)) continue;
        seen[c.district] = 1; out.push({ x, y, district: c.district }); }
      return out; });
    const boards = [];
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const made = await fr.evaluate((q) => { try { if (CAMP.on) BohemiaMapCamp.break(); } catch (e) {} city.x = q.x + 0.5; city.y = q.y + 0.5; TOWN_EXIT = null;
        try { if (LOOP.frame && LOOP.open) loopClose(); } catch (e) {} return BohemiaMapCamp.make(); }, b);
      /* B3's watch: every 100 ms, the ground the camp screen has */
      const srcs = []; let sf = null, st = null, inAt = null;
      for (let k = 0; k < 200; k++) { await p.waitForTimeout(100);
        sf = settle(); if (!sf) continue;
        st = await sf.evaluate(() => { try { return { src: BohemiaSettlement.camp2().src || '', camp2: !!BohemiaSettlement.camp2().camp2 && BohemiaSettlement.camp().camp, drawn: (window.BohemiaSettlement && BohemiaSettlement.drawnSrc && BohemiaSettlement.drawnSrc()) || '', camp: BohemiaSettlement.camp().camp, b: BohemiaCampLook.board() }; } catch (e) { return null; } }).catch(() => null);
        if (!st) continue; if (st.camp2) srcs.push(st.src);   /* what the camp screen draws, from the moment it is the camp's (before its OPEN lands the frame is the last place's, faded to nothing by the moments-between) */
        if (st.b && st.b.state === 'in' && BOARD_SRC.test(st.src) && inAt == null) inAt = k;
        if (inAt != null && k - inAt >= 30) break;
        if (st.b && st.b.state === 'failed') break; }
      const ask = await fr.evaluate(() => campBoardAsk());
      const camp = await fr.evaluate(() => (CAMP.pitch ? { x: CAMP.pitch.x, y: CAMP.pitch.y, w: CAMP.pitch.w, h: CAMP.pitch.h, n: CAMP.pitch.n, pieces: CAMP.pitch.pieces, sig: CAMP.pitch.sig } : null));
      const plan = await sf.evaluate(() => { try { return { men: BohemiaCampLook.state().men, carrier: BohemiaCampLook.state().carrier }; } catch (e) { return null; } }).catch(() => null);
      boards.push({ b, made, srcs, st, ask, camp, plan, inAt });
    }
    /* the very board a fight there deals: a second copy of the fight page where a fight's page sits (the shell, beside the map), dealt
       on its own from the same hand-over through the shell's own door, held at its deployment (no turn played, nothing sent home) */
    const dealt = [];
    for (const r of boards) {
      if (!r.ask) { dealt.push(null); continue; }
      dealt.push(await p.evaluate(async (a) => {
        let o = null; try { const keep = { h: window.__NF_HANDED, c: window.__NF_COND }; o = nfOpts(JSON.parse(JSON.stringify(a))); window.__NF_HANDED = keep.h; window.__NF_COND = keep.c; } catch (e) { return 'no door: ' + e; }
        o.deal = a.__deal >>> 0; o.keep = false; o.resume = false; o.odds = false; o.auto = false; o.deploy = true; o.teach = false;
        const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;left:-9000px;top:0;width:480px;height:320px;border:0;visibility:hidden';
        const iv = setInterval(() => { try { const cw = f.contentWindow; if (cw && /BOHEMIA_FIGHT/.test(cw.location.href) && !cw.FIGHT_OPTS) cw.FIGHT_OPTS = o; } catch (e) {} }, 4);
        f.src = 'BOHEMIA_FIGHT.html'; document.body.appendChild(f);
        let sig = null; for (let k = 0; k < 240 && !sig; k++) { await new Promise(res => setTimeout(res, 250)); try { const cw = f.contentWindow; if (cw.FIGHT_UI && cw.FIGHT_UI.board && cw.campBoardSig) sig = cw.campBoardSig(); } catch (e) {} }
        clearInterval(iv); try { f.contentWindow.__fightLetGo && f.contentWindow.__fightLetGo(); } catch (e) {} f.remove();
        return sig; }, r.ask));
    }
    const B1 = boards.map((r, i) => ({ district: r.b.district, bakes: r.st && r.st.b && r.st.b.bakes, made: r.made, state: r.st && r.st.b && r.st.b.state, ms: r.st && r.st.b && r.st.b.ms, board: r.st && r.st.b && r.st.b.board && r.st.b.board.name,
      fromDistrict: r.st && r.st.b && r.st.b.board && r.st.b.board.district, cell: r.st && r.st.b && r.st.b.opts && r.st.b.opts.cell, laid: !!(r.st && r.st.b && r.st.b.board && r.st.b.board.laid),
      sig: r.st && r.st.b && r.st.b.board && r.st.b.board.sig, fight: dealt[i], same: !!(r.st && r.st.b && r.st.b.board && dealt[i] && r.st.b.board.sig === dealt[i]) }));
    const distinct = new Set(boards.map(r => r.st && r.st.b && r.st.b.board && r.st.b.board.sig)).size;
    ok(P + 'B1 *** MAKING CAMP OPENS THAT BLOCK\'S BOARD *** on ' + boards.length + ' blocks of ' + boards.length + ' kinds: the camp\'s ground is the board the fight\'s own page deals for a fight there, block for block; the boards differ',
      boards.length === 3 && B1.every((r, i) => r.made && r.state === 'in' && r.fromDistrict === (boards[i].ask && boards[i].ask.district) && Array.isArray(r.cell) && r.cell[0] === boards[i].b.x && r.cell[1] === boards[i].b.y && r.same) && distinct >= 2,
      JSON.stringify({ B1, distinct }));
    /* ---- B2 ---- */
    const last = boards[boards.length - 1], lsf = settle();
    const b2 = await lsf.evaluate(() => { const C = BohemiaCampBoard.state(), L = BohemiaCampLook.state(), sq = BohemiaCampLife.square({ men: L.men, level: 0 });
      return { n: C.pitch && C.pitch.n, w: C.pitch && C.pitch.w, h: C.pitch && C.pitch.h, want: sq, men: L.men, pitch: C.pitch }; });
    const inside = last.camp ? last.camp.pieces.every(q => q.u >= last.camp.x - 0.02 && q.u <= last.camp.x + last.camp.w + 0.02 && q.v >= last.camp.y - 0.02 && q.v <= last.camp.y + last.camp.h + 0.02) : false;
    const openTiles = await lsf.evaluate(() => { const B = BohemiaCampBoard._B, g = B.out && B.out.grid, s = B.pitch; if (!g || !s) return null; let all = true; for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) if (!g.ok[s.y + j][s.x + i]) all = false; return all; });
    const bigger = [];
    await fr.evaluate(() => { try { if (CAMP.on) BohemiaMapCamp.break(); } catch (e) {} });   /* the camp's own hours would ask its own company's board again under the fixture */
    await p.waitForTimeout(600);
    for (const men of [6, 12]) {
      await lsf.evaluate((m) => { const B = BohemiaCampBoard._B; window.__B2_ASK = B.ask; window.__B2_KIT = B.kit; BohemiaCampBoard.want(B.ask, Object.assign({}, B.plan, { men: m, followers: [] }), B.kit); }, men);
      let s2 = null; for (let k = 0; k < 120; k++) { await p.waitForTimeout(250); s2 = await lsf.evaluate(() => BohemiaCampBoard.state()); if (s2.state === 'in' || s2.state === 'failed') break; }
      const g2 = await lsf.evaluate(() => { const B = BohemiaCampBoard._B, g = B.out && B.out.grid, s = B.pitch; if (!g || !s) return null; let all = true; for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) if (!g.ok[s.y + j][s.x + i]) all = false; return all; });
      bigger.push({ men, n: s2.pitch && s2.pitch.n, w: s2.pitch && s2.pitch.w, h: s2.pitch && s2.pitch.h, state: s2.state, open: g2, same: s2.board && last.st.b.board && s2.board.sig === last.st.b.board.sig, board: s2.board && s2.board.name, was: last.st.b.board && last.st.b.board.name, bakes: s2.bakes, opts: s2.opts, wasOpts: last.st.b.opts, both: s2.sameBoth });
    }
    /* his own company's board back for B4 */
    await lsf.evaluate(() => { const B = BohemiaCampBoard._B; BohemiaCampBoard.want(B.ask, Object.assign({}, B.plan, { men: BohemiaCampLook.state().men }), B.kit); });
    for (let k = 0; k < 120; k++) { await p.waitForTimeout(250); if ((await lsf.evaluate(() => BohemiaCampBoard.state().state)) === 'in') break; }
    await p.waitForTimeout(800);
    ok(P + 'B2 *** SIZED TO THE COMPANY *** his ' + b2.men + ' men: ' + b2.n + ' tile(s), ' + b2.w + ' by ' + b2.h + ' (square() says ' + JSON.stringify(b2.want) + '), every tile open ground, every piece inside them; six men two side by side, twelve a 2 by 2 (never more than four, rule 406(h)), on the same board',
      b2.w === b2.want.w && b2.h === b2.want.h && openTiles === true && inside && bigger.length === 2 && bigger[0].w === 2 && bigger[0].h === 1 && bigger[1].w === 2 && bigger[1].h === 2 && bigger.every(r => r.state === 'in' && r.open && r.same),
      JSON.stringify({ b2, inside, openTiles, bigger }));
    /* ---- B3 ---- */
    const bad = [].concat.apply([], boards.map(r => r.srcs)).filter(s => /plate|settlement_ground|camp_\d/.test(s));
    const waitOrBoard = boards.every(r => r.srcs.length > 0 && r.srcs.every(s => /^data:image\/gif/.test(s) || BOARD_SRC.test(s)));
    const gone = await p.evaluate(async () => { const out = {}; for (const f of ['plate.webp', 'plate_night.webp', 'plate_tall.webp', 'plate_tall_night.webp']) { try { out[f] = (await fetch('camp_two/' + f, { cache: 'no-store' })).status; } catch (e) { out[f] = 'x'; } } return out; });
    /* the crew screen at camp: it opens over the camp and takes the camp screen's own picture (the camp made again on the same block) */
    await fr.evaluate((q) => { try { if (LOOP.open) loopClose(); } catch (e) {} city.x = q.x + 0.5; city.y = q.y + 0.5; TOWN_EXIT = null; return BohemiaMapCamp.make(); }, last.b);
    for (let k = 0; k < 120; k++) { await p.waitForTimeout(250); if (await lsf.evaluate(() => { try { return BohemiaCampLook.boardIn() && /^data:image\/(webp|jpeg)/.test(BohemiaSettlement.camp2().src || ''); } catch (e) { return false; } })) break; }
    await p.waitForTimeout(1500);
    await lsf.evaluate(() => { try { BohemiaCrewDoor.open({}); } catch (e) {} });
    let crew = null; for (let k = 0; k < 40 && !crew; k++) { await p.waitForTimeout(250);
      for (const x of p.frames().filter(x => /ROSTER_SCREEN/.test(x.url()))) { crew = await x.evaluate(() => { const c = document.getElementById('campbg'), h = document.documentElement.classList; return c && h.contains('bm-camp-live') ? { live: h.contains('bm-camp-town'), kind: c.dataset.kind, shown: c.style.opacity === '1' } : null; }).catch(() => null); if (crew) break; } }
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp3_crew_' + profile + '.png') });
    await lsf.evaluate(() => { try { BohemiaCrewDoor.close && BohemiaCrewDoor.close(); } catch (e) {} });
    for (const x of p.frames().filter(x => /ROSTER_SCREEN/.test(x.url()))) await x.evaluate(() => { try { document.getElementById('done').click(); } catch (e) {} }).catch(() => {});
    await p.waitForTimeout(600);
    ok(P + 'B3 *** THE OLD CAMP PICTURE NEVER SHOWS *** the ground was only the dark wait, then the board (' + boards.reduce((t, r) => t + r.srcs.length, 0) + ' reads); the sand is gone; the crew screen at camp sees the camp screen\'s picture',
      bad.length === 0 && waitOrBoard && Object.values(gone).every(v => v === 404) && !!crew && crew.live && crew.kind === 'camp' && crew.shown,
      JSON.stringify({ bad: bad.slice(0, 3), odd: [].concat.apply([], boards.map(r => r.srcs)).filter(s => !(/^data:image\/gif/.test(s) || BOARD_SRC.test(s))).map(s => s.slice(0, 60)).slice(0, 4), gone, crew }));
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp3_board_' + profile + '.png') });
    /* ---- B5: a town (before B4: the fight is the last thing this gate opens) ---- */
    const bakes0 = await lsf.evaluate(() => BohemiaCampBoard.state().bakes);
    const town = await fr.evaluate(() => { try { if (CAMP.on) BohemiaMapCamp.break(); } catch (e) {} const bs = ctBases(), names = Object.keys(bs); const n = names.find(k => mapTierOf(k) === 'town') || names[0];
      const t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return t; });
    await p.waitForTimeout(2500);
    const t5 = await fr.evaluate(() => { const r = BohemiaMapCamp.make(); return { made: r, town: CAMP.town ? CAMP.town.name : null, open: LOOP.open ? LOOP.open.name : null, camp: !!(LOOP.open && LOOP.open.camp), ask: campBoardAsk() }; });
    await p.waitForTimeout(2500);
    const s5 = await settle().evaluate(() => ({ camp: BohemiaSettlement.camp().camp, place: BohemiaSettlement.state.place.name, bakes: BohemiaCampBoard.state().bakes, frame: !!document.getElementById('campboardframe') }));
    ok(P + 'B5 *** IN A TOWN, THE TOWN\'S SCREEN *** HEAL in ' + town.name + ' rests in the town\'s own screen: no camp screen, no board asked',
      t5.made && t5.town === town.name && !t5.camp && t5.ask === null && !s5.camp && s5.place === town.name && s5.bakes === bakes0 && !s5.frame, JSON.stringify({ t5, s5, bakes0 }));
    await fr.evaluate(() => { try { if (CAMP.on) BohemiaMapCamp.break(); } catch (e) {} });
    await p.waitForTimeout(800);
    /* ---- B4: back to the last block, camp, and a crew reaches it ---- */
    await fr.evaluate((q) => { try { if (LOOP.open) loopClose(); } catch (e) {} city.x = q.x + 0.5; city.y = q.y + 0.5; TOWN_EXIT = null; return BohemiaMapCamp.make(); }, last.b);
    let pitch = null; for (let k = 0; k < 120; k++) { await p.waitForTimeout(250); pitch = await fr.evaluate(() => CAMP.pitch ? { x: CAMP.pitch.x, y: CAMP.pitch.y, n: CAMP.pitch.n, pieces: CAMP.pitch.pieces.length, sig: CAMP.pitch.sig } : null); if (pitch) break; }
    await p.waitForTimeout(1500);
    const handed = await fr.evaluate(() => { const r = cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', why: 'gate:camp', label: 'A CREW', __met: true, party: { count: 3, faction: 'brigands' }, roster: [{ arch: 'human' }, { arch: 'human' }, { arch: 'human' }], street: true, at: { gx: city.x + 2, gy: city.y } }, null);
      return { r: !!r, fought: window.__CAMP_FOUGHT || null }; });
    let f4 = null;
    for (let k = 0; k < 160; k++) { await p.waitForTimeout(250);
      const ff = p.frames().find(x => /BOHEMIA_FIGHT\.html/.test(x.url()) && x.parentFrame() === p.mainFrame()); if (!ff) continue;
      f4 = await ff.evaluate(() => { try { const o = window.FIGHT_OPTS || {}; return { board: !!(window.FIGHT_UI && FIGHT_UI.board), camp: o.camp ? { x: o.camp.x, y: o.camp.y, n: o.camp.n, pieces: o.camp.pieces.length } : null,
        sig: window.campBoardSig ? campBoardSig() : null, drawn: window.CAMP_ON_THE_BOARD ? CAMP_ON_THE_BOARD.drawn : -1 }; } catch (e) { return null; } }).catch(() => null);
      if (f4 && f4.board && f4.drawn > 3) break; }
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp3_fight_' + profile + '.png') });
    ok(P + 'B4 *** A CREW AT CAMP FIGHTS HIM THERE *** the fight opens on the camp\'s board, block for block, the camp on its square, every piece drawn on the glass',
      !!pitch && handed.r && !!handed.fought && !!f4 && f4.board && !!f4.camp && f4.camp.x === pitch.x && f4.camp.y === pitch.y && f4.camp.n === pitch.n && f4.camp.pieces === pitch.pieces && !!f4.sig && f4.sig === pitch.sig && f4.drawn > 3,
      JSON.stringify({ pitch, fought: handed.fought, fight: f4 && Object.assign({}, f4, { same: f4.sig === (pitch && pitch.sig) }) }));
    /* ---- B7: the victory path (rule 406(f)(g)): that fight won, MAKE CAMP on the end screen (a real press) ---- */
    const ff = p.frames().find(x => /BOHEMIA_FIGHT\.html/.test(x.url()) && x.parentFrame() === p.mainFrame());
    const won = ff ? await ff.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; });
      const r = { sig: campBoardSig(), dead: S.units.filter(u => u.dead && !u.fled && !u.ghost).length }; S.over = true; S.result = 'won'; showOver('won'); return r; }).catch(() => null) : null;
    const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await p.waitForTimeout(200);
    await p.waitForTimeout(1000);
    const campBtn = p.frameLocator('#spoilsdoor iframe').locator('#camp');
    try { if (profile === 'computer') await campBtn.click({ timeout: 5000 }); else await campBtn.tap({ timeout: 5000 }); } catch (e) {}
    let v7 = null, srcs7 = [];
    for (let k = 0; k < 160; k++) { await p.waitForTimeout(250); const sf = settle(); if (!sf) continue;
      v7 = await sf.evaluate(() => { try { const C = BohemiaCampBoard.state(), L = BohemiaCampLook.state(); return { st: C.state, fromFight: C.fromFight, sig: C.board && C.board.sig, bodies: C.bodies, dead: C.dead, pitch: C.pitch,
        src: BohemiaSettlement.camp().camp && BohemiaSettlement.camp2().camp2 ? (BohemiaSettlement.camp2().src || '') : null, inView: L.bodies.length, night: L.night, acts: L.acts.map(a => a.act) }; } catch (e) { return null; } }).catch(() => null);
      if (v7 && v7.src != null) srcs7.push(v7.src.slice(0, 22));
      if (v7 && v7.st === 'in' && v7.fromFight && BOARD_SRC.test(v7.src || '')) break; }
    /* by day his men with an easy job go through the dead (the camp's clock runs an hour a beat: day comes within a few seconds) */
    let looted = null;
    for (let k = 0; k < 80; k++) { const a = await settle().evaluate(() => { const L = BohemiaCampLook.state(); return { night: L.night, acts: L.acts.map(x => x.act), on: !!(window.parent && parent.BohemiaMapCamp && parent.BohemiaMapCamp.on()) }; }).catch(() => null);
      if (a && !a.night) { looted = a; if (a.acts.indexOf('loot') >= 0) break; } if (a && !a.on) { looted = a; break; } await p.waitForTimeout(250); }
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp3_victory_' + profile + '.png') });
    ok(P + 'B7 *** CAMP HERE FROM THE VICTORY SCREEN *** that fight won, MAKE CAMP on the end screen: the camp stands on that fight\'s own board (its fingerprint), every body drawn where it fell, the camp pitched on the tiles where they lie, and by day his men go through them (rule 406(f)(g))',
      !!won && won.dead > 0 && !!v7 && v7.st === 'in' && v7.fromFight && v7.sig === won.sig && v7.bodies === won.dead && v7.dead === won.dead && v7.pitch && v7.pitch.dead >= 1 && v7.inView >= 1
        && srcs7.every(x => /^data:image\/gif/.test(x) || BOARD_SRC.test(x)) && !!looted && looted.acts.indexOf('loot') >= 0,
      JSON.stringify({ won, camp: v7 && Object.assign({}, v7, { src: undefined }), srcs: srcs7.length, looted }));
  } catch (e) { ok(P + 'the gate ran to its end [' + String(e && e.message || e).slice(0, 300) + ']', false); }
  ok(P + 'B6 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (e) {}
}
(async () => {
  const i = process.argv.indexOf('--profile'), only = i > 0 ? process.argv[i + 1] : null;
  for (const pr of only ? [only] : ['phone_landscape', 'phone_portrait']) await run(pr);
  console.log('THE CAMP IS PITCHED ON THE BOARD: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
