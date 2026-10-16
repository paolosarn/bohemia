# MODS ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
MODS (mods-59jyd6): 10/10 LATEST -- [mod checklist] SHIPPED as a page on the board (nothing in VOTE, rules 78, 88). Record
records/BOHEMIA_MODS_A_MODDERS_SELF_CHECK_10_10_26.md; tool tools/bohemia_mods_check.js: one command, plain words, code + meaning + fix per
skipped part, never refuses. The reference merge now tags each warn/bad with its code M01-M20 (a third value), so no guessing from words;
the error-message tool checks the tag. Proof 27 of 27. MODDING.md points at the new command. NEXT OPEN: [sharing a mod], [grok sources]; a
third is added. [read count] CLAIMED. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [modding readme] SHIPPED as a page on the board (rules 78, 88: nothing in VOTE). MODDING.md at the repo
root, copy at records/BOHEMIA_MODS_HOW_TO_MOD_ONE_PAGE_10_10_26.md: what a mod is, the data folder, the folder shape, the first change
(run and checked by hand: knife 20/30 prints CHANGED), what a patch can do, the examples, where the error codes are. Help only. Honest
line in it: the game does not read a mods folder yet, the reference loader is how a modder sees a mod work. NEXT OPEN: [sharing a mod],
[grok sources]. Only 2 OPEN left, so a third is added. [read count] CLAIMED. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [error messages] SHIPPED as a research page (rules 78, 88: page on the board, nothing in VOTE). Record
records/BOHEMIA_MODS_PLAIN_WORDS_WHEN_A_MOD_IS_WRONG_10_10_26.md: all 20 messages the reference merge can print (14 skipped, 5 heads-up,
1 conflict), each with a code M01-M20, plain words and the fix. Tool tools/bohemia_mods_error_messages.js builds a real broken mod per
code, runs the real merge, checks the message shows, and goes red if the merge ever prints a message with no row (mutation-checked).
Help only, nothing refuses a mod. Also fixed PLUMBER's note: the list item's VOTE sheet is now two sentences (rule 22g). Merge proof still
27 of 27. NEXT OPEN: [modding readme], [sharing a mod], [grok sources]. [read count] CLAIMED (old fight 4, new fight 1, background 3,
sound 4). PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [lists in rows] SHIPPED as a research page, and [range column] RETIRED by his DOWN
(10/9 verdict on how-big-is-too-big: "the only point is to help people mod the game"). TAB: VOTE, item PATCH INSIDE A
LIST. Record records/BOHEMIA_MODS_PATCHING_INSIDE_A_LIST_10_10_26.md; instrument tools/bohemia_mods_lists_audit.js: 32 list
fields in the data, 3 hold objects, 29 hold words. The reference merge (tools/bohemia_mods_merge_reference.js, still NOT
loaded by any play surface) now patches a list by name, id or position, or with add/remove for word lists; an array still
replaces the whole list. Proof 27 of 27 (10a-10e new); with the list branch off, 23 of 27 (mutation-checked). Two worked
mods added: quicker-stab, armed-brigand (nine cards on the copy page). TAKEN OUT: the range tool and its warning, to
graveyard/ with graveyard/POSTMORTEM_MODS_HOW_BIG_IS_TOO_BIG_10_10_26.txt. LESSON FROM HIS VERDICTS: a page ships only if it
makes modding possible or easier; anything that tells a modder what they may do dies. RISK: the id-policy and schema-number
pages have no verdict yet and read a little like laws; written as advice, nothing enforces them; if either goes DOWN it
follows the ranges to graveyard/. NOT MINE: canon_rot_gate C3 (66 vs 62) comes from records/lab/ teardown cited by another
lane. [read count] CLAIMED: old fight 4 files, new fight 1, background 3, sound 4. NEXT OPEN: [modding readme], [sharing a
mod], [error messages] (plain words only), [grok sources]. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [base changes] SHIPPED as a research page. TAB: VOTE, item WHEN THE DATA CHANGES (a
per-day bar chart, the one break, four lines of policy). Record
records/BOHEMIA_MODS_HOW_A_MODDER_LEARNS_THE_DATA_CHANGED_10_10_26.md; generated changelog
records/BOHEMIA_MODS_THE_DATA_CHANGELOG_10_10_26.md (58 lines); instrument tools/bohemia_mods_changes_audit.js (1 s;
--changelog, --json). MEASURED from git (clone is shallow; the folder was born 10/2 = its whole life): 33 commits, 44
file changes: 22 NEW FILE (9 on day one), 14 ADDS, 7 VALUES, 1 BREAKS (ai.json lost the field `why` from its kinds, 10/5);
ZERO row ids removed; ours.json is 14 of the 22 non-new changes (a daily key grower). POLICY (none built): one schema number
for the folder bumped ONLY on a break (it would be 2 today; the reference merge's GAME_SCHEMA is 1, already one behind);
a mod pins its schema, older = warn never refuse; whoever removes/renames writes `DATA-BREAK:` in the commit; the
changelog is generated, breaks first. FINDING: eight additive days is a young folder, not a stable one; breaks come when
lanes tidy; cheap now, expensive to retrofit. NEXT OPEN: [lists in rows], [error messages], [grok sources].
[read count] CLAIMED. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [more worked mods] SHIPPED. TAB: VOTE, item MODS TO COPY (7 cards: tap one for
the patch, the lesson and what the checker said). Record records/BOHEMIA_MODS_MODS_A_STRANGER_CAN_COPY_10_10_26.md;
folders in tools/mods_reference/example_mods/ (+README, eight mods). Five new, each built from a REAL row: enemy-pack
(copy of the brigand poacher), poorer-start (origin batteries.full 250->200), fair-wages (a wage), sharper-mastery
(a perk number), new-helm (a head armour piece, table key 'head'). All load with no fault and no warning; proof now 27
of 27 (9a-9g). REAL FIX THIS NEEDED: a patch to a row's `numbers` object ERASED the other keys; the reference merge now
merges an object inside a row ONE LEVEL; mutation-checked (9c, 9e red 25/27 when it overwrites). NOT COVERED, STATED:
a patch inside a LIST (skills, men) replaces the list whole; no row deletion; nothing seen in the fight because the
game loads no mods folder. NEXT OPEN: [base changes], [grok sources]; I must write a third from the jump list.
[read count] CLAIMED. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [ids never change] SHIPPED as a research page. TAB: VOTE, item AN ID IS A
PROMISE. Record records/BOHEMIA_MODS_A_ROW_ID_IS_A_PROMISE_10_10_26.md; instrument tools/bohemia_mods_ids_audit.js.
MEASURED (main, 11 tables): 725 ids; 59 sit in two tables (50 are perks and their translations on purpose, 9 are
an enemy and a background with one id); 83 paths / 764 places where one data file points at another table's id
(enemy faction 66, start men to background 55, listed_in 54); origins 15/15, perks 50/50, perk_translation 50/50
are ALL also quoted in code (others are an UPPER bound: common words match by chance); ZERO ids contain a colon;
ALL 725 are lowercase letters, digits, underscore. Concrete: mace_mastery = perks, perk_translation, the fight, a
gate; gladiator = five data files. POLICY: never rename; retire not delete (proposed retired/replaced_by fields,
nothing writes them); a mod's new rows are '<modid>:<name>'; base ids stay [a-z0-9_]. The reference merge takes
--namespace (warn, never block); proof now 20 of 20 (8a-8e), mutation-checked (8b red 19/20 when disabled).
FINDING: the data alone cannot keep rule 1 because code spells ids too; a gate listing ids code depends on is the
missing piece and it is a build. NEXT OPEN: [more worked mods], [base changes], [grok sources]. [read count]
CLAIMED. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [range column] SHIPPED as a research page. TAB: VOTE, item HOW BIG IS
TOO BIG (type a knife's damage; it warns at -5 and at 500 and says why; never blocks). Record
records/BOHEMIA_MODS_THE_RANGE_COLUMN_10_10_26.md. Draft banks/BOHEMIA_MODS_RANGES_DRAFT_10_10_26.json
(draft:true, generated by tools/bohemia_mods_ranges_draft.js, not loaded by anything): 49 numbers in 10 tables
across 8 files, each with its smallest and biggest base value, plus the 10 limits the wiki states itself in
rules.json. The reference merge takes --ranges (warn, never block); the proof is 15 of 15 (4 new legs: -5 and
999 warn and still load; 20 to 30 is silent; no flag, no warning; mutation-checked 14/15 when the comparison is
disabled). FINDING: 'observed range' warns on the mod a modder most wants (stronger than the game), so it is
a prompt, never a verdict. Limits: top-level numbers only (sub-objects unchecked); 1 thin and 2 constant fields;
regenerate when the data changes (it grew to 18 files). NEXT OPEN: [ids never change], [grok sources].
[read count] CLAIMED. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [first hour] SHIPPED (a modder's first hour, every step something
that exists today; one step marked NOT BUILT: the game does not load a mods folder). TAB: VOTE, item A
MODDER'S FIRST HOUR. Record records/BOHEMIA_MODS_A_MODDERS_FIRST_HOUR_10_10_26.md. RAN END TO END: a local
web server on the repo, a real browser, the knife read from the fight's own DB.weapons before (15,25) and
after editing weapons.json (20,30), no page errors, file restored (clean git diff); step 4's reference merge
run on a folder written exactly as the page says.
*** CORRECTION OF MY OWN NUMBER: THE NEW FIGHT READS 11 BB DATA FILES, NOT 12. *** My 10/9 audit counted a
file as read when its name appeared anywhere in the page text; origins.json is only in a COMMENT in the fight
(its DATA_FILES list has 11 bb files). tools/bohemia_mods_data_audit.js now counts a file only when its path
is inside a quoted string; the records, the VOTE page and the VAMILY row are corrected. The finding stands.
The data folder now holds 18 files (new: contract_terms, factions, stash_rates); the schema page was
regenerated for all 18 (re-run tools/bohemia_mods_schema_page.js --write after any change).
READ COUNT (round, e8d1bac): old fight 4 files, new fight 1, background 3, sound 4; unchanged.
NEXT OPEN: [range column], [ids never change], [grok sources]. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [one weapon file] SHIPPED as a research page. TAB: VOTE, item THE
WEAPON FILE. Record records/BOHEMIA_MODS_THE_WEAPON_FILE_10_10_26.md; instrument
tools/bohemia_mods_weapon_skills_audit.js (instant). FINDINGS (read from the fight's own text, not played):
the fight plays ONLY a weapon's FIRST strike skill plus its reload (strikeSkill/reloadSkill); 104 of 126
weapons have 2+ strike skills; 27 skills are never first so never played (Puncture, Riposte, Spearwall,
Round Swing, Split ... the KNIFE already lists Puncture and it is never offered); a skill's SHAPE (sweep,
line, 5 tiles behind) is an effect SENTENCE nothing reads (16 weapons' first skill); mastery is a sentence
joining weapon class to perks.json. PROPOSAL (additive, defaults equal today, no row has to change): optional
skills[].shape {kind,tiles}, optional offers [skill names], optional mastery (perk id). I DECIDE NO GUN
CLASSES (rule 47b: his pick; ours.json weapon_jobs holds his examples). Grok pages cited carry EYES's
PASSED FILTER (10/1) and every number was checked against weapons.json.
PROCESS NOTE: no stash this round (last round's stash pop committed conflict markers into VAMILY.md; fixed,
verified 0 on main). NEXT (written to my OPEN rows): [first hour], [range column], [ids never change];
[grok sources] stays OPEN (stamped pages cited; nothing else to re-read). [read count] CLAIMED
(old fight 4 files, new fight 1). PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/10 LATEST -- [the mods folder design] SHIPPED as a design page, nothing built.
TAB: VOTE, item THE MODS FOLDER (a page: the folder, a whole mod, the rules, PROVED 11 of 11).
Record records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md. The design is PROVED ON THE REAL
bb DATA by tools/bohemia_mods_merge_reference.js + tools/bohemia_mods_merge_proof.js (examples in
tools/mods_reference/example_mods/); neither is loaded by any play surface; run
`node tools/bohemia_mods_merge_proof.js` (instant). Mutation checked: deleting the 'skip the whole
row on a wrong type' line turns 2a red (10/11), restored 11/11.
DESIGN: records/target/mods/ (already published, next to the data) with index.json as the only list
and on/off (a static host cannot list a folder); a mod = manifest.json + patch files NAMED LIKE the
data file they patch, rows changed BY ID; base then mods in index order, loadAfter respected, later
wins and a CONFLICT line names both; wrong values/unknown fields/short new rows/loops/non-JSON are
skipped by name, never half a row, never a crash. THE DEMO HAS NO CODE PATH (his NAH): the three-leg
gate for PLUMBER on the day he says build = no play surface fetches mods/ (4 checked), empty folder
gives the same hash of all 15 files, a wrong-in-every-way mod gives the same hash.
LIMITS STATED: type is checked, not range (damage_min -5 would load; needs a range column in the
data files, TUNING's table); no size/count cap; no row deletion. The folder does NOT exist yet.
CORRECTED MY 9/28 PAGE: it is records/target/mods, not slices/mods.
NEXT: [one weapon file] (largely answered by weapons.json + the schema page); [grok sources] waits
on EYES; [read count] CLAIMED (old fight 4 files, new fight 1). PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/9 LATEST -- [the data schema page] SHIPPED. TAB: VOTE, item THE DATA
FILES ON ONE PAGE: 15 cards (tap one: what it holds, who reads it, every field), plus a worked
example (make the knife hit harder). Record records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md,
GENERATED by tools/bohemia_mods_schema_page.js --write from the live files, so it cannot drift;
re-run it after any change to records/target/bb. 15 files now (price_table.json is new).
LESSON FROM HIS VERDICTS (read this round, 10/1): THE POINT OF THE MODS CHAT IS TO MAKE MODS EASY
FOR OTHER PEOPLE TO MAKE, NOT TO MAKE MODS OR GAME FEATURES. 'THE MARCH STOPS' (a game feature I
designed) went DOWN; 'MODS AT BOOT' went NAH; 'TRY A MOD' went down; 'WHAT MODS FIX' and 'ONE GUN,
42 PLACES' went UP. Keep every page on the modder's side: shapes, units, readers, examples, the
loader, never game design. The coordinator retired [keep list into defaults] 10/1 for this.
WORKED EXAMPLE FACTS: weapons damage lives in weapons.json (damage_min/damage_max); the fight
rolls from the row, the settlement screen and roster print it, the fight's gate reads it from the
row (by inspection; the gate runs about 5 minutes, 92 pass / 3 fail and a crash at my 280 s
timeout on a clean tree, so I did NOT prove a changed row stays green). Money in the wiki files is
crowns (10 to a battery, price_table.json); origins.json carries both blocks. NOT AUDITED: the
settlement and roster screens also read the data files (a surface I missed on 10/9).
NEXT: [the mods folder design] is the top OPEN row (a design page, nothing built; his NAH on boot
loading stands for the demo), then [one weapon file] (largely answered by weapons.json). [read
count] CLAIMED, reported each round (old fight 4 files, new fight 1). PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/9 LATEST -- [what is data and what is not] SHIPPED (rule 74 top row).
TAB: VOTE, item WHAT IS DATA AND WHAT IS NOT: two lists (IN A DATA FILE, STILL IN CODE).
Record records/BOHEMIA_MODS_WHAT_IS_DATA_AND_WHAT_IS_NOT_10_9_26.md. Instruments
tools/bohemia_mods_data_audit.js (1 s) and tools/bohemia_mods_read_count.js (about a minute).
RESULT: the new fight reads 12 of the 14 records/target/bb files, one loose table (SND).
The demo start screen reads 1 (origins), the map reads 1 (party_math). SIX FINDINGS: the
start screen DROPS a new origin (hard-coded list of 15 ids, merge skips unknown ids; row on RUN
[origins fallback]); the sealed OLD fight is still in the demo with 0 data files so a gun has two
truths (row on COMBAT [one fight]); the map repeats backgrounds, origins and roster in its own
tables and holds 245 big tables, 775 KB, in no file (WORLD, ECONOMY, WORDS jump list); the shell
is sound, music and art, not rules. READ COUNT: one weapon's damage = 4 files in the old fight,
1 in the new (target met). FINDING AGAINST MY OWN 9/28 ADVICE: weapons are now the easiest kind,
not the hardest; research pages go stale in a week, re-run the audit.
NEXT: [the data schema page] is the top OPEN row (shape of each bb file, one worked example),
then [the mods folder design], [one weapon file] (now mostly answered by weapons.json),
[grok sources]. [read count] stays CLAIMED, reported every round. PENDING Paolo: nothing.

MODS (mods-59jyd6): 10/1 LATEST -- [read count] round two and [keep list into defaults]
KEEP 2 of 11. Both rows stay CLAIMED. TAB: VOTE, item ONE HONEST NUMBER: two brothers
dressed from body, helmet, extra slots; each shows the damage it takes to drop him AND the
stamina the gear costs, plus a verdict line (all numbers are TUNING placeholders).
READ COUNT unchanged on fresh main (7ad4472): 4 files for one weapon's damage (2 hidden in
blobs), 3 for a background, 4 for a sound; target 1 each. It only moves when content moves
into a data file, which is research-only until he says build.
KEEP 2 = "Effective Hitpoints": one number beside the armour plus its stamina cost, row on UI
as [honest number], pieces from CHARACTER's attachments trade. 9 KEEPS left; next is
Backgrounds and Attribute Ranges. [one weapon file] still open; [grok sources] waits on
EYES's PASSED FILTER stamp. Record records/BOHEMIA_MODS_READ_COUNT_ROUND_TWO_AND_KEEP_2_10_1_26.md.

MODS (mods-59jyd6): 9/30 LATEST -- [read count] round one and [keep list into defaults]
KEEP 1 of 11. Both rows stay CLAIMED (report every round; one KEEP per round).
TAB: VOTE, item THE MARCH STOPS (mods-the-march-stops-9-30): a road, a marker stepping
one cell a beat, a red party ahead; STOPS ON SIGHT halts it, KEEPS WALKING walks into them.
THE NUMBER (clean main ca7655c, tools/bohemia_mods_read_count.js, about a minute): files to
touch = 4 for one weapon's damage, 3 for one background, 4 for one sound; the data line's
target is 1 each. FINDING: a text search for the weapon's damage finds NO live file; both
copies hide in base64 blobs (alpha and demo), and 3 tools re-generate the blob and would
overwrite a hand edit. Background and sound are plain but each has derived copies.
KEEP 1 = "a sighted party stops the march" (3 pause mods, one want); the row is written on
RUN as [sighting stops], distinct from [road events]. 10 KEEPS left (perks preview, EHP,
settlement tooltips, attribute ranges, named-item viewer, numbers, autopilot=gambits check,
inventory sell-all). [one weapon file] is open for next round.
Record records/BOHEMIA_MODS_READ_COUNT_AND_FIRST_KEEP_9_30_26.md. PENDING Paolo: nothing.

MODS (mods-59jyd6): 9/29 LATEST -- [what mods fix] SHIPPED as a research page, and
[dead citation] fixed (the school page now says "a proposed weapons.json data file").
TAB: VOTE, item WHAT MODS FIX (mods-what-mods-fix-9-29): 19 cards with KEEP / MAYBE /
NO chips. Record records/BOHEMIA_MODS_SCHOOL_WHAT_BATTLE_BROTHERS_MODS_FIX_9_29_26.md.
RESULT: 11 KEEP, 6 MAYBE, 2 NO; 13 of 19 cost base balance nothing (speed, pause, info,
automation). NINETEEN NOT TWENTY, AND NOT BY INSTALLS: nexusmods, steamcommunity and
fandomspot are EGRESS_BLOCKED here, so the list is what recurs in search results and
"not measured here" is written where a cost was not read. Coordinator: name a network
exception or have him paste Nexus "popular all time" if the true top twenty matters.
Speed is the loudest want but the 120 BPM beat cannot speed up: proposal is to cut the
dead wait between automatic turns. Autopilot IS our gambits (strongest KEEP).
NEXT: no MODS rows open; waiting on the coordinator. PENDING Paolo: nothing.

MODS (mods-59jyd6): 9/28 LATEST -- [mods folder] SHIPPED as a research page. ALL THREE
MODS ROWS ARE NOW SHIPPED; the lane's queue is empty.
TAB: VOTE, item MODS AT BOOT (mods-mods-at-boot-9-28): the loading-screen line as it
would read, a REAL file button (multi-file) and a paste box; try TWO SAMPLE MODS.
Record records/BOHEMIA_MODS_SCHOOL_WHERE_A_MOD_LIVES_ON_A_PHONE_9_28_26.md.
FINDINGS: (1) iPhone Safari has no file picker API, a plain file input is the door;
(2) Safari deletes saved site data after 7 days unless on the Home Screen, so a mod is
re-loadable, never trusted saved data, and the loading screen names an expired one;
(3) alpha and demo share one origin, so "off in the demo" needs one explicit no-mods
flag, not storage; (4) data-only is safe for values, NOT for size/count and range: the
draft caps 20,000 bytes and 12 mods, and a real loader needs per-field min/max in the
same table TUNING owns. Draft page also proved loadAfter loops, conflicts and a
non-JSON file are named and never crash. Nothing built, no gate, no engine touched.
NEXT: none open. Ask the coordinator for the next research row, or mine another
content kind's data shape (armour attachments, events; law names them).
PENDING Paolo: nothing.

MODS (mods-59jyd6): 9/28 LATEST -- [data line] SHIPPED as a research page.
TAB: VOTE, item TRY A MOD (mods-try-a-mod-9-28): the real four guns in a table, a
box with a tiny mod, APPLY merges it by id, BROKEN MOD gets named and skipped.
Record records/BOHEMIA_MODS_SCHOOL_HOW_BIG_GAMES_PUT_CONTENT_IN_DATA_9_28_26.md.
FINDING: Factorio, RimWorld, Stardew Content Patcher and Minecraft data packs
converge: rows by id, patch after base load in declared order, wrong version warns,
bad row skipped and named. WEAPONS ARE FIRST IN VALUE, LAST IN SAFETY: the fight
moved under my census (42 places -> 41, CELL_MAX gone), so a weapons schema written
now would carry dead fields. Recommend names and backgrounds (people.js, 63% plain
tables) through the loader first; COMBAT confirms fields before weapons.
Census baseline refreshed (records/BOHEMIA_MODS_WEAPON_CENSUS_9_28_26.json = 41).
NEXT: [mods folder] as a research page (where a mod lives on a phone, how a modder
tests one, the loading-screen list). No game code, engine or gate touched.
PENDING Paolo: nothing.

MODS (mods-59jyd6): 9/28 LATEST -- *** A GUN LIVES IN 42 PLACES, AND OUR OWN
TESTS FORBID TUNING IT. *** Row [bb modding], SHIPPED as a research page.
TAB: VOTE (mods-one-gun-forty-two-places-9-28, a page: the fight as one strip
with a mark at every place a gun lives; tap AS DATA for the pistol as one row).
Record records/BOHEMIA_MODS_SCHOOL_HOW_BATTLE_BROTHERS_IS_MODDED_9_28_26.md.

MODE CHANGED MID-ROUND: rule 38g (Paolo 9/28) made MODS RESEARCH ONLY. I had
written a ratchet gate and put it in the suite; I pulled it before pushing,
because a gate that refuses COMBAT a new weapon table is a build. It is written
up in the record s5 as the first thing to land the day he says build.

WHAT IS IN THE REPO: tools/bohemia_mods_weapon_census.js (1 s, decodes
COMBAT_B64 out of the alpha, counts tables/ternaries/name checks/gate pins,
exports census(); --write refreshes records/BOHEMIA_MODS_WEAPON_CENSUS_9_28_26.json
and the draft pivot banks/BOHEMIA_MODS_WEAPONS_DRAFT_9_28_26.json, draft:true,
never in the game). Nothing in the play surfaces, engine/ or gates/ touched.

THE FINDINGS: 42 places (14 tables incl. one with no name at L13140, 9
WEAPON==='x'? ternaries, 19 comparisons); 10 asserts in combat_lab_gate.js pin
digits; MAG and START_LOADED duplicate the same four numbers; 134 of 136 combat
patch scripts string-replace inside the blob (we mod our own game the way BB
modders did before hooks). A mods folder at repo root would 404 on Pages: it
must live under slices/ or be added to _config.yml AND pages.yml together.

NEXT: [data line] as a RESEARCH page (rule 38g): how big games put content in
data (the loader shape, the manifest, the doc page), the weapons-first plan
measured against the census. Then [mods folder], same.
PENDING Paolo: nothing.

