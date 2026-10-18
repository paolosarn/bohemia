-- snap.lua: SNAP TO THE PACK PALETTE, INDEXED (row [aseprite in the pipe]; rule 114: one shared palette).
-- usage: aseprite -b --script-param in=OURS.png --script-param palette=PACK_PIECE.png --script-param out=OUT.png [--script-param colors=256] [--script-param palette_out=OUT.gpl] --script tools/aseprite/snap.lua
-- palette= is one of his pack pieces (its colours quantized by Aseprite to colors=, 256 by default) or a palette
-- file (.gpl .pal .act .hex). Every pixel of OURS goes to the nearest entry, no dithering; the result is an
-- indexed PNG whose palette IS the pack's, entry for entry. pixelize stays the fallback snap when Aseprite is absent.
local here = app.fs.filePath((debug.getinfo(1, 'S').source:gsub('^@', '')))
local L = dofile(app.fs.joinPath(here, 'lib.lua'))

local src, colors = L.param('palette'), L.num('colors', 256)
local pal
local ext = app.fs.fileExtension(src):lower()
if ext == 'gpl' or ext == 'pal' or ext == 'act' or ext == 'hex' then
  pal = Palette{ fromFile = src }
else
  local t = L.open(src)
  if t.colorMode ~= ColorMode.INDEXED then
    app.command.ColorQuantization{ ui = false, withAlpha = false, maxColors = colors }
  end
  pal = Palette(t.palettes[1])
  t:close()
end
local spr = L.open(L.param('in'))
local was = spr.colorMode
if spr.colorMode ~= ColorMode.RGB then app.command.ChangePixelFormat{ format = 'rgb' } end
spr:setPalette(pal)
app.command.ChangePixelFormat{ format = 'indexed', dithering = 'none' }
spr:saveAs(L.param('out'))
local po = L.param('palette_out', '')
if po ~= '' then spr.palettes[1]:saveAs(po) end
local out = L.started('snap')
out.from_mode = ({ [ColorMode.RGB] = 'rgb', [ColorMode.GRAY] = 'gray', [ColorMode.INDEXED] = 'indexed' })[was]
out.palette_source, out.palette_size, out.palette = src, #spr.palettes[1], L.palette_hex(spr.palettes[1])
out.out, out.palette_out = L.param('out'), po
L.write_json(L.param('out') .. '.json', out)
print(json.encode({ snapped = L.param('out'), palette = #spr.palettes[1] }))
