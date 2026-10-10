/* COOK: THE LONG INJURY (10/9/26, PEOPLE lane, VAMILY [the long injury]).
 * Shows a struck-down man's real card: his one pain line, his days left,
 * what he cannot do, all real, all sourced.
 *
 * REFERENCE CHECK (the 9/4 standing duty): the rulers are AH-01 (grime baked,
 * never shaded: the dark card's own edges and labels, no glow or gradient
 * added on top) and AH-03 (the vibe-coded tells: T1 words in a box with no
 * speaker checked here -- a real name sits on every card, not a bare label).
 * Ids resolve in the reference library index.
 * node tools/bohemia_cook_long_injury.js */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);
var L = require(path.join(ROOT, 'engine/bohemia_long_injury.js'));
var P = require(path.join(ROOT, 'engine/bohemia_people.js'));

var MEN = ['card:1:ruben', 'card:2:chuy', 'card:3:irma'].map(function (key, i) {
  var f = L.injuryFact(key);
  var name = P.generatedName('name:' + key) || ('Man ' + (i + 1));
  return Object.assign({ name: name }, f);
});

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
var cards = MEN.map(function (m) {
  return '<div class="card">\n  <div class="head"><div class="name">' + esc(m.name) + '</div>'
    + '<div class="mark">' + esc(m.markName) + '</div></div>\n'
    + '  <p class="pain">' + esc(m.painLine) + '</p>\n'
    + '  <div class="row"><span>days left</span><span class="big">' + m.days + '</span></div>\n'
    + '  <div class="row"><span>what he cannot do</span></div>\n'
    + '  <p class="penalty">' + esc(m.bodyPartPenalty) + '</p>\n'
    + '</div>';
}).join('\n');

var html = '<!doctype html><html lang="en"><head><meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
  + '<title>The Long Injury</title>\n'
  + '<style>\n'
  + '  :root{ --ink:#e8e4da; --dim:#8a8479; --bg:#0d0d0c; --card:#161615; --edge:#2a2a27; --warm:#c9a227; }\n'
  + '  *{box-sizing:border-box}\n'
  + '  html,body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;-webkit-text-size-adjust:100%}\n'
  + '  .wrap{max-width:640px;margin:0 auto;padding:18px 16px 60px}\n'
  + '  h1{font-size:17px;letter-spacing:.14em;margin:0 0 4px;font-weight:600}\n'
  + '  .sub{color:var(--dim);font-size:12.5px;letter-spacing:.06em;margin:0 0 18px}\n'
  + '  .quote{border-left:2px solid var(--warm);padding:2px 0 2px 12px;margin:0 0 18px;font-size:14px}\n'
  + '  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin:0 0 18px}\n'
  + '  .card{background:var(--card);border:1px solid var(--edge);border-radius:10px;padding:12px}\n'
  + '  .head{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 8px;border-bottom:1px solid var(--edge);padding-bottom:6px}\n'
  + '  .name{font-size:14px;font-weight:600}\n'
  + '  .mark{font-size:11px;color:var(--warm);text-transform:uppercase;letter-spacing:.06em;text-align:right}\n'
  + '  .pain{font-size:12.5px;margin:0 0 8px;color:var(--ink)}\n'
  + '  .row{display:flex;justify-content:space-between;font-size:12px;color:var(--dim);margin-top:6px}\n'
  + '  .big{font-weight:600;color:var(--warm)}\n'
  + '  .penalty{font-size:11.5px;color:var(--dim);margin:2px 0 0}\n'
  + '  .note{color:var(--dim);font-size:12.5px;margin:10px 0 0;padding-top:10px;border-top:1px solid var(--edge)}\n'
  + '  @media (prefers-color-scheme:light){ :root:not([data-theme="dark"]){ --ink:#1b1b19; --dim:#6a655c; --bg:#efece5; --card:#fff; --edge:#d8d3c8; --warm:#8a6d12; } }\n'
  + '</style></head><body><div class="wrap">\n\n'
  + '<h1>THE LONG INJURY</h1>\n'
  + '<p class="sub">Three real cards: his one pain line, his days left, what he cannot do.</p>\n\n'
  + '<p class="quote">"When a person is STRUCK DOWN in a fight: 20% they die... 80% they live with a DEBILITATING INJURY that takes them out of fights for 30 to 40 game days and leaves a permanent mark" &mdash; his own locked words. The days count down; the mark never does.</p>\n\n'
  + '<div class="grid">\n' + cards + '\n</div>\n\n'
  + '<p class="note">REAL, not staged: all 30-to-40 days, all eleven marks, every pain line and every penalty are read straight off records/target/bb/ours.json and records/target/bb/injuries.json, nothing invented. Names are the same real name-mix generator every citizen in this game already uses.</p>\n'
  + '<p class="note">NOT YET: the fight’s own 20% dead / 80% hurt roll (COMBAT’s own claimed row, [struck down]); the day-tick that counts him down while he walks the road, outside the clinic (whichever lane owns the city’s day clock).</p>\n'
  + '</div></body></html>\n';

var OUT = path.join(ROOT, 'slices/BOHEMIA_THE_LONG_INJURY_10_9_26.html');
fs.writeFileSync(OUT, html);
console.log('wrote ' + OUT + ' (' + html.length + ' bytes)');
