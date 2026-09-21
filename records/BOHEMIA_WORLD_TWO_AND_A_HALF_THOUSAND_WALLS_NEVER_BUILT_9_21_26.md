# TWO AND A HALF THOUSAND WALLS THAT WERE NEVER BUILT (9/21/26, WORLD lane)

Board row **[suburb walls] / THE-WALLED-SUBURB-NUMBERS**, plus rule 22 (COOK
EVERY ROUND). **Nothing shipped to a play surface** — rule 18 holds; the cook went
to the VOTE tab.

---

## 1. THE ROW ASKED FOR THREE NUMBERS. THE TABLE THEY GO IN IS READ WRONG.

The row: three things the 7/14 WALLED SUBURBS LAW left pending were decided 9/7
under correct-after, and the job was to "put the numbers in the table they read."

The table is real. It is in the plot generator:

```js
const wallThreshold  = opts.wallThreshold  == null ? 1 : opts.wallThreshold;
const gatedThreshold = opts.gatedThreshold == null ? 4 : opts.gatedThreshold;
const walled = quality >= wallThreshold;    // 1
const gated  = quality >= gatedThreshold;   // 4
```

Its own comment says *"quality threshold for walls (default: quality >= 2 of
0..4)"*. **The thresholds are on a 0 to 4 integer scale. The overmap hands over a
0 to 1 float.**

## 2. *** MEASURED ON A REAL MAP, THROUGH THE REAL BRIDGE ***

```
estate     43 of 43    walled and gated     (forced by district)
gated      30 of 30    walled and gated     (forced by district)
trailer     0 of 15    walled               (forced open, correct)
suburb      0 of 2,558 WALLED               <-- the only one that asks
                                                the threshold
quality actually seen on residential ground: 0.194 to 0.900
```

**Two and a half thousand tract neighbourhoods, and not one of them has a
perimeter wall**, in a city whose building code makes the wall compulsory. The
law was locked on 7/14 and **has never once fired.**

The districts that force their own answer are all correct, which is what proves
the fault is the threshold and not the wall code.

**No number anybody put in that table could have worked.** That is what this row
is actually made of.

## 3. AND TWO OF THE THREE DECIDED NUMBERS NAME THINGS THAT CANNOT HAPPEN

**(1) "A tract walls itself when its quality is in the TOP HALF of the valley's
range."** This contradicts Paolo's own 8/1 bank law, quoted in the suburb
module's own notes: *"most Vegas communities are walled but NOT gated; gates =
boujee/richer."* It contradicts the real world the same way — Clark County's
Unified Development Code 30.64.020 requires a developer-installed perimeter wall
on a subdivision, which is exactly **why** a wall signals nothing here and a gate
signals everything. Measured, the top-half rule would still leave **586 of 2,558
tracts** without a wall the code requires. Realism first, and his ruling is newer
than the pending it answers.

**(2) "One rear service gate for tracts over twelve cells."** Measured: 1,774
distinct suburb tracts in the valley, sizes **1 cell (1,161), 2 cells (515), 4
cells (98)**. **The largest tract in this valley is four cells.** Zero of 1,774
are over twelve. It is a rule for a tract that does not exist — the same shape as
the `beltway` name sitting on another of this lane's rows.

**(3) "Wall tiles from the existing wall bank within the card's value band."**
This one is right and buildable. `banks/BOHEMIA_WALL_PICKS_7_14_26.txt` holds
twelve approved picks, W26 to W37.

## 4. THE REPLACEMENT TABLE, AND EVERY NUMBER IN IT IS DERIVED

`engine/bohemia_tract.js`. Nothing in it is typed. `range()` walks the real map
and reports what quality actually is on residential ground, and every answer is a
position inside that range.

**THE WALL: the valley's own quality floor**, so every tract clears it. That is
not a shortcut around a decision, it *is* the decision, taken from his bank law
and the code it describes. A wall here means nothing, which is exactly why it has
to be on every tract — a signal needs a background to be a signal against.

**THE GATE: the map's call, never quality's.** Measured, and this is why the
top-half idea cannot be rescued even for the gate: quality is bucketed coarsely.
678 of 2,558 suburb cells sit at exactly 0.9 and 663 at 0.85, so any threshold
near the top gates **26%** of the valley. The valley's own gated ground — the
`gated` and `estate` districts the overmap places — is 73 cells, **2.8%** of
residential ground, stable across three seeds (2.8, 2.9, 2.7). **A coarsely
bucketed number cannot express a three percent minority**, so it does not try.
The map already knows who is rich.

**THE REAR SERVICE GATE: pinned to the biggest tract the valley actually
builds**, taken from the map through `biggest()`. Hand it a valley that really
does build twelve-cell tracts and the rule follows it there. And a service gate
needs a **second street** — a service gate on the same street as the front door
is a second front door.

**THE WALL TILES: his twelve approved picks, spread across the measured range**,
so a poor tract and a rich one do not get the same wall and no band edge is typed.

Result, the same valley through the derived table:

```
suburb   2,558 of 2,558 walled   (was 0)      none gated
gated       30 of 30    walled and gated
estate      43 of 43    walled and gated
trailer      0 of 15    walled                (correct)
seven of the twelve approved wall picks in use, by quality
```

## 5. THE CHECK IS BEHAVIOURAL, AND IT IS WRITTEN TO PASS WHEN SOMEBODY FIXES IT

Two things this lane has been burned by, both avoided on purpose.

**A grep can be fooled.** So "derived, not typed" is proved by handing the module
a **different valley** and watching every number move.

**And a gate that just asserts "0 walled" goes red the day the bug is FIXED**,
which is backwards. The live-generator check asks whether the generator agrees
with the derived table, so it reads true either way it is true: it names the scale
bug while it stands and turns green the moment the generator is corrected.

## 6. THE COOK: THE RULES RUN WITH THE DIRT

Every tract here is walled because the county made walls compulsory. A wall like
that comes with an association, and an association comes with **covenants,
conditions and restrictions** — a private instrument recorded against the land,
binding whoever owns the lot next, enforced by a volunteer board with the power to
fine.

```
SUNRIDGE HOMEOWNERS ASSOCIATION
NOTICE OF COVENANT VIOLATION

PROPERTY: FREEWAY 75-5
ISSUED: DAY 3 AT 11:15

AN INSPECTION OF YOUR PROPERTY FOUND: THE PERIMETER WALL ON THE EAST SIDE OF THE
LOT IS NOT MAINTAINED IN ITS ORIGINAL COLOUR.

THIS IS A VIOLATION OF SECTION 4.2 OF THE DECLARATION OF COVENANTS, CONDITIONS
AND RESTRICTIONS.

THE VIOLATION MUST BE CORRECTED BY DAY 13 AT 11:15.
A CONTINUING VIOLATION IS ASSESSED AT 1 BATTERY PER DAY.

YOU MAY REQUEST A HEARING BEFORE THE BOARD.
```

**This is the purest one in the family, because a covenant does not need a state
to survive.** The power district needed an office. The notice to quit needed a
court. The covenants need nothing: they run with the land forever. So the rules
are still in force, the fine still accrues daily, and the hearing you are
entitled to is before a board that has not met in years. **Nothing about this
document has to be broken for it to be frightening. It is working exactly as
designed.** And what it cites you for is the wall the county made you build.

It refuses to issue without the covenant section it is enforcing, because a notice
that cites nothing is unenforceable and this module does not make documents that
only look like documents.

## 7. THE GATES

```
SUBURB WALLS   29 / 0   new, red two ways
LANDLOCKED      green   the row's own three gates, all untouched
SUBURB MODULAR  green
SUBURB STREET   green
FIRST NOTICE   48 / 0
```

Red proved, not claimed: type the wall threshold instead of deriving it (3 red);
let quality decide the gate (1 red).

## 8. WHERE HE FINDS IT

**Tab: VOTE, in the alpha.** Five rows: THE FIRST NOTICE, WHO SENDS THE NOTICE,
YOU PAID IT, THE BLOCK HOLDS THE DOOR, and **THE RULES RUN WITH THE DIRT**.

## 9. ROUTED

**TO WHOEVER OWNS THE PLOT GENERATOR** (the walked world's own code, which rule 18
keeps this lane out of): `suburbPlot` compares a 0-to-1 quality against thresholds
of 1 and 4. The derived table is built and gated and ready to be read; the one
line that has to change is which units the comparison is in. Until then 2,558
tracts stand unwalled.

**A NOTE ON THE ROW'S OWN META**, found while reading: the generator's `meta`
still carries `pending: ['wall/gate quality thresholds', ...]` on every plot it
makes. That pending is nine weeks old and the reason it never closed is in section
2.

**STILL OPEN, carried:** the night card's `BATTERIES IN THE VALLEY: 0` on the
first night. Fix written down, waiting for the hold to lift.
