/* ============================================================================
   PROOF SHOTS STAY PUT -- A GATE RUN CHANGES NOTHING GIT TRACKS
   (PLUMBER 10/9/26, row [proof shots churn])

   The coordinator, 10/9: "five commits in seven minutes (148dab55 to e5330501) re-committed RUN TWO's
   settlement proof shots (1.8 MB PNGs) because the gate re-shoots on every rebase and the bytes differ
   by a few hundred; the repo grows and the log drowns."
   MEASURED on the clone's last five days: the barber's settlement shot re-committed 13 times, the
   smith's 12, raided and market day 9 each, the loop's four shots 4 each, the roster 3 (once by SOUNDS,
   f5b94ea, who had only run the gate). Five gates wrote into slices/vote/ on every run. Two runs of the
   roster gate on one tree, nothing changed between them, write two different files: a screenshot of a
   living page is not byte-stable, so the only honest place for it is outside git, unless a lane asks.

   THE RULE: tools/bohemia_proof_shot.js. proofShot(trackedPath) is a scratch file by default, and the
   tracked path only with `--shoot` or BOHEMIA_SHOOT=1 (the owning lane refreshing its VOTE picture on
   purpose). PROOF_DIR-style gates (people, camp_dial, lab) already default to os.tmpdir().

   LEGS
     S1-S6  the detector on planted gate text: a screenshot or an image write into slices/, records/ or
            engine/ is caught, directly, through a const, through an arrow that builds the name, and
            through .replace() on a const; proofShot(), os.tmpdir() and a PROOF_DIR that defaults to
            the tmpdir are not.
     P1     no gate under gates/ writes a screenshot or an image into a tracked folder except through
            proofShot or a scratch default (static, every .js and .py gate, about a second).
     P2     a real run of a shooting gate (the roster screen, about 5 s) leaves every tracked picture's
            `git status` exactly as it was, and its picture lands in the scratch folder.
     P3     asked, it shoots where asked: with BOHEMIA_SHOOT=1, proofShot() hands back the tracked path.
   node gates/proof_shots_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

/* the value after `key:` (or the first argument of a call), read up to the first comma at depth 0 */
function grab(s, at) {
  let d = 0, i = at;
  for (; i < s.length; i++) {
    const c = s[i];
    if (c === '(' || c === '[' || c === '{') d++;
    else if (c === ')' || c === ']' || c === '}') { if (d === 0) break; d--; }
    else if (c === ',' && d === 0) break;
  }
  return s.slice(at, i).trim();
}
/* a name's definition in the same file: `const|let|var NAME = ...` up to its semicolon */
function defOf(src, name) {
  const m = new RegExp('(?:const|let|var)\\s+' + name.replace(/\$/g, '\\$') + '\\s*=\\s*([^;]*);').exec(src);
  return m ? m[1] : null;
}
const TRACKED = /['"`](?:\.\.\/)?(?:slices|records|engine)\/|['"`](?:slices|records|engine)['"`]/;
const SCRATCH = /proofShot\(|tmpdir|gettempdir|mkdtemp/;
/* every place a gate puts a picture: screenshot({ path: X }) and writeFileSync(X, ...) of an image */
function targets(src) {
  const out = [];
  const shotRe = /screenshot\(\s*(?:Object\.assign\(\s*)?\{/g; let m;
  while ((m = shotRe.exec(src))) {
    const from = m.index + m[0].length, end = src.indexOf('}', from);
    const body = src.slice(from, end < 0 ? from + 400 : end + 1);
    const k = /(?:^|[\s,{])path\s*:\s*/.exec(body);
    if (k) out.push({ kind: 'screenshot', expr: grab(src, from + k.index + k[0].length), at: m.index });
  }
  const wRe = /writeFileSync\(\s*/g;
  while ((m = wRe.exec(src))) {
    const expr = grab(src, m.index + m[0].length);
    if (/\.(png|jpe?g|webp)\b|SHOT|shot/i.test(expr)) out.push({ kind: 'write', expr, at: m.index });
  }
  return out;
}
/* tracked if the expression, with the names it uses expanded twice, names a tracked folder and never
   passes through a scratch route */
function verdict(src, expr) {
  let text = expr;
  for (let hop = 0; hop < 3; hop++) {
    const names = [...new Set((text.match(/[A-Za-z_$][\w$]*/g) || []))];
    let more = '';
    for (const n of names) { const d = defOf(src, n); if (d && text.indexOf(d) < 0) more += ' ' + d; }
    if (!more) break; text += more;
  }
  if (SCRATCH.test(text)) return 'scratch';
  if (TRACKED.test(text)) return 'TRACKED';
  return 'unresolved';
}
function offenders(src) { return targets(src).filter(t => verdict(src, t.expr) === 'TRACKED'); }

console.log('='.repeat(74));
console.log('PROOF SHOTS STAY PUT: a gate run changes nothing git tracks');
console.log('='.repeat(74));

/* ---- S: the detector, planted both ways ----------------------------------------- */
const P = [
  ['S1 a direct path into slices/vote is caught', "await p.screenshot({ path: path.join(ROOT, 'slices/vote/X_10_9.png') });", 1],
  ['S2 through a const is caught', "const SHOT = path.join(ROOT, 'slices/vote/X.png');\nawait p.screenshot({ path: SHOT.replace('_1', '_2') });", 1],
  ['S3 through an arrow that builds the name is caught', "const shot = n => path.join(ROOT, 'records/target/X_' + n + '.png');\nawait p.screenshot(Object.assign({ path: shot('A') }, Q));", 1],
  ['S4 an image written by hand into records/ is caught', "fs.writeFileSync(path.join(ROOT, 'records/target/X.png'), buf);", 1],
  ['S5 proofShot() and os.tmpdir() are not', "const SHOT = proofShot(path.join(ROOT, 'slices/vote/X.png'));\nawait p.screenshot({ path: SHOT });\nawait p.screenshot({ path: path.join(os.tmpdir(), 'y.png') });", 0],
  ['S6 a PROOF_DIR that defaults to the tmpdir is not', "const PROOF_DIR = process.env.X ? path.resolve(ROOT, process.env.X) : require('os').tmpdir();\nconst shot = path.join(PROOF_DIR, 'Z.png');\nawait page.screenshot({ path: shot });", 0]];
for (const [n, src, want] of P) { const o = offenders(src); ok(n + ' (' + o.length + ')', o.length === want, JSON.stringify(o)); }

/* ---- P1: every gate ------------------------------------------------------------ */
const files = fs.readdirSync(path.join(ROOT, 'gates')).filter(f => /\.(js|py)$/.test(f) && f !== 'proof_shots_gate.js');
const bad = [], unresolved = [];
let shooting = 0;
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, 'gates', f), 'utf8');
  const t = targets(src); if (!t.length) continue; shooting++;
  for (const x of t) { const v = verdict(src, x.expr);
    if (v === 'TRACKED') bad.push(f + ': ' + x.kind + ' -> ' + x.expr.slice(0, 90));
    else if (v === 'unresolved') unresolved.push(f + ': ' + x.expr.slice(0, 60)); }
}
ok('P1 no gate writes a picture into a tracked folder except through proofShot or a scratch default ('
   + files.length + ' gates read, ' + shooting + ' put pictures somewhere, ' + bad.length + ' into git)', !bad.length,
   bad.slice(0, 12).join('\n         ') + '\n         route it: const { proofShot } = require(path.join(__dirname, \'..\', \'tools\', \'bohemia_proof_shot.js\')); path: proofShot(<the tracked path>)');
if (unresolved.length) console.log('  note: ' + unresolved.length + ' picture paths are built by a caller or a template, so this sweep cannot see where they land: '
  + unresolved.slice(0, 6).join(' | '));

/* ---- P2: a real run leaves git as it was --------------------------------------- */
{ /* pictures only: in the suite's parallel pack another gate may legitimately rewrite a record while this
     one runs, and that is not what this leg is about */
  const st = () => execFileSync('git', ['status', '--porcelain', '--untracked-files=all', '--', 'slices', 'records', 'engine'],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n').filter(l => /\.(png|jpe?g|webp|gif)$/i.test(l)).join('\n');
  const { SCRATCH: DIR } = require(path.join(ROOT, 'tools/bohemia_proof_shot.js'));
  const shotFile = path.join(DIR, 'RUN2_THE_ROSTER_10_9.png');
  try { fs.rmSync(shotFile, { force: true }); } catch (e) {}
  const before = st();
  const env = Object.assign({}, process.env); delete env.BOHEMIA_SHOOT;
  const r = spawnSync('node', [path.join(ROOT, 'gates/roster_screen_gate.js')], { cwd: ROOT, encoding: 'utf8', env, timeout: 180000 });
  const after = st();
  ok('P2 a real run of a shooting gate (the roster screen, exit ' + r.status + ') leaves git exactly as it was, and its picture is in the scratch folder',
     before === after && fs.existsSync(shotFile),
     'git before:\n' + before.slice(0, 400) + '\n         git after:\n' + after.slice(0, 400) + '\n         scratch shot: ' + fs.existsSync(shotFile)); }

/* ---- P3: asked, it shoots where asked ----------------------------------------- */
{ const probe = "const {proofShot}=require(process.argv[1]);process.stdout.write(proofShot('/x/slices/vote/A.png'))";
  const lib = path.join(ROOT, 'tools/bohemia_proof_shot.js');
  const asked = spawnSync('node', ['-e', probe, lib], { encoding: 'utf8', env: Object.assign({}, process.env, { BOHEMIA_SHOOT: '1' }) }).stdout;
  const env = Object.assign({}, process.env); delete env.BOHEMIA_SHOOT;
  const plain = spawnSync('node', ['-e', probe, lib], { encoding: 'utf8', env }).stdout;
  ok('P3 BOHEMIA_SHOOT=1 hands back the tracked path (' + asked + '), and without it the scratch one (' + plain + ')',
     asked === '/x/slices/vote/A.png' && plain === path.join(os.tmpdir(), 'bohemia_proof_shots', 'A.png')); }

console.log('\n=== PROOF SHOTS STAY PUT: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
