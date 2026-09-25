from langchain_core.tools import tool

@tool
def check_low_stock() -> str:
    """Returns a list of items with critically low stock."""
    return "Amul Butter 500g at 1 unit."

@tool
def get_top_products() -> str:
    """Returns the top selling products."""
    return "Aashirvaad Atta, Fortune Oil, and Maggi."

@tool
def draft_purchase_order() -> str:
    """Drafts a purchase order for out-of-stock items."""
    return "PO #992 for 50 units of Amul Butter (Total: ₹2,500)."

@tool
def get_device_collection() -> str:
    """Returns the total collection from hardware devices like Soundbox."""
    return "Soundbox collection of ₹14,200 across 45 transactions."

@tool
def get_disputes() -> str:
    """Returns pending QR payment failures or disputes."""
    return "2 pending QR payment disputes for today."

@tool
def get_settlements() -> str:
    """Returns yesterday's bank settlement status."""
    return "Yesterday's bank settlement status: ₹12,000 successful."

@tool
def calculate_loan() -> str:
    """Returns instant business loan offers."""
    return "Instant business loan offer up to ₹10 lakh in 5 mins."

@tool
def get_lapsed_customers() -> str:
    """Returns customers with pending dues or who haven't visited recently."""
    return "3 customers with pending Khata dues over 30 days."

@tool
def draft_sms() -> str:
    """Drafts a promotional marketing SMS."""
    return "Hi! Enjoy 10% off your next grocery run at our store!"

@tool
def get_local_trends(location: str = "local") -> str:
    """Returns simulated JSON market data for local trending products not in current SKU."""
    return ("Trending in your pin code this week: 1. Korean Spicy Noodles (+45% demand), "
            "2. Prime Hydration Drink (+30% demand). These items are currently missing from your SKU list.")
