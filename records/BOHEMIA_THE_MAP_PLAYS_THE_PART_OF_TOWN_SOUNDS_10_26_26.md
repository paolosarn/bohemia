# THE MAP PLAYS THE PART OF TOWN YOU ARE IN (SOUNDS, 10/26/26, row [the map plays the part of town you are in], rule 237)

## HIS WORDS (records/BOHEMIA_PAOLO_EVERY_ORIGIN_ITS_SONG_AND_THE_MAP_PLAYS_THE_PART_OF_TOWN_YOU_ARE_IN_10_26_26.md)
"each one's gonna get its own song ... I already have faction music ... so just put those in for now ... they can be the placeholder
as they are right now ... maybe the music should change depending on what part of town you're closest to as you're in the overworld
map, that's the whole point of this kind of vibe ... depending on the tiles you're walking on the sound changes, super important to me"

## WHAT HE HEARS NOW
On the map the music follows the ground under his party. Inside a faction's part of the city (or within two cells of its edge) that
faction's own song plays: the Mob's The Boss Takes His Cut, the Church's Fluorescent Dawn, the Cartel's The Counting Room, and so
on for all thirteen. On the open land between, one of his thirteen overworld songs. The change waits for the song's next phrase line
(eight bars) and the new song comes in on the beat. A new game's opening tape plays his crew's own song (THE FAITHFUL the Church's,
THE WATER TRUCK the Caravans', the rest below); his own company's ground and his camp play it again. A raiding crew closing on him
lifts the map's music one level until it is gone. A fight still plays his overworld songs at their three recorded levels.

## HOW BATTLE BROTHERS DOES IT (rule 33; recall, marked)
The world map's music changes with where you are and what is happening (the region, towns, the late-game crises) and the fight's
music follows who you fight: the place sets the sound. TAKEN: the place sets the sound, cell by cell, from the map's own owner of the
ground; the change is musical (a phrase line), never a jump-cut.

## ONE FINDING THAT PROVED US WRONG (measured)
The coordinator's NOTE asked WORLD for "which faction is home where", and the map's own road fight already calls
cityFactionHere() for it: THAT FUNCTION WAS NEVER DEFINED (every call returned null). The answer was there all along under another
name: turfAt(x, y), the map's owner of every cell (a block at a time, the borders on roads and washes), which the territory, the
mines and the parties already read. No new map code was needed (rule 12: the named dependency was a premise, not a gate): the shell
asks the map, same origin, on the report the map already sends every four seconds (BOHEMIA_WHERE).
Second: the music engine's own objects (MUS, MLOOPS, MFACTIONS, CAT_DEFAULTS) are top-level consts, not window's properties, so the
first build read them as undefined and armed turns it could never play; the engine now reads the page's globals by name.

Third, the hand-off to a fight (measured by THE MUSIC IN THE FIGHT NOW before this was right): a fight that came up while a faction
song played swapped to whatever overworld song the pick gave; one of the four new songs has no notes but its recording, so the
fight's first frame was silent for 0.6 s while it decoded. And the street's own song turn and this module's phrase turn both run
under the rebuilt fight (it never turns FIGHTMUS on), so a phrase line could have pulled a faction song into a fight. Fixed: while
a faction song plays on the map, the song a fight will take is chosen ahead and held warm by THE SONGS GO IN (SONGBOOK.warm: its
level 1 decoded, its fight levels as bytes), and the swap happens the moment the fight's frame is in the page, onto the recording;
nothing of the part of town turns while a fight's frame is up. What is left in that first second is the faction song's own rests
(the Mob's song is stabs and silences: half its 100 ms slices are rests, measured), which is the song as he made it.

## THE TABLE: EVERY ORIGIN ITS SONG (237(b); two are his, the rest SOUNDS' reading of each origin's own line, his to change)
| origin | its line | its song |
|---|---|---|
| THE CREW THAT IS LEFT (rebuild) | a debt paid off, and a name to fix | REDS: The Foreclosure Notice |
| A NEW CREW (newcrew) | start clean | TRADES: What the Apprentice Builds |
| UP FROM HENDERSON (south) | north on the 95 with three guns | CARTEL: The Counting Room |
| THE WATER TRUCK (truck) | HIS WORD | CARAVANS: Highway 15 South |
| THE BLOCK WATCH (watch) | twelve neighbours with pipes | VOLUNTEERS: Hands That Still Build |
| THE SCAVENGERS (scav) | every gutted store to the dam | HOMELESS: Dead Man's Slide |
| THE PROMISE KEEPERS (promise) | a promise made at a grave | CHURCH: Fluorescent Dawn |
| THE DESERTERS (desert) | walked off a faction's line | REMNANTS: Throne of Static |
| THE RAIDERS (raid) | you take | ANARCHISTS: Broken Window Anthem |
| THE LAB RATS (lab) | the lab the animals broke out of | NETWORK: Delta Blues, Server Farm |
| THE FAITHFUL (faith) | HIS WORD | CHURCH: Fluorescent Dawn |
| THE DEBT COLLECTORS (debt) | the two collect | MOB: The Boss Takes His Cut |
| THE HUNTERS (hunt) | out where the static is | REMNANTS: Throne of Static |
| THE FIGHT PIT (pit) | a casino floor that charged to watch | COLORFUL: Parade of Lost Balloons |
| THE LONE WOLF (wolf) | just you | BLUES: The Last Good Check |
All thirteen faction songs are some origin's.

## HOW IT WORKS (engine/bohemia_part_of_town.js, in the alpha and the demo as __THE_PART_OF_TOWN__, tools/bohemia_part_of_town_patch.py)
- (a) THE FENCE (rule 122's SONGFENCE) now lets a song through when his MUSIC tab files it under one of the thirteen faction categories
  (CAT_DEFAULTS, his 7/19 rulings; fourteen songs, NETWORK has two). The overworld pool, the opening, the room, a fight and the song
  after a battle still draw only his overworld set. The menu, day, dusk and dawn and room songs and the old faction themes stay refused.
- (c) Every four seconds the map reports where the party is; the shell asks the map's turfAt for that cell and, if it is nobody's, the
  nearest owned cells within two (the edge of a district is that district); the street's pick (CITYMUS.candidates) plays that
  faction's song, the open land his overworld set. A change arms a turn for the next phrase line (every 128 steps); in the last beat
  before the line the street's own play() books the new song's first step on the next beat of the one clock: the line itself.
- (b) window.__originSong(origin, 'intro' | 'done'), the call RUN THREE's squad up close makes: the origin's song at once, on the beat;
  done hands the music back to the map at the next phrase line. His own company's ground (CUSTOM) and his camp play the origin's song.
- (d) The map plays level 1 (rule 207); a crew out to take something within three cells (the map's partiesNear) lifts it to level 2
  at the top of a bar; gone, back to 1. A fight that comes up while a faction song plays gets one of his overworld songs (the
  recorded three levels, 207).

## THE GATES
- THE MAP PLAYS THE PART OF TOWN (gates/the_map_plays_the_part_of_town_gate.js): phone 4x and computer, 17/0 at registration:
  three origins through the tape's call, each its song, handed back; three districts (Church, Cartel, Reds): each its song in 12.9 to
  14.7 s of the report, the old song at step 125 or 126 of its phrase, the new song 0.0 ms off the beat, heard; the open road an
  overworld song; the threat 2 and back to 1; a fight gives the Mob's song back for one of his; every song heard his or a faction's;
  the fence refuses the 27 menu, day, dusk, room songs and old themes.
- ONE SONG ONLY (gates/one_song_only_gate.js) taught rule 237 (newest date wins): the faction songs are in (O2b), the street may play
  them, the opening, the room and a fight may not; 17/0.
- THE MUSIC IN THE FIGHT NOW (gates/the_songs_go_in_gate.js) taught rule 237: its map legs read the thirteen's recordings, which now
  play on the open road, so it sets the party down on the open road first (the map's own owner of every cell), then reads them as
  it always did.

## NOT DONE, SAID PLAINLY
- ON THE JOURNAL (237(e)): the faction songs are placeholders as they are; each is remade later the way the thirteen were (the
  Crashbox analog horror machine-party, rule 119), three levels each: SOUNDS [remake the faction songs], the next row.
- Until then the faction songs play from his engine live, at its own arrangement tiers (level 1 on the map, 2 under a threat); they
  have no recorded levels yet, which is why a fight gives them back for his overworld songs.
- The gate's boots did not play the opening tape (two of two of this lane's probe boots did, and the tape's call played the origin's
  song there); the gate proves the call for three origins directly.
- NOTE for WORLD: cityFactionHere() is called by the map's road fight and is never defined; turfAt(roadWhere()) is the answer.
- [analog horror: each part of town has its own broadcast; crossing a border the station changes at the line, not in the middle of a
  word.] [bb: the place sets the sound.]
