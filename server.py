from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the Ollama model
try:
    # model = Ollama("llama3.2")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    story = data['story']
    choice = data['choice']

    # Generate the next part of the story
    input_text = f'''{story} {choice}\n\nPlease provide three options for the next part of the story in the format '1.', '2.', '3.'.
    Each option should have a short description followed by a colon and the actual choice. For example, '1. Go to the forest: You decide to explore the forest.'''
    try:
        new_story = ollama.generate(model='llama3.2', prompt=input_text)
        response_text = new_story["response"]
        print(response_text)
        
        # Extract new choices from the response_text
        new_choices = extract_choices(response_text)
        
        # Remove choices from the story text
        story_text = remove_choices_from_story(response_text)
        
    except Exception as e:
        print(f"Error generating story: {e}")
        return jsonify({"error": str(e)}), 500

    return jsonify({"new_story": story_text, "new_choices": new_choices})

def extract_choices(response_text):
    # Extract choices from the response_text
    lines = response_text.split('\n')
    choices = []
    for line in lines:
        if line.strip().startswith(("1.", "2.", "3.")):
            choice_text = line.split(".", 1)[1].strip()
            choices.append(choice_text)
        if len(choices) == 3:
            break
    return choices

def remove_choices_from_story(response_text):
    # Remove choices from the story text
    lines = response_text.split('\n')
    story_lines = []
    for line in lines:
        if not line.strip().startswith(("1.", "2.", "3.")):
            story_lines.append(line)
    return '\n'.join(story_lines).strip()

if __name__ == '__main__':
    app.run(port=5000)