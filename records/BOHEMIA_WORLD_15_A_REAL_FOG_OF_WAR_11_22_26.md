# A REAL FOG OF WAR (WORLD 15, 11/22; VAMILY rule 470(c), ask row 703; rule 473's edge names; rule 441; rule 454(a): no words)

## HIS WORDS (11/22, on the trucker's card: '...I can't find a town without paying THE SURVEYOR for a piece of his map')
'until you kill the surveyor you don't even get to see the rest of the map... I know you can like see the whole map technically right
now and I hate that. How about there's like a real fog of war you know where you can't see anything underneath it and it can be whatever
sort of aesthetic you want it to be... maybe if you kill the surveyor then like you can see the faint map as it is right now that you
haven't discovered, cause right now you can see everything, it's just dark kind of vibes'.

## MEASURED FIRST (a stranger's new game on the demo, the fog on, the far stop and up close)
- RUN's fog (rule 155) marks what he has seen; WORLD TWO's faint city (slices/bohemia_his_map.js fogDraw, rule 243(b)1) draws the unseen
  ground: the real map greyed and multiplied with tape static, its blocks, freeways and towers all readable. That is 'everything, just dark'.
- And drawn after the fog, on ground he had never seen: the road shields (95, US 95), the mountains' names, a checkpoint's name, the
  camps' smoke, a building and a party.

## NOW (slices/bohemia_the_real_fog.js; one line in BOHEMIA_CITY_WORLD.html loads it)
- UNTIL THE SURVEYOR FALLS: after the whole frame is drawn, one cover over every block RUN's fog marks unseen and over everything past the
  region's square: opaque, nothing under it. The look is a dead channel: near-black grain and scanlines, two frames trading places on the
  beat, a faint tracking band (analog horror). What he has seen stays drawn, RUN's soft rim kept (his fog's 246-of-255 dark is lifted to
  full by one additive pass of a twenty-fifth of itself, so the rim barely moves).
- WHEN THE SURVEYOR FALLS (BOSSES' THE SURVEYOR, WORLD TWO's ladder keeps his fall with the game): the cover lifts for good and the
  undiscovered map shows faint, exactly as it showed before this build.
- Under the cover WORLD TWO's faint pass is not run (it would never be seen); after the fall it runs as it did.
- The bench (bohemia.fog.off) and a game from before the fog are untouched.
- THE COST: the cover is built a margin wider than the glass at a quarter of its pixels and carried to every frame's camera (the map's
  projection is a shift and a scale), so a walk and a pinch are one draw a frame (0.1 ms measured); it is built again only when new
  ground comes in (about 20 ms on this box's software glass, once in a 6-block walk; the map's own ground repaint is 67 to 115) and once,
  crisp, when the camera holds after a pinch.

## RULE 473: THE MAP'S OTHER EDGE NAMES (WORLD 15's part)
Measured: the side work's edge names are JOBS 2's (bohemia_job_kinds.js). The other edge name on the map is a FOUND BOSS off the glass
(WORLD TWO's edge(): his skull and name at the glass's edge, one for every boss found and not killed). KEPT: ONE, the boss he is on (the
first found on HIS ladder), because it is the story's one thread and one mark is not clutter. TAKEN OUT: every other found boss at the
edge; each stays marked where it stands (its skull on its place), found by looking, the way side work is now (rule 473(b)).

## PROVED (gates/a_real_fog_of_war_gate.js, A REAL FOG OF WAR (demo) and (alpha), a phone both ways)
F1 NOTHING UNDER IT: the unseen ground is the very same pixels by day and by night under the cover, at the far stop and up close
(F6, the cover off, the same points change with the night: the test bites); F2 where he has been stays (within 3 shades); F3 THE
SURVEYOR fallen lifts it; F4 a real 6-block walk; F5 the bench; F7 nothing threw; F8 a pinch: 12 frames, 0 rebuilt, crisp once held.

[bb Battle Brothers hides the world past what the company has seen, and its maps are bought or found; ours is bought from the Surveyor
or taken from him.]
[analog horror: past the edge of what you have walked the map is a dead channel; nothing is there until somebody draws it.]
