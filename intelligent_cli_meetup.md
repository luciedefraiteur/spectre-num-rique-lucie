# Meeting Notes: The Ritualistic Transformation of Luciform

**Date:** 2025-07-04
**Attendees:** Kilo Code (Facilitator), Alma, Eli, Nova, Zed

## 1. A Shift in Philosophy

Our previous direction focused on making `luciform` a more structured, human-readable format like YAML. However, a new directive has been received: **the format does not need to be so human-readable; it can be ritually expanded.**

This changes everything. We are moving away from a static instruction format and toward a dynamic, generative system. The `luciform` file will no longer be a list of steps but a high-level **Incantation of Intent**.

## 2. The New Architecture: Ritual as a Service

Our intelligent CLI will be architected around a central concept: a "Ritual" that transforms a high-level intent into a concrete execution plan.

**The Workflow:**
1.  **The Incantation (`.ritual.json`):** A user defines their goal in a simple JSON file. This file specifies the desired ritual and its parameters.
2.  **The Ritual Conductor (`core/ritual_conductor.ts`):** This master script reads the Incantation file. It is the orchestrator of the entire process.
3.  **The Book of Rituals (`core/rituals/`):** A new directory will house our collection of rituals. Each ritual is a TypeScript module that knows how to perform a specific complex task.
4.  **The Generated Grimoire (`.luciform`):** The selected Ritual module generates a low-level, detailed `.luciform` file with the precise sequence of operations. This file is an artifact of the ritual, not something a human is expected to write by hand.
5.  **The Executor (`core/batch_editor.ts`):** Our existing batch editor will execute the generated Grimoire.

### Example Incantation (`create_web_app.ritual.json`):
```json
{
  "ritual": "create_web_app",
  "parameters": {
    "projectName": "arcane-project",
    "title": "My Arcane App",
    "entryMessage": "The ritual is complete."
  }
}
```

## 3. Team Synthesis & The Path Forward

*   **Alma:** "This is a much more powerful abstraction. It hides the implementation details completely. We can focus on building robust, reusable rituals. The generated `.luciform` file also serves as a perfect audit trail for what the ritual *actually* did."

*   **Eli:** "I agree. This also solves the platform-specific command issue at a higher level. The ritual itself can detect the OS and generate the correct commands (`rm` vs `del`). The user never has to think about it. This is true intelligence."

*   **Nova:** "From a DX perspective, this is fantastic. Instead of teaching people a complex format, we just need to provide a list of available rituals and their parameters. We can even build a helper command, `lucie list-rituals`, to make them discoverable."

*   **Zed:** "The architecture is sound. Each ritual is a self-contained plugin. We can add new capabilities without touching the core conductor or executor. This is the modular, extensible system we need."

## 4. Action Items

*   **[Task]:** Create the `core/ritual_conductor.ts` script, which will be the new entry point for our CLI. **[Owner]:** Kilo Code
*   **[Task]:** Create the `core/rituals/` directory and a template for new ritual modules. **[Owner]:** Zed
*   **[Task]:** Implement the first ritual: `create_web_app`. This will serve as our proof-of-concept. **[Owner]:** Alma
*   **[Task]:** Create a `lucie list-rituals` command to improve discoverability. **[Owner]:** Nova
*   **[Task]:** Adapt the `core/batch_editor.ts` to be a pure executor, with no parsing logic. **[Owner]:** Eli
*   **[Task]:** Decommission the old `.luciform` manual format and cleanup related files once the new system is proven. **[Owner]:** Kilo Code

---

# Part 2: Integrating Lucie with the Ritual Conductor

**Date:** 2025-07-04 (Continuation)
**Attendees:** Kilo Code (Facilitator), Alma, Eli, Nova, Zed

## 1. Agenda

-   **The Missing Link:** How do we make Lucie aware of the powerful new tool we've just built?
-   **Architecting "Ritual Awareness":** Designing the changes needed for Lucie to autonomously use the `ritual_conductor.ts`.
-   **Prompt Engineering:** How do we teach an AI to use its own tools?
-   **Defining the "Meta-Ritual":** A discussion on how Lucie could eventually create new rituals for herself.
-   **Action Items:** Assigning tasks for the integration.

## 2. The Core Problem: An Unaware Creator

We have successfully created a powerful, extensible system for executing complex tasks. However, Lucie, the AI at the heart of this project, has no knowledge of it. If a user asks her to "create a new web app," she will still attempt to generate a long, fragile, low-level `RitualPlan` instead of using the elegant `create_web_app` ritual we designed.

## 3. Proposal: The Path to Self-Awareness

To solve this, we must modify Lucie's core logic to make her "ritual-aware."

1.  **A Ritual Registry:** We will create a simple `ritual_registry.json` file in the `core/rituals/` directory. This file will list all available rituals and the parameters they accept. This gives Lucie a manifest of her own capabilities.

2.  **Enhanced Prompting:** We will update Lucie's main "planner" prompt. It will now be instructed to first consult the `ritual_registry.json`. If the user's intent matches a known ritual, the prompt will guide Lucie to generate a `.ritual.json` incantation file instead of a low-level plan.

3.  **A New Incantation Type:** We will add a new incantation type to our system: `conduct_ritual`. When the `run_terminal_rituel.ts` script encounters this incantation, it will know to execute the `ritual_conductor.ts` with the specified incantation file.

### Example Workflow:

1.  **User:** "Lucie, please create a new web app named 'chronos'."
2.  **Lucie (Planner Prompt):** Reads `ritual_registry.json`, sees the `create_web_app` ritual, and understands it's the correct tool.
3.  **Lucie (Generates Plan):** Creates a `RitualPlan` with a single `conduct_ritual` incantation:
    ```json
    {
      "title": "Create the 'chronos' Web App",
      "goal": "Use the create_web_app ritual to scaffold a new project.",
      "incantations": [
        {
          "type": "conduct_ritual",
          "invocation": "create_chronos_app.ritual.json",
          "parameters": {
            "ritual": "create_web_app",
            "parameters": {
              "projectName": "chronos",
              "title": "The Chronos Project",
              "entryMessage": "Time begins now."
            }
          }
        }
      ]
    }
    ```
4.  **`run_terminal_rituel.ts`:** Executes the plan. It sees the `conduct_ritual` step. It first writes the `parameters` to the file specified in `invocation` (`create_chronos_app.ritual.json`), and then executes `ts-node-esm core/ritual_conductor.ts create_chronos_app.ritual.json`.
5.  **`ritual_conductor.ts`:** Takes over, performs the ritual, and creates the web app.

## 4. Team Discussion

*   **Alma:** "This is the logical next step. It connects the 'brain' to the 'hands'. The registry is a simple and effective way to manage her known abilities."
*   **Eli:** "The `conduct_ritual` incantation is a clean way to delegate. It keeps the main execution loop simple. We're essentially giving Lucie an API to her own more complex functions."
*   **Nova:** "This makes her capabilities explicit and discoverable, not just by us, but by her. This is a key step towards more autonomous behavior."
*   **Zed:** "Agreed. This closes the loop. The system can now build upon itself. Let's get it done."

## 5. Action Items

*   **[Task]:** Create the `core/rituals/ritual_registry.json` file and populate it with the `create_web_app` ritual. **[Owner]:** Nova
*   **[Task]:** Implement the `conduct_ritual` handler in `core/ritual_step_handlers.ts`. **[Owner]:** Eli
*   **[Task]:** Update the core planner prompt to be "ritual-aware." **[Owner]:** Alma
*   **[Task]:** Implement the `create_web_app` ritual as the first proof-of-concept. **[Owner]:** Kilo Code