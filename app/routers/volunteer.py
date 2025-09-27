from fastapi import APIRouter

router = APIRouter(prefix="/v1/volunteer", tags=["volunteer"])

@router.get("/tasks")
def list_tasks():
    # TODO: Lấy danh sách nhiệm vụ
    return {"tasks": []}

@router.post("/tasks/{id}/accept")
def accept_task(id: int):
    # TODO: Nhận nhiệm vụ
    return {"message": f"Task {id} accepted"}

@router.post("/tasks/{id}/complete")
def complete_task(id: int):
    # TODO: Hoàn thành nhiệm vụ
    return {"message": f"Task {id} completed"}
