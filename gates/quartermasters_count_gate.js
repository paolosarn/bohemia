#!/usr/bin/env node
/* ============================================================================
   THE QUARTERMASTER'S COUNT -- COUNT THE STORES BEFORE ANYONE COOKS
   (10/17/26, PLUMBER lane, VAMILY row [the quartermaster's count]; the coordinator's school
   round twelve, rule 100c amended; Paolo 10/10, 82a: "LOOK AGAIN")

   WHAT HAPPENED: 294 packs bought, 8,674 tiles. 35 burnt-out wrecks at 45 degrees sat in the
   APPROVED bank since July while a lane ran EIGHT rounds of [car recook] on his "every car looks
   like dogshit". The coordinator's own shopping list of 10/11 asked him to buy two things he owned.
   The 7/27 shopping law said "check the index first" and had no machine; this is the machine's
   gate. The count itself is tools/bohemia_quartermasters_count.py and its numbers live in
   records/target/BOHEMIA_QUARTERMASTERS_COUNT.json.

   THE LEGS
     Q1  the committed count parses, carries its families and total, and was counted at a sha
         that is on main (a count nobody can trace to a tree is a number, not a measurement).
     Q2  the count is CURRENT: the tool re-counts the packs on disk and the pieces and packs per
         family agree with the committed file (never_opened only falls as chats open packs and is
         printed, not judged). Stale -> red, with the one command that fixes it.
     Q3  EVERY STUDY PAGE OPENS WITH ITS LINE (rule 100c): a HOW THE PACK DID IT page born on or
         after the count (10/17) carries "we own N pieces of <family> in M packs, K never opened"
         and N and M are the count's numbers for that family. Older pages are listed, not held.
     Q4  NO ART ITEM WITHOUT ITS PACK OR ITS HOLE (82a): a tile, outfit or face item a cook lane
         registers in VOTE on or after 10/17 names the pack piece it started from (twin.src
         "pack:<pack>#<idx>", a pack the count knows) OR carries count: "we own 0 pieces of
         <family> ..." for a family the count says is ZERO. A hole exists only when the count
         says zero. Anything else is the [car recook] shape and is red with the family's line.
     S1-S3  SELF-TESTS, both ways, on planted pages and items: the car recook shape is refused
         and the same item with its pack twin passes; a people item with its hole passes and a
         claimed hole the count disproves is refused; a page with the right line passes, a page
         with stale numbers or no line is refused.

   THE FLOOR: a count file that will not parse, or a tool that will not run, FAILS rather than
   passing. A quartermaster who cannot find the ledger does not report "all present".

     node gates/quartermasters_count_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const COUNT = path.join(ROOT, 'records/target/BOHEMIA_QUARTERMASTERS_COUNT.json');
const REGISTRY = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const TOOL = 'tools/bohemia_quartermasters_count.py';
const BORN = '2026-10-17';                 /* the count's first day on main; nothing older is held */
const BORN_MD = 1017;                      /* the same day as the registry writes it, m*100+d */
const LINE_RE = /we own ([\d,]+) pieces? of ([a-z][a-z+ \-]*?) in (\d+) packs?, (\d+) never opened/i;
/* the lanes whose whole mandate is FROM THE PACKS (82a, rule 87): the four cooks and the board layer */
const PACK_LANES = /^(cook|cook 2|cook 3|cook 4|cook two|cook three|cook four|combat 2|combat two)$/i;
const ART_KINDS = ['tile', 'outfit', 'face'];

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };
const num = s => +String(s).replace(/,/g, '');

/* ---- the count on disk ------------------------------------------------------------------ */
function readCount() {
  const c = JSON.parse(fs.readFileSync(COUNT, 'utf8'));
  if (!c.families || !c.total || !c.packs) throw new Error('no families/total/packs in the count');
  return c;
}

/* ---- Q3: does this page text carry a current line? null = fine, else why ----------------- */
function pageWhy(txt, count) {
  const m = LINE_RE.exec(txt);
  if (!m) return 'no count line: open the page with "we own N pieces of <family> in M packs, K never opened" (python3 ' + TOOL + ' --family <family>)';
  const fam = m[2].trim().toLowerCase(), f = count.families[fam];
  if (!f) return (num(m[1]) === 0 && +m[3] === 0) ? null
    : 'the line names a family the count does not know (' + fam + '); families: ' + Object.keys(count.families).join(', ');
  if (num(m[1]) !== f.pieces || +m[3] !== f.packs)
    return 'stale numbers: the page says ' + m[1] + ' pieces in ' + m[3] + ' packs, the count says ' + f.line;
  return null;
}

/* ---- Q4: does this registry item name its pack or its hole? null = fine, else why -------- */
function itemWhy(it, count) {
  const t = it.twin && typeof it.twin === 'object' ? String(it.twin.src || '') : '';
  const pm = /^pack:(.+?)#(\d+)$/.exec(t);
  if (pm) return count.packs[pm[1]] ? null : 'its twin names a pack the count does not have (' + pm[1] + ')';
  if (/^reference\/art_bank\//.test(t)) return null;
  const cl = LINE_RE.exec(String(it.count || ''));
  if (cl) {
    const fam = cl[2].trim().toLowerCase(), f = count.families[fam];
    if (!f && num(cl[1]) === 0) return null;
    if (f) return 'it claims a hole in ' + fam + ' and the count says ' + f.line;
    return 'its count line says ' + cl[1] + ' pieces of ' + fam + ' but names no pack twin';
  }
  const guess = /car|truck|wreck|vehicle|prop|barrel|crate|sign|lamp|furniture/i.test(it.title || '') ? 'prop'
    : /road|street|asphalt|sidewalk|curb|kerb/i.test(it.title || '') ? 'road'
    : /house|roof|wall|building|shop|motel|ranch|settlement/i.test(it.title || '') ? 'settlement'
    : /ground|dirt|grass|sand|desert|water/i.test(it.title || '') ? 'ground' : null;
  return 'cooked without counting the stores: no pack twin (twin.src "pack:<pack>#<idx>") and no hole (count: "we own 0 pieces of <family> ...")'
    + (guess && count.families[guess] ? '; the count says ' + count.families[guess].line : '');
}

function bornOn(file) {
  try { return execFileSync('git', ['log', '--diff-filter=A', '--follow', '--format=%ad', '--date=short', '--', file],
    { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').pop() || ''; } catch (e) { return ''; }
}
const madeOn = it => { const m = /^(\d+)\/(\d+)/.exec(String(it.made || '')); return m ? (+m[1]) * 100 + (+m[2]) : 0; };

(function main() {
  process.chdir(ROOT);
  console.log("\nTHE QUARTERMASTER'S COUNT -- count the stores before anyone cooks (rule 100c, 82a)\n");

  /* Q1 */
  let count = null;
  try { count = readCount(); } catch (e) {
    ok('the committed count parses (' + path.relative(ROOT, COUNT) + ')', false, String(e.message).slice(0, 160)
      + '\n         Run: python3 ' + TOOL);
    console.log("\n=== THE QUARTERMASTER'S COUNT GATE: " + pass + ' passed, ' + fail + ' failed ===');
    process.exit(1);
  }
  const fams = Object.keys(count.families);
  ok('Q1 the committed count parses and carries ' + fams.length + ' families and the total: ' + count.total.line, fams.length >= 5 && count.total.packs > 0);
  let onMain = false;
  try { onMain = spawnSync('git', ['cat-file', '-e', count.counted_at + '^{commit}'], { cwd: ROOT }).status === 0; } catch (e) {}
  ok('Q1 the count names the sha it was counted at and that sha is in this history (' + (count.counted_at || 'none') + ')', !!count.counted_at && onMain,
    'a count nobody can trace to a tree is a number, not a measurement');

  /* Q2 */
  const chk = spawnSync('python3', [TOOL, '--check'], { cwd: ROOT, encoding: 'utf8' });
  const chkOut = ((chk.stdout || '') + (chk.stderr || '')).trim();
  ok('Q2 the count is CURRENT: the tool re-counted the packs on disk and agrees with the committed file', chk.status === 0,
    chkOut.split('\n').slice(-3).join('\n         '));
  if (chk.status === 0) console.log('       ' + chkOut.split('\n')[0]);

  /* Q3 */
  const pages = fs.readdirSync(path.join(ROOT, 'records')).filter(f => /HOW_THE_PACK/i.test(f) && /\.md$/.test(f)).sort();
  const held = [], older = [], bad = [];
  for (const f of pages) {
    const rel = 'records/' + f, born = bornOn(rel);
    if (!born || born < BORN) { older.push(f + ' (born ' + (born || 'unknown') + ')'); continue; }
    held.push(f);
    const why = pageWhy(fs.readFileSync(path.join(ROOT, rel), 'utf8'), count);
    if (why) bad.push(f + ': ' + why);
  }
  ok('Q3 every HOW THE PACK DID IT page born since the count (' + held.length + ' of ' + pages.length + ') opens with its family\'s current line', !bad.length,
    bad.slice(0, 8).join('\n         '));
  if (older.length) console.log('       note: ' + older.length + ' study pages predate the count and are not held: ' + older.slice(0, 4).join(', ') + (older.length > 4 ? ', ...' : ''));

  /* Q4 */
  let reg = null;
  try { reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')); } catch (e) {
    ok('the vote registry parses', false, String(e.message).slice(0, 120)); }
  const items = reg && Array.isArray(reg.items) ? reg.items : [];
  const heldItems = items.filter(it => it && PACK_LANES.test(String(it.lane || '').trim()) && ART_KINDS.includes(it.kind) && madeOn(it) >= BORN_MD);
  const badItems = heldItems.map(it => [it.id, itemWhy(it, count)]).filter(x => x[1]);
  ok('Q4 every art item a cook lane registered since the count (' + heldItems.length + ') names its pack piece or its hole; ' + badItems.length + ' do not', !badItems.length,
    badItems.slice(0, 8).map(x => x[0] + ': ' + x[1]).join('\n         ')
    + '\n         82a: the bar is everything he owns. twin.src "pack:<pack>#<idx>" names the piece you started from; count: "we own 0 pieces of <family> in 0 packs, 0 never opened" names a hole, and only the count may say zero.');

  /* S1-S3 self-tests, both ways */
  const anyPack = Object.keys(count.packs).find(p => /abandoned|car|wreck/i.test(p)) || Object.keys(count.packs)[0];
  const carRecook = { id: 's1', lane: 'cook', kind: 'tile', made: '10/17', title: 'PLACEHOLDER: THE CAR, REPAINTED AGAIN', twin: { src: 'vote/car.png', diffs: ['a', 'b', 'c'] } };
  const carFromPack = Object.assign({}, carRecook, { twin: { src: 'pack:' + anyPack + '#1', diffs: ['a', 'b', 'c'] } });
  const peopleHole = { id: 's3', lane: 'cook 3', kind: 'outfit', made: '10/17', title: 'A GANG LOOK', count: 'we own 0 pieces of people in 0 packs, 0 never opened' };
  const fakeHole = Object.assign({}, peopleHole, { count: 'we own 0 pieces of prop in 0 packs, 0 never opened' });
  const notHeld = { id: 's5', lane: 'tuning', kind: 'tile', made: '10/17', title: 'a table' };
  ok('S1 the [car recook] shape: a repainted car with no pack twin is refused with the prop line; the same car cut from "' + anyPack + '" passes',
    /prop/.test(itemWhy(carRecook, count) || '') && itemWhy(carFromPack, count) === null, JSON.stringify([itemWhy(carRecook, count), itemWhy(carFromPack, count)]));
  ok('S2 a people item with its hole passes (the count owns no people); a claimed hole in prop is refused (the count says 3,000-odd)',
    itemWhy(peopleHole, count) === null && /claims a hole/.test(itemWhy(fakeHole, count) || '') && !PACK_LANES.test(notHeld.lane),
    JSON.stringify([itemWhy(peopleHole, count), itemWhy(fakeHole, count)]));
  const road = count.families.road;
  const good = '# HOW THE PACK DID IT: THE ROAD\n' + road.line + '\n';
  const stale = '# HOW THE PACK DID IT: THE ROAD\nwe own ' + (road.pieces - 1) + ' pieces of road in ' + road.packs + ' packs, 0 never opened\n';
  const none = '# HOW THE PACK DID IT: THE ROAD\nseven numbers\n';
  const hole = '# HOW THE PACK DID IT: PEOPLE\nwe own 0 pieces of people in 0 packs, 0 never opened\n';
  ok('S3 a page with the current road line passes, a hole page passes; stale numbers are refused, a page without the line is refused',
    pageWhy(good, count) === null && pageWhy(hole, count) === null && /stale/.test(pageWhy(stale, count) || '') && /no count line/.test(pageWhy(none, count) || ''),
    JSON.stringify([pageWhy(good, count), pageWhy(stale, count), pageWhy(none, count)]));

  console.log("\n=== THE QUARTERMASTER'S COUNT GATE: " + pass + ' passed, ' + fail + ' failed ===');
  if (fail) console.log('    count the stores before you cook: python3 ' + TOOL + ' --family <family>, and open the page with its line.');
  process.exit(fail ? 1 : 0);
})();
