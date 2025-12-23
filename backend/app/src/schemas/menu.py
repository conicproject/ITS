from pydantic import BaseModel
from typing import List, Optional

class Menu(BaseModel):
    id: int
    label: str
    path: Optional[str]
    parent_id: Optional[int]
    order: Optional[int]
    children: List['Menu'] = []

Menu.model_rebuild()
