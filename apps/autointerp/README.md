`python -m venv .venv`

`source .venv/bin/activate`

`pip install -e .`

embedding model only supported on CUDA (won't work on mac)

`uvicorn server:app --host 0.0.0.0 --port 5003 --workers 1`

for development
`uvicorn server:app --host 0.0.0.0 --port 5003 --workers 1 --reload`

developing autointerp client
`pip install -e ../../packages/python/memicos-autointerp-client`
