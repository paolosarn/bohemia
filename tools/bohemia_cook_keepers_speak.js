/* COOK: THE KEEPERS SPEAK (10/9/26, PEOPLE lane, VAMILY [the keepers speak]).
 * Shows the smith speaking his three real lines (trait, price, rumour)
 * through the same mouth-and-portrait shape every speaking NPC in this game
 * already uses. Every line is real: the trait greeting and the rumour are
 * read straight out of the real files RUN TWO and WORLD already built; the
 * price line comes from engine/bohemia_keeper_lines.js, proven against its
 * own real sources in gates/keeper_lines_gate.js.
 * node tools/bohemia_cook_keepers_speak.js */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);
var K = require(path.join(ROOT, 'engine/bohemia_keeper_lines.js'));

var SETTLE_SRC = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
var nameMatch = SETTLE_SRC.match(/smith:\s*\{who:'settle-smith',\s*name:'([^']+)'/);
var KEEPER_NAME = nameMatch ? nameMatch[1] : 'THE SMITH';

var TRAITS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_traits.json'), 'utf8')).traits;
var RAIDED = TRAITS.filter(function (t) { return t.id === 'raided'; })[0];
var TRAIT_LINE = RAIDED.says.smith;

var RUMOURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/settlement_rumours.json'), 'utf8')).rumours;
var RUMOUR = RUMOURS.filter(function (r) { return r.kind === 'keeper' && r.keeper === 'smith'; })[0];

var PRICE_LINE = K.priceLine('smith', { min: 6, max: 41 });

var LINES = [
  { who: 'KEEPER', text: TRAIT_LINE, tag: 'the trait line, raided (WORDS’ own words, applied into settlement_traits.json this round)' },
  { who: 'KEEPER', text: PRICE_LINE, tag: 'the price line (new this round, engine/bohemia_keeper_lines.js)' },
  { who: 'KEEPER', text: RUMOUR.says, tag: 'one rumour, his own (WORDS’ own words, applied into settlement_rumours.json this round)' }
];

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
var bubbles = LINES.map(function (l) {
  return '<div class="bubble">\n  <div class="face"></div>\n  <div class="say">\n'
    + '    <div class="nm">' + esc(KEEPER_NAME) + '</div>\n'
    + '    <p>' + esc(l.text) + '</p>\n'
    + '    <div class="tag">' + esc(l.tag) + '</div>\n'
    + '  </div>\n</div>';
}).join('\n');

var html = '<!doctype html><html lang="en"><head><meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
  + '<title>The Keepers Speak</title>\n'
  + '<style>\n'
  + '  :root{ --ink:#e8e4da; --dim:#8a8479; --bg:#0d0d0c; --card:#161615; --edge:#2a2a27; --warm:#c9a227; }\n'
  + '  *{box-sizing:border-box}\n'
  + '  html,body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;-webkit-text-size-adjust:100%}\n'
  + '  .wrap{max-width:560px;margin:0 auto;padding:18px 16px 60px}\n'
  + '  h1{font-size:17px;letter-spacing:.14em;margin:0 0 4px;font-weight:600}\n'
  + '  .sub{color:var(--dim);font-size:12.5px;letter-spacing:.06em;margin:0 0 18px}\n'
  + '  .quote{border-left:2px solid var(--warm);padding:2px 0 2px 12px;margin:0 0 18px;font-size:14px}\n'
  + '  .bubble{display:flex;gap:10px;align-items:flex-start;background:var(--card);border:1px solid var(--edge);border-radius:10px;padding:12px;margin:0 0 12px}\n'
  + '  .face{width:44px;height:44px;flex:0 0 44px;border:1px solid var(--edge);border-radius:4px;background:#1a1410}\n'
  + '  .say{flex:1}\n'
  + '  .nm{color:var(--warm);font-size:11px;letter-spacing:1px;margin-bottom:4px}\n'
  + '  .say p{margin:0 0 6px;font-size:13.5px}\n'
  + '  .tag{color:var(--dim);font-size:11px}\n'
  + '  .note{color:var(--dim);font-size:12.5px;margin:16px 0 0;padding-top:10px;border-top:1px solid var(--edge)}\n'
  + '  @media (prefers-color-scheme:light){ :root:not([data-theme="dark"]){ --ink:#1b1b19; --dim:#6a655c; --bg:#efece5; --card:#fff; --edge:#d8d3c8; --warm:#8a6d12; } }\n'
  + '</style></head><body><div class="wrap">\n\n'
  + '<h1>THE KEEPERS SPEAK</h1>\n'
  + '<p class="sub">The smith’s three lines, in order, the first time you walk up this visit.</p>\n\n'
  + '<p class="quote">A QUEST IS PEOPLE PLACES AND THINGS: text comes from a mouth with a portrait, never a card. Here is the smith’s mouth saying all three things this row asked for.</p>\n\n'
  + bubbles + '\n\n'
  + '<p class="note">REAL, not staged: the trait line and the rumour are WORDS’ own written words (records/BOHEMIA_WORDS_THE_KEEPERS_LINES_10_10_26.md), applied this round into the two real data files RUN TWO’s screen already reads from, never a new mechanism; the price line is new this round, proven against its own real sources (the board’s real skull pay, the clinic’s real formula, the barber’s real constant) in gates/keeper_lines_gate.js.</p>\n'
  + '<p class="note">NOT YET: wiring these three lines into the LIVE settlement screen is RUN TWO’s own file to touch (rule 55, ONE SYSTEM ONE SESSION); a review file hands them the exact call shape.</p>\n'
  + '</div></body></html>\n';

var OUT = path.join(ROOT, 'slices/BOHEMIA_THE_KEEPERS_SPEAK_10_9_26.html');
fs.writeFileSync(OUT, html);
console.log('wrote ' + OUT + ' (' + html.length + ' bytes)');
