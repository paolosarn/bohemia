# MODS [mods folder] -- WHERE A MOD LIVES ON A PHONE, AND WHAT THE LOADING SCREEN SAYS (9/28/26)

Lane 22 MODS, session mods-59jyd6. Row: A-MODS-FOLDER-AT-BOOT. Ruling answered: Paolo 9/27, rule 36e ("mod
friendly for the community"); rule 18h (the loading screen); 9/28 rule 38g (research only).
MODE: RESEARCH. Nothing in the game changed, no gate added. The page is a draft, not in the game.
Follows records/BOHEMIA_MODS_SCHOOL_HOW_BATTLE_BROTHERS_IS_MODDED_9_28_26.md and
records/BOHEMIA_MODS_SCHOOL_HOW_BIG_GAMES_PUT_CONTENT_IN_DATA_9_28_26.md.

## 0. THE ANSWER IN ONE LINE

**A phone mod is a small data-only JSON file, picked with a plain file button, kept in the browser, and
listed as one honest line on the loading screen.** Not a folder (a phone has none), not a picker API (iPhone
Safari lacks it), and not code (so a stranger's file cannot run anything).

## 1. THE FOUR FACTS THAT DECIDE IT (each measured or sourced)

1. **An iPhone cannot open a file the modern way.** Safari on iPhone and iPad ships only the private-file
   part of the File System Access API; `showOpenFilePicker` and `showDirectoryPicker` do not exist there.
   The old plain `<input type="file">` works everywhere. So the button is a plain file input. Verified on
   the draft page with a real file chooser (four files at once, one bad, one loop).
2. **Safari deletes what a site saved after 7 days without a visit**, IndexedDB and localStorage alike,
   except for a web app added to the Home Screen, which keeps its own clock. So a mod saved on a phone can
   simply vanish. **The game must treat a mod as re-loadable, not as saved data**: the loading screen names
   a missing mod ("MOD EXPIRED, pick the file again") instead of silently playing a different game.
3. **Our alpha and demo share one origin** (both live under /bohemia/slices/), so browser storage is shared
   between them. Today the alpha mentions localStorage 94 times and IndexedDB 3 times
   and has no file input anywhere (grep of type=file and 'file': 0 hits). "Off by default in the demo" (the row's own words) therefore cannot be a
   storage trick; it has to be one explicit flag the demo build sets to "no mods, ever", or a mod saved from
   the alpha would load in the friend's-hands demo.
4. **The service worker does not touch it.** slices/sw.js only handles top-level page loads, network-first.
   A mod fetched or picked later passes straight through, so mods add nothing to the always-fresh link and
   the ONE-LINK LAW is untouched (no query string, ever).

## 2. THE THREE PLACES A MOD CAN LIVE, RANKED

| place | works on iPhone | survives | for whom | verdict |
|---|---|---|---|---|
| **a picked file, kept in browser storage** | yes (plain file input) | up to 7 days on Safari unless on the Home Screen | a player trying a friend's mod | **YES, the community door**, with the honest expiry line |
| **a listed folder under slices/mods/** (`index.json` + one folder per mod, shipped by us) | yes | forever, it is the site | the mods WE bless, the way Legends is the big one | **YES, second door**, needs a review step because it ships to everyone |
| a URL typed into a box | yes | as long as the host lives | a modder with a website | **LATER**; a stranger's host changing a file after review is the thing to think about first. Never on the game's own link |

The picked-file door is the one the row asks for, "mods/<name>/manifest + files": on a phone the folder is
the file, and the manifest is the first key of it (`mod.id`, `name`, `version`, `schema`, `loadAfter`).

## 3. WHAT THE LOADING SCREEN SAYS (rule 18h, draft)

Same voice as the boot log the loading screen already has. One line per fact, coloured by how bad:

    BOHEMIA BOOT  base data embedded, 4 guns
    MOD LOADED  Bigger Mags v1.0.0
    CONFLICT  pistol.mag  Snub Pistol overrides bigger-mags (loads later, wins)
    MOD SKIPPED  a, b  loadAfter loop: a -> b -> a. All of them skipped.
    MOD PARTLY LOADED  Cross v1  1 problem(s)
    MODS  2 loaded, 2 with problems, 2 conflicts. The game started anyway.

With NO mods installed it is ONE quiet line ("MODS none installed") so a player who never mods pays nothing
and sees almost nothing (rule 18: nothing happens in the first second). The draft page runs exactly this on
a real phone-sized screen, including the loop, the conflict and a non-JSON file that is refused by name.

## 4. THE FINDING THAT PROVES US WRONG

**"Data only, so it is safe" is true for the values and false for the SIZE and the COUNT.** A mod that is
valid JSON and 40 MB of "pistol" rows would freeze a phone's first frame. The draft page therefore has two
limits that BB and Factorio never needed because their mods are code on a desktop: **20,000 bytes a mod, 12
mods**, refused by name at the door. Those numbers are a first guess, not a ruling, and they are TUNING's to
set once a real mod exists. A second gap: the draft checks type (a number) but not RANGE. A mod that sets
`mag: -1` or `lethal: 40` is "valid" and would break the fight. The real loader needs a min and max per
field, in the data file next to the row, so a mod cannot cheat and cannot crash. That is the same table
TUNING's [numbers table] owns; it is one table, not two.

## 5. A SAVE AND A MOD

A save must record the mod ids and versions it was made with, and the loading screen must say "this save was
made with Bigger Mags; it is not installed" and load anyway (Minecraft's `pack_format` lesson: warn, do not
refuse). Nothing in our saves does this today; it is a PLUMBER row the day he says build, not a thing to
start now.

## 6. ROUTED

- **PLUMBER**: when he flips MODS to build: (a) the demo build sets the no-mods flag (fact 3); (b) the
  loading line is built from the draft's exact strings; (c) the mod size and count limits are read from
  TUNING's table.
- **TUNING**: per-field min and max next to each row is the same door as your numbers table; the two
  limits in section 4 are yours to set.
- **RUN**: rule 18h's loading screen gets one extra line, one line when nobody mods.
- **Next row**: none open in this lane. The lane's three rows are shipped; the next round is the research
  the coordinator adds, or a mine of another content kind's data shape (armour attachments and events are the
  two the fight-gets-deep law names next).

## Sources

- [File System Access API browser support](https://www.testmuai.com/learning-hub/file-system-access-api-browser-support/)
- [showOpenFilePicker, Can I use](https://caniuse.com/mdn-api_window_showopenfilepicker)
- [File System Access, Chrome for Developers](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access)
- [Updates to Storage Policy, WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/)
- [iOS purges IndexedDB every 7 days](https://github.com/HangerThem/tessera/issues/13)
- [Safari iOS PWA data persistence beyond 7 days, Apple forums](https://developer.apple.com/forums/thread/710157)
- [r2modman (profiles, shareable mod lists)](https://github.com/ebkr/r2modmanPlus)
