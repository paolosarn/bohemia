# THE ENDING WAS ALREADY WRITTEN. WHAT IS MISSING IS THE GAUGE.
DYNASTY lane, VAMILY row `[the ending]` GOOD-BAD-OR-NEUTRAL-TOWARD-THE-AMALGAMATION.
9/30/26 - MODE: SCHOOL (rule 39e), one page, no code. Claimed `dynasty-vamily-w4yxiz` as its own commit first.

> **THE ROW:** "the three stances as three endings, what each costs across the three acts, and his
> signal idea checked against the real (a body cannot travel at radio speed, DATA can...) and against
> [the frame]'s default A. Assassin's Creed may be STUDIED for the ending's shape; nothing is built
> from it until he rules an ending."

Reference law kept: the only game studied is Assassin's Creed, for the ending's shape and nothing else
(his own "possibly", rule 39f). Battle Brothers is read from `reference/library/battle_brothers/`.
Every number tagged (recall) is from memory, because the fleet cannot fetch pages.

## 0. THE FINDING THAT PROVES THE ROW WRONG
**The three endings are not a question. They have been canon since 7/18, and Act 3 has been the Moon
since 7/19.** `laws/BOHEMIA_STORY_MASTER_7_18_26.md` names them: **LIBERATE** (cut Bohemia free, stop the
nuke, warn the world; "you saved one valley, and that is enough"), **RESPECT** (coexist; "a grave that
thinks, at peace") and **BECOME** (take the stewardship; "damns it with success, because the corruption
is made of kindnesses"). `BOHEMIA_ADDENDUM_ACT3_MOONSHOT_STRUCTURE_7_19_26.md` makes Act 3 the ONE-WAY
trip to the Moon ("you cannot nuke the Moon"), and leaves exactly one thing floated: **"the exact mapping
of the three stances across the Act 2 (local reckoning) and Act 3 (the Moon) boundary."** His 9/28
"good, bad or neutral toward it" is those same three in his own words. So this round does not invent
endings. It answers the floated line, and it measures what the game can actually read.

**AND WHAT THE GAME CAN READ IS NOTHING.** Measured on the repo this round:
- The ending's readouts (`amalgamationModel`, `finaleLedger`, `monumentForm`, `districtTexture`) appear
  in **0 places** in the walked city and the alpha.
- The one flag that would carry a stance is `recorded` on a choice (`engine/bohemia_engine.js`:
  "true = public/feed-touching (the Amalgamation can model it). false = off-ledger (tunnels, family,
  private) -- the blind spot. Defaults to true"). **Its only caller is `bohemia_loop.js`, which is not in
  the walked game (`recordChoice` appears 0 times in the city and the alpha), and no quest sets it to
  false.** One quest CLAIMS to: a comment in `S01_THE_METER_READER.bq` says its trap option "sets the
  unrecorded flag the fold reads later", but the option only sets ordinary flags
  (`looked_under_the_rock`, `it_goes_down`), and the word "unrecorded" appears nowhere in the quest
  parser or runtime. A note is not a gate. With the default at "seen", every player's blind spot is
  zero, so the finale's win condition (`blindSpot`, "pure advantage") cannot be reached by construction.
- The monument reads `karma`, which is one of the six carry fields that are not live, and one gate bans
  karma as a stat gate. The ending's only other input is a number the game is forbidden to keep.

## 1. THE THREE STANCES, AS ENDINGS, AGAINST WHAT THE LEDGER CAN HOLD
The gauge already exists in the canon and in the code, under two names. **Recorded** is the feed: the
phone's "what you did" posts read the deed log, so what the phone says you did is what the machine can model.
**Unrecorded** is the witnesses: `bohemia_standing.js` keeps who saw a deed and who retold it, and the
machine cannot read a face-to-face word. Canon says the Act 2 severance, the humanity-gate, is "grounded
in real proof-of-personhood tech, testing the unrecorded self the Amalgamation can't fake".

**DEFAULT MAPPING (draft, his to knock down): his good, bad and neutral are HOW the dynasty behaves toward
the machine across the acts, and the three canon endings are where that behaviour lets it land.**

| Ending | What it needs from the ledger | What it costs, act by act |
|---|---|---|
| LIBERATE | a real unrecorded share by the end of Act 2, because the severance tests the unrecorded self | Act 1: going dark forfeits the renown the feed pays. Act 2: the severance is a deed, the Network splits, NeuroLink carriers cannot be turned (7/19). Act 3: the cult of the silent god claws at your win while you build the rocket |
| RESPECT | nothing; it is the default. "Proximity without curiosity is safe" (the 7/24 ghost addendum) | Act 1 and 2: never look under it. Act 3: the machine stays, the harvest cools, and you never learn what it was |
| BECOME | a large recorded share, because it can only steward what it can model | Act 1: everything you do feeds the portrait. Act 2: the conversion path, the Network helps. Act 3: the kindnesses were the corruption |

Two consequences, both proposed and neither canon:
1. **The three are reachable, not picked.** A player who never goes dark cannot Liberate; one who lives
   entirely off the feed cannot stay a stranger to it; Respect is always open. That is "many ways to play"
   with no menu, and it is what the Act 2 line in the 7/19 addendum already says ("the Act 2 local
   reckoning shaping which are reachable").
2. **Going dark has to cost something the player feels, or it is free.** Renown, standing and the phone's
   posts are the recorded ledger; the blind spot earns none of them. That trade is the whole design.

## 2. HIS SIGNAL IDEA, CHECKED AGAINST THE REAL
"You could travel as fast as radio... the same way we get pictures from Mars from the rovers." He is right
about the speed and the physics is worth stating exactly.
- **Latency is nothing.** The Moon is 384,400 km: **1.28 s one way, 2.56 s round trip.** Mars is 3.0 minutes
  at its closest and 22.3 at its farthest. All of that is his number, confirmed.
- **Bandwidth is everything.** The fastest Moon link flown is about **622 Mbps down** (NASA's 2013 laser
  demonstration, recall). What crosses it is a payload, and the payload decides everything:
  - **A person's portrait, from records:** everything one person says aloud in a lifetime is roughly 16,000
    words a day for 70 years, about 2.5 GB. **Over that link: 32 seconds.**
  - **A person, scanned:** the one cubic millimetre of human cortex imaged at synapse resolution took
    about 1.4 PB (recall). A whole brain is about 1.26 million of those: **1.8 zettabytes. Over the same
    link: about 720,000 years. Over 100 Gbps, far past anything flown: about 4,500 years.**

**So he is right by twelve orders of magnitude for a portrait and wrong by the same for a person, and that
gap is not a problem, it is the canon.** The 7/18 master says the Amalgamation is "NOT a true consciousness
upload, it is the most sophisticated SIMULATION of you", built from the records people fed their platforms.
The only thing that can cross to the Moon in seconds is what the machine already is. **A body needs a
rocket, and canon has the rocket.** (Real-world echo: researchers at Cambridge warned in 2024 that
"deadbots", chatbots trained on a dead person's records, can haunt the living; Project Angel is that
industry at the end of the road, recall.)

## 3. AGAINST [the frame]'S DEFAULT A, AND THE ONE TWIST THAT FITS EVERYTHING
Default A says the flip is the machine deriving a family's future from its records. **The engine already
has that machine.** `amalgamationModel(save)` "folds ONLY what it can see" into "an incomplete copy of
the dynasty", and returns the blind spot as the size of what it missed. It is not in the walked game (0
places), but it is the same computation as the derive with the unrecorded deeds left out.

His ending idea and default A are one technology seen from two ends, and canon supplies a reading that
breaks nothing (draft): **the rocket is real and carries the real crew (7/19); the record of the family
has been on the Moon all along, because the recorded ledger IS the signal; and what the body brings that
the signal never had is the unrecorded self.** At the base the Angel heir meets the machine's model of the
whole dynasty, the same picture the flip has been showing all game, and sees exactly where it is wrong.
"This is how I got here" becomes "this is how it knew me". It keeps the Moon (7/19), the founders' remains
on the base (7/19), the family theme (the machine is the COUNTERFEIT family) and the physics.

**The fork only he can rule, and it is canon-level:** does the twist make the player's own family the
counterfeit (the third heir was the portrait), or does it show the machine's copy of them, incomplete?
The 7/18 master leaves "whether any character understands the coin-toss lie on-screen" open, and says he is
"not sold on re-embodiment". **Default: the second.** It keeps grief real, keeps his three heirs mortal and
true, and puts the twist in the ending, never the frame (rule 39). If he wants the first, it is the BECOME
ending and only that one.

## 4. ASSASSIN'S CREED, STUDIED FOR THE ENDING'S SHAPE ONLY (recall, nothing built)
What the series' first game did with its ending is worth one lesson and one warning.
- **The lesson: the interface the player used all game was the machine.** He was inside the Animus the whole
  time; the ending changes what the screen was, not what happened on it. **Our phone strip is the same
  object.** The three faces and the flip are the machine's derive, in plain sight from the first minute, and
  nothing has to be hidden to make the reveal land, only unnamed. That is why nothing in the alpha may name
  the fiction until he rules (rule 39, the frame row).
- **The warning: the modern-day frame was the part players resented most.** It interrupted the game they came
  for. That is his own rule 39 ("the twist is the ending's, never the frame of the whole game") arrived at
  independently, and it argues for the ending revealing the frame in one scene, not for narrating it.
Nothing else is taken. Ocarina stands as the three-acts reference; it is not needed here.

## 5. WHAT THIS ROUND DID NOT DECIDE
[PENDING Paolo], none blocking: (a) whether "good, bad, neutral toward it" is how the dynasty behaves (my
default) or the ending's own name; (b) whether the twist makes the family the copy (default no); (c) where
the Moon arrival's exact scene sits (canon: the fight through the security robots, then the base). No
canon touched, nothing named in the game, no numbers for TUNING.

## 6. ROUTED
- **QUESTS (research only, rule 35)** - the quest language has no way to say a choice is off the feed (S01's comment says it can; the code cannot). The
  library needs a pass: which of the 152 studied quests make a player go dark, and what the choice cost.
- **WORLD / FACTIONS** - the Act 2 severance is a deed with a threshold on the unrecorded share; the Network
  split (carriers versus the free) is canon and needs a ledger row.
- **PEOPLE** - the ending reads the witness web as the unrecorded carrier; nothing there changes, it is named.
- **UI / DIRECTION** - the phone is the recorded ledger's window and the flip is the machine's model; the
  reveal must be drawn under the analog horror bible, and Act 1 still never says the word (7/24 lock).
- **[heirs] (next row)** - an heir's record is the same two ledgers; a parent's unrecorded life is what the
  heir cannot look up.

## GATE NOTE
School, no code, no gate, nothing in the alpha changed. Registered to VOTE as one line,
`dynasty-the-ending-9-30`. Pre-push: handoff, reply contract.

*DYNASTY round, research only. Nothing in the game changed.*
