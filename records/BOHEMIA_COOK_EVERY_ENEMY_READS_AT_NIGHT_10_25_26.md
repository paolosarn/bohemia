# COOK [every enemy reads at night] (line 3 of his list; EYES 10/25 q43)
# BUILT 10/25, NOT YET SEEN (rule 179)

## THE ASK
Line 3 of records/BOHEMIA_EVERYTHING_HE_ASKED_10_24_26.md (their looks, layered): EYES 10/25, q43: "the one Kid stood on a dark
tile at night and was never drawn"; round two: "the Kid's look in light: not met". The coordinator's row: every enemy kind
reads on every board at night.

## WHAT WAS WRONG (measured, tools/bohemia_cook_every_enemy_reads_at_night_10_25_26.js)
The fight page itself, the strip, the suburb and the freeway by day and by night (seed 31, his phone upright). Every look an
enemy can wear (the three enemies' 17 looks: the Mechanic, the Kids and Runners, the Heavy; the 13 gangs; the 51 rolled people;
the tiers; the 3 beasts: 86 looks), standing, facing the camera, put through the page's own night for a man and the lift the
page picks for that tile, against the night ground under every unlit tile a man can stand on (UI.groundLum, the page's own read
of its baked night board). WCAG's contrast on the worst tenth of the dark tiles.
- The night's ground keeps its light now (COOK's night board, 64f54ccf): a dark tile is 0.03 to 0.055 in light.
- The man's night was a MULTIPLY (the moon's tint lifted toward white): it can only darken him. On a dark tile the page picked
  "the moon lifts him" (MAN_MOON), which left a man in dark clothes at 0.04 to 0.05: his ground's own light.
- On the strip and the freeway ALL 86 looks stood under 1.4 to 1 off the darkest tenth: the Church and Reds gangs 1.04, the
  Caravans people 1.04, THE KIDS 1.08. A Kid on a dark tile was the ground. (The suburb, paler: 5 looks under 1.4.)

## WHAT IS BUILT (slices/BOHEMIA_FIGHT.html: moonTile, moonFor, sheetLum, MOONLIT)
The pick is made for the MAN on his tile, not for the tile alone. The night he knows (the tile's own pick, moonTile) wherever it
stands him 1.45 to 1 (MOON_ENOUGH) off his ground, his own sheet's middle light (sheetLum, read once per look and lift when its
night sheet is built) against the tile's; where it would not, the gentlest that does, in order: the other of the two old lifts
(the silhouette, MOON_SHADE; the moon's lift, MAN_MOON), then MOONLIT a little, then MOONLIT more: his own picture SCREENED over
itself after the moon's tint (c(1 + a(1 - c)), a = 0.6 and 0.85), which lifts his darks and leaves his lights, so his colours and
folds are kept. His gun, shield and the prop he holds take the same lift (UI.moonAt). His day rim stays dark ink (his 10/17 NO
on the coloured outline). On a lit tile he is drawn by day, as before. The ground's night is untouched.
THE LOOP CAUGHT (looked at each time, records/target/cook_enemy_night/shots/side_by_side_phone_portrait.jpg): a cool screen of
44 52 74 over every man on a dark tile washed a dark coat pale blue-grey, a ghost's look (rule 134's ghosts wear the cold wash);
36 40 50 still washed; adding the man over himself kept his colours but clipped a white shirt to white; the screen over himself,
picked only where the old night does not read, leaves most men as he knows them and lifts the two or three a dark tile would hide.

## MEASURED AFTER
- The strip and the freeway: the weakest of the 86 looks 1.43 to 1 (a rolled townsman), THE KIDS 1.45; the suburb 1.59; every
  look at least its day's stand-off on those boards (the Cartel gang 1.46 against 1.28 by day).
- In colour too, before: on the darkest tenth of the strip's tiles the old pick left the Mechanic, a Kid and the Heavy 4.4 to
  7 apart in CIELAB (the eye needs about 10): the ground's warm tan was kept by the night board, but the darkest tiles have
  almost no colour left and the men are near grey.
- The pale boards (an earlier run on scrub and shore): 2.7 to 1 at night against 3.5 by day: the night darkens a pale ground
  and 2.7 reads (the gate's second leg takes 2 to 1 and over).
- The fight gate's own night leg ('a man stands off his ground at night as well as by day within a tenth', on the glass, every
  man of both sides on the strip) is RED ON MAIN BEFORE and after: day 2.2 to 2.4, night 1.80 before, 1.82 with the first pick; deeper
  silhouettes (-0.45, -0.8) moved it to 1.80 and 1.83. It cannot be met by the men: your men by day stand on pale ground
  (0.31 to 0.44) at 3.6 to 4.6 to 1, and the night takes that ground to 0.19 to 0.25 (rule 73 keeps it at 0.55 of the day).
  Said, not hidden; NOTE on COMBAT's board.
- NEVER DRAWN, THE OTHER HALF: at night a man sees 5 tiles (7 less the night's 2) unless the tile he looks at is lit (rule
  157, Battle Brothers' Vision), and the page draws only the men his crew can see. A Kid who keeps to the dark past 5 tiles is
  never drawn; that is the sight rule, COMBAT's, not the picture. NOTE on COMBAT's board.

## THE PICTURES
records/target/cook_enemy_night/shots/side_by_side_phone_portrait.jpg: the strip and the suburb at night, the old pick, the
pick now, and every enemy kind (the Mechanic, the Kids, the Heavy) stood on the board's darkest open tiles, so the Kid's look
is met at night (every man drawn for the picture, whatever his crew can see).
records/target/cook_enemy_night/reads_phone_portrait.json: every look on the strip, the suburb and the freeway, day, night, the old pick.

## THE GATE
gates/every_enemy_reads_at_night_gate.js (EVERY ENEMY READS AT NIGHT, in the suite): 258 looks x boards, every one 1.4 to 1 or
more on the worst tenth (the Kids too), nine tenths of the day's or 2 to 1, the old pick caught (177 under 1.4), no page error.
4 of 4.

## REFERENCE CHECK (the 9/4 standing duty)
Battle Brothers at night darkens the ground and keeps every figure readable; the world: under a moon a figure reads as a
silhouette on a pale road and as a lit shape on dark ground, the rule the page's own comment named in 10/19, now made per man.
REUSE: the page's own night pass, its ground read and its sheets; nothing new drawn.
