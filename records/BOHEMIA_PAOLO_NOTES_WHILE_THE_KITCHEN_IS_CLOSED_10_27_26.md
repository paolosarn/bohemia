# HIS NOTES WHILE THE KITCHEN IS CLOSED (rule 296: no cooking until 10/31, the coordinator only listens and records)

Every note he gives while nothing is built lands here, in his words, with what it means, in order. When the chats cook again
these go out FIRST, in this order, before anything else on any lane's list.

## 1. TOP PRIORITY: A TOWN OPENS ON NOTHING BUT BROWN (playing build 10/27e, his day 3)
His words: "Bro, it's a big issue... I'm on day three... I pull up to the... I've tried to get into two settlements and refused
to show me the map other than like Brown type shit so yeah, super important."
What it means: he arrived at two different towns; the settlement screen opened but showed only brown, no town picture (no
buildings, no people). The game cannot be played past the first town like this.
Suspects to measure first (nothing was looked at; the hold stands): the coordinator's settlement-screen changes in builds
10/27b, c and d (slices/BOHEMIA_SETTLEMENT_SCREEN.html: the phone's own ground pad, padGround()'s ground pattern now drawn as the
backdrop, frameFit's new fit, townComp() picking towns[name].tall_left / tall_right, the four towns redrawn in 10/27d). Brown
everywhere is what the screen paints when the ground pattern is drawn and the town picture never lands (a picture that did
not load, a fit that puts it off the glass, or a scale of zero). Check which two towns, on his phone size, from a day-3 save.
Owner when the kitchen opens: COORDINATOR (it broke on his changes), EYES to confirm on the phone. Ask line 248.

## 2. NOTE 1 AGAIN, WITH MORE: THREE TOWNS NOW, AND THE TOWN IS THERE UNDER THE BROWN
His words: "Yeah bro, I tried to enter three cities now and it's just showing like a brown screen. It's annoying. Like if I click
around randomly like I can accidentally click the characters that are on the map, but I can't see them. It's just all brown like
I could I could buy equipment and shit. It's weird."
What it means: every town he enters (three of three) is all brown, BUT the town works under it: a blind tap still finds a
keeper or a person, and the shops sell. So the town and its taps are fine and SOMETHING BROWN IS DRAWN OVER ALL OF IT, people
included; this is not a picture that failed to load (the people are drawn on their own and they are hidden too).
First suspect, from that: the phone's own ground pad (padOf / padDraw in slices/BOHEMIA_SETTLEMENT_SCREEN.html, builds 10/27b-c)
drawn the size of the whole glass instead of the phone's corner (a phone rect that is missing, zero or 'away' read as the whole
screen; the wide column mode taken when it should not be; a pad that runs to the glass edges on every side), or the ground
pattern drawn after the town instead of under it. Measure padOf's rect on his phone size in a real town before changing
anything. Still TOP PRIORITY, still the coordinator's own break. Ask line 248.
