import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"

from flask import Flask, render_template, request, jsonify
import json
import logging
from dotenv import load_dotenv, find_dotenv
import os
from fuzzywuzzy import fuzz
from nltk.stem import WordNetLemmatizer
import numpy as np
from sentence_transformers import SentenceTransformer

from openai import OpenAI

# Set up logging
logging.basicConfig(filename='chatbot.log', level=logging.INFO, 
                    format='%(asctime)s - %(message)s')

load_dotenv(find_dotenv())
app = Flask(__name__)

import os

API_KEY = "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"
logging.basicConfig(level=logging.DEBUG)
masked_key = API_KEY[:4] + "*" * (len(API_KEY) - 4)
logging.debug(f"API_KEY length: {len(API_KEY)}, masked start: {masked_key}")

lemmatizer = WordNetLemmatizer()

# Load Sentence Transformer model
semantic_model = SentenceTransformer('all-MiniLM-L6-v2')

# Precompute FAQ embeddings at startup
faq_json_list = []
faq_embeddings = []

def load_all_faqs():
    data_dir = os.path.abspath('data')
    all_faqs = []
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            file_path = os.path.join(data_dir, filename)
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    # Extract all FAQ entries from the file
                    if isinstance(data, dict):
                        for key in data.keys():
                            if isinstance(data[key], list):
                                all_faqs.extend(data[key])
                            elif isinstance(data[key], dict):
                                for subkey in data[key].keys():
                                    if isinstance(data[key][subkey], list):
                                        all_faqs.extend(data[key][subkey])
                    elif isinstance(data, list):
                        all_faqs.extend(data)
            except Exception as e:
                logging.error(f"Error loading FAQ data from {file_path}: {e}")
    return all_faqs

def preprocess(text):
    # Simple preprocessing: lowercase and strip
    return text.lower().strip()

def prepare_faq_embeddings():
    global faq_json_list, faq_embeddings
    faq_json_list = load_all_faqs()
    questions = [preprocess(faq.get("question", "")) for faq in faq_json_list]
    faq_embeddings = semantic_model.encode(questions, convert_to_tensor=False)

prepare_faq_embeddings()

def semantic_search_faq(query, threshold=0.6):
    query_processed = preprocess(query)
    query_embedding = semantic_model.encode([query_processed], convert_to_tensor=False)[0]
    similarities = np.array([np.dot(query_embedding, faq_emb) / (np.linalg.norm(query_embedding) * np.linalg.norm(faq_emb)) for faq_emb in faq_embeddings])
    best_idx = np.argmax(similarities)
    best_score = similarities[best_idx]
    if best_score >= threshold:
        return faq_json_list[best_idx], best_score
    else:
        return None, None

def load_faq_file(department):
    data_dir = os.path.abspath('data')
    filename = f"{department}.json"
    file_path = os.path.join(data_dir, filename)
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            for key in data.keys():
                if key.lower() == department.lower():
                    return data[key]
            if "departments" in data and isinstance(data["departments"], dict):
                for key in data["departments"].keys():
                    if key.lower() == department.lower():
                        return data["departments"][key]
            if isinstance(data, list):
                return data
            return []
    except Exception as e:
        logging.error(f"Error loading FAQ data from {file_path}: {e}")
        return []

def search_faqs_in_file(department, query):
    faqs = load_faq_file(department)
    # Use semantic similarity search within department FAQs
    if not faqs:
        return None, None
    questions = [preprocess(faq.get("question", "")) for faq in faqs]
    embeddings = semantic_model.encode(questions, convert_to_tensor=False)
    query_processed = preprocess(query)
    query_embedding = semantic_model.encode([query_processed], convert_to_tensor=False)[0]
    similarities = np.array([np.dot(query_embedding, emb) / (np.linalg.norm(query_embedding) * np.linalg.norm(emb)) for emb in embeddings])
    best_idx = np.argmax(similarities)
    best_score = similarities[best_idx]
    threshold = 0.6
    if best_score >= threshold:
        return faqs[best_idx], best_score
    else:
        return None, None

def search_faqs_all(query):
    faq, score = semantic_search_faq(query)
    if faq:
        return faq, score
    else:
        return None, None

def log_query(query, response, intent=None):
    with open('queries.log', 'a') as f:
        f.write(f"{query} | {response} | {intent}\n")

@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        logging.error(f"Error rendering index.html: {e}")
        return "Error: Could not load the page. Check logs for details.", 500

from openai import OpenAI
import requests

client = OpenAI(api_key=API_KEY)

def call_openai_api(prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"OpenAI API call failed: {e}", exc_info=True)
        return None

def call_openrouter_api(prompt):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5050",  # You can change this to your site URL
        "X-Title": "ChatbotApp",  # You can change this to your site title
    }
    data = {
        "model": "mistralai/devstral-small:free",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        response_json = response.json()
        # Extract the assistant's reply from the response JSON structure
        if "choices" in response_json and len(response_json["choices"]) > 0:
            return response_json["choices"][0]["message"]["content"].strip()
        else:
            logging.error(f"Unexpected response format from OpenRouter API: {response_json}")
            return None
    except Exception as e:
        logging.error(f"OpenRouter API call failed: {e}", exc_info=True)
        return None

@app.route('/chat', methods=['POST'])
def chat():
    msg = request.json.get('message', '')
    if not msg:
        return jsonify({'reply': 'Please provide a message.'})

    # Use semantic search to find best matching FAQ reply
    faq, score = search_faqs_all(msg)
    if faq and 'answer' in faq:
        reply = faq['answer']
        log_query(msg, reply, "faq_reply")
        return jsonify({'reply': reply})
    else:
        # Fallback to OpenRouter API search
        api_reply = call_openrouter_api(msg)
        if api_reply:
            log_query(msg, api_reply, "openrouter_api_reply")
            return jsonify({'reply': api_reply})
        else:
            reply = "Sorry, I am still learning. Please try again later."
            log_query(msg, reply, "openrouter_no_reply")
            return jsonify({'reply': reply})

@app.route('/chat_openrouter', methods=['POST'])
def chat_openrouter():
    msg = request.json.get('message', '')
    if not msg:
        return jsonify({'reply': 'Please provide a message.'})

    api_reply = call_openrouter_api(msg)
    if api_reply:
        log_query(msg, api_reply, "openrouter_api_reply")
        return jsonify({'reply': api_reply})
    else:
        reply = "Sorry, I am still learning. Please try again later."
        log_query(msg, reply, "openrouter_no_reply")
        return jsonify({'reply': reply})

@app.route('/retrain', methods=['POST'])
def retrain():
    return jsonify({'status': 'Retrain endpoint is disabled as training is not supported in current implementation.'})

@app.route('/test')
def test():
    return "Test route is accessible."

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5050))
    app.run(debug=True, port=port, host='0.0.0.0')
