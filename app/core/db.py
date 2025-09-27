from typing import Dict

# In-memory "DB"
users_by_email: Dict[str, dict] = {}
users_by_id: Dict[str, dict] = {}

listings: Dict[str, dict] = {}
claims: Dict[str, dict] = {}
orders: Dict[str, dict] = {}
reviews: Dict[str, dict] = {}

def add_user(rec: dict):
    users_by_email[rec["email"]] = rec
    users_by_id[rec["id"]] = rec

def get_user_by_email(email: str) -> dict | None:
    return users_by_email.get(email)

def get_user_by_id(uid: str) -> dict | None:
    return users_by_id.get(uid)
