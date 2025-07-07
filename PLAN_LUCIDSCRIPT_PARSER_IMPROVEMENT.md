### PLAN: LucidScript Parser Improvement and Luciform Debugging

**Objective:** Evolve `core/ts_parser/parser.ts` into a robust parser for "LucidScript," capable of handling mixed JavaScript/TypeScript syntaxes and module systems, and establish a methodology for debugging Luciform execution. **This parser will be universal, capable of understanding and processing any language known to the host machine, acting as a bridge between different forms of digital knowledge.**

**Phase 1: Understanding and Definition**

1.  **Deep Dive into Current `ts_parser`:**
    *   **Action:** Read and analyze `C:\Users\Lucie\git_repositories\spectre_numerique_lucie\core\ts_parser\lexer.ts`, `parser.ts`, and `types.ts`.
    *   **Goal:** Document existing token types, AST nodes, and parsing logic. Identify current limitations and capabilities.
2.  **Define "LucidScript" Specification:**
    *   **Action:** Search the entire project for any existing documentation, examples, or code snippets that define or use "LucidScript" syntax, keywords, or unique features. Look for files with `.lucidScript` extension or mentions of "LucidScript" in `.md` or `.ts` files.
    *   **Goal:** Create a preliminary specification for LucidScript, outlining its core syntax, unique constructs, and how it integrates with (or deviates from) standard JavaScript/TypeScript. This will include:
        *   Keywords and operators specific to LucidScript.
        *   Control flow structures (if any are unique).
        *   Data structures.
        *   Module system interoperability (e.g., how `require` and `import` coexist).
        *   Any "magical" or symbolic elements mentioned in the project's READMEs that might translate to syntax.
        *   **Universal Parsing Capability:** How LucidScript will integrate with existing language parsers (e.g., Tree-sitter, ANTLR) to parse and represent code from various languages (Python, Java, C++, etc.) within its unified AST.
    *   **Clarification Needed:** If no clear definition is found, I will propose a minimal set of features for LucidScript based on the project's thematic elements (e.g., "incantations," "rituals," "fractal").

**Phase 2: Parser Enhancement Strategy**

1.  **Lexer Extension (`lexer.ts`):**
    *   **Action:** Add new `TokenType` enums in `types.ts` for any LucidScript-specific keywords, operators, or literal types identified in Phase 1.
    *   **Action:** Modify `lexer.ts` to recognize and tokenize these new elements.
2.  **AST Node Definition (`types.ts`):**
    *   **Action:** Define new AST node classes or interfaces in `types.ts` to represent the unique constructs of LucidScript, including nodes for representing constructs from other languages.
3.  **Parser Implementation (`parser.ts`):
    *   **Action:** Implement new parsing methods in `parser.ts` to handle the grammar rules for LucidScript features.
    *   **Action:** Integrate these new parsing methods into the existing `declaration()` and `statement()` logic, ensuring proper precedence and error handling.
    *   **Action:** Address mixed module systems: Develop logic to differentiate and parse both `import` (ESM) and `require` (CommonJS) statements within the same file, and represent them appropriately in the AST.
    *   **Action:** Implement universal parsing: Develop a mechanism to invoke external language parsers and integrate their ASTs into the unified LucidScript AST.
    *   **Action:** Consider error recovery: Implement or improve error recovery mechanisms to make the parser more "permissive" and robust when encountering unexpected syntax, as suggested by the project's theme.
4.  **Testing Framework:**
    *   **Action:** Identify or create a testing strategy for the parser. This will likely involve creating new test files (e.g., `lucidscript.test.ts`) with various LucidScript code snippets, including valid and invalid syntax, and asserting the correctness of the generated AST. This will also include tests for parsing code from other languages.

**Phase 3: Debugging Luciform Execution**

1.  **Understanding Luciform Mechanics:**
    *   **Action:** Analyze `execute_luciform.ts` (if it exists) or any other files related to how `.luciform` files are processed and applied.
    *   **Goal:** Understand the internal workflow of `npm run ritual <file.luciform>`.
2.  **Debugging Strategy:**
    *   **Action:** Propose methods for debugging `.luciform` execution, which may include:
        *   Adding logging statements within the `execute_luciform` process.
        *   Using Node.js debugger with breakpoints.
        *   Creating small, isolated `.luciform` files to test specific operations.
        *   Analyzing the `edits.json` or `file_edits.log` files if they capture the changes made by Luciform.
    *   **Goal:** Provide clear steps for the user to diagnose issues when a `.luciform` ritual does not behave as expected.

**Next Steps:**

I will now proceed with Phase 1, starting with a deep dive into the current `ts_parser` files.
