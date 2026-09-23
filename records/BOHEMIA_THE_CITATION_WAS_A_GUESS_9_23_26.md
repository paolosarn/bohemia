# THE CITATION WAS A GUESS, AND TWENTY-ONE SHEETS POINTED AT FILES THAT DO NOT EXIST

PLUMBER, row `[rot ceiling]`, 9/23. Handed over by the coordinator as two stale citations to
retype. It was one line of a generator, and it was writing a path nobody had ever looked for.

## WHAT THE ROW SAID, AND WHAT THE FIRST RUN SAID

The row: `canon_rot_gate` red on main, **82 gone against a ceiling of 80**, two tilespecs citing
engine files that were never in git (`reservoir`, `strip_x`).

First run on a clean tree, before touching anything:

```
FAIL: C3 truly-gone citations have not increased (83 of ceiling 80)
  NEW ROT: BOHEMIA_TILESPEC_reclaim.md   -> engine/ + bohemia_reclaim.js
           BOHEMIA_TILESPEC_reservoir.md -> engine/ + bohemia_reservoir.js
           BOHEMIA_TILESPEC_strip_x.md   -> engine/ + bohemia_strip_x.js
```

*(the three dead paths are written split above ON PURPOSE. Writing them whole, as this record
first did, ADDS THREE TRULY-GONE CITATIONS TO THE REPO, and the ratchet counted them: 62 became
65 and my own green run went red on my own record. A document about dead citations is not exempt
from being one. The same trap is waiting for the next lane that writes this class of record.)*

**83, not 82. A third had appeared between the coordinator's measurement and mine**, which is
the tell that this was not a typo somebody made once. Something was still producing them.

## THE REAL SIZE

Every sheet opens with ``GENERATED from `engine/bohemia_<name>.js` ``. Swept all of them:

```
dossiers carrying a citation                 71
citing a file that IS NOT ON DISK            21
```

Not two. Not three. **Twenty-one.** The three the gate named are only the ones whose cited file
has *never* been in git; the other eighteen sit in the grandfathered bucket and were invisible.

## THE CAUSE, ONE LINE

`tools/bohemia_tilespec.js:109`

```js
md += 'GENERATED from `engine/bohemia_' + d.name + '.js` (NOTES + LEGEND + PALETTE) ...';
```

The path is **built out of the district's name**, not read from the module that was loaded.

For the thirty-odd districts the tool names by hand at the top, that is true by coincidence:
`suburb` really does live in `bohemia_suburb.js`. For every district found by the **registry
sweep** it is a guess, and the sweep is the good part of this tool. Its own comment says why it
exists:

> twelve utility landmarks shipped with no dossier because nobody remembered to add twelve
> lines here. ... The thirteenth landmark needs no edit to this file, which is the whole point.

Exactly right, and exactly the districts that got a wrong citation, because those landmarks live
in **shared** modules. Asked node who actually calls `K.register` for each type:

```
engine/bohemia_utility.js    arsenal, basin, datafort, fueldepot, granary, gypsum,
                             intake, pumpstation, quarry, radio, reclaim, reservoir
engine/bohemia_landmarks.js  convention, dam, fort, minigp, prison
engine/bohemia_airfield.js   airbase, airport
engine/bohemia_arterial.js   arterial_x
engine/bohemia_strip.js      strip_x
```

Across all 72 registered types the old guess was **right for 50 and wrong for 22**.

## THE FIX IS NOT A TABLE OF EXCEPTIONS

A lookup of the 22 would work now and would be wrong the moment a thirteenth utility landmark
lands, which is the precise bug the sweep was written to kill. So: **ask node who registered the
type.** Wrap `K.register` before a single generator loads and record the engine file that was
executing. No list to maintain, 72 of 72 traced, and a shared module that gains a landmark cites
itself correctly with no edit to anything.

**AND A FLOOR, because the fix is not the interesting part.** The generator now refuses to write
a citation to a file it cannot find on disk. It writes "a module this generator could not
identify" and prints a loud block naming every sheet that happened. Silence is how twenty-one of
these drifted: the tool printed `wrote tilespec for reservoir` either way.

## RESULT

```
before   83 gone, ceiling 80, 12 pass / 1 fail, red on main for every lane
after    62 gone, ceiling 62, 13 pass / 0 fail
```

21 sheets regenerated, **one line changed in each**, 42 changed lines total, nothing else in any
dossier moved. One sheet was also created that had never existed: `sign` (FACTIONS' district was
in the registry with no dossier, because the generator had not been re-run since it landed).

**THE CEILING IS LOWERED TO 62, WHICH IS THE POINT.** The gate's own note asks for it: *"lower
CEILING in this gate to lock the win in."* Leaving it at 80 would have banked room for eighteen
new dead citations nobody would ever be told about.

## MUTATION-CHECKED BOTH WAYS

| mutation | result |
|---|---|
| one dead citation put back | 63 of ceiling 62, **12 pass / 1 fail**, exit 1, names the sheet |
| the owning module hidden from the generator | refuses, prints the loud block, writes the honest sentence, exit 0 |
| restored | 13 pass / 0 fail, 72 of 72 citations on disk |

## WHAT THIS IS AN INSTANCE OF

Third round running in this lane, and the fourth tool: a pipe that ate a push's exit code, a
driver that opened the demo when asked for the alpha, a deploy gate reading a day-and-a-half-old
answer, and now a generator writing a path it never checked. **None of them threw. All of them
printed something a person would quote.** The pattern is always the same shape: a tool states
something it is in a position to verify and does not verify it.

The ceiling being a ratchet is why this one was catchable at all. Without it, twenty-one wrong
citations would just be how the repo looks.

## FOR THE OTHER LANES, NAMED NOT FIXED

62 truly-gone citations remain and **none of them are tilespecs any more**. They belong to
whoever wrote them; the gate lists them as other lanes' to clean. The ceiling now only falls.
