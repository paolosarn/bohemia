/* ============================================================================
   THE NARRATOR GATE  (SOUNDS, row [the narrator], rule 45, 10/16/26)

   engine/bohemia_narrator.js wraps the phone's own speechSynthesis, not a
   waveform this lane renders -- there is nothing here for an OfflineAudioContext
   to measure, so this is a BEHAVIOUR gate, the same shape one_engine_gate.js and
   settlement_screen_gate.js already use, driving the real page with Playwright:
     - OFF BY DEFAULT: a fresh page never speaks until the toggle is set
     - NEVER PLAYS OVER ITSELF: a second speak() while one is running cancels and
       restarts rather than stacking or throwing
     - A TAP STOPS IT: a real pointerdown while speaking cancels, and does not
       swallow the tap (no preventDefault, no capture that blocks the screen
       underneath)
     - THE RECAP DOES NOT SPEAK (flipped 10/18, row [a desert, not a rainforest];
       his 10/17 DOWN on sounds-the-recap-speaks-10-16: "this voice was so fucking
       bad"): slices/BOHEMIA_FIGHT.html no longer loads the narrator and its
       showOver() never calls speak(); the wrapper itself stays for the day a
       voice that passes exists, so its three behaviour claims still run
   Serves the repo over a real HTTP server because BOHEMIA_FIGHT.html fetches
   its sourced numbers (records/target/bb/*.json) and file:// cannot fetch.

   Run: node gates/narrator_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.dirname(__dirname);
const PORT = 8946;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };

let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});

(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message)));

  /* ---- THE ENGINE FILE ITSELF, ON THE JUDGE PAGE (no fetch, file:// is fine) */
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_THE_RECAP_SPEAKS_10_16_26.html');
  await p.waitForFunction(() => typeof window.BohemiaNarrator !== 'undefined', null, { timeout: 15000 });

  const base = await p.evaluate(() => {
    const N = window.BohemiaNarrator;
    const out = { available: N.available(), enabledDefault: N.enabled() };
    out.speakWhileOff = N.speak('test', {});
    return out;
  });
  ok('speechSynthesis is reachable from this page', base.available === true);
  ok('OFF BY DEFAULT: a fresh page never speaks until the toggle is set',
    base.enabledDefault === false && base.speakWhileOff === false,
    'enabled()=' + base.enabledDefault + ', speak() while off returned ' + base.speakWhileOff);

  const live = await p.evaluate(() => {
    const N = window.BohemiaNarrator;
    N.setEnabled(true);
    const out = { enabledAfterSet: N.enabled() };
    out.firstSpeak = N.speak('The road crew ran. 6 rounds.', {});
    out.speakingAfterFirst = N.speaking();
    let threw = null;
    try { out.secondSpeak = N.speak('Your crew is down.', {}); } catch (e) { threw = String(e); }
    out.threw = threw;
    out.speakingAfterSecond = N.speaking();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    out.speakingAfterTap = N.speaking();
    N.setEnabled(false);
    return out;
  });
  ok('turning the toggle on really flips enabled()', live.enabledAfterSet === true);
  ok('NEVER PLAYS OVER ITSELF: a second speak() cancels and restarts, never throws',
    live.firstSpeak === true && live.secondSpeak === true && live.threw === null
    && live.speakingAfterFirst === true && live.speakingAfterSecond === true,
    JSON.stringify(live));
  ok('A TAP STOPS IT: a real pointerdown while speaking cancels it',
    live.speakingAfterTap === false, 'speaking() after the tap: ' + live.speakingAfterTap);

  /* ---- THE REAL RECAP SCREEN, REAL TEXT, NOT THE JUDGE PAGE'S OWN EXAMPLE */
  const fp = await ctx.newPage();
  const ferrs = [];
  fp.on('pageerror', e => ferrs.push(String(e.message)));
  await fp.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_FIGHT.html');
  await fp.waitForFunction(() => typeof window.showOver === 'function', null, { timeout: 15000 });
  const fight = await fp.evaluate(() => {
    /* the pull, proved behaviourally: the narrator is not on the page, and even if a
       stub is planted where it used to be, the recap never asks it to speak */
    const loaded = typeof window.BohemiaNarrator !== 'undefined';
    const spoken = [];
    window.BohemiaNarrator = { speak: function (t) { spoken.push(t); return true; }, wireTapToStop: function () {}, setEnabled: function () {}, enabled: function () { return true; } };
    let threw = null;
    try {
      FIGHT.S = { round: 6, units: [
        { side: 'you', name: 'A', kills: 1, dealt: 10, taken: 2, xpGained: 5, level: 1 },
        { side: 'them', name: 'B', dead: true },
        { side: 'them', name: 'C', fled: true }
      ] };
      showOver('won');
    } catch (e) { threw = String(e); }
    delete window.BohemiaNarrator;
    return { loaded, spoken, threw, headline: document.getElementById('oh') ? document.getElementById('oh').textContent : null };
  });
  ok('THE RECAP DOES NOT SPEAK (pulled 10/18 on his 10/17 DOWN): the fight never loads the narrator and showOver() never calls speak()',
    fight.threw === null && fight.loaded === false && fight.spoken.length === 0 && fight.headline === 'THE ROAD CREW RAN',
    JSON.stringify(fight));
  const fightSrc = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_FIGHT.html'), 'utf8');
  ok('and the fight\'s own source carries no narrator script tag and no speak() call',
    !/<script[^>]*bohemia_narrator\.js/.test(fightSrc) && !/BohemiaNarrator\.speak\(/.test(fightSrc));
  await fp.close();

  ok('nothing threw anywhere in this sweep', errs.length === 0 && ferrs.length === 0,
    errs.concat(ferrs).slice(0, 3).join(' | '));

  await b.close(); srv.close();
  console.log('\nTHE NARRATOR GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
