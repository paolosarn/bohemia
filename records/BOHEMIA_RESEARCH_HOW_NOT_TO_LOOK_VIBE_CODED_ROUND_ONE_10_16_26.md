# BOHEMIA RESEARCH: HOW NOT TO LOOK VIBE CODED, ROUND ONE (10/16/26)

**The question.** Paolo says everything the chats draw "looks vibe coded", "looks like it was made by an AI guy", "coded by a seventh grader". What makes game graphics read as AI-made, machine-assembled or programmer-drawn to a human eye, and what do professional pixel artists and art directors do that our art does not?

**How this was researched.** Web search over pixel-art tutorials (Pixel Joint, Lospec, Saint11, Slynyrd, Pixel Logic), AI-art and AI-UI detection write-ups, developer interviews (Dead Cells, Octopath Traveler, Blasphemous, Stardew Valley, Hyper Light Drifter, Eastward, Celeste), GDC listings, and procedural-generation articles (Red Blob Games, Spelunky, Dead Cells). The session's gateway refused direct page fetches (HTTP 403 on CONNECT for every outside host), so each quote below is the passage the search engine extracted from the cited page, not a fresh read of the whole page. Where a source is a blog with a product to sell, or a forum post, the entry says so. Every claim carries its URL.

**The one-paragraph answer.** The "AI look" is not one defect. It is the sum of about thirty small, mostly measurable ones, and they all share a root: nobody decided anything. A human artist makes a few hard choices up front (one pixel size, one palette, one light, one outline rule, one focal point per screen) and then spends most of the effort on the five percent of the picture that matters. A generator or a tired programmer makes no choices and spreads effort evenly, so the picture has detail everywhere, light from nowhere, colours from everywhere, and a grid that does not agree with itself. The fix is not better drawing. It is a written style guide with numbers in it, a machine gate for each number, and a hand-finished pass on the hero assets. Section D ranks the ten checks a gate can run this round.

---

## SECTION A: THE TELLS

Each tell has: what it is, why it reads as machine-made, a measurable test a script or a reviewer can run, and the source. Tests are written for a sprite with an alpha mask or a rendered scene screenshot at native resolution (1x, before any display scaling).

### Grid and resolution tells

**1. Mixed pixel sizes in one scene ("mixels").**
What: some art is drawn at 1 art pixel = 1 screen pixel, other art at 2 or 3, and they sit side by side.
Why it reads machine-made: pixel art's whole promise is one grid. Community usage defines a mixel as "a pixel of incoherent or inconsistent size when compared to the rest of the artwork as a whole", and the usual cause is that small art was "scaled up in-engine, it's as if you had taken the scorpion and placed it at a 2x larger scale". The AI-pixel-art write-ups call mixels "the most reliable sign of AI involvement".
Test: for each sprite and for each region of a screenshot, compute the histogram of horizontal and vertical same-colour run lengths and take the smallest run length that accounts for more than 20% of edges; that is the native pixel size. A scene with two native sizes among non-background layers is a tell. A sprite whose "pixels" vary in width (one write-up measured a generated sprite's blocks "between 26 and 32 pixels wide") fails outright.
Sources: https://ozdic.com/word/mixel ; https://community.flowlab.io/t/mini-rant-stop-using-mixels/38287 ; https://itch.io/post/8448610 ; https://discover.oreateai.com/discover/the-grid-never-lies-how-to-spot-ai-in-pixel-art-and-digital-sprites ; https://runware.ai/blog/retro-diffusion-creating-authentic-pixel-art-with-ai-at-scale

**2. Off-grid pixels, non-integer scaling, bleeding edges.**
What: a sprite drawn at 1x but placed at 1.5x or at a fractional position, so pixels smear or go uneven.
Why: "a sprite should never pack more than one art pixel into a single screen pixel, or the engine produces uneven pixel artifacts." AI output also has "pixels that bleed into neighbors, blur at edges, or sit slightly off the grid".
Test: in the scene, every sprite's native pixel size (test 1) must be an integer multiple of 1 screen pixel and its position must be a multiple of that size. Count edges where a single art pixel spans two different screen-pixel widths; any is a fail.
Sources: https://www.moddb.com/games/space-station-continuum/tutorials/pixel-art-screen-resolution-and-zooming ; https://discover.oreateai.com/discover/the-grid-never-lies-how-to-spot-ai-in-pixel-art-and-digital-sprites

**3. Resampled or blurred edges (bilinear scaling, anti-aliased tools).**
What: a pixel sprite that was scaled with a smoothing filter, or drawn with a soft brush.
Why: "Pixel art, by definition, does not utilize anti-aliased tools, so it is considered to be aliased." AI tools "add partial transparency, glows, blurs, and noise" that true pixel art avoids. The remedy for scaling is "nearest-neighbor scaling so edges stay hard".
Test: count pixels whose alpha is neither 0 nor 255; over 1% of the sprite is a tell. Count distinct colours that appear only once or twice and sit between two palette colours in RGB space (filter residue); over 5% of pixels is a tell.
Sources: https://pixelparmesan.com/anti-aliasing-fundamentals-for-pixel-artists ; https://www.starbounder.org/Help:Resizing_Images ; https://www.spritecook.ai/docs/color-options

### Colour tells

**4. Too many colours per sprite.**
What: a 32x32 sprite with 40, 80, or thousands of colours.
Why: "Pixel art is clearest to read when it relies on clusters of colour to convey information. The more colours you have, the smaller and more numerous your clusters are", and small clusters read as noise. A student studio's style guide puts the rule plainly: "generally more than 16 colors for a single sprite is too many", and too many colours make a sprite "muddy, uncannily smooth, and inconsistent". AI pixel art "carries tens of thousands of colors". One retro-art source gives the era read: "Four colours reads as 8-bit. Sixteen reads as 16-bit. Sixty-four reads as modern indie regardless of what else you do."
Test: count distinct opaque RGB values per sprite. Over 16 for a character or prop sprite under 64x64 is a tell; over 32 is a fail. Every colour must also appear in the master palette file (test 5).
Sources: https://pixeljoint.com/forum/forum_posts.asp?TID=11299 ; https://gdg.mit.edu/style-guide ; https://rangy.ai/blog/ai-pixel-art ; https://u.osu.edu/solidlight/?p=14 ; https://divoom.com/blogs/setup-ideas/pixel-art-palette-how-many-colors

**5. Off-palette colours (no palette lock).**
What: each asset invents its own colours instead of pulling from one shared list.
Why: "a shared palette across the whole game ... creates visual consistency", and the practice is to "record exact hex values with roles such as background, actor, and accent". Lospec exists for exactly this restriction: "digitally restrictive art, typically pixel art that restricts the palette and resolution."
Test: load the master palette; count pixels in each asset whose colour is not in it. Zero tolerance for sprites and tiles; UI may hold a declared exception list.
Sources: https://bugnet.io/blog/how-to-write-an-art-style-guide ; https://www.sprite-ai.art/blog/2d-pixel-art-style-guide ; https://boingboing.net/2019/10/01/lospec-a-resource-site-for.html ; https://lospec.com/pixel-art-tutorials/tags/hueshifting

**6. Straight darkening (no hue shift in the ramps).**
What: shadow = base colour with brightness turned down; highlight = base with brightness turned up.
Why: "the quickest way to make pixel art look flat is to shade a colour by only darkening and lightening it." Saint11's colour article shows the plain value ramp "looks a little dull and muddy" and fixes it by making "the shadow a little more blue and less saturated (colder) and the light warmer". One tutorial author notes that skipping hue shift gives "an uncanny, digital, or photographic kind of look", which is the AI read in one phrase.
Test: group a sprite's colours into ramps (colours whose hue lies within 40 degrees and that touch each other in the image). For each ramp of 3 or more steps, compute hue in HSV at the darkest and lightest step. A hue delta under 8 degrees across the ramp is straight darkening; over half the ramps in a sprite doing it is a tell.
Sources: https://www.wayline.io/learn/color-palettes/2 ; https://saint11.art/pixel_art_articles/article6/ ; https://aulavirtual.cui.edu.ar/blog/the-antihero-of-the-story/759293827411558400-pixel-art-fundamentals-hue-shifting ; https://www.pixel-editor.com/articles/color-theory-for-pixel-art

**7. Over-saturation everywhere.**
What: every colour is at or near full chroma, so nothing is quiet.
Why: palette tutorials build "a mix of vivid and muted colors" and note "the desaturated colors can provide a more natural look, and work well as grays in combination with the vibrant colors". Octopath's team reported that one iteration "went too far on the resolution and saturation, losing the appeal of pixel art". Common beginner lists name "over-saturated palettes" alongside too many colours.
Test: mean HSV saturation of a sprite's opaque pixels; over 0.75 is a tell. Share of palette entries with S over 0.85; over 40% is a tell (a palette needs greys).
Sources: https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes ; https://www.siliconera.com/project-octopath-traveler-developers-answer-project-started-troubles-developing-hd-2d/ ; https://www.wayline.io/learn/pixel-art/1

**8. Smooth gradients and glows.**
What: a sky, a button or an aura built as a 30-step smooth gradient, or a soft bloom around light sources.
Why: real pixel art has "soft gradients that dithering alone couldn't produce" only by deliberate exception (Hyper Light Drifter), and smooth gradients are the hallmark of generated or CSS-built art. Bloom "flattens contrast and makes geometry look deformed", and games "from the 2005 to early 2010s era drew criticism for overusing the technique".
Test: scan each horizontal and vertical line for monotonic colour sequences of 6 or more distinct colours whose per-step RGB distance is under 12; the share of the image covered is the gradient score. Over 5% of a sprite, or any post-process bloom pass applied to sprites, is a tell.
Sources: https://mechinia.itch.io/a1-skills-development-jay/devlog/808798/pixel-art-style-analysis ; https://daejeonchronicles.com/2026/07/20/how-to-kill-a-game/ ; https://en.wikipedia.org/wiki/Bloom_(shader_effect)

### Shading and light tells

**9. No consistent light source across the scene.**
What: the house is lit from the left, the tree from above, the character from the right.
Why: pixel-art guides call it a golden rule to "keep the light direction consistent within a single work (or game scene), since mismatched light sources on characters, backgrounds, and items create visual dissonance." A tileset critique on OpenGameArt named the exact failure: "the shadows of the shrubs and trees are straight up and down, but the sides of the houses are shaded in on the bottom left." Top-left is the usual default "partly because players are used to that convention from computer GUIs".
Test: for each sprite, take the brightest 20% of opaque pixels by luminance and the darkest 20%; compute the vector from the dark centroid to the light centroid. That is the sprite's light angle. All sprites in one scene must agree within 30 degrees of the scene's declared light; any sprite outside 45 degrees fails.
Sources: https://pixnote.net/en/learn/shading ; https://lpc.opengameart.org/user/18016/comments?page=2 ; https://pixeljoint.com/forum/printer_friendly_posts.asp?TID=21119 ; https://www.slynyrd.com/blog/2018/6/15/pixelblog-6-light-and-shadow

**10. Pillow shading.**
What: shading that wraps the outline in concentric rings, bright in the middle, dark at every edge, no matter where the light is.
Why: "Pillow-shading is a pronounced form of banding, characterized by concentric strips that perfectly follow the object's outline." It "pays no attention to the light source", which is the signature of a shading algorithm (or a lazy hand) that shades by distance from the edge.
Test: compute the distance transform from the sprite's outline inward. Correlate each pixel's luminance with its distance from the edge. A Pearson r over 0.7 across the sprite means value is a function of edge distance, not of light: pillow.
Sources: https://repository.tudelft.nl/file/File_65d43acd-9779-4eab-999b-9bcd4f0a96a9 ; https://pixeljoint.com/forum/forum_posts.asp?TID=11299 ; https://www.wayline.io/blog/pixel-art-demanding-art-form

**11. Banding.**
What: parallel strips of colour whose endpoints line up, so the shading looks like stacked bars.
Why: "Banding occurs when two adjacent pixel segments of different colors align their endpoints along a shared axis." It is a common by-product of automatic anti-aliasing: "banding can easily be the result of otherwise good practices like antialiasing." Avoiding it "means paying close attention to pixel clusters".
Test: for every pair of adjacent same-length runs of different colours stacked along one axis, count cases where both endpoints align (a 2-high, N-wide block with a horizontal colour split, N at least 3). Normalise by sprite edge length. Over 15% of edge pixels participating in such aligned stacks is a tell.
Sources: https://repository.tudelft.nl/file/File_65d43acd-9779-4eab-999b-9bcd4f0a96a9 ; https://pixeljoint.com/forum/forum_posts.asp?TID=11299 ; https://pixeljoint.com/forum/printer_friendly_posts.asp?TID=13060

**12. Jaggies (uneven stair steps on curves and diagonals).**
What: a diagonal whose steps go 1, 3, 1, 2 instead of 2, 2, 2.
Why: a line "reads as smooth only when the steps are consistent. When the step lengths jump around (1, then 3, then 1), the eye sees a jagged, broken edge." Lospec's outline article sets the rule: "the stair-step segments should be the same length, since a mismatched segment looks bumpy to the eye."
Test: trace each 1-pixel outline; along each monotonic curve segment record step lengths. A segment whose step lengths are non-monotonic (a short step between two longer ones) is a jaggy. Over 3 jaggies per 100 outline pixels is a tell.
Sources: https://www.wayline.io/learn/pixel-art/1 ; https://lospec.com/articles/pixel-art-outlines ; https://divoom.com/blogs/setup-ideas/fix-jaggies-pixel-art-without-blur

**13. Orphan pixels and doubles.**
What: a lone pixel poking off a shape with nothing connecting it; or two stacked pixels thickening a 1-pixel line.
Why: both are what a brush drag or an auto-outline leaves behind. "Doubles ... two stacked pixels that thicken a 1px line and interrupt its flow." Doubles "often come from auto-generated outlines (such as 'alpha from image') or from dragging a brush instead of placing individual pixels." Orphans are defined as "a lone pixel poking off a shape with nothing connecting it".
Test: orphans: count connected components (4-connected, same colour) of size 1 that are not an intermediate colour between their two neighbours (not anti-aliasing). Over 2 per 1,000 opaque pixels is a tell. Doubles: on the outline mask, count 2x2 fully-outline blocks that are not at a corner; any on a 1-pixel outline is a tell.
Sources: https://www.wayline.io/learn/pixel-art/1 ; https://www.braceletbook.com/tutorials/120_making-better-outlines-for-alpha-patterns/

**14. Over-dithering (checkerboard noise everywhere).**
What: 50% dither used as the default shading step, or dither over large areas.
Why: "dithering makes art look noisy and muddy when applied everywhere"; "beginners commonly overuse dithering"; dithering "comes up in every pixel art tutorial because it's fairly unique to the medium, not because it's something you should be using all the time." On modern screens "it does not convey the same effect as it did on older hardware".
Test: count 2x2 checkerboard patterns (two colours alternating) in the sprite. Share of opaque area covered by checkerboards over 20% is a tell; dithering between colours that are not adjacent ramp steps is a fail.
Sources: https://divoom.com/blogs/setup-ideas/pixel-art-dithering-when-to-use-and-stop ; https://www.gamedev.net/topic/629704-dithering-help-in-for-my-pixel-art ; https://pixelparmesan.com/dithering-for-pixel-artists

**15. No three-value read.**
What: the sprite is all mid-tones; dark, mid and light do not each own a real area.
Why: "value is the most important component in creating readable sprites". The pixel-art composition rule: "Sketch three blobs of value (dark, mid, light) at 1x scale. If your focal action does not sit on the strongest value contrast, you are fighting your own background." The cheap audit: "desaturate the sprite to grayscale and see whether the shapes are still distinguishable."
Test: convert the sprite to luminance; quantise to 3 bins at 33% and 66% of the sprite's own range. Each bin must own at least 12% of opaque pixels; a sprite where one bin owns over 75% is flat. For scenes: the character's mean luminance must differ from the mean luminance of the background within its bounding box by at least 25% of full range.
Sources: https://www.patreon.com/posts/14359546 ; https://gamineai.com/blog/10-pixel-art-composition-rules-readability-in-game-2026 ; https://www.wayline.io/learn/pixel-art/2 ; https://bugnet.io/blog/readable-game-art-why-clarity-beats-detail

**16. Tiny clusters, noisy texture, no rest areas.**
What: every surface has a texture; no surface is a flat colour.
Why: "In pixel art a cluster is any group of touching pixels with the same color. Paying attention to clusters should be a primary focus, as they will dictate the overall look of your work." A plain middle tile that looked empty was defended by its artist as "a technique to show the space is solid". Painters call it resting space: "any area in your painting where the viewer's eye can pause ... Without it, your focal point competes instead of leads." Game design calls it signal-to-noise: "regions that require player attention should be rich in information, while less critical areas should contain minimal details."
Test: cluster size: compute connected same-colour components; the median cluster size in a sprite under 3 pixels is noise. Rest areas: tile a scene screenshot into 16x16 blocks and compute edge density (count of colour changes) per block. If the lowest-density quartile of blocks still has density above 40% of the highest, the scene has no rest. The ratio of the busiest block to the quietest block should be at least 4:1.
Sources: https://www.slynyrd.com/blog/2018/5/16/pixelblog-5-back-to-basics ; https://opengameart.org/content/2d-simple-grass-tileset ; https://www.milanartinstitute.com/blog/why-do-my-paintings-need-resting-space ; https://www.gamedeveloper.com/design/6-elements-of-visual-guidance

### Shape and composition tells

**17. No silhouette hierarchy; nothing reads as a black shape.**
What: enemies, props and the player are the same lumpy blob when filled black.
Why: "the strongest pixel art reads through silhouette first, using a distinctive shape the player can identify before color and detail register." Valve's TF2 team: "what class is your opponent? We did it through silhouettes." The "Three-Read Rule" tests "first silhouette at icon scale, then color blocking at squint distance, then optional detail".
Test: fill each sprite's alpha mask black, downsample to 8x8 (nearest neighbour), and compare every pair of sprites in the same class (all enemies, all props) by intersection-over-union. Any pair above 0.85 is indistinct. Separately, each sprite's 3x3 downsample must differ from a filled rectangle by at least 2 cells.
Sources: https://bugnet.io/blog/how-to-make-pixel-art-that-reads-clearly ; https://www.gamedeveloper.com/art/in-depth-how-valve-makes-art-to-enhance-gameplay ; https://gamineai.com/blog/10-pixel-art-composition-rules-readability-in-game-2026

**18. Same level of detail everywhere; no focal point.**
What: the background brick is drawn as carefully as the hero's face.
Why: the AI-detection guides' most repeated point: "Human artists apply detail deliberately. A portrait might have detailed eyes and looser brushwork on the clothing. AI distributes detail erratically." A hero prop "works as a compositional anchor"; "if you squint and can't identify the focal point, the composition fails." Level art has "hero props" that are "meant to be noticed and remembered" and "background props" that "fill space".
Test: per 16x16 block edge density (as test 16) over a screen; compute the Gini coefficient of block densities. A Gini under 0.25 means detail is spread evenly (no focal point); hand-composed screens should be above 0.4. Also: the block containing the declared focal asset must be in the top 10% of density.
Sources: https://nymynet.com/?p=2209 ; https://polycount.com/discussion/comment/2680888 ; https://beverlyboy.com/filmmaking/what-are-hero-vs-background-props/ ; https://itch.io/post/16286877

**19. Symmetry and identical repetition of motifs.**
What: a building mirrored down the middle; the same window pixel-for-pixel twelve times; the same decoration copied along a wall.
Why: "if a design feels unnaturally well-composed, with every element exactly where it 'should' be, consider AI authorship ... human designers vary repeated elements, while AI repeats them identically." Models "often mirror one half to finish the job". Octopath's fix for sparse-looking sprites was to increase "the density of tile variations and colors".
Test: mirror each building or prop sprite horizontally and compute pixel identity with the original; above 97% on a sprite wider than 24 px is a tell (small sprites are allowed to be symmetric). In a scene, hash every 16x16 block; if any single hash occupies more than 30% of a terrain region or appears more than 6 times in a row along one axis with no variant between, that is uniform tiling.
Sources: https://www.lovart.ai/es/blog/how-to-detect-ai-generated-content-design ; https://caniphish.com/blog/how-to-spot-ai-images ; https://www.siliconera.com/project-octopath-traveler-developers-answer-project-started-troubles-developing-hd-2d/

**20. Uniform autotiling with no variant tiles and no hand-placed hero assets.**
What: a Wang-tile or autotile map with exactly one tile per configuration, and nothing placed by hand.
Why: Red Blob's autotile notes recommend "multiple valid tiles for each configuration and weighted probabilities" to break repetition. "Pure noise is varied but emotionally flat, which is why a lot of procedural games feel samey." Motion Twin on Dead Cells: "relying too much on procedural generation leads to bland level design, often feeling messy and rather inconsistent"; they adopted Spelunky's model of hand-made chunks assembled at random ("Each level is divided into 16 squares, each of which are filled randomly with an architectural variant from a pool of about 50"). A tile kit for hand placement works procedurally only when "all of the ground to water edge tiles are made to work with every single other ground to water edge tile".
Test: for each autotile configuration in the tile data file, count the variants; fewer than 2 variants for the full "interior" tile and fewer than 2 for any edge is a tell. For each generated board, count hand-authored chunks or decals placed; zero is a fail. Measure the longest run of identical interior tiles along any row; over 5 is a tell.
Sources: https://www.redblobgames.com/articles/autotile/claude/ ; https://www.wayline.io/blog/procedural-generation-paradox ; https://www.dsogaming.com/?p=97323 ; https://www.killscreen.com/bring-magic-spelunky-3d-architecture/ ; https://perchdrunkthugz.itch.io/scootordie/devlog/110123/programmatic-tiling-in-world-generation ; https://www.moddb.com/games/gravity-ark/tutorials/gravity-arks-procedural-generation-using-chunks

**21. No ground contact: objects float.**
What: a sprite placed on a floor with no darker pixels under its base, so it hovers.
Why: small sprites live or die on a few pixels of grounding. Developers of 24x24 and 32x32 games found "more detail and shading does not always improve readability of small sprites", so the one or two pixels that do the job (the contact line) matter more. Wear-and-weathering writing makes the same point from the other side: believability is "the ability to justify the existence of details", and an object with no shadow and no contact has no justification for being there.
Test: for each placed object with a declared "stands on floor" flag, sample the row of floor pixels directly under its footprint. If their mean luminance is not at least 10% darker than the same floor tile's mean luminance elsewhere, the object has no contact shadow. Count floating objects per screen; any is a tell.
Sources: https://playniax.itch.io/pixel-hero/devlog/1332410/visual-direction-constraint-and-contrast ; https://itch.io/post/1365881 ; https://discover.therookies.co/2020/06/13/storytelling-in-props-and-environments/

**22. No wear, no story in objects.**
What: every crate, wall and car is factory-fresh and identical.
Why: "Wear patterns are evidence of use: a table with scratches in one direction implies something was dragged across it ... rust gathering at the bottom of metal objects points to water pooling there ... sun bleaching on one side of a building implies directional exposure." And the warning that matters for us: "overdoing procedural damage" is "the most common mistake". Scattered dirt "makes a scene feel fake".
Test: this one is half-measurable. Count decal and variant assets per base asset in the data file (zero is a tell). Count identical pixel-for-pixel instances of a prop in one screen (over 3 identical copies with no variant is a tell). The other half is a reviewer question on the contact sheet: "where is the one scratch that tells me who used this?"
Sources: https://www.strayspark.studio/blog/visual-storytelling-through-surface-wear-game-design ; https://www.strayspark.studio/blog/procedural-damage-game-assets-complete-workflow ; https://80.lv/articles/how-to-sculpt-surface-damage-and-wear-on-a-sci-fi-prop

### Line and outline tells

**23. Inconsistent outline rule.**
What: one sprite has a black outline, the next a dark-colour outline, the next none; or outline thickness changes between assets.
Why: the style-guide advice is "pick one approach and stick to it. The options are black outline, colored outline, or no outline." A commenter on mixels adds that "all the outlines of the pixel art should have the exact same thickness." Lospec on coloured outlines: "an outline must increase contrast with its background, never reduce it."
Test: for each sprite, extract the outer boundary pixels (opaque pixels with a transparent 4-neighbour) and classify: black (L under 10%), dark-of-local (L at least 20% below the adjacent interior colour), same-as-interior (no outline). All sprites in one asset class must share a classification. Outline thickness: the median distance from boundary to the first non-outline colour must be the same integer for every sprite.
Sources: https://www.sprite-ai.art/blog/2d-pixel-art-style-guide ; https://itch.io/post/8448610 ; https://lospec.com/articles/pixel-art-outlines-part-2-using-color ; https://lospec.com/articles/pixel-art-outlines

**24. Selective outlining applied without a rule, or outline darkness wrong.**
What: outlines go light on the shadow side and dark on the lit side, or vary at random.
Why: selective outlining ("selout") means "where the sprite is darkest, we'll use a dark color for the outline, and where it's lightest we'll use a lighter color", "maintaining the amount of contrast between the outline and the object all the way around". A Pixel Joint post argues outline darkness should "stay a consistent step darker than what it outlines, rather than using one dark outline everywhere". Either rule is fine; mixing them inside one sprite is the tell.
Test: along the boundary, compute the luminance difference between each outline pixel and the interior pixel it borders. The standard deviation of that difference, normalised by its mean, over 0.5 means the outline contrast is random.
Sources: https://itch.io/t/2422252/pixel-tutorial-selective-outlines ; https://pixeljoint.com/forum/forum_posts.asp?TID=10731

**25. Anti-aliasing applied by machine, everywhere, or on 0, 45 and 90 degree lines.**
What: every edge softened, including the ones that were already smooth.
Why: "anti-aliasing is unnecessary for straight lines at 0°, 45°, and 90°, since horizontal and vertical lines are already smooth". AA "has to be applied judiciously and by hand" and the in-between colours "should have similar perceived value to the colors they blend". Machine AA on everything is one of the four defects a tool developer lists for AI pixel art ("pixel size is uneven, it is off-grid, intermediate colors are mixed, and anti-aliasing is enabled").
Test: find intermediate colours (a colour that lies within 15% RGB distance of the midpoint between its two neighbours along an edge). Count how many sit on an axis-aligned or exact 45-degree edge; any is a tell. Count intermediate colours per sprite that are not in the palette ramp; any is a fail.
Sources: https://art.cleberg.net/post/blue3/Anti-Aliasing-Tutorial-213141706 ; https://pixelparmesan.com/anti-aliasing-fundamentals-for-pixel-artists ; https://wiki.wesnoth.org/How_to_anti-alias_sprite_art ; https://www.spritecook.ai/docs/color-options

### Readability and scale tells

**26. Does not read at 1x.**
What: the sprite only looks right at 4x zoom in the editor.
Why: "a sprite's native-size view is the sensible baseline for judging it"; dithering "becomes very noticeable beyond 1x zoom". The style-guide practice is to "zoom screenshots out to thumbnail size and confirm the art still reads".
Test: render the sprite at 1x into a 3x3 and an 8x8 downsample (area average, then threshold). The 8x8 must preserve the sprite's declared key feature (head, weapon, wheels) as at least one distinct cell from the body mass. Reviewer form: the contact sheet is viewed at 1x first, zoom second.
Sources: https://pixeljoint.com/forum/forum_posts.asp?TID=26951 ; https://bugnet.io/blog/how-to-write-an-art-style-guide

**27. Character and background in the same tonal range.**
What: the player disappears into the wall.
Why: "a detailed background painted in the same mid-tones as the actors swallows them. Grayscale screenshots are the cheap audit." Dead Cells' artists chose saturated backgrounds and characters precisely to keep "the attention of the eye to any new element appearing on the screen".
Test: on a greyscale screenshot, the mean luminance of the player sprite and the mean of the 8-pixel ring around it must differ by at least 20% of full range; the same for any enemy.
Sources: https://bugnet.io/blog/readable-game-art-why-clarity-beats-detail ; https://gonintendo.com/archives/280488-dead-cells-dev-blog-art-design-deep-dive-giving-back-colors-to-cryptic-worlds

### UI tells (the "AI UI" look)

**28. Purple-to-blue gradients, glassmorphism, neon glow, gradient text.**
What: the default look every code model produces when nobody specifies a look.
Why: a documented catalogue groups "purple gradients, glassmorphism, neon glow" as tells, plus "frosted glass cards floating in voids of soft pastel" and "gradient text, which is decorative rather than meaningful". The purple traces to a training-data default ("every button in Tailwind UI use bg-indigo-500"). The catalogue's own warning: the tells move; "simply removing a tell doesn't fix the problem, since the next 'safe' default becomes the new tell."
Test: scan the UI stylesheet and canvas code for linear-gradient or radial-gradient on panels and text, backdrop-filter blur, box-shadow with a coloured glow, and hues between 250 and 290 degrees in panel backgrounds. Any of these on a game UI that claims to be pixel art is a fail.
Sources: https://www.impeccable.style/slop ; https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website ; https://github.com/Laith0003/ux-skill/wiki/How-to-detect-AI-slop-in-your-design ; https://docs.bswen.com/blog/2026-03-20-ai-generated-ui-anti-patterns/

**29. Default fonts (Inter, Arial, system sans) and rounded cards in a three-card grid.**
What: a pixel game whose menus are set in the browser's default sans with 8-pixel border radii.
Why: Inter is called "the Comic Sans of AI" because it "signals no typographic thought"; the "three-card grids" and "John Doe / Acme" placeholders are the same reflex. Players notice: one developer admitted "using Arial wasnt the best choice for the UI". The pragmatic rule is "two or three fonts, with one heavier font for titles and one readable font for body text".
Test: grep the UI code for font-family; any of Inter, Arial, Helvetica, Roboto, system-ui, sans-serif as the resolved font on a game screen is a fail. Count border-radius declarations over 2 px on game panels; any is a tell. Count sibling cards with identical size in a row; three or more identical cards is a tell.
Sources: https://github.com/Laith0003/ux-skill/wiki/How-to-detect-AI-slop-in-your-design ; https://www.impeccable.style/slop ; https://itch.io/t/6723491/arial-font ; https://beamable.com/blog/game-dev-mistakes-that-you-should-avoid-at-all-costs

**30. Text and UI drawn at a different pixel size than the game.**
What: crisp 1-screen-pixel UI text over 3x-scaled game pixels, or vice versa.
Why: a common mistake list names "inconsistent pixel density or scaling" and recommends "consistent pixel density across characters, environments, and UI". Paolo's own rulings (ONE GAME MODE, same HUD at every zoom) demand the same.
Test: run test 1's native-pixel-size detector on the HUD region and the play region separately; they must match, or the HUD must be a declared exception at an integer multiple.
Sources: https://www.wayline.io/blog/the-8-bit-resurrection-why-pixels-still-reign-supreme ; https://www.wayline.io/learn/pixel-art/1

### The tells that are about intent, not pixels

**31. Hands, text and small repeated details garbled.**
What: six fingers, gibberish signage, the same face twice in a crowd.
Why: "AI frequently produces gibberish or distorted text in images, which can be a giveaway." The sources add that these "classic tells" are "weakening" as tools improve, so they are a sign, not a proof.
Test: OCR every in-world sign; any non-dictionary, non-Spanglish string that is not in the words data file fails. For faces: hash each portrait; duplicates across different IDs fail (ONE ID, ONE WHOLE PERSON already demands this).
Sources: https://caniphish.com/blog/how-to-spot-ai-images ; https://nymynet.com/?p=2209 ; https://imagera.ai/blog/ai-art-detector-how-to-tell-2026

**32. Inconsistency across assets (mixed packs, mixed styles).**
What: the character looks like one game, the tiles like another, the UI like a third.
Why: "players read coherence as quality and incoherence as amateurism, so a unified visual language can matter more than how good any single asset is." "Mixing unrelated asset packs ... can severely impact a game's visual cohesion ... the problem isn't the asset packs themselves; it's the lack of a clear artistic vision." Steam Next Fest commentary groups "obviously fake pixel art" with "the same generic anime girl" as the sign of a game nobody directed.
Test: this is the sum of tests 1, 4, 5, 9, 23 and 30 run across the whole asset set, reported as one coherence score: the share of assets passing all six. Under 90% and the game reads as assembled.
Sources: https://bugnet.io/blog/art-direction-beats-art-budget ; https://www.wayline.io/blog/5-strategies-consistent-indie-game-art-style ; https://aftermath.site/steam-next-fest-demos-ai-disclosure-algorithm.md

**A caution on false positives.** A human artist's work was judged as AI on r/PixelArt "because its pixels weren't perfectly aligned", and snapping tools now exist that put AI output on a clean grid. So a clean grid proves nothing by itself, and a dirty grid condemns nothing by itself. The tells above work as a set, not one at a time. Studies of AI-art detectors put them at "about 70 to 80% accuracy", and that is for detectors trained on the task.
Sources: https://redlib.ssps.io/r/PixelArt/comments/1k26vck/i_dont_use_ai/mnryvwo/?context=3 ; https://www.gigazine.net/gsc_news/en/20260516-spritefusion-pixel-snapper ; https://imagera.ai/blog/ai-art-detector-how-to-tell-2026 ; https://creativebloq.com/ai/ai-slop-has-become-a-harmful-insult-hurled-around-with-no-evidence-game-developers-claim

---

## SECTION B: WHAT THE MASTERS DO

**B1. They decide the constraints first, then draw inside them.**
Lospec's whole premise is "digitally restrictive art": a restricted palette and a restricted resolution, chosen before the first pixel. Beginners are told to borrow a proven palette rather than invent one, and "most people recommend going for 4 to 5 colors per palette" as a starting discipline. Saint11's beginner guide works inside a limited palette and, when a hue is missing, says to "use the nearest available hue", not to add one.
Sources: https://boingboing.net/2019/10/01/lospec-a-resource-site-for.html ; https://community.aseprite.org/t/how-do-i-make-cohesive-color-palettes-on-aseprite/7983 ; https://saint11.art/pixel_art_articles/article1/

**B2. They think in clusters, not pixels.**
Slynyrd (Raymond Schlitter): "In pixel art a cluster is any group of touching pixels with the same color. Paying attention to clusters should be a primary focus, as they will dictate the overall look of your work", with "angular clusters giving a sharp style and irregular organic ones a natural feel". Pixel Joint's tutorial: "Pixel art is clearest to read when it relies on clusters of colour to convey information." The Patreon pixel guide: start "with the shapes (rough sprite) instead of starting with the lines", because that produces more readable sprites.
Sources: https://www.slynyrd.com/blog/2018/5/16/pixelblog-5-back-to-basics ; https://pixeljoint.com/forum/forum_posts.asp?TID=11299 ; https://www.patreon.com/posts/14359546

**B3. They hue-shift and desaturate on purpose.**
Saint11's colour article: the plain ramp "looks a little dull and muddy"; the fix is "the shadow a little more blue and less saturated (colder) and the light warmer", with the caveat that this is "not a stone-written-rule". Slynyrd builds palettes with a vivid ramp and a desaturated copy "as grays in combination with the vibrant colors". Pixel Logic (Michael Azzi) devotes a whole chapter to Colours and another to Readability, out of nine.
Sources: https://saint11.art/pixel_art_articles/article6/ ; https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes ; https://michafrar.gumroad.com/l/pixel-logic ; https://80.lv/articles/pixel-logic-a-pixel-art-tutorial-book/

**B4. They anti-alias and dither by hand, rarely, and never on straight lines.**
AA "has to be applied judiciously and by hand"; "anti-aliasing is how you make anything that is not a vertical or horizontal edge look good", used "on things like staves, or swords, when they hang at a slight angle"; skip it at 0, 45 and 90 degrees. Dither "only where two shades meet, with a more solid swath of a single shade between the borders". The Pixel Logic chapter list (Line art, Anti-aliasing, Colours, Readability, Dithering, Game perspectives, Clean-up, Subpixeling, Animation) is itself the order of operations a professional follows, with Clean-up as a named step.
Sources: https://pixelparmesan.com/anti-aliasing-fundamentals-for-pixel-artists ; https://wiki.wesnoth.org/How_to_anti-alias_sprite_art ; https://www.gamedev.net/topic/629704-dithering-help-in-for-my-pixel-art ; https://michafrar.gumroad.com/l/pixel-logic

**B5. They pick one light and write it down.**
"Keep the light direction consistent within a single work (or game scene)"; the direction "can be anywhere, so long as it stays static". The LPC style guide is pointed to for "perspective and light source" exactly because a shared guide is how 30 contributors agree. Public art bibles "tend to include a tie-breaker rule for ambiguous cases, a specific light direction, and a named list of common mistakes".
Sources: https://pixnote.net/en/learn/shading ; https://lpc.opengameart.org/user/18016/comments?page=2 ; https://blog.makko.ai/what-public-game-art-bibles-say/ ; https://www.slynyrd.com/blog/2018/6/15/pixelblog-6-light-and-shadow

**B6. They test readability at 1x, in the game, against the background.**
Blasphemous's production notes: sprites "are tested in real game scenes to confirm they match the style and stand out from the background" before animation starts, and the order is "standing pose, then pixelate, then palette, then animate". Dead Cells chose saturated palettes for "keeping the player awake and alert, drawing the attention of the eye to any new element". The 1x view is "the sensible baseline for judging" a sprite.
Sources: https://blasphemous.backerkit.com/hosted_preorders/project_updates?page=7 ; https://gonintendo.com/archives/280488-dead-cells-dev-blog-art-design-deep-dive-giving-back-colors-to-cryptic-worlds ; https://pixeljoint.com/forum/forum_posts.asp?TID=26951

**B7. When they use a pipeline, they hand-finish it.**
Dead Cells: Thomas Vasseur built characters in 3DS Max, exported FBX, and "a custom in-house tool, never publicly released, batch-converted the 3D animations into pixel art", but "most animations are 3D prerendered with a pixel art shader, but some, more simple, are hand made", and the original model sheet was itself drawn "in a 2D pixel style". Backgrounds are "pixel art redrawn as normal maps". The procedural-pixel-art write-ups say the same from the other side: after generating a texture, "the next step ... is to actually go in and give more context by hand", and a procedural tilemap derives shadow colours "based on the material below" rather than from black.
Sources: https://wnhub.io/news/art/item-13775 ; https://steamcommunity.com/app/588650/discussions/0/2741975115060630076 ; https://80.lv/articles/case-study-dead-cells-character-art-pipeline/ ; https://80.lv/articles/interview-with-the-developers-of-dead-cells ; https://skybase.wordpress.com/2012/10/10/ideas-and-tricks-procedural-pixel-art-textures/ ; https://dev.to/jhmciberman/procedural-pixel-art-tilemaps-57e2

**B8. They add variation on purpose and in measured doses.**
Octopath Traveler: sprites "looked lonely and simple in the context of a larger screen", so the team "increased the density of tile variations and colors to create an altogether richer view", after an earlier pass "went too far on the resolution and saturation". Red Blob's autotile guidance: "multiple valid tiles for each configuration and weighted probabilities". A procedural-pixel-art developer's fix for the grid look: "making tiles neighbor-aware so repeated ground blocks don't look like a grid".
Sources: https://www.siliconera.com/project-octopath-traveler-developers-answer-project-started-troubles-developing-hd-2d/ ; https://www.redblobgames.com/articles/autotile/claude/ ; https://daily.dev/posts/my-ai-never-draws-a-pixel-5-tricks-that-made-procedural-pixel-art-stop-looking-generated-klnefoflr

**B9. They assemble hand-made pieces, not raw noise.**
Spelunky: "Each level is divided into 16 squares, each of which are filled randomly with an architectural variant from a pool of about 50. Once done, its systems then make another pass over each square." Motion Twin "basically adopted the same approach for Dead Cells" because pure procgen "leads to bland level design". Indies describe "a bunch of hand made rooms randomly arranged into a grid". The general pattern: "generated geography with handcrafted landmarks".
Sources: https://www.killscreen.com/bring-magic-spelunky-3d-architecture/ ; https://www.dsogaming.com/?p=97323 ; https://itch.io/post/8281990 ; https://www.wayline.io/blog/handcrafted-vs-procedural-terrain-art-world-building

**B10. They redo the art until it is one thing.**
Stardew Valley's developer said he "had redone nearly all the art several times" over the development. Eastward's team is described as "making (then remaking)" the game. Octopath iterated on depth, saturation and water. Pedro Medeiros (Celeste) describes building "from scratch a different art style for each game he works on", and he published weekly "animated boards" of pixel-art tips while the game was in development, a practice of teaching the rules so the team can keep them. The pattern is the same everywhere: the first pass is never the shipped look.
Sources: https://nintendoeverything.com/stardew-valley-was-originally-called-sprout-valley-plus-other-development-changes/ ; https://www.nintendo.com/us/whatsnew/how-the-developers-began-making-then-remaking-eastward ; https://www.awn.com/tag/final-aip-now ; https://itch.io/jam/heartjam/topic/208072/pixel-art-tips-by-celestes-designer ; https://creativebloq.com/news/artist-makes-animated-gif-tutorials-to-teach-you-pixel-art

**B11. They distinguish "pixel art" from "retro" and own the look.**
Alx Preston on Hyper Light Drifter: "there is a difference between retro and pixel art", the game is "intentionally not retro", "more illustrative", made at "480x270 pixel format, which is then scaled up to your native screen resolution" (one native size, scaled by integers). The lesson for us is that a modern pixel look is a set of chosen rules, not a hardware imitation, and the single native resolution is still sacred.
Sources: https://gamingbolt.com/hyper-light-drifter-interview-everything-you-need-to-know-about-heart-machines-2d-action-rpg ; https://unwinnable.com/2015/12/02/interview-with-alex-preston-the-creator-of-hyper-light-drifter/ ; https://hld-rpg.backerkit.com/hosted_preorders/project_updates?page=6

**B12. Consistency beats quality, and constraint beats budget.**
"Players read coherence as quality and incoherence as amateurism." "The most memorable indie art styles are usually the most constrained, not the most expensive." The GDC art-direction talks that exist (EA DICE's "Building a Visual Identity", Playraven's "Building a Visual Threshold") are about pillars and thresholds, meaning a short list of rules everything must pass, not about drawing better. The two GDC pixel-art sessions that exist are skill sessions (Kyle Bunk, Firaxis, 2018, hi-res pixel art and motion; Tyriq Plummer, 2020, "techniques and best practices for approaching pixel art and animation for contemporary games").
Sources: https://bugnet.io/blog/art-direction-beats-art-budget ; https://www.wayline.io/blog/art-style-consistency-games-beginner-pro ; https://gdcvault.com/play/1028954/Art-Direction-Summit-Building-a ; https://www.gdcvault.com/play/1023159/Art-Direction-Bootcamp-Building-a ; https://www.gamedeveloper.com/art/video-a-guide-to-creating-high-resolution-pixel-art-and-animation ; https://gdcvault.com/play/1026805/Skill-Building-Series-Pixel-Art

**B13. How studios run art QA.**
From the sources found: a checklist "built with production leads and art directors that covers each artist step"; inspection of source files, not just screenshots; assets "integrated into live development builds" so they are judged "under real-time game conditions"; an Art QA lead whose job is "to ensure visual targets are met". The pixel-specific practices: the do/don't page ("near-miss examples with annotated differences teach boundaries well"), the thumbnail check ("zoom screenshots out to thumbnail size and confirm the art still reads"), the greyscale check, and the in-scene test before animation (Blasphemous). No source found describes a formal "contact sheet" ritual for pixel games; it is implied by every "view it at 1x next to the others" instruction, and we should write ours down (Section C, field 14).
Sources: https://supergeniusstudio.com/a-qa-case-study-marvels-deadpool-vr/ ; https://hitmarker.net/jobs/criterion-games-art-qa-lead-808789 ; https://bugnet.io/blog/how-to-write-an-art-style-guide ; https://blasphemous.backerkit.com/hosted_preorders/project_updates?page=7

---

## SECTION C: THE STYLE GUIDE A STUDIO WRITES

What a pixel-art style guide actually contains, assembled from the sources (bugnet's six-part structure: "resolution, palette, outline rules, shading style, animation timing, and proportions"; the MIT GDG guide; the art-bible threads; the LPC guide's "front-facing overhead orthographic view with 32x32 tiles"; the public-bible analysis's "tie-breaker rule ... a specific light direction, and a named list of common mistakes"). The stated goal of the document: "a new contributor can produce a passable asset without asking questions whose answers exist only in your head." Example values are illustrative; Bohemia's real numbers go in the TUNING table and the data files, and each field is a gate.

| # | Field | What it fixes | Example value (illustrative) |
|---|---|---|---|
| 1 | Visual identity statement | one sentence everything is judged against | "Economic-apocalypse Las Vegas in analog horror; hand-made, loud, crude on purpose; nothing glossy." |
| 2 | Native resolution and pixel size | tells 1, 2, 3, 30 | Internal canvas 480x270; 1 art pixel = 1 canvas pixel; display scale integer only (2x, 3x, 4x); no sub-pixel positions. |
| 3 | Camera and perspective | agreement of all assets | 45-degree three-quarter top-down; horizon never drawn; vertical surfaces at 2:1 height to depth. |
| 4 | Master palette | tells 4, 5, 6, 7 | One file, 48 colours, hex values with roles (ground, wall, skin, cloth, metal, neon, UI). Every ramp 4 or 5 steps; hue shifts at least 10 degrees cool into shadow; at least 8 greys. |
| 5 | Colour budget per asset class | tell 4 | Character 32x48: max 12 colours. Prop under 32 px: max 6. Tile 16x16: max 5. Portrait: max 24. Boss: max 20. |
| 6 | Light direction | tells 9, 10 | Key light top-left, 45 degrees elevation, every asset; fight tiles share it; the only exception is a lit neon prop, which casts in its own colour. |
| 7 | Shading steps | tells 6, 10, 11, 15 | Three values minimum (dark, mid, light), one optional highlight; shadows are ramp steps, never black; no pillow; banding forbidden except deliberate stripes. |
| 8 | Outline rule | tells 23, 24 | Characters and enemies: 1-pixel outline, darkest ramp colour of the local material (selout). Tiles: no outline. Props: outline on the silhouette only, none inside. UI: 1-pixel black. |
| 9 | Anti-aliasing and dithering rules | tells 14, 25 | AA by hand only on diagonals shallower than 45 degrees, using existing ramp colours; dithering only for rust, static and CRT noise, never for a gradient. |
| 10 | Proportions and silhouette | tell 17 | Human 32 px tall, 6 px head, 10 px torso, 16 px legs; every enemy class owns one silhouette feature (horns, a pack, a long gun) visible in an 8x8 downsample. |
| 11 | Detail budget per asset class | tells 16, 18 | Hero (player, boss, mini-boss, the house on screen): full detail, up to 40% of pixels in clusters under 4 px. Mid (named NPC, hero prop): 25%. Background (tiles, filler props): 10%, and each must contain one flat rest region of at least 25% of its area. |
| 12 | Variation rules | tells 19, 20, 22 | Every base tile ships with 2 variants weighted 70/20/10; every prop ships with 2 wear decals; no run of more than 4 identical tiles; buildings asymmetric by at least one window or door. |
| 13 | Ground contact | tell 21 | Every standing object has a 1-pixel contact line one ramp step darker than the floor along its full footprint; taller objects a 2-pixel cast toward bottom-right. |
| 14 | UI rules | tells 28, 29, 30 | Pixel font from the project (named file), 1 pixel per unit, no gradients, no blur, no glow, radius 0 or 1 px, no Inter/Arial/system fonts, the same HUD at every zoom. |
| 15 | Animation timing | movement feel | 120 BPM; 12 keys a bar; a joint never reverses more than 120 degrees between two drawn keys. |
| 16 | Do and don't page | all | Side by side pairs: a correct sprite and its near miss, with the one difference circled. At least one pair per field 4 to 14. |
| 17 | Named common mistakes | all | Pillow, banding, jaggies, orphans, doubles, straight darkening, mixels, over-dither, floating, gradient panel, Inter. |
| 18 | Tie-breaker | when two rules fight | "Readability at 1x wins over everything; palette wins over detail; silhouette wins over colour." |
| 19 | Review procedure | B13 | Contact sheet at 1x on a flat grey, then on the real background, then greyscale, then the 8x8 silhouette row, then in the game; the gate report attached. |
| 20 | Reference board and anti-reference | identity | What it should look like (the analog-horror bible, the Newgrounds era, the runway names) and what it must never look like (the three card grid, the purple panel, the default pack). |

Sources for the structure: https://bugnet.io/blog/how-to-write-an-art-style-guide ; https://gdg.mit.edu/style-guide ; https://www.sprite-ai.art/blog/2d-pixel-art-style-guide ; https://gamedev.net/forums/topic/552212-creating-art-biblestyle-guide/4955332/ ; https://gamedev.net/forums/topic/644435-what-is-an-art-bible-and-any-tips-to-make-one-better/ ; https://blog.makko.ai/what-public-game-art-bibles-say/ ; https://lpc.opengameart.org/ ; https://github.com/stefanbeller/lpc ; https://dustycloud.org/tmp/lpc_blogpost/liberated_pixel_cup.html

---

## SECTION D: TEN THINGS A GATE COULD CHECK TODAY

Ranked by how much of the "AI look" each one explains, weighted by how cheaply a script can measure it on our PNGs and screenshots. Each is a pure image or data-file test; none needs a model.

1. **One native pixel size per scene (tells 1, 2, 30).** Run-length histogram per sprite and per screen region; one integer size, integer placement, HUD matching. This is the tell every AI-pixel-art write-up puts first and it is the one most likely to be true of us, because the walk's 112 px assets, the map's tiles and the fight board were drawn at different sizes by different chats.
2. **Palette lock and colour count (tells 4, 5).** Every pixel in the master palette; per-class colour caps (12 / 6 / 5 / 24). Cheapest test on the list and it alone kills the "uncannily smooth" read.
3. **One light direction (tell 9).** Highlight-centroid minus shadow-centroid angle per sprite; all within 30 degrees of the declared light. The largest single reason a scene of good sprites still looks assembled.
4. **Hue shift in ramps (tell 6).** For every ramp of 3 or more steps, hue delta dark to light at least 8 degrees, saturation not rising into shadow. Straight darkening is the signature of generated shading and of a shade() function in code.
5. **Detail distribution: rest areas and a focal point (tells 16, 18).** Edge density per 16x16 block; Gini over 0.4; quietest quartile under 40% of the busiest; the declared hero block in the top 10%. This is the test for "same level of detail everywhere", the thing humans name first when they say "AI".
6. **Silhouette separation (tell 17).** 8x8 black-mask IoU between every pair of sprites in a class under 0.85; 3x3 mask not a rectangle. Readability at 1x in one number.
7. **Three-value read and figure-ground contrast (tells 15, 27).** Three luminance bins each owning at least 12% of a sprite; character vs ring luminance gap at least 20%. The greyscale audit the masters run by eye, made numeric.
8. **Clean lines: jaggies, orphans, doubles, banding, pillow (tells 10, 11, 12, 13).** Step-length monotonicity, size-1 components, 2x2 outline blocks, aligned stacks, distance-to-edge correlation. Five classic craft defects, all cheap on an outline mask, and the ones a pixel artist sees in the first second.
9. **Repetition and variation (tells 19, 20, 22).** Block hashing on screenshots (no run over 4 identical interior tiles; no hash over 30% of a region); data-file counts (2 variants per base tile, 2 decals per prop, at least one hand-authored chunk per board); horizontal mirror identity under 97% for buildings. This is the "samey" test for the seeded fight boards.
10. **UI defaults (tells 28, 29).** Grep for gradients, blur, glow, radius over 2, hue 250 to 290 on panels, and any of Inter, Arial, Helvetica, Roboto, system-ui, sans-serif resolving on a game screen. Trivial to check and the single loudest "made by an AI guy" signal on a phone.

Two things a gate cannot check and a reviewer must: whether the one scratch on the crate tells a story (tell 22), and whether anything on the screen was a decision rather than a default. The gates buy back the reviewer's time for exactly those two questions.

---

## WHAT THIS MEANS FOR BOHEMIA (one paragraph, for the coordinator)

The complaint is correct and it is measurable. Our chats draw with no shared pixel size, no shared palette file, no declared light, shading by darkening, texture everywhere, autotiles with no variants, and a HUD that inherits browser defaults. Each of those has a number above and a source. The order of work is the order of Section D: a style guide with the twenty fields of Section C filled with real numbers (DIRECTION owns it, TUNING holds the numbers), then PLUMBER turns D1 to D10 into gates in the suite, then every cook from now on hand-finishes the hero assets and the gate reports ride on the contact sheet. The reference check gate already compares art to the world; these ten checks compare art to itself, which is the half that was missing.

Sources index (all URLs cited above, grouped): tutorials: pixeljoint.com (TID 11299, 13060, 21119, 26951, 10731), slynyrd.com (pixelblog 1, 2, 5, 6), saint11.art (tutorial index, articles 1 and 6), michafrar.gumroad.com/l/pixel-logic, lospec.com (outlines parts 1 and 2, hueshifting tag), pixelparmesan.com, wiki.wesnoth.org, pixnote.net, wayline.io lessons, repository.tudelft.nl (2025 thesis on pixel art). AI tells: impeccable.style/slop, prg.sh, github.com/Laith0003/ux-skill, docs.bswen.com, rangy.ai, dev.to/jenissimo, runware.ai, discover.oreateai.com, spritecook.ai, nymynet.com, lovart.ai, caniphish.com, imagera.ai, arxiv.org/pdf/2304.06470, aftermath.site, creativebloq.com. Studios: 80.lv (Dead Cells x2, Pixel Logic), gonintendo.com (Dead Cells colours), wnhub.io, siliconera.com (Octopath), unrealengine.com, blasphemous.backerkit.com, pczone.co.uk, nintendoeverything.com (Stardew), nintendo.com and gamedeveloper.com (Eastward), gamingbolt.com and unwinnable.com and vice.com (Hyper Light Drifter), awn.com and itch.io heartjam (Celeste), store.3dtotal.com (Sea of Stars), gdcvault.com (1028954, 1023159, 1026805), gamedeveloper.com (Bunk 2018, Valve TF2, 6 elements of visual guidance). Procedural: redblobgames.com, killscreen.com, dsogaming.com, moddb.com, daily.dev, dev.to/jhmciberman, skybase.wordpress.com, perchdrunkthugz.itch.io. Style guides: bugnet.io, gdg.mit.edu, sprite-ai.art, gamedev.net threads, blog.makko.ai, lpc.opengameart.org, github.com/stefanbeller/lpc.
