# BOHEMIA RESEARCH — THE WORLD TONE (8/1/26, SOUNDS lane)

## WHY THIS EXISTS

The valley makes no sound. You walk, you hear your own feet, and then nothing.
Every sound shipped so far is a thing YOU do — a step, a shot, a save. Nothing in
the game tells you where you are standing or what time it is. That is the largest
remaining hole in the game's audio and it is the one that decides whether a place
feels alive or dead.

## 1. AN AMBIENCE IS FOUR LAYERS

Working game-audio practice runs at least four layers under every scene:

- **the ambient bed** — the room's underlying hum, the room tone
- **spot ambient** — a distant car, a door, a single event out in the world
- **character foley** — footsteps, breath, clothing (this game already ships this)
- **the threat layer** — enemy or tension cues

Beds are conventionally built from stereo loops: room tone, wind, city hum,
distant traffic, combined and mixed in real time.

## 2. THE LOOP IS THE PROBLEM

The same literature that describes the bed warns about how it fails. A real
ambient environment is dense and carries **randomised one-shot sounds that stick
out of the mix**; a uniform loop without variation is what "diminishes the sense
of realism and immersion." A loop is recognisable, and once you recognise it, it
stops being a place and starts being a file.

This matters doubly here because of the **SCREECH LAW** (7/8): no `createDelay`,
no `createConvolver`, nothing that can feed back or ring, anywhere in the build.
A conventional looping bed with a reverb send is not available to us even if we
wanted it.

## 3. THE FINDING THAT DECIDED THE SHAPE

From the horror sound-design writing:

> **Silence is not a sound you can't add; it is a sound you choose to remove. In
> horror, tension comes not from what you add but from what you take away.**

And: the strategic use of silence amplifies tension, because the silence that
follows a sound is what lets the player's imagination run.

**This is already Bohemia's stated doctrine**, written into the engine header
before this research existed: *"only sounds that MEAN something get the room.
Footsteps stay dry and close. The contrast is the horror — small sounds intimate,
big sounds telling you how empty it is."*

So the world tone is **not a wall of wind**. It is the SPOT layer with the bed
left almost empty: one rare event, minutes apart, with the silence between doing
the actual work.

## 4. WHY THAT ALSO SOLVES THE ENGINEERING

A randomised one-shot is exactly what `BOH_SFX` already makes. So:

- **no new synthesis** — the ambience reuses the modal engine unchanged
- **no loop** — there is nothing to recognise, because nothing repeats
- **SCREECH LAW held by construction** — every voice is finite and decays to zero;
  there is no feedback path to audit because there is no path

The three moments are cooked as ordinary candidates, judged on the ordinary
surface, and banked the ordinary way. The ambience is a *scheduling* decision on
top of sounds he has approved, not a second sound engine.

## 5. THE THREE MOMENTS

| event | material | the idea |
|---|---|---|
| `air_day` | stone, high and thin | midday. heat, distance, dry air — a valley too hot to be outside in |
| `air_night` | choir, low and wide | after dark. **this one is the horror**: a room far bigger than the one you are standing in |
| `air_inside` | wood, close and dry | a building with nobody in it. small, and you can HEAR that it is small |

`choir` is used exactly once, for the night, because that is the only place a
dead chapel belongs. The contrast between `air_night` (huge) and `air_inside`
(small and dry) is the whole point: stepping through a door should change the
size of the world.

## 6. THEY ARE COOKED LOUD ENOUGH TO JUDGE, NOT AT BED LEVEL

All three render around 0.20 peak, in the judgeable band, roughly level with a UI
tap. **That is not the level they play at in the world.** He has to be able to
hear a thing to thumb it; what level the ambience sits at underneath the game is
a wiring decision that comes after his verdict, not a number baked in before it.
The mix ladder now asserts the gun and the kill dwarf all three, so the room can
never come up over the game.

## 7. WHAT IT PLUGS INTO

The run already has a real day clock — `dayFrac(turn)` over `DAY_TURNS`, with a
world-turn counter in the save, driving NPC schedules ("Mojave midday shelter",
dusk sitting). Time of day is live, so the day/night split is answerable from
state that already exists. Inside versus outside is `mode==='ext'`, already used
by the footstep classifier.

## SOURCES

- [How To Make Ambiences For Games — Game Audio Learning Portal](https://www.gameaudiolearning.com/knowledgebase/how-to-make-ambiences-for-games)
- [Silence is Scary: The Power of Sound Design in Horror Games — Wayline](https://www.wayline.io/blog/silence-is-scary-sound-design-horror-games)
- [The Art of Immersion: How Ambient Audio Breathes Life into Game Worlds — Wayline](https://www.wayline.io/blog/ambient-audio-game-worlds)
- [How to create an audio soundscape for video games — Splice](https://splice.com/blog/audio-soundscape-for-video-games/)
- [Horror Game Sound Design: Binaural Audio, FMOD, and the Art of Silence — Althera Games](https://altheragames.com/en/blog/horror-game-sound-design)
- [How to Make Horror Game Music and Sound Effects — Splice](https://splice.com/blog/horror-video-games-sound-design/)
- [Crafting Immersive Soundscapes for Video Games and Motion Pictures — Karanyi Sounds](https://karanyisounds.com/blogs/production-tips/crafting-immersive-soundscapes-for-video-games-and-motion-pictures)
- [The silent role of sound design in video games — IDC Games](https://idcgames.com/en/blog/the-silent-role-of-sound-design-in-video-games/)

Prior research: `records/BOHEMIA_RESEARCH_FFX_UI_SOUND_7_29_26.md`,
`records/BOHEMIA_RESEARCH_GUNSHOT_8_1_26.md`
