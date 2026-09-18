# NO SLOP, ROUND TEN: I COUNTED THE WRONG THING FOR EIGHT ROUNDS
UI lane (chat 11), 9/18/26. Row [no slop].
laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
Tool: tools/bohemia_what_actually_paints.js. Gate: gates/the_street_draws_no_hairlines_gate.js,
10 legs, three mutations that bit and two that could not (both recorded below).

## THE FINDING
The tell ruler reads SOURCE. On the walked city it said 46 one-pixel borders and 53 rounded
corners. Measured on the LIVE opening street with the one driver:

    SOURCE                  46 one-pixel borders    53 rounded corners
    WHAT THE SCREEN DREW     3                       3

Almost everything left in that count is a declaration the skin already cancels with
!important, or a rule for a panel that is not open. Eight rounds of this row have been
reported against a number fifteen times larger than anything he can see.

## AND BOTH NUMBERS ARE REAL, WHICH IS THE PART THAT MATTERS
The temptation is to call the ruler broken and stop using it. It is not broken; it answers a
different question, and the answer is still debt:
  a dead declaration still counts,
  it still tells the next person to read the file that this thing is a rounded hairline box,
  and it is EXACTLY how a killed shape comes back.
Round nine found GET UP drawn with a bevel AND a rounded hairline, because a later rule put
the hairline back on a shape the object rule had already replaced. That is what a cancelled
declaration grows into.
So the two live side by side, and the only real mistake is quoting one as the other. The new
tool says so on its own face, twice.

## WHAT SHIPPED
The three visible edges on the opening street, all TRANSLATED rather than deleted, because
each was doing real work separating a label from a moving world:
  #note      the hint line ("walking your own block.")  ->  the skin's body
  #teachsay  the teaching caption                        ->  the skin's body
  #menubar   the bar's bottom line                       ->  the skin's base, its underside

    VISIBLE ONE-PIXEL EDGES ON THE OPENING STREET:  3 -> 0

Four rounded boxes survive and each has a reason, named in the gate so nobody strips them by
accident: #stage is the game's own viewport corner, the glass of the device the interface is
supposed to BE; #teachring is a 2px accent pointer round the control being taught; #mode and
#modeFace are 999px, which is a CIRCLE, the pad's ring and face, a shape and not the
rounded-card idiom the law names.

## AND I MADE THE ROUND'S OWN DEFECT WHILE FIXING IT
The bar's base went in as its own box-shadow line directly above the bar's existing drop
shadow. BOX-SHADOW DOES NOT MERGE: the later line wins whole. The base was dead the moment it
was written, and the sweep still went to zero because the border really was gone, so the
number looked right. Caught by asking the page for the computed value one step after writing
it: it came back as the old shadow alone. Merged into one declaration.
That is the same defect this entire round is about, made by me, in the commit that fixes it.

## THE TOOL, AND WHY IT IS A TOOL AND NOT A GATE
tools/bohemia_what_actually_paints.js walks the shipped build with the one driver and reports
what is really drawn, per surface. It is a measurement like the ruler, not a verdict.
    the opening street      0 edges    2 rounded   #stage #teachring
    outfitpanel             0          2
    savepanel               0          2
    devtray                 0          2
    daycard                 0          2
    keypanel               32          2   the map key's swatches, .sw x32
    cityfeed                4          3   the phone's own casing, tape, bar and battery
    buildpanel, pfgrid      not built until he opens them
The gate REQUIRES the sweep from the tool rather than copying it, so the thing he could run
and the thing that blocks a ship cannot quietly disagree.

## AND THE FIRST VERSION OF MY OWN SWEEP OVER-COUNTED
An early pass reported 74 edges on the map key. It opens each panel by setting display and
adding the `on` class, and it restored the display but never removed the class, so panels
stacked and the later surfaces counted the earlier ones as well. The tool removes the class
it added. The honest number is 32. A sweep that leaves the page dirty measures the sweep.

## MUTATION: THREE BIT, TWO COULD NOT, AND THE TWO ARE A FINDING
  hairline back on the hint line         8 legs red
  hairline back on the bar's bottom      8 legs red
  the central corner control to 11px     the rounded-box leg red, naming
                                         #hmode #hslot #hclock #nav #pad
Two mutations did NOT bite and neither is counted as a proof:
  a rounded card on #blstack   -> computed 3px, not 11
  a rounded card on #note      -> computed 3px, not 11
Both were overridden. Asking the browser which rule wins gave the answer in one step:
`.uihalf { border-radius: 3px !important }` -- the half-size rule from [half size] pins the
corner of EVERY halved control on the street. THE STREET'S CORNERS ARE CENTRALLY CONTROLLED
AND NOBODY WROTE THAT DOWN. It is why a stray rounded box cannot easily appear there, and it
is why the honest mutation is the central rule rather than any one element: change that 3px
and five controls become rounded cards at once, which is exactly what the leg then reports.
A mutation that cannot render proves nothing about a leg. Last round had the same shape (the
skin's !important protecting .dcbtn) and the same answer: replace it, never count it.

## THE PHONE'S FOUR ARE NOT A DEFECT
[phone object] built a casing with real thickness, tape over the top edge and a cracked
screen. Its edges are a thing's edges, which is what the law asks for. Stripping them to make
a number fall would be the ruler counting the cure as the disease, which this lane did once
already on 9/11 with box-shadows. The gate names them so nobody does it by accident.

## AND PLUMBER'S FRONT-PAGE LINE, ANSWERED FOR THE SECOND ROUND (rule 12)
The front page now says all three remaining reds on the speed gate are the day card over the
pad, and that this round NO pass on either surface reached a first step.
MEASURED ON THE SHIPPED BUILD WITH THE ONE DRIVER, which is rule 14(g)'s instrument:
    the driver boots       ->  card display: none
    the canvas owns the centre of the glass
    8 of 8 direction arrows REACH
    a tap on an arrow      ->  he moved, 6268 -> 6263
THE FIRST STEP OF THE GAME WORKS. Last round I proved the card closes, but with a JS
element.click(), which bypasses hit testing and proves only that the handler runs. This round
it is a REAL tap at GET UP's own centre coordinate: centre owner DIV.dcgo, centre reaches
true, and the card closes. (Two of its four corners do not reach, which is the bevel's
clip-path cutting opposite corners, and is the intended shape.)
So the driven thumb has nothing to press because THAT gate's own driver does not dismiss the
card, not because the game blocks it. Named for PLUMBER and RUN, no board row touched.

## WHAT IS NOT DONE
The map key's 32 swatch edges are the largest visible pile left, and the key is a legend of
street types that reads like developer tooling rather than something a player needs; whether
it is player-facing at all is worth deciding before restyling it. The source count (46/53)
is now understood as dead-declaration debt and can be swept file-wide in one pass rather than
chased surface by surface.
