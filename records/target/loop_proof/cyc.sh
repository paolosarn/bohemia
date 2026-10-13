#!/bin/bash
# one loop step: set params (python dict update), render, sheet only
cd /home/user/bohemia; D=records/target/loop_proof
python3 -c "import json,sys;p=json.load(open('$D/params.json'));p.update(json.loads(sys.argv[1]));json.dump(p,open('$D/params.json','w'))" "$1"
python3 tools/bohemia_direction_burnt_car_from_the_pack.py $D/params.json $D/burnt_car.png
python3 skills/bohemia-pixel-art/scripts/look.py $D/burnt_car.png prop --twin $D/twin_car_3.png --ground reference/art_bank/road/pack_1_cracked_street_tiles_005.png --sheet-only | grep -v "look sheet"
