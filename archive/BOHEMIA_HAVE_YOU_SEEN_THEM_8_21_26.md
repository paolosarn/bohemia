# HAVE YOU SEEN THEM (8/21/26, PEOPLE lane)

## WHERE TO SEE IT: the **RUN** tab. Take somebody's name, then walk up to anybody
## else and the card offers **"Have you seen ___?"** The answer comes out of that
## person's own head, so two people standing together answer differently and both
## are telling the truth.

---

## EVERY MIND IN THE VALLEY HELD EXACTLY ONE SUBJECT, AND IT WAS YOU

Three turns ago this lane wired the witness organ so people could see the player.
It only ever recorded **the player**. Every mind in Las Vegas held one subject,
`'@'`, which is a memory *of you* rather than a memory.

`bohemia_memory`'s own `attach()` has always recorded out-agents seeing
out-agents *and* the player, in one sentence: *"out-agents see out-agents (and the
player) within RADIUS"*. The city was doing half of it, and the half it skipped is
the half the questbook asked for.

## THE QUESTION THE ORGAN WAS BUILT FOR, ASKABLE FOR THE FIRST TIME

From the module's header, written 7/19:

> "the questbook's engine backlog demands **THE SETTLEMENT'S MISSING-PERSONS
> ORGAN** (Q133/Q134/Q138). Its seed question, **'when did anyone last see H3-2,
> and how sure are they'**, is answerable from these minds"

It was not answerable from anything, because nothing in the game had ever put a
sighting in a mind. Now it is:

```
WATCH
NAME              YOU HAVE NOT ASKED
RIGHT NOW         Standing outside

[ Have you seen Anahi Nguyen? ]
THEY SAID         Yeah. just now, right about here.
```

**The man has not told you his own name, and he will still tell you where he saw
somebody else.** That is the shape of the thing.

## THE FIRST QUESTION IN THIS GAME WHOSE ANSWER IS NOT AUTHORED

Every other ask resolves through the person's **trade**, deliberately, so that
"the same question put to the same kind of person always gets the same reply", as
the ask system's own comment puts it, because a world where the answer depends on
which body you clicked is not a world with information in it.

This one resolves through **that person's own memory**. Two scavengers standing
side by side give different answers and both are true, because they genuinely saw
different things.

**Clarity shapes the answer, it does not gate it.** A fogged memory is not a
refusal, it is a vaguer sentence, which is what a real witness sounds like. The
same witness, asked about the same person, as it fogs:

| age | band | what they say |
|---|---|---|
| now | sharp | Yeah. just now, right about here. |
| 30h | fair | I think so. yesterday, somewhere north of here. |
| 400h | never | No. Not that I know of. |

That last row is the module's own `MIN_CLARITY`: below it there is nothing usable
and they simply did not see them. Not a stonewall, an honest blank.

**YOU HAVE TO ASK (7/31) governs who you may ask about.** The list is built from
the met-ledger's `asked` bit and nothing else, so you can only go looking for
somebody whose name you took. You cannot put out a description of a stranger,
which is right, and is also the reason taking names matters.

**`lastSeenAcross` finally has a caller**, scoped to the minds the player has
actually spoken to. A valley-wide sweep would hand him an answer nobody told him,
which is the godlike-information failure this whole lane exists to undo.

## THE WORDS WERE BROKEN AND THE MACHINE CATCHES IT NOW

The first cut rendered:

> "I think so. **1 days back**, right about here **way**."

Two bugs in one sentence: a plural that never checked for one, and a template
appending " way" to a phrase that was already a whole phrase. **Broken grammar is
not an attempt, it is a bug**, the 8/11 law says every line ships written as if
it ships.

Same failure the quirk factory hit in July, and the same answer: a **grammar
contract machine-checked over every rendering** rather than eyeballed on the one
that happens to be on screen. The gate now renders every band times every
when-word times every where-word, **91 renderings, 67 distinct, 0 bad**, and a
mutation putting the bug back turns 30 of them red.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_city_memory_patch.py` | mutual sight, the ask verb, the answer, the organ query |
| `gates/city_memory_gate.js` | 23 -> 31 claims |

Both tools idempotent together, md5-identical over three runs.

Mutation-proved, each with arrival verified in the file under test first:

| mutation | result |
|---|---|
| back to player-only sight | **4 red** |
| put the grammar bug back | **1 red**, naming 30 bad renderings |

## ONE THING THIS GOT WRONG FIRST

**The refresh path had the same hole the sibling tool shipped yesterday.** This
tool writes an inlined region *and* call sites outside it, and its refresh branch
only ever rewrote the region. Fixed before it could bite this time, with the call
sites applied on both paths and each pair narrow and span-matched on both halves.
The lesson travelled from one tool to its sibling in a day, which is what writing
it down is for.

## WHAT COMES AFTER

1. **THE OTHER DIALS.** `SEE_RANGE`, the gossip window, the decay halflives are
   all defensible constants with the same wrong answer to "where does he change
   this himself". The STANDING dial is the pattern to copy. **This lane's.**
2. **HE TURNS THE STANDING DIAL.** One row makes three turns of witnessing and
   gossip into a reputation that judges him. **His.**
3. **The three retyped clout slices**, one line each, not this lane's surfaces.
4. **Walking is silent**, 97 approved sounds unplayed. SOUNDS.
