-- File: embed_handler.lua

local cjson = require("cjson")

-- Allowed MIME types
local allowed_types = {
  ["audio/aac"] = true,        -- .he-aac (treated as .aac)
  ["image/avif"] = true,       -- .avif
  ["image/heif"] = true,       -- .heif
  ["video/heif"] = true        -- .heif for video content
}

-- Helper to check file type
local function is_allowed_type(mime_type)
  return allowed_types[mime_type] or false
end

-- Endpoint for embedding file metadata (or rendering)
local function handle_file_upload(req)
  local file = req.params.file
  local file_type = req.headers["Content-Type"]

  if not file or not file_type then
    return { status = 400, body = "Missing file or content type." }
  end

  if not is_allowed_type(file_type) then
    return { status = 415, body = "Unsupported media type." }
  end

  -- Save or process file here (this example just returns metadata)
  local metadata = {
    filename = file.filename,
    mime_type = file_type,
    embed_code = string.format("<embed src='%s' type='%s' />", file.filename, file_type)
  }

  return {
    status = 200,
    headers = { ["Content-Type"] = "application/json" },
    body = cjson.encode(metadata)
  }
end

return handle_file_upload
