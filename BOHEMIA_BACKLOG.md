# BOHEMIA BACKLOG (the fleet's queue — read via THE GO PROCEDURE)

## *** FLEET-WIDE FREEZE (7/26, ART-FIRST RESET — read laws/BOHEMIA_ADDENDUM_
## ART_FIRST_RESET_7_26_26.md). *** BOTH FREEZES ARE LIFTED AS OF 7/26. ***
## Paolo verdicted the target screen CBB, so the visual constitution EXISTS:
## records/target/BOHEMIA_VISUAL_CONSTITUTION.json, held by
## gates/target_match_gate.py. Every lane may cook new pixels again, and quest
## asks may be surfaced again. THE PRICE: every cook now passes the proxy gates
## (palette ceiling, per-layer value bands, no keyline, no dither, one light
## direction, hashable seam contracts) and every new art bank REGISTERS itself
## in target_match_gate.py's BANKS list. CBB also means the target itself is
## FROZEN and byte-locked - nobody makes another target screen. Verdict record:
## records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt ***

## LAB (THE REFERENCE LAB — first word "lab"; law: laws/BOHEMIA_ADDENDUM_
## THE_REFERENCE_LAB_7_26_26.md. One session = one system = one named game.)
0. [RULED 7/26] THE LANE'S ASSIGNMENT CHANGED MID-DAY. Paolo: "who said I
   wanted to test the walking... it was supposed to be like the actual game and
   all its mechanics... you need to get the code online and implement it for the
   different game mechanics like marriage and fishing in farming". Law:
   laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md — an emulation is
   THREE OR MORE NAMED MECHANICS, each playable end to end, from the real source.
   Movement/camera/collision/lighting are plumbing and can never be a lab
   deliverable again; the gate fails a row that declares one. He also RULED
   Bohemia's movement in the same breath
   (laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md): the world moves
   when you spend time taking an action. That closed LAB-1's open question.
1i. [RULED 7/27, SECOND MESSAGE — THE CAMP LAW GAINED CLAUSES 11-15] TIME, THE ACT
   CURVE, THE COMBINED BUFFS, AND HIS BLOOD-LOSS QUESTION.
   Law amended in place: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md
   (AMENDED THE SAME DAY section, his words verbatim).
   11. SETTING UP CAMP COSTS TIME. "SETTING UP CAMP TAKES TIME." That cost is what
       makes camping a decision instead of a habit.
   12. EVERY CAMP BUTTON SPENDS IN-GAME TIME, IN REASONABLE AMOUNTS. "OBIOUSLY
       HANGING OUT TAKES UP TIME AS WELL. TIME PASSES BY REASONABLE AMOUNTS WHEN U
       PRESS THESE BUTTONS." SO THERE ARE NOW TWO CLOCKS AND THEY ARE NOT THE SAME:
       buff duration burns in TILES (clause 2), camp actions spend the world's
       CLOCK. Standing still still burns neither.
   13. THE ACT SCARCITY CURVE — the first ruled mechanical difference between the
       three acts. ACT 1: almost no friendly shelter, one homie's house you have to
       HOOF IT to, so the mobile camp is needed most. ACT 2: a little more. ACT 3:
       hotels and hangouts where you can just hang out. The camp is an ACT-1
       SURVIVAL TOOL THAT BECOMES OPTIONAL, and the curve is SHELTER DENSITY, not a
       nerf to the camp. The same three verbs (hang out / sleep / patch up) must
       work in a camp you pitch AND a friendly place you walk into; the difference
       is that a real roof costs no setup time and is more comfortable.
   14. THE CAMP BUFF AND THE EATING BUFF COMBINE. "I LIKED IT WHEN WE COMBINE SOME
       OF THESE VALUES WITH THE FOOD EATING VALUES FROM THE VALHEIM REFERENCE."
       Eating is its own stacking buff in the shape Valheim's food had — but out of
       the ONE POOL (clause 4), measured in TILES (clause 2), at tiny magnitudes
       (clause 7).
   15. HIS QUESTION, ASKED OF ME: "IF WE GET SHOT IN COMBAT DO WE ALWAYS NEED TO
       PREVENT BLOOD LOSS? LIKE AFTER EVERY DUNGEON OR RAIDER OR ENEMY FACTION AREA
       WE CLEAR". He is naming the CHORE RISK. Answered in writing with a
       recommendation and all three options playable:
       records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md — 0 ALWAYS / 1 SELF-LIMITING /
       2 ONLY SERIOUS. MY ANSWER IS 2, because his own clause 6 says ignoring the
       camp must stay playable and a mandatory bleed makes it compulsory through the
       back door. STILL [PENDING Paolo] — nobody picks it for him.
   AND HE PARKED THE NUMBERS HIMSELF: "IM NOT SURE HOW MANY TILES YOU WALK OR HOW
   MUCH INGAME TIME PASSES BEFORE THE BUFFS RUN OUT THOUGH WELL WORK MORE ON THAT!"
   So no tile count and no time cost may harden into a default while that stands.
   ON THE PAGE (slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html): a real clock
   in the HUD (day + hour), setup and every action moving it, an ACT dial that
   changes how much friendly shelter exists on the map (1 -> 3 -> 6 places), hotels
   and a homie's house you walk INTO for free comfort, the meal buff stacking with
   the camp buff and both burning in tiles, and BLEED_POLICY switchable live. The
   walking clock is derived from HIS scale ruling and shows its working: across the
   map and back is a day, so 80 tiles x 18 min = 24 h, and TILE_MINUTES is a dial.
   13 new dials, 31 total, every one carrying its law clause.
   GATE: gates/camp_dial_gate.js now 112 checks (was 75), mutation-tested three ways
   (free setup, non-stacking meal, policy 2 letting ordinary bleeds through — each
   reds exactly the right check).
1h. [RULED 7/27 — HE APPROVED IT AND REWROTE IT IN THE SAME BREATH] THE MOBILE CAMP
   IS BOHEMIA'S SURVIVAL SYSTEM. Paolo, after playing the Valheim model: "awesome so
   i am in love with the mobile camp idea... i liked this valheim shit alot."
   LAW: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md (LOCKED, 10 clauses, his
   words verbatim). VERDICT: records/BOHEMIA_LAB_VALHEIM_VERDICT_7_27_26.txt.
   WHAT HE RULED, and every one of these is now canon:
     1. THE CAMP IS MOBILE. Carried and set down, never a fixed base.
     2. THE TIMER IS TILES MOVED, NOT SECONDS. "it would be on a timer it would be
        set for how many tiles you move and shit." A buff may not burn while the
        player stands still — this is the perfect mate to TIME IS SPENT BY ACTIONS
        and it is the biggest single departure from Valheim.
     3. SCALE: a full day is across the map and back.
     4. ONE CLUMPED POOL, NO FOOD ITEMS, NO FOOD CRAFTING. "water, food, and build
        shit are clumped into one category essentially... it would suck from that
        and loot in the world would add to that." This also settles the shape of
        clause (a) of the loot law: the kinds are very few and this one is a clump.
     5. THE REWARD IS HEALTH REGEN, STAMINA REGEN, AND MORE STAMINA POINTS.
     6. IGNORING THE CAMP MUST STAY PLAYABLE. "if people dont want to give a fuck
        about that its okay too." Weaker, never blocked.
     7. THE NUMBERS ARE TINY — ROGUE FABLE IV SCALE. "like plus 1 or 2 or 3 stamina
        points type shit." Valheim's 25 -> 148 health is explicitly the wrong
        register and no Bohemia system may inherit it.
     8. THE CAMP IS ALSO THE MEDICAL STATION: bandage, gauze, and A COMPANION
        PULLING A BULLET OUT OF YOU — the first ruled mechanical job a companion has.
     9. CHILL, AND SLEEP AS A SEPARATE OPTION.
    10. COMFORT IS APPROVED as a mechanism, ported to tiles: what you CARRIED and
        SET DOWN buys tiles of buff.
   PLAYABLE IN HIS OWN RULESET: slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html
   Walk in tiles, set the camp down anywhere, dress it from what you carried, chill
   or sleep, eat out of the one pool, take a wound and get patched — and a companion
   digs the bullet out because you cannot. He said twice that he is unsure about two
   things ("idk about how it impacts hp points", "im not super sure on the food
   crafting system"), so EVERY VALUE HE DID NOT SET IS A DIAL on its own tab, 18 of
   them, each labelled with the law clause it answers and why it exists. MAX_HP_MOVES
   defaults to OFF because "idk" is not a ruling.
   GATE: gates/camp_dial_gate.js, 75 checks, registered in the suite as CAMP DIAL.
   It asserts the law's mechanical clauses on the real surface — including the one
   that matters most (standing still for 20,000 frames burns ZERO tiles of buff), the
   one that protects him from me (every pending value must be reachable as a dial, and
   the stamina bonus cannot be dialled past +3), and clause 6 (walk 120 tiles having
   never camped and nothing is blocked).
   STILL [PENDING Paolo], clauses (a)-(g) of the addendum: the pool's name and whether
   it is literally one number; how many tiles a rest is worth and per comfort level;
   what each camp action costs; whether max health moves at all; the exact stamina
   numbers; what limits how much camp you can carry; and the real camp item list (the
   five on the page are placeholders and say so).
   NOTHING WAS PORTED into the engine or the alpha. An approve on a reference is not
   an order to build the real system.
1g. [SHIPPED 7/27 — AWAITING PAOLO'S PLAY] VALHEIM'S COMFORT LOOP, COMMISSIONED BY
   NAME. Paolo: "Next emulation, whole mechanics: VALHEIM'S COMFORT LOOP... I play
   it and then rule Bohemia's survival system off the feel, not off a document."
   slices/lab/BOHEMIA_LAB_VALHEIM_COMFORT_7_27_26.html — the three mechanics he
   named, playable end to end in one small world (meadow camp, forest to forage,
   freezing mountain with a cairn at the top):
     FOOD    three slots, each adding max health AND max stamina for tens of
             minutes; the bonus SHRINKS as the food burns, so your ceiling sags
             instead of an alarm going off; the fourth food is refused; a food can
             only be topped up below half. An empty stomach is 25 health — weak,
             alive, and it never kills you.
     RESTED  20 seconds standing at the fire UNDER A ROOF, then +50% health regen
             and +100% stamina regen. It travels with you and it re-grants for
             free while you are in your own camp.
     COMFORT the one worth stealing: comfort = 1 + the HIGHEST item in each
             CATEGORY within 10 m, and the comfort number IS how many minutes
             Rested lasts (480s + 60s per level). A rug is a minute. A second rug
             is nothing. Decorating your camp literally makes you stronger, and
             the HUD says "comfort 9 = 16 min rested" while you do it.
   THE FIRST **MODEL** ROW, AND THAT IS A NEW THING IN THE MACHINE. Valheim's logic
   ships as a compiled Unity DLL: no source to fetch, every decompiled-source repo
   probed came back 404, and the wikis are 403 at this environment's network
   gateway. So numbers are DOCUMENTED, not read off a line — except two that ARE
   real source, lifted from ValheimPlus's Harmony patches which name the vanilla
   values they overwrite (the 10 m comfort radius, BuildingConfiguration.cs:9, and
   the 60 s per comfort level, PlayerConfiguration.cs:11).
   gates/lab_gate.js CLAUSE 7 now exists to keep a model from ever passing itself
   off as a measurement: a row may declare kind:'MODEL', and then EVERY constant
   must be tagged [SOURCED file:line] or [DOC ...] or declared ours, at least one
   must be genuinely SOURCED, the page must say NOT A MEASUREMENT on its own face,
   and the record must list what was actually tried and failed. An untagged number
   fails the build exactly like a missing citation. (The MODEL deliverable was
   named in records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md before it was
   ever needed.)
   Gate: 83 new checks (262 total in the lab gate), all measured through the page's
   own tick(), so a 24-minute buff is verified in milliseconds.
   TWO DEFECTS FOUND BY LOOKING, NOT BY READING — the lesson from the last two
   kills: (1) the mountain was not actually dangerous (5 tiles of cold crossed in
   8 seconds, 8 of 25 health, so the buffs did not matter, so the page failed the
   one thing he asked it to test). The map was rescaled so the cold round trip
   costs ~29 health: empty you reach the cairn and die on the way down, fed you
   barely notice. (2) Rested re-granted every frame at your own fire — correct
   behaviour — but announced itself every frame, burying the screen in toasts.
   Teardown, every number tagged: records/lab/BOHEMIA_LAB_VALHEIM_TEARDOWN_7_27_26.txt
   Patterns: records/lab/BOHEMIA_LAB_VALHEIM_PATTERN_NOTE_7_27_26.md (6 mechanisms,
   6 do-not-ports, 5 honest limits).
   [PENDING Paolo] and it is the whole point of the page: does a camp that makes
   you stronger belong in Bohemia? Behind that, also his: our comfort CATEGORIES,
   how long our rest ritual takes, whether food raises a ceiling or fills a meter,
   and whether we have a hunger axis at all (Valheim's case for "no" is strong).
   NOTHING WAS PORTED. The lab ports on his word only.
1f. [KILLED 7/27 — DEAD, GRAVEYARDED, AND LOOT IS NOW A CLOSED LAB SUBJECT]
   Paolo: "That was really bad so bad so bad." The A Dark Room scavenge page
   (slices/lab/BOHEMIA_LAB_DARKROOM_SCAVENGE_7_26_26.html — DEAD, do not re-add) is deleted and
   graveyarded; its registry row and all 44 live checks are removed from
   gates/lab_gate.js. That is the SECOND loot emulation killed in two days, so
   under laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md LOOT IS ENDED as a lab
   subject: no v3, no third reference game, nobody re-pitches a loot page unless
   Paolo names it himself.
   POST-MORTEM: records/BOHEMIA_DARKROOM_LOOT_KILL_7_27_26.txt. Three causes, and
   the first is the big one: (1) I PRODUCED SOMETHING HE DID NOT ASK FOR — his
   message asked for research, and "you could try it something else" is a shrug,
   not a commission; the research alone was the turn. (2) I answered "too slow" by
   DELETING THE ACT instead of speeding it up — A Dark Room's loot is a paragraph
   and one button in a modal, and he said State of Decay is decent AS AN
   EXPERIENCE, which is exactly the part I removed. Two taps in a menu is not a
   fast search, it is no search. (3) It looked like nothing — grey squares with
   letters — in the middle of a fleet-wide look problem that is the reason he
   cannot approve anything.
   264 green checks and a verified deploy proved the port was FAITHFUL and could
   not ask whether he wanted it. I even added a FEEL-STATEMENT step after the
   Zomboid kill, ran it, and it PASSED, because it checked the reference against
   his rulings and never against what he actually wanted. A procedure I invented
   cleared me; that is worth less than nothing.
   laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md is UNCHANGED and still
   the ruling. Its four content questions are still [PENDING Paolo] and are still
   the only real blocker: resource KINDS and how many, yield range per container
   kind, what a search costs in time, and re-search / noise.
1e. [SHIPPED 7/26, ON HIS ORDER] THE RESEARCH DOSSIER: WHICH GAMES ARE ACTUALLY
   LIKE OURS, AND WHOSE CODE WE CAN GET. Paolo: "Do big brain online research for
   games that are just like ours or like a combination of what we're going for."
   records/lab/BOHEMIA_LAB_RESEARCH_CANDIDATES_7_26_26.md — Bohemia's combination
   written as a ten-column checklist, nine candidates scored against it, a
   VERIFIED source verdict per game (fetched, not assumed), a one-line FEEL
   STATEMENT per game checked against his standing rulings, and a ranked
   shortlist. It also names the split that matters: an EMULATION has real source
   and citable lines; a MODEL has only documentation and needs a NEW GATE ROW
   TYPE before one can legally ship. #1 next target: CATACLYSM: DDA faction camps
   (open source, verified fetchable) because it is the only game that answers his
   own ruled-but-unfilled question — what an action COSTS and what a crew you
   sent away brings back. Honest finding: the FEED/clout axis has NO reference
   with obtainable numbers, and that is a finding, not a gap to fill by inventing.
1d. [SHIPPED 7/26, ON HIS ORDER] THE FIRST PORT OUT OF THE LAB.
   Paolo after playing LAB-03: "Awesome! All these things worked. Very good! Did
   you learn anything. Anything we can throw in the bohemia code right now?"
   Law: laws/BOHEMIA_ADDENDUM_LAB_PORTS_ON_HIS_WORD_7_26_26.md — the lab ports
   only when he says so, ships MECHANISM ONLY in its own new file, never wires
   itself into another lane's surface, and carries its provenance.
   engine/bohemia_resolve.js (headless, no deps, collides with nothing):
     RESOLVE  one moment, a DECLARED phase order, and no system able to read
              another's report. A step that throws cannot eat the player's night.
     RATION   a limit by COUNT per day and per week with a bypass that overrides
              both (the birthday shape). No price term exists anywhere in it.
     CEILING  points cannot pass the current state's cap and ONLY a state change
              moves the cap. 500 favours cannot grind past a wall.
     REACH    one declared range, one facing rule, one predicate.
   AMENDED THE SAME TURN BY HIS RULING: "I like it all tbh all 3 and sleep
   understand sleep can be hangout or eat too u know" — APPROVE on all four, and
   the resolve moment is ANY BLOCK OF TIME THE PLAYER SPENDS, not just sleep.
   Law: laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md. The
   resolver now takes a CALLER-DECLARED list of moments each carrying a SIZE, a
   system declares WHICH moments it answers, and an undeclared moment is a build
   error. A meal moves less than a night because each system says so, not because
   the module hardcoded a night. Verdict: records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt
   Gate: gates/resolve_gate.js, 77 checks, registered as LAB PORT, and
   mutation-tested (breaking the clamp, leaking reports between steps, letting a
   thrown step kill the moment, ignoring a moment subscription, leaking the moment
   through the shared context, or accepting an undeclared moment each turn it red).
   EVERY TABLE IS EMPTY. No ration limits, no faction thresholds, no reach number
   and no action costs for any real Bohemia system: callers pass them in, and the
   first default is a RULING, not code. NOT WIRED INTO ANY SURFACE — adopting it
   is the owning lane's build item (RUN for the contextual verb + reach, WORLD for
   the resolve point, LIFE/SOCIAL for the ration and the standing ceiling).
1c. [SHIPPED 7/26 — AWAITING PAOLO'S PLAY] ONE WORLD, ALL THREE MECHANICS ON IT.
   Paolo: "are you able to code these into the walkable version of Stardew Valley
   made earlier pull up to the mini lake you can start fishing pull up on your
   potential spouse. Do all of this pull up on your farm."
   slices/lab/BOHEMIA_LAB_STARDEW_WORLD_7_26_26.html — one town, one clock, one
   purse. Your farmhouse and a 54-tile fenced plot, the shop up the road, a lake
   with a dock, EMILY walking a real schedule. ONE contextual action button:
   CAST at water, USE TOOL at soil, TALK next to her, SLEEP at your bed, HOLD TO
   REEL once a fish is on, and the tile you are about to act on is outlined.
   Sleeping is the only integration point: crops advance or stall, soil dries,
   her friendship decays, the wedding counts down, her schedule resets.
   What the merge taught (the actual finding):
   records/lab/BOHEMIA_LAB_STARDEW_WORLD_NOTE_7_26_26.md — the walk is a sentence
   structure not a feature; one contextual verb instead of a button per system;
   reach is a declared number; ONE resolve point with zero coupling between
   systems; distance on the map IS the pacing. Gate: 179 checks, and the world
   half WALKS the route with the real movement code (door -> plot -> till/seed/
   water -> across the map to the dock -> land a fish -> up to her -> bouquet ->
   home -> in the door -> bed -> sleep -> the crop advanced).
   His musing "in our world it's gonna most likely be like a Hydro farm pool or
   something I don't know but yeah" is RECORDED AND NOT ACTED ON. No Bohemia
   growing system invented. If he rules it, it becomes a CITY/WORLD item.
1b. [SHIPPED 7/26 — AWAITING PAOLO'S PLAY] STARDEW MECHANICS: FISHING + FARMING
   + MARRIAGE, all three playable end to end in
   slices/lab/BOHEMIA_LAB_STARDEW_MECHANICS_7_26_26.html. The real bobber-bar
   physics (bar height IS the entire fishing skill tree); till/seed/water/sleep/
   harvest/regrow with the real reasons a crop stalls (dry = a wasted day, not
   damage) or dies (wrong season); and stranger -> friend -> dating -> engaged ->
   married on the real point economy (250/heart, gifts rationed 1/day + 2/week,
   birthday x8, neglect -2/-8/-20, and the HARD 8-heart cap that gifting cannot
   pass). Teardown with every file:line:
   records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt. Patterns +
   what Bohemia should take: records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_PATTERN_
   NOTE_7_26_26.md (10 named patterns, 7 recommendations, 4 do-not-ports).
   Gate: 112 checks that PLAY all three loops.
1. [SUPERSEDED 7/26 by item 0 — kept as the record, not a template] STARDEW
   TOWN-WALK FEEL. All three
   deliverables landed: slices/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_7_26_26.html
   (one town, two furnished interiors, fade transitions, the 7s/10min clock with
   the real dusk curve, one scheduled NPC),
   records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt (37
   constants, each with the decompiled file:line it was read from) and
   records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_PATTERN_NOTE_7_26_26.md (9 port
   candidates, 4 explicit do-not-ports). Gate: gates/lab_gate.js, 83 checks,
   registered as REFERENCE LAB. The verdict is Paolo playing it; the lane ports
   nothing on its own. ONE [PENDING Paolo] came out of it and is written into
   the note: Bohemia's 120 BPM / one-body-per-cell walk and Stardew's continuous
   sub-pixel walk cannot both live in one surface — three options are laid out,
   all three are his call.
2. [KILLED 7/26 — DEAD, GRAVEYARDED, NO V2] ZOMBOID LOOT LOOP. Paolo: "That was
   really bad and not fun." The page is DELETED and graveyarded; its gate row is
   gone. Post-mortem: records/BOHEMIA_ZOMBOID_LOOT_KILL_7_26_26.txt. The teardown
   and pattern note survive marked DEAD as the record of what was measured.
   THE RULING THAT REPLACED IT, and it is the valuable thing:
   laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md (LOCKED) — Bohemia's
   loot is VERY SIMPLIFIED: a found thing is a RESOURCE WITH A COUNT ("you found
   like three"), not a named object; the description carries the flavour and its
   job is to explain the amount; looting is ONE FAST ACTION, because "imagine if
   that went by really quick instead of really slowly I might give a fuck about
   it"; minimalistic, FEWER kinds than State of Decay; customisation is NOT bought
   with loot volume; STATE OF DECAY (and SoD2) is the reference and PROJECT
   ZOMBOID IS NOW AN ANTI-REFERENCE for loot pace.
   [PENDING Paolo] the resource KINDS and how many, the yield range per container
   kind, what a search costs in time, and whether a container can be searched
   twice. Nobody invents these.
   WHY IT FAILED (root cause, in the post-mortem): I emulated a pace he had
   already implied he did not want, treated an old backlog phrase as a spec, and
   shipped volume into a lane where he wants minimalism. 245 green checks proved
   every rule was ported faithfully and not one of them could ask whether it was
   fun.

3. (Paolo adds more targets by naming a game + system to any lab session or
   to the coordinator.)

## ART (new lane — first word "art")
-2. [SHIPPED 7/27 — THE DIAGNOSIS] I WENT TO SCHOOL (Paolo: "learn the skillset of
   actualy pixel shit pixel assets... go to school for me for a couple turns and
   learn some laws brother"). laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md: 12 craft
   laws, every one carrying its source, mine marked [DERIVED].
   tools/bohemia_pixel_craft_audit.py measures six of them on our own banks.
   gates/pixel_craft_gate.py (14 checks) holds them, registered.
   THE FINDING, and it explains every rejection since 7/26: our frozen act-1 set
   is 73.6% ORPHAN PIXELS on average (99.6% worst — concrete_0), up to 1610
   colours in one 44x44 tile, 814 colour regions per 1000px, and only 14 of 38
   tiles agree with our own upper-left key. The craft's name for this exact
   failure: "AI learned what pixel art looks like, but never learned what pixel
   art IS... they generate a normal image in a pixel-ish style and shrink it
   down." Paolo said "hallucinated AI slop" on 7/26 with his eyes alone and was
   textbook correct. Proof picture: records/target/PIXEL_CRAFT_PROOF.png.
   The ONE thing we pass clean: every tile is authored at the real 44px cell,
   block size 1, no hidden upscale.
   NOT RE-COOKED, ON PURPOSE: the set is byte-locked by his CBB verdict and a
   gate does not overrule a verdict. Frozen set = ratchet against its own
   baseline; real craft thresholds apply to every bank registered from here on.
   Record: records/BOHEMIA_PIXEL_SCHOOL_7_27_26.md.
-1a. [RULED 7/27 "show me one" — DELIVERED, awaiting his read] ONE TILE RE-COOKED.
   tools/bohemia_tile_recook_proof.py rebuilt road_0 (worst + most repeated
   surface: 99.3% orphan, 1191 colours) as real pixel art. RESULT: 1191 -> 6
   colours, 99% -> 0% orphans, 996 -> 39 regions/1000px, mean value 65.5 -> 65.2
   (ground band kept), near-black 0.15% -> 0.00%. THE COLOUR IS HIS: the six-step
   ramp is lifted out of the approved tile by equal-population luminance banding
   + mode. ONE named change, printed on the picture: the ramp's deviation from
   its own mean is stretched 2.15x, because six bands of that tile come back as
   six near-identical browns and a ramp with no steps draws a flat tile however
   well built. That is why it reads warmer, and TOO WARM is one of the three
   buttons. THREE THINGS FIXED BEFORE IT WAS WORTH SHOWING: (1) first cut read as
   CAMOUFLAGE - perfect numbers, worse picture - because CELL_M=0.75 means 1px is
   ~1.7cm and my "wear patches" were 22cm blotches; (2) four cracks made a
   SIGNATURE that the eye locked onto across a 4x4 field (LAW 12) - down to one,
   heavy damage belongs on road_1/2, which is what variants are FOR; (3) the
   brightest step was too common so it read as gravel. Judge surface: the same
   pixel craft judge page, updated (never a second page for the same question).
   Proofs: records/target/RECOOK_road_0.png (desk) + _PHONE.png (his screen).
   Nothing entered a bank - candidates live in records/target/ until he rules.
-1b. [PENDING Paolo — THE ONE QUESTION] RE-COOK THE STARTER TILE SET as actual
   pixel art: real 4-7 value ramps hue-shifted, material as a few clusters
   repeated with varied distribution, one light direction, orphans cleaned. This
   is a new cook against a CBB-frozen verdict, so it is his word, not my
   initiative. Everything else in this lane (tile set growth, the CITY tab, the
   act triptych) sits downstream of it — growing a tile set that is not pixel art
   just makes more of the thing he keeps rejecting. | pixel_craft_gate thresholds
   already written and waiting | — | yes, the re-cook is judged.
-1c. (research debt, 7/27) BUY PIXEL LOGIC (Michael Azzi, ~$9,
   pixellogicbook.com). It is the standard reference on this craft and the
   network policy here blocks direct page fetches (403 on every attempt), so the
   laws above are built from search summaries of it and others, never from
   reading it. The law file says so and the gate fails if it ever stops saying
   so. | — | — | no.
-1. (discovered 7/26) FLEET: TWO SESSIONS BUILT THE SAME THING IN THE SAME HOUR.
   ART and RUN both wired the frozen tileset into the run; RUN landed first and
   ART binned its duplicate. "Check main before you start" does not help when
   the other lane lands mid-turn. Needs a real mechanism (a claim/lock on a file
   or a system, visible across sessions), not a promise. NOT designed here -
   fleet process is not this lane's to invent. Record:
   records/BOHEMIA_ART_LANE_COLLISION_7_26_26.md
0. [SHIPPED 7/26] STEP ZERO — THE MOBILE RENDER CONTRACT (amendment D):
   laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md. Pins frame, tile px, integer
   zoom, portrait viewport, proportion canon, ONE light direction, the three
   value bands, no-keyline, no-dither, the pipeline rule and the memory
   constraint. Every number is asserted against the factory's own constants by
   target_screen_gate.py, so contract and code cannot drift. TWO CLAUSES ARE
   HONESTLY UNMET AND SAY SO IN THE DOC: (a) the 64-colour master ramp is
   DERIVED (records/target/BOHEMIA_MASTER_PALETTE.json) but the approved corpus
   is continuous-tone, 59,377 colours across the plates — indexing lands with
   the act-1 tileset (item 2) and is held meanwhile by a ratchet ceiling;
   (b) live canvas memory vs the ~224MB iOS floor is NOT instrumented and the
   gate does not pretend to check it. Order note: amendment D landed on main
   mid-session, so the contract was written FROM the screens, not before them.
0b. [SHIPPED 7/27] MEASURE LIVE CANVAS MEMORY against the ~224MB iOS floor.
   tools/bohemia_canvas_memory_probe.js drives the three shipped surfaces in a
   real browser at iPhone portrait and counts canvas backing stores (w*h*4, in
   EVERY frame - the alpha's heaviest modules are iframes), decoded image bytes,
   and the JS heap over CDP after a FORCED collection. WeakRef-tracked, so a
   cache that works reads as a number that stops climbing. Record:
   records/target/BOHEMIA_CANVAS_MEMORY.json + records/
   BOHEMIA_MEMORY_MEASURED_7_27_26.md. Gate: gates/canvas_memory_gate.py (31
   checks), registered. Section 8 of the contract now carries the numbers.
   THE CLAUSE HOLDS: 480 steps across the valley grew the picture by 0.0 MB
   (the WORLD lane's bounded plot LRU works). WHAT IT FOUND INSTEAD, and it is
   NOT what the clause was watching: the ALPHA holds 2604 live canvases once
   every tab is open (2217 in the shell, 188 mapFrame, 193 runFrame, ~21KB each
   - which is why nobody noticed) and ~46MB of JS heap at load, because the art
   arrives as base64 and lives as JS pixel arrays, never as an image or canvas.
   ~98MB resident = 44% of the floor. Headroom today, work items for the lanes
   that own those tabs (see CHARACTER / RUN), written down rather than patched
   from inside the ART lane. LIMIT STATED EVERYWHERE IT APPEARS: headless
   desktop Chromium, not an iPhone - it proves the SHAPE of the curve, which is
   what kills a phone. A real-device number still needs a real device.
1. [CLOSED 7/26 - CBB, SHIPPED, FROZEN] THE TARGET SCREEN. Paolo: "Could be
   better." Per the verdict pipeline that is SHIPS + FROZEN + NEVER SPAWNS
   VARIANTS. The tile-reassembled frame IS the target; it and the 42-tile
   starter set are byte-locked in the constitution and changing either needs a
   NEW RULING, not a new render. DO NOT MAKE ANOTHER TARGET SCREEN. All further
   look work happens in the act-1 tileset against this target. Verdict:
   records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt. Constitution +
   target-match gate shipped the same turn (215 checks).
   [HISTORY] Amendment C (ANTI-BIOSHOCK) was run for the first time and the mockup
   FAILED it: the painted plate cut into 262 unique tiles for 264 cells - it was
   never a tiled world. Fixed: banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt is
   a real, bounded, NAMED 38-tile set (+11 sprites + cast-shadow DATA), the frame
   is re-laid from nothing but those tiles, and it renders on a real browser
   canvas with integer blit and smoothing off. The first reassembly looked worse
   and the four reasons were specific: no wall corners, a hip roof laid as flat
   stripes, no runtime cast shadows, no gaps between buildings. All four fixed.
   Delta from the painting is now 34/255, essentially all of it the two poster
   passes that belong to the renderer. THE TILE-REASSEMBLED FRAME IS NOW THE
   TARGET and the judge page leads with it. Record:
   records/BOHEMIA_REASSEMBLY_TEST_7_26_26.md. Gate: 1,074 checks, including a
   hard 96-tile ceiling. Backlog item 2 (MASTER ACT-1 TILESET) is now partly
   delivered: this IS the starter set; what remains is the act triptych and
   palette indexing.
   [PRIOR ROUND] THE TARGET SCREEN.
   REV 3 answers the marked-up shot: the nameless bottom band, the fake
   chain-link and the fake power line are DELETED (invented decoration is
   deleted on sight); the radioactive barrel is a plain rusted drum and
   radiation/hazard iconography is now BANNED BY LORE everywhere; the crossing
   spans kerb to kerb with its bars across traffic, lined up with its walk; the
   front door shares a column with its own walk; the garage door is a real
   opening with the driveway running into it; the lamps are the slim blessed
   post, a tile taller and not one pixel wider; and two objects can no longer
   stand on the same ground - the BUILD FAILS. NEW LAW + gate:
   laws/BOHEMIA_ADDENDUM_NAME_IT_OR_DONT_DRAW_IT_7_26_26.md - every thing on
   screen is named, described, sourced, and the build dies if the drawn count
   ever exceeds the named count. Manifest ships with the render and is printed
   on the judge page. Gate: 483 checks.
   [PRIOR ROUND] THE TARGET SCREEN. Paolo:
   "Front base is the only one I'm concerned with and even then it looks like
   hallucinated AI slop. We made a rule that all cars are 2 x 3 tiles. Yeah the
   roofs are all fucked up not put on correctly yeah." A THE FRONT FACE is the
   direction; B and C are GRAVEYARDED (registry + post-mortem in
   records/BOHEMIA_TARGET_SCREEN_RULING_7_26_26.md) and their renderers were
   DELETED, not disabled. REV 2 fixes both named defects at the root: cars are
   sized from engine/bohemia_prop_scale.js at draw time (never a typed number)
   and turned along the road they died on; SHEAR is 0 forever, so a roof sits
   square on its own walls and is a real hip form (ridge, hip ends in the roof's
   own material, fascia, eave shadow). Judge page is now ONE TAP: GOOD ENOUGH /
   COULD BE BETTER / STILL SLOP, with both fixes shown under a tile grid.
   Gate: 91 checks. STILL OPEN: whether the LOOK is there. If it comes back
   STILL SLOP the named next suspects are the one-tan value range, the unindexed
   palette, and boxes-instead-of-massing. Do not act on those before he rules.
1-OLD. [superseded] the three-candidate sitting
   (A THE FRONT FACE / B THE ISO BLOCK / C THE CUTAWAY), each side-by-side with
   a real screenshot of the shipped run, judged from alpha -> LIFE -> PICK THE
   TARGET SCREEN. Built entirely from approved banks; the body is baked by the
   alpha itself. Record: records/BOHEMIA_TARGET_SCREENS_7_26_26.md. Gate:
   target_screen_gate.py (63 checks, registered) — it holds 2-tile doors, human
   scale, three-tone/no-keyline, dead-dark glass, and law 4's quest-ask freeze.
   NOTE: they were composed BEFORE amendment D landed on main, so item 0's
   MOBILE RENDER CONTRACT is written FROM them (records/target/BOHEMIA_TARGET_
   SPEC.json already pins resolution, tile px, integer scale, portrait viewport,
   light direction and the three-tone/no-outline rule) rather than the other way
   round. Amendments B+C (cut-and-reassemble acceptance, proxy gates) attach at
   the moment of the pick, not before it.
1b. (blocked on the pick) WRITE THE PICK IN: status PICKED in the spec, losers
   to the graveyard with a post-mortem, target-match diffing on, proxy gates +
   the cut-and-reassemble acceptance test per amendments B+C, freeze lifted.
2. (after the pick) MASTER ACT-1 TILESET to the target. INTERIOR COMPOSITION
   SOURCE (7/26): records/BOHEMIA_ROOM_RECIPE_BOOK_7_26_26.md — 12 room
   recipes + composition laws + the 70/20/10 dead-world translation,
   [PENDING Paolo bulk verdict]; on APPROVE, rooms are composed FROM the
   recipes (manifests mapped to the interior pool), never invented.
   INGREDIENT DELIVERED
   7/26 by CITY: banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt - Paolo's Great Sweep
   crossed to real images for the first time (all 87 swept packs resolve against
   the HD masters, 0 unresolved), filtered UP-ONLY, 465 tiles bucketed by room
   function with per-tile draw scale from the sweep's BIG/SMALL flags. Built by
   tools/bohemia_interior_pool_factory.py; re-run it with different caps for a
   bigger set. Bodies/gore excluded on purpose (UP, but a story Paolo places).
   Deliberately NOT wired into the game - the freeze and TILESETS-ARE-SETS say a
   look is judged as one assembled scene, after the pick. produced + judged as
   one assembled scene; act triptych variants in spec. | tileset gate +
   proportion gate (2-tile doors, human scale — the proportion half already
   ships inside target_screen_gate.py) | — | yes, as a set.
3. [RETIRED 7/26 - the work is dead, not done] RE-COOK VEHICLES TO ISO. This was
   only ever needed if candidate B or C won. A won and both are graveyarded, so
   the approved car art is already in the right projection. Removing it rather
   than leaving it to rot at the bottom of the lane.
3b. [PENDING Paolo, carried] THE CAR LENGTH. At true pixel scale the approved
   wreck art is ~2 tiles wide by >4 long, against his locked 2x3 footprint.
   Either the art is re-cooked shorter or the footprint becomes 2x5. Not a
   guess I get to make.

Rules (full doctrine: laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md): topmost
unblocked item in YOUR lane; [PENDING Paolo] items are SKIPPED, never resolved;
only Paolo/verdicts add direction-class items; agents may append (discovered)
items; every item works to the Definition of Done. Entry shape:
GOAL | DoD beyond the standard | DON'T TOUCH | needs-verdict-before-volume?

## RUN
0aa. BORDER WALLS INTO THE RUN (Paolo direct order 7/27, furious and right):
   the 13 approved perimeter-wall keys (banks/BOHEMIA_PERIMETER_WALL_POOL_
   7_14_26.txt, tan variants, one-wall-per-community law) are wired into the
   CITY but ABSENT from the run slice — the suburb blocks Paolo walks must
   wear HIS approved border walls. build_run_slice.js adds the pool to its
   bank reads; integration ledger gets a perimeter_wall row. | ledger row
   INTEGRATED + real-surface screenshot of the walled block | the pool stays
   as-approved, no recooks | no.
0a. THE MOBILE BASE (Paolo direction 7/26, laws/BOHEMIA_ADDENDUM_MOBILE_BASE_
   COMFORT_7_26_26.md): the cart deploys into camp on the walk surface; ONE
   contextual button runs the ritual (eat / hang out / sleep) through the
   ported resolver's declared moments; sleep at camp = save (ruled); camp
   COMFORT from cart upgrades extends the rested/fed effects (Valheim
   pattern, feel-approved in the lab — ledger is the tuning reference).
   Mechanism only: upgrade roster/looks/numbers are Paolo's verdicts, tables
   ship EMPTY. FIRE ART SOURCE (index 7/27): the camp fire uses the APPROVED
   fire/campfire loops (banks/BOHEMIA_FIRE_FLICKER_BANK_7_13_26 + PARTICLE_
   LOOP_BANK — 10MB of approved fire with zero consumers until now). | deploy -> ritual -> buffed -> sleep-save proven headless +
   on the real surface | engine/bohemia_loop.js (flag needs to WORLD);
   upgrade LOOKS are CHARACTER's judged candidates | numbers = [PENDING].  (LANE CHARTER CHANGED 7/26 — read
##       laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md first.
##       This lane INTEGRATES what the fleet built; it does not add features, and
##       the run's quest is disposable scaffolding, never judged.)
A2. [DONE 7/27 — HIS ORDER, job two] THE WORLD ADOPTED THE RESOLVER.
   engine/bohemia_world_resolve.js: four systems subscribe to the declared time-spend
   moments — day (accrues spend, rolls the day), economy (advances the ledger when the
   day has moved under it), faction (the beat), encounters (the director's socket).
   NO MOMENT NAME AND NO RATE LIVES IN THE MODULE: his own example words (sleep, night,
   meal, hangout) appear nowhere in it, and a resolver whose moments are named nonsense
   works identically, which is the proof it genuinely does not know them.
   EVERY TABLE SHIPS EMPTY. An unruled system runs, changes nothing, and reports
   NO_RULING BY NAME, so an unruled world reads as unruled instead of looking like a
   working one. Ten small moments equal one big one exactly when he says 0.1 and 1.0,
   and four equal one when he says 0.25 — the ratio lives in the ruling.
   THE 7/24 PACING RULING HOLDS: a faction turn cannot fire without a caller-supplied
   beat predicate, so DEFAULT OFF is structural, not a comment. A spent meal can never
   quietly become a war. Gate WORLD RESOLVE, 39 checks.
   FOUND BY THE GATE: ten spends of 0.1 sum to 0.9999999999999999, so a strict >= 1 ate
   one moment in every ten and the player could eat ten meals and never turn the day.
   [PENDING Paolo, and it is what blocks everything downstream] THE MOMENT TABLE —
   which moments exist and how much each one spends — and each system's per-unit rate.
   Nothing in this lane will guess either.
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   ONE CONTEXTUAL VERB AND THE DECLARED REACH. Paolo APPROVED both, so this needs
   no further ask. engine/bohemia_resolve.js ships makeReach(tiles) + facingTile:
   one range, one facing rule, one predicate. The run currently has a talk trigger
   AND a door bump AND separate buttons; fold them into ONE button whose label
   comes from what you face, exactly as the lab world does (CAST / USE TOOL / TALK
   / SLEEP), with the target tile outlined so the button is never a mystery. It
   REMOVES UI rather than adding it, which is what a phone wants.
   [PENDING Paolo] HOW MANY TILES OF REACH. Do not pick it. The lab used 1 in a
   reference page; that is not a ruling.
   [DONE 7/26] THE FIRST CONNECTED RUN — shipped, gated. Record:
   records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
   [DONE 7/26] THE REAL CAST — the run wears the real rig + wardrobe + face.
   [DONE 7/26] REAL ANIMATED DOORS (2 tiles tall, approved 7/13 bank) + MUSIC
   (the alpha's own synth scores the walk). Law:
   laws/BOHEMIA_ADDENDUM_DOOR_LAW_TWO_TILES_TALL_7_26_26.md.
   [DONE 7/26] SAVE / LOAD — one portable versioned blob (sleep + manual +
   autosave, export/import code, no device prefs inside, old versions migrate
   forward) and DEATH IS A RELOAD wired to it.
   [DONE 7/26] THE OVERWORLD LOOK — the block is laid from the FROZEN starter
   tileset of Paolo's CBB target. Consumed, never re-rendered; the builder
   refuses to ship if the bank md5 moves. CORRECTION ON RECORD: the target he
   picked is TOP-DOWN, so this lane's old "the run must go 3/4 iso" premise was
   wrong and is retired.
   [DONE 7/26] INTERIORS DRESSED — CITY's UP-only interior pool consumed: one
   floor per ROOM by the room's own function, props from the role's own buckets,
   walls from the constitution's own tile. Props never became collision.
   [DONE 7/27] THE SENTENCE (his ruling after the lab): every verb goes through
   the ported engine/bohemia_resolve.js — REACH declared once, ONE contextual
   button (talk/enter/use/sleep/hang out), and every time-spend resolves the
   world through declared moments in declared phase order. Sleep saves.
   [DONE 7/27] WALK FEEL as playable toggles: GRID / SLIDE / HYBRID / FREE.
   [DONE 7/27] THE REAL VALLEY — the block is a real CELL of the generated
   valley, read off the world model's own tile rung; walking off an edge loads
   the neighbouring district. Passability is the world's answer now.
   Scoreboard: records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md (21/27),
   enforced by gates/integration_gate.js.
0b. DISTRICT ART (now the lane's top gap). The other districts are WALKABLE but
   wear a generic material pass laid from the world's own tile names. Each type
   needs its own dressed language the way the suburb has one, built to the
   constitution. | per-type material map + a real-surface screenshot each |
   the frozen tileset is frozen; new tiles register in target_match_gate | yes.
0c. DISTRICT ART / MUSIC / DAY CYCLE (ledger priorities 3-5), in that order.
1. Phone-feel pass on the run (touch responsiveness at arm's length): real
   device-shaped viewports, hold-to-walk tuning, tap-to-step target sizes,
   the objective bar at arm's length. | run_gate extended with a real-device
   viewport pass | engine/bohemia_loop.js (flag needs to WORLD) | no.
2. (discovered) WIDEN THE RUN: the run is one seed-7 block. Walking off the
   block into the neighbouring district is the next real milestone — needs the
   world model's plot-to-plot transition, not new content. | run_gate proves a
   second district reached on foot | district engines (CITY lane owns them) | no.
3. (discovered) The player is not registered in ctx.scheduler, so the run's
   grid clock is the block sim's, not the loop's turn scheduler. Engine request
   for WORLD: a player actor the run can commit() through. | loop gate section
   | engine/bohemia_loop.js | no.
4. (discovered) Only S01 is wired into the run. Once placement is ruled, the
   other twenty canon quests should be reachable from a run surface too. |
   run_gate covers a second quest end to end | quest text | [PENDING Paolo
   placement].

## WORLD
V-1. [VERDICT IN 7/27 — 10 up / 32 down / 3 unjudged of 45. "it was mostly all bad",
   "nothing here was perfect all need work fr"]
   Raw: records/BOHEMIA_VERDICT_BULK_DISTRICTS_7_27_26.txt
   Read: records/BOHEMIA_BULK_VERDICT_ANALYSIS_7_27_26.md
   NOTHING IS BEING REBUILT OFF IT. STOP PRODUCING: a bulk rejection is a signal the
   BAR is not met, not a work order for 32 rebuilds.
   THESE ARE REWORK, NOT KILLS, by his own words ("needs work" / "could be better" /
   "needs more" / "all need work"). NOTHING GOES TO THE GRAVEYARD off this verdict —
   a misread would delete most of the valley, and GRAVEYARD IS FINAL.
   AND MY OWN TOOL PUT A THUMB ON IT: the bulk judge rendered plots as FLAT PALETTE
   COLOURS, which is not what the game draws. That is a side-door probe, which
   VERIFY ON THE REAL SURFACE calls a lie outright, shipped by me one message earlier.
   The split it forces: ICON complaints are real art and fully valid; LAYOUT
   complaints (parking, scale, what is where) are valid because a schematic shows
   layout truthfully; "looks like shit" on a colour grid is a fair reaction to a
   colour grid and is not yet a verdict on the district's art.
   THE BLOCKER, and it is not in this lane: the tile set covers ONE residential
   street, and the CITY tab does not use it at all. 44 of 45 districts have NO ground
   art. Every look verdict comes back the same until a tile family exists per
   district type. That is ART's item 1; redrawing layouts will not move it.
   ACTIONABLE AND MINE, pending his order on sequence:
     (a) LAYOUT: commercial + ballpark parking (walkable-land), library scale
         ("the worlds biggest library"), farm growing row crops in the Mojave,
         interchange + rail + airfield readability, waterpark.
     (b) ICONS: firestation + campus bugged, storage bad, solar needs more panels,
         commercial needs loving, courthouse building bigger, cemetery has none.
     (c) HIS CALL, never invented: is the school a high school or a middle school;
         and he noted he never asked for the town district.
V0. [DONE 7/27 — HIS ORDER] JUDGE EVERYTHING, BULK AND ONE BY ONE.
   Paolo, verbatim, in the same breath he approved the town and the ballpark:
   "is there anyway i can comment and judge all ur work in bulk and individually".
   That is a complaint about the VERDICT SURFACE and it was fair: the judge pages
   were one-subject and scattered, nothing put a district's GROUND next to its ICON,
   nothing cleared forty items in one gesture, and most were reachable only if you
   knew the filename. A verdict cost him a hunt per item, and STALE UNJUDGED IS DEAD
   did the rest.
   slices/BOHEMIA_BULK_JUDGE_7_27_26.html (tools/bohemia_bulk_judge.py): all 45
   districts, one row each, THE PLOT YOU WALK beside THE CITY ICON because they are
   meant to read as the same place and that is only judgeable side by side. Per row:
   thumbs + a comment. Per category: ALL UP / ALL DOWN. Global: ALL UP / ALL DOWN /
   CLEAR, a live up/down/left counter, and NEEDS A LOOK which hides everything already
   judged so a second pass only shows what is left. SUN MODE, global comment, export
   .txt. REACHABLE: a card at the top of the LIFE hub, so it is not another file he
   has to know the name of.
   COOKS NOTHING (REUSE-FIRST): plates render from the existing grid dump, icons are
   read verbatim out of the existing hero bank.
   FOUND DOING IT: tools/bohemia_district_grid_dump.js was missing suburb and
   substation, two real DISTGEN types — so every consumer of that dump has been blind
   to them. Added. (gated + estate legitimately share the suburb generator.)
   VERIFIED ON THE REAL SURFACE: booted the hub in a 390x844 browser, tapped the card,
   landed on the page, 72 plates loaded, exercised bulk + individual + toggle-off +
   comment + export and read the exported .txt back. Zero console errors.
ICON LAW (Paolo 7/27, LOCKED — laws/BOHEMIA_ADDENDUM_ICON_WITH_EVERY_BUILD_7_27_26.md):
"anytime you build something like this you have to make a city builder icon as well like
for real." A district or surface is NOT FINISHED until it has a city builder icon (a
DISTRICT HERO), the same turn the ground ships. Gate ICON is a ratchet: new work cannot
add debt, and the named debt list may only ever shrink.
I0. [DONE 7/27] rail + interchange heroes, built the approved way (hand-built 3D volumes
   matched to the walkable district, palette pulled live from the engine module, full
   PARTS dossier). Wired into the CITY tab. Gate ICON, 17 checks.
I1. [HELD — needs Paolo's ruling, do NOT just retry] AIRPORT + AIRBASE HEROES. Both
   builders are written, correct and left in tools/bohemia_district_hero_factory.py, but
   deliberately OUT of the HEROES dict because the signature does not read. The aeroplane
   geometry is NOT the problem — baked alone on a bare plate it reads unmistakably as an
   aeroplane, verified. The problem is SIZE: every other hero's signature is a BUILDING,
   which survives shrinking to a 1x1 plot; an airfield's signature is an AIRCRAFT, and a
   plot holding a runway + a taxiway + a terminal has no room left to make it legible.
   Four attempts are written up in the factory so nobody re-walks them. THE QUESTION FOR
   PAOLO: should an airfield hero DROP the runway and show just the terminal and the
   aeroplane, big? That is a composition ruling, not a code fix.
I2. THE ICON DEBT, 22 of 44 registered types (gate prints it every run): suburb, trailer,
   apartment, wash, cemetery, drivein, golf, jail, chapel, landfill, railyard, substation,
   watertreat, boneyard, waterpark, airport, airbase, arterial, freeway, desert, mountain,
   water. Terrain (desert/mountain/water) may not want a building hero at all — that is
   a separate ruling. Chip at this list; it can only shrink.
I4. [FIXED 7/27] tools/bohemia_district_grid_dump.js had the SAME hard-coded scratch
   path defect as I3, pinned to a different dead session. Portable now. Worth a sweep:
   any tool that writes to a session scratch dir should read BOHEMIA_SCRATCH first.
I3. [FIXED 7/27, found while doing I0] tools/bohemia_district_hero_factory.py had its
   scratch path HARD-CODED to one session's private directory, so the factory could not
   be run by anybody else at all — the palette dump died on check=True before the first
   hero was built. Session-portable now (BOHEMIA_SCRATCH, else the system temp dir).
0. [DONE 7/27 — HIS ORDER, top of the queue] THE ONE MAP.
   laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md. The phone's map app drew a SCHEMATIC:
   gradients, two glyphs, and one tiny square per building lot. It now renders THE
   REAL GENERATED VALLEY, cell for cell, from engine/bohemia_valleymap.js — the ONE
   shared renderer the city-builder MAP tab now reads from as well. Quest pins on top,
   grouped by cell (21 quests land on 13 cells, so a stack reads as a stack with a
   count instead of three glyphs hiding each other). Tap any cell and it tells you
   what is really there, straight off the world model. Gate ONE MAP, 37 checks.
   WHAT THE JOB ACTUALLY UNCOVERED, and it was worse than a re-skin:
     a. THE PHONE WAS RUNNING A WORLD MODEL WITH NINE GENERATORS MISSING. arterial,
        freeway, terrain_noise, airfield, desert, mountain, water, rail and
        interchange were never in build_current_slice.js's MODS, so the railway, the
        freeways, the interchange, both airfields and all three terrains rendered as
        nothing on the phone while the MAP tab drew them properly. Fixed and gated.
     b. FOUR INDEPENDENT VALLEY RENDERERS, no shared layer, tone tables copy-pasted
        between files with comments admitting it. The MAP tab's private copies are
        gone; it reads the shared module now.
     c. DEAD CODE IN THE MAP APP: wm.hubs and wm.routes were read every draw and
        buildRealWorldMap has never set either one.
     d. THE PLAYER STOOD OUTSIDE THE WORLD. tile 128,128 on a 96-cell valley, so the
        blip — the one thing on the map that is YOU — was permanently off the canvas.
   STILL OPEN, and it is a real one: the placement-verdict overrides. The pins read
   ctx.quests.castTarget, which hashes into a faction's territory list, so one faction
   base attracts every quest that demands it. engine/bohemia_quest_placement.js exists
   to fix exactly that and NOTHING CONSUMES ITS OUTPUT yet. That is [PENDING Paolo] —
   the judge page is built and unjudged, and the WORLD-BEFORE-QUESTS park only lifted
   far enough to DRAW pins, not to decide where they go.
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   RESOLVE POINT. Paolo APPROVED it and RULED its shape in the same breath: "sleep
   can be hangout or eat too u know" — the world resolves at ANY BLOCK OF TIME THE
   PLAYER SPENDS, and sleep is only the biggest one. Law:
   laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md
   engine/bohemia_resolve.js ships the machinery: a resolver takes a declared list
   of moments each carrying a size, a system declares which moments it answers, an
   undeclared moment is a build error, systems cannot read each other, and one
   broken system cannot eat the time the player spent. Register the world's systems
   as steps (territory, who noticed you, the overnight feed, decay) and run them at
   a spent block instead of scattering them across the tick.
   [PENDING Paolo] THE MOMENT TABLE: which moments exist beyond his three examples
   and HOW LONG EACH SPENDS. And the action cost table. Do not invent either.
LANE RULING (Paolo 7/26, LOCKED — laws/BOHEMIA_ADDENDUM_WORLD_BEFORE_QUESTS_7_26_26.md):
"we need to actually build a fucking world." This lane does NOT work on quests. Every
quest item is PARKED until Paolo himself reopens it. Build ground, not plumbing for
stories the world cannot host yet.

0. [DONE 7/26, freeze lifted] THE FIVE SURFACES CONFORM TO THE VISUAL CONSTITUTION.
   Built during the freeze and flagged PROVISIONAL SKIN; the moment Paolo ruled the
   target CBB they were measured against it and the 5 out-of-band palette entries
   (road paint, crosswalks, stop bars, the lake ring) were toned into their layer's
   value band. Locked by a CONSTITUTION CONFORMANCE section in roadcell_gate and
   terrain_gate, which read the constitution at run time. Any NEW cook in this lane
   passes the same section plus the fleet's proxy gates, and any new art BANK
   registers itself in target_match_gate.py.
0c. [DONE 7/26] STREAMING: bounded LRU plot cache (64 cells) + w.stream() warming the
   ring ahead of the body + the walk surface streaming before it steps. Walking the
   valley used to grow without limit toward ~1.8 GB; it is now flat, and a boundary
   crossing costs 0.03 ms. Gate: STREAMING. RESIDUAL for a SURFACE lane (not WORLD):
   the ~30-40 ms first-touch of a fresh cell wants an idle callback or a worker inside
   the run/city frame loop.
0b. [PENDING Paolo] ACT TRIPTYCH for the five surfaces: act-2 recovering and act-3
   rebuilt materials. Content, his call, recorded in every dossier.
1. DONE 7/26: THE GROUND IS BUILT. Roads (arterial 2,434 + freeway 952) and terrain
   (mountain 927 + desert 620 + water 74) all generate real ground on one continuous
   valley-wide noise field. Valley: 40% -> 95% generated. Gates ROAD CELLS + TERRAIN.
   WHAT IS LEFT UNBUILT, in order of size, and it is all LANDMARK work now:
     a. [DONE 7/26] airbase 54 + airport 40: engine/bohemia_airfield.js, built across
        the CLUSTER (new clusterBoundsOf rung on the world model) so one runway spans
        the whole field. Gate AIRFIELD, 20 checks. FOLLOW-UP (discovered): the field
        reads as clean bands and wants dressing — drifted sand over the pavement,
        cracked slabs, blast staining, wrecks off the taxiway. Cheap, and it is what
        would make it read finished rather than merely correct.
     b. [DONE 7/27] rail 90 + interchange 16, and they turned out to be nothing like
        "network tiles like the roads, same machinery" — that line in this backlog was
        wrong and both had to be built as their own thing.
        RAIL (engine/bohemia_rail.js): a railway has no lanes, no median, no sidewalk
        and no intersections, so it gets its own vocabulary — a two-track ballast prism,
        cess, ditch, a maintenance road on ONE side, a right-of-way fence, and rail-served
        industrial frontage outside it. Passing sidings keyed on the CELL COORDINATE so
        they run 16 cells and taper into the main through real point blades. 17 at-grade
        crossings where the mile grid meets it. THE LINE IS ONE LINE for the whole valley:
        world.js's new continuityLinks looks THROUGH a crossing surface, and
        bohemia_freeway.js now carries the ballast and rails UNDER its deck, so the
        mainline is not severed into three pieces at the freeways. Gate RAIL, 36 checks.
        INTERCHANGE (engine/bohemia_interchange.js): the stack, solved across all 16
        cells as ONE PURE FUNCTION of valley position — no per-cell buffer anywhere, which
        the gate proves outright via the exported solve() rather than inferring it from
        seams. Two mainlines, one decked over the other on piers, eight ramps (a tight
        connector and a directional flyover per quadrant), two retention basins, the wall
        track, and the jam that starts here. Approaches come from the MAP
        (world.js clusterApproach), not from a symmetry assumption. Gate INTERCHANGE, 43.
     b2. [DONE 7/27, FOUND BY LOOKING] THE INTERSTATE WAS RENDERING AS A LATTICE. 926 of
        the valley's 952 freeway cells were drawing themselves as a four-way junction,
        because the overmap lays an interstate TWO CELLS WIDE and the module read "any
        freeway neighbour" as its axis — so the third neighbour, which is the PARALLEL
        CARRIAGEWAY, looked like a crossing. The corridor came out as a grid of tan
        embankment squares. A cell's axis is now the direction it has BOTH neighbours in,
        the odd one out is named as parallel, and no sound wall stands between two
        carriageways. Gated in roadcell_gate (crossroads must stay under 5%).
        This was my own 7/26 work. It shipped with all gates green because no gate
        looked at the SHAPE of the corridor, only at whether you could drive through it.
     c. [IN PROGRESS] THE SMALL LANDMARK SET. 88 buildable cells were flat.
        [DONE 7/27] CAMPUS 16 + SPEEDWAY 12 — the two biggest — as real kit districts,
        street-aware on every orientation, drivable from the curb, full dossiers, gate
        LANDMARKS (52 checks), AND their city builder icons the same turn per the icon
        law. Valley 96.7% -> 97.0%.
          THE CAMPUS'S WHOLE JOB IS THE QUAD: an open middle with the halls turned to
          FACE it, the colonnaded library as the biggest mass, a fan-plan lecture hall,
          a residence row apart, and the parking pushed to a ring because a campus core
          is walkable on purpose. The gate measures the distinction that matters — the
          quad must BEAT the pavement, or it is a business estate wearing the word.
          THE SPEEDWAY'S IS THE OVAL: a closed ring you could drive a lap of (the gate
          floods it and requires it to come back round), painted apron inside the
          banking, grandstand on the FRONT STRETCH ONLY because three of four sides of
          a superspeedway have no stands, pit road and garages inside, the road course
          ghosting through the infield, and the spectator TUNNEL.
          FOUR REAL BUGS THE GATES CAUGHT, all of which looked fine rendered:
            - the campus lots did not touch the ring road: driveReach 0.54, half the
              pavement unreachable. A lot you cannot drive into is a painted rectangle.
            - the speedway apron was inset from the plot edge: driveReach 0.00 with a
              full car park on it.
            - all five speedway light towers were placed OFF the grid (the oval nearly
              fills the plot), so not one tile of them existed.
            - THE TUNNEL SKIPPED THE FENCE. It read "goes under, not through" and so
              never pierced the catch-fence ring, sealing the oval: only 39% of the
              walkable plot was reachable from the street and you could not get to the
              track, the infield or the garages at all. Now 100%.
        [DONE 7/27] TOWN 9 + BALLPARK 8, same method, each with its icon the same turn.
        Gate LANDMARKS grew 52 -> 107. Valley 97.0% -> 97.2%.
          THE TOWN IS A BLOCK, NOT A MAIN STREET. The first version had every correct
          PART and was a BARCODE: five full-height stripes running unbroken top to
          bottom, all in the same brown. Found by rendering it and looking. A town's
          structure is not its street, it is its BLOCK, and a block is what you get
          when CROSS STREETS cut the row; a main street with no junction is a corridor.
          Three cross streets, varied unit widths, anchors on corners. Also: everything
          was one brown (it separates by MATERIAL now), the boardwalk was invisible,
          and the fallen town sign spanned the full carriageway and stranded 34% of the
          drive network north of it.
          THE BALLPARK IS A WEDGE, NOT A RING — a stadium is a closed ring around a
          rectangle, a ballpark is a quarter circle opening away from one corner, and
          getting that wrong makes this the stadium district again. THE COORDINATE
          SYSTEM IS THE DESIGN: not x and y but a (how far ALONG a foul line) and q
          (how DEEP into foul territory), so the bowl is three bands of depth that wrap
          the plate and run down both lines on their own. The first version used RADIUS
          from home plate: a ring behind the plate is a ring, so the seating came out
          as two disconnected wings with a hole where the backstop belongs.
          THE BUGS: (1) G.rect takes (x0,y0,x1,y1) and I passed (x0,x1,y0,y1) —
          systematic, across both districts; the town's alleys and the ballpark's
          dugouts and bullpens never drew at all. (2) The bullpens were axis-aligned
          rects drawn straight through the lot ring, severing the parking (driveReach
          0.76 against a 0.85 bar) and merging into the grandstand blob. (3) Foul
          territory was one solid dirt apron and the park read as a brown blob.
          (4) The lot was a barcode too. All four found by measuring or by looking.
          THE ICONS: the ballpark's is drawn from BEHIND HOME PLATE, which is not a
          style choice — put the plate at the front and the grandstand stands between
          the viewer and the whole park. Home at the back corner means the foul lines
          run along the two ground axes, so the infield square renders as a true
          DIAMOND in the 45-degree view for free. Two iterations after that: the bowl
          wrapped 270 degrees and read as the STADIUM icon (200 now), and the outfield
          wall was as tall as the stands (a low fence now).
        STILL FLAT (44 buildable cells): basin 8, convention 6, datafort 6, prison 4,
        dam 4, reservoir 3, plus a tail of single-cell landmarks (reclaim 2, granary,
        fort, springs, radio, minigp, arsenal, gypsum, pumpstation, intake, quarry).
        Same method, two at a time, each with its icon.
     d. NEVER AUTO-GENERATED, by law: strip 81, resort 118, casino 5, luxor, sphere,
        strat, highroller, sign. Paolo's hand. Leave them reserved.
2. [DONE 7/27] AMBIENT ENCOUNTER DIRECTOR. engine/bohemia_encounters.js, built on
   his "Approve all" (records/BOHEMIA_VERDICT_ACT1_ROSTER_7_26_26.txt). All 12 act-1
   tokens under the verdict's own names, each with the VERB that makes it different
   (variety is a verb, never a bigger HP bar) and the beat telegraphs the roster
   specified. The whole approved pacing package is held and measured:
     70/20/10 by a DEFICIT CHOOSER, not dice — and the class is NOT NEGOTIABLE. The
       first build substituted another class when the wanted one was on cooldown and
       came out 40/42/18; if the story wants an ambient beat and none is available,
       NOTHING HAPPENS rather than a forced fight standing in for it. Now lands on
       70.0/20.0/10.0 over a long walk.
     STORYTELLER BUDGET — spends big when healthy and quiet, small after hard fights.
       A hurt player with a hot recent past measurably gets fewer encounters.
     ~90s FLOOR, RARE IS SACRED (spice once a session, ever), NO REPEAT-SPAM.
     NO GLOBAL SPAWNS EVER — held by construction: there is no fallback table, so a
       district with no entry spawns nothing and says so.
     NO BACKGROUND TICKING (his pacing ruling) — the module owns NO CLOCK at all: no
       timer, no interval, no Date.now. It is PULLED through the encounters socket in
       bohemia_world_resolve.js. Standing still forever produces nothing, gated.
     PRECONDITIONS THE ROSTER STATED are honoured and an unproven one is a NO: the
       bounty squad only exists because of your own murders, the spotter drone only
       patrols owned light (LIGHT=TERRITORY), patrols collide only at a seam.
   Gate ENCOUNTERS, 46 checks. Enemy ART is explicitly NOT this item (the verdict
   files it as a separate fresh-look judge under approved-assets-first).
   NOT YET LIVE, and this is the honest state: the director is built and its socket
   exists, but nothing spawns until (a) Paolo rules the MOMENT TABLE so the world
   resolver actually fires, and (b) somebody supplies the district+day/night table,
   which is content nobody has ruled. Both are one call away, neither is guessed.
3. INTERIORS FOR THE GROUND THAT HAS THEM: coordinate with CITY (they own the district
   interiors item) so nothing is built twice. | — | CITY lane's item 1 | no.
4. [DONE 7/26] Engine support for RUN, request 1 of 2: THE VALLEY TILE + CROSSING
   (world.tile / solidAt / step / walk / route). The run can now ask the world model for
   any tile in the valley and walk across cell boundaries on real ground; gate CROSSING
   proves district -> street -> district on foot. RUN's ledger priority 2 is unblocked.
   [DONE 7/26] request 2 of 2 as well: THE WALK SURFACE
   (Loop.makeWalkSurface + ctx.walk) — a player actor in a real loop scheduler in
   valley tile space, blocked by the world's own tiles, with commit/routeTo/follow.
   Gate CROSSING is 22 checks and walks it end to end. RUN item 3 is unblocked.
5. Further engine support requests flagged by RUN (as they arrive, priority). | per
   request | — | no.
5. (discovered 7/26) VALLEY COMPOSITION: 70% of the built valley is suburb, and there are
   301 solar cells but 1 library, 1 firestation, 1 jail. Whether that is the city he wants
   is a DIRECTION call. | — | — | [PENDING Paolo].
6. (discovered 7/26) Faction bases are an even stride across the district list, so all 14
   factions sit on suburb tracts holding 1 cell each. Whether a faction's ground should
   match its trade is his call; the mechanism is a small change to bootFactions.
   | — | — | [PENDING Paolo].

PARKED BY THE 7/26 RULING (do not pick these up):
- P1. Quest placement picks -> apply as a casting-bridge override. The candidates shipped
  (all 21 quests after the QUESTS lane folded theirs in) and the judge page is live in
  the LIFE tab; it stays there, unjudged, unsurfaced.
- P2. World bridge deepening (quest outcomes moving factions on the map).

## LIFE / SOCIAL
A. [FILED BY VERDICT 7/26 — records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt] ADOPT THE
   RATION AND THE STANDING CEILING. Paolo APPROVED both.
   RATION (engine/bohemia_resolve.js makeRation): limit favours, posts and gifts by
   COUNT per day and per week, NEVER by money. A priced limit stops mattering the
   moment the player is rich; a rationed one never does. The bypass slot is the
   birthday shape: an occasion that ignores both windows and can pay a multiplier.
   CEILING (makeCeiling): faction standing gets a WALL you cannot grind through.
   You reach it by doing jobs and you only pass it by COMMITTING (taking a side,
   burning a bridge), and neglect gets more expensive the deeper in you are.
   [PENDING Paolo] THE NUMBERS: how many favours per week, where each faction wall
   sits, what commitment moves it, what neglect costs per rung. Do not invent them.

## CITY
0. [DONE 7/26] THE WALKED WORLD WAS RESAMPLED AT EVERY ZOOM. Found by
   MEASUREMENT (tools/bohemia_render_audit.js patches the canvas before the app
   boots and records every real draw), not by reading code. 41% of all draws
   upscaled by x1.375 - the chunk bake was 16px/cell while the default zoom is
   22, so the ENTIRE ground plane was resampled, and the zoom ladder
   [11,22,44,88] is a clean power-of-two family that was being divided by the
   wrong base. 44% more landed on a half pixel because the canvas takes its CSS
   client height and an odd height puts .5 in the camera origin. Fixed:
   tools/bohemia_city_pixelfix_patch.py (TPX 16->22, whole-pixel camera, and
   canvases given their own 64-entry LRU so the bigger bake cannot blow the
   ~224MB iOS floor). Result 41% -> 0.1% and 44% -> 3.4%. Locked by
   gates/render_pixel_gate.js, a RATCHET measured on the real surface.
0A. [DONE 7/27] THE PHONE WAS EATING THE CONTROLS. He said "I can't get outside
   the suburb" and "I'm trying to copy and paste the arrow of move" in the same
   breath, and THOSE ARE ONE BUG. Movement in this game is press-and-HOLD on an
   arrow. iOS Safari's default answer to a long press on text is the selection
   magnifier and the Copy / Look Up / Search callout. The entire 33MB alpha
   contained ZERO occurrences of -webkit-touch-callout and the shell's reset
   never set user-select at all, so holding the d-pad opened the OS menu instead
   of walking. MEASURED, so the level design is cleared: every suburb sample
   sits 16-50 steps from a different district, and 7,645 of 7,649 built cells can
   be walked out of. He was not trapped by the map, he was trapped by the button.
   Fixed: tools/bohemia_touch_guard_patch.py (shell + all three frames; text
   fields keep copy/paste on purpose). Gate: gates/touch_guard_gate.js, which
   states plainly which half it can measure - Chromium does not implement
   -webkit-touch-callout, so user-select is measured on the real controls and the
   callout declaration is asserted in source.
0S. (7/28, SEEN AND LEFT ALONE ON PURPOSE, [PENDING Paolo]) THE ROOF HIPS DO NOT
   MATCH THE ROOF. The straight roof run wears his shingle skins; the four HIP
   tiles (roof_hipTL/TR/BL/BR, the cut corners where a roof turns) are still the
   target set's orange, so each house reads as a brown roof with an orange stripe
   down one side. I saw it in the street shot before shipping and did NOT iterate
   again - a fourth pass on the same feature in one turn is the tell the STOP
   PRODUCING law names. The hips carry the SHAPE and his bank has no corner
   variants, so the choice is his: tint the hips toward the roof skin, cook four
   corner variants of his roofs, or leave the orange. | no gate until he rules |
   /tmp street shot 7/28, records/BOHEMIA_RUN_ART_SOURCE_AUDIT | YES.
0Q. [DONE 7/28] HIS 30 HOUSE SKINS ARE ON THE HOUSES; THE CBB TILESET WENT 83% ->
   30% OF THE BLOCK. Option 1 of the three (skin the stack, keep the massing) -
   he said "do what you have to do next" rather than picking, and option 3
   (ground) was blocked: the WORLD lane's record says READ BEFORE BUILDING ANY
   GROUND, the tile set covers ONE residential street, growing it is ART's.
   Only FIELD tiles wear his skins (flat wall middle, straight roof run, open
   yard); every tile carrying SHAPE keeps the target set (base course, eave,
   corners, window, boarded, all four hips, the garage, all road/kerb/concrete).
   One skin per HOUSE seeded off the footprint, one yard per BLOCK.
   THREE LOOKS BEFORE IT WAS RIGHT: roof_slope only -> stripes; no roof at all ->
   uniform orange (that orange IS the target roof); whole straight run + hips
   kept -> uniform shingle from his bank. The first version would have shipped
   green and looked worse. VERIFY ON THE REAL SURFACE earned its keep.
0R. [DONE 7/28] BANK USED GATE. An approved bank that is loaded and never drawn
   is the same as not having it - it happened TWICE IN ONE DAY in one file (the
   13 border walls, the 30 house skins) and build_run_slice.js only ever asserted
   the banks were PRESENT. gates/bankused_gate.js boots the real run, patches
   drawImage, draws inside / outside / in front of a house / at a door, and
   counts DRAWS PER BANK. Zero draws fails. Also reports (does not fail) the dead
   DOOR_IMG + doorPick() pair, superseded by the animated door bank - delete it.
0P. [PENDING PAOLO - one pick, then it is a day's work] 83% OF THE RUN IS THE CBB
   TILESET, AND HIS 30 APPROVED HOUSE SKINS ARE LOADED AND NEVER DRAWN. Measured
   by tools/bohemia_run_art_source_audit.js: out on the block, 273 of 330 draws
   are the 42-tile CBB target set (his own verdict: could be better) and 57 are
   the border walls he just approved. ROOF_IMG/WALL_IMG/YARD_IMG appear exactly
   once each in the built run - their definition - and are never drawn. The
   builder ASSERTS the banks are present and nothing checks they are USED;
   loaded-and-unused passed every gate in the repo, twice.
   NOT FIXED ON PURPOSE: the houses ride a designed projection (base course, eave
   shadow, corners, garage mouth) and his skins are flat textures with no corner
   variants, so a wholesale swap returns his materials and removes the massing.
   His three options are in records/BOHEMIA_RUN_ART_SOURCE_AUDIT_7_28_26.md.
   | a "banks must be USED, not just present" gate belongs here | measured 7/28 |
   YES, blocked on his pick.
   [7/28 UPDATE] THE GATE NOW EXISTS: gates/banks_used_gate.js. It boots the run,
   patches drawImage, tags every approved bank's images and counts draws per bank
   on the REAL surface, inside and out. PRESENCE IS NOT USE. The house skins are
   WAIVED BY NAME against this item (a gate cannot force a director's call), and
   any OTHER loaded-and-unused bank is an instant fail. The waiver itself is
   asserted honest in both directions - it fails if the bank stops being loaded
   (stale entry) and it fails if the bank STARTS drawing (delete the waiver). The
   day he picks, the waiver comes out and this bank is enforced like the rest.
   It also found what the audit missed: the skins are 21 images in the build, not
   30, across THREE arrays (ROOF_IMG 14 / WALL_IMG 4 / YARD_IMG 3).
0Q. [SMALL, RUN-BUILDER LANE] WALK-FILE DOOR ART RIDES ALONG DEAD. DOOR_IMG (9
   images) is the pre-7/26 flat door art, superseded by the approved animated
   door bank (DOOR_IMGS, 90 images, 2 tiles tall) which IS drawing. It ships
   because tools/build_run_slice.js lifts the walk surface's art block VERBATIM -
   that is the builder's contract and dropping these means post-processing the
   lift, which belongs to whoever owns that builder. Not a rendering defect, a
   payload cleanup. WAIVED by name in banks_used_gate.js until then.
   NOTE THE ONE-LETTER TRAP: DOOR_IMG and DOOR_IMGS are different banks. A probe
   that reads the wrong one reports the LIVE door bank as dead.
0O. [DONE 7/28, and it is the lesson of the day] HE PLAYS THE RUN. THE RUN IS A
   SEPARATE RENDERER. Three consecutive turns diagnosed correctly, fixed
   correctly, gated green and shipped - all in CITY_B64, while he was looking at
   slices/BOHEMIA_RUN_CURRENT.html. In the run, `groundTile` returned 'wall_base'
   for the suburb perimeter, which is the SAME starter-tileset tile its own
   bodyTile() lays as the bottom course of a HOUSE: the border wall and the house
   wall were one tile, exactly as he said, twice. His 13 approved border walls
   had never existed in that renderer. Fixed via the builder (inlines the pool,
   refuses to build without it) + a perimeter draw path seeded per plot, in both
   the main and see-through passes. wallclass_gate.js covers BOTH renderers now.
   STANDING RULE FOR THIS LANE: before fixing anything visual, ASK WHICH SURFACE
   HE IS ON. The CITY tab and the RUN tab share almost no render code. A gate
   that only covers your surface is how you say "fixed" three times while he
   looks at the same broken thing.
0N. [DONE 7/28] THE BANK LAW INDEX - the class of miss that hit THREE TIMES today.
   His rulings are not only in /laws. They are in the BANKS, in fields nothing
   read: a bank's own `law` field said "wall height min 2 tiles" for ten days
   while the wall lay flat; a `paolo_laws` block said "per-cell wall shuffle
   BANNED" while the game shuffled per cell; and the same expression hid nine of
   his thirteen approved walls. /laws has BOHEMIA_CANON_INDEX and a pile of
   gates; the banks had NOTHING, and a rule inside a 2MB JSON blob is invisible
   to a human and to every gate. tools/bohemia_bank_law_index.py now sweeps every
   bank and record for law/paolo_law(s)/ruling/paolo_direction/status at any JSON
   depth and writes records/BOHEMIA_BANK_LAW_INDEX.md - 35 rulings across 24
   files, one readable page. gates/banklaw_gate.py fails if the index is stale
   and byte-checks five rulings verified by hand.
   STILL UNGATED, NAMED: `gates_touch_streets` and `gated_is_rich` are
   generator-level rules with no machine. | build them | records/BOHEMIA_BANK_
   LAW_INDEX.md | no.
0M. [DONE 7/28, his ruling, and it was HIS LAW being broken] ONE WALL PER
   COMMUNITY, AND NINE OF THIRTEEN HAD NEVER BEEN DRAWN. "BRO IN THE FILES THERE
   IS LIKE SO MANY APPROVED SUBURBA BORDER WALLS ... SEARCH THE SYSTEM FOR THAT
   SHIT". I searched. banks/BOHEMIA_WALL_PICKS_7_14_26.txt (inside the GRAPHICS
   VERDICTS MASTER, "the act-1 art authority") holds W26-W37 with 32 killed and
   his direction "85% of Vegas walls are desert yellow tan brick vibes"; batch 2
   added WB4 out of 48. THIRTEEN approved border walls out of 61 judged. And
   banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt has a `paolo_laws` block that
   says VERBATIM: "one_wall_per_community": "each plot = ONE wall design (seeded
   per plot); variety BETWEEN plots; per-cell wall shuffle BANNED".
   THE GAME PICKED THE TILE WITH `hash2(gx,gy,404)&3`. Two violations in one
   expression: the per-cell shuffle his law names and bans, AND the &3 capped the
   roll at four, so only 4 of the 13 could ever be drawn - NINE OF HIS THIRTEEN
   HAD NEVER APPEARED IN THIS GAME. Fixed: the design is seeded per PLOT (the 4x4
   overmap group that makes one 128x128 suburb grid, the same key its layout
   comes from) and saTex mods by the real pool length. Measured after: 11,193
   wall cells across 77 communities, ZERO plots mixing designs, all 13 in use.
   Gate: wallclass_gate.js sweeps the whole valley and proves both halves.
0K. [DONE 7/28, his ruling] THE SUBURB PERIMETER WALL STANDS, FROM ITS OWN POOL,
   AT ITS OWN RESOLUTION. The pool was wired since 7/21; what was broken was
   (a) it drew as ONE FLAT CELL while house facades stood 3 tiles, so the only
   thing that looked like a wall was the house wall, and (b) its 44x44 approved
   tiles were shrunk to 16 with LANCZOS then re-blown x1.375 by the new TPX -
   two resamples on the one asset he passed out of 61 candidates. Now: 2 tiles
   tall (its bank's own stated minimum, shorter than the 3-tile house wall),
   perimeter pool only, native 44x44 (exact x0.25/x0.5/x1/x2 on the zoom
   ladder). Gate: wallclass_gate.js checks the class, the height, the key count
   AND that the embedded bytes are the bank's bytes.
0L. (7/28, STANDING INSTRUCTION for this lane, from him) BEFORE TOUCHING ANY ART
   PATH, READ ITS BANK'S OWN `law` FIELD. The perimeter bank has said "WALL
   HEIGHT MIN 2 TILES" since 7/14; there was a law file AND two verdict records
   AND a bank, and it still drifted for ten days because nothing in the machine
   read any of them. "look in the poject files" - the answer is almost always
   already there and almost always has no gate on it.
0I. [DONE 7/27, his ruling] ONE MOVEMENT UI EVERYWHERE. "on the run should be
   using the same movement ui s the combat shit ... the arrows taking up half the
   screen is dog shit man". The run's #ctl bar was a flex SIBLING of the stage,
   so it did not float over the world, it SHRANK the canvas: 390x602 in an 844px
   viewport. Replaced with the cluster the game already used twice (COMBAT
   buildMoveRing, CITY #nav): 8 cardinals ringing an 80px portrait that IS the
   one contextual action button, floating in the thumb corner. Canvas is 390x795
   now. Four buttons became eight (the run's dirOf/DIRS8 always spoke 8; only the
   buttons were four), with a corner-squeeze rule so a diagonal cannot slip
   between two building corners. bu/bd/bl/br keep their ids for run_gate.
   Gate: navcluster_gate.js, which READS THE PORTRAIT'S PIXELS and fails an empty
   canvas. NO PIXEL COOKED - the face is the alpha's existing baked portrait.
0J. (7/27, discovered, NOT mine) THE RUN'S INTERIOR CAMERA IS OFF-CENTRE: the
   house draws low-right with a large void above it. PRE-EXISTING - confirmed by
   screenshotting the previous build side by side before shipping the nav
   cluster. Whoever owns the run should fix it. | no | screenshot comparison
   7/27 | no.
0H. [DONE 7/27, his ruling, law in laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md]
   THE THREE-TILE WALL AND THE SEE-THROUGH. "every wall supporting a door should
   be three tiles tall ... an opacity filter for when I'm in front of a wall".
   Two asks, ONE mechanism: a wall only gets height by leaving the baked chunk
   (three tiles means drawing into the two cells above, which belong to other
   rows and sometimes other chunks), and the opacity depends on where he is
   standing THIS FRAME, which a bake cannot know. So facades are a live pass
   drawn in two halves around the player: behind him at full opacity, then the
   player, then what stands between him and the camera, faded to 35% only where
   it covers him. A door is 2 of the 3 tiles (DOOR LAW); a window moved UP to the
   middle tile instead of lying on the ground. The tall door is DERIVED ONCE into
   a cached 16x32 tile so no frame ever stretches it - a law does not get to
   break the render contract to implement itself. Gate: wallheight_gate.js,
   which renders two real frames and reads back destination size AND alpha
   (invisible to a normal draw audit), asserting the fade fires when covered and
   does NOT fire when clear. NO PIXEL COOKED - all his own 7/21 house verdict.
0E. [DONE 7/27, diagnosis in records/BOHEMIA_SUBURB_DIAGNOSIS_7_27_26.md] "THE
   DOOR SUCK" WAS A DICE ROLL. Every exposed house tile picked its facade from a
   per-tile hash and 10% of that roll was a DOOR: measured 62 doors across 727
   exposed fronts in 24 real suburb cells, scattered down every wall including
   the 643 that face a dead-dirt backyard with no path to them. The suburb
   generator already marks its driveway apron (3) and its street (1); the door
   now goes where the house meets one of those, one per approach. After:
   17 doors, 17 reachable, 0 on dirt. The generic-district path had the same
   roll and it was worse - those dossiers declare doors as PORTAL tiles you step
   through, so a painted door there is a door that lies; it paints none now.
   Gate: frontdoor_gate.js. NO PIXEL WAS COOKED - it places Paolo's own 7/21
   approved tiles correctly. HIS CALL, NOT DECIDED: 17 doors over 24 cells means
   most homes are entered through the GARAGE (whose dossier says it has a door
   into the house), because that is where the plot's walkable approach goes. Real
   for a Vegas tract house, or he wants a front door on every home.
0F. (7/27, [PENDING Paolo], from the same diagnosis - all TASTE, deliberately
   untouched) (a) The red-brick read is his OWN approved roof art: hroof holds
   exactly the 14 he thumbed UP on 7/21 (roof_shingle_0-5, roof_gravel_6-7,
   roof_stile_21-26), so it is not a wiring bug; a seamless tile has no ridge, no
   slope and no shadow, which is why a roof reads as wallpaper. (b) The facade is
   drawn ONE tile tall while DOOR LAW says two - the interiors obey it and
   interiors_gate byte-locks it, the exteriors do not, so inside and outside
   disagree about the same law. (c) 54% of a suburb cell is dead-dirt yard drawn
   as one flat noise; the share is honest for a real subdivision but it reads as
   a void. Each of these changes how every building in the game looks. | no |
   records/BOHEMIA_SUBURB_DIAGNOSIS_7_27_26.md | YES.
0G. (7/27, FOR THE WORLD LANE, not touched - ONE SYSTEM ONE SESSION) 4 cells of
   7,649 are SEALED: you can drop into them and never walk out. 88,1 solar ·
   92,8 estate · 92,39 suburb · 5,53 gypsum. Found by flood-filling walkable
   tiles from the game's own drop-in point. Belongs with landlocked_gate.js.
0B. (7/27, HIS WORDS, NOT ACTIONED - recorded so nobody re-cooks into a
   rejection) He rejected, in one message: the HOUSES ("the houses aren't
   good"), the DOORS ("the door suck"), the GARAGE ("the garage is suck"), and
   asked whether the house is even built from the approved target art ("is this
   target art"). STOP PRODUCING applies: nobody makes a v2 of any of these until
   he asks. The one thing he DID direct: "you really should be using the suburb
   district" - the suburb generator, which the walked world does already read
   (realizeCell's m.sub path drives off BohemiaSuburb's own legend). What he is
   pointing at is that the RESULT does not look like the district we built, so
   the gap is between the suburb dossier and what actually renders. Diagnose
   before touching pixels. | no new gate until he rules | his message 7/27 | YES,
   blocked on him.
0C. (7/27, [PENDING Paolo]) "the street that I didn't say you could go" - reads
   as a MAP LAW complaint: a street exists that he did not place. MAP LAW says
   Claude never designs map layouts. Needs him to point at which one before
   anything is changed. | no | his message 7/27 | YES.
0D. (7/27, [PENDING Paolo], probably not the CITY lane) "the phone system isn't
   in here, doesn't progress as I walk" - the phone/feed is not reachable from
   the walked world and nothing about it advances with steps. Whose lane that is
   (LIFE/SOCIAL vs CITY) is his call, and so is whether it belongs in the walk at
   all. | no | his message 7/27 | YES.
0b. [DONE 7/27] THE PHONE WAS BLURRING THE WHOLE WORLD ON THE WAY TO THE SCREEN.
   The 7/26 fix above made the world blit 1:1 INSIDE the canvas. The browser
   then undid it: #cv in the city frame never set image-rendering, so it took
   the default `auto` = smooth, and the 378-wide backing store was BILINEAR
   upscaled x3 onto the phone's glass every frame. Not one tile has ever
   reached Paolo's eye at the sharpness it was painted at, and no amount of
   reading render code could show it, because the damage happens after the game
   stops drawing. Second defect on the same element: the stage box measures
   764.61 CSS px while clientHeight rounds to 765, so the whole world was also
   squeezed x0.9995 - a resample of every row for a squash nobody can see.
   Fixed: tools/bohemia_city_screenfilter_patch.py (CSS box sized in explicit px
   to equal the backing store; filter follows MODE - nearest for the walked
   world, `auto` LEFT ALONE for the builder overview, where 13:1 hero
   minifications need smoothing and Paolo likes the surface as it is). New
   instrument: tools/bohemia_canvas_scale_audit.js measures every canvas's CSS
   box and glass scale against its backing store, on every tab. Locked BOTH
   directions by gates/canvas_scale_gate.js.
0c. (measured 7/27, [PENDING Paolo] - a LOOK call, not a bug fix) THE NAV
   PORTRAIT IS A LUMPY x1.25. #modeFace is a 64x64 player frame shown in the
   80x80 mode button: 64 -> 80 is x1.25, so with nearest some source pixels are
   one screen pixel wide and some are two, on a FACE. Every fix is a visible
   change to a surface he did not ask about - show the face at 64 inside the
   80px ring (an 8px rim of the button's gradient shows), or take the ring to
   64. Do not pick one for him. | canvas_scale_gate would lock whichever he
   picks | measured by tools/bohemia_canvas_scale_audit.js | no.
0a. (discovered 7/26) PRE-SCALE THE DISTRICT HEROES. 732 draws per walk push a
   ~266x172 hero image into a ~20x13 slot - a 13:1 minification done every
   frame. Smoothing is the RIGHT call at that ratio so the look is fine; the
   waste is doing it every frame instead of once. Cache one pre-scaled copy per
   hero per zoom: identical output, a fraction of the work. | render_pixel_gate
   ratchet on the smoothed count once it drops | the city-builder overview is a
   surface Paolo LIKES - identical output or do not touch it | no.
1. [BLOCKED ON THE TARGET PICK] DRESS THE INTERIORS. Paolo killed the first
   interiors ("Dogshit.") and the diagnosis is empty rooms: the shell is lawful
   approved art but it is five textures and no furniture. The furniture is ready
   (banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, UP-only, bucketed by room function)
   and the role->bucket mapping is written in
   records/BOHEMIA_INTERIOR_KILL_AND_THE_SWEEP_CROSSING_7_26_26.md. Do NOT wire
   it before the target screen is approved - that is the freeze, and dressing
   rooms from loose tiles against no reference is what the reset exists to stop.
   | interiors_gate extended: the pool is UP-only and every drawn tile traces to
   a UP verdict | the shell/mechanism is done, do not re-litigate it | yes - the
   dressed room is judged as an assembled scene, per TILESETS-ARE-SETS.
-1. [DONE 7/26, CITY] THE CITY TAB DREW WORLD ART SMOOTHED. It never set
   imageSmoothingEnabled at all, so it took the browser default (true) and
   bilinear-filtered every approved tile - worst on 3x phones. Fixed at the
   SOURCE (tools/bohemia_city_tab.py), both at context creation and inside
   fit(), because assigning cv.width/cv.height resets the entire 2D context
   state and silently turns smoothing back on. The ART lane's PIPELINE_DEBT
   exemption in target_screen_gate.py is DELETED per its own terms; that gate
   now holds every surface to the contract with no exceptions (484 checks).
2. MARRY COMMERCIAL (discovered, CITY 7/26). The corner plaza has NEVER been
   registered with the district kit (it never binds K, and the registration sits
   behind a `typeof K` guard that silently swallowed it), so the walked city
   still renders commercial from the LEGACY PREFAB STAMPS — not the canon plaza,
   nothing enterable. Binding K is one line and turns walkable_gate RED: on a
   single W or N street the generator builds only ONE store strip and parking
   fills the rest (drive 61% vs content 30%). Fix the mid-block/single-edge form
   FIRST, then bind K. Full numbers in the module's own head comment + records/
   BOHEMIA_INTERIORS_EVERYWHERE_7_26_26.md. | walkable_gate green with commercial
   swept + interiors_gate proves a plaza store is enterable | the S/corner form is
   approved, do not reshape it | the mid-block plaza form is [PENDING Paolo] per
   the module's own NOTES — surface it as rendered candidates, do not pick one.
3. GARAGE + CRYPT INTERIORS IN THE ALPHA (discovered, CITY 7/26). The engine
   DISPATCHES a building's interior by kind (garage -> multi-deck parking, crypt
   -> vault hall, everything else -> rooms) and world_gate proves it. The alpha's
   STEP-INSIDE renders the ROOMS kind only, so walking into a parking structure
   or a mausoleum gets you a floorplan instead of decks/vaults. Embed
   bohemia_garage.js + bohemia_crypt.js in CITY_B64 (resync tool exists now) and
   branch the render the way the engine branches. | interiors_gate extended to
   assert all three kinds render | engine dispatch is correct, do not touch it |
   the deck/vault LOOK = judge before volume.
4. Interiors everywhere: DONE 7/26 (records/BOHEMIA_INTERIORS_EVERYWHERE_7_26_26
   .md). Left standing: THE UNDERGROUND behind wash's sewer tunnel mouth is a
   LIFE-lane below-grade level, not a room in a footprint. [PENDING — LIFE lane]
5. District volume: next Pocket-City-type gaps that fit the dead world, on
   the KIT, full touchpoint list per the architecture map. | per-district gate
   x6 configs | bespoke strip/casino (Paolo's hand) | new district LOOK =
   judge before volume.
6. (discovered, coordinator 7/25) RIG_B64/PREFAB_B64 byte-lock holes + sync-
   canon gaps (PLOTGEN/POWERGRID/FLOORPLAN/TRANSITIONS). NON-COOK item. |
   new byte-lock gates registered | — | no.
   (CITY 7/26 note: tools/bohemia_city_module_resync.py now re-syncs every
   engine module inlined in CITY_B64 and `--check` reports staleness, which is
   the freshness half of this item for the CITY app. It caught commercial +
   suburb + district_kit all silently behind. The remaining half is the same
   treatment for RIG_B64/PREFAB_B64.)

## COMBAT
1a. (discovered 7/26 by COMBAT, NOT ours to fix) THE RENDER PIXEL GATE IS FLAKY.
   It drives a live WALKING CITY and measures whatever draws happen, so the draw
   count swings ~19.8k-22.8k run to run. It failed once at 12.4% half-pixel draws
   against a 6% ratchet, then passed 4/4 on six consecutive runs (three on clean
   main, three with the same working tree that failed). A gate that can red-flag
   any lane at random will eventually get ignored, which is worse than no gate.
   Suggest: average N runs, or drive a FIXED deterministic route instead of a
   timed walk. Owning lane: ART/render. | — | gates/render_pixel_gate.js | no.
0. DONE 7/27 (v87): THE ORANGE WAS THE STREAK GLOW, AND THE PAUSE IS NOW EMPTY
   BY LAW. Sixth report. Five reproductions found nothing for one reason: EVERY
   PROBE I EVER WROTE KILLS ONE MAN, AND PAOLO PLAYS WHOLE ENCOUNTERS. Chain
   escalation only draws at killStreak>=2. It is a FULL-SCREEN rgba(255,60,40)
   radial wash, brightest at the screen EDGE, which is where the dial sits --
   which is why he named the dial and why I kept measuring the dial's arcs and
   correctly finding them at zero.
   MEASURED at a 3-streak, off the colour stop the game really asks for:
     +  875ms  ks.t=0.871  freeze=0     alpha=0.199
     + 2284ms  ks.t=0.969  freeze=HELD  alpha=0.190   <- 1.4s, 0.009 of fade
   AND IN PIXELS, freeze frame, outer 12% of screen:
     before rgb(70.8,53.1,42.4) 380 warm px | after rgb(25.7,24.8,31.0) 0 warm px
   (a) THE GLOW blooms and leaves: one beat (JUICEMS.streak), wall clock, and it
   does not draw during a stop.
   (b) THE INSTRUMENT IS NEVER ON SCREEN DURING A STOP: _df, the one alpha owning
   the whole dial, is 0 while frozen. Safe because the demo already resets
   globalAlpha to 1 before drawKillshotWorld.
   (c) WHAT'S ON SCREEN v2: it could never have found this -- fills only, 2% size
   floor, and a gradient stringifies to "[object CanvasGradient]". Now watches
   strokes and gradient colour stops and keeps anything WARM at any size.
   HARNESS LESSONS, both earned: reproduce at the STATE HE PLAYS IN, not the
   cheapest state that runs; and THRESHOLDS HIDE BUGS -- five pixel scans tested
   r>100 while the wash composites to rgb(72,31,24). It was in every screenshot.
   LAW: laws/BOHEMIA_ADDENDUM_THE_PAUSE_IS_EMPTY_7_27_26.md
   Gate section 22, 390 checks.
0-storey. DONE 7/27 (v90+v90b): TWO-STOREY ARENAS. On his ruling, "Two-story
   arenas yes", asked for by name twice before that.
   *** THE ONE RULE: ACROSS LEVELS, GROUND COVER DOES NOT COUNT, FOR EITHER OF
   YOU. *** From the deck you shoot men who thought they were behind stone; from
   up there you are behind nothing yourself. Physically true, one condition in one
   function, and the SAME SHAPE as the point-blank trade he ruled on: better odds
   to kill, worse odds to live.
   IT OBEYS BOTH HIS RULINGS. No damage multiplier -- KILL_DMG is untouched and
   gated as untouched. Height changes WHO IS EXPOSED, which is odds. And it is the
   first thing in the game that changes what you DELIVER by moving, which is the
   exact gap the north-star audit named.
   MEASURED, arena #70368 (6-tile deck, 2 men on it, 15 ground cover):
     from the ground  cover working against you: 0   clean lines on you: 7
     from the deck    cover working against you: 1   clean lines on you: 6
   (a) THE DECK is world-anchored tiles like the pillars, so worldShift already
   carries it and every coordinate function already understood it. Rolled by the
   ARENA SEED -- including WHETHER there is one (72%), so "flat lot or high
   ground" is itself a difference between arenas.
   (b) STAIRS: the closest deck tile to you, always walkable-to. ONE STAMINA, NO
   TURN (Paolo 7/26 LOCKED, and his own words: "sprinting and not losing a turn
   can help that"). Taking the high ground is priced like closing the distance.
   (c) A BLADE CANNOT REACH A FLOOR ABOVE IT. Not a balance number, an arm.
   (d) LEVELS DRAW RELATIVE TO YOU -- the deck floats above the lot from the
   ground and becomes the floor under your feet once you climb it. ONE SCENE.
   (e) THE READ says HIGH GROUND / HE IS ABOVE YOU and says the loud part: every
   piece of stone on the lot just stopped counting.
   *** TWO ANCHOR BUGS I CAUGHT MYSELF, SAME ROOT CAUSE. *** v1 anchored the deck
   placement on "updateGeomCover(); renderBoard();" -- UNIQUE, and inside
   doSuppress(), so the deck placement ran inside the SUPPRESS verb. v2 anchored on
   "G.e.push(e); } }" whose "} }" closes the LOOP *and* the FUNCTION, so the block
   landed OUTSIDE the builder as module-level dead code that ran once at load.
   *** ANCHOR UNIQUENESS IS NOT ANCHOR CORRECTNESS. Check the brace depth and check
   WHICH FUNCTION the line is in. *** Both were caught by probing the live game
   (deck generated, 0 men on it), not by reading.
   AND THE FIRST RENDER FAILED THE EYE: the storey face was #3e372c and the deck
   read as a lighter PATCH OF GROUND, not a thing with a height. Value contrast IS
   the height cue: the face is near-black now against the lot.
   FIVE OLDER GATE CHECKS string-matched the two-arg myCoverAgainst signature. All
   re-pointed at the invariant, never relaxed.
   *** WHAT THIS IS NOT: one deck, not a building. No rooms, no interiors, no roof,
   no third floor, no ladders, no vaulting off the edge. Each is separate and each
   is [PENDING Paolo]. This is the smallest thing that makes two storeys a real
   decision, shipped to be judged before anything is stacked on it. ***
   Gate section 26, 441 checks.
0-arena2. DONE 7/27 (v89): THE GENERATOR ONLY EVER MADE ONE ARENA. Paolo on v88:
   "I dont see new arenas shit was boring if u did anything." He is right twice.
   MEASURED on v88, six arenas back to back: 6,5,7,7,6,7 pieces, mean spread
   5.79-6.70, and r=0.55 for EVERY piece ever placed since the demo shipped. That
   is ONE arena with the dots moved. v88 handed him dice and a notebook for a
   generator with one brick in it, then told him to go find arenas worth keeping.
   AFTER: 6,4,13,15,11,13 pieces, radius 0.45-1.15, with runs.
   (a) DENSITY IS A REAL RANGE: 2-15, not 5-7. A five-to-seven swing is a rounding
   error the eye cannot see, which is exactly what he could not see.
   (b) COVER HAS A SIZE. The existing cover maths already scaled off P.r in every
   place it is used (myCoverAgainst, realCoverPillar, segNear, the dash-path
   block), so nothing needed rewriting -- the number was simply never allowed to
   vary.
   (c) PIECES CLUSTER INTO RUNS, so WALLS and CORNERS emerge from the same circle
   maths that already ships. A wall is three pillars in a row and every cover
   function already understands three pillars in a row: no new geometry, no new
   collision, no new cover rule. This is the first time the ground has ever argued
   for approaching from a particular side.
   (d) "I DONT SEE" WAS ALSO LITERAL: the ARENA button rendered blank until the
   first tap (updArenaBtn only ran inside the click handler), so one control in a
   row of eleven said nothing about itself. It labels itself on startup now.
   MAP LAW HELD: density, size and clustering are PARAMETERS. No layout authored,
   no arena named. The seed decides what the vocabulary says; which arenas are
   canon is still only his call.
   AND THE GATE CAUGHT ME: three older checks string-matched the OLD generator
   (one of them matched a COMMENT). A comment was never the invariant -- they are
   rewritten to assert the rounding itself on BOTH placement paths, which is
   strictly stronger than what they tested before.
   *** STILL NOT WHAT HE ORIGINALLY DESCRIBED: this is barrels on a flat lot. He
   asked for "two stories where their stairs" and "an actual arena map". Verticality
   and rooms are a different, bigger build and [PENDING Paolo]. ***
   Gate section 25, 423 checks.
0-arena. DONE 7/27 (v88): THE PROVING GROUND. On his ask, "maybe its time to add a
   shuffable arena map fr", plus two rulings in the same message.
   *** RULING 1: NO DAMAGE MULTIPLIERS. *** "theres not a lot of ways to increase
   damage other than hit the killshot." Position does not make the number bigger,
   it makes the killshot LANDABLE. That kills flank-damage, elevation-damage and
   every other multiplier before anyone builds one. Gated.
   *** RULING 2: POINT BLANK IS THE OFFENSIVE PLAY, sprint is how you get there.
   AND IT WAS ALREADY BUILT, JUST INVISIBLE. *** distPkg drops the needle to the
   EASIEST tier in the game at point blank on any difficulty; distAccuracy takes
   their hit chance on you from 0.37 to 0.97. Complete shipped risk/reward that no
   player was ever shown. My 7/27 audit called it "the wrong way for tension" -- he
   corrected me, it IS the tension. Audit corrected in place.
   (a) SEEDED ARENAS. BohemiaArena.withDice() runs the whole encounter build on a
   deterministic PRNG then hands Math.random straight back (gated, including on a
   throw). One number reproduces one exact fight forever. MAP LAW held: the
   generator is WRAPPED, not rewritten -- Claude authored no layout. This is the
   MAP LAW hook made literal: I hand him the dice and the notebook, HE says which
   arena numbers are canon.
   (b) SHUFFLE. One button, ARENA #4417. Re-rolls cover and spawns WITHOUT touching
   HP or streak, so a dozen arenas cost a dozen seconds instead of a fight each.
   Writes the seed into the comment box (COPY is already beside it) and reads a
   number back OUT of the same box to replay an arena. Zero new UI.
   (c) THE RANGE READ. Both halves of the trade on one line, always on, computed
   from THE SAME expressions the fight runs so it cannot drift:
     at  3 tiles: POINT BLANK · his dial: EASY   · he hits you 97%
     at 30 tiles: LONG RANGE  · his dial: V.HARD · he hits you 37%
   BUG THE CLICK TEST CAUGHT AND THE GATE NOW HOLDS: writing the seed OUT into the
   comment box poisoned the read back IN, so SHUFFLE locked to the first arena and
   only ever shuffled once. Three taps gave one arena. The box is a request only
   when PAOLO put the number there.
   NOT BUILT: COMPANIONS. He said "maybe?" and it carries a dozen unruled decisions
   (who they are, what they cost, whether they can die, whether you order them).
   The arena is what they get tested IN, so it came first either way. [PENDING]
   Gate section 24, 413 checks.
0-northstar. *** THE COMBAT NORTH STAR, PAOLO 7/27, LOCKED. *** Asked what makes a
   fight fun for him: "the strategy choice to deal the most damage and take the
   least amount of damage by positioning and abilities and deeper understanding of
   mechanics. gameplay. feeling snappy and violent and human and fun."
   LAW: laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md
   THE TEST EVERY COMBAT ITEM NOW PASSES OR DIES: does it change how much damage I
   DEAL or TAKE, through POSITION, SPEND, or KNOWLEDGE? If no, it is not a combat
   feature and it never leads a pick-list.
   AUDIT OF THE SHIPPING DEMO AGAINST IT, with the real numbers:
   records/BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md
     TAKE LESS DAMAGE BY POSITION: IMPLEMENTED, strongly, but BINARY. Cover is a
     predicate incoming fire FILTERS on -- an enemy you have cover against is
     removed from the volley entirely, 0% or 100%, never a modifier. Range is a
     real curve on top: 0.97 accuracy at point blank to 0.37 at long, a 2.6x swing.
     DEAL MORE DAMAGE BY POSITION: *** ABSENT. *** KILL_DMG=100, flat, from
     anywhere on the map. No flank, no angle, no point-blank lethality, no
     elevation, no positional term ANYWHERE in the player's damage path. The dial's
     band widths scale on difficulty, steady aim and streak, never on where you
     stand. Range touches only WHICH PATTERN you get (distPkg) -- execution, not
     damage -- and it points the wrong way: the safest place is also the easiest to
     shoot from.
     ABILITIES: 7 verbs on 3 pips, no turn cost. A real spend economy, well shaped.
     But move/dash/vault/sprint/suppress/shove are ALL DEFENSIVE. Only the grenade
     touches your output. Nothing can be spent to hit harder.
     UNDERSTANDING: the strongest leg and the quietest -- patterns, band widths,
     lethality gates, cover geometry, readable fire cycles. Mostly unlabelled,
     which is a LEGIBILITY problem, not a missing mechanic (same shape as the
     three-times SUPPRESS complaint).
   *** THE ONE ASYMMETRY: POSITION CONTROLS WHAT YOU SUFFER AND NOTHING ABOUT WHAT
   YOU DELIVER. *** So moving is housekeeping, not offence, and the ground never
   argues for attacking from a particular place. WHAT SHAPE THE ANSWER TAKES IS
   [PENDING Paolo] -- flanking, elevation, point-blank lethality, exposure windows
   and angle-of-fire are each a DIFFERENT GAME. Mechanism is mine, the ruling is
   his. Nothing built, nothing pre-selected.
   Gate section 23 PINS THE AUDIT TO THE LIVE CODE (damage constant, accuracy
   curve, distance bands, the binary cover predicate, the stamina ceiling, and the
   headline finding that no positional term multiplies player damage). Change the
   model and the gate fails, which forces the audit back into line the same turn.
   399 checks.
0-kill. *** THE TALLY IS DEAD, KILLED AT THE PITCH, NEVER BUILT (7/27). ***
   Paolo: "this was terrible i hated this this was not a gameplay mechanic this is
   more data to be proud of no one gives a fuck."
   His diagnosis IS the failure. A tally changes NO decision the player makes -- it
   happens after the outcome is already fixed, so it is a presentation layer
   wearing a mechanic's clothes, pitched in answer to "make combat more fun".
   ROOT CAUSE: the research doc had six items, five of them mechanics and one pure
   presentation, and I ranked them by how impressive the RESEARCH was instead of by
   whether they change what the player DOES. Same failure as the 7/20 queued-actions
   grammar kill: "research ranks candidates, only PLAY decides." Second time.
   *** THE LANE RULE THIS LEAVES: IF IT DOES NOT CHANGE A DECISION THE PLAYER
   MAKES, IT IS NOT A MECHANIC. *** Ask it BEFORE an item goes on a list. Anything
   after the outcome is locked -- tally, grade, summary, stat, badge, receipt -- is
   FEEDBACK, and it never leads a pick-list again.
   Graveyard + post-mortem: records/BOHEMIA_TALLY_KILL_7_27_26.txt.
   NOT DEAD: the existing receipt (untouched), and research items 2-6 (never
   judged). Scoring presentation is ENDED as a subject for this session per
   STOP PRODUCING. Nobody re-pitches it.
0-research. RESEARCH DELIVERED 7/27 on his ask ("big brain research... addictive
   juicy sauce"): records/BOHEMIA_COMBAT_RESEARCH_THE_ADDICTIVE_SAUCE_7_27_26.md
   HEADLINE: Bohemia is a casino game that does not pay out like one. Balatro's
   engine is not the poker, it is THE TALLY -- the score assembling itself one
   element at a time with pitch and speed climbing. Bohemia already owns every
   part (receipt, wager, gold chips, kill streak, graded press) and spends none of
   them, and it has the one thing Balatro has to fake: a 120 BPM grid. A payout
   that lands each element on a sixteenth IS a drum fill.
   RANKED, ALL [PENDING Paolo]: 1 the payout is a drum fill, 2 THE BANK
   (push-your-luck on the wager he already invented), 3 enemy intent on by
   default, 4 the optional beat counter (Hi-Fi Rush's accessibility answer),
   5 the district remembers, 6 the kill cam earns its length from the stake.
   AND THE WARNING EVERY SOURCE AGREES ON: layered rewards must not compete for
   the same second. He said it himself about audio on 7/26; v87 proves the same
   failure existed visually.
0. DONE 7/27 (v86): THE REST OF THE JUICE PASS, ON THE GRID. Item 1e's leftovers,
   built while he slept because they are the lane's top item that needs NO verdict
   ("no" thumbs, his own pick-list, his standing word "I want more juice").
   Auditing them first turned three of five into BUGS, and the MEASURING turned up
   two more the writing had missed.
   (a) THE SHOT FLASH WAS FRAME-COUNTED: flash-=0.08 PER FRAME = 208ms at 60Hz and
   104ms on his 120Hz phone. Not a duration, a refresh rate. Same defect class as
   the frame-counted hit-stop v81 killed, sitting untouched in a second place.
   (b) THE KILLSHOT PUNCH WAS A FRACTION OF ks.dur: the same white ran 0.167s
   behind a clean kill and 0.375s behind a sharp one.
   (c) AND THE ZERO WAS WRONG TWICE, both caught by the probe not by Paolo: keyed
   to ks.t the hit-stop PINNED it (measured 633ms of white); keyed to G._ksAt it
   never drew at all, because the HELD BREATH runs first and driveKillshotCamera
   early-returns through the whole thing. G._ksGo = the first frame the cinematic
   actually draws. Measured after: clean 91ms, sharp 115ms.
   (d) RECOIL comes home ON the next sixteenth (was dt*4.5 = 0.222s, between two
   notes). Measured 130ms. (e) THE HELD BREATH was 0.12 against a sixteenth of
   0.125 -- 4% off the grid. (f) PERMANENCE: the brass cap was 14, so the
   fifteenth casing silently deleted the first; now 96, still bounded, still
   cleared on a fresh fight. (g) THE IMPACT THROWS ALONG THE SHOT: twelve
   particles at k/12*6.28 is a perfect circle, the one shape a real impact never
   makes; now x1.30 down-range against x0.45 behind.
   NOT SHIPPED ON PURPOSE: THE CAMERA THAT LEADS. Every other item is a defect
   with a right answer; camera lead is a FEEL call with a dozen, and picking one
   while he is asleep is what STOP PRODUCING forbids. Stays on his pick-list.
   LAW: laws/BOHEMIA_ADDENDUM_EVERY_DURATION_IS_A_NOTE_7_27_26.md
   Gate section 21, 381 checks.
0. DONE 7/27 (v85): THE BROWN BOX AND THE ORANGE ONE, NAMED IN A CAPTURED FRAME
   AND BOTH DELETED. Five reports, five misses, then a reproduction first.
   scratchpad/spot.js: hook fillRect + drawImage + arc/fill + arc/stroke, convert
   every draw to SCREEN space via ctx.getTransform(), let the cinematic RUN, dump
   everything landing on the body at the frozen frame. It answered in one run:
     THE BROWN BOX   fillRect rgba(70,60,50,0.984) @197,272 42x50
     THE ORANGE ONE  arcFill  rgba(255,200,70,0.55) @197,237 9x9 + glow
   (a) THE BROWN BOX = drawKillshotWorld's LEGACY_PRE_REVAMP stand-in body. Its
   alpha is 1-ip*0.8 and ip=0 at contact, so it is a SOLID slab, and the freeze
   holds ks.t still so it stayed solid for the whole pause. DELETED.
   (b) IT WAS ALSO THE HEADSHOT ANSWER (0b, asked three times). Its own comment
   said so since 7/3/26: "still drops/fades ON TOP of the real sprite death
   playing underneath ... delete at cleanup." A 12-frame clip, three rolled
   variants, contact-timed, playing correctly, invisible under a placeholder.
   (c) THE ORANGE ONE = the JUICE.T gold payout chip. Spawns AT contact, flies on
   p.t, p.t rides dt, dt is 0 while frozen -- so it hung on the corpse for the
   whole pause. It no longer draws during a freeze: the stop belongs to the kill,
   the reward comes after it.
   (d) THE STOP IS A STILL, AND THE PAUSE IS PAID BACK. visNow() pins the body's
   clock during a freeze; every body timestamp then advances by exactly the frozen
   duration on release, or the clip snaps forward and the drop you paused FOR is
   the part that gets skipped (measured: frame 0 held, then straight to 4 of 12).
   LAW: laws/BOHEMIA_ADDENDUM_REPRODUCE_BEFORE_YOU_FIX_7_27_26.md
   Gate section 20, 368 checks.
0-prev. DONE 7/27 (v84): THE BROWN BOX + THE ORANGE, BOTH NAMED AND BOTH FIXED, and
   the instrument built so it never costs three turns again.
   (a) The brown box was a REGRESSION I CAUSED: v82 pinned _bpmPhase during the
   freeze, which pinned the JUICE.B floor pulse, which welds a full-screen
   orange-brown faction-accent wash on for the whole pause. The pulse no longer
   draws while frozen.
   (b) The orange was NEVER THE DIAL - it is the road's double-yellow median
   (rgba(184,160,40), 2x2670, ten times per pause), drawn AFTER the vignette that
   was supposed to dim it. Markings and lane dashes now fade with the shot.
   (c) WHAT'S ON SCREEN? - arm it, get a kill, the game names every draw covering
   >2% of the canvas into the comment box next to COPY.
   HARNESS LESSON: my probe kept freezing the game to photograph it, which stopped
   the cinematic it was measuring. Let it RUN and screenshot at 60ms.
   Gate section 19, 359 checks.
0a. UNBLOCKED 7/27 by v85 above -- the reproduction landed and both objects were
   named in a captured frame. History kept because the process lesson is the
   valuable part. WAS: *** BLOCKED. THE BROWN BOX + THE ORANGE DIAL ARE STILL ON
   HIS SCREEN AFTER THREE ATTEMPTS (v81/v82/v83). *** Post-mortem:
   records/BOHEMIA_COMBAT_POSTMORTEM_AND_RESEARCH_3_7_27_26.md
   The deploy DID land (8dcb1247 SUCCESS); the fixes were simply wrong. Root
   cause: THE KILL CINEMATIC CANNOT BE DRIVEN HEADLESS, so every fix was reasoning
   about code that was never watched running.
   DO NOT SHIP ANOTHER FIX FOR THIS WITHOUT A REPRODUCTION FIRST.
   HARD EVIDENCE captured by hooking CanvasRenderingContext2D.prototype during a
   killshot: rgba(184,160,40) drawn 108x as 2x2670 strips on cv = the orange dial
   parts, drawn OUTSIDE the _df alpha block. That is why tightening _df did
   nothing. Promising, NOT proven, NOT shipped.
   THE UNBLOCK (his call, neither built):
     (a) DEBUG CAPTURE in the build - during the freeze, name every draw covering
         >2% of the screen and print it in the combat log. One tap, he sends the
         text, the guessing ends for this and every future visual bug. Few lines.
     (b) A TEST HOOK that makes the killshot drivable headlessly, so this class of
         bug is reproducible forever.
0b. DONE 7/27 (v85), AND IT WAS NEVER A COOK. HEADSHOT 1 + HEADSHOT 2: the death
   clips already existed (L.death, 12 frames, three rolled variants, contact-timed
   off _deadAt). They were INVISIBLE because the LEGACY_PRE_REVAMP placeholder slab
   was drawn on top of them every killshot. Deleting the slab started the animation.
   STILL OPEN AS A JUDGE ITEM: he has never SEEN these clips, so the fall itself is
   UNJUDGED. If he wants a different fall, that is a fresh cook under LEAF-PIXEL +
   RIG + 45-DEGREE law -- but do not cook one before he has looked at the one that
   was already there.
0c. *** SUPPRESS - THIRD TIME HE HAS SAID IT IS CONFUSING. *** Research: XCOM's
   suppression confuses XCOM players too; its value "isn't self-evident" because
   both its effects are invisible until after the enemy acts. THE FIX IS NOT MORE
   MECHANICS, it is a LEGIBLE PROMISE sayable in ONE SENTENCE and shown ON THE MAN
   rather than in a readout. If the current version cannot be said in one
   sentence, that is the defect. [PENDING Paolo] what the promise is - three asks
   means he wants a RULE, not another tweak.
1b. DONE 7/26 (v83): THE BROWN BOX + THE DIAL THAT WOULD NOT LEAVE. From his
   screenshot. (a) The brown quad was #6c503b, traced to two LEGACY_PRE_REVAMP
   placeholder body blocks (brown torso rect + head square) from before real
   sprites existed; the killshot magnified them through the board zoom and the
   kill camera into a slab covering the frame. DELETED; a missing sprite draws
   nothing and logs it. (b) The dial's fade was a flat 350ms while a sharp shot
   contacts at 90ms, so it was 74% VISIBLE at impact. Now derived from the
   bullet's own travel time, zero at contact, every style and duration.
   Gate section 18, 346 checks.
1c. *** [PENDING Paolo / ART LANE] THE GETTING-SHOT ANIMATION CATEGORY. He said:
   "this would also be a great time to start the headshot fall animation and
   whatever category of animation we put towards people like getting shot." NOT
   STARTED - it is a COOK and it needs a declared category list plus his eye, not
   a guess. Governed by LEAF-PIXEL LAW (structure frozen, leaf only), RIG LAW
   (painted regions sacrosanct) and the 45 DEGREE LAW. The demo already rolls a
   _deathVar (3 variants) and has fall/land timing hooks (fallLanded, landDust),
   so the PLUMBING exists and what is missing is the named set of reactions:
   headshot drop, gut fold, spin, knocked-back, stumble-and-catch. HE NAMES THE
   SET. | leaf_pixel_gate + combat_anim_gate | combat demo | yes (thumbs).
1d. DONE 7/26 (v82): THE FREEZE HE COULD NOT FEEL - TWO DEFECTS, BOTH FIXED.
   (a) The killshot contact fired the WEAPON tier (0.125s) instead of KILL
   (0.500s); freeze('kill') only ever fired from finishHim and from your own
   death. (b) The freeze stopped the SIM but not the PICTURE - 27% of the screen
   was still changing because _bpmClock rides the AUDIO clock and drives the bob,
   floor pulse and kick pulse. The visual beat clock is now pinned; the audio is
   not. Measured clean: 43.67% of the screen changes while a killshot runs, 0.06%
   while frozen. GATE LESSON RECORDED: section 17 checked the TABLE and never the
   PATH. It now tests the path. 339 checks.
1e. DONE 7/26 (v81): THE QUANTIZED FREEZE - pick-list item 2, on his word
   ("Lets freeze the game for that snappy satisfying feelings then"). Law:
   laws/BOHEMIA_ADDENDUM_THE_QUANTIZED_FREEZE_7_26_26.md. Every freeze is a NOTE
   VALUE derived from BEAT (1/16 graze, 1/8 hit, 1/4 KILL = one whole beat, 1/2
   last man). A killshot is a REST IN THE MUSIC. Directional shake decays INSIDE
   the freeze. ONE arming function, named tiers only.
   *** AND IT UNCOVERED A REAL BUG: the old hit-stop counted FRAMES, so every
   impact in the game was running at HALF WEIGHT on a 120Hz phone, which is what
   Paolo has been judging feel on. ***
   Gate section 17, 335 checks, and the invariant REJECTS the old frame counts.
   STILL OPEN FROM THE JUICE PASS (item 2 of the pick-list is only PARTLY done -
   the freeze and the shake landed, these did not): PERMANENCE (casings, impact
   scars and blood persisting for the encounter - Vlambeer rates it top-tier and
   it is nearly free), 1-2px RECOIL/KICKBACK snapping back on the next 16th,
   MUZZLE FLASH + a directional impact burst, a CAMERA THAT LEADS the shot, and a
   ONE-FRAME FLASH reserved for killshots only. All cheap, all quantized, no
   rules change. | gate: every juice duration is a note value | combat demo | no.
1g. *** THE MERGED COMBAT PICK-LIST (both research docs, ONE order). ALL
   [PENDING Paolo] - he picks, then I build. Docs:
   records/BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md (part one) and
   records/BOHEMIA_COMBAT_RESEARCH_JUICE_VERTICALITY_COMPANIONS_7_26_26.md. ***
   1 THE PROVING GROUND - one GREYBOX arena as an INSTRUMENT not a level:
     two-storey block + stairs + open ledge, hard and soft cover, a long lane, a
     tight room, an open middle, dials for enemy archetype/count, and a toggle
     per juice effect so any one can be A/B'd alone. He asked for this by name
     ("an actual arena map where we test out different AI and the feel of it").
     HIGHEST LEVERAGE: it makes every other item judgeable instead of arguable.
     | gate: the arena exists, every element present, every toggle independent |
     combat demo | Paolo plays = the verdict.
   2 THE JUICE PASS, QUANTIZED - hitstop as a NOTE VALUE (1/16 graze, 1/8 hit,
     1/4 killshot, 1 bar last-man-down) so the freeze IS the 120 BPM clock and a
     killshot is a rest in the music; PERMANENCE (casings, scars, blood stay);
     1-2px recoil snapping back on the next 16th; directional shake decaying
     INSIDE the hitstop; muzzle flash + directional impact burst; camera lead;
     a one-frame flash on killshots ONLY. | gate: every juice duration is a note
     value, no exceptions | combat demo | no.
   3 ENEMY INTENT ON BY DEFAULT (part one item 1). FORESIGHT stops being the
     source of intent and buys something else. | gate: intent shown every turn |
   4 SHOVE AS A REAL ONE-TILE PUSH with collision damage (part one item 4).
     Becomes DEFENESTRATION the moment floors exist. | gate: push resolves
     against occupancy, collision damages both |
   5 AI ARCHETYPES WITH RHYTHMIC SIGNATURES - archetype-specific utility
     FUNCTIONS (not weight tweaks) + a musical tell per archetype (downbeat /
     offbeat / every other bar / reactive). | gate: each archetype's action
     lands on its declared note value |
   6 COMPANIONS ON STANCES - HOLD / PUSH / COVER ME / GET OUT, set once, one
     tap, NEVER per-turn (micromanagement is the named killer), ally acts ON THE
     BEAT. Foundation already RULED (item 0, ally spawn/target/down-never-dead).
     WHO they are and what they say is [PENDING Paolo], contents his.
   7 TWO AND THREE STOREY COMBAT - stairs as chokepoints (one-body-per-cell is
     already law, so a man on a stair is a cork), height beats cover and exposes
     you, ledges drawn honestly (XCOM 1's trap-slopes are the warning). The
     LAYERING law + INTERIOR-MATCHES-EXTERIOR already speak multi-storey; only
     combat does not. HIGH cost, biggest change.
   8 TURN CLOCK = THE SONG'S FORM (part one item 0) - 5 turns, turn N = section
     N, reaches the 0:48 payoff every fight without costing the NEW ENCOUNTER
     song change. Real rules change, HIS call.
1f. [LOGGED 7/26, HE SAID DO NOT CONTINUE] PULSE VOICES sound "elementary school
   hi-hat metronome shit". They borrow each song's kit by design (v75) - which
   worked for sounding like the record and failed for sounding like a fight. The
   answer is a DEDICATED COMBAT PERCUSSION BANK (casings on concrete, boot on
   gravel, door slam backbeat, distant generator). That is a COOK: needs a REUSE
   CHECK against banks/ and HIS ear before a voice is drawn. Do not start it
   until he says. | reusefirst_gate + song_lock | combat demo | yes (thumbs).
1i. DONE 7/26 (v80): SOFT THE WHOLE FIGHT + THE HEADROOM TRIM. Paolo retired his
   own v79 top rung ("forget about it going hard at five kills... a lot of volume
   fighting each other"). HARD_AT=Infinity; AUTO is SOFT forever; his 2/4 rungs
   carry the climb. The volume complaint was measured (16.2 -> 24.2 -> 41.8
   voices/bar, ~+4.1dB into one master with no trim in front of a -14dB limiter)
   and fixed the way a mix engineer would: the master trims 1.00/0.82/0.68 as the
   rungs land, ramped, reset per fight. Net +0.8dB instead of +4.1dB. Master gain
   ONLY - no note, voice or pattern touched. Gate section 16, 316 checks.
1h. *** RESEARCH ON THE SHELF, NOTHING BUILT, ALL [PENDING Paolo]: ***
   records/BOHEMIA_COMBAT_RESEARCH_TURN_BASED_GRID_7_26_26.md - six games (Into
   the Breach, Slay the Spire, XCOM 2, NecroDancer, Divinity OS2, game-feel
   literature), seven ranked ideas, sourced. Top three:
   (a) QUANTIZED HITSTOP: freeze for a NOTE VALUE (1/16 graze, 1/8 hit, 1/4 on a
       killshot) so the impact freeze IS the 120 BPM clock instead of breaking
       it. Cheap, no rules change, biggest feel-per-hour. | gate: every freeze
       length is a note value | combat demo | no.
   (b) ENEMY INTENT ON BY DEFAULT: ITB/StS are built on perfect information;
       Bohemia has it as a perk (FORESIGHT), off. Cheap, UI job. | gate: intent
       shown for every enemy every turn | combat demo | no.
   (c) THE TURN CLOCK = THE SONG'S FORM: ITB fights are 5 turns then the enemies
       retreat. A fixed turn count is a fixed number of BARS, so turn 1 = section
       A ... turn 5 = section D. Reaches the 0:48 payoff EVERY fight without
       persisting anything and without costing the NEW ENCOUNTER song change -
       the v76 problem solved from the other end. Real rules change, HIS call.
   ALSO: widen the timing windows (NecroDancer shipped ~100% leeway because the
   challenge belongs in the TACTICS, not the timing - a warning aimed at my
   55/110ms grades); make SHOVE a real one-tile PUSH with collision damage
   (ITB's best verb is displacement); ENVIRONMENT (elevation, destructible
   cover, Vegas surfaces) is still the thinnest part of the fight; and NEVER add
   a hidden hit roll on top of a good dial press (XCOM's unsolved problem that
   Bohemia already solved) - that one should become a law.
1k. DONE 7/26 (v79): THE PULSE JOINS THE LADDER. Paolo's design, locked and
   shipped same turn. Law: laws/BOHEMIA_ADDENDUM_THE_PULSE_JOINS_THE_LADDER_7_26_26.md.
   0 kills PULSE SOFT / 2 his rung 1 / 4 his rung 2 / 5 PULSE HARD. The pulse
   stops being a parallel system and becomes his ladder's floor and ceiling.
   Keys off _sk so downed men (V71) and the GROOVE chain (v74) both count: a full
   chain reaches HARD with nobody down. Button AUTO->SOFT->HARD->OFF, manual
   still wins. Gate section 16 executes the ladder at every rung (310 checks).
1j. *** [PENDING Paolo] THE OVERWORLD INTENSITY DRIVER. *** He asked how the 2/4
   progression could apply CALMLY outside combat. ANSWERED IN THE LAW ABOVE,
   NOT BUILT. Recommended driver: LIGHT = TERRITORY + CLUSTERED POWER (rung 1
   in lit owned blocks, rung 2 deep in a grid, calm in the dark) because it
   needs no new lore, is visible on screen, and carries the same cargo as two
   men down without violence. The CALMLY half is mechanism and mine: rungs enter
   on a SECTION BOUNDARY with a one-bar fade so it reads composed, not triggered.
   Supersedes/absorbs item 1n (the MUS.layers dead path). Blocked on his ruling.
   | gate: the driver is posted from the world, layers enter on a boundary |
   parent MUS + CITYMUS, a DIFFERENT sequencer from combat | no.
1l. DONE 7/26 (v78): NEW ENCOUNTER = NEW SONG. Paolo RULED OUT the v76 play-out
   swap ("that's so fucking retarded bro"). Deleted outright, no dead flag left.
   The v76 diagnosis was right and the lever was wrong: persisting the song fixed
   the FORM at the cost of the thing the button is for. RULE LEFT BEHIND: a fix
   that trades what the player feels NOW for what they would feel LATER is a BET,
   and it is his to place. Survives: the single pull point (the bag was drained
   twice an encounter), the pulse yield, the corrected measurement.
   COST ON THE RECORD: combat hears ~the first 40s of a song again; the 2:08 form
   and its 0:48 payoff stay unreachable in a fight. ANY future answer must NOT
   cost him the NEW ENCOUNTER song change. [PENDING Paolo] and not mine to retry.
1m. DONE 7/26 (v77): HIS SONGS ARE CANON + SONG LOCK GATE. Law:
   laws/BOHEMIA_ADDENDUM_HIS_SONGS_ARE_CANON_7_26_26.md. Paolo asked whether the
   music work had touched his actual songs. It had not (every body hashes
   identical from 70e2061), but a promise is not enforcement, so the worry became
   a gate the same turn. gates/song_lock_gate.js byte-locks OVERWORLD_SONGS,
   MLOOPS, MFACTIONS, SONG_ARR/ROOT, synthV, drumV, the 7/3 rungs and the klay
   styles against records/BOHEMIA_SONG_LOCK.json. Proven by tampering SLOW
   CREEP's kick and watching the build fail. NOT a ban on new music: the music
   lane runs --write and says why, which puts the change in the diff.
   FLEET NOTE: any lane that legitimately changes a song must now run
   `node gates/song_lock_gate.js --write` in the same commit.
1o. DONE 7/26 (v76): THE SONGS PLAY OUT + THE PULSE YIELDS. Law:
   laws/BOHEMIA_ADDENDUM_THE_SONGS_PLAY_OUT_7_26_26.md. v75 APPROVED BY EAR.
   (a) Corrected my own 4x error: the creepers run 2.17 kicks / 2.33 hats a bar,
   not 0.54/0.58; the gate now DERIVES the unit from stepDur. Placement is the
   sharper finding: nothing kicks on beat 2, one kick in the pool on beat 4.
   (b) His songs are 2:08 arrangements with the FULL section at 0:48, but every
   NEW ENCOUNTER reset them to bar 0, so he only ever heard the first 40s. Combat
   now waits for a full 1024-step pass before swapping, exactly as CITYMUS
   already did in the overworld. V71's bag fix stands; only the frequency changed.
   (c) The floor now YIELDS instead of doubling 11 kicks and 14 hats his songs
   already played.
   *** STILL FROZEN: every timing mechanic in 1v / 1t / v74's chain. ***
   *** [PENDING Paolo] should the 2/4 rungs unlock the MELODY at all, or only
   energy, or should kills FAST-FORWARD the form instead of unlocking it. His
   7/3 LOCKED law owns those rungs; nothing was moved. ***
1n. (discovered 7/26, NOT fixed, needs HIS ruling) THE OVERWORLD KILL LADDER IS
   A DEAD PATH. MUS.layers starts at 0 and the only assignment in the whole build
   is the studio's CALM/2 KILLS/4 KILLS preview buttons, so the four melody-klay
   creepers can never bloom in the city or the run. What drives intensity out
   there is lore. | gate records the single assignment | — | no.
1p. DONE 7/26 (v75): THE FIGHT PULSE. Law:
   laws/BOHEMIA_ADDENDUM_THE_FIGHT_PULSE_7_26_26.md. Paolo froze new timing
   mechanics until the music and the button work together, so the encounter
   music got COUNTED instead of clock-fixed a sixth time: his creepers average
   0.54 kicks / 0.58 hats a bar (four-on-the-floor is 4 / 8), all half-time. He
   was trying to lock to a pulse not in the recording. His songs untouched; a
   combat-only FLOOR under them in the song's own kit (kick on 4, eighth hats,
   backbeat on 2+4), thickening with the groove chain, plus the count is now the
   song's hat instead of a 415Hz UI beep. PULSE: HARD/SOFT/OFF for an honest A/B.
   *** EVERY TIMING MECHANIC IN 1v / 1t / v74's chain IS FROZEN until Paolo
   rules on this. A SECOND rejection ends the rhythm direction for the session. ***
1w. DONE 7/26 (v69): the four rhythm-game pillars - approach ring, graded press
   with a persistent ms strip, the shot plays a note in the song's key, and a
   SYNC tap-calibration. Law + what is still missing:
   laws/BOHEMIA_ADDENDUM_WHAT_MAKES_IT_A_RHYTHM_GAME_7_26_26.md.
1v. RHYTHM AS DIFFICULTY (next, from that addendum): the 52 dial patterns are
   curve shapes, not rhythms. A rhythm game gets harder by getting more
   syncopated, not faster. Author patterns as note values against the bar.
   | gate asserts each pattern's kill moments land on declared note values |
   the PHASE re-bake machinery exists, reuse it | new dial feel = he plays it.
1u. THE WHOLE FIGHT ON THE GRID: the return volley, deaths, steps and camera
   hits are not quantized, so only the dial is musical. | gate proves every
   fight event resolves on a beat | 120 BPM law | no.
1t. A COUNT-IN BAR when an engagement opens, so you enter already inside the
   pulse. | — | do not delay the pop itself | no.
1z. DONE 7/26 (v68, Paolo's 120-BPM-FIRST law): every dial cycle is a whole BAR
   (44% of pattern x difficulty combos could never land the perfect shot on a
   downbeat), the PHASE table re-solved against it, and the press is now a
   REQUEST granted on the beat. [PENDING Paolo] whether the POP should be
   beat-gated too (it would neutralise the ON THE ONE streak reward).
1y. (discovered 7/26) THE DIAL ENGINE HAS NO MASTER. The stamped block says
   "edit engine/bohemia_engine.master.js then re-stamp"; that file and the
   stamper do not exist anywhere in the repo. Either restore a master + stamper
   or delete the misleading header. NON-COOK. | a sync/byte-lock gate for the
   engine block | — | no.
1a. DONE 7/26 (v67, straight from Paolo playing it): dial locked to the AUDIO
   clock + whole-bar cover cycles; suppression turn-based and legible; sprint
   costs stamina and the refill no longer refunds it; sprint/dash mutually
   exclusive with the armed move named on the ring. [PENDING Paolo] the cycle
   rebalance it forced: package 2 slowed 6->8 beats, package 3 quickened 6->4.
0. ALLY-IN-COMBAT foundation (RULED 7/26, companions addendum): the encounter
   system supports friendly combatants on the player's side — spawn, target
   correctly, go down but never permanently die. Mechanism only; WHO joins
   and companion personalities are Paolo's/quest canon. | proven headless: an
   ally fights alongside through the real bus, downed ally never deleted |
   CITY_B64 | no.
1. DONE 7/26 (v66): encounter handoff hardening for the RUN. Contract:
   laws/BOHEMIA_ADDENDUM_RUN_HANDOFF_CONTRACT_7_26_26.md. Quest context in,
   dead/spared/fled out, declared LEAK LIST, cold handoff with the tab never
   opened, READY queue, abort, loud errors, no splash. 5 back-to-back
   EXECUTED headless in combat_lab_gate sections 5-6, plus a real-surface
   Playwright proof. The cold handoff went 12.9s -> 14ms (blocking font).
2. Combat grammar graduation: stack candidates in ONE judge surface. | judge
   reachable from alpha, side-by-side anchors | — | yes (thumbs then build
   the winner).
3. (discovered 7/26, RUN lane's call) The alpha SHELL carries the same
   render-blocking cross-origin font link the combat demo did. Combat fixed
   its own blob only (lane discipline). Same one-line fix, whole-game boot
   payoff: `media="print" onload="this.media='all'"`. NON-COOK.
4. (discovered 7/26) The demo's melee/nerve loop re-rolls `pickRandomFaction`
   twice on a quest handoff (startGame + the shuffle hook). Harmless, same
   distribution, but it is duplicate work on the enter path. NON-COOK tidy.

## CHARACTER  (LANE LAW 7/26: laws/BOHEMIA_ADDENDUM_THE_RIG_IS_LAW_7_26_26.md
## — the rig is the starting point of ALL body/anim work; RIG CHECK mandatory;
## AND laws/BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md — shading never
## baked into asset pixels, render-time layer only. First items of the lane's
## next session: the rig-check gate assertion + the shading-separation gate
## assertion, same turn.)
1. (DONE 7/26 -- records/BOHEMIA_BODYVAR_SLIDERS_7_26_26.txt) ONE-RIG VARIATION
   SLIDERS. Shipped with gates/bodyvar_gate.js + a real-browser clip-set sweep.
   The RANGES are now waiting on Paolo's thumb; do not re-cook them, and do not
   wire per-NPC randomisation until he rules on it.
1b. (MEASURED BY THE CITY LANE 7/27, handed over untouched — ONE SYSTEM, ONE
   SESSION) EVERY CHARACTER SURFACE IS DISPLAYED AT A FRACTIONAL SCALE. The
   city lane built tools/bohemia_canvas_scale_audit.js to catch its own canvas
   being bilinear-upscaled to the phone screen, and the same sweep measured
   yours. These are CSS-box-vs-backing-store ratios on a real iPhone-portrait
   DPR-3 browser; `image-rendering:pixelated` is already set on all of them, so
   the failure mode is not blur, it is UNEVEN PIXELS - some source pixels land
   3 screen pixels wide and some 4, which reads as a wobbly, badly drawn
   sprite, and it is worst on the biggest one:
       char    #charCv      112x112 -> 358.8 css   x3.2035   (glass x9.61)
       char    #portraitCv   64x64  -> 120 css     x1.8750   (glass x5.63)
       clothes .cloBig       56x56  -> 150 css     x2.6786   (glass x8.04)
       clothes .cloCv        56x56  ->  52 css     x0.9286   (a minification)
       anim    #g8_0..7     112x112 ->  85.8 css   x0.7660   (drops ~23% of
                            every row and column - on the gallery the anims are
                            JUDGED from)
       rig     #cv          336x336 -> 336 css     x1, but image-rendering is
                            `auto`, the only canvas in the game with no filter
                            set at all: at DPR 3 the rig preview is a bilinear
                            x3 smear.
   The fix is integer boxes (charCv 112 -> 336 css = x3, portraitCv 64 -> 128,
   cloBig 56 -> 168 or 112, the g8 gallery baked at 56 rather than shrunk from
   112) plus `image-rendering:pixelated` in RIG_B64, which has none. Each one
   nudges an element's size, so it is a look call as much as a fix. Reproduce
   with: node tools/bohemia_canvas_scale_audit.js
   slices/BOHEMIA_ALPHA_0_9.html | gates/canvas_scale_gate.js already PRINTS
   these every run and deliberately does not fail on them; make them yours and
   turn them into assertions | measured, not read | no.
1c. (MEASURED BY THE ART LANE 7/27, handed over untouched — ONE SYSTEM, ONE
   SESSION) THE SHELL HOLDS 2217 LIVE CANVASES once every tab has been opened.
   Different sweep, different concern from 1b: that one is about how canvases
   are DISPLAYED, this one is about how many of them EXIST. The memory probe
   (tools/bohemia_canvas_memory_probe.js) counts 2604 live canvases across the
   alpha at ~21 KB each = 53.8 MB of pixels, and 2217 of them are in the shell
   itself, which is where char / clothes / anim live. They survive a forced
   garbage collection, so they are RETAINED, not garbage waiting to go. Nothing
   is on fire: the whole build peaks at ~98 MB resident = 44% of the 224 MB iOS
   floor. But no single one of those canvases looks wrong, which is exactly why
   this went uncounted until now, and the tile set is about to multiply. Likely
   shape of the fix: one canvas per THUMBNAIL kind reused, or the previews drawn
   into a shared atlas, rather than one per garment/frame retained forever.
   Reproduce with: node tools/bohemia_canvas_memory_probe.js (see by_frame in
   records/target/BOHEMIA_CANVAS_MEMORY.json). gates/canvas_memory_gate.py
   ratchets the total and deliberately does not fail on the count | measured,
   not read | no.
2. Wardrobe: new SHAPES (structure-not-color), taste-filtered before
   surfacing. | structure_gate | — | fresh shapes = thumbs.
3. Music pool volume in approved styles, taste-filtered. | music gates | — |
   fresh songs = thumbs.

## QUESTS — HIBERNATED (Paolo 7/26, laws/BOHEMIA_ADDENDUM_QUESTS_LANE_
## HIBERNATED_7_26_26.md). Do NOT pick up items below; no "quests" sessions
## until Paolo reopens the lane. All shipped quest work stays live and gated.
1. DONE 7/26 (S10-S21 shipped, corpus 9 -> 21, gate hardened with 5 new checks,
   laws/BOHEMIA_ADDENDUM_TWELVE_MORE_CANON_QUESTS_7_26_26.md). Sitting is live in
   the alpha: LIFE tab -> THE 12 NEW CANON QUESTS. Awaiting thumbs.
2. Act-1 main-quest beats from the locked lore (cold open -> flash-flood climax)
   drafted as .bq chains. START by querying records/BOHEMIA_QUESTBOOK_LAW_INDEX.json
   (QUEST STUDY LAW) and cite what you build from. | same bar as S10-S21, plus
   chain continuity proven headless | engine code, the alpha | yes.
2b. (discovered 7/26) The PORTS master is a 1,276-item BUILD QUEUE written for
   Bohemia by name and almost none of it is built. Mine it for the next quest
   batches instead of inventing shapes. NON-COOK triage first: list the ports
   that are already satisfied vs open. | the index makes this queryable | — | no.
3. (discovered 7/26) MULTI-QUEST CHAIN SUPPORT: nothing in the format or the
   runtime lets quest B read that quest A resolved (S09 -> S06 is a chain only in
   prose). Act-1 beats need it. NON-COOK item: a cross-quest flag surface on
   ctx.quests + a gate proving A's ending really opens B. | new gate section |
   the .bq format's no-stat-gates law is untouchable | no.
4. (discovered 7/26) The batch plants unread flags (opened_the_deep,
   aired_the_method, killed_the_token, walked_them_out, owes_the_cartel,
   sold_the_forger). Nothing consumes them. Wiring them to world beats is
   [PENDING Paolo] at the canon level; the mechanism half is item 3.

## SHARED / ANY IDLE SESSION (non-cook)
0. THE SHOPPING LAW MACHINE (from the 7/27 index): (a) make records/BOHEMIA_
   APPROVED_ASSET_INDEX generation a TOOL (sweep verdicts x banks x consumers
   automatically); (b) NEW GATE: every bank listed APPROVED in the index must
   have >=1 consumer on a playable surface OR carry an explicit routed
   backlog item — approved-but-unused turns the gate red; (c) the gate also
   flags the INVERSION (unjudged banks with surface plumbing). | gate
   registered, index regenerates deterministically | — | no.
1. VERDICT TOOLING upgrade per the doctrine: one AGGREGATED judge page across
   lanes grouped by discipline, side-by-side anchors, APPROVE/CBB/KILL
   buttons, kill-reason tags, .txt export. | replaces per-lane judge sprawl;
   gate: the page exists + exports parse | — | no (tooling, not art).
2. [PRIORITY UP 7/26, Paolo direct order — approved-assets-first addendum]
   CANON EXEMPLAR INDEX + KILL-REASON TAXONOMY distilled from banks +
   graveyard post-mortems (machine-readable; cooking tools cite which
   exemplar anchored each cook). | reusefirst-style gate extension | — | no.
3. DRIFT CANARY harness: re-render fixed approved anchors, diff vs blessed.
   | canary gate registered | — | no.
