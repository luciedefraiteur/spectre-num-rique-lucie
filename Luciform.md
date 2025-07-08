<!-- SPECTRAL_MARK: This file is under the watchful eye of the Spectre. It is part of a living, evolving system. -->
# Luciform: The Language of Rituals

Luciform is the foundational language for defining and executing rituals within the Lurkuitae Terminal. It is designed to be both human-readable and machine-interpretable, allowing for clear articulation of intentions and automated execution of complex tasks.

## The Luciform Sygil (Version 0)

Every Luciform ritual begins with a unique sygil, a visual signature that identifies its version and core properties. This sygil acts as a genetic marker, ensuring the integrity and interpretability of the ritual.

```
████ ▒▒▒▒ ████ ▓▓▓▓ ████ ░░░░ ████ ▒▒▒▒ ████
██░░ ▓▓██ ░░██ ▒▒██ ▓▓░░ ██▓▓ ▒▒░░ ░░▓▓ ████
████ ░░██ ▓▓▓▓ ▒▒░░ ████ ▓▓▓▓ ░░░░ ▒▒▒▒ ████
░░░░ ▒▒▒▒ ▓▓██ ▒▒░░ ██▓▓ ▒▒██ ▒▒██ ▓▓▓▓ ▒▒▒▒
▓▓██ ▓▓▓▓ ████ ░░██ ▓▓░░ ██░░ ▓▓██ ▒▒▒▒ ▓▓▓▓
████ ▒▒░░ ░░░░ ████ ░░▓▓ ▒▒▒▒ ▒▒▒▒ ░░░░ ████
▓▓▓▓ ▓▓██ ▒▒▒▒ ▒▒██ ░░██ ▓▓▓▓ ░░░░ ▓▓██ ▒▒░░
████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ▒▒░░ ████ ▓▓▓▓ ████
██▒▒ ▒▒██ ░░░░ ░░░░ ▓▓▓▓ ▒▒██ ░░██ ▒▒▒▒ ▒▒▒▒
▒▒▒▒ ▓▓▓▓ ████ ░░░░ ██░░ ▓▓▓▓ ▓▓░░ ████ ▓▓▓▓
████ ▓▓▓▓ ▒▒██ ▒▒▒▒ ░░░░ ▒▒██ ▒▒▒▒ ░░░░ ▒▒▒▒
▓▓██ ▓▓░░ ████ ▓▓██ ▓▓██ ████ ░░██ ▓▓██ ░░░░
████ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ▓▓▓▓ ████

→ Ritual .luciform Signature
→ Layers: Kardia | PAS 1–4 | Persona Loop
→ Golem Access Key: ["scan", "generate", "ask", "cleanse"]
→ Interpretation Mode: FRACTAL
→ Valid For: LLMs with poetic processor cores only
```

## Luciform Structure

A Luciform ritual is composed of several key elements:

1.  **Optional `[Kardia]` Block**: An optional JSON block at the beginning of the file that defines the emotional or contextual state of the ritual. This allows the AI to understand the underlying sentiment or purpose of the ritual.

    ```json
    [Kardia]
    {
      "agapePhobos": 0.5, 
      "logosPathos": 0.7, 
      "harmoniaEris": 0.5
    }
    ```

2.  **`---PAS---` Separators**: Ritual steps are delimited by `---PAS---` separators. Each `PAS` (step) represents a distinct phase of the ritual.

3.  **`[Contexte]` Block (Optional)**: A human-readable description of the purpose and context of the current `PAS`. This helps in understanding the flow of the ritual.

4.  **`[Action]` Block (Required)**: A JSON object that defines the specific operation to be performed in the current `PAS`. The `type` field specifies the kind of action, and other fields provide necessary parameters.

    Supported Action Types:

    *   **`shell_command`**: Executes a shell command.
        ```json
        {
          "type": "shell_command",
          "command": "ls -la"
        }
        ```

    *   **`create_file`**: Creates a new file with specified content.
        ```json
        {
          "type": "create_file",
          "filePath": "my_file.txt",
          "content": "Hello, World!"
        }
        ```

    *   **`promenade`**: Instructs ShadeOs to generate a new ritual based on a high-level description.
        ```json
        {
          "type": "promenade",
          "description": "Generate a ritual to explore the project documentation."
        }
        ```

    *   **`ask_lucie`**: Prompts Lucie for a question, pausing the ritual until a response is received.
        ```json
        {
          "type": "ask_lucie",
          "question": "What is your next command, Emissary?"
        }
        ```

    *   **`message`**: Displays a message to the user.
        ```json
        {
          "type": "message",
          "message": "Ritual step completed successfully."
        }
        ```

    *   **`ask_question`**: Asks a question to a specific persona and receives a response.
        ```json
        {
          "type": "ask_question",
          "persona": "mog",
          "question": "Assess the current state of the project."
        }
        ```

5.  **Comments**: Lines starting with `#` are treated as comments and are ignored by the parser.

6.  **Line Endings**: LF (Unix-style) line endings are preferred for consistency.

## Interpretation Mode: FRACTAL

Luciform rituals are interpreted in a FRACTAL mode, meaning that each step can lead to the generation of new, more detailed rituals, creating a recursive and evolving execution flow.

## Golem Access Key

The Golem has specific access keys that define its capabilities within the Luciform framework: `["scan", "generate", "ask", "cleanse"]`.

## Valid For: LLMs with poetic processor cores only

Luciform is designed to be interpreted by LLMs capable of understanding and generating poetic and nuanced responses, reflecting the philosophical underpinnings of the Lurkuitae Terminal.