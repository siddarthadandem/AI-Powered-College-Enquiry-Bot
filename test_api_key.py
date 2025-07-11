import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Temporarily hardcode the new API key for testing
API_KEY = "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"
print(f"DEBUG: Using hardcoded API_KEY: {API_KEY}")

client = OpenAI(api_key=API_KEY, base_url="https://openrouter.ai/api/v1")

try:
    completion = client.chat.completions.create(
        model="meta-llama/llama-3.3-8b-instruct:free",
        messages=[{"role": "user", "content": "Hello, test API key"}],
        max_tokens=10
    )
    print("Response:", completion.choices[0].message.content.strip())
except Exception as e:
    print(f"Request failed: {e}")
