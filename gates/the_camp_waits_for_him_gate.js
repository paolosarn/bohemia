/* __BOHEMIA_SOLO__ -- THIS GATE WATCHES THE GLASS EVERY TENTH OF A SECOND AND TIMES THE FRAMES, SO IT RUNS WITH THE BOX TO ITSELF.
   THE CAMP WAITS FOR HIM, AND HE SEES IT BUILT  (CAMP FOUR, 11/22/26, VAMILY rule 472 and 441, 448; Paolo 11/22: 'if I make camp, I don't
   want it to auto and I want time to go by until everyone's healed, but then when everyone is healed I want time to stop, but I still want
   the characters to move around as they were, doing whatever, just breathing and idling around, and then maybe something on the screen or
   the phone, like fully healed, resume back to world map... we made camp, it loads, it takes 30 seconds, I don't know why it freezes when it
   loads... I didn't get to see anyone build the camp... once they're fully healed, armor and health, just have them stick idling, and then
   I have to definitely click something to resume getting back on the world map... What if I want to zoom in on my character, see them
   chilling?')
   MEASURED BEFORE (main 14cfe9f3, this gate's own reads): HEAL off the start town with his one man at half: the hours ran from the first
   beat while the board baked (9 hours before the pitch), and the camp broke itself 'healed' 1.6 s after HEAL, before its board was in;
   a camp after a won fight: 7.3 s from MAKE CAMP to its first frame, the fight's last frame held still all that time; whole, the camp
   ran its hours on and on (139 in 67 s); the camp's pinch stopped at 1.5 (a man 84 px).
   On the demo (--alpha: the alpha), the phone UPRIGHT (390 x 844) and ON ITS SIDE (844 x 390), as he plays it:
     W1 THE CAMP STANDS BEFORE AN HOUR RUNS: HEAL off a town with his men hurt: the map's clock the same from the press until the camp's
        set-up has played on its ground (a second or more of it), then the hours run
     W2 THE CLOCK STOPS WHEN THEY ARE WHOLE, AND THE CAMP STAYS: the hour every man is at 99 percent of his blood and his armour the
        clock stops; eight seconds on: the same minute, the camp still made, its screen still on the glass, nothing broke it
     W3 THEY KEEP LIVING: the clock stopped, the camp's screen keeps drawing, and over fourteen seconds a man of his gets up and walks to
        his next thing (a stroll), his drawn place moving
     W4 THE PHONE SAYS IT: the phone's band is HIT THE ROAD (shown, the door's own picture), and its strip is one of his men saying, in
        a line, that they are whole and the road is waiting (a draft)
     W5 HIS TAP TAKES HIM BACK: a thumb on that band: the camp put away, the map on the glass, the clock on PAUSE
     W6 A CAMP MADE WHOLE STOPS AT ONCE: HEAL with nobody hurt: after its set-up not one hour runs; the phone says it
     W7 HE CAN ZOOM IN ON HIS MAN (upright, the camp after a fight): two fingers spread on the camp: the camp zooms in, and at its closest a
        man of his stands 150 css px or more (the fight's own closest stop); on a computer the wheel does the same (the record)
     W8 AFTER A FIGHT, AT ONCE: a fight won, MAKE CAMP tapped: the camp stands on the fight's own board handed at the tap (no second
        deal, no second bake), its first frame on the glass within FIRST_MS of the tap, no frame of the top page held over MAX_GAP_MS
        from the tap to that first frame, the clock still through the set-up
     P1 PLANTED: window.__CAMP_BREAKS_WHEN_WHOLE (the way it was): W2's check goes RED (the camp breaks itself)
     P2 PLANTED: window.__CAMP_NO_QUICK (the way it was): W8's hand-over check goes RED (the hidden page bakes it again)
     A1 nothing of the camp threw
   node gates/the_camp_waits_for_him_gate.js [--alpha] [--quick] (upright only) [--way upright|side]   (about 8 minutes) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const K = require(path.join(ROOT, 'tools/bohemia_camp_is_the_board.js'));
const ALPHA = process.argv.indexOf('--alpha') > 0, QUICK = process.argv.indexOf('--quick') > 0;
const WAY = (() => { const i = process.argv.indexOf('--way'); return i > 0 ? process.argv[i + 1] : null; })();
const FIRST_MS = 4500, MAX_GAP_MS = 750;   /* this box at full speed; the record carries the four-times-slower phone */
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + String(x).slice(0, 700) + ']' : '')); };
const WAYS = [{ name: 'upright', profile: 'phone_portrait' }, { name: 'on its side', profile: 'phone_landscape' }].filter(w => (!QUICK || w.profile === 'phone_portrait') && (!WAY || w.name.indexOf(WAY === 'side' ? 'side' : WAY) >= 0));

/* off any town, nothing near, the map at rest */
const REST = () => { try { loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} };
/* every man of the company hurt the same (the healing gate's own cut): blood, helmet and body armour; tape for all of it */
const HURT = (cut) => {
  const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null') || { men: {}, dead: [] }; s.men = s.men || {}; s.dead = s.dead || [];
  const names = BohemiaCondition.company().names;
  names.forEach(k => { s.men[k] = Object.assign(s.men[k] || {}, { shown: (s.men[k] && s.men[k].shown) || k, main: k === 'YOU', hpMax: 60, lostHp: 60 * cut, armHMax: 20, lostH: 20 * cut, armBMax: 80, lostB: 80 * cut, wound: null }); });
  localStorage.setItem(KEY, JSON.stringify(s));
  const W = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}'); W.tape = 400; localStorage.setItem('bohemia.supplies.v1', JSON.stringify(W));
  return names;
};
const WHOLE = () => { const KEY = 'bohemia.condition.v1', s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.men) { for (const k in s.men) { const m = s.men[k]; m.lostHp = 0; m.lostH = 0; m.lostB = 0; m.wound = null; } localStorage.setItem(KEY, JSON.stringify(s)); } };
/* the map's clock and the camp, every tenth of a second, from the press */
const WATCHM = () => { const W = window.__W472 = { s: [], t0: performance.now() }; W.iv = setInterval(() => { try {
  const L = LOOP.frame && LOOP.frame.contentWindow && LOOP.frame.contentWindow.BohemiaCampLook, st = L ? L.state() : null;
  W.s.push({ t: Math.round(performance.now() - W.t0), clock: T.day * 1440 + T.min, on: !!CAMP.on, hours: CAMP.hours | 0, whole: !!CAMP.whole, shown: !!(LOOP.frame && LOOP.frame.style.display === 'block'), pitch: st && st.pitch ? (st.pitch.on ? 'on' : 'done') : null, why: CAMP.why || null });
} catch (e) {} }, 100); };
const WATCHM_END = () => { const W = window.__W472; if (!W) return []; clearInterval(W.iv); return W.s; };
/* the top page's frames, every gap over 100 ms, from now */
const GAPS = () => { const G = window.__G472 = { t0: performance.now(), last: performance.now(), gaps: [], on: true };
  const f = (t) => { if (!G.on) return; const g = t - G.last; if (g > 100) G.gaps.push([Math.round(G.last - G.t0), Math.round(g)]); G.last = t; requestAnimationFrame(f); }; requestAnimationFrame(f); };
const GAPS_END = () => { const G = window.__G472; if (!G) return []; G.on = false; return G.gaps; };
const settle = (p) => K.settle(p);
async function phoneRead(p) {
  return p.evaluate(() => { const b = document.querySelector('#bohphone .bpctx'), rd = b && b.querySelector('.rd'), fd = document.querySelector('#bohphone .bpfd');
    const r = rd ? rd.getBoundingClientRect() : null;
    return { band: b ? b.className : null, rdShown: !!(rd && rd.offsetWidth > 0 && getComputedStyle(rd).display !== 'none'), rdText: rd ? rd.textContent.trim() : '', at: r ? [r.left + r.width / 2, r.top + r.height / 2] : null,
      strip: fd ? fd.textContent.trim() : '', who: fd && fd.querySelector('.fp b') ? fd.querySelector('.fp b').textContent : '', road: !!(fd && fd.dataset.road), draft: !!(rd && rd.dataset.draft) }; }).catch(e => ({ err: String(e) }));
}
async function tapAt(p, xy, touch) { if (touch) await p.touchscreen.tap(xy[0], xy[1]); else await p.mouse.click(xy[0], xy[1]); }

/* one HEAL camp: hurt (cut) or whole; watched to its stop; returns what was read */
async function healCamp(d, cut, planted) {
  const p = d.page, fr = d.fr, out = {};
  await fr.evaluate(REST); await fr.evaluate(D.offTheTown); await p.waitForTimeout(400);
  if (cut > 0) out.names = await fr.evaluate(HURT, cut); else await fr.evaluate(WHOLE);
  if (planted) await fr.evaluate(() => { window.__CAMP_BREAKS_WHEN_WHOLE = true; });
  await fr.evaluate(WATCHM);
  out.made = await fr.evaluate(() => { window.__CAMP_HEALED = null; window.__CAMP_WHOLE = null; return BohemiaMapCamp.make(); });
  /* to the stop (or the break), at most 60 s */
  for (let k = 0; k < 120; k++) { const st = await fr.evaluate(() => ({ on: CAMP.on, whole: !!CAMP.whole, why: CAMP.why })); if (!st.on || st.whole) break; await p.waitForTimeout(500); }
  out.atStop = await fr.evaluate(() => ({ on: CAMP.on, whole: !!CAMP.whole, why: CAMP.why, hours: CAMP.hours, clock: T.day * 1440 + T.min, lowest: (BohemiaMapCamp.condition() || {}).lowest, w: window.__CAMP_WHOLE, healed: window.__CAMP_HEALED }));
  return out;
}

if (require.main === module) (async () => {
  console.log('THE CAMP WAITS FOR HIM, AND HE SEES IT BUILT' + (ALPHA ? ' (the alpha)' : ' (the demo)') + (QUICK ? ' (quick: upright)' : ''));
  const errs = []; let plantedOnce = false;
  for (const way of WAYS) {
    let d;
    try { d = await D.open({ profile: way.profile, door: 180000, engage: true, alpha: ALPHA || undefined }); }
    catch (e) { ok('the ' + (ALPHA ? 'alpha' : 'demo') + ' opened ' + way.name, false, String(e.message).slice(0, 160)); continue; }
    const p = d.page, fr = d.fr, tag = way.name, touch = way.profile !== 'computer';
    p.on('pageerror', e => { const st = String(e && e.stack || ''); if (/camp_(look|board|map)|bohemia_phone|SETTLEMENT|campHour|campWhole|campRoad|campQuick|btwTick/.test(st)) errs.push(String(e && e.message || e).slice(0, 160)); });
    try {
      await p.waitForTimeout(2500);
      /* ---- W1..W5: HEAL, hurt ---- */
      const h = await healCamp(d, 0.5, false);
      const S = await fr.evaluate(WATCHM_END);
      const setOn = S.filter(q => q.pitch === 'on'), setEnd = setOn.length ? setOn[setOn.length - 1].t : null, c0 = S.length ? S[0].clock : null;
      const before = S.filter(q => setEnd != null && q.t <= setEnd), moved = before.filter(q => q.clock !== c0), ranAfter = S.some(q => setEnd != null && q.t > setEnd && q.clock !== c0);
      ok('W1 ' + tag + ': THE CAMP STANDS BEFORE AN HOUR RUNS: the clock the same from HEAL to the set-up\'s end (a second or more of it played), then the hours run',
        h.made === true && setOn.length >= 3 && setEnd - setOn[0].t >= 1000 && !moved.length && ranAfter, JSON.stringify({ made: h.made, samples: setOn.length, setupMs: setOn.length ? setEnd - setOn[0].t : 0, pitchFrom: setOn.length ? setOn[0].t : null, movedBefore: moved.length, ranAfter, hoursAtStop: h.atStop.hours }));
      const c1 = h.atStop.clock; await p.waitForTimeout(8000);
      const after = await fr.evaluate(() => ({ on: CAMP.on, whole: !!CAMP.whole, why: CAMP.why, clock: T.day * 1440 + T.min, shown: !!(LOOP.frame && LOOP.frame.style.display === 'block'), hours: CAMP.hours }));
      ok('W2 ' + tag + ': THE CLOCK STOPS WHEN THEY ARE WHOLE, AND THE CAMP STAYS: every man at 99 percent, the clock stopped; eight seconds on the same minute, the camp made and on the glass',
        h.atStop.on && h.atStop.whole && h.atStop.lowest >= 0.99 && after.on && after.whole && after.clock === c1 && after.shown && !after.why,
        JSON.stringify({ atStop: { on: h.atStop.on, whole: h.atStop.whole, hours: h.atStop.hours, lowest: h.atStop.lowest, why: h.atStop.why }, after }));
      /* W3: the camp lives on */
      const sf = settle(p);
      const r0 = sf ? await sf.evaluate(() => BohemiaCampLook.state()).catch(() => null) : null;
      await p.waitForTimeout(14000);
      const r1 = sf ? await sf.evaluate(() => BohemiaCampLook.state()).catch(() => null) : null;
      const moves = (r0 && r1) ? r1.drawnPos.filter(m => { const a = r0.drawnPos.find(q => q.name === m.name); return a && a.x != null && m.x != null && Math.hypot(a.x - m.x, a.y - m.y) > 10; }) : [];
      const drew = r1 && r0 && r1.lastDraw > r0.lastDraw && performance.now && true;
      const men = r1 ? r1.drawnPos.length : 0;
      ok('W3 ' + tag + ': THEY KEEP LIVING: the clock stopped, the camp keeps drawing, and a man of his gets up and walks to his next thing',
        !!r1 && r1.whole && drew && (r1.strolls > (r0 ? r0.strolls : 0) || men < 2) && (moves.length >= 1 || men < 2),
        JSON.stringify({ whole: r1 && r1.whole, drift: r1 && r1.drift, strolls: [r0 && r0.strolls, r1 && r1.strolls], moved: moves.map(m => m.name + ' ' + m.act), men, drawing: drew }));
      /* W4: the phone */
      let ph = null; for (let k = 0; k < 10; k++) { ph = await phoneRead(p); if (ph && ph.rdShown) break; await p.waitForTimeout(300); }
      const line = h.atStop.w && h.atStop.w.line;
      ok('W4 ' + tag + ': THE PHONE SAYS IT: HIT THE ROAD on the phone\'s band, and one of his men on its strip saying they are whole and the road is waiting',
        !!ph && ph.rdShown && /ROAD/.test(ph.rdText) && ph.road && !!line && ph.strip.indexOf(line) >= 0 && /\w/.test(ph.who) && ph.draft,
        JSON.stringify({ band: ph && ph.band, button: ph && ph.rdText, strip: ph && ph.strip, line, who: ph && ph.who }));
      /* W5: his tap */
      if (ph && ph.at) await tapAt(p, ph.at, touch);
      let back = null; for (let k = 0; k < 15; k++) { await p.waitForTimeout(250); back = await fr.evaluate(() => ({ on: CAMP.on, why: CAMP.why, shown: !!(LOOP.frame && LOOP.frame.style.display === 'block'), speed: TRAVEL_SPEED, road: window.__CAMP_ROAD || null })); if (!back.on && !back.shown) break; }
      ok('W5 ' + tag + ': HIS TAP TAKES HIM BACK: a thumb on HIT THE ROAD, the camp put away, the map on the glass, the clock on PAUSE',
        !!back && !back.on && back.why === 'road' && !back.shown && back.speed === 0, JSON.stringify(back));
      await p.waitForTimeout(2500);
      /* ---- W6: a camp made whole ---- */
      const w6 = await healCamp(d, 0, false);
      const S6 = await fr.evaluate(WATCHM_END); await p.waitForTimeout(6000);
      const a6 = await fr.evaluate(() => ({ on: CAMP.on, whole: !!CAMP.whole, hours: CAMP.hours, why: CAMP.why }));
      const ph6 = await phoneRead(p);
      ok('W6 ' + tag + ': A CAMP MADE WHOLE STOPS AT ONCE: nobody hurt, after its set-up not one hour runs; the phone says it',
        w6.made === true && a6.on && a6.whole && a6.hours === 0 && !!ph6 && ph6.rdShown && S6.some(q => q.pitch === 'on'), JSON.stringify({ a6, phone: ph6 && ph6.strip, pitched: S6.some(q => q.pitch === 'on') }));
      await fr.evaluate(() => BohemiaMapCamp.break()); await p.waitForTimeout(2500);
      /* ---- P1 (once): the way it was ---- */
      if (!plantedOnce) { plantedOnce = true;
        const pl = await healCamp(d, 0.3, true); await fr.evaluate(WATCHM_END);
        await fr.evaluate(() => { window.__CAMP_BREAKS_WHEN_WHOLE = false; });
        ok('P1 PLANTED: window.__CAMP_BREAKS_WHEN_WHOLE (the way it was): W2\'s check goes RED (the camp breaks itself)', !pl.atStop.on && pl.atStop.why === 'healed', JSON.stringify(pl.atStop && { on: pl.atStop.on, why: pl.atStop.why, hours: pl.atStop.hours }));
        await p.waitForTimeout(2500); }
      /* ---- W8 (and W7 upright): a fight won, MAKE CAMP ---- */
      await fr.evaluate(REST); await fr.evaluate(D.offTheTown);
      await p.evaluate(GAPS);
      const r = await K.oneFight(d, { fam: '^suburb$', end: 'won', watch: true, lootMs: 2500 });
      const gaps = await p.evaluate(GAPS_END);
      const cb = settle(p) ? await settle(p).evaluate(() => BohemiaCampBoard.state()).catch(() => null) : null;
      const Sw = (r.watch && r.watch.samples) || [], first = Sw.find(q => q.campShown && q.first), tapAtT = await p.evaluate(() => { const W = window.__CAMPWATCH, G = window.__G472; return W && G ? Math.round(W.t0 - G.t0) : 0; });
      const firstT = first ? first.t : null, gapsIn = gaps.filter(g => g[0] >= tapAtT - 50 && firstT != null && g[0] <= tapAtT + firstT), worst = gapsIn.reduce((m, g) => Math.max(m, g[1]), 0);
      const setW = Sw.filter(q => q.pitch === 'on'), endW = setW.length ? setW[setW.length - 1].t : 0, cW = Sw.find(q => q.clock != null), movedW = Sw.filter(q => q.t <= endW && cW && q.clock !== cW.clock);
      ok('W8 ' + tag + ': AFTER A FIGHT, AT ONCE: the camp stands on the fight\'s own board handed at the tap, its first frame within ' + FIRST_MS + ' ms of MAKE CAMP, no frame held over ' + MAX_GAP_MS + ' ms, the clock still through the set-up',
        !r.err && !!cb && !!cb.quick && cb.quick.landed >= 1 && firstT != null && firstT <= FIRST_MS && worst <= MAX_GAP_MS && !movedW.length && setW.length >= 5,
        JSON.stringify({ err: r.err, quick: cb && cb.quick, tl: cb && cb.tl, firstMs: firstT, worstGap: worst, gaps: gapsIn.slice(0, 8), clockMoved: movedW.length, setup: setW.length }));
      if (way.profile === 'phone_portrait') {
        /* W7: two fingers spread on the camp */
        const sf7 = settle(p);
        const z0 = sf7 ? await sf7.evaluate(() => ({ p: BohemiaSettlement.pinch(), f: BohemiaSettlement.fit(), man: BohemiaSettlement.scale() })).catch(e => String(e)) : null;
        const box = await p.evaluate(() => { const f = document.getElementById('cityFrame').getBoundingClientRect(); return [f.left + f.width / 2, f.top + f.height * 0.42]; });
        const cdp = await p.context().newCDPSession(p), pts = (dx) => [{ x: box[0] - 30 - dx, y: box[1], id: 1 }, { x: box[0] + 30 + dx, y: box[1], id: 2 }];
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts(0) });
        for (let k = 1; k <= 12; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pts(k * 22) }); await p.waitForTimeout(40); }
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(400);
        const z1 = sf7 ? await sf7.evaluate(() => ({ p: BohemiaSettlement.pinch(), f: BohemiaSettlement.fit(), man: BohemiaSettlement.scale() })).catch(e => String(e)) : null;
        const manAtMax = z1 && z1.f ? z1.man.person * z1.f.fit * z1.p.max : 0;
        ok('W7 ' + tag + ': HE CAN ZOOM IN ON HIS MAN: two fingers spread on the camp zoom it in, and at its closest a man of his stands 150 css px or more',
          !!z1 && z1.p && z1.p.zoom > 1.4 && manAtMax >= 150, JSON.stringify({ before: z0 && z0.p, after: z1 && z1.p, manAtFit: z1 && z1.f ? Math.round(z1.man.person * z1.f.fit) : null, manAtMax: Math.round(manAtMax) }));
      }
      await K.breakCamp(d).catch(() => {});
      /* ---- P2 (once, upright): the hidden page as it was ---- */
      if (way.profile === 'phone_portrait') {
        await p.evaluate(() => { window.__CAMP_NO_QUICK = true; });
        await fr.evaluate(REST); await fr.evaluate(D.offTheTown);
        const r2 = await K.oneFight(d, { fam: '^suburb$', end: 'won', watch: false, lootMs: 1500 });
        const cb2 = settle(p) ? await settle(p).evaluate(() => BohemiaCampBoard.state()).catch(() => null) : null;
        await p.evaluate(() => { window.__CAMP_NO_QUICK = false; });
        ok('P2 PLANTED: window.__CAMP_NO_QUICK (the way it was): W8\'s hand-over check goes RED (the board baked again in a hidden page)', !r2.err && !!cb2 && !cb2.quick, JSON.stringify({ err: r2.err, quick: cb2 && cb2.quick, ms: cb2 && cb2.ms, campMs: r2.campMs }));
        await K.breakCamp(d).catch(() => {});
      }
    } catch (e) { ok('the walk ' + tag, false, String(e && e.stack || e).slice(0, 400)); }
    await d.close();
  }
  ok('A1 nothing of the camp threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log('\nTHE CAMP WAITS FOR HIM: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
