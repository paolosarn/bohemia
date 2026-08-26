# V186 — ONE ENGINE OWNS THE ROOM
### 8/26/26. His bug, and it was one word inside a law we already had.

---

## WHAT HE SAID

> *"I don't know if you're doing a good job making sure music don't play from the
> other tabs into the combat... **first off, I identify if that's an issue. I feel
> like it is.** And then when I'm playing the combat, bro, **it's like two songs at
> the same time.** What the fuck is going on?"*
>
> *"You're fucking up the music show. **I can't even begin judging it** because it
> sounds like shit."*

He asked me to confirm it before touching it. So it was measured first.

---

## HE WAS RIGHT TWICE

Counting every oscillator and buffer start, per frame, per second:

| | sound starts / sec |
|---|---|
| on RUN, idle | 0.0 |
| COMBAT open, idle | 0.0 |
| **in a fight** | 22.9 |
| **after leaving COMBAT for RUN** | **19.9 — still playing** |

Nineteen sounds a second on a tab that is not combat. And during a fight, **two
separate audio contexts were live at once.**

---

## THE LAW ALREADY EXISTED. THE CONDITION WAS AIMED AT THE WRONG TAB.

> **ONE ENGINE LAW (Paolo 7/3/26, crunch hunt):** *"the studio and combat never
> play at once; two unsynced drum machines **flam into mush**."*

The wire was built and works: the shell posts `{bohemiaMusicMute}`, combat obeys it
and calls `stopFactionLoop` / `startFactionLoop`.

```js
if(t.dataset.p==='music'){ ... postMessage({bohemiaMusicMute:true}) }
if(t.dataset.p!=='music'){ ... postMessage({bohemiaMusicMute:false}) }
```

**Going to any tab that is not the music studio posts mute:FALSE — which tells
combat to START PLAYING.** Leaving a fight for RUN did not *leak* music. It
**ordered** it. That is the 19.9/s exactly.

The law was written when the only rival engine was **the studio**, so it asks *"is
the studio open?"* when the question it means is **"is combat on screen?"** Every
tab added since inherited the wrong answer.

## AND THE SECOND SONG WAS A SECOND BUG, IN THE SAME HANDLER

```js
if(t.dataset.p!=='music' && MUS.playing){ ...stop CITYMUS or MUS... }
```

The whole branch is guarded on **`MUS.playing`**. If the studio was not playing but
the **city shuffle** was, nothing stopped it — so the city's music walked straight
into a fight and played over the combat loop. **That is his "two songs at the same
time."**

---

## THE FIX: ONE RULE, STATED ONCE

**The COMBAT tab owns the audio while it is on screen, and nothing else does.**

- combat's loop is muted unless COMBAT is the visible tab — both directions of his
  complaint, from one condition
- opening COMBAT stops the studio **and** the city shuffle, unconditionally
- the studio still wins over combat while the studio is open — the original 7/3
  ruling, untouched

## MEASURED AFTER

| | shell | combat frame |
|---|---|---|
| on RUN, idle | 39.8 | 0.0 |
| **in a fight** | **0.0** | **20.1** |
| after leaving COMBAT | 0.0 | 0.0 |
| back in COMBAT | 0.0 | 19.6 |

**One engine, every time.** Silence when you leave, and the music comes back when
you return.

---

## THE GATE, AND WHY IT COUNTS SOUND INSTEAD OF READING CODE

`gates/one_engine_gate.js` — **3 pass / 0 fail**, registered in the suite.

This law was **written down, wired, and never machine-checked**, which is how a
one-word condition stayed wrong for weeks. *A law without a machine gate is not
enforced* — it just took a while to prove it again.

It wraps `createOscillator` and `createBufferSource` in every frame and measures
**starts per second**, because a music loop is fast and steady while a click is a
blip — and because **a string check would have passed happily on the broken
version.**

**One claim in it was wrong on the first write and is worth keeping visible:** E3
originally asserted *"a quiet tab is quiet"* and went red on the RUN tab measuring
39.8/s. That is **correct behaviour** — RUN is allowed its own music. The law is
*one engine at a time*, never *tabs are silent*. Restated: while combat is on
screen, the shell must be quiet.

---

## AND A PROBE BUG WORTH NAMING

An early probe read `window.frameElement.name` from inside the combat iframe to
label which engine was making noise. That is **null for a `srcdoc` frame**, so both
engines silently merged into one column and the shell appeared to be playing
combat's music. Keyed from the Node side by frame index instead.

---

## WHERE HE FINDS IT

**COMBAT tab.** One song, and only while he is looking at it.
