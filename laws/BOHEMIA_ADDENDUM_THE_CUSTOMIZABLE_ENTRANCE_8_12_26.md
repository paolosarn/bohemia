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
