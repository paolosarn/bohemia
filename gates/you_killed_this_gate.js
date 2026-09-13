#!/usr/bin/env node
/* YOU KILLED THIS -- gate for Paolo 9/7:
     "A lot of the ones I thumbed down were because some of the DIRECTIONS look
      like dog shit ... WE GOTTA RE-ANALYZE A LOT OF THESE. IF I KILLED IT I DON'T
      WANT IT GONE. I just think it could be done better. Make a new one."

   He thumbed 47 clips down and named WHY. Three rounds of rig work later the
   reasons are measured gone, and he has to be able to SEE that when he looks
   again -- otherwise he is re-judging blind and the second verdict is worth no
   more than the first.

   So the JUDGE ALL panel carries, on each of those 47 rows and on no other row,
   one green line saying what was wrong and what changed. Every line is MEASURED:
   built from the same probe run on the rig before his three complaints were
   fixed and on the rig now, over all eight facings and 24 buckets.

   THE LIST IS READ FROM HIS OWN PASTE, not from a copy in the gate. If the panel
   and records/BOHEMIA_CLIP_VERDICTS_9_7_26.txt ever disagree about which clips he
   killed, this goes red -- the board cannot drift away from what he actually
   said.                                                        ANIMATION 9/13 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const VERDICTS = path.join(ROOT, 'records', 'BOHEMIA_CLIP_VERDICTS_9_7_26.txt');
const { settle: SETTLE } = require(path.join(ROOT, 'gates', 'bohemia_settle.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = () => { console.log('\nYOU KILLED THIS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0); };

for (const f of [ALPHA, VERDICTS]) if (!fs.existsSync(f)) { console.log('  FAIL missing ' + f); fail++; done(); }

/* HIS PASTE IS THE LIST */
const vtxt = fs.readFileSync(VERDICTS, 'utf8');
const pick = (re) => { const m = re.exec(vtxt); return m ? m[1].split(',').map(s => s.trim()).filter(Boolean) : []; };
/* the LAST colon on the line, not the first: his own line reads "CANDIDATES
   THUMBS DOWN (18) -- HIS AMENDMENT BELOW: NOT DELETED, REDONE: stagger-hit..."
   and stopping at the first colon reads his amendment as two clip names. */
const killed = pick(/CANDIDATES THUMBS DOWN \(18\)[^\n]*:([^\n]+)/).concat(pick(/ORIGINALS THUMBS DOWN \(29\)[^\n]*:([^\n]+)/));
const kept = pick(/CANDIDATES THUMBS UP \(23\):([^\n]+)/).concat(pick(/ORIGINALS KEEP \(33\):([^\n]+)/));
ok('his verdict file still reads 47 killed and 56 kept (' + killed.length + ' / ' + kept.length + ')',
   killed.length === 47 && kept.length === 56);

const src = fs.readFileSync(ALPHA, 'utf8');
const m = /const CLIP_FIXED=\{[\s\S]*?\};/.exec(src);
ok('the judge panel carries a CLIP_FIXED table', !!m);
if (!m) done();
let TABLE = null;
try { TABLE = new Function(m[0].replace('const CLIP_FIXED', 'var CLIP_FIXED') + '\nreturn CLIP_FIXED;')(); }
catch (e) { ok('and it parses', false); done(); }

const names = Object.keys(TABLE);
const missing = killed.filter(c => !TABLE[c]);
const extra = names.filter(c => killed.indexOf(c) < 0);
ok('IT IS HIS LIST, READ FROM HIS OWN PASTE: the table is exactly the 47 he killed' +
   (missing.length ? '  MISSING: ' + missing.join(',') : '') +
   (extra.length ? '  EXTRA: ' + extra.join(',') : ''),
   missing.length === 0 && extra.length === 0);

/* CONTROL: a clip he KEPT must carry no repair line. A panel that told him
   everything had been broken would be as useless as one that told him nothing. */
const wrong = kept.filter(c => TABLE[c]);
ok('CONTROL: not one of the 56 he KEPT carries a repair line' + (wrong.length ? ' (' + wrong.join(',') + ')' : ''),
   wrong.length === 0);

const longest = names.reduce((a, c) => Math.max(a, TABLE[c].length), 0);
const empty = names.filter(c => !TABLE[c] || TABLE[c].length < 8);
ok('every line says something and none is long enough to blow the row open (longest ' + longest +
   ' chars, ceiling 130; ' + empty.length + ' empty)', longest <= 130 && empty.length === 0);

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 390, height: 900 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2800);
  await pg.click('#front').catch(() => {});
  await SETTLE(pg, 1200);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'anim'); if (t) t.click(); });
  await SETTLE(pg, 1500);
  await pg.click('#judgeAllBtn').catch(() => {});
  await SETTLE(pg, 2500);

  const R = await pg.evaluate(() => {
    const out = { btn: false, rows: 0, lines: 0, allRows: 0, tallest: 0, sample: '' };
    const b = [...document.querySelectorAll('button')].find(x => x.textContent === 'ONES YOU KILLED');
    out.allRows = [...document.querySelectorAll('.row')].filter(r => r.querySelector('.jaCv')).length;
    if (!b) return out;
    out.btn = true; b.click();
    return new Promise(res => setTimeout(() => {
      const rows = [...document.querySelectorAll('.row')].filter(r => r.querySelector('.jaCv'));
      out.rows = rows.length;
      out.tallest = rows.reduce((a, r) => Math.max(a, r.getBoundingClientRect().height), 0);
      const g = [...document.querySelectorAll('div')].filter(d => /^YOU KILLED THIS\./.test(d.textContent || ''));
      out.lines = g.length; out.sample = (g[0] && g[0].textContent || '').slice(0, 90);
      res(out);
    }, 1200));
  });

  ok('the panel has a ONES YOU KILLED filter he can tap', R.btn);
  ok('and it shows exactly his 47, each one playing its own clip (' + R.rows + ' rows of ' + R.allRows + ')',
     R.rows === 47);
  ok('with a repair line on every one of them (' + R.lines + ')', R.lines === 47);
  /* THE ROW STAYS ONE GLANCE. The 9/5 record paid for this once: a note allowed to
     wrap full-width took a row to ~200px and put FOUR clips on a phone screen. */
  ok('and the tallest row is ' + Math.round(R.tallest) + 'px, so ten still fit on a phone screen ' +
     '(ceiling 100; a wrapping note took it to 200 once already)', R.tallest > 0 && R.tallest <= 100);
  ok('the page throws nothing while he does it' + (errs.length ? ' (' + errs[0] + ')' : ''), errs.length === 0);
  console.log('     ' + R.sample);

  await br.close();
  done();
})().catch(e => { console.log('  FAIL gate threw: ' + e.message); fail++; done(); });
