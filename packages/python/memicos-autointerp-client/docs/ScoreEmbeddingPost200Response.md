# ScoreEmbeddingPost200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**score** | **float** | The score from 0 to 1 | 
**breakdown** | [**List[ScoreEmbeddingPost200ResponseBreakdownInner]**](ScoreEmbeddingPost200ResponseBreakdownInner.md) | Detailed breakdown of the embedding outputs | 

## Example

```python
from memicos_autointerp_client.models.score_embedding_post200_response import ScoreEmbeddingPost200Response

# TODO update the JSON string below
json = "{}"
# create an instance of ScoreEmbeddingPost200Response from a JSON string
score_embedding_post200_response_instance = ScoreEmbeddingPost200Response.from_json(json)
# print the JSON string representation of the object
print(ScoreEmbeddingPost200Response.to_json())

# convert the object into a dict
score_embedding_post200_response_dict = score_embedding_post200_response_instance.to_dict()
# create an instance of ScoreEmbeddingPost200Response from a dict
score_embedding_post200_response_from_dict = ScoreEmbeddingPost200Response.from_dict(score_embedding_post200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


