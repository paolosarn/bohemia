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


---

# POSTSCRIPT, SAME DAY: THE ARCHITECTURE MOVED UNDER THE GATE

Hours after this was written, `3ef222f` measured the thing nobody was watching:

    slices/BOHEMIA_ALPHA_0_9.html was 38.7 MB, gaining ~1.4-2.1 MB a day.
    GitHub REJECTS any file over 100 MB. Not a warning -- the push fails.
    ~43 DAYS UNTIL NO LANE IN THE FLEET COULD PUSH THE GAME.

96% of that file was two base64 blobs, and base64 costs 33% on top of what it
carries. `CITY_B64` was lifted out to `slices/BOHEMIA_CITY_WORLD.html`, loaded by
`fr.src` like the four sibling pages that already worked that way. **38.7 MB ->
2.92 MB. First load 12,561 ms -> 398 ms.**

**So this gate's premise — "the alpha is four inline blobs" — was false within
hours of being written.** It went red on the merge, correctly, because CITY_B64
was no longer a const.

**The check did not get smaller. It got bigger.** Not truncated, no merge markers,
still parses, has not collapsed: every one of those is exactly as true of a
sibling page as of an inline blob, and there are now **eight** big documents
instead of four — three inline blobs and five pages, each one a surface he opens
from a tab. 41 claims became **70**.

A gate that had insisted on the shape it was born with would have been a gate
testing something nobody ships. Re-proven on the new shape: dropping one `</div>`
from the extracted world page is caught as
`BOHEMIA_CITY_WORLD.html is not truncated: <div> balances (64 open / 63 close)`.

---

# AND THE EXTRACTION LEFT 24 GATES BEHIND

Lifting `CITY_B64` out of the alpha was the right call and the numbers prove it
(38.7 MB -> 2.92 MB, first load 12,561 ms -> 398 ms, ~43 days off a hard push
limit). But **81 files in `gates/` and `tools/` referenced `CITY_B64`**, and the
suite went from 12 failures to **40**.

Two mechanical causes, both the same shape as the CITY-tab deletion earlier the
same day: *a consumer still looking for something that moved.*

### 1. gates that read the payload out of a const that no longer exists
A helper named `cityBlob(alpha)` is copy-pasted across a dozen gates. One
injection at the top of each — page first, old scan as the fallback — fixed them
all at once.

### 2. gates that find the world FRAME by `srcdoc`
    fr => /srcdoc/.test(fr.url()) && fr !== page.mainFrame()
The frame is loaded by `fr.src` now, so its URL is a real path and this matched
nothing. Thirteen gates failed on *"the world frame booted"*, which reads like the
game is broken when it is the test that is. Now matched by name or by either URL
shape.

### repaired, each verified green standalone

| | |
|---|---|
| payload readers | city_kit_binding, dooranim, doorjamb, footstep, full_res, run_spawn, street_source, full_pixel, hero_wire, city_tab, navcluster, houseart, zoombuild |
| frame finders | doorway, everydoor, ewdoor, interior_wall, shadow, stepinside, traffic_signal, zoomseam (+ the above) |
| tools | `bohemia_city_zoombuild_patch.py`, `bohemia_city_dropin_on_the_street_patch.py` (mine — it crashed with *"substring not found"*) |
| blob-count check | combat_lab: CITY is now checked **as a page**, the other three stay strict inline |

**40 failures -> 16.** The 11 that remain are the standing character/life set plus
WALL CLASS, CANVAS SCALE and INTERIORS, all verified red on pristine main before
this turn.

`D1 KERB` is left deliberately: it is a content ratchet tripping on courthouse and
cityhall, and the cause is main's own `2fc2e3f NO CANOPIES` ruling on the four
civics. Raising another lane's ratchet ceiling is a design call, not a merge fix.

## THE PATTERN, THIRD TIME TODAY
Delete the CITY tab, four gates navigate by a button that is gone. Move the world
out of the alpha, twenty-four gates read a const that is gone. **An architecture
change is not done when the thing works — it is done when everything that pointed
at the old shape has been found.** The grep that finds them takes a minute; not
running it costs the whole fleet a red suite it cannot tell apart from real
breakage.


---

## POSTSCRIPT 2: I DID THIS REPAIR AND THEN THREW IT AWAY

The 24-gate repair above is real and it worked (suite 40 -> 14, each gate verified
green standalone). **Another lane landed the same repair concurrently and did it
better.**

Mine: a page-first read injected into each of the twenty-four copies of a
pasted `cityBlob()` helper.
Theirs: **one** `CITY_APP.read()`, a single source of truth.

Theirs is what FACTORY LAW asks for and what I should have written the moment I saw
the same helper copy-pasted a dozen times — the duplication was the smell, and I
patched every copy instead of collapsing them. On the rebase I took theirs for all
24 files.

**Keeping mine would have been ego, not engineering.** Two lanes racing the same
mechanical fix is a coordination cost the fleet pays for moving fast in parallel;
the cheap part is noticing and dropping yours, and the expensive part would have
been arguing for it. They had also already removed `chapel` from `icon_gate`'s OWED
list — the same one-word ratchet slip I found independently.

The part of that work that survives is the part nobody else had: this record, and
the fact that the pattern got named.
