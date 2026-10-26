# DEATH SOUNDS THAT TERRIFY (SOUNDS, 10/26/26, row [death sounds that terrify], rule 235)

## HIS WORDS (verbatim, records/BOHEMIA_PAOLO_DEATH_SOUNDS_THAT_TERRIFY_10_26_26.md)
"during combat when people die, I wanna hear terrible, terrible noises that are scary like people are like literally dying ...
something that fits the theme of all the noises we got going, but it's like a terrifying noises ... get creative. There could be
many types like broken bones or whatever like the whole enchiladas so keep that in mind."

## WHAT HE HEARS NOW
Every death in a fight plays a death of its own kind, picked by the blow that killed: a bone that snaps and crushes, a blade's wet
cut and the blood that runs, a man shot down choking, a beast's bite and the drag over gravel, the slow one (gasps, choke, rattle,
last breath), and the plate that gives before the man under it. One of HIS men dying is the worst sound in the game: close, six
beats, a scream that is cut off into a choke, the rattle, the last breath out. An enemy's is still horrible, down the street,
four beats. A wolf dies like a dog, a big beast bellows, a big cat yowls. A blow that takes the head adds the skull's crunch.
Never the same take twice in a row. Every one starts on the song's next 16th; the tail rings past.

## RESEARCH (rule 33: how Battle Brothers did it, then how the best horror does it; both from recall, marked)
- BATTLE BROTHERS (recall): every actor type has its own list of death and hurt sounds, several each, one drawn at random so the same
  cry does not come twice running; every actor gets its own pitch at birth (a few percent), so two brigands do not share a throat;
  the killing blow plays the weapon's flesh sound under the cry; a fatality (decapitated, smashed, disembowelled) adds its own wet
  crunch; a beast dies with the animal's own voice. You know who died before you look. TAKEN: kinds by the killing blow, several
  takes, never twice running, a per-take pitch (jitter 0.94 to 1.04), the skull's crunch on a head kill, the animal's own death.
- HORROR (recall): the cry that is cut off is worse than the cry that ends; the body keeps making sounds after the voice has gone
  (the choke, the rattle, the last breath out); the microphone is too close and does not look away. Found footage adds the machine
  that heard it: the camcorder's automatic gain slams down on the scream and drags the room back up (our analog horror bible, the
  sound rules). TAKEN: every scream is cut (28 ms to -24 dB) into a choke a 16th later; after it the gurgle, the wet cough, the
  rattle (a man's snore, slowed), the last breath; the camcorder stage, gentler than the bullets' (below).
- THE FOLEY TRADITION (recall): film death foley is built from things that are not people dying: a pig's scream lowered for a man's
  (the pig's is the closest real scream to ours), celery and wet towels for bone and meat, gravel for a drag. Every layer here is that
  kind of thing: a real recording of a real thing, never a generator, never the noise recipe (the second votes: no sand).

## ONE FINDING THAT PROVED US WRONG (measured, not assumed)
The bullets' chain (tools/bohemia_bullet_lands.py chain(): the camcorder at target -12 dB lifting up to +12 to +14) made every death
ONE FLAT WASH: profiled in 16ths, the scream came down 10 dB and the rattle came up 6, so the whole take sat within 3 dB of itself
for three seconds and the scream did not stand out of its own death. And twelve real layers summed to +9 dBFS went into the tape's
saturation, which flattened it again. Fixed at the source: each layer through a 1:3 expander 24 dB under its peak (the breath's
room tone is not summed twelve times), the mix into the machine at -6 dBFS, the camcorder held to -6 dB and +3 (his) / +2 (theirs).
After: the scream about -10 dB, the gap when it is cut -27 to -31, the choke and rattle -22 to -24, the last breath fading to -36.
Second: the first rolled fight called both deaths "the armour gave", because a thug's 40-point vest broke on the killing shot.
The armour kind is now for real plate only (the part's full armour 100 or more: mail and up); the vest is the gun's.

## THE KINDS AND HOW THE BLOW PICKS ONE (engine/bohemia_death_sounds.js kindOf; the fight's SND.death says the facts)
In this order: a beast died -> its animal (canine: the wolves, hyenas, war dogs; big: unholds, lindwurms, schrats, krakens; cat:
ghouls, serpents, spiders) / killed by a beast's bite or claws -> beast / the killing blow broke the last of real plate there ->
armour / the killing blow was under a fifth of his full health (a man already going, finished) -> slow / a gun or a bow -> gun /
a cut or a stab (sword, cleaver, axe, spear, polearm, knife) -> blade / a blunt blow (mace, hammer, flail, a sling's stone, a
brute's sweep or clout) -> bone. Machines and ghosts: nothing human dies, the old sound plays.

## THE SPRITE (slices/fight_death/: death.mp3, 113.6 s, 56 kbps mono, 0.8 MB; manifest.json; index.json)
16 voices, 48 takes: bone, blade, gun, beast, slow, armour, each _yours (3.0 s) and _theirs (2.0 s), three takes; skull (0.75 s);
animal_canine, animal_big, animal_cat (2.0 s). Every layer on the 16th grid from the take's start: the blow on 0, the shout on 0
or the first 16th, the cry a 16th later, the drop on a beat (the knee a 16th before it), the rattle on the next beat, the last
breath on the beat after.
THE LEVELS, through the game's own compressor and brickwall (tools/bohemia_death_sounds_level.js, the bullets' ruler): his man
-9 dB (over everything a fight makes: the gun -20, a bullet in a man -16.5, a man shot down -13), theirs -12 played far (-4 dB and
the top off: about -15 heard), a beast -12, the skull -15. None capped.
THE CHAIN: layers (each through the expander) > the street canyon (his 10 m, theirs 28 m; an echo every 16th) > the camcorder (target
-6 dB, +3 / +2) > tape > the VHS band 100 Hz to 10 kHz > the cut, a 16th fade > one loudness per voice.
LOADS LATE: 30 s after the music first runs, or the moment a fight comes up; until it is in, a death plays the old fall.

## HOW IT IS WIRED (tools/bohemia_death_sounds_patch.py, idempotent)
- the alpha: __DEATH_SOUNDS__ (the engine inlined byte for byte, window.DEATH on window.__sfxOut, so the EFFECTS slider, his mix and
  the one beat's 16th hold); the fight's BOHEMIA_SFX line asks DEATH first and a death it plays stands the old fall and the bullet's
  man-going-down down. The demo cut from it (tools/bohemia_cut_the_demo.js).
- the fight (slices/BOHEMIA_FIGHT.html, the sound block, rule 54b): SND.death(u, e) (the killing weapon's class and blow, gun, a
  beast's bite, real plate that broke, the small last blow, the head, a beast's own death, a machine); startAnim keeps the last blow
  that landed on a man (u._blow); the dead note sends SND.death's facts; a skipped turn sends them too. Nothing in the fight's rules
  changed. Each node lets go when its sound ends (COMBAT's hygiene note, 10/26).

## THE GATE (gates/death_sounds_gate.js, DEATH SOUNDS THAT TERRIFY; 235(f))
Static: the game carries it; six kinds x two sides x three takes, skull, three animals; his man louder and longer; every layer CC0
with its Freesound line and every clip named below. Live, on the demo, phone profile and computer: every kind posted the way the
fight posts it plays a take of exactly its voice on the effects bus, the old fall stood down; the head adds the skull; six blade
deaths running never repeat a take; two seeded road fights on AUTO: every death plays the kind its facts name, no take twice running,
the old fall never, each starts on the song's 16th within 20 ms; the fight's own SND.death on dead men the gate makes picks the kind.
Result: in the proof line of the commit and on the board.

## THE SOURCES (every layer of every take; ESC-50 clips whose Freesound author released them CC0, frozen through
## tools/bohemia_from_a_recording.py, which refuses anything else; banked as FLAC in reference/library/sound_bank/esc50_cc0/)
| stem | what | author | Freesound | licence |
|---|---|---|---|---|
| 1-103999-A-30 | wood knocks (RutgerMuller) | RutgerMuller | http://www.freesound.org/people/RutgerMuller/sounds/103999/ | CC0 |
| 1-155858-B-25 | footsteps in a factory hall, wood and concrete (RutgerMuller) | RutgerMuller | http://www.freesound.org/people/RutgerMuller/sounds/155858/ | CC0 |
| 1-260640-A-2 | a pig squealing (TheAcidRomance, Pig Squealing) | TheAcidRomance | http://www.freesound.org/people/TheAcidRomance/sounds/260640/ | CC0 |
| 1-260640-B-2 | a pig squealing (TheAcidRomance, Pig Squealing) | TheAcidRomance | http://www.freesound.org/people/TheAcidRomance/sounds/260640/ | CC0 |
| 1-260640-C-2 | a pig squealing (TheAcidRomance, Pig Squealing) | TheAcidRomance | http://www.freesound.org/people/TheAcidRomance/sounds/260640/ | CC0 |
| 1-30709-A-23 | a breath (UncleSigmund) | UncleSigmund | http://www.freesound.org/people/UncleSigmund/sounds/30709/ | CC0 |
| 1-51147-A-25 | wet bare feet in a small shower cabin (RutgerMuller) | RutgerMuller | http://www.freesound.org/people/RutgerMuller/sounds/51147/ | CC0 |
| 1-9886-A-49 | a wood saw, one stroke (Pingel) | Pingel | http://www.freesound.org/people/Pingel/sounds/9886/ | CC0 |
| 2-117271-A-0 | angry dogs barking (polipa) | polipa | http://www.freesound.org/people/polipa/sounds/117271/ | CC0 |
| 2-118624-A-30 | a door opened and closed, close mic (E-Audio) | E-Audio | http://www.freesound.org/people/E-Audio/sounds/118624/ | CC0 |
| 2-122763-A-29 | gurgles (alienistcog) | alienistcog | http://www.freesound.org/people/alienistcog/sounds/122763/ | CC0 |
| 2-122763-B-29 | gurgles (alienistcog) | alienistcog | http://www.freesound.org/people/alienistcog/sounds/122763/ | CC0 |
| 2-123896-A-24 | a cough (Sempoo) | Sempoo | http://www.freesound.org/people/Sempoo/sounds/123896/ | CC0 |
| 2-131943-A-38 | a wind-up clock with a twin bell alarm (AngryAdam) | AngryAdam | http://www.freesound.org/people/AngryAdam/sounds/131943/ | CC0 |
| 2-133889-A-30 | knocking on a large wood door (aroth4) | aroth4 | http://www.freesound.org/people/aroth4/sounds/133889/ | CC0 |
| 2-144031-A-34 | a soda can opened (timgormly) | timgormly | http://www.freesound.org/people/timgormly/sounds/144031/ | CC0 |
| 2-54961-A-23 | a human breath (cidchili, Breath Human Sci) | cidchili | http://www.freesound.org/people/cidchili/sounds/54961/ | CC0 |
| 2-54962-A-23 | a human breath (cidchili, Breath human Sci2) | cidchili | http://www.freesound.org/people/cidchili/sounds/54962/ | CC0 |
| 2-76408-B-22 | a single clap, close (therabidfrog, Clap.mp3) | therabidfrog | http://www.freesound.org/people/therabidfrog/sounds/76408/ | CC0 |
| 2-76408-C-22 | a single clap, close (therabidfrog, Clap.mp3) | therabidfrog | http://www.freesound.org/people/therabidfrog/sounds/76408/ | CC0 |
| 3-103401-C-33 | a cupboard creaking hard (stijnjobse, kast extreem kraken) | stijnjobse | http://www.freesound.org/people/stijnjobse/sounds/103401/ | CC0 |
| 3-112557-A-23 | frightened breathing (nickrave) | nickrave | http://www.freesound.org/people/nickrave/sounds/112557/ | CC0 |
| 3-119459-A-26 | a man laughing (Eneasz, Male Laughter) | Eneasz | http://www.freesound.org/people/Eneasz/sounds/119459/ | CC0 |
| 3-125418-A-24 | a man coughing (jyoung20) | jyoung20 | http://www.freesound.org/people/jyoung20/sounds/125418/ | CC0 |
| 3-146873-A-24 | a man's sick cough (tgfcoder) | tgfcoder | http://www.freesound.org/people/tgfcoder/sounds/146873/ | CC0 |
| 3-146964-A-5 | a cat howling (Zabuhailo, catHowling1) | Zabuhailo | http://www.freesound.org/people/Zabuhailo/sounds/146964/ | CC0 |
| 3-146972-A-5 | a cat attacking (Zabuhailo, catAttack) | Zabuhailo | http://www.freesound.org/people/Zabuhailo/sounds/146972/ | CC0 |
| 3-151557-B-28 | a man snoring (Erik Pritzens): the rattle | Erik Pritzens | http://www.freesound.org/people/Erik%20Pritzens/sounds/151557/ | CC0 |
| 3-164593-A-15 | a water splash (Adam_N, Water splash 2) | Adam_N | http://www.freesound.org/people/Adam_N/sounds/164593/ | CC0 |
| 3-164594-A-15 | a water splash (Adam_N, Water splash 1) | Adam_N | http://www.freesound.org/people/Adam_N/sounds/164594/ | CC0 |
| 3-166125-A-23 | scared breathing (Adam_N) | Adam_N | http://www.freesound.org/people/Adam_N/sounds/166125/ | CC0 |
| 3-169907-A-29 | eating oatmeal (qubodup): the wet | qubodup | http://www.freesound.org/people/qubodup/sounds/169907/ | CC0 |
| 3-203371-A-39 | a glass exploding (C_Rogers) | C_Rogers | http://www.freesound.org/people/C_Rogers/sounds/203371/ | CC0 |
| 3-233151-A-2 | a pig screaming, one long scream, 96 kHz (JarredGibb, Pig - Scream 5) | JarredGibb | http://www.freesound.org/people/JarredGibb/sounds/233151/ | CC0 |
| 3-94344-A-25 | footsteps on gravel (Ryding, Fotsteg pa grus) | Ryding | http://www.freesound.org/people/Ryding/sounds/94344/ | CC0 |
| 4-117627-A-25 | footsteps on gravel pavement (soundmary) | soundmary | http://www.freesound.org/people/soundmary/sounds/117627/ | CC0 |
| 4-132383-B-2 | black pigs fighting, Alentejo (ideiasemvideo) | ideiasemvideo | http://www.freesound.org/people/ideiasemvideo/sounds/132383/ | CC0 |
| 4-133047-B-5 | a mad cat (temawas) | temawas | http://www.freesound.org/people/temawas/sounds/133047/ | CC0 |
| 4-133047-C-5 | a mad cat (temawas) | temawas | http://www.freesound.org/people/temawas/sounds/133047/ | CC0 |
| 4-154443-A-24 | a cough (ecfike, Cough 2) | ecfike | http://www.freesound.org/people/ecfike/sounds/154443/ | CC0 |
| 4-165845-A-45 | on a train in Argentina, between two wagons, metal (felix.blume) | felix.blume | http://www.freesound.org/people/felix.blume/sounds/165845/ | CC0 |
| 4-167571-A-26 | a man's evil laugh (dlovere) | dlovere | http://www.freesound.org/people/dlovere/sounds/167571/ | CC0 |
| 4-181563-A-12 | a fire crackling, the snaps (kingsrow, Fire Crackling 01) | kingsrow | http://www.freesound.org/people/kingsrow/sounds/181563/ | CC0 |
| 4-210593-A-29 | different gulps (Mafon2) | Mafon2 | http://www.freesound.org/people/Mafon2/sounds/210593/ | CC0 |
| 4-218304-A-25 | sneakers on gravel and leaves (MentalSanityOff) | MentalSanityOff | http://www.freesound.org/people/MentalSanityOff/sounds/218304/ | CC0 |
| 5-194899-B-3 | a distressed mother cow and her calves (lolamadeus) | lolamadeus | http://www.freesound.org/people/lolamadeus/sounds/194899/ | CC0 |
| 5-194899-C-3 | a distressed mother cow and her calves (lolamadeus) | lolamadeus | http://www.freesound.org/people/lolamadeus/sounds/194899/ | CC0 |
| 5-204114-A-29 | a man eating teriyaki noodles (marcjunker): the wet | marcjunker | http://www.freesound.org/people/marcjunker/sounds/204114/ | CC0 |
| 5-207781-A-17 | a liquid pouring (Dvideoguy) | Dvideoguy | http://www.freesound.org/people/Dvideoguy/sounds/207781/ | CC0 |
| 5-232816-A-23 | a contained breath (xavimuse) | xavimuse | http://www.freesound.org/people/xavimuse/sounds/232816/ | CC0 |
| 5-233312-A-28 | a man snoring (trentbh): the rattle | trentbh | http://www.freesound.org/people/trentbh/sounds/233312/ | CC0 |
| 5-236288-A-28 | a human snore (mffm): the rattle | mffm | http://www.freesound.org/people/mffm/sounds/236288/ | CC0 |
| 5-243635-A-29 | swallowing (freakinbehemoth) | freakinbehemoth | http://www.freesound.org/people/freakinbehemoth/sounds/243635/ | CC0 |
| 5-252248-A-34 | a can opened (Reitanna) | Reitanna | http://www.freesound.org/people/Reitanna/sounds/252248/ | CC0 |
| 5-261464-A-23 | a werewolf breathing and sniffing, a voice actor (kd_jack) | kd_jack | http://www.freesound.org/people/kd_jack/sounds/261464/ | CC0 |
| 5-263775-B-26 | a man laughing (scottemoil, Laughing Man) | scottemoil | http://www.freesound.org/people/scottemoil/sounds/263775/ | CC0 |
## NOT DONE, SAID PLAINLY
- Nobody has HEARD these yet but the machine. This lane cannot listen; it read every take as a picture (a spectrogram and a 16th
  profile) and fixed what the pictures showed. EYES listens (rule 179); he hears them in his next fight and on the VOTE card.
- His own men die rarely in a fight on AUTO (20 in 100 of the struck down), so the rolled fights mostly prove theirs; his are
  proved by the posted kinds and the kind table.
- Women: no woman's death yet (rule 203: the roll waits at 0 for her body); when she exists, her voice is this lane's.
- [analog horror: the camcorder that will not look away, the scream cut by the machine's own gain, the room dragged back up under the
  rattle.] [bb: kinds by the killing blow, several takes, never twice running, a throat per man, the fatality's crunch.]
