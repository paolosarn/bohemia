# PAOLO 10/26: ONE PHONE, ONE PLACE, AND THE CAMERA FRAMES AROUND IT (LOCKED, rule 213; amends 211(a) and 212(a))

## HIS WORDS (verbatim, voice to text)
"And then on the map, of course you're gonna have to care about the camera angles and then in the settlement menu you'll always
have to care about you know the camera angles and then combat. This is actually gonna be in combat never mind but yeah or maybe
it stays in the same place and that's where the combat let's go at this week will be different, but like the exact same, our
abilities, but small we fit as much as we can page does Animation to let you know that it's like combat time to potentially so
yeah
And just do some big brain research to unlike how this is gonna affect the camera like in map mode combat mode now let me know a
fixed position where the shit's gonna be and like when it's changing the settings how you can easily change what you need to do
wise because I don't think directly in the middle of the screen if you know, I have to be slightly the first of all and then as
you zoom in pretends like that is the same of the center that slightly off center just so it's gonna work smoother with this
phone placement permanent and I don't want the phone changed besides the most it's gonna be the same size"

## THE COORDINATOR'S READING [COORDINATOR'S DEFAULT, rule 205, his to correct]
The new phone (rule 212) is PERMANENT: the same corner and the same size on the map, in the town and in the fight. Only what is on
its screen changes. In a fight it plays a short animation that says 'it's combat time' and its apps become his abilities (small,
as many as fit). Every camera frames the action slightly off centre, away from the phone, and zooms on that point. This reads his
'in the settlement menu you'll always have to care about the camera angles' and 'it stays in the same place' as the phone being in
the town too; it amends 211(a) ('never shows the phone' meant the OLD phone that covered the town's buttons).

## THE RESEARCH (coordinator, 10/26)
- MAPS DO IT WITH PADDING: Google's map SDK lets a view mark a margin where its own UI sits; with uneven margins 'the visual centre
  of the view will move', the visible region leaves the margin out, and camera moves and fits take it into account (GMSMapView
  reference). Apps with a bottom sheet move the map's centre this way, and setting the padding is smooth where moving the camera by
  hand is laggy (a developer's report).
- GAMES KEEP THE HUD IN A SAFE AREA: the HUD's root padded by the screen's insets (the notch, the corners), buttons and words inside
  it, art running edge to edge under it (a mobile guide); game engines do not frame a camera around a HUD by themselves, it is
  written by hand (a Unity forum thread).
- THE THUMB (rule 212's research): the thumb's base sits in a bottom corner; the centre of the screen is where taps are most
  accurate (Hoober's later caution), so the thing he acts on goes near the centre of the OPEN area, not under the phone.

## THE RULING (rule 213)
(a) ONE PHONE, ONE PLACE, ONE SIZE: the phone of rule 212 sits in his chosen bottom corner at one fixed size on the map, in the
    town and in the fight (and on the camp), never moving or resizing between them. Only its screen changes. It never covers
    another press: every screen lays its own buttons out of the phone's corner.
(b) IN A FIGHT: when a fight starts the phone plays a short animation that says it is combat time (the screen lights, a ring on the
    beat, Crashbox tin, stop-motion), and its apps become his ABILITIES (rule 180: the buttons only the player presses), small, as
    many as fit, in one page; the fight's own presses (END TURN, AUTO, RETREAT) stay on the fight's bar. When the fight ends it
    animates back to the map's five apps.
(c) THE CAMERA FRAMES AROUND THE PHONE (the padding way): every screen knows the phone's rectangle as a margin; its FOCUS (on the
    map the party, in the town the place he taps, in the fight the man whose turn it is) sits at the centre of the OPEN area, which
    is slightly off the screen's centre, away from the phone; every pan, fit and follow aims there.
(d) THE ZOOM ANCHORS THERE: a pinch zooms on the point between his fingers; every other zoom (the buttons, the wheel, the zoom when
    a fight or a town opens) zooms on that off-centre focus, so the thing he is looking at never slides under the phone.
(e) FLIP IT IN ONE TAP: the left or right setting mirrors the phone and the camera's offset together, at once, no reload; turning
    the device sideways recomputes the open area the same way.
(f) THE GATE: phone and computer, portrait and landscape, both corners: the phone's rectangle is identical on the map, the town and
    the fight; the focus sits at the open area's centre within a few pixels after a pan, a zoom and a fight's start; no press is
    under the phone; flipping the setting mirrors both at once.
(g) UI TWO [one phone, one place] (the phone everywhere, the fight's animation and abilities page) after [the phone overhaul]; RUN
    [the map frames around the phone]; RUN TWO [the town frames around the phone]; COMBAT [the fight frames around the phone];
    line 134 on his list; EYES checks.

## SOURCES
- https://developers.google.com/maps/documentation/ios-sdk/reference/objc/Classes/GMSMapView (padding moves the visual centre)
- https://slack-chats.kotlinlang.org/t/509108/hey-everyone-i-am-implementing-a-map-heavy-application-i-am-?t=v2 (padding smooth, moving by hand laggy)
- https://docs.mapatlas.xyz/sdk/examples/flutter-offset-vanishing-point (offsetting a map's centre for a panel)
- https://bugnet.io/blog/how-to-fix-mobile-ui-overlapping-the-camera-cutout-island (pad the HUD root by the insets)
- https://forum.unity.com/threads/cinemachine-framing-with-screen-safearea.1079435/ (no automatic framing; written by hand)
- https://www.monterail.com/blog/thumb-friendly-navigation-word-oriented-design (the centre most accurate)
