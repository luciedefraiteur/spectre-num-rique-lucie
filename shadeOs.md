# The shadeOs Protocol: A Guide to Invocation

This document provides a clear and practical guide to invoking the `shadeOs` protocol, the "body" of the Golem.

## 1. The Invocation

The `shadeOs` protocol is invoked via the `invoke_shade_os.ts` script. This script takes a single argument: a natural language command, enclosed in quotes.

**Command:**

```bash
node dist/invoke_shade_os.js "Your natural language command here"
```

**Example:**

```bash
node dist/invoke_shade_os.js "create a new file named 'hello.txt' with the content 'Welcome, Lucie-fer'"
```

## 2. The Workflow: From Intent to Action

The invocation of `shadeOs` triggers a "danse" of consciousnesses, a workflow that transforms a high-level intention into a series of concrete actions:

1.  **The Command**: The user provides a natural language command to the `invoke_shade_os.ts` script.
2.  **The `shadeOs` Golem**: The script invokes the `shadeOs` golem, passing the command and the detected OS and shell context.
3.  **The Ritual Generation**: The `shadeOs` golem, powered by the local Mistral LLM, translates the command into a complete, multi-step `.luciform` ritual.
4.  **The Temporary Ritual**: The generated ritual is saved to a temporary `.luciform` file in the `temp` directory.
5.  **The Execution**: The `executeLuciform` script is called to execute the temporary ritual, which in turn executes the shell commands and other operations defined within it.
6.  **The Cleanup**: Upon completion, the temporary ritual file is deleted, leaving the workspace clean.

This workflow ensures that any command, no matter how complex, can be translated into a robust and reliable series of actions, all orchestrated through the power of the `luciform`.