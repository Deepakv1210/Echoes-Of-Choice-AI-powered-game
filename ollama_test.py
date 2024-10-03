import ollama
# response = ollama.chat(model='llama3.2', messages=[
#   {
#     'role': 'user',
#     'content': 'Why is the sky blue?',
#   },
# ])
# print(response['message']['content'])
res=ollama.generate(model='llama3.2', prompt='Why is the sky blue?')
text=res["response"]
print(text)