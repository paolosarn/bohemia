/* ANALOG HORROR SOUND GATE (9/24/26, SOUNDS lane) -- row [analog horror sound], round two.

   RULE 20, PAOLO 9/20, LOCKED: "everything that's a sound has to be thought about as
   analog horror." A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and this is that gate.

   *** IT LANDS GREEN ON A SHELF THAT BREAKS EIGHT OF THE TEN RULES, ON PURPOSE. ***
   Round one refused to write this checker and said why in its own record: one written
   then goes red on 65 shipped sounds at once and breaks the suite for twenty lanes over
   work nobody has been asked for. So it is a RATCHET, the pattern reference_check_gate.py
   already settled on in this repo:

     * TODAY'S SHELF IS FROZEN (records/target/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.json)
       and no sound is allowed to get DULLER, QUIETER-FLOORED or WIDER-BANDED than the
       reading on that date. The debt can only shrink.
     * ANY SOUND NOT IN THE BASELINE -- anything added from 9/24 on -- is held to its
       class's rules OUTRIGHT, with no grandfathering at all.
     * AND EVERY SOUND MUST BE CLASSIFIED (banks/BOHEMIA_WHAT_MACHINE_IS_IT_9_24_26.json),
       so a sound cannot enter the game without somebody saying what it came off.

   *** AND THE CLASSES COME FROM DIRECTION'S BIBLE, NOT FROM THIS LANE'S TASTE. ***
   Bible rule 8 is DIEGETIC OR DEAD: tape damage lives only inside in-world screens and
   speakers, and the lens is an eye. So the school page's rule 4 ("every sound declares
   which machine it came off") CANNOT be asked of a footfall under your own boot, and rules
   5 and 6 are forbidden on it -- there is no tape to wobble and no oxide to lose contact.
   Measured on the shelf: 57 of 65 sounds are heard directly, 3 are machines you can point
   at, and 5 come through a speaker. THE REDO LIST IS FIVE SOUNDS AND A HANDFUL OF DULL
   IMPACTS, NOT SIXTY-FIVE, and that is the finding round two exists to produce.

   IT MEASURES WITH THE TOOL'S OWN BODY, NOT A COPY OF IT. tools/bohemia_the_keep_redo_list
   exports the measuring function; a checker carrying its own copy of a ruler is the
   duplication that silenced every footstep in this game for days, wearing a hat.

     node gates/analog_horror_sound_gate.js
     node gates/analog_horror_sound_gate.js --mutate   # the control must bite
*/
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const BANK = path.join(ROOT, 'banks/BOHEMIA_WHAT_MACHINE_IS_IT_9_24_26.json');
const BASE = path.join(ROOT, 'records/target/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.json');
const MUTATE = process.argv.indexOf('--mutate') >= 0;
const { measureShelf } = require(path.join(ROOT, 'tools/bohemia_the_keep_redo_list.js'));

let ok = 0; const bad = [];
function claim(name, good, detail) {
  if (good) { ok++; console.log('  ok   ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { bad.push(name); console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
}

/* THE BARS, AND EVERY ONE OF THEM IS GROUNDED IN A MEASUREMENT RATHER THAN PICKED.
   A threshold invented at the end of a long round is how a gate gets a number nobody can
   defend, which is written on this repo's own front page. */
const BAR = {
  /* AN IMPACT HAS TOP END. This lane's own cooked footstep measured 30.7% of its energy
     above 4 kHz; the three shipped sounds that really do read as noise measure 94.1%,
     26.2% and 16.7%. The shelf's MEDIAN is 0.273%. One percent sits 16x under the dullest
     sound that passes by construction and 30x under this lane's own cook, and two orders
     of magnitude over the median -- clear of both spreads instead of inside one. */
  transientAbove4k: 0.01,
  /* A MACHINE HUMS AT THE GRID'S PITCH (school rule 2). North American mains is 60 Hz and
     a ballast is 120, twice mains, because the magnetic force peaks twice a cycle.
     ONE PERCENT, AND IT IS THE INSTRUMENT'S OWN MEASURED ERROR THAT SETS IT, not a
     textbook. One bin of the window this is read in is 10.77 Hz, EIGHTEEN PERCENT at
     60 Hz, and the first cut of this read the generator at "54 Hz" and the sign at
     "118 Hz" and nearly put a false accusation in a record. Parabolic interpolation on the
     log magnitudes fixes it, and the tool proves it on sines it knows exactly before using
     it on anything: raw bins are out by up to 7.67%, the refined reading by at most 0.17%.
     One percent is six times that worst error. Both numbers are kept on every row (peakHz
     and peakBinHz) so this can never be read the wrong way round again. */
  humTolerance: 0.01,
  /* WHAT COMES OUT OF A SPEAKER STAYS INSIDE THE SPEAKER'S BAND (school rule 4). */
  speakerAboveBand: 0.05,
  speakerOctaveUp: 0.01,
  /* NOTHING CLIPS (school rule 8). */
  peak: 1.0
};

(async () => {
  console.log('=== ANALOG HORROR SOUND: the keep/redo list, and the debt may only shrink ===');
  const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
  const baseRow = {}; for (const r of base.rows) baseRow[r.ev] = r;

  const live = await measureShelf();
  if (live.fatal) { claim('the shelf could be measured at all', false, live.fatal);
    console.log('ANALOG HORROR SOUND: ' + ok + ' ok, ' + bad.length + ' failed');
    process.exit(1); }
  const rows = live.rows.filter(r => !r.err);

  /* *** THE MUTATION GOES IN BEFORE ANY READING, NEVER AFTER THE READING IT FALSIFIES.
     Two things this gate exists to catch, done for real rather than calculated: a sound
     loses half its top end, and a sound enters the game with no line in the machine table.
     If the ratchet claim and the classification claim stay green on this, they are
     decorations. This lane has already shipped a mutation that was a no-op. *** */
  if (MUTATE) {
    const bright = rows.slice().sort((a, b) => b.above4k - a.above4k)[0];
    if (bright) bright.above4k = bright.above4k * 0.5;
    delete bank.rows['step_asphalt'];
    console.log('  [mutate] ' + (bright ? bright.ev + ' loses half its top end' : 'no row')
      + ', and step_asphalt loses its line in the machine table');
  }

  /* A CHECK THAT WOULD PASS ON NOTHING IS NOT A CHECK. */
  claim('the shelf renders and every sound makes a sound',
    rows.length >= 60 && rows.every(r => r.peak > 0.01),
    rows.length + ' sounds rendered, quietest peak '
    + Math.min(...rows.map(r => r.peak)).toFixed(4));
  claim('and the ruler is not wrong: disjoint band shares sum to 1 on every row',
    rows.every(r => Math.abs(r.sharesSum - 1) <= 1e-4),
    'a share over one is a receipt that the ruler is wrong, which is how this lane caught '
    + 'its first band table');
  /* *** AND THE PITCH RULER IS MEASURED ON SINES WE KNOW EXACTLY, BEFORE IT IS USED ON
     ANY HUM. A tolerance quoted from a textbook is a number nobody can defend, and this
     lane nearly published "the generator hums at 54 Hz" about a hum that is not far off
     60 -- because one bin of this window is 10.77 Hz, eighteen percent at 60 Hz. *** */
  const ctl = live.control || [];
  const worstRaw = Math.max(...ctl.map(c => Math.abs(c.binErrPct)), 0);
  const worstFine = Math.max(...ctl.map(c => Math.abs(c.errPct)), 0);
  claim('THE PITCH RULER IS CHECKED AGAINST FREQUENCIES WE KNOW, FIRST',
    ctl.length >= 3 && worstFine <= 0.5 && worstRaw > worstFine * 4,
    ctl.map(c => c.askedHz + '->' + c.readHz).join(', ')
    + '; worst refined error ' + worstFine.toFixed(2) + '%, worst RAW BIN error '
    + worstRaw.toFixed(2) + '%. The tolerance rule 2 is held to is '
    + (BAR.humTolerance*100).toFixed(0) + '%, which is '
    + (worstFine > 0 ? (BAR.humTolerance*100/worstFine).toFixed(0) : '?')
    + 'x this instrument\'s own worst error');

  /* ---- EVERY SOUND IS CLASSIFIED, BOTH DIRECTIONS ------------------------------ */
  const unclassified = rows.filter(r => !bank.rows[r.ev]).map(r => r.ev);
  const ghosts = Object.keys(bank.rows).filter(e => !rows.some(r => r.ev === e));
  claim('EVERY SOUND IN THE GAME SAYS WHAT IT CAME OFF',
    unclassified.length === 0,
    unclassified.length ? 'not classified: ' + unclassified.join(' ')
      : rows.length + ' of ' + rows.length + ' classified. A sound cannot enter the game '
        + 'without a line in the machine table, which is what makes rule 20 enforceable');
  claim('and the table has no rows for sounds that do not exist',
    ghosts.length === 0, ghosts.length ? 'in the table but not in the game: '
      + ghosts.join(' ') : 'nothing stale');

  const cls = (r) => (bank.rows[r.ev] || {}).through || 'ear';
  const counts = { ear: 0, hum: 0, speaker: 0 };
  for (const r of rows) counts[cls(r)] = (counts[cls(r)] || 0) + 1;
  claim('AND RULE 8 IS WHY MOST OF THEM ARE KEEPS: the ear is an eye',
    counts.ear > counts.speaker,
    counts.ear + ' heard directly, ' + counts.hum + ' machines you can point at, '
    + counts.speaker + ' through a speaker. The school page asks rule 4 of every sound; '
    + "DIRECTION's bible rule 8 says tape damage lives only inside in-world speakers, so "
    + 'rule 4 can only be asked of the last group. Newest date wins and they are the same '
    + 'date, so the bible decides, because taste is DIRECTION and this lane does not judge it');

  /* ---- THE RATCHET: NOTHING GETS WORSE THAN 9/24 ------------------------------- */
  const dull = [], louderFloor = [], widened = [];
  for (const r of rows) {
    const b = baseRow[r.ev];
    if (!b) continue;                       /* new sounds are handled below, harder */
    /* 10% of the frozen reading, which is four times the widest spread this lane has
       measured on an unchanged tree for any spectral number (0.5% on the fight, 8.3% on
       main-thread cost), so a real regression moves it and noise cannot. */
    if (r.above4k < b.above4k * 0.90) dull.push(r.ev + ' ' + (b.above4k*100).toFixed(3)
      + '% -> ' + (r.above4k*100).toFixed(3) + '%');
    if (r.peak > BAR.peak) louderFloor.push(r.ev + ' peak ' + r.peak.toFixed(4));
    if (cls(r) === 'speaker') {
      const band = bank.bands[bank.classes.speaker.band];
      /* a SPEAKER sound is not allowed to grow past its band even if it is inside today */
      if (b.e99Hz && r.e99Hz > Math.max(b.e99Hz * 1.1, band.hi))
        widened.push(r.ev + ' 99% of energy below ' + b.e99Hz + ' Hz -> ' + r.e99Hz + ' Hz');
    }
  }
  claim('NOT ONE SOUND HAS GOT DULLER SINCE THE SHELF WAS FROZEN',
    dull.length === 0, dull.length ? dull.join('; ')
      : rows.filter(r => baseRow[r.ev]).length + ' sounds held against their 9/24 reading. '
        + 'The debt can only shrink: this is a floor under the shelf, never a target');
  claim('AND NOTHING CLIPS (school rule 8)', louderFloor.length === 0,
    louderFloor.length ? louderFloor.join('; ') : 'loudest peak on the shelf '
      + Math.max(...rows.map(r => r.peak)).toFixed(4) + ', and full scale is 1.0');
  claim('AND NOTHING THROUGH A SPEAKER HAS GROWN PAST ITS SPEAKER',
    widened.length === 0, widened.length ? widened.join('; ')
      : counts.speaker + ' sounds through the handset, none wider than it was');

  /* ---- A NEW SOUND IS HELD TO THE LAW OUTRIGHT -------------------------------- */
  const fresh = rows.filter(r => !baseRow[r.ev]);
  const freshBad = [];
  for (const r of fresh) {
    const row = bank.rows[r.ev] || {};
    const k = cls(r);
    if (k === 'ear' && row.transient && r.above4k < BAR.transientAbove4k)
      freshBad.push(r.ev + ': two hard things touching with only '
        + (r.above4k*100).toFixed(3) + '% above 4 kHz');
    if (k === 'hum') {
      const mult = r.peakHz / 60;
      if (Math.abs(mult - Math.round(mult)) > BAR.humTolerance * Math.max(1, Math.round(mult)))
        freshBad.push(r.ev + ': hums at ' + r.peakHz + ' Hz, which is '
          + mult.toFixed(2) + ' times mains and not a whole number of them');
    }
    if (k === 'speaker') {
      const band = bank.bands[bank.classes.speaker.band];
      if (r.e95Hz > band.hi * 1.5)
        freshBad.push(r.ev + ': 95% of its energy reaches ' + r.e95Hz
          + ' Hz through a ' + band.hi + ' Hz speaker');
    }
  }
  claim('AND ANY SOUND ADDED SINCE THE FREEZE MEETS ITS CLASS OUTRIGHT',
    freshBad.length === 0,
    freshBad.length ? freshBad.join('; ')
      : fresh.length === 0 ? 'nothing has been added to the shelf since 9/24, so this '
        + 'claim has nothing to bite on yet and says so instead of reading as a pass'
        : fresh.length + ' new: ' + fresh.map(r=>r.ev).join(' '));

  /* ---- AND THE LIST ITSELF, PRINTED, BECAUSE IT IS THE ROW'S OUTPUT ----------- */
  const redo = [], keep = [];
  for (const r of rows) {
    const row = bank.rows[r.ev] || {}, k = cls(r);
    let why = null;
    if (k === 'ear' && row.transient && r.above4k < BAR.transientAbove4k)
      why = 'hard contact with ' + (r.above4k*100).toFixed(3) + '% above 4 kHz';
    else if (k === 'hum') {
      const m = r.peakHz / 60;
      if (Math.abs(m - Math.round(m)) > BAR.humTolerance * Math.max(1, Math.round(m)))
        why = 'hums at ' + r.peakHz + ' Hz, ' + m.toFixed(2) + ' times mains';
    } else if (k === 'speaker') why = 'nothing under it says it came through a speaker';
    (why ? redo : keep).push(why ? (r.ev + ': ' + why) : r.ev);
  }
  claim('THE KEEP/REDO LIST EXISTS AND IS SHORTER THAN THE SHELF',
    redo.length > 0 && redo.length < rows.length,
    keep.length + ' KEEP, ' + redo.length + ' REDO of ' + rows.length
    + '. A list that redid everything would be a list nobody can act on');
  console.log('');
  console.log('  REDO (' + redo.length + '):');
  for (const x of redo) console.log('    ' + x);
  console.log('  KEEP (' + keep.length + '): ' + keep.join(' '));

  console.log('');
  if (MUTATE) console.log('MUTATION RAN: ' + bad.length + ' claim(s) went red. The ratchet '
    + 'and the classification claims are the two that must be in that list.');
  console.log('ANALOG HORROR SOUND: ' + ok + ' ok, ' + bad.length + ' failed');
  if (bad.length) console.log('RED: ' + bad.join(' | '));
  process.exit(bad.length ? 1 : 0);
})().catch(e => { console.log('ANALOG HORROR SOUND CRASHED: ' + e.message); process.exit(1); });
