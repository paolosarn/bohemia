/* ============================================================================
   EVERY RUNNING LANE HAS A JOB -- THE OPEN ROWS ON THE BOARD
   (PLUMBER 10/10/26, row [open row gate]; rule 74)

   PAOLO 10/4: "you told me to start talking to these chats... and they don't have jobs, so what the
   fuck is wrong with you." Rule 74, A JOB IS AN OPEN ROW: every running lane has AT LEAST THREE OPEN
   ROWS at every moment, its jump list; 'round N open' inside a shipped row is never written again; a
   MODE line never names one row; "PLUMBER owes [open row gate]."

   It reads VAMILY.md the way a chat reads it: a lane is a `## ` section with a MODE line (SHARED is a
   pool, not a lane); it is running unless its MODE says PAUSED or PARKED; a job is a line that starts
   `- OPEN`. Red names the lane, so the coordinator's sweep and the lane both know whose it is.

   LEGS
     S1-S5  planted boards: a running lane with no OPEN row is caught; a paused one is not; a lane with
            two is short of three; a MODE that names one row and a shipped row that says ROUND N OPEN are
            caught; a clean board passes all four.
     O1     every running lane has at least one OPEN row (the floor Paolo hit on 10/4).
     O3     every running lane has at least three (rule 74's number).
     M1     no running lane's MODE line names one row ('one row', 'THE ONE ROW').
     R1     no SHIPPED row says 'ROUND <n> OPEN' (rule 74: never written again).
   MEASURED 10/10, the round it landed (23 running lanes): O1 green, every running lane has a job; O3 red,
   the board moved under the measurement itself (six lanes short at the first count, four when it was
   committed: WORLD 2, RUN TWO 2, ECONOMY 2, MODS 2); M1 green; R1 red on two shipped rows (SOUNDS
   'ROUND THREE OPEN', RUN TWO 'ROUND FOUR OPEN'). A copy of the real board with RUN TWO's OPEN rows taken
   away and 'THE ONE ROW' put in its MODE: O1, O3 and M1 all name RUN TWO. Red on purpose: the board says
   what the law says it must, or this says which lane it does not. No browser; well under a second.
   node gates/open_row_gate.js [path to a board]
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

/* the board, as lanes */
function lanes(text) {
  const L = text.split('\n'), heads = [];
  L.forEach((l, i) => { if (l.startsWith('## ')) heads.push(i); });
  const out = [];
  heads.forEach((h, k) => {
    const body = L.slice(h + 1, k + 1 < heads.length ? heads[k + 1] : L.length);
    const mode = body.find(l => l.startsWith('MODE:'));
    if (!mode) return;                                         /* not a lane: the front page, the list, history */
    const name = L[h].slice(3).split('  (')[0].trim();
    if (/^SHARED\b/.test(name)) return;                        /* a pool any chat draws from, not a lane */
    out.push({ name, mode, running: !/^MODE:\s*(PAUSED|PARKED)\b/i.test(mode),
      open: body.filter(l => /^- OPEN\b/.test(l)),
      shipped: body.filter(l => /^- SHIPPED\b/.test(l)) });
  });
  return out;
}
const ONE_ROW = /\b(THE ONE ROW|one row)\b/i;
const ROUND_OPEN = /\bround\s+\w+\s+open\b/i;
function judge(text) {
  const ls = lanes(text).filter(l => l.running);
  return {
    lanes: ls,
    none: ls.filter(l => l.open.length < 1).map(l => l.name),
    short: ls.filter(l => l.open.length < 3).map(l => l.name + ' ' + l.open.length),
    oneRow: ls.filter(l => ONE_ROW.test(l.mode)).map(l => l.name),
    roundOpen: [].concat(...ls.map(l => l.shipped.filter(r => ROUND_OPEN.test(r))
      .map(r => l.name + ': ...' + (r.match(/.{0,40}\bround\s+\w+\s+open\b/i) || [''])[0].trim()))),
  };
}

console.log('='.repeat(74));
console.log('EVERY RUNNING LANE HAS A JOB: the OPEN rows on the board (rule 74)');
console.log('='.repeat(74));

/* ---- S: planted boards ----------------------------------------------------------- */
const row = (w, l) => '- ' + w + '  [' + l + ']  A-JOB -- a brief';
const board = (...secs) => '# B\n## READ THIS FRONT PAGE\nrules\n' + secs.join('\n') + '\n## HISTORY\nold\n';
const sec = (name, mode, rows) => '## ' + name + '  (01.)\nMODE: ' + mode + '\n' + rows.join('\n');
const three = [row('OPEN', 'a'), row('OPEN', 'b'), row('OPEN', 'c')];
{ const j = judge(board(sec('ALPHA', 'RUN', [row('SHIPPED 10/9 abc', 'x')]), sec('BETA', 'RUN', three)));
  ok('S1 a running lane with no OPEN row is named (' + j.none + ')', j.none.length === 1 && j.none[0] === 'ALPHA'); }
{ const j = judge(board(sec('ALPHA', 'PAUSED (rule 54)', []), sec('BETA', 'RUN', three)));
  ok('S2 a paused lane is not a missing job (' + j.none.length + ' named)', j.none.length === 0 && j.short.length === 0); }
{ const j = judge(board(sec('ALPHA', 'RUN', three.slice(0, 2)), sec('SHARED (any chat)', 'BUILD', [])));
  ok('S3 two OPEN rows are short of three, and SHARED is not a lane (' + j.short + ')', j.short.length === 1 && j.short[0] === 'ALPHA 2' && j.none.length === 0); }
{ const j = judge(board(sec('ALPHA', 'SPRINT: THE ONE ROW is [x]', three), sec('BETA', 'RUN', three.concat([row('SHIPPED 10/4 d3f, ROUND FOUR OPEN (rule 71a)', 'y')]))));
  ok('S4 a MODE that names one row and a shipped row that says ROUND FOUR OPEN are named (' + j.oneRow + '; ' + j.roundOpen.length + ')', j.oneRow.join() === 'ALPHA' && j.roundOpen.length === 1 && /^BETA/.test(j.roundOpen[0])); }
{ const j = judge(board(sec('ALPHA', 'RUN (rule 78): the top OPEN row is the job', three), sec('BETA', 'RESEARCH ONLY, RUNNING', three)));
  ok('S5 a clean board passes all four', !j.none.length && !j.short.length && !j.oneRow.length && !j.roundOpen.length); }

/* ---- the real board ------------------------------------------------------------- */
const file = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'VAMILY.md');
const j = judge(fs.readFileSync(file, 'utf8'));
console.log('  ' + j.lanes.length + ' running lanes: ' + j.lanes.map(l => l.name + ' ' + l.open.length).join(', '));
ok('O1 every running lane has at least one OPEN row', !j.none.length,
   'no job on the board: ' + j.none.join(', ') + '. Rule 74: the coordinator writes the next row, or the lane writes it from its jump list before its reply ends.');
ok('O3 every running lane has at least three OPEN rows (rule 74)', !j.short.length,
   'short of three: ' + j.short.join(', ') + '. Rule 74: AT LEAST THREE OPEN ROWS at every moment, its jump list.');
ok('M1 no running lane\'s MODE line names one row', !j.oneRow.length,
   j.oneRow.join(', ') + ': rule 74, a MODE line says the top OPEN row is the job and the OPEN rows under it are the jump list.');
ok('R1 no SHIPPED row says ROUND <n> OPEN', !j.roundOpen.length,
   j.roundOpen.join('\n         ') + '\n         rule 74: the next round of a job is its own OPEN row, never words inside a shipped one.');

console.log('\n=== EVERY RUNNING LANE HAS A JOB: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
