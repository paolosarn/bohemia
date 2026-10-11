# PAOLO 10/11: ASEPRITE (verbatim)

> "Aseprite"

His answer to the one-time list (records/BOHEMIA_PAOLO_ONE_THING_IN_THE_UNIVERSE_TO_BUY_ONCE_10_11_26.md): number 2. One word, one purchase.

## What it is

The first tool bought for the art line. Aseprite, $19.99 once, at aseprite.org (or Steam). The pixel editor the pixel studios use: real pixel tools (outline, dither, palette swap, indexed colour, onion skin, animation frames, sprite sheet export, tilemaps), runnable with no screen (`aseprite -b` with Lua scripts), so a chat drives it the way an artist's hands would.

The other five numbers were NOT picked and are NOT asked again. If he wants one later he says its number. The free road (PLUMBER [the gun in the repo]) runs regardless.

## How it gets into the repo (PLUMBER [aseprite in the pipe])

- The licence: his purchase covers his computer. For the repo's own runner the EULA allows compiling Aseprite from its public source for your own use, so the GitHub Action builds it once from source on the free runner and caches the binary; no key, nothing pasted, nothing committed but the build script. (If the build proves too slow or brittle on the runner, the fallback is the prebuilt binary he downloads, uploaded as a repo secret-store artifact; PLUMBER measures first.)
- The scripts, in tools/aseprite/, one Lua file per job, each with its one-line usage: snap to the pack palette (indexed), one-pixel outline on or off, remove stray pixels, resize with no blur, split and stack eight-facing sheets, export a frame sheet and its JSON, pixel-count and palette report for the clean gate.
- Step 6 of the ten steps (clean and tells) runs THROUGH these scripts from now; pixelize stays as the palette-snap fallback.
- Proven by one pack tile round-tripped (open, snap, outline, export) with a byte-identical palette, and one generated picture cleaned end to end with no human.
- README a stranger follows in fifteen minutes; COOK, COOK TWO, THREE, FOUR cite the scripts by name on their one-at-a-time sheets.

## What he does

Buy it at aseprite.org, $19.99, install it on his computer. That is all. Nothing to paste into the repo.
