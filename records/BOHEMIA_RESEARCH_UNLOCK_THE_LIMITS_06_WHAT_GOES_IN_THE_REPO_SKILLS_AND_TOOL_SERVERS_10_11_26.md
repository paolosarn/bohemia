# UNLOCK THE LIMITS 06: WHAT GOES IN THE REPO, SKILLS AND TOOL SERVERS (research, 10/11/26)

Angle: what can be installed in a public repo, once or free, that makes a coding agent a better pixel artist. Rulings carried in: one-time or free, no monthly, no outside credits, no graphics card (rule 108). Container note: most vendor and GitHub pages could not be opened from here; every fact below rests on search-result text unless a repo record already verified it. Real URLs only.

## 1. THE FINDING

Three free things go in the repo: an MCP server that lets a chat drive the Aseprite Paolo bought, headless, and measure what it drew; one SKILL.md folder holding our measured numbers and the craft rules as checklists; and a small library of CC0 and CC-BY art the chats may legally open and study for structure. The server is the biggest unlock, because the chats stop writing pixels as numbers in JavaScript and start using real pixel tools (indexed palettes, outline, dither, onion skin, sheet export) in a render-and-look loop. The skill is second, because every published pixel-art skill knows nothing about our 96 px floor, 112 px person, top-left light or 45 degree ratio. The library is third, because the chats have been inventing structure (how a fence or a roof reads at 96 px) that licensed sprites already show. None of this buys taste: the seventh-grader feel drops when the tells gate stops the known faults, and the ceiling still comes from a human hero set extended by rule.

## 2. THE TOOL SERVERS

| Server | What it lets the agent do | Maturity | Licence | URL |
|---|---|---|---|---|
| MalloyTheDev/aseprite-mcp | Drives Aseprite headless; about 156 tools to draw, shade, animate; `assess_sprite` scores noise, jagged diagonals, palette conformance; `diff_sprites`, `validate_loop`; exports PNG, GIF, sheets. The agent can measure without seeing the screen. | Active, largest tool set; needs Aseprite 1.3+, Python 3.10+ | MIT (per round-three record, not re-opened this round) | https://github.com/MalloyTheDev/aseprite-mcp |
| willibrandon/pixel-mcp | Aseprite through CLI and Lua; indexed palettes, dithering, shading, animation, spritesheet export; ships a CLAUDE.md. | ~150 stars, v0.5.0 Oct 2025; Go 1.23+, Aseprite 1.3.0+ | MIT (pkg.go.dev) | https://github.com/willibrandon/pixel-mcp |
| Vollkorn-Games/aseprite-mcp | Node server, spawns `aseprite -b` with Lua; `render_sprite` returns an upscaled PNG so a vision model checks its own art. | Small, single author | Not confirmed | https://github.com/Vollkorn-Games/aseprite-mcp |
| diivi/aseprite-mcp | Python, 104 tools in 17 categories: frame diffs, colour stats, palette presets, ramps, quantization. | ~70 stars | MIT | https://github.com/diivi/aseprite-mcp |
| rexxkelley/pixelart-mcp | Headless Aseprite plus pixel-art computer vision plus git-like checkpoints; create, inspect, analyse with no GUI. | New | Not confirmed | https://github.com/rexxkelley/pixelart-mcp |
| jmorais1988/pixelworks-mcp | 169 tools: headless Aseprite workbench, a Krita bridge, and Retro Diffusion (local model or API), each gated separately. Only the Aseprite part fits rule 108; the local model needs a GPU, the API is credits. | New, broad | Not confirmed | https://github.com/jmorais1988/pixelworks-mcp |
| ahujasid/blender-mcp | Drives Blender: scenes, materials, renders. Useful for a 45 degree reference render of a block to trace proportions from, not for pixels. | ~29k stars (Star History, Sept 2026) | MIT | https://github.com/ahujasid/blender-mcp |
| Krita (raiinman/krita-mcp, edithatogo/krita-cli) and GIMP (Shriinivas/gimpmcp, martinduartemore/mcp-gimp) | Paint through a plugin in the running app; krita-cli has 50+ tools. All need the editor window open, so a desktop, not a runner. | Community, GIMP ones work in progress | Not confirmed | https://github.com/raiinman/krita-mcp |
| abidoo22/Pixelorama-MCP | Free, open editor; layers and pixels from text. Pixelorama's headless export fails silently (its issue 1625), so GUI only. | New | Not confirmed | https://github.com/abidoo22/Pixelorama-MCP |
| Coding-Solo/godot-mcp | Launch Godot, build scenes, load sprites, read debug output. Our game is an HTML page, so a preview sandbox at most. | 2.5k to 4.6k stars | MIT | https://github.com/Coding-Solo/godot-mcp |
| Comfy-Org/comfy-mcp; Figma Dev Mode MCP | ComfyUI needs a graphics card; Figma needs a paid seat. Both OUT. Photopea: no MCP found. | Beta; shipping | Not confirmed; paid seat | https://github.com/Comfy-Org/comfy-mcp |

The pick: ONE Aseprite server, MalloyTheDev's, the only one whose results say what each call did and score the sprite, which an agent with no eyes needs most. The runner builds Aseprite from source once (the EULA allows compiling for your own use, never redistributing the binary; PLUMBER [aseprite in the pipe] carries this). Vollkorn's `render_sprite` idea becomes a Lua script, not a second server.

## 3. THE SKILL: `skills/bohemia-pixel-art/SKILL.md`

Format: the open Agent Skills standard (agentskills.io; frontmatter `name` and `description`, body under 500 lines, detail in `references/`, checks in `scripts/`); the agent loads only the description until a drawing task matches. Of the published pixel skills, Gamezxz/pixel-art-studio has the right shape (a build script as source of truth; render, critique, fix, repeat; `references/patterns.md` and `palettes.md`), omer-metin's pixel-art (Apache-2.0) has the deepest generic craft text, and NousResearch's hermes pixel-art (MIT) is a photo converter. We take the shape, not the text.

Sections, and the measured facts each holds:

1. THE NUMBERS (one table, from the laws, never from memory): person 112 px box, about 100 px painted, one size on every surface; ground floor 96 px (rule 105); light from the upper left; the 45 degree ratio the art gate measures; a square grid; one-pixel border where he sees it; integer scaling only, no mixels; twelve drawn keys a bar at 120 BPM and no joint reversing past 120 degrees between keys.
2. THE PALETTE: the pack palettes as .gpl files in `references/palettes/`, indexed mode always, ramps hue-shifted not just darkened, the exact colour count per asset class.
3. THE BUILD ORDER: silhouette, base fill, light, shadow, outline, detail, anti-alias; never texture before form.
4. THE FAULT CATALOGUE, each with the measure that catches it: orphan pixels, single-use colours, mixels, pillow shading, wrong light angle, cluster density (the six in `tools/bohemia_pixel_craft_audit.py`); banding, jaggies, doubles (`tools/bohemia_eyes_pixel_tells.py`); off-palette drift; seams (tile 3x3, diff the edges); a face with no eyes. Each names its section in `laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md`.
5. THE LOOP: draw through the server, render at 4x, read the audit numbers, fix, repeat; done when the audit passes AND the piece sits beside its nine pack neighbours in one picture (rule 82).
6. THE ASSET CONTRACT: name pattern, canvas per class, anchor, frame count, sheet layout, export JSON; one line each.
7. WHAT NOT TO DO: no pixels as literal arrays in JS, no non-integer scaling, no new palette per asset, no filter-made horror.

Rules come from: the twelve sections of the pixel craft laws (7/27) first; Pixel Logic (Azzi, bought 10/11), read once in a chat and restated in our words with page cites, never the PDF; Saint11 (CC BY 4.0, quotable with credit); Derek Yu, Pixel Parmesan and the Pixnote glossary, read for rules only. The checks exist; the skill wraps them.

## 4. THE FREE LIBRARY (what the chats may legally open and study)

- Kenney, all packs: CC0, commercial fine, credit optional (kenney.nl/support). Study structure, do not paste.
- OpenGameArt: filter by licence; CC0 free to study and reuse, CC-BY needs credit, CC-BY-SA binds derivatives. https://opengameart.org
- Liberated Pixel Cup sprites: CC-BY-SA 3.0 and GPL 3.0; study the walk cycle and 4-direction body, never copy, since share-alike would bind our art.
- Saint11 tutorials (Pedro Medeiros): CC BY 4.0; text and GIFs may enter the skill with credit. https://saint11.art/blog/pixel-art-tutorials/
- Lospec palette list: free .hex/.gpl downloads; per-palette licence not stated, and a colour list is not art, so use and credit. Tutorial index: https://lospec.com/pixel-art-tutorials (hundreds, per search text, not opened).
- Free rules pages: Derek Yu https://derekyu.com/makegames/pixelart2.html; Pixel Parmesan https://pixelparmesan.com/blog/anti-aliasing-fundamentals-for-pixel-artists; Pixnote glossary https://pixnote.net/en/learn/glossary/. Derive rules, cite, never copy pictures.
- Retro-Diffusion/pixel-bench: open benchmark scoring grid alignment and colour error (delta E); its grid test can feed the mixel check. https://github.com/Retro-Diffusion/pixel-bench
- Paid and not needed: Silber's Pixel Art for Game Developers (Routledge, ISBN 9781482252309). MortMort and Brandon James Greer are video; rules reach the skill only through a human's notes.

## 5. WHAT IT FIXES, AND WHAT IT DOES NOT

Fixes: pixels drawn as code with no look-back (the server renders and scores); each chat inventing its own numbers (one table); known tells reaching Paolo (the catalogue runs before the VOTE tab); invented structure (the library shows how a fence, a roof, a walk read small); palette drift (indexed mode, .gpl in the repo).

Does not fix: taste, proportion sense, the feel of a hand. No free, no-GPU tool makes a finished 96 px tile from a sentence at our bar. A server with 156 tools draws what it is told; a 400-line skill knows what not to do, not what is beautiful. One paid artist's hero set, extended by rule, is still the ceiling. Figma, ComfyUI and the Retro Diffusion local model stay out under his rules.

## 6. ONE RULE

NO CHAT DRAWS A PIXEL OUTSIDE THE SKILL AND THE SERVER: every piece of art is made through the Aseprite server (or its Lua scripts), by a chat that has loaded `skills/bohemia-pixel-art`, and passes the audit numbers and the nine-neighbour picture before it is registered in the VOTE tab. A pixel written as a number in JavaScript is a gate failure. Gate: PLUMBER [the art pipe gate] reads the registry for the server's export JSON next to every new asset.

## 7. SOURCES (search-result text; pages not opened from this container unless a repo record says so)

- Aseprite MCP servers: https://github.com/MalloyTheDev/aseprite-mcp, https://github.com/willibrandon/pixel-mcp, https://pkg.go.dev/github.com/willibrandon/pixel-mcp, https://github.com/Vollkorn-Games/aseprite-mcp, https://github.com/diivi/aseprite-mcp, https://github.com/rexxkelley/pixelart-mcp, https://github.com/jmorais1988/pixelworks-mcp, https://github.com/sloplink/aseprite-mcp, https://github.com/ext-sakamoro/AsepriteMCP
- Other editors: https://github.com/ahujasid/blender-mcp, https://www.star-history.com/ahujasid/mcp-for-blender, https://github.com/raiinman/krita-mcp, https://github.com/edithatogo/krita-cli, https://github.com/Shriinivas/gimpmcp, https://github.com/martinduartemore/mcp-gimp, https://github.com/abidoo22/Pixelorama-MCP, https://github.com/Coding-Solo/godot-mcp, https://github.com/Comfy-Org/comfy-mcp, https://help.figma.com/hc/en-us/articles/35280968300439-Figma-MCP-collection-What-is-the-Figma-MCP-server
- Aseprite EULA and headless: https://github.com/aseprite/aseprite/blob/main/EULA.txt, https://www.aseprite.org/docs/cli/, https://dev.to/bsymbolic/building-aseprite-from-source-a-paid-pixel-art-editor-free-if-you-compile-it-44h3
- Skills format and examples: https://agentskills.io/, https://github.com/anthropics/skills, https://github.com/Gamezxz/pixel-art-studio, https://skillselion.com/skills/omer-metin/skills-for-antigravity/pixel-art, https://tessl.io/registry/skills/github/NousResearch/hermes-agent/pixel-art, https://github.com/chasexu168340-rgb/codex-skills/blob/main/pixel-art/SKILL.md
- Library and licences: https://kenney.nl/support, https://opengameart.org, https://saint11.art/blog/pixel-art-tutorials/, https://github.com/saint11/Saint11Tutorials, https://lospec.com/palette-list, https://lospec.com/pixel-art-tutorials, https://derekyu.com/makegames/pixelart2.html, https://pixelparmesan.com/blog/anti-aliasing-fundamentals-for-pixel-artists, https://pixnote.net/en/learn/glossary/, https://pixeljoint.com/forum/forum_posts.asp?TID=11299, https://github.com/Retro-Diffusion/pixel-bench, https://github.com/Astropulse/pixeldetector
- Books: https://michafrar.gumroad.com/l/pixel-logic (Pixel Logic, 242 pages, $10+), https://www.routledge.com/Pixel-Art-for-Game-Developers/Silber/p/book/9781482252309
- In the repo: laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md, tools/bohemia_pixel_craft_audit.py, tools/bohemia_eyes_pixel_tells.py, records/BOHEMIA_RESEARCH_THE_TUTOR_NO_GPU_NO_SUBSCRIPTION_ROUND_THREE_10_10_26.md, records/BOHEMIA_PAOLO_ASEPRITE_10_11_26.md, records/BOHEMIA_PAOLO_PIXEL_LOGIC_AND_THE_LINKS_10_11_26.md
