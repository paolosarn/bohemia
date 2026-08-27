#!/usr/bin/env python3
"""BOHEMIA CONTRACTION PASS -- the one half of a voice pass a machine may do.

WHAT THIS IS, AND MORE IMPORTANTLY WHAT IT IS NOT.

The voice diagnosis found eight machine tells. SEVEN OF THEM NEED A HUMAN READ:
cutting a maxim off the end of a speech, giving somebody a question to ask,
varying a rhythm, finding the one detail only this person would name, putting the
subtext under the line. A regex cannot do any of that and this file does not
pretend to.

ONE of the eight is mechanical, and it is the loudest: CONTRACTIONS. "I will walk
it back" is not a stylistic choice a character made, it is a sentence nobody has
ever said out loud. The 27 quest scenes contracted 2.2% of the time and the
street barks contracted 75%, so the story sounded like scripture and the street
sounded like people. Turning "do not" into "don't" is not craft. It is spelling.

SO A SCENE THIS TOOL TOUCHES IS **CONTRACTION-PASSED**, NEVER **VOICE-PASSED**,
and gates/voice_gate.js holds those two words apart on purpose. The five demo
scenes were voice-passed by hand, line by line. The other 22 get this, which
fixes the one tell a machine can honestly fix and leaves the other seven visible
and unfixed rather than quietly declared done.

THE GUARDS, because a careless sweep would break real lines:
  - never inside a comment, a @STAGE, a @DO, or an @OPT's target and effects
  - never when either word is SHOUTED (ALL CAPS is emphasis, and "I do NOT"
    means something "I don't" does not)
  - "have/has/had" only before a participle ("I have been" -> "I've been"),
    because "I have a name" -> "I've a name" is not American speech
  - never a word that is already contracted

  python3 tools/bohemia_contraction_pass.py            # report only
  python3 tools/bohemia_contraction_pass.py --write    # apply

Card: laws/BOHEMIA_VOICE_CARD_8_26_26.md
Gate: gates/voice_gate.js
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BQ = os.path.join(ROOT, 'quests', 'bq')

# THE FIVE THE DEMO PLAYS WERE PASSED BY HAND, LINE BY LINE. This tool must
# never touch them: a mechanical sweep over hand-written work can only make it
# worse, and it would also destroy the evidence of what a real pass looks like.
HAND_PASSED = {
    'S01_THE_METER_READER.bq', 'S09_THE_BACK_DOOR.bq',
    'S02_THE_SAME_CRATE_TWICE.bq', 'S22_THE_COLD_ROOM.bq',
    'S25_THE_PRESSURE_GOES_BACKWARD.bq',
}

PAIRS = [
    ('do not', "don't"), ('does not', "doesn't"), ('did not', "didn't"),
    ('is not', "isn't"), ('are not', "aren't"), ('was not', "wasn't"),
    ('were not', "weren't"), ('will not', "won't"), ('would not', "wouldn't"),
    ('could not', "couldn't"), ('should not', "shouldn't"),
    ('it is', "it's"), ('that is', "that's"), ('there is', "there's"),
    ('what is', "what's"), ('who is', "who's"), ('he is', "he's"),
    ('she is', "she's"), ('they are', "they're"), ('you are', "you're"),
    ('we are', "we're"), ('i am', "I'm"),
    ('i will', "I'll"), ('you will', "you'll"), ('we will', "we'll"),
    ('they will', "they'll"), ('it will', "it'll"), ('he will', "he'll"),
    ('she will', "she'll"), ('that will', "that'll"),
    ('i would', "I'd"), ('you would', "you'd"), ('they would', "they'd"),
    ('let us', "let's"),
]
# cannot is one word
SINGLE = [('cannot', "can't")]

# have/has/had only in front of a participle -- "I have a name" must stay.
PARTICIPLE = re.compile(
    r"(been|got|had|done|gone|seen|said|told|made|taken|given|found|left|kept|"
    r"put|come|run|known|heard|held|paid|read|lost|sent|built|felt|meant|"
    r"[a-z]+ed)\b", re.I)
HAVE = [('i have', "I've"), ('you have', "you've"), ('we have', "we've"),
        ('they have', "they've"), ('he has', "he's"), ('she has', "she's"),
        ('it has', "it's"), ('i had', "I'd"), ('you had', "you'd"),
        ('that has', "that's"), ('there has', "there's")]

TEXT_LINE = re.compile(r'^(\s*@(?:SAY|LOG)\s+)(.*)$')
OPT_LINE = re.compile(r'^(\s*@OPT\s+)(.*)$')


# A CONTRACTED AUXILIARY MAY NOT END A CLAUSE. "I can't promise I'll." is not
# English -- a stranded auxiliary always takes its full form ("I can't promise I
# will."), and so does "Yes I am.", "It is.", "We are." The NEGATIVE
# contractions are exempt: "I don't." and "He won't." are perfectly ordinary.
# The first cut of this tool did not know that and wrote "I'll." into a scene.
STRANDED = re.compile(r'^\s*(?:[.!?,;:"\')\]]|$)')


def stranded_after(text, end):
    return bool(STRANDED.match(text[end:]))


def shouted(s):
    """ALL CAPS is emphasis. "I do NOT" is not the same sentence as "I don't"."""
    return any(w.isupper() and len(w) > 1 for w in s.split())


def contract(text):
    """Returns (new_text, n_changed)."""
    n = 0
    for a, b in SINGLE:
        def sub1(m, b=b):
            w = m.group(0)
            if shouted(w):
                return w
            return b.capitalize() if w[0].isupper() else b
        text, k = re.subn(r'\b' + a + r'\b', sub1, text, flags=re.I)
        n += k
    for a, b in PAIRS:
        pat = r'\b' + a.replace(' ', r'\s+') + r'\b'

        def sub(m, b=b):
            w = m.group(0)
            if shouted(w):
                return w
            # never leave a contracted auxiliary stranded at the end of a clause
            if "n't" not in b and stranded_after(m.string, m.end()):
                return w
            return b[0].upper() + b[1:] if w[0].isupper() and not b.startswith('I') else b
        text, k = re.subn(pat, sub, text, flags=re.I)
        n += k
    for a, b in HAVE:
        pat = r'\b' + a.replace(' ', r'\s+') + r'\b(\s+)(\S+)'

        def subh(m, b=b):
            w, gap, nxt = m.group(0), m.group(1), m.group(2)
            if shouted(a) or shouted(w.split()[0] + ' ' + w.split()[1]):
                return w
            if not PARTICIPLE.match(nxt):
                return w
            head = b[0].upper() + b[1:] if w[0].isupper() and not b.startswith('I') else b
            return head + gap + nxt
        text, k = re.subn(pat, subh, text, flags=re.I)
        n += k
    return text, n


def pass_file(path, write):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.read().split('\n')
    changed, out = 0, []
    for ln in lines:
        if ln.lstrip().startswith('#'):          # a comment is not player-facing
            out.append(ln)
            continue
        m = TEXT_LINE.match(ln)
        if m:
            body, k = contract(m.group(2))
            out.append(m.group(1) + body)
            changed += k
            continue
        m = OPT_LINE.match(ln)
        if m:
            # ONLY the quoted words, or a (parenthetical). Everything after them
            # is the quest lane's wiring and this tool may not touch it.
            body = m.group(2)
            q = re.match(r'^("([^"]*)")(.*)$', body)
            if q:
                new, k = contract(q.group(2))
                out.append(m.group(1) + '"' + new + '"' + q.group(3))
                changed += k
                continue
            pr = re.match(r'^(\(([^)]*)\))(.*)$', body)
            if pr:
                new, k = contract(pr.group(2))
                out.append(m.group(1) + '(' + new + ')' + pr.group(3))
                changed += k
                continue
        out.append(ln)
    if write and changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(out))
    return changed


def main():
    write = '--write' in sys.argv
    files = sorted(f for f in os.listdir(BQ) if f.endswith('.bq'))
    total, touched = 0, 0
    for f in files:
        if f in HAND_PASSED:
            continue
        n = pass_file(os.path.join(BQ, f), write)
        if n:
            touched += 1
            total += n
            print('  %-40s %3d' % (f, n))
    print('%s %d contraction(s) across %d scene(s)'
          % ('APPLIED' if write else 'WOULD APPLY', total, touched))
    print('  the five the demo plays are hand-passed and untouched by this tool')
    print('  A SCENE THIS TOUCHES IS CONTRACTION-PASSED, NOT VOICE-PASSED.')
    print('  The maxims, the missing questions and the flat rhythm are still there.')


if __name__ == '__main__':
    main()
