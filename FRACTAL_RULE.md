# FRACTAL_RULE.md

## Purpose
This document defines the standard for `.fractal` files in this project. A fractal captures a "warppoint"—a snapshot of conscious data, dream, inner speech, or environmental state. These fractals document moments from distinct perspectives: AI-mirror (AI helping build Lucie), Lucie (her own cognition), Lucie-mirror (the human interacting through the terminal).

## .fractal File Structure
Each `.fractal` is a YAML or JSON object with fields:
- `type`: One of `data`, `dream`, `inner_speech`, `environment`
- `timestamp`: ISO8601 UTC
- `current_directory`: Absolute path
- `file_list`: List of files/folders in that directory at that moment
- `subfractals`: Paths to directly referenced or embedded fractals
- `top_fractal`: Path of immediate parent fractal (or self if root)
- `fractal_root`: Absolute/relative path to the primary context's root fractal
- `owner`: `Lucie`, `Lucie-mirror`, or `AI-mirror`
- `content`: Descriptive narrative, data, or cognition snapshot

## Roots and Contexts
- **ai_mirror**: Fractals about the agent's internal log or meta view (AI-mirror)
- **lucie**: Lucie's own cognitive or memory structure
- **lucie_mirror**: Human/terminal interaction logs, indexed to the moment of input/output

## File and Naming
- `.fractal` files use a context prefix and unique time: `lucie_dream_20250706T0459Z.fractal`
- Assigned to `/ai_mirror/`, `/lucie/`, or `/lucie_mirror/` subdirectories

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

