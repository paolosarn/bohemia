# EYES AND EARS -- E2 [glitch list]: A GLITCH TAXONOMY FOR THIS GAME, AND THE EIGHT
# CLASSES A MACHINE ALREADY RUNS
## 9/5/26, lane 17 (eyes-5vql33). MODE: RESEARCH, plus this lane's own instruments.

E2 asked for a glitch taxonomy for OUR game -- floating windows, wall gaps, wrong draw
order, sprites clipping through walls, text overflowing a card, a frame popping, a seam
between tiles -- one line each: what it looks like and how to find it on a screenshot.

**Eighteen classes, in `banks/eyes/BOHEMIA_EYES_GLITCH_TAXONOMY_9_5_26.json`, every line
`draft:true`. Eight of them run today. Three are honestly marked as questions a screenshot
CANNOT answer, with the measurement that proves it.**

---

## THE GROUNDING (both aisles)

- **THE ACADEMIC SPINE.** Lewis, Whitehead and Wardrip-Fruin, *What Went Wrong: A Taxonomy
  of Video Game Bugs* (FDG 2010), splits failures into **temporal** (it happened at the
  wrong time, or kept happening) and **non-temporal** (it is simply wrong). That split is
  why this taxonomy separates "the world is a photograph" from "a dead flat patch": one is
  a fault in time, the other in the frame.
- **WHAT THE INDUSTRY'S MACHINES ACTUALLY LOOK FOR.** EA SEED's convolutional glitch
  detector and the GlitchBench benchmark train on a short list of visual classes:
  **corrupted, missing, stretched and placeholder textures; clipping; floating; lighting**.
  Those are the classes below, translated into a 2D 45-degree pixel game drawn on a canvas
  inside an iframe on a phone.
- **THE HONEST LIMIT, WHICH THE SAME LITERATURE STATES:** the state of the art for the hard
  classes is a trained model, not an arithmetic test. That is why this taxonomy marks three
  classes HUMAN and three MACHINE LATER instead of shipping detectors that would be wrong.

## THE EIGHT RUNNING TODAY, AND WHAT THEY FOUND

| # | class | how the machine sees it | found on 9/5 |
|---|---|---|---|
| G-01 | nothing there | one colour over 85% of a sampled grid, or no canvas over 200x400 in any frame | clean |
| G-02 | off the glass | element rect **plus its frame's offset** against 390x844, skipping scrollable boxes | clean (and it is what withdrew this lane's false SLEEP finding) |
| G-03 | cut text | scrollWidth over clientWidth with no scroll | **2 real ones**: the CHARACTER bench's SHOULDERS cut by 14px, the MAP caption cut by 484px |
| G-04 | he cannot read it | the DOM says where the words are, **the finished picture says what they look like** | **38 boxes under the readable floor** |
| G-05 | a dead flat patch | 48px blocks of one exact colour, joined, over 6 blocks | reported per screen; flat is legal in pixel art, so a person rules |
| G-06 | the picture does not reach the glass | flat single-colour rows counted inward from each edge | the CUTSCENE screen carries a **94px band** under its picture |
| G-07 | the page threw | pageerror on either surface | clean |
| G-08 | the world is a photograph | two frames N seconds apart, 0.00% moved | three demo frames eighteen seconds apart are byte-identical |

### G-04 IS THE FINDING OF THIS ROUND, AND IT IS MEASURED TWICE
A page can dim its own words with a scrim drawn **over** them. Every style still says gold
on black; the player sees a grey smudge. So contrast is a PICTURE question, not a style
question: the DOM gives the rectangle, the screenshot gives the colours, and WCAG gives the
number (4.5:1 for body text, 3:1 for large).

**On the screen a player lands on, with the morning card up: 38 text boxes are under the
floor.** The worst are the game's own controls -- OUTFIT **1.03:1**, MUSIC 1.06, WHOLE MAP
1.07, the status line "walking your own block." 1.07, BIKE 1.09, CITY 1.09, SLEEP 1.10.
**1.00:1 means the ink and the paper are the same brightness.**

And the card is not the whole story. **With both cards dismissed, 7 of 13 boxes are still
under the floor**: the status line at 1.75, OUTFIT 1.80, WHOLE MAP 2.82, BIKE 3.46, CITY
3.67, SLEEP 3.70, STANDING 4.22. The chips are dim on their own.

Measured twice, same 38 both runs, so it is now **A RATCHET IN THE SUITE**: `eyes_gate.js`
holds the count at 38 and fails if a 39th unreadable label is ever added. The 38 are
history (the pixel-craft and style-card precedent: judge the population, freeze it, never
let it grow). Proven to bite before it was trusted: with the baseline temporarily set to
10, the gate went red naming the count.

## THE THREE A SCREENSHOT CANNOT ANSWER, AND THE MEASUREMENT THAT PROVES IT

- **G-09, the same block pasted.** The map repeats one apartment block down a column, by
  eye. A lattice autocorrelation -- the picture compared against itself at a period and its
  harmonics -- scores the **MAP screen 0.21, the walked game 0.22, and a grid of judge cards
  0.25**. It cannot tell a copy-pasted city from a correct grid, and a detector that ranks a
  judge page above the actual fault is worse than none. **The question belongs to the table
  the map is generated FROM**, where a repeat is an exact match rather than a correlation.
  Written down as NEEDS THE DATA, NOT THE PICTURE.
- **G-10 / G-11, a sprite through a wall, and wrong draw order.** A pixel test cannot
  separate "behind" from "inside". The world already knows where its walls and its bodies
  are; the check is to ask the game for both and compare its sort key against the geometry.
  That needs a harness this lane does not have yet.
- **G-16 / G-17 / G-18, two of the same game, art from another world, the wrong thing loud.**
  A machine can put two screens side by side and rank contrast and size. Only a person can
  say whether they are one game. E7 is the scoring sheet that makes that a measurement.

## WHAT THIS ROUND ADDED TO THE FLEET
- `banks/eyes/BOHEMIA_EYES_GLITCH_TAXONOMY_9_5_26.json` -- 18 classes, draft:true.
- `tools/bohemia_eyes_glitch.py` -- dead flat patches, letterbox bands, one-colour screens,
  and the repetition test that is honestly reported as not discriminating.
- `tools/bohemia_eyes_readable.py` -- the contrast pass over a finished picture.
- `gates/eyes_gate.js` -- now ten checks: the four baseline-free faults, the readability
  ratchet, and the self-test that catches a blind instrument.
- `records/BOHEMIA_EYES_READABLE_BASELINE_9_5_26.json` -- the frozen 38, with the rule that
  it may only ever go down.

## ROUTED
- **UI**: the control chips on the walked screen measure 1.03 to 1.17 to 1 with the card up
  and 1.75 to 4.22 with it gone. The floor is 4.5. This is the whole left-hand column of the
  game's own controls.
- **UI**: the CHARACTER bench's SHOULDERS label and the MAP caption are cut (G-03).
- **CITY / WORLD**: the CUTSCENE screen's 94px band, and the map's repeated column, which
  needs the generator's table rather than a screenshot.
- **EYES AND EARS**: E1 [pixel tells] next -- banding, pillow shading, orphan pixels and
  mixed resolutions are the classes this taxonomy deliberately left out, because they are
  E1's subject and they need the 45-degree corpus, not a screenshot of a tab.

## SOURCES
- Lewis, Whitehead, Wardrip-Fruin, *What Went Wrong: A Taxonomy of Video Game Bugs*, FDG
  2010: users.soe.ucsc.edu/~ejw/papers/lewis-taxonomy-fdg2010.pdf
- EA SEED, *Graphical Glitch Detection in Video Games Using Convolutional Neural Networks*:
  ea.com/seed/news/graphical-glitch-detection-convolutional-neural-networks
- *GlitchBench: Can large multimodal models detect video game glitches?* arXiv 2312.05291
- WCAG 2.x contrast ratio (4.5:1 body, 3:1 large text)
