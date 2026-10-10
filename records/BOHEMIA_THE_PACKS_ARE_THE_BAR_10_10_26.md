# THE PACKS ARE THE BAR (PLUMBER 10/10/26, row [the pack gate]; rules 82 and 82a)

PAOLO 10/10, the seventh votes: "all the art we made looks nothing like the assets we downloaded... AI
slop"; then "the cars is an asset we downloaded; a lot of the original street tiles and sidewalks we
downloaded; look again." Rule 82: no art sheet goes to VOTE without its reference twin and the three
biggest differences, and "vote_tab_gate refuses an art item without one (PLUMBER leg)". Rule 82a: every
tile, prop, car, street, sidewalk, kerb, marking, lamp and house skin on a fight board and a settlement
picture comes FROM the approved corpus, never cooked fresh; "PLUMBER [the pack gate]".

## THE ANSWER FIRST

**Measured: 185 of the 201 ground pictures in the game (fight boards, settlement ground, the settlement's
lot sprites) carry no proof they were cut from his packs, and 8 cook tools that make them name no approved
bank at all.** The 16 that do are COOK TWO's first street kit, cut from his street pools, with a manifest
naming every pool tile it stamped. That is the shape the rest has to reach.

Three machines now hold it:

| | what it holds | today |
|---|---|---|
| **tools/bohemia_pack_corpus.js** | the approved corpus as data: the 7/27 index's table plus rule 82a's list, 21 banks, and a resolver for a tile key | 20 of 21 on disk; reference/art_bank/ is COOK's to make |
| **THE PACKS ARE THE BAR** (gates/pack_gate.js) | no new ground picture without a pack manifest, no new ground cook tool that skips the corpus, every manifest key names an approved tile | green, with the debt above listed in gates/pack_gate_baseline.txt (only shrinks) |
| **VOTE TAB, the twin leg** (gates/vote_tab_gate.js) | an art sheet carries `twin: { src, diffs }`: the reference (a file, or `pack:<pack>#<idx>` that he judged UP) and three differences in plain words | **red: 4 art sheets registered since rule 82 have no twin** (COOK 2, PORTRAIT 1, CHARACTER 1); 23 older ones counted, not failed |

## WHAT COUNTS AS PROOF

A picture is from the packs when a manifest (any .json in its own folder) names it and lists the approved
tiles it was cut from:

    pieces: { road_ew: { src: "road_ew.webp", keys: [["street", 0], ["street", 1], ...] } }

A key is `[pool, index]` (a pool by name in any pool bank), `{pack, idx}` (UP in the confirmed set) or
`{bank, pool?, idx}`. `["cross", "paint colour"]` is a colour measured off that pool's own tiles, which rule
87 allows ("your own paint only on weather, wear and light"); the pool must exist. A piece drawn by hand on
purpose says so in `exception` with its reason. A wrong key is never debt: M1 is red on the first one.

## HOW IT WAS PROVED

- Six planted cases in the pack gate (a resolving manifest covers; a key past the end, a pool no bank has
  and a pack tile he judged DOWN are caught; an exception with a reason covers; a cook tool that names no
  bank is caught, one that reads the street pools and one that only reads the boards are not).
- Mutations on the real tree, restored after: a new board with no manifest (P1 red), a new cook tool that
  names no bank (K1 red), one key in COOK TWO's manifest pushed past its pool (M1 red, and its picture
  falls out of the covered set).
- Five planted rows in the twin leg (a cook sheet with no twin; a TUNING table filed as "tile" is not art;
  a face with a pack twin passes; a twin not on disk; two differences instead of three).
- Two measuring mistakes caught before landing: the first tool detector matched the bare word "settlement"
  (43 tools, most of them city patches); the second, "where does the output go", missed the board cooks
  that build their paths from a shared constant. The one that stands: a cook or factory tool by name that
  names a ground folder and saves pictures (8).

## WHERE IT GOES NEXT

The debt is paid by re-cutting from the packs with a manifest (COOK TWO for the ground, COOK FOUR for the
places, rule 87), and the gate prints when a debt line can come off. The twin leg's four reds are one line
each in COOK's, PORTRAIT's and CHARACTER's sections.
