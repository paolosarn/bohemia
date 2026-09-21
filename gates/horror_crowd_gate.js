/* ============================================================================
   BOHEMIA HORROR CROWD (9/21/26, PEOPLE lane).
   VAMILY [horror crowd], row A-CROWD-THAT-STANDS-TOO-STILL. Rule 20(h), school
   under the rule 18 hold, with the RULE 22 cook riding beside it.

   THE ROW: "the crowd under the bible: someone facing the wrong way, everyone a
   little too still, nobody looks at the camera; measured against the crowd we
   place."

   *** MEASURED ON THE ALPHA AND THE ROW'S THREE THINGS ARE ALREADY TRUE, WHICH
   IS WHY THE CROWD IS NOT FRIGHTENING. *** Over three frames: not one body
   changed which way it faced, 0.68% of the screen moved against the bible's 10%
   ceiling, and nobody was watching him. THE LONG HOLD (bible R3) PASSES BY
   FIFTEEN TIMES. And the bible's own sentence on R1 says what that leaves:
   "Two wrong things is a haunted house; zero is a screenshot."

   *** SO THE MEASUREMENT WENT TO THE ONE RULE THAT FAILS, R7, THE LIT STREET
   WITH NOBODY HOME: "a crowd thin where it should be thick. DRAWN FROM WORLD
   DATA, NEVER FAKED. The wrongness traces to a real world-state row." ***
   Walking the game's own clock through 24 hours, asking its own schedule:

     THE WORLD OUTSIDE   0 at 3am, 10 at 7am, 41 at 10am, 3 at 1pm, 40 at 5pm,
                         4 at 8pm, 2 at 11pm. A real two-peaked commute.
     DRAWN ON HIS STREET 3, 24, 23, 20, 23, 24, 15.

   THE WORLD SWINGS FORTY-ONE TO FOUR AND THE SCREEN DRAWS TWENTY-THREE AND
   TWENTY-FOUR. Ten in the morning and eight at night are the same picture. The
   crowd he sees is the 9/7 borrow, which was built for a real reason (the
   world's own placement puts TWO people near him at the busiest hour of the
   day, measured here too) and which borrows a FIXED number instead of the
   number the world earned.

   NOTHING WAS CHANGED ON THE PLAY SURFACE. Rule 18 holds this lane; the borrow
   is another lane's code and the row is school. What shipped is the page, the
   pictures and the count.

   WHAT THIS HOLDS:
   A. the crowd the bible already passes on, so nobody "fixes" it
   B. the curve is real and the screen is flat, re-derived on the alpha
   C. the pictures are the game, off the glass, and differ where the numbers say
   D. the page says what was measured and offers a real choice
   E. rule 18: the borrow is untouched

   node gates/horror_crowd_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_THE_STREET_AT_THREE_HOURS_9_21_26.html');
const SHOTS = path.join(ROOT, 'slices/vote');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_HORROR_CROWD_9_21_26.txt');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(t, v) { notes.push('  NOTE  ' + t + (v == null ? '' : '   ' + v)); }

(async () => {
  /* ======================================================================== */
  head('A. AND B. ON THE GLASS, ON THE ALPHA');
  /* ======================================================================== */
  let drove = false, r = null;
  try {
    const { open } = require(DRIVE);
    /* THE ALPHA, NOT THE DEMO: the demo is a baked cut. This lane paid a whole
       round for that on 9/20 and it is written into that record. */
    const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
    await d.clearCards();
    drove = true;
    r = await d.fr.evaluate(async () => {
      const out = {};
      const all = (typeof ctEveryone === 'function' ? ctEveryone() : []) || [];
      out.census = all.length;

      /* --- THE ROW'S THREE THINGS, over three real frames --- */
      const snap = () => { try { render(); } catch (e) {}
        return (window.__PPL_FACES || []).map(f => ({ id: String(f.id), dir: f.dir })); };
      const a = snap();
      await new Promise(s => setTimeout(s, 450));
      const b = snap();
      await new Promise(s => setTimeout(s, 450));
      const c = snap();
      out.drawnPerFrame = [a.length, b.length, c.length];
      const m = x => { const o = {}; x.forEach(f => o[f.id] = f.dir); return o; };
      const ma = m(a), mb = m(b), mc = m(c);
      let common = 0, turned = 0;
      Object.keys(ma).forEach(k => {
        if (mb[k] === undefined || mc[k] === undefined) return;
        common++; if (ma[k] !== mb[k] || mb[k] !== mc[k]) turned++;
      });
      out.facingCommon = common; out.facingTurned = turned;
      out.dirsSeen = Object.keys(a.reduce((o, f) => (o[f.dir] = 1, o), {})).length;
      let watching = 0;
      const byId = {}; all.forEach(p => byId[String(p.id)] = p);
      a.forEach(f => { const p = byId[f.id]; try {
        if (p && ctAgainstMe(p) && ctAgainstMe(p).signs.watch) watching++; } catch (e) {} });
      out.watching = watching;

      /* --- THE MOVING PIXELS, the bible's own R3 measure --- */
      const cvs = document.querySelector('canvas');
      const g2 = cvs.getContext('2d');
      const f1 = g2.getImageData(0, 0, cvs.width, cvs.height).data;
      await new Promise(s => setTimeout(s, 520));
      try { render(); } catch (e) {}
      const f2 = g2.getImageData(0, 0, cvs.width, cvs.height).data;
      let diff = 0;
      for (let i = 0; i < f1.length; i += 4)
        if (Math.abs(f1[i] - f2[i]) > 3 || Math.abs(f1[i + 1] - f2[i + 1]) > 3) diff++;
      out.movedPct = +(100 * diff / (cvs.width * cvs.height)).toFixed(2);

      /* --- THE DAY, asked of the game's own schedule --- */
      const keep = T.min;
      const rows = [];
      for (const h of [3, 7, 10, 13, 17, 20, 23]) {
        T.min = h * 60 + 5;
        let away = 0;
        for (const p of all) { const at = ctAt(p); if (!at) continue;
          if (at[0] !== p.home[0] || at[1] !== p.home[1]) away++; }
        let drawn = 0;
        try { render(); drawn = window.__PPL_DRAWN | 0; } catch (e) {}
        rows.push({ h, away, drawn });
      }
      out.byHour = rows;

      /* --- AND WHERE THE WORLD ITSELF WOULD PUT THEM, borrow off --- */
      const realNear = pplNearField;
      const empty = new Map();
      T.min = 10 * 60 + 5;
      try { render(); } catch (e) {}
      out.borrowedAt10 = window.__PPL_DRAWN | 0;
      pplNearField = () => empty;
      try { render(); } catch (e) {}
      out.worldAt10 = window.__PPL_DRAWN | 0;
      T.min = 20 * 60 + 5;
      try { render(); } catch (e) {}
      out.worldAt20 = window.__PPL_DRAWN | 0;
      pplNearField = realNear;
      try { render(); } catch (e) {}
      out.borrowedAt20 = window.__PPL_DRAWN | 0;
      T.min = keep; try { render(); } catch (e) {}
      return out;
    });

    note('the census on his block', r.census);
    note('drawn over three frames', r.drawnPerFrame.join(', '));
    note('the day, outside then drawn',
         r.byHour.map(x => x.h + 'h ' + x.away + '/' + x.drawn).join('  '));
    note('at ten, borrowed against the world', r.borrowedAt10 + ' / ' + r.worldAt10);
    note('at eight, borrowed against the world', r.borrowedAt20 + ' / ' + r.worldAt20);

    probe('there really are people on this block, so nothing below is an empty pass',
          r.census > 20);
    probe('and bodies really reached the glass in every frame',
          r.drawnPerFrame.every(n => n > 0) && r.facingCommon > 0);

    ok('*** NOT ONE BODY EVER TURNS ITS HEAD. *** The row asked whether everyone is '
       + 'a little too still and they are: same facing in every frame',
       r.facingTurned === 0, r.facingTurned + ' of ' + r.facingCommon + ' turned');
    ok('and they do not all face the same way either, so the stillness is not one '
       + 'stuck value', r.dirsSeen >= 3, r.dirsSeen + ' directions on screen');
    ok('*** NOBODY LOOKS AT HIM, *** which is the third thing the row asked and it '
       + 'is the rule: only an enemy watches you', r.watching === 0);
    ok('*** AND THE BIBLE\'S LONG HOLD PASSES WITH ROOM TO SPARE ***, so nobody may '
       + '"fix" the stillness: R3 wants under 10% of the frame moving',
       r.movedPct < 10, r.movedPct + '% of the screen moved');

    const away = r.byHour.map(x => x.away), drawn = r.byHour.map(x => x.drawn);
    const spread = a2 => Math.max.apply(null, a2) - Math.min.apply(null, a2);
    ok('*** THE WORLD UNDER THIS STREET HAS A WHOLE DAY IN IT. *** Asked of its own '
       + 'schedule hour by hour, the number of people outside really swings',
       spread(away) >= 20, 'outside ranges ' + Math.min.apply(null, away)
       + ' to ' + Math.max.apply(null, away));
    ok('and it is a commute, not noise: busy in the morning, busy again at five, '
       + 'and near empty in the small hours',
       r.byHour[0].away < 5 && r.byHour[2].away > 25 && r.byHour[4].away > 25);
    ok('*** AND THE SCREEN DOES NOT MOVE WITH IT. *** In daylight and after dark '
       + 'the street draws the same crowd, which is bible R7: a crowd is drawn from '
       + 'world data, never faked',
       Math.abs(r.byHour[2].drawn - r.byHour[5].drawn) <= 4
       && r.byHour[2].away - r.byHour[5].away >= 20,
       'ten in the morning ' + r.byHour[2].away + ' outside and ' + r.byHour[2].drawn
       + ' drawn; eight at night ' + r.byHour[5].away + ' outside and '
       + r.byHour[5].drawn + ' drawn');
    ok('*** AND THE BORROW IS WHY, WHICH ALSO SAYS WHY IT EXISTS: *** with it off, '
       + 'the busiest hour of the day puts almost nobody in front of him',
       r.worldAt10 < 6 && r.borrowedAt10 > 15,
       'at ten: ' + r.borrowedAt10 + ' borrowed against ' + r.worldAt10 + ' the world');
    ok('and at eight at night the borrow is doing all of it',
       r.worldAt20 < 6 && r.borrowedAt20 > 15,
       'at eight: ' + r.borrowedAt20 + ' borrowed against ' + r.worldAt20 + ' the world');
    ok('and nothing threw while any of it happened', d.errs.length === 0,
       'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
    await d.close();
  } catch (e) {
    ok('the alpha drive finished', false, e.message);
  }
  probe('the drive really ran, so a green above is not an empty pass', drove);

  /* ======================================================================== */
  head('C. THE PICTURES ARE THE GAME, NOT A DRAWING');
  /* ======================================================================== */
  const shot = n => path.join(SHOTS, 'PEOPLE_STREET_' + n + '_9_21.png');
  const has = n => { try { return fs.statSync(shot(n)).size > 20000; } catch (e) { return false; } };
  const md5 = n => { try { return require('crypto').createHash('md5')
    .update(fs.readFileSync(shot(n))).digest('hex'); } catch (e) { return null; } };
  probe('the three hours are on disk at a real size',
        has('BORROWED_3') && has('BORROWED_10') && has('BORROWED_20')
        && has('WORLD_10') && has('WORLD_20'));
  ok('*** EIGHT AT NIGHT IS TWO DIFFERENT PICTURES ***, so the pair he is asked to '
     + 'choose between is a real difference and not the same frame twice',
     md5('BORROWED_20') && md5('WORLD_20') && md5('BORROWED_20') !== md5('WORLD_20'));
  ok('and so is ten in the morning',
     md5('BORROWED_10') && md5('WORLD_10') && md5('BORROWED_10') !== md5('WORLD_10'));
  ok('*** AND THREE IN THE MORNING IS ONE PICTURE, SAID OUT LOUD ON THE PAGE. *** '
     + 'The borrow changes nothing when nobody is out, and hiding that behind a '
     + 'second identical file would be a comparison that cannot fail',
     !has('WORLD_3'));
  ok('they are the real screen: phone width, not a square crop or a thumbnail',
     (function () {
       try {
         const b = fs.readFileSync(shot('BORROWED_20'));
         const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
         return w > 300 && w < 500 && h > w;
       } catch (e) { return false; }
     })());

  /* ======================================================================== */
  head('D. THE PAGE SAYS WHAT WAS MEASURED, AND ASKS SOMETHING REAL');
  /* ======================================================================== */
  let page = '';
  try { page = fs.readFileSync(PAGE, 'utf8'); } catch (e) {}
  probe('the page exists', page.length > 1500);
  ok('it shows both sides of the evening, side by side',
     /PEOPLE_STREET_BORROWED_20/.test(page) && /PEOPLE_STREET_WORLD_20/.test(page));
  ok('and both sides of the morning, so the case against the change is on the page '
     + 'too', /PEOPLE_STREET_BORROWED_10/.test(page) && /PEOPLE_STREET_WORLD_10/.test(page));
  ok('*** AND IT SAYS WHY THE BORROW EXISTS RATHER THAN CALLING IT A MISTAKE ***, '
     + 'because it was the right call at the time and a page that only argues one '
     + 'side is a rigged vote',
     /right call/i.test(page)
     && /nobody is arguing/i.test(page.replace(/\s+/g, ' ')));
  ok('it carries the day counted, not just two frames', /THE DAY, COUNTED/.test(page));
  ok('it offers three ways to go and one of them is leaving it alone',
     /A &middot;/.test(page) && /B &middot;/.test(page) && /C &middot;/.test(page)
     && /LEAVE IT FLAT/.test(page));
  ok('and it says plainly that nothing was built', /Nothing on this page has been built/.test(page));
  ok('the pictures are pixelated, not smoothed, because it is pixel art',
     /image-rendering:pixelated/.test(page));
  ok('and it reads in daylight, which every judge page in this repo has to',
     /prefers-color-scheme:light/.test(page));

  let item = null;
  try {
    const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
    item = (reg.items || []).find(i => i.id === 'people-the-street-at-three-hours-9-21');
  } catch (e) {}
  ok('this lane cooked something and it is in the tab, which is rule 22', !!item);
  ok('it is this lane\'s and it points at the page',
     !!item && item.lane === 'people' && item.show.src === path.basename(PAGE));
  ok('and the reason he is given carries the two numbers, not an adjective',
     !!item && /41/.test(item.why) && /23 and 24/.test(item.why));

  /* ======================================================================== */
  head('E. RULE 18: NOTHING WAS PUSHED TO THE PLAY SURFACE');
  /* ======================================================================== */
  const city = fs.readFileSync(CITY, 'utf8');
  ok('*** THE BORROW IS UNTOUCHED. *** This row is school under the hold and the '
     + 'borrow is not this lane\'s to change, so it still returns whatever the near '
     + 'field hands it',
     /var near = pplNearField\(\)\.get\(p\.id\);/.test(city)
     && /if \(near\) return near;/.test(city));
  ok('and the facing rule is untouched too, including the one line that lets an '
     + 'enemy look at you', /only enemies watch you/.test(city));
  ok('nothing in this round writes a crowd count anywhere in the walked city',
     !/HORROR_CROWD|crowdTarget|CROWD_CURVE/.test(city));

  /* ======================================================================== */
  head('F. THE RECORD SAYS WHAT WAS MEASURED');
  /* ======================================================================== */
  let rec = '';
  try { rec = fs.readFileSync(REC, 'utf8'); } catch (e) {}
  ok('the record exists and carries the day', /41/.test(rec) && /8pm|eight at night/i.test(rec));
  ok('and it says which of the bible\'s rules this crowd already passes',
     /R3|long hold/i.test(rec));
  ok('and names the one that fails', /R7|nobody home/i.test(rec));
  ok('and it says out loud that nothing was changed on the play surface',
     /rule 18/i.test(rec) && /untouched|not touched/i.test(rec));

  console.log('');
  notes.forEach(n => console.log(n));
  console.log('\n=== HORROR CROWD: ' + pass + ' pass / ' + fail.length + ' fail ===');
  fail.forEach(f => console.log('   - ' + f));
  process.exit(fail.length ? 1 : 0);
})();
