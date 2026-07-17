# BOHEMIA — ANIMATION GAP RECONCILIATION (7/14/26, corrected)

Join key = clip top-level pack/idx. Coverage: doors 27/30, fires 4/11.
First pass shipped a false 100%-gap list (wrong join key, caught same turn).

## interact_open_close: 3 uncovered
- prov_Doors_and_Arch_00
- prov_Doors_and_Arch_01
- prov_Doors_and_Arch_05

## loop_flicker: 7 uncovered
- p_camp_cookfire_tripod_14
- p_camp_campfire_15
- p_camp_cookfire_pot_16
- p_camp_cookfire_spit_17
- p_camp_campfire_small_18
- p_camp_firewood_stack_21
- p_light_flare_road_05

## loop_particles: 7 uncovered
- o_fx_flame_burst_00
- o_fx_smoke_puff_01
- o_fx_smoke_puff_02
- o_fx_smoke_puff_03
- o_fx_smoke_small_04
- o_fx_ember_trail_05
- o_fx_spark_burst_06
