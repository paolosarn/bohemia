# BOSSES, 11/17/26: THE LADDER'S 13TH TO 15TH, EACH HIS OWN WAY, AND FEW WORDS (the coordinator's round 'BOSSES full sweep')

The routine (rule 453, Paolo 11/17: 'Do a full sweep, let's have some fun, lotta tokens for this week'): twelve bosses are live and his
vote sheet of 11/14 passed every boss card. Next the ladder's 13th, 14th and 15th (records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md rows
88-90), one per build: each found by a sign, each handing its VERB, each changing the map its own way, each prize landing in his
settlement through HOME BASE's seam and seen on his place's cameras. Rule 441: each fought to the end on the real page, alpha and demo,
a phone both ways.

RULE 454(a) BINDS THIS ROUND (Paolo 11/17: 'every time you have a human talk it's so fucking bad... don't do anything to fix it yet'): no
standing line is rewritten, and a new boss carries the fewest words it can, a name and one line at most, draft. So these three are made
with what they DO to the map and how they FIGHT:
- No rumour on the feed, no asker, no line on the sign's card or on the card after he falls. The sign is WORLD TWO's (its boss_map rows
  for 13 to 15 already stood: a flyer, a tag, a man at the bar); one of yours stands at it and the card carries only the way to his place.
- His ONE line is on his own fight card, two words or three (THE BARBER: 'Next.', THE INK: 'Hold still.', THE DOGS: "Sic 'em."), draft.
- What is left is readout, not talk: the tool's button (FADE, MARK A MAN, TRACK), its number rising off the men (+25 CLOUT, -8),
  the thing's name on the after card (HIS RAZOR IS YOURS) and one plain line of what it does, and one line of what changed on the map
  (HIS LINE IS GONE). A quiet verb posts nothing on the feed.
- The code (slices/bohemia_bosses.js): a row with "quiet": true; talk() drops the empty text box; the after card of a quiet row is one of
  yours (mate()), no line; use() makes no company post for a quiet verb.

## WHAT WAS MADE FIRST (all three, this round's first build carries them)
- THE MEN (tools/bohemia_bosses_thirteen_to_fifteen_11_17_26.py, BOSSES 4's tool imported, nothing added to the wardrobe):
  THE BARBER, a lean man in a white tee under a trades apron, razor lines cut in, an open STRAIGHT RAZOR in his fist, a LEATHER STROP at
  his hip and a BLEACH JUG on his belt. THE INK, a big man in a black tank under a leather vest, a bare skull, INK SLEEVES down both arms,
  ink round his neck, THE NEEDLE (BB's Spiked Impaler) in his fist. THE DOGS, a keeper in an olive tee under a barn coat and a field cap,
  THE WHIP (BB's Thorned Whip), THREE CHAIN LEASHES in his other hand, a DOG WHISTLE on a cord. No purple (0.0 percent each).
- THEIR FACES ON THEIR OWN STRIP: the fight's first face strip is one row and stops at the WebP limit (MEASURED: 127 faces, 16,256 px
  of 16,383); three more failed the save and left it empty (restored from git the same minute). The fight reads further strips the same
  way (fight_rig.json faces.more; CHARACTER's faces_more.webp is one): these three are on faces_bosses.webp.
- THEIR PLACES (tools/bohemia_bosses_thirteen_to_fifteen_places_11_17_26.py): THE BARBERSHOP (before: blinds down, a chain on the door,
  his bleach jugs stacked; after: the door open, the chair out front under a lamp, the pole turning), THE PARLOR (before: every wall
  black with his tags, the window painted out; after: painted over grey, the chair and its lamp inside), THE KENNEL (before: his dogs in
  the runs, the gate chained; after: the runs open and empty, the bowls out). Their pieces on the map: RAZORLINE (his red and white
  stripe across a street, his razor man on it; after, painted over grey), INKTAG (a wall of his tags, ink run onto the pavement; after,
  painted over), PACK (three dogs; after, a stake and a broken chain). The marks the tools leave: a barber pole, the company's mark on a
  wall, paw prints to a stake. MEASURED: paint on a wall did not survive the rig's pass (last round's collector's tooth and the eye
  chart's letters never showed either); a wall built of panels of their own colour does. And the place tool's render keeps old renders
  (masters) and skips them: a fix only shows once they are cleared.
- THE THINGS THEY HAND YOU (tools/bohemia_bosses_what_they_hand_you_11_3_26.py): HIS RAZOR (an open straight razor on his bleach jug),
  HIS NEEDLES (a coil machine and a pot of ink), HIS DOG (a dog standing, its collar and chain; the first two tries read as a llama and a
  horse, the third as a dog).
- THEIR MOVING CARDS: records/target/bosses_thirteen_to_fifteen/VOTE_BOSS_BARBER.webp, VOTE_BOSS_INK.webp, VOTE_BOSS_DOGS.webp.
- THE CODE OF ALL THREE, inert until each one's row ships: (21) HIS LINE, (22) HIS INK, (23) HIS PACKS; the verbs fade, mark, track; the
  quiet rows. The verbs' order: fix, open, purify, pick, blow, press, weld, climb, survey, FADE, burn, TRACK, look, MARK, cook.
- A CUT ON A CREW THAT NEVER FOUGHT (MEASURED: a new crew's condition holds nobody until its first fight, so a razor had nobody to cut):
  bleed() makes the man's whole record first, counted the way the condition counts him (its wholeOf: his card's hitpoints, his kit's
  armour), then takes the blood off; never below one hitpoint.

## THE BARBER (the ladder's 13th: the chair, the blade, the bleach). BUILD 11/17@@

HIS OWN WAY: BLOOD AT A BORDER. While he stands his red and white stripe is painted across every street 4 blocks out from his door
(never in a town; 17 to 20 streets on the gate's two valleys) and his razor men stand on it. The crew crossing his line has a man cut:
8 of the condition's own blood off the man with the most left, never below one, at most once an hour of the game's own clock. Not a
wall, not a toll, not a time cost. When he falls the stripe is painted over grey and nobody stands on it, kept after a reload.
- Found by WORLD TWO's flyer. Nobody asks (rule 454(a)): one of yours stands at the flyer, the card carries the way to his place.
- Fight: BB's Nomad Cutthroat's numbers at 2.2 blood with a Rondel Dagger (it goes through armour), two cutthroats and a thug, on the
  downtown board. His one line, on his card: 'Next.' (draft).
- Verb: FADE. On a town's doorstep (2 blocks out of it), once a day, 1 battery of bleach: +25 CLOUT (BohemiaRenown, Battle Brothers'
  Renown: it raises a job's pay and opens the retinue's slots). The look is how the valley reads you.
- Prize: HIS RAZOR through HOME BASE's seam. Code: slices/bohemia_bosses.js (21) HIS LINE. Data: row THE BARBER, 'line'.
- MEASURED: the first runs read the crew's loss after a crossing at 7.1 and 4.4 of a cut of 8: the walk heals on the way (the condition's
  march rate), so the check reads a loss up to the cut. The card after him first lost his razor: an empty line's box was removed and his
  thing is laid under it; it is hidden now, not removed.
- HIS RAZOR AND THE CAMERAS: MEASURED, his place's plan has 12 lots (records/target/bb/home_base.json, HOME BASE's), and the twelve
  bosses before him hand twelve prizes: every lot holds one, so HOME BASE's own rule keeps the 13th 'in the hall (named on the desk)',
  not on a lot, and CAM 2 cannot see it. That is HOME BASE's plan to grow (rule 445: a place that grows), not this lane's to cut into;
  the gate says it in words (H1 'NOT ON CAMERA') and fails it the day a lot is free and the thing is not on it (planted P6).
- RESULTS: @@
