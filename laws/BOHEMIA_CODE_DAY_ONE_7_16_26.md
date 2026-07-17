# BOHEMIA — CLAUDE CODE DAY ONE (7/16/26, post GREAT MERGE)

**Decision (Paolo, 7/16): everything moves to Claude Code. One home, no split.**
The repo replaces the master-zip carry, the project storage cap, and the
exploded-chat recovery ritual, permanently. Git history IS never-lose-files.

## WHAT YOU ARE UPLOADING
- **4 part zips** (`BOHEMIA_MASTER_07_17_26_part1-4.zip`) = 534 files, the whole game.
  Two chats each built a seed and neither was whole. These are the merge of both,
  conflict-resolved, gates green.
- **10 chunk files** = the alpha (2) + the four HD tile repos (8). They are too fat
  for GitHub's 25MB web-upload door, so they travel split. The first Code session
  rejoins them byte-exact and deletes the chunks.

Everything else is inside the parts, including the tiny `.chunkmanifest.txt`
files that tell the far end how to rejoin.

## THE FOUR STEPS (once, ever, laptop easiest)

**1. GitHub account (free).** github.com -> Sign up. This is where the game LIVES
from now on. Not on any device. In the account, like your chats.

**2. Make the repo.** New repository -> name `bohemia` -> **Public** (Paolo's call,
7/16: free, flip private later with one setting if it ever matters) -> Create.

**3. Load the seed.** On the empty repo page: "uploading an existing file" ->
drag in **all 4 part zips AND all 10 chunk files** -> Commit.

**4. First session.** claude.ai/code -> connect the GitHub account when it asks
(a couple of taps, once ever) -> pick `bohemia` -> new session -> paste this:

> Unzip all four BOHEMIA_MASTER_07_17_26 part zips into the repo root and verify
> every file against _MANIFEST.md5.txt (534 files, all must match). Then rejoin
> the chunked files: for every *.chunkmanifest.txt run
> `python3 bohemia_chunk.py join <the file it names>` and confirm each reports
> md5 EXACT (BOHEMIA_ALPHA_0_9.html + BOHEMIA_HD_TILE_REPO_part1-4.txt). Delete
> the .chunk files and the part zips once verified.
>
> Read CLAUDE.md, then 00_START_HERE_NEXT_SESSION.md, then
> BOHEMIA_ARCHITECTURE_MAP.md. Then organize: engine .js into /engine, gates and
> registries into /gates, addenda and laws .md into /laws, cooked art and verdict
> .txt banks into /banks, slices and proofs .html into /slices, judging tools into
> /tools, csv and records into /records, quest research .md into /questbook,
> production quests into /quests, everything named ARCHIVE_* into /archive
> (dropping the prefix). CLAUDE.md, 00_START_HERE_NEXT_SESSION.md,
> BOHEMIA_ARCHITECTURE_MAP.md and BOHEMIA_GRAPHICS_LAWS_MASTER stay at root.
>
> Fix the gate paths for the new folder layout, then run
> `python3 gates/bohemia_gates.py` and confirm ALL GATES GREEN (12 gates).
> Commit everything to main with message "BOHEMIA REPO BORN 7/16/26".
> Then give me the state of play.

Done. From then on:
- **Work laptop / home laptop:** claude.ai/code in a browser
- **Phone:** the Code tab in the Claude app, same sessions, pick up mid-task
- Sessions run in Anthropic's cloud and keep running when you close the lid

## WHAT CHANGES / WHAT DOESN'T
- The gates, the laws, the factories: identical, they just live in git now
- Judging tools: open them from the repo on either laptop; the session can also
  present them directly
- These chats stay as archives; the projects' knowledge stays as backup
- No more master zip after day one. The repo is the master. Commits are the law.

## HONEST FINE PRINT
Claude Code on the web is a research preview: the phone side works but is rougher
than this chat. Sessions push branches; tell the session to merge to main when
you're happy, or say "commit straight to main" and it will.
