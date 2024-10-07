from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import re

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

    # Refined prompt with explicit markers, clear instructions, and an example
    input_text = f"""{story} {choice}

Please continue the story with a new segment and provide three choices for the next part of the story.

Format your response exactly as follows:

Story Segment:
<new_story_segment>

Choices:
1. Short Description: Actual Choice
2. Short Description: Actual Choice
3. Short Description: Actual Choice

Do not include any additional text, explanations, or instructions.

Example:

Story Segment:
You carefully step into the cave, your eyes adjusting to the dim light. The air is thick with moisture, and you can hear the distant drip of water echoing through the tunnels.

Choices:
1. Explore deeper into the cave: You decide to venture further into the darkness, eager to uncover its secrets.
2. Turn back to the entrance: Feeling uneasy, you choose to return to the safety of the cave entrance.
3. Light a torch: You pull out a torch from your backpack and illuminate the path ahead.
"""

    try:
        new_story_response = ollama.generate(model='llama3.2', prompt=input_text)
        response_text = new_story_response["response"]
        print("Model Response:\n", response_text)

        # Extract the story segment
        story_text = extract_story_segment(response_text)
        print("Extracted Story Segment:", story_text)

        # Extract new choices from the response_text
        new_choices = extract_choices(response_text)
        print("Extracted Choices:", new_choices)

    except Exception as e:
        print(f"Error generating story: {e}")
        return jsonify({"error": str(e)}), 500

    return jsonify({"new_story": story_text, "new_choices": new_choices})

def extract_choices(response_text):
    """
    Extracts choices from the model's response.
    Expects each choice to be in the format:
    1. Short Description: Actual Choice
    """
    choices = []
    # Regular expression to match choices like '1. Short Description: Actual Choice'
    choice_pattern = re.compile(r'^\d+\.\s*(.+?):\s*(.+)$', re.MULTILINE)
    matches = choice_pattern.findall(response_text)
    for match in matches:
        short_description, actual_choice = match
        choices.append({
            "short_description": short_description.strip(),
            "actual_choice": actual_choice.strip()
        })
        if len(choices) == 3:
            break
    print("Extracted Choices:", choices)
    return choices

def extract_story_segment(response_text):
    """
    Extracts the story segment from the model's response.
    Assumes that the story segment is after 'Story Segment:' and before 'Choices:'.
    """
    story_segment = ""
    # Regular expression to capture text between 'Story Segment:' and 'Choices:'
    story_pattern = re.compile(r'Story Segment:\s*(.*?)\s*Choices:', re.DOTALL | re.IGNORECASE)
    match = story_pattern.search(response_text)
    if match:
        story_segment = match.group(1).strip()
    else:
        # Fallback if 'Story Segment:' is missing
        default_story = "The story continues, but the next part remains unclear."
        story_segment = default_story
        print("Story Segment not found. Using default story segment.")
    print("Extracted Story Segment:", story_segment)
    return story_segment

if __name__ == '__main__':
    app.run(port=5000)





