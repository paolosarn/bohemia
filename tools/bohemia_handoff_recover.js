#!/usr/bin/env node
/*
 * HANDOFF RECOVERY -- FIND THE LANE BLOCKS THIS FILE HAS SWALLOWED, AND GET THEM BACK.
 * (9/13/26, PLUMBER lane, VAMILY row [suite runs].)
 *
 * ## WHAT IS HAPPENING, MEASURED ACROSS 400 COMMITS
 *
 * A lane reads 00_START_HERE_NEXT_SESSION.md at the start of its round, works for an
 * hour, then writes the whole file back. Everything any other lane added in that hour
 * is gone. No conflict, no warning, and the file still looks perfect.
 *
 *     93 commits deleted at least one lane's newest block
 *     80 distinct blocks lost
 *      9 lanes hit:  WORDS 21, EYES AND EARS 19, PLUMBER 15, PEOPLE 10,
 *                    COOK 5, ANIMATION 5, UI 2, SOUND 2, RUN 1
 *
 * EVERY LANE HAS BEEN BLAMING ITS OWN REBASES. One of the commits in that list is
 * literally "COOK: restore the handoff block a rebase ate". This lane wrote the same
 * thing twice before tracing it properly. It was never the rebases. It is the
 * read-early-write-late pattern, and it hits everybody.
 *
 * This is the file every session is told to read FIRST. A lane whose block is eaten
 * resumes from a stale account of its own work, or from nothing.
 *
 * ## WHY THE GATE ALONE CANNOT FIX IT
 *
 * gates/handoff_gate.js now refuses to let a lane DELETE a block that HEAD carries.
 * That is the right check and it fires in the tree of whoever is about to commit --
 * which only helps if that lane runs it. So the gate stops the careful and this tool
 * repairs after the careless. Both are needed.
 *
 * ## WHAT IT DOES
 *
 * Walks the file's history, collects every lane-block head that ever existed, and
 * compares against the file today. A head that vanished IN SOMEBODY ELSE'S COMMIT was
 * clobbered; a head its own lane removed was tidied away on purpose and is left alone.
 *
 *   node tools/bohemia_handoff_recover.js            list what is missing, change nothing
 *   node tools/bohemia_handoff_recover.js --archive  write every lost block to
 *                                                    archive/handoffs/RECOVERED_<date>.md
 *   node tools/bohemia_handoff_recover.js --restore  put each lane's NEWEST lost block
 *                                                    back at the top of the handoff
 *
 * --restore deliberately returns only the NEWEST lost block per lane, not all eighty.
 * The point is to give each lane its current state back, and this file is already
 * 5.2 MB with a planned cut ([handoff cut]); dumping eighty recovered blocks into it
 * would trade one problem for a worse one. The rest go to the archive, where nothing
 * is lost and nothing is in the way.
 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.dirname(__dirname);
const NAME = '00_START_HERE_NEXT_SESSION.md';
const HEAD_RE = /^[A-Z][A-Z \/]*\([a-z0-9]+(?:-[a-z0-9]+)+\):\s+\S+(?:\s+\(\w\))?\s+LATEST/gm;
const BLOCK_START = /^[A-Z][A-Z \/]*\([a-z0-9]+(?:-[a-z0-9]+)+\):\s+\S+/m;

const git = (args) => cp.execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 29 });
const at = (sha) => { try { return git(['show', sha + ':' + NAME]); } catch (e) { return ''; } };
const headsOf = (t) => new Set((t.match(HEAD_RE) || []).map(s => s.trim()));
const laneOf = (head) => head.split('(')[0].trim();

/* the whole block: from its head to the next lane head */
function blockAt(text, head) {
  const i = text.indexOf(head);
  if (i < 0) return null;
  const rest = text.slice(i + head.length);
  const m = BLOCK_START.exec(rest);
  return text.slice(i, i + head.length + (m ? m.index : rest.length));
}

(function main() {
  process.chdir(ROOT);
  const mode = process.argv.includes('--restore') ? 'restore'
             : process.argv.includes('--archive') ? 'archive' : 'list';

  const commits = git(['log', '--reverse', '--format=%h', '-600', '--', NAME]).trim().split('\n');
  console.log('HANDOFF RECOVERY -- walking ' + commits.length + ' commits of ' + NAME + '\n');

  const now = headsOf(fs.readFileSync(NAME, 'utf8'));
  /* head -> {sha it last existed at, who deleted it} */
  const lost = new Map();
  let prevHeads = null, prevSha = null;
  for (const c of commits) {
    const txt = at(c);
    const h = headsOf(txt);
    if (prevHeads) {
      for (const g of prevHeads) {
        if (h.has(g)) { lost.delete(g); continue; }        /* still there */
        const author = git(['log', '--format=%s', '-1', c]).trim();
        /* its OWN lane removing it is tidying, not clobbering */
        if (author.toUpperCase().startsWith(laneOf(g).split(' ')[0])) continue;
        lost.set(g, { at: prevSha, by: c, subject: author });
      }
    }
    prevHeads = h; prevSha = c;
  }
  for (const g of now) lost.delete(g);

  if (!lost.size) { console.log('  nothing lost. every block any commit ever held is still here.'); return; }

  const byLane = new Map();
  for (const [head, info] of lost) {
    if (!byLane.has(laneOf(head))) byLane.set(laneOf(head), []);
    byLane.get(laneOf(head)).push([head, info]);
  }
  console.log('  ' + lost.size + ' block(s) missing, across ' + byLane.size + ' lane(s):\n');
  for (const [lane, rows] of [...byLane].sort((a, b) => b[1].length - a[1].length)) {
    console.log('    ' + String(rows.length).padStart(3) + '  ' + lane);
    for (const [head, info] of rows.slice(-2)) {
      console.log('           ' + head.slice(0, 62));
      console.log('             eaten by ' + info.by + '  ' + info.subject.slice(0, 52));
    }
  }

  if (mode === 'list') {
    console.log('\n  --archive writes them all to archive/handoffs/, --restore puts each');
    console.log('  lane\'s newest one back at the top of the handoff.');
    return;
  }

  /* NEWEST BY THE DATE AND LETTER IN THE HEAD, NOT BY THE ORDER HISTORY HAPPENED TO
     HAND THEM OVER. The first cut took rows[last] and picked PLUMBER 9/13 (b) over
     9/13 (d) -- all three were eaten by the SAME commit, so history order said nothing
     about which was current. Caught by checking whether the block I expected actually
     came back, which is the only reason to look. */
  const rank = (head) => {
    const m = /:\s+(\d+)\/(\d+)(?:\s+\((\w)\))?\s+LATEST/.exec(head);
    if (!m) return [0, 0, ''];
    return [+m[1], +m[2], m[3] || ''];
  };
  const newer = (a, b) => {
    const x = rank(a), y = rank(b);
    return x[0] !== y[0] ? x[0] - y[0] : x[1] !== y[1] ? x[1] - y[1]
         : (x[2] < y[2] ? -1 : x[2] > y[2] ? 1 : 0);
  };
  const newest = [];
  for (const [, rows] of byLane) {
    newest.push(rows.slice().sort((a, b) => newer(a[0], b[0]))[rows.length - 1]);
  }

  if (mode === 'archive') {
    const dir = path.join(ROOT, 'archive', 'handoffs');
    fs.mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 10);
    const out = path.join(dir, 'RECOVERED_' + stamp + '.md');
    let body = '# HANDOFF BLOCKS RECOVERED FROM HISTORY (' + stamp + ')\n\n'
      + 'Written by tools/bohemia_handoff_recover.js. Each of these was deleted from\n'
      + '00_START_HERE_NEXT_SESSION.md by another lane writing the file from a stale read.\n\n';
    for (const [head, info] of lost) {
      const b = blockAt(at(info.at), head);
      if (b) body += '\n<!-- lost at ' + info.at + ', eaten by ' + info.by + ' -->\n' + b;
    }
    fs.writeFileSync(out, body);
    console.log('\n  wrote ' + lost.size + ' block(s) to ' + path.relative(ROOT, out));
    return;
  }

  let text = fs.readFileSync(NAME, 'utf8');
  const m = BLOCK_START.exec(text);
  const at0 = m ? m.index : 0;
  let put = '';
  for (const [head, info] of newest) {
    const b = blockAt(at(info.at), head);
    if (b) { put += b; console.log('  restoring  ' + head.slice(0, 62)); }
  }
  fs.writeFileSync(NAME, text.slice(0, at0) + put + text.slice(at0));
  console.log('\n  ' + newest.length + ' lane(s) have their newest block back. The rest are'
    + ' still in history; --archive collects them.');
})();
