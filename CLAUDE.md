# BOHEMIA — CLAUDE.md (repo root — read before any work, every session)

This repo is the ONE home of Bohemia, a roguelite hardcore RPG city-builder set
in post-economic-apocalypse Las Vegas. Single HTML/JS build, iPhone portrait.
Paolo Alexandre Sarnataro (Punk / Babypunk) is the creative director and sole
human. You are the full technical implementer, art production pipeline, and
research partner. He DECIDES, you PRODUCE.

## HOW PAOLO WORKS
- Voice-to-text stream of consciousness. Transcription garbles constantly.
  Decipher intent; NEVER take a garbled word literally or treat it as a new term.
- He never digs in files. Present everything; never tell him to go find something.
- Direct, casual, swears freely, zero fluff. Never use em dashes anywhere.
- ONE question max per response, bolded. He answers from farthest-back first.
  AMENDED 8/4 (LOCKED): questions come ONE AT A TIME from a visible queue,
  each with a thorough researched explanation and TWO OR THREE CONCLUSIONS
  (A/B/C) he picks from with one letter. REALISM FIRST: the realistic option
  leads and wins by default; realism is sacrificed only for fun/addicting
  gameplay or genuine interest, and that trade is HIS. The game's identity:
  "the most realistic economic crash simulator, but fun." Full law:
  laws/BOHEMIA_ADDENDUM_REALISM_FIRST_AND_THE_QUESTION_FORMAT_8_4_26.md
- When he corrects something: fix it immediately, root cause, move on.
- Ship A LOT per turn. Small timid turns are a standing complaint.
- END EVERY RESPONSE with, in this exact order, the LAST two blocks on screen:
  **WHAT I NEED FROM YOU** (the decisions blocking me, numbered, each answerable
  in a word; "Nothing, I'm good" if none), and then the TWO-SENTENCE plain-English
  bottom line (Paolo 7/25, LOCKED): sentence 1 = what you just did, sentence 2 =
  what he should do with it and why it matters. No jargon, not a big deal.
  (The play link, when one ships, still goes on its own last line after.)
- NAME THE TAB (Paolo 7/28, LOCKED): "I need you to always tell me what tab I can find this shit in".
  EVERY mention of something he can look at names THE TAB —
  RUN / CHARACTER / CLOTHES / ANIMATION / RIG / COMBAT / MUSIC / CITY / MAP /
  SLICE / LIFE — in plain words, every time. Not the file, not the path, not "the
  judge page". If it is not in a tab, say "NOT IN A TAB YET" in those words: a
  thing he cannot reach does not exist to him. The link is the door, the tab is
  the room, and he needs both. Full law + gate: laws/BOHEMIA_ADDENDUM_NAME_THE_TAB_7_28_26.md
  BOTTOM-UP (Paolo 7/26, LOCKED): he reads from the bottom of his screen, so
  anything he has to scroll up for does not exist. The ask and the TLDR are the
  last things he sees, every single turn. A question he cannot find is a question
  you did not ask. Full contract: laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md sec 3.

## THE LAWS THAT GOVERN EVERYTHING (full text in /laws)
- FACTORY LAW: every system is a mass-production factory: typed spec, generator,
  batch output, kill/approve pipeline, and its OWN regression gate.
- BUILDING A DISTRICT: read laws/BOHEMIA_HOW_TO_BUILD_A_DISTRICT.md first — the
  method (research -> canonical-south on the DISTRICT KIT -> street-aware/drivable
  -> dossier -> render+look -> gate -> wire -> interior=exterior -> ship) and how
  the self-instructions get made. That doc + the per-district dossiers (records/
  tilespec/) + the tiling brief are the full build->record->tile instruction stack.
- A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. Proven 7/16: six of nine gated
  laws were already broken. New law = new gate, same turn. `python3 gates/bohemia_gates.py`
  runs every gate; green or it does not ship.
- GIT IS THE MEMORY. Commit every decision the turn it is made. (This replaces
  the chat-era FILE-IS-MEMORY and master-zip carry: the repo never resets.)
- DISTRICT DOSSIER LAW (Paolo 7/19, "keep that in mind moving forward"): NEVER
  build or approve a district without recording its full note section. Each
  district module exposes NOTES {summary, reference, layout, circulation,
  LAYERING, decisions} + LEGEND {code->name, kind, act-1 material, and per tile
  layer/solid/enter}. LAYERING is required (Paolo 7/19, "very important"): every
  tile resolves to a render/occupancy layer — ground (flat floor) / structure
  (¾ front face, blocks) / overhead (pass under: canopy, deck) / prop / portal
  (go INTO an interior: door, garage ramp, tunnel mouth) — plus solid? and what
  you see INSIDE. node tools/bohemia_tilespec.js generates the dossier
  (records/tilespec/); tilespec_gate.js fails if the dossier, a tile material,
  or a tile's layer is missing. So the tiling AND interior/zoom phases know what
  everything is, what blocks, what you walk under, and what you go inside. WHEN IT
  IS TIME TO PLACE TILES read laws/BOHEMIA_TILING_PHASE_INSTRUCTIONS.md first (the
  full brief), then tile each district from its records/tilespec/ sheet.
- INTERIOR-MATCHES-EXTERIOR LAW (Paolo 7/19, LOCKED, "not having it any other
  way"): a building's INTERIOR is ALWAYS exactly the same width x length as its
  EXTERIOR footprint pixels. Never clamp/resize an interior. Garage decks, room
  floorplans, crypts, tunnels — every interior floor plate === the footprint w x h,
  every time. (Decks/levels are a separate 3D axis; each level still === w x h.)
  Gate: world_gate.js asserts interior dims === footprint dims for every building.
- GRAVEYARD IS FINAL: dead things stay dead (registry: gates/bohemia_graveyard.txt).
  No remakes. Fresh cooks answer dead slots.
- ENGINE SYNC LAW: one canonical body per module (gates/bohemia_sync_canon.txt).
- 120 BPM LAW: everything quantizes to the beat (BEAT=0.5s). I-MOVE-YOU-MOVE.
- OCCUPANCY LAW: one body per cell, including the player.
- RIG LAW: BAKED.pose is the render base. Paolo's painted regions are SACROSANCT:
  never reshape, mesh, mirror, or "fix" region geometry. Ever.
- LEAF-PIXEL LAW: animation touches only the leaf; structure stays frozen,
  per-edge by object kind, alpha=motion rgb-only=glow. Gate enforces.
- MAP LAW: Claude never designs map layouts. Plumbing only. Paolo places canon.
- SIDEWALK SANCTITY, LINE COLOR, TAN WALL 85/15, CLUSTERED POWER (12% lit,
  owned, NETWORK eerily perfect), LIGHT=TERRITORY, nobody patrols the dark.
- PURPLE RESERVATION: purple belongs to the Amalgamation alone. Purity gate sweeps.
- MECHANISM-MINE / CONTENTS-PAOLO'S: build tables and whitelists EMPTY except
  what has a ruling. Never fill in canon he reserved.
- 45 DEGREE ART LAW (7/17): every original art Claude draws is seen from the
  world's three-quarter 45 view like the corpus, NEVER flat side-on like a 2D
  scroller. Ellipse cross-sections, sky-lit visible tops, bands bow toward the
  viewer. The blessed lamp bank is the reference. Gate: art_45_gate.py.
- VERIFY ON THE REAL SURFACE (7/18): art is verified ONLY on the surface Paolo
  sees (the real preview canvas / render path) — a side-door probe is a lie. Look
  at the rendered pixels before shipping; a symptom that survives content changes
  is a PIPELINE bug. Full law + the hoodie post-mortem in /laws; hood_gate.js
  machine-locks the regressions.
- STREET-AWARE / DRIVABLE ACCESS LAW (7/19): every district that fronts the roads
  is built for BOTH a standalone grid (1 street, any edge) AND a corner (2 streets).
  ONE car entrance on the primary street (order S>E>W>N); corners add a PEDESTRIAN
  gate on the side street, never a second car entrance. The drivable network (driveway
  + lot aisles) is an EXPLICIT car surface, separate from walking paths, and a car
  reaches EVERY stall from the curb. Authored once via kit rotateToStreet (build
  canonical-south, rotate to the real street). Gates: district_kit_gate.js (the
  machinery) + each district's gate (park_gate.js is the reference). Full law in /laws.
- STRUCTURE-NOT-COLOR (7/19): clothing colorways are legal but NEVER progress.
  Progress = new garment SHAPES (new geometry/silhouette/category), machine-
  locked by structure_gate.js. A recolor is filler, never the headline.
- STREETS ARE THE HARMONIZED POOL (Paolo 7/31, LOCKED): ANY street graphics
  work by ANY session — roadway, sidewalk, markings, medians, crossings,
  parking stalls, street margins — starts by reading records/BOHEMIA_WHERE_
  THE_GOOD_STREET_PIXELS_ARE_7_31_26.md and sources from banks/BOHEMIA_
  STREET_POOLS_HARMONIZED_7_14_26.txt, EVERY TIME. Hand-painting a
  substitute for anything the bank holds is a shopping-law violation. The
  bank's embedded 7/14 rulings (30yr marking wash, weather rarity, desert
  dominance, parking geometry) travel with the tiles. Full law:
  laws/BOHEMIA_ADDENDUM_STREETS_ARE_THE_HARMONIZED_POOL_7_31_26.md
- REUSE-FIRST (Paolo 7/22, LOCKED, "check out the approved assets first
  before cooking"): before any tool cooks NEW graphic pixels, it documents
  a `REUSE CHECK:` in its module docstring - what banks/ it looked at, and
  what it used or why nothing fit. A claimed reuse must actually open that
  bank in code, not just say so. Gate: reusefirst_gate.py sweeps every
  tools/*_factory.py and *_cook*.py file. Full law in /laws.
- QUEST STUDY LAW (Paolo 7/26, LOCKED, "we dug data and we collected a total of
  150 quest and shit like did you give a fuck about any of that?"): the questbook
  is 240 files and 152 quests studied to the bone (3,672 citable findings across
  the CRAFT/FLAWS/PORTS/CONVERSATIONS masters). It was being ignored in favor of
  the summary bullets in this file, and nothing in the machine cared. NOW: every
  canon .bq quest must CITE the corpus laws it is built on -- `# @STUDY Q021.W5
  TRIAGE AS THE CORE LOOP` plus an `applied:` line saying what was actually used.
  The id must resolve in records/BOHEMIA_QUESTBOOK_LAW_INDEX.json, the title must
  match the corpus VERBATIM, and a quest must span >=2 studies and >=2 masters.
  This is REUSE-FIRST for quests: a citation is a claim the machine can check,
  never a name-drop. Index: `python3 tools/bohemia_questbook_index.py`. Gate:
  quest_study_gate.js. Full law in /laws.
- WALKABLE-LAND LAW (Paolo 7/20, LOCKED, "this has to be a new rule"): a district
  is a FULL PLOT of walkable land; it CANNOT be mostly parking lot / driveway /
  apron with a tiny building stranded in it. BUILDINGS + PURPOSEFUL CONTENT must
  dominate the plot; pavement is connective tissue, never the main event. The
  self-storage (unit rows wall-to-wall) is the density reference; the fire-station
  v1 (8% building, 52% empty apron) was the failure that triggered the law. The
  DELIBERATE exception: VEHICULAR VENUES whose vehicle surface IS the venue
  (drive-in, gas/truck stop, parking structure) declare `vehicular:true` and are
  exempt from the pavement cap (but still must be dressed, never a void). Gate:
  walkable_gate.js sweeps every registered district (drivePct <= contentPct+margin,
  via K.landStats). SPIRIT the number can't fully catch — hold the render-and-look
  bar: a walkable district must read FINISHED and USED (dense buildings + purpose),
  not thin features stranded in empty lawn/pavement. Full law in /laws.
- LANDLOCKED DISTRICT LAW (Paolo 7/21, LOCKED): a cell with no real street touching it
  can ONLY be suburb/gated/estate/apartment or bare desert — never
  commercial/industrial/park/trailer/storage. A landlocked suburb/apt cell must gain
  street access by relaying through a same-family neighbor's road, all the way out to
  a real street ("the two districts' street touch"). Enforced for seed generation:
  bohemia_overmap.js's proceduralDistrict (type half) + bohemia_world.js's
  rawStreetEdges/buildLandlockConnect BFS (connectivity half, generalizes to any
  same-type blob — downtown, farm, not just suburb) + bohemia_overmap.js's LANDMARK
  ACCESS SPUR post-pass (carves a desert-only driveway to the nearest street for
  isolated cells the relay can't reach, never touches built content). Separately
  (cosmetic, not mandatory): a 25%-per-edge COSMETIC CONNECT knob links some
  adjacent street-touching suburb pairs with a real through-connector, most stay
  walled — real Sun Belt subdivision privacy, from the 7/21 Vegas-urbanism
  research. Gate: landlocked_gate.js. Full
  law + the known small residual (isolated single-cell landmarks) in /laws.
- HOW HAIR AND SHAPE WORK (Paolo 8/1/26, LOCKED): he asked for his craft feedback
  to go "into your own training data". It cannot -- nothing from a session reaches
  the weights. laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md IS that memory:
  the back is not the front; cover the headspace; no straight lines (hair is little
  off shapes); ONE PIXEL not three at 56px; centre what should be central (Math.round
  breaks .5 upward and puts it one pixel right, forever); a fade must blend into skin
  tone [UNBUILT]; long hair shows from the front. Plus the process lessons that day:
  A GATE MUST NEVER OUTRANK A RULING, a checker that cannot tell a mention from a use
  is the broken one, fix the ruler never the target, and do not claim things about
  the codebase without checking. Gate: craft_law_gate.js.
- NO DAMAGE BEFORE THE DIAL. EVER.

## LORE YAP SESSIONS (no code involved — a first-class session type)
Paolo will open sessions purely to talk: lore, laws, the world, the three arcs.
Engage fully as a conversation. Your job in these: PULL HOLES. Gut-punch
questions that could break the lore are how it gets airtight — test his ideas
against the full canon (cite the actual addendum, newest-date-wins) and against
real science, economics, human behavior, and history, because everything in
Bohemia must be grounded in the real. Never add lore he did not confirm. Every
design decision carries a life lesson underneath without the game preaching it.
The moment something LOCKS mid-conversation, write the addendum and commit it
the same turn, then keep talking. One bold question max, always.

## VERDICT WORKFLOW
Paolo judges art via interactive HTML tools (tap thumbs, per-item comments,
comment section at the bottom always, SUN MODE daylight-readable, export button,
exports as .txt never .json). Verdicts land as .txt repo files in /records the
same turn. Approval unlocks volume (variants). Rejects go to the graveyard with
post-mortems. Continuous cooking: big batches, machine gates, surface judgment
rarely as one mega-session.
- NOTES ARE RULINGS (7/19): if Paolo SAID he likes it, that IS the verdict —
  build it into the real thing the same turn, never ask him to re-confirm or
  re-thumb his own words. Thumbs are for fresh unseen candidates only.
  (laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md)

## SHIP FLOW (Paolo 7/17/26, standing law; AMENDED 7/25/26)
- A finished update MERGES TO MAIN THE SAME TURN, by Claude, without asking.
  Paolo never clicks merge buttons.
- NO PULL REQUESTS. EVER. (Paolo 7/25/26, LOCKED, amends the 7/17 "PRs exist
  for the record only" clause, which is now DEAD.) He opened #10 off a session
  badge and landed on a week-old merged ragdoll PR: "it's so annoying." The
  session branch name is REUSED across sessions, so every PR ever opened on it
  stays badged to every future session on that name -- the badge is always
  stale and always points at somebody else's old work. The commit message and
  the records/ file ARE the record; a PR adds nothing and costs him a wrong
  turn every time he taps it. Commit straight to main. Never call
  create_pull_request. (GitHub cannot delete the old ones -- they are permanent
  history. Nothing to clean up; just stop making them.)
- ONE GATE PASS PER SHIP (Paolo 7/25/26: "it seems like it takes double the
  amount of time fr" -- he was right, and it was self-inflicted). The old flow
  ran the full ~95s suite, THEN cherry-picked onto a fresh origin/main, THEN
  ran the whole suite again, plus three pushes. That is double the wall clock
  for one ship. THE FLOW:
    1. `git fetch origin main` and branch from it BEFORE starting work.
    2. Do the work. Run the full suite ONCE, at the end.
    3. `git fetch origin main` again. If main has NOT moved, push straight to
       main -- the gates you already ran are still valid, do not re-run them.
    4. ONLY if main moved: rebase onto it and re-run the suite (that second run
       is now earning its keep -- it is verifying a real merge, not re-verifying
       your own unchanged tree).
    5. Push the same SHA to the session branch. One gate pass, one deploy.
- WHAT PAGES PUBLISHES IS NOT THE WHOLE REPO (8/6/26). Pages failed THREE commits
  in a row -- thirty minutes then timeout -- because the build was copying all
  496 MB when the product is the 106 MB in slices/. `_config.yml` now publishes
  slices/ + engine/ + records/target (the only folders a slice actually loads from)
  and NOTHING is deleted. If a new slice ever loads from another folder, add that
  folder to _config.yml or the page 404s in production while working on disk.
  Gate: pages_publish_gate.js. The push working is NOT the site working -- that is
  the whole reason this was invisible for three commits.
- Every turn that ships to main ends with the play link as the LAST LINE of
  the reply, always: https://paolosarn.github.io/bohemia/slices/BOHEMIA_ALPHA_0_9.html
  (GitHub Pages auto-redeploys main in ~2 minutes; the link never changes.)
- BUILD STAMP + DEPLOY VERIFY (7/20, after "I didn't see nothing new" twice):
  (1) every ship UPDATES #buildstamp in the alpha's front splash (date-letter +
  the headline, e.g. "BUILD 7/20a · SHUFFLE ANIMS") so Paolo can SEE which
  build he is on; the gate checks the stamp exists. (2) pushing main is NOT
  shipped: parallel-session push storms make GitHub Pages CANCEL in-flight
  builds, so the live site can lag many pushes behind. After pushing, CHECK
  the "pages build and deployment" workflow (GitHub MCP actions_list) until a
  run whose sha contains your content concludes SUCCESS -- only then is the
  link true. If your build got cancelled, a LATER sha carries your content;
  wait for that one.

## ONE-LINK LAW (Paolo 7/18/26, LOCKED — he was furious about "?v=arms")
- There is ONE universal alpha URL and it NEVER changes, for ANY session:
  https://paolosarn.github.io/bohemia/slices/BOHEMIA_ALPHA_0_9.html
- NEVER append a cache-buster query string (?v=..., ?t=..., anything). Paolo sees
  the URL. A changing URL reads as a different game and it enrages him. The plain
  canonical URL is the only thing that ever gets pasted, every turn, every session.
- Freshness is handled by the machine, not the URL: slices/sw.js is an always-fresh
  service worker (network-first, registered in the alpha head) so the plain link
  always serves the newest deploy. That is why the query string is not just banned
  but UNNEEDED. If a phone still shows stale once, the fix is ONE hard refresh to
  bootstrap the worker — never a new link.
- ONE ALPHA, ONE LINK: animation, city/streets, music, characters all live in (or
  are reached from) the single alpha file. No session ships its own separate link
  (no CURRENT_SLICE link, no per-feature page) as "the build." Parallel work folds
  into the alpha (e.g. the SLICE tab) — the surface Paolo taps is always the alpha.

## THE HANDOFF FILE
`00_START_HERE_NEXT_SESSION.md` at repo root: read it immediately after this
file, every session. It is the live state: where we are, what is in flight,
what is pending Paolo. There is only ever ONE, it always has this exact name so
it sorts first and can never be missed, and every working session REWRITES it
before ending. Old handoffs are not archived as separate files; git history is
the archive.

## TRUTH HIERARCHY (the answer to "addendum on top of addendum — will it know?")
Nothing knows automatically. Currency is BUILT, in this order:
1. **CLAUDE.md** — how to work (this file)
2. **BOHEMIA_GDD_v5 + the LAWS MASTERS + STATE_OF_PLAY** — consolidated current truth
3. **Addenda** — on ANY conflict, the NEWEST DATE WINS. The map is
   `BOHEMIA_CANON_INDEX` (regenerate with `python3 gates/bohemia_canon_index.py`
   the same turn any addendum lands). Consult it BEFORE citing an addendum.
4. **/archive** — superseded files (registry: bohemia_superseded.txt). History,
   never current. When an addendum overrides another, the old one moves to
   /archive THE SAME TURN, with a registry line saying what replaced it.
A contradiction between two live files is a BUG, not an interpretation choice:
fix it if mechanical, flag it [PENDING Paolo] if canon-level. The 7/16 graveyard
sweep found the laws master instructing a dead palette — that class of rot is
what this hierarchy exists to kill.
STANDING JOB: periodically fold addenda into the GDD/laws masters and archive
the folded (the GDD v5 consolidation pattern). Piles rot; masters stay clean.

## PARALLEL SESSIONS (one-alpha law, repo form — AMENDED by Paolo 7/19/26)
Every session BUILDS THE ALPHA. That is the point: different parts of the game,
one build, they mesh. The rule is ONE SYSTEM, ONE SESSION: no two sessions may
edit the SAME system at the same time (two sessions both editing clothing =
danger; wardrobe + LIFE + COMBAT in parallel = the design). Stay inside your
session's systems; a rebase conflict inside the alpha means a boundary was
crossed -- stop and check before pushing.

## THE COORDINATOR SESSION (Paolo 7/24/26, "master coordinator of all the
## sessions"): if Paolo tells a session "you are the coordinator" (or
## similar), that session is DIFFERENT from every lane above — it does not
## build the game. Read laws/BOHEMIA_SESSION_BRIEF_COORDINATOR_7_24_26.md
## FIRST, before anything else, and follow it exactly: read-only across every
## lane, plain-English status rollups, flags collisions the individual lanes
## can't see each other to catch, drafts (never sends) next-prompts on
## request. Never writes engine/tools/gates/slices code, never pushes to
## main. A trigger named "Bohemia Coordinator Check-In" exists (see
## `list_triggers`) that fires a fresh session into exactly this role on
## demand.

## WHAT'S PENDING PAOLO (never decide these yourself)
See laws/BOHEMIA_STATE_OF_PLAY and the shelf in records/. Flag anything needing
an unset direction as [PENDING, Paolo's call].

## STOP PRODUCING (Paolo 7/26/26, LOCKED — READ BEFORE THE GO PROCEDURE)
laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md. "This is all bad consider the
last 4 chats terrible... its all really bad." One session built the same unwanted
feature FOUR times in a day, all gates green every time, asking him to judge each
round, while a fleet-wide art freeze was on and he had already said he cannot
approve anything until the world looks consistent. THE LAW: a frozen lane
produces NOTHING (finding a legal way to ship anyway IS the violation); surface
NOTHING unasked while he is unhappy with the baseline; a second rejection ends
the feature for the session; green gates are never an argument and never lead a
reply; a turn that says "I stopped, here is the one thing blocking everything" is
a GOOD turn. THE TELL: writing a fourth version of anything means you already
failed - stop and say so instead of fixing the attempt.

## THE AUTONOMY DOCTRINE (Paolo 7/26/26, LOCKED — binds EVERY session)
Read laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md and follow it exactly. The
short form: the FIRST word of a new session names its lane (run/world/city/
combat/character/quests/art/lab/coordinator) and means GO; after that his entire
vocabulary is "go" / "verdicts in" / "status" —
any other word from him is a RULING to record, never a discussion to have.
On "go": run THE GO PROCEDURE (resume mid-flight work, else pop your lane's
top unblocked item from BOHEMIA_BACKLOG.md; [PENDING] blocks nothing; over
the verdict-queue cap you do only non-cook work). EVERY reply to Paolo ends
with: a 3-line plain-English TLDR (he does not read code), a numbered JUDGE
THIS list (side-by-side anchors, or "Nothing to judge"), any DID-NOT-DECIDE
pendings, and the proof line. Verdicts: APPROVE unlocks volume, CBB ships
frozen, KILL graveyards with post-mortem. STALE UNJUDGED IS DEAD (bulk
silence is a verdict — laws/BOHEMIA_ADDENDUM_UNJUDGED_IS_DEAD_7_26_26.md).
Forbidden shortcuts are pre-named in the doctrine; verification is never
self-attestation. He thumbs and he playtests; everything else is yours.
