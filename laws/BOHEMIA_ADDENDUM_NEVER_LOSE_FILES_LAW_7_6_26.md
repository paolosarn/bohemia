# BOHEMIA ADDENDUM: THE NEVER-LOSE-FILES LAW (7/6/26)
Filed after the music recovery incident. Claude told Paolo his songs were
not made in this chat. They were. The full session transcripts were on
disk the entire time and Claude asserted loss without searching them.
23 songs and 31 voices were recovered from transcripts within the hour.
This law makes that failure impossible to repeat. It binds every future
session. Upload this to the project; it is read-before-code canon.

## LAW 1: THE TRANSCRIPTS ARE THE MEMORY
When a chat gets compacted (even three times), the compaction summary is
LOSSY but the machine keeps the FULL uncompacted conversation at:
    /mnt/transcripts/*.txt        (one file per compaction, timestamped)
    /mnt/transcripts/journal.txt  (catalog describing each transcript)
Every line of code ever shipped, every song, every verdict, every patch
script lives there verbatim. Compaction deletes NOTHING from disk.
SCOPE, CRITICAL: transcripts are PER CHAT. Within one chat they survive
every compaction (one file per compaction; a 3x-compressed chat has 3+
transcript files, grep EVERY one). But a NEW chat cannot see an old
chat's transcripts. ACROSS chats, the only things that survive are the
PROJECT files and the repo/carry files shipped at wrap. That is why Laws
3 and 4 are the real cross-chat protection and transcripts are the
in-chat safety net. Both layers are mandatory; neither substitutes for
the other.
THEREFORE: Claude is FORBIDDEN from saying anything was "not made in this
chat", "lost", "not in any file", or "unreachable" until it has run, at
minimum:
    ls /mnt/transcripts/
    cat /mnt/transcripts/journal.txt
    grep -c "<THE THING>" /mnt/transcripts/*.txt
and shown the results. An empty grep across ALL transcripts is the only
acceptable evidence of absence. Asserting loss without this search is the
exact failure this law exists to kill.

## LAW 2: THE RECOVERY PLAYBOOK (the techniques that worked, verbatim)
Transcripts store tool calls JSON-escaped, sometimes 2-3 levels deep
(\\n, \\u2014, \\\\\" nesting). Recovery procedure:
1. Search RAW first, then progressively unescape 1x, 2x, 3x:
   s.replace(/\\\\u2014/g,'—').replace(/\\\\n/g,'\n') etc. Run the hunt at
   EVERY depth; different blocks live at different depths.
2. Extract objects by BRACE BALANCE from the anchor (never lazy regex to
   the first closing brace; that truncated 21 songs at the inst field).
3. VALIDATE every extracted block by eval / new Function before trusting
   it. Keep the LAST valid occurrence (latest iteration wins).
4. If an emission got cut by a transcript message boundary, find the
   GENERATOR that produced it (the python/js patch script is usually in
   the same transcript) and reconstruct byte-exact through its own
   emission function. That recovered 4 songs today.
5. Back-walk technique: find the unique title/name string, walk backwards
   to the nearest object opener, balance forward from there.

## LAW 3: SAME-TURN REPO LAW (prevention beats recovery)
A build file (ALPHA html) is NOT a save file. Every batch of judged or
cooked assets (songs, sprites, dial patterns, anything Paolo verdicts)
ships as a PLAIN TEXT REPO FILE presented via present_files THE SAME TURN
the verdicts land: BOHEMIA_MUSIC_REPO.txt, BOHEMIA_SPRITE_REPO.txt, etc.
The repo carries the raw data entries + the verdicts + the date. At wrap
the repo files go to the PROJECT with the addenda. If it only exists
inside a build html or inside the chat scroll, it is not saved yet.

## LAW 4: WRAP MANIFEST LAW
At every wrap, before presenting, Claude diffs: everything CREATED or
JUDGED this session vs everything in the carry package + project upload
list. Anything created but not shipping gets named and shipped. A wrap
that presents a subset of the session's work is a failed wrap.

## LAW 5: BURDEN OF PROOF
"I don't have it" is a claim that requires evidence, never a first
answer. Search order before any such claim, results shown each step:
    1. /mnt/transcripts/ (full history, survives all compactions)
    2. /mnt/user-data/uploads/ (everything Paolo ever handed over)
    3. /mnt/user-data/outputs/ (everything shipped this session)
    4. /mnt/project/ (everything banked)
Paolo's word about where something happened outranks the compaction
summary. If he says it was made here, it was made here. Search harder.
