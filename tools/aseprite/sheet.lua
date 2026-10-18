-- sheet.lua: A FRAME SHEET PLUS ITS JSON (row [aseprite in the pipe]; what the game and the rig's clip tables read).
-- usage: aseprite -b --script-param in=CLIP.aseprite --script-param out=SHEET.png [--script-param type=horizontal|rows|columns|packed] --script tools/aseprite/sheet.lua
-- Aseprite's own sprite sheet export: every frame, its duration and its tags, written as SHEET.png and
-- SHEET.sheet.json (JSON array), and a SHEET.png.json saying what was exported.
local here = app.fs.filePath((debug.getinfo(1, 'S').source:gsub('^@', '')))
local L = dofile(app.fs.joinPath(here, 'lib.lua'))

local spr = L.open(L.param('in'))
local types = { horizontal = SpriteSheetType.HORIZONTAL, rows = SpriteSheetType.ROWS,
                columns = SpriteSheetType.COLUMNS, packed = SpriteSheetType.PACKED }
local t = types[L.param('type', 'horizontal')]
if not t then error('type must be horizontal, rows, columns or packed') end
local sheet = L.param('out')
local data = sheet:gsub('%.png$', '') .. '.sheet.json'
app.command.ExportSpriteSheet{ ui = false, askOverwrite = false, type = t, textureFilename = sheet,
  dataFilename = data, dataFormat = SpriteSheetDataFormat.JSON_ARRAY, listTags = true, listLayers = false }
local out = L.started('sheet')
out.frames, out.tags, out.sheet, out.data = #spr.frames, {}, sheet, data
for _, tag in ipairs(spr.tags) do out.tags[#out.tags + 1] = { name = tag.name, from = tag.fromFrame.frameNumber, to = tag.toFrame.frameNumber } end
L.write_json(sheet .. '.json', out)
print(json.encode({ sheet = sheet, frames = #spr.frames }))
