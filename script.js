const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const resultContainer = document.getElementById('resultContainer');

uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Call the server to scan the file
    fetch('/scan', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.virusDetected) {
            resultContainer.textContent = 'Error: Virus detected in the file.';
            return;
        }

        // File is clean, now we need to compress and upscale it

        // Call the server for file compression
        fetch('/compress', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(compressedData => {
            resultContainer.textContent = `File compressed successfully. File size: ${compressedData.size}`;

            // Check if the file is a video (for upscaling)
            if (compressedData.isVideo) {
                const videoFilePath = compressedData.filePath;

                // Call the server for video upscaling
                fetch('/upscale', {
                    method: 'POST',
                    body: JSON.stringify({ videoPath: videoFilePath }),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(res => res.json())
                .then(upscaledData => {
                    resultContainer.textContent += `\nVideo upscaled successfully. Quality: ${upscaledData.quality}`;
                })
                .catch(err => {
                    resultContainer.textContent += '\nError during video upscaling.';
                });
            }
        })
        .catch(err => {
            resultContainer.textContent = 'Error during file compression.';
        });
    })
    .catch(err => {
        resultContainer.textContent = 'Error during file scan.';
    });
});
