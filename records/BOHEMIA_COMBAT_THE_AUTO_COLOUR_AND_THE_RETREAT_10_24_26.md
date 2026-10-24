# COMBAT [the auto button wears the odds] SHIPPED d7a0dfd0 and [retreat] SHIPPED 10/24 (rule 144)

His words (10/24): "how good is the auto combat system, and how good is it at detecting the percentage of victory... maybe the
auto button can be green... or red... there's a difference between winning with one character left standing at one HP and
winning without taking a single casualty... I wouldn't press AUTO unless I'm guaranteed none of my members would die... a
number in the background the player never sees, they only see the colour... if any members die during your projections,
that's leaning towards red... I don't want clear; if it's clear, could go either way, that means it's gonna be risky... also,
can you retreat in this game?"

## THE AUTO BUTTON WEARS THE ODDS (144(b)(e)(f)(g))
The odds engine still plays the fight out on AUTO 24 times from the board as it stands (the real die untouched). Each run is now
WORTH: 1 won with nobody of his down or dead; ours.odds_colour.down_value (0.5) times the share still standing when won with men
down and none dead; 0 when lost or when ANY of his died (a death pulls red). The mean is the hidden number; the player sees only
the AUTO tin's tint: green at 0.8 or over, red under it, one continuous opacity on each side from 0.18 (never clear) to 0.62 at
its end (readable in the sun). An even fight (0.5) reads red (no clear middle). The beat's light rides only a near-certain clean
win (0.92 or over), and one tap then finishes the fight, as before. The colour moves only on a full read (12 runs), so it never
flickers through a fresh turn. No percentage anywhere on the screen.
Measured: twelve against one thug, 24 of 24 clean, deep green with the light; one against five, 0, deep red. Gate THE FIGHT BY
HAND, QUICKER re-aimed and 20/0 (its old leg wanted the number on the button: 144(e) retired it).

## RETREAT (144(c))
HOW BATTLE BROTHERS DID IT (rules.json deployment.retreat_from_map_edge, Dev Blog 105): "If your men are already on the edges
of the map, you'll safely retreat as before. If they aren't, they'll now attempt to speedily move to the edges of the map
automatically and by themselves until either they succeed or die." The zone-of-control defence bonus "scales with the chosen
difficulty" and the library carries no number: ours adds none until TUNING finds one.
OURS: a RETREAT button beside WAIT on his turn. One tap to see (it arms in amber with a red rim and the line says: "Retreat?
Your men run for the nearest edge. Who reaches it gets out. No pay. Tap again."), one tap to do. Every man of his on the edge
is out at once; the rest are steered by the rules, each on his turn running for the nearest edge the way a fleeing man does
(free swings as he leaves a man's reach), out the moment he stands on it; caught, he fights on or falls. The recap says YOU
PULLED OUT and how many got out; home with BOHEMIA_FIGHT_OVER {result:'lost', retreat:true, wipe:false} (no pay; the shell
already puts him back where he stood). A retreat is never a wipe; if YOU is caught and falls, it is (143(e)). The crew calls it
(a 'retreat' moment in the bank). Measured headless over six seeds, twelve of his against three: 10 to 12 of 12 out, the rest
fallen, none left standing. Gate THE EDGE IS THE WAY OUT 7/0 (new, registered). FOUND AND FIXED on the way: the retreat flag
must be cleared when a fight is set up (a second fight on the same page started retreating).

## GATES
THE EDGE IS THE WAY OUT 7/0, THE FIGHT BY HAND, QUICKER 20/0, THE FIGHT'S BAR IS STUDIO MADE 15/0, ONE TAP 16/0, TURN ENDS 8/0,
THE CREW'S COMMENTARY 9/0. THE UI BELONGS TO THE WORLD 35/1: the red is the map's tin words in the demo (the day, NOTES), not the
fight. Full suite unmeasured (rule 13).

FOR UI: #bflee (RETREAT) is styled by hand in the casing font, tin idle and amber armed; dress it in the kit like #bwait.
FOR TUNING: ours.odds_colour (turn 0.8, glow_at 0.92, down_value 0.5, alpha 0.18 to 0.62); the retreat's zone-of-control bonus.
FOR RUN: BOHEMIA_FIGHT_OVER carries retreat:true on a retreat (no pay; he is back where he stood, your flee road).

[bb]: Battle Brothers' retreat is the same rule; its odds are the player's own eye. Ours reads the odds for him and shows only
whether nobody of his is likely to fall.
ANALOG HORROR: the AUTO tin goes green or red like a tally light on an old camera; the retreat is men breaking for the frame's edge.
