# HOW LOUD IT WAS DECIDES HOW FAR IT GOES (8/21/26, PEOPLE lane)

## WHERE TO SEE IT: the **RUN** tab. Do something quiet and only the person beside
## you knows. Throw in with an outfit and somebody down the street hears, and it
## gets retold four times instead of one.

---

## I ONLY FIXED HALF OF IT YESTERDAY

`engine/bohemia_deeds.js` opens with two complaints, not one:

> "The faction standing got applied godlike: the number moved, valley-wide,
> instantly, and NOBODY HAD SEEN ANYTHING. **So today a back-yard handshake and a
> public humiliation in front of a whole block are worth the same to a faction.**"

Yesterday closed the first sentence. The second stayed **exactly true**, because
every deed I recorded took the default reach and the default hop budget. The
module says so about itself, in its own hops comment:

> "until now NOTHING IN THE GAME PRODUCED THE DIFFERENCE: every deed got the same
> hop budget, so **quiet and notorious were the same word**."

## WHICH OF HIS FOUR WORDS EACH ACT EARNS, READ OFF HIS CORPUS

Not invented. The quest corpus carries **203 clout tags across 27 quests**, and it
writes the rule down in his own words (7/21):

- *"CLOUT rides loudness"*
- *"quiet fix -> #quiet, public patch -> #notable"*
- *"help them finish small and intimate -> #quiet"*
- *"draw a real crowd -> #notable"*
- *"loud AND dangerous -> #risky"*, *"loud spectacle -> #reckless"*
- and decisively: **"THE PLAYER DOES NOT PICK A CLOUT NUMBER"**, the act does.

Applied to the three acts the walked street actually has:

| act | word | why |
|---|---|---|
| met a claim | `#quiet` | you did what was asked, between the two of you |
| refused a claim | `#notable` | you turned an outfit down to their face, in the open |
| took a favour | `#quiet` | a hand-off, not a scene, and being seen taking is the point |
| committed to an outfit | `#risky` | you threw in where anyone can see, and it costs you elsewhere |

Those four words are the judgement and he overturns them with one word. The
WEIGHTS behind them are untouched and remain his.

## WHAT THAT BUYS, MEASURED ON THE REAL SURFACE

Two people on the same street, at 6 and 14 tiles:

| act | reached | retellings |
|---|---|---|
| quiet | **1** (only the near one) | 1 |
| loud | **2** (both) | 4 |

And the full curve off his live table, with the identity case intact:

| tag | reach | hops |
|---|---|---|
| *untagged* | 9 = SEE_RANGE | 2 = MAX_HOPS |
| quiet | 7 | 1 |
| notable | 12 | 3 |
| risky | 17 | 4 |
| reckless | 24 | 5 |

**An untagged deed is bit-for-bit the old behaviour.** That is the module's own
identity guarantee and the gate asserts it: a tag can move you OFF the default,
never silently redefine it.

## THE TABLE THAT SAID "THERE IS NO SECOND COPY" HAD FOUR

`bohemia_deeds.js` threw a deliberate error:

> "bohemia_deeds needs BohemiaLoop for CLOUT_WEIGHTS; **there is no second copy of
> that table on purpose**"

Measured 8/21:

```
engine/bohemia_loop.js                  the canonical one
slices/BOHEMIA_HOW_LOUD_8_6_26.html     retyped into a stub BohemiaLoop
slices/BOHEMIA_CURRENT_SLICE.html       retyped
slices/BOHEMIA_RUN_CURRENT.html         retyped
```

All four hold the same numbers today, so nothing was broken this minute. **That is
exactly what made it dangerous.** The 7/21 ruling says in as many words that the
ordering is locked canon and **the exact numbers stay tunable**, so the day he
retunes them, three surfaces keep the old ones and nobody finds out.

**And the copies were not laziness.** `bohemia_loop.js` is 75 KB and throws at load
without engine, scheduler, world, bq, quest_runtime and the faction graph. Anybody
who wanted four numbers had to choose between dragging in most of the engine or
retyping the row. Three surfaces made the same reasonable choice.

**THE FIX IS NOT TO SCOLD THE COPIES, IT IS TO MAKE THE ORIGINAL REACHABLE.**
`engine/bohemia_clout.js` now holds the table alone with **zero dependencies**.
`bohemia_loop.js` reads it and still exports `CLOUT_TAGS` / `CLOUT_WEIGHTS` /
`cloutWeight` / `cloutTagFrom` byte-for-byte unchanged, so no caller sees a
difference. And the walked city gets loudness for **13 KB instead of the whole
engine**.

Proved by retuning: change `quiet` to 2 and `reckless` to 400 in one file, and the
engine (reach 3 / 46), the loop's exported table, and the inlined city copy all
follow, with his locked ordering intact. Restored after.

## THE MACHINE

| file | what |
|---|---|
| `engine/bohemia_clout.js` | new; the table, alone, no dependencies |
| `engine/bohemia_loop.js` | reads it instead of declaring it; exports unchanged |
| `engine/bohemia_deeds.js` | accepts it directly, so loudness no longer needs the engine chain |
| `tools/bohemia_city_deeds_patch.py` | inlines clout + deeds, tags every act, wires the favour |
| `gates/city_deeds_gate.js` | 20 -> 30 claims |

All green alongside: engine sync law (18 modules, zero drift), loop clout tests
18/0, loop profile tests 10/0, deed bridge 27/0, standing 35/0, memory 10/0, city
memory 23/0, city talk 18/0, integration 128/0.

Mutation-proved, each with arrival verified in the file under test first:

| mutation | result |
|---|---|
| drop the tag, every deed the same loudness again | **2 red** |
| reintroduce a second copy of the table | **2 red** |
| retune his weights | **everything followed** (the proof, not a failure) |

## THREE MORE THINGS THIS GOT WRONG FIRST, ALL THE SAME SHAPE

**AN IDEMPOTENT TOOL WHOSE REFRESH PATH COVERS ONLY PART OF WHAT IT WRITES WILL
QUIETLY SKIP THE REST.** The tool writes an inlined REGION and a handful of CALL
SITES. Its refresh branch only ever rewrote the region, so the day the call sites
needed to change (when `ctDeed` grew a `tag` argument) a re-run silently left them
on the old form and the feature was half-wired. The gate caught it. Every call site
is now a (from, to) pair applied on both paths.

**AN UPGRADE PAIR'S TWO HALVES MUST DESCRIBE THE SAME SPAN.** The first fix paired
a NARROW `from` (the old call line) with a WIDE `to` (the whole anchored region,
comment and closing brace included), so applying it re-inserted the region around
the call: a duplicated `advance(60)` that double-charged an hour of his day, and a
duplicated `}` that was a hard syntax error taking the entire city frame down.
**Third time this lane has met the same shape**, a replace whose delete half and
insert half cover different ground.

**`git checkout <file>` REVERTS YOUR OWN UNCOMMITTED WORK ALONG WITH THE MUTATION.**
Restoring a mutated file that way silently threw away the legitimate edit sitting
in it. A mutation test on uncommitted work needs a backup copy, not a checkout.

Both tool paths now converge: a fresh install and an in-place upgrade produce the
**byte-identical** city, proved by md5.

## WHAT COMES AFTER

1. **THE THREE RETYPED SLICES.** `BOHEMIA_HOW_LOUD_8_6_26.html`,
   `BOHEMIA_CURRENT_SLICE.html` and `BOHEMIA_RUN_CURRENT.html` still carry their
   own copy of the table. They agree today. Each is a one-line change in whichever
   tool generates it, now that `bohemia_clout.js` exists to point at. Not this
   lane's surfaces; flagged rather than touched.
2. **THE DIAL, AND IT IS HIS.** One `DEED_WEIGHT` row turns all of this from "they
   remember" into "they judge". Nothing should invent it.
3. **Walking is silent**, one sfx message, zero footstep code, 97 approved sounds
   unplayed. SOUNDS.
4. **The ridge exterior**, the one genuinely missing picture. ART's.
