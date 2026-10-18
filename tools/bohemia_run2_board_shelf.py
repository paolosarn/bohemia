"""RUN TWO [the board's quests are people], 10/18/26.

His 10/17 ANYTHING ELSE: 'no more cards with quests, make an actual quest'; RUN TWO's own jump list (10/1): 'the contract
board reading QUESTS' 96-quest shelf instead of 4 drafted offers'. QUESTS is research only (rule 35): its act-one designs
(questbook/designs/act1/QD_*.md) are READ here, never asked to build.

Bakes records/target/BOHEMIA_BOARD_SHELF.json, the board's people: each a client from one QUESTS design (the name as the
design's CLIENT PORTRAIT gives it, the skulls as its SKULLS line), saying the design's own SCREEN'S LINES cut to TWO
sentences with the pay in the second ({pay}, filled from the row; {crew} is the party that raided the place, from
FACTIONS' raid ledger). Pay is the board's rule, 30 a skull (Battle Brothers' contract line at ten crowns a battery;
TUNING owns it). Who shows where is slices/bohemia_board_shelf.js's job (QR-O's counts: camp 1, town 2, fortress 3;
a raided place keeps one, its raid job). Every line is an attempt, draft:true; names and words are Paolo's to change.
Run: python3 tools/bohemia_run2_board_shelf.py
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'questbook', 'designs', 'act1')
OUT = os.path.join(ROOT, 'records', 'target', 'BOHEMIA_BOARD_SHELF.json')

# design -> (title, tiers, when, from, look, says). tiers: where it can be posted; when: the place's trait it needs
# (None = any day). The look is one of the thirteen PORTRAIT has a fresh, talking face for.
C, T, F = ['camp'], ['town'], ['fortress']
ANY = ['camp', 'town', 'fortress']
CUTS = {
    # ---- camps ----
    'QD-AE10': ('Run off the wolves at the water', C, None, "the camp's eldest", 'cast_poncho',
                "Seven of them, big as ponies, and they come when the water comes. We cannot pay what you are worth, only {pay} batteries, and if you say no it is fine, everybody says no."),
    'QD-AP01': ('Bring back the light regulator', C, None, 'who keeps the one window lit', 'cast_shorts',
                "The regulator for our one window is at the pump station, and six scavs sleep on it. Bring it back so the camp has a light at night again, and {pay} batteries are yours."),
    'QD-AP03': ('Fetch the paint for the hall sign', C, None, 'the sign painter', 'cast_skirt',
                "A place without a name is a place you leave, and my eleven tins of paint sit past the hyenas. Bring them and I name it after whoever you want, plus {pay} batteries."),
    'QD-AP07': ('Get the water tower its valve', C, None, 'who ran the city water', 'cast_longcoat',
                "The tower is full of air because the Canal boys have the valve. Buy it or take it, I am not asking which, and the camp pays {pay} batteries."),
    'QD-AP10': ('Take back three solar panels', C, None, 'the solar fitter', 'cast_satchel',
                "Twelve panels, they broke nine, and the three good ones sit on their lookout. Three is the difference between a light and none, so bring them home for {pay} batteries."),
    'QD-AP11': ('Bring the little bulbs from the church', C, None, 'the couple getting married', 'cast_shortcoat',
                "We want to get married under lights, and the church on Lamb has a box of the little bulbs. The people there do not talk, they just watch, so go careful, and {pay} batteries are yours."),
    'QD-AP16': ('Buy back the chapel bell', C, None, 'the priest', 'cast_cape',
                "We sold the bell for beans and the dealer melts it in four days. I want to ring it once, so bring it back and the chapel pays {pay} batteries."),
    'QD-AE09': ('Walk the water carts to the wash', C, None, 'the pump foreman', 'cast_widebrim',
                "Two carts go to the wash camp, and the drivers say something follows them. Bring the mules back, mules cost more than water, and {pay} batteries are yours."),
    'QD-AR03': ('Hunt the pack that drinks here', C, None, 'who keeps the hose', 'cast_apron',
                "They come every second night, and one of them is not a coyote. Read their prints before noon, the wind takes them, and I pay {pay} batteries."),
    'QD-R01': ('Hold the farm tower one night', C, None, 'the grower', 'cast_bedroll',
               "They come in three nights, sixteen of them, maybe more, and the seed cannot run. Hold the ground floor till morning and the farm pays {pay} batteries, the roof is yours to use."),
    'QD-AP13': ('Bring the pump from the nursery', C, None, 'the roof gardener', 'cast_barearms',
                "Food is the leg we do not have, and the pump we need sits in the nursery on Rainbow. The cattle there are wrong, big, not angry, just big, and the roof pays {pay} batteries for that pump."),
    # ---- towns ----
    'QD-AQ03': ('Find the stolen battery bank', T, None, 'from the tire shop', 'cast_skirt',
                "Somebody took my battery bank up to the parking structure, level three. Bring it back and you get {pay} batteries, and your driver's wheels are paid, both."),
    'QD-S08': ('Carry the ballot box from block seven', T, None, 'who runs the count', 'cast_shorts',
               "Block seven votes like everybody else, but the road washed out and their box is still over there. Bring it sealed before the count in three nights, and {pay} batteries are yours."),
    'QD-S10': ('Sweep the sand off six panel rows', T, None, 'the shift lead at the field', 'cast_widebrim',
               "Six rows are under the sand, and people sleep in rows four and five. Two days, sand first, the rest you tell me, and the field pays {pay} batteries."),
    'QD-S17': ('Find the caravan four days late', T + F, None, 'the caravan master', 'cast_longcoat',
               "My drivers are four days late, and they are never late, not with medicine. Find them on the south road and you get {pay} batteries, the load we talk about after."),
    'QD-AR10': ('Bring the Salcedo family home', T, None, "the co-op's list keeper", 'cast_cape',
                "Five names, the Salcedos, at the cousin's farm since spring, and the vote is in ten days. Bring them or bring me why not, either is an answer, and the co-op pays {pay} batteries."),
    'QD-AR08': ('Carry the sealed letter over the pass', T, None, "the tower's clerk", 'cast_shortcoat',
                "A sealed letter goes to the council over the pass, signed for and back here in six days. Do not read it, the seal is the receipt, and the tower pays {pay} batteries."),
    'QD-AA01': ('Clear the dogs off the back wall', T, None, 'who counts the chickens', 'cast_apron',
                "Eleven dogs come over the back wall after dark, always the same wall. Some of them were ours, do it anyway, and {pay} batteries are yours."),
    # ---- fortresses ----
    'QD-S01': ('Clear the crew off the intake deck', F, None, 'the intake foreman', 'cast_pack',
               "Turbine dos is choking on half the desert, and a hungry crew is taking my steel off the intake deck. Get them off for three nights and the dam pays {pay} batteries."),
    'QD-S03': ('Haul two tankers of water', F, None, 'facilities', 'cast_satchel',
               "Two tankers of water to our loading dock before sundown tomorrow. It pays {pay} batteries, we do not negotiate upward, we are already generous."),
    'QD-AP02': ('Stand in the hole in the wall', F, None, 'the quartermaster', 'cast_barearms',
                "Two nights for the cement to set, and something comes through that hole every second night. Stand in it, that is the job, and {pay} batteries are yours."),
    'QD-AP05': ("Bring the cook's man home", F, None, 'who fed this place twenty years', 'cast_apron',
                "Twenty years I fed this place, and they took him for a debt that was mine. Bring him home and I light the stove, and {pay} batteries are yours."),
    'QD-AP08': ('Bring up the crates from Sunrise', F, None, 'the nurse', 'cast_skirt',
                "Nobody comes in because they do not believe there is anything here, and the basement at Sunrise has two crates. Something big lives down there, from the fossil lab, so it pays {pay} batteries."),
    'QD-AP09': ("Bring six cells for the barber's pole", F, None, 'the barber', 'cast_shorts',
                "No power, no fades, only scissors, and six cells sit in the white limo on Koval. Bring them and the pole spins again, plus {pay} batteries."),
    'QD-AP19': ('Clear the dogs out of the wrecks', F, None, 'the foreman', 'cast_widebrim',
                "Under all that trash is a good lot, and a lot of dogs live in the wrecks. Clear it, keep what you dig out, and {pay} batteries on top."),
    'QD-AA15': ("Put down the show's two tigers", F, None, 'the floor boss', 'cast_longcoat',
                "Two white tigers were the show, and now they stay in back by the laundry. Do not shoot them in front of the guests, we have guests, and the house pays {pay} batteries."),
    'QD-AR02': ('Walk the relief shift to the dam', F, None, 'the night foreman', 'cast_pack',
                "Four of mine walk to the dam for the shift change at dawn the day after tomorrow. You watch the road for {pay} batteries, because late is a man asleep on a rail."),
    'QD-AP15': ('Fetch the pigment for the mural', F, None, 'the muralist', 'cast_poncho',
                "Thirty people died here and nobody can say all their names. The pigment is in the art store on Charleston, on sabre-tooth ground, and it pays {pay} batteries."),
    # ---- a raided place keeps one job: the crew that hit it ({crew} from FACTIONS' raid ledger) ----
    'QD-T02': ('Hold the wall the night they come back', ANY, 'raided', 'the grower boss', 'cast_bedroll',
               "{crew} hit our store, and their tracks bend back toward this lot. Stand on the wall the night they come and the harvest pays {pay} batteries."),
    'QD-S15': ('Guard the counting room three nights', ANY, 'raided', 'the manager', 'cast_shortcoat',
               "{crew} took the count and two of my men, and they come back for the charge room the night the power is up. Three nights at the door, they leave with nothing and you leave with {pay} batteries."),
    'QD-AR09': ('Sit two nights at the gate', ANY, 'raided', 'the well keeper', 'cast_pack',
                "{crew} come every fourth night, for our batteries, not the water. Two nights here, you are here and they are not, and {pay} batteries are yours."),
    'QD-T06': ('Hit their fire in the dry wash', ANY, 'raided', 'the watcher', 'cast_barearms',
               "Six of {crew} sit in the dry wash and light fires at night like they own it. I can see them from here right now, so go, and the block pays {pay} batteries."),
    # ---- a sick place asks for medicine first ----
    'QD-S06': ('Move the fever camp off the well', ANY, 'sickness', 'the nurse', 'cast_cape',
               "The caravan came with the fever, and they sleep ten metres from our only well. Move them up to the old school on the hill, gently, and the clinic pays {pay} batteries."),
    'QD-AA09': ('Bring the freezer from the fossil beds', ANY, 'sickness', 'the children\'s doctor', 'cast_satchel',
                "The lab at the fossil beds has a freezer on its own panels that never went warm. Bring me the freezer, empty it first if you have to, and {pay} batteries are yours."),
    'QD-AR06': ('Bring medicine down from the lodge', ANY, 'sickness', 'the pharmacist', 'cast_longcoat',
                "The lodge on the mountain kept a pharmacy, and nobody has been up since the snow. Bring antibiotics, anything in a sealed bottle, and the clinic pays {pay} batteries."),
    'QD-C02': ("Get the clinic's cold box back", ANY, 'sickness', 'the doctor', 'cast_skirt',
               "Somebody took my cold box with the insulin in it, mija. Bring it back and {pay} batteries are yours."),
    # ---- a market day (the fair) puts a haul up first ----
    'QD-S04': ('Haul eighty tyres to the co-op', ANY, 'market_day', 'the yard boss', 'cast_barearms',
               "Four hundred tyres came in for the fair and there is room for two hundred, and the co-op wants eighty. Haul them over, do not sell any on the way, and {pay} batteries are yours."),
    'QD-AR05': ('Ride with three carts to Primm', ANY, 'market_day', "the yards' bookkeeper", 'cast_longcoat',
                "Three carts go to Primm for the fair, and you do not look under the tarps. Primm's market pays you {pay} batteries at the far end, I pay you to be strangers."),
    'QD-A02': ('Ride shotgun to the salt camp', ANY, 'market_day', 'the welder', 'cast_shorts',
               "The salt goes out to the camp while the fair is buying. Ride shotgun with me there and back, and {pay} batteries are yours."),
}
# where the design's CLIENT PORTRAIT leads with a role, not the name ('the tire shop owner, Senora Garza, ...'): the name
# as the design gives it further on (the bake still checks it is in the design's own text)
NAMES = {'QD-AQ03': 'Señora Garza', 'QD-AP09': 'Chuy'}
PAY_PER_SKULL = 30
CAST = {'cast_longcoat', 'cast_barearms', 'cast_pack', 'cast_skirt', 'cast_widebrim', 'cast_cape', 'cast_apron',
        'cast_poncho', 'cast_bedroll', 'cast_shorts', 'cast_satchel', 'cast_shortcoat'}


def design(qid):
    hit = [f for f in os.listdir(D) if f.startswith(qid.replace('-', '_') + '_')]
    if len(hit) != 1:
        sys.exit('no single design file for ' + qid)
    t = open(os.path.join(D, hit[0]), encoding='utf-8').read()
    if not re.search(r'^KIND:\s*contract', t, re.M):
        sys.exit(qid + ' is not a contract')
    cp = re.search(r'CLIENT PORTRAIT:\s*([^\n]*)', t)
    name = re.split(r',', cp.group(1))[0].strip() if cp else ''
    name = re.sub(r'^(?:MR|MRS|MS)\.?\s', lambda m: m.group(0).title(), name)
    sk = re.search(r'SKULLS:\s*(\d)', t)
    return hit[0], t.split('\n')[0][2:].split(': ', 1)[1], name, int(sk.group(1)) if sk else 1, t


def sentences(s):
    return [x for x in re.split(r'(?<=[.!?])\s+', s.strip()) if x]


rows = []
for qid, (title, tiers, when, frm, look, says) in CUTS.items():
    f, dtitle, name, skulls, text = design(qid)
    name = NAMES.get(qid, name)
    if not name or name.lower() not in text.lower():
        sys.exit(qid + ': the client is not named in the design')
    name = ' '.join(w if w.isupper() is False else w.title() for w in name.split())   # ABUELA PINA -> Abuela Pina
    ss = sentences(says)
    assert len(ss) == 2 and '{pay}' in ss[1] and '{pay}' not in ss[0], qid + ': two sentences, the pay in the second'
    assert look in CAST, qid + ': a look with a fresh portrait'
    assert skulls in (1, 2, 3), qid
    rows.append({'id': 'qd-' + qid[3:].lower(), 'design': 'questbook/designs/act1/' + f, 'design_title': dtitle,
                 'title': title, 'skulls': skulls, 'pay': skulls * PAY_PER_SKULL, 'tiers': tiers, 'when': when,
                 'client': {'name': name, 'from': frm, 'look': look, 'draft': True}, 'says': says, 'draft': True})

doc = {
    '_about': ("RUN TWO [the board's quests are people], 10/18/26: the settlement board's people, drawn from QUESTS' act-one "
               "designs (research only, rule 35: read, never asked to build). Baked by tools/bohemia_run2_board_shelf.py; "
               "picked by slices/bohemia_board_shelf.js for the settlement's board AND the phone's list, so the phone "
               "never shows a job the place does not. A modder edits this file: add a row, keep two sentences with "
               "{pay} in the second; {crew} is the party that raided the place."),
    'version': 'board-shelf-10-18',
    'draft': True,
    'counts': {'camp': 1, 'town': 2, 'fortress': 3, 'raided': 1, 'max': 4,
               'why': "QUESTS QR-O: camp 1, town 2, fortress 3, raid leaves 1, never over 4 (the settlement's TIER_OFFERS)"},
    'refresh_days': 3,
    'refresh_why': "QUESTS QR-O's draft, one board per base per 3 map days; TUNING owns it",
    'pay_per_skull': PAY_PER_SKULL,
    'pay_why': "the board's rule since 10/5: Battle Brothers' contract line at ten crowns a battery, a skull 30; TUNING owns it",
    'offers': rows,
}
json.dump(doc, open(OUT, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
open(OUT, 'a').write('\n')
by = {}
for r in rows:
    k = r['when'] or '+'.join(r['tiers'])
    by[k] = by.get(k, 0) + 1
print(OUT, len(rows), 'offers', by)
