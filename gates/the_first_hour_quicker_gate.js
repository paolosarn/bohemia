/* ==========================================================================
   THE FIRST HOUR, QUICKER  (RUN, 10/23/26, VAMILY [the first hour, quicker], rule 133)

   PAOLO 10/23: 'the whole point of this project was to be like Battle Brothers but quicker and funner for normies, also
   kind of hardcore vibes if you're fucking around too much.' TUNING's page (records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_
   NORMIES_THE_TEN_CHANGES_10_23_26.md): 'THE FIGHT IS NOT THE SLOW PART. THE MAP AND THE TOWN ARE.' A stranger lost four
   wrong taps and one unplanned fight before the first town; on BUILD 10/23b this lane's walk measured seven and never
   reached it.

   ONE STRANGER, REAL TOUCHES, THE COMMITTED DEMO (tools/bohemia_run_the_first_hour_walk.js through the one driver):
     Q1  THE EASY END IS THE DOOR'S DEFAULT: BEGIN on nothing picked plays NEW HERE + FULL SHELVES (change 4)
     Q2  THE PHONE'S JOB GOES SOMEWHERE: touched, its road is drawn on the map and its town lit; 0 dead taps (change 2a)
     Q3  THE TOWN'S NAME IS THE TOWN: one touch on the name opens the town; 0 wrong taps, 0 fights he never asked for (2d)
     Q4  ONE FIGHT PER JOB: the touch on the JOB opens its fight, once, and it is the job's (the double hand-over fixed)
     Q5  THE MAP COMES BACK AT HIS SPEED: after the fight the pad is not on PAUSE, the job paid, the next touch goes (2b, 2c)
     Q6  A FINISHED JOB LEAVES THE PHONE (2e)
     Q7  A PARTY'S FIRST TAP IS A LOOK: two numbers (how many, skulls against his crew), no fight, no journey (change 3)
     Q8  EVERY FIGHT SIZED TO THE CREW: a roster with no party is a party of its length; day one, no more than the
         company plus one; a three-skull job on day one inside that line (change 1)
     Q9  A FORCED ROAD PARTY IS ONE HE CAN SEE AND RUN FROM: it stands in sight with its plate and the road away lit; on
         the road away it falls behind and no fight starts; walking into it is the fight (change 3, rule 68)
     Q10 ONE BILL IN DAYS: nightfall takes the crew's bill (men x 2), the day turns (the demo no longer stops at 22:00 of
         day one), and a night he cannot cover one man walks and says why with his face (change 5)
     Q11 nothing threw

   node gates/the_first_hour_quicker_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const { walk } = require(path.join(ROOT, 'tools/bohemia_run_the_first_hour_walk.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };

(async () => {
  let W = null;
  try { W = await walk('BOHEMIA_DEMO.html', null); } catch (e) { ok('the walk ran [' + String(e && e.message).slice(0, 160) + ']', false); }
  if (!W || W.crash) { ok('the walk ran to its end' + (W && W.crash ? ' [' + W.crash.slice(0, 160) + ']' : ''), false); return end(); }
  const g = (k) => W[k] || {};
  const d1 = g('W1_door');
  ok('*** Q1 THE EASY END IS THE DOOR\'S DEFAULT *** (' + d1.combat + ' + ' + d1.econ + ', ' + d1.start + ' batteries)', d1.combat === 'new' && d1.econ === 'full');
  const p2 = g('W2_phone');
  ok('*** Q2 THE PHONE\'S JOB GOES SOMEWHERE *** (road ' + p2.roadDrawn + ' blocks, town lit ' + p2.townLit + ', dead taps ' + p2.deadTaps + ')', p2.tapped && p2.deadTaps === 0 && p2.roadDrawn > 0 && p2.townLit === 1);
  const t3 = g('W3_to_the_town');
  ok('*** Q3 THE TOWN\'S NAME IS THE TOWN *** (' + t3.town + ' opened ' + t3.opened + ' in ' + (t3.taps || []).length + ' touch(es); wrong ' + t3.wrongTaps + ', unplanned fights ' + t3.unplannedFights + ')',
    t3.opened === true && t3.wrongTaps === 0 && t3.unplannedFights === 0 && (t3.taps || []).length === 1);
  const j4 = g('W4_first_job');
  ok('Q4 ONE FIGHT PER JOB (took "' + j4.took + '"; the fight was the job\'s: ' + j4.fightWasTheJob + ', ' + (j4.handover && j4.handover.why) + ')', !!j4.job && j4.fightWasTheJob === true);
  const a5 = g('W5_after_fight');
  ok('*** Q5 THE MAP COMES BACK AT HIS SPEED *** (pad ' + a5.speedPad + 'x, paid ' + a5.paid + ', the next touch went ' + a5.tapWent + ')', a5.speedPad > 0 && a5.paid > 0 && a5.tapWent === true);
  const p6 = g('W6_phone_after_pay');
  ok('Q6 A FINISHED JOB LEAVES THE PHONE (still listed: ' + p6.finishedJobStillListed + '; shown ' + JSON.stringify(p6.shown) + ')', p6.finishedJobStillListed === false);
  const q7 = g('W7_party');
  ok('*** Q7 A PARTY\'S FIRST TAP IS A LOOK *** (' + (q7.plate ? q7.plate.count + ' men, ' + q7.plate.skulls + ' skull(s), ' + q7.plate.going : 'no plate') + '; fight ' + q7.fight + ', journey ' + q7.travelled + ')',
    !!q7.party && q7.numbersShown === 2 && q7.fight === false && q7.travelled === false);
  const s8 = g('W8_fight_size'), sh = s8.streetHandOver || {}, sk = s8.threeSkullJobDayOne || {};
  ok('*** Q8 EVERY FIGHT SIZED TO THE CREW *** (a roster of 6, no party: day one ' + sh.dayOne + ', day two ' + sh.dayTwo + ' for a company of ' + sh.company + '; a three-skull job on day one ' + sk.count + ')',
    sh.company > 0 && sh.dayOne === sh.company + 1 && sh.dayTwo === 6 && sk.count > 0 && sk.count <= sk.company + 1);
  const h9 = g('W10_hunters'), sp = h9.spawned || {}, af = h9.afterFleeing || {}, wi = h9.walkedIntoThem || {};
  ok('*** Q9 A FORCED ROAD PARTY IS ONE HE CAN SEE AND RUN FROM *** (' + sp.count + ' at ' + sp.blocks + ' blocks, drawn ' + sp.drawn + ', road away ' + sp.flee + ' blocks, plate ' + (sp.plate > 0) + '; fled: '
      + (af.hunt ? af.blocks + ' blocks after ' + af.steps + ' steps' : 'they gave up') + ', a fight while fleeing ' + h9.fight + '; walked into them: ' + wi.caught + ' ' + (wi.handover && wi.handover.why) + ')',
    sp.drawn === 1 && sp.flee > 0 && sp.plate > 0 && sp.blocks >= 4 && (!af.hunt || af.blocks > sp.blocks) && h9.fight === false && wi.caught === true && /^road:.*:caught$/.test((wi.handover && wi.handover.why) || ''));
  const n9 = g('W9_nightfall'), b = n9.bill || {}, l = b.last || {}, n2 = n9.night2 || {}, sp2 = n2.spoke || {};
  ok('*** Q10 ONE BILL IN DAYS *** (night one: ' + l.crew + ' men, due ' + l.due + ', paid ' + l.paid + ', ' + b.daysLeft + ' days left; the day turned to ' + n9.dayAfter + ' at ' + n9.minAfter
      + '; night two short: ' + ((n2.walked || []).map(x => x.name).join(',') || 'nobody') + ' walked, the crew ' + (n2.bill && n2.bill.crew) + ' of ' + l.crew + ')',
    /* AMENDED 10/27 (Paolo, rule 295: 'make sure every time you hire someone it's locked in'): a night he cannot cover, NOBODY
       walks; the purse runs dry and the crew stays whole (was: the newest man walked and said why with his face) */
    l.due === l.crew * b.perMan && l.paid === l.due && b.perMan > 0 && n9.dayTurned === true && n9.minAfter === 360
      && (n2.walked || []).length === 0 && (n2.bill && n2.bill.crew) === l.crew);
  ok('Q11 nothing threw (' + (W.errors || []).length + (W.errors && W.errors.length ? ': ' + String(W.errors[0]).slice(0, 120) : '') + ')', (W.errors || []).length === 0);
  end();
})();
function end() { console.log('THE FIRST HOUR, QUICKER: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }
