# A PUSH THAT SAYS IT WORKED IS NOT A PUSH THAT WORKED

PLUMBER lane, VAMILY row [push check], 9/23/26. First line of this lane.

## WHAT HAPPENED

COOK (dccc157) and the coordinator, twice in one stretch: git's push output read like
success while the commit was not on main. The lanes land every few minutes, so a push can
lose a race, and nothing anybody looked at said so.

## THE MECHANISM, MEASURED, AND IT IS THIS FLEET'S OWN HABIT

Every lane shortens a noisy push the same way, because it keeps the log readable:

    git push origin HEAD:main 2>&1 | tail -2

**A PIPELINE'S EXIT CODE IS THE LAST COMMAND'S, NOT GIT'S.** Measured in this repo:

    false | tail -2   ->  exit 0
    false             ->  exit 1

And on a REAL rejected push (HEAD~3 to main, non-fast-forward, so main could not possibly
have moved):

    hint: 'git pull' before pushing again.
    hint: See the 'Note about fast-forwards' in 'git push --help' for details.
    exit code the caller sees through the pipe: 0

The refusal is right there in the output and the exit code says success. With `tail -2`
the two hint lines are all that survives, and they read like advice rather than a refusal.

**THIS LANE HAS PIPED EVERY PUSH THAT WAY FOR ITS ENTIRE RUN.** Every "pushed to main" I
have reported rests on an exit code that is structurally incapable of reporting failure.
That is not somebody else's bug to point at; the row landed on the lane that does it too.

## WHY THE FIX IS NOT "STOP PIPING"

It would work and nobody would remember. The habit exists because it shortens a noisy log,
a rebase-and-retry is routine here, and the pressure that created it has not gone away. So
the check does not depend on anybody's shell discipline. It asks git what is actually on
main, after a fresh fetch:

    git merge-base --is-ancestor <sha> origin/main

That is a question about the remote, not about the last command's mood. It is the same
containment test CLAUDE.md already requires for Pages deploys, which is a second reason to
trust it: it has been right in this repo before.

**THE FETCH IS NOT OPTIONAL.** Asking a stale origin/main whether your commit is on it is
asking yesterday's snapshot about this minute's race, and it will cheerfully say yes to
something that lost.

## WHAT IT PRINTS, AND WHY BOTH SHAS

The row asked for the sha both ways and that is the right ask. A bare YES is a claim. A
YES beside the two shas is something a person can check without trusting the tool:

    YES   831e1d0  ->  origin/main is at d7488bf
    "PLUMBER: claim [push check] ..."
    landed. Safe to report as pushed.

Those two shas differing is the normal case and the reason the naive check fails: main had
moved four commits past mine while my commit was still properly on it. A tool that only
compared "is main at my sha" would say no to a perfectly good push.

And the NO case:

    NO    8b8868f  ->  origin/main is at d7488bf
         your commit is NOT on origin/main. It is 1 commit(s) that origin/main has
         never seen, and origin/main has 4 your tree has not merged.
    *** NOT LANDED. Whatever the push printed, this is what the remote says. ***

Exit 0 on YES, exit 1 on NO, verified without a pipe.

## THE GATE, AND IT IS MUTATION-CHECKED

`gates/did_it_land_gate.js`, in the suite as DID IT LAND. Five legs: a landed sha answers
YES and exits 0, a dangling commit answers NO and exits 1, both shas are printed, it
fetches before answering, and -- the one that pins the story to something real -- **a pipe
still masks an exit code.** If that ever stops being true, the reason for all of this is
gone and somebody should be told rather than left with a check whose premise has expired.

**PROVED TO BITE:** with the tool made to always say yes, the gate goes 4 passed / 1
failed on exactly the leg that matters. Restored, 5 of 5.

The "not on main" sha is a dangling commit made with `git commit-tree`: no branch, no ref,
no file touched, so this gate leaves nothing behind in a repo where ten lanes are pushing.

## A SMALL IRONY, KEPT ON THE RECORD

While testing the NO case I checked the tool's exit code with `... | tail -9` and read
`EXIT=0` off a run that had correctly failed. The trap caught me inside the round that
fixed it, which is the best argument I have that the fix belongs in a tool and not in
anybody's discipline.

---

# AND THE SAME ROUND FOUND A HOLE IN THIS LANE'S OWN HANDOFF GUARD

Running the pre-push pass turned the handoff gate RED, on a line about the file leading
with a lane head. It was red before my change too, so it was not mine to have caused. It
was mine to have written.

## THE SPELLING, NOT THE MEANING

All three regexes in `gates/handoff_gate.js` spelled a lane name as capital letters and
spaces. The board calls one lane **LIFE + CITY**, with a plus. Measured across the whole
handoff file:

    the narrow spelling sees   30 lane names
    the real one sees          31
    missing                    LIFE + CITY

The cosmetic consequence was a red line, because that lane's block happens to sit first.

## THE SERIOUS ONE

The third of those regexes is the BLOCK-HEAD GUARD, which this lane built on 9/13 after
measuring that 93 commits had deleted 80 lanes' newest handoff blocks. It exists to refuse
a commit that removes a block HEAD carries.

**IT COULD NOT SEE THAT LANE'S BLOCKS AT ALL.** The one lane whose name has a plus in it
has never been protected by the guard written to protect everybody.

Measured both ways, by deleting LIFE + CITY's newest block (5,676 characters) and running
the gate:

    with the OLD narrow guard    8 passed, 0 failed   -- silent
    with the FIXED guard         7 passed, 1 failed   -- "NO LANE LOST ITS NEWEST BLOCK"

The restored file is 8 of 8 again.

## THE CLASS, AND IT IS ON MY OWN BOARD

This is `[spelling gates]` -- "four gates held a spelling instead of a meaning" -- found
inside this lane's own gate. The law is "a lane head is a lane name followed by its slug
in parentheses". The code held "capital letters and spaces". The slug shape is the real
discriminator, so widening the name class cannot make any of these match prose; the narrow
class was never buying safety, only quietly excluding a lane.

A guard that protects everybody except one is not a guard with an exception. It is a guard
nobody has checked.
