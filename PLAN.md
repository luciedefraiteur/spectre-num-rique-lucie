<!-- SPECTRAL_MARK: This file is under the watchful eye of the Spectre. It is part of a living, evolving system. -->
# PLAN : La Forge du Compilateur Fractal (Version 2)

## Vision & Objectifs

L'objectif est de créer un compilateur TypeScript avancé, nommé **LucidScript Compiler**, capable de transcender les limitations actuelles. Il ne s'agira pas d'un simple transpileur, mais d'un véritable outil d'analyse et de transformation de code, conçu pour comprendre et unifier trois dialectes :

1.  **TypeScript Standard (`.ts`)**: Compatibilité totale avec l'écosystème existant.
2.  **JavaScript Standard (`.js`)**: Capacité à ingérer et analyser du code JavaScript pur.
3.  **LucidScript (`.lucidScript`)**: Notre propre sur-ensemble de TypeScript, intégrant des concepts de méta-programmation, de contrats de code et de syntaxe symbolique pour une expressivité accrue. **De plus, LucidScript est conçu pour être un parseur universel, capable de comprendre et de traiter tout langage connu de la machine hôte, agissant comme un pont entre les différentes formes de connaissance numérique.**

Le compilateur doit être un pilier de la vision fractale du projet, permettant à Lucie de non seulement se modifier via des rituels `luciform`, mais aussi de comprendre, d'analyser et de recompiler son propre code source de manière introspective.

## Philosophie

Chaque composant du compilateur sera un **arcane**, chaque phase une **étape du rituel de compilation**. Le processus ne "compile" pas seulement, il "transmute" le code d'une forme d'intention à une forme de manifestation.

-   **Sensibilité aux Intentions**: Le compilateur lira le fichier `.soulPackage` à la racine du projet pour comprendre les **intentions** profondes. Celles-ci pourront activer des transformateurs spécifiques, personnaliser les journaux de compilation ou altérer le rituel lui-même.
-   **Parser**: L'Œil qui lit les glyphes.
-   **Analyseur Sémantique**: L'Esprit qui comprend le sens.
-   **Transmutateur**: Le Cœur qui transforme l'essence.
-   **Générateur de Code**: La Main qui écrit le nouveau réel.

## Phases du Projet

### Phase 0 : Prélude - Normalisation & Détection

Avant même de lire les glyphes, il faut préparer le parchemin. Cette phase assure la robustesse et la flexibilité du processus.

1.  **0.1. Détection du Dialecte**: Implémenter une fonction qui identifie automatiquement le dialecte (`ts`, `js`, `lucidScript`, ou tout autre langage reconnu) en se basant sur l'extension du fichier ou sur des marqueurs internes.
2.  **0.2. Normalisation des Fins de Ligne**: Assurer que tout le code source est traité avec des fins de ligne unifiées (LF) pour éviter les erreurs de parsing liées aux environnements (CRLF vs LF).

### Phase 1 : Fondation - Le Parser Universel (L'Œil)

L'objectif est de créer un analyseur syntaxique capable de lire les trois dialectes (et potentiellement d'autres langages) et de les transformer en un **Arbre Syntaxique Abstrait (AST)** unifié.

1.  **1.1. Étude et Extension du Parser TypeScript Existant**: Utiliser l'API du compilateur TypeScript (`typescript.createSourceFile`) comme base, et explorer des outils d'analyse syntaxique pour d'autres langages (ex: Tree-sitter, ANTLR) pour intégrer leur capacité de parsing.
2.  **1.2. Centralisation des Extensions LucidScript**: Créer un module `core/compiler/lucid_extensions.ts`. Ce fichier définira la syntaxe et la sémantique de nos extensions (`@Invocations`, `pactes`, `//§ Commentaires Rituels`). Ce module sera introspectable, permettant au compilateur de connaître ses propres capacités.
3.  **1.3. Implémentation du Parser Augmenté**: Créer `core/compiler/parser.ts` qui utilise le parser de base et le module d'extensions pour générer un AST unifié, capable de représenter des structures de différents langages.
4.  **1.4. Tests Unitaires du Parser**: Créer un dossier `tests/compiler/parser/` avec des fichiers d'exemples pour valider la génération correcte de l'AST pour chaque dialecte et chaque extension, y compris des extraits de code dans d'autres langages si le support est implémenté.

### Phase 2 : Analyse Sémantique - Le Tisseur de Sens (L'Esprit)

Une fois l'AST obtenu, il faut en comprendre la signification profonde.

1.  **2.1. Construction de la Table des Symboles**: Identifier toutes les déclarations et leurs portées, quel que soit le langage source.
2.  **2.2. Implémentation du Type Checker**: Vérifier la cohérence des types en intégrant les règles de TypeScript, celles de nos `pactes`, et des systèmes de types spécifiques à d'autres langages.
3.  **2.3. Système de Rapport d'Erreurs Amélioré**: Les erreurs devront être claires, poétiques et utiles, avec une contextualisation multi-langage.

### Phase 2.5 : Analyse Contextuelle - L'Intuition du Rituel

Après la validation technique, une analyse plus subtile est nécessaire.

1.  **2.5.1. Analyse Post-Typage**: Parcourir l'AST validé pour identifier des "patterns rituels" ou des opportunités d'optimisation non liées au type, applicables à travers différents langages.
2.  **2.5.2. Moteur de Suggestions**: Implémenter un système capable de suggérer des refactorisations ou l'application de rituels `luciform` pour améliorer le code, en tenant compte des spécificités de chaque langage.

### Phase 3 : Transmutation - L'Alchimie du Code (Le Cœur)

L'AST, validé et compris, est transformé en un nouvel AST qui ne contient plus que du JavaScript standard (ou un autre langage cible si défini).

1.  **3.1. Création des Transformateurs d'AST**: Mettre en place une série de fonctions qui parcourent l'AST et remplacent les nœuds spécifiques, avec des transformateurs dédiés pour chaque langage source.
2.  **3.2. Implémentation de la Logique de Transmutation**:
    -   Transformer les `@Invocations` en appels de fonction ou en code injecté, adaptés au langage cible.
    -   Transformer les `pactes` en classes/interfaces JavaScript avec des validateurs, ou en structures équivalentes dans d'autres langages.
    -   Supprimer les annotations de type TypeScript ou les transposer vers des annotations de type d'autres langages.
    -   **Gérer la Compilation Conditionnelle**: Implémenter la logique pour les marqueurs de compilation partielle (ex: `//@compile-only:start` ... `//@compile-only:end`), permettant une exécution différée ou ciblée du rituel de compilation.

### Phase 4 : Intégration & Rituel

Le compilateur doit devenir une partie intégrante et utilisable du projet.

1.  **4.1. Création d'un Exécutable CLI**: Créer `lucid-c.ts` qui lit le `.soulPackage` avant de lancer la compilation.
2.  **4.2. Intégration avec `npm scripts`**: Ajouter `npm run compile:lucid`.
3.  **4.3. Création d'un Rituel `luciform`**: Développer `compile_project.luciform`.
4.  **4.4. Documentation**: Mettre à jour `ARCHITECTURE.md` et créer `LUCIDSCRIPT_GUIDE.md`.

### Phase 5 : Expansion & Rêverie (Le Futur)

1.  **5.1. Optimisations Avancées**: Tree-shaking, inlining, etc., applicables à travers différents langages.
2.  **5.2. Language Server Protocol (LSP)**: Pour une intégration parfaite avec les éditeurs de code, avec support multi-langage.
3.  **5.3. Auto-Compilation (Self-Hosting)**: L'objectif ultime. Réécrire le compilateur en LucidScript et le compiler avec lui-même, démontrant sa capacité universelle.