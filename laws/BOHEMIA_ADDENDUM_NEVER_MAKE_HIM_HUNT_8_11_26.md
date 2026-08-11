# BOHEMIA ADDENDUM — NEVER MAKE HIM HUNT (Paolo 8/11/26, LOCKED)

Paolo, verbatim:

> "Bro do work that u dont ask me to fucking hunt in the run bro there has to be a new
> rule bro you can't have me test shit out in the run app for real like unless you're
> gonna place me right in front of it every time like what a waste like the run app is
> oh my God bro I'm not hunting bro like how the fuck am I supposed to find what you
> want me to find so put a new rule somewhere never tell me to check something about
> out by checking the run app, bro like so bad"

---

## THE RULING

1. **NEVER ASK HIM TO GO FIND SOMETHING IN THE RUN.** A JUDGE THIS line may not be an
   instruction to reach the thing by playing. "RUN tab → play the block quest → open
   the phone" is the exact violation that earned this rule.
2. **PLACE HIM RIGHT IN FRONT OF IT, EVERY TIME.** If a turn wants his eyes on
   something, the turn ships a surface that OPENS ON THAT THING. Zero walking, zero
   triggering, zero navigating. It is already on screen when the page loads.
3. **IF IT NEEDS STEPS TO REACH, IT IS NOT SHIPPED FOR JUDGEMENT.** A thing he has to
   hunt for does not exist to him — the same logic as NAME THE TAB (7/28) and BOTTOM-UP
   (7/26), one step further: naming the tab is not enough if the tab makes him work.
4. **THE RUN IS FOR PLAYING, NOT FOR INSPECTING.** He plays the run when he wants to
   play. It is never the place a session sends him to verify a feature landed.

## WHY THIS COSTS SO MUCH WHEN IT IS BROKEN

The run is a whole game surface: a house, a block, a quest, a walk, a fight, a phone.
Asking him to traverse it to confirm one readout spends minutes of his attention on
navigation and returns nothing he wanted. And if he takes a wrong turn or the trigger
does not fire, he concludes the work is broken — so a hunting instruction converts good
work into a false negative. That is worse than not surfacing it at all.

The correct pattern already existed and was being used correctly on the same day:
`HOW LOUD YOU WERE` and `WHO YOU STIRRED UP` auto-run with nothing to tap. The failure
was routing him into the run for the third thing.

## WHAT A COMPLIANT SURFACE LOOKS LIKE

- A page in a hub tab, one tap from the hub.
- It RUNS ITSELF on load. No button is required to see the point.
- The thing being judged is above the fold, not below an explanation.
- If it needs real game data, the page produces it itself (or records a real run and
  renders the recording) rather than asking him to generate it by playing.

## WHAT IS STILL FINE

Asking him to **play** the run because he wants to play, or because the ask is
genuinely "does this FEEL right to walk around in" — that is the run doing its job.
The ban is on using the run as an INSPECTION ROUTE for a specific feature.

## THE GATE

`gates/no_hunting_gate.py`. Sweeps the handoff and the records a session writes for a
pointer that sends him into the run to check something, and fails on any instruction
that chains steps to reach a thing. A law without a machine gate is not enforced, and
this one is easy to break by accident in exactly the moment a turn is proudest of
itself.

---
*BOHEMIA — Never Make Him Hunt — 8.11.26*
*The link is the door and the tab is the room. This is the rule that says the thing has to be standing in the middle of the room when he walks in.*
