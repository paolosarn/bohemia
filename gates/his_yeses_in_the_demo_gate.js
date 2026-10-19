/* ============================================================================
   HIS YESES IN THE DEMO  (RUN TWO [his yeses in the demo], 10/19/26)

   Paolo 10/18: 'the demo has not been fixed and updated in a long time'. Rule 118: he sees the truth, not anybody's
   word. At the foot of the VOTE tab every YES since 10/16 is one line, IN THE DEMO with the build stamp or NOT YET with
   the chat that has it, read from the registry and the demo's build stamp by machine, never typed by hand.

   What this holds, measured:
   1. THE MACHINE NEVER LIES. Every IN THE DEMO the committed list says is a file a card's commit changed that the
      demo's own cut reaches right now (tools/bohemia_run2_yes_in_the_demo.js, re-run here on this tree, no git); the
      carriers are git's own (a sampled commit this clone can read with its parent, re-read and found inside them).
      A NOT YET that has since become IN is reported as stale, never a lie: the deploy re-makes the file after its cut.
   2. ON HIS PHONE (390 x 844): one line per YES since 10/16, each IN THE DEMO or NOT YET with a chat; the sum names
      the build the demo is serving (the stamp file the cut writes, planted here as 99/99z to prove it is read live);
      a planted YES reads IN when the file says so and NOT YET with its lane when it does not; with the file gone
      every YES still shows and none says IN; a YES he taps joins the list the second he taps; the list sits under
      the comment box and nothing above the fold moves; no title is typed into the tab.
   3. THE DEPLOY RE-MAKES IT after it cuts the demo, and a failure there never stops a deploy.

   Run: node gates/his_yeses_in_the_demo_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), os = require('os');
const ROOT = path.dirname(__dirname);
const TOOL = require(path.join(ROOT, 'tools/bohemia_run2_yes_in_the_demo.js'));
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const YES = path.join(ROOT, 'records/target/BOHEMIA_YES_IN_THE_DEMO.json');
const CAR = path.join(ROOT, 'records/target/BOHEMIA_YES_CARRIERS.json');
const TAB = path.join(ROOT, 'slices/BOHEMIA_VOTE_TAB.html');
const PORT = 8819;

let pass = 0, fail = 0;
const ok = (msg, good, extra) => { good ? pass++ : fail++; console.log((good ? '  ok   ' : '  FAIL ') + msg + (extra ? '  [' + extra + ']' : '')); };
const readJSON = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };

const reg = readJSON(REG) || { items: [], verdicts: [] };
const yesIds = [];
(reg.verdicts || []).forEach(v => { if (v && v.vote === 'up' && TOOL.madeN(v.when) >= TOOL.SINCE && yesIds.indexOf(v.id) < 0) yesIds.push(v.id); });

/* ---- 1. THE MACHINE ---- */
const made = readJSON(YES), car = readJSON(CAR);
ok('the list and the carriers are files the machine wrote (records/target, each with its readme)', !!made && !!car && /never typed by hand/.test(made._readme || '') && /never by hand/.test(car._readme || ''));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'yesgate-'));
const fresh = TOOL.status(null, path.join(tmp, 'yes.json'));
ok('a fresh run on this tree (no git) gives a line for every YES since 10/16 in the registry', fresh.rows.length === yesIds.length && yesIds.every(id => fresh.rows.some(r => r.id === id)),
   fresh.rows.length + ' lines, ' + yesIds.length + ' yes');
const R = TOOL.reach(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'));
const reached = f => /\/$/.test(f) ? (Array.from(R.files).some(x => x.indexOf(f) === 0) || Array.from(R.dirs).some(d => d.indexOf(f) === 0 || f.indexOf(d) === 0))
                                    : (R.files.has(f) || Array.from(R.dirs).some(d => f.indexOf(d) === 0));
const lies = ((made && made.rows) || []).filter(r => r.state === 'in' && !(reached(r.by) && (((car && car.bySha) || {})[String(((reg.items || []).find(i => i.id === r.id) || {}).sha || '').trim()] || []).indexOf(r.by) >= 0));
ok('THE MACHINE NEVER LIES: every IN THE DEMO in the committed list is a file its card\'s commit changed that the demo\'s cut reaches now',
   !!made && lies.length === 0, lies.length ? lies.slice(0, 3).map(r => r.id + ' by ' + r.by).join('; ') : ((made.rows || []).filter(r => r.state === 'in').length + ' IN, each proved'));
const freshIn = new Set(fresh.rows.filter(r => r.state === 'in').map(r => r.id));
const extraIn = ((made && made.rows) || []).filter(r => r.state === 'in' && !freshIn.has(r.id));
const stale = fresh.rows.filter(r => r.state === 'in' && !((made && made.rows) || []).some(m => m.id === r.id && m.state === 'in'));
ok('  and it says IN nowhere a fresh run would not', extraIn.length === 0, extraIn.map(r => r.id).join(', ') || (stale.length ? stale.length + ' NOT YET since become IN (stale, the deploy re-makes it)' : 'same as a fresh run'));
/* the carriers are git's: a commit this clone can read with its parent, re-read, is inside what the file keeps */
const sampled = [];
for (const sha of Object.keys((car && car.bySha) || {})) {
  if (sampled.length >= 4) break;
  const out = TOOL.changed(ROOT, sha); if (out == null) continue;
  const files = out.split('\n').map(s => s.trim()).filter(Boolean).filter(TOOL.gameFile);
  const keep = car.bySha[sha];
  sampled.push({ sha, n: files.length, inside: files.every(f => keep.indexOf(f) >= 0 || keep.indexOf(f.slice(0, f.lastIndexOf('/') + 1)) >= 0) });
}
ok('the carriers are git\'s own (commits this clone can read, re-read, inside what the file keeps)', sampled.every(s => s.inside),
   sampled.length ? sampled.map(s => s.sha + ' ' + s.n + (s.inside ? '' : ' MISMATCH')).join(', ') : 'none readable in this shallow clone; the tool reads a history clone');
fs.rmSync(tmp, { recursive: true, force: true });

/* ---- 3. THE DEPLOY ---- */
const wf = fs.readFileSync(path.join(ROOT, '.github/workflows/pages.yml'), 'utf8');
const iCut = wf.indexOf('node tools/bohemia_cut_the_demo.js'), iYes = wf.indexOf('node tools/bohemia_run2_yes_in_the_demo.js status'), iSite = wf.indexOf('assemble the published site');
const step = iYes > 0 ? wf.slice(wf.lastIndexOf('- name:', iYes), iYes) : '';
ok('the deploy re-makes the list right after it cuts the demo, before it assembles the site, and its failure never stops a deploy',
   iCut > 0 && iYes > iCut && iYes < iSite && /continue-on-error:\s*true/.test(step), iYes > 0 ? 'step at ' + iYes : 'no step');

/* ---- 2. ON HIS PHONE ---- */
const src = fs.readFileSync(TAB, 'utf8');
const typed = (reg.items || []).filter(i => yesIds.indexOf(i.id) >= 0 && i.title && i.title.length > 12 && src.indexOf(i.title.slice(0, 24)) >= 0);
ok('no YES title is typed into the tab', typed.length === 0, typed.map(i => i.id).join(', '));

let plantReg = null, plantYes = null, plantStamp = null, noYes = false;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.txt': 'text/plain' };
const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  if (rel === 'records/target/BOHEMIA_VOTE_REGISTRY.json' && plantReg) { rs.setHeader('content-type', 'application/json'); return rs.end(plantReg); }
  if (rel === 'records/target/BOHEMIA_YES_IN_THE_DEMO.json') { if (noYes) { rs.statusCode = 404; return rs.end(); } if (plantYes) { rs.setHeader('content-type', 'application/json'); return rs.end(plantYes); } }
  if (rel === 'slices/BOHEMIA_DEMO_STAMP.txt' && plantStamp) { rs.setHeader('content-type', 'text/plain'); return rs.end(plantStamp); }
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});

(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium; try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; } catch (e) { chromium = require('playwright').chromium; }
  const b = await chromium.launch();
  const errs = [];
  const page = async () => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
    await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_VOTE_TAB.html', { waitUntil: 'load' });
    await p.waitForFunction('window.__voteReady === true', null, { timeout: 30000 });
    await p.waitForFunction('window.__yesReady === true', null, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(100);
    return { ctx, p };
  };
  const read = p => p.evaluate(() => {
    const y = document.getElementById('yeses'), f = document.getElementById('foot'), first = document.querySelector('#list .row, #more .row');
    return { shown: !!y && !y.hidden, sum: y ? (y.querySelector('.sum') || {}).textContent || '' : '',
             lines: Array.from(document.querySelectorAll('#yeses .yl')).map(l => ({ id: l.getAttribute('data-id'), t: l.textContent, in: l.classList.contains('in') })),
             under: y && f ? y.getBoundingClientRect().top + scrollY >= f.getBoundingClientRect().bottom + scrollY - 1 : false,
             firstTop: first ? first.getBoundingClientRect().top + scrollY : -1, wide: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });

  /* the real files */
  let s = await page(); let got = await read(s.p);
  const plain = got.lines.every(l => /^(IN THE DEMO|NOT YET)/.test(l.t) && (l.in || /· .+ has it$/.test(l.t)));
  ok('on his phone: one line per YES since 10/16, each IN THE DEMO or NOT YET with the chat that has it', got.shown && got.lines.length === yesIds.length && plain,
     got.lines.length + ' lines of ' + yesIds.length + ' yes; "' + got.sum + '"');
  ok('  the list sits under the comment box, nothing runs off the side', got.under && got.wide <= 1, (got.under ? 'under' : 'NOT under') + ', ' + got.wide + ' px over');
  const firstTop = got.firstTop; await s.ctx.close();

  /* planted: a card, his YES on it, the machine's word, the demo's stamp */
  const card = { id: 'gate-yes-planted-10-19', kind: 'ui', lane: 'gate lane', sha: 'gate', made: '10/19', title: 'THE GATE PLANTED THIS YES', why: 'Planted. You see it here.', show: { how: 'text', src: 'x' } };
  const r2 = JSON.parse(JSON.stringify(reg)); r2.items.push(card); r2.verdicts.push({ id: card.id, vote: 'up', said: '', when: '10/19' });
  plantReg = JSON.stringify(r2);
  const y2 = JSON.parse(JSON.stringify(made || { rows: [] })); y2.rows = (y2.rows || []).concat([{ id: card.id, state: 'in', by: 'slices/BOHEMIA_DEMO.html' }]);
  plantYes = JSON.stringify(y2); plantStamp = 'DEMO - BUILD 99/99z - THE GATE\n';
  s = await page(); got = await read(s.p); await s.ctx.close();
  const pl = got.lines.find(l => l.id === card.id);
  ok('  a planted YES reads IN THE DEMO when the machine\'s file says so, and the sum names the build the demo serves (planted 99/99z)',
     !!pl && pl.in && /^IN THE DEMO/.test(pl.t) && /build 99\/99z/.test(got.sum), (pl ? pl.t : 'no line') + ' | ' + got.sum);
  plantYes = JSON.stringify(made || { rows: [] });
  s = await page(); got = await read(s.p); await s.ctx.close();
  const pl2 = got.lines.find(l => l.id === card.id);
  ok('  and NOT YET with its own chat when the file does not say IN (never IN on a guess)', !!pl2 && !pl2.in && /NOT YET/.test(pl2.t) && /GATE LANE has it/.test(pl2.t), pl2 ? pl2.t : 'no line');
  noYes = true;
  s = await page(); got = await read(s.p); await s.ctx.close();
  ok('  with the machine\'s file gone every YES still shows and none says IN', got.lines.length === yesIds.length + 1 && got.lines.every(l => !l.in), got.lines.length + ' lines, ' + got.lines.filter(l => l.in).length + ' IN');
  noYes = false; plantReg = null; plantYes = null; plantStamp = null;
  s = await page(); got = await read(s.p);
  const without = await s.p.evaluate(() => { const y = document.getElementById('yeses'), keep = y.parentNode, next = y.nextSibling; keep.removeChild(y);
    const f = document.querySelector('#list .row, #more .row'), t = f ? f.getBoundingClientRect().top + scrollY : -1; keep.insertBefore(y, next); return t; });
  ok('  nothing above the fold moved: his first card sits where it sits without the list', got.firstTop === without && got.firstTop === firstTop, got.firstTop + ' with, ' + without + ' without');

  /* a YES he taps joins the list the second he taps */
  const before = got.lines.length;
  const target = await s.p.evaluate(() => { const r = document.querySelector('#list .row, #more .row'); return r ? r.getAttribute('data-id') : null; });
  if (!target) { await s.p.evaluate(() => { const f = document.getElementById('fold'); if (f && !f.hidden) f.click(); }); }
  const tid = target || await s.p.evaluate(() => { const r = document.querySelector('#more .row'); return r ? r.getAttribute('data-id') : null; });
  if (tid) { await s.p.tap('.row[data-id="' + tid + '"] .tb.up'); await s.p.waitForTimeout(500); }
  got = await read(s.p);
  const joined = got.lines.find(l => l.id === tid);
  ok('  a YES he taps joins the list the second he taps, NOT YET', !!tid && got.lines.length === before + 1 && !!joined && !joined.in, tid + ': ' + (joined ? joined.t : 'not there'));
  await s.ctx.close();

  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nHIS YESES IN THE DEMO: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
