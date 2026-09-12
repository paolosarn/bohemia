#!/usr/bin/env python3
"""HAIR HAS COLOURS -- COOK 1 of 2, 9/11/26. THE PALETTE.

PAOLO, THIS ROUND: "The more the better I don't know why you're asking me if you want hair
colors, bro of course add them, bro."

He is right twice. Add them, and it should never have been a question -- EVERYTHING IS A
THUMB says I decide, build it, and he corrects what he hates. It sat in my WHAT I NEED FROM
YOU block for four rounds. That was the bug.

MEASURED BEFORE TOUCHING ANYTHING:

    seven hair ramps exist:  H_BLK H_BRN H_SND H_RUS H_GRY H_WHT H_ACD
    the canon cuts use THREE of them:  H_BLK, H_BRN, H_SND

So grey and white were never missing -- they sat in the file, unused. This cook adds eleven
more and gives all eighteen ONE NAMED TABLE, so anything (the face maker, a faction, an
authored cut, the crowd palette in cook 2) picks a colour BY NAME instead of reaching for a
variable. Order is the order a head of hair goes grey.

*** WHAT THIS COOK DELIBERATELY DOES NOT DO, AND WHY THE FIRST VERSION OF IT WAS WRONG. ***
My first cut of this added a `hairWear()` setter that overrode the ramp genHair bakes, so a
wearer's colour could beat the cut's. I wrote that BEFORE reading how a citizen is actually
coloured, and the answer was already in the file two places:

    slices/BOHEMIA_ALPHA_0_9.html:8265   the hair layer LUMINANCE-TINTS by `hairColor`
    slices/BOHEMIA_ALPHA_0_9.html:16571  "NPCFactory has owned skin tone and hair colour
                                          since 7/2 ... No second mechanism is written for
                                          skin or hair -- ENGINE SYNC LAW."

Per-person hair colour already exists, ships, and is what the RUN uses. A setter beside it
is the SECOND MECHANISM that law names, and it would have stacked a tint on an override.
So the override is gone and cook 2 widens the table that already governs every head.
This file is now a PALETTE and nothing else: twenty ramps and their names, zero behaviour.

WHICH COLOURS, AND WHY NOT MORE THAN THIS. Real heads first: jet, black, ash, brown, auburn,
ginger, rust, sand, platinum, bleach, steel (salt and pepper), grey, white. Then the runway,
because EVERYONE DRESSES LIKE A RUNWAY is also a law and dye is how hair joins it: acid
(already there), moss, magenta, teal, violet. Every dye sits at or under the saturation the
WARDROBE itself already reaches (measured 9/7: the loudest approved garment is 188), so hair
never out-shouts clothes and COLOUR IS TERRITORY is undisturbed.

STRUCTURE-NOT-COLOR is why this is not eleven cuts times eighteen colours. That would be
seventy-seven garment rows holding eleven silhouettes, and the hair gates would be right to
hate it. A cut is a shape. A colour is a colour. They are not the same property.

    python3 tools/bohemia_hair_has_colours_9_11_26.py

REFERENCE CHECK (owed by the 9/4 standing duty, paid 9/12 after the gate could not see this
tool at all -- see the note at the bottom of this block).

COMPARED TO: HAIR-01 (saint11's hair and character-head tutorials), HAIR-03 (a real
barbering chart), GARM-03 (this repo's own COLOUR IS TERRITORY + trenchcoat laws), and real
human hair-colour distribution.

STRUCTURAL RULES TAKEN:
  * HAIR-01 -- "hair is ONE MASS with a silhouette; single-strand lines at sprite scale read
    as scratches." That is WHY every colour here is a THREE-TONE RAMP (dk/mid/lt) and not a
    single hex. A mass needs a dark side, a lit side and the body between, or it reads flat
    and the silhouette does all the work alone. Every one of the eleven new ramps is built
    on that shape, same as the seven that were already here.
  * GARM-03 -- "the cut belongs to the register, the colour belongs to the faction; a cook
    never spends both channels on one idea." That is the whole argument of this cook. The
    alternative fix was eleven cuts times eighteen colours as garment rows, which spends the
    SHAPE channel on a COLOUR idea. STRUCTURE-NOT-COLOR says the same thing from the other
    end. So: ramps only, zero new garments, genHair untouched.
  * GARM-03 again, on saturation -- COLOUR IS TERRITORY reserves loud colour for factions and
    clothes. Measured against it: the loudest approved garment reaches 188, so no dye ramp
    here exceeds that. Hair joins the runway without out-shouting it.
  * HAIR-03 -- a barber's chart is LENGTH ON TOP x LENGTH ON SIDES x HOW IT FALLS, and
    colour is not on that grid at all. Confirmation that colour is a separate axis from cut,
    which is the same split the other two teach.

WHAT CHANGED FROM THE REFERENCE: nothing structural. Real heads gave the natural end of the
list (jet through white); the dye end is ours, because a collapsed valley that DRESSES LIKE A
RUNWAY is this world and not a photograph. The dyes are held under the wardrobe's own
measured ceiling rather than under a real-world one, which is the repo being its own ruler.

AND THE GATE NEVER SAW THIS TOOL. reference_check_gate picks cooks by FILENAME
(`'cook' in t.lower() or 'factory' in t.lower()`), and none of this round's three are named
"cook" however many times the docstring says COOK. A FILENAME IS NOT A REGISTRY -- this lane
lost a round to that exact sentence on the district generators, and here it is again in a
checker. Measured 9/12: 92 tools visible to the gate, 187 that write an art surface AND deal
in colour, so about 173 invisible (an upper bound; some of those are judges, not cooks).
Routed to DIRECTION, whose row the KNOWN GAP already sits on. The duty is paid here anyway,
because a gate that cannot see me is not a reason to skip it.
"""
import io, re, sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__HAIR_HAS_COLOURS__'

ANCHOR = "  var H_ACD={dk:[58,88,26],mid:[110,164,52],lt:[158,208,96]};"

NEW_RAMPS = """  var H_ACD={dk:[58,88,26],mid:[110,164,52],lt:[158,208,96]};
  /* """ + MARK + """ (Paolo 9/11: "the more the better... of course add them, bro")
     MEASURED FIRST: seven ramps existed and the canon cuts used THREE of them (H_BLK,
     H_BRN, H_SND), so grey and white were never missing from the game -- they were in
     the file, unused. Eleven more below, real heads first and then the dye, because
     EVERYONE DRESSES LIKE A RUNWAY. Every dye sits at or under the saturation the
     WARDROBE itself already reaches (the loudest approved garment measures 188), so hair
     never out-shouts clothes and COLOUR IS TERRITORY is undisturbed. */
  var H_JET={dk:[12,13,20],mid:[26,28,40],lt:[46,50,68]};
  var H_ASH={dk:[38,36,34],mid:[70,66,62],lt:[104,99,92]};
  var H_AUB={dk:[58,24,18],mid:[104,44,30],lt:[150,72,48]};
  var H_GNG={dk:[92,42,16],mid:[158,80,28],lt:[212,124,56]};
  var H_PLT={dk:[128,112,78],mid:[196,178,132],lt:[238,226,186]};
  var H_STL={dk:[52,52,54],mid:[112,112,116],lt:[178,178,184]};
  var H_BLC={dk:[150,142,120],mid:[210,202,178],lt:[244,240,224]};
  var H_MAG={dk:[72,16,48],mid:[142,32,92],lt:[196,74,140]};
  var H_TEA={dk:[14,58,58],mid:[26,110,108],lt:[60,164,158]};
  var H_VIO={dk:[44,26,72],mid:[84,52,134],lt:[132,96,186]};
  var H_MOS={dk:[54,58,30],mid:[98,104,54],lt:[146,152,86]};
  /* PAOLO'S OWN TWO, GIVEN RAMPS SO THEY REACH A BODY. His dusty pink and his red have
     been in the crowd palette since 7/2 and had no ramp, so a citizen wearing either got
     the right colour in their PORTRAIT and the cut's own colour on their BODY -- the exact
     bug cook 3 exists to close, surviving in the two colours that were his. The mid of each
     is HIS VALUE UNCHANGED; only the dark and light ends are derived, at the same
     proportions every ramp above uses. NOW EVERY NON-NULL CROWD COLOUR IS A RAMP MID, which
     is a claim a gate can hold rather than a habit I have to keep. */
  var H_PNK={dk:[104,72,74],mid:[196,150,150],lt:[230,194,194]};
  var H_RED={dk:[102,28,18],mid:[200,60,40],lt:[234,114,82]};
  /* ONE NAMED TABLE, so a citizen, the face maker or a faction picks a colour BY NAME
     instead of reaching for a variable. Order is the order a head of hair goes grey.
     THE CROWD PALETTE IS BUILT FROM THESE SAME MIDS (cook 2), by a tool that reads them
     out of this file rather than retyping them, so the colour a hair GARMENT bakes and
     the colour the crowd TINTS with cannot drift into two different blondes.
     NO BEHAVIOUR LIVES HERE. Per-person hair colour is NPCFactory's and has been since
     7/2; a second setter beside it is what ENGINE SYNC LAW forbids, and the first cut of
     this cook wrote one before checking. This is a palette. */
  var HAIR_RAMPS=window.HAIR_RAMPS={
    JET:H_JET, BLACK:H_BLK, ASH:H_ASH, BROWN:H_BRN, AUBURN:H_AUB, GINGER:H_GNG,
    RUST:H_RUS, SAND:H_SND, PLATINUM:H_PLT, BLEACH:H_BLC, STEEL:H_STL, GREY:H_GRY,
    WHITE:H_WHT, ACID:H_ACD, MOSS:H_MOS, MAGENTA:H_MAG, TEAL:H_TEA, VIOLET:H_VIO,
    PINK:H_PNK, RED:H_RED };"""


def main():
    src = io.open(ALPHA, encoding='utf-8').read()
    if MARK in src:
        print('  already done (mark present)')
        return 0
    if src.count(ANCHOR) != 1:
        print('  the ramp block is not where I left it (%d) -- REFUSING' % src.count(ANCHOR))
        return 1
    if 'HAIR_RAMPS' in src:
        print('  HAIR_RAMPS already exists -- REFUSING to write a second one')
        return 1
    # the override the first cut wrote must not come back by any route
    if 'hairWear' in src or 'HAIR_WEAR' in src:
        print('  a wearer-colour override is present; that is the second mechanism '
              'ENGINE SYNC LAW forbids -- REFUSING')
        return 1

    src = src.replace(ANCHOR, NEW_RAMPS, 1)

    for needle, why in ((MARK, 'the mark'), ('window.HAIR_RAMPS=', 'the named table')):
        if needle not in src:
            print('  verify failed, missing ' + why)
            return 1
    if src.count('window.HAIR_RAMPS=') != 1:
        print('  verify failed: HAIR_RAMPS is not exactly once')
        return 1
    # genHair must be UNTOUCHED: a cut still bakes its own ramp, so all 1,744 pinned
    # garment hashes are byte-for-byte what they were.
    if "var r=opt.ramp,i,o={},S=rsc();" not in src:
        print('  verify failed: genHair no longer reads opt.ramp -- REFUSING')
        return 1

    io.open(ALPHA, 'w', encoding='utf-8').write(src)
    names = set(re.findall(r'^\s*var (H_\w+)=\{dk:', src, re.M))
    tbl = re.search(r'var HAIR_RAMPS=window\.HAIR_RAMPS=\{(.*?)\};', src, re.S).group(1)
    named = set(re.findall(r'(\w+):H_\w+', tbl))
    print('  %s: patched. %d ramps, %d named. genHair untouched.'
          % (ALPHA, len(names), len(named)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
