# MemicOS

MemicOS is a self-hosted AI platform built to give developers and researchers full control over the internal mechanisms of large language models. It is designed for interpreting, steering, and extending model behavior through interactive tools, custom infrastructure, and fully local workflows. With support for modular dashboards, activation-based feature exploration, and personalized inference pipelines, MemicOS functions as an open-ended interface for deep model experimentation and control.

> Rather than treating AI models as black boxes, MemicOS opens them up for inspection, customization, and integration into more transparent systems.

---

## 🧠 Core Features

- Inspect neuron-level activations and trace model behavior across layers  
- Run experiments to steer and adjust model output using feature manipulations  
- Search for activations or patterns using natural language descriptors  
- Import custom datasets, source activation environments (SAEs), or model traces  
- Build and test your own dashboards for interpretability or monitoring  
- Host a fully offline, self-contained inference and database stack  
- Integrate with other tooling including agent frameworks or external APIs  
- Modify every part of the pipeline including frontends, APIs, and inference logic

MemicOS is fully open and flexible. Use it for research, build apps on top of it, or experiment with the raw internals of your models.

---

## 🚀 Demo Mode: Get Started Quickly

To try MemicOS immediately, you can spin up a demo instance that connects your local interface to a shared cloud-hosted backend containing prebuilt models and sample SAEs.

### Requirements

- Docker (Desktop or Engine)  
- GNU Make installed and accessible via terminal

### Launch the Demo

```
make init-env  
make webapp-demo-build  
make webapp-demo-run  
```

Once running, open the following in your browser:

```
<http://localhost:3000>  
```

This connects you to the demo environment. You can browse preloaded data and use the tools, but changes will not persist since you're using a public, read-only backend.

---

## 🧬 Included Demo Models

| Model                  | Activation Source                 | Description                              |
|------------------------|------------------------------------|------------------------------------------|
| gpt2-small             | res-jb                             | Basic, lightweight setup for testing     |
| gemma-2-2b / -it       | gemmascope-res-16k                 | Interpretability-focused setup           |
| deepseek-llama-8b      | llamascope-slimpj-res-32k (l15)    | Reasoning-tuned configuration from OpenMOSS |

---

## ⚙️ Running Fully Local MemicOS

To work beyond the limitations of demo mode, including importing your own SAEs or modifying inference logic, switch to a local deployment.

### Build and Start Locally

```
make webapp-localhost-build  
make webapp-localhost-run  
```

This will host the full web application on:

```
<http://localhost:3000>  
```

At this point, your system uses a private database that you can write to. However, it will be empty initially until populated with data and models.

---

## 📥 Populating Your Local Environment

Once the local instance is active, you’ll need to bring in real content. MemicOS supports custom source uploads, SAE imports, activation traces, and more.

To begin:

1. Access the admin panel via your browser  
2. Upload one or more SAE files (SAELens-compatible format)  
3. Optionally upload explanation files or activation datasets  
4. Restart or refresh your instance to detect new content

Conversion scripts and automation tools for bulk import are located in the `utils/` directory.

---

## 🤖 Setting Up a Local Inference Pipeline

If you want to perform tasks like steering or activation-based searching, you need a local inference server connected to your running instance.

### Install Required Dependencies

```
make inference-localhost-install  
```

### Build the Inference Container

With GPU support:

```
make inference-localhost-build-gpu USE_LOCAL_HF_CACHE=1  
```

Without GPU:

```
make inference-localhost-build USE_LOCAL_HF_CACHE=1  
```

### Launch Inference

Specify the model and activation source you're using via the `MODEL_SOURCESET` parameter:

```
make inference-localhost-dev MODEL_SOURCESET=gpt2-small.res-jb USE_LOCAL_HF_CACHE=1  
```

The server will launch at:

```
<http://localhost:5002>  
```

You can verify it's working once you see `Initialized: True` in the logs.

---

## 🧪 Developer Mode: Building MemicOS Features

To work on the UI, APIs, or core logic, use the development build with hot reload.

```
make install-nodejs  
make webapp-localhost-install  
make webapp-localhost-dev  
```

Navigate to `http://localhost:3000` to start editing and testing.

Changes inside the `apps/webapp` directory will auto-reload in your browser. You only need to re-run the install step if you add or update dependencies.

---

## 🛠 Custom Inference Configuration

To add new models or sources, create `.env.inference.*` files describing each setup.

Parameters typically include:

- The HF model ID (or path to local weights)  
- SAE set identifiers (matching your source naming)  
- Optional cache paths or overrides  

List available setups using:

```
make inference-list-configs  
```

This will print the available inference configurations for fast loading.

---

## 📊 Optional: Generating Dashboards

If you want to create dashboard data for a new model or SAE:

- Clone SAEDashboard  
- Link it to your custom SAELens fork  
- Run the generator using `poetry run MemicOS-runner`  
- Use the provided conversion script to prep for MemicOS  

Output can be stored locally or uploaded to a public cloud bucket depending on your setup.

---

## 🔧 Extending MemicOS

MemicOS is designed to be extensible and hackable. You can:

- Add support for other model formats or backends  
- Customize how activations are extracted or processed  
- Build dashboards from scratch using external JS libraries  
- Connect with other systems like LangChain, LlamaIndex, or vector databases  
- Run in containerized microservices or scale vertically on a single machine

Most service configurations can be found in the `docker-compose.yaml` file. SDKs and utilities live under the `packages/` and `utils/` directories.

---

## 📚 Documentation and Tools

- `schemas/openapi/inference-server.yaml` - API definitions  
- `packages/memicos-inference-client` - Python wrapper for inference requests  
- `utils/memicos-utils` - Data conversion helpers  
- `docker-compose.yaml` - Full environment orchestration
