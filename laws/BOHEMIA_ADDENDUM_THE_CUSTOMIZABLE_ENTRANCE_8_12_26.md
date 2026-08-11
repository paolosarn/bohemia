# BOHEMIA ADDENDUM — THE CUSTOMIZABLE ENTRANCE (Paolo 8/12/26, LOCKED)

Paolo, verbatim:

> "matter of fact i want the factions and the way the main quest starts with the faction
> ypu chose at the faction neighborhood housing or whatever. wer decided your family will
> be the same and shit so yeah. customizable entrance to the game type shit"

---

## THE RULING

1. **YOU CHOOSE YOUR FACTION AT THE START OF THE GAME.** It is the first decision, before
   the main quest opens.
2. **YOU BEGIN IN THAT FACTION'S NEIGHBOURHOOD.** Your family's house sits in the ground
   that faction holds — "the faction neighborhood housing."
3. **THE MAIN QUEST OPENS FROM THERE.** The way it starts is coloured by who you picked.
4. **YOUR FAMILY IS THE SAME EITHER WAY.** Already decided, and it stands: the starting
   family is the dynasty's seed and does not change with the choice.
5. **IT IS A CUSTOMIZABLE ENTRANCE**, not a class system. The choice is a starting
   position in the world, not a stat loadout.

## WHAT THIS CHANGES AND WHAT IT DELIBERATELY DOES NOT

The ACT 1 OPENING (7/19) is untouched and stays exactly as locked:

- the game starts COLD, mid-crisis, straight into the family-defense fight
- **the tutorial IS that fight**
- **the opening loss is the SIBLING**, not a parent; both parents survive into the dinner
- the GRIEF DINNER the next day, then the BURIAL ON THE RIDGE where the tutorial ends

**The emotional spine is fixed. The political spine is chosen.** Who your family is, what
happens to them in the first ten minutes, and what it costs — all constant. Where they
live, whose ground it is, and who is standing around you when it happens — yours.

That split is the whole design and it is worth naming: a customizable entrance that
changed the family would make the opening a character sheet. Changing only the WHERE
keeps the open a story that happens to one specific family, and makes the second
playthrough a different world rather than a different protagonist.

## THE FOURTEEN, AND THEY ARE ALREADY AUTHORED

`engine/BOHEMIA_faction_graph.json` already marks exactly fourteen `selectable`, each
with an alignment and a note in his own words. The chooser needs **no new content**:

```
Reds capitalist · Blues socialist · Anarchists anti-establishment · Colorful community
Church evangelical · Network psyop · Trades neutral · Caravans neutral
Volunteers nonprofit · Remnants military · Cartel predatory · Mob territorial
Homeless underground · Custom emergent
```

CUSTOM is the player faction — "no preset philosophy, identity emerges from play." It has
a MARK (`plain`) and, correctly, **no colour**: a faction whose identity emerges cannot be
handed one at the door. The chooser shows that absence rather than inventing a swatch.

## AND IT ANSWERS A PROBLEM ALREADY ON THE TABLE

Flagged 8/11: the demo block sits at [37,22], twenty cells from the nearest faction base,
and a base's pull reaches twelve — so nobody around you belongs to anybody, and the whole
faction layer reads as absent. The proposed fixes were to move the block (map layouts are
not Claude's) or widen the reach (fitting the world to a screenshot).

**This ruling dissolves it.** The game does not start you at an arbitrary block. It starts
you in your chosen faction's neighbourhood — inside their ground, surrounded by their
people, wearing the choice you just made. The dead zone was an artifact of a demo block
nobody had chosen.

## HOW FAR THE CHOICE REACHES — ANSWERED (Paolo 8/12, same day, LOCKED)

Asked directly whether picking a faction changes the main quest's CONTENT or only where
it opens. Verbatim:

> "It only changes the location and possible vibe and colors possible dialogue but yeah
> it's not day and night. It's just with different clothes on."

**THERE IS ONE MAIN QUEST. NOT FOURTEEN.** What the choice moves:

| moves | does not move |
|---|---|
| **location** — whose ground you start on | the story |
| **vibe** — what the place feels like | the family |
| **colours** — his 13 faction colours + 14 marks | the beats: fight, sibling, dinner, burial |
| **some dialogue** — lines coloured by who raised you | the arc, the ending, the structure |

**"It's just with different clothes on."** Same body. Different clothes. That is the
whole scope of the feature and it is the sentence to check any future work against.

### WHAT "DIFFERENT CLOTHES" ACTUALLY MEANS (Paolo 8/12, correcting my reading)

I first read "different clothes on" as a SCOPE limit — one quest, many dressings. He
corrected it:

> "when I said different clothes, I meant it kind of in a philosophical way as well like
> it's just dressed differently. I didn't of course they will wear a different clothes
> but it's bigger than that."

**It is a statement about what a faction IS.** The factions are not different kinds of
people doing different things. They are the same people, doing the same small set of
things, wearing different stories about why.

**GROUNDED, and it is the well-documented finding rather than a mood.** Organizations in
the same field converge on the same structures **not because it is efficient but because
it is LEGITIMATE** — DiMaggio and Powell's institutional isomorphism, through coercive,
mimetic and normative pressure. Convergence shows up hardest in the *governance* layer —
the procedures, the sign-offs, the public account of oneself — while the justifying
narrative stays distinct. Same behaviour. Different legitimating story. That is exactly
what he is describing, and it is why a valley of fourteen factions is not fourteen
different animals.
Sources: [Isomorphism (sociology)](https://en.wikipedia.org/wiki/Isomorphism_(sociology)) ·
[Institutional isomorphism, DiMaggio & Powell](https://sk.sagepub.com/ency/edvol/organization/chpt/institutional-isomorphism) ·
[Understanding institutional isomorphism](https://www.numberanalytics.com/blog/ultimate-guide-institutional-isomorphism-comparative-public-policy)

### *** AND HIS OWN CORPUS ALREADY DOES IT. MEASURED. ***

Not asserted — counted, across every faction-moving ending he has written:

```
              QUIET NOTABLE RISKY RECKLESS
TRADES          4      4      1      1
REDS            3      3      2      2
BLUES           1      2      2      1
REMNANTS        .      1      2      3
CARAVANS        1      2      1      2
VOLUNTEERS      3      1      2      .
HOMELESS        1      .      1      1
CHURCH          .      2      1      .
MOB             .      1      1      1
COLORFUL        .      1      1      .
CARTEL          .      1      1      .
ANARCHISTS      .      1      .      1
ALL            13     19     15     12

factions spanning 2+ loudness tiers: 12 of 12
```

**Every faction that moves at all spans multiple tiers, and the distribution is almost
flat.** No faction is the quiet one. No faction is the reckless one.

And at the SAME tier, across opposite ideologies, the acts read as the same act:

> **QUIET** — HOMELESS *"talked them up out of the deep, slow, in the dark"* · CARAVANS
> *"paid the toll out of my own pocket... quiet, forgettable"* · VOLUNTEERS *"gave the
> true number, plainly"* · REDS *"brokered it in a stairwell... no witnesses"*
>
> **RECKLESS** — HOMELESS *"ended it loud in the deep, for the bounty"* · REMNANTS *"took
> the ugly name for the double pay"* · CARAVANS *"broke the checkpoint loud, guns and
> fire and a crowd"* · BLUES *"broke the grate off the culvert mouth with a crowd
> watching"*

Underground, trade, charity and capital all do the same thing at QUIET: **handle it
without a crowd and absorb the cost yourself.** All four do the same thing at RECKLESS:
**do it in front of everybody and take what comes.**

### THE CONSEQUENCE FOR THE BUILD

**THE AXIS THAT ACTUALLY VARIES IS HOW LOUD YOU WERE, NOT WHO YOU ARE.** That axis is
already his (`#quiet` / `#notable` / `#risky` / `#reckless`, 7/21) and already wired to
reach, retelling and standing (8/6).

So a faction is a **DIALECT**, not a behaviour set: the same act, justified in that
faction's own vocabulary. Which is why one quest with fourteen dressings is not a
compromise for scope — **it is the accurate model.** Fourteen forked quests would state
something about the world that is false.

**THE LIFE LESSON UNDERNEATH, and the game never says it out loud:** everybody is doing
roughly the same things to get through. What separates them is the story they tell about
why — and that story is worn, not born.

### WHY THIS IS THE IMPORTANT HALF OF THE RULING

A customizable entrance is the kind of feature that quietly becomes fourteen games. The
natural drift is: the Cartel opening should *really* be different, so it gets its own
quest file; then the Church one does; and now there are fourteen main quests to write,
fourteen to test, and fourteen to keep in sync forever — for a difference he explicitly
says is **not day and night**.

He closed that door on the same day he opened the feature. **Fourteen dressings on one
quest is a week of work. Fourteen quests is the rest of the year.**

### WHAT THIS MEANS FOR THE BUILD, CONCRETELY

- **One canon main quest.** No per-faction quest file, ever. No `S01_REDS.bq`.
- Faction difference is a **DRESSING LAYER** over shared content: where it is placed,
  what colours and marks are on the people, and variant lines inside the one script —
  which the .bq format already supports through `[gate: faction:X]` on an @OPT, with no
  format change and no second file.
- Gate: `entrance_scope_gate.py` fails if a per-faction fork of a canon quest appears.

## [PENDING PAOLO] — not decided, not guessed

1. **Are all fourteen available at the door, or a subset for Act 1?** Some are structurally
   odd as a starting home — CUSTOM has no ground yet by definition, and NETWORK is the
   Amalgamation's manufactured protection, which is a very different game to be born into.
3. **What "faction neighborhood housing" is architecturally** — a district type, a block
   inside their base district, or a house kind. That is world/city lane geometry.
4. **Whether the choice is visible to other factions from minute one** (do the Cartel know
   you were raised Blue?), which is a standing question, not a placement one.

---
*BOHEMIA — The Customizable Entrance — 8.12.26*
*The family is the same. The valley you open your eyes in is not.*
