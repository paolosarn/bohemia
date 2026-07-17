# BOHEMIA — RENDER CONTRACT v1 (7/10/26)
The one renderer every zone uses. Demo tunnel = first consumer. Engine-first:
nothing below is demo-specific.

## Layer order (bottom -> top), per visible cell
1. GROUND — from seamless sets (b64 or crop-window rebuild). Variants rotate
   by cell hash (deterministic; fold determinism law).
2. GROUND TRANSITIONS — dual-grid: display grid offset half-cell; each display
   tile samples its 4 corner cells' terrain; if mixed, draw transition piece
   for that corner combo (harvest file below). ~5 pieces per terrain PAIR.
3. OVERLAYS — foliage/rubble/stains/gore (validated banks). Walkable,
   alpha-composited, wrap-aware variants legal.
4. PROPS/STANDING — multicell true-res; draw by depth (feet-row sort);
   occlude entities per DEPTH LAW; display_footprint honored; WALL-MOUNTED
   composites onto wall cells; cover props expose coverState to combat.
5. DOORS — 2x1/2x2 in wall lines (DOOR FOOTPRINT LAW); junction treatment =
   flush placeholder until Paolo picks.
6. ENTITIES — rig-rendered characters (120 BPM stepper), gore paints under
   bodies on death.
7. FX — beat-quantized clips (strips bank PARKED until validated; slot exists).
8. LIGHTING — validated Minecraft-model (16 levels, flood-fill, max-not-sum,
   sky+block channels); falloff curve [PENDING Paolo]; corner-averaged
   lightmap quad per Terraria research.

## Data contracts (all shipped, all gated)
ground: BOHEMIA_GROUND/WALL/WATER/PATH/ROOF_SEAMLESS_SET (tier filter S/A +
paolo_overrides) | variants: GROUND/WALL/DIRECTIONAL_VARIANT_BANK | overlays:
OVERLAY_BANK + GORE_OVERLAY_BANK | props: MULTICELL_SET (spawn law: usable OR
unflagged-allowed; NEVER-SEE/quarantines/NIGHTMARE-ONLY/UNSCHEDULED never) +
DEMO_PROP_POOL | doors: bake v12 tiles_multicell | standings: STANDING_SET |
windows: WINDOW_SET | transitions: TRANSITION_SET (this session).

## Spawn/purity invariants
Purity gate before any bake reaches screen. Purple law demo-scoped. Volcano
never. Content states enforced at spawn-table build, not at draw.
