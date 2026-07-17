# BOHEMIA ADDENDUM: PERSISTENCE V1, SUSPEND SAVE (7/7/26, overnight build)
Paolo asleep; directive: big persistence research + build. Default fork run
with (override any morning): reload resumes exactly; run/death/fold
semantics untouched, they belong to the generational fold work.

## THE RESEARCH (grounded)
- GENRE LAW: the roguelike answer since Rogue itself is the SUSPEND SAVE:
  one save per run, resume-only, never a reload-to-undo. NetHack deletes on
  death; XCOM IRONMAN is the modern industrial version: ONE slot,
  auto-overwritten every turn, scumming architecturally impossible because
  a stale "better" save never exists. Enter the Gungeon's cryo-pod is the
  same law as level-exit ritual (save, eject to menu, load-once).
- Hades/Dead Cells layer METAPROGRESSION over permadeath: run state dies,
  meta persists. Bohemia's analogue is already canon: the FOLD. Death is
  not a reload, it is a generational fold; the two-ledger model (recorded
  save vs unrecorded choices) is our anti-scum story later.
- iOS STORAGE LAW (7/2 research, still governing): Safari 7-day eviction;
  home-screen install is the shield; file:// launchers throw SecurityError
  on setItem; the EXPORT BLOB is the guaranteed line regardless of
  launcher. Engine Persist module already ships slots + versioning +
  migration chains + export.

## WHAT GOT BUILT (in the alpha, 8/8 save gate + all world gates green)
- SUSPEND SAVE: ONE slot, auto-overwritten continuously. No second slot,
  no time machine.
- CITY reports state debounced (800ms) after every move, mode transition,
  bike toggle, zoom change, plus a pagehide flush: {seed, day, min, hx,
  hy, overmap pos, mode, riding, hzoom} v1-versioned.
- PARENT owns storage (CITYSAVE): backend PROBED at boot per the iOS law;
  disk (localStorage) when the launcher allows writes, silent in-memory
  fallback when it does not. Approved prefabs ride in the same slot.
- RESTORE on city load: position, clock, day, mode (city or dropped-in
  human), bike mounted state, zoom level, world seed (world rebuilds if it
  differs), prefab approvals replayed. Reload = exactly where you stood.
- 💾 SAVE PANEL in the city tab (UI LAW honored): shows the live backend
  ("device storage" vs "memory only in this launcher, use EXPORT SAVE"),
  EXPORT SAVE opens the standard share/copy/download modal as
  bohemia_save.txt (.txt per the iOS share law), IMPORT accepts a pasted
  save and applies it live.
- GATE: _save_gate.js: cross-instance roundtrip (position, clock, zoom,
  riding, mode), world determinism across restore, bad-state rejection.

## PENDING, PAOLO
- Launcher answer from 7/2 still open: hosted URL + home screen = full
  persistence endgame; the current chat-file launcher is likely memory
  mode, so EXPORT SAVE is the real line there. The panel now TELLS you
  which mode you are in.
- Fold/death semantics, dynasty slots (engine Persist slots are ready for
  them), and the unrecorded-ledger anti-scum: all wait for fold work.
- Overwrite-on-death vs keep-last-save: fold decision.
