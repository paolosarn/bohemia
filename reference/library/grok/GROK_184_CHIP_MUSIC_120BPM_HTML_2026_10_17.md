source: Grok, unverified, written 2026-10-17

# CHIP MUSIC 120BPM HTML

## PAOLO SAID IN THIS CHAT

Paolo said he needs big brain research on how Claude can make better songs at 120 BPM using music that could be played on HTML. The game is very light in its engine. They have lots of songs but a lot of it has been underwhelming. The sounds make it sound like some a bit crushed sand kind of vibes. He wanted to do a lot better. He likes 8-bit. Crushed sand is a lot of the way it sounds.

## MY PROPOSAL

120 BPM is a solid chiptune tempo. Classic NES tracks often sit 120-150. Use pure Web Audio API synthesis. No heavy samples. Square waves for leads. Triangle for bass. Noise for drums. Limited channels (3-4 voices) keep it light and clear.

Crushed sand comes from too much bit crushing, heavy compression, muddy low end, or stacking modern effects. Fix it by staying dry and simple. High-pass everything except triangle bass below 80 Hz. Gentle low-pass around 12-16 kHz. No heavy limiting. Fast attack envelopes. Short noise hits for drums. Arpeggios instead of full chords.

Web Audio tips for Claude. Always use gain envelopes so notes do not click. exponentialRampToValueAtTime for natural decay. Keep individual volumes low (0.05-0.2). Layer slightly detuned squares only if needed. Duty cycle shifts on squares add life without mud. Export as short looping code or JSON note data, not big WAV files.

Prompt Claude with constraints. NES-style square lead, triangle bass, noise drums, 120 BPM, 3-4 channels max, arpeggios, no heavy effects, clean loops. Ask for Web Audio JavaScript or simple MIDI that maps to square/triangle/noise. Test at real volume. The analog horror fit is stiff, dry, slightly wrong, not muddy sand.

### COOK

One 120 BPM Web Audio loop with square lead, triangle bass, and noise drums. One prompt template for Claude that locks the constraints. One short gain-envelope example that avoids clicks. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
