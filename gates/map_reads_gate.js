/* BOHEMIA -- THE MAP STAYS READABLE  (EYES AND EARS, lane 17, [bb reads], 9/27/26)
 *
 * WHAT IT HOLDS
 *   Rule 33 (Paolo 9/24) makes the city view THE OVERWORLD MAP. A map is a thing you read at a
 *   glance and press with a thumb, so three numbers may never get worse:
 *     - the MEDIAN painted mark on the map may not shrink
 *     - the share of painted marks under the 11 px icon floor may not grow
 *     - the worst text contrast on the map may not fall
 *   The numbers come from tools/bohemia_eyes_map_reads.js, which reaches the map through
 *   PLUMBER's one driver, proves the CAMERA moved before it reads anything, and refuses to
 *   report at all unless its four controls behave.
 *
 * WHY A RATCHET AND NOT A BAR
 *   Today 100% of the marks painted on the map are under the 11 px floor and the median is 2 px,
 *   because at zoom 0.208 a tile is 3.7 px wide. A gate that failed on that would be red from
 *   the moment it was written, and E3 measured what happens to a gate that is always red: it is
 *   muted inside a week. So this holds the direction of travel. Green means "you did not make
 *   the map harder to read", which is a claim a fleet can actually keep.
 *
 * AND IT NEVER FAILS ON STALENESS, ON PURPOSE
 *   The reading needs a browser and about two minutes, so it cannot run inside the suite. This
 *   gate reads the saved reading and PRINTS how old it is against the alpha's build stamp. It
 *   does not go red for age, because a gate that punishes eighteen lanes for one lane's cadence
 *   is the DEMO STALENESS lesson, already learned here once.
 *
 *   --selftest plants a worse reading and proves the ratchet bites.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const READING = path.join(ROOT, 'records', 'BOHEMIA_EYES_MAP_READS_9_24_26.json');
const RATCHET = path.join(ROOT, 'records', 'BOHEMIA_EYES_MAP_RATCHET.json');
let passed = 0, failed = 0;
const ok = (name, cond, detail) => {
  if (cond) { passed++; console.log('  ok   ' + name + (detail ? '  -- ' + detail : '')); }
  else { failed++; console.log('  FAIL ' + name + (detail ? '  -- ' + detail : '')); }
};

function read(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; } }

function judge(reading, ratchet) {
  const n = reading && reading.numbers;
  if (!n) return { fatal: 'no reading to judge' };
  const bad = (reading.failing_controls || []).length;
  return {
    controls_failed: bad,
    median: n.median_painted_side_px,
    under_floor_pct: n.painted_marks_under_the_11px_icon_floor_pct,
    worst_contrast: n.worst_contrast_against_what_it_sits_on,
    squeezes: n.squeezes_the_camera_needed,
    regressions: !ratchet ? [] : [
      (n.median_painted_side_px != null && ratchet.median != null
        && n.median_painted_side_px < ratchet.median)
        ? 'the median painted mark shrank from ' + ratchet.median + ' to ' + n.median_painted_side_px + ' px' : null,
      (n.painted_marks_under_the_11px_icon_floor_pct != null && ratchet.under_floor_pct != null
        && n.painted_marks_under_the_11px_icon_floor_pct > ratchet.under_floor_pct)
        ? 'the share under the 11 px floor grew from ' + ratchet.under_floor_pct + '% to '
          + n.painted_marks_under_the_11px_icon_floor_pct + '%' : null,
      (n.worst_contrast_against_what_it_sits_on != null && ratchet.worst_contrast != null
        && n.worst_contrast_against_what_it_sits_on < ratchet.worst_contrast - 0.05)
        ? 'the worst text contrast fell from ' + ratchet.worst_contrast + ' to '
          + n.worst_contrast_against_what_it_sits_on : null,
    ].filter(Boolean),
  };
}

function main() {
  console.log('=== THE MAP STAYS READABLE (EYES [bb reads], rule 33) ===');
  const reading = read(READING), ratchet = read(RATCHET);
  ok('a reading of the map exists at all', !!reading,
     reading ? ('taken ' + reading.when) : 'run tools/bohemia_eyes_map_reads.js to make one');
  if (!reading) { console.log('=== MAP READS GATE: ' + passed + ' passed, ' + (failed + 1) + ' failed ==='); return 1; }

  const j = judge(reading, ratchet);
  ok('the reading\'s own controls behaved, so its numbers mean something',
     j.controls_failed === 0,
     j.controls_failed ? (reading.failing_controls || []).join(' | ') : 'four controls green');
  ok('the map is still reachable, and the reading says how many squeezes it took',
     j.squeezes != null, j.squeezes + ' squeeze(s) before the camera moved');
  ok('no number about reading the map got worse', j.regressions.length === 0,
     j.regressions.length ? j.regressions.join(' | ')
       : (ratchet ? 'median ' + j.median + ' px, ' + j.under_floor_pct + '% under the 11 px floor, '
                    + 'worst contrast ' + j.worst_contrast
                  : 'no ratchet yet: this reading becomes the line'));

  /* the ratchet only ever moves in the good direction, and it is written by this gate so the
     numbers on disk are always the best the map has ever been */
  if (!j.regressions.length) {
    const next = {
      median: Math.max(j.median || 0, (ratchet && ratchet.median) || 0),
      under_floor_pct: Math.min(j.under_floor_pct != null ? j.under_floor_pct : 100,
                                (ratchet && ratchet.under_floor_pct != null) ? ratchet.under_floor_pct : 100),
      worst_contrast: Math.max(j.worst_contrast || 0, (ratchet && ratchet.worst_contrast) || 0),
      taken_from: reading.when,
    };
    fs.writeFileSync(RATCHET, JSON.stringify(next, null, 2));
  }
  const stamp = (() => {
    try { const s = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');
          const m = /BUILD\s+(\d+\/\d+[a-z]?)/.exec(s); return m ? m[1] : '?'; } catch (e) { return '?'; }
  })();
  console.log('  (reported, never a failure: the reading is from ' + reading.when
    + ' and the alpha says BUILD ' + stamp + '. This gate does not go red for age.)');
  console.log('=== MAP READS GATE: ' + passed + ' passed, ' + failed + ' failed ===');
  return failed ? 1 : 0;
}

if (process.argv.includes('--selftest')) {
  /* THE TOOTH TEST: a reading that is worse than the ratchet must go red. */
  const good = { when: 'planted', failing_controls: [],
                 numbers: { median_painted_side_px: 4, painted_marks_under_the_11px_icon_floor_pct: 80,
                            worst_contrast_against_what_it_sits_on: 5, squeezes_the_camera_needed: 1 } };
  const line = { median: 4, under_floor_pct: 80, worst_contrast: 5 };
  const same = judge(good, line);
  const worse = judge({ ...good, numbers: { ...good.numbers, median_painted_side_px: 3,
                        painted_marks_under_the_11px_icon_floor_pct: 95,
                        worst_contrast_against_what_it_sits_on: 2 } }, line);
  console.log('  selftest: unchanged reading -> ' + same.regressions.length + ' regression(s)');
  console.log('  selftest: worse reading     -> ' + worse.regressions.length + ' regression(s): '
    + worse.regressions.join(' | '));
  process.exit((same.regressions.length === 0 && worse.regressions.length === 3) ? 0 : 1);
}
process.exit(main());
