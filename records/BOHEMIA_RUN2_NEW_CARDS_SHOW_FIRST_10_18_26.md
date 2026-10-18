# RUN TWO [new cards show first], 10/18/26
# His bug, first on the board: Paolo 10/18, 'the votes aren't loading what you're telling me'
# (records/BOHEMIA_PAOLO_THE_VOTES_ARENT_LOADING_AND_THE_DEMO_IS_OLD_10_18_26.md).

## WHAT WAS WRONG (measured)
1. The tab showed RED first and alone, and put everything else behind MORE, including every card the coordinator had
   not tagged yet. The coordinator stopped tagging after sweep AP, so for hours his first screen showed nothing new.
2. A second, quieter cause, found here: 'newest first' meant 'last in the file'. The registry's readme says append, but
   eight 10/18 cards had been put at the HEAD of items[] (two of them mine this round, one mine before), so the tab drew
   them as the oldest things in the file, under 9/12 cards. At this commit: 10 red, 1 untagged (the refugees card),
   and that one was behind MORE.

## WHAT CHANGED
- slices/BOHEMIA_VOTE_TAB.html: his first screen is RED, then anything nobody has tagged yet, both newest first,
  together at most the cap (twelve, from the coordinator's file); YELLOW and whatever is past the cap wait behind MORE;
  GREEN and GRAY never show. A tag only ever demotes. NEWEST FIRST is the day the card says it was made, then its place
  in the file, so a card put at the head of the file is not buried.
- records/target/BOHEMIA_VOTE_REGISTRY.json: my two cards moved to the end, the way the readme says (my objects only).
- gates/vote_tab_gate.js: the front leg reads red, then untagged, newest first by day; NEW CARDS SHOW FIRST plants two
  untagged cards (one at the head of the file with the newest day, one appended): with nothing tagged both lead his
  first screen; with the coordinator's real tags both sit right after the reds while the cap has room; tagged yellow a
  card waits behind MORE, tagged green it is nowhere. CONTROL: on the old tab the same gate is 37/5 (the front, the
  fold count and the three planted legs red); on the new tab 41/1, the one red DYNASTY's two whys (red on main, not
  this lane's).

## ROUTED
- THE COORDINATOR: tagging still matters (it is how a card is demoted), but a sweep that forgets no longer hides new
  work. The cap stands at twelve; red still shows before untagged, so twelve reds still fill his screen.
- EVERY LANE: append to items[] (the readme's word). The day sort covers a card put at the head, but the file reads
  cleaner appended.

[bb school line] Battle Brothers' event log puts the newest thing at the top and never asks you to open a folder for it;
the tab now does the same with anything nobody has sorted.
[analog horror line] The new card is just there when the tab opens, at the top, waiting, like a tape somebody left on the
counter overnight.
