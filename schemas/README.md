#### memicos 🧠🔍 openapi schemas

- [what this is](#what-this-is)
- [install openapi generator cli](#install-openapi-generator-cli)
- [making changes to the inference server](#making-changes-to-the-inference-server)
- [making changes to the autointerp server](#making-changes-to-the-autointerp-server)

## what this is

memicos's [services](../README.md#architecture) has a webapp (nextjs) in **typescript** and separate **python** servers for [inference](../apps/inference/README.md) and [autointerp](../apps/autointerp/README.md). to ensure that our servers communicate with each other in a predictable and typesafe manner, the requests to the inference and autointerp servers are defined by [openapi schemas](https://www.openapis.org).

having openapi schemas allows us to use [openapi client generators](https://openapi-generator.tech/docs/installation/) to automatically create clients that make and parse requests.

this readme documents how to update the schemas and re-generate clients when we want to make additions or changes to the api.

> ⚠️ **warning:** this is _draft_ documentation. we need to provide better examples of the entire development workflow: [TODO #3](https://github.com/hijohnnylin/memicos/issues/3) - need better instructions on how to update openapi spec/client (or simplify by making it a `make` command)

## install openapi generator cli

install the [openapi generator cli](https://openapi-generator.tech/docs/installation/) here.

## making changes to the inference server

here's how to create or update an endpoint in the inference server.

1. spec out your new addition(s) or change(s) under [openapi/inference-server.yaml](openapi/inference-server.yaml) and the [openapi/inference](openapi/inference/) subdirectory. for example, you might create a new endpoint under [openapi/inference/paths](openapi/inference/paths/), then add that new endpoint path to the `inference-server.yaml` file
2. delete the old inference clients
   ```
   cd schemas
   rm -rf ../packages/python/memicos-inference-client
   rm -rf ../packages/typescript/memicos-inference-client
   ```
3. generate a new _python_ inference client, replacing `BUMPED_SEMANTIC_VERSION`
   ```
    openapi-generator-cli generate \
    -i openapi/inference-server.yaml \
    -g python \
    -o ../packages/python/memicos-inference-client \
    --package-name memicos_inference_client \
    --additional-properties=packageVersion=[BUMPED_SEMANTIC_VERSION]
   ```
   this will generate the updated python client under `packages/python/memicos-inference-client`
4. generate a new _typescript_ inference client, ensuring that you replace `BUMPED_SEMANTIC_VERSION`
   ```
   openapi-generator-cli generate -i openapi/inference-server.yaml -g typescript-fetch -o ../packages/typescript/memicos-inference-client -p npmName=memicos-inference-client
   ```
   this will generate the updated python client under `packages/python/memicos-inference-client`
5. make your code changes to the inference server
   1. point your local inference server code to use the updated local python client
      ```
      poetry remove memicos-inference-client && poetry add ../../packages/python-inference-client/
      ```
      > ℹ️ **why import the _client_ into the server?** even though we aren't using the client calls (make requests, parse response, etc), we want to force the server to use the same types to ensure compatibility. it reduces the amount of potential errors as well! a simple example of this in the [utils/sae-vector endpoint](../apps/inference/memicos_inference/endpoints/util/sae_vector.py): notice how we accept a `UtilSaeVectorPostRequest` and return a `UtilSaeVectorPost200Response`.
   2. update the code under [apps/inference/memicos_inference](../apps/inference/memicos_inference/) for your changes. for example, if you were creating a new endpoint of `POST [host]/v1/util/action`, you would create a new `action.py` file under [apps/inference/memicos_inference/util](apps/inference/memicos_inference/util).
6. make your code changes to the webapp server (if necessary)

   1. ensure typescript is installed globally
      ```
      npm install -g typescript
      ```
   2. point your local webapp code to use the updated local typescript client

      ```
      cd ../apps/webapp

      # first link the client globally
      npm link ../../packages/typescript/memicos-inference-client

      # then point your webapp to use the globally linked local client instead of the production one
      npm link memicos-inference-client
      ```

   3. update your webapp code, starting by changing [../apps/webapp/lib/utils/inference.ts](../apps/webapp/lib/utils/inference.ts) to use the new/updated endpoints in the `memicos-inference-client`

7. bring up the webapp and inference server locally (see the main [readme](../README.md) for running dev instances), and test the calls between the two servers.
8. once you're satisfied with the results, commit all your changes.
9. [highly encouraged] make a PR to the official [memicos repo](https://github.com/hijohnnylin/memicos) and we'll review it ASAP!

## making changes to the autointerp server

the instructions are the _mostly_ same as [making changes to the inference server](#making-changes-to-the-inference-server), except: pip instead of poetry, and names are changed from `memicos-inference` to `memicos-autointerp`, etc.

1. spec out your new addition(s) or change(s) under [openapi/inference-server.yaml](openapi/autointerp-server.yaml) and the [openapi/autointerp](openapi/autointerp/) subdirectory.
2. delete the old autointerp clients
   ```
   cd schemas
   rm -rf ../packages/python/memicos-autointerp-client
   rm -rf ../packages/typescript/memicos-autointerp-client
   ```
3. generate a new _python_ autointerp client, replacing `BUMPED_SEMANTIC_VERSION`
   ```
    openapi-generator-cli generate \
    -i openapi/autointerp-server.yaml \
    -g python \
    -o ../packages/python/memicos-autointerp-client \
    --package-name memicos_autointerp_client \
    --additional-properties=packageVersion=[BUMPED_SEMANTIC_VERSION]
   ```
   this will generate the updated python client under `packages/python/memicos-autointerp-client`
4. generate a new _typescript_ autointerp client
   ```
   openapi-generator-cli generate -i openapi/autointerp-server.yaml -g typescript-fetch -o ../packages/typescript/memicos-autointerp-client -p npmName=memicos-autointerp-client
   ```
   this will generate the updated typescript client under `packages/typescript/memicos-autointerp-client`
5. make your code changes to the autointerp server
   1. point your local autointerp server code to use the updated local python client
      ```
      cd ../apps/autointerp
      pip install -e ../../packages/python/memicos-autointerp-client
      ```
   2. update the code under [apps/autointerp/memicos_autointerp](../apps/autointerp/memicos_autointerp/) for your changes.
6. make your code changes to the webapp server (if necessary)

   1. ensure typescript is installed globally
      ```
      npm install -g typescript
      ```
   2. point your local webapp code to use the updated local typescript client

      ```
      cd ../apps/webapp

      # first link the client globally
      npm link ../../packages/typescript/memicos-autointerp-client

      # then point your webapp to use the globally linked local client instead of the production one
      npm link memicos-autointerp-client
      ```

   3. update your webapp code, starting by changing [../apps/webapp/lib/utils/autointerp.ts](../apps/webapp/lib/utils/autointerp.ts) to use the new/updated endpoints in the `memicos-autointerp-client`

7. bring up the webapp and autointerp server locally (see the main [readme](../README.md) for running dev instances), and test the calls between the two servers.
8. once you're satisfied with the results, commit all your changes.
9. [highly encouraged] make a PR to the official [memicos repo](https://github.com/hijohnnylin/memicos) and we'll review it ASAP!
