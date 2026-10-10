/* WHERE A GATE'S PROOF SHOT GOES (PLUMBER 10/9/26, row [proof shots churn])
   ================================================================================
   The coordinator, 10/9: "five commits in seven minutes (148dab55 to e5330501) re-committed RUN TWO's
   settlement proof shots (1.8 MB PNGs) because the gate re-shoots on every rebase and the bytes differ
   by a few hundred; the repo grows and the log drowns."
   MEASURED 10/9 on the clone's last five days: RUN2_THE_SETTLEMENT_SCREEN_BARBER_10_1.png re-committed
   13 times, _SMITH_ 12, _RAIDED_ and _MARKET_DAY_ 9 each, the loop's four shots 4 each, the roster 3
   (once by SOUNDS, f5b94ea, who only ran the gate). Five gates wrote straight into slices/vote/ on every
   run: settlement_screen, roster_screen, one_file_loop, climbing, the_rebuilt_fight_plays. A picture
   that changes every run is not a proof, and slices/ is published, so every re-shoot ships.

   THE RULE: a gate run changes nothing git tracks. proofShot(trackedPath) returns
     - a scratch file, os.tmpdir()/bohemia_proof_shots/<same name>, by default;
     - the tracked path itself only when asked: `--shoot` on the gate's command line, or
       BOHEMIA_SHOOT=1 in its environment. That is how the lane that owns the VOTE picture
       refreshes it, on purpose, in the commit that changed what it shows.
   The pattern was already in the fleet: people_gate, camp_dial_gate and lab_gate take a PROOF_DIR
   that defaults to os.tmpdir(). gates/proof_shots_gate.js (PROOF SHOTS STAY PUT) holds it.
   ================================================================================ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const SHOOT = process.argv.includes('--shoot') || process.env.BOHEMIA_SHOOT === '1';
const SCRATCH = path.join(os.tmpdir(), 'bohemia_proof_shots');

function proofShot(trackedPath) {
  if (SHOOT) return trackedPath;
  fs.mkdirSync(SCRATCH, { recursive: true });
  return path.join(SCRATCH, path.basename(trackedPath));
}

module.exports = { proofShot, SHOOT, SCRATCH };
