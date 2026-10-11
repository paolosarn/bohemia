/* THE TRAIL SWEEP (PLUMBER 10/10/26, row [the trail file]; rule 96, the coordinator's school round 7)
   ================================================================================
   "EVERY MARK HAS A HALF-LIFE, AND ONLY A LANE'S COMMIT RENEWS IT." The board never forgot anything:
   1,665 lines, 95 rules, a 135,000-line handoff with old July orders still steering the chats. This is the
   machine rule 96 names. It reads main's history, finds every mark (a numbered rule, a [two-word] row, a
   record or law, a handoff block), counts the coordinator's sweeps since a LANE last cited it, and writes
   records/target/BOHEMIA_TRAIL.json, one row per mark. Nothing in that file is written by hand: it is sealed.

     node tools/bohemia_trail_sweep.js              the dry run: writes the trail file, prints what WOULD move
     node tools/bohemia_trail_sweep.js --no-write   prints only

   THE CLOCK. A sweep is a coordinator commit whose subject is "VAMILY <m/d> <LETTERS>: ..." (sweep T on 10/5
   is the first in that shape; 13 by AG). History comes from a slim copy of main (commits and file names, no
   file contents, 5 MB for a month) kept in the system's temp folder and refreshed each run, because the
   working clone is shallow.
   A CITE. A commit on main, not a merge, by a lane other than the coordinator, whose message names the mark
   ("rule 89", "rules 82 and 82a", "[the pack gate]", a file's name) or, for a record or law, touches the
   file. The coordinator is every session that wrote a sweep, a "COORDINATOR ..." or a "PAOLO ..." commit.
   A commit's lane is the lane name its subject starts with (after "VAMILY: "), else the lane its session
   wrote as elsewhere, else "?" (still a cite: it is not the coordinator). Diffs are not read: a mark named
   only inside a file's text is not a cite (that would need every file's contents for a month, 500 MB).
   THE RATES (rule 96, applied as counts; strength is 0.5 per silent sweep):
     a RULE     silent 7 sweeps folds to one line; 14 leaves the front page
     a ROW      OPEN and silent 10 is STALE; 14 moves to records/BOHEMIA_EVAPORATED_ROWS.md (CLAIMED rows
                belong to rule 95's turn, listed, never moved here)
     a NOTE     the SUITE, CUT, BREAK and COOK lines keep the newest sweep only
     a RECORD   (records/*.md|txt, laws/*.md) no lane commit in 30 days AND no live file reaches it: leaves the
                canon index for archive/. "Reaches" is reachability from the roots (CLAUDE.md, the board, the
                code, the handoff blocks that stay, every recently cited record), so two dead records that
                cite each other stay dead.
     a BLOCK    the START file keeps each lane's two newest blocks; older ones, and the July-August document
                at its foot, go to handoffs/<LANE>_ARCHIVE.md
   A mark born after the oldest sweep is counted only from the sweep it was born in. STOP <mark> <sha> <why>
   in a lane commit is listed (rule 96's stop signal).

   THE MOVES (round 2) run only with the coordinator's CORRECT named:
     node tools/bohemia_trail_sweep.js --apply handoff|rules|rows|records|all --correct <sweep or sha> [--root <copy>]
   They move what the sealed trail file says (the handoff split is computed fresh: it needs no cites), skip a
   row claimed since, refuse the split while a hazard exists, and write every removed line somewhere verbatim:
   handoffs/<LANE>_ARCHIVE.md, records/BOHEMIA_EVAPORATED_<date>.md, records/BOHEMIA_EVAPORATED_ROWS.md, archive/
   with its line in gates/bohemia_superseded.txt.

   require('tools/bohemia_trail_sweep.js').{laneOf, citesIn, silentAfter, splitHandoff, seal}
   ================================================================================ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'records/target/BOHEMIA_TRAIL.json');
const CACHE = path.join(os.tmpdir(), 'bohemia_trail_history.git');
const DAYS = 45;            /* history kept: the records' 30 days and room for fourteen sweeps */
const RATES = { ruleFold: 7, ruleLeave: 14, rowStale: 10, rowGone: 14, recordDays: 30, blocksKept: 2 };

/* ---- the lanes, as their commits spell them (longest first) ---------------------------------- */
const LANES = [
  ['EYES AND EARS', 'EYES AND EARS'], ['EYES & EARS', 'EYES AND EARS'], ['LIFE + CITY', 'LIFE + CITY'],
  ['LIFE+CITY', 'LIFE + CITY'], ['COMBAT TWO', 'COMBAT TWO'], ['COMBAT 2', 'COMBAT TWO'], ['COMBAT2', 'COMBAT TWO'],
  ['COOK THREE', 'COOK THREE'], ['COOK FOUR', 'COOK FOUR'], ['COOK TWO', 'COOK TWO'], ['COOK 2', 'COOK TWO'],
  ['COOK 3', 'COOK THREE'], ['COOK 4', 'COOK FOUR'], ['COOK2', 'COOK TWO'], ['COOK3', 'COOK THREE'], ['COOK4', 'COOK FOUR'],
  ['RUN TWO', 'RUN TWO'], ['RUN 2', 'RUN TWO'], ['ANIMATION', 'ANIMATION'], ['CHARACTER', 'CHARACTER'],
  ['DIRECTION', 'DIRECTION'], ['FACTIONS', 'FACTIONS'], ['PORTRAIT', 'PORTRAIT'], ['ECONOMY', 'ECONOMY'],
  ['DYNASTY', 'DYNASTY'], ['PLUMBER', 'PLUMBER'], ['QUESTS', 'QUESTS'], ['SOUNDS', 'SOUNDS'], ['SOUND', 'SOUNDS'],
  ['PEOPLE', 'PEOPLE'], ['TUNING', 'TUNING'], ['COMBAT', 'COMBAT'], ['WORDS', 'WORDS'], ['WORLD', 'WORLD'],
  ['MUSIC', 'SOUNDS'], ['EYES', 'EYES AND EARS'], ['COOK', 'COOK'], ['MODS', 'MODS'], ['CITY', 'LIFE + CITY'],
  ['RUN', 'RUN'], ['SFX', 'SOUNDS'], ['UI', 'UI'],
];
/* handoff head names that are a lane under another name, and names that are no lane any more */
const HEAD_ALIAS = { SOUND: 'SOUNDS', MUSIC: 'SOUNDS', SFX: 'SOUNDS', CITY: 'LIFE + CITY', ART: 'DIRECTION', COORDINATOR: 'COORDINATOR', LAB: 'LAB' };   /* LAB: retired 9/4, every block of it is history */   /* ART (art-f3eu53) is the art director's old name */

function laneOf(subject) {
  const s = String(subject).replace(/^VAMILY(?: \d+\/\d+[a-z]?)?:\s*/, '').trim();
  for (const [name, lane] of LANES) {
    if (s.startsWith(name) && !/[A-Za-z0-9]/.test(s.charAt(name.length))) return lane;
  }
  return null;
}

/* the marks a message names: rule numbers (a sub-rule 22f is rule 22), [labels], file names */
function citesIn(msg) {
  const rules = new Set(), labels = new Set(), files = new Set(), stops = [];
  for (const m of msg.matchAll(/\brules?[\s-]+((?:\d{1,3}[a-z]?)(?:(?:\s*,\s*|\s+and\s+|\s*&\s*|\s*\/\s*|\s+or\s+)\d{1,3}[a-z]?)*)/gi)) {
    for (const n of m[1].match(/\d{1,3}/g)) rules.add(+n);
  }
  for (const m of msg.matchAll(/\[([^\[\]\n]{2,48})\]/g)) labels.add(m[1].toLowerCase().trim());
  for (const m of msg.matchAll(/([A-Za-z0-9_.\-]+\.(?:md|txt))\b/g)) files.add(m[1]);
  for (const m of msg.matchAll(/\bSTOP\s+(rule\s+\d+|\[[^\]]+\]|[A-Za-z0-9_.\/-]+\.(?:md|txt))\s+([0-9a-f]{7,40})\s+([^\n]{3,120})/g)) stops.push({ mark: m[1], sha: m[2], why: m[3].trim() });
  return { rules, labels, files, stops };
}

/* sweeps strictly after time t (sweeps sorted by time) */
const silentAfter = (sweeps, t) => sweeps.filter(s => s.t > t).length;

const git = (args, opts = {}) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'], ...opts });

/* ---- history: a slim copy of main, a month and a half deep ------------------------------------- */
function history(log) {
  const since = new Date(Date.now() - DAYS * 86400e3).toISOString().slice(0, 10);
  let dir = CACHE, note = '';
  try {
    const url = git(['remote', 'get-url', 'origin']).trim();
    if (!fs.existsSync(path.join(CACHE, 'HEAD'))) {
      git(['clone', '-q', '--bare', '--filter=blob:none', '--shallow-since=' + since, '--single-branch', '--branch', 'main', url, CACHE]);
    } else {
      git(['--git-dir=' + CACHE, 'fetch', '-q', '--filter=blob:none', '--shallow-since=' + since, 'origin', '+refs/heads/main:refs/heads/main']);
    }
  } catch (e) {
    dir = null; note = 'the slim copy could not be fetched (' + String(e.message).split('\n')[0].slice(0, 80) + '); reading the working clone, which is shallow';
  }
  const G = dir ? ['--git-dir=' + dir] : [];
  const ref = dir ? 'main' : 'HEAD';
  const raw = git([...G, 'log', ref, '--no-merges', '--name-only', '--no-renames',
    '--format=%x1e%H%x1f%ct%x1f%(trailers:key=Claude-Session,valueonly,separator=)%x1f%B%x1f']);
  const commits = [];
  for (const rec of raw.split('\x1e')) {
    if (!rec.trim()) continue;
    const f = rec.split('\x1f');
    commits.push({ sha: f[0], t: +f[1], session: f[2].trim(), msg: f[3], subject: f[3].split('\n')[0], files: (f[4] || '').split('\n').filter(Boolean) });
  }
  commits.sort((a, b) => a.t - b.t);
  if (log && note) log(note);
  return { commits, G, ref, oldest: commits.length ? commits[0].t : 0, note };
}

/* ---- the handoff, cut into blocks -------------------------------------------------------------- */
const SLUG = '[a-z0-9]+(?:-[a-z0-9]+)+|[a-z0-9]{5,}';
const HEAD_RE = new RegExp('^([A-Z][A-Z0-9 +\\/&-]*?)\\s*\\((?:' + SLUG + ')\\):\\s+\\S');
function splitHandoff(text, laneNames) {
  const known = new Set([...laneNames, ...Object.keys(HEAD_ALIAS)]);
  const lines = text.split('\n'), blocks = [];
  let cur = null;
  const open = (lane, i, legacy) => { cur = { lane, start: i, end: i, legacy: !!legacy }; blocks.push(cur); };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    let m = l.match(HEAD_RE), lane = null;
    if (m && known.has(m[1].trim())) lane = m[1].trim();
    else if ((m = l.match(/^## ([A-Z][A-Z +&-]*?) (?:\(|--)/)) && laneNames.has(m[1].trim())) lane = m[1].trim();
    else if ((m = l.match(/^=== ([A-Z][A-Z +&-]*?): .*\(\d+\/\d+/)) && laneNames.has(m[1].trim())) lane = m[1].trim();   /* COOK FOUR's shape */
    if (lane) open(HEAD_ALIAS[lane] || lane, i, false);
    else if (/^# /.test(l)) open('LEGACY', i, true);          /* the July-August document at the foot */
    else if (!cur) open('LEGACY', i, true);
    cur.end = i;
  }
  /* rank within a lane by position: lanes write above their own last block, so first is newest */
  const seen = {};
  for (const b of blocks) { b.rank = seen[b.lane] = (seen[b.lane] || 0) + 1; b.lines = b.end - b.start + 1; }
  for (const b of blocks) b.keep = !b.legacy && laneNames.has(b.lane) && b.rank <= RATES.blocksKept;
  /* THE HAZARD: the lanes do not all write one head shape (=== COOK FOUR ..., - RUN TWO 10/10 ..., *** [label]
     SHIPPED (COMBAT 10/9 ..., ROUND LOG 10/10c ...). Such a line sits inside whatever block is above it, so a
     move would file one lane's current state in another lane's archive. A line in a moving block that names a
     lane and a date of the last three days is a hazard; the split is not applied while any exists. */
  const recent = [0, 1, 2].map(d => { const x = new Date(Date.now() - d * 86400e3); return (x.getMonth() + 1) + '/' + x.getDate(); });
  const dateRe = new RegExp('(^|[^0-9/])(' + recent.map(r => r.replace('/', '\\/')).join('|') + ')(?![0-9])');
  const nameRe = new RegExp('^(?:=+ |- |\\*+ |#+ |ROUND LOG )?(' + [...known].sort((a, b) => b.length - a.length).map(n => n.replace(/[+]/g, '\\+')).join('|') + ')(?=\\s*(?:\\(|:|--|- |\\d{1,2}\\/\\d{1,2}))');   /* head-shaped: 'RUN TWO had marked' is prose */
  for (const b of blocks) {
    if (b.keep) continue;
    b.hazards = [];
    for (let i = b.start; i <= b.end; i++) {
      if (i === b.start) continue;                       /* its own head is what makes it a block */
      const l = lines[i].slice(0, 90), d = l.match(dateRe), n = l.match(nameRe);
      if (d && n) b.hazards.push(   /* its own lane too: a block that is not old is not history */{ line: i + 1, lane: HEAD_ALIAS[n[1]] || n[1], text: lines[i].slice(0, 70) });
    }
  }
  return { lines, blocks };
}

function seal(rows) { return crypto.createHash('sha256').update('bohemia_trail_sweep\n' + rows.join('\n')).digest('hex').slice(0, 16); }

/* a lane on HOLD, PAUSED or PARKED is not running: its rows' clock stops (rule 96 as amended at sweep AH). The modes
   rule 88 and rule 100 narrow count too (a capital HOLD anywhere in the live mode, LOOK ROWS ONLY, COOK ONLY, LOOKS
   FIRST): such a lane may not work most of its rows, so they cannot be read as forgotten. '(was: MODE: HOLD ...)' is
   the mode a lane left, not the one it is in. */
function heldOf(b) {
  const o = new Set(); let sec = null;
  for (const l of b.split('\n')) {
    const h = l.match(/^## ([A-Z][A-Z +&]*?)\s+\(/) || l.match(/^## ([A-Z][A-Z +&]*?)\s*$/); if (h) { sec = h[1].trim(); continue; }
    if (sec && /^MODE:/.test(l)) { const live = l.split('(was:')[0];
      if (/^MODE:\s*(PAUSED|PARKED|HOLD)\b/i.test(live) || /\bHOLD\b|LOOK ROWS ONLY|COOK ONLY|LOOKS FIRST/.test(live)) o.add(sec); sec = null; }
  }
  return o;
}
/* HEARBACK, sweep AI (NEGATIVE): the manual (rules 0 to 13) and every rule that carries his words never leave the page;
   at 14 silent sweeps they fold to one line and stop there. Only a coordinator rule with no quote of his leaves. Read
   conservatively: a protected rule waits for 14 before it folds at all. */
function ruleAction(n, text, silent) {
  const folded = /folded to one line/i.test(text), paolo = /\bPaolo\b|\bPAOLO\b|his words/.test(text);
  const kept = n <= 13 || paolo;
  const action = kept ? (silent >= RATES.ruleLeave && !folded ? 'FOLDS TO ONE LINE (the manual or his words: never leaves)' : '')
    : silent >= RATES.ruleLeave ? 'LEAVES THE PAGE (lives in its record)' : silent >= RATES.ruleFold && !folded ? 'FOLDS TO ONE LINE' : '';
  return { action, folded, paolo };
}

/* ---- the sweep --------------------------------------------------------------------------------- */
function sweep({ write = true, log = console.log } = {}) {
  const H = history(log);
  const { commits } = H;
  const sweeps = [];
  for (const c of commits) { const m = c.subject.match(/^VAMILY (\d+\/\d+) ([A-Z]{1,2})[:,]/);
    /* a second commit under the same letter (a sweep's own fix-up) is the same sweep */
    if (m && !(sweeps.length && sweeps[sweeps.length - 1].letter === m[2])) sweeps.push({ letter: m[2], date: m[1], sha: c.sha.slice(0, 7), t: c.t, full: c.sha }); }
  const coordSessions = new Set();
  for (const c of commits) if (c.session && (/^VAMILY \d+\/\d+ [A-Z]{1,2}[:,]/.test(c.subject) || /^(COORDINATOR|PAOLO)\b/.test(c.subject))) coordSessions.add(c.session);
  const sessionLane = {};
  for (const c of commits) { const l = laneOf(c.subject); if (l && c.session && !coordSessions.has(c.session)) sessionLane[c.session] = l; }
  const lane = (c) => (c.session && coordSessions.has(c.session)) || (!c.session && /^(VAMILY \d+\/\d+ [A-Z]{1,2}[:,]|COORDINATOR|PAOLO)\b/.test(c.subject)) ? 'COORDINATOR'
    : laneOf(c.subject) || sessionLane[c.session] || '?';
  const laneCommits = commits.map(c => ({ ...c, lane: lane(c) })).filter(c => c.lane !== 'COORDINATOR');
  const sweepOf = (t) => { const s = sweeps.find(x => x.t > t); return s ? 'before ' + s.letter : 'after ' + (sweeps.length ? sweeps[sweeps.length - 1].letter : '-'); };

  /* the board now, and when each rule and row was born (the first sweep's board that carries it) */
  const board = fs.readFileSync(path.join(ROOT, 'VAMILY.md'), 'utf8');
  const fp = board.indexOf('## READ THIS FRONT PAGE'), fpEnd = board.indexOf('\n## THE TWENTY CHATS');
  const rulesOf = (b) => { const a = b.indexOf('## READ THIS FRONT PAGE'), z = b.indexOf('\n## THE TWENTY CHATS'); const o = new Map();
    for (const m of b.slice(a, z > a ? z : undefined).matchAll(/^(\d{1,3})\.\s+(.*)$/gm)) if (!o.has(+m[1])) o.set(+m[1], m[2]); return o; };
  const ROW_RE = /^- (OPEN|CLAIMED|SHIPPED|NOTE|MOVED)\b.*?\s\s\[([^\]]{2,48})\]/;
  const rowsOf = (b) => { const o = new Map(); let sec = null;
    for (const l of b.split('\n')) { const h = l.match(/^## ([A-Z][A-Z +&]*?)\s+\(/) || l.match(/^## ([A-Z][A-Z +&]*?)\s*$/); if (h) sec = h[1].trim();
      const m = l.match(ROW_RE); if (m && sec) { const k = m[2].toLowerCase().trim(); if (!o.has(k)) o.set(k, { status: m[1], lane: sec, line: l }); } } return o; };
  const rules = rulesOf(board), rows = rowsOf(board), heldNow = heldOf(board);
  const laneNames = new Set([...board.matchAll(/^## ([A-Z][A-Z +&]*?)\s{2}\(/gm)].map(m => m[1].trim()).concat(['COORDINATOR']));
  /* births and status history from the boards of the last fifteen sweeps: a mark already on the oldest of
     them is older than every threshold (14), so older boards change nothing. Read from the working clone when
     it holds the commit (no network), else from the slim copy. */
  const bornRule = new Map(), bornRow = new Map(), openSince = new Map(), heldAt = [];
  const K0 = Math.max(0, sweeps.length - 15);
  const showBoard = (sha) => { try { return git(['show', sha + ':VAMILY.md']); } catch (e) { try { return git([...H.G, 'show', sha + ':VAMILY.md']); } catch (e2) { return null; } } };
  for (let k = K0; k < sweeps.length; k++) {
    const b = showBoard(sweeps[k].full); if (b == null) continue;
    const born = k === K0 ? 0 : k;                       /* on the oldest board read: born at or before the window */
    heldAt[k] = heldOf(b);
    for (const n of rulesOf(b).keys()) if (!bornRule.has(n)) bornRule.set(n, born);
    const R = rowsOf(b);
    for (const [r, v] of R) { if (!bornRow.has(r)) bornRow.set(r, born);
      if (v.status !== 'OPEN') openSince.delete(r); else if (!openSince.has(r)) openSince.set(r, born); }
    for (const r of [...openSince.keys()]) if (!R.has(r)) openSince.delete(r);
  }
  /* cites */
  const ruleCite = new Map(), rowCite = new Map(), fileCite = new Map(), stops = [];
  const add = (map, key, c) => { const e = map.get(key) || { last: null, lanes: new Set() }; if (!e.last || c.t > e.last.t) e.last = c; e.lanes.add(c.lane); map.set(key, e); };
  for (const c of laneCommits) {
    const x = citesIn(c.msg);
    for (const n of x.rules) add(ruleCite, n, c);
    for (const l of x.labels) add(rowCite, l, c);
    for (const f of x.files) add(fileCite, f, c);
    for (const f of c.files) if (/^(records|laws)\/[^/]+\.(md|txt)$/.test(f)) add(fileCite, path.basename(f), c);
    for (const s of x.stops) stops.push({ ...s, lane: c.lane, by: c.sha.slice(0, 7) });
  }
  const N = sweeps.length;
  const silentOf = (e, born) => {
    const fromBirth = born === undefined ? 0 : N - born;           /* on no sweep's board yet: born after the last sweep, silent for none */
    return Math.min(fromBirth, e && e.last ? silentAfter(sweeps, e.last.t) : N);
  };
  const strength = (s) => +Math.pow(0.5, s).toFixed(4);
  const lastOf = (e) => e && e.last ? e.last.sha.slice(0, 7) + ' ' + e.last.lane + ' ' + sweepOf(e.last.t) : null;
  const marks = [];

  /* RULES */
  for (const [n, text] of rules) {
    /* a rule is named by its number or by the law and record files it points to (rule 96: 'a file path') */
    let e = ruleCite.get(n);
    for (const f of new Set([...text.matchAll(/(?:laws|records)\/([A-Za-z0-9_.\-]+\.(?:md|txt))/g)].map(m => m[1]))) {
      const fe = fileCite.get(f); if (!fe) continue;
      e = e ? { last: fe.last.t > e.last.t ? fe.last : e.last, lanes: new Set([...e.lanes, ...fe.lanes]) } : fe;
    }
    const s = silentOf(e, bornRule.get(n));
    const { action, folded, paolo } = ruleAction(n, text, s);
    marks.push({ kind: 'rule', id: 'rule ' + n, title: text.replace(/\s+/g, ' ').slice(0, 70), silent: s, strength: strength(s), last_cite: lastOf(e), lanes: e ? [...e.lanes].sort() : [], folded, quotes_paolo: paolo, action });
  }
  /* ROWS */
  for (const [k, r] of rows) {
    const e = rowCite.get(k), s = silentOf(e, bornRow.get(k));
    let action = '';
    const so = r.status === 'OPEN' ? (openSince.has(k) ? N - openSince.get(k) : 0) : null;   /* sweeps it has sat OPEN */
    /* the row's clock: sweeps after its last cite, since it was born and since it last went OPEN, in which its lane
       was running (rule 96 as amended at AH: the hold pauses the clock, and a held lane's rows never evaporate) */
    const startIdx = Math.max(bornRow.has(k) ? bornRow.get(k) : N, openSince.has(k) ? openSince.get(k) : (r.status === 'OPEN' ? N : 0));
    const citeT = e && e.last ? e.last.t : -Infinity;
    const sOpen = sweeps.filter((sw, i) => i >= startIdx && sw.t > citeT && !(heldAt[i] && heldAt[i].has(r.lane))).length;
    const held = heldNow.has(r.lane);
    if (r.status === 'OPEN' && !held) action = sOpen >= RATES.rowGone ? 'MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md' : sOpen >= RATES.rowStale ? 'STALE' : '';
    marks.push({ kind: 'row', id: '[' + k + ']', lane: r.lane, status: r.status, silent: s, open_sweeps: so, running_silent: r.status === 'OPEN' ? sOpen : null, held, strength: strength(s), last_cite: lastOf(e), lanes: e ? [...e.lanes].sort() : [], action });
  }
  /* THE FLOOR (rule 74, Paolo 10/4: 'they don't have jobs'): a running lane keeps at least three OPEN rows, so a row
     whose move would leave its lane under three stays, the least silent first. Rule 96 does not ask the board to break
     rule 74; this keeps both. */
  const openBy = {};
  for (const m of marks) if (m.kind === 'row' && m.status === 'OPEN') (openBy[m.lane] = openBy[m.lane] || []).push(m);
  for (const [, ms] of Object.entries(openBy)) {
    const moving = ms.filter(m => /MOVES/.test(m.action)).sort((x, y) => x.running_silent - y.running_silent);
    let room = ms.length - moving.length - 3;                     /* OPEN rows that stay, against the floor of three */
    for (const m of moving) { if (room >= 0) break; m.action = ''; m.floor = 'kept: its lane\'s third OPEN row (rule 74)'; room++; }
  }
  /* NOTES */
  for (const name of ['THE SUITE LINE', 'THE CUT LINE', 'THE BREAK LIST', 'THE COOK LINE']) {
    const i = board.indexOf('\n' + name); if (i < 0) continue;
    const line = board.slice(i + 1, board.indexOf('\n', i + 1));
    const letters = [...new Set([...line.matchAll(/\bsweeps? ([A-Z]{1,2})\b/g)].map(m => m[1]))];
    marks.push({ kind: 'note', id: name, sweeps_held: letters.length, letters, action: letters.length > 1 ? 'KEEPS THE NEWEST SWEEP ONLY (' + letters.length + ' held)' : '' });
  }

  /* HANDOFF BLOCKS */
  const START = path.join(ROOT, '00_START_HERE_NEXT_SESSION.md');
  const ho = splitHandoff(fs.readFileSync(START, 'utf8'), laneNames);
  for (const b of ho.blocks) marks.push({ kind: 'block', id: b.lane + ' #' + b.rank, line: b.start + 1, lines: b.lines, head: ho.lines[b.start].slice(0, 40), hazards: b.hazards && b.hazards.length ? b.hazards.map(h => h.line + ' ' + h.lane) : undefined, action: b.keep ? '' : 'MOVES TO handoffs/' + b.lane.replace(/[^A-Z0-9]+/g, '_') + '_ARCHIVE.md' });

  /* RECORDS AND LAWS: a lane's cite in 30 days, or reached from the roots */
  const now = Math.floor(Date.now() / 1000), cutoff = now - RATES.recordDays * 86400;
  const files = [];
  for (const d of ['records', 'laws']) for (const f of fs.readdirSync(path.join(ROOT, d))) if (/\.(md|txt)$/.test(f) && (d === 'laws' ? /\.md$/.test(f) : true)) files.push(d + '/' + f);
  const fileSet = new Map(files.map(f => [path.basename(f), f]));
  const candidates = new Set(files.filter(f => { const e = fileCite.get(path.basename(f)); return !(e && e.last && e.last.t >= cutoff); }));
  /* who names whom: every live text file outside archive, the generated canon index and this file excluded */
  const refs = new Map();
  let rgOut = '';
  try {
    rgOut = execFileSync('rg', ['-o', '--no-line-number', '--with-filename', '--no-messages',   /* not -I: in ripgrep that drops the file name */
      '-g', '!archive/**', '-g', '!handoffs/**', '-g', '!.git/**', '-g', '!BOHEMIA_CANON_INDEX.md', '-g', '!00_START_HERE_NEXT_SESSION.md',
      '-g', '!records/target/BOHEMIA_TRAIL.json', '-g', '!records/BOHEMIA_EVAPORATED*', '-g', '!*.{png,jpg,jpeg,webp,gif,ogg,wav,mp3,m4a,glb,bin,zip}',
      '-e', '[A-Za-z0-9_.-]+\\.(md|txt)', '.'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 30 });
  } catch (e) { rgOut = e.stdout || ''; }
  for (const l of rgOut.split('\n')) {
    const i = l.indexOf(':'); if (i < 0) continue;
    const from = l.slice(0, i).replace(/^\.\//, ''), to = path.basename(l.slice(i + 1));
    if (!fileSet.has(to) || fileSet.get(to) === from) continue;
    if (!refs.has(from)) refs.set(from, new Set()); refs.get(from).add(to);
  }
  /* the START file counts only for the blocks that stay */
  const kept = ho.blocks.filter(b => b.keep).map(b => ho.lines.slice(b.start, b.end + 1).join('\n')).join('\n');
  refs.set('00_START_HERE_NEXT_SESSION.md (kept blocks)', new Set([...kept.matchAll(/[A-Za-z0-9_.-]+\.(?:md|txt)/g)].map(m => path.basename(m[0])).filter(b => fileSet.has(b))));
  const alive = new Set();
  const queue = [];
  for (const [from, tos] of refs) if (!candidates.has(from)) for (const t of tos) if (candidates.has(fileSet.get(t)) && !alive.has(fileSet.get(t))) { alive.add(fileSet.get(t)); queue.push(fileSet.get(t)); }
  while (queue.length) { const f = queue.pop(); for (const t of refs.get(f) || []) { const g = fileSet.get(t); if (candidates.has(g) && !alive.has(g)) { alive.add(g); queue.push(g); } } }
  for (const f of files) {
    const e = fileCite.get(path.basename(f));
    const cited = !candidates.has(f), reached = alive.has(f);
    const s = silentOf(e, 0);                                      /* a file's age is not read: counted from the window's start */
    marks.push({ kind: f.startsWith('laws/') ? 'law' : 'record', id: f, silent: s, strength: strength(s), last_cite: lastOf(e), lanes: e ? [...e.lanes].sort() : [],
      days: e && e.last ? Math.floor((now - e.last.t) / 86400) : null, reached: cited ? null : reached, action: cited || reached ? '' : 'LEAVES THE CANON INDEX FOR archive/' });
  }

  /* the file: one mark a line, so a sweep's diff reads */
  /* empty fields are left out: the file is published with the site and rewritten every VAMILY */
  const slim = (m) => Object.fromEntries(Object.entries(m).filter(([, v]) => !(v === '' || v === null || v === undefined || v === false || (Array.isArray(v) && !v.length))));
  const rowsOut = marks.map(m => JSON.stringify(slim(m)));
  const head = git(['rev-parse', '--short', 'HEAD']).trim();
  const meta = {
    _readme: 'THE TRAIL FILE (rule 96). Written by tools/bohemia_trail_sweep.js at every VAMILY, never by hand: the seal is a hash of the marks, a hand edit breaks it. One row per mark: silent = sweeps since a lane last cited it (from its birth if younger), strength = 0.5 per silent sweep, action = what the rates say (the dry run moves nothing).',
    made: new Date().toISOString(), head, history: { commits: commits.length, lane_commits: laneCommits.length, since: new Date(H.oldest * 1000).toISOString().slice(0, 10), note: H.note || '' },
    sweeps: sweeps.map(s => s.letter + ' ' + s.date + ' ' + s.sha), rates: RATES, stops, seal: seal(rowsOut),
    pace: (() => { const wk = sweeps.filter(x => x.t >= now - 7 * 86400).length; return { sweeps_last_7_days: wk, days_per_14_sweeps: wk ? +(14 * 7 / wk).toFixed(1) : null }; })(),
  };
  const json = '{\n' + Object.entries(meta).map(([k, v]) => ' ' + JSON.stringify(k) + ': ' + JSON.stringify(v)).join(',\n') + ',\n "marks": [\n  ' + rowsOut.join(',\n  ') + '\n ]\n}\n';
  if (write) fs.writeFileSync(OUT, json);
  return { meta, marks, sweeps, blocks: ho.blocks, lanesUnknown: laneCommits.filter(c => c.lane === '?').length, laneCommits: laneCommits.length };
}

function report(r) {
  const out = [];
  const say = (s) => out.push(s);
  const k = (kind) => r.marks.filter(m => m.kind === kind);
  say('THE TRAIL SWEEP (rule 96), DRY RUN: nothing moves until the coordinator answers CORRECT');
  say('  THE PACE: ' + r.meta.pace.sweeps_last_7_days + ' sweeps in the last 7 days, so 14 silent sweeps is ' + r.meta.pace.days_per_14_sweeps + ' days and 7 is ' + (r.meta.pace.days_per_14_sweeps / 2).toFixed(1) + '. The rates are counted in sweeps (rule 96); read every list below with that in mind.');
  say('  the clock: ' + r.sweeps.length + ' sweeps (' + (r.sweeps[0] ? r.sweeps[0].letter : '-') + ' to ' + (r.sweeps.length ? r.sweeps[r.sweeps.length - 1].letter : '-') + '); '
    + r.meta.history.commits + ' commits since ' + r.meta.history.since + ', ' + r.laneCommits + ' by lanes (' + r.lanesUnknown + ' with no lane name, counted as lanes)');
  const rules = k('rule'), fold = rules.filter(m => /FOLDS/.test(m.action)), leave = rules.filter(m => /LEAVES/.test(m.action));
  say('  RULES: ' + rules.length + ' on the front page; ' + fold.length + ' fold to one line, ' + leave.length + ' leave the page; ' + rules.filter(m => m.folded).length + ' already folded');
  for (const m of fold.concat(leave)) say('    ' + m.id + ' (silent ' + m.silent + '): ' + m.action + ' -- ' + m.title.slice(0, 50));
  const rows = k('row'), open = rows.filter(m => m.status === 'OPEN');
  const stale = open.filter(m => m.action === 'STALE'), gone = open.filter(m => /MOVES/.test(m.action));
  say('  ROWS: ' + rows.length + ' labelled rows, ' + open.length + ' OPEN; ' + stale.length + ' STALE, ' + gone.length + ' move out');
  for (const m of stale.concat(gone)) say('    ' + m.id + ' ' + m.lane + ' (silent ' + m.silent + '): ' + m.action);
  for (const m of k('note')) if (m.action) say('  NOTE ' + m.id + ': ' + m.action);
  const blocks = k('block'), moving = blocks.filter(m => m.action), lines = moving.reduce((a, m) => a + m.lines, 0), all = blocks.reduce((a, m) => a + m.lines, 0);
  const hz = blocks.filter(m => m.hazards);
  const hzLanes = {}; for (const m of hz) for (const h of m.hazards) hzLanes[h.split(' ').slice(1).join(' ')] = (hzLanes[h.split(' ').slice(1).join(' ')] || 0) + 1;
  say('  HANDOFF: ' + blocks.length + ' blocks, ' + all + ' lines; ' + moving.length + ' blocks (' + lines + ' lines) move to handoffs/<LANE>_ARCHIVE.md; the START file keeps ' + (all - lines) + ' lines, two blocks a lane');
  if (!hz.length) say('    SAFE TO SPLIT: no moving block holds a lane\'s head-shaped line of the last three days.');
  else say('    NOT SAFE TO SPLIT YET: ' + hz.length + ' moving blocks hold ' + Object.values(hzLanes).reduce((a, b) => a + b, 0) + ' lane lines dated in the last three days ('
    + Object.entries(hzLanes).sort((a, b) => b[1] - a[1]).map(([l, n]) => l + ' ' + n).join(', ') + '): those lanes write heads the split cannot see, so their newest state would leave the START file, some of it under another lane\'s archive.');
  const recs = r.marks.filter(m => m.kind === 'record' || m.kind === 'law'), out2 = recs.filter(m => m.action);
  say('  RECORDS AND LAWS: ' + recs.length + '; ' + recs.filter(m => m.reached === null).length + ' named by a lane in 30 days, ' + recs.filter(m => m.reached === true).length
    + ' reached from a live file, ' + out2.length + ' leave the canon index (' + out2.filter(m => m.kind === 'law').length + ' laws, ' + out2.filter(m => m.kind === 'record').length + ' records)');
  if (r.meta.stops.length) say('  STOP signals: ' + r.meta.stops.map(s => s.mark + ' by ' + s.lane + ' ' + s.by).join('; '));
  say('  the trail file: records/target/BOHEMIA_TRAIL.json, ' + r.marks.length + ' marks, seal ' + r.meta.seal);
  return out.join('\n');
}

/* ---- THE MOVES (round 2). Pure functions, text in and text out, so the gate proves them on planted copies;
   the command line runs them only with the coordinator's CORRECT named (--correct <sweep letter or sha>). ---- */
const archiveName = (lane) => 'handoffs/' + lane.replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '') + '_ARCHIVE.md';

/* the START file keeps each lane's two newest blocks; the rest go, newest first, to the lane's archive, in front
   of whatever an earlier move already put there. Refused while a hazard exists. */
function applyHandoff(text, laneNames, existing = {}, date = '') {
  const h = splitHandoff(text, laneNames);
  const hazards = h.blocks.filter(b => b.hazards && b.hazards.length);
  if (hazards.length) return { refused: hazards.length + ' moving block(s) hold a lane\'s line of the last three days: ' + hazards.map(b => b.lane + ' #' + b.rank + ' line ' + b.hazards[0].line).join(', ') };
  const keep = [], moved = {};
  for (const b of h.blocks) {
    const body = h.lines.slice(b.start, b.end + 1).join('\n');
    if (b.keep) keep.push(body); else (moved[archiveName(b.lane)] = moved[archiveName(b.lane)] || []).push(body);
  }
  const archives = {};
  for (const [f, bodies] of Object.entries(moved)) {
    const head = '# ' + path.basename(f, '.md').replace(/_/g, ' ') + ' (rule 96: the blocks older than the lane\'s two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)\n\n';
    const old = existing[f] ? existing[f].replace(/^# [^\n]*\n\n/, '') : '';
    archives[f] = head + (date ? '<!-- moved ' + date + ' -->\n' : '') + bodies.join('\n') + (old ? '\n' + old : '\n');
  }
  return { start: keep.join('\n') + (text.endsWith('\n') ? '\n' : ''), archives, kept: keep.length, moved: Object.values(moved).reduce((a, x) => a + x.length, 0) };
}

/* a rule's lines: its "N. " line and the indented lines under it */
function ruleSpan(lines, n) {
  const i = lines.findIndex(l => l.startsWith(n + '. '));
  if (i < 0) return null;
  let j = i + 1; while (j < lines.length && /^\s+\S/.test(lines[j])) j++;
  return [i, j];
}
/* FOLDS: the rule becomes one line with its pointer; LEAVES: the rule leaves the page. Its full text goes to the
   evaporated record either way, verbatim; a leaving rule that quotes Paolo gets its registry line. */
function applyRules(board, actions, date, evaporated) {
  const lines = board.split('\n'), out = [], registry = [];
  const done = [];
  for (const a of actions.slice().sort((x, y) => y.n - x.n)) {
    const sp = ruleSpan(lines, a.n); if (!sp) continue;
    const full = lines.slice(sp[0], sp[1]).join('\n');
    if (/folded to one line/i.test(full) && a.fold) continue;
    const body = full.replace(/^\d+\.\s+/, '').replace(/\s*\n\s+/g, ' ');
    const title = body.split(/ \(|: |\. /)[0].slice(0, 90);
    const files = [...new Set([...full.matchAll(/(?:laws|records)\/[A-Za-z0-9_.\-]+\.(?:md|txt)/g)].map(m => m[0]))];
    const pointer = (files.length ? files.join(' and ') + ', and ' : '') + evaporated;
    out.push('### rule ' + a.n + (a.fold ? ' (folded ' : ' (left the page ') + date + ', rule 96: no lane named it for ' + a.silent + ' sweeps)\n' + full + '\n');
    if (a.fold) lines.splice(sp[0], sp[1] - sp[0], a.n + '. ' + title + ' (folded to one line ' + date + ' by rule 96: no lane named it for ' + a.silent + ' sweeps; the full text is ' + pointer + ').');
    else {
      lines.splice(sp[0], sp[1] - sp[0]);
      if (a.paolo) for (const f of files.filter(f => f.startsWith('laws/'))) registry.push(path.basename(f) + ' | rule ' + a.n + ' left the front page ' + date + ' (rule 96: no lane named it for ' + a.silent + ' sweeps); the law file stays in laws/, its board text is in ' + evaporated);
    }
    done.push(a.n);
  }
  return { board: lines.join('\n'), evaporatedText: out.reverse().join('\n'), registry, done };
}

/* OPEN rows: STALE gets the word; a row past the second rate leaves the board as one line */
function applyRows(board, actions, date) {
  const lines = board.split('\n'), gone = [], done = [];
  for (const a of actions) {
    const i = lines.findIndex(l => /^- OPEN\b/.test(l) && l.toLowerCase().includes('  [' + a.label + ']'));
    if (i < 0) continue;                                   /* claimed or rewritten since the trail was written: not touched */
    if (a.stale) { if (!/\(STALE /.test(lines[i])) { lines[i] = lines[i].replace(/^- OPEN\s+/, '- OPEN  (STALE ' + date + ' by rule 96: no lane named it for ' + a.silent + ' sweeps)  '); done.push(a.label); } }
    else { gone.push('- ' + date + ' rule 96, silent ' + a.silent + ' sweeps, ' + a.lane + ': ' + lines[i].replace(/^- /, '')); lines.splice(i, 1); done.push(a.label); }
  }
  return { board: lines.join('\n'), gone, done };
}

/* records that leave the canon: the move list and their registry lines (the command line runs git mv) */
function planRecords(actions, date) {
  return actions.map(a => ({ from: a.id, to: 'archive/' + path.basename(a.id),
    registry: path.basename(a.id) + ' | archive/, ' + date + ' by rule 96: no lane named it for 30 days and no live file reaches it (last cite ' + (a.last_cite || 'none in 45 days') + ')' }));
}

/* the trail file as written, checked against its seal: the moves are what the coordinator read */
function readTrail(file = OUT) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n'), a = lines.indexOf(' "marks": ['), z = lines.lastIndexOf(' ]');
  const rows = lines.slice(a + 1, z).map(l => l.trim().replace(/,$/, ''));
  const stored = (text.match(/"seal": "([0-9a-f]+)"/) || [])[1];
  if (stored !== seal(rows)) throw new Error('the trail file\'s seal does not match its marks: re-run the sweep, never edit it');
  return { marks: rows.map(r => JSON.parse(r)), head: (text.match(/"head": "([0-9a-f]+)"/) || [])[1] };
}

function applyAll(kind, correct, { root = ROOT } = {}) {
  if (!correct) throw new Error('THE COORDINATOR\'S CORRECT IS THE PREMISE: the row says the first run is a dry run the coordinator reads. Name it: --correct <sweep letter or sha>.');
  const d = new Date(), date = (d.getMonth() + 1) + '/' + d.getDate(), stamp = (d.getMonth() + 1) + '_' + d.getDate() + '_' + String(d.getFullYear()).slice(2);
  const R = (f) => path.join(root, f), read = (f) => fs.existsSync(R(f)) ? fs.readFileSync(R(f), 'utf8') : null;
  const board = read('VAMILY.md');
  const laneNames = new Set([...board.matchAll(/^## ([A-Z][A-Z +&]*?)\s{2}\(/gm)].map(m => m[1].trim()).concat(['COORDINATOR']));
  const said = [];
  if (kind === 'handoff' || kind === 'all') {
    const start = read('00_START_HERE_NEXT_SESSION.md'), existing = {};
    if (fs.existsSync(R('handoffs'))) for (const f of fs.readdirSync(R('handoffs'))) existing['handoffs/' + f] = read('handoffs/' + f);
    const r = applyHandoff(start, laneNames, existing, date + ' (CORRECT: ' + correct + ')');
    if (r.refused) throw new Error('THE SPLIT IS REFUSED: ' + r.refused);
    fs.mkdirSync(R('handoffs'), { recursive: true });
    for (const [f, t] of Object.entries(r.archives)) fs.writeFileSync(R(f), t);
    fs.writeFileSync(R('00_START_HERE_NEXT_SESSION.md'), r.start);
    said.push('handoff: ' + r.kept + ' blocks kept, ' + r.moved + ' moved to ' + Object.keys(r.archives).length + ' archives');
  }
  const t = readTrail(R('records/target/BOHEMIA_TRAIL.json'));
  const evaporated = 'records/BOHEMIA_EVAPORATED_' + stamp + '.md';
  let b = read('VAMILY.md');
  if (kind === 'rules' || kind === 'all') {
    const acts = t.marks.filter(m => m.kind === 'rule' && m.action).map(m => ({ n: +m.id.split(' ')[1], fold: /FOLDS/.test(m.action), silent: m.silent, paolo: !!m.quotes_paolo }));
    const r = applyRules(b, acts, date, evaporated); b = r.board;
    const ev = read(evaporated) || '# EVAPORATED ' + date + ' (rule 96): the text that left the front page, verbatim\n\n';
    fs.writeFileSync(R(evaporated), ev + r.evaporatedText + '\n');
    if (r.registry.length) fs.appendFileSync(R('gates/bohemia_superseded.txt'), r.registry.join('\n') + '\n');
    said.push('rules: ' + r.done.length + ' folded or left (' + r.done.sort((x, y) => x - y).join(', ') + ')');
  }
  if (kind === 'rows' || kind === 'all') {
    const acts = t.marks.filter(m => m.kind === 'row' && m.status === 'OPEN' && m.action).map(m => ({ label: m.id.slice(1, -1), lane: m.lane, silent: m.running_silent != null ? m.running_silent : m.silent, stale: m.action === 'STALE' }));
    const r = applyRows(b, acts, date); b = r.board;
    const f = 'records/BOHEMIA_EVAPORATED_ROWS.md', old = read(f) || '# EVAPORATED ROWS (rule 96): OPEN rows no lane named for 14 sweeps, one line each, verbatim\n\n';
    fs.writeFileSync(R(f), old + r.gone.join('\n') + (r.gone.length ? '\n' : ''));
    said.push('rows: ' + r.gone.length + ' left the board, ' + (r.done.length - r.gone.length) + ' marked STALE');
  }
  if (b !== read('VAMILY.md')) fs.writeFileSync(R('VAMILY.md'), b);
  if (kind === 'records' || kind === 'all') {
    const plan = planRecords(t.marks.filter(m => (m.kind === 'record' || m.kind === 'law') && m.action), date).filter(p => fs.existsSync(R(p.from)));
    for (const p of plan) execFileSync('git', ['mv', p.from, p.to], { cwd: root });
    if (plan.length) fs.appendFileSync(R('gates/bohemia_superseded.txt'), plan.map(p => p.registry).join('\n') + '\n');
    said.push('records: ' + plan.length + ' moved to archive/ with their registry lines (regenerate the canon index: python3 gates/bohemia_canon_index.py)');
  }
  return said;
}

module.exports = { heldOf, ruleAction, laneOf, citesIn, silentAfter, splitHandoff, seal, sweep, report, RATES, OUT, applyHandoff, applyRules, applyRows, planRecords, readTrail, ruleSpan, applyAll, archiveName };

if (require.main === module) {
  const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
  if (arg('--apply')) {
    try { for (const l of applyAll(arg('--apply'), arg('--correct'), { root: arg('--root') || ROOT })) console.log('  ' + l); }
    catch (e) { console.log('  REFUSED: ' + e.message); process.exit(1); }
  } else {
    const r = sweep({ write: !process.argv.includes('--no-write') });
    console.log(report(r));
  }
}
