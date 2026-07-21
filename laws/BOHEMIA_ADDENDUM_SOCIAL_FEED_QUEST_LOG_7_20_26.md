# BOHEMIA — ADDENDUM: THE QUEST LOG IS THE SOCIAL FEED + TOTAL RECALL
### 7.20.26 — Paolo locked TWO things: (1) the quest log's PRESENTATION is a social-media phone app, and (2) TOTAL RECALL — everything is remembered on the feed, no exceptions. This SHARPENS GDD v2 §18 (Social Media Hub & The Feed) and the CLOUT currency, and it RETIRES the recorded/unrecorded two-ledger split (BOHEMIA_ADDENDUM_RECORDED_VS_UNRECORDED_7_1_26.md, now archived) plus GDD v2 §blind-spot's "off-feed is the dynasty's advantage" premise. Newest-date-wins.

---

## UPDATE 7.21.26 — FEED + MESSAGES ARE ONE APP; CROSS-APP PUSH NOTIFICATIONS
Paolo, 7/21: "having a phone number is personal and great IRL but the telecommunications industry went to shit, so maybe it's just like if WhatsApp and Instagram combined. Makes message requests a lot easier in this world." **LOCKED**: the social feed and DMs are the SAME app ("Network" on the phone), not two separate apps. No phone-number contact system — DMs are handle-based (the same way you'd DM anyone on a modern social platform), which is also just what falls out naturally in a world where the phone network itself is a patched-together relic, not a real telecom. Built 7/21: the standalone Messages app folded into the Network app as a fifth bottom tab (Feed / Quests / DMs / Log / Me) with its own unread-dot indicator; the home-screen Messages tile is gone, one combined badge on the Network tile now covers both open quest offers and unread DMs.

Paolo, same message: "even when they're playing in the overworld there can be a notification phone animation on screen with text about new updates." **LOCKED as a mechanism**: a push-notification banner that can appear regardless of which screen/app is currently open — researched against Cyberpunk 2077's pattern ("an alert appears at the top of the screen or in the corner, in a non-intrusive way, allowing the player to decide whether to respond immediately or later"), which is exactly what got built. Proven 7/21 firing while the Map or Wallet app is open (the current stand-ins for "doing something else" until a walkable overworld exists); tapping it jumps straight into the relevant DM thread. The mechanism doesn't change once a real overworld render exists — the identical banner call fires over gameplay instead of over another phone screen.

## CORRECTION 7.21.26 — THE VISIBLE CLOUT BADGE WAS KILLED
See BOHEMIA_ADDENDUM_CLOUT_RECKLESS_BEATS_QUIET_7_21_26.md for the full correction: Paolo rejected showing a QUIET/NOTABLE/RISKY/RECKLESS label on feed posts ("the whole point of this game is that it's hardcore but for normies to enjoy too"). The CLOUT data still drives engagement volume and comment tone invisibly; no tag or badge is shown. Also corrected there: the "chasing clout is choosing exposure, a strategic risk" framing overclaimed player agency that isn't real — quest completion is mandatory to finish the game and quest completion is how clout grows, so there is no "opt out of clout entirely" playstyle. The mechanism (reckless-tagged completions earn more) is unchanged; only the narrative claim of full player choice was walked back.

## WHAT PAOLO LOCKED (his words, 7/20)
1. The quest log is NOT a Skyrim-style menu list. It is a SOCIAL-MEDIA PHONE APP — the "social tab." Through it you PICK UP quests (they surface in the feed), all your quests are DOCUMENTED "in a cool way" (the feed IS the quest history), and you gain FOLLOWERS when you do cool shit.
2. TOTAL RECALL: "I want everything to be remembered in the social media shit, end of story." No secret channel, no off-feed exception. Even people who logically would not have phones (the homeless) are on the feed: "fuck it, give them phones." Everyone is on the feed. Everything is remembered.

## WHY (1) IS ALREADY CANON (read-before-speak, 7/20)
GDD v2 §18 SOCIAL MEDIA HUB & THE FEED, verbatim: "The player's daily hub. A social media feed functioning as the primary interface... Clout currency earned through the feed. QUESTS SURFACE THROUGH THE FEED. Faction movements tracked through the feed." The feed is MANDATORY ("going dark is not a strategic option... you participate or you fall behind"). It EVOLVES per act; in the back half of Act 3 "the feed becomes the battlefield where the truth about the Amalgamation either spreads or gets suppressed." CLOUT (§currencies): "anyone with feed access can post, going viral accumulates clout." So the social-media quest log with followers is the FEED made concrete; Paolo's lock names that the quest LOG and the feed are ONE surface and FOLLOWERS is the readout.

## THE POST = A COMPLETED QUEST (Paolo 7/20, refinement 2)
"For posts and quests done they should be the SAME. You complete a quest, you make a post, and it comes with a PICTURE and people COMMENTING depending on how many followers you have."
- ONE POST PER COMPLETED QUEST. The feed is NOT a log of every dialogue choice. Posts count == quests-done count. (The granular per-choice record still exists in the choice-log for the fold — the game remembers everything — but the visible FEED is one clean post per finished quest.)
- EACH completion post carries a PICTURE (a photo of the deed) and COMMENTS.
- COMMENT VOLUME/ENGAGEMENT SCALES WITH FOLLOWERS: more followers => more comments, likes, reach on each post. Your growing audience is felt on every post.
- WIRED (7/20): buildFeed(ctx) now returns one post per completion (kind:'outcome'); {all:true} still exposes the choice-level record. socialProfile posts == questsCompleted. LOOP FEED + LOOP PROFILE gates updated. The phone demo shows the photo slot (placeholder art) + follower-scaled comments (placeholder text). The COMMENT COUNT math and comment CONTENT are Paolo's (PENDING); the mechanism (scale with followers) is wired.
- STAT DISPLAY (Paolo 7/20): since posts == quests done, the phone shows only FOLLOWERS + POSTS. Drop a separate "quests done" stat (it was redundant).
- QUEST THUMBNAILS (Paolo 7/20, art direction, not built): each completed-quest post needs a THUMBNAIL image. It should be COMPOSED from real game assets — the player character + the other characters in the quest + relevant asset/scene art — i.e. a generated "photo" of the deed, not a stock image. Deferred to the art pipeline; the post already has a photo SLOT the thumbnail drops into.

## THE PHONE IS THE GAME'S PRIMARY MENU / HUB (Paolo 7/20 asked; affirmed against canon)
Paolo: "Is the smartphone a good place to host the actual game menu? This seems like it's going to be a pretty big deal." ANSWER: yes, and it is ALREADY the canon plan. GDD v2 §18: the feed is "the player's daily hub, the primary interface for understanding Bohemia and the wider world," and it is MANDATORY. So the smartphone hub is not a new pivot; it is the spine §18 already named. The phone is the DIEGETIC menu: quests, feed, map, factions, currencies, the family/dynasty — one in-world metaphor instead of an abstract pause menu. Phone down = you are in the world. This unifies the whole UI and ties progression to a felt, in-fiction metric (followers/legacy).
SIGNAL / DEAD ZONES — LOCKED (Paolo 7/20): a phone still works with no signal, obviously. The MENU always works: settings, map, quest log, inventory, the local stuff. Only the ONLINE layer needs signal — the FEED, POSTING, COMMENTS, and picking up quests OVER THE PHONE go dark with no signal. No UI-degradation drama; the phone is just a phone. In a dead zone (the tunnels) you cannot refresh the feed, post, or grab a feed quest — which is EXACTLY why the in-person channel exists ("no phones down here, that's why you had to walk"). A deed done offline still happens and is remembered; the POST for it goes up when you are back in range (like a real phone's queued upload). Signal gates the online layer only; it never locks you out of your own phone.
PENDING — Paolo's call (one small fork left):
- DIEGETIC vs META split: does the phone also hold the META layer (save/load, the 100-year dynasty tree), or does meta live outside the phone frame? A phone is in-world; a save menu is not. (Settings clearly live ON the phone per the ruling above; save/dynasty is the open one.)

## PHONE VISUAL DIRECTION (7/20, research-backed): "SALVAGED SMARTPHONE, bootleg feed on the Network"
Paolo rejected the generic dark-IG look. Researched post-apocalyptic diegetic UI (Fallout Pip-Boy = the diegetic-device gold standard; Cyberpunk 2077 phone = elegant/minimal/persistent history; Death Stranding; Vegas Neon Museum "beautiful decay" faded-neon; CRT/scanline + degradation-as-information from BioShock/low-health-vignette). LOCKED LOOK: a real smartphone that SURVIVED, running a jury-rigged social app on the Network (the feed IS the Network's, §18). Warm decayed-Vegas palette (dusty warm-black + faded tarnished GOLD neon that flickers + sickly signal-GREEN + failing-neon ORANGE), monospace for system/metadata (salvaged-terminal), CRT scanlines + vignette over the whole screen, compressed low-res "SIGNAL CAM 240p" quest photos, salvaged square avatars/keys (not glossy circles). KEY MOVE: NO SIGNAL degrades the INTERFACE ITSELF (desaturate + red vignette + rolling scanlines + red signal bars) — the world reaches into the UI. Stays daylight-readable (SUN MODE). This is the design language the quest-thumbnail art + any phone art should match. Implemented in the current slice 7/20.

## QUEST ACQUISITION: TWO CHANNELS, ONE MEMORY (Paolo 7/20, refinement)
Getting a quest and remembering a quest are separate. The homeless do NOT have phones (this reverses the throwaway "give them phones" from earlier the same day).
- SOURCING has two channels. FEED: most quests come to you over the phone (they surface in the feed, remote pickup — GDD v2 §18 "quests surface through the feed"). IN-PERSON: the phoneless (the homeless) are not on the feed at all; you cannot get their quest over the phone, you have to PULL UP on them physically.
- REMEMBERING is still TOTAL RECALL. Even an in-person homeless quest lands on the feed, because YOU post about it afterward ("I'd still make a post about it like crazy... I might take a picture of that"). The deed is remembered; only the SOURCE was off-phone.
- So the homeless faction's distinguishing trait (was PENDING) is now: they are an IN-PERSON-ONLY quest source. Not "invisible to surveillance" (that retired premise is dead) — the player's own post still puts the deed on the feed. Their thing is you have to physically show up.
- THE PHONE/FEED IS THE MASTER MENU: "a huge window... the menu of seeing all the quest logs and what quests and what you have written down." The feed is where you view everything, whether it came from the phone or from pulling up on someone.

WIRED IN CODE (7/20, LOOP CHANNEL gate): placement carries a `channel` ('feed' | 'inperson', default 'feed'). feedOffers() = the quests pickable over the phone (feed channel, excludes in-person). The talk-trigger (talkablesNear) is "pull up on them" and works for any placed NPC when adjacent — the ONLY way to reach an in-person quest. Total recall unchanged: finishing an in-person quest still records to the feed. Channel is MECHANISM; which NPCs are in-person (homeless) is content, Paolo's call.

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
- The "cool way" of documenting quests: the feed's visual design (art, deferred).

---
*BOHEMIA — The Quest Log Is The Social Feed, Total Recall — 7.20.26*
*Not a menu you check. A feed you live in, and it remembers everything. You win it by flooding it with the truth, not by hiding from it.*
