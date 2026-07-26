# BOHEMIA — ADDENDUM: CLOUT LAW — RECKLESS BEATS QUIET
### 7.21.26 — Paolo locked the follower/clout math. Extends BOHEMIA_ADDENDUM_SOCIAL_FEED_QUEST_LOG_7_20_26.md (the quest log IS the social feed, total recall) by filling in the one thing that addendum left PENDING: what actually earns followers. Newest-date-wins.

---

## WHAT PAOLO LOCKED (his words, 7/21)
Asked directly: "does reckless/dangerous shit get more followers than quiet good deeds, yes or no?" — **"yes."**

Grounded the same session in real social media behavior: substance and virality are only loosely correlated in real life. A quiet good deed gets nothing. A reckless, dramatic, dangerous act blows up. Novelty and danger drive reach, not actual impact. This is now Bohemia's rule too.

## WHY THIS IS MORE THAN FLAVOR (the convergence, already in canon)
GDD v2 §currencies already says of CLOUT: "anyone with feed access can post, going viral accumulates clout, **the Amalgamation watches viral moments most carefully**." And the Amalgamation's threat logic (AMALGAMATION_THREAT_LOGIC, 7/1) already locks it as killing **near its own secret** — a proximity-based threat, not an omniscient one.

Put together: chasing clout is choosing exposure. A player who goes reckless for followers is, mechanically, the same player who is more visible to the thing that kills people near what it's hiding. The follower number is not just vanity — it is the character's PUBLIC FOOTPRINT.

**CORRECTION, same day (Paolo, 7/21):** the paragraph above overclaimed this as a real strategic CHOICE. It isn't one. If completing quests is how the game is finished, and completing quests is how clout grows (at any tier), then EVERY player who beats the game accumulates clout — there is no "stay quiet, stay invisible, dodge the Amalgamation entirely" playstyle available, because "generate zero clout" is not on the table. Paolo: "if you complete quests your clout will go up, period. There is no way to complete the game without getting clout. Lore-wise I guess you're right, but player-1-wise, the person who buys our game, they won't have a choice in that matter." Correct, and a real design hole in how this was framed.

**What survives:** the mechanism (reckless tags earn dramatically more than quiet ones) is unchanged and still good — WHEN a quest offers multiple ways to play it, how loud you are about it is a real choice with real follower consequences. The Amalgamation-watches-virality framing survives as LORE TEXTURE explaining WHY an antagonist would notice a famous dynasty, not as a marketed "you can choose to stay hidden from it" mechanic, since staying at zero clout was never actually available. Downgrade "chasing clout is choosing exposure, a strategic risk" to: some individual choices are louder than others and that has consequences; total invisibility isn't a strategy, it's just not a thing that exists in this game.

## THE MECHANISM (built same day, engine/bohemia_loop.js + bohemia_quest_runtime.js)
- A quest's own **completing @STAGE line** can carry ONE hashtag from a four-step scale, using the .bq format's EXISTING #hashtag capability (no format change needed): `#quiet` `#notable` `#risky` `#reckless`. This is a per-quest AUTHORING decision (content, not mechanism) — the quest itself declares how dangerous its own outcome was.
- The runtime captures that tag verbatim on completion (`state.doneTags`) without knowing anything about followers — it stays UI/theme-agnostic per its own law.
- The ledger pipe carries the tag from the runtime → the choice-log effect → the feed post (`post.clout`) → the follower math.
- `Loop.defaultFollowerScore(post)` is now the REAL default (no longer an empty hook): it reads `post.clout` and returns a weighted value. `Loop.socialProfile(ctx)` uses this by default when no custom `scoreFn` is passed.
- Current weight table (`Loop.CLOUT_WEIGHTS`, tunable, ORDERING locked): `quiet:8, notable:25, risky:55, reckless:110`. An untagged completion scores `CLOUT_NEUTRAL:15` (between quiet and notable — a mild default so most content doesn't have to bother tagging itself, but doing so still matters).
- A FAILED quest still posts to the feed (total recall) and still scores by its tag — recklessness, not success, is what the follower math rewards, matching how virality actually works (a spectacular failure can go viral too).
- Fixed a real ordering bug caught while building this: a choice whose own `@DO set_stage` completed the quest in one step was firing the OUTCOME ledger event BEFORE the CHOICE event that caused it (an internal wrapper-recursion issue). Fixed at the root in the runtime so the ledger always records choice-then-outcome in the order they actually happened.
- New gate: **LOOP CLOUT** (18/18) proves the tag rides end-to-end, the ordering (reckless > risky > notable > quiet) holds, reckless is not just "a bit more" than quiet (>=3x by design), FAIL posts score correctly, and it survives save/reload.
## NO VISIBLE TAG (Paolo 7/21, same-day correction — LOCKED)
First pass showed a literal QUIET/NOTABLE/RISKY/RECKLESS badge stamped on every feed post. Paolo killed it: **"I wouldn't want a risky tag there. The whole point of this game is that it's hardcore but for normies to enjoy too."** A literal difficulty/danger label reads as a hardcore-game UI element, which undercuts the normie-friendly feed skin. LOCKED: the CLOUT tag is DATA ONLY, never a visible label, badge, or stamped word anywhere in the feed UI.

The data still matters and still SHOWS, just not as a name — it shows as behavior:
- Engagement (likes + comment count) scales with the post's clout weight, not just raw follower count. A reckless post visibly gets way more likes and comments than a quiet one from the same account.
- Comment TONE shifts with the tier (calm/supportive for quiet, hype/alarmed/chaotic for reckless — e.g. "bro you good??", "certified lunatic behavior"), without any of them being labeled.
- This is closer to how real engagement actually reads: you never see Instagram stamp "THIS POST WAS RECKLESS" on a video, you just see it have 50x the comments and way wilder replies. Implemented 7/21 in the phone demo (commentsFor/tierForWeight); the LOOP CLOUT gate and engine mechanism are unchanged, only the UI stopped exposing the label.

## THE WALLET EASTER EGG (Paolo 7/21 — LOCKED, his idea, built)
"Since everything used to be in USD, tap Wallet and it opens an old bank/cashapp thing, service unavailable." Built exactly that: the WALLET tile (previously dimmed "soon") now opens a dead pre-collapse fintech app — **QuikPay, by Meridian National** (fictional analog, no real bank/app branding used) — showing a frozen USD balance stamped "SINCE COLLAPSE," a list of services (Send Money, Direct Deposit, Bill Pay, Rewards, a crypto ticker) all marked SERVICE UNAVAILABLE, and a footer line ("the dollar's last transaction cleared a long time ago. nobody is coming to fix this."). Tapping anything pops a toast: "NO CONNECTION — this service ended a long time ago." Pure flavor/easter egg, NOT the real currency system — it exists to make the collapse of the dollar felt in a concrete artifact, while the actual live economy (resources/electricity/clout) is designed separately (see ECONOMY DISCUSSION below).

## ECONOMY DISCUSSION 7/21 (Claude's recommendation, PENDING Paolo's confirm — NOT locked)
Paolo asked directly how clout can be a "currency" if using it doesn't deplete it like spending money does ("if I have 10k clout and I use it, now I have 5k? you know what I'm saying"). Researched real precedent (see Sources) before answering:

**Fallout: New Vegas Reputation** — a faction standing that gates prices, access, and hostility. It is never "spent"; it's leveraged. **Death Stranding's Likes** — explicitly designed by Kojima's team as "unconditional love, not currency": Likes never decrease, they permanently level up carrying/stat bonuses. Both are successful, well-loved precedents for a NON-DEPLETING reputation stat. **Surviving the Aftermath** (see its own research file, same date) does the same: reputation is leveraged for trade favors, never spent down.

Meanwhile the real-world POW-camp cigarette economy (WWII, extensively studied in economics) shows the OPPOSITE pattern for TANGIBLE goods: cigarettes were destroyed when smoked, which is exactly why they worked as real fungible money (finite, consumed on use, naturally deflationary).

**Claude's recommendation:** split the three currencies into two different KINDS of economy, because they are fundamentally different things:
- **RESOURCES and ELECTRICITY are SPENDABLE.** Fungible, finite, consumed on use — food/wood/ductape/batteries/salvaged tech, the POW-cigarette model. You have some, you trade it or use it, you have less.
- **CLOUT/FOLLOWERS is a REPUTATION STAT, not spendable.** It never depletes through use. It GATES things instead — higher clout might unlock better trade terms, faction trust, recruit options, or unique dialogue, the same way Fallout NV reputation or STA's colony reputation do. Its "cost" isn't depletion, it's RISK: high clout means high visibility, which (per the CLOUT convergence above) means more exposure to the Amalgamation. You don't lose followers by using them — you risk getting noticed by the thing that's watching.

This directly resolves the "10k clout, use it, now 5k?" confusion: clout was never meant to work like money in the first place, and trying to make it deplete like one fights its own nature as a social metric.

**Also validated, NOT built (Paolo's barter-trade idea):** meeting in person to trade goods directly ("meet at the Walmart trading hub, spot #3, send a picture of your goods, I'll send a picture of mine") is economically REAL — barter economies reliably emerge whenever official currency fails (documented in Venezuela's and Zimbabwe's hyperinflation collapses, and classically in the WWII POW cigarette economy). It's a legitimate, groundable Bohemia mechanic/lore beat. Paolo explicitly said he's not sure he wants to build a full gameplay loop around it yet ("idk if i want to go super in depth... but it could be part of the lore fs") — so this stays FLAVOR/LORE-LEVEL for now, not a system to build today.

## LOCKED (from the original follower-math lock, still true)
- Reckless/dangerous deeds earn dramatically more followers than quiet good deeds. This is now the core incentive structure of the social/quest loop, not a placeholder.
- The ordering `reckless > risky > notable > quiet` is canon. The exact numeric weights remain tunable (Paolo's call to retune later).
- A quest's own completion declares its own risk tier via a #hashtag on its completing stage — this is a per-quest content decision (mechanism-mine, classification-content's, same split as always).
- The tag/tier is NEVER a visible label in the UI — data only, felt through engagement volume and comment tone.

## PENDING — Paolo's calls
- Confirm or reject the RESOURCES/ELECTRICITY = spendable vs CLOUT = reputation-gate (non-spendable) split above. This is Claude's recommendation, not yet locked.
- Whether FOLLOWERS and CLOUT end up as one number or two (the mechanism supports either — call `socialProfile` once per metric with its own scoreFn).
- Exact weight tuning once there's more real content to calibrate against.
- Whether recklessness should also feed the Amalgamation's threat/detection model directly as an actual mechanic (the convergence above is thematic/narrative right now, not yet a wired threat mechanic).
- Whether/how deep the in-person barter-trade idea gets built (currently flavor-only, not a system).
- Whether MEDICINE (locked as a currency category in the 7/18 WORLD_BREAK_ANSWERS discussion) folds under "resources" as Paolo's 7/21 list implies, or stays a distinct fourth category.

---
*BOHEMIA — Clout Law: Reckless Beats Quiet — 7.21.26*
*Chasing followers is choosing to be seen. The thing watching the feed watches the viral moments hardest.*
