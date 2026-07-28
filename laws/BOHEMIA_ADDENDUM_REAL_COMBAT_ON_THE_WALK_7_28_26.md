# BOHEMIA ADDENDUM — REAL COMBAT ON THE WALK (Paolo 7/28/26, LOCKED)

Asked (off the engine reality map): seamless combat for real, or a faster
version of the current tab swap?

Paolo's words: "Real combat in the exact whole coding how we built it."

THE RULING:
1. THE GOAL IS THE REAL THING. Seamless combat on the walk surface is the
   destination. The faster-tab-swap option is dead as a goal (it may still
   land incidentally as a step, but it is never presented as the deliverable).
2. "IN THE EXACT WHOLE CODING HOW WE BUILT IT": the dial's existing code IS
   the combat. This is an EXTRACTION, never a rewrite. BohemiaMelee moves out
   of COMBAT_B64 into engine/ as the one canonical body with byte-identical
   behavior — the proof of a correct extraction is that the dial plays
   exactly the same. Nobody reimplements combat "cleaner" along the way; the
   mechanics, the beat clock, the mercy states, the juice — all of it carries
   whole. Any behavior change during the move is a violation, not a bonus.
3. SEQUENCE (from the reality map's honest ledger, now ruled work, COMBAT
   lane owns the spine):
   a. Extract BohemiaMelee to engine/ + resync tool + freshness gate
      (byte-identical output is the gate).
   b. Enemy rendering on the walk surface's tile canvas.
   c. One input model reconciled (hold-to-walk pad + dial ring coexisting).
   d. One beat clock (the dial's audio clock becomes the walk's clock too —
      kills the run's hardcoded BEAT=500 at the same time).
4. Ally-in-combat and ambient walk danger queue BEHIND the extraction, as
   already routed — they build on the engine module, never on the blob.

Routed: BOHEMIA_BACKLOG.md COMBAT ER (amended — the ruling replaces the
"faster swap" alternative). Reality map §4 pending list updated: this is no
longer [PENDING Paolo].
