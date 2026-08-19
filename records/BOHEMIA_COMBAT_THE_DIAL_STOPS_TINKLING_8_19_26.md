# THE DIAL STOPS TINKLING (V166, 8/19/26, COMBAT lane)

> Paolo 8/19: *"when i leave or enter the deadshot dial theres like a glass bottle
> noise i hate that"*

**TAB: COMBAT.** Open the dial. It is silent now.

---

## HOOKED, NOT GUESSED

Every voice in the combat frame was wrapped — `sfxAsk`, `tone`, `sndShot`,
`sndShot2`, `sndHit`, `sndKill`, `sndMiss`, `sndReturn`, `sndVital`,
`sndMissImpact`, `audio` — and the dial was opened through the shipped `enterAim`:

```
ON ENTER   : ["sfxAsk(casing)"]
after 700ms: ["tone(680,0.05)", "tone(340,0.085)"]
ON LEAVE   : []
```

**Two sounds. Two separate bugs. He heard them as one tinkle.**

---

## BUG ONE: THE BRASS CAME OUT BEFORE THE GUN WENT OFF

`sfxAsk('casing')` sat inside `enterAim`. Its own comment said:

> *"It rides the ROUND, not the trigger, so a dry pull throws no brass."*

But opening the dial is not the trigger either. **It is raising the gun.** The
shot happens later, when he hits the green. So a casing tinked off the concrete
the instant the dial opened, before a single round had left the barrel.

It rides `sndShot` now — the one door every shot in the file goes through — and it
sits **above** the `sfxAsk('shot')` early return so it fires whether or not the
bank has a sample for the bang.

## BUG TWO: THE LAST BARE UI BEEP IN THE FILE

```js
function sndAccent(){ tone(680,0.05,0.05,'triangle'); tone(340,0.085,0.035,'sine'); }
```

Two **pure** tones an octave apart, no noise floor, no body, both gone inside a
tenth of a second. **That is a glass ping by construction.** It fires every time
the kill window comes round on the dial, which is exactly *"when I enter the
deadshot dial"*.

### And the cure was already written in this file, three lines above it

V75, about this cue's own twin:

> *"It was a 415Hz square blip — **a UI beep sitting outside the music**, which is
> a big part of why the timing never felt musical. It plays the song's own hat,
> and beat one plays its kick."*

V75 fixed `sndBeat` and `sndHeroTick` and **left `sndAccent`, the third member of
the same trio, as the last naked oscillator in the combat loop.** Same disease,
same cure, one missed.

All three are the band now, and all three are still tellable apart:

| cue | voice |
|---|---|
| beat tick | the song's **hat** |
| beat one | its **kick + hat** |
| kill window | its **kick**, alone |

Nothing was invented: kick and hat are the only two voices a song carries, and
`sndHeroTick` already stacked them. Even the fallback stops being glassy — one low
square instead of a triangle-and-sine chime.

**If he says it again, it goes silent.** STOP PRODUCING: a second rejection ends
the feature. The accent has a job — hearing the kill window without staring at the
dial — and the *visual* pulse is set outside the sound call, so silence costs
nothing on screen. That is the next move, not a third sound.

---

## THE GATES, AND THE CHECK THAT WAS NOT LOAD-BEARING

`gates/fight_moves_you_gate.js` — 26 claims (was 23). It hooks the voices in a
real browser, opens the dial, and listens:

- raising the gun fires **nothing at all**
- `sndShot` fires the casing
- `sndAccent` fires a **drum from the song's kit** and no bare tone

`gates/combat_lab_gate.js` — 855 claims. The structural half, plus a check that
the three dial voices stay distinct, plus the fallback.

**The first version of the brass claim was a string check and a mutation walked
straight through it.** Changing `try{ sfxAsk('casing'); }` to
`if(0){ sfxAsk('casing'); }` left the gate green: every word still present, only
the behaviour gone. A string check cannot tell a call from a corpse. The positive
half moved to the browser, where the cue can actually be heard, and the mutation
now goes red.

**Mutation-tested, and each put back:** the glass ping restored → 3 red; the
accent given the hat so all three cues sound alike → 2 red; the casing disabled
inside `sndShot` → 1 red *(in the browser gate; the lab gate's string version was
the one that missed it)*.
