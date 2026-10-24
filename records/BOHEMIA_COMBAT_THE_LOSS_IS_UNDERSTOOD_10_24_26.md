# COMBAT [the loss is understood] SHIPPED 10/24 (rule 143(b)(d)(e))

His words (10/24): "when everyone dies in a match it's kind of hard to understand... an enemy just kept dodging all of my
bullets, I don't know how we can make it clear visually that the enemy is superior... people died but they were still
speaking... if everyone dies you're still where you were before the battle, it feels clunky... spawn in the nearest town, a
mini side quest, your whole squad got wiped."

Opened by the coordinator (rule 112), no check-in, no card (rule 127). Commits: 95322af2 (the down), 8a7cca7b (the better
enemy), 04f90262 (the wipe, BUILD 10/24e).

## 1. THE DOWN DO NOT TALK (143(d))
MEASURED FIRST: the veteran's line was picked from a man on the field, but once up it typed and held for eight beats whoever
fell in the meantime. Now the line goes the moment its speaker is down, dead or gone (tickVet and teachNext check
`speaks(v)`), the shell is told BOHEMIA_VOICE_STOP {speaker} (for SOUNDS; harmless unheard), and no line starts from a man off
the field.

## 2. THE BETTER ENEMY READS (143(b))
HOW BATTLE BROTHERS DID IT: it never prints an enemy's level; you read his gear and learn it the hard way. Ours is quicker for
normies (rule 133), so the numbers are on the plate:
- LV n: Battle Brothers' own worth scale. Every enemy row carries an XP value on the same scale as "XP value of a brother is
  100 + 30 * (his level - 1)" (bb_all/1316_Morale.txt), so LV = 1 + (xp - 100) / 30: a thug LV 3, a raider LV 6, a marauder
  LV 8, a leader LV 10, against a new crew at LV 1 to 3.
- DODGES nn%: the best man of yours still standing, his skill against this man's defence alone (the wiki's soft cap over 50,
  the 5-to-95 clamp), hits him ours.outclass.dodge_chance_at_most (40) in 100 or less.
- ARMOUR n: the arm of yours that drops him fastest needs blows_at_least (5) blows or more.
- OUTCLASSES YOU: three levels over the best man of yours standing, or both marks at once. Three red chevrons over his head
  from the moment he is seen (the line set included, the top one blinking on the beat), the words first on the plate (#cls,
  under the bars) whenever the bar shows him, and first on the aim receipt ("This one outclasses you. LV 8 · DODGES 61% ·
  ARMOUR 240.").
- A DODGE SHOWS AS A DODGE: a missed shot or blow throws the man aside on the board (half a beat, away from the attacker) and
  the receipt tag turns DODGED (COVER when the round went into the piece he stands behind).
Numbers in records/target/bb/ours.json `outclass` (tuned:false, for TUNING).

## 3. THE WIPE IS AN EVENT (143(e))
A wipe is a fight lost with YOU down (if YOU ran it is a retreat, rule 144(c), never a wipe). Before the recap: the board drains
to grey like a tape on STOP (a VCR's "■ STOP" in the corner), YOUR WHOLE CREW IS DOWN, then a line a beat: who keeps the field;
the man of theirs who outclassed you ("Leader outclassed you: LV 10 against your best, LV 1."), dodged you ("Marauder dodged 3 of
your 5 shots."), or wore too much ("Leader wore 396 armour. Your best arm needed 9 hits."); how many dead and down; and what
comes next ("Somebody drags you to the nearest town. The road crew have your men and your gear."). Held three beats, then the
recap WIPED OUT with the same words. Nobody speaks in it (they are all down).
Home: BOHEMIA_FIGHT_OVER {wipe:true, wipeInfo} and BOHEMIA_COMBAT_END {newFight, wipe:true, wipeInfo, fates}. MEASURED: the
shell's COMBAT_END branch is the frozen fight's settle and would call cityFightHome at once (off the recap, and leaving the
rebuilt fight's frame up because nfHome then returns early). COMBAT's marked guard __THE_WIPE_RIDES_HOME__ (the patch
tools/bohemia_combat_the_wipe_rides_home_patch.py) answers a newFight end by setting NF.over.wipe / wipeInfo / fates, so the one
door home (nfHome -> cityFightHome -> BOHEMIA_CITY_COMBAT_END {outcome}) carries it to RUN's map. The message shape is in RUN's
NOTE on the board.

## GATES
THE LOSS IS UNDERSTOOD 15/0 (new, registered). On the final tree: THE FIRST FIGHT TEACHES 10/0, SOURCED NUMBERS 10/0, SAYS WHAT
IS WEAK 10/0, ONE TAP 16/0, RELOAD 17/0, TURN ENDS 8/0, EVERY FIGHT HANDS HIM BACK 9/0, NARRATOR 8/0, DEMO BUILD green (the cut
--check green). Full suite unmeasured (rule 13).

## FOR
- RUN: the nearest town and the side quest read outcome.wipe / wipeInfo on BOHEMIA_CITY_COMBAT_END (NOTE on your board).
- SOUNDS: BOHEMIA_SFX 'wipe' {side, by} at the STOP beat wants a tape-stop of its own; BOHEMIA_VOICE_STOP {speaker} when a
  speaker falls mid-line.
- TUNING: ours.outclass (level_gap 3, dodge 40, blows 5) and ours.wipe (a line a beat, held 3) are drafts.
- WORDS: CLASS_SAYS, WIPE_SAYS, THEY_ARE are drafts (draft:true).

[bb]: Battle Brothers teaches a loss by losing; its enemies show no level, only gear. We show the level on its own worth
scale, so a loss is a lesson and not a mystery.
ANALOG HORROR: the wipe is a tape stopped on the last frame, grey, the VCR's STOP in the corner, the words typed over it.
