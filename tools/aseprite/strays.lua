-- strays.lua: STRAY-PIXEL REMOVAL (row [aseprite in the pipe]; the same rule as the vendored server's
-- remove_stray_pixels, so the two agree).
-- usage: aseprite -b --script-param in=X.png --script-param out=OUT.png [--script-param protect=rrggbb,rrggbb] --script tools/aseprite/strays.lua
-- A stray is an opaque pixel none of whose eight neighbours is its own colour. It takes the commonest colour among
-- its opaque neighbours, so no new colour can appear; a diagonal same-colour neighbour is a dither, not dirt, and
-- keeps it; transparent pixels and the silhouette never change; protect= names colours never replaced (an eye
-- glint). Every cel of every layer and frame. Not Aseprite's Despeckle, which is a median and makes new colours.
local here = app.fs.filePath((debug.getinfo(1, 'S').source:gsub('^@', '')))
local L = dofile(app.fs.joinPath(here, 'lib.lua'))

local spr = L.open(L.param('in'))
local protect = {}
for h in string.gmatch(L.param('protect', ''), '[%x]+') do protect[h:lower():sub(1, 6)] = true end
local replaced, seen = 0, 0
for _, cel in ipairs(spr.cels) do
  local src = cel.image
  local img = src:clone()
  local w, h = src.width, src.height
  for y = 0, h - 1 do
    for x = 0, w - 1 do
      local v = src:getPixel(x, y)
      local r, g, b, a = L.rgba_of(spr, v)
      if a > 0 and not protect[string.format('%02x%02x%02x', r, g, b)] then
        local same, count, best, bestn = false, {}, nil, 0
        for dy = -1, 1 do
          for dx = -1, 1 do
            local nx, ny = x + dx, y + dy
            if (dx ~= 0 or dy ~= 0) and nx >= 0 and nx < w and ny >= 0 and ny < h then
              local u = src:getPixel(nx, ny)
              if u == v then same = true end
              local _, _, _, ua = L.rgba_of(spr, u)
              if ua > 0 then
                count[u] = (count[u] or 0) + 1
                if count[u] > bestn then best, bestn = u, count[u] end
              end
            end
          end
        end
        if not same then
          seen = seen + 1
          if best then img:drawPixel(x, y, best); replaced = replaced + 1 end
        end
      end
    end
  end
  cel.image = img
end
spr:saveAs(L.param('out'))
local out = L.started('strays')
out.strays_found, out.replaced, out.skipped_no_opaque_neighbour = seen, replaced, seen - replaced
L.write_json(L.param('out') .. '.json', out)
print(json.encode({ strays = seen, replaced = replaced }))
