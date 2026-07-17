# BOHEMIA — ADDENDUM: TWO-SCALE CAMERA, VARIABLE TIME-STEP, FUSED CONSEQUENCES
*7.1.26 — locks the camera/time model Paolo designed this session. Extends the "I move you move" time model (Time Model addendum) and the City-Builder Model addendum. Nothing here breaks I-move-you-move; it EXTENDS it to two scales.*

---

## 1. THE TWO-SCALE CAMERA (LOCKED)
Same game, same pixel style, two zoom levels that each feel like a different experience:

- **ZOOMED IN — walkable third-person body (fine grain).** You are a movable character walking the streets. Animal-tier camera, Dead Eye Dial combat, pixel art up close and intentionally creepy, carried by the music. This is the ground-floor game the rig + scheduler already serve. You see the little things, the movers right next to you, the texture of the street.
- **ZOOMED OUT — the living city view (coarse grain).** Not chibi. Same pixel style but reading as a realistic city from above. This is where the social feed lives and the mayor/management layer. Modeled on Pocket City 2's walkable-city-you-can-survey, but ALIVE: enemies move around, important characters you're entangled with are visibly out there, and because it's all visual, you don't get quests handed to you, you SEE the thing to do two grids over and go do it. Paolo's insight: the pixel style is what unlocks this. A realistic 3D game can't show your whole living to-do list as movers on a walkable map; pixel art can.

**Transition:** as fast as Pocket City 2's drop-into-your-avatar, polished to FEEL seamless. Map is slightly bigger than Pocket City 2 (Paolo: no issue with any of it). Fallout 1/2 quick-cross-the-map feel, but the map underneath is a living city, not a menu.

## 2. VARIABLE TIME-STEP — how I-move-you-move survives at both scales (LOCKED)
The freeze rule HOLDS at both zooms. Time still only moves when the player moves. The difference is the SIZE of the step:

- **Zoomed in:** one step = one tile = one small unit of time. Fine grain, you witness everything.
- **Zoomed out:** one step = one city-tile = a BIG chunk of time passes. Coarse grain, you cover ground fast, but the world jumps forward in big increments each move.

**THE LESSON (never preached):** focus on the big picture and you literally cannot see the little things, because moving in big steps fast-forwards past them. The fine-grain moments (a conversation, someone slipping through an alley, a detail two feet away) happen inside the time you skipped. You didn't miss them because the world moved on its own; you missed them because you chose to move in big steps. You can't hold both resolutions at once. True of the game, true of life. Zoom out to run the empire, lose the texture of the street.

**Engine fit:** one clock, one rule, no contradiction. The scheduler already ticks per player action; the city-view action advances the clock by a larger multiple. LOD means fine-grain movers resolve their skipped moments inside that span, seen only if you were zoomed in to witness them.

## 3. THE PERCEPTION-PERK LAYER (LOCKED intent)
Perks become a PERCEPTION system on the zoomed-out layer, not just combat stats. Better perks = you see more of what's happening around you, read the map deeper, catch the important movers, and buy back SOME fine grain even at city scale (a skilled reader of the city notices the alley movement others skip past). Fresh use of a perk tree. **[PENDING Paolo: perk tree size/structure, which perks grant what perception.]**

## 4. FUSED CONSEQUENCES — not everything waits for you (LOCKED)
Most of the world is I-move-you-move (waits for you). But some events are PLANTED with a fuse: you set something in motion (e.g. kill a leader, cut a deal) and it fires on a delay regardless of what you do, e.g. ~2 days later the camera zooms in on the consequence. Ties directly to the SUCCESSION system: you tear a hole, the power struggle to fill it has a fuse, and it resolves on its own timeline.

**The warning window (LOCKED, Paolo's call):** a fused consequence is NOT a silent gut-punch and NOT a locked cutscene. As the fuse burns down the game WARNS you: "hey, you're gonna wanna pull up soon." You get a window of turns to zoom in and reach it. Make it in time, you can act on it / intervene / change the outcome. Too slow, or too buried in the big-picture view to catch the signal, it resolves without you and you live with it. Skill = attention + position + speed (perks/transport help you get there). This respects agency, respects the lesson, and respects I-move-you-move (the warning gives you turns; the event fires on its fuse if you don't reach it).

**Engine fit:** a fused event carries a fire-turn and a warning-lead. When the clock crosses (fire-turn minus lead), the "pull up soon" signal surfaces; the player has that many turns to reach it before it resolves on the forward-compute. Slots straight into the LOD forward-compute (a scheduled tick that resolves at turn N whether or not the player is near).

## 5. SCRIPTED SCENES / CUTSCENES — Bethesda-style triggers (LOCKED technical base)
Cutscenes and scripted beats use the Bethesda method: a condition gets met -> a story event fires -> a quest stage advances -> that stage runs a scene (camera moves, actors play packages/poses, dialogue). Because Bohemia's characters are RIG-DRIVEN, a cutscene is just the skinner posing the rig, so cutscenes cost almost nothing to produce vs hand-animating. Production-law win: locking the rig makes cutscenes cheap. When a fuse burns down or a condition trips, it can fire a scene: camera flies in, involved actors play their beat on the rig, control hands back.

## OPEN FORKS (Paolo's call)
- **Warning specificity:** does the "pull up soon" warning tell you WHAT it is (named, "the east deal's going bad" — strategic, you choose what's worth interrupting for) or just THAT something's coming (a direction/pull, no detail till you arrive — tense, creepy, fits the zoomed-in horror)? Tone call.
- Walkable city exact size (locked "slightly bigger than Pocket City 2," exact TBD).
- Whether a fused consequence, once you reach it in time, is fully playable (fight/intervene) vs a shortened beat you nudge. (Leaning playable per the warning-window logic.)

---
*Status: camera/time model LOCKED. Perk specifics, warning specificity, exact size PENDING.*
