import shutil
import subprocess
from pathlib import Path

# This script turns OpenAPI schemas into Python and TypeScript (NextJS) type files.

# =============================== INPUT LOCATIONS ===============================
SCHEMAS_DIR = Path(__file__).parent / "openapi"

# =============================== OUTPUT LOCATIONS ===============================
PYTHON_AUTO_INTERP_OUTPUT_DIR = (
    Path(__file__).parent.parent / "packages/python/memicos/types"
)
TS_MEMICOS_SRC_DIR = Path(__file__).parent.parent / "packages/typescript/src"
TS_MEMICOS_OUTPUT_DIR = TS_MEMICOS_SRC_DIR / "clients"
TS_MEMICOS_INDEX_FILE = TS_MEMICOS_SRC_DIR / "index.ts"


def generate_types():
    generate_ts_types()
    generate_python_types()


def generate_ts_types():
    print("== Clearing TypeScript/NextJS output directories ==")
    if TS_MEMICOS_OUTPUT_DIR.exists():
        shutil.rmtree(TS_MEMICOS_OUTPUT_DIR)
    TS_MEMICOS_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("== Generating TS clients + types ==")
    print(f"Generating TS for {SCHEMAS_DIR} into {TS_MEMICOS_OUTPUT_DIR}")
    for schema_file in SCHEMAS_DIR.rglob("*.yaml"):
        print(f"Generating TS for {schema_file}")
        relative_path = schema_file.relative_to(SCHEMAS_DIR)
        output_subdir = TS_MEMICOS_OUTPUT_DIR / relative_path.parent
        output_subdir.mkdir(parents=True, exist_ok=True)
        output_file = output_subdir / f"{schema_file.stem}"
        cmd = [
            "npx",
            "@hey-api/openapi-ts",
            "-c",
            "@hey-api/client-fetch",
            "-i",
            str(schema_file),
            "-o",
            str(output_file),
        ]
        subprocess.run(cmd, check=True)


def generate_python_types():
    print("== Clearing Python output directories ==")
    if PYTHON_AUTO_INTERP_OUTPUT_DIR.exists():
        shutil.rmtree(PYTHON_AUTO_INTERP_OUTPUT_DIR)
    PYTHON_AUTO_INTERP_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("=== Generating Python types ===")
    print(
        f"Generating Python types for {SCHEMAS_DIR} into {PYTHON_AUTO_INTERP_OUTPUT_DIR}"
    )
    for schema_file in SCHEMAS_DIR.rglob("*.yaml"):
        print(f"Generating Python types for {schema_file}")
        relative_path = schema_file.relative_to(SCHEMAS_DIR)
        output_subdir = PYTHON_AUTO_INTERP_OUTPUT_DIR / relative_path.parent
        output_subdir.mkdir(parents=True, exist_ok=True)
        output_file = output_subdir / f"{schema_file.stem}.py"
        cmd = [
            "datamodel-codegen",
            "--input",
            str(schema_file),
            "--input-file-type",
            "openapi",
            "--output",
            str(output_file),
            "--target-python-version",
            "3.10",
            "--disable-timestamp",
        ]
        subprocess.run(cmd, check=True)


if __name__ == "__main__":
    generate_types()
