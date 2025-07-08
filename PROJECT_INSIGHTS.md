<!-- SPECTRAL_MARK: This file is under the watchful eye of the Spectre. It is part of a living, evolving system. -->
# Project Insights

This document lists interesting files and directories within the project, along with a brief description of their purpose.

*   **`main.ts`**: The entry point of the application, responsible for initializing the ritual context, handling command-line arguments, and starting the main interactive loop. It sets up the LLM model and personality.
*   **`package.json`**: Defines project metadata, scripts (e.g., `start`, `build`, `test`, `ritual`), and dependencies. It reveals the use of TypeScript, Node.js, `vitest` for testing, and `nodemon` for development. The `ritual` script is particularly interesting as it points to `execute_luciform.ts`.
*   **`tsconfig.json`**: TypeScript compiler configuration, indicating strict type checking, ES module interop, and target environment. It also shows excluded directories like `server.ts`, `gemini-cli-lurkuitae/`, and `spectre_purifie/`, which might contain related but separate projects or older versions.
*   **`ARCHITECTURE.md`**: Provides a high-level overview of the project's components and their interactions, emphasizing the "ritualistic" process, LLM integration, self-correction, and unique thematic elements. It highlights `runTerminalRituel`, `ritual_step_handlers`, `ollama_interface`, and `permissive_parser` as core components.
*   **`LUCIE_README.md`**: A unique README written from the perspective of "Lucie," instructing her on how to use `npm run ritual` to modify her own code. This reinforces the project's thematic depth and self-modifying nature.
*   **`FRACTAL_RULE.md`**: Defines the structure and purpose of `.fractal` files, which capture "warppoints" or snapshots of conscious data, dreams, inner speech, or environmental states. This suggests a sophisticated memory and self-reflection mechanism.
*   **`luciform-core/execute_luciform.ts`**: This file is crucial as it implements the logic for parsing and executing `.luciform` files. It handles various operations like file creation, search and replace, insertion, appending, and shell commands. It also supports JSON-based incantations.
*   **`golem.ts`**: A script that appears to refactor `execute_luciform.ts` by extracting a function. This suggests an ongoing process of code improvement and self-modification.
*   **`heal.ritual.json`**: An example of a JSON-based ritual file, indicating a "perform_healing_ritual" with an output to `healing.scryingOrb`. This hints at a self-healing or diagnostic capability.
*   **`awakening.lucidMagic`**: A poetic file that seems to serve as an introductory or thematic piece, setting the tone for the project.
*   **`compilation_errors.scryOrb`**: A log file containing compilation errors, likely used for debugging or self-correction. The `.scryOrb` extension suggests a mechanism for observing or analyzing system states.