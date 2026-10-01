#!/bin/sh
# EVERY LIVE COMBAT PATCH, IN ORDER, REPLAYED ONTO WHATEVER ALPHA IS ON DISK.
#
# WHY THIS EXISTS, 9/28: V226 (the fight's pad is the one cut ring, his 9/7 ruling) SILENTLY
# VANISHED FROM MAIN. Another lane pushed an alpha change, I took main's alpha wholesale the
# way this lane's ship flow says to, replayed V225's tool onto it and FORGOT V226's. Nothing
# went red: every gate that could have caught it is about the board, and the ring is drawing
# code. It was found by photographing a real fight and seeing eight loose circles again.
#
# The flow was never wrong -- "take main's alpha and replay the patch tools, they are all
# idempotent and that is exactly what they are for" -- but it was a list held in my head, and
# a list in a head loses an entry. This is the list, on disk, in order.
#
# Every tool prints "already applied" and exits 0 when its mark is present, so running this
# on a tree that is already current is free and safe.
set -e
cd "$(dirname "$0")/.."
for t in \
  tools/bohemia_lot_is_sixteen_tiles_patch.py \
  tools/bohemia_the_person_is_112_patch.py \
  tools/bohemia_fight_renders_like_the_street_patch.py \
  tools/bohemia_the_frame_moves_the_ground_patch.py \
  tools/bohemia_the_pad_is_one_ring_in_the_fight_patch.py \
  tools/bohemia_the_cell_board_patch.py \
  tools/bohemia_the_mound_is_one_cell_patch.py \
  tools/bohemia_a_house_is_four_by_four_patch.py \
  tools/bohemia_no_atari_patch.py \
  tools/bohemia_house_tiles_back_patch.py \
  tools/bohemia_a_house_is_never_smaller_than_a_man_patch.py \
  tools/bohemia_house_sized_not_house_filled_patch.py \
  tools/bohemia_the_fight_at_the_phones_pixels_patch.py \
  tools/bohemia_nothing_on_the_ground_but_the_ground_patch.py \
; do
  [ -f "$t" ] || { echo "MISSING $t"; exit 1; }
  printf '%-58s ' "$t"
  python3 "$t" 2>&1 | tail -1
done
echo "ALL COMBAT PATCHES REPLAYED"
