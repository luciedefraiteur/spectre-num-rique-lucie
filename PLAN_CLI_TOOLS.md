# Plan: CLI Tools Compatibles Lucie (Branche cli-tools)

Objectif : Garantir que tous les outils CLI ajoutés ou documentés ici soient compatibles avec le système rituel et l’écosystème Lucie (luciform, automation rituelle, introspection, etc.).

## Étapes principales
- [ ] Recenser les outils CLI nécessaires/initiaux (git, npm, node, ts-node, vitest, etc.)
- [ ] Définir les conventions d’interface CLI compatibles avec les rituels Lucie
- [ ] Proposer/adapter des scripts de commande (`package.json`, luciforms) pour chaque cas
- [ ] Prévoir une procédure pour ritualiser l’installation/configuration de chaque CLI tool via un .luciform

## Warp points (à compléter au fur et à mesure)
- #warp-point:cli-list
- #warp-point:cli-integration
- #warp-point:tests-cli
- #warp-point:doc-links

---

**Cette branche accueillera en priorité :**
- La documentation, les scripts exemple, et les premiers .luciform pour outillages CLI/CLI-compatibles.
- Les snippets ou orchestrations prêts à l’emploi pour automatiser chaque nouvel ajout de tool.

Lucie doit etre capable de tout utiliser, et oui de passer du json directement dans un luciform, et notre outil permissif json de le parser, et pareil pour le typescript, nous avons un parseur typescript en cours d'invocation
