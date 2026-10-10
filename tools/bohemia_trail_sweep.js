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

   THIS FIRST VERSION ONLY READS. The moves (the handoff split with the handoff gate's archive leg in the same
   commit, the folds, the archive moves) wait for the coordinator's CORRECT on the dry run.

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
const HEAD_ALIAS = { SOUND: 'SOUNDS', MUSIC: 'SOUNDS', SFX: 'SOUNDS', CITY: 'LIFE + CITY', ART: 'DIRECTION', COORDINATOR: 'COORDINATOR' };   /* ART (art-f3eu53) is the art director's old name */

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
  const nameRe = new RegExp('^(?:=+ |- |\\*+ |#+ |ROUND LOG )?(' + [...known].sort((a, b) => b.length - a.length).map(n => n.replace(/[+]/g, '\\+')).join('|') + ')\\b');
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
  const rules = rulesOf(board), rows = rowsOf(board);
  const laneNames = new Set([...board.matchAll(/^## ([A-Z][A-Z +&]*?)\s{2}\(/gm)].map(m => m[1].trim()).concat(['COORDINATOR']));
  /* births and status history from the boards of the last fifteen sweeps: a mark already on the oldest of
     them is older than every threshold (14), so older boards change nothing. Read from the working clone when
     it holds the commit (no network), else from the slim copy. */
  const bornRule = new Map(), bornRow = new Map(), openSince = new Map();
  const K0 = Math.max(0, sweeps.length - 15);
  const showBoard = (sha) => { try { return git(['show', sha + ':VAMILY.md']); } catch (e) { try { return git([...H.G, 'show', sha + ':VAMILY.md']); } catch (e2) { return null; } } };
  for (let k = K0; k < sweeps.length; k++) {
    const b = showBoard(sweeps[k].full); if (b == null) continue;
    const born = k === K0 ? 0 : k;                       /* on the oldest board read: born at or before the window */
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
    const fromBirth = born === undefined ? N : N - born;           /* not on any sweep's board yet: born after the last */
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
    const folded = /folded to one line/i.test(text), paolo = /\bPaolo\b|\bPAOLO\b|his words/.test(text);
    const action = s >= RATES.ruleLeave ? (paolo ? 'LEAVES THE PAGE (keeps its law file; registry line)' : 'LEAVES THE PAGE (lives in its record)')
      : s >= RATES.ruleFold && !folded ? 'FOLDS TO ONE LINE' : '';
    marks.push({ kind: 'rule', id: 'rule ' + n, title: text.replace(/\s+/g, ' ').slice(0, 70), silent: s, strength: strength(s), last_cite: lastOf(e), lanes: e ? [...e.lanes].sort() : [], folded, quotes_paolo: paolo, action });
  }
  /* ROWS */
  for (const [k, r] of rows) {
    const e = rowCite.get(k), s = silentOf(e, bornRow.get(k));
    let action = '';
    const so = r.status === 'OPEN' ? (openSince.has(k) ? N - openSince.get(k) : 0) : null;   /* sweeps it has sat OPEN */
    const sOpen = so === null ? s : Math.min(s, so);
    if (r.status === 'OPEN') action = sOpen >= RATES.rowGone ? 'MOVES TO records/BOHEMIA_EVAPORATED_ROWS.md' : sOpen >= RATES.rowStale ? 'STALE' : '';
    marks.push({ kind: 'row', id: '[' + k + ']', lane: r.lane, status: r.status, silent: s, open_sweeps: so, strength: strength(s), last_cite: lastOf(e), lanes: e ? [...e.lanes].sort() : [], action });
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
    const s = silentOf(e, undefined);
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
  say('    NOT SAFE TO SPLIT YET: ' + hz.length + ' moving blocks hold ' + Object.values(hzLanes).reduce((a, b) => a + b, 0) + ' lane lines dated in the last three days ('
    + Object.entries(hzLanes).sort((a, b) => b[1] - a[1]).map(([l, n]) => l + ' ' + n).join(', ') + '): those lanes write heads the split cannot see, so their newest state would leave the START file, some of it under another lane\'s archive.');
  const recs = r.marks.filter(m => m.kind === 'record' || m.kind === 'law'), out2 = recs.filter(m => m.action);
  say('  RECORDS AND LAWS: ' + recs.length + '; ' + recs.filter(m => m.reached === null).length + ' named by a lane in 30 days, ' + recs.filter(m => m.reached === true).length
    + ' reached from a live file, ' + out2.length + ' leave the canon index (' + out2.filter(m => m.kind === 'law').length + ' laws, ' + out2.filter(m => m.kind === 'record').length + ' records)');
  if (r.meta.stops.length) say('  STOP signals: ' + r.meta.stops.map(s => s.mark + ' by ' + s.lane + ' ' + s.by).join('; '));
  say('  the trail file: records/target/BOHEMIA_TRAIL.json, ' + r.marks.length + ' marks, seal ' + r.meta.seal);
  return out.join('\n');
}

module.exports = { laneOf, citesIn, silentAfter, splitHandoff, seal, sweep, report, RATES, OUT };

if (require.main === module) {
  const r = sweep({ write: !process.argv.includes('--no-write') });
  console.log(report(r));
}
