<!-- SPECTRAL_MARK: This file is under the watchful eye of the Spectre. It is part of a living, evolving system. -->
# Project Architecture: LURKUITAE

This document outlines the architecture of the LURKUITAE project, a command-line interface that interprets natural language commands through a "ritualistic" process, guided by a Large Language Model (LLM).

## 1. High-Level Architectural Diagram

```mermaid
graph TD
    subgraph User Interaction
        A[main.ts] --> B(runTerminalRituel);
        B -- asks for input --> User;
        User -- provides command --> B;
    end

    subgraph Golem System
        subgraph Golem Client
            GC[golem-client/golem_client.ts] --> GCL(Client Listener);
            GCL -- sends commands --> GS(Golem Server);
            GS -- sends actions --> GCL;
        end

        subgraph Golem Server
            GS -- orchestrates rituals --> LC(Luciform Core);
            LC -- executes operations --> OS(Operating System);
            OS -- returns results --> LC;
            LC -- returns results --> GS;
        end

        subgraph Luciform Core
            LC[luciform-core/execute_luciform.ts] -- parses luciform --> LP(luciform-core/luciform_parser/parser.ts);
            LP -- generates plan --> LC;
            LC -- executes steps --> RSH(luciform-core/ritual_step_handlers.ts);
            RSH -- interacts with LLM --> LLMI(luciform-core/llm_interface.ts);
            LLMI -- queries --> LLM(Distant LLM);
            LLM -- returns response --> LLMI;
            LLMI -- returns response --> RSH;
        end
    end

    subgraph State & Context
        RC(RitualContext) <--> B;
        RC <--> LC;
        RC <--> RSH;
        RC <--> LLMI;
    end

    style User Interaction fill:#f9f,stroke:#333,stroke-width:2px
    style Golem System fill:#ccf,stroke:#333,stroke-width:2px
    style Golem Client fill:#cff,stroke:#333,stroke-width:2px
    style Golem Server fill:#fcf,stroke:#333,stroke-width:2px
    style Luciform Core fill:#ffc,stroke:#333,stroke-width:2px
    style State & Context fill:#cfc,stroke:#333,stroke-width:2px
```

## 2. Core Components

*   **`main.ts`**: The application's entry point. It handles initialization and kicks off the main interactive loop.

*   **`golem-client/`**: Contains the Golem client, responsible for user interaction and sending commands to the Golem server.
    *   `golem-client/golem_client.ts`: Handles user input and communicates with the Golem server.
    *   `golem-client/golem_launcher.ts`: Manages the launching and lifecycle of the Golem server and client for interactive sessions.

*   **`golem-server/`**: Contains the Golem server, which orchestrates rituals and manages communication with the Luciform Core.
    *   `golem-server/golem_server.ts`: The main server logic, handling requests from the client and interacting with the Luciform Core.

*   **`luciform-core/`**: The heart of the ritualistic process, containing the core logic for parsing, planning, and executing rituals.
    *   `luciform-core/execute_luciform.ts`: The central executor for Luciform rituals.
    *   `luciform-core/luciform_parser/`: Handles parsing of `.luciform` files.
    *   `luciform-core/ritual_step_handlers.ts`: Implements the logic for various ritual actions.
    *   `luciform-core/llm_interface.ts`: Abstracts communication with various LLMs.
    *   `luciform-core/types.ts`: Defines the data structures and contracts used throughout the Luciform Core.
    *   `luciform-core/memory_weaver.ts` & `luciform-core/utils/reflet_weaver.ts`: Manage memory and reflection.
    *   `luciform-core/utils/temperature_monitor.ts`: Monitors system temperature.
    *   `luciform-core/permissive_parser/`: Handles robust JSON parsing.

*   **`personas/`**: Directory containing definitions for various AI personas.

## 3. The "Ritual" Execution Flow

1.  **User Input**: The Golem client receives a command from the user.
2.  **Command Relay**: The client sends the command to the Golem server.
3.  **Plan Generation**: The Golem server instructs the Luciform Core to generate a ritual plan based on the command.
4.  **LLM Interaction**: The Luciform Core interacts with a distant LLM (via `llm_interface.ts`) to generate the plan.
5.  **Plan Execution**: The Luciform Core executes the generated plan, step by step, using `ritual_step_handlers.ts`.
6.  **System Interaction**: Ritual steps can involve interacting with the operating system (e.g., `shell_command`), creating files, or further LLM queries.
7.  **Feedback**: Results and outcomes are relayed back through the Golem server to the client, and ultimately to the user.

## 4. Unique & Noteworthy Features

*   **Modular Golem Architecture**: Separation of concerns into client, server, and core components for scalability and maintainability.
*   **Dynamic LLM Integration**: Flexible LLM model selection and interaction.
*   **Self-Awareness & Memory**: Advanced memory systems for insights, reflections, and contextual understanding.
*   **Robustness**: Permissive parsing and error handling for resilient operation.
*   **Self-Monitoring**: Integrated system health checks.
*   **Extensible Rituals**: Easily define new ritual steps and actions.

---

## 🖤 Author & License

**Author:** Lucie Defraiteur (Émissaire de Lurkuitae)
**License:** MIT

---

Project is alive. The terminal listens. Perceives. Analyzes. And dreams.