#!/usr/bin/env node
/* THE FIGHT DRIVES THE MUSIC (COMBAT [the fight drives the music], rule 126, Paolo 10/23: 'I almost played a first day; the
   combat should feel a lot better; we have a whole intensity system with the music, wtf bro'; the same hour, 126(e): 'when
   it's the enemies' turn have it at the low intensity, I want to hear it's my turn time').
   MEASURED BEFORE: the shell's ladder (KILLMUS, window.INTENSITY) hears BOHEMIA_COMBAT_STARTED, BOHEMIA_PLAYER_HIT,
   BOHEMIA_SHOT_RESULT 'killshot' and an end, and the rebuilt fight posted none of them: the song never moved in a fight.

   Legs, on the fight's own page (fast, AUTO, seeded):
   1. THE FIGHT TELLS THE MUSIC: the board up says COMBAT_STARTED first; every man of theirs who falls is one killshot; every
      blow that lands on one of his is one PLAYER_HIT; the turn is told as it passes, never the same side twice in a row;
      BOHEMIA_COMBAT_END is never sent (the frozen fight's settle: its handler takes him home before the recap's beats);
   2. EVERY HIT, KILL AND FALL IS HEARD (126(c)): one hit sound for every blow that lands, one miss for every miss, one fall
      sound (kill / went_down) for every man down, his and theirs;
   3. A SKIPPED TURN IS HEARD: a skip with a hit on his man and one of theirs dead tells the ladder both and plays one of each
      sound, a quarter beat apart;
   and in the demo with his music on (the real surface; a road fight through the map's own door, AUTO, seeded):
   4. THE SONG LIFTS WHEN THE FIGHT STARTS: MUS.layers 0 -> 2 or more inside a bar of the board coming up, on a beat;
   5. THEIR TURN DROPS IT, HIS BRINGS IT BACK, ON THE BEAT (126(e)): every turn the shell hears moves the arrangement to the
      bottom (their turn) or back to the fight's level (his) at the next beat, never between two beats;
   6. KILLS CLIMB IT: the shell counts every killshot the fight sends, and after the second, his turn plays the top (4);
   7. THE END SETTLES ON THE BAR: after the fight's BOHEMIA_FIGHT_OVER the arrangement comes down at the top of a bar, the
      count and the threat cleared, and the recap still gets its beats (he is not sent home at once);
   8. HIS SONGS ONLY (rule 122): every bar of the fight played a song in his set, the music never stopped;
   9. YOU HEAR IT: live, the notes a bar at the fight's level and at the top outnumber the bottom's (the parts his songs
      carry come in; the master's level is reported, not judged: the parts are a lead line or a drum, not a volume);
   10. nothing threw.
   Run: node gates/the_fight_drives_the_music_gate.js */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('THE FIGHT DRIVES THE MUSIC: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const HEARD_HIT = ['hurt', 'vital', 'hit', 'melee_hit'];

/* the tallies: every event the rules hand the motion, every sound asked for, every message to the shell */
const TALLY = `(function(){
  const T = window.__T = { hits: 0, mineHit: 0, misses: 0, falls: 0, theirFalls: 0, sfx: {}, told: [] };
  const tk = window.take; window.take = function(){ (FIGHT.S.events || []).forEach(function (e) {
      if (e.t === 'attack') { if (e.hit) { T.hits++; const t = FIGHT.byId(e.to); if (t && t.side === 'you') T.mineHit++; } else T.misses++; }
      if (e.t === 'dead' || e.t === 'down') { T.falls++; const v = FIGHT.byId(e.id); if (v && v.side === 'them') T.theirFalls++; } });
    return tk.apply(this, arguments); };
  const sf = window.sfx; window.sfx = function (ev) { T.sfx[ev] = (T.sfx[ev] || 0) + 1; return sf.apply(this, arguments); };
  const ts = window.toShell; window.toShell = function (m) { T.told.push(m.type.replace('BOHEMIA_', '') + (m.side ? ' ' + m.side : '') + (m.outcome ? ' ' + m.outcome : '')); return ts.apply(this, arguments); };
})();`;

(async () => {
  /* ---------------- the fight's own page ---------------- */
  const src = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const base = { seed: 11, speed: 3, kind: 'suburb', flat: true, deploy: false, formation: null,
    band: ['brigand_raider', 'brigand_raider', 'brigand_marksman', 'brigand_marauder', 'brigand_thug', 'brigand_thug'] };   /* men who hit back */
  let d = await drive.open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(base) });
  let p = d.page;
  try {
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 40000 });
    /* the board came up before the tallies: its first word is read off the fight's own list */
    const first = await p.evaluate(() => (FIGHT_UI.told || [])[0]);
    await p.evaluate(TALLY);
    await p.evaluate(() => { FIGHT_UI.auto = true; });
    await p.waitForFunction(() => FIGHT.S.over && !FIGHT_UI.anim.length && document.getElementById('over').style.display === 'flex', null, { timeout: 240000 });
    await p.waitForTimeout(800);
    const T = await p.evaluate(() => window.__T);
    const turns = T.told.filter(s => /^FIGHT_TURN/.test(s)), twice = turns.filter((s, i) => i && s === turns[i - 1]).length;
    const kills = T.told.filter(s => /^SHOT_RESULT killshot$/.test(s)).length, hits = T.told.filter(s => s === 'PLAYER_HIT').length;
    const neverEnd = !/postMessage\(\{\s*type:\s*'BOHEMIA_COMBAT_END'/.test(src) && !T.told.some(s => /COMBAT_END/.test(s));
    leg(first === 'BOHEMIA_COMBAT_STARTED' && kills === T.theirFalls && T.theirFalls > 0 && hits === T.mineHit && T.mineHit > 0 && turns.length >= 4 && twice === 0 && neverEnd,
      '*** THE FIGHT TELLS THE MUSIC ***: COMBAT_STARTED with the board, a killshot for every man of theirs down, a PLAYER_HIT for every blow on his, the turn as it passes, never COMBAT_END',
      'first ' + first + '; killshots ' + kills + ' for ' + T.theirFalls + ' of theirs down; PLAYER_HIT ' + hits + ' for ' + T.mineHit + ' blows on his; ' + turns.length + ' turns told, ' + twice + ' twice in a row; COMBAT_END never: ' + neverEnd);
    const heardHits = HEARD_HIT.reduce((a, k) => a + (T.sfx[k] || 0), 0), heardFalls = (T.sfx.kill || 0) + (T.sfx.went_down || 0);
    leg(heardHits === T.hits && (T.sfx.miss || 0) === T.misses && heardFalls === T.falls && T.falls > 0,
      '*** EVERY HIT, KILL AND FALL IS HEARD ***: a hit sound for every blow that lands, a miss for every miss, a fall sound for every man down',
      'hits ' + heardHits + ' heard of ' + T.hits + ', misses ' + (T.sfx.miss || 0) + ' of ' + T.misses + ', falls ' + heardFalls + ' of ' + T.falls + ' ' + JSON.stringify(T.sfx));
    /* a skipped turn: one of theirs hits one of his, one of his drops one of theirs, with no motion */
    const sk = await p.evaluate(() => {
      const mine = FIGHT.S.units.filter(u => u.side === 'you')[0], theirs = FIGHT.S.units.filter(u => u.side === 'them')[0];
      window.__T.told = []; window.__T.sfx = {};
      MUSIC.skipped([{ t: 'attack', id: theirs.id, to: mine.id, hit: true, hp: 9 }, { t: 'attack', id: mine.id, to: theirs.id, hit: true, hp: 30, shot: true }, { t: 'dead', id: theirs.id }]);
      return new Promise(r => setTimeout(() => r({ told: window.__T.told, sfx: window.__T.sfx }), 60000 / R('ours.beat_bpm') / FIGHT_UI.speed + 200));
    });
    leg(sk.told.join() === 'PLAYER_HIT,SHOT_RESULT killshot' && sk.sfx.hurt === 1 && sk.sfx.hit === 1 && sk.sfx.kill === 1,
      '*** A SKIPPED TURN IS HEARD ***: the ladder hears the hit and the kill, the ear one of each sound', JSON.stringify(sk));
  } catch (e) { leg(false, 'the fight\'s page ran', String(e.message).slice(0, 200)); }
  await d.close();

  /* ---------------- the demo, his music on ---------------- */
  /* the fight the map opens takes a seed (the door hands none), so the same fight plays every run */
  const ARM = `(function(){ if (!/BOHEMIA_FIGHT/.test(location.href)) return; let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } }); })();`;
  try { d = await drive.open({ keepCards: true, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, 'the demo boots', String(e.message).slice(0, 160)); return done(); }
  p = d.page;
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running', null, { timeout: 30000 });
    await p.evaluate(() => {
      const L = window.__ML = { sets: [], msgs: [], voices: {}, steps: {}, songs: {}, outside: 0, stopped: 0, live: false };
      /* the ladder commits a pending change when the scheduler reads MUS.layers for the step it books: log every change
         of what a read returns, with the step being booked */
      const D = Object.getOwnPropertyDescriptor(MUS, 'layers'); L.exact = !!(D && D.get) && KILLMUS.exact === true;
      let last = MUS.layers, vv = last;
      const note = x => { if (x !== last) L.sets.push({ t: performance.now(), to: x, from: last, step: MUS.step }); last = x; return x; };
      Object.defineProperty(MUS, 'layers', { configurable: true,
        get() { return note(D.get ? D.get.call(MUS) : vv); }, set(x) { if (D.set) D.set.call(MUS, x); else vv = x; note(x); } });
      let inStep = false, n = 0;
      const ac = MUS.AC;
      ['createOscillator', 'createBufferSource'].forEach(k => { const o = ac[k].bind(ac); ac[k] = function () { if (inStep) n++; return o(); }; });
      /* THE EAR: every sample the master plays, binned by the arrangement of the step it belongs to (a step's own audio
         time is the scheduler's nextT, handed to playStep; the step's level is what the step read) */
      const booked = [], sr = ac.sampleRate, sd = MUS.stepDur(); let bi = 0;
      L.e = {}; L.eN = {};
      const sp = ac.createScriptProcessor(4096, 1, 1), z = ac.createGain(); z.gain.value = 0; MUS.MAST.connect(sp); sp.connect(z); z.connect(ac.destination);
      sp.onaudioprocess = ev => { const a = ev.inputBuffer.getChannelData(0), t0 = ev.playbackTime;
        for (let i = 0; i < a.length; i += 4) { const t = t0 + i / sr;
          while (bi < booked.length - 1 && booked[bi + 1].t <= t) bi++;
          const b = booked[bi]; if (!b || t < b.t || t >= b.t + sd) continue;
          L.e[b.k] = (L.e[b.k] || 0) + a[i] * a[i]; L.eN[b.k] = (L.eN[b.k] || 0) + 1; } };
      const ps = MUS.playStep;
      MUS.playStep = function (s, t) { inStep = true; n = 0;
        try { return ps.apply(MUS, arguments); }
        finally { inStep = false;
          if (L.live) { const k = MUS.layers; L.voices[k] = (L.voices[k] || 0) + n; L.steps[k] = (L.steps[k] || 0) + 1; if (MUS.AC === ac) booked.push({ t: t, k: k });
            const nm = SONGFENCE.now(); L.songs[nm] = 1; if (!SONGFENCE.ok()) L.outside++; } } };
      setInterval(() => { if (L.live && !MUS.playing) L.stopped++; }, 250);
      addEventListener('message', ev => { const m = ev.data; if (!m || !m.type || !/^BOHEMIA_(COMBAT_STARTED|PLAYER_HIT|SHOT_RESULT|FIGHT_TURN|FIGHT_OVER|COMBAT_END)$/.test(m.type)) return;
        const f = document.getElementById('fightFrame'); if (!f || ev.source !== f.contentWindow) return;
        if (m.type === 'BOHEMIA_COMBAT_STARTED') L.live = true;
        L.msgs.push({ t: performance.now(), type: m.type, side: m.side, outcome: m.outcome, step: MUS.step, kills: KILLMUS.kills });
        if (m.type === 'BOHEMIA_FIGHT_OVER') setTimeout(() => { L.homeAfterBeat = typeof CITYFIGHT !== 'undefined' && CITYFIGHT; }, 1000); });
    });
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 300 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    await f.evaluate(() => { FIGHT_UI.auto = true; });
    let over = null;
    for (let i = 0; i < 600 && !over; i++) { over = await p.evaluate(() => window.__ML.msgs.filter(m => m.type === 'BOHEMIA_FIGHT_OVER')[0] || null); if (!over) await p.waitForTimeout(500); }
    if (!over) throw new Error('the fight never ended inside five minutes');
    await p.waitForTimeout(3500);
    const R = await p.evaluate(() => ({ L: window.__ML, K: { kills: KILLMUS.kills, threat: KILLMUS.threat, theirTurn: KILLMUS.theirTurn }, layers: MUS.layers, playing: MUS.playing }));
    const L = R.L, msgs = L.msgs, sets = L.sets, start = msgs.filter(m => m.type === 'BOHEMIA_COMBAT_STARTED')[0];
    const beatMs = 500, barMs = 2000, POLL = 130;   /* 120 BPM; the ladder looks every 60 ms and a step lasts 125 */
    /* 4: the lift */
    const lift = start && sets.filter(s => s.t >= start.t && s.from === 0 && s.to >= 2)[0];
    leg(!!lift && lift.t - start.t <= barMs + POLL && lift.step % 4 === 0,
      '*** THE SONG LIFTS WHEN THE FIGHT STARTS ***: 0 -> 2 or more inside a bar, on a beat',
      lift ? 'layers ' + lift.from + ' -> ' + lift.to + ' ' + Math.round(lift.t - start.t) + ' ms after the board, at step ' + lift.step : 'no lift');
    /* 5: every turn moves it at the next beat (a turn shorter than a beat is not a change the music owes) */
    const turns = msgs.filter(m => m.type === 'BOHEMIA_FIGHT_TURN'), ends = msgs.filter(m => m.type === 'BOHEMIA_FIGHT_OVER');
    let owed = 0, landed = 0, late = [], offBeat = 0;
    turns.forEach((m, i) => {
      const next = (turns[i + 1] || ends[0] || { t: Infinity }).t;
      if (next - m.t < beatMs + POLL) return;                             /* gone before the next beat: nothing owed */
      owed++;
      const want = m.side === 'them' ? 0 : 2;
      const s = sets.filter(x => x.t >= m.t && x.t < next && (m.side === 'them' ? x.to === 0 : x.to >= 2))[0];
      const already = sets.filter(x => x.t < m.t).slice(-1)[0], was = already ? already.to : 0;
      if ((m.side === 'them' ? was === 0 : was >= want) && !s) { landed++; return; }   /* it was already there */
      if (s && s.t - m.t <= beatMs + POLL) landed++; else late.push(m.side + ' ' + (s ? Math.round(s.t - m.t) + ' ms' : 'never'));
    });
    sets.filter(s => start && s.t >= start.t && (!ends[0] || s.t <= ends[0].t)).forEach(s => { if (s.step % 4 !== 0) offBeat++; });
    leg(owed >= 4 && landed === owed && offBeat === 0,
      '*** THEIR TURN DROPS IT, HIS BRINGS IT BACK, ON THE BEAT ***: every turn the shell hears moves the arrangement at the next beat, never between two',
      turns.length + ' turns told, ' + owed + ' long enough to owe a change, ' + landed + ' landed inside a beat' + (late.length ? ', late: ' + late.slice(0, 4).join(' / ') : '') + '; ' + offBeat + ' changes off the beat');
    /* 6: kills */
    const kills = msgs.filter(m => m.type === 'BOHEMIA_SHOT_RESULT' && m.outcome === 'killshot');
    const second = kills[1], top = second && sets.filter(s => s.t >= second.t && s.to === 4)[0];
    const youAfter = second && turns.some(m => m.side === 'you' && m.t > second.t && (!ends[0] || m.t < ends[0].t));
    const counted = kills.every((m, i) => i === 0 || m.kills >= 1);
    leg(kills.length >= 2 && counted && (!!top || !youAfter),
      '*** KILLS CLIMB IT ***: the shell counts every killshot, and after the second his turn plays the top',
      kills.length + ' killshots' + (top ? ', the top (4) ' + Math.round(top.t - second.t) + ' ms after the second, at step ' + top.step : youAfter ? ', never the top' : ', the fight ended on the second'));
    /* 7: the end */
    const end = ends[0], down = end && sets.filter(s => s.t >= end.t && s.to === 0)[0];
    const atBar = !down ? false : down.step % 16 === 0;
    leg(!!down && atBar && down.t - end.t <= barMs + POLL && R.K.kills === 0 && !R.K.threat && !R.K.theirTurn && R.layers === 0 && L.homeAfterBeat === true && !msgs.some(m => m.type === 'BOHEMIA_COMBAT_END'),
      '*** THE END SETTLES ON THE BAR ***: down to the bottom at the top of a bar, the count and the threat cleared, the recap still up a second on',
      down ? 'down ' + Math.round(down.t - end.t) + ' ms after the end, at step ' + down.step + '; kills ' + R.K.kills + ', threat ' + R.K.threat + ', still in the fight a second on: ' + L.homeAfterBeat : 'never came down');
    /* 8 and 9 */
    const songs = Object.keys(L.songs);
    leg(L.outside === 0 && L.stopped === 0 && songs.length >= 1 && R.playing,
      '*** HIS SONGS ONLY ***: every bar of the fight in his set, the music never stopped', songs.join(', ') + '; ' + L.outside + ' steps outside the set, stopped ' + L.stopped);
    /* THE PARTS, NOT THE VOLUME: the ladder's levels add parts to his song (a lead line, taiko, stabs, a second octave:
       the song's klay), they do not turn it up, so the ear's ruler is the notes a bar, live, at each level. The master's
       level while each played is reported, not judged: different turns land on different sections of the song, and a
       same-bars replay cannot line up (REPO MAN's tape wow and flutter, the kit's random noise), measured 10/23. */
    const vpb = k => L.steps[k] ? L.voices[k] / L.steps[k] * 16 : null, db = k => L.eN[k] ? 10 * Math.log10(L.e[k] / L.eN[k] + 1e-12) : null;
    const v0 = vpb(0), v2 = vpb(2), v4 = vpb(4), up = [v2, v4].filter(x => x !== null);
    leg(v0 !== null && up.length > 0 && up.every(x => x >= v0 * 1.15) && (v4 === null || v2 === null || v4 > v2),
      '*** YOU HEAR IT ***: live, more notes a bar at the fight\'s level than at the bottom, and more again at the top: the parts his song carries come in',
      'notes a bar: bottom ' + (v0 || 0).toFixed(1) + ', fight ' + (v2 === null ? '-' : v2.toFixed(1) + ' (+' + Math.round((v2 / v0 - 1) * 100) + '%)') + ', top ' + (v4 === null ? '-' : v4.toFixed(1) + ' (+' + Math.round((v4 / v0 - 1) * 100) + '%)')
        + '; the master while each played (reported): ' + [0, 2, 4].map(k => db(k) === null ? '-' : db(k).toFixed(1) + ' dB').join(' / ') + '; the commit on the read: ' + L.exact);
    leg(d.errs.length === 0, 'nothing threw', d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 140) : ''));
  } catch (e) { leg(false, 'the demo leg ran', String(e.message).slice(0, 200)); }
  await d.close();
  done();
})();
