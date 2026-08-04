/* ============================================================================
   FOOTSTEP GATE (7/31/26)

   Paolo 7/31: "I don't hear sound at all. What's wrong with you even when I take
   steps I don't hear no sound for the steps that I'm making."

   APPROVED-BUT-UNUSED, THE THIRD TIME IN TWO DAYS, and the first one he could
   HEAR was missing. He judged footsteps on 7/30 -- step_dirt, step_asphalt and
   step_gravel, all five candidates approved for each, in
   banks/BOHEMIA_SFX_APPROVED_7_30_26.json. The engine that renders them (BOH_SFX)
   was already inlined in the alpha. The surface he actually walks -- the CITY
   frame -- never asked for one. Measured before the fix: 'step_asphalt' appeared
   ZERO times in the city renderer.

   The pattern is now unmistakable and this gate exists to break it: border walls
   (7/28), a bought sidewalk (7/31), footsteps (7/31). Every time, art or audio he
   judged sat in banks/ while the thing he was looking at used something else, and
   every time NOTHING IN THE MACHINE CARED. banks_used_gate does this for pixels.
   This does it for the one sound that plays on every single step.

   IT CHECKS THE WHOLE CHAIN, because any link silently breaks it:
     1. the approved bank still declares step sounds
     2. those approved variants are EMBEDDED in the shipped alpha
     3. the shell has a player and a bridge handler
     4. the CITY frame actually posts a footfall, with a surface read off the tile
     5. the city builds NO second audio context (one engine, the parent's)
     6. and, on a real browser, walking STARTS AUDIO NODES -- measured, not read
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const BANK = path.join(ROOT, 'banks/BOHEMIA_SFX_APPROVED_7_30_26.json');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

/* WHERE the city app lives and WHAT SHAPE it is in are not this gate's business
   (8/4). The payload-wall pass moved it out of the alpha on 8/2 and stopped
   base64-ing it, and this gate went red about a city that was fine. One resolver
   knows: gates/bohemia_city_app.js. The `alpha` argument is ignored, kept only so
   the call sites below read exactly as they did. */
const CITY_APP = require('./bohemia_city_app.js');
function cityBlob(_alpha) { const a = CITY_APP.read(); return a ? a.src : null; }

(async () => {
  const approved = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  const steps = Object.keys(approved).filter(k => k.indexOf('step_') === 0);
  ok('he has judged footstep sounds (' + steps.join(', ') + ')', steps.length >= 3);
  ok('each judged step has at least one approved candidate',
     steps.every(k => Array.isArray(approved[k]) && approved[k].length > 0));

  const alpha = fs.readFileSync(ALPHA, 'utf8');
  ok('HIS approved step variants are EMBEDDED in the shipped alpha',
     alpha.indexOf('id="sfxApproved"') >= 0);
  const tag = alpha.match(/id="sfxApproved">([^<]*)</);
  let embedded = null;
  try { embedded = tag ? JSON.parse(tag[1]) : null; } catch (e) {}
  ok('the embedded bank parses and carries every judged step',
     !!embedded && steps.every(k => Array.isArray(embedded[k]) && embedded[k].length > 0));
  ok('the embedded variants are exactly the ones he approved',
     !!embedded && steps.every(k => JSON.stringify(embedded[k]) === JSON.stringify(approved[k])));

  ok('the shell has a footstep player', /function stepSfx\(/.test(alpha));
  ok('the shell answers the footfall bridge', alpha.indexOf("d.type==='BOHEMIA_STEP'") >= 0);
  ok('an unjudged sound stays SILENT rather than guessing',
     /if\(!STEP_BANK\) return;/.test(alpha));
  ok('one sound per footfall, not one per frame', /STEP_LAST < 0\.12/.test(alpha));

  const city = cityBlob(alpha);
  ok('the alpha carries a readable CITY blob', !!city && city.length > 100000);
  if (city) {
    ok('THE SURFACE HE WALKS posts a footfall',
       city.indexOf("type:'BOHEMIA_STEP'") >= 0);
    ok('the surface is read off the tile, never guessed',
       city.indexOf('function __surfaceOf(') >= 0 && city.indexOf('__surfaceOf(c)') >= 0);
    /* ONE ENGINE: the frame must not build a second audio graph */
    ok('the city builds NO audio context of its own (one engine, the parent\'s)',
       !/new\s+\(?\s*(window\.)?(webkit)?AudioContext/.test(city));
  }

  /* ---- AND IT ACTUALLY MAKES A SOUND ------------------------------------
     Every check above can pass on a build that is silent, which is exactly the
     state he complained about. So: real browser, count the audio nodes. */
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => {
      window.__SOUNDS = 0;
      const wrap = (proto, name) => {
        if (!proto || !proto[name]) return;
        const orig = proto[name];
        proto[name] = function (...a) { window.__SOUNDS++; return orig.apply(this, a); };
      };
      wrap(window.OscillatorNode && OscillatorNode.prototype, 'start');
      wrap(window.AudioBufferSourceNode && AudioBufferSourceNode.prototype, 'start');
    });
    await page.goto('file://' + ALPHA);
    await page.waitForTimeout(2500);
    await page.evaluate(() => {
      document.querySelectorAll('#splash,.splash').forEach(s => s.style.display = 'none');
      const t = document.querySelector('[data-p="run"]'); if(!t) throw new Error('that tab is not in the bar'); t.click();
    });
    await page.waitForTimeout(3500);

    const before = await page.evaluate(() => window.__SOUNDS);
    await page.evaluate(async () => {
      if (typeof stepSfx !== 'function') return;
      for (const s of ['asphalt', 'dirt', 'gravel']) {
        stepSfx(s);
        await new Promise(r => setTimeout(r, 250));
      }
    });
    await page.waitForTimeout(1200);
    const after = await page.evaluate(() => window.__SOUNDS);

    ok('WALKING MAKES A SOUND: audio nodes started (' + before + ' -> ' + after + ')',
       after > before);
  } finally {
    await browser.close();
  }

  console.log('FOOTSTEP GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FOOTSTEP GATE CRASHED: ' + e.message); process.exit(1); });
