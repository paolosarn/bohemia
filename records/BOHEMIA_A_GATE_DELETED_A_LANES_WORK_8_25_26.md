# A GATE DELETED A LANE'S WORK, AND ITS OWN CLAIM IS WHAT CAUGHT IT
### 8/25/26, found from the COMBAT lane. Shared infrastructure, not a game system.

---

## WHAT HAPPENED

The V180 record was written, saved to `records/`, and not yet committed. The full
gate suite ran. When it finished, **the file was gone.**

It was not a crash, a bad path or a lost edit. `gates/tool_idempotent_gate.js`
deleted it, deliberately, as part of its cleanup:

```js
try { cp.execSync('git clean -qfd slices engine banks records', { cwd: ROOT }); } catch (_e) {}
```

`git clean -fd` on those four folders removes **every untracked file in them** —
not the files the gate's own tools just wrote, all of them. Any lane with a record
written and not yet committed, a freshly cooked bank, or a new slice on disk loses
it the moment anybody runs the suite.

---

## THE BUG IS THE EXACT DISEASE THE GATE EXISTS TO CATCH

That gate's whole purpose is catching tools that cannot tell their own output from
somebody else's work. Its own docstring says so, and its **tracked** half gets it
right — it takes a baseline of `git diff --numstat` first, subtracts it, and
restores only what a tool actually changed. There is even a comment explaining
why:

> *"A BASELINE, NOT A VETO. The tree's existing state is recorded first and
> subtracted, so pre-existing edits cancel out and only what a TOOL changes is
> attributed to it... it still restores anything a tool writes, so somebody
> else's work is never lost."*

**The untracked half never got the same treatment.** One line of blunt `git clean`
under a paragraph promising the opposite.

---

## AND T4 CAUGHT IT — CORRECTLY, AND FAR TOO LATE TO MATTER

The gate's fourth claim reads, verbatim:

> *"T4 the tree is as it was AFTER measuring too — nothing this gate ran survived
> it, and **nothing a lane had in flight was thrown away either**."*

That claim went **red**. It was true, it was well written, and it fired *after the
file was already deleted*. Worse, it landed inside a list of **22 failing gates**
in a suite run that also had 72 gates never finish, so there was nothing to
distinguish "a gate just ate your record" from twenty-one unrelated reds in other
lanes.

**A gate that detects the damage it itself did is still a gate that did the
damage.** Detection is not prevention, and a true claim buried in a list of 22 is
not a warning anybody reads.

---

## THE FIX

Do to the untracked half exactly what the tracked half already does: **take a
baseline and subtract it.**

```js
function untrackedNow() {
  return new Set(git('status --porcelain -uall').split('\n')
    .filter(l => l.startsWith('??'))
    .map(l => l.slice(3).trim().replace(/^"|"$/g, ''))
    .filter(Boolean));
}
const baseUntracked = untrackedNow();
...
for (const f of untrackedNow()) {
  if (baseUntracked.has(f)) continue;                        /* was already here: not ours to delete */
  if (!/^(slices|engine|banks|records)\//.test(f)) continue;  /* same four folders as before */
  try { fs.rmSync(path.join(ROOT, f), { force: true }); } catch (_e) {}
}
```

Same four folders, same cleanup of anything a tool wrote. What changes is that a
file which was **already there before the first tool ran** is not the gate's to
delete.

`-uall` matters: plain `git status --porcelain` collapses an untracked directory
into one line, so the set would miss the files inside it.

---

## AND THE CLAIM IS WORTH WHAT THE TEST IN FRONT OF IT IS WORTH

A new **T5** asserts the gate no longer eats files, and it does not assert it by
reading the source. It writes a real untracked sentinel into `records/` before the
first tool runs and checks it is still there afterwards. T5 is ordered **before**
T4 so the sentinel is still on disk when T4 compares against a baseline that
counts it; T5 deletes its own sentinel immediately after checking.

Verified on top of that with two sacrificial files — one in `records/`, one in
`slices/` — present across a full run of the gate. **Both survived.** Under the
old code both would have been deleted.

---

## WHAT THIS DOES NOT FIX

**T1 is still red, and it is not this.** `bohemia_city_hero_wire_patch.py` writes
+1/-1 on a second run, so it is not idempotent. Confirmed identical on a clean
checkout of `origin/main`, so it is pre-existing and belongs to the CITY lane, not
to this change. It is left exactly as found and named here so nobody has to
rediscover it.

---

## WHY A COMBAT SESSION TOUCHED A GATE IT DOES NOT OWN

ONE SYSTEM, ONE SESSION protects **game systems** so two lanes do not fight over
the same mechanic. This is not a game system — it is shared tooling that was
actively deleting other lanes' uncommitted files every time anybody ran the suite,
and the next lane to lose a record would have had no reason to suspect a gate.

The fix touches no engine, no slice, no combat constant, and no other lane's
content. It removes one destructive line and adds a baseline, a subtraction and a
test.

---

## THE SMALLER LESSON, WHICH IS THE SAME ONE AS ALWAYS

The tracked half of this gate had already learned the lesson and written it down
in a comment. The untracked half sat six lines below it and had not. **Half a file
can know something the other half does not**, and a paragraph describing careful
behaviour is not the same as code that behaves carefully.
