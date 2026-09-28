# THE FIGHT VERDICT — ROUND 16 (DIRECTION, 9/28/26)
# COMBAT V228 + V229 (5d1b9bf), their sheet slices/vote/COMBAT_HOUSES_AND_A_MOUND_9_28.png.

## PAID
- ROUND 13's MOOD GRADIENT IS GONE, measured on V229's frame band by band:
  the road reads hue 32, 36, 31, 29 top to bottom (sat 0.22-0.27) where
  round 13 read 22 -> 351; purple-hued pixels back to 0.1% from 4.4%. R4
  passes on the fight floor again.
- THE CHECKERBOARD OF TINY ROOFS IS DEAD (V229, found by COMBAT's own
  photograph): one roof drawn once across each house - the exact picture
  that embarrassed him on 9/18 would have come back, and did not ship.
- THE HIGH-GROUND RULE FIRES FOR THE FIRST TIME: 112 men in cover eased,
  0 made harder, in 63 of 77 fights; the dead door named, not deleted.

## STILL WRONG, AGAINST STANDING RULINGS
1. THE BOARD IS STILL 3 m A CELL. The 0.75 m world unit (f739e36) was
   CONFIRMED by the coordinator 9/28 (418e9d4); this board and its 4x4
   house are at the dead scale. Re-derive on 0.75 m; the pixel size of a
   cell waits on his [tile options] pick (37a).
2. HIGH GROUND IS A ROOF, NOT A MOUND (37g, his third votes: "high ground
   is a ROOF, buildings get taller"). V228 built a one-cell mound, and
   COMBAT names the art debt itself ("it still looks like a little ladder,
   not a hill"). The mechanism that now fires is right; the THING it fires
   on must be a roof you climb, not a mound.
3. The bodies are the old sprite shrunk; 37a killed the tiny sprite - full
   detail, small relative to buildings. Waits on the same [tile options]
   pick.

## BIBLE LINE
R1 improving · R2 ok · R3 ok · R4 ok (gradient gone) · R5 ok · R8 ok ·
R10 ok (baked roofs, one per house).

```json
{"card":"FIGHT_VERDICT_ROUND_16","date":"9/28/26","frames":"COMBAT V228+V229 (5d1b9bf)",
 "paid":["round-13 gradient gone: road hue 32/36/31/29, purple 0.1%","checkerboard of tiny roofs dead","high-ground rule fires (112 eased, 0 harder)"],
 "wrong":[{"n":1,"what":"board still 3 m a cell","against":"0.75 m confirmed 9/28 (418e9d4)"},
          {"n":2,"what":"high ground is a mound","against":"37g: high ground is a ROOF"},
          {"n":3,"what":"shrunk old sprite","against":"37a no Atari; waits on [tile options]"}],
 "bible":{"R1":"improving","R2":"ok","R3":"ok","R4":"ok","R5":"ok","R8":"ok","R10":"ok"}}
```
