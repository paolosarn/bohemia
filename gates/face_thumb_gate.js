/* THE FACE THUMB GATE (8/28/26) -- no character face visual ships without his thumb on it.
 *
 * Paolo, 8/28: "from now on all the character face shit is always gonna have to come with
 * a ... thumbs up or a thumbs down bro like you can't be doing shit without ... my thumb
 * thumbs up thumbs down if it's a visual. and a lot of them I'm gonna be thumbing down so
 * you gotta do better."
 * Law: laws/BOHEMIA_LAW_EVERY_FACE_COMES_WITH_A_THUMB_8_28_26.md
 *
 * *** THIS AMENDS EVERYTHING IS A THUMB (8/9) FOR ONE LANE, AND NEWEST DATE WINS. ***
 * That law flipped the default from approve-before to correct-after because we had turned
 * him into an approvals queue. It is still right about that, and this does not undo it:
 * NOTHING BLOCKS ON HIM. The work ships, and the thumb is waiting in the VOTE tab when he
 * wants it. What changed is that on the character/face lane a visual may no longer ship
 * with NO WAY to say yes or no to it -- which is what had been happening, because the VOTE
 * tab has existed since 8/7 and had never held a single face.
 *
 * IT DRIVES THE REAL PAGE. A gate that greps the builder for the word "thumb" would pass
 * on a surface where nothing is clickable (VERIFY ON THE REAL SURFACE, 7/18).
 *
 *   node gates/face_thumb_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/BOHEMIA_VOTE_CURRENT.html');
const BANK = path.join(REPO, 'banks/BOHEMIA_FACE_CANDIDATES_8_28_26.txt');
const LAW = path.join(REPO, 'laws/BOHEMIA_LAW_EVERY_FACE_COMES_WITH_A_THUMB_8_28_26.md');

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };
const idOf = n => 'hair_' + n.toLowerCase().replace(/[^a-z0-9]+/g, '_');

(async () => {
  console.log('\nTHE FACE THUMB GATE');

  ok('the candidate bank exists', fs.existsSync(BANK));
  ok('the vote surface exists', fs.existsSync(VOTE));
  if (!fs.existsSync(BANK) || !fs.existsSync(VOTE)) {
    console.log('\nTHE FACE THUMB GATE: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(1);
  }

  /* IT IS REACHABLE IN ONE TAP. "He never digs in files" is the first line of how he
     works, and a judge page behind a hub is still a scavenger hunt (8/7). */
  const alphaSrc = fs.readFileSync(ALPHA, 'utf8');
  ok('the VOTE tab is top level in the alpha', /data-p="vote"/.test(alphaSrc));
  ok('and it opens the surface these live on',
     /voteFrame[^>]*data-src="BOHEMIA_VOTE_CURRENT\.html"/.test(alphaSrc));

  /* THE BANK IS NOT STALE. A thumb on a picture of a build that no longer exists is
     worse than no thumb, because he thinks he has ruled on the thing he is looking at. */
  const aT = fs.statSync(ALPHA).mtimeMs, bT = fs.statSync(BANK).mtimeMs, vT = fs.statSync(VOTE).mtimeMs;
  const SIX_H = 6 * 3600 * 1000;
  ok('the candidates are not older than the build they photograph', bT > aT - SIX_H,
     '(bank ' + ((aT - bT) / 3600000).toFixed(1) + 'h behind the alpha; rebake with ' +
     'node tools/bohemia_face_candidates.js)');
  ok('and the vote page was built from them', vT > bT - SIX_H,
     '(rebuild with python3 tools/bohemia_vote_tab.py)');

  /* EVERY CANON HAIRCUT IS IN THE QUEUE. This is the ratchet: cook a haircut and forget
     to bake a candidate for it and this goes red the same turn, which is the whole
     mechanism by which "you can't be doing shit without my thumb" survives the next cook. */
  const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  const baked = new Set((bank.faces || []).map(x => x.id));
  const canon = [...alphaSrc.matchAll(/\{n:'([^']+)',st:'canon',layer:'hair'/g)].map(m => m[1]);
  const missing = canon.filter(n => !baked.has(idOf(n)));
  ok('every canon haircut has a candidate baked for his thumb', missing.length === 0,
     '(' + canon.length + ' canon' + (missing.length ? '; MISSING: ' + missing.join(', ') : '') + ')');
  const faceCells = (bank.faces || []).filter(x => x.kind === 'face').length;
  ok('and the portrait itself is judgeable', faceCells >= 8, '(' + faceCells + ' faces baked)');

  /* A HAIRCUT IS FOUR PICTURES. A cell that showed only the front would be asking him to
     thumb a third of the thing (A HAIRCUT READS FROM EVERY ANGLE, 8/28). */
  const strips = (bank.faces || []).filter(x => x.kind === 'haircut');
  const oneView = strips.filter(x => (x.w || 0) < 3 * (x.h || 1) * 0.6);
  ok('a haircut is shown from more than one side', oneView.length === 0,
     '(' + strips.length + ' strips, each ' + (strips[0] ? strips[0].w + 'x' + strips[0].h : '?') + ')');

  /* ---- AND NOW DRIVE IT, because none of the above proves he can actually tap ---- */
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 430, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + VOTE, { waitUntil: 'load' });
  await p.waitForTimeout(500);

  const r = await p.evaluate(() => {
    const out = {};
    const hair = [...document.querySelectorAll('#facelist .cel')].filter(c => /^hair_/.test(c.dataset.d));
    const face = [...document.querySelectorAll('#facelist .cel')].filter(c => /^face_/.test(c.dataset.d));
    out.hair = hair.length; out.face = face.length;
    out.everyHairHasArt = hair.every(c => {
      const im = c.querySelector('img');
      return im && /^data:image\/png;base64,\w/.test(im.getAttribute('src') || ''); });
    /* THUMBS: tap through the cycle and read the state off the element */
    const states = [];
    if (hair[0]) for (let i = 0; i < 4; i++) { hair[0].click(); states.push(hair[0].className); }
    out.states = states;
    out.cycles = new Set(states.map(s => (s.match(/v-\w+/) || [''])[0])).size;
    /* *** AND THE PERSISTENCE PROBE HAS TO STOP ON A VERDICT. *** The first version read
       the store after the loop above, which taps FOUR times -- up, could-be-better, down,
       and back to nothing -- so it was asking whether an erased verdict had been saved.
       It reported the feature broken while the feature worked. Tap once more, so the cell
       is left holding a real vote, and then look. */
    if (hair[0]) hair[0].click();
    out.persisted = false;
    try {
      const k = Object.keys(localStorage).filter(x => /vote/i.test(x));
      for (const key of k)
        if (Object.keys(JSON.parse(localStorage.getItem(key) || '{}')).length) out.persisted = true;
    } catch (e) {}
    out.hasNote = !!document.getElementById('tilenote');
    out.hasGlobal = !!document.getElementById('global');
    out.hasSun = !!document.getElementById('sun');
    out.hasExport = !!document.getElementById('exp');
    /* the header must be able to SEE the face queue */
    out.count = (document.getElementById('count') || {}).textContent || '';
    out.votedId = (hair[0] || {}).dataset ? hair[0].dataset.d : null;
    out.votedState = hair[0] ? (hair[0].className.match(/v-\w+/) || [''])[0] : '';
    return out;
  });

  /* *** AND IT HAS TO SURVIVE THE RELOAD, WHICH IS THE ONLY CLAIM THAT MATTERS. ***
     Writing to localStorage proves the write. What he does is thumb forty haircuts, tap
     away to the RUN, and come back -- so the gate closes the page, opens it again, and
     asks whether the vote is still PAINTED on the cell. A restored verdict he cannot see
     is the same bug wearing a hat. */
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(400);
  const after = await p.evaluate((id) => {
    const c = document.querySelector('#facelist .cel[data-d="' + id + '"]');
    return { cls: c ? (c.className.match(/v-\w+/) || [''])[0] : 'GONE',
             count: (document.getElementById('count') || {}).textContent || '' };
  }, r.votedId);
  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));

  /* *** WAS `>= 20`, AND TWENTY IS A POPULATION, NOT A STANDARD. (COOK, 9/6.) ***
     Sixth time this exact bug has been found in this lane's job, and this one was hiding
     behind a stale artefact: the check was green only because the VOTE PAGE it reads was
     built when the game had 24 canon haircuts. Rebaking the page (which the gate itself
     tells you to do, two checks up) showed the real number -- 11, because Paolo's
     thirteen 8/20 kills were finally enforced on 9/5 -- and a correct page failed a bar
     written for the old one. THE CLAIM IS "the haircuts", ALL of them, and the gate
     already reads the canon list off the alpha twenty lines above this. Use it, with a
     floor so an empty wardrobe cannot pass by having nothing to show. */
  ok('the haircuts are on the page he opens', r.hair === canon.length && canon.length >= 8,
     '(' + r.hair + ' of ' + canon.length + ' canon haircuts have a cell)');
  ok('the faces are on it too', r.face >= 8, '(' + r.face + ' cells)');
  ok('every haircut cell actually carries a picture', !!r.everyHairHasArt);
  ok('tapping one moves it through the verdict states', (r.cycles || 0) >= 3,
     '(' + (r.states || []).map(s => (s.match(/v-\w+/) || ['-'])[0]).join(' -> ') + ')');
  ok('and the verdict is written down, not just drawn', !!r.persisted);
  ok('there is a note field per item', !!r.hasNote);
  ok('and a comment box for the whole batch at the bottom', !!r.hasGlobal);
  ok('SUN MODE is there, because he judges in daylight', !!r.hasSun);
  ok('and it exports', !!r.hasExport);
  /* THE COUNTER MUST SEE THE FACE QUEUE. It read #newlist only, so the day the haircuts
     arrived it said "0 / 0 voted" over forty things waiting -- a counter that cannot see
     half the queue is telling him he is finished. */
  const m = /(\d+)\s*\/\s*(\d+)\s*voted/.exec(r.count || '');
  /* AND THE SAME MISTAKE ONE LINE LATER: `>= 30` was 24 haircuts + 16 faces with room to
     spare. The claim in the comment above is not "the queue is big", it is that the
     counter counts the WHOLE queue instead of one list, so measure exactly that. */
  ok('the counter can see the face queue', !!m && +m[2] === r.hair + r.face,
     '(header says "' + (r.count || '').trim() + '", queue is ' + r.hair + ' haircuts + ' +
     r.face + ' faces = ' + (r.hair + r.face) + ')');

  ok('and it is still there after he closes the tab and comes back',
     !!after.cls && after.cls === r.votedState,
     '(' + (r.votedState || 'none') + ' before the reload, ' + (after.cls || 'none') + ' after)');
  ok('and the counter still knows he voted', /[1-9]\d* \/ \d+ voted/.test(after.count || ''),
     '(header says "' + (after.count || '').trim() + '")');

  const law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
  ok('the law is written down', law.length > 900, '(' + law.length + ' chars)');
  ok('and it says plainly that nothing blocks on him',
     /NOTHING BLOCKS/i.test(law) && /8\/9/.test(law));

  console.log('\nTHE FACE THUMB GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
