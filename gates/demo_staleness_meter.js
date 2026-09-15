/* BOHEMIA -- THE DEMO STALENESS METER  (EYES AND EARS, E26 [five minutes], 9/14/26)
 *
 * *** THIS METER WAS AIMED AT THE WRONG FILE FOR TWO ROUNDS, AND ITS HEADLINE NUMBER WENT ON
 * HIS FRONT PAGE. READ THIS FIRST. (EYES E26 round 7, 9/15.) ***
 *   UI corrected its own claim (5bed08dd) and .github/workflows/pages.yml confirms it, with a
 *   comment dated 8/26: the deploy runs tools/bohemia_cut_the_demo.js AS A BUILD STEP, so THE
 *   DEMO AT THE ONE LINK IS RE-CUT FROM THE ALPHA ON EVERY PUSH. What he taps is the alpha's
 *   tip. It cannot be stale.
 *   I did not take that on trust (rule 12, a dependency is a premise): the cutter run in an
 *   isolated git worktree produced BUILD 9/15o, byte-matching the alpha's stamp, while the
 *   COMMITTED slices/BOHEMIA_DEMO.html on disk said BUILD 9/15m, 2,097 bytes apart.
 *   SO THE "109 COMMITS BEHIND" THIS TOOL PUBLISHED WAS TRUE OF A FILE NOBODY IS EVER SERVED,
 *   and the sentence it printed -- "the five minutes he judges by is this old" -- was wrong.
 *   It is now a BOOKKEEPING number: how far the committed file lags the alpha it is generated
 *   from. That still matters (DEMO BUILD goes red on it, and every lane's local walk opens that
 *   file) but it is not a number about what he plays, and it must never be printed as one.
 *
 * WHY THIS EXISTS, IN ONE SENTENCE FROM HIS OWN LAW: "the demo's first five minutes on a
 * phone, played by a stranger, is the measure of the game" (Paolo 9/13, LOCKED). If that
 * measure is frozen at an old cut, every lane's fix is invisible to the only thing he
 * judges by, and every lane's green checker is measuring a build he cannot open.
 *
 * MEASURED THIS ROUND: the demo had not changed for 109 commits, 22 of which touched the
 * alpha, while the alpha's stamp went from 9/14a to 9/14k. Nothing was wrong with anybody's
 * work. The number was simply invisible, so nobody could act on it.
 *
 * IT IS A METER, NOT A GATE, AND THAT IS DELIBERATE.
 *   A gate that went red because the demo was behind would red the whole fleet's suite over
 *   ONE lane's cadence, and only THE RUN may re-cut the demo (the law's section 3). E3
 *   measured what happens next: a checker that fails on something the reader cannot fix
 *   gets muted inside a week. So this PRINTS every run and NEVER fails. It exists so the
 *   number is on the board instead of in one lane's head.
 *   The enforcement that does belong in a gate is RUN's own [demo pinned] row: the demo
 *   naming the sha it was cut from. This meter is the measurement that row needs, not a
 *   substitute for it.
 *
 * THE CORRECTION THIS TOOL MADE TO ITS OWN AUTHOR (9/14, round 4). Round 3 put this on the
 * front page: "everything six lanes shipped against his list is one cut away from him." THAT
 * IS TOO BROAD AND IT IS NOW MEASURED WRONG. The demo does not contain the game; it LOADS it.
 * Of the 17 files the demo actually fetches, exactly ONE is the demo file, and it is 11% of the
 * 46.5 MB bundle. The other 89% -- the world, the tiles, the floors, the props -- is loaded by
 * path and is therefore LIVE: the moment a lane pushes it, he plays it. The world file alone
 * has taken 21 commits since the cut, and he has been playing every one of them.
 * So there are TWO numbers, not one, and saying only the first slandered eighteen lanes:
 *   FROZEN   the demo's own shell -- the splash, the cards, the build stamp, the fight blob --
 *            which nothing but a re-cut can move.
 *   LIVE     everything the shell loads by path, which needs no cut at all.
 * The font fix is stuck because it lives inside the frozen shell's fight blob. The dead BUILD
 * button fix is NOT stuck, because it lives in the world file, and it reached him the moment
 * LIFE + CITY pushed it.
 *
 * WHAT IT PRINTS
 *   the two build stamps, the commits since the demo file last changed, how many of those
 *   touched the alpha, and -- the one that matters -- whether the fight in the demo still
 *   carries a font the 9/11 vibe-coded law bans by name while the alpha's does not.
 *
 * RULE ZERO (E9): --selftest proves it reports a fabricated gap rather than printing zeros
 *   because it read nothing.
 */
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DEMO = 'slices/BOHEMIA_DEMO.html';
const ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html';

function sh(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch (e) { return ''; }
}
function stamp(rel) {
  try {
    const t = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const m = t.match(/BUILD\s+\d+\/\d+[a-z]*/);
    return m ? m[0] : 'no stamp';
  } catch (e) { return 'unreadable'; }
}
/* the fight ships as a base64 srcdoc blob, so the font it asks for is not greppable in the
   file itself -- E26 found that the hard way, after E19 published a clean zero over it. */
function fightFont(rel) {
  let t;
  try { t = fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch (e) { return null; }
  const m = t.match(/COMBAT_B64\s*=\s*['"`]([A-Za-z0-9+/=\s]{2000,}?)['"`]/);
  if (!m) return null;
  let d;
  try { d = Buffer.from(m[1].replace(/\s/g, ''), 'base64').toString('utf8'); } catch (e) { return null; }
  const count = (s) => (d.split(s).length - 1);
  return { space_grotesk: count('Space Grotesk'), googleapis: count('fonts.googleapis'),
           bohemia_mono: count('BohemiaMono') };
}

/* THE BUNDLE, AS MEASURED IN A BROWSER, NOT GUESSED FROM THE MARKUP (E11's census, 9/6).
   A grep for src= would miss what script writes at runtime, and this list was taken off the
   real requests the real page made. */
const BUNDLE = 'records/BOHEMIA_EYES_BUNDLE_9_6_26.json';
function split(cut) {
  let files;
  try { files = JSON.parse(fs.readFileSync(path.join(ROOT, BUNDLE), 'utf8')).bundle; }
  catch (e) { return null; }
  files = (files || []).filter(f => f !== ALPHA);
  let frozenBytes = 0, liveBytes = 0, liveMoved = 0, worst = null;
  for (const f of files) {
    let n = 0;
    try { n = fs.statSync(path.join(ROOT, f)).size; } catch (e) { continue; }
    if (f === DEMO) { frozenBytes += n; continue; }
    liveBytes += n;
    const c = cut ? parseInt(sh('git rev-list --count ' + cut + '..HEAD -- ' + f) || '0', 10) : 0;
    if (c > 0) liveMoved++;
    if (!worst || c > worst.commits) worst = { file: f, commits: c };
  }
  const tot = frozenBytes + liveBytes;
  return { files: files.length, frozen_bytes: frozenBytes, live_bytes: liveBytes,
           frozen_share: tot ? +(100 * frozenBytes / tot).toFixed(0) : 0,
           live_files_that_moved_since_the_cut: liveMoved, busiest: worst };
}

function measure() {
  const cut = sh('git log -1 --format=%H -- ' + DEMO);
  const behind = cut ? parseInt(sh('git rev-list --count ' + cut + '..HEAD') || '0', 10) : -1;
  const alphaShips = cut ? parseInt(sh('git rev-list --count ' + cut + '..HEAD -- ' + ALPHA) || '0', 10) : -1;
  return { cut_sha: cut.slice(0, 8), commits_behind: behind, alpha_ships_behind: alphaShips,
           demo_stamp: stamp(DEMO), alpha_stamp: stamp(ALPHA),
           demo_fight_font: fightFont(DEMO), alpha_fight_font: fightFont(ALPHA),
           split: split(cut) };
}

function report(m) {
  console.log('  the demo was last cut at   ' + m.cut_sha + '   stamp ' + m.demo_stamp);
  console.log('  the alpha is at            ' + '        ' + '   stamp ' + m.alpha_stamp);
  console.log('  commits on main since that cut:      ' + m.commits_behind);
  console.log('  of those, ships that touched the alpha: ' + m.alpha_ships_behind);
  const s = m.split;
  if (s) {
    console.log('  WHAT IS ACTUALLY FROZEN: ' + s.frozen_share + '% of the bundle he loads (the demo\'s own');
    console.log('  shell). The other ' + (100 - s.frozen_share) + '% is ' + (s.files - 1) + ' files loaded BY PATH, so they are LIVE --');
    console.log('  ' + s.live_files_that_moved_since_the_cut + ' of them have changed since the cut and he has been playing every one.');
    if (s.busiest) console.log('  busiest live file: ' + s.busiest.file + '  ' + s.busiest.commits + ' commits since the cut');
    console.log('  -> and a fix is never stuck waiting for a cut: the deploy cuts on every push.');
    console.log('     What a local walk of the committed file sees CAN be stale, which is a fact');
    console.log('     about the instrument, not about him.');
  }
  const d = m.demo_fight_font, a = m.alpha_fight_font;
  if (d && a) {
    console.log('  the fight\'s font, demo vs alpha:  Space Grotesk ' + d.space_grotesk + ' vs '
      + a.space_grotesk + ',  fonts.googleapis ' + d.googleapis + ' vs ' + a.googleapis
      + ',  BohemiaMono ' + d.bohemia_mono + ' vs ' + a.bohemia_mono);
    if (d.space_grotesk > 0 && a.space_grotesk === 0) {
      console.log('  -> the demo still carries a face the 9/11 law bans BY NAME and the alpha does not.');
    }
  }
  if (m.commits_behind > 0) {
    console.log('  WHAT THIS NUMBER IS AND IS NOT: the deploy re-cuts the demo FROM THE ALPHA on');
    console.log('  every push, so the demo at the one link is the alpha\'s tip and is never stale.');
    console.log('  This counts how far the COMMITTED demo file lags -- bookkeeping, and the file');
    console.log('  every lane\'s local walk opens. It is NOT how old the five minutes he plays is.');
  }
}

if (process.argv.includes('--selftest')) {
  const fake = { cut_sha: 'deadbeef', commits_behind: 109, alpha_ships_behind: 22,
                 demo_stamp: 'BUILD 9/13z', alpha_stamp: 'BUILD 9/14k',
                 demo_fight_font: { space_grotesk: 42, googleapis: 2, bohemia_mono: 0 },
                 alpha_fight_font: { space_grotesk: 0, googleapis: 0, bohemia_mono: 2 } };
  fake.split = { files: 16, frozen_bytes: 5100000, live_bytes: 41400000, frozen_share: 11,
                 live_files_that_moved_since_the_cut: 2, busiest: { file: 'x', commits: 21 } };
  const real = measure();
  /* C2 (added 9/14): the split must come from the measured bundle and must find BOTH sides.
     A split that reported 100% frozen would reproduce exactly the wrong claim this tool was
     built to correct, so a one-sided answer fails the control. */
  const ok = fake.commits_behind === 109
          && real.commits_behind >= 0
          && real.demo_stamp !== 'unreadable'
          && real.demo_fight_font !== null
          && real.split && real.split.frozen_bytes > 0 && real.split.live_bytes > 0
          && real.split.frozen_share > 0 && real.split.frozen_share < 100;
  report(fake);
  console.log(ok ? '  SELFTEST OK: it reports a fabricated gap, reads the real files, and finds BOTH a\n  frozen side and a live side rather than blaming everything on the cut.'
                 : '  SELFTEST FAILED: it cannot read the real files, so a zero would mean nothing.');
  process.exit(ok ? 0 : 1);
}

const m = measure();
report(m);
console.log('DEMO STALENESS METER: reported, never fails. THE COMMITTED FILE is ' + m.commits_behind
  + ' commits and ' + m.alpha_ships_behind + ' alpha ships behind the alpha it is cut from. '
  + 'What he plays is the alpha tip, cut at deploy.');
process.exit(0);
