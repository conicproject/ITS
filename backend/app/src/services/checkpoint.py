# backend/app/src/services/checkpoint.py
from src.repositories.checkpoint import CheckpointRepository

class CheckpointService:
    def __init__(self):
        self.checkpoint_repo = CheckpointRepository()

    def get_checkpoint(self):
        data = self.checkpoint_repo.get_checkpoint()
        if not data:
            return {"message": "ไม่พบข้อมูล"}
        return data
