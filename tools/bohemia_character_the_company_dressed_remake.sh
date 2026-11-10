#!/bin/bash
# re-make one rolled man through every sheet set he is already drawn from, each owner's own one-man command, unedited
# (CHARACTER 11/10, rule 427(b)). A set he is not in (the towns' twenty clips, the melee idles) is not added: a man
# re-dressed is the same man in the same screens, nothing more.
#   BOHEMIA_RIG_THREADS=2 tools/bohemia_character_the_company_dressed_remake.sh town_4 town_8 ...
# Before a re-run after a roll edit: delete his cached models (records/character/rig/barber_person_<id>.glb and
# person_<id>.glb) and his .gitignore'd renders, or the make and the animation tools reuse the old build.
cd "$(dirname "$0")/.."
export BOHEMIA_BPY=${BOHEMIA_BPY:-/tmp/v/bin/python}
B=$BOHEMIA_BPY
for pid in "$@"; do
  tag=person_$pid
  t0=$(date +%s)
  python3 tools/bohemia_run2_no_two_people_alike.py make $pid            || echo "FAIL make $pid"
  python3 tools/bohemia_run2_no_two_people_alike.py fight-make $pid      || echo "FAIL fight $pid"
  $B tools/bohemia_animation_everybody_idles.py person_one $pid          || echo "FAIL idles $pid"
  if [ -e slices/rig_town/$tag.json ]; then $B tools/bohemia_animation_the_towns_activities.py person_one $tag || echo "FAIL towns $pid"; fi
  $B tools/bohemia_animation_what_a_man_holds.py person_one $tag         || echo "FAIL holds $pid"
  if [ -e slices/rig_melee/$tag.json ]; then $B tools/bohemia_animation_melee_in_hand.py person $tag || echo "FAIL melee $pid"; fi
  echo "DONE $pid $(( $(date +%s) - t0 ))s"
done
