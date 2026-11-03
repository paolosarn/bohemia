# UI 7: THE TOP IS ONLY RESOURCES (rule 368, Paolo 11/3; ask line 392)

## HIS WORDS
"The sun in the top left corner. I hate the time... and then your location settlement for example and the button at the top of the
screen, I don't like that we have two crew visuals... The only thing that really should be at the top of the screen, UI wise, is the
resources to be honest. Do you wanna look at the time? Look at your phone. If you wanna look at the crew, look at your phone."
(records/BOHEMIA_PAOLO_THE_TOP_IS_ONLY_RESOURCES_AND_THE_CREW_SEES_THE_CAMP_11_3_26.md)

## MEASURED BEFORE (the demo at a5e7eaa6, 390 x 844, his phone upright)
- The top band was 108 points tall and carried four things: the DAY plate with the sun's arc, the crew plate (his face, 3/20, three
  blood ticks), the place's name, and the resources' pane (batteries 290, food 21, tape 40, meds 30, rounds 80).
- The phone already said the place on its first line and had its own CREW: two crew buttons on one glass.
- The phone's band under PLAY said the hour a second way (the big 06:00), so the hour lived in two places too.

## WHAT CHANGED
- THE BAND (slices/bohemia_ui_materials.js, __THE_TOP_IS_ONLY_RESOURCES__): one bar is built by one function for the map, the town, the
  camp and the fight's screens after it (hudBuild), so one rule takes the DAY plate, the crew plate and the place off its glass on all
  of them. They stay in the page, unseen: the phone's CREW presses that very crew tag (one handler, rule 286(b)) and the phone reads
  the place from it. The presses' row is gone for good: the gear (the one press left, shown only while no phone is up to carry SETTINGS)
  stands at the end of the resources' row, and the pane is 44 points tall like the gear, so the band is ONE height from its first frame.
  108 points -> 63 upright; one row on its side, as before, minus the day, the crew and the place.
- THE MAP UNDER IT, MEASURED TWICE: the map sizes its glass on 'resize' only. A band that shrank when the phone came up left a 49-point
  strip at the foot; telling the map to re-fit on every change of the band fixed that but threw a page error on the computer walk (THE
  PHONE gate, measured against clean main: 91/0 there, a drawImage error and a stalled PLAY on mine), so it was taken out and the band
  was made one height instead (a 4-point strip from the gear's 44 points measured and closed the same way). The map's picture ends at
  844 of 844.
- THE PHONE (slices/bohemia_phone.js, __THE_DAY_ON_THE_PHONE__): its first line is the place on the left and DAY n  hh:mm on the right,
  the way a phone's own status bar carries its clock, on the map, in a town and at camp (never in the fight: the round and the beat's
  trace are its line there and the fight's clock does not run). A long town name steps down half a point at a time before a letter is
  cut ('ANARCHISTS' read 'ANARCHIST' on its side, measured; whole now). The band under PLAY no longer repeats the hour: it says what
  the clock is doing (STOPPED, GOING, RESTING, IN TOWN).
- ONE CREW BUTTON: CREW can no longer be hidden from the phone's settings (it says ALWAYS, like SETTINGS): with the bar's crew plate
  gone, the phone's CREW is the one door.
- THE FIGHT: unchanged during it (rule 280: nothing across the top); the end screen's band is the resources only, the same rule.

## GATE
gates/the_top_is_only_resources_gate.js (new): on the demo, upright and on its side, with a finger: B1-B4 (only resource counts in the
band, no day, hour, sun, crew, head count or place, under 72 points, nothing over it) in a TOWN, on the MAP, at CAMP and AFTER THE FIGHT,
nothing across the top IN THE FIGHT; P1-P3 (the phone's first line says the game's day and hour, the place whole, each once); C1-C3 (one
press opens the company, the phone's; a finger on it opens the screen; CREW never hidden); the map fills the glass. PLANTED: the day plate
back, the bar's crew plate back (two crew buttons), a second clock on the phone.
Re-aimed to the ruling: gates/the_days_once_gate.js (DAY is drawn once, on the phone; the bar draws no DAY; the hour planted on the drawn
pane) and gates/one_hud_everywhere_gate.js (with the phone up the bar's pieces are the band and the pane; the day plate, crew plate and
place off the glass; the town's name is the phone's first line).

## THE SCHOOL LINE
[bb Battle Brothers' world map keeps the day and the hour on one small dial at the top and the company's money and food beside it; our
top keeps only what you carry, and the dial moved to the phone in your hand, the way a real person checks the time.]
[analog horror: the top of the glass is a tray of what you have left and nothing else: the time is only on the cracked phone, read the
way you read a dying phone's clock.]
