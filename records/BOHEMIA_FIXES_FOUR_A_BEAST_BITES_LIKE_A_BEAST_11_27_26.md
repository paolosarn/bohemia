# FIXES 4 -- A BEAST BITES LIKE A BEAST (11/27/26, BUILD 11/27t, ask row 749)

The lane: FIXES 4 (session_01GKDyuw6giHRPkwhvFvmGvk), taking over from FIXES 3 (HANDOFF READY 02:13 11/27).
The ask: row 749, FOUND BY BESTIARY 2 11/26 under rule 482 ('each moves and sounds like the animal it is'): a beast's blow
landed as a pipe. SOUNDS has had no chat since 11/7 (SOUNDS 3, opened 11/27, is on the music, rule 488), so FIXES took it
on FIXES 3's written plan.

## 1. MEASURED BEFORE, ON THE REAL SURFACE

The demo (390 x 844), a road fight through the map's own door, the band set to three coyotes, two feral hogs and a mountain
lion, both sides on AUTO (gates/a_beast_bites_like_a_beast_gate.js --plant serves the fight with the old message):
18 of 18 beast blows that landed played the shell's `blunt` voice (`hurt_body` for a blow on one of his): the carpet step
slowed, a clap, a door knocked far under it. A pipe in a man. A coyote, a hog and a lion sounded the same, and like a man with
a pipe. The animal was heard only when it died (the death player's animal_canine, animal_cat, animal_big).

Why: the fight's `SND.blow` sends a beast's natural weapon as `blow: 'blunt'` (the class `natural` sits in the blunt list), and
the message never said who struck. The shell's punch player (engine/bohemia_punch_heard.js) had no animal take to play anyway.

## 2. WHAT CHANGED

- THE FIGHT (slices/BOHEMIA_FIGHT.html, SOUNDS' block): `SND.blow` adds `striker: <the beast's kind>` when the one who struck is
  a beast, and only then; `SND.beastOf(u)` is the one reading of 'is this a beast' (u.beast, or the old kind regex), and
  `SND.death` now reads it too, so the blow and the death can never disagree about who is an animal.
- THE PLAYER (engine/bohemia_punch_heard.js): `beastOf(m)` turns the striker into the death player's own animal word
  (`BOH_DEATH.animalOf`: canine, cat, big) and a beast's `melee_hit`, `vital` and `hurt` play `beast_canine`, `beast_cat` or
  `beast_big` instead of the pipe. A man's blow is untouched (blunt or blade); a beast's blow on a machine is still steel; a
  miss is still the scuff; his ruled 'that was you' (`hurt`) still plays on top. A sprite from before the beasts (an old cache)
  falls back to the blow it had, never silence.
- THE SOUNDS (tools/bohemia_sounds_the_punch.py, slices/fight_punch/): three voices, three takes each, cut from the same
  licensed ESC-50 CC0 clips the death voices are cut from (tools/bohemia_from_a_recording_sources.json):
  - `beast_canine` (0.37 to 0.39 s): the angry dogs' bark lowered to a snarl (2-117271-A-0), the body taking it (the carpet step,
    5-234855-A-25), the teeth going in (a sip slowed, 5-204114-A-29, the death recipe's 'the bite: the wet'), a wet step under it.
  - `beast_cat` (0.52 to 0.59 s): the cat attack's snarl lowered (3-146972-A-5), a hand saw's stroke quickened to claws through
    cloth (1-9886-A-49), the body, the wet.
  - `beast_big` (0.58 to 0.66 s): two black pigs fighting, lowered to a grunt (4-132383-B-2), the body, the door knock slowed for
    the mass behind the horns, a door's slam under it. Kept to about a 120 BPM beat (a first cut was 1.23 s, two beats; cut down).
  Levels through the game's own chain (tools/bohemia_sounds_the_punch_level.js): canine and cat at -15 (the pipe's mark), big at -14.
- KEEP: the tool now keeps the committed sprite's audio for every voice it already holds and only renders the new ones (`--fresh`
  re-renders all, on purpose). MEASURED: a fresh render moved the road stop, the boss found and the knock at the door (their
  ray-traced hall and bar, pyroomacoustics, unseeded), so a new voice would have quietly changed sounds he has heard. The one
  re-encode of the kept audio is a flat -0.43 dB across the band (every octave within 0.1 dB of it up to 8 kHz); the level tool
  gives it back in index.json (blunt -3.55 -> -3.15 dB, heard -15 both), so every old sound lands where it did.
- THE GOAT: `animalOf` put Harrington's goat with the dogs (no word for it), so it died with a dog's yelp; it is with the big
  beasts now (the cow and the pig), in the same function, so its death and its blow agree. NOT DONE, NAMED: the teratorn (a
  giant bird) is still a dog in both; the bank has two crow clips (4-173865-B-9, 4-188287-A-9) and no bird voice is cut yet.

## 3. PROVEN (rule 441)

- A BEAST BITES LIKE A BEAST (new, gates/a_beast_bites_like_a_beast_gate.js) 8/0: B1 the sprite (three voices, three takes,
  none past 0.75 s, every source CC0 with its animal in it, each at its mark, the twenty before kept); B2 the router (17 beasts
  to their animal, the death player's own word; a man's blow, steel, his man hurt, a miss) and the player itself (played,
  stood down, 'that was you' on top, the old sprite's fallback); B3 the fight names the striker; B4 the alpha and the demo carry
  both players byte for byte; B5 THE REAL SURFACE: the demo's road fight with coyotes, hogs and a mountain lion on AUTO: 5 of 5
  beast blows that landed played their own animal (beast_canine, beast_big, beast_cat), the pipe 0; his man's blow still the
  pipe; nothing threw. PLANTED (the fight's old message served in place of the fight): B5 red, 18 of 18 the pipe.
- DEATH SOUNDS THAT TERRIFY 20/0 (the second run; the first threw inside its own live boot before any leg, a flake, not this
  change: the second run is the same tree). ENGINE SYNC zero drift (19 modules). DEMO BUILD 25/0. PAGES PUBLISH 30/0.
  THE BULLET LANDS --fast 12/0.
- Quarantined old gates run and printed, red on main too and naming nothing of this: SFX WIRED 1050/6 (the dead walk's board,
  eat, quest_done), SOUND REACHABLE 19/4, ONE ENGINE 0/1 (a page.click timeout).
- Pre-push pass green; full suite unmeasured since PLUMBER 8's line.

## 4. WHAT HE WOULD MEET

TAB: RUN on the alpha link, and the demo link. In any fight with animals (a coyote pack on the road, a hunt, the hogs at the
water, a bull), when an animal hits one of his men he hears the animal: a snarl and teeth from a coyote or a wolf, a big cat's
snarl and claws from a lion, a grunt and a heavy hit from a hog or a bull. A man with a pipe still sounds like a pipe. The goat
dies like a hoofed animal, not a dog. VOTE card fixes4-a-beast-bites-like-a-beast-11-27 plays the game's own sounds, before and now.

## 5. ROUTED

- The teratorn's voice (a bird, the crow clips): SOUNDS 3 or the next FIXES, after the music (rule 488).
- DEATH SOUNDS THAT TERRIFY's ON THE BEAT leg (row 749's ALSO SEEN: red on main two runs of three on 11/26): 7 of 7 deaths booked
  on the sixteenth on both screens this round; not struck, one green run is not a fix.
