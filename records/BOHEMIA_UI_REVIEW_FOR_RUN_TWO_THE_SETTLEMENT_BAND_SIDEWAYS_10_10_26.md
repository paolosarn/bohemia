# UI REVIEW FOR RUN TWO: THE SETTLEMENT HAS A BAND ON ITS SIDE (10/10/26, ui-kmqmrf, row [the sideways sides])

Paolo 10/10 on the sideways map: 'Looks like shit, what's up with the brown-grey sides, man.' UI fixed the map (it now goes
edge to edge at every width, gates/the_sideways_sides_gate.js). The SETTLEMENT SCREEN has the same defect, inside RUN TWO's
own canvas, so this is a review, not an edit (ONE SYSTEM ONE SESSION).

MEASURED (BOHEMIA_SETTLEMENT_SCREEN.html bare, the driver's phone_landscape 844x390, 'THE WASH, NORTH LAS VEGAS'): the place's
picture is drawn about 580 of 844 wide; the right ~260 points are the darkened backdrop copy (rgba(14,10,7,.78) over the
picture scaled behind), a flat dark band.

CAUSE, slices/BOHEMIA_SETTLEMENT_SCREEN.html:611-612:
    view.s = Math.min(Math.max(W/(picW()*0.6), H*0.5/picH()), H/picH());
    if(W/picW() > view.s) view.s = Math.min(W/picW(), H/picH());
On a phone on its side H/picH() is the smaller of the two, so the scale is capped by the height and the picture can never
reach the width.

THE FIX UI PROPOSES (one line, RUN TWO's call): when the glass is wider than the picture, fill the width and let the height
crop evenly (Battle Brothers' town screen fills its glass at any width):
    if(W/picW() > view.s) view.s = W/picW();
view.oy = Math.round((H - picH()*view.s)/2) then goes negative and crops top and bottom equally; where() and the tap test
already read view.oy and view.s, so the hotspots follow. Then gates/the_sideways_sides_gate.js can grow a settlement leg
(the outer 6 points of the picture vary like the picture, not a flat colour).
