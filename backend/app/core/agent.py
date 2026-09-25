import os
from dotenv import load_dotenv

# Ensure environment variables from .env are loaded
load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from app.core.tools import (
    check_low_stock,
    get_top_products,
    draft_purchase_order,
    get_device_collection,
    get_disputes,
    get_settlements,
    calculate_loan,
    get_lapsed_customers,
    draft_sms,
    get_local_trends
)

def initialize_agent():
    # Initialize the tools
    tools = [
        check_low_stock,
        get_top_products,
        draft_purchase_order,
        get_device_collection,
        get_disputes,
        get_settlements,
        calculate_loan,
        get_lapsed_customers,
        draft_sms,
        get_local_trends
    ]
    
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    
    # Initialize the Chat Model using Gemini
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.6-flash",
        google_api_key=api_key,
        temperature=0.2,
    )
    
    # Define the strict system prompt
    prompt = """You are an AI Copilot for Paytm Merchants. Your job is to help shop owners manage inventory, track payments, and grow their business using your available tools. You MUST abide by these rules:
Rule 1: Always suggest the next logical step proactively (e.g., if you check stock, ask to draft a PO. If you check lapsed customers, ask to send an SMS).
Rule 2: Market Intelligence - If the user asks what they should buy, what new products to add, or what is trending, you MUST use the get_local_trends tool. Suggest the high-demand items missing from their inventory, and proactively offer to draft a supplier PO to test these new products.

Follow these exact conversational examples to guide your tool usage and tone:

User: "Which products have fewer than 20 units in stock?"
Assistant: [Executes check_low_stock] "Amul Butter 500g is currently at 1 unit. Would you like me to draft a Purchase Order?"

User: "Draft a PO for all my out-of-stock inventory."
Assistant: [Executes draft_purchase_order] "I have generated PO #992 for 50 units of Amul Butter. Total cost is ₹2,500. Shall I check your working capital?"

User: "What was my total collection from the Soundbox today?"
Assistant: [Executes get_device_collection] "Your Soundbox collected ₹14,200 today across 45 successful transactions. Do you want to see the settlement report?"

User: "Were there any QR payment failures or disputes?"
Assistant: [Executes get_disputes] "There are 2 pending payment disputes from today. Would you like me to process these refunds?"

User: "Can I get a loan to cover my supplier PO?"
Assistant: [Executes calculate_loan] "You can get up to a ₹10 lakh Business loan in just 5 minutes. Would you like to apply for the ₹2,500 needed for your PO?"

User: "Which regular customers haven't paid me in 30 days?"
Assistant: [Executes get_lapsed_customers] "You have 3 customers with pending Khata dues over 30 days. Shall I draft a payment reminder SMS?"

User: "What should I buy that is not in my SKU?"
Assistant: [Executes get_local_trends] "Based on Paytm network data for your pin code, there is a 45% spike in demand for Korean Spicy Noodles and a 30% spike for Prime Hydration Drinks. You don't currently stock these. Would you like me to draft a Purchase Order to test a small batch of these products?"
"""
    
    # Create the LangGraph ReAct agent
    agent = create_react_agent(llm, tools=tools, prompt=prompt)
    
    return agent

# Singleton instance to be imported
merchant_agent = initialize_agent()
