from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_chat():
    print("\n--- Testing Chat Endpoint ---")
    query = "What items are running low on stock?"
    print(f"Query: {query}")
    
    response = client.post(
        "/api/v1/chat",
        json={
            "merchant_id": "M_PAYTM_9991",
            "query": query
        }
    )
    print("Response Status:", response.status_code)
    print("Response JSON:")
    print(response.json())

if __name__ == "__main__":
    test_chat()
