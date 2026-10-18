-- BOHEMIA: the shared half of the Aseprite job scripts (PLUMBER 10/18/26, VAMILY row [aseprite in the pipe]).
-- Every job in this folder runs headless, the same way:
--   aseprite -b --script-param in=IN.png --script-param out=OUT.png ... --script tools/aseprite/<job>.lua
-- and writes OUT plus OUT.json (what it did, in numbers). No job holds a colour or a coordinate: the colours come
-- from the picture or from his pack piece, the shapes from Aseprite's own commands.
local M = {}

function M.param(name, default)
  local v = app.params[name]
  if v == nil or v == '' then
    if default == nil then error('missing --script-param ' .. name .. '=...') end
    return default
  end
  return v
end

function M.num(name, default)
  local v = tonumber(M.param(name, default ~= nil and tostring(default) or nil))
  if v == nil then error('--script-param ' .. name .. ' must be a number') end
  return v
end

-- one file, one picture: his pack pieces are named pack_..._000.png, and Aseprite opens a numbered name as the
-- whole sequence (000, 001, ... as frames) unless it is told oneFrame (measured 10/18: 24 frames from one tile)
function M.open(path)
  if not app.fs.isFile(path) then error('no file at ' .. path) end
  local multi = app.fs.fileExtension(path):lower() == 'aseprite'
  local s = multi and app.open(path) or Sprite{ fromFile = path, oneFrame = true }
  if not s then error('Aseprite cannot open ' .. path) end
  return s
end

function M.hex(c)
  return string.format('%02x%02x%02x%02x', c.red, c.green, c.blue, c.alpha)
end

function M.palette_hex(pal)
  local t = {}
  for i = 0, #pal - 1 do t[#t + 1] = M.hex(pal:getColor(i)) end
  return t
end

-- the colour of a pixel value as r, g, b, a whatever the sprite's mode
function M.rgba_of(spr, v)
  if spr.colorMode == ColorMode.INDEXED then
    if v == spr.transparentColor then return 0, 0, 0, 0 end
    local c = spr.palettes[1]:getColor(v)
    return c.red, c.green, c.blue, c.alpha
  elseif spr.colorMode == ColorMode.GRAY then
    local g, a = app.pixelColor.grayaV(v), app.pixelColor.grayaA(v)
    return g, g, g, a
  end
  local pc = app.pixelColor
  return pc.rgbaR(v), pc.rgbaG(v), pc.rgbaB(v), pc.rgbaA(v)
end

-- the whole sprite at one frame, flattened, in the sprite's own colour mode
function M.flat(spr, frame)
  local img = Image(spr.spec)
  img:drawSprite(spr, frame or 1)
  return img
end

function M.write_json(path, t)
  local f = assert(io.open(path, 'w'))
  f:write(json.encode(t))
  f:close()
end

function M.started(job)
  return { job = job, aseprite = tostring(app.version), params = (function()
    local p = {}
    for k, v in pairs(app.params) do p[k] = v end
    return p
  end)() }
end

return M
