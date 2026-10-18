#!/usr/bin/env node
/* THE FIGHT READS ONLY SOURCED NUMBERS (COMBAT [rebuild], rule 63d, Paolo 10/2: "all the
   numbers and stats play a huge important part"). The rebuilt fight, slices/BOHEMIA_FIGHT.html,
   keeps every rule in ONE script, <script id="fight-rules">, and that script may not type a
   number. Every number a player feels comes in through R('path') from records/target/bb/rules.json
   (Battle Brothers' rules, each with its wiki page and the exact words), R('ours.path') from
   records/target/bb/ours.json (Paolo's own rulings, each with its law), R('ai.path') from
   records/target/bb/ai.json (each enemy kind's wiki behaviour), or off a row of
   enemies/weapons/armor/perks/injuries/backgrounds.json, every row of which names its page.
   A number typed into the rules is a number nobody can trace, which is how the old fight died.

   Legs:
   1. the rules script exists and types no number but 0, 1 (a count, a toggle) and 100 (a percent
      is a hundredth: the wiki writes 'effectiveness against armor %', and the row holds 60 for 60%);
   2. every R('...') path it reads resolves to a row with a value and a source;
   3. every data row the fight can read names its source;
   4. the page fetches nothing but records/target/bb/ and slices/fight_ground/;
   5. the drawing script never writes a fighter's numbers (hp, armour, ap, fatigue, morale). */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'slices/BOHEMIA_FIGHT.html');
const BB = path.join(ROOT, 'records/target/bb');
let pass = 0, fail = 0;
function leg(ok, what, why) {
  if (ok) { pass++; } else { fail++; console.log('  FAIL ' + what + (why ? ' (' + why + ')' : '')); }
}

if (!fs.existsSync(FILE)) {
  leg(false, 'the rebuilt fight exists', 'no slices/BOHEMIA_FIGHT.html');
  console.log('=== THE FIGHT READS ONLY SOURCED NUMBERS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(1);
}
const html = fs.readFileSync(FILE, 'utf8');
function script(id) {
  const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)</script>'));
  return m ? m[1] : null;
}
/* strip comments and string/template literals so a number in a sentence or a key is not a rule */
function code(src) {
  let out = '', i = 0;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i = src.indexOf('*/', i + 2); i = i < 0 ? src.length : i + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      const q = c; i++;
      while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
      i++; out += '""'; continue;
    }
    out += c; i++;
  }
  return out;
}

const rules = script('fight-rules');
leg(!!rules && rules.length > 2000, 'the rules live in one script, <script id="fight-rules">',
  rules ? rules.length + ' chars' : 'missing');
if (rules) {
  const c = code(rules);
  const bad = [];
  const re = /(^|[^\w$.])(\d+\.?\d*|\.\d+)(?![\w$])/g;
  let m;
  while ((m = re.exec(c))) {
    const n = Number(m[2]);
    if (n !== 0 && n !== 1 && n !== 100) {
      const at = c.lastIndexOf('\n', m.index);
      bad.push(m[2] + ' in "' + c.slice(at + 1, c.indexOf('\n', m.index)).trim().slice(0, 70) + '"');
    }
  }
  leg(bad.length === 0, '*** THE RULES TYPE NO NUMBER: every felt number comes from a sourced row ***',
    bad.length + ' typed: ' + bad.slice(0, 6).join(' | '));

  const files = {};
  ['rules', 'ours', 'ai', 'enemies', 'weapons', 'armor', 'perks', 'injuries', 'backgrounds'].forEach(function (k) {
    const f = path.join(BB, k + '.json');
    files[k] = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
  });
  const paths = [];
  const pr = /\bR\(\s*'([^']+)'\s*\)/g;
  while ((m = pr.exec(rules))) paths.push(m[1]);
  const uniq = Array.from(new Set(paths));
  leg(uniq.length >= 25, 'the rules read Battle Brothers through R(), not around it', uniq.length + ' paths');
  const broke = [];
  uniq.forEach(function (p) {
    const parts = p.split('.');
    let node = parts[0] === 'ours' ? files.ours : parts[0] === 'ai' ? files.ai : files.rules;
    const walk = (parts[0] === 'ours' || parts[0] === 'ai') ? parts.slice(1) : parts;
    for (const k of walk) { node = node && typeof node === 'object' ? node[k] : undefined; }
    if (!node || typeof node !== 'object' || !('value' in node) || node.value === null || node.value === undefined
        || typeof node.source !== 'string' || !node.source) broke.push(p);
  });
  leg(broke.length === 0, 'every R() path is a row with a value and the page it came from',
    broke.length + ' broken: ' + broke.slice(0, 6).join(', '));

  const unsourced = [];
  ['enemies', 'weapons', 'perks', 'injuries', 'backgrounds'].forEach(function (k) {
    const rows = files[k] && files[k].rows;
    if (!rows) { unsourced.push(k + '.json missing'); return; }
    rows.forEach(function (r) { if (!r.source) unsourced.push(k + ':' + r.id); });
  });
  if (files.armor) ['body', 'head', 'shields'].forEach(function (k) {
    (files.armor[k] || []).forEach(function (r) { if (!r.source) unsourced.push('armor.' + k + ':' + r.id); });
  }); else unsourced.push('armor.json missing');
  leg(unsourced.length === 0, 'every data row the fight can read names its wiki page',
    unsourced.slice(0, 6).join(', '));
}

const fetches = [];
const fr = /fetch\(\s*([^)]*)\)/g;
let fm;
while ((fm = fr.exec(html))) fetches.push(fm[1]);
const strays = fetches.filter(function (f) { return !/records\/target\/bb\/|fight_ground\/|fight_people\//.test(f) && !/^\s*(u|url|src|p)\s*$/.test(f); });
leg(fetches.length > 0 && strays.length === 0, 'the page loads only the bb data, COMBAT TWO\'s ground and the character bank\'s baked people',
  strays.join(' | '));
const loader = html.match(/const DATA_FILES\s*=\s*\[([^\]]*)\]/);
leg(!!loader && /records\/target\/bb\//.test(html), 'the data list names the bb folder');

const draw = script('fight-draw');
leg(!!draw, 'the drawing has its own script, <script id="fight-draw">');
if (draw) {
  const writes = code(draw).match(/\.(hp|armor_head|armor_body|ap|fat|morale)\s*(=[^=]|\+=|-=|\+\+|--)/g) || [];
  leg(writes.length === 0, 'the drawing never writes a fighter\'s numbers', writes.slice(0, 4).join(' '));
}

console.log('=== THE FIGHT READS ONLY SOURCED NUMBERS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
