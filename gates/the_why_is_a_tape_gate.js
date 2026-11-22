#!/usr/bin/env node
/* ============================================================================
   GATE: THE WHY IS A TAPE (FIGHT SCREEN THREE 11/22; VAMILY rule 470(e): his NO on fight-screen-the-why-is-true-and-the-face-shows-11-17,
   'Its looking like shit'; rules 449(a), 450(a), the analog horror law of 9/20 and its bible R1, R3, R5, R6, R8).
   The man who says WHY is a frame off a camcorder tape, not a smooth doll blown up soft, and his sentence runs as closed captions.
   On the real page (the demo, a phone upright and on its side, a held job's crew met through the map's card, ENGAGE by a finger;
   tools/bohemia_fight_screen_the_why_is_true.js):
     T1  THE STILL ON THE CARD: the speaker's photo is a tape (class tape), his face drawn at 64 px (the portrait engine's own small size) and blown up hard (image-rendering
         pixelated), lit (a mean light of 40 or more of 255), the tape's lines a canvas of twice his rows; the tape's counter reads
         '▶ m:ss' and runs while his picture holds (a later read is further on)
     T2  THE CAPTION ON THE CARD: his sentence on a black box (rgb(6, 5, 4)), inline so the box follows each line; his name carries '>>'
     T3  THE STILL AT THE BELL: the face that says it again at the bell is the same tape: drawn at 40 px inside the tape frame, every
         pixel opaque and lit, blown up hard, the lines' canvas clear (the old face's ground once covered the still), the picture held
         (no bob: no transform on it); the sentence on the black box, the name with '>>'
     errors  no page error
     planted: the card's photo 128 px and smooth and the bell's tape a no-op (TAPE_PLANT): T1 and T3 red
   Run: node gates/the_why_is_a_tape_gate.js      (about three minutes: three boots of the demo)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const run = (way, env) => new Promise((res) => { const out = fs.mkdtempSync(path.join(os.tmpdir(), 'whytape-'));
  const c = spawn('node', [path.join(ROOT, 'tools/bohemia_fight_screen_the_why_is_true.js'), 'demo', way, out, 'job'], { env: Object.assign({}, process.env, env || {}), stdio: 'ignore' });
  const t = setTimeout(() => { try { c.kill(); } catch (e) {} }, 420000);
  c.on('exit', () => { clearTimeout(t); let T = null; try { T = JSON.parse(fs.readFileSync(path.join(out, 'why_true.json'), 'utf8')); } catch (e) {} try { fs.rmSync(out, { recursive: true, force: true }); } catch (e) {} res(T); }); });
const secs = (s) => { const m = /▶ (\d+):(\d\d)/.exec(String(s || '')); return m ? +m[1] * 60 + +m[2] : null; };
const BLACK = 'rgb(6, 5, 4)';
const t1 = (T) => { const C = T && T.tapeCard; return !!C && C.tape && !C.dark && C.w === 64 && /pixelated|crisp-edges/.test(C.render) && C.lit >= 40 && C.lines && C.osdShown && secs(C.osd) !== null && secs(C.osd2) > secs(C.osd); };
const t2 = (T) => { const C = T && T.tapeCard; return !!C && !!C.caption && C.caption.bg === BLACK && C.caption.display === 'inline' && !!C.caption.text && /^">> "$/.test(C.mark || ''); };
const t3 = (T) => { const P = T && T.tape; return !!P && P.wrapped && P.w === 40 && P.alpha === 255 && P.lit >= 60 && /pixelated|crisp-edges/.test(P.render) && /rgba\(0, 0, 0, 0\)|transparent/.test(P.linesClear || '') && (P.transform === 'none' || !P.transform)
  && P.caption.bg === BLACK && P.caption.display === 'inline' && /^">> "$/.test(P.mark || ''); };
const say = (T) => { const C = (T && T.tapeCard) || {}, P = (T && T.tape) || {};
  return 'card: ' + (C.w || '?') + ' px at ' + (C.css || '?') + ' pt, ' + (C.render || '?') + ', lit ' + C.lit + ', counter ' + C.osd + ' then ' + C.osd2 + ', caption ' + (C.caption ? C.caption.bg + ' ' + C.caption.display : 'none') + ' ' + C.mark
    + '; bell: ' + (P.w || '?') + ' px at ' + (P.css || []).join('x') + ', ' + (P.render || '?') + ', lit ' + P.lit + ', lines ' + P.linesClear + ', transform ' + P.transform + ', caption ' + (P.caption ? P.caption.bg + ' ' + P.caption.display : 'none'); };
(async () => {
  const [U, S] = await Promise.all([run('upright'), run('sideways')]);
  if (!U || !S) { check(false, 'ran', 'the page did not reach the bell (upright ' + !!U + ', sideways ' + !!S + ')'); console.log('\nTHE WHY IS A TAPE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
  const W = [['upright', U], ['on its side', S]];
  check(t1(U) && t1(S), 'T1', 'the still on the card: ' + W.map(w => w[0] + ' ' + say(w[1]).split('; bell')[0]).join(' | '));
  check(t2(U) && t2(S), 'T2', 'the caption on the card: ' + W.map(w => w[0] + ' ' + JSON.stringify((w[1].tapeCard || {}).caption || null) + ' ' + (w[1].tapeCard || {}).mark).join(' | '));
  check(t3(U) && t3(S), 'T3', 'the still at the bell: ' + W.map(w => w[0] + ' ' + say(w[1]).split('; ')[1]).join(' | '));
  check(!(U.errs || []).length && !(S.errs || []).length, 'errors', ((U.errs || []).length + (S.errs || []).length) + ' page errors');
  const P = await run('upright', { TAPE_PLANT: '1' });
  check(!!P && !t1(P) && !t3(P), 'planted', 'the card\'s photo 128 px and smooth, the bell\'s tape a no-op: T1 ' + (P && t1(P) ? 'green (the gate cannot see it)' : 'red') + ', T3 ' + (P && t3(P) ? 'green (the gate cannot see it)' : 'red'));
  console.log('\nTHE WHY IS A TAPE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
})();
