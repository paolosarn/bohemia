# FOUR FACTIONS WITH A FACE, A WANT AND A HOME
FACTIONS lane, rows [the parties on the map] and [a house you give a fuck about] (rule 80c). 10/9/26. MODE: BUILD, data + pure module + gate + one VOTE page. Nothing in the alpha changed.

## Built
- records/target/bb/factions.json: road crews (brigands), the house (noble_houses), the dead and their keeper (zombies), the lab-made beasts. Each has a banner, a draft make-up of real enemies.json ids, home grounds, a behaviour, a FACE slot, a draft one-line voice, ONE WANT, a BASE and a beef-driven MEMORY (relation bands).
- engine/bohemia_factions.js: pure reader (byGround, card, countWord, mixFor, memoryLine).
- gates/factions_gate.js (suite: FACTIONS): 134 checks, red 23 ways. Mutations were run from a scratch script; none silent.
- VOTE: "FOUR FACTIONS WITH A FACE" (slices/vote/FACTIONS_A_HOUSE_YOU_CARE_ABOUT_10_9.html).

## What is sourced and what is ours
- Behaviours: noble caravans (bb_all/1430_Noble Houses.txt: "They send Supply Caravans, guarded by their troops."), beasts roam (0224_Beasts.txt: "Various wild beasts roam the lands."), brigand early make-up (ours.json enemy_tiers). The dead's raid is OURS (the wiki gives only the faction).
- OURS, marked in the file: the banner inks (orange #ff6a00, cyan #3db8f5, mint #7affb6; the three furthest from every shipped faction colour), the noble/dead/beast make-ups (COMBAT's enemy_tiers owns the real mix), the wants (the house wants the depot and the crew the freeway are his words in the row; the dead and beast wants are mine), the voice lines (draft).
- Honest gaps: faces are slots (portrait:null), no dead or beast art exists, the house keeps its canon colour.

## Better than Battle Brothers (rule 80)
BB's houses are a flag and a relation number. Ours each want something the valley can see and remember what you did. Line added to records/BOHEMIA_BETTER_THAN_BATTLE_BROTHERS_10_9_26.md (item 9). Lanes cannot add board rows: coordinator, please add a [better than bb] line for FACTIONS.

## Routed
- RUN: read factions.json for the map party card (banner + count word), ground -> faction, drop-destination lines (rule 56).
- COMBAT: mix by faction, a leader field, gearless beasts, ai kinds for house units.
- PEOPLE/PORTRAIT/WORDS: the four face slots and real lines. SOUNDS: the beast's sound.
- WORLD: the grounds named here must exist on the map. RUN TWO: trait roll and beef bands drive memory.
- Still owed on [a house you give a fuck about]: the board's man and the bar's talk (needs [beef] and PORTRAIT).
