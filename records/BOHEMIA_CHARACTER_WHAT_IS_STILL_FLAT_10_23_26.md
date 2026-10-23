# CHARACTER: WHAT IS STILL FLAT (the count that goes down)

Lane: CHARACTER [every old asset into the new look] (CLAIMED 10/18). Rule 123 (Paolo 10/20: 'all that energy has to be
spent towards just revamping all the 2-D assets into these 3-D sprites... go crazy'): no card, no sheet, straight into
the people. The coordinator's dispatch (10/23): 'Count what is left in a record in records/ after every family; that
count going down is your proof.'

## How it is counted

`python3 tools/bohemia_character_still_flat.py` reads every row of the roll call (every entry of the alpha's GARMENTS
table and the player's paper doll: 394 rows, 34 dead shapes listed and never counted) and puts each piece in one of three
states, off this lane's own modules, never off a card:

* **flat**: no 3D model exists; the game can only draw it with the old flat generator.
* **3D, not rolled**: modelled on the 3D man, but no person in the crowd rolls it (held by the guide's light row; a hat
  or wrap the random mix leaves out by his 10/19 word; a turtleneck or hood-up that rides the head, RUN TWO's own rule).
* **3D, rolled**: modelled on the 3D man and in the barber's book that RUN TWO [no two people alike] rolls every person
  from (tools/bohemia_character_the_barbers_book.py roll_one, which RUN TWO's roll calls unedited).

A module counts only once the barber builds it (a file on disk that the person builder does not import is not in the game).
The machine copy is records/target/character/BOHEMIA_CHARACTER_STILL_FLAT.json (every flat name, by family).

## The count, family by family

| after | still flat | 3D, not rolled | 3D, rolled | what went in |
|---|---|---|---|---|
| start of this round (10/23) | **131** | 20 | 209 | the hair, hats, face pieces, tops and coats of earlier rounds; trousers and shoes only as each gang's one pair |
| LEGS AND FEET 1 | **67** | 20 | 273 | all 45 trousers and all 40 shoes on the 3D man, rolled per person |
| GEAR 1 + THE FIRST LOOK | **1** | 26 | 333 | all 68 bags, capes, mantles, pads, plates, holsters, bandoliers, scarves, cowls, belts, sashes, gloves and hand wraps, rolled per person; the player's paper doll in 3D (six pieces, his own, never rolled) |

**The one left flat is his own:** the player's painted CURTAIN BOB (hair/curtain-bob). The roll call says it stays his,
and a new bob cannot be cut on the 3D head (CHIN BOB is in the graveyard: A DEAD SHAPE DOES NOT COME BACK UNDER A NEW
NAME). The 3D first look wears the barber's CURTAIN CUT in platinum, the nearest sculpt. The 26 "3D, not rolled" are on
purpose: 9 tops and 5 coats held by the guide's light row, 4 hats he called weird (the cone, the wraps, the shemagh), 2
cuts held, the 6 pieces of the player's own first look.

### GEAR 1 (10/23)

The game's 68 back, gear, neck, waist and hand pieces (genBag, genCape, genGear, genAcc), each kind modelled once on the
3D man in its own ramp, what each generator's own comments say it is: the RUCK PACK a box high on the back on two straps
that hug the arms, a flap and a chest buckle; the SATCHEL on the left hip from a strap off the right shoulder; the BEDROLL
a woven roll across the small of the back; the QUIVER a capped tube slanting to the left shoulder, its mouth dark, three
fletched arrows past it; the ROAD CAPE and the SHOULDER MANTLE this lane's own (the gangs'); the ONE-SHOULDER DRAPE over
the right shoulder and across to the left hip; KNEEPADS, SHIN GUARDS, ELBOW PADS and BRACERS strapped; LEG WRAPS wound up
the shins; the PAULDRON on the right shoulder with its strap (SPIKED: three spikes); the CHEST RIG with its pouches and
radio and an X behind; the CHEST PLATE with a lit collar edge and an X behind; the GORGET; SUSPENDERS to a Y; the THIGH
HOLSTER on the right leg on a hip strap; the BANDOLIER with brass shells and a pouch at the hip; the BLANKET SHOULDER ROLL
on the other diagonal; SCARVES wound with a tail (TRAILING to the waist); COWLS; BELTS with a buckle; TOOL BELTS with a
pouch each hip; the HIP SASH knotted with a tail; WAIST WRAPS; GLOVES and HAND WRAPS on the man's own modelled hands.
Over a coat each piece stands off the coat.

Every person now rolls a kit, at most one piece a slot (a belt on 30 in 100, a bag 22, armour 18, a scarf 16, gloves 16),
inside his gang's colours, on its own random stream; a gang that wears a cape or a mantle takes no other back piece but a
satchel, a gang with its own belt takes no other belt. RUN TWO's roll and builder take it unedited (proven: build-one
church_1, a Church man in his knit cap, his gang's gold mantle, a sand hoodie, a trailing scarf, a rust pauldron and a
charcoal wrap skirt). Looked at on the barber's mannequin, one of every kind (30): four fixed after the first look (the
pack's straps and the chest rig in the ramp's dark vanished on a black tank; the gloves never landed, because the body tool
models the hands after the extra() hook, so a glove is its own shell over the hand's own shape; the blanket roll stood
off the man like a hoop until it was worn snug and pinned to the torso).

### THE FIRST LOOK (10/23)

The player's paper doll (the alpha's PD_DATA, the only clothes never in the GARMENTS table) in 3D, read off its own ramps:
the COWL HOODIE (BASE 1's hoodie, its hood down, GEAR 1's cowl), the FUZZ JACKET (OUTER 1's jacket, its cloth shagged),
the LEATHER LEGWARMER PANTS (knit warmers bunched up the shins), the RUNWAY SNEAKERS (a stacked sole), the DURAG (HATS 1's
wrap) and the SHADES (EYEWEAR 1's wraparounds). Build FIRST on the barber. His own: never in the crowd's roll. Seen: it
reads as one look (platinum hair, shades, the fuzz jacket over the cowl, the warmers, the chunky sneakers); the durag reads
as a tied band over the hair rather than a cap.

[bb Battle Brothers hangs a man's gear as armour layers per slot; ours is cut onto the man, so a pack rides his back and a
bandolier crosses his chest from every side.]
[analog horror: a seatbelt for a bandolier, a shoulder roll that was somebody's blanket, gloves worn through at the fingers.]

### LEGS AND FEET 1 (10/23)

The game's 45 trousers (genPants) and 40 shoes (genShoes, and genPants' column in the feet slot), each modelled once by
shape on the 3D man in its own ramp: TROUSERS (a pressed crease), JEANS (a fly, front pockets, two on the seat), CARGOS
(a bellows pocket and flap on each outer thigh), WORK PANTS (a double knee, a hammer loop, patches where the name says),
SWEATS (a gathered ribbed cuff), SHORTS (above the knee, bare shins; the cutoff frayed), CROPPED (a lit turn-up, a band
of shin), WIDE LEG (opening to the floor, pleated), DROP RISE (one yoke over both legs to mid-thigh, the legs narrow and
closed at the ankle), STACKED (pooling over the boot in dark fold bands), WRAP SKIRT and ANKLE SKIRT (one wrapped panel
over both legs with the diagonal overlap fold); SNEAKERS (white midsole, laces, heel counter), BOOT, MID BOOT, TALL BOOT
(a strap at the top), SLOUCH BOOT (wider than the leg, creased, the top higher outside), STACK BOOT and STACKED MID BOOT
(the thick sole overhanging the foot), SANDALS (straps over the bare foot), COLUMN (one mass per leg from the thigh over
the foot, no ankle break).

Every person now rolls his own pair inside his gang's colours (his gang's own pair and colours three times, the work
colours once; skirts only for the Anarchists, the Colorful and the Church, at a third), on their own random stream so
every other draw of a roll is unchanged. A roll written before the book carried them (RUN TWO's 116) gets the same draw
at build time from the person's id, so nothing in RUN TWO's files had to change.

Proven: RUN TWO's own builder (tools/bohemia_run2_no_two_people_alike.py build-one mob_2, unedited) built a Mob man in
his rolled COLUMN PANT-BOOT under his gang's mantle and cape, his top and his coat; 14 pieces rendered standing through
DIRECTION's rig on the barber's mannequin (one of every hard cut) and looked at; the wrap skirt narrowed after the first
look (2.8 cm of flare over both legs read as a sack).

Tools: tools/bohemia_character_garments_legs.py (the module), the barber (build LEGS1 | FEET1 | LEGS1:<names>), the book
(trousers, shoes, roll_one), this lane's body tool (DRESS: a look dressed as its build starts), the roll call (state
'in the people, no card').

[bb Battle Brothers draws a man's legs as part of his armour layer; ours are cut and hung on the man, so a wide leg
swings past the boot and a stacked one pools over it.]
[analog horror: trousers worn through at the knee and patched with whatever was left, a cuff cut off with a knife.]
