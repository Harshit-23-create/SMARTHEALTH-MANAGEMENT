from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from matcher import get_image_embedding, get_similarity_score

app = FastAPI(title="Campus Asset Recovery AI API")

class MatchRequest(BaseModel):
    source_image_url: str
    target_image_urls: List[str]

@app.get("/")
def read_root():
    return {"message": "AI Matching Service is running"}

@app.post("/api/match")
def match_images(request: MatchRequest):
    try:
        source_emb = get_image_embedding(request.source_image_url)
        if source_emb is None:
            raise HTTPException(status_code=400, detail="Could not process source image")

        results = []
        for target_url in request.target_image_urls:
            target_emb = get_image_embedding(target_url)
            if target_emb is not None:
                score = get_similarity_score(source_emb, target_emb)
                results.append({
                    "url": target_url,
                    "similarity": round(score * 100, 2) # convert to percentage
                })
        
        # Sort by highest similarity
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return {"matches": results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
