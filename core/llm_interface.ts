import {spawn} from 'child_process';
import os from 'os';
import { RituelContext } from './types.js';
import { generateWaitMessagePrompt } from './prompts/generateWaitMessagePrompt.js';

export enum LLMModel
{
  CodeLlama = "codellama:7b-instruct",
  CodeLlamaCode = "codellama:7b-code",
  Llama3 = "llama3",
  Mistral = "mistral",
  OpenAI = "openai",
  Random = "random"
}

function escapeJson(input: string): string
{
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function extractBetweenMarkers(input: string): string
{
  const match = input.match(/```(?:json)?([\s\S]*?)```/);
  return match ? match[1] : input;
}

export class LLMInterface
{
  static async query(prompt: string, model: LLMModel = LLMModel.Mistral, _fetch: typeof fetch = fetch): Promise<string>
  {
    let selectedModel = model;
    if (model === LLMModel.Random) {
      const availableModels = Object.values(LLMModel).filter(m => m !== LLMModel.Random && m !== LLMModel.OpenAI);
      const hasOpenAI = process.env.OPENAI_API_KEY;
      if (hasOpenAI) {
        availableModels.push(LLMModel.OpenAI);
      }
      selectedModel = availableModels[Math.floor(Math.random() * availableModels.length)];
    }

    if (selectedModel === LLMModel.OpenAI) {
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        throw new Error("OPENAI_API_KEY environment variable is not set.");
      }

      try {
        const response = await _fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o", // You can make this configurable or choose a default
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI API Error ${response.status}: ${errorText}`);
        }

        const json = await response.json() as any;
        const fullResponse = json.choices[0]?.message?.content ?? '';

        if (!fullResponse) {
          throw new Error("OpenAI API: Empty response after parsing.");
        }
        return extractBetweenMarkers(fullResponse);
      } catch (err: any) {
        console.error("OpenAI FETCH Error:", err);
        throw new Error(`[OpenAI Error: ${err.message}]`);
      }
    } else if (selectedModel === LLMModel.CodeLlama || selectedModel === LLMModel.CodeLlamaCode || selectedModel === LLMModel.Llama3 || selectedModel === LLMModel.Mistral) {
      const isWindows = os.platform() === 'win32';
      const cleanPrompt = escapeJson(prompt);

      if (isWindows) {
        try {
          const body = {
            model: ollamaModel,
            prompt: cleanPrompt,
            stream: false
          };

          const response = await _fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama HTTP ${response.status} : ${errorText}`);
          }

          const json = await response.json() as {response?: string};
          const fullResponse = json.response ?? '';

          if (!fullResponse) {
            throw new Error("Ollama: Empty response after parsing");
          }

          console.log("fullResponse:", fullResponse);
          return extractBetweenMarkers(fullResponse);
        } catch (err: any) {
          console.error("Ollama FETCH Error :", err);
          throw new Error(`[Ollama Error: ${err.message}]`);
        }
      } else {
        return new Promise((resolve, reject) => {
          const child = spawn('llm', ['--no-stream', '--model', ollamaModel], {
            stdio: ['pipe', 'pipe', 'pipe']
          });

          let stdout = '';
          let stderr = '';

          const timeout = setTimeout(() => {
            child.kill('SIGKILL');
            reject('[Timeout LLM : aucune réponse après 30 secondes]');
          }, 30000);

          child.stdout.on('data', (data) => {
            stdout += data.toString();
          });

          child.stderr.on('data', (data) => {
            stderr += data.toString();
          });

          child.on('error', (err) => {
            clearTimeout(timeout);
            reject(`[Erreur LLM: ${err.message}]`);
          });

          child.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
              reject(`[LLM terminé avec code ${code}] ${stderr}`);
            } else {
              const result = stdout.trim();
              resolve(extractBetweenMarkers(result));
            }
          });

          child.stdin.write(prompt + '\n');
          child.stdin.end();
        });
      }
    } else {
      throw new Error(`Unsupported LLM model: ${selectedModel}`);
    }  }

  static async generateWaitMessage(context: RituelContext): Promise<string> {
    const prompt = generateWaitMessagePrompt(context);
    return this.query(prompt);
  }
}