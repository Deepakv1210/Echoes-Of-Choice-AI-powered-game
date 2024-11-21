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

# 2nd test --------------------------------------------------------------------------------------------------------------------------------------

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

# @app.route('/generate', methods=['POST'])
# def generate():
#     data = request.json
#     story = data['story']
#     choice = data['choice']
#     current_breakpoint = data['current_breakpoint']
#     choice_history = data.get('choice_history', [])

#     # Update the story context to include the chosen path explicitly
#     accumulated_story = " ".join(choice_history) + f" {story} You chose: {choice}"

#     # Refined prompt to ensure the story strictly follows the player's choice and includes attributes
#     input_text = f"""
# {accumulated_story}

# Continue the story based strictly on the player's choice: "{choice}". Make sure the next story segment aligns directly with this choice and reflects the context of the Skyfall narrative where the player is the antagonist. Incorporate interactions with key characters like James Bond, M, Patrice, Silva, and Sévérine as appropriate.

# This is breakpoint number {current_breakpoint + 1}. Continue progressing toward an ending within the structure of the Skyfall story, adjusting for the player's choices, and aim to conclude within 10 breakpoints.

# For each choice, include associated attributes that reflect the nature of the decision. Use attributes like cunning, ruthlessness, deception, strategy, and ambition. Assign positive or negative values to these attributes based on the choice. Always assign at least one attribute for all the choices.

# Format your response as follows:

# Story Segment:
# <new_story_segment>

# Choices:
# 1. Short Description: Actual Choice [Attributes: attribute1 +value1, attribute2 +value2]
# 2. Short Description: Actual Choice [Attributes: attribute1 +value1, attribute2 +value2]
# 3. Short Description: Actual Choice [Attributes: attribute1 +value1, attribute2 +value2]

# Do not include any additional text or explanations.

# Below is how the original story was supposed to be: But due to player's dynamic choices this will change.

# Beginning
# You wake up in a dark, dense forest, your memory clouded. The ground is damp beneath you, and a faint mist lingers in the air. As you rise, you find a mysterious compass in your hand, its needle spinning wildly. You’re unsure of how you arrived here, but the compass seems to pull you in a specific direction, urging you to follow.

# Act 1: The Attack and the Fall
# James Bond, MI6's finest agent, is on a high-stakes mission to recover a stolen hard drive containing NATO agents' information. During a chase in Istanbul, he battles mercenary Patrice on a speeding train. Just as Bond is about to subdue him, M orders fellow agent Eve to take a risky shot.

# Decision Point:
# - Take the Shot: Bond falls from the train, presumed dead. He goes into hiding as MI6 faces new crises.
# - Wait for a Clear Shot: Bond and Patrice's fight continues, leading to a confrontation with more danger.

# Aftermath and MI6’s Attack
# While Bond is recovering from his fall, MI6 is attacked in London, and M faces harsh scrutiny. Hearing about the attack, Bond must decide whether to return to MI6 or stay hidden, contemplating his loyalty and readiness to fight again.

# Decision Point:
# - Return to MI6: Bond returns, shaken but determined to defend MI6.
# - Stay Hidden: MI6 struggles further as Bond remains off the radar. He may be drawn back later.

# Tracking Patrice to Shanghai
# Bond's pursuit of Patrice leads him to Shanghai, where he witnesses an assassination. Bond's decision could determine how much intel he gathers from Patrice's network.

# Decision Point:
# - Prevent Patrice's Shot: The assassination fails, but Bond misses critical intel on Silva's network.
# - Let Patrice Complete the Hit: Bond risks a high-profile assassination but gains insight into Silva.

# Meeting Sévérine
# In Macau, Bond encounters Sévérine, who warns him of Silva's influence. Bond must decide how to engage her and obtain details on Silva's operations.

# Decision Point:
# - Earn Sévérine's Trust: They work together against Silva, forming a strong bond.
# - Use Intimidation: Sévérine cooperates under pressure but may be less supportive during encounters.

# The Capture of Silva
# Bond eventually captures Silva, but the antagonist has planned an escape from MI6. Bond's choice of holding facility could impact how Silva's plans play out.

# Decision Point:
# - Take Silva to MI6: Silva executes a planned escape, wreaking havoc.
# - Secure Silva in a Remote Facility: Silva's escape plan is disrupted but leads to another ambush.

# Retreat to Skyfall
# Realizing Silva's obsession with M, Bond decides to protect her by taking her to his remote family estate, Skyfall.

# Decision Point:
# - Head to Skyfall: Bond and M set up defenses at Skyfall, preparing for an intense showdown.
# - Secure M in an MI6 Safehouse: MI6 resources help protect M, leading to a confrontation on new turf.

# Defending Skyfall
# Bond and M improvise defenses as Silva's men attack Skyfall in waves.

# Decision Point:
# - Direct Confrontation: Bond engages with Silva's men directly, risking injury but taking out many.
# - Stealth and Traps: Bond uses guerrilla tactics, leading to a slower but more controlled defense.

# The Final Showdown
# Bond confronts Silva in a chapel where M is injured. Bond's approach could determine the outcome of his fight with Silva.

# Decision Point:
# - Attack Silva Head-On: Bond risks injury but prevents Silva from reaching M.
# - Distract Silva First: Bond misleads Silva, buying time for M to seek safety.

# Aftermath
# With Silva defeated, Bond faces a choice in the aftermath of the battle.

# Decision Point:
# - Stay with M: Bond shares M's final moments, honoring her legacy.
# - Pursue Silva's Network: Bond immediately goes after Silva's associates, seeking further justice.

# Example:

# Story Segment:
# You carefully plan your next move against MI6, considering the vulnerabilities you've uncovered.

# Choices:
# 1. Launch a cyber attack on MI6's mainframe: You decide to exploit their network weaknesses. [Attributes: strategy +2, deception +1]
# 2. Kidnap a key MI6 agent for leverage: You aim to gain valuable information. [Attributes: cunning +2, ruthlessness +1]
# 3. Plant misinformation to mislead MI6: You attempt to throw them off your trail. [Attributes: deception +2, strategy +1]

# Note: The choices should be in the above format only. Please don't give choices without following this format.
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

# def extract_choices(response_text):
#     choices = []
#     # Updated regex to match choices, making the attributes section optional
#     choice_pattern = re.compile(
#         r'^\d+\.\s*(.+?):\s*(.+?)(?:\s*\[Attributes:\s*(.*?)\])?$', re.MULTILINE)
#     matches = choice_pattern.findall(response_text)

#     for match in matches:
#         short_description, actual_choice, attributes_str = match
#         attributes = {}

#         # If attributes are present, parse them
#         if attributes_str:
#             attr_pairs = attributes_str.split(',')
#             for pair in attr_pairs:
#                 attr, value = pair.strip().split()
#                 attributes[attr] = int(value)

#         # Add the choice to the list, even if attributes are empty
#         choices.append({
#             "short_description": short_description.strip(),
#             "actual_choice": actual_choice.strip(),
#             "attributes": attributes  # Could be empty if no attributes are specified
#         })

#         # Stop after three choices, if present
#         if len(choices) == 3:
#             break

#     return choices

# def extract_story_segment(response_text):
#     story_segment = ""
#     story_pattern = re.compile(
#         r'Story Segment:\s*(.*?)\s*Choices:', re.DOTALL | re.IGNORECASE)
#     match = story_pattern.search(response_text)
#     if match:
#         story_segment = match.group(1).strip()
#     else:
#         default_story = "The story continues, but the next part remains unclear."
#         story_segment = default_story
#     return story_segment

# if __name__ == '__main__':
#     app.run(port=5000)



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

####Final --------------------------------------------------------------------------------


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import ollama
# import re
# import time
# import os
# from openai import OpenAI

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# # Enter your Assistant ID here.
# ASSISTANT_ID = "asst_uSDJ1QF4IUPC7ybQBblYTg6r"  # Replace with your Assistant ID

# # Make sure your API key is set as an environment variable.
# client = OpenAI()

# # In-memory storage for threads and runs
# threads = {}  # Key: thread_id, Value: {'thread': thread, 'run': run}
# runs = {}

# @app.route('/generate', methods=['POST'])
# def generate():
#     data = request.json
#     story = data['story']
#     choice = data['choice']
#     current_breakpoint = data['current_breakpoint']
#     choice_history = data.get('choice_history', [])

#     # Update the story context to include the chosen path explicitly
#     accumulated_story = " ".join(choice_history) + f" {story} You chose: {choice}"

#     # Refined prompt to ensure the story strictly follows the player's choice and includes attributes
#     input_text = f"""
#     [Your long prompt here...]
#     """

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

# def extract_choices(response_text):
#     choices = []
#     # Updated regex to match choices, making the attributes section optional
#     choice_pattern = re.compile(
#         r'^\d+\.\s*(.+?):\s*(.+?)(?:\s*\[Attributes:\s*(.*?)\])?$', re.MULTILINE)
#     matches = choice_pattern.findall(response_text)

#     for match in matches:
#         short_description, actual_choice, attributes_str = match
#         attributes = {}

#         # If attributes are present, parse them
#         if attributes_str:
#             attr_pairs = attributes_str.split(',')
#             for pair in attr_pairs:
#                 attr, value = pair.strip().split()
#                 attributes[attr] = int(value)

#         # Add the choice to the list, even if attributes are empty
#         choices.append({
#             "short_description": short_description.strip(),
#             "actual_choice": actual_choice.strip(),
#             "attributes": attributes  # Could be empty if no attributes are specified
#         })

#         # Stop after three choices, if present
#         if len(choices) == 3:
#             break

#     return choices

# def extract_story_segment(response_text):
#     story_segment = ""
#     story_pattern = re.compile(
#         r'Story Segment:\s*(.*?)\s*Choices:', re.DOTALL | re.IGNORECASE)
#     match = story_pattern.search(response_text)
#     if match:
#         story_segment = match.group(1).strip()
#     else:
#         default_story = "The story continues, but the next part remains unclear."
#         story_segment = default_story
#     return story_segment

# @app.route('/start_conversation', methods=['POST', 'OPTIONS'])
# def start_conversation():
#     if request.method == 'OPTIONS':
#         return '', 200  # Return OK for CORS preflight

#     data = request.json
#     user_message = data.get('message', 'Start')

#     # Create a new thread and start the conversation
#     thread = client.beta.threads.create(
#         messages=[
#             {
#                 "role": "user",
#                 "content": user_message,
#             }
#         ]
#     )

#     # Submit the thread to the assistant (as a new run)
#     run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)
#     print(f"👉 Run Created: {run.id}")

#     # Function to get the response from the assistant
#     def get_response():
#         nonlocal run
#         while run.status != "completed":
#             run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
#             print(f"🏃 Run Status: {run.status}")
#             time.sleep(1)
#         else:
#             print(f"🏁 Run Completed!")
#         # Get the latest message from the thread
#         message_response = client.beta.threads.messages.list(thread_id=thread.id)
#         messages = message_response.data
#         latest_message = messages[0]
#         return latest_message.content[0].text.value

#     # Initial response
#     assistant_message = get_response()
#     print(f"💬 Response: {assistant_message}")

#     # Store the thread
#     threads[thread.id] = thread

#     return jsonify({"thread_id": thread.id, "assistant_message": assistant_message})

# @app.route('/send_message', methods=['POST', 'OPTIONS'])
# def send_message():
#     if request.method == 'OPTIONS':
#         return '', 200  # Return OK for CORS preflight

#     data = request.json
#     thread_id = data.get('thread_id')
#     user_message = data.get('message')

#     if thread_id not in threads:
#         return jsonify({"error": "Invalid thread ID"}), 400

#     # Retrieve the thread
#     thread = threads[thread_id]

#     # Add the user's input as the next message in the thread
#     client.beta.threads.messages.create(
#         thread_id=thread.id,
#         role="user",
#         content=user_message,
#     )

#     # Submit the thread to the assistant (as a new run)
#     run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)
#     print(f"👉 Run Created: {run.id}")

#     # Function to get the response from the assistant
#     def get_response():
#         nonlocal run
#         while run.status != "completed":
#             run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
#             print(f"🏃 Run Status: {run.status}")
#             time.sleep(1)
#         else:
#             print(f"🏁 Run Completed!")
#         # Get the latest message from the thread
#         message_response = client.beta.threads.messages.list(thread_id=thread.id)
#         messages = message_response.data
#         latest_message = messages[0]
#         return latest_message.content[0].text.value

#     # Get assistant's response
#     assistant_message = get_response()
#     print(f"💬 Response: {assistant_message}")

#     return jsonify({"assistant_message": assistant_message})

# if __name__ == '__main__':
#     app.run(port=5000)

###############RESULTS##################################

from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import re
import time
import os
from openai import OpenAI

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Enter your Assistant ID here.
ASSISTANT_ID = "asst_uSDJ1QF4IUPC7ybQBblYTg6r"  # Replace with your Assistant ID

# Make sure your API key is set as an environment variable.
client = OpenAI()

# In-memory storage for threads and runs
threads = {}  # Key: thread_id, Value: {'thread': thread, 'run': run}
runs = {}

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
    [Your long prompt here...]
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

@app.route('/start_conversation', methods=['POST', 'OPTIONS'])
def start_conversation():
    if request.method == 'OPTIONS':
        return '', 200  # Return OK for CORS preflight

    data = request.json
    user_message = data.get('message', 'Start')

    # Create a new thread and start the conversation
    thread = client.beta.threads.create(
        messages=[
            {
                "role": "user",
                "content": user_message,
            }
        ]
    )

    # Submit the thread to the assistant (as a new run)
    run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)
    print(f"👉 Run Created: {run.id}")

    # Function to get the response from the assistant
    def get_response():
        nonlocal run
        while run.status != "completed":
            run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            print(f"🏃 Run Status: {run.status}")
            time.sleep(1)
        else:
            print(f"🏁 Run Completed!")
        # Get the latest message from the thread
        message_response = client.beta.threads.messages.list(thread_id=thread.id)
        messages = message_response.data
        latest_message = messages[0]
        return latest_message.content[0].text.value

    # Initial response
    assistant_message = get_response()
    print(f"💬 Response: {assistant_message}")

    # Store the thread
    threads[thread.id] = thread

    return jsonify({"thread_id": thread.id, "assistant_message": assistant_message})

@app.route('/send_message', methods=['POST', 'OPTIONS'])
def send_message():
    if request.method == 'OPTIONS':
        return '', 200  # Return OK for CORS preflight

    data = request.json
    thread_id = data.get('thread_id')
    user_message = data.get('message')

    if thread_id not in threads:
        return jsonify({"error": "Invalid thread ID"}), 400

    # Retrieve the thread
    thread = threads[thread_id]

    # Add the user's input as the next message in the thread
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=user_message,
    )

    # Submit the thread to the assistant (as a new run)
    run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)
    print(f"👉 Run Created: {run.id}")

    # Function to get the response from the assistant
    def get_response():
        nonlocal run
        while run.status != "completed":
            run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            print(f"🏃 Run Status: {run.status}")
            time.sleep(1)
        else:
            print(f"🏁 Run Completed!")
        # Get the latest message from the thread
        message_response = client.beta.threads.messages.list(thread_id=thread.id)
        messages = message_response.data
        latest_message = messages[0]
        return latest_message.content[0].text.value

    # Get assistant's response
    assistant_message = get_response()
    print(f"💬 Response: {assistant_message}")

    return jsonify({"assistant_message": assistant_message})

if __name__ == '__main__':
    app.run(port=5000)