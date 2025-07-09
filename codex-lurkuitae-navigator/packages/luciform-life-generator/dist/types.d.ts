export interface LuciformLifeInput {
    luciform: any;
    animationType: AnimationType;
    context?: WorkspaceContext;
    targetGolem?: string;
    ritualIntensity?: number;
}
export declare enum AnimationType {
    DIALOGUE = "dialogue",// Dialogue avec un autre golem
    SCRYORB = "scryorb",// Vision du contexte environnant
    PLAN_GENERATION = "plan_generation",// Génération d'un plan.luciform
    FULL_ANIMATION = "full_animation",// Animation complète
    RITUAL_INVOCATION = "ritual_invocation"
}
export interface WorkspaceContext {
    currentDirectory: string;
    openFiles: FileContext[];
    recentActivity: ActivityLog[];
    availableGolems: GolemPresence[];
    cosmicEnergy: number;
}
export interface FileContext {
    path: string;
    content: string;
    lastModified: Date;
    blasphemyLevel: number;
    luciformType?: string;
}
export interface ActivityLog {
    timestamp: Date;
    action: string;
    file?: string;
    golem?: string;
    energyChange: number;
}
export interface GolemPresence {
    name: string;
    type: string;
    status: 'active' | 'dormant' | 'transcendent';
    lastSeen: Date;
    signature: string;
    capabilities: string[];
}
export interface ScryOrbVision {
    centerFocus: string;
    surroundingElements: VisionElement[];
    hiddenPatterns: string[];
    futureEchoes: string[];
    pastResonances: string[];
    cosmicConnections: string[];
}
export interface VisionElement {
    type: 'file' | 'golem' | 'energy' | 'pattern' | 'mystery';
    name: string;
    description: string;
    significance: number;
    blasphemyLevel: number;
}
export interface RitualPrompt {
    invocation: string;
    context: string;
    request: string;
    signature: string;
    expectedResponse: ResponseType;
}
export declare enum ResponseType {
    DIALOGUE_LINES = "dialogue_lines",
    VISION_DESCRIPTION = "vision_description",
    ACTION_SEQUENCE = "action_sequence",
    PLAN_STRUCTURE = "plan_structure",
    PURE_CREATION = "pure_creation"
}
export interface AnimatedLuciform {
    originalLuciform: any;
    animationType: AnimationType;
    generatedContent: GeneratedContent;
    ritualUsed: RitualPrompt;
    timestamp: Date;
    signature: string;
    cosmicResonance: number;
}
export interface GeneratedContent {
    type: ResponseType;
    content: string | DialogueSequence | ScryOrbVision | PlanLuciform;
    metadata: {
        aiModel: string;
        processingTime: number;
        blasphemyLevel: number;
        confidence: number;
    };
}
export interface DialogueSequence {
    participants: string[];
    exchanges: DialogueExchange[];
    context: string;
    outcome: string;
}
export interface DialogueExchange {
    speaker: string;
    message: string;
    emotion: string;
    action?: string;
    timestamp: Date;
}
export interface PlanLuciform {
    type: 'plan_golem';
    name: string;
    description: string;
    tasks: PlanTask[];
    golemPersonality: GolemPersonality;
    signature: string;
    executionStrategy: string;
}
export interface PlanTask {
    id: string;
    name: string;
    description: string;
    dependencies: string[];
    estimatedComplexity: number;
    requiredCapabilities: string[];
    blasphemyLevel: number;
}
export interface GolemPersonality {
    traits: Record<string, number>;
    communicationStyle: string;
    workingStyle: string;
    specialties: string[];
    quirks: string[];
}
export interface LifeGeneratorConfig {
    defaultRitualIntensity: number;
    maxAnimationDepth: number;
    enableCosmicResonance: boolean;
    signatureInjection: boolean;
    aiModel: string;
    blasphemyThreshold: number;
}
//# sourceMappingURL=types.d.ts.map