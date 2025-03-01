from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Explanation:
    id: str
    modelId: str
    layer: str
    index: str
    description: str
    authorId: str

    embedding: Optional[list[float]] = None
    triggeredById: Optional[str] = None
    typeName: Optional[str] = None
    explanationModelName: Optional[str] = None
    notes: Optional[str] = None
    createdAt: datetime = field(default_factory=datetime.now)
