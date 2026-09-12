# COOK — HAIR HAS 21 COLOURS, AND THE SECOND MECHANISM I ALMOST BUILT
9/11/26 · lane 16 COOK · job [hair colours] · BUILD 9/12b

## THE RULING

Paolo, this round, unprompted:

> "The more the better I don't know why you're asking me if you want hair colors,
> bro of course add them, bro."

Two things in one sentence. **Add them** is the ruling. **Why are you asking** is the
correction, and it is the bigger half: the hair-colour question had been sitting in my
WHAT I NEED FROM YOU block for four rounds. EVERYTHING IS A THUMB (8/9) says I decide,
build it, and put it where he meets it. Asking was the bug.

## WHAT I ALMOST SHIPPED, AND WHY IT WAS WRONG TWICE

**First wrong version.** I added a `hairWear()` setter that let a wearer's colour beat the
ramp `genHair` bakes into a cut. I wrote it before reading how a citizen is actually
coloured. The answer was already in the file, in two places, in somebody else's hand:

    slices/BOHEMIA_ALPHA_0_9.html:8265   the hair layer LUMINANCE-TINTS by `hairColor`,
                                         building its own three-tone ramp from one rgb
    slices/BOHEMIA_ALPHA_0_9.html:16571  "NPCFactory has owned skin tone and hair colour
                                         since 7/2 and is what the RUN already uses ...
                                         No second mechanism is written for skin or hair
                                         -- ENGINE SYNC LAW."

Per-person hair colour already exists and ships. My setter was the second mechanism that
law names by name, and it would have stacked an override under a tint.

**Second wrong version.** I then wrote a picker in the look module that leaned grey on an
age band, with a comment saying "the look module already carries an age band per person."
It does not. `bodyFor` returns six numeric dials — height, belly, arms, shoulders,
armLength, hips — and nothing else. Measured output: 20.1% dyed and 3.5% grey, the exact
parade I had written a paragraph about avoiding. And the file already said so at :5226,
again in somebody else's hand:

> "the street has no age at all, and its hair colour comes straight from NPCFactory ...
> Fixing it for the crowd means giving the crowd real ages, which is a system, not a line."

They were right. I did not read it first. **A claim about the codebase made from one of the
two places is a guess** — written on 8/1, quoted on 8/28, and I did it again.

## WHAT THE BUG ACTUALLY WAS

Not a missing mechanism. **A seven-entry list.**

    var HAIR_COLORS=[null,[20,18,22],[150,120,80],[110,70,50],
                     [196,150,150],[80,80,90],[200,60,40]];

Nineteen hair colours existed in the file and seven of them were reachable by a citizen.
That is the whole of "the more the better."

## WHAT SHIPPED

**Cook 1 — the palette.** `tools/bohemia_hair_has_colours_9_11_26.py`
Eleven new ramps (18 total) plus `HAIR_RAMPS`, one named table. Real heads first — jet,
black, ash, brown, auburn, ginger, rust, sand, platinum, bleach, steel, grey, white — then
the dye, because EVERYONE DRESSES LIKE A RUNWAY: acid, moss, magenta, teal, violet. Every
dye sits at or under the saturation the wardrobe already reaches (the loudest approved
garment measures 188), so COLOUR IS TERRITORY is undisturbed. **Zero behaviour.** `genHair`
is untouched, which is why all 1,744 pinned garment hashes are byte-for-byte unmoved.

STRUCTURE-NOT-COLOR is why this is not 11 cuts × 18 colours. That would be 77 garment rows
holding 11 silhouettes. A cut is a shape; a colour is a colour.

**Cook 2 — the crowd.** `tools/bohemia_hair_colour_on_people_9_11_26.py`
The list goes **7 → 21**, and it is not retyped: the tool READS the eighteen ramp mids out
of `HAIR_RAMPS` and builds the crowd entries from them, so the colour a hair GARMENT bakes
and the colour the crowd TINTS with cannot drift into two different blondes. Paolo's own
pink `[196,150,150]` and red `[200,60,40]` are kept — his colours do not get deleted to
make room for mine.

The weights keep the 8/27 ruling's shape (black and brown dominate, blonde is a minority,
natural red is 1-2%, grey is age, dye is a statement). **Measured on 4,000 citizens:**

    natural dark   43.5%   BROWN 15.6  BLACK 14.1  ASH 7.7  JET 6.2
    art default    11.7%   the painted ramp, untinted
    natural light  23.4%   SAND 10.0  AUBURN 4.0  PLATINUM 3.2  BLEACH 2.2  GINGER 2.1  RUST 2.1
    grey family    15.6%   GREY 7.9  STEEL 5.1  WHITE 2.7        (was 7%)
    dye             5.6%   ACID 1.2  MOSS 1.0  TEAL 1.0  MAGENTA 1.0  VIOLET 0.6  RED 0.5  PINK 0.4

All 21 reachable. Dye 5.6% against a cap of 8. The portrait path independently measures
5.67% dye, so portrait and body are picking from the same palette.

**Grey is flat, not aged, and the record says so.** 15.6% is the share of a mixed adult
street applied evenly. WHO is grey waits on the crowd having real ages — that is a system,
not a line, and :5226 called it correctly before I got there.
→ **[FOR PEOPLE]** grey should follow age once a citizen has one. The hook is `HAIR_WEIGHTS`.

## AND THEN I LOOKED AT IT, AND EVERY NUMBER ABOVE WAS TRUE AND THE PICTURE WAS WRONG

I rendered one real citizen per colour and put the sheet on screen. **MAGENTA, VIOLET and
PINK were blonde.** Twice this session now: a cook that scores perfectly and looks wrong.

Measured after:

    92.4% of citizens wear a PERSONLOOK hair GARMENT (2,000 sampled)
    :8263   if a person wears one, the PD hair layer is SKIPPED -- `continue`
    :8265   the luminance tint by `hairColor` lives INSIDE that skipped branch

    citizen bp:95   picked MAGENTA [142,32,92]
      portrait hair                        [142,32,92]   exact
      closest pixel anywhere on the BODY   65 away
    bp:170 VIOLET 68 · bp:5 TEAL 59 · bp:67 ACID 66

**The portrait that pops up when somebody talks had magenta hair. The person standing in
front of you did not.** For nine citizens in ten. ONE ID, ONE WHOLE PERSON (8/27) has been
broken for hair COLOUR this whole time — the identical bug the 8/28 note found and fixed for
the haircut SHAPE, in the same two renderers, and nobody checked the colour half:

> "three quarters of the people in Bohemia had one haircut standing in front of you and a
> different one in the portrait that popped up when they spoke"

**And it means cook 1 overcorrected.** I removed the wearer-colour override calling it the
second mechanism ENGINE SYNC LAW forbids. Wrong reading. There is ONE colour — NPCFactory
picks it off your id — and TWO renderers, and only the portrait honoured it. Making the body
honour the same colour is that law satisfied. A second *picker* would break it. This is not
one: **nothing in cook 3 chooses a colour. It looks one up.**

**Cook 3 — the body wears it.** `tools/bohemia_hair_the_body_wears_it_9_11_26.py`

    person's rgb -> NPC_FACTORY.hairColors index -> hairColorNames[i] -> HAIR_RAMPS[name]

A lookup, not a blend, and **only possible because of cook 2**: the crowd entries ARE the
ramp mids, built by reading `HAIR_RAMPS` rather than retyping. So a person's colour resolves
back to the exact authored three-tone ramp. No synthesis, no invented shade, no second
palette. Cook 2's docstring claimed the two tables could not drift; cook 3 turns that claim
into a lookup that would fail loudly if they did. Null and any unresolved colour fall through
to the cut's own ramp, which is exactly what "art default" means.

Set and cleared around one `gen()` call, in a `finally` — a colour left standing would paint
the next head drawn, and `gen()` sits inside a `catch` that swallows.

After: **MAGENTA, VIOLET, TEAL and ACID all found exact on rendered body pixels. 0 away, from
59-68.**

**Two colours still didn't reach a body, and they were Paolo's.** His dusty pink and his red
have been in the crowd palette since 7/2 with no ramp, so the lookup fell through and those
two citizens kept the cut's colour. Both now have ramps whose **mid is his value unchanged**;
only the dark and light ends are derived. Every non-null crowd colour is now a ramp mid,
which is a claim a gate can hold instead of a habit I have to keep.

## THREE BUGS FOUND ON THE WAY

**1. The engine never got the 8/27 weighting.** `engine/bohemia_engine.js` had
`HAIR_COLORS` but no `HAIR_WEIGHTS` and no `pickHair` — `npcFrom` still called the uniform
`this.pick`. So the engine's crowd has been the exact parade the 8/27 measurement condemned
(one head in seven bright red) for two weeks, while the alpha was fixed. ENGINE SYNC LAW.
Both copies now hold the same list, the same weights and the same weighted pick, and the
cook asserts they are byte-identical before it writes either one.

**2. The dye gate was one palette change away from going blind.** `talking_portrait_gate`
counted dye against two hardcoded triples and warned, in its own comment, that a palette
change would make it "quietly read zero forever." That came true the moment the list grew:
five new dyes, still measuring two, reporting a comfortable 1%. The palette now DECLARES
its own dye (`HAIR_DYES`) and its own names (`HAIR_COLOR_NAMES`), the factory carries them,
and the gate reads them. Mutation-tested three ways — no dye declared, a dye name that is
not in the colour list, fewer than two dyes — all red, restore green.

**3. The face maker's swatch row offered seven colours** while the crowd wore 21. HE CAN
BUILD HIS OWN FACE is a law. Same names, same mids, one palette everywhere.

## THE PROBE THAT SAVED A FALSE FINDING

My first measurement printed `portraitDyePct: 0.0`, which reads exactly like a finding. It
was not — `HAIR_DYES` is scoped, the probe could not see it, and everything downstream was
comparing against `undefined`. The probe printed `sawDyes: false` on the line above, which
is the only reason I knew. **A probe that does not print whether it can see its target
reports perfection.** Same lesson as the fortress probe, same session.

## NUMBERS

    talking_portrait_gate   29 / 0   (dye arm rewritten, two new arms, all mutation-tested)
    clothes_4x_gate         13 / 0   (all 1,744 pinned hashes unmoved)
    hair_gate               39 / 0
    craft_law_gate          39 / 0
    hair_eight_facings      19 / 0
    hair_graveyard_gate     13 / 0
    portrait_haircut_gate   12 / 0
    hairline_gate           12 / 0
    face_maker_gate         13 / 0
    face_canon_gate          9 / 0

Ratcheted in the same turn, because the wider palette pushed every face further from every
other face and the gate said so itself: `PINNED_CLOSEST` 0.012 → 0.017 (measured 0.0194),
`PINNED_MEAN` 0.080 → 0.085 (measured 0.0884). Not set flush against the measurement — a
floor with no headroom is a red handed to the next lane that touches a palette for a
perfectly good reason.

## THE TWO NEW GATE ARMS

**"every colour a citizen can wear resolves to a ramp"** — without one, a body silently keeps
the cut's colour, which is precisely how Paolo's pink and red hid for two months.

**"THE BODY WEARS THE COLOUR THE PORTRAIT IS WEARING"** — eight LOUD colours, measured on
rendered body pixels, not on the dials that produced them. The dials agreed the whole time;
both halves read the same `hairColor` and one threw it away at draw. Loud colours on purpose:
a near-black wearing a near-black ramp agrees by accident and would let this pass on a build
where nothing works.

Mutation-tested three ways: stop handing the person's colour to their cut (0/8, worst 146),
take a ramp away from a colour (names RED, 7/8), make genHair ignore the wearer (0/8). All
red, restore green.

## ONE MORE THING THE SHEET TAUGHT

The first sheet cast the FIRST citizen matching each colour, and RED landed on a shaved head
and GREY on a tiny cut — true people, useless picture. The sheet now scores ten real
candidates per colour on how many body pixels carry their own colour and photographs the
best. Nothing is faked: every head is a real citizen the game made, wearing the colour the
game gave them. Which of ten real people gets photographed is casting, not fiction.
Hats are off in the sheet and it says so on itself, because nine of the first twenty-one
heads came out under a cap — true of the street, useless as a picture of hair.

## THIRTEEN PICTURES RE-SHOT, AND A RULER THAT MEASURES THE CLOCK

A hair change makes every picture of a person false. Re-shot with their own recorded shooters:
one-head, the-bald-crowd, one-id-one-person, the-face-talks, portrait-haircut, hair-reference,
one-haircut, wardrobe-4x, hair-edge, hair-profile, hair-strands, the-missing-hats,
the-portrait-pops-up. look_gate's stale count went 51 -> 38.

**The other 38 are not mine and cannot be, and proving that took a second look.** look_gate
compares FILE MTIMES: a picture is stale if it is more than six hours older than the surface
it photographs. I baselined it against a clean worktree of origin/main and it read 24/0 — but
a worktree checkout stamps every file with the current time, so that gate is green there no
matter what. **Touching only the alpha in that worktree still read 24/0**, which is the proof
the baseline was worthless for this one.

In a real tree the picture is the opposite: `BOHEMIA_CITY_WORLD.html` carries an mtime of
23:42 and I did not touch it this round, yet 23 pictures clocked against it were stale before
I began. So look_gate was ALREADY red here. A freshness gate keyed on mtime is unclearable in
any working tree older than six hours and free in a fresh one — it measures how long the
container has been alive, not whether the picture is true.
→ **[FOR THE PLUMBER]** clock it on a CONTENT hash of the surface recorded beside the picture,
which is what freshness means. Its own header already carries the lesson: "A CHECKER THAT
CANNOT TELL WHAT IT IS LOOKING AT IS THE BROKEN ONE."

## THE SECOND SLICE THAT EMBEDS THE ENGINE

`run_gate` was 123/3 on main and 123/3 here, and one of those three was "regenerating via
tools/build_run_slice.js changes nothing". `BOHEMIA_RUN_CURRENT.html` inlines 67 engine
modules, so it was carrying the old seven-colour palette while the alpha carried twenty-one —
exactly the drift ENGINE SYNC LAW exists to stop, and it was already stale on main before I
arrived. Regenerated: **123/3 → 124/2**, one red cleared that was not even mine. The two
remaining are door-wall geometry and are pre-existing.

**Two published slices embed the engine and neither rebuilds itself:**
`BOHEMIA_CURRENT_SLICE.html` (`node tools/build_current_slice.js`) and
`BOHEMIA_RUN_CURRENT.html` (`node tools/build_run_slice.js`). Touching
`engine/bohemia_engine.js` means rebuilding both, and nothing says so anywhere a lane would
read it. That is how one of them was already stale on main.
→ **[FOR THE PLUMBER]** one gate that fails when a slice's embedded engine is behind the
engine file, naming the command. Both gates half-do this today and only for their own slice.

## AND THE FROZEN LIST SHRANK BY TWO, WHICH IS THE PART THAT LASTS

Main landed `derived_freshness_gate` this round (PLUMBER, "nothing is baked once"). It holds
a KNOWN_STALE list that MAY ONLY SHRINK, and `BOHEMIA_RUN_CURRENT.html` (+938/-55) and
`BOHEMIA_CURRENT_SLICE.html` (+107/-11) were both on it. Rebuilding them took both entries
off: the gate itself demanded the deletion — *"a file that re-derives clean again has been
fixed, and leaving it listed lets the next stale bake hide behind a stale excuse."*

**8/1 on main → 9/0 here.** A standing red cleared and a ratchet tightened, from a lane that
came for hair colours.

They came off almost by accident, and that is the part worth writing down. I changed the
engine, `current_slice_gate` went red, and its own message named the command. Both slices
inline the engine — the run slice carries 67 modules — so both had been serving the old
seven-colour palette while the alpha carried twenty-one. That +938/-55 was two weeks of every
lane's engine work, not one bad bake. **A gate whose message names its own fix gets fixed.**

## FORTY-TWO REDS CHECKED AGAINST MAIN, THIRTY-FOUR PROVEN NOT MINE

The suite ended with 42 failing gates, which is the standing state of this repo, not a verdict
on this change. **A red is only yours if it is not red on main**, so every one was re-run
against a clean `git worktree` of origin/main and the tallies compared:

    IDENTICAL (not mine, 33): DISTRICT FILL 52/1 · REPO BUDGET 6/1 · BUILD THE WORLD 8/2 ·
    NO CANOPIES 4/1 · COMBAT LAB 929/3 · COMBAT RUNS · PERSON LOOK 21/1 · MOTION VISIBLE 22/2 ·
    RIG CHECK 212/4 · FIELD SURGERY 16/2 · OUTFITS 13 16/2 · CAST SHAPES 5/1 ·
    WALK DEADLOCK 22/1 · BUILD SIZE 20/1 · SKY TOUCH 19/1 · MANDATE FACE 13/2 ·
    QUEST PLACEMENT 18/2 · VOICE 108/1 · DIALOGUE CATALOGUE 60/3 · ADDRESS 40/1 ·
    LANGUAGE 80/1 · BANKS USED 24/2 · ZOOM BUILD 23/1 · ORGAN REACH 7/1 · CARD FOLD 17/1 ·
    INTERIORS 41/1 · MAP TAB 8/1 · REUSE FIRST 202/4 · TARGET MATCH 278/1 ·
    WIRED IN A TAB 66/2 · CANVAS MEMORY 27/3 · BATTLE BROS 73/1 · TOP OF THE DOC 8/2

    MINE, AND FIXED: CURRENT SLICE 5/1 → 6/0.  MINE, AND BETTER: THE RUN 123/3 → 124/2.
    MINE, AND EXPLAINED: LOOK — the mtime ruler above.

`BUILDER WHERE HE WALKS` is the one that nearly got written down wrong. It read 15/1 on main
and **12/4** here, which is the shape of a real regression. Two things had to be ruled out:

1. **Was it my demo re-cut?** Main's committed demo could have been stale, so I re-cut the
   demo inside the main worktree and re-ran it there: still 15/1. Not that.
2. **Was the gate stable at all?** Run twice in my own tree, unchanged between runs: **12/4,
   then 15/1.** It is flaky. 15/1 matches main exactly.

Flakiness under load still deserved a mechanism, because my resolver runs inside the draw
loop and the phone has to hold 60. So I measured instead of reasoning: **the resolver costs
1.43 µs per call against a 27.94 ms full person draw — 0.005% of it.** There is no threshold
my change could push. Measured, not argued, and it is also why the resolver stays a plain
scan: a cache here would buy five thousandths of a percent and cost an invalidation bug.

`BATTLE BROS` deserves naming because it looked like mine and was not: its failure text
literally lists `engine/bohemia_engine.js`, the file I changed. 73/1 on both.

**A gate timing out is not a gate failing, and the two read the same from a distance.**
`THE RUN` first came back with no tally at a 500s budget and I nearly wrote it down as a
difference. It needs longer than that. The number was 123/3, the same as main.

## FOUR REDS CHECKED AND PROVEN NOT MINE

Every failing gate near this work was run against a clean worktree of origin/main and matched
exactly: `personlook_gate` 21/1, `city_cast_silhouette_gate` 5/1, `faction_outfit_gate` 16/2,
`dialogue_catalogue_gate` 60/3, `organ_reach_gate` 7/1 (BohemiaPeople and BohemiaDeeds each
carry one dead function), `mandate_face_gate` 13/2.

`mandate_face_gate` is worth naming: its two failures are "the card does NOT name a faction as
holding the ground you stand on" and "it puts NO number on the top rung". Both are canon only
Paolo can rule, and the gate is RIGHT to refuse — MAP LAW says Claude never designs the map.
The handoff records it at 15/0, so it went red after 8/31.
→ **[FOR FACTIONS + DIRECTION]** two rulings, not two fixes.

**One red WAS mine and is fixed:** `current_slice_gate` 5/1 → 6/0. `BOHEMIA_CURRENT_SLICE.html`
embeds the engine, and I changed the engine without regenerating it. Its own message named the
command that clears it.

## WHERE HE SEES IT

**CHARACTER tab**, the NEW CROWD button. Also on every person in the **RUN** and the
**CITY**, since this is the table that colours every head in the game.
