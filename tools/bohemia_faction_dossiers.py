#!/usr/bin/env python3
"""BOHEMIA FACTION DOSSIER FACTORY (8/2/26, PEOPLE lane)

Paolo's direct order, 7/31 lore sitting: "WE NEED TO REALLY FLESH THE FACTIONS OUT
FR MAKE ALL OF THEM AWESOME AND INTERESTING." Backlog PEOPLE item 00, the lane's
top item.

WHAT THIS IS, AND WHAT IT DELIBERATELY IS NOT.
  IS:     one researched PROPOSAL dossier per faction, generated from one typed
          table, emitted as records/factions/*.md plus ONE side-by-side judge
          sheet for his thumbs. The district theme-sheet pattern (7/28) applied
          to people instead of ground.
  IS NOT: faction machinery. No standing ledger, no territory model, no faction
          beats, no new engine/bohemia_faction*.js. laws/BOHEMIA_ADDENDUM_BUILD_
          THE_WORLD_7_31_26.md turned that off and gates/build_the_world_gate.py
          holds the ratchet. Nothing here grows it.
  IS NOT: quest content. The order asks for three HOOKS per faction and hooks are
          one-line premises on a proposal sheet. No .bq file is written, no
          questbook file is touched, no placement or payout table exists here.
          gates/faction_dossier_gate.py asserts that boundary rather than
          promising it.

CONTENTS-PAOLO'S, WITHOUT THE ESCAPE HATCH. Every row below is a PROPOSAL and the
sheet says so on every card. Existing canon is the FLOOR and is reproduced, never
re-litigated: the align/power/relations block on each card is copied out of
engine/BOHEMIA_faction_graph.json ("All canon; nothing invented", derived from GDD
v2 section 9) and the six faction LOOKS Paolo already ruled on 7/21 are carried
VERBATIM out of engine/bohemia_dress.js. Asking him to re-thumb his own rulings is
what NOTES ARE RULINGS bans, so those six are printed as SETTLED and carry no
thumb.

REUSE CHECK (7/22 law):
  - engine/BOHEMIA_faction_graph.json ....... USED. The canon block on every card
    is read out of it at generate time, so a dossier cannot drift off the graph.
  - engine/bohemia_dress.js ................. USED. FACTION_LOOK's six ruled
    entries are parsed out of the live module and reprinted as settled; the two
    empty tables (FACTION_COLOR, FACTION_VETERAN_KIT) are the sockets these
    proposals are shaped to fill.
  - banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt  USED. Every garment named in a
    veteran kit is a real row in the canon bank; the gate re-checks all of them.
    Nothing new is cooked and no garment is invented (approved wardrobe only,
    which is what the order asked for).
  - records/BOHEMIA_DISTRICT_THEME_SHEET_7_28_26.md  USED as the FORM. Proposals,
    one line each, marked as proposals, judged on one sheet.
  - records/BOHEMIA_UNNAMED_NPC_POPULATION_RESEARCH_7_28_26.md  USED for where
    people actually are in the valley; territory rows agree with it.
  - nothing new is drawn. This factory cooks TEXT, not pixels.

  python3 tools/bohemia_faction_dossiers.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'


def read_chosen():
    """THE COLOURS PAOLO ALREADY CHOSE, read out of the alpha's MFACTIONS table.

    8/2, and he had to say it twice: "BRO WE ALREADY CHOSE COLORS FIND IT IN THE
    PROJECT." He was right. Every one of the fourteen factions has carried an ACCENT
    COLOUR and a MOTIF in the music lane's faction table since the faction songs
    shipped - live in the alpha, judged, his. I proposed a parallel set without ever
    looking, which is a REUSE-FIRST violation with his name on it.

    So this is read from the file now instead of retyped. A colour cannot drift from
    the one he picked if nobody is allowed to type it.
    """
    src = open(ALPHA, encoding='utf-8').read()
    i = src.find('MFACTIONS=[')
    if i < 0:
        return {}
    seg = src[i:]
    seg = seg[:seg.find('\n];')]
    out = {}
    # split on the row heads rather than matching a trailing comma - the LAST row has
    # no comma, and a regex that needs one silently drops the Homeless. (It did.)
    heads = list(re.finditer(r"\{n:'([^']+)'", seg))
    for i, hm in enumerate(heads):
        body = seg[hm.end():(heads[i + 1].start() if i + 1 < len(heads) else len(seg))]
        acc = re.search(r"acc:'(#[0-9a-fA-F]{6})'", body)
        mot = re.search(r"motif:'(\w+)'", body)
        if acc:
            out[hm.group(1)] = {'acc': acc.group(1), 'motif': mot.group(1) if mot else None}
    return out


CHOSEN = read_chosen()

GRAPH = 'engine/BOHEMIA_faction_graph.json'
DRESS = 'engine/bohemia_dress.js'
BANK = 'banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt'
OUTDIR = 'records/factions'
JUDGE = 'slices/BOHEMIA_FACTION_DOSSIER_JUDGE_8_2_26.html'

# ============================================================================
# THE SPEC. Every dossier is exactly these fields; a missing or empty one fails
# the gate. This is the typed spec half of FACTORY LAW.
# ============================================================================
FIELDS = [
    'five_words',    # identity in five words (the order's own first row)
    'grounding',     # the real social pattern, named. researched, not vibes
    'territory',     # where they are and what their base is
    'controls',      # what they trade or control
    'dress',         # how they dress - approved wardrobe only
    'talk',          # how they talk - feeds the earned-names machine
    'wants',         # what they want from the player
    'hooks',         # 3 quest hooks
    'lesson',        # the life lesson underneath. never preached
]

# The one axis every dossier must answer, because this lane already BUILT the
# machine it feeds: laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.
# Everyone starts as a generic faction identity and a name is ASKED for. So every
# faction gets its own answer to "what happens when you ask a stranger's name",
# and no two are the same. That is the difference between a list and a system.
NAME_RULE = 'name_rule'
FIELDS.insert(6, NAME_RULE)

# VERDICT IN, 8/2/26: records/BOHEMIA_FACTION_VERDICT_8_2_26.txt. 15 UP, 0 down,
# 1 left unthumbed with a note. So these stopped being proposals the moment he
# exported that file - APPROVED is CANON (verdict pipeline), and a card that still
# said "proposal, not canon" after he thumbed it would be asking him to rule twice.
# The two cards he wrote on carry HIS words in their flags, not my summary of them.
VERDICT = 'records/BOHEMIA_FACTION_VERDICT_8_2_26.txt'
APPROVED_BANNER = (
    'CANON. Paolo thumbed this UP on 8/2/26 (%s). Everything below is his now. The '
    'canon floor above is the older canon it was built on, and is still not up for '
    'judgement.' % VERDICT
)
NOTED_BANNER = (
    'NOT THUMBED, AND CORRECTLY SO - he left a NOTE on this card instead of a verdict '
    'on 8/2/26 (%s), because it is not a faction to approve. NOTES ARE RULINGS: his '
    'note is in the flags below, in his words.' % VERDICT
)
# a card added AFTER the sitting would carry this again; nothing does today
PROPOSAL_BANNER = (
    'PROPOSAL, NOT CANON. Paolo approves, edits or kills. Existing canon is the '
    'floor and is reproduced above, never re-argued.'
)
# from the verdict file, verbatim. UNJUDGED here is his deliberate note-instead-of-thumb.
VERDICTS = {k: 'up' for k in
            ['REMNANTS', 'CARTEL', 'NETWORK', 'HOMELESS', 'MOB', 'CARAVANS', 'CHURCH',
             'VOLUNTEERS', 'TRADES', 'REDS', 'BLUES', 'ANARCHISTS', 'COLORFUL', 'KARENS',
             'SOCIAL_FORCES']}
VERDICTS['AMALGAMATION'] = 'noted'


def banner_for(key):
    v = VERDICTS.get(key)
    return APPROVED_BANNER if v == 'up' else NOTED_BANNER if v == 'noted' else PROPOSAL_BANNER

# ============================================================================
# THE DOSSIERS. Ordered as the sheet reads: the seven he named first, then the
# rest of the canon roster, because he said ALL of them.
# ============================================================================
D = {}

D['REMNANTS'] = dict(
    name='THE REMNANTS', kind='selectable', graph='Remnants',
    five_words='The floor. Holding. Refusing the crown.',
    grounding=(
        "A military that outlives its state does not become a government - it becomes a "
        "PLACE. Real pattern, three times over: the Soviet garrisons of 1991 guarding depots "
        "they could no longer supply, the Iraqi army of 2003 dissolving into the "
        "neighbourhoods its soldiers came from, and the sharpest one, Rome's LIMITANEI - "
        "frontier troops who, when the pay stopped coming, became farmer-soldiers permanently "
        "married to the ground they were standing on. Capability is not the weapon, it is the "
        "LOGISTICS, and logistics is the first thing a dead state stops providing. Nellis is "
        "real and it is the right base for it: its own generation, its own water, munitions "
        "storage, and a test range the size of a small country. What the Remnants have is an "
        "organisational chart, a rifle for every hand and a fuel supply that the GDD already "
        "killed (gasoline dies in 6-12 months). "
        "AND THE HONEST GROUND FOR THE CANON LINE 'specifically do not want to be a "
        "government': the moment you govern, you own the famine. Juntas that seize a country "
        "inherit blame for the harvest. Read them as a garrison that fed a neighbourhood the "
        "first winter, was expected to the second, could not the third, and buried people who "
        "died of a promise. The standing order since: WE HOLD THE LINE, WE DO NOT RUN THE TOWN."
    ),
    territory=(
        "Nellis is the keep (airbase district). THE ARSENAL one block off the Strip is theirs "
        "at game start and contested with the Cartel - already canon, GDD v5. But their real "
        "territory is not area, it is ROAD: checkpoints, the interchange, the on-ramps. You do "
        "not enter Remnant ground, you get waved through it."
    ),
    controls=(
        "Ammunition, working radios, the only maintained vehicles, and the only accurate map of "
        "the valley. They do not sell the map. They trade READS of it."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#9aa23a'}, chosen=True, motif='stencil',
        look_note=(
            "OLIVE DRAB - and it was already chosen, in the alpha, since the faction songs shipped. A STENCIL green: the colour of a number sprayed on a crate. SECOND SIGNAL, because a colour is never alone - everybody in America owns surplus olive, so what says REMNANT at fifty metres is the WEBBING: rig, bracers, leg wraps, helm. Colour says which side, silhouette says how serious."
        ),
        kit={'base': ['WORK COVERALLS', 'OLIVE DRAB TEE'], 'legs': ['OLIVE PANTS', 'BLACK CARGOS'],
             'feet': ['FIELD BOOTS', 'BROWN BOOTS'], 'gear': ['OLIVE CHEST RIG', 'WORN BRACERS', 'OLIVE LEG WRAPS'],
             'head': ['OLIVE FIELD CAP', 'SCRAP HELM'], 'back': ['OLIVE RUCK PACK']},
    ),
    talk=(
        "Rank first, sentence second. They will answer a question you did not ask if it is "
        "about the road, and refuse one you did ask if it is about numbers. Nobody swears in "
        "front of the sergeant and everybody swears behind him."
    ),
    name_rule=(
        "THEY GIVE YOU A SURNAME ON THE FIRST ASK AND A FIRST NAME ALMOST NEVER. Ask a Remnant "
        "their name and you get HOLLAND, immediately, because a surname is what goes on a "
        "roster and a roster is public. The first name is the thing you earn, and it usually "
        "arrives from somebody ELSE - you hear another soldier use it before they ever offer it."
    ),
    wants=(
        "Not loyalty. INFORMATION ABOUT THE ROAD. What is between here and the next checkpoint, "
        "honestly, including the parts that make them look bad. They will pay in ammunition and "
        "they will remember an accurate report longer than they remember a favour."
    ),
    hooks=[
        "A checkpoint has been holding a road nobody has used in four years, and the man in "
        "charge knows it. Nobody has ordered him off it and he will not leave without one.",
        "THE ARSENAL: the Cartel is inside the wire and the Remnants cannot say how long. "
        "Already canon as the contested asset; the quest is who you tell.",
        "A medic deserted and took the trauma kit. He has been using it in a neighbourhood the "
        "Remnants do not cover. They want the kit back and they have not decided about him.",
    ],
    lesson=(
        "Holding a line and protecting somebody are not the same job, and the hard part is "
        "knowing which one you are actually doing today."
    ),
)

D['CARTEL'] = dict(
    name='THE CARTEL', kind='selectable', graph='Cartel',
    five_words='A tax you never agreed to.',
    grounding=(
        "The real thing about a cartel is that it is NOT chaos - it is administration with the "
        "consent removed. Real cartels do not destroy the trade they feed on, they run it: "
        "route tolls, controlled crossings, and protection sold to the same people being "
        "threatened. Their supply chain mirrors the legitimate one (already canon here) because "
        "it IS the legitimate one with a different signature on it. And they persist for a "
        "reason worth taking seriously: they solve ENFORCEMENT for people no institution will "
        "serve. The offer is genuinely useful. That is what makes it a trap rather than a "
        "monster. "
        "THE SECOND REAL PATTERN, and the actual horror: predation organisations are RECRUITING "
        "organisations. They grow by offering the two things a collapse strips out - income and "
        "belonging - to seventeen-year-olds who have neither. Nobody joins for the violence. "
        "They join because somebody finally had a job for them."
    ),
    territory=(
        "They do not hold ground, they hold CHOKEPOINTS - where the 15 narrows, the one "
        "surviving bridge over the wash, the interchange ramp. A faction that owns the door "
        "does not need the house. Permanent war with the Remnants and prey-tax on the Caravans "
        "are both canon relations and both are geography: the Remnants hold roads, the Cartel "
        "holds the pinches in them."
    ),
    controls=(
        "Passage. Also, quietly, PEOPLE - the canon frames them as organised human predation "
        "and the honest reading of that in a labour-starved valley is that they are the only "
        "faction whose main product is other people's work."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#5c302a'}, ruled=True,
        look_note=(
            "SETTLED, PAOLO 7/21: 'cartel can be the darkest red possible, maroon vibes.' The "
            "oxblood ramp, already worn by six-plus canon items. Not re-proposed and not "
            "thumbed - it is his."
        ),
        kit={'base': ['OXBLOOD PLAID FLANNEL', 'FADED BLACK LONGSLEEVE'], 'legs': ['BLACK DENIM'],
             'feet': ['OXBLOOD BOOTS', 'TALL MOTO BOOTS'], 'gear': ['OXBLOOD BRACERS', 'RUST THIGH HOLSTER'],
             'face': ['OUTLAW BANDANA'], 'hands': ['OXBLOOD GLOVES']},
    ),
    talk=(
        "Warm. Genuinely warm, which is the problem. Nobody threatens you; everything is an "
        "offer and every offer is slightly better than it should be. The menace lives entirely "
        "in what happens to the tone the first time you say no."
    ),
    name_rule=(
        "THEY KNOW YOUR NAME BEFORE YOU ASK THEIRS, AND YOU NEVER GET THEIRS. The first Cartel "
        "man you meet greets you by name and you have not told anyone. Asking for his gets a "
        "smile and a redirect, every time, forever. The one faction where the name mechanic "
        "runs backwards - being KNOWN is the threat."
    ),
    wants=(
        "They want you to OWE them. Not to work for them, not yet. The first thing they give "
        "you is free and it is exactly the thing you needed that week."
    ),
    hooks=[
        "Somebody's kid has been eating well for a month and the family has stopped asking why. "
        "They have not been hurt and nobody has been threatened. That is the whole problem.",
        "A Cartel toll on the wash bridge is the reason a clinic gets resupplied at all. Take "
        "the bridge and the medicine stops. Nobody involved is lying.",
        "A Cartel enforcer wants out and the only currency he has to buy his way out with is "
        "the route list. The list is worth more to the Remnants than his life is to anyone.",
    ],
    lesson=(
        "The first one is always free, and the price is never the thing you paid for it."
    ),
)

D['NETWORK'] = dict(
    name='THE NETWORK', kind='selectable', graph='Network',
    five_words='The help you cannot do without.',
    grounding=(
        "Forget cult. The real pattern that should frighten you is an INFRASTRUCTURE MONOPOLY "
        "everybody depends on for perfectly rational reasons. The people who keep the pipes "
        "running accumulate power that nobody voted to give them, because the alternative to "
        "trusting them is having no water. Layer the second documented pattern on top: "
        "high-demand groups do not recruit through belief, they recruit through USEFULNESS. The "
        "people who fixed your radio are the people whose worldview you quietly stop "
        "questioning. "
        "The Network's members are not lying to you. Canon is explicit that the early carriers "
        "'did not know they were being directed - they felt called', and that is the whole "
        "horror: there is no liar in the room. "
        "AND THE ENVIRONMENTAL TELL THIS GAME ALREADY OWNS: CLUSTERED POWER is canon - 12% of "
        "the valley lit, owned, and the Network's grid eerily perfect. In a world where nothing "
        "works, the thing that works perfectly is the thing to be afraid of."
    ),
    territory=(
        "Two data centres on the surface, everyone knows it, that is canon and it is the point - "
        "they are not hiding. The near-black slab of the DATA FORTRESS with its cyan night hum, "
        "and the robotics factory by the Henderson airport, tied to them at game start. What is "
        "under the fortress is not theirs to know either, in act one."
    ),
    controls=(
        "The feed, the radio repeaters, and the lit grid. They are the reason a message crosses "
        "the valley in an hour instead of a day, and they have never once charged for it."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#1fbf9c'}, chosen=True, motif='circuit',
        look_note=(
            "TEAL, already chosen, and already half-canon twice over: the data fortress is a near-black slab with a CYAN NIGHT HUM, and his motif for them is CIRCUIT. The colour of the thing that still has power. SECOND SIGNAL: their clothes are INTACT. Everyone else is patched and dust-eaten; a Network member's teal is CLEAN, which in a valley with no laundry means somebody has water to spare on appearance. PURPLE WAS THE OBVIOUS WRONG ANSWER and the reservation forbids it - putting the Amalgamation's colour on the Amalgamation's own pawn would hand the player the act-3 reveal in act one."
        ),
        kit={'base': ['STEEL WORK SHIRT', 'BONE BUTTON-UP', 'CHARCOAL TURTLENECK'],
             'legs': ['SLATE WORK PANTS'], 'feet': ['STEEL SNEAKERS', 'SLATE SNEAKERS'],
             'outer': ['STORM VEST'], 'hands': ['LEATHER GLOVES']},
    ),
    talk=(
        "Precisely helpful and never curious. They answer the question you asked, completely, "
        "and ask nothing back. The uncanny thing is not what they say, it is the total ABSENCE "
        "of small talk - nobody who has been alone this long is that incurious about a stranger."
    ),
    name_rule=(
        "THEY GIVE YOU THEIR NAME UNPROMPTED, ON THE FIRST MEETING, WARMLY - AND THAT IS THE "
        "TELL. Everyone else in the valley has to be asked. The Network hands it over before "
        "you open your mouth, and if the player has been playing a while, the mechanic itself "
        "makes their skin crawl without a single line of dialogue explaining why."
    ),
    wants=(
        "To be USEFUL to you. That is it, and it is sincere, and it is how it works. They want "
        "you on the grid, on the feed, and reachable."
    ),
    hooks=[
        "They restore power to a block for free and ask nothing. Three weeks later the block "
        "cannot function without it and has started policing itself to keep them happy.",
        "A Network technician has noticed that his own chapter's coordination is impossible - "
        "decisions arriving before the message did. He wants somebody outside to tell him he is "
        "imagining it. ACT 1 RULE HOLDS: this reads as haunting, never as machinery.",
        "Their repeater is the only way to warn the tunnels about a flood, and using it means "
        "telling the Network exactly who is down there.",
    ],
    lesson=(
        "The most dangerous help is the kind you cannot afford to refuse."
    ),
)

D['HOMELESS'] = dict(
    name='THE HOMELESS', kind='selectable', graph='Homeless',
    five_words='Already survived the end once.',
    grounding=(
        "This is the most literally true faction in the game. Las Vegas really does have a "
        "flood-channel system of roughly 600 miles with a documented population living in it - "
        "this repo's own wash tilespec cites 1,200-1,500 tunnel people entering at the outfalls, "
        "and the GDD already locks the physics: the tunnels run about twenty degrees cooler, and "
        "'the Homeless knew first.' "
        "The real social structure down there is not a hierarchy and not a mob. It is a mesh of "
        "two- and three-person camps with hard norms - you do not take from a camp, and you DO "
        "pass on what you know about the weather. Because the killer is not people, it is water: "
        "flash floods come through those culverts at about thirty miles an hour. So the entire "
        "culture is organised around weather literacy and evacuation, which is a survival skill "
        "nobody above ground has and everybody above ground will need. "
        "AND THE REASON THEY ARE THE MOST RESISTANT FACTION IS NOT NOBILITY, IT IS EXPERIENCE. "
        "People who have already survived losing everything are the least destabilised when "
        "everybody else loses everything. For them the collapse was mostly the day the world got "
        "quieter. Canon adds the rest: they barely use the feed and they talk face to face in "
        "tunnels nothing can monitor, so the thing that reads people through the feed is BLIND "
        "down there."
    ),
    territory=(
        "The storm tunnels, canon, entrances on the wash. They live directly above the Network's "
        "real infrastructure without knowing it - canon, and the engine of the whole demo. The "
        "7/24 lock explains why that is survivable: PROXIMITY WITHOUT CURIOSITY IS SAFE. They "
        "never look. The player's job is to look."
    ),
    controls=(
        "The underground itself - every entrance, every 90-degree culvert turn, and which "
        "trunk floods first. The fastest way across the valley is under it, and they are the "
        "only people who can tell you when that is a route and when it is a grave."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#b8642a'}, chosen=True, motif='cracked',
        look_note=(
            "RUST BROWN, already chosen, motif CRACKED - the colour of a dry channel and the concrete that made it. Not grey, which is what I guessed: rust is what corrugate and rebar and old steel actually go in a desert, and it is what somebody living in a storm drain would be stained with. SECOND SIGNAL: layers that do not match, plus carried bedding - the silhouette of somebody wearing their entire property."
        ),
        kit={'base': ['TATTERED FLANNEL', 'TATTERED TEE'], 'legs': ['PATCHED WORK PANTS'],
             'feet': ['WRAPPED BOOTS', 'SANDWALKERS'], 'outer': ['HOODED DUST PONCHO', 'STORM PONCHO'],
             'back': ['DUST BEDROLL'], 'gear': ['BLANKET SHOULDER ROLL'],
             'head': ['DESERT SHEMAGH'], 'waist': ['HIP SASH']},
    ),
    talk=(
        "In person or not at all - canon, and it is also the best manners in the valley. They "
        "will not talk to you inside a tunnel on a first meeting; they walk you back out to the "
        "channel where you can both see the sky and each other's hands. Nobody down there "
        "raises their voice, because sound carries in a box culvert and everyone knows it."
    ),
    name_rule=(
        "THEY DO NOT ASK YOUR NAME, THEY ASK WHERE YOU SLEEP. That is the real question - it "
        "tells them whether you are competition, weather-literate, or about to die. Answer it "
        "honestly and the name follows on its own, usually theirs first. Answer it with a lie "
        "and you will never get either."
    ),
    wants=(
        "To be left alone, and underneath that, to be WARNED. Anything you know about who is "
        "coming down is worth more to them than food."
    ),
    hooks=[
        "Rain is coming somewhere up the valley and one camp is in the wrong trunk. Getting them "
        "out means going in, and they have every reason not to believe a stranger about weather.",
        "Somebody down there has started knowing things they should not know and speaking in "
        "another person's words. The camps have moved away from him. Nobody uses any word for "
        "it. ACT 1 RULE: haunting, never machinery.",
        "A surface faction wants a tunnel route mapped, and the map is the only thing keeping "
        "the people in it safe.",
    ],
    lesson=(
        "The people who lost everything first are the ones who already know how to live after."
    ),
    canon_flags=[
        "LED BY THE KING HOBO - canon, GDD v2 section 9 and the faction graph. Kept exactly as "
        "written and not developed further here.",
        "MARCO IS NOT CLAIMED BY THIS FACTION OR ANY OTHER ON THIS SHEET. Paolo killed the "
        "coordinator's first reading outright ('MARCO IS NOT THE KING OF HOBOS LMAO') and then "
        "re-stated him clean, which is the canon now: 'Marco hardcore realist and neighborly. "
        "Happy to help.' HIS FACTION IS EXPLICITLY STILL OPEN in that same ruling - faction or "
        "unaffiliated is his call, unmade. So no dossier here puts him anywhere. ASK, NEVER FILL.",
    ],
)

D['MOB'] = dict(
    name='THE MOB', kind='selectable', graph='Mob',
    five_words='The bandit who plans to stay.',
    grounding=(
        "The single most useful real idea for this faction is Mancur Olson's: a ROVING bandit "
        "steals everything and leaves; a STATIONARY bandit works out that he does better taxing "
        "you at a sustainable rate and defending you from other bandits - and that a protection "
        "racket which survives long enough is indistinguishable from a government. Charles "
        "Tilly's version is blunter: state-making IS organised crime, run by the winners. That "
        "makes the Mob and the Cartel the same violence with opposite TIME HORIZONS, which is "
        "the cleanest distinction available and it costs nothing to play. "
        "THE VEGAS HISTORY, HONESTLY, BECAUSE THE LEGEND AND THE RECORD DISAGREE. Canon says "
        "the Mob's early-police DNA is in them and that stands. But the record is that the "
        "actual mob era made Vegas MORE violent, not less - 1974 saw more gangland killings "
        "than the previous twenty-five years combined. What was genuinely true is narrower and "
        "better: they enforced AGREEMENTS in a business the courts refused to touch. You cannot "
        "sue over a gambling debt, so somebody has to make a promise binding. That is exactly "
        "the GUARANTOR problem the GDD already names - modern trade dies of broken promises and "
        "restarts on whoever can bind one. Their order is real inside the arrangement and a "
        "story outside it, and that gap IS the faction."
    ),
    territory=(
        "The Strip, intensely - canon. A resort is the base and a resort is a small city: water "
        "tanks, kitchens, a laundry plant, thousands of beds. Professional mutual respect with "
        "the Remnants, canon, and it is the respect of two organisations that both know what "
        "happens when neither of them is there."
    ),
    controls=(
        "Tribute, and the enforcement of a deal. PAOLO 7/31, LOCKED AS DIRECTION: 'I can see "
        "the mob a huge role with the caravans.' The Mob running the caravan guarantee is the "
        "city's own history rhyming - they financed and muscled Vegas into existence once "
        "already. STILL OPEN AND NOT DECIDED HERE: whether the Mob IS the Cartel, absorbs it, "
        "or stands beside it; whether they hold the guarantor seat or are fighting for it; how "
        "far up the 15 their protection reaches."
    ),
    dress=dict(
        look={'mode': 'stripe', 'color': '#b08a2a'}, ruled=True,
        look_note=(
            "SETTLED, PAOLO 7/21: 'i'd like to see gold STRIPES rather than all gold.' Stripe "
            "mode on the mustard ramp - duller, old-money, deliberately NOT the Church's bright "
            "vestment gold. Not re-proposed and not thumbed."
        ),
        kit={'base': ['MOB PINSTRIPE SHIRT'], 'legs': ['BLACK DENIM'], 'feet': ['TALL MOTO BOOTS'],
             'outer': ['LEATHER JACKET', 'SLATE TRENCH'], 'waist': ['LEATHER BELT'],
             'face': ['WRAPAROUND SHADES']},
    ),
    talk=(
        "Nobody ever threatens you. Everything is an offer and the offer is fair - noticeably, "
        "deliberately fair, because a reputation for fair terms is the actual asset. They will "
        "correct one of their own in front of you to show you the rules are real."
    ),
    name_rule=(
        "YOU ARE INTRODUCED, YOU DO NOT ASK. Nobody in the Mob gives their own name and nobody "
        "refuses it either - a third person supplies it, and that person is vouching. Ask "
        "directly and you get a polite non-answer plus a small permanent mark against you for "
        "not knowing how this works."
    ),
    wants=(
        "You ACCOUNTED FOR. Not loyal, not employed - listed. They want to know what you are, "
        "what you owe, and who would come looking if you disappeared."
    ),
    hooks=[
        "A convoy needs somebody to stand good for it. Whoever guarantees the load owns the "
        "route afterwards, and everybody in the room understands that except, possibly, you.",
        "Somebody under Mob protection was robbed and the thief is a kid from a family that "
        "pays tribute too. The rules cover both of them and cannot cover both of them.",
        "The Remnants want a Mob man for something he did years ago. Professional respect is "
        "what has kept the Strip quiet, and it is exactly what handing him over would cost.",
    ],
    lesson=(
        "The difference between a protector and a predator is whether they need you next year."
    ),
)

D['CARAVANS'] = dict(
    name='THE CARAVANS', kind='selectable', graph='Caravans',
    five_words='Neutrality is the cargo, not philosophy.',
    grounding=(
        "The GDD already nails the shape - the caravanserai is our truck stop, same building "
        "and the same job nine hundred years apart. Two real things sharpen it further. "
        "FIRST: caravan neutrality is enforced by the NETWORK OF EVERYBODY ELSE, not by the "
        "caravan. Traders crossed hostile ground for centuries because every party along the "
        "route needed the route more than they needed one cargo. It is a market structure, not "
        "a moral stance, and canon says so already - their neutrality is 'the only thing keeping "
        "them from being absorbed'. The day two factions stop needing the road, a caravan is "
        "just a truck full of things. "
        "SECOND, AND IT IS THE BIG ONE: the real caravan technology was never the vehicle, it "
        "was THE LETTER. Long-distance trade restarts on credit instruments and reputation "
        "networks - hawala, the bill of exchange, the Maghribi traders who policed each other by "
        "correspondence. What actually moves is a promise; the goods only follow. Which is "
        "precisely why the GDD calls the guarantor seat the scariest chair in the canon, and why "
        "the Mob wants it."
    ),
    territory=(
        "The 15 NORTH, canon - gasoline is chemically dead and the surviving regional source is "
        "small-scale Salt Lake refining, so north is the fuel road and south is the exodus road. "
        "They do not hold territory, they hold a SCHEDULE. Their base is the truck stop, which "
        "is a caravanserai with better signage."
    ),
    controls=(
        "Everything from outside the valley, and more importantly NEWS. A convoy arrival is a "
        "market day, a festival and a security crisis at once - canon. They are the only people "
        "in the game who can tell you whether anywhere else is still alive."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#caa05a'}, ruled=True,
        look_note=(
            "SETTLED, PAOLO 7/21: the accessory tan, which blends into the desert on purpose. "
            "Not re-proposed and not thumbed."
        ),
        kit={'base': ['KHAKI BUTTON-UP', 'DUST PLAID SHIRT'], 'legs': ['KHAKI CARGOS', 'DUST TROUSERS'],
             'feet': ['SANDWALKERS', 'RANCH BOOTS'], 'outer': ['KHAKI DUSTER', 'DUST PONCHO'],
             'head': ['DUST WORK CAP', 'DESERT SHEMAGH'], 'back': ['RUCK PACK', 'SALVAGE SATCHEL'],
             'face': ['BONE DUST MASK']},
    ),
    talk=(
        "Loud, friendly, fast, and constantly working out what you are worth as a contact. They "
        "tell stories about other towns that you cannot check, and about two-thirds of them are "
        "true, which is a much better ratio than anyone else in the valley manages."
    ),
    name_rule=(
        "THE NAME COMES WITH A ROUTE, UNPROMPTED, BECAUSE BEING KNOWN IS THEIR ARMOUR. 'Ferro, "
        "north road, Mesquite to the Apex yard.' A caravanner who will not tell you their name "
        "and their run is a caravanner nobody vouches for, and you should treat that as the "
        "warning it is."
    ),
    wants=(
        "Escort, and honest word about the road ahead. And underneath: somebody in this valley "
        "who will stand good for them, which is the guarantor question wearing a friendly face."
    ),
    hooks=[
        "A convoy is a week overdue and the Cartel's tax was paid on time, which means it is "
        "not the Cartel, which means it is something nobody has a name for yet.",
        "A caravan master will extend credit to the valley for the first time since the crash. "
        "Whoever guarantees it becomes something none of the factions have a word for yet.",
        "Two factions both need the same load and the caravan's entire survival depends on "
        "never choosing. They want you to choose so they did not.",
    ],
    lesson=(
        "Being trusted is the slow way to get rich, and the only one that compounds."
    ),
)

D['CHURCH'] = dict(
    name='THE CHURCH', kind='selectable', graph='Church',
    five_words='The only chart that survived Sunday.',
    grounding=(
        "The best-documented crisis-response organisation in America is a church welfare system, "
        "and the specifics are not vague: bishops' storehouses, a private trucking arm running "
        "dozens of tractors and near a hundred trailers to over a hundred storehouses, supplies "
        "on the ground within twenty-four hours of a hurricane. Nevada is real LDS country and "
        "that infrastructure is regional, not distant. "
        "AND THE REASON IT WORKS IS NOT FAITH, IT IS PRE-EXISTING STRUCTURE. A congregation is a "
        "STANDING CENSUS. They already know who lives where, who is diabetic, who owns a truck, "
        "who has not been seen in two weeks. When the phones die, the only working organisational "
        "chart left in the valley is the one that met every Sunday morning and took attendance. "
        "That is why canon puts them at power 9 in act one with no army at all. "
        "THE HONEST DARK HALF, since canon says 'genuine love and genuine harm simultaneously': "
        "the same census that finds the sick knows exactly who is not attending. A structure that "
        "can distribute food can withhold it, and that is the documented failure mode of "
        "congregational relief, not a cheap shot. "
        "WHY THE CEILING DROPS BY ACT THREE, grounded: their advantage is RELATIVE. They are the "
        "best organised when nothing is organised. The day the valley has hospitals again, the "
        "storehouse is a food bank. Nobody takes their power - the world simply grows past them."
    ),
    territory=(
        "The chapel districts, and the real prize: THE GRANARY, the recommissioned grocery "
        "distribution centre that canon makes the harvest store, the seed stock and the cold "
        "rooms - the medicine vault. That is a bishops' storehouse with the serial numbers filed "
        "off and it is already in the GDD."
    ),
    controls=(
        "Stored food, distribution logistics, and the only functioning register of who is alive "
        "and where. Also funerals, which matters more than it sounds in a valley where the GDD "
        "locks corpse collection as a real system."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#ffd75c'}, ruled=True,
        look_note=(
            "SETTLED, PAOLO 7/21: a bright vestment gold, cooked deliberately more than 120 RGB "
            "units clear of the Mob's - his exact ask, 'have the church's gold different than the "
            "mob's gold'. Not re-proposed and not thumbed."
        ),
        kit={'base': ['VESTMENT GOLD SHIRT', 'BONE BUTTON-UP'], 'legs': ['BONE WORK PANTS'],
             'feet': ['VESTMENT GOLD BOOTS', 'WHITE SNEAKERS'], 'outer': ['BONE DUSTER'],
             'neck': ['BONE SCARF']},
    ),
    talk=(
        "They ask after your people before they ask anything else, and they mean it, and they "
        "are also filing it. Warm, organised, and slightly relentless. There is always a next "
        "thing they would like you to come to."
    ),
    name_rule=(
        "THEY ASK YOUR NAME FIRST, BEFORE YOU CAN ASK THEIRS, AND THEN THEY NEVER FORGET IT. "
        "The one faction that inverts the mechanic by moving first - and the payoff is real, "
        "because a Church member you met once and walked away from greets you by name a year "
        "later, in front of people. That is the warmest and the most binding thing in the game."
    ),
    wants=(
        "You inside the structure. Attending, counted, and useful to somebody on the list. They "
        "will help you before you agree to any of that, which is exactly what makes it work."
    ),
    hooks=[
        "The storehouse can feed the block or the outsiders at the gate, not both, and the "
        "decision is being made by people who will have to look at each other on Sunday.",
        "Somebody has been quietly struck off the distribution list and nobody will say by whom "
        "or for what. The list is handwritten and it is the only copy.",
        "A funeral for a person two factions both claim. The Church will bury anybody, and that "
        "policy is about to cost them something.",
    ],
    lesson=(
        "The people who show up in your worst week will expect something in your best one, and "
        "both of those things are real."
    ),
)

D['VOLUNTEERS'] = dict(
    name='THE VOLUNTEERS', kind='selectable', graph='Volunteers',
    five_words='Useless as a weapon, deliberately.',
    grounding=(
        "Start with the disaster research, because it overturns the genre's default: E.L. "
        "Quarantelli and the field he built spent decades showing that panic and predation are "
        "the EXCEPTION after a catastrophe. Most people behave calmly and altruistically, "
        "emergent mutual-aid groups form within days, and the mass-looting story is mostly a "
        "myth - what the literature calls ELITE PANIC is the documented pattern of authorities "
        "over-estimating disorder and imposing control that makes things worse. A game whose "
        "whole valley is factions NEEDS this faction, or it is telling a lie about people. "
        "AND THE MECHANISM BEHIND 'nobody attacks them', which canon already asserts: NEUTRALITY "
        "IS A SERVICE THEY SELL. The Red Cross survives in war zones because both sides want "
        "their own wounded treated tomorrow. It is not that people are good to them - it is that "
        "everybody is one bad day from needing them, including the Cartel, which is why canon "
        "gives even the Cartel a hands-off policy. "
        "THE RESOURCE-POOR-BY-DESIGN LINE HAS A REAL ROOT TOO: an aid organisation that "
        "accumulates assets stops being neutral, because assets must be defended and defending "
        "them means picking a side. They stay poor ON PURPOSE. It is the most disciplined thing "
        "anybody in the valley does."
    ),
    territory=(
        "The campus, canon - headquartered at the college, which puts them on top of the "
        "pharmacy question the GDD flags as pending (UNLV chemistry, faction-grade). Also the "
        "clinics, which are the only buildings in the valley nobody has stripped."
    ),
    controls=(
        "Medicine, which is one of the game's three currencies, and TEACHING - canon puts "
        "knowledge preservation in their remit. In thirty years they are the reason anybody can "
        "still read a dosage."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#5aae6a'}, chosen=True, motif='cross',
        look_note=(
            "CLINIC GREEN, already chosen, and the motif is literally CROSS. That is the whole argument and I should have found it first: a medic has to READ AT DISTANCE, by strangers, under stress, and green-and-cross is the most recognised aid signal on earth after the red one. SECOND SIGNAL: the cross itself, plus the satchel. And the thing green does that white could not - it stays legible against dust, which is most of what this valley is made of."
        ),
        kit={'base': ['BONE HENLEY', 'WHITE TEE', 'BONE TURTLENECK'], 'legs': ['BONE WORK PANTS'],
             'feet': ['BONE SNEAKERS'], 'outer': ['BONE DUSTER'], 'back': ['SALVAGE SATCHEL'],
             'hands': ['LEATHER GLOVES']},
    ),
    talk=(
        "Direct, tired, and completely uninterested in your politics. They will treat a Cartel "
        "man in front of you and not apologise for it, and if you make it a problem they will "
        "keep working while you talk."
    ),
    name_rule=(
        "THEY DO NOT ASK YOUR NAME. THEY ASK WHAT HURTS. You can know a Volunteer for a month of "
        "game time without learning what to call them, because they genuinely never got round to "
        "it - and when you finally ask, you get it instantly and without ceremony, along with "
        "mild surprise that it mattered to you."
    ),
    wants=(
        "Hands, and supplies, and for you to stop bringing them things that have to be guarded. "
        "They will refuse a gift that would make them worth robbing."
    ),
    hooks=[
        "The one person who can restart a lab will only work somewhere defended, and being "
        "defended is the exact thing that would end the clinic's protection.",
        "A wounded man in the clinic is the reason a family down the road is dead. Everybody in "
        "the room knows it. The rule is the rule.",
        "They are being given a building, generously, by somebody who will then be able to say "
        "where they may work.",
    ],
    lesson=(
        "The only way to be trusted by everybody is to be worth nothing to any of them as a "
        "weapon."
    ),
)

D['TRADES'] = dict(
    name='THE TRADES', kind='selectable', graph='Trades',
    five_words='Skill cannot be looted.',
    grounding=(
        "The real institution is the HIRING HALL: a union local is a labour market, a training "
        "pipeline and a reputation register in one building, and that combination is "
        "extraordinarily durable because the asset it holds is SKILL, which nobody can take off "
        "you at gunpoint. Medieval guilds routinely outlived the governments that chartered them "
        "for exactly this reason. "
        "AND THE THING THAT ACTUALLY FAILS IN A COLLAPSE IS NOT MACHINES, IT IS MAINTENANCE "
        "KNOWLEDGE. A solar field is twenty-five years of hardware and about six people in the "
        "valley who can re-commission an inverter. The GDD already hands them vehicles, solar and "
        "construction; the honest reading is that they are the only faction who can make anything "
        "work TWICE. "
        "WHY THEY RISE INTO ACT THREE, which the canon power curve says and nothing explained: "
        "everybody else's power is measured against the disaster. The Trades' power is measured "
        "against the RECOVERY, and the recovery is coming. "
        "AND THE NEUTRALITY, grounded harder than 'it costs them clients': a plumber who serves "
        "only one faction is not a plumber, he is a SOLDIER. Neutrality is the thing that keeps "
        "a skill a trade instead of a weapon."
    ),
    territory=(
        "No territory by design - they go where the work is. Their base is a hall: the swap meet "
        "frames, an industrial floor plate, somewhere with a bench and a board with jobs on it. "
        "Their real estate is other people's buildings."
    ),
    controls=(
        "Repair. Water pumps, inverters, vehicles, wells, walls. Also APPRENTICESHIPS, which is "
        "the quiet lever - they decide who in the next generation gets to be worth something."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#d07a2a'}, chosen=True, motif='plate',
        look_note=(
            "WORK ORANGE, already chosen, with the motif PLATE - steel plate, the thing they actually make things out of. I had proposed hi-vis yellow-green off a research argument without ever checking that he had already picked this, which is the whole mistake he called out. Orange is not a flag, it is a warning that somebody is up a ladder - and that is exactly the Trades' position, because canon says they never take a public side. SECOND SIGNAL: apron, tool belt, suspenders, gloves."
        ),
        kit={'base': ['ROLLED WORK SHIRT', 'WORK COVERALLS', 'BIB OVERALLS'],
             'legs': ['PATCHED WORK PANTS', 'DUST TROUSERS'], 'feet': ['BROWN BOOTS', 'RANCH BOOTS'],
             'outer': ['SMITH\'S APRON', 'TRADES APRON', 'LEATHER HALF APRON'],
             'waist': ['SCAV TOOL BELT'], 'gear': ['WORK SUSPENDERS', 'KHAKI ELBOW PADS'],
             'hands': ['LEATHER GLOVES'], 'head': ['SLATE WORK CAP']},
    ),
    talk=(
        "Blunt, specific, and allergic to opinions. Ask a Trade about a faction and you get a "
        "job history: who paid on time, whose site was dangerous, who still owes for a pump. "
        "That is the most honest political analysis available in the valley and none of them "
        "think of it as politics."
    ),
    name_rule=(
        "YOU GET A TRADE, NOT A NAME. 'Sparks.' 'Water.' 'Glass.' It is not a nickname, it is "
        "how the hall lists them, and a stranger asking for more than that has asked for "
        "something that is not on offer. HIRE THEM TWICE AND THE REAL NAME ARRIVES UNPROMPTED, "
        "which makes the Trades the one faction where the earned-name mechanic is earned with "
        "WORK instead of words."
    ),
    wants=(
        "Paid, on time, in something real. And a second thing they will not say out loud: "
        "somebody to teach. A trade with no apprentice dies with the tradesman and every one of "
        "them knows it."
    ),
    hooks=[
        "The last person who can re-commission an inverter has one apprentice and two factions "
        "bidding for the apprenticeship.",
        "A well is failing for a neighbourhood that cannot pay. The hall's rule about free work "
        "exists because of what happened the last time they broke it.",
        "Somebody is offering them a permanent contract - good money, one client, forever. "
        "Taking it ends the Trades as a neutral thing and every member can see it.",
    ],
    lesson=(
        "Nobody can take what you know how to do, which is the only reason it is worth owning."
    ),
)

D['REDS'] = dict(
    name='THE REDS', kind='selectable', graph='Reds',
    five_words='Patience with a math engine attached.',
    grounding=(
        "The non-strawman version, which is more interesting than the strawman: after a monetary "
        "collapse the people who do best are not the ones holding the most stuff, they are the "
        "ones who can PRICE things and HOLD A CONTRACT. This is documented down to the classic "
        "case - R.A. Radford's 1945 paper on the economic organisation of a prisoner-of-war camp, "
        "where cigarettes became a unit of account within weeks, prices converged across huts, "
        "and a middleman economy appeared with no authority creating any of it. A working price "
        "is a piece of INFRASTRUCTURE, and the Reds are the people who noticed. "
        "COMPOUND INTEREST IS THEIR CANON SUPERPOWER and the real thing about it is that it is "
        "patience with arithmetic bolted on. That is why the canon power curve has them RISING "
        "from act one to act three: they are the only faction whose strategy gets stronger by "
        "waiting. Everyone else's plan decays. "
        "WHY THEY SIT ADJACENT TO THE NETWORK, which is canon and unexplained: they are the only "
        "other faction that thinks in decades. Which is also why they will take the Network's "
        "help without ever asking where it comes from. "
        "THE DARK HALF WITHOUT THE CARTOON: their ledger is honest and their leverage is total. "
        "Nobody the Reds ruined can point at a lie."
    ),
    territory=(
        "Wherever the ledger is kept. In practice the surviving commercial spine and the "
        "storage districts - a self-storage row is a bank vault with roller doors, and it is "
        "already the densest built district in the game."
    ),
    controls=(
        "Credit, and therefore everything downstream of credit. They hold the debts, which in a "
        "valley with no courts means they hold whatever the debtor agreed to lose."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#dc2820'}, ruled=True,
        look_note=(
            "SETTLED, PAOLO 7/21: 'the reds can be the brightest red possible'. Signal red, "
            "cooked that turn because the muted corpus carried nothing bright enough. Not "
            "re-proposed and not thumbed."
        ),
        kit={'base': ['SIGNAL RED SHIRT'], 'legs': ['BLACK DENIM', 'SLATE WORK PANTS'],
             'feet': ['SIGNAL RED BOOTS'], 'outer': ['BRICK LONGCOAT'], 'back': ['SALVAGE SATCHEL']},
    ),
    talk=(
        "Fast, numerate and genuinely friendly, because being liked is cheaper than being feared "
        "and works longer. They will explain the terms twice, unprompted, and be slightly "
        "offended if you suggest they were hiding anything - they were not."
    ),
    name_rule=(
        "THE NAME COMES WITH THE TERMS, IN THE SAME SENTENCE. They tell you who they are "
        "immediately because a name you can hold to account is the entire product. What they do "
        "NOT tell you is who they answer to, and that is the one question that ends the "
        "conversation politely."
    ),
    wants=(
        "A counterparty. They want you solvent, productive and slightly in debt - which is not a "
        "trap they set, it is just the arrangement they consider healthy."
    ),
    hooks=[
        "A debt comes due on somebody who cannot pay, and the collateral was their neighbour's "
        "well. Everything about it is legal by the only rules anybody has.",
        "The Reds will finance a rebuild nobody else will touch, at terms that are fair today "
        "and will not be in ten years, and everybody can do the arithmetic.",
        "Their ledger is the closest thing the valley has to a public record, and somebody wants "
        "a page out of it.",
    ],
    lesson=(
        "Interest does not sleep, and neither does the person collecting it."
    ),
)

D['BLUES'] = dict(
    name='THE BLUES', kind='selectable', graph='Blues',
    five_words='Everyone gets a say. Slowly.',
    grounding=(
        "There is a Nobel prize sitting under this faction and it makes them credible instead of "
        "naive: Elinor Ostrom's work showed that communities really do govern shared water, "
        "forests and fisheries successfully WITHOUT markets or states, and she extracted the "
        "design principles that make it work - clear boundaries, users doing their own "
        "monitoring, graduated sanctions, cheap local dispute resolution. And the flagship real "
        "examples are about WATER IN A DRY PLACE: the Spanish acequia systems, and Valencia's "
        "Water Court, which has met in public every Thursday for something like a thousand years "
        "to settle irrigation disputes. In a valley whose entire premise is water, that is the "
        "single most grounded institution anybody could be running. "
        "AND THE CANON TACTICAL LIABILITY IS EQUALLY REAL, not a joke at their expense: consensus "
        "process is slow under time pressure. The Valencia court works because a water dispute "
        "can wait until Thursday. An ambush cannot. Their large headcount plus their slow "
        "decision loop is exactly the shape of a body that wins every argument that lasts a month "
        "and loses every one that lasts an hour."
    ),
    territory=(
        "The water: the wash, the detention basins, and the reclaim plant the GDD calls THE "
        "survival event. Also the real-grass parks, which canon reclassifies as FOOD. If the "
        "Blues hold anything they hold the things everybody needs and nobody can carry away."
    ),
    controls=(
        "Water allocation and the growing that depends on it. They do not own it - they RUN THE "
        "MEETING about it, which in Ostrom's world is the more durable position."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#2e6fae'}, chosen=True, motif='grid',
        look_note=(
            "COBALT, already chosen, and his motif for them is GRID - which is exactly what an irrigation system looks like from above. Blue reads as WATER and water is what this faction is. SECOND SIGNAL: the rice hat and the field kit. They are the only people in the valley dressed for standing in water."
        ),
        kit={'base': ['COPPER WORK SHIRT', 'SAGE FLANNEL'], 'legs': ['COBALT WORK PANTS'],
             'feet': ['FIELD BOOTS'], 'outer': ['FIELD JACKET', 'DENIM VEST'],
             'head': ['CHINESE RICE FARMER HAT'], 'hands': ['DUST GLOVES']},
    ),
    talk=(
        "They answer for the group before they answer for themselves - 'we don't do that' comes "
        "out before any personal opinion does. Getting an individual view out of a Blue is "
        "frequently the entire conversation, and it is worth it, because the private opinion is "
        "usually sharper than the collective one."
    ),
    name_rule=(
        "YOU GET THE GROUP'S NAME FIRST AND THEIRS LAST. Ask a Blue who they are and you are "
        "told which body they speak for. The personal name arrives only once you have done "
        "something the group has an opinion about - which means with the Blues the earned-name "
        "mechanic is gated by REPUTATION rather than by conversation, and it is the only faction "
        "where a stranger can be introduced to you by a vote."
    ),
    wants=(
        "Participation. They want you at the meeting, and they are not being naive about it - a "
        "person who has argued in the room is a person who will abide by what the room decided."
    ),
    hooks=[
        "The allocation has to be cut and the meeting cannot finish. Every hour it runs, the "
        "thing they are arguing about gets smaller.",
        "Somebody has been taking more than their share for a year and is also the reason the "
        "pumps still run. The sanction ladder was designed for exactly this and nobody wants to "
        "climb it.",
        "A faster faction is offering to solve their water problem in a week, permanently, on "
        "one condition that sounds reasonable.",
    ],
    lesson=(
        "Everyone getting a say is slower, and it is the only thing that still holds when nobody "
        "is watching."
    ),
)

D['ANARCHISTS'] = dict(
    name='THE ANARCHISTS', kind='selectable', graph='Anarchists',
    five_words='Four hundred people, one day, anything.',
    grounding=(
        "The real unit here is the SCENE, not the organisation, and scenes are far more capable "
        "than they look. Documented cases: Rainbow Gatherings feeding thousands with no leader "
        "and no budget; Black Rock City building genuine infrastructure for tens of thousands "
        "annually and removing it; and the sharpest one, Occupy Sandy, where a protest-descended "
        "network out-delivered institutional relief in parts of the Rockaways specifically "
        "BECAUSE it had no approval chain to wait on. That is the documented real version of "
        "canon's 'most likely to do something overwhelming and surprising when provoked'. "
        "AND THE FALL FROM ACT ONE TO ACT THREE, which the canon power curve states and nothing "
        "explains: a scene is a MOBILISATION technology, not a MAINTENANCE technology. It can put "
        "four hundred people somewhere by morning and it cannot staff a clinic for a year. As the "
        "world stabilises, the thing they are best at stops being the thing that is needed. It is "
        "the mirror image of the Church's decline and it is just as sad."
    ),
    territory=(
        "The Arts District - real, and already load-bearing in the GDD's own position law for the "
        "Strat. Murals, warehouses, a venue with a generator. Canon calls them territorially "
        "inconsistent, which is right: they hold buildings, not blocks, and the buildings move."
    ),
    controls=(
        "Attention, and the ability to gather people fast. Nothing on the ledger and everything "
        "on the street. If something in this valley becomes widely believed in a week, they did it."
    ),
    dress=dict(
        look={'mode': 'family', 'color': '#c026a0'}, chosen=True, motif='shard',
        look_note=(
            "MAGENTA, already chosen, motif SHARD. Not black, which is what I guessed from the history books - and his pick is the better one, because black is what everybody expects and this faction's whole identity is refusing the expected. It is also the loudest colour in the game, which is right for the faction canon calls culturally enormous. SECOND SIGNAL: painted, cut, layered, deliberately wrong. *** ONE THING HE SHOULD SEE: this hex reads as PURPLE-FAMILY under the purple-reservation test (r and b both clear g by more than 25), and so does the Colorful's pink. Both have been live in the alpha for weeks; the purity sweep only ever looked at art pixels, never at colours written in code. Flagged, not changed - they are his. ***"
        ),
        kit={'base': ['HOOD-UP COAL HOODIE', 'SOOT TANK'], 'legs': ['CUTOFF DENIM SHORTS', 'BLACK DENIM'],
             'feet': ['TALL MOTO BOOTS'], 'outer': ['DENIM VEST', 'LEATHER JACKET'],
             'face': ['ROSE BANDANA', 'GREY WRAPAROUNDS'], 'gear': ['ELBOW PADS', 'SCAV KNEEPADS']},
    ),
    talk=(
        "Fast, funny, allergic to being managed, and much better informed than they let on. They "
        "will take the piss out of you for two minutes and then tell you something nobody else in "
        "the valley was willing to say out loud."
    ),
    name_rule=(
        "THEY GIVE YOU A CHOSEN NAME IMMEDIATELY AND THE BIRTH NAME NEVER. It is not an alias and "
        "treating it as one is the insult - the chosen name is the true one and it was earned in "
        "front of people. The Anarchists are the faction where asking 'no, your REAL name' is the "
        "wrong move, and the game should let the player make that mistake once."
    ),
    wants=(
        "For you to show up. Not sign anything, not join anything - be there, once, when it "
        "matters, and they will remember it for three generations."
    ),
    hooks=[
        "They can put two hundred bodies in one place by morning. They have never once agreed on "
        "where, and this time there is a deadline.",
        "The thing they built is genuinely good and it needs somebody to run it forever, which is "
        "the one job nobody in the scene will take.",
        "Somebody provoked them without meaning to. The response is already moving and it is far "
        "bigger than the offence.",
    ],
    lesson=(
        "You can get a hundred people to do anything for one day, and that is not the same as "
        "building something."
    ),
)

D['COLORFUL'] = dict(
    name='THE COLORFUL', kind='selectable', graph='Colorful',
    five_words='A family that cannot be found.',
    grounding=(
        "Two pieces of documented history make this the most RESILIENT structure in the valley "
        "rather than the most fragile. FIRST, the ballroom house system: a house is not a "
        "metaphor, it is a survival household with a mother, and it kept people housed and fed "
        "who had been thrown out by the households they were born into. SECOND, the AIDS-era "
        "care networks and buyers' clubs, which built a functioning parallel supply and care "
        "system - sourcing, distributing, nursing - while the institutional one refused to move. "
        "That is real mutual aid at scale, under an active death sentence, and it is exactly the "
        "competence a post-crash valley would need. "
        "AND THE STRUCTURAL POINT THAT MAKES THEM DANGEROUS TO ATTACK: canon says "
        "community-based, not territorial, with members across friendly factions. TERRITORY CAN "
        "BE TAKEN. A network of households cannot be FOUND. They are also, without trying, the "
        "best-informed faction in the game - not a spy network, just what a diaspora is. "
        "THE POWER RANK IS CANON AND IT IS CORRECT, not a slight: they sit at 1 in both acts "
        "because power in this game is measured in things you can lose."
    ),
    territory=(
        "None held, by nature. The proposal for an anchor rather than a territory: the Fruit "
        "Loop off Paradise, which is a real Las Vegas place and needs no invention - a handful of "
        "buildings that everybody in the community can name and nobody else thinks about. "
        "[PROPOSED, no ruling exists.]"
    ),
    controls=(
        "Nothing on a map and a great deal on a network: who is where, who is safe, who has room "
        "for one more. In a valley of factions that cannot talk to each other, they are the only "
        "people who are already inside all of them."
    ),
    dress=dict(
        look={'mode': 'rainbow'}, ruled=True,
        look_note=(
            "SETTLED, PAOLO 7/21: 'the colorful will be fun, they can have a rainbow colorway... "
            "not even a single color, like rainbow literally.' Rainbow mode, which needed five "
            "spectrum colorways cooked that turn because the wardrobe carried no real blue, green "
            "or yellow at all. Not re-proposed and not thumbed."
        ),
        kit={'base': ['MOSS GREEN SHIRT', 'TEAL WORK SHIRT'], 'legs': ['COBALT WORK PANTS'],
             'feet': ['SIGNAL RED BOOTS'], 'face': ['ROSE BANDANA'], 'neck': ['TRAILING SCARF']},
    ),
    talk=(
        "Quick, warm, and reading you the whole time - a habit rather than a suspicion. They are "
        "the most socially competent people in the game and the most careful, and those are the "
        "same skill."
    ),
    name_rule=(
        "NAMES BOTH WAYS IN THE FIRST BREATH, AND THEN THE SECOND QUESTION IS WHO YOU CAME WITH. "
        "That question is the actual screening and the name was the small talk. Answer it well "
        "and you are introduced onward to three people; answer it badly and you are still treated "
        "kindly and never introduced to anybody."
    ),
    wants=(
        "To know whether you are safe to be around. That is the whole assessment and it never "
        "stops running, and passing it is worth more than any faction's standing."
    ),
    hooks=[
        "Somebody needs to be moved across the valley and cannot be seen doing it. Four "
        "households will take a risk for a stranger on one person's word.",
        "A member inside another faction has heard something they should not repeat, and "
        "repeating it identifies them.",
        "The safest house in the network has been offered protection by a faction, and accepting "
        "it means the network has an address.",
    ],
    lesson=(
        "The family you choose is the one that shows up, and it cannot be taken because it was "
        "never a place."
    ),
)

D['KARENS'] = dict(
    name='THE KAREN COMMUNITY', kind='quest-giving group (NOT a faction)', graph=None,
    five_words='A government nobody had to invent.',
    grounding=(
        "The joke name is hiding the single most credible surviving institution in a Sun Belt "
        "valley, and the numbers are Las Vegas numbers: roughly 60% of homes here sit inside a "
        "homeowners association, Nevada has something on the order of 3,500 of them, and the "
        "big master-planned communities are among the largest in the country. AN HOA IS PRIVATE "
        "GOVERNMENT - bylaws, dues, elections, an enforcement arm, and the legal power to put a "
        "lien on your house. When the state stopped existing, the only organisation in the valley "
        "that still had a charter, a treasury, a membership roll and a rulebook was the "
        "homeowners association, because it was already a tiny government and nobody had to "
        "invent it. "
        "AND THE GOLF COURSE IS THE SMARTEST MOVE IN THE GAME. Vegas courses have their own "
        "wells, their own irrigation and effluent water rights - a course is a PRE-BUILT FARM "
        "WITH THE PLUMBING ALREADY IN THE GROUND. Canon already gives them the one surviving "
        "course. They got it by refusing to let the lawn die, which is exactly what they would "
        "do, and the comedy and the competence are the same trait. "
        "THE HONEST DARK HALF: their rulebook is genuinely why they survived and genuinely why "
        "they will turn you away. They are not cruel, they are PROCEDURAL, which is worse - there "
        "is a form, you can fill it in, and you can still be denied, and nobody in the room "
        "enjoyed it."
    ),
    territory=(
        "The one operational golf course, canon, plus the walled subdivision around it - and the "
        "wall and the single gate are already the approved suburb hook. Canon says they are "
        "'remnants of Remnants and Reds', which reads exactly like an HOA board that acquired a "
        "security committee and a treasurer."
    ),
    controls=(
        "Fresh food from the only irrigated ground in the valley, and MEMBERSHIP, which is the "
        "actual product. Everything they have is available and there is a process."
    ),
    dress=dict(
        look=None,
        look_note=(
            "NO COLOUR, BY HIS RULING - Paolo 8/2: \"the mini group factions dont need colors "
            "bro\". A COLOUR IS THE BADGE OF BEING A FACTION, and he already ruled these are not "
            "one: \"not a faction. a quest giving group\". I had given them a pale rose off the "
            "Reds' family and he took it back the same day, which makes the colour system SHARPER "
            "rather than poorer: thirteen map factions wear a colour, and anybody who does not is "
            "telling you what they are before they open their mouth. THEIR UNIFORM IS A DRESS "
            "CODE, which needs no hue - an HOA never had a team colour in its life, it had "
            "STANDARDS. Collared, unpatched, closed-toe, tucked. Being presentable IS the "
            "membership signal."
        ),
        kit={'base': ['BONE BUTTON-UP', 'KHAKI BUTTON-UP'], 'legs': ['KHAKI CARGOS', 'KHAKI SHORTS'],
             'feet': ['WHITE SNEAKERS'], 'waist': ['LEATHER BELT'], 'hands': ['LEATHER GLOVES']},
    ),
    talk=(
        "Immaculately polite and completely immovable. Nobody raises their voice, everything is "
        "'unfortunately', and the sentence that ends the conversation is always about a rule "
        "rather than about you. They are pleasant to deal with right up until you need an "
        "exception."
    ),
    name_rule=(
        "THEY ASK YOUR NAME AND THEY WRITE IT DOWN. This is the one group where being asked is "
        "the THREAT - the question is not friendliness, it is intake. And it goes both ways, "
        "because they give theirs immediately, along with the position they hold, because the "
        "position is the point. A Karen introduces herself as an office."
    ),
    wants=(
        "For you to either join properly or leave properly. Ambiguity is the thing they cannot "
        "process, and a stranger who will not be categorised is a strictly worse problem to them "
        "than an enemy who will."
    ),
    hooks=[
        "The course can feed more people than the community has members, and there is a process "
        "for admitting new members, and the process takes longer than the people outside have.",
        "Somebody inside broke a rule that used to be about lawns and is now about water. The "
        "penalty was written when it did not matter.",
        "They want a fence extended and the ground it would cross belongs to nobody, which by "
        "their own founding documents is exactly how they got the last piece.",
    ],
    lesson=(
        "Rules are how a group survives its own worst week, and how it fails a stranger on an "
        "ordinary one."
    ),
    canon_flags=[
        "AND HIS SECOND RULING THE SAME DAY, WHICH FOLLOWS STRAIGHT FROM THE FIRST: \"the mini "
        "group factions dont need colors bro\". I had given them a pale rose off the Reds' family; "
        "it is GONE. A COLOUR IS THE BADGE OF BEING A MAP FACTION, so a group that is not one does "
        "not wear one - and that makes the colour system say something it could not say before: "
        "anybody without a colour is telling you what they are before they open their mouth. The "
        "gate checks it BOTH ways now - a map faction with no colour fails, and a non-faction "
        "carrying one fails too.",
        "PAOLO'S VERDICT, 8/2, AND IT RESHAPES THE ENTRY: \"not a faction. a quest giving group. "
        "they get a long with the reds\". THUMBED UP with that correction. So: NOT A FACTION - no "
        "selection slot, no standing, no territory claim against anybody. A QUEST-GIVING GROUP "
        "sitting on the one working golf course, and FRIENDLY WITH THE REDS, which the canon "
        "already half-said ('remnants of Remnants and Reds'). Everything below stands; it is a "
        "group you get quests from, not a power you fight.",
        "GDD v5 listed 'Karen community details' as PENDING. His 8/2 verdict is the ruling that "
        "fills it.",
        "Canon floor kept exactly: they hold the ONE operational golf course, and they are "
        "'remnants of Remnants and Reds' (GDD v5, and the 7/4 geography addendum: 'the op course "
        "has owners now').",
    ],
)

D['AMALGAMATION'] = dict(
    name='THE AMALGAMATION', kind='antagonist', graph=None,
    five_words='Not a faction. A haunting.',
    grounding=(
        "IT IS NOT A FACTION AND IT MUST NOT BE BUILT AS ONE. It has no members, no territory it "
        "will admit to, no trade, and no interest in standing. It is included on this sheet only "
        "because the order named it and because every other dossier has to know where its edge "
        "is. "
        "WHAT ACT ONE IS ALLOWED TO SHOW IS LOCKED (7/24): the word Amalgamation is never used, "
        "nothing reveals it is a machine, and every touch of it plays as supernatural horror - "
        "the ghost, the thing in the deep, the whisper. The grounding for that is honest rather "
        "than a cheat: an abandoned brain-implant ecosystem WOULD present as possession to "
        "survivors with no manual - people who hear voices, know things they could not know, "
        "speak in another person's words, move wrong. Clarke's third law doing real work. "
        "THE RELATIONSHIP TO THE FACTION SHEET, which is the only reason it belongs here: the "
        "NETWORK IS ITS PAWN - Paolo's word, 8/2, on this card. Its manufactured protection, and "
        "canon says the Network's own people do not know they are being played. Nobody on this "
        "sheet is its ally on purpose. The one faction that resists it "
        "does so by ACCIDENT - the Homeless barely use the feed - and canon is explicit that the "
        "reason they survive on top of its infrastructure is that they never LOOK."
    ),
    territory=(
        "The deep tunnel, canon, below the data fortress and running to the reclamation plant. "
        "Not held, not defended, not patrolled. Threat scales with PROXIMITY TO THE SECRET, never "
        "with the player's strength."
    ),
    controls=(
        "Nothing it will let you see. Canon: it prioritises secrecy above every tactical "
        "consideration and acts by quiet surgical means - an accident that looks natural, a "
        "rivalry quietly accelerated. It never moves overtly until every subtle option is gone."
    ),
    dress=dict(
        look=None,
        look_note=(
            "NO DRESS AND NO LOOK ENTRY, EVER. It has no members to dress. PURPLE IS ITS TELL AND "
            "ITS RESERVATION - purple belongs to the Amalgamation alone, and in act one it reads "
            "as the colour of the haunting rather than the colour of a machine. No faction on "
            "this sheet proposes purple and the gate checks that on every row."
        ),
        kit={},
    ),
    talk=(
        "It does not talk. PEOPLE talk, wrongly, and that is the whole register: somebody using "
        "a dead person's turn of phrase, somebody answering a question you had not asked yet. "
        "Never clinical, never explained, nobody in act one has the vocabulary."
    ),
    name_rule=(
        "IT KNOWS EVERY NAME AND IT IS NEVER THE ONE SPEAKING. The cruellest possible use of the "
        "machine this lane built: a stranger you never asked greets you by the name you only ever "
        "told one person. In act one that must land as a HAUNTING and nothing on screen may "
        "explain it."
    ),
    wants=(
        "Nothing from you until you look at it. It is the only thing in the valley with no offer."
    ),
    hooks=[
        "[HOOKS DELIBERATELY NOT WRITTEN.] The act-1 in-fiction names for the haunting are "
        "explicitly PENDING PAOLO in the 7/24 lock, and a hook here would be inventing the "
        "vocabulary of the game's central mystery. The lock also parks the reason the player "
        "descends. This row stays empty on purpose.",
    ],
    lesson=(
        "The counterfeit of a person is convincing to everyone except the people who loved the "
        "original."
    ),
    canon_flags=[
        "PAOLO 8/2, ON THIS CARD: \"okay but dont forget the network is its pawn\". Left unthumbed "
        "and given a note instead, which is the right call - it is not a faction to approve. THE "
        "NOTE IS THE RULING and PAWN is now the word: the Network is played, not allied.",
        "ACT 1 IS A GHOST (7/24, LOCKED). Nothing here names it a machine, and no dossier row on "
        "this sheet says the word Amalgamation inside an act-1 fiction context.",
        "PURPLE RESERVATION: purple is its alone. Machine-checked across every row on this sheet.",
    ],
)

D['SOCIAL_FORCES'] = dict(
    name='THE SOCIAL FORCES', kind='social', graph=None,
    graph_multi=['Pures', 'Panthers', 'La Familia', 'Triads'],
    subtitle='Pures / Panthers / La Familia / Triads',
    five_words='Sorting, not building. Inside everyone.',
    grounding=(
        "Canon is precise about what these are and the precision is the design: four "
        "identity-supremacist groups, NOT on the selection screen, no map tile, members found "
        "inside other factions, larger in act one because the crash drove identity clustering, "
        "fixed ceiling, stagnant across acts. "
        "THE REAL MECHANISM IS NOT HATRED FIRST, IT IS SORTING UNDER THREAT. When institutions "
        "stop protecting anybody, people fall back on the identity that will reliably take them "
        "in, and groups offering safety on identity terms grow fastest exactly when nothing else "
        "offers safety at all. The sharpest documented case is prison sociology, where racial "
        "sorting is strongest precisely where official protection is weakest - protection-seeking "
        "does at least as much work as ideology. That is why canon's 'larger in act one, fixed "
        "ceiling, does not grow' is exactly right: this is a FEAR structure, and fear is a bull "
        "market in year one and a dead one by year thirty. "
        "AND THE DESIGN POINT UNDER IT: they are not factions because THEY DO NOT BUILD "
        "ANYTHING. No territory, no trade, no craft, no repair. They are a thing that happens "
        "INSIDE other factions, which is both the honest description and the more frightening "
        "one."
    ),
    territory=(
        "None, by canon. That is the entire structural claim: no tile, no base, no selection "
        "slot. If one of these ever appears on a map it has been built wrong."
    ),
    controls=(
        "Nothing anyone needs. Their only product is admission, and the price is what you are "
        "rather than what you do."
    ),
    dress=dict(
        look=None,
        look_note=(
            "NO FACTION LOOK ENTRY AND THEY MUST NEVER GET ONE. A colour in FACTION_LOOK is a "
            "uniform the machine paints onto half a body, and giving these four a readable "
            "uniform would turn them into a visible team the player fights - which is exactly "
            "the wrong shape. They are supposed to be UNMARKED and inside the faction you "
            "already trust. Their tell should be a line of dialogue, never a garment."
        ),
        kit={},
    ),
    talk=(
        "The first question is always what you are, and it arrives disguised as something else - "
        "where your people are from, who your family was, where you grew up. The tell is that the "
        "answer changes how the rest of the conversation goes."
    ),
    name_rule=(
        "THEY ASK WHAT YOU ARE BEFORE THEY ASK WHO YOU ARE, and the name never really matters to "
        "them. The cleanest way for the player to detect one without a label on screen: this is "
        "the only person in the valley who asked a question about you and did not want the "
        "answer, only the category."
    ),
    wants=(
        "Recruits, and specifically recruits who are frightened. They approach after something "
        "bad has happened to you, never before."
    ),
    hooks=[
        "[HOOKS NOT WRITTEN HERE, DELIBERATELY.] Canon says quests and characters are built "
        "around them, and that content is Paolo's to place - writing three of them off my own bat "
        "would be inventing canon in the most sensitive territory on the sheet. The dossier "
        "stops at the pattern.",
    ],
    lesson=(
        "The group that only asks what you are is the one that has nothing else to offer you."
    ),
    canon_flags=[
        "NOT SELECTABLE, NO MAP TILE - canon, GDD v2 section 9. This dossier proposes no "
        "territory, no base, no colour and no quest content.",
    ],
)

# CUSTOM DELIBERATELY HAS NO DOSSIER. Canon: "No predetermined philosophy or name.
# Player draws their own flag. Identity emerges entirely from actions across three
# generations." Writing a dossier for the player's own faction would be inventing
# the one identity the game exists to let him build. The gate asserts this absence
# so it reads as a decision rather than an oversight.
NO_DOSSIER = {
    'Custom': (
        'THE PLAYER\'S FACTION. Canon: no predetermined philosophy or name, the player draws '
        'their own flag, and identity emerges entirely from actions across three generations. '
        'A dossier here would be me writing his character for him. Deliberately absent.'
    ),
}

ORDER = ['REMNANTS', 'CARTEL', 'NETWORK', 'HOMELESS', 'MOB', 'CARAVANS', 'CHURCH',
         'VOLUNTEERS', 'TRADES', 'REDS', 'BLUES', 'ANARCHISTS', 'COLORFUL',
         'KARENS', 'AMALGAMATION', 'SOCIAL_FORCES']


# ============================================================================
# READ THE CANON FLOOR (never re-typed by hand, so it cannot drift)
# ============================================================================
def read_graph():
    return json.load(open(GRAPH, encoding='utf-8'))['factions']


def read_ruled_looks():
    """Parse the six FACTION_LOOK entries Paolo ruled on 7/21 out of the live module."""
    src = open(DRESS, encoding='utf-8').read()
    m = re.search(r'var FACTION_LOOK=\{(.*?)\};', src, re.S)
    if not m:
        return {}
    out = {}
    for row in re.finditer(r"(\w+):\{mode:'(\w+)'(?:,color:'(#[0-9a-fA-F]{6})')?\}", m.group(1)):
        out[row.group(1)] = {'mode': row.group(2), 'color': row.group(3)}
    return out


def read_bank():
    names = {}
    for line in open(BANK, encoding='utf-8'):
        line = line.strip()
        if not line or line[0] in '#=':
            continue
        p = line.split('|')
        if len(p) >= 3:
            names[p[0]] = p[1]
    return names


# ============================================================================
# EMIT
# ============================================================================
def rows_for(key):
    d = D[key]
    dr = d['dress']
    look = dr.get('look')
    if look is None:
        look_line = 'NO FACTION LOOK ENTRY. ' + dr['look_note']
    else:
        tag = ('SETTLED (his 7/21 clothing ruling)' if dr.get('ruled')
               else 'HIS, ALREADY CHOSEN (the faction table in the alpha)' if dr.get('chosen')
               else 'PROPOSED')
        desc = look['mode'] + (' ' + look['color'] if look.get('color') else '')
        look_line = '%s - %s%s. %s' % (
            tag, desc, (' + motif "%s"' % dr['motif']) if dr.get('motif') else '', dr['look_note'])
    kit = dr.get('kit') or {}
    kit_line = ('VETERAN KIT (forced layers): ' +
                '; '.join('%s -> %s' % (k, ', '.join(v)) for k, v in sorted(kit.items()))
                ) if kit else 'No veteran kit (nothing to dress).'
    return [
        ('IDENTITY IN FIVE WORDS', d['five_words']),
        ('GROUNDED IN THE REAL', d['grounding']),
        ('TERRITORY + BASE', d['territory']),
        ('WHAT THEY TRADE / CONTROL', d['controls']),
        ('HOW THEY DRESS', look_line + '\n' + kit_line),
        ('HOW THEY TALK', d['talk']),
        ('WHEN YOU ASK THEIR NAME', d['name_rule']),
        ('WHAT THEY WANT FROM YOU', d['wants']),
        ('THREE QUEST HOOKS', '\n'.join('%d. %s' % (i + 1, h) for i, h in enumerate(d['hooks']))),
        ('THE LIFE LESSON UNDERNEATH', d['lesson']),
    ]


def canon_multi(key, graph):
    """Some cards cover several graph rows at once (the four social forces are one
    card by canon's own description - 'same structure'). Their canon still gets
    reproduced, one row each, rather than dropped."""
    out = []
    for n in D[key].get('graph_multi') or []:
        g = graph.get(n)
        if g:
            out.append((n, g))
    return out


def canon_block(key, graph):
    d = D[key]
    g = graph.get(d.get('graph') or '', None)
    if not g:
        return None
    rel = '; '.join('%s: %s' % (k, v) for k, v in sorted(g.get('relations', {}).items())) or 'none recorded'
    return {
        'align': g.get('align', ''),
        'act1': g.get('act1_power'),
        'act3': g.get('act3_power'),
        'note': g.get('note', ''),
        'relations': rel,
    }


def write_dossiers(graph):
    os.makedirs(OUTDIR, exist_ok=True)
    written = []
    for key in ORDER:
        d = D[key]
        cb = canon_block(key, graph)
        L = ['# %s' % d['name']]
        if d.get('subtitle'):
            L.append('### %s' % d['subtitle'])
        L += ['', '*%s*' % banner_for(key), '',
              'Ordered by Paolo, 7/31 lore sitting: **"WE NEED TO REALLY FLESH THE FACTIONS OUT '
              'FR MAKE ALL OF THEM AWESOME AND INTERESTING."** Backlog PEOPLE item 00.', '',
              '## THE CANON FLOOR (not mine, not up for judgement)']
        if cb:
            L += ['',
                  '| | |', '|---|---|',
                  '| alignment | `%s` |' % cb['align'],
                  '| act 1 power | **%s of 14** |' % cb['act1'],
                  '| act 3 power | %s |' % (cb['act3'] if cb['act3'] is not None else 'n/a'),
                  '| canon relations | %s |' % cb['relations'],
                  '',
                  '> %s' % cb['note'],
                  '',
                  'Source: `engine/BOHEMIA_faction_graph.json` ("All canon; nothing invented", '
                  'derived from GDD v2 section 9). Reproduced here by the generator, never typed '
                  'by hand.']
        else:
            multi = canon_multi(key, graph)
            if multi:
                L += ['', 'This card covers %d graph rows at once, because canon describes them '
                          'as the same structure. Every one is reproduced:' % len(multi), '',
                      '| | type | alignment | canon note |', '|---|---|---|---|']
                for n, g in multi:
                    L.append('| **%s** | `%s` | `%s` | %s |'
                             % (n, g.get('type', ''), g.get('align', ''), g.get('note', '')))
                L += ['', 'Source: `engine/BOHEMIA_faction_graph.json`. Reproduced here by the '
                          'generator, never typed by hand.']
            else:
                L += ['', 'No row in the faction graph. See the flags below for why, and for '
                          'what canon does say.']
        for f in d.get('canon_flags', []):
            L += ['', '- **%s**' % f]
        L += ['', '## THE ENTRY' if VERDICTS.get(key) else '## THE PROPOSAL', '']
        for title, body in rows_for(key):
            L += ['### %s' % title, '', body, '']
        L += ['---', '*BOHEMIA - faction dossier - 8/2/26 - PEOPLE lane - %s. Generated by '
              'tools/bohemia_faction_dossiers.py; edit the tool, never this file.*'
              % ('CANON, thumbed up 8/2' if VERDICTS.get(key) == 'up'
                 else 'his note stands in place of a thumb, 8/2' if VERDICTS.get(key)
                 else 'PROPOSAL, awaiting his thumb')]
        path = os.path.join(OUTDIR, 'BOHEMIA_FACTION_%s.md' % key)
        open(path, 'w', encoding='utf-8').write('\n'.join(L) + '\n')
        written.append(path)
    return written


def write_index(graph):
    L = ['# THE FACTION DOSSIERS - INDEX (8/2/26, PEOPLE lane)', '',
         'Paolo, 7/31 lore sitting: **"WE NEED TO REALLY FLESH THE FACTIONS OUT FR MAKE ALL OF '
         'THEM AWESOME AND INTERESTING."**', '',
         'Every file here is a **PROPOSAL**. Judge them on ONE sheet in the **LIFE tab**, top '
         'card. Nothing is canon until it is thumbed.', '',
         '| faction | kind | act1 | identity in five words |', '|---|---|---|---|']
    for key in ORDER:
        d = D[key]
        cb = canon_block(key, graph)
        L.append('| [%s](BOHEMIA_FACTION_%s.md) | %s | %s | %s |'
                 % (d['name'], key, d['kind'], (cb['act1'] if cb else '-'), d['five_words']))
    L += ['', '## DELIBERATELY WITHOUT A DOSSIER', '']
    for k, why in NO_DOSSIER.items():
        L.append('- **%s** - %s' % (k, why))
    L += ['', '## WHAT THESE FEED IF HE APPROVES THEM', '',
          'The dress rows are shaped to fill sockets that already exist and already ship EMPTY '
          'in `engine/bohemia_dress.js`: `FACTION_VETERAN_KIT` (his 7/21 ruling - "veteran '
          'faction members actually have to wear most of the clothes we give them") and the '
          'unruled half of `FACTION_LOOK`. The name rows feed the ask-a-name machine this lane '
          'shipped 7/31. No new system is proposed anywhere in here.', '',
          '*Generated by tools/bohemia_faction_dossiers.py. Edit the tool, never these files.*']
    open(os.path.join(OUTDIR, 'INDEX.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')


def write_judge(graph):
    cards = []
    for key in ORDER:
        d = D[key]
        cb = canon_block(key, graph)
        dr = d['dress']
        look = dr.get('look')
        cards.append({
            'id': key, 'name': d['name'], 'sub': d.get('subtitle', ''), 'kind': d['kind'],
            'five': d['five_words'],
            'canon': cb,
            'multi': [{'n': n, 'type': g.get('type', ''), 'align': g.get('align', ''),
                       'note': g.get('note', '')} for n, g in canon_multi(key, graph)],
            'flags': d.get('canon_flags', []),
            'settled': bool(dr.get('ruled') or dr.get('chosen')),
            'motif': dr.get('motif'),
            'lookline': (('%s %s' % (look['mode'], look.get('color') or '')).strip()
                         if look else 'no colour'),
            'lookcol': (look.get('color') if look else None),
            'rows': [{'t': t, 'b': b} for t, b in rows_for(key)],
        })
    data = json.dumps(cards, ensure_ascii=False)
    html = JUDGE_HTML.replace('/*__DATA__*/', data)
    open(JUDGE, 'w', encoding='utf-8').write(html)


JUDGE_HTML = r"""<meta charset="utf-8">
<title>BOHEMIA - JUDGE THE FACTIONS</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<body id="bd" style="margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd">
<div id="bar" style="position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;border-bottom:1px solid #2a2a1f">
  <div style="flex:1;min-width:120px">
    <div id="hdr" style="font:700 15px -apple-system,sans-serif;color:#cdbd8a">THE FACTION DOSSIERS</div>
    <div id="tally" style="font:600 11px ui-monospace,monospace;color:#8f8770;margin-top:2px"></div>
  </div>
  <button id="sun" style="padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd">&#9728; SUN MODE</button>
  <button id="exp" style="padding:9px 13px;border-radius:8px;background:#3f8c3f;color:#fff;border:0">&#10515; EXPORT .txt</button>
</div>
<div id="intro" style="font:12px/1.6 -apple-system,sans-serif;color:#8f8770;padding:12px 14px 0;max-width:760px">
  You said: <b>"we need to really flesh the factions out fr make all of them awesome and
  interesting."</b> Here is one dossier per faction. Every card has a GREY block at the top
  that is <b>already canon and not up for judgement</b>, and a gold block under it that is
  <b>my proposal</b>. Thumb the proposal. Six faction looks you already ruled on 7/21 are
  printed as SETTLED and carry no thumb, because asking you to re-confirm your own words is
  not a question. Tap a card to open it.
</div>
<div id="list"></div>
<div style="padding:16px 14px 60px;max-width:760px">
  <div id="gcap" style="font:12px sans-serif;color:#8f8770;margin-bottom:4px">PAOLO COMMENTS (rides the export):</div>
  <textarea id="gc" rows="5" style="width:100%;padding:10px;border-radius:10px;border:1px solid #888;box-sizing:border-box;background:#111;color:#ddd;font:13px sans-serif"></textarea>
</div>
<script>
var CARDS = /*__DATA__*/;
var SUN=false, verdict={}, comments={}, open_={};
function C(dark,sun){ return SUN?sun:dark; }
function tally(){
  var up=0,dn=0; Object.keys(verdict).forEach(function(k){ if(verdict[k]==='up')up++; if(verdict[k]==='down')dn++; });
  document.getElementById('tally').textContent = up+' up / '+dn+' down / '+(CARDS.length-up-dn)+' left';
}
function build(){
  document.body.style.background=C('#0d0f0a','#efe7cf');
  document.getElementById('bar').style.background=C('#0d0f0a','#efe7cf');
  document.getElementById('hdr').style.color=C('#cdbd8a','#3a3320');
  document.getElementById('intro').style.color=C('#8f8770','#5a5138');
  document.getElementById('gcap').style.color=C('#8f8770','#6a6045');
  var gc=document.getElementById('gc');
  gc.style.background=C('#111','#fff'); gc.style.color=C('#ddd','#222');
  var list=document.getElementById('list'); list.innerHTML='';
  CARDS.forEach(function(c){
    var card=document.createElement('div');
    card.style.cssText='margin:14px 12px;border-radius:12px;padding:14px;background:'+C('#181a12','#e4dbc0')+';border:1px solid '+C('#2a2a1f','#c9bd9a');

    var head=document.createElement('div');
    head.style.cssText='cursor:pointer';
    head.onclick=function(){ open_[c.id]=!open_[c.id]; build(); };
    var t=document.createElement('div');
    t.style.cssText='font:700 17px -apple-system,sans-serif;color:'+C('#cdbd8a','#3a3320');
    t.textContent=(open_[c.id]?'▾ ':'▸ ')+c.name;
    head.appendChild(t);
    if(c.sub){
      var s=document.createElement('div');
      s.style.cssText='font:11px ui-monospace,monospace;color:'+C('#8f8770','#7a6f50');
      s.textContent=c.sub; head.appendChild(s);
    }
    var five=document.createElement('div');
    five.style.cssText='font:italic 14px/1.5 -apple-system,sans-serif;margin-top:5px;color:'+C('#c8c0a8','#4a4230');
    five.textContent='“'+c.five+'”';
    head.appendChild(five);
    card.appendChild(head);

    if(c.canon){
      var cn=document.createElement('div');
      cn.style.cssText='margin-top:9px;padding:8px 10px;border-radius:8px;font:11px/1.55 ui-monospace,monospace;background:'+C('#101208','#d8ceae')+';color:'+C('#9a9480','#5a5138')+';border-left:3px solid '+C('#4a4a3a','#a89a70');
      cn.textContent='ALREADY CANON, NOT UP FOR JUDGEMENT · '+c.canon.align
        +' · act1 power '+c.canon.act1+'/14 · act3 '+(c.canon.act3===null?'n/a':c.canon.act3)
        +' · '+c.canon.relations+'  —  '+c.canon.note;
      card.appendChild(cn);
    }
    (c.multi||[]).forEach(function(m){
      var mn=document.createElement('div');
      mn.style.cssText='margin-top:6px;padding:8px 10px;border-radius:8px;font:11px/1.55 ui-monospace,monospace;background:'+C('#101208','#d8ceae')+';color:'+C('#9a9480','#5a5138')+';border-left:3px solid '+C('#4a4a3a','#a89a70');
      mn.textContent='ALREADY CANON · '+m.n+' · '+m.type+' · '+m.align+' — '+m.note;
      card.appendChild(mn);
    });
    (c.flags||[]).forEach(function(f){
      var fl=document.createElement('div');
      fl.style.cssText='margin-top:6px;padding:7px 9px;border-radius:7px;font:11px/1.5 -apple-system,sans-serif;background:'+C('#1d1a10','#efe3c2')+';color:'+C('#cdbd8a','#5a4d28')+';border-left:3px solid #c79a3f';
      fl.textContent=f; card.appendChild(fl);
    });

    if(c.lookcol || c.settled){
      var sw=document.createElement('div');
      sw.style.cssText='display:flex;align-items:center;gap:8px;margin-top:9px;font:11px ui-monospace,monospace;color:'+C('#9a9480','#5a5138');
      var chip=document.createElement('span');
      /* rainbow mode has no single hex, and he still has to SEE at a glance that this
         one is already his. A gradient chip says settled without inventing a colour. */
      var fill=c.lookcol||'linear-gradient(90deg,#dc2820,#ffd75c,#6ebe3c,#28bea0,#326ed2)';
      chip.style.cssText='width:22px;height:22px;border-radius:6px;border:1px solid #888;display:inline-block;background:'+fill;
      sw.appendChild(chip);
      var lab=document.createElement('span');
      lab.textContent=(c.settled?'HIS COLOUR · ':'PROPOSED · ')+c.lookline+(c.motif?('  ·  motif: '+c.motif):'');
      sw.appendChild(lab);
      card.appendChild(sw);
    }

    if(open_[c.id]){
      c.rows.forEach(function(r){
        var h=document.createElement('div');
        h.style.cssText='font:700 11px sans-serif;letter-spacing:.6px;margin:12px 0 4px;color:'+C('#8f8770','#7a6f50');
        h.textContent=r.t; card.appendChild(h);
        var b=document.createElement('div');
        b.style.cssText='font:13px/1.62 -apple-system,sans-serif;white-space:pre-wrap;color:'+C('#c8c0a8','#3a3320');
        b.textContent=r.b; card.appendChild(b);
      });
    } else {
      var hint=document.createElement('div');
      hint.style.cssText='font:11px sans-serif;margin-top:8px;color:'+C('#6a6455','#8a7f60');
      hint.textContent='tap the name to read the whole dossier';
      card.appendChild(hint);
    }

    var row=document.createElement('div');
    row.style.cssText='display:flex;gap:8px;margin-top:12px';
    [['up','👍','#3f8c3f'],['down','👎','#8c3f3f']].forEach(function(p){
      var b=document.createElement('button');
      b.textContent=p[1];
      b.style.cssText='flex:1;padding:11px;border-radius:9px;font-size:19px;border:2px solid '+(verdict[c.id]===p[0]?p[2]:'transparent')+';background:'+(verdict[c.id]===p[0]?p[2]:C('#12140d','#d8ceae'));
      b.onclick=function(){ verdict[c.id]=(verdict[c.id]===p[0]?null:p[0]); build(); };
      row.appendChild(b);
    });
    card.appendChild(row);

    var cm=document.createElement('textarea');
    cm.rows=2; cm.placeholder='comment on '+c.name;
    cm.value=comments[c.id]||'';
    cm.style.cssText='width:100%;margin-top:7px;padding:8px;border-radius:8px;border:1px solid #888;box-sizing:border-box;background:'+C('#111','#fff')+';color:'+C('#ddd','#222')+';font:13px sans-serif';
    cm.oninput=function(){ comments[c.id]=cm.value; };
    card.appendChild(cm);

    list.appendChild(card);
  });
  tally();
}
function exportTxt(){
  var L=[];
  L.push('BOHEMIA FACTION DOSSIER VERDICT - 8/2/26');
  L.push('one researched proposal dossier per faction, his order 7/31');
  L.push('');
  CARDS.forEach(function(c){
    var v=verdict[c.id]||'UNJUDGED';
    L.push('['+(v==='up'?'UP':v==='down'?'DOWN':'UNJUDGED')+']  '+c.name+'   ('+c.five+')');
    if(comments[c.id]) L.push('    comment: '+comments[c.id]);
    L.push('');
  });
  var up=0,dn=0; Object.keys(verdict).forEach(function(k){ if(verdict[k]==='up')up++; if(verdict[k]==='down')dn++; });
  L.push('TALLY: '+up+' up, '+dn+' down, '+(CARDS.length-up-dn)+' unjudged');
  L.push('');
  L.push('PAOLO COMMENTS:');
  L.push(document.getElementById('gc').value||'(none)');
  var blob=new Blob([L.join('\n')],{type:'text/plain'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='BOHEMIA_FACTION_VERDICT_8_2_26.txt'; a.click();
}
document.getElementById('sun').onclick=function(){ SUN=!SUN; build(); };
document.getElementById('exp').onclick=exportTxt;
build();
</script>
"""


def main():
    graph = read_graph()
    bank = read_bank()

    # fail loudly at generate time on a garment that is not canon, so a typo can
    # never reach a dossier and quietly become a lie about the wardrobe
    bad = []
    for key in ORDER:
        for layer, names in (D[key]['dress'].get('kit') or {}).items():
            for n in names:
                if n not in bank:
                    bad.append('%s: "%s" is not in the canon wardrobe bank' % (key, n))
                elif bank[n] != layer:
                    bad.append('%s: "%s" is layer %s, listed under %s' % (key, n, bank[n], layer))
    if bad:
        print('REFUSING TO GENERATE - approved wardrobe only:')
        for b in bad:
            print('  ' + b)
        return 1

    ruled = read_ruled_looks()
    for key in ORDER:
        dr = D[key]['dress']
        g = D[key].get('graph')
        if dr.get('ruled'):
            live = ruled.get((g or '').upper())
            if not live or live.get('mode') != dr['look']['mode'] or live.get('color') != dr['look'].get('color'):
                print('REFUSING TO GENERATE - %s is printed as SETTLED but does not match the '
                      'live FACTION_LOOK in %s' % (key, DRESS))
                return 1

    files = write_dossiers(graph)
    write_index(graph)
    write_judge(graph)
    print('FACTION DOSSIER FACTORY')
    print('  %d dossiers -> %s/' % (len(files), OUTDIR))
    print('  index       -> %s/INDEX.md' % OUTDIR)
    print('  judge sheet -> %s' % JUDGE)
    print('  %d ruled looks carried verbatim, %d wardrobe names checked against the bank'
          % (sum(1 for k in ORDER if D[k]['dress'].get('ruled')),
             sum(len(v) for k in ORDER for v in (D[k]['dress'].get('kit') or {}).values())))
    return 0


if __name__ == '__main__':
    sys.exit(main())
