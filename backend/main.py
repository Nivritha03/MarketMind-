from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests

# ---------------- CONFIG ----------------

# Hugging Face
HF_TOKEN = "HF_TOKEN_KEY"
HF_HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

# Hugging Face text generation (updated router endpoint)
HF_TEXT_GEN = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2"
HF_SENTIMENT_URL = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment"


# Groq AI
from groq import Groq
GROQ_KEY = "GROQ_API_KEY"  
groq_client = Groq(api_key=GROQ_KEY)

# Working Groq model
GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# ---------------- APP ----------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MODELS ----------------

class InputData(BaseModel):
    product: str
    audience: str

class TextData(BaseModel):
    text: str

class Lead(BaseModel):
    name: str
    engagement: float
    budget: float

# ---------------- AI GENERATION ----------------

def generate_with_groq(prompt):
    """Try Groq AI first"""
    try:
        completion = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        if completion.choices and completion.choices[0].message.content:
            return f"[Groq] {completion.choices[0].message.content}"
        return None
    except Exception as e:
        print("Groq failed, falling back to Hugging Face:", e)
        return None

def generate_with_hf(prompt):
    """Hugging Face fallback using new router endpoint"""
    try:
        response = requests.post(
            HF_TEXT_GEN,
            headers=HF_HEADERS,
            json={
                "inputs": prompt,
                "parameters": {"max_new_tokens": 250},
                "options": {"wait_for_model": True}
            }
        )
        result = response.json()
        if isinstance(result, list) and "generated_text" in result[0]:
            return f"[HF] {result[0]['generated_text']}"
        return "[HF Generation Failed]"
    except Exception as e:
        print("Hugging Face generation failed:", e)
        return "[Error generating text]"

def ai_generate(prompt):
    """Unified AI generator with fallback"""
    result = generate_with_groq(prompt)
    if result:
        return result.strip()
    return generate_with_hf(prompt).strip()

# ---------------- ENDPOINTS ----------------

@app.post("/generate_campaign")
def generate_campaign(data: InputData):
    prompt = f"Create marketing campaign for {data.product} targeting {data.audience}"
    return {"campaign": ai_generate(prompt)}

@app.post("/generate_pitch")
def generate_pitch(data: InputData):
    prompt = f"Create sales pitch for {data.product} targeting {data.audience}"
    return {"pitch": ai_generate(prompt)}

@app.post("/insights")
def insights(data: InputData):
    prompt = f"""
Generate detailed market insights for:

Product: {data.product}
Audience: {data.audience}

Include:
- Demand
- Strategy
- Channels
- Next Best Actions
"""
    return {"insights": ai_generate(prompt)}

# ---------------- HUGGING FACE SENTIMENT ----------------

@app.post("/sentiment")
def sentiment(data: TextData):
    response = requests.post(
        HF_SENTIMENT_URL,
        headers=HF_HEADERS,
        json={"inputs": data.text, "options": {"wait_for_model": True}}
    )

    try:
        result = response.json()
        top = max(result[0], key=lambda x: x["score"])

        mapping = {
            "LABEL_0": "Negative",
            "LABEL_1": "Neutral",
            "LABEL_2": "Positive"
        }

        return {
            "sentiment": mapping[top["label"]],
            "confidence": round(top["score"], 3)
        }

    except Exception:
        return {
            "error": "Invalid Hugging Face response",
            "raw": response.text
        }


# ---------------- LEAD SCORING ----------------

@app.post("/score_leads")
def score_leads(leads: List[Lead]):
    scored = []
    for l in leads:
        score = (l.engagement * 0.6) + (l.budget * 0.4)
        scored.append({"name": l.name, "score": round(score, 2)})
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored

# ---------------- HEALTH CHECK ----------------

@app.get("/")
def root():
    return {"status": "MarketMind backend running with Groq + Hugging Face AI"}
