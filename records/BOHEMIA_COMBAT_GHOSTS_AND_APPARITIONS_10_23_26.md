# COMBAT 10/23: GHOSTS AND APPARITIONS (row [ghosts and apparitions], rule 134)

## HIS WORDS
"Like in Battle Brothers, one of the enemies are ghosts and apparitions; I think we can put that in, it fits our world too good; maybe they're way more around for the first act than the third act; there's gonna be enemy types around more in different acts than another, that's just how it is."

## WHAT THEY ARE (rule 134(e), his 7/24 canon)
In act one the ghosts are the Amalgamation's haunting as act one sees it: the dead who came back are its generative data-portraits, the scream is its broadcast. Nobody in act one knows it is a machine, so they are ghosts. Purple is its wordless tell. A ghost is not a beast (rule 42a untouched).

## MEASURED FIRST
- The library has the Geist whole: records/target/bb/enemies.json geist (1 hitpoint, resolve 130, melee defence 30, ranged defence 999, initiative 95, 9 AP, immune to morale, fatigue, injuries; Ghastly Touch, Horrific Scream, Incorporeal; 'Graveyards sometimes have nothing but a lot of Geists guarding them'; 'Ranged weapons are almost useless'), Ghastly Touch's page already copied into beast_attacks.json (15-25 through any armour), and the three skill pages (Horrific Scream: 6 AP, 0 fatigue, 'resolve-checks with a range of 3 tiles', 'four morale checks with no modifier'; Incorporeal: '+10 Melee Defense and +10 Ranged Defense for each tile range away from a Geist (active at range 2+)').
- The fight had no ghost: no scream, no Incorporeal, morale immunity never read, and no enemy faction but brigands and beasts.

## WHAT SHIPPED
1. records/target/bb/racial_skills.json: the Geist's three racial skills, each with its page and its own words.
2. THE GEIST IN THE FIGHT (slices/BOHEMIA_FIGHT.html): its row as it stands, named GHOST (draft for WORDS); a party of them (ours.enemy_tiers ghosts); the wiki's morale immunity honoured (a Geist never wavers; none of the kinds fielded before carries it, so nothing else changes).
3. INCORPOREAL: +10 melee and ranged defence a tile from two tiles out; with its ranged defence of 999 a shot lands at the cap's floor (5%). Battle Brothers' lesson stands: walk up and hit it.
4. HORRIFIC SCREAM: from inside three tiles, 6 AP, four morale checks with no modifier on one man; never at a man already fleeing.
5. THROUGH WALLS (rule 134(a)): a Geist walks through a house; it never stands in one.
6. THE BRAINS (ai.json screamer, from the Geist page): it screams at the weakest nerve in reach; with nobody in reach it drifts to where its scream reaches, out of arm's length; with everybody in reach fleeing it touches. One blow that lands ends it.
7. THE TAPE (the look): the man's own rig picture played off a dead tape: rows torn sideways on the sixteenth, every other line gone, a cold grey wash, a purple and a cyan copy a pixel either side (the Amalgamation's tell), dropping out on some sixteenths; its face in the turn strip on the same tape; a dead ghost's signal goes after its fall, no body. ANIMATION and COOK's own ghost through the rig goes under the tape the day it lands.
8. THE SCREAM IS HEARD: his approved tape_pull (the tape dragged through the heads) until SOUNDS makes a scream of its own.
9. THE ACTS (ours.act_weights, rule 134(b)): every kind the fight fields carries a weight for each act; Geists 3 in act one, 1 in act two, 0.25 in act three (draft numbers, TUNING's); the fight multiplies a party's mix by the act it is told (FIGHT_OPTS.act, act one when none).

## THE NUMBERS (gate GHOSTS AND APPARITIONS 11/0)
- A blow on a Geist: 31% beside it, 11% at two tiles, 5% at four; a shot from four tiles 5%.
- One scream on a man with no nerve: Steady -> Wavering -> Breaking -> Fleeing.
- A house three tiles tall: for the AP of two steps the Geist is on the far side; a man cannot get there.
- Twenty fights, the company against four Geists, AUTO: all twenty end, all twenty won (rule 117), 48 screams, 31 men broken; their guns hit 16 shots in 240.
- A party that may hold a Geist: 77% Geists in act one, 21% in act three.

## [bb the geist]
Battle Brothers' Geist fights your nerve, not your armour: it hangs a few tiles back and screams until men break, and the answer is a rally and a man who walks up and hits it once. Ours keeps that lesson; the guns that win every other fight (rule 120a) do not win this one.

## THE ANALOG HORROR LINE
A dead man's face played off a tape that is being chewed: the picture tears sideways on the beat, the lines drop out, purple bleeds at the edge, and the scream is the tape itself.

## FOR THE MAP (RUN, WORLD)
- A ghost party is party.faction 'ghosts' (the map's door already hands the party to the fight). The place full of them is the graveyard: the cemetery district.
- How often they walk is ours.act_weights by the act the map is in; hand the act as party.act or FIGHT_OPTS.act.

## NOT BUILT
- The Rachegeist (the boss who comes back as a ghost and calls ten): the library has him; a place and a boss for a later round.
- Waiting for a rally to break a man again (the Geist page's 'wait if someone is fleeing'): it touches instead.
- The ghost's own sound and its own rig model (SOUNDS; ANIMATION and COOK).
