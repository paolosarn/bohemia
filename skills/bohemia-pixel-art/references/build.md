# THE BUILD ORDER, STAGE BY STAGE (each looked at before the next)

1. SOURCE. Choose the pack tiles (or the CC0 model, or the generator call with his tiles as the reference). Write the
   bank paths down; they ride on the sheet.
2. SILHOUETTE. Fill the shape with one value. Shrink to 16 x 16. If you cannot tell what it is, the shape is wrong;
   nothing after this fixes it.
3. BIG SHAPES AND LIGHT. Light from above, a little from the left. Lit planes, shadow planes, one step between them.
4. RAMPS. Take the family palette. Warm toward the light, cool toward the shadow; never only darker.
5. DETAIL. Wear where it would be: the kerb where tyres hit, the door where hands push, the foot of a wall where water
   sat. Authored, never a noise layer.
6. EDGE. The family's rule: no line on the ground, a soft ring on props and lamps, 1 px dark brown on buildings, a hard
   frame on doors.
7. SEAT IT. A contact shadow down-right. Lay it next to nine of its family at 1:1. Run the check. Look again.

At every stage: render at 1x, 8x and 16 x 16; write what is wrong in words; fix; repeat. The log (cycle, fault, fix)
rides with the asset.
