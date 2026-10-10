# BOHEMIA COORDINATOR SCHOOL, ROUND 9 OF 10: THE MEMORY (10/10/26)

## THE QUESTION
How do the best studios and engineering orgs keep design knowledge current and small, so a new pair of hands does the right thing on the first read? Bohemia's memory is a board of 89 rules and about 1,600 lane rows, 100 plus law files under "newest date wins", hundreds of records, a handoff file every lane rewrites, a canon index, and a CLAUDE.md that grew into a constitution. Rules pile up and contradict, old laws get cited, lanes overwrite fresh copies with stale ones, the board is too long to read every round, and the coordinator's own context fills and gets summarized. This round asked what living design docs, decision records, PEP and KEP processes, note-taking methods, Wikipedia, open-source governance, onboarding docs and the current guidance on memory for LLM agents do about exactly that. Sources marked (read) were fetched first-hand; the rest come from search summaries and are quoted only where the summary carried the words.

## WHAT I FOUND

1. The always-loaded file must be small, tested per line. Anthropic's Claude Code guide: "For each line, ask: Would removing this cause Claude to make mistakes? If not, cut it. Bloated CLAUDE.md files cause Claude to ignore your actual instructions!" Also: "If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost," and "If you emphasize many lines, none of them stands out." Source (read): https://code.claude.com/docs/en/best-practices
Why it matters here: our CLAUDE.md is almost all emphasis and almost all history, and 26 lanes load it every round.

2. Advisory text and enforced behaviour are different tools. Same guide: "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic," and "If Claude already does something correctly without the instruction, delete it or convert it to a hook." Source (read): https://code.claude.com/docs/en/best-practices
Why it matters here: our gate law is missing its second half: once the gate exists, the sentence leaves the board.

3. Context is a budget, and everything loaded up front spends it. Anthropic's context engineering post names "context rot," sets the goal as "the smallest possible set of high-signal tokens," and notes "CLAUDE.md files are naively dropped into context up front." It recommends an agent that "regularly writes notes persisted to memory outside of the context window" and sub-agents that return "only a condensed, distilled summary." Source (read): https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
Why it matters here: the coordinator's context filling and being summarized is the predicted result of loading the whole board every time.

4. A lead agent writes its plan down before it can be truncated. Anthropic's research system saves the lead's plan "to Memory to persist the context, since if the context window exceeds 200,000 tokens it will be truncated," has sub-agents "pass lightweight references back to the coordinator," and will "spawn fresh subagents with clean contexts." Source (read): https://www.anthropic.com/engineering/multi-agent-research-system
Why it matters here: the round record should be written early and kept open, not written at the end after the summary ate the detail.

5. Fewer fresh docs beat many stale ones, and delete is the default. Google: "A small set of fresh and accurate docs is better than a large assembly of 'documentation' in various states of disrepair"; "Change your documentation in the same CL as the code change"; "Default to delete or leave behind if migrating." Source (read): https://google.github.io/styleguide/docguide/best_practices.md
Why it matters here: we archive and append; we almost never delete a sentence from a live file.

6. Decision records supersede by pointer, not by edit and not by date. Nygard's ADR keeps one decision per short file with a status; when a decision changes "a new ADR should be created," and the tool "changes the status of ADR 9 to indicate that it is superceded by the new ADR." Also: "Each ADR should be about one AD, not multiple ADs." Sources (read): https://github.com/npryce/adr-tools and https://github.com/joelparkerhenderson/architecture-decision-record ; overview https://www.martinfowler.com/bliki/ArchitectureDecisionRecord.html
Why it matters here: "newest date wins" makes every reader of 100 laws do the resolution; a pointer makes the writer do it once.

7. Python does the same with headers. PEP 1: "PEPs are no longer substantially modified after they have reached the Accepted, Final, Rejected or Superseded state"; a replaced PEP carries a "Superseded-By header," and "The newer PEP must have a Replaces header." Procedure pages are the exception: "Active (Informational and Process) PEPs may be updated over time." Source (read): https://peps.python.org/pep-0001/
Why it matters here: a ruling should freeze, a procedure page may live; our laws mix the two.

8. Kubernetes puts status in a data file. Every KEP has a kep.yaml with "status: provisional|implementable|implemented|deferred|rejected|withdrawn|replaced," owning-sig, stage and "replaces"; "Any KEP marked as provisional is a working document and subject to change." Sources (read): https://github.com/kubernetes/enhancements/blob/master/keps/README.md and https://github.com/kubernetes/enhancements/tree/master/keps/NNNN-kep-template
Why it matters here: a generated canon index is only as good as the headers it parses, and ours are parentheticals in titles.

9. The one-page design replaced the GDD nobody read. Stone Librande's GDC 2010 talk replaced long design documents with annotated diagrams on one page; he reused it for SimCity in 2013. Sources: https://www.gamedeveloper.com/design/video-one-page-designs and https://www.gamedeveloper.com/design/pushing-the-limits-in-simulating-a-city-one-page-at-a-time
Why it matters here: a law that cannot fit one page is a law a lane skims.

10. At Supergiant the build is the document. Amir Rao: "The game is the design document." Kasavin, 2011: on a small team "ideas don't need to be over-documented or over-vetted." Sources: https://tech.yahoo.com/gaming/articles/game-design-document-hades-2-163418787.html and https://gameinformer.com/b/features/archive/2011/09/09/bastion-afterwords
Why it matters here: a rule with a gate is in the game; a rule marked "gate OWED" is a GDD paragraph, and we carry over a dozen.

11. Long-lived notes get distilled in layers, just in time. Forte's progressive summarization keeps the raw capture, then bolds, highlights, and finally writes a summary in your own words, only when the note is reused. Ahrens' Zettelkasten keeps one idea per note with explicit links carrying the value. Sources: https://concepts.dsebastien.net/concept/progressive-summarization/ and https://nesslabs.com/how-to-take-smart-notes
Why it matters here: our records are layer one forever; the 9/4 laws master was the one time we did layer four.

12. Wikipedia fights rot with a machine that flags. A dead-link template drops the page into a category and InternetArchiveBot adds archive links; "content drift" is tracked the same way. Source: https://en.wikipedia.org/wiki/Link_rot
Why it matters here: a cited superseded law is our dead link, and nothing flags it when cited.

13. Keep the kinds of document apart. Diátaxis splits docs into tutorials, how-to guides, reference and explanation and warns that mixing them hurts the reader; Canonical adopted it. Sources: https://diataxis.fr/ and https://ubuntu.com/blog/diataxis-a-new-foundation-for-canonical-documentation
Why it matters here: one Bohemia law is rule, history, procedure and Paolo's words in one paragraph.

14. Onboarding docs survive with a named owner and a question log. Vendor guides agree: one owner per doc ("shared responsibility often means no responsibility") and tracking the questions the last three new hires asked. Sources: https://rivereditor.com/blogs/write-developer-onboarding-guide-30-days and https://falconer.com/guides/reduce-engineer-onboarding-time/
Why it matters here: every lane is a new hire every round, and its [PENDING] lines and bounce-backs are the gap list nobody mines.

## WHAT THE BEST DO THAT WE DON'T
- They retire a rule by pointer the day it changes. ADRs, PEPs and KEPs stamp "superseded by X" on the old file in the same commit as the new one. We date the new file and make 26 lanes compute the winner; CLAUDE.md still says "THE STEP IS A HOUSE (9/15) is SUPERSEDED" beside its replacement.
- They keep the always-loaded file to what changes behaviour. Anthropic's test would strike most of CLAUDE.md as history. The front page's suite line alone runs past 2,000 words of sweeps P through AF.
- They delete. Google defaults to delete; we append and archive. 89 rules exist because no rule has been removed when its gate landed.
- They put status in a field a machine reads. Ours lives in parentheses inside titles, so the canon index cannot say which of 100 laws are live.
- They make the build the document. "Gate OWED" is tolerated as a status; an owed gate is a paragraph nobody enforces.

## THE CHANGES FOR THE COORDINATOR
1. SUPERSEDE BY POINTER. When a law or rule amends an old one, the same commit adds line 2 to the old file, "STATUS: SUPERSEDED BY <new file> (<date>)", and the new file carries "REPLACES: <old file>". A gate greps every law that says "supersedes", "amends" or "dead" and fails if the named file lacks the pointer. Test: zero superseded laws without the pointer.
2. A FOUR-LINE HEADER ON EVERY LAW: STATUS (ACTIVE, AMENDED, SUPERSEDED, PARKED), OWNER lane, GATE (path, or OWED since date), REPLACES / SUPERSEDED-BY. The canon index is generated from headers only. Test: the generator exits red on any law missing a line.
3. CUT CLAUDE.md TO BEHAVIOUR. Every line must pass "would removing this make a lane do the wrong thing." A rule with a green gate shrinks to its title and gate name; measurements and history move to records with a link. Test: the file lands under one third of today's word count, and a lane given only the short file plus the index completes a sample row correctly.
4. THE FRONT PAGE IS A DASHBOARD, NOT A LOG. Suite, deploy, cut, cook and release lines each become one sentence of current state plus a link to the records file holding the sweeps. Test: a gate caps the front page's word count and it never rises round over round.
5. THE COORDINATOR WRITES ITS ROUND RECORD FIRST. The round's records file is opened at the start and each decision is written the moment it is made, before the context fills. Each lane's handoff lives in its own file (ruled 9/13), read back first and rewritten last. Test: no coordinator round closes without its record committed; no lane commit touches another lane's handoff file.

## ONE RULE
RETIRE BY POINTER, NOT BY DATE. The round a rule changes, the old rule gets one line naming what replaced it and the live file gets shorter, not longer.

## FOR PAOLO, IN PLAIN WORDS
The best teams keep one short page of rules that are true right now, and they throw an old rule out the moment a new one lands. We keep every rule we ever wrote and ask each chat to work out which one still counts. The fix is simple: when a rule changes, the old one gets a note saying what replaced it, and the rule book gets shorter every time, not longer.
