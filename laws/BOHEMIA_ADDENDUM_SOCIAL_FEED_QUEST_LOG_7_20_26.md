# BOHEMIA — ADDENDUM: THE QUEST LOG IS THE SOCIAL FEED (followers, not a Skyrim list)
### 7.20.26 — Paolo locked the PRESENTATION of the quest log. This does not invent a new system; it SHARPENS and unifies three things already in canon: GDD v2 §18 (Social Media Hub & The Feed), the CLOUT currency (GDD v2 §currencies), and the RECORDED vs UNRECORDED two-ledger engine (7/1/26). Extends GDD v2 §18. Newest-date-wins over any older "quest log" phrasing.

---

## WHAT PAOLO LOCKED (his words, 7/20)
The quest log is NOT a Skyrim-style menu list. It is presented as a SOCIAL-MEDIA PHONE APP — the "social tab." Through it:
- you PICK UP quests (available/random quests surface in the feed),
- all your quests are DOCUMENTED "in a cool way" (the feed IS the quest history),
- you gain FOLLOWERS when you do cool shit (notable deeds grow your audience).

The quest journal and the social feed are the SAME surface. Followers are the visible readout of your reputation.

## WHY THIS IS ALREADY CANON (read-before-speak, 7/20)
GDD v2 §18 SOCIAL MEDIA HUB & THE FEED already says, verbatim:
- "The player's daily hub. A social media feed functioning as the primary interface for understanding Bohemia and the wider world."
- "Clout currency earned through the feed. QUESTS SURFACE THROUGH THE FEED. Faction movements tracked through the feed."
- The feed is MANDATORY: "going dark on the feed is not a strategic option... You participate or you fall behind. This is a deliberate design decision and a deliberate commentary."
- The feed EVOLVES per act: Act 1 primitive/scrappy, Act 3 almost professional (faction PR), and in the back half of Act 3 the feed becomes the battlefield where the truth about the Amalgamation either spreads or gets suppressed.

CLOUT (GDD v2 §currencies): "Most democratized currency. Anyone with feed access can post. Going viral accumulates clout. The Amalgamation watches viral moments most carefully."

So Paolo's "followers when you do cool shit" is the FEED/CLOUT audience made concrete, and "quest log = the social phone" confirms the quest journal and §18's feed are ONE interface. Nothing here contradicts canon; it names the UI.

## THE CONVERGENCE WITH THE ENGINE (the reason this is beautiful, not just a skin)
The RECORDED vs UNRECORDED addendum (7/1/26) already locked: the CLOUT economy and the UNRECORDED ledger are OPPOSITE POLES — "power-via-visibility vs safety-via-invisibility," and "the Amalgamation watches viral moments most carefully." The recorded ledger IS the feed-touching public footprint, and it is EXACTLY the data the Amalgamation reads.

Wired 7/20 (LOOP LEDGER gate): a quest choice/outcome played through ctx.quests records to the engine choice-log with `recorded:true` by default. THE FOLLOWER COUNT IS A NATURAL READOUT OF THE RECORDED LEDGER. Doing cool shit publicly -> posts to the feed -> recorded:true -> grows followers AND is seen by the Amalgamation. The same act that makes you famous makes you legible to the enemy. The social-media quest log is, mechanically, the antagonist's surveillance surface. That is the theme (true family vs the counterfeit family that "never loses anything") rendered as the UI the player lives in.

## LOCKED
- The quest log's presentation is the SOCIAL FEED / phone app (the social tab). No separate Skyrim list.
- FOLLOWERS is the visible reputation metric grown by notable deeds; it sits alongside CLOUT (clout = the spendable currency; followers = the audience/reputation readout). [Their exact relationship — same number or two numbers — is PENDING below.]
- Quests are picked up through the feed and documented through the feed.
- The feed evolves in polish per act (already canon, §18) — the quest-log UI upgrades with it.

## MECHANISM-MINE (safe to build toward, no new lore)
- A FEED VIEW over the recorded ledger: the `recorded:true` choice-log entries can be rendered as a chronological feed of "posts" (the documented quest history). Pure read over data that already exists (Save.choices).
- A FOLLOWER/CLOUT tally derived from the recorded ledger. The HOOK is mine; the MATH (how much per deed, what counts as "cool shit," decay) is Paolo's.
- Quest availability surfacing through the feed reuses the existing journal/available machinery (ctx.quests.journal / talkablesNear).

## PENDING — PAOLO'S CALLS (do not decide these)
- THE CORE FORK: is the follower count literally the recorded-ledger readout, so quests done QUIETLY / off-feed (the unrecorded, family/tunnel path) earn ZERO followers by design? If yes, "chase clout (famous, powerful, but the machine models you) vs stay small (invisible, safe, unfamous)" becomes the central strategic axis, and the follower number becomes the enemy's view of you. [Claude's strong read, unconfirmed.]
- FOLLOWERS vs CLOUT: one number or two? (Candidate: clout = spendable currency; followers = the reputation gauge that unlocks/gates. PENDING.)
- What deeds post automatically vs by player choice (ties to the recorded:false policy, still Paolo's).
- Follower FACTIONS/REACH: do different factions or the international feed follow you separately (§18: the feed is international)?
- The "cool way" of documentation: visual/verdict-tool design, deferred to art.

---
*BOHEMIA — The Quest Log Is The Social Feed — 7.20.26*
*Not a menu you check. A feed you live in. The followers you earn are the enemy's view of you. What you do off-feed, it never sees.*
