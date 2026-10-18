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

/* NEVER ASK HIM A TECHNICAL QUESTION (Paolo 8/15, LOCKED): "don't be fucking asking
   me technical nerdy questions like this, bro. I'm stupid as fuck." I finished a
   task and then asked him to pick between two engineering items BY THEIR INTERNAL
   CODENAMES -- having already written down which one I thought was right, so it was
   not even a real fork, it was approval-seeking that EVERYTHING IS A THUMB (8/9)
   had already killed.
   THIS IS ASSERTED ON CLAUDE.md, not on /laws, deliberately: a session that never
   opens the laws directory still has to read CLAUDE.md first, so the rule has to be
   reachable there or it does not bind. */
ok('CLAUDE.md carries the NEVER-ASK-HIM-A-TECHNICAL-QUESTION law (8/15) — the ' +
   'running order is Claude\'s job, and a question answerable by the repo or by ' +
   'research is work that has not been done yet',
   /NEVER ASK HIM A TECHNICAL OR PRIORITISATION QUESTION/.test(md));
ok('...and it names the empty state, because the pull to fill WHAT I NEED FROM YOU ' +
   'is what manufactures these questions',
   /correct empty state/.test(md) && /Nothing, I'm good/.test(md));

/* THE TRAP THIS CLOSES: the two files must not describe different orders. */
{
  const askIdx = doc.indexOf('WHAT I NEED FROM YOU');
  const tldrIdx = doc.indexOf('**TLDR**');
  ok('in the doctrine, the ask block is listed BEFORE the TLDR (so the TLDR lands last)',
    askIdx > 0 && tldrIdx > 0 && askIdx < tldrIdx);
  ok('the old top-of-reply TLDR ordering is gone from the doctrine',
    !/^1\. \*\*TLDR\*\*/m.test(doc));
}

/* THE REPLY LEG (PLUMBER 10/10/26, row [the reply leg]; rule 90, the coordinator's school round 10:
   "THE LAST FIVE LINES ARE THE REPLY ... cap the whole reply at 150 words"). Two legs, held by the checker
   the coordinator runs on its draft before it sends (tools/bohemia_reply_check.js; a gate cannot read a chat,
   so the gate proves the checker both ways and reads the school's own template from its record):
     WORDS      at or under 150 words on his screen; the proof line and the links do not count.
     LAST FIVE  read from the bottom: the change (a tab first), its number, the red, WHAT I NEED FROM YOU,
                the two-sentence bottom line, in that order.
   Record: records/BOHEMIA_THE_LAST_FIVE_LINES_ARE_THE_REPLY_10_10_26.md
   RED CASE: a 400-word reply in the right shape is red on WORDS alone; the ask above the change, a
   three-sentence bottom line, no red line, a change with no tab and a change with no number are each red on
   LAST FIVE. */
{
  const { checkReply } = require(path.join(ROOT, 'tools/bohemia_reply_check.js'));
  const leg = (r, name) => r.legs.find(l => l.name === name);
  const say = (n, c) => { if (c) console.log('  ok   ' + n); ok(n, c); };   /* these legs print their numbers */
  const SCHOOL = path.join(ROOT, 'records', 'BOHEMIA_COORDINATOR_SCHOOL_ROUND_10_TALKING_TO_THE_BOSS_10_10_26.md');
  const school = fs.existsSync(SCHOOL) ? fs.readFileSync(SCHOOL, 'utf8') : '';
  const tm = school.match(/^5\. The reply template[^\n]*\n([\s\S]*?)\n## ONE RULE/m);
  const template = tm ? tm[1].split('\n').map(l => l.replace(/^ {3}/, '')).join('\n') : '';
  const t = checkReply(template, { template: true });
  say('R1 the school\'s own reply template has the shape: ' + t.words + ' words, ' + leg(t, 'LAST FIVE').why,
    !!template && t.ok);

  const PLAY = 'https://paolosarn.github.io/bohemia/slices/BOHEMIA_ALPHA_0_9.html';
  const DEMO = 'https://paolosarn.github.io/bohemia/slices/BOHEMIA_DEMO.html';
  const GOOD = ['ROUND DONE. 9 lanes shipped, 2 did not.',
    'VOTE: the top card shows one fight tile before and after, side by side, at true size.',
    'MAP: the far end now paints 2,073,600 pixels, was 9,216.',
    'No red this round.',
    'proof: e8cff0e d0fb1de; COOK EVERY ROUND 9/2; REPLY CONTRACT; the record names every gate and every sha that this round touched, which is why it never counts',
    '**WHAT I NEED FROM YOU**',
    '1. Can I move the 145 old pages to the archive? Yes or no.',
    'Bottom line: every new art card now shows before and after.',
    'Open the VOTE tab and tap the top card, because that is how you judge art from now on.',
    PLAY, DEMO].join('\n');
  const g = checkReply(GOOD);
  say('R2 a reply filled from the template passes both legs (' + g.words + ' words, grade ' + g.grade + ')', g.ok);

  const lines = GOOD.split('\n');
  const pad = 'The cook lanes painted, the combat lanes laid their boards, the run lane cut the demo again and the checkers ran on every push.';
  const LONG = [...Array(13).fill(pad), ...lines].join('\n');
  const L4 = checkReply(LONG);
  say('R3 a ' + L4.words + '-word reply in the right shape is red on WORDS and on nothing else',
    L4.words >= 380 && !leg(L4, 'WORDS').ok && leg(L4, 'LAST FIVE').ok);

  const planted = [
    ['the ask above the change', [lines[0], lines[5], lines[6], lines[1], lines[2], lines[3], lines[7], lines[8], PLAY]],
    ['a three-sentence bottom line', [...lines.slice(0, 8), lines[8] + ' It took four rounds.', PLAY]],
    ['no red line', [...lines.slice(0, 3), ...lines.slice(4, 9), PLAY]],
    ['a change that names no tab', [lines[0], 'The new card shows one fight tile both ways, 2 crops at true size.', lines[3], ...lines.slice(4, 9), PLAY]],
    ['a change with no number', [lines[0], 'VOTE: the top card shows one fight tile before and after.', lines[3], ...lines.slice(4, 9), PLAY]],
  ];
  const caught = planted.filter(([, ls]) => { const r = checkReply(ls.join('\n')); return leg(r, 'WORDS').ok && !leg(r, 'LAST FIVE').ok; });
  say('R4 each wrong shape is red on LAST FIVE (' + caught.length + ' of ' + planted.length + ': ' + planted.map(p => p[0]).join('; ') + ')',
    caught.length === planted.length);

  const proofHeavy = checkReply([...lines.slice(0, 4), 'proof: ' + Array(200).fill('gate').join(' '), ...lines.slice(5)].join('\n'));
  const bodyHeavy = checkReply([...lines.slice(0, 3), 'COMBAT: ' + Array(200).fill('word').join(' ') + ' 3.', ...lines.slice(3)].join('\n'));
  const easy = checkReply([lines[0], 'NOT IN A TAB YET: the reply checker, 2 legs.', 'No red this round.', "**WHAT I NEED FROM YOU:** Nothing, I'm good.", lines[7], lines[8], PLAY].join('\n'));
  say('R5 the proof line and the links do not count (' + proofHeavy.words + ' words with a 200-word proof line), the same words in the body do ('
     + bodyHeavy.words + '); NOT IN A TAB YET and an inline "Nothing, I\'m good" pass',
    proofHeavy.ok && !leg(bodyHeavy, 'WORDS').ok && easy.ok);
}
done();
