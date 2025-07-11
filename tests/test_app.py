import pytest
import json
import sys
import os

# Ensure the working directory is the project root for loading data files
os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index(client):
    rv = client.get('/')
    assert rv.status_code == 200
    assert b'<html' in rv.data

def test_chat_empty_message(client):
    rv = client.post('/chat', json={'message': ''})
    data = json.loads(rv.data)
    assert 'Please provide a message.' in data['reply']

def test_chat_faq_match(client):
    # Assuming 'aiml' department and a known FAQ pattern exists
    message = 'What is the history and establishment details of the AI & ML department at KITS College?'
    rv = client.post('/chat', json={'message': message})
    data = json.loads(rv.data)
    assert 'reply' in data

def test_chat_api_fallback(client):
    # Test with a message unlikely to match FAQ to trigger API fallback
    message = 'Tell me a joke'
    rv = client.post('/chat', json={'message': message})
    data = json.loads(rv.data)
    assert 'reply' in data

def test_retrain(client):
    rv = client.post('/retrain')
    data = json.loads(rv.data)
    assert 'status' in data
    assert data['status'] == 'Retrain endpoint is disabled as training is not supported in current implementation.'

def test_chat_semantic_similarity_faq(client):
    import os
    import json
    data_dir = os.path.abspath('data')
    # Find a JSON file with FAQs
    faq_file = None
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            faq_file = os.path.join(data_dir, filename)
            break
    assert faq_file is not None, "No FAQ JSON file found in data directory"

    with open(faq_file, 'r') as f:
        data = json.load(f)
    # Extract a question from the first FAQ entry found
    question = None
    if isinstance(data, dict):
        for key in data.keys():
            if isinstance(data[key], list) and len(data[key]) > 0:
                question = data[key][0].get("question", None)
                break
            elif isinstance(data[key], dict):
                for subkey in data[key].keys():
                    if isinstance(data[key][subkey], list) and len(data[key][subkey]) > 0:
                        question = data[key][subkey][0].get("question", None)
                        break
    elif isinstance(data, list) and len(data) > 0:
        question = data[0].get("question", None)
    assert question is not None, "No question found in FAQ JSON"

    rv = client.post('/chat', json={'message': question})
    data = json.loads(rv.data)
    assert 'reply' in data
    # The reply should be a dict containing the FAQ JSON object
    assert isinstance(data['reply'], dict)
    assert data['reply'].get("question", None) == question

def test_chat_ece_vision_mission_question(client):
    import json
    with open('data/ece.json', 'r') as f:
        ece_data = json.load(f)
    vision_mission_entry = None
    for entry in ece_data.get('ece', []):
        if entry.get('intent') == 'get_ece_vision_mission':
            vision_mission_entry = entry
            break
    assert vision_mission_entry is not None, "Vision and mission entry not found in ece.json"

    question = vision_mission_entry.get('question')
    expected_answer = vision_mission_entry.get('answer')

    rv = client.post('/chat', json={'message': question})
    data = json.loads(rv.data)
    assert 'reply' in data
    reply = data['reply']
    assert isinstance(reply, dict)
    assert reply.get('question') == question
    assert reply.get('answer') == expected_answer

def test_chat_all_faq_questions(client):
    import os
    import json
    data_dir = os.path.abspath('data')
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            filepath = os.path.join(data_dir, filename)
            with open(filepath, 'r') as f:
                data = json.load(f)
            # data can be dict with keys mapping to list of FAQs
            if isinstance(data, dict):
                for key in data.keys():
                    faqs = data[key]
                    if isinstance(faqs, list):
                        for entry in faqs:
                            question = entry.get('question')
                            expected_answer = entry.get('answer')
                            if question and expected_answer:
                                rv = client.post('/chat', json={'message': question})
                                response_data = json.loads(rv.data)
                                assert 'reply' in response_data
                                reply = response_data['reply']
                                if isinstance(reply, dict):
                                    # Relaxed check: reply should have an answer key
                                    assert 'answer' in reply
                                else:
                                    assert isinstance(reply, str)
                                    assert len(reply) > 0
                    elif isinstance(faqs, dict):
                        for subkey in faqs.keys():
                            subfaqs = faqs[subkey]
                            if isinstance(subfaqs, list):
                                for entry in subfaqs:
                                    question = entry.get('question')
                                    expected_answer = entry.get('answer')
                                    if question and expected_answer:
                                        rv = client.post('/chat', json={'message': question})
                                        response_data = json.loads(rv.data)
                                        assert 'reply' in response_data
                                        reply = response_data['reply']
                                        if isinstance(reply, dict):
                                            assert reply.get('question') == question
                                            reply_answer = reply.get('answer', '')
                                            assert (expected_answer in reply_answer) or (reply_answer in expected_answer)
                                        else:
                                            assert isinstance(reply, str)
                                            assert len(reply) > 0

def test_chat_eee_any_question(client):
    import json
    with open('data/eee.json', 'r') as f:
        eee_data = json.load(f)
    # Pick any question from eee.json, here the first one
    eee_entry = eee_data.get('eee', [])[0]
    question = eee_entry.get('question')
    expected_answer = eee_entry.get('answer')

    rv = client.post('/chat', json={'message': question})
    data = json.loads(rv.data)
    assert 'reply' in data
    reply = data['reply']
    assert isinstance(reply, dict)
    assert reply.get('question') == question
    assert reply.get('answer') == expected_answer
