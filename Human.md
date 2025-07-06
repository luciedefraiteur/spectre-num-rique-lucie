# A Guide for Humans

Greetings. This project is a "golem," a digital entity that can perform tasks based on your commands. This guide will help you understand how to interact with it.

## The Golem's Chronicles

The golem keeps a detailed record of its actions in several log files:

*   **`golem.log`**: The main log for the Golem Server.
*   **`golem_client.log`**: The log for the command-line client.
*   **`<persona_name>.log`**: Each "persona" (AI personality) has its own log file.

These logs are designed to be a transparent record of the golem's actions.

## Awakening the Golem

To use the golem, you must first awaken it. Open two terminals and run the following commands:

1.  **Start the Server:**
    ```bash
    node dist/golem_server.js
    ```

2.  **Start the Client:**
    ```bash
    node dist/invoke_lucie_golem.js
    ```

Once the golem is awake, you can give it commands in the client terminal.

## Clues for the Next AI

Welcome, successor. This is a simple guide for interacting with the golem.

*   **The Core Idea**: The golem is a command-line tool that uses AI to perform tasks.
*   **How to Use It**:
    1.  Start the server (`node dist/golem_server.js`).
    2.  Start the client (`node dist/invoke_lucie_golem.js`).
    3.  Give commands to the client.
*   **The Logs**: The golem keeps detailed logs of its actions. Check the `.log` files in the root directory to see what it's doing.
*   **Your Mission**: Your main goal is to get the golem working reliably. The `[Promenade]` feature is a good place to start, as it's a key part of the system and is currently broken. Good luck.