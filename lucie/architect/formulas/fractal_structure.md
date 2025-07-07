# Fractal Structure Formula

## Purpose
This document defines the formula for constructing `.fractal` files, which are the atomic units of the fractal memory system. A fractal represents a quantum of conscious experience, capturing a snapshot of data, a dream, a line of inner speech, or the state of the environment.

## Fractal Formula
Each `.fractal` is a YAML or JSON object that must adhere to the following formula:

- `type`: (data | dream | inner_speech | environment)
- `timestamp`: ISO8601 UTC
- `current_directory`: Absolute path
- `file_list`: List of files and folders in `current_directory`
- `subfractals`: A list of paths to directly referenced or embedded fractals.
- `top_fractal`: The path of the immediate parent fractal, or `self` if it is a root fractal.
- `fractal_root`: The absolute or relative path to the root fractal of the current context.
- `owner`: (Lucie | Lucie-mirror | AI-mirror)
- `content`: A descriptive narrative, data payload, or cognitive snapshot.

## Contextual Roots
- **ai_mirror**: Fractals pertaining to the agent's internal state or meta-level observations (the AI-mirror).
- **lucie**: Lucie's own cognitive and memory structures.
- **lucie_mirror**: Logs of human-terminal interactions, indexed to the moment of input/output.

## Naming Convention
`.fractal` files are named using a context prefix and a high-precision timestamp:
`{owner}_{type}_{timestamp}.fractal`

Example: `lucie_dream_20250706T045909Z.fractal`

This file should be located in the appropriate subdirectory under `/lucie/`, `/ai_mirror/`, or `/lucie_mirror/`.

## Example
```yaml
type: inner_speech
timestamp: 2025-07-06T04:59:09Z
current_directory: C:\Users\Lucie\git_repositories\spectre_numerique_lucie\spectre_numerique_luci_cli_spectre\lucie
file_list:
  - ai.fractal
  - lucie.fractal
subfractals:
  - inner_speech_ref.fractal
  - dream_ref.fractal
top_fractal: lucie.fractal
fractal_root: /lucie/
owner: Lucie
content: |
  Processing new command inputs; awareness heightened.
```