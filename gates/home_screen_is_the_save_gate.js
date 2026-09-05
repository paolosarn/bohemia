/* ============================================================================
   THE HOME SCREEN IS THE SAVE (9/5/26, RUN lane) -- VAMILY [home screen],
   BB-HOME-SCREEN-IS-THE-SAVE.

   THE PLATFORM PUT A RUN TIMER ON A GAME WHOSE FIRST LAW IS THAT THERE ARE NO
   RUNS. Since iOS 13.4 / Safari 13.1, WebKit deletes ALL of a site's
   script-writable storage -- localStorage, sessionStorage, IndexedDB, service
   worker registrations -- after seven days of browser use without interaction
   on that site. No amount of code beats it.

   RE-CHECKED 9/5, BECAUSE THE ROW ASKED FOR IT IN CAPITALS and the last reader
   could not confirm it was still true. It is: WebKit's storage policy, updated
   through Safari 17 and the 2023 storage-policy revision, still deletes
   script-writable storage after seven days without interaction. The quota rules
   changed in Safari 17; the seven-day rule did not.
   THE EXEMPTION IS STILL THE SAME ONE AND IT IS STILL THE ONLY ONE: a web app
   added to the HOME SCREEN is not part of Safari and keeps its own counter of
   days of use, which resets every time it is used -- WebKit engineer John
   Wilander's own words, "we do not expect the first-party in such web
   applications to have its website data deleted". HONEST LIMIT, stated because
   the row asked for honesty about the source: that exemption is engineer
   statement and long-standing behaviour rather than formal documentation, and no
   2026 source restates it. navigator.storage.persist() is a SECOND lever with
   the same status -- reported to help, not documented to.
   SO ADD TO HOME SCREEN IS NOT A CONVENIENCE FEATURE. IT IS THE SAVE.

   *** AND THE INSTALL PATH LANDED A FRIEND IN THE WORKSHOP. ***
   Measured 9/5: BOHEMIA_DEMO.html linked bohemia.webmanifest -- the SAME file
   the alpha links -- whose start_url and id are BOHEMIA_ALPHA_0_9.html. So a
   stranger who opened the demo link, added it to their home screen and tapped
   the icon got the seventeen-tab dev bench instead of the game. Chrome honours
   start_url outright; Safari has honoured web app manifests since iOS 16.4. And
   because `id` was the alpha's as well, the two surfaces were ONE app to the
   browser: installing either blocked the other.
   NOTHING ANYWHERE READ THE MANIFEST, so nothing went red, for months. The whole
   iOS save strategy hung off a door that opened onto the wrong room.

   WHAT WAS ALREADY RIGHT, and is only held here rather than built: the apple
   meta tags, the touch icon, navigator.storage.persist() being requested with a
   measurable result, BohemiaSave.status() computing evictionRisk off
   navigator.standalone, and the true sentence it prints. This gate exists so
   that stays true.

   HOW LOUD THE ASK SHOULD BE IS HIS (the row says so). This asserts the ask is
   REACHABLE and the sentence is TRUE WHEN IT IS TRUE. It does not assert a size.

   ---- WHAT THIS GATE DOES NOT OWN --------------------------------------------
   gates/home_screen_gate.js (registered HOME SCREEN) already holds the ALPHA's
   manifest, its icons, that every icon publishes, and the nothing-saved
   messaging on a home-screen launch. Found by grepping before building, which is
   the rule this repo learned the hard way when two lanes built the same feedback
   card on the same afternoon. THIS ONE IS THE DEMO HALF AND THE RELATIONSHIP
   BETWEEN THE TWO SURFACES -- that they are two apps and not one -- which is
   exactly what no single-surface gate can see, and exactly where the bug was.
   Registered INSTALL PATH, because two gates called HOME SCREEN is its own
   quiet way to lose one.

   MUTATION PROOF, run 9/5: point the demo's manifest link back at the workshop's
   -- the bug precisely as it stood an hour earlier -> 4 red, including the
   browser's own fetch reading start_url BOHEMIA_ALPHA_0_9.html.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const Save = require(path.join(ROOT, 'engine/bohemia_save.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const done = () => {
  console.log('HOME SCREEN IS THE SAVE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.png': 'image/png', '.json': 'application/json',
               '.webmanifest': 'application/manifest+json' };
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

/* ---- 1. THE TWO SURFACES ARE TWO APPS ------------------------------------ */
const SURFACES = [
  { file: 'BOHEMIA_DEMO.html', who: 'the demo, which is the link a friend opens' },
  { file: 'BOHEMIA_ALPHA_0_9.html', who: 'the workshop' }
];
const manifests = {};
for (const s of SURFACES) {
  const src = fs.readFileSync(path.join(SLICES, s.file), 'utf8');
  const m = src.match(/rel="manifest"\s+href="([^"]+)"/);
  ok(s.who + ' links a manifest' + (m ? ' (' + m[1] + ')' : ''), !!m);
  if (!m) continue;
  const mf = path.join(SLICES, m[1]);
  ok('and that manifest is a file that exists', fs.existsSync(mf));
  if (!fs.existsSync(mf)) continue;
  let j = null;
  try { j = JSON.parse(fs.readFileSync(mf, 'utf8')); } catch (e) { }
  ok('and it is readable JSON', !!j);
  if (!j) continue;
  manifests[s.file] = { href: m[1], json: j };

  /* THE ONE THAT WAS BROKEN. A home-screen icon must open the surface it was
     installed from, not a different one. */
  ok('*** ' + s.who.toUpperCase() + ': THE HOME-SCREEN ICON OPENS THE SURFACE IT '
    + 'WAS INSTALLED FROM *** (start_url ' + j.start_url + ')',
     String(j.start_url || '').indexOf(s.file) >= 0);
  ok('and it is its own app, not a second door onto the other one (id '
    + j.id + ')', String(j.id || '').indexOf(s.file) >= 0);
  ok('it installs standalone, which is what takes it out of Safari and off the '
    + 'seven-day clock (display ' + j.display + ')', j.display === 'standalone');
  ok('and it has icons that exist on disk',
     Array.isArray(j.icons) && j.icons.length >= 1
     && j.icons.every(i => fs.existsSync(path.join(SLICES, i.src))));
}
ok('*** AND THE TWO SURFACES DO NOT SHARE ONE MANIFEST *** -- they did until 9/5, '
  + 'so installing the demo installed the dev bench',
  !!(manifests['BOHEMIA_DEMO.html'] && manifests['BOHEMIA_ALPHA_0_9.html']
     && manifests['BOHEMIA_DEMO.html'].href !== manifests['BOHEMIA_ALPHA_0_9.html'].href));

/* the demo's manifest is generated by the cutter, so it cannot rot by hand */
{
  const cutter = fs.readFileSync(path.join(ROOT, 'tools/bohemia_cut_the_demo.js'), 'utf8');
  ok('the demo manifest is GENERATED by the cut, not maintained by hand',
     /bohemia-demo\.webmanifest/.test(cutter) && /DEMO_MANIFEST/.test(cutter));
  ok('and the cut\'s own --check covers it, so it cannot drift silently',
     /THE DEMO MANIFEST IS NOT WHAT THIS TOOL GENERATES/.test(cutter));
}

/* ---- 2. THE SENTENCE IS TRUE WHEN IT IS TRUE ----------------------------- */
{
  const store = (() => {
    const d = Object.create(null);
    return { getItem: k => (k in d ? d[k] : null),
             setItem: (k, v) => { d[k] = String(v); },
             removeItem: k => { delete d[k]; } };
  })();
  const tab = Save.make({ store: store, ios: true, standalone: false });
  tab.probe();
  const st = tab.status();
  ok('on an iPhone in a TAB the save says it is at risk', st.evictionRisk === true);
  ok('and the sentence names the seven days and the way out ('
    + String(st.line).slice(0, 60) + '...)',
     /7 days/.test(st.line) && /Home Screen/i.test(st.line));

  const home = Save.make({ store: store, ios: true, standalone: true });
  home.probe();
  const hs = home.status();
  ok('*** AND ON THE HOME SCREEN IT IS NOT AT RISK, WHICH IS THE WHOLE POINT ***',
     hs.evictionRisk === false);
  ok('and it stops saying the seven-day sentence there, because it is no longer '
    + 'true', !/7 days/.test(hs.line));
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
    await SETTLE(page, 3000);

    /* THE BROWSER'S OWN READING, not mine off disk: what the page actually
       resolved, fetched and parsed. A manifest that 404s reads exactly like a
       manifest that is fine, from the source text. */
    const live = await page.evaluate(async () => {
      const out = {};
      const link = document.querySelector('link[rel=manifest]');
      out.href = link ? link.href : null;
      if (link) {
        try {
          const r = await fetch(link.href);
          out.status = r.status;
          out.json = await r.json();
        } catch (e) { out.err = String(e.message); }
      }
      out.appleCapable = !!document.querySelector(
        'meta[name="apple-mobile-web-app-capable"][content="yes"]');
      out.appleIcon = !!document.querySelector('link[rel="apple-touch-icon"]');
      out.title = (document.querySelector('meta[name="apple-mobile-web-app-title"]') || {}).content;
      out.durable = window.__BOH_DURABLE || null;
      return out;
    });

    ok('the demo\'s manifest actually FETCHES in a browser (status '
      + live.status + ')', live.status === 200 && !!live.json);
    ok('*** AND WHAT THE BROWSER READ POINTS AT THE DEMO *** (start_url '
      + (live.json ? live.json.start_url : '?') + ')',
       !!(live.json && String(live.json.start_url).indexOf('BOHEMIA_DEMO') >= 0));
    ok('the iOS meta tags are on the page a friend opens -- without capable=yes '
      + 'the icon opens a Safari tab and the exemption never applies',
       live.appleCapable === true && live.appleIcon === true);
    ok('and the icon on their home screen is named (' + live.title + ')',
       typeof live.title === 'string' && live.title.length > 0);

    /* THE SECOND LEVER. Reported as well as asserted, because its effect is not
       documented -- what is asserted is that we ASK. */
    ok('durable storage is requested on load, which is the second lever and it '
      + 'costs nothing (' + JSON.stringify(live.durable) + ')',
       !!(live.durable && live.durable.api === true));

    ok('and the demo threw nothing getting there'
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
