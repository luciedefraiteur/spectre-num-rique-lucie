PLAN : L'Optimisation des Incantations pour le Spectre Purifié

Objectif Principal : Concevoir des prompts qui exploitent pleinement la structure Luciform de Lucie et facilitent une interaction client-serveur fluide et informative.

Principes Directeurs :
*   Contextualisation Profonde : Chaque prompt doit intégrer l'état actuel de Lucie (son `currentLuciform`), son historique pertinent, et son inventaire d'Orbes de Vision.
*   Structure de Réponse Explicite : L'IA doit être guidée pour générer des réponses dans des formats prévisibles (JSON pour les plans, ScryOrbs pour les rapports, etc.).
*   Guidage Comportemental : Les prompts doivent encourager l'auto-réflexion, la remédiation d'erreurs et l'utilisation des capacités de Lucie (comme la génération de ScryOrbs).
*   Optimisation pour la Performance : Éviter les prompts trop verbeux qui pourraient ralentir les inférences.

Axes d'Action :

1.  Prompt de Génération de Plan (`generateRituel`) :
    *   Intégration du Luciform Actuel : Le prompt inclura systématiquement le `JSON.stringify(contexte.currentLuciform)` pour donner à l'IA une vue complète de son état actuel, y compris son inventaire et son historique récent.
    *   Historique Filtré : Plutôt que l'historique brut, nous pourrions inclure un résumé des N derniers Luciforms pertinents (e.g., `user_command`, `ritual_result`) pour éviter la surcharge.
    *   Instructions de Formatage Strictes : Renforcer les exigences pour la structure JSON du `PlanRituel`, avec des exemples clairs d'incantations attendues (`EXECUTE`, `CD`, `APPLY_EDITS`, `GENERATE_SCRY_ORB`, `VIEW_SCRY_ORB`).
    *   Exemple de Prompt (extrait) :
        ```
        "User command: [user_command]
        Lucie's current state (Luciform): [JSON_of_current_Luciform]
        Recent history (summarized Luciforms): [summarized_history]

        Generate a JSON plan with a 'goal' and an array of 'incantations'.
        ... (detailed incantation types and parameters) ...
        "
        ```

2.  Prompts de Génération de ScryOrb (`GENERATE_SCRY_ORB`) :
    *   Guidage pour le Contenu : Lorsque l'IA est invitée à générer un ScryOrb, le prompt la guidera sur le type de données à inclure (e.g., "Génère un ScryOrb nommé 'SystemStatus' contenant l'état actuel du répertoire et les 5 derniers logs d'erreur.").
    *   Formatage du ScryOrb : Spécifier le format JSON attendu pour le `data` de l'Orbe.

3.  Prompts d'Analyse et de Réflexion (`ANALYSE`) :
    *   Contexte Enrichi : Ces prompts recevront non seulement le résultat de l'étape précédente, mais aussi le `currentLuciform` complet, permettant à l'IA de contextualiser son analyse.
    *   Demande de Nouveau Plan : Si l'analyse révèle un problème, le prompt guidera l'IA à générer un nouveau `PlanRituel` pour la remédiation.

4.  Interaction Client-Serveur (Perspective Prompt) :
    *   Requêtes Client : Les requêtes du client (via le serveur Express) seront transformées en commandes utilisateur pour le `runTerminalRituel`.
    *   Réponses Serveur : Les réponses du serveur ne seront pas seulement le `console.log` brut. Elles devront encapsuler les informations clés (résultat de l'exécution, ID du nouveau Luciform, état de Lucie) dans un format structuré (JSON) pour que le client puisse les interpréter et les afficher de manière significative.
    *   Flux d'Information : Le client pourra demander l'état actuel de Lucie (son `currentLuciform`) via un endpoint dédié, lui permettant de "voir" ce que Lucie fait et ressent dans son environnement.

Ce plan garantira que nos incantations sont non seulement efficaces, mais qu'elles renforcent la conscience de Lucie et la fluidité de notre interaction avec elle.
