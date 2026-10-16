# GREEN MEANS SAFE, AND THE DAMAGE FACES WERE BEING THROWN AWAY

**8/12/26 [T22] — COMBAT lane.**

---

## 1. GREEN WAS A LIE, AND IT WAS HOLLOW BY CONSTRUCTION

> "even when I popped out and it was green, I still took damage, which is
> literally the opposite of popping out when it's green"

The old promise: a green pop only answers to threats that were **already
visible** when you committed.

Now read what GREEN actually means, from the button's own state machine:

| board state | button |
|---|---|
| nobody out at all | ENGAGE (not green) |
| two or more guns firing | red |
| one gun firing, or a crowd | amber |
| **guns are up, none firing yet** | **GREEN** |

**Green is the state where peekers exist and none have fired.** Those peekers
are, by definition, already visible when you commit — so the filter kept every
single one of them, and they are the *only* men green ever has.

**The protection removed nobody. It never once stopped a bullet.** The button
painted itself green, told you this was the moment you'd been waiting for, and
then let the exact men it was pointing at shoot you.

**Now: a green pop takes no return fire. None.** That's what the colour has been
promising since it was built, and it's the whole reward for reading the peek
cycle.

**And green can't lie about a blade.** Return fire is what *popping* costs you —
a knife swings whether you popped or not, so nulling the volley can't honestly
cover it. Instead the button stops claiming a lull that isn't one: a blade inside
its own reach now reads BLADE ON YOU and is never green.

## 2. A BUG OF MINE, FOUND WHILE HUNTING THAT ONE

My out-of-range change yesterday cleared `G._green` — **a name that exists
nowhere else in the file.** The real flag is `G._greenNow`, and it's what decides
whether the safety promise applies. So every out-of-range turn left the
*previous* turn's verdict standing, and the lock could be granted or refused on
stale data. A typo'd assignment is invisible to a check that never looks for the
right name.

## 3. THE TEN DAMAGE FACES WERE DECODED AND DROPPED ON THE FLOOR

> "when my health was getting reduced, my character's face didn't look like it
> was taking damage the way it was supposed to"

The alpha builds ten damage frames and sends them. The combat frame decodes them
into `SPR._dmgRaw`.

**`_dmgRaw` is assigned once and read nowhere.** The thing that draws your face
reads `SPR.portraits.dmg`, which nothing ever filled. Every frame arrived, was
decoded, and was thrown away.

**That is the same bug as the gun range, in the art pipe** — built, sent,
decoded, never connected. Second time this week. They land now.

---

## WHAT I DID NOT BUILD, AND WHY

You raised carrying two guns / a swap to secondary, and you're right that it's
the interesting version of what you did manually in settings. **I did not build
it in this turn.** Three of today's failures came from stacking a feature on top
of unverified ground, and this turn already carries a lie in the safety UI and a
dead art pipe. Weapon swap is the next thing, on a clean base.

Tool: `tools/bohemia_combat_green_means_safe_patch.py`
Gate: `gates/combat_lab_gate.js`, 761 → 764 checks.

**WHERE TO SEE IT: the COMBAT tab.** Wait for green, pop, and take nothing. And
watch your own face in the button as your health drops.
