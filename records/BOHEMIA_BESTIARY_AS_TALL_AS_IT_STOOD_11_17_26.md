# BESTIARY: AS TALL AS IT STOOD -- THE MAMMOTH IS NOT A BUILDING, AND EVERY ANIMAL DRAWN TO ITS HEIGHT AGAINST A MAN -- 11/17/26
# The coordinator's routine 'BESTIARY the mammoth is too big' (VAMILY rule 458(b), ask row 641; his YES on THE COLUMBIAN MAMMOTH
# carried an order (ask row 641), his words: 'Make it not so big this shit bigger than the empire state building crazy guy'). Rule 441.

## 1. MEASURED FIRST (every beast's fight sheet against a man's, records/target/bestiary_lab_seven/as_tall_as_it_stood.png)
The fight draws a man and a beast at ONE scale (rigScale; lookOf), and every beast's model is at its size in metres beside the man's:
SIDE ON, against a man, the mammoth stood 2.27 men (four metres at the shoulder: right), the long-horned bison 1.4, the ancient bison
1.2, the short-faced bear 1.0, the ground sloth 0.8. But the fight looks down on them, and a long body FACING THE GLASS stacks its
length up the picture: at its tallest facing every animal stood about 1.35 times its height against a man, the mammoth 3.06 men,
taller than four rows of houses on the board (a tile is a house, and a man already stands 1.8 rows). His card's sideways shot was the
camera pinched in on it with no man in the frame. Nothing about the mammoth alone was out: the whole herd was out the same way.
| beast | at the shoulder in life | before, its tallest picture | now (x 0.75) |
|---|---|---|---|
| Columbian mammoth | 4.0 m, 2.29 men | 3.06 men | 2.30 men |
| long-horned bison | 2.5 m, 1.43 men | 2.00 | 1.50 |
| ancient bison | 2.27 m, 1.30 men | 1.71 | 1.28 |
| short-faced bear | 1.7 m on all fours, 0.97 men | 1.32 | 0.99 |
| ground sloth (Shasta, on all fours) | no shoulder height on record; about 2.75 m long, 250 kg | 1.24 | 0.93 (side on 0.6, about a metre) |

## 2. THE FIX: ONE NUMBER, EVERY PLACE A BEAST IS DRAWN
records/target/bb/bohemia_enemies.json numbers.beast_draw.scale = 0.75 (TUNING's to move): a beast is drawn at three quarters of its
sheet, so its tallest facing stands as tall against a man as the animal stood in life, and the herd's sizes to each other are
untouched. Men are never scaled (rule 21). Read in: the fight (bodyK in blitMan and cellOf: the picture and the cell the board hides
behind houses with), the map's live animal and its kill (bohemia_job_kinds.js beastK on beastMeta; bohemia_carcass.js), and the
after-fight picture (bohemia_aftermath.js, the fight's own bodyK). The sheets are not re-rendered: no art changed, no site weight.
It still walks through his line (the trample is the rules', not the picture's).

## 3. THE GATE (THE BESTIARY FLOOR F11 AS TALL AS IT STOOD)
Each big beast's tallest facing on its own sheet, times beast_draw, against a man's: within 15% of its height at the shoulder in life
against a 1.75 m man; the mammoth never past two and a half men; the herd in order (mammoth > long-horned bison > ancient bison >
bear). PLANTED: at the sheet's own size (1.0) the mammoth reads 3.06 men and the leg goes red.
[bb Battle Brothers draws its Unhold a head and a half over a brother, not three; the board reads the size, the rules carry the weight.]
[analog horror: the mammoth between the houses at night, a shape the height of two men and a half, which is worse than a tower: it is real.]

## 4. PROOF
On the page (gates/the_bestiary_floor_fight.js, NO_MEN, the big beasts): the mammoth on the demo and the alpha, a phone upright and
sideways, and the long-horned bison on the demo both ways: fielded on its own sheet, the fight's words, the win home, its kill on the
map and the take (food and hides); the page threw nothing. On the alpha upright the mammoth stands about two men tall beside his three
(it stood three and a half on the old card); sideways the same. The re-shot card: records/target/BESTIARY_THE_MAMMOTH.jpg (the alpha
both ways, the demo, the bison, and the lineup before and now). THE BESTIARY FLOOR --no-browser 12/0 with F11 and its plant.
