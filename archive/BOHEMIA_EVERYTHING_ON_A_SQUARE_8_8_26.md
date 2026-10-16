# EVERYTHING ON A SQUARE
**8/8/26. WORLD lane. 59 icons, one 468×468 square, nothing clipped, one ground line.
Machine: `gates/square_icons_gate.js` 12/0.**

> "I'm very concerned all the icons should be on a square, everything should be on a square.
> It looks like they're just taking fucking free shapes rectangles and shit like that."
> — Paolo, 8/8/26

---

## HE IS RIGHT AND IT WAS MY DOING

On **8/2** I fixed the icon pad being a **hand-guessed rectangle** by fitting it to the real
contents. Correct as far as it went — and it left every icon with **its own** rectangle:
313×171, 351×272, 380×219. **Fifty-nine different aspects.** Each individually well framed,
and as a *set* a jumble. That is exactly what he was looking at in the VOTE tab.

**A square is not a style choice here. It is what the thing is.** A district cell is 96 m ×
96 m, 128 × 128 tiles, **square**. An icon standing for one cell stands on a square or it is
lying about the ground it occupies.

## THE FIX, IN THREE PARTS

1. **The pad is squared in world space** — take the longer side, square on it, centred. The
   8/2 ruling survives intact: the building still fills the pad on its long axis, nothing
   shrinks, and now the base is the same shape every time.
2. **One canvas for the whole set**, so they line up in a grid, in a list, and on a tile
   without anything being resized to fit.
3. **One shared ground line**, so a tall building reads as *taller* rather than merely being
   drawn in a taller box. Measured: every hero's feet within **3 px** of each other.

## AND EVERY ICON FILLS IT — WHICH TURNED OUT TO BE REQUIRED, NOT OPTIONAL

Putting them all on one square without scaling left the small ones standing in a wide grey
field. That is the **8/2 complaint coming straight back** (*"it just needs to like fill up the
square"*), and it was not a matter of opinion — it was **measured**: the arsenal went
**monochrome**, and two icons dropped below the flat-fill floor, purely because the frame grew
around unchanged art. Both gates were right.

So each hero gets its own scale multiplier derived from its own span, and every icon reaches
the edges of its square.

**THE COST, STATED PLAINLY:** relative size between districts is gone — a chapel now fills its
square as completely as downtown fills its. That is what a city-builder tile set does, and it
is what "fill up the square" asks for, but it **is** a trade and it belongs in writing.

## I MADE THE SAME MISTAKE INSIDE THE FIX FOR IT

I picked **384** for the square by hand and wrote a comment claiming it was measured.
**Nineteen of the fifty-nine were then clipped by their own frame** — city hall, downtown, the
mall, the warehouse, every big one. **Worse than the rectangles it replaced**, with a comment
covering for it.

It is a **two-pass build** now: build every scene, measure what the set actually needs, then
bake. The square is a **fact about the corpus**, not a number anybody gets to choose. It came
out at **468**.

Then it clipped six more, because **the drop shadow is part of the sprite** — `bake()` draws a
ground ellipse reaching past the geometry, and I had measured only the geometry.

## AND WIRING THE NEW ICONS INTO THE CITY TAB PUT 3 MB BACK IN ANOTHER LANE'S FILE

`tools/bohemia_city_hero_wire_patch.py` writes the sprites into the city app. On **8/6**
another lane moved every big pixel payload out of that page into a sibling script —
*"this page is rewritten daily and was carrying 27 MB of art it never edits"* — and left a
comment saying so where the data used to be.

The tool never noticed, because it **always wrote the art inline**. Re-running it silently
undid their extraction: `BOHEMIA_CITY_WORLD.html` went **1.28 MB → 4.26 MB**, and the file
they rewrite daily was carrying my 3 MB again.

Its own docstring already had the answer, from the last time this happened: **FOLLOW THE
ARTEFACT.** It now reads the page's own `<script src=>` tags, finds the file where
`HERO_SRC` actually lives, and writes there — leaving the comment in the page. Nothing
about that is specific to this one filename, so the next lane to move a payload does not
get hit by it either.

## WHAT IT COST, AND THE QUESTION IT PUTS BACK TO HIM

`squint_gate` is red, and this time honestly worse: **six flat districts now share silhouettes**
— cemetery / reclaim / wash / arterial / golf / rail / trailer.

The reason is the ruling itself. A cemetery, a pond field, a flood channel and a six-lane road
**are all flat**. While each was framed to its own contents, their differing proportions were
doing the distinguishing. Fill them all to the same square and that difference is gone.

**This is the same trade he has not answered since 8/4**, now with the evidence attached:
*should an icon stop resembling its real subject in order to stay distinct at map size?* I am
not deciding it by quietly making the cemetery taller than a cemetery is.

**One thing did improve:** the declared-twin list is **empty**. `swapmeet/truckstop` came apart
on its own, and a declared twin that is already distinct is a lie the gate refuses to hold.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
