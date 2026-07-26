# BOHEMIA ADDENDUM — THE REPO DIET (7/25-26/26, Paolo-ordered, coordinator-run)

WHY: sessions took minutes to boot. Measured: ~1.1GB fresh clone (702MB git
history — mostly 135 historical copies of the 32MB alpha, plus 172MB HD tile
banks) + a 4,387-line handoff every session read at boot. Paolo: "I'm tired of
the slow ass sessions... it's really providing a lot of friction and I hate it."
He ordered the cleanup and told the coordinator to run it (7/25). That order is
the explicit exception to the coordinator's never-push-to-main default, for this
job only.

## PHASE 1 — THE HANDOFF DIET (DONE 7/26)
- The full pile moved verbatim to archive/BOHEMIA_HANDOFF_PILE_THRU_7_25_26.md
  (archive/ is history, never current; carry_gate excludes it by design).
- 00_START_HERE_NEXT_SESSION.md rewritten as the pointer it legally is:
  hot rulings, per-lane status, the PENDING shelf, the standing plan. NEW
  STANDING RULE: the handoff stays under ~500 lines; sessions trim the oldest
  entries into laws/BOHEMIA_STATE_OF_PLAY when the cap nears.
- The three coordinator reference docs (architecture map, findings, prompt
  library) carried onto main in laws/ so every lane can read them.

## PHASE 2 — THE HISTORY SLIM (EXECUTED 7/26/26 — SLIM GENESIS)
DONE: full mirror verified in paolosarn/bohemia-vault (public, imported by Paolo,
all 9 branch tips byte-verified 7/26), then main rebuilt as a single "SLIM GENESIS" commit of the current tree, so a
fresh clone drops from ~1.1GB to roughly the working tree. Sequence executed:
vault verified (all 9 branch tips) -> main force-pushed as SLIM GENESIS ->
merged 0-ahead lane branches retired (originals in the vault) -> connected-run's
2 additive commits re-created on the slim base -> quest-log-access island branch
KEPT untouched until a session confirms porting is complete -> Pages deploy
verified -> gate suite green.
AFTER: sessions must be reopened fresh (old clones hold pre-slim history and
will fail to push; nothing is lost — work lives on main or in the archive).

## PHASE 3 — KEEP IT SLIM (standing)
- Superseded multi-MB slices/banks get moved to the archive repo, not left in
  the live working tree.
- The handoff diet re-runs whenever the file passes ~500 lines.
- The alpha remains the one shipped file (one-alpha law untouched); its ongoing
  ~30MB-per-ship history growth is accepted until the next slim, which repeats
  this same archive-first procedure.
