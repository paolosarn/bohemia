# MACHINE PARTY / MIKE KLUBNIKA — AESTHETIC DOSSIER (8/3/26)

Paolo, 8/3: "please do deep big brain research on the new game that just came out
called machine party. I really love it synthetic. I really love machine parties
aesthetic."

RESEARCH ONLY. Nothing here is built, nothing is proposed as canon. It is a reference
dossier so the next session does not have to re-find any of it, and so anything that
does get built off it can cite a source instead of a vibe.

---

## 1. THE FACTS

| | |
|---|---|
| Released | 30 July 2026, Steam (Windows + SteamOS/Linux) |
| Price | $7.99 / EUR 7.99, 15% launch discount |
| Made by | **Mike Klubnika** with **GDeavid**, published by Oro Interactive |
| Soundtrack | **Alex Peipman** |
| Shape | 2 to 4 players, **15 lethal minigames**, last one standing |
| Reception | Very Positive, ~88-89% of ~1,100 reviews in the first days |

Setting: a bleak, claustrophobic **industrial facility**. Players are **customisable
test subjects** (outfits and accessories) put through machines that would fail any
safety inspection. Sample minigames from coverage: shovelling peas down against a
clock; one player taking shots at the others as they try to escape; sprinting up an
endless escalator with something lethal closing behind.

**Klubnika's stated design philosophy for it:** *no fluff, no waiting, just back to back
violent chaos.* He says the team "tried our best to cut down the amount of dialogue,
transitions, and other board game aspects that minigame collection games have usually
had in the past." It started as an experiment to make five minigames a month and see if
the idea had legs.

## 2. WHO KLUBNIKA IS

Estonian solo developer, modeller, musician, VFX artist and programmer. **Buckshot
Roulette** (~6 million copies, made in about two months), **Concrete Tremor** (Soviet
apartments and plastic explosives), **Carbon Steel**, **The Other Side**, **Unsorted
Horror**, **s.p.l.i.t** (2025, terminal-driven hacking horror). He composes most of his
own soundtracks. Tools: **Blender** for models, **Paint.NET** and **Texture Ripper** for
textures, **Godot** for logic (he switched off Unity after the Runtime Fee).

His signature, in the words used about him again and again: **ancient, sinister analogue
machinery** in **handcrafted industrial environments**, in **alternate dystopias**.

---

## 3. THE FIVE THINGS THAT ACTUALLY MAKE THE LOOK

Not a mood board. These are the mechanisms, each with a source.

### 3.1 GRIME IS THE UNIFIER, AND IT CROSSES OBJECT BOUNDARIES
Klubnika, on texturing Buckshot Roulette: he **"added dirty and grimy leaks to every
corner, which blends everything together rather than having different objects."**

*That sentence is the single most useful thing in this dossier.* It is a direct answer to
the exact failure Paolo has named twice this fortnight, in his own words on 7/31 looking
at the yard: **two different games in one frame.**

Bohemia currently textures every tile INDEPENDENTLY, each one measured against a density
target and each one individually correct. Nothing crosses a seam. Klubnika does the
opposite: one filth pass laid over everything, indifferent to where one object stops and
the next starts, and it is the dirt rather than the palette that makes a room read as ONE
PLACE. A wall, a floor and a machine that share a stain are the same building. Three
surfaces that are each perfectly textured and share nothing are three assets.

### 3.2 THE TEXTURES ARE PHOTOGRAPHS OF REAL THINGS
He **photographs his own textures, mainly of electronics**, and he **urban-explores
abandoned buildings and factories** for reference. The one he names is the old **Volta
electrical component facility in Tallinn**, which he went back to "a dozen times" with
friends.

This confirms, from the other direction, the measurement this lane already derived off
Paolo's purchased tiles. His bought library measures **edge 18.4 / grain 61%** where
painted art measured **9.4 / 26%** — and the reason is that photographic surfaces are
essentially **uncorrelated at the finest scale**, which is why the texture cook had to
add a per-pixel independent term to reach it at all (smoothed noise tops out near 12 no
matter how much you add). Klubnika's surfaces measure like photographs because they ARE
photographs. Paolo loving this look and Paolo buying that tile library are the same taste
pointing at the same physical property.

### 3.3 BRUTALISM, AND NOWHERE TO REST
Brutalist architecture is his named environment inspiration, and the stated reason is
behavioural rather than visual: **the player never really feels like they can rest
anywhere.** Concrete Tremor is literally about Soviet apartment blocks. The atmosphere of
his work is described as taking after **the relentless nature of military organisations**.

### 3.4 "DESIGNED FOR A PURPOSE, WITH NO THOUGHT FOR THE USER"
On the machines in Buckshot Roulette: **everything is designed to fit a specific purpose
and does not think about the user experience** — the machine exists to cut the wire, and
nothing about it was shaped for a human hand.

This is a rule you can hold an object against and get a yes or a no, which is rare for an
aesthetic note. It is also the difference between industrial-LOOKING and industrial.

### 3.5 THE MACHINE IS THE INTERFACE
Across his catalogue the interface is the thing in front of you: terminals, keys,
switches, panels. s.p.l.i.t is described as **"raw keyboard-driven interactions,
terminal-based puzzles"** in his **"trademark dystopian, low-fi tech visual identity and
industrial audio design."** The tension comes from operating a machine, not from reading a
HUD laid over one.

---

## 4. THE SOUND IS HALF OF IT

Reviewers of Machine Party keep crediting the audio for the atmosphere: the machinery and
the bleak facilities are **"reinforced by the industrial soundtrack"**, and Alex Peipman's
score is called out for a **grimy, oppressive** consistency that deliberately contrasts
with how silly some of the minigames are. Klubnika scores his own games elsewhere. In this
family of work the industrial audio is not decoration on top of the art direction, it is a
second channel carrying the same claim.

---

## 5. WHAT IS AND IS NOT TRANSFERABLE TO BOHEMIA

Bohemia is 44px 3/4 pixel art on a phone. Machine Party is first-person 3D. The surface
technique does not port. What ports is underneath.

**PORTS DIRECTLY**
- **Grime across boundaries as the unifier** (3.1). The most actionable thing here, and it
  aims straight at the complaint Paolo has raised twice.
- **Source from real places** (3.2). Bohemia's standing law is that everything must be
  grounded in the real; Klubnika grounds it by walking into the actual building. Vegas has
  its own Volta.
- **Purpose-built, user-hostile objects** (3.4). Post-economic-apocalypse Las Vegas is full
  of machinery that outlived the people it was for.
- **Nowhere to rest** (3.3), which is a LEVEL rule, not a texture rule.
- **Cut the connective tissue** — his "no dialogue, no transitions, no board-game bits"
  is a loop principle, and it is the same instinct as Paolo's standing complaint about
  small timid turns and filler.

**DOES NOT PORT**
- Vertex wobble, affine texture warping, PS1 artefacting: those are 3D-perspective
  artefacts and there is no perspective divide in a 44px tile to break.
- CRT scanlines and heavy screen grain: a global overlay on 44px art destroys exactly the
  per-pixel detail this lane spent a week measuring its way toward. Any screen-space
  filter here is a subtraction, not an addition.
- First-person diegetic panels: the closest true equivalent Bohemia already has is the
  physical-object interface, not a filter.

**[PENDING PAOLO]** Nothing in section 5 is law. It is a list of things that COULD be law
if he wants them to be, and no session should treat any of it as a ruling until he says so.

---

## 6. SOURCES
- Steam store page, Machine Party — https://store.steampowered.com/app/4108000/Machine_Party/
- mikeklubnika.com, Machine Party — https://mikeklubnika.com/games/machine_party
- Inven Global, release coverage — https://www.invenglobal.com/articles/24311/risk-your-life-together-content-warning-developers-new-game-machine-party-released
- Gematsu, launch date — https://www.gematsu.com/2026/07/machine-party-launches-july-30
- Bloody Disgusting, release + trailer — https://bloody-disgusting.com/video-games/3961582/violent-party-game-collection-machine-party-now-available-trailer/
- Indie-cent Exposure, 15 minigames — https://www.indie-exposure.com/machine-party-launches-on-steam-july-30/
- Life is Xbox, review — https://www.lifeisxbox.eu/review-machine-party/
- Mobidictum interview with Klubnika (brutalism, grime, tools) — https://mobidictum.com/interview-with-mike-klubnika-developer-of-buckshot-roulette/
- 80.lv, solo development + Volta facility — https://80.lv/articles/buckshot-roulette-developer-on-making-the-game-solo-feedback-success
- 80.lv, on Godot — https://80.lv/articles/buckshot-roulette-developer-discusses-benefits-of-godot-for-his-latest-game
- COGconnected, s.p.l.i.t — https://cogconnected.com/2025/07/mike-klubnika-launches-new-psychological-horror-game-s-p-l-i-t-on-steam/
- Concrete Tremor on itch — https://mikeklubnika.itch.io/concrete-tremor

**ONE ATTRIBUTION FLAG:** one outlet headlines Machine Party as being by the "Content
Warning developer". Every other source credits Mike Klubnika with GDeavid, and Content
Warning was Landfall's. Treating that headline as a co-credit would be repeating a
mistake, so it is recorded here as unverified rather than folded into the facts above.
