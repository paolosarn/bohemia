# THE LINK IS NOT TRUE RIGHT NOW
**8/6/26. WORLD lane, but this belongs to nobody's lane, which is why nobody caught it.**

---

## THE FACT

**GitHub Pages has failed to deploy three commits in a row.** Measured from the API, not
guessed:

| commit | what it was | deploy |
|---|---|---|
| `c8cf238` | THE VALLEY CENSUS (WORLD, 8/5) | **completed / success** ← the last true one |
| `ba913e6` | A CHECK POINTED AT THE WRONG DOOR | cancelled |
| `d51186d` | HE BOUGHT 8,674 TILES, JUDGED 2,604 BY HAND | — |
| `65a84f9` | TASTE CHECK on the exterior cook | **completed / FAILURE** |
| `b09f3ab` | TWELVE NAMED PLACES (WORLD, this turn) | **completed / FAILURE** |

**The live site is serving `c8cf238`.** Everything since — another lane's art-tab and
exterior-cook work, and this lane's twelve landmarks — is on `main` and **is not on the
page Paolo taps.** The ONE-LINK LAW says the link is the door; right now the door opens on
a build from before yesterday evening.

## WHY THIS IS CROSS-LANE AND NOT A BUG IN ANY ONE OF THEM

The 8/6 record `BOHEMIA_THE_OTHER_CLOCK_8_6_26.md` already measured the repository at
**900 MB packed, growing 32.5 MB/day, ~4 days from GitHub's 1 GB soft warning.** That lane
found the clock. **This is the alarm going off**, and it went off in a place neither lane
looks: the deploy, not the push. The push still works fine — that is exactly why it is
invisible. Every lane's gates go green, every lane's commit lands on main, and the page
stops changing.

Tracked working tree today: **496 MB**, of which the four `BOHEMIA_HD_TILE_REPO_part*.txt`
banks are **173 MB** and `slices/BOHEMIA_CITY_WORLD.html` is **29 MB**. Pages builds and
publishes the whole branch, not just `slices/`.

## WHAT IS NOT THE ANSWER

- **Not a cache-buster.** The ONE-LINK LAW is absolute and the URL never changes.
- **Not deleting another lane's banks.** Those are 8,674 bought tiles and 2,604 hand
  judgements. A green bought by deleted evidence is worse than the red — that is already a
  written failure in this repo's ledger.
- **Not "wait for the next push to fix it."** Three consecutive failures is not a flake.

## WHAT THE ANSWER LOOKS LIKE, AND WHY IT IS NOT MINE TO PICK

Pages only ever needs to serve `slices/`. Everything else in the tree — 470 MB of banks,
records, tools and engine source — is published for no reason at all. The shapes that fix
that are: publish from a **separate branch or a `/docs` folder** that carries only the
slices; or move the tile banks to **release assets or Git LFS** so they leave the published
tree; or both.

Each of those changes how every session pushes, so it is a **repo-wide structural call**
above one lane, and it touches the ART lane's banks. **[PENDING, Paolo's call]** — flagged,
measured, and not acted on unilaterally.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*

---

## UPDATE, SAME DAY: THERE ARE **TWO** CAUSES, AND THE SECOND IS A DEADLOCK

`_config.yml` fixed the first one (496 MB published → 170 MB). Watching the deploys
afterwards surfaced a second, and it is worse because no amount of shrinking fixes it:

| build | started | ended | outcome |
|---|---|---|---|
| `6bc728d` (the fix) | 17:44:25 | 17:45:17 | **cancelled** |
| `53c82ad` | 17:45:14 | 17:50:23 | **cancelled** |
| `a5a86e8` | 17:50:20 | 17:53:02 | **cancelled** |
| `d4664e0` | 17:53:00 | 18:08:32 | **cancelled** |
| `47dedea` | 18:08:28 | 18:21:04 | **cancelled** |

**Every single one killed by the next lane's push.** The lanes are pushing to `main`
roughly every **13 minutes**, and a Pages build takes longer than that, so the build is
cancelled and restarted forever and **no build ever reaches the finish line.**

This is named in the 7/20 BUILD STAMP + DEPLOY VERIFY law — *"parallel-session push storms
make GitHub Pages CANCEL in-flight builds, so the live site can lag many pushes behind"* —
but it was written as a delay to wait out. It is not a delay any more. At the current push
cadence it is a **standing deadlock**: the site cannot update while every lane is working.

The size fix makes the build shorter and therefore more likely to fit inside a gap. Whether
it fits is not something one lane can decide, because it depends on how often the *others*
push. **The structural answers — a deploy that runs on a schedule instead of on every push,
or lanes batching their pushes — are repo-wide and above one lane. [PENDING, Paolo's call].**
