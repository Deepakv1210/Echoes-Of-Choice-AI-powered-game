# import torch
# print(f"CUDA version: {torch.version.cuda}")
# print(f"CUDA available: {torch.cuda.is_available()}")
# print(f"Number of GPUs: {torch.cuda.device_count()}")

from transformers import T5EncoderModel, BitsAndBytesConfig
from diffusers import PixArtAlphaPipeline
from huggingface_hub import login
import torch
print(f"CUDA available: {torch.cuda.is_available()}")
# login(token="hf_")
# Define the quantization configuration
quantization_config = BitsAndBytesConfig(
    load_in_8bit=True,
    llm_int8_threshold=6.0,
    llm_int8_has_fp16_weight=False,
    llm_int8_enable_fp32_cpu_offload= True,
)

# Load the text encoder
text_encoder = T5EncoderModel.from_pretrained(
    "PixArt-alpha/PixArt-XL-2-1024-MS",
    subfolder="text_encoder",
    cache_dir="/content/stable-diffusion-webui/models/Stable-diffusion",
    quantization_config=quantization_config,  
    device_map="balanced"  # balanced device allocation
)

# Load the PixArtAlphaPipeline
pipe = PixArtAlphaPipeline.from_pretrained(
    "PixArt-alpha/PixArt-XL-2-1024-MS",
    text_encoder=text_encoder,
    transformer=None,
    device_map="balanced",  # balanced device allocation
    quantization_config=quantization_config
)

import gc 
import torch
def flush():
    gc.collect()
    torch.cuda.empty_cache()

with torch.no_grad():
    prompt = "You find yourself at the entrance of a dark cave."
    prompt_embeds, prompt_attention_mask, negative_embeds, negative_prompt_attention_mask = pipe.encode_prompt(prompt)

del text_encoder
del pipe
flush()
pipe = PixArtAlphaPipeline.from_pretrained(
    "PixArt-alpha/PixArt-XL-2-1024-MS",
    text_encoder=None,
    torch_dtype=torch.float16,
).to("cuda")

latents = pipe(
    negative_prompt=None, 
    prompt_embeds=prompt_embeds,
    negative_prompt_embeds=negative_embeds,
    prompt_attention_mask=prompt_attention_mask,
    negative_prompt_attention_mask=negative_prompt_attention_mask,
    num_images_per_prompt=1,
    output_type="latent",
).images

del pipe.transformer
flush()

with torch.no_grad():
    image = pipe.vae.decode(latents / pipe.vae.config.scaling_factor, return_dict=False)[0]
image = pipe.image_processor.postprocess(image, output_type="pil")

image[0].save("cave.png")
