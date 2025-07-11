import json
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
import os

# NLTK setup
try:
    stop_words = set(stopwords.words('english'))
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('stopwords')
    nltk.download('punkt')
    nltk.download('wordnet')
    stop_words = set(stopwords.words('english'))

lemmatizer = WordNetLemmatizer()

def preprocess(text):
    tokens = word_tokenize(text.lower())
    return [lemmatizer.lemmatize(token) for token in tokens if token.isalnum() and token not in stop_words]

def load_faqs():
    abs_path = os.path.abspath('data/kits.json')
    if not os.path.exists(abs_path):
        print(f"FAQ data file does not exist at: {abs_path}")
        return {"departments": {}}
    with open(abs_path, 'r') as f:
        data = json.load(f)
        return data

def train_classifier(faqs):
    queries = []
    labels = []
    for dept, dept_faqs in faqs["departments"].items():
        for faq in dept_faqs:
            if faq["patterns"]:
                queries.extend(faq["patterns"])
                labels.extend([faq["intent"]] * len(faq["patterns"]))
    if not queries:
        raise ValueError("No training data found in FAQ patterns.")
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(queries)
    model = LogisticRegression()
    model.fit(X, labels)
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorizer, f)
    print("Model and vectorizer saved successfully.")

if __name__ == "__main__":
    faqs = load_faqs()
    train_classifier(faqs)
