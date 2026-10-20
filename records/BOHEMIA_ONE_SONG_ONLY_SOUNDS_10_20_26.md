# ONE SONG ONLY, AND THE VOLUME SLIDERS (SOUNDS 10/20/26, row [one song only], rule 122)

## His words (records/BOHEMIA_PAOLO_ONE_SONG_ONLY_AND_THE_VOLUME_SLIDERS_10_20_26.md)
'all the music sucks except for the new one you just made, the overworld night track, so I shouldn't be hearing
anything other than that ever; if I hear any other song ever again I'm shutting this whole shit down' /
'And ALL OF THE OVERWORLD NIGHT TRACKS TOO' / 'It's in the music tab!!!' / 'the background ambience, the radio, has to
go way down; anything volume wise, I should be seeing a slider for it in the settings.'

## What he gets (BUILD 10/20a - ONE SONG ONLY, the demo and the alpha)
- The only music the game can play is the MUSIC tab's OVERWORLD NIGHT category, read while it plays (his saved tags
  first, CAT_DEFAULTS behind them). Nine songs on 10/20: CAMPFIRE CONFESSION, THE VAULT, SLOW BLEED, GHOST IN THE GRID,
  REPO MAN, SATELLITE PRAYER, SLOW CREEP, THE PIT BOSS IS GONE, THE ORGAN IN THE DROWNED CHAPEL. THE CHOIR THAT STAYED
  is not in the category (the coordinator's 10/20 note) and is not played. Tag a song NIGHT in the MUSIC tab and it
  plays; untag it and it stops.
- REPO MAN plays as THE MACHINE PARTY (his YES 10/19 on sounds-repo-man-the-machine-party-10-19; the card's lead, A:
  the concrete hall and the worn tape). Live, not a recording: engine/bohemia_machine_party.js on his own engine, the kit
  from slices/vote/songs/machine_party_kit/, loaded four seconds after the music starts, never before the door. Measured
  live through the music master over 40 s from the top of the song: the machine party -25.66 / -25.96 dB RMS against
  his REPO MAN -25.51 (the recorder's -9.21 dB trim keeps it as loud as his song was, no louder).
- Every other song (the menu's, the day's, dusk and dawn, the factions', the fights', the rooms') is on disk and silent.
- The ambience (the beds, the room's hum, the valley's radio, the map's desert, the title's wind, and the settlement screen's own bed, murmur and far things) goes through one AMBIENCE bus that starts at
  0.4 on the slider: -20 dB under where it was.
- SETTINGS (the gear in the game, SETTINGS on the start screen): MUSIC, AMBIENCE and EFFECTS are sliders now (they were
  five steps for music and effects, nothing for ambience), dragged with a 44-point handle, heard while the finger moves,
  saved in bohemia_mix. ALL and MUTE stay as they were. The settlement screen, which has its own audio and never heard
  the settings at all, now follows AMBIENCE, EFFECTS, ALL and MUTE, at once.

## How (one fence, four doors and a net)
tools/bohemia_sounds_one_song_only_block.js (inlined into the alpha by tools/bohemia_sounds_one_song_only_patch.py,
idempotent; the demo is cut from the alpha):
- THE DOORS: CITYMUS (the street, every time of day), MENUMUS (the opening) and INTERIORMUS (the room) choose only from
  the set; the fight's faction pick goes through SONGFENCE.fight(): a faction song is outside the set, so the fight keeps
  the night song it walked in on. The street taking the music back keeps a night song already playing (no cut sixteen
  seconds after the opening).
- THE NET: MUS.playStep, the one place a note of any song goes into the graph, swaps a song outside the set for one
  inside it. A song he taps in the MUSIC tab that is outside the set stays SILENT rather than turning into another song.
  An offline render (a recorder making VOTE material, rule 122(d)) never reaches a speaker and is not fenced.
- The old fight (the workshop's COMBAT tab; empty in the demo) has its own loop of faction songs: it is told to be
  silent always while the fence stands.
- The mix (bohemia_mix) gains amb (default 0.4) and window.setAmbienceVolume; window.__ambBus() is the ambience bus,
  beside the effects bus into the output, so EFFECTS moves a shot and AMBIENCE moves the bed.

## Measured
- gates/one_song_only_gate.js on the demo 16/0: the set read from the game (nine); twenty seconds of the walk, every half
  second only his songs; every door (night, day, dusk, dawn, the opening, the room, forty draws) from the set; a fight
  begun and all fourteen factions' picks posted: the song stays his; 156 songs stepped through a whole bar each: only his
  nine reach the graph; THE SAME SWEEP UNFENCED HEARS 133 OUTSIDE SONGS (the gate can see a leak); REPO MAN attached to
  the machine and let go on the next song; a fresh phone's AMBIENCE 0.4, the bus at 0.101; the three sliders 44 points
  tall and a tap moves the mix and saves; no page errors.
- What is not fenced, on purpose: the stings (two to four notes over the song when you win, lose, get paid, finish a
  job: effects, not songs) and the VOTE tab's song pages (rule 122(d): a new song is made only to VOTE).

## Gates the change moved
See the handoff block (SOUNDS, 10/20) for the run of the 31 gates that read music, the mix, the settings and the demo,
and which legs were re-aimed at rule 122.
