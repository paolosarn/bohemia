/* ==========================================================================
   MAKE YOUR MAIN GUY  (RUN THREE, 10/26/26, VAMILY [make your main guy], rule 263(b)(c))

   PAOLO 10/26: "before you start Bohemia should always be able to customize your main guy... it's probably gonna use a lot of
   the same UI stuff as when you go to the barber."
   MEASURED BEFORE: a new game went from the origin straight to his squad's tape; his main man was the look 'you', named YOU,
   on every screen; there was no step to make him.

   LEGS (a stranger's new game: the demo, the dark on, the origin picked at the door; real taps on the glass):
     M1 *** THE CHAIR COMES BEFORE THE INTRO *** (three origins, the phone and the computer): the barber's chair is up before his
        squad's tape, the tape starts only after GO; nothing in its first second (a tap at half a second lights nothing)
     M2 ONE TAP SELECTS, TWO TAPS TAKE, NOTHING MOVES (rules 249, 250): one tap lights the tile and the mirror shows a man who
        wears it; every tile's box unchanged within a pixel; a double tap (a right click on the computer) takes it, and the tiles
        no whole man can wear with it go dim, in place
     M3 *** WHAT HE PICKS IS THE MAN *** (the Faithful on the phone, the Lone Wolf on the computer): the man in the mirror and the
        name he typed are written once (bohemia.main.v1), and that man, by that name, is the first man of the tape, the main man
        of the crew screen (opened by a real tap on CREW in the town) and his main man in a real fight (the shell's own door)
     M4 *** GO AT ONCE KEEPS HIS ORIGIN'S MAN *** (the water truck): the record says 'you', YOU, not made; the tape and the crew
        screen show the origin's own man
     M5 THE BENCH IS UNTOUCHED: the checkers' valley (the dark lifted) opens with no chair and no record
     M6 nothing threw
     M7 AT THE FRONT OF HIS PARTY (263(a), RUN's lead read off the same record): a real tap on LEAVE, the map's lead figure is
        his man (MAP_DREW.youLook), the made one or the origin's own
   node gates/make_your_main_guy_gate.js        (GATE_ONLY=faith,truck,wolf,bench runs a part)
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('MAKE YOUR MAIN GUY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SHOTS = process.env.BOHEMIA_SHOT_DIR || null;
const ARM = (origin) => "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = '" + origin + "'; s.reveal = 0; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.removeItem('bohemia.fog.off'); localStorage.removeItem('bohemia.laststart.v1'); } catch (e) {}";
const ONLY = process.env.GATE_ONLY ? process.env.GATE_ONLY.split(',') : null;
const mapFrame = (P) => P.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));
const settleFrame = (P) => P.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
const rosterFrame = (P) => P.frames().find(f => /ROSTER_SCREEN/.test(f.url()));

(async () => {
  const errs = [];
  for (const [origin, profile, makes] of [['faith', 'phone_portrait', true], ['truck', 'phone_portrait', false], ['wolf', 'computer', true]].filter(o => !ONLY || ONLY.indexOf(o[0]) >= 0)) {
    let d = null, g = { origin, profile, makes };
    try {
      d = await open({ profile, fog: true, maker: makes ? 'stay' : undefined, arm: ARM(origin), door: 45000, world: 8000 });
      const P = d.page, comp = profile === 'computer';
      const tapAt = async (b) => { if (comp) await P.mouse.click(b.x, b.y); else await P.touchscreen.tap(b.x, b.y); };
      const box = (sel) => P.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; e.scrollIntoView({ inline: 'nearest', block: 'nearest' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
      let fr = mapFrame(P);
      if (makes) {
        /* the chair, up and armed; the tape not begun */
        let armed = false;
        for (let i = 0; i < 160 && !armed; i++) { armed = await P.evaluate(() => { const w = document.getElementById('mainmaker'); return !!w && w.dataset.armed === '1'; }).catch(() => false); if (!armed) await P.waitForTimeout(250); }
        fr = mapFrame(P);
        g.before = await fr.evaluate(() => ({ mm: window.__MAIN_MAKER, tape: !!window.__SQUAD_UP, st: window.__START_IN_TOWN && window.__START_IN_TOWN.maker }));
        /* M2: one tap on a hair tile a man of the mirror can wear */
        const rects = () => P.evaluate(() => [...document.querySelectorAll('#mainmaker .tile')].map(t => { const r = t.getBoundingClientRect(); return [t.dataset.row, t.dataset.v, Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }));
        const strips = () => P.evaluate(() => [...document.querySelectorAll('#mainmaker .strip')].map(s => s.scrollLeft));
        const want = await P.evaluate(() => { const t = [...document.querySelectorAll('#mainmaker .tile[data-row="hair"]')].filter(x => !x.classList.contains('dead') && !x.classList.contains('on'))[2]; return t ? t.dataset.v : null; });
        const sel = '#mainmaker .tile[data-row="hair"][data-v="' + want + '"]';
        const b1 = await box(sel); const r0 = await rects(), s0 = await strips(), n0 = await P.evaluate(() => document.querySelectorAll('#mainmaker *').length);
        await tapAt(b1); await P.waitForTimeout(500);
        const one = await P.evaluate((s) => { const t = document.querySelector(s); return { sel: t.classList.contains('sel'), took: t.classList.contains('took'), on: t.classList.contains('on'), man: document.getElementById('mainmaker').dataset.man, n: document.querySelectorAll('#mainmaker *').length }; }, sel);
        const r1 = await rects(), s1 = await strips();
        const moved = r0.filter((a, i) => { const b = r1[i]; return !b || [2, 3, 4, 5].some(k => Math.abs(a[k] - b[k]) > 1); }).length + (s0.join() === s1.join() ? 0 : 1000);   /* nothing moved, nothing scrolled by itself */
        g.one = Object.assign(one, { want, moved, grew: one.n - n0 });
        /* the double tap (the computer: a right click) on a skin the man in the mirror does not have */
        const skin = await P.evaluate(() => { const t = [...document.querySelectorAll('#mainmaker .tile[data-row="skin"]')].filter(x => !x.classList.contains('dead') && !x.classList.contains('on')).pop(); return t ? t.dataset.v : null; });
        const ssel = '#mainmaker .tile[data-row="skin"][data-v="' + skin + '"]', b2 = await box(ssel);
        const dead0 = await P.evaluate(() => document.querySelectorAll('#mainmaker .tile.dead').length);
        if (comp) await P.mouse.click(b2.x, b2.y, { button: 'right' }); else { await tapAt(b2); await P.waitForTimeout(110); await tapAt(b2); }
        await P.waitForTimeout(500);
        g.two = await P.evaluate((s) => { const t = document.querySelector(s); return { took: t.classList.contains('took'), dead: document.querySelectorAll('#mainmaker .tile.dead').length, man: document.getElementById('mainmaker').dataset.man }; }, ssel);
        g.two.skin = skin; g.two.dead0 = dead0;
        g.two.moved = (await rects()).filter((a, i) => Math.abs(a[3] - r1[i][3]) > 1 || Math.abs(a[4] - r1[i][4]) > 1 || Math.abs(a[5] - r1[i][5]) > 1).length;
        /* his name: a real tap on the box, his fingers on the keys */
        const bn = await box('#mainmaker input'); await tapAt(bn); await P.keyboard.type(origin === 'wolf' ? 'el lobo' : 'chuy'); await P.waitForTimeout(150);
        g.mirror = await P.evaluate(() => ({ man: document.getElementById('mainmaker').dataset.man, body: document.querySelector('#mainmaker canvas.body').dataset.look, face: document.querySelector('#mainmaker canvas.hd').dataset.look, faceOk: document.querySelector('#mainmaker canvas.hd').dataset.face, typed: document.querySelector('#mainmaker input').value }));
        if (SHOTS) await P.screenshot({ path: path.join(SHOTS, 'main_guy_' + origin + '.png') });
        const bg = await box('#mainmaker .go'); await tapAt(bg);
      }
      /* the tape, then the town (a tap skips the tape once it is armed) */
      for (let i = 0; i < 120; i++) { const up = await fr.evaluate(() => !!(window.__SQUAD_UP && window.__SQUAD_UP.armedAt)).catch(() => false); if (up) break; await P.waitForTimeout(250); }
      g.rec = await fr.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.main.v1') || 'null'); } catch (e) { return null; } });
      g.mm = await fr.evaluate(() => window.__MAIN_MAKER || null);
      g.up = await fr.evaluate(() => window.__SQUAD_UP || null);
      g.intro = await fr.evaluate(() => window.__START_IN_TOWN && window.__START_IN_TOWN.intro);
      await P.waitForTimeout(400); { const r = await P.evaluate(() => ({ w: innerWidth, h: innerHeight })); await tapAt({ x: r.w / 2, y: r.h * .7 }); }
      for (let i = 0; i < 80; i++) { if (await fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await P.waitForTimeout(250); }
      await P.waitForTimeout(1500);
      /* the crew screen, by a real tap on one of his men standing in the town (campMan; the bar's CREW when it is on the glass) */
      const sf = settleFrame(P); g.sf = !!sf;
      if (sf) { await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 15000 }).catch(() => {});
        await P.waitForTimeout(1200);
        const fb = await (await sf.frameElement()).boundingBox();
        const men = await sf.evaluate(() => { const c = document.querySelector('canvas').getBoundingClientRect(), v = BohemiaSettlement._view(), h = BohemiaSettlement.scale().person * v.s;
          return BohemiaSettlement.crewHere().filter(q => !q.busy).map(q => { const p = BohemiaSettlement.toScreen(q.x, q.y); return { name: q.name, x: c.left + p.x, y: c.top + p.y - h * .45 }; })
            .filter(q => q.x > 30 && q.x < innerWidth - 30 && q.y > 90 && q.y < innerHeight - 60); }).catch(() => []);
        const cb = await sf.$('#crew'), bx = cb && await cb.boundingBox();
        const up = async (n) => { for (let i = 0; i < n; i++) { const rf = rosterFrame(P); if (rf && await rf.evaluate(() => !!(window.__HANDOVER && window.__HANDOVER.company && window.__HANDOVER.company.length)).catch(() => false)) return true; await P.waitForTimeout(250); } return false; };
        const ph = await P.evaluate(() => { const a = document.querySelector('#bohphone .app[data-app="crew"]'); if (!a) return null; const r = a.getBoundingClientRect(); return r.width > 4 && r.height > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }).catch(() => null);
        if (ph) { g.crewVia = 'CREW on his phone'; await tapAt(ph); await up(40); }
        else if (bx && bx.width > 4) { g.crewVia = 'the CREW button'; await tapAt({ x: bx.x + bx.width / 2, y: bx.y + bx.height / 2 }); await up(40); }
        else for (const m of men.slice(0, 3)) { if (!fb) break; g.crewVia = 'a tap on ' + m.name; await tapAt({ x: fb.x + m.x, y: fb.y + m.y }); if (await up(12)) break; }
        await P.waitForTimeout(800);
        const rf = rosterFrame(P); g.rfs = !!rf;
        /* the crew screen's own hand-over (YOU first, the fight's order) and what it draws: his face and his body by his look, his name on his card */
        g.crew = rf ? await rf.evaluate(() => { const co = (window.__HANDOVER && window.__HANDOVER.company) || [], txt = document.body.innerText;
          return co.map((m, i) => ({ name: m.name, look: m.look, main: i === 0, drawn: document.querySelectorAll('canvas[data-look="' + m.look + '"]').length, named: txt.indexOf(m.name) >= 0 })); }).catch((e) => { g.crewErr = String(e.message).slice(0, 160); return null; }) : null;
        g.lead = await sf.evaluate(() => { try { return BohemiaSettlement.lead().look; } catch (e) { return 'threw ' + e; } }).catch(() => null);   /* the man who walks the town for him */
        if (SHOTS) await P.screenshot({ path: path.join(SHOTS, 'main_guy_crew_' + origin + '.png') });
      }
      /* the map, by a real tap on LEAVE: the man at the front of his party (RUN's __YOUR_MAIN_GUY_LEADS_THE_WALK__ draws MAP_DREW.youLook) */
      if (sf) { await P.evaluate(() => { try { if (window.BohemiaCrewDoor) BohemiaCrewDoor.close(); } catch (e) {} }).catch(() => {});
        await sf.evaluate(() => { try { if (window.BohemiaCrewDoor) BohemiaCrewDoor.close(); } catch (e) {} }).catch(() => {});
        await P.waitForTimeout(400);
        const lv = await sf.$('#leave'), lb = lv && await lv.boundingBox(); if (lb) await tapAt({ x: lb.x + lb.width / 2, y: lb.y + lb.height / 2 });
        for (let i = 0; i < 40; i++) { g.mapLead = await fr.evaluate(() => { try { return (MAP_DREW && MAP_DREW.youLook) || null; } catch (e) { return null; } }).catch(() => null); if (g.mapLead && g.mapLead !== 'body') break; await P.waitForTimeout(250); }
        if (SHOTS) await P.screenshot({ path: path.join(SHOTS, 'main_guy_map_' + origin + '.png') }); }
      /* the fight, through the shell's own door, his company as the shell hands it */
      if (makes) {
        await P.evaluate(() => { try { if (window.BohemiaCrewDoor) BohemiaCrewDoor.close(); } catch (e) {} try { nfOpen({ world: { day: 1 } }); } catch (e) { window.__GATE_NF = String(e); } });
        let units = null;
        for (let i = 0; i < 120 && !units; i++) { const ff = P.frames().find(f => /BOHEMIA_FIGHT/.test(f.url()));
          units = ff ? await ff.evaluate(() => { try { return FIGHT.S && FIGHT.S.units && FIGHT.S.units.length ? FIGHT.S.units.filter(u => u.side === 'you').map(u => ({ name: u.name, look: u.look, main: !!u.main })) : null; } catch (e) { return null; } }).catch(() => null) : null;
          if (!units) await P.waitForTimeout(250); }
        g.fight = units; g.nf = await P.evaluate(() => ({ e: window.__GATE_NF || null, fr: !!document.getElementById('fightFrame'), h: window.__NF_HANDED || null })).catch(e => String(e));
        if (SHOTS) await P.screenshot({ path: path.join(SHOTS, 'main_guy_fight_' + origin + '.png') });
      }
      g.errs = d.errs.slice(0, 3);
    } catch (e) { g.err = String(e.message).slice(0, 200); }
    if (d) await d.close();
    report(g);
  }
  function report(g) {
    if (process.env.GATE_DEBUG) console.log(JSON.stringify({ crew: g.crew, lead: g.lead, fight: g.fight, sf: g.sf, rfs: g.rfs, nf: g.nf, via: g.crewVia, crewErr: g.crewErr }).slice(0, 1500));
    if (g.err) { ok('the ' + g.origin + ' game ran [' + g.err + ']', false); return; }
    const mm = g.mm || {}, up = g.up || {}, rec = g.rec || {}, intro = (g.intro && g.intro.men) || [];
    const main = (g.crew || []).filter(m => m.main)[0] || null;
    ok('*** M1 THE CHAIR COMES BEFORE THE INTRO *** (' + g.origin + ', ' + g.profile + '): the chair up ' + (up.started && mm.shown ? up.started - mm.shown : '?') + ' ms before his squad\'s tape, armed ' + (mm.armedAt - mm.shown) + ' ms in, the tape after GO',
      !!mm.shown && !!mm.done && up.started >= mm.done - 5 && mm.shown < up.started && mm.armedAt - mm.shown >= 1000 && (!g.before || (!g.before.tape && !!g.before.mm)), JSON.stringify({ shown: mm.shown, armed: mm.armedAt, go: mm.done, tape: up.started }));
    if (g.makes) {
      ok('M2 ONE TAP SELECTS, TWO TAPS TAKE, NOTHING MOVES (' + g.origin + ', ' + g.profile + '): one tap on ' + g.one.want + ' lit it and the mirror shows a man who wears it (' + g.one.man + '), ' + g.one.moved + ' boxes moved, ' + g.one.grew + ' things added; ' + (g.profile === 'computer' ? 'a right click' : 'a double tap') + ' took ' + g.two.skin + ', ' + g.two.dead + ' tiles dim (' + g.two.dead0 + ' before)',
        g.one.sel && !g.one.took && g.one.on && g.one.moved === 0 && g.one.grew === 0 && g.two.took && g.two.dead > g.two.dead0 && g.two.moved === 0, JSON.stringify({ one: g.one, two: g.two }));
      const nm = g.mirror.typed;
      const tape0 = intro[0] || {}, fight0 = (g.fight || []).filter(u => u.main)[0] || null;
      ok('*** M3 WHAT HE PICKS IS THE MAN *** (' + g.origin + ', ' + g.profile + '): the mirror\'s ' + g.mirror.man + ' named ' + nm + ' is written once (' + rec.look + ', ' + rec.name + '), the tape\'s first man (' + tape0.look + ', ' + tape0.name + '), the crew screen\'s main man (' + (main && main.look) + ', ' + (main && main.name) + ') and his main man in the fight (' + (fight0 && fight0.look) + ', ' + (fight0 && fight0.name) + '); the town\'s lead ' + g.lead + '; the crew screen by ' + g.crewVia,
        g.mirror.man !== 'you' && g.mirror.body === g.mirror.man && g.mirror.face === g.mirror.man && g.mirror.faceOk === 'fresh' && rec.look === g.mirror.man && rec.name === nm && rec.made === true
        && tape0.look === rec.look && tape0.name === nm && !!main && main.look === rec.look && main.name === nm && main.drawn > 0 && main.named && !!fight0 && fight0.look === rec.look && fight0.name === nm
        && (g.crew || []).filter(m => m.look === rec.look).length === 1 && g.lead === rec.look, JSON.stringify({ crew: (g.crew || []).slice(0, 3), lead: g.lead, fight: (g.fight || []).slice(0, 2) }));
    } else {
      const tape0 = intro[0] || {};
      ok('*** M4 GO AT ONCE KEEPS HIS ORIGIN\'S MAN *** (' + g.origin + ', ' + g.profile + '): one tap on GO, the record says ' + rec.look + ', ' + rec.name + ', made ' + rec.made + '; the tape\'s first man ' + tape0.look + ', the crew screen\'s main man ' + (main && main.look),
        rec.look === 'you' && rec.name === 'YOU' && rec.made === false && tape0.look === 'you' && tape0.name === 'YOU' && !!main && main.look === 'you' && main.name === 'YOU' && main.drawn > 0, JSON.stringify({ rec, crew: (g.crew || []).slice(0, 2) }));
    }
    ok('*** M7 AT THE FRONT OF HIS PARTY *** (' + g.origin + ', ' + g.profile + '): a real tap on LEAVE and the map\'s lead figure is ' + g.mapLead + ' (RUN\'s __YOUR_MAIN_GUY_LEADS_THE_WALK__)', !!g.mapLead && g.mapLead === (rec.look || 'you'));
    ok('M6 nothing threw (' + g.origin + ')', !(g.errs || []).length, (g.errs || []).join(' | '));
  }
  /* M5: the bench's valley */
  if (!ONLY || ONLY.indexOf('bench') >= 0) { let b = null;
    try { b = await open({ profile: 'phone_portrait', fog: false });
      await b.page.waitForTimeout(5000);
      const chair = await b.page.evaluate(() => !!document.getElementById('mainmaker'));
      const r = await b.fr.evaluate(() => ({ mm: window.__MAIN_MAKER || null, rec: localStorage.getItem('bohemia.main.v1') }));
      ok('M5 THE BENCH IS UNTOUCHED: the checkers\' valley (the dark lifted) opens with no chair and no record', !chair && !r.mm && !r.rec, JSON.stringify(r));
    } catch (e) { ok('M5 the bench leg ran [' + String(e.message).slice(0, 160) + ']', false); }
    if (b) await b.close(); }
  done();
})();
