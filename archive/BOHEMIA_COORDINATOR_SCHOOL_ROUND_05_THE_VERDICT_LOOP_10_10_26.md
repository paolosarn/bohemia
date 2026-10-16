# BOHEMIA COORDINATOR SCHOOL, ROUND 5 OF 10: THE VERDICT LOOP (10/10/26)

## THE QUESTION
How do the best studios run playtesting and director review so feedback is fast, honest and actionable, and what does that teach a coordinator whose only judge is one director voting YES or NO in bursts of 30 to 80 items on a phone? The pain this answers: a NO on "sharper tiles" with the note "can't tell difference", items that showed numbers instead of pictures, a UI too ugly to judge the idea under it, and a director turned into an approvals queue. Sources: Valve, Supercell, Nintendo, Riot, Blizzard, Sid Meier, Jesse Schell, Celia Hodent, Microsoft games user research, VFX dailies, and the perception and fatigue research behind comparison and batching. Where a search could not confirm a famous phrase, this file says so. (Page fetches were DNS blocked this round; findings rest on search excerpts of the cited pages.)

## WHAT I FOUND

1. Valve sat behind one outsider for two hours and the observers could not speak. Birdwell's Half-Life postmortem: the level's designer and a Cabal member sat behind the tester, and apart from starting the game or resetting after a crash they could not give hints or suggestions. Over 200 sessions averaged 100 action items each. https://www.gamedeveloper.com/design/the-cabal-valve-s-design-process-for-creating-i-half-life-i-
   Why it matters here: "can't tell difference" is data, not a failed vote. The item was built wrong, not judged wrong.

2. Valve tests weekly and every test is an experiment with a hypothesis. Ambinder's GDC 2009 talk: designs are hypotheses, playtests are experiments, the goal is fun "not bug testing", each team tests its own section with an outsider every Friday. His line: "If my playtesters feel dumb, it's because I am dumb." https://www.gdcvault.com/play/1566/Valve-s-Approach-to-Playtesting
   Why it matters here: an item with no question attached cannot pass or fail; the one thing being tested is written before it ships.

3. The people who built it run the test and read feedback as raw data, not instructions (Mark Brown on Birdwell). https://gmtk.substack.com/p/valves-secret-weapon
   Why it matters here: the lane that cooked an item reads its verdict and writes its fix. The coordinator routes, it does not translate.

4. Supercell kills most of what it makes and the team decides, not the boss. Dower at GDC 2016: of the last 10 games only Clash Royale shipped, seven died at prototype, two in soft launch. Paananen: "it's ultimately the game team who decides whether to go ahead with or kill a game"; the Smash Land team "didn't even bother to consult me, which is great." The toast is "not to the failure itself, but the learnings." https://gamesbeat.com/supercell-ceo-thrives-on-trusting-the-instincts-of-game-developers/ and https://www.antoinebuteau.com/lessons-from-ilkka-paananen/
   Why it matters here: a NO is normal and cheap. A lane that killed nothing this round did not test hard enough.

5. Nintendo's director watches real players and acts on what he sees. Miyamoto watched ten middle schoolers on Mario 64, his own child trying dozens of times to climb an unclimbable hill, and they still said it was fun; on Galaxy, when public testers said "I get motion sickness here", he said "OK, let's fix it." Mario Club was staffed with part timers so their play matched end users. https://iwataasks.nintendo.com/interviews/wii/super_mario_galaxy/0/1/ and https://bulbapedia.bulbagarden.net/wiki/Super_Mario_Club (The phrase "kidney test" did not appear in any result.)
   Why it matters here: Paolo playing the demo is worth more than Paolo reading an item about it. The tab shows the thing moving, in the game's camera, which is already his ruling.

6. Hodent: players say the HUD is clear, then cannot explain it. "Most gamers will say the HUD in your game is clear, but then they will fail to explain it accurately when asked to describe it." She asks players to state the objective instead of asking if it was clear; in a Fortnite test players were seen crafting yet later could not recall the mechanic. https://celiahodent.com/gamers-brain-ux-onboarding/
   Why it matters here: a YES on a description is near worthless. A YES on a thing he watched do its job is the only YES that counts.

7. Microsoft paired instrumented behaviour with attitude prompts because behaviour alone cannot say why (TRUE, Kim, Gunn, Schuh, Phillips, Pagulayan, Wixon, CHI 2008). On Halo 3 the lab used one way mirrors, route maps and pop up engagement ratings; players kept losing their objective, so it was made to flash when it changed. https://www.springerprofessional.de/doi/10.1145/1357054.1357126 and https://www.npr.org/transcripts/14649338
   Why it matters here: the registry records what he did in the demo (where he stopped, what he tapped) next to what he typed. One without the other is half a verdict.

8. Sid Meier: double it or cut it in half, never nudge five percent. His memoir calls it one of his big rules: a doubling tells you at once whether a change has the effect you expected; a small nudge skips a dozen iterations. Brian Reynolds confirms it. https://www.pcgamesn.com/sid-meiers-memoir-civilization and https://www.gamedeveloper.com/design/the-key-to-i-civilization-i-straight-from-sid-meier-and-co-
   Why it matters here: a five percent sharpen is a Meier violation. If it is worth a vote it is visible from across the room.

9. Schell's playtesting lens asks why, who, when, where, what and how before any test, and a test without a specific question yields little; playtesting is the trusted evidence against opinion. https://untoldplay.medium.com/jesse-schells-six-questions-for-playtesting-679a5fb9340b
   Why it matters here: each item carries its why (the question) and its how (what he is looking at) in its own header.

10. Blizzard's bar is iteration. Jay Wilson: "If we haven't changed something at least five times, it doesn't deserve to be sold." Pardo urged teams to show work often rather than wait for perfect. https://www.gamestar.de/news/diablo_3,1948613.html and https://www.gamedeveloper.com/game-platforms/gdc-blizzard-s-core-game-design-concepts (The phrases "iteration until fun" and "concentrated coolness" were not found.)
   Why it matters here: the tab is round five of a thing, never round one.

11. VFX dailies: a shot goes to the director only when it needs creative input, each note answers one specific version, a coordinator writes notes in real time, and it loops until approval. Pixar's Braintrust is candid but the decision "is the director's job and nobody else's." https://www.whatsafterthemovie.com/wiki/term/vfx-notes and https://www.supersummary.com/creativityinc/background/
   Why it matters here: versioned items, notes tied to a version, nothing in front of him that does not need his eye.

12. Side by side is the slow way to see a difference; flipping in the same place is the fast way. Poom and Fällmar (PLoS ONE 2022): same place, no delay gave near instant error free pop out; side by side took about 9 seconds and missed 6 to 7 percent within 30 seconds; some people were at chance on vertical pairs. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8880654/
   Why it matters here: "can't tell difference" is exactly this. A before/after is a tap to flip at 1:1, never two tiles stacked on a phone.

13. Visual regression practice: the diff shows where to look, a human decides, and the baseline update is the step that fails most. https://macmyths.com/how-to-highlight-differences-in-visual-regression-tests/
   Why it matters here: a YES is a baseline update. Record it or the same question comes back.

14. Judgment quality falls with volume. SmartBear's Cisco study is read as defect finding dropping past 300 to 400 lines and 60 to 90 minutes; Danziger's parole study (1,000+ decisions, 8 judges) found grants near 65 percent after a break falling toward zero late in a session, the default "no" winning as decisions piled up (the cause is disputed). https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/ and https://nocamels.com/2011/05/fatigue-negatively-influences-the-rulings-of-judges/
   Why it matters here: in a burst of 83 the last 40 are judged by a tired man whose default is NO. Cap the batch, hard calls first.

## WHAT THE BEST DO THAT WE DON'T
- They watch the judge play. Valve, Nintendo and Microsoft put the director behind a real player. We put him in front of a list and do not record what he does in the demo.
- They write one question per test, first. Our items ship as "here is a thing, yes or no", so a NO does not say what failed.
- They make the change big enough to see. Meier doubles or halves. "Sharper tiles" went up at a size no phone screen can show.
- They flip, they do not stack. Same place, no delay, pops out. Two tiles stacked vertically is the worst layout tested, and that is ours.
- They kill their own work before the director sees it. Supercell's team kills seven of ten without asking. Our lanes send first drafts and let him do the killing, which is the approvals queue he hates.
- They cap the session. Review stops at 400 lines and 90 minutes. We hand him 83 and treat item 83 like item 1.

## THE CHANGES FOR THE COORDINATOR
1. One question per item, printed in the header before the picture ("Does this roof read as a roof from the game camera?"). Testable: the vote tab gate refuses an item whose header has no question mark.
2. Before/after is a tap to flip in place, 1:1, in the game's camera, never side by side or stacked. Testable: two frame items render at the same screen position and toggle on tap; stacked pairs count as zero.
3. The Meier rule on the door: a change goes to the tab only as at least a doubling or halving, or a new thing. Smaller changes stay in the lane's own loop. Testable: the item carries a size-of-change line; under 2x or 0.5x bounces to the lane.
4. Burst cap and order: 25 items max, the three with the most downstream work first, cosmetic variants last; the tab says "that's the batch" at 25. Testable: the registry records position in burst and the coordinator reports how many NOs came past position 25; a late NO is re-asked once at the top of the next burst.
5. Every item is a version and every verdict is a baseline. The item says v3 and names what v2 lost; a YES sets the baseline the next cook compares against; a NO with a note returns to the lane that cooked it. Each cooking lane kills at least one candidate per round before anything reaches the tab. Testable: version field and baseline pointer in the registry; the cook gate refuses a round with zero graveyard entries from a cooking lane.

## ONE RULE
THE JUDGE SEES THE DIFFERENCE OR THE ITEM IS NOT READY. An item reaches the director only when its one question is written on it, the change is big enough to flip and see in one tap at full size, and its own lane has already killed the weaker versions.

## FOR PAOLO, IN PLAIN WORDS
When you voted "can't tell difference", you were right and the item was wrong. From now on every item asks you one question, the two pictures flip in the same spot when you tap, and the change has to be big enough to see. The teams kill their own weak stuff before it reaches you, and a batch stops at 25 so the last items get the same eyes as the first.
