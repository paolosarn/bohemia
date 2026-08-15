# RESEARCH — THE THUMB: WE DESIGNED FOR THE SCREEN AND NEVER FOR THE
# HAND (8/15/26, coordinator sweep 10 catch; doctrine §4b — both aisles,
# anti-yes-man, measured in our own build before routed)

## THE FALSIFIABLE QUESTION
"iPhone portrait" is line one of this project's charter and every gate
runs at 390x844. So the form factor is handled. Question: is it? Fitting
a screen and being operable BY A THUMB are different problems — which
one have we actually solved?

## THE MEASUREMENT (ours, this build)
- THE ENTIRE NAVIGATION LIVES AT THE TOP. `#tabs` is the first element in
  the alpha's body, `border-bottom`, pinned above the panels: SIXTEEN
  tabs, `overflow-x:auto`, `touch-action:pan-x`, with a custom
  pointer-drag scroller. So reaching TAB 12 means a precise horizontal
  DRAG in the top strip of the phone.
- THE WALKED SURFACE IS TOP-HEAVY TOO. In BOHEMIA_CITY_WORLD.html,
  elements pinned near the top outnumber those near the bottom roughly
  13 to 6 (top:10 x7, top:50 x4, top:8, top:64, top:6 vs bottom:74 x2,
  bottom:14 x2, bottom:6 x2).
- SAFE-AREA INSETS ARE ESSENTIALLY UNHANDLED: `safe-area-inset` appears
  ONCE in the alpha and ZERO times in the city world — the surface he
  actually walks. On a notched iPhone the bottom strip is where the home
  indicator and Safari's own bottom URL bar live.
- AND THE GATES CANNOT SEE ANY OF THIS. Fifteen gates open a
  `viewport:{width:390,height:844}` page — they verify what FITS. A
  Playwright click lands anywhere on the glass with equal ease. A human
  thumb does not. Reachability is invisible to our entire verification
  apparatus BY CONSTRUCTION.

## AISLE 1 — THE HAND (mobile practitioner research)
Steven Hoober's field study (1,333 observations of people using phones in
the street, airports, cafes, trains — not a lab):
- 49% hold the phone ONE-HANDED, thumb doing everything; 36% cradle and
  jab; 15% two thumbs. About 75% of interaction is thumb-driven.
- THE REACH MAP: only about a third of the screen is effortless — the
  BOTTOM, arcing toward the side opposite the thumb. Middle sides require
  a stretch. THE TOP CORNERS ARE THE RED ZONE: awkward to impossible,
  usually demanding a grip change or the second hand.
- Phones got TALLER since that research, which made the top strip WORSE,
  not better. Our 16-tab bar sits exactly there.

## AISLE 2 — THE REAL WORLD: REACH ENVELOPES ARE A REGULATED DISCIPLINE
Aviation and industrial ergonomics solved this class of problem decades
ago, and the rule they arrived at is the one we need:
- Cockpit standard: controls and instruments used FREQUENTLY shall be
  positioned within the pilot's reachability envelope — and the airframe
  is designed for the 5th to 95th percentile of the population, not the
  designer's own arm.
- Workstation ergonomics names a PRIMARY ZONE (reachable with the elbow
  bent) where the most-used tools must live; everything else goes
  outward by descending frequency.
THE TRANSFERABLE RULE IS FREQUENCY, NOT AESTHETICS: placement is earned
by how often a control is used. Nobody in aviation argues about whether
the gear lever looks better up there.

## THE CHALLENGE FINDING (against a belief written into our charter)
"iPhone portrait" has been treated as a solved constraint since day one,
and it is not solved — it is HALF solved. We solved LAYOUT (what fits on
390x844, verified fifteen times over) and never once addressed OPERATION
(what a thumb can reach while holding the phone). Worse, the half we
solved is the half our machines can see, so the gates keep reporting
green on a question they were never asked. This is the same shape as the
8/14 finding — a gate verifying the wrong thing while the player's real
experience goes unmeasured — and it is the third time this month that
pattern has been the answer.
AND THE PERSON IT COSTS MOST IS PAOLO. Players will get P0-DOOR and land
straight in the game. He uses the TAB BAR dozens of times a day, dragging
a sixteen-item strip across the least reachable band of his own phone,
and has never mentioned it, because ambient friction does not feel like a
bug. It just feels like using the thing.

## THE DECISION / WORK ORDER (routed; correct-after)
NOT a redesign, and explicitly NOT "move everything to the bottom" — the
bottom EDGE is its own trap on iOS (home indicator, Safari's bottom URL
bar), which is exactly why safe-area insets matter and are missing.
1. THE FREQUENCY AUDIT (cheap, do it first): list every control on the
   two surfaces he touches, ranked by how often it is used in a real
   session. That ranking is the placement spec, per the cockpit rule.
   Frequent -> the reachable arc; rare -> anywhere.
2. THE TAB BAR IS THE HEADLINE: it is the most-used control in the build
   and it sits in the red zone behind a drag gesture. Move it into the
   reachable band ABOVE the safe-area inset, or give it a reachable
   affordance. THE TAB SET AND THE NAMES DO NOT CHANGE — NAME THE TAB
   (7/28) depends on the names and is untouched by where the strip sits.
3. SAFE-AREA INSETS GET HANDLED ON THE WALKED SURFACE, where they are
   currently absent (`env(safe-area-inset-*)`), so nothing important sits
   under the home indicator or the browser chrome.
4. THE GATE THAT CAN SEE IT: a reach gate that asserts every control
   ranked FREQUENT renders inside a defined reachable region of a
   390x844 portrait viewport. It is a geometry assertion, not a taste
   call, and it makes this class of bug impossible to reintroduce — the
   whole point, since fifteen existing gates are structurally blind to it.
5. THE HONEST LIMIT, STATED: a geometry gate approximates a thumb. The
   real verification is him playing one-handed and saying it feels
   better, which the closed playtest round already collects.

## CONFIDENCE
Our layout measurements: read directly from the two shipped files, high.
Hoober's percentages: widely-cited field research, high, though a decade
old and phones have grown (which strengthens the finding, not weakens
it). Ergonomic reach-envelope practice: standard engineering discipline,
high. The transfer from cockpit frequency-zoning to a phone UI is my
analogy, flagged as such — but it is the same problem with a smaller
envelope.

Sources: alistapart.com/article/how-we-hold-our-gadgets +
smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users
(Hoober's observations and the thumb-zone map);
onlinelibrary.wiley.com/doi/pdf/10.1002/hfm.20135 (Yang et al., human
reach envelope and zone differentiation for ergonomic design);
aviationknowledge.wikidot.com/aviation:cockpit-design-and-human-factors +
joast.org (anthropometric cockpit layout, 5th-95th percentile rule);
bostontec.com/ergonomics/ergonomic-reach-zones (primary zone by
frequency of use).
