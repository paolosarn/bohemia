# WORDS -- THE SECOND VOICE PASS: 39 TO 14, AND EVERY QUEST SCENE IS CLEAN
# VAMILY round, 9/23/26, lane WORDS (words-8dqrnq). Row [voice pass] SECOND-VOICE-PASS.
# Nothing registered in VOTE, which is rule 29.

## WHAT GOT DONE
**The banned-phrase debt went from 39 to 14, and all 25 hits in the quest scenes are
gone.** Twenty-six rewrites across twenty scenes, each keeping what the line said and
losing the shape the voice card bans. The ratchet in the gate is re-pinned DOWN to 14, so
the debt can only shrink from here.

## RULE 12 ON THE TWO ROWS ABOVE THIS ONE, AND THIS TIME THE BLOCKERS WERE REAL
First time in four rounds. Both measured, not assumed:
- **[naming screen]** no naming screen exists anywhere in the alpha, and DYNASTY's
  [three names] is still OPEN and unclaimed. There is no mechanism and nothing to write
  into, and under rule 29 words with no thing to ride in are what got seven items killed.
- **[reputation lines]** the companion's four combat lines live inside the fight, which
  is COMBAT's system, and COMBAT is under STOP PRODUCING.

So this row, which is unblocked, is this lane's own measured debt, needs no new surface
and registers nothing.

## THE GATE'S OWN SENTENCE WAS LYING, AND I HAD BEEN QUOTING IT
The gate printed "39 banned-phrase hits still standing in the 22 scenes that have NOT had
a voice pass". **The number never counted scenes.** It walks the whole words book, and at
39 hits **fourteen of them were not in a quest scene at all**: they were in the bark,
exchange, quirk and reaction GENERATORS.

The number was right and the label was wrong, and this lane repeated the label in its
handoff for rounds. Fixed in the gate, with the reason written beside it: a count and its
sentence have to agree, or the sentence is the thing people believe.

## THE FINDING THAT STOPPED HALF THIS ROUND FROM SHIPPING
I fixed the generator half too: six lines in the bark factory, four in the exchange
factory, two each in quirks and reactions. Rebaked. The debt went to 2.

**Then the language gate went red on a line I had never touched.**

Clean tree 85/0, my tree 84/1, and the failing line was an untouched reaction that had
passed for weeks. Chased it properly rather than guessing: restored the reaction files,
still red; restored the three regenerated modules, still red; and the answer was in the
diff of the people module.

**THE SPANISH LEXICON IS DERIVED FROM THE CORPUS.** `ES_ONLY` is regenerated from the
lines that exist, so when my factory edits removed lines, words fell out of the
dictionary, and a DIFFERENT line that still used those words became an "invented word".
Comparing the lists: "hermano" and "las" are in the list on main and gone after my
rebake.

**So fixing six generator lines breaks the dictionary a different line depends on.** That
is a real coupling and it is not this lane's machine to redesign mid-round. The generator
edits are reverted in full. The quest-scene pass, which touches no lexicon, ships.

## AND I STOPPED AFTER THREE ATTEMPTS AT ONE LINE
One reaction line, "You cut that closer que la gente cree", would not pass whatever I did
to it: "closer" flagged, then "mas" flagged, then "sabe" flagged. Three rewrites of one
line is the STOP PRODUCING tell, so I stopped and restored it rather than writing a
fourth. The checker's Spanish word list is narrower than Spanish, and that is a finding
for the lane that owns it, not a line for me to keep polishing.

## WHAT IS LEFT, NAMED
    BOHEMIA_BARKS.json       6
    BOHEMIA_EXCHANGES.json   4
    BOHEMIA_QUIRKS.json      2
    BOHEMIA_REACTIONS.json   2
All fourteen are in generated sources and all of them are fixable the moment the lexicon
coupling is understood. The fixes themselves are written and were proved to work; they
are reverted only because of what they do to the dictionary.

## ROUTED
- **whoever owns `esWordsIn` and the derived `ES_ONLY` list** removing a line can delete
  a word from the dictionary and break an untouched line elsewhere. The generator debt
  cannot be paid until that is either decoupled or the list is seeded rather than
  derived. The exact six-word fix set is in this round's reverted diff.
- **WORDS, standing** a count and its sentence have to agree. I quoted my own gate's
  wrong label for rounds without checking what it counted.

## SOURCES
- `gates/voice_gate.js`: the ratchet, re-pinned 39 -> 14, and the corrected sentence.
- `records/BOHEMIA_WORDS_BOOK.json`, rebaked: 14 hits over 3,148 lines.
- `engine/bohemia_people.js` on main against the rebake: the ES_ONLY diff that explains
  the red.
