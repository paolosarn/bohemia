#!/usr/bin/env python3
"""V156 COVER IS A PLACE YOU STAND, NOT A ROCK ON THE HORIZON.

Paolo 8/15: "I'll be in the middle of nowhere and then it will still tell me to
pop out like I don't even have Cover and then the action button still says pop
out what's up with that are Enemies even trying to get into an angle where you
will not be undercover but exposed to them like are they even trying to get an
exposed shot on you or what?"

Two complaints. ONE root cause, and it is the same shape he caught me on with
V153: THE RULE RAN ONE WAY.

--------------------------------------------------------------------------
THE ASYMMETRY, IN THE FILE'S OWN CODE
--------------------------------------------------------------------------
What an ENEMY has to satisfy to count as covered (realCoverPillar):

    segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85)          <- blocks the line
      && Math.hypot(pxy[0]-exy[0],pxy[1]-exy[1])<1.8           <- AND HE IS AT IT

What the PLAYER has to satisfy (myCoverAgainst -> coverPillarAgainst):

    Math.sin(dA)*P.edist < P.r*0.9                             <- blocks the line
                                                               <- and that is all

*** THERE IS NO PROXIMITY TEST ON HIS SIDE AT ALL. *** A man has to be hugging
his stone. A rock six tiles away, sitting anywhere on the sightline, counts as
the player's cover. That is not cover. That is scenery.

MEASURED, 60 arenas, 360 samples of where he actually stands:
    the game says YOU ARE IN COVER          94.4% of the time
    with no hard stone within 1.5 tiles     83.8% of those
    median distance to that "cover"         2.8 tiles
    worst                                   6.0 tiles

And over 400 turns of a fight where he never walks to a stone, the button
offered POP OUT on 370 of them. Every one was a lie. He is describing this
exactly: in the middle of nowhere, being told to pop out of nothing.

--------------------------------------------------------------------------
AND IT IS WHY HE CANNOT TELL IF THEY ARE FLANKING (his second question)
--------------------------------------------------------------------------
The flank notice fires when a man's move turns a blocked angle into a clean one.
With ghost cover in the map, the "before" is blocked almost everywhere, so:

    "N came around your cover" fired on 98.8% of turns.

A warning that fires every single turn communicates nothing. It has been crying
wolf at him all week, which is precisely why the answer to "are they even
trying" was not visible on his screen.

*** THEY ARE TRYING, AND IT WORKS. *** Measured over 40 fights where he never
moves, the men with a clean shot on him climb every turn:

    turn   0   1   2   3   4   5   6   7   8   9  10
    clean 3.9 4.1 4.2 4.4 4.5 4.6 4.7 4.8 4.9 5.0 5.0

That is real flanking he could not see because the notice was noise.

--------------------------------------------------------------------------
WHAT THIS CHANGES AND WHAT IT DELIBERATELY DOES NOT
--------------------------------------------------------------------------
COVER, THE PLACE, now means what it means for every enemy body in the game: a
hard stone that blocks a line AND that you are standing at. The button reads it.
The run readout reads it. The flank notice reads it, so "they came around your
cover" can only be said about cover you actually have.

NOT CHANGED: the PROTECTION math. A rock on the line really does stop a bullet,
whether you are hugging it or it is four tiles up the lot, and that is honest
physics. He keeps every bit of shielding he had. What he stops getting is a
button telling him to pop out of open ground, and a notice that shouts flank
every turn until the word means nothing.

That split is the whole fix: BEING SHIELDED is geometry, BEING IN COVER is a
place you are standing. The file only ever had one word for both.

REUSE CHECK: cooks NO graphic pixels. Reuses coverPillarAgainst and the 1.8-tile
reach that realCoverPillar has applied to every enemy body since V108 -- the
number is not invented here, it is the one already in the file, finally applied
to both sides. Nothing authored, no bank opened.

TASTE CHECK: authors no art. The taste rule is his: a button that lies is worse
than a button that says nothing, and a warning that fires every turn is not a
warning. The restraint is that nothing gets harder -- no protection is removed,
only the label is made true.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V156 COVER IS A PLACE YOU STAND'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v156 already in; nothing to do')
        return

    # ---- 1. the predicate the file never had ---------------------------
    old = """function coveredFromAnyone(){
  return (G.e||[]).some(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing
    && myCoverAgainst(e.ea,e.edist,e.lvl)); }"""
    new = """function coveredFromAnyone(){
  return (G.e||[]).some(e=>e&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing
    && myCoverAgainst(e.ea,e.edist,e.lvl)); }
/* ===== V156 COVER IS A PLACE YOU STAND =======================
   Paolo 8/15: "I'll be in the middle of nowhere and then it will still tell me
   to pop out like I don't even have Cover."
   THE RULE RAN ONE WAY, exactly like V153. What an ENEMY must satisfy to be
   covered (realCoverPillar) is TWO things -- the stone blocks the line AND he
   is within 1.8 tiles of it. What the PLAYER must satisfy is ONE: the stone
   blocks the line. There is no proximity test on his side at all, so a rock six
   tiles up the lot counts as his cover. That is not cover, that is scenery.
   MEASURED, 360 samples of where he actually stands: the game called him
   covered 94.4% of the time, and 83.8% of those had no hard stone within 1.5
   tiles -- median 2.8 tiles away, worst 6.0. Over 400 turns of standing in the
   open the button offered POP OUT on 370 of them, every one a lie.
   SO THERE ARE TWO DIFFERENT FACTS AND THE FILE HAD ONE WORD FOR BOTH:
     BEING SHIELDED -- a rock on the line stops a bullet at any distance. Real
       physics, unchanged, he keeps every bit of protection he had.
     BEING IN COVER -- a place you are standing, that you can pop out OF.
   This is the second one, and its reach is not invented: 1.8 tiles is the
   number realCoverPillar has demanded of every enemy body since V108. The rule
   runs both ways now. */
const COVER_REACH=1.8;   /* [DIAL] how close the stone has to be to be YOURS -- the same reach every enemy body is held to */
function myCoverPillarNear(){
  for(const e of (G.e||[])){ if(!e||e.dead||e.downed||e.broken||e.fleeing)continue;
    const P=coverPillarAgainst(e.ea,e.edist,e.lvl,false);
    if(P&&P.edist<COVER_REACH)return P; }
  return null; }
function inRealCover(){ return !!myCoverPillarNear(); }"""
    js = subN(js, old, new)

    # ---- 2. the button stops offering to pop him out of open ground ----
    old = """    const nearCov=coveredFromAnyone();   /* V52 asked "is any stone near me". V123: it asks WHO IT IS COVER FROM, because cover facing away from every gun is not cover. */"""
    new = """    /* V156: BOTH HALVES AT ONCE. V52 asked "is any stone near me" and V123
       replaced it with "is anything between me and anyone", which threw the
       proximity away -- so POP OUT started appearing while he stood in open
       ground with the nearest rock three tiles off. It is the stone you are AT
       that also shields you from somebody. Neither half alone was ever right. */
    const nearCov=inRealCover();"""
    js = subN(js, old, new)

    # ---- 3. "you landed on cover" has to mean it -----------------------
    old = """  const onCov=coveredFromAnyone();"""
    new = """  const onCov=inRealCover();   /* V156: LANDED ON means landed ON -- not "there is a rock somewhere along the line" */"""
    js = subN(js, old, new)

    # ---- 4. the flank notice stops crying wolf -------------------------
    old = """  let flanked=0,closed=0;
  for(const p of plans.slice(0,budget)){ const e=p.e;
    const wasBlocked=coverAtXY(Math.cos(e.ea)*e.edist,Math.sin(e.ea)*e.edist,e.lvl);"""
    new = """  /* V156: THE NOTICE WAS CRYING WOLF EVERY SINGLE TURN. Measured before this:
     "N came around your cover" fired on 98.8% of turns, because ghost cover
     made the BEFORE state blocked almost everywhere, so nearly any step read as
     a flank. A warning that fires every turn communicates nothing, and that is
     the real reason he could not tell whether they were trying. They ARE: over
     40 fights where he never moves, the men with a clean shot on him climb 3.9
     -> 5.0 across ten turns. He just could not see it through the noise.
     Now it can only be said about cover he actually has. */
  const _hadCover=inRealCover();
  let flanked=0,closed=0;
  for(const p of plans.slice(0,budget)){ const e=p.e;
    const wasBlocked=_hadCover&&coverAtXY(Math.cos(e.ea)*e.edist,Math.sin(e.ea)*e.edist,e.lvl);"""
    js = subN(js, old, new)

    old = """  const word=flanked?(flanked+' came around your cover'):(closed+' closed on you');"""
    new = """  /* and when he has no cover to be come around, say the true thing instead */
  const word=flanked?(flanked+' came around your cover')
    :(closed?(closed+' closed on you'):(G._pressN+' moved on you'));"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v156: cover is a place you stand -- %d chars' % len(js))


if __name__ == '__main__':
    main()
