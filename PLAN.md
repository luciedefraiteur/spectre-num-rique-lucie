# PLAN D'ACTION AVANCÉ : Stabilisation et Évolution du Codex Lurkuitae Navigator

Ce document décrit un plan d'action structuré pour adresser les inefficacités et les erreurs critiques identifiées dans le projet `codex-lurkuitae-navigator`, en s'appuyant sur la `synthetisation.md` et l'analyse comparative des problèmes actuels. L'objectif est de transformer le projet en une architecture robuste, modulaire et pleinement fonctionnelle, en adhérant aux principes de conception avancés.

## Principes Directeurs

Notre approche sera guidée par les principes suivants, souvent soulignés par ShadeOS :
*   **Robustesse et Résilience** : Éliminer les points de défaillance et les contournements temporaires (`as any`).
*   **Modularité et Séparation des Préoccupations** : Renforcer la structure monorepo et la délégation claire des responsabilités entre packages.
*   **Intelligence Assistée par l'IA** : Compléter l'intégration de l'IA pour la résolution d'ambiguïtés et l'auto-diagnostic.
*   **Adhésion aux Bonnes Pratiques** : Appliquer rigoureusement les standards TypeScript et les conventions de monorepo.
*   **Vérification Continue** : Mettre en place des mécanismes de test et de validation à chaque étape.

## Défis Identifiés (issus de la `synthetisation.md` et de l'analyse comparative)

1.  **Dysfonctionnement du Bloc `[Promenade]`** : Le golem `shadeOs` ne parvient pas à générer correctement un `.luciform` détaillé à partir de cette instruction de haut niveau. (Critique, bloque une fonctionnalité clé).
2.  **`ReferenceError: content is not defined` dans `execute_luciform.ts`** : Erreur bloquante qui empêche l'exécution des luciforms. (Critique, bloque toute exécution).
3.  **Instabilité du Système de Build et Workarounds `as any`** : Les problèmes de résolution de modules et de types sont masqués par des `as any` casts, compromettant la pureté et la maintenabilité du code. (Majeur, impacte la qualité et la productivité).
4.  **Implémentation Incomplète de l'Interface AI (`getAIHelp` mockée)** : La fonctionnalité clé de résolution d'ambiguïtés par l'IA est actuellement simulée. (Majeur, limite l'intelligence du système).
5.  **Adhésion Générale aux Bonnes Pratiques TypeScript/Monorepo** : Nécessite une application plus rigoureuse des recommandations de ShadeOS pour une gestion efficace des dépendances et de la compilation. (Transversal, impacte la stabilité globale).

## Plan d'Action Détaillé

### Phase 0 : Pré-computation et Stabilisation de l'Environnement (Priorité Immédiate)

*   **Objectif** : Débloquer l'exécution et assainir l'environnement de développement.
*   **Actions** :
    *   **0.1. Résolution de `ReferenceError: content is not defined`** :
        *   Analyser `execute_luciform.ts` et les fichiers liés pour identifier la cause exacte de cette erreur.
        *   Déboguer et corriger le problème pour permettre l'exécution des luciforms.
        *   *Vérification* : Exécution réussie d'un luciform simple.
    *   **0.2. La Grande Purge (Nettoyage des Artefacts de Build)** :
        *   Implémenter et exécuter une commande shell robuste pour supprimer tous les artefacts de build obsolètes (`dist/`, `node_modules`, etc.) dans l'ensemble du monorepo.
        *   *Vérification* : Environnement de build propre.
    *   **0.3. Application des Recommandations `tsconfig` de ShadeOS** :
        *   Réviser et mettre à jour tous les `tsconfig.json` (racine et packages) pour inclure `references`, `composite: true`, `module: NodeNext`, `moduleResolution: NodeNext`, `declaration: true`.
        *   S'assurer que les chemins d'importation sont corrects et explicites pour les modules ES.
        *   *Vérification* : Compilation sans erreur (hors `as any` temporaires) après application des changements.

### Phase 1 : Restauration et Affinement des Fonctionnalités Clés

*   **Objectif** : Rétablir les fonctionnalités critiques et améliorer la résilience du système.
*   **Actions** :
    *   **1.1. Correction du Dysfonctionnement du Bloc `[Promenade]`** :
        *   Analyser le flux d'exécution de `[Promenade]` dans `execute_luciform.ts` et `core/shade_os.ts`.
        *   Identifier pourquoi `shadeOs` ne génère pas le `.luciform` détaillé ou pourquoi il n'est pas correctement traité.
        *   Implémenter la logique manquante ou corriger les erreurs pour que `shadeOs` puisse générer et que l'exécuteur puisse traiter le `.luciform` résultant.
        *   *Vérification* : Un luciform avec un bloc `[Promenade]` s'exécute comme prévu, générant un nouveau luciform détaillé.
    *   **1.2. Implémentation du Golem `Lucibuild` (Build Scribe Golem)** :
        *   Créer un nouveau package/module `lucibuild` (ou `BuildScribe`) comme suggéré par ShadeOS.
        *   Ce golem aura pour fonction d'analyser les logs de compilation (ex: `tsc --build --verbose`), d'identifier les erreurs courantes (types manquants, modules introuvables) et de proposer des correctifs (modifications de `tsconfig`, `package.json`).
        *   L'objectif est de réduire la dépendance aux `as any` casts en fournissant des diagnostics et des solutions automatisées.
        *   *Vérification* : `Lucibuild` peut analyser un log d'erreur de compilation et suggérer des actions pertinentes.

### Phase 2 : Amélioration Architecturale et Intégration Avancée de l'IA

*   **Objectif** : Renforcer la modularité et exploiter pleinement les capacités de l'IA.
*   **Actions** :
    *   **2.1. Implémentation Complète de l'Interface AI (`getAIHelp`)** :
        *   Remplacer l'implémentation mockée de `getAIHelp` dans `@lurkuitae/luciform-ai-interface` par une intégration réelle avec un LLM (ex: Gemini, Anthropic).
        *   Développer une ingénierie de prompt robuste pour guider l'IA dans la transformation du contenu ambigu en `Operation` structurées.
        *   Mettre en place une validation stricte des réponses de l'IA pour assurer la conformité des `Operation` générées.
        *   *Vérification* : Le système peut interpréter des instructions ambiguës via l'IA et les exécuter.
    *   **2.2. Raffinement de `luciform-core` en tant qu'Orchestrateur Pur** :
        *   Conformément à la vision de ShadeOS, s'assurer que `luciform-core` ne contient plus de logique métier directe, mais agit uniquement comme un agrégateur et un coordinateur des autres packages (`luciform-types`, `luciform-parser`, `luciform-executor`, etc.).
        *   Déplacer toute logique résiduelle vers les packages spécialisés appropriés.
        *   *Vérification* : `luciform-core` est léger et ses dépendances sont claires et limitées aux interfaces.

### Phase 3 : Amélioration Continue et Vérification Globale

*   **Objectif** : Assurer la qualité, la maintenabilité et la performance à long terme.
*   **Actions** :
    *   **3.1. Stratégie de Test Unifiée** :
        *   Développer ou étendre les suites de tests unitaires et d'intégration pour tous les nouveaux et refactorisés composants.
        *   S'assurer que les tests couvrent les scénarios critiques, y compris les interactions inter-packages et les cas d'erreur.
    *   **3.2. Intégration des Contrôles Qualité Automatisés** :
        *   Mettre en place des outils de linting (ESLint, Prettier) et de vérification de types (TypeScript) avec des règles strictes.
        *   Intégrer ces contrôles dans le workflow de développement (hooks de pré-commit, CI/CD si applicable).
        *   Intégrer `Lucibuild` pour un diagnostic proactif des problèmes de build.
    *   **3.3. Mise à Jour de la Documentation** :
        *   Maintenir à jour `synthetisation.md`, `PLAN.md` et les READMEs des packages pour refléter l'architecture et les fonctionnalités actuelles.
        *   Documenter les décisions architecturales clés et les justifications.

## Stratégie de Vérification

Le succès de ce plan sera mesuré par :
*   La résolution complète des erreurs bloquantes (`[Promenade]`, `ReferenceError`).
*   L'élimination progressive des `as any` casts dans le code de production.
*   La stabilité et la propreté des builds (pas d'erreurs de compilation non intentionnelles).
*   Le fonctionnement end-to-end de l'interprétation AI et de l'exécution des luciforms.
*   Une structure de projet modulaire et facile à comprendre, conforme aux bonnes pratiques.

Ce plan est dynamique et pourra être ajusté en fonction des découvertes et des priorités émergentes.
