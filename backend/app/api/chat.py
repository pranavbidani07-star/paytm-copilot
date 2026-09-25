from fastapi import APIRouter, status
from pydantic import BaseModel
from app.core.agent import merchant_agent

router = APIRouter()

class ChatPayload(BaseModel):
    merchant_id: str = "demo_merchant"
    query: str = None
    message: str = None

@router.post("/chat", status_code=status.HTTP_200_OK)
async def chat_endpoint(payload: ChatPayload):
    """
    Passes the query to the LangChain agent.
    """
    try:
        # Run the LangGraph agent
        user_text = payload.query or payload.message or ""
        response = await merchant_agent.ainvoke({"messages": [("user", user_text)]})
        
        # The response state contains a 'messages' key, the last message is the AI's final response
        last_message = response["messages"][-1]
        
        # Find tools used by looking at AIMessage's tool_calls
        tools_used = []
        for msg in response["messages"]:
            if hasattr(msg, "tool_calls") and msg.tool_calls:
                tools_used.extend([tc["name"] for tc in msg.tool_calls])
                
        # Ensure reply is always a clean string even if message content is structured
        content = last_message.content
        if isinstance(content, list):
            text_parts = []
            for part in content:
                if isinstance(part, dict) and "text" in part:
                    text_parts.append(part["text"])
                elif isinstance(part, str):
                    text_parts.append(part)
                else:
                    text_parts.append(str(part))
            reply_text = "".join(text_parts)
        elif isinstance(content, dict):
            reply_text = content.get("text", str(content))
        else:
            reply_text = str(content)
                
        return {
            "reply": reply_text,
            "tools_used": list(set(tools_used))
        }
    except Exception as e:
        return {"reply": f"An error occurred: {str(e)}", "tools_used": []}
