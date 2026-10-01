# EYES AND EARS -- [fight floor measured] -- ROUND ONE OF TWO: SCHOOL
## NO MEASURING THIS ROUND. This is desk research, armed for round two.
### 10/1/26 -- session eyes-5vql33

Row (rule 46f, Paolo 10/1 direct: "the tiles below the people dont look good"): through the one
driver, in a real fight, count the board's pixels into ground art (from the banks) vs flat fill
vs painted shapes (ovals, diamonds, discs, text) vs cover blocks; report the painted-pixel size;
post the number now as the BEFORE, and again every time COMBAT ships [house tiles back]. Green
when painted shapes are 0% and ground art is the majority of the board.

---

## THE PREMISE CHECK RULE 12 ASKS FOR

This is his own complaint, said once, plainly, about a screen he was looking at -- there is no
"does the thing still exist" question to ask first the way a three-week-old cook needed one.
What school CAN check, and did: `tools/bohemia_house_tiles_back_patch.py` (COMBAT's own
[house tiles back] work, the fix this row exists to measure against) is a real, present file,
and the fight board still renders through the combat module this lane has driven before
(tools/bohemia_eyes_touch_to_sound.js, this lane's own prior tool, already proved a real fight
is reachable with a scripted dispatch). The surface to measure is real and reachable.

---

## WHAT THE CRAFT CALLS WHAT HE IS LOOKING AT

**He is describing PROGRAMMER ART, a named, long-documented thing, not a vague complaint.**
Programmer art is the standard term for placeholder game assets -- "characters and objects made
of primitive shapes with high-contrast colors... meant to be replaced with a more consistent
art style later" -- made by programmers filling a gap before a real artist's asset exists.
[Programmer art](https://en.wikipedia.org/wiki/Programmer_art). The row's own list of what to
count (ovals, diamonds, discs, text) is a textbook description of exactly this category: simple
geometric primitives drawn directly by code (`ctx.arc`, `ctx.fillRect`, `ctx.fillText`), standing
in for a sprite that has not shipped yet.

**Real production tracks this with a checklist, not a feeling, and the discipline is in WHEN you
count something as done.** Studios that manage placeholder content keep a running list of every
placeholder asset, when it went in, and when it is due to come out, specifically so nothing gets
forgotten once it blends into the background of a build people are used to looking at. And the
honest-completion rule real teams use is blunt: count what is actually **finished, polished,
tested, and working in a build** -- not "designed," not "coded but not integrated." [The
Developer's Dashboard: Tracking Progress When You Can't See the Finish Line](https://itch.io/blog/1412152/the-developers-dashboard-tracking-progress-when-you-cant-see-the-finish-line).

**Both sources point at the same two things this row already asks for, independently arrived
at by real studios long before this one:** (1) a number now, as a dated BEFORE, so the
placeholder is a tracked, named thing with a start date rather than a vibe nobody wrote down; and
(2) re-measuring against the REAL RENDERED BOARD each time the fix ships, never trusting that a
fix landed just because a commit says it did -- "finished" is what a screenshot proves, not what
a commit message claims.

---

## WHAT ROUND TWO IS ARMED TO BUILD, NAMED SPECIFICALLY

1. **Reach a real fight** the way this lane already knows how (reuse, not reinvent): the shared
   driver gets to the door, this lane's own prior work in [phone latency] proved a scripted
   dispatch can reliably reach the fight's own start sequence when a real pointer cannot.
2. **Hook the canvas the same honest way this lane has done before** (the `drawImage` wrap from
   `tools/bohemia_eyes_map_reads.js`, extended): wrap `fillRect`, `arc`, `ellipse` and `fillText`
   as well as `drawImage`, so every paint on the board canvas during one full render is caught,
   not just the sprite draws.
3. **Bucket every paint by what kind of call made it**, not by guessing from a screenshot:
   `drawImage` with a source that traces back to a bank texture file = ground art; a flat
   `fillRect` covering a whole tile with one solid colour and nothing else on it = flat fill; an
   `arc`/`ellipse`/`fillText` call on the board = a painted shape, named the way the row names
   them; anything recognisably a cover/obstacle sprite = a cover block. Report both a pixel count
   and a percentage of the board's own area, the same two numbers DIRECTION's own reference-check
   work already treats as the honest reading (own-pixels, not a screenshot's blurred ones).
4. **State the painted-pixel size** (the row's own "3x3 today" is a claim to verify, not a given
   -- measure it off the real canvas, the same discipline [the sign] just proved matters: a
   number that was never re-measured is exactly the kind of claim that goes stale).
5. **Write the number down as a dated BEFORE**, in its own small record, so the SAME check run
   again after COMBAT ships [house tiles back] is a comparison against a real baseline, not a
   fresh impression.

This lane does not decide whether the placeholder shapes are acceptable for now or must go
immediately -- that is COMBAT's and the coordinator's call. Round two's job is the same as every
round in this lane: put a number beside what a stranger's eye would see, on the real board, once.

---

## ROUTED

Nothing. Nothing was measured this round; there is nothing yet to bounce back.

## SHIP TEST FOR THIS ROUND

School asked what the craft calls a board that still shows primitive shapes instead of finished
ground art, and how real studios keep such a thing from quietly becoming permanent. Found:
programmer art is the named category his own description matches exactly, and the real-world
fix is the same shape the row already asks for -- a dated before, and a re-measure tied to the
real fix landing, never a feeling. **Round one SHIPPED. Round two measures.**
