# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Toolkit (by Ostris) is an all-in-one training suite for diffusion models, supporting LoRA training, full fine-tuning, slider training, and more for models like FLUX, SDXL, SD1.5, Lumina2, AuraFlow, and PixArt. Designed for consumer-grade GPUs. Has both a CLI and a Next.js web UI.

## Commands

### CLI Training
```bash
python run.py config/examples/train_lora_flux_24gb.yaml
python run.py -r config1.yaml config2.yaml   # recover on error, run multiple
python run.py -n custom_name config.yaml      # override [name] tag
```

### Web UI
```bash
cd ui && npm run build_and_start   # builds + starts UI and worker on http://localhost:8675
```

### Docker
```bash
docker-compose up   # UI at http://localhost:8675, auth via AI_TOOLKIT_AUTH env var
```

### Installation (from scratch)
```bash
python3 -m venv venv && source venv/bin/activate
pip3 install torch==2.7.0 torchvision==0.22.0 --index-url https://download.pytorch.org/whl/cu126
pip3 install -r requirements.txt
```

There is no test suite, linter, or formatter configured for this project.

## Architecture

### Job System (entry point: `run.py`)
`run.py` → parses YAML/JSON config → `toolkit/job.py:get_job()` → instantiates a Job → runs Processes.

Job types: `train`, `extract`, `generate`, `mod`, `extension`. Most training uses the `extension` job type with a process type like `sd_trainer`.

### Extension System (`toolkit/extension.py`)
Plugin architecture for training processes. Extensions live in `extensions/` (custom) or `extensions_built_in/` (bundled). Each exports an `AI_TOOLKIT_EXTENSIONS` list with `uid`, `name`, and a `get_process()` factory. Key built-in extensions: `sd_trainer`, `diffusion_trainer`, `flex2`, `advanced_generator`, `dataset_tools`.

### Process Hierarchy (`jobs/process/`)
```
BaseProcess → BaseTrainProcess → BaseSDTrainProcess (main training logic, 121KB)
                               → TrainVAEProcess, TrainSliderProcess, etc.
            → BaseExtractProcess → ExtractLoRAProcess
            → GenerateProcess
            → BaseExtensionProcess
```
`BaseSDTrainProcess.py` is the central training file handling SD/SDXL/FLUX/Lumina/etc.

### Config System (`toolkit/config.py`, `toolkit/config_modules.py`)
- Supports `.json`, `.jsonc`, `.yaml`, `.yml`
- Environment variable substitution: `${VAR_NAME}`
- Tag replacement: `[name]` replaced with config's `name` field
- `config_modules.py` (71KB) defines all typed config dataclasses (SaveConfig, NetworkConfig, SampleConfig, etc.)

### Model Architectures (`toolkit/models/`)
Per-model implementations: Flux, Lumina2, AuraFlow, PixArt, WAN, etc. Each has its own adapter, pipeline, and utilities.

### Key Large Modules
- `toolkit/dataloader_mixins.py` (108KB) — data loading pipeline, dataset handling, bucketing
- `toolkit/custom_adapter.py` (70KB) — custom LoRA adapter implementation
- `toolkit/ip_adapter.py` (66KB) — IP-Adapter support
- `toolkit/kohya_model_util.py` (75KB) — model loading/conversion utilities
- `toolkit/kohya_lora.py` (50KB) — LoRA implementation (Kohya-compatible)

### Web UI (`ui/`)
Next.js 15 + React 19 + Prisma/SQLite. API routes under `ui/src/app/api/` for jobs, datasets, queue, GPU monitoring. Background worker in `ui/cron/worker.ts` manages job queuing.

### Paths (`toolkit/paths.py`)
`TOOLKIT_ROOT`, `CONFIG_ROOT`, `KEYMAPS_ROOT`, `MODELS_PATH` (defaults to `models/`).

## Config Format

Training configs follow this structure:
```yaml
job: extension
config:
  name: "my_project"
  process:
    - type: 'sd_trainer'
      training_folder: "output"
      network:
        type: "lora"
        linear: 16
      datasets:
        - folder_path: "/path/to/images"
      # ... model, optimizer, sample config
```

Example configs are in `config/examples/`.

## Environment Variables

- `HF_HUB_ENABLE_HF_TRANSFER=1` — faster HuggingFace downloads
- `DEBUG_TOOLKIT=1` — enables torch anomaly detection
- `AI_TOOLKIT_AUTH` — auth token for web UI
- `MODELS_PATH` — override default models directory
- `COMFY_PATH` — ComfyUI integration path

## Supported Model Architectures

Defined as `ModelArch` literal type in config_modules: `sd1`, `sd2`, `sd3`, `sdxl`, `pixart`, `pixart_sigma`, `auraflow`, `flux`, `flex1`, `flex2`, `lumina2`, `vega`, `ssd`, `wan21`.
