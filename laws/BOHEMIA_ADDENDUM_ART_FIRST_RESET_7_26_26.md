# BOHEMIA ADDENDUM — THE ART-FIRST RESET + THE TARGET SCREEN LAW (7/26/26)
# Paolo's ruling (unhappy, and right) + the coordinator's directive (owned,
# not derived from him — pressure-test research commissioned separately).

PAOLO 7/26: "I'm obviously very unhappy with the graphics... I can't even
begin to envision anything because you're just cooking up bullshit tiles...
if we had a bunch of tiles that are fully decorated properly that I approve
of... I can't approve any more shit without the world actually looking
consistent every time I see it with approved graphics... I like the districts
in city builder mode... the walkable districts [street level] are two
different things... we have to make assets that upgrade from act one to act
three and it's smart and knows that... there's two or three sessions asking
me about quests and we're not even close to that."

THE DIAGNOSIS (coordinator): the project has NO TARGET RENDER — no image
anywhere of what the finished game looks like. Industry order is concept ->
TARGET RENDER -> systems built in greybox -> tileset built to the target ->
merge. Bohemia built a month of systems with per-lane bottom-up art and no
destination image; the liked art (city-builder districts) had a real
reference (Pocket City), the hated art (street level) had none. Referenced
art works; unreferenced art is slop.

THE DIRECTIVE (LOCKED):
1. THE TARGET SCREEN LAW: a new ART lane's first and only deliverable is 2-3
   hand-assembled candidate TARGET SCREENS (fake screenshots) of the walkable
   street level at its best — real character, decorated street, 2-TILE DOORS,
   visible dressed interior, approved assets as the base + whatever coherent
   new tiles needed, composed like a poster. Paolo picks ONE. The winner
   becomes the VISUAL CONSTITUTION: no art ships unless it moves the real
   game toward that image; a target-match gate is built the same turn the
   target is picked. Until a target screen is approved, ALL new visual
   cooking outside the ART lane is FROZEN (integration of already-approved
   assets continues; new pixels do not).
2. TILESETS ARE SETS: master tileset per act, produced and judged as ONE
   assembled-in-context artifact (a composed scene), never loose tiles.
3. THE ACT TRIPTYCH: every tile family is born with act1-dead / act2-
   recovering / act3-rebuilt variants in its spec (tilespec extends from
   act-1 material to all three acts).
4. QUEST ASKS FROZEN: no session surfaces quest questions/verdicts to Paolo
   until the visual bar is set (quest lanes may build silently; placement
   picks are PARKED).
5. HUMAN-SCALE PROPORTION becomes machine law: doors are 2 tiles tall;
   proportion canon gets its own gate (queued with the ART lane).
6. GRAPHICS SETTINGS DIRECTION: identical pixel art on all devices; phone =
   smaller canvas + reduced effects; PC/console = full. Device prefs stay
   out of the save blob (existing law).
7. ONE art-direction chat for now ("art" joins the lane vocabulary). More
   production chats only AFTER the target screen exists.

## CORRECTIONS FROM THE PRESSURE-TEST RESEARCH (7/26, same day — the research
## was commissioned to DISAGREE and it did; these amend the directive above):
A. ERA RULE CORRECTED: assets are born era-READY (3D-bake source structured
   with overlay/material layers so act variants derive cheaply), NOT
   era-complete. Act-1 look locks first. Era derivation proven on 2-3
   representative families only. Landmarks get bespoke era looks; filler
   SHARES era treatments (the AoE model). Never hold an approval hostage to
   three finished eras.
B. "MACHINE-CHECKED CONSTITUTION" PRECISELY: machine-gate the PROXIES only —
   locked master palette (every pixel indexes it), per-layer value bands
   (floors/walls/tops), one outline convention, one dither policy, one light
   direction, edge-pixel seam contracts (hashable). The gestalt "matches the
   target" is ALWAYS a human side-by-side verdict (Paolo). Never a literal
   image-diff gate (gameable/false).
C. THE ANTI-BIOSHOCK RULE: the painted mockup is not the constitution — the
   target phase's acceptance test is CUT the picked mockup into the real
   starter tileset and REASSEMBLE the identical frame from those tiles on
   the real render path. The tile-reassembled frame is the framed target.
   If reassembly looks worse, the mockup lied; fix before locking.
D. STEP ZERO, THE MOBILE RENDER CONTRACT, pinned BEFORE painting: base
   resolution, tile px size, integer zoom level(s), iPhone portrait
   viewport, palette, light direction, outline/dither rules. Target painted
   at exactly that spec. Pipeline rule gated: offscreen 1x render + integer
   blit + smoothing off (non-integer scaling voids pixel art on 3x phones).
   Track live canvas memory vs the ~224MB iOS floor (chunk caches x eras is
   how a 32MB game hits a 224MB wall).
E. GREYBOX CAVEAT: systems lanes keep working during the freeze ONLY on the
   final data contracts (real tile size, real layer enum, real tilespec —
   fake pixels, real contracts), and one real tile family gets pushed
   through every system (render/occupancy/save/era-swap) within days of the
   target locking. No feel-canon gets locked from grey builds (placeholder
   art skews playtests).
F. STYLE-DRIFT DEFENSE: every future cook runs the proxy gates (B); every
   batch is judged only as an assembled scene next to the target. The gates
   are the art director's presence in sessions Paolo isn't in.
