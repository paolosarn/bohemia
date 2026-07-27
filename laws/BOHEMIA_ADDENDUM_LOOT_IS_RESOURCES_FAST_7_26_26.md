# BOHEMIA ADDENDUM — LOOT IS RESOURCES, AND LOOTING IS FAST (Paolo 7/26/26, LOCKED)

Paolo's words, verbatim, after playing the Zomboid emulation:

> "That was really bad and not fun. And I kind of want Luc [loot] to be very
> simplified. I know I want there to be aspects of customization, but like I
> don't want as many items as Project Zomboy and like I want it easier to loot
> like. Imagine if that went by really quick instead of really slowly I might
> give a fuck about it. State of decay to state of decay has decent looting
> system in place. Kind of kind of I like I like state of decay too maybe even if
> they were less items than that for customization like I really want the game to
> be minimalistic in that regard like yeah like maybe the item will be resources
> but like the description it might tell you like what type of resource it is to
> help you understand the amount but like at the end of the day, I would want the
> item be like you found like three were you know more minimal those decent as a
> looting experience but you know"

This is the loot system's constitution. It overrides anything the lab wrote about
looting, and it overrides my own pattern notes where they conflict.

## THE LAW

1. **LOOTING IS FAST.** Speed is the point, not a tuning value. He said it twice:
   "I want it easier to loot" and "imagine if that went by really quick instead
   of really slowly I might give a fuck about it." A searched container resolves
   in ONE action, not in an item-by-item queue. If a player has to watch a bar
   fill per object, the design is already wrong.

2. **A FOUND THING IS A RESOURCE WITH A COUNT, NOT AN OBJECT WITH A NAME.**
   "maybe the item will be resources... at the end of the day I would want the
   item be like you found like three." The unit is `RESOURCE x N`. Not
   CannedChili, TinOpener and a dead rat: **FOOD x3**.

3. **THE DESCRIPTION CARRIES THE FLAVOUR, AND ITS JOB IS TO EXPLAIN THE AMOUNT.**
   "the description it might tell you like what type of resource it is to help you
   understand the amount." So the count is the mechanism and the words are the
   texture: FOOD x3, and the line under it says what it actually was. Flavour is
   read, never counted, never inventoried, never carried as separate objects.

4. **MINIMALISTIC IS THE STANDING BAR.** "I really want the game to be
   minimalistic in that regard." FEWER resource kinds than State of Decay, and
   far fewer than Project Zomboid. When in doubt, cut a kind.

5. **CUSTOMISATION IS NOT LOOT VOLUME.** "I know I want there to be aspects of
   customization, but... I don't want as many items as Project Zomboid." So
   customisation depth comes from the wardrobe and the character, which already
   have their own laws (STRUCTURE-NOT-COLOR, the rig). It is NOT bought by
   flooding the world with item entries.

6. **THE REFERENCE IS STATE OF DECAY (and State of Decay 2).** "State of decay
   has decent looting system in place... I like state of decay too maybe, even if
   there were less items than that." That is the target feel: a container, one
   quick search, a small resource yield, out. Not a survival inventory sim.

7. **PROJECT ZOMBOID IS AN ANTI-REFERENCE FOR LOOT.** Its item-by-item time
   economy is explicitly rejected. Nothing may cite it as a reason to make our
   looting slower or more granular. (Its content-shape findings about tables and
   junk rolls survive only where they do not conflict with clauses 1-4.)

## WHAT THIS KILLS

- slices/lab/BOHEMIA_LAB_ZOMBOID_HOUSE_7_26_26.html — DEAD, deleted and graveyarded, with the
  post-mortem in gates/bohemia_graveyard.txt and
  records/BOHEMIA_ZOMBOID_LOOT_KILL_7_26_26.txt. It is a reference page, not
  Bohemia content, and it is dead as a reference because it teaches the wrong
  pace.
- The "charge for organising, not grabbing" recommendation I made from it. It is
  a real fact about their code and it is now IRRELEVANT to us: we are not
  charging for either. One action, one yield.

## STILL [PENDING Paolo] — CONTENT, AND NOBODY INVENTS IT

a) **THE RESOURCE KINDS.** How many, and what they are. State of Decay uses six
   (food, meds, munitions, fuel, construction, luxury). He wants fewer. The list
   is his.
b) **THE YIELD RANGE.** "you found like three" is the shape. The actual numbers
   per container kind are his.
c) **WHAT A SEARCH COSTS IN TIME.** One action, but how big an action, in the
   units of laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md.
d) **WHETHER A CONTAINER CAN BE SEARCHED TWICE**, and whether searching is noisy.

## WHAT SURVIVES FROM THE LAB, BECAUSE IT DOES NOT CONFLICT

- **THE CONTAINER IS THE CONTRACT.** What a container yields is keyed on the
  district and the KIND of container. A motel nightstand promises something a
  warehouse crate does not. This is compatible with clause 2: the container kind
  decides WHICH resource and roughly how much, and the flavour line says what it
  was. Our tilespec dossiers already name every tile's kind.
- **RATION BY COUNT, NOT PRICE** and **A CEILING THAT ONLY MOVES ON A
  COMMITMENT** (records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt). Both approved,
  both untouched by this ruling.

## GATE

No new machinery this turn, because this addendum authorises no build. When the
owning lane builds the loot system, its gate must assert clauses 1-4 directly: a
search resolves in one action, a yield is a `{kind, count}` pair and never a list
of named objects, the flavour string is never used as an inventory key, and the
number of resource KINDS never exceeds whatever Paolo rules in (a).
