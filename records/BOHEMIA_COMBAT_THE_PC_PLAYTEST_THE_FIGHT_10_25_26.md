# COMBAT 10/25: THE PC PLAYTEST, THE FIGHT'S PART (rule 164, items 12 to 17 and 26)

Paolo 10/24 evening, on his PC: "I'm playing this on my PC and I'm so fucking impressed, we've come such a long way, but I
have a lot of feedback." The fight's items, in the coordinator's order: (1) the AUTO colour before the first tap; (2) who is
on his team; (3) house heights that mean something; (4) switch weapons from two bag slots; (5) the fight's UI better than
Battle Brothers', mobile first. Gate: THE PC PLAYTEST: THE FIGHT (gates/the_pc_playtest_the_fight_gate.js). Tab: COMBAT.

## 1. THE AUTO COLOUR BEFORE ANYTHING (item 12)
His words: "before I can even press anything... I should know the colour of the Auto button."

MEASURED FIRST: every fight the demo's door opens starts on the formation (deploy), and the odds read never ran there: 40
looks over 11 s on a six-against-six suburb fight, 0 runs, no colour. The read waited out the formation, the open's 4.5
beats and his first turn (and never ran at all when their side moved first), then played its 24 runs 6 ms a frame.

BUILT: the same copy of the rules (the fight-data and fight-rules scripts, unchanged) plays its runs in a Web Worker, off the
frames. The read is posted the moment the fight is dealt, before the board bakes; on the formation it reads the line as it
stands (the key is where his men stand: a man moved is a new read); the open waits for the first full read (12 runs), never
more than ODDS_WAIT_MS 1.5 s, so the colour is on the tin the frame the board comes up. The glow (a clean win nearly
certain) shows on the formation too, and a tap on it plays the fight out at the top pace from the line he set. When their
side moves first the read still runs (no read yet). No worker on the phone (or FIGHT_OPTS.oddsWorker false): the frames'
6 ms slices, now also on the formation and the open, the tin repainted the frame the read lands. The real die is never
touched (the worker has its own).

NUMBERS: six against six on this box, the read posted 780 to 930 ms before the board came up and full 69 ms before it;
12 runs 450 ms on the main thread (the worker spends the same off it). One against five reads red at the first frame
(alpha 0.62), three against one glows green at the first frame.

## 2. WHO IS ON MY TEAM (item 17)
His words: "it's hard to tell who's on my team." His 10/2 words (rule 67): "health and armour bars above the people is cool."

MEASURED FIRST: bars were drawn only over the man acting or the man picked (67(a), Battle Brothers' habit from the research,
not his words), so on the board nothing told his men from theirs but where they stood; the turn strip's faces carried a
frame 4% of the face wide (1.4 points), unreadable.

BUILT: every man on the field wears his bars over his head (armour, then health), as wide as the man, three points tall, on a
rim: GOLD (#d9a85a) for his with green health, RUST (#b8452f) for theirs with red; the man acting and the man picked a rim
brighter. Nothing on the ground (rule 46f: no ovals, no discs, no outline, his 10/17 NO on the coloured outline). The faces
in the turn strip and the bar's big face wear a band across the foot and a frame (7%) in the same gold or rust, so the
strip reads mine-theirs-mine at a glance. Read off the drawn pixels on a phone and a computer: 6/6 his, 6/6 theirs, the
strip 9/9. THE REBUILT FIGHT PLAYS' bars leg re-aimed (bars over every man on the field).
