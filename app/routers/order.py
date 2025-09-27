from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/v1/orders", tags=["orders"])

# Giả lập DB orders
db_orders = {}

@router.post("/create/{listing_id}")
def create_order(listing_id: str, buyer_id: str = "u_rec", amount_cents: int = 25000, commission_cents: int = 6250, seller_take_cents: int = 18750):
    order_id = f"o_{len(db_orders)+1}"
    order = {
        "id": order_id,
        "listing_id": listing_id,
        "buyer_id": buyer_id,
        "amount_cents": amount_cents,
        "commission_cents": commission_cents,
        "seller_take_cents": seller_take_cents,
        "status": "CREATED"
    }
    db_orders[order_id] = order
    return order

@router.get("/{id}")
def get_order(id: str):
    order = db_orders.get(id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/{id}/pay-mock")
def pay_mock(id: str):
    order = db_orders.get(id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] != "CREATED":
        raise HTTPException(status_code=400, detail="Order not in CREATED status")
    order["status"] = "PAID_MOCK"
    db_orders[id] = order
    return order
