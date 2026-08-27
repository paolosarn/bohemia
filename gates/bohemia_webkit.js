/* ============================================================================
   BOHEMIA — A REAL WEBKIT, AT LAST (8/27/26, UI lane)

   Paolo 8/27: "you don't have to be so ho about only cooking up on default bro
   like download whatever you need to download or make anything you need to make
   or whatever bro"

   He said that after I told him I could not test his browser. He was right to be
   annoyed: I had reported a wall without walking the length of it.

   WHAT THE WALL ACTUALLY WAS, measured:
     playwright's own webkit build  -> 403 from the egress proxy, twice
       (cdn.playwright.dev and playwright.download.prss.microsoft.com are both
        outside this session's allowlist, and a policy denial is not retried)
     BUT apt reaches the ubuntu mirrors, and WebKitGTK ships `WebKitWebDriver`,
     a real W3C WebDriver for the real WebKit engine. It needs a display, so
     xvfb runs one.

   SO THIS REPO NOW HAS A WEBKIT LEG. It is WebKitGTK, not iOS Safari -- same
   engine family, different port and different version -- so it is not a
   guarantee about his phone. It IS the difference between "every gate we own
   speaks Chromium" and "something here speaks WebKit", which is what SHARED -16
   asked for.

   AND THE FIRST THING IT DID WAS PROVE ME WRONG. On 8/26 I told him the page
   broke on his phone because of the CSS `font:` shorthand with a var() family.
   Run that exact case through this driver and WebKit resolves it identically to
   Chromium: 13px, right family, both engines. THE DIAGNOSIS WAS WRONG AND IT WAS
   STATED AS FACT. That is what this file is for.

   USAGE (from a gate):
     const { webkit } = require('./bohemia_webkit.js');
     const out = await webkit(fileUrl, "return JSON.stringify({...})");
   Returns { ok, value, error, skipped }. SKIPPED is honest and loud: if
   WebKitWebDriver or xvfb is missing, a gate must SAY SO rather than pass.
   ========================================================================== */
'use strict';
const { spawn, execFileSync } = require('child_process');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function have(bin) {
  try { execFileSync('which', [bin], { stdio: 'pipe' }); return true; }
  catch (_e) { return false; }
}

/** True when a real WebKit can actually be driven here. */
function available() {
  return have('WebKitWebDriver') && (have('xvfb-run') || process.env.DISPLAY);
}

/**
 * Load `url` in a real WebKit and run `script` (a function BODY that returns a
 * string). One session per call: these gates are seconds apart and a leaked
 * browser on a 4-core box poisons every timing gate in the suite.
 */
async function webkit(url, script, opts) {
  opts = opts || {};
  if (!available()) {
    return { ok: false, skipped: true,
             error: 'no WebKitWebDriver (apt-get install webkit2gtk-driver xvfb)' };
  }
  const port = opts.port || (4600 + (process.pid % 300));
  const base = 'http://127.0.0.1:' + port;

  /* WebKitGTK's driver launches MiniBrowser, which wants an X display even when
     asked for headless, so the driver itself is started under xvfb-run. */
  const useXvfb = !process.env.DISPLAY && have('xvfb-run');
  const cmd = useXvfb ? 'xvfb-run' : 'WebKitWebDriver';
  const args = useXvfb
    ? ['-a', '--server-args=-screen 0 ' + (opts.w || 390) + 'x' + (opts.h || 900) + 'x24',
       'WebKitWebDriver', '--port=' + port]
    : ['--port=' + port];

  const drv = spawn(cmd, args, { stdio: 'ignore' });
  let sid = null;
  const j = (r) => r.json();
  const post = (p, body) => fetch(base + p, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body) }).then(j);

  try {
    /* the driver takes a moment, and under xvfb the display comes up first */
    let up = false;
    for (let i = 0; i < 40 && !up; i++) {
      await sleep(400);
      try { await fetch(base + '/status').then(j); up = true; } catch (_e) {}
    }
    if (!up) return { ok: false, error: 'WebKitWebDriver never answered' };

    const s = await post('/session', {
      capabilities: { alwaysMatch: { 'webkit:browserOptions': { headless: true } } } });
    sid = (s.value && s.value.sessionId) || s.sessionId;
    if (!sid) return { ok: false, error: 'no session: ' + JSON.stringify(s).slice(0, 160) };

    await post('/session/' + sid + '/url', { url });
    await sleep(opts.settle || 2200);
    /* OPTIONAL SETUP STEP, IN THE SAME SESSION (8/27). A page with more than one
       room needs to be put in the right room before it can be measured, and a
       second webkit() call cannot do it: every call is a fresh session and a
       fresh page load, so whatever it clicked is gone. `pre` runs first, then
       `preWait` gives the browser real frames to start animations in, and only
       then does the measurement run. */
    if (opts.pre) {
      await post('/session/' + sid + '/execute/sync', { script: opts.pre, args: [] });
      await sleep(opts.preWait || 1200);
    }
    const r = await post('/session/' + sid + '/execute/sync', { script, args: [] });
    if (r.value === undefined || (r.value && r.value.error)) {
      return { ok: false, error: JSON.stringify(r).slice(0, 200) };
    }
    return { ok: true, value: r.value };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    if (sid) { try { await fetch(base + '/session/' + sid, { method: 'DELETE' }); } catch (_e) {} }
    try { drv.kill('SIGKILL'); } catch (_e) {}
    /* xvfb-run spawns the driver as a child, so kill the family or the port
       stays held and the next gate in the suite cannot bind it. */
    try { execFileSync('pkill', ['-f', 'WebKitWebDriver --port=' + port], { stdio: 'pipe' }); }
    catch (_e) {}
  }
}

module.exports = { webkit, available };
