# BOHEMIA RESEARCH — WHY VALHEIM'S CAMP FELT FAST (8/4/26)

> "Val Heim's build menu and it's build system to me was the easiest to work with among the
> games I've played it really felt like you could just set up fucking camp anywhere quickly
> like very quickly"
> — Paolo, 8/4/26

**That is a ruling under NOTES ARE RULINGS: Valheim's build system is the named reference for
how placing a camp should FEEL in Bohemia.** Recorded, and then taken apart, because "it felt
easy" is a feeling and the job is to find the mechanism under it.

Sourced where it can be: `Grantapher/ValheimPlus` patches the real game classes, so the
file:line citations below are real. Where a claim is community/wiki it says so.

---

## FIRST — THE CONTRADICTION THAT ISN'T ONE, BECAUSE A LATER SESSION WILL BREAK IT

Clause 11 of `laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md` is his own ruling:
**"SETTING UP CAMP TAKES TIME."** The camp is not free to deploy, and that cost is what makes
*camp here or push on* a decision instead of a habit.

He has now said camp setup should be **very quick**. Read carelessly, that repeals clause 11.
It does not, because they are two different currencies:

- **CLAUSE 11 IS THE TIME COST.** Camping spends the in-game day. Untouched.
- **★ WHAT HE IS PRAISING IS THE INTERACTION COST.** Taps, menus, screens, mode switches.

**CHEAP IN TAPS. NEVER FREE IN TIME.** Valheim is exactly this: dropping a workbench is one
action with no menu depth, and it still cost you the trip out to gather the wood. Nobody may
read this record as permission to make camping free.

---

## WHY IT ACTUALLY FELT FAST — FIVE MECHANISMS

### 1. ★ THE TOOL IS THE MENU. THERE IS NO BUILD MODE.

You equip the hammer. **Left-click builds, right-click opens the menu**, and that is the whole
interface. No separate build screen, no mode you enter and exit, no inventory trip. The thing
in your hand *is* the build system, so the distance between "I want a camp" and "I am placing
a camp" is one item swap.

### 2. ★★ THE ASYMMETRY THAT IS THE REAL ANSWER

This is the finding, and it is the one to steal:

**Crafting and repairing at a workbench require a roof and 70% cover. Building inside its
radius and suppressing monster spawns require NO ROOF AND NO COVER AT ALL.**

So the moment the bench hits bare dirt you already have **the two things that make a camp a
camp** — a zone you can build in and a zone nothing spawns in. The house is optional and comes
later. **You are not building a camp, you are placing one**, and everything after that is
improvement rather than prerequisite.

That is the entire feeling he is describing, and it is one design decision.

### 3. ★ DECONSTRUCT REFUNDS, SO BEING WRONG COSTS NOTHING

Sourced. The mod's own comment on patching `Piece.DropResources`:

```
IsPlacedByPlayer     /* ValheimPlus/GameClasses/Piece.cs:13 */
Piece.Requirement.m_recover  /* Piece.cs:14 */
// "ensuring the resources that drop are never less than the resources
//  it cost to build the piece in the first place"   /* Piece.cs:19-21 */
```

In vanilla, taking down a piece **you placed** returns its materials (`m_recover` is the
per-material flag deciding what comes back). **There is no punishment for guessing wrong**,
which is why players place, look, tear down and re-place without hesitating — and hesitation
is what actually makes a build system feel slow.

### 4. YOU CAN SEE YOUR CLAIM

The build radius is **drawn on the ground as a white circle** — 20 m, upgradeable to 36 m by
building upgrades within 2 m (+4 m per level, five levels). No guessing where the zone ends,
no reading a number. (Wiki/community, not code.)

### 5. IT IS STILL PHYSICAL, WHICH IS WHY IT READS AS REAL

Vanilla runs a structural-integrity system that requires a connection to the ground — the mod
has a switch to *remove* "the integrity check for having a connected piece to the ground"
(`ValheimPlus/GameClasses/WearNTear.cs:29`). Fast to use, but not weightless.

---

## THE HONEST LIMIT: HE IS PRAISING THE CAMP FLOW, NOT THE ARCHITECTURE TOOLING

**Valheim's building is not universally loved.** There is a Steam discussion thread titled
*"Building Feels Terrible"*, and the developers added **manual build-piece snapping in 2023**
precisely because automatic snapping was a real pain point for anyone constructing something
elaborate.

So there are two systems inside Valheim's hammer, and only one of them is the reference:

- **PLACING A CAMP** — one object, no cover needed, instantly useful. **This is what he
  loved and this is what transfers.**
- **CONSTRUCTING A BUILDING** — snapping, rotation, structural integrity, roof pieces. Widely
  complained about, and **not** what he is asking for.

Any lane that reads this record as "copy Valheim's building" will build the second one.

---

## THE PART THAT DOES NOT TRANSFER, AND IT IS THE HARD PART

**Every one of those five mechanisms assumes a mouse.** Right-click for the menu, a cursor to
aim the ghost, a scroll wheel to rotate, WASD to nudge your body until the preview sits right.

**Bohemia is one thumb, portrait, 390×844.** So the hammer cannot be copied. What transfers is
the *principle* underneath it, and it is mechanism-level, so it is mine to state and his to
rule:

**ONE OBJECT PLACES THE WHOLE CAMP.** Not a menu of pieces to assemble — a single thing you
put down that creates the radius and works immediately, exactly as R1 already says
(`records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md`: *the camp is a no-spawn radius
the way a Valheim workbench is*). The upgrades come later and are optional, which is also
already ruled (R26, the camp upgrades across acts).

And the corollary from mechanism 3, which matters more on a phone than on a PC:
**PICKING THE CAMP BACK UP MUST RETURN WHAT IT COST.** On a small screen a misplaced object is
guaranteed, so the refund is not generosity, it is what stops one fat-thumb tap from feeling
like a punishment.

## WHAT IS HIS

- Whether the camp is genuinely one object or a small set of them.
- How many taps "quick" means, and what the interaction actually is. **UX is not my call and
  the RUN lane owns the surface.**
- The visible radius: whether Bohemia draws the circle at all, and what it looks like.
- The refund rate on picking a camp back up.
- Every number. **NO DAMAGE BEFORE THE DIAL**, and clause 11's time cost is his too.

## WHAT THIS DOES NOT DO

**Does not repeal clause 11** — setting up camp still costs in-game time. Does not design a
UI. Does not build anything. Adds no canon: it records a reference ruling and the mechanism
under it. Routed to **COMBAT** (which owns the camp per R1) and **RUN** (which owns the
surface), and this lane does not touch either.

## SOURCES

- **Code:** `Grantapher/ValheimPlus`, master — `ValheimPlus/GameClasses/Piece.cs`,
  `WearNTear.cs`. Fetched and read this turn. Same caveat as every ValheimPlus citation: it
  patches the real classes, so the field and method names are genuine, but a line number is a
  line in the MOD and its formulas are the mod's, not Iron Gate's.
- **Community/wiki (search-index summaries; the pages themselves 403 through this
  environment):** the Valheim wiki's Building, Hammer and Workbench pages for the roof/cover
  asymmetry, the radius numbers and the hammer controls; Steam discussions for the
  building-feels-terrible complaint; Massively Overpowered for the 2023 manual-snapping
  addition.
