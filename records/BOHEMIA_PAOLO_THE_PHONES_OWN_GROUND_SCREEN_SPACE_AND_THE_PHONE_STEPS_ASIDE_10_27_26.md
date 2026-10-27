# PAOLO 10/27: THE PHONE'S OWN GROUND IN EVERY TOWN, SCREEN SPACE EVERYWHERE, AND THE PHONE STEPS ASIDE FOR A SHOP (LOCKED, rules 292, 293, 294)

## HIS WORDS (verbatim, voice to text, one stream after BUILD 10/27a)
"And it was display full screen the proper way, not the tiny fucked up what you have right now"
"OK, I need you to understand what I'm about to say is an example and I want you to fix this like 20 more times with the UI, but for
example in the combat screen, you're taking up extra room on the fucking screen bro, the loot all in the camp button, bro they should
all be next to each other and shit like at the end of combat shit bro like like screen space is so important and we can't be
bullshitting this but so anyway, yeah, I need that too, bro the UI we need that improved and again with the Animation translations of
like things going on you know if you're the shop the shop the phone animated to the shop you know just so it's not there anymore type
shit like Yeah"
"And im ready to go for what i exclusively just told you"
"And that shit is gonna be like inside of the city it's gonna look like that not on any outskirts bro right next to the fucking
building buildings bro. The phone will be inside of the city right next to the building. That's how you are gonna make this. And it
will be full screen with no outskirt bullshit. Perfect but without a single fucking building behind it and it's overlay on top, can
you imagine that like it's just gonna be plain ground and that's gonna be OK? And there will be a little padding around it so when
the phone's in there, it's not like almost right on top of any buildings or anything that I need to click cannot be behind the phone
and not even I don't even wanna see buildings. I wanna look I wanted to make it look like it's dedicated. And it will look OK if all
four of the versions that you make are just slightly different to fit what it needs to do and then as you flipped through the camera
or the you flipped through the horizontal the portrait like it's just smart bro because you have four versions. Bro, I don't want a
single item behind when when you make it full screen without showing any fucking mirror extension bullshit that you've been doing so
full screen and then just a section where the phone will fit and only the ground tile with with no equipment no building no people
nothing behind it and there's some padding around the edges of that as well"

## RULE 292: THE PHONE'S OWN GROUND, FOUR VERSIONS, FULL SCREEN, NO MIRROR
(a) Every town and the camp fill the whole glass, inside the city, never a box, never the sunk mirrored copy round it.
(b) Where the phone stands, plus padding, the town shows only its own plain ground: no building, no thing, no person; nothing there
    answers a tap. Upright it is the phone's corner; on its side (the phone taller than half the glass) the phone's whole side, a strip
    of the town's own ground, the town filling the rest.
(c) Four versions, slightly different: upright phone-left and phone-right are two DRAWINGS (COOK's scene re-drawn 260 px taller at
    the bottom, the top anchored so every tap stays, the corner on the phone's side cleared of every thing; the other corner keeps its
    things; tools/bohemia_four_layouts_tall_render_10_27_26.py, Blender, 16 samples, denoised); on its side the town's one wide
    drawing is framed beside the phone's strip. The upright night is COOK's own night with the cleared corner and the new ground sunk
    to that night's measured ground (a re-render of the nights is owed to COOK at the next go).
(d) A turn or a flip of the phone's side re-frames at once; side to side upright glides between the two drawings.
(e) The gate: THE TOWN FITS THE SCREEN T1 (the glass covered, nobody tappable under the phone), the sixty pictures.

## RULE 293: SCREEN SPACE IS SO IMPORTANT (his 'fix this like twenty more times with the UI')
(a) His example, done: at the end of a fight LOOT ALL, OPTIMIZE LOOT, MAKE CAMP and LEAVE stand side by side in ONE row, upright and
    on its side (was LOOT ALL a full row over the other two, and missing from the wide row); the window over the crew 20vh (was 30).
(b) An open shop or building takes the whole glass while the phone is away (was the top half, the phone's band kept empty).
(c) Next, in order: the town and map top bar to one row upright (two rows, 110 px, today); the fight's screen; the crew screen; the
    camp's buttons; every screen measured for empty space at phone size, each a row on the owner's board at the next go.

## RULE 294: THE PHONE STEPS ASIDE FOR A SHOP (his 'the phone animated to the shop, so it's not there anymore')
(a) While a building's sheet is open in a town or the camp the phone slides down out of its corner in one beat (0.5 s, Material's
    standard curve) and comes back the beat the sheet closes (slices/bohemia_phone.js 'away'); nothing of it presses while away.
(b) More morphs (MOTION's 229) at the next go.
