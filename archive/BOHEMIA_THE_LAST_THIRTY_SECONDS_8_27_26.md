# THE DEMO ENDS ON A THING YOU ARE NOT ALLOWED TO SAY
# (8/27/26, PEOPLE lane. Demo critical path row DEMO-END, plus the last two
#  hundred metres of the walk that got him there.)

## THE ROW NOBODY OWNED

The handoff's own critical path, verbatim:

> **BUILD -> DOOR -> ENDING -> INSTRUMENT -> INVITE.** The remaining three are
> RUN's: P0-DOOR, **DEMO-END (the last thirty seconds, which nobody has designed
> and which peak-end says is half of what anybody keeps)**, and 0f the feedback
> card. **NOBODY IS HANDED THE DEMO LINK UNTIL ALL FOUR EXIST.**

The lane it was assigned to has not shipped since 8/12. And it is a message from
a person, on a phone, at the end of a day, which is this lane's whole subject.

## THE RESEARCH, WHICH WAS ALREADY BANKED

- **KAHNEMAN AND FREDRICKSON'S PEAK-END RULE.** What a person keeps of an episode
  is predicted almost entirely by **two moments: the most intense one and the
  last one.** Not the average. Not the total.
- **DURATION NEGLECT.** How long it went barely registers.
- **Zukowski, from the other direction.** A demo's ending is not neutral. Ending
  without giving a reason to come back **actively hurts it**. It has to leave
  somebody thinking *"I need to play more of this"*, never *"that was annoying"*.

And the coordinator's reading of his own ruled cut, which is the finding this
answers: **BOTH PEAKS SIT IN THE FIRST FIVE MINUTES AND THE LAST THING THE PLAYER
FEELS IS GOING TO BED.** The cut is his and it is good. This is the thirty
seconds after it.

## WHAT HAPPENS NOW

He taps SLEEP. **Day two does not come.** One message lands:

```
LOURDES IBARRA
06:00 · the phone, after

Light all night. Right through nine, past ten, past when I gave up waiting
for it to go.
I still went out at nine. Forty years standing on that corner at nine
o'clock, you don't stop just because the lights stayed on.
Nobody's said a word. Not one.
Was it you?

Tell them it was you            <- struck through, and dead to the touch

THAT IS AS FAR AS THIS GOES FOR NOW.
```

There is nothing to press.

## THE DEMO ENDS ON A NOVERB, AND THAT IS THE POINT

The corpus's single most repeated craft finding is the **withheld verb**: seven of
the CONVERSATIONS MASTER's marquee nodes are remembered for the line the game
refused to let the player speak. The conversation surface shipped that grammar
this week, so by the time he reaches this screen he has met a struck-through line
four times and knows exactly what it means.

So the last thing the demo does is ask him a question and take the answer away.

## FIVE ENDINGS, BECAUSE THE GAME ALREADY KNOWS WHICH DAY HE HAD

The quest classifies its own outcome. Nothing new is measured:

| what he did | ending |
|---|---|
| fixed it and told nobody (`#quiet`) | *"Nobody's said a word. Not one. Was it you?"* |
| handed it to the trades (`#notable`) | *"My name's on that order. Mine. Not theirs."* |
| cut it in front of the block (`#reckless`) | *"That was true when I said it. It isn't now."* |
| ran out of light (the author's own FAIL) | *"I'm not asking again. I don't think."* |
| never picked up | *"Anyway."* |

Peak-end says the last moment is half of what a person keeps. **A last moment
that is the same whatever they did is half of what they keep, spent on nothing.**

## AND WHETHER IT SAYS THEIR NAME IS UP TO HIM, WHICH COST NOTHING

**YOU HAVE TO ASK (7/31)** already governs names: `nameOf` returns null for
anybody he never asked. So the header of the last screen in the demo is:

```
LINEMAN            <- he never asked
LOURDES IBARRA     <- he did
```

Nothing here decides that. The ledger he already wrote decides it.

## THE WORDS WENT THROUGH THE VOICE CARD'S OWN RULERS, AND FAILED FIRST

`laws/BOHEMIA_VOICE_CARD_8_26_26.md` rule 4: **NINE WORDS, THEN TWO.** The gate
measures rhythm as spread over mean, calls **0.57 flat** and offers **0.74** as
its own fixed example.

**My first draft measured 0.27 to 0.37.** Every sentence between four and seven
words. The exact tell the card exists to catch, in the file that quotes the card.
All five were rewritten with real variation (sentences now run 1 to 31 words) and
came out at **0.82 worst case**. Zero banned phrases. Eleven of twenty-three
lines contract. Four of the five end on a question.

The gate reads the banned list **off `voice_gate.js` rather than re-typing it**,
because a checker that re-types the rule it checks is how `o'clock` got read as
the Spanish word "o" in one place and not the other.

## AND NOT ONE LINE MAY NAME A PRONOUN

The first cut of the withheld verbs said **"Tell him it was you"**, and the probe
that proved the ending working printed it under the header **LOURDES IBARRA**.

The cast is **procedural**. The person the quest lands on is whoever really stands
on that block. A line that names a pronoun is a line that will be wrong for half
the valley. They/them, for everybody, and a gate claim that sweeps every line.

---

# AND THE LAST TWO HUNDRED METRES

The address gets him to the block: *"6 blocks south west, out by the houses"*,
counting down to *"right here"*. **Then it stops being useful, at exactly the
moment the walk was for**: he is standing in a crowd and every one of them is a
stranger in a coat.

So the line gets finer on arrival, in vocabulary the game already speaks. The
**TELL** has printed what you notice about whoever you are next to since 8/13,
de-collided so nobody on a block has the same one, and it is already a description
of a person across a street:

```
right here, by the big road · look for the one who will not answer while
holding a certain thing, and is embarrassed about it
```

**A description, never an arrow.** The Morrowind research behind the address holds
at this range too: a marker deletes the place it points at, and it would delete
the person as well.

## AND THE CARD SAYS WHAT THE QUEST THINKS THEY ARE

The **conferred** half of a role has been computed since casting shipped and shown
**nowhere**. Measured: **69 predicates across 64 roles, and 58 already read as
English** -- "keeps the tunnel", "wronged the dying", "named on the board", "near
the end". The other 11 are machine flags (`block=browned`, `met_before=false`) and
are **dropped rather than mangled into prose**.

```
THE JOB       The Same Crate Twice wants the runner. That is them.
THE JOB SAYS  the one who knows the load
```

## AND THE FLAG NEVER ARRIVED, WHICH MY OWN GATE COULD NOT SEE

The city is a separate document, so it cannot read the shell's window. The first
cut had the shell **push** the demo flag on the city frame's `load` event.

Measured on the real demo build: **the flag never arrived at all.** The frame's
`document.readyState` is still **"interactive"** while the player is already
walking around inside it. It is a four megabyte page, and its load event is not a
thing anybody should be waiting on.

**AND THE GATE WAS GREEN, BECAUSE THE GATE POSTED THE MESSAGE ITSELF.** It loaded
the bare city page and sent the flag by hand, which made every claim below it
pass over a chain that did not work.

> **A PROBE THAT SENDS THE MESSAGE THE REAL SENDER IS SUPPOSED TO SEND IS STILL A
> SIDE DOOR.**

Third instance this session of the same shape, and this one had a live bug behind
it. Both halves fixed:

- **THE DIRECTION IS REVERSED.** The frame knows when it is ready and the shell
  does not, so the city **asks** on boot (retried over the first two seconds, in
  case the shell's listener is not up yet) and the shell answers.
- **THE GATE DRIVES THE REAL SHELL.** It opens `slices/BOHEMIA_DEMO.html`, taps
  the real splash, finds the city frame the player is looking at, and asks that
  frame what it thinks it is. Nothing in the gate posts the flag any more.

Measured through the real chain: **demo true, workshop false.**

## MUTATIONS

| break | result |
|---|---|
| **M29** the demo flag ignored, so the demo never ends | **6 red**, including `["GET UP"]` where nothing should be pressable |
| **M30** the withheld reply not drawn | **1 red** |
| **M31** the tell not appended on arrival | **1 red**, `right here, by the big road` and nothing more |
| **M34** the shell stops answering the city's question | **7 red**, `demo false, workshop false` |

## AND THREE THINGS I GOT WRONG, WRITTEN DOWN

**1. A CLAIM THAT COUNTED THE THING INSTEAD OF READING IT.** The ending gate went
green over a city carrying a stale inlined copy that still said *"Tell him it was
you"* after the module had been fixed to *"them"*, because the claim checked that
ONE refusal was on screen and that it was not a button. It reads the text now.

**2. A `git checkout` THAT DELETED MY OWN WORK.** Reverting one file to undo a
mutation also discarded `traitWords`, which was uncommitted. Restored by hand.
The lesson is small and cheap: a revert is only safe for work that is committed.

**3. A CLAIM ASKING FOR SOMETHING THE WORLD DOES NOT CONTAIN.** *"A stranger
standing on the job's block gets no row"* went red on a correct tree, then passed
on a broken one, and the reason took three attempts to find: **on every one of the
five demo days, the cast person is the only census resident of their block.** The
apparent second body was the player's own authored NEIGHBOUR, which the people
pass appends to whichever neighbourhood he spawned in, so it follows the probe
around.

So mutation M32 (show the row to everybody) is **observationally identical to
correct behaviour in this world**, and no claim written today could catch it.
**The gate prints that rather than pretending.** The guard stays, because it is
right and costs nothing, and it becomes checkable the day a job block holds two
people.

## THE MACHINE

| file | what |
|---|---|
| `engine/bohemia_ending.js` | five endings, and which one |
| `tools/bohemia_city_ending_patch.py` | the last screen, and the shell telling the city which surface it is |
| `tools/bohemia_city_hunt_patch.py` | the tell on arrival, and the conferred row |
| `engine/bohemia_people.js` | `traitWords` |
| `gates/ending_gate.js` | 26 claims, registered as ENDING |
| `gates/address_gate.js` | 41 claims, section G added |
