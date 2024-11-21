

# import requests

# # Replace these with your details
# API_KEY = "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"
# ASSISTANT_ID = "asst_uSDJ1QF4IUPC7ybQBblYTg6r"
# URL = f"https://api.openai.com/v1/assistants/{ASSISTANT_ID}/messages"


# headers = {
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {API_KEY}",
#     "OpenAI-Beta": "assistants=v2"
# }

# data = {
#     "input": {
#         "message": "Hello, tell me a story!"
#     }
# }

# response = requests.post(URL, headers=headers, json=data)

# if response.status_code == 200:
#     print("Assistant Response:", response.json()["output"]["message"])
# else:
#     print("Error:", response.status_code, response.json())


#----------------------------------------------
# import requests

# API_KEY = "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"
# URL = "https://api.openai.com/v1/assistants"

# headers = {
#     "Authorization": f"Bearer {API_KEY}",
#     "OpenAI-Beta": "assistants=v2"
# }

# response = requests.get(URL, headers=headers)

# if response.status_code == 200:
#     print(response.json())
# else:
#     print("Error:", response.status_code, response.json())


#--------------------------------------------------
# from openai import OpenAI
# import os
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# # Initialize the OpenAI client
# client = OpenAI(
#     organization=os.getenv("OPENAI_ORGANIZATION"),
#     project=os.getenv("OPENAI_PROJECT_ID"),
# )

# def chat_with_assistant():
#     conversation_history = []  # Store the conversation history

#     print("Assistant: Hello! How can I assist you today?")
#     while True:
#         # Get user input
#         user_input = input("You: ")
#         if user_input.lower() in {"exit", "quit"}:
#             print("Assistant: Goodbye!")
#             break

#         # Append user input to the conversation history
#         conversation_history.append({"role": "user", "content": user_input})

#         # Get the assistant's response
#         stream = client.chat.completions.create(
#             model="gpt-4o", 
#             messages=conversation_history,
#             stream=True,
#         )

#         print("Assistant: ", end="")
#         assistant_response = ""
#         for chunk in stream:
#             if chunk.choices[0].delta.content is not None:
#                 content = chunk.choices[0].delta.content
#                 assistant_response += content
#                 print(content, end="", flush=True)

#         print() 

#         # Append the assistant's response to the conversation history
#         conversation_history.append({"role": "assistant", "content": assistant_response})

# # Start the continuous interaction
# chat_with_assistant()


import time
from openai import OpenAI

# Enter your Assistant ID here.
ASSISTANT_ID = "asst_uSDJ1QF4IUPC7ybQBblYTg6r"

# Make sure your API key is set as an environment variable.
client = OpenAI()

# Create a thread with a message.
thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            # Update this with the query you want to use.
            "content": "Start",
        }
    ]
)

# Submit the thread to the assistant (as a new run).
run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)
print(f"👉 Run Created: {run.id}")

# Wait for run to complete.
while run.status != "completed":
    run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
    print(f"🏃 Run Status: {run.status}")
    time.sleep(1)
else:
    print(f"🏁 Run Completed!")

# Get the latest message from the thread.
message_response = client.beta.threads.messages.list(thread_id=thread.id)
messages = message_response.data

# Print the latest message.
latest_message = messages[0]
print(f"💬 Response: {latest_message.content[0].text.value}")

