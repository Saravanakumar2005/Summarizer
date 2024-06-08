import React, { useState } from 'react';
import './App.css';

function App() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [error, setError] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const handleSummarizeAndTranslate = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to summarize.');
            return;
        }

        if (!selectedLanguage.trim()) {
            setError('Please enter a language.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: inputText, language: selectedLanguage })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to summarize text');
            }

            const data = await response.json();
            setOutputText(data.summary);
            setError('');
        } catch (error) {
            console.error('Error summarizing text:', error);
            setError(error.message);
            setOutputText('');
        }
    };

    return (
        <div className="container">
            <div className="input-container">
                <h1>Input Text</h1>
                <textarea
                    rows="10"
                    placeholder="Type or paste your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                ></textarea>
                <div className="animated-input">
                    <input
                        type="text"
                        placeholder="e.g., tamil, english, spanish, french"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    />
                    <button onClick={handleSummarizeAndTranslate}>Submit Language</button>
                </div>
            </div>
            <div className="output-container">
                <h1>Output Text</h1>
                <div id="outputText" className="output">
                    {error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <p>{outputText}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
