-- report.lua: THE PIXEL-COUNT-AND-PALETTE REPORT the pipe gate reads (row [aseprite in the pipe]).
-- usage: aseprite -b --script-param in=X.png --script-param out=X.report.json [--script-param palette=PACK.gpl] --script tools/aseprite/report.lua
-- Counts every pixel of frame 1: size, colour mode, palette, opaque and half-see-through pixels, distinct colours,
-- strays (no neighbour of their own colour in all eight), and with palette= the colours that are not in it.
local here = app.fs.filePath((debug.getinfo(1, 'S').source:gsub('^@', '')))
local L = dofile(app.fs.joinPath(here, 'lib.lua'))

local spr = L.open(L.param('in'))
local img = L.flat(spr, 1)
local w, h = img.width, img.height
local key, opaque, half, colours, n = {}, 0, 0, {}, 0
for y = 0, h - 1 do
  for x = 0, w - 1 do
    local r, g, b, a = L.rgba_of(spr, img:getPixel(x, y))
    local k = a == 0 and '' or string.format('%02x%02x%02x%02x', r, g, b, a)
    key[y * w + x] = k
    if a > 0 then
      if a == 255 then opaque = opaque + 1 else half = half + 1 end
      if not colours[k] then colours[k] = 0; n = n + 1 end
      colours[k] = colours[k] + 1
    end
  end
end
local strays = 0
for y = 0, h - 1 do
  for x = 0, w - 1 do
    local k = key[y * w + x]
    if k ~= '' then
      local same = false
      for dy = -1, 1 do
        for dx = -1, 1 do
          if (dx ~= 0 or dy ~= 0) and x + dx >= 0 and x + dx < w and y + dy >= 0 and y + dy < h
             and key[(y + dy) * w + x + dx] == k then same = true end
        end
      end
      if not same then strays = strays + 1 end
    end
  end
end
local out = L.started('report')
out['in'] = L.param('in')
out.width, out.height, out.frames, out.layers = w, h, #spr.frames, #spr.layers
out.color_mode = ({ [ColorMode.RGB] = 'rgb', [ColorMode.GRAY] = 'gray', [ColorMode.INDEXED] = 'indexed' })[spr.colorMode]
out.palette_size = #spr.palettes[1]
if spr.colorMode == ColorMode.INDEXED then out.palette = L.palette_hex(spr.palettes[1]) end
out.opaque, out.half_transparent, out.colours, out.strays = opaque, half, n, strays
local pfile = L.param('palette', '')
if pfile ~= '' then
  local pal = Palette{ fromFile = pfile }
  local inpal = {}
  for i = 0, #pal - 1 do
    local c = pal:getColor(i)
    inpal[string.format('%02x%02x%02x', c.red, c.green, c.blue)] = true
  end
  local off, offpx = 0, 0
  for k, c in pairs(colours) do
    if not inpal[k:sub(1, 6)] then off = off + 1; offpx = offpx + c end
  end
  out.palette_checked, out.colours_off_palette, out.pixels_off_palette = pfile, off, offpx
end
L.write_json(L.param('out'), out)
print(json.encode({ report = L.param('out'), colours = n, strays = strays, opaque = opaque }))
