#!/bin/bash
# re-make one rolled man through every sheet set, each owner's own command, unedited (CHARACTER 11/10, rule 427(b))
cd /home/user/bohemia
export BOHEMIA_BPY=/tmp/v/bin/python
B=/tmp/v/bin/python
for pid in "$@"; do
  tag=person_$pid
  t0=$(date +%s)
  python3 tools/bohemia_run2_no_two_people_alike.py make $pid            || echo "FAIL make $pid"
  python3 tools/bohemia_run2_no_two_people_alike.py fight-make $pid      || echo "FAIL fight $pid"
  $B tools/bohemia_animation_everybody_idles.py person_one $pid          || echo "FAIL idles $pid"
  if [ "$pid" != "town_9" ]; then $B tools/bohemia_animation_the_towns_activities.py person_one $tag || echo "FAIL towns $pid"; fi
  $B tools/bohemia_animation_what_a_man_holds.py person_one $tag         || echo "FAIL holds $pid"
  $B tools/bohemia_animation_melee_in_hand.py person $tag                || echo "FAIL melee $pid"
  echo "DONE $pid $(( $(date +%s) - t0 ))s"
done
