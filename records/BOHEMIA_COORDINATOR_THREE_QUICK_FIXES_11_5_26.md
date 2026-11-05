# THREE QUICK FIXES FROM THE QUIET DAYS' QUEUE (the coordinator 11/5, by his leave)

## HIS WORDS
"of all the feedback that I've been giving you the last couple of days that you haven't implemented, what's the most token-friendly
ones that you can implement? I'll let you run some tasks and use some tokens if you want."

## THE PICK (cheap, logic only, the NOW pile of rule 404, each something he named as annoying)
1. ZOOMING NEVER SLOWS TIME (rule 384, asks 415 and 436; his 'I'm tired of when I'm zoomed in on my characters and it wants to
   slow down time'). THE WALK READS made a block take several beats up close (slices/bohemia_map_houses.js watchBeats, glideK) and
   capped the street stop at a brisk walk on the glass (slices/BOHEMIA_CITY_WORLD.html streetCapPerBeat), while each block still
   cost the same minutes: the closer he zoomed, the slower the day. NOW: watchBeats is 1 at every zoom (H.walkReads false) and
   streetCapPerBeat is Infinity, so a block is one beat at his speed everywhere; up close the crew covers more glass. Gate re-aimed:
   gates/the_houses_stand_up_close_gate.js W3 (ZOOMING NEVER SLOWS TIME: a block one beat up close, as at the opening stop).
   NOT in this fix: the plumbing half (60 frames a second at every zoom, rule 384(f)), PLUMBER's.
2. AN EVENT GIVES HIS SPEED BACK (rule 398(a), ask 438; his 'if I make it four I have to make it again'). The travel clock dropped
   the march to regular time after a party met, a fight, a chase or a road event (dropToRegularOn). NOW the list is empty, in
   engine/bohemia_travel_speeds.json and the page's mirror (TRAVEL_CLOCK): the card still holds the map while it is up, and the
   march goes on at the speed he had. NOT in this fix: 398(b), a no-choice event as a feed post instead of a stop.
3. THE BURNED PARTS SMALLER (rule 393(d), ask 430; his 'don't have them as big'). records/target/bb/world_state.json
   scars.burned.radius 2 to 4 blocks -> 1 to 2 (the count, 3 to 6 a game, kept), and the page's inline copy
   (BOHEMIA_WORLD_STATE_DATA) the same, checked equal to the file. NOT in this fix: the burned fight board's black look (393(e), at
   final).

## LEFT IN THE QUEUE, AND WHY
- Contact stops him dead (401(b)): the party's picture walks on because the glide keeps it about six tenths of a block behind the
  logic; stopping it dead needs the glide and the meet card changed together, a careful piece, not a quick one.
- The sabre-tooths everywhere (399(c)): the roaming weights already make them rare (0.05 to 0.25 against the watch's 0.5 to 2);
  where he met so many (a hunt job, the water they gather at) needs measuring first.
- AUTO's weapons and shields (394): a real AI change with its gates; a round of COMBAT's.

## GATES (run on this tree; the results are in the commit)
- THE HOUSES STAND UP CLOSE 28/0 (W3 re-aimed to rule 384).
- A DIFFERENT VALLEY EVERY GAME 59/1 (the one red leg is this box's broken PIL, 'V4 the four pictures compared'; the burned board,
  the state, the walk all green).
- THE PAD IS TRAVEL SPEED 9/10: stale before this change (it looks for the old speed pad on the glass, which the phone gate proves is
  gone by rule; its 3x and 5x steps are not the clock's steps 1, 2, 4).
- THE PHONE: rerun alone (the first run, three browsers at once, missed one beat pulse, 4 in 3.2 s).

## AND A FOURTH: HOLD PLAY FOR 4x (rule 396, ask 435)
- slices/bohemia_phone.js __HOLD_FOR_FOUR_TIMES__: when the hold opens the slider, the map runs at the fastest step (4x) while the
  finger holds; on let go his speed comes back (a pause stays a pause), his kept speed untouched; a slide still sets the speed he
  keeps (rule 311); a card that comes up during the hold keeps the map held and gives his own speed back after.
- MEASURED (the demo, the computer profile, tools in the scratchpad): 2x before, 4x while held (his kept speed still 2), 2x after.
- Not done: the space bar on a computer.
