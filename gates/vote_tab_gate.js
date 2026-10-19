/* ============================================================================
   THE VOTE TAB GATE  (UI lane, 9/15)

   Paolo 9/14, LOCKED: "We need one central tab in the fucking demo where everything
   from sounds to portrait to hair to everything that is new, where I vote on it...
   after I vote on something it needs to stop presenting itself like I didn't just
   vote on it."
   laws/BOHEMIA_ADDENDUM_ONE_VOTE_TAB_AND_THE_PORTRAIT_CHAT_9_14_26.md

   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. The law makes four promises and this
   file is the machine that holds each of them:

   1. ONE QUEUE OF EVERY KIND, newest first, read from ONE registry that every lane
      appends to. Not eight judge pages. Not a list baked into the page.
   2. A VOTE CONSUMES. Two memories have to make that true and BOTH are tested here:
      the phone (he taps, the row leaves, a reload does not bring it back) and the
      registry (the gate PLANTS a judged id and proves the tab refuses to draw it).
      The registry leg is the one that matters most -- it is the only one that
      survives a cleared cache, and it is the exact thing he complained about.
   3. THE DOOR IS THE GEAR, NOT THE TAB BAR. tools/bohemia_cut_the_demo.js deletes
      every tab but RUN, so a VOTE tab alone reaches him in the workshop and NEVER in
      the thing he plays. This gate runs the real cutter into a throwaway tree and
      proves the door is still there afterwards. It does not touch the committed demo
      (rule 14a: ONLY RUN re-cuts).
   4. THE VERDICT WORKFLOW STANDS: sun readable, export as .txt (never .json), the
      comment box at the bottom, and every control 44 (THE THUMB).

   Run: node gates/vote_tab_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const SLICES = path.join(ROOT, 'slices');
const TAB = path.join(SLICES, 'BOHEMIA_VOTE_TAB.html');
const ALPHA = path.join(SLICES, 'BOHEMIA_ALPHA_0_9.html');
const REGREL = 'records/target/BOHEMIA_VOTE_REGISTRY.json';
const REG = path.join(ROOT, REGREL);
const PORT = 8817;
const MIN = 44;

let pass = 0, fail = 0;
const ok = (msg, good, extra) => {
  good ? pass++ : fail++;
  console.log((good ? '  ok   ' : '  FAIL ') + msg + (extra ? '  [' + extra + ']' : ''));
};
function done(srv, b) {
  const end = () => {
    console.log('\nTHE VOTE TAB GATE: ' + pass + ' ok, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
  };
  Promise.resolve(b && b.close()).catch(() => {}).then(() => { if (srv) srv.close(); end(); });
}

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2',
               '.webmanifest': 'application/manifest+json' };

/* THE SERVER IS ROOTED AT THE REPO, NOT AT slices/, because the whole point of the
   registry is that it lives OUTSIDE slices/ where every lane can append to it. This
   mirrors production: _site carries slices/ and records/target/ side by side. */
let plant = null;   /* when set, this body is served as the registry */
let triPlant = null;   /* when set, this body is served as the sort file (RUN TWO [new cards show first]) */
let noSort = false;  /* when set, the sort file (rule 92) answers 404, as a deploy that lost it would */
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      if (noSort && rel === 'records/target/BOHEMIA_VOTE_TRIAGE.json') { rs.statusCode = 404; return rs.end('no'); }
      if (triPlant && rel === 'records/target/BOHEMIA_VOTE_TRIAGE.json') { rs.setHeader('content-type', 'application/json'); return rs.end(triPlant); }
      if (plant && rel === REGREL) {
        rs.setHeader('content-type', 'application/json');
        return rs.end(plant);
      }
      const f = path.join(ROOT, rel);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(PORT, '127.0.0.1', () => res(s));
  });
}

const url = p => 'http://127.0.0.1:' + PORT + '/' + p;

(async () => {
  /* ---- 1. THE REGISTRY IS A REAL FILE WITH A REAL SHAPE -------------------- */
  if (!fs.existsSync(REG)) { ok('the one registry exists for every lane to append to', false); return done(); }
  /* *** NO CONFLICT MARKERS, AND THIS LEG EXISTS BECAUSE I ALMOST PUT THEM ON MAIN. ***
     (UI 9/27.) Twenty lanes append to one JSON array every round, so the registry conflicts
     on nearly every rebase. PLUMBER has already measured TWO conflicted registries reaching
     main in one round (9eec17d and d4b24e8); the second one's DEPLOY FAILED, which is the
     only reason anybody noticed, and a lane whose handoff gate then goes red spends its
     round on somebody else's merge. This round I resolved a rebase where the conflict was
     in the registry and my resolver only knew how to fix the handoff: it threw, the `git
     add -A` after it staged THE CONFLICTED FILE, and the commit carried three markers.
     Caught before pushing by parsing what I had committed rather than trusting that a
     rebase which said "successfully rebased" had rebased what I meant.
     'VALID JSON' ALREADY CATCHES IT, and it is worth a leg of its own anyway: the message
     a reader gets from a JSON parser ("Expecting property name at line 2003") does not say
     GIT LEFT A CONFLICT IN HERE, and the fix is completely different. */
  const rawReg = fs.readFileSync(REG, 'utf8');
  const markers = (rawReg.match(/^(<<<<<<<|=======|>>>>>>>)/gm) || []).length;
  ok('the registry carries NO git conflict markers', markers === 0,
     markers ? markers + ' marker lines: somebody\'s rebase was committed unresolved' : 'clean');
  let reg;
  try { reg = JSON.parse(rawReg); }
  catch (e) { ok('the registry is valid JSON', false, String(e.message).slice(0, 60)); return done(); }
  ok('the one registry exists and parses', true, REGREL);
  ok('it carries items[] and verdicts[]',
     Array.isArray(reg.items) && Array.isArray(reg.verdicts));

  /* 'sound' ADDED 9/21 BY THE SOUNDS LANE, and flagged here so UI can object rather
     than discover it. Rule 22(d) (Paolo 9/21, LOCKED) puts sound in the vote tab and
     owes UI [vote plays sound]; rule 22(a) requires every making lane to register what
     it cooked, and SOUNDS had ZERO of the registry's 29 items, which is exactly what he
     complained about. Until UI lands the player, a sound registers as show.how 'page'
     and the page plays it itself. This is the LIST OF KINDS, which is data, not the
     tab's behaviour: calling a room hum a 'song' to squeeze past this line would have
     been a small lie that turns into a bug later. */
  /* 'sound' was added by SOUNDS (6962fc74) when [vote plays sound] was owed, and it
     stays. 'verdict' is added here 9/21 for DIRECTION (370820aa): it is a genuinely
     different thing from the rest of this list -- every other kind is a CANDIDATE he
     picks between, and a verdict is a CALL he agrees with or does not. The tab already
     renders it (it prints the kind and shows the image), so the only thing standing in
     its way was this list, and a lane that registers a real thing should not have its
     row held up by a word. The registry's own readme carries the same list and is
     updated with it, so the next lane does not have to guess. */
  const KINDS = ['song','sound','face','haircut','outfit','tile','animation','line','ui','verdict','redo'];
  const bad = [];
  const seen = new Set();
  const dupes = [];
  (reg.items || []).forEach(it => {
    if (!it || !it.id) { bad.push('(no id)'); return; }
    if (seen.has(it.id)) dupes.push(it.id);
    seen.add(it.id);
    if (!it.kind || KINDS.indexOf(it.kind) < 0) bad.push(it.id + ' kind');
    if (!it.lane) bad.push(it.id + ' lane');
    if (!it.sha) bad.push(it.id + ' sha');
    if (!it.title) bad.push(it.id + ' title');
    if (!it.show || !it.show.how) bad.push(it.id + ' show');
    if (it.kind === 'redo' && !it.redoOf) bad.push(it.id + ' redoOf');
  });
  ok('every candidate says what it is, who made it and how to show it',
     bad.length === 0, bad.slice(0, 4).join(', '));
  /* AN ID IS NEVER REUSED. That is what makes "never comes back under the same id"
     mean something: a lane cannot get a killed thing back by re-registering its id. */
  ok('no id is used twice', dupes.length === 0, dupes.join(', '));

  /* TWO SENTENCES, AND THE SECOND SAYS WHERE YOU SEE IT. Rule 22f (Paolo 10/1, the
     fourth votes: "two sentences max"). RUN 2 rewrote all 101 waiting items to it and
     grandfathered nothing. Every item still WAITING (no verdict yet) must carry a why
     of one or two sentences, and its last sentence must say "you see it" or "you hear
     it" and name the tab or screen. A judged item is history and is never re-read. */
  const judgedIds = new Set((reg.verdicts || []).map(v => v && v.id));
  const longWhy = [];
  (reg.items || []).forEach(it => {
    if (!it || !it.id || judgedIds.has(it.id)) return;
    const s = String(it.why || '').trim().split(/(?<=[.!?])\s+/).filter(Boolean);
    if (!s.length) longWhy.push(it.id + ' (no why)');
    else if (s.length > 2) longWhy.push(it.id + ' (' + s.length + ' sentences)');
    else if (!/\byou (see|hear) it\b/i.test(s[s.length - 1])) longWhy.push(it.id + ' (no where)');
  });
  ok('every waiting why is two sentences at most and names where you see it',
     longWhy.length === 0, longWhy.slice(0, 4).join(', '));

  /* AN ART SHEET COMES WITH ITS REFERENCE TWIN (PLUMBER 10/10, row [the pack gate]; rule 82, Paolo 10/10, the
     seventh votes: "all the art we made looks nothing like the assets we downloaded"). "NO ART SHEET GOES TO VOTE
     WITHOUT ITS REFERENCE TWIN beside it (the real thing or the downloaded asset of the same kind at the same
     size) and the three biggest differences named ... vote_tab_gate refuses an art item without one (PLUMBER
     leg)." The 9/4 compare law said the same and its gate never bit, because nothing in a VOTE row said what
     the art was compared against. So the row says it now:
       twin: { src: "<the reference: a file under slices/ or the repo, or pack:<pack>#<idx>, a pack tile he
                     judged UP>", diffs: ["<difference 1>", "<2>", "<3>"] }
     AN ART SHEET is a face, a haircut or an outfit, or a picture or page an art lane registers (COOK and its
     numbered twins, COMBAT TWO, CHARACTER, PORTRAIT). The kind alone cannot say it: TUNING files its number
     tables as "tile". Held from the rule's day (made 10/10 on); older waiting art is counted, not failed,
     because DIRECTION's twin pass decides which of it comes back (rule 82, rule 87). */
  const ART_LANE = /^(cook( ?(2|3|4|two|three|four))?|combat ?(2|two)|character|portrait)$/i;
  const isArt = it => ['face', 'haircut', 'outfit'].includes(it.kind)
    || (ART_LANE.test(String(it.lane || '').trim()) && !!it.show && /^(image|page|clip)$/.test(it.show.how || ''));
  const madeOn = it => { const m = /^(\d+)\/(\d+)/.exec(String(it.made || '')); return m ? (+m[1]) * 100 + (+m[2]) : 0; };
  const UP = (() => { try { const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt'), 'utf8'));
    return new Set(d.verdicts.filter(v => v.v === 'UP').map(v => v.pack + '#' + v.idx)); } catch (e) { return new Set(); } })();
  const twinWhy = it => {
    const t = it.twin; if (!t || typeof t !== 'object') return 'no twin';
    const src = String(t.src || ''); if (!src) return 'its twin names no reference';
    if (/^pack:/.test(src)) { if (!UP.has(src.slice(5))) return src + ' is not a pack tile he judged UP'; }
    else if (!fs.existsSync(path.join(ROOT, 'slices', src)) && !fs.existsSync(path.join(ROOT, src))) return 'its twin ' + src + ' is not on disk';
    if (!Array.isArray(t.diffs) || t.diffs.length !== 3 || t.diffs.some(d => !String(d || '').trim()))
      return 'it names ' + (Array.isArray(t.diffs) ? t.diffs.length : 0) + ' differences, not three';
    return null; };
  { const P = [
      [{ id: 'p1', kind: 'tile', lane: 'cook', made: '10/10', show: { how: 'image' } }, true, 'no twin'],
      [{ id: 'p2', kind: 'tile', lane: 'tuning', made: '10/10', show: { how: 'page' } }, false, null],
      [{ id: 'p3', kind: 'face', lane: 'portrait', made: '10/10', show: { how: 'page' }, twin: { src: 'pack:1. Cobblestone floor tiles#0', diffs: ['a', 'b', 'c'] } }, true, null],
      [{ id: 'p4', kind: 'outfit', lane: 'character', made: '10/10', show: { how: 'page' }, twin: { src: 'vote/__no_such_twin.png', diffs: ['a', 'b', 'c'] } }, true, 'not on disk'],
      [{ id: 'p5', kind: 'tile', lane: 'cook 2', made: '10/11', show: { how: 'image' }, twin: { src: 'pack:1. Cobblestone floor tiles#0', diffs: ['a', 'b'] } }, true, 'not three']];
    const wrong = P.filter(([it, art, why]) => isArt(it) !== art || (art && (why === null ? twinWhy(it) !== null : !String(twinWhy(it)).includes(why))));
    ok('the twin test reads planted rows both ways (' + P.length + ': a cook sheet with no twin, a tuning table that is not art, a face with a pack twin, a twin not on disk, two differences)',
       !wrong.length, wrong.length ? 'misread: ' + wrong.map(w => w[0].id).join(', ') : ''); }
  const noTwin = [], oldNoTwin = [];
  (reg.items || []).forEach(it => {
    if (!it || !it.id || judgedIds.has(it.id) || !isArt(it)) return;
    const w = twinWhy(it); if (!w) return;
    (madeOn(it) >= 1010 ? noTwin : oldNoTwin).push(it.id + ' (' + w + ')'); });
  ok('every art sheet registered since rule 82 carries its reference twin and three differences (' + noTwin.length + ' without)',
     noTwin.length === 0, noTwin.slice(0, 6).join(', ')
     + '\n         add twin: { src: "<the reference: a file, or pack:<pack>#<idx>>", diffs: ["...", "...", "..."] } to the row (rule 82)');
  if (oldNoTwin.length) console.log('    note: ' + oldNoTwin.length + ' waiting art sheets from before rule 82 carry no twin; DIRECTION\'s twin pass decides which of them come back (rules 82, 87)');

  /* A ROW HE TAPS AND NOTHING HAPPENS IS WORSE THAN NO ROW. Lanes register a path by
     hand, so a typo or a renamed file lands here as a dead LOOK AT IT button and he has
     no way to tell that from a thing that is simply broken. Paths are relative to
     slices/, because that is where the page doing the showing lives. */
  const missing = (reg.items || []).filter(it => {
    const how = it && it.show && it.show.how;
    if (how !== 'page' && how !== 'image' && how !== 'clip' && how !== 'audio') return false;
    return !fs.existsSync(path.join(SLICES, it.show.src || ''));
  }).map(it => it.id + ' -> ' + (it.show.src || '(none)'));
  ok('every registered thing is actually there to be looked at',
     missing.length === 0, missing.slice(0, 3).join(', '));

  /* ---- 2. THE PAGE ITSELF -------------------------------------------------- */
  if (!fs.existsSync(TAB)) { ok('the vote tab page exists', false); return done(); }
  const src = fs.readFileSync(TAB, 'utf8');
  ok('the tab reads the registry rather than baking the list in',
     src.indexOf(REGREL) >= 0 && src.indexOf('fetch(') >= 0);
  /* .txt NEVER .json -- the verdict workflow, standing since the first judge page. */
  ok('it exports .txt, not .json',
     /\.txt'/.test(src) && !/download\s*=\s*[^;]*\.json/.test(src));

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) {
    try { chromium = require('playwright').chromium; }
    catch (e2) { ok('playwright is available to open the tab', false); return done(); }
  }

  const srv = await serve();
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 },
                                   deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 140)));

  const open = async (u) => {
    await p.goto(u || url('slices/BOHEMIA_VOTE_TAB.html'), { waitUntil: 'load', timeout: 60000 });
    await p.waitForFunction('window.__voteReady === true', null, { timeout: 20000 });
    await p.waitForTimeout(120);
  };

  await open();
  ok('the tab opens with no script error', errs.length === 0, errs.slice(0, 2).join(' | '));

  const live = () => p.evaluate(() =>
    Array.from(document.querySelectorAll('#list .row:not(.gone), #more .row:not(.gone)')).map(r => r.getAttribute('data-id')));   /* the fold's rows once it is open (RUN TWO 10/18: after his sitting nothing is red, so the queue is all behind MORE) */

  let rows = await live();
  /* THE SORT (UI [the triage filter], rule 92, 10/10): records/target/BOHEMIA_VOTE_TRIAGE.json, the coordinator's.
     RED first and alone (at most the cap), the rest he has to see (yellow, a red past the cap, untagged) behind one
     fold that says MORE with its count, GREEN and GRAY never. The queue is what is on the page once the fold is open. */
  let TRI = null; try { TRI = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_TRIAGE.json'), 'utf8')); } catch (e) { TRI = null; }
  const tagOf = id => { const t = TRI && TRI.tags && TRI.tags[id]; return t && t.tag ? String(t.tag).toLowerCase() : null; };
  const kept = id => !TRI || !/^(green|gray|grey)$/.test(tagOf(id) || '');
  const queue = async (pg) => { pg = pg || p;
    await pg.evaluate(() => { const f = document.getElementById('fold'); if (f && !f.hidden && document.getElementById('more').hidden) f.click(); });
    await pg.waitForTimeout(80);
    return pg.evaluate(() => Array.from(document.querySelectorAll('#list .row, #more .row')).map(r => r.getAttribute('data-id'))); };
  /* NEWEST FIRST is the day a card was made, then its place in the file (RUN TWO [new cards show first], 10/18: eight 10/18
     cards put at the head of items[] were drawn under 9/12 ones). want runs OLDEST to NEWEST, so want[want.length-1] is
     the newest, as before. */
  const madeOf = i => { const m = String(i.made || '').match(/^(\d{1,2})\/(\d{1,2})/); return m ? (+m[1]) * 100 + (+m[2]) : 0; };
  const byNew = items => items.map((it, k) => ({ it, k, d: madeOf(it) })).sort((a, b) => (b.d - a.d) || (b.k - a.k)).map(x => x.it);
  const want = byNew((reg.items || []).filter(i => !(reg.verdicts || []).some(v => v.id === i.id)))
                                .map(i => i.id).filter(kept).reverse();
  const cap = (TRI && TRI.cap) || 12;
  const newest = want.slice().reverse();
  const redsWanted = newest.filter(id => tagOf(id) === 'red');
  const frontWanted = redsWanted.concat(newest.filter(id => !tagOf(id))).slice(0, cap);
  ok('in front of him: the red ones, then the ones nobody has sorted yet, newest first, at most ' + cap + ', and nothing else',
     TRI ? (rows.length === frontWanted.length && rows.every((id, i) => id === frontWanted[i])) : rows.length === want.length,
     rows.length + ' in front, ' + redsWanted.length + ' red, ' + (frontWanted.length - Math.min(cap, redsWanted.length)) + ' new');
  const foldN = await p.evaluate(() => { const f = document.getElementById('fold'); return f && !f.hidden ? +document.getElementById('foldn').textContent : 0; });
  ok('  the rest wait behind one fold that says MORE with its count', !TRI || foldN === want.length - frontWanted.length, foldN + ' behind MORE, ' + (want.length - frontWanted.length) + ' wanted');
  const all = await queue();
  ok('every unjudged candidate the sort keeps is in the queue, and no green or gray one is',
     all.length === want.length && want.every(id => all.indexOf(id) >= 0),
     all.length + ' drawn, ' + want.length + ' waiting' + (TRI ? ' (' + ((reg.items || []).length - want.length) + ' judged, green or gray)' : ''));
  /* NEWEST FIRST. The registry is appended to, so the LAST item in the file is the
     newest thing anybody made, and it has to be the first thing he sees (the newest red, once sorted). */
  /* RUN TWO 10/18: when nothing is red (his votes consumed every red) the front is empty by design and the newest
     untagged thing waits first behind the fold; the leg read rows[0] (undefined) and went red on the first new item
     after a full sitting, and passed vacuously on an empty queue. It now reads the first row he sees, in front or
     behind the fold. */
  const topRow = rows.length ? rows[0] : all[0];
  ok('the newest thing is at the top (the newest red, else the newest new one)', topRow === (TRI && frontWanted.length ? frontWanted[0] : want[want.length - 1]),
     'top is ' + topRow);

  /* NEW CARDS SHOW FIRST (RUN TWO, Paolo 10/18 'the votes aren't loading what you're telling me'): a card nobody has tagged
     is on his FIRST screen, never behind MORE. Two planted untagged cards: one appended the way the readme says, one put at
     the HEAD of items[] with the newest day (the way eight cards were). Read twice: with nothing tagged, both lead the list;
     with the coordinator's real tags, both sit right after the reds while the cap has room. A tag only demotes: the same
     card tagged yellow waits behind MORE, tagged green it is nowhere. */
  {
    /* the newest day any card carries (UI 10/19: a hard 10/18 fell behind the fourth real untagged card made 10/19 and the
       leg went red on the calendar, not on the tab) */
    const today = (() => { let best = '10/18', bn = 0; (reg.items || []).forEach(i => { const m = String((i && i.made) || '').match(/^(\d{1,2})\/(\d{1,2})/);
      if (m && +m[1] * 100 + +m[2] > bn && +m[1] * 100 + +m[2] < 1231) { bn = +m[1] * 100 + +m[2]; best = m[1] + '/' + m[2]; } }); return best; })();
    const mk = (id, made) => ({ id, kind: 'ui', lane: 'run 2', sha: 'gate', made, title: 'PLANTED BY THE GATE', why: 'Planted. You see it nowhere but this check.', show: { how: 'image', src: 'vote/none.png' } });
    const reg2 = JSON.parse(JSON.stringify(reg));
    reg2.items.unshift(mk('gate-planted-at-the-head', '12/31')); reg2.items.push(mk('gate-planted-appended', today));
    plant = JSON.stringify(reg2);
    const read = async () => { await open(); return p.evaluate(() => ({ list: Array.from(document.querySelectorAll('#list .row')).map(r => r.getAttribute('data-id')),
      more: +(document.getElementById('fold').hidden ? 0 : document.getElementById('foldn').textContent) })); };
    triPlant = JSON.stringify({ made: 'gate', cap: 12, tags: {} });
    const bare2 = await read();
    ok('NEW CARDS SHOW FIRST: with nothing tagged, two planted untagged cards lead his first screen (one at the head of the file, one appended)',
       bare2.list[0] === 'gate-planted-at-the-head' && bare2.list.indexOf('gate-planted-appended') >= 0 && bare2.list.indexOf('gate-planted-appended') < 12, bare2.list.slice(0, 3).join(', '));
    const realTags = (TRI && TRI.tags) || {}, realCap = (TRI && TRI.cap) || 12;
    triPlant = JSON.stringify({ made: 'gate', cap: realCap, tags: realTags });
    const tagged = await read();
    const reds2 = redsWanted.length, a = tagged.list.indexOf('gate-planted-at-the-head'), z = tagged.list.indexOf('gate-planted-appended');
    ok('  with the coordinator\'s real tags they sit right after the ' + reds2 + ' red while the cap (' + realCap + ') has room, else first behind MORE',
       reds2 + 2 <= realCap ? (a === Math.min(reds2, realCap) && z > a && z < realCap) : (a < 0 && tagged.more > 0), 'at ' + a + ' and ' + z + ' of ' + tagged.list.length);
    const demote = Object.assign({}, realTags, { 'gate-planted-at-the-head': { tag: 'yellow' }, 'gate-planted-appended': { tag: 'green' } });
    triPlant = JSON.stringify({ made: 'gate', cap: realCap, tags: demote });
    const dem = await read();
    await p.evaluate(() => { const f = document.getElementById('fold'); if (f && !f.hidden && document.getElementById('more').hidden) f.click(); });
    await p.waitForTimeout(80);
    const behind = await p.evaluate(() => Array.from(document.querySelectorAll('#more .row')).map(r => r.getAttribute('data-id')));
    ok('  a tag only demotes: tagged yellow it waits behind MORE, tagged green it is nowhere', dem.list.indexOf('gate-planted-at-the-head') < 0 && behind.indexOf('gate-planted-at-the-head') >= 0
       && dem.list.concat(behind).indexOf('gate-planted-appended') < 0, behind.length + ' behind MORE');
    plant = null; triPlant = null; await open();
  }
  /* AND WITHOUT THE SORT FILE THE TAB SHOWS EVERYTHING, NEVER NOTHING (the row's done-test) */
  noSort = true; await open();
  const bare = await p.evaluate(() => ({ n: document.querySelectorAll('#list .row').length, fold: !document.getElementById('fold').hidden }));
  const unsorted = (reg.items || []).filter(i => !(reg.verdicts || []).some(v => v.id === i.id)).length;
  ok('  and with the sort file missing, every waiting thing shows, no fold', bare.n === unsorted && !bare.fold, bare.n + ' shown of ' + unsorted + (bare.fold ? ', a fold' : ''));
  noSort = false;
  await open(); rows = await live();

  /* ---- 3. THE THUMB: every control on a row is 44 -------------------------- */
  const small = await p.evaluate((MIN) => {
    const out = [];
    const check = (el, what) => {
      const r = el.getBoundingClientRect();
      if (r.width < MIN - 0.5 || r.height < MIN - 0.5)
        out.push(what + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    };
    const row = document.querySelector('#list .row');
    if (row) {
      check(row.querySelector('.tb.up'), 'up');
      check(row.querySelector('.tb.down'), 'down');
      check(row.querySelector('.look'), 'look');
    }
    ['sun', 'out', 'out2', 'undo'].forEach(id => {
      const e = document.getElementById(id); if (e) check(e, id);
    });
    return out;
  }, MIN);
  ok('every control is 44 on an iPhone in portrait', small.length === 0, small.join(', '));

  /* NOTHING RUNS OFF THE SIDE. He judges on a phone; a row wider than the screen is a
     row he cannot read. */
  const wide = await p.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok('nothing runs off the side of the screen', wide <= 1, wide + 'px over');

  /* ---- 3b. A CARD'S PICTURE, FULL SIZE (RUN TWO, rule 89: what he cannot see he cannot judge) ----------------
     COMBAT TWO measured its district card: a 2400 x 7080 sheet put five boards across his phone at about 75 points
     each, and a picture too small to read gets a NO for the wrong reason. Measured here on 390 x 844 with real touches:
     a tap on the card's picture lays it over the whole screen at ONE IMAGE PIXEL TO ONE POINT, centred on the spot
     tapped; one finger drags it, two pinch it around the point between them, a tap closes it and votes nothing; no
     button is added to the card's face; and the card's FIRST picture is one thing (show.first, cut from its own sheet
     by tools/bohemia_run2_first_picture.py), never a sheet of many: it fits one screen of his phone at the card's
     width. Cards made before 10/19 and not on his first screen are left as they were. */
  {
    const cdp = await ctx.newCDPSession(p);
    const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((q, k) => ({ x: q[0], y: q[1], id: k })) });
    const fvState = () => p.evaluate(() => window.__voteFull ? window.__voteFull.state() : null);
    const lookAt = async (id) => {
      const sel = '.row[data-id="' + id + '"]';
      if (!(await p.$(sel))) { await p.evaluate(() => { const f = document.getElementById('fold'); if (f && !f.hidden && document.getElementById('more').hidden) f.click(); }); await p.waitForTimeout(80); }
      await p.evaluate(s => { const b = document.querySelector(s + ' .look'); if (b && b.textContent !== 'HIDE IT') b.click(); }, sel);
      await p.evaluate(s => { const i = document.querySelector(s + ' .stage img'); if (i) i.scrollIntoView({ block: 'start' }); }, sel);   /* the picture loads lazily, as on his phone */
      await p.waitForFunction(s => { const i = document.querySelector(s + ' .stage img'); return i && i.complete && i.naturalWidth > 0; }, sel, { timeout: 30000 }).catch(() => {});
      return p.evaluate(s => { const i = document.querySelector(s + ' .stage img'); if (!i) return null; const r = i.getBoundingClientRect(); return { src: i.getAttribute('src'), w: r.width, h: r.height, nw: i.naturalWidth, nh: i.naturalHeight }; }, sel);
    };
    const regItems = reg.items || [];
    const onFront = rows.slice();
    const withFirst = onFront.map(id => regItems.find(i => i.id === id)).find(i => i && i.show && i.show.how === 'image' && i.show.first && i.show.firstAt);
    const plain = onFront.map(id => regItems.find(i => i.id === id)).find(i => i && i.show && i.show.how === 'image' && !i.show.first);
    if (!withFirst) ok('FULL SIZE: a card on his first screen carries a first picture to measure', false, 'none on the front');
    else {
      const sel = '.row[data-id="' + withFirst.id + '"]';
      const st = await lookAt(withFirst.id);
      ok('FULL SIZE: a sheet card shows its first picture, one thing, on the card', !!st && st.src === withFirst.show.first, withFirst.id + ': ' + (st && st.src));
      const sheet = await p.evaluate(s => new Promise(r => { const i = new Image(); i.onload = () => r([i.naturalWidth, i.naturalHeight]); i.onerror = () => r([0, 0]); i.src = s; }), withFirst.show.src);
      /* tap a third of the way across and a quarter down the shown picture */
      const at = await p.evaluate(s => { const i = document.querySelector(s + ' .stage img'); i.scrollIntoView({ block: 'start' }); const r = i.getBoundingClientRect();
        const y = Math.min(r.top + r.height * 0.25, window.innerHeight - 20); return { x: r.left + r.width / 3, y, fx: 1 / 3, fy: (y - r.top) / r.height }; }, sel);
      await p.touchscreen.tap(at.x, at.y);
      await p.waitForSelector('#full[data-ready="1"]', { timeout: 30000 }).catch(() => {});
      const fv = await p.evaluate(() => { const e = document.getElementById('full'); if (!e || e.hidden) return null; const i = e.querySelector('img'), r = i.getBoundingClientRect(), er = e.getBoundingClientRect();
        return { img: [r.left, r.top, r.width, r.height], nat: [i.naturalWidth, i.naturalHeight], cover: [er.left, er.top, er.width, er.height], vw: innerWidth, vh: innerHeight, src: i.getAttribute('src') }; });
      ok('  a tap on the picture lays it over the whole screen (390 x 844)', !!fv && fv.cover[0] === 0 && fv.cover[1] === 0 && fv.cover[2] === fv.vw && fv.cover[3] === fv.vh, fv ? fv.cover.map(Math.round).join(' x ') : 'never opened');
      ok('  it opens the whole sheet at one image pixel to one point (shown width = the sheet\'s own width)', !!fv && fv.src === withFirst.show.src && Math.abs(fv.img[2] - fv.nat[0]) < 0.5 && Math.abs(fv.img[3] - fv.nat[1]) < 0.5 && fv.nat[0] === sheet[0],
         fv ? Math.round(fv.img[2]) + ' x ' + Math.round(fv.img[3]) + ' pt for a ' + sheet.join(' x ') + ' sheet' : '');
      /* centred on the tapped pixel, as near as the sheet's own edge allows (it never slides off and shows black) */
      const fa = withFirst.show.firstAt, tapped = [fa[0] + at.fx * fa[2], fa[1] + at.fy * fa[3]];
      const edge = (c, view, size) => size <= view ? size / 2 : view / 2 - Math.min(0, Math.max(view - size, view / 2 - c));
      const want = fv ? [edge(tapped[0], fv.vw, fv.nat[0]), edge(tapped[1], fv.vh, fv.nat[1])] : tapped;
      const under = fv ? [fv.vw / 2 - fv.img[0], fv.vh / 2 - fv.img[1]] : [0, 0];
      ok('  on the spot he tapped: the sheet\'s pixel under his thumb is in the middle of the screen, as near as the sheet\'s edge allows', !!fv && Math.abs(under[0] - want[0]) < 2.5 && Math.abs(under[1] - want[1]) < 2.5,
         'middle shows ' + under.map(Math.round).join(',') + ', tapped ' + tapped.map(Math.round).join(',') + ', edge-held ' + want.map(Math.round).join(','));
      const s0 = await fvState();
      await touch('touchStart', [[200, 400]]); for (let k = 1; k <= 5; k++) await touch('touchMove', [[200 - k * 20, 400 - k * 30]]); await touch('touchEnd', []);
      await p.waitForTimeout(60);
      const s1 = await fvState();
      /* as far as the sheet's own edge allows: a sheet narrower than the drag stops at its edge, never shows black (10/19:
         UI's 828-wide top-bar sheet, tapped a third across, has 81 pt left to give) */
      const room = (v, d, size, view) => { const lo = Math.min(0, view - size); return Math.max(lo, Math.min(0, v + d)) - v; };
      const wantD = s0 ? [room(s0.x, -100, s0.nw * s0.s, fv.vw), room(s0.y, -150, s0.nh * s0.s, fv.vh)] : [-100, -150];
      ok('  one finger drags it (100 left, 150 up moves it 100 left, 150 up, as far as its edge allows)', !!s1 && Math.abs((s1.x - s0.x) - wantD[0]) < 1 && Math.abs((s1.y - s0.y) - wantD[1]) < 1 && s1.open && (wantD[0] !== 0 || wantD[1] !== 0), s1 ? Math.round(s1.x - s0.x) + ', ' + Math.round(s1.y - s0.y) + ' (room ' + wantD.map(Math.round).join(', ') + ')' : '');
      const ix = (200 - s1.x) / s1.s, iy = (400 - s1.y) / s1.s;
      await touch('touchStart', [[150, 400], [250, 400]]); for (let k = 1; k <= 5; k++) await touch('touchMove', [[150 - k * 20, 400], [250 + k * 20, 400]]); await touch('touchEnd', []);
      await p.waitForTimeout(60);
      const s2 = await fvState();
      const held = s2 ? [(200 - s2.x) / s2.s, (400 - s2.y) / s2.s] : [0, 0];
      ok('  two fingers pinch it (spread 100 to 300: three times bigger) around the point between them', !!s2 && Math.abs(s2.s / s1.s - 3) < 0.01 && Math.abs(held[0] - ix) < 1 && Math.abs(held[1] - iy) < 1 && s2.open,
         s2 ? 'x' + (s2.s / s1.s).toFixed(2) + ', the point between moved ' + Math.round(Math.abs(held[0] - ix) + Math.abs(held[1] - iy)) + ' px' : '');
      await p.touchscreen.tap(195, 300); await p.waitForTimeout(520);
      const s3 = await fvState();
      const still = await p.$(sel);
      ok('  a tap closes it, and the card is still waiting (closing never votes, never re-opens)', !!s3 && !s3.open && !!still, (s3 && s3.open ? 'still open' : 'closed') + ', card ' + (still ? 'there' : 'gone'));
    }
    if (plain) {
      const st = await lookAt(plain.id);
      await p.evaluate(s => { const i = document.querySelector(s + ' .stage img'); i.scrollIntoView({ block: 'center' }); }, '.row[data-id="' + plain.id + '"]');
      const c = await p.evaluate(s => { const r = document.querySelector(s + ' .stage img').getBoundingClientRect(); return { x: r.left + r.width / 2, y: Math.max(r.top + 4, Math.min(r.top + r.height / 2, innerHeight - 20)) }; }, '.row[data-id="' + plain.id + '"]');
      await p.touchscreen.tap(c.x, c.y);
      await p.waitForSelector('#full[data-ready="1"]', { timeout: 30000 }).catch(() => {});
      const fv = await p.evaluate(() => { const e = document.getElementById('full'); if (!e || e.hidden) return null; const i = e.querySelector('img'), r = i.getBoundingClientRect(); return { w: r.width, nw: i.naturalWidth, src: i.getAttribute('src') }; });
      ok('  a card with one picture opens that picture at one image pixel to one point', !!fv && !!st && fv.src === plain.show.src && Math.abs(fv.w - fv.nw) < 0.5, plain.id + (fv ? ': ' + Math.round(fv.w) + ' pt of ' + fv.nw + ' px' : ': never opened'));
      await p.keyboard.press('Escape'); await p.waitForTimeout(60);
    }
    const faces = await p.evaluate(() => Array.from(document.querySelectorAll('.row')).map(r => r.querySelectorAll('button').length));
    ok('  no new button on any card\'s face (up, star, no, LOOK AT IT: four)', faces.length > 0 && faces.every(n => n === 4), faces.length + ' cards, ' + Array.from(new Set(faces)).join('/') + ' buttons');
    /* THE FIRST PICTURE IS ONE THING: on his phone it fits one screen at the card's width (a sheet of many runs on for
       screens, every thing on it a thumbnail). Every image card on his first screen, and every card made from 10/19. */
    const madeN = i => { const m = String(i.made || '').match(/^(\d{1,2})\/(\d{1,2})/); return m ? (+m[1]) * 100 + (+m[2]) : 0; };
    const judgedIds = new Set((reg.verdicts || []).map(v => v.id));
    const bound = regItems.filter(i => i && i.show && i.show.how === 'image' && !judgedIds.has(i.id) && kept(i.id) && (onFront.indexOf(i.id) >= 0 || madeN(i) >= 1019));
    const tall = [];
    for (const it of bound) {
      const st = await lookAt(it.id);
      if (!st || !st.nw) { tall.push(it.id + ' (no picture)'); continue; }
      if (st.h > 844) tall.push(it.id + ' ' + Math.round(st.h) + ' pt tall');
    }
    ok('  every card\'s first picture is one thing: it fits one screen of his phone (' + bound.length + ' cards: his first screen and every card from 10/19)', bound.length > 0 && tall.length === 0, tall.slice(0, 3).join('; ') || 'all fit');
    await cdp.detach().catch(() => {});
    await open(); rows = await live();
  }

  /* ---- 4. SUN IS THE DEFAULT, NIGHT IS THE OPTION -------------------------- */
  const lightFirst = await p.evaluate(() => {
    const c = getComputedStyle(document.body).backgroundColor;
    const m = c.match(/\d+/g) || [0, 0, 0];
    return (+m[0] + +m[1] + +m[2]) / 3;
  });
  ok('it opens readable in the sun', lightFirst > 170, 'brightness ' + Math.round(lightFirst));
  await p.click('#sun');
  const darkAfter = await p.evaluate(() => {
    const c = getComputedStyle(document.body).backgroundColor;
    const m = c.match(/\d+/g) || [255, 255, 255];
    return (+m[0] + +m[1] + +m[2]) / 3;
  });
  ok('the night switch really switches', darkAfter < 80, 'brightness ' + Math.round(darkAfter));
  await p.click('#sun');

  /* ---- 5. THE COMMENT BOX IS AT THE BOTTOM --------------------------------- */
  const footLast = await p.evaluate(() => {
    const f = document.getElementById('foot');
    const l = document.getElementById('list');
    if (!f || !l) return false;
    return f.getBoundingClientRect().top >= l.getBoundingClientRect().bottom - 1;
  });
  ok('the comment box sits under the whole queue', footLast);

  /* ---- 6. A VOTE CONSUMES: THE PHONE --------------------------------------- */
  if (!(await p.$('#list .row'))) { await p.click('#fold'); await p.waitForTimeout(150); }
  rows = await live();
  const top = rows[0];
  await p.fill('.row[data-id="' + top + '"] textarea.note', 'this is the note on the top one');
  await p.click('.row[data-id="' + top + '"] .tb.up');
  await p.waitForTimeout(320);
  rows = await live();
  ok('the thing he voted on leaves the second he taps', rows.indexOf(top) < 0);

  await open();
  rows = await live();
  ok('it is still gone after a reload', rows.indexOf(top) < 0, rows.length + ' left');

  /* HIS WORDS SURVIVE THE VOTE, and the export is a person-readable .txt. */
  const out = await p.evaluate(() => {
    const k = 'bohemia.vote.verdicts.v1';
    return localStorage.getItem(k);
  });
  ok('his comment is kept with his vote',
     !!out && out.indexOf('this is the note on the top one') >= 0);

  /* ---- 7. PUT THE LAST ONE BACK -------------------------------------------- */
  /* Undo only reaches this phone's memory, so after a RELOAD there is nothing to put
     back -- which is the honest behaviour and is what this leg pins. */
  await p.click('#undo');
  await p.waitForTimeout(80);
  const undoSays = await p.textContent('#saidit');
  ok('after a reload there is nothing to put back, and it says so',
     /nothing to put back/i.test(undoSays || ''), (undoSays || '').slice(0, 40));

  /* THE STAR (RUN TWO [the star], 10/18, rule 115(h)): his first star was a sentence in a note; now every card carries a
     STAR beside YES and NO, one tap, it leaves like a vote, and the .txt says STAR with his words and "star":true for the
     registry, the vote still 'up' so every lane reading a YES still reads it */
  if (!(await p.$('#list .row')) && !(await p.$('#more .row'))) { await p.click('#fold'); await p.waitForTimeout(150); }
  rows = await live();
  const allStar = await p.evaluate(() => { const rs = Array.from(document.querySelectorAll('.row')); return rs.length > 0 && rs.every(r => !!r.querySelector('.tb.up') && !!r.querySelector('.tb.star') && !!r.querySelector('.tb.down')); });
  const starred = rows[0];
  const starBox = starred ? await p.evaluate(id => { const b = document.querySelector('.row[data-id="' + id + '"] .tb.star').getBoundingClientRect(); return Math.min(b.width, b.height); }, starred) : 0;
  if (starred) {
    await p.fill('.row[data-id="' + starred + '"] textarea.note', 'the gate hands out a star');
    await p.tap('.row[data-id="' + starred + '"] .tb.star'); await p.waitForTimeout(320);
  }
  const gone = starred && (await live()).indexOf(starred) < 0;
  await p.evaluate(() => { window.__blobs = []; const o = URL.createObjectURL; URL.createObjectURL = b => { window.__blobs.push(b); return o.call(URL, b); }; });
  await p.click('#out'); await p.waitForTimeout(200);
  const exp = await p.evaluate(async () => window.__blobs.length ? await window.__blobs[window.__blobs.length - 1].text() : '');
  ok('every card carries a STAR beside YES and NO, 44 points, one tap, and it leaves like a vote', allStar && starBox >= 44 && gone, starred + ', star ' + Math.round(starBox) + ' pt');
  ok('  the .txt says STAR with his words, and the registry line carries "star":true on a YES',
     /\nSTAR  ?\S/.test(exp) && exp.indexOf('the gate hands out a star') >= 0 && exp.indexOf('"id":' + JSON.stringify(starred) + ',"vote":"up","star":true') >= 0,
     (exp.split('\n').filter(l => /^STAR/.test(l))[0] || 'no STAR line').slice(0, 60));

  /* ---- 8. A VOTE CONSUMES: THE REGISTRY (the leg that matters) ------------- */
  /* Plant a verdict on a candidate this phone has never seen. A cleared cache must
     not resurrect it. This is the exact complaint: "it needs to stop presenting
     itself like I didn't just vote on it." */
  /* one he can see, AND one the queue counts (10/13: rows[0] could be a card the triage keeps out of the count, so the plant
     landed on nothing and the leg below read one short) */
  const victim = rows.find(x => want.indexOf(x) >= 0) || want[0];
  const planted = JSON.parse(JSON.stringify(reg));
  planted.verdicts.push({ id: victim, vote: 'down', said: 'planted by the gate', when: '9/15' });
  plant = JSON.stringify(planted);

  const fresh = await b.newContext({ viewport: { width: 390, height: 844 },
                                     deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p2 = await fresh.newPage();
  await p2.goto(url('slices/BOHEMIA_VOTE_TAB.html'), { waitUntil: 'load', timeout: 60000 });
  await p2.waitForFunction('window.__voteReady === true', null, { timeout: 20000 });
  await p2.waitForTimeout(120);
  const rows2 = await queue(p2);
  ok('a candidate with a verdict in the registry never renders again, even on a clean phone',
     rows2.indexOf(victim) < 0, 'planted ' + victim);
  ok('and the rest of the queue is untouched by that',
     rows2.length === want.length - 1, rows2.length + ' of ' + (want.length - 1) + ' ' + JSON.stringify({ victim: victim, rows0: rows[0], extra: rows2.filter(x => want.indexOf(x) < 0), missing: want.filter(x => x !== victim && rows2.indexOf(x) < 0) }));
  await fresh.close();
  plant = null;

  /* ---- 9. A REDO NEVER ARRIVES BLIND -------------------------------------- */
  const redo = JSON.parse(JSON.stringify(reg));
  redo.items.push({ id: 'gate-redo-probe', kind: 'redo', lane: 'ui', sha: 'deadbee',
                    made: '9/15', title: 'THE PROBE, REDONE',
                    why: 'the gate planted this', redoOf: want[0],
                    said: 'it looked like a spreadsheet',
                    show: { how: 'text', src: 'the words' } });
  plant = JSON.stringify(redo);
  const fr2 = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p3 = await fr2.newPage();
  await p3.goto(url('slices/BOHEMIA_VOTE_TAB.html'), { waitUntil: 'load', timeout: 60000 });
  await p3.waitForFunction('window.__voteReady === true', null, { timeout: 20000 });
  await queue(p3);   /* a redo nobody has sorted yet waits behind the fold */
  const quoted = await p3.evaluate(() => {
    const r = document.querySelector('#list .row[data-id="gate-redo-probe"], #more .row[data-id="gate-redo-probe"]');
    const q = r && r.querySelector('.quote');
    return q ? q.textContent : '';
  });
  ok('a redo quotes back what he said about the one it replaces',
     /REDONE/.test(quoted) && quoted.indexOf('it looked like a spreadsheet') >= 0,
     quoted.slice(0, 60));
  await fr2.close();
  plant = null;

  /* ---- 10. THE ALPHA POINTS AT THE QUEUE, NOT AT THE OLD JUDGE PAGE -------- */
  const alpha = fs.readFileSync(ALPHA, 'utf8');
  ok('the VOTE tab opens the one queue',
     /id="voteFrame"[^>]*data-src="BOHEMIA_VOTE_TAB\.html"/.test(alpha));
  ok('the old per-lane judge page is not what anything new is presented in',
     alpha.indexOf('data-src="BOHEMIA_VOTE_CURRENT.html"') < 0);
  ok('the gear has a door to it', /id="setvote"/.test(alpha) && /id="votewrap"/.test(alpha));

  /* ---- 11. THE DOOR SURVIVES THE CUT -------------------------------------- */
  /* THE REAL CUTTER, ON A THROWAWAY COPY. Rule 14a: only RUN re-cuts the demo, so this
     builds its own tree in a temp folder and never touches slices/BOHEMIA_DEMO.html.
     Reading the tool's source and reasoning about it would not be a measurement; it
     was exactly that kind of reasoning ("the handler is defensive already") that this
     lane has already been wrong about once. */
  let cutOk = false, cutWhy = '';
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'votecut-'));
  try {
    fs.mkdirSync(path.join(tmp, 'slices'));
    fs.mkdirSync(path.join(tmp, 'tools'));
    fs.copyFileSync(ALPHA, path.join(tmp, 'slices/BOHEMIA_ALPHA_0_9.html'));
    fs.copyFileSync(path.join(ROOT, 'tools/bohemia_cut_the_demo.js'),
                    path.join(tmp, 'tools/bohemia_cut_the_demo.js'));
    execFileSync(process.execPath, [path.join(tmp, 'tools/bohemia_cut_the_demo.js')],
                 { stdio: 'pipe' });
    const cut = fs.readFileSync(path.join(tmp, 'slices/BOHEMIA_DEMO.html'), 'utf8');
    const hasDoor = /id="setvote"/.test(cut) && /id="votewrap"/.test(cut)
                    && cut.indexOf('BOHEMIA_VOTE_TAB.html') >= 0;
    const tabGone = !/class="tab(?: on)?" data-p="vote"/.test(cut);
    cutOk = hasDoor && tabGone;
    cutWhy = 'door ' + hasDoor + ', tab removed ' + tabGone;
  } catch (e) {
    cutWhy = String(e.message).slice(0, 90);
  } finally {
    try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (e) {}
  }
  ok('cutting the demo removes the VOTE tab and keeps the gear door', cutOk, cutWhy);

  /* ---- 12. THE DOOR ACTUALLY OPENS IT ------------------------------------- */
  /* Measured on the alpha, because it is the surface this round ships on; the cut above
     is what proves the same markup reaches the demo. */
  let doorOk = false, doorWhy = '';
  let landingOk = false, landingWhy = 'never reached the door';
  try {
    /* A CLEAN CONTEXT FOR THE ALPHA. The queue sweep above wrote votes into localStorage
       on this same origin, and the alpha reads its own saved state from there; judging the
       front door of the game through a phone this gate has already been typing on is not
       measuring what a player meets. */
    const acx = await b.newContext({ viewport: { width: 390, height: 844 },
                                     isMobile: true, hasTouch: true });
    const p4 = await acx.newPage();
    p4.on('pageerror', e => errs.push('alpha: ' + String(e).slice(0, 100)));
    await p4.goto(url('slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load', timeout: 120000 });
    /* ENTER THE WAY HE DOES. MEASURED, NOT ASSUMED, and the first two tries were wrong:
       the element that carries the words TAP TO ENTER reports a 0x0 box the whole time it
       is up, so aiming at its centre aims at (0,0) and a probe that skipped the tap on
       that basis sat on the splash for twenty seconds. The splash itself is the button:
       it covers the screen and a tap anywhere on it opens the game. So this taps the
       middle of the screen, which is what a thumb does. */
    await p4.waitForSelector('#front', { state: 'visible', timeout: 60000 });
    /* *** WAIT FOR THE DOOR TO BE A DOOR. *** Rule 18a: nothing is tappable until it is
       loaded, and the splash handler opens with `if(!window.__LOAD_READY) return;`. This
       gate tapped immediately, so its tap was A NO-OP and the game opened later by some
       other route -- which is why the landing leg first came back tab=run/p-city about a
       build that lands on vote correctly when you tap it the way a player does (measured
       directly: run/p-city -> vote/p-vote, and it stays there). A probe that presses a
       button before the button exists is measuring its own impatience. */
    await p4.waitForFunction(() => window.__LOAD_READY === true, { timeout: 180000 });
    await p4.mouse.click(195, 500);
    /* *** THE LANDING LEG. PAOLO SAID IT TWICE: "in the alpha why does it open the run
       first thing, I told you to not have that happen." Ruled 9/20 (rule 15g), still
       true on main 9/22, built 9/22.
       It is checked HERE, right after the door, because that is the only moment the
       claim is about: what he is looking at the instant BEGIN hands over. A check any
       later measures whatever the gate itself tapped since. */
    await p4.waitForTimeout(900);
    const landed = await p4.evaluate(() => {
      const on = document.querySelector('.tab.on');
      const p  = document.querySelector('.panel.on');
      const f  = document.getElementById('voteFrame');
      return { tab: on ? on.dataset.p : null, panel: p ? p.id : null,
               framed: !!(f && (f.getAttribute('src') || '').indexOf('BOHEMIA_VOTE_TAB') >= 0) };
    });
    landingOk = landed.tab === 'vote' && landed.panel === 'p-vote' && landed.framed;
    landingWhy = JSON.stringify(landed);

    /* *** THE COLD OPEN CANNOT APPEAR ANY MORE, AND THIS LEG SAT ON IT FOR 90 SECONDS.
       *** The invite hangs off a tap on the RUN tab (alpha, openInviteShow), and THIS
       LANE'S OWN 9/22 LANDING means the alpha opens on VOTE and nobody ever taps RUN.
       So #openNot never becomes visible, the wait burned its full timeout, and the leg
       reported the GEAR'S VOTE DOOR as broken while never once testing it. Red on clean
       origin/main too, so it was telling every other lane the same wrong thing.
       A DISMISSAL THAT IS NOT NEEDED IS NOT A FAILURE: dismiss it if it is there, give
       it two seconds to turn up, and carry on to the thing this leg is actually about. */
    const invite = await p4.waitForSelector('#openNot', { state: 'visible', timeout: 2000 })
      .catch(() => null);
    if (invite) await p4.click('#openNot');
    await p4.waitForSelector('#gearbtn.on', { timeout: 90000 });
    /* *** THIS LEG FLAKED ABOUT ONE RUN IN FOUR AND TWO OTHER LANES NEARLY CLAIMED THE
       RED AS THEIR OWN (FACTIONS df8dd14d, WORDS ee5ad2af; coordinator's row [flaky leg],
       9/21b). The cause is a race this gate created, not anything in the game.
       #gearbtn.on is painted by a setInterval, and the cold open is still unwinding when
       it lands: the NOT NOW tap starts the overlay closing but #openWrap keeps the gear's
       pixel for a few more frames. Playwright clicks the CENTRE of the element it is
       given, so on the unlucky runs the click went into the overlay, settings never
       opened, and the next line sat on a ten-second timer and called the game broken.
       A TIMER IS NOT A SIGNAL. Wait for the page's own answer to the only question that
       matters -- is the gear the thing under its own centre pixel -- and then, after the
       click, wait for the SETTINGS PANEL'S OWN STATE (#setwrap.on) rather than for a
       child of it to become measurable. Same shape as the driver's own clearAxis, which
       exists for exactly this reason (rule 14g, trap 6). */
    await p4.waitForFunction(() => {
      const g = document.getElementById('gearbtn');
      if (!g) return false;
      const r = g.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      const own = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return !!own && (own === g || g.contains(own));
    }, null, { timeout: 60000 });
    await p4.click('#gearbtn');
    await p4.waitForSelector('#setwrap.on', { timeout: 60000 });
    await p4.waitForSelector('#setvote', { state: 'visible', timeout: 60000 });
    const reach = await p4.evaluate(() => {
      const r = document.getElementById('setvote').getBoundingClientRect();
      return [Math.round(r.width), Math.round(r.height)];
    });
    await p4.click('#setvote');
    await p4.waitForTimeout(500);
    const state = await p4.evaluate(() => {
      const w = document.getElementById('votewrap');
      const f = document.getElementById('voteOver');
      const s = document.getElementById('setwrap');
      return { on: !!(w && w.classList.contains('on')),
               src: f ? (f.getAttribute('src') || '') : '',
               settingsClosed: !(s && s.classList.contains('on')) };
    });
    doorOk = state.on && state.src === 'BOHEMIA_VOTE_TAB.html' && state.settingsClosed
             && reach[0] >= MIN && reach[1] >= MIN;
    doorWhy = JSON.stringify(state) + ' reach ' + reach.join('x');
    await acx.close();
  } catch (e) { doorWhy = String(e.message).slice(0, 100); }
  /* HIS OWN SENTENCE, TWICE, AS ONE LEG */
  ok('THE ALPHA LANDS ON VOTE AFTER BEGIN, not on the run', landingOk, landingWhy);
  ok('  and the vote page is really loaded into it, not an empty box',
     /"framed":true/.test(landingWhy), landingWhy);

  ok('tapping VOTE in the gear opens the queue and closes settings behind it',
     doorOk, doorWhy);

  ok('nothing threw anywhere in this sweep', errs.length === 0, errs.slice(0, 2).join(' | '));

  done(srv, b);
})().catch(e => { console.error(e); process.exit(1); });
