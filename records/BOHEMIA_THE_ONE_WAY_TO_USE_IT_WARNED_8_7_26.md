# BOHEMIA — THE ONE WAY TO USE IT WARNED AT YOU
### 8.7.26 — FACTIONS lane. A second way authored content dies, and it is nastier than the first: the mechanism works, and the checker tells the author they got it wrong.

---

## WHAT I WAS LOOKING FOR, AND WHAT I ACTUALLY FOUND

Yesterday's machine sorts every `@DO` verb into WORLD / QUEST-ONLY / INERT. Ten came
back QUEST-ONLY, and I went looking for which of those were dead in substance.

`@DO bond` was the suspect: **44 authored rulings**, the second most-written faction
verb in the corpus after `faction` itself, and the corpus gates on it **zero times**.

I wrote, in this record's first draft, that bonds were *structurally unreadable* —
that no gate key resolved to `s.bonds`. **That was wrong, and reading the code is what
caught it.** The runtime has a numeric branch:

```js
if((m=/^(\w+)\s*(>=|<=|==|=|>|<)\s*(-?\d+)$/.exec(expr))){
  ...
  else if(key in s.bonds)   cur=s.bonds[key];
  else if(key in s.faction) cur=s.faction[key];
```

So `[gate: grower>=10]` genuinely works. Bonds were wired the whole time.

## THE REAL DEFECT

`bq.js` **warned at you for using it.**

```js
if (o.gateKey!=='none' && GATE_KEYS.indexOf(o.gateKey)<0)
  W('UNKNOWN_GATE','gate key "'+o.gateKey+'" not in the vocabulary');
```

`GATE_KEYS` is the `key:value` vocabulary — `flag:`, `knows:`, `role:`, `has:`. A
numeric gate's key is a **bond target or a faction id**, which was never supposed to
be in that list. So the validator flagged the one correct way to use 44 authored
rulings as a mistake.

**That is a worse failure than the thing it looks like.** An unwired feature is
invisible; a feature whose only correct use is reported as an error actively teaches
the author not to use it. The corpus gating on bonds zero times is exactly what you
would expect from that.

Paolo 8/1, twice over: **a checker that cannot tell a use from an error is the broken
one**, and **you fix the ruler, never the target.**

## THE FIX

A numeric gate key is legal when it is `stage`, `gen`, or a **declared `@ROLE` of that
quest**. Measured before writing it: **all 44 bond targets in the corpus are declared
roles, 0 exceptions.** Faction ids stay out of it deliberately — those are canon
content this parser does not get to enumerate, so a faction-keyed numeric gate is
still warned about rather than silently blessed.

Machine-locked in `authored_unread_gate.py`, and both halves are measured, because a
validator that stops complaining about something still broken is worse than the
warning:

```
a numeric gate on a DECLARED @ROLE no longer warns .......... PASS
a genuinely unknown gate key STILL warns .................... PASS   (ruler fixed, not switched off)
the bond gate really GATES: hidden before, open after +18 ... PASS
```

## THE BIGGER MEASUREMENT, WHICH IS HIS CALL AND NOT MINE

While counting gates I measured the whole corpus:

```
391  [gate: none]
  2  knows
  2  flag
  0  has / role / faction / gen / bond
---
395 gates total, 4 of them conditional
```

**Three hundred and ninety-one of 395 dialogue options are ungated.** Meanwhile the
corpus authors 142 pieces of recorded state — 62 `learn`, 36 `set_flag`, 44 `bond` —
and conditions on four of them.

I am **not** calling that a defect, and I have not touched a quest file. It reads two
ways and only he can say which:

1. the state is being recorded for cross-quest continuity that has not been built yet
   (in which case it is correct and early), or
2. the branching machinery exists and the writing has not reached for it — in which
   case every playthrough offers the same options no matter what you did.

The validator warning is a real cause either way, and it is now gone. What the corpus
does with that is authoring, which is his.

## THE TRANSFERABLE LESSON

Yesterday's disease was **authored and unread**. This is its sibling: **authored,
readable, and discouraged.** Both produce the same symptom — a number he wrote that
changes nothing — and only one of them is visible as a missing wire. The other one
looks like a working validator doing its job.

Worth remembering that the first draft of this record confidently stated the opposite
of the truth, and the only thing that caught it was opening the file instead of
trusting the sweep's verdict.

---
*BOHEMIA — The One Way To Use It Warned At You — 8.7.26*
*An unwired feature is invisible. A feature whose only correct use is flagged as a mistake teaches the author to stop trying.*
