# THEY FIGHT LIKE STAFF (STAFF, VAMILY rule 470(a), ask row 701)

Paolo 11/22, on his YES to the staff build: 'Make sure their auto combat shit is different. They're weak as fuck compared to the front
line. They will stay behind. They will take defensive positions and they will attempt to not be flanked and circled.'

## FOR PAOLO

Your camp people now think like camp people. Each turn they look at every spot they can walk to and pick the safest: behind your line,
with one of your fighters between them and the enemy, a wall or a corner at their back so nobody can get round them, next to cover or up
high, huddled with the rest of the camp. If an enemy gets beside them or behind them, they move. They only swing their box cutter when they
are cornered with nowhere to go.

## WHAT CHANGED

Before (BUILD 11/21zb): a camp person held still until an enemy could reach him, then stepped to the tile the fewest enemies could reach,
toward his nearest fighter.

Now (slices/BOHEMIA_FIGHT.html __THEY_FIGHT_LIKE_STAFF__, the weights in records/target/bb/ai.json staff_ground, a modder's row): every turn
he weighs every tile his walk reaches, lower is safer:

| what | weight | why |
|---|---|---|
| each of theirs who can reach the tile by their next turn | 10 | the fight's own dangerAt |
| each of theirs with no fighter of his between him and the tile | 4 | 'keep a fighter between them and every enemy' |
| each of theirs on the tile's eight | 14 | 'not be flanked and circled' |
| each of theirs west of him (his line faces east) within 3 | 5 | round his back |
| each open side of the eight (a wall, a building, cover or one of his own closes it) | 1.5 | Battle Brothers' surround: +5% to hit him for each man past the first; a corner cannot be circled |
| each piece of cover beside the tile (ours.cover_defence) | -2.5 | defensive ground |
| a roof | -3 | high ground |
| each tile east of the middle of his standing fighters, less one | 3 | 'they will stay behind' |
| another of the camp beside him (two at most) | -1.5 | they huddle |
| a fighter of his beside him | -2 | Battle Brothers' +3 resolve a man beside him |
| what a tile must beat where he stands by before he walks | 1 | no dancing |

He never ends a step in their reach; the blade only when cornered; fleeing he runs as any man. Nothing of the fighters' brain changed.

## WHAT WAS MEASURED

THE MANY FIGHTS (the live fight headless, AUTO both sides, the same 160 seeds, 8 of his with the cook, the scout and the surgeon against 8,
four families in turn, day 8; the previous build's fight page against this one, nothing else different):

| | 11/21zb (before) | this build |
|---|---|---|
| turns a camp person starts with one of theirs beside him | 1.9% | 1.6% |
| ... with two or more (circled) | 0.4% | 0.2% |
| turns he ends with one of theirs round his back | 1.4% | 0.4% |
| turns he ends behind the middle of his line | 92.9% | 94.3% |
| their blows on the camp a fight | 3.17 | 2.15 |
| the camp dead a fight (each) | 28.3% | 18.1% |
| his fights won | 77.5% | 76.9% |
| his men down a fight | 3.01 | 3.02 |

So the camp is caught from behind about a third as often and takes a third fewer blows, and a camp person dies in about one fight in six
instead of one in four; the fight itself is as hard as it was (his win and his men down unchanged).

AGAINST A FIGHTER'S BRAIN (the gate's control: the same camp on the same seeds with its turn handed to the line's AUTO): ends beside one of
theirs 64.4% of its turns, circled 16.5%, round his back 8.9%, behind the line 6.4%, 6.9 blows on the camp a fight; the camp's own: 1.0%,
0.2%, 1.2%, 96.7%, 1.7 (gate leg S12, 30 fights each in --quick, 60 in full).

ON THE PHONE (rule 441; tools/bohemia_staff_on_the_phone.js, the one driver, A NEW CREW in the valley K7QM9X with his three camp people, a road
crew off the town; AUTO plays the fight to its end on the glass, every turn a camp person ends read on the page): the demo and the alpha, upright (390 x 844) and on
its side (844 x 390), and the demo twice more on a quiet box: every fight played on AUTO to a win (4 to 7 rounds); 99 turns a camp person
ended, 0 beside one of theirs, 0 circled, 0 with one round his back, 99 behind the middle of his line; every camp person alive and kept by the
camp's own book after; nothing threw; no page scroll sideways (records/target/staff_11_22/). The fight's first ten seconds on a quiet box:
the demo 48.9 to 51.0 frames a second, its worst gap 200 to 350 ms; two runs made while the gate ran beside them read 37.2 and 25.3 with a
worst 800 and 583 ms on the way in (the same class a no-camp control showed, 483 ms; said, not hidden).
FOUND, NOT MINE (for COMBAT FOUR, the camera's owner): held UPRIGHT, in round two the camp at the board's west edge stood OFF the glass (its
bars at -5 to -39 points) while the fight went on: the frame's far stop (UI.coverFar) cannot hold his camp, his line and theirs upright; on
its side the whole fight fits. He cannot protect what he cannot see; the note is in handoffs/COMBAT_THREE.md.

THE GATE: THE STAFF FIGHT TOO 37/0 in full (S12, 60 fights each: his camp ends 1.0% of its turns beside one of theirs, 0.3% circled, 0.5% with one round his back, 94.4% behind the line, 1.5 blows on it a fight; a fighter's brain on the same camp 60.9%, 14.9%, 11.0%, 10.6%, 7.1).

## NEXT

Rule 471, THE STAFF PUSH A CART (the cart in the shield's hand, one-handed weapons only, the cart seen and upgraded, a thin shield and the
trade's stock): STAFF's next job, with CHARACTER and COOK SIX for its art.

[bb Battle Brothers' surround: every attacker past the first is +5% to hit; a man with a wall at his back has fewer sides to be hit from.]
[analog horror: the cook backs into the corner of the laundromat and waits, the box cutter in her fist, counting the shapes past the window.]
