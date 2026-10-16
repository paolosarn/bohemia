# THE CANCELLED PAGES RUNS ARE NOT A PROBLEM (8/21/26)

Measured over the last 30 `pages` runs:

```
success 23   cancelled 4   failure 2   queued 1
completed 29, success 23 = 79%
```

That looks alarming next to the 8/6 amendment, which reads as though
`cancel-in-progress: false` **stopped** cancellations. It did not, and it was
never supposed to. **It made them harmless, which is a different thing.**

## WHAT THE SETTING ACTUALLY DOES

`concurrency: { group: pages, cancel-in-progress: false }` is in
`.github/workflows/pages.yml` and is correct. It protects the **running**
deploy — a new push can no longer kill a build in flight, which is the deadlock
the 8/6 note diagnosed (five cancelled in a row, over an hour, zero successes).

But GitHub's concurrency keeps **only the newest pending run**. When the lanes
push every few minutes, an older *pending* run is superseded and reports
`cancelled`. **Nothing is lost by that**, because the newer run deploys the newer
`main`, and `main` contains everything the superseded one would have published.

## THE TEST THAT MATTERS, AND IT IS ALREADY THE LAW

Not *"did my run succeed"* but **"is my sha contained in a run that succeeded"**:

```
git merge-base --is-ancestor <my-sha> <deployed-sha>
```

Worked example from today: run `78dedf20` on my own commit reported
**failure** — with **zero failed jobs inside it**, which is the tell for a
superseded deploy rather than a broken build. The content shipped anyway, in
`7956303a`, a later run whose sha contains mine.

> **A RUN'S OWN CONCLUSION IS NOT THE QUESTION.** Reading it as one sends you
> chasing a build that was correctly discarded, and the ONE-LINK law means the
> only thing that matters is whether the link serves your bytes.

## WHEN IT WOULD ACTUALLY BE A PROBLEM

- A run failing **with a failed job in it** — that is a real build break.
- The newest run failing repeatedly, so nothing recent ever lands.
- `pages_publish_gate.js` going red — the publish list and the workflow's copy
  list have drifted apart.

None of those are true today.
