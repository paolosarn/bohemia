# MODS [bb modding] -- HOW BATTLE BROTHERS IS MODDED, AND WHAT IT COSTS TO CHANGE ONE WEAPON HERE (9/28/26)

Lane 22 MODS, session mods-59jyd6. Row: HOW-BATTLE-BROTHERS-IS-MODDED (first line).
Ruling answered: Paolo 9/27, rule 36e: "a chat dedicated towards simplifying the code, or
just understanding that I want this to be mod friendly for the community as well, it'd be
so awesome." Law: laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md s5.
MODE: RESEARCH (Paolo 9/28, rule 38g: "tuning right now, I see it as big brain research, and same with mods").
This round is the school plus a measuring instrument. Nothing in the game changed, no gate was added, nothing
is refused. Sections 4 to 6 are the SHAPE recommended for the day he says build; PLUMBER with COMBAT wires it then.

## 0. THE ANSWER IN ONE LINE

To change one weapon today a modder must know that the fight is a base64 blob sealed inside a
5.7 MB HTML file, decode it (1,638,017 bytes, 14,913 lines), and find the gun in **42 places**:
14 tables, 9 inline `WEAPON==='x' ? a : b` ternaries and 19 name checks. Then **10 gate asserts**
pin its numbers as literal strings, so a changed number turns the suite red. **We are modding
our own game the way Battle Brothers modders had to before hooks existed**: 134 of the 136 combat
`*_patch.py` scripts unpack the blob and string-replace inside it.

Reproduce: `node tools/bohemia_mods_weapon_census.js` (1 s). Record:
records/BOHEMIA_MODS_WEAPON_CENSUS_9_28_26.json.

## 1. BATTLE BROTHERS, THE BEST ANGLE (the game he named, campaign department)

What the record says, from the modding community's own documentation and the Nexus pages
(sources at the bottom):

1. **No official kit.** Overhype shipped no modding tools. The game's logic is Squirrel script,
   compiled and packed in `data_001.dat`. The community built decompilers and wrote everything else.
2. **A mod is one .zip dropped into `data/`, never unzipped.** That is the whole install. The
   Legends install guide says it twice: drop the file in, do not unzip it. Mod managers (Vortex)
   are actively advised against. SIMPLICITY OF INSTALL IS THE FEATURE.
3. **The first generation replaced whole files.** Two mods touching the same file could not both
   load, and every official update broke every edit: "every official update of the game will
   break your edits/replacements... and you will have to do it again."
4. **Then hooks.** "Modding Script Hooks" (Adam Milazzo) let a mod PATCH a function instead of
   replacing its file. "Modern Hooks" (Enduriel and others) added declared dependencies,
   incompatibilities and load order, in queue buckets (First, VeryEarly for frameworks, Early,
   Normal, Late, VeryLate for libraries, Last). **MSU (Modding Standards and Utilities)** sits on
   top as the shared library: settings, keybinds, serialization, versioning. Players now install
   three core dependencies first and then "99% of mods" work.
5. **Legends** is the total overhaul he plays: it is huge, it pins a minimum vanilla version
   (1.5.x), ships its art as a separate `mod_legends-assets` file, and keeps a compat-check repo.
   A mod that big lives or dies on **VERSIONING**.

What modders NEEDED and LACKED, in order: (a) readable source (they had to decompile), (b) a way
to change one thing without owning the whole file (hooks), (c) load order and dependencies
(Modern Hooks), (d) a shared library so every mod does not reinvent settings (MSU), (e) a version
the mod can check itself against (Legends pins).

## 2. THE REAL-WORLD ANGLE: HOW A WEB GAME ON A PHONE LOADS A MOD

Three doors, measured against our own laws:

| door | how | verdict |
|---|---|---|
| a folder in the repo | `mods/<name>/manifest.json` + data files, listed in one index, fetched at boot | **YES, the base.** Reviewed by git, versioned for free. BUT PAGES PUBLISHES ONLY slices/ + engine/ + records/target (_config.yml + pages.yml, bound by pages_publish_gate.js). A root `mods/` would 404 in production while working on disk. It must be `slices/mods/`, or be added to BOTH lists in one commit. |
| a URL | `?mod=https://...` | **NO for the link.** ONE-LINK LAW (7/18): never a query string on the URL he sees. A modder's own URL typed into a field on the loading screen is fine; it never touches the link. |
| a pasted or picked file | a file picker / paste box on the loading screen, stored on the phone (IndexedDB) | **YES, the community door.** The BB ".zip in data/" feel on a phone: pick one file, it is on. Nothing leaves the phone. Off by default in the demo (row [mods folder]). |

Every door lands in the same place: a mod is **DATA OVER THE BASE DATA**, merged key by key at
boot, with a manifest carrying `name`, `version`, `gameVersion`, and `loadAfter`. That is the BB
lesson compressed: install is one file, a mod patches keys and never replaces a whole file, and
load order and version are declared, not guessed.

## 3. THE FINDING THAT PROVES US WRONG

**Our own tests forbid tuning.** 10 asserts in gates/combat_lab_gate.js pin weapon numbers as
literal source text, for example `demo.includes('const WEAPON_CAP={pistol:8,smg:2,rifle:1,shotgun:2};')`.
Change the pistol's cap from 8 to 9 and the combat gate goes red, twice. Rule 36d says TUNING
must move every felt number through ONE table; today the suite punishes exactly that move. A
gate should pin a BEHAVIOUR ("the shotgun kills more often than the pistol") or read the number
from the data file, never pin the digit.

And the second, smaller one: `MAG` and `START_LOADED` are two tables that hold the same four
numbers (15/30/20/6). A modder who changes one and not the other ships a gun that starts
loaded with a different count than it reloads to. Duplicated data is the first thing a data
file removes.

## 4. WHAT "SIMPLE ENOUGH TO UNDERSTAND" MEANS HERE, MEASURED

The target, from BB's own history: **one file, one row, one gun**. A modder opens the weapons
file, finds `pistol`, changes `mag: 15` to `mag: 17`, and the game reads it. Today that row
exists only as a pivot this tool reads out of the live code:
banks/BOHEMIA_MODS_WEAPONS_DRAFT_9_28_26.json (draft:true, NOT in the game). The pistol today is
spread across WEAPON_MUZZLE, CELL_MAX, WEAPON_RANGE, SWING_ARC, WEAPON_PAIR, WPN, WEAPON_LETHAL,
WEAPON_CAP, MAG, START_LOADED, WEAPON_WIDTH, WEAPON_ID, _hv and one table with no name at all
(line 13140, the kill-shake). Fourteen names for one gun.

| measure | today | the [data line] target |
|---|---|---|
| files a modder must know exist | 1 HTML + 1 hidden blob | 1 data file |
| places the pistol lives | 42 | 1 row |
| tables holding the same number twice | 1 pair (MAG/START_LOADED) | 0 |
| gate asserts that break on a tuned number | 10 | 0 |
| steps to change a magazine | decode, find 2 tables, edit, re-encode, fix 1 gate, re-cut the demo | edit one number |

## 5. THE GATE, RECOMMENDED (NOT BUILT: rule 38g)

A ratchet, the pattern REFERENCE CHECK settled on, built on census() from the instrument so the two can
never count different things: each of the four counts (tables 14, ternaries 9, name checks 19, pinned
asserts 10) may only go down from its baseline, so the NEXT weapon number goes in a data file and never in
code. It must plant a table in a copy of the fight and prove the census counts +1, or it can go blind and
stay green. It was written and run once this round (6/0, the plant counted 14 -> 15) and then REMOVED
before push when rule 38g landed mid-round: a gate that refuses COMBAT a new table is a build, and this lane
builds nothing until he says so. When he flips MODS to build, it is the first thing to land, before any
data moves, so the debt stops growing on the day the work starts.

## 6. ROUTED

- **COMBAT**: the fight is yours and I touched none of it; nothing refuses you anything. A cheap
  habit that keeps the future move small: a new per-gun number goes in as a key on an existing
  table (WEAPON_RANGE is the natural home), not a fifteenth table or a tenth ternary. And the 10
  pinned asserts in combat_lab_gate.js pin digits, not behaviour; when TUNING's table lands, those
  pins become reads of it.
- **TUNING (21)**: your [numbers table] and my [data line] are the same door. The draft pivot is
  the first fill for the weapon rows: every value read live, none typed. MAG and START_LOADED
  duplicate each other: one number in your table, not two.
- **PLUMBER**: you wire this when he flips it (law s7). The instrument costs 1 s and exports census(). The phone-load
  question (does a mods fetch at boot cost the first 13 seconds) is yours to measure when
  [mods folder] builds.
- **RUN**: [mods folder] will be listed on the loading screen (rule 18h), off by default in the
  demo; nothing for you this round.
- **The next row, [data line]** (a research page now, rule 38g; the build below is the shape): weapons first. A `slices/data/weapons.json` (served by Pages,
  no config change), one loader in the fight that builds the 14 tables FROM it at boot so no
  combat logic changes, a doc page, and the census baseline dropping from 42 to the ternaries
  and name checks only. Then the ternaries become keys.

## Sources (the BB half)

- [Modern Hooks, introduction](https://bbmodding.enduriel.com/docs/modern-hooks/introduction/)
- [Modern Hooks, queuing](https://bbmodding.enduriel.com/docs/modern-hooks/queuing/)
- [Modern Hooks on Nexus](https://www.nexusmods.com/battlebrothers/mods/685?tab=files)
- [Modding Script Hooks on Nexus](https://www.nexusmods.com/battlebrothers/mods/42)
- [MSU on Nexus](https://www.nexusmods.com/battlebrothers/mods/479?tab=posts)
- [Legends installation guide](https://github.com/Battle-Brothers-Legends/Legends-public/wiki/Installation-Guide)
- [Legends compat check](https://github.com/Battle-Brothers-Legends/Legends-compat-check)
- [Legends on Nexus](https://www.nexusmods.com/battlebrothers/mods/60?tab=files)
- [Installing mods and accessing game data (Steam guide)](https://steamcommunity.com/sharedfiles/filedetails/?l=german&id=825789503)
- [Mods and Modding, BB wiki](https://battlebrothers.fandom.com/wiki/Mods_and_Modding)
