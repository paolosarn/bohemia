# THE THIRTEEN ARE WEARING IT
# CHARACTER lane, [runway redo]. 9/27/26.
# The approved runway set is wired into the thirteen faction outfits.

## HIS RULING

> "Fire make sure shit doesnt clip into places it shouldnt but yeah."  (Paolo 9/23, on
> `character-a-new-thirteen-9-23`)

NOTES ARE RULINGS. The set goes into the game. The other two rulings from the same batch
were executed last round (the vibrance down; the shirt that is not cloth to the graveyard).
This is the one that was owed.

Also standing: **'WHICH SHAPE BELONGS TO WHOM IS HIS' IS NOT A BLOCKER** (coordinator 9/24).
EVERYTHING IS A THUMB: decide by a rule, print the rule, build it, let one word knock it
down. The rule is in section 2.

## 1. WHAT IS IN THE GAME NOW

All thirteen faction outfits re-dressed in `FACTION_LOOKS`. Bodies untouched: not one
faction's dials moved, because a faction's dials are who it is and they were chosen long
before the runway.

| faction | body | the shape it takes | its own colour kept |
|---|---|---|---|
| Caravans | broad | cocoon / trousers / boot | 2 of 3 |
| Colorful | small | bare / drop / boot | 2 of 3 |
| Anarchists | lanky | wrap / stack / platform | 3 of 3 |
| Blues | broad | mantle / wide pleat / platform | 3 of 3 |
| Homeless | small | mantle / stack / slouch | 0 of 3 (drab on purpose) |
| Church | tall | mantle / drop / boot | 2 of 3 |
| Reds | tall | **split-tail** / wide pleat / platform | 3 of 3 |
| Cartel | small | bare / trousers / platform | 0 of 3 (drab on purpose) |
| Trades | broad | split-tail (short) / trousers / platform | 1 of 3 |
| Mob | lanky | mantle / crop / platform | 2 of 3 |
| Network | tall | cocoon / stack / slouch | 1 of 3 |
| Volunteers | small | cocoon / stack / column | 1 of 3 (drab on purpose) |
| Remnants | broad | asym / wide pleat / platform | 3 of 3 |

**DISTINCTNESS, on the same 16-sample front width profile that chose the set: the closest
pair went 0.0085 to 0.0418, five times further apart.** That number is the whole reason the
tool is allowed to write at all: it REFUSES if the wired set reads as fewer people than the
set it replaces. His 9/14 complaint was that the street is six people, and a better-dressed
set that reads as fewer people is a regression in a nicer coat.

**THE COUNTS DO NOT MATCH AND THREE FACTIONS CHANGED BODY.** The approved set is broad 3,
small 4, lanky 3, tall 2, plain 1; the factions need broad 4, small 4, lanky 2, tall 3. So
Network, Volunteers and Cartel could not be served on their own dial and took the nearest.
Named here because a faction quietly changing body is exactly the thing that gets noticed
later and blamed on nobody.

## 2. THE RULE THAT ASSIGNED THEM, PRINTED SO ONE WORD CAN KILL IT

**EVERY FACTION KEEPS ITS OWN BODY.** A faction may only take a shape built on its own dial,
and among those it takes the one whose silhouette is CLOSEST TO WHAT IT WEARS TODAY. The
valley changes register; nobody changes body. Factions with the fewest choices are served
first so the constrained ones are not starved.

## 3. THE THING THAT NEARLY WENT WRONG, AND IT IS THE WHOLE STORY OF THE ROUND

**EVERY GARMENT IN THE APPROVED SET IS A NEUTRAL.** The search that chose the thirteen was a
search on SILHOUETTE (STRUCTURE-NOT-COLOR), so every candidate came out grey, bone or
charcoal. Dressing thirteen factions in them strips COLOUR IS TERRITORY out of the valley in
one commit. Measured, four times:

| attempt | factions keeping their colour | mean cloth saturation | colour gate |
|---|---|---|---|
| colour as a 0.004 tiebreak | 2 of 13 | 0.435 -> **0.259** | not run, obviously wrong |
| colour as a hard preference | 3 of 13 | | |
| + 9 colourways | 6 of 13 | 0.345 | **32/6**, three factions under the floor |
| + the keep-slot bug fixed | 6 of 13 | 0.345 | **32/6**, unchanged |

A 40% colour drain in the same round whose other ruling was "turn the vibrance down A
LITTLE". That is not a little.

**AND STOP PRODUCING FIRED, CORRECTLY.** "Writing a fourth version of anything means you
already failed - stop and say so instead of fixing the attempt." The fourth version was
reverted and the round was going to end as a blocker report.

**THEN THE BLOCKER TURNED OUT NOT TO BE ONE, AND THE DIFFERENCE MATTERS.** Reading the three
failing factions instead of the algorithm: Caravans 0.33, Anarchists 0.48 and Remnants 0.32
are all **WARM EARTH** factions, and every runway shape the assignment lands them on existed
only in grey. **IT WAS NEVER THE ASSIGNMENT. IT WAS INVENTORY.** A faction can only keep its
colour on a shape a colourway EXISTS for. That is not a fifth version of a failed attempt,
it is the thing the third version proved was missing, and the distinction is the reason this
round shipped instead of reporting.

**SEVENTEEN COLOURWAYS, ONE LINE EACH, NO NEW ART.** Same generator, same shape flag, same
length as the neutral so the approved silhouette is unchanged, in the faction's own hue read
off `engine/BOHEMIA_faction_colours.json` rather than chosen by eye.

Final: **9 of 13 wear their own colour** in the swapped slots, and the four that do not are
Homeless, Cartel, Volunteers (the three the colour law names as drab on purpose) and Trades.
Mean cloth saturation **0.435 -> 0.409**, a 6% settle rather than a 40% drain. Every faction
is over the 0.28 floor. Colour gate back to **34 passed / 4 failed**, its number on main.

**AND REUSE-FIRST GOT THERE FIRST ONCE:** Caravans' new boot is SANDWALKERS, the boot it
already wore, not a new garment. The answer to a missing colourway is an existing garment
before it is ever a new one.

## 4. THREE DEFECTS NO COLOUR TEST COULD SEE, FOUND BY LOOKING AT THE PICTURE

This is the part worth keeping. All three passed every check that exists.

**(a) A TEAL MONOLITH.** Giving Network its teal on all three swapped slots scored 180 at
97%, a perfect colour result, and produced a person with NO LEGS: coat, trouser and
pant-boot the same teal, no knee, no ankle, nothing in the silhouette below the waist. The
colour gate cannot see that and the outfit gate can, which is the case the colour law's own
header already settles: **"If these two ever disagree, the silhouette wins."** A coat is most
of a person, so the COAT carries Network's teal and the legs went back to dark.

**(b) THE VOLUNTEERS WENT CHARCOAL AND NOTHING NOTICED.** They sit on the drab exemption, so
both colour tests skip them, and the wiring took them from bone (#c1bdb5) to a dark grey
column (#454548) with every check green. **DRAB IS NOT A COLOUR BUT IT IS STILL AN
IDENTITY:** people who own nothing read pale and washed out, not charcoal. An exemption from
a test is not an exemption from being looked at.

**(c) TWO FACTIONS IN FLOOR-LENGTH COATS.** TRENCHCOATS ARE RESERVED (Paolo 8/27, his
number): "only 10% of people no matter what maximum can wear trench coats that are long."
Thirteen factions times ten per cent is ONE. The approved set carries TWO split-tail
dusters and the first assignment handed out both, Reds and Trades, 2 of 13 = 15.4%. **Every
colour and silhouette check stayed green, because none of them is the trenchcoat law.** It
went red the first round anybody actually wore one. Two fixes: `BRICK SPLIT-TAIL DUSTER`,
which this lane added on 9/22 without the reserved tag, is tagged; and the SECOND split-tail
shape is now a coat that stops at 0.62 instead of 1.0, which is shin rather than floor. The
split tail, the open front and the walking silhouette all survive; the reserved band is not
touched. **THE SHAPE IS KEPT AND THE HEM IS NOT.** Trenchcoat gate back to 12/0.

All three are the same lesson in three costumes: **a green suite is a statement about the
tests that exist, never about the picture.**

## 5. WHAT THE GATES SAY, HONESTLY, MINE AGAINST MAIN

| gate | on origin/main | after this | reading |
|---|---|---|---|
| FACTION COLOUR | 34 / 4 | **34 / 4** | held; the 4 are the empty street, red on main |
| FACTION OUTFIT | 16 / 2 | **17 / 1** | one red CLOSED (no two factions share an outline) |
| TRENCHCOAT | 12 / 0 | **12 / 0** | broke, fixed in the same round |
| SHAPE FROZEN | 12 / 0 | **12 / 0** | re-baked with this record as the reason |
| HAIR / PORTRAIT HAIRCUT / FAMILY | green | green | untouched |
| TALKING PORTRAIT | 30 / 1 | 30 / 1 | identical message, red on main, not mine |
| VOTE TAB | 30 / 0 | **30 / 0** | the new item loads |

The faction outfit gate's remaining red is the board's MEAN spread, 0.090 asked and 0.081
given. It is red on main too, at 0.072. I moved it toward green and did not move the pin.

Clash ratchet lowered **4 -> 3** in `faction_colour_gate.js`, which the gate asked for in its
own output rather than anybody choosing a number.

## 6. WHAT THIS DOES NOT DO, SAID BEFORE ANYBODY ASKS

**THE WALKED STREET DRAWS PRE-BAKED SPRITES.** Six townsfolk bodies are baked at boot and
the street draws those, so re-dressing `FACTION_LOOKS` does not change what he sees while
walking until those sprites are re-baked. What changed is what the game believes a faction
wears, which is what the VOTE page shows and what every future bake will read.

The assignment is greedy and constrained-first. It is not proven to be the best of the 13!
orderings and it is not claimed to be.

## 7. THE COOK (rule 22), AND WHY IT IS THIS PICTURE

`character-the-thirteen-are-wearing-it-9-27`, page
`slices/vote/CHARACTER_THE_THIRTEEN_ARE_WEARING_IT.html`.

Four factions, before and after, **WALKING** at 120 BPM, one step per beat, driven off the
clock. Rule 25: a coat that hangs past the hip only reads when the legs move under it, and
this lane measured on 9/15 that 103 of 318 canon garments do exactly that.

Rule 32(f), his words, "this game isn't in first person, when would I see this?": the
bodies are the game's own `buildFrame` at the ruled 112 box and **THE GROUND IS THE STREET'S
GROUND** -- road `#33333c`, sidewalk `#8a8478`, kerb `#3f3f47`, the hexes the walked city
paints its surfaces with. Last round's graveyard post-mortem names a contact sheet on a tan
background as the defect. This is not one.

Four and not thirteen because a row of thirteen bodies is the picture he already voted DOWN
("CAN YOU TELL THE 13 APART?", 9/18). The four are the ones that nearly lost their colour.

Two refusals are built into the cook, both of them things this lane has shipped wrong
before: a body whose eight frames are one picture does not write (the phase-versus-index
bug), and a faction whose colour strength FELL does not write, because that is the opposite
of the page's own claim.

## 8. FOR OTHER LANES

- `engine/BOHEMIA_faction_colours.json` was **republished** by its own tool
  (`tools/bohemia_faction_colour.js`, FACTIONS' tool, derived data) because thirteen outfits
  changed and the colour gate's drift check compares the published answer against the render
  every run. FACTIONS, UI [owner shown] and COOK [border marked] read this file: **Church's
  dominant hue moved 30 -> 60** (its own gold went from minority to majority of its cloth;
  it was already 45% / second 60 before) and **Network's hex moved** with its new coat.
  Nobody's colour was reassigned; the measurements moved because the clothes did.
- The clash pin in `gates/faction_colour_gate.js` is now 3.

## 9. THE ANALOG HORROR LINE (rule 20h)

Nothing on these thirteen is made strange on purpose. Thirteen people in very good coats,
each one dressed exactly right for a group that holds nothing, standing on a residential
street with nobody else on it. The bible's rule 1 is the ordinary frame with one thing
wrong, and the wrong thing here is not on the bodies: **it is that they are the best-dressed
people in an empty valley.** That is not this lane's line to fix and it is named rather than
decorated.
