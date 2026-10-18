/* THE REPLY CHECK (PLUMBER 10/10/26, row [the reply leg]; rule 90, the coordinator's school round 10)
   ================================================================================
   PAOLO reads from the bottom of his phone, at eighth-grade level, and has said for months that the replies
   are too long. Round 10 of the coordinator's school (records/BOHEMIA_COORDINATOR_SCHOOL_ROUND_10_TALKING_TO_THE_BOSS_10_10_26.md):
   "THE LAST FIVE LINES ARE THE REPLY: write the change, the one number, the one red, the ask and the
   two-sentence bottom line as the last five lines he sees, cap the whole reply at 150 words."

   A gate cannot read a chat reply (replies are not files; name_the_tab_gate.py says why a gate that claimed
   to would be self-attestation). So this is the checker the coordinator runs ON ITS DRAFT before it sends,
   and the one REPLY CONTRACT proves both ways:

     node tools/bohemia_reply_check.js draft.md        (or pipe the draft in: ... | node tools/bohemia_reply_check.js -)

   It prints the word count, the reading grade, the five slots it found, and exits 1 when a leg is red.

   WHAT IT READS
     words     every word on his screen, except the proof line (a line that starts with "proof") and the
               links (a URL, and a trailing line that is only a link). Cap: 150.
     the five  read from the bottom, after the links, skipping the proof line and blank lines:
       5 BOTTOM  the last lines after the ask: exactly two sentences
       4 ASK     WHAT I NEED FROM YOU, then its numbered lines or "Nothing, I'm good"
       3 RED     a line that starts RED or "No red" (a CAUSE / FIX line under it belongs to it)
       2 NUMBER  a digit, on the change line itself or on the line between the change and the red
       1 CHANGE  a line whose first words are a tab and a colon (VOTE: ..., MAP: ...), or NOT IN A TAB YET:
               the tabs are read from the alpha's own tab bar, plus DEMO and the 7/28 list
     grade     Flesch-Kincaid on the same words, printed (round 10 asks for grade 8 or under; the row asks
               for two legs, so it is a reading, not a leg)

   { template: true } reads the school's own skeleton, whose slots are written as placeholders ("TAB NAME:",
   "one number"): the order and the cap are checked, the placeholder words stand in for a tab and a digit.

   require('tools/bohemia_reply_check.js').checkReply(text, opts) -> { words, grade, slots, legs, ok }
   ================================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CAP = 150;

let TABS = null;
function tabs() {
  if (TABS) return TABS;
  const t = new Set(['RUN', 'CHARACTER', 'CLOTHES', 'ANIMATION', 'RIG', 'COMBAT', 'MUSIC', 'CITY', 'MAP', 'SLICE', 'LIFE', 'VOTE', 'DEMO']);
  try {
    const a = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
    for (const m of a.matchAll(/class="[^"]*tab[^"]*"[^>]*>([A-Z][A-Z +&-]{1,14})</g)) t.add(m[1].trim());
  } catch (e) { /* the 7/28 list stands alone */ }
  return (TABS = t);
}

const URL = /(https?:\/\/\S+|<https?:\/\/[^>]+>|\[[^\]]*\]\(https?:\/\/[^)]+\))/g;
const bare = (l) => l.replace(/\*\*|__|`/g, '').replace(/^\s*#+\s*/, '').replace(/^\s*>\s*/, '').trim();
const isProof = (l) => /^\W*proof\b/i.test(bare(l));
const isLinkOnly = (l) => { const b = bare(l); return !!b.match(URL) && b.replace(URL, '').replace(/[\s:|.-]/g, '').length <= 12; };
const wordsOf = (l) => bare(l).replace(URL, ' ').replace(/^\s*(\d+[.)]|[-*•])\s+/, '').split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w));
const sentences = (txt) => txt.replace(/\s+/g, ' ').trim().split(/(?<=[.!?]["')\]]*)\s+(?=[A-Z0-9"'(*])/).filter(s => /[A-Za-z0-9]/.test(s));
const syllables = (w) => { if (/\d/.test(w) && !/[a-z]/i.test(w)) return 1; w = w.toLowerCase().replace(/[^a-z]/g, ''); if (!w) return 0; if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, ''); const m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1; };

function tabLabel(l, template) {
  const b = bare(l).replace(/^[-*•]\s+/, '');
  if (/^NOT IN A TAB YET\b/i.test(b)) return 'NOT IN A TAB YET';
  if (template && /^TAB NAME\s*:/.test(b)) return 'TAB NAME';
  const m = b.match(/^([A-Z][A-Z +&-]{1,20}?)\s*(?::|\s[-–]\s)/);
  if (!m) return null;
  const words = m[1].trim().split(/\s+/);
  for (let k = Math.min(2, words.length); k >= 1; k--) {
    const w = words.slice(0, k).join(' ').replace(/\s*TAB$/, '');
    if (tabs().has(w)) return w;
  }
  if (words[0] === 'THE' && words[1] && tabs().has(words[1])) return words[1];
  return null;
}
const hasNumber = (l, template) => /\d/.test(bare(l).replace(URL, '')) || (template && /\b(one|two) numbers?\b/i.test(l));

function checkReply(text, opts = {}) {
  const T = !!opts.template;
  const raw = String(text).replace(/\r/g, '').split('\n');
  /* the links at the end do not count and are not a slot */
  let end = raw.length;
  while (end > 0 && (!raw[end - 1].trim() || isLinkOnly(raw[end - 1]))) end--;
  const body = raw.slice(0, end);
  const counted = body.filter(l => !isProof(l));
  const W = counted.flatMap(wordsOf);
  const words = W.length;
  /* a line break ends a thought in these replies (the ask heading, a numbered line), so each line is at least one sentence */
  const sents = Math.max(1, counted.filter(l => wordsOf(l).length).reduce((a, l) => a + Math.max(1, sentences(bare(l).replace(URL, ' ').replace(/^\s*(\d+[.)]|[-*•])\s+/, '')).length), 0));
  const syl = W.reduce((a, w) => a + syllables(w), 0);
  const grade = words ? +(0.39 * (words / sents) + 11.8 * (syl / words) - 15.59).toFixed(1) : 0;

  /* the slots, from the bottom; blank lines and the proof line are not lines he reads */
  const L = body.map((l, i) => ({ i, l })).filter(o => o.l.trim() && !isProof(o.l));
  const slots = {}; const why = [];
  let askAt = -1;
  for (let k = L.length - 1; k >= 0; k--) if (/WHAT I NEED FROM YOU/i.test(L[k].l)) { askAt = k; break; }
  if (askAt < 0) why.push('no WHAT I NEED FROM YOU');
  else {
    let k = askAt + 1;
    const inline = /Nothing,? I'?m good/i.test(L[askAt].l);
    const items = [];
    while (k < L.length && (/^\s*\d+[.)]\s/.test(L[k].l) || /^\W*Nothing,? I'?m good/i.test(L[k].l))) items.push(L[k++].l);
    slots.ask = { line: L[askAt].i + 1, items: items.length || (inline ? 1 : 0) };
    if (!slots.ask.items) why.push('the ask has no numbered line and no "Nothing, I\'m good" under it');
    const tail = L.slice(k);
    const s = sentences(tail.map(o => bare(o.l)).join(' '));
    slots.bottom = { lines: tail.length, sentences: s.length };
    if (!tail.length) why.push('nothing after the ask: the two-sentence bottom line must be the last thing he reads');
    else if (s.length !== 2) why.push('the bottom line under the ask is ' + s.length + ' sentence' + (s.length === 1 ? '' : 's') + ', not two');
    /* the red: walk up from the ask over CAUSE / FIX to a RED or No red line */
    let r = askAt - 1;
    while (r >= 0 && /^(CAUSE|FIX)\b/i.test(bare(L[r].l).replace(/^[-*•]\s+/, ''))) r--;
    if (r < 0 || !/^(RED\b|No red)/i.test(bare(L[r].l).replace(/^[-*•]\s+/, ''))) {
      why.push('the line above the ask is not the red ("RED: ..." or "No red this round.")');
    } else {
      slots.red = { line: L[r].i + 1 };
      /* the change and its number: one or two tab lines (the template allows a second), then at most one line
         that is not a tab line, directly above the red; the number is a digit on any of them */
      let k = r - 1, numLine = null; const tabLines = [];
      if (k >= 0 && !tabLabel(L[k].l, T)) numLine = L[k--];
      while (k >= 0 && tabLines.length < 2 && tabLabel(L[k].l, T)) tabLines.unshift(L[k--]);
      if (!tabLines.length) why.push('nothing that starts with a tab above the red ("VOTE: ...", "MAP: ...", "NOT IN A TAB YET: ...")');
      else {
        slots.change = { line: tabLines[0].i + 1, tab: tabLabel(tabLines[0].l, T) };
        const n = [...tabLines, numLine].filter(Boolean).find(o => hasNumber(o.l, T));
        if (n) slots.number = { line: n.i + 1 };
        else why.push('no number between the change (' + slots.change.tab + ') and the red');
      }
    }
  }
  const legs = [
    { name: 'WORDS', ok: words <= CAP, why: words + ' words on his screen, cap ' + CAP + ' (the proof line and the links do not count)' },
    { name: 'LAST FIVE', ok: !why.length, why: why.length ? why.join('; ') : 'change, number, red, ask, bottom line, in that order' },
  ];
  return { words, grade, slots, legs, ok: legs.every(l => l.ok) };
}

module.exports = { checkReply, CAP, tabs };

if (require.main === module) {
  const a = process.argv.slice(2).filter(x => !x.startsWith('--'));
  const src = !a.length || a[0] === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(a[0], 'utf8');
  const r = checkReply(src, { template: process.argv.includes('--template') });
  console.log('REPLY CHECK: ' + r.words + ' words (cap ' + CAP + '), reading grade ' + r.grade + ' (round 10 asks 8 or under)');
  for (const l of r.legs) console.log('  ' + (l.ok ? 'ok  ' : 'RED ') + ' ' + l.name + ': ' + l.why);
  const s = r.slots;
  console.log('  slots: change ' + (s.change ? 'line ' + s.change.line + ' (' + s.change.tab + ')' : '-') + ', number ' + (s.number ? 'line ' + s.number.line : '-')
    + ', red ' + (s.red ? 'line ' + s.red.line : '-') + ', ask ' + (s.ask ? 'line ' + s.ask.line : '-') + ', bottom ' + (s.bottom ? s.bottom.sentences + ' sentences' : '-'));
  console.log(r.ok ? '  SEND IT.' : '  DO NOT SEND: cut it to the five lines and the cap, the detail goes to the record.');
  process.exit(r.ok ? 0 : 1);
}
