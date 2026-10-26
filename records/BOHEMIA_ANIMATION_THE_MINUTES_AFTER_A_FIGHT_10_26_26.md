# [the minutes after a fight] HIS MEN AFTER THE LAST BLOW (ANIMATION, rule 245, 10/26/26)

PAOLO 10/26, LOCKED: "instead of it being black... a live show, as zoomed in as it can be, of your characters looting the bodies
and walking between them and maybe talking about what's next... research what people typically do after battles... animating in
the background at a lower opacity... we're gonna need a bunch more animations across the board" and "I'm proud of the way you've
been animating things so far... it's this Bohemian Crashbox HBO style, I love it"
(records/BOHEMIA_PAOLO_OPTIMIZE_LOOT_AND_THE_AFTERMATH_BEHIND_THE_LOOT_AND_THE_FACES_BREATHE_10_26_26.md). The coordinator's row:
research (cited), the acts for his men in their real gear, a call RUN FOUR plays behind the end-of-fight screen, a VOTE card.

## MEASURED FIRST
- The end-of-fight screen (RUN TWO's slices/BOHEMIA_SPOILS_SCREEN.html) sits on flat dark; RUN FOUR [the aftermath plays behind
  the loot screen] is claimed and waits on these acts (until then his men's idles and walks).
- Nothing in the bank kneels by a body, binds a wound or catches its breath. The holds' tool has a kneel (the cover kneel) and
  a hand carried to a point (its reach), both on the same skeleton every person is built on.

## THE RESEARCH
records/BOHEMIA_ANIMATION_THE_MINUTES_AFTER_A_FIGHT_RESEARCH_10_26_26.md: consolidate and reorganize (FM 3-21.8: security, the
dead searched, ammunition counted and redistributed, casualties treated), tactical field care (TCCC: the dressing once the
shooting stops), the backlash (Grossman, On Combat: the shakes, the knees going), the stripping of the dead (Sledge, Juenger,
Waterloo), the smoke and the talk (Sledge, Marshall). Battle Brothers read for how it does the moment (a flat panel, nobody shown).

## WHAT WAS BUILT
THE SOURCE, KEPT (rule 128): the town's own, records/target/animation/BOHEMIA_THE_TOWNS_ACTIVITIES.json, four activities of the
set 'after' beside the six of the town, on the same grammar (held keys three a beat, four breaths, variants, any slot after any):
- LOOT: down on his right knee by the body before him, his hands in its coat, a BATTERY pulled out (batteries are the money),
  held up to his eyes, pocketed at his hip, a glance over each shoulder, both hands back in.
- TEND: down on a knee by a wounded friend lying before him, both hands pressing on him, leaning in to talk to him, a hand to
  his head, a look round for help, a nod.
- BIND: down on a knee, a strip of dirty cloth with a brown stain wound round his own left forearm, his right hand over it,
  under it and round it, the end pulled tight in his teeth, the arm tried.
- BREATH: standing bent over his knees, heaving; up with his hands on his hips and his head back; his own hands held before him,
  shaking (two keys a pixel apart, held two keys each); the forearm across his face; a look round.
TWO OPS MORE in the grammar, the holds' own, ported line for line: ['KNEEL', side, front, seat] (the knee on the ground under the
hip, its shin back along the floor, the other foot a step forward and flat, the pelvis dropped by the skeleton's own lengths) and
['REACH', side, from, [f, u, l], pole] (the hand carried to a point by the arm's two bones; from a joint, 'G' the floor under his
pelvis, or 'mid_LF' halfway along his left forearm). A prop kind more: 'limb', wound round a bone (the bandage).
THE TOOL: tools/bohemia_animation_the_towns_activities.py. Each set renders in its own pass (<look>.after: its kneels and its
crop are its own, never shifting the town's six), the pack reads every pass of a man into one sheet set (a sheet an act),
each pass laid on his still by the same match. `people COMPANY 4 after` renders his company and YOU.
THE PLAYER: unchanged, BohemiaIdles.activity(look, seed, now, facing, {act}) with act 'loot', 'tend', 'bind' or 'breath'.

## THE BUGS I MADE AND CAUGHT
- The forearm across the face: its on-the-way pose sat off the line between its ends (the hand 1.25 m high where the middle is
  1.13), so in three facings the hand went up past the face and came back: the envelope check on the posed joints caught it
  before a render; the half is the measured middle now.

## GATE
THE TOWN'S ACTIVITIES, set-aware: S the ten (six and four) and their slots; E on every pass of a man (his joints merged); K a man
who kneels has the down knee on the ground (12 cm) and the front foot planted where the kneel sets it (2 cm) in every kneeling
pose (a knee lifted 15 cm is caught); P every act a man has, every pose, eight facings, soles on his ground; A1 his company and
YOU have all four once any man has one.

## WHERE IT STANDS
(filled as the renders land)
