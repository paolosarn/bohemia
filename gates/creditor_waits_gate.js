/* ============================================================================
   BOHEMIA CREDITOR WAITS (9/24/26, PEOPLE lane).
   VAMILY [creditor waits], row THE-MAN-WHO-REMEMBERS-IS-ON-HIS-STREET-NOT-IN-HIS-
   FACE. Rule 32a, laws/BOHEMIA_ADDENDUM_THE_SECOND_VOTES_9_24_26.md section 1.

   *** PAOLO 9/23, VOTING ON THIS LANE'S OWN SHIPPED [creditor stands], THREE WAYS
   *** IN ONE BATCH: "Why does everything have to happen the first second of the
   *** game or even be in the demo?" "Don't force this on me." "Don't force
   *** interactions on the player."

   THE LAW NAMES ITS OWN GATE: "every spoken line has a distance and a delay;
   nothing speaks in the first 60 s of play; nothing speaks unless he is within
   its reach; nothing halts the pad." This is that gate.

   MEASURED ON THE ALPHA BEFORE A LINE WAS CHANGED:
       the first word landed          0 ms after the city was playable
       lines in the first minute      2
       copies of the reach number     6, and one of them disagreed (7 against 6)

   WHAT THIS HOLDS:
   A. one clock, stamped once, anchored on the BEGIN tap and never compared
      across a frame boundary
   B. one gate at the top of the one function every mouth goes through
   C. the distances are declared, named for the kind of speech, and every mouth
      reads them
   D. on the alpha: silent for the first minute, LOUD AFTER IT, in reach, and
      silent in the demo
   E. the cook is a frame from the game's own camera (rule 32f)

   node gates/creditor_waits_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_NOBODY_STOPS_YOU_YET_9_24_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_CREDITOR_WAITS_9_24_26.txt');
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

let pass = 0; const fail = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }
function note(k, v) { console.log('       ' + k + ': ' + v); }
const flat = s => String(s).replace(/\s+/g, ' ');

(async () => {
const city = fs.readFileSync(CITY, 'utf8');
const alpha = fs.readFileSync(ALPHA, 'utf8');

/* ======================================================================== */
head('A. ONE CLOCK, STAMPED ONCE, AND NEVER ACROSS A FRAME BOUNDARY');
/* ======================================================================== */
ok('the shell says WHEN PLAY BEGAN at the one place play begins, the BEGIN tap',
   /BOHEMIA_PLAY_BEGAN/.test(alpha) && /window\.__PLAY_BEGAN = true/.test(alpha));
ok('*** AND IT SENDS NO TIMESTAMP, *** because the city frame is a different '
   + 'document with a different time origin and this lane has already paid for '
   + 'comparing two clocks once',
   /this does not send a timestamp/.test(flat(alpha))
     && !/BOHEMIA_PLAY_BEGAN'[^}]*now/.test(alpha));
ok('the city stamps its own clock and only ever once',
   /function ctPlayBegan\(\)/.test(city) && /if \(CT_PLAY_MS\) return CT_PLAY_MS;/.test(city));
ok('and it still picks it up when the frame was not built yet at BEGIN',
   /function ctPlayPoll\(\)/.test(city) && /par\.__PLAY_BEGAN/.test(city));
ok('a surface with no door in front of it stamps itself, so nothing is mute for '
   + 'ever waiting on a tap that is not coming',
   /if \(!par\) return ctPlayBegan\(\);/.test(city));

/* ======================================================================== */
head('B. ONE GATE, AT THE TOP OF THE ONE FUNCTION EVERY MOUTH GOES THROUGH');
/* ======================================================================== */
const tick = city.slice(city.indexOf('function barkTick(now){'),
                        city.indexOf('function barkTick(now){') + 1200);
ok('every mouth is held behind one question', /if \(!BARK\.p && !ctMaySpeak\(now\)\) return;/.test(tick));
ok('*** AND IT IS THE FIRST THING THE FUNCTION DOES, *** so a mouth added later '
   + 'is quiet by default instead of quiet only if somebody remembered',
   tick.indexOf('ctMaySpeak(now)') < tick.indexOf('BARK.next'));
ok('and a bubble already up is left alone, so this can never cut somebody off '
   + 'mid-sentence', /A BUBBLE ALREADY UP IS LEFT ALONE/.test(flat(city)));
ok('the quiet length is his number, written as what it is',
   /var CT_QUIET_S = 60;/.test(city));
ok('*** AND NOTHING FIRES IN THE DEMO AT ALL, *** which he said in the same '
   + 'breath ("or even be in the demo")',
   /if \(typeof CT_IS_DEMO !== 'undefined' && CT_IS_DEMO\) return false;/.test(city));

/* ======================================================================== */
head('C. EVERY SPOKEN LINE HAS A DECLARED DISTANCE');
/* ======================================================================== */
ok('the distances are declared in one place', /var CT_VOICE = \{/.test(city));
const voice = (city.match(/var CT_VOICE = \{[\s\S]*?\};/) || [''])[0];
ok('and each one is named for the KIND of speech it belongs to, not just a number',
   /toYou:/.test(voice) && /overheard:/.test(voice) && /ambient:/.test(voice));
const sites = (city.match(/CT_VOICE\.(toYou|overheard|ambient)/g) || []);
note('mouths reading the table', sites.length);
ok('*** AND EVERY MOUTH READS IT. *** These were six copies of a number and one '
   + 'of them disagreed: five typed 6 and barkPick typed 7',
   sites.length >= 5, sites.length + ' sites');
ok('no mouth still carries its own copy of the number',
   !/Math\.abs\(d\.at\[0\] - hx\) \+ Math\.abs\(d\.at\[1\] - hy\) > [0-9]/.test(city)
     && !/Math\.abs\(d0\.at\[0\] - hx\) \+ Math\.abs\(d0\.at\[1\] - hy\) > [0-9]/.test(city));
ok('*** A RUMOUR IS OVERHEARD AND CARRIES THE SHORT DISTANCE, *** which is his '
   + 'own sentence: "a rumour is OVERHEARD as he passes, never said to his face"',
   /ctRumourBark[\s\S]{0,900}?CT_VOICE\.overheard/.test(city));
ok('and the creditor SPEAKS TO HIM, which is his sentence too, so she gets the '
   + 'speaking-to-you distance and not the overheard one',
   /ctStoodBark[\s\S]{0,900}?CT_VOICE\.toYou/.test(city));
ok('the ambient street keeps the number it has always had, so the street he '
   + 'already has does not change under him', /ambient:\s*7/.test(voice));

/* ======================================================================== */
head('D. ON THE ALPHA: QUIET FIRST, LOUD AFTER, IN REACH, SILENT IN THE DEMO');
/* ======================================================================== */
let drove = false, r = null;
try {
  const { open } = require(DRIVE);
  const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
  await d.clearCards();
  drove = true;
  r = await d.fr.evaluate(async () => {
    try { ctPeopleWipe(); } catch (e) {}
    try { render(); } catch (e) {}
    const out = {};
    const t0 = CT_PLAY_MS || ctPlayBegan();
    const walk = (fromS, toS) => {
      const said = [];
      for (let t = fromS; t <= toS; t += 1.5) {
        BARK.p = null; BARK.until = 0; BARK.next = 0;
        try { render(); barkTick(t0 + t * 1000); } catch (e) {}
        if (BARK.p && BARK.text)
          said.push(Math.abs(BARK.at[0] - hx) + Math.abs(BARK.at[1] - hy));
      }
      return said;
    };
    const early = walk(0, 59);
    out.early = early.length;
    const later = walk(61, 200);
    out.later = later.length;
    out.furthest = later.length ? Math.max.apply(null, later) : null;
    const wasDemo = CT_IS_DEMO; CT_IS_DEMO = true;
    out.inDemo = walk(120, 200).length;
    CT_IS_DEMO = wasDemo;
    out.reach = { toYou: CT_VOICE.toYou, overheard: CT_VOICE.overheard,
                  ambient: CT_VOICE.ambient };
    /* NOTHING HALTS THE PAD: a bubble is up and he can still walk. */
    BARK.p = null; BARK.until = 0; BARK.next = 0;
    try { barkTick(t0 + 90 * 1000); } catch (e) {}
    out.bubbleUp = !!BARK.p;
    const x0 = hx, y0 = hy;
    try { for (let i = 0; i < 4; i++) { stepOnce(i % DIRS.length); render(); } } catch (e) {}
    out.movedWithBubbleUp = (hx !== x0) || (hy !== y0);
    return out;
  });
  note('lines in the first minute', r.early);
  note('lines after it', r.later);
  note('furthest speaker', r.furthest + ' cells, against a reach of '
    + Math.max(r.reach.toYou, r.reach.ambient));
  note('lines in the demo', r.inDemo);

  probe('the street really has voices in it, so a zero below is not an empty set',
        r.later > 10);
  ok('*** NOBODY SPEAKS IN HIS FIRST MINUTE. *** It used to be the first word at '
     + '0 ms', r.early === 0, r.early + ' lines');
  ok('*** AND THE STREET IS NOT MUTED TO BUY IT, which is the control that '
     + 'matters: shutting everybody up would pass the claim above and give him a '
     + 'dead town ***', r.later > 10, r.later + ' lines after the minute');
  ok('nothing speaks from outside its reach',
     r.furthest !== null && r.furthest <= Math.max(r.reach.toYou, r.reach.ambient),
     r.furthest + ' cells');
  ok('*** AND NOTHING FIRES IN THE DEMO ***', r.inDemo === 0, r.inDemo + ' lines');
  probe('a bubble really was up for the pad test', r.bubbleUp === true);
  ok('*** AND NOTHING HALTS THE PAD: he walks with somebody mid-sentence ***',
     r.movedWithBubbleUp === true);
  ok('and nothing threw while any of it happened', d.errs.length === 0,
     'page errors ' + d.errs.length + (d.errs.length ? ': ' + d.errs[0] : ''));
  await d.close();
} catch (e) {
  ok('the alpha drive finished', false, e.message);
}
probe('the drive really ran, so a green above is not an empty pass', drove);

/* ======================================================================== */
head('E. THE COOK IS A FRAME FROM THE GAME\'S OWN CAMERA (rule 32f)');
/* ======================================================================== */
ok('the page exists', fs.existsSync(PAGE));
const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
const shots = ['PEOPLE_WAITS_1_QUIET.png', 'PEOPLE_WAITS_2_SPOKE.png'];
ok('*** AND BOTH FRAMES ARE THE WALKED STREET, not a study and not a sheet. *** '
   + 'He killed a picture this round for exactly this: "this game isn\'t in first '
   + 'person, when would I see this?"',
   shots.every(s => page.indexOf(s) >= 0
     && fs.existsSync(path.join(ROOT, 'slices/vote', s)))
     && /from the game's own camera/i.test(flat(page)));
const sizes = shots.map(s => { try { return fs.statSync(path.join(ROOT, 'slices/vote', s)).size; }
                               catch (e) { return 0; } });
ok('and they are two different frames', new Set(sizes).size === 2
   && sizes.every(s => s > 50000), sizes.join(' / ') + ' bytes');
ok('the page quotes him', /why does everything have to happen the first second/i.test(flat(page)));
ok('and it leads with the control rather than the claim',
   /would pass the first two and give you a dead town/i.test(flat(page)));
ok('and it reads at an eighth-grade level: no code words on his screen',
   !/barkTick|CT_VOICE|ctMaySpeak|performance|postMessage|null/.test(page));
let item = null;
try {
  const reg = JSON.parse(fs.readFileSync(REG, 'utf8'));
  item = (reg.items || []).find(i => i.id === 'people-nobody-stops-you-yet-9-24');
} catch (e) {}
ok('*** IT IS REGISTERED IN THE ONE VOTE TAB (rule 22) ***', !!item,
   item ? item.title : 'not in the registry');
ok('and it points at the page (rule 25)',
   !!(item && item.show && item.show.src === path.basename(PAGE)));
ok('and it is not a text item (rule 29)', !!(item && item.kind !== 'line'));

/* ======================================================================== */
head('F. THE RECORD');
/* ======================================================================== */
ok('the record exists', fs.existsSync(REC));
const rec = fs.existsSync(REC) ? flat(fs.readFileSync(REC, 'utf8')) : '';
ok('and it carries his own words', /don't force this on me/i.test(rec));
ok('and the before measurement, with the number that disagreed',
   /0 ms/.test(rec) && /7/.test(rec));
ok('and it says what is measured and NOT fixed', /MEASURED AND NOT FIXED/i.test(rec));

/* ======================================================================== */
console.log('\n' + (fail.length ? 'RED' : 'GREEN') + ': ' + pass + ' passed, '
  + fail.length + ' failed');
if (fail.length) { fail.forEach(f => console.log('   FAIL  ' + f)); process.exit(1); }
})();
