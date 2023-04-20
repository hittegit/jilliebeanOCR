const robot = require('robotjs');
const { TesseractWorker } = require('tesseract.js');
const Jimp = require('jimp');
const translate = require('google-translate-api');
const worker = new TesseractWorker();

const TRANSLATION_KEY = 'q'; // Change this to your desired trigger key

function captureScreen() {
  const screenSize = robot.getScreenSize();
  const capture = robot.screen.capture(0, 0, screenSize.width, screenSize.height);

  return new Promise((resolve, reject) => {
    Jimp.create(screenSize.width, screenSize.height, (err, image) => {
      if (err) reject(err);

      for (let x = 0; x < screenSize.width; x++) {
        for (let y = 0; y < screenSize.height; y++) {
          const index = (y * screenSize.width + x) * 4;
          const color = Jimp.rgbaToInt(
            capture.image[index],
            capture.image[index + 1],
            capture.image[index + 2],
            capture.image[index + 3]
          );
          image.setPixelColor(color, x, y);
        }
      }

      resolve(image);
    });
  });
}

async function translateText() {
 
    try {
        const image = await captureScreen();
        const result = await worker.recognize(image.bitmap, 'eng'); // Replace 'eng' with 'jpn' for Japanese games
        const translatedResult = await translate(result.text, { from: 'ja', to: 'en' });
    
        const translatedTextElement = document.getElementById('translatedText');
        translatedTextElement.innerText = translatedResult.text;
      } catch (error) {
        console.error('Error during translation:', error);
      }
    }
    
    function checkKeyPress() {
      if (robot.keyToggle(TRANSLATION_KEY, 'down')) {
        translateText();
      }
    }
    
    setInterval(checkKeyPress, 100); // Checks for the key press every 100 milliseconds
    