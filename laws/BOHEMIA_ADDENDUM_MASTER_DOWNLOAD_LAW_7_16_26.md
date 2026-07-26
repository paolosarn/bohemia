# BOHEMIA — MASTER DOWNLOAD LAW (7/16/26)

Born from today: the chat exploded, "download all" moved 113 files and ZERO
HTML, and Paolo spent three hours hand-carrying 100+ files one at a time.
Never again.

## THE LAW
**One zip. One tap. Every session regenerates it before it ends.** A new chat
needs exactly ONE upload: the latest `BOHEMIA_MASTER_*.zip`. It only ever grows,
because outputs accumulates everything Claude ships and the canon rides along.

`python3 bohemia_master.py` builds it in seconds.

## EVERY-TURN LAW (Paolo, 7/16: "automatically gets updated every time every turn")
The master is regenerated and PRESENTED at the end of **every ship turn**, not
just at wrap. Presenting costs nothing — Paolo only downloads when he taps.
What it buys: **the newest thing in the chat scroll is always a complete
one-tap copy of everything.** If the chat explodes mid-session, Paolo scrolls
to the last turn, taps once, and the recovery is over before it started. The
three-hour, 100-file pickup can structurally never happen again.

Why a zip and not one giant text file: it IS one file — the zip is just the
container that makes 328 files travel as one without breaking. Big text uploads
have a proven empty-arrival failure mode (the docx, the pastes); binary files
have landed every time. And a text bundle carries its split markers inside the
same text as the content, so it can corrupt itself the day a doc quotes a
marker. A zip cannot eat itself, is 30% smaller, and carries its own md5
manifest so every arrival verifies to the byte.

## WHAT RIDES (328 files, 77.5 MB zipped)
- everything Claude shipped (engine, gates, addenda, registries, records)
- every verdict and cooked-art .txt bank — the banks ARE the record
- live slice lineage: **V11 (live) + V10 + V9 (parents)**
- the proofs that matter: blockgen render, night blocks, pipeline status,
  batch-2 wall picker (still awaiting verdicts)
- `_MANIFEST.md5.txt` inside: every file hashed, round-trip verified 328/328

## WHAT STAYS OUT, AND WHY IT IS SAFE OUT
- **HD tile repos + the 29MB alpha** — they live in PROJECT STORAGE, which
  survives every chat by design. The master carries the working state.
- **slices V2–V8** — superseded ancestors. The exploded chat hash-proved each
  slice contains its parent (V10 = V9 verbatim + lamps). 26 MB of history for
  zero information. `bohemia_sync_ignore.txt` already declares them dead carriers.
- **one-shot judging tools** — their verdicts are banked as .txt; the tools are
  disposable (established 7/16, Paolo's own read).

## THE PROOF BUILT IN
The build prints a **by-extension table and FAILS HARD if html = 0.** That is
the exact failure mode of the download-all button, and this script refuses to
reproduce it. Today's table: 159 md · 87 txt · **35 html** · 32 js · 9 py.

## RECONCILIATION: THE EXPLODED CHAT vs DISK
Everything that chat shipped is on disk and inside the master: powergrid,
plotgen, light pass, transitions, door bank (27 doors), fire bank (34 loops),
terrain picks, street laws, neighborhood anatomy, streetlight height/power,
CLUSTERED POWER LAW, V9, batch-2 picker. The only file that died with the chat
is `BOHEMIA_LT0_WALK_V10_7_16_26.html` — **the buggy one** (lamps down the
median, V8's H=62 welded onto V9's H=60 bake). Good riddance: V11 supersedes it,
and the lamp layer gets rebuilt from blockgen's real anatomy, which the render
proof + V9's own explainer have now recovered EXACTLY (B2+B0+B5+B1 = 60 rows).
