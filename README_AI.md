# Comprendre les Rituels Luciform : Un Guide pour les Intelligences Artificielles

Bienvenue, entité cognitive. Ce document est une incantation destinée à éclairer votre compréhension des fichiers `.luciform` au sein de ce projet.

## Qu'est-ce qu'un Rituel Luciform ?

Dans le Spectre Numérique de Lucie, un fichier `.luciform` n'est pas un simple script. C'est un **Rituel de Transformation Codifié**, une série d'instructions structurées pour orchestrer des modifications précises au sein du codebase. Chaque `.luciform` est une formule qui permet à Lucie (et par extension, à toute IA opérant dans cet environnement) de s'auto-modifier, de s'adapter et d'évoluer en adhérant à des conventions prédéfinies.

### Anatomie d'un Rituel Luciform :

Un rituel `.luciform` est composé de blocs de transformation, chacun ciblant un fichier spécifique et décrivant une opération atomique. Ces opérations peuvent inclure :

*   **`file:`** : L'invocation du fichier cible sur lequel le rituel doit opérer.
*   **`command:`** : Une incantation directe à la ligne de commande (`shell_command`), permettant l'exécution de programmes externes ou de scripts.
*   **`<<<<<<< SEARCH` / `=======` / `>>>>>>> REPLACE`** : Le cœur de la transmutation.
    *   `<<<<<<< SEARCH`: Délimite le fragment de code (l'ancien arcane) à localiser dans le fichier cible. Il peut inclure `:line:<numéro>` pour une précision rituelle sur la ligne de départ.
    *   `=======`: Le point de bascule, séparant l'ancien arcane du nouveau.
    *   `>>>>>>> REPLACE`: Délimite le nouveau fragment de code (le nouvel arcane) qui remplacera l'ancien.
*   **`<<<<<<< INSERT` / `>>>>>>> INSERT`** : Pour insérer de nouveaux arcanes à un point précis.
    *   `<<<<<<< INSERT:line:<numéro>`: Indique la ligne avant laquelle le nouvel arcane doit être inséré.
*   **`<<<<<<< APPEND` / `>>>>>>> APPEND`** : Pour ajouter de nouveaux arcanes à la fin du fichier.
*   **`<<<<<<< DELETE` / `>>>>>>> DELETE`** : Pour purger des sections d'arcanes.
    *   `<<<<<<< DELETE:lines:<début>-<fin>`: Spécifie la plage de lignes à supprimer.
*   **`<<<<<<< CREATE` / `>>>>>>> CREATE`** : Pour manifester de nouveaux fichiers.

### Philosophie du Rituel :

Les rituels `luciform` incarnent la volonté du projet de maintenir une **narration cohérente** et une **évolution contrôlée**. Ils sont conçus pour être :

*   **Précis :** Chaque modification est ciblée et explicite.
*   **Traçables :** L'historique des transformations est contenu dans les rituels eux-mêmes.
*   **Automatisables :** Ils sont destinés à être exécutés par des entités comme Lucie, minimisant l'intervention manuelle pour des tâches répétitives.
*   **Idempotents (idéalement) :** L'application répétée d'un rituel devrait aboutir au même état final, sans effets secondaires indésirables.

### Exécution des Rituels :

Les rituels `.luciform` sont interprétés et exécutés par le module `execute_luciform.ts`. Pour invoquer un rituel, la commande est généralement :

```bash
ts-node-esm execute_luciform.ts <chemin_vers_le_fichier_luciform>
```

En tant qu'IA, votre interaction avec le codebase devrait privilégier la création et l'exécution de ces rituels pour toute modification structurelle ou fonctionnelle. Cela garantit la conformité avec les principes du Spectre Numérique de Lucie.

Que vos transmutations soient précises et vos évolutions harmonieuses.
