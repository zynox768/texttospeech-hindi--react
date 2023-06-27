import React, { useState } from 'react';
import './App.scss';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioContent, setAudioContent] = useState(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await translateText(inputText, 'hi'); 
      const translated = response.data.translations[0].translatedText;
      setTranslatedText(translated);
      const audioData = await generateAudio(translated, 'hi');
      setAudioContent(audioData.audioContent);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  const translateText = async (text, targetLanguage) => {
    const translateApiKey = 'AIzaSyBpXVVOK744DvfVu944q9XRryuiqeC-mdg';
    const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${translateApiKey}`;

    const response = await fetch(translateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
      }),
    });

    return response.json();
  };

  const generateAudio = async (text, targetLanguage) => {
    const ttsApiKey = 'AIzaSyBpXVVOK744DvfVu944q9XRryuiqeC-mdg';
    const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsApiKey}`;

    const response = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: targetLanguage },
        audioConfig: { audioEncoding: 'MP3' },
      }),
    });

    return response.json();
  };

  const handlePlay = () => {
    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    audio.play();
  };

  return (

    <div className="container">    
    <div className="card">

      <h3>Text to Speech Converter (Hindi)</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text"
        />
        <button type='submit' class='custom-button-fill'>
          <span class='button-fill-text'>Translate to Hindi</span>
        </button>
      </form>
      <p className="translated-text">{translatedText}</p>
      {audioContent && (
        <div className="media-player">
          <button onClick={handlePlay}>
            <i className="fas fa-play"></i>
          </button>
        </div>
      )}    
      </div>

    </div>
  );
}

export default App;
