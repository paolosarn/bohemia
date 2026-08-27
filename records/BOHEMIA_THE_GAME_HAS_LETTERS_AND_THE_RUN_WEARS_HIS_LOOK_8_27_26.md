# THE GAME HAS LETTERS, AND THE RUN WEARS THE LOOK HE PICKED
# 8/27/26 · UI lane · TAB: UI (and you see it in RUN)

He answered the vocabulary page twice today. At 06:07 the corner, the line, the
colour and the letters. At 14:12, PRESSED.

Between those two messages his verdict lived on a judge page and NOWHERE ELSE.
The game he actually plays was still wearing the old chrome, and every gate in
the repo was green through all of it. **A ruling that only reaches a record is a
ruling that did not ship.** That is what this turn fixed.

---

## 1. THE GAME HAD NO LETTERS. NOT A FONT WE DISLIKED, NONE AT ALL.

`slices/BOHEMIA_ALPHA_0_9.html` asked for `'Space Grotesk'` on `html,body`. There
is no `@font-face` for it anywhere in this repo and no font file anywhere in this
repo. Measured on BOTH engines: it resolved to the system default, every time,
for a month. His 06:07 note already said it and I filed it as a gap:

> *"NOTE: the game still has no real typeface loaded. 'All typewriter width' is now
> a RULING about what to load, not just which stack to name."*

**IT IS LOADED NOW.** IBM Plex Mono, 400 and 700, OFL, embedded as a data URI so
the offline single-file build still works with no network. 20,180 bytes of font
against a 4.4 MB workshop.

**WHY THAT ONE.** He ruled the CATEGORY, not the family, so the family was mine.
IBM commissioned Plex for machine documentation, and IBM built the machines that
printed the ledgers this game is about the end of. It is a true monospace, proved
rather than claimed: every glyph measures 600/1000 em, and on the real surface ten
`i`, ten `W` and ten full stops all come back at exactly the same pixel width.

Not taken, and why: **JetBrains Mono** reads unmistakably as a code editor.
**Space Mono** has real personality and the personality is 2016 web design.
**Courier Prime** is too light at 12px in his sun and too on-the-nose.

## 2. THE RUN WEARS IT

`tools/bohemia_look_factory.js` takes HIS VERDICT AS ITS INPUT and writes
`engine/bohemia_look.css`, one canonical body, stamped into the run and the
workshop between markers. There is no second copy of the look anywhere.

| his call | what shipped |
|---|---|
| **CORNER: C CUT** | 10px outer chamfer, **8.83px inner** |
| **LINE: B HEAVY** | 2px, `#766f63`, **3.78:1** on the panel (the old hairline was 1.22) |
| **COLOUR: B GOLD AND COLD** | gold 8.52:1, cold 6.80:1, applied by MEANING |
| **LETTERS: A ALL TYPEWRITER-WIDTH** | everywhere, labels and body alike |
| **PRESSED: A FLIP** | the whole box inverts, **8.60:1** |
| **THE DIRT** | dead. Nothing on the interface is textured. |
| **THE FEED POST** | dead. The slot is still empty and nobody cooked a fourth set. |

**THE INNER CHAMFER IS COMPUTED, NOT EYEBALLED.** THE BOX is an edge wrapping a
fill. If both are cut at 10px, the cut slices straight through the line at the
corner. Two parallel 45-degree lines a border-width apart differ in intercept by
`bw*sqrt2`, so the inner cut is `cut - bw*(2 - sqrt2)` = 8.83px, and the line
follows the diagonal at exactly 2px like it does everywhere else.

**AND IT NEEDED NO MARKUP.** The judge page could afford a wrapper div per box.
The game cannot: those buttons are built by the RUN lane's JavaScript and a LOOK
lane does not reach into another lane's DOM. The inner face is a `::before` held
under the text by a stacking context on the element. **Not one line of run logic
was touched.** Same picture, zero markup.

## 3. GOLD IS YOU. COLD IS THE MACHINE. IT IS A RULE, NOT A SWATCH.

> **GOLD** the objective, the verb on the action button, the arrows you move with,
> your choices in a conversation, the feedback on what you just did.
> **COLD** the phone, the network, the place-name, every count and timestamp the
> machine hands you and you did not choose.

The world has no cold in it, so nothing on screen fights a lamp (LIGHT =
TERRITORY) and the phone reads as a different object from the street
(`FFX.L03`: the interface lives in a hue the world does not use).

**NO ESSENTIAL INFORMATION BY COLOUR ALONE.** Gold and cold say WHOSE a thing is,
never WHAT it says. Every cold value on that screen still carries its own word
(posts, quests, followers, the clout tag, the place name), and the gate checks it.

**One thing only looking caught:** the phone's button came out cold on the
reasoning that it is a device control, and it was then the one button in the game
that is not the colour of a button. The rule is cleaner without the exception.
**A person is neither**, so the speaker's name went from gold to plain ink. Gold
got sharper by giving something back.

## 4. THE EIGHT ARROWS, AND THE MISTAKE INSIDE THE MISTAKE

The nav ring was eight arrow GLYPHS. **No font carries all eight in one weight** --
ours has the two cardinals and none of the six diagonals -- so the browser split
the ring across whatever it could find, and the cardinals came back thin while the
diagonals came back heavy. Eight buttons that are meant to be one control, in two
weights. A rule cannot see that. A screenshot can.

They are drawn shapes now: one triangle, rotated eight times, gold like every
other verb, identical on every engine. The glyph and its `aria-label` stay in the
DOM, so the button still reads as north to a screen reader.

**AND THEN I MISREAD MY OWN ARROWS FOUR TIMES.** The first cut was 14 wide by 10
tall, and at 45 degrees I read four of them as pointing the opposite way. I was
about to "fix" a rotation that was already right. **Measuring the pixels proved
the rotations had been correct the entire time and THE SHAPE was the problem:** a
squat triangle has base corners further from its middle than its own tip, so the
eye picks the wrong end. 12 by 14 puts the point furthest out at every angle. All
eight now land within **0.4 degrees** of their compass bearing, measured.

That is the same lesson as the 8/25 hair audit: **when a measurement disagrees
with what you see, suspect the measurement first, and when your eye disagrees with
the code, measure before you change anything.**

## 5. HE COULD NOT SEE PRESSED, SO IT PLAYED ITSELF, SO HE VOTED

At 06:07 PRESSED had no vote and he said why: I typed three paragraphs about what
a press feels like instead of showing him, and a thumb covers the button. The
presses were rebuilt to perform themselves under a ghost fingertip. He opened the
page again and answered in one tap: **A FLIP.**

**THE FIX FOR A MISSING VOTE WAS NEVER A BETTER EXPLANATION, IT WAS SHOWING HIM
THE THING.** So this turn reports itself the same way: the UI tab opens on **IN
THE GAME**, four before-and-after photographs of the real run at phone size, each
with a thumb. Nothing on that page is a mock-up.

*(I had independently decided FLIP an hour before his export arrived, under
EVERYTHING IS A THUMB. It stopped being my call the moment he said it.)*

---

## 6. AND THEN THE MACHINE CAUGHT ME DOING THE EXACT THING THIS TURN IS ABOUT

**THE RUN TAB DOES NOT SHOW THE RUN.** The workshop maps it with one line:

```js
var PANEL = (t.dataset.p === 'run') ? 'city' : t.dataset.p
```

So tapping RUN opens **`slices/BOHEMIA_CITY_WORLD.html`**, and
`slices/BOHEMIA_RUN_CURRENT.html` -- the file this whole turn dressed -- sits
behind a panel nothing routes to. **I had put his ruling on a surface he does not
open**, which is word for word the failure in section 1 of this record, committed
again, one file over, three hours later.

Nothing in the machine would have said so. I found it by opening the workshop and
LOOKING at what the RUN tab actually draws, because the screenshot did not match
the screenshots I had been taking all afternoon.

**AND THAT SURFACE WAS FETCHING ITS TYPEFACE FROM GOOGLE.** A `<link>` to
`fonts.googleapis.com` for **Space Grotesk**, a proportional sans:

- on a good network, the game he plays contradicts **ALL TYPEWRITER-WIDTH**
- on a bad one it falls back to whatever the phone had
- either way **the demo phones a third party on load**, and he demos off a phone
  on cellular

**Fixed on the surface he plays.** The two links are gone, the face is embedded,
and it is measured loading **with the browser set to OFFLINE**: two faces loaded,
**zero requests outside the file**, typewriter-width true.

**ONLY THE TYPEFACE TRAVELLED, NOT THE LOOK.** That file has its own `--acc`,
`--line`, `--ink` and `--bg`, older than mine and belonging to another lane.
Writing my token block over them would be repainting somebody else's room from
the hallway. **The letters are HIS RULING and they travel; the colours wait for
that lane** (backlog UI-13).

**AND THE GATE READS THE ROUTE OUT OF THE WORKSHOP RATHER THAN A FILENAME**, so
if any lane ever re-points that tab the gate follows it instead of going quietly
stale. Mutation-proved both ways: putting the Google link back goes red;
re-pointing the tab at the run stays green, because the run ships the face too.

**AND IT CONFIRMED UI-12 BEFORE I FILED IT.** The played surface's nav ring has
the same two-weight arrow-glyph split the run had. Photographed, filed, not fixed
here: that ring is the CITY lane's.

*(One more collision, and it is the third this week: `gates/look_gate.js` ALREADY
EXISTED as the 8/8 LOOK-tab pictures gate, and the first cut of this turn's gate
overwrote it outright. Restored from git the moment the suite printed the row.
Mine is `ui_look_gate.js` now -- this lane's three gates all carry the lane in the
name. GREP FOR A NAME BEFORE YOU CLAIM IT: `.ghost` two turns ago, `--a` checked
this turn because of it, `look_gate` missed.)*

---

## GATES

**`gates/ui_look_gate.js`, 59 checks, new.** Every leg reads the pixels of the real
surface: the run is loaded, walked out of the house, walked down the block, and
put into the conversation the player actually has. Then asked the same questions
on a **real WebKit**, because the data URI `@font-face`, the `clip-path` and the
`::before` inner face are three techniques none of the five surfaces he already
plays were using before today.

### MUTATION-PROVED, ALL RESTORED
| mutation | result |
|---|---|
| rename the shipped `@font-face` | **first run: PASSED. A HOLE.** |
| un-cut the corner | red, "none" |
| kill the FLIP | red, and red on the contrast too |
| point one arrow the wrong way | red, 153 degrees off |

**THE HOLE IS THE INTERESTING ONE.** Renaming the typeface left every font leg
green, because the fallback stack is ALSO monospace and "ten i measure the same as
ten W" cannot tell our face from the system's. The legs now read the family name
OUT OF THE LOOK rather than hard-coding it, check `document.fonts.check`, and
check the body is actually WEARING it. Re-run: red, correctly.

**And the arrow tolerance is the pixel grid, not a guess.** At device scale 1 the
arrow is twelve pixels across and one antialiased pixel at radius nine is 6.3
degrees, so the bound is 8. Photographed at device scale 8 the same arrows land
within 0.4. A tighter bound would be measuring the screenshot, not the arrow.

**One more ruler fixed, not target:** the first cut of the ghost-typeface leg
banned the string "Space Grotesk" anywhere in the file and went red on the comment
explaining the fix. It now checks the general rule instead -- **a quoted family
name is a request for a file, and if no `@font-face` answers it, the request is a
lie** -- which is the thing that catches the next one.

## WHAT IS STILL HIS

Which faction owns which colour. What goes in the feed slot (killed three times;
nobody cooks a fourth set). Whether he wants the game's mono to be this mono.
