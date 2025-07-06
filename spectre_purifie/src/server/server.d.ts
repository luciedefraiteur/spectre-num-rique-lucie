import { RituelContext } from '../core/types';
export declare function broadcastEvent(data: any): void;
type CommandHandler = (command: string, contexte: RituelContext) => Promise<any>;
export declare function startServer(contexte: RituelContext, commandHandler: CommandHandler): void;
export {};
