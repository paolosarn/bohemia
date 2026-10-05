# WORDS [the fight's words] ROUND TWO -- the enemy kinds' names (words-8dqrnq, 10/5/26).
Rule 54b; taken as the stated fallback inside [the start screen's words] ("Hold until RUN's
row ships; if it has not, take [the fight's words] round two"). Checked: RUN [the start
screen] is still CLAIMED, four of five legs, not shipped; measured, not assumed (rule 12).
THIS FILE IS THE DELIVERABLE: it does not edit COMBAT's file (ONE SYSTEM, ONE SESSION, rule
55); COMBAT reads this and applies what it wants.

## WHAT IS ACTUALLY ON SCREEN, MEASURED NOT GUESSED
160 raw Battle Brothers enemies exist in records/target/bb/enemies.json, but only TEN have
real AI behaviour wired in records/target/bb/ai.json and are actually fieldable right now:
brigand_thug, lower_brigand_raider, brigand_raider, lower_brigand_marksman,
brigand_marksman, brigand_poacher, brigand_marauder, brigand_leader, wiederganger,
direwolf. slices/BOHEMIA_FIGHT.html line 424 shows the player
`r.name.replace(/^(Lower )?Brigand /, '').toUpperCase()` -- it strips "Brigand"/"Lower
Brigand" and uppercases whatever is left. So that is the WHOLE naming job right now: ten
words, not 160.

## THE ONE REAL FIND: A LEFTOVER FOREIGN WORD THAT ALSO BREAKS LOCKED CANON
"wiederganger" does not start with "Brigand," so the strip does nothing and the player sees
"WIEDERGANGER" on screen, raw. That is not just an unplain word (German for
"revenant/undead"), it actively contradicts a LOCKED ruling already on the books
(reference/library/grok/GROK_02_ROSTER_TRANSLATION_2026_09_30.md, his own words: "Wiedergangers
and fallen heroes. LOCKED this chat: a body with a chip still in it. Analog horror. Not
magic. Not an empty robot. The chip is why it gets back up."). A screen that says
"WIEDERGANGER" tells the player he is fighting literal undead; the locked ruling says he is
fighting a corpse with a medical implant that will not stay down, which is the whole point
of the reveal-engine law (every "supernatural" beat in this game is a real mechanism).
BEFORE: "WIEDERGANGER"
AFTER:  "CHIPPED"
WHY: one word, matches the locked mechanism directly (a body with a chip still in it), and
fits the register of the other nine names already on screen (THUG, RAIDER, MARKSMAN,
POACHER, MARAUDER, LEADER, DIREWOLF -- all one blunt word). No name for this enemy has been
proposed anywhere in the library yet; checked reference/library/grok/*.md first (GROK_02,
GROK_04, GROK_06, GROK_07, GROK_25, GROK_62 all use "wiederganger" or "zombies" as shorthand,
never a Bohemia word), so this is a real gap, not a duplicate.

## EVERYTHING ELSE, CHECKED AND LEFT ALONE OR NAMED, NOT FIXED
- DIREWOLF already matches locked canon (rule 42f: dire wolves are a real, named Bohemia
  beast, not a Battle Brothers leftover); no change needed.
- THUG, MARKSMAN, POACHER, MARAUDER, LEADER are plain English words that make sense for a
  valley gang right now; not wrong, just generic. Left alone rather than inventing a faction
  skin ahead of FACTIONS' own work, per STOP PRODUCING.
- lower_brigand_raider and brigand_raider both strip down to "RAIDER"; same for the two
  marksmen. Named, not fixed: this is a data question (should the weaker tier read
  differently), not a wording one, and it is COMBAT's/TUNING's call, not WORDS'.
- "THE BESTIARY'S LINES": no bestiary or codex screen exists anywhere in
  slices/BOHEMIA_FIGHT.html; there is nothing to read back. Said once, not invented.

## RULE 27 AND THE UNBUILT-RULE CHECK
Every one of these ten is a combat label, never a line the player speaks; no Spanglish
anywhere in them, which is correct (rule 27 only restricts the player). "CHIPPED" claims
nothing the data does not already do (the wiederganger's real get-up chance and headshot
kill are untouched; only the label changes).
