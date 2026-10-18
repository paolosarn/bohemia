# THE ORPHAN GATES (PLUMBER 10/18, VAMILY [the orphan gates], SIXTY-EIGHT-GATES-THE-SUITE-NEVER-RUNS)

GATE REGISTRY named 69 orphans when this round started (68 when the row was written; DIRECTION's style_guide_gate.py
landed in between). Every one was run ONCE, alone, timed, on this box, with nothing edited. Result:

- 62 REGISTERED in gates/bohemia_gates.py (a block at the end of the GATES table), each with its owner lane, its
  header's purpose and its verdict at registration. 53 green, 9 red. Slow flag = opens a browser or ran over 10 s:
  44 slow, 18 fast. Measured cost of the 62 run one after another: 3,120 s.
- 7 TOLD DEAD (gates/gate_registry_gate.js TOLD_DEAD), all COMBAT's: they drive the walked street to a fight, which
  died 9/28 (THE STEP IS A HOUSE, 9/15, superseded). Not run, not deleted, not edited. COMBAT is told on its section.
- NEW LEG on GATE REGISTRY: every TOLD_DEAD file still exists AND its file name is on VAMILY.md. RED CASE: run before
  the notes were written it was 6 passed 1 failed (EVERY GATE TOLD DEAD ... IS TOLD ON VAMILY.md); after, 7/0.
- TWO MORE LANDED ON MAIN DURING THIS ROUND, both SOUNDS (map_heard_gate.js 17/0 in 15 s, settlement_heard_gate.js
  21/0 in 46 s), with no row; registered the same way. 64 registered in all, 55 green.
- GATE REGISTRY: 5 passed 1 failed (69 orphans) -> 7 passed 0 failed.
- SUITE FINISHES was red on both of its legs before this round (stale census, floor 74.4 min against a 2,700 s
  budget) and is red on the same two after (floor 75.8 min). The orphans were real work the floor never counted.

## THE NINE REDS, NAMED TO THEIR LANES, NEVER EDITED TO PASS
- PEOPLE a_merge_did_not_delete_a_system_gate.js 7/1: the [control] leg replays 4f1611e4 against 74aee15c; a shallow
  clone (every cloud session) has neither commit. Environment, not a regression; the fix is the gate's.
- PEOPLE the_company_is_a_cast_gate.js: a press is 1 cell against a reach of 9.
- CHARACTER body_scale_gate.js: 15/0 with the repo served on 8231, refused without; the suite serves nothing.
- CHARACTER hem_follows_the_leg_gate.js: 13 garments reach the leg with no hem entry (124 measured, table 111).
- CHARACTER shape_frozen_gate.js: SPIKED PAULDRON and STEEL SPIKED PAULDRON unfrozen (11/1, served).
- UI every_item_has_an_icon_gate.js: shelf items with NONE for an icon; one name, different pictures.
- UI the_roster_and_posts_look_gate.js: weapon off, the bag slot has no icon.
- UI the_pad_is_travel_speed_gate.js: five demo boots, past the 600 s cap twice (300 and 600); driver door throws.
- RUN TWO one_file_loop_gate.js: hire one at the hall, YOU/Reyna/Tavo undefined.
- PORTRAIT speak_along_gate.js: 8 portrait comments with no ledger row.

## A SIDE EFFECT NOW IN THE SUITE (RUN TWO's to decide)
Four of RUN TWO's registered gates rewrite their VOTE pictures in slices/vote/ every run (market_pack_art,
roster_hurt, settlement_people, stash_screen; 8 PNGs changed on this run, restored before this commit). A suite
run on any lane's box now leaves those files modified. A gate that writes the shipped surface should write to
a scratch folder unless asked (--shots).

## WHY THERE WERE SIXTY-NINE
A lane writes a *_gate file, runs it by hand, cites it on its SHIPPED line, and never adds the row. GATE REGISTRY
caught that the whole time, but it was one red among many on a suite already red, so nobody read it. The clone is
shallow (56 commits), so git cannot say when each landed; the owner is read from each gate's own header.

## EVERY ONE, AS RUN (file, exit code, seconds, owner, outcome)

- a_merge_did_not_delete_a_system_gate.js  rc 1  1.1 s  PEOPLE  REGISTERED
- ambitions_gate.js  rc 0  22.2 s  PEOPLE  REGISTERED
- barber_gate.js  rc 0  0.3 s  CHARACTER  REGISTERED
- body_scale_gate.js  rc 1  0.7 s  CHARACTER  REGISTERED
- bubble_face_gate.js  rc 0  28.7 s  PEOPLE  REGISTERED
- character_in_the_vote_tab_gate.js  rc 0  1.2 s  CHARACTER  REGISTERED
- climbing_gate.js  rc 0  31.3 s  RUN TWO  REGISTERED
- contracts_gate.js  rc 0  0.0 s  ECONOMY  REGISTERED
- creditor_stands_gate.js  rc 0  26.0 s  PEOPLE  REGISTERED
- creditor_waits_gate.js  rc 0  39.4 s  PEOPLE  REGISTERED
- dev_strip_gate.js  rc 1  74.1 s  COMBAT  TOLD DEAD
- equip_from_the_stash_gate.js  rc 0  9.9 s  RUN TWO  REGISTERED
- every_item_has_an_icon_gate.js  rc 1  8.3 s  UI  REGISTERED
- followers_gate.js  rc 0  16.1 s  PEOPLE  REGISTERED
- goodbros_gate.js  rc 0  0.2 s  PEOPLE  REGISTERED
- hair_match_regression_gate.js  rc 0  1.2 s  PORTRAIT  REGISTERED
- hem_follows_the_leg_gate.js  rc 1  3.2 s  CHARACTER  REGISTERED
- house_board_gate.js  rc 1  28.5 s  COMBAT  TOLD DEAD
- house_rulers_gate.js  rc 1  22.5 s  COMBAT  TOLD DEAD
- keeper_lines_gate.js  rc 0  0.0 s  PEOPLE  REGISTERED
- keepers_gate.js  rc 0  0.1 s  PEOPLE  REGISTERED
- long_injury_gate.js  rc 0  0.0 s  PEOPLE  REGISTERED
- lot_is_sixteen_tiles_gate.js  rc 1  135.2 s  COMBAT  TOLD DEAD
- market_pack_art_gate.js  rc 0  8.0 s  RUN TWO  REGISTERED
- narrator_gate.js  rc 0  0.9 s  SOUNDS  REGISTERED
- one_file_loop_gate.js  rc 1  64.0 s  RUN TWO  REGISTERED
- one_mode_gate.js  rc 1  28.0 s  COMBAT  TOLD DEAD
- one_terrain_effect_gate.js  rc 0  33.0 s  COMBAT  REGISTERED
- pricetable_gate.js  rc 0  0.0 s  ECONOMY  REGISTERED
- roster_hurt_gate.js  rc 0  27.4 s  RUN TWO  REGISTERED
- roster_screen_gate.js  rc 0  4.0 s  RUN TWO  REGISTERED
- rumours_travel_gate.js  rc 0  38.4 s  PEOPLE  REGISTERED
- settings_in_our_materials_gate.js  rc 0  25.2 s  UI  REGISTERED
- settlement_people_gate.js  rc 0  54.6 s  RUN TWO  REGISTERED
- settlement_screen_gate.js  rc 0  79.5 s  RUN TWO  REGISTERED
- settlement_sideways_gate.js  rc 0  52.9 s  RUN TWO  REGISTERED
- shape_frozen_gate.js  rc 1  3.3 s  CHARACTER  REGISTERED
- somebody_hires_you_gate.js  rc 0  21.6 s  PEOPLE  REGISTERED
- speak_along_gate.js  rc 1  0.1 s  PORTRAIT  REGISTERED
- sprite_scale_gate.py  rc 0  0.0 s  DIRECTION  REGISTERED
- stash_gate.js  rc 0  0.0 s  ECONOMY  REGISTERED
- stash_screen_gate.js  rc 0  1.2 s  RUN TWO  REGISTERED
- style_guide_gate.py  rc 0  0.1 s  DIRECTION  REGISTERED
- the_bar_says_three_things_gate.js  rc 0  134.5 s  UI  REGISTERED
- the_barbers_door_gate.js  rc 0  29.5 s  RUN TWO  REGISTERED
- the_company_is_a_cast_gate.js  rc 1  85.5 s  PEOPLE  REGISTERED
- the_far_end_at_the_phones_pixels_gate.js  rc 0  131.6 s  RUN  REGISTERED
- the_fight_bar_is_studio_made_gate.js  rc 0  7.3 s  UI  REGISTERED
- the_flip_off_the_face_gate.js  rc 0  142.0 s  UI  REGISTERED
- the_maps_bar_gate.js  rc 0  131.0 s  UI  REGISTERED
- the_name_matches_the_ramp_gate.js  rc 0  2.9 s  CHARACTER  REGISTERED
- the_one_screen_gate.py  rc 0  5.0 s  UI  REGISTERED
- the_pad_is_travel_speed_gate.js  rc 124  300.0 s  UI  REGISTERED
- the_person_is_112_gate.js  rc 1  132.0 s  COMBAT  TOLD DEAD
- the_phone_never_opens_black_gate.js  rc 0  137.8 s  UI  REGISTERED
- the_phone_turns_gate.js  rc 0  259.7 s  UI  REGISTERED
- the_phones_board_gate.js  rc 0  140.3 s  UI  REGISTERED
- the_phones_crack_gate.py  rc 0  3.1 s  UI  REGISTERED
- the_phones_look_gate.js  rc 0  135.0 s  UI  REGISTERED
- the_region_is_battle_brothers_size_gate.js  rc 0  15.6 s  RUN  REGISTERED
- the_reshuffle_mark_gate.js  rc 0  133.0 s  UI  REGISTERED
- the_roster_and_posts_look_gate.js  rc 1  10.1 s  UI  REGISTERED
- the_settlement_labels_gate.js  rc 0  41.4 s  UI  REGISTERED
- the_sideways_sides_gate.js  rc 0  266.6 s  UI  REGISTERED
- the_six_at_pack_pixels_gate.py  rc 0  0.3 s  UI  REGISTERED
- the_start_screens_look_gate.js  rc 0  25.0 s  UI  REGISTERED
- the_texture_set_gate.js  rc 0  0.1 s  CHARACTER  REGISTERED
- who_you_were_gate.js  rc 0  49.1 s  PEOPLE  REGISTERED
- you_can_start_it_gate.js  rc 1  22.5 s  COMBAT  TOLD DEAD

(body_scale and shape_frozen re-run with the repo served on 8231: 0 in 30 s, 1 in 4 s. the_pad re-run at the
suite's 600 s cap: timed out again.)

[bb gates]: nothing here is taken from Battle Brothers; this round is the suite's own plumbing. The rule it
applies is this lane's: a check nobody runs is not a check, and the registry derives orphans from the folder,
never from a list.
