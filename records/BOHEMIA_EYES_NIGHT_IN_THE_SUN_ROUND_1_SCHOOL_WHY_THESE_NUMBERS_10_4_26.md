# EYES AND EARS -- [night in the sun measured] -- ROUND ONE: SCHOOL
### 10/4/26 -- session eyes-5vql33

Row (rule 73): measure the demo's night pictures (the fight, the map) against a sunlight floor,
before and after a glare test, and say which fails first. Rule 54a two-round discipline: this
round is research only, no measuring. Real sources below, then what round two will build off them.

## THE BARS ARE NOT INVENTED -- THEY ARE THE REAL ACCESSIBILITY FLOOR

Rule 73's numbers (3:1 for a lit tile against an unlit one and a man against his ground, 4.5:1 for
words) are exactly WCAG 2.1's own published minimums: Success Criterion 1.4.3 sets 4.5:1 for normal
text, and Success Criterion 1.4.11 (Non-text Contrast) sets 3:1 for UI components and graphical
objects against their neighbours. These are the real, load-bearing numbers a huge body of real
screens is built and legally audited against, not a figure this lane or the coordinator picked by
feel. [WCAG color contrast requirements](https://www.colorcontrast.org/blog/wcag-contrast-requirements/),
[WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/)

## THE REAL TEST SHAPE: CONTRAST UNDER ADDED LIGHT, NOT A DARK-ROOM NUMBER

DisplayMate, the industry's own reference lab for this exact question, tests phone and tablet
screens inside an integrating hemisphere that ramps ambient light from 0 lux (absolute dark) up
through 40,000 lux (indirect sun) to 100,000 lux (direct noon sun), and scores an "Ambient Contrast
Rating" under that added light -- explicitly BECAUSE a display's advertised dark-room contrast
ratio is "largely irrelevant for smartphones" used outdoors. That is the same shape as rule 73's own
test: measure the real picture, then measure it again with a flat wash of light added, and report
where it breaks. Rule 73 did not invent a new method; it is doing, on one frame at a time, what the
real industry lab does across a whole illuminance ramp.
[DisplayMate Smartphone Brightness Shoot-Out](https://www.displaymate.com/Smartphone_Brightness_ShootOut_1.htm)

## THE HARDWARE BAR WE DO NOT CONTROL, SO THE SOFTWARE MARGIN IS THE ONLY LEVER

Purpose-built "sunlight readable" displays (the kind built for outdoor industrial and automotive
screens) are specified at over 1000 nits of brightness, an 800:1 contrast ratio, and an anti-glare
coating that cuts reflectance below 1%. An ordinary phone screen, including his, does not hit that
bar and this game cannot change the glass. That means the ONLY lever a game studio has is the
contrast margin it paints into the picture -- which is exactly what rule 73 is asking this lane to
measure. [Sunlight Readable TFT Displays](https://www.displaymodule.com/blogs/knowledge/sunlight-readable-tft-displays-nits-brightness-contrast-anti-glare)

## WHY "ADD A FLAT 25% WHITE" IS A FAIR PROXY, NOT A LITERAL PHYSICAL MODEL

Real glare on a screen is veiling luminance: ambient light reflecting off the glass back at the
eye, roughly proportional to the glass's own reflectance times the ambient illuminance, worse at
shallow viewing angles. An uncoated glass surface reflects about 4% of incident light; modern phone
glass carries an anti-reflective coating specifically to cut that number down. Under true direct
noon sun (order of 100,000 lux) even a well-coated screen's veiling glare can be severe -- so rule
73's flat 25% white compositing pass is a DELIBERATE SOFTWARE PROXY for a real physical effect this
lane cannot measure photometrically (there is no light meter here, only pixels), not a claim that
25% is the exact real-world number. NAMED FOR ROUND TWO: a frame that passes the 25% test is a real,
useful signal of margin; it is not the same claim as "this is proven readable in direct noon sun,"
and the honest final check, per this lane's own standing religion, is still VERIFY ON THE REAL
SURFACE -- a phone, outside, in the sun. [Veiling Glare](https://www.imatest.com/docs/veilingglare/)

## A WALL THIS LANE DID NOT KNOW UNTIL THIS SEARCH: THE PHONE CANNOT TELL US HOW BRIGHT IT IS OUTSIDE

iOS Safari has never implemented the Ambient Light Sensor API, on any version, and Apple does not
expose one to the web at all -- a permanent platform wall, not a gap waiting on an update. That
means an automatic "the game sees the sun and brightens itself" is not available on the surface his
phone plays on. Rule 73's own call -- a SETTINGS brightness slider the player sets by hand, with a
calibration picture -- is not a lesser version of the real feature; given this wall, it is the only
honest one. [Ambient Light Sensor, caniuse](https://caniuse.com/ambient-light)

## WHAT REAL OUTDOOR MOBILE UI PRACTICE ADDS BEYOND THE BARE NUMBERS

Beyond the pass/fail ratios, the real design practice for outdoor-readable screens is qualitative
and worth carrying into how round two reads a failing frame: avoid pastel and mid-tone grey fields
(they are the first things to wash out and the hardest to push back up without also blowing out
everything else); prefer bold, saturated colour blocks over soft gradients; keep body text no
smaller than about 14-16 points. If a frame fails the numeric floor, round two should also say
whether the failing colour is a washed-out mid-tone (the known hard case) or something else, since
that changes what fixing it looks like. [Design a Mobile App UI for Bright Sunlight](https://www.linkedin.com/advice/3/how-can-you-design-mobile-app-user-t85ue)

## WHAT ROUND TWO BUILDS, ARMED BY THIS

1. Measure the demo's night fight and the night map at his phone's profile: the walkable ground's
   median luminance (floor 20% of white); a man against his ground and a lit tile against an unlit
   one (floor 3:1, WCAG's own non-text bar); the bar's words (floor 4.5:1, WCAG's own text bar).
2. Composite the same frame with a flat 25% white added (the sun test, named above as a software
   proxy, not a photometric claim) and re-measure all three.
3. Report which picture fails first and by how much, with the before frame and the glare frame
   side by side, one VOTE item -- and say plainly that passing this proxy is real margin, not proof
   of noon-sun legibility, since no light meter exists here to make that stronger claim honestly.

## ROUTED

Nothing to route yet -- this is the school round. The check (round two) does the actual reading
against COMBAT's night fight and RUN's night map once both exist on the alpha, per rule 73's own
assignment list.

## SHIP TEST FOR THIS ROUND

Every number rule 73 asks for is traced to where it really comes from (WCAG's own two success
criteria), the test SHAPE is traced to the real industry method (DisplayMate's ambient-light rig),
the proxy's honesty limits are named instead of assumed, and a real platform wall (no ambient
sensor on iOS Safari) is found and used to confirm, not second-guess, the rule's own brightness-
slider call. NO MEASURING THIS ROUND, per the lane's own two-round law. Round two next.
