-- outline.lua: A ONE-PIXEL OUTLINE, ON OR OFF (row [aseprite in the pipe]; the style guide's outline rule per class).
-- usage: aseprite -b --script-param in=X.png --script-param out=OUT.png [--script-param mode=on|off] [--script-param color=darkest|INDEX] [--script-param place=outside|inside] [--script-param matrix=circle|square] --script tools/aseprite/outline.lua
-- on: Aseprite's own Outline filter, one pixel, in the picture's own darkest colour (or palette entry INDEX of an
-- indexed picture). off: the picture's outermost ring of pixels taken away (select the content, contract one,
-- clear the rest), whatever its colour: on a piece that wears a drawn outline that ring IS the outline. off after
-- on gives the silhouette back all but where the art is one pixel thin (2 of 8,532 pixels on his cobblestone).
local here = app.fs.filePath((debug.getinfo(1, 'S').source:gsub('^@', '')))
local L = dofile(app.fs.joinPath(here, 'lib.lua'))

local spr = L.open(L.param('in'))
local mode = L.param('mode', 'on')
local function opaque_count()
  local img, n = L.flat(spr, 1), 0
  for p in img:pixels() do
    local _, _, _, a = L.rgba_of(spr, p())
    if a > 0 then n = n + 1 end
  end
  return n
end
local before = opaque_count()
local out = L.started('outline')
if mode == 'on' then
  local want, color = L.param('color', 'darkest'), nil
  if spr.colorMode == ColorMode.INDEXED then
    local pal, best, bi = spr.palettes[1], 1e9, nil
    if want == 'darkest' then
      for i = 0, #pal - 1 do
        local c = pal:getColor(i)
        local lum = 0.299 * c.red + 0.587 * c.green + 0.114 * c.blue
        if i ~= spr.transparentColor and c.alpha == 255 and lum < best then best, bi = lum, i end
      end
    else
      bi = math.tointeger(tonumber(want))
    end
    color = Color{ index = bi }
    out.color_index = bi
  else
    local img, best = L.flat(spr, 1), 1e9
    for p in img:pixels() do
      local r, g, b, a = L.rgba_of(spr, p())
      local lum = 0.299 * r + 0.587 * g + 0.114 * b
      if a == 255 and lum < best then best, color = lum, Color{ r = r, g = g, b = b, a = a } end
    end
  end
  if not color then error('the picture has no opaque pixel to take an outline colour from') end
  out.color = L.hex(color)
  app.command.Outline{ ui = false, place = L.param('place', 'outside'), matrix = L.param('matrix', 'circle'), color = color }
elseif mode == 'off' then
  app.command.MaskContent()
  app.command.ModifySelection{ ui = false, modifier = 'contract', quantity = 1, brush = L.param('matrix', 'circle') }
  app.command.InvertMask()
  app.command.Clear()
  app.command.DeselectMask()
else
  error('mode must be on or off')
end
out.mode, out.opaque_before, out.opaque_after = mode, before, opaque_count()
out.pixels_changed = math.abs(out.opaque_after - out.opaque_before)
spr:saveAs(L.param('out'))
L.write_json(L.param('out') .. '.json', out)
print(json.encode({ outline = mode, before = before, after = out.opaque_after }))
