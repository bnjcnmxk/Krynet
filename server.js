const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const NodeClam = require('clamscan');

const app = express();
const port = 3000;

// Multer setup to store uploads in ./uploads
const upload = multer({ dest: 'uploads/' });

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
            path: 'clamscan', // or the full path if it's not in PATH
            db: null,
            scanArchives: true,
        },
    });
    clam = clamscan;
})();

// Endpoint: Upload & scan file
app.post('/scan', upload.single('file'), async (req, res) => {
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
    console.log(`Server running at http://localhost:${port}`);
});
