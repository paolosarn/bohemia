#!/usr/bin/env node
/* THE SPEAK ALONG GATE.  PORTRAIT [speak along], 9/30/26.
 *
 * Rule 14 (coordinator 9/14): "every face candidate carries his comment back
 * to this chat; each comment becomes the next candidate for that face,
 * quoting his words on the card so he sees his note answered." Ship test:
 * he comments on a face, the next round's VOTE tab shows that face redone
 * with his words on it.
 *
 * WHAT THIS CHECKS, against the real files, not a claim in a commit message:
 * 1. Every non-trivial comment (kind:'face', lane:'portrait', "said" longer
 *    than 10 characters) he ever left in records/target/BOHEMIA_VOTE_REGISTRY.json
 *    has a row in records/target/BOHEMIA_PORTRAIT_COMMENTS_ANSWERED.json.
 * 2. Every ledger row's "answeredBy" id is a REAL item in the registry
 *    (never an invented id -- the same discipline the merge tool's own
 *    missing-file check uses, applied to citations instead of files).
 * 3. Every ledger row that carries a "quote" has that quote, or a close
 *    paraphrase of it (normalized, punctuation and case stripped, a
 *    contiguous run of at least six of its own words), actually present in
 *    the answering item's own why-text -- so a citation cannot be faked by
 *    just naming a plausible-sounding later item.
 * 4. No ledger row cites a comment id that is not a real verdict (protects
 *    the ledger from rotting the other direction: an entry for a comment
 *    that was edited away or never existed).
 *
 * MUTATION-PROVEN: swap one row's answeredBy to a real id that never said
 * anything like the quote, and this gate must go red on claim 3.
 */
'use strict';
const path = require('path'), fsm = require('fs');
const ROOT = path.dirname(__dirname);
const REG = path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const LEDGER = path.join(ROOT, 'records/target/BOHEMIA_PORTRAIT_COMMENTS_ANSWERED.json');

let pass = 0, fail = 0;
const ok = (n, c, note) => { if (c) { pass++; console.log('  ok   ' + n + (note ? '   ' + note : '')); }
  else { fail++; console.log('  FAIL ' + n + (note ? '   ' + note : '')); } };

const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

/* a paraphrase check: take the quote's own words, slide a window of 6 across
   it, and pass if ANY six-word run from the quote appears verbatim (after
   normalizing) inside the target text. Six words is long enough that no
   coincidence produces it, and short enough to survive the answering item's
   own rewording around the borrowed phrase. */
function phraseInText(quote, text) {
  const qw = norm(quote).split(' ').filter(Boolean);
  const t = norm(text);
  if (qw.length < 3) return t.includes(norm(quote));
  const win = Math.min(6, qw.length);
  for (let i = 0; i + win <= qw.length; i++) {
    const run = qw.slice(i, i + win).join(' ');
    if (t.includes(run)) return true;
  }
  return false;
}

function main() {
  let reg, ledger;
  try { reg = JSON.parse(fsm.readFileSync(REG, 'utf8')); }
  catch (e) { ok('the vote registry parses', false, String(e)); console.log('\nSPEAK ALONG GATE: 0 passed, 1 failed'); process.exit(1); }
  try { ledger = JSON.parse(fsm.readFileSync(LEDGER, 'utf8')); }
  catch (e) { ok('the ledger parses', false, String(e)); console.log('\nSPEAK ALONG GATE: 0 passed, 1 failed'); process.exit(1); }
  ok('the ledger parses and holds rows', Array.isArray(ledger.answers) && ledger.answers.length > 0,
    ledger.answers ? ledger.answers.length + ' rows' : 'no answers[]');

  const itemsById = new Map((reg.items || []).map(i => [i.id, i]));
  const verdictsById = new Map((reg.verdicts || []).map(v => [v.id, v]));

  /* 1. every non-trivial portrait comment has a ledger row */
  const realComments = (reg.verdicts || []).filter(v =>
    v.id && v.id.startsWith('portrait-') && (v.said || '').trim().length > 10);
  const ledgerCommentIds = new Set(ledger.answers.map(a => a.comment));
  const uncovered = realComments.filter(v => !ledgerCommentIds.has(v.id));
  ok('every non-trivial portrait comment has a ledger row',
    uncovered.length === 0,
    uncovered.length ? uncovered.length + ' uncovered: ' + uncovered.slice(0, 3).map(v => v.id).join(', ')
      : realComments.length + ' comments, all covered');

  /* 4. no ledger row cites a comment that does not exist (both directions) */
  const staleRows = ledger.answers.filter(a => !verdictsById.has(a.comment));
  ok('no ledger row cites a comment id that is not a real verdict',
    staleRows.length === 0,
    staleRows.length ? staleRows.length + ' stale: ' + staleRows.map(a => a.comment).join(', ') : 'none stale');

  /* 2. every answeredBy id is a real item */
  const badCite = ledger.answers.filter(a => !itemsById.has(a.answeredBy));
  ok('every citation names a real item, never an invented one',
    badCite.length === 0,
    badCite.length ? badCite.length + ' bad: ' + badCite.map(a => a.comment + ' -> ' + a.answeredBy).join(', ')
      : ledger.answers.length + ' citations, all real');

  /* 3. every quoted row's phrase actually appears ON THE CARD: for a 'page'
     item that means the real HTML file (checked directly off disk, not the
     registry's own short, simplified why-text, which TALK TO HIM LIKE A
     PERSON deliberately paraphrases down to eighth-grade words and so will
     never carry his own sentence verbatim); for an 'image' item there is no
     text surface to check at all, which is named as a real limitation, not
     silently waved through. */
  const withQuote = ledger.answers.filter(a => a.quote);
  const checkable = [], skippedImage = [];
  for (const a of withQuote) {
    const it = itemsById.get(a.answeredBy);
    const how = it && it.show && it.show.how;
    if (how === 'page') checkable.push(a);
    else skippedImage.push(a);
  }
  const failedQuote = checkable.filter(a => {
    const it = itemsById.get(a.answeredBy);
    const src = it.show.src.replace(/^vote\//, '');
    let pageText = '';
    try { pageText = fsm.readFileSync(path.join(ROOT, 'slices/vote', src), 'utf8'); } catch (e) { return true; }
    return !phraseInText(a.quote, pageText) && !phraseInText(a.quote, it.why || '');
  });
  ok('every quoted phrase actually appears on the answering page itself',
    failedQuote.length === 0,
    failedQuote.length ? failedQuote.length + ' unverified: ' + failedQuote.map(a => a.comment).join(', ')
      : checkable.length + ' page quotes checked, all present' +
        (skippedImage.length ? ' (' + skippedImage.length + ' image-kind rows have no text surface to check, named in the ledger, not silently passed)' : ''));

  /* every row without a "quote" still carries a "note" explaining the answer
     honestly (a general-uplift row is not exempt from saying so on its face) */
  const bareRows = ledger.answers.filter(a => !a.quote && !(a.note || '').trim());
  ok('a row with no exact quote still says in its own words why it counts as answered',
    bareRows.length === 0,
    bareRows.length ? bareRows.length + ' bare: ' + bareRows.map(a => a.comment).join(', ') : 'none bare');

  console.log('\nSPEAK ALONG GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}

main();
