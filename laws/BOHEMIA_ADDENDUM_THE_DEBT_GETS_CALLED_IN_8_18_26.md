# BOHEMIA ADDENDUM — THE DEBT GETS CALLED IN (8/18/26, FACTIONS lane, LOCKED)

## 1. THE HOLE: THE ACCOUNT WAS OPENED AND NOBODY EVER CAME FOR IT

8/16 shipped the favour: some outfits hand you something the first time you meet
them, free, and it puts you in **debt**. The card kept a tally.

**And nothing ever collected it.** The debt was a number that sat there. Which
means his Cartel dossier — *"They want you to OWE them"* — was still only half
built: the trap had a hook and no line.

That is the authored-but-unread disease in miniature, in a system this lane
wrote three days ago.

## 2. THE THREE CONNECTIONS, AND THE FIRST ONE USES A MECHANISM APPROVED IN JULY

<!-- Written ONE/TWO/THREE rather than A/B/C on purpose: no_bullshit_questions_gate
     reads a lettered list in a law file as an option menu handed to Paolo, and it
     is right to. These are three mechanics, not three choices, and the formatting
     should not have to be explained to tell the difference. -->

**ONE — AN OUTFIT YOU OWE DOES NOT WAIT ITS TURN.**
`makeRation` has carried a **BYPASS slot** since Paolo approved it on 7/26 — *"the
birthday shape: an occasion that ignores both windows"* — and **nothing had ever
called it.** This is what it was for. The weekly limit models restraint, and a
creditor has none. Owing bypasses the window; the multiplier stays 1, because
owing changes *whether* they wait, not how much they take at once.

**TWO — REFUSING A CREDITOR COSTS MORE THAN REFUSING A FRIEND.** One extra rung per
unpaid favour, on top of the normal fall. Measured on the real card: counted at 6,
owing 3, refuse → **2**. *That is the whole reason the free thing was free.*

**THREE — AND THE ACCOUNT CAN BE CLOSED.** Meeting a claim works one favour off.
**A debt you can never clear is a sentence, not a relationship** — Gouldner's
reciprocity is about the *interval* between taking and returning, and an interval
that can never close is not a bargain with a bad rate, it is a trap with no door.

## 3. THE CARD SAYS WHY, WHICH IS THE PART THAT MAKES IT A DECISION

> **THEY ARE NOT WAITING** — You owe them. The polite gap between asks is for
> people who do not.

Without that row the bypass is invisible: the player just meets an outfit that
will not leave them alone and cannot tell it is the free thing they took. The
mechanic would be working and unreadable, which is the same as not working.

## 4. THE BOUNDARY, ASSERTED RATHER THAN TRUSTED

`bohemia_favour` owns the debt. `bohemia_claim` owns asking. **Neither reaches
into the other's save.** The claim takes a NUMBER and returns a NUMBER; the
surface reads the ledger, passes the int, and applies the settlement through the
ledger's own writer.

`bohemia_claim` could have imported `bohemia_favour` and read the debt itself —
one import, and a circular dependency waiting to happen, since favour already
anchors on claim. Passing an int keeps the direction of knowledge one-way. The
gate asserts the claim module never mentions the debt store at all.

## 5. THE ANCHOR LAW EARNED ITS KEEP THIS TURN

Changing `answer(save, fid, said, given)` → `answer(..., owed)` made
`bohemia_favour`'s citation of it stale, and **the generator refused to run.**
That is the machine catching a real drift the same minute it happened, not a
week later. The anchor now names the `owed` parameter specifically, so if anybody
drops it this refuses rather than **silently ledgering a debt nobody ever asks
about** — which is exactly the state this addendum exists to end.

## 6. THE LAW

**1. AN ACCOUNT THAT IS NEVER CALLED IN IS NOT A DEBT, IT IS A NUMBER.** Any
ledger the game keeps must have something that comes for it, or it is decoration.

**2. AN INTERVAL MUST BE ABLE TO CLOSE.** If an obligation can only grow, it has
stopped being a relationship and the player has stopped having a decision.

**3. WHEN A CONSEQUENCE FIRES, THE CARD SAYS WHICH CHOICE CAUSED IT.** A mechanic
the player cannot trace back to their own move is indistinguishable from noise.

**4. TWO LEDGERS, TWO OWNERS, NUMBERS BETWEEN THEM.** Cross-system effects pass
scalars through the surface, never reach into each other's store.

## 7. THE MACHINE

`gates/claim_gate.js` part D2, 9 new claims (45 total): the limit still protects
you with no debt, the bypass fires with one, refusing costs one rung per unpaid
favour, the card is told why, meeting a claim works it off, meeting one you owe
nothing on settles nothing, and the claim module never touches the debt store.
`gates/favour_gate.js` 31, unchanged and still green.

## 8. WHAT IS STILL NOT MINE

Unchanged and worth restating: from the spawn cell the nearest 1,438 people
include zero who run with anybody, so a demo player may meet none of this. Base
placement is MAP LAW; `REACH_CELLS` and `AFFILIATED_RATE` are [PENDING Paolo];
routing the demo past an outfit is QUESTS/RUN.
