# THE MAP HAD HOLES IN IT
**8/4/26. WORLD lane. 21 districts with no icon → 2. Machines: `icon_gate.js`,
`big_icons_gate.py`, `round_and_doors_gate.py`.**

> "Cityhall 85% both. Courthouse 85% both. Terminal 85% both. Chapel 85 both.
> **all are good to go for now.**" — Paolo, 8/4/26

---

## WHAT THE APPROVAL BOUGHT

He judged four samples of the big-icons language and passed all four at 85%. **Approval
unlocks volume**, and what got unlocked is not four more civics — it is the *language*.
Twenty-one registered districts still rendered as **nothing** at the zoom he navigates by,
which is a third of the valley invisible on its own map. He scored the chapel's missing
icon **0%** two days ago and he was right to.

**Nineteen built. Two held.** Airport and airbase stay out: both builders are finished and
correct, and the reason they are held is written above `HEROES` in the factory — an
aeroplane does not read at 1×1, and whether an airfield hero drops the runway to show the
aeroplane is a design call that belongs to him.

## THE NINETEEN, AND THE ONE THING EACH IS RECOGNISED BY

An icon has exactly one job: be the thing you would name if somebody pointed at the plot.

| district | its signature | grounded in |
|---|---|---|
| **jail** | a twelve-storey tower that looks like an office block — until you see the walled yard and four guard towers at its feet | Clark County Detention Center (JMA + HOK, 1981-84). The brief was to design a jail that **would not look like one**, because it sits blocks from Fremont. That contradiction *is* the icon. |
| **landfill** | a terraced mound, four stepped benches, gas wells piped down the face, a flare stack | Apex Regional — 2,200 acres, largest on earth by area and volume, waste layered under each terrace "like a sheet cake" |
| **railyard** | the track fan spreading out of one throat, engine shed at its head, gantry crane straddling the container aisle | a working classification yard; nothing else in the valley makes that shape |
| **substation** | a yard of lattice frames carrying busbars overhead, six transformer banks with radiator fins | the only open steel frame against sky in the valley |
| **watertreat** | **circles** — clarifier drums with rotating bridges, digesters with cone roofs | a reclamation plant is the only industrial site whose plan is round |
| **waterpark** | the slide tower, four stacked platforms with flumes spiralling off every corner | the dead Wet'n'Wild, 27 acres on the Strip, 1985-2004 |
| **drivein** | a flat wall four storeys high standing alone with its back bracing and nothing behind it | the most recognisable silhouette the American roadside has |
| **boneyard** | six leaning towers of flattened cars, the crane and its grapple over them | a shape nothing else makes |
| **cemetery** | the mausoleum and its colonnade, a gridded headstone field, the obelisk | the only building with height on a memorial park |
| **golf** | greens ringed by bunkers with the pin still in them | in act 1 the fairways are dead brown and only the sand reads bright, so the **bunkers** do the work |
| **suburb** | a cul-de-sac bulb ringed by a continuous block wall | the privacy wall is the defining feature of a Sun Belt subdivision (7/21 research) |
| **trailer** | fifteen single-wides all the same way round, and one burned-out unit | a trailer park is a barcode from above |
| **apartment** | circulation on the **outside** — walkway decks and the stair tower | Sun Belt walk-ups put their stairs on the elevation |
| **wash** | a lined trapezoidal channel and **the sewer tunnel mouth in its wall** | the mouth is the way IN, and that is why this district exists |
| **freeway** | the elevated deck on columns and the sign gantry over the lanes | both are SPANS, not canopies — the distinction the 8/2 law draws itself |
| **arterial** | signal masts reaching their long arms out over six lanes | the mast arm is the only vertical; everything else is flat by nature |
| **mountain** | a stepped massif to one summit, cliff bands on its face, talus off the foot | the tallest thing in the valley, and it reads that way |
| **desert** | creosote in an **evenly spaced grid** — they poison each other's roots, which is why the spacing is even — and one varnished outcrop | LOW BY NATURE, named |
| **water** | the **bathtub ring**, the white band the water left on the rock as it dropped, and a launch ramp ending a long way short of the water | LOW BY NATURE, named. The sunken boat is the punchline. |

## AND THEN THE ICONS FOUND A BUG IN THE GROUND

Rendering the new cards turned up **magenta** in the water plot — the missing-colour
sentinel, which is also a **PURPLE RESERVATION** breach. Measured across the registry:

> **SIXTEEN DISTRICTS DREW AN UNCOLOURED CODE 0.**
> mountain **70.1%** of every plot · suburb **45.2%** · desert 36.4% · arterial 32.6% ·
> freeway 27.1% · wash 26.3% · airport 25.2% · airbase 25.7% · drivein 19.5% ·
> medical 17.6% · water 11.2% · solar 10.2% · rail 6.7% · cemetery 6.1% · park 3.0% ·
> interchange 1.9%

**Suburb is the district he walks every single run.** Nearly half of it had no colour.

The live game got away with it — its renderer has its own dead-ground fallback — but
every judging surface painted it magenta, so the pictures I was sending him for verdicts
were **not the game**. He would have been scoring a lie.

**And the gate that exists to catch this was exempting it by name:**

```js
function legendOk(g,palette){ … if(c!==0 && !(c in palette)) return false; … }
                                  ^^^^^^^^
```

`0` meant "void" once. Every module gives it a real legend entry now — *"bedrock face"*,
*"open water"*, *"dead-ground (yard)"* — so the exemption was checking that a tile nobody
had coloured was allowed to stay uncoloured. **A gate that exempts the most-used code in
the valley is not checking anything.** Sixth sighting of the hand-written fact.

**Fixed:** all sixteen carry a real colour drawn from their own family, the exemption is
gone, and every registered district passes the tightened check.

## TWO GATE REFINEMENTS, BOTH TIGHTENING RATHER THAN LOOSENING

- **A band on a mass is not a tunnel through it.** The slab check flagged landfill terrace
  lips and mountain cliff bands. A tunnel is a slab a mass passes *through* at mid-height;
  a step is a mass rising from the same platform the lip sits on. Both shapes named.
- **LOW BY NATURE and DOORLESS BY NATURE are lists with reasons attached.** A ridge has no
  door. Open Mojave has no building. A subdivision is single-storey — *that is the form*.
  Named, never silently exempt, and the lists may not grow without the reason written next
  to the entry.

## WHAT REAL FIXES, NOT EXEMPTIONS, LOOKED LIKE

Three icons came in squat and the honest answer was not to lower the bar:

- **watertreat** got its **digesters** — the cone-roofed drums that make a plant read from
  a distance. Leaving them out is why it was knee-high.
- **trailer** got its **yard light** — one tall pole lighting the whole lot, the only thing
  in a mobile home park taller than a single-wide.
- **wash** got its **staff gauge mast** — a lined channel is a trench, but the things that
  *watch* it stand up, and that gauge is the only warning anybody down there gets that a
  wall of water is coming. In this valley that kills people.

## THE ONE GATE I LEFT RED, AND WHY I STOPPED

**`squint_gate` is RED at 5 twin pairs.** It renders all 47 icons at 16x16, takes the top
half, and requires any two to differ by at least 5.5% of cells. Nineteen new icons pushed it
from 1 declared pair to **16 below the bar**.

I fixed it down in three real passes, and every fix made the icon **more** like its subject,
not less:

| pass | what changed | twins |
|---|---|---|
| 1 | trailer's manager double-wide crosswise + a 9.2 m yard light; boneyard's 15.4 m crane boom; suburb two-storey majority (which is what Summerlin actually is); a real Mojave butte on the desert | 16 → 8 |
| 2 | railyard got a **running shed** — a real yard's shed swallows whole locomotives, mine was a hut; watertreat got two big clarifier drums instead of four small ones, because four small circles are a field of dots and two big ones are a shape; boneyard's stacks into rows down an aisle; trailer onto a loop road | 8 → 6 |
| 3 | trailer's pads into **echelon** (angled off the loop so a coach can back in without swinging wide — the one thing about a trailer park's plan nothing else has); substation's transformer banks into a wall of mass behind blast-rated fire walls | 6 → **5** |

**THEN I STOPPED, and the reason is the law.** STOP PRODUCING (7/26): *"writing a fourth
version of anything means you already failed — stop and say so instead of fixing the
attempt."*

**What is structurally true here:** 47 silhouettes, 128 cells, a 7-cell minimum distance.
That is close to what the medium can hold. The five that remain are pairs whose real
subjects genuinely resemble each other from directly above at that size — a trailer park and
a school's classroom wings, a wrecking yard and a speedway, a hospital and a rail shed. They
are all *long low ranks with one tall thing*, because that is what those places are.

**Going further means designing the icons against each other instead of against their
subjects** — making the jail not look like a jail so it stops looking like the railyard.
That is the wrong trade, and it is Paolo's call, not mine.

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
