from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tokenizer = AutoTokenizer.from_pretrained("indobenchmark/indobart-v2-summarization")
model = AutoModelForSeq2SeqLM.from_pretrained("indobenchmark/indobart-v2-summarization")

@app.route('/api/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'Text is required'}), 400

    # IndoBART expects "ringkasan: " prefix
    input_text = "ringkasan: " + text
    input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(input_ids, max_length=120, min_length=20, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(port=5001)