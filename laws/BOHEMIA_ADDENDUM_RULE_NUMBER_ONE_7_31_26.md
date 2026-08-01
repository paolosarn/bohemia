# BOHEMIA ADDENDUM — RULE NUMBER ONE: THE STREETS CONNECT (Paolo 7/31/26, LOCKED)

Paolo, verbatim:

> "The mall is like 60% done i'm very confused. What the street looking line is and so
> I sent a picture with this yellow circle that I made like I'm so confused what that
> shit is supposed to be
>
> Commercial is like at 75. I'm just still concerned why you're such a fucking dumb ass
> like how dare you continue to like make streets in in a district that like don't
> connect with each other like that's like the rule number one bro like what's wrong
> with you?"

## THE RULING

**Every drivable tile in a district is reachable from the street. All of it. Always.**
A road that goes nowhere is not a road, and a lot you can see and never drive to is
not a lot. This is rule number one and it outranks how anything looks.

**And a lane has to be wide enough to be a lane.** He circled two vertical lines
running down the mall and asked what they were supposed to be. They were drive
lanes ONE TILE WIDE — 0.75 m, a 30-inch road. Nothing fits down it. It read as a
mystery stripe instead of a street, which is precisely how he read it.

## THE SCORES THIS CAME WITH

- MALL: **60%** (was 40).
- COMMERCIAL: **75%** (was 65).

Both still open. Neither approved. The reference is still the HIGH SCHOOL at 89%.

## HOW BAD IT ACTUALLY WAS, measured rather than assumed

He was looking at two districts. The valley had **23**. Every one of them shipped
green.

- COMMERCIAL, the one he was scoring: **71.9%** of its drive surface was reachable.
  The service alley ran along the back, down one side, and stopped — a truck could
  drive in and never get out. The fuel pad and the bank pad were islands with no
  road to them at all.
- MALL: two ring "roads" one tile wide, and the parking fields they exist to serve
  were **not even classified as a drive surface** in its own legend.

## THE BUG BEHIND THE BUG — why this was green for weeks

Every district asked the same question the same wrong way:

    driveReachFromStreet(g, ONE_CODE)

One code. So a mall asked whether its ring road connected to itself and never asked
about the parking, because parking is a different code. **Each district was checking
one limb and calling the body healthy.** The threshold made it worse: `> 0.85` passes
a district with a seventh of its roads stranded.

The shared answer is now `K.driveNetworkReach(g, legend)`: union EVERY code the
legend calls a drive surface and ask one question about the whole lot. Districts
call that, not a code of their own choosing, and the bar is 100%, not 85%.

Two smaller truths fell out of it:

- **PAINT IS NOT A WALL.** Stall stripes are a `marking` kind painted on asphalt and
  a car drives straight over them. Counting them as obstacles invented pockets that
  do not exist — the last ten "unreachable" tiles in commercial were slivers fenced
  in by parking stripes.
- **A NAME THAT LIES IS A BUG.** The mall's parking was kinded `ground`. Cars park
  there. The machine cannot check what the legend misdescribes.

## THE GATE

`gates/drive_network_gate.js`. Whole-network reach at 100%, a minimum lane width, and
both held as RATCHETS: the 22 disconnected districts and 4 hairline districts are
NAMED, may only shrink, and nothing outside the list may grow a new one. Some of that
debt is legitimate — a runway is not reached from a kerb — and it stays named rather
than silently excused, so the next person has to look at each one and decide.

COMMERCIAL and MALL are held at 100% in all six placements with no debt allowance,
because they are the two he was looking at when he said this.

## WHAT THIS DOES NOT CHANGE

BUILD THE WORLD (7/31): quests, factions, economy stay OFF. EVERY PIXEL ANSWERED FOR
(7/31). ACT ONE ONLY (7/28). MECHANISM-MINE / CONTENTS-PAOLO'S.
