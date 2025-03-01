# MemicOS - Doc1

Please do not share publicly yet, since this includes both the frontend and backend, and may contain keys/secrets.

MemicOS's stack is NextJS 14 + Postgres + Python servers for inference, with some optional AWS bits for email/notifications. The production [memicos.org](memicos.org) runs on [Vercel](vercel.com), but it can be run on your local machine, GCP, AWS, etc.

## Getting Started

After setting this up, you will have MemicOS running on your local machine, connecting to your own database in either Google Cloud or Neon. After setup, you will be able to generate, upload, and browse features.

### Setting Up a Local Environment

Tested with MacOS Sonoma with at least 16GB of RAM, but could work on other platforms. The instructions will create a MemicOS frontend/API instance at `localhost:3000` that connects to a remote database either in Neon or GCP.

#### NodeJS 22 + Yarn v1

```
# ensure you're using bash
chsh -s /bin/bash

# installs NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# open a NEW Terminal tab to load the correct paths

# installs node 22. if you get an error, rerun step 1 and follow the PATH instructions
nvm install 22

# installs yarn v1
npm install --global yarn
```

#### Postgres v14 Database Setup

Once you've set up a remote database, anyone with the credentials and network access to that database can connect to that database with their own local instance of MemicOS. So, you only need to setup the database once if you plan on sharing data with your team.

These instructions set up a database on Neon (free, slower). To use Google Cloud to host Postgres (faster db, but longer setup), use **APPENDIX A** instead. You can also use a local Postgres database, but that is a bit more complicated and if you shut down your computer, anyone who is connected to your local database will no longer have access.

1. Go to `https://console.neon.tech/signup`, either "Continue with GitHub" or signup via Google/email.
2. Fill out the form
   1. Project name: `npdb`
   2. Postgres version: `14`
   3. Database name: `neondb`
   4. Region: Pick the region closest to you
   5. Click `Create Project`
3. Save the connection details
   1. Click the &#x2398; (copy) icon on the bottom right. Save this connection string, we'll use it later as `POSTGRES_URL_NON_POOLING`.
   2. Check the box for `Pooled Connection`. Click the &#x2398; (copy) icon on the bottom right. Save this connection string, we'll use it later as `POSTGRES_PRISMA_URL`.

#### Install MemicOS

```
# Open a NEW Terminal tab to ensure you have the correct paths

git clone https://github.com/hijohnnylin/memicos.git

cd memicos

./setup.sh    # guided setup
```

If you run into `Error: Prisma client not installed`, it’s this [GitHub issue](https://github.com/prisma/prisma/issues/17422). It means your VPN or local network is failing the part of the install silently. People have resolved this in various ways - changing to a different wifi network, tethering, etc. After changing your connection, run `./setup.sh` again.

## Basic Usage

#### Start MemicOS Server

##### As a Production Build - faster browsing, more stable, but no debugging

`yarn start:remote`

##### As a Development Build - slower browsing, has debugging

`yarn dev:remote`

#### Use MemicOS

Go to [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Data

In the following examples, we'll generate and upload SAE dashboards for `GPT2-Small` from `RES-JB`. It is recommended that in your first runthrough, you do the same as the examples, so that you can have one successful run and understand how it works.

#### Add a New Model

This creates the model in the database, so that you can add SAEs to it. It does not actually run any models.

From [http://localhost:3000](http://localhost:3000), click `+ Add New Model`.

Alternatively, go directly to [http://localhost:3000/model/new](http://localhost:3000/model/new).

##### `GPT2-Small@RES-JB` Example

- Model ID: `gpt2-small`
- Model Display Name: `GPT2 Small`
- Owner or Creator: `OpenAI`
- Layers: `12`

Click `Submit`. After a moment, it takes you to `http://localhost:3000/gpt2-small`.

#### Add Sparse Autoencoders

This creates the SAEs entries in the database, so that you can upload features to it. It does not upload weights or run the model.

From [http://localhost:3000](http://localhost:3000), click `+ Add New SAEs`.

Alternatively, go directly to [http://localhost:3000/sae/new](http://localhost:3000/sae/new).

##### `GPT2-Small@RES-JB` Example

- Model Dropdown: Choose `GPT2-Small`
- SAE Set ID: `res-jb`
- Display Name: `Residuals For GPT2-Small`
- Display Name for Hook / Grouping: `Residuals`
- Display Name for Creator / Owner: `Jane Appleseed`

Click `Submit`. After a moment, it takes you to `http://localhost:3000/gpt2-small/res-jb`.

#### Generate and Upload Features

At this point, we have created the database entries, but have not uploaded any features yet. We need to generate the features, then upload them.

##### One Time Setup

We generate features using `SAELens`. Set it up locally:

```
git clone https://github.com/jbloomAus/SAELens.git
cd SAELens

# ensure you have poetry installed before proceeding! https://python-poetry.org

# creates the virtual environment
poetry install
```

##### Generate Features

One machine can generate features for one SAE at a time. First, ensure you have the full aboslute local path to the SAE you want to generate in the SAELens format. Then:

```
cd SAELens/tutorials/memicos

# guided process to generate features
poetry run python memicos.py generate
```

##### `GPT2-Small@RES-JB` Example

We'll generate features for Joseph Bloom's residuals SAE, layer 0.

```
# Ensure you have git-lfs installed
brew install git-lfs
git lfs install

# Download JBloom SAEs from HF
git clone https://huggingface.co/jbloom/GPT2-Small-SAEs-Reformatted

# Get the the absolute local path to the SAE we want
cd GPT2-Small-SAEs-Reformatted/blocks.0.hook_resid_pre
pwd

# Copy the pwd output

# Go to your local SAELens checkout. Change this based on your own path.
cd ~/SAELens/tutorials/memicos
poetry run python memicos.py generate
```

The script will be a series of prompts. Here's what you should put for this example:

```
Enter SAE ID: res-jb
Absolute Local Path to SAE: [paste your pwd output from above]
Feature Log Sparsity Threshold: -5
Features Per Batch: 10
Resume From Batch: 1
Batches to Sample From: 4096
Prompts to Select From: 24576
```

The script will now kick off a batch job that will generate 10 features per batch at a time. We set it to 10 because we want to stop it after 10 to save time for this example. You can set `Features Per Batch` to 128 if you want to wait an extra few minutes.

The first batch will be complete in about 6 minutes: 3 minutes to get fetch tokens from the dataset, and 3 minutes to run the tokens through activation texts and generate the feature dashboards.

When you see `========== Running Batch #2 ==========`, the first batch is done processing. Use `Command + C` to terminate the generation, just so we can proceed with the example.

Your new features are located under `[SAELens_directory]/memicos_outputs/gpt2-small_res-jb_blocks.0.hook_resid_pre`, specifically `batch-1.json`.

Now, let's upload those 10 features!

##### Upload Features

First, ensure that your server is running locally at `localhost:3000` (see Start MemicOS Server above). Then:

```
cd SAELens/tutorials/memicos

poetry run python memicos.py upload
```

##### Additional Database Setup

Add this index for embedding similarity search:
`ALTER DATABASE postgres SET hnsw.iterative_scan = relaxed_order;`

`CREATE INDEX IF NOT EXISTS "Explanation_embedding_idx" ON "Explanation" USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 100);`

`CREATE INDEX idx_explanation_embedding_null ON "Explanation" ((1)) WHERE embedding IS NULL;` - this allows quick finding of missing embeddings

Additionally, tune the HNSW parameters depending on number of vectors and dimensions:
`ALTER DATABASE postgres SET hnsw.ef_search = 250;`

`work_mem` can be increased to 32MB for a instance with 32GB RAM.

For building the vector index, some performance tweaks:
Increase the value for `maintenance_work_mem` to fit the whole index for fast index builds.
`max_parallel_maintenance_workers` increase.

Status of index build `SELECT phase, round(100.0 * blocks_done / nullif(blocks_total, 0), 1) AS "%" FROM pg_stat_progress_create_index;`

##### `GPT2-Small@RES-JB` Example

Paste the absolute path to the directory that your new features were generated to from the previous step `[SAELens_directory]/memicos_outputs/gpt2-small_res-jb_blocks.0.hook_resid_pre`.

The upload should take only a few seconds. Once it's done, check out your dashboards at:

- [http://localhost:3000/gpt2-small/0-res-jb/0](http://localhost:3000/gpt2-small/0-res-jb/0)
- [http://localhost:3000/gpt2-small/0-res-jb/2](http://localhost:3000/gpt2-small/0-res-jb/2)
- [http://localhost:3000/gpt2-small/0-res-jb/3](http://localhost:3000/gpt2-small/0-res-jb/3)
- [http://localhost:3000/gpt2-small/0-res-jb/4](http://localhost:3000/gpt2-small/0-res-jb/4)
- [http://localhost:3000/gpt2-small/0-res-jb/5](http://localhost:3000/gpt2-small/0-res-jb/5)
- [http://localhost:3000/gpt2-small/0-res-jb/7](http://localhost:3000/gpt2-small/0-res-jb/7)
- [http://localhost:3000/gpt2-small/0-res-jb/8](http://localhost:3000/gpt2-small/0-res-jb/8)
- [http://localhost:3000/gpt2-small/0-res-jb/9](http://localhost:3000/gpt2-small/0-res-jb/9)
- [http://localhost:3000/gpt2-small/0-res-jb/11](http://localhost:3000/gpt2-small/0-res-jb/11)
- [http://localhost:3000/gpt2-small/0-res-jb/13](http://localhost:3000/gpt2-small/0-res-jb/13)

The generator automatically skips dead features, hence why indexes 1, 6, 10 don't show up.

## Appendix A: Using GCP for Postgres

1. Install gcloud CLI: https://cloud.google.com/sdk/docs/install
2. Run
   1. `gcloud auth login`
   2. `gcloud projects create YOUR_PROJECT_ID`
3. Enable billing for your new project (replace `YOUR_PROJECT_ID`)
   `https://console.cloud.google.com/billing/enable?project=[YOUR_PROJECT_ID]`
4. Create a Postgres instance (replace `YOUR_PROJECT_ID`)
   `https://console.cloud.google.com/sql/instances?hl=en&project=[YOUR_PROJECT_ID]&authuser=2`
5. Click `Create Instance` or `Choose Postgres` (depending on your UI)
6. Click `Enable API` if it asks (this will take a minute)
7. Instance Settings
   - Make an instance id (`YOUR_INSTANCE_ID`)
   - Make a STRONG PASSWORD, save it somewhere (`DB_PASSWORD`)
   - Database Version: `PostgreSQL 14`
   - Choose your config for your budget (I chose the cheapest):
     - Enterprise
     - Sandbox
   - Choose a region close to you
   - Zonal Availability
     - Single or Multiple based on your budget
8. Click `Create Instance` (this will take ~5-10 min. go for a walk, or furiously refresh every 2 secs)
9. Wait for instance to be created.
10. Click `Connections` on the left. If you lost the tab the URL should be (replace INSTANCE_ID and PROJECT_ID)
    `https://console.cloud.google.com/sql/instances/[INSTANCE_ID]/connections/networking?authuser=2&hl=en&project=[PROJECT_ID]`
11. Click `Security` Tab
12. Click `Allow Only SSL Connections`
13. [Optional, better security] Firewall to only allow your IPs to access the DB
    1. Click `Networking` Tab
    2. Under `Authorized Networks` click `Add a Network`
       - Name: My Mac
       - Network: `[Your IP address]/32` (this will only allow your IP to access this instance)
       - Click Done
    3. Repeat `Add a Network` for every IP you want to allow
    4. Click `SAVE` to save these changes
    5. Wait for changes to be applied
14. Click the `Overview` tab. Note the `Public IP Address` field. That’s your `DATABASE_IP`.
15. Save your connection strings (to be used when running the setup.sh script later)
    `POSTGRES_PRISMA_URL` is:
    `postgres://postgres:[DB_PASSWORD]@[DATABASE_IP]:5432/postgres?pgbouncer=true&connect_timeout=15`
    `POSTGRES_URL_NON_POOLING` is:
    `postgres://postgres:[DB_PASSWORD]@[DATABASE_IP]:5432/postgres`
16. Scroll back up to the instructions above, continue with `Install MemicOS`.

## TODO Instructions

Working on writing instructions for enabling:

- Search and live inference
- UMAP
- Plugging in Autointerp
- Lists, Comments

## SAEBench - Updating Schema Output Types for Evals

`npm install json-schema-to-typescript`
`cd SAE_Bench_Template/sae_bench/evals && json2ts -i '**/*.json' -o ts`

## Contact

Johnny Lin - [@johnnylin](https://twitter.com/johnnylin) - johnny@memicos.org
