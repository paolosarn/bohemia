# LAB 10 PATTERN NOTE — VALHEIM'S BUILD SYSTEM (8/7/26)

**A MODEL, not a measurement.** Valheim ships compiled Unity assemblies and Iron
Gate has never released source, so nothing here is a line of Valheim's own code.
Twenty of the page's constants are genuinely sourced off real open-source C#
(ValheimPlus, a HarmonyX mod that patches the live game's classes by name), the
rest are tagged `[DOC ...]`, and two are declared ours. Full tags:
`records/lab/BOHEMIA_LAB_VALHEIM_BUILD_TEARDOWN_8_7_26.txt`.

> "Val Heim's build menu and it's build system to me was the easiest to work with
> among the games I've played it really felt like you could just set up fucking
> camp anywhere quickly like very quickly"
> — Paolo, 8/4/26

---

## THE WHOLE THING IN ONE SENTENCE

**A workbench needs a roof and 70% cover to CRAFT. It needs neither to claim its
build radius or to stop monsters spawning.**

Which means the instant the bench hits bare dirt you already have the two
properties that make a camp a camp. The house is an optional later improvement.
**You do not build a camp, you place one.** That is one design decision and it is
the whole feeling he described.

Everything else good about Valheim's hammer is downstream of it or is the refund.

## THE SECOND THING, AND IT IS WHY "FAST" IS THE WRONG WORD

Taking a piece down returns what it cost. Not most of it, not a percentage —
their own comment says "the resources that drop are never less than the resources
it cost to build the piece in the first place."

**So being wrong is free, so nobody hesitates.** Hesitation is what actually
makes a build system feel slow. Not menu depth, not tap count, not load times.
People stand there working out whether they will regret it. Remove the regret and
the system feels instantaneous even when it is not.

On a phone that stops being a nicety and becomes structural: at 390px a
misplaced object is *guaranteed*, so the refund is not generosity, it is what
keeps one fat-thumb tap from reading as punishment.

## THE PATTERN, FOR ANY LANE

**1 · ONE OBJECT, NOT A KIT.** *building* in Valheim starts with a single thing
you put down. The station is exempt from needing a station in range — that
exemption, one line, is why your first tap on bare dirt always works. Any camp
system that requires assembling two things before either works has already lost
the feeling.

**2 · ONE RADIUS, TWO JOBS, NO SECOND NUMBER.** The build range and the
no-spawn area are the same value on the same object. We know because ValheimPlus
had to *invent* a second setting to pull them apart, and its default is a
sentinel meaning "just use the build range." A design with one knob cannot
develop an inconsistency between two knobs.

**3 · THE CLAIM DRAWS ITSELF.** The white circle's radius is assigned *from* the
build range, in code, on the next line. It is not a visualisation of the rule, it
*is* the rule. No number to read, no guessing where the zone ends.

**4 · PLACEMENT ANSWERS WITH A STATUS, NOT A BOOLEAN.** Valheim's own enum has
three values — Valid, Invalid, NoBuildZone. That is why the game can tell you
*why* you cannot build there. A boolean can only refuse.

**5 · ONE TOOL, THREE VERBS, NO MODE.** Place, repair and *deconstructing* all
run through one stamina hook keyed on the hammer. They are not three features
that happen to be near each other, they are one system, and there is no build
mode to enter or leave. The distance between wanting a camp and placing one is an
item swap.

**6 · IMPROVEMENT IS OPTIONAL AND VISIBLE.** *upgrading* is: park an extension
within 5 m, level goes up, the circle grows 4 m. Five levels, 20 m to 36 m. You
never had to do it, and when you do you can see it.

**7 · KEEP IT PHYSICAL.** Support still has to reach the ground. Fast to use is
not the same as weightless, and the weight is what makes it read as real rather
than as a menu.

## WHAT IT MEANS FOR US SPECIFICALLY

Clause 11 of the mobile-camp law is his own ruling: **setting up camp takes
time.** He has now said camp setup should be very quick. Read carelessly those
contradict. They do not, and the reason is the point of this whole page:

**CHEAP IN TAPS. NEVER FREE IN TIME.**

Valheim is exactly that. Dropping the bench is one action with no menu depth, and
it still cost you the trip out to gather ten wood. Nobody may read this note as
permission to make camping free. The interaction is what gets cheap; the day does
not.

## WHAT NOT TO PORT

- **VALHEIM'S ARCHITECTURE TOOLING. This is the big one.** There are two systems
  inside that hammer and only one is the reference. *Placing a camp* is what he
  praised. *Constructing a building* — snapping, rotation, roof-piece geometry,
  wall-by-wall walls — is the half with a Steam thread called "Building Feels
  Terrible" and a manual-snapping feature added in 2023 to apologise for it. Any
  lane that reads "copy Valheim's building" will build the wrong one.
- **THE MOUSE.** Every mechanism above assumes right-click for the menu, a cursor
  to aim the ghost, a scroll wheel to rotate, and WASD to nudge your body until
  the preview sits right. Bohemia is one thumb, portrait, 390x844. The hammer's
  *interface* cannot be copied; only the principle under it can.
- **THE NUMBERS.** 20 m, 8 m, 70%, five levels, every recipe. All Valheim's
  content, all replaceable wholesale, and NO DAMAGE BEFORE THE DIAL means none of
  them becomes one of ours by being written down here.
- **THE REAL-TIME PART.** Stamina per swing, durability decay over days, weather
  damage. Bohemia's clock is spent by actions, not by seconds.

## HONEST LIMITS

- **Every primary documentation page 403s through this environment's proxy** —
  the official wiki, the fandom wiki, Steam discussions. So every `[DOC ...]` tag
  rests on a search-index summary of a page that could not be opened. The five
  level numbers and every recipe are in that category.
- **The four upgrade recipes are the least certain numbers on the page.** The
  chopping block and tanning rack I would defend; the adze and tool shelf costs
  are the ones I would re-read first. They are content, so being wrong about them
  costs nothing structural, but it would still be wrong.
- **ValheimPlus is a mod, so a formula read off it is the mod's formula**, not
  Iron Gate's. Where that matters — the integrity percentage-reduction maths —
  the teardown says so on the row. Field names, method names and per-setting
  defaults are a different case: a mod that got those wrong would not load.
- **The per-material integrity figures are not readable at all**, so the page
  ships the sourced *structure* (two loss axes, a 0..100 clamp, support must
  reach the ground) with one declared-ours magnitude rather than inventing seven
  numbers and dressing them as measurements.
- **Nothing here has been wired into the engine and nothing here is ported** —
  this is a reference artifact under `slices/lab/`, it touches no engine module
  and no art bank, and *spawn suppression*, the radius and the refund all stay in
  this lane until he says otherwise.
- **NOT IN A TAB YET**, and by law it never will be: the lab's own gate forbids
  any shipped surface from linking a lab page. It is reached by its own file.
- **The gate said 572/0 while the page's single most important visual was missing
  from the screen.** The white claim circle fell off the canvas entirely, and the
  player marker was drawing at minus one pixel wide. Both found by opening the
  PNG, neither findable by a check that asks a function what it returns. Full
  write-up in the teardown; the short version is that a finding about what a
  player can SEE needs a check about pixels, and this page did not have one until
  it had already shipped a screenshot that proved it.

## THE CORRECTION THIS TURN MADE TO OUR OWN RECORD

`records/BOHEMIA_RESEARCH_VALHEIM_BUILD_FEEL_8_4_26.md` filed the 20 m radius and
the visible white circle as "Wiki/community, not code." Both are **sourced**, and
by two adjacent lines of `CraftingStation.cs` that assign the circle's radius
*from* the build range. That record undersold what was checkable. Corrected on
those two claims; it stands on the rest.

The lesson is the one this repo keeps learning in different clothes: **a claim
filed as unverifiable is a claim nobody went back and tried.** The research turn
searched; this turn opened the file.

## WHAT IS HIS

- Whether Bohemia's camp is one object or a small set of them.
- How many taps "quick" means, and what the interaction actually is.
- Whether Bohemia draws the circle at all, and what it looks like.
- The refund rate on picking a camp back up.
- Every number.

**[PENDING Paolo]** all five. He plays the page and rules; the lane ports
nothing on its own.
