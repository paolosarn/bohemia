# BOHEMIA — ADDENDUM: THE QUEST LOG IS THE SOCIAL FEED + TOTAL RECALL
### 7.20.26 — Paolo locked TWO things: (1) the quest log's PRESENTATION is a social-media phone app, and (2) TOTAL RECALL — everything is remembered on the feed, no exceptions. This SHARPENS GDD v2 §18 (Social Media Hub & The Feed) and the CLOUT currency, and it RETIRES the recorded/unrecorded two-ledger split (BOHEMIA_ADDENDUM_RECORDED_VS_UNRECORDED_7_1_26.md, now archived) plus GDD v2 §blind-spot's "off-feed is the dynasty's advantage" premise. Newest-date-wins.

---

## WHAT PAOLO LOCKED (his words, 7/20)
1. The quest log is NOT a Skyrim-style menu list. It is a SOCIAL-MEDIA PHONE APP — the "social tab." Through it you PICK UP quests (they surface in the feed), all your quests are DOCUMENTED "in a cool way" (the feed IS the quest history), and you gain FOLLOWERS when you do cool shit.
2. TOTAL RECALL: "I want everything to be remembered in the social media shit, end of story." No secret channel, no off-feed exception. Even people who logically would not have phones (the homeless) are on the feed: "fuck it, give them phones." Everyone is on the feed. Everything is remembered.

## WHY (1) IS ALREADY CANON (read-before-speak, 7/20)
GDD v2 §18 SOCIAL MEDIA HUB & THE FEED, verbatim: "The player's daily hub. A social media feed functioning as the primary interface... Clout currency earned through the feed. QUESTS SURFACE THROUGH THE FEED. Faction movements tracked through the feed." The feed is MANDATORY ("going dark is not a strategic option... you participate or you fall behind"). It EVOLVES per act; in the back half of Act 3 "the feed becomes the battlefield where the truth about the Amalgamation either spreads or gets suppressed." CLOUT (§currencies): "anyone with feed access can post, going viral accumulates clout." So the social-media quest log with followers is the FEED made concrete; Paolo's lock names that the quest LOG and the feed are ONE surface and FOLLOWERS is the readout.

## WHAT (2) OVERRIDES (the retirement, done honestly)
The old design said the dynasty's advantage against the Amalgamation was the UNRECORDED: face-to-face trust, tunnel talk, choices that left no digital trace, "the most important things about them were never compiled" (GDD v2 §blind-spot), formalized into a two-ledger engine with a `recorded:false` flag (7/1 addendum). PAOLO RETIRED THIS 7/20. There is no off-feed ledger. Everything a quest does is remembered on the feed. The 7/1 two-ledger addendum is archived; GDD v2 §blind-spot's off-feed premise no longer governs.

CONSEQUENCE (stated, not relitigated): the Act 3 win against the Amalgamation runs THROUGH the feed, not around it — which is exactly §18's own finale ("the feed becomes the battlefield where the truth spreads or gets suppressed"). You beat it by winning the feed war (truth spreads faster than it can bury), not by hiding in a blind spot it can't see. The homeless faction is on the feed too now; whatever makes them special is no longer "they're off-grid."

## LOCKED
- The quest log's presentation IS the social feed / phone app (the social tab). No separate Skyrim list.
- FOLLOWERS is the visible reputation metric grown by notable deeds. CLOUT stays the spendable currency (§currencies). Followers = audience/reputation readout.
- Quests are picked up through the feed and documented through the feed.
- TOTAL RECALL: everything is remembered on the feed. No secret / off-feed channel exists. Everyone is on the feed (homeless included).
- The feed's polish evolves per act (§18); the quest-log UI upgrades with it.

## DONE IN CODE THIS TURN (7/20) — matches the lock
The quest FEED pipe (engine/bohemia_loop.js) records every quest choice and outcome into the choice-log with `recorded:true`, ALWAYS. The `recorded:false` / silence pathway was removed: even a .bq option marked SILENCE still hits the feed. LOOP LEDGER gate updated to assert total recall (nothing off-feed; blind spot is always zero).

## PENDING — PAOLO'S CALLS (small, not blocking)
- FOLLOWERS vs CLOUT: one number or two, and how followers gate/unlock things.
- Which deeds auto-post vs are chosen; how followers grow/decay per deed ("what counts as cool shit").
- The homeless faction's new distinguishing trait now that off-feed is retired.
- The "cool way" of documenting quests: the feed's visual design (art, deferred).

---
*BOHEMIA — The Quest Log Is The Social Feed, Total Recall — 7.20.26*
*Not a menu you check. A feed you live in, and it remembers everything. You win it by flooding it with the truth, not by hiding from it.*
