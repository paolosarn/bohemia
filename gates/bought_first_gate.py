#!/usr/bin/env python3
"""
BOHEMIA BOUGHT-FIRST GATE (7/31/26) — the shopping check must walk the shelf he
actually PAID for.

Paolo 7/31, LOCKED, FLEET-WIDE: "if i bought it i prefer it! Thats for all textures
bro!!!"  (laws/BOHEMIA_ADDENDUM_BOUGHT_BEATS_PAINTED_7_31_26.md)

THIS GATE EXISTS BECAUSE REUSE-FIRST WAS GREEN WHILE THE BOUGHT SHELF WENT UNOPENED.
The law requires a `REUSE CHECK:` naming the banks a tool walked, and TF-ART-001 had
one. It walked records/BOHEMIA_APPROVED_ASSET_INDEX — the shelf of what he has JUDGED.
It never opened the shelf of what he has BOUGHT. Two different shelves; the law only
ever made me name one.

CORRECTION, 7/31, ON THE RECORD: this gate's first draft said his purchased library
"already held a grey concrete block wall in running bond, verified by rendering it and
looking". IT DOES NOT, and I had not looked — I had keyword-matched a pack name. All
105 purchased wall tiles were afterwards decoded and viewed at size: "4. House wall
tiles" is a medieval ivy cottage, "wall tiles" is dungeon masonry, "3. Wall panels
and details" is sci-fi consoles, and 46 of 47 roof tiles are cyberpunk skyscraper
tops. He owns no concrete block wall. TF-ART-001 stands. The gate stands too, on the
better reason: the check it enforces is "OPEN the purchased library and say what you
found", which would have produced that answer on day one instead of a guess.

SO: any tool that cooks art must name a PURCHASED library in its REUSE CHECK, or say
in the same breath why none applies. "None applies" is a legal answer — a character
rig has nothing to buy against — but it has to be SAID, so the next person can see
the shelf was considered rather than forgotten.

SECOND CORRECTION, 7/31, AND IT KILLED A TOOL. This gate also used to hold a
"CONDITIONER" that rewrote his purchased road and sidewalk tiles to lift them off
pure black, citing "act-1 forbids pure black (floor 17)".

  Paolo: "I DIDNT BAN THE PURE BLACK??? WTF I DIDNT BAN ANY OF THE BOUGHT ASSETS I
  APPROVED BO WTF"

He is right and there is no such law. FLOOR=17/CEIL=232 exists in exactly four files,
all Claude's own tools for art CLAUDE PAINTS (cmu_cook, house_cook, house_factory,
cmu_gate); git log -S puts them in Claude cook commits. A constraint adopted for
Claude's own painting was promoted to "act-1 law" and enforced against his property.
Worse, clause 2 of the very law this gate cites says "VERBATIM OR NOT AT ALL. His
tiles blit 1:1" — the conditioner opened that file, quoted its headline, and broke its
second clause. Graveyard: gates/bohemia_graveyard.txt, 7/31.

THE TELL WORTH REMEMBERING: the tool measured 1,410 of his 1,506 purchased tiles as
"illegal". When a rule condemns 94% of what the man bought, the rule is wrong, not the
library.

SO THE COLOUR CHECK IS GONE AND ITS OPPOSITE IS HERE: this gate now enforces VERBATIM.
Any tile shipped as his must be BYTE-IDENTICAL to the bank he paid for. Nothing in the
machine was checking that, which is exactly why a tool that rewrote his pixels could be
built, registered and run green.

Run from repo root:  python3 gates/bought_first_gate.py
"""
import hashlib, json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

LIBS = [f for f in sorted(os.listdir('banks'))
        if re.search(r'(SEAMLESS_SET|MASTER_SET|VARIANT_BANK)', f)]
LAW = 'laws/BOHEMIA_ADDENDUM_BOUGHT_BEATS_PAINTED_7_31_26.md'
QUOTE = 'if i bought it i prefer it'
VERBATIM = 'VERBATIM OR NOT AT ALL'

SRC = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'
RUN = 'slices/BOHEMIA_RUN_CURRENT.html'
DEAD = 'bohemia_bought_conditioner'      # must never come back

# the ART lane's cook tools. Scoped to this lane deliberately: widening it fleet-wide
# is a coordinator call, not mine to make from inside one lane.
# THIS LANE'S COOK TOOLS, NAMED ONE BY ONE. A pattern was tempting and wrong: it
# swept up tools/bohemia_house_art_factory.py, which belongs to another lane. Under
# ONE SYSTEM ONE SESSION I do not edit another lane's tool, and silently EXCLUDING it
# would hide a real finding — that file has no purchased-library check either, and
# its lane should know. So it is named here as a REPORTED finding rather than a
# failure I either fix or bury.
TOOLS = ['bohemia_cmu_cook.py', 'bohemia_house_cook.py',
         'bohemia_house_factory.py', 'bohemia_tileset_recook.py']
OTHER_LANES = ['bohemia_house_art_factory.py']

# a REUSE CHECK that considered the bought shelf says so one of these ways
NAMES_BOUGHT = re.compile(
    r'(SEAMLESS_SET|MASTER_SET|VARIANT_BANK|purchased librar|bought librar|'
    r'BOUGHT BEATS PAINTED|nothing purchased applies|no purchased)', re.I)

P = F = 0

def ok(n, c, d=''):
    global P, F
    if c: P += 1
    else:
        F += 1; print('   FAIL  %s  %s' % (n, d))

def main():
    ok('his ruling is on file', os.path.exists(LAW), LAW)
    if os.path.exists(LAW):
        ok('the law still quotes him verbatim', QUOTE in open(LAW).read())
    ok('the purchased libraries are still in banks/', len(LIBS) >= 4,
       '%d found' % len(LIBS))
    ok('there are cook tools to hold', bool(TOOLS), 'none matched')

    for t in TOOLS:
        src = open('tools/' + t).read()
        head = src[:src.index('"""', src.index('"""') + 3) + 3] if src.count('"""') >= 2 else src[:4000]
        ok('%s documents a REUSE CHECK' % t, 'REUSE CHECK' in head)
        ok('%s\'s reuse check walked the shelf he PAID for' % t,
           bool(NAMES_BOUGHT.search(head)),
           'it names no purchased library and does not say why none applies - this is '
           'exactly how TF-ART-001 cooked a wall he already owned')

    # ---- VERBATIM OR NOT AT ALL -------------------------------------------
    # His law, clause 2, and until now nothing enforced it. A tool that rewrote his
    # purchased pixels was built, registered and ran GREEN, because every check in
    # the repo asked whether his art SHIPS, never whether it is UNTOUCHED.
    if os.path.exists(LAW):
        ok('his law still says VERBATIM OR NOT AT ALL', VERBATIM in open(LAW).read())

    bank = json.load(open(SRC))
    owned = {t['b64'] for t in bank['tiles'] if t.get('b64')}
    ok('his purchased ground bank is intact', len(owned) >= 400, '%d tiles' % len(owned))

    # every tile the run draws as "his" must be a byte-for-byte tile from the bank
    if os.path.exists(RUN):
        run = open(RUN, encoding='utf8', errors='ignore').read()
        shipped = [t for t in bank['tiles']
                   if t.get('b64') and t.get('tier') in ('S', 'A')
                   and t.get('pure') is True and t['b64'] in run]
        ok('his tiles reach the run UNMODIFIED, byte for byte', len(shipped) >= 24,
           'only %d of his exact bank bytes were found in the run - if his art is '
           'drawn but the bytes differ, something is transforming what he bought'
           % len(shipped))

    # the conditioner must never come back in any form
    live = []
    for d in ('tools', 'gates', 'engine', 'banks', 'slices'):
        if not os.path.isdir(d):
            continue
        for f in os.listdir(d):
            if DEAD in f:
                live.append(os.path.join(d, f))
    ok('the bought-tile conditioner stays dead', not live, ', '.join(live))

    grave = open('gates/bohemia_graveyard.txt').read()
    ok('and its kill is on the record with his words', DEAD in grave
       and 'I DIDNT BAN THE PURE BLACK' in grave)

    # THE RULE THAT KILLED IT, MADE MACHINE-CHECKABLE: no tool may apply a
    # luminance floor/ceiling to art HE BOUGHT. Claude's own painted cooks may keep
    # theirs - that is Claude constraining Claude, which is what it always was.
    for t in TOOLS + ['bohemia_bought_audit.py']:
        p = 'tools/' + t
        if not os.path.exists(p):
            continue
        s = open(p).read()
        touches_bank = bool(re.search(r'SEAMLESS_SET|MASTER_SET', s))
        claims_law = bool(re.search(r'act-?1 (palette )?law:? no pure black|'
                                    r'act-?1 forbids pure black', s, re.I))
        ok('%s does not enforce a black floor on art HE BOUGHT' % t,
           not (touches_bank and claims_law),
           'it reads a purchased library AND asserts a no-pure-black law that he '
           'never made - that is the conditioner\'s exact mistake')

    for t in OTHER_LANES:
        if not os.path.exists('tools/' + t):
            continue
        src = open('tools/' + t).read()[:4000]
        if not NAMES_BOUGHT.search(src):
            print('   NOTE  %s (ANOTHER LANE\'S TOOL) names no purchased library '
                  'either. Not mine to edit and not mine to hide: that lane should '
                  'check it against BOUGHT BEATS PAINTED.' % t)

    print('   BOUGHT-FIRST GATE: %d passed, %d failed  (%d cook tools, %d purchased '
          'libraries)' % (P, F, len(TOOLS), len(LIBS)))
    return 1 if F else 0

if __name__ == '__main__':
    sys.exit(main())
