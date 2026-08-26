# HOW TO STUDY A GAME'S INTERFACE, AND ROUND ONE: FINAL FANTASY X
# 8/26/26 · UI lane · TAB: UI, second view ("WHAT FF10 TAUGHT US")

Paolo 8/26: *"I need you to do big brain research on how to do big brain research
on studying other games UI for one round. And then the first basis of all of this
is gonna be Final Fantasy ten, my favorite UI of all time."*

He asked for the **METHOD** first and the **SUBJECT** second, in that order, and
that order is the whole design of this turn. "How to do the research" is a request
for an instrument. "Final Fantasy X" is round one through it.

---

## 1. WHY THIS IS A MACHINE AND NOT AN ESSAY

**The quest side already paid for this lesson in full.** The QUEST STUDY LAW
(7/26) exists because 3,672 findings across 152 studied quests sat unopened for a
month, and quests shipped *in the style of* the corpus instead of *out of* it. The
root cause was named at the time and it is mechanical: **skipping the corpus cost
nothing and left no trace.**

A UI study written as an essay fails the same way on the same timetable. So this
one is built the way the questbook is built, from day one: a corpus of findings
with stable ids, an index that resolves them, and a gate that proves a claim is
real. `FFX.R01` is a citation, not a name-drop.

## 2. THE METHOD — FOUR REAL INSTRUMENTS

A finding with no lens is an opinion, so every finding declares the lens it was
found through. These are the field's instruments, not invented here:

| instrument | what it gives us |
|---|---|
| **Fagerholt & Lorentzon (2009), *Beyond the HUD*** (Chalmers MSc) | The canonical taxonomy. Two axes — **FICTION** (do the characters know it exists?) and **GEOMETRY** (is it in the 3D world or painted on the screen?) — giving **DIEGETIC / NON-DIEGETIC / SPATIAL / META**. Their measured result: diegetic and spatial read as most immersive, meta and non-diegetic least. |
| **Celia Hodent, *The Gamer's Brain*** | Seven usability pillars in studio language: **Signs and Feedback · Clarity · Form Follows Function · Consistency · Minimum Workload · Error Prevention and Recovery · User Control and Flexibility.** When a screen is bad, one of these seven names why. This is the lane's working vocabulary. |
| **Pinelle, Wong & Stach (2008), CHI** | Heuristics derived by reading reviews of **108 games across 6 genres** and extracting the twelve classes of problem players actually complain about. Its value is its direction of travel: built from COMPLAINTS, not theory. The lens for "what will he hate". |
| **The teardown** (practitioner's method; Game UI Database, 55,000+ hand-tagged screens) | Rebuild the screen as a wireframe, label every element, mark what you could cut. The unit of study is A SCREEN WITH TAGS, not a game with a review. |

## 3. THE SHAPE — FOUR MASTERS, MIRRORING THE QUESTBOOK

| master | ids | what lives here |
|---|---|---|
| **LOOK** | `FFX.L##` | material, colour, type, shape, texture, motion |
| **READ** | `FFX.R##` | what it tells you, in what order, how fast |
| **DO** | `FFX.D##` | committing, cancelling, targeting, the cost of a mistake |
| **WORLD** | `FFX.W##` | where the interface touches the fiction |

## 4. THE CLAUSE THAT MAKES IT RESEARCH

Every finding ends in a verdict — **TAKE** / **ADAPT** / **REFUSE** — and:

> ### A ROUND WHERE EVERYTHING IS WORTH STEALING IS NOT A STUDY. IT IS ADMIRATION.

FFX is a 4:3 television game, played with a controller, with a party of seven, in
a corridor, with voice actors. Bohemia is a portrait phone played with one thumb,
one character, an open valley, and no voice budget. **A great deal of what makes
FFX great is *paid for* by conditions we do not have.** A REFUSE is worth more
than a TAKE, because it is the one nobody can derive by admiring the screenshot.

`gates/ui_study_gate.js` requires refusals **by count** (3 minimum) and fails an
all-TAKE round. Mutation-tested by flipping every REFUSE to TAKE: red.

---

## 5. ROUND ONE — FINAL FANTASY X

**18 findings · LOOK 5 · READ 5 · DO 4 · WORLD 4 · TAKE 9 · ADAPT 5 · REFUSE 4.**
Corpus: `uibook/BOHEMIA_UIBOOK_R01_FINAL_FANTASY_X_8_26_26.md`.
In the UI tab, second view, rendered from the index.

### THE FOUR REFUSALS, BECAUSE THEY ARE THE POINT

**`FFX.W03` THERE IS ALMOST NO HUD, BECAUSE THERE IS ALMOST NO DECISION.** FFX is
famous for its empty screen — no minimap, no compass, no quest marker. It can
afford that **because FFX is a corridor.** The level does the navigating so the
interface does not have to. Bohemia is an open valley of 27+ districts and he has
already reported being *"launched into a random part of the city"* and walking
through it lost. A clean empty screen is not a style you choose, **it is something
a corridor pays for.** Copy the empty screen without the corridor and you get a
beautiful HUD over a player who has no idea where he is. *Anyone who quotes "FFX
has no HUD" at this project without quoting that paragraph is quoting half a
finding.*

**`FFX.D01` NO CLOCK MEANS NO PANIC — AND THAT IS WHAT MAKES THE LIST READABLE.**
This is the finding under the famous finding. CTB's turn preview only works
because the world PAUSES and you have unlimited time to read it. **Square did not
add a preview to ATB; they removed the timer first.** We are 120 BPM and
everything quantizes to the beat: we want FFX's readable list while running
something closer to ATB's clock. That is a real tension and pretending otherwise
is how a study becomes a fan page. *Routed, not decided* — this lane's reading is
that the beat should be the **metronome, not the shot clock**: I-MOVE-YOU-MOVE
already says the world advances when you act, so if standing still costs nothing
the list stays readable and the beat only decides *when the action lands*. That is
COMBAT's and RUN's call.

**`FFX.W04` THE TEXT BOX IS THIN BECAUSE THE PERFORMANCE IS THE CONTENT.** FFX was
the first FF with voice acting; the box is small because the actors carry the
scene. **We have no voice acting and will not have any.** Every ounce of our
performance is in the words and a 112px pixel face, so our dialogue sheet must be
the OPPOSITE — bigger, face in it, room to breathe. Which is what the run already
does. **This study says the current sheet is right.**

**`FFX.L04` THE NUMBERS ARE BIG AND THEY FLY.** Banked, not built: NO DAMAGE
BEFORE THE DIAL is our own law. Recorded so nobody rediscovers it and nobody
ships it early.

### THE THREE THAT CHANGE WHAT WE BUILD

**`FFX.R01` THE FUTURE IS ON SCREEN — the most valuable thing this round found.**
The CTB window is a stack of portraits showing WHO ACTS NEXT, several turns ahead.
It is not a bar you interpret, it is a **list you read**. FFX runs a hidden
simulation — agility, action rank, tick counters — and instead of teaching the
player that arithmetic, it does the arithmetic and shows **the answer**. Bohemia
is I-MOVE-YOU-MOVE on a 120 BPM clock and that clock is currently a *felt* thing
with no picture: the player hears the beat and never sees whose the next few are.
*Caution: FFX's list is a tall column on the right of a 4:3 screen; on a portrait
phone the right edge is where the thumb lives. Ours runs along the top.*

**`FFX.D04` THE BIG VERB IS EARNED BY A VERB YOU CHOOSE.** Overdrive is a gauge
that fills from what happens to you — and **Overdrive Modes let the player choose
WHICH event charges it.** The 8/26 law says, in our own words, *"a real kit of
abilities recharged by VERBS, not timers."* **His favourite game shipped that exact
idea in 2001 and we did not notice it was already solved.**

**`FFX.W01` THE SAVE POINT IS A THING YOU WALK TO.** One glowing object doing four
jobs — a save, a heal, a landmark, and a held breath — at zero screen cost,
because it IS the screen. It wires straight into two other rulings: DANGER BY
PLACE and LIGHT = TERRITORY. **A place you can save is a place somebody is keeping
the lights on. The safe map and the light map become the same map.**

### AND ONE THAT ANSWERS A QUESTION ALREADY ON HIS SCREEN

**`FFX.L03` THE INTERFACE LIVES IN A HUE THE WORLD DOES NOT USE.** Spira is
tropical — turquoise, sand, green. The menus are deep indigo, a hue the world
barely touches, so interface and world never compete for the same part of the eye.
Bohemia's world is desert tan and **gold light**, and LIGHT = TERRITORY is law. If
the buttons are gold too, gold stops meaning light. **Fork 3 on the picks page,
answered from inside his own favourite game.**

**`FFX.L02` ONE FACE, AND IT WAS CARRYING MORE THAN ANYONE KNEW.** The 2013 HD
Remaster changed the typeface and the menu cursor and almost nothing else
material. Ten years later players still say it damaged the game, and the type is
what they name. Measured 8/26: **Bohemia has no typeface at all.** That is what
makes fork 4 a real decision.

### AND ONE PLACE HIS OWN LAW AND HIS FAVOURITE GAME DISAGREE

**`FFX.W02` THE INTERFACE TEACHES YOU A LANGUAGE, ONE LETTER AT A TIME.** Al Bhed
Primers permanently decode one letter each, everywhere, retroactively — your
interface becomes more legible the longer you play. Comprehension as progression;
nothing else in the medium does it. But **THEY SPEAK SPANGLISH (8/25, LOCKED) has
a hard rule inside it: LANGUAGE NEVER GATES REQUIRED INFORMATION**, and FFX's
version gates information behind language — that *is* the mechanic. So it is
ADAPT with a hard limit: the shape ports onto things that are not required
(graffiti, faction tags, radio), never a quest step, a name or a direction.
Naming that disagreement is the job.

---

## 6. WHAT THE MACHINE HOLDS

`gates/ui_study_gate.js` — **40 checks**, registered as **UI STUDY**.

- The law names all four instruments, both of Fagerholt & Lorentzon's axes, and all
  seven of Hodent's pillars.
- Every id resolves, is unique, and **its letter agrees with the master it sits
  under** (an `FFX.L##` under MASTER: WORLD is an id that lies).
- Every finding has a lens, a screen, a WHAT, a WHY, a BECAUSE and a verdict.
- **≥3 REFUSE, ≥5 refuse-or-adapt, ≥3 named instruments, all four masters.**
- Every refusal explains itself at length — a REFUSE with a short reason is a shrug
  with a label on it.
- **Every finding LANDS on this game.** A BECAUSE that never touches a Bohemia
  ruling, lane, screen or backlog row is a review, not a port.
- **THE PAGE RENDERS THE INDEX, ID FOR ID.** It does not retell it. Two live copies
  of one truth is exactly the rot the truth hierarchy exists to kill.
- The picks are still the door he lands on; the room he was last in survives a
  reload; every control clears 44px; nothing runs off the side.
- **Its own sun-mode sweep**, because `ui_vocab_gate`'s sweep is structurally blind
  here: a hidden view has no rendered size, so every element in it is skipped and
  the gate goes green *because its subject was invisible*.

### MUTATION-PROVED, SIX, ALL RESTORED
| mutation | result |
|---|---|
| **flip every REFUSE to TAKE (the fan-page mutation)** | RED — "0 findings … CANNOT come here (wants 3)" |
| a refusal reduced to "We just cannot." | RED, 3 legs |
| hide one finding from the page so it drifts from the corpus | RED — "17 vs 18", and the refusal count leg |
| rename an id so its letter disagrees with its master | RED at the indexer AND at the gate |
| strip one instrument out of the law | RED, naming what went missing |
| let sun mode leave the study's small type faint | RED — 36 words under 4.5:1 |

### AND THREE THINGS THE MACHINE CAUGHT IN ITS OWN AUTHOR
1. **The corpus header mis-declared its own counts.** The indexer checks the
   declared totals against what it actually mines. It said TAKE 8 / ADAPT 6; the
   corpus held 9 and 5. I miscounted my own study and the machine said so.
2. **One finding was floating.** `FFX.D03` described a shape and never landed it on
   anything in this game. The gate flagged it and it was rewritten to land on the
   experience tree and the 60 mini bosses. *(Two others it flagged in the same run
   were the ruler's fault, not the corpus's — they named real rulings in words the
   token list did not carry — so the ruler was widened. It was then **tightened
   back**: the first widening reached for "he/his/we/our", which would have matched
   every sentence in the corpus. A checker that matches everything is the same bug
   as one that matches nothing, wearing a bigger coat.)*
3. **The scoreboard was built out of the wrong primitive.** It used the vocabulary
   box, whose colours sun mode deliberately never touches (those boxes are showing
   a dark game). In sun mode it was dark text on a dark plate at **1.57:1**. The
   scoreboard is the page talking, not the game, so it follows the page now.

## 6b. AND ONE MORE GATE I DID NOT WRITE CAUGHT ME

`pages_publish_gate` went red on the new `uibook/` folder: **"every folder
_config.yml KEEPS is copied by the workflow — uibook"**. That check exists because
on 8/20 a half-published records/ folder meant 41 MB was declared published by one
list and never copied by the other, so it worked on disk and 404'd in production.
A new source folder falls into the same hole by default. `uibook/` is now excluded
by name with its reason, exactly like `questbook/`: the UI tab never reads those
files, it renders the index, which the generator inlines at build time.

## 7. WHAT HAPPENS NEXT
Round two is another game, same shape, whenever he names one. And the standing
consequence: **when a lane says "we should do it like game X", the answer is
"which finding" — and if there is no finding, the honest move is to run a round.**
