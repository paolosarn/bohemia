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
- When he corrects something: fix it immediately, root cause, move on.
- Ship A LOT per turn. Small timid turns are a standing complaint.

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

## SHIP FLOW (Paolo 7/17/26, standing law)
- A finished update MERGES TO MAIN THE SAME TURN, by Claude, without asking.
  Paolo never clicks merge buttons. PRs exist for the record only.
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

## WHAT'S PENDING PAOLO (never decide these yourself)
See laws/BOHEMIA_STATE_OF_PLAY and the shelf in records/. Flag anything needing
an unset direction as [PENDING, Paolo's call].
