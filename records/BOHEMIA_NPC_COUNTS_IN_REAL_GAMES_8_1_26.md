# WHAT OTHER GAMES ACTUALLY HOLD (8/1/26, PEOPLE lane)

Paolo asked for this research by name: "how many NPCs are in games like Fallout
New Vegas or Skyrim". It turns out to validate our number AND to overturn the
conclusion I drew from it, which is the more useful half.

## THE COUNTS

    Fallout: New Vegas        ~373-380 named NPCs
    Fallout 4                 500+ unique NPCs (Bethesda's own figure)
    Skyrim                    ~979-1,001 named NPCs
    Red Dead Redemption 2     ~1,000+ NPCs, ~1,000 voice actors
    ------------------------------------------------------------
    BOHEMIA, derived 8/1      1,113 people

**Our scale-model arithmetic landed on Skyrim's number without ever looking at
it.** Two completely independent roads - real Las Vegas census data shrunk 1:78
and then cut to 3% survivors, versus what shipped games actually contain - agree.
That is about as strong a sanity check as this question can get, and Paolo's
instinct to ask for it was the right instinct.

Our target is ~3x New Vegas, ~2x Fallout 4, level with Skyrim and RDR2. For a
game whose whole subject is a city that lost its people, sitting at the top of
that range is correct, not excessive.

## AND NOW THE PART THAT MATTERS MORE

Density, not total:

    SKYRIM    ~1,000 NPCs over ~37 km2  = ~27 per km2
    BOHEMIA    1,047 people over 21 km2 = ~49 per km2

**We are already almost twice as dense as Skyrim per square kilometre, and the
valley still reads as dead.** So the total was never the problem.

The difference is entirely DISTRIBUTION. Measured, our 1,047 people:

    276 residential cells hold NOBODY
    180 hold 1-2
    129 hold 3-5
     42 hold 6-10
      1 holds 11+          <- the biggest settlement in the entire valley is 12 people

Skyrim does the opposite. It puts ~50-70 NPCs inside Whiterun, a walled space you
cross in two minutes, and then leaves whole mountains with nobody. You feel a
thousand NPCs because you meet sixty at once.

We smeared the same number across 352 blocks at three people each. Three people
spread over a 96 m block is invisible. Sixty people in one block is a town.

**THIS IS PAOLO'S OWN 7/29 RULING NOT BEING FOLLOWED.** He ruled the population
lands as "clusters AND no man's lands AND random spread". What is actually
running is almost pure random spread: the clustering is so weak that the largest
cluster in Las Vegas is a dozen people.

## THE QUESTION THIS RAISES, which is his

Same ~1,100 people, two very different games:

  A. **THIN AND EVERYWHERE** (what runs today). Every other block has two or
     three people on it. Nowhere is empty, nowhere is a town.
  B. **CLUSTERED HARD** (what Skyrim does, and what his own ruling says). About
     twenty to thirty real settlements of forty to sixty people each, and long
     stretches of genuinely empty city between them.

B is the one that makes a thousand people FEEL like a thousand people. It is also
the one his ruling already describes. But how empty the empty parts get is a
feel call, and feel calls are his.

## WHY HE SAW NO CHANGE FROM THE 8/1 POPULATION SHIP, and that is on me

The run applies a FLOOR of 6 households to the player's own cell and only that
cell - "your own block always has neighbours", added 7/29 for a good reason. So
his home block held 16 people before the population change and holds 16 after.
**The one block he plays on is pinned by construction and cannot show a
valley-wide population change.** I shipped a change that was invisible from where
he stands and then told him to go look at it. Measured after the ship:

    his block  (39,23)   16 people, 6 outside     <- unchanged, the floor
    one north  (39,22)    0 people
    one south  (39,24)    0 people

The code did deploy; later Pages runs concluded success and the commit is on
main. Nothing was broken. It was just not visible, and I should have said so
instead of asking him to look.

## SOURCES
- TheGamer, "Fallout: New Vegas - How Many NPCs Are In The Game?" (~373-380)
- Fallout Wiki, Fallout 4 characters; Bethesda's 500+ figure
- UESP / Skyrim Wiki NPC listings (~979-1,001)
- RDR2.org wiki, Nonplayable Characters (~1,000+)
