# THE SETTLEMENT HEARD, LIVE IN THE GAME, AND FOUR POST-MORTEMS (SOUNDS, 10/18/26)

Row: [the settlement's sounds] round four (VAMILY, SOUNDS). Opened by the coordinator under rule 112, run on
Opus under rule 116 after the chat before stopped at 7e9e31b (it shipped [a desert, not a rainforest] and
left no handoff block; this round writes it).

## THE RULING THIS ROUND ACTS ON

Paolo 10/17, the thirteenth votes (records/BOHEMIA_THE_THIRTEENTH_VOTES_10_17_26.txt), UP on
`sounds-the-settlement-heard-whole-10-17`: "Nice yeah I think personally, I just heard too many bird noises
and insect noises like you know in a economic apocalypse Las Vegas that probably doesn't sound like
rainforest too many birds going on, but yeah, I like it". The note was answered by 7e9e31b (the bed
thinned, 418.5 to 7.5 animal calls a minute, the crickets 6.9 dB down). NOTES ARE RULINGS (7/19): an UP with
a note that has been answered is the go to put the thing in the game. Unjudged-is-silent no longer holds the
recordings back.

## WHAT SHIPPED

- `engine/bohemia_settlement_heard.js`, a module the real settlement screen loads (one script tag):
  - every building's tap plays its recording (the judge page's map, unchanged: the hall, the board, the
    stall, the barber, the yard, the guns, the smith, the armourer, the lot, the build lot);
  - the clinic's door, a buy (stall or guns) and the bar's round play the recording INSTEAD of the bank
    sound: `sfx()` asks `BohemiaHeard.handles(ev)` first and does not post to the parent, so it is never
    both (the screen's own `__settleLog` still records the event, so the settlement gate's claims stand);
  - the bar's murmur under the bar's open sheet, gone when it shuts;
  - the thinned desert bed (`bed_day` / `bed_night`, the 10/18 files) under the whole screen at 0.7
    (-3 dB under the judge page: the song plays over it in the game), a far thing every 20 to 50 s;
  - night: the screen's `NIGHT_TRIM` (0.5) on every building, the night bed;
  - the bed waits for the first tap (a phone plays nothing before one);
  - HIDDEN IS SILENT: the map hides the screen's frame on LEAVE (`loopClose`, display:none) and never
    unloads it, so the module reads the frame's display once a second and fades the bed out; LEAVE itself
    silences at once; the map's next OPEN with a place brings it back;
  - the player's SETTINGS sound volume (`bohemia_sfxvol`, the alpha's one knob) scales it all.
- Six one-line hooks in `slices/BOHEMIA_SETTLEMENT_SCREEN.html` (RUN TWO's file; the sound lines only:
  the script tag, `sfx()`, `openB()`, `hide()`, `open()`'s end, LEAVE). No layout, art or flow touched.
- The recordings are referenced where they sit (`slices/vote/settlement_heard/`), never copied: the pages
  size is already red and a copy would be 3.8 MB for nothing.
- `gates/settlement_heard_gate.js`, 21/0: drives the real screen in a host frame (the way the map holds
  it) on the phone profile; every building's tap names its recording (8 of 8 on the plain town), every file
  decodes, the clinic's door is the recording and nothing is posted to the parent, the bar's murmur lives
  and dies with its sheet, the night bed and the 0.5 trim, hidden is silent and the next visit restores
  it, LEAVE silences, the live bed is not the rainforest copy (md5), every source CC0, zero errors.
- VOTE: `sounds-the-settlement-sounds-real-in-the-game-10-18`, the real screen as the page.

## FOUR POST-MORTEMS (his wordless 10/17 NOs)

All four were ENGINE-BUILT sounds from 10/5 and 10/9, made from oscillators and click trains because this
lane could not reach a recording then. All four lost to the recordings he heard in the same export.

1. `sounds-the-armourers-rivets-10-9` (armourerRivets): a pipe mode struck four times at a riveter's
   cadence. Right cadence, wrong body: a struck pipe has no air hammer, no shop. Answered by the recording
   `armourer_rivets`.
2. `sounds-the-smiths-hammer-10-9` (smithHammer): struckMetal's bar series lowered for an anvil. An ideal
   bar rings clean; a real anvil thuds, buzzes and carries the room. Answered by `smith_saw`.
3. `sounds-paper-against-the-post-10-5` (paperRustle): a dense click train, 1.2 to 8 kHz. That is sand by
   another name (the 9/23 lesson). The board answers with `board_nail`; paper waits on a real recording.
4. `sounds-a-can-on-the-counter-10-5` (canOnWood): two synthetic contacts summed. Answered by `stall_can`.

THE LESSON: every one of the four was the right idea with a made-up body. A recording supplies the body.
The engine functions stay in the file (the cooked sounds gate's claims read them); the ids are graveyarded.

## GATES

settlement heard 21/0 (new), settlement screen 65/0, cooked sounds 240/0.

## NOT DONE, SAID PLAINLY

- The title: the two desert candidates (`sounds-the-title-is-the-desert-10-18`) wait on his vote; nothing
  plays on the title until then.
- No voice anywhere: the recap voice is dead (his NO), and a recorded voice needs a host this box cannot
  reach (PLUMBER [the toolchain]).
- The map's own travel bed still plays the old ambience; the next round can put the desert bed under
  travel once this one has been heard in the game.
