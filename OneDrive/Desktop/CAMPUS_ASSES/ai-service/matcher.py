import requests
from PIL import Image
from io import BytesIO
import random

# Attempt to load CLIP model. If not available, we use a mock matcher for demonstration.
try:
    import torch
    from transformers import CLIPProcessor, CLIPModel

    # Load model (this will take time on first run)
    model_id = "openai/clip-vit-base-patch32"
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    print(f"Loading CLIP model on {device}...")
    model = CLIPModel.from_pretrained(model_id).to(device)
    processor = CLIPProcessor.from_pretrained(model_id)
    print("CLIP model loaded successfully.")
    
    USE_MOCK = False

except ImportError:
    print("WARNING: 'torch' or 'transformers' not installed. Using MOCK AI Matching.")
    USE_MOCK = True


def load_image(url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        print(f"Error loading image from {url}: {e}")
        return None

def get_image_embedding(image_url: str):
    if USE_MOCK:
        # Generate a deterministic but pseudo-random float vector based on string hash
        import hashlib
        h = int(hashlib.md5(image_url.encode()).hexdigest(), 16)
        random.seed(h)
        return [random.uniform(-1, 1) for _ in range(512)]
        
    image = load_image(image_url)
    if image is None:
        return None
    
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        image_features = model.get_image_features(**inputs)
        
    # Normalize features
    image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
    return image_features.cpu().numpy()[0]

def get_similarity_score(emb1, emb2):
    if USE_MOCK:
        # Mock cosine similarity logic
        dot_product = sum(a*b for a, b in zip(emb1, emb2))
        norm_a = sum(a*a for a in emb1) ** 0.5
        norm_b = sum(b*b for b in emb2) ** 0.5
        sim = dot_product / (norm_a * norm_b)
        # Normalize mock output slightly so it looks like a realistic percentage (60-98%)
        return 0.60 + (abs(sim) * 0.38)
        
    import numpy as np
    # Cosine similarity for numpy arrays
    score = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
    return float(score)
