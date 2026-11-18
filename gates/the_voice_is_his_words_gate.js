#!/usr/bin/env node
/* THE VOICE IS HIS WORDS (WORDS TWO 11/17/26; VAMILY rules 455, 454(d), 458(a); ask rows 637, 643)
   PAOLO 11/17: 'There's two words, but the first word is always scary, and whatever emotion you're trying to get out of people, the
   second one follows that.' He called it 'the bedrock'. Rule 454(d): THE VOICE is one page of rules IN HIS OWN WORDS with HIS
   rewrites as the examples.

   WHAT THIS HOLDS. The WORDS lane has diagnosed the game's talk five times and written a page each time, in its own words, and the
   lines went back to what they were. This page is different in one way only: it is his. So the thing to guard is that it STAYS his:
   that no lane tidies a quote, softens a swear, trims his line, or adds a rule he did not give.
     V1  the page exists, leads with PAGE ONE (SCARY FIRST), names rule 455 and carries five numbered rules
     V2  every block of his words on the page (a line starting "> '") is in his own record, word for word (spaces aside)
     V3  every quoted sentence inside the five rules is in his own record, word for word
     V4  every example pair (WAS / HIS) is a homework card he answered: HIS is the registry's verdict for that card, to the letter,
         and WAS is the line the card showed him
     V5  nothing is bleeped: no f***, s**t, f--k anywhere on the page
     V6  every homework sheet's waiting cards still show the game's own line (the tool's --check, sheet by sheet)
     V7  (11/18) the page keeps its order: HIS WORDS first, WHAT CAN BE MEASURED second, WHAT IS STILL UNKNOWN third, THE GAME TODAY
         last; his words are never under a later part, and a lane's counting is never above them
     V8  (11/18) the count a mouth printed on the page is the hand reading's own count, mouth for mouth
         (records/words_two/scary_first_second_reading.json), and that file's counts are its own lines added up
     P   PLANTS: a copy with one swear taken out of his line, a copy with a rule's quote reworded, and a copy with a bleep, each
         caught by its own leg
   WHAT IT DOES NOT HOLD, ON PURPOSE: it does not fail a game line for not being scary first. Nothing may be rewritten yet (rule
   454(a)), and the only count of scary this lane has agrees with a reader 96 times in 156
   (records/BOHEMIA_WORDS_TWO_SCARY_FIRST_MEASURED_AND_THE_NEXT_TWELVE_CARDS_11_17_26.md). That leg comes with the rewrite.
   Node only, seconds.   node gates/the_voice_is_his_words_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const PAGE = 'laws/BOHEMIA_LAW_THE_VOICE_11_17_26.md', REC = 'records/BOHEMIA_PAOLO_SCARY_FIRST_THE_GRINDER_AND_THE_CAR_CAMPS_11_17_26.md', REG = 'records/target/BOHEMIA_VOTE_REGISTRY.json';
let pass = 0, fail = 0;
const ok = (name, good, why) => { console.log((good ? '  ok   ' : '  FAIL ') + name + (why ? '  [' + why + ']' : '')); good ? pass++ : fail++; };
const norm = s => String(s).replace(/\s+/g, ' ').trim();
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

function check(page, rec, reg) {
  const R = { v1: [], v2: [], v3: [], v4: [], v5: [], v7: [], blocks: 0, quotes: 0, pairs: 0 };
  const recN = norm(rec), lines = page.split('\n');
  /* V1 */
  if (!/^## PAGE ONE\. SCARY FIRST/m.test(page)) R.v1.push('no PAGE ONE. SCARY FIRST head');
  if (!/rule 455/.test(page)) R.v1.push('rule 455 not named');
  const a = page.indexOf('### THE FIVE RULES OF PAGE ONE'), b = page.indexOf('THE TEST OF A LINE');
  const rules = a >= 0 && b > a ? page.slice(a, b) : '';
  const numbered = (rules.match(/^\d\. /gm) || []).length;
  if (numbered !== 5) R.v1.push(numbered + ' numbered rules, not five');
  /* V2: his blocks */
  lines.forEach(l => { const m = l.match(/^> '(.*)'\s*$/); if (!m) return; R.blocks++; if (recN.indexOf(norm(m[1])) < 0) R.v2.push(m[1].slice(0, 50)); });
  if (!R.blocks) R.v2.push('no block of his words on the page');
  /* V3: the quoted sentences inside the five rules (a quote is '...' of five words or more) */
  (rules.match(/'[^'\n]*(?:'[a-z][^'\n]*)*'/g) || []).forEach(q => {
    const t = q.slice(1, -1); if (t.split(/\s+/).length < 5) return; R.quotes++;
    if (recN.indexOf(norm(t)) < 0) R.v3.push(t.slice(0, 50));
  });
  if (R.quotes < 5) R.v3.push('only ' + R.quotes + ' quoted sentences in the five rules');
  /* V4: WAS / HIS pairs */
  const said = {}, shown = {};
  (reg.verdicts || []).forEach(v => { if (v && /^words-two-hw/.test(v.id) && v.said) said[v.id] = v.said; });
  (reg.items || []).forEach(i => { if (i && said[i.id] && i.homework) shown[i.id] = i.homework.line; });
  const ids = Object.keys(said);
  for (let k = 0; k < lines.length; k++) {
    const w = lines[k].match(/^\s+WAS \(the game today\): "(.*)"\s*$/); if (!w) continue;
    const h = (lines[k + 1] || '').match(/^\s+HIS: "(.*)"\s*$/); R.pairs++;
    if (!h) { R.v4.push('a WAS with no HIS under it'); continue; }
    const id = ids.find(x => said[x] === h[1]);
    if (!id) R.v4.push('HIS is not a verdict of his: ' + h[1].slice(0, 40));
    else if (shown[id] !== w[1]) R.v4.push('WAS is not what the card showed: ' + id);
  }
  if (!R.pairs) R.v4.push('no example pair on the page');
  R.unlisted = ids.filter(id => page.indexOf('"' + said[id] + '"') < 0);
  /* V7: the parts, in order, and his words only in part one */
  const heads = ['## PART ONE: HIS WORDS', '## PART TWO: WHAT CAN BE MEASURED', '## PART THREE: WHAT IS STILL UNKNOWN', '## PART FOUR: THE GAME TODAY'];
  const at = heads.map(h => page.indexOf(h));
  if (at.some(x => x < 0)) R.v7.push('a part is missing: ' + heads.filter((h, i) => at[i] < 0).join(', '));
  else if (!(at[0] < at[1] && at[1] < at[2] && at[2] < at[3])) R.v7.push('the parts are out of order');
  else {
    const two = page.slice(at[1]);
    if (/^> '/m.test(two)) R.v7.push('a block of his words sits under a later part');
    if (/^\s+HIS: "/m.test(two)) R.v7.push('a line of his sits under a later part');
    if (page.indexOf('## PAGE ONE. SCARY FIRST') < at[0] || page.indexOf('## PAGE ONE. SCARY FIRST') > at[1]) R.v7.push('page one is not inside part one');
  }
  /* V5 */
  (page.match(/\b[fs](?:\*+|-{2,})\w*|\b\w\*{2,}\w*/gi) || []).forEach(x => R.v5.push(x));
  return R;
}

const page = read(PAGE), rec = read(REC), reg = JSON.parse(read(REG));
const R = check(page, rec, reg);
ok('V1 the page leads with PAGE ONE (SCARY FIRST), names rule 455 and carries five rules', R.v1.length === 0, R.v1.join('; '));
ok('V2 every block of his words on the page is in his own record, word for word (' + R.blocks + ' blocks)', R.v2.length === 0, R.v2.join(' | '));
ok('V3 every quoted sentence in the five rules is in his own record, word for word (' + R.quotes + ' quotes)', R.v3.length === 0, R.v3.join(' | '));
ok('V4 every example is a card he answered: HIS to the letter, WAS the line the card showed (' + R.pairs + ' pairs)', R.v4.length === 0, R.v4.join(' | '));
ok('V5 nothing is bleeped', R.v5.length === 0, R.v5.join(', '));
ok('V7 the page keeps its order: his words first, the counting second, the unknown third, the game today last', R.v7.length === 0, R.v7.join('; '));
if (R.unlisted.length) console.log('    note: ' + R.unlisted.length + ' answer' + (R.unlisted.length === 1 ? '' : 's') + ' of his on the homework ' + (R.unlisted.length === 1 ? 'is' : 'are') + ' not on the page yet (WORDS TWO adds them when it reads them): ' + R.unlisted.slice(0, 4).join(', '));

/* V6: the sheets */
const sheets = fs.readdirSync(path.join(ROOT, 'records/target/words_two')).map(f => (f.match(/^homework_(\d\d)\.json$/) || [])[1]).filter(Boolean).sort();
const off = [];
sheets.forEach(s => { const r = spawnSync('node', ['tools/bohemia_words_two_homework.js', '--sheet', s, '--check'], { cwd: ROOT, encoding: 'utf8' }); if (r.status !== 0) off.push('sheet ' + s + ': ' + String(r.stdout || r.stderr).trim().split('\n').pop().slice(0, 120)); });
ok('V6 every homework sheet\'s waiting cards still show the game\'s own line (' + sheets.length + ' sheets)', sheets.length > 0 && off.length === 0, off.join(' | '));

/* V8: the count on the page is the reading's count */
{
  const HR = JSON.parse(read('records/words_two/scary_first_second_reading.json')), bad = [];
  let rows = 0;
  HR.mouths.forEach(m => {
    const sc = m.lines.filter(l => l.scary_first).length, kd = k => m.lines.filter(l => l.kind === k).length;
    if (sc !== m.scary_first || m.lines.length !== m.read || kd('desperate') !== m.desperate || kd('a threat') !== m.threat || kd('eerie') !== m.eerie || kd('cold') !== m.cold) bad.push(m.mouth + ': the file does not add up');
    if (m.lines.some(l => l.scary_first !== !!l.kind)) bad.push(m.mouth + ': a mark and its kind disagree');
    const want = '| ' + m.mouth + ' | ' + (m.how === 'whole' ? 'all ' + m.read : m.read + ' of ' + m.of) + ' | ' + m.scary_first + ' of ' + m.read + ' | ' + Math.round(100 * m.scary_first / m.read) + '% | ' + m.desperate + ' | ' + m.threat + ' | ' + m.eerie + ' | ' + m.cold + ' |';
    if (page.indexOf(want) < 0) bad.push(m.mouth + ': not on the page as counted'); else rows++;
  });
  ok('V8 the count a mouth on the page is the hand reading\'s own count (' + rows + ' mouths, ' + HR.read + ' lines read, ' + HR.scary_first + ' scary first)', rows === HR.mouths.length && bad.length === 0, bad.slice(0, 3).join('; '));
}

/* P: the plants */
{
  const firstHis = (page.match(/^\s+HIS: "(.*)"\s*$/m) || [])[1] || '';
  const p1 = page.replace(/fucking /, '');                                   /* one swear taken out of his own line */
  const p2 = page.replace("the first word is always scary, and whatever emotion", "the first word should usually be scary, and whatever feeling");   /* a rule reworded */
  const p3 = page.replace(/fuck faces/, 'f*** faces');                       /* a bleep */
  const p4 = page.replace('## PART TWO: WHAT CAN BE MEASURED', '## PART TWO: WHAT CAN BE MEASURED\n\n> \'' + (page.match(/^> '(.*)'\s*$/m) || [])[1] + '\'');   /* his words moved under the counting */
  const r4 = check(p4, rec, reg), g4 = p4 !== page && r4.v7.length > 0;
  const r1 = check(p1, rec, reg), r2 = check(p2, rec, reg), r3 = check(p3, rec, reg);
  const g1 = p1 !== page && r1.v4.length > 0, g2 = p2 !== page && (r2.v2.length + r2.v3.length) > 0, g3 = p3 !== page && r3.v5.length > 0 && r3.v4.length > 0;
  ok('P  the plants are caught: a swear taken out of his line (V4), a rule reworded (V2, V3), a bleep (V5), his words moved under the counting (V7)', !!firstHis && g1 && g2 && g3 && g4, [g1 ? '' : 'the softened line passed', g2 ? '' : 'the reworded rule passed', g3 ? '' : 'the bleep passed', g4 ? '' : 'the moved block passed'].filter(Boolean).join('; '));
}
console.log('\n=== THE VOICE IS HIS WORDS: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
