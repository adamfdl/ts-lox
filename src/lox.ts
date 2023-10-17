import fs from 'fs';
import prompt from 'prompt-sync';
import { Scanner } from './scanner';
import { Token } from './token';
import { TokenType } from './token_type';
import { Parser } from './parser';
import { Expr } from './expr';
import { RuntimeError } from './runtime_error';
import { Interpreter } from './interpreter';
import { Stmt } from './stmt';

const ask = prompt();

export class Lox {
    // We make the field static so that succesive calls to `run()` inside a REPL session
    // will use the same interpreter instance.
    private static interpreter: Interpreter = new Interpreter();
    static hadError = false;
    static hadRuntimeError = false;

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

        const parser: Parser = new Parser(tokens);
        const statements: Stmt[] = parser.parse();

        // Stop if there was a syntax error
        if (this.hadError) {
            process.exit(65);
        }

        // for (const token of tokens) {
        //     console.log(token.toString());
        // }

        // console.log(new AstPrinter().print(expression));

        this.interpreter.interpret(statements);
    }

    public static runFile(path: string): void {
        const data = fs.readFileSync(path, 'utf-8');
        Lox.run(data);

        if (this.hadError || this.hadRuntimeError) process.exit(70);
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

    public static runtimeError(error: RuntimeError): void {
        console.error(error.message + '\n[line ' + error.token.line + ']');
        Lox.hadRuntimeError = true;
    }

    public static parseError(token: Token, message: string): void {
        if (token.type == TokenType.EOF) {
            this.report(token.line, ' at end', message);
        } else {
            this.report(token.line, " at '" + token.lexeme + "'", message);
        }
    }

    public static report(line: number, where: string, message: string): void {
        console.error('[line ' + line + '] Error' + where + ': ' + message);
        Lox.hadError = true;
    }
}
