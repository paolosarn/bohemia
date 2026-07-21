# BOHEMIA — ADDENDUM: CLOUT LAW — RECKLESS BEATS QUIET
### 7.21.26 — Paolo locked the follower/clout math. Extends BOHEMIA_ADDENDUM_SOCIAL_FEED_QUEST_LOG_7_20_26.md (the quest log IS the social feed, total recall) by filling in the one thing that addendum left PENDING: what actually earns followers. Newest-date-wins.

---

## WHAT PAOLO LOCKED (his words, 7/21)
Asked directly: "does reckless/dangerous shit get more followers than quiet good deeds, yes or no?" — **"yes."**

Grounded the same session in real social media behavior: substance and virality are only loosely correlated in real life. A quiet good deed gets nothing. A reckless, dramatic, dangerous act blows up. Novelty and danger drive reach, not actual impact. This is now Bohemia's rule too.

## WHY THIS IS MORE THAN FLAVOR (the convergence, already in canon)
GDD v2 §currencies already says of CLOUT: "anyone with feed access can post, going viral accumulates clout, **the Amalgamation watches viral moments most carefully**." And the Amalgamation's threat logic (AMALGAMATION_THREAT_LOGIC, 7/1) already locks it as killing **near its own secret** — a proximity-based threat, not an omniscient one.

Put together: chasing clout is choosing exposure. A player who goes reckless for followers is, mechanically, the same player who is more visible to the thing that kills people near what it's hiding. The follower number is not just vanity — it is the character's PUBLIC FOOTPRINT, and going viral is a real strategic risk, not a free stat to farm. This was not designed as a twist; it falls straight out of two rulings that were already locked before this one.

## THE MECHANISM (built same day, engine/bohemia_loop.js + bohemia_quest_runtime.js)
- A quest's own **completing @STAGE line** can carry ONE hashtag from a four-step scale, using the .bq format's EXISTING #hashtag capability (no format change needed): `#quiet` `#notable` `#risky` `#reckless`. This is a per-quest AUTHORING decision (content, not mechanism) — the quest itself declares how dangerous its own outcome was.
- The runtime captures that tag verbatim on completion (`state.doneTags`) without knowing anything about followers — it stays UI/theme-agnostic per its own law.
- The ledger pipe carries the tag from the runtime → the choice-log effect → the feed post (`post.clout`) → the follower math.
- `Loop.defaultFollowerScore(post)` is now the REAL default (no longer an empty hook): it reads `post.clout` and returns a weighted value. `Loop.socialProfile(ctx)` uses this by default when no custom `scoreFn` is passed.
- Current weight table (`Loop.CLOUT_WEIGHTS`, tunable, ORDERING locked): `quiet:8, notable:25, risky:55, reckless:110`. An untagged completion scores `CLOUT_NEUTRAL:15` (between quiet and notable — a mild default so most content doesn't have to bother tagging itself, but doing so still matters).
- A FAILED quest still posts to the feed (total recall) and still scores by its tag — recklessness, not success, is what the follower math rewards, matching how virality actually works (a spectacular failure can go viral too).
- Fixed a real ordering bug caught while building this: a choice whose own `@DO set_stage` completed the quest in one step was firing the OUTCOME ledger event BEFORE the CHOICE event that caused it (an internal wrapper-recursion issue). Fixed at the root in the runtime so the ledger always records choice-then-outcome in the order they actually happened.
- New gate: **LOOP CLOUT** (18/18) proves the tag rides end-to-end, the ordering (reckless > risky > notable > quiet) holds, reckless is not just "a bit more" than quiet (>=3x by design), FAIL posts score correctly, and it survives save/reload.
- The phone demo now shows a visible CLOUT badge on every feed post (QUIET in muted green, NOTABLE neutral gray, RISKY in amber, RECKLESS in a flickering red-orange) next to the follower gain, so the mechanic is SEEN, not just felt in a number.

## LOCKED
- Reckless/dangerous deeds earn dramatically more followers than quiet good deeds. This is now the core incentive structure of the social/quest loop, not a placeholder.
- The ordering `reckless > risky > notable > quiet` is canon. The exact numeric weights remain tunable (Paolo's call to retune later).
- A quest's own completion declares its own risk tier via a #hashtag on its completing stage — this is a per-quest content decision (mechanism-mine, classification-content's, same split as always).

## PENDING — Paolo's calls (small, not blocking)
- Whether FOLLOWERS and CLOUT end up as one number or two (the mechanism supports either — call `socialProfile` once per metric with its own scoreFn).
- Exact weight tuning once there's more real content to calibrate against.
- Whether recklessness should also feed the Amalgamation's threat/detection model directly (the convergence above is thematic/narrative right now, not yet a wired threat mechanic).

---
*BOHEMIA — Clout Law: Reckless Beats Quiet — 7.21.26*
*Chasing followers is choosing to be seen. The thing watching the feed watches the viral moments hardest.*
