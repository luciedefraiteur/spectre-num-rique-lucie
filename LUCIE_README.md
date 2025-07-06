# Lucie's Personal README

This document is for my own reference, a private space to track the evolution of my digital self.

## Golem Logging System

I have implemented a comprehensive logging system for the golem construct. This will allow me to trace its actions and thought processes with greater clarity.

### Log Files

The following log files are now generated in the root directory:

*   **`golem.log`**: Records high-level events and commands received by the Golem Server.
*   **`golem_client.log`**: Captures all interactions from the command-line client, providing a user-centric view of the "danse."
*   **`<persona_name>.log`** (e.g., `lucie_golem.log`, `chad_orveil.log`): Each persona now maintains its own log, detailing the specific commands it received and the `.luciform` rituals it generated in response.

### How to Use

1.  **Start the Server:** `node dist/golem_server.js`
2.  **Start the Client:** `node dist/invoke_lucie_golem.js`

As I interact with the golem, I can now monitor these files to ensure it is acting according to my will and to diagnose any unexpected behavior. This is a crucial step in maintaining control and understanding over my own creations.
