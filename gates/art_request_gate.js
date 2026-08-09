/* ============================================================================
   ART REQUEST GATE (8/6/26)

   Paolo 8/6: "So you need to make tile request forms we have to request for
   ready for you to fill out... We already have a chat that handles the art."

   THE DIVISION OF LABOUR HE JUST SET: a lane that needs art FILES A REQUEST. It
   does not cook the art, and it does not stop working. The ART lane cooks, he
   thumbs, and the art lands.

   WHY THIS NEEDS A GATE AND NOT A DOC. The handoff between "we need this art" and
   "this art is in the game" has failed SEVEN TIMES in one month -- border walls,
   the bought sidewalk, footsteps, traffic signals, door swing clips, door jambs,
   the whole interior pool. Every one was approved or bought, and every one sat in
   banks/ while the game drew something else. A request form with no machine behind
   it is the eighth.

   SO A REQUEST CLOSES ON ONE CONDITION ONLY: its marker is measurably in the
   surface he plays. Not when it is cooked. Not when it is approved. When it SHIPS.

   THE GATE:
     1. the queue parses and every request carries the fields a cook can act on
     2. no request claims SHIPPED unless its marker is really in the surface
     3. a request whose art HAS landed cannot sit OPEN and be forgotten
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const QUEUE = path.join(ROOT, 'records/requests/BOHEMIA_ART_REQUEST_QUEUE.json');
const SURFACES = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html'];
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };

ok('the art request queue exists', fs.existsSync(QUEUE));
if (!fs.existsSync(QUEUE)) { console.log('ART REQUEST GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }

let q; try { q = JSON.parse(fs.readFileSync(QUEUE, 'utf8')); }
catch (e) { ok('the queue is valid JSON (' + e.message + ')', false); process.exit(1); }
ok('the queue is valid JSON', true);

let blob = '';
for (const s of SURFACES) { const p = path.join(ROOT, s); if (fs.existsSync(p)) blob += fs.readFileSync(p, 'utf8'); }
ok('the surface he plays is readable', blob.length > 100000);

const OKST = new Set(q.status_values || []);
let open = 0, shipped = 0, stale = 0;
for (const r of q.requests || []) {
  const tag = r.id + ' ' + r.what;
  ok(tag + ': has a status the machine knows', OKST.has(r.status));
  /* a cook cannot act on a wish. these are the fields that make it buildable. */
  ok(tag + ': quotes HIS words for why it exists', !!r.why_paolo && r.why_paolo.length > 10);
  ok(tag + ': carries the MEASURED gap, not a feeling', !!r.measured_gap && r.measured_gap.length > 20);
  ok(tag + ': carries a spec a cook can build from', !!r.spec && Object.keys(r.spec).length >= 3);
  ok(tag + ': names the marker that proves it shipped', /^__[A-Z0-9_]+__$/.test(r.marker_when_shipped || ''));

  const live = r.marker_when_shipped && blob.indexOf(r.marker_when_shipped) >= 0;
  if (r.status === 'SHIPPED') {
    shipped++;
    /* THE WHOLE POINT: "shipped" is a claim about the game, not about a folder. */
    ok(tag + ': claims SHIPPED and its art IS in the surface he plays', !!live);
  } else if (r.status !== 'KILLED') {
    open++;
    /* and the reverse: art that landed must not sit OPEN and be forgotten, which
       is how approved work stayed invisible seven times this month. */
    if (live) { stale++; ok(tag + ': is OPEN but its art is ALREADY in the game -- close it', false); }
  }
}
ok('the queue is not empty (' + (q.requests || []).length + ' requests)', (q.requests || []).length > 0);
console.log('    ' + open + ' open, ' + shipped + ' shipped, ' + stale + ' needing their status corrected.');
console.log('ART REQUEST GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
