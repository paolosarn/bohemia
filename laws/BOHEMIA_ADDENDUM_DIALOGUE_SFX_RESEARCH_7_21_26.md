# BOHEMIA — ADDENDUM: DIALOGUE SFX RESEARCH — GIBBERISH VOICE, MASS-PRODUCIBLE
### 7.21.26 — Paolo asked for research on how successful games give NPCs "voices" without recording real spoken dialogue, so a small team can mass-produce lots of distinct character vibes cheaply. Research + design direction; the MECHANISM (deterministic per-character assignment) is small enough to build now, the ACTUAL AUDIO is a production step for later.

---

## PAOLO'S ASK (his words, 7/21)
"I imagine it could be something as cute and easy as like Animal Crossing squiggle language or something. That would make it easier for us to mass-produce people's voices. No actual words spoken in the game, just a template of lots of voices and lots of different vibes of those voices."

## HOW ANIMAL CROSSING'S "ANIMALESE" ACTUALLY WORKS
Animalese is a speech-synthesis gibberish system: text input is converted to audio by mapping individual characters/phonemes to short pre-recorded sound clips. Each letter of a line of dialogue triggers a corresponding sound, producing rapid-fire gibberish rather than real words.
- **Pitch varies by mood and personality type.** Happy villagers speak higher-pitched, sad/angry villagers lower. Starting with New Leaf, every personality archetype (there are only a handful of archetypes, not one per villager) has its own distinct base pitch.
- **Speed reacts to how fast the player scrolls text** — scroll faster, Animalese speeds up and gets higher-pitched.
- The GameCube original used a slower, more comprehensible synthesizer; the DS version leaned into pure gibberish. Both versions prove this scales from "almost readable" to "pure comedy noise" using the exact same underlying mechanism, just tuned differently.

## HOW UNDERTALE DOES IT — THE CHEAPEST VERSION
Undertale gives each character a completely unique "voice" from **a single sound clip per character**, played once per letter as it prints to the dialogue box (the classic example: Sans's voice is a repeating "duh-duh-duh"). This is the absolute floor for production cost: one short clip per character ARCHETYPE (not per line, not per word) is enough to make every character feel distinct. Deltarune and Stardew Valley use close variants of the same idea (a per-character blip note, sometimes pitched per letter/vowel).

## THE PATTERN, DISTILLED
Every successful implementation shares the same shape:
1. A small BANK of base sound clips (a handful of distinct timbres/textures — gruff, chipper, gravelly, airy, etc.) — NOT one per character.
2. Each character is assigned ONE bank entry (an archetype) plus a pitch/speed modifier.
3. Playback fires per LETTER or SYLLABLE as the text visually reveals (typewriter effect), not as one long pre-rendered line.
4. Mood/emphasis can nudge pitch live (happy = higher, angry = lower, `!`/`?` = a bump) without needing new recordings.

This is exactly the existing MUSIC bank/gate pipeline pattern (a handful of source assets + procedural variation), applied to voice instead of music.

## MECHANISM BUILT TODAY (visual preview only — no audio exists yet)
Since Bohemia has no walkable render or audio pipeline hooked up yet, today's build is a **deterministic assignment preview**, not real sound:
- `voiceFor(speakerName)` in the phone demo derives an archetype (one of 8: gruff/chipper/gravelly/airy/clipped/warm/flat/singsong) and a pitch value from a hash of the speaker's name — the SAME zero-manual-design pattern already used everywhere in this engine (avatar colors, wander AI direction, spawn rolls: deterministic, no live RNG, no per-character authoring required).
- The dialogue overlay shows a small animated "voice signature" squiggle next to the speaker's name while they talk, its bar heights and timing driven by that same pitch value — a visual stand-in for the eventual per-letter blip audio.
- **No label is shown** (learned from the same day's clout-badge correction: don't stamp an internal mechanic's name on the UI, let it just be felt/seen as behavior).
- When real audio exists, the exact same `voiceFor()` assignment plugs into an actual blip-sound trigger fired per character as dialogue text reveals — the mechanism doesn't change, only the payload (a real audio buffer instead of a CSS animation).

## WHAT THIS BUYS BOHEMIA SPECIFICALLY
- Every NPC gets a distinct "voice" with ZERO per-character authoring — the same deterministic-hash approach the whole engine already runs on. A content author writing a new .bq quest with a new speaker never has to assign a voice; it falls out of their name automatically.
- No voice-actor budget, no per-line recording, no localization re-record cost (gibberish doesn't need translation).
- Matches the "hardcore but for normies" instinct from the same conversation: gibberish-with-subtitles is a well-loved, non-alienating convention (Animal Crossing, Banjo-Kazooie, Undertale are all mainstream, broadly beloved games, not a niche indie quirk).

## PENDING — Paolo's calls
- The real archetype ROSTER (how many distinct base clips, what they actually sound like) is a sound-production decision, not made here.
- Whether pitch/mood should react live to dialogue content (a `!` bumping pitch, an angry `@FACTION` flag lowering it) the way Animalese's mood system does — a nice hook, not built.
- When actual audio production becomes real (a "voice bank" pipeline parallel to the existing MUSIC bank/gate), it should get its own FACTORY LAW gate the same way MUSIC did.

---
*BOHEMIA — Dialogue SFX Research — 7.21.26*
*One clip per vibe, not one recording per line. Let the hash pick the voice.*

Sources:
- [Animalese — Nookipedia](https://nookipedia.com/wiki/Animalese)
- [Animalese — Grokipedia](https://grokipedia.com/page/Animalese)
- [How to: Animal Crossing Dialogue Sounds (devlog, geolojosh)](https://geolojosh.itch.io/goodlands/devlog/314373/how-to-animal-crossing-dialogue-sounds)
- [Cyberpunk 2077 Phone Communication — Gameplay Mechanics (The Rookies)](https://www.therookies.co/projects/82393)
