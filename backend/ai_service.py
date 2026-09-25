import json
import os
from pydantic import BaseModel
from google import genai
from google.genai import types

class InsightSchema(BaseModel):
    insight_type: str
    confidence: int
    gmv_impact_inr: float
    recommended_action: str
    urgency: str

def generate_morning_digest(inventory_data: str, transaction_data: str) -> str:
    """Generates a structured morning briefing digest based on yesterday's data."""
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are the Paytm Merchant Copilot. Analyze the following data and generate a strategic morning briefing digest.
    
    Inventory Data:
    {inventory_data}
    
    Transaction Data:
    {transaction_data}
    
    Return a valid JSON string (no markdown formatting) strictly matching this schema:
    {json.dumps(InsightSchema.model_json_schema(), indent=2)}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        cleaned_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
        # Verify it parses to our schema
        insight = InsightSchema.model_validate_json(cleaned_text)
        return insight.model_dump_json()
    except Exception as e:
        print(f"Error generating digest: {e}")
        # Fallback payload
        fallback = InsightSchema(
            insight_type="System Summary",
            confidence=100,
            gmv_impact_inr=0.0,
            recommended_action="Review inventory manually.",
            urgency="LOW"
        )
        return fallback.model_dump_json()

async def evaluate_working_capital(item_name: str, stock: int):
    model = genai.Client(api_key=os.getenv("GEMINI_API_KEY")).models
    
    prompt = f"""
    You are a Paytm Fintech Copilot. 
    The merchant's inventory for '{item_name}' has dropped to {stock} units. 
    They need to restock 50 units. Assume an average cost of ₹60 per unit.
    Return a raw JSON string (do not include Markdown formatting or ```json blocks) containing exactly two keys:
    - "recommended_loan_amount": (calculate 50 * 60)
    - "supplier_sms": (a short, professional text message in Hinglish to order the 50 units)
    """
    
    try:
        response = model.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
        )
        cleaned_text = response.text.strip().removeprefix('```json').removesuffix('```').strip()
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"Gemini API rate limit or error: {e}")
        return {
            "recommended_loan_amount": "₹3,000 (Fallback)", 
            "supplier_sms": "System rate limited. Please manually SMS the supplier for 50 units."
        }
