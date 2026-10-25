# PAOLO 10/25: THE SOUND CHOPS ON HIS CAR'S BLUETOOTH (LOCKED, rule 175)

## HIS WORDS (verbatim, voice to text)
"Also, I don't know if you can analyze this or support and help this but every time I play the music or I'm playing the
game and it's on my car speakers through Bluetooth. It's it gets all choppy and fucked up and I wanna know if you know
anything about that or could support and fix that."

## WHAT THE COORDINATOR MEASURED IN THE CODE (10/25 17:50, main)
- No microphone anywhere (no getUserMedia): the car is not being pushed into its phone-call mode.
- The music is synthesized live: 783 createOscillator calls in the alpha and the demo; every note builds new nodes in
  real time while the same phone draws the 3-D town and fight.
- The game's AudioContext is made with the default latency (new AudioContext() with no latencyHint), the smallest
  buffer: right for a click, fragile for music when the phone stalls.
- The fight frame makes a second AudioContext of its own.
- A phone near its memory line (rules 173, 174) stalls; a stall the wired speaker hides becomes a dropout on Bluetooth,
  which carries its own delay and drops what arrives late.

## THE RULING (rule 175)
(a) THE SOUND NEVER CHOPS, on the phone's speaker, headphones, or Bluetooth in a car.
(b) The music plays from audio rendered ahead, not built note by note in real time while the game draws: each song's
    three intensities (rules 167, 168) rendered once into buffers and played back, the level change a crossfade on the
    bar, on the 120 BPM beat. Effects stay instant.
(c) ONE AudioContext for the whole game (the fight's sounds go through the shell's), made with a playback-sized
    latency for the music, scheduled ahead with a lookahead so a stalled frame never starves it.
(d) THE GATE: the game played on the phone profile with the CPU throttled (four times slower) through a fight and the
    map, the audio output recorded, and zero dropouts counted; the music's beat still lands on the same 120 BPM grid
    the fight's actions use (158).
(e) SOUNDS [the sound never chops], with [the fight's music you can hear] (168): rendering the three levels ahead is
    the same work.
NOTE: if other apps also chop in his car, part of it is the car or the phone's Bluetooth; the game's part is fixed
either way.
