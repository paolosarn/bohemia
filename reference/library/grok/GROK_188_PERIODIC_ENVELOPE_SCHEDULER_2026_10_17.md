source: Grok, unverified, written 2026-10-17

# PERIODIC ENVELOPE SCHEDULER

## PAOLO SAID IN THIS CHAT

Paolo said more. He wants deeper research so Claude can make better 120 BPM 8-bit songs that play on HTML without the crushed-sand sound for the light game engine.

## MY PROPOSAL

PeriodicWave. Built-in square and triangle are band-limited and clean. NES pulses are not. Use createPeriodicWave with Fourier coefficients that match the four NES duty cycles (12.5%, 25%, 50%, 75%). This gives the reedy or hollow character without modern anti-aliasing washing it out. Keep the harmonic count low so high edges do not fold back into sand.

NES envelope. Sixteen linear volume steps. Constant volume or decaying counter that reloads on loop. In Web Audio map this to discrete gain steps or a short linearRampToValueAtTime chain. Do not use long exponential releases. Fast attack, short decay. Reach near zero before stop so notes do not click. Triangle stays full volume or silent.

Lookahead scheduler. Chris Wilson pattern. A setTimeout every 25 ms looks 100 ms ahead. While the next note time is inside the window, schedule the oscillator start, stop, and gain ramps onto AudioContext.currentTime. This keeps the groove locked even if the main thread hiccups. No setInterval for notes. The audio clock does the precision. Test the loop for a full minute. Seam must be silent.

These three keep the sound dry, stiff, and readable. The parts do not fit, but the notes stay clear. Analog horror is the limitation, not the mud.

### COOK

One PeriodicWave square at 25% duty. One 16-step linear volume envelope. One lookahead scheduler posting notes at 120 BPM. Lock these against the earlier sheets. The art coordinator can cook them. The main character is still downed, never dead. Square house tiles stay. Nothing glows. Analog horror is the light the stillness and the parts that do not fit, decided at the source.
