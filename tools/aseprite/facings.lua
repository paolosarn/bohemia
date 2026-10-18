-- facings.lua: SPLIT AND STACK EIGHT-FACING SHEETS (row [aseprite in the pipe]; rule 107: a thing that turns has
-- eight facings, and a mirrored half is not a direction).
-- usage: aseprite -b --script-param mode=stack --script-param dir=FOLDER [--script-param pattern=rig_{f}.png] --script-param out=SHEET.png --script tools/aseprite/facings.lua
--  split: aseprite -b --script-param mode=split --script-param in=SHEET.png --script-param dir=FOLDER [--script-param pattern={f}.png] --script tools/aseprite/facings.lua
-- order= sets the facings (N,NE,E,SE,S,SW,W,NW by default). stack: one row, every cell the biggest facing's box,
-- each facing centred on its own floor line, plus SHEET.json (Aseprite's own sheet data, a frame tag per facing)
-- and the facing pairs that are one picture flipped. split: the row cut back into one file per facing.
local here = app.fs.filePath((debug.getinfo(1, 'S').source:gsub('^@', '')))
local L = dofile(app.fs.joinPath(here, 'lib.lua'))

local order = {}
for f in string.gmatch(L.param('order', 'N,NE,E,SE,S,SW,W,NW'), '[^,]+') do order[#order + 1] = f end
local mode, dir = L.param('mode'), L.param('dir')
local out = L.started('facings')
if mode == 'stack' then
  local pattern = L.param('pattern', '{f}.png')
  local imgs, w, h, spec = {}, 0, 0, nil
  for i, f in ipairs(order) do
    local s = L.open(app.fs.joinPath(dir, (pattern:gsub('{f}', f))))
    if s.colorMode ~= ColorMode.RGB then app.command.ChangePixelFormat{ format = 'rgb' } end
    imgs[i] = L.flat(s, 1)
    w, h = math.max(w, s.width), math.max(h, s.height)
    s:close()
  end
  local spr = Sprite(w, h, ColorMode.RGB)
  for i = 2, #order do spr:newEmptyFrame() end
  local layer = spr.layers[1]
  for i, img in ipairs(imgs) do
    spr:newCel(layer, i, img, Point((w - img.width) // 2, h - img.height))
    local tag = spr:newTag(i, i)
    tag.name = order[i]
  end
  -- a facing that is another facing turned over is a mirror, not a direction (rule 107)
  local mirrors = {}
  for i = 1, #imgs do
    for j = i + 1, #imgs do
      local a, b = imgs[i], imgs[j]:clone()
      b:flip(FlipType.HORIZONTAL)
      if a.width == b.width and a.height == b.height and a:isEqual(b) then
        mirrors[#mirrors + 1] = order[i] .. '=' .. order[j] .. ' flipped'
      end
    end
  end
  local sheet = L.param('out')
  app.command.ExportSpriteSheet{ ui = false, askOverwrite = false, type = SpriteSheetType.HORIZONTAL,
    textureFilename = sheet, dataFilename = sheet:gsub('%.png$', '') .. '.sheet.json',
    dataFormat = SpriteSheetDataFormat.JSON_ARRAY, filenameFormat = '{tag}', listTags = true }
  out.facings, out.cell, out.mirrored, out.sheet = order, { w, h }, mirrors, sheet
  out.distinct = #order - #mirrors
  L.write_json(sheet .. '.json', out)
  print(json.encode({ sheet = sheet, facings = #order, mirrored = #mirrors }))
elseif mode == 'split' then
  local pattern = L.param('pattern', '{f}.png')
  local spr = L.open(L.param('in'))
  local img = L.flat(spr, 1)
  local cw = spr.width // #order
  if cw * #order ~= spr.width then error(string.format('the sheet is %d wide, not %d facings of one width', spr.width, #order)) end
  local files = {}
  for i, f in ipairs(order) do
    local part = Image(img, Rectangle((i - 1) * cw, 0, cw, spr.height))
    local p = app.fs.joinPath(dir, (pattern:gsub('{f}', f)))
    part:saveAs{ filename = p, palette = spr.palettes[1] }
    files[#files + 1] = p
  end
  out.files, out.cell = files, { cw, spr.height }
  L.write_json(app.fs.joinPath(dir, 'facings.json'), out)
  print(json.encode({ split = #files }))
else
  error('mode must be stack or split')
end
