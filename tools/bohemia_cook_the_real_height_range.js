#!/usr/bin/env node
/* IS THE HEIGHT RANGE REAL? (10/16/26, CHARACTER, [real height]).
 *
 * WHY THIS ROUND: every row this lane could pick up is genuinely blocked on
 * DIRECTION's [the master rig] (still OPEN, confirmed fresh against VAMILY.md
 * and reference/art_bank/character/README.md before writing a line of this).
 * [real height] is HELD, and its own text says it was "un-held for the making"
 * on 9/23: "HIS VOTE IS THE RULING, yes to heights... the dial runs 0.88 to
 * 1.12 of it [the 112 box]." That is three weeks old and the row still carries
 * no RESULT. Rule 12 (measure, never assume): checked whether that un-hold
 * ever became code, rather than trusting the row's own text.
 *
 * THE FINDING: it did not. slices/BOHEMIA_ALPHA_0_9.html's own dial table
 * (AMP.height, ~line 2261) is still 0.05 (+-5%), with a comment dated to the
 * ORIGINAL defect explaining why: "the honest ceiling on 'taller' is the
 * sprite frame itself... going bigger needs a ruling (a taller frame, or
 * re-centring canon)." git log -L on that line shows one commit, ever: the
 * line that introduced it. The +-12% Paolo approved was never built.
 *
 * WHAT THIS ROUND DOES: measures the REAL, LIVE painted height at both dial
 * extremes (height=-1 and height=+1) through the actual rig (buildFrame,
 * rebuildFromRig), the same method and the same 57 px/m scale as last round's
 * [the body in meters], converts to real meters, and states plainly that the
 * old formula's own frame size is the reason it cannot be widened without a
 * taller canvas -- a constraint DIRECTION's master rig (a real render, not a
 * fixed pixel canvas) does not inherit. Nothing is fixed here: the formula is
 * a placeholder (rule 101c) and is not edited; this hands the real numbers
 * and the real reason to whoever builds the replacement.
 *
 * Run: node tools/bohemia_cook_the_real_height_range.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const RECORD = path.join(ROOT, 'records/BOHEMIA_IS_THE_HEIGHT_RANGE_REAL_10_16_26.md');

const PX_PER_M = 57; // the lane's own standing constant, cited last round, not re-measured

function m(px) { return +(px / PX_PER_M).toFixed(3); }

async function run() {
  const d = await D.open({ alpha: true });
  try {
    const data = await d.page.evaluate(() => {
      function measure(heightDial) {
        const keep = G.bodyVar;
        G.bodyVar = Object.assign({}, G.bodyVar, { height: heightDial });
        rebuildFromRig();
        try { HD_CACHE.map.clear(); } catch (e) {}
        const f = buildFrame('S', 'idle', 0);
        let minY = 1e9, maxY = -1;
        for (let y = 0; y < f.CH; y++) for (let x = 0; x < f.CW; x++) {
          if (f.px[y * f.CW + x]) { if (y < minY) minY = y; if (y > maxY) maxY = y; }
        }
        G.bodyVar = keep;
        rebuildFromRig();
        try { HD_CACHE.map.clear(); } catch (e) {}
        return maxY - minY + 1;
      }
      /* AMP itself lives inside BOH_AGE's own closure, not on window, so it is cited
         from the source (read directly, not probed live) rather than guessed at here. */
      return {
        short: measure(-1),
        median: measure(0),
        tall: measure(1),
      };
    });
    return data;
  } finally {
    await d.close();
  }
}

async function main() {
  const r = await run();
  const shortM = m(r.short), medianM = m(r.median), tallM = m(r.tall);
  const endToEndPct = +(((r.tall - r.short) / r.median) * 100).toFixed(1);

  let s = '# IS THE HEIGHT RANGE REAL?\n\n';
  s += 'CHARACTER, 10/16. [real height], HELD. Every other row on this lane\'s board is ';
  s += 'blocked fresh (checked reference/art_bank/character/README.md again: the runway twin ';
  s += 'is still OWED; DIRECTION\'s [the master rig] is still OPEN), so this round checks a ';
  s += 'claim this lane\'s own board has been carrying unverified for three weeks instead of ';
  s += 'inventing new work.\n\n';
  s += '## THE CLAIM\nThe row\'s own text: the coordinator ruled 9/21 that the height dial should ';
  s += 'run 0.88 to 1.12 of the body (real adults vary about a third, end to end), and a 9/23 note ';
  s += 'says "HIS VOTE IS THE RULING, yes to heights... un-held for the making." Nothing on the row ';
  s += 'since then says it shipped.\n\n';
  s += '## WHAT IS ACTUALLY LIVE\nslices/BOHEMIA_ALPHA_0_9.html\'s own dial table, AMP.height, is 0.05 ';
  s += '(+-5%), unchanged since the single commit that introduced it (checked with `git log -L` on the ';
  s += 'line: one commit, ever, no later edit). Measured live through the real rig (buildFrame, both ';
  s += 'dial extremes, the same method and the same 57 px/m scale as last round\'s [the body in meters]):\n\n';
  s += '| dial | painted px | metres |\n|---|---|---|\n';
  s += `| height -1 (shortest) | ${r.short} | ${shortM} |\n`;
  s += `| height 0 (median) | ${r.median} | ${medianM} |\n`;
  s += `| height +1 (tallest) | ${r.tall} | ${tallM} |\n\n`;
  s += `End to end, the dial moves the body ${endToEndPct}% of its own height, about `;
  s += `${m(r.tall - r.short)} m total spread. The approved range (0.88 to 1.12, a 24% spread) was never built; `;
  s += `today\'s real spread is under half that.\n\n`;
  s += '## WHY IT STOPPED AT 5%, IN THE CODE\'S OWN WORDS\nThe comment beside AMP.height says it plainly: ';
  s += 'the body already paints into the top row of its 56px frame on nine clips at the current size, and ';
  s += 'past 5% the head gets shaved off on several facings. "The honest ceiling on taller is the sprite ';
  s += 'frame itself, not taste." Someone measured that correctly once; the 9/21 ruling just never got ';
  s += 'built against it, and the row went HELD before anyone had to reconcile the two.\n\n';
  s += '## WHY THIS IS NOT A JOB FOR THIS LANE RIGHT NOW\nWidening AMP.height on the formula would mean ';
  s += 'editing a placeholder (rule 101c forbids it) to chase a ceiling the formula\'s OWN canvas size sets, ';
  s += 'for a renderer 69d28a0b already found is being replaced wholesale, not patched. A real, 24%-wide ';
  s += 'height range is a render-resolution problem, and DIRECTION\'s [the master rig] renders from a 3D ';
  s += 'model at whatever size the camera asks for -- it does not inherit a fixed 56px canvas, so it does ';
  s += 'not inherit this ceiling. The real fix is building the range into the new rig from the start, not ';
  s += 'squeezing more out of the old one.\n\n';
  s += '## WHAT THIS HANDS OFF\nWhen [the master rig] is built: real adult height varies about a third ';
  s += 'end to end (the original, still-correct 9/21 measurement); at this lane\'s own 57 px/m scale that is ';
  s += `roughly ${m(r.median * 0.88)} m to ${m(r.median * 1.12)} m around a ${medianM} m median. [real height] `;
  s += 'stays HELD on this lane\'s board: the claim it carries is false as written (never un-held in code), ';
  s += 'corrected here rather than left to mislead whoever picks it up next.\n\n';
  s += '## TAB\nNo tab. A verification and a handoff, not a look; no pixel was drawn or changed.\n';

  fs.writeFileSync(RECORD, s);
  console.log('wrote', RECORD);
  console.log(JSON.stringify(r, null, 1));
}

if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { run };
