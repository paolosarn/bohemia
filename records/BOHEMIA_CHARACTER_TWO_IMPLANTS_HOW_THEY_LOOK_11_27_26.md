# CHARACTER TWO, 11/27: IMPLANTS, HOW THEY LOOK (rule 486) -- RESEARCH DONE, THE LOOK NOT YET READING, STOPPED AT LOOP 3

Rule 486 (Paolo 11/27: 'I think it definitely would be possible to get a cybernetic implant... pretty expensive... fucked up black
market shit'): real tech only, salvaged, back-room fitted, never chrome. CHARACTER owns how a man with one looks, on his face and
at the fight's size. NOT SHIPPED: three loops on the HD face did not make it read; STOP PRODUCING (7/26) says stop before a fourth
and say so. Nothing in the game changed; the tool is kept, inert until a head is given an implant.

## RESEARCH (cited)
- THE CAMERA EYE is real: Rob Spence's Eyeborg (2008 on), a 1.5 mm low-resolution camera, a small round circuit board, a video
  transmitter and a 3 V microbattery sealed in a prosthetic eye's clear acrylic, a magnetic on/off switch, a red LED that glows
  while it records, about 30 minutes a charge, a transmitter weak enough that he held the receiving antenna to his cheek; not wired
  to the optic nerve (IEEE Spectrum, 'eyeborg bionic eye', spectrum.ieee.org; LiveScience 59485 and 59470; TechCrunch 2011/08/26).
- THE HEARING IMPLANT as worn: the processor hooked behind the ear like a hearing aid, a transmitting coil on the side of the head
  held by an implanted magnet about the size of a dime, over or under the hair, a lead between them; the magnet site needs checking
  weekly or the skin breaks down (Nationwide Children's Hospital, 'Cochlear Implant (CI) Magnet'; University of Southampton,
  'The design, size, fit and weight of the speech processor').
- THE POWERED ARM: a myoelectric hand worked by the stump's muscle signals (Ottobock's bebionic, 14 grips), a carbon-fibre or
  printed socket; $20,000 to $80,000 new (Open Bionics, 'How much are prosthetic arms?'; IEEE Spectrum 'The Bionic-Hand Arms Race').
  In a valley at 5 percent capitalism a working one is pulled off a dead man and refitted.

## WHAT WAS TRIED (tools/bohemia_portrait_the_head_from_the_model.py IMPLANTS, P['implant']; tools/bohemia_character_two_implants.py)
Two fitted heads on Old Tavo's body, rendered by the master rig at the portrait's 128 px and the fight's stills.
1. A matte black shell over the right eye, a lens, a red light, a lead taped down the temple, a transmitter box; a coil and a
   processor behind the left ear. READ: nothing. The shell sat 1 mm in front of the eyeball, under the lids, near-black like an
   iris; the coil behind the ear, out of every portrait view.
2. The unit 4 mm proud in grey plastic, a matte metal lens ring, a 4 mm red light, the lead over the cheekbone; the coil higher.
   READ: a grey ring round a dark lens is an iris at 128 px (the lens read as his eye).
3. A 30 mm bezel with four screws over the whole socket, the lens in it; the coil and processor in black plastic, lifted clear of
   the hair. FOUND: the bezel was anchored to the head's surface line (surf_y), which sits BEHIND the eyeball's front, so it hid
   behind the lids; re-anchored to the eyeball's front (eye_cy - EYE_R - 3 mm). READ: a small lens disc shows; the bezel still
   does not read as a camera; the coil is in neither three-quarter portrait.

## FOR THE NEXT LANE (what the three loops say)
- SCALE: at the portrait's 128 px a 0.36 m head is about 2.5 mm a pixel, so a 30 mm part is 12 px and a 4 mm light is 1 to 2 px.
  An implant that reads at 128 px is a SHAPE against the face's outline, not a detail inside it: a housing that sticks out past the
  brow or the cheek line, a cable that crosses the face's edge, a coil that breaks the head's silhouette.
- CHECK THE GEOMETRY IN THE RENDER'S OWN VIEW FIRST: print each piece's box against portrait_head_eyes and portrait_head_lids (the
  scratch script in this lane's handoff did); the lids sit 3 mm in front of the eyeball.
- WHICH SIDE THE CAMERA SEES: the portraits are S, SE, SW after the rig's 180 degree base turn; put a part where one of those three
  looks (find it with a planted bright test colour before the real material).
- THE FIGHT'S SIZE IS THE HARDER BAR (rule 486's 'at fight size'): a head is about 10 px there; only the ARM reads (a socket and a
  powered hand, a different colour and outline from a sleeve), so the next build is likely the arm on the body
  (tools/bohemia_character_the_thirteen_through_the_rig.py extra(), or the nine enemies' gear pieces), with the eye and the ear as
  the face's detail.

[bb Battle Brothers' wounded veterans carry their injuries for good; ours can buy one back, at a price.]
[analog horror: a red light where a man's right eye was, blinking on when he looks at you.]
