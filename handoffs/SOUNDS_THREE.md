# SOUNDS THREE -- the handoff block (written only by SOUNDS THREE; chat 08c, opened 11/27 by the coordinator for rule 488, ask row 756)

SOUNDS THREE (sounds-three-01gkdyus): 11/27 LATEST -- BUILD 11/27zr THE DRONE HEARD, BUILT, NOT YET SEEN (rule 490, the routine's
'the next songs and the drone'). The drone whines going up, lands with a blast (the rocket's house too), pops and clatters shot
down, from real recordings (tools/bohemia_bullet_lands.py voices drone_whine, blast, drone_down; the fight names them in its own
sound lines; engine/bohemia_bullet_lands.js plays them, the old power-on and shot until loaded). BULLET LANDS 17/0, THE GUNS GROW UP
23/0. Card sounds3-the-drone-heard-11-27 (TAB: VOTE). The bursts were already real guns, one per round.

ROUND TWO (BUILD 11/27w): BUILD 11/27w EVERY ORIGIN ITS OWN SONG, BUILT, NOT YET SEEN (the routine's
'keep cooking', rule 488(b) on 237(b)). Before it: BUILD 11/27i TWELVE MORE SONGS, EVERY ONE IN TURN (below).

ROUND TWO, WHAT HE HEARS (TAB: VOTE, the card EVERY ORIGIN ITS OWN SONG; and a new game as THE PROMISE KEEPERS or THE HUNTERS):
those two origins no longer borrow another's song: THE PROMISE KEEPERS open on THE ORGAN IN THE DROWNED CHAPEL, THE HUNTERS on
SLOW CREEP, his own songs, from the tape's first beat (his engine plays them at once; the tape ends 3 s before any recording may
load). Fifteen origins, fifteen songs. engine/bohemia_part_of_town.js ORIGIN_SONG 'SONG:<name>'; the part-of-town patch now
replaces the demo's block too; THE MAP PLAYS THE PART OF TOWN 17/0 (every origin its own, no two the same).
THE NEXT BATCH WAITS ON ROOM: the published site is 899 of 900 MB; a song is about 2 MB. The cap and the publish list are PLUMBER
8's (10.1 MB of the songs' A FIGHT previews ship though only cards play them, 13 of those cards already voted). Not squeezed in.

ROUND ONE (BUILD 11/27i):
TWELVE MORE SONGS, EVERY ONE IN TURN, BUILT, NOT YET SEEN
(rule 488, ask row 756). Record: records/BOHEMIA_SOUNDS_THREE_MORE_SONGS_THE_SAME_WAY_11_27_26.md.

WHAT HE HEARS (TAB: VOTE, twelve cards 'A NEW SONG: ...', each plays 1, 2, 3 and A FIGHT; and the DEMO and the alpha on the
map, in every fight and after it): twelve new songs made exactly the way the four of 10/25 were (same tool, same form, same
tape, same three levels, same 120 beat), so the road plays 25 songs instead of 13; and the rotation now plays every song
once before any plays twice, never the same twice in a row, the least played next. An hour never repeats a song.

WHAT WAS WRONG, MEASURED (the alpha's own pickers, 400 simulated hours, a song every 144 s): 13 songs; 11.5 different an hour;
the first repeat a median 12 minutes in; a song back after 4.8 minutes. Nothing missing on rule 237: 13 of 13 factions and
15 of 15 origins have a song; two pairs of origins share one (THE FAITHFUL and THE PROMISE KEEPERS; THE DESERTERS and THE
HUNTERS).

WHAT IS BUILT:
- THE TWELVE: tools/bohemia_sounds_more_songs.js (no render of its own; it records through
  tools/bohemia_sounds_four_new_songs.js, whose render now also takes a five-note scale, a B-section chord line, a measured
  bass and pad balance and a drum cut at its peak; the four render as before). slices/vote/songs/more_songs/<slug>/.
- THE GAME: tools/bohemia_sounds_the_songs_go_in_patch.py reads more_songs too: the book is 25 songs in the alpha and the demo.
- THE ROTATION: engine/bohemia_every_song_in_turn.js, inlined by tools/bohemia_sounds_every_song_in_turn_patch.py (after
  __THE_PART_OF_TOWN__, and one line at the head of CITYMUS.pick and MENUMUS.pick). window.SONGTURN.
- THE CARDS: twelve, registry ids sounds-more-song-<slug>-11-27, pages slices/BOHEMIA_MORE_SONG_<SLUG>_11_27_26.html.
- THE GATES (in the suite): MORE SONGS, THE SAME WAY (gates/more_songs_the_same_way_gate.py); EVERY SONG IN TURN
  (gates/every_song_in_turn_gate.js, with THE PLANT). THE SONGS GO IN re-aimed to the bigger book.

SAID OUT LOUD:
- Nobody's ear is claimed: the songs are chosen and checked by numbers and by the tune's picture. He is the ear, on the cards.
- A new song has no live engine: silent until its recording decodes. The rotation chooses the next song a phrase early and
  THE SONGS GO IN loads it then, so on the road it is in; after a fight the queued song's bytes are held and it decodes on the
  first bar (the phone's time to decode not measured this round).

NEXT (this lane, in order): (1) the next batch (rule 237(e): the thirteen faction songs remade at three levels the same way,
then more road songs) once PLUMBER 8 makes room under the 900 MB cap; (2) re-aim THE SONGS GO IN's 'THE BEAT ON THE GRID'
to read the kit, not a slow lead's swell (it reads the same file 0 ms at 44.1 kHz and 75 ms at 24 kHz); (3) EYES hears the
twelve and the two origins on his phone (179).
PENDING Paolo: nothing.
[bb Battle Brothers ships a dozen or so exploration tracks and cycles them; ours now cycles 25 on the road, every one before a repeat.]
[analog horror: every song goes through the same worn tape; the drums are real recordings of a dead city (a crow on the rail,
a car horn at the drive-in, a cough on the ward, a bottle breaking in the motel lot).]
