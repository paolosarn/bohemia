# QUESTS ROUND ONE UNDER RULE 35: THE FIRST SHELF (quests-dvybth, 9/27/26)
# Research only (Paolo 9/27: "I don't want a single thing from the quest chat implemented"). Nothing built.
# At volume (rule 35b): all eight questions in one round, not one.

## WHAT EXISTS NOW
- 8 research pages in questbook/research/ (QR-A to QR-H), one per question on the QUESTS board.
- 48 designs in questbook/designs/, filed by shelf: act1 16, act2 13, act3 11, across 8.
  By kind: contracts, events, main beats, across-acts. By economy: boom 16, bust 20, either 12.
  By crisis: none 26, the Destroyers 6, the Network crumbling 6, the rocket 6, the whisper broadcast and
  the earth-side nuke 4. The four views are questbook/designs/INDEX.md (tools/quests_designs_index.py).
- 56 files, about 72,000 words, 1,220 distinct finding ids cited from 151 of the 152 studies.
  Every id resolves in records/BOHEMIA_QUESTBOOK_LAW_INDEX.json. Zero invented.
- gates/quests_library_gate.js (QUESTS LIBRARY in the suite): 88 pass 0 fail. It proves every id resolves,
  every page cites >= 40 ids from >= 20 studies, every design carries its shelf header and draft:true and
  sits on the shelf its ACT names, INDEX.md is current, no em dash; three negative controls. It caught a
  real misfiled design on its first run (B08: "3, reads the act 1 ledger" read as across), fixed in the gate.

## THE EIGHT PAGES, ONE LINE EACH
- QR-A CONTRACTS AND THE FREE NO. The library's best no costs nothing and never expires (Q126.W3, Q126.N13,
  Q131.N1); its most repeated flaw is the punished no (Q084.X5, Q075.X4, Q103.X1). Blind spot 8 resolves:
  the world records only what HAPPENED (a contract taken, finished, failed, dropped); the test is that the
  world's record is identical whether he declined or never met the client. "Once taken you finish it" is
  not a lock: dropping is only in the world (face to face, or a spoken deadline passing), never a quit
  button, and costs four proportionate things (harm lands on the client, the client stops offering, an
  advance becomes a debt, rumour). Failing while trying is not dropping (Q114.W3, Q148.P3).
- QR-B EVENTS ON THE ROAD. Ten event shapes (the one on the shoulder, the toll, the tracks at the fork, the
  quarrel in the company, the trader with one good thing, the brownout while you pass, the people walking
  the other way, the one who knows you, the bill comes due, the good hour). An event has a cause you can
  see on the map, never a dice roll (Q044.W2, Q044.X1). Prices shown before the pick, the kind option never
  also the one that pays, never graded (Q107.W7, Q126.X2). At most one per trip, a face fires once,
  "keep moving" is always a free choice (Q066.X1, Q151.W7).
- QR-C THE TWIST BANK. 30 twists sorted by cost (nothing, time, batteries, standing, a person). MOST
  CONTRACTS HAVE NO TWIST: a twist that is expected is dead (Q148.X3); about 1 in 4, drawn by the sim
  (the number is ours, the library gives none). The fee locks at the offer, before the truth (Q148.W1),
  which is what makes the free no mechanical. A twist changes what finishing means, never whether you can
  (Q148.W9). A twist that proves the client lied voids the contract with no deed (OPEN, PEOPLE tests it).
- QR-D PLANTED IN ONE ACT, PAID IN ANOTHER. The flip turns the Whispering Hillock inside out: the player
  can see the landing before the plant. The weight survives if the past can be ADDED TO but never undone:
  going back writes a second "answering" deed with its own price (Q126.P35, Q004.W8, Q144.P5). Fairness is
  one line: a secret is fair if the player can find out (Q116.X2): every across-acts quest declares its
  plant, a landing visible from the map, and at most two clues back (Q147.P2). Promises cross the ages as
  named people or things, never as batteries (Q145.P5).
- QR-E THE ASK IN A PLACE. The place speaks first, the person second (Q114.N1, Q013.W6): a job starts as
  something visibly odd in an ordinary place. The person is seen DOING something before they talk
  (Q095.W3). What they hold back is the why and the risk, never the terms (Q003.N1, Q152.W1). 14 first-line
  patterns, 14 places that ask, and an 8-step shape for the ask on the close street.
- QR-F THE FIRST SIXTY SECONDS. Silence has to be DENSE: the worst openings are silent and empty
  (Q055.X1, Q087.X3), the best put the game in the space (Q099.W4). A second-by-second budget: 0-10 s the
  cell and the thumb, 10-30 s the block and the first thing, 30-60 s one silent choice, 60-180 s the world
  speaks in order. Things may block the eye, people may never block the feet (Q126.W4, Q140.W8). The first
  choice is small and silent and comes back later as a thing (Q143.W8, Q128.X2).
- QR-G WHAT THE FLAWS FORBID ON A PHONE. All 693 flaws sorted into 30 families (the appendix places every
  one). Only 4 are about phones at all; the phone hurts by making INVISIBLE things worse (silent fail,
  hidden clocks, order traps, wiki-required, state you cannot read back: 110 flaws, 16%). Size is a phone
  rule: a contract gets one leg, one block, three ways in. THE CHECKLIST: 28 yes/no questions a builder
  answers before shipping any event or contract, each citing its X ids.
- QR-H THE MAIN LINE WHEN THE REST IS CONTRACTS. The theme cannot live in contracts, because declining is
  free and meaning in optional content is missed (Q104.X3, Q092.X5): the family thesis sits on the ONE main
  line. It pulls by waiting, not clocks (Q126.W3, Q114.N2); the Amalgamation's own rule (danger rises only
  when you look) is the pacing device (Q085.W8). Contracts are ballots, never tolls: the finale reads the
  side work back as a roll call (Q136.W2, Q006.W2); the whisper network is made of the contracts the family
  finished face to face.

## WHERE ALL EIGHT AGREE (the rules any builder can take today)
1. The fee is spoken and locked before the yes, and never moves after it (A, C, E, G).
2. A no writes nothing, anywhere. Not a face, not a line, not a flag (A, E, G, H).
3. Dropping a taken contract happens in the world, never through a button, and is the only deed (A, E, G).
4. Every consequence has a tell you can see (a place, a person, a feed post), because nothing pops up (B, D, F, G).
5. One open contract at a time next to the main quest is the default (A; G leaves the cap to PEOPLE and RUN).

## FLAGS FOR THE BUILDING LANES (found in the bank, not decided here)
- RUN / ECONOMY: engine/bohemia_haggle.js writes a DEED when a haggle is pushed too far and the offer is
  withdrawn. A pushed haggle is not a contract taken, so under rule 35c it should write nothing. Suggested:
  keep the withdrawal, drop the deed (QR-E OPEN 1).
- WORDS: the spoken "no" replies in engine/bohemia_ask_spoken.js ("Yeah. Everybody's busy.", "Fine. It's
  been off this long.") read as a hurt face. Rule 35c: flat (QR-E rule 11).
- RUN / DYNASTY: the 7/19 cold open (the raid as the tutorial) and 7/24 THE KNOCK predate rule 32a. QR-F
  keeps the content and drops the timing: the game opens on the raid's AFTERMATH (QD-F01). QR-H flags the
  same clash.
- PEOPLE: the void rule (a twist that proves the client lied releases the player with no deed) is untested
  (QR-C). The open-contract cap is unmeasured (QR-G).
- THE LIBRARY HAS NO BATTLE BROTHERS STUDY. The blind-spots claim that BB docks relations for a refused
  contract is neither confirmed nor refuted by the 152 (QR-A OPEN).

## [PENDING Paolo] ONE GENUINE FORK (QR-G OPEN 1, QR-A)
"Once you take it you finish it": if, inside a taken contract, he refuses the ugly part and pays for it
(the client is let down, he keeps his hands clean), is that FINISHING the contract or DROPPING it? The
library's default (Q139.P2, Q131.X7) is that a priced refusal counts as finishing. Built that way until he
says otherwise.
