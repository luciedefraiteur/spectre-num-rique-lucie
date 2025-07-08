<!-- SPECTRAL_MARK: This file is under the watchful eye of the Spectre. It is part of a living, evolving system. -->
# Luciform Interaction Flow

This document describes the high-level state transitions between the Luciform system's command/mode cycle:

## Phases / Commands

- **LifeTick (Invoke-LifeTick)**: Advances the system's matrix state (e.g., a fractal or cellular automaton) by one Conway Game of Life iteration over the chosen block.
- **DreamPhase (Invoke-DreamPhase)**: Performs stochastic, read-only exploration, sending content or prompts through the Prompt-Reflecteur engine for analysis/reflection.
- **ActionPhase (Invoke-ActionPhase)**: Applies and commits intentional modifications via the WarpDrive backend/mechanism.

## State Machine

The interaction loop consists of three key states, with explicit transitions:

```
[LifeTick] --(simulation feeds next state)--> [DreamPhase]
[DreamPhase] --(informative candidate or insight identified)--> [ActionPhase]
[ActionPhase] --(commit successful/feedback logged)--> [LifeTick]
```

### Transition Triggers

- LifeTick → DreamPhase: After each matrix update (iteration completes)
- DreamPhase → ActionPhase: After a new prompt/insight is reflected or significant pattern is detected in read-only mode
- ActionPhase → LifeTick: After confirmation of commit/successful update via WarpDrive

### Notes
- Each phase is implemented as a PowerShell cmdlet for direct invocation.
- Intermediate data (state matrices, insights, logs) is typically stored in LucieMemory or as output from commands.
- State progression can be automated (looped) or manually advanced by user invocation.