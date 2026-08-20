/* BOHEMIA COLD OPEN GATE (8/11/26) — the first fifteen seconds of the game are
 * IN A TAB, they PLAY, and they cost no new art.
 *
 * WHY THIS EXISTS. engine/bohemia_scene.js played the Act 1 cold open correctly
 * from 8/9, and gates/scene_gate.js proved it beat by beat against the locked
 * 7/19 shape — 40 claims, all green, all HEADLESS. It appeared in ZERO slices.
 * Forty green claims about something Paolo cannot open is the most expensive
 * kind of green there is: it reads like the work is done. NAME THE TAB (7/28):
 * a thing he cannot reach does not exist to him.
 *
 * So scene_gate keeps proving the SCENE is the shape he ruled, and this gate
 * proves it IS ON A SCREEN. The two do not overlap on purpose.
 *
 * The tab is CUTSCENE. It shipped as STORY on 8/11 and he renamed it within the
 * hour ("change it from story to either cutscene or scene or something"), so
 * every identifier the tab reaches through follows his word rather than mine.
 *
 * WHAT IT PROVES
 *   1) CUTSCENE is a real tab in the alpha with a real canvas behind it
 *   2) every inlined module is BYTE-IDENTICAL to its canonical file, and there
 *      is exactly ONE copy of each (an insert tool run twice is a duplication
 *      tool — the CHARACTER lane's 8/11 lesson, checked rather than trusted)
 *   3) NO NEW ART: every tile in the set is re-hashed against the approved
 *      interior pool. During an art freeze this is the claim that matters.
 *   4) nothing came out of the pool's blood/bodies packs
 *   5) IT PLAYS, in a real browser, on the real alpha: the match-cut lands, all
 *      four drafted lines reach the screen, and the scene reaches `end`
 *   6) THE FRAMING IS IDENTICAL EITHER SIDE OF THE CUT — measured off the
 *      canvas, because that identity IS the match-cut and a surface that drifts
 *      by four pixels has quietly turned it into a scene change
 *   7) the surface DECIDES NOTHING: after the cut it places the player and
 *      nobody else, so no lane has picked who survived ten years
 *   8) ONE-LINK LAW: this shipped inside the alpha, not as its own page
 *
 * Run: node gates/coldopen_gate.js
 * Registered in gates/bohemia_gates.py as COLD OPEN.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.dirname(__dirname);
process.chdir(ROOT);
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.log('  FAIL: ' + m); } }

const ALPHA_PATH = 'slices/BOHEMIA_ALPHA_0_9.html';
const alpha = fs.readFileSync(ALPHA_PATH, 'utf8');

/* ---- 1. THE TAB EXISTS AND LEADS SOMEWHERE ------------------------------- */
ok(/data-p="cutscene"[^>]*>CUTSCENE</.test(alpha), 'CUTSCENE is a real tab in the alpha tab bar');
ok(/id="p-cutscene"/.test(alpha), 'and it has a panel');
ok(/id="cutCv"/.test(alpha) && /id="cutCap"/.test(alpha) && /id="cutPlay"/.test(alpha),
  'the panel holds a canvas, a caption and a play control');

/* ---- 2. ONE CANONICAL BODY, INLINED VERBATIM ----------------------------- */
/* ENGINE SYNC LAW: a copy that can drift is a second body. The alpha inlines
   four files; each must appear exactly once and match its source byte for byte.
   Byte-for-byte, not "contains the important bits" — a substring check would
   pass on a copy somebody edited in place, which is exactly the failure. */
const INLINED = [
  ['engine/bohemia_scene.js', 'root.BohemiaScene = API'],
  ['engine/bohemia_coldopen_set.js', 'root.BohemiaColdOpenSet = API'],
  ['engine/bohemia_story_surface.js', 'root.BohemiaStorySurface = API'],
];
INLINED.forEach(function (m) {
  const src = fs.readFileSync(m[0], 'utf8');
  ok(alpha.indexOf(src) >= 0, m[0] + ' is inlined in the alpha BYTE-IDENTICAL '
    + '(re-run: python3 tools/bohemia_cutscene_tab_patch.py)');
  const n = alpha.split(m[1]).length - 1;
  ok(n === 1, m[0] + ' appears EXACTLY ONCE in the alpha (found ' + n +
    ' — an insert tool run twice is a duplication tool)');
});
const canonTxt = fs.readFileSync('records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json', 'utf8').trim();
/* HOW MANY LINES THE SCENE HAS IS READ OFF THE SCENE, NEVER TYPED HERE. The
   first cut hardcoded 4 and went red the moment three more were written, which
   is a gate reporting its own staleness as a defect in the work. */
const SAY_N = JSON.parse(canonTxt).beats.filter(function (b) {
  return b.kind === 'say' && b.text;
}).length;
ok(alpha.indexOf('var BOHEMIA_COLD_OPEN = ' + canonTxt) >= 0,
  'the authored scene is inlined verbatim from records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json');
ok((alpha.split('var BOHEMIA_COLD_OPEN =').length - 1) === 1,
  'and exactly once');

/* ---- 3. NO NEW ART. THIS IS THE FREEZE CLAIM. ---------------------------- */
const POOL_PATH = 'banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt';
ok(fs.existsSync(POOL_PATH), 'the approved interior pool is on disk');
const setJs = fs.readFileSync('engine/bohemia_coldopen_set.js', 'utf8');
const tiles = [];
const re = /\{name:"([^"]+)",bucket:"([^"]+)",pack:"([^"]+)",idx:(\d+),sha256:"([a-f0-9]+)",bytes:(\d+),why:"(?:[^"\\]|\\.)*",\s*\n\s*b64:"([^"]+)"\}/g;
let m2;
while ((m2 = re.exec(setJs)) !== null) {
  tiles.push({ name: m2[1], bucket: m2[2], pack: m2[3], idx: +m2[4], sha256: m2[5],
               bytes: +m2[6], b64: m2[7] });
}
ok(tiles.length >= 10, 'the cold open set parsed (' + tiles.length + ' tiles)');

if (fs.existsSync(POOL_PATH) && tiles.length) {
  const pool = JSON.parse(fs.readFileSync(POOL_PATH, 'utf8'));
  const byKey = {};
  Object.keys(pool.buckets).forEach(function (b) {
    pool.buckets[b].forEach(function (it) { byKey[b + '|' + it.pack + '|' + it.idx] = it; });
  });
  const notInBank = [], drifted = [], selfHash = [];
  tiles.forEach(function (t) {
    const it = byKey[t.bucket + '|' + t.pack + '|' + t.idx];
    if (!it) { notInBank.push(t.name); return; }
    const bankRaw = Buffer.from(it.b64, 'base64');
    const mineRaw = Buffer.from(t.b64, 'base64');
    const bankSha = crypto.createHash('sha256').update(bankRaw).digest('hex');
    /* two separate claims on purpose: the shipped bytes equal the BANK's bytes,
       AND the sha the file carries about itself is true. A tile whose recorded
       hash matches its own edited pixels would sail through the second check
       alone, which is how a self-attested measurement lies. */
    if (!bankRaw.equals(mineRaw)) drifted.push(t.name);
    if (bankSha !== t.sha256) selfHash.push(t.name);
  });
  ok(notInBank.length === 0, 'every tile traces to a real entry in the approved pool' +
    (notInBank.length ? ' — NOT IN BANK: ' + notInBank.join(', ') : ''));
  ok(drifted.length === 0, 'NO NEW ART: every tile is byte-identical to the bank' +
    (drifted.length ? ' — REDRAWN: ' + drifted.join(', ') : ''));
  ok(selfHash.length === 0, 'and each tile\'s recorded sha256 is true of the bank\'s bytes' +
    (selfHash.length ? ' — LIED: ' + selfHash.join(', ') : ''));

  /* 4. the pool's own exclusion, carried. */
  const gore = tiles.filter(function (t) {
    return /zombie|bones|blood|gore|corpse|remains/i.test(t.pack);
  });
  ok(gore.length === 0, 'nothing came out of a blood/bodies pack (NO DAMAGE BEFORE THE DIAL)' +
    (gore.length ? ' — ' + gore.map(function (g) { return g.name; }).join(', ') : ''));
}

/* ---- 4b. EVERY SCENE IS REACHABLE, AND THE PICKER IS NOT A HARDCODED LIST -- */
/* NAME THE TAB: a scene he cannot reach does not exist to him, and that is
   exactly how the cold open sat in a terminal for two days. The tab lists what
   SHIPPED, discovered off disk by the patch tool, so a third scene reaches him
   without anybody remembering to add a button. */
var sceneFiles = fs.readdirSync('records')
  .filter(function (f) { return /^BOHEMIA_SCENE_.*\.json$/.test(f); }).sort();
ok(sceneFiles.length >= 2, 'more than one authored scene exists (' + sceneFiles.length + ')');
var missingFromTab = [];
sceneFiles.forEach(function (f) {
  var d = JSON.parse(fs.readFileSync('records/' + f, 'utf8'));
  var title = d.title || d.id;
  if (alpha.indexOf('title:' + JSON.stringify(title)) < 0) missingFromTab.push(f);
});
ok(missingFromTab.length === 0, 'EVERY authored scene is in the CUTSCENE tab\'s picker' +
  (missingFromTab.length ? ' — UNREACHABLE: ' + missingFromTab.join(', ') : ''));
ok(/id="cutPick"/.test(alpha), 'and the picker is on the panel');
/* HIS OWN WORDS ARE MARKED AS HIS ON SCREEN, so he can tell at a glance which
   lines are a lane's draft and which are the ones he wrote himself. */
var hisLines = 0;
sceneFiles.forEach(function (f) {
  var d = JSON.parse(fs.readFileSync('records/' + f, 'utf8'));
  (d.beats || []).forEach(function (b) {
    if (b.kind === 'say' && b.draft === false) {
      hisLines++;
      ok(!!b.source, f + '#' + b.id + ' is marked HIS and names the ruling it was quoted from');
    }
  });
});
ok(hisLines === 0 || /your words/i.test(alpha),
  'his own lines are labelled YOUR WORDS on screen, never "draft" (' + hisLines + ' of them)');

/* ---- 5. ONE-LINK LAW ----------------------------------------------------- */
ok(!fs.existsSync('slices/BOHEMIA_COLD_OPEN_CURRENT.html') &&
   !fs.existsSync('slices/BOHEMIA_CUTSCENE_CURRENT.html'),
  'the cold open did NOT ship its own page (ONE-LINK LAW: it lives inside the alpha)');

/* ---- 6/7/8. IT PLAYS, ON THE SURFACE HE ACTUALLY TAPS -------------------- */
/* VERIFY ON THE REAL SURFACE (7/18): a side-door probe is a lie. This boots the
   real alpha, taps the real tab, presses the real button, and reads the real
   canvas. */
(async function () {
  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', function (e) { errs.push(String(e.message)); });
    await page.goto('file://' + path.join(ROOT, ALPHA_PATH), { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3500);
    await page.evaluate(function () { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1200);

    const tapped = await page.evaluate(function () {
      const t = document.querySelector('.tab[data-p="cutscene"]');
      if (!t) return false; t.click(); return true;
    });
    ok(tapped, 'the CUTSCENE tab is tappable in the running alpha');

    /* headless replay first: cheap, and it answers the two structural claims
       without waiting on wall clock. */
    const headless = await page.evaluate(function () {
      const s = new BohemiaStorySurface.Story({
        canvas: document.createElement('canvas'),
        set: BohemiaColdOpenSet, scene: BOHEMIA_COLD_OPEN, runtime: BohemiaScene,
        stage: BOH_STAGE, floorplan: BOH_FLOORPLAN,
        paintBody: function () { return {}; }
      });
      const log = s.playAll();
      let cutAt = -1;
      for (let i = 0; i < log.length; i++) if (log[i].kind === 'cut') { cutAt = i; break; }
      const afterCast = [];
      const st = new BohemiaStorySurface.Story({
        canvas: document.createElement('canvas'),
        set: BohemiaColdOpenSet, scene: BOHEMIA_COLD_OPEN, runtime: BohemiaScene,
        stage: BOH_STAGE, floorplan: BOH_FLOORPLAN,
        paintBody: function () { return {}; }
      });
      st.playAll();
      return {
        steps: log.length, cutAt: cutAt,
        eraBefore: cutAt > 0 ? log[cutAt - 1].era : null,
        eraAtCut: cutAt >= 0 ? log[cutAt].era : null,
        castJustBefore: cutAt > 0 ? log[cutAt - 1].cast : -1,
        /* NOBODY EVER SHARES A CELL, measured on the real scene rather than only
           in the stage gate's synthetic sweep. */
        maxDupCells: Math.max.apply(null, log.map(function (r) {
          var seen = {}, dup = 0;
          (r.cells || []).forEach(function (c) { if (seen[c]) dup++; seen[c] = 1; });
          return dup;
        })),
        castJustAfter: cutAt >= 0 && log[cutAt + 1] ? log[cutAt + 1].cast : -1,
        /* THE CLAIM THAT PROTECTS HIS RULING, stated exactly. After the cut the
           only bodies allowed in the room are the PLAYER and whoever the beats
           give a LINE to. A surface that carried the family across would put a
           body in the room that no beat asked for -- that is the thing to
           forbid, not a headcount. (The first cut of this asserted "at most 1"
           and went red the moment the father was correctly drawn speaking; a
           threshold standing in for a rule is a gate measuring the wrong thing.) */
        unasked: (function () {
          /* WHO IS ALLOWED IN THE ROOM IS A PROPERTY OF THE WHOLE POST-CUT
             SEGMENT, NOT OF THE BEATS SO FAR. This built `allowed` as it walked,
             so a body was legal only if it had ALREADY spoken by the time it was
             staged -- and an actor must be placed BEFORE they can say anything,
             so the rule was unsatisfiable for any speaker after the first.
             Caught 8/19 when the lost sibling was correctly staged at the table
             she is taken from: she has a line four beats later and the gate
             still called her an unasked body.
             THE RULING IS UNCHANGED and is the whole point of this check -- who
             survived ten years is Paolo's call, and a helpful renderer carrying
             the family across the cut would have made it for him. A body that
             speaks NOWHERE after the cut still fails, which is the case that
             was ever really at risk. */
          var CAST = BohemiaStorySurface.ROLE_TO_CAST;
          var allowed = { player: 1, PLAYER_child: 1, PLAYER_adult: 1 }, bad = [];
          log.slice(cutAt).forEach(function (r) {
            if (r.speaker) { allowed[r.speaker] = 1; if (CAST[r.speaker]) allowed[CAST[r.speaker]] = 1; }
          });
          log.slice(cutAt).forEach(function (r) {
            (r.who || []).forEach(function (k) { if (!allowed[k]) bad.push(k); });
          });
          return bad.filter(function (v, i, a) { return a.indexOf(v) === i; });
        })(),
        lines: log.map(function (r) { return r.line; }).filter(Boolean)
          .filter(function (v, i, a) { return a.indexOf(v) === i; }),
        ended: st.ended
      };
    });

    ok(headless.cutAt > 0, 'the scene contains the MATCH-CUT beat');
    ok(headless.eraBefore === 'pre_collapse' && headless.eraAtCut === 'post_collapse',
      'ONE BEAT carries the whole apocalypse (pre_collapse -> post_collapse in a single step, was ' +
      headless.eraBefore + ' -> ' + headless.eraAtCut + ')');
    ok(headless.castJustBefore === 5,
      'the pre-collapse table is FULL before the cut (' + headless.castJustBefore + ' of 5 placed)');
    /* THE CLAIM THAT PROTECTS HIS RULING. Nothing but the player may be standing
       in that room after the cut, because who survived ten years is his call and
       a helpful surface carrying the family across would have made it. */
    ok(headless.unasked.length === 0,
      'AFTER THE CUT the room holds the player and only whoever the beats give a LINE to' +
      (headless.unasked.length ? ' — UNASKED BODY: ' + headless.unasked.join(', ') : '') +
      ' — who survived ten years is Paolo\'s ruling, not the renderer\'s');
    ok(headless.maxDupCells === 0,
      'NOBODY IS EVER STANDING IN ANYBODY ELSE (max duplicate cells ' +
      headless.maxDupCells + ') — occupancy, on the real scene');
    ok(headless.lines.length === SAY_N,
      'every drafted line in the scene reaches the surface (' + headless.lines.length +
      ' of ' + SAY_N + ')');
    ok(headless.ended === true, 'the scene reaches its `end` beat and returns control');

    /* now the real thing, on the real canvas */
    const played = await page.evaluate(function () {
      return new Promise(function (resolve) {
        const cap = [];
        /* *** PAOLO 8/11: "there was no squiggle voices." *** He had to tell us
           that a finished engine was not being called. So the call is COUNTED
           now, not assumed: spy on BOH_VOICE.say and require one per spoken
           line. A wired feature nobody measured is how this happened twice. */
        let voiced = 0;
        if (typeof BOH_VOICE !== 'undefined' && BOH_VOICE.say) {
          const realSay = BOH_VOICE.say.bind(BOH_VOICE);
          BOH_VOICE.say = function () { voiced++; try { return realSay.apply(null, arguments); } catch (e) { return null; } };
        }
        cutBoot(function () {
          const cv = document.getElementById('cutCv');
          const g = cv.getContext('2d');
          const frames = {};
          const orig = CUTSCENE.apply.bind(CUTSCENE);
          CUTSCENE.apply = function (b) {
            orig(b);
            if (b && (b.kind === 'cut')) frames.atCut = true;
          };
          CUTSCENE.start();
          const t = setInterval(function () {
            if (CUTSCENE.line && CUTSCENE.line.text) cap.push(CUTSCENE.line.text);
            /* sample the canvas either side of the cut at the SAME rows, which is
               where a framing drift would show */
            const strip = g.getImageData(0, 168, cv.width, 10).data;
            let ink = 0;
            for (let i = 3; i < strip.length; i += 4) if (strip[i] > 8) ink++;
            if (CUTSCENE.era === 'pre_collapse') frames.preInk = ink;
            else frames.postInk = ink;
            if (CUTSCENE.ended) {
              clearInterval(t);
              resolve({
                voiced: voiced,
                caps: cap.filter(function (v, i, a) { return a.indexOf(v) === i; }),
                preInk: frames.preInk, postInk: frames.postInk,
                sawCut: !!frames.atCut,
                handoff: CUTSCENE.handoff, ended: CUTSCENE.ended,
                capHtml: document.getElementById('cutCap').textContent
              });
            }
          }, 120);
          setTimeout(function () { clearInterval(t); resolve({ timeout: true, caps: cap }); }, 90000);
        });
      });
    });

    ok(!played.timeout, 'the cold open PLAYS TO THE END on the real canvas' +
      (played.timeout ? ' — it did not finish in 40s' : ''));
    ok(played.caps && played.caps.length === SAY_N,
      'and every one of them is ON SCREEN while it plays (' +
      ((played.caps || []).length) + ' of ' + SAY_N + ')');
    ok(played.sawCut === true, 'the cut beat reached the surface');
    ok(played.voiced >= SAY_N,
      'HIS SQUIGGLE VOICES SPEAK EVERY LINE (' + played.voiced + ' calls into BOH_VOICE for ' +
      SAY_N + ' lines) -- v1 played silent with the engine already in the build');
    /* THE FRAMING IS THE MATCH-CUT. The wall/floor horizon row must carry the
       same amount of drawn pixel either side; a surface that shifted the camera
       would change this and turn the cut into a scene change. */
    ok(played.preInk > 0 && played.preInk === played.postInk,
      'THE FRAMING IS IDENTICAL EITHER SIDE OF THE CUT (horizon row ink ' +
      played.preInk + ' vs ' + played.postInk + ')');
    ok(played.handoff && played.handoff.encounter === 'cold_open',
      'it hands off to COMBAT\'s own contract name (cold_open)');
    ok(/THE OPEN ENDS HERE/.test(played.capHtml || ''),
      'and it says so on screen when it is over');
    ok(errs.length === 0, 'no page errors while it played' +
      (errs.length ? ' — ' + errs.slice(0, 3).join(' | ') : ''));

  } finally {
    await browser.close();
  }

  console.log('COLD OPEN GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
    tiles.length + ' approved tiles, 0 cooked; played on the real alpha)');
  process.exit(fail ? 1 : 0);
})().catch(function (e) {
  console.log('  FAIL: COLD OPEN GATE CRASHED: ' + (e && e.message));
  console.log('COLD OPEN GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed');
  process.exit(1);
});
