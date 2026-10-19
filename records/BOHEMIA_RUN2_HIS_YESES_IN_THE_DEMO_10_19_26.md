# RUN TWO [his yeses in the demo] -- 10/19/26

Row: WHICH-YES-IS-PLAYABLE-AND-WHICH-IS-NOT-YET (Paolo 10/18: 'the demo has not been fixed and updated in a long
time'; rule 118: he must see the truth, not the coordinator's word). Shipped d4c96f9e.

## What he gets

At the foot of the VOTE tab, under the comment box: YOUR YESES SINCE 10/16, a sum ("22 of 97 are in the demo
(build 10/18c).") and one line per YES: a green IN THE DEMO tag, or a grey NOT YET tag with "COOK 4 has it". Starred
ones carry the star. A YES he taps on the phone joins the list the second he taps (NOT YET). Nothing above the fold
moves (measured: his first card sits at the same point with and without the list).

## How the machine decides (tools/bohemia_run2_yes_in_the_demo.js)

1. CARRIERS, from git: for each card, the game files (slices/, engine/, records/target/, never the VOTE machinery or
   the dev pages) changed by its commit AND by every commit with the same lane and [two-word label] in its subject
   (a card's sha is often the commit that only registered it). A folder with more than 8 changed files (a rig's 400
   frames) is kept as the folder. records/target/BOHEMIA_YES_CARRIERS.json, 328 commits, 35 shas no history holds
   (typos like '9/27', rebased or branch-only shas).
2. STATUS, no git: what the demo's own cut reaches. Every file name and every name-building folder ('rig_faces/')
   said by slices/BOHEMIA_DEMO.html and, page by page, by what it loads; only slices/, engine/, records/target/ (the
   only folders the site serves); comments stripped first (a name in a comment is not a load) except the banners of
   engine files inlined verbatim (those ARE loads); the dev frames the cut leaves inert (VOTE, LOOK, WORDS, ART, UI,
   SLICE, LIFE, the old MAP) never crawled. The demo reaches 499 files. A YES is IN when a carried file is reached.
   records/target/BOHEMIA_YES_IN_THE_DEMO.json.
3. The deploy (.github/workflows/pages.yml) runs STATUS right after it cuts the demo, before the site is assembled,
   continue-on-error, so the list on his phone is measured against the demo he is served. The tab reads the build
   from slices/BOHEMIA_DEMO_STAMP.txt, the one line the cut writes, live.

## Three traps found and closed on the way (each one made the list lie)

- THE SHALLOW EDGE: in a shallow clone the oldest commit shows every file in the tree as added; ANIMATION's ragdoll
  commit read as 600 engine files and every card on it read IN. A commit is read only where its parent is there.
- RECORDS/TARGET AS A FOLDER: the crawl picked up 'records/target/' as a name-building folder, so every VOTE sheet
  read as loaded (83 of 97 IN). Folders count one level under slices/ or engine/, two under records/target/.
- NAMES IN COMMENTS: the fight's comment 'Colours: records/target/BOHEMIA_STYLE_PALETTE.json' read three of
  DIRECTION's cards IN. Comments are stripped, inlined-engine banners kept.

## What it cannot see (it errs to NOT YET, never to IN)

A card whose commits under its label touched no game file (RUN TWO's own [faces not tiny bodies], b57173f, whose
screen change rode another label) reads NOT YET though the faces are on the crew screen; a shared file (one engine
file many things live in) reads IN for every card that touched it. The first is the common error and it is the safe
one: he is told less than is true, never more.

## Right now (build 10/18c)

22 of 97 IN: RUN's map people, the streets joining, the gangs and the truck on the map; COMBAT's both teams, the line
kept, guns two tiles, the gunman with no ring, no outline, the fat map, the marks; SOUNDS' desert, the map's desert,
the settlement heard, the title; ANIMATION's shadow line; RUN TWO's arrival, who wears what, the starred and fresh
faces, the boards' people, the bar's news. NOT YET 75, most of them art candidates (COOK, COOK TWO, COOK FOUR,
CHARACTER, DIRECTION, ANIMATION) that wait on rule 101's one-at-a-time FINAL, plus TUNING's research cards.

## Gate

NEW GATE HIS YESES IN THE DEMO 15/0 (in the suite): the machine never lies (every committed IN re-proved against the
current cut and the carriers), it says IN nowhere a fresh run would not, the carriers are git's own (re-read where
this clone can), the deploy step is there; on his phone one line per YES, the build read live (planted 99/99z), a
planted YES IN or NOT YET as the file says, nothing IN with the file gone, a tapped YES joins, under the comment box,
nothing above the fold moves, no title typed. vote_tab 51/1 (DYNASTY's two whys).

Also this round: EYES' new 5686 px card (eyes-every-face-beside-its-body-10-19) was cut to its first man (Bookie,
his pale body beside a dark face) so the vote tab gate's one-thing leg stays green and his card is readable.

VOTE run2-his-yeses-in-the-demo-10-19 (slices/vote/RUN2_HIS_YESES_IN_THE_DEMO_10_19.webp, tools/bohemia_run2_yeses_shots.js).
