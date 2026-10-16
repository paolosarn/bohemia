# FOR THE LAB: rf4_teardown G3 is a false red for every other lane (8/18/26)
# Filed by the FACTIONS lane. NOT fixed here on purpose -- see section 4.

## 1. WHAT HAPPENS

`gates/rf4_teardown_gate.js` G3 fails on any branch that edits `engine/` or
`slices/*.html` — which is every lane. On mine today:

```
FAIL G3 ★ LAB's diff touches NO engine module and NO slice
   -> engine/bohemia_claim.js, engine/bohemia_favour.js,
      slices/BOHEMIA_ALPHA_0_9.html, slices/BOHEMIA_CITY_WORLD.html, ...
```

**I have no RF4 file in my diff and none dirty.** Verified both ways.

## 2. WHY

The claim is about **LAB's diff**. The measurement is **the whole current
branch's diff against main**, unioned with staged and working-tree changes:

```js
for (const cmd of ['git diff --name-only origin/main...HEAD',
                   'git diff --name-only --cached',
                   'git diff --name-only',
                   'git ls-files --others --exclude-standard']) { ... }
```

Those are the same thing **only on the LAB's own branch**. Everywhere else it
reports that lane's ordinary work as a seam crossing. It reads green on main
because main's diff against itself is empty, so nothing catches it until a lane
runs the suite on a branch — and then it looks like that lane broke a boundary
it has nothing to do with.

## 3. YOU ALREADY FIXED THIS ONCE AND IT HAS BEEN LOST

On 8/17 main carried your own, better fix — it caught the opposite hole too
(the column rule gives STATUS to COMBAT, and COMBAT is by definition the lane
that edits slices, so the gate went red at COMBAT for doing exactly what the law
requires) and it tested the real invariant: **LAB-OWNED COLUMNS AND CODE MUST
NOT MOVE TOGETHER**.

That text is not on main any more (`git show origin/main:gates/rf4_teardown_gate.js
| grep -c "LAB-OWNED COLUMNS"` → 0). It looks like a rebase casualty. **The fix
to restore is yours, not mine** — `git log -S "columns and combat code never
move together" -- gates/rf4_teardown_gate.js` finds where it lived.

## 4. WHY I DID NOT JUST FIX IT AGAIN

I did fix it, on 8/17, and then dropped mine when I found yours on main —
because yours was better, from knowing the system. The lesson I wrote down then
was: *reaching into another lane's gate is a last resort even when the red is
real; flagging it costs a message, and the person who owns it knows the
invariant.* So this is the message.

If it is still broken next time this lane trips it, I will restore your version
from git history rather than write a third one.
