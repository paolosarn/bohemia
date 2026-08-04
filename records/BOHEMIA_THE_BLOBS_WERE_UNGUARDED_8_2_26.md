# THE ALPHA IS FOUR BLOBS IN A TRENCH COAT, AND NOTHING WAS GUARDING THEM
## 8/2/26

| blob | decoded | what it is |
|---|---|---|
| `CITY_B64` | 28,120,885 chars | the walked world + the city builder |
| `COMBAT_B64` | 1,055,197 | the combat slice |
| `RIG_B64` | 95,906 | the rig tool |
| `PREFAB_B64` | 10,612 | the prefab tool |

Four different lanes rewrite these **by string surgery**, every day: decode,
replace an anchor, re-encode. Every rebase resolves a 34 MB file by taking one
side whole. Nothing checked that what came out the other end was still a coherent
document.

---

## WHAT WAS ACTUALLY GUARDING THEM: PRESENCE AND A SIZE FLOOR

    ['RIG_B64', /^const RIG_B64='[^']+';?$/m, 100000, 'the embedded rig tool'],

"It exists and it is over 100,000 characters." **A stale re-encode passes both.
A half-merged one passes both. A truncated one usually passes both.** That is
precisely the damage this repo actually produces, and it was the one shape
nothing looked for.

---

## TWO THINGS TODAY PROVED IT, BEFORE THIS GATE EXISTED

### the game shipped as a black screen, twice
One `</div>` went missing and the whole game parsed as a child of the tap-to-enter
splash. The splash hides itself and takes everything with it. **Every gate was
green.** It took a person tapping the link to find it. The second time it also
wore a disguise — it presented as a dead COMBAT tab, and another lane spent a
bisect chasing a combat bug that was never a combat bug (every panel was 0x0).

### PREFAB_B64 could be replaced and nobody would ever know
Measured, not assumed. Changing one colour inside it left every plausible gate
green:

| gate | result with PREFAB_B64 silently altered |
|---|---|
| `alpha_loads` | 20 passed, 0 failed |
| `city_tab` | 64 passed, 0 failed |
| `rig_is_law` | 12 passed, 0 failed |

It had **no content check of any kind.**

---

## THE GATE

`gates/blob_integrity_gate.js` (suite: **BLOB INTEGRITY**, 41 claims). For every
blob, cheaply, no browser:

1. present, and decodes as base64 to real UTF-8
2. **not truncated** — `html` / `body` / `div` / `script` / `style` all balance
3. **no merge markers** — a blob is where a bad conflict resolution hides best,
   because nobody reads 28 million characters
4. **every inline script still PARSES** (compiled, never executed)
5. **has not collapsed** — a floor under each decoded size

### proven against the failures that actually happened

| mutation | caught as |
|---|---|
| the real 8/2 black screen: drop one `</div>` from the city blob | `CITY_B64 is not truncated: <div> balances (64 open / 63 close)` |
| a bad merge resolution left inside a blob | `COMBAT_B64 CARRIES NO MERGE MARKERS` |
| a string-surgery patch that drops a brace | `RIG_B64 every inline script PARSES — Invalid destructuring assignment target` |

Each names the blob and the damage, in about a second, instead of a person
tapping a link and seeing black.

---

## THE SECOND DRAFT, WHICH IS THE PART WORTH KEEPING

The first version of the truncation check walked every tag with one clever regex
and reported **three truncated blobs**: CITY_B64 at 63 open vs 64 close,
COMBAT_B64 at 60/61, RIG_B64 missing a `</script>`. That is a serious accusation
about three files four lanes depend on.

**The blobs were fine. My ruler was bent.** Counting the plain, boring way said
64/64, 61/61 and 1/1. The clever regex was dropping one open tag per document.

*Fix the ruler, never the target* (8/1). In a checker more than anywhere else,
**simple and verifiable beats clever and wrong** — a bent checker does not just
fail to catch bugs, it invents them, and an invented bug costs somebody a day
chasing a file that was never broken.

That is now the third time in two turns that a number which looked like a defect
was my own instrument being wrong. It is worth saying plainly: **before reporting
a defect, test the instrument on something known-good.**

## ON "IT PARSES IS NOT IT RUNS", WHICH CUTS BOTH WAYS
Paolo, 8/2, on a black screen and one red line: it parses is not it runs. True,
and the run gates stay the ceiling. But **it runs is not it parses** either — a
string-surgery patch that drops a brace produces a file that boots far enough to
look fine and dies on a path nobody walks that day. Parsing is the floor. Cheap,
instant, and it catches the damage before anybody opens a browser.

---

## THE LIFE LESSON UNDERNEATH (never preached in game)
The things nobody reads are the things nobody guards. That is not a coincidence,
it is the same fact said twice.
