# THE PUBLISHER'S READ (PLUMBER 9, 11/27/26, VAMILY rule 495(c) and (d); ask row 782)

PAOLO 11/27: "don't just fuck it up and fix it with fucked up coding duct tape... everything has to have the final
organizational work of the code in mind... when we give it to a publisher... the sloppier it's organized and the things
don't link together... the more difficult at the end... as we're getting it published live."
THE BRIEF (records/BOHEMIA_THE_FINISH_LINE_AND_THE_ROAD_11_2_26.md s2, s3): a phone app first, through a publisher, a web
version hosted by one; the final game about a year out; "every piece built for the demo is built to last into the final game."

This round: (1) research, cited; (2) the code measured as it is; (3) a gate that counts the patch layers and the copies, a
ratchet that only goes down; (4) the road, and the first small safe step taken. Machine census:
records/BOHEMIA_PLUMBER_NINE_THE_CODE_CENSUS_11_27_26.json (the landing tree, after step one; re-made by `node tools/bohemia_publisher_read.js --json <file>`).

## 1. THE RESEARCH (both angles: how studios do it, and the real rules of the stores and portals)

WHAT A PUBLISHER'S ENGINEERS LOOK AT. There is no one published standard; the sources are consultants and platform docs,
so this is directional, and it agrees with itself:
- A game-tech review before money moves looks at "the build, licenses, production pipeline and readiness for target
  platforms", and in a deeper pass "engine versions and patches, middleware and licenses, open-source components, build
  reproducibility, CI practices and performance captures", on "the studio repository and build machine"
  ([Cornford and Cross, From Development Build To Deal](https://cornfordandcross.com/market-insights/from-development-build-to-deal-assessing-game-technology/);
  [1023jack, Tech Due Diligence For Game Publishing Deals](https://1023jack.com/market/tech-due-diligence-for-game-publishing-deals/)).
- General code diligence reads "source repositories, commit history, coding standards, test suites, dependencies,
  security controls, CI/CD practices, technical documentation, and evidence of technical debt"
  ([KMS Technology, red flags in code review](https://kms-technology.com/blog/software-code-review-in-due-diligence-key-red-flags-investors-should-watch-for/);
  [Umbrex, the walk-the-repo playbook](https://umbrex.com/resources/software-product-and-technology-due-diligence-playbook/codebase-and-engineering-health-the-walk-the-repo-playbook/)).
  "If there's no automated testing, you are trusting human memory"; "watch the team run their tools" rather than read
  summaries ([dredyson, M&A technical due diligence](https://dredyson.com/the-hidden-truth-about-how-long-making-a-game-takes-in-reality-compared-to-expectation-in-ma-technical-due-diligence-a-complete-step-by-step-guide-for-evaluating-development-timelines-code-quality/)).
- What a publisher pays against is a milestone "written so that a third person can read [it] and determine exactly what
  [it] should accomplish" ([Game Developer, Milestones and glass houses](https://www.gamedeveloper.com/production/milestones-and-glass-houses-preventing-your-development-schedule-from-shattering-part-1)).
  Platforms hold a game to a technical requirements checklist before release (the TRC idea:
  [Newcastle University TRC workshop](https://research.ncl.ac.uk/game/mastersdegree/workshops/technicalrequirementschecklists/Technical%20Requirements%20Checklist%20Workshop.pdf);
  [Defold porting guidelines](https://defold.com/manuals/porting-guidelines)).
  WHAT THAT MEANS FOR US: our 1,255 gates ARE the evidence a reviewer asks for, but only if the reviewer can run them and
  read what they guard. Today they guard pages that carry their own history (s3), so the test plan reads like a diary.

THE PHONE APP. The usual road for a web game is a native shell around a web view:
- Capacitor's own guide says its WebGL and canvas support makes games feasible on modern phones
  ([Capacitor, Game Development](https://www.capacitorjs.com/docs/guides/games)); the Phaser community uses it to reach the
  stores ([abratabia, native wrappers](https://abratabia.com/native-wrappers/)); WKWebView runs JavaScript with the JIT like
  Safari ([Construct, Boosting iOS performance with WKWebView](https://www.construct.net/en/blogs/construct-official-blog-1/boosting-ios-performance-855));
  Android's system web view varies by device ([Capgo, animation performance in Capacitor](https://capgo.app/blog/ultimate-guide-to-animation-performance-in-capacitor-apps/));
  a Phaser game that ran fine on desktop broke in a Capacitor APK at a 2560x1440 canvas
  ([Phaser forum](https://phaser.discourse.group/t/phaser-3-capacitor-android-apk-white-screens-texture-rendering-failures-and-orientation-issues/15571)).
- APPLE, verbatim ([App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)): 2.5.2 "Apps should be
  self-contained in their bundles... nor may they download, install, or execute code which introduces or changes features
  or functionality of the app". 4.2: "Your app should include features, content, and UI that elevate it beyond a
  repackaged website." 4.2.3(ii): "If your app needs to download additional resources in order to function on initial
  launch, disclose the size of the download and prompt users before doing so." (4.2 and 4.7 were read through a summary
  of the page, not verbatim; 2.5.2 is verbatim.)
  WHAT THAT MEANS FOR US: the game's CODE ships inside the app, never fetched from the web site at run time, and the shell
  is the app, not a link to the site. That needs a build that can say "these are the code files" (s5 road R5).
- GOOGLE PLAY ([Android App Bundle FAQ](https://developer.android.com/guide/app-bundle/faq?hl=en);
  [Play Console size limits](https://support.google.com/googleplay/android-developer/answer/9859372)): a base module of
  at most 200 MB compressed; asset packs (Play Asset Delivery) of 1.5 GB each; at most 4 GB to any one device.
  WHAT THAT MEANS FOR US: the site is 895 MB in 16,126 files (THE SITE SERVES gate's L1, this round). The code (s3: the core
  is 20.3 MB) fits a base module; the pictures and sounds go in asset packs.
- THE WEB PORTALS: CrazyGames, "initial download size ≤ 50MB... ≤ 20MB" for the mobile homepage, "a maximum total file
  size of 250MB... a file count limit on 1500 files" ([CrazyGames technical requirements](https://docs.crazygames.com/requirements/technical/));
  Poki, "Target an initial download size under 8 MB... Remove all development tools, debug code, and testing artifacts
  before publication" ([Poki requirements](https://sdk.poki.com/requirements)).
  WHAT THAT MEANS FOR US: our door is 4.0 MB before NEW GAME and 20.8 MB in 91 files in the 20 s after (THE STOPWATCH LINE),
  inside CrazyGames' 50 and near its 20; the whole site is 10 times its file count. A portal build is the game's six pages
  and what they load, never the workshop.

HOW TO CHANGE A LIVE CODEBASE WITHOUT A REWRITE:
- The strangler fig: build the new around the edges of the old, in frequent releases, and the users never see a migration
  ([Martin Fowler, Strangler Fig](https://www.martinfowler.com/bliki/StranglerFigApplication.html);
  [Microsoft Azure, Strangler Fig pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig);
  [AWS, strangler fig](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/strangler-fig.html));
  Fowler on mobile apps: incremental "can be preferable to the classical 'rewrite from scratch'"
  ([Fowler, Strangler Fig with mobile apps](https://www.martinfowler.com/articles/strangler-fig-mobile-apps.html)).
- The characterization test (Michael Feathers, Working Effectively with Legacy Code): "document your system's actual
  behavior; not... the behavior you wish your system had"; record a run, compare every later run to it, mask what varies
  ([Wikipedia, Characterization test](https://en.wikipedia.org/wiki/Characterization_test);
  [InfoQ, characterization testing](https://www.infoq.com/news/2007/03/characterization-testing)).
  THIS ROUND USED BOTH: one module moved (the fig), proved by a before-and-after run of the same page (the golden test, s5).

## 2. THE FINDING THAT PROVES US WRONG

THE ENGINE SYNC LAW SAYS "ONE CANONICAL BODY PER MODULE". THE GAME HAS 172 PASTED MODULES, AND FOR SIXTEEN DAYS NOTHING
COULD SAY WHETHER THEY STILL MATCHED. The keeper that checks them (tools/bohemia_city_module_resync.py) stopped on its first
odd banner (bohemia_followers.js) and exited before it reported; INLINED FRESH has been red and quarantined since 11/10 for
"the resync tool itself fails". Fixed this round (s6), the keeper reports: 146 pasted, 140 fresh, and SIX NOT: in three the
city plays a function its engine file does not (bohemia_hostiles.js `words`, bohemia_quirk.js `lineFor`,
bohemia_ask_spoken.js `spokenFor`; for hostiles the engine file carries WORDS' 10/24 Spanglish rate, rule 143a, "about 1 in
8 (it was 2 of 6)", and the city still plays the old one), and three differ in comments only. A publisher's engineer finds
this in an hour: the engine says one thing and the game runs another. That is exactly what Paolo means by "things don't
link together".

## 3. THE CODE AS IT IS (main 9f1b4b65a, before step one; numbers from tools/bohemia_publisher_read.js)

THE FILES. 634 code files on disk (slices/ 338, engine/ 296); 358 code modules, 10 data tables written as .js (the city
tiles, 1.5 to 4.8 MB a file on 7 to 18 lines). THE CORE (four big pages, the demo being the alpha's cut, and the 104 scripts they load)
is 108 files, 20.3 MB. The site publishes 62 pages; the game a stranger plays is about six of them (the demo or the alpha, the city world,
the fight, the settlement screen, the spoils, the VOTE tab in the alpha).

THE BIGGEST: BOHEMIA_RUN_CURRENT.html 21.5 MB (generated, never loaded: tools/bohemia_publish_list.js NOT_LOADED);
BOHEMIA_CITY_WORLD.html 6.5 MB; BOHEMIA_ALPHA_0_9.html 6.4 MB; BOHEMIA_VOTE_CURRENT.html 6.2 MB (never loaded); the city
tile tables 4.0 to 4.8 MB each; BOHEMIA_TARGET_SCREEN_JUDGE_7_26_26.html 4.8 MB.

THE FIVE BIG PAGES (rule 495(c)'s list):

| page | size | lines | code | comments | patches named | blocks | hook lines | overrides | scripts loaded |
|---|---|---|---|---|---|---|---|---|---|
| the fight | 1.3 MB | 14,057 | 714 KB | 448 KB | 112 | 29 | 428 | 3 | 17 |
| the alpha | 6.4 MB | 43,100 | 1,465 KB | 1,169 KB | 187 | 34 | 362 | 0 | 19 |
| the demo (cut of the alpha) | 3.9 MB | 43,381 | 1,467 KB | 1,180 KB | 187 | 34 | 362 | 0 | 19 |
| the city world | 6.5 MB | 96,505 | 2,305 KB | 2,901 KB | 630 | 151 | 1,787 | 16 | 49 |
| the settlement screen | 0.7 MB | 6,739 | 392 KB | 210 KB | 125 | 57 | 400 | 0 | 49 |

What the columns mean: a PATCH is a named marker in a comment (`__THE_MAP_STANDS_UP__`); a BLOCK is its opening line
(`/* ==== __NAME__`); a HOOK LINE is a line outside the patch's own block that carries its name, a later fix reaching back
into older code; an OVERRIDE is a function declared twice at the top level or assigned over (`render = function`), where the
newest copy silently wins. The most-hooked patches: the city's A_RETREAT_GETS_HIM_AWAY (17 lines), THE_HOUSES_STAND_UP_CLOSE
and THE_MAP_STANDS_UP (16 each); the fight's ARMORY_THREE (34) and THE_STAFF_FIGHT_TOO (25); the settlement screen's
CAMP_TWO (26). The city's overrides: `render` assigned over 4 times, `crewBillNight` 2, ten more once.

READ THIS: THE CITY WORLD IS 43 PERCENT COMMENTS (2.9 MB of 6.7). The comments are the studio's reasoning (rulings,
measurements, post-mortems), which is valuable and belongs in records/ and git, not in the file the phone downloads and a
reviewer opens. The alpha's 3.6 MB of strings are mostly ONE: `COMBAT_B64`, a whole old fight page ("Dead Eye Dial — Aim
Build", 2.0 MB decoded) base64-encoded inside the alpha (the demo cut already drops it).

THE COPIES (a function body of 100+ characters, comments out, whitespace folded):
- INLINED: 172 (module, page) pairs, 1,423 function bodies carried twice: an engine or slices module pasted whole into a
  page (the ENGINE SYNC way). The city world carries 146 of them (bohemia_feedstream.js 48 bodies, agents 37, towns 33,
  district_kit 32, people 32, homebases 31...); the alpha carries 31 of the 66 in bohemia_engine.js. None is loaded twice.
- PASTED: 41 hand copies no module carries: the same `hz` and `rngOf` hash in four interior modules (big_inside,
  casino_floor, flood_tunnels, parking_garage), `hash` in arena, aftermath and freeway_boards, `esc` in four, `hash32`,
  `needOk`, `dirTo`, `ls`, `el`, `fill`, and 25 one-or-two-helper pastes of a module into the city.
- NAME FORKS (one name, two bodies, two core files; listed, never ratcheted): 5 (`fogSeen`, `dirOf`, `ease`, `walkSay`
  between the city and the fight; `rigFrame` between the alpha and the city).

DEAD CODE:
- 254 of the 634 code files (57.6 MB) are not on the site at all: 141 are named only by gates or tools, 109 (0.95 MB) by
  nothing in gates, tools or the game, 4 live on only as a pasted copy.
- Of 8,450 functions in the core, 70 are never named again anywhere in the core (an upper bound: a name built at run time
  would be missed). Checked by hand: the alpha's `warmTheFight`, `abortEncounter`, `renderWordmark`; the fight's
  `mancInstall`. The city has 38 of them, the alpha 12, the fight 7, the settlement screen 3.

WHAT LINKS TO WHAT: the pages talk through frames and globals. The alpha names 13 other pages and reaches into a frame by
name 14 times; the city reaches into its parent 40 times; the pages post 146 messages between them; the city sets 230
`window.__X` globals, the alpha 137, the settlement screen 81. A reviewer has to read three files to follow one tap.

## 4. THE GATE (rule 495(c)): THE PATCH LAYERS ONLY GO DOWN

gates/the_patch_layers_only_go_down_gate.js, in the suite, about 30 s, no browser. It runs the census and holds every number
to gates/BOHEMIA_PATCH_LAYER_RATCHET.json: R1 blocks, R2 hook lines, R3 overrides, each per big page; R4 inlined pairs, R5
pasted copies, R6 loaded twice. A number above its ratchet is red with the fix in the message ("fold the fix into its owning
module, or retire an older patch beside it"; "load it with <script src> instead"). A number below is green and says LOWER
IT; `--tighten` lowers the ratchet (never raises it). The counting is a pair, not a function, for pasted modules ON PURPOSE:
a lane adding a function to a module already pasted in costs nothing, pasting a module into one more page costs one, so
the gate never blocks honest work in a module and always blocks a new paste. P1 to P3 plant a block and two hooks, two
overrides, a copy, a pair and a double load, and each reads. 10/0 at its first run; the ratchet came down this round
(inlined pairs 173 to 172).
ITS FIRST CATCH, BEFORE IT LANDED: in the twenty commits main took during this round, ECONOMY FOUR's BUILD 11/27zt (2e5ba3130)
added a block, __A_PLACE_EARNS_OR_GOES_DARK__, and five hook lines to the city world (151/1787 to 152/1792); the rebased run
was red for exactly that. The gate did not exist when it shipped, so the ratchet is set from the main this lands on (d136c8af9
plus this commit): FIGHT 29/428/3, ALPHA 34/361/0, DEMO 34/361/0, CITY 152/1792/16, SETTLEMENT 57/400/0; copies 172, 41, 0.
From here a block like that is red with the fix in its message.

## 5. STEP ONE: THE ENDING LOADS FROM ITS FILE (game identical, proved)

WHY THIS ONE: engine/bohemia_ending.js (149 lines) sat pasted in the city world byte for byte, no gate names it, nobody
edited it in the visible history, and the game calls it in exactly one place, inside a function that runs later
(`BohemiaEnding.endingFor(ctx)` at the city's day end).
THE CUT: the city's main script element runs 79,150 lines (1978 to 81128). It is cut in two around a plain
`<script src="../engine/bohemia_ending.js">`, so the module runs in the same place and order. THREE THINGS CHECKED BEFORE
THE CUT, each measured: (a) the cut is at depth 0, between two modules, in a comment; (b) the element has no `'use strict'`
at its top (the overmap's is inside its own function), and the module carries its own; (c) HOISTING: of the 1,099 functions
declared after the cut, 17 are named before it, and every one of those 26 places is inside a function that runs later; the
only two that run while the page loads are a local function of the same name (`advance`, line 12481) and its own object.
THE ROOT TOO: tools/bohemia_city_ending_patch.py "self-heals" by pasting the module back when its copy is gone; it now
knows the tag (MOD_TAG) and its body writes the tag, never the copy. Run on the new page: "already applied", byte-identical.
THE GOLDEN TEST (Feathers' way; the script is in this session's scratchpad, the method is here): the city world booted
twice in Chromium, the old page and the new: 3,333 window names, the same; 200 `Bohemia*` modules and their APIs, the same;
`BohemiaEnding.endingFor` on four days, the same answers; the same 22 console lines; 64 scripts asked for before, 65 after,
the one new one engine/bohemia_ending.js. THE GAME: THE WHOLE LOOP PLAYS 11/0 (title, a town, the map, a road event, a
fight, the victory, a reload); COLD BOOT 11/0; DEMO BUILD 25/0; PAGES PUBLISH green (the module is on the list through the
city); ENGINE SYNC holds (19 modules, zero drift); THE PATCH LAYERS ONLY GO DOWN 10/0.

## 6. WHAT STEP ONE FOUND (and fixed at the root where it was mine)

- THE KEEPER COULD NOT FINISH. tools/bohemia_city_module_resync.py's fallback cut a module from its banner to the NEXT
  module's banner; bohemia_followers.js closes with `/* ==== /engine/... ==== */`, so the cut ran 417,750 bytes and the tool
  refused and exited, every run, for every lane. FIXED: the cut stops at the module's own closing banner first. INLINED FRESH
  went from 0 passed / 1 failed to 2 / 1, and its one red is now the real drift (s2); its red-debt line says so.
- A CHECK WAS WRITING THE GAME. gates/banner_gate.js's "the keeper RUNS" leg ran the keeper WITHOUT --check. The moment the
  keeper could finish, one run of the gate rewrote three pasted modules in the city world (the hostiles' bark lines changed in
  the working tree). Caught by comparing the file after the run, and restored byte for byte. FIXED: the leg runs the keeper
  with --check and counts "started and reported" (exit 0, 1 or 2 with its report line) as alive. BANNER 11/3 to 12/2; the two
  reds left are its own (five modules pasted behind banners the sweep cannot read: ground, kept, origins, world_seed,
  world_state). The overmap keeper has no --check and writes when its module moved: named, not touched.
- NOT MINE, NAMED: THE SITE SERVES WHAT THE GAME LOADS is red on L4: the loop asks for 13 files under slices/rig_mix/ (the
  map's packed people sheets, town_2.png, caravans.png, cartel.png...) that the publish list does not ship, because the
  city builds those names from rig_mix/index.json at run time. ON THE LIVE SITE THE MAP'S PEOPLE NEVER GET THEIR PACKED SHEETS
  (the stand-in look stays). Owners: CHARACTER 3 (the packing, f73ddbad4) and PLUMBER 8 (the list); the fix at the root is
  the loader naming the folder ('rig_mix/' + name), which the list's rule 3 already ships whole.

## 7. THE ROAD (small safe steps, the game identical after each; never a big rewrite)

Each step: one module or one patch, a golden test before and after, the owning lane told, the ratchet lowered in the same
commit. Cold code first (nobody editing it that round), hot code when its lane asks for it.

R0 COUNT IT (done this round): the census, the gate, the ratchet.
R1 THE PASTED MODULES LOAD FROM THEIR FILES. 172 pairs. One a round at first, then batches once the golden test is a tool.
   The six drifted ones wait for their owners (WORDS for hostiles; the quirk and ask_spoken owners) to say which body is
   right; then they load from the file and the drift cannot come back. As each leaves, its paste tool learns the tag
   (the ending's patch tool is the pattern) and the keeper has one less job; when the last one leaves, ENGINE SYNC is
   enforced by the browser itself: there is only one file.
R2 THE HAND COPIES GO TO ONE HELPER. `hz`, `rngOf`, `hash`, `esc` and the rest (41) into one small shared module the pages
   load first (a seeded-hash and an html-escape module). Needs the pages' script order: one page at a time.
R3 THE PATCH BLOCKS FOLD INTO THEIR SYSTEMS. Per page, the most-hooked first (the city's A_RETREAT_GETS_HIM_AWAY, the
   fight's ARMORY_THREE, the settlement's CAMP_TWO): the block and its hooks become one function in the module that owns
   the system, the hooks become calls. The overrides first of all (the city's four `render = function`), because the
   newest copy silently winning is where bugs hide.
R4 THE DIARY MOVES TO THE RECORDS. The long comment essays (2.9 MB in the city) become one line in the code plus the
   record they came from. Pages shrink by about a third; the reasoning is kept, in git and records/.
R5 A BUILD, AND THE PAGES BECOME SHELLS. tools/bohemia_publish_list.js already computes what the game loads; it grows into
   the build that writes dist/: the game's pages, their modules, minified, one folder. The demo cut and RUN_CURRENT become
   build outputs, not committed source. dist/ is what a portal gets (under 1,500 files) and what the app bundles.
R6 THE APP. A Capacitor shell around dist/ (the code inside the bundle, Apple 2.5.2), the pictures and sounds in asset packs
   (Play Asset Delivery; iOS on-demand resources), the saves through the app (the brief: "the app and the publisher hold
   the saves"). PLUMBER 8's iPhone budget (768 MB of live pictures) is the app's budget too.
R7 THE PUBLISHER'S PACKET. A README a stranger follows (run it, build it, test it), the module map (this census, regenerated),
   the licence list of every font, sound and pack, the gate suite as the test plan, the dead files (254) moved out of slices/
   and engine/ into archive/ once nothing names them.

## 8. WHAT I COULD NOT CHECK, SAID OUT LOUD

- The 70 never-named functions are candidates, not proven dead: a name built from strings at run time would be missed.
  Four were checked by hand. None was removed this round.
- The hoisting check reads the code, it does not run every path; the golden test and the whole loop cover the boot and the
  loop, not every screen. The ending itself runs only at a demo day's end; its answers were compared directly (s5).
- The research on publisher reviews is consultants' writing, not one standard; the store and portal rules are the
  platforms' own pages (Apple's read in this session; Capacitor, CrazyGames, Poki, Google and Fowler through search, their
  hosts blocked from this container).
- The visible git history is 50 commits (this clone), so "nobody edited it lately" means since 17 hours before this round.

## ROUTED
- COORDINATOR: this record; the ask row 782 is IN FLIGHT; the road (s7) is the order of the next rounds of this lane.
- WORDS: bohemia_hostiles.js `words`: the city plays the old Spanglish rate, the engine file has your 10/24 one; say which.
- PEOPLE (and whoever owns bohemia_quirk.js `lineFor` and bohemia_ask_spoken.js `spokenFor`): the city plays a different
  body than the engine file; say which is right, then the module loads from its file (R1).
- CHARACTER 3 and PLUMBER 8: slices/rig_mix/ is not on the site (13 files the loop asks for); name the folder in the loader.
- EVERY LANE (rule 495(e)): a new patch block, a new hook line, a new override, a new paste is red now; fold the fix into the
  module that owns it, and say in the commit where the cause was.
