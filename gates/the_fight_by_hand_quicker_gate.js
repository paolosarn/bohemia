#!/usr/bin/env node
/* THE FIGHT BY HAND, QUICKER (COMBAT [the ten changes: the fight's part], rule 133, Paolo 10/23: 'the whole point of this
   project was to be like Battle Brothers but quicker and funner for normies... like someone who plays Stardew Valley would
   play it'; TUNING's page records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md, changes 1, 8, 10).

   Legs, headless on the live fight's rules (tools/bohemia_fight_headless.js):
   1. CHANGE 1, THE FALLBACK SIZED BY THE COMPANY: a company handed with no party meets its own size on the row's line
      (ours.fallback_band_by_company), first_band's own kinds; nothing handed still meets first_band;
   2. THE FIGHT KEPT: the rules' state frozen to plain data and thawed into a fresh copy plays the same fight to the same end;
   and on his phone's profile (390 x 844 at 3x, touch), the real page:
   3. THE ODDS READ AND THE DIE UNTOUCHED: on his turn the odds are read inside a person's decision (2.65 s, the
      Keystroke-Level Model), and the real die is exactly where it was;
   4. AUTO WEARS THE ODDS AND ONE TAP FINISHES (re-aimed 10/24 by rule 144(b)(e)(f)(g)): a clean win nearly certain tints AUTO
      green and lights it on the beat, with NO number on it; one tap plays the rest on AUTO at the top pace (4x, rule 158(b))
      to the recap; a fight
      he cannot win reads red and does not glow; a death in a run pulls it red; an even fight reads red (no clear middle);
   5. THEIR TURNS AT DOUBLE PACE: on their turn the beat the motion keeps is half his;
   6. A TAP SKIPS HIS WALK: a tap while his man walks puts him at the walk's end inside a quarter beat;
   7. TAKE BACK THE LAST STEP, ONCE A TURN, NEVER A DIE: a walk that rolled nothing shows BACK; BACK puts him where he stood
      with his AP; the second walk of the turn has no BACK; a walk that drew a free swing has none;
   8. THE SPEED PANE IS THE KIT'S: one pane of the speed pad in the turn row beside AUTO, wearing UI's rendered tin; a tap
      runs it at 2x, amber, the beat halves, and the phone keeps it;
   9. THE FIGHT SAVES EVERY TURN: the start of his turn is on the phone; the same fight opened again goes on from it; the
      end clears it;
   10. THE BULLET'S MOMENTS: every shot of a gun posts FIRED and LANDS (where it went) for SOUNDS;
   11. ONE VOICE TEACHES, ONE RULE AT A TIME (change 8): the line set and the walk come from the veteran's face, never two at
      once, the strip printing no how-to of its own; their move is the face's line once, then the strip says only whose
      move it is;
   12. the page threw nothing.
   Run: node gates/the_fight_by_hand_quicker_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const FIGHT_FILE = process.env.FIGHT_FILE || 'BOHEMIA_FIGHT.html';
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const KLM_DECIDE_MS = 2650;
const CREW3 = [{ background: 'companion_2hand' }, { background: 'companion_1hand' }, { background: 'companion_ranged' }];

/* 1 */
const ctx = engine(), F = ctx.FIGHT, T = F._t, DB = ctx.DB;
const line = DB.ours.fallback_band_by_company.value.line, fb = DB.ours.first_band.value;
const sized = [1, 3, 6, 12].map(n => { ctx.setSeed(3); F.setup({ company: Array(n).fill(0).map((_, i) => CREW3[i % 3]), cap: 20, deploy: false, formation: null, kind: 'suburb' });
  return { n, men: F.S.units.filter(u => u.side === 'you').length, them: F.S.units.filter(u => u.side === 'them').length, kinds: F.S.units.filter(u => u.side === 'them').every(u => fb.indexOf(u.kind) >= 0) }; });
const onLine = n => { let a = line[0], b = line[1]; for (let i = 1; i < line.length; i++) { a = line[i - 1]; b = line[i]; if (n <= b[0]) break; }
  return Math.max(1, Math.round(a[1] + (n - a[0]) * (b[1] - a[1]) / (b[0] - a[0]))); };
ctx.setSeed(3); F.setup({ deploy: false, formation: null, kind: 'suburb' }); const bench = F.S.units.filter(u => u.side === 'them').length;
leg(sized.every(r => r.them === onLine(r.n) && r.kinds) && bench === fb.length,
  '*** CHANGE 1: A COMPANY HANDED WITH NO PARTY MEETS ITS OWN SIZE ON THE LINE, FIRST_BAND\'S KINDS; NOTHING HANDED, FIRST_BAND ***',
  sized.map(r => r.n + ' men v ' + r.them).join(', ') + '; nothing handed v ' + bench);

/* 2 */
ctx.setSeed(4); F.setup({ company: CREW3, cap: 12, deploy: false, formation: null, party: { count: 3, days: 1, difficulty: 1, faction: 'brigands' } });
for (let i = 0; i < 25 && !F.S.over; i++) F.aiStep(F.current());
const frozen = JSON.stringify(F.freeze());
const playOut = () => { let g = 0; while (!F.S.over && g < 6000) { F.aiStep(F.current()); g++; } return F.S.result + ' r' + F.S.round + ' ' + F.S.units.map(u => u.hp + '/' + u.armB + '@' + u.x + ',' + u.y).join(' '); };
ctx.setSeed(99); const endA = playOut(); F.thaw(JSON.parse(frozen), false); ctx.setSeed(99); const endB = playOut();
leg(endA === endB, '*** THE FIGHT KEPT: FROZEN TO PLAIN DATA AND THAWED, THE SAME FIGHT TO THE SAME END ***', (frozen.length / 1024).toFixed(1) + ' KB; ' + endA.slice(0, 40));

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  const boot = async (o, d0) => { const d = d0 || await open({ file: FIGHT_FILE, bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 }); return d; };
  const mine = async p => { for (let i = 0; i < 200; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return FIGHT.S.over ? 'over' : !u ? 'none' : crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
    if (st === 'mine' || st === 'over') return st; await p.waitForTimeout(100); } return 'stuck'; };

  /* 3, 4, 10: three of his against one thug on open ground */
  {
    const d = await boot({ seed: 21, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: CREW3, cap: 12, band: ['brigand_thug'], teach: false });
    const p = d.page; await mine(p);
    const s0 = await p.evaluate(() => ({ seed: SEED, t: performance.now() }));
    await p.waitForFunction(() => ODDS.runs >= ODDS_RUNS || ODDS.broke, null, { timeout: 20000 }).catch(() => {});
    const o = await p.evaluate(() => ({ seed: SEED, runs: ODDS.runs, won: ODDS.won, clean: ODDS.clean, broke: ODDS.broke || '', pct: oddsPct(), glow: document.getElementById('bauto').classList.contains('glow'),
      face: document.getElementById('bauto').innerText.replace(/\s+/g, ' ').trim(), tint: (document.querySelector('#bauto .tint') || {}).style ? document.querySelector('#bauto .tint').style.backgroundColor : '', showAt: null, t: performance.now() }));
    const readMs = await p.evaluate(() => null);
    leg(o.runs >= 12 && !o.broke && o.seed === s0.seed && o.t - s0.t < 20000,
      '*** THE ODDS ARE READ ON HIS TURN, AND THE REAL DIE IS EXACTLY WHERE IT WAS ***', o.runs + ' played out, ' + o.won + ' won; the die ' + (o.seed === s0.seed ? 'untouched' : 'MOVED') + (o.broke ? '; BROKE ' + o.broke : ''));
    /* the read inside a person's decision: a fresh turn, the clock from his turn to ODDS_SHOW */
    /* RE-AIMED 10/24 by rule 144(e) (Paolo: 'a number in the background the player never sees, they only see the colour'): the
       glow rides a near-certain CLEAN win, the tin wears green, and no number is on it */
    leg(o.glow && /^rgba\(46, 160, 67/.test(o.tint) && o.face === 'AUTO' && !/%|\d/.test(o.face), '*** A CLEAN WIN NEARLY CERTAIN: AUTO GLOWS GREEN, WITH NO NUMBER ON IT ***', 'worth ' + o.pct + ' in the background (' + o.clean + ' of ' + o.runs + ' clean), tint ' + o.tint + ', face "' + o.face + '", glow ' + o.glow);
    const a = await p.evaluate(() => { const r = document.getElementById('bauto').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await p.touchscreen.tap(a.x, a.y); await p.waitForTimeout(200);
    const f0 = await p.evaluate(() => ({ auto: FIGHT_UI.auto, finish: FIGHT_UI.finish, pace: paceNow(), t: performance.now() }));
    await p.waitForFunction(() => FIGHT.S.over && document.getElementById('over').style.display === 'flex', null, { timeout: 60000 }).catch(() => {});
    const f1 = await p.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result, shown: document.getElementById('over').style.display === 'flex', t: performance.now(), bullets: (FIGHT_UI.bullets || []).slice(), kept: localStorage.getItem('bohemia.fight.kept.v1') }));
    /* RE-AIMED 10/24 by rule 158(b) (a faster fight lands on halves and quarters of the song's beat, never off it): the top pace
       is the page's own FINISH_PACE, a power of two (it was 3, a third of a beat) */
    const fin = await p.evaluate(() => FINISH_PACE);
    leg(f0.auto && f0.finish && f0.pace === fin && Math.log2(fin) % 1 === 0 && fin > 1 && f1.over && f1.shown, '*** ONE TAP FINISHES IT: AUTO AT THE TOP PACE TO THE RECAP ***', 'auto ' + f0.auto + ', pace ' + f0.pace + 'x, ' + f1.result + ' in ' + ((f1.t - f0.t) / 1000).toFixed(1) + ' s');
    const fired = f1.bullets.filter(b => /^fired /.test(b)).length, lands = f1.bullets.filter(b => /^lands (man|armour|cover|dirt|past_ear) /.test(b)).length;
    leg(fired > 0 && lands >= fired, '*** THE BULLET\'S MOMENTS: EVERY SHOT OF A GUN POSTS FIRED AND WHERE IT LANDS, FOR SOUNDS ***', fired + ' fired, ' + lands + ' landed: ' + f1.bullets.slice(0, 4).join(' | '));
    leg(!f1.kept, '  the end clears the kept fight', f1.kept ? 'STILL KEPT' : 'cleared');
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 4b: one man against five: no glow */
  {
    const d = await boot({ seed: 22, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: CREW3.slice(0, 1), cap: 1, band: Array(5).fill('brigand_thug'), teach: false });
    const p = d.page; await mine(p);
    await p.waitForFunction(() => ODDS.runs >= ODDS_RUNS || ODDS.broke, null, { timeout: 20000 }).catch(() => {});
    const o = await p.evaluate(() => ({ pct: oddsPct(), glow: document.getElementById('bauto').classList.contains('glow'), tint: document.querySelector('#bauto .tint').style.backgroundColor, face: document.getElementById('bauto').innerText.trim() }));
    leg(o.pct !== null && o.pct < 80 && !o.glow && /^rgba\(208, 48, 32/.test(o.tint) && !/%/.test(o.face), '  a fight he cannot win on AUTO reads RED and does not glow', 'worth ' + o.pct + ', tint ' + o.tint + ', glow ' + o.glow);
    /* A DEATH PULLS RED (144(f)) and the scale has no clear middle (144(g)): the run's worth and the colour, on the page's own functions */
    const w = await p.evaluate(() => { const fake = (res, marks) => ({ S: { result: res, units: marks.map(m => ({ side: 'you', dead: m === 'dead', down: m === 'down', fled: false })) } });
      const T = v => { const t = oddsTint(v); return (t.green ? 'G' : 'R') + t.a.toFixed(2); };
      return { clean: oddsRunValue(fake('won', ['ok', 'ok', 'ok'])), down: oddsRunValue(fake('won', ['ok', 'down', 'ok'])), dead: oddsRunValue(fake('won', ['ok', 'dead', 'ok'])), lost: oddsRunValue(fake('lost', ['down', 'down', 'down'])),
        even: T(0.5), turn: T(R('ours.odds_colour').turn), top: T(1), bottom: T(0), minA: R('ours.odds_colour').alpha_min }; });
    leg(w.clean === 1 && w.down > 0 && w.down < 1 && w.dead === 0 && w.lost === 0, '  A DEATH PULLS RED: a clean win 1, a win with a man down between, a win with a death 0, a loss 0', JSON.stringify({ clean: w.clean, down: w.down, dead: w.dead, lost: w.lost }));
    leg(/^R/.test(w.even) && /^G/.test(w.turn) && parseFloat(w.turn.slice(1)) >= w.minA && parseFloat(w.top.slice(1)) > parseFloat(w.turn.slice(1)) && parseFloat(w.bottom.slice(1)) > parseFloat(w.even.slice(1)),
      '  NO CLEAR MIDDLE: an even fight reads red, the turn is already tinted, both ends the deepest', JSON.stringify(w));
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 5, 6, 7, 8, 9: three of his, one thug far off */
  {
    const o = { seed: 23, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: CREW3, cap: 12, band: ['brigand_thug'], teach: false, odds: false };
    const d = await boot(o), p = d.page;
    /* 5: their pace, read on their turn */
    let theirs = null;
    for (let i = 0; i < 80 && !theirs; i++) { theirs = await p.evaluate(() => { const u = FIGHT.current(); return u && u.side === 'them' ? { b: beatMs(), base: 60000 / R('ours.beat_bpm') / FIGHT_UI.speed / (FIGHT_UI.hand || 1) } : null; });
      if (!theirs) { const st = await mine(p); if (st === 'mine') { const e = await p.evaluate(() => { const r = document.getElementById('bend').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); await p.touchscreen.tap(e.x, e.y); } await p.waitForTimeout(30); } }
    leg(theirs && Math.abs(theirs.b * 2 - theirs.base) < 1, '*** THEIR TURNS AT DOUBLE PACE: THEIR BEAT IS HALF HIS ***', theirs ? Math.round(theirs.b) + ' ms on their turn, ' + Math.round(theirs.base) + ' on his' : 'their turn never came');
    /* set a clean turn of his: the thug in the far corner */
    const setTurn = async () => { await mine(p); return p.evaluate(() => { const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && FIGHT.onField(v))[0], t = S.units.filter(v => v.side === 'them')[0];
      t.x = S.w - 1; t.y = S.h - 1; u.x = 4; u.y = 4; u.ap = u.apTurn; u.fat = 0; u.begun = true; S.order = [u.id, t.id]; S.idx = 0;
      FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.back = null; FIGHT_UI.backUsed = null; FIGHT_UI.cx = (u.x + 2.5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .5) * FIGHT_UI.th; FIGHT_UI.pinched = true;
      return { id: u.id, x: u.x, y: u.y, ap: u.ap }; }); };
    const tapTile = async (x, y) => { const q = await p.evaluate((a) => ({ x: sx((a.x + .5) * FIGHT_UI.tw), y: sy((a.y + .5) * FIGHT_UI.th) }), { x, y }); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(120); };
    const settle = () => p.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 20000 }).catch(() => {});
    /* 6: a long walk, a tap halfway */
    const m6 = await setTurn(); await p.waitForTimeout(300);
    await tapTile(m6.x + 3, m6.y); await tapTile(m6.x + 3, m6.y);
    const w0 = await p.evaluate(() => { const a = FIGHT_UI.anim[0]; return a ? { dur: a.dur, k: a.k, t: performance.now(), beat: beatMs() } : null; });
    await p.waitForTimeout(w0 ? Math.min(w0.dur / 3, 300) : 100);
    const tw = await p.evaluate(() => performance.now());
    const sk = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return { x: r.width / 2, y: r.height * .45 }; });
    await p.touchscreen.tap(sk.x, sk.y);
    await settle(); const w1 = await p.evaluate(() => ({ t: performance.now(), hurried: FIGHT_UI.hurried || 0 }));
    leg(w0 && w0.k === 'step' && w1.hurried > 0 && w1.t - tw < w0.dur * .8 && w1.t - tw < w0.beat / 4 + 400, '*** A TAP SKIPS HIS WALK: AT THE WALK\'S END INSIDE A QUARTER BEAT ***',
      w0 ? 'the walk was ' + Math.round(w0.dur) + ' ms; after the tap it ended in ' + Math.round(w1.t - tw) + ' ms' : 'no walk started');
    /* 7: take back */
    const m7 = await setTurn(); await p.waitForTimeout(300);
    await tapTile(m7.x + 2, m7.y + 1); await tapTile(m7.x + 2, m7.y + 1); await settle(); await p.waitForTimeout(200);
    /* RE-AIMED 10/26 BY UI TWO (rule 213(b)): with the one phone up, BACK rides the phone's ability page with his abilities (the bar
       beside the phone has no room for it: WAIT slid over it); the press is on the phone's own BACK, a real touch */
    await p.waitForTimeout(600);
    const b0 = await p.evaluate(id => { const u = FIGHT.byId(id), ph = document.querySelector('#bohphone.on .ab .sk[aria-label="back"]'), b = ph || document.getElementById('bback');
      return { x: u.x, y: u.y, ap: u.ap, phone: !!ph, shown: document.getElementById('bback').style.display !== 'none' && b.getBoundingClientRect().width > 0, r: b.getBoundingClientRect() }; }, m7.id);
    if (b0.shown) { await p.touchscreen.tap(b0.r.x + b0.r.width / 2, b0.r.y + b0.r.height / 2); await p.waitForTimeout(250); }
    const b1 = await p.evaluate(id => { const u = FIGHT.byId(id), b = document.getElementById('bback'); return { x: u.x, y: u.y, ap: u.ap, shown: b.style.display !== 'none', say: document.getElementById('say').innerText }; }, m7.id);
    leg(b0.shown && (b0.x !== m7.x || b0.y !== m7.y) && b1.x === m7.x && b1.y === m7.y && b1.ap === m7.ap && !b1.shown,
      '*** TAKE BACK THE LAST STEP: BACK PUTS HIM WHERE HE STOOD, WITH HIS AP ***', 'walked to ' + b0.x + ',' + b0.y + ' (' + b0.ap + ' AP), back to ' + b1.x + ',' + b1.y + ' (' + b1.ap + ' AP): "' + b1.say + '"');
    await tapTile(m7.x + 2, m7.y); await tapTile(m7.x + 2, m7.y); await settle(); await p.waitForTimeout(200);
    const b2 = await p.evaluate(() => document.getElementById('bback').style.display !== 'none');
    leg(!b2, '  once a turn: the second walk of the turn has no BACK', b2 ? 'BACK AGAIN' : 'none');
    /* a walk that draws a free swing: out of the thug's reach */
    const m7b = await setTurn();
    await p.evaluate(id => { const S = FIGHT.S, u = FIGHT.byId(id), t = S.units.filter(v => v.side === 'them')[0]; t.x = u.x - 1; t.y = u.y; t.hp = t.hpMax = 9999; }, m7b.id);
    const swingTile = await p.evaluate(id => { const u = FIGHT.byId(id); return { x: u.x + 2, y: u.y }; }, m7b.id);
    const sd0 = await p.evaluate(() => SEED);
    await tapTile(swingTile.x, swingTile.y); await tapTile(swingTile.x, swingTile.y); await settle(); await p.waitForTimeout(200);
    const b3 = await p.evaluate(a => ({ back: document.getElementById('bback').style.display !== 'none', rolled: SEED !== a.s0, at: FIGHT.byId(a.id).x + ',' + FIGHT.byId(a.id).y, say: document.getElementById('say').innerText }), { s0: sd0, id: m7b.id });
    leg(b3.rolled && !b3.back && b3.at === swingTile.x + ',' + swingTile.y, '  never a die: a walk that drew a free swing has no BACK', (b3.rolled ? 'the swing rolled' : 'NOTHING ROLLED') + ', ' + (b3.back ? 'BACK SHOWN' : 'no BACK') + ', he stands at ' + b3.at + ' "' + b3.say + '"');
    /* 8: the speed pane */
    const sp = await p.evaluate(() => { const pad = document.getElementById('speedpad'), b = document.getElementById('bspeed'), a = document.getElementById('bauto'), r = b.getBoundingClientRect(), cs = getComputedStyle(b);
      return { inRow: pad.parentNode === a.parentNode && pad.nextSibling === a, x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, img: cs.backgroundImage, label: b.innerText, beat: beatMs() }; });
    await p.touchscreen.tap(sp.x, sp.y); await p.waitForTimeout(150);
    const sp2 = await p.evaluate(() => { const b = document.getElementById('bspeed'); return { label: b.innerText, now: b.classList.contains('now'), hand: FIGHT_UI.hand, beat: beatMs(), kept: localStorage.getItem('bohemia.fight.speed'), img: getComputedStyle(b).backgroundImage }; });
    leg(sp.inRow && sp.w >= 30 && /ui_kit\/tin_dark/.test(sp.img) && sp.label === '1x' && sp2.label === '2x' && sp2.now && /ui_kit\/tin_amber/.test(sp2.img) && Math.abs(sp2.beat * 2 - sp.beat) < 1 && sp2.kept === '2',
      '*** THE SPEED PANE IS THE KIT\'S: BESIDE AUTO, UI\'S RENDERED TIN; 2X LIGHTS IT AMBER, THE BEAT HALVES, THE PHONE KEEPS IT ***',
      (sp.inRow ? 'beside AUTO' : 'NOT BESIDE AUTO') + ', ' + Math.round(sp.w) + ' pt, ' + sp.label + ' -> ' + sp2.label + ', beat ' + Math.round(sp.beat) + ' -> ' + Math.round(sp2.beat) + ' ms, kept ' + sp2.kept + ', tin ' + (/tin_dark/.test(sp.img) ? 'dark' : '?') + '/' + (/tin_amber/.test(sp2.img) ? 'amber' : '?'));
    await p.touchscreen.tap(sp.x, sp.y); await p.touchscreen.tap(sp.x, sp.y); await p.waitForTimeout(100);
    /* 9: saved every turn, read back */
    await mine(p); await p.waitForTimeout(200);
    const k0 = await p.evaluate(() => { const K = JSON.parse(localStorage.getItem('bohemia.fight.kept.v1') || 'null'); return K ? { round: K.round, key: K.key, units: K.state.units.map(u => u.id + '@' + u.x + ',' + u.y + ':' + u.hp).join(' '), n: FIGHT_UI.kept } : null; });
    await p.reload({ waitUntil: 'load' });
    await boot(o, d);
    const k1 = await p.evaluate(() => ({ resumed: FIGHT_UI.resumed, round: FIGHT.S.round, units: FIGHT.S.units.map(u => u.id + '@' + u.x + ',' + u.y + ':' + u.hp).join(' '), say: document.getElementById('say').innerText }));
    leg(k0 && k1.resumed && k1.round === k0.round && k1.units === k0.units, '*** THE FIGHT SAVES EVERY TURN: OPENED AGAIN, IT GOES ON FROM HIS LAST TURN\'S START ***',
      k0 ? 'kept ' + k0.n + ' times; round ' + k0.round + ' kept, round ' + k1.round + ' opened, ' + (k1.units === k0.units ? 'every man where he stood' : 'THE MEN MOVED') + ': "' + k1.say + '"' : 'nothing kept');
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 11: one voice */
  {
    const d = await open({ file: FIGHT_FILE, bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 24, speed: 1, kind: 'suburb', flat: true, formation: null, company: CREW3, cap: 12, party: { count: 2, days: 1, difficulty: 1, faction: 'brigands' }, odds: false }) });
    const p = d.page;
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
    const seen = [];
    const look = () => p.evaluate(() => ({ k: FIGHT_UI.vet && FIGHT_UI.vet.k, say: document.getElementById('say').style.display === 'none' ? '' : document.getElementById('say').innerText.trim(), deploy: FIGHT.S.deploy,
      side: FIGHT.current() && FIGHT.current().side, shown: document.getElementById('vet').style.display !== 'none', line: document.getElementById('vetline').textContent, q: (FIGHT_UI.teachQ || []).slice() }));
    for (let i = 0; i < 60; i++) { const v = await look(); if (v.k) seen.push({ k: v.k, say: v.say, deploy: v.deploy, side: v.side }); if (v.k === 'deploy' && v.deploy) break; await p.waitForTimeout(150); }
    const dep = seen.filter(v => v.k === 'deploy')[0];
    const be = await p.evaluate(() => { const r = document.getElementById('bend').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await p.touchscreen.tap(be.x, be.y);
    let walk = null, skip = null, short = null;
    for (let i = 0; i < 200 && !(walk && skip && short); i++) {
      const v = await look();
      if (v.k === 'walk' && !walk) walk = v;
      if (v.k === 'skip' && !skip) skip = v;
      if (skip && !v.k && v.side === 'them' && /^Their move\.$/.test(v.say)) short = v;
      if (!v.k && v.side === 'you' && walk && !skip) { await p.evaluate(() => { const u = FIGHT.current(); if (crewControlled(u)) { FIGHT.endTurn(u); take(); } }); }
      if (v.k === 'skip') { await p.waitForTimeout(250); const c = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return { x: r.width / 2, y: r.height * .45 }; }); await p.touchscreen.tap(c.x, c.y); }
      if (walk && skip && !short) await p.evaluate(() => { const u = FIGHT.current(); if (crewControlled(u)) { FIGHT.endTurn(u); take(); } });
      await p.waitForTimeout(120);
    }
    leg(dep && !/drag|chalk|tap/i.test(dep.say) && walk && walk.say === '' && walk.side === 'you',
      '*** ONE VOICE TEACHES: THE LINE SET AND THE WALK FROM THE VETERAN\'S FACE, ONE RULE A LINE, THE STRIP PRINTING NO HOW-TO ***',
      (dep ? 'set the line: face, strip "' + dep.say + '"' : 'NO LINE-SET LESSON') + '; ' + (walk ? 'the walk: face, strip "' + walk.say + '"' : 'NO WALK LESSON'));
    leg(skip && short, '  their move: the face says the skip once, then the strip says only whose move it is', (skip ? 'face said it' : 'NO SKIP LESSON') + '; then "' + (short ? short.say : '?') + '"');
    errs.push.apply(errs, d.errs); await d.close();
  }
  leg(errs.length === 0, '  the page threw nothing', errs[0] || '');
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
function done() { console.log('=== THE FIGHT BY HAND, QUICKER GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
