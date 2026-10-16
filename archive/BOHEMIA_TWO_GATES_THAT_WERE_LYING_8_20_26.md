# TWO GATES THAT WERE LYING

**8/20/26 — WORLD lane. INTERIORS and BANNER were two of the fleet's 29 red gates.
Both are green. Neither was red because the game was broken: one was reading a module
that had been cut in half by a neighbour's insert, and the other was counting a
sentence that appears seven times in one file and calling it seven copies of that
file.**

---

## BANNER: SEVEN, THREE, TWO

```
FAIL: NO module is inlined TWICE in the page -- a second copy later in the file WINS at
runtime and silently shadows the fresh one
  -- DOUBLED: bohemia_asking.js x7, bohemia_exchanges.js x3, bohemia_people.js x2
```

That is a frightening thing to read. A stale second copy sitting later in the file, run
by the browser while the fresh one is dead code, is a real bug — this gate exists
because it *actually happened* when the payday block was renamed and orphaned.

It had not happened here. The gate identifies a module by a **signature**: a long line
found in no peer module. It then counts that line in the page and calls anything above
one a duplicated module. But a line can be unique among peers and still occur **several
times inside its own file**, and then one honest inline reports as many:

| module | its signature | times inside its own file | reported |
|---|---|---|---|
| asking | a QUEST STUDY `"applied": "many diegetic paths..."` citation | **7** | x7 |
| exchanges | another `"applied":` citation | **3** | x3 |
| people | `var r = m[key] \|\| (m[key] = { times: 1, ...` | **2** | x2 |

Seven, three, two — exactly the counts it reported. All three are inlined **once**. Both
`people.js` hits in the page sit under the **same banner**, 1,357 bytes apart.

Two of the three signatures are not even code. They are `applied:` lines — the QUEST
STUDY LAW's own citation format, which is *supposed* to recur, once per cited study.

**The fix is one line: a signature must occur exactly once in its own file too.**

```js
if (occurrences(BODIES[f], l) !== 1) continue;   // must identify ONE place, not a motif
```

This gate had already recorded making this mistake once — *"the list was captured from
the ruler's SECOND draft, before signatures were checked for uniqueness, so shared
boilerplate matched and invented debt."* Same mistake, other axis: it checked uniqueness
**across** files and never **within** one.

**FIX THE RULER, NEVER THE TARGET** (8/1). Deleting a citation to quiet this gate would
have been vandalism against the QUEST STUDY LAW to satisfy a counting bug.

## INTERIORS: A MODULE CUT IN HALF

```
FAIL: engine/bohemia_floorplan.js is inlined BYTE-IDENTICAL (no second copy of the generator)
```

Also frightening, also not what it says. There was exactly **one** copy of
`BOH_FLOORPLAN` and its body was verbatim. What had happened is that another lane's
"THE FLOOR INDOORS" patch anchors on the furniture module's banner and inserts before
it — and that banner sat **between the floorplan's header comment and its body.** So
34,850 bytes of a different module were spliced into the middle of `floorplan.js`,
leaving it non-contiguous. `city.includes(theWholeFile)` cannot be true of a file cut
in half, even when every byte of it is present.

The block was moved out, whole and unchanged, to just **after** the floorplan body —
which is the safer side of it anyway, since that code can now rely on `BOH_FLOORPLAN`
already existing. The other lane's patch tool re-runs cleanly against the new position
and the gate stays green, so it does not come back.

### and that is why the sync sweep had been blind to it

The real cost was not the red gate. `tools/bohemia_city_module_resync.py` had been
reporting, every run for days:

```
UNRECOGNISED (neither canon nor any of the last 40 revisions): engine/bohemia_floorplan.js
```

The sweep cuts a module out by its banner and stops at the **next** banner. With another
module spliced in immediately after floorplan's header, the cut contained only the
header comment, failed its own sanity check, and the sweep gave up on it. **A module the
sync sweep cannot see is a module that can drift silently** — which is precisely the
class of bug the ENGINE SYNC LAW exists for, and precisely the class that cost this repo
the arterial's furniture and the Strip's intersections this week.

After the move:

```
CITY MODULE RESYNC: 91 embedded, 91 already fresh
  -> nothing to do
```

Ninety-one recognised, none unrecognised.

## AND THE THING I FINALLY DID RIGHT

**Both fixes were negative-controlled.** Not "the gate is green now, ship it" — the
green was proved to still be *earned*:

- injected a genuine painted surface into the interior renderer → both interior checks
  fail, as they should
- injected a genuine second copy of `bohemia_people.js` into the page → BANNER catches
  it, `x2`, as it should
- reverted both, re-ran, green

That is the step whose absence produced four wrong versions of `legend_kept_gate` in two
days. A gate that goes green after a change has told you nothing until you have watched
it go red for the right reason.

While raising the interior fill cap from 4 to 5 — legitimate, because the wall is drawn
in **two courses** to the DOOR LAW's own proportion and so its not-yet-decoded fallback
is written twice — I also added the rule the count was only ever a proxy for: **every
solid fill must be the plate black or sit inside a pool-miss fallback branch.** Now the
number is a convenience and the shape is the law, so raising the number again cannot
smuggle a painted surface in.

That check was wrong on its first run too: `!inBlit(pool, inPatch(x, y, pool.length), ...)`
nests parentheses, and a lazy `\([^)]*\)` stopped at the first close, so it reported all
three real fallbacks as painted surfaces. Cheap regex, expensive lesson, twice this week.

## THE LESSON

Two of the 29 red gates on the fleet's board were red at the game's expense and not at
its fault. Somebody could have spent a day deleting quest citations to make BANNER
green, and the game would have been strictly worse and the gate strictly happier.

**When a gate goes red, the first question is not "what did I break" — it is "is this
gate measuring what it says it measures".** Four times this week the answer was no, and
every one of those was cheaper to find by reading the ruler than by rewriting the thing
being measured.
