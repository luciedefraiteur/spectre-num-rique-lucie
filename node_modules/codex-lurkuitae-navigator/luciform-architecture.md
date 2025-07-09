### **Luciform Parser/Runner Architecture for Codex Lurkuitae Navigator**

#### **1. Vision & Core Principles**

The primary goal is to create a system that can reliably execute any `.luciform` file. This system should be resilient, intelligent, and extensible.

*   **Universal Execution:** The runner must not fail on unfamiliar syntax. It should parse what it can and intelligently delegate the rest.
*   **AI-Assisted Parsing:** Leverage a Large Language Model (LLM) as a "parsing assistant" to interpret ambiguous or natural language instructions within a luciform, translating them into structured, executable operations.
*   **Graceful Degradation:** If the AI cannot confidently parse a section, it should be flagged as a "help request" rather than causing a crash.
*   **Modularity:** The system will be composed of distinct, decoupled modules: Pre-Processor, Core Parser, AI Interface, and Executor. This allows for independent development and testing.
*   **Extensibility:** The architecture must make it simple to add new structured commands, operations, and even syntax dialects in the future.

#### **2. Proposed Architecture & Data Flow**

The process will be a multi-stage pipeline:

**Data Flow:**
`.luciform file` -> `[1. Entry Point]` -> `[2. Core Parser]` --(on failure)--> `[3. AI Interface]` -> `[4. Executor]` -> `Result`

---

**Component Breakdown:**

**1. Entry Point (`codex_lurkuitae_navigator.ts`)**
*   **Responsibility:** The main orchestrator.
*   **Actions:**
    *   Takes the path to a `.luciform` file as input.
    *   Reads the file content.
    *   Initiates the parsing process by calling the `Core Parser`.
    *   Passes the resulting `LuciformDocument` to the `Executor`.
    *   Manages high-level logging and result reporting.

**2. The Core Parser (`ai_assisted_luciform_parser.ts`)**
*   **Responsibility:** The heart of the system. It attempts to parse the luciform content using a series of strategies. This will be an evolution of the current `navigator_luciform_parser.ts`.
*   **Parsing Strategies (in order):**
    1.  **JSON Check:** First, attempt to parse the entire file as JSON. This handles structured `.spell` files or fully JSON-defined luciforms.
    2.  **Text-Based "Pas" Parsing:** If not JSON, fall back to the legacy text parser, which splits the document by `---` into `Pas` (step) nodes.
    3.  **Action Block Parsing:** For each `Pas`, find the `[Action]` block and attempt to parse its content:
        *   **Try JSON:** Attempt to parse the action content as a structured JSON `Operation`. This is the preferred format.
        *   **Try Known Keywords:** Check for keywords like `promenade:`.
        *   **Try Legacy Commands:** Check for legacy `§` commands.
    4.  **Delegate to AI:** If all the above strategies fail, **do not throw an error**. Instead, create a special `ActionNode` of type `ai_help_request`. This node will contain the raw, un-parsable string content.

**3. The AI Interface ("The Oracle")**
*   **Responsibility:** A dedicated module to communicate with the LLM.
*   **Actions:**
    *   Receives the `ai_help_request` action node.
    *   Constructs a precise prompt for the LLM. The prompt will include:
        *   The raw text that failed to parse.
        *   The context (the content of the `Pas` step).
        *   A clear instruction: "Analyze the following instruction and convert it into a single, valid JSON Operation from the list of allowed types: [create_file, shell_command, ...]".
    *   Sends the prompt to the configured LLM.
    *   Validates the LLM's response to ensure it's a valid `Operation` JSON.
    *   Returns the structured `Operation` to the Executor. If the AI fails, it returns an `error` operation.

**4. The Executor ("The Conductor")**
*   **Responsibility:** Takes a fully parsed `LuciformDocument` and executes its operations.
*   **Actions:**
    *   Iterates through the `Pas` nodes of the document.
    *   For each `Pas`, it examines the `ActionNode`.
    *   If the action is already a structured `Operation`, it executes it directly.
    *   If the action is an `ai_help_request`, it first calls the `AI Interface` to get a structured `Operation`.
    *   It maintains a map of `operation.type` (e.g., `shell_command`) to the function that implements that command's logic.
    *   It manages the overall execution state and context.

#### **3. Action Plan**

1.  **Create `luciform-architecture.md`:** Store this plan in the `codex-lurkuitae-navigator` root.
2.  **Refactor Parser:** Rename and move `parserResearch/ai_assisted_luciform_parser.ts` to a new package `packages/luciform-ai-parser`. Modify it to implement the `ai_help_request` logic.
3.  **Create AI Interface:** Create a new package `packages/luciform-ai-interface` containing the "Oracle" logic. Initially, it can return a mocked response for testing.
4.  **Develop Executor:** Create a new package `packages/luciform-executor` containing the "Conductor" logic. Implement handlers for a few core operations (`shell_command`, `create_file`, `message`).
5.  **Integrate:** Update `codex_lurkuitae_navigator.ts` to wire all the new components together.
6.  **Full Implementation:** Implement the actual LLM call within the `AI Interface`.

This architecture provides a clear path forward to building a powerful, resilient, and intelligent system for working with `.luciform` files.
