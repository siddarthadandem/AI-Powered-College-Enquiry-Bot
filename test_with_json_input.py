import json
import requests

def main():
    url = 'http://127.0.0.1:5000/chat'
    with open('data/aiml.json', 'r') as f:
        data = json.load(f)
    aiml_faqs = data.get('departments', {}).get('aiml', [])
    for entry in aiml_faqs:
        question = entry.get('question')
        if question:
            payload = {'message': question}
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                resp_json = response.json()
                print(f"Question: {question}")
                print(f"Reply: {resp_json.get('reply')}")
                print('-' * 40)
            else:
                print(f"Failed to get response for question: {question}, Status code: {response.status_code}")

if __name__ == '__main__':
    main()
