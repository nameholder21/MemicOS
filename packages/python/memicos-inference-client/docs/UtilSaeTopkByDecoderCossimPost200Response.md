# UtilSaeTopkByDecoderCossimPost200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**feature** | [**NPFeature**](NPFeature.md) |  | [optional] 
**topk_decoder_cossim_features** | [**List[UtilSaeTopkByDecoderCossimPost200ResponseTopkDecoderCossimFeaturesInner]**](UtilSaeTopkByDecoderCossimPost200ResponseTopkDecoderCossimFeaturesInner.md) |  | [optional] 

## Example

```python
from memicos_inference_client.models.util_sae_topk_by_decoder_cossim_post200_response import UtilSaeTopkByDecoderCossimPost200Response

# TODO update the JSON string below
json = "{}"
# create an instance of UtilSaeTopkByDecoderCossimPost200Response from a JSON string
util_sae_topk_by_decoder_cossim_post200_response_instance = UtilSaeTopkByDecoderCossimPost200Response.from_json(json)
# print the JSON string representation of the object
print(UtilSaeTopkByDecoderCossimPost200Response.to_json())

# convert the object into a dict
util_sae_topk_by_decoder_cossim_post200_response_dict = util_sae_topk_by_decoder_cossim_post200_response_instance.to_dict()
# create an instance of UtilSaeTopkByDecoderCossimPost200Response from a dict
util_sae_topk_by_decoder_cossim_post200_response_from_dict = UtilSaeTopkByDecoderCossimPost200Response.from_dict(util_sae_topk_by_decoder_cossim_post200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


