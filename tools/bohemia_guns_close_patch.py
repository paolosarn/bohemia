#!/usr/bin/env python3
"""
V208 -- A GUN IS IN ITS OWN WAY UP CLOSE  (COMBAT lane, [guns close] BB-GUNS-CLOSE)

THE ROW, IN ITS OWN WORDS: "GUNS ARE BAD IN CLOSE. Forever, on every weapon. IT IS
A CONSTRAINT, NOT A FEATURE, IT COSTS NOTHING TODAY, AND EVERY WEAPON WRITTEN
BEFORE IT IS WRITTEN IS REWORK." Its reason is history, not taste: guns and melee
coexisted for two centuries and it only ended when the bayonet let a gun fight up
close. If our guns are good in close the positional game dies and the fight becomes
stand-and-shoot. The genre's usual answer -- cover plus hold-fire -- is REFUSED,
because its documented result is turtling, and that is his own acceptance test
failing in somebody else's game: "not a 40 MINUTE LONG CHESS MATCH."

*** MEASURED FIRST, AND THE BUILD WAS THE EXACT OPPOSITE OF THE ROW. *** rangeT(d,R)
returns ZERO for any distance inside PT_BLANK and rises toward one as you back off,
and the two things that read it both make close the BEST place to shoot:
    distPkg(e)   the dial's pattern tier, with its own comment saying it:
                 "point blank pulls EASIER patterns, even on Bohemian"
    distAccuracy the men's accuracy against you: "point blank ~.97, far ~.37
                 (they rarely miss up close)"
So today a gun is at its most forgiving with a man in your face. That is the
stand-and-shoot fight the row exists to prevent.

*** AND ONE HALF OF THAT IS PAOLO'S OWN RULING, SO IT IS NOT TOUCHED. *** The men's
up-close accuracy carries his 7/27 ruling in the code beside it -- "up close nothing
moves, because up close was already lethal and that is his 7/27 ruling." A backlog
row is OUR mechanism; his ruling is CONTENTS and it wins. The two are not actually
in conflict once you read what the row is for: it is about the PLAYER choosing to
stand still and trade shots. So
    A MAN IN YOUR FACE STILL HITS YOU (his 7/27 ruling, untouched), AND YOUR OWN
    GUN IS AT ITS WORST AT THAT DISTANCE (this row).
which is the positional pressure the row asks for, pointing the same way from both
sides: do not be there.

*** AND "EVERY WEAPON" CANNOT MEAN A FLAT PENALTY, BECAUSE THE SHIPPED WEAPONS
ALREADY SAY OTHERWISE. *** WEAPON_ID, in the game, calls the shotgun "brutal up
close", and WEAPON_RANGE calls it "a knife with a bang" with an effective range of
5 while the rifle's is 20. REALISM FIRST (8/4) is a law and a shotgun is the one
gun that is genuinely good in a doorway. So the constraint is read the only way
that satisfies the row AND the weapons AND the world:
    THE PENALTY IS PROPORTIONAL TO HOW UNWIELDY THE GUN IS AT THAT DISTANCE, AND
    IT IS DERIVED FROM EACH WEAPON'S OWN EFFECTIVE RANGE.
Every weapon has a close band it is bad inside -- nothing is exempt, which is the
row's "every weapon" -- and the bands come out where a person would expect:
    shotgun  eff 5   -> the smallest band of the four
    pistol   eff 6
    smg      eff 10
    rifle    eff 20  -> the largest: a rifle at two feet is a club
ONE constant decides how much of a gun's own range is too close, it is marked
[DIAL], and what the gate holds is the SHAPE and not the number. THIS READING IS
THE ONE JUDGEMENT IN THIS PATCH AND IT IS FLAGGED FOR THE COORDINATOR.

NO DAMAGE BEFORE THE DIAL: not one damage number, hit value or roll is authored
here. The dial is the player's own skill check and this changes WHERE ON THE BOARD
it is hard, which is the shape the row asks for in its own sentence ("the gate
asserts the SHAPE... never a number").

AND HE CAN SEE IT, because a dial that quietly gets mean is a bug to the person
holding it. The target readout already names the range band; inside a gun's close
band it says so.
"""
import re
import sys
import base64

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__GUNS_CLOSE__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:140]))
    return src.replace(old, new, n)


BLOCK = r"""
/* ===== V208 __GUNS_CLOSE__ -- A GUN IS IN ITS OWN WAY UP CLOSE =============
   BB-GUNS-CLOSE: guns are bad in close, forever, on every weapon. The build was
   the exact opposite -- rangeT is 0 inside PT_BLANK and the dial pulls its EASIEST
   patterns there, with its own comment admitting it.
   THE BAND IS THE WEAPON'S OWN. A fraction of its effective range, so nothing is
   exempt (the row's "every weapon") and the answer still comes out where a person
   would expect it: the shotgun WEAPON_ID already calls "brutal up close" gets the
   smallest band of the four and the rifle the largest, because a rifle at two feet
   is a club. Read through rangeMult() and hd() like every other distance in this
   file, so the dark and the house board scale it the same way. */
const CLOSE_FRAC=0.45;   /* [DIAL] how much of a gun's OWN effective range is too
                            close to use it. shotgun ~2 tiles, rifle ~9. The SHAPE
                            is the law; this number is a dial. */
/* AND THE BAND DOES NOT SCALE WITH THE LIGHT, WHICH COST ME A MEASUREMENT. The
   first cut read it through rangeMult() like every other distance in this file,
   and on the bench that halved it: a shotgun's band came out at 1.1 tiles and a
   pistol's at 1.35, against a point-blank anchor of 4, so the constraint existed
   and could not be felt. It is also wrong on its own terms -- HOW UNWIELDY A GUN
   IS IN A DOORWAY IS PHYSICAL AND THE DARK DOES NOT CHANGE IT. Reach shrinks at
   night; length does not. */
function closeBand(R){ return Math.max(hd(1), ((R&&R.eff)||6)*CLOSE_FRAC); }
/* 1 AT CONTACT, 0 AT THE EDGE OF THE BAND. The mirror of rangeT, which is 0 at
   point blank and 1 far away: between the two of them the easiest shot a gun has
   is at its OWN range, and both ends of the board are hard. */
function closeT(d,R){
  const B=closeBand(R);
  d=Math.max(hd(1), d||0);
  return Math.min(1,Math.max(0,(B-d)/B)); }
function closeTMine(e){ return closeT((e&&e.edist)||10, myRange()); }
/* WHICH END OF THE BOARD IS FIGHTING YOU. Used for the readout, so the reason the
   dial went mean is on screen instead of being a mystery in the player's hands. */
function tooClose(e){ return closeTMine(e) > distT(e); }
/* ===== /V208 __GUNS_CLOSE__ ===== */
"""


def patch_blob(blob):
    if MARK in blob:
        print('  blob already patched')
        return blob, False

    # 1. the band, declared where the ranges it reads are
    blob = sub(blob,
               "function distPkg(e){ return Math.round(distT(e)*(G.userPkg||0)); } // point blank pulls EASIER patterns, even on Bohemian",
               BLOCK.strip() + "\n"
               "/* V208 " + MARK + ": AND THE DIAL IS HARD AT BOTH ENDS NOW. It was\n"
               "   Math.round(distT(e)*pkg) with the comment \"point blank pulls EASIER patterns,\n"
               "   even on Bohemian\" -- which is the stand-and-shoot fight BB-GUNS-CLOSE exists to\n"
               "   prevent, written down as a feature. The harder of the two ends decides, so the\n"
               "   easiest shot a gun has is at ITS OWN range and the board has a place you want to\n"
               "   be standing. NO DAMAGE BEFORE THE DIAL: this is the skill check, not a number. */\n"
               "function distPkg(e){ return Math.round(Math.max(distT(e),closeTMine(e))*(G.userPkg||0)); }",
               1, 'blob/dial')

    # 2. and he can SEE why the dial got mean
    blob = sub(blob,
               "function rangeTier(e){ const t=distT(e); return t<0.18?'POINT BLANK':t<0.55?'MID RANGE':'LONG RANGE'; }",
               "/* V208 " + MARK + ": a dial that quietly gets mean is a bug to the man holding\n"
               "   it, so the band he is in says so. draft:true -- the words are WORDS'. */\n"
               "function rangeTier(e){ if(tooClose(e))return 'TOO CLOSE';\n"
               "  const t=distT(e); return t<0.18?'POINT BLANK':t<0.55?'MID RANGE':'LONG RANGE'; }",
               1, 'blob/tier')
    return blob, True


def main():
    s = open(ALPHA, encoding='utf-8').read()
    if MARK in s:
        print('  shell already patched')
        return
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('no COMBAT_B64')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    blob, changed = patch_blob(blob)
    if not changed:
        return
    s = s[:m.start(1)] + base64.b64encode(blob.encode('utf-8')).decode('ascii') + s[m.end(1):]
    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/12k - A GUN IS IN ITS OWN WAY UP CLOSE\g<2>', s, count=1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('V208 applied to', ALPHA)


if __name__ == '__main__':
    main()
