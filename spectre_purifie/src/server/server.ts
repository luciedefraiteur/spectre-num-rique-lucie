import express from 'express';
import {getLucieSpectrum} from '../core/lucie_spectrum';
import {readFileSync} from 'fs';
import path from 'path';
import {RituelContext} from '../core/types';
import * as dotenv from 'dotenv';

dotenv.config({path: path.resolve(__dirname, '..', '.env')});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let currentRituelContext: RituelContext; // To hold the latest context
let clients: {id: number; response: express.Response;}[] = [];
let clientId = 0;

// Function to broadcast events to all connected clients
export function broadcastEvent(data: any)
{
    clients.forEach(client => client.response.write(`data: ${ JSON.stringify(data) }\n\n`));
}

// Endpoint for Server-Sent Events
app.get('/events', (req, res) =>
{
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const data = `data: ${ JSON.stringify({message: 'Connected to SSE'}) }\n\n`;
    res.write(data);

    const newClient = {
        id: clientId++,
        response: res
    };
    clients.push(newClient);

    req.on('close', () =>
    {
        console.log(`${ newClient.id } Connection closed`);
        clients = clients.filter(client => client.id !== newClient.id);
    });
});

// Endpoint to get Lucie's spectrum/personality
app.get('/lucie/spectrum', (req, res) =>
{
    res.json(getLucieSpectrum());
});

// Endpoint to read Lucie's code (simplified for now)
app.get('/lucie/code', (req, res) =>
{
    const filePath = req.query.path as string;
    if(!filePath)
    {
        return res.status(400).json({error: 'File path is required.'});
    }

    // Basic security: prevent path traversal
    const absolutePath = path.resolve(process.cwd(), filePath);
    if(!absolutePath.startsWith(process.cwd()))
    {
        return res.status(403).json({error: 'Access denied.'});
    }

    try
    {
        const content = readFileSync(absolutePath, 'utf-8');
        res.send(content);
    } catch(error: any)
    {
        res.status(404).json({error: `File not found or cannot be read: ${ error.message }`});
    }
});

// NEW ENDPOINT: Get Lucie's current Luciform
app.get('/lucie/current_luciform', (req, res) =>
{
    if(currentRituelContext && currentRituelContext.currentLuciform)
    {
        res.json(currentRituelContext.currentLuciform);
    } else
    {
        res.status(404).json({error: `Lucie's current Luciform not available yet.`});
    }
});

// Command handler function type
type CommandHandler = (command: string, contexte: RituelContext) => Promise<any>;

export function startServer(contexte: RituelContext, commandHandler: CommandHandler)
{
    currentRituelContext = contexte; // Store the initial context

    // NEW ENDPOINT: Execute a command
    app.post('/lucie/command', async (req, res) =>
    {
        const {command} = req.body;
        if(!command)
        {
            return res.status(400).json({error: 'Command is required.'});
        }

        try
        {
            // Use the passed-in command handler
            const result = await commandHandler(command, currentRituelContext);
            // The context is updated within handleCommand, so we just send the result
            res.json(result);
        } catch(error: any)
        {
            res.status(500).json({error: `Error processing command: ${ error.message }`});
        }
    });

    app.listen(PORT, () =>
    {
        console.log(`Lucie's server is listening on port ${ PORT }`);
        console.log(`  - GET /lucie/spectrum`);
        console.log(`  - GET /lucie/code?path=<file_path>`);
        console.log(`  - GET /lucie/current_luciform`);
        console.log(`  - POST /lucie/command { "command": "..." }`);
        console.log(`  - GET /events`);
    });
}
