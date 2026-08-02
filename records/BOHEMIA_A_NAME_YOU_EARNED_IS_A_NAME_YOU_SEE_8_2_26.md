# A NAME YOU EARNED IS A NAME YOU SEE — 8/2/26, PEOPLE lane

Paolo's 7/31 ruling, in full:

> "you can personally ask them for their name and then the game will track that
> **so anytime you might see them in the future like their name will pop up**"

The **asking** half shipped 7/31 and is gated end to end. The **seeing** half had
never been built.

A name only ever appeared in two places: on the identity card, and on the one
action button. Both of those need you standing close enough to touch them. So you
could walk up to a neighbour, ask their name, take five steps, and they were
visually identical to every stranger in the valley. **Asking somebody their name
had no consequence you could see.**

---

## WHAT IT DOES NOW

The **first name** of anyone you have asked is painted over them while they are on
screen. Strangers get nothing, forever, until you ask.

### Why it does not become nameplate soup

That is the obvious risk, and a careless version of this would be worse than not
building it at all.

- **Only people you ASKED.** `nameOf()` returns null for a stranger *by law*, so a
  stranger can never get a label no matter what this code does. The label IS the
  difference between the people you bothered with and the people you did not.
- **The viewport is about four tiles either side of you**, so the most this can
  ever paint is the handful of bodies actually on screen. Capped at four,
  nearest-first, on top of that.
- **First name only.** You know somebody's first name. You do not read their full
  record off their forehead.
- **A name and nothing else.** No role, no mood, no timetable. A ROUTINE IS
  INVISIBLE INFORMATION is still the law and a name is not a routine.
  `invisible_schedule_gate` still 17/0.
- The run's own **gold** (`#e8b84a`), the colour the game already uses for YOURS,
  drawn last at integer positions with a dark ring so it reads over pale concrete
  and dark yard alike. No new colour enters the game.

### Research

Shadows of Doubt is the closest published shape: citizens are "Unknown Citizen"
until an identifier resolves them, and then they are named everywhere afterwards.
Paolo's version is stronger, because the identifier is a **conversation** rather
than a government database.

---

## THE GATE, ON THE REAL SURFACE, READING PAINTED PIXELS

- **C6a** nobody has a name over them before you ask
- **C27a** the name is on the WORLD, not just the card
- **C27b** and ONLY the one you asked
- **C27c** the gold really landed — as a **before/after delta**

C27c is the one worth explaining. The obvious version, "there are gold pixels on
screen", would have **passed on the front-door highlight alone**, which already
paints the same `#e8b84a`. True for the wrong reason. So it samples the same view
of the same street before and after the one thing changes.

### Mutations

| mutation | result |
|---|---|
| the label never draws | C27a, C27b, C27c red (gold 0 -> 0) |
| strangers get labels too | C6a red, C27c red (gold 67 -> 22) |

---

## TWO BUGS THIS CAUGHT IN MY OWN WORK

**1. The patch block declared the wrong undo.** This fence sits BEFORE its anchor
line, so the anchor is never inside the markers. Restoring it to the anchor text
re-emitted the anchor, and the next run refused with "anchor resolves 2 times,
not 1". The refusal was the tool working correctly. `undo` is `''` now, the same
shape as every other pure-insertion row.

**2. And my idempotence check had been fooled by it.** I ran the tool twice,
compared file hashes, saw them identical, and called it idempotent. The second run
had **refused to write**. *A check that a tool did nothing is not a check that the
tool is idempotent.* It now requires exit 0 on both runs, an unchanged file, AND
the anchor resolving exactly once.

---

## AND THE FRONT DOOR BROKE AGAIN, THE SAME WAY, WITHIN HOURS

`gates/front_door_gate.js` went red and named the cause in one line: **4 `<div>`
open vs 3 `</div>` close**. A lane updating the build stamp ate the tag that
closes the front splash for the **second time on 8/2**, nesting the whole app
inside the splash. Tapping the splash hid the game. It reached main both times.
(One commit on main that day even says so in its own subject line.)

The gate worked. But an alarm that rings twice in one day about the same tag is
telling you to remove the failure mode, not to keep listening:

**The closing tag now lives on its own line**, with a comment saying why. The
stamp line and the tag can no longer be touched by the same edit, so the thing
that keeps happening physically cannot happen.

### And the fix broke my own gate, which is the lesson

The comment I added *explaining* the missing tag contained words that looked like
tags, and the checker counted them. **It went red on prose while the document was
perfectly well formed.** That is exactly the mention-versus-use mistake Paolo
named on 8/1, made by the gate whose whole job is to read structure. It strips
comments before counting anything now, and the self-test no longer matches a
hard-coded string, so it survives the tag moving.

Gates: PEOPLE 146 -> **150**, RUN 126 (recovered from red), FRONT DOOR 8,
INVISIBLE SCHEDULE 17, RUN PEOPLE 45, FENCE ORPHAN 9.

## WHERE PAOLO CAN SEE IT

**RUN tab.** Walk up to a neighbour, tap the one button, tap "Ask their name".
Leave the conversation. Their name is now over their head, and nobody else on the
street has one.
