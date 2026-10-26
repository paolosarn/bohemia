/* ==========================================================================
   THE TEN CHANGES, THE UI'S PART  (UI, 10/24/26, VAMILY [the ten changes: the UI's part], rule 133)

   PAOLO 10/23: 'the whole point of this project was to be like Battle Brothers but quicker and funner for normies, also
   kind of hardcore vibes if you're fucking around too much.' TUNING's ten changes; the screen's five are 2, 3, 5, 6, 8
   (records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md). Built in
   slices/bohemia_ui_materials.js (THE TEN CHANGES) and slices/bohemia_phone_board.js; the words in
   records/target/words/the_second_speaks.json.

   THREE PARTS, run at once:
   A  THE STRANGER'S WALK (tools/bohemia_ui_the_ten_changes_walk.js, real touches on the committed demo):
      T1  THE BAR CARRIES TWO NUMBERS: batteries and the days they feed the crew (= the map's bill), no dash; the crew tag
          is the crew the bill feeds (change 5)
      T2  THE PHONE'S JOB SAYS THE NEXT TOUCH: touched, the post names the lit town to touch and beats with the road (2)
      T3  A PARTY'S PLATE IS A TIN TAG: drawn from the kit, the count, the danger in a word (change 3)
      T4  NOTHING SPEAKS IN THE FIRST SIXTY SECONDS of play (the second votes)
      T5  A FACE, AND A TAP LETS IT GO: the plate carries a drawn face, a touch takes it away, the map did not move, it is
          not over the speed pad (change 8, rule 19c)
      T6  A WIN COUNTS WHERE THE NUMBER LIVES: after the job's fight the battery figure walks up through between values,
          never jumps, inside 3.7 s (SOUNDS' counter: 24 ticks a 16th, the drop on the beat after), each tick posted (change 6)
      T7  THE CLIENT PAYS WITH HIS FACE, THE LAID-UP MAN SHOWS HIS DAYS (change 6; the laying-up is scripted, marked)
      T8  NIGHTFALL IS THE DAY'S TALLY: his second says fights won, batteries in and out, days left (change 6)
      T9  nothing threw
   B  THE BENCH (one open of the committed demo, in the map's frame, by script, every step marked):
      B1  a line asked at 20 s of play is not said; at 61 s it is
      B2  a line whose speaker has no face is never said (rule 19c)
      B3  a once line is said once
      B4  thirty batteries credited count up through between values in under 3.7 s, never jump; the ticks are posted, and
          BOHEMIA_COUNT_UP went to the shell for SOUNDS (its plan drives the steps when it answers)
      B5  the plate drawn from the kit, its ink against its tin at 4.5 to 1 or better; the hunters' tag rusted red
      B6  the words: every line twelve words or fewer, draft:true, the fight's three left to COMBAT
      P1  [portrait menu]: his face on the bar's crew tag, a press of 44 points, and a real touch on it opens his company
          (RUN TWO's one door, engine/bohemia_crew_door.js), the map not moved (UI TWO 10/26, rules 238(a), 286(b): with the phone up
          the press is the phone's CREW and the tag shows his face as a readout)
   C  PLANTED DEFECTS: every walk leg red on a broken walk (the walk's own numbers bent one at a time), and two defects
      planted in the source and served through the driver, each caught by the bench: the sixty-second hold removed (B1),
      the count made a jump (B4).

   node gates/the_ten_changes_the_uis_part_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const ROOT = path.join(__dirname, '..');
const { walk } = require(path.join(ROOT, 'tools/bohemia_ui_the_ten_changes_walk.js'));
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const MAT = path.join(ROOT, 'slices/bohemia_ui_materials.js');
const WORDS = path.join(ROOT, 'records/target/words/the_second_speaks.json');

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };

/* ---- A: the walk's legs, as predicates over its numbers (so a bent walk can prove each one bites) ---- */
const LEGS = [
  ['T1 THE BAR CARRIES TWO NUMBERS', W => { const b = W.U5_bar || {}; return [b.numbers === 2 && b.dashes === 0 && b.figures === 2 && b.bill && b.daysShown === b.bill.daysLeft && b.crewShown === b.bill.crew,
    '(' + b.figures + ' figures: ' + (b.kinds || []).join(', ') + '; days ' + b.daysShown + ' / bill ' + (b.bill && b.bill.daysLeft) + '; crew ' + b.crewShown + ' / bill ' + (b.bill && b.bill.crew) + ')']; }],
  ['T2 THE PHONE\'S JOB SAYS THE NEXT TOUCH', W => { const p = W.U2_phone || {}; return [p.picked === true && p.saysNextTouch === true && !!p.beats && p.roadDrawn > 0,
    '("' + p.next + '", ' + p.beats + ', road ' + p.roadDrawn + ')']; }],
  ['T3 A PARTY\'S PLATE IS A TIN TAG', W => { const u = W.U3_party || {}, k = u.kit || {}; return [u.kitDrawn > 0 && /^(EASY|EVEN|BAD ODDS)$/.test(k.word || '') && +k.top > 0 && u.fight !== true,
    '(drawn ' + u.kitDrawn + ', "' + k.top + ' ' + k.word + ' / ' + k.low + '"' + (u.hunters ? ', the hunters by script' : '') + ')']; }],
  ['T4 NOTHING SPEAKS IN THE FIRST SIXTY SECONDS', W => { const v = W.U8_voice || {}; return [v.earlyLines === 0 && (v.lines || []).every(x => x.s >= 60),
    '(' + v.earlyLines + ' early; first ' + (v.first ? v.first.id + ' at ' + v.first.s + ' s' : 'none') + ')']; }],
  ['T5 A FACE, AND A TAP LETS IT GO', W => { const t = W.U8_tap || {}; return [t.face > 500 && t.tapLetsGo === true && t.mapMovedOnTap === false && t.overPad === false,
    '(face ' + t.face + ' px, let go ' + t.tapLetsGo + ', the map moved ' + t.mapMovedOnTap + ', over the pad ' + t.overPad + ')']; }],
  ['T6 A WIN COUNTS WHERE THE NUMBER LIVES', W => { const c = (W.U6a_win || {}).count || {}; return [c.paid > 0 && c.jumped === false && c.betweenValues >= 3 && c.ms > 0 && c.ms <= 3700 && c.ticksPosted >= 3 && c.countUpPosted >= 1,
    '(' + c.from + ' to ' + c.to + ' through ' + c.betweenValues + ' between, ' + c.ms + ' ms, ' + c.ticksPosted + ' ticks posted)']; }],
  ['T7 THE CLIENT PAYS WITH HIS FACE, THE LAID-UP MAN SHOWS HIS DAYS', W => { const f = (W.U6a_win || {}).faces || [], p = f.find(x => /^pay:/.test(x.id)), h = f.find(x => /^hurt:/.test(x.id));
    return [!!p && /^\+\d+$/.test(p.tag || '') && !!h && /^OUT \d+ DAYS$/.test(h.tag || '') && h.who !== p.who,
      '(' + (p ? p.who + ': "' + p.line + '"' : 'no client') + '; ' + (h ? h.who + ' ' + h.tag : 'no laid-up man') + ')']; }],
  ['T8 NIGHTFALL IS THE DAY\'S TALLY', W => { const n = W.U6b_night || {}, t = (n.said || []).find(x => /^tally:/.test(x.id)), cl = n.clock || {};
    /* the start's own grant is never the day's 'in' (the first cut said 335 in) */
    return [!!t && n.saysNumbers === true && /\d+ out/.test(t.line) && !/\b[23]\d\d in\b/.test(t.line) && !!cl.bill,
      '(' + (t ? t.who + ': "' + t.line + '"' : 'nothing said') + ')']; }],
  ['T9 nothing threw', W => [(W.errors || []).length === 0 && !W.crash, '(' + ((W.errors || []).length) + (W.crash ? ', crash ' + W.crash.slice(0, 100) : '') + ')']]
];
/* each leg, bent: the walk's own record with one of its numbers broken */
const BENT = {
  T1: W => { W.U5_bar.figures = 5; W.U5_bar.dashes = 3; },
  T2: W => { W.U2_phone.saysNextTouch = false; },
  T3: W => { W.U3_party.kitDrawn = 0; },
  T4: W => { W.U8_voice.earlyLines = 1; },
  T5: W => { W.U8_tap.tapLetsGo = false; },
  T6: W => { W.U6a_win.count.jumped = true; W.U6a_win.count.betweenValues = 0; },
  T7: W => { W.U6a_win.faces = []; },
  T8: W => { W.U6b_night.said = []; },
  T9: W => { W.errors = ['planted']; }
};

/* ---- B: the bench ---- */
async function bench(serve) {
  const R = {};
  const d = await drive.open(Object.assign({ file: 'BOHEMIA_DEMO.html', keepCards: true }, serve ? { serve } : {}));
  const fr = d.fr;
  try {
    await d.page.waitForTimeout(2500);
    Object.assign(R, await fr.evaluate(async () => {
      const T = BohemiaMaterials.ten, V = T.voice, sleep = (ms) => new Promise(r => setTimeout(r, ms)), out = {};
      const t0 = window.HUNT_T0, look = (window.CREW_DEFS && CREW_DEFS.looks && CREW_DEFS.looks[1]) || 'cast_longcoat';
      const clear = () => { V.q = []; if (V.on) { V.on.until = 0; } V.gap = 0; };
      for (let i = 0; i < 40 && !window.BohemiaCrewFaces; i++) await sleep(250);
      for (let i = 0; i < 40 && !V.lines; i++) await sleep(250);
      /* B1 the sixty seconds */
      await sleep(400); clear(); await sleep(200);
      window.HUNT_T0 = performance.now() - 20000;
      T.say({ id: 'bench_early', line: 'A bench line asked at twenty seconds.', who: { name: 'BENCH', look }, prio: 0, ttl: 30 });
      await sleep(700); out.at20 = !!(V.on && V.on.id === 'bench_early');
      window.HUNT_T0 = performance.now() - 61000;
      await sleep(700); out.at61 = !!(V.on && V.on.id === 'bench_early');
      /* B2 no face, no line */
      clear(); await sleep(300);
      T.say({ id: 'bench_noface', line: 'A man with no face.', who: { name: 'NOBODY', look: 'no_such_look' }, prio: 0, ttl: 30 });
      await sleep(900); out.noFaceShown = (V.shown || []).some(x => x.id === 'bench_noface');
      /* B3 once */
      clear(); await sleep(300);
      const a = T.say({ id: 'bench_once', once: true, line: 'Said once.', who: { name: 'BENCH', look }, prio: 0, ttl: 30 });
      await sleep(700); clear(); await sleep(600);
      const b = T.say({ id: 'bench_once', once: true, line: 'Said once.', who: { name: 'BENCH', look }, prio: 0, ttl: 30 });
      out.once = { first: a, second: b, times: (V.shown || []).filter(x => x.id === 'bench_once').length };
      clear(); window.HUNT_T0 = t0;
      /* B4 thirty batteries credited (SCRIPTED: a credit through the purse, then the same debited back) */
      await sleep(1500);
      const real0 = loopBats(), seen = [], m0 = (window.__MOMENTS || []).length;
      BohemiaPurse.credit(purseGet(), 'electricity', 30, 'gate: the count bench', null, loopDay());
      const s = performance.now(); let firstMove = null, lastAt = null;
      while (performance.now() - s < 4500) { const e = document.querySelector('#bmtb [data-f=batteries] b'); const v = e ? +e.textContent : null;
        if (v != null && (!seen.length || seen[seen.length - 1] !== v)) { seen.push(v); if (v !== real0 && firstMove == null) firstMove = performance.now() - s; if (v === real0 + 30) lastAt = performance.now() - s; }
        await sleep(30); }
      const ms = (window.__MOMENTS || []).slice(m0).map(x => x.kind);
      out.count = { from: real0, to: real0 + 30, seen: seen, between: seen.filter(v => v !== real0 && v !== real0 + 30).length, ms: (lastAt != null && firstMove != null) ? Math.round(lastAt - firstMove) : null,
        ticks: ms.filter(k => k === 'count_tick').length, jumped: seen.length <= 2, by: ((window.__MOMENTS || []).slice(m0).filter(x => x.kind === 'count_done')[0] || {}).by || null,
        toSounds: (() => { try { const L = window.parent.__countUpPlan; return L === undefined ? 'no plan asked' : (L ? 'planned ' + L.ticks : 'asked, no plan'); } catch (e) { return '?'; } })() };
      BohemiaPurse.debit(purseGet(), 'electricity', 30, 'gate: the count bench, back', null, loopDay());
      /* B5 the plate, on a scratch canvas: its ink against its tin; the hunters' tag */
      const c = document.createElement('canvas'); c.width = 600; c.height = 300; const g2 = c.getContext('2d');
      const P = { t: '', lx: 40, ly: 40, w: 80, col: '#f2d7a0', sx: 160, cy: 120, r: 0, sk: 2, party: true, info: { count: 3, skulls: 2, going: 'ON THE BORDER', hunt: false } };
      for (let i = 0; i < 20 && !T.partyPlate(g2, P); i++) await sleep(200);
      const K = window.__PLATE_KIT ? Object.assign({}, window.__PLATE_KIT) : null; out.plate = K;
      if (K) { const dpr = window.CV_DPR || window.devicePixelRatio || 1; const img = g2.getImageData(0, 0, c.width, c.height).data;
        const lum = (r, g, b) => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        /* the tin behind the words (the middle of the slab, under the words' row) and the darkest ink of the count */
        const at = (x, y) => { const i = (Math.round(y) * c.width + Math.round(x)) * 4; return [img[i], img[i + 1], img[i + 2], img[i + 3]]; };
        let tin = [], ink = 1;
        for (let x = K.x + 8; x < K.x + K.w - 8; x++) { const p = at(x, K.y + 15); if (p[3] > 200) tin.push(lum(p[0], p[1], p[2])); }
        for (let x = K.x + 20; x < K.x + 30; x++) for (let y = K.y + 6; y < K.y + 16; y++) { const p = at(x, y); if (p[3] > 200) ink = Math.min(ink, lum(p[0], p[1], p[2])); }
        tin.sort((a, b) => a - b); const bg = tin.length ? tin[Math.floor(tin.length / 2)] : 0;
        out.plateContrast = Math.round(((Math.max(bg, ink) + 0.05) / (Math.min(bg, ink) + 0.05)) * 100) / 100; }
      const H = { t: '', lx: 40, ly: 200, w: 80, col: '#ff8f7a', sx: 160, cy: 280, r: 0, sk: 3, party: true, info: { count: 5, skulls: 3, going: 'COMING FOR YOU', hunt: true, blocks: 5 } };
      T.partyPlate(g2, H); out.hunters = window.__PLATE_KIT ? { hunt: window.__PLATE_KIT.hunt, word: window.__PLATE_KIT.word, low: window.__PLATE_KIT.low } : null;
      return out;
    }));
    /* P1 [portrait menu]: his face on the crew tag, a press of 44, and a real touch on it opens his company */
    R.tag = await fr.evaluate(() => { const t = document.querySelector('#bmtb .t.crew'), im = t && t.querySelector('img.me'), r = t ? t.getBoundingClientRect() : null;
      return t ? { face: !!(im && im.complete && im.naturalWidth > 0 && /\/you\//.test(im.src)), role: t.getAttribute('role'), w: Math.round(r.width), h: Math.round(r.height), x: r.x + r.width / 2, y: r.y + r.height / 2,
        readout: getComputedStyle(t).pointerEvents === 'none' } : null; });
    /* RE-AIMED 10/26 BY UI TWO (rules 238(a), 286(b), newer than 44b): with the phone up the company's door is the phone's CREW, and his
       face stays on the bar's crew tag as what it shows (a readout, no second press); the touch is on the phone's CREW */
    R.phoneCrew = await d.page.evaluate(() => { const e = document.querySelector('#bohphone.on .bprow .app[data-app=crew]'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; });
    if (R.tag && R.phoneCrew) { await d.page.touchscreen.tap(R.phoneCrew.x, R.phoneCrew.y);
      for (let i = 0; i < 24 && !R.door; i++) { await d.page.waitForTimeout(250); R.door = await fr.evaluate(() => !!document.getElementById('crewdoor') && !!(window.BohemiaCrewDoor && BohemiaCrewDoor.isOpen())); }
      R.mapMoved = await fr.evaluate(() => !!TRAVEL); await fr.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (e) {} }); }
    else if (R.tag) { const fb = await (await d.page.$('#cityFrame')).boundingBox(); await d.page.touchscreen.tap(fb.x + R.tag.x, fb.y + R.tag.y);
      for (let i = 0; i < 24 && !R.door; i++) { await d.page.waitForTimeout(250); R.door = await fr.evaluate(() => !!document.getElementById('crewdoor') && !!(window.BohemiaCrewDoor && BohemiaCrewDoor.isOpen())); }
      R.mapMoved = await fr.evaluate(() => !!TRAVEL); await fr.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (e) {} }); }
  } catch (e) { R.crash = String(e && e.message || e).slice(0, 300); }
  R.errors = d.errs.slice(0, 5);
  await d.close();
  return R;
}
const BENCH_LEGS = [
  ['P1 [portrait menu] his face on the crew tag; a touch on the company\'s one door opens his company (the phone\'s CREW while the phone is up)', R => { const t = R.tag || {};
    return [t.face === true && (R.phoneCrew ? t.readout === true : t.role === 'button' && t.h >= 44 && t.w >= 44) && R.door === true && R.mapMoved === false,
    '(face ' + t.face + ', ' + t.w + 'x' + t.h + (R.phoneCrew ? ', the tag a readout ' + t.readout + ', the door the phone\'s CREW' : '') + ', opened ' + R.door + ', the map moved ' + R.mapMoved + ')']; }],
  ['B1 a line asked at 20 s is not said; at 61 s it is', R => [R.at20 === false && R.at61 === true, '(at 20 s ' + R.at20 + ', at 61 s ' + R.at61 + ')']],
  ['B2 a speaker with no face says nothing', R => [R.noFaceShown === false, '(shown ' + R.noFaceShown + ')']],
  ['B3 a once line is said once', R => { const o = R.once || {}; return [o.first === true && o.second === false && o.times === 1, '(' + JSON.stringify(o) + ')']; }],
  ['B4 a credit counts up, never jumps, inside 3.7 s', R => { const c = R.count || {}; return [c.jumped === false && c.between >= 3 && c.ms != null && c.ms <= 3700 && c.ticks >= 3, '(' + (c.seen || []).join(' ') + '; ' + c.ms + ' ms, ' + c.ticks + ' ticks, by ' + c.by + ', SOUNDS: ' + c.toSounds + ')']; }],
  ['B5 the plate is the kit\'s tin, ink 4.5 to 1, the hunters\' tag red', R => [!!R.plate && R.plate.word === 'EVEN' && R.plateContrast >= 4.5 && !!R.hunters && R.hunters.hunt === true && R.hunters.word === 'BAD ODDS' && /5 BLOCKS/.test(R.hunters.low),
    '(' + (R.plate ? R.plate.top + ' ' + R.plate.word : 'none') + ', ' + R.plateContrast + ' to 1; hunters ' + JSON.stringify(R.hunters) + ')']]
];

(async () => {
  /* B6 the words, read from the file (no browser) */
  let J = null; try { J = JSON.parse(fs.readFileSync(WORDS, 'utf8')); } catch (e) {}
  const lines = J && J.lines ? Object.keys(J.lines).map(k => [k, J.lines[k]]) : [];
  const long = lines.filter(([k, l]) => l.line && l.line.split(/\s+/).filter(Boolean).length > 12).map(([k]) => k);
  ok('B6 THE WORDS: ' + lines.length + ' lines, each twelve words or fewer' + (long.length ? ' [long: ' + long.join(', ') + ']' : '') + ', draft:true, the fight\'s three left to COMBAT',
    !!J && J.draft === true && lines.length >= 11 && !long.length && lines.every(([k, l]) => l.draft === true) && J.lines.first_fight && /COMBAT/.test(J.lines.first_fight.owner || ''));

  /* the planted source defects, each a copy of the materials served in place of the real one */
  const src = fs.readFileSync(MAT, 'utf8'), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-ten-gate-'));
  const plant = (name, from, to) => { if (src.indexOf(from) < 0) return null; const f = path.join(dir, name + '.js'); fs.writeFileSync(f, src.replace(from, to)); return { '/slices/bohemia_ui_materials.js': f }; };
  const M1 = plant('no_sixty', "if (playS() < 60) return 'the first sixty seconds';", "if (playS() < 0) return 'the first sixty seconds';");
  const M2 = plant('jump', 'function tenValue(K, n) { return K.from + Math.round(', 'function tenValue(K, n) { return K.to; return K.from + Math.round(');
  ok('C0 both source defects could be planted (the lines they break are in the file)', !!M1 && !!M2);

  const [W, B, R1, R2] = await Promise.all([
    walk({ quiet: true }).catch(e => ({ crash: String(e && e.message || e) })),
    bench().catch(e => ({ crash: String(e && e.message || e) })),
    M1 ? bench(M1).catch(e => ({ crash: String(e) })) : Promise.resolve(null),
    M2 ? bench(M2).catch(e => ({ crash: String(e) })) : Promise.resolve(null)
  ]);
  if (W.scripted && W.scripted.length) console.log('  (the walk, scripted and marked: ' + W.scripted.join(' | ') + ')');
  LEGS.forEach(([n, f]) => { let r; try { r = f(W); } catch (e) { r = [false, '(' + String(e.message).slice(0, 80) + ')']; } ok('*** ' + n + ' *** ' + r[1], r[0]); });
  BENCH_LEGS.forEach(([n, f]) => { let r; try { r = f(B); } catch (e) { r = [false, '(' + String(e.message).slice(0, 80) + ')']; } ok(n + ' ' + r[1], r[0]); });
  ok('B7 the bench threw nothing (' + ((B.errors || []).length) + (B.crash ? ', crash ' + B.crash : '') + ')', !B.crash && (B.errors || []).length === 0);
  /* C: every walk leg red on its bent walk; the two planted defects caught */
  let bit = 0; const missed = [];
  LEGS.forEach(([n, f]) => { const key = n.split(' ')[0]; const Wb = JSON.parse(JSON.stringify(W)); try { BENT[key](Wb); } catch (e) {} let r; try { r = f(Wb); } catch (e) { r = [false]; } if (!r[0]) bit++; else missed.push(key); });
  ok('C1 every walk leg goes red on a walk bent at its own number (' + bit + ' of ' + LEGS.length + (missed.length ? '; missed ' + missed.join(', ') : '') + ')', bit === LEGS.length);
  const b1 = R1 ? BENCH_LEGS[1][1](R1) : [true];
  ok('C2 PLANTED: the sixty-second hold removed -> B1 catches it (' + (R1 ? 'at 20 s ' + R1.at20 + (R1.crash ? ', crash ' + R1.crash : '') : 'not planted') + ')', !!R1 && !R1.crash && b1[0] === false);
  const b4 = R2 ? BENCH_LEGS[4][1](R2) : [true];
  ok('C3 PLANTED: the count made a jump -> B4 catches it (' + (R2 ? ((R2.count || {}).seen || []).join(' ') + (R2.crash ? ', crash ' + R2.crash : '') : 'not planted') + ')', !!R2 && !R2.crash && b4[0] === false);
  /* every bench leg red on a bench bent at its own number */
  const BB = { P1: R => { R.door = false; }, B1: R => { R.at20 = true; }, B2: R => { R.noFaceShown = true; }, B3: R => { R.once.second = true; }, B4: R => { R.count.jumped = true; }, B5: R => { R.plateContrast = 2; } };
  let bb = 0; const bmiss = [];
  BENCH_LEGS.forEach(([n, f]) => { const key = n.split(' ')[0], Rb = JSON.parse(JSON.stringify(B || {})); try { BB[key](Rb); } catch (e) {} let r; try { r = f(Rb); } catch (e) { r = [false]; } if (!r[0]) bb++; else bmiss.push(key); });
  ok('C4 every bench leg goes red on a bench bent at its own number (' + bb + ' of ' + BENCH_LEGS.length + (bmiss.length ? '; missed ' + bmiss.join(', ') : '') + ')', bb === BENCH_LEGS.length);
  console.log('THE TEN CHANGES, THE UI\'S PART: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
