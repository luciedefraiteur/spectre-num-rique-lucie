export * from './types.js';
export * from './env-parser.js';
export * from './api-health-checker.js';
import { APICheckResult, HealthCheckOptions } from './types.js';
/**
 * Classe principale pour vérifier les APIs disponibles
 * Interface simplifiée inspirée de LLMInterface
 */
export declare class APIChecker {
    private static parser;
    /**
     * Initialise le checker avec un fichier .env optionnel
     */
    static initialize(envPath?: string): void;
    /**
     * Vérifie toutes les APIs configurées
     */
    static checkAll(options?: HealthCheckOptions): Promise<APICheckResult>;
    /**
     * Trouve la meilleure API disponible
     */
    static getBestAPI(): Promise<string | null>;
    /**
     * Vérifie si au moins une API est disponible
     */
    static hasWorkingAPI(): Promise<boolean>;
    /**
     * Affiche un rapport détaillé
     */
    static displayReport(verbose?: boolean): Promise<void>;
    /**
     * Debug: affiche les variables d'environnement détectées
     */
    static debugEnv(): void;
}
export default APIChecker;
//# sourceMappingURL=index.d.ts.map