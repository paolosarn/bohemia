# BOHEMIA — THE PAOLO TASTE CANON
### Distilled 7/25/26 from every recorded verdict, graveyard entry, post-mortem, reaction-born law, and quoted reaction in the repo. This is Paolo's flavor, turned into a reference and a pre-filter so weak batches die before they ever reach his thumbs.

## HOW TO USE THIS FILE
- **The filter KILLS, it never APPROVES.** Nothing here lets anything ship as canon. `tools/bohemia_taste_filter.py` uses the machine-checkable NEVERs below to kill obvious violators before Paolo judges the rest. Passing the pre-filter means "not obviously wrong," never "approved." Only Paolo's real thumbs approve.
- **Every NEVER and LIKE cites its source** — the exact verdict/post-mortem/law it came from, so it is auditable. `gates/taste_gate.py` fails if any rule lacks a `(src: ...)`.
- **UNKNOWN is honest, never guessed.** Where Paolo has made no ruling, it is marked UNKNOWN. Do not invent a preference to fill a gap.
- **Newest ruling wins** on any conflict, same as canon law. Conflicts are noted inline with the winner.
- **MACHINE-CHECKABLE NEVERs** carry a `[MACHINE: ...]` tag naming the signal a script can detect. The rest are render-and-look, Paolo's eye only.

---

## 0. CROSS-CUTTING (governs every category)

### Voice / tone (how Claude AND the game's own text read)
- **NEVER** use an em dash (— or –) anywhere, in chat, UI copy, or game text. (src: CLAUDE.md; BOHEMIA_CREATOR_PROFILE.md) [MACHINE: any U+2014/U+2013 in shipped text]
- **NEVER** write so cleanly it reads like a machine wrote it; no corporate AI phrasing ("align on next steps," "leverage," "seamless," "delve"). (src: BOHEMIA_CREATOR_PROFILE.md) [MACHINE: banned-phrase blocklist]
- **NEVER** call anything of his "slop," and never call the target "super"/"ultimate"/maximal — "'Super' is an insult." (src: BOHEMIA_LAUNCH_SESSION_BRIEF_7_16_26.md; BOHEMIA_WORKFLOW_HOW_PAOLO_TRAINS_ME.md)
- **NEVER** add unsolicited emotional support, therapy suggestions, or hotline interjections. (src: BOHEMIA_CREATOR_PROFILE.md)
- **LIKE** direct, casual, swears freely, zero fluff, gets to the point immediately. (src: CLAUDE.md; BOHEMIA_CREATOR_PROFILE.md)
- **NEVER** give in-world names that are nerdy lore or corporate product names; names are nationally legible, organic, what an ordinary person would say. (src: BOHEMIA_CREATOR_PROFILE.md)

### Process (how work is presented and ruled)
- **LIKE** NOTES ARE RULINGS: if Paolo said he likes it, that IS the verdict; build it same turn, never re-thumb his own words. Thumbs are for fresh unseen candidates only. (src: laws/BOHEMIA_ADDENDUM_NOTES_ARE_RULINGS_7_19_26.md)
- **NEVER** ask more than one bold question per response, and never make him dig in files. (src: CLAUDE.md)
- **NEVER** comment on his spelling or take a garbled voice-typed word literally; read through for intent. (src: CLAUDE.md; BOHEMIA_CREATOR_PROFILE.md)
- **LIKE** ship a lot per turn; small timid turns are a standing complaint. (src: CLAUDE.md; BOHEMIA_WORKFLOW_HOW_PAOLO_TRAINS_ME.md)
- **NEVER** optimize for impressive/thorough/maximal instead of the real thing done calmly; "REALISTIC BEATS IMPRESSIVE, always." (src: records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md)

### Verify on the real surface
- **NEVER** verify art on a side-door probe or numeric gates alone; look at the rendered pixels on the surface Paolo sees before shipping. A symptom that survives content changes is a PIPELINE bug. (src: laws/BOHEMIA_ADDENDUM_VERIFY_ON_THE_REAL_SURFACE_7_18_26.md)

### Purple (the one color law that touches everything)
- **NEVER** use purple/magenta/violet anywhere except the Amalgamation/Network threshold (the hatch, agent iris, neurolink); scarcity is its power. (src: laws/BOHEMIA_ADDENDUM_PURPLE_RESERVATION_LAW_7_10_26.md) [MACHINE: purple pixels (r>g+25 and b>g+25) outside the purity allowlist — gates/bohemia_purity_gate.py]
- **NEVER** ship REDMAG-category tiles into a world bank; they are a quarantine list, usable only in Amalgamation contexts. (src: laws/BOHEMIA_ADDENDUM_PURITY_GATE_V2_7_16_26.md) [MACHINE: REDMAG token in a non-Amalgamation bank]

### The graveyard (dead stays dead, everywhere)
- **NEVER** re-add or reference any token in gates/bohemia_graveyard.txt as if it works; a dead thing stays dead, a fresh cook answers a dead slot with a fresh name. (src: gates/bohemia_graveyard.txt) [MACHINE: live reference to a dead token — gates/bohemia_graveyard_gate.py]

---

## 1. BUILDINGS

- **NEVER** draw a building flat side-on ("2D scroller" billboard) or top-down flat; every building is the world's three-quarter 45-degree view. (src: laws/BOHEMIA_ADDENDUM_45_DEGREE_ART_LAW_7_17_26.md) [MACHINE: no sky-lit visible top / no ellipse cross-section — gates/art_45_gate.py]
- **NEVER** hand-paint building faces in code; procedural pixel faces cap at programmer-art. Use the real-3D-projection bake. (src: laws/BOHEMIA_ADDENDUM_HERO_BUILDING_LESSONS_7_24_26.md)
- **NEVER** ship a generic box with no signature; every building type has ONE unmistakable iconic feature and reads its purpose at a glance ("they were all dogshit... you could tell what the building was"). (src: records/BOHEMIA_DISTRICT_HERO_VERDICT_7_23_26.txt; graveyard DISTRICT_HERO_v1_7_23_26)
- **NEVER** invent a hero building; match the walkable district by pulling the palette and key landmarks from that district's engine module. (src: laws/BOHEMIA_ADDENDUM_HERO_BUILDING_LESSONS_7_24_26.md)
- **NEVER** include a part you cannot name; if you cannot write down what each part is, it does not go in, and no hero ships without its parts in the dossier. (src: laws/BOHEMIA_ADDENDUM_HERO_BUILDING_LESSONS_7_24_26.md) [MACHINE: hero missing from the parts dossier — gates/hero_dossier_gate.py]
- **NEVER** float a door or crop the plot; doors sit at ground on the front face, the whole square tile fits in frame. (src: laws/BOHEMIA_ADDENDUM_HERO_BUILDING_LESSONS_7_24_26.md)
- **NEVER** put a building on grass; buildings sit on a paved pad. Grass only where it IS the point (a park's turf). (src: laws/BOHEMIA_ADDENDUM_HERO_BUILDING_LESSONS_7_24_26.md)
- **NEVER** use a hard 1px black outline / keyline; edges read from the value step between the three flat face-tones. (src: records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md) [MACHINE: continuous near-black ring along the sprite silhouette]
- **NEVER** make walls dark/muddy; walls are PALE, the saturated color lives on the ROOF. (src: records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md) [MACHINE: wall-region mean brightness low / roof-not-more-saturated-than-wall]
- **NEVER** give an abandoned building warm lit-window glow; windows are DEAD DARK glass (the night read is dark, not lit). (src: records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md) [MACHINE: warm-glow window pixels at night]
- **LIKE** chunky, simple, BOLD masses on a dressed square base plot, soft drop shadow, soft flat 3-tone shading (bright top / mid front-right / darker front-left), colored roof over pale walls, big neat readable window grids, one iconic signature; read BIG and grounded, wide not tall-skinny. (src: records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md)
- **LIKE** render ground hardware as ellipses with sky-lit visible tops, edges bowing toward the viewer, two-plus faces per box (the blessed lamp bank is the reference). (src: laws/BOHEMIA_ADDENDUM_45_DEGREE_ART_LAW_7_17_26.md)
- **LIKE** only ONE size per vehicle class near a building — one car, one bus, one trailer. (src: laws/BOHEMIA_ADDENDUM_HERO_BUILDING_LESSONS_7_24_26.md) [MACHINE: gates/vehicle_size_gate.py]
- **LIKE** desert-suburb houses read as hip roofs (low pitch), stucco tan walls, small recessed windows with pop-out frames, garage door forward as the biggest front feature; SHINGLE is the canon roof, not S-tile ("they look like shingles bro"). (src: records/BOHEMIA_DESERT_HOUSE_45_RESEARCH_7_21_26.md) [newest-wins: overrides the S-tile candidates in BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt]
- **LIKE** all house-skin candidates approved: shingle/gravel roofs, plain/window/boarded/door walls, tan/gold/red yard grounds. (src: records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt)

---

## 2. DISTRICTS

- **NEVER** let drivable pavement (parking/driveway/apron) dominate a district; a tiny building stranded in a big apron is the failure (fire station v1: 8% building, 52% apron). (src: laws/BOHEMIA_ADDENDUM_WALKABLE_LAND_LAW_7_20_26.md) [MACHINE: drivePct > contentPct+margin, non-vehicular — gates/walkable_gate.js]
- **NEVER** cram a district to look impressive ("super park"); a real park is mostly open lawn with a few things. (src: records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md; graveyard PARKFAIL-SUPERPARK) [MACHINE: a park's open lawn <= 55% — gates/park_gate.js]
- **NEVER** use perfect geometric primitives for paths or let a feature punch through a path; draw amenities first, wind the trail around them. (src: graveyard PARKFAIL-CIRCLE; records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md)
- **NEVER** add streets to fill dead corners; a dead corner stays named dead yard ("you added more streets wtf"). (src: records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md)
- **NEVER** place a tile you cannot name; empty apron/placeholder space is a failure (EXPLAIN-EVERY-TILE). (src: records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md) [MACHINE: void fraction / unnamed tiles over threshold — gates/walkable_gate.js]
- **NEVER** build a central cul-de-sac COURT suburb block (dead hole, fewer homes); THE BLOCK packed grid is the one canonical suburb block. (src: records/BOHEMIA_SUBURB_VERDICT_BLOCK_APPROVED_7_18_26.txt; graveyard suburb central cul-de-sac court)
- **NEVER** ship a district ambiguous about indoor vs outdoor; commit to one (swap meet v1 killed for "not sure if indoor or outdoor"). (src: laws/BOHEMIA_ADDENDUM_WALKABLE_LAND_LAW_7_20_26.md)
- **LIKE** pack a district wall-to-wall with buildings and purposeful content; self-storage (unit rows wall-to-wall) is the density reference. Pavement is connective tissue, never the event. (src: laws/BOHEMIA_ADDENDUM_WALKABLE_LAND_LAW_7_20_26.md)
- **LIKE** the vehicular-venue exception (drive-in, gas/truck stop, parking structure): declares vehicular:true, exempt from the pavement cap, but still must be dressed, never a bare black rectangle. (src: laws/BOHEMIA_ADDENDUM_WALKABLE_LAND_LAW_7_20_26.md)
- **LIKE** the packed-grid suburb block: ~22-29 homes filling the 96m block, no empty bands, corners filled, each home a >=3-tile dead backyard to the perimeter wall, apron driveway to a front-corner garage. (src: records/BOHEMIA_SUBURB_VERDICT_BLOCK_APPROVED_7_18_26.txt)

---

## 3. CLOTHING

- **NEVER** present a recolor as progress; progress is a NEW garment SHAPE (new geometry/silhouette/category). Colorways are filler, never the headline. (src: laws/BOHEMIA_ADDENDUM_STRUCTURE_NOT_COLOR_7_19_26.md) [MACHINE: a candidate whose geometry/alpha-mask matches an existing shape, only the ramp differs — gates/structure_gate.js]
- **NEVER** put purple on non-Amalgamation clothing, even inside the COLORFUL rainbow. (src: records/BOHEMIA_CLOTHING_CANON.txt; laws/BOHEMIA_ADDENDUM_DRESS_CODE_BY_RANK_7_21_26.md) [MACHINE: purity r+b-over-g test]
- **NEVER** ship a coat/trench closed like a onesie/overalls; every outer layer is worn OPEN down the front so the shirt and pants show. (src: laws/BOHEMIA_ADDENDUM_OPEN_COAT_LAW_7_18_26.md) [MACHINE: gates/open_coat_gate.js — left flap + right flap + open center slit]
- **NEVER** make a long coat read as "shorts connected to the shirt"; it drapes as one A-line panel and lives in the OUTER layer over a base shirt. (src: records/BOHEMIA_CLOTHING_GRAVEYARD.txt)
- **NEVER** make a hood by painting a cowl on the torso; a hood is real additive geometry OUTSIDE the body silhouette off the nape. (src: records/BOHEMIA_CLOTHING_GRAVEYARD.txt; records/BOHEMIA_CLOTHING_CANON.txt) [MACHINE: gates/hood_gate.js — outside-skeleton geometry]
- **NEVER** show skin at the neck/collar/back-of-head under a hood; the hood covers every neck pixel and layers over the face from behind (no skin slits). (src: records/BOHEMIA_CLOTHING_CANON.txt) [MACHINE: gates/hood_gate.js — back faceCov 100%, no neck skin]
- **NEVER** float a hat/beanie or ignore the durag hat line; every hat derives its bottom border from the canon durag line and never competes with Paolo's durag. (src: records/BOHEMIA_CLOTHING_GRAVEYARD.txt) [MACHINE: gates/hat_gate.js — border from HAT_MAX_Y]
- **NEVER** make a pyramid/triangle hat; a hat is a rounded BLOCK at full head width (dome, not skull). (src: records/BOHEMIA_CLOTHING_CANON.txt) [MACHINE: gates/hat_gate.js DOME check]
- **NEVER** put a mask/bandana over the eyes; the eye line is sacred, masks cover nose/mouth/chin only (gas mask is the one full-face exception). (src: records/BOHEMIA_CLOTHING_CANON.txt) [MACHINE: gates/acc_gate.js eyes-sacred zone]
- **NEVER** draw shades as a flat line that does not wrap the head; they are a band across the head to the ears with a glint, ending at the ear in profile, invisible from behind. (src: records/BOHEMIA_CLOTHING_GRAVEYARD.txt; records/BOHEMIA_FACE_CALIBRATION_7_19_26.txt) [MACHINE: gates/acc_gate.js]
- **NEVER** flat-fill / body-trace a garment; the corpus is PAINTED, with real fabric shading and garment-specific detail. (src: records/BOHEMIA_CLOTHING_GRAVEYARD.txt; records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md)
- **LIKE** dusty, worn, world-ambient salvaged tones, single-hue-safe. (src: records/BOHEMIA_CLOTHING_CANON.txt)
- **LIKE** realistic over impressive: one identity piece plus a small tell, never matching separates or one solid color head-to-toe. (src: laws/BOHEMIA_ADDENDUM_DRESS_CODE_BY_RANK_7_21_26.md)
- **LIKE** rank drives coverage: rookies wear anything if >=50% of the body reads the faction color; veterans wear the named canon kit. (src: records/BOHEMIA_DRESS_CODE_MECHANISM_7_21_26.txt) [MACHINE: gates/dress_gate.js]
- **LIKE** every generator reads only the part-id grid so the whole wardrobe carries to the woman rig with zero new clothing code. (src: records/BOHEMIA_CLOTHING_CANON.txt; laws/BOHEMIA_ADDENDUM_WOMAN_RIG_7_21_26.md)

---

## 4. MUSIC

- **NEVER** use feedback loops, createDelay, or createConvolver in any voice; anything that rings is excited-and-decaying (the SCREECH LAW, it physically hit his ears). (src: laws/BOHEMIA_ADDENDUM_MUSIC_VARIETY_HORROR_LAW_7_8_26.md) [MACHINE: delay/convolver/feedback node present, or master peak outside ~0.10-0.20]
- **NEVER** reuse the same synthesis skeletons batch to batch ("same body, different clothes"); every new song births a brand-new lead voice. (src: laws/BOHEMIA_ADDENDUM_MUSIC_VARIETY_HORROR_LAW_7_8_26.md; laws/BOHEMIA_ADDENDUM_NEW_VOICES_LAW_7_7_26.md) [MACHINE: a "new" lead reused across songs — _newvoice_gate.js]
- **NEVER** let two songs in one batch share scale + feel + kick pattern. (src: laws/BOHEMIA_ADDENDUM_MUSIC_VARIETY_HORROR_LAW_7_8_26.md) [MACHINE: duplicate (scale,feel,kick) tuple in the unjudged set]
- **NEVER** revive a graveyarded SONG; a dead slot gets a fresh song with a fresh name. (src: records/BOHEMIA_MUSIC_GRAVEYARD_7_18_26.txt) [MACHINE: graveyard token reuse]
- **NEVER** let the melody read as pure texture; the melody leads under the dread, pure texture reads as unfinished. (src: records/BOHEMIA_MUSIC_GRAVEYARD_7_18_26.txt)
- **LIKE** post-apocalyptic Final Fantasy horror: ruined grandeur, dead chapel choirs, bells in empty casinos, but MELODIC and emotive under the dread, never drone-flat, never aggression without melody. (src: laws/BOHEMIA_ADDENDUM_MUSIC_VARIETY_HORROR_LAW_7_8_26.md; tools/BOHEMIA_MUSIC_COOK_PROMPT.txt)
- **LIKE** kill the SONG only, not its voices; retired voices/topologies stay legal and get tried again in new fashions. (src: records/BOHEMIA_MUSIC_VERDICT_RECORD_7_19_26.txt) [newest-wins 7/20: supersedes earlier "voice retired with the song" lines]
- **LIKE** old rack voices may touch new songs (the rack is a living orchestra); sameness was about skeletons, not reuse. (src: laws/BOHEMIA_ADDENDUM_NEW_VOICES_LAW_7_7_26.md)
- **LIKE** a scene image / one-line scene is the strongest input; references are decoded for machinery, never copied. (src: laws/BOHEMIA_ADDENDUM_MUSIC_VARIETY_HORROR_LAW_7_8_26.md)
- **LIKE** (newest, 7/24, requested not yet built) retire faction combat music, play the OVERWORLD day-phase tracks in combat; and while combat is active only, beat one of every bar plays ~+6dB as the Dead Shot Dial hit-marker. (src: records/BOHEMIA_COMBAT_SOUND_REQUESTS_7_24_26.md) [newest-wins over the 7/19 faction-pool combat rotation]

---

## 5. ANIMATION (clips, deaths, faces, combat feel)

- **NEVER** move structure (jambs, posts, headers, frames, borders) in an animation; only the designated LEAF animates. Which edge is structure depends on what the object is. (src: laws/BOHEMIA_ADDENDUM_ANIMATION_PIXEL_LAW_7_13_26.md; laws/BOHEMIA_ADDENDUM_LEAF_PIXEL_GATE_7_16_26.md) [MACHINE: alpha of a structure-edge pixel changes across frames — gates/bohemia_leaf_gate.py; rgb-only change is glow, flagged not failed]
- **NEVER** reshape, mesh, mirror, or "fix" Paolo's painted region geometry; BAKED.pose is the render base, animation stacks on top, never alters it. (src: CLAUDE.md RIG LAW; laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md)
- **NEVER** invent/redraw arms; the rig lifts the real arm pixels and pivots about the shoulder. (src: laws/BOHEMIA_ADDENDUM_RIG_AND_ZONES_6_29_26.md)
- **NEVER** on NE/NW facings layer an arm and its hand to opposite sides of the torso; arm+hand move as one unit. (src: laws/BOHEMIA_ADDENDUM_NE_ARM_UNIT_7_20_26.md) [MACHINE: gates/combat_anim_gate.js ARM-UNIT]
- **NEVER** keyframe the headshot death; it is fake-physics ragdoll with limb rules (keyframe crumple "so stiff"). (src: records/BOHEMIA_ANIM_DEATHS_7_17_26.txt) [newest-wins 7/18: overrides the 7/2 keyframe-first guidance for the death]
- **NEVER** let a corpse pop/teleport joints, fold into a box, end sitting/standing, glide floaty-slow, tuck head or waist into the legs, spread-eagle, dislocate arms, or lie straight into the screen; it falls fast, slumps flat along a screen diagonal, thighs within a realistic hip cone, in its own cardinal direction. (src: records/BOHEMIA_ANIM_DEATHS_7_17_26.txt) [MACHINE: per-frame joint delta, 8 distinct spine orientations, leg-spread cap, constant bone length, flat-and-still freeze]
- **NEVER** morph/resample the head as it moves; it is translate-only (or lossless 90-degree snap), and it wiggles with the body within ~21 degrees of the spine (the always-face-north lock is revoked for the ragdoll). (src: records/BOHEMIA_ANIM_DEATHS_7_17_26.txt) [MACHINE: head bbox byte-identical per frame]
- **NEVER** build standalone beat-tactic mini-game grammars; combat mechanics live INSIDE the real fight ("i didnt like any of your beat tactics they were ass"). (src: records/BOHEMIA_COMBAT_LAB_VERDICT_2_7_20_26.txt) [newest-wins over the 7/19 tentative reactions; graveyard LABFAIL-*]
- **NEVER** deal damage before the Dead Eye dial; a miss is the only thing that costs HP (return fire on a miss). (src: laws/BOHEMIA_ADDENDUM_COMBAT_RESOLUTION_7_1_26.md; CLAUDE.md)
- **NEVER** verify a clip on numeric gates alone; the crawl-dying regression shipped green on numbers and read wrong on the real surface. (src: records/BOHEMIA_COMBAT_ANIM_REQUESTS_2_7_20_26.txt; laws/BOHEMIA_ADDENDUM_VERIFY_ON_THE_REAL_SURFACE_7_18_26.md)
- **LIKE** combat that is fun, tactical, rewarding, and SNAPPY; cover is one tool of safety among many, never a turtle button (RF4 x Cyberpunk north star). (src: records/BOHEMIA_COMBAT_NORTHSTAR_ROGUEFABLE4_CYBERPUNK_7_24_26.md)
- **LIKE** each melee weapon its own distinct swing so windup-then-strike reads (shiv jab, bat arc, spear drive); three swings, three mechanisms. (src: records/BOHEMIA_COMBAT_ANIM_BATCH13_7_20_26.txt)
- **LIKE** a fleeing enemy reads instantly as "I give up, I'm running" (panic sprint hands high, or stumbling scramble looking back), never a normal walk. (src: records/BOHEMIA_COMBAT_ANIM_REQUESTS_2_7_20_26.txt)
- **LIKE** faces use Paolo's exact exported per-direction offsets, un-symmetrized (profile nose moves 6px onto the leading edge); emotion is 1-2px brow/lip offsets, no new art per character. (src: records/BOHEMIA_FACE_CALIBRATION_7_19_26.txt; laws/BOHEMIA_ADDENDUM_MICRO_EXPRESSIONS_6_29_26.md)
- **LIKE** THE SHOVE, weapon-typed melee movement, the FORESIGHT perk, IRON SHOULDER / LONG ARM, KICK-LOCK (the in-fight mechanics that survived the lab). (src: records/BOHEMIA_COMBAT_LAB_VERDICT_2_7_20_26.txt)

---

## 6. PROPS (street furniture, markings, signals, walls, headwear)

- **NEVER** put anything on a sidewalk except whitelisted street furniture (lamps, fire barrels, traffic light, ped signal, bench, trash can, hydrant, mailbox, street sign, bus stop, newspaper box, planter, bollard); buildings/ruins/walls/wrecks live past the sidewalk. (src: laws/BOHEMIA_ADDENDUM_SIDEWALK_SANCTITY_ENFORCED_7_16_26.md) [MACHINE: gates/sidewalk_gate.js]
- **NEVER** leave the sidewalk empty either; furniture must actually populate it. (src: laws/BOHEMIA_ADDENDUM_SIDEWALK_SANCTITY_ENFORCED_7_16_26.md) [MACHINE: gates/sidewalk_gate.js furniture count > 0]
- **NEVER** use a yellow line between same-direction lanes; yellow separates opposing DIRECTION, white separates same-direction lanes. (src: laws/BOHEMIA_ADDENDUM_LINE_COLOR_LAW_ENFORCED_7_16_26.md) [MACHINE: gates/line_gate.js]
- **NEVER** run a line across the road axis except as a crosswalk (which owns its cell, color=null); lines run WITH the road axis. (src: laws/BOHEMIA_ADDENDUM_LINE_COLOR_LAW_ENFORCED_7_16_26.md) [MACHINE: gates/line_gate.js orientation]
- **NEVER** draw signals/turn-arrows flat side-on filled; paint them in the 45-degree view like the corpus. (src: records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md) [MACHINE: gates/art_45_gate.py]
- **NEVER** reuse a batch-2 wall reject as a suburb PERIMETER wall; only WB4 is perimeter-approved, the pack vein is dry for perimeter. (src: records/BOHEMIA_WALL_PICKS_BATCH2_VERDICTS_7_17_26.txt; graveyard WALL_BATCH2_REJECTS) [MACHINE: graveyard token in the perimeter pool]
- **LIKE** the 84 two-way-left-turn markings and turn arrows, all approved ("I like all of them good job"). (src: records/BOHEMIA_MARKING_VERDICTS_7_17_26.txt)
- **LIKE** wall variety comes from variants of the 13 approved keys, not from re-mining packs. (src: records/BOHEMIA_WALL_PICKS_BATCH2_VERDICTS_7_17_26.txt)

---

## 7. UI COPY (in-game text and the verdict tools)

- **NEVER** export a verdict/interactive tool's data as .json; export .txt (iOS blanks .json on chat share, which kills the loop). (src: laws/BOHEMIA_ADDENDUM_QUEST_AUTHORING_RESEARCH_7_16_26.md; CLAUDE.md) [MACHINE: a .json/application/json export in a verdict tool]
- **NEVER** append a cache-buster query string (?v=, ?t=) to the one alpha link; a changing URL reads as a different game and enrages him. (src: CLAUDE.md ONE-LINK LAW) [MACHINE: ?-suffixed alpha URL]
- **NEVER** ship a quest/dialogue format that punishes a voice-to-text typo; a garbled line is a warning, never a crash, and round-trips lossless. (src: laws/BOHEMIA_ADDENDUM_QUEST_AUTHORING_RESEARCH_7_16_26.md) [MACHINE: bq parse->serialize->byte-compare]
- **NEVER** gate or score a moral choice on a stat (charm/paragon/renegade/karma/speech/morality); the format rejects those keys. (src: laws/BOHEMIA_ADDENDUM_QUEST_AUTHORING_RESEARCH_7_16_26.md) [MACHINE: banned gate key in a .bq]
- **LIKE** every ship updates the visible #buildstamp on the front splash (date-letter + headline) so Paolo can see which build he is on. (src: CLAUDE.md SHIP FLOW) [MACHINE: buildstamp exists/changed]
- **LIKE** verdict tools default to SUN MODE (daylight-readable, high contrast, 16px min text), a comment box at the bottom always plus per-item comments, one-tap thumbs and a one-tap .txt export. (src: laws/BOHEMIA_ADDENDUM_QUEST_AUTHORING_RESEARCH_7_16_26.md; laws/BOHEMIA_ADDENDUM_VERDICT_WORKFLOW_7_3_26.md) [MACHINE: SUN-MODE default + comment box + 16px present in a verdict tool]
- **LIKE** fixing a broken export/copy pipe outranks new production; a broken pipe kills the whole loop. (src: laws/BOHEMIA_ADDENDUM_VERDICT_WORKFLOW_7_3_26.md)

---

## 8. OPEN TERRITORY — UNKNOWN, never guessed
- **UNKNOWN** whether garment base colors bake the world-ambient grade or stay clean catalog colors (the WORLD GRADE toggle shipped OFF, never ruled).
- **UNKNOWN** the colors for the 7 unruled factions (BLUES, ANARCHISTS, NETWORK, TRADES, VOLUNTEERS, REMNANTS, HOMELESS) and every faction's veteran kit (tables ship EMPTY, Paolo's call).
- **UNKNOWN** hair (named as the next outside-the-skeleton geometry, but no hair taste ruling exists yet).
- **UNKNOWN** whether a corpse may lie face-down ("stomach"); the FACE LAW face-up exception was never ruled, deaths remain UNJUDGED overall (a headshot-3 is expected).
- **UNKNOWN** the fate of the 101 library purple ground tiles: kill or quarantine into REDMAG (left untouched, PENDING).
- **UNKNOWN** commercial frontage pattern (parking-front vs storefront-at-street), suburb yard depth per class, curb-cut law, downtown zero-setback walls, and where ruins live per zone (the BEYOND-SIDEWALK forks, all PENDING).
- **UNKNOWN** hero/layout taste for estates/gated, trailer, and strip/resort districts (setback research only, no verdict).
- **UNKNOWN** whether music tracks MOJAVE GHOST / LONG WALK HOME and a few [PENDING] batches are alive or dead (unresolved verdicts).
- **UNKNOWN** graded-bullet-travel and the weapon-ceiling matrix in the combat north star (explicitly "not yet locked").
- **UNKNOWN** the cybernetic-homeless subdermal magenta "tell" (strict purple law kills it, an Amalgamation-agent exception would allow it; never ruled).

---

## MACHINE-CHECKABLE NEVERS (what tools/bohemia_taste_filter.py kills on)
The filter kills a candidate that trips any of these; everything else it passes THROUGH to Paolo's thumbs. It never approves.
1. Flat side-on art (no sky-lit top / no ellipse) — the 45-degree law. (art_45 signal)
2. Purple/magenta/violet outside the Amalgamation allowlist. (purity signal)
3. A hard continuous near-black outline ring on a sprite. (pocket-city)
4. Wall/building art whose tan share is far off 85%. (tan-wall)
5. A recolor posing as a new shape (geometry/alpha-mask unchanged, only the ramp differs). (structure-not-color)
6. A pavement-dominant district layout (drivePct over contentPct+margin, non-vehicular). (walkable-land)
7. An em dash in shipped UI copy / a cache-buster on the alpha URL / a .json verdict export. (voice + UI-copy laws)
8. Any live reference to a graveyarded token. (graveyard-final)

---
*BOHEMIA — The Paolo Taste Canon — 7.25.26*
*This narrows what reaches Paolo. It never replaces his thumbs. Newest ruling always wins.*
