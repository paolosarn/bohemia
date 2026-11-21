# COMBAT FOUR: THE ROBOT FACTORY, HELD (11/21/26)

COMBAT FOUR built the robot factory's inside (rule 461, more boards) and HELD it: the map never hands a fight the robot factory's cell.

## THE FIND, FOR WORLD (the map's lane)
The map places THE ROBOTICS FACTORY (Paolo 7/6/26, his find: 'a robotics/machine-tool factory next to the Henderson airport... machines
that make machines') as one cell east of the airport's south-east strip (engine/bohemia_overmap.js, robofactory). On the page's own map
(slices/BOHEMIA_CITY_WORLD.html, om) that cell reads 'arterial': a road pass paves it after it is placed. Measured: the page's map, 4 of
4 valleys the page runs opened, 0 robot factory cells (its rect at 79,76 read district 'arterial'); the engine module alone, 10 of 300
seeds with no robot factory cell. Nothing of the map edited here.

## WHAT IS READY (not listed in slices/fight_ground/insides.json, not in the repo as a data file)
Gate THE BIG INSIDES on the drafted data: 18 passed, 0 failed (26% of men bare after round one against 44%; 24 of 24 fights ended).
Districts ['robofactory'], share 0.7. Pieces all stand-ins. Two layouts:
the_assembly_line:
    ####################
    #pp.L..p.hh.p..L.pp#
    #....c...f.c.......#
    #.FAF.hFAF..FAF.h..#
    #..CCCC.CCCCC.CCCC.#
    #.FAF..FAF.hFAF..p.#
    #..p.c...h...c..h..#
    #D...h.d..dd..d..cD#
    #..h..c...h...c.p..#
    #.FAF.hFAF..FAF.h..#
    #..CCCC.CCCCC.CCCC.#
    #.FAF..FAF..FAF..p.#
    #.......f..c.......#
    #pp.L..p.DD.p..L.pp#
    ####################
the_parked_machines:
    ####################
    #RRR.RRR..RRR.RRR..#
    #..w..zh..w..z...f.#
    #.zz.w.hh..h..w.zz.#
    #..h.hGGG..GGGh.h..#
    #.w.hhGhG..GhGhh.w.#
    #..z..G.G..G.G..z..#
    #D..w.hzwwwwzh.w..D#
    #..z..G.G..G.G..z..#
    #.w.hhGhG..GhGhh.w.#
    #..h.hGGG..GGGh.h..#
    #.zz.wh.h..h.hw.zz.#
    #..w..z..hw..z...f.#
    #RRR.RRR.DD.RRR.RRR#
    ####################
Legend: # wall; . floor; A arm; F fence; C conveyor; p bins; h hull; c cart; L forklift; d dock; R parked; w bench; z cables; G cage; f fire; D doors.
Tiles: the arm, the fence, the cage and the parked machines block (the fence and cage are mesh: seen through); the conveyor rough 3 AP
and low cover; bins, hull, forklift, bench cover; cart and dock low cover; cables rough 3 AP, no cover; fire, doors as every inside.
THE NEXT SESSION: once WORLD's map hands the cell, write the data file from these strings (the school's or the truck stop's file is the
model), list it, run the gate and the page.
