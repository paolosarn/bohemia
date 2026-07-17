# BOHEMIA — RELAY SCRIPT: PASTE THIS IN THE QUEST CHAT (7/16/26)

Paolo is consolidating everything into ONE seed for the GitHub launch. The
attached BOHEMIA_MASTER part zips are the current seed: 315 files, full canon,
graphics engine, gates, laws, quest vault included. Your job is a MERGE PASS,
then rebuild the parts. Follow this exactly:

1. Unzip all master parts into one working folder. Verify every file against
   `_MANIFEST.md5.txt` before anything else. Report the count.
2. Read `CLAUDE.md` (in the seed) — the TRUTH HIERARCHY section governs this job.
3. LAYER IN anything this chat/project has that the seed lacks or that is NEWER:
   quest deep-dives, research files, addenda. Rule: NEWEST DATE WINS. Never
   overwrite a seed file with an older same-name file. If two same-subject files
   differ and dates do not settle it, KEEP BOTH and flag loudly for Paolo.
4. CLEANUP IS REGISTRY, NEVER DELETION (never-lose-files law): anything obsolete
   or hit by a newer addendum gets ONE LINE in `bohemia_superseded.txt` (format:
   filename | replaced by / reason). It stops riding forward; it is not erased.
   Do not "clean" by judgment calls — if you are unsure something is obsolete,
   it is not obsolete, leave it and flag it.
5. Regenerate the canon map: `python3 bohemia_canon_index.py .`
6. Rebuild the seed: `python3 bohemia_master.py --parts` (the script is in the
   seed; it fails hard if html count is zero and prints the by-extension proof).
7. Verify reassembly: union all parts, every md5 must match the manifest.
8. Present the new parts + a one-paragraph diff: what was added, what was
   superseded and why. Paolo carries the parts to the launch chat.

If this chat holds the four BOHEMIA_HD_TILE_REPO files: also run
`python3 bohemia_chunk.py split <each>` and present the chunks — they cannot
ride inside the parts (25MB GitHub door) and travel separately.
