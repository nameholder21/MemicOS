# ScoreEmbeddingPostRequest

Request model for scoring explanations using embedding similarity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activations** | [**List[NPActivation]**](NPActivation.md) | List of activation records to analyze | 
**explanation** | **str** | The explanation to evaluate | 

## Example

```python
from memicos_autointerp_client.models.score_embedding_post_request import ScoreEmbeddingPostRequest

# TODO update the JSON string below
json = "{}"
# create an instance of ScoreEmbeddingPostRequest from a JSON string
score_embedding_post_request_instance = ScoreEmbeddingPostRequest.from_json(json)
# print the JSON string representation of the object
print(ScoreEmbeddingPostRequest.to_json())

# convert the object into a dict
score_embedding_post_request_dict = score_embedding_post_request_instance.to_dict()
# create an instance of ScoreEmbeddingPostRequest from a dict
score_embedding_post_request_from_dict = ScoreEmbeddingPostRequest.from_dict(score_embedding_post_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


