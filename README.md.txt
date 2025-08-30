# Image Steganography Project 🎨🔒

This project is a web-based application for hiding messages inside image files using steganography. It uses the **Least Significant Bit (LSB)** technique to embed a secret message within the image data and employs **AES encryption** to secure the message.

The application is built using plain HTML, CSS, and JavaScript, making it simple to run and understand.

## Features ✨

- **Embed a Message:** Encrypt a text message with a key and hide it inside a PNG image.
- **Extract a Message:** Decrypt and retrieve the hidden message from a steganographic PNG image using the correct key.
- **Secure:** Messages are protected with AES encryption. If an incorrect key is used for extraction, the encrypted message is displayed, preventing unauthorized access to the plaintext.
- **User-Friendly Interface:** The application has a clean and simple interface, making the process of embedding and extracting messages straightforward.

## How It Works 🧠

- **Embedding:** The application takes a message and an encryption key, encrypts the message using **CryptoJS AES encryption**, and then converts the encrypted text into a binary string. It iterates through the pixel data of the image and modifies the least significant bit of each color channel (red, green, blue) to encode the binary data. A special end-of-message marker is added to signal where the hidden message ends.
- **Extracting:** The application reads the pixel data from the steganographic image, extracts the least significant bits, and reconstructs the binary string. It then checks for the end-of-message marker to determine the length of the hidden data. Finally, it uses the provided decryption key to attempt to decrypt the message.

## Project Structure 📂

The project is organized into three main folders:

- `css/`: Contains the stylesheets for each HTML page (`index.css`, `embedd.css`, `extract.css`).
- `js/`: Contains the JavaScript logic for embedding (`embedd.js`) and extracting (`extract.js`) messages.
- `html files`: The main web pages (`index.html`, `embedd.html`, `extract.html`) that structure the user interface.

## Getting Started 🚀

To use this project, simply download or clone the repository and open the `index.html` file in a web browser.

1.  **Open `index.html`:** This will take you to the main home page.
2.  **Embed a Message:** Click "Embed a Message," select a PNG image, type your secret message and an encryption key, and click "Embed." The application will generate a new image for you to download.
3.  **Extract a Message:** Click "Extract a Message," upload the steganographic image, enter the correct decryption key, and click "Extract." The hidden message will appear in the text area. If the key is wrong, you will see the garbled, encrypted message.

---

### Technologies Used 💻

- **HTML:** For the page structure.
- **CSS:** For styling the user interface.
- **JavaScript:** For the core steganography and encryption logic.
- **CryptoJS:** A third-party library used for AES encryption and decryption.