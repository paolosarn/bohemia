# THE TOKEN DIET (coordinator, 9/4/26, on Paolo's order)
# "is there any part of the structure that's unnecessarily token heavy? can we
# slim it down... maybe even in the exact same way just I don't want it to be
# super token heavy... quicker, less tokens."

## 1. WHAT WAS MEASURED (bytes / 4 as a token estimate)
```
file                              lines      bytes    ~tokens   who pays, when
CLAUDE.md                         1,716    135,120     33,780   EVERY chat, EVERY message (auto-loaded)
00_START_HERE_NEXT_SESSION.md    79,379  5,168,670  1,292,000   every session is told to read it first
BOHEMIA_BACKLOG.md               10,716    772,850    193,000   a chat reading its own section
VAMILY.md                           319     35,739      8,900   every chat, every VAMILY
VAMILY_PRIMER.md                     15      1,545        390   once
```
Two files are the whole problem.

**CLAUDE.md is the per-message tax.** It is loaded into the context of every
message in every one of 17 chats. At ~34K tokens that is 34K paid before a
word is typed, on every turn, everywhere. 97.5 KB of its 135 KB is one
section, THE LAWS THAT GOVERN EVERYTHING, which retells the history of 48
rulings that each already exist as their own file in laws/.

**The handoff is a pile.** 1,241 blocks, 236 of them marked LATEST because
nothing was ever demoted. By the handoff gate's own lane definition (a
slug in parentheses), 14 lanes are live, and the newest block of each is
61 KB in total. The other 5.1 MB is history that git already holds. No
session can read it; sessions read the top and grep, so the file is
functionally its first few hundred lines already.

## 2. THE RESEARCH, IN ONE PARAGRAPH
Anthropic's own guidance and every practitioner write-up agree: the
project instruction file is read at the start of every session and held in
context for the whole session, on every message, never evicted, so a
5,000-token file costs 5,000 tokens per turn whether you send two messages
or two hundred. The advice is to keep it under about 200 lines, as a
lookup table of stable rules with links out to detail, and never to paste
design history or meeting notes into it. Ours was 1,716 lines of exactly
that history.

## 3. WHAT WAS DONE THIS TURN (verbatim moves, nothing deleted)
- **CLAUDE.md folded: 135 KB to about 24 KB, ~34K tokens to ~6K.** The
  VAMILY top block stays first. The pillars are one paragraph. The 9/4
  structure is one paragraph of pointers. The 48 laws are ONE LINE EACH
  with the path to their full file and their gate. HOW PAOLO WORKS, SHIP
  FLOW, ONE-LINK LAW, TRUTH HIERARCHY, PARALLEL SESSIONS, STOP PRODUCING,
  THE AUTONOMY DOCTRINE and THE COORDINATOR SESSION stay verbatim, because
  gates read exact strings out of them and because they are the working
  rules. Everything folded went, word for word, into
  laws/BOHEMIA_LAWS_MASTER_9_4_26.md, which the truth hierarchy already
  names as the consolidated tier. Canon index regenerated.
- **The handoff archive is prepared, not applied.** gates/handoff_gate.js
  forbids shrinking the file by more than 20% in one write (it was written
  after an accidental truncation), and the coordinator does not write
  gates. So: archive/handoffs/HANDOFF_ARCHIVE_9_4_26.md holds every byte of
  today's file, archive/handoffs/HANDOFF_SLIM_READY_9_4_26.md holds the 14
  newest blocks ready to swap in, and SHARED [handoff cut] is the top of
  the shared queue: amend the gate so a deliberate archive passes, then
  swap. One commit, a 98% cut.
- **SHARED [backlog archive]** queued behind it: the backlog's done and
  dead rows to records/backlog/, same shape.

## 4. WHAT IT SAVES, HONESTLY
- Per message, per chat: about 28K tokens off the fixed tax. Across 17
  chats at a few dozen turns a day each, that is on the order of ten
  million tokens a day that were buying nothing, and every reply arrives
  faster because the model is not re-reading a history book first.
- The handoff cut saves less in tokens (nobody could read it anyway) and
  more in time and truth: a session that opens it will finally see the
  whole fleet's real state in one screen instead of the top of a pile.
- The structure itself (VAMILY.md at ~9K, read once per VAMILY) is cheap
  and stays exactly the same shape.

## 5. WHAT IS NOT WORTH SLIMMING
- The laws and records folders: nobody loads them wholesale; a chat reads
  the one it needs.
- VAMILY.md's front page: sixty lines is the price of never pasting.
- Commit messages and lane handoff blocks: they are the memory; git is
  the memory.

## 6. KNOW WHAT I DO NOT KNOW
- The token numbers are bytes divided by four. Real tokenisation varies;
  the ratios are what matter and they do not move.
- I have not measured the per-turn cost of each lane's own habits (how
  much of the backlog a chat actually reads, how many gates it runs). The
  two files above dwarf everything else, so that is second-order.
