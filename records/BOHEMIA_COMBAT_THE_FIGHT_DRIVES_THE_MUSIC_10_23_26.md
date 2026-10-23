# COMBAT 10/23: THE FIGHT DRIVES THE MUSIC (row [the fight drives the music], rule 126)

## HIS WORDS
- "Bro i almost played a first day bro the combat should feel alot better we have music that we have a whole intensity system with the music wtf bro"
- The same hour, 126(e): "Yeah and when its the enemies turn have it at the low intensity i want to hear its my turn time shit"

## MEASURED FIRST
- The shell's ladder (KILLMUS, `window.INTENSITY`, slices/BOHEMIA_ALPHA_0_9.html and the demo cut from it) listens for BOHEMIA_COMBAT_STARTED and BOHEMIA_PLAYER_HIT (threat: level 2), BOHEMIA_SHOT_RESULT 'killshot' (two kills: level 3) and BOHEMIA_COMBAT_END (reset). The levels are his song's own arrangements, MUS.layers 0 / 2 / 4. The rebuilt fight (slices/BOHEMIA_FIGHT.html) posted none of them. Every fight since 10/2 played flat.
- All nine songs he allows (rule 122, the OVERWORLD NIGHT set, REPO MAN among them) carry a kill-layer style (seven `melody`, one `drums`, one `stabs`) and none is a menu song, so the ladder reaches every one of them. No change to the music engine was needed.
- BOHEMIA_COMBAT_END cannot be sent by the rebuilt fight: its handler in the shell is the frozen fight's settle and calls cityFightHome at once, which would pull him off the recap before its four beats. The rebuilt fight already sends BOHEMIA_FIGHT_OVER; the end settles from that.
- The ladder's old applier looked at MUS.step every 60 ms for a bar's first step (a step is 125 ms). While the fight builds, the thread is busy and it stepped past the bar: the first lift came 2.2 s after the board (more than a bar). On a phone it would miss more.
- One act of theirs is one to three beats; a bar is four. A drop held for the bar line would mostly never land, and he would never hear "my turn". So the turn moves on the BEAT (126(e) says "on the beat"); kills, the threat and the end keep the bar (126(b)).

## WHAT SHIPPED
1. THE FIGHT TELLS THE MUSIC (slices/BOHEMIA_FIGHT.html, one block beside the sounds, `MUSIC`): at the moment he SEES each thing, not when the rules decide it:
   - BOHEMIA_COMBAT_STARTED when the board comes up;
   - BOHEMIA_PLAYER_HIT when a blow lands on one of his (with the blow's own sound);
   - BOHEMIA_SHOT_RESULT 'killshot' when a man of theirs falls (no zone, no patMeta: the shell's two old shot bridges log it and arm nothing);
   - BOHEMIA_FIGHT_TURN {side: 'you' | 'them'} as the turn passes, once the last act's motion is done;
   - a skipped turn (his tap on their move) is still heard: the ladder gets every hit and kill it held, the ear one of each sound a quarter beat apart.
2. THE TURN IS HEARD (a marked block beside KILLMUS in the alpha, put there by tools/bohemia_combat_the_fight_drives_the_music_patch.py; the demo re-cut): their turn is the bottom of the ladder (the calm arrangement) whatever the kills say; his turn is the fight's level again. A fresh fight counts its own kills; the end settles to the bottom at the top of a bar; a fight frame that goes without an end settles too.
3. THE CHANGE IS NEVER MISSED: the scheduler reads MUS.layers once for every step it books, so the ladder's pending change is committed AT THAT READ on the first step that is a boundary (a beat for a turn, a bar for the rest). Exact on a stalled phone, no polling; MUS.playStep and the engine are untouched; a plain write (the MUSIC tab's KILL LAYERS, a reset) is a write as before.
4. Stamp: BUILD 10/23a - THE FIGHT DRIVES THE MUSIC.

## THE NUMBERS (gate THE FIGHT DRIVES THE MUSIC, 10/0; the demo, his music on, a road fight through the map's door, AUTO, seeded)
- The song lifts 1.5 s after the board, on a bar's first step (it was never).
- 9 of 9 turns moved the arrangement at the next beat, 0 changes between two beats.
- After the second kill, his next turn plays the top (4).
- The end: down to the bottom at the top of a bar, kills and threat cleared, still on the recap a second later.
- His songs only: every bar of every fight in his set, the music never stopped.
- What you hear: notes a bar, live, at the bottom / the fight's level / the top: 16.8 / 22.9 / 31.2 (SLOW CREEP, +36% / +86%); other runs 32.5 / 38.9 / 47.2 (GHOST IN THE GRID), 37.8 / 46.0 / 58.5 (REPO MAN). The master's loudness stays within about a decibel: the levels add PARTS (a lead line, taiko, stabs, a second octave), not volume.
- On the fight's own page: a killshot for every man of theirs down (4 of 4), a PLAYER_HIT for every blow on his (3 of 3), 16 turns told and never the same side twice; 21 of 21 hits, 15 of 15 misses and 5 of 5 falls heard.

## [bb the turn]
Battle Brothers tells you whose turn it is by sight: the turn-order strip along the top and the ring on the man who acts. As far as our library carries it, its battle track does not move with the turn. Ours does: their turn sinks the song to its calm arrangement and his brings the fight back in, on the beat, so the turn is heard without looking.

## THE ANALOG HORROR LINE
The fight's parts drop out when they move, like a tape losing its upper tracks while something walks toward you, and come back in when it is yours to act. The silence between is the threat.

## ROUTED
- SOUNDS: the lift is parts, not volume (+20 to +40% notes a bar at the fight's level, +50 to +90% at the top, within a decibel of loudness). If he wants the fight's level to hit harder, the kill layers' voices and gains in MUS.playStep are your lever; nothing in COMBAT's block needs to change for it.
- RUN: the block beside KILLMUS is COMBAT's (rule 126(e)); a re-patch is `python3 tools/bohemia_combat_the_fight_drives_the_music_patch.py` (idempotent), then the cut.
- PLUMBER: KILLMUS.exact is true when the commit-on-read holds MUS.layers; a probe that redefines MUS.layers should wrap the existing accessor (the gate shows how).
