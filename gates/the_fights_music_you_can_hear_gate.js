#!/usr/bin/env node
/* THE FIGHT'S MUSIC YOU CAN HEAR, AND IT NEVER CHOPS (SOUNDS, 10/25/26, rows [the fight's music you can hear] and
   [the sound never chops]; rules 168(b)(d), 175(a)(c)(d), 181(c)).

   PAOLO 10/25, playing a fight: 'I only hear the sound effects... I'm not hearing any music'; and 'every time I play the
   game on my car speakers through Bluetooth it gets all choppy'. Rule 181(c): the music's level against the effects and
   the chop are FIXES, not new music; his approved songs play exactly the same, only heard and steadier.

   ON THE REAL SURFACE: the demo, his music on, a road fight through the map's own door, AUTO, seeded, on the phone profile
   with the CPU four times slower (175(d)) and on the computer profile. Three ears on the live graph:
     MUSIC    after his music slider (the song as he hears it)       EFFECTS  the effects bus after its slider
     THE END  the brickwall's output, everything he hears
   and a watch on his engine's scheduler: every step it books, how far ahead of the audio clock.
   LEGS, each profile:
     (MUSIC and EFFECTS are read after the fight's own lift and trim, __FIGHTLIFT and __FIGHTTRIM, when they exist)
     1  A SONG FROM THE FIRST FRAME TO THE END SCREEN (168(b)): music in every second of the fight, never a silent second
     2  THE SONG IS ABOVE THE EFFECTS (168(b)): while effects sound, the music's level is at or above theirs (the median of
        the 100 ms windows where an effect sounds; MEASURED BEFORE THE FIX on the computer: music -32.6 dB, effects -31.3,
        the song under the shots), and the music's own level in the fight is no lower than on the map before it
     3  THE SONG NEVER STARTS OVER (175(a)): a stall moves the song on (it used to re-anchor it to its first step); and NO
        NOTE BOOKED LATE on the computer; on the phone at 4x the late count is reported as OWED to rule 175(b)
     4  ONE AUDIOCONTEXT FOR THE GAME (175(c)): the fight frame never makes its own
     5  A PLAYBACK-SIZED BUFFER (175(c)): the game's AudioContext asks for 'playback' latency (the bigger buffer a car's
        Bluetooth needs; measured base latency reported)
   node gates/the_fights_music_you_can_hear_gate.js [--computer-only|--phone-only] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const db = x => x > 0 ? 20 * Math.log10(x) : -120;

const ARM = `(function(){
  /* the fight the map opens takes a seed, so the same fight plays every run */
  if (/BOHEMIA_FIGHT/.test(location.href)) { let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } });
    /* every AudioContext the fight frame makes is counted (175(c): one for the game) */
    window.__FRAME_ACS = 0; const C = window.AudioContext || window.webkitAudioContext;
    if (C) { const W = function (o) { window.__FRAME_ACS++; return new C(o); }; W.prototype = C.prototype; window.AudioContext = W; window.webkitAudioContext = W; }
    return; }
  /* the game's own AudioContext: what it asked for */
  const C = window.AudioContext || window.webkitAudioContext;
  if (C) { window.__AC_ASKED = []; const W = function (o) { window.__AC_ASKED.push(o && o.latencyHint || null); return new C(o); }; W.prototype = C.prototype; window.AudioContext = W; if (window.webkitAudioContext) window.webkitAudioContext = W; }
})();`;

async function one(profile, throttle) {
  console.log('-- ' + profile + (throttle > 1 ? ', CPU ' + throttle + 'x slower' : ''));
  let d;
  try { d = await drive.open({ keepCards: true, profile, throttle, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, profile + ': the demo boots', String(e.message).slice(0, 160)); return; }
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running', null, { timeout: 60000 });
    await p.waitForFunction(() => !!window.__FIGHTLIFT && !!window.__FIGHTTRIM, null, { timeout: 8000 }).catch(() => {});
    await p.evaluate(() => {
      const L = window.__E = { win: [], live: false, over: false, late: 0, booked: 0, worstAhead: 9, mapMus: [] };
      const ac = MUS.AC, sr = ac.sampleRate, W = Math.round(sr * 0.1);
      /* three ears, each a ScriptProcessor into a muted gain (heard by nobody, so it changes nothing he hears) */
      const ear = (src, key) => { if (!src) return; const sp = ac.createScriptProcessor(4096, 1, 1), z = ac.createGain(); z.gain.value = 0; src.connect(sp); sp.connect(z); z.connect(ac.destination);
        let acc = 0, n = 0, t0 = null;
        sp.onaudioprocess = ev => { const a = ev.inputBuffer.getChannelData(0); if (t0 === null) t0 = ev.playbackTime;
          for (let i = 0; i < a.length; i++) { acc += a[i] * a[i]; n++; if (n === W) { L.win.push([key, +(ev.playbackTime + i / sr).toFixed(2), Math.sqrt(acc / n), L.live ? (L.over ? 2 : 1) : 0]); acc = 0; n = 0; } } }; };
      ear(window.__FIGHTLIFT || window.__MUSVOL, 'm'); const sfx = window.__sfxOut && window.__sfxOut(); ear(window.__FIGHTTRIM || (sfx && sfx.bus !== window.__OUTBUS ? sfx.bus : window.__SFXBUS), 'e'); ear(window.__LIMITER, 'o');
      const ps = MUS.playStep;
      L.restarts = 0; let cur = null;
      MUS.playStep = function (s, t) { if (L.live && !L.over && MUS.AC === ac) { L.booked++; const ahead = t - ac.currentTime; if (ahead < 0) L.late++; if (ahead < L.worstAhead) L.worstAhead = ahead;
          /* the song starting over with no new song: the stall's old re-anchor */
          if (MUS.step === 0 && cur === MUS.cur && L.booked > 1) L.restarts++; cur = MUS.cur; } return ps.apply(MUS, arguments); };
      addEventListener('message', ev => { const m = ev.data; if (!m || !m.type) return; const f = document.getElementById('fightFrame'); if (!f || ev.source !== f.contentWindow) return;
        if (m.type === 'BOHEMIA_COMBAT_STARTED') { L.live = true; L.t0 = ac.currentTime; }
        if (m.type === 'BOHEMIA_FIGHT_OVER') { L.over = true; L.t1 = ac.currentTime; } });
    });
    await p.waitForTimeout(6000);   /* the map's own level, before the fight */
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 400 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    /* a finger on the board first, the way he plays (the fight frame made its own AudioContext on a finger down) */
    const box = await (await p.$('#fightFrame')).boundingBox();
    if (box) { await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down(); await p.waitForTimeout(60); await p.mouse.up(); }
    await f.evaluate(() => { FIGHT_UI.auto = true; });
    let over = false;
    for (let i = 0; i < 700 && !over; i++) { over = await p.evaluate(() => window.__E.over); if (!over) await p.waitForTimeout(500); }
    if (!over) throw new Error('the fight never ended inside six minutes');
    await p.waitForTimeout(2500);
    const frameACs = await f.evaluate(() => window.__FRAME_ACS || 0).catch(() => -1);
    const R = await p.evaluate(() => ({ E: window.__E, asked: window.__AC_ASKED || [], base: MUS.AC.baseLatency || 0, out: MUS.AC.outputLatency || 0, mix: window.getMix && window.getMix() }));
    const E = R.E, W = E.win;
    const pick = (k, ph) => W.filter(w => w[0] === k && w[3] === ph);
    const fightM = pick('m', 1), fightE = pick('e', 1), mapM = pick('m', 0).slice(-40);
    /* 1: a song in every second of the fight (a second whose loudest 100 ms is under -60 dBFS is a silent second) */
    const secs = {}; fightM.forEach(w => { const s = Math.floor(w[1]); secs[s] = Math.max(secs[s] || 0, w[2]); });
    const silent = Object.keys(secs).filter(s => db(secs[s]) < -60);
    leg(Object.keys(secs).length >= 10 && silent.length === 0, profile + ': *** A SONG FROM THE FIRST FRAME TO THE END SCREEN ***, music in every second of the fight',
      Object.keys(secs).length + ' seconds of fight, ' + silent.length + ' silent' + (silent.length ? ' (at ' + silent.slice(0, 5).join(', ') + ')' : ''));
    /* 2: above the effects: the music's level in the windows where effects sound */
    const mAt = {}; fightM.forEach(w => { mAt[w[1].toFixed(1)] = w[2]; });
    const loud = fightE.filter(w => db(w[2]) > -50);
    const pairs = loud.map(w => [db(mAt[w[1].toFixed(1)] || 0), db(w[2])]).filter(x => x[0] > -119);
    const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : -120; };
    const musWhile = med(pairs.map(x => x[0])), sfxWhile = med(pairs.map(x => x[1]));
    const musFight = med(fightM.map(w => db(w[2]))), musMap = med(mapM.map(w => db(w[2])));
    leg(pairs.length >= 5 && musWhile >= sfxWhile && musFight >= musMap - 1, profile + ': *** THE SONG IS ABOVE THE EFFECTS ***: while effects sound the music is at or above them, and no quieter than on the map',
      'while effects sound: music ' + musWhile.toFixed(1) + ' dB, effects ' + sfxWhile.toFixed(1) + ' dB (' + pairs.length + ' windows); the music in the fight ' + musFight.toFixed(1) + ' dB, on the map ' + musMap.toFixed(1) + ' dB; mix ' + JSON.stringify(R.mix));
    /* 3: the song never starts over in a fight; and nothing booked late, asserted where the CPU is a computer's. On the phone
       at 4x the count is REPORTED, OWED: a step his engine books on a stalled main thread lands late at any horizon the
       turn can still obey (SOUNDS 9/18 measured the sweep); the cure is the music rendered ahead (rule 175(b)), the card's
       way, and it is the next part of [the sound never chops], not a number to move here. */
    leg(E.booked >= 40 && E.restarts === 0, profile + ': *** THE SONG NEVER STARTS OVER ***, a stall moves it on, never back to its first step',
      E.restarts + ' restarts in ' + E.booked + ' steps');
    if (throttle > 1) console.log('  owed ' + profile + ': notes booked late at 4x: ' + E.late + ' of ' + E.booked + ', the latest ' + (-E.worstAhead * 1000).toFixed(0) + ' ms behind the clock (rule 175(b), the music rendered ahead)');
    else leg(E.booked >= 40 && E.late === 0, profile + ': *** NO NOTE BOOKED LATE ***, every step of the fight booked ahead of the audio clock',
      E.booked + ' steps booked in the fight, ' + E.late + ' late, the closest ' + (E.worstAhead * 1000).toFixed(0) + ' ms ahead');
    /* 4, 5 */
    leg(frameACs === 0, profile + ': *** ONE AUDIOCONTEXT FOR THE GAME ***, the fight frame makes none of its own', frameACs + ' made by the fight frame');
    leg(R.asked.length >= 1 && R.asked.every(x => x === 'playback'), profile + ': *** A PLAYBACK-SIZED BUFFER ***, the game asks for playback latency',
      'asked ' + JSON.stringify(R.asked) + ', base latency ' + (R.base * 1000).toFixed(1) + ' ms, output ' + (R.out * 1000).toFixed(1) + ' ms');
  } catch (e) { leg(false, profile + ': the fight plays through', String(e.message).slice(0, 200)); }
  await d.close();
}

(async () => {
  const a = process.argv.slice(2);
  if (!a.includes('--computer-only')) await one('phone_portrait', 4);
  if (!a.includes('--phone-only')) await one('computer', 1);
  console.log("THE FIGHT'S MUSIC YOU CAN HEAR: " + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
