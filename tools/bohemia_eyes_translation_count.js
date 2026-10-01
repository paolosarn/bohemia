/* BOHEMIA -- [translation count] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, rule 48. 9/30-10/1/26.
 *
 * THE ROW: read records/BOHEMIA_THE_BATTLE_BROTHERS_TRANSLATION_TABLE_9_29_26.md every round;
 * count DONE / IN HAND / RESEARCHED / NOT STARTED against the board's LIVE rows in VAMILY.md,
 * not against the table's own say-so; a NOT STARTED older than two rounds or a row with no
 * owner is red on the front page.
 *
 * ROUND ONE (school, records/BOHEMIA_EYES_TRANSLATION_COUNT_ROUND_1_SCHOOL_A_TABLE_NOBODY_
 * REREADS_GOES_STALE_9_30_26.md) found two things this round two is built on: a parity table
 * rots the moment its own count and the live board it describes stop being cross-checked, so
 * this NEVER reads the table's own summary line as truth -- it recomputes the tally from the
 * 62 rows directly, every time; and the staleness clock starts from THIS round's baseline
 * (the table is one round old), so this writes a baseline file rather than pretending to know
 * an age it cannot know yet.
 *
 * RULE ZERO. Two controls, printed first, and the owner-search below refuses to report a
 * drift finding if either fails.
 *   C1 A KNOWN BRACKET RESOLVES   [bb map] is known, from reading the board by hand, to be a
 *      real SHIPPED row (VAMILY.md line ~569). The search must find it and read SHIPPED.
 *   C2 A FAKE BRACKET DOES NOT RESOLVE   a bracket that cannot exist must come back with zero
 *      matches, proving a hit is a real find and not the search matching everything.
 *
 * This lane never writes game code; this script only reads two markdown files and writes a
 * record. No file but this tool's own output is touched.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TABLE = path.join(ROOT, 'records', 'BOHEMIA_THE_BATTLE_BROTHERS_TRANSLATION_TABLE_9_29_26.md');
const BOARD = path.join(ROOT, 'VAMILY.md');
const OUT = path.join(ROOT, 'records', 'BOHEMIA_EYES_TRANSLATION_COUNT_9_30_26.json');
const BASELINE = path.join(ROOT, 'records', 'BOHEMIA_TRANSLATION_COUNT_BASELINE_9_30_26.json');

const tableText = fs.readFileSync(TABLE, 'utf8');
const boardText = fs.readFileSync(BOARD, 'utf8');

/* STATUS WORD ON A BOARD LINE: the first all-caps word (or two) at the start of a "- WORD"
   line, e.g. "- SHIPPED 9/28 ...", "- CLAIMED 9/30 ...", "- OPEN  [...". Matches the shapes
   actually used on the board (checked by hand against a dozen real rows before writing this). */
function statusOfBoardLine(line) {
  const m = /^-\s+([A-Z][A-Z-]*)\b/.exec(line.trim());
  return m ? m[1] : null;
}

/* FIND EVERY BOARD LINE CARRYING A GIVEN [bracket] LABEL, anywhere in VAMILY.md. A bracket
   label is meant to be unique per job (rule 4), so a global search is the right scope, not a
   per-lane one -- and a global search is also the one that cannot be fooled by a lane name in
   the table not matching the board's own section header wording exactly. */
function findBracket(label) {
  const needle = '[' + label + ']';
  const hits = [];
  for (const raw of boardText.split('\n')) {
    if (raw.includes(needle)) {
      const st = statusOfBoardLine(raw);
      if (st) hits.push(st);
    }
  }
  return hits;
}

/* RULE ZERO CONTROLS, run before anything else is trusted. */
const controls = [];
{
  const known = findBracket('bb map');
  controls.push({ name: 'C1 A KNOWN BRACKET RESOLVES: [bb map] is a real SHIPPED row',
    pass: known.includes('SHIPPED'),
    detail: 'found ' + known.length + ' board line(s) carrying [bb map], statuses: ' + JSON.stringify(known) });
}
{
  const fake = findBracket('zzz nonexistent bracket 9f3x');
  controls.push({ name: 'C2 A FAKE BRACKET DOES NOT RESOLVE: zero matches for a label that cannot exist',
    pass: fake.length === 0,
    detail: fake.length + ' match(es) found (must be 0)' });
}
const controlsOk = controls.every(c => c.pass);

const out = { what: 'the translation table counted fresh against the live board, not against its own summary line',
  row: '[translation count], rule 48', when: new Date().toISOString(), controls, sections: [], rows: [] };

if (!controlsOk) {
  out.controls_failed = true;
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log('  CONTROLS FAILED. Refusing to count anything until the search itself is trusted.');
  console.log(JSON.stringify(controls, null, 2));
  process.exit(1);
}

/* PARSE THE TABLE'S OWN MARKDOWN. Sections start at "## " headers; each section's table has a
   header row, a "|---|---|---|---|" separator, then data rows. Skip anything that is not a
   4-column "| a | b | c | d |" row. */
const lines = tableText.split('\n');
let section = null;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const h = /^##\s+(.+)/.exec(line);
  if (h) { section = h[1].trim(); continue; }
  if (!line.startsWith('|')) continue;
  if (/^\|\s*-+\s*\|/.test(line)) continue;            // the --- separator row
  const cells = line.split('|').slice(1, -1).map(c => c.trim());
  if (cells.length !== 4) continue;
  if (cells[0] === 'BB system') continue;               // the header row itself
  out.rows.push({ section, bb_system: cells[0], translation: cells[1], owner_raw: cells[2], status_raw: cells[3] });
}

/* FRESH TALLY, never read off the table's own bottom line. A status cell is bucketed by the
   word it STARTS WITH; a cell that starts with two words joined by "/" (one real case: "DONE /
   IN HAND" on Backgrounds) is its own MIXED bucket rather than forced a guess either way --
   forcing it would be exactly the kind of sloppy count this row exists to replace. */
const tally = { DONE: 0, 'IN HAND': 0, RESEARCHED: 0, 'NOT STARTED': 0, MIXED: 0 };
for (const r of out.rows) {
  const s = r.status_raw;
  if (/^DONE\s*\//.test(s)) tally.MIXED++;
  else if (/^DONE\b/.test(s)) tally.DONE++;
  else if (/^IN HAND\b/.test(s)) tally['IN HAND']++;
  else if (/^RESEARCHED\b/.test(s)) tally.RESEARCHED++;
  else if (/^NOT STARTED\b/.test(s)) tally['NOT STARTED']++;
  else tally.MIXED++;
}
out.fresh_tally = tally;
out.fresh_total = out.rows.length;

/* THE TABLE'S OWN CLAIM, read from its summary line, parsed the same way a reader would, so a
   disagreement between this and fresh_tally is itself a finding -- the table's math drifting
   from its own rows, not just from the board. */
const summaryLine = lines.find(l => l.startsWith('## THE COUNT:')) || '';
const claimed = {};
const cm = /(\d+)\s+rows;\s*DONE\s+(\d+),\s*IN HAND\s+(\d+),\s*RESEARCHED\s+(\d+),\s*NOT STARTED\s+(\d+)/.exec(summaryLine);
if (cm) {
  claimed.total = +cm[1]; claimed.DONE = +cm[2]; claimed['IN HAND'] = +cm[3];
  claimed.RESEARCHED = +cm[4]; claimed['NOT STARTED'] = +cm[5];
}
out.table_claims = claimed;
out.table_claim_matches_fresh_tally = cm
  ? (claimed.total === out.fresh_total && claimed.DONE === tally.DONE && claimed['IN HAND'] === tally['IN HAND']
     && claimed.RESEARCHED === tally.RESEARCHED && claimed['NOT STARTED'] === tally['NOT STARTED'])
  : null;

/* OWNER CHECK. Every [bracket] in the OWNER cell, searched globally on the board; a bracket
   with zero hits anywhere is "a row with no owner" in the row's own words. A row whose table
   status is NOT STARTED but whose owner bracket(s) already read SHIPPED on the board is live
   drift -- the exact failure mode round one's school found (and predicted for Ambitions,
   confirmed below). */
const bracketRe = /\[([^\]]+)\]/g;
let noOwnerCount = 0, driftCount = 0, noBracketAtAllCount = 0;
for (const r of out.rows) {
  const brackets = [...r.owner_raw.matchAll(bracketRe)].map(m => m[1]);
  /* TWO DIFFERENT GAPS, NOT ONE. An owner cell with a bracket that resolves to nothing is "a
     row with no owner" in the row's own words. An owner cell with NO BRACKET AT ALL (prose
     only, e.g. "PEOPLE (from QUESTS' research)") is a DIFFERENT gap this script cannot check
     mechanically either way -- found the hard way: the first cut of this tool silently passed
     the Ambitions row as fine, because brackets.length === 0 made both the owner-check and the
     drift-check true-by-vacuity. A cell with nothing to search is not a cell that passed. */
  r.owner_cell_has_no_bracket_at_all = brackets.length === 0;
  if (r.owner_cell_has_no_bracket_at_all) noBracketAtAllCount++;
  r.owner_brackets = brackets.map(b => ({ label: b, board_statuses: findBracket(b) }));
  r.no_owner_found = brackets.length > 0 && r.owner_brackets.every(b => b.board_statuses.length === 0);
  if (r.no_owner_found) noOwnerCount++;
  const tableSaysNotStarted = /^NOT STARTED\b/.test(r.status_raw);
  r.drift_table_behind_board = tableSaysNotStarted
    && r.owner_brackets.some(b => b.board_statuses.includes('SHIPPED'));
  if (r.drift_table_behind_board) driftCount++;
}
out.rows_with_no_owner_anywhere_on_board = noOwnerCount;
out.rows_where_table_says_not_started_but_board_already_shows_shipped = driftCount;
out.rows_whose_owner_cell_names_no_bracket_at_all = noBracketAtAllCount;

/* THE STALENESS BASELINE. The table itself carries no per-row date, and this is the FIRST real
   check round (the table is one round old, per round one's own premise check) -- so there is no
   true "age" to report yet, only a baseline to write down for the NEXT round to diff against. */
let baseline = {};
try { baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8')); } catch (e) {}
const nowRound = out.when;
let newlyBaselined = 0;
for (const r of out.rows) {
  const key = r.section + ' :: ' + r.bb_system;
  const isNotStarted = /^NOT STARTED\b/.test(r.status_raw);
  if (isNotStarted && !baseline[key]) { baseline[key] = { first_seen_not_started: nowRound }; newlyBaselined++; }
  if (!isNotStarted && baseline[key]) delete baseline[key];   // cleared: no longer owed a staleness clock
}
fs.writeFileSync(BASELINE, JSON.stringify(baseline, null, 2));
out.baseline_rows_tracked = Object.keys(baseline).length;
out.baseline_rows_newly_added_this_round = newlyBaselined;

const bad = [];
if (out.table_claim_matches_fresh_tally === false) bad.push('TABLE CLAIM DOES NOT MATCH A FRESH COUNT');
if (noOwnerCount > 0) bad.push(noOwnerCount + ' row(s) with no owner found anywhere on the board');
if (driftCount > 0) bad.push(driftCount + ' row(s) where the table says NOT STARTED but the board already shows SHIPPED');
if (noBracketAtAllCount > 0) bad.push(noBracketAtAllCount + ' row(s) whose owner cell names no bracket at all -- cannot be checked either way');
out.findings = bad;

fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log('  controls: all green');
console.log('  fresh tally: ' + JSON.stringify(tally));
console.log('  table claims: ' + JSON.stringify(claimed) + '  (matches fresh tally: ' + out.table_claim_matches_fresh_tally + ')');
console.log('  rows with no owner anywhere on the board: ' + noOwnerCount);
console.log('  rows where the table is behind the board (NOT STARTED but board shows SHIPPED): ' + driftCount);
if (driftCount > 0) {
  for (const r of out.rows) if (r.drift_table_behind_board)
    console.log('    DRIFT: "' + r.bb_system + '" (' + r.section + ') -- table says ' + r.status_raw
      + ', owner(s) ' + JSON.stringify(r.owner_brackets));
}
if (noOwnerCount > 0) {
  for (const r of out.rows) if (r.no_owner_found)
    console.log('    NO OWNER: "' + r.bb_system + '" (' + r.section + ') -- owner cell "' + r.owner_raw + '"');
}
console.log('  rows whose owner cell names no bracket at all (cannot be checked either way): ' + noBracketAtAllCount);
if (noBracketAtAllCount > 0) {
  for (const r of out.rows) if (r.owner_cell_has_no_bracket_at_all)
    console.log('    NO BRACKET IN OWNER CELL: "' + r.bb_system + '" (' + r.section + ') -- owner cell "' + r.owner_raw + '", status "' + r.status_raw + '"');
}
console.log('  staleness baseline: tracking ' + out.baseline_rows_tracked + ' NOT STARTED row(s), '
  + newlyBaselined + ' newly added this round (none can be "older than two rounds" yet)');
process.exit(0);
