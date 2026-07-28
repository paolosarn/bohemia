# BOHEMIA ADDENDUM — VEGAS WEATHER (Paolo 7/28/26, LOCKED)

Asked (off the engine reality map, weather = MISSING everywhere): should Act
One have weather at all?

Paolo's words: "Weather yes please however vegas weather is just mostly sunny
then mostly cloudy and maybe it rains once a month fr so. Weather not too
diverse but yeah. Plus alot of foliage is going to be dead anyway."

THE RULING:
1. WEATHER EXISTS. It is now ruled work, not a pending.
2. IT IS VEGAS WEATHER, NOT A WEATHER SYSTEM. The whole vocabulary:
   - MOSTLY SUNNY — the default state, most days.
   - MOSTLY CLOUDY — the second state, common enough to notice.
   - RAIN — RARE. Real-Vegas rare: on the order of once a month of game time.
     When it rains it is an EVENT, exactly because it almost never happens.
   That is the complete list. NOT TOO DIVERSE is the law: no snow, no fog
   banks, no storm variety ladder, no seasons of weather. Anyone proposing a
   fourth weather type is violating this addendum, not extending it.
   (Grounded in the real: Las Vegas averages ~2 dozen rain days and ~300
   sunny days a year, and monsoon rain arrives as a short loud event.)
3. DEAD FOLIAGE IS THE BASELINE, NOT A WEATHER EFFECT. "A lot of foliage is
   going to be dead anyway": the world's plant life reads dead/dry by
   default (dead lawns, dry shrubs, bare trees, the irrigated-thing-that-
   died language already in the district records). Weather never greens it.
   Rain on a dead valley wets the ground; it does not revive anything.
4. MECHANISM-MINE / CONTENTS-PAOLO'S: the state machine, transition timing,
   and render passes are the fleet's. The distribution above (mostly sunny >
   mostly cloudy > rain ~monthly) is HIS ruling and ships as the table's
   contents. Exact percentages/durations beyond that ratio stay tunable
   without a new ruling as long as the feel matches "it rains about once a
   month for real."
5. BUILD NOTES (routed, WORLD owns the engine half): weather is a world
   state the resolver/day machinery can carry — it composes with the
   finished-but-unwired daycycle module (reality map gap 8); wire together,
   not as rivals. Render side: sunny = baseline light, cloudy = a flat
   ambient wash, rain = overlay + wet-ground pass. Tile/overlay art goes
   through the TILE REQUEST BOARD like everything else.

Routed: BOHEMIA_BACKLOG.md WORLD ER(c). Reality map §4 pending list updated.
