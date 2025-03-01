# ScoreFuzzDetectionPost200ResponseBreakdownInner

The \"scorer.__call__\" result's score breakdown. Type copied from https://github.com/EleutherAI/sae-auto-interp/blob/3659ff3bfefbe2628d37484e5bcc0087a5b10a27/sae_auto_interp/scorers/classifier/sample.py#L19

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**str_tokens** | **List[str]** | List of strings | [optional] 
**activations** | **List[float]** | List of floats | [optional] 
**distance** | **int** | Quantile or neighbor distance | [optional] 
**ground_truth** | **bool** | Whether the example is activating or not | [optional] 
**prediction** | **bool** | Whether the model predicted the example activating or not | [optional] [default to False]
**highlighted** | **bool** | Whether the sample is highlighted | [optional] [default to False]
**probability** | **float** | The probability of the example activating | [optional] [default to 0.0]
**correct** | **bool** | Whether the prediction is correct | [optional] [default to False]

## Example

```python
from memicos_autointerp_client.models.score_fuzz_detection_post200_response_breakdown_inner import ScoreFuzzDetectionPost200ResponseBreakdownInner

# TODO update the JSON string below
json = "{}"
# create an instance of ScoreFuzzDetectionPost200ResponseBreakdownInner from a JSON string
score_fuzz_detection_post200_response_breakdown_inner_instance = ScoreFuzzDetectionPost200ResponseBreakdownInner.from_json(json)
# print the JSON string representation of the object
print(ScoreFuzzDetectionPost200ResponseBreakdownInner.to_json())

# convert the object into a dict
score_fuzz_detection_post200_response_breakdown_inner_dict = score_fuzz_detection_post200_response_breakdown_inner_instance.to_dict()
# create an instance of ScoreFuzzDetectionPost200ResponseBreakdownInner from a dict
score_fuzz_detection_post200_response_breakdown_inner_from_dict = ScoreFuzzDetectionPost200ResponseBreakdownInner.from_dict(score_fuzz_detection_post200_response_breakdown_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


