from src.services.checkpoint import CheckpointService
from fastapi import HTTPException, Depends

class CheckpointController:
    def __init__(self):
        self.checkpoint = CheckpointService()

    def get_checkpoint(self):
        try:
            return self.checkpoint.get_checkpoint()
        except Exception as e:
            print("Get checkpoint error:", str(e))
            raise HTTPException(status_code=500, detail="Internal server error")