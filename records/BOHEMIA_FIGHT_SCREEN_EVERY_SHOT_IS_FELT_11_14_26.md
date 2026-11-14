# FIGHT SCREEN: EVERY SHOT IS FELT (11/14/26) -- BUILD 11/14l - EVERY SHOT IS FELT

VAMILY rule 450(b)(c)(d), ask row 622. PAOLO 11/14: 'anytime anyone fires a shot I want a muzzle flash on the screen, some quick shit,
like it goes all white or something, I want people to feel this shot for real.'

## WHAT WAS MEASURED BEFORE A LINE WAS CHANGED (main 7edf9343, BUILD 11/14k)
- A SHOT ALREADY LIT THE STREET AND KICKED THE GLASS (FEEL's __THE_FIGHTS_WEIGHT__: three hard bands of light on the ground round the
  shooter, a tint on his picture, a kick of two or three pixels) but only for a shooter he can see, and only round the man.
- NOTHING AT THE BARREL AND NOTHING ON THE WHOLE SCREEN. The word 'muzzle' was not in the fight's page. A rifle fired from the dark
  across the board changed no pixel he was looking at.

## WHAT CHANGED
1. `records/target/bb/fight_shot.json` (new, draft:true, ONE FILE A MODDER EDITS): the white's peak by gun (pistol 0.42, rifle 0.58,
   shotgun 0.74), how long it stands (34 ms, two frames) and falls (60 / 85 / 120 ms), the volley window (150 ms), three a second at
   most, the soft share (x0.3, a slower fall, a smaller barrel flash), and where the barrel's end is and how big its flash is, in
   parts of a man's height.
2. `slices/BOHEMIA_FIGHT.html`, `__EVERY_SHOT_IS_FELT__`: on the gun's own line in the attack's start (the kick key, the moment its
   sound lands), for ANYONE's gun:
   - THE WHITE: #shotflash, a white sheet over the board and under the cards; its strength is set a frame at a time by tickShot (no
     css animation): the peak is always drawn once (a slow phone never misses a shot), stands 34 ms, falls to nothing. BIGGER FOR A
     BIGGER GUN, by the rig's own three kinds.
   - THE BARREL: shotBarrel, drawn over the man where his gun ends (forward along his aim, up from his feet): a white core, a hot
     tongue along the aim, a cross against it, square pixels of his own size, two drawn frames. Only on a man he can see: a shot out
     of the dark whites the screen and is heard but does not give the shooter away (rule 157(c)).
   - IT NEVER STROBES (450(c)): a shot inside 150 ms of a flash JOINS it (and makes it the bigger gun's); no more than three flashes
     begin in any second (the web's own line for flashing, WCAG 2.3.1); the shots held back are still seen at the barrel and heard.
   - SOFT: SETTINGS' new FLASH switch (boh.flash: FULL or SOFT; a marked row in slices/bohemia_settings.js), MOTION: LESS when FLASH
     was never picked, or the phone's own reduce-motion. The fight reads it at every shot, so it holds from the next one.
   - FEEL's weight (the lit street, the kick, the tint) is untouched and plays with it. No rule of the fight, no die, no board, no
     hand-over and nothing of AUTO was edited.
3. `slices/vote/FIGHT_SCREEN_EVERY_SHOT_IS_FELT.html`: the VOTE card PLAYS it (450(d)): the fight's own page, a crew with a pistol, a
   shotgun and a rifle against rifles, on AUTO, dealt again when it ends; FULL and SOFT change the card only, never his setting.

## THE GATE: EVERY SHOT IS FELT (gates/every_shot_is_felt_gate.js, registered) 7/0
S1 the numbers read (a bigger gun a bigger white, the longest flash 154 ms, three a second, soft x0.3). S2 the page's wiring and the
switch. S3 in a fight on the fight's page: 7 gun shots (4 his, 3 theirs; pistol, rifle, shotgun), 7 counted, 7 flashes each at its
gun's peak, the longest 133 ms, the barrel drawn, no second began more than 2, 3 bow shots threw none. S4 eight shots in a tenth of a
second are ONE flash; twelve shots a fifth apart: 8 whites, 4 held, the worst second began 3. S5 a pistol whites to 0.42 on FULL (even
with MOTION: LESS), 0.13 on FLASH: SOFT, 0.13 on MOTION: LESS with FLASH never picked. Planted: the three-a-second line taken out (12
whites, a second began 4), the gun's line taken out (8 shots, 0 felt): each red.

## ON THE PAGE HE PLAYS (rule 441(a); tools/bohemia_fight_screen_on_the_page.js, WHY_MODE=shots)
The real page opened the way a stranger opens it, three fights a run against a band with rifles through the map's own door, AUTO
pressed with a finger. Before the second fight a finger opened SETTINGS and pressed FLASH (it read SOFT, a 44 by 44 point button on
the glass); before the third it pressed it back (FULL).
RESULT: 12 fights on the page, 71 gun shots counted by the glass, 71 whites, each at its gun's peak: the alpha upright 3 of 3 whole, the alpha sideways 3 of 3, the demo sideways 3 of 3, the demo upright 2 of 3 whole (its third fight had ONE shot, a rifle out of the dark: the screen whited at 0.58 and no barrel was drawn, as it is meant to; too few shots for the run's own count, said plainly). The FLASH switch pressed by a finger on all four: SOFT then FULL, and the next fight's flashes followed it every time. 0 page errors.
Every flash stood at its gun's peak (0.42 or 0.58 on FULL; 0.13 or 0.17 on SOFT), the longest 117 ms on FULL and 200 ms on SOFT, the
white sheet as big as the screen, no second began more than 2 flashes. Page errors: 0.

## WHAT IS NOT IN THIS SHIP, SAID PLAINLY
- THE BARREL'S PLACE IS A RULE OF THUMB, not read off the gun's picture: forward and up in parts of his height, by gun kind. On the
  stills it sits on the barrel for a pistol and a rifle, his and theirs; a gun held at an odd angle could put it a few pixels off.
  The rig's sheets carry no barrel point; when they do, shotBarrel reads it.
- SETTINGS' controls are 36 points tall on the sideways phone (SETTINGS gate's 'clears the thumb' leg is red on clean main for 26
  controls; FLASH makes it 27). Not this lane's card; said for UI.
- The crossbow whites the screen as a rifle: in our table the crossbow row IS a rifle (the fight's own isGun says so).
- No sound was changed: the flash rides the shot's existing sound and moment.

## ROUTED (proposals; the coordinator adds jobs)
- TUNING: the seven felt numbers in fight_shot.json (the three whites, the hold, the falls, the soft share) belong in the one table.
- SOUNDS: the white lands on the shot's own moment (the kick key); if a shot's sound moves, the flash moves with startAnim's `at`.
- EYES: UI.shotSeen (fired, white, volley, held, barrelDrawn) and UI.shotLog on the fight's frame are what the glass did.
- UI: the FLASH row is a marked row in your settings file; its control is your .setbtn.

[bb Battle Brothers has no guns worth the name: its handgonne smokes and its screen never flinches. Ours flinches on every shot.]
[analog horror: the white is a tape's overexposed frame, the picture gone for two frames and back; never a strobe.]

*FIGHT SCREEN, 11/14/26.*
