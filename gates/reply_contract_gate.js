// BOHEMIA — REPLY CONTRACT GATE (Paolo 7/26/26, LOCKED).
// FACTORY LAW: new law, new gate, same turn. A law without a machine gate is not
// enforced -- and this one governs how EVERY session talks to him, so it rots
// silently and nobody notices until he is annoyed again.
//
// "What input do you need for me? You gotta have that at the bottom of each chat.
//  I told you to make me a TLDR and it's not at the very bottom of the screen
//  every time, it's very annoying."
//
// He reads from the BOTTOM of his screen. Anything he has to scroll up for does
// not exist. So WHAT I NEED FROM YOU and the TLDR are the last two blocks, always.
// This gate cannot read a chat reply, so it guards the only thing it can: that the
// rule is stated, unambiguous, and that CLAUDE.md and the doctrine agree. The two
// files disagreeing is exactly how the old order survived for a whole session.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const MD = path.join(ROOT, 'CLAUDE.md');
const DOC = path.join(ROOT, 'laws', 'BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== REPLY CONTRACT GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('CLAUDE.md exists', fs.existsSync(MD));
ok('the autonomy doctrine exists', fs.existsSync(DOC));
if (f) done();
const md = fs.readFileSync(MD, 'utf8'), doc = fs.readFileSync(DOC, 'utf8');

ok('CLAUDE.md names the ask block by name', /WHAT I NEED FROM YOU/.test(md));
ok('CLAUDE.md still requires the two-sentence bottom line', /TWO-SENTENCE plain-English/.test(md));
ok('CLAUDE.md states the bottom-up rule', /BOTTOM-UP \(Paolo 7\/26, LOCKED\)/.test(md));
ok('CLAUDE.md explains WHY, so it is not mistaken for a style tic',
  /anything he has to scroll up for does not exist/.test(md));
ok('CLAUDE.md points at the full contract', /BOHEMIA_AUTONOMY_DOCTRINE_7_26_26\.md sec 3/.test(md));

ok('the doctrine records the amendment and quotes him', /AMENDED 7\/26\/26 by Paolo, LOCKED/.test(doc) &&
  /very bottom of the screen every time/.test(doc));
ok('the doctrine puts the ask SECOND-TO-LAST', /SECOND-TO-LAST THING ON SCREEN/.test(doc));
ok('the doctrine puts the TLDR LAST', /THE LAST\n     THING ON SCREEN, EVERY TIME/.test(doc) || /THE LAST[\s\S]{0,30}THING ON SCREEN, EVERY TIME/.test(doc));
ok('the doctrine still forbids leading with a green gate', /never lead\n     with it/.test(doc) || /never lead[\s\S]{0,20}with it/.test(doc));
ok('the doctrine keeps JUDGE THIS and the proof line', /JUDGE THIS/.test(doc) && /Proof line/.test(doc));
ok('the doctrine keeps the play-link-last rule', /play link, on its own line after/.test(doc));

/* THE TRAP THIS CLOSES: the two files must not describe different orders. */
{
  const askIdx = doc.indexOf('WHAT I NEED FROM YOU');
  const tldrIdx = doc.indexOf('**TLDR**');
  ok('in the doctrine, the ask block is listed BEFORE the TLDR (so the TLDR lands last)',
    askIdx > 0 && tldrIdx > 0 && askIdx < tldrIdx);
  ok('the old top-of-reply TLDR ordering is gone from the doctrine',
    !/^1\. \*\*TLDR\*\*/m.test(doc));
}
done();
