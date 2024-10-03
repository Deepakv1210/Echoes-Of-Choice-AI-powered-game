from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)  # Enable CORS
print("Hello World!")
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
    input_text = f"{story} {choice}"
    try:
        new_story=ollama.generate(model='llama3.2', prompt=input_text)
        # ollama.generate(model='llama3.2', prompt='Why is the sky blue?')
        response_text = new_story["response"]
        print(response_text)
        # new_story = model.complete(input_text)
    except Exception as e:
        print(f"Error generating story: {e}")
        return jsonify({"error": str(e)}), 500

    return jsonify({"new_story": response_text})

if __name__ == '__main__':
    app.run(port=5000)