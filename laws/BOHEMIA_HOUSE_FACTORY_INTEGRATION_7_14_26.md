# BOHEMIA — HOUSE FACTORY: integration (7/14/26)
Bank: BOHEMIA_HOUSE_FACTORY_BANK_7_14_26.txt
Format: houses[] each {fp "WxH", wall_pack, roof_pack, door [pack,idx],
windows [[pack,idx]..], door_x, win_x, gates{}, b64 stamp}

## What it is
The assembly layer between tiles and neighborhoods: a typed generator that
composes complete house prefab stamps from approved banks (Factory Law:
spec -> generator -> gated batch -> Paolo verdict pipeline).

## Engine consumption
- A house prefab = footprint + the stamp + semantic cells: wall row solid
  (light_block), door cell = door entity (anim bank open/close, collision
  toggles), interior behind the facade loads on entry (drill-in scale).
- Worldgen lots consume prefabs: lot picks a Paolo-approved KIT (wall pack x
  roof pack combo from his gallery verdicts) + footprint that fits the lot;
  variant factory palette-shifts for tract variety (Vegas repetition law).
- Structural gates re-run at spawn (regression): door in bounds, windows
  clear, purity.

## Next / next-next
Paolo judges the 24 -> kit canon locks -> LOT PASS (lots consume approved
kits) -> BLOCK ASSEMBLY (street recipe + flanking lots = first full block
galleries). Suburban Vegas kit art (garage/stucco/driveway/block wall)
remains the named gap for true tract neighborhoods.
