# THE AI-SLOP STRAND: THE MACHINE IS SMOOTH AND WRONG, THE WORLD IS ROUGH AND TRUE (DIRECTION 9/30/26, row [ai slop])

Rule 45c, Paolo 9/29: "I'm really falling in love with this AI slop analog horror direction... AI slop,
literally... grab the voice and make it creepy as fuck." Law: analog horror law s10(c). His words:
records/BOHEMIA_PAOLO_TWO_VOICES_THE_AI_SLOP_NARRATOR_AND_THE_SQUIGGLE_9_29_26.md.
A named strand of the bible (records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md, section THE AI-SLOP STRAND
added this commit). A direction, never a reference game.

## THE ONE SENTENCE
**The world was made by hands and is rough; the only thing left talking is a machine nobody switched off,
and it is smooth, polite, sure of itself and a little wrong.** The fear is the gap between the two. The
machine never glitches to scare you. It is calm, and it is wrong about one thing.

## WHAT COUNTS AS "THE MACHINE"
The surfaces the world owns that the machine speaks through, and only these:
- the phone's feed (the valley's own account, the auto posts), the narrator's voice (SOUNDS [read aloud]),
- the institution's text (signs, notices, the loading screen's dead institution), the road events' setup,
- the flip's year card, and the lab's animals where they carry the machine (tags, a glow with a source).
Everything else is THE WORLD: tiles, bodies, faces, the map's ground, the fight board, people's words and
the squiggle voice. The world never gets the machine's finish.

## THE THREE PAIRS (shot from the game's camera: the demo's own phone on the map, the map's own pixels;
## slices/vote/DIRECTION_AI_SLOP_THREE_PAIRS.png, in VOTE)

**1. THE MACHINE TALKS SMOOTH, PEOPLE TALK ROUGH.**
- DO: the valley's account writes whole, capitalised, punctuated sentences, too polite, service language,
  thanks you for your patience, and knows your name ("Good morning, Reyna. Water is available today at 1
  battery per unit. Thank you for your patience."). People write lowercase, Spanglish, typos, cut off.
- DON'T: the machine sounds like a person. THE FEED TODAY does this: @thevalley posts "still no moving the
  Church off their town. everybody knows it." in a person's voice, so there is no machine and no gap.
- MEASURE (for WORDS and the language gate's voice leg): a machine post is sentence case with end
  punctuation and zero Spanglish; a person's post is never both. Same font for both (R5's register): the
  difference is the voice, not a new typeface.

**2. SMOOTH ONLY INSIDE A SCREEN; THE WORLD STAYS ROUGH.**
- DO: smoothness (even gradients, clean anti-aliased type, a perfect glass black) lives only inside a
  machine's frame. A screen is its own light fixture (R4), so the gradient has a source. The world's pixels
  stay baked and rough: the map's own pixels read 0.184 on the floor's fine band.
- DON'T: the world airbrushed. The same map piece softened reads 0.008, the thing the fine band (9/29, floor
  0.020) exists to catch. AND THE DEMO DOES THIS NOW, by accident: the browser stretches a third-size map
  canvas with smoothing, so on the glass the whole valley is the DON'T (0.009 measured 9/29). The fix is
  RUN's canvas at the device ratio ([map pixels]), already routed; this strand is one more reason.
- MEASURE: the floor's 3a and 3b on every world surface (map, fight board); no world surface is exempt
  because it "looks nicer soft".

**3. ONE CALM WRONG THING, NEVER A GLITCH.**
- DO: the machine repeats itself on schedule (R9) and one detail moves: "Scheduled maintenance of the
  Eastside grid is complete. 420 blocks are now powered." then the same post, 421. A person on the same feed
  says the valley is still dark. Nobody on screen points at it (R2). One wrong thing (R1), said calmly (R5).
- DON'T: red text, zalgo letters, a colour split, exclamation marks, "HE IS WATCHING". That is a filter (R8:
  damage lives only inside a screen and only as the screen's own fault, never as a style), and it is many
  wrong things shouting (R1), and it is the one register the bible bans (R5: the horror is the calm).
- MEASURE: a machine line carries zero exclamation marks, zero combining marks, zero colour outside its
  register; its wrongness names in one sentence and traces to a real world-state row (R7).

## WHERE IT BINDS (who reads this card)
- WORDS [narrator lines]: pair 1 and 3 are the register (the lines in the sheet are draft:true attempts,
  WORDS owns and replaces them).
- SOUNDS [read aloud]: the narrator is pair 1 made audible: too even, polite, sure, a little wrong; the room
  and tape are the speaker's own (R8), never a filter on the whole mix.
- UI [the feed]: pair 1's DON'T is the feed as shipped; the valley's own account needs the machine voice.
- RUN [map pixels]: pair 2's DON'T is the demo's map as shipped.
- COOK / every cook tool: pair 2 is why no world pixel is ever smoothed to look finished.
- THE FIGHT VERDICT and EYES E28 read this strand beside R1-R10 from the next round.

## ACT ONE (rule 42c, read in the same round)
Act one feels medieval: no power, no law, men with what they carry. The machine is the one thing still
running and it does not know the world ended; that is why it is polite. In act one it is RARE (a feed, a
notice, a dead screen that still lights), so every appearance lands. It grows with the acts as the valley is
rebuilt (the three eras card): by act three it is everywhere and still a little wrong.

```json
{"card":"AI_SLOP_STRAND","date":"9/30/26","row":"[ai slop]","rule":"45c","law":"analog horror law s10(c)",
 "sentence":"the world is rough and hand-made; the machine is smooth, polite, sure and a little wrong; the gap is the fear",
 "machine_surfaces":["phone feed (the valley's account, auto posts)","narrator voice","institution text, signs, loading screen","road event setup","flip year card","lab animals where they carry the machine"],
 "pairs":[
  {"n":1,"name":"machine smooth, people rough","do":"sentence case, end punctuation, polite service voice, knows your name","dont":"machine in a person's voice (the feed as shipped: @thevalley 'everybody knows it.')","measure":"machine post: sentence case + end punctuation + zero Spanglish; a person's post never both; one font"},
  {"n":2,"name":"smooth only inside a screen","do":"gradients and clean type only in a machine frame (a screen is its own fixture, R4)","dont":"world pixels airbrushed","measure":"map own pixels 0.184 fine band vs airbrushed 0.008; floor 0.020 (9/29); the demo's glass today 0.009"},
  {"n":3,"name":"one calm wrong thing","do":"scheduled repeat with one detail moved (420 -> 421 blocks powered) against a person saying it is dark","dont":"red, zalgo, colour split, !!!","measure":"zero '!' , zero combining marks, wrongness traces to a world-state row (R7)"}],
 "sheet":"slices/vote/DIRECTION_AI_SLOP_THREE_PAIRS.png","tool":"tools/bohemia_direction_ai_slop_pairs.js",
 "routed":["WORDS [narrator lines]","SOUNDS [read aloud]","UI feed","RUN [map pixels]","COOK","FIGHT VERDICT / EYES E28"],
 "act_one":"the machine is rare in act one and grows with the rebuild"}
```
