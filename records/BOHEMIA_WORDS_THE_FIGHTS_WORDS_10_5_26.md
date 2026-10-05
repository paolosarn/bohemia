# WORDS [the fight's words] -- ONE ROUND (words-8dqrnq, 10/5/26). Rule 54b/74.
Every word the new fight shows, read aloud. THIS FILE IS THE DELIVERABLE: it does not edit
COMBAT's own file (ONE SYSTEM, ONE SESSION, rule 55); COMBAT reads this and applies what it
wants.

## WHAT I CHECKED, AND AGAINST WHAT
Every one of the 50 perk names and skins (records/target/bb/perk_translation.json) checked
against the REAL Battle Brothers effect it is drawn from (records/target/bb/perks.json),
not against the vibe of the sentence. The seven skill buttons (FIGHT.ACTIVE in
slices/BOHEMIA_FIGHT.html) turned out to BE seven of the fifty perks already checked, so
they are not a second review, just named here. The injury names, the recap's every line,
and the night line, read on the real file.

## THREE REAL FIXES IN THE FIFTY PERKS
Most of the fifty already compress a multi-part Battle Brothers effect down to its single
best number, on purpose, and that is fine; a one-line skin was never going to carry all of
it. These three are not compression, they are a reader coming away with the WRONG idea of
what the perk does.

1. NATURAL (id gifted; Battle Brothers' "Gifted").
   BEFORE: "one level-up at the top of every roll"
   AFTER:  "one level-up, right now, every roll maxed"
   WHY: the real effect is ONE instant level-up with every stat rolled at its best, a single
   one-time bonus. "every roll" reads as a standing passive that improves every future
   level-up forever, which is backwards; a player who reads it that way will be confused the
   moment it never fires again.

2. PILE ON (id backstabber; Battle Brothers' "Backstabber").
   BEFORE: "every friend on his man counts double"
   AFTER:  "a friend fighting him too doubles your chance to land a hit"
   WHY: the real effect is a melee hit-chance bonus, doubled, that only turns on once two
   allies are next to the same target. "every friend on his man counts double" never says
   hit chance, never says it needs two allies, and "counts double" alone could mean damage,
   loot, anything.

3. RIFLE WORK (id crossbow_mastery; Battle Brothers' "Crossbow and Firearms Mastery").
   BEFORE: "the rifle bites through a fifth more armour; the shotgun reloads at 6"
   AFTER:  "the rifle bites through a fifth more armour; the shotgun fires every turn now,
   not every other"
   WHY: the real upgrade for the shotgun side is that it used to reload every OTHER turn and
   now fires every turn, which is the whole point of the perk; "reloads at 6" is a bare
   number nobody can compare to anything, so the actual improvement never reaches the
   player. The armour clause was already right and is kept.

## THE INJURY LINE: NOT WIRED YET, A PROPOSAL INSTEAD OF A FIX
reference/library/grok/GROK_49_ONE_PAIN_2026_10_02.md (VIA GROK, passed filter): "do not make
a different hurt name for neck, head, arm, leg, and chest... the player sees one pain line."
Checked the real file: it is not built yet. slices/BOHEMIA_FIGHT.html line ~1814 still shows
the raw Battle Brothers injury names straight from records/target/bb/injuries.json (`Broken
Arm`, `Dislocated Shoulder`, `Crushed Windpipe`, 59 different names across the whole table),
one stranger-unfriendly medical word per injury, exactly what GROK_49 said not to do.
PROPOSED (draft:true, for whoever wires this): one line, every temporary injury, body part
separate and small:
    Hurt: Laid up (arm)
"Laid up" reuses the word the recap already uses for the same state (LAID UP Nd) rather than
inventing a second word for one idea. Not a fix because there is nothing live to fix; said
here so it is not lost.

## THE RECAP: TWO FIXES FROM LAST ROUND, STILL NOT APPLIED, CARRIED FORWARD
Checked the real file again; neither has landed, so both are repeated here rather than
assumed done (records/BOHEMIA_WORDS_THE_DEMOS_LINES_10_4_26.md had these first).
- "THE ROAD CREW BROKE" (the win header) -> "THE ROAD CREW RAN". Battle Brothers' own word
  for a routed enemy, but a player who just WON can read "broke" as his own crew breaking,
  on the one screen where that misread costs the most.
- "LAID UP 14D" -> "LAID UP 14 DAYS". A number jammed against one bare letter reads as a
  typo before it reads as a unit.
Everything else in the recap (WHO/KILLS/BLOOD/TAKEN/XP, DOWN UP AFTER, DEAD, the rounds and
minutes line) already reads plain and is left alone; BLOOD stays BLOOD, his own word for the
column ("blood drawn, kills, experience," rule 67), not a words problem.

## THE NIGHT LINE: ALREADY AS PLAIN AS IT GETS
"R3 NIGHT" (round number plus NIGHT when it is one). Three characters and a word; nothing to
cut.

## THE SEVEN SKILL BUTTONS: ALREADY COVERED ABOVE, NAMED HERE SO NONE ARE SKIPPED
adrenaline (FIRST OUT THE DOOR), recover (CATCH YOUR BREATH), rotation (SWAP OUT),
rally_the_troops (ON ME), taunt (COME AT ME), footwork (SIDESTEP), indomitable (IMMOVABLE).
All seven checked against their real Battle Brothers effect in the perk sweep above; none
needed a change. STRIKE and RELOAD, the two fixed buttons beside them, are one word each
and already as plain as a button gets.

## RULE 27 AND THE UNBUILT-RULE CHECK
No player-facing line in the fight anywhere speaks Spanglish (the fight has no NPC mouths to
carry it, only the player's own UI). Nothing in the fifty perks, the skills, or the recap
promises a mechanic that is not wired; the one soft spot is the injury line above, which is
flagged as unwired rather than written as if it already works.
