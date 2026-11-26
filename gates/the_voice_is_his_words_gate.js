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
     V9  (11/20, WORDS THREE) every other line of his on the page (a line starting '>> "', under EVERYTHING ELSE HE HAS SAID) is word
         for word in the source its FROM line names: a VOTE registry verdict of his (the card named), his record, or VAMILY.md
     V10 (11/20) each of his lines stands beside what it teaches: every WAS/HIS pair has WHAT IT TEACHES and at least one point under
         it, and every '>>' line of his has its TEACHES line (the coordinator's ask, rule 461: 'each of his lines beside what it
         teaches')
     V11 (11/21, rule 466(f); 11/26 our tries) every homework card he answered is on the page as what it is: a line of his (WAS / HIS), KEPT AS IT
         IS (his YES on our line), or WHAT THE VOICE IS NOT (his NO, his words exactly, with THE LESSON); a NO is never shown as an
         example, and a line of his written with a note ('Bro, why are you scared to like curse...' then "Look there...") gives HIS
         as the quoted line and HE SAID WITH IT as the rest, both his to the letter
     V13 (11/22, rule 470(f)) NO DEAD HAT ON A CARD: no waiting card wears the cone hat's faces (planted, caught).
     V12 (11/22, rule 467 amended: 'I haven't seen you type a single bad word'; rule 470(g)) OUR TRY CURSES: on every sheet with a
         card still waiting, every waiting card carries OUR TRY; at least two tries in three carry a real curse in full (fuck, shit,
         motherfucker, bitch, damn, hell...); a try with no curse says why it is clean ('clean', the ones who would not); no try is
         bleeped; no try says 'it pays' or 'it doesn't pay' (a person says who pays and what, or nothing). Planted: a sheet whose
         curses are taken out, a bleep, an 'it pays', each caught
     P   PLANTS: a copy with one swear taken out of his line, a copy with a rule's quote reworded, a copy with a bleep, his words
         moved under the counting, one of his other lines reworded (V9), and a WHAT IT TEACHES taken away (V10), each caught by its
         own leg
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
const flat = s => String(s).trim().replace(/\s*\n+\s*/g, ' / ');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

function check(page, rec, reg) {
  const R = { v1: [], v2: [], v3: [], v4: [], v5: [], v7: [], v9: [], v10: [], v11: [], blocks: 0, quotes: 0, pairs: 0, others: 0, kept: 0, tries: 0, nos: 0 };
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
    if (!/^\s+WHAT IT TEACHES/.test(lines[k + 2] || '') || !/^\s+- \S/.test(lines[k + 3] || '')) R.v10.push('a line of his with no WHAT IT TEACHES under it: ' + h[1].slice(0, 40));
    const id = ids.find(x => said[x] === h[1] || said[x].indexOf('"' + h[1] + '"') >= 0);
    if (!id) R.v4.push('HIS is not a verdict of his: ' + h[1].slice(0, 40));
    else if (shown[id] !== w[1]) R.v4.push('WAS is not what the card showed: ' + id);
    for (let j = k + 2; j < Math.min(lines.length, k + 14); j++) { const hs = lines[j].match(/^\s+HE SAID WITH IT: "(.*)"\s*$/); if (hs && id && flat(said[id]).indexOf(hs[1]) < 0) R.v4.push('HE SAID WITH IT is not his note: ' + id); if (/^\d+\. /.test(lines[j])) break; }
  }
  if (!R.pairs) R.v4.push('no example pair on the page');
  R.unlisted = ids.filter(id => page.indexOf('"' + said[id] + '"') < 0 && page.indexOf('"' + flat(said[id]) + '"') < 0 && !((said[id].match(/"([^"\n]+)"\s*$/) || [])[1] && page.indexOf('"' + said[id].match(/"([^"\n]+)"\s*$/)[1] + '"') >= 0));
  /* V11: every answered card is on the page as what it is */
  {
    const V = {}; (reg.verdicts || []).forEach(v => { if (v && /^words-two-hw/.test(v.id)) V[v.id] = v; });
    const card = {}; (reg.items || []).forEach(i => { if (i && V[i.id] && i.homework) card[i.id] = i; });
    const refOf = i => '(card ' + i.homework.sheet + '.' + i.homework.n + ')';
    Object.keys(card).forEach(id => {
      const v = V[id], i = card[id], at = page.indexOf(refOf(i));
      if (at < 0) { R.v11.push('card ' + refOf(i) + ' he answered is not on the page'); return; }
      const blk = page.slice(at, at + 2400).split('\n').slice(0, 12).join('\n');
      const tr = i.homework.try;   /* sheets six on (rule 467 amended): the card showed the game's line AND our try; he answered our try */
      if (v.vote === 'down') {
        R.nos++;
        if (blk.indexOf('THE LINE (the game today): "' + i.homework.line + '"') < 0) R.v11.push(refOf(i) + ' NO: the line it showed him is not under it');
        if (tr && blk.indexOf('OUR TRY, HE SAID NO: "' + tr + '"') < 0) R.v11.push(refOf(i) + ' NO: our try he said no to is not under it');
        if (blk.indexOf('HIS NO: "' + flat(v.said || '') + '"') < 0) R.v11.push(refOf(i) + ' NO: his words are not under it exactly');
        if (!/THE LESSON: \S/.test(blk)) R.v11.push(refOf(i) + ' NO: no lesson');
        if (/^\s+HIS: "/m.test(blk.split('\n').slice(0, 4).join('\n'))) R.v11.push(refOf(i) + ' NO: shown as an example');
      } else if (tr) {
        R.tries++;
        if (blk.indexOf('THE LINE (the game today): "' + i.homework.line + '"') < 0) R.v11.push(refOf(i) + ' YES ON OUR TRY: the game\'s line is not under it');
        if (blk.indexOf('OUR TRY, HE SAID YES: "' + tr + '"') < 0) R.v11.push(refOf(i) + ' YES ON OUR TRY: the try he said yes to is not under it, word for word');
        if (!/WHAT IT TEACHES: \S/.test(blk)) R.v11.push(refOf(i) + ' YES ON OUR TRY: nothing taught');
        if ((v.said || '').trim() && blk.indexOf('HE SAID: "' + flat(v.said) + '"') < 0) R.v11.push(refOf(i) + ' YES ON OUR TRY: his words are not under it');
      } else if (blk.indexOf('THE LINE (the game today, he kept it): "' + i.homework.line + '"') >= 0) {
        R.kept++;
        if (!/WHAT IT TEACHES: \S/.test(blk)) R.v11.push(refOf(i) + ' KEPT: nothing taught');
        if ((v.said || '').trim() && blk.indexOf('HE SAID: "' + flat(v.said) + '"') < 0) R.v11.push(refOf(i) + ' KEPT: his word is not under it');
      } else if (blk.indexOf('WAS (the game today): "' + i.homework.line + '"') < 0) R.v11.push(refOf(i) + ' is on the page but not as a line of his, a kept line or a NO');
    });
  }
  /* V9 / V10: every other line of his, word for word in the source its FROM line names, with its TEACHES */
  const verdict = {}; (reg.verdicts || []).forEach(v => { if (v && v.id) verdict[v.id] = v.said || ''; });
  const fileN = {};
  for (let k = 0; k < lines.length; k++) {
    const m = lines[k].match(/^\s+>> "(.*)"\s*$/); if (!m) continue;
    R.others++;
    const f = (lines[k + 1] || '').match(/^\s+FROM: (\S+)(?: \(his note on the card ([^)\s]+)\))?\s*$/);
    if (!f) { R.v9.push('no FROM under: ' + m[1].slice(0, 40)); continue; }
    let src = '';
    if (f[2]) src = verdict[f[2]] || '';
    else { if (!(f[1] in fileN)) { try { fileN[f[1]] = norm(read(f[1])); } catch (e) { fileN[f[1]] = ''; } } src = fileN[f[1]]; }
    if (!src || norm(src).indexOf(norm(m[1])) < 0) R.v9.push('not his words in ' + (f[2] ? 'his note on ' + f[2] : f[1]) + ': ' + m[1].slice(0, 40));
    if (!/^\s+TEACHES: \S/.test(lines[k + 2] || '')) R.v10.push('a line of his with no TEACHES: ' + m[1].slice(0, 40));
  }
  if (!R.others) R.v9.push('none of his other lines is on the page');
  /* V7: the parts, in order, and his words only in part one */
  const heads = ['## PART ONE: HIS WORDS', '## PART TWO: WHAT CAN BE MEASURED', '## PART THREE: WHAT IS STILL UNKNOWN', '## PART FOUR: THE GAME TODAY'];
  const at = heads.map(h => page.indexOf(h));
  if (at.some(x => x < 0)) R.v7.push('a part is missing: ' + heads.filter((h, i) => at[i] < 0).join(', '));
  else if (!(at[0] < at[1] && at[1] < at[2] && at[2] < at[3])) R.v7.push('the parts are out of order');
  else {
    const two = page.slice(at[1]);
    if (/^> '/m.test(two)) R.v7.push('a block of his words sits under a later part');
    if (/^\s+HIS: "/m.test(two)) R.v7.push('a line of his sits under a later part');
    if (/^\s+>> "/m.test(two)) R.v7.push('one of his other lines sits under a later part');
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
ok('V9 every other line of his on the page is word for word where its FROM line says he said it (' + R.others + ' lines)', R.v9.length === 0, R.v9.slice(0, 3).join(' | '));
ok('V10 each of his lines stands beside what it teaches (' + R.pairs + ' of his answers, ' + R.others + ' other lines)', R.v10.length === 0, R.v10.slice(0, 3).join(' | '));
ok('V11 every card he answered is on the page as what it is: his line, kept as it is, our try he said yes to, or what the voice is not (' + R.pairs + ' lines, ' + R.kept + ' kept, ' + (R.tries || 0) + ' of our tries, ' + R.nos + ' NO)', R.v11.length === 0, R.v11.slice(0, 3).join(' | '));
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

/* V12: our try curses */
const CURSE = /\b(fuck\w*|motherfuck\w*|shit\w*|bitch\w*|damn\w*|hell|asshole\w*|bastard\w*|piss\w*|pussy)\b/i;
const PAYS = /\bit (pays|doesn'?t pay|does not pay)\b/i;
const BLEEPED = /\b[fs](?:\*+|-{2,})\w*|\b\w\*{2,}\w*/i;
function tries(sheets, judged) {
  const bad = []; let sheetsLive = 0, n = 0, cursing = 0;
  sheets.forEach(([name, sh]) => {
    const cards = sh.cards || [], waiting = cards.filter(c => !judged.has(c.id));
    if (!waiting.length) return;            /* a sheet he has answered whole is history */
    sheetsLive++;
    waiting.forEach(c => {
      if (!c.try) { bad.push(name + ' card ' + c.n + ': no try of ours'); return; }
      if (BLEEPED.test(c.try)) bad.push(name + ' card ' + c.n + ': our try is bleeped');
      if (PAYS.test(c.try)) bad.push(name + " card " + c.n + ": our try says 'it pays'");
      if (!CURSE.test(c.try) && !(c.clean && String(c.clean).trim().split(/\s+/).length >= 3)) bad.push(name + ' card ' + c.n + ': clean with no why');
    });
    const withTry = cards.filter(c => c.try), cur = withTry.filter(c => CURSE.test(c.try)).length;
    n += withTry.length; cursing += cur;
    if (cur * 3 < withTry.length * 2) bad.push(name + ': ' + cur + ' of ' + withTry.length + ' tries curse, under two in three');
  });
  return { bad, sheetsLive, n, cursing };
}
{
  const judged = new Set((reg.verdicts || []).map(v => v.id));
  const SH = sheets.map(sn => ['sheet ' + sn, JSON.parse(read('records/target/words_two/homework_' + sn + '.json'))]);
  const T = tries(SH, judged);
  ok('V12 OUR TRY CURSES: every waiting card shows our try, two in three curse in full, the clean ones say why, nothing bleeped, never \'it pays\' (' + T.sheetsLive + ' sheet' + (T.sheetsLive === 1 ? '' : 's') + ' out, ' + T.cursing + ' of ' + T.n + ' tries curse)', T.bad.length === 0 && (T.sheetsLive === 0 || T.n > 0), T.bad.slice(0, 3).join(' | '));
  /* the plants, on copies of the first sheet still out */
  const live = SH.find(([nm, sh]) => (sh.cards || []).some(c => !judged.has(c.id) && c.try));
  if (live) {
    const cp = () => JSON.parse(JSON.stringify(live[1]));
    const a = cp(); a.cards.forEach(c => { if (c.try) c.try = c.try.replace(new RegExp(CURSE.source, 'gi'), 'darn'); delete c.clean; });
    const b = cp(); b.cards[0].try = (b.cards[0].try || '') + ' f*** off.';
    const c2 = cp(); c2.cards[0].try = (c2.cards[0].try || '') + ' Walk it, and it pays forty.';
    const ga = tries([['plant', a]], judged).bad.length > 0, gb = tries([['plant', b]], judged).bad.some(x => /bleeped/.test(x)), gc = tries([['plant', c2]], judged).bad.some(x => /it pays/.test(x));
    ok('P  OUR TRY plants caught: the curses taken out, a bleep, an \'it pays\'', ga && gb && gc, [ga ? '' : 'the clean sheet passed', gb ? '' : 'the bleep passed', gc ? '' : "'it pays' passed"].filter(Boolean).join(', '));
  }
  /* V13 (11/22, rule 470(f), his note on card 4.6: 'why are people wearing chinese rice farmer hats btw wtf???'): no card still
     waiting wears a dead hat on its face. The cone is dead (CHARACTER, records/BOHEMIA_CLOTHING_GRAVEYARD.txt, gates/
     the_cone_hat_is_dead_gate.py); its wearers in the face bank are these looks. Card 6.3 shipped on one and was moved off it. */
  const DEAD_LOOKS = ['cast_widebrim', 'faction_caravans'];
  const hats = sh => (sh.cards || []).filter(c => !judged.has(c.id) && c.face && DEAD_LOOKS.includes(c.face.look)).map(c => 'card ' + (sh.sheet || '?') + '.' + c.n + ' wears ' + c.face.look);
  const onHat = [].concat(...SH.map(([, sh]) => hats(sh)));
  ok('V13 NO DEAD HAT ON A CARD: no waiting card wears the cone (' + DEAD_LOOKS.join(', ') + ')', onHat.length === 0, onHat.slice(0, 3).join(' | '));
  if (live) { const h = JSON.parse(JSON.stringify(live[1])); const w = h.cards.find(c => !judged.has(c.id)); w.face = { look: 'cast_widebrim' }; const caught = hats(h).length > 0; ok('P  V13 plant caught: the cone put back on a waiting card', caught, caught ? '' : 'the cone passed'); }
}

/* P: the plants */
{
  const firstHis = (page.match(/^\s+HIS: "(.*)"\s*$/m) || [])[1] || '';
  const p1 = page.replace(/fucking /, '');                                   /* one swear taken out of his own line */
  const p2 = page.replace("the first word is always scary, and whatever emotion", "the first word should usually be scary, and whatever feeling");   /* a rule reworded */
  const p3 = page.replace(/fuck faces/, 'f*** faces');                       /* a bleep */
  const p4 = page.replace('## PART TWO: WHAT CAN BE MEASURED', '## PART TWO: WHAT CAN BE MEASURED\n\n> \'' + (page.match(/^> '(.*)'\s*$/m) || [])[1] + '\'');   /* his words moved under the counting */
  const r4 = check(p4, rec, reg), g4 = p4 !== page && r4.v7.length > 0;
  const p5 = page.replace(/^(\s+>> ".*?)\bbro\b/m, '$1man');                 /* one of his other lines reworded */
  const p6 = page.replace(/\n\s+WHAT IT TEACHES[^\n]*\n(\s+- [^\n]*\n)+/, '\n');   /* a WHAT IT TEACHES taken away */
  const r5 = check(p5, rec, reg), r6 = check(p6, rec, reg), g5 = p5 !== page && r5.v9.length > 0, g6 = p6 !== page && r6.v10.length > 0;
  const p7 = page.replace(/(HIS NO: "[^"\n]*?)fucking/, '$1freaking');   /* a NO of his softened */
  const r7 = check(p7, rec, reg), g7 = p7 !== page && r7.v11.length > 0;
  /* 11/26: a try he said YES to, quietly changed on the page (a curse softened), is caught by V11 */
  const p8 = page.replace(/(OUR TRY, HE SAID YES: "[^"\n]*?)fuck(\w*)/, '$1frick$2');
  const r8 = check(p8, rec, reg), g8 = p8 !== page && r8.v11.length > 0;
  ok('P  V11 plant caught: a try of ours he said YES to, softened on the page', g8, g8 ? '' : 'the softened try passed');
  const r1 = check(p1, rec, reg), r2 = check(p2, rec, reg), r3 = check(p3, rec, reg);
  const g1 = p1 !== page && r1.v4.length > 0, g2 = p2 !== page && (r2.v2.length + r2.v3.length) > 0, g3 = p3 !== page && r3.v5.length > 0 && r3.v4.length > 0;
  ok('P  the plants are caught: a swear taken out of his line (V4), a rule reworded (V2, V3), a bleep (V5), his words moved under the counting (V7), another line of his reworded (V9), a WHAT IT TEACHES taken away (V10), a NO of his softened (V11)', !!firstHis && g1 && g2 && g3 && g4 && g5 && g6 && g7, [g7 ? '' : 'the softened NO passed', g5 ? '' : 'the reworded other line passed', g6 ? '' : 'the missing teaching passed', g1 ? '' : 'the softened line passed', g2 ? '' : 'the reworded rule passed', g3 ? '' : 'the bleep passed', g4 ? '' : 'the moved block passed'].filter(Boolean).join('; '));
}
console.log('\n=== THE VOICE IS HIS WORDS: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
