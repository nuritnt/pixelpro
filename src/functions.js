const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const blackWhiteBtn = document.getElementById('blackWhiteBtn');
const downloadBtn = document.getElementById('downloadBtn');
let originalImageData;

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            blackWhiteBtn.style.display = 'block';
            downloadBtn.style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

blackWhiteBtn.addEventListener('click', function() {
    toggleBlackWhite();
});

function toggleBlackWhite() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const originalData = originalImageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (originalData[i] + originalData[i + 1] + originalData[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
}

downloadBtn.addEventListener('click', function() {
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL();
    downloadLink.download = 'filtered_image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});