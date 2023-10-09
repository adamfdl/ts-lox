import fs from 'fs';
import prompt from 'prompt-sync';
import { Scanner } from "./scanner";

const ask = prompt();

export class Lox {
    static hadError = false;

    constructor() {
        Lox.hadError = false;
    }

    public static main(): void {
        const args = process.argv.slice(2);
        if (args.length > 1) {
            console.log('Usage: tslox [script]');
            process.exit(64);
        } else if (args.length === 1) {
            Lox.runFile(args[0]);
        } else {
            Lox.runPrompt();
        }
    }

    public static run(source: string): void {
        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();

        for (const token of tokens) {
            console.log(token.toString());
        }
    }

    public static runFile(path: string): void {
        const data = fs.readFileSync(path, 'utf-8');
        Lox.run(data);
    }

    public static runPrompt(): void {
        while (true) {
            const tokens = ask('> ');
            if (tokens === 'exit') break;
            Lox.run(tokens);
        }
    }

    public static error(line: number, message: string): void {
        this.report(line, '', message);
    }

    public static report(line: number, where: string, message: string): void {
        console.error('[line ' + line + '] Error' + where + ': ' + message);
        Lox.hadError = true;
    }
}