#!/usr/bin/env node
/* THE SONGS GO IN, AND HIS TURN HITS HARD (SOUNDS, 10/25/26, row [the songs go in, his turn hits hard], rule 207; with
   [the sound never chops], rule 175).

   PAOLO 10/25: 'I like the songs, I want you to implement them; there has to be a pretty big difference between the
   opponent's turn and my turn... it can't just be one quiet thing that's the difference between their turn and your turn.'
   MEASURED ON THE FIRST CARDS: their turn to his turn 1.2 to 3.0 dB through a phone.

   LEGS
   THE FILES, every one of the thirteen (his nine, slices/vote/songs/three_levels/; the four new, new_four/), each mp3 decoded
   and measured fresh (two 350 Hz high-passes, tools/bohemia_sounds_his_machine_measure.py, a phone's speaker):
     1  L2 - L1 >= 3 dB and L3 - L2 >= 6 dB through a phone (207(b),(f))
     2  NOTHING CLIPPED: no decoded sample at full scale, and none clipped before the encoder
     3  THE FULL KIT AND THE DRIVE ONLY IN 3, THE TUNE IN ALL THREE (207(b) as corrected 10/25, rule 205 sweep): level 3
        carries the backbeat and the combat hook (his hook in his lead voice, or the new song's tune doubled); level 2 carries
        neither; the tune (his engine's own lead notes, or the new song's melody) plays at every level
     4  the files are the files measured (md5), the hit is there, each level is the song's whole pass
   THE GAME CARRIES IT (the alpha and the demo):
     5  the block is in both, its book names the thirteen and each song's files as they are now (a stale book fails)
   THE LIVE DEMO, on the phone profile with the CPU four times slower and on the computer profile (unless --files-only):
     6  THE MAP PLAYS 1: on the map the song sounds from its recording at level 1
     7  THE TURN IS HEARD ON THE BEAT: after each turn the fight posts, the level changes to 2 (theirs) or 3 (his) on a
        beat of the song (a step that is a multiple of four) within a beat and the transport's one-beat horizon (1.2 s);
        a turn passed on before its beat came is superseded, not missed
     8  A HIT INTO 3: every change into level 3 strikes the hit on that beat
     9  THEIR TURN TO HIS TURN IS BIG IN THE GAME: the music, after his slider and the fight's lift, measured through a phone's
        speaker in the 100 ms windows of their turns and of his turns (the first 0.3 s after a change left out): his turn at
        least 6 dB over theirs (the end of the chain, effects and all, reported)
     10 IT NEVER CHOPS (175): the song never jumps (no resync), and the music is never silent, on the map (twelve seconds
        before the fight) and in the fight; and THE BEAT ON THE GRID: every decoded level's onsets, folded on the beat from
        where the player puts step 0, peak within 15 ms of it
     11 BACK TO 1: after the fight the map plays 1 again
   RULE 221(a) (Paolo 10/26: 'when does the music get implemented in the combat?'), --now: THE MUSIC IN THE FIGHT NOW, the
   game legs on the renders there are, before the bigger-gap re-renders: the thirteen in the book (6, 7, 10, 11, and
     12 A SONG FROM THE FIGHT'S FIRST FRAME: the music is never silent from the moment the fight's frame is in the page);
   the files' gap and the hit (1 to 4, 8, 9) are read and printed, never counted, until the re-renders land.
   node gates/the_songs_go_in_gate.js [--now] [--files-only|--computer-only|--phone-only] */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const SL = path.join(ROOT, 'slices');
let pass = 0, fail = 0;
const NOW = process.argv.includes('--now');
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
/* --now: a leg the re-renders deliver, read and printed, never counted (rule 221(a)) */
const later = (ok, what, why) => NOW ? console.log((ok ? '  ok   ' : '  later ') + what + (why !== undefined ? '  [' + why + ']' : '')) : leg(ok, what, why);
const md5 = b => crypto.createHash('md5').update(b).digest('hex');
const db = x => x > 0 ? 20 * Math.log10(x) : -120;
const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : -120; };

/* ---- THE FILES ------------------------------------------------------------------------------------------------------- */
function songList() {
  const out = [];
  for (const idx of ['three_levels', 'new_four']) for (const S of JSON.parse(fs.readFileSync(path.join(SL, 'vote', 'songs', idx, 'index.json'), 'utf8')).songs) {
    const lv = [1, 2, 3].map(l => path.join(SL, S.dir, 'level_' + l + '.mp3'));
    if (lv.every(f => fs.existsSync(f))) out.push({ name: S.name, dir: S.dir });
  }
  leg(out.length === 13, 'THE THIRTEEN: his nine and the four new songs, three levels each, on disk', out.length + ' songs');
  return out;
}
function files() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'songs_go_in_'));
  const songs = [];
  for (const idx of ['three_levels', 'new_four']) {
    const I = JSON.parse(fs.readFileSync(path.join(SL, 'vote', 'songs', idx, 'index.json'), 'utf8'));
    for (const S of I.songs) {
      const dir = path.join(SL, S.dir), M = JSON.parse(fs.readFileSync(path.join(dir, 'measured.json'), 'utf8'));
      const his = idx === 'three_levels';
      const lv = M.levels.map(l => path.join(ROOT, l.file));
      const there = lv.every(f => fs.existsSync(f)) && !!M.hit && fs.existsSync(path.join(ROOT, M.hit.file));
      leg(there && M.levels.every((l, i) => md5(fs.readFileSync(lv[i])) === l.mp3_md5) && md5(fs.readFileSync(path.join(ROOT, M.hit.file))) === M.hit.mp3_md5,
        S.name + ': the three levels and the hit are the files measured', there ? 'md5 checked' : 'a file is missing');
      if (!there) continue;
      const raws = lv.map((f, i) => { const r = path.join(tmp, S.slug + '_' + (i + 1) + '.raw'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '44100', r]); return r; });
      const m = JSON.parse(execFileSync('python3', ['-I', path.join(ROOT, 'tools', 'bohemia_sounds_his_machine_measure.py')].concat(raws), { encoding: 'utf8', maxBuffer: 64 << 20 }));
      const [a, b, c] = m.map(x => x.phone_rms_db);
      leg(b - a >= 3 && c - b >= 6, S.name + ': *** HIS TURN HITS HARD *** through a phone, L2 - L1 >= 3 dB and L3 - L2 >= 6 dB',
        'L1 ' + a + ', L2 ' + b + ', L3 ' + c + ' dB: L2-L1 ' + (b - a).toFixed(2) + ', L3-L2 ' + (c - b).toFixed(2) + '; full band ' + m.map(x => x.rms_db).join('/'));
      const fullScale = m.filter(x => x.peak >= 0.9999).length, pre = M.levels.reduce((s, l) => s + (l.clipped_samples || 0), 0);
      leg(fullScale === 0 && pre === 0, S.name + ': *** NOTHING CLIPPED ***', 'decoded peaks ' + m.map(x => x.peak_db).join('/') + ' dBFS, ' + pre + ' clipped before the encoder');
      const P = M.levels.map(l => l.parts_added || l.parts || {});
      let ok3, why3;
      if (his) {
        const lead = M.his_voices.lead;
        const back = k => (k['d:clap'] || 0) + (k['d:knock'] || 0), hook = k => (k['s:' + lead] || 0), tune = k => (k['e:s:' + lead] || 0);
        ok3 = back(P[2]) >= 64 && hook(P[2]) >= 128 && back(P[1]) === 0 && hook(P[1]) === 0 && !P[1]['d:tight'] && back(P[0]) === 0
          && !Object.keys(P[1]).some(k => /^held:/.test(k)) && tune(P[0]) > 0 && tune(P[1]) >= tune(P[0]) && tune(P[2]) >= tune(P[0]);
        why3 = 'backbeat ' + back(P[0]) + '/' + back(P[1]) + '/' + back(P[2]) + ', his lead ' + lead + ' as the hook ' + hook(P[0]) + '/' + hook(P[1]) + '/' + hook(P[2]) + ', his tune (his own ' + lead + ' notes) ' + tune(P[0]) + '/' + tune(P[1]) + '/' + tune(P[2]);
      } else {
        ok3 = (P[2].snare || 0) > 0 && (P[2].lead || 0) > (P[1].lead || 0) && !P[1].snare && (P[0].lead || 0) > 0 && (P[1].lead || 0) >= (P[0].lead || 0) && (P[1].held || 0) > 0 && !P[0].snare;
        why3 = 'snare ' + (P[0].snare || 0) + '/' + (P[1].snare || 0) + '/' + (P[2].snare || 0) + ', the tune ' + (P[0].lead || 0) + '/' + (P[1].lead || 0) + '/' + (P[2].lead || 0) + ' (in all three, doubled on 3), held chords on 2: ' + (P[1].held || 0);
      }
      leg(ok3, S.name + ': *** THE FULL KIT AND THE DRIVE ONLY IN LEVEL 3, THE TUNE IN ALL THREE ***, level 2 is the tune with tension (no backbeat, no hook)', why3);
      const want = (M.steps || M.bars * 16) * 0.125;
      leg(m.every(x => x.seconds >= want && x.seconds <= want + 4), S.name + ': every level is the song\'s whole pass', want + ' s of song; files ' + m.map(x => x.seconds).join('/') + ' s');
      songs.push({ name: S.name, dir: S.dir });
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  leg(songs.length === 13, 'THE THIRTEEN: his nine and the four new songs all measured', songs.length + ' songs');
  return songs;
}

/* ---- THE GAME CARRIES IT -------------------------------------------------------------------------------------------- */
function shells(songs) {
  for (const f of ['BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_DEMO.html']) {
    const s = fs.readFileSync(path.join(SL, f), 'utf8');
    const m = s.match(/\/\*BOOK\*\/(\{.*?\})\/\*\/BOOK\*\//);
    let B = null; try { B = m && JSON.parse(m[1]); } catch (e) { B = null; }
    const stale = [];
    if (B) for (const S of songs) {
      const e = B.songs[S.name]; if (!e) { stale.push(S.name + ' missing'); continue; }
      const h = crypto.createHash('md5'); ['level_1', 'level_2', 'level_3'].concat(e.hit === false ? [] : ['hit']).forEach(x => h.update(fs.readFileSync(path.join(SL, S.dir, x + '.mp3'))));
      if (e.v !== h.digest('hex').slice(0, 8) || e.dir !== S.dir) stale.push(S.name);
    }
    leg(!!B && Object.keys(B.songs).length === 13 && !stale.length && s.includes('<!-- /__THE_SONGS_GO_IN__ -->'),
      f + ': *** THE SONGS ARE IN THE GAME ***, the block and its book of thirteen, each song\'s files as they are now',
      B ? Object.keys(B.songs).length + ' songs' + (stale.length ? '; stale: ' + stale.join(', ') : '') : 'no book');
  }
}

/* ---- THE LIVE DEMO -------------------------------------------------------------------------------------------------- */
const ARM = `(function(){
  if (/BOHEMIA_FIGHT/.test(location.href)) { let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } });
    return; }
})();`;
async function live(profile, throttle) {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  console.log('-- ' + profile + (throttle > 1 ? ', CPU ' + throttle + 'x slower' : ''));
  let d;
  try { d = await drive.open({ keepCards: true, profile, throttle, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, profile + ': the demo boots', String(e.message).slice(0, 160)); return; }
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running', null, { timeout: 90000 });
    /* SONG=<name>: a development run on one song (the gate itself never sets it) */
    if (process.env.SONG) await p.evaluate(n => { const i = MLOOPS.findIndex(x => x.n === n); if (i >= 0) { MUS.cur = MFACTIONS.length + i; MUS.curSlot = 1; MUS.step = 0; MUS.nextT = __beatNext(MUS.AC.currentTime + 0.06); } }, process.env.SONG);
    /* RULE 237 (10/26, newest date wins): on a faction's ground the map plays that faction's song, live from his engine (no
       recording yet, rule 237(e)); the thirteen's recordings play on the open road. So the party is set down on the open road
       first (the map's own owner of every cell), and the map's legs below read the thirteen there, as they always did. */
    const road = await d.fr.evaluate(() => { if (typeof turfAt !== 'function') return null; const own = (x, y) => !!turfAt(x, y);
      for (let x = 6; x < 110; x += 2) for (let y = 6; y < 110; y += 2) { let ok = true; for (let dx = -2; dx <= 2 && ok; dx++) for (let dy = -2; dy <= 2; dy++) if (own(x + dx, y + dy)) { ok = false; break; }
        if (ok) { city.x = x; city.y = y; try { __ctWhere(); } catch (e) {} return [x, y]; } }
      return null; }).catch(() => null);
    if (road) await p.waitForFunction(() => !window.PARTOFTOWN || (PARTOFTOWN.faction === null && PARTOFTOWN.now() === null), null, { timeout: 30000 }).catch(() => {});
    await p.waitForFunction(() => window.SONGBOOK && SONGBOOK.state().playing, null, { timeout: 60000 }).catch(() => {});
    await p.waitForTimeout(1500);
    const map0 = await p.evaluate(() => SONGBOOK.state());
    leg(map0.playing && map0.level === 1 && !map0.fighting, profile + ': *** THE MAP PLAYS 1 ***, from its recording', JSON.stringify(map0).slice(0, 300));
    await p.evaluate(() => {
      const L = window.__G = { win: [], turns: [], live: false, over: false };
      const ac = MUS.AC, sr = ac.sampleRate, W = Math.round(sr * 0.1);
      const ear = (src, key, phone) => { if (!src) return; let n0 = src;
        if (phone) { const h1 = ac.createBiquadFilter(), h2 = ac.createBiquadFilter(); [h1, h2].forEach(h => { h.type = 'highpass'; h.frequency.value = 350; h.Q.value = Math.SQRT1_2; }); src.connect(h1); h1.connect(h2); n0 = h2; }
        const sp = ac.createScriptProcessor(4096, 1, 1), z = ac.createGain(); z.gain.value = 0; n0.connect(sp); sp.connect(z); z.connect(ac.destination);
        let acc = 0, n = 0;
        sp.onaudioprocess = ev => { const a = ev.inputBuffer.getChannelData(0);
          for (let i = 0; i < a.length; i++) { acc += a[i] * a[i]; n++; if (n === W) { L.win.push([key, +(ev.playbackTime + i / sr).toFixed(2), Math.sqrt(acc / n), L.live ? (L.over ? 2 : 1) : 0]); acc = 0; n = 0; } } }; };
      const mus = window.__FIGHTLIFT || window.__MUSVOL;
      ear(mus, 'm', false); ear(mus, 'mp', true); ear(window.__LIMITER, 'op', true);
      /* the fight's first frame: the moment its frame is in the page */
      new MutationObserver(() => { if (L.f0 == null && document.getElementById('fightFrame')) L.f0 = ac.currentTime; }).observe(document.body, { childList: true, subtree: true });
      addEventListener('message', ev => { const m = ev.data; if (!m || !m.type) return; const f = document.getElementById('fightFrame'); if (!f || ev.source !== f.contentWindow) return;
        if (m.type === 'BOHEMIA_COMBAT_STARTED') { L.live = true; L.t0 = ac.currentTime; }
        if (m.type === 'BOHEMIA_FIGHT_TURN') L.turns.push([m.side, +ac.currentTime.toFixed(3)]);
        if (m.type === 'BOHEMIA_FIGHT_OVER') { L.over = true; L.t1 = ac.currentTime; } });
    });
    /* the map, twelve seconds, before the fight: never silent, never a jump (175(d): the map and the fight) */
    await p.waitForTimeout(12000);
    const mapR = await p.evaluate(() => ({ w: window.__G.win.filter(w => w[0] === 'm' && w[3] === 0).map(w => w[2]), st: SONGBOOK.state(), resync: SONGBOOK.resync }));
    const mapSilent = mapR.w.filter(x => db(x) < -60).length;
    leg(mapR.w.length >= 60 && mapSilent === 0 && mapR.resync === 0 && mapR.st.level === 1, profile + ': *** THE MAP NEVER CHOPS ***, twelve seconds of the map at level 1, never silent, never a jump',
      mapR.w.length + ' windows, ' + mapSilent + ' silent, ' + mapR.resync + ' jumps; ' + mapR.st.song + ' at level ' + mapR.st.level);
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 400 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    await f.evaluate(() => { FIGHT_UI.auto = true; });
    let over = false, phase = null;
    for (let i = 0; i < 700 && !over; i++) { over = await p.evaluate(() => window.__G.over); if (!over) await p.waitForTimeout(500);
      /* the beat off the decoded levels, read in the fight while the fight's levels are held */
      if (i === 24 || (i > 24 && !phase)) phase = await p.evaluate(() => { const out = {}; for (const n in SONGBOOK.sets) for (const l of [1, 2, 3]) { const r = SONGBOOK.beatPhase(n, l); if (r) out[n + ' ' + l] = r; } return Object.keys(out).length ? out : null; }); }
    if (!over) throw new Error('the fight never ended inside six minutes');
    await p.waitForTimeout(9000);
    const R = await p.evaluate(() => ({ G: window.__G, sw: SONGBOOK.switches.slice(), st: SONGBOOK.state(), hits: SONGBOOK.hits, resync: SONGBOOK.resync }));
    R.phase = phase || {};
    const G = R.G, SW = R.sw.filter(s => s.t != null);
    /* 7: the turn on the beat */
    const tgt = side => side === 'them' ? 2 : 3;
    let heard = 0, superseded = 0, missed = [], worst = 0;
    G.turns.forEach(([side, tm], i) => {
      const nx = G.turns[i + 1] ? G.turns[i + 1][1] : Infinity;
      const before = SW.filter(s => s.t <= tm).pop(), was = before ? before.lv : 0;
      const sw = SW.find(s => s.t >= tm - 0.02 && s.lv === tgt(side));
      if (was === tgt(side) && !SW.some(s => s.t > tm && s.t < Math.min(nx, tm + 1.2) && s.lv !== tgt(side))) { heard++; return; }
      if (sw && sw.t - tm <= 1.2 && sw.beat) { heard++; worst = Math.max(worst, sw.t - tm); return; }
      if (nx - tm < 1.2) { superseded++; return; }
      missed.push(side + '@' + tm + (sw ? ' (came ' + (sw.t - tm).toFixed(2) + ' s later' + (sw.beat ? '' : ', off the beat') + ')' : ''));
    });
    leg(G.turns.length >= 4 && missed.length === 0, profile + ': *** THE TURN IS HEARD ON THE BEAT ***, their turn 2, his turn 3, on a beat within 1.2 s',
      G.turns.length + ' turns: ' + heard + ' heard (the slowest ' + worst.toFixed(2) + ' s), ' + superseded + ' passed on before their beat' + (missed.length ? '; MISSED ' + missed.slice(0, 4).join(', ') : ''));
    /* 8: the hit */
    const into3 = SW.filter(s => s.from != null && s.from !== 3 && s.lv === 3), hit = into3.filter(s => /^hit/.test(s.why));
    later(into3.length >= 1 && hit.length === into3.length && R.hits >= into3.length, profile + ': *** A HIT INTO 3 ***', into3.length + ' changes into 3, ' + hit.length + ' struck the hit (' + R.hits + ' hits)');
    /* 9: the gap in the game */
    const lvAt = t => { const b = SW.filter(s => s.t <= t).pop(); return b && (t - b.t) > 0.3 ? b.lv : 0; };
    const fightW = k => G.win.filter(w => w[0] === k && w[3] === 1);
    const by = (k, l) => fightW(k).filter(w => lvAt(w[1]) === l).map(w => db(w[2]));
    const t2 = med(by('mp', 2)), t3 = med(by('mp', 3)), o2 = med(by('op', 2)), o3 = med(by('op', 3)), f2 = med(by('m', 2)), f3 = med(by('m', 3));
    later(by('mp', 2).length >= 10 && by('mp', 3).length >= 10 && t3 - t2 >= 6, profile + ': *** THEIR TURN TO HIS TURN IS BIG IN THE GAME ***, the music through a phone\'s speaker, his turn >= 6 dB over theirs',
      'music (phone band) their turn ' + t2.toFixed(1) + ', his turn ' + t3.toFixed(1) + ' dB: ' + (t3 - t2).toFixed(1) + ' dB; full band ' + (f3 - f2).toFixed(1) + ' dB; the end of the chain (effects too) ' + (o3 - o2).toFixed(1) + ' dB');
    /* 12: a song from the fight's first frame (rule 221(a), 168(b)): from the frame in the page to the board up and 3 s on */
    const first = G.f0 == null ? [] : G.win.filter(w => w[0] === 'm' && w[1] >= G.f0 && w[1] <= (G.t0 || G.f0) + 3);
    const firstSilent = first.filter(w => db(w[2]) < -60).length;
    leg(G.f0 != null && first.length >= 20 && firstSilent === 0, profile + ': *** A SONG FROM THE FIGHT\'S FIRST FRAME ***, never silent from the frame in the page to 3 s after the board',
      first.length + ' windows from the frame (' + (G.t0 && G.f0 != null ? (G.t0 - G.f0).toFixed(1) + ' s to the board' : 'no board time') + '), ' + firstSilent + ' silent; the quietest ' + (first.length ? Math.min.apply(null, first.map(w => db(w[2]))).toFixed(1) : '?') + ' dB');
    /* 10: never chops */
    const fm = fightW('m'), silent = fm.filter(w => db(w[2]) < -60).length;
    leg(R.resync === 0 && fm.length >= 50 && silent === 0, profile + ': *** IT NEVER CHOPS ***, the song never jumps and is never silent in the fight', R.resync + ' jumps, ' + silent + ' silent windows of ' + fm.length);
    /* 10b: the beat on the fight's grid, off the decoded recordings themselves */
    const ph = Object.keys(R.phase).map(k => [k, R.phase[k]]);
    leg(ph.length >= 1 && ph.every(([, r]) => Math.abs(r.ms_off_the_grid) <= 15), profile + ': *** THE BEAT ON THE GRID ***, every decoded level\'s beat (folded on the eighth) within 15 ms of the transport\'s',
      ph.map(([k, r]) => k + ' ' + r.ms_off_the_grid + ' ms (rise ' + r.rise + ')').join('; ') + '; decoder delay ' + (ph[0] ? ph[0][1].delay_ms : '?') + ' ms at ' + (ph[0] ? ph[0][1].rate : '?') + ' Hz');
    /* 11: back to 1 */
    leg(R.st.playing && R.st.level === 1 && !R.st.fighting, profile + ': *** BACK TO 1 *** after the fight', JSON.stringify(R.st).slice(0, 240));
  } catch (e) { leg(false, profile + ': the fight plays through', String(e.message).slice(0, 200)); }
  await d.close();
}

(async () => {
  const a = process.argv.slice(2);
  const songs = NOW ? songList() : files();
  shells(songs);
  if (!a.includes('--files-only')) {
    if (!a.includes('--computer-only')) await live('phone_portrait', 4);
    if (!a.includes('--phone-only')) await live('computer', 1);
  }
  console.log((NOW ? 'THE MUSIC IN THE FIGHT NOW: ' : 'THE SONGS GO IN: ') + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
