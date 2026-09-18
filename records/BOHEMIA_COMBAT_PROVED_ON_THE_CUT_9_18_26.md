# V221 — PROVED ON THE CUT, NOT ON THE WORKSHOP (COMBAT lane, `[dev strip]`)

The coordinator's row asks for something my last ship did not do, and it says so in
its own words:

> *"the gate opens a real fight **on the cut** and finds none of the five."*

My gate ran on the **alpha**. EYES round 8 still reported the strip standing on the
deploy cut, and their walk may predate my push. So the first act of this round was not
to build anything. It was to go and look at the thing he opens.

---

## WHAT THE DEPLOY CUT ACTUALLY SHOWS, MEASURED

The cut was built from the current workshop and served at the demo's own path. A real
fight was started the way he starts one: walk up to a crew, tap one.

```
HAND-PEEK, NEW ENCOUNTER, ARENA, the comment box    not on screen
WAIT, SUPPRESS, SHOVE                               on screen, which is the game
the strip                                           111 px of 932  (was 181)
what he can read    SETTINGS · YOU · 100/100 · WAIT · SUPPRESS ·
                    SHOVE GOON (stun 1 · 30%) · WAY OUT 4T · out on the block
developer strings                                   none
```

**The fix is on the cut.** EYES round 8's observation predates `27ef790e`. Nothing new
had to be built for the strip itself — but the row's ship test still was not met,
because *nothing could see the cut*.

## SO THE WORK IS THE INSTRUMENT, AND IT IS THE GAP EYES KEEPS CATCHING

Proving something on the workshop is not proving it on the thing he opens. The gate now
walks **both**, and the cut half is built fresh from the current workshop by a new
`--out <path>` flag on the cutter.

**`--out` never touches the committed demo.** It does not open
`slices/BOHEMIA_DEMO.html` or its manifest, and it refuses outright if you point it
there. Rule 14(a) is untouched: only RUN re-cuts the demo, and what the deploy
publishes cannot change because of this flag. What it gives every lane is the ability
to **measure** the cut instead of the workshop. Before it, the only way to look at the
cut was to run the real cutter over the committed file and put it back afterwards,
which is one crash away from a dirty tree.

## FOUR THINGS ABOUT THE CUT THAT THE ALPHA NEVER TAUGHT ME

Every one of these silently turns a check into nothing, and all four cost me a run
before I found them:

1. **The demo's iframes have no name.** Any gate that finds a frame by `name` works on
   the alpha and finds nothing on the cut. This is probably the single reason a lane
   can be green on the workshop and wrong on the thing he plays.
2. **More than one frame answers to the city's URL and only one is alive.** `find()`
   took a dead one and reported an empty world for eighty seconds.
3. **An eager poller starves the boot.** Asking twelve frames every 400 ms on a
   single-threaded page kept the world from ever coming up — the same shape as EYES'
   own finding that their sampling loop cost 8% of the freeze.
4. **The city frame does not exist for the first half minute.** At 6 s the frame list
   has no city in it at all; by 29 s it does.

So the live city is **whichever frame answers**, asked gently, after a wait.

## PROOF

`dev_strip_gate` — **19 passed, 0 failed**, across two surfaces: THE WORKSHOP and THE
CUT HE OPENS. Both read the same thing:

```
strip 111 px · the three not on screen · none deleted · the verbs still there
SHOVE GOON · no developer strings · all three reachable behind the gear and still acting
```

**Mutation-proved, and the point of the mutation is the cut half.** Put the workshop
back on the fight and **both** surfaces go red, four arms each, symmetrically — so the
cut half is not decoration, it bites on its own.

Checked alongside: the cutter's own `--check` still passes, and the committed demo's
md5 is unchanged before and after a full gate run.

## THE DIAL

Nothing in a fight changed this round. This is an instrument and a flag.

## ROUTED

- **For every lane, and for the coordinator:** a gate that finds a frame by `name`
  cannot see the demo. If a lane's proof is on the alpha only, it is not yet a proof
  about the thing he opens — and `node tools/bohemia_cut_the_demo.js --out /tmp/x.html`
  now makes the cut measurable in one line, without touching what the deploy ships.
- **EYES:** the strip item on the stranger's list is answered on the cut as of
  `27ef790e`; this round adds the gate that keeps it answered.

---

**Tool:** `tools/bohemia_cut_the_demo.js` (`--out`, read-only) · **Gate:**
`gates/dev_strip_gate.js` (both surfaces) · **Tab:** COMBAT, and any fight you walk
into from CITY.
