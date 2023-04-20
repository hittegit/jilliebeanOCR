const {Translate} = require('@google-cloud/translate').v2;
const fs = require('fs');

// Set your Google Cloud Project ID and JSON key file path
const projectId = 'your-google-cloud-project-id';
const keyFilename = 'path/to/your-key-file.json';

const translate = new Translate({projectId, keyFilename});

async function translateText(text, targetLanguage = 'en') {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Error in translation:', error);
    return null;
  }
}

module.exports = {translateText};
