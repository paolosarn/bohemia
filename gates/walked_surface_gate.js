/* ============================================================================
   WALKED SURFACE GATE (8/14/26, FACTIONS lane) — THE WORK IS ON THE SURFACE HE
   ACTUALLY WALKS, AND THE LEDGER SAYS WHICH ONE.

   Law: laws/BOHEMIA_ADDENDUM_THE_WALKED_SURFACE_IS_THE_GAME_8_14_26.md
   Tool: tools/bohemia_city_factions_patch.py

   WHAT THIS EXISTS BECAUSE OF, and it is this lane's own failure. The coordinator
   ruled on 8/14 that the CITY WORLD is the walked surface and
   slices/BOHEMIA_RUN_CURRENT.html is legacy — preloaded on every visit and NEVER
   DISPLAYED. By then this lane had spent four turns wiring player-facing work into
   the run slice: the sixteen introductions on the person card, the vouch, the
   bargain, the act. All real, all gated, none of it on the surface he plays.

   THE DEEPER FAILURE IS THE RECORD, NOT THE CODE. gates/integration_gate.js let
   three rows say INTEGRATED while probing a file nobody sees. The ledger's own
   header had WARNED about exactly this since 8/4 ("every probe below reads
   BOHEMIA_RUN_CURRENT.html; the RUN tab does not display that file") and the rows
   were written anyway. A green claim about a dark surface is the false green this
   repo ranks worse than a false red.

   So this gate checks the thing the integration probes structurally cannot:
   NOT "is it wired" but "is it wired WHERE HE LOOKS".

   node gates/walked_surface_gate.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const LEDGER = path.join(ROOT, 'records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md');

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}
function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* ------------------------------------------- A. WHICH SURFACE IS THE GAME */
async function partA() {
  console.log('A. WHICH SURFACE HE ACTUALLY SEES, MEASURED NOT ASSUMED');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto('file://' + ALPHA);
    await page.waitForTimeout(3500);
    const seen = await page.evaluate(() => {
      const run = [...document.querySelectorAll('.tab')].find(t => t.dataset.p === 'run');
      if (run) run.click();
      return new Promise(r => setTimeout(() => {
        const g = id => { const e = document.getElementById(id);
          return e ? getComputedStyle(e).display : null; };
        const rf = document.getElementById('runFrame');
        r({ pRun: g('p-run'), pCity: g('p-city'), runFrameShown: rf ? rf.offsetParent !== null : null });
      }, 2000));
    });
    /* THE RULING IS A FACT ABOUT THE BUILD, so it is measured here rather than
       taken from a document. If the build ever flips back, this claim flips with
       it and the lane is told instead of guessing. */
    ok('A1 tapping RUN shows the CITY panel, not the run slice',
      seen.pCity === 'block' && seen.pRun === 'none', JSON.stringify(seen));
    ok('A2 the run slice frame is never displayed',
      seen.runFrameShown === false, JSON.stringify(seen));
  } finally { await browser.close(); }
}

/* ------------------------------------------ B. THE LANE IS ON THAT SURFACE */
function partB() {
  console.log('B. THIS LANE\'S WORK IS ON IT');

  const city = fs.readFileSync(CITY, 'utf8');
  ['bohemia_introductions', 'bohemia_ties', 'bohemia_belonging'].forEach(m => {
    ok('B ' + m + ' is inlined in the walked surface',
      city.includes('==== engine/' + m + '.js ===='),
      'and with the banner, so it joins the ENGINE SYNC sweep');
  });
  ok('B4 the city resolves who somebody runs with',
    /function ctFactionOf\(/.test(city) && /BohemiaAgents\.factionOf\(/.test(city));
  ok('B5 the card is rewritten from the introduction organ, not printed beside it',
    /function ctIntroRows\(/.test(city) && /BohemiaIntros\.meeting\(/.test(city));
  ok('B6 the bargain and the act are on the card',
    /BohemiaBelonging\.bargain\(/.test(city) && /BohemiaBelonging\.actFor\(/.test(city) &&
    /BohemiaBelonging\.record\(/.test(city));
  ok('B7 where you have stood is recorded as you WALK, not when a probe asks',
    /moved\+\+; advance\(0\.084\);[^\n]*ctSawCell\(\)/.test(city));

  /* ONE ANSWER, NOT TWO. The bases baked into the city must be the loop's own,
     or the Cartel lives in two places depending which surface you stand on. */
  const m = /var CT_BASES_BAKED = (\{[\s\S]*?\});/.exec(city);
  ok('B8 the city carries baked faction bases', !!m);
  if (m) {
    const baked = JSON.parse(m[1]);
    const seedM = /var CT_BASES_SEED  = "([^"]*)"/.exec(city);
    const seed = seedM ? seedM[1] : 'bohemia';
    const live = JSON.parse(execFileSync('node', ['-e',
      "var L=require('./engine/bohemia_loop.js');" +
      "process.stdout.write(JSON.stringify(L.boot({seed:" + JSON.stringify(seed) + "}).factionBases||{}));"],
      { cwd: ROOT }).toString());
    ok('B9 they are BYTE-IDENTICAL to what the loop places, for the seed they name',
      JSON.stringify(baked, Object.keys(baked).sort()) ===
      JSON.stringify(live, Object.keys(live).sort()) &&
      Object.keys(baked).length >= 10,
      Object.keys(baked).length + ' baked vs ' + Object.keys(live).length + ' live');
    ok('B10 the seed is declared, so a different world gets NULL not a wrong answer',
      !!seedM && new RegExp('BOH_SEED_TEXT\\s*=\\s*\'' + seed + '\'').test(city) &&
      /String\(BOH_SEED_TEXT\) !== String\(CT_BASES_SEED\)\) return null/.test(city));
  }
}

/* ----------------------------------------- C. IT DRAWS, ON THE REAL CITY */
async function partC() {
  console.log('C. IT DRAWS ON THE REAL CITY, IN A REAL BROWSER');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('file://' + CITY);
    await page.waitForTimeout(6000);
    const out = await page.evaluate(() => {
      const all = (typeof ctEveryone === 'function') ? ctEveryone() : [];
      if (!all.length) return { skip: 'no people on the city block' };
      const at = ctAt(all[0]); hx = at[0] + 1; hy = at[1];
      const orig = window.ctFactionOf;
      const r = { bases: Object.keys(ctBases() || {}).length };
      window.ctFactionOf = function () { return 'Church'; };
      ctSawCell(); ctOpen();
      r.church = document.getElementById('ctcard').innerText;
      r.buttons = [...document.querySelectorAll('#ctcard button')].map(x => x.textContent);
      window.ctFactionOf = function () { return 'Remnants'; };
      ctClose(); ctOpen();
      r.rem = document.getElementById('ctcard').innerText;
      const g = document.getElementById('ctgive');
      r.gaveBtn = g ? g.textContent : null;
      if (g) g.click();
      r.gave = JSON.parse(JSON.stringify(((window.__CT_BELONG || {}).meta || {}).gave || {}));
      r.after = document.getElementById('ctcard').innerText;
      window.ctFactionOf = orig;
      return r;
    });
    if (out.skip) { ok('C the city has people to meet', false, out.skip); }
    else {
      ok('C1 the walked surface knows where the outfits are',
        out.bases >= 10, String(out.bases));
      ok('C2 the card says who they run with, and what that outfit wants',
        /RUNS WITH\s*\n?CHURCH/.test(out.church) && /THEY WANT/.test(out.church),
        JSON.stringify(out.church.slice(0, 120)));
      ok('C3 his canon reaches the card verbatim, both halves',
        /Stored food, distribution logistics/.test(out.church) &&
        /THEY HELP YOU BEFORE YOU AGREE TO ANYTHING/.test(out.church));
      ok('C4 the precondition holds here too: not their ground, no button, and it points',
        !/ctgive/.test(String(out.buttons)) && /GO TO THEM/.test(out.church) &&
        /CELLS (NORTH|SOUTH|EAST|WEST)/.test(out.church),
        JSON.stringify(out.buttons));
      ok('C5 an outfit that wants what you know CAN be acted on, and it counts',
        out.gaveBtn === 'Tell them what you have seen' &&
        Object.keys(out.gave).length === 1,
        JSON.stringify({ btn: out.gaveBtn, gave: out.gave }));
      ok('C6 doing it moves the rung on the real card',
        /SOMEBODY WHO SHOWED UP/.test(out.after), out.after.split('\n').slice(-4).join(' / '));
      ok('C7 buttons sit at the bottom, under the rows they act on',
        out.church.trim().endsWith('Leave them to it'));
    }
    ok('C8 the city threw no errors doing any of that',
      errors.length === 0, errors.slice(0, 3).join(' | '));
  } finally { await browser.close(); }
}

/* ------------------------------------------------ D. THE RECORD IS HONEST */
function partD() {
  console.log('D. THE LEDGER SAYS WHICH SURFACE');

  const led = fs.readFileSync(LEDGER, 'utf8');
  const rows = ['the sixteen introductions', "the valley's people know each other",
                'what a faction wants from you'];
  rows.forEach(r => {
    const i = led.indexOf('| ' + r + ' |');
    const line = i < 0 ? '' : led.slice(i, led.indexOf('\n', i));
    ok('D ' + r + ' names the surface it is true about',
      !!line && /WALKED SURFACE|CITY WORLD/i.test(line),
      'a green claim about a surface nobody sees is the false green this repo '
      + 'ranks worse than a false red');
  });
}

/* ------------------------------------------------- E. THE FLEET-WIDE COUNT */
function partE() {
  console.log('E. THE OTHER LANES ARE TOLD, NOT AUDITED FOR THEM');

  const AUD = path.join(ROOT, 'records/BOHEMIA_SURFACE_AUDIT_8_15_26.md');
  const PAGE_ = path.join(ROOT, 'slices/BOHEMIA_WHICH_SURFACE_8_15_26.html');
  ok('E1 the audit exists', fs.existsSync(AUD) && fs.existsSync(PAGE_));
  if (!fs.existsSync(AUD)) return;
  const md = fs.readFileSync(AUD, 'utf8');

  /* IT IS REGENERATED AND DIFFED, so the count on the page can never be a
     yesterday's number wearing today's date. */
  const before = md;
  try { execFileSync('python3', [path.join(ROOT, 'tools/bohemia_surface_audit.py')],
                     { cwd: ROOT, stdio: 'pipe' }); } catch (e) {}
  ok('E2 the audit is exactly what its tool produces right now',
    fs.readFileSync(AUD, 'utf8') === before);

  ok('E3 it lists every ledger row, not a hand-picked few',
    (md.match(/^\| .* \| (INTEGRATED|PARTIAL|NOT YET) \|/gm) || []).length >= 30);

  /* THE CLAIM IS NARROW AND THE FILE SAYS SO. This lane does not get to declare
     another lane's work broken from a string search; the city is a separate
     renderer and most of it is there under another spelling. */
  ok('E4 it says outright that NOT FOUND is not a verdict',
    /NOT FOUND does not mean broken/i.test(md) && /go and look/i.test(md));
  ok('E5 the page says it too, where he reads it',
    /NOT FOUND<\/b> does not mean broken|NOT FOUND\b[^<]*does not mean broken/i
      .test(fs.readFileSync(PAGE_, 'utf8')));

  const hub = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_LIFE_CURRENT.html'), 'utf8');
  ok('E6 the LIFE tab links it, so the finding is reachable and not a file',
    hub.includes('BOHEMIA_WHICH_SURFACE_8_15_26.html'));
}

(async function main() {
  console.log('WALKED SURFACE GATE — the work is where he looks\n');
  await partA();
  partB();
  await partC();
  partD();
  partE();
  console.log('\nWALKED SURFACE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('WALKED SURFACE GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
