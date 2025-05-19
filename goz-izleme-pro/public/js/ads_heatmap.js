// js/ads_heatmap.js
console.log('ads_heatmap.js is initialized, runAdsHeatmap:', runAdsHeatmap);
// Reklam dosyaları
const ads = [
    'ads/ad.jpeg',
    'ads/du.jpeg',
    'ads/honda.jpeg',
    'ads/mcDonalds.jpeg',
    'ads/nosporlas.jpeg'
];

let heatmapImages = [];

/**
 * Captures the current heatmap as a blob
 */
function captureHeatmap(adName) {
    const adImg = document.getElementById('ad-image');
    const hmCanvas = document.querySelector('#heatmapContainer canvas');
    const w = adImg.clientWidth, h = adImg.clientHeight;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = w; exportCanvas.height = h;
    const ctx = exportCanvas.getContext('2d');
    ctx.drawImage(adImg, 0, 0, w, h);
    ctx.drawImage(hmCanvas, 0, 0, w, h);
    
    return new Promise(resolve => {
        exportCanvas.toBlob(blob => {
            resolve({
                name: adName.replace(/\W+/g,'_') + '_heatmap.png',
                blob: blob
            });
        }, 'image/png');
    });
}

/**
 * Look at ads one by one, heatmap, save
 */
async function runAdsHeatmap() {
    console.log('🚀 runAdsHeatmap başladı');
    const adWrapper = document.getElementById('ad-wrapper');
    const adImg     = document.getElementById('ad-image');
    const hmCont    = document.getElementById('heatmapContainer');
    
    heatmapImages = []; // Reset heatmap images array

    for (let adPath of ads) {
        // Reset
        hmCont.innerHTML = '';
        // Show ad
        adImg.src = adPath;
        adWrapper.style.display = 'block';
        // New heatmap instance
        heatmapInstance = h337.create({
            container: hmCont,
            radius: 30,
            maxOpacity: 0.6,
            minOpacity: 0,
            blur: 0.85
        });
        // Gather information for 10 seconds
        await new Promise(r => setTimeout(r, 10000));
        // Capture and store heatmap
        const heatmapData = await captureHeatmap(adPath.split('/').pop());
        heatmapImages.push(heatmapData);
    }

    adWrapper.style.display = 'none';
    
    // Show feedback form
    $('#feedbackModal').modal('show');
}

// Handle form submission
document.getElementById('userFeedbackForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Create form data object
    const formData = {
        name: document.getElementById('userName').value,
        age: parseInt(document.getElementById('userAge').value),
        gender: document.getElementById('userGender').value,
        email: document.getElementById('userEmail').value || 'Not provided',
        feedback: document.getElementById('userFeedback').value || 'No feedback provided',
        timestamp: new Date().toISOString()
    };

    // Create ZIP file
    const zip = new JSZip();
    
    // Add form data as JSON
    zip.file('form-data.json', JSON.stringify(formData, null, 2));
    
    // Add all heatmap images
    for (const heatmap of heatmapImages) {
        zip.file(`heatmaps/${heatmap.name}`, heatmap.blob);
    }

    try {
        // Generate ZIP file
        const content = await zip.generateAsync({type: 'blob'});
        const fileName = `eye-tracking-results-${formData.name}-${new Date().toISOString().split('T')[0]}.zip`;
        saveAs(content, fileName);
        
        // Show success message and close modal
        $('#feedbackModal').modal('hide');
        swal({
            title: "Thank you!",
            text: "Your feedback and results have been saved successfully.",
            icon: "success",
            button: "OK"
        });
    } catch (error) {
        console.error('Error creating ZIP file:', error);
        swal({
            title: "Error",
            text: "There was an error saving your results. Please try again.",
            icon: "error",
            button: "OK"
        });
    }
});

window.runAdsHeatmap = runAdsHeatmap;

