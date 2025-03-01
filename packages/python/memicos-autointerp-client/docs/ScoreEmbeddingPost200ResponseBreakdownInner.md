# ScoreEmbeddingPost200ResponseBreakdownInner

The \"scorer.__call__\" result's score breakdown. With exception of fixing similarity to change to number instead of array of number, type is copied from https://github.com/EleutherAI/sae-auto-interp/blob/3659ff3bfefbe2628d37484e5bcc0087a5b10a27/sae_auto_interp/scorers/embedding/embedding.py#L20

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**text** | **str** | The text that was used to evaluate the similarity | 
**distance** | **int** | Quantile or neighbor distance | 
**similarity** | **float** | What is the similarity of the example to the explanation | [default to 0]

## Example

```python
from memicos_autointerp_client.models.score_embedding_post200_response_breakdown_inner import ScoreEmbeddingPost200ResponseBreakdownInner

# TODO update the JSON string below
json = "{}"
# create an instance of ScoreEmbeddingPost200ResponseBreakdownInner from a JSON string
score_embedding_post200_response_breakdown_inner_instance = ScoreEmbeddingPost200ResponseBreakdownInner.from_json(json)
# print the JSON string representation of the object
print(ScoreEmbeddingPost200ResponseBreakdownInner.to_json())

# convert the object into a dict
score_embedding_post200_response_breakdown_inner_dict = score_embedding_post200_response_breakdown_inner_instance.to_dict()
# create an instance of ScoreEmbeddingPost200ResponseBreakdownInner from a dict
score_embedding_post200_response_breakdown_inner_from_dict = ScoreEmbeddingPost200ResponseBreakdownInner.from_dict(score_embedding_post200_response_breakdown_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


