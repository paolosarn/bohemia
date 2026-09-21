#!/usr/bin/env node
/* BOHEMIA — BUILD THE FIRST NOTICE PAGE (9/21/26, WORLD lane, row [horror world])
 *
 * Writes slices/BOHEMIA_THE_FIRST_NOTICE_9_21_26.html, the page the VOTE tab
 * opens for this lane's round-two cook.
 *
 * *** THE PAGE IS GENERATED, NOT TYPED, AND THAT IS THE POINT. ***
 * Every word of both notices on that page is whatever engine/bohemia_notice.js
 * returns when it is driven by the real overmap, the real power grid, the real
 * turf holders and the real pumps on a real seed. If somebody edits the module
 * and forgets the page, re-running this shows it; if somebody edits the page by
 * hand, re-running this wipes it. A judge page whose sample was pasted in by hand
 * is a page about a thing that may no longer exist, which is the whole reason
 * this lane got burned by a stale measurement before.
 *
 *   node tools/bohemia_the_first_notice.js
 */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const R = (p) => require(path.join(ROOT, p));

const N  = R('engine/bohemia_notice.js');
const PG = R('engine/bohemia_powergrid.js');
const OM = R('engine/bohemia_overmap.js');
const TW = R('engine/bohemia_towns.js');
const BE = R('engine/bohemia_belonging.js');
const PM = R('engine/bohemia_pumps.js');
const G  = R('engine/BOHEMIA_faction_graph.json');
const CE = (() => { try { return R('engine/bohemia_cityedit.js'); } catch (e) { return null; } })();

const SEED = 1337;          /* the seed the lane's other gates read, so the numbers line up */
const AGENTS = 40;          /* the valley's own head count, the same one the pumps gate uses */

/* whoever HIS file says holds the lit grid. Asked, never typed. */
let gridFaction = null;
for (const k in BE.RULES) {
  const h = (BE.RULES[k] && BE.RULES[k].hold) || '';
  if (/lit grid/i.test(h)) { gridFaction = k; break; }
}

const m = OM.buildOvermap(SEED);
const seats = TW.derive(G, TW.districtsOf(m, CE && CE.cat), 1) || [];
const grid = PG.powerMap(m, SEED, {
  gridFaction: () => gridFaction,
  holderAt: (x, y) => { try { return TW.holderOf(seats, x, y); } catch (e) { return null; } }
});

/* ---- the feeder the notice is served on: a LIT one, on a NAMED faction's ground,
        because that is the one where somebody is actually there to take the money. */
let feeder = null, lit = 0, free = 0, named = 0;
{
  const seen = {};
  for (const c of grid.cells()) {
    if (!c.live || seen[c.id]) continue;
    seen[c.id] = 1; lit++;
    const s = grid.at(c.x, c.y);
    if (s.free) free++;
    else if (s.faction) { named++; if (!feeder) feeder = { x: c.x, y: c.y, s, street: m.at(c.x, c.y).district }; }
  }
}
if (!feeder) { console.error('no lit feeder on named ground at seed ' + SEED); process.exit(1); }

const notice = N.disconnection({
  service: 'power', at: [feeder.x, feeder.y], street: feeder.street,
  circuit: feeder.s.id, holder: feeder.s.faction, free: feeder.s.free,
  day: 1, clock: '13:57'
});
if (!notice.issued) { console.error('notice refused: ' + notice.reason); process.exit(1); }

/* ---- the alert, off the pumps that are actually on this map ---- */
const stations = [];
for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
  const d = m.at(x, y).district;
  if (['pumpstation', 'watertreat', 'reservoir'].indexOf(d) >= 0) {
    stations.push({ district: d, lit: !!grid.at(x, y).live, faction: TW.holderOf(seats, x, y), at: [x, y] });
  }
}
const water = PM.lift(stations, AGENTS);
const alert = N.alert({
  service: 'water',
  hazard: 'water service to this area is not being pumped. ' + water.need +
          ' litres a day are not being lifted',
  location: 'the whole valley floor',
  action: 'do not drink from the tap. boil or treat all water before drinking. ' +
          'draw only what you need today',
  day: 1, clock: '13:57', untilDays: 1
});
if (!alert.issued) { console.error('alert refused: ' + alert.reason); process.exit(1); }

/* ---- THE MEASUREMENT. Who the forms send you to, against who is actually out there. */
const living = Object.keys(G.factions);
const un = N.unanswered(notice, living);
const unA = N.unanswered(alert, living);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const screen = (lines) => lines.map(l => l === '' ? '<br>' : '<div>' + esc(l) + '</div>').join('');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>The First Notice</title>
<style>
 :root{ --ink:#141210; --paper:#efe9dd; --rule:#9c907c; --hot:#7a2d16;
        --glass:#0d0f0c; --phos:#c8b46a; --dim:#6d6340 }
 @media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
   --ink:#e6e0d2; --paper:#15130f; --rule:#4a4338; --hot:#c9704a; --dim:#8a7e58 } }
 :root[data-theme="dark"]{ --ink:#e6e0d2; --paper:#15130f; --rule:#4a4338; --hot:#c9704a; --dim:#8a7e58 }
 *{ box-sizing:border-box }
 body{ margin:0; background:var(--paper); color:var(--ink);
       font:15px/1.55 ui-sans-serif,system-ui,Arial; overflow-x:hidden }
 .w{ max-width:720px; margin:0 auto; padding:0 16px 48px }
 header{ padding:18px 0 12px; border-bottom:3px solid var(--ink) }
 h1{ margin:0 0 4px; font-size:20px; letter-spacing:.01em }
 .sub{ font-size:14px; color:var(--dim) }
 h2{ font-size:15px; margin:26px 0 8px; padding-bottom:5px; border-bottom:1px solid var(--rule) }
 p{ margin:8px 0 }
 .lead{ margin:14px 0; padding:10px 12px; border-left:5px solid var(--hot);
        background:rgba(122,45,22,.07); font-size:14px }
 /* the phone, because rule 19 says the phone is where this is allowed to live */
 .ph{ margin:12px 0; padding:8px 8px 14px; border-radius:16px;
      background:linear-gradient(150deg,#3b342a,#221d16 60%,#2e2820);
      box-shadow:inset 0 1px 0 rgba(226,210,160,.16), inset 0 -3px 0 #0a0806,
                 0 8px 22px rgba(0,0,0,.5) }
 .scr{ background:var(--glass); color:var(--phos); border-radius:5px; padding:10px 11px;
       font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace; white-space:pre-wrap;
       word-break:break-word;
       box-shadow:inset 0 0 0 1px #0a0906, inset 0 2px 9px rgba(0,0,0,.8) }
 .scr div{ min-height:1em }
 .scr .hd{ color:#e8d79a }
 .cap{ font-size:12px; color:var(--dim); margin:4px 2px 0 }
 table{ border-collapse:collapse; width:100%; font-size:13px; margin:8px 0 }
 th,td{ text-align:left; padding:5px 6px; border-bottom:1px solid var(--rule); vertical-align:top }
 th{ font-size:11px; letter-spacing:.06em; color:var(--dim) }
 .no{ color:var(--hot); font-weight:700 }
 .n{ font-variant-numeric:tabular-nums }
 footer{ margin-top:30px; padding-top:12px; border-top:1px solid var(--rule);
         font-size:12px; color:var(--dim) }
</style></head><body><div class="w">

<header>
  <h1>THE FIRST NOTICE</h1>
  <div class="sub">WORLD &middot; 9/21 &middot; the machine keeps talking after its owner is gone</div>
</header>

<div class="lead">
  We wrote the survivors for months and never wrote the thing that stopped. Out of
  3,014 spoken lines in this game, <b>eight</b> name a city, a county, an office, a
  board or a utility at all. So here is the first one that does. It is a real
  disconnection notice, with every slot the law makes a real one carry, filled in
  from the actual grid, the actual block and the actual money in the game. Nothing
  on it is typed by hand.
</div>

<h2>1. THE NOTICE, ON THE PHONE</h2>
<p>Served on a lit feeder in this valley. The debt is <b>one battery</b>, because
everything costs one. The reconnection fee is one battery. The form gives you a
ten day dispute window and a right of appeal.</p>
<div class="ph"><div class="scr">${screen(notice.en)}</div></div>
<div class="cap">Feeder ${notice.slots.account.replace(/^FEEDER /, '')} &middot; the money and the
holder are read off the game, not written here.</div>

<h2>2. AND AGAIN IN SPANISH, BECAUSE THE LAW SAID SO</h2>
<p>A notice like this has to go out in both languages. That is how the institution
ends up speaking two languages: a person code-switches, a notice is
<i>issued twice</i>. English always carries every fact, so nothing you need to know
exists only here.</p>
<div class="ph"><div class="scr">${screen(notice.es)}</div></div>

<h2>3. THE ALERT NOBODY UPDATED</h2>
<p>Five slots: who is telling you, what is wrong, where, what to do, and when this
expires. The valley has ${water.stations} water stations on this map and
${water.running} of them are running, so the ${water.need} litres a day it drinks
are not being lifted.</p>
<div class="ph"><div class="scr">${screen(alert.en)}</div></div>
<div class="cap">It says it is in effect until tomorrow. Tomorrow was a long time ago.</div>

<h2>4. WHO THE FORMS SEND YOU TO</h2>
<p>Every one of these lines points at somebody who is supposed to answer it. This
is not a mood, it is counted against the list of everybody who actually exists in
the valley right now.</p>
<table>
 <tr><th>THE LINE</th><th>IT SENDS YOU TO</th><th>ANSWER</th></tr>
 ${un.slots.map(s => '<tr><td>' + esc(s.why) + '</td><td>' + esc(s.who) +
   '</td><td class="no">nobody</td></tr>').join('\n ')}
 ${unA.slots.map(s => '<tr><td>' + esc(s.why) + '</td><td>' + esc(s.who) +
   '</td><td class="no">nobody</td></tr>').join('\n ')}
</table>
<p class="cap">${un.unanswered} of ${un.asks} on the notice, ${unA.unanswered} of
${unA.asks} on the alert, against the ${living.length} outfits the valley really has.
If one of them ever takes the grid over, this table shrinks on its own and not one
word of the notice changes.</p>

<h2>5. THE ONE THAT IS NOT MY IDEA</h2>
<p>Your own ruling says the Network hold the lit grid and <b>have never once charged
for it</b>. On this map <span class="n">${free}</span> of
<span class="n">${lit}</span> lit feeders are theirs. So a district that no longer
exists is sending disconnection notices for power that a faction is giving away, on
${((100 * free) / lit).toFixed(0)}% of the lit grid. That came out of your canon, not
out of mine.</p>

<footer>
  Every sentence above is a draft. The issuer names are a default I picked in your
  place, so they are the second thing on this card to vote on. Nothing here is in
  the game yet.
</footer>

</div></body></html>
`;

const out = path.join(ROOT, 'slices/BOHEMIA_THE_FIRST_NOTICE_9_21_26.html');
fs.writeFileSync(out, html, 'utf8');
console.log('wrote ' + path.relative(ROOT, out) + '  (' + html.length + ' bytes)');
console.log('  feeder ' + feeder.s.id + ' on ' + feeder.street + ' ' + feeder.x + '-' + feeder.y +
            ', held by ' + feeder.s.faction);
console.log('  lit feeders ' + lit + ', free (Network) ' + free + ', named ' + named);
console.log('  water: ' + water.running + ' of ' + water.stations + ' running, need ' + water.need + ' L/day');
console.log('  unanswered: notice ' + un.unanswered + '/' + un.asks + ', alert ' + unA.unanswered + '/' + unA.asks);
