import nltk
from flask import Flask, jsonify, request
from flask_cors import CORS
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from googletrans import Translator

app = Flask(__name__)
CORS(app)

nltk.download('punkt')

translator = Translator()

def run_summarizer(text, language):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LsaSummarizer()
    summary = summarizer(parser.document, sentences_count=3)  
    return ' '.join(str(sentence) for sentence in summary)

@app.route('/summarize', methods=['POST'])
def summarize():
    content = request.json
    text = content.get('text', '')
    target_language = content.get('language', 'english') 

    if not text.strip():
        return jsonify({'error': 'Please provide text to summarize.'}), 400

    try:
      
        translated = translator.translate(text, dest='en')
        translated_text = translated.text

        summary = run_summarizer(translated_text, 'english')

        final_translation = translator.translate(summary, dest=target_language)
        final_summary = final_translation.text

        print("Input Text:", text)  
        print("Summary:", final_summary) 

        return jsonify({'summary': final_summary, 'input_text': text})
    except Exception as e:
        print(f"Error summarizing text: {e}")
        return jsonify({'error': 'Failed to summarize text'}), 500

if __name__ == '__main__':
    app.run(debug=True)
