"""
MemicOS Python Client Library

This library provides a clean interface to interact with MemicOS's API.

API Key Configuration:
There are three ways to configure your API key:

1. Context manager (recommended):
   ```python
   import memicos

   with memicos.api_key("your-api-key"):
       feature_request = memicos.FeatureRequest()
   ```

2. Global context setting:
   ```python
   import memicos

   memicos.set_api_key("your-api-key")
   feature_request = memicos.FeatureRequest()
   ```

3. Direct parameter (for explicit control):
   ```python
   feature_request = memicos.FeatureRequest(api_key="your-api-key")
   ```

4. Environment variable (existing behavior):
   ```python
   # Set MEMICOS_API_KEY environment variable
   feature_request = memicos.FeatureRequest()
   ```
"""

import contextvars
from contextlib import contextmanager
from typing import Optional

# Context variable for API key
_api_key_context: contextvars.ContextVar[Optional[str]] = contextvars.ContextVar(
    "memicos_api_key", default=None
)


def set_api_key(api_key: str) -> None:
    """
    Set the API key in the current context.

    Args:
        api_key: Your MemicOS API key
    """
    _api_key_context.set(api_key)


def get_api_key() -> Optional[str]:
    """
    Get the API key from the current context.

    Returns:
        The API key if set in context, None otherwise
    """
    return _api_key_context.get()


@contextmanager
def api_key(api_key: str):
    """
    Context manager for temporarily setting an API key.

    Args:
        api_key: Your MemicOS API key

    Example:
        ```python
        with memicos.api_key("your-key"):
            feature_request = FeatureRequest()
        ```
    """
    token = _api_key_context.set(api_key)
    try:
        yield
    finally:
        _api_key_context.reset(token)


from memicos.requests.activation_request import ActivationRequest

# Import request classes for easy access
from memicos.requests.feature_request import FeatureRequest
from memicos.requests.graph_request import GraphRequest
from memicos.requests.list_request import ListRequest
from memicos.requests.model_request import ModelRequest
from memicos.requests.sae_feature_request import SAEFeatureRequest
from memicos.requests.source_set_request import SourceSetRequest
from memicos.requests.steer_request import SteerChatRequest, SteerCompletionRequest
from memicos.requests.vector_request import VectorRequest

__all__ = [
    "set_api_key",
    "get_api_key",
    "api_key",
    "FeatureRequest",
    "ModelRequest",
    "GraphRequest",
    "SourceSetRequest",
    "VectorRequest",
    "ListRequest",
    "SAEFeatureRequest",
    "SteerChatRequest",
    "SteerCompletionRequest",
    "ActivationRequest",
]
