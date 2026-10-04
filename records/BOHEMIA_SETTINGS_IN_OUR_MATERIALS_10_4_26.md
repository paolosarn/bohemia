# UI [settings and the slider]: SETTINGS IN OUR MATERIALS, WITH BRIGHTNESS (10/4/26, ui-kmqmrf)

Rule 73 (Paolo 10/4: 'full brightness and outside, I should still be able to play'): BRIGHTNESS with the
calibration picture, raising the night floor, never lowering the day. Rule 66: SETTINGS is a start-screen door
(RUN builds the screen, claimed e31bb315, and wires its button to BohemiaSettings.open()). Rule 67/71: the card
was a flat dark rounded box with centred words.

BUILT on the alpha (slices/bohemia_settings.js, included first in <head> with the materials generators): the game's
ONE settings card (behind the gear; the shell's module still owns sound, mute, text, motion, events, vote, save,
quit) dressed and extended, not a second card:
- cardboard (darkened a third under the words), two strips of tape, the title on a receipt strip, labels stamped
  in CASING from the left, steps as cracked glass lit amber, buttons as receipt tags read from the left with a hard
  one-pixel edge, every control 44 points (30 controls measured)
- MUSIC and SOUNDS: five steps each on the mix's own hooks (setMusicVolume, setEffectsVolume, getMix, bohemia_mix),
  the old SOUND row is now labelled ALL (it is the master)
- BRIGHT: five steps kept in boh.brightness, step 0 = as drawn; published as BOH_BRIGHTNESS {step, lift} and posted
  to every frame ({type:'BOHEMIA_BRIGHTNESS'}), again whenever a frame loads; a 96x48 calibration picture (a dark
  man on a dark street, drawn with the lift, floor rising under the darkest values only)
- BohemiaSettings.open({atStart:true}): the card over the front door before BEGIN, SAVE/QUIT hidden, 'BACK'

MEASURED: gates/settings_in_our_materials_gate.js 15/0 on the alpha at 390x844 3x. A REAL FINDING ON THE WAY: on the
bare cardboard a label read 8.8:1 indoors and 4.4:1 in the sun test; darkened, 11.3 and 5.3. The city frame is
measured receiving {step 3, lift 0.18}. Four mutations (the commit lists them).

NOT DONE: the night passes READING the lift (COMBAT [night you can read], RUN's map night pass); a narrator switch
(no narrator exists; SOUNDS builds it). WITHDRAWN THIS ROUND: a whole start screen I built before RUN's claim on its
logic landed (e31bb315); ONE SYSTEM ONE SESSION, so it did not ship. Its look (the night valley under the dead grid,
glass plates with printed marks) is what [the start screen's look] dresses RUN's screen with, next.
