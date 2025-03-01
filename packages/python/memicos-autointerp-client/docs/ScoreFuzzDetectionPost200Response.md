# ScoreFuzzDetectionPost200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**score** | **float** | The score from 0 to 1 | 
**breakdown** | [**List[ScoreFuzzDetectionPost200ResponseBreakdownInner]**](ScoreFuzzDetectionPost200ResponseBreakdownInner.md) |  | 

## Example

```python
from memicos_autointerp_client.models.score_fuzz_detection_post200_response import ScoreFuzzDetectionPost200Response

# TODO update the JSON string below
json = "{}"
# create an instance of ScoreFuzzDetectionPost200Response from a JSON string
score_fuzz_detection_post200_response_instance = ScoreFuzzDetectionPost200Response.from_json(json)
# print the JSON string representation of the object
print(ScoreFuzzDetectionPost200Response.to_json())

# convert the object into a dict
score_fuzz_detection_post200_response_dict = score_fuzz_detection_post200_response_instance.to_dict()
# create an instance of ScoreFuzzDetectionPost200Response from a dict
score_fuzz_detection_post200_response_from_dict = ScoreFuzzDetectionPost200Response.from_dict(score_fuzz_detection_post200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


