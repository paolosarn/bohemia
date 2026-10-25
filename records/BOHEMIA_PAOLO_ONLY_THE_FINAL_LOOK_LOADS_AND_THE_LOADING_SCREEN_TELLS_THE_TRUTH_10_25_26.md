# PAOLO 10/25: ONLY THE FINAL LOOK LOADS, AND THE LOADING SCREEN TELLS THE TRUTH (LOCKED, rule 174)

## HIS WORDS (verbatim, voice to text)
"Also, I hate when when the whole world map loads up like I'm still seeing like the previous like months ago and Judy
character skin underneath everything like why is that necessary like why can't I'm sure that cost usage like I'm sure
that that takes up memory like even just trying to have things load underneath other things I'm not quite sure, bro so
please just have things that are gonna be final visuals like that are part of the actual game load. I don't want it. I
don't know we don't need to have a whole 2-D world underneath it on top of it bro come on and it just goes to show the
loading screen isn't even correct because you say you're loading and then I press go and then it's still loading like
ghost month old bullshit before I see the 3-D in maps so what's going on?"
('Judy' is the voice transcription; he means the old 2-D character skins from months ago.)

## WHAT HE SEES
After the loading screen and GO, the map first draws the old 2-D world and the old 2-D people, and only then the 3-D map and
the 3-D people replace them. Known fallbacks on main draw the old picture until the new one lands (for example COOK
99486fba: 'until a patch lands the picture is drawn, as before'; RUN cbcebcac: 'the barber's man only if his own sheet
never comes'), and RUN's 10/24 crash record found the old street tiles and the map's people sheets still costing memory.

## THE RULING (rule 174)
(a) ONLY THE FINAL LOOK LOADS. No old 2-D world, no old 2-D people, no stand-in, ever drawn under, over or before the
    final 3-D map and its 3-D people. What is not part of the game's final look is not fetched, decoded or drawn. Dead
    layers leave the build (to the graveyard where the law says, GRAVEYARD IS FINAL), and the memory they cost is
    measured as saved (it feeds rule 173's crash).
(b) THE LOADING SCREEN TELLS THE TRUTH: it holds until the map and its 3-D people are ready to show together; GO appears
    only then; the first frame after GO is the final look. If something is still coming, the loading screen says so, it
    never hands him an unfinished map.
(c) THE GATE: from the title through GO to the map on both profiles, every frame after GO is the final look (no old 2-D
    asset requested, decoded or drawn at any moment, measured by the requests and the pixels), and the time from GO to the
    first final frame is written down.
(d) RUN [only the final look loads], with [the crash before the fight] (rule 173) in the same round: one measurement of
    memory serves both.
