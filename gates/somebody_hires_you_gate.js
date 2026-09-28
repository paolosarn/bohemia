/* ============================================================================
   BOHEMIA SOMEBODY HIRES YOU (9/28/26, PEOPLE lane).
   VAMILY [somebody hires you], row WHO-WILL-GIVE-YOU-WORK. With WORLD
   [a days work].

   THE ROW, VERBATIM: "a person offers you the job, and whether they will
   depends on your standing and on what you used to be... A stranger gets the
   worst work; somebody who vouches for you gets you the better shift; a bad
   name closes doors."

   *** MEASURED BEFORE A LINE OF THIS EXISTED: A SITE DISTRICT ALWAYS OFFERED
   THE SAME WORK TO ANYBODY, FOR EVER. *** kindAt() answered off the ground
   alone. Two real systems already know who the player is to a faction and
   neither had ever been asked: the belonging ladder (how many times you have
   done what an outfit wants, starts at 'stranger') and the standing web
   (named people warm on you off a deed they watched). A third, ctRelToMine,
   already answers 'hostile' -- the same fact that decides who attacks you on
   sight.

   *** AND A FALSE PREMISE CAUGHT BEFORE IT WAS BUILT ON. *** The standing
   web's DEED_WEIGHT table ships EMPTY in the module, which read as "dead until
   Paolo rules it" -- and would have been the wrong thing to build a whole
   design around. MEASURED on the real page: it is NOT empty, 84 rows, filled
   at boot from the quest corpus. The web is live; a fresh save just has not
   touched a quest yet.

   *** AND THE GROUND MOVED MID-ROUND. Rule 38 (9/28, LOCKED) killed
   tile-to-tile through the city the same round this row was claimed. *** The
   engine mechanism (doorFor/offer) asks for a faction and coordinates, never
   "where his feet are", so nothing about it had to change; only the ONE city
   caller (workOffer, wired to the walked pad, the only surface live today)
   will need to be re-pointed at a settlement screen once one exists.

   node gates/somebody_hires_you_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const PAGE = path.join(ROOT, 'slices/BOHEMIA_A_STRANGER_GETS_THE_WORST_WORK_9_28_26.html');
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const REC = path.join(ROOT, 'records/BOHEMIA_SOMEBODY_HIRES_YOU_9_28_26.txt');
const W = require(path.join(ROOT, 'engine/bohemia_work.js'));

let pass = 0; const fail = [];
function ok(c, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + c + (note ? '   ' + note : '')); }
  else { fail.push(c); console.log('  FAIL ' + c + (note ? '   ' + note : '')); }
}
function probe(c, cond) { ok('[self-test] ' + c, cond); }
function head(t) { console.log('\n' + t); }
function note(k, v) { console.log('       ' + k + ': ' + v); }
const flat = s => String(s).replace(/\s+/g, ' ');

(async () => {
const city = fs.readFileSync(CITY, 'utf8');
const worldApi = { at: () => ({ district: 'commercial' }) };
const scavWorldApi = { at: () => ({ district: 'suburb' }) };

/* ======================================================================== */
head('A. THE DOOR IS PURE, AND `who` IS FACTS, NEVER A PERSON');
/* ======================================================================== */
ok('unasked is unchanged (backward compatible with every existing caller)',
   JSON.stringify(W.doorFor(null)) === JSON.stringify({ open: true, upgrade: true, why: null }));
ok('*** A STRANGER IS OPEN BUT NOT UPGRADED ***',
   W.doorFor({ rel: null, rung: 'stranger', vouched: false }).open === true
   && W.doorFor({ rel: null, rung: 'stranger', vouched: false }).upgrade === false);
ok('a real rung above stranger upgrades on its own, no vouch needed',
   W.doorFor({ rel: null, rung: 'peripheral', vouched: false }).upgrade === true);
ok('*** A VOUCH ALONE UPGRADES A STRANGER ***',
   W.doorFor({ rel: null, rung: 'stranger', vouched: true }).upgrade === true);
ok('*** A HOSTILE RELATIONSHIP CLOSES THE DOOR, REGARDLESS OF RUNG OR VOUCH ***',
   W.doorFor({ rel: 'hostile', rung: 'useful', vouched: true }).open === false);
probe('this leg can fail: an upgrade for a stranger with nothing would be wrong',
   W.doorFor({ rel: null, rung: 'stranger', vouched: false }).upgrade !== true);
ok('*** THE DOOR TAKES A FACTION\'S FACTS, NEVER A CELL: it never had to change under rule 38 ***',
   !/function doorFor\(who, x, y\)/.test(fs.readFileSync(path.join(ROOT, 'engine/bohemia_work.js'), 'utf8')));

/* ======================================================================== */
head('B. THE DOOR CAN ONLY DOWNGRADE OR CLOSE, NEVER INVENT A JOB');
/* ======================================================================== */
const strangerOffer = W.offer(worldApi, 0, 0, 42, 999, null, { rel: null, rung: 'stranger', vouched: false });
ok('*** A STRANGER AT A SITE DISTRICT GETS SCAV, THE WORST WORK ***',
   strangerOffer.kind === 'scav' && strangerOffer.offeredSite === true,
   JSON.stringify(strangerOffer));
const knownOffer = W.offer(worldApi, 0, 0, 42, 999, null, { rel: null, rung: 'useful', vouched: false });
ok('and standing gets the real shift the district offers', knownOffer.kind === 'site');
const strangerScav = W.offer(scavWorldApi, 0, 0, 42, 999, null, { rel: null, rung: 'stranger', vouched: false });
ok('a stranger on a scav district is unchanged: nothing to downgrade',
   strangerScav.kind === 'scav' && strangerScav.offeredSite === false);
const vouchedScav = W.offer(scavWorldApi, 0, 0, 42, 999, null, { rel: null, rung: 'stranger', vouched: true });
ok('*** AND STANDING NEVER UPGRADES A SCAV DISTRICT INTO A SITE JOB ***',
   vouchedScav.kind === 'scav', 'standing does not conjure a job the ground never had');
ok('*** A HOSTILE OUTFIT CLOSES THE WHOLE DOOR, NOT JUST THE SITE HALF ***',
   W.offer(scavWorldApi, 0, 0, 42, 999, null, { rel: 'hostile', rung: 'useful', vouched: true }) === null);
ok('and the reason is named on the offer, not silent', strangerOffer.door === 'stranger');
ok('unasked callers see nothing new: bytes-identical to the old shape plus two fields',
   W.offer(worldApi, 0, 0, 42, 999, null).kind === 'site'
   && W.offer(worldApi, 0, 0, 42, 999, null).door === null);

/* ======================================================================== */
head('C. THE CITY ASKS THREE DOORS IT ALREADY HAS, NEVER A FOURTH');
/* ======================================================================== */
ok('ctHiringWho reads the belonging ladder for THIS faction',
   /BohemiaBelonging\.gaveOf\(sv, faction\)/.test(city)
   && /BohemiaBelonging\.rungOf\(BohemiaBelonging\.ruleOf\(faction\), given\)/.test(city));
ok('and the between organ\'s own sign for this faction, the same fact ctAgainstMe reads',
   /var r = ctRelToMine\(faction\); rel = r \? r\.sign : null;/.test(city));
ok('*** AND A MIND-TO-FACTION LOOKUP THAT REUSES THE 8\/11 LESSON, NEVER A NEW GUESS ***',
   /ctFactionOfMind\(vs\[i\]\.who\) === faction/.test(city));
ok('the vouch check is guarded by whether deeds are ruled at all',
   /if \(ctDeedsRuled\(\)\) \{/.test(city));
ok('workOffer asks the same ground holder doWork already pays through',
   /var seats = turfSeats\(\);\s*var h = BohemiaTowns\.holderOf\(seats, c\[0\], c\[1\]\);/.test(city));
ok('and the offer carries who through to BohemiaWork.offer', /insideRoom\(\),who\)/.test(city));
ok('*** ctHiringWho ASKS FOR A FACTION, NEVER A CELL: it is the settlement screen\'s reference caller too ***',
   /function ctHiringWho\(faction\)\{/.test(city));

/* ======================================================================== */
head('D. ON THE ALPHA, ON THE REAL OVERMAP');
/* ======================================================================== */
let live = null;
try {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ file: 'BOHEMIA_ALPHA_0_9.html' });
  await d.clearCards();
  live = await d.fr.evaluate(async () => {
    const out = { errs: [] };
    let target = null, seats = null;
    try { seats = turfSeats(); } catch (e) { out.errs.push('seats ' + e); }
    const JOB = { commercial: 1, industrial: 1, medical: 1, solar: 1 };
    outer:
    for (let x = 0; x < (om.n || 96); x += 2) {
      for (let y = 0; y < (om.n || 96); y += 2) {
        let c = null; try { c = om.at(x, y); } catch (e) { continue; }
        if (!c || !JOB[c.district]) continue;
        let h = null; try { h = BohemiaTowns.holderOf(seats, x, y); } catch (e) { continue; }
        if (h && h.faction) { target = { x, y, district: c.district, faction: h.faction }; break outer; }
      }
    }
    out.target = target;
    if (!target) return out;
    out.asStranger = BohemiaWork.offer(om, target.x, target.y, seed, 999, null,
      { rel: null, rung: 'stranger', vouched: false });
    out.asStanding = BohemiaWork.offer(om, target.x, target.y, seed, 999, null,
      { rel: null, rung: 'useful', vouched: false });
    out.asHostile = BohemiaWork.offer(om, target.x, target.y, seed, 999, null,
      { rel: 'hostile', rung: 'useful', vouched: true });
    out.freshWho = ctHiringWho(target.faction);
    out.freshOfferAtTarget = BohemiaWork.offer(om, target.x, target.y, seed, 999, null, out.freshWho);
    try {
      const sv = ctBelongSave();
      for (let k = 0; k < 5; k++) BohemiaBelonging.record(sv, target.faction, T.day || 1);
      window.__CT_BELONG = sv;
    } catch (e) { out.errs.push('record ' + e); }
    out.afterFavours = ctHiringWho(target.faction);
    out.offerAfterFavours = BohemiaWork.offer(om, target.x, target.y, seed, 999, null, out.afterFavours);
    try { out.deedWeightKeys = Object.keys(BohemiaStanding.DEED_WEIGHT || {}).length; } catch (e) {}
    return out;
  });
  await d.close();
} catch (e) { live = { threw: String(e) }; }

if (live && !live.threw && live.target) {
  note('target', JSON.stringify(live.target));
  note('deed weight keys on the real page', live.deedWeightKeys);
  ok('a real site district with a real holder exists on the live overmap', !!live.target);
  ok('*** THE FRESH-SAVE DEFAULT IS HONESTLY STRANGER, THE WORST WORK ***',
     live.freshWho && live.freshWho.rung === 'stranger' && !live.freshWho.vouched,
     JSON.stringify(live.freshWho));
  ok('and the fresh offer at that real site district is downgraded to scav',
     live.freshOfferAtTarget && live.freshOfferAtTarget.kind === 'scav'
     && live.freshOfferAtTarget.offeredSite === true);
  ok('a fabricated stranger and a fabricated standing disagree the same way',
     live.asStranger.kind === 'scav' && live.asStanding.kind === 'site');
  ok('a fabricated hostile relationship closes the door entirely', live.asHostile === null);
  ok('*** DOING REAL FAVOURS THROUGH THE ASKS SAVE MOVES THE REAL OFFER, LIVE ***',
     live.afterFavours && live.afterFavours.rung !== 'stranger'
     && live.offerAfterFavours && live.offerAfterFavours.kind === 'site',
     'rung now ' + (live.afterFavours && live.afterFavours.rung));
  ok('nothing threw on the real surface', live.errs.length === 0, live.errs.join(' | ') || 'clean');
} else {
  ok('the alpha could be driven and a target found', false,
     live ? (live.threw || 'no job district with a holder found') : 'no result');
}

/* ======================================================================== */
head('E. THE COOK AND THE RECORD');
/* ======================================================================== */
ok('the cook exists', fs.existsSync(PAGE));
const page = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
ok('*** IT NAMES THE FALSE PREMISE IT CAUGHT: THE STANDING WEB IS NOT DEAD ***',
   /not fully turned on|separate ruling|not faked to look ready/i.test(flat(page)));
ok('and it reads at an eighth-grade level: no code words on his screen',
   !/doorFor|ctHiringWho|ctFactionOfMind|DEED_WEIGHT|null/.test(page));
let item = null;
try { item = (JSON.parse(fs.readFileSync(REG, 'utf8')).items || [])
  .find(i => i.id === 'people-a-stranger-gets-the-worst-work-9-28'); } catch (e) {}
ok('*** IT IS REGISTERED IN THE ONE VOTE TAB (rule 22) ***', !!item,
   item ? item.title : 'not in the registry');
ok('and it points at the page (rule 25)',
   !!(item && item.show && item.show.src === path.basename(PAGE)));
ok('and it is not a text item (rule 29)', !!(item && item.kind !== 'line'));
ok('the record exists', fs.existsSync(REC));
const rec = fs.existsSync(REC) ? flat(fs.readFileSync(REC, 'utf8')) : '';
ok('and it carries the false premise it caught before building on it',
   /84 rows/.test(rec) && /quest corpus/i.test(rec));
ok('*** AND IT NAMES RULE 38 LANDING MID-ROUND, NOT SILENTLY ***',
   /rule 38/i.test(rec) && /settlement screen/i.test(rec));
ok('and it says what is measured and NOT fixed', /MEASURED AND NOT FIXED/i.test(rec));

console.log('\n' + (fail.length ? 'RED' : 'GREEN') + ': ' + pass + ' passed, '
  + fail.length + ' failed');
if (fail.length) { fail.forEach(f => console.log('   FAIL  ' + f)); process.exit(1); }
})();
