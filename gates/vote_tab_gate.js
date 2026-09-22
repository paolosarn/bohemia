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
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
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
  let reg;
  try { reg = JSON.parse(fs.readFileSync(REG, 'utf8')); }
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
    Array.from(document.querySelectorAll('#list .row')).map(r => r.getAttribute('data-id')));

  let rows = await live();
  const want = (reg.items || []).filter(i => !(reg.verdicts || []).some(v => v.id === i.id))
                                .map(i => i.id);
  ok('every unjudged candidate is in the queue',
     rows.length === want.length && want.every(id => rows.indexOf(id) >= 0),
     rows.length + ' drawn, ' + want.length + ' waiting');
  /* NEWEST FIRST. The registry is appended to, so the LAST item in the file is the
     newest thing anybody made, and it has to be the first thing he sees. */
  ok('the newest thing is at the top', rows[0] === want[want.length - 1],
     'top is ' + rows[0]);

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
  const top = rows[0];
  await p.fill('#list .row textarea.note', 'this is the note on the top one');
  await p.click('#list .row .tb.up');
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

  /* ---- 8. A VOTE CONSUMES: THE REGISTRY (the leg that matters) ------------- */
  /* Plant a verdict on a candidate this phone has never seen. A cleared cache must
     not resurrect it. This is the exact complaint: "it needs to stop presenting
     itself like I didn't just vote on it." */
  const victim = want[0];
  const planted = JSON.parse(JSON.stringify(reg));
  planted.verdicts.push({ id: victim, vote: 'down', said: 'planted by the gate', when: '9/15' });
  plant = JSON.stringify(planted);

  const fresh = await b.newContext({ viewport: { width: 390, height: 844 },
                                     deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p2 = await fresh.newPage();
  await p2.goto(url('slices/BOHEMIA_VOTE_TAB.html'), { waitUntil: 'load', timeout: 60000 });
  await p2.waitForFunction('window.__voteReady === true', null, { timeout: 20000 });
  await p2.waitForTimeout(120);
  const rows2 = await p2.evaluate(() =>
    Array.from(document.querySelectorAll('#list .row')).map(r => r.getAttribute('data-id')));
  ok('a candidate with a verdict in the registry never renders again, even on a clean phone',
     rows2.indexOf(victim) < 0, 'planted ' + victim);
  ok('and the rest of the queue is untouched by that',
     rows2.length === want.length - 1, rows2.length + ' of ' + (want.length - 1));
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
  const quoted = await p3.evaluate(() => {
    const r = document.querySelector('#list .row[data-id="gate-redo-probe"]');
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

    await p4.waitForSelector('#openNot', { state: 'visible', timeout: 90000 });
    await p4.click('#openNot');
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
