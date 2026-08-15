# THE DAMAGE FACES, FOR REAL. AND HIS RANGE RULING.

**8/15/26 [T17] — COMBAT lane.**

---

## 1. THE FACE. THIRD REPORT. THE BUG WAS MY LAST FIX.

I traced it end to end this time instead of reading strings:

- the parent **builds** ten damage frames — verified, 10 returned
- the parent **sends** them — verified on the wire, `portraits {you, dying, dmg:[10]}`
- the frame **receives** them — and `SPR.portraits` came back **null**

So the receiver was eating them. And the receiver was mine:

```js
if(...dmg...){ SPR.portraits.dmg = ...map(...); }     // <- my fix, last turn
SPR.portraits = {you:..., dying:...};                  // <- ONE LINE LATER
```

**The very next statement replaced the whole object with a fresh literal that
has no `dmg`.** I decoded ten frames, threw them away one line later, and
shipped that as the fix. You've reported this three times and every report was
right.

**And the gate stayed green through all of it** because it asserted the
assignment *exists* — which it did. A string check cannot see the next statement
undoing it. Same class as a function that's defined and never called: present,
and dead. The gate now checks the shape that **survives**: one literal, built
once, carrying every face, with only one place in the file allowed to build it.

**Verified live:** `SPR.portraits` now returns `["you","dying","dmg"]`.

*(One honest note: my first live probe still read null and nearly sent me
chasing a second cause — it was sampling before the message landed. The second
probe, listening properly, confirmed it.)*

## 2. YOUR RANGE RULING

> "whatever the characters maximum range is for right now it just a couple tiles
> bigger than all the Enemies... I want to see more movement."

Done — and it's the movement you keep asking for, mechanically. **If you outreach
every gun on the field, they have to come to you**, and men walking in is exactly
the movement you say you never see. Standing still stops being a way to avoid
the fight and becomes the thing that starts it.

It's a **floor, never a cap** — a rifle that already outreaches everyone keeps
its own number — and it reads the men actually in *this* fight, so it's right
whatever you're carrying and whoever turned up. It also still scales with the
dark, so your edge doesn't quietly become an exemption from night.

**You marked it temporary in the same breath** ("maybe we can work on that in the
perk system... they level up, they get longer range capability"), so it's one
constant with your words on it, waiting to become earned range instead of
granted range.

## 3. PARKED ON PURPOSE

- **Chain shots after a killshot, gun-dependent** — real idea, not built. It
  needs the face and the range settled first.
- **The Prince of Persia rewind** — you said you're taking it to the coordinator
  Tuesday. Not mine to start.

Tool: `tools/bohemia_combat_faces_survive_and_his_range_ruling_patch.py`
Gate: `gates/combat_lab_gate.js`, 776 → 777 checks.

**WHERE TO SEE IT: the COMBAT tab.**
