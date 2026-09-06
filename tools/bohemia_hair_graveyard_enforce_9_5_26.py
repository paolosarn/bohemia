#!/usr/bin/env python3
"""
BOHEMIA -- THIRTEEN HAIRCUTS HE KILLED ARE STILL IN THE GAME (9/5/26, COOK lane)

First move of [runway hair] HAIR-TO-THE-CARD, which this lane's own handoff says must
begin by reading the graveyard TO THE END before a single style is cooked -- the 8/30
lesson, where seven cuts turned out to be remakes of shapes he had killed twice and
the answer was one grep away. This is that read, and it found something bigger.

records/BOHEMIA_VERDICT_HAIR_ROUND4_8_20_26.txt, Paolo 8/20, verbatim:

    KEEP (2):   TEMPLE TAPER, SHAG
    KILL (13):  SUN CROP, DUSK SHAG, ASH SWEEP, SALT CROWN, BUZZ CUT, CROP,
                SLICK BACK, BOWL CUT, FRINGE, SHOULDER LENGTH, LONG LOOSE,
                WOLF CUT, GREY WISPS
    "All 13 kills are FINAL and graveyarded. GRAVEYARD IS FINAL, no remakes."

*** ALL THIRTEEN ARE STILL SHIPPING AS st:'canon'. *** They are thirteen of the
twenty-four canon haircuts in the build -- more than half the hair in the game is
hair he deleted, and it has been that way since 8/20.

WHY NOTHING CAUGHT IT, AND THIS IS THE REAL DEFECT. The graveyard gate greps the tree
for each dead TOKEN and reports live references. The tokens for these thirteen were
written as the JUDGING TOOL'S DISPLAY NAME:

    n:'HAIR — SUN CROP'        <- what the graveyard says
    n:'SUN CROP'               <- what the code has always said

THE GATE HAS BEEN GUARDING A STRING THAT NEVER EXISTED IN THE CODEBASE. It reports
"180 dead tokens tracked, 0 LIVE REFERENCES" and it is telling the truth about the
string it was given. A TOKEN THAT MATCHES NOTHING CANNOT FAIL, which is the same
family as the 8/25 headwear gate that passed seventeen hats drawing zero pixels: a
check a corpse passes is not checking for life.

WHAT THIS TOOL DOES, and it decides nothing:
  1. Rewrites those thirteen graveyard tokens to the form the code actually uses, so
     the existing gate can see them. Nothing is added to or removed from the
     graveyard; a tombstone's TEXT is untouched, only its match token.
  2. Flips the thirteen from st:'canon' to st:'dead' in the wardrobe. That is not a
     judgement, it is HIS judgement being applied: NOTES ARE RULINGS (7/19), and the
     round-4 record says in its own words that the kills stand and that nothing in it
     reopens a verdict.
ELEVEN CANON HAIRCUTS REMAIN and every one of them is legitimate: TEMPLE TAPER and
SHAG are his two KEEPs from that very round, and the other nine were cooked after it.
The valley does not go bald; it stops wearing thirteen things he deleted.

WHAT IT DELIBERATELY DOES NOT DO: cook a replacement. The same record says a fresh
cook answering these slots is legal ONLY after the E/W facings render correctly,
because "east and west hairstyles look like absolute dog shit across the board" was
ONE RENDER DEFECT judged thirteen times, not thirteen taste calls. Cooking new hair
into a broken render is how you get a fourteenth kill.

REUSE CHECK: cooks ZERO pixels and opens no bank -- it edits two text files. No art
is made, no shape is designed, nothing is drawn.

  python3 tools/bohemia_hair_graveyard_enforce_9_5_26.py
"""
import os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

KILLED = ['SUN CROP', 'DUSK SHAG', 'ASH SWEEP', 'SALT CROWN', 'BUZZ CUT', 'CROP',
          'SLICK BACK', 'BOWL CUT', 'FRINGE', 'SHOULDER LENGTH', 'LONG LOOSE',
          'WOLF CUT', 'GREY WISPS']

print('=== HAIR ROUND 4: HIS THIRTEEN KILLS, ENFORCED (9/5) ===')

# 1. the graveyard tokens, so the gate can see what it was written to guard
gy = 'gates/bohemia_graveyard.txt'
s = open(gy, encoding='utf-8').read()
fixed = 0
for name in KILLED:
    old = "n:'HAIR — %s'" % name
    if old in s:
        s = s.replace(old, "n:'%s'" % name); fixed += 1
open(gy, 'w', encoding='utf-8').write(s)
print('  graveyard tokens rewritten to the form the code uses: %d of %d' % (fixed, len(KILLED)))

# 2. the wardrobe, so his verdict is what ships
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
a = open(ALPHA, encoding='utf-8').read()
flipped, missing = 0, []
for name in KILLED:
    pat = "{n:'%s',st:'canon',layer:'hair'" % name
    if pat in a:
        if a.count(pat) != 1:
            print('  FAIL %s appears %d times' % (name, a.count(pat))); sys.exit(1)
        a = a.replace(pat, "{n:'%s',st:'dead',layer:'hair'" % name); flipped += 1
    else:
        missing.append(name)
open(ALPHA, 'w', encoding='utf-8').write(a)
print('  haircuts flipped canon -> dead: %d' % flipped)
if missing:
    print('  already dead or absent: ' + ', '.join(missing))

live = len(re.findall(r"\{n:'[^']+',st:'canon',layer:'hair'", a))
print('  canon haircuts remaining: %d' % live)
if live < 8:
    print('  FAIL that is too few to dress a crowd -- stopping rather than shipping a bald valley')
    sys.exit(1)
