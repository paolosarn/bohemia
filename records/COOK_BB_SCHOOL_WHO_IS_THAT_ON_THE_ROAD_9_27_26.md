# [bb map art] SCHOOL, ROUND THREE: WHO IS THAT ON THE ROAD
COOK lane, 9/27/26, session cook-mce6r5. Rule 33(f): one page a round. Rule 33(g): it ends
with what MOVES here that their picture does not.

Round one drew YOU and four places. Round two drew the land under them. Rule 33(a) says
"parties roam and leave tracks", so this is everybody else: the thirteen factions, moving on
the map he now has to be able to read.

## THE LIBRARY, READ FIRST (rule 33j)
reference/library/battle_brothers/01_WORLDMAP.md:

  "SCOUTING: parties within sight are named by size ('a small band', 'a large host') and
   strength badges; you can see their banner and destination line. PATROLS: noble houses send
   patrols on roads; caravans move..."

**The reference itself separates WHAT a party is from WHO it belongs to.** Size and kind are
read off the sprite; the banner says whose it is; the name comes on inspection. It never asks
the colour to carry everything. That is the whole design of this round and it came from the
volume, not from me.

## THE FINDING: YOU CANNOT TELL WHO IS COMING BY COLOUR
The thirteen faction colours are not mine and never will be. COLOUR IS TERRITORY (8/26) says
which hue a faction owns is HIS, they are measured off his own shipped wardrobe, and
faction_colour_gate goes red if they drift. So I measured what they do as banners:

    CARTEL AND MOB ARE 3.6 APART on a scale whose widest pair is 373. They are the same colour.
    EIGHT MORE PAIRS SIT UNDER 50   Anarchists/Trades 38, Caravans/Trades 39, Mob/Remnants 39,
      Cartel/Remnants 42, Trades/Remnants 44, Anarchists/Remnants 47, Anarchists/Mob 48,
      Caravans/Church 49
    NINE OF THIRTEEN BANNERS sit within 25 luminance of the CITY ground they stand on (86)

Eight of the thirteen are browns at hue 30 and four more are greys, because this is a valley
of working people in dust, which is right. It just means **a banner cannot be the thing that
identifies a party**, and the fix is not to touch the colours.

## THE SHAPE SAYS WHAT THEY ARE, THE BANNER SAYS WHO
Four party shapes. **The shape each faction takes is DERIVED FROM CANON, not picked by me:**
every faction in engine/BOHEMIA_faction_graph.json carries an `align`, and that file's own
header reads "All canon; nothing invented".

    military, predatory, territorial                 -> A PATROL
    neutral (the trading factions)                   -> A CARAVAN
    underground, nonprofit, community, evangelical   -> A CROWD
    everything else                                  -> ON FOOT

Thirteen markers out of four drawings and one banner slot, so a fourteenth faction is an
arrangement and not a new drawing (BBM-02's kit rule, carried across to parties).

## *** I TRIED TO FIX THE DARK GROUND WITH CONTRAST TWICE BEFORE SEEING IT WAS THE DRAWING ***
Anarchists measured **2% findable on the mountain**. So:

**ATTEMPT ONE, the lip INSIDE the body**, the way the footprints do it. On a figure whose
limbs are one and two pixels wide, EVERY pixel has open ground to its north or west, so the
whole marker turned into a pale outline with two dark holes in it, and ON FOOT, PATROL and
CROWD all came out as the same smudge. The measurement went green.

**ATTEMPT TWO, the lip OUTSIDE the body.** A pale halo filled every gap between legs and
between figures. The measurement went greener. The picture got worse again.

**THE REAL PROBLEM: THE FOUR SHAPES WERE FOUR GROUPS OF PEOPLE, AND AT FOURTEEN PIXELS A
PERSON IS A PERSON.** Redrawn to differ where it actually counts, on the OUTER SILHOUETTE:

    ON FOOT    tall and thin, a flag over it
    PATROL     wide and low, a row of points above it
    CARAVAN    long and horizontal, a canvas on wheels
    CROWD      a low mass, wider than tall, no straight edge and no points

and each one now carries a **REAL LIGHT THING it would actually own** -- a staff, spear
points, a canvas tilt, bedding over their heads -- instead of a rim painted round the edge.
The light is an object, which is what makes them findable on dark ground AND what makes them
read as different things.

Same failure this lane named in the footprints round, word for word: treating "it does not
read" as a numbers problem when it is a drawing problem. Twice in one round this time.

After the redraw the worst in the whole set is **Church at 13% clear of the mountain**, and
every one of the thirteen passes on every ground.

## THE GUARD FROM ROUND ONE IS AMENDED, NOT LOOSENED
Round one refused any marker whose bottom third moved, because "a machine still running has a
part that moves and feet that do not". That is true of a pump and a fortress and it is
nonsense here: **a party is people and people move their feet.** The feet rule stays on the
PLACES, where it was earned. The rule that matters for a walking group is different and it is
the one in force now: **the group must not DRIFT** -- the centre of its ink may not wander
between frames, or the marker slides around the map instead of walking on the spot.

## WHAT MOVES (rule 33g)
    ON FOOT   the banner stirs
    PATROL    the rank steps, one man forward and one back
    CARAVAN   the wheels turn
    CROWD     they shuffle, one body a beat
500 ms a frame, one beat at 120 BPM, the same clock as the fight and as round one's places.

THE TRACKS ARE NOT DRAWN HERE. Rule 33(a) says parties leave them and they already exist:
__WHOSE_FOOTPRINTS_ARE_THESE__ (9/12), a coloured thread at whole-valley zoom, passed by
DIRECTION 9/13.

THE HORROR LINE: thirteen groups are still walking this valley and from up here you cannot
tell which of them is coming toward you.

## WHERE HE SEES IT
The VOTE tab, cook-who-is-that-on-the-road-9-27. **It is a page, so they move.**

Library cited (rule 33j): reference/library/battle_brothers/01_WORLDMAP.md
Bank: banks/BOHEMIA_THE_PARTIES_ON_THE_MAP_9_27_26.txt
Tool: tools/bohemia_who_is_that_on_the_road_cook_9_27_26.py
