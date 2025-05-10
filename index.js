require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Set up file upload
const upload = multer({ dest: 'uploads/' });

// Virus scan route
app.post('/scan', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    
    // Call the C++ scanner
    exec(`./scanner ${filePath}`, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: stderr });
        }
        res.status(200).json({ message: stdout });
    });
});

// File compression route
app.post('/compress', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    // Call AI Compression C++ code
    exec(`./compressor ${filePath}`, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: stderr });
        }
        res.status(200).json({ message: stdout });
    });
});

// Video Upscaling route
app.post('/upscale', upload.single('video'), (req, res) => {
    const videoPath = req.file.path;

    // Detect GPU for scaling
    exec('lspci | grep VGA', (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: stderr });
        }
        
        const gpuVendor = stdout.includes('NVIDIA') ? 'NVIDIA' :
                          stdout.includes('AMD') ? 'AMD' : 'Intel';
        
        // Call the C++ upscaler
        exec(`./upscaler ${videoPath} ${gpuVendor}`, (err, stdout, stderr) => {
            if (err) {
                return res.status(500).json({ error: stderr });
            }
            res.status(200).json({ message: stdout });
        });
    });
});

// Spotify route (OAuth token handling and info fetching)
app.get('/spotify', (req, res) => {
    const { accessToken } = req.query;

    axios.get(`https://api.spotify.com/v1/me/player/currently-playing`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).json({ error: 'Spotify data fetch error' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
