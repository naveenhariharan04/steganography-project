const embedImageInput = document.getElementById('embedImageInput');
const messageInput = document.getElementById('messageInput');
const encryptionKeyInput = document.getElementById('encryptionKeyInput');
const embedBtn = document.getElementById('embedBtn');
const embedCanvas = document.getElementById('embedCanvas');
const downloadLink = document.getElementById('downloadLink');
const embedStatus = document.getElementById('embedStatus');
const END_OF_MESSAGE = '#####END_OF_MESSAGE#####';

const stringToBinary = (str) => str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join('');

embedBtn.onclick = () => {
    const file = embedImageInput.files[0];
    const message = messageInput.value.trim();
    const key = encryptionKeyInput.value;

    if (!file || !message || !key) {
        embedStatus.textContent = 'Please provide all inputs (image, message, key).';
        embedStatus.style.color = '#ef4444';
        return;
    }

    embedStatus.textContent = 'Encrypting and embedding message...';
    embedStatus.style.color = '#4b5563';
    downloadLink.style.display = 'none';

    const encryptedMessage = CryptoJS.AES.encrypt(message, key, { mode: CryptoJS.mode.ECB }).toString();
    const messageToEmbed = encryptedMessage + END_OF_MESSAGE;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            embedCanvas.width = img.width;
            embedCanvas.height = img.height;
            const ctx = embedCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, embedCanvas.width, embedCanvas.height);
            const pixels = imageData.data;
            const binaryMessage = stringToBinary(messageToEmbed);

            if (binaryMessage.length > pixels.length / 4 * 3) {
                embedStatus.textContent = 'Message too large for this image.';
                embedStatus.style.color = '#ef4444';
                return;
            }

            let messageIndex = 0;
            for (let i = 0; i < pixels.length && messageIndex < binaryMessage.length; i++) {
                if ((i + 1) % 4 === 0) continue;
                pixels[i] = (pixels[i] & 0xFE) | parseInt(binaryMessage[messageIndex]);
                messageIndex++;
            }

            ctx.putImageData(imageData, 0, 0);
            embedCanvas.style.display = 'block';
            downloadLink.href = embedCanvas.toDataURL('image/png');
            downloadLink.style.display = 'block';

            embedStatus.textContent = 'Message embedded successfully!';
            embedStatus.style.color = '#22c55e';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
};
