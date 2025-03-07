![memicos-splash](https://github.com/user-attachments/assets/9bcea0bf-4fa9-401d-bb7a-d031a4d12636)

#### memicos 🧠🔍

this is the monorepo for [memicos.org](memicos.org), the open source interpretability platform.

- [quick start - local webapp + demo environment](#quick-start---local-webapp--demo-environment)
- [setting up your local environment](#setting-up-your-local-environment)
  - ["i want to use a local database / import more memicos data"](#i-want-to-use-a-local-database--import-more-memicos-data)
  - ["i want to do webapp (frontend + api) development"](#i-want-to-do-webapp-frontend--api-development)
  - ["i want to run/develop inference locally"](#i-want-to-rundevelop-inference-locally)
  - ['i want to run/develop autointerp locally\`](#i-want-to-rundevelop-autointerp-locally)
  - ['i want to do high volume autointerp explanations'](#i-want-to-do-high-volume-autointerp-explanations)
  - ['i want to generate my own dashboards'](#i-want-to-generate-my-own-dashboards)
  - ['i want to add my dashboards/data to memicos\`](#i-want-to-add-my-dashboardsdata-to-memicos)
- [architecture](#architecture)
  - [requirements](#requirements)
  - [services](#services)
  - [services are standalone apps](#services-are-standalone-apps)
  - [openapi schema](#openapi-schema)
  - [service-specific documentation](#service-specific-documentation)
- [security](#security)
- [contributing](#contributing)
- [appendix](#appendix)
    - ['make' commands reference](#make-commands-reference)
    - [import data into your local database](#import-data-into-your-local-database)
    - [why an openai api key is needed for search explanations](#why-an-openai-api-key-is-needed-for-search-explanations)

<!-- # ultra-quick start: one-click deploy on vercel
TODO, after making repo public -->

# quick start - local webapp + demo environment

#### what this does

this sets up the webapp (frontend + api) locally, and connects to a public remote demo database and public inference servers

#### what you'll get

after following the quick start, you will be able to use memicos for some sources/SAEs we have preloaded in `gpt2-small` and `gemma-2-2b/-it`.

> ⚠️ **warning:** since you are connecting to a public, read-only demo database, you will not be able to add new data immediately. you will need to follow [subsequent steps](#i-want-to-use-my-own-database--import-more-memicos-data) to configure your own database that you can write to.

#### steps

1. install [docker desktop (UI)](https://docs.docker.com/desktop/) or [docker engine (no UI)](https://docs.docker.com/engine/), and launch it.
2. generate your local `.env`
   ```
   make init-env
   ```
3. build the webapp (this will take ~10 min the first time)
   ```
   make webapp-demo-build
   ```
4. bring up the webapp
   ```
   make webapp-demo-run
   ```
5. once everything is up, open [localhost:3000](http://localhost:3000) to load the home page.
6. your local instance is connected to the remote demo database and inference servers, with the following SAEs/sources data available:

| model                          | source/sae                       | comment                               |
| ------------------------------ | -------------------------------- | ------------------------------------- |
| `gpt2-small`                   | `res-jb`, all layers             | a small starter SAE set               |
| `gemma-2-2b` / `gemma-2-2b-it` | `gemmascope-res-16k`, all layers | the SAEs used in the Gemma Scope demo |

7. example things you can do (links work after `make webapp-demo-run`)
   i. steering - [steer gpt2-small on cats](http://localhost:3000/gpt2-small/steer?source=10-res-jb&index=16899&strength=40)
   ii. activation tests/search - [test activation for a gemma-2-2b feature](http://localhost:3000/gemma-2-2b/20-gemmascope-res-16k/502?defaulttesttext=what's%20the%20deal%20with%20airplane%20food%3F)
   iii. search by explanation, [if you configured](<(#why-an-openai-api-key-is-needed-for-search-explanations)>) an `OPENAI_API_KEY` - [search for parrots features](http://localhost:3000/search-explanations/?q=parrots)
   iv. browse dashboards - [a parrot feature](http://localhost:3000/gpt2-small/11-res-jb/23687)
   v. run the [gemma-scope demo](http://localhost:3000/gemma-scope#main)

8. now that we've set up a local webapp that's usable, this is a good time to quickly review memicos's [simple architecture](#architecture) and its [individual services](#services), so that you can get a better understanding of what you'll set up later. then, keep going to [setting up your local environment](#setting-up-your-local-environment).

> 🔥 **pro-tip:** see all the available `make` commands by running `make help`

# setting up your local environment

once you've played around with the demo, you will start running into limitations, like having a limited number of models/SAEs to use, or not being able to generate new explanations. this is because the public demo database is read-only.

ideally, you will probably eventually want to do all of the sub-sections below, so you can have everything running locally. however, you may only be interested in specific parts of memicos to start:

1. if you want to jump into developing webapp frontend or api with the demo environment, follow [webapp dev](#i-want-to-do-webapp-frontend--api-development)
2. if you want to start loading more sources/data and relying on your own local database, follow [local database](#i-want-to-use-a-local-database--import-more-memicos-data)

## "i want to use a local database / import more memicos data"

#### what this does + what you'll get

relying on the demo environment means you are limited to read-only access to a specific set of SAEs. these steps show you how to configure and connect to your own local database. you can then download sources/SAEs of your choosing.

> ⚠️ **warning:** your database will start out empty. you will need to use the admin panel to [import sources/data](#import-data-into-your-local-database) (activations, explanations, etc).

> ⚠️ **warning:** the local database environment does not have any inference servers connected, so you won't be able to do activation testing, steering, etc initially. you will need to [configure a local inference instance]().

#### steps

1. build the webapp
   ```
   make webapp-localhost-build
   ```
2. bring up the webapp
   ```
   make webapp-localhost-run
   ```
3. go to [localhost:3000](http://localhost:3000) to see your local webapp instance, which is now connected to your local database
4. see the `warnings` above for caveats, and `next steps` to finish setting up

#### next steps

1. [click here](#import-data-into-your-local-database) for how to import data into your local database (activations, explanations, etc), because your local database will be empty to start
2. [click here](#i-want-to-rundevelop-inference-locally) for how to bring up a local `inference` service for the model/source/SAE you're working with

## "i want to do webapp (frontend + api) development"

#### what this does

the webapp builds you've been doing so far are _production builds_, which are slow to build, and fast to run. since they are slow to build and don't have debug information, they are not ideal for development.

this subsection installs the development build on your local machine (not docker), then mounts the build inside your docker instance.

#### what you'll get

once you do this section, you'll be able to do local development and quickly see changes that are made, as well as see more informative debug/errors. if you are purely interested in doing frontend/api development for memicos, you don't need to set up anything else!

#### steps

1. install [nodejs](https://nodejs.org) via [node version manager](https://github.com/nvm-sh/nvm)
   ```
   make install-nodejs
   ```
2. install the webapp's dependencies
   ```
   make webapp-localhost-install
   ```
3. run the development instance
   ```
   make webapp-localhost-dev
   ```
4. go to [localhost:3000](http://localhost:3000) to see your local webapp instance

#### doing local webapp development

- **auto-reload**: when you change any files in the `apps/webapp` subdirectory, the `localhost:3000` will automatically reload
- **install commands**: you do not need to run `make install-nodejs` again, and you only need to run `make webapp-localhost-install` if dependencies change

## "i want to run/develop inference locally"

#### what this does + what you'll get

once you start using a local environment, you won't be connected to the demo environment's inference instances. this subsection shows you how to run an inference instance locally so you can do things like steering, activation testing, etc on the sources/SAEs you've downloaded.

> ⚠️ **warning:** for the local environment, we only support running one inference server at a time. this is because you are unlikely to be running multiple models simultaneously on one machine, as they are memory and compute intensive.

#### steps

1. ensure you have [installed poetry](https://python-poetry.org/docs/#installation)
2. install the inference server's dependencies
   ```
   make inference-localhost-install
   ```
3. build the image, picking the correct command based on if the machine has CUDA or not:
   ```
   # CUDA
   make inference-localhost-build-gpu
   ```
   ```
   # no CUDA
   make inference-localhost-build
   ```
4. run the inference server, using the `MODEL_SOURCESET` argument to specify the `.env.inference.[model_sourceset]` file you're loading from. for this example, we will run `gpt2-small`, and load the `res-jb` sourceset/SAE set, which is configured in the `.env.inference.gpt2-small.res-jb` file. you can see the other [pre-loaded inference configs](#pre-loaded-inference-server-configurations) or [create your own config](#making-your-own-inference-server-configurations) as well.

   ```
   # CUDA
   make inference-localhost-dev-gpu MODEL_SOURCESET=gpt2-small.res-jb

   # no CUDA
   make inference-localhost-dev MODEL_SOURCESET=gpt2-small.res-jb
   ```

5. wait for it to load (first time will take longer). when you see `Initialized: True`, the local inference server is now ready on `localhost:5002`

#### using the inference server

to interact with the inference server, you have a few options - note that this will only work for the model / selected source you have loaded:

1.  load the webapp with the [local database setup](#i-want-to-use-a-local-database--import-more-memicos-data), then using the model / selected source as you would normally do on memicos.
2.  use the pre-generated inference python client at `packages/python/memicos-inference-client` (set environment variable `INFERENCE_SERVER_SECRET` to `public`, or whatever it's set to in `.env.localhost` if you've changed it)
3.  use the openapi spec, located at `schemas/openapi/inference-server.yaml` to make calls with any client of your choice.
4.  [TODO #1](https://github.com/hijohnnylin/memicos/issues/1): Use a documentation generator to make a simple tester-server that can be activated with `make doc-inference-localhost`

#### pre-loaded inference server configurations

we've provided some pre-loaded inference configs as examples of how to load a specific model and sourceset for inference. view them by running `make inference-list-configs`:

```
$ make inference-list-configs

Available Inference Configurations (.env.inference.*)
================================================

deepseek-r1-distill-llama-8b.llamascope-slimpj-res-32k
    Model: meta-llama/Llama-3.1-8B
    Source/SAE Sets: '["llamascope-slimpj-res-32k"]'
    make inference-localhost-dev MODEL_SOURCESET=deepseek-r1-distill-llama-8b.llamascope-slimpj-res-32k

gemma-2-2b-it.gemmascope-res-16k
    Model: gemma-2-2b-it
    Source/SAE Sets: '["gemmascope-res-16k"]'
    make inference-localhost-dev MODEL_SOURCESET=gemma-2-2b-it.gemmascope-res-16k

gpt2-small.res-jb
    Model: gpt2-small
    Source/SAE Sets: '["res-jb"]'
    make inference-localhost-dev MODEL_SOURCESET=gpt2-small.res-jb
```

#### making your own inference server configurations

look at the `.env.inference.*` files for examples on how to make these inference server configurations.

the `MODEL_ID` is the model id from the [transformerlens model table](https://transformerlensorg.github.io/TransformerLens/generated/model_properties_table.html) and each of `SAE_SETS` is the text after the layer number and hyphen in a memicos source ID - for example, if you have a memicos feature at url `http://memicos.org/gpt2-small/0-res-jb/123`, the `0-res-jb` is the source ID, and the item in the `SAE_SETS` is `res-jb`. This example matches the `.env.inference.gpt2-small.res-jb` file exactly.

you can find memicos source IDs in the saelens [pretrained saes yaml file](https://github.com/jbloomAus/SAELens/blob/main/sae_lens/pretrained_saes.yaml) or by clicking into models in the [memicos datasets exports](https://memicos-datasets.s3.us-east-1.amazonaws.com/index.html?prefix=v1/) directory.

**using models not officially supported by transformerlens**
look at the `.env.inference.deepseek-r1-distill-llama-8b.llamascope-slimpj-res-32k` to see an example of how to load a model not officially supported by transformerlens. this is mostly for swapping in weights of a distilled/fine-tuned model.

**loading non-saelens sources/SAEs**

- [TODO #2](https://github.com/hijohnnylin/memicos/issues/2) document how to load SAEs/sources that are not in saelens pretrained yaml

#### doing local inference development

- **no auto-reload**: when you change any files in the `apps/inference` subdirectory, the inference server will _NOT_ automatically reload, because server reloads are slow: they reload the model and all sources/SAEs. if you want to enable autoreload, then append `AUTORELOAD=1` to the `make inference-localhost-dev` call, like so:
  ```
  make inference-localhost-dev \
  MODEL_SOURCESET=gpt2-small.res-jb \
  AUTORELOAD=1
  ```
- **openapi spec**: new endpoints or modifications to existing endpoints require updating the openapi spec at `schemas/openapi/inference-server.yaml`. then, the inference client will need to be regenerated. see the [openapi readme](schemas/README.md) for details.

## 'i want to run/develop autointerp locally`

[TODO #5](https://github.com/hijohnnylin/memicos/issues/5) instructions for setting up autointerp server locally
TODO - look at the `autointerp` service in [docker-compose.yaml](docker-compose.yaml) and the [autointerp readme](apps/autointerp/README.md)

## 'i want to do high volume autointerp explanations'

TODO - use [utils/memicos_utils/batch-autointerp.py](utils/memicos_utils/batch-autointerp.py)

## 'i want to generate my own dashboards'

TODO - use `utils/memicos_utils/generate-dashboards-as-[saelens/vectors].py`, or use the [saedashboard example](https://github.com/jbloomAus/SAEDashboard/blob/main/sae_dashboard/memicos/generating_memicos_outputs.ipynb) and then convert it using [this script](`utils/memicos_utils/convert-saedashboard-to-memicos-export.py).

## 'i want to add my dashboards/data to memicos`

TODO - use [utils/memicos_utils/export-data.py](utils/memicos_utils/export-data.py) once you've added your data to your local database.

# architecture

here's how the services/scripts connect in memicos. it's easiest to read this diagram by starting at the image of the laptop ("User").

![architecture diagram](architecture.png)

## requirements

you can run memicos on any cloud and on any modern OS. memicos is designed to avoid vendor lock-in. these instructions were written for and tested on macos 15 (sequoia), so you may need to repurpose commands for windows/ubuntu/etc. at least 16GB ram is recommended.

## services

| name       | description                                                                                                                                                  | powered by                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| webapp     | serves the memicos.org frontend and [the api](memicos.org/api-doc)                                                                                   | [next.js](https://nextjs.org) / react / tailwind |
| database   | stores features, activations, explanations, users, lists, etc                                                                                                | postgres                                         |
| inference  | [support server] steering, activation testing, search via inference, topk, etc. a separate instance is required for each model you want to run inference on. | python / torch                                   |
| autointerp | [support server] auto-interp explanations and scoring, using eleutherAI's [delphi](https://github.com/EleutherAI/delphi) (formerly `sae-auto-interp`)        | python                                           |

## services are standalone apps

by design, each service can be run independently as a standalone app. this is to enable extensibility and forkability.

for example, if you like the memicos webapp frontend but want to use a different API for inference, you can do that! just ensure your alternative inference server supports the `schema/openapi/inference-server.yaml` spec, and/or that you modify the memicos calls to inference under `apps/webapp/lib/utils`.

## openapi schema

for services to communicate with each other in a typed and consistent way, we use openapi schemas. there are some exceptions - for example, streaming is not offically supported by the openapi spec. however, even in that case, we still try our best to define a schema and use it.
openapi schemas are located under `/schemas`. we use openapi generators to generate clients in both typescript and python.

## service-specific documentation

there are draft `README`s for each specific app/service under `apps/[service]`, but they are heavily WIP. you can also check out the `Dockerfile` under the same directory to build your own images.

# security

please report vulnerabilities to [johnny@memicos.org](mailto:johnny@memicos.org).

we don't currently have an official bounty program, but we'll try our best to give compensation based on the severity of the vulnerability - though it's likely we will not able able to offer awards for any low-severity vulnerabilities.

# contributing

TODO - open for contributions / requests in github issues

- feature requests can also be added under [github discussions](https://github.com/hijohnnylin/memicos/discussions) which supports upvoting/etc
- any skill set/level are welcome to contribute - you can also use ai agents to assist, we've also added some cursorrules files, though not extensive

# appendix

### 'make' commands reference

you can view all available `make` commands and brief descriptions of them by running `make help`

### import data into your local database

if you set up your own database, it will start out empty - no features, explanations, activations, etc. to load this data, there's a built-in `admin panel` where you can download this data for SAEs (or "sources") of your choosing.

> ⚠️ **warning:** the admin panel is finicky and does not currently support resuming imports. if an import is interrupted, you must manually click `re-sync`. the admin panel currently does not check if your download is complete or missing parts - it is up to you to check if the data is complete, and if not, to click `re-sync` to re-download the entire dataset.

> ℹ️ **recommendation:** when importing data, start with just one source (like `gpt2-small`@`10-res-jb`) instead of downloading everything at once. This makes it easier to verify the data imported correctly and lets you start using memicos faster.

the instructions below demonstrate how to download the `gpt2-small`@`10-res-jb` SAE data.

1. navigate to [localhost:3000/admin](http://localhost:3000/admin).
2. scroll down to `gpt2-small`, and expand `res-jb` with the `▶`.
3. click `Download` next to `10-res-jb`.
4. wait patiently - this can be a _LOT_ of data, and depending on your connection/cpu speed it can take up to 30 minutes or an hour.
5. once it's done, click `Browse` or use the navbar to try it out: `Jump To`/`Search`/`Steer`.
6. repeat for other SAE/source data you wish to download.

### why an openai api key is needed for search explanations

in the webapp, the `search explanations` feature requires you to set an `OPENAI_API_KEY`. otherwise you will get no search results.

this is because the `search explanations` functionality searches for features by semantic similarity. if you search `cat`, it will also return `feline`, `tabby`, `animal`, etc. to do this, it needs to calculate the embedding for your input `cat`. we use openai's embedding api (specifically, `text-embedding-3-large` with `dimension: 256`) to calculate the embeddings.
