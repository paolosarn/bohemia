# UI TWO 10/26: THE PHONE OVERHAUL, ONE PHONE ONE PLACE, THE JOB YOU ARE ON, THE MAIN QUEST'S SLOT, HIS JOBS ONLY

Rows: [the phone overhaul] (rule 212), [one phone, one place] (rule 213), [the job you are on, on the phone] (rule 227),
[the main quest's slot] (rule 228(c)); rule 226(c)'s HEAL app, which amends 212(b)'s CAMP; and rule 232 (the coordinator's
URGENT note: his jobs only, the cross in a circle; records/BOHEMIA_PAOLO_THE_PHONE_SHOWS_HIS_JOBS_ONLY_AND_HEAL_IS_A_CROSS_10_26_26.md).
His words in full: records/BOHEMIA_PAOLO_THE_PHONE_OVERHAUL_10_26_26.md,
records/BOHEMIA_PAOLO_ONE_PHONE_ONE_PLACE_AND_THE_CAMERA_FRAMES_AROUND_IT_10_26_26.md, and the 226 to 228 records.

## MEASURED BEFORE (the demo at 34092c4d, 390 x 844)
- The map wore three corner things: the old phone top right (156 x 185, the two best-paid offers, rule 148), the speed pad
  bottom right (II and GO, 105 x 58) and RUN TWO's CAMP plate beside it. The town wore the same old phone over its own
  buttons (rule 211). The fight wore no phone at all; its abilities sat in the fight's bar.
- Nothing published where the phone was: RUN's mapOnGlass read #cityfeed's box, nobody else read anything.

## WHAT IS BUILT
ONE PHONE, DRAWN ONCE (slices/bohemia_phone.js). Every page that wears the HUD loads it (bohemia_ui_materials.js, one marked
loader, __ONE_PHONE__); the TOPMOST page of the game draws it (the shell, over the map, the town, the camp, the fight and the
spoils, all of which are its frames), so the rectangle is the same on all of them by construction, not by keeping four copies
in step. In his chosen bottom corner (RIGHT by default, Hoober: about two in three thumbs are right thumbs), ten points and
the safe area in. 124 x 276 points upright (0.9 on a phone on its side, 1.25 from 500 points across: a tablet, a computer).
Over the fight's cloud wipe, so it never disappears into it; under the game's SETTINGS card, which fades it and lets presses
through.

ONE FUNCTION EVERY SCREEN READS (for RUN, RUN TWO and COMBAT's [... frames around the phone] rows):
- `BOH_PHONE_RECT()` in every frame: {left, top, right, bottom, width, height, side, on, screen, cls} in that frame's own
  pixels (the town's frame, laid under the bar, answers its own offset).
- `BohemiaPhone.padding()`: the margin a camera frames around (Google's map padding): upright, the band under the phone's top;
  on its side, the band beside it. `BohemiaPhone.openCentre()`: the centre of what is left. [UI TWO's default, his to correct]
- every frame's `<html>` carries `boh-phone-on`, `boh-phone-left|right` and `--boh-phone-left/top/w/h/gap-r/gap-l/gap-b`.
- a `bohemia-phone` event fires in every frame the moment the corner flips or the device turns (detail: rect, padding, side, on,
  screen); rule 279's one source for the towns: THE PHONE flips the side inside a town and the settlement screen's own page hears
  it in about 10 ms with the new side and rectangle (`BohemiaPhone.side()` answers there too).

THE FIVE APPS, rendered through the rig (tools/bohemia_ui2_phone_apps.py imports the kit's tin, masks, light and camera;
three texels a point; slices/phone/): PLAY/PAUSE (amber, the big slot; the clock and the march, travelSpeedSet, the
spacebar's door; the last speed its mark, 1.22x; a held press opens the speeds, one on the map for now), CREW (the social
app's people; the bar's own CREW door), HEAL (rules 226, 232(b), his 'a medical icon maybe in a circle': a red cross inside a ring, the ring the company's ONE gauge
from CAMP's numbers, BohemiaMapCamp.condition(): from the top, clockwise, the blood red over its share, the missing blood dark,
the armour grey over its share, the missing armour dark; lit from the kit's sun; no word on it; a tap is CAMP's
BohemiaMapCamp.toggle(), making camp on the map and breaking it over the camp), FEED (his company's page: its name, one tap to rename, the game's
one name `BohemiaCompanyName`, and the feed says 'We go by THE DUST LOT now'; the city's posts under it, the handle first,
no faces, rule 217), RELATIONS (every town, Battle Brothers' nine bands and the number, and the last thing that moved it).
The hour is on the phone ONCE, the clock beside PLAY (GOING / STOPPED / IN TOWN / RESTING under it); the status bar says where
he is; the phone never says the day, the bar does (THE DAYS ONCE, rules 121(g), 123: 'How many times ur gonna show how many days?').
The wallpaper is the map's own pixels around his crew, twice up, on the beat; in a town or at camp the place's own picture.
The newest post drops over the status bar as a strip of receipt and crawls once (what he did and what the world did always;
the valley's small talk at most once a minute).

THE JOB COLUMN (rules 227, 228, 232(a): his jobs only): at the top of the home, the MAIN QUEST's slot first, always kept (a dim
pocket, no words pretending), then the jobs he is on (two at most), and every slot he does not fill EMPTY, READY TO GO (a plain
empty well, no words); never an offer, on any screen; each a receipt: what and where, its red stars, its time (THERE+BACK when
it is paid in town, rule 222); a tap makes it PLAY's job; X asks once with the town board's own cost in one line ('Drop it:
the Church like you less.'), DROP drops it through BohemiaJobKinds.drop, a tap anywhere else keeps it. PLAY with nothing
picked sets off toward the picked job through the map's own path finder (travelTo), or RUN's `window.mapPlayToJob(id)` the
moment RUN's [play takes you there] defines it.

IN A FIGHT: the glass flashes, a red crosshair strikes in three stop-motion holds and beats twice on the 120 BPM beat, COMBAT
under it; then the abilities page: the acting man's face and name and his abilities (rule 180(g): every fight button that is
not move, fire, the strike or the reload: the bag swaps, the weapon's sweeps, the perks' skills), three a row, up to twelve,
in the kit's pockets; a man with none says so in one line over three empty pockets. BACK (take back the last step) rides
the page too, its first pocket, while the walk can be taken back: on a phone upright the bar beside the phone had no room for
it and WAIT slid over it, so a press meant for BACK ended his turn (measured by THE FIGHT BY HAND's BACK leg). A press on the
phone presses the fight's own button. END TURN, AUTO, RETREAT, WAIT, STRIKE and RELOAD stay on the fight's bar, which is laid
out of the phone's band (an interim rule in the phone's file until COMBAT's own [the fight frames around the phone] lands). The moment the
fight is won or lost the phone strikes back to its apps.

THE SETTINGS: the game's SETTINGS card carries THE PHONE (CORNER LEFT | RIGHT; every app with up, down and HIDE, but PLAY and
HEAL say ALWAYS: rule 232(b), on the phone always; the first app takes the big slot); a finger held on the phone's home opens it. LEFT mirrors the phone at once, no reload.

WHAT STEPPED ASIDE (212(g)): on the map the old phone, the speed pad and the CAMP plate are hidden by the phone's own
stylesheet (RUN's code untouched; the lines are marked __ONE_PHONE__ for RUN to take out). CAMP's own HEAL plate (#campbtn) and the camp's #healbtn stand down
under the phone the same way, as CAMP's note asked. The town's LEAVE stands over the phone in its corner (one marked line in
UI's TOWN lift). The map's spoken line stands beside the phone (bottoms level) or over it, never under it (one marked line in
UI's voicePlace); WORLD's job names at the glass's edge step round the phone's box (one marked line in bohemia_job_kinds.js). The company screen's stash stands beside the phone under 700 wide.
DYNASTY's SWITCH TIMELINE lived in the old opened phone: after the first crisis the new phone's status bar shows a TIMELINE tag
that opens that same door.

## RULES 238(a) AND 286: EVERY PRESS IN HIS CORNER, NO BUTTON TWICE, THE FEED ON THE FACE
His words: records/BOHEMIA_PAOLO_ALL_THE_BUTTONS_ON_THE_PHONE_AND_THE_PHONE_NEVER_GROWS_10_26_26.md and
records/BOHEMIA_PAOLO_THE_SCREENS_FIT_THE_PHONE_NO_BUTTON_TWICE_THE_FEED_IS_ALWAYS_ON_10_26_26.md.

MEASURED BEFORE (b4dc2b38f, 390 x 844 upright): on the map CREW was pressed in two places (the bar's CREW and the phone's CREW
app); the bar's gear (SETTINGS) and NOTES were on the glass and not on the phone; in a town LEAVE was the town's own button,
standing over the phone; at camp BREAK CAMP (the camp's LEAVE) and the phone's HEAL both broke camp; the feed was an app (FEED)
plus a toast over the status bar.

THE HOME, ONE SIZE (124 x 276, never longer, with any number of jobs), top to bottom inside the case's lip (228 points of glass):
the job column (the main quest's slot, his held jobs with the arrow, the empty slots); THE FEED, a strip of the two newest posts
(the handle, then the words; the newest drops in on the beat; what he did in green) where the toast and the FEED app were;
PLAY/PAUSE and HEAL, the two big ones; the place's band: the hour once and GOING / STOPPED / RESTING on the map and at camp,
LEAVE in a town (a door with an arrow, through the rig); one row of four small icons: CREW, RELATIONS, NOTES (a notepad and a
pencil, through the rig), SETTINGS (the gear). Every icon reads in greyscale by its shape; HEAL has no word (the cross is the
word). SETTINGS can move RELATIONS, CREW and NOTES and hide any of them; SETTINGS itself never hides (it is the way back).

EACH PRESS IS THE OWNER'S OWN: CREW clicks the bar's CREW (the company screen), NOTES the bar's NOTES, SETTINGS the bar's gear,
LEAVE the town's #leave, HEAL CAMP's BohemiaMapCamp.toggle(); so the doors stay in their owners' code and the copies on the
glass step aside under the phone's stylesheet (marked __ONE_PHONE__): the bar's gear and NOTES; the town's LEAVE; the camp's
BREAK CAMP. The bar's crew chip stays as what it shows (his lead's face, the head count, their blood), a readout with its press
off, since CREW is the phone's. The bar keeps its readouts (the day, the crew chip, the batteries, the place). Escape in a town
presses the same LEAVE. The town's page opened on its own builds no phone and keeps its own LEAVE.

TAP THE FEED: the catalogue on the phone's own glass (BohemiaFeed.read, eighty newest first, scrolling back), three icon filters
(what you did, what the world did, the city's life), his company's name at the top with RENAME (the keyboard, 268(a)); the
status bar is back.

IN A FIGHT: the abilities page's last row carries CREW, NOTES and SETTINGS small, so they are on the phone there too; the fight's
own commands are on it as well (the next section).

## RULE 238(a) IN THE FIGHT: EVERY PRESS OF THE FIGHT ON THE PHONE
MEASURED BEFORE (12bf5667e, a road fight in the game, 390 x 844 upright): the fight's bar carried END TURN (the big button: FIGHT
at the line, then WALK, SHOOT, HIT or THROW with its chance once a tile is picked), STRIKE, RELOAD, WAIT, RETREAT, and over it AUTO
and the speed (1x); the phone carried the man's abilities, BACK, and CREW, NOTES, SETTINGS.

NOW, in the game's fights, the phone's fight page is, top to bottom: his face and name; THE BIG BUTTON the width of the glass,
saying what the fight's says (FIGHT, END TURN, or the act and its chance with the act's own mark), amber when it will do a thing;
one row: WAIT (a clock; RUN DOWN and amber when they break, COMBAT's RUN THEM DOWN, rule 198(h)), RETREAT (two chevrons running back;
a red ring and SPARE when every one of theirs runs, COMBAT's SPARE THEM; amber while it waits for
the second press), AUTO (an arrow turning round; amber when on, the odds tint over it, the beat's glow when it would win), the
speed (1x, 2x, 4x); his abilities four a row: STRIKE and RELOAD first (the fight's own pictures and its chance or AP), BACK, the
bag swaps, the sweeps, the perks' skills; then CREW, NOTES, SETTINGS. Every one presses the fight's own button (P.cmd, P.press),
so the fight's rules stay in the fight. WAIT, RETREAT and AUTO through the rig (app_wait, app_retreat, app_auto), read in
greyscale by shape. The fight's bar keeps the man (his face, blood, armour, fatigue, AP) and the round's order; its second row,
END TURN, AUTO and the speed are off the glass under the phone's stylesheet, so the board gets the second row's height back.
COMBAT's bench (the fight's page on its own) builds no phone and keeps every button. The keyboard keeps its keys (space is WAIT).
Gates that press the fight's buttons in the game press the one on screen: tools/bohemia_fight_press.js (fightPress, fightAt).

## GATE
gates/the_phone_gate.js, THE PHONE (in the suite): phone upright, on its side, a computer; right then left; real taps; the
counts are in the commit. Four plants bite. Rule 232(d) in it: zero, one and two jobs held (cards equal the held jobs, the
other slots empty), no offer, the HEAL ring read back off its own pixels at 72 angles against CAMP's numbers, PLAY and HEAL one
size on the map, at camp and in the town. Re-aimed for the one phone, each keeping what it protects: THE HEAL BUTTON (CAMP),
THE CAMP GATE, THE PLACE IN THE DARK (WORLD), ONE HUD EVERYWHERE (UI), THE DAYS ONCE, THE MAP'S BAR, NO TWO TEXTS, THE CUT,
NOTHING POPS UP, THE FEED IS ALIVE (FEED), and the older phone gates; four told dead (gate_registry_gate.js TOLD_DEAD).

THE BENCH: the fight's page opened on its own (COMBAT's bench, what COMBAT's gates open) is not the game, so the phone is not
built there; it is built the first time the game is on the glass (the map, a town, camp, or a fight in the shell's clouds).
On a computer the fight's bar stays centred clear of the phone on both sides; a tablet, like a phone, gives up only the
phone's side (both sides broke the wide glass's one-row bar).

## WEAK, SAID
- NEXT (rule 238(a)): the fight's commands (END TURN, AUTO, WAIT, RETREAT, STRIKE, RELOAD) onto the phone in the game's fights.
  Rules 257 and 260: the camp's things in the CAMP/HEAL app. The town's sheet buttons (BUY, SELL, TAKE, X) stay on the sheet:
  they act on what he is reading there, not a second copy of a phone press.
- The feed strip clips a long post at two lines; the whole post is one tap away in the catalogue.
- PLAY to the job goes to the job's own block; the way back to the paying town is RUN's [play takes you there].
- The fight's bar is narrowed by the phone's band, not re-laid: on the phone upright the AP line runs under END TURN.
- The phone is taller (276) than the first cut (212) to hold the job column; the cameras are not framing around it yet
  (RUN, RUN TWO, COMBAT rows).

[bb Battle Brothers keeps the contract you hold as a scroll in the world map's corner with an X that asks once, offers only on
the town's notice board, and its map has few buttons: pause, camp (T), the company (C), relations (R); ours is one phone in his
thumb's corner with those same four plus the feed, his held jobs on top with the X and the empty slots ready, and his
abilities on it in a fight.]
[analog horror: the phone is a tin box riveted round cracked glass; its wallpaper is a dead camera's picture of the block he
stands on, and what the valley says crawls across its top on a strip of receipt.]
