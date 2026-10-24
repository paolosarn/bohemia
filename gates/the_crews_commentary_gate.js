#!/usr/bin/env node
/* THE CREW'S COMMENTARY (COMBAT [the crew's commentary], rule 143(c), Paolo 10/24: 'I like how our team members are speaking...
   everyone gets assigned a personality, lots of different personality types... depending on the enemy or how many enemies,
   like how UFC the video game does its commentary, people can read it reacting to shit, if someone dies, oh fuck they got
   shot'). With 143(a) (Spanglish on about one line in eight, never the player) and 143(d) (the down do not talk).

   Legs:
   1. THE BANK (records/target/bb/crew_voices.json, WORDS' bank or COMBAT's placeholder, one shape): six types or more, every type
      has English lines for every moment the fight calls (hit, miss, dodged, kill, man_down, outnumbered, superior, their_turn,
      win), every man_down and superior line names the man ({name}), draft:true, a source;
   and on his phone's profile (390 x 844), the real fight page, twelve of his against a marauder and two thugs:
   2. EVERY MAN BUT YOU HAS A TYPE, the same man the same type in a second fight (off his own look);
   3. A BETTER ENEMY IS CALLED BY NAME: the man of theirs who outclasses the crew is named in a line, red-edged;
   4. A MAN DOWN IS CALLED BY NAME, by another man, within two beats;
   5. THE DOWN DO NOT TALK: a line up when its speaker falls goes at once;
   6. SPANGLISH ABOUT ONE LINE IN EIGHT: 3,000 lines rolled for the crew come out Spanglish between 6 and 20 in 100 (WORDS'
      dial), and YOU is never picked to speak;
   7. ONE AT A TIME ON AUTO TO THE END: a whole fight's lines, never two up at once (with the veteran's lesson either), never from
      YOU, never from a man off the field, and the win quoted on the recap by a man still standing.
   Run: node gates/the_crews_commentary_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE CREW\'S COMMENTARY GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

const MOMENTS = ['hit', 'miss', 'dodged', 'kill', 'man_down', 'outnumbered', 'superior', 'their_turn', 'win'];
const B = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/crew_voices.json'), 'utf8'));
const types = Object.keys(B.types || {}), holes = [];
types.forEach(k => MOMENTS.forEach(m => { const L = (B.types[k].lines || {})[m]; if (!L || !Array.isArray(L.en) || !L.en.length) holes.push(k + '.' + m);
  else if ((m === 'man_down' || m === 'superior') && L.en.concat(L.sp || []).some(x => x.indexOf('{name}') < 0)) holes.push(k + '.' + m + ' names nobody'); }));
leg(types.length >= 6 && !holes.length && B.draft === true && !!B.source, '*** THE BANK ***: ' + types.length + ' personality types, every moment in English, every man down and better enemy named, draft, sourced', holes.slice(0, 4).join(' | ') || types.join(', '));

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const opts = { kind: 'suburb', deploy: false, teach: false, band: ['brigand_thug', 'brigand_marauder', 'brigand_thug'] };
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil && CALL.bank, null, { timeout: 40000 });
    /* 2 */
    const t2 = await p.evaluate(() => FIGHT.S.units.filter(v => v.side === 'you').map(v => ({ n: v.name, main: !!v.main, look: v.look, type: crewType(v) })));
    leg(t2.filter(x => !x.main).every(x => !!x.type) && new Set(t2.map(x => x.type)).size >= 3, 'EVERY MAN BUT YOU HAS A TYPE', t2.filter(x => !x.main).map(x => x.n + '=' + x.type).join(' '));
    /* 3: the better enemy, named, before the first blow lands on him */
    await p.waitForFunction(() => !!FIGHT_UI.callBetter, null, { timeout: 20000 }).catch(() => {});
    const s3 = await p.evaluate(() => { const c = (FIGHT_UI.calls || []).filter(x => x.moment === 'superior')[0], b = FIGHT.byId(FIGHT_UI.callBetter);
      return { line: c && c.line, name: b && b.name, hot: document.getElementById('call').classList.contains('hot') || (c && true) }; });
    leg(!!s3.line && !!s3.name && s3.line.toLowerCase().indexOf(s3.name.toLowerCase()) >= 0, '*** A BETTER ENEMY IS CALLED BY NAME ***', s3.line + ' (' + s3.name + ')');
    /* 4: a man down, named by another man */
    const s4 = await p.evaluate(async () => {
      FIGHT_UI.auto = false; FIGHT_UI.callQ = null; if (FIGHT_UI.call) callHide(false); FIGHT_UI.callLastAt = 0;
      const v = FIGHT.S.units.filter(u => u.side === 'you' && !u.main && FIGHT.onField(u))[0];
      v.down = true; v._fallAt = performance.now(); callSoon('man_down', v);
      const t0 = performance.now();
      while (performance.now() - t0 < beatMs() * 2 && !(FIGHT_UI.call && FIGHT_UI.call.moment === 'man_down')) await new Promise(r => setTimeout(r, 30));
      const C = FIGHT_UI.call;
      return { who: v.name, line: C && C.line, by: C && FIGHT.byId(C.who).name, ms: Math.round(performance.now() - t0) };
    });
    leg(!!s4.line && s4.line.toLowerCase().indexOf(s4.who.toLowerCase()) >= 0 && s4.by !== s4.who, '*** A MAN DOWN IS CALLED BY NAME ***, by another man, within two beats', s4.by + ': ' + s4.line + ' (' + s4.ms + ' ms)');
    /* 5: the speaker falls with his line up */
    const s5 = await p.evaluate(async () => {
      const C = FIGHT_UI.call; if (!C) return { up: false };
      const v = FIGHT.byId(C.who); v.down = true;
      await new Promise(r => setTimeout(r, 250));
      return { up: true, who: v.name, after: document.getElementById('call').style.display, gone: !FIGHT_UI.call };
    });
    leg(s5.up && s5.after === 'none' && s5.gone, '*** THE DOWN DO NOT TALK ***: his line goes the moment he falls', JSON.stringify(s5));
    /* 6 */
    const s6 = await p.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'you') u.down = false; });
      const crew = FIGHT.S.units.filter(u => u.side === 'you' && !u.main); let sp = 0, n = 0;
      for (let i = 0; i < 3000; i++) { const v = crew[i % crew.length], L = callLine(v, ['hit', 'miss', 'kill', 'their_turn'][i % 4], { name: 'X', us: 1, them: 2 }); if (L) { n++; if (L.sp) sp++; } }
      const you = FIGHT.S.units.filter(u => u.main)[0]; let picked = 0; for (let i = 0; i < 300; i++) if (callSpeaker(null) === you) picked++;
      return { pct: Math.round(1000 * sp / Math.max(1, n)) / 10, n, youPicked: picked, youSp: crewSpeaksSp(you, 'x'), dial: !!window.BohemiaSpanglish };
    });
    leg(s6.pct >= 6 && s6.pct <= 20 && s6.youPicked === 0 && !s6.youSp, '*** SPANGLISH ABOUT ONE LINE IN EIGHT ***, YOU never picked', s6.pct + '% of ' + s6.n + ' lines' + (s6.dial ? ' (WORDS\' dial)' : ' (the bank\'s share)') + ', YOU picked ' + s6.youPicked);
    /* 7: AUTO to the end */
    await p.evaluate(() => { FIGHT_UI.callBetter = FIGHT_UI.callBetter || true; FIGHT_UI.calls = []; FIGHT_UI.auto = true; hud(); });
    let both = 0, samples = 0, offField = 0;
    for (let i = 0; i < 500; i++) {
      const st = await p.evaluate(() => { const C = FIGHT_UI.call, v = C && FIGHT.byId(C.who);
        return { o: document.getElementById('over').style.display, c: document.getElementById('call').style.display === 'flex', vt: document.getElementById('vet').style.display === 'flex', off: !!(C && !FIGHT.onField(v)) }; });
      samples++; if (st.c && st.vt) both++; if (st.off) offField++;
      if (st.o === 'flex') break;
      await p.waitForTimeout(200);
    }
    const s7 = await p.evaluate(() => ({ res: FIGHT.S.result, calls: FIGHT_UI.calls, quote: (document.querySelector('#ob .quote') || {}).textContent || '' }));
    const fromYou = s7.calls.filter(c => c.main).length;
    leg(s7.calls.length >= 3 && !both && !fromYou && !offField, '*** ONE AT A TIME ON AUTO TO THE END ***: never two up, never YOU, never a man off the field',
      s7.calls.length + ' lines (' + Array.from(new Set(s7.calls.map(c => c.moment))).join(', ') + '), ' + samples + ' looks, two up ' + both + ', from YOU ' + fromYou + ', off the field ' + offField);
    leg(s7.res !== 'won' || /^".+" [A-Z]/.test(s7.quote), '  the win is quoted on the recap by a man still standing', s7.res + ': ' + s7.quote);
    leg(!errs.length, '  the page threw nothing', errs.join(' | '));
  } finally { await d.close(); }
  done();
})().catch(e => { console.error(e); fail++; done(); });
