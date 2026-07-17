# BOHEMIA — QUEST 028: "THE DEGREES OF NOTHING"
Full production build. Built to the dialogue/scene spec; template = 001-027. Tier-3
ENVIRONMENTAL-STORY / place-as-quest (Vault #30 College That Ate Them + tradition XXVII
Elden-Ring world-as-lore + the post-ECONOMIC-collapse thesis made physical). Name
catalog-adjacent. First quest where a PLACE tells the story — minimal NPCs, maximal
environmental storytelling, the economics of the crash written on the walls.

Design soul: the post-economic apocalypse made literal and personal. A ruined for-profit
college where people took "colossal loans for a better life" the crash erased — the debt-
notes still litter the halls. A lone survivor lives in the wreckage of the promise. The
quest teaches the crash's REAL cause (debt, not bombs) through a place you read, not a
lecture you hear. Infrastructure IS the curriculum.

===============================================================================
## 1. HEADER
===============================================================================
- id: q_degrees_of_nothing
- tier: 3 (unmarked; discovered by exploring the ruined campus; a scavenger request pulls
  the player in)
- fold: what the player does with the campus (loot it / preserve it / help the survivor)
  shapes a small memorial or a stripped ruin; the debt-story becomes district lore an heir
  can learn.
- entry_conditions: player enters the dead FOR-PROFIT COLLEGE ruins (a real Vegas strip-
  mall diploma-mill archetype); a survivor (professor emeritus) or a scavenger flags a task.
- faction_wires: TRADES/CARAVANS (scavengers stripping it), VOLUNTEERS (the survivor's care),
  the district's collective memory of the crash.
- music_pool: a hollow, echoing ACADEMIC-RUIN motif (a half-remembered alma mater, decayed);
  no COMBAT unless scavengers turn hostile; a quiet resolve at the memorial.
- ledger_writes: recorded[college_outcome_*]; UNRECORDED[what_you_did_with_the_ashes];
  district CLUE[the_crash_was_debt_not_bombs] (the educational core, banked as knowledge).
- amalgamation_thread: NONE. Pure economic-history teaching. The horror is mundane and real.

===============================================================================
## 2. CAST
===============================================================================
- PROF. ELIAS HANE (id: hane) — a former instructor at the college, now living alone in the
  ruined library, the last keeper of what the place was. He taught people who mortgaged their
  futures for degrees that became worthless the day the economy folded. Carries guilt for
  having been part of the machine. default_emotion: haunted_scholarly. faction: none (hermit).
- SCAVENGER LEAD BRISK (id: brisk) — stripping the campus for copper and salvage; sees only
  materials, not a graveyard of promises. default_emotion: pragmatic_indifferent. faction: TRADES.
- (Environmental "cast" — the PLACE): foreclosure notices, unpaid tuition ledgers, a wall of
  graduation photos, a financial-aid office with a vault of unpayable debt-contracts, dorms
  turned squats. The building testifies.
- THE PLAYER — [READ] (decode the economic story), [MEDICINE] (Hane's failing health),
  standing (mediate scavengers).

===============================================================================
## 3. BRANCH PATTERN
===============================================================================
EXPLORATION-FIRST (read the campus in any order — each location a piece of the economic
story) -> meet the survivor -> a small FORK: HELP HANE preserve/memorialize, LET THE
SCAVENGERS strip it, or MEDIATE (salvage what's needed, preserve what matters). The "quest"
is mostly READING a place; the choice is what the ruin becomes.

===============================================================================
## 4. THE NODE TREE
===============================================================================
node open_01
  speaker: brisk  emotion: pragmatic_indifferent  gesture: coil_cable  camera: two_shot
  music:{pool:ACADEMIC_RUIN,cue:soft_enter}
  line: "Campus is full of copper and the old man in the library won't let us finish
         stripping it — keeps babbling about 'memory.' You want work? Either help me clear
         him out, or buy me off. Either way I've got a quota. Weird place, this. Feels like
         it's judging you."
  -> goto explore_hub
node explore_hub (speaker: PLR)  camera: over_shoulder_player
  choices:
   - "(Read the financial-aid office.)"    -> read_finaid  [once]
   - "(Read the wall of graduation photos.)" -> read_photos [once]
   - "(Read the dorms-turned-squats.)"       -> read_dorms  [once]
   - "(Find the survivor in the library.)"   -> hane_01      [once]
   - "(Decide the campus's fate.)"           -> fate_gate    [show after 2 reads + Hane]
node read_finaid
  speaker: PLR (internal)  camera: closeup_on_documents  music:{pool:ACADEMIC_RUIN,cue:paper_rustle}
  line: "(The financial-aid vault: thousands of loan contracts, some for sums that'd buy a
         house, all for certificates in trades the crash erased. 'Casino Management.'
         'Hospitality Analytics.' Promises printed on debt. These people didn't die in a
         blast. They were buried in interest before the lights even went out. THIS is how
         the world ended here — not with a bomb, with a bill.)"
  effect: district CLUE[the_crash_was_debt_not_bombs] (the educational core)  -> goto explore_hub
node read_photos
  speaker: PLR (internal)  camera: closeup_on_photos
  line: "(A wall of graduation photos — hundreds of hopeful faces in cheap gowns. Someone's
         gone down the rows with a marker: 'gone east.' 'foreclosed.' 'died owing.' 'made
         it?' with a question mark. Somebody needed to know what happened to each one. Somebody
         still comes here and updates the wall.)"
  effect: knowledge[someone_tends_the_memory] (points to Hane)  -> goto explore_hub
node read_dorms
  speaker: PLR (internal)  camera: closeup_on_squat
  line: "(Dorms turned squats — students who couldn't leave when the money broke, living in
         the buildings they still owed on. Tally marks by a bunk counting days. A textbook
         used to level a table. The future they bought, lived in as a ruin. Some are still
         here. Some of the district's homeless ARE these students, twenty years on.)"
  effect: knowledge[the_debtors_became_the_homeless] (ties the HOMELESS faction to the crash's
    economics — a quiet, devastating link)  -> goto explore_hub
node hane_01
  speaker: hane  emotion: haunted_scholarly  gesture: shelve_a_ruined_book  camera: two_shot
  line: "You've been reading my campus. Good. Most just strip it. I taught here — 'Hospitality
         Analytics,' God help me. I sold kids a future that was a LOAN with a diploma stapled
         to it. When it all folded, they came looking for me. Not to hurt me. To ask WHY. I
         didn't have an answer. I still don't. So I keep the wall. I keep their names. It's
         the only tuition I can pay back."
  effect: knowledge[hane_carries_the_guilt]  -> goto explore_hub

--- THE FATE OF THE CAMPUS ---
node fate_gate (speaker: PLR)  camera: closeup  music:{pool:ACADEMIC_RUIN,cue:hold}
  choices:
   - "(Help Hane make it a memorial — protect it.)"     -> route_memorial
   - "(Let the scavengers strip it — it's just copper.)" -> route_strip
   - "(Mediate — salvage the metal, preserve the record.)" -> route_mediate
node route_memorial
  speaker: hane  emotion: moved_purposeful  camera: two_shot  music:{pool:ACADEMIC_RUIN,cue:quiet_resolve}
  line: "A memorial. Yes. Let the district come and READ it — let them see the receipts of
         the thing that actually ended the world. Not a bomb. A promise no one could pay. If
         they learn that, maybe they build the next Vegas without the trap. That's a lesson
         worth a ruin."
  effect: the campus becomes a preserved MEMORIAL/archive (a district landmark teaching the
    crash's real cause); the scavengers are turned away or compensated; recorded[made_memorial];
    UNRECORDED[kept_the_receipts]=true; district CLUE[the_crash_was_debt_not_bombs] becomes
    PUBLIC (an educational landmark — the curriculum made canon). standing[VOLUNTEERS]+. -> END
node route_strip
  speaker: brisk  emotion: satisfied  camera: two_shot  micro_expression: shrug
  line: "Copper's copper. The old man can keep his wall, we'll strip around him till there's
         nothing left to remember with. Thanks for not making it hard." (the campus is gutted)
  effect: the ruin is stripped for materials (a resource windfall for the dynasty/district);
    Hane's memory-work is buried under salvage; the debt-story is LOST to the district;
    recorded[stripped_the_college]; UNRECORDED[sold_the_lesson_for_scrap]=true. Materially
    richer, historically poorer — the crash's cause forgotten (a quiet tragedy). -> END
node route_mediate
  speaker: PLR (to Hane + Brisk)  camera: three_shot  music:{pool:ACADEMIC_RUIN,cue:balance}
  line: "Take the copper from the wings — the dorms, the plumbing. Leave the library, the
         finance vault, the wall. The district needs the metal AND the memory. It can have both
         if nobody's greedy."
  effect: a balanced outcome — the dynasty/district gets salvage AND the core record is
    preserved (a smaller memorial); recorded[mediated_the_college]; UNRECORDED[saved_what_
    mattered]=true; both Hane and the scavengers grudgingly satisfied; the debt-lesson survives
    in part. The pragmatic-humane middle. -> END

===============================================================================
## 5. CONSEQUENCE ACROSS THE FOLD
===============================================================================
- MEMORIAL: a preserved archive teaching the crash's REAL cause (debt); an heir can visit and
  learn WHY Vegas fell — the curriculum made a permanent landmark; the district builds warier
  of debt-traps (a subtle economic-wisdom bonus to later city-building).
- STRIP: a resource windfall now; the debt-story lost; an heir inherits a district that
  FORGOT why it fell (and may repeat the trap — a quiet long-game cost).
- MEDIATE: salvage + a partial memory; the middle legacy.
- district CLUE[the_crash_was_debt_not_bombs] + the HOMELESS-were-the-debtors link persist —
  recontextualizing the whole world (the homeless aren't random; they're the crash's debtors,
  and the Amalgamation literally sleeps beneath them — the economic and the sci-fi horror
  fuse: the machine feeds on the people the economy already discarded).

===============================================================================
## 6. PRESENTATION PASS (all four channels)
===============================================================================
FACE: Hane's haunted scholarship carries the human weight (guilt held with dignity); Brisk's
  indifference is the foil (not evil — just a man with a quota). But the QUEST'S "face" is the
  PLACE — documents, photos, tally marks (environmental portraiture). Procedural lip-sync.
BODY: minimal NPC animation (Hane shelving, Brisk coiling cable); the player's traversal of the
  ruin IS the gameplay (reading rooms). No combat unless scavengers turn (avoidable).
CAMERA: closeup_on_documents / photos / squats (the environmental storytelling framed like
  evidence — Obra-Dinn-style READING of a place); two_shots with Hane; three_shot for mediate.
  Cuts on beat.
MUSIC: a hollow ACADEMIC-RUIN motif (a decayed alma-mater melody, half-remembered); paper-
  rustle textures; quiet resolve at the memorial. No dread-hum (this horror is economic, not
  sci-fi) — the absence keeps it grounded. 120 BPM.

===============================================================================
## 7. ROUTES + REWARD DIVERGENCE (Pacifist + Megaton + the curriculum)
===============================================================================
- Fully pacifist (an exploration/reading quest); combat only if the player forces the
  scavengers. The "gameplay" is comprehension, not conflict.
- Rewards diverge (Megaton law): STRIP = material windfall + lost history; MEMORIAL = no
  loot + a permanent lesson + economic wisdom for city-building; MEDIATE = some of both. The
  most LUCRATIVE choice (strip) forgets the lesson; the wisest (memorial) forgoes the copper.
  Infrastructure IS the curriculum — literally: preserving the ruin preserves the teaching.
- Core teaching (no preaching): the crash was ECONOMIC (debt, for-profit predation), not
  nuclear — read off the walls, never lectured. And the HOMELESS are recontextualized as the
  crash's debtors — the game's central injustice made concrete.

===============================================================================
## 8. ENGINE HOOKUP + GATE
===============================================================================
Compiles to one scene JSON built on ENVIRONMENTAL STORYTELLING (readable place-nodes as the
primary content — reusable for other lore-ruins). Reads ledger/standing/skill/knowledge/fold;
writes same + a memorial landmark (or a stripped-ruin flag) + a district economic-wisdom flag
+ the debt-cause knowledge (recontextualizes the HOMELESS faction). Deterministic + save-
through. Gate: all place-nodes readable in any order, all three fates resolve, the debt-cause
+ homeless-debtor knowledge banks, memorial/strip/mediate persist, no-combat default holds.
Joins the suite.

## 9. WHAT THIS PROVES (vs 001-027)
New engine: ENVIRONMENTAL-STORY / place-as-quest — a ruined for-profit college read room by
room, teaching the crash's REAL cause (predatory debt, not bombs) through documents and photos,
not exposition (Elden-Ring world-lore + the educational thesis). It recontextualizes the
HOMELESS faction as the crash's debtors — fusing the economic and sci-fi horror (the machine
sleeps beneath the people the economy already discarded). Introduces readable place-nodes as
primary content. Bible at 28; the world's central injustice is now written on its walls.
