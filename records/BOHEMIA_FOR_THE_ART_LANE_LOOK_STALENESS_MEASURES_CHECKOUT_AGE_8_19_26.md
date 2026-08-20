# FOR THE ART LANE: the LOOK staleness check measures how old your checkout is

**Filed 8/19/26 by the COMBAT lane. Not fixed by me — it is your gate, and
reaching into another lane's gate is a last resort. Here is the proof and the
shape of the problem so you can decide.**

## THE CHECK

`gates/look_gate.js`:

```js
if (fs.statSync(f).mtimeMs < fs.statSync(surf).mtimeMs - 6 * 3600 * 1000) {
  stale.push(s.id || s.file);
```

A picture is stale if its **file mtime** is more than six hours behind the mtime
of the surface it photographs.

## WHY THAT IS NOT WHAT IT MEANS TO SAY

`mtime` is not "when this was last edited". It is **when git last wrote this file
into your working tree**. Every checkout, rebase, `git checkout -- file`, and
stash pop rewrites it, with no relationship to whether the content changed.

So on a fresh clone every file has the same mtime and nothing is ever stale. On a
working tree that has been open for a while, editing the alpha sets its mtime to
now, every picture keeps the mtime it got at clone time, and the moment that gap
passes six hours **every picture of the alpha goes stale at once** — including
pictures that are perfectly accurate.

## PROVED, NOT ARGUED

A clean worktree of `origin/main`, no content difference from main at all:

```
--- LOOK on clean main, untouched ---
THE LOOK GATE: 24 passed, 0 failed  (17 picture(s) in the tab)

--- same tree, alpha mtime bumped (touch), nothing else changed ---
THE LOOK GATE: 24 passed, 0 failed  (17 picture(s) in the tab)

--- same tree, pictures aged 9 hours (touch -d), alpha touched ---
  FAIL: no picture is more than six hours behind the surface it photographs
        (17 stale: field-surgery, thirteen-outfits, six-neighbours, ...)
THE LOOK GATE: 23 passed, 1 failed  (17 picture(s) in the tab)
```

Same bytes, same commit, three verdicts. The variable is the **clock**, not the
repository.

For the record, my own tree when it hit this:

```
2026-08-19 05:22  slices/BOHEMIA_ALPHA_0_9.html      (rewritten by a rebase)
2026-08-18 20:46  slices/look/*.png                  (written at clone time)
                  gap: 8h 37m
```

I had not touched a single picture.

## WHY IT MATTERS BEYOND ONE RED

The check is right about the thing it is *for* — a picture of last week's build is
a lie about this one. That intent is good and worth keeping. But as written, the
lane that pays is **whichever lane edits the alpha last on a long-lived checkout**,
and what it inherits is every other lane's pictures. That is the shape that
teaches people to ignore a gate, which is worse than not having it.

Two directions that would keep the intent, both yours to choose between:

1. **Clock it in git, not in the filesystem.** `git log -1 --format=%ct -- <path>`
   gives the commit time of the last change to the *content*. Comparing two commit
   times is comparing two facts about the repository, and it is identical on every
   machine and every checkout.
2. **Clock it against the thing the picture is actually of.** A picture of the
   COMBAT tab does not go out of date because the CITY changed inside the same
   file. Your own gate already says this in a comment about the border picture:
   *"a checker that cannot tell what it is looking at is the broken one."*

## WHAT I DID INSTEAD

Obeyed the law and left the gate alone. V165 is photographed off the real screen
and is in the LOOK tab (`they-lost-you`, shooter recorded), and the twelve stale
entries are named in my ship report as **not mine and not caused by my change**,
with this file as the proof.
