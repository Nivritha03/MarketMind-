from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests
from datetime import datetime, timedelta
from collections import Counter

# ================= MEMORY STORAGE =================

campaign_store = []
lead_store = []
pitch_store = []
api_usage_log = []

user_store = [
    {"id": 1, "name": "Alex Johnson", "role": "Admin", "status": "Active"},
    {"id": 2, "name": "Sarah Chen", "role": "Marketing", "status": "Active"},
    {"id": 3, "name": "James Wilson", "role": "Sales", "status": "Active"},
    {"id": 4, "name": "Maria Garcia", "role": "Analyst", "status": "Inactive"},
    {"id": 5, "name": "David Park", "role": "Marketing", "status": "Active"},
]

# ================= API KEYS =================
# Replace with real keys or use .env

HF_TOKEN = os.getenv("HF_TOKEN")
GROQ_KEY = os.getenv("GROQ_KEY")
HF_HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

HF_TEXT_GEN = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2"
HF_SENTIMENT_URL = "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment"

from groq import Groq
groq_client = Groq(api_key=GROQ_KEY)

GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# ================= APP =================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= MODELS =================

class InputData(BaseModel):
    product: str
    audience: str

class TextData(BaseModel):
    text: str

class Lead(BaseModel):
    name: str
    engagement: float
    budget: float

# ================= AI GENERATION =================

def generate_with_groq(prompt):
    try:
        completion = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        return completion.choices[0].message.content
    except:
        return None

def generate_with_hf(prompt):
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
        if isinstance(result, list):
            return result[0]["generated_text"]
        return "Generation failed"
    except:
        return "Generation failed"

def ai_generate(prompt):
    result = generate_with_groq(prompt)
    if result:
        return result.strip()
    return generate_with_hf(prompt).strip()

def log_api_call(call_type):
    api_usage_log.append({
        "type": call_type,
        "date": datetime.now().strftime("%Y-%m-%d")
    })

# ================= CORE ENDPOINTS =================

@app.post("/generate_campaign")
def generate_campaign(data: InputData):
    prompt = f"Create marketing campaign for {data.product} targeting {data.audience}"
    result = ai_generate(prompt)

    campaign_store.append({
        "product": data.product,
        "audience": data.audience,
        "content": result
    })

    log_api_call("campaign")
    return {"campaign": result}


@app.post("/generate_pitch")
def generate_pitch(data: InputData):
    prompt = f"Create sales pitch for {data.product} targeting {data.audience}"
    result = ai_generate(prompt)

    pitch_store.append({
        "product": data.product,
        "audience": data.audience,
        "content": result
    })

    log_api_call("pitch")
    return {"pitch": result}


@app.post("/insights")
def insights(data: InputData):
    prompt = f"""
Return structured JSON market insights.

Product: {data.product}
Audience: {data.audience}

Return ONLY valid JSON:
{{
  "market_trends": [],
  "growth_opportunities": [],
  "recommended_strategy": "",
  "next_best_actions": []
}}
"""

    try:
        import json
        raw = ai_generate(prompt).strip()

        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw.replace("json", "", 1).strip()

        parsed = json.loads(raw)

        # ✅ FORCE EVERYTHING TO STRING
        parsed["market_trends"] = [
            str(item) if not isinstance(item, str)
            else item
            for item in parsed.get("market_trends", [])
        ]

        parsed["growth_opportunities"] = [
            str(item) if not isinstance(item, str)
            else item
            for item in parsed.get("growth_opportunities", [])
        ]

        parsed["next_best_actions"] = [
            str(item) if not isinstance(item, str)
            else item
            for item in parsed.get("next_best_actions", [])
        ]

        parsed["recommended_strategy"] = str(parsed.get("recommended_strategy", ""))

        log_api_call("insights")

        return parsed

    except Exception as e:
        return {
            "market_trends": [f"Trend for {data.product}"],
            "growth_opportunities": [f"Opportunity in {data.audience} segment"],
            "recommended_strategy": f"Strategy for {data.product}",
            "next_best_actions": [f"Run campaign targeting {data.audience}"]
        }

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
    except:
        return {"error": "Sentiment failed"}

# ================= LEAD SCORING =================

@app.post("/score_leads")
def score_leads(leads: List[Lead]):
    scored = []

    for l in leads:
        score = ((l.engagement * 10) * 0.6) + ((l.budget / 100) * 0.4)
        score = min(score, 100)

        status = "Hot" if score >= 80 else "Warm" if score >= 50 else "Cold"

        lead_store.append({
            "name": l.name,
            "engagement": l.engagement,
            "budget": l.budget,
            "score": round(score, 2),
            "status": status
        })

        scored.append({
            "name": l.name,
            "score": round(score, 2),
            "status": status
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored

# ================= DASHBOARD =================

@app.get("/dashboard/summary")
def dashboard_summary():
    total_campaigns = len(campaign_store) + len(pitch_store)
    total_leads = len(lead_store)

    hot_leads = len([l for l in lead_store if l["score"] >= 80])

    conversion_rate = round((hot_leads / total_leads) * 100, 2) if total_leads > 0 else 0

    revenue_estimate = (
        len(campaign_store) * 2000 +
        len(pitch_store) * 1500 +
        hot_leads * 10000
    )

    return {
        "total_campaigns": total_campaigns,
        "total_leads": total_leads,
        "conversion_rate": conversion_rate,
        "revenue_estimate": revenue_estimate
    }


@app.get("/dashboard/lead-distribution")
def lead_distribution():
    hot = len([l for l in lead_store if l["score"] >= 80])
    warm = len([l for l in lead_store if 50 <= l["score"] < 80])
    cold = len([l for l in lead_store if l["score"] < 50])

    return {"hot": hot, "warm": warm, "cold": cold}


@app.get("/dashboard/campaign-performance")
def campaign_performance():
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    total_campaigns = len(campaign_store)
    total_leads = len(lead_store)

    data = []

    for i, month in enumerate(months):
        data.append({
            "month": month,
            "campaigns": max(total_campaigns - (5 - i), 0),
            "leads": max(total_leads - (5 - i) * 2, 0)
        })

    return data

# ================= ADMIN =================

@app.get("/admin/metrics")
def admin_metrics():

    hot_leads = len([l for l in lead_store if l["score"] >= 80])

    estimated_revenue = (
        len(campaign_store) * 2000 +
        len(pitch_store) * 1500 +
        hot_leads * 10000
    )

    return {
        "total_api_calls": len(api_usage_log),
        "campaigns_created": len(campaign_store),
        "pitches_created": len(pitch_store),
        "leads_scored": len(lead_store),
        "active_users": len([u for u in user_store if u["status"] == "Active"]),
        "estimated_revenue": estimated_revenue   # ✅ ADD THIS
    }


@app.get("/admin/api-calls-daily")
def api_calls_daily():
    today = datetime.now()
    current_week = []

    for i in range(6, -1, -1):
        day = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        count = len([log for log in api_usage_log if log["date"] == day])

        current_week.append({
            "date": day,
            "calls": count
        })

    return current_week


@app.get("/admin/users")
def get_users():
    return user_store


@app.put("/admin/users/{user_id}/toggle")
def toggle_user(user_id: int):
    for user in user_store:
        if user["id"] == user_id:
            user["status"] = "Inactive" if user["status"] == "Active" else "Active"
            return user
    return {"error": "User not found"}

@app.get("/admin/revenue")
def admin_revenue():

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    hot_leads = len([l for l in lead_store if l["score"] >= 80])

    total_revenue = (
        len(campaign_store) * 2000 +
        len(pitch_store) * 1500 +
        hot_leads * 10000
    )

    # Simple growing mock revenue distribution
    monthly_data = []

    for i, month in enumerate(months):
        monthly_data.append({
            "month": month,
            "revenue": round(total_revenue * ((i + 1) / len(months)), 2)
        })

    return monthly_data
@app.get("/")
def root():
    return {"status": "MarketMind backend running"}