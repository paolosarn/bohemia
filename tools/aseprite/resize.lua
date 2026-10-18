-- resize.lua: BLUR-FREE RESIZE (row [aseprite in the pipe]; rule 114's first tell: mixels).
-- usage: aseprite -b --script-param in=X.png --script-param out=OUT.png --script-param scale=2 --script tools/aseprite/resize.lua
--        (scale=K or scale=1/K for a whole number K; width= and height= instead for an exact box, which must be a
--        whole multiple or divisor of the picture's own size unless allow_fraction=1)
-- Nearest neighbour only: no new colour is made and every source pixel stays one square block. A fractional
-- scale makes runs of two lengths (the fractional grid TWIN GATE's GRID ruler fails) and is refused by default.
local here = app.fs.filePath((debug.getinfo(1, 'S').source:gsub('^@', '')))
local L = dofile(app.fs.joinPath(here, 'lib.lua'))

local spr = L.open(L.param('in'))
local w0, h0 = spr.width, spr.height
local s = L.param('scale', '')
local sx, sy
if s ~= '' then
  local a, b = s:match('^(%d+)/(%d+)$')
  local f = a and tonumber(a) / tonumber(b) or tonumber(s)
  if not f or f <= 0 then error('scale must be a number or K/N') end
  sx, sy = f, f
else
  sx, sy = L.num('width') / w0, L.num('height') / h0
end
local function whole(f)
  return math.abs(f - math.floor(f + 0.5)) < 1e-9 or math.abs(1 / f - math.floor(1 / f + 0.5)) < 1e-9
end
if L.param('allow_fraction', '0') ~= '1' and not (whole(sx) and whole(sy)) then
  error(string.format('refused: a %.4g x %.4g resize makes a fractional pixel grid (mixels); use a whole K or 1/K, or allow_fraction=1', sx, sy))
end
app.command.SpriteSize{ ui = false, width = math.floor(w0 * sx + 0.5), height = math.floor(h0 * sy + 0.5), method = 'nearest' }
spr:saveAs(L.param('out'))
local out = L.started('resize')
out.from, out.to, out.scale = { w0, h0 }, { spr.width, spr.height }, { sx, sy }
L.write_json(L.param('out') .. '.json', out)
print(json.encode(out.to))
