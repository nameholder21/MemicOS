TURN THESE INTO PACKAGE.JSON scripts!

`rm -rf ../packages/python/memicos-autointerp-client && openapi-generator-cli generate -i openapi/autointerp-server.yaml -g python -o ../packages/python/memicos-autointerp-client --package-name memicos_autointerp_client`

`rm -rf ../packages/typescript/memicos-autointerp-client && openapi-generator-cli generate -i openapi/autointerp-server.yaml -g typescript-fetch -o ../packages/typescript/memicos-autointerp-client -p npmName=memicos-autointerp-client`
from packages/typescript/memicos/autointerp-client: `npm link`
from webapp: `npm link ../../packages/typescript/memicos-autointerp-client`

inference server development
after updating schema, run this to update the python inference client
FROM SCHEMAS DIR
`rm -rf ../packages/python/memicos-inference-client && openapi-generator-cli generate -i openapi/inference-server.yaml -g python -o ../packages/python/memicos-inference-client --package-name memicos_inference_client --additional-properties=packageVersion=1.1.0`
then go to /apps/inference and run this to pick up the changes
`poetry remove memicos-inference-client && poetry add ../../packages/python/memicos-inference-client`
then publish the inf-client:
go to packages/python/memicos-inference-client
`do the publish to pypi`
switch back inf server to prod dependency
go to apps/inference and run this
`poetry remove memicos-inference-client && poetry install memicos-inference-client`
publish the inference server?
for typescrsipt:

`rm -rf ../packages/typescript/memicos-inference-client && openapi-generator-cli generate -i openapi/inference-server.yaml -g typescript-fetch -o ../packages/typescript/memicos-inference-client -p npmName=memicos-inference-client`
from packages/typescript/memicos/inference-client: `npm link`
webapp
`npm link ../../packages/typescript/memicos-inference-client`

for autointerp dev
`pip install -e ../../packages/python/memicos-autointerp-client`

distributing python clients
`python -m build`
`python -m twine upload dist/*`

distributing npm clients
`npm publish`
