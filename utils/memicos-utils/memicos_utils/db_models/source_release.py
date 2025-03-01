from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime


@dataclass
class SourceRelease:
    name: str
    description: str
    creatorName: str
    creatorId: str
    visibility: str = "PUBLIC"
    isNewUi: bool = False
    featured: bool = False
    descriptionShort: Optional[str] = None
    urls: List[str] = field(default_factory=list)
    creatorEmail: Optional[str] = None
    creatorNameShort: Optional[str] = None
    defaultSourceSetName: Optional[str] = None
    defaultSourceId: Optional[str] = None
    defaultUmapSourceIds: List[str] = field(default_factory=list)
    createdAt: datetime = field(default_factory=datetime.now)
