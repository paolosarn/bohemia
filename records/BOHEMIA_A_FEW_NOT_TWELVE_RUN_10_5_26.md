# A FEW, NOT TWELVE (RUN, 10/5/26, [a few, not twelve], rule 75b)

> **PAOLO 10/5:** *"for demo purposes just one enemy attacking... 12 vs 12 is cool but that can't be the
> flow... a lot of math on the type of enemies, the difficulty, the equipment that they get as you progress."*

## MEASURED FIRST
- **Every fight dealt COMBAT's fixed nine brigands.** The map did build a crew list for each fight (a job's
  crew was 2 plus the jobs done, bent by the door's picks; a road party had its event's number), but the
  shell passed the fight only the board's kind and the night, so the list never arrived.
- **Battle Brothers' own math, from the wiki dump:** roster strength is the 12 strongest men at 10 + 2 a
  level past 1 (Game Mechanics:105,111; 14 for the militia and the manhunters, GROK_60); a job scales with
  that, the skulls and the job type; roaming parties scale "mostly with distance to civilization and time,
  slightly with player strength"; day scaling stops at day 100; combat difficulty raises count and tier;
  the count words (a few 2-3, some 4-6, many 7-10, lots 11-13, a plethora 14+). **The wiki gives no
  arithmetic from those to a head count, and no unit costs.**

## NOW (`__A_FEW_NOT_TWELVE__`, the map; one line in the shell)
- **records/target/bb/party_math.json:** every input with its Battle Brothers source; the few coefficients
  that turn them into a number marked `ours` (draft), calibrated on the rule's own anchor (a fresh
  three-man crew's first job on day one is a few thugs), waiting on Grok ask 22 and TUNING:
  - a job: roster strength / 10 (one enemy per level-1 man) x the skulls (0.8 / 1.0 / 1.3) x the difficulty;
  - a roaming party: 2 + 0.1 a day past the first + 0.1 a block from the nearest town + 0.01 of the roster
    strength, x the difficulty; both between 2 and 13;
  - the difficulty is COMBAT's scale, Battle Brothers' own (0 Beginner, 1 Veteran, 2 Expert, 3 Legendary):
    NEW HERE / SEEN IT / OUTLIVED IT are 0 / 1 / 2, and they also step the count (0.85 / 1 / 1.15 / 1.3).
- **The map sizes every party** (a job when taken and again when reached; a road party where it meets you)
  and sends it with the encounter; the shell hands `{count, days, difficulty, faction}` to the fight;
  COMBAT's enemy math dresses it by tier. The road events keep their names and words; their fixed numbers
  (including his "six, maybe eight") give way to the math, which is his newer ruling.
- **Measured on the demo:** a fresh three-man crew's first job is 2, A FEW; the Lone Wolf's is 2 (the
  floor); the Block Watch's is 10, MANY. On the road, day 1: two brigand thugs; day 100: twelve, LOTS, with
  a leader, a marauder, marksmen and raiders. Day 60: NEW HERE 7, OUTLIVED IT 10.

## FOUND ON THE WAY
- **The difficulty scale was off by one** in the first cut (SEEN IT sent COMBAT's 2, Expert), which made
  every default fight's tier 20 days later: day-one roads dealt raiders and poachers. COMBAT's own check
  uses 1 for Veteran; the file maps SEEN IT to 1 now.

## WHAT THIS LEAVES
- The job's pay is still 1 battery against a start of 70 to 270 ([the origin sets the company]); the
  pay formula is Grok ask 10's (contract pay by skulls and days) and ECONOMY's.
- Roaming parties are not yet drawn on the map with their count word ([you can flee] and rule 68a: time
  stops in sight); `partyMath('roaming', {x, y}).word` is ready for it.
- The coefficients are ours until Battle Brothers' hidden formulas arrive (Grok ask 22).

## CHECKS
- **A FEW, NOT TWELVE**, new, 7/0, registered slow. Mutations, each red: the shell drops the party (the
  fight deals its own nine: 9 for 2); a job forgets its party; roaming ignores days (day 100 = day 1); the
  old off-by-one difficulty (day-one marksmen, the Block Watch's job LOTS).
