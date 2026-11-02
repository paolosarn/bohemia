# FINISHER, ROUND ONE: THE HALF-BAKED, FINISHED OR CHECKED (11/2/26)

Brief (the coordinator, 11/2): Paolo, 'There's things unfinished... some features that are just half baked and not fully
implemented... The game needs more everything in every direction.' Work every row of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md
that is not a clean SEEN, in order: HALF and A HOLE, then NOT SHIPPED, then NOT SEEN / NOT WALKED; skip the rows other lanes hold
(250-253, 257, 259, 262-266, 268-272, 275, 276, the main quest, social media, the town's ground around the phone); never touch the
phone's file, the fight board and HUD, or the map's movement and zoom.

## WHAT THE COUNT MISSED
The 11/2 count read the status column as EYES left it at round six (10/26, ~15:15). After that walk the lanes shipped some forty
more rows on 10/26 (RUN TWO's stall and shop, CAMP's town is safe, healing stops at full, the wound's days, WORLD's danger ramp,
SOUNDS' faction songs on the map, UI's no top bar, COOK's fifty perk icons, death sounds...), marked BUILT, NOT YET SEEN, and then
every lane stopped (Paolo 10/26, 'finish the last task and stop'). So most 'NOT SHIPPED' rows were built and simply never walked.
This round runs each lane's own phone-size gate on the demo cut from main (3fd0b9dc, BUILD 11/2w) and walks what no gate covers.

## BUILT THIS ROUND
1. THE FIGHT SAVES AT ITS START (rule 233; lines 155, 165). engine/bohemia_fight_start.js is the shell's FIRST script. At the bell
   (nfOpen) every game key (boh...) and the map's hand-over are copied into one record, bohemia.fight.start.v1 (about 62 KB on a
   fresh game, 17 keys); the fight's own per-turn keep is off inside the game (keep:false, resume:false). Back on the map (nfHome)
   the record goes 2.5 s later (after the map's save beat). If the page dies anywhere between (mid-fight, on the spoils), the next
   boot puts every key back BEFORE anything reads one, removes the keys the fight made, and once the map is up after CONTINUE the
   shell hands the same encounter back (BOHEMIA_FIGHT_RESUME); the map restores what its end-of-fight listeners read (the job's
   LOOP.fighting, the raid, the boss on his map: carried on the hand-over as __ctx) and sends it through its one door with the
   meet answered. The ground and the lineup are dealt from a kept die (opts.deal, two lines in the fight's start(); the dice
   after the deal roll fresh, so a reload is a new try, never a replay). NEW GAME forgets the record. His settings, notes, votes
   and the fight's pace never roll back.
   MEASURED on the phone (390 x 844, touch), the tab killed with chrome://crash: a fight at round 3 with a man dead and the wounds
   written came back at round 1, the same three brigands, YOU 64 DESI 57 RAUL 53 as they walked in, the same ground (scrub +
   landfill), the condition as at the bell, the new key gone; won and killed on the spoils: the same fight, round 1; won and home:
   the record gone, a crash then is the map, no fight; no page error. Gate: gates/the_fight_saves_at_its_start_gate.js.
2. EVERY STALL BUYS HIS GEAR (rule 265(b); line 196). Under the stall's supplies, YOUR GEAR: every piece in his stash with a SELL
   box, the shops' way (one tap shows it in the strip, two taps sell, a right click sells), paying the smith's price (sellBack)
   moved by the place's size (ECONOMY's size_mult: camp 0.95, town 1.02, fortress 1.10; the fortress pays the smith's price).
   MEASURED on the phone: Colorful (a camp), a worn knife (30 of 40): one tap 'Sell the knife: +6 batteries. Tap it twice to sell.',
   two taps 'Sold the knife. +6 batteries.', 290 to 296. Trade goods join the list when they ride in the stash (266(a) is not in
   the game: WORLD TWO's prices on the map are, the goods are not).
3. THE LONG EXPOSURE (rule 273(c); line 210). While HEAL passes the hours in a town, every frame adds two percent of itself to a
   held plate laid over the live town at 65 percent: what stands still stays sharp, the walkers leave ghosts, night crosses over
   slowly; the plate starts again when his finger moves the town and is gone 1.5 s after the rest ends. Seen on the phone
   (Colorful, 13:00 RESTING).
4. THE END SCREEN NEVER SAYS 'NO NEW LEVEL' OVER A LEVEL TO SPEND (line 221's hole): the head counts what waits ('3 LEVELS TO
   SPEND'; '1 NEW LEVEL, 3 TO SPEND').
5. EVERY PERK'S PICTURE BESIDE ITS WORDS ON THE CREW SCREEN (rule 252(c); line 179): COOK's fifty icons (slices/perk_icons, made
   10/26 and never shown anywhere) on the man's PERKS line (24 px) and on every button of the perk picker (32 px).

## CHECKED ON THE DEMO (each lane's own gate, phone, this round; the rows' marks say the same)
See the status column of each row (marked 'FINISHER 11/2').

## LEFT, AND WHO MUST
- The stall's and the shops' double taps on the phone: the mechanics pass (the computer's right click sells, one tap lights), but
  on the phone ten stall lines and a board sit under the phone (THE STALL BUYS AND SELLS P1), so a finger lands on the phone: the
  town's ground around the phone (rules 279, 292-294), the lane on it, not this one.
- The second HEAL in a town (line 209 T2): see the row.
- The fight's page errors (line 229): blitMan's packed sheet, COMBAT.
