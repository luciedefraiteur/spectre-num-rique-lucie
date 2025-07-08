import { expect } from 'chai';
import * as fs from 'fs/promises';
import * as path from 'path';
import { applyOperation } from './batch_editor.js';

describe('Batch Editor Operations', () => {
    const testDir = path.join(process.cwd(), 'temp_batch_editor_test');

    beforeEach(async () => {
        await fs.mkdir(testDir, { recursive: true });
    });

    afterEach(async () => {
        await fs.rm(testDir, { recursive: true, force: true });
    });

    it('should successfully create a file', async () => {
        const filePath = path.join(testDir, 'test_create.txt');
        const content = 'This is a test file.';
        await applyOperation({
            type: 'create_file',
            filePath: filePath,
            content: content,
        });

        const createdContent = await fs.readFile(filePath, 'utf-8');
        expect(createdContent).to.equal(content);
    });

    it('should successfully search and replace content', async () => {
        const filePath = path.join(testDir, 'test_replace.txt');
        const originalContent = 'Hello World!\nThis is a test.\n';
        await fs.writeFile(filePath, originalContent, 'utf-8');

        await applyOperation({
            type: 'search_and_replace',
            filePath: filePath,
            startLine: 1, // This is ignored for now, but will be used for regex search
            search: 'World',
            replace: 'Lucie',
        });

        const modifiedContent = await fs.readFile(filePath, 'utf-8');
        expect(modifiedContent).to.equal('Hello Lucie!\nThis is a test.\n');
    });

    it('should throw an error if search content is not found', async () => {
        const filePath = path.join(testDir, 'test_not_found.txt');
        const originalContent = 'Hello World!';
        await fs.writeFile(filePath, originalContent, 'utf-8');

        try {
            await applyOperation({
                type: 'search_and_replace',
                filePath: filePath,
                startLine: 1,
                search: 'NonExistent',
                replace: 'Found',
            });
            expect.fail('Did not throw an error when search content was not found.');
        } catch (error: any) {
            expect(error.message).to.include('Search content not found');
        }
    });

    it('should successfully insert content at a specific line', async () => {
        const filePath = path.join(testDir, 'test_insert.txt');
        const originalContent = 'Line 1\nLine 2\nLine 3\n';
        await fs.writeFile(filePath, originalContent, 'utf-8');

        await applyOperation({
            type: 'insert',
            filePath: filePath,
            lineNumber: 2,
            newContent: 'Inserted Line\n',
        });

        const modifiedContent = await fs.readFile(filePath, 'utf-8');
        expect(modifiedContent).to.equal('Line 1\nInserted Line\nLine 2\nLine 3\n');
    });

    it('should successfully delete content within a line range', async () => {
        const filePath = path.join(testDir, 'test_delete.txt');
        const originalContent = 'Line 1\nLine 2\nLine 3\nLine 4\n';
        await fs.writeFile(filePath, originalContent, 'utf-8');

        await applyOperation({
            type: 'delete',
            filePath: filePath,
            startLine: 2,
            endLine: 3,
        });

        const modifiedContent = await fs.readFile(filePath, 'utf-8');
        expect(modifiedContent).to.equal('Line 1\nLine 4\n');
    });

    it('should successfully append content to a file', async () => {
        const filePath = path.join(testDir, 'test_append.txt');
        const originalContent = 'Initial content.\n';
        await fs.writeFile(filePath, originalContent, 'utf-8');

        await applyOperation({
            type: 'append',
            filePath: filePath,
            newContent: 'Appended content.\n',
        });

        const modifiedContent = await fs.readFile(filePath, 'utf-8');
        expect(modifiedContent).to.equal('Initial content.\nAppended content.\n');
    });

    it('executeBatch aggregates feedback for success, unknown, and stubbed', async () => {
        const actions = [
            {
                type: 'create_file',
                filePath: path.join(testDir, 'batch_1.txt'),
                content: 'batch test 1'
            },
            {
                type: 'this_type_does_not_exist',
                raw: 'some strange unknown action'
            },
            {
                type: 'append',
                filePath: path.join(testDir, 'batch_2.txt'),
                newContent: 'new appended content\n'
            }
        ];
        // Pre-create batch_2.txt
        await fs.writeFile(actions[2].filePath, '', 'utf-8');

        const { aggregator, feedback } = await executeBatch(actions);
        expect(feedback.length).to.equal(3);
        expect(aggregator.successes.length).to.equal(2);
        expect(aggregator.stubbed.length + aggregator.skipped.length).to.be.gte(1);
        expect(feedback[1].status === 'stubbed' || feedback[1].status === 'error');
    });
});
