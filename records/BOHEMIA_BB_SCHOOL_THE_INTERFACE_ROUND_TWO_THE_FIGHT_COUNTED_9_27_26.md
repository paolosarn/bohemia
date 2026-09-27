# BATTLE BROTHERS SCHOOL: THE INTERFACE, ROUND TWO -- THE FIGHT, COUNTED AT LAST
UI lane (chat 11), 9/27/26. Row [bb interface], rule 33(f), rule 24, and this lane's [one hud].

Round one measured the street and the map, found rule 24 already true between them, and said
plainly that it could not reach the fight, naming four attempts that failed. This is that
third surface.

## 1. HOW I GOT IN, SINCE ROUND ONE COULD NOT
Rule 12: a dependency is a premise, not a gate. Round one ended with a question for COMBAT;
before waiting on it I asked the game instead, and the game answered.
    streetTapFoe() reads HOST_HIT, the list of rectangles a tap can hit, and each entry can
    carry a .crew. At the door HOST_HIT already held one: a crew of 2 at 217,79, 112 x 112.
    The only other thing in the way was two step counters, SF_GRACE 40 and SF_COOLDOWN 60,
    against SF_STEPS 0.
So: set the counters past their guards and tap the crew where the crew is. THAT IS THE
PLAYER'S OWN ROUTE -- he walks up and taps them; the guards decide how OFTEN, never where
it goes. streetTapFight returned true and the shell changed page.

## 2. WHAT IS ACTUALLY THERE, BOTH SURFACES, ONE RUN, SECONDS APART
    THE STREET      9 visible things   (the teaching overlay hidden, it is first-run only)
    THE FIGHT      30 visible things   IN ITS OWN DOCUMENT
    SHARED          none
The frame list at the moment of the fight, which is the evidence:
    cityFrame   -> BOHEMIA_CITY_WORLD.html   (the walked world, still loaded, now hidden)
    combatFrame -> about:srcdoc              (the fight, a second document)
and the shell's own visible list went from #p-city to #p-combat.

THE WALK LOSES ALL EIGHT OF ITS NAMED CONTROLS: the bar, the notes button and its plate,
the walk pad and its ring, the mode face and its label. Not moved. Gone.
(One id, cv, appears in both lists and it is NOT a shared control: it is two different
canvases in two different documents that happen to carry the same name. Counting it would
have been the easiest wrong number in this round.)

THE FIGHT ADDS, by what it says on the glass:
    a second SETTINGS gear, YOU 100/100 and a health bar, WAIT, SUPPRESS,
    SHOVE GOON (stun 1 - 30%), WAY OUT 4T, "out on the block", SHOOT, eight compass dots
    N NE E SE S SW W NW, RUN, GREN 2, RIFLE.
That is, line for line, the fight Paolo described on 9/18 when he sent the link to someone
on Instagram and was embarrassed: "a black bar across the top, a blue WAY OUT 14T, the
health bar, RUN / GREN 2 / RIFLE plates, a face in a red circle labelled SHOOT with compass
dots" (rule 17).

## 3. *** AND THE NUMBER THAT IS THIS LANE'S OWN LAW: THE FIGHT IS NOT A THUMB. ***
Of the 30 visible things, 4 measure 44 px or more in both directions. Of the fight's own
BUTTONS, exactly one is a thumb:
    SHOOT        92 x 92     the only one
    SHOVE GOON  165 x 29     WAIT 45 x 29     SUPPRESS 78 x 29
    RUN / GREN 2 / RIFLE  52 x 34 each
    the eight compass dots  28 x 28 each
Height is what binds, and every button but SHOOT is 28 to 34 px tall against a 44 px reach.
EIGHT OF THEM ARE 28 PX SQUARE. That is not a look problem, it is a can-he-press-it problem,
and it has never been counted.

## 4. WHAT I AM NOT RULING ON, AND WHY
- THE FIGHTERS ARE FLAT COLOURED CIRCLES on a blue-grey checker floor five seconds after
  the fight starts: one red, one green, one grey. COMBAT measured 112 CSS px BODIES in V224
  and V225 and I believe that measurement. So either the bodies arrive later than five
  seconds or this cut's fight is not drawing them. I am not calling it either; it is named
  here with its number (5 s) for COMBAT.
- NOBODY IS BEING ACCUSED OF SHIPPING NOTHING. COMBAT corrected their own board line on
  9/24 before I measured anything: [one mode] reads CLAIMED, not shipped, and their own
  words are "Nothing in V225 makes the fight stop being a second document: the fight is
  still an iframe built from srcdoc." This census AGREES with them and adds the counts
  nobody had.

## 5. THE SHAPE FOR US -- WHERE ALL THIRTY GO (this lane's [one hud], the design)
The rule is rule 24: the fight adds nothing that is not already an object on his screen.
Thirty things become five, and four of the five already exist.
    THE GROUND            reach (rule 23c: pistol 1, rifle 2, scope 3) lights on the tiles
                          he is standing on. Replaces: the compass dots, WAY OUT, and the
                          whole idea of a board.
    THE WALK PAD          he already has his thumb on it. Its ring carries the enemy's next
                          beat; pressing a lit direction is the step; holding is the shot.
                          Replaces: N NE E SE S SW W NW, RUN, and SHOOT's position.
    THE BAR               what is left of a readout goes in the strip that is already there
                          and is empty on the demo (round one's finding): the hour, and
                          whose beat it is. Replaces: the second SETTINGS gear, WAY OUT 4T,
                          "out on the block".
    THE PHONE             the after: what happened, who died, what it cost. It is the city
                          view's object and the fight ends back on the street.
    ONE NEW THING, AND ONLY ONE      the weapon he is holding, because SHOVE GOON, GREN 2,
                          RIFLE and SUPPRESS are all the same question (what am I holding and
                          what does it do at this range). One object on the pad's edge, a
                          thumb tall, that swaps. Everything else is deleted, not rehoused.
    HIS HEALTH            NOT a bar across the top. It is the one number a Battle Brothers
                          player reads by looking at the man, and we have a man on screen.
                          Default: it rides the body, his to knock down.
THE SHIP TEST, WHICH IS ALREADY WRITTEN ON COMBAT'S ROW: the walk meets a fight and the pad,
the bar, the phone and the notes never change or move; the fight is photographed on the same
canvas as the walk. What this round adds is the BEFORE: 9 things against 30, zero shared,
one document against two, and one button in the whole fight a thumb can hit.

## 6. WHAT BATTLE BROTHERS WOULD SAY ABOUT SECTION 5
Round one's finding stands and is worth repeating here because it is the trap: BATTLE
BROTHERS ITSELF TELEPORTS YOU TO A BATTLE SCREEN with its own bar, turn order along the top
and abilities along the bottom. Our fight is currently a worse version of exactly that, and
"look how Battle Brothers does this" would endorse it. His newer ruling (rule 24, 9/21)
beats the reference, and that is the whole reason the department has to say which parts of
a reference to refuse.

## 7. THE ANALOG HORROR LINE (rule 9, every chat, every round)
The most frightening thing in the picture is not the fight. It is that the street survives
it: the same block, the same doors, the same people, and a thing happened in the middle of
it that changed every button he had. A cut to another screen is a promise that the world
paused. It did not. Nothing should pause, nothing should swap, and the dread is that the
walk simply continues afterwards with one fewer person on it.
