from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime


@dataclass
class Source:
    id: str
    modelId: str
    setName: str
    creatorId: str
    hasDashboards: bool = True
    inferenceEnabled: bool = True
    inferenceHosts: List[str] = field(default_factory=list)
    saelensConfig: Optional[str] = None
    saelensRelease: Optional[str] = None
    saelensSaeId: Optional[str] = None
    hfRepoId: Optional[str] = None
    hfFolderId: Optional[str] = None
    visibility: str = "PUBLIC"
    defaultOfModelId: Optional[str] = None
    hasUmap: bool = False
    hasUmapLogSparsity: bool = False
    hasUmapClusters: bool = False
    num_prompts: Optional[int] = None
    num_tokens_in_prompt: Optional[int] = None
    dataset: Optional[str] = None
    notes: Optional[str] = None
    createdAt: datetime = field(default_factory=datetime.now)
