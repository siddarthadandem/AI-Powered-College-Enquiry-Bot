# 🎓AI-Powered College Enquiry Bot

An intelligent chatbot built with **Flask**, **Sentence Transformers**, and **OpenAI/OpenRouter API**.  
Designed to answer student and visitor queries about the college using a combination of FAQ semantic search and AI fallback.

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/Flask-2.x-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## ✨ Features
- 🤖 FAQ-based question answering using semantic search (Sentence Transformers)
- 🧠 Fallback to OpenRouter API / OpenAI GPT if no FAQ match found
- 📊 Logs all queries and responses
- 🔄 Retrain endpoint stub (placeholder)

---

## ⚙️ Tech Stack
- **Backend:** Python, Flask
- **NLP:** Sentence Transformers, NLTK
- **AI APIs:** OpenRouter / OpenAI
- **Frontend:** HTML + JavaScript (chat UI)

---

## 📂 Project Structure
\`\`\`
├── app.py                # Main Flask application
├── templates/            # HTML templates (index.html etc.)
├── static/               # CSS, JS, and assets
├── data/                 # JSON FAQ data files
└── README.md
\`\`\`

---

## 🚀 How to Run
> Make sure you have Python installed, and set your API key.

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/college-chatbot.git
cd college-chatbot

# Install dependencies
pip install -r requirements.txt

# Create .env file and add your API_KEY
echo "API_KEY=your_openai_or_openrouter_api_key" > .env

# Run the chatbot
python app.py
\`\`\`

The app will run at: [http://127.0.0.1:5050](http://127.0.0.1:5050)

---

## 🛠 Configuration
- Update `.env` with your secret `API_KEY`
- Add or update department FAQ files in `data/` directory (format: JSON)

---

## ✏️ Contribution
Feel free to fork this repository, suggest improvements, or open issues.

---

## 📃 License
This project is open-source and free to use under the [MIT License](LICENSE).# AI-Powered-College-Enquiry-Bot
