import time
from openai import OpenAI

# Enter your Assistant ID here.
ASSISTANT_ID = "asst_uSDJ1QF4IUPC7ybQBblYTg6r"

# Make sure your API key is set as an environment variable.
client = OpenAI()

# Create a new thread and start the conversation
thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content": "Start",
        }
    ]
)

# Submit the thread to the assistant (as a new run)
run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)
print(f"👉 Run Created: {run.id}")

# Function to get the response from the assistant
def get_response():
    global run
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
response = get_response()
print(f"💬 Response: {response}")

while True:
    user_input = input("Your choice: ").strip()
    if user_input.lower() in ["exit", "quit"]:
        print("Exiting the conversation. Goodbye!")
        break

    # Add the user's input as the next message in the thread
    client.beta.threads.messages.create(
        thread_id=thread.id,  
        role="user",          
        content=user_input,   
    )

    run = client.beta.threads.runs.create(thread_id=thread.id, assistant_id=ASSISTANT_ID)
    response = get_response()
    print(f"💬 Response: {response}")
