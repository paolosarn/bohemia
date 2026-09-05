# FEED REFERENCES (the phone on the city screen — spacing, type, rhythm)

FOR: the 9/4 feed law (in CITY mode part of the UI is a phone scrolling one
feed of three kinds of post: what you did, what the world did, generated
life) — one sheet so UI builds it once. The numbers below are RATIOS first,
because a feed's readability is its ratios, then translated to our surface
(a 390 px portrait viewport, monospace UI type at 10-13 px). Nothing here
enters the design vocabulary (8/28): rulers only.

### FEED-01  The post anatomy (the timeline standard)
- WHERE: https://picsart.com/sizes/x-twitter/
- KIND: real
- TEACHES: a feed post is four stacked parts and never more - identity line (avatar + name + time, the avatar 48 px against 15 px body text, about THREE text lines tall), body, optional media, meta row; every feed people actually read keeps that order, so ours does.

### FEED-02  The rhythm (why a feed feels alive)
- WHERE: https://createbytes.com/insights/Twitter-UI-UX-Review-Design-experience-analysis
- KIND: real
- TEACHES: the scroll reads alive because post heights VARY (one-liner, three-liner, media card) under an unvarying skeleton - same gutters, same identity line, one hairline divider; uniform post heights read as a table, and a table is not a feed.

### FEED-03  The ratios at our pixel scale
- WHERE: this sheet, derived from FEED-01 on our measured surface (390 px viewport, 10-13 px monospace UI)
- KIND: pixel
- TEACHES: hold the standard's ratios - avatar = 3 body lines tall, gutter = half a body line, divider = 1 px - so at 11 px body the avatar is 32 px, the gutter 6 px, a post 3 to 6 lines; body text never drops below 11 px on a phone (the eighth-grade law is also a type-size law).

### FEED-04  Three kinds, one mark each
- WHERE: laws/BOHEMIA_ADDENDUM_THE_FEED_ON_THE_CITY_SCREEN_9_4_26.md + the one-number rule (day 17)
- KIND: real
- TEACHES: the three post kinds (your deeds / the world's moves / generated life) are told apart by ONE mark on the identity line - a glyph or a single accent, never a layout change per kind; three layouts would make three feeds, and the law says one.

### FEED-05  The phone is a phone
- WHERE: https://developer.apple.com/design/human-interface-guidelines
- KIND: real
- TEACHES: the on-screen phone keeps a real phone's proportion (about 9:19.5) and sits where the thumb lives; if it cannot afford 11 px body text at that proportion it is a WIDGET, not a phone - shrink the world view, not the type.
