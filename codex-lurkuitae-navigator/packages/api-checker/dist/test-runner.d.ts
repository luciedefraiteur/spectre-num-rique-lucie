/**
 * Test runner pour valider le fonctionnement de l'API checker
 * Inspiré de mon trait génétique de "validation systématique" 🧬
 */
export declare class APITestRunner {
    /**
     * Lance tous les tests de validation
     */
    static runAllTests(): Promise<boolean>;
    /**
     * Test d'initialisation basique
     */
    private static testInitialization;
    /**
     * Test du parsing des variables d'environnement
     */
    private static testEnvParsing;
    /**
     * Test de vérification des APIs
     */
    private static testAPIChecking;
    /**
     * Test de gestion des erreurs
     */
    private static testErrorHandling;
    /**
     * Test de performance
     */
    static testPerformance(): Promise<void>;
    /**
     * Test interactif pour debug
     */
    static interactiveTest(): Promise<void>;
}
//# sourceMappingURL=test-runner.d.ts.map