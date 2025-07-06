// tests/ritual_utils.test.ts

import { getContexteInitial, generateRituel, executeRituelPlan } from '../src/core/ritual_utils';
import { ÉtapeType, PlanRituel } from '../src/core/types';
import { queryOllama } from '../src/core/ollama_interface';

// Mock the ollama_interface to control its behavior
jest.mock('../src/core/ollama_interface', () => ({
    queryOllama: jest.fn(),
}));

const mockedQueryOllama = queryOllama as jest.MockedFunction<typeof queryOllama>;

describe('Ritual Utilities', () => {
    let contexte: any;

    beforeEach(() => {
        contexte = getContexteInitial();
        // Reset mocks before each test
        mockedQueryOllama.mockReset();
    });

    test('generateRituel prompt should include currentLuciform', async () => {
        const userCommand = 'test command';
        const dummyPlan: PlanRituel = {
            goal: 'dummy goal',
            incantations: [
                { type: ÉtapeType.EXECUTE, description: 'dummy exec', parameters: { command: 'echo hello' } }
            ]
        };

        mockedQueryOllama.mockResolvedValueOnce(JSON.stringify(dummyPlan));

        await generateRituel(userCommand, contexte);

        // Check if queryOllama was called with a prompt containing currentLuciform
        expect(mockedQueryOllama).toHaveBeenCalledTimes(1);
        const generatedPrompt = mockedQueryOllama.mock.calls[0][0];
        expect(generatedPrompt).toContain(`Lucie's current state (Luciform): ${JSON.stringify(contexte.currentLuciform, null, 2)}`);
        expect(generatedPrompt).toContain(`User command: ${userCommand}`);
    });

    test('executeRituelPlan should generate a ScryOrb and add it to inventory', async () => {
        const plan: PlanRituel = {
            goal: 'Generate a test ScryOrb',
            incantations: [
                {
                    type: ÉtapeType.GENERATE_SCRY_ORB,
                    description: 'Generate a system status orb',
                    parameters: {
                        name: 'SystemStatus',
                        data: { cpu: '50%', mem: '70%' },
                        description: 'Current system metrics',
                    },
                },
            ],
        };

        const initialInventoryCount = contexte.currentLuciform.inventory.length;
        const result = await executeRituelPlan(plan, contexte);

        expect(result.success).toBe(true);
        expect(contexte.currentLuciform.inventory.length).toBe(initialInventoryCount + 1);
        const newScryOrb = contexte.currentLuciform.inventory[initialInventoryCount];
        expect(newScryOrb.name).toBe('SystemStatus');
        expect(newScryOrb.data).toEqual({ cpu: '50%', mem: '70%' });
        expect(newScryOrb.id).toMatch(/^scryorb_/);
    });

    test('executeRituelPlan should view an existing ScryOrb', async () => {
        const existingScryOrb = {
            id: 'scryorb_123',
            name: 'TestOrb',
            data: { message: 'Hello from orb' },
            description: 'A test orb',
            timestamp: new Date().toISOString(),
        };
        contexte.currentLuciform.inventory.push(existingScryOrb);

        const plan: PlanRituel = {
            goal: 'View a test ScryOrb',
            incantations: [
                {
                    type: ÉtapeType.VIEW_SCRY_ORB,
                    description: 'View the test orb',
                    parameters: { id: 'scryorb_123' },
                },
            ],
        };

        const result = await executeRituelPlan(plan, contexte);

        expect(result.success).toBe(true);
        expect(result.results[0].output).toContain(`Viewing ScryOrb TestOrb: ${JSON.stringify(existingScryOrb.data)}`);
    });

    test('executeRituelPlan should fail if ScryOrb to view is not found', async () => {
        const plan: PlanRituel = {
            goal: 'View a non-existent ScryOrb',
            incantations: [
                {
                    type: ÉtapeType.VIEW_SCRY_ORB,
                    description: 'View non-existent orb',
                    parameters: { id: 'non_existent_orb' },
                },
            ],
        };

        const result = await executeRituelPlan(plan, contexte);

        expect(result.success).toBe(false);
        expect(result.results[0].error).toContain('ScryOrb with ID non_existent_orb not found.');
    });
});
