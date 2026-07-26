# BOHEMIA ADDENDUM: SINGLE-FILE CARRY LAW (Paolo, 7/8/26, LOCKED)

## THE LAW
Session-to-session downloads = THE ALPHA ONLY (plus bohemia_engine.js
only when Claude explicitly asks for it). Everything else rides EMBEDDED
in the alpha or lives in the project. No loose files, ever.

## WHAT THE ALPHA NOW CARRIES (self-describing via two embedded blocks)
1. BOHEMIA_MUSIC_REPO block (text/plain): the entire music brain: all
   laws (standing horror-FF direction default, new voices, variety,
   screech, graveyard final), the full paste-able cook prompt, voice
   ledger by batch, verdict history. Cooks update it in place same turn.
2. BOHEMIA_TOOLBOX block (text/plain): manifest + JSON of every
   permanent test gate and tool, base64 + md5 per file: prefab_proof,
   tex_gate, bike_gate, cooker_gate2, save_gate, newvoice_gate,
   walk_proof, pack_intake.py. The manifest includes a one-line node
   extractor; extraction was PROVEN: all 8 md5s verified and an
   extracted gate ran green from a clean directory.
3. The four game modules were always embedded (RIG/COMBAT/CITY/PREFAB
   as base64); module sources rebuild by decoding the constants.

## THE DIVISION OF HOMES
- ALPHA: the game, the music brain, the toolbox. The one download.
- PROJECT: GDD, addenda, bohemia_engine.js, spun-out repo txt at wrap.
- Alpha + project = total state. A session holding both can rebuild
  everything, run every gate, and cook under every law with zero other
  files.

## MAINTENANCE RULES
- Any new permanent gate or tool created in a session gets ADDED to the
  toolbox block the same turn it goes green.
- Every music cook updates the embedded repo block in place.
- At wrap: spin the repo txt out of the alpha for project upload, diff
  the toolbox against gates created in-session, ship anything missing.
