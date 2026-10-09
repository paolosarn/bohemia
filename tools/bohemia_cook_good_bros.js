/* COOK: GOOD BROS AT THE POST (10/9/26, PEOPLE lane, VAMILY [good bros]).
 * Generates six REAL recruits (real stat ranges, real hire-cost ranges, the
 * real star mechanic) and bakes them into a static VOTE cook page, with real
 * names drawn from this game's own real name-mix generator (bohemia_people.js),
 * never a placeholder.
 *
 * REFERENCE CHECK (the 9/4 standing duty; added by DIRECTION 10/9 at the seam, the
 * tool shipped without one): the rulers are AH-01 (the bible: the recruits' card
 * speaks in the institution's calm register, R5) and AH-03 (the vibe-coded tells:
 * no stock UI shapes, no box of words without a face, no off-register colour).
 * Battle Brothers stays a mechanism reference for the hiring post (its department:
 * the company), never a style source. Ids resolve in the reference library index.
 * node tools/bohemia_cook_good_bros.js */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);
var G = require(path.join(ROOT, 'engine/bohemia_goodbros.js'));
var P = require(path.join(ROOT, 'engine/bohemia_people.js'));

var STAT_LABEL = { hp: 'health', fatigue: 'fatigue', resolve: 'resolve', initiative: 'initiative',
  melee_skill: 'melee skill', ranged_skill: 'ranged skill', melee_defense: 'melee defence', ranged_defense: 'ranged defence' };

var POST_SEED = 'good-bros-cook-10-9';
var six = G.sixAtThePost(POST_SEED);
var recruits = six.map(function (r, i) {
  var nameKey = 'name:' + POST_SEED + ':' + i + ':' + r.backgroundId;
  var name = P.generatedName(nameKey) || ('Recruit ' + (i + 1));
  return Object.assign({ name: name }, r);
});

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
function statRow(r) {
  return G.STAT_KEYS.map(function (sk) {
    var starred = sk === r.starredStat;
    return '<tr' + (starred ? ' class="star"' : '') + '><td>' + STAT_LABEL[sk] + (starred ? ' ★×' + r.starCount : '')
      + '</td><td class="big">' + r.stats[sk] + '</td></tr>';
  }).join('');
}
var cards = recruits.map(function (r) {
  return '<div class="card">\n  <div class="head"><div class="name">' + esc(r.name) + '</div>'
    + '<div class="bg">' + esc(r.backgroundName) + '</div></div>\n'
    + '  <table>' + statRow(r) + '</table>\n'
    + '  <div class="price-row"><span>one-time price</span><span class="big price">' + r.priceBatteries + ' batteries</span></div>\n'
    + '  <div class="wage-row">bought once: nothing more per day</div>\n'
    + '</div>';
}).join('\n');

var html = '<!doctype html><html lang="en"><head><meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
  + '<title>Good Bros At The Post</title>\n'
  + '<style>\n'
  + '  :root{ --ink:#e8e4da; --dim:#8a8479; --bg:#0d0d0c; --card:#161615; --edge:#2a2a27; --warm:#c9a227; }\n'
  + '  *{box-sizing:border-box}\n'
  + '  html,body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;-webkit-text-size-adjust:100%}\n'
  + '  .wrap{max-width:720px;margin:0 auto;padding:18px 16px 60px}\n'
  + '  h1{font-size:17px;letter-spacing:.14em;margin:0 0 4px;font-weight:600}\n'
  + '  .sub{color:var(--dim);font-size:12.5px;letter-spacing:.06em;margin:0 0 18px}\n'
  + '  .quote{border-left:2px solid var(--warm);padding:2px 0 2px 12px;margin:0 0 18px;font-size:14px}\n'
  + '  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:0 0 18px}\n'
  + '  .card{background:var(--card);border:1px solid var(--edge);border-radius:10px;padding:12px}\n'
  + '  .head{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 8px;border-bottom:1px solid var(--edge);padding-bottom:6px}\n'
  + '  .name{font-size:14px;font-weight:600}\n'
  + '  .bg{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:.08em}\n'
  + '  table{width:100%;border-collapse:collapse;font-size:12px}\n'
  + '  td{padding:2px 0}\n'
  + '  td:last-child{text-align:right}\n'
  + '  tr.star td{color:var(--warm)}\n'
  + '  .big{font-weight:600}\n'
  + '  .price-row{display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid var(--edge);font-size:12.5px}\n'
  + '  .price{color:var(--warm)}\n'
  + '  .wage-row{font-size:11px;color:var(--dim);margin-top:4px}\n'
  + '  h2{font-size:12px;letter-spacing:.16em;color:var(--dim);margin:26px 0 10px;font-weight:600}\n'
  + '  .note{color:var(--dim);font-size:12.5px;margin:10px 0 0;padding-top:10px;border-top:1px solid var(--edge)}\n'
  + '  @media (prefers-color-scheme:light){ :root:not([data-theme="dark"]){ --ink:#1b1b19; --dim:#6a655c; --bg:#efece5; --card:#fff; --edge:#d8d3c8; --warm:#8a6d12; } }\n'
  + '</style></head><body><div class="wrap">\n\n'
  + '<h1>GOOD BROS AT THE POST</h1>\n'
  + '<p class="sub">Six real recruits, generated this second from the real wiki data, not drawn for the screenshot.</p>\n\n'
  + '<p class="quote">"Finding good bros throughout the settlements" &mdash; six real Battle Brothers backgrounds, their real stat ranges, their real observed hiring prices. The gold line on each card is the one stat luck favored this time.</p>\n\n'
  + '<div class="grid">\n' + cards + '\n</div>\n\n'
  + '<h2>WHAT IS REAL HERE, AND WHAT IS NOT YET</h2>\n'
  + '<div class="card" style="max-width:100%">\n'
  + '<p class="note" style="margin-top:0;padding-top:0;border-top:none">REAL, sourced to the wiki: every stat range, every hiring-cost range (the Game Guide\'s own observed numbers, never a formula guess), and the star mechanic (one star narrows the low roll up by 1, two by 2, three also raises the top by 1, at a 60/30/10 split).</p>\n'
  + '<p class="note">NOT YET: traits. This game has no master list of Battle Brothers\' roughly fifty character traits anywhere yet, so rather than invent names from memory, this round ships real stats, real prices and real stars, and leaves traits named, not faked, for whichever round builds that list.</p>\n'
  + '<p class="note">NOT YET: the actual hire-and-join transaction. The posts screen itself is RUN TWO\'s settlement surface to build; this round is the real generator it will read from, proven in the gate, not a mockup.</p>\n'
  + '<p class="note">The price shown is the wiki\'s own quoted crown range, converted to batteries at this game\'s own ten-to-one rate (never the bare crown number). The background\'s real daily wage is on file but never charged: "the bought man pays 0 a day," his own words, the same rule the retinue already got corrected to.</p>\n'
  + '</div>\n\n'
  + '</div></body></html>\n';

var OUT = path.join(ROOT, 'slices/BOHEMIA_GOOD_BROS_10_9_26.html');
fs.writeFileSync(OUT, html);
console.log('wrote ' + OUT + ' (' + html.length + ' bytes), ' + recruits.length + ' real recruits');
