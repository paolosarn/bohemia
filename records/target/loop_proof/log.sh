#!/bin/bash
cd /home/user/bohemia; D=records/target/loop_proof
cp $D/params.json $D/params_cycle_$(( $(cat $D/burnt_car.loop.jsonl 2>/dev/null | wc -l) + 1 )).json
python3 skills/bohemia-pixel-art/scripts/look.py $D/burnt_car.png prop --twin $D/twin_car_3.png --ground reference/art_bank/road/pack_1_cracked_street_tiles_005.png --log $D/burnt_car.loop.jsonl --saw "$1" --fix "$2" | tail -1
