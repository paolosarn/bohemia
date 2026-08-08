# THE CHECKOUT LIES, TWICE IN ONE SESSION, AND NOTHING IN THE REPO CHECKS IT

8/7, CHARACTER lane. FLEET finding. Not about hair, not about art, and it will hit
whoever reads this next exactly as hard as it hit me.

---------------------------------------------------------------------------
## WHAT HAPPENS

**The working directory silently reverts to an old snapshot mid-session, while
GitHub keeps everything you pushed.** Twice today, both times to the same commit
`c5d4dc6`, which was ~530 commits behind main.

Git gives you NO error when this happens. `git status` says clean. `git log` shows
a plausible history. Every file is there. The only thing wrong is that it is a
different repository than the one you shipped to twenty minutes ago.

---------------------------------------------------------------------------
## NEAR MISS 1 — I DID A WHOLE JOB TWICE, AND THE FIRST ONE WOULD HAVE
## DELETED 547 COMMITS

I started the pixel-snap work without checking the base. Patch, audit, gate,
mutation test, a full green suite — all of it against an alpha that was missing
**4,323 lines** of other lanes' work.

    git diff --stat origin/main HEAD -- slices/BOHEMIA_ALPHA_0_9.html
    1 file changed, 253 insertions(+), 4323 deletions(-)

Caught it before any push, only because I ran that diff out of habit. Pushing
would have reverted 547 commits of five other lanes' work in one shot, and every
gate had been GREEN on it, because the gates measure the tree they are handed.

**A GREEN SUITE PROVES NOTHING ABOUT WHICH TREE YOU ARE STANDING IN.**

The redo is where the real border-box finding actually came from — the stale tree
still had the pre-7/29 sizes, so the bug I eventually shipped was invisible on it.
The second pass paid for itself, but that was luck, not method.

---------------------------------------------------------------------------
## NEAR MISS 2 — IT NEARLY MADE ME RETRACT A TRUE FINDING

After shipping, the tree reverted AGAIN, this time without me touching anything.
I went to investigate a claim I had already shipped: that running the gate suite
leaves `records/target/BOTTOMLEFT.png` modified, 503972 -> 503962 bytes, on a
CBB-frozen byte-locked target screen.

On the reverted tree:

    git ls-files | grep -i BOTTOMLEFT      ->  nothing
    git log -- records/target/BOTTOMLEFT.png -> nothing
    ls records/target | wc -l              ->  14

So the file had "never been tracked", and I was one step from writing a
correction retracting a finding that was **completely correct**. On real main:

    records/target on main  ->  79 entries, BOTTOMLEFT.png among them

The stale tree did not just hide work. **It manufactured convincing evidence
that a true statement was false.** That is worse than losing commits, because a
retraction is written down and believed.

It also invalidated a whole test run: I had tested nine gates individually for
whether they dirty the tree and got "clean" on every one — on a tree where the
files they write do not exist. Those results were void and I nearly reported them.

---------------------------------------------------------------------------
## THE SECOND FAILURE UNDERNEATH IT: `git fetch` LIES QUIETLY TOO

    $ git ls-remote origin main
    aa7bf3c7...
    $ git rev-parse origin/main
    c5d4dc6          <- STALE, and no error anywhere

`git fetch origin main` was timing out on this ~500 MB repo and leaving the
remote-tracking ref untouched. `--depth=1` finally surfaced the real reason:

    error: cannot lock ref 'refs/remotes/origin/main': is at aa7bf3c7... but
    expected c5d4dc6...

The ref file on disk was ALREADY correct while `git rev-parse` kept answering
with the old value. So the check everybody reaches for — "am I behind
origin/main?" — can answer NO while being ~530 commits behind.

**THIS IS THE SAME BUG AS THE 'SIX ROLLBACKS' EARLIER IN THIS LANE**, which were
never rollbacks at all: they were `git fetch` failing (early EOF / invalid
index-pack) and leaving origin/main stale, so main looked like it had lost work.

---------------------------------------------------------------------------
## NEAR MISS 3 — THE OBVIOUS WORKAROUND MAKES IT WORSE, SILENTLY

When the full fetch kept timing out I reached for `git fetch --depth=1` to at
least get the sha. **That is the first thing anyone reaches for in exactly the
situation this document is about, and it grafts a shallow boundary onto the
clone.**

A shallow clone truncates history, so `merge-base` and `rev-list` answer from a
stump — and they answer *confidently*. My own fresh-base tool, on its first real
run, reported:

    *** STALE BASE: HEAD IS 2 COMMIT(S) BEHIND origin/main ***
    and 703 commit(s) ahead — you have work here that main does not.

HEAD was `aa7bf3c`, which had been origin/main a few minutes earlier. It was not
703 commits ahead of anything. `git rev-parse --is-shallow-repository` said
`true` and nothing else anywhere mentioned it.

**A WRONG ANCESTRY ANSWER IS WORSE THAN NO ANSWER**, because "703 ahead" reads as
"I have lots of unpushed work, better be careful with it" — which is precisely
the wrong instinct. The tool refuses to give an ancestry verdict on a shallow
clone now, and names `--depth=N` as the likely cause, because the person reading
that message is the person who just typed it.

Repair: `git fetch --unshallow origin`.

---------------------------------------------------------------------------
## THE CHECK, AND WHY IT HAS TO BE A REMOTE ONE

Every convenient check is computed from local refs, and local refs are the thing
that is lying. The only trustworthy source is the remote:

    git ls-remote origin main        # THE TRUTH, always a network round trip
    git rev-parse HEAD               # where you actually are
    git merge-base --is-ancestor <remote-sha> HEAD   # am I on top of it?

`tools/bohemia_fresh_base.py` does exactly that, repairs the stale ref with
`git fetch --force`, and prints a verdict a session cannot misread. Run it BEFORE
THE FIRST EDIT, not before the push.

**BEFORE THE FIRST EDIT** is the whole point. Checking at push time means you have
already done the work twice, which is what today cost. And the ONE GATE PASS PER
SHIP flow already says to branch from a fresh `origin/main` before starting — the
step exists, it just had no machine behind it and no way to know it had failed.

---------------------------------------------------------------------------
## AND IT ALREADY MADE ME PUBLISH ONE WRONG FINDING. RETRACTING IT HERE.

> ### *** THE RETRACTION BELOW IS ITSELF WRONG. UN-RETRACTED 8/7 EVENING. ***
>
> **The original finding was CORRECT.** `gates/bottomleft_gate.py` line 93 writes
> a playwright screenshot straight into `records/target/BOTTOMLEFT.png`, which is
> tracked AND published (the ART tab loads that folder, so `_config.yml` ships it).
> A screenshot is never byte-identical twice, so every suite run rewrites a 500 KB
> binary nobody authored.
>
> Proven twice over. The ART lane found it independently at `e47557d` with the file
> and line, and named three commits where it was already swept up (CITY at
> `1c50086`, theirs at `84d6a65` and `0f29534`). And I then ran the single gate
> and watched it happen:
>
>     md5 before  29b84b65
>     md5 after   4a017e5f
>     git status  M records/target/BOTTOMLEFT.png
>
> **WHY I RETRACTED A TRUE THING: I KILLED THE SUITE AT 110 GATES AND BOTTOM-LEFT
> IS REGISTERED AT LINE 645.** My "110 gates completed, nothing modified" never
> reached the gate that does it. A CANNOT-REPRODUCE FROM A RUN THAT NEVER REACHED
> THE THING IS NOT A REFUTATION, and I published it as one, in capitals, to every
> lane. The retraction was more confident than the claim it was retracting.
>
> The lesson I drew was also wrong in an instructive way. I reasoned "no gate or
> tool in the repo even mentions those paths, I grepped all three" — and that grep
> was real, but the path is BUILT at runtime from `path.join(process.argv[2],
> 'records','target','BOTTOMLEFT.png')`, so it does not exist as a string anywhere.
> **A grep for a path only finds paths somebody spelled out.**
>
> STILL UNPROVEN, and I am not re-asserting them: `BOHEMIA_BANK_LAW_INDEX.md` and
> `BOHEMIA_SUBURB_WALK_7_18_26.html`. One of the three was real; that does not make
> the other two real.
>
> NOT FIXED BY ME — it is the ART lane's gate, they have already flagged it, and
> the fix they name is the pattern `lab_gate.js` already uses (write proof shots to
> a temp dir, never into the tree). **`git add -A` after a suite run is not safe in
> this repo.**

The retraction as originally written, kept because being wrong twice in opposite
directions is the actual record:

In commit `fa7bda6` I told the whole fleet, in capitals, that **running the gate
suite dirties tracked files** — that it left `records/target/BOTTOMLEFT.png`
modified, 503972 -> 503962 bytes, on a CBB-frozen byte-locked target screen, plus
`records/BOHEMIA_BANK_LAW_INDEX.md` and `slices/BOHEMIA_SUBURB_WALK_7_18_26.html`.
I said a lane that runs the suite and does `git add -A` would ship a silently
regenerated target screen.

**I CANNOT REPRODUCE IT, AND I NOW THINK IT WAS THIS BUG WEARING A DIFFERENT
MASK.**

What I actually did to test it: started from a clean tree on a verified-correct
base, ran the suite, and watched `git diff --name-only` on a 4-second loop.

    110 gates completed
    tracked files modified: NONE

The observation that started it was real — a genuine `git diff --stat` and a
rebase that refused to start over changes I had not made. But **two files quietly
reverting to slightly older versions is exactly what a partial filesystem revert
looks like**, and this environment demonstrably does that. A 10-byte difference in
a PNG is an older copy of the file appearing, not a generator rewriting it. And no
gate or tool in the repo even mentions those paths — I grepped for all three and
found nothing that writes them.

**WHY THIS MATTERS MORE THAN BEING WRONG ONCE:** that claim sends other lanes
hunting for a gate bug that probably does not exist, and it casts doubt on a suite
they need to trust. A false alarm about the safety machinery is expensive.

**THE HONEST STATUS: UNPROVEN, PROBABLY MISATTRIBUTED.** If anyone sees tracked
files dirty after a suite run, check `python3 tools/bohemia_fresh_base.py` FIRST.
The answer is far more likely to be that the ground moved than that a gate wrote
to the repo.

*(Three self-inflicted false positives today, all the same shape: I spelled out a
dead graveyard token inside the sentence describing that exact trap; my tree-watch
flagged its own untracked file; then it flagged MY handoff edit as gate damage,
because I was editing the tree the suite was running in. A measurement taken in a
tree you are simultaneously changing is not a measurement.)*

---------------------------------------------------------------------------
## WHAT THIS DOES NOT FIX

It cannot stop the revert. It only makes the revert LOUD instead of silent.
If the tree flips mid-session — which it did today, after a successful ship —
nothing catches that until the next time you look. So:

**RE-CHECK AFTER ANY LONG-RUNNING STEP.** The full suite takes ~30 minutes here,
and 30 minutes is plenty of time for the ground to move under you. Both of today's
reverts landed either side of one.

**AND VERIFY SHIPS AGAINST GITHUB, NEVER AGAINST THE LOCAL CLONE.** When the tree
reverted after my push, the local clone said `fa7bda6` was not a valid object.
GitHub said it was in main's history, four commits back, with a successful Pages
deploy on it. GitHub was right. The clone was fiction.
