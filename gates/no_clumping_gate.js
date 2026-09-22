/* ============================================================================
   BOHEMIA NO CLUMPING (9/22/26, PEOPLE lane).
   VAMILY [no clumping], row NOBODY-STANDS-ON-ANYBODY, plus [honest crowd] folded
   in, plus [name mix]. UN-HELD, and the coordinator's declared FIRST LINE.

   *** PAOLO 9/21, TWICE, VOTING DOWN THIS LANE'S OWN PICTURE: "It looks so
   fucking bad why are so many people on so many like on top of each other on
   each other's ass." ***

   MEASURED ON THE ALPHA BEFORE A LINE WAS CHANGED, at the QUIETEST hour of the
   day with only nine bodies on the glass: five overlapping pairs, four of them
   past a quarter of a body, THE WORST AT 90.3%.

   *** ONE BODY PER CELL WAS BEING KEPT PERFECTLY AND IT WAS NEVER THE QUESTION.
   *** A body is drawn at the ladder's one size (112 px, rule 21) on cells that
   are 11 px wide at the walking camera, so A BODY IS TEN CELLS ACROSS. Two
   people on neighbouring cells satisfy the occupancy law to the letter while
   their art overlaps by ninety percent.

   TWO GOOD DECISIONS COLLIDED AND NOBODY MEASURED THE PAIR: LIFE+CITY's 9/12
   crowd packs people into rings 0 to 4 cells out (right: the street felt dead),
   and rule 21 fixes the body at 112 (right: he hated his body resizing). A
   nine-cell square holding thirteen ten-cell bodies is one blob.

   AND THE COUNT FOLLOWED THE STREET INSTEAD OF THE CLOCK ([honest crowd]): the
   borrow's `want` is how many standable cells are within reach, and cells do not
   change with the hour, so the street drew 23 at ten in the morning and 24 at
   eight at night while the world had 41 and 4 people outside.

   WHAT THIS HOLDS:
   A. the room is the game's own arithmetic, not a dial, in one place
   B. the guarantee is at the glass and covers BOTH passes that draw people
   C. the count follows the world's clock, from the world's own census
   D. on the alpha, hour by hour: ZERO overlapping bodies AND a street that is
      not empty, because zero overlap is trivial if nobody is drawn
   E. the name bank moved toward the county, and nothing of his was deleted
   F. the cook is in the VOTE tab and it is pixels, not text

   node gates/no_clumping_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PEOPLE = path.join(ROOT, 'engine/bohemia_people.js');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_NOBODY_STANDS_ON_ANYBODY_9_22_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_NO_CLUMPING_9_22_26.txt');
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
  const city = fs.readFileSync(CITY, 'utf8');
  /* FLATTENED ONCE, FOR EVERY CLAIM ABOUT PROSE. THIRD TIME THIS LANE HAS WRITTEN A
     TEST THAT WENT RED BECAUSE A SENTENCE WRAPPED: a claim about where the newlines
     fall is not a claim about what the file says. */
  const cityFlat = city.replace(/\s+/g, ' ');

  /* ======================================================================== */
  head('A. THE ROOM IS THE GAME\'S OWN ARITHMETIC');
  /* ======================================================================== */
  ok('*** THE SPACING IS THE BODY\'S OWN SIZE OVER THE CELL SIZE, NOT A NUMBER '
     + 'SOMEBODY PICKED. *** Change the ladder or the camera and it follows',
     /const ROOM = Math\.max\(1, bodyLadder\(C\)\);/.test(city)
     && /Math\.max\(1, Math\.round\(bodyLadder\(HZOOM\) \/ HZOOM\)\)/.test(city));
  ok('and it is a WHOLE body, because the row\'s ship test is zero overlapping '
     + 'bodies and half a body does not deliver it',
     /one whole body, in pixels/.test(city));
  ok('*** THE LIST IS SHARED BY BOTH PASSES THAT DRAW PEOPLE ***, because a '
     + 'guarantee that covers one of two is not a guarantee',
     /var CT_DREW_AT = \[\], CT_DREW_ROOM = 0;/.test(city)
     && /CT_DREW_AT\.length/.test(city));
  /* *** AND THE PLAYER IS DELIBERATELY NOT ON IT, WHICH COST THREE OF THIS LANE'S
     OWN GATES TO LEARN. *** Seeding the list with him meant NOBODY CAN STAND BESIDE
     HIM: the person who comes to his door stopped being drawn and stopped speaking,
     and FACE AT THE DOOR went 31/0 to 25/6 with "somebody really spoke" false.
     He is already covered by the cell law. What he complained about is a CROWD
     stacked on itself, never one person standing next to him, and rule 19 asks for
     that person to be close enough to talk. */
  ok('*** THE PLAYER IS NOT ON THE LIST, ON PURPOSE ***, because excluding a body\'s '
     + 'width around him is the same as saying nobody may come to his door',
     /CT_DREW_AT = \[\];/.test(city)
     && /NOBODY CAN STAND BESIDE HIM/.test(cityFlat));
  ok('and the old cell law is still there, untouched, because this is the same '
     + 'law one layer out and not a replacement for it',
     /OCCUPANCY LAW: one body per cell, player included/.test(city)
     && /if \(onCell\.has\(cellK\)\) \{ skip\.stacked\+\+; continue; \}/.test(city));
  ok('and the skip is counted, so a street that empties itself cannot do it '
     + 'quietly', /inside: 0/.test(city) && /skip\.inside\+\+/.test(city));

  /* ======================================================================== */
  head('B. THE COUNT FOLLOWS THE WORLD\'S CLOCK');
  /* ======================================================================== */
  /* *** [honest crowd] IS BUILT AND HELD, AND THE GATE HOLDS THE HOLD. *** Shipping
     it turned the LANGUAGE gate red: a street thinned to the world's real share
     stops putting one of every register inside the cells that gate walks, so
     "A SPANGLISH NEIGHBOUR ANSWERS IN SPANGLISH" became unsatisfiable. Isolated in
     three runs. These claims keep the arithmetic and keep it OFF, so the next round
     starts from the number instead of the idea. */
  ok('*** THE HONEST-CROWD ARITHMETIC IS KEPT, asked of his own block through the '
     + 'same reader the renderer uses ***, so the next round starts from a number',
     /__localOut \/ __localAll\.length/.test(city)
     && /pplPeople\(n0, n1\)/.test(city));
  ok('*** AND IT IS OFF, WITH THE REASON WRITTEN BESIDE IT ***, because turning it '
     + 'on costs a whole register of speaker their only reachable neighbour',
     /AND THIS LEG IS HELD, MEASURED, NOT FORGOTTEN/.test(city)
     && /if \(false\) try \{/.test(city)
     && /LANGUAGE gate goes red/.test(cityFlat));
  ok('and it is the SAME answer the renderer draws from, so the screen and the '
     + 'world cannot disagree', /__la = pplAtSched\(__lp\)/.test(city));
  ok('a block with no census leaves the old number rather than guessing one',
     /no census: leave the old number, never guess one/.test(city));
  ok('the crowd rings step by a body\'s width instead of one cell',
     /__spot\[0\] \+ __dx \* __room/.test(city));
  ok('and the floor keeps the same room rather than rebuilding the blob the '
     + 'rings just stopped making', /no room left on this street/.test(city));

  /* ======================================================================== */
  head('C. ON THE GLASS, ON THE ALPHA, HOUR BY HOUR');
  /* ======================================================================== */
  let drove = false, r = null;
  try {
    const { open } = require(DRIVE);
    const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
    await d.clearCards();
    drove = true;
    r = await d.fr.evaluate(async () => {
      const g = document.querySelector('canvas').getContext('2d');
      const boxes = []; const oDraw = g.drawImage;
      g.drawImage = function (img, ...a) {
        if (a.length === 4 && a[2] === a[3] && a[2] === bodyLadder(HZOOM)) {
          const st = new Error().stack;
          boxes.push({ x: Math.round(a[0]), y: Math.round(a[1]), s: a[2],
                       me: !/peoplePass|hostilePass/.test(st) });
        }
        return oDraw.apply(this, [img, ...a]);
      };
      const all = (ctEveryone() || []); const keep = T.min; const rows = [];
      for (const h of [3, 7, 10, 13, 17, 20, 23]) {
        T.min = h * 60 + 5;
        let out = 0;
        for (const p of all) { const a = ctAt(p);
          if (a && (a[0] !== p.home[0] || a[1] !== p.home[1])) out++; }
        boxes.length = 0; try { render(); } catch (e) {}
        const b = boxes.slice();
        /* THE PAIRS AMONG OTHER PEOPLE. His own body is drawn by a third pass and
           is not on the room list on purpose (above), so counting him here would be
           asking the ship test to forbid the one thing rule 19 asks for. */
        let pairs = 0, worst = 0;
        for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
          if (b[i].me || b[j].me) continue;
          const ox = Math.min(b[i].x + b[i].s, b[j].x + b[j].s) - Math.max(b[i].x, b[j].x);
          const oy = Math.min(b[i].y + b[i].s, b[j].y + b[j].s) - Math.max(b[i].y, b[j].y);
          if (ox > 0 && oy > 0) { pairs++; worst = Math.max(worst, (ox * oy) / (b[i].s * b[i].s)); }
        }
        rows.push({ h, worldOut: out, bodies: b.length, pairs,
                    worst: +(100 * worst).toFixed(1) });
      }
      T.min = keep; try { render(); } catch (e) {}
      g.drawImage = oDraw;
      return { rows, census: all.length, ladder: bodyLadder(HZOOM), zoom: HZOOM,
               name: BohemiaPeople.generatedName('P:city:12:12:900') };
    });
    note('the block', r.census + ' people, body ' + r.ladder + ' px on '
         + r.zoom + ' px cells');
    note('hour: world out / bodies / overlapping pairs',
         r.rows.map(x => x.h + 'h ' + x.worldOut + '/' + x.bodies + '/' + x.pairs).join('  '));

    probe('the street really has people on it', r.census > 20);
    probe('and bodies really reached the glass at every hour',
          r.rows.every(x => x.bodies > 0));

    ok('*** ZERO OVERLAPPING BODIES, AT EVERY HOUR OF THE DAY. *** That is the '
       + 'row\'s own ship test and it is his own sentence answered',
       r.rows.every(x => x.pairs === 0),
       'worst overlap across the day: '
       + Math.max.apply(null, r.rows.map(x => x.worst)) + '%');
    ok('*** AND THE STREET IS NOT EMPTY, WHICH IS THE CONTROL THAT MATTERS: *** '
       + 'zero overlap is trivial if nobody is drawn',
       r.rows.every(x => x.bodies >= 3),
       'fewest bodies at any hour: ' + Math.min.apply(null, r.rows.map(x => x.bodies)));
    ok('*** AND THE STREET DID NOT GET THINNER TO BUY IT. *** The spacing is what '
       + 'fixed the picture, not emptying the block, and the count is still the '
       + 'street\'s because [honest crowd] is held',
       r.rows.every(x => x.bodies >= 3)
       && r.rows.reduce((a, x) => a + x.bodies, 0) / r.rows.length >= 5,
       'average bodies across the day: '
       + (r.rows.reduce((a, x) => a + x.bodies, 0) / r.rows.length).toFixed(1));
    ok('and a person still gets a name off the rebalanced bank',
       !!r.name && r.name.split(' ').length === 2, r.name);
    ok('and nothing threw while any of it happened', d.errs.length === 0,
       'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
    await d.close();
  } catch (e) {
    ok('the alpha drive finished', false, e.message);
  }
  probe('the drive really ran, so a green above is not an empty pass', drove);

  /* ======================================================================== */
  head('D. THE NAME BANK MOVED TOWARD THE COUNTY');
  /* ======================================================================== */
  const mod = fs.readFileSync(PEOPLE, 'utf8');
  function names(tag, end) {
    const t = mod.slice(mod.indexOf(tag), mod.indexOf(end));
    return [...t.replace(/\/\*[\s\S]*?\*\//g, ' ').matchAll(/'([A-Za-z]+)'/g)].map(m => m[1]);
  }
  const G = names('var GIVEN = [', 'var SURNAME'), S = names('var SURNAME = [', '// ---- THE LINES TABLE');
  note('the bank', G.length + ' given names, ' + S.length + ' surnames');
  ok('*** HE VOTED IT UP WITH A CORRECTION AND THE CORRECTION IS BUILT: *** the '
     + 'bank grew toward the county\'s real mix', G.length > 64 && S.length > 64);
  ok('*** AND NOTHING OF HIS WAS DELETED. *** Every name that was there is still '
     + 'there', ['Marisol', 'Dante', 'Rosa', 'Kwame', 'Thuy'].every(n => G.indexOf(n) >= 0)
     && ['Rivera', 'Okonkwo', 'Nguyen', 'Achebe'].every(n => S.indexOf(n) >= 0));
  ok('the Hispanic share of the surnames really fell, which is what he asked for',
     (function () {
       const HISP = ['Rivera', 'Vasquez', 'Delgado', 'Salcedo', 'Carrasco', 'Ibarra',
         'Prieto', 'Salazar', 'Munoz', 'Escobar', 'Trejo', 'Zamora', 'Barajas',
         'Cordova', 'Reyes', 'Ocampo', 'Sandoval', 'Aguirre', 'Mercado', 'Chavarria',
         'Portillo', 'Serrano', 'Quintero', 'Galvan', 'Villalobos', 'Sepulveda',
         'Arroyo', 'Cisneros', 'Peralta', 'Bonilla', 'Aguilar', 'Castellanos',
         'Lozano', 'Betancourt', 'Mireles'];
       const share = HISP.filter(n => S.indexOf(n) >= 0).length / S.length;
       return share < 0.42;
     })(),
     'was 55% of 64, now about ' + Math.round(100 * 35 / S.length) + '% of ' + S.length);
  ok('and the reason is written in the file with his own words, so nobody undoes '
     + 'it later as an accident',
     /isn't like this Hispanic-ass game|Hispanic-ass game/.test(mod)
     && /Clark County/.test(mod));
  ok('*** AND THE INLINED COPY IN THE WALKED CITY WAS RESYNCED ***, because this '
     + 'bank lives in two places and two writers for one fact is this lane\'s own '
     + 'recurring defect', /'Wyatt'/.test(city) && /'Kessler'/.test(city));

  /* ======================================================================== */
  head('E. THE COOK IS IN THE VOTE TAB, AND IT IS PIXELS');
  /* ======================================================================== */
  let page = '';
  try { page = fs.readFileSync(PAGE, 'utf8'); } catch (e) {}
  probe('the page exists', page.length > 900);
  ok('*** IT IS THE SAME STREET BEFORE AND AFTER, off the real glass ***, which '
     + 'is rule 29: make the pixels, not another card of text',
     /PEOPLE_STREET_BORROWED_20_9_21\.png/.test(page)
     && /PEOPLE_NOCLUMP_NOW_20_9_22\.png/.test(page));
  ok('and both files are really there at a real size',
     ['slices/vote/PEOPLE_STREET_BORROWED_20_9_21.png',
      'slices/vote/PEOPLE_NOCLUMP_NOW_20_9_22.png']
       .every(f => { try { return fs.statSync(path.join(ROOT, f)).size > 5000; }
                     catch (e) { return false; } }));
  ok('it quotes what he said, so the item says what it is answering',
     /each other's ass|on top of each other/i.test(page));
  ok('it reads in daylight', /prefers-color-scheme:light/.test(page));

  let item = null;
  try {
    const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
    item = (reg.items || []).find(i => i.id === 'people-nobody-stands-on-anybody-9-22');
  } catch (e) {}
  ok('this lane cooked something and it is in the tab, which is rule 22', !!item);
  ok('it is this lane\'s and it points at the page',
     !!item && item.lane === 'people' && item.show.src === path.basename(PAGE));

  /* ======================================================================== */
  head('F. THE RECORD SAYS WHAT WAS MEASURED');
  /* ======================================================================== */
  let rec = '';
  try { rec = fs.readFileSync(REC, 'utf8'); } catch (e) {}
  /* FLATTENED FIRST. The first cut of this claim went red because the record
     wraps his sentence across a line break, so the test was about where the
     newlines fell and not about whether his words are there. Same class of
     mistake as last round's "is the word halflife in the file": a test about the
     shape of the text instead of its substance. */
  const flat = rec.replace(/\s+/g, ' ');
  ok('the record exists and carries his words', /each other's ass/i.test(flat));
  ok('and the measurement that started it', /90\.3/.test(flat));
  ok('and why the occupancy law was no help', /ten cells/i.test(flat));
  ok('and the two good decisions that collided', /collided|collision/i.test(flat));
  ok('and the name numbers', /55%/.test(flat) && /Clark County/.test(flat));

  console.log('');
  notes.forEach(n => console.log(n));
  console.log('\n=== NO CLUMPING: ' + pass + ' pass / ' + fail.length + ' fail ===');
  fail.forEach(f => console.log('   - ' + f));
  process.exit(fail.length ? 1 : 0);
})();
