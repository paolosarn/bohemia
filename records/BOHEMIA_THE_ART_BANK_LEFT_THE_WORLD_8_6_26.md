# THE ART BANK LEFT THE WALKED WORLD — 28.2 MB → 1.0 MB
## 8/6/26. Paolo: "honestly im lazy today. Think outside the box."

He was asked to pick between four options for the repository ceiling and declined
to. Fair — so this turn picks, and picks the one with no workflow cost.

**None of the four were right for a lazy day.** Two of them (build-at-deploy, Git
LFS) change how every session ships. The third (delete old big files) saves
**nothing**, because git already holds every version forever and history cannot be
rewritten under six parallel lanes without breaking every clone in the fleet.

So the answer had to come from somewhere else: **why is that file 28 MB?**

---

## THE ONE LINE THAT WAS 74% OF THE FILE

    line 11021   const TP_TILES = {"concrete": ["iVBORw0KGgo...    20.92 MB

Plus `DOOR_ANIM` 2.54 MB, `HERO_SRC` 1.93 MB, `SIG_TILES`, `SA_TILES`,
`IN_DOOR_B64`, `JAMB_W`, `JAMB_E`. **27.1 MB of base64 PNG art banks.** The actual
game code and markup: about 1 MB.

> **THE VOLATILE PART AND THE HUGE STABLE PART WERE WELDED INTO ONE FILE.**
> The art almost never changes. The code is patched by string surgery several
> times a day by several lanes. Every code edit rewrote all 28 MB, and git stored
> it again — which is exactly why this page was the repository's top growth driver
> at **20.5 MB/day**.

This is the same fix the 8/2 lane made when they lifted the world out of the alpha,
applied one level deeper.

| | before | after |
|---|---|---|
| `BOHEMIA_CITY_WORLD.html` (rewritten daily) | 28.2 MB | **1.0 MB** |
| `BOHEMIA_CITY_TILES.js` (changes rarely) | — | 27.1 MB |

**No lane changes anything.** Patch tools still do string surgery on the world
page; the art they never touch simply is not in it. No Git LFS, no deploy-time
build, no history rewrite.

---

## PROVED BEFORE IT WAS APPLIED

On a scratch copy, both loaded side by side in a real browser at iPhone portrait:

```
ORIGINAL  cv 378x819  fit=true  TP_TILES=24 HERO=59 DOOR=10  drawn px=309582  checksum=981952
SPLIT     cv 378x819  fit=true  TP_TILES=24 HERO=59 DOOR=10  drawn px=309582  checksum=981952
```

Byte-identical output. Both show one pre-existing `ERR_CONNECTION_RESET` — which is
**why both were measured instead of one**. A single reading would have looked like
the split caused it.

---

## AND IT LEFT CONSUMERS BEHIND ANYWAY. THREE OF THEM.

I wrote about this trap twice today and then walked into it. The suite went 10 red
→ 13: **DOOR SWING, DOOR JAMB, HERO WIRE**. All three read the moved constants
straight off disk instead of through the shared resolver.

**And the cause was this morning's bug in a second form.** Four gates —
`dooranim`, `doorjamb`, `city_kit_binding`, `run_spawn` — declare `cityBlob` **twice**:

```js
function cityBlob(_a){ const x = require('./bohemia_city_app.js').read(); return x ? x.src : ''; }
function cityBlob(a){ ...reads the world file directly... }
```

In JavaScript **the last function declaration wins**, so the resolver was dead in
all four — the same "single source of truth that isn't" I removed from thirteen
gates this morning, wearing a different hat. The split simply exposed it, because
the direct reader stopped seeing art that had moved.

Fixed: the stale second declaration deleted in all four, and `hero_wire` (which
kept its own private list of where the city lives) routed through the resolver. It
went from 61 checks to **123** — it had never been seeing the whole document.

`bohemia_city_app.read()` now returns page **+** bank, so the split is a storage
decision and invisible to every consumer that asks properly.

---

## WHAT THIS DOES TO THE CLOCK — STATED AS A PROJECTION, NOT A MEASUREMENT

Measured 8/6: **900 MB, +32.5 MB/day, ~130 days to GitHub's 5 GB ceiling.** The
world page contributed ~20.5 of those 32.5.

Removing it should take growth to roughly **12 MB/day**, which is roughly **a year**
of runway instead of four months.

**That number is not in the gate and the gate still uses the measured 32.5.** A
projection that flatters the runway is precisely how a limit gets forgotten again.
The next real bare-clone measurement confirms it or refutes it, and
`records/BOHEMIA_REPO_BUDGET_8_6_26.json` carries the command.

**If the next measurement does not show the drop, the split did not do what it was
meant to and the runway is still ~130 days.** Written down here so nobody has to
take my word for it.

---

## THE LIFE LESSON UNDERNEATH (never preached in game)
Nothing gets heavy all at once. It gets heavy because the thing you carry every day
is bolted to the thing you never touch.
