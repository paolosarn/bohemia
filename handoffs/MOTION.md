# MOTION (lane 25) -- the handoff block (written only by MOTION; newest on top)

MOTION (motion-session_01MWGb2M): 10/26 (a) LATEST -- [the UI morphs] (rule 229) BUILT, NOT YET SEEN (EYES watches it, line 151).
WHAT IS IN THE DEMO NOW (slices/bohemia_motion.js, loaded once in the alpha's head, cut into the demo; one layer #bmotion over every frame):
- THE MAP TO A TOWN AND BACK: the town grows out of its own spot on the map (the plate's first pose is that piece of the map, cut to the
  screen's shape, so the camera dives in), held on twos, hands over to the town once it is drawn; LEAVE shrinks the town's picture back
  into its spot. The bar never leaves the glass (the plate is cut around it). The old phone is not in a town any more (UI [no phone in
  the town], a9de7071, landed mid-round): it does not cut out, it folds into its own corner as the town grows and comes back out of it on
  LEAVE. At camp the phone stays (UI's bm-camp), and the layer lays that in the same task so it never blinks.
- THE MAP TO A FIGHT AND BACK: COMBAT's clouds stay (his yes). The bar and the phone are held OVER the clouds; as they part the phone folds
  into his ability tray (#skills); going home the tray folds back into the phone and the bar is held until the map's is back.
- THE SHOP'S BUY: the item (its kit icon on amber tin) flies from BUY onto the face of the man the card shows; his face is held there
  until it lands, the rivets fasten it. Works today (the bag) and when RUN TWO's rule 210 puts it on him.
- A JOB TAKEN: the offer flies into the phone: onto the job's own new card when the phone is on the glass (it waits for the phone to draw
  it, about 120 ms, poking the phone's paint), and into the phone's corner where it folded when there is no phone in the town; the job is
  on the phone when he walks out. A morph's clock starts on its first drawn frame, so a screen's own heavy work in the same tap (the map's
  redraw on LEAVE, half a second on a computer) never eats the poses; a stall is logged (row.stall).
- MAKING CAMP: the camp grows out of CAMP (the plate today; the phone's HEAL app the moment it carries data-morph="camp") and BREAK CAMP
  (or a camp the hunters break) shrinks it back.
- THE CREW SCREEN: grows out of the bar's CREW (map, town, fight) and DONE shrinks it back into CREW.
- REDUCED MOTION: the gear's MOTION button was painted and saved and never tappable; it now toggles FULL / LESS (default: the phone's own
  reduce-motion). LESS makes every morph a 167 ms fade in place.
HOW IT KEEPS ITS PROMISES: the real end state is laid out from the first frame (a growing frame waits at opacity 0, which still takes a
finger), stand-ins never take a tap, and a capture listener on every document skips every morph in flight to its end and lets the tap
through. On the music's own clock (BOHEMIA_BEAT): a piece lands on the first heard eighth 250+ ms out (250-500), a screen change 500+ ms
out (500-750), never past 1,000 ms (the research's finding: two beats is NN/g's flow limit, the ceiling). Six held poses a beat (twelve a
second, on twos), the tin leans and squashes into its travel and overshoots, rivets pop in on landing, the grain boils every hold, one hold
of tape tear on a screen change. Every morph logs itself (BohemiaMotion.log: holds, frames, frames with no piece, skipped, reduced).
HOW THE SCREENS ARE HANDED OVER: wrapped from MOTION's own file, nobody's code rewritten: the map's loopOpenTown, loopClose, campMake; the
shell's nfOpen, nfHome; #crewdoor watched on every page; BUY and TAKE read in the capture phase. BohemiaMotion.adapters says which are on.
THE GATE: gates/the_ui_morphs_gate.js (THE UI MORPHS, in the suite), phone and computer. THE VERDICT for 'never a frame where a shared
piece vanishes': every frame, in the page, the browser's own hit test finds the bar and the phone on top at their place through every frame
they sit in (COMBAT's clouds counted as a cover); the browser's screen recorder keeps every frame as the witness. Pixels alone could not be
the verdict: the bar's own content changes inside a change (the batteries flash amber as the camp bill is paid; the fight's bar carries five
supplies where the map's carries six, which is ONE HUD's business, UI, rule 190: noted for UI). M0-M10 as its header says.
FOUND AND FIXED THIS ROUND, a flash that was there before the morphs (the cut hid it): on the FIRST town open UI's one-HUD watcher is not on
the new town frame until its next half-second paint, so the frame stood over the bar and the phone for up to half a second. The layer now
lays UI's own two lines (html.bm-town and --bm-hud-h, from hudTown) in the same task the frame opens, and never hands over before they are on.
NOTE FOR UI: if hudTown is ever exported, MOTION calls it instead of copying its two lines. Run: node gates/the_ui_morphs_gate.js [phone_portrait|computer]. The result of this round is in the
commit message. For a photograph mid-morph: BohemiaMotion.slowly(12) (the game never sets it).
PRE-PUSH PASS (rule 13a): the gates that read my files, named in the commit. Reds that are not mine, on main before me: NO ORPHAN SCRIPT
(bohemia_loading_screen.js loaded by nothing), PAGES PUBLISH (the site's size, PLUMBER).
SEEN WHILE MEASURING, NOT MINE, ROUTED: (a) RUN's meet card (a hunting party's 'RAIDERS AFTER...') is a full-glass dialog that sits over
the bar for its first frames (its dim backdrop is see-through, the bar stays visible; it is not one of the six changes: MOTION's next list);
(b) ONE HUD EVERYWHERE can go red on 'the phone stands where it stands on the map, over the town' by chance: FEED's live post (#feednow,
76 points, [the feed is alive] 9c0ed11e) grows the phone from 250 to 262.8 if it lands between the gate's two measurements; measured the
same 262.8 on the map and in the town with MOTION's layer on and off (UI and FEED's to settle: a fixed phone, rule 213(a)).
NEXT (in his order, when the pieces exist): (1) the phone in the fight (UI TWO, rule 213(b)): when the phone stays in the fight, the fold
becomes its apps into his abilities inside the phone, one app per square (tag each app data-morph="app:<name>", each square
data-morph="ability:<n>"); (2) the town's pinch-out (RUN TWO, rule 211(c)): drive BohemiaMotion.shrink by the gesture's own progress;
(3) the spoils screen (it covers the fight's bar today: the bar should be held over it or the spoils laid under it); (4) the map's fit to
the jobs on leaving a town (RUN, rule 228): the shrink already re-reads the town's spot every hold, so a camera easing out is followed;
(5) the HEAL button (CAMP, rule 226, shipped 72835dfb on the CAMP plate): the camp already grows out of it (#campbtn); the phone's HEAL
app, when UI TWO draws it, takes data-morph="camp"; (6) SOUNDS: a tin clack on the landing hold; (7) the meet card's entrance and every
other dialog (rule 229(a): every change between states).
