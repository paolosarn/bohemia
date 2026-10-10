# BOHEMIA COORDINATOR SCHOOL, ROUND 4 OF 10: MANY LANES, ONE TRUNK (10/10/26)

## THE QUESTION
How do you coordinate many parallel autonomous workers on one codebase without chaos? Bohemia runs about 26 lanes, each a separate Claude chat, all committing to one git main many times an hour, with one coordinator chat holding the board, sweeping commits, and resolving conflicts in the board and the vote registry. The known pains: lanes overwrite each other's handoff blocks, lanes commit conflict markers, two lanes edit the same system, lanes claim rows faster than the coordinator writes them, a lane builds the same unwanted feature four times, and lanes measure differently and disagree. This round joins two literatures: how studios kept hundreds of people on one trunk, and what published multi-agent AI work says about orchestrators, shared files and measured failure modes.

## WHAT I FOUND

1. Brooks: communication paths grow as n(n-1)/2. Six people have 15 links, twelve have 66, and "adding manpower to a late software project makes it later." Source: https://en.wikipedia.org/wiki/The_Mythical_Man-Month . Why it matters here: 26 lanes is 325 possible pairs. Routing everything through one hub turns 325 paths into 26; every time two lanes talk through a shared file instead of the board, a path reopens.

2. Conway: a system's design copies the communication structure of the organisation that built it; Team Topologies' "Inverse Conway Maneuver" shapes the teams on purpose to get the architecture you want. Source: https://concepts.dsebastien.net/concept/conways-law/ and https://runn.io/blog/team-topologies-summary . Why it matters here: the lane list IS the architecture, so its edges must be written as file paths, not job names.

3. Google keeps tens of thousands of engineers on one trunk by "trunk-based development," with branches rarely used except for releases. Source: Potvin and Levenberg, CACM 2016, https://cacmb4.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext . Why it matters here: our one-main rule is right. What we lack is the machinery around it: ownership, small changes, a green gate.

4. Ownership at Google and Chromium lives in OWNERS files per directory, recursive, and an owner must approve every change in their tree. GitHub's CODEOWNERS copies this: path patterns mapped to owners, and admins can require owner approval before merge. Source: https://chromium.googlesource.com/chromium/src/+/5764a5eabf41be7d146731dbbdb05ac6ba94de9b/docs/code_reviews.md and https://docs.github.com/enterprise-server@3.4/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners . Why it matters here: "ONE SYSTEM, ONE SESSION" is a sentence with no machine behind it. The studios make ownership a file a tool reads.

5. Google's review guide lets a reviewer reject a change "for the sole reason of it being too large" and tells authors to write changes "smaller than you think you need to write." Source (mirror of google.github.io/eng-practices): https://eng-practices.gh.miniasp.com/review/developer/small-cls.html . Why it matters here: an hour of work in one commit maximises the chance it collides with someone else's hour.

6. Uber's SubmitQueue (EuroSys 2019) speculatively builds likely-to-pass changes and lands only the ones that succeed, keeping "an always green master branch at scale" at thousands of commits a day. Fowler's original CI article set the floor: each person "integrates at least daily" to escape "integration hell." Source: https://www.uber.com/en-US/blog/bypassing-large-diffs-in-submitqueue/ and https://martinfowler.com/articles/originalContinuousIntegration.html . Why it matters here: our gates run on the lane's machine, so a lane can skip them. A conflict marker on main is proof that nothing stands between the lane and the trunk.

7. Kanban: Little's law says cycle time = WIP divided by throughput; cutting WIP from 20 to 6 at the same throughput cuts cycle time from about 6.7 weeks to 2 with no lost output. Anderson pairs the limit with "make policies explicit." Source: https://www.resumelens.org/blog/kanban/wip-limits-and-littles-law and https://en.wikipedia.org/wiki/Kanban_(development) . Why it matters here: a lane holding three CLAIMED rows finishes none this round, and the board fills with half-done work.

8. Valve's Cabal: for Half-Life 2 each cabal was "four or five people, half level designers and half programmers," because bigger groups "diluted" the meeting, and six teams was already flagged as a cost of "interdependencies." Source: https://combineoverwiki.net/wiki/The_Final_Hours_of_Half-Life_2 and https://gdcvault.com/play/1013450/Valve-s-Design-Process-for . Why it matters here: Valve never ran 26 independent authors; it ran a few small groups with one decision each.

9. Riot's Legends of Runeterra: about a million files, over a hundred contributors, about 100 full pipeline runs a day, risky work in its own branch with its own test environment so main stays stable for a patch every two weeks. Source: https://www.riotgames.com/en/news/legends-runeterra-cicd-pipeline . Why it matters here: a hundred humans needed a hundred builds a day. Our only "main is fine" proof is the Pages deploy.

10. Anthropic's multi-agent research system uses "an orchestrator-worker pattern, where a lead agent coordinates the process"; short task descriptions made subagents "duplicate work, leave gaps, or fail to find necessary information," so each one now gets "an objective, an output format, guidance on the tools and sources to use, and clear task boundaries." The lead saves its plan to memory to avoid "losing previous work when reaching the context limit." Source: https://www.anthropic.com/engineering/multi-agent-research-system . Why it matters here: a two-word label plus one line is a short task description. The four-times feature had an objective but no boundary and no output format.

11. "Lost in the Middle" (Liu et al., TACL 2024): accuracy is highest when the relevant fact is at the start or end of the context, drops in the middle, and the drop worsens as the input grows. Source: https://aclanthology.org/2024.tacl-1.9/ . Why it matters here: the board is about 25,000 tokens. A rule in its middle is the rule most likely to be missed by every lane and by the coordinator.

12. MAST, "Why Do Multi-Agent LLM Systems Fail?" (Cemri et al., Berkeley, 2025): 14 failure modes in three groups, specification issues, inter-agent misalignment and task verification, and the failures mostly stem from system design, not model weakness. Source: https://arxiv.org/abs/2503.13657 . Why it matters here: overwritten handoffs and early claims are misalignment; the four-times feature is specification; the measurement fights are verification.

13. Cognition's "Don't Build Multi-Agents" and its 2026 follow-up: parallel writers make "implicit decisions" they cannot see in each other, so outputs conflict; what now works keeps writes "single-threaded" while many agents contribute intelligence. Source: https://cognition.ai/blog/dont-build-multi-agents and https://cognition.ai/blog/multi-agents-working . Why it matters here: two lanes measuring the same sprite differently is a hidden implicit decision. A number two lanes rely on needs one writer.

14. The agent-PR study (33,596 agent PRs across 2,807 repos): 79.4 percent were open at the same time as another agent's PR on the same repo; a follow-up proposes "verifier-guided coordination" because isolation alone cannot make incompatible changes merge. Source: https://arxiv.org/abs/2607.04697v2 and https://arxiv.org/html/2610.04779 . Why it matters here: concurrency is the normal state for coding agents, and the answer is a verifier between agent and trunk, not a request to be careful.

## WHAT THE BEST DO THAT WE DON'T

- They write ownership as a file a machine reads and block the merge without the owner. Ours is a sentence a lane can forget, and two lanes editing one system is the predictable result.
- They put the gate between the committer and the trunk, on the server, not on the committer's desk. Our gates run where the lane chooses, which is why conflict markers reach main.
- They limit work in progress per worker and make the limit a rule. Our board lets a lane claim as many OPEN rows as it likes, faster than the coordinator can write them.
- They give a worker a boundary and an output format, not a label. Our job line is two words and one sentence.
- They keep the shared brief short enough to be read whole, and one writer per shared number. Our board is 25,000 tokens and two lanes were both allowed to be the measurer.

## THE CHANGES FOR THE COORDINATOR

1. OWNERSHIP IS A FILE. A CODEOWNERS-style map at the repo root gives every path pattern in engine/, slices/, tools/, laws/, records/ and the vote registry exactly one lane, with the coordinator the only owner of the board and the handoff index. A gate refuses a commit that touches another lane's path unless the commit message carries a handoff token the owner wrote. Test: zero cross-lane edits land on main in a week without a token, per the gate's log.

2. WIP LIMIT OF ONE. A lane holds one CLAIMED row at a time; the board gate refuses a commit that claims a second while the first is open. Test: no lane section ever shows two CLAIMED lines, checked at every sweep.

3. THE TRUNK HAS A SERVER-SIDE DOOR. A workflow on push to main runs the conflict-marker scan, the handoff-block scan and the board gate on main itself, reverts a failing commit, and writes a bounce-back line in the lane's section. Test: a commit with "<<<<<<<" anywhere is gone from main within one workflow run, with no human step.

4. A JOB CARD HAS FOUR FIELDS. Every OPEN row carries objective, boundary (the paths it may touch, from the ownership file), output format (what the SHIPPED line must point at) and ship test before anyone may claim it. Test: a second attempt at a feature whose output is already SHIPPED fails the board gate, so the four-times feature cannot recur.

5. A 2,000-TOKEN FRONT PAGE AND A SWEEP ON A CLOCK. The rules every lane must read fit in 2,000 tokens, gated; everything else lives in per-lane sections and laws. Every round the coordinator sweeps in the same order (conflict markers, handoff loss, cross-lane edits, double claims) and writes the four counts on one line of the board. Test: the four counts exist for every round.

## ONE RULE

OWNERSHIP IS A FILE, THE GATE IS ON THE TRUNK, AND EVERY LANE HOLDS ONE JOB. Every path has one owner lane written in a file a machine reads, the checks that protect main run on main and not on the lane's desk, and no lane may claim a second job while it holds one.

## FOR PAOLO, IN PLAIN WORDS

Big studios keep hundreds of people on one shared build by writing down who owns which part, by letting a machine check every change before it lands, and by making each person finish one job before taking the next. We have the one shared build but not those three locks, which is why chats step on each other and the same thing gets built four times. The fix is three plain rules the manager enforces with tools, not with reminders.
