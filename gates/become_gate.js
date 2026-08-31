/* THE BECOME GATE (8/30/26) -- the player builds their own face INSIDE the story,
 * and can reach it in the build a player actually opens.
 *
 * Paolo, 8/25 PLAYTEST DISPATCH item 10: "FACE CUSTOMISATION, never built, is on the
 * board." It was built on 8/28 -- fourteen shape sliders, every haircut the city wears --
 * INTO THE CHARACTER TAB, which is a dev tab that tools/bohemia_cut_the_demo.js strips out
 * of the demo. So the panel shipped inside the demo file with NO DOOR TO IT, and no player
 * could reach the feature. Same failure as the seventeen invisible hats and the colours
 * nobody wore: the material existed and never reached the player.
 *
 * WHERE IT GOES IS HIS, FROM JULY. The 7/19 locked opening turns on a match-cut: "the SAME
 * table, ~10 years later ... you are 20-something." You are a child before the cut and an
 * adult after it, and the one thing the cut cannot show is what ten years did to YOU. So
 * the scene HOLDS on the first frame of the adult and asks.
 *
 * IT DRIVES THE DEMO, NOT THE WORKSHOP. Checking the alpha would prove the feature works
 * on the bench, which was never the problem (VERIFY ON THE REAL SURFACE, 7/18).
 *
 *   node gates/become_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const DEMO = path.join(REPO, 'slices/BOHEMIA_DEMO.html');
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const ENGINE = path.join(REPO, 'engine/bohemia_story_surface.js');
const CANON = path.join(REPO, 'records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json');
const LAW = path.join(REPO, 'laws/BOHEMIA_LAW_THE_CUT_ASKS_WHO_YOU_BECAME_8_30_26.md');

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

(async () => {
  console.log('\nTHE BECOME GATE');

  /* ---- 1. THE CAPABILITY LIVES IN THE ENGINE, NOT IN THE BUILD ----------------------
     This check exists because the mistake was made. hold()/resume() were written straight
     into the alpha, and tools/bohemia_cutscene_tab_patch.py -- which OWNS that script
     block and inlines engine/bohemia_story_surface.js verbatim -- wiped them on its next
     run. The scene then played on merrily BEHIND the creator with every other check still
     green. ANYTHING A PATCH TOOL OWNS MUST BE EDITED AT ITS SOURCE. */
  const eng = fs.readFileSync(ENGINE, 'utf8');
  ok('the engine can hold a scene without losing its place',
     /Story\.prototype\.hold\s*=/.test(eng) && /Story\.prototype\.resume\s*=/.test(eng));
  ok('and there is ONE beat-clock body, not two',
     /Story\.prototype\._tick\s*=/.test(eng) &&
     (eng.match(/self\.player_\.step\(\)/g) || []).length <= 1 &&
     (eng.match(/setInterval\(function \(\) \{ self\._tick\(\); \}/g) || []).length === 2,
     '(start and resume share _tick)');

  /* ---- 2. THE MOMENT IS DATA, IN HIS CANON ------------------------------------------ */
  const canon = JSON.parse(fs.readFileSync(CANON, 'utf8'));
  const marked = canon.beats.filter(b => b.become);
  ok('the canon scene marks exactly one beat as the moment', marked.length === 1,
     '(' + marked.map(b => b.id).join(', ') + ')');
  ok('and it is the first frame of the adult, at the match-cut',
     marked.length === 1 && marked[0].id === 'you_adult' && marked[0].kind === 'actor');

  /* IT IS IN THE COPY THE GAME PLAYS. There are three copies of this scene in the tree --
     the record, BOHEMIA_COLD_OPEN (which only the coldopen gate reads) and the inlined
     BOHEMIA_CUTSCENES catalogue, which is the ONLY one openScene() ever reads. Editing
     either of the other two changes nothing and looks like it worked. */
  const alpha = fs.readFileSync(ALPHA, 'utf8');
  const cat = alpha.indexOf('var BOHEMIA_CUTSCENES = [');
  ok('the catalogue the opening actually plays from carries the flag',
     cat >= 0 && /"become":\s*true/.test(alpha.slice(cat, cat + 400000)));

  /* ---- 3. AND NOW DRIVE THE DEMO, WHICH IS WHERE THE DOOR WAS MISSING --------------- */
  ok('the demo build exists', fs.existsSync(DEMO));
  if (!fs.existsSync(DEMO)) { console.log('\nTHE BECOME GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); }

  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + DEMO, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof openStart === 'function', { timeout: 60000 });

  const r = await p.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const out = {};
    try { localStorage.clear(); } catch (e) {}
    out.noCharTab = !document.querySelector('.tab[data-p=char]');
    /* TAP THE SPLASH THE WAY A FINGER TAPS IT. Hiding #front leaves #app display:none,
       so everything renders into a hidden tree -- this file's own documented lie. */
    const f = document.getElementById('front'); if (f) f.click();
    await sleep(900);
    const rt = document.querySelector('.tab[data-p=run]'); if (rt) rt.click();
    await sleep(600);
    openStart();
    for (let i = 0; i < 200; i++) { if (document.getElementById('becomeWrap')) break; await sleep(300); }
    const w = document.getElementById('becomeWrap');
    out.appeared = !!w;
    if (!w) return out;

    /* IT IS ON SCREEN, not merely in the DOM. A flex child of a display:none parent
       still computes display:flex, which is how a whole cutscene once played inside a
       hidden panel with the captions advancing. */
    const bx = w.getBoundingClientRect();
    out.onScreen = bx.width > 200 && bx.height > 300;
    out.held = !!(window.OPEN_PLAYER && OPEN_PLAYER.held);
    out.beatStopped = !(window.OPEN_PLAYER && OPEN_PLAYER.beatTimer);

    out.sliders = w.querySelectorAll('input[type=range]').length;
    out.swatchRows = w.querySelectorAll('.row').length;
    out.haircuts = [...w.querySelectorAll('.opt')].filter(x => /crop|shag|buzz|fringe|taper/i.test(x.textContent)).length;
    out.hasDone = !!document.getElementById('becomeDone');

    /* NO DEV AFFORDANCES ON A PLAYER'S SCREEN. */
    out.noExport = !/EXPORT/i.test(w.textContent);
    out.noCalibration = !/CALIBRATION/i.test(w.textContent);

    /* PURPLE RESERVATION: purple is the Amalgamation's and nobody else's. The bench may
       keep its lilac; a screen the player sees may not. */
    const purple = [...w.querySelectorAll('*')].filter(el => {
      const cs = getComputedStyle(el);
      return /179,\s*157,\s*219/.test(cs.color + '|' + cs.accentColor + '|' + cs.borderColor); });
    out.purple = purple.length;

    /* THE PORTRAIT IS LIVE AND IT IS THE FACE THE GAME WILL USE. */
    const cv = w.querySelector('canvas');
    out.portrait = cv ? (() => { const d = cv.getContext('2d').getImageData(0, 0, 64, 64).data;
      let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; })() : 0;

    /* MOVING A CONTROL MOVES THE FACE, and the face it moves is pface -- the one thing
       every portrait in the valley is cloned from. A control that cannot move the pixels
       is not a control (8/27). */
    const before = JSON.stringify(pface.face);
    const s = w.querySelectorAll('input[type=range]')[0];
    s.value = String(+s.max);
    s.dispatchEvent(new Event('input', { bubbles: true }));
    s.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(200);
    out.faceMoved = JSON.stringify(pface.face) !== before;

    /* AND THE STORY CARRIES ON. */
    const at = OPEN_PLAYER && OPEN_PLAYER.player_ ? OPEN_PLAYER.player_.i : null;
    document.getElementById('becomeDone').click();
    await sleep(1600);
    out.closed = !document.getElementById('becomeWrap');
    out.resumed = !!(window.OPEN_PLAYER && OPEN_PLAYER.beatTimer);
    out.advanced = at !== null && OPEN_PLAYER.player_ ? OPEN_PLAYER.player_.i > at : false;
    out.marked = (() => { try { return !!localStorage.getItem('bohemia.became.v1'); } catch (e) { return false; } })();

    /* ONCE PER DEVICE. Coming back to the opening later does not ask you again. */
    OPEN_BECAME = false;
    out.notAgain = !openBecome();
    return out;
  });
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  ok('the demo has no CHARACTER tab, which is the whole point', !!r.noCharTab);
  ok('*** and a player still meets the face maker, inside the story ***', !!r.appeared);
  ok('it is actually on screen, not just in the DOM', !!r.onScreen);
  ok('the scene HOLDS for it instead of playing on behind it', !!r.held && !!r.beatStopped);
  ok('every shape slider is there', (r.sliders | 0) >= 14, '(' + r.sliders + ' sliders)');
  ok('and the colours, and the haircuts the city wears',
     (r.swatchRows | 0) >= 5 && (r.haircuts | 0) >= 5,
     '(' + r.swatchRows + ' rows, ' + r.haircuts + ' cuts seen)');
  ok('the live portrait is painted at the size it pops up in the game',
     (r.portrait | 0) > 3000, '(' + r.portrait + ' of 4096 px)');
  ok('moving a control moves the face the game will use', !!r.faceMoved);
  ok('no EXPORT button on a player screen', !!r.noExport);
  ok('no calibration pad either', !!r.noCalibration);
  ok('PURPLE RESERVATION holds on the screen he sees', (r.purple | 0) === 0,
     '(' + r.purple + ' purple elements)');
  ok('there is a way out of it', !!r.hasDone);
  ok('and pressing it resumes the scene where it stopped',
     !!r.closed && !!r.resumed && !!r.advanced);
  ok('the choice is remembered', !!r.marked);
  ok('and it never asks a second time', !!r.notAgain);

  /* ---- AND THE FACE SURVIVES THE RELOAD, WHICH IS THE ONLY CLAIM THAT MATTERS -----
     pface lived in memory only. Survivable while the only person touching it was Paolo
     on a bench he keeps open; not survivable the moment a PLAYER meets the creator in
     the opening, because it only ever asks once -- build a head, lock the phone, come
     back, and you are Punk with no way back to the creator. Same class as the VOTE tab
     holding three weeks of verdicts in `var V={}`. So the gate closes the page, opens
     it again, and asks whether the head is still theirs. */
  const b2 = await chromium.launch();
  const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
  await p2.goto('file://' + DEMO, { waitUntil: 'load' });
  await p2.waitForFunction(() => typeof faceSave === 'function' && typeof pface !== 'undefined', { timeout: 60000 });
  const keep = await p2.evaluate(() => {
    try { localStorage.clear(); } catch (e) {}
    /* a head nobody would get by accident */
    pface.face.len = pface.face.len + 7;
    pface.face.cheekW = pface.face.cheekW - 3;
    pface.eyes.gap = pface.eyes.gap + 2;
    if (typeof faceClamp === 'function') faceClamp();
    const wrote = faceSave();
    return { wrote, face: JSON.stringify(pface.face), eyes: pface.eyes.gap };
  });
  await p2.reload({ waitUntil: 'load' });
  await p2.waitForFunction(() => typeof pface !== 'undefined', { timeout: 60000 });
  const back = await p2.evaluate(() => ({ face: JSON.stringify(pface.face), eyes: pface.eyes.gap }));
  /* AND A CLEAN DEVICE STILL GETS THE APPROVED FACE, unchanged. */
  const fresh = await p2.evaluate(async () => {
    try { localStorage.clear(); } catch (e) {}
    return true;
  });
  await p2.reload({ waitUntil: 'load' });
  await p2.waitForFunction(() => typeof pface !== 'undefined', { timeout: 60000 });
  const punk = await p2.evaluate(() => ({
    isPunk: JSON.stringify(pface.face) === JSON.stringify(PUNK.face) }));
  await b2.close();

  ok('the face is written down when they finish', !!keep.wrote);
  ok('*** and it is still their face after they close the tab and come back ***',
     !!back.face && back.face === keep.face && back.eyes === keep.eyes,
     '(eye gap ' + keep.eyes + ' before, ' + back.eyes + ' after)');
  ok('and a device that has never played still gets the approved face', !!punk.isPunk);

  /* ---- 4. ONE SET OF CONTROLS, NOT TWO ---------------------------------------------
     A second face editor is exactly how the portrait and the body ended up being
     different people on 8/27 (ONE ID, ONE WHOLE PERSON). The creator and the workbench
     must call the same body. */
  ok('the creator and the workbench are the same controls',
     /function faceControlsUI\(/.test(alpha) &&
     (alpha.match(/faceControlsUI\(/g) || []).length >= 3 &&
     /FACE_REBUILD/.test(alpha),
     '(one faceControlsUI, called by both)');
  ok('and no second copy of the sliders was written',
     (alpha.match(/function faceSliderUI\(/g) || []).length === 1);

  const law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
  ok('the law is written down', law.length > 900, '(' + law.length + ' chars)');
  ok('and it says where the moment is and that Paolo can move it',
     /match-cut/i.test(law) && /DIRECT/.test(law));

  console.log('\nTHE BECOME GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
