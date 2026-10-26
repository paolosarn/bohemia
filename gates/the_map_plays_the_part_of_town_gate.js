#!/usr/bin/env node
/* THE MAP PLAYS THE PART OF TOWN YOU ARE IN (SOUNDS, 10/26/26, row [the map plays the part of town you are in], rule 237(f)).

   PAOLO 10/26: 'each one's gonna get its own song... I already have faction music, so just put those in for now... maybe the music
   should change depending on what part of town you're closest to on the overworld map, that's the whole point of this vibe...
   depending on the tiles you're walking on the sound changes, super important to me.'
   237(f): three districts each play their song within a phrase, on the beat; the road an overworld song; three origins' intros their
   songs; no menu, day or room song.
   LEGS
     1  THE GAME CARRIES IT: the alpha and the demo carry engine/bohemia_part_of_town.js byte for byte and install it
     2  EVERY ORIGIN ITS SONG: the fifteen origins of records/target/bb/origins.json each name a faction song the game has; THE
        FAITHFUL the CHURCH's and THE WATER TRUCK the CARAVANS' (his words)
   on the demo, the phone profile (CPU 4x slower) and the computer:
     3  THREE ORIGINS: the call the opening tape makes (__originSong) for the game's own origin, THE FAITHFUL and THE WATER TRUCK
        plays each one's song at once, the tape's end hands the music back to the map; the boot's own tape is read when it played
     4  THREE DISTRICTS: the party set down inside three factions' ground (the map's own report, every four seconds): each plays
        its faction's song within one phrase (16 s) of the report, the turn in the last beat before a phrase line and the new
        song's first step booked on the song's beat (within 5 ms of the one grid); the music heard (not silent) after the turn
     5  THE OPEN ROAD: a cell with nobody's ground within two cells plays one of his overworld songs within a phrase
     6  A CLOSING THREAT RAISES IT: a crew out to take something within three cells lifts the map to level 2 (the arrangement
        at the top of a bar); gone, back to 1
     7  A FIGHT GIVES IT BACK: a faction song playing when a fight comes up gives way to one of his overworld songs (207's levels)
     8  NO MENU, DAY OR ROOM SONG: every song heard on the whole run is his overworld set or a faction song; through the fence,
        every song tagged only MENU, OVERWORLD DAY or OVERWORLD DUSK/DAWN and every old faction theme is refused
     9  nothing threw
   node gates/the_map_plays_the_part_of_town_gate.js [--computer-only|--phone-only] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SL = path.join(ROOT, 'slices');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const PHRASE_S = 16.5;

const ENGINE = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_part_of_town.js'), 'utf8').trimEnd();
for (const f of ['BOHEMIA_ALPHA_0_9.html', 'BOHEMIA_DEMO.html']) {
  const s = fs.readFileSync(path.join(SL, f), 'utf8');
  leg(s.includes(ENGINE) && s.includes('<!-- /__THE_PART_OF_TOWN__ -->') && s.includes('BOH_PART_OF_TOWN.install(window)'),
    f + ': *** THE PART OF TOWN IS IN THE GAME ***, the engine byte for byte and installed over the music');
}
global.window = undefined;
require(path.join(ROOT, 'engine', 'bohemia_part_of_town.js'));
const POT = globalThis.BOH_PART_OF_TOWN;
{
  const ids = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'bb', 'origins.json'), 'utf8')).origins.map(o => o.id);
  const miss = ids.filter(i => !POT.ORIGIN_SONG[i] || POT.FACTIONS.indexOf(POT.ORIGIN_SONG[i]) < 0);
  const used = new Set(Object.values(POT.ORIGIN_SONG));
  leg(ids.length === 15 && !miss.length && POT.ORIGIN_SONG.faith === 'CHURCH' && POT.ORIGIN_SONG.truck === 'CARAVANS',
    '*** EVERY ORIGIN ITS SONG ***: the fifteen origins each a faction song (THE FAITHFUL the CHURCH\'s, THE WATER TRUCK the CARAVANS\', his words)',
    ids.map(i => i + ' ' + POT.ORIGIN_SONG[i]).join(', ') + '; ' + used.size + ' of 13 faction songs used' + (miss.length ? '; MISSING ' + miss.join(',') : ''));
}

const ST = () => {
  const T = PARTOFTOWN; return { reports: T.reports, at: T.at, faction: T.faction, want: T.want(), now: T.now(), cur: SONGFENCE.now(), step: MUS.step,
    pendAt: T.pendAt, turns: T.turns.length, last: T.turns[T.turns.length - 1] || null, errs: T.errs.slice(-3), lvl: INTENSITY.level(), layers: MUS.layers };
};
const EAR = `(function(){ if (window.__POT_EAR) return; const src = window.__MUSVOL || window.__FIGHTLIFT || (MUS && MUS.MAST); const a = MUS.AC.createAnalyser(); a.fftSize = 2048;
  try { src.connect(a); } catch (e) {} const buf = new Float32Array(a.fftSize);
  window.__POT_EAR = { rms: function () { a.getFloatTimeDomainData(buf); let s = 0; for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i]; return Math.sqrt(s / buf.length); } }; })()`;

async function live(profile, throttle) {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  console.log('-- ' + profile + (throttle > 1 ? ', CPU ' + throttle + 'x slower' : ''));
  let d; const errs = [];
  try { d = await drive.open({ keepCards: true, profile, throttle, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, profile + ': the demo boots', String(e.message).slice(0, 160)); return; }
  const p = d.page; p.on('pageerror', e => errs.push(String(e)));
  const heard = new Set();
  let sampler = null;
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && window.PARTOFTOWN && PARTOFTOWN.reports > 0 && window.__beatNext, null, { timeout: 120000 });
    sampler = setInterval(() => { p.evaluate(() => SONGFENCE.now()).then(n => { if (n) heard.add(n); }).catch(() => {}); }, 700);
    await p.evaluate(EAR);
    const FSET = await p.evaluate(() => MUS.lib().map((f, i) => PARTOFTOWN.factionOfSong(i, 1) ? f.n : null).filter(Boolean));
    const SET = await p.evaluate(() => SONGFENCE.names());
    const songsOf = async cat => p.evaluate(c => PARTOFTOWN.songsOf(c).map(x => MUS.lib()[x.fi].n), cat);

    /* 3 the tape: when this boot's new game played its squad up close, the tape's own call is read; and three origins through
       that same call (the game's own, THE FAITHFUL, THE WATER TRUCK) each play their song at once and give the music back after */
    await p.waitForFunction(() => PARTOFTOWN.log.some(l => l.tape === 'intro') && PARTOFTOWN.log.some(l => l.tape && l.tape !== 'intro'), null, { timeout: 30000 }).catch(() => {});
    const tape = await p.evaluate(() => ({ origin: PARTOFTOWN.origin, turns: PARTOFTOWN.turns.filter(t => t.turn === 'the tape') }));
    const realTape = tape.turns.length ? tape.turns[0].to : null;
    const origins = [];
    for (const o of [tape.origin || 'newcrew', 'faith', 'truck']) {
      const r = await p.evaluate(async o => { __originSong(o, 'intro'); await new Promise(r => setTimeout(r, 900)); const n = SONGFENCE.now(), w = PARTOFTOWN.want();
        __originSong(o, 'done'); return { o, now: n, want: w, after: PARTOFTOWN.tape }; }, o);
      r.ok = (await songsOf(POT.ORIGIN_SONG[o])).indexOf(r.now) >= 0 && r.after === null; origins.push(r);
    }
    const realOk = !realTape || (await songsOf(POT.ORIGIN_SONG[tape.origin])).indexOf(realTape) >= 0;
    leg(origins.every(r => r.ok) && realOk, profile + ': *** THREE ORIGINS, THREE INTRO SONGS *** (the call the opening tape makes), and the music handed back after',
      origins.map(r => r.o + ' -> ' + r.now + ' (' + r.want + ')').join('; ') + '; this boot\'s own tape: ' + (realTape ? tape.origin + ' -> ' + realTape : 'did not play on this boot'));

    /* the ground: three factions' and the open road, from the map's own owner of every cell */
    const spots = await d.fr.evaluate(() => { const want = {}; let open = null; const own = (x, y) => { const t = turfAt(x, y); return t ? String(t.faction).toUpperCase() : null; };
      for (let x = 6; x < 110; x += 2) for (let y = 6; y < 110; y += 2) { const f = own(x, y);
        if (!f) { let ok = true; for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) if (own(x + dx, y + dy)) ok = false; if (ok && !open) open = [x, y]; continue; }
        if (!want[f]) { let ok = true; for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) if (own(x + dx, y + dy) !== f) ok = false; if (ok) want[f] = [x, y]; } }
      return { want, open }; });
    const here = await p.evaluate(() => PARTOFTOWN.faction);
    const three = ['MOB', 'CHURCH', 'CARTEL', 'REDS', 'NETWORK', 'ANARCHISTS'].filter(f => spots.want[f] && f !== here).slice(0, 3);
    const moves = [];
    const goTo = async (xy) => { await d.fr.evaluate(s => { city.x = s[0]; city.y = s[1]; __ctWhere(); }, xy); };
    for (const f of three) {
      const n0 = await p.evaluate(() => PARTOFTOWN.turns.length);
      await goTo(spots.want[f]); const t0 = Date.now();
      await p.waitForFunction(fx => PARTOFTOWN.now() === fx, f, { timeout: (PHRASE_S + 8) * 1000 }).catch(() => {});
      const secs = (Date.now() - t0) / 1000;
      await p.waitForTimeout(2500);
      const r = await p.evaluate(async n0 => { const t = PARTOFTOWN.turns.slice(n0); const last = t[t.length - 1] || null;
        const g = last && last.nextT != null ? BOHEMIA_BEAT.grid(last.nextT - 0.0005) : null;
        return { now: PARTOFTOWN.now(), cur: SONGFENCE.now(), turn: last, onBeat: last && g != null ? Math.abs(g - last.nextT) * 1000 : null, rms: __POT_EAR.rms() }; }, n0);
      r.f = f; r.secs = secs; r.lineOk = !!(r.turn && r.turn.oldStep != null && (r.turn.oldStep % 128 >= 125 || r.turn.oldStep % 128 === 0)); moves.push(r);
    }
    const good = moves.filter(m => m.now === m.f && m.secs <= PHRASE_S + 4.5 && m.lineOk && m.onBeat != null && m.onBeat <= 5 && m.rms > 1e-4);
    leg(moves.length === 3 && good.length === 3, profile + ': *** THREE DISTRICTS, EACH ITS SONG ***, within a phrase of the report, the turn at a phrase line on the beat, heard',
      moves.map(m => m.f + ': ' + m.cur + ' in ' + m.secs.toFixed(1) + ' s, the old song at step ' + (m.turn ? m.turn.oldStep : '?') + ', ' + (m.onBeat == null ? '?' : m.onBeat.toFixed(1)) + ' ms off the beat, rms ' + m.rms.toFixed(4)).join('; '));

    /* 5 the open road */
    let road = null;
    if (spots.open) {
      await goTo(spots.open); const t0 = Date.now();
      await p.waitForFunction(() => PARTOFTOWN.now() === null && PARTOFTOWN.faction === null, null, { timeout: (PHRASE_S + 8) * 1000 }).catch(() => {});
      road = { secs: (Date.now() - t0) / 1000, cur: await p.evaluate(() => SONGFENCE.now()), at: spots.open };
    }
    leg(!!road && SET.indexOf(road.cur) >= 0 && road.secs <= PHRASE_S + 4.5, profile + ': *** THE OPEN ROAD PLAYS HIS OVERWORLD SONGS ***',
      road ? 'at ' + road.at + ': ' + road.cur + ' in ' + road.secs.toFixed(1) + ' s' : 'no open cell found');

    /* 6 a closing threat (the map's own parties, one crew set down beside him) */
    const th = await d.fr.evaluate(async () => {
      const pn = window.partiesNear;
      window.partiesNear = function (r) { return [{ party: { agenda: 'crew', about: 'going to take something', from: { faction: 'Cartel' } } }].concat(pn(r) || []); };
      __ctWhere(); await new Promise(r => setTimeout(r, 2600)); const up = { lvl: window.top.INTENSITY.level(), layers: window.top.Function('return MUS.layers')() };
      window.partiesNear = pn; __ctWhere(); await new Promise(r => setTimeout(r, 2600)); const dn = { lvl: window.top.INTENSITY.level(), layers: window.top.Function('return MUS.layers')() };
      return { up, dn };
    });
    leg(th.up.lvl === 2 && th.up.layers === 2 && th.dn.lvl === 1 && th.dn.layers === 0, profile + ': *** A CLOSING THREAT RAISES IT ***: a crew within three cells, the map at level 2 at the top of a bar; gone, level 1',
      JSON.stringify(th));

    /* 7 a fight gives a faction song back */
    const fg = await p.evaluate(async (spot) => { return null; });
    const fight = await p.evaluate(() => { const c = PARTOFTOWN.songsOf('MOB')[0]; MUS.cur = c.fi; MUS.curSlot = 1; const before = SONGFENCE.now();
      SONGFENCE.fight(); return { before, after: SONGFENCE.now(), faction: PARTOFTOWN.now() }; });
    leg(fight.faction === null && SET.indexOf(fight.after) >= 0, profile + ': *** A FIGHT GIVES IT BACK ***: a faction song playing gives way to one of his overworld songs (their recorded levels, 207)',
      fight.before + ' -> ' + fight.after);

    /* 8 no menu, day or room song */
    const refused = await p.evaluate(() => { const L = MUS.lib(), nf = MFACTIONS.length, out = { tried: 0, let: [] };
      const cats = n => (MUS.cats && MUS.cats[n + '#1']) || [];
      for (let i = 0; i < L.length; i++) { const c = cats(L[i].n);
        const onlyQuiet = i < nf || (c.length && c.every(x => x === 'MENU' || x === 'OVERWORLD DAY' || x === 'OVERWORLD DUSK/DAWN'));
        if (!onlyQuiet) continue; out.tried++; if (SONGFENCE.allowed(i, 1)) out.let.push(L[i].n); }
      return out; });
    await new Promise(r => setTimeout(r, 1000));
    const outside = [...heard].filter(n => SET.indexOf(n) < 0 && FSET.indexOf(n) < 0);
    leg(refused.tried >= 14 && !refused.let.length && !outside.length && heard.size >= 3, profile + ': *** NO MENU, DAY OR ROOM SONG ***: every song heard is his overworld set or a faction song; the fence refuses the rest',
      'heard ' + [...heard].join(', ') + '; refused ' + refused.tried + (refused.let.length ? '; LET THROUGH ' + refused.let.join(', ') : '') + (outside.length ? '; OUTSIDE ' + outside.join(', ') : ''));
    const perrs = await p.evaluate(() => PARTOFTOWN.errs.slice());
    leg(!errs.length && !perrs.length, profile + ': nothing threw', errs.concat(perrs).slice(0, 2).join(' | ').slice(0, 200));
  } catch (e) { leg(false, profile + ': the demo and the map played', String(e.message).slice(0, 200)); }
  if (sampler) clearInterval(sampler);
  await d.close();
}

(async () => {
  const a = process.argv.slice(2);
  if (!a.includes('--computer-only')) await live('phone_portrait', 4);
  if (!a.includes('--phone-only')) await live('computer', 1);
  console.log('THE MAP PLAYS THE PART OF TOWN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
