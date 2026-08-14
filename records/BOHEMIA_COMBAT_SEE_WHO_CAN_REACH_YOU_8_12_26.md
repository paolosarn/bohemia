# YOU CAN SEE WHO CAN REACH YOU

**8/12/26 — COMBAT lane. Answers Paolo: "I think we to be able to see the range
of all the Enemies weapons would be really nice just to know when."**

---

## THE WHOLE RANGE SYSTEM WAS INVISIBLE

Every gun has had a maximum range on both sides since I built it. A goon's
pistol reaches 8 tiles after dark, a SEC-BOT's rifle 22, a sniper 32. **Those
numbers decide the entire fight and nothing on screen has ever said one of
them.**

So the fight kept doing this to you: stand somewhere, take fire, and have no way
to tell whether one man or three could touch you, whether the man you were
looking at could even reach, or whether one more step walked you into a second
gun. When you said you were getting shot and couldn't answer — the reason that
felt arbitrary is that the board never showed the geometry it was using.

## THE MODEL IS INTO THE BREACH

Its central design is that enemy intent is **completely transparent before the
player commits** — every attack telegraphed, so a turn is a puzzle you can solve
instead of a guess you get punished for. XCOM does the same job with plain
iconography.

The shared lesson: **the information goes on the board, next to the thing it is
about, before the decision.** Not in a menu, not in a log line after the damage.

## WHAT SHIPS: ONE MARK PER MAN, ONE QUESTION

**Can this one reach me, right now.**

- **Solid red pip** — he can shoot you where you stand
- **Hollow pip** — he can't; he's still walking
- It sits over his head, on him, not in a corner of the screen

**Eight range rings would be noise, so there are none.** Six overlapping circles
on a phone is a worse board, not an informed one. The reach bubble is drawn for
**one** man — the one you've selected or are aiming at — so you can ask what
*his* reach looks like without every other man shouting.

**And I sized it wrong the first time and caught it by looking.** The first cut
scaled the pip off the body sprite and came out about 2 pixels on the zoomed-out
board — drawn, and completely unreadable, which is the same as not shipping it.
It's sized off the tile pitch now with a dark halo so it reads on pale sand and
on dark asphalt.

---

## ONE THING WORTH KNOWING ABOUT TODAY

Twice today my working copy silently reset to an old snapshot of the repo, and
the first time I told you main had been wiped. It hadn't — the container's clone
was stale and my fetches were being killed by a timeout. All the combat work is
on main and always was. I now check the remote directly instead of trusting the
local copy.

Tool: `tools/bohemia_combat_see_who_can_reach_you_patch.py`
Gate: `gates/combat_lab_gate.js`, 767 → 771 checks.

**WHERE TO SEE IT: the COMBAT tab.** Red dot over a man means he can hit you
where you're standing. Hollow means not yet.

---

Sources:
- [Into the Breach & Enemy Intentions](https://atomicbobomb.home.blog/2020/05/17/into-the-breach-enemy-intentions/)
- [Tactical combat UI (XCOM 2)](https://xcom.fandom.com/wiki/Tactical_combat_UI_(XCOM_2))
- [UI and UX in Tactical Games: Three Considerations](https://www.linkedin.com/pulse/ui-ux-tactical-games-three-considerations-ajai-raj)
