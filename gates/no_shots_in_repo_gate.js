/* NO GATE SCREENSHOTS INTO TRACKED SPACE (8/9/26)
 *
 * A lane flagged this on 8/7 ("FLAG: A GATE SCREENSHOTS INTO TRACKED, PAGES-
 * PUBLISHED SPACE") and fixed its own tool. Two gates still did it, and the cost
 * was paid by everybody: every suite run rewrote a ~500 KB binary inside slices/
 * and records/target/, so whichever lane happened to be shipping came back to a
 * dirty tree and either committed a picture nobody authored or discarded it by
 * hand. Three commits already carried one. It also published to the open internet
 * on every deploy, and the repo budget says per-commit weight is the other clock
 * on this project.
 *
 * Neither shot was ever read back, asserted on, or loaded by a page. They are
 * proof pictures for a human, which is what a temp dir is for.
 *
 * THIS ASSERTS THE PROPERTY, NOT THE TWO FILENAMES: no gate may write a screenshot
 * to a path inside the repository. Name-checking today's two offenders would go
 * stale the moment somebody adds a third.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* a screenshot call whose destination mentions a repo folder we publish or track */
const TRACKED = /(slices|records|banks|engine|quests)[\/\\]/;
const SHOT = /(screenshot|writeFileSync)\s*\(\s*\{?\s*path\s*[:=]/i;

let checked = 0, offenders = [];
for (const dir of ['gates', 'tools']) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) continue;
  for (const fn of fs.readdirSync(d)) {
    if (!/\.(js|py)$/.test(fn)) continue;
    const p = path.join(d, fn);
    const src = fs.readFileSync(p, 'utf8');
    checked++;
    /* strip comments so a post-mortem DESCRIBING the bug (this file, and the two
       fixes, all quote the old path) is never counted as committing it. A checker
       that cannot tell a mention from a use is the broken one. */
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      .replace(/^\s*#.*$/gm, '').replace(/"""[\s\S]*?"""/g, '');
    const lines = code.split('\n');
    for (const ln of lines) {
      if (!/screenshot\s*\(/.test(ln)) continue;
      if (!TRACKED.test(ln)) continue;
      /* a temp dir mentioned on the same line is the fix, not the bug */
      if (/tmpdir|tempfile|gettempdir|os\.tmpdir/.test(ln)) continue;
      offenders.push(dir + '/' + fn + ': ' + ln.trim().slice(0, 90));
    }
  }
}
ok('swept every gate and tool (' + checked + ')', checked > 100);
ok('no gate or tool screenshots into tracked, published space' +
  (offenders.length ? '\n         ' + offenders.join('\n         ') : ''), offenders.length === 0);

/* AND THE DESTINATION ITSELF MUST BE A TEMP DIR, not merely a file that happens to
   mention one. The first cut of this check tested /tempfile/ across the whole file
   and a planted regression walked straight past it, because `import tempfile` was
   still sitting at the top after the path had been put back to slices/. A checker
   that cannot tell an import from a use is the broken one -- the same failure this
   session has now caught three times, once in my own gate. So the SHOT ASSIGNMENT
   is what gets read. */
function shotDest(src) {
  const m = /^\s*SHOT\s*=\s*(.+)$/m.exec(src.replace(/^\s*#.*$/gm, ''));
  return m ? m[1].trim() : null;
}
for (const f of ['gates/sfx_render_gate.py']) {
  if (!fs.existsSync(path.join(ROOT, f))) continue;
  const dest = shotDest(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  ok(f.replace('gates/', '') + ' assigns its proof shot to a temp dir, not the repo (' +
    (dest || 'no SHOT found') + ')',
    !!dest && /tmpdir|gettempdir|tempfile/.test(dest) && !TRACKED.test(dest));
}
/* bottomleft builds its path inside embedded JS, so read the screenshot call */
{
  const f = 'gates/bottomleft_gate.py';
  if (fs.existsSync(path.join(ROOT, f))) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const m = /screenshot\(\{\s*path\s*:\s*([^}]+)\}/.exec(src);
    ok('bottomleft_gate.py screenshots to a temp dir, not into records/ (' +
      (m ? m[1].trim().slice(0, 60) : 'no call found') + ')',
      !!m && /tmpdir|tempfile/.test(m[1]) && !TRACKED.test(m[1]));
  }
}

console.log('NO SHOTS IN REPO GATE: ' + pass + ' passed, ' + fail + ' failed  (' + checked + ' files swept)');
process.exit(fail ? 1 : 0);
