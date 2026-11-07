#!/usr/bin/env node
/* THE FIGHT AS HE HEARS IT (SOUNDS TWO, 11/7/26, rule 427(a); asks 47, 88, 127 and 212 on
   records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md, all four marked HALF by EYES).

   PAOLO, FOR MONTHS: music in every fight from the first frame to the end screen; the approved songs at their three levels;
   his turn hits much harder than theirs (at least 6 dB, the full drums and the lead only on his turn); every action lands on
   the beat at 120 BPM, by hand and on AUTO; one pace for every turn, no speeding up and slowing down.

   MEASURED OFF THE AUDIO, NOT OFF THE CODE'S OWN WORD. tools/bohemia_sounds_two_the_fight_heard.js puts four sample-exact
   ears (AudioWorklets) on the game's own audio graph in the demo, the real road fight through the map's own door: the music
   after his slider and the fight's lift, the same through a phone's speaker, the effects bus, and the end of the chain. Every
   leg below is read from what those ears heard, against the beats the song's transport really booked.

   LEGS, each run (his phone's profile on AUTO; his phone's profile with the CPU four times slower, on AUTO; his computer BY
   HAND, every turn of his asked for at a moment off the beat, the way a thumb is):
     A  MUSIC FROM THE FIRST FRAME TO THE END SCREEN (88): never a silent quarter of a second (250 ms under -60 dB, the music
        after his slider) from the moment the fight's frame is in the page to the end screen and 10 s on it, the end screen
        shown and heard
     B  THE THREE LEVELS (127): the map plays 1 from its recording; in the fight both 2 (their turn) and 3 (his) play, and every
        turn the fight tells is heard as its level within 1.2 s
     C  HIS TURN HITS HARDER (127): the music through a phone's speaker, his turn at least 6 dB over theirs, read off the
        recording as it played (the end of the chain, effects and all, reported)
     D  EVERY ACTION ON THE BEAT (47): the fight's sounds heard off the effects bus (an onset from 6 ms before to 60 ms after the
        moment the shell booked), at least 20 and 4 in 10 of those booked: 9 in 10 within 25 ms of the song's sixteenth grid
        (a soft sound's onset reads up to 30 ms into it on a 9 dB detector; a blow's does not) and 95 in 100 of the blows (a
        hit, a miss, a shot, a fall) within 25 ms of a beat. On the quarter-speed CPU, where the page's thread hands a third of
        the sounds over after their moment, the same holds on the ones handed over in time (20 ms) and the rest is reported
     E  ONE PACE (212): the song's beat held the whole fight (every booked beat a whole beat from the last); every motion of
        both sides on one grid, the beat, and on it; and no beat waited that was not needed between one motion and the next
        (from the first grid point the next one could take after the last one ended to the one it took): at most 1 pair in
        10 with a beat lost, and his side's mean and theirs within 0.3 of a beat on AUTO (by hand, his own are his thumb's;
        on the quarter-speed CPU the lost beats are choices the thread did not make in time: reported, not held)
   AND THE FILES (127): for every one of the thirteen, level 3 at least 6 dB over level 2 through a phone (measured fresh off
   the mp3 with the measure tool), and the full kit and the lead (the backbeat and the hook) scheduled in level 3 only.
   AND THE PLANT (the gate proves it can see a fail, every run): one more demo fight with four faults planted at once (his
   turn plays level 2; every effect booked 90 ms off its beat; their turns at double pace; two seconds of no music), and
   legs A, C, D and E must each FAIL on it, or the gate fails.

   node gates/the_fight_as_he_hears_it_gate.js [--fast|--rest] [--no-plant]   (all of it about 14 minutes; the suite runs it as two
   entries under its ten-minute cap: --fast the files, his phone's profile on AUTO and the plant, about 7; --rest the
   quarter-speed phone and the computer by hand, about 8) */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const H = require(path.join(ROOT, 'tools', 'bohemia_sounds_two_the_fight_heard.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast'), REST = argv.includes('--rest'), NOPLANT = argv.includes('--no-plant') || REST;
const GAP_DB = 6, ON_MS = 20, SHARE = 0.95, SHARE16 = 0.9;

/* ---- the legs, as tests of a reading (the plant runs the same tests and wants them false) -------------------------- */
const T = {
  A: R => ({ ok: !!R.music && R.music.windows >= 60 && R.music.silent === 0 && R.music.endScreenSecs != null && R.music.endScreenSecs >= 3 && R.music.endScreenSilent === 0,
    why: R.music ? R.music.windows + ' quarter-second windows from the frame to the end, ' + R.music.silent + ' silent' + (R.music.silentAt.length ? ' (at ' + R.music.silentAt.join(', ') + ' s)' : '') + ', the quietest ' + R.music.quietest + ' dB; the end screen heard ' + R.music.endScreenSecs + ' s, ' + R.music.endScreenSilent + ' silent' : 'no reading' }),
  B: R => ({ ok: !!R.levels && R.levels.map === 1 && R.levels.seen.includes(2) && R.levels.seen.includes(3) && R.levels.turns >= 4 && R.levels.turnsLate.length === 0,
    why: R.levels ? 'the map ' + R.levels.map + ' (' + R.levels.song + '), the fight played ' + R.levels.seen.join('/') + '; ' + R.levels.turns + ' turns, ' + R.levels.turnsHeard + ' heard as their level within 1.2 s' + (R.levels.turnsLate.length ? ', LATE ' + R.levels.turnsLate.join(' ') : '') : 'no reading' }),
  C: R => ({ ok: !!R.levels && R.levels.n2 >= 10 && R.levels.n3 >= 10 && R.levels.gap >= GAP_DB,
    why: R.levels ? 'through a phone: their turn ' + (R.levels.theirs == null ? '?' : R.levels.theirs.toFixed(1)) + ' dB, his ' + (R.levels.his == null ? '?' : R.levels.his.toFixed(1)) + ' dB: ' + R.levels.gap + ' dB (' + R.levels.n2 + ' and ' + R.levels.n3 + ' windows); the end of the chain, effects too, ' + R.levels.endGap + ' dB' : 'no reading' }),
  D: (R, tag) => {
    const B = R.beat; if (!B) return { ok: false, why: 'no reading' };
    /* on the quarter-speed CPU only what reached the shell in time is the clock's; elsewhere everything heard counts */
    const ok = B.heardAll >= 20 && B.heardAll >= B.booked * 0.4 && (R.slowCpu
      ? B.on16 >= B.heard * SHARE16 && B.blows >= 10 && B.onBeatBlows >= B.blows * SHARE
      : B.all16 >= B.heardAll * SHARE16 && B.allBlows >= 10 && B.allBlowsOnBeat >= B.allBlows * SHARE);
    return { ok, why: B.booked + ' fight sounds booked, ' + B.heardAll + ' heard off the audio: ' + B.all16 + ' within 25 ms of the song\'s sixteenth grid, blows ' + B.allBlowsOnBeat + ' of ' + B.allBlows + ' within 25 ms of a beat; '
      + B.cameLate + ' reached the shell after their moment (the page\'s thread' + (R.slowCpu ? ', a quarter-speed CPU: held on the ' + B.heard + ' in time, ' + B.on16 + ' within 20 ms, blows ' + B.onBeatBlows + ' of ' + B.blows + '; reported for PLUMBER' : '') + ')'
      + (B.blowsOffBeat.length ? '; off: ' + B.blowsOffBeat.slice(0, 3).join('; ') : '') + '; heard minus booked, the middle ' + B.medHeardMinusBooked + ' ms; the music\'s own beat ' + B.musicOffGrid + ' ms off the grid'
      + (B.reload && B.reload.n ? '; the reload apart: ' + B.reload.n + ' heard, its recording opens ' + B.reload.medLate + ' ms into its slot (owed to the guns\' recordings)' : '') };
  },
  E: R => {
    if (!R.pace) return { ok: false, why: 'no reading' };
    const P = R.pace, both = P.wasteMeanThem != null && (R.hand || P.wasteMeanYou != null);
    const even = both && (R.slowCpu || ((R.hand || Math.abs(P.wasteMeanYou - P.wasteMeanThem) <= 0.3) && P.hitches <= Math.max(1, P.pairs * 0.1)));
    return { ok: P.motions >= 20 && P.gridOdd === 0 && P.grids.length === 1 && Math.abs(P.grids[0] - P.songBeat) <= 2 && P.offGrid === 0 && even,
      why: P.motions + ' motions (' + JSON.stringify(P.sides) + '), the song\'s beat ' + P.songBeat + ' ms held (' + P.gridOdd + ' odd steps), the motions\' grids ' + P.grids.join('/') + ' ms, ' + P.offGrid + ' off it; beats waited that were not needed, ' + (R.hand ? '(his own by hand, and the first after his turn, are his thumb\'s) ' : 'his ' + JSON.stringify(P.wasteYou) + ' (mean ' + P.wasteMeanYou + '), ') + 'theirs ' + JSON.stringify(P.wasteThem) + ' (mean ' + P.wasteMeanThem + '), at a turn\'s change ' + JSON.stringify(P.handoff) + '; ' + P.hitches + ' of ' + P.pairs + ' with a beat lost' + (R.slowCpu ? ' (a quarter-speed CPU: a choice the thread did not make in time; reported, PLUMBER\'s)' : ' (at most 1 in 10)') + (P.hitchList.length ? ' (' + P.hitchList.slice(0, 3).join('; ') + ')' : '') };
  }
};
function legs(tag, R) {
  if (R.crash) { leg(false, tag + ': the fight plays through, heard', R.crash); return; }
  leg(T.A(R).ok, tag + ': *** A  MUSIC FROM THE FIRST FRAME TO THE END SCREEN *** (88)', T.A(R).why);
  leg(T.B(R).ok, tag + ': *** B  THE THREE LEVELS: THE MAP 1, THEIR TURN 2, HIS TURN 3, EVERY TURN HEARD *** (127)', T.B(R).why);
  leg(T.C(R).ok, tag + ': *** C  HIS TURN HITS HARDER, AT LEAST ' + GAP_DB + ' dB THROUGH A PHONE *** (127)', T.C(R).why);
  leg(T.D(R).ok, tag + ': *** D  EVERY ACTION ON THE BEAT, OFF THE AUDIO *** (47)', T.D(R).why);
  leg(T.E(R).ok, tag + ': *** E  ONE PACE FOR EVERY TURN *** (212)', T.E(R).why);
  /* KNOWN, WITH AN OWNER: the fight's drawing throws a drawImage TypeError on a quarter-speed CPU (a sheet let go while a frame
     still draws it: COMBAT's, ask 229 on records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md, rule 417(a)); counted and named,
     never this gate's red. Anything else that throws is. */
  const KNOWN = /Failed to execute 'drawImage' on 'CanvasRenderingContext2D'/, errs = R.errs || [], known = errs.filter(e => KNOWN.test(e)), other = errs.filter(e => !KNOWN.test(e));
  leg(!other.length, tag + ': nothing threw' + (known.length ? ' (and ' + known.length + ' known drawImage throw' + (known.length > 1 ? 's' : '') + ' in the fight\'s drawing: COMBAT\'s, ask 229)' : ''), other.slice(0, 3).join(' | '));
}

/* ---- the files: every song's gap, measured fresh off the mp3 ---------------------------------------------------------- */
function files() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'heard_files_')), rows = [], bad = [], kit = [];
  for (const idx of ['three_levels', 'new_four']) {
    const I = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', 'vote', 'songs', idx, 'index.json'), 'utf8'));
    for (const S of I.songs) {
      const dir = path.join(ROOT, 'slices', S.dir), lv = [1, 2, 3].map(l => path.join(dir, 'level_' + l + '.mp3'));
      if (!lv.every(f => fs.existsSync(f))) { bad.push(S.name + ': a level is missing'); continue; }
      const raws = lv.map((f, i) => { const r = path.join(tmp, path.basename(dir) + '_' + (i + 1) + '.raw'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '44100', r]); return r; });
      const m = JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools', 'bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
      const g = +(m[2].phone_rms_db - m[1].phone_rms_db).toFixed(1);
      rows.push(S.name.split(' ').slice(0, 2).join(' ') + ' ' + g);
      if (!(g >= GAP_DB)) bad.push(S.name + ' ' + g + ' dB');
      /* the full kit and the lead in level 3 only: what each level's own pass scheduled (measured.json, the render's count).
         His nine: the backbeat is the clap and the knock on 2 and 4, the lead is the hook in his song's own lead voice (s:<lead>).
         The four new: the backbeat is the snare, the lead is the tune doubled an octave (level 3's lead notes over level 1's). */
      const M = JSON.parse(fs.readFileSync(path.join(dir, 'measured.json'), 'utf8')), P = l => { const x = (M.levels.find(y => y.level === l) || {}); return x.parts_added || x.parts || {}; };
      const isNew = idx === 'new_four', lead = (M.his_voices || {}).lead;
      const back = c => isNew ? (c.snare || 0) : (c['d:clap'] || 0) + (c['d:knock'] || 0) + (c['d:snare'] || 0);
      const hook = (c, c1) => isNew ? Math.max(0, (c.lead || 0) - (c1.lead || 0)) : (c['s:' + lead] || 0);
      const p1 = P(1), p2 = P(2), p3 = P(3);
      const ok3 = back(p3) > 0 && hook(p3, p1) > 0, ok2 = back(p2) === 0 && hook(p2, p1) === 0;
      if (!(ok3 && ok2)) kit.push(S.name + ' (3: ' + JSON.stringify(p3).slice(0, 80) + '; 2: ' + JSON.stringify(p2).slice(0, 80) + ')');
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  leg(rows.length === 13 && bad.length === 0, '*** THE FILES: HIS TURN AT LEAST ' + GAP_DB + ' dB OVER THEIRS IN ALL THIRTEEN SONGS, THROUGH A PHONE *** (127)', rows.join(', ') + (bad.length ? ' | SHORT: ' + bad.join('; ') : ''));
  leg(rows.length === 13 && kit.length === 0, '*** THE FILES: THE FULL KIT AND THE LEAD IN LEVEL 3 ONLY *** (127, as the coordinator corrected 207(b): the tune in all three)', kit.length ? kit.slice(0, 3).join(' | ') : 'the backbeat and the hook scheduled in 3, neither in 2, in all ' + rows.length);
}

(async () => {
  if (!REST) files();
  const PHONE = ['PHONE, AUTO', { profile: 'phone_portrait', throttle: 1, hand: false, seed: 7 }],
    SLOW = ['PHONE AT A QUARTER OF ITS CPU, AUTO', { profile: 'phone_portrait', throttle: 4, hand: false, seed: 7 }],
    HAND = ['COMPUTER, BY HAND', { profile: 'computer', throttle: 1, hand: true, seed: 13 }];
  const runs = FAST ? [PHONE] : REST ? [SLOW, HAND] : [PHONE, SLOW, HAND];
  for (const [tag, o] of runs) {
    console.log('-- ' + tag);
    const R = H.read(await H.listen(Object.assign({ log: s => console.log(s) }, o))); R.slowCpu = o.throttle > 1;
    legs(tag, R);
  }
  if (!NOPLANT) {
    console.log('-- THE PLANT: his turn at level 2, every effect 90 ms off its beat, their turns at double pace, two seconds of no music');
    const R = H.read(await H.listen({ profile: 'computer', throttle: 1, hand: false, seed: 7, plant: ['gap', 'off', 'pace', 'silent'], log: s => console.log(s) }));
    const caught = ['A', 'C', 'D', 'E'].map(k => [k, !R.crash && !T[k](R).ok, T[k](R).why]);
    caught.forEach(([k, c, why]) => leg(c, '*** THE PLANT IS CAUGHT BY LEG ' + k + ' ***', why));
  }
  console.log('THE FIGHT AS HE HEARS IT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
