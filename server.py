# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# import ollama
# import re
# from text_to_img_fun import generate_image_from_text 
# app = Flask(__name__,static_folder='static')
# CORS(app)  # Enable CORS

# # Load the Ollama model
# try:
#     # model = Ollama("llama3.2")
#     print("Model loaded successfully.")
# except Exception as e:
#     print(f"Error loading model: {e}")

# # @app.route('/static/test.png')
# # def serve_static(filename):
# #     return send_from_directory('static', filename)

# @app.route('/generate', methods=['POST'])
# def generate():
#     data = request.json
#     story = data['story']
#     choice = data['choice']

#     # Refined prompt with explicit markers, clear instructions, and an example
#     input_text = f"""{story} {choice}

# Please continue the story with a new segment and provide three choices for the next part of the story.

# Format your response exactly as follows:

# Story Segment:
# <new_story_segment>

# Choices:
# 1. Short Description: Actual Choice
# 2. Short Description: Actual Choice
# 3. Short Description: Actual Choice

# Do not include any additional text, explanations, or instructions.

# Example:

# Story Segment:
# You carefully step into the cave, your eyes adjusting to the dim light. The air is thick with moisture, and you can hear the distant drip of water echoing through the tunnels.

# Choices:
# 1. Explore deeper into the cave: You decide to venture further into the darkness, eager to uncover its secrets.
# 2. Turn back to the entrance: Feeling uneasy, you choose to return to the safety of the cave entrance.
# 3. Light a torch: You pull out a torch from your backpack and illuminate the path ahead.
# """

#     try:
#         new_story_response = ollama.generate(model='llama3.2', prompt=input_text)
#         response_text = new_story_response["response"]
#         print("Model Response:\n", response_text)

#         # Extract the story segment
#         story_text = extract_story_segment(response_text)
#         print("Extracted Story Segment:", story_text)

#         # Extract new choices from the response_text
#         new_choices = extract_choices(response_text)
#         print("Extracted Choices:", new_choices)

#     except Exception as e:
#         print(f"Error generating story: {e}")
#         return jsonify({"error": str(e)}), 500

#     return jsonify({"new_story": story_text, "new_choices": new_choices})

# @app.route('/generate_image', methods=['POST'])
# def generate_image():
#     data = request.json
#     story_segment = data.get('text')

#     try:
#         # Generate image from text using the function from txt_to_img.py
#         image_path = generate_image_from_text(story_segment)

#         # Assume the image is saved locally and return its path
#         print("Image generated successfully.", image_path)
#         return jsonify({'image_url': image_path})

#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({'status': 'error', 'message': str(e)}), 500

# def extract_choices(response_text):
#     """
#     Extracts choices from the model's response.
#     Expects each choice to be in the format:
#     1. Short Description: Actual Choice
#     """
#     choices = []
#     # Regular expression to match choices like '1. Short Description: Actual Choice'
#     choice_pattern = re.compile(r'^\d+\.\s*(.+?):\s*(.+)$', re.MULTILINE)
#     matches = choice_pattern.findall(response_text)
#     for match in matches:
#         short_description, actual_choice = match
#         choices.append({
#             "short_description": short_description.strip(),
#             "actual_choice": actual_choice.strip()
#         })
#         if len(choices) == 3:
#             break
#     print("Extracted Choices:", choices)
#     return choices

# def extract_story_segment(response_text):
#     """
#     Extracts the story segment from the model's response.
#     Assumes that the story segment is after 'Story Segment:' and before 'Choices:'.
#     """
#     story_segment = ""
#     # Regular expression to capture text between 'Story Segment:' and 'Choices:'
#     story_pattern = re.compile(r'Story Segment:\s*(.*?)\s*Choices:', re.DOTALL | re.IGNORECASE)
#     match = story_pattern.search(response_text)
#     if match:
#         story_segment = match.group(1).strip()
#     else:
#         # Fallback if 'Story Segment:' is missing
#         default_story = "The story continues, but the next part remains unclear."
#         story_segment = default_story
#         print("Story Segment not found. Using default story segment.")
#     print("Extracted Story Segment:", story_segment)
#     return story_segment

# if __name__ == '__main__':
#     app.run(port=5000)

# 2nd test --------------------------------------------------------------------------

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import ollama
import re
from text_to_img_fun import generate_image_from_text 
app = Flask(__name__,static_folder='static')
CORS(app)  # Enable CORS

# Load the Ollama model
try:
    # model = Ollama("llama3.2")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

# @app.route('/static/test.png')
# def serve_static(filename):
#     return send_from_directory('static', filename)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    story = data['story']
    choice = data['choice']
    current_breakpoint = data['current_breakpoint']
    choice_history = data.get('choice_history', [])

    # Update the story context to include the chosen path explicitly
    accumulated_story = " ".join(choice_history) + f" {story} You chose: {choice}"

    # Refined prompt to ensure the story strictly follows the player's choice and includes attributes
    input_text = f"""
{accumulated_story}

Continue the story based strictly on the player's choice: "{choice}". Make sure the next story segment aligns directly with this choice.

This is breakpoint number {current_breakpoint + 1}. Continue progressing toward an ending within 10 breakpoints.

For each choice, include associated attributes that reflect the nature of the decision. Use attributes like bravery, wisdom, curiosity, caution, and resourcefulness. Assign positive or negative values to these attributes based on the choice. Always assign an attribute for all the choices.

Format your response as follows:

Story Segment:
<new_story_segment>

Choices:
1. Short Description: Actual Choice [Attributes: attribute1 +value1, attribute2 +value2]
2. Short Description: Actual Choice [Attributes: attribute1 +value1, attribute2 +value2]
3. Short Description: Actual Choice [Attributes: attribute1 +value1, attribute2 +value2]

Do not include any additional text or explanations.

Example:

Story Segment:
You carefully step into the cave, your eyes adjusting to the dim light.

Choices:
1. Explore deeper into the cave: You decide to venture further into the darkness. [Attributes: bravery +2, curiosity +1]
2. Turn back to the entrance: Feeling uneasy, you return to safety. [Attributes: caution +2]
3. Light a torch: You illuminate the path ahead. [Attributes: resourcefulness +2, caution +1]
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
    choices = []
    # Updated regex to match choices, making the attributes section optional
    choice_pattern = re.compile(
        r'^\d+\.\s*(.+?):\s*(.+?)(?:\s*\[Attributes:\s*(.*?)\])?$', re.MULTILINE)
    matches = choice_pattern.findall(response_text)

    for match in matches:
        short_description, actual_choice, attributes_str = match
        attributes = {}

        # If attributes are present, parse them
        if attributes_str:
            attr_pairs = attributes_str.split(',')
            for pair in attr_pairs:
                attr, value = pair.strip().split()
                attributes[attr] = int(value)

        # Add the choice to the list, even if attributes are empty
        choices.append({
            "short_description": short_description.strip(),
            "actual_choice": actual_choice.strip(),
            "attributes": attributes  # Could be empty if no attributes are specified
        })

        # Stop after three choices, if present
        if len(choices) == 3:
            break

    return choices

def extract_story_segment(response_text):
    story_segment = ""
    story_pattern = re.compile(
        r'Story Segment:\s*(.*?)\s*Choices:', re.DOTALL | re.IGNORECASE)
    match = story_pattern.search(response_text)
    if match:
        story_segment = match.group(1).strip()
    else:
        default_story = "The story continues, but the next part remains unclear."
        story_segment = default_story
    return story_segment

if __name__ == '__main__':
    app.run(port=5000)


# @app.route('/generate', methods=['POST'])
# def generate():
#     data = request.json
#     story = data['story']
#     choice = data['choice']
#     current_breakpoint = data['current_breakpoint']

#     # Refined prompt with story continuity and deviation options
#     input_text = f"""
# {story} {choice}

# 'The Labyrinth of Reflections.' The story has the following structure:
# Beginning
# You wake up in a dark, dense forest, your memory clouded. The ground is damp beneath you, and a faint mist lingers in the air. As you rise, you find a mysterious compass in your hand, its needle spinning wildly. You’re unsure of how you arrived here, but the compass seems to pull you in a specific direction, urging you to follow.

# Middle
# You move deeper into the forest, encountering strange symbols carved into the trees. You soon reach a clearing, where a stone altar stands. On the altar lies a glowing crystal. As you approach, the crystal emits a soft hum, and the forest seems to grow silent. Suddenly, a booming voice fills the air:

# “You have found the Labyrinth of Reflections. To escape, you must conquer the challenges that lie within. Follow the compass, and it will guide you through—if you have the courage to proceed.”

# With the compass pointing towards a dark cave, you muster your courage and step inside. The cave leads to a series of interconnected chambers, each filled with intricate puzzles, illusions, and reflections of your own past.

# Chamber of Memories: In this chamber, mirrors surround you, each reflecting different moments from your past—both the good and the bad. One mirror shows a moment of triumph, while another reflects a time of regret. You feel a mix of nostalgia and guilt, but you must press forward.

# Chamber of Courage: This chamber presents a roaring chasm with a narrow, wobbly bridge stretching across. A deep, ominous voice echoes, “Only those who conquer fear can pass.” You feel a surge of anxiety but realize that the bridge is the only way forward.

# Chamber of Deceit: You enter a room filled with shadows and whispers. Illusions of people you once trusted appear, each trying to lead you down a different path. You sense a growing confusion, but the compass still glows brightly, signaling the correct direction.

# Chamber of Sacrifice: In this chamber, you find two pedestals—one holds a glowing orb, symbolizing power, while the other holds a delicate flower, symbolizing compassion. A voice commands you to choose, but you sense that only the right choice will allow you to proceed safely.

# Chamber of Truth: The final chamber is a large hall with a giant, ancient mirror at its center. The mirror reflects not just your physical appearance, but your inner self—your strengths, weaknesses, hopes, and fears. A voice booms, “You must confront your true self to break the curse of the Labyrinth.”

# Climax
# The mirror cracks, revealing a portal. You step through and find yourself back in the forest, but this time, the mist has lifted, and the compass in your hand has stopped spinning. A faint glow emanates from the horizon, guiding you toward a distant village.

# Ending
# As you walk towards the village, you feel a sense of clarity and renewal. The journey through the Labyrinth of Reflections has tested not only your courage but your deepest emotions and past regrets. You realize that the challenges were meant to reveal not just the way out, but the true path to your own redemption. With each step, the forest becomes brighter, and the feeling of being lost gradually fades away.
# You reach the village just as dawn breaks. The villagers welcome you with open arms, offering food, shelter, and a place to rest. You realize that the Labyrinth was not just a physical journey but a profound transformation of your inner self.


# You are writing an interactive story based on 'The Labyrinth of Reflections.' The story has to evolve based on the player's choices. 
# Continue the story based on the player’s choosen choice only.

# Ensure that the story has a total of 10 breakpoints. This is breakpoint number {current_breakpoint + 1}.

# Format your response as follows:

# Story Segment:
# <new_story_segment>

# Choices:
# 1. Short Description: Actual Choice
# 2. Short Description: Actual Choice
# 3. Short Description: Actual Choice

# Do not include any additional text, explanations, or instructions.

# Example:

# Story Segment:
# You carefully step into the cave, your eyes adjusting to the dim light. The air is thick with moisture, and you can hear the distant drip of water echoing through the tunnels.

# Choices:
# 1. Explore deeper into the cave: You decide to venture further into the darkness, eager to uncover its secrets.
# 2. Turn back to the entrance: Feeling uneasy, you choose to return to the safety of the cave entrance.
# 3. Light a torch: You pull out a torch from your backpack and illuminate the path ahead.
# """

#     try:
#         new_story_response = ollama.generate(model='llama3.2', prompt=input_text)
#         response_text = new_story_response["response"]
#         print("Model Response:\n", response_text)

#         # Extract the story segment
#         story_text = extract_story_segment(response_text)
#         print("Extracted Story Segment:", story_text)

#         # Extract new choices from the response_text
#         new_choices = extract_choices(response_text)
#         print("Extracted Choices:", new_choices)

#     except Exception as e:
#         print(f"Error generating story: {e}")
#         return jsonify({"error": str(e)}), 500

#     return jsonify({"new_story": story_text, "new_choices": new_choices})


@app.route('/generate_image', methods=['POST'])
def generate_image():
    data = request.json
    story_segment = data.get('text')

    try:
        # Generate image from text using the function from txt_to_img.py
        image_path = generate_image_from_text(story_segment)

        # Assume the image is saved locally and return its path
        print("Image generated successfully.", image_path)
        return jsonify({'image_url': image_path})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

# def extract_choices(response_text):
#     """
#     Extracts choices from the model's response.
#     Expects each choice to be in the format:
#     1. Short Description: Actual Choice
#     """
#     choices = []
#     # Regular expression to match choices like '1. Short Description: Actual Choice'
#     choice_pattern = re.compile(r'^\d+\.\s*(.+?):\s*(.+)$', re.MULTILINE)
#     matches = choice_pattern.findall(response_text)
#     for match in matches:
#         short_description, actual_choice = match
#         choices.append({
#             "short_description": short_description.strip(),
#             "actual_choice": actual_choice.strip()
#         })
#         if len(choices) == 3:
#             break
#     print("Extracted Choices:", choices)
#     return choices

# def extract_story_segment(response_text):
#     """
#     Extracts the story segment from the model's response.
#     Assumes that the story segment is after 'Story Segment:' and before 'Choices:'.
#     """
#     story_segment = ""
#     # Regular expression to capture text between 'Story Segment:' and 'Choices:'
#     story_pattern = re.compile(r'Story Segment:\s*(.*?)\s*Choices:', re.DOTALL | re.IGNORECASE)
#     match = story_pattern.search(response_text)
#     if match:
#         story_segment = match.group(1).strip()
#     else:
#         # Fallback if 'Story Segment:' is missing
#         default_story = "The story continues, but the next part remains unclear."
#         story_segment = default_story
#         print("Story Segment not found. Using default story segment.")
#     print("Extracted Story Segment:", story_segment)
#     return story_segment

# if __name__ == '__main__':
#     app.run(port=5000)


