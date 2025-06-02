import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import NodeClam from 'clamscan';

const app = express();
const port = 3000;

// Set allowed MIME types/extensions
const allowedTypes = [
  'audio/aac', // he-aac
  'image/heif',
  'image/avif',
  'video/heif',  
  'text/plain'
];

const allowedExt = ['.he-aac', '.heif', '.avif', '.txt'];

// Multer setup to store uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(file.mimetype) || allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('❌ File type not allowed.'));
    }
  }
});

// Initialize ClamAV
let clam;
(async () => {
  const clamscan = await new NodeClam().init({
    removeInfected: false,
    quarantineInfected: false,
    scanLog: null,
    debugMode: false,
    fileList: null,
    scanRecursively: true,
    clamscan: {
      path: 'clamscan',
      db: null,
      scanArchives: true
    }
  });
  clam = clamscan;
})();

// Upload & scan endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  const filePath = path.join(__dirname, req.file.path);

  try {
    const result = await clam.isInfected(filePath);
    const message = result.infected
      ? `⚠️ Infected with: ${result.viruses.join(', ')}`
      : '✅ File is clean.';

    // Delete file after scan
    fs.unlinkSync(filePath);

    res.json({ message });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ message: 'Error scanning file.' });
  }
});

app.listen(port, () => {
  console.log(`🟢 Krynet embed handler running: http://localhost:${port}`);
});
