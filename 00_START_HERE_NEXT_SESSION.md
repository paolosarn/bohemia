FACTIONS (factions-ovkjpf): 8/11 (s) LATEST — *** NEW LAW, HIS: NEVER MAKE HIM HUNT. ***
laws/BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT_8_11_26.md. Gate: NO HUNTING, 7/7, BLOCKING.
Tab: LIFE -> WHAT IT COST YOU (top card, opens on it, nothing to tap).

HIS WORDS: "you can't have me test shit out in the run app for real like unless you're
gonna place me right in front of it every time... I'm not hunting bro like how the fuck
am I supposed to find what you want me to find so put a new rule somewhere never tell
me to check something out by checking the run app"

WHAT EARNED IT WAS MINE, the turn before. I shipped the faction consequence line INTO
the run -- correct, that is where a player meets it -- and then told him to reach it by
playing the block quest and opening the phone. Minutes of navigation to confirm one
readout, and if a trigger does not fire he concludes the work is broken. A HUNTING
INSTRUCTION TURNS GOOD WORK INTO A FALSE NEGATIVE, which is worse than not surfacing it.

THE RULE: never route him through the run to inspect something. Place him right in
front of it, every time. If it needs steps to reach, it is not shipped for judgement.
The run is for PLAYING, never for INSPECTING. Shipping INTO the run stays correct and
encouraged -- the ban is on using it as an inspection route.

FIXED THE SAME TURN: slices/BOHEMIA_WHAT_IT_COST_8_11_26.html, top card in LIFE. All
89 endings across his 21 canon quests, each showing the exact card the phone gives him
-- follower count, then WORD CARRIED n TILES, which factions moved and to what rung,
who got stirred up. Renders on load. Same modules and same reachOf()/rungOf() calls the
run makes, so the page cannot drift into showing something the game does not do.

GATE: no_hunting_gate.py, BLOCKING. Fires only on the exact costly shape (a look-here
pointer + the run as the route + chained steps), never on the word "run" and never on
shipping into it. Self-tests by feeding itself the sentence that earned the law. Also
holds: every hub card points at a page that EXISTS, and a judged surface RUNS ITSELF on
load. Its first cut had a VACUOUS claim -- it looked for page filenames inside the
handoff, found zero, and passed green -- so it was turned around to sweep the hubs,
where the set can never be empty. That trap has now been caught three times in two days.

ART (f3eu53): 8/11 (b) LATEST -- *** THE FIRST APPROVED FAMILY IS IN THE GAME:
THE RAILYARD DRAWS HIS APPROVED TRACKS. CORRECT-AFTER, AS THE NEW LAW ORDERS. ***
Record: records/BOHEMIA_TILE_BOARD_SITTING_8_9_26.md (third-pass section)

TAB: RUN. Walk the railyard (cell 55,29): the classification fan now draws the
approved TF-ART-010 yard corridors and ballast plates instead of generic dirt.
The mechanism is the reusable part: an approved-families hook in the run's
ground draw that beats the generic bought override, fed by the builder, which
REFUSES any bank whose law line is not APPROVED. Wiring the next family is now
mostly builder-list + one draw rule.

NEXT WIRINGS, in order of visible surface: flat roofs (TF-ART-012, every
commercial building top, needs mass-edge parapet logic), corrugated skins
(TF-ART-002, warehouse walls via civic-skin path), parking stalls (TF-ART-003,
needs a stall-name probe per district first), chain-link (TF-ART-004,
multi-cell see-through overlays, its own pass). Rail volume still open:
turnout, crossing, buffer stop, vertical mainline.

ART (f3eu53): 8/11 (a) -- *** THE TILE BOARD VERDICT IS IN: 14 FAMILIES

FACTIONS (factions-ovkjpf): 8/11 (r) LATEST — *** THE RUN FINALLY SHOWS WHAT A QUEST
COST YOU. THE INTEGRATION LEDGER'S OLDEST PARTIAL IS CLOSED. ***
Tab: LIFE -> WHAT IT COST YOU (opens on it, nothing to tap). It ALSO landed in the
RUN's phone where a player meets it, but NEVER send him into the run to check it --
laws/BOHEMIA_ADDENDUM_NEVER_MAKE_HIM_HUNT_8_11_26.md, which this line earned.
27/32 systems now integrated (was 25/31).

"WE HAVE A DEMO TO SHIP" changed the target, so I went to the integration ledger
instead of building another system. The oldest PARTIAL, sitting there since 7/26:
    factions / world bridge | PARTIAL | quest outcomes really move faction standing,
                                        but nothing in the run SHOWS it
Four days of reputation machinery moving real numbers a player never sees. For a demo
that is fatal -- the entire faction layer was invisible.

THE RUN LANE'S JOB IS INTEGRATION, NOT FEATURES (Paolo 7/26): "the measure of the lane
is not what did you add, it is what is finally IN it that we already made." NOTHING NEW
WAS COMPUTED. The run simply never loaded two modules that were already built and
already gated (bohemia_standing 35 claims, bohemia_deeds 27) and never read the
FactionWorld its own world bridge had already moved.

THE FEED CARD now carries the consequence under the vanity follower count:
    WORD CARRIED 24 TILES      the clout tag's real reach (#quiet 7, #reckless 24)
    CARAVANS +10 - NEUTRAL     which factions moved + the rung they now sit on, read
                               off the LIVE FactionWorld, never the quest's scratch
    CARTEL STIRRED UP          @DO faction_posture, wired 8/7

VERIFIED ON THE REAL SURFACE, not by the build succeeding: driven in a real browser to
the phone, zero page errors, rendering
    'The Toll Road - COMPLETE / +110 followers / WORD CARRIED 24 TILES /
     CARAVANS +10 - NEUTRAL / CARTEL STIRRED UP'

CLOSING THE ROW NEEDED A PROBE FOR THE SHOWING, NOT THE MOVING. Otherwise the ledger
would read INTEGRATED because a number changed in memory where no player can see it --
the exact class of claim that gate exists to refuse. New probe world_bridge_shown
checks the run really renders off standingWith('player'), rungOf() and
BohemiaDeeds.reachOf(). INTEGRATION 116 passed. RUN GATE 126 passed.

WHAT IS STILL NOT IN THE RUN, from the same ledger (none of it mine):
    district heroes + district art (21 types) .. PARTIAL, material pass only
    day cycle / light / LIGHT=TERRITORY ....... NOT YET, block is one fixed hour
    economy .................................. NOT YET, off by his 7/31 ruling
    dress-by-rank ............................ NOT YET, bodies are random colourways
    vehicles ................................. NOT YET, driveways empty
If the demo needs one more thing after this, DAY CYCLE is the one a player feels
hardest -- a fixed noon reads as a prototype.

CONTAINER WARNING, THIRD TIME TODAY: this container silently reverted to an 8/2
snapshot mid-turn three separate times, losing the local checkout each time. Everything
pushed survived; only uncommitted work was at risk. COMMIT AND PUSH EARLY AND OFTEN.
The revert also wipes Pillow/numpy despite the SessionStart hook, and
tools/build_run_slice.js hard-fails without PIL -- rerun
`python3 -m pip install -r gates/requirements.txt` when a build dies on ModuleNotFound.
A restored run-slice source can also be STALE (mine was missing a placeholder the
current builder needs) -- always re-apply edits to main's version, never restore a copy.

CHARACTER (0lurbs): 8/11 (o) LATEST — THE FAMILY CAST IS ON THE RIG AND IN THE GAME.
CHARACTER tab, under THE FAMILY. Father, mother, brother, sister, tap any one to turn
it through all eight facings.
DECIDED, NOT ASKED. Under EVERYTHING IS A THUMB (8/9) I withdrew my own question
("do I show you candidates or do you describe them first") as exactly the process
question that law bans, and built them.
THE CAST WAS ALREADY CANON, not invented: ACT1 OPENING VISION 7/19 fixes all four
roles and the gender mirror (male keeps the older BROTHER, female keeps the older
SISTER). survivesIf carries the mirror per role instead of baking one gender's cast.
BODIES are BODYVAR dials on the ONE rig, all well inside the measured height cap.
WARDROBE is 100% st==='canon' -- NOT ONE NEW GARMENT WAS COOKED. NAMES are drafts
(RAY / DENISE / MARCO / NINA) tagged draft:true per CLAUDE.md's 8/11
make-an-attempt amendment: four strings in one place, edit them, no blank page.
SHADOWS ARE SEPARATE, STRUCTURALLY. Each member is TWO STACKED CANVASES, shadow
under, sprite over. That is forced, not stylistic: drawChar ends in putImageData
which REPLACES destination pixels, so a shadow on the sprite canvas is either wiped
(before) or painted over the body (after). A separate element is the only place it
can be visible AND provably outside the garment pixels.
*** TWO THINGS I ONLY FOUND BY LOOKING AT IT, AFTER THE GATE WAS ALREADY GREEN ***
1. THE SHADOW WAS INVISIBLE. Black at 42% on a near-black stage: painted, counted
   by my own gate, and impossible to see. A shadow you cannot see is not a shadow,
   it is a passing test. The stage has a floor now (gradient lifting toward the
   feet) so the shadow has something to fall on.
2. AN EXPOSED SHIN PAINTS THE DARK UNDER-BODY, NOT SKIN. The sister was in CUTOFF
   DENIM SHORTS. Measured: her shin band is 31,31,36 x188 with shorts, which is
   BYTE-FOR-BYTE identical to wearing NO leg garment (noLegs 31,31,36 x188), while
   BLUE JEANS gives 64,80,110 x253. The same body paints bare ARMS as skin under a
   short sleeve. *** THAT IS A REAL PRE-EXISTING BUG IN THE BODY RENDER, NOT MINE,
   AND NOT FIXED HERE *** -- any character in shorts has grey shins. She wears jeans
   now (a kid woken at night reads better than shorts anyway) so the demo does not
   wait on it, and the gate holds the cast to clothed legs WITH THE REASON WRITTEN
   IN so nobody mistakes the workaround for the fix. NEXT SESSION: fix bare-leg skin.
GATE: gates/family_cast_gate.js, registered as FAMILY CAST. 18/0. MUTATION TESTED
TWICE -- the first mutation was too crude (famPaintShadow clears, so it erased the
bodies and collapsed the four to one signature), so I redid it as the realistic
"someone merged the layers" version: bodies intact, shadow drawn into the sprite
canvas, and all four members fail by name on the shadow-separation claim.
ALPHA LOADS 20/0, SUN MODE green, CANVAS SCALE unchanged at 52/1 (city lane's).
Shot: records/familycast/cast.png

ART (f3eu53): 8/11 (a) LATEST -- *** THE TILE BOARD VERDICT IS IN: 14 FAMILIES
APPROVED (475 TILES), 3 KILLED. "Im so impressed." WIRING IS NOW THE LANE'S
WHOLE JOB. ***
Records: records/BOHEMIA_TILE_BOARD_VERDICT_8_11_26.txt +
records/BOHEMIA_TILE_BOARD_KILLS_POST_MORTEM_8_11_26.md

UP (14, banks now carry the APPROVED law line, volume unlocked): block wall,
corrugated+roll-ups, parking lines, chain-link, sports fields, empty pools,
storefronts, brick, train tracks, freeway, flat roofs, mobile homes, crop
fields, deck stairs. The 9 duplicate forms covered by these banks inherit the
approval.

DOWN (3, GRAVEYARD FINAL, banks + cooks removed, proofs kept as evidence):
- The landfill (55 tiles). TF-WORLD-012's coverage died with it - REOPENED.
- The three money icons: measured laws all passed and he killed them anyway;
  green is never the argument. Fresh cook sources from BOUGHT art.
- The contact shadow: a motion feature judged as a still. A fresh answer gets
  judged WIRED and WALKING. The slot (bodies float) stays real.
Graveyard lines added for all three bank names.

SURFACES: the TILE BOARD page is now the RECORD (14 cards, APPROVED badges, no
thumbs, no export); ART tab banner says VERDICTS IN; the LIFE hub card is
removed (answered questions fall off the to-do list) with the ANSWERED
exemption recorded in name_the_tab_gate.

*** NEXT (the GO list, in order): WIRE THE APPROVED FAMILIES INTO THE WALKED
WORLD. Biggest wins first: flat roofs (86 tiles, every commercial building top),
corrugated skins (warehouse district), chain-link + parking lines (every lot),
train tracks (railyard), deck stairs (needs TF-CMB-004 slab cooked to join).
Each wiring is per-district legend work + its district gate; interior=exterior
and occupancy laws apply. Then fresh cooks for the two live dead slots (icons
from bought art, shadow wired-and-walking). ***

ART (f3eu53): 8/9 (u) -- *** BOARD RESUMED INLINE: +2 COOKS (THE THREE
MONEY ICONS + THE CONTACT SHADOW), +10 DUPLICATE FORMS CLOSED. THE SITTING IS
NOW 17 FAMILIES / 537 TILES. ***
Record: records/BOHEMIA_TILE_BOARD_SITTING_8_9_26.md (second-pass section)

CHARACTER (0lurbs): 8/9 (j) LATEST — *** "THUMB THUMB THUMB EVERYTHING IS A THUMB."
READ laws/BOHEMIA_ADDENDUM_EVERYTHING_IS_A_THUMB_8_9_26.md BEFORE YOUR NEXT REPLY. ***
He said it after I handed him a numbered list of TWELVE things needing his verdict
plus a question asking him to choose how I should approach the next build. Twelve
votes and a process decision, in one reply, from ONE lane, on a day he had already
said five times that he was tired. He never asked to run an approvals process. He
asked for a game, and we turned him into the queue that blocks it.
THE DEFAULT FLIPS: APPROVE-BEFORE becomes CORRECT-AFTER. Claude DECIDES, builds it,
and puts it in the game where he meets it while playing. He reacts to a thing that
EXISTS; he does not authorise a thing into existence. His corrections are better
than his thumbs anyway ("the cornrows is not one pixel of skin two pixels of hair",
"that grenade throwing was dogshit") and they cost him nothing, because he was
PLAYING when he gave them.
ONLY THREE THINGS STILL GO TO HIM: identity/names he reserved (MECHANISM-MINE /
CONTENTS-PAOLO'S is untouched), a genuine fork with no defensible default (pick one,
SAY you picked it and why, build it), and anything he asked to see.
BANNED: a numbered queue of pending verdicts in a reply; asking him HOW to do the
work; blocking on a thumb; and surfacing something half-finished as a "candidate" so
the risk of it being bad becomes his.
THE BAR GOES UP, NOT DOWN. Under APPROVE-BEFORE a lane could ship something mediocre
and let the thumb sort it. Under CORRECT-AFTER, whatever you decide is what he plays,
so the standard for "done" is now the standard for "in the game" — MORE looking at
the real surface, not less. STOP PRODUCING still binds: this is permission to make
ONE version and stand behind it, never four.
THE JUDGE PAGES STAY and stay good. When he WANTS to sweep a batch he is entitled to
a good tool, and the 130-of-130 SFX sitting proves he will. What changes is that they
stop being the GATE. And the already-surfaced backlog does NOT get re-asked: under
STALE UNJUDGED IS DEAD it is ours now, to decide, kill or ship. Do not hand him that
list again.
THE TELL: if a reply ends with a list of things he must rule on, the turn failed no
matter how much shipped. A turn he can answer with "cool" is a good turn.
CLAUDE.md's VERDICT WORKFLOW section carries this at the top now.

I ALSO APPLIED IT IMMEDIATELY RATHER THAN JUST FILING IT: my own open question was
"do I show you family-cast candidates or do you describe them first?" That question
is now withdrawn and answered by me. Canon already fixes the cast (ACT1 OPENING
VISION 7/19: father wakes you, sister is lost, older brother survives, it ends saving
the mother, with the sibling mirrored by player gender). I build the four, put them
in the game, and he corrects them. Names stay his.

# START HERE — NEXT SESSION

**Last written: 8/11/26, COMBAT lane.**
Read `CLAUDE.md` first, then this.

---

## WHERE THE COMBAT LANE IS

Two ships today, both measured on the real surface, both on main.

### 1. THE GUNS MOVE (v136)
There was exactly one piece of code that ever moved a man with a gun, and it
opened with `if(e.gcov)continue;` — every shooter ran to the nearest rock once
and then never moved again for the whole fight. Melee had advanced every turn
since 7/19; only the guns were nailed down. That is why standing still was
correct play, which is what Paolo called out on 8/8.

`pressAI` now scores every tile a shooter could reach against staying put:
getting an angle on the player is the big prize (a shooter you are covered from
has *no* hit chance, not a reduced one), closing is worth what the game's own
range function says, and ending behind stone beats ending in the open. Half the
line bounds per turn, most-to-gain first; the rest hold and shoot.

Measured, 120 distinct arenas, 6 turns of standing still: cover 1.86 → 0.78,
range 10.35 → 7.74 tiles, clean lines 4.41 → 5.49 of 6.27, incoming **+45%**.

### 2. HOLD THE LINE (v137)
v135 shipped the cold open's defend contract and never sent it to the fight, so
a "defence" could not be lost. Now the place is real world state carried by
`worldShift`, derived opposite the threat bearing, and hostiles pull toward it
and are allowed past you to reach it.

Measured, 80 distinct arenas: **ignore them → 77/80 defences lost at 100/100 HP**
(avg 8.6 turns). Kill them → 0/80. The 3 survivors all had a live blade.

### 3. THE LAW
`laws/BOHEMIA_ADDENDUM_STOP_ASKING_IF_IT_IS_FUNNER_AND_REAL_DO_IT_8_11_26.md`
(Paolo 8/11, LOCKED). Two-key test: funner AND realistic = build it, no
question. Never overrules mechanism/contents, MAP LAW, the graveyard, or a
rejection. Gate: `gates/no_bullshit_questions_gate.py`, in the suite.

`gates/combat_lab_gate.js`: 713 → **736** checks.

---

## TWO THINGS THAT BIT ME. DO NOT REPEAT THEM.

**THE ARENA DICE SEED ONCE PER PAGE LOAD.** `BohemiaArena.withDice` reuses one
seed, so a loop calling `setupCombat()` 120 times measures **the same arena 120
times**. The tell is clean whole numbers ("3.00 guns") where random data cannot
produce them. Call `BohemiaArena.set(...)` before every sample. My first v136
numbers were wrong because of this and the record carries the correction.

**A CLIFF IS NOT A MAGNET.** My first hold-the-line scorer gave a bonus once a
man got close, which meant *entering* that zone cost him his angle bonus — every
man stalled exactly on the boundary and it made the feature worse (5/60). The
fix was deleting the boundary, not adding a number on top. Gated now.

---

## STILL OPEN IN THIS LANE

1. **Blades ignore the objective.** Melee runs its own locked 7/19 turn; a knife
   man closes on you, never past you. 3 of 80 defences survive on this. Not
   worth opening a locked law for; worth knowing.
2. **The two-storey other half** — on the deck the lot recedes. Blocked by draw
   order: the deck draws at ~line 85 of `drawField` but blood (~260), pillars
   and cars (~267) and litter (~542) draw after it.
3. **Jumping off the deck**, and a third death fall.
4. **Misses permanently chipping the world** (research proposal #4).
5. **The grenade minigame is PARKED** at Paolo's instruction. Do not restart it.
   The 8/5 fuse-bar version is in the graveyard and no variation may be rebuilt.

---

## PENDING PAOLO — NOTHING IS BLOCKED ON HIM

He has one standing instruction and it is not a question: *"IF IT MAKES THE GAME
FUNNER AND REALISTIC DO IT."* Run the two-key test and build. Do not hand him
lettered menus or build-language questions; the gate will fail the ship.

---

## SHIP FLOW THAT ACTUALLY WORKS HERE

`git fetch origin main` and branch from it BEFORE working. A COMBAT_B64-only
change is cleared by `combat_lab_gate.js`, `combat_runs_smoke.js`,
`alpha_loads_gate.js`, `front_door_gate.js`, `combat_anim_gate.js`,
`taste_gate.py` and `no_bullshit_questions_gate.py` (~90s). Fetch again; if main
moved, take main's alpha wholesale and **replay the patch tools onto it** — they
are all idempotent and that is exactly what they are for. Re-gate, push straight
to main. No pull requests, ever.

`COMBAT_B64` uses SINGLE quotes: `r"const COMBAT_B64\s*=\s*'([^']+)'"`. And the
markers live INSIDE the base64 — grepping the raw HTML for them finds nothing
and means nothing. Decode first.

---

## WHERE THE SOUND LANE IS (8/11/26)

### 140/140, AND THE DOOR MAKES A NOISE
His second full sweep in three days. `records/BOHEMIA_SFX_VERDICT_8_9_26.txt`:
`door_drag.0` UP, `door_drag.1-4` DOWN, `door_clack.0-4` **all five DOWN**.
Rebuilding the bank from his export changed exactly ONE family; the other 27
reproduced it byte for byte, which is a stronger transcription check than
re-reading it.

**WIRED, NOT JUST BANKED.** `openDoor()` in the run — the moment a door starts
moving, already guarded against re-entry so one opening is one sound. Proved by
calling the game's own `openDoor` and counting ONE render carrying the approved
vector's signature (ash, three strikes, hz 174). Matching the SIGNATURE and not
"a sound happened" means a footstep in the same window cannot be mistaken for a
door. **The SHUT stays silent and that is HIS ruling**, not an omission.

**THE MINIMUM DEMO SOUND SET IS 5/5 LIVE**: footsteps by ground, the door
opening, hit+kill on the beat, UI tap, save chime.

### THE FINDING WORTH CARRYING: CLASSES GET SETS, OBJECTS GET ONE ANSWER
All five dirt footsteps passed. All five asphalt. All five gravel. Of five door
drags, **one** passed — the unjittered base, with `.4` dead despite carrying the
same three-strike pattern and differing only in jitter.

A FOOTSTEP IS A CLASS AND A DOOR IS AN OBJECT. Five footsteps are five different
steps and the variant set is the feature. Five doors are five DIFFERENT DOORS,
which is wrong, because it is the same door every time you walk through it.
Variation reads as inconsistency the moment the thing making the sound is
singular. **Cook variant sets for classes. Cook one right answer for objects.**

Also corrected: the 7/30 material finding (ash+stone 25-0) was necessary and NOT
sufficient. The ash drag lived; the stone clack went 0 for 5. Stone wins as a
footstep and as the valley's midday air and loses as a door.

## THREE MEASUREMENT TRAPS THIS LANE PAID FOR. DO NOT REPEAT THEM.

**COUNT THE THING, NOT EVERYTHING.** A strike counter that counted every render
went flaky the moment anything else made a noise. Match on a signature the
family owns (time_pass is the only glass; the door drag is ash + 3 hits + 174Hz).

**THE RUN REPORTS ITS OWN CLOCK EVERY FOUR SECONDS.** Since a cold open started
booting the run at load, those reports land between a test's two posts and make
REAL strikes — a ten-minute snack "struck twelve". Settling on your own value
cannot see it, because the final value is still yours. `window.__timePassStats()`
now returns the JUMP the game computed; assert that it is the one you asked for
and retry when it is not.

**A CHECKER THAT CANNOT TELL A MENTION FROM A USE.** The voice gate counted every
buffer source as an unvoiced consonant — but the breath on a VOICED blip is a
buffer source too, so a build where every letter was pitched (a tune: the exact
failure) passed clean. Exact count needs no node inspection: unvoiced = letters
spoken − carrier oscillators.

## STILL OPEN — ALL OF IT NEEDS HIS EAR, NONE OF IT BLOCKS ANYONE
1. **THE 8 SQUIGGLE VOICES.** Built 8/9, untouched. MUSIC tab, top.
2. **THE 4 ACOUSTIC SPACES.** Live since 8/4, never thumbed.
3. **THE 9 BATCH-20 SONGS.** Cooked, shown, never ruled.
4. **MENU MUSIC: does the front splash play?** Two canon MENU songs, no player.

Blockers report: `records/BOHEMIA_SOUND_DEMO_BLOCKERS_8_9_26.md`
Not this lane's, but flagged: his 8/7 eat/sleep time costs still do not reach the
game — `records/BOHEMIA_FLAG_TIME_COSTS_NOT_WIRED_8_9_26.md`.

Gates: `sfx_wired` 372, `doors_fresh` 23, `voice` 28, `time_pass` 31,
`sfx_shuffle` 25, `citymus_rotation` 22.

### 8/11 UPDATE — VOICE VERDICTS IN, AND THE CLICKING WAS REAL

**6 of 8 UP on the first showing** (`records/BOHEMIA_VOICE_VERDICT_8_11_26.txt`).
Killed: cand-0, cand-5. Banked: `banks/BOHEMIA_VOICES_APPROVED_8_11_26.json`,
six approved, **nothing assigned to any character** — that is still his ruling.
His thumbs are baked into the judge, so it opens showing them and never asks
twice.

**"I LIKE IT ALL JUST REMOVE THE CLICKING" was a real defect, not a preference.**
Rendered offline and measured on the samples:

```
BEFORE  max sample-to-sample jump 0.109 against a peak of 0.136
        307 jumps over 0.03 in one line
        unvoiced bursts peaked 0.115, vowels 0.046   ->  +8 dB
AFTER   max jump 0.0165, ZERO over 0.03,  consonants -8.1 dB
```

Two faults, both in the envelope:
1. Every blip's release ended at 0.0001 and then `stop()` cut the source — a step
   at the end of **every** sound. Exponential ramps cannot reach zero; it now
   hands off to a linear ramp that can.
2. An unvoiced burst was given a vowel's 6ms attack. On a 40ms hiss that is an
   EDGE, and an edge on broadband noise **is** a click.

**AND THE LEVELS WERE INVERTED FOR A STRUCTURAL REASON WORTH REMEMBERING.** A
vowel is squeezed through three NARROW bandpasses (Q 7/9/11) that throw most of
the source away; a hiss goes through one WIDE one (Q 0.7) that passes nearly
everything. So the amplitude numbers in the recipe did not mean what they looked
like — the hisses were louder than the voice. Real speech runs consonants about
**-7.4 dB** against vowels (fricative contrast 7-14 dB). Mine ran +8.

Gate `voice_gate.py` 28 → **35**, mutation tested: restore the loud hiss and it
goes red on three.

**LEAD, NOT A LAW:** both killed voices carry the two most extreme vibrato
settings in the batch (0.97 and 1.73 Hz), and every survivor sits at or below
0.73 Hz. n=2 of 8 and both differ in other ways too, so it is recorded in the
graveyard as something to watch in the next batch, not as a finding.

--------------------------------------------------------------------------------
COORDINATOR (07) — THE DNA FORMULA RULED + LAB UN-PARKED (Paolo: "the combat
is bigger map rogue fable 4. the game is valheim pocket city 2 fallout new
vegas" — laws/BOHEMIA_ADDENDUM_THE_DNA_FORMULA_8_4_26.md, the north-star
shorthand every lane checks on feel questions; FNV elevated to STRUCTURAL
reference). The LAB is un-parked with a demo-serving charter: study the DNA
trio's first hours (Goodsprings above all) and ship one pattern note for
the demo's first five minutes + day pacing (dispatch appended to records/
BOHEMIA_DEMO_DISPATCH_PROMPTS_8_4_26.md). WHAT COMES AFTER: blocker reports
-> one consolidated Paolo sitting -> art wiring lands -> demo assembles in
RUN -> demo gate + deploy -> he playtests the day.

--------------------------------------------------------------------------------
COORDINATOR (07) — CORRECTION, SAME SITTING: THE DNA FORMULA IS NOT FLEET
LAW. Paolo: "Im not putting this in every chat. its not law law law. this
was more for the reference chat. were experimenting and learning. theres
also a normie easy version of project zomboid mixed in." The addendum is
REWRITTEN as THE LAB'S DNA BRIEF (same file): the formula (RF4-bigger-map
combat; Valheim + PC2 + FNV + normie-easy PZ) is the LAB's study list only.
NO other lane cites it; feel questions resolve through the actual standing
laws as before. Lab's first-hours study stands, now with PZ onboarding as
the anti-reference for normie-easy.
### 8/11 (b) — PEOPLE ACTUALLY TALK NOW. DEMO ROW 13 IS CLOSED.

Row 13 was never "a voice engine exists", it was **"speaks per dialogue line
through the dialogue runtime"**. Six approved voices that never said a word in
the game was APPROVED-BUT-UNUSED — the exact defect this lane exists to kill.

**THE WIRE.** `renderTalk()` in the run already had the speaker and the lines,
so the run posts `BOHEMIA_VOICE {speaker, text}` and the parent speaks it. Same
architecture as every other sound here: the run says WHO spoke and WHAT, the
parent owns the AudioContext and the limiter. The run never learns what a voice
is.

**WHICH VOICE A PERSON HAS** is `hash(identity) -> one of HIS SIX`. The RULE (a
person's voice is a pure function of their identity, so they sound like
themselves forever) is mechanism and is the whole point. WHICH voices exist is
his — so it draws only from the six he approved and **never generates a fresh
voice he has not heard**. People sharing a voice is correct, not a shortcut:
Animal Crossing runs hundreds of villagers off a handful of types. What makes
someone recognisable is that THEIR voice never changes, not that nobody else has
it. Assigning a named character to a specific voice is still his ruling and has
not been made.

**IT SPEAKS AN OPENER, NOT THE WALL.** Animalese speaks the whole line because
the TEXT SCROLLS at babble speed; ours appears instantly, so babbling twenty
words over text he has already read is a drone, not a person. It takes whole
sentences until it has about 22 letters, then stops (cap 70). "Batteries." alone
is a grunt; "Batteries. Real ones, not the swollen ones you sold my brother."
is somebody talking.

**ONE VOICE AT A TIME.** A new line CUTS the one still speaking. `say()` returns
a stop handle for exactly this — two people babbling over each other is not two
people, it is a fault.

Proved by driving the run's OWN `renderTalk` with three lines: red_boss →
cand-4, stranger → cand-6, red_boss again → cand-4. Different people differ, the
same person repeats, every voice is one he approved. Mutation tested: cut the
run's report and the gate goes red on five.

`voice_gate.py` 35 → **41**.

**AND A FLAKY GATE OF MINE, DIAGNOSED PROPERLY RATHER THAN RE-RUN UNTIL GREEN.**
`sfx_wired` went red on "a neighbour THIRTY tiles away was audible (0.0748)".
Before touching anything: stashed my work, ran the gate on clean main → 372/372
green. Restored my work, ran again → 372/372 green. **It did not reproduce.**

Reading the code settled it. At 30 tiles the RUN never reports at all
(`d > NPC_RANGE`), so the `msgs` half of that check is zero by construction and
only the PEAK half can ever fail — and the peak is measured on the shared SFX
bus, which the AMBIENCE BED also uses. Ambience fires a one-shot every 40-95
seconds, so in a 2.25-second measurement window it lands about 3% of the time
and gets attributed to a neighbour thirty tiles away.

Fixed the ruler, not the target: `npcStep` now reports what it ACTUALLY PLAYED
(`window.__npcPlayed()`), and the gate asks that instead of asking the bus what
it heard. A near-case positive assertion was added too, so the far case cannot
pass by everything being broken. **Same lesson as time_pass and the door drag,
three times in one week: COUNT THE THING, NOT EVERYTHING.**
