# [bb map art] SCHOOL, ROUND ONE: THE MAP'S TILES AND MARKERS
COOK lane, 9/24/26, session cook-mce6r5. Rule 33(f): one page a round on how Battle Brothers
does this department well, then the shape for us. Rule 33(g): it ends with what MOVES here
that their picture does not.

## WHAT THE MAP WE HAVE ACTUALLY DOES (measured first, rule 12)
The MAP tab's draw loop paints each cell by its TONE when zoomed out and by its rendered cell
art when close, then draws one search-highlight dot. That is the whole of it.

**THERE IS NO PARTY MARKER AND NO PLACE MARKER ON THE VALLEY MAP AT ALL.** A player looking at
it cannot see where he is or where anything worth going to is. The eight hits on "marker" in
that file are tile-legend prose about headstones and parking bays, which is the wrong-oracle
trap, opened and read rather than counted.

AND THE MAP'S PALETTE IS ALREADY DECLARED THERE, so it is not mine to pick: void #161410,
built fabric #6a6258, desert #8a7a58, mountain #3b352b, town #5f584c, roads #33333c, water
#2f5a6e.

## WHAT BATTLE BROTHERS DOES WELL HERE, AND WHY
**1. THE COMPANY IS A SMALL FIGURE WITH A BANNER, NOT A BADGE.** The thing that is YOU on that
map is tiny against the terrain and is found by its silhouette plus one loud mark. The banner
is not decoration, it is the findability: a dark figure on dark ground is a dark figure on
dark ground however well it is drawn.

**2. A PLACE IS A KIT, NOT AN ICON.** Their worldmap locations are assembled out of small
building pieces, so the marker itself tells you what the place HAS. The construction rule is
base + body + one tall piece, which makes the next place an ARRANGEMENT rather than a new
drawing.

**3. TIER READS FROM THREE MARKS.** This library already measured it (FTC-06): perimeter
(none / partial / full), the tallest silhouette, and how many attached situations hang off it.
Those three tell a camp from a town from a fortress at map range with the colour thrown away.

**4. ROADS ARE THE ONLY LONG THIN BRIGHT THINGS ON THE MAP**, because a route is what a player
traces with their eye. Anything else long and thin lies.

## THE FINDING THAT PROVES US WRONG, OR NEARLY
I wrote a contrast guard that averaged each marker's tones against each ground and it refused
the shop on MOUNTAIN at 25 of 255. That number is true and useless: a dark silhouette is
SUPPOSED to sit close to a dark ground, and averaging hides the one bright mark that does the
finding. The honest ruler is the share of a marker that stands at least 40 of 255 clear of
that ground. That change is also the argument FOR the banner, which I had left off the first
figure: he scored 7% findable on mountain without it and 17% with it.

AND THE SECOND HALF OF THAT IS A FACT ABOUT OUR MAP, NOT A SOFTENED THRESHOLD: **the valley has
895 mountain cells and builds on none of them**, so a shop, a shed, a pump or a fortress can
never stand on one. YOU can cross one. So YOU is held to all four grounds and a place is held
to the three it can actually stand on.

## THE SHAPE FOR US
Five markers, drawn in the map's own colours, each a dark body with exactly one bright accent:
  YOU           9 x 20, a figure with a banner
  THE SHOP      14 x 14, a box with a sign pole, no perimeter
  THE SHED      12 x 10, a lean-to, no perimeter and no tall thing
  THE PUMP      16 x 15, a tall thing with no building at all
  THE FORTRESS  18 x 14, the only full perimeter, two towers, an open courtyard
All five silhouettes differ with the colour and the shadow thrown away, which the tool proves
rather than claims.

## *** WHAT MOVES HERE THAT THEIR PICTURE DOES NOT (rule 33g) ***
His words: "Battle Brothers is just a bunch of pictures, we can do more and put more life into
it with this analog horror pixel direction." Their map markers translate and never animate.
Ours each have ONE MOVING PART ON A STILL BODY, on a 500 ms frame, which is one beat at 120
BPM, so the map breathes on the same clock the fight does:

  YOU            the banner stirs while you travel, and hangs dead when you stop
  THE SHOP       the sign is still trying to light and cannot hold it
  THE SHED       a loose roof sheet lifts and drops
  THE PUMP       the beam is still nodding, and nothing is on the other end of it
  THE FORTRESS   the watch light comes round, so somebody is still up there

ONE part, not many, and the guard has teeth where it matters: **a machine still running has a
part that moves and feet that do not**, so the tool refuses any marker that changes a single
pixel in its bottom third. The first version of that guard refused at "30% of the marker
moved" and threw out the pump, whose walking beam really is half the machine you can see. The
share was the wrong question; the feet were the right one.

THE HORROR LINE: the valley is empty and four of these are still working. The sign is trying
to light for nobody, the pump is lifting nothing, and there is a light going round a wall with
somebody behind it.

## TWO THINGS ONLY LOOKING CAUGHT
Every guard was green on a pump that rendered as **two tents with a wire over them** (I drew
the legs splaying both ways and got two triangles instead of one Samson post) and a fortress
that rendered as **a flat banded box** (eighteen pixels of near-identical dark tone is a mush
however carefully it is arranged). Both redrawn. And a third, in my own guard: the first
"three marks" table called a row a perimeter if the first or last character of the MASK STRING
was ink, so the fortress -- the only walled thing here -- scored 0 of 14 because its mask
carries two blank columns, while the shed scored 8 of 10 because its mask happens to touch the
edge. A clean number off the wrong surface, printing a lie on the page.

## ROUTED
- To WORLD and RUN: the map has no markers today and this bank drops five in when the hold
  lifts. Where they are PLACED is the map's business, not the art's.
- Not drawn here on purpose: the trail the party leaves already exists
  (__WHOSE_FOOTPRINTS_ARE_THESE__, 9/12, passed by DIRECTION 9/13). It is not redrawn.

## WHERE HE SEES IT
The VOTE tab, cook-the-map-has-markers-9-24. **They MOVE there**: the item is a page, not a
picture (rule 25, THE VOTE TAB SHOWS THE THING). A still contact sheet ships beside it.
Rule 18: a bank and a candidate; nothing went to the alpha's play surface.

Bank: banks/BOHEMIA_THE_MAP_MARKERS_9_24_26.txt
Tool: tools/bohemia_the_map_has_markers_cook_9_24_26.py
Library: reference/library/overworld-map/INDEX.md (BBM-01..04, index 93 -> 97)
