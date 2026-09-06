# THE BEAT ON A PHONE: NOBODY HAS MEASURED TOUCH-TO-SOUND (coordinator swing, this round)

## THE QUESTION NOBODY ASKED
Combat is ROGUE FABLE 4 on the beat at 120 BPM, and NO DAMAGE BEFORE THE DIAL. The
whole fight is a timing judgement. A beat is 500 ms; the window a player has to be
"on" it is a fraction of that. He plays on an iPhone, in a browser. So the number
that decides whether the fight is fair is TOUCH-TO-SOUND LATENCY on iOS Safari, and
in about five hundred gates nothing measures it. The plumber measured frames. Not
this.

## WHAT IS KNOWN, AND IT IS BAD
- Safari's plain audio tag is notorious for delay on click-triggered sound; a
  sound three quarters of a second after the tap has been reported.
- Web Audio on iOS has been measured at extreme delays, around 1,500 ms, after a
  tab has been in the background and woken again. That is exactly what a phone
  player does four times a day.
- In rhythm games the lag is not subtle: a player can HEAR a note being off, and
  the audio buffer size matters more than anything else.
- Desktop Safari is the best of the browsers; the phone is the problem, and the
  phone is the target.
Sources: [iOS web browser latency, measured](https://dbushell.com/2025/11/27/ios-web-browser-latency/),
[rhythm game input lag testing: every millisecond is audible](https://geartalk.gg/threads/rhythm-game-input-lag-testing-every-millisecond-is-audible),
[diagnosing extreme AudioContext latency on iOS](https://developer.apple.com/forums/thread/699192),
[HTML5 audio delay in Safari](https://developer.apple.com/forums/thread/77162).

## WHY THIS IS THE RISK UNDER EVERYTHING ELSE
The first fight teaches THE BEAT ALONE. If the beat the player hears arrives 200 ms
after the beat the game judges, the lesson is unlearnable: they will fail while
doing it right, and the research on teaching says that is the one thing that makes
a player quit rather than retry. SOUNDS just put the beat at the front door; if it
is late on a phone, it is teaching the wrong beat from the first second.

## THE HONEST FIX SHAPE (measure first, then two things)
1. MEASURE touch-to-sound on a real iPhone, in Safari, cold and after backgrounding.
2. The game judges the beat by its own CLOCK, never by when the sound played, and
   the sound is scheduled ahead on that clock rather than fired on the tap.
3. Where the phone's delay is known, the judgement window offsets by it: the fight
   is fair on the phone it is on.

## ROUTED
- PLUMBER [beat latency]: the number, on a real phone, in a gate.
- SOUNDS [scheduled beat]: the beat and the hit are scheduled on the clock, not fired.
- EYES E14 [late beat]: school first (how rhythm games calibrate), then the check.
