# BOHEMIA ADDENDUM — SAVES: BOTH KINDS + THE ONE-BLOB CLOUD RULE (Paolo 7/26/26, LOCKED)

RULING 1 — SAVE POINTS: BOTH. Sleep saves (bed/camp) AND free manual saves
(anytime, from the phone menu) AND a quiet autosave all coexist. Death loads
the closest previous save (per BOHEMIA_ADDENDUM_DEATH_IS_A_RELOAD_7_26_26.md).

RULING 2 — CLOUD/CROSS-DEVICE IS A LAUNCH REQUIREMENT (Paolo: "that's
literally why I decided to do this game from the very beginning... when we go
fully live the saves transfer"). Phone may run lower quality; PC/console full;
SAME save travels.

THE LAW THAT MAKES IT CHEAP — ONE PORTABLE SAVE BLOB:
1. The entire game save is ONE serializable, versioned, device-agnostic
   package. Everything about the player's game in one blob; nothing
   device-specific inside it.
2. Graphics quality / device preferences are NEVER part of the save. They
   stay per-device.
3. Every system that persists state persists it THROUGH the one blob, never
   through its own private side-channel. (Existing CITYSAVE etc. fold into
   the unified blob as the run save system is built.)
4. Save format carries a version number from day one; loaders migrate old
   versions forward, never reject them.
PHASES: (1) now — one-blob save + manual export/import (copy a save code
between devices, no server); (2) go-live — account + sync backend moves the
same blob automatically; (3) consoles — platform cloud-save services carry
the same blob. Backend choice is a go-live decision, not a today decision.
Gate expectation: the run save system ships with a round-trip check (save ->
reload -> identical state) and an export/import path.
