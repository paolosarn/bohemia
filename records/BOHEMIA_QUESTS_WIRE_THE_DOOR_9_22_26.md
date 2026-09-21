# THE FIRST PERSON AT HIS DOOR SPEAKS, BY NAME, IN UNDER TWO SECONDS
## QUESTS round 46, rows [wire the door] + [swap the twelve], 9/22/26

> THE ROW (coordinator 9/22): "Nobody owns putting them together. YOU DO."
> SHIP TEST: the one driver, a named face speaking an ask on the glass before
> 60 s, zero cards.

## MEASURED ON THE ALPHA, WITH THE ONE DRIVER

    spoken at          1.9 s, after ONE pad press
    speaker            Marisela Escobar        (a NAME, not a trade)
    the words          "Shelf's been empty since the weekend and nobody's
                        saying when. Bring back whatever you can carry.
                        It's east of here."
    face               arrives for that person
    cards              0
    page errors        0

## THE WIRE IS FOUR LINES OF PRIORITY, NOT A NEW SURFACE

Rule 19(a) killed the pop-up in the same breath that asked for the portrait, so
building a panel would answer half his sentence by breaking the other half. The
ask goes into the bubble PEOPLE already draw, above the ambient chatter and
below nothing: the first thing a stranger hears should be somebody wanting
something from him, not a remark about a coyote. It fires once.

Nothing in it invents anything. The ask is the generator's, the words are the
mouth module's, the speaker is somebody the renderer really drew (which already
refuses to talk through a wall), and the bubble, the face and the name are
PEOPLE's, through PEOPLE's own doors.

**THE NAME CAME FROM THEIR RULE, NOT A NEW ONE.** PEOPLE wrote it on 9/21:
somebody who comes to you WANTING SOMETHING tells you who they are, and a person
merely barking near you earns nothing. An ask is that case exactly.

## THE TWELVE WALK LINES WENT IN WITH IT

All twelve were narration in a named person's mouth. The bubble is drawn over a
body, with that person's face and name on it, and it was saying "somebody steps
out. they want something." Twelve strings for twelve strings, same ids, WORDS'
own words, on the register Paolo ruled on the same round.

## THREE INSTRUMENT DEFECTS, ALL CAUGHT ON MYSELF BEFORE THEY REACHED A REPORT

**1. THE MOUTH MODULE WAS NOT IN THE FILE THE PLAYER LOADS.** The wire referenced
it, the `typeof undefined` guard returned false, and the whole feature would have
been silently absent and looked like a quiet world. **This lane shipped an entire
row about exactly this trap** ([main quest live]: a module in engine/ is a module
the player never runs) and then walked into it. Caught by grepping the city
before driving it. It is gated now.

**2. THE GATE POLLED EVERY 250 ms FOR A BUBBLE THAT LIVES TWO SECONDS.** On a run
where the drive stalled, the ask fired and expired between two polls; the gate
read null and reported "the speaker has no name" on a build where the speaker
was Marisela Escobar. **A poller that samples a transient state will miss it and
call the miss a defect.** The name and the face are now recorded by the code that
puts them on the glass, at the instant, and the poller adds only wall-clock
timing, which is the one thing the page cannot know.

**3. MY NARRATION CHECK FLAGGED TWO GOOD LINES.** "It logs you and moves on" and
"It still runs the route" are a neighbour talking about a drone and a taxi, which
is what a person standing there would say. Under my first regex they read as
narration, and **that would have sent WORDS back to rewrite two lines that were
right.** The test is an INDEFINITE PERSON as the subject now, and it still catches
the real defect: planting "somebody steps out. they want something." back in
turns it red.

## A WEAKNESS IN MY OWN CHECK, STATED

The bank holds the OLD lines too, as "WAS" examples, so *verbatim from the bank*
cannot tell a new line from the one it replaced. The narration check is what
distinguishes them. Saying so is cheaper than somebody later trusting the wrong
half of the pair.

## PROOF
WIRE THE DOOR 15/0 (on the alpha, through the one driver), registered.
ASK HAS A MOUTH 29/0, ASKS VISIBLE 38/0.
