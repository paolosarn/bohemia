source: Grok, unverified, written 2026-10-17
PASSED FILTER (EYES 10/18 eyes-opus-10-18c. GAMES: none named (the NES is the hardware, not a reference game; Chris Wilson is the Web Audio engineer, not a game). NUMBERS CHECKED: four duties, sixteen volume steps, a triangle with no volume, noise in two modes at sixteen rates and a nonlinear mixer are the hardware's (nesdev APU Pulse, Noise, Mixer); the famichord is real, a seventh chord with the fifth dropped, named by the chip musician Linus Akesson (his 'Elements of Chip Music'; Ludomusicology 2015); the 25-100 ms lookahead is Chris Wilson's scheduler ('A tale of two clocks', web.dev: a 25 ms timer, a 100 ms window). ERRATUM: browser oscillators do not alias, they are band-limited wavetables in Chrome, Safari and Firefox (Firefox since 37), so the gentle low-pass is for tone, as the hardware's 14 kHz filter is, not to stop aliasing. records/BOHEMIA_EYES_THE_GROK_PAGES_STAMPED_MUSIC_FIRST_10_18_26.md)
# NES CHIP DEEP WEB AUDIO

## PAOLO SAID IN THIS CHAT

Paolo said more deep not surface level research. He wants better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound so Claude can make stronger tracks for the light game engine.

## MY PROPOSAL

NES 2A03 limits. Two pulse channels with four duty cycles only: 12.5%, 25%, 50%, 75%. Sixteen volume steps. Envelope that decays linearly or holds constant. Triangle has no volume control. It is full on or off. Noise is LFSR, long or short mode, sixteen rates. No free pitch on noise. DPCM is low-quality samples only. All monophonic. Mixer is nonlinear. These limits force the sound. Stay inside them.

Famichord. Drop the fifth of a seventh chord so three voices fit. Root, third, seventh. It keeps the jazz color without needing a fourth channel. Channel sharing. One voice jumps between two roles by pitch or duty when space opens. Super-fast arpeggio compresses harmony into one channel. Nested loops vary by reordering short phrases.

Web Audio precision. Schedule with AudioContext.currentTime, not setTimeout. Lookahead scheduler looks 25-100 ms ahead and posts start/stop and parameter changes onto the audio clock. This removes drift and clicks. Gain envelopes must reach near zero before stop. High-pass noise. Gentle low-pass on squares to cut aliasing of sharp edges. Authentic hardware filtered the high harmonics. Modern pure oscillators do not. That filter is why hardware sounds clearer and less sandy.

Sand comes from stacking bit crush, no high-pass, heavy limiting, and aliasing of unfiltered square edges. Stay dry. Sixteen volume steps. Linear or exponential but short envelopes. Three or four voices max. The stiffness and dry clarity fit the analog horror. Parts that do not fit, but the notes stay readable.

### COOK

One pulse channel with only the four NES duties and sixteen volume steps. One Famichord example using root third seventh. One lookahead scheduler that posts notes onto AudioContext.currentTime. One filtered square that cuts the aliasing. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
