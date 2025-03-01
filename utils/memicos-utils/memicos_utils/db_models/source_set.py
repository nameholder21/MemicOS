from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime


@dataclass
class SourceSet:
    modelId: str
    name: str
    creatorId: str
    hasDashboards: bool = True
    visibility: str = "PRIVATE"
    description: str = ""
    type: str = ""
    creatorName: str = ""
    urls: List[str] = field(default_factory=list)
    creatorEmail: Optional[str] = None
    releaseName: Optional[str] = None
    defaultOfModelId: Optional[str] = None
    defaultRange: int = 1
    defaultShowBreaks: bool = True
    showDfa: bool = False
    showCorrelated: bool = False
    showHeadAttribution: bool = False
    showUmap: bool = False
    createdAt: datetime = field(default_factory=datetime.now)
