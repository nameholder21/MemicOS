# UtilSaeTopkByDecoderCossimPostRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**feature** | [**NPFeature**](NPFeature.md) |  | [optional] 
**vector** | **List[float]** | Custom vector to find the top features by cossim for. | [optional] 
**model** | **str** | Model to compare the vector or feature against. | 
**source** | **str** | Source/SAE ID to compare the vector or feature against. | 
**num_results** | **int** |  | 

## Example

```python
from memicos_inference_client.models.util_sae_topk_by_decoder_cossim_post_request import UtilSaeTopkByDecoderCossimPostRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UtilSaeTopkByDecoderCossimPostRequest from a JSON string
util_sae_topk_by_decoder_cossim_post_request_instance = UtilSaeTopkByDecoderCossimPostRequest.from_json(json)
# print the JSON string representation of the object
print(UtilSaeTopkByDecoderCossimPostRequest.to_json())

# convert the object into a dict
util_sae_topk_by_decoder_cossim_post_request_dict = util_sae_topk_by_decoder_cossim_post_request_instance.to_dict()
# create an instance of UtilSaeTopkByDecoderCossimPostRequest from a dict
util_sae_topk_by_decoder_cossim_post_request_from_dict = UtilSaeTopkByDecoderCossimPostRequest.from_dict(util_sae_topk_by_decoder_cossim_post_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


