# ScoreFuzzDetectionPostRequest

Request model for scoring explanations using fuzzing or detection methods

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**activations** | [**List[NPActivation]**](NPActivation.md) | List of activation records to analyze | 
**explanation** | **str** | The explanation to evaluate | 
**openrouter_key** | **str** | API key for OpenRouter service | 
**model** | **str** | Model identifier to use for scoring | 
**type** | [**NPScoreFuzzDetectionType**](NPScoreFuzzDetectionType.md) |  | 

## Example

```python
from memicos_autointerp_client.models.score_fuzz_detection_post_request import ScoreFuzzDetectionPostRequest

# TODO update the JSON string below
json = "{}"
# create an instance of ScoreFuzzDetectionPostRequest from a JSON string
score_fuzz_detection_post_request_instance = ScoreFuzzDetectionPostRequest.from_json(json)
# print the JSON string representation of the object
print(ScoreFuzzDetectionPostRequest.to_json())

# convert the object into a dict
score_fuzz_detection_post_request_dict = score_fuzz_detection_post_request_instance.to_dict()
# create an instance of ScoreFuzzDetectionPostRequest from a dict
score_fuzz_detection_post_request_from_dict = ScoreFuzzDetectionPostRequest.from_dict(score_fuzz_detection_post_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


