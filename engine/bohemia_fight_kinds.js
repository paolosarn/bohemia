/* ============================================================================
   BOHEMIA -- THE FIGHT ANSWER FOR EVERY BUILDING KIND ON THE MAP  (WORLD THIRTEEN 11/7/26)
   VAMILY rule 429(b), ask line 505. Paolo 11/7: 'maybe the combat map is just the whole map itself... for every building that we
   have on the regular map we need to answer for that in the combat map'. The coordinator's call: ONE MAP.

   The file a modder edits is records/target/bb/map_fight_kinds.json. The rows below are that file's, WORD FOR WORD, written by
   tools/bohemia_world_thirteen_fight_kinds_sync.js (never by hand); gates/the_map_kinds_have_fight_answers_gate.js holds the two
   together and goes red on any kind the map draws without a row here.

   WHAT A ROW SAYS (the file's own "fields" section is the long form):
     storeys   how high a man on its roof stands, a mix {"1": share, "2": share, "3": share}; 1 a slight defence and no range, 2
               defence and range, 3 rare and more (rule 428(b)); what each does in numbers is ours.json roof_storeys,
               height_is_accuracy and cover_defence, never here
     man       in_or_roof (in it, its walls his cover, or on its roof, its storeys his height: every house tile, no ladder, 423(c)(d)),
               in, roof, open (no building), none (nobody stands there)
     cover / open_cover / blocks / street_front (426(a): a street in front of every house, the trailer park the one exception)

   ONE ROLL, TWO PLACES. storeysOf(kind, roll) is the one way a building's height is read: the map's painter draws a house's
   wall from it on the house's own roll, and the fight reads the same function on the same roll, so a house the map stands two
   storeys tall is a two-storey roof in the fight.
   [bb] Battle Brothers' battlefield takes its tiles' heights from the world tile it is fought on; ours takes them from the very
   house the map drew.
   [analog horror] a two-storey house on the map is the two-storey house you climb in the fight: the same house, recorded twice.
   ============================================================================ */
(function (root) {
  'use strict';
/* __FIGHT_KINDS__ DATA BEGIN */
var DATA = {
  districts: {
    "suburb": {"class":"houses","zone":"suburb","building":"house","storeys":{"1":0.5,"2":0.45,"3":0.05},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"suburb"},
    "estate": {"class":"houses","zone":"suburb","building":"house","storeys":{"1":0.3,"2":0.6,"3":0.1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"suburb"},
    "gated": {"class":"houses","zone":"suburb","building":"house","storeys":{"1":0.4,"2":0.55,"3":0.05},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"suburb"},
    "trailer": {"class":"houses","zone":"cheap_edge","building":"trailer","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":["walls"],"street_front":false,"place":"trailer"},
    "apartment": {"class":"houses","zone":"suburb","building":"slab","storeys":{"2":0.6,"3":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "town": {"class":"houses","zone":"suburb","building":"town","storeys":{"1":0.6,"2":0.35,"3":0.05},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"suburb"},
    "downtown": {"class":"tower","zone":"downtown","building":"tower","storeys":{"2":0.4,"3":0.6},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"downtown"},
    "strat": {"class":"tower","zone":"strip","building":"tower","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"strip"},
    "highroller": {"class":"tower","zone":"strip","building":"civic","storeys":{"2":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "sign": {"class":"tower","zone":"strip","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["walls"],"place":"strip"},
    "stadium": {"class":"tower","zone":"civic","building":"stands","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"none","blocks":["walls"],"street_front":true},
    "ballpark": {"class":"tower","zone":"civic","building":"stands","storeys":{"2":1},"man":"in_or_roof","cover":"full","open_cover":"none","blocks":["walls","fence"],"street_front":true},
    "medical": {"class":"tower","zone":"downtown","building":"civic","storeys":{"2":0.4,"3":0.6},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true,"place":"lab"},
    "cityhall": {"class":"tower","zone":"downtown","building":"civic","storeys":{"2":0.5,"3":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "courthouse": {"class":"tower","zone":"downtown","building":"civic","storeys":{"2":0.5,"3":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "resort": {"class":"casino","zone":"strip","building":"casino","storeys":{"2":0.7,"3":0.3},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "casino": {"class":"casino","zone":"strip","building":"casino","storeys":{"2":0.7,"3":0.3},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "luxor": {"class":"casino","zone":"strip","building":"casino","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "sphere": {"class":"casino","zone":"strip","building":"casino","storeys":{"3":1},"man":"in","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"strip"},
    "aquarium": {"class":"casino","zone":"strip","building":"casino","storeys":{"2":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","water"],"street_front":true},
    "park": {"class":"green","zone":"green","building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":[],"street_front":true,"place":"golf"},
    "golf": {"class":"green","zone":"green","building":"clubhouse","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":[],"street_front":true,"place":"golf"},
    "cemetery": {"class":"green","zone":"civic","building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence"],"street_front":true},
    "farm": {"class":"green","zone":"green","building":"barn","storeys":{"1":0.6,"2":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence"],"street_front":true},
    "campus": {"class":"green","zone":"civic","building":"civic","storeys":{"1":0.3,"2":0.6,"3":0.1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "water": {"class":"water","zone":"water","building":"none","storeys":{},"man":"none","cover":"none","open_cover":"none","blocks":["water"],"place":"marina"},
    "reservoir": {"class":"water","zone":"water","building":"none","storeys":{},"man":"none","cover":"none","open_cover":"half","blocks":["water"],"place":"shore"},
    "intake": {"class":"water","zone":"water","building":"works","storeys":{"2":1},"man":"in","cover":"full","open_cover":"none","blocks":["water","walls"],"place":"marina"},
    "waterpark": {"class":"water","zone":"green","building":"tower","storeys":{"2":0.5,"3":0.5},"man":"roof","cover":"half","open_cover":"half","blocks":["water"],"street_front":true},
    "desert": {"class":"land","zone":"open","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[],"place":"desert"},
    "wash": {"class":"land","zone":"open","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["cliff"],"place":"wash"},
    "basin": {"class":"land","zone":"open","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"none","blocks":[],"place":"wash"},
    "quarry": {"class":"land","zone":"industry","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"full","blocks":["cliff"]},
    "gypsum": {"class":"land","zone":"industry","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["cliff"]},
    "landfill": {"class":"land","zone":"industry","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[],"place":"landfill"},
    "boneyard": {"class":"land","zone":"industry","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"full","blocks":["walls"]},
    "springs": {"class":"land","zone":"open","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"full","blocks":["cliff"],"place":"redrock"},
    "mountain": {"class":"mountain","zone":"open","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"full","blocks":["cliff"],"place":"pass"},
    "solar": {"class":"solar","zone":"open","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["rows","fence"]},
    "airport": {"class":"field","zone":"transport","building":"hangar","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true,"place":"airport"},
    "airbase": {"class":"field","zone":"transport","building":"hangar","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true,"place":"airport"},
    "speedway": {"class":"field","zone":"cheap_edge","building":"stands","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"none","blocks":["walls","fence"],"street_front":true},
    "minigp": {"class":"field","zone":"cheap_edge","building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":["barrier"],"street_front":true},
    "drivein": {"class":"field","zone":"cheap_edge","building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "swapmeet": {"class":"field","zone":"cheap_edge","building":"stall","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":[],"street_front":true},
    "truckstop": {"class":"field","zone":"transport","building":"shop","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"full","blocks":[],"street_front":true},
    "dam": {"class":"dam","zone":"open","building":"works","storeys":{"2":1},"man":"in","cover":"full","open_cover":"half","blocks":["cliff","water"],"place":"shore"},
    "rail": {"class":"rail","zone":"transport","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["rail"],"place":"works"},
    "railyard": {"class":"rail","zone":"industry","building":"car","storeys":{"1":1},"man":"roof","cover":"full","open_cover":"full","blocks":["rail","walls"],"place":"works"},
    "freeway": {"class":"freeway","zone":"transport","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["barrier"]},
    "beltway": {"class":"freeway","zone":"transport","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["barrier"]},
    "interchange": {"class":"freeway","zone":"transport","building":"deck","storeys":{"2":1},"man":"roof","cover":"half","open_cover":"half","blocks":["barrier"]},
    "arterial": {"class":"road","zone":"mile_street","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[]},
    "strip": {"class":"blvd","zone":"strip","building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[],"place":"strip"},
    "commercial": {"class":"roof","zone":"commercial","building":"shop","storeys":{"1":0.8,"2":0.2},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "mall": {"class":"roof","zone":"commercial","building":"shop","storeys":{"2":0.7,"3":0.3},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "convention": {"class":"roof","zone":"strip","building":"hall","storeys":{"2":0.3,"3":0.7},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"strip"},
    "industrial": {"class":"roof","zone":"industry","building":"works","storeys":{"1":0.4,"2":0.4,"3":0.2},"man":"in_or_roof","cover":"full","open_cover":"full","blocks":["walls","fence"],"street_front":true,"place":"works"},
    "warehouse": {"class":"roof","zone":"industry","building":"works","storeys":{"2":0.4,"3":0.6},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"works"},
    "school": {"class":"roof","zone":"civic","building":"civic","storeys":{"1":0.5,"2":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true,"place":"suburb"},
    "prison": {"class":"roof","zone":"civic","building":"civic","storeys":{"2":0.6,"3":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true},
    "jail": {"class":"roof","zone":"downtown","building":"civic","storeys":{"2":0.4,"3":0.6},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "library": {"class":"roof","zone":"civic","building":"civic","storeys":{"1":0.6,"2":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"suburb"},
    "firestation": {"class":"roof","zone":"civic","building":"civic","storeys":{"1":0.5,"2":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "policestation": {"class":"roof","zone":"civic","building":"civic","storeys":{"1":0.3,"2":0.7},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true},
    "robofactory": {"class":"roof","zone":"industry","building":"works","storeys":{"2":0.5,"3":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true},
    "datafort": {"class":"roof","zone":"industry","building":"compound","storeys":{"2":0.6,"3":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true},
    "arsenal": {"class":"roof","zone":"industry","building":"compound","storeys":{"1":0.5,"2":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true},
    "fueldepot": {"class":"roof","zone":"industry","building":"tank","storeys":{"1":0.3,"2":0.4,"3":0.3},"man":"roof","cover":"full","open_cover":"half","blocks":["fence"],"street_front":true},
    "granary": {"class":"roof","zone":"industry","building":"silo","storeys":{"2":0.4,"3":0.6},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "storage": {"class":"roof","zone":"industry","building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"works"},
    "substation": {"class":"roof","zone":"industry","building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence"],"street_front":true},
    "pumpstation": {"class":"roof","zone":"industry","building":"works","storeys":{"1":0.6,"2":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true},
    "watertreat": {"class":"roof","zone":"industry","building":"works","storeys":{"1":0.5,"2":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence","water"],"street_front":true},
    "radio": {"class":"roof","zone":"commercial","building":"civic","storeys":{"1":0.7,"2":0.3},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence"],"street_front":true},
    "battery": {"class":"roof","zone":"industry","building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence"],"street_front":true},
    "reclaim": {"class":"roof","zone":"industry","building":"works","storeys":{"1":0.6,"2":0.4},"man":"in_or_roof","cover":"full","open_cover":"full","blocks":["fence"],"street_front":true},
    "terminal": {"class":"roof","zone":"transport","building":"shop","storeys":{"2":0.7,"3":0.3},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"airport"},
    "chapel": {"class":"roof","zone":"commercial","building":"civic","storeys":{"1":0.8,"2":0.2},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true,"place":"suburb"},
    "fort": {"class":"roof","zone":"civic","building":"compound","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "bank": {"class":"roof","zone":"downtown","building":"tower","storeys":{"2":0.4,"3":0.6},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "jobsoffice": {"class":"roof","zone":"commercial","building":"civic","storeys":{"1":0.6,"2":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "hardware": {"class":"roof","zone":"commercial","building":"shop","storeys":{"1":0.3,"2":0.7},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "powerplant": {"class":"roof","zone":"industry","building":"works","storeys":{"2":0.5,"3":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"],"street_front":true},
    "shelter": {"class":"roof","zone":"industry","building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence"],"street_front":true},
    "mobmuseum": {"class":"roof","zone":"downtown","building":"civic","storeys":{"2":0.4,"3":0.6},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "natmuseum": {"class":"roof","zone":"civic","building":"civic","storeys":{"1":0.6,"2":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"],"street_front":true},
    "tvstation": {"class":"roof","zone":"commercial","building":"civic","storeys":{"1":0.6,"2":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence"],"street_front":true}
  },
  townlot: {
    "box": {"building":"shop","storeys":{"1":0.5,"2":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "gable": {"building":"house","storeys":{"1":0.7,"2":0.3},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "shacks": {"building":"shack","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":["walls"]},
    "trailers": {"building":"trailer","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":["walls"]},
    "tents": {"building":"tent","storeys":{"1":1},"man":"in","cover":"none","open_cover":"none","blocks":[]},
    "cont": {"building":"container","storeys":{"1":0.5,"2":0.5},"man":"roof","cover":"full","open_cover":"full","blocks":["walls"]},
    "yard": {"building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["fence"]},
    "garden": {"building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[]},
    "plaza": {"building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[]},
    "lot": {"building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[]},
    "scrap": {"building":"heap","storeys":{"1":0.5,"2":0.5},"man":"roof","cover":"full","open_cover":"full","blocks":["walls"]},
    "watch": {"building":"post","storeys":{"2":0.5,"3":0.5},"man":"in_or_roof","cover":"full","open_cover":"none","blocks":["walls"]}
  },
  townmark: {
    "chapel": {"building":"civic","storeys":{"2":0.6,"3":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "mast": {"building":"civic","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"]},
    "prison": {"building":"civic","storeys":{"2":0.6,"3":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","fence"]},
    "casino": {"building":"casino","storeys":{"2":0.6,"3":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "truckstop": {"building":"shop","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"full","blocks":["walls"]},
    "storage": {"building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "tank": {"building":"tank","storeys":{"2":0.5,"3":0.5},"man":"roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "works": {"building":"works","storeys":{"1":0.4,"2":0.4,"3":0.2},"man":"in_or_roof","cover":"full","open_cover":"full","blocks":["walls"]},
    "clinic": {"building":"civic","storeys":{"1":0.5,"2":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "bank": {"building":"tower","storeys":{"2":0.4,"3":0.6},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "garden": {"building":"civic","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":["walls"]},
    "stage": {"building":"stage","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"full","blocks":["walls"]},
    "hall": {"building":"hall","storeys":{"1":0.6,"2":0.4},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "yard": {"building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["fence"]},
    "trailers": {"building":"trailer","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":["walls"]},
    "lodge": {"building":"house","storeys":{"1":0.5,"2":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "bigbox": {"building":"shop","storeys":{"1":0.3,"2":0.7},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "marina": {"building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","water"]},
    "hilltown": {"building":"house","storeys":{"1":0.5,"2":0.5},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls","cliff"]},
    "solar": {"building":"shed","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["rows","fence"]},
    "scrap": {"building":"heap","storeys":{"1":0.5,"2":0.5},"man":"roof","cover":"full","open_cover":"full","blocks":["walls"]},
    "hangars": {"building":"hangar","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "suburbs": {"building":"house","storeys":{"1":0.5,"2":0.45,"3":0.05},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]}
  },
  townworks: {
    "wall": {"building":"wall","storeys":{"2":1},"man":"roof","cover":"full","open_cover":"none","blocks":["walls"]},
    "corner_tower": {"building":"post","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"none","blocks":["walls"]},
    "gate_tower": {"building":"post","storeys":{"3":1},"man":"in_or_roof","cover":"full","open_cover":"none","blocks":["walls"]}
  },
  home: {
    "house_plain": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "house_garage": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "house_wing": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "house_carport": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "kitchen": {"building":"shack","storeys":{"1":1},"man":"in","cover":"half","open_cover":"half","blocks":[]},
    "main": {"building":"none","storeys":{},"man":"open","cover":"none","open_cover":"none","blocks":[]},
    "purifier": {"building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[]},
    "garden_bed": {"building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":[]},
    "water_tank": {"building":"tank","storeys":{"1":1},"man":"roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "solar_panel": {"building":"none","storeys":{},"man":"open","cover":"none","open_cover":"half","blocks":["rows"]}
  },
  model: {
    "ranch_plain": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "ranch_porch": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "ranch_wing": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "ranch_garage": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "ranch_carport": {"building":"house","storeys":{"1":1},"man":"in_or_roof","cover":"full","open_cover":"half","blocks":["walls"]},
    "trailer": {"building":"trailer","storeys":{"1":1},"man":"in_or_roof","cover":"half","open_cover":"half","blocks":["walls"]}
  }
};
/* __FIGHT_KINDS__ DATA END */

  var MEN = { in_or_roof: 1, in: 1, roof: 1, open: 1, none: 1 };
  var NS = { district: 'districts', townlot: 'townlot', townmark: 'townmark', townworks: 'townworks', home: 'home', model: 'model' };

  /* 'suburb' is a map kind; 'townlot:box' a town's lot (VB_TOWN_K), 'townmark:chapel' its landmark (VB_TOWN_MARKS), 'townworks:wall'
     its wall and towers, 'home:kitchen' your own lot's piece, 'model:ranch_plain' a house model the map stands on a lot. */
  function answer(name) {
    var s = String(name == null ? '' : name), i = s.indexOf(':'), ns = 'districts', k = s;
    if (i > 0) { ns = NS[s.slice(0, i)]; k = s.slice(i + 1); if (!ns) return null; }
    var T = DATA[ns];
    return T && Object.prototype.hasOwnProperty.call(T, k) ? T[k] : null;
  }
  /* the storey a building of this kind stands at for its roll in [0, 1): 0 when nothing stands there. One cumulative walk over
     1, 2, 3 in that order, so a roll is the same storey wherever it is asked. */
  function mixStorey(mix, roll) {
    if (!mix) return 0;
    var r = +roll; if (!(r >= 0)) r = 0; if (r >= 1) r = r % 1;
    var acc = 0, last = 0;
    for (var s = 1; s <= 3; s++) { var w = +mix[String(s)] || 0; if (w <= 0) continue; last = s; acc += w; if (r < acc) return s; }
    return last;
  }
  function storeysOf(name, roll) { var a = answer(name); return a ? mixStorey(a.storeys, roll) : 0; }
  function canStand(name) { var a = answer(name); return !!a && a.man !== 'none'; }
  function roofOK(name) { var a = answer(name); return !!a && (a.man === 'in_or_roof' || a.man === 'roof'); }
  function kinds(ns) { return Object.keys(DATA[NS[ns] || ns || 'districts'] || {}); }
  function missing(names, ns) { var out = []; (names || []).forEach(function (n) { if (!answer(ns && ns !== 'district' ? ns + ':' + n : n)) out.push(n); }); return out; }
  /* the painter's own families (VB_SUB of the houses class: 0 a tract, 1 estate, 2 gated, 3 trailer, 4 apartment), for its worker,
     which cannot see this module: plain data, posted with the worker's source */
  function painterMix() {
    var D = DATA.districts || {}, m = function (k) { return D[k] ? D[k].storeys : null; };
    return { house: { 0: m('suburb'), 1: m('estate'), 2: m('gated'), 3: m('trailer'), 4: m('apartment') } };
  }
  function valid(row) {
    if (!row || !MEN[row.man]) return false;
    var s = row.storeys || {}, sum = 0, n = 0;
    for (var k in s) { if (!/^[123]$/.test(k)) return false; sum += +s[k]; n++; }
    if (row.building === 'none' || row.man === 'open' || row.man === 'none') return true;
    return n > 0 && Math.abs(sum - 1) < 1e-6;
  }

  var API = { DATA: DATA, answer: answer, storeysOf: storeysOf, mixStorey: mixStorey, canStand: canStand, roofOK: roofOK,
    kinds: kinds, missing: missing, painterMix: painterMix, valid: valid };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaFightKinds = API;
})(typeof window !== 'undefined' ? window : this);
