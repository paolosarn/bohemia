/* ==========================================================================
   THE PLACE IN THE DARK  (WORLD [eyes: the place in the dark], 10/25/26, rule 179 with rule 155)

   PAOLO 10/24 on his PC (rule 164 item 3): 'take three carts to Prim, and it's really just the blue settlement.'
   EYES [check every ask on the list] 10/25 (records/BOHEMIA_EYES_EVERY_ASK_CHECKED_ON_THE_LIVE_DEMO_10_25_26.md, line 56,
   pictures q05, q06): on BUILD 10/25o, a phone, a new game in the dark, the phone's card said 'TOUCH REMNANTS ON THE MAP' while
   Remnants sat under the fog with no name and no mark at any zoom from 2.4 to 0.29, and PRIMM, where the carts go, was named
   nowhere. This lane's own checker (gates/the_jobs_part_gate.js) ran with the fog lifted, every gate's default, so it never
   met the dark: THIS ONE PLAYS THE STRANGER'S GAME (fog: true), the way EYES did.

   ON THE PHONE (390 x 844, touch), then ON HIS COMPUTER (1440 x 900, the mouse and the wheel):
     D1  a new game is dark: the fog is on and most of the map is hidden
     D2  every place the phone's two jobs name (who gives it, where it goes) is out of the dark from the first minute, and the
         land three blocks off it is still dark (a small circle, SHOW THE TOWNS' own, not the fog lifted)
     D3  each of them is drawn and NAMED at the closest stop and the farthest (a town's plate; a region place's name), whenever
         it is on the glass
     D4  days go by in a camp (the CAMP plate, a real touch; the clock an hour a beat) until a job whose words name a real place
         (the carts to PRIMM, the dam, the pass, the lodge, the fossil beds) is one of the phone's two; that place is out of the
         dark too, the land beside it dark, and named on the map at a stop where it is on the glass
     D5  a touch on that card: the phone says 'TOUCH <TOWN> ON THE MAP', the town wears the lit ring; at the closest stop, off
         the glass, its name waits at the glass's edge ('JOB AT <TOWN>') and where it goes ('TO PRIMM'), neither under the phone
     D6  a touch on the edge name walks him to that town
     D7  nothing threw
   node gates/the_place_in_the_dark_gate.js [phone|computer]   (both by default)
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { leaveTown } = require(path.join(__dirname, '..', 'tools/bohemia_leave_the_town.js'));
const ONLY = process.argv[2] || null;
const SHOTS = process.env.DARK_SHOTS || null;

let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE PLACE IN THE DARK: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

async function play(profile) {
  const P = profile === 'computer' ? 'computer' : 'phone';
  console.log('\n--- ' + P + ' ---');
  const d = await drive.open({ profile: P === 'computer' ? 'computer' : 'phone_portrait', fog: true, engage: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  const TOUCH = P === 'phone';
  const frameBox = async () => { const h = await page.$('#cityFrame'); return h ? h.boundingBox() : null; };
  /* a finger on the phone, the mouse on his computer; x, y in the city frame's own pixels */
  const tapAt = async (x, y) => { if (TOUCH) return d.tapAt(x, y); const fb = await frameBox(); if (!fb) return null; return page.mouse.click(fb.x + x, fb.y + y); };
  const shot = async (n) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, P + '_' + n + '.png') }); };
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  /* RE-AIMED 10/26 (RUN THREE, rule 236): a stranger's new game now opens on his squad up close and then the closest town's
     settlement screen; this gate measures the map, so it leaves the town the way a player does: a real tap on LEAVE */
  if (await waitFor(() => fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)), 20000)) {
    await page.waitForTimeout(1200);
    /* rule 286(b) (UI TWO): the one LEAVE on screen is the phone's in the game, the town's own on its page alone */
    const sf = page.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
    await leaveTown(page, sf, { ms: 4000, mouse: !TOUCH });
    await waitFor(() => fr.evaluate(() => !LOOP.open), 8000); await page.waitForTimeout(600);
  }

  /* the map at a stop: the game's own zoom about the middle of the glass (on the computer, the wheel), one frame drawn */
  const zoomTo = async (which) => {
    if (!TOUCH) {
      const fb = await frameBox();
      if (fb) { await page.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
        for (let i = 0; i < 30; i++) { await page.mouse.wheel(0, which === 'far' ? 400 : -400); await page.waitForTimeout(40); } }
    }
    await fr.evaluate((w) => { const b = zoomBounds(); setZoomAt(w === 'far' ? b[0] : b[1], CVW / 2, CVH / 2); }, which);   /* the stop itself, wherever the wheel left it */
    await page.waitForTimeout(500);
    return fr.evaluate(() => CZOOM);
  };
  /* what the map drew this frame for a place: on the glass, out of the dark, its building hit box, its name */
  const seenOnMap = (names) => fr.evaluate((names) => {
    MAP_DREW = {}; MAP_TOWN_HIT = []; render();
    const R = window.BOH_REGION, plates = (window.__MAP_PLATES_DRAWN || MAP_PLATES || []).map(p => String(p.t).toUpperCase());
    const regionNames = (R && R.nameBoxes || []).map(b => String(b[3]).toUpperCase());
    const ground = (window.__GROUNDLABELS || []).map(b => String(b.t).toUpperCase());
    return names.map(n => {
      const p = BohemiaJobKinds.realPlace(n); if (!p) return { n, found: false };
      const N = String(p.name).toUpperCase(), glass = mapOnGlass(p.x, p.y);
      const hit = MAP_TOWN_HIT.filter(h => String(h.name).toUpperCase() === N)[0] || null;
      const named = plates.indexOf(N) >= 0 || ground.indexOf(N) >= 0 || regionNames.indexOf(N) >= 0 || !!(hit && hit.plate);
      const off = [[3, 0], [-3, 0], [0, 3], [0, -3]].filter(o => fogHides(p.x + o[0], p.y + o[1])).length;
      return { n: p.name, found: true, x: p.x, y: p.y, region: !!p.region, hidden: fogHides(p.x, p.y), darkAround: off, glass, drawn: !!hit, named,
        dist: Math.max(Math.abs(p.x - city.x), Math.abs(p.y - city.y)) };
    });
  }, names);

  try {
    /* ---------------- D1: a new game in the dark ---------------- */
    await waitFor(() => fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at)), 30000);
    await waitFor(() => fr.evaluate(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && !!(window.BOH_REGION && BOH_REGION.ready) && ((window.__PHONE_BOARD || {}).shown || []).length >= 2), 30000);
    await page.waitForTimeout(2500);
    const g0 = await fr.evaluate(() => ({ fog: FOG.on && FOG.ready && !FOG.all, seen: FOG.seen ? FOG.seen.reduce((a, b) => a + b, 0) : -1, D: FOG.D, at: [city.x, city.y],
      shown: (window.__PHONE_BOARD.shown || []).map(a => ({ place: a.place, id: a.id, title: a.title, pay: a.pay })), places: BohemiaJobKinds.phonePlaces().map(p => ({ n: p.name, role: p.role })) }));
    ok(P + ' D1 a new game is dark', g0.fog && g0.seen > 0 && g0.seen < g0.D * g0.D / 50, g0.seen + ' of ' + g0.D * g0.D + ' blocks seen, at ' + g0.at.join(','));
    await shot('d1_the_door_dark');

    /* ---------------- D2, D3: the phone's two jobs' places ---------------- */
    const names0 = g0.places.map(p => p.n);
    const far0 = await zoomTo('far'), atFar0 = await seenOnMap(names0);
    await shot('d3_far');
    const near0 = await zoomTo('near'), atNear0 = await seenOnMap(names0);
    await shot('d3_near');
    ok(P + ' D2 every place the phone\'s jobs name is out of the dark, the land round it not',
      names0.length >= 1 && atFar0.every(x => x.found && !x.hidden) && atFar0.filter(x => x.dist > 8).every(x => x.darkAround >= 1),
      g0.shown.map(s => s.title + ' @ ' + s.place).join(' | ') + ' -> ' + atFar0.map(x => x.n + (x.hidden ? ' HIDDEN' : ' open') + ' d' + x.dist + ' dark-round ' + x.darkAround + '/4').join(', '));
    const both = atFar0.concat(atNear0).filter(x => x.glass);
    ok(P + ' D3 each is drawn and named at the far stop and the near stop, wherever it is on the glass',
      both.length >= 1 && both.every(x => x.drawn && x.named),
      'far ' + far0.toFixed(2) + ': ' + atFar0.map(x => x.n + (x.glass ? (x.drawn ? ' drawn' : ' NOT DRAWN') + (x.named ? ' named' : ' NOT NAMED') : ' off the glass')).join(', ')
      + ' | near ' + near0.toFixed(2) + ': ' + atNear0.map(x => x.n + (x.glass ? (x.drawn ? ' drawn' : ' NOT DRAWN') + (x.named ? ' named' : ' NOT NAMED') : ' off the glass')).join(', '));

    /* ---------------- D4: days in a camp until a job names a real place ---------------- */
    const realOnPhone = () => fr.evaluate(() => { const P = BohemiaJobKinds.phonePlaces(); const to = P.filter(p => p.role === 'to')[0]; if (!to) return null;
      const s = (window.__PHONE_BOARD.shown || []).filter(a => a.id === to.id)[0]; return s ? { id: s.id, title: s.title, place: s.place, to: to.name } : null; });
    let real = await realOnPhone(), camped = 0, dayAt = await fr.evaluate(() => T.day);
    for (let k = 0; k < 6 && !real; k++) {
      /* RE-AIMED 10/26 BY UI TWO (rules 212(b), 226): the CAMP plate is the phone's HEAL app, a real touch on it in the shell */
      const cb = await page.evaluate(() => { const b = document.querySelector('#bohphone .app[data-app=heal]'); if (!b || !document.getElementById('bohphone').classList.contains('on')) return null; const r = b.getBoundingClientRect(); return r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; });
      if (cb) { if (P === 'computer') await page.mouse.click(cb.x, cb.y); else await page.touchscreen.tap(cb.x, cb.y); } else await fr.evaluate(() => campMake());
      const made = await waitFor(() => fr.evaluate(() => !!CAMP.on), 4000);
      if (made) camped++;
      const d0 = await fr.evaluate(() => T.day);
      await waitFor(() => fr.evaluate((d0) => !CAMP.on || T.day >= d0 + 1, d0), 20000);
      await fr.evaluate(() => { if (CAMP.on) campBreak('left'); });   /* BREAK CAMP: the way out; the line under test is the phone after it */
      await page.waitForTimeout(2500);
      if (await fr.evaluate(() => !!LOOP.fighting || (window.MEET && MEET.up))) { await page.waitForTimeout(3000); break; }
      real = await realOnPhone();
    }
    const dayNow = await fr.evaluate(() => T.day);
    ok(P + ' D4a a job whose words name a real place comes onto the phone', !!real,
      real ? real.title + ' @ ' + real.place + ' -> ' + real.to + ' (day ' + dayAt + ' to ' + dayNow + ', ' + camped + ' camps)' : 'none in ' + camped + ' camps, day ' + dayAt + ' to ' + dayNow);
    if (real) {
      const farR = await zoomTo('far'), atFarR = await seenOnMap([real.place, real.to]);
      await shot('d4_far_real');
      const to = atFarR[1];
      ok(P + ' D4b where it goes is out of the dark, the land beside it dark', to && to.found && !to.hidden && to.darkAround >= 1,
        to ? to.n + (to.hidden ? ' HIDDEN' : ' open') + ', ' + to.dist + ' blocks off, dark round it ' + to.darkAround + '/4' : 'not found');
      /* the farthest stop shows the whole region on most screens; where it does not, the name is at the glass's edge (D5) */
      ok(P + ' D4c both are named on the map where they are on the glass', atFarR.filter(x => x.glass).every(x => x.drawn && x.named),
        'far ' + farR.toFixed(2) + ': ' + atFarR.map(x => x.n + (x.glass ? (x.drawn ? ' drawn' : ' NOT DRAWN') + (x.named ? ' named' : ' NOT NAMED') : ' off the glass')).join(', '));

      /* ---------------- D5: a touch on that card ---------------- */
      /* RE-AIMED 10/26 BY UI TWO (rules 213, 227; 148 dead): the offers are off the phone, on the town's board; the phone carries
         the jobs he is ON. So the gate takes the job at its town the town's own way (loopTakeContract, the hand the board's TAKE
         uses), then a real touch on its card on the one phone (#bohphone, the shell's) makes it PLAY's job; where it sends him is
         marked on the map (WORLD's markNext): on the glass, or its name waiting at the glass's edge and never under the phone
         (BOH_PHONE_RECT, the phone's box in this frame); a touch on that edge name walks him there. The old card's legs run while
         the old phone is up. */
      const NEW = await page.evaluate(() => !!document.getElementById('bohphone') && document.documentElement.classList.contains('boh-phone-on'));
      if (NEW) {
        await zoomTo('near');
        const took = await fr.evaluate((id) => { const A = (window.BohemiaPhoneBoard && BohemiaPhoneBoard.asks()) || [], o = A.filter(a => a.id === id)[0]; if (!o) return false;
          LOOP.open = { name: o.place, x: o.x, y: o.y, tier: o.tier }; const ok = loopTakeContract({ id: o.id, title: o.title, pay: o.pay, skulls: o.skulls }); LOOP.open = null; return !!ok; }, real.id);
        await page.waitForTimeout(1500);
        const card = await page.evaluate((id) => { const e = document.querySelector('#bohphone .jc[data-job="' + id + '"]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width * 0.3, y: r.y + r.height / 2, text: e.innerText.replace(/\s+/g, ' ') }; }, real.id);
        if (card) { if (TOUCH) await page.touchscreen.tap(card.x, card.y); else await page.mouse.click(card.x, card.y); }
        await page.waitForTimeout(900);
        const lit = await fr.evaluate((id) => { MAP_DREW = {}; MAP_TOWN_HIT = []; render(); const cv = document.getElementById('cv').getBoundingClientRect(), pr = BOH_PHONE_RECT();
          return { held: LOOP.held.some(j => j.id === id), marks: (window.__JOB_MARKS || []).filter(m => m.id === id).map(m => ({ label: m.label, name: m.name, on: m.on, box: m.box || null, x: m.x, y: m.y })),
            phone: { x: pr.left - cv.left, y: pr.top - cv.top, w: pr.width, h: pr.height }, cv: { x: cv.left, y: cv.top } }; }, real.id);
        const sel = await page.evaluate((id) => { const e = document.querySelector('#bohphone .jc[data-job="' + id + '"]'); return !!e && e.classList.contains('sel'); }, real.id);
        await shot('d5_the_card_lit');
        const P0 = lit.phone, under = (b) => b && b[0] < P0.x + P0.w && b[0] + b[2] > P0.x && b[1] < P0.y + P0.h && b[1] + 11 > P0.y;
        const mk = lit.marks[0] || null;
        ok(P + ' D5a the job he took is on the phone, a touch makes it PLAY\'s job, and where it sends him is marked on the map',
          took && lit.held && !!card && sel && !!mk, 'took ' + took + ', card "' + (card ? card.text : '-') + '"' + (sel ? ' picked' : ' NOT PICKED') + ', mark ' + (mk ? mk.label : 'none'));
        ok(P + ' D5b on the glass, or its name waits at the glass\'s edge, never under the phone',
          !!mk && lit.marks.every(m => m.on || (m.box && !under(m.box))),
          lit.marks.map(m => m.label + (m.on ? ' (on the glass)' : ' at ' + (m.box || []).join(',') + (under(m.box) ? ' UNDER THE PHONE' : ''))).join(' | ') + ' ; phone ' + [P0.x, P0.y, P0.w, P0.h].map(Math.round).join(','));
        /* ---------------- D6: a touch on the edge name walks there ---------------- */
        if (mk && !mk.on && mk.box) {
          await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
          const tx = lit.cv.x + mk.box[0] + mk.box[2] / 2, ty = lit.cv.y + mk.box[1] + 5;
          const clear = await waitFor(async () => { const fb = await frameBox(); if (!fb) return false;
            const outer = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.id === 'cityFrame'; }, [fb.x + tx, fb.y + ty]);
            return outer && await fr.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.id === 'cv'; }, [tx, ty]); }, 20000);
          if (!clear) console.log('  (the edge name stayed covered for 20 s; touched anyway)');
          await tapAt(tx, ty);
          await page.waitForTimeout(600);
          /* a town's any side is its door (RUN, rule 186(a)): the walk ends on a block touching its painted ground; any other place, on it */
          const tr = await fr.evaluate((m) => { const to = TRAVEL && TRAVEL.to ? TRAVEL.to : null, p = BohemiaJobKinds.realPlace(m.name), t = p ? { name: p.name || m.name, x: p.x | 0, y: p.y | 0, tier: p.tier } : null;
            let touches = false; try { touches = !!(t && to && typeof townTouches === 'function' && townTouches(t, townFoot(t), to[0], to[1])); } catch (e) {}
            return { to, touches, door: townDoor(m.x, m.y), at: [city.x, city.y] }; }, mk);
          const near = (a, b) => !!(a && b) && Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) <= 1;
          ok(P + ' D6 a touch on the edge name walks him there', !!tr.to && (near(tr.to, [mk.x, mk.y]) || near(tr.to, tr.door) || tr.touches),
            'travel to ' + JSON.stringify(tr.to) + ', the place ' + JSON.stringify([mk.x, mk.y]) + ', its door ' + JSON.stringify(tr.door) + (tr.touches ? ', touching it' : ''));
          await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
        } else ok(P + ' D6 a touch on the edge name walks him there (the place was on the glass at the near stop: its mark is the touch)', !!mk, mk ? 'on the glass' : 'no mark');
        await fr.evaluate((id) => { try { BohemiaJobKinds.drop(id); } catch (e) {} }, real.id);
      } else {
        await zoomTo('near');
        const card = await fr.evaluate((id) => { const e = [...document.querySelectorAll('#bmboard .job')].filter(x => x.dataset.job === id)[0]; if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + Math.min(r.height / 2, 18) }; }, real.id);
        if (card) await tapAt(card.x, card.y);
        await page.waitForTimeout(900);
        const lit = await fr.evaluate(() => { MAP_DREW = {}; MAP_TOWN_HIT = []; render(); const go = document.querySelector('#bmboard .job.picked .go');
          const fe = document.getElementById('cityfeed').getBoundingClientRect(), cv = document.getElementById('cv').getBoundingClientRect();
          const phone = { x: fe.left - cv.left, y: fe.top - cv.top, w: fe.width, h: fe.height };
          return { route: window.BOH_PHONE_ROUTE ? window.BOH_PHONE_ROUTE.place : null, go: go ? go.textContent : null, marks: (window.__JOB_MARKS || []).map(m => ({ label: m.label, on: m.on, box: m.box || null, ex: m.ex, ey: m.ey })),
            ring: BohemiaJobKinds.names(window.BOH_PHONE_ROUTE ? window.BOH_PHONE_ROUTE.place : ''), phone, cv: { x: cv.left, y: cv.top }, CVW, CVH }; });
        await shot('d5_the_card_lit');
        const P0 = lit.phone, under = (b) => b && b[0] < P0.x + P0.w && b[0] + b[2] > P0.x && b[1] < P0.y + P0.h && b[1] + 11 > P0.y;
        const from = lit.marks.filter(m => /^JOB AT /.test(m.label))[0], toM = lit.marks.filter(m => /^TO /.test(m.label))[0];
        ok(P + ' D5a the phone says the town to touch, and that town is the lit one', !!lit.go && lit.route === real.place && new RegExp(String(real.place), 'i').test(lit.go) && lit.ring === 'next',
          'phone: "' + lit.go + '", lit ' + lit.route + ', ring ' + lit.ring);
        ok(P + ' D5b off the glass, both names wait at its edge, neither under the phone',
          !!from && !!toM && lit.marks.filter(m => /^(JOB AT|TO) /.test(m.label)).every(m => m.on || (m.box && !under(m.box))),
          lit.marks.map(m => m.label + (m.on ? ' (on the glass)' : ' at ' + (m.box || []).join(',') + (under(m.box) ? ' UNDER THE PHONE' : ''))).join(' | ') + ' ; phone ' + [P0.x, P0.y, P0.w, P0.h].map(Math.round).join(','));

        /* ---------------- D6: a touch on the edge name walks to that town ---------------- */
        const target = from && !from.on ? from : null;
        if (target) {
          await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
          /* a crew line's speech box (the outer page's, a few seconds) can stand over the bottom edge: a hand waits for it to go */
          const tx = lit.cv.x + target.box[0] + target.box[2] / 2, ty = lit.cv.y + target.box[1] + 5;
          const clear = await waitFor(async () => { const fb = await frameBox(); if (!fb) return false;
            const outer = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.id === 'cityFrame'; }, [fb.x + tx, fb.y + ty]);
            return outer && await fr.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.id === 'cv'; }, [tx, ty]); }, 20000);
          if (!clear) console.log('  (the edge name stayed covered for 20 s; touched anyway)');
          await tapAt(tx, ty);   /* the canvas's pixels, where it sits in the frame */
          await page.waitForTimeout(600);
          /* RUN 10/25 (__ANY_SIDE_OF_A_TOWN_IS_ITS_DOOR__, rule 186(a)): the walk ends on a block touching the town's painted ground,
             the side his shortest walk reaches first, no longer one gate tile beside its block */
          const tr = await fr.evaluate((nm) => { const p = BohemiaJobKinds.realPlace(nm), t = p ? { name: p.name || nm, x: p.x | 0, y: p.y | 0, tier: p.tier } : null;
            const to = TRAVEL && TRAVEL.to ? TRAVEL.to : null;
            return { to, touches: !!(t && to && townTouches(t, townFoot(t), to[0], to[1])), town: t ? [t.x, t.y] : null, at: [city.x, city.y] }; }, real.place);
          ok(P + ' D6 a touch on the edge name walks him to the town', !!(tr.to && tr.touches),
            'travel to ' + JSON.stringify(tr.to) + ', touching the town at ' + JSON.stringify(tr.town) + ': ' + tr.touches);
          await fr.evaluate(() => { try { travelStop(); } catch (e) {} });
        } else ok(P + ' D6 a touch on the edge name walks him to the town (the town was on the glass at the near stop: its plate is the touch)', !!from, from ? 'on the glass' : 'no mark');
      }
    }
    ok(P + ' D7 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(P + ' the gate ran', false, e.message); }
  await d.close();
}

(async () => {
  for (const p of ['phone', 'computer']) if (!ONLY || ONLY === p) await play(p);
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
