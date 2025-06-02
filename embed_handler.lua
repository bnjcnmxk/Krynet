local cjson = require("cjson")
local upload_dir = "/var/www/krynet/uploads/"

-- Allowed MIME types + extensions
local allowed_mime = {
  ["audio/aac"] = ".he-aac",
  ["image/avif"] = ".avif",
  ["image/heif"] = ".heif",
  ["video/heif"] = ".heif"
}

local function get_extension(mime)
  return allowed_mime[mime]
end

return function(req)
  local file = req.params.file
  local mime = req.headers["Content-Type"]

  if not file or not mime then
    return { status = 400, body = cjson.encode({ message = "File or MIME type missing." }) }
  end

  if not allowed_mime[mime] then
    return { status = 415, body = cjson.encode({ message = "Unsupported file type." }) }
  end

  local ext = get_extension(mime)
  local filename = os.date("%Y%m%d_%H%M%S") .. ext
  local path = upload_dir .. filename

  -- Save file
  local f = io.open(path, "wb")
  f:write(file.content)
  f:close()

  return {
    status = 200,
    headers = { ["Content-Type"] = "application/json" },
    body = cjson.encode({
      filename = "/uploads/" .. filename,
      mime_type = mime,
      embed_url = "/uploads/" .. filename
    })
  }
end
