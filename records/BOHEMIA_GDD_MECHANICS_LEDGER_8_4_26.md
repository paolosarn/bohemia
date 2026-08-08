# THE GDD MECHANICS LEDGER (8/4/26, coordinator — Paolo: "read the gdd and
# find game mechanics we have to implement")

Method: read GDD v2 (896 lines), v3 (435), v4 (288), v5 (164) end to end;
cross-checked every designed mechanic against the engine reality map (7/28),
the live backlogs, and shipped code. Statuses: BUILT / PARTIAL / ROUTED
(unbuilt, already in a lane's queue) / **UNROUTED (designed, unbuilt, in
NOBODY'S queue — the finds)** / PARKED (acts 2-3, by his own act-1-only law)
/ PENDING (blocked on a Paolo design call) / DEAD (superseded).

=============================================================================
## THE HEADLINE FINDS — designed in the GDD, in nobody's queue until today
=============================================================================
1. **THE SUCCESSION SYSTEM (v4 — "Bohemia's SIGNATURE MECHANIC") — UNROUTED.**
   Kill or remove anyone; the world runs a POWER STRUGGLE to fill the
   vacancy (roles-not-pointers, vacancy-as-contested-event, anti-soft-lock
   fallbacks). LOCKED design, patent interest noted, and it appears in ZERO
   backlogs. The game's signature mechanic was falling through the cracks.
   -> ROUTED NOW: WORLD (roles/vacancy mechanism, ships empty) + PEOPLE
   (who the successors are = dossier material). Kill-anyone is already
   ruled; this is what makes it MEAN something.
2. **HEALTH & STAMINA (v2 §15) — UNROUTED.** One combined bar (Valheim
   philosophy — his named favorite), stamina range shrinking with wounds,
   injuries that take DAYS (field medicine stabilizes, never heals). No
   surface has any of it; the run has no player health outside combat.
   -> ROUTED: RUN+COMBAT.
3. **BROWNOUTS & BLACKOUTS (v3, LOCKED) — UNROUTED.** Act-1-frequent power
   instability scaling down by act 3 (lights staying on MEANS something);
   BLACKOUT-AS-ESCAPE (the world's instability saves your life once).
   Composes with LIGHT=TERRITORY + the clustered-power law + daycycle.
   -> ROUTED: WORLD (the event) + RUN (the moment).
4. **THE CD SYSTEM + RADIO (v2 §22, LOCKED) — UNROUTED, and it is a gift to
   the sounds lane.** No streaming in-world: music is FOUND (CDs as
   collectible + storytelling, play at base/vehicle) and BROADCAST (faction
   radio as propaganda/lore; the Anarchists' pirate station, the Remnants'
   emergency channel). Faction sonic signatures per territory.
   -> ROUTED: SOUNDS (system) + contents Paolo (track lists = his).
5. **FAST TRAVEL + THE SUPPLEMENT COST TABLE + CONVOY TRAVEL (v2 §11/§13) —
   UNROUTED.** Always available, always priced (time + supplements per
   method); convoy travel (ride with Caravans/allies) as the safe-but-slow
   choice. Composes with the vehicle ladder + time-is-spent.
   -> ROUTED: RUN+WORLD.
6. **INFRASTRUCTURE TAXATION (v2 §12) + THE MAYOR-ARC RUNGS (v4) —
   UNROUTED, and they are braid-native.** Patrol the solar grid / dam ->
   passive currency; lose the patrol, lose the income. Mayor rungs:
   territory -> ~49% popular mandate -> pseudo-mayor governance. Both plug
   directly into the keystone/united-front law from this week.
   -> ROUTED: WORLD (with the braid skeleton).
7. **FUSED CONSEQUENCES (v4, LOCKED) — UNROUTED.** Planted events that fire
   on their own timeline ("~2 days later regardless") with the warning
   window ("you're gonna wanna pull up soon"). The engine hook that makes
   the world feel alive while frozen.
   -> ROUTED: WORLD (engine hook; the resolver/scheduler is the natural
   host).
8. **TRADING HUBS, ACT 1 (v2 §6) — UNROUTED.** 2-3 functioning hubs on the
   whole map, sparse and dangerous — the primary commerce points. The
   economy skeleton needs somewhere to BE.
   -> ROUTED: WORLD (with the economy skeleton EC).
9. **THE GHOST TIME LAYER (v2 §20 — the game's SIGNATURE VISUAL) —
   UNROUTED.** Trajectory lines showing past/future at every zoom: build
   previews, enemy trajectories, faction expansion. v4 notes it is
   LOD-native (the engine already computes "where is this going").
   -> FLAGGED, not lane-routed: needs Paolo's prioritization — it touches
   every render surface. Candidate: LAB feel-prototype first.
10. **SCRIPTED SCENES (v4, LOCKED base) — UNROUTED, and newly CHEAP.** The
   Bethesda method: condition -> scene, rig-posed cutscenes. v4 noted
   "cutscenes cost almost nothing once the rig is locked" — the rig is
   locked and the dialogue runtime now exists. The Act-1 cold open (family
   defense tutorial, 7/19 vision) needs exactly this.
   -> ROUTED: PEOPLE (scene runtime) + RUN (the opening consumes it).

=============================================================================
## BUILT (the GDD kept its promises here)
=============================================================================
- The Dead Eye Dial: 52 patterns, 5 packages, the two absolute rules (v3) —
  the dial IS the shipped combat.
- I-move-you-move scheduler + energy model (v4; 34 tests) — engine.
- 120 BPM heartbeat / two-clock law (v4) — everywhere.
- The rig + garment/contact/depth/anatomy laws + one-package bridge (v4) —
  the character stack, alpha-shipped.
- Overmap: complete Vegas geography canon, 90-degree law, quality map,
  underground 7 systems, KEY (v5) — frame-locked, gated.
- Continuous walk world + streaming engine (v5) — built (run adoption of
  stream() routed as RUN 0d).
- Generational fold + fold determinism + save<->fold bridge +
  amalgamationModel (v4; 200/200 deterministic dynasties) — engine, headless.
- Inventory macro/micro split + resupply seam (v4; 25 tests) — engine.
  (NOTE: the 7/27 NO-INVENTORY-GAME ruling caps the PLAYER-FACING side —
  micro inventory stays plumbing, never a bag-management game.)
- Combat shot resolution: ammo spend, dry-mag block, killshot chain, no
  stun-lock (v4; 23 tests) — engine module (the dial blob's own copy is the
  sync question already routed with the extraction).
- Save versioning / migrate-forward + sleep=save bedroll behavior (v2/v4) —
  shipped in the run.
- Persistent consequence delta model: cleared-stays-cleared, seed-
  regenerates deltas-persist (v4) — architecture built; surface adoption
  grows with the run.
- Faction roster (14+custom), power rankings, social forces (v2) — canon +
  bases on the map; the SYSTEM half is the routed standing ledger.

=============================================================================
## PARTIAL (half-kept)
=============================================================================
- Two-scale camera (v4): street + city zooms exist as tabs; the VARIABLE
  TIME-STEP (city-zoom steps advance big time chunks) is not implemented.
- Planetary zoom (v2 §21): MISSING entirely — Earth-at-night, Moon/Mars,
  karma/virtues, and the quest-log-at-planetary design. (Quest log
  currently has no home at all — v2 puts it HERE, deliberately.)
- The phone/feed (v2 §18): feed exists in the run + a richer demo slice;
  mandatory-feed, international scope, clout-earn loop not yet a system.
- Two-ledger recorded/unrecorded (v4): engine flags exist; no gameplay
  surface lets a player act off-ledger yet (authoring rule = PENDING).
- Enemy roster (v2 §19): the 12 act-1 encounter looks are on the tile
  board; trap networks, sniper positions, rigged vehicles (situational
  encounter classes) have no mechanism yet.
- Killshot cinema (v3): chain/juice partially in the dial; the 5 camera
  styles + toggle are not.
- Companions (v2 §16): routed this week (combat allies + social layer);
  the DETAIL spec (3 roles, 4-cap party = car capacity, base assignments,
  permanent death + one-revival-per-act rescue quest, thresholds,
  honesty-score tracking) rides with it — noted into the routed items.
- LOD HOT/WARM/COLD (v4): streaming + LRU = HOT half; WARM/COLD aggregate
  simulation + forward-compute promotion informal/missing.

=============================================================================
## PENDING PAOLO (designed but blocked on his named calls — GDD's own lists)
=============================================================================
Multi-enemy dial model; instant-vs-constructed buildings (city-builder
fork); offline-simulation model (waits/turns/hybrid); perk tree size +
acquisition; time-dilation second bar elaboration; recorded:false authoring
rule; supplement system detail; entity cap number; environmental combat
scope; act permanent decisions; + the standing city-builder loop design (in
flight with the coordinator).

=============================================================================
## PARKED BY HIS OWN ACT-1-ONLY LAW (do not build now, do not lose)
=============================================================================
Act 2/3 texture states + dynamic texture drift; act transitions using the
fold; the dad's book; mega projects (act 2-3 tier); endgame gauntlet +
three-generation device + nuke choice; the family box surfacing; Elder /
Defector / Prince->King Hobo arcs; endings/monument/honesty inscription;
VR station; Amalgamation heat + response ladder (architecture note kept:
heat is a DISTINCT value from standing/power when it lands).

=============================================================================
## DEAD (superseded — never implement)
=============================================================================
- The oscillating arrow (v2 §14) — superseded by the dial (v3).
- Daily upkeep / economic bankruptcy gameplay (v4 city-builder clause) —
  struck 7/31, EARNED NOT AFFORDED; buildings unlock by
  levelling/quests/act tier.

=============================================================================
## ROUTING SHIPPED WITH THIS LEDGER
=============================================================================
WORLD: succession skeleton; brownout/blackout events; fused-consequence
hook; act-1 trading hubs; taxation+mayor rungs folded into the braid
skeleton item. RUN+COMBAT: health/stamina one-bar + injury realism; fast
travel/supplement/convoy (with WORLD). SOUNDS: the CD + radio systems.
PEOPLE: scripted-scene runtime (+ the companion detail spec noted into the
existing companion items). FLAGGED FOR PAOLO: Ghost Time Layer priority.
