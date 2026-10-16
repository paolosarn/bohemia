# THE RANGE WAS NEVER WIRED TO YOUR GUN

**8/11/26 — COMBAT lane. Answers Paolo, for the third time: "again I can
personally just stand still and shoot and kill everyone on screen bro what's
wrong with you?"**

---

## YOU WERE RIGHT ALL THREE TIMES AND I KEPT FIXING THE WRONG THING

This morning I built a maximum range for every weapon and wrote this:

```js
function inMyRange(e){ return !!e && (e.edist||0) <= maxRange(myRange()); }
```

**And nothing in the game ever called it.** Search the whole combat file: two
hits. One is the definition. One is a comment. **Your gun's maximum range has
never been enforced, once, since the moment it was written.**

So you could always shoot anybody at any distance — exactly what you kept
telling me. And then I "fixed" it twice by moving spawn points further away,
which does absolutely nothing when the gun has no limit to be outside of.

## AND MY MEASUREMENTS WERE MEASURING THE THING NOBODY USES

I reported "0% in range at the bell" three separate times. That number was
**true and completely meaningless**, because it described a rule the game
ignores. I was testing my own opinion about how it works instead of how it
works.

**A measurement that does not touch the code path you touch is not evidence.**
That is the second time this week — the giants were the first. So this time I
drove the actual SHOOT button.

---

## RANGE IS NOT A NUMBER, IT IS A FILTER ON WHO YOU CAN FIGHT

Three functions decide the entire fight and not one of them knew range existed:

| | decides | now requires |
|---|---|---|
| `modePool()` | who I can shoot | **my** reach |
| `exposedToMe()` | who can shoot me right now | **his** reach |
| `posExposed()` | who could line me up | **his** reach |

Symmetric on purpose: my reach bounds my targets, his reach bounds his threat.
Everything downstream already reads these three, so wiring them here wires all
of it instead of bolting a check onto each caller and missing one.

**And a blocked shot explains itself.** The button reads OUT OF RANGE, and
pressing it tells you the only two numbers that matter: how far the nearest man
is, and how far this gun actually goes. A dead button is a bug to the person
holding the phone, however correct the rule behind it is.

**The red stays if you are being outranged.** A rifleman stops at his own
effective range and shoots you while your pistol says OUT OF RANGE. You are
being hit and you cannot answer. That is the moment this whole thing exists to
create, and the only solution is your feet.

## MEASURED BY PRESSING THE REAL BUTTON, 60 ARENAS PER GUN

| your gun | button says OUT OF RANGE | the shot actually happened on turn one |
|---|---|---|
| shotgun | 60/60 | **0/60** |
| pistol | 60/60 | **0/60** |
| SMG | 60/60 | **0/60** |
| rifle | 34/60 | 26/60 |

The rifle is the daylight case I flagged this morning: it reaches 44 tiles and
the arena is 32, so it can still open the fight. The arena has to grow again
before that closes.

---

## AND THE ACTION MUSIC

Separate bug, same reply. The combat frame's generic "wake the sound up" call
started the **fight loop** unconditionally — and that call runs on the panel's
first tap, on RUN, on a grenade, on anything that makes a noise. So combat's
music began the moment the frame was *touched*, fight or no fight. Warming the
frame at app open made it easier to hit.

**The overworld playlist was never the problem.** It already filters strictly to
the creepers. The fight theme was just playing over the top of everything,
unasked. It plays when there is a fight now, and nowhere else.

Tools: `bohemia_combat_range_actually_wired_patch.py`,
`bohemia_combat_no_action_music_without_action_patch.py`
Gate: `gates/combat_lab_gate.js`, 748 → 753 checks.

**WHERE TO SEE IT: the COMBAT tab.** Start a fight and press SHOOT. It should
refuse and tell you how far away they are.
