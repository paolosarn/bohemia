# BOHEMIA ADDENDUM: COMBAT LAB VERDICT RULINGS (Paolo 7/19/26)

Paolo's first pass on the BEAT TACTICS LAB landed as notes, not thumbs
(verbatim + deciphered: records/BOHEMIA_COMBAT_LAB_VERDICT_7_19_26.txt).
These are the rulings extracted from it, built the same turn. Where his
words left room, the build is a CANDIDATE, not canon — flagged per item.

## RULED (his words, built as said)

1. WEAPON-TYPED MELEE MOVEMENT (from A THE CONDUCTOR, "depending on the
   weapon they have they will move differently"). Melee enemies close on
   the player, and the WEAPON is the movement identity, not a damage
   number. Lab v2 candidates (mechanics mine, names/flavor his):
   - SHIV: fast — acts every beat, quick adjacent strike.
   - BAT: heavy — every 2nd beat, its hit knocks the player back a cell.
   - SPEAR: reach — keeps 2 distance, backs off if crowded, pokes a
     telegraphed 2-tile line after a windup.
   [CANDIDATE: the three archetypes + numbers are mine; the RULE that
   weapon drives movement is his.]

2. FORESIGHT IS A PERK (from B THE PROMISE, "maybe this could be a perk
   in the game where you see where Enemies will travel next"). Seeing
   enemy MOVEMENT intent is not the default game — it is a perk.
   CONVERGES with the 6/27 catalogued ability "see the enemy's next move
   / future enemy movement" (combat addendum, abilities section): the
   same power, now confirmed as the acquisition path for movement
   telegraphs. Attack telegraphs (windups, committed tiles) stay
   always-on — an attack is never a surprise; that is fairness, not
   foresight. Lab v2: FORESIGHT toggle, works in every mode.
   [RULED as direction; perk cost/slot = his later.]

3. THE SHOVE (from D, loved, with specifics):
   - CONTEXTUAL: an enemy directly next to you lights the option on the
     action button; tapping an adjacent enemy offers SHOVE or DIAL.
   - A shove ALWAYS stuns 1 turn ("guaranteed... just for one turn,
     which isn't really a lot").
   - CHANCE the target FALLS OVER (prone = helpless, easier dial;
     lab candidate odds: 30% open floor, 50% into a body, 65% into a
     wall, 100% into a burn barrel — seeded-deterministic roll).
   - PERK "IRON SHOULDER": guaranteed 2-turn stun ("they'll definitely
     be STONE for two terms if I have [it]").
   - NO-STUN-LOCK LAW still governs: a shoved enemy who has not had a
     full turn back gets pushed but not re-frozen (he BRACES).
   [RULED: contextual + stun 1 + fall chance + 2-turn perk. CANDIDATE:
   the odds table, prone duration (2), body/wall modifiers.]
   [FLAGGED, garbled: "or a different enemy character" — possibly
   enemy-type stun resistance. NOT built. PENDING Paolo.]

4. MORE RESEARCH ("Goodresearchprovidesomemore") — second pass ordered:
   enemy archetype/variety design + knockdown/stun design + contextual
   action UI + information-granting perks. Lands as
   BOHEMIA_ADDENDUM_ENEMY_ARCHETYPE_RESEARCH_7_19_26.md.

## NOT RULED (still open on the lab's thumbs)

- C THE DANCE: "kind of confused" — re-taught in v2 (live OPENED/SWIPED
  event labels, rewritten pitch). If it still confuses, it dies. No kill
  was issued; no thumb either.
- PACKAGE-AS-CURRENCY THESIS: no verdict. Still the open spine question.
- A/B/D thumbs proper: notes only so far; the lab keeps its thumbs.

## GATE

combat_lab_gate.js grew to 44 checks same turn: shove-always-stuns,
iron-shoulder 2, no-stun-lock-for-shoves, deterministic fall roll,
prone-is-helpless, weapon spawn + sigs, spear-telegraphs-before-damage,
perk UI presence, contextual choice, verdict record cited.
