# SCHOOL: PLAYABLE IN THE SUN (coordinator 10/4, for rule 73; Paolo: 'if I'm on my phone full brightness and outside, I should still be able to play')

## WHAT IS KNOWN (sources named; (recall) where none is in the repo)
- His phone's glass: an iPhone at full brightness is about 1000 nits typical and up to about 2000 nits outdoors in peak mode (Apple's published specs for the 14 Pro onward; recall). Direct sun on the glass adds reflected light on top of what the screen emits, so the darkest pixels stop being dark: everything below a floor reads as the same grey. The only thing that survives is CONTRAST between neighbours, not absolute darkness.
- The readability standard the whole web uses (WCAG 2.1, w3.org): text needs 4.5 to 1 contrast against its background, large text and graphics 3 to 1. That is indoors. Outdoors the usual practice is to treat 3 to 1 as the floor for anything the player must find (a man against the ground, a lit tile against an unlit one) and 4.5 to 1 for words.
- Console and PC games solve the dark-scene problem with a GAMMA CALIBRATION screen in settings: 'adjust until the left image is barely visible' (every big studio, recall; the pattern dates to the 2000s). The player sets it once per screen and place. A phone cannot read its own ambient light from a web page (the AmbientLightSensor API is behind flags in Chrome and absent in Safari; recall), so the slider is the honest tool.
- Battle Brothers' night (the library, recall; the wiki gives rules not pixels): the scene cools and darkens but stays readable; night is -2 vision and -30% ranged skill and defence as RULES, the picture itself never goes black. Night is a colour there, not a darkness.
- Our own numbers (RUN 10/4, [the valley edge] round two): the old night pass multiplied the land by 0.26 (land 24 vs city 73 at night); that is the kind of pass that dies in sunlight.

## THE FLOOR (coordinator default, rule 73; EYES measures, PLUMBER gates)
1. NIGHT IS A COLOUR, NOT A DARKNESS. The night pass shifts hue (cool) and lowers saturation; it may lower luminance by no more than about half (a multiplier no lower than 0.55 on the ground's luminance), never to 0.26.
2. THE GROUND FLOOR: on a night frame at his phone's profile, the median luminance of the walkable ground is at least 20 percent of white (sRGB about 124 of 255). Below that a sunlit glass shows mud.
3. CONTRAST: a man against the ground he stands on at least 3 to 1; a lit tile against an unlit one at least 3 to 1; every word at least 4.5 to 1.
4. THE SUN TEST: the same frame with a flat 25 percent white added (a crude glare) still passes 2 and 3. That is the machine's stand-in for 'the sun blaring on my phone'.
5. THE SLIDER: SETTINGS (the start screen, rule 66) gets BRIGHTNESS with the calibration picture (a dark figure on a dark ground, 'slide until you can just see him'); it scales the night pass's floor up, never the day down.
6. WHERE THE LIGHTS ARE: lamps and drums light only where the block has power (the map's powered blocks; CLUSTERED POWER); the act decides how much of the town has power (act one the ruin, little; the future better). The fight reads its block's power from the handover.

Nothing here is a reference game he has not named. Battle Brothers is cited for the campaign and its fight's flavour only.

## 10/4 LATER: SOURCED AND CORRECTED
- EYES (57a03621) sourced the (recall) lines: WCAG 2.1 success criteria 1.4.3 (4.5 to 1 text) and 1.4.11 (3 to 1 non-text) are exactly the bars above; DisplayMate's sunlight-readability lab ramps ambient to 100,000 lux and scores contrast under it, the shape of the sun test; veiling-glare physics is why a flat white overlay is a fair software proxy; iOS Safari has never shipped the Ambient Light Sensor API, so the slider is the right tool.
- RULE 73a (the maths of the glare test): adding 25 percent white to both sides of a 3 to 1 pair lands near 2 to 1 every time, so under the glare the floor is 2 to 1 (lit against unlit; a man against his ground, counted WITH his one-pixel rim); at rest 3 to 1 and 4.5 to 1 stand. COMBAT measured 64 percent of the day's light, 3.13 to 1 lit against unlit, 1.83 to 1 men with the cold rim (2e62bd5); COMBAT TWO's settlement nights pass the plain floor and read 2.2 to 2.4 under glare (0126ef29). Both pass 73a.
