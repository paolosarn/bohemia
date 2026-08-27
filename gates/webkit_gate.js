/* ============================================================================
   WEBKIT GATE (8/27/26) — THE ENGINE HE ACTUALLY PLAYS ON

   Paolo 8/26: "It looks like the fucking UI page was broken."
   Paolo 8/27: "you don't have to be so ho about only cooking up on default bro
   like download whatever you need to download or make anything you need to make"

   THE STATE OF THINGS BEFORE THIS FILE: 429 gates, every browser one of them
   driving CHROMIUM, and the man plays on an iPhone. VERIFY ON THE REAL SURFACE
   (7/18) says art is verified only on the surface Paolo sees. We honoured the
   FILE half of that rule for a month and quietly failed the ENGINE half. Every
   PASS this repo ever printed about a rendered page was a claim about Chromium.

   NOW SOMETHING HERE SPEAKS WEBKIT. gates/bohemia_webkit.js drives a real
   WebKitGTK through W3C WebDriver under xvfb. It is NOT iOS Safari -- same
   engine family, different port, different version -- and this file says so out
   loud rather than letting a green tick imply more than it earned.

   *** AND THE FIRST THING IT DID WAS PROVE ITS OWN AUTHOR WRONG. *** On 8/26 I
   told him the break was the CSS `font:` shorthand with a var() family, and I
   said it as fact. Leg 1 below runs that exact case through both engines. They
   agree. The diagnosis was wrong. The leg stays, permanently, so the correction
   is a thing the machine repeats rather than a thing I said once.

     node gates/webkit_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { webkit, available } = require(__dirname + '/bohemia_webkit.js');

const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* THE SURFACES HE ACTUALLY OPENS. The alpha is the door; the UI page is the one
   that broke. Both are checked on the engine that matters. */
const SURFACES = [
  ['the UI tab', 'slices/BOHEMIA_UI_CURRENT.html'],
  ['the workshop itself', 'slices/BOHEMIA_ALPHA_0_9.html'],
];

(async () => {
  if (!available()) {
    /* A SKIP IS NOT A PASS. If this container has no WebKit, say it in capitals
       rather than printing a green line nobody reads twice. */
    console.log('  SKIP: no WebKit engine in this container.');
    console.log('        apt-get install -y webkit2gtk-driver xvfb');
    console.log('        Until then EVERY rendered-page claim in this repo is ' +
                'about CHROMIUM ONLY (SHARED -16).');
    console.log('SKIP: webkit gate 0/0 — no engine, and that is a finding, not a pass');
    process.exit(0);
  }
  ok('there is a real WebKit in this container at all', true);

  /* ==== 1. THE CORRECTION, KEPT AS A TEST ================================
     Two divs, one using the `font:` shorthand with a var() family and one using
     longhands. I claimed WebKit drops the first. Ask it. */
  {
    const f = path.join(os.tmpdir(), 'boh_wk_font_' + process.pid + '.html');
    fs.writeFileSync(f, '<!doctype html><meta charset="utf-8"><style>' +
      ':root{ --fc: ui-monospace,"SF Mono",Menlo,monospace; }' +
      '#sh{ font:13px var(--fc); } #lh{ font-family:var(--fc); font-size:13px; }' +
      '</style><div id="sh">A</div><div id="lh">B</div>');
    const r = await webkit('file://' + f, `
      var a = getComputedStyle(document.getElementById('sh'));
      var b = getComputedStyle(document.getElementById('lh'));
      return JSON.stringify({ sh: a.fontSize, shFam: a.fontFamily.slice(0,12),
                              lh: b.fontSize, lhFam: b.fontFamily.slice(0,12) });`);
    try { fs.unlinkSync(f); } catch (_e) {}
    ok('the font case can be measured on WebKit at all', r.ok);
    if (r.ok) {
      const v = JSON.parse(r.value);
      /* THE POINT OF THIS LEG IS THE CORRECTION. If a future WebKit really does
         drop the shorthand, this goes red and the 8/26 claim becomes true after
         all -- which is exactly what a test is for. */
      ok('WEBKIT RESOLVES THE `font:` SHORTHAND WITH A var() FAMILY, same as ' +
         'Chromium (' + v.sh + ' vs ' + v.lh + ') — so the 8/26 root-cause claim ' +
         'was WRONG and this leg is the correction, kept',
         v.sh === '13px' && v.sh === v.lh && v.shFam === v.lhFam);
    }
  }

  /* ==== 2. *** THE CROSS-ENGINE DIFFERENTIAL *** =========================
     THE FIRST CUT OF THIS SECTION ASSERTED ABSOLUTES and went red on the alpha
     for having a 16px body -- which is simply the browser default, because the
     alpha never sets a body size, and CHROMIUM SAYS 16px TOO. An absolute told
     me "WebKit is wrong" about something both engines agree on.

     So this asks the only question that actually matters for a bug that shows up
     on his phone and not in my tests: DO THE TWO ENGINES DISAGREE? Same page,
     same probe, both engines, compared. A difference is the alarm. Agreement is
     the pass, even when what they agree on is imperfect -- an imperfection both
     engines share is a design problem for another leg, not a phone problem. */
  const pw = (() => {
    for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                     '/usr/local/lib/node_modules']) {
      try { return require(path.join(g, 'playwright')); } catch (_e) {}
    }
    try { return require('playwright'); } catch (_e) { return null; }
  })();

  const PROBE = `
    var b = document.body, cs = getComputedStyle(b);
    return JSON.stringify({
      size: cs.fontSize,
      family: cs.fontFamily.slice(0, 30),
      overflows: document.documentElement.scrollWidth > window.innerWidth + 2,
      tall: b.scrollHeight > 400,
      thumbs: document.querySelectorAll('.thumb').length,
      tabs: document.querySelectorAll('.tab[data-p]').length,
      boxes: document.querySelectorAll('.bx').length,
      opts: document.querySelectorAll('.opt').length
    });`;

  for (const [name, rel] of SURFACES) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) { ok(name + ' exists', false); continue; }

    const wkr = await webkit('file://' + p, PROBE, { settle: 3000 });
    ok(name + ' loads on a REAL WEBKIT' + (wkr.ok ? '' : ' (' + wkr.error + ')'), wkr.ok);
    if (!wkr.ok) continue;
    const wk = JSON.parse(wkr.value);

    /* a page whose type collapsed and whose body is empty is a broken page on
       ANY engine -- that much is still an absolute, and it is the shape he saw */
    ok(name + ': it is not a blank page on WebKit (' + wk.tall + ')', wk.tall === true);
    ok(name + ': nothing runs off the side of the phone on WebKit', wk.overflows === false);

    if (!pw) { ok(name + ': chromium is available to compare against', false); continue; }
    const br = await pw.chromium.launch();
    const pg = await br.newPage({ viewport: { width: 390, height: 844 } });
    await pg.goto('file://' + p);
    await pg.waitForTimeout(3000);
    const ch = JSON.parse(await pg.evaluate(new Function(PROBE)));
    await br.close();

    const KEYS = ['size', 'family', 'overflows', 'tall', 'thumbs', 'tabs', 'boxes', 'opts'];
    const diff = KEYS.filter(k => String(wk[k]) !== String(ch[k]))
                     .map(k => k + ': webkit=' + wk[k] + ' chromium=' + ch[k]);
    ok(name + ': *** THE TWO ENGINES SEE THE SAME PAGE *** (' + KEYS.length +
       ' things compared)' + (diff.length ? ' -- DISAGREE ON ' + diff.join(' | ') : ''),
       diff.length === 0);
  }

  /* ==== 3. AND THE THING HE COULD NOT SEE, SEEN ON HIS ENGINE ============
     Paolo 8/27: "you would try to type out and explain what it's like to press
     buttons and not show me what it looks like in action". The presses play
     themselves now. A demo that only animates in Chromium is the same failure
     wearing a different hat, so WebKit is asked whether they move. */
  {
    const p = path.join(ROOT, 'slices/BOHEMIA_UI_CURRENT.html');
    const r = await webkit('file://' + p, `
      var out = { names: [], fingertips: document.querySelectorAll('.fingertip').length };
      ['A','B','C'].forEach(function(v){
        var e = document.querySelector('.demo-' + v + ' .bx');
        out.names.push(e ? getComputedStyle(e).animationName : 'NONE');
      });
      var g = document.querySelector('.fingertip');
      out.thumbAnim = g ? getComputedStyle(g).animationName : 'NONE';
      out.thumbSize = g ? getComputedStyle(g).width : '0px';
      return JSON.stringify(out);`, { settle: 2600 });
    ok('the pressed demos can be read on WebKit' + (r.ok ? '' : ' (' + r.error + ')'), r.ok);
    if (r.ok) {
      const v = JSON.parse(r.value);
      ok('all three presses are RUNNING an animation on WebKit (' + v.names.join(', ') + ')',
         v.names.length === 3 && v.names.every(n => n && n !== 'none' && n !== 'NONE'));
      ok('and each one is a DIFFERENT animation, so they are three answers and ' +
         'not three labels', new Set(v.names).size === 3);
      ok('the ghost thumb is there and is thumb-sized on WebKit (' + v.thumbSize + ')',
         v.fingertips === 3 && v.thumbAnim !== 'none' && parseInt(v.thumbSize, 10) >= 40);
    }
  }

  console.log((fail ? 'FAIL' : 'PASS') + ': webkit gate ' + pass + '/' + (pass + fail));
  process.exit(fail ? 1 : 0);
})();
