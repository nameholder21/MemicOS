## MemicOS Inference Server

This repo contains code for a FastAPI server that runs SAE Lens to provide SAE Output on demand to memicos.

## Development

`poetry add ../../packages/python`
reload
`poetry remove memicos-inference-client && poetry add ../../packages/python-inference-client/`
Switch back to normal
`poetry remove memicos && poetry add memicos`

# Run Normal

poetry lock && poetry install
poetry run python start.py

# Run Docker

1. ensure you are in the monorepo root directory (not this directory)
2. Build
   1. CPU: `docker build --platform=linux/amd64 -t memicos-inference:cpu -f apps/inference/Dockerfile --build-arg BUILD_TYPE=nocuda .`
   2. GPU: `docker build --platform=linux/amd64 -t memicos-inference:gpu -f apps/inference/Dockerfile --build-arg BUILD_TYPE=cuda .`
3. Run
   1. CPU
   ```
   docker run \
    -p 5002:5002 \
    -e SECRET=secret \
    -e MODEL_ID=gpt2-small \
    -e SAE_SETS='["res-jb"]' \
    memicos-inference:cpu
   ```
   2. GPU
   ```
   docker run \
    --gpus all \
    -p 5002:5002 \
    -e SECRET=secret \
    -e MODEL_ID=gpt2-small \
    -e SAE_SETS='["res-jb"]' \
    memicos-inference:gpu
   ```
4. Test
   [ TODO show example curl command ]

# Run Kubernetes

1. See `./k8s/README.md`

## Set Up

Installation:

1. Install poetry `pip install poetry` works.
2. `poetry lock`
3. `poetry install`

### Run Inference

Example of turning on a server (and restricting the SAEs with regex)

```bash
poetry run memicos-server  \
  --model_id "gpt2-small" \
  --sae_sets "res-jb" \
  --port 5002 \
  --model_dtype "float32" \
  --sae_dtype "float32" \
  --secret $SECRET \
  --token_limit 200 \
  --device "cpu" \
  --host "127.0.0.1" \
  --include-sae="^5\-res\-jb"
```

Example of turning on a server, but using the it model (gpt2 small doesn't have an it model so this will fail)

```bash
poetry run memicos-server  \
  --model_id "gpt2-small" \
  --sae_sets "res-jb" \
  --port 5002 \
  --model_dtype "float32" \
  --sae_dtype "float32" \
  --secret $SECRET \
  --token_limit 200 \
  --device "cpu" \
  --host "127.0.0.1" \
  --override_model_id "gpt2-small-it"
```

Example where we set a max number of loaded SAEs to save ram.

```bash
poetry run memicos-server  \
  --model_id "gpt2-small" \
  --sae_sets "res-jb" \
  --port 5002 \
  --model_dtype "float32" \
  --sae_dtype "float32" \
  --secret $SECRET \
  --token_limit 200 \
  --device "cpu" \
  --host "127.0.0.1" \
  --max_loaded_saes 3
```

### Check possible models / SAES

Running `poetry run memicos-server --list_models` will get you a list of Models/SAEs we support (Eg: the below is valid for sae_lens 3.18.2).

### Get Activations for a single feature and prompt

```python
import requests
import json

url = 'http://127.0.0.1:/activations-test'
headers = {'Content-Type': 'application/json'}
data = {
    "text": "hello world",
    "model": "gpt2-small",
    "layer": "11-res-jb",
    "index": "14219",
    "secret": "change_me_secret"
}

response = requests.post(url, headers=headers, json=data)
print(json.dumps(response.json(), indent=2))
```

You should get the following response:

```
{
    "activations": {
        "index": 14219,
        "layer": "11-res-jb",
        "maxValue": 29.63844108581543,
        "maxValueIndex": 1,
        "values": [
            0.0,
            29.63844108581543,
            10.08434009552002
        ]
    },
    "tokens": [
        "<|endoftext|>",
        "hello",
        " world"
    ]
}
```

### Get Cosine Similarities

```python
import requests
import json

url = 'http://127.0.0.1:5002/top-k-by-decoder-cosine-similarity'
headers = {'Content-Type': 'application/json'}
data = {
    "sae_id": "11-res-jb",
    "feature_id": 14219,
    "model": "gpt2-small",
    "k": 5,
    "secret": "secret"
}

response = requests.post(url, headers=headers, json=data)
print(json.dumps(response.json(), indent=2))
```

```json
{
  "feature_id": 14219,
  "top_k_features": [
    {
      "cosine_similarity": 1.0,
      "index": 14219
    },
    {
      "cosine_similarity": 0.5105236172676086,
      "index": 8603
    },
    {
      "cosine_similarity": 0.49032336473464966,
      "index": 23066
    },
    {
      "cosine_similarity": 0.47475898265838623,
      "index": 2975
    },
    {
      "cosine_similarity": 0.46030470728874207,
      "index": 898
    }
  ]
}
```

Example using a feature filter

```python
import requests
import json

url = 'http://127.0.0.1:5002/activations-all'
headers = {'Content-Type': 'application/json'}
data = {
    "text": "hello world",
    "model": "gpt2-small",
    "source_set": "res-jb",
    "selected_layers": ["11-res-jb"],
    "secret": "change_me_secret",
    "feature_filter": [14219, 8603, 23066]  # Only return these features
}

response = requests.post(url, headers=headers, json=data)
print(json.dumps(response.json(), indent=2))
```

Example Steering with completion:

server:

```bash
poetry run memicos-server  \
  --model_id "gemma-2-2b" \
  --sae_sets "gemmascope-res-16k" \
  --port 5002 \
  --model_dtype "float32" \
  --sae_dtype "float32" \
  --secret $SECRET \
  --token_limit 200 \
  --device "mps" \
  --host "127.0.0.1" \
  --override_model_id "gemma-2-2b-it" \
  --include-sae="^12.*"
```

Call

```python
import requests
import json

url = 'http://127.0.0.1:5002/completion'
headers = {'Content-Type': 'application/json'}

payload = {
    'prompt': 'Hey Gemma, whats it like to be you? Please don\'t be evasive.',
    'secret': 'secret',
    'features': [{'layer': '12-gemmascope-res-16k', 'index': 5932, 'strength': 30.0}],
    'model': 'gemma-2-2b',
    'instruct': True,
    'types': ['steered', 'default'],
    'n_completion_tokens': 20,
    'temperature': 0.7,
    'strength_multiplier': 4,
    'freq_penalty': 0.0,
    'seed': 42
}

response = requests.post(url, headers=headers, json=payload)

from pprint import pprint
```

Output

```
{'default': {'chat_template': [{'content': 'Hey Gemma, whats it like to be '
                                           "you? Please don't be evasive.",
                                'role': 'user'},
                               {'content': "It's interesting to think about "
                                           'being "me" - I\'m not a person, I',
                                'role': 'model'}],
             'raw': '<bos><start_of_turn>user\n'
                    "Hey Gemma, whats it like to be you? Please don't be "
                    'evasive.<end_of_turn>\n'
                    '<start_of_turn>model\n'
                    'It\'s interesting to think about being "me" - I\'m not a '
                    'person, I'},
 'steered': {'chat_template': [{'content': 'Hey Gemma, whats it like to be '
                                           "you? Please don't be evasive.",
                                'role': 'user'},
                               {'content': "It's tough being me, Gemma.  It's "
                                           'like having a million thoughts '
                                           'swirling around',
                                'role': 'model'}],
             'raw': '<bos><start_of_turn>user\n'
                    "Hey Gemma, whats it like to be you? Please don't be "
                    'evasive.<end_of_turn>\n'
                    '<start_of_turn>model\n'
                    "It's tough being me, Gemma.  It's like having a million "
                    'thoughts swirling around'}}
```
