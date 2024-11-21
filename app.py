from flask import Flask, request, jsonify
from openai import OpenAI
import time

app = Flask(__name__)

# OpenAI API Setup
ASSISTANT_ID = "asst_uSDJ1QF4IUPC7ybQBblYTg6r"  # Replace with your Assistant ID
client = OpenAI()

# Start a conversation and create a thread
@app.route('/start', methods=['POST'])
def start_conversation():
    thread = client.beta.threads.create(
        messages=[
            {"role": "user", "content": "Start"}
        ]
    )
    run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)
    return jsonify({"thread_id": thread.id, "run_id": run.id})

# Get a response from the assistant
@app.route('/response', methods=['POST'])
def get_response():
    data = request.json
    thread_id = data['thread_id']
    user_input = data['user_input']

    # Add user's input as a message in the thread
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=user_input,
    )

    # Create a new run for the assistant to process the input
    run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id=ASSISTANT_ID)

    # Wait for completion and fetch the response
    while run.status != "completed":
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
        time.sleep(1)

    # Get the assistant's response
    message_response = client.beta.threads.messages.list(thread_id=thread_id)
    messages = message_response.data
    latest_message = messages[0]
    assistant_response = latest_message.content[0].text.value

    return jsonify({"assistant_response": assistant_response})

if __name__ == '__main__':
    app.run(debug=True)
