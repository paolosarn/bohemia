/* ============================================================================
   THERE ARE ENEMIES (9/5/26, RUN lane) -- VAMILY [enemies exist].

   PAOLO PLAYED IT: "Awesome I just played the run. Where the enemies at bro."
   Ruling: records/BOHEMIA_RULING_WHERE_THE_ENEMIES_AT_9_5_26.md, which measured
   the honest sentence: THE GAME KNOWS WHO YOUR ENEMIES ARE AND HAS NEVER ONCE
   PUT ONE IN FRONT OF YOU. Every "hostile" string in the alpha, the city and the
   demo was prose; hostility existed only as a sign on a relationship.

   THIS GATE HOLDS THE BODY. Not the fight -- COMBAT owns contact -- and not the
   map tell, which is UI's. Just: standing on the street he walks, is there
   somebody who means him harm, is it somebody the world can name, and can he
   see them before they are on top of him.

   *** IT IS SERVED, NOT OPENED. *** Off disk the demo's own injections silently
   no-op (see gates/demo_is_current_gate.js, 9/5), so a gate that drives the demo
   from a file:// path is measuring a build no player gets.

   *** AND THE READINESS CHECK IS NOT DAY.day. *** This cost most of the round.
   Every probe here first waited for `DAY.day >= 1`, which is true PART WAY
   THROUGH the city's script -- BohemiaBetween and ctBases are defined near the
   END of that file. So four separate measurements ran against a half-parsed
   city, reported "BohemiaBetween is not defined", and very nearly got written up
   as "the ledger is missing from the walked surface". IT IS NOT MISSING. Loaded
   directly, the city has it, 97 globals and zero errors. A READINESS CHECK THAT
   IS TRUE BEFORE THE FILE HAS FINISHED IS NOT A READINESS CHECK. This waits for
   something defined at the END.

   MUTATION PROOF, run 9/5:
     * never call hostilePass -> 2 red, including "walking at them puts bodies on
       the street -- 0 drawn"
     * drop the at-odds half of the danger rule, leaving only "who is hostile to
       ME" -> "somebody is still dangerous on day one (0: )" goes red, which is
       the whole reason that half exists: the obvious design ships this feature
       INVISIBLE on the exact surface he played and complained about
     * that same mutation ALSO turned ENGINE SYNC red on its own, because it
       edited engine/ and not the inlined copy. The sync claim caught a drift it
       was not aimed at, in the same run, which is what that law is for.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const H = require(path.join(ROOT, 'engine/bohemia_hostiles.js'));
const B = require(path.join(ROOT, 'engine/bohemia_between.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('THERE ARE ENEMIES: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
      const f = path.join(SLICES, rel);
      if (!f.startsWith(SLICES) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rs.statusCode = 404; return rs.end('no');
      }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
      fs.createReadStream(f).pipe(rs);
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

/* ---- 1. THE MODULE, IN NODE ---------------------------------------------- */
{
  const ids = B.keys();
  const danger = H.dangerous({ ids: ids, mine: 'Custom',
                               between: (a, b) => B.between(a, b) });
  /* THE ONE THAT WOULD HAVE SHIPPED THIS INVISIBLE. Measured: the canon graph
     holds 9 edges, 4 hostile, and NOT ONE touches Custom -- watchers('Custom')
     is empty on day 1. A feature keyed only on "who is hostile to ME" puts
     nobody on the street he just played. */
  ok('watchers(Custom) really is empty on day one, which is why the rule is not '
    + 'keyed on it', (B.watchers('Custom') || []).length === 0);
  ok('and somebody is still dangerous on day one (' + danger.length + ': '
    + danger.map(d => d.id).join(', ') + ')', danger.length >= 1);
  ok('every one of them can say WHY', danger.every(d => d.why === 'you' || d.why === 'odds'));
  ok('your own outfit is never the danger', !danger.some(d => d.id === 'Custom'));

  /* a valley where nobody is at odds has no crews. The feature degrades to
     nothing rather than to a spawner. */
  const none = H.dangerous({ ids: ids, mine: 'Custom', between: () => null });
  ok('a valley where nobody is at odds has NO dangerous outfits', none.length === 0);
  ok('and therefore no crews at all', H.near({ seed: 1, at: [0, 0], radius: 50,
       probe: () => ({ walk: true, open: 20, faction: 'Cartel' }), danger: none }).length === 0);

  /* placement */
  const probe = (x, y) => ({ walk: true, open: 20, edge: false, faction: 'Cartel' });
  const crews = H.near({ seed: 1234, at: [6205, 6271], radius: 60, probe: probe,
                         danger: [{ id: 'Cartel', why: 'odds' }], day: 1 });
  ok('crews are placed on ground that is somebody\'s (' + crews.length + ' near)',
     crews.length >= 1 && crews.every(c => c.faction === 'Cartel'));
  ok('and the same seed puts the same crews in the same places -- a place, not a '
    + 'spawner', JSON.stringify(crews) === JSON.stringify(
       H.near({ seed: 1234, at: [6205, 6271], radius: 60, probe: probe,
                danger: [{ id: 'Cartel', why: 'odds' }], day: 1 })));
  ok('a crew is a crew, not an army (' + crews.map(c => c.count).join(',') + ')',
     crews.every(c => c.count >= H.CREW[0] && c.count <= H.CREW[1]));

  /* THE LADDER, AND IT FITS THE CAMERA. The packs module's hard-won note: a
     state the camera cannot contain is not a state, it is a comment. The player
     sees about eight cells up. */
  const c0 = crews[0];
  ok('he is seen while they are still on screen (seeAt ' + c0.seeAt + ' cells)',
     c0.seeAt <= 8 && c0.seeAt > c0.closeAt);
  const at = c0.at;
  ok('far away they have not clocked him',
     H.stateOf(c0, [at[0] + 40, at[1]]) === 'idle');
  ok('inside the see distance they are watching',
     H.stateOf(c0, [at[0] + c0.seeAt, at[1]]) === 'watch');
  ok('and close, they are coming',
     H.stateOf(c0, [at[0] + c0.closeAt, at[1]]) === 'close');

  /* THE ALLEY. Same rule as the packs module on purpose: a tactic that works on
     dogs and not on people is a tactic that gets him killed. */
  const open = () => ({ walk: true, open: 20 });
  const narrow = (x, y) => (x === 0 && y === 0) ? { walk: true, open: 4 } : { walk: true, open: 20 };
  ok('in the open they surround him', H.ring(c0, [0, 0], open).length >= 1);
  ok('*** AND BACKING INTO A NARROW PLACE IS A REAL OUT *** -- they wait at the '
    + 'mouth of it', H.ring(c0, [0, 0], narrow).length === 0);
  ok('never more of them than there are of them',
     H.ring(c0, [0, 0], open).length <= c0.count);

  /* NO DAMAGE BEFORE THE DIAL. Not a comment -- read off the module. */
  const api = Object.keys(H).join(' ');
  ok('*** NO DAMAGE BEFORE THE DIAL *** -- the module has no attack, no damage '
    + 'and no health anywhere in its surface', !/attack|damage|health|hurt|hit/i.test(api));
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_hostiles.js'), 'utf8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '');     /* prose is allowed to say it */
  ok('and not in its code either', !/\b(damage|hp|health|attack)\s*[=(]/i.test(code));

  /* the words ship as an attempt, tagged */
  const w = H.words(c0);
  ok('what it says is a real attempt, tagged draft (' + (w && w.text) + ')',
     !!(w && w.text && w.draft === true));
}

/* ---- 2. ENGINE SYNC: the body in the slice IS the body in engine/ --------- */
{
  const engine = fs.readFileSync(path.join(ROOT, 'engine/bohemia_hostiles.js'), 'utf8');
  const city = fs.readFileSync(path.join(SLICES, 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const tag = '/* ==== engine/bohemia_hostiles.js ==== */';
  const i = city.indexOf(tag), j = city.indexOf(tag, i + tag.length);
  ok('the module is inlined in the walked city, with both markers', i > 0 && j > i);
  if (i > 0 && j > i) {
    const inlined = city.slice(i + tag.length, j).trim();
    ok('*** ENGINE SYNC: the body in the slice is the body in engine/, byte for '
      + 'byte ***', inlined === engine.trim());
  }
  ok('and the surface half is wired', city.indexOf('__THERE_ARE_ENEMIES__') > 0
     && /try \{ hostilePass\(ox, oy, C\); \}/.test(city));
}

/* ---- 3. THE REAL SURFACE ------------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); return done(); }

  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    await page.goto(base + 'BOHEMIA_DEMO.html', { waitUntil: 'load', timeout: 240000 });
    await SETTLE(page, 2500);
    await page.tap('#front').catch(async () => { await page.click('#front').catch(() => { }); });
    /* THE READINESS CHECK THAT IS ACTUALLY ONE -- see the header. */
    await SETTLE(page, 90000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try {
        return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1
          && typeof ctBases === 'function' && typeof BohemiaBetween !== 'undefined');
      } catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up, all the way to the end of its own file', !!city);
    if (!city) { await browser.close(); srv.close(); return done(); }

    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    for (let i = 0; i < 10; i++) {
      const up = await city.evaluate(() => {
        const d = document.getElementById('daycard');
        if (!d || getComputedStyle(d).display === 'none') return false;
        const g = d.querySelector('.dcgo') || d.querySelector('.dcbtn') || d.querySelector('.dcx');
        if (g) g.click(); return true;
      });
      if (!up) break;
      await SETTLE(page, 500);
    }
    await SETTLE(page, 1000);

    const live = await city.evaluate(() => {
      const o = {};
      try { o.danger = hostDanger().map(d => d.id); } catch (e) { o.dangerErr = String(e.message); }
      try {
        const n = BohemiaHostiles.near({ seed: seed, at: [hx, hy], radius: 60,
          probe: hostileProbe, danger: hostDanger(), density: 1, day: T.day });
        o.near = n.length;
        o.nearest = n.length ? Math.min.apply(null, n.map(c =>
          Math.max(Math.abs(c.at[0] - hx), Math.abs(c.at[1] - hy)))) : null;
        o.factions = Array.from(new Set(n.map(c => c.faction)));
        o.target = n.length ? n.slice().sort((a, b) =>
          Math.max(Math.abs(a.at[0] - hx), Math.abs(a.at[1] - hy))
          - Math.max(Math.abs(b.at[0] - hx), Math.abs(b.at[1] - hy)))[0].at : null;
      } catch (e) { o.nearErr = String(e.message); }
      o.at = [hx, hy];
      return o;
    });

    ok('*** ON THE SURFACE HE PLAYS, SOMEBODY IS DANGEROUS *** ('
      + (live.danger || []).join(', ') + ')', (live.danger || []).length >= 1);
    ok('and there are crews within sixty cells of where he wakes up ('
      + live.near + ', nearest ' + live.nearest + ' cells, '
      + (live.factions || []).join('/') + ')', live.near >= 1);

    /* WALK AT THE NEAREST ONE AND SEE IF A BODY ACTUALLY LANDS ON THE STREET.
       Not "does the module return a record" -- does the render draw a person. */
    let drew = 0;
    if (live.target) {
      const dx = Math.sign(live.target[0] - live.at[0]);
      const dy = Math.sign(live.target[1] - live.at[1]);
      const glyph = { '1,0': '→', '-1,0': '←', '0,1': '↓', '0,-1': '↑',
                      '1,1': '↘', '1,-1': '↗', '-1,1': '↙', '-1,-1': '↖'
                    }[dx + ',' + dy] || '→';
      const pad = await city.evaluateHandle(gl =>
        [...document.querySelectorAll('#pad .pb')].find(b => (b.textContent || '').trim() === gl)
        || document.querySelectorAll('#pad .pb')[0], glyph);
      for (let i = 0; i < 60; i++) {
        try { await pad.asElement().tap({ timeout: 2500 }); } catch (e) { }
        if (i % 6 === 0) {
          await SETTLE(page, 200);
          const d = await city.evaluate(() => window.__HOST_DRAWN | 0);
          if (d > drew) drew = d;
        }
      }
    }
    ok('*** AND WALKING AT THEM PUTS BODIES ON THE STREET *** -- ' + drew
      + ' drawn, where every enemy in this game was prose an hour ago', drew >= 1);
    ok('nothing threw while they were on screen'
      + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);

    await browser.close();
    srv.close();
    done();
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
    try { await browser.close(); } catch (e2) { }
    try { srv.close(); } catch (e2) { }
    done();
  }
})();
