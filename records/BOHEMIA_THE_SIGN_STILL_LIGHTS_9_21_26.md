# THE SIGN STILL LIGHTS
FACTIONS lane · [horror signs] · rule 22 (cook every round) + rule 20h (analog horror) · 9/21/26

## THE ONE LINE
Rule 22 landed and this lane's job in it is **a sign**. So a sign got made: a dead
business's pole sign, still standing, still lit off whatever circuit survived, with the
block owner's colour on the board where the notice used to go. Six of them, drawn by one
function, registered in the VOTE tab. **It was wrong four times and every one of them was
caught by looking at the picture**, which is the only part of this record worth keeping.

Nothing went to the demo or to the alpha's play tabs. Rule 18(b) holds; rule 22(b) says the
making does not.

## WHY A SIGN IS THE RIGHT COOK FOR THIS LANE
The row asked for territory read through the analog horror law: *the faction's colour on an
institution's sign that still lights up, the flag where the notice used to be.*

That lands in DIRECTION's register without arguing with it. Their three homes name **dead
media objects, act 1** first, and their strongest single image is a lit screen in a room
with nobody in it. A roadside sign is that, outdoors, at the size of a building. And the
tone comes for free from Bohemia's own premise rather than from a costume: the motel sign
still says VACANCY, in the motel's own letters, and nobody has worked there in ten years.
**The machines are still talking after the people stopped listening**, which is the genre's
whole sentence and already this game's setting.

And it does a job COLOUR IS TERRITORY has been asking for since 8/26. The board is the one
part of a real sign that changed every week anyway. Whoever holds the block owns it now.

## WHAT WAS MADE
`slices/BOHEMIA_THE_SIGN_STILL_LIGHTS_9_21_26.html`, 23 KB, self-contained, drawn on a
canvas at art size 84x100 with no image files at all (BUILD SIZE is already over budget and
six PNGs would have cost more than the whole page).

**ONE FUNCTION DRAWS EVERY SIGN**: `drawSign(ctx, business, holderHex, lit)`. That is the
point of the shape. The day the hold lifts, the world calls the same function with the real
owner out of the turf map and the real circuit out of the power grid, and nothing about the
picture gets re-decided.

Six dead businesses, each on a different crew's block: SUNRAY MOTEL, WASH-O-MAT, VALLEY
CLINIC, FIRST STATE BANK, CHAPEL OF THE SANDS, DESERT MARKET. Every line on them is
something a real roadside sign says, too calm: VACANCY, OPEN 24 HRS, WALK-INS OK, TIME &
TEMP, ICE COLD BEER. Names and lines are drafts, his to rewrite.

The faction colours are **copied, never chosen** — `engine/BOHEMIA_faction_colours.json`,
measured off the wardrobe he dressed. Nothing on this page picks a faction's hue.

## THE FOUR TIMES IT WAS WRONG, IN ORDER
Each one was invisible in the code and obvious in the picture.

**1. SUNRAY MOTEL read SUNRAY HOTEL.** The name was drawn in a 3-pixel-wide face and at
three pixels across there is no room for the middle of an M, so it collapses into an H. The
entire point of this tone is an institution that is **still perfectly readable** with nobody
left to read it. A sign you squint at is not a mood, it is a broken sign. The name is a 5x7
face now.

**2. Then VACANCY read VACAHCY**, one size down, for the same reason. Fixed the way narrow
faces have always fixed it: M, N and W run one column wider than the rest. That is not a
compromise, it is what a condensed face does.

**3. Then every small line on all six signs came out as mush** while the big names beside
them were perfect. **The bit mask was wrong**: a 3-wide glyph's leftmost bit is 4 and a
4-wide glyph's is 8, and the code read 2 and 4. That is the shape of bug that survives a
glance — the thing you are looking at is fine and the thing beside it is garbage.

**4. AND THE WHOLE OBJECT WAS FLAT, WHICH IS A LAW.** The 45 DEGREE ART LAW (7/17): *every
original art Claude draws is seen from the world's three-quarter 45 view like the corpus,
NEVER flat side-on like a 2D scroller. Ellipse cross-sections, sky-lit visible tops, bands
bow toward the viewer.* Three cuts of this sign were a front elevation — a perfectly nice
2D-scroller prop that would have sat in a three-quarter world looking like a sticker.

Every solid is a box with three faces now: the front you read, the **top** which is sky-lit
and lighter, the **side** turned away and darker. The ground under it is a diamond, the same
shape as a tile, and so is the contact shadow. One primitive (`box3d`) draws all of it, so
it cannot drift back to flat. Caught by comparing it to the world before calling it done,
which is exactly what that law is for.

Three smaller ones on the way: a name too long ran off both edges of the chapel (a line that
does not fit the big face drops to the small one, which is what a real sign does with its
second line); the same stain sat in the same corner of all six and read as one sticker
pasted six times (it is placed off the business's own name now, fixed per sign, different
between them, nothing random); and the scale drawing was 150 px wide for a 201 px sign, so
the scale drawing could not show the scale.

## AND ONE THING MEASURED, NOT GUESSED
**How big is it really?** Rule 21 (9/21) fixes a person at one size everywhere he walks:
about 100 px painted. A roadside pole sign is about 4.5 m against a 1.75 m person, so it
lands at **257 px tall on the same street** — 2.79x the art. Every letter survives. That is
why the type was worth fixing four times instead of being called atmospheric.

The page shows the sign at that true height beside a bar of person height. **No body is
drawn**: bodies belong to another lane and a fake one would be the exact slop this page
exists to avoid. A bar of the right height says the same thing honestly.

## THE FINDING, AND MY ANSWER TO IT
**Three of the crews are drab and a grey flag is not a flag.** Measured on the page: with
the Mob holding the board, *"somebody holds this block"* and *"nobody holds this block"* are
the same picture. Unlit, the grey board reads as a hole.

**My pick, built rather than asked**: the drab crews do not paint the board, **they take it
down**. An empty frame with the bolts still in it reads at any distance and in any light,
and it says something true about them: they do not advertise. It costs no colour and invents
no canon, because what a faction WEARS stays his and this is a fixture, not a wardrobe. It
is in the page as the third and fourth panels so he corrects it by looking, not by reading.

## WHERE HE SEES IT
The **VOTE tab**, in the alpha, behind the gear. Registered in the one registry as
`factions-the-sign-still-lights-9-21`.

## RULE 18 AND RULE 22, OBSERVED
Nothing pushed to the demo or to the alpha's play tabs. No demo cut, no build stamp, no game
file touched. One real thing made and registered where he votes, which is what rule 22 asks
for and what rule 18 still allows.

## [PENDING Paolo] — NOTHING NEW
The drab-crew answer is a default I built, not a question. ECONOMY's Q47 finding (one faction
holds all the valley's running water, and it is Remnants, Homeless or Church) is noted on the
row for when the hold lifts; a water authority is the single best institution left to sign.

## THE THING TO CARRY FORWARD
**A drawing is checked by looking at it, and nothing else finds these.** Every one of the four
faults passed every test a machine could have run: no errors, valid canvas calls, correct
colours, right dimensions. The M was an H, the mask was shifted, the object was flat. The
only instrument that works on a picture is a picture.
