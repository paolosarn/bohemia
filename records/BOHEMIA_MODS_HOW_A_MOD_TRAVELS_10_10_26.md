# MODS [sharing a mod] -- HOW A MOD TRAVELS FROM ONE PERSON TO A FRIEND (10/10/26)

Research, help only, nothing built in the game. The BB and other-game facts below are from general knowledge and were not re-fetched this round; treat them as the shape of the answer, not as quotes.

## How other games hand a mod over
- **Battle Brothers:** a mod is one .zip. The friend drops it, still zipped, in the game's data folder. Pages: Nexus, plus Discord and GitHub for the big ones (Legends). Dependencies are listed on the page and the friend installs them first.
- **Minecraft:** one .jar (or a pack file) in a mods folder; sites like CurseForge and Modrinth hold them. **Factorio and RimWorld:** a zip or a Steam Workshop click. The common thread: **a mod is one file, and the friend never edits anything to install it.**

## What that means for a phone web game
A phone has no mods folder (the earlier phone page said this: a mod is a small JSON file picked with a plain file button). So the simplest way to hand one over is **one small text file** that a friend can receive in a message, tap, and pick.

## The shape, proven small
A mod pack is plain JSON: `{"format":1, "manifest":{...}, "files":{"weapons.json":{...}}}`. A text editor opens it. `tools/bohemia_mods_pack.js pack <folder>` makes one from a mod folder; `unpack <file> <folder>` turns it back. Measured on the ten example mods: all ten packed and unpacked gave the **same merge result as the original folder** (same hash), and the biggest pack is **1,368 bytes**, small enough to paste into a chat message. A file that is not a mod pack is turned away with one plain sentence, and a patch file that is not valid JSON is left out and named, never half-packed.

## What a friend does, in order
1. Gets the file (message, email, a link to a file).
2. Picks it on the loading screen with the plain file button (design: records/BOHEMIA_MODS_THE_MODS_FOLDER_DESIGN_10_10_26.md).
3. Reads the one honest line it shows (name, version, what changed), and the plain-words codes if something was skipped (records/BOHEMIA_MODS_PLAIN_WORDS_WHEN_A_MOD_IS_WRONG_10_10_26.md).
Until the game loads mods, the friend can run `node tools/bohemia_mods_check.js` on the unpacked folder.

## Not decided here
Where mods get listed for strangers to find (a page, a repo folder, a Discord) is a community choice; this page only makes the file easy to send. Nothing here limits what a mod may contain.

ROUTED: PLUMBER, when the loading-screen file button is built, reads format 1 as above (unpack is about 10 lines).
