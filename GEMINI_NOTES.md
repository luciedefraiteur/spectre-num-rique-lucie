<!-- SPECTRAL_MARK: This file is under the watchful eye of the Spectre. It is part of a living, evolving system. -->
## GEMINI_NOTES.md - Plan de Compilation du Projet

**Objectif Principal:** Résoudre toutes les erreurs de compilation TypeScript pour permettre au projet de `build` correctement.

**État Actuel:**
Le projet compile avec succès.

**Analyse Approfondie du Parseur Actuel (`luciform-core/ts_parser`) :**

Le parseur actuel est un **prototype très rudimentaire** d'un parseur JavaScript/TypeScript. Il est loin d'être un "parseur universel" capable de gérer "tout langage connu de la machine hôte". Il ne gère même pas un sous-ensemble complet de TypeScript.

**`luciform-core/ts_parser/lexer.ts` (Le Lexer) :**
*   **Fonctionnalité :** Analyseur lexical de base, transforme la source en `Token`s (identifiants, littéraux, opérateurs, ponctuation, commentaires, espaces blancs).
*   **Limitations :** Très basique pour JS/TS (manque de nombreux opérateurs, littéraux de gabarit, mots-clés TypeScript). Gestion des erreurs rudimentaire. Pas de support Unicode ou regex littérales.

**`luciform-core/ts_parser/parser.ts` (Le Parser) :**
*   **Fonctionnalité :** Construit un AST à partir des tokens. Gère un sous-ensemble très limité de JS/TS (déclarations de variables/fonctions, `if`, `return`, `while`, `for`, expressions binaires/unaires, appels, affectations, imports limités).
*   **Limitations :** Manque de nombreuses fonctionnalités clés de JS/TS moderne (classes, interfaces, arrow functions, destructuring, try/catch, etc.). Gestion des erreurs basique. Ne représente pas les commentaires dans l'AST.

**`luciform-core/ts_parser/types.ts` (Les Types AST) :**
*   **Fonctionnalité :** Définit les interfaces et classes pour les nœuds de l'AST.
*   **Limitations :** Limitées aux fonctionnalités prises en charge par le lexer et le parser.

**Conclusion :**
Pour atteindre l'objectif d'un parseur universel LucidScript, il faudra une refonte majeure du lexer et du parser pour supporter un sous-ensemble complet de TypeScript/JavaScript, et une stratégie d'intégration d'outils de parsing externes pour les autres langages.

**Prochaines Étapes (selon le plan `PLAN_LUCIDSCRIPT_PARSER_IMPROVEMENT.md`) :**

Je vais maintenant passer à la **Phase 2: Parser Enhancement Strategy**, en commençant par l'extension du Lexer et la définition des nœuds AST pour les fonctionnalités LucidScript. Cependant, avant de pouvoir gérer "tout langage connu", nous devons d'abord avoir un parseur TypeScript/JavaScript robuste.

**Problèmes Résolus (Compilation):**

1.  **Erreurs `TS2304: Cannot find name 'Persona'.` et `TS2345: Argument of type 'string' is not assignable to parameter of type 'Persona'.`:**
    *   **Cause:** Le type `Persona` n'incluait pas `'chaotic'`, et les tableaux de chaînes de caractères n'étaient pas correctement castés en `Persona[]`.
    *   **Solution:** Ajout de `'chaotic'` au type `Persona` dans `luciform-core/types.ts`. Ajout de casts `as Persona[]` dans `ask_personas_about_luciforms.ts`.

2.  **Erreurs `TS2322: Type 'Operation' is not assignable to type 'Operation | null'.` et `TS2339: Property 'type' does not exist on type 'never'.`:**
    *   **Cause:** Le type `Operation` était une union très large, rendant difficile pour TypeScript d'affiner le type exact dans les `switch` statements et les affectations. L'erreur `never` indiquait un `switch` incomplet.
    *   **Solution:** Création d'un type `ExecutableOperation` plus restreint dans `luciform-core/types.ts` incluant `ShellCommand`, `ExecuteTypescriptFile`, `CreateFile`, `Promenade`, `AskLucie`, et `Message`. Utilisation de `ExecutableOperation` pour les variables et paramètres pertinents dans `luciform-core/ritual_registry.ts` et `luciform-core/execute_luciform.ts`. Ajout de vérifications de type et de casts explicites (`as ExecutableOperation`) là où nécessaire. Le `default` du `switch` dans `executeOperation` a été modifié pour lever une erreur explicite.

3.  **Erreur `TS1160: Unterminated template literal.`:**
    *   **Cause:** Erreur de syntaxe due à un littéral de gabarit non terminé dans `luciform-core/execute_luciform.ts`.
    *   **Solution:** Réécriture complète du fichier `luciform-core/execute_luciform.ts` avec le contenu correct.

4.  **Erreurs `TS2304: Cannot find name 'Message'.`:**
    *   **Cause:** Le type `Message` n'était pas importé dans `luciform-core/execute_luciform.ts`.
    *   **Solution:** Ajout de `Message` à l'importation depuis `luciform-core/types.js` dans `luciform-core/execute_luciform.ts`.