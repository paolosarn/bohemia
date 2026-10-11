# UNLOCK THE LIMITS 07: HOW THE GOOD ONES GOT THEIR ART (10/11/26)

Research record. Question from Paolo: the agents' art "feels coded by a seventh grader"; how do people who vibe-code games actually get GOOD art, with one-time purchases or free tools only?

Method note: the container blocked every page fetch, so every fact below rests on search-result text, not the full article. Quotes are the short phrases the search returned. Games are named ONLY as case studies of how their art was made; none is a reference game for Bohemia's design.

## 1. THE FINDING

Nobody who shipped good-looking art let the code agent draw the pixels. The good ones put one human taste gate in front of every asset and locked the palette and the grid so the machine could not drift. The cheapest winning move was buying one small, high-quality pack and treating it as the style bible everything else must match. The next cheapest was one rough 3D blockout per character so every angle came from the same shape. AI art with no human gate got called slop, and in one case the developer pulled the whole game.

## 2. THE CASES

**A. The Great Taxi Assignment (Vibe Jam 2025 gold, $10,000).** One person, Tomas Bencko, 60 hours. The game page credits "99% of code was AI generated (Cursor AI + Claude Sonnet 3.7)", "2D art was created using GPT-4o", music from Suno, sound from ElevenLabs. The jam rule REQUIRED at least 80% of code and assets to be AI-made. Lesson: an "AI must make it" jam rewards a tiny asset count and a neon look that hides seams; it is not proof AI art holds up over 100 hours. Source: https://great-taxi-assignment.netlify.app/

**B. biendodo, "Building a Pixel-Art Pipeline with Blender and AI" (itch.io devlog, 2026).** One person. Dropped a sprite-stacking plugin because hand-drawn views never matched. Now: hand sketch, one rough 3D model per character so every angle comes from the same geometry, AI renders angles and colour, "lighting picks from my palette instead of mixing new colors", walk cycles snapped to the pixel grid, finish in Aseprite. It "only works because every step is locked down so the AI can't drift." Cost: Blender and Godot free, Aseprite about $20. Lesson: the palette lock and the grid snap ARE the pipeline; the AI is a renderer inside a cage. Source: https://biendodo.itch.io/pixel-art-pipeline/devlog/1682633/prologue-i-sketch-ai-builds-the-sprite

**C. Second Burn Games, Rescue Battalion devlog #1 (itch.io, 2026).** Small team, first pixel art. Blender to block out shapes, Aseprite to refine; "the 3D model acts as a blueprint for keeping perspective consistent." Too much light "creates harsh shadows that break the pixel art aesthetic." Cost: free tools plus Aseprite. Lesson: one camera, one light rig, every sprite born from the same blockout. Source: https://secondburngames.itch.io/rescue-batallion/devlog/1471883/devlog-1-trying-pixel-art-for-the-first-time

**D. DevCody, "How I Cut My Solo Game Dev Time in Half in 2026."** One person. Free packs made the game "look exactly like 10,000 other indie games." Fix: "I bought a small, high-quality pack of pixel art that I loved", trained a custom model on about 20 of its images only, then generated props that matched. Cost: one pack plus a Scenario plan (a subscription; Bohemia does the same step with a local tool, section 5). Lesson: buy the style once, then extend it; never generate a style from nothing. Source: https://devcody.com/solo-game-dev-tools-stack-2026-0024/

**E. Bass Monkey postmortem (Game Developer).** One person, 18 months, day job. Hand-pixelled every asset in Aseprite. In the author's follow-up: "after hand-pixelling everything in Bass Monkey myself, buying assets was a humongous time-saver"; buy assets "if you're not an artist first and foremost." Cost: Aseprite, time. Lesson: the person who learned to draw still says buy the base and spend the hours on what is unique. Source: https://www.gamedeveloper.com/game-platforms/bass-monkey-postmortem-from-zero-experience-to-solo-game-dev-in-18-months-without-quitting-your-day-job-

**F. Hardest (Rakuel / Eero Laine), the failure case.** One person, free card roguelike, "card illustrations were created using AI image generation", no paint-over. One outlet said the art "didn't seem to do Hardest any favors"; a search summary cited reviews calling it "soulless" (unconfirmed). He delisted the game on January 30, 2026 rather than redraw it. Cost: nothing up front, the whole game at the end. Lesson: raw generator output with no taste gate is what players mean by slop. Source: https://www.gamespot.com/articles/dev-plans-to-voluntarily-delete-ai-generated-game/1100-6537342/

**G. Shrine's Legacy (Positive Concept Games), the false-positive case.** Small team, pixel RPG, October 2025. Review-bombed as "AI slop" although the studio "only worked with real human artists on everything"; they posted process pictures and the rating recovered. Lesson: the market judges by LOOK, not method. Generic or inconsistent art gets the AI label even when a human drew it. Source: https://www.pcgamer.com/games/rpg/rpg-dev-pushes-back-against-steam-review-ai-accusations-we-poured-years-of-our-lives-into-this-game-and-only-worked-with-real-human-artists-on-everything/

**H. Void Rift (itch.io, September 2026), the cost benchmark.** One person, "built almost entirely with Claude Code": 7 months, about 790 hours, about $900 on a Claude plan, "zero art skills" (art method past the snippet cut). Lesson: the code is cheap and known; the art is what nobody here got for free. Source: https://voidrifter84.itch.io/void-rift/devlog/1687578/zero-art-skills-zero-audio-skills-a-day-job-and-kids-my-claude-code-gamedev-retrospective

## 3. THE PATTERN

Every good one had all five. The bad one (F) had none.

1. ONE HUMAN TASTE GATE. A person looked at every asset before it entered the game and threw out what did not match. Not a script, a pair of eyes.
2. A LOCKED PALETTE. One colour list; the generator or renderer may not invent a colour (B, C, D).
3. ONE SOURCE OF SHAPE. A bought pack set the proportions (D, E) or one 3D blockout per character did (B, C). Every angle and variant descended from it.
4. ONE CAMERA AND ONE LIGHT. Soft light, fixed angle, grid-snapped output (B, C).
5. A SMALL ASSET COUNT DONE WELL. The jam winner (A) and the solo shipper (E) both cut the roster until each piece could be checked by hand.

The bad one: the generator was the artist, every image a fresh roll, nothing forcing two assets to agree.

## 4. THE MARKET, IN PLAIN WORDS

Steam rewrote its AI rule in January 2026: you must disclose AI that made anything players see or hear (shipped art, music, text, the store page); tools used only to write code need no note. The label is public on the store page.

How much is out there: Totally Human Media counted 7,818 disclosing titles by July 2025, about 1 in 5 of that year's releases, later 10,258; 60% are for visuals. They grossed an estimated $660 million, so disclosed games do sell.

What the label costs: Game Oracle (June 2026, about 9,900 games) found disclosing games averaged 4 reviews in month one against 7; controlling for publisher and experience, about 53% fewer reviews, and a lower score (84.6% vs 88.3%). Reviews stand in for sales, and the study cannot separate "the tag hurt" from "low-effort games carry the tag." Epic's Tim Sweeney called the label a "Scarlet Letter".

Plain version: code with AI, nobody cares. Ship AI pixels players can see and expect the label, about half the attention, and a harder crowd. Ship hand-checked pixels and the label does not apply.

## 5. WHAT THIS PROJECT SHOULD COPY, AND WHAT IT SHOULD NOT

COPY:
- Buy ONE small, high-quality pixel pack in the right camera and make it the style bible (D, E). One-time purchase. Every Bohemia asset sits next to a piece of it and must not look like a stranger; the COMPARE EVERY PIECE OF ART law gets a bought yardstick.
- One rough 3D blockout per body type and per house, rendered from the one game camera with one soft light, then pixel-finished (B, C). Blender is free.
- A palette file the cooks cannot step outside; lighting picks from it, never mixes (B).
- Local, one-time or free generators only, as renderers inside that cage, never as designers: Retro Diffusion's Aseprite extension, one-time $65 (Lite $20), local, no credits; Spriteloom, open source, name-your-price, NVIDIA card with 8 to 12 GB; PixelAI, name-your-price; Aseprite $19.99. All fit the no-subscription, no-credits rule.
- Cut the asset count until one human can look at every piece (A, E). DIRECTION is that human.

DO NOT:
- Let the code agent write pixels in a draw routine. No case above did it; that is the "seventh grader" look.
- Generate from a text prompt with no source shape and no palette (F).
- Use Scenario or any web credit generator (subscription and per-call credits).
- Ship generator output into anything the player sees without a paint-over: the label and the 53% hit apply, and it gets called slop whatever the method.

## 6. ONE RULE

NO PIXEL ENTERS THE GAME UNLESS IT DESCENDS FROM THE BOUGHT STYLE BIBLE OR THE ONE BLOCKOUT, USES ONLY THE LOCKED PALETTE, AND ONE HUMAN LOOKED AT IT NEXT TO THE BIBLE FIRST.

## 7. SOURCES

- https://great-taxi-assignment.netlify.app/
- https://levels.io/winners-of-the-2025-vibe-code-game-jam
- https://vibejam.com/2025/
- https://biendodo.itch.io/pixel-art-pipeline/devlog/1682633/prologue-i-sketch-ai-builds-the-sprite
- https://secondburngames.itch.io/rescue-batallion/devlog/1471883/devlog-1-trying-pixel-art-for-the-first-time
- https://devcody.com/solo-game-dev-tools-stack-2026-0024/
- https://www.gamedeveloper.com/game-platforms/bass-monkey-postmortem-from-zero-experience-to-solo-game-dev-in-18-months-without-quitting-your-day-job-
- https://www.gamespot.com/articles/dev-plans-to-voluntarily-delete-ai-generated-game/1100-6537342/
- https://www.pcgamer.com/games/indie-dev-is-delisting-his-ai-game-from-steam-because-his-new-girlfriend-convinced-him-its-evil-the-game-existing-in-its-current-form-is-a-disgrace-to-all-game-makers-and-players/
- https://www.pcgamer.com/games/rpg/rpg-dev-pushes-back-against-steam-review-ai-accusations-we-poured-years-of-our-lives-into-this-game-and-only-worked-with-real-human-artists-on-everything/
- https://www.vice.com/en/article/steam-reviews-have-a-serious-ai-problem-that-needs-to-be-fixed/
- https://voidrifter84.itch.io/void-rift/devlog/1687578/zero-art-skills-zero-audio-skills-a-day-job-and-kids-my-claude-code-gamedev-retrospective
- https://www.totallyhuman.io/blog/the-surprising-new-number-of-genai-games-on-steam
- https://www.totallyhuman.io/blog/games-with-ai-disclosures-have-grossed-an-estimated-660m-on-steam
- https://www.tomshardware.com/video-games/pc-gaming/1-in-5-steam-games-released-in-2025-use-generative-ai-up-nearly-700-percent-year-on-year-7-818-titles-disclose-genai-asset-usage-7-percent-of-entire-steam-library
- https://www.pcgamer.com/software/ai/data-analyst-finds-ai-stigma-on-steam-can-reduce-the-number-of-reviews-a-game-gets-by-around-53-percent-and-the-reviews-it-does-get-are-more-negative/
- https://papogames.com/en/blog/steam-ai-disclosure-2026
- https://www.tomshardware.com/tech-industry/artificial-intelligence/epic-boss-tim-sweeney-blasts-steam-for-putting-ai-tags-on-games-says-move-is-irresponsible-of-valve
- https://www.malaymail.com/news/tech-gadgets/2025/12/21/indie-game-awards-rescinds-honours-from-clair-obscur-expedition-33-for-genai-use/202718
- https://astropulse.itch.io/retrodiffusion
- https://vkarach.itch.io/spriteloom
- https://red335.itch.io/pixelai-local-ai-directly-in-aseprite
