/* COOK: THE KEEPERS (10/10/26, PEOPLE lane, VAMILY [keepers]).
 * Six real beast-keeper crafts, and the shape the companion slot would
 * need to carry an animal, which nothing in this game has ever done.
 *
 * REFERENCE CHECK (the 9/4 standing duty): the rulers are AH-01 (grime
 * baked, never shaded: the dark card's own edges, no glow or gradient) and
 * AH-03 (the vibe-coded tells: T1 words in a box with no speaker checked
 * here -- every craft names its real animal, not a bare label).
 * Ids resolve in the reference library index.
 * node tools/bohemia_cook_keepers.js */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);
var K = require(path.join(ROOT, 'engine/bohemia_keepers.js'));

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
var cards = K.CRAFTS.map(function (c) {
  var slot = K.companionSlot(c.id);
  return '<div class="card">\n  <div class="head"><div class="name">' + esc(c.name) + '</div>'
    + '<div class="animal">' + esc(c.animal || 'no companion') + '</div></div>\n'
    + '  <p class="cite">' + esc(c.citation) + '</p>\n'
    + '  <div class="slot">' + (slot ? 'companion slot: kind animal, species ' + esc(slot.species) : 'no companion slot -- a thrown weapon, not a beast') + '</div>\n'
    + '</div>';
}).join('\n');

var html = '<!doctype html><html lang="en"><head><meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
  + '<title>The Keepers</title>\n'
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
  + '  .animal{font-size:11px;color:var(--warm);text-transform:uppercase;letter-spacing:.06em;text-align:right}\n'
  + '  .cite{font-size:12.5px;margin:0 0 8px;color:var(--ink)}\n'
  + '  .slot{font-size:11px;color:var(--dim)}\n'
  + '  .note{color:var(--dim);font-size:12.5px;margin:10px 0 0;padding-top:10px;border-top:1px solid var(--edge)}\n'
  + '  @media (prefers-color-scheme:light){ :root:not([data-theme="dark"]){ --ink:#1b1b19; --dim:#6a655c; --bg:#efece5; --card:#fff; --edge:#d8d3c8; --warm:#8a6d12; } }\n'
  + '</style></head><body><div class="wrap">\n\n'
  + '<h1>THE KEEPERS</h1>\n'
  + '<p class="sub">Six real crafts that use an animal as a weapon or a tool, and what a company slot would need to hold one.</p>\n\n'
  + '<p class="quote">"People use animals as weapons and tools, and a faction that does is a faction others fear." Every craft below is real today or across real history, not invented.</p>\n\n'
  + '<div class="grid">\n' + cards + '\n</div>\n\n'
  + '<p class="note">REAL, not staged: every citation is copied from the real research round, checked byte for byte. Measured first: the live city file’s own companion state only ever holds a person’s id today, so a handler’s animal companion is a real, named gap, not solved here.</p>\n'
  + '<p class="note">NOT YET: a price to hire a handler (the only real number the research gives is qualitative, "worth a season’s pay", not a figure -- inventing one would break rule 63d); the faction’s own roster (FACTIONS); the beast’s slot on the fight board (COMBAT); wiring an animal into the live companion state (RUN’s own file).</p>\n'
  + '</div></body></html>\n';

var OUT = path.join(ROOT, 'slices/BOHEMIA_KEEPERS_10_10_26.html');
fs.writeFileSync(OUT, html);
console.log('wrote ' + OUT + ' (' + html.length + ' bytes)');
