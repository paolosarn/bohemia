# DEMO IS CURRENT, AND THE GATES WERE TESTING THE WRONG BUILD (RUN, 9/5/26)

VAMILY job `[demo current]` / DEMO-IS-CURRENT. The row: *"prove the demo cut
carries the same city file as the workshop on every ship, by hash, in a gate;
today it is re-cut by hand."*

The row got done. It also turned up something bigger on the way, and that is the
part worth reading.

## THE ROW ITSELF

**The shell half was already held, and I checked rather than believed it.** The
cut tool's own header claims `demo_build_gate` re-runs it with `--check` and
fails if the committed demo is not byte-identical to what it produces. It really
does (`gates/demo_build_gate.js:160`). This repo has spent a month finding
comments that promise enforcement nobody wired, so that verification was not
optional.

**The city half was held by nothing.** The walked world is not cut into the
demo, it is **loaded**: both surfaces declare `const CITY_SRC =
'BOHEMIA_CITY_WORLD.html'`, so today they share the world by construction, and
no test anywhere said so. Meanwhile there are twenty-odd old slices sitting in
the same folder -- `BOHEMIA_RUN_CURRENT.html` is 22 MB and was touched today. A
demo re-pointed at one of those hands a friend a stale valley, and **there is no
symptom until somebody plays it.**

### How the hash claim is made honestly

Hashing the frame's DOM would be wrong on its face: the demo injects a
stylesheet, so the two DOMs are *supposed* to differ. What must be identical is
the city's own code. So the gate reads five of the city's functions back **as
source, from inside each running frame** -- what the browser actually parsed and
is actually executing -- and hashes that. Injected CSS cannot move it. A stale
or forked city file cannot help but move it.

## *** THE BIGGER THING: EVERY GATE THAT OPENS THE DEMO OFF DISK IS TESTING A BUILD NO PLAYER GETS ***

The demo does not edit the city file -- ONE SYSTEM, ONE SESSION -- so the two
things that make it safe for a stranger are **injected into the city frame from
the demo side**, and both are same-origin operations. A `file://` parent cannot
reach into a `file://` frame. The injection lands in a catch and silently does
nothing.

Measured on the built demo at 390x844:

| | opened off disk (how gates test it) | served over http (what a player gets) |
|---|---|---|
| walk pad | 42x42 | **44x44** |
| the builder drawer | **VISIBLE** | hidden |

**The drawer is the one that matters.** It opens REROLL, which regenerates the
world underneath a stranger's own session -- a destroyed playthrough, not a
cosmetic leak. On the surface our gates measure, it is sitting right there in
the toolbar.

The cut tool's own comment predicted this exactly: *"if a browser ever refuses
... the catch leaves the page exactly as it is today."* Written down correctly,
enforced by nobody.

## AND IT WAS MY OWN GATE

`a_stranger_opens_it_gate.js` shipped one round ago driving `file://`. Its whole
job is "what does a stranger meet," and it was reporting green about a screen
with a destroy-my-game button on it. Worse, I had written up the 42px pad in
that round's record as a real measurement of the demo and reasoned carefully
about whether to call it a blocker. **The number was an artefact of my harness.**

Seventh broken ruler on this lane in two weeks, and the worst kind so far: it
was measuring the harness while claiming to measure the game, and it did it
inside the one gate specifically built to see what a player sees.

It is served now. The pad floor is the real 44 rather than the disk 42, and the
drawer is a claim rather than a comment.

## A FLAKE, AND WHY THE FIX IS NOT A RETRY

Moving to http surfaced a second thing: the same unmutated build read **17/0 and
then 15/2** on the next run. A card arrived during the seconds the flood fill
takes and sat over the pad.

The lazy fix is a retry loop around the assertion. The right fix is to notice
the assertion was wrong: **cards are how this game talks, and one can arrive at
any moment.** "No card ever covers the controls" is both flaky and false. The
real claim -- the one the historical bug actually broke, when a card's own
backdrop ate the pad and could not be escaped -- is that **a card is dismissible
and the pad works once it is gone.** So the gate clears cards wherever it needs
a clear screen, reports which ones it met, and asserts they can always be
dismissed.

Checked the obvious risk of that change: a claim made tolerant of cards must
still catch a scrim that is not one. Re-ran the scrim mutation afterwards; it
still turns 2 red and still names the culprit.

## WHAT SHIPPED

**`gates/demo_is_current_gate.js`, 16 checks, DEMO CURRENT.** Both surfaces name
one world and it is the same name; the committed demo is byte-identical to a
fresh cut; the published set carries slices; both frames really loaded that
file; the city's own code hashes identically live out of both; the save format
agrees; the drawer is hidden from the stranger and kept in the workshop; and the
demo's pad is the served size.

**`gates/a_stranger_opens_it_gate.js`, 15 -> 18 checks.** Served instead of
opened, pad floor raised to the real number, the drawer added as a claim, and
card handling made honest.

### Mutation proof

- Point the demo at a stale slice (`BOHEMIA_RUN_CURRENT.html`) -> **7 red**, and
  the message names the file it was pointed at.
- Drop **only** the drawer-hide from the demo's injected CSS -> **2 red** in
  DEMO CURRENT, **1 red** in STRANGER OPENS, printing `read: true`.
- A transparent scrim over the walk pad -> **2 red**, naming the culprit by id.

## RESULT

    DEMO CURRENT 16/0 (new) · STRANGER OPENS 18/0 (was 15/0)
    DEMO BUILD 25/0 · THE THUMB 12/0 · WHOLE DEMO 23/0

No game code changed. No approved pixel moved. The 42 -> 44 pad and the drawer
hide are the PLUMBER's work, already shipped from the demo side; this round only
built the instruments that can see them.

One red in the neighbourhood is **not this lane's**: FACE THUMB fails on a face
candidate bank 146 hours behind the alpha, which is a CHARACTER/COOK rebake and
touches nothing in these three files.

## WHAT THE NEXT ROUND SHOULD KNOW

Any future gate that drives the demo must **serve** it. Off disk, the demo is
not the demo. That is now written into both gate headers so it cannot be
rediscovered a third time.
