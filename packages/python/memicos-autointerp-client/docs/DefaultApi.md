# memicos_autointerp_client.DefaultApi

All URIs are relative to */v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**explain_default_post**](DefaultApi.md#explain_default_post) | **POST** /explain/default | Generate an explanation for neuron/feature behavior using the default explainer
[**score_embedding_post**](DefaultApi.md#score_embedding_post) | **POST** /score/embedding | Score an explanation using embedding similarity, using the dunzhang/stella_en_400M_v5 model.
[**score_fuzz_detection_post**](DefaultApi.md#score_fuzz_detection_post) | **POST** /score/fuzz-detection | Score an explanation using fuzzing or detection methods


# **explain_default_post**
> ExplainDefaultPost200Response explain_default_post(explain_default_post_request)

Generate an explanation for neuron/feature behavior using the default explainer

### Example

* Api Key Authentication (SimpleSecretAuth):

```python
import memicos_autointerp_client
from memicos_autointerp_client.models.explain_default_post200_response import ExplainDefaultPost200Response
from memicos_autointerp_client.models.explain_default_post_request import ExplainDefaultPostRequest
from memicos_autointerp_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /v1
# See configuration.py for a list of all supported configuration parameters.
configuration = memicos_autointerp_client.Configuration(
    host = "/v1"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: SimpleSecretAuth
configuration.api_key['SimpleSecretAuth'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['SimpleSecretAuth'] = 'Bearer'

# Enter a context with an instance of the API client
with memicos_autointerp_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = memicos_autointerp_client.DefaultApi(api_client)
    explain_default_post_request = memicos_autointerp_client.ExplainDefaultPostRequest() # ExplainDefaultPostRequest | 

    try:
        # Generate an explanation for neuron/feature behavior using the default explainer
        api_response = api_instance.explain_default_post(explain_default_post_request)
        print("The response of DefaultApi->explain_default_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->explain_default_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **explain_default_post_request** | [**ExplainDefaultPostRequest**](ExplainDefaultPostRequest.md)|  | 

### Return type

[**ExplainDefaultPost200Response**](ExplainDefaultPost200Response.md)

### Authorization

[SimpleSecretAuth](../README.md#SimpleSecretAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful explanation generation |  -  |
**400** | Invalid request |  -  |
**401** | X-SECRET-KEY header is missing or invalid |  * WWW_Authenticate -  <br>  |
**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **score_embedding_post**
> ScoreEmbeddingPost200Response score_embedding_post(score_embedding_post_request)

Score an explanation using embedding similarity, using the dunzhang/stella_en_400M_v5 model.

### Example

* Api Key Authentication (SimpleSecretAuth):

```python
import memicos_autointerp_client
from memicos_autointerp_client.models.score_embedding_post200_response import ScoreEmbeddingPost200Response
from memicos_autointerp_client.models.score_embedding_post_request import ScoreEmbeddingPostRequest
from memicos_autointerp_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /v1
# See configuration.py for a list of all supported configuration parameters.
configuration = memicos_autointerp_client.Configuration(
    host = "/v1"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: SimpleSecretAuth
configuration.api_key['SimpleSecretAuth'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['SimpleSecretAuth'] = 'Bearer'

# Enter a context with an instance of the API client
with memicos_autointerp_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = memicos_autointerp_client.DefaultApi(api_client)
    score_embedding_post_request = memicos_autointerp_client.ScoreEmbeddingPostRequest() # ScoreEmbeddingPostRequest | 

    try:
        # Score an explanation using embedding similarity, using the dunzhang/stella_en_400M_v5 model.
        api_response = api_instance.score_embedding_post(score_embedding_post_request)
        print("The response of DefaultApi->score_embedding_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->score_embedding_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **score_embedding_post_request** | [**ScoreEmbeddingPostRequest**](ScoreEmbeddingPostRequest.md)|  | 

### Return type

[**ScoreEmbeddingPost200Response**](ScoreEmbeddingPost200Response.md)

### Authorization

[SimpleSecretAuth](../README.md#SimpleSecretAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful scoring |  -  |
**400** | Invalid request or authentication failure |  -  |
**401** | X-SECRET-KEY header is missing or invalid |  * WWW_Authenticate -  <br>  |
**500** | Server error or model not initialized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **score_fuzz_detection_post**
> ScoreFuzzDetectionPost200Response score_fuzz_detection_post(score_fuzz_detection_post_request)

Score an explanation using fuzzing or detection methods

### Example

* Api Key Authentication (SimpleSecretAuth):

```python
import memicos_autointerp_client
from memicos_autointerp_client.models.score_fuzz_detection_post200_response import ScoreFuzzDetectionPost200Response
from memicos_autointerp_client.models.score_fuzz_detection_post_request import ScoreFuzzDetectionPostRequest
from memicos_autointerp_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to /v1
# See configuration.py for a list of all supported configuration parameters.
configuration = memicos_autointerp_client.Configuration(
    host = "/v1"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure API key authorization: SimpleSecretAuth
configuration.api_key['SimpleSecretAuth'] = os.environ["API_KEY"]

# Uncomment below to setup prefix (e.g. Bearer) for API key, if needed
# configuration.api_key_prefix['SimpleSecretAuth'] = 'Bearer'

# Enter a context with an instance of the API client
with memicos_autointerp_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = memicos_autointerp_client.DefaultApi(api_client)
    score_fuzz_detection_post_request = memicos_autointerp_client.ScoreFuzzDetectionPostRequest() # ScoreFuzzDetectionPostRequest | 

    try:
        # Score an explanation using fuzzing or detection methods
        api_response = api_instance.score_fuzz_detection_post(score_fuzz_detection_post_request)
        print("The response of DefaultApi->score_fuzz_detection_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->score_fuzz_detection_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **score_fuzz_detection_post_request** | [**ScoreFuzzDetectionPostRequest**](ScoreFuzzDetectionPostRequest.md)|  | 

### Return type

[**ScoreFuzzDetectionPost200Response**](ScoreFuzzDetectionPost200Response.md)

### Authorization

[SimpleSecretAuth](../README.md#SimpleSecretAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful scoring |  -  |
**400** | Invalid request or authentication failure |  -  |
**401** | X-SECRET-KEY header is missing or invalid |  * WWW_Authenticate -  <br>  |
**500** | Server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

