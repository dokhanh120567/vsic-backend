from fastapi import APIRouter

router = APIRouter(prefix="/v1/threads", tags=["chat"])

@router.post("")
def create_thread():
    # TODO: Tạo thread chat
    return {"thread_id": 1}

@router.get("")
def list_threads():
    # TODO: Lấy danh sách thread
    return {"threads": []}

@router.post("/{id}/messages")
def send_message(id: int):
    # TODO: Gửi tin nhắn
    return {"message": "Sent"}
