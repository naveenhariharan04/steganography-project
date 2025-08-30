const extractImageInput = document.getElementById('extractImageInput');
const decryptionKeyInput = document.getElementById('decryptionKeyInput');
const extractBtn = document.getElementById('extractBtn');
const extractedMessageOutput = document.getElementById('extractedMessageOutput');
const extractStatus = document.getElementById('extractStatus');
const END_OF_MESSAGE = '#####END_OF_MESSAGE#####';

const stringToBinary = (str) => str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8,'0')).join('');
const binaryToString = (bin) => {
    let str = '';
    for (let i = 0; i < bin.length; i += 8) {
        str += String.fromCharCode(parseInt(bin.substring(i, i + 8), 2));
    }
    return str;
};

extractBtn.onclick = () => {
    const file = extractImageInput.files[0];
    const key = decryptionKeyInput.value;

    if (!file || !key) {
        extractStatus.textContent = 'Please provide both the image and decryption key.';
        extractStatus.style.color = '#ef4444';
        return;
    }

    extractStatus.textContent = 'Extracting and decrypting message...';
    extractStatus.style.color = '#4b5563';
    extractedMessageOutput.value = '';

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let binaryMessage = '';
            let foundMessage = false;

            for (let i = 0; i < pixels.length; i++) {
                if ((i + 1) % 4 === 0) continue;
                const bit = pixels[i] & 1;
                binaryMessage += bit;

                if (binaryMessage.length >= stringToBinary(END_OF_MESSAGE).length) {
                    const potentialEnd = binaryToString(binaryMessage);
                    if (potentialEnd.endsWith(END_OF_MESSAGE)) {
                        const encryptedMessage = potentialEnd.slice(0, -END_OF_MESSAGE.length);
                        try {
                            const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, key, { mode: CryptoJS.mode.ECB });
                            const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
                            
                            if (decryptedMessage) {
                                extractedMessageOutput.value = decryptedMessage;
                                extractStatus.textContent = 'Message extracted and decrypted successfully!';
                                extractStatus.style.color = '#22c55e';
                                foundMessage = true;
                            } else {
                                throw new Error('Decryption failed, check the key.');
                            }
                        } catch (e) {
                            extractedMessageOutput.value = '';
                            extractStatus.textContent = 'Decryption failed: Invalid key or corrupt data.';
                            extractStatus.style.color = '#ef4444';
                        }
                        break;
                    }
                }
            }

            if (!foundMessage) {
                extractedMessageOutput.value = '';
                extractStatus.textContent = 'No secret message found or the image is corrupt.';
                extractStatus.style.color = '#ef4444';
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
};
