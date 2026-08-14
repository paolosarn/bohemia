# THE DEAD BUTTON NEVER NAMED THE WAY OUT

**8/14/26 — COMBAT lane. Paolo: "I tried to shoot in. I'm already done getting
shot at not letting me shoot. What's wrong with that? What's going on, bro?"**

---

## MY FIRST DIAGNOSIS WAS WRONG AND MY OWN MEASUREMENT KILLED IT

I was sure the action button was routing you into a free enemy volley without
firing. I built the fix, then measured it: **0 out of 3,282 turns.** It doesn't
happen. So I did not ship that as the answer.

(The structural guard stayed anyway — the shoot-first law is now enforced by
asking *"do I have a shot"* instead of by four separate branches each checking
exposure. It is a guarantee, not a fix, and I am labelling it as one.)

## THE REAL ONE, MEASURED OVER 2,100 TURNS

| | |
|---|---|
| turns you are OUT OF RANGE | 214 (**10%**) |
| of those, **also being shot at** | 150 (**70%**) — helpless turns |
| of those, where **your other gun would have reached** | **150 — 100%** |
| damage taken while unable to answer | 630 |

**In every single helpless turn, the answer was already in your pocket.** You
are carrying a second gun that reaches. The button said OUT OF RANGE and
stopped.

That is what "not letting me shoot" is. **Not a rule bug — a dead end with a
silent exit.** A button that states a fact you can already feel is not
information.

## THE FIX

If the gun in your other hand reaches somebody, the button says **which gun** —
"SWAP TO RIFLE" instead of "OUT OF RANGE". That's the move, and it is one tap
away on the thumb row your hand is already on.

---

## WHAT THIS TURN ACTUALLY TAUGHT ME

I have now "fixed" this area four times — v141, v146, v147, and this. Each time I
patched the symptom I could see. The thing I should have done every time is what
finally worked here: **measure the state he is describing before deciding what
causes it.** My first guess today was confident, specific, well-argued, and
worth zero.

Tool: `tools/bohemia_combat_if_you_have_a_target_you_shoot_patch.py`
Gate: `gates/combat_lab_gate.js`, 774 → 776 checks.

**WHERE TO SEE IT: the COMBAT tab.** When you're outranged, the action button now
tells you which gun to switch to instead of just refusing.
