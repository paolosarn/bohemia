# THE FIRST BUILDING IS A HOUSE (9/7/26, LIFE + CITY lane)

VAMILY row: `[build default] THE-FIRST-BUILDING-A-PLAYER-PLACES-IS-AN-AIRBASE`.
Harvested from ECONOMY round 4 by the coordinator (records/BOHEMIA_THE_HARVEST_9_6_26.md)
by PLAYING the game, not grepping it.

## THE COMPLAINT, MEASURED BEFORE ANYTHING WAS TOUCHED

On the cut demo (slices/BOHEMIA_DEMO.html), tap an empty desert plot in CITY:

    options in the picker : 59
    groups                : 0
    the select says       : "airbase"
    first three labels    : AIRBASE / AIRPORT / APARTMENT

Every word of the row was true. A browser `<select>` with no chosen option selects
option zero, the list is alphabetical, and alphabetical starts at AIRBASE. Hit BUILD
and the first thing a player ever puts in the world is a military airfield.

## AND THE DEFECT WAS IN FOUR PLACES, NOT ONE

The row names the picker. Three OTHER reads had the same bug, and they are the ones
that answer when the panel is NOT open:

  1. the picker itself (`CBpanel`)
  2. the price line
  3. the affordability check
  4. the build itself

2, 3 and 4 each read `CE.buildableTypes(OM.DISTRICT)[0]` as their fallback, and `[0]`
is alphabetical, so all three answered "airbase" too. A fix that only touched the
picker would have been one quarter of a fix. They are now one pair of functions,
`cbDefaultType()` and `cbPickedType()`, and the string `CE.buildableTypes(OM.DISTRICT)[0]`
appears nowhere in the surface any more. Leg A3 holds that.

## WHAT THE REPO ACTUALLY KNOWS ABOUT THESE 59 THINGS, AND IT IS ONE FACT

The row says "group the list by what it is for ... (a home, a shop, a power building)".
`BohemiaPopulation.RESIDENTIAL` names the six that are homes. **Nothing else in the
codebase says what any other district is FOR**, and WHICH TYPES MAKE POWER OR CLOUT is
[PENDING Paolo] by this lane's own state line.

So a POWER group here would be this lane inventing his content, and MECHANISM-MINE /
CONTENTS-PAOLO'S forbids that. The grouping is exactly as deep as the repo's knowledge
and not one group deeper:

    HOMES · each houses 2.2      (the six in RESIDENTIAL, and the number is
                                  HOUSEHOLD_MEAN, read live, not typed)
    EVERYTHING ELSE              (the other 53)

Leg A2 is the leg that holds that line: it fails if a third group ever appears, so the
day somebody adds POWER without a ruling behind it, a gate says so.

## THE DEFAULT IS SUBURB, AND THAT IS A DECISION

Grouping ALONE already stops the airbase, because the first home alphabetically is
APARTMENT and moving the homes to the top makes the browser pick that. The mutation run
proved it: deleting the explicit default left every other leg green.

That is the trap this record exists to name. A decision no leg states is a decision that
drifts. The row said "put a sensible first building at the top", and the sensible one is
not "whichever home wins the alphabet" -- it is the ground he wakes up standing on. The
world seats him in suburb. `ty.value = 'suburb'` is written down, and **leg B1b fails if
it is ever removed**, printing the alphabetical answer it would have fallen back to.

## A FINDING ON THE WAY

Every home holds EXACTLY 2.2. An apartment houses what a trailer houses. That is
HOUSEHOLD_MEAN applied flat. It is a [PENDING Paolo] this lane already raised in round 4
of the other row, and it is why the group label carries the number ONCE instead of six
identical numbers pretending to be a choice.

## AFTER

    the select says      : suburb   (was "airbase")
    groups               : ["HOMES · each houses 2.2", "EVERYTHING ELSE"]   (were none)
    first three          : ["APARTMENT","ESTATE","GATED"]   (were AIRBASE / AIRPORT / APARTMENT)
    with the panel shut  : suburb   (was "airbase" in 3 separate places)
    options              : 59, all of them, none deleted

## THE GATE

`gates/build_default_gate.js`, registered as BUILD DEFAULT, 9 pass / 0 fail, measured on
the CUT DEMO through the iframe (the standalone surface is a trap this lane has been
caught by three times: `PLAYER_CV` only exists once the parent frame posts to it).

MUTATION-TESTED THREE WAYS, each one turning a different leg red:
  - remove the explicit `suburb` default  -> B1b red, falls to APARTMENT
  - flatten the two groups                -> A2, B2, B3 red, back to AIRBASE / AIRPORT / APARTMENT
  - restore the `[0]` fallback            -> B4 red at "airbase"

Leg B2 exists because fixing a default by deleting choices would be a different and
worse bug: all 59 are still offered.

## THE SHIP TEST, WHICH IS MET

The row's own words: "Group the list by what it is for, put a sensible first building at
the top, and make the choice read like a choice." The list is grouped by the one thing
the repo knows, the top is a home, the top home is the one he lives in, the group says
what it is for and what it holds, and no choice was taken away.

Tab: CITY. Build stamp: 9/7d.
