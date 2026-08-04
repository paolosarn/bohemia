# THE PAYLOAD WALL — the thing we did not know we did not know (8/2/26)

Paolo, 8/2: *"We need to do so much that we know that we don't know you need to be able to
know that. WE HAVE 11 months of forward motion work we need to complete. Do what you have
to do next and know what comes after."*

`records/BOHEMIA_THE_BIG_MISSING_7_29_26.md` is the list of what we KNOW is missing. He
asked for the other list. So I went looking for what is not on it, starting with the one
file he actually taps.

---

## WHAT I FOUND, IN NUMBERS

| | |
|---|---|
| `slices/BOHEMIA_ALPHA_0_9.html` | **38.7 MB** |
| growth, measured off git | **~1.4–2.1 MB/day** |
| GitHub's hard file limit | **100 MB — the push is REJECTED, not warned** |
| **days until no lane in the fleet can push the game** | **~43** |
| first tap on weak LTE | **65 seconds** |

**Nobody had this written down anywhere.** Every lane would have kept shipping into it and
then one ordinary Tuesday every push in the project starts failing at once, on a limit
nobody was watching, with no obvious cause and no obvious fix. That is the shape of a real
unknown-unknown: not a hard problem — an **unwatched** one.

## WHERE THE BYTES WERE

| line | size | what |
|---|---|---|
| 6624 | **35.76 MB** | `const CITY_B64='…'` — an entire HTML page, base64'd, inline |
| 1014 | 1.35 MB | `COMBAT_B64`, same trick |
| everything else | **0.90 MB** | all the actual code and markup in the game |

**96% of the file was two blobs.** And base64 costs 33% on top of what it carries: that
35.76 MB of text was **26.82 MB of real page**, so roughly **9 MB of the alpha was the
encoding and nothing else.**

**The cheaper pattern was already in the same file, four times over.** RUN, SLICE, LIFE and
MAP all load their page from a sibling file with `data-src` and pay no tax at all. Only
COMBAT and CITY inlined a blob.

## THE FIX, AND WHAT IT MEASURED

`CITY_B64` is now `slices/BOHEMIA_CITY_WORLD.html`, loaded with `fr.src`.

| | before | after |
|---|---|---|
| alpha | 38.7 MB | **2.92 MB** |
| first load (HTTP, same-origin as Pages) | **12,561 ms** | **398 ms** |
| frame state after opening RUN | canvas 300×150, 3 body children | **identical** |
| console errors | none | **none** |
| days to the 100 MB wall | ~43 | **not on the horizon** |

**29× faster to open, and the world page is now fetched only when he opens the tab** —
which is how the other four tabs already behaved.

### THE PART THAT NEARLY WENT WRONG, WORTH KEEPING

**`file://` LIES ABOUT ORIGINS.** Tested locally the split looked broken — `same-origin:
false`, the parent could not read the frame. Chrome treats every `file://` document as its
own opaque origin, so an inlined `srcdoc` frame is same-origin and a sibling `src` frame is
not. On GitHub Pages both are `https://paolosarn.github.io/…` and the distinction does not
exist.

Served over a local HTTP server — the same origin model as production — the split is
**identical to the baseline in every measurement.** If I had trusted the `file://` result I
would have thrown away a 29× win for a bug that does not exist in the place the game runs.

**AND THE FIRST ATTEMPT DID BREAK IT, for a dumber reason:** that 35.76 MB line does not
end at the closing quote — the entire tab-click handler is tacked onto the same line.
Replacing "the line" deleted it and the app never opened. A file with 37-million-character
lines cannot be edited by the line; only by the literal.

## THE ALARM, SO THIS CANNOT COME BACK

`gates/payload_wall_gate.py`, registered as **PAYLOAD WALL**. It measures every tracked
file, projects the date off real git history, and fails at a **45 MB budget** — deliberately
below GitHub's 50 MB warning and well below the 100 MB wall, so the next person meets this
with weeks of room instead of on the day their push starts failing. It also names the
offending lines so the fix is obvious rather than a hunt.

**STILL WORTH A LOOK, reported by the gate and not fixed here:** the four
`BOHEMIA_HD_TILE_REPO_part*.txt` banks are **42.7–43.5 MB each**, just under the budget and
half way to the wall on their own. They are bank files rather than the alpha, so nothing
breaks today, but they are the next thing to hit it.

---

## WHAT COMES AFTER

1. **`COMBAT_B64` is still inlined at 1.35 MB** — the same one-line fix, and now proven.
2. **The HD tile banks** — 4 × ~43 MB. They will hit the wall eventually.
3. **Nothing else in the repo is near it**, measured, and the gate now watches all of it.

---

*BOHEMIA — the payload wall — 8/2/26 — PEOPLE lane*
*He asked what we don't know we don't know. It was that the project had about six weeks
before it could not ship at all, and that the game took a minute to open on a phone.*
