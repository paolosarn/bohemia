// BOHEMIA WORLD-GRADED SKIN PALETTES (7/10/26)
// graded against measured world ambient RGB(67,61,56), world sat 0.23
// same structure as SKIN_TONES: [name,[light,mid,dark]] — drop-in replacement

const SKIN_TONES_WORLD=[["pale",[[188,160,138],[153,127,108],[112,94,84]]],["fair",[[203,169,140],[167,137,113],[124,102,87]]],["olive",[[186,151,116],[154,123,94],[114,94,78]]],["tan",[[179,140,103],[147,115,87],[109,88,71]]],["bronze",[[156,118,87],[118,96,78],[90,70,56]]],["brown",[[118,94,78],[94,74,59],[71,54,44]]],["deep",[[83,66,54],[65,51,42],[48,38,31]]],["ebony",[[66,51,43],[49,38,31],[35,26,22]]],["onyx",[[51,40,34],[37,28,24],[26,19,16]]]];

// SKIN_TONES_HOMELESS: KILLED by Paolo verdict 7/10/26 (graveyard). Agents use SKIN_TONES_WORLD + rags.

// PROPOSAL (Paolo's call): cybernetic subdermal tell — faint amalgam-magenta accents
// subdermal RGB(122,42,96) / glint RGB(196,84,160)
const CYBER_TELL={subdermal:[122,42,96],glint:[196,84,160]};
